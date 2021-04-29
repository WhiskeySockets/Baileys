import {WAConnection as Base} from './7.MessagesExtra'
import { WAMetric, WAFlag, WANode, WAGroupMetadata, WAGroupCreateResponse, WAGroupModification, BaileysError } from '../WAConnection/Constants'
import { GroupSettingChange } from './Constants'
import { generateMessageID, whatsappID } from '../WAConnection/Utils'
import { Mutex } from './Mutex'

export class WAConnection extends Base {
    /** Generic function for group queries */
    async groupQuery(type: string, jid?: string, subject?: string, participants?: string[], additionalNodes?: WANode[]) {
        const tag = this.generateMessageTag()
        const json: WANode = [
            'group',
            {
                author: this.user.jid,
                id: tag,
                type: type,
                jid: jid,
                subject: subject,
            },
            participants ? participants.map(jid => ['participant', { jid }, null]) : additionalNodes,
        ]
        const result = await this.setQuery ([json], [WAMetric.group, 136], tag)
        return result
    }
    /** 
     * Get the metadata of the group
     * Baileys automatically caches & maintains this state
     */
    @Mutex(jid => jid)
    async groupMetadata (jid: string) {
        const chat = this.chats.get(jid)
        let metadata = chat?.metadata
        if (!metadata) {
            if (chat?.read_only) {
                metadata = await this.groupMetadataMinimal(jid)
            } else {
                metadata = await this.fetchGroupMetadataFromWA(jid)
            }
            if (chat) chat.metadata = metadata
        }
        return metadata
    }
    /** Get the metadata of the group from WA */
    fetchGroupMetadataFromWA = async (jid: string) => {
        const metadata = await this.query({json: ['query', 'GroupMetadata', jid], expect200: true}) 
        metadata.participants = metadata.participants.map(p => (
            { ...this.contactAddOrGet(p.id), ...p }
        ))
        return metadata as WAGroupMetadata
    }
    /** Get the metadata (works after you've left the group also) */
    groupMetadataMinimal = async (jid: string) => {
        const query = ['query', {type: 'group', jid: jid, epoch: this.msgCount.toString()}, null]
        const response = await this.query({json: query, binaryTags: [WAMetric.group, WAFlag.ignore], expect200: true})
        const json = response[2][0]
        const creatorDesc = json[1]
        const participants = json[2] ? json[2].filter (item => item[0] === 'participant') : []
        const description = json[2] ? json[2].find (item => item[0] === 'description') : null
        return {
            id: jid,
            owner: creatorDesc?.creator,
            creator: creatorDesc?.creator,
            creation: parseInt(creatorDesc?.create),
            subject: null,
            desc: description && description[2].toString('utf-8'),
            participants: participants.map (item => (
                { ...this.contactAddOrGet(item[1].jid), isAdmin: item[1].type === 'admin' }
            ))
        } as WAGroupMetadata
    }
    /**
     * Create a group
     * @param title like, the title of the group
     * @param participants people to include in the group
     */
    groupCreate = async (title: string, participants: string[]) => {
        const response = await this.groupQuery('create', null, title, participants) as WAGroupCreateResponse
        const gid = response.gid
        let metadata: WAGroupMetadata
        try {
            metadata = await this.groupMetadata (gid)
        } catch (error) {
            this.logger.warn (`error in group creation: ${error}, switching gid & checking`)
            // if metadata is not available
            const comps = gid.replace ('@g.us', '').split ('-')
            response.gid = `${comps[0]}-${+comps[1] + 1}@g.us`

            metadata = await this.groupMetadata (gid)
            this.logger.warn (`group ID switched from ${gid} to ${response.gid}`)
        }
        await this.chatAdd(response.gid, title, { metadata })
        return response
    }
    /**
     * Leave a group
     * @param jid the ID of the group
     */
    groupLeave = async (jid: string) => {
        const response = await this.groupQuery('leave', jid)
        
        const chat = this.chats.get (jid)
        if (chat) chat.read_only = 'true'
        
        return response
    }
    /**
     * Update the subject of the group
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateSubject = async (jid: string, title: string) => {
        const chat = this.chats.get (jid)
        if (chat?.name === title) throw new BaileysError ('redundant change', { status: 400 })
        
        const response = await this.groupQuery('subject', jid, title)
        if (chat) chat.name = title
        
        return response
    }
        
    /**
     * Update the group description
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateDescription = async (jid: string, description: string) => {
        const metadata = await this.groupMetadata (jid)
        const node: WANode = [
            'description',
            {id: generateMessageID(), prev: metadata?.descId},
            Buffer.from (description, 'utf-8')
        ]
        const response = await this.groupQuery ('description', jid, null, null, [node])
        return response
    }
    /**
     * Add somebody to the group
     * @param jid the ID of the group
     * @param participants the people to add
     */
    groupAdd = (jid: string, participants: string[]) =>
        this.groupQuery('add', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Remove somebody from the group
     * @param jid the ID of the group
     * @param participants the people to remove
     */
    groupRemove = (jid: string, participants: string[]) =>
        this.groupQuery('remove', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Make someone admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupMakeAdmin = (jid: string, participants: string[]) =>
        this.groupQuery('promote', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Make demote an admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupDemoteAdmin = (jid: string, participants: string[]) =>
        this.groupQuery('demote', jid, null, participants) as Promise<WAGroupModification>
    /**
     * Make demote an admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupSettingChange = (jid: string, setting: GroupSettingChange, onlyAdmins: boolean) => {
        const node: WANode = [ setting, {value: onlyAdmins ? 'true' : 'false'}, null ]
        return this.groupQuery('prop', jid, null, null, [node]) as Promise<{status: number}>
    }
    /**
     * Get the invite link of the given group
     * @param jid the ID of the group
     * @returns invite code
     */
    async groupInviteCode(jid: string) {
        const json = ['query', 'inviteCode', jid]
        const response = await this.query({json, expect200: true, requiresPhoneConnection: false})
        return response.code as string
    }
    /**
     * Join group via invite code
     * @param code the invite code
     * @returns Object containing gid
     */
    async acceptInvite(code: string) {
        const json = ['action', 'invite', code]
        const response = await this.query({json, expect200: true})
        return response
    }
    /**
     * Revokes the current invite link for a group chat
     * @param jid the ID of the group
     */
    async revokeInvite(jid: string) {
        const json = ['action', 'inviteReset', jid]
        const response = await this.query({json, expect200: true})
        return response
    }
}
