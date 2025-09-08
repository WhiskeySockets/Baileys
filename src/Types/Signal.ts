import { proto } from '../../WAProto/index.js'
import type { LIDMappingStore } from '../Signal/lid-mapping'

type DecryptGroupSignalOpts = {
	group: string
	authorJid: string
	msg: Buffer
}

type ProcessSenderKeyDistributionMessageOpts = {
	item: proto.Message.ISenderKeyDistributionMessage
	authorJid: string
}

type DecryptSignalProtoOpts = {
	jid: string
	type: 'pkmsg' | 'msg'
	ciphertext: Buffer
}

type EncryptMessageOpts = {
	jid: string
	data: Buffer
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
	publicKey: Buffer
}

type SignedPreKey = PreKey & {
	signature: Buffer
}

type E2ESession = {
	registrationId: number
	identityKey: Buffer
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
	decryptMessage(opts: DecryptSignalProtoOpts): Promise<Buffer>
	encryptMessage(opts: EncryptMessageOpts): Promise<{
		type: 'pkmsg' | 'msg'
		ciphertext: Buffer
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
	validateSession(jid: string): Promise<{ exists: boolean; reason?: string }>
	jidToSignalProtocolAddress(jid: string): string
	storeLIDPNMapping(lid: string, pn: string): Promise<void>
	getLIDMappingStore(): LIDMappingStore
	migrateSession(fromJid: string, toJid: string): Promise<void>
	validateSession(jid: string): Promise<{ exists: boolean; reason?: string }>
	deleteSession(jid: string): Promise<void>
	destroy(): void
}
