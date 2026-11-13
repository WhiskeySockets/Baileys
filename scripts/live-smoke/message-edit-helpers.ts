import type { proto, WAMessage, WAMessageKey, WAMessageUpdate } from '../../src'
import { isJidBroadcast, isJidGroup, isJidNewsletter, jidNormalizedUser } from '../../src'
import { normalizeMessageContent } from '../../src/Utils/messages'

export interface MessageUpsert {
	messages: WAMessage[]
	type: 'append' | 'notify'
}

export const extractText = (message: proto.IMessage | null | undefined): string | undefined => {
	const content = normalizeMessageContent(message)
	if (typeof content?.conversation === 'string') {
		return content.conversation
	}

	return typeof content?.extendedTextMessage?.text === 'string' ? content.extendedTextMessage.text : undefined
}

const isSupportedIncomingMessage = (message: WAMessage): boolean => {
	const remoteJid = message.key.remoteJid
	return !!remoteJid && !message.key.fromMe && !isJidBroadcast(remoteJid) && !isJidNewsletter(remoteJid)
}

export const findOriginalMessage = (upsert: MessageUpsert, expectedText: string): WAMessage | undefined => {
	if (upsert.type !== 'notify') {
		return undefined
	}

	return upsert.messages.find(
		message => isSupportedIncomingMessage(message) && !!message.key.id && extractText(message.message) === expectedText
	)
}

export const hasUsableMessageSecret = (message: WAMessage): boolean => {
	const secret = message.message?.messageContextInfo?.messageSecret
	return secret instanceof Uint8Array && secret.byteLength === 32
}

export const extractEditedText = (update: WAMessageUpdate, originalMessageId: string): string | undefined => {
	if (update.key.id !== originalMessageId) {
		return undefined
	}

	return extractText(update.update.message?.editedMessage?.message)
}

const matchesRecordedJid = (
	requested: string | null | undefined,
	recorded: string | null | undefined,
	recordedAlt: string | null | undefined
): boolean => {
	const normalized = jidNormalizedUser(requested ?? undefined)
	// Only aliases captured with the original establish identity; requested aliases are untrusted.
	return !!normalized && [recorded, recordedAlt].some(jid => jidNormalizedUser(jid ?? undefined) === normalized)
}

export class OriginalMessageLookup {
	private original: { key: WAMessageKey; message: proto.IMessage } | undefined
	private matchingLookups = 0

	record(original: WAMessage): void {
		if (!original.key.id || !original.message) {
			throw new Error('Original message is missing its key or content')
		}

		this.original = { key: { ...original.key }, message: original.message }
	}

	async getMessage(key: WAMessageKey): Promise<proto.IMessage | undefined> {
		const original = this.original
		if (
			!original ||
			!key.id ||
			key.id !== original.key.id ||
			typeof key.fromMe !== 'boolean' ||
			key.fromMe !== original.key.fromMe ||
			!matchesRecordedJid(key.remoteJid, original.key.remoteJid, original.key.remoteJidAlt) ||
			(isJidGroup(original.key.remoteJid ?? undefined) &&
				!matchesRecordedJid(key.participant, original.key.participant, original.key.participantAlt))
		) {
			return undefined
		}

		this.matchingLookups++
		return original.message
	}

	get matchingLookupCount(): number {
		return this.matchingLookups
	}
}
