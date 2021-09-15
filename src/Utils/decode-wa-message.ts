import { Boom } from '@hapi/boom'
import { unpadRandomMax16 } from "./generics"
import { AuthenticationState } from "../Types"
import { areJidsSameUser, BinaryNode as BinaryNodeM, encodeBinaryNode, isJidBroadcast, isJidGroup, isJidStatusBroadcast, isJidUser } from '../WABinary'
import { decryptGroupSignalProto, decryptSignalProto, processSenderKeyMessage } from './signal'
import { proto } from '../../WAProto'

type MessageType = 'chat' | 'peer_broadcast' | 'other_broadcast' | 'group' | 'direct_peer_status' | 'other_status'

export const decodeMessageStanza = async(stanza: BinaryNodeM, auth: AuthenticationState) => {
    const deviceIdentity = (stanza.content as BinaryNodeM[])?.find(m => m.tag === 'device-identity')
    const deviceIdentityBytes = deviceIdentity ? deviceIdentity.content as Buffer : undefined

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

    const successes: proto.Message[] = []
    const failures: { error: Boom }[] = []
    if(Array.isArray(stanza.content)) {
        for(const { tag, attrs, content } of stanza.content as BinaryNodeM[]) {
            if(tag !== 'enc') continue
            if(!Buffer.isBuffer(content) && !(content instanceof Uint8Array)) continue 

            try {
                let msgBuffer: Buffer

                const e2eType = attrs.type
                switch(e2eType) {
                    case 'skmsg':
                        msgBuffer = await decryptGroupSignalProto(sender, author, content, auth)
                    break
                    case 'pkmsg':
                    case 'msg':
                        const user = isJidUser(sender) ? sender : author
                        msgBuffer = await decryptSignalProto(user, e2eType, content as Buffer, auth)
                    break
                }
                const msg = proto.Message.decode(unpadRandomMax16(msgBuffer))
                if(msg.senderKeyDistributionMessage) {
                    await processSenderKeyMessage(author, msg.senderKeyDistributionMessage, auth)
                }

                successes.push(msg)
            } catch(error) {
                failures.push({ error: new Boom(error, { data: Buffer.from(encodeBinaryNode(stanza)).toString('base64') }) })
            }
        }
    }

    return {
        msgId,
        chatId,
        author,
        from,
        timestamp: +stanza.attrs.t,
        participant,
        recipient,
        pushname: stanza.attrs.notify,
        successes,
        failures
    }
}