import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isAnyLidUser, isAnyPnUser, isHostedPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

export class LIDMappingStore {
	private readonly mappingCache = new LRUCache<string, string>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 7 days
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
		if (!pairs.length) return

		// First pass: validate and collect cache misses
		const validPairs: Array<{ pnUser: string; lidUser: string }> = []
		const cacheMissPnUsers: string[] = []

		for (const { lid, pn } of pairs) {
			// Determine which is actually the LID and which is the PN
			let actualLid: string
			let actualPn: string

			if (isAnyLidUser(lid) && isAnyPnUser(pn)) {
				actualLid = lid
				actualPn = pn
			} else if (isAnyPnUser(lid) && isAnyLidUser(pn)) {
				// Reversed order - swap them
				actualLid = pn
				actualPn = lid
			} else {
				this.logger.warn(`Invalid LID-PN mapping: ${lid}, ${pn}`)
				continue
			}

			const lidDecoded = jidDecode(actualLid)
			const pnDecoded = jidDecode(actualPn)

			if (!lidDecoded || !pnDecoded) continue

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user

			// Check cache first
			const cachedLidUser = this.mappingCache.get(`pn:${pnUser}`)
			if (cachedLidUser) {
				if (cachedLidUser === lidUser) {
					this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists in cache, skipping')
					continue
				}
			} else {
				cacheMissPnUsers.push(pnUser)
			}

			validPairs.push({ pnUser, lidUser })
		}

		if (!validPairs.length) return

		// Batch fetch all cache misses in a single DB call
		let storedMappings: { [key: string]: string | undefined } = {}
		if (cacheMissPnUsers.length > 0) {
			this.logger.trace(`Batch fetching ${cacheMissPnUsers.length} cache misses from database`)
			storedMappings = await this.keys.get('lid-mapping', cacheMissPnUsers)

			// Update cache with fetched values
			for (const pnUser of cacheMissPnUsers) {
				const existingLidUser = storedMappings[pnUser]
				if (existingLidUser) {
					this.mappingCache.set(`pn:${pnUser}`, existingLidUser)
					this.mappingCache.set(`lid:${existingLidUser}`, pnUser)
				}
			}
		}

		// Build final pairMap, filtering out existing mappings
		const pairMap: { [pnUser: string]: string } = {}
		for (const { pnUser, lidUser } of validPairs) {
			const existingLidUser = this.mappingCache.get(`pn:${pnUser}`) || storedMappings[pnUser]
			if (existingLidUser === lidUser) {
				this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists, skipping')
				continue
			}

			pairMap[pnUser] = lidUser
		}

		if (!Object.keys(pairMap).length) {
			this.logger.trace('No new mappings to store')
			return
		}

		this.logger.trace({ count: Object.keys(pairMap).length }, 'Storing pn mappings')

