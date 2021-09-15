export interface Contact {
    id: string
    /** name of the contact, you have saved on your WA */
    name?: string
    /** name of the contact, the contact has set on their own on WA */
    notify?: string
    /** I have no idea */
    verifiedName?: string
    // Baileys Added
    imgUrl?: string
    status?: string
}