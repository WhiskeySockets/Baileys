import BinaryNode from "../BinaryNode";
import { EventEmitter } from 'events'
import { SocketConfig, GroupModificationResponse, ParticipantAction, GroupMetadata, WAFlag, WAMetric, WAGroupCreateResponse, GroupParticipant } from "../Types";
import { generateMessageID, unixTimestampSeconds, whatsappID } from "../Utils/generics";
import makeMessagesSocket from "./messages";

const makeGroupsSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeMessagesSocket(config)
	const { 
		ev, 
		socketEvents,
		query,
		generateMessageTag,
		currentEpoch,
		setQuery,
		getState
	} = sock

	/** Generic function for group queries */
    const groupQuery = async(type: string, jid?: string, subject?: string, participants?: string[], additionalNodes?: BinaryNode[]) => {
        const tag = generateMessageTag()
        const result = await setQuery ([
			new BinaryNode(
				'group',
				{
					author: getState().user?.jid,
					id: tag,
					type: type,
					jid: jid,
					subject: subject,
				},
				participants ? 
				participants.map(jid => (
					new BinaryNode('participant', { jid })
				)) : 
				additionalNodes
			)
		], [WAMetric.group, 136], tag)
        return result
    }

    /** Get the metadata of the group from WA */
    const groupMetadataFull = async (jid: string) => {
        const metadata = await query({
			json: ['query', 'GroupMetadata', jid], 
			expect200: true
		}) 
        metadata.participants = metadata.participants.map(p => (
            { ...p, id: undefined, jid: whatsappID(p.id) }
        ))
		metadata.owner = whatsappID(metadata.owner)
        return metadata as GroupMetadata
    }
    /** Get the metadata (works after you've left the group also) */
    const groupMetadataMinimal = async (jid: string) => {
        const { attributes, data }:BinaryNode = await query({
			json: new BinaryNode(
				'query', 
				{type: 'group', jid: jid, epoch: currentEpoch().toString()}
			),
			binaryTag: [WAMetric.group, WAFlag.ignore], 
			expect200: true
		})
		const participants: GroupParticipant[] = []
		let desc: string | undefined
		if(Array.isArray(data) && Array.isArray(data[0].data)) {
			const nodes = data[0].data
			for(const item of nodes) {
				if(item.header === 'participant') {
					participants.push({
						jid: item.attributes.jid,
						isAdmin: item.attributes.type === 'admin',
						isSuperAdmin: false
					})
				} else if(item.header === 'description') {
					desc = (item.data as Buffer).toString('utf-8')
				}
			}
		}
        return {
            id: jid,
            owner: attributes?.creator,
            creator: attributes?.creator,
            creation: +attributes?.create,
            subject: null,
            desc,
            participants
        } as GroupMetadata
    }
	
	socketEvents.on('CB:Chat,cmd:action', (json: BinaryNode) => {
		/*const data = json[1].data
		if (data) {
			const emitGroupParticipantsUpdate = (action: WAParticipantAction) => this.emitParticipantsUpdate
			(json[1].id, data[2].participants.map(whatsappID), action)
			const emitGroupUpdate = (data: Partial<WAGroupMetadata>) => this.emitGroupUpdate(json[1].id, data)

			switch (data[0]) {
				case "promote":
					emitGroupParticipantsUpdate('promote')
					break
				case "demote":
					emitGroupParticipantsUpdate('demote')
					break
				case "desc_add":
					emitGroupUpdate({ ...data[2], descOwner: data[1] })
					break
				default:
					this.logger.debug({ unhandled: true }, json)
					break
			}
		}*/
	})

	return {
		...sock,
		groupMetadata: async(jid: string, minimal: boolean) => {
			let result: GroupMetadata

			if(minimal) result = await groupMetadataMinimal(jid)
			else result = await groupMetadataFull(jid)

			return result 
		},
		/**
		 * Create a group
		 * @param title like, the title of the group
		 * @param participants people to include in the group
		 */
		groupCreate: async (title: string, participants: string[]) => {
			const response = await groupQuery('create', null, title, participants) as WAGroupCreateResponse
			const gid = response.gid
			let metadata: GroupMetadata
			try {
				metadata = await groupMetadataFull(gid)
			} catch (error) {
				logger.warn (`error in group creation: ${error}, switching gid & checking`)
				// if metadata is not available
				const comps = gid.replace ('@g.us', '').split ('-')
				response.gid = `${comps[0]}-${+comps[1] + 1}@g.us`

				metadata = await groupMetadataFull(gid)
				logger.warn (`group ID switched from ${gid} to ${response.gid}`)
			}
			ev.emit('chats.upsert', [
				{
					jid: response.gid,
					name: title,
					t: unixTimestampSeconds(),
					count: 0
				}
			])
			return metadata
		},
		/**
		 * Leave a group
		 * @param jid the ID of the group
		 */
		groupLeave: async (jid: string) => {
			await groupQuery('leave', jid)
			ev.emit('chats.update', [ { jid, read_only: 'true' } ])
		},
		/**
		 * Update the subject of the group
		 * @param {string} jid the ID of the group
		 * @param {string} title the new title of the group
		 */
		groupUpdateSubject: async (jid: string, title: string) => {
			await groupQuery('subject', jid, title)
			ev.emit('chats.update', [ { jid, name: title } ])
			ev.emit('contacts.update', [ { jid, name: title } ])
			ev.emit('groups.update', [ { id: jid, subject: title } ])
		},
		/**
		 * Update the group description
		 * @param {string} jid the ID of the group
		 * @param {string} title the new title of the group
		 */
		groupUpdateDescription: async (jid: string, description: string) => {
			const metadata = await groupMetadataFull(jid)
			const node = new BinaryNode(
				'description',
				{id: generateMessageID(), prev: metadata?.descId},
				Buffer.from (description, 'utf-8')
			)
			const response = await groupQuery ('description', jid, null, null, [node])
			ev.emit('groups.update', [ { id: jid, desc: description } ])
			return response
		},
		/**
		 * Update participants in the group
		 * @param jid the ID of the group
		 * @param participants the people to add
		 */
		groupParticipantsUpdate: async(jid: string, participants: string[], action: ParticipantAction) => {
			const result: GroupModificationResponse = await groupQuery(action, jid, null, participants)
			const jids = Object.keys(result.participants || {})
			ev.emit('group-participants.update', { jid, participants: jids, action })
			return jids
		},
		/** Query broadcast list info */
		getBroadcastListInfo: async(jid: string) => { 
			interface WABroadcastListInfo {
				status: number
				name: string
				recipients?: {id: string}[]
			}
			
			const result = await query({ 
				json: ['query', 'contact', jid], 
				expect200: true, 
				requiresPhoneConnection: true
			}) as WABroadcastListInfo

			const metadata: GroupMetadata = {
				subject: result.name,
				id: jid,
				creation: undefined,
				owner: getState().user?.jid,
				participants: result.recipients!.map(({id}) => (
					{ jid: whatsappID(id), isAdmin: false, isSuperAdmin: false }
				))
			}
			return metadata
		}	
	}

}
export default makeGroupsSocket