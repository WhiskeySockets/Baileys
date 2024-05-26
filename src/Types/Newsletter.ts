export type RoleNewsLetter = 'SUBSCRIBER' | 'GUEST' | 'ADMIN' | 'OWNER'

export type RectionSettingsNewsletter = 'ALL' | 'BASIC' | 'NONE' | 'BLOCKLIST'

export interface NewsLetterMetadata {
    id: string
    state: 'ACTIVE' | 'SUSPENDED' | 'GEOSUSPENDED'
    creationTime: number
    inviteCode: string
    name: string
    desc: string
    subscriberCount: number
    verification: 'VERIFIED' | 'UNVERIFIED'
    picture?: string
    preview?: string
    settings: {
        reaction: RectionSettingsNewsletter
    }
    mute?: 'ON' | 'OFF'
    role?: RoleNewsLetter
}