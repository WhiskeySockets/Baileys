import type EventEmitter from "events"

import { AuthenticationCreds } from './Auth'
import { Chat, PresenceData } from './Chat'
import { Contact } from './Contact'
import { ConnectionState } from './State'

import { GroupMetadata, ParticipantAction } from './GroupMetadata'
import { MessageInfoUpdate, MessageUpdateType, WAMessage, WAMessageUpdate, WAMessageKey } from './Message'

export type BaileysEventMap<T> = {
    /** connection state has been updated -- WS closed, opened, connecting etc. */
	'connection.update': Partial<ConnectionState>
    /** credentials updated -- some metadata, keys or something */
    'creds.update': Partial<T>
    /** set chats (history sync), messages are reverse chronologically sorted */
    'chats.set': { chats: Chat[], messages: WAMessage[], contacts: Contact[] }
    /** upsert chats */
    'chats.upsert': Chat[]
    /** update the given chats */
    'chats.update': Partial<Chat>[]
    /** delete chats with given ID */
    'chats.delete': string[]
    /** presence of contact in a chat updated */
    'presence.update': { id: string, presences: { [participant: string]: PresenceData }  }

    'contacts.upsert': Contact[]
    'contacts.update': Partial<Contact>[] 
    
    'messages.delete': { keys: WAMessageKey[] } | { jid: string, all: true }
    'messages.update': WAMessageUpdate[]
    /** 
     * add/update the given messages. If they were received while the connection was online, 
     * the update will have type: "notify"
     *  */
    'messages.upsert': { messages: WAMessage[], type: MessageUpdateType }

    'message-info.update': MessageInfoUpdate[]

    'groups.upsert': GroupMetadata[]
    'groups.update': Partial<GroupMetadata>[]
    /** apply an action to participants in a group */
    'group-participants.update': { id: string, participants: string[], action: ParticipantAction }

    'blocklist.set': { blocklist: string[] }
    'blocklist.update': { blocklist: string[], type: 'add' | 'remove' }
}

export interface CommonBaileysEventEmitter<Creds> extends EventEmitter {
	on<T extends keyof BaileysEventMap<Creds>>(event: T, listener: (arg: BaileysEventMap<Creds>[T]) => void): this
    off<T extends keyof BaileysEventMap<Creds>>(event: T, listener: (arg: BaileysEventMap<Creds>[T]) => void): this
    removeAllListeners<T extends keyof BaileysEventMap<Creds>>(event: T): this
	emit<T extends keyof BaileysEventMap<Creds>>(event: T, arg: BaileysEventMap<Creds>[T]): boolean
}

export type BaileysEventEmitter = CommonBaileysEventEmitter<AuthenticationCreds>