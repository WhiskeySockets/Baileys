import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { AuthenticationState, WAMessageKey } from '../Types'
import { areJidsSameUser, BinaryNode, isJidBroadcast, isJidGroup, isJidStatusBroadcast, isJidUser } from '../WABinary'
import { unpadRandomMax16 } from './generics'
import { decryptGroupSignalProto, decryptSignalProto, processSenderKeyMessage } from './signal'

type MessageType = 'chat' | 'peer_broadcast' | 'other_broadcast' | 'group' | 'direct_peer_status' | 'other_status'

export const decodeMessageStanza = async(stanza: BinaryNode, auth: AuthenticationState) => {
	//const deviceIdentity = (stanza.content as BinaryNodeM[])?.find(m => m.tag === 'device-identity')
	//const deviceIdentityBytes = deviceIdentity ? deviceIdentity.content as Buffer : undefined

	let msgType: MessageType
	let chatId: string
	let author: string

	const msgId: string = stanza.attrs.id
	const from: string = stanza.attrs.from
	const participant: string | undefined = stanza.attrs.participant
	const recipient: string | undefined = stanza.attrs.recipient

	const isMe = (jid: string) => areJidsSameUser(jid, auth.creds.me!.id)

	if(isJidUser(from)) {
		if(recipient) {
			if(!isMe(from)) {
				throw new Boom('')
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
		fullMessage.status = proto.WebMessageInfo.WebMessageInfoStatus.SERVER_ACK
	}

	if(Array.isArray(stanza.content)) {
		for(const { tag, attrs, content } of stanza.content) {
			if(tag !== 'enc') {
				continue
			}

			if(!(content instanceof Uint8Array)) {
				continue
			} 

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
				fullMessage.messageStubType = proto.WebMessageInfo.WebMessageInfoStubType.CIPHERTEXT
				fullMessage.messageStubParameters = [error.message]
			}
		}
	}

	return fullMessage
}