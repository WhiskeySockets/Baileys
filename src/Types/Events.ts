import type { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { AuthenticationCreds } from './Auth'
import { WACallEvent } from './Call'
import { Chat, PresenceData } from './Chat'
import { Contact } from './Contact'
import { GroupMetadata, ParticipantAction } from './GroupMetadata'
import { MessageUpsertType, MessageUserReceiptUpdate, WAMessage, WAMessageKey, WAMessageUpdate } from './Message'
import { ConnectionState } from './State'

export type BaileysEventMap<T> = {
    /** connection state has been updated -- WS closed, opened, connecting etc. */
	'connection.update': Partial<ConnectionState>
    /** credentials updated -- some metadata, keys or something */
    'creds.update': Partial<T>
    /** set chats (history sync), chats are reverse chronologically sorted */
    'chats.set': { chats: Chat[], isLatest: boolean }
    /** set messages (history sync), messages are reverse chronologically sorted */
    'messages.set': { messages: WAMessage[], isLatest: boolean }
    /** set contacts (history sync) */
    'contacts.set': { contacts: Contact[], isLatest: boolean }
    /** upsert chats */
    'chats.upsert': Chat[]
    /** update the given chats */
    'chats.update': Partial<Chat>[]
    /** delete chats with given ID */
    'chats.delete': string[]
    /** presence of contact in a chat updated */
    'presence.update': { id: string, presences: { [participant: string]: PresenceData } }

    'contacts.upsert': Contact[]
    'contacts.update': Partial<Contact>[]

    'messages.delete': { keys: WAMessageKey[] } | { jid: string, all: true }
    'messages.update': WAMessageUpdate[]
    'messages.media-update': { key: WAMessageKey, media?: { ciphertext: Uint8Array, iv: Uint8Array }, error?: Boom }[]
    /**
     * add/update the given messages. If they were received while the connection was online,
     * the update will have type: "notify"
     *  */
    'messages.upsert': { messages: WAMessage[], type: MessageUpsertType }
    /** message was reacted to. If reaction was removed -- then "reaction.text" will be falsey */
    'messages.reaction': { key: WAMessageKey, reaction: proto.IReaction }[]

    'message-receipt.update': MessageUserReceiptUpdate[]

    'groups.upsert': GroupMetadata[]
    'groups.update': Partial<GroupMetadata>[]
    /** apply an action to participants in a group */
    'group-participants.update': { id: string, participants: string[], action: ParticipantAction }

    'blocklist.set': { blocklist: string[] }
    'blocklist.update': { blocklist: string[], type: 'add' | 'remove' }
    /** Receive an update on a call, including when the call was received, rejected, accepted */
    'call': WACallEvent[]
}

export type BufferedEventData = {
    chatUpserts: { [jid: string]: Chat }
    chatUpdates: { [jid: string]: Partial<Chat> }
    chatDeletes: Set<string>
    contactUpserts: { [jid: string]: Contact }
    contactUpdates: { [jid: string]: Partial<Contact> }
    messageUpserts: { [key: string]: { type: MessageUpsertType, message: WAMessage } }
    messageUpdates: { [key: string]: WAMessageUpdate }
    messageDeletes: { [key: string]: WAMessageKey }
    messageReactions: { [key: string]: { key: WAMessageKey, reactions: proto.IReaction[] } }
    messageReceipts: { [key: string]: { key: WAMessageKey, userReceipt: proto.IUserReceipt[] } },
    groupUpdates: { [jid: string]: Partial<GroupMetadata> }
}

export type BaileysEvent = keyof BaileysEventMap<any>

export interface CommonBaileysEventEmitter<Creds> {
	on<T extends keyof BaileysEventMap<Creds>>(event: T, listener: (arg: BaileysEventMap<Creds>[T]) => void): void
    off<T extends keyof BaileysEventMap<Creds>>(event: T, listener: (arg: BaileysEventMap<Creds>[T]) => void): void
    removeAllListeners<T extends keyof BaileysEventMap<Creds>>(event: T): void
	emit<T extends keyof BaileysEventMap<Creds>>(event: T, arg: BaileysEventMap<Creds>[T]): boolean
}

export type BaileysEventEmitter = CommonBaileysEventEmitter<AuthenticationCreds>