import { Boom } from '@hapi/boom'
import { Logger } from 'pino'
import { proto } from '../../WAProto'
import { SignalRepository, WAMessageKey } from '../Types'
import { areJidsSameUser, BinaryNode, isJidBroadcast, isJidGroup, isJidMetaAI, isJidNewsletter, isJidStatusBroadcast, isJidUser, isLidUser } from '../WABinary'
import { unpadRandomMax16 } from './generics'
import { createDecipheriv } from 'crypto'
import hkdf from 'futoin-hkdf'

export const NO_MESSAGE_FOUND_ERROR_TEXT = 'Message absent from node'
export const MISSING_KEYS_ERROR_TEXT = 'Key used already or never filled'
const BOT_MESSAGE_CONSTANT = "Bot Message"
const KEY_LENGTH = 32

interface MessageKey {
	targetId: string | null;
	participant: string;
	meId: string;
}

export const NACK_REASONS = {
	ParsingError: 487,
	UnrecognizedStanza: 488,
	UnrecognizedStanzaClass: 489,
	UnrecognizedStanzaType: 490,
	InvalidProtobuf: 491,
	InvalidHostedCompanionStanza: 493,
	MissingMessageSecret: 495,
	SignalErrorOldCounter: 496,
	MessageDeletedOnPeer: 499,
	UnhandledError: 500,
	UnsupportedAdminRevoke: 550,
	UnsupportedLIDGroup: 551,
	DBOperationFailed: 552
}

type MessageType = 'chat' | 'peer_broadcast' | 'other_broadcast' | 'group' | 'direct_peer_status' | 'other_status' | 'newsletter'

const deriveMessageSecret = async (messageSecret: Buffer | Uint8Array): Promise<Buffer> => {
	// Always convert to Buffer to ensure compatibility
	const secretBuffer = Buffer.isBuffer(messageSecret)
		? messageSecret
		: Buffer.from(messageSecret.buffer, messageSecret.byteOffset, messageSecret.length);

	return await hkdf(
		secretBuffer,
		KEY_LENGTH,
		{ salt: undefined, info: BOT_MESSAGE_CONSTANT, hash: "SHA-256" }
	);
};

const buildDecryptionKey = async (
	messageID: string,
	botJID: string,
	targetJID: string,
	messageSecret: Buffer | Uint8Array
): Promise<Buffer> => {
	const derivedSecret = await deriveMessageSecret(messageSecret);
	const useCaseSecret = Buffer.concat([
		Buffer.from(messageID),
		Buffer.from(targetJID),
		Buffer.from(botJID),
		Buffer.from("")
	]);
	return await hkdf(
		derivedSecret,
		KEY_LENGTH,
		{ salt: undefined, info: useCaseSecret, hash: "SHA-256" }
	);
};

const decryptBotMessage = async (
	encPayload: Buffer | Uint8Array,
	encIv: Buffer | Uint8Array,
	messageID: string,
	botJID: string,
	decryptionKey: Buffer | Uint8Array
): Promise<Buffer> => {
	encPayload = Buffer.isBuffer(encPayload) ? encPayload : Buffer.from(encPayload);
	encIv = Buffer.isBuffer(encIv) ? encIv : Buffer.from(encIv);
	decryptionKey = Buffer.isBuffer(decryptionKey) ? decryptionKey : Buffer.from(decryptionKey);

	if (encIv.length !== 12) {
		throw new Error(`IV size incorrect: expected 12, got ${encIv.length}`);
	}

	const authTag = encPayload.slice(-16);
	const encryptedData = encPayload.slice(0, -16);

	if (encryptedData.length < 16) {
		throw new Error(`Encrypted data too short: ${encryptedData.length} bytes`);
	}

	const aad = Buffer.concat([
		Buffer.from(messageID),
		Buffer.from([0]),
		Buffer.from(botJID)
	]);

	try {
		const decipher = createDecipheriv("aes-256-gcm", decryptionKey, encIv);
		decipher.setAAD(aad);
		decipher.setAuthTag(authTag);
		const decrypted = Buffer.concat([
			decipher.update(encryptedData),
			decipher.final()
		]);

		return decrypted;

	} catch (error) {
		console.error("Decrypt - Failed with:", (error as Error).message);
		throw error;
	}
};