		// Single batched write inside transaction
		await this.keys.transaction(async () => {
			const batch: { [key: string]: string } = {}

			for (const [pnUser, lidUser] of Object.entries(pairMap)) {
				batch[pnUser] = lidUser
				batch[`${lidUser}_reverse`] = pnUser

				// Update cache
				this.mappingCache.set(`pn:${pnUser}`, lidUser)
				this.mappingCache.set(`lid:${lidUser}`, pnUser)
			}

			// Single DB write for all mappings
			await this.keys.set({ 'lid-mapping': batch })
		}, 'lid-mapping')
	}

	/**
	 * Get LID for PN - Returns device-specific LID based on user mapping
	 */
	async getLIDForPN(pn: string): Promise<string | null> {
		return (await this.getLIDsForPNs([pn]))?.[0]?.lid || null
	}

	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		if (!pns.length) return []

		// Store device and server info to properly construct device-specific JIDs later
		type DeviceInfo = { device: number; server: string }
		const usyncFetch: { [_: string]: DeviceInfo[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}

		// First pass: validate and collect cache hits/misses
		type PnInfo = { pn: string; pnUser: string; device: number; server: string }
		const validPns: PnInfo[] = []
		const cacheMissPnUsers: string[] = []

		for (const pn of pns) {
			if (!isAnyPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			const device = decoded.device ?? 0
			const server = decoded.server

			// Check cache first
			const cachedLidUser = this.mappingCache.get(`pn:${pnUser}`)
			if (cachedLidUser) {
				// Cache hit - build result directly
				const deviceSpecificLid = `${cachedLidUser}${device ? `:${device}` : ''}@${server === 'hosted' ? 'hosted.lid' : 'lid'}`
				this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (cache hit)`)
				successfulPairs[pn] = { lid: deviceSpecificLid, pn }
			} else {
				// Cache miss - need to fetch from DB
				if (!cacheMissPnUsers.includes(pnUser)) {
					cacheMissPnUsers.push(pnUser)
				}

				validPns.push({ pn, pnUser, device, server })
			}
		}

		// Batch fetch all cache misses in a single DB call
		let storedMappings: { [key: string]: string | undefined } = {}
		if (cacheMissPnUsers.length > 0) {
			this.logger.trace(`Batch fetching ${cacheMissPnUsers.length} LID mappings from database`)
			storedMappings = await this.keys.get('lid-mapping', cacheMissPnUsers)

			// Update cache with fetched values
			for (const pnUser of cacheMissPnUsers) {
				const lidUser = storedMappings[pnUser]
				if (lidUser) {
					this.mappingCache.set(`pn:${pnUser}`, lidUser)
					this.mappingCache.set(`lid:${lidUser}`, pnUser)
				}
			}
		}

		// Second pass: process cache misses with fetched data
		for (const { pn, pnUser, device, server } of validPns) {
			const lidUser = storedMappings[pnUser]

			if (lidUser) {
				const lidUserStr = lidUser.toString()
				if (!lidUserStr) {
					this.logger.warn(`Invalid or empty LID user for PN ${pn}: lidUser = "${lidUser}"`)
					continue
				}

				const deviceSpecificLid = `${lidUserStr}${device ? `:${device}` : ''}@${server === 'hosted' ? 'hosted.lid' : 'lid'}`
				this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (db lookup)`)
				successfulPairs[pn] = { lid: deviceSpecificLid, pn }
			} else {
				// No mapping found - queue for USync fetch
				this.logger.trace(`No LID mapping found for PN user ${pnUser}; batch getting from USync`)
				let normalizedPn = jidNormalizedUser(pn)
				if (isHostedPnUser(normalizedPn)) {
					normalizedPn = `${pnUser}@s.whatsapp.net`
				}

				const existingDevices = usyncFetch[normalizedPn]
				const deviceInfo = { device, server }
				if (!existingDevices) {
					usyncFetch[normalizedPn] = [deviceInfo]
				} else if (!existingDevices.some(d => d.device === device && d.server === server)) {
					existingDevices.push(deviceInfo)
				}
			}
		}

		// Fetch remaining from USync if needed
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

					const deviceInfos = usyncFetch[pair.pn]
					if (!deviceInfos) {
						this.logger.trace(`No device info found for USync result ${pair.pn}, skipping`)
						continue
					}

					for (const { device, server } of deviceInfos) {
						const isHosted = server === 'hosted'
						const deviceSpecificLid = `${lidUser}${device ? `:${device}` : ''}@${isHosted ? 'hosted.lid' : 'lid'}`

						this.logger.trace(
							`getLIDForPN: USYNC success for ${pair.pn} → ${deviceSpecificLid} (user mapping with device ${device})`
						)

						const deviceSpecificPn = `${pnUser}${device ? `:${device}` : ''}@${isHosted ? 'hosted' : 's.whatsapp.net'}`
						successfulPairs[deviceSpecificPn] = { lid: deviceSpecificLid, pn: deviceSpecificPn }
					}
				}
			} else {
				this.logger.warn('USync fetch yielded no results for pending PNs')
			}
		}

		return Object.values(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	/**
	 * Get PN for LID - USER LEVEL with device construction
	 */
	async getPNForLID(lid: string): Promise<string | null> {
		return (await this.getPNsForLIDs([lid]))?.[0]?.pn || null
	}

	async getPNsForLIDs(lids: string[]): Promise<LIDMapping[] | null> {
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const pending: Array<{ lid: string; lidUser: string; decoded: ReturnType<typeof jidDecode> }> = []

		const addResolvedPair = (lid: string, decoded: ReturnType<typeof jidDecode>, pnUser: string) => {
			if (!pnUser || typeof pnUser !== 'string') {
				return false
			}

			const lidDevice = decoded!.device !== undefined ? decoded!.device : 0
			const pnJid = `${pnUser}${lidDevice ? `:${lidDevice}` : ''}@${
				decoded!.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'
			}`

			this.logger.trace(`Found reverse mapping: ${lid} → ${pnJid}`)
			successfulPairs[lid] = { lid, pn: pnJid }
			return true
		}

		for (const lid of lids) {
			if (!isAnyLidUser(lid)) continue

			const decoded = jidDecode(lid)
			if (!decoded) continue

			const lidUser = decoded.user
			const cached = this.mappingCache.get(`lid:${lidUser}`)
			if (cached && typeof cached === 'string') {
				addResolvedPair(lid, decoded, cached)
				continue
			}

			pending.push({ lid, lidUser, decoded })
		}

		if (pending.length) {
			const reverseKeys = [...new Set(pending.map(item => `${item.lidUser}_reverse`))]
			const stored = await this.keys.get('lid-mapping', reverseKeys)

			for (const { lid, lidUser, decoded } of pending) {
				let pnUser = this.mappingCache.get(`lid:${lidUser}`)
				if (!pnUser || typeof pnUser !== 'string') {
					pnUser = stored[`${lidUser}_reverse`]
					if (pnUser && typeof pnUser === 'string') {
						this.mappingCache.set(`lid:${lidUser}`, pnUser)
						this.mappingCache.set(`pn:${pnUser}`, lidUser)
					}
				}

				if (pnUser && typeof pnUser === 'string') {
					addResolvedPair(lid, decoded, pnUser)
				} else {
					this.logger.trace(`No reverse mapping found for LID user: ${lidUser}`)
				}
			}
		}

		return Object.values(successfulPairs).length ? Object.values(successfulPairs) : null
	}
}
