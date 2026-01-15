import type { BinaryNode } from '../WABinary'
import { isLidUser, isPnUser } from '../WABinary'
import type { LIDMapping } from '../Types'

/**
 * Extracts LID-PN mappings from participant nodes in group notifications.
 * Handles both cases: jid is LID with phone_number as PN, or jid is PN with lid attribute.
 */
export function extractLidMappingsFromParticipants(
	participantNodes: BinaryNode[]
): LIDMapping[] {
	const lidMappings: LIDMapping[] = []

	for (const { attrs } of participantNodes) {
		if (attrs.jid && attrs.phone_number && isLidUser(attrs.jid) && isPnUser(attrs.phone_number)) {
			lidMappings.push({ lid: attrs.jid, pn: attrs.phone_number })
		} else if (attrs.jid && attrs.lid && isPnUser(attrs.jid) && isLidUser(attrs.lid)) {
			lidMappings.push({ lid: attrs.lid, pn: attrs.jid })
		}
	}

	return lidMappings
}

/**
 * Extracts LID-PN mapping from revoked membership request participants.
 * Handles swapped parameter order by checking user types.
 */
export function extractRevokedMembershipMapping(
	affectedParticipantLid: string,
	affectedParticipantPn: string
): LIDMapping | null {
	if (isLidUser(affectedParticipantLid) && isPnUser(affectedParticipantPn)) {
		return { lid: affectedParticipantLid, pn: affectedParticipantPn }
	}
	if (isPnUser(affectedParticipantLid) && isLidUser(affectedParticipantPn)) {
		return { lid: affectedParticipantPn, pn: affectedParticipantLid }
	}
	return null
}

export type DeviceData = {
	id: string
	lid?: string
	hash?: string
}

/** Extracts device data from device notification nodes, filtering out devices without JID. */
export function extractDeviceData(deviceNodes: BinaryNode[]): DeviceData[] {
	return deviceNodes
		.filter(d => d.attrs.jid)
		.map(d => ({
			id: d.attrs.jid!,
			lid: d.attrs.lid,
			hash: d.attrs.device_hash
		}))
}

/** Returns true if participant is LID but participant_pn is missing (triggers WhatsApp Web error). */
export function shouldWarnMissingParticipantPn(
	nodeAttrs: Record<string, string | undefined>
): boolean {
	return !!(nodeAttrs.participant && isLidUser(nodeAttrs.participant) && !nodeAttrs.participant_pn)
}
