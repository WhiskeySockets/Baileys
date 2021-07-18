import {WAConnection as Base} from './4.Events'
import { Presence, WABroadcastListInfo, WAProfilePictureChange, WALoadChatOptions, WAChatIndex, BlocklistUpdate, WABusinessProfile } from './Constants'
import {
    WAMessage,
    WANode,
    WAMetric,
    WAFlag,
} from '../WAConnection/Constants'
import { generateProfilePicture, whatsappID } from './Utils'
import { Mutex } from './Mutex'
import { URL } from 'url'

// All user related functions -- get profile picture, set status etc.

export class WAConnection extends Base {
    /** 
     * Query whether a given number is registered on WhatsApp
     * @param str phone number/jid you want to check for
     * @returns undefined if the number doesn't exists, otherwise the correctly formatted jid
     */
    isOnWhatsApp = async (str: string) => {
        const { status, jid, biz } = await this.query({json: ['query', 'exist', str], requiresPhoneConnection: false})
        if (status === 200) return { exists: true, jid: whatsappID(jid), isBusiness: biz as boolean}
    }
    /**
     * Tell someone about your presence -- online, typing, offline etc.
     * @param jid the ID of the person/group who you are updating
     * @param type your presence
     */
    updatePresence = (jid: string | null, type: Presence) => this.sendBinary(
        [   'action', 
            {epoch: this.msgCount.toString(), type: 'set'},
            [ ['presence', { type: type, to: jid }, null] ]
        ],
        [WAMetric.presence, WAFlag[type] ], // weird stuff WA does
        undefined,
        true
    )
    /** Request an update on the presence of a user */
    requestPresenceUpdate = async (jid: string) => this.query({ json: ['action', 'presence', 'subscribe', jid] })
    /** Query the status of the person (see groupMetadata() for groups) */
    async getStatus (jid?: string) {
        const status: { status: string } = await this.query({ json: ['query', 'Status', jid || this.user.jid], requiresPhoneConnection: false })
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
        this.emit ('contact-update', { jid: this.user.jid, status })
        return response
    }
    /** Updates business profile. */
    async updateBusinessProfile(profile: WABusinessProfile) {
        if (profile.business_hours?.config) {
            profile.business_hours.business_config = profile.business_hours.config
            delete profile.business_hours.config
        }
        const json = ['action', "editBusinessProfile", {...profile, v: 2}]
        let response;
        try {
            response = await this.query({ json, expect200: true, requiresPhoneConnection: true })
        } catch (_) {
            return {status: 400}
        } 
        return { status: response.status }
    }
    async updateProfileName (name: string) {
        const response = (await this.setQuery (
            [
                [
                    'profile',
                    {
                        name
                    },
                    null
                ]
            ]
        )) as any as {status: number, pushname: string}
        if (response.status === 200) {
            this.user.name = response.pushname;
            this.emit ('contact-update', { jid: this.user.jid, name })
        }
        return response
    }
    /** Get your contacts */
    async getContacts() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'contacts' }, null]
        const response = await this.query({ json, binaryTags: [WAMetric.queryContact, WAFlag.ignore], expect200: true, requiresPhoneConnection: true }) // this has to be an encrypted query
        return response
    }
    /** Get the stories of your contacts */
    async getStories() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'status' }, null]
        const response = await this.query({json, binaryTags: [WAMetric.queryStatus, WAFlag.ignore], expect200: true, requiresPhoneConnection: true }) as WANode
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
    async getBroadcastListInfo(jid: string) { 
        return this.query({
            json: ['query', 'contact', jid], 
            expect200: true, 
            requiresPhoneConnection: true
        }) as Promise<WABroadcastListInfo> 
    }
    /**
     * Load chats in a paginated manner + gets the profile picture
     * @param before chats before the given cursor
     * @param count number of results to return
     * @param searchString optionally search for users
     * @returns the chats & the cursor to fetch the next page
     */
    loadChats (count: number, before: string | null, options: WALoadChatOptions = {}) {
        const searchString = options.searchString?.toLowerCase()
        const chats = this.chats.paginated (before, count, options && (chat => (
            (typeof options?.custom !== 'function' || options?.custom(chat)) &&
            (typeof searchString === 'undefined' || chat.name?.toLowerCase().includes (searchString) || chat.jid?.includes(searchString))
        )))
        const cursor = (chats[chats.length-1] && chats.length >= count) && this.chatOrderingKey.key (chats[chats.length-1])
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
     * Add or remove user from blocklist
     * @param jid the ID of the person who you are blocking/unblocking
     * @param type type of operation
     */
    @Mutex (jid => jid)
    async blockUser (jid: string, type: 'add' | 'remove' = 'add') {
        const json: WANode = [
            'block',
            {
                type: type,
            },
            [
                ['user', { jid }, null]
            ],
        ]
        const result = await this.setQuery ([json], [WAMetric.block, WAFlag.ignore])

        if (result.status === 200) {
            if (type === 'add') {
                this.blocklist.push(jid)
            } else {
                const index = this.blocklist.indexOf(jid);
                if (index !== -1) {
                    this.blocklist.splice(index, 1);
                }
            }

            // Blocklist update event
            const update: BlocklistUpdate = { added: [], removed: [] }
            let key = type === 'add' ? 'added' : 'removed'
            update[key] = [ jid ]
            this.emit('blocklist-update', update)
        }

        return result
    }
    /**
     * Query Business Profile (Useful for VCards)
     * @param jid Business Jid
     * @returns {WABusinessProfile} profile object or undefined if not business account
     */
    async getBusinessProfile(jid: string) {
        jid = whatsappID(jid)
        const {
            profiles: [{
                profile,
                wid 
            }]
        } = await this.query({
            json: ["query", "businessProfile", [
                {
                    "wid": jid.replace('@s.whatsapp.net', '@c.us')
                }
            ], 84],
            expect200: true,
            requiresPhoneConnection: false,
        })
        return {
            ...profile,
            wid: whatsappID(wid)
        }
    }
}
