import type { LIDMapping, WAMessageKey } from '../Types'
import { jidDecode } from '../WABinary'

export type AltJidMappingResult = {
	mapping: LIDMapping
	migrateFrom: string
	migrateTo: string
}

export function extractAltJidMapping(key: WAMessageKey): AltJidMappingResult | null {
	const alt = key.participantAlt || key.remoteJidAlt
	if (!alt) {
		return null
	}

	const primaryJid = key.participant || key.remoteJid
	if (!primaryJid) {
		return null
	}

	const altServer = jidDecode(alt)?.server
	const isAltLid = altServer === 'lid'

	return {
		mapping: isAltLid
			? { lid: alt, pn: primaryJid }
			: { lid: primaryJid, pn: alt },
		migrateFrom: isAltLid ? primaryJid : alt,
		migrateTo: isAltLid ? alt : primaryJid
	}
}
