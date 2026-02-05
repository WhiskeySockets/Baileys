import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isHostedPnUser, isLidUser, isPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

export class LIDMappingStore {
	private readonly mappingCache = new LRUCache<string, string>({
		ttl: 3 * 24 * 60 * 60 * 1000, // 7 days
		ttlAutopurge: true,
		updateAgeOnGet: true
	})
	private readonly keys: SignalKeyStoreWithTransaction
	private readonly logger: ILogger

	private pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>

	private readonly inflightLIDLookups = new Map<string, Promise<LIDMapping[] | null>>()
	private readonly inflightPNLookups = new Map<string, Promise<LIDMapping[] | null>>()

	constructor(
		keys: SignalKeyStoreWithTransaction,
		logger: ILogger,
		pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>
	) {
		this.keys = keys
		this.pnToLIDFunc = pnToLIDFunc
		this.logger = logger
	}

	async storeLIDPNMappings(pairs: LIDMapping[]): Promise<void> {
		if (pairs.length === 0) return

		const validatedPairs: Array<{ pnUser: string; lidUser: string }> = []
		for (const { lid, pn } of pairs) {
			if (!((isLidUser(lid) && isPnUser(pn)) || (isPnUser(lid) && isLidUser(pn)))) {
				this.logger.warn(`Invalid LID-PN mapping: ${lid}, ${pn}`)
				continue
			}

			const lidDecoded = jidDecode(lid)
			const pnDecoded = jidDecode(pn)
			if (!lidDecoded || !pnDecoded) continue

			validatedPairs.push({ pnUser: pnDecoded.user, lidUser: lidDecoded.user })
		}

		if (validatedPairs.length === 0) return

		const cacheMissSet = new Set<string>()
		const existingMappings = new Map<string, string>()

		for (const { pnUser } of validatedPairs) {
			const cached = this.mappingCache.get(`pn:${pnUser}`)
			if (cached) {
				existingMappings.set(pnUser, cached)
			} else {
				cacheMissSet.add(pnUser)
			}
		}

		if (cacheMissSet.size > 0) {
			const cacheMisses = [...cacheMissSet]
			this.logger.trace(`Batch fetching ${cacheMisses.length} LID mappings from database`)
			const stored = await this.keys.get('lid-mapping', cacheMisses)

			for (const pnUser of cacheMisses) {
				const existingLidUser = stored[pnUser]
				if (existingLidUser) {
					existingMappings.set(pnUser, existingLidUser)
					this.mappingCache.set(`pn:${pnUser}`, existingLidUser)
					this.mappingCache.set(`lid:${existingLidUser}`, pnUser)
				}
			}
		}

		const pairMap: { [_: string]: string } = {}
		for (const { pnUser, lidUser } of validatedPairs) {
			const existingLidUser = existingMappings.get(pnUser)
			if (existingLidUser === lidUser) {
				this.logger.debug({ pnUser, lidUser }, 'LID mapping already exists, skipping')
				continue
			}

			pairMap[pnUser] = lidUser
		}

		if (Object.keys(pairMap).length === 0) return

		this.logger.trace({ pairMap }, `Storing ${Object.keys(pairMap).length} pn mappings`)

		const batchData: { [key: string]: string } = {}
		for (const [pnUser, lidUser] of Object.entries(pairMap)) {
			batchData[pnUser] = lidUser
			batchData[`${lidUser}_reverse`] = pnUser
		}

		await this.keys.transaction(async () => {
			await this.keys.set({ 'lid-mapping': batchData })
		}, 'lid-mapping')

		// Update cache after successful DB write
		for (const [pnUser, lidUser] of Object.entries(pairMap)) {
			this.mappingCache.set(`pn:${pnUser}`, lidUser)
			this.mappingCache.set(`lid:${lidUser}`, pnUser)
		}
	}

	async getLIDForPN(pn: string): Promise<string | null> {
		return (await this.getLIDsForPNs([pn]))?.[0]?.lid || null
	}

	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		if (pns.length === 0) return null

		const sortedPns = [...new Set(pns)].sort()
		const cacheKey = sortedPns.join(',')

		const inflight = this.inflightLIDLookups.get(cacheKey)
		if (inflight) {
			this.logger.trace(`Coalescing getLIDsForPNs request for ${sortedPns.length} PNs`)
			return inflight
		}

		const promise = this._getLIDsForPNsImpl(pns)
		this.inflightLIDLookups.set(cacheKey, promise)

