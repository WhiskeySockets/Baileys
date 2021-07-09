export interface Contact {
    verify?: string
    /** name of the contact, the contact has set on their own on WA */
    notify?: string
    jid: string
    /** I have no idea */
    vname?: string
    /** name of the contact, you have saved on your WA */
    name?: string
    index?: string
    /** short name for the contact */
    short?: string
    // Baileys Added
    imgUrl?: string
    status?: string
}