import type { proto } from '../../WAProto/index.js'
import type { Contact } from './Contact'
import type { MinimalMessage } from './Message'

export type KeyPair = { public: Uint8Array; private: Uint8Array }
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

export type LIDMapping = {
	pn: string
	lid: string
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
	readonly pairingEphemeralKeyPair: KeyPair
	advSecretKey: string

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
	registered: boolean
	pairingCode: string | undefined
	lastPropHash: string | undefined
	routingInfo: Buffer | undefined
	additionalData?: any | undefined
}

export type SignalDataTypeMap = {
	'pre-key': KeyPair
	session: Uint8Array
	'sender-key': Uint8Array
	'sender-key-memory': { [jid: string]: boolean }
	'app-state-sync-key': proto.Message.IAppStateSyncKeyData
	'app-state-sync-version': LTHashState
	'lid-mapping': string
	'device-list': string[]
	tctoken: { token: Buffer; timestamp?: string; senderTimestamp?: number }
	'identity-key': Uint8Array
}

export type SignalDataSet = { [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] | null } }

/** Names of the typed records a {@link SignalKeyStore} holds. */
export type SignalDataType = keyof SignalDataTypeMap

/** Identifies one (type, id) record in the key store — the unit of locking. */
export type RecordRef = {
	type: SignalDataType
	id: string
}

type Awaitable<T> = T | Promise<T>

export type SignalKeyStore = {
	get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{ [id: string]: SignalDataTypeMap[T] }>
	set(data: SignalDataSet): Awaitable<void>
	/** clear all the data in the store */
	clear?(): Awaitable<void>
	/**
	 * Enumerate every (id, value) pair for a type. Optional so existing user-implemented
	 * stores keep compiling; required by `migrateAuthState` and bulk operations. Adapters
	 * should stream rather than buffer the whole result set into memory.
	 */
	list?<T extends keyof SignalDataTypeMap>(type: T): AsyncIterable<readonly [id: string, value: SignalDataTypeMap[T]]>
	/**
	 * Ids-only fast path for enumeration. Optional. Adapters that can satisfy this
	 * without reading values (e.g. SQL `SELECT id`) should implement it; callers that
	 * need values can still fall back to `list`.
	 */
	listIds?<T extends keyof SignalDataTypeMap>(type: T): AsyncIterable<string>
}

/**
 * Scope declaration for {@link SignalKeyStoreWithTransaction.transactWith}.
 *
 * The records list names every (type, id) pair the transaction will read or
 * write. Locks are acquired in a deterministic sorted order via the
 * LockManager, so two transactions with overlapping scope acquired in opposite
 * orders cannot deadlock against each other.
 */
export type TransactionScope = {
	records: readonly RecordRef[]
}

export type SignalKeyStoreWithTransaction = SignalKeyStore & {
	isInTransaction: () => boolean
	/**
	 * @deprecated Use {@link SignalKeyStoreWithRecordTransaction.transactWith}
	 * (available on stores built via Baileys' `addTransactionCapability`),
	 * which acquires record-identifier-keyed locks rather than a single
	 * caller-chosen string key. Scheduled for removal in v8.
	 *
	 * Stage 2 fixed the nested-bypass behavior (H0): re-entering this method
	 * with a key not already held by an outer transaction now acquires its
	 * own lock instead of silently sharing the outer's lock. Same-key nested
	 * calls still bypass (re-entry safety).
	 */
	transaction<T>(exec: () => Promise<T>, key: string): Promise<T>
	/**
	 * Optional record-scoped transaction surface. Added in Stage 2 as an
	 * **additive** capability — existing user-implemented stores that only
	 * provide `transaction()` keep compiling. Baileys' own
	 * `addTransactionCapability` returns a store that implements it; internal
	 * callers narrow to {@link SignalKeyStoreWithRecordTransaction} when
	 * they need a non-optional surface.
	 *
	 * @see SignalKeyStoreWithRecordTransaction for the required-method variant.
	 */
	transactWith?<T>(scope: TransactionScope, work: () => Promise<T>): Promise<T>
}

/**
 * Variant of {@link SignalKeyStoreWithTransaction} that requires
 * `transactWith`. Baileys' own `addTransactionCapability` returns this
 * concrete shape, so internal call sites (`libsignal`, `messages-send`,
 * etc.) get the precise method signature without needing to null-check the
 * optional `transactWith` field on every call.
 *
 * Third-party stores can opt in by implementing this interface explicitly
 * when they're ready for the record-scoped API. Stores that only implement
 * the legacy `transaction()` continue to satisfy
 * {@link SignalKeyStoreWithTransaction} and stay compatible.
 */
export type SignalKeyStoreWithRecordTransaction = SignalKeyStoreWithTransaction & {
	transactWith<T>(scope: TransactionScope, work: () => Promise<T>): Promise<T>
}

export type TransactionCapabilityOptions = {
	maxCommitRetries: number
	delayBetweenTriesMs: number
}

export type SignalAuthState = {
	creds: SignalCreds
	keys: SignalKeyStore | SignalKeyStoreWithTransaction
}

export type AuthenticationState = {
	creds: AuthenticationCreds
	keys: SignalKeyStore
}