const decryptMsmsgBotMessage = async (
	messageSecret: Buffer | Uint8Array,
	messageKey: MessageKey,
	msMsg: proto.IMessageSecretMessage,
): Promise<Buffer> => {
	try {
		const { targetId, participant: botJID, meId: targetJID } = messageKey;

		if (!targetId || !botJID || !targetJID || !messageSecret) {
			throw new Error("Missing required components for decryption");
		}

		const decryptionKey = await buildDecryptionKey(
			targetId,
			botJID,
			targetJID,
			messageSecret
		);

		if (!msMsg.encPayload) {
			throw new Error('Missing encPayload');
		}

		if (!msMsg.encIv) {
			throw new Error('Missing encIv');
		}

		return await decryptBotMessage(
			msMsg.encPayload,
			msMsg.encIv,
			targetId,
			botJID,
			decryptionKey
		);
	} catch (error) {
		console.error("Failed to decrypt bot message:", error);
		throw error;
	}
};

const decryptBotMsg = async (
	content: Buffer | Uint8Array,
	{ messageKey, messageSecret }: { messageKey: MessageKey; messageSecret: Buffer | Uint8Array }
): Promise<Buffer> => {
	try {
		const msMsg = proto.MessageSecretMessage.decode(content);
		return await decryptMsmsgBotMessage(messageSecret, messageKey, msMsg);
	} catch (error) {
		console.error("Error in decryptBotMsg:", error);
		throw error;
	}
};

/**
 * Decode the received node as a message.
 * @note this will only parse the message, not decrypt it
 */
