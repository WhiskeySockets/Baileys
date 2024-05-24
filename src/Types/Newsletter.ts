export type ReactionMode = 'ALL' | 'BASIC' | 'NONE'

export type State = 'ACTIVE' | 'GEOSUSPENDED' | 'SUSPENDED'

export type Verification = 'VERIFIED' | 'UNVERIFIED'

export type Mute = 'ON' | 'OFF' | 'UNDEFINED'

export type ViewRole = 'ADMIN' | 'GUEST' | 'OWNER' | 'SUBSCRIBER'

export type ViewerMetadata = {
    mute: Mute,
    view_role: ViewRole
}

export type NewsletterMetadata = {
    /**jid of newsletter */
    id: string,
    /**state of newsletter */
    state: State,
    /**creation timestamp of newsletter */
    creation_time: string,
    /**name of newsletter */
    name: string,
    /**timestamp of last name modification of newsletter */
    nameTime: string,
    /**description of newsletter */
    description: string,
    /**timestamp of last description modification of newsletter */
    descriptionTime: string,
    /**invite code of newsletter */
    invite: string,
    /**i dont know */
    handle: null,
    /**direct path of picture */
    picture?: string,
    /**direct path of picture preview (lower quality) */
    preview?: string,
    /**reaction mode of newsletter */
    reaction_codes: ReactionMode,
    /**subscribers count of newsletter */
    subscribers: number,
    /**verification state of newsletter */
    verification: Verification,
    /**viewer metadata */
    viewer_metadata: ViewerMetadata
}