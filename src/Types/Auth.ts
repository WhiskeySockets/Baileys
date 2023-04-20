import type { proto } from '../../WAProto'
import type { Contact } from './Contact'
import type { MinimalMessage } from './Message'

export type KeyPair = { public: Uint8Array, private: Uint8Array }
export type SignedKeyPair = {
    keyPair: KeyPair
    signature: Uint8Array
    keyId: number
    timestampS?: number
}

export type ProtocolAddress = {
	name: string // jid
	deviceId: number
}
export type SignalIdentity = {
	identifier: ProtocolAddress
	identifierKey: Uint8Array
}

export type LTHashState = {
    version: number
    hash: Buffer
    indexValueMap: {
        [indexMacBase64: string]: { valueMac: Uint8Array | Buffer }
    }
}

export type SignalCreds = {
    readonly signedIdentityKey: KeyPair
    readonly signedPreKey: SignedKeyPair
    readonly registrationId: number
}

export type AccountSettings = {
    /** unarchive chats when a new message is received */
    unarchiveChats: boolean
    /** the default mode to start new conversations with */
    defaultDisappearingMode?: Pick<proto.IConversation, 'ephemeralExpiration' | 'ephemeralSettingTimestamp'>
}

export type AuthenticationCreds = SignalCreds & {
    readonly noiseKey: KeyPair
    readonly advSecretKey: string

    me?: Contact
    account?: proto.IADVSignedDeviceIdentity
    signalIdentities?: SignalIdentity[]
    myAppStateKeyId?: string
    firstUnuploadedPreKeyId: number
    nextPreKeyId: number

    lastAccountSyncTimestamp?: number
    platform?: string

    processedHistoryMessages: MinimalMessage[]
    /** number of times history & app state has been synced */
    accountSyncCounter: number
    accountSettings: AccountSettings
}

export type SignalDataTypeMap = {
    'pre-key': KeyPair
    'session': Uint8Array
    'sender-key': Uint8Array
    'sender-key-memory': { [jid: string]: boolean }
    'app-state-sync-key': proto.Message.IAppStateSyncKeyData
    'app-state-sync-version': LTHashState
}

export type SignalDataSet = { [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] | null } }

type Awaitable<T> = T | Promise<T>

export type SignalKeyStore = {
    get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{ [id: string]: SignalDataTypeMap[T] }>
    set(data: SignalDataSet): Awaitable<void>
    /** clear all the data in the store */
    clear?(): Awaitable<void>
}

export type SignalKeyStoreWithTransaction = SignalKeyStore & {
    isInTransaction: () => boolean
    transaction(exec: () => Promise<void>): Promise<void>
}

export type TransactionCapabilityOptions = {
	maxCommitRetries: number
	delayBetweenTriesMs: number
}

export type SignalAuthState = {
    creds: SignalCreds
    keys: SignalKeyStore
}

export type AuthenticationState = {
    creds: AuthenticationCreds
    keys: SignalKeyStore
}