		try {
			return await promise
		} finally {
			this.inflightLIDLookups.delete(cacheKey)
		}
	}

	private async _getLIDsForPNsImpl(pns: string[]): Promise<LIDMapping[] | null> {
		const usyncFetch: { [_: string]: number[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const pending: Array<{ pn: string; pnUser: string; decoded: ReturnType<typeof jidDecode> }> = []

		const addResolvedPair = (pn: string, decoded: ReturnType<typeof jidDecode>, lidUser: string) => {
			const normalizedLidUser = lidUser.toString()
			if (!normalizedLidUser) {
				this.logger.warn(`Invalid or empty LID user for PN ${pn}: lidUser = "${lidUser}"`)
				return false
			}

			// Push the PN device ID to the LID to maintain device separation
			const pnDevice = decoded!.device !== undefined ? decoded!.device : 0
			const deviceSpecificLid = `${normalizedLidUser}${!!pnDevice ? `:${pnDevice}` : ``}@${
				decoded!.server === 'hosted' ? 'hosted.lid' : 'lid'
			}`

			this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (user mapping with device ${pnDevice})`)
			successfulPairs[pn] = { lid: deviceSpecificLid, pn }
			return true
		}

		for (const pn of pns) {
			if (!isPnUser(pn) && !isHostedPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			const cached = this.mappingCache.get(`pn:${pnUser}`)
			if (cached && typeof cached === 'string') {
				if (!addResolvedPair(pn, decoded, cached)) {
					this.logger.warn(`Invalid entry for ${pn} (pair not resolved)`)
					continue
				}

				continue
			}

			pending.push({ pn, pnUser, decoded })
		}

		if (pending.length) {
			const pnUsers = [...new Set(pending.map(item => item.pnUser))]
			const stored = await this.keys.get('lid-mapping', pnUsers)
			for (const pnUser of pnUsers) {
				const lidUser = stored[pnUser]
				if (lidUser && typeof lidUser === 'string') {
					this.mappingCache.set(`pn:${pnUser}`, lidUser)
					this.mappingCache.set(`lid:${lidUser}`, pnUser)
				}
			}

			for (const { pn, pnUser, decoded } of pending) {
				const cached = this.mappingCache.get(`pn:${pnUser}`)
				if (cached && typeof cached === 'string') {
					if (!addResolvedPair(pn, decoded, cached)) {
						this.logger.warn(`Invalid entry for ${pn} (pair not resolved)`)
						continue
					}
				} else {
					this.logger.trace(`No LID mapping found for PN user ${pnUser}; batch getting from USync`)
					const device = decoded!.device || 0
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

		if (Object.keys(usyncFetch).length > 0) {
			const result = await this.pnToLIDFunc?.(Object.keys(usyncFetch)) // this function already adds LIDs to mapping
			if (result && result.length > 0) {
				await this.storeLIDPNMappings(result)
				for (const pair of result) {
					const pnDecoded = jidDecode(pair.pn)
					const pnUser = pnDecoded?.user
					if (!pnUser) continue
					const lidUser = jidDecode(pair.lid)?.user
					if (!lidUser) continue

					for (const device of usyncFetch[pair.pn]!) {
						const deviceSpecificLid = `${lidUser}${!!device ? `:${device}` : ``}@${device === 99 ? 'hosted.lid' : 'lid'}`

						this.logger.trace(
							`getLIDForPN: USYNC success for ${pair.pn} → ${deviceSpecificLid} (user mapping with device ${device})`
						)

						const deviceSpecificPn = `${pnUser}${!!device ? `:${device}` : ``}@${device === 99 ? 'hosted' : 's.whatsapp.net'}`

						successfulPairs[deviceSpecificPn] = { lid: deviceSpecificLid, pn: deviceSpecificPn }
					}
				}
			} else {
				this.logger.warn('USync fetch yielded no results for pending PNs')
			}
		}

		return Object.values(successfulPairs).length > 0 ? Object.values(successfulPairs) : null
	}

	async getPNForLID(lid: string): Promise<string | null> {
		return (await this.getPNsForLIDs([lid]))?.[0]?.pn || null
	}

	async getPNsForLIDs(lids: string[]): Promise<LIDMapping[] | null> {
		if (lids.length === 0) return null

		const sortedLids = [...new Set(lids)].sort()
		const cacheKey = sortedLids.join(',')

		const inflight = this.inflightPNLookups.get(cacheKey)
		if (inflight) {
			this.logger.trace(`Coalescing getPNsForLIDs request for ${sortedLids.length} LIDs`)
			return inflight
		}

		const promise = this._getPNsForLIDsImpl(lids)
		this.inflightPNLookups.set(cacheKey, promise)

		try {
			return await promise
		} finally {
			this.inflightPNLookups.delete(cacheKey)
		}
	}

	private async _getPNsForLIDsImpl(lids: string[]): Promise<LIDMapping[] | null> {
		const successfulPairs: { [_: string]: LIDMapping } = {}
		const pending: Array<{ lid: string; lidUser: string; decoded: ReturnType<typeof jidDecode> }> = []

		const addResolvedPair = (lid: string, decoded: ReturnType<typeof jidDecode>, pnUser: string) => {
			if (!pnUser || typeof pnUser !== 'string') {
				return false
			}

			const lidDevice = decoded!.device !== undefined ? decoded!.device : 0
			const pnJid = `${pnUser}:${lidDevice}@${
				decoded!.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'
			}`

			this.logger.trace(`Found reverse mapping: ${lid} → ${pnJid}`)
			successfulPairs[lid] = { lid, pn: pnJid }
			return true
		}

		for (const lid of lids) {
			if (!isLidUser(lid)) continue

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
