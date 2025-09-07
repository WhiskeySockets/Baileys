import { proto } from '../../WAProto/index.js'
import type { LIDMappingStore } from '../Signal/lid-mapping'

type DecryptGroupSignalOpts = {
	group: string
	authorJid: string
	msg: Uint8Array
}

type ProcessSenderKeyDistributionMessageOpts = {
	item: proto.Message.ISenderKeyDistributionMessage
	authorJid: string
}

type DecryptSignalProtoOpts = {
	jid: string
	type: 'pkmsg' | 'msg'
	ciphertext: Uint8Array
}

type EncryptMessageOpts = {
	jid: string
	data: Uint8Array
}

type EncryptMessageWithWireOpts = {
	encryptionJid: string // JID used for session lookup (LID)
	wireJid: string // JID used for envelope (PN)
	data: Uint8Array
}

type EncryptGroupMessageOpts = {
	group: string
	data: Uint8Array
	meId: string
}

type PreKey = {
	keyId: number
	publicKey: Uint8Array
}

type SignedPreKey = PreKey & {
	signature: Uint8Array
}

type E2ESession = {
	registrationId: number
	identityKey: Uint8Array
	signedPreKey: SignedPreKey
	preKey: PreKey
}

type E2ESessionOpts = {
	jid: string
	session: E2ESession
}

export type SignalRepository = {
	decryptGroupMessage(opts: DecryptGroupSignalOpts): Promise<Uint8Array>
	processSenderKeyDistributionMessage(opts: ProcessSenderKeyDistributionMessageOpts): Promise<void>
	decryptMessage(opts: DecryptSignalProtoOpts): Promise<Uint8Array>
	encryptMessage(opts: EncryptMessageOpts): Promise<{
		type: 'pkmsg' | 'msg'
		ciphertext: Uint8Array
	}>
	encryptMessageWithWire(opts: EncryptMessageWithWireOpts): Promise<{
		type: 'pkmsg' | 'msg'
		ciphertext: Uint8Array
		wireJid: string // Return the wire JID for envelope
	}>
	encryptGroupMessage(opts: EncryptGroupMessageOpts): Promise<{
		senderKeyDistributionMessage: Uint8Array
		ciphertext: Uint8Array
	}>
	injectE2ESession(opts: E2ESessionOpts): Promise<void>
	jidToSignalProtocolAddress(jid: string): string
	storeLIDPNMapping(lid: string, pn: string): Promise<void>
	getLIDMappingStore(): LIDMappingStore
	migrateSession(fromJid: string, toJid: string): Promise<void>
	validateSession(jid: string): Promise<{ exists: boolean; reason?: string }>
	deleteSession(jid: string): Promise<void>
	destroy(): void
}
