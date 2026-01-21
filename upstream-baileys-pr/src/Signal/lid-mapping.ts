import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isHostedLidUser, isHostedPnUser, isLidUser, isPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

export class LIDMappingStore {
	private readonly mappingCache = new LRUCache<string, string>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 3 days
		ttlAutopurge: true,
		updateAgeOnGet: true
	})
	private readonly keys: SignalKeyStoreWithTransaction
	private readonly logger: ILogger

	private pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>

	constructor(
		keys: SignalKeyStoreWithTransaction,
		logger: ILogger,
		pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>
	) {
		this.keys = keys
		this.pnToLIDFunc = pnToLIDFunc
		this.logger = logger
	}

	/**
	 * Store LID-PN mapping - USER LEVEL
	 */
	async storeLIDPNMappings(pairs: LIDMapping[]): Promise<void> {
		// Validate inputs
		const pairMap: { [_: string]: string } = {}
		for (const { lid, pn } of pairs) {
			if (!((isLidUser(lid) && isPnUser(pn)) || (isPnUser(lid) && isLidUser(pn)))) {
				this.logger.warn(`Invalid LID-PN mapping: ${lid}, ${pn}`)
				continue
			}

			const lidDecoded = jidDecode(lid)
			const pnDecoded = jidDecode(pn)

			// FIX: Use continue instead of return to avoid exiting entire batch
			// Previously used 'return' which would exit the entire function on first invalid decode
			if (!lidDecoded || !pnDecoded) continue

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user

			let existingLidUser = this.mappingCache.get(`pn:${pnUser}`)
			if (!existingLidUser) {
				this.logger.trace(`Cache miss for PN user ${pnUser}; checking database`)
				const stored = await this.keys.get('lid-mapping', [pnUser])
				existingLidUser = stored[pnUser]
				if (existingLidUser) {
					// Update cache with database value
					this.mappingCache.set(`pn:${pnUser}`, existingLidUser)
					this.mappingCache.set(`lid:${existingLidUser}`, pnUser)
				}
			}

			if (existingLidUser === lidUser) {
				this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists, skipping')
				continue
			}

			pairMap[pnUser] = lidUser
		}

		this.logger.trace({ pairMap }, `Storing ${Object.keys(pairMap).length} pn mappings`)

		await this.keys.transaction(async () => {
			for (const [pnUser, lidUser] of Object.entries(pairMap)) {
				await this.keys.set({
					'lid-mapping': {
						[pnUser]: lidUser,
						[`${lidUser}_reverse`]: pnUser
					}
				})

				this.mappingCache.set(`pn:${pnUser}`, lidUser)
				this.mappingCache.set(`lid:${lidUser}`, pnUser)
			}
		}, 'lid-mapping')
	}

	/**
	 * Get LID for PN - Returns device-specific LID based on user mapping
	 */
	async getLIDForPN(pn: string): Promise<string | null> {
		return (await this.getLIDsForPNs([pn]))?.[0]?.lid || null
	}

	/**
	 * Get LIDs for multiple PNs - Optimized with batch database queries
	 *
	 * Uses "Pending Queue" pattern: Groups cache misses and fetches them
	 * from the database in a single batch query.
	 *
	 * Performance: Reduces database round-trips from O(N) to O(1)
	 */
	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		const usyncFetch: { [_: string]: number[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const pendingByPnUser = new Map<string, Array<{ pn: string; decoded: ReturnType<typeof jidDecode> }>>()

		// First pass: check cache and collect pending lookups
		for (const pn of pns) {
			if (!isPnUser(pn) && !isHostedPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			const cachedLidUser = this.mappingCache.get(`pn:${pnUser}`)

			if (cachedLidUser) {
				// Cache hit - build result immediately
				const lidUser = cachedLidUser.toString()
				if (!lidUser) {
					this.logger.warn(`Invalid or empty LID user for PN ${pn}`)
					continue
				}

				const pnDevice = decoded.device ?? 0
				const deviceSpecificLid = `${lidUser}${pnDevice ? `:${pnDevice}` : ''}@${decoded.server === 'hosted' ? 'hosted.lid' : 'lid'}`

				this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (cache hit)`)
				successfulPairs[pn] = { lid: deviceSpecificLid, pn }
				continue
			}

			// Cache miss - queue for batch lookup
			const pendingForUser = pendingByPnUser.get(pnUser) ?? []
			pendingForUser.push({ pn, decoded })
			pendingByPnUser.set(pnUser, pendingForUser)
		}

		// Second pass: batch database lookup for cache misses
		if (pendingByPnUser.size > 0) {
			const pnUsers = [...pendingByPnUser.keys()]

			try {
				const stored = await this.keys.get('lid-mapping', pnUsers)

				for (const pnUser of pnUsers) {
					const lidUser = stored[pnUser]
					if (lidUser) {
						this.mappingCache.set(`pn:${pnUser}`, lidUser)
						this.mappingCache.set(`lid:${lidUser}`, pnUser)
					}
				}
			} catch (error) {
				this.logger.error({ error }, 'Failed to get LID mapping batch from database')
			}

			// Process pending items with updated cache
			for (const [pnUser, items] of pendingByPnUser.entries()) {
				const lidUser = this.mappingCache.get(`pn:${pnUser}`)

				for (const { pn, decoded } of items) {
					if (lidUser && decoded) {
						const lidUserString = lidUser.toString()
						if (!lidUserString) {
							this.logger.warn(`Invalid or empty LID user for PN ${pn}`)
							continue
						}

						const pnDevice = decoded.device ?? 0
						const deviceSpecificLid = `${lidUserString}${pnDevice ? `:${pnDevice}` : ''}@${decoded.server === 'hosted' ? 'hosted.lid' : 'lid'}`

						this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (db hit)`)
						successfulPairs[pn] = { lid: deviceSpecificLid, pn }
						continue
					}

					if (!decoded) continue

					// Need to fetch from USync
					this.logger.trace(`No LID mapping found for PN user ${pnUser}; queuing for USync`)

					const device = decoded.device || 0
					let normalizedPn = jidNormalizedUser(pn)
					if (isHostedPnUser(normalizedPn)) {
						normalizedPn = `${pnUser}@s.whatsapp.net`
					}

					if (!usyncFetch[normalizedPn]) {
						usyncFetch[normalizedPn] = [device]
					} else {
						usyncFetch[normalizedPn]?.push(device)
					}
				}
			}
		}

		// Fetch from USync if needed
		if (Object.keys(usyncFetch).length > 0) {
			const result = await this.pnToLIDFunc?.(Object.keys(usyncFetch))
			if (result && result.length > 0) {
				await this.storeLIDPNMappings(result)
				for (const pair of result) {
					const pnDecoded = jidDecode(pair.pn)
					const pnUser = pnDecoded?.user
					if (!pnUser) continue
					const lidUser = jidDecode(pair.lid)?.user
					if (!lidUser) continue

					for (const device of usyncFetch[pair.pn]!) {
						const deviceSpecificLid = `${lidUser}${device ? `:${device}` : ''}@${device === 99 ? 'hosted.lid' : 'lid'}`
						const deviceSpecificPn = `${pnUser}${device ? `:${device}` : ''}@${device === 99 ? 'hosted' : 's.whatsapp.net'}`

						this.logger.trace(`getLIDForPN: USYNC success for ${pair.pn} → ${deviceSpecificLid}`)
						successfulPairs[deviceSpecificPn] = { lid: deviceSpecificLid, pn: deviceSpecificPn }
					}
				}
			}
		}

		return Object.keys(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	/**
	 * Get PN for LID - Delegates to batch method for single lookup
	 */
	async getPNForLID(lid: string): Promise<string | null> {
		const results = await this.getPNsForLIDs([lid])
		return results?.[0]?.pn || null
	}

	/**
	 * Get PNs for multiple LIDs - Optimized batch reverse lookup
	 *
	 * NEW METHOD: Batch reverse lookup (LID → PN) with:
	 * - Cache-first lookup strategy
	 * - Batch database queries (reduces O(N) to O(1) round-trips)
	 * - Proper device-specific JID construction
	 */
	async getPNsForLIDs(lids: string[]): Promise<LIDMapping[] | null> {
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const pendingByLidUser = new Map<string, Array<{ lid: string; decoded: ReturnType<typeof jidDecode> }>>()

		const addResolvedPair = (lid: string, decoded: ReturnType<typeof jidDecode>, pnUser: string): void => {
			const lidDevice = decoded?.device ?? 0
			const server = decoded?.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'
			const pnJid = `${pnUser}${lidDevice ? `:${lidDevice}` : ''}@${server}`

			this.logger.trace(`Found reverse mapping: ${lid} → ${pnJid}`)
			successfulPairs[lid] = { lid, pn: pnJid }
		}

		// First pass: check cache and collect pending lookups
		for (const lid of lids) {
			if (!isLidUser(lid) && !isHostedLidUser(lid)) continue

			const decoded = jidDecode(lid)
			if (!decoded) continue

			const lidUser = decoded.user
			const cachedPnUser = this.mappingCache.get(`lid:${lidUser}`)

			if (cachedPnUser && typeof cachedPnUser === 'string') {
				// Cache hit
				addResolvedPair(lid, decoded, cachedPnUser)
				continue
			}

			// Cache miss - queue for batch lookup
			const pendingForUser = pendingByLidUser.get(lidUser) ?? []
			pendingForUser.push({ lid, decoded })
			pendingByLidUser.set(lidUser, pendingForUser)
		}

		// Second pass: batch database lookup for cache misses
		if (pendingByLidUser.size > 0) {
			const reverseKeys = [...pendingByLidUser.keys()].map(lidUser => `${lidUser}_reverse`)

			try {
				const stored = await this.keys.get('lid-mapping', reverseKeys)

				for (const reverseKey of reverseKeys) {
					const lidUser = reverseKey.replace(/_reverse$/, '')
					const pnUser = stored[reverseKey]
					if (pnUser && typeof pnUser === 'string') {
						this.mappingCache.set(`lid:${lidUser}`, pnUser)
						this.mappingCache.set(`pn:${pnUser}`, lidUser)
					}
				}
			} catch (error) {
				this.logger.error({ error }, 'Failed to get PN mapping batch from database')
			}

			// Process pending items with updated cache
			for (const [lidUser, items] of pendingByLidUser.entries()) {
				const pnUser = this.mappingCache.get(`lid:${lidUser}`)

				for (const { lid, decoded } of items) {
					if (pnUser && typeof pnUser === 'string') {
						addResolvedPair(lid, decoded, pnUser)
						continue
					}

					this.logger.trace(`No reverse mapping found for LID user: ${lidUser}`)
				}
			}
		}

		return Object.keys(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}
}
