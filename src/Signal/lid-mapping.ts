import type { SignalKeyStoreWithTransaction } from '../Types'
import logger from '../Utils/logger'
import { isLidUser, isPnUser, jidDecode } from '../WABinary'

//TODO: Caching
export class LIDMappingStore {
	private readonly keys: SignalKeyStoreWithTransaction
	private onWhatsAppFunc?: (...jids: string[]) => Promise<
		| {
				jid: string
				exists: boolean
				lid: string
		  }[]
		| undefined
	>

	constructor(
		keys: SignalKeyStoreWithTransaction,
		onWhatsAppFunc?: (...jids: string[]) => Promise<
			| {
					jid: string
					exists: boolean
					lid: string
			  }[]
			| undefined
		>
	) {
		this.keys = keys
		this.onWhatsAppFunc = onWhatsAppFunc // needed to get LID from PN if not found
	}

	/**
	 * Store LID-PN mapping - USER LEVEL
	 */
	async storeLIDPNMapping(lid: string, pn: string): Promise<void> {
		return this.storeLIDPNMappings([{ lid, pn }])
	}

	/**
	 * Store LID-PN mapping - USER LEVEL
	 */
	async storeLIDPNMappings(pairs: { lid: string; pn: string }[]): Promise<void> {
		// Validate inputs
		const pairMap: { [_: string]: string } = {}
		for (const { lid, pn } of pairs) {
			if (!((isLidUser(lid) && isPnUser(pn)) || (isPnUser(lid) && isLidUser(pn)))) {
				logger.warn(`Invalid LID-PN mapping: ${lid}, ${pn}`)
				continue
			}

			const [lidJid, pnJid] = isLidUser(lid) ? [lid, pn] : [pn, lid]

			const lidDecoded = jidDecode(lidJid)
			const pnDecoded = jidDecode(pnJid)

			if (!lidDecoded || !pnDecoded) return

			const pnUser = pnDecoded.user
			const lidUser = lidDecoded.user
			pairMap[pnUser] = lidUser
		}

		logger.trace({ pairMap }, `Storing ${Object.keys(pairMap).length} pn mappings`)

		await this.keys.transaction(async () => {
			for (const [pnUser, lidUser] of Object.entries(pairMap)) {
				await this.keys.set({
					'lid-mapping': {
						[pnUser]: lidUser, // "554396160286" -> "102765716062358"
						[`${lidUser}_reverse`]: pnUser // "102765716062358_reverse" -> "554396160286"
					}
				})
			}
		}, 'lid-mapping')
	}

	/**
	 * Get LID for PN - Returns device-specific LID based on user mapping
	 */
	async getLIDForPN(pn: string): Promise<string | null> {
		if (!isPnUser(pn)) return null

		const decoded = jidDecode(pn)
		if (!decoded) return null

		// Look up user-level mapping (whatsmeow approach)
		const pnUser = decoded.user
		const stored = await this.keys.get('lid-mapping', [pnUser])
		let lidUser = stored[pnUser]

		if (!lidUser) {
			logger.trace(`No LID mapping found for PN user ${pnUser}; getting from USync`)
			const { exists, lid } = (await this.onWhatsAppFunc?.(pn))?.[0]!
			if (exists) {
				lidUser = jidDecode(lid)?.user
			} else {
				return null
			}
		}

		if (typeof lidUser !== 'string') return null

		// Push the PN device ID to the LID to maintain device separation
		const pnDevice = decoded.device !== undefined ? decoded.device : 0
		const deviceSpecificLid = `${lidUser}:${pnDevice}@lid`

		logger.trace(`getLIDForPN: ${pn} → ${deviceSpecificLid} (user mapping with device ${pnDevice})`)
		return deviceSpecificLid
	}

	/**
	 * Get PN for LID - USER LEVEL with device construction
	 */
	async getPNForLID(lid: string): Promise<string | null> {
		if (!isLidUser(lid)) return null

		const decoded = jidDecode(lid)
		if (!decoded) return null

		// Look up reverse user mapping
		const lidUser = decoded.user
		const stored = await this.keys.get('lid-mapping', [`${lidUser}_reverse`])
		const pnUser = stored[`${lidUser}_reverse`]

		if (!pnUser || typeof pnUser !== 'string') {
			logger.trace(`No reverse mapping found for LID user: ${lidUser}`)
			return null
		}

		// Construct device-specific PN JID
		const lidDevice = decoded.device !== undefined ? decoded.device : 0
		const pnJid = `${pnUser}:${lidDevice}@s.whatsapp.net`

		logger.trace(`Found reverse mapping: ${lid} → ${pnJid}`)
		return pnJid
	}
}
