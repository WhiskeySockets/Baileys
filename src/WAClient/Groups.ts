import WhatsAppWebBase from './Base'
import { WAMessage, WAMetric, WAFlag, WANode, WAGroupMetadata, WAGroupCreateResponse, WAGroupModification } from '../WAConnection/Constants'
import { GroupSettingChange } from './Constants'
import { generateMessageID } from '../WAConnection/Utils'

export default class WhatsAppWebGroups extends WhatsAppWebBase {
    /** Generic function for group queries */
    async groupQuery(type: string, jid?: string, subject?: string, participants?: string[], additionalNodes?: WANode[]) {
        const tag = this.generateMessageTag()
        const json: WANode = [
            'group',
            {
                author: this.userMetaData.id,
                id: tag,
                type: type,
                jid: jid,
                subject: subject,
            },
            participants ? participants.map(str => ['participant', { jid: str }, null]) : additionalNodes,
        ]
        const result = await this.setQuery ([json], [WAMetric.group, WAFlag.ignore], tag)
        return result
    }
    /** Get the metadata of the group */
    groupMetadata = (jid: string) => this.queryExpecting200(['query', 'GroupMetadata', jid]) as Promise<WAGroupMetadata>
    /** Get the metadata (works after you've left the group also) */
    groupMetadataMinimal = async (jid: string) => {
        const query = ['query', {type: 'group', jid: jid, epoch: this.msgCount.toString()}, null]
        const response = await this.queryExpecting200(query, [WAMetric.group, WAFlag.ignore])
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
            desc: description ? description[2].toString('utf-8') : null,
            participants: participants.map (item => ({ id: item[1].jid, isAdmin: item[1].type==='admin' }))
        } as WAGroupMetadata
    }
    /**
     * Create a group
     * @param title like, the title of the group
     * @param participants people to include in the group
     */
    groupCreate = (title: string, participants: string[]) =>
        this.groupQuery('create', null, title, participants) as Promise<WAGroupCreateResponse>
    /**
     * Leave a group
     * @param jid the ID of the group
     */
    groupLeave = (jid: string) => this.groupQuery('leave', jid) as Promise<{ status: number }>
    /**
     * Update the subject of the group
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateSubject = (jid: string, title: string) =>
        this.groupQuery('subject', jid, title) as Promise<{ status: number }>
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
        return this.groupQuery ('description', jid, null, null, [node])
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
    /** Get the invite link of the given group */
    async groupInviteCode(jid: string) {
        const json = ['query', 'inviteCode', jid]
        const response = await this.queryExpecting200(json)
        return response.code as string
    }
}