import { proto } from '../../WAProto'

export type NewsletterReactionMode = 'ALL' | 'BASIC' | 'NONE'

export type NewsletterState = 'ACTIVE' | 'GEOSUSPENDED' | 'SUSPENDED'

export type NewsletterVerification = 'VERIFIED' | 'UNVERIFIED'

export type NewsletterMute = 'ON' | 'OFF' | 'UNDEFINED'

export type NewsletterViewRole = 'ADMIN' | 'GUEST' | 'OWNER' | 'SUBSCRIBER'

export type NewsletterViewerMetadata = {
    mute: NewsletterMute
    view_role: NewsletterViewRole
}

export type NewsletterMetadata = {
    /**jid of newsletter */
    id: string
    /**state of newsletter */
    state: NewsletterState
    /**creation timestamp of newsletter */
    creation_time: number
    /**name of newsletter */
    name: string
    /**timestamp of last name modification of newsletter */
    nameTime: number
    /**description of newsletter */
    description: string
    /**timestamp of last description modification of newsletter */
    descriptionTime: number
    /**invite code of newsletter */
    invite: string
    /**i dont know */
    handle: null
    /**direct path of picture */
    picture: string | null
    /**direct path of picture preview (lower quality) */
    preview: string | null
    /**reaction mode of newsletter */
    reaction_codes?: NewsletterReactionMode
    /**subscribers count of newsletter */
    subscribers: number
    /**verification state of newsletter */
    verification: NewsletterVerification
    /**viewer metadata */
    viewer_metadata: NewsletterViewerMetadata
}

export type SubscriberAction = 'promote' | 'demote'

export type ReactionModeUpdate = {reaction_codes: {blocked_codes: null, enabled_ts_sec: null, value: NewsletterReactionMode}}

/**only exists reaction mode update */
export type NewsletterSettingsUpdate = ReactionModeUpdate

export type NewsletterReaction = {count: number, code: string}

export type NewsletterFetchedUpdate = {
    /**id of message in newsletter, starts from 100 */
    server_id: string
    /**count of views in this message */
    views?: number
    /**reactions in this message */
    reactions: NewsletterReaction[]
    /**the message, if you requested only updates, you will not receive message */
    message?: proto.IWebMessageInfo
}

export enum MexOperations {
    PROMOTE = 'NotificationNewsletterAdminPromote',
    DEMOTE = 'NotificationNewsletterAdminDemote',
    UPDATE = 'NotificationNewsletterUpdate'
}

export enum XWAPaths {
    PROMOTE = 'xwa2_notify_newsletter_admin_promote',
    DEMOTE = 'xwa2_notify_newsletter_admin_demote',
    ADMIN_COUNT = 'xwa2_newsletter_admin',
    CREATE = 'xwa2_newsletter_create',
    NEWSLETTER = 'xwa2_newsletter',
    METADATA_UPDATE = 'xwa2_notify_newsletter_on_metadata_update'
}

export enum QueryIds {
    JOB_MUTATION = '7150902998257522',
    METADATA = '6620195908089573',
    UNFOLLOW = '7238632346214362',
    FOLLOW = '7871414976211147',
    UNMUTE = '7337137176362961',
    MUTE = '25151904754424642',
    CREATE = '6996806640408138',
    ADMIN_COUNT = '7130823597031706',
    CHANGE_OWNER = '7341777602580933',
    DELETE = '8316537688363079',
    DEMOTE = '6551828931592903'
}