export function decodeMessageNode(
	stanza: BinaryNode,
	meId: string,
	meLid: string
) {
	let msgType: MessageType
	let chatId: string
	let author: string

	const msgId = stanza.attrs.id
	const from = stanza.attrs.from
	const participant: string | undefined = stanza.attrs.participant
	const recipient: string | undefined = stanza.attrs.recipient

	const isMe = (jid: string) => areJidsSameUser(jid, meId)
	const isMeLid = (jid: string) => areJidsSameUser(jid, meLid)

	if (isJidMetaAI(from) || isJidUser(from)) {
		if (recipient) {
			if (!isMe(from)) {
				throw new Boom('receipient present, but msg not from me', { data: stanza })
			}

			chatId = recipient
		} else {
			chatId = from
		}

		msgType = 'chat'
		author = from
	} else if (isLidUser(from)) {
		if (recipient) {
			if (!isMeLid(from)) {
				throw new Boom('receipient present, but msg not from me', { data: stanza })
			}

			chatId = recipient
		} else {
			chatId = from
		}

		msgType = 'chat'
		author = from
	} else if (isJidGroup(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		msgType = 'group'
		author = participant
		chatId = from
	} else if (isJidBroadcast(from)) {
		if (!participant) {
			throw new Boom('No participant in group message')
		}

		const isParticipantMe = isMe(participant)
		if (isJidStatusBroadcast(from)) {
			msgType = isParticipantMe ? 'direct_peer_status' : 'other_status'
		} else {
			msgType = isParticipantMe ? 'peer_broadcast' : 'other_broadcast'
		}

		chatId = from
		author = participant
	} else if (isJidNewsletter(from)) {
		msgType = 'newsletter'
		chatId = from
		author = from
	} else {
		throw new Boom('Unknown message type', { data: stanza })
	}

	const fromMe = (isLidUser(from) ? isMeLid : isMe)(stanza.attrs.participant || stanza.attrs.from)
	const pushname = stanza?.attrs?.notify

	const key: WAMessageKey = {
		remoteJid: chatId,
		fromMe,
		id: msgId,
		participant
	}

	const fullMessage: proto.IWebMessageInfo = {
		key,
		messageTimestamp: +stanza.attrs.t,
		pushName: pushname,
		broadcast: isJidBroadcast(from)
	}

	if (key.fromMe) {
		fullMessage.status = proto.WebMessageInfo.Status.SERVER_ACK
	}

	return {
		fullMessage,
		author,
		sender: msgType === 'chat' ? author : chatId
	}
}

type GetMessage = (key: WAMessageKey) => Promise<proto.IMessage | undefined>;

export const decryptMessageNode = (
	stanza: BinaryNode,
	meId: string,
	meLid: string,
	repository: SignalRepository,
	logger: Logger,
	getMessage: GetMessage
) => {
	const { fullMessage, author, sender } = decodeMessageNode(stanza, meId, meLid)
	let metaTargetId: string | null = null
	let botEditTargetId: string | null = null
	let botType: string | null = null
	return {
		fullMessage,
		category: stanza.attrs.category,
		author,
		async decrypt() {
			let decryptables = 0
			if (Array.isArray(stanza.content)) {
				let hasMsmsg = false;
				for (const { attrs } of stanza.content) {
					if (attrs?.type === 'msmsg') {
						hasMsmsg = true;
						break;
					}
				}
				if (hasMsmsg) {
					for (const { tag, attrs } of stanza.content) {
						if (tag === 'meta' && attrs?.target_id) {
							metaTargetId = attrs.target_id;
						}
						if (tag === 'bot' && attrs?.edit_target_id) {
							botEditTargetId = attrs.edit_target_id;
						}
						if (tag === 'bot' && attrs?.edit) {
							botType = attrs.edit;
						}
					}
				}
				for (const { tag, attrs, content } of stanza.content) {
					if (tag === 'verified_name' && content instanceof Uint8Array) {
						const cert = proto.VerifiedNameCertificate.decode(content)
						const details = proto.VerifiedNameCertificate.Details.decode(cert.details)
						fullMessage.verifiedBizName = details.verifiedName
					}

					if (tag !== 'enc' && tag !== 'plaintext') {
						continue
					}

					if (!(content instanceof Uint8Array)) {
						continue
					}

					decryptables += 1

					let msgBuffer: Uint8Array

					try {
						const e2eType = tag === 'plaintext' ? 'plaintext' : attrs.type
						switch (e2eType) {
							case 'skmsg':
								msgBuffer = await repository.decryptGroupMessage({
									group: sender,
									authorJid: author,
									msg: content
								})
								break
							case 'pkmsg':
							case 'msg':
								const user = isJidUser(sender) ? sender : author
								msgBuffer = await repository.decryptMessage({
									jid: user,
									type: e2eType,
									ciphertext: content
								})
								break
							case 'msmsg': //Message Secret Message
								let msgRequestkey = {
									remoteJid: stanza.attrs.from,
									id: metaTargetId
								}
								const message = await getMessage(msgRequestkey);
								const messageSecret = message?.messageContextInfo?.messageSecret
								if (!messageSecret) {
									throw new Error('Message secret not found');
								}
								//Only decrypts when it is the complete message
								if (botType == 'last') {
									const newkey: MessageKey = {
										participant: stanza.attrs.from,
										meId: stanza.attrs.from.endsWith(`@bot`) ?
											`${meLid.split(`:`)[0]}@lid` :
											`${meId.split(`:`)[0]}@s.whatsapp.net`,
										targetId: botEditTargetId
									};

									msgBuffer = await decryptBotMsg(content, {
										messageKey: newkey,
										messageSecret
									});
								} else return;
								break;
							case 'plaintext':
								msgBuffer = content
								break
							default:
								throw new Error(`Unknown e2e type: ${e2eType}`)
						}

						let msg: proto.IMessage = proto.Message.decode(e2eType !== 'plaintext' && !hasMsmsg ? unpadRandomMax16(msgBuffer) : msgBuffer)
						//It's necessary to save the messageContextInfo in the store to decrypt messages from bots
						msg = msg.deviceSentMessage?.message ? { ...msg.deviceSentMessage.message, messageContextInfo: msg.messageContextInfo } : msg;
						if (msg.senderKeyDistributionMessage) {
							//eslint-disable-next-line max-depth
							try {
								await repository.processSenderKeyDistributionMessage({
									authorJid: author,
									item: msg.senderKeyDistributionMessage
								})
							} catch (err) {
								logger.error({ key: fullMessage.key, err }, 'failed to decrypt message')
							}
						}

						if (fullMessage.message) {
							Object.assign(fullMessage.message, msg)
						} else {
							fullMessage.message = msg
						}
					} catch (err) {
						logger.error(
							{ key: fullMessage.key, err },
							'failed to decrypt message'
						)
						fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
						fullMessage.messageStubParameters = [err.message]
					}
				}
			}

			// if nothing was found to decrypt
			if (!decryptables) {
				fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
				fullMessage.messageStubParameters = [NO_MESSAGE_FOUND_ERROR_TEXT]
			}
		}
	}
}
