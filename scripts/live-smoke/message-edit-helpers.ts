import type { proto, WAMessage, WAMessageKey, WAMessageUpdate } from '../../src'
import { isJidBroadcast, isJidNewsletter } from '../../src'
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

export class OriginalMessageLookup {
	private original: { id: string; message: proto.IMessage } | undefined
	private matchingLookups = 0

	record(original: WAMessage): void {
		if (!original.key.id || !original.message) {
			throw new Error('Original message is missing its key or content')
		}

		this.original = { id: original.key.id, message: original.message }
	}

	async getMessage(key: WAMessageKey): Promise<proto.IMessage | undefined> {
		if (!key.id || key.id !== this.original?.id) {
			return undefined
		}

		this.matchingLookups++
		return this.original.message
	}

	get matchingLookupCount(): number {
		return this.matchingLookups
	}
}
