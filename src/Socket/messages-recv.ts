
import { SocketConfig, WAMessageStubType, ParticipantAction, Chat, GroupMetadata, WAMessageKey } from "../Types"
import { decodeMessageStanza, encodeBigEndian, toNumber, downloadHistory, generateSignalPubKey, xmppPreKey, xmppSignedPreKey } from "../Utils"
import { BinaryNode, jidDecode, jidEncode, isJidStatusBroadcast, areJidsSameUser, getBinaryNodeChildren, jidNormalizedUser, getAllBinaryNodeChildren, BinaryNodeAttributes } from '../WABinary'
import { proto } from "../../WAProto"
import { KEY_BUNDLE_TYPE } from "../Defaults"
import { makeChatsSocket } from "./chats"
import { extractGroupMetadata } from "./groups"

const CALL_TAGS_TO_ACK = ['terminate', 'relaylatency', 'offer']

const isReadReceipt = (type: string) => type === 'read' || type === 'read-self'

export const makeMessagesRecvSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeChatsSocket(config)
	const { 
		ev,
        authState,
		ws,
        assertingPreKeys,
		sendNode,
        relayMessage,
        sendDeliveryReceipt,
        resyncMainAppState,
	} = sock

    const msgRetryMap = config.msgRetryCounterMap || { }

    const sendMessageAck = async({ tag, attrs }: BinaryNode, extraAttrs: BinaryNodeAttributes) => {
        const stanza: BinaryNode = {
            tag: 'ack',
            attrs: {
                id: attrs.id,
                to: attrs.from,
                ...extraAttrs,
            }
        }
        if(!!attrs.participant) {
            stanza.attrs.participant = attrs.participant
        }
        logger.debug({ recv: attrs, sent: stanza.attrs }, `sent "${tag}" ack`)
        await sendNode(stanza)
    }

    const sendRetryRequest = async(node: BinaryNode) => {
        const msgId = node.attrs.id
        const retryCount = msgRetryMap[msgId] || 1
        if(retryCount >= 5) {
            logger.debug({ retryCount, msgId }, 'reached retry limit, clearing')
            delete msgRetryMap[msgId]
            return
        }
        msgRetryMap[msgId] = retryCount+1

        const isGroup = !!node.attrs.participant
        const { account, signedPreKey, signedIdentityKey: identityKey } = authState.creds
        
        const deviceIdentity = proto.ADVSignedDeviceIdentity.encode(account).finish()
        await assertingPreKeys(1, async preKeys => {
            const [keyId] = Object.keys(preKeys)
            const key = preKeys[+keyId]

            const decFrom = node.attrs.from ? jidDecode(node.attrs.from) : undefined
            const receipt: BinaryNode = {
                tag: 'receipt',
                attrs: {
                    id: msgId,
                    type: 'retry',
                    to: isGroup ? node.attrs.from : jidEncode(decFrom!.user, 's.whatsapp.net', decFrom!.device, 0)
                },
                content: [
                    { 
                        tag: 'retry', 
                        attrs: { 
                            count: retryCount.toString(), id: node.attrs.id,
                            t: node.attrs.t,
                            v: '1'
                        } 
                    },
                    {
                        tag: 'registration',
                        attrs: { },
                        content: encodeBigEndian(authState.creds.registrationId)
                    }
                ]
            }
            if(node.attrs.recipient) {
                receipt.attrs.recipient = node.attrs.recipient
            }
            if(node.attrs.participant) {
                receipt.attrs.participant = node.attrs.participant
            }
            if(retryCount > 1) {
                const exec = generateSignalPubKey(Buffer.from(KEY_BUNDLE_TYPE)).slice(0, 1);

                (receipt.content! as BinaryNode[]).push({
                    tag: 'keys',
                    attrs: { },
                    content: [
                        { tag: 'type', attrs: { }, content: exec },
                        { tag: 'identity', attrs: { }, content: identityKey.public },
                        xmppPreKey(key, +keyId),
                        xmppSignedPreKey(signedPreKey),
                        { tag: 'device-identity', attrs: { }, content: deviceIdentity }
                    ]
                })
            }
            await sendNode(receipt)

            logger.info({ msgAttrs: node.attrs, retryCount }, 'sent retry receipt')
        })
    }
    const processMessage = async(message: proto.IWebMessageInfo, chatUpdate: Partial<Chat>) => {
        const protocolMsg = message.message?.protocolMessage
        if(protocolMsg) {
            switch(protocolMsg.type) {
                case proto.ProtocolMessage.ProtocolMessageType.HISTORY_SYNC_NOTIFICATION:
                    const histNotification = protocolMsg!.historySyncNotification
                    
                    logger.info({ type: histNotification.syncType!, id: message.key.id }, 'got history notification')
                    const history = await downloadHistory(histNotification)
                    
                    processHistoryMessage(history)

                    const meJid = authState.creds.me!.id
                    await sendNode({
                        tag: 'receipt',
                        attrs: {
                            id: message.key.id,
                            type: 'hist_sync',
                            to: jidEncode(jidDecode(meJid).user, 'c.us')
                        }
                    })
                    break
                case proto.ProtocolMessage.ProtocolMessageType.APP_STATE_SYNC_KEY_REQUEST:
                    const keys = await Promise.all(
                        protocolMsg.appStateSyncKeyRequest!.keyIds!.map(
                            async id => {
                                const keyId = Buffer.from(id.keyId!).toString('base64')
                                const keyData = await authState.keys.getAppStateSyncKey(keyId)
                                logger.info({ keyId }, 'received key request')
                                return {
                                    keyId: id,
                                    keyData
                                }
                            }
                        )
                    )
                    
                    const msg: proto.IMessage = {
                        protocolMessage: {
                            type: proto.ProtocolMessage.ProtocolMessageType.APP_STATE_SYNC_KEY_SHARE,
                            appStateSyncKeyShare: {
                                keys
                            }
                        }
                    }
                    await relayMessage(message.key.remoteJid!, msg, { })
                    logger.info({ with: message.key.remoteJid! }, 'shared key')
                break
                case proto.ProtocolMessage.ProtocolMessageType.APP_STATE_SYNC_KEY_SHARE:
                    let newAppStateSyncKeyId = ''
                    for(const { keyData, keyId } of protocolMsg.appStateSyncKeyShare!.keys || []) {
                        const str = Buffer.from(keyId.keyId!).toString('base64')
                        logger.info({ str }, 'injecting new app state sync key')
                        await authState.keys.setAppStateSyncKey(str, keyData)

                        newAppStateSyncKeyId = str
                    }
                    
                    ev.emit('creds.update', { myAppStateKeyId: newAppStateSyncKeyId })

                    resyncMainAppState()
                break
                case proto.ProtocolMessage.ProtocolMessageType.REVOKE:
                    ev.emit('messages.update', [
                        { 
                            key: protocolMsg.key, 
                            update: { message: null, messageStubType: WAMessageStubType.REVOKE, key: message.key } 
                        }
                    ])
                break
                case proto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING:
                    chatUpdate.ephemeralSettingTimestamp = toNumber(message.messageTimestamp)
                    chatUpdate.ephemeralExpiration = protocolMsg.ephemeralExpiration || null
                break
            }
        } else if(message.messageStubType) {
            const meJid = authState.creds.me!.id
            const jid = message.key!.remoteJid!
            //let actor = whatsappID (message.participant)
            let participants: string[]
            const emitParticipantsUpdate = (action: ParticipantAction) => (
                ev.emit('group-participants.update', { id: jid, participants, action })
            )
            const emitGroupUpdate = (update: Partial<GroupMetadata>) => {
                ev.emit('groups.update', [ { id: jid, ...update } ])
            }

            switch (message.messageStubType) {
                case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
                case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
                    participants = message.messageStubParameters
                    emitParticipantsUpdate('remove')
                    // mark the chat read only if you left the group
                    if(participants.includes(meJid)) {
                        chatUpdate.readOnly = true
                    }
                    break
                case WAMessageStubType.GROUP_PARTICIPANT_ADD:
                case WAMessageStubType.GROUP_PARTICIPANT_INVITE:
                case WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                    participants = message.messageStubParameters
                    if (participants.includes(meJid)) {
                        chatUpdate.readOnly = false
                    }
                    emitParticipantsUpdate('add')
                    break
                case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
                    const announce = message.messageStubParameters[0] === 'on'
                    emitGroupUpdate({ announce })
                    break
                case WAMessageStubType.GROUP_CHANGE_RESTRICT:
                    const restrict = message.messageStubParameters[0] === 'on'
                    emitGroupUpdate({ restrict })
                    break
                case WAMessageStubType.GROUP_CHANGE_SUBJECT:
                    chatUpdate.name = message.messageStubParameters[0]
                    emitGroupUpdate({ subject: chatUpdate.name })
                    break
            }
        }
    }

    const processHistoryMessage = (item: proto.HistorySync) => {
        const messages: proto.IWebMessageInfo[] = []
        switch(item.syncType) {
            case proto.HistorySync.HistorySyncHistorySyncType.INITIAL_BOOTSTRAP:
                const chats = item.conversations!.map(
                    c => {
                        const chat: Chat = { ...c }
                        //@ts-expect-error
                        delete chat.messages
                        for(const msg of c.messages || []) {
                            if(msg.message) {
                                messages.push(msg.message)
                            }
                        }
                        return chat
                    }
                )
                ev.emit('chats.set', { chats, messages })
            break
            case proto.HistorySync.HistorySyncHistorySyncType.RECENT:
                // push remaining messages
                for(const conv of item.conversations) {
                    for(const m of (conv.messages || [])) {
                        messages.push(m.message!)
                    }
                }
                if(messages.length) {
                    ev.emit('messages.upsert', { messages, type: 'prepend' })
                }
            break
            case proto.HistorySync.HistorySyncHistorySyncType.PUSH_NAME:
                const contacts = item.pushnames.map(
                    p => ({ notify: p.pushname, id: p.id })
                )
                ev.emit('contacts.upsert', contacts)
            break
            case proto.HistorySync.HistorySyncHistorySyncType.INITIAL_STATUS_V3:
                // TODO
            break
        }
    }

    const processNotification = (node: BinaryNode): Partial<proto.IWebMessageInfo> => {
        const result: Partial<proto.IWebMessageInfo> = { }
        const [child] = getAllBinaryNodeChildren(node)

        if(node.attrs.type === 'w:gp2') {
            switch(child?.tag) {
                case 'create':
                    const metadata = extractGroupMetadata(child)

                    result.messageStubType = WAMessageStubType.GROUP_CREATE
                    result.messageStubParameters = [metadata.subject]
                    result.key = {
                        participant: jidNormalizedUser(metadata.owner)
                    }

                    ev.emit('chats.upsert', [{
                        id: metadata.id,
                        name: metadata.subject,
                        conversationTimestamp: metadata.creation,
                    }])
                    ev.emit('groups.upsert', [metadata])
                    break
                case 'ephemeral':
                case 'not_ephemeral':
                    result.message = {
                        protocolMessage: {
                            type: proto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING,
                            ephemeralExpiration: +(child.attrs.expiration || 0)
                        }
                    }
                    break
                case 'promote':
                case 'demote':
                case 'remove':
                case 'add':
                case 'leave':
                    const stubType = `GROUP_PARTICIPANT_${child.tag!.toUpperCase()}`
                    result.messageStubType = WAMessageStubType[stubType]

                    const participants = getBinaryNodeChildren(child, 'participant').map(p => p.attrs.jid)
                    if(
                        participants.length === 1 && 
                        // if recv. "remove" message and sender removed themselves
                        // mark as left
                        areJidsSameUser(participants[0], node.attrs.participant) &&
                        child.tag === 'remove'
                    ) {
                        result.messageStubType = WAMessageStubType.GROUP_PARTICIPANT_LEAVE
                    }
                    result.messageStubParameters = participants
                    break
                case 'subject':
                    result.messageStubType = WAMessageStubType.GROUP_CHANGE_SUBJECT
                    result.messageStubParameters = [ child.attrs.subject ]
                    break
                case 'announcement':
                case 'not_announcement':
                    result.messageStubType = WAMessageStubType.GROUP_CHANGE_ANNOUNCE
                    result.messageStubParameters = [ (child.tag === 'announcement').toString() ]
                    break
                case 'locked':
                case 'unlocked':
                    result.messageStubType = WAMessageStubType.GROUP_CHANGE_RESTRICT
                    result.messageStubParameters = [ (child.tag === 'locked').toString() ]
                    break
                
            }
        } else {
            switch(child.tag) {
                case 'devices':
                    const devices = getBinaryNodeChildren(child, 'device')
                    if(areJidsSameUser(child.attrs.jid, authState.creds!.me!.id)) {
                        const deviceJids = devices.map(d => d.attrs.jid)
                        logger.info({ deviceJids }, 'got my own devices')
                    }
                break
            }
        }
        if(Object.keys(result).length) {
            return result
        }
    }
    // recv a message
    ws.on('CB:message', async(stanza: BinaryNode) => {
        const dec = await decodeMessageStanza(stanza, authState)
        const fullMessages: proto.IWebMessageInfo[] = []

        const { attrs } = stanza
        const isGroup = !!stanza.attrs.participant
        const sender = (attrs.participant || attrs.from)?.toString()
        const isMe = areJidsSameUser(sender, authState.creds.me!.id)

        const remoteJid = jidNormalizedUser(dec.chatId)
        
        const key: WAMessageKey = {
            remoteJid,
            fromMe: isMe,
            id: dec.msgId,
            participant: dec.participant
        }
        const partialMsg: Partial<proto.IWebMessageInfo> = {
            messageTimestamp: dec.timestamp,
            pushName: dec.pushname
        }
        // if there were some successful decryptions
        if(dec.successes.length) {
            // send message receipt
            let recpAttrs: { [_: string]: any }
            if(isMe) {
                recpAttrs =  {
                    type: 'sender',
                    id: stanza.attrs.id,
                    to: stanza.attrs.from,
                }
                if(isGroup) {
                    recpAttrs.participant = stanza.attrs.participant
                } else {
                    recpAttrs.recipient = stanza.attrs.recipient
                }
            } else {
                const isStatus = isJidStatusBroadcast(stanza.attrs.from)
                recpAttrs = {
                    id: stanza.attrs.id,
                }
                if(isGroup || isStatus) {
                    recpAttrs.participant = stanza.attrs.participant
                    recpAttrs.to = dec.chatId
                } else {
                    recpAttrs.to = jidNormalizedUser(dec.chatId)
                }
            }

            await sendNode({ tag: 'receipt', attrs: recpAttrs })
            logger.debug({ msgId: dec.msgId }, 'sent message receipt')

            await sendMessageAck(stanza, { class: 'receipt' })

            await sendDeliveryReceipt(dec.chatId, dec.participant, [dec.msgId])
            logger.debug({ msgId: dec.msgId }, 'sent delivery receipt')
        }

        for(const msg of dec.successes) {
            const message = msg.deviceSentMessage?.message || msg
            fullMessages.push({
                key,
                message,
                status: isMe ? proto.WebMessageInfo.WebMessageInfoStatus.SERVER_ACK : null,
                ...partialMsg
            })
        }
        
		for(const { error } of dec.failures) {
            logger.error(
                { msgId: dec.msgId, trace: error.stack, data: error.data }, 
                'failure in decrypting message'
            )
            await sendRetryRequest(stanza)
            
            fullMessages.push({
                key,
                messageStubType: WAMessageStubType.CIPHERTEXT,
                messageStubParameters: [error.message],
                ...partialMsg
            })
        }

        if(fullMessages.length) {
            ev.emit(
                'messages.upsert', 
                { 
                    messages: fullMessages.map(m => proto.WebMessageInfo.fromObject(m)), 
                    type: stanza.attrs.offline ? 'append' : 'notify' 
                }
            )
        } else {
            logger.warn({ stanza }, `received node with 0 messages`)
        }
    })

    ws.on('CB:ack,class:message', async(node: BinaryNode) => {
        await sendNode({
            tag: 'ack',
            attrs: {
                class: 'receipt',
                id: node.attrs.id,
                from: node.attrs.from
            }
        })
        logger.debug({ attrs: node.attrs }, 'sending receipt for ack')
    })

    ws.on('CB:call', async(node: BinaryNode) => {
        logger.info({ node }, 'recv call')

        const [child] = getAllBinaryNodeChildren(node)
        if(CALL_TAGS_TO_ACK.includes(child.tag)) {
            await sendMessageAck(node, { class: 'call', type: child.tag })
        }
    })

    const handleReceipt = async(node: BinaryNode) => {
        const { attrs, content } = node
        const isRead = isReadReceipt(attrs.type)
        const status = isRead ? proto.WebMessageInfo.WebMessageInfoStatus.READ : proto.WebMessageInfo.WebMessageInfoStatus.DELIVERY_ACK
        const ids = [attrs.id]
        if(Array.isArray(content)) {
            const items = getBinaryNodeChildren(content[0], 'item')
            ids.push(...items.map(i => i.attrs.id))
        }
        
        const remoteJid = attrs.recipient || attrs.from 
        const fromMe = attrs.recipient ? false : true
        ev.emit('messages.update', ids.map(id => ({
            key: {
                remoteJid,
                id: id,
                fromMe,
                participant: attrs.participant
            },
            update: { status }
        })))

        await sendMessageAck(node, { class: 'receipt', type: attrs.type })
    }

    ws.on('CB:receipt', handleReceipt)

    ws.on('CB:notification', async(node: BinaryNode) => {
        await sendMessageAck(node, { class: 'notification', type: node.attrs.type })

        const msg = processNotification(node)
        if(msg) {
            const fromMe = areJidsSameUser(node.attrs.participant || node.attrs.from, authState.creds.me!.id)
            msg.key = {
                remoteJid: node.attrs.from,
                fromMe,
                participant: node.attrs.participant,
                id: node.attrs.id,
                ...(msg.key || {})
            }
            msg.messageTimestamp = +node.attrs.t
            
            const fullMsg = proto.WebMessageInfo.fromObject(msg)
            ev.emit('messages.upsert', { messages: [fullMsg], type: 'append' })
        }
    })

    ev.on('messages.upsert', async({ messages }) => {
        const chat: Partial<Chat> = { id: messages[0].key.remoteJid }
        const contactNameUpdates: { [_: string]: string } = { }
        for(const msg of messages) {
            if(!!msg.pushName) {
                const jid = msg.key.fromMe ? jidNormalizedUser(authState.creds.me!.id) : (msg.key.participant || msg.key.remoteJid)
                contactNameUpdates[jid] = msg.pushName
                // update our pushname too
                if(msg.key.fromMe && authState.creds.me?.name !== msg.pushName) {
                    ev.emit('creds.update', { me: { ...authState.creds.me!, name: msg.pushName! } })
                }
            }

            await processMessage(msg, chat)
            if(!!msg.message && !msg.message!.protocolMessage) {
                chat.conversationTimestamp = toNumber(msg.messageTimestamp)
                if(!msg.key.fromMe) {
                    chat.unreadCount = (chat.unreadCount || 0) + 1
                }
            }
        }
        if(Object.keys(chat).length > 1) {
            ev.emit('chats.update', [ chat ])
        }
        if(Object.keys(contactNameUpdates).length) {
            ev.emit('contacts.update', Object.keys(contactNameUpdates).map(
                id => ({ id, notify: contactNameUpdates[id] })
            ))
        }
    })

	return { ...sock, processMessage, sendMessageAck }
}