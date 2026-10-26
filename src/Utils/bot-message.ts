import { randomBytes } from 'crypto'
import { proto } from '../../WAProto/index.js'
import { type BinaryNode, getBinaryNodeChild, jidNormalizedUser } from '../WABinary'
import { aesDecryptGCM, hkdf } from './crypto'

const META_AI_PERSONA_ID = '867051314767696$760019659443059'
const MUSE_JID = '1807055946647697@bot'
const MUSE_PERSONA_ID = '1807055946647697$1'

/**
 * Give a message for a native bot what the bot's reply depends on: a 32-byte
 * messageSecret, which the reply is encrypted with, and the bot's default persona
 * when none is set. Mutates the message, so the copy the app stores (and later
 * returns from getMessage) keeps the secret.
 */
export const prepareMessageForBot = (message: proto.IMessage, botJid: string) => {
	const context = (message.messageContextInfo ||= {})
	if (!context.messageSecret?.length) {
		context.messageSecret = randomBytes(32)
	}

	if (!context.botMetadata) {
		context.botMetadata = {
			personaId: jidNormalizedUser(botJid) === MUSE_JID ? MUSE_PERSONA_ID : META_AI_PERSONA_ID
		}
	}
}

/** The `<meta>` and `<bot>` attributes WhatsApp attaches to a native bot's reply. */
export type BotReplyInfo = {
	/** id of the message (our prompt) whose messageSecret the reply is encrypted with */
	targetId?: string
	/** author of that message; absent for a native @bot, which then means our own LID */
	targetSenderJid?: string
	/** `first`, `inner`, `last` or `full` while the reply is streamed */
	editType?: string
	/** id of the reply message an `inner` or `last` edit belongs to */
	editTargetId?: string
}

export const getBotReplyInfo = (stanza: BinaryNode): BotReplyInfo => {
	const meta = getBinaryNodeChild(stanza, 'meta')?.attrs
	const bot = getBinaryNodeChild(stanza, 'bot')?.attrs
	return {
		targetId: meta?.target_id,
		targetSenderJid: meta?.target_sender_jid,
		editType: bot?.edit,
		editTargetId: bot?.edit_target_id
	}
}

/**
 * Message ids to try when decrypting a bot reply, in order. Streamed `inner` and
 * `last` edits are encrypted with the id of the reply they edit; WhatsApp clients
 * fall back to the stanza's own id once if that fails. `full` uses its own id.
 */
export const getBotReplyDecryptionIds = (stanzaId: string, { editType, editTargetId }: BotReplyInfo) =>
	(editType === 'inner' || editType === 'last') && editTargetId && editTargetId !== stanzaId
		? [editTargetId, stanzaId]
		: [stanzaId]

/**
 * Decrypt the payload of a bot reply (`<enc type="msmsg">`). The key comes from
 * the messageSecret of the prompt the reply answers:
 *   K   = HKDF(HKDF(messageSecret, "Bot Message"), messageId + targetSender + bot)
 *   AAD = messageId \0 bot
 * The plaintext is a Message protobuf with no Signal padding.
 */
export const decryptBotReply = ({
	messageSecret,
	messageId,
	targetSenderJid,
	botJid,
	encIv,
	encPayload
}: {
	messageSecret: Uint8Array
	messageId: string
	targetSenderJid: string
	botJid: string
	encIv: Uint8Array
	encPayload: Uint8Array
}) => {
	const targetSender = jidNormalizedUser(targetSenderJid)
	const bot = jidNormalizedUser(botJid)
	const botSecret = hkdf(messageSecret, 32, { info: 'Bot Message' })
	const key = hkdf(botSecret, 32, { info: `${messageId}${targetSender}${bot}` })
	return aesDecryptGCM(encPayload, key, encIv, Buffer.from(`${messageId}\u0000${bot}`))
}

/** Decode the `msmsg` envelope and decrypt it, trying each candidate id in turn. */
export const decryptBotReplyNode = ({
	content,
	stanzaId,
	info,
	messageSecret,
	targetSenderJid,
	botJid
}: {
	content: Uint8Array
	stanzaId: string
	info: BotReplyInfo
	messageSecret: Uint8Array
	targetSenderJid: string
	botJid: string
}) => {
	const { encIv, encPayload } = proto.MessageSecretMessage.decode(content)
	if (!encIv?.length || !encPayload?.length) {
		throw new Error('bot reply without encrypted payload')
	}

	let lastError: unknown
	for (const messageId of getBotReplyDecryptionIds(stanzaId, info)) {
		try {
			return decryptBotReply({ messageSecret, messageId, targetSenderJid, botJid, encIv, encPayload })
		} catch (error) {
			lastError = error
		}
	}

	throw lastError
}
