import { proto } from '../../WAProto'
import SessionRecord from '../Signal/Core/session_record'
import type { SenderKeyName } from '../Signal/Group/sender-key-name'
import type { SenderKeyRecord } from '../Signal/Group/sender-key-record'

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

export type E2ESession = {
	registrationId: number
	identityKey: Uint8Array
	signedPreKey: SignedPreKey
	preKey?: PreKey
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
	encryptGroupMessage(opts: EncryptGroupMessageOpts): Promise<{
		senderKeyDistributionMessage: Uint8Array
		ciphertext: Uint8Array
	}>
	injectE2ESession(opts: E2ESessionOpts): Promise<void>
	jidToSignalProtocolAddress(jid: string): string
}

// @TODO: later we need to merge the type from src/Types/Auth.ts
export type SignalKeyPair = {
	pubKey: Buffer
	privKey: Buffer
}

export interface SignalSessionStore {
	loadSession(id: string): Promise<SessionRecord | undefined>
	storeSession(id: string, record: SessionRecord): Promise<void>

	isTrustedIdentity(id: string, identityKey: Uint8Array): Promise<boolean>

	loadPreKey(id: number | string): Promise<SignalKeyPair | undefined>
	removePreKey(id: number): Promise<void>

	loadSignedPreKey(id: number | string): Promise<SignalKeyPair>

	getOurRegistrationId(): Promise<number>
	getOurIdentity(): Promise<SignalKeyPair>

	loadSenderKey(senderKeyName: SenderKeyName): Promise<SenderKeyRecord>
	storeSenderKey(senderKeyName: SenderKeyName, record: SenderKeyRecord): Promise<void>
}
