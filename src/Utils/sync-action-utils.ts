import { proto } from '../../WAProto/index.js'
import type { BaileysEventEmitter, BaileysEventMap, Contact } from '../Types'
import { isLidUser, isPnUser } from '../WABinary'
import type { ILogger } from './logger'

export type ContactsUpsertResult = {
	event: 'contacts.upsert'
	data: Contact[]
}

export type LidMappingUpdateResult = {
	event: 'lid-mapping.update'
	data: BaileysEventMap['lid-mapping.update']
}

export type SyncActionResult = ContactsUpsertResult | LidMappingUpdateResult

/**
 * Process contactAction and return events to emit.
 * Pure function - no side effects.
 */
export const processContactAction = (
	action: proto.SyncActionValue.IContactAction,
	id: string | undefined,
	logger?: ILogger
): SyncActionResult[] => {
	const results: SyncActionResult[] = []

	if (!id) {
		logger?.warn(
			{ hasFullName: !!action.fullName, hasLidJid: !!action.lidJid, hasPnJid: !!action.pnJid },
			'contactAction sync: missing id in index'
		)
		return results
	}

	const lidJid = action.lidJid
	const idIsPn = isPnUser(id)
	// PN is in index[1], not in contactAction.pnJid which is usually null
	const phoneNumber = idIsPn ? id : action.pnJid || undefined

	// Always emit contacts.upsert
	results.push({
		event: 'contacts.upsert',
		data: [
			{
				id,
				name: action.fullName || action.firstName || action.username || undefined,
				lid: lidJid || undefined,
				phoneNumber
			}
		]
	})

	// Emit lid-mapping.update if we have valid LID-PN pair
	if (lidJid && isLidUser(lidJid) && idIsPn) {
		results.push({
			event: 'lid-mapping.update',
			data: { lid: lidJid, pn: id }
		})
	}

	return results
}

export const emitSyncActionResults = (ev: BaileysEventEmitter, results: SyncActionResult[]): void => {
	for (const result of results) {
		if (result.event === 'contacts.upsert') {
			ev.emit('contacts.upsert', result.data)
		} else {
			ev.emit('lid-mapping.update', result.data)
		}
	}
}
