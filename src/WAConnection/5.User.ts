import {WAConnection as Base} from './4.Events'
import { Presence, WABroadcastListInfo, WAProfilePictureChange, WAChat, ChatModification } from './Constants'
import {
    WAMessage,
    WANode,
    WAMetric,
    WAFlag,
} from '../WAConnection/Constants'
import { generateProfilePicture, waChatUniqueKey, whatsappID, unixTimestampSeconds } from './Utils'
import { Mutex } from './Mutex'

// All user related functions -- get profile picture, set status etc.

export class WAConnection extends Base {
    /** Query whether a given number is registered on WhatsApp */
    isOnWhatsApp = (jid: string) => this.query({json: ['query', 'exist', jid]}).then((m) => m.status === 200)
    /**
     * Tell someone about your presence -- online, typing, offline etc.
     * @param jid the ID of the person/group who you are updating
     * @param type your presence
     */
    updatePresence = (jid: string | null, type: Presence) =>
        this.query(
            {
                json: [
                    'action',
                    { epoch: this.msgCount.toString(), type: 'set' },
                    [['presence', { type: type, to: jid }, null]],
                ], 
                binaryTags: [WAMetric.group, WAFlag.acknowledge], 
                expect200: true
            }
        ) as Promise<{status: number}>
    /** Request an update on the presence of a user */
    requestPresenceUpdate = async (jid: string) => this.query({ json: ['action', 'presence', 'subscribe', jid] })
    /** Query the status of the person (see groupMetadata() for groups) */
    async getStatus (jid?: string) {
        const status: { status: string } = await this.query({ json: ['query', 'Status', jid || this.user.jid] })
        return status
    }
    async setStatus (status: string) {
        const response = await this.setQuery (
            [
                [
                    'status',
                    null,
                    Buffer.from (status, 'utf-8')
                ]
            ]
        ) 
        this.emit ('user-status-update', { jid: this.user.jid, status })
        return response
    }
    /** Get your contacts */
    async getContacts() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'contacts' }, null]
        const response = await this.query({ json, binaryTags: [6, WAFlag.ignore], expect200: true }) // this has to be an encrypted query
        return response
    }
    /** Get the stories of your contacts */
    async getStories() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'status' }, null]
        const response = await this.query({json, binaryTags: [30, WAFlag.ignore], expect200: true}) as WANode
        if (Array.isArray(response[2])) {
            return response[2].map (row => (
                { 
                    unread: row[1]?.unread, 
                    count: row[1]?.count, 
                    messages: Array.isArray(row[2]) ? row[2].map (m => m[2]) : []
                } as {unread: number, count: number, messages: WAMessage[]}
            ))
        }
        return []
    }
    /** Fetch your chats */
    async getChats() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'chat' }, null]
        return this.query({ json, binaryTags: [5, WAFlag.ignore], expect200: true }) // this has to be an encrypted query
    }
    /** Query broadcast list info */
    async getBroadcastListInfo(jid: string) { return this.query({json: ['query', 'contact', jid], expect200: true}) as Promise<WABroadcastListInfo> }
    /** Delete the chat of a given ID */
    async deleteChat (jid: string) {
        const response = await this.setQuery ([ ['chat', {type: 'delete', jid: jid}, null] ], [12, WAFlag.ignore]) as {status: number}
        const chat = this.chats.get (jid)
        if (chat) {
            this.chats.delete (chat)
            this.emit ('chat-update', { jid, delete: 'true' })
        }
        return response
    }
    /**
     * Load chats in a paginated manner + gets the profile picture
     * @param before chats before the given cursor
     * @param count number of results to return
     * @param searchString optionally search for users
     * @returns the chats & the cursor to fetch the next page
     */
    async loadChats (count: number, before: number | null, filters?: {searchString?: string, custom?: (c: WAChat) => boolean}) {
        const chats = this.chats.paginated (before, count, filters && (chat => (
            (typeof filters?.custom !== 'function' || filters?.custom(chat)) &&
            (typeof filters?.searchString === 'undefined' || chat.name?.includes (filters.searchString) || chat.jid?.startsWith(filters.searchString))
        )))
        await Promise.all (
            chats.map (async chat => (
                chat.imgUrl === undefined && await this.setProfilePicture (chat)
            ))
        )
        const cursor = (chats[chats.length-1] && chats.length >= count) ? waChatUniqueKey (chats[chats.length-1]) : null
        return { chats, cursor }
    }
    /**
     * Update the profile picture
     * @param jid 
     * @param img 
     */
    @Mutex (jid => jid)
    async updateProfilePicture (jid: string, img: Buffer) {
        jid = whatsappID (jid)
        const data = await generateProfilePicture (img)
        const tag = this.generateMessageTag ()
        const query: WANode = [
            'picture', 
            { jid: jid, id: tag, type: 'set' }, 
            [
                ['image', null, data.img],
                ['preview', null, data.preview]
            ]
        ]
        const response = await (this.setQuery ([query], [WAMetric.picture, 136], tag) as Promise<WAProfilePictureChange>)
        if (jid === this.user.jid) this.user.imgUrl = response.eurl
        else if (this.chats.get(jid)) {
            this.chats.get(jid).imgUrl = response.eurl
            this.emit ('chat-update', { jid, imgUrl: response.eurl })
        }
        return response
    }
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     * @param durationMs only for muting, how long to mute the chat for
     */
    @Mutex ((jid, type) => jid+type)
    async modifyChat (jid: string, type: ChatModification, durationMs?: number) {
        jid = whatsappID (jid)
        const chat = this.assertChatGet (jid)

        let chatAttrs: Record<string, string> = {jid: jid}
        if (type === ChatModification.mute && !durationMs) {
            throw new Error('duration must be set to the timestamp of the time of pinning/unpinning of the chat')
        }

        durationMs = durationMs || 0
        switch (type) {
            case ChatModification.pin:
            case ChatModification.mute:
                const strStamp = (unixTimestampSeconds() + Math.floor(durationMs/1000)).toString()
                chatAttrs.type = type
                chatAttrs[type] = strStamp
                break
            case ChatModification.unpin:
            case ChatModification.unmute:
                chatAttrs.type = type.replace ('un', '') // replace 'unpin' with 'pin'
                chatAttrs.previous = chat[type.replace ('un', '')]
                break
            default:
                chatAttrs.type = type
                break
        }

        const response = await this.setQuery ([['chat', chatAttrs, null]])

        if (chat) {
            if (type.includes('un')) {
                type = type.replace ('un', '') as ChatModification
                delete chat[type.replace('un','')]
                this.emit ('chat-update', { jid, [type]: false })
            } else {
                chat[type] = chatAttrs[type] || 'true'
                this.emit ('chat-update', { jid, [type]: chat[type] })
            }
        }

        return response
    }
}
