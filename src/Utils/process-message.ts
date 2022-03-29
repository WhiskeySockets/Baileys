import type { Logger } from 'pino'
import { proto } from '../../WAProto'
import { BaileysEventMap, Chat, GroupMetadata, ParticipantAction, SignalKeyStoreWithTransaction, WAMessageStubType } from '../Types'
import { downloadAndProcessHistorySyncNotification, normalizeMessageContent, toNumber } from '../Utils'
import { areJidsSameUser, jidNormalizedUser } from '../WABinary'

type ProcessMessageContext = {
	historyCache: Set<string>,
	meId: string,
	keyStore: SignalKeyStoreWithTransaction,
	logger?: Logger
	treatCiphertextMessagesAsReal?: boolean
}

const processMessage = async(
	message: proto.IWebMessageInfo,
	{ historyCache, meId, keyStore, logger, treatCiphertextMessagesAsReal }: ProcessMessageContext
) => {
	const map: Partial<BaileysEventMap<any>> = { }

	const chat: Partial<Chat> = { id: jidNormalizedUser(message.key.remoteJid) }

	const normalizedContent = !!message.message && normalizeMessageContent(message.message)
	if(
		(
			!!normalizedContent ||
			(message.messageStubType === WAMessageStubType.CIPHERTEXT && treatCiphertextMessagesAsReal)
		)
		&& !normalizedContent?.protocolMessage
		&& !normalizedContent?.reactionMessage
	) {
		chat.conversationTimestamp = toNumber(message.messageTimestamp)
		if(!message.key.fromMe) {
			chat.unreadCount = (chat.unreadCount || 0) + 1
		}
	}

	const content = normalizeMessageContent(message.message)
	const protocolMsg = content?.protocolMessage
	if(protocolMsg) {
		switch (protocolMsg.type) {
		case proto.ProtocolMessage.ProtocolMessageType.HISTORY_SYNC_NOTIFICATION:
			const histNotification = protocolMsg!.historySyncNotification

			logger?.info({ histNotification, id: message.key.id }, 'got history notification')

			const { chats, contacts, messages, isLatest } = await downloadAndProcessHistorySyncNotification(histNotification, historyCache)

			if(chats.length) {
				map['chats.set'] = { chats, isLatest }
			}

			if(messages.length) {
				map['messages.set'] = { messages, isLatest }
			}

			if(contacts.length) {
				map['contacts.set'] = { contacts }
			}

			break
		case proto.ProtocolMessage.ProtocolMessageType.APP_STATE_SYNC_KEY_SHARE:
			const keys = protocolMsg.appStateSyncKeyShare!.keys
			if(keys?.length) {
				let newAppStateSyncKeyId = ''
				await keyStore.transaction(
					async() => {
						for(const { keyData, keyId } of keys) {
							const strKeyId = Buffer.from(keyId.keyId!).toString('base64')

							logger?.info({ strKeyId }, 'injecting new app state sync key')
							await keyStore.set({ 'app-state-sync-key': { [strKeyId]: keyData } })

							newAppStateSyncKeyId = strKeyId
						}
					}
				)

				map['creds.update'] = { myAppStateKeyId: newAppStateSyncKeyId }
			} else {
				logger?.info({ protocolMsg }, 'recv app state sync with 0 keys')
			}

			break
		case proto.ProtocolMessage.ProtocolMessageType.REVOKE:
			map['messages.update'] = [
				{
					key: {
						...message.key,
						id: protocolMsg.key!.id
					},
					update: { message: null, messageStubType: WAMessageStubType.REVOKE, key: message.key }
				}
			]
			break
		case proto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING:
			Object.assign(chat, {
				ephemeralSettingTimestamp: toNumber(message.messageTimestamp),
				ephemeralExpiration: protocolMsg.ephemeralExpiration || null
			})
			break
		}
	} else if(content?.reactionMessage) {
		const reaction: proto.IReaction = {
			...content.reactionMessage,
			key: message.key,
		}
		const operation = content.reactionMessage?.text ? 'add' : 'remove'
		map['messages.reaction'] = { reaction, key: content.reactionMessage!.key!, operation }
	} else if(message.messageStubType) {
		const jid = message.key!.remoteJid!
		//let actor = whatsappID (message.participant)
		let participants: string[]
		const emitParticipantsUpdate = (action: ParticipantAction) => (
			map['group-participants.update'] = { id: jid, participants, action }
		)
		const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
			map['groups.update'] = [ { id: jid, ...update } ]
		}

		const participantsIncludesMe = () => participants.find(jid => areJidsSameUser(meId, jid))

		switch (message.messageStubType) {
		case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
		case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
			participants = message.messageStubParameters
			emitParticipantsUpdate('remove')
			// mark the chat read only if you left the group
			if(participantsIncludesMe()) {
				chat.readOnly = true
			}

			break
		case WAMessageStubType.GROUP_PARTICIPANT_ADD:
		case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
		case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
			participants = message.messageStubParameters
			if(participantsIncludesMe()) {
				chat.readOnly = false
			}

			emitParticipantsUpdate('add')
			break
		case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
			const announceValue = message.messageStubParameters[0]
			emitGroupUpdate({ announce: announceValue === 'true' || announceValue === 'on' })
			break
		case WAMessageStubType.GROUP_CHANGE_RESTRICT:
			const restrictValue = message.messageStubParameters[0]
			emitGroupUpdate({ restrict: restrictValue === 'true' || restrictValue === 'on' })
			break
		case WAMessageStubType.GROUP_CHANGE_SUBJECT:
			const name = message.messageStubParameters[0]
			chat.name = name
			emitGroupUpdate({ subject: name })
			break
		}
	}

	if(Object.keys(chat).length > 1) {
		map['chats.update'] = [chat]
	}

	return map
}

export default processMessage