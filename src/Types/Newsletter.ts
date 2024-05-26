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
        reaction: 'ALL' | 'BASIC' | 'NONE' | 'BLOCKLlST'
    },
    mute?: 'ON' | 'OFF'
    role?: 'SUBSCRIBER' | 'GUEST' | 'ADMIN' | 'OWNER'
}