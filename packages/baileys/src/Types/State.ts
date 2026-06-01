import { Boom } from '@hapi/boom'
import type { Contact } from './Contact'

export enum SyncState {
	/** The socket is connecting, but we haven't received pending notifications yet. */
	Connecting,
	/** Pending notifications received. Buffering events until we decide whether to sync or not. */
	AwaitingInitialSync,
	/** The initial app state sync (history, etc.) is in progress. Buffering continues. */
	Syncing,
	/** Initial sync is complete, or was skipped. The socket is fully operational and events are processed in real-time. */
	Online
}

export type WAConnectionState = 'open' | 'connecting' | 'close'

export type ConnectionState = {
	/** connection is now open, connecting or closed */
	connection: WAConnectionState

	/** the error that caused the connection to close */
	lastDisconnect?: {
		// TODO: refactor and gain independence from Boom
		error: Boom | Error | undefined
		date: Date
	}
	/** is this a new login */
	isNewLogin?: boolean
	/** the current QR code */
	qr?: string
	/** has the device received all pending notifications while it was offline */
	receivedPendingNotifications?: boolean
	/** legacy connection options */
	legacy?: {
		phoneConnected: boolean
		user?: Contact
	}
	/**
	 * if the client is shown as an active, online client.
	 * If this is false, the primary phone and other devices will receive notifs
	 * */
	isOnline?: boolean

	/**
	 * When you are in this state, WhatsApp prevents outgoing messages and calls.
	 */
	reachoutTimeLock?: ReachoutTimelockState
}

export type ReachoutTimelockState = {
	isActive?: boolean
	timeEnforcementEnds?: Date
	enforcementType?: ReachoutTimelockEnforcementType
}

export enum ReachoutTimelockEnforcementType {
	BIZ_COMMERCE_VIOLATION_ALCOHOL = 'BIZ_COMMERCE_VIOLATION_ALCOHOL',
	BIZ_COMMERCE_VIOLATION_ADULT = 'BIZ_COMMERCE_VIOLATION_ADULT',
	BIZ_COMMERCE_VIOLATION_ANIMALS = 'BIZ_COMMERCE_VIOLATION_ANIMALS',
	BIZ_COMMERCE_VIOLATION_BODY_PARTS_FLUIDS = 'BIZ_COMMERCE_VIOLATION_BODY_PARTS_FLUIDS',
	BIZ_COMMERCE_VIOLATION_DATING = 'BIZ_COMMERCE_VIOLATION_DATING',
	BIZ_COMMERCE_VIOLATION_DIGITAL_SERVICES_PRODUCTS = 'BIZ_COMMERCE_VIOLATION_DIGITAL_SERVICES_PRODUCTS',
	BIZ_COMMERCE_VIOLATION_DRUGS = 'BIZ_COMMERCE_VIOLATION_DRUGS',
	BIZ_COMMERCE_VIOLATION_DRUGS_ONLY_OTC = 'BIZ_COMMERCE_VIOLATION_DRUGS_ONLY_OTC',
	BIZ_COMMERCE_VIOLATION_GAMBLING = 'BIZ_COMMERCE_VIOLATION_GAMBLING',
	BIZ_COMMERCE_VIOLATION_HEALTHCARE = 'BIZ_COMMERCE_VIOLATION_HEALTHCARE',
	BIZ_COMMERCE_VIOLATION_REAL_FAKE_CURRENCY = 'BIZ_COMMERCE_VIOLATION_REAL_FAKE_CURRENCY',
	BIZ_COMMERCE_VIOLATION_SUPPLEMENTS = 'BIZ_COMMERCE_VIOLATION_SUPPLEMENTS',
	BIZ_COMMERCE_VIOLATION_TOBACCO = 'BIZ_COMMERCE_VIOLATION_TOBACCO',
	BIZ_COMMERCE_VIOLATION_VIOLENT_CONTENT = 'BIZ_COMMERCE_VIOLATION_VIOLENT_CONTENT',
	BIZ_COMMERCE_VIOLATION_WEAPONS = 'BIZ_COMMERCE_VIOLATION_WEAPONS',
	BIZ_QUALITY = 'BIZ_QUALITY',
	/** This means there is no restriction */
	DEFAULT = 'DEFAULT',
	WEB_COMPANION_ONLY = 'WEB_COMPANION_ONLY'
}

export enum NewChatMessageCappingStatusType {
	NONE = 'NONE',
	FIRST_WARNING = 'FIRST_WARNING',
	SECOND_WARNING = 'SECOND_WARNING',
	CAPPED = 'CAPPED'
}

export enum NewChatMessageCappingMVStatusType {
	NOT_ELIGIBLE = 'NOT_ELIGIBLE',
	NOT_ACTIVE = 'NOT_ACTIVE',
	ACTIVE = 'ACTIVE',
	ACTIVE_UPGRADE_AVAILABLE = 'ACTIVE_UPGRADE_AVAILABLE'
}

export enum NewChatMessageCappingOTEStatusType {
	NOT_ELIGIBLE = 'NOT_ELIGIBLE',
	ELIGIBLE = 'ELIGIBLE',
	ACTIVE_IN_CURRENT_CYCLE = 'ACTIVE_IN_CURRENT_CYCLE',
	EXHAUSTED = 'EXHAUSTED'
}

export type NewChatMessageCapInfo = {
	total_quota?: number
	used_quota?: number
	cycle_start_timestamp?: string
	cycle_end_timestamp?: string
	server_sent_timestamp?: string
	ote_status?: NewChatMessageCappingOTEStatusType
	mv_status?: NewChatMessageCappingMVStatusType
	capping_status?: NewChatMessageCappingStatusType
}
