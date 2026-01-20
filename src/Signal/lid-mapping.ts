import { LRUCache } from 'lru-cache'
import type { LIDMapping, SignalKeyStoreWithTransaction } from '../Types'
import type { ILogger } from '../Utils/logger'
import { isHostedPnUser, isLidUser, isPnUser, jidDecode, jidNormalizedUser, WAJIDDomains } from '../WABinary'

export class LIDMappingStore {
	private readonly mappingCache?: LRUCache<string, string>
	private readonly keys: SignalKeyStoreWithTransaction
	private readonly logger: ILogger
	private readonly enableCache: boolean

	private pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>

	constructor(
		keys: SignalKeyStoreWithTransaction,
		logger: ILogger,
		pnToLIDFunc?: (jids: string[]) => Promise<LIDMapping[] | undefined>,
		enableCache = true
	) {
		this.keys = keys
		this.pnToLIDFunc = pnToLIDFunc
		this.logger = logger
		this.enableCache = enableCache

		if (enableCache) {
			this.mappingCache = new LRUCache<string, string>({
				ttl: 3 * 24 * 60 * 60 * 1000, // 7 days
				ttlAutopurge: true,
				updateAgeOnGet: true
			})
		}
	}

	async storeLIDPNMappings(pairs: LIDMapping[]): Promise<void> {
		const pairMap: { [_: string]: string } = {}
		for (const { lid, pn } of pairs) {
			if (!((isLidUser(lid) && isPnUser(pn)) || (isPnUser(lid) && isLidUser(pn)))) {
				this.logger.warn(`Invalid LID-PN mapping: ${lid}, ${pn}`)
				continue
			}

			const lidDecoded = jidDecode(lid)
			const pnDecoded = jidDecode(pn)

			if (!lidDecoded || !pnDecoded) return

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user

			let existingLidUser: string | undefined

			if (this.enableCache && this.mappingCache) {
				existingLidUser = this.mappingCache.get(`pn:${pnUser}`)
			}

			if (!existingLidUser) {
				this.enableCache && this.logger.trace(`Cache miss for PN user ${pnUser}; checking database`)
				const stored = await this.keys.get('lid-mapping', [pnUser])
				existingLidUser = stored[pnUser]
				if (existingLidUser && this.enableCache && this.mappingCache) {
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

				if (this.enableCache && this.mappingCache) {
					this.mappingCache.set(`pn:${pnUser}`, lidUser)
					this.mappingCache.set(`lid:${lidUser}`, pnUser)
				}
			}
		}, 'lid-mapping')
	}

	async getLIDForPN(pn: string): Promise<string | null> {
		return (await this.getLIDsForPNs([pn]))?.[0]?.lid || null
	}

	async getLIDsForPNs(pns: string[]): Promise<LIDMapping[] | null> {
		const usyncFetch: { [_: string]: number[] } = {}
		const successfulPairs: { [_: string]: LIDMapping } = {}

		for (const pn of pns) {
			if (!isPnUser(pn) && !isHostedPnUser(pn)) continue

			const decoded = jidDecode(pn)
			if (!decoded) continue

			const pnUser = decoded.user
			let lidUser: string | undefined | null

			if (this.enableCache && this.mappingCache) {
				lidUser = this.mappingCache.get(`pn:${pnUser}`)
			}

			if (!lidUser) {
				const stored = await this.keys.get('lid-mapping', [pnUser])
				lidUser = stored[pnUser]

				if (lidUser) {
					if (this.enableCache && this.mappingCache) {
						this.mappingCache.set(`pn:${pnUser}`, lidUser)
						this.mappingCache.set(`lid:${lidUser}`, pnUser)
					}
				} else {
					this.logger.trace(`No LID mapping found for PN user ${pnUser}; batch getting from USync`)
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

					continue
				}
			}

			lidUser = lidUser!.toString()
			if (!lidUser) {
				this.logger.warn(`Invalid or empty LID user for PN ${pn}: lidUser = "${lidUser}"`)
				return null
			}

			const pnDevice = decoded.device !== undefined ? decoded.device : 0
			const deviceSpecificLid = `${lidUser}${!!pnDevice ? `:${pnDevice}` : ``}@${decoded.server === 'hosted' ? 'hosted.lid' : 'lid'}`

			this.logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (user mapping with device ${pnDevice})`)
			successfulPairs[pn] = { lid: deviceSpecificLid, pn }
		}

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
						const deviceSpecificLid = `${lidUser}${!!device ? `:${device}` : ``}@${device === 99 ? 'hosted.lid' : 'lid'}`
						this.logger.trace(
							`getLIDForPN: USYNC success for ${pair.pn} → ${deviceSpecificLid} (user mapping with device ${device})`
						)
						const deviceSpecificPn = `${pnUser}${!!device ? `:${device}` : ``}@${device === 99 ? 'hosted' : 's.whatsapp.net'}`
						successfulPairs[deviceSpecificPn] = { lid: deviceSpecificLid, pn: deviceSpecificPn }
					}
				}
			} else {
				return null
			}
		}

		return Object.values(successfulPairs)
	}

	async getPNForLID(lid: string): Promise<string | null> {
		if (!isLidUser(lid)) return null

		const decoded = jidDecode(lid)
		if (!decoded) return null

		const lidUser = decoded.user
		let pnUser: string | undefined | null

		if (this.enableCache && this.mappingCache) {
			pnUser = this.mappingCache.get(`lid:${lidUser}`)
		}

		if (!pnUser || typeof pnUser !== 'string') {
			const stored = await this.keys.get('lid-mapping', [`${lidUser}_reverse`])
			pnUser = stored[`${lidUser}_reverse`]

			if (!pnUser || typeof pnUser !== 'string') {
				this.logger.trace(`No reverse mapping found for LID user: ${lidUser}`)
				return null
			}

			if (this.enableCache && this.mappingCache) {
				this.mappingCache.set(`lid:${lidUser}`, pnUser)
			}
		}

		const lidDevice = decoded.device !== undefined ? decoded.device : 0
		const pnJid = `${pnUser}:${lidDevice}@${decoded.domainType === WAJIDDomains.HOSTED_LID ? 'hosted' : 's.whatsapp.net'}`

		this.logger.trace(`Found reverse mapping: ${lid} → ${pnJid}`)
		return pnJid
	}
}
