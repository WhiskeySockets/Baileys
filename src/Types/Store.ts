import type KeyedDB from '@adiwajshing/keyed-db'
import type { Chat } from './Chat'
import type { Contact } from './Contact'

export type WAConnectionState = 'open' | 'connecting' | 'close'

export type ConnectionState = {
	user?: Contact
	phoneConnected: boolean
	phoneInfo?: any
	connection: WAConnectionState
	lastDisconnect?: {
		error: Error,
		date: Date
	},
	isNewLogin?: boolean
	connectionTriesLeft?: number
	qr?: string
}

export type BaileysState = {
	connection: ConnectionState
	chats: KeyedDB<Chat, string>
	contacts: { [jid: string]: Contact }
}