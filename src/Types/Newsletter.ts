export enum MexOperations {
	NotificationNewsletterAdminPromote = 'notification_newsletter_admin_promote',
	NotificationNewsletterCreate = 'notification_newsletter_create',
	NotificationNewsletterUpdate = 'notification_newsletter_update'
}

export enum XWAPaths {
	xwa2_newsletter_create = 'xwa2_newsletter_create',
	xwa2_newsletter_metadata = 'xwa2_newsletter_metadata',
	xwa2_newsletter_follow = 'xwa2_newsletter_follow',
	xwa2_newsletter_unfollow = 'xwa2_newsletter_unfollow',
	xwa2_newsletter_mute = 'xwa2_newsletter_mute',
	xwa2_newsletter_unmute = 'xwa2_newsletter_unmute',
	xwa2_newsletter_update_name = 'xwa2_newsletter_update_name',
	xwa2_newsletter_update_description = 'xwa2_newsletter_update_description',
	xwa2_newsletter_update_picture = 'xwa2_newsletter_update_picture',
	xwa2_newsletter_fetch_messages = 'xwa2_newsletter_fetch_messages',
	xwa2_newsletter_react_message = 'xwa2_newsletter_react_message'
}

export enum QueryIds {
	CREATE = '8823471724422422',
	SEND_MESSAGE = '25652179902648530',
	UPDATE_METADATA = '24250201037901610'
	// METADATA = '30328461880085868',
	// FOLLOW = '25828729351659754',
	// UNFOLLOW = '26322968335588385',
	// MUTE = '26293699938539345',
	// UNMUTE = '27532553881297531',
	// UPDATE_PICTURE = '25737299994070529',
	// FETCH_MESSAGES = '25914917409605391',
	// REACT_MESSAGE = '27993859068412869',
}

export type NewsletterUpdate = {
	name?: string
	description?: string
}
export interface NewsletterCreateResponse {
	id: string
	state: { type: string }
	thread_metadata: {
		creation_time: string
		description: { id: string; text: string; update_time: string }
		handle: string | null
		invite: string
		name: { id: string; text: string; update_time: string }
		picture: { direct_path: string; id: string; type: string }
		preview: { direct_path: string; id: string; type: string }
		subscribers_count: string
		verification: 'VERIFIED' | 'UNVERIFIED'
	}
	viewer_metadata: {
		mute: 'ON' | 'OFF'
		role: NewsletterViewRole
	}
}
export interface NewsletterCreateResponse {
	id: string
	state: { type: string }
	thread_metadata: {
		creation_time: string
		description: { id: string; text: string; update_time: string }
		handle: string | null
		invite: string
		name: { id: string; text: string; update_time: string }
		picture: { direct_path: string; id: string; type: string }
		preview: { direct_path: string; id: string; type: string }
		subscribers_count: string
		verification: 'VERIFIED' | 'UNVERIFIED'
	}
	viewer_metadata: {
		mute: 'ON' | 'OFF'
		role: NewsletterViewRole
	}
}

export type NewsletterViewRole = 'ADMIN' | 'GUEST' | 'OWNER' | 'SUBSCRIBER'

export type SubscriberAction = 'promote' | 'demote'

export interface NewsletterMetadata {
	id: string
	owner?: string // The owner of the newsletter, if available
	name: string
	description?: string
	invite?: string
	creation_time?: number
	subscribers?: number
	picture?: {
		url?: string
		directPath?: string
		mediaKey?: string
		id?: string
	}
	verification?: 'VERIFIED' | 'UNVERIFIED'
	reaction_codes?: {
		code: string
		count: number
	}[]
	mute_state?: 'ON' | 'OFF'
	thread_metadata?: {
		creation_time?: number
		name?: string
		description?: string
	}
}

export interface NewsletterViewerMetadata {
	role: NewsletterViewRole
	mute?: 'ON' | 'OFF'
}

export interface NewsletterFetchedUpdate {
	server_id: string
	views?: number
	reactions?: {
		code: string
		count: number
	}[]
	message?: any // This would be the actual WAProto.IWebMessageInfo
}

export interface NewsletterSettingsUpdate {
	name?: string
	description?: string
	picture?: {
		url?: string
		directPath?: string
		mediaKey?: string
		id?: string
	}
	verification?: 'VERIFIED' | 'UNVERIFIED'
	mute_state?: 'ON' | 'OFF'
}

export interface NewsletterReaction {
	id: string
	server_id: string
	reaction: {
		code?: string
		count?: number
		removed?: boolean
	}
}

export interface NewsletterView {
	id: string
	server_id: string
	count: number
}

export interface NewsletterParticipantUpdate {
	id: string
	author: string
	user: string
	new_role: NewsletterViewRole
	action: SubscriberAction
}
