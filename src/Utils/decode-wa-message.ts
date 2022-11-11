import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { AuthenticationState, WAMessageKey } from '../Types'
import { areJidsSameUser, BinaryNode, isJidBroadcast, isJidGroup, isJidStatusBroadcast, isJidUser } from '../WABinary'
import { unpadRandomMax16 } from './generics'
import { decryptGroupSignalProto, decryptSignalProto, processSenderKeyMessage } from './signal'

const NO_MESSAGE_FOUND_ERROR_TEXT = 'Message absent from node'

type MessageType = 'chat' | 'peer_broadcast' | 'other_broadcast' | 'group' | 'direct_peer_status' | 'other_status'

export const decodeMessageStanza = (stanza: BinaryNode, auth: AuthenticationState) => {
	let msgType: MessageType
	let chatId: string
	let author: string

	const msgId = stanza.attrs.id
	const from = stanza.attrs.from
	const participant: string | undefined = stanza.attrs.participant
	const recipient: string | undefined = stanza.attrs.recipient

	const isMe = (jid: string) => areJidsSameUser(jid, auth.creds.me!.id)

	if(isJidUser(from)) {
		if(recipient) {
			if(!isMe(from)) {
				throw new Boom('receipient present, but msg not from me', { data: stanza })
			}

			chatId = recipient
		} else {
			chatId = from
		}

		msgType = 'chat'
		author = from
	} else if(isJidGroup(from)) {
		if(!participant) {
			throw new Boom('No participant in group message')
		}

		msgType = 'group'
		author = participant
		chatId = from
	} else if(isJidBroadcast(from)) {
		if(!participant) {
			throw new Boom('No participant in group message')
		}

		const isParticipantMe = isMe(participant)
		if(isJidStatusBroadcast(from)) {
			msgType = isParticipantMe ? 'direct_peer_status' : 'other_status'
		} else {
			msgType = isParticipantMe ? 'peer_broadcast' : 'other_broadcast'
		}

		chatId = from
		author = participant
	} else {
		throw new Boom('Unknown message type', { data: stanza })
	}

	const sender = msgType === 'chat' ? author : chatId

	const fromMe = isMe(stanza.attrs.participant || stanza.attrs.from)
	const pushname = stanza.attrs.notify

	const key: WAMessageKey = {
		remoteJid: chatId,
		fromMe,
		id: msgId,
		participant
	}

	const fullMessage: proto.IWebMessageInfo = {
		key,
		messageTimestamp: +stanza.attrs.t,
		pushName: pushname
	}

	if(key.fromMe) {
		fullMessage.status = proto.WebMessageInfo.Status.SERVER_ACK
	}

	return {
		fullMessage,
		category: stanza.attrs.category,
		author,
		async decrypt() {
			let decryptables = 0
			if(Array.isArray(stanza.content)) {
				for(const { tag, attrs, content } of stanza.content) {
					if(tag === 'verified_name' && content instanceof Uint8Array) {
						const cert = proto.VerifiedNameCertificate.decode(content)
						const details = proto.VerifiedNameCertificate.Details.decode(cert.details)
						fullMessage.verifiedBizName = details.verifiedName
					}

					if(tag !== 'enc') {
						continue
					}

					if(!(content instanceof Uint8Array)) {
						continue
					}

					decryptables += 1

					let msgBuffer: Buffer

					try {
						const e2eType = attrs.type
						switch (e2eType) {
						case 'skmsg':
							msgBuffer = await decryptGroupSignalProto(sender, author, content, auth)
							break
						case 'pkmsg':
						case 'msg':
							const user = isJidUser(sender) ? sender : author
							msgBuffer = await decryptSignalProto(user, e2eType, content as Buffer, auth)
							break
						default:
							throw new Error(`Unknown e2e type: ${e2eType}`)
						}

						let msg: proto.IMessage = proto.Message.decode(unpadRandomMax16(msgBuffer))
						msg = msg.deviceSentMessage?.message || msg
						if(msg.senderKeyDistributionMessage) {
							await processSenderKeyMessage(author, msg.senderKeyDistributionMessage, auth)
						}

						if(fullMessage.message) {
							Object.assign(fullMessage.message, msg)
						} else {
							fullMessage.message = msg
						}
					} catch(error) {
						fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
						fullMessage.messageStubParameters = [error.message]
					}
				}
			}

			// if nothing was found to decrypt
			if(!decryptables) {
				fullMessage.messageStubType = proto.WebMessageInfo.StubType.CIPHERTEXT
				fullMessage.messageStubParameters = [NO_MESSAGE_FOUND_ERROR_TEXT]
			}
		}
	}
}