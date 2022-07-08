import { GroupMetadata, GroupModificationResponse, GroupParticipant, LegacySocketConfig, ParticipantAction, WAFlag, WAGroupCreateResponse, WAMetric } from '../Types'
import { generateMessageID, unixTimestampSeconds } from '../Utils/generics'
import { BinaryNode, jidNormalizedUser } from '../WABinary'
import makeMessagesSocket from './messages'

const makeGroupsSocket = (config: LegacySocketConfig) => {
	const { logger } = config
	const sock = makeMessagesSocket(config)
	const {
		ev,
		ws: socketEvents,
		query,
		generateMessageTag,
		currentEpoch,
		setQuery,
		state
	} = sock

	/** Generic function for group queries */
	const groupQuery = async(type: string, jid?: string, subject?: string, participants?: string[], additionalNodes?: BinaryNode[]) => {
		const tag = generateMessageTag()
		const result = await setQuery ([
			{
				tag: 'group',
				attrs: {
					author: state.legacy?.user?.id!,
					id: tag,
					type: type,
					jid: jid!,
					subject: subject!,
				},
				content: participants ?
					participants.map(jid => (
						{ tag: 'participant', attrs: { jid } }
					)) :
					additionalNodes
			}
		], [WAMetric.group, 136], tag)
		return result
	}

	/** Get the metadata of the group from WA */
	const groupMetadataFull = async(jid: string) => {
		const metadata = await query({
			json: ['query', 'GroupMetadata', jid],
			expect200: true
		})

		const meta: GroupMetadata = {
			id: metadata.id,
			subject: metadata.subject,
			creation: +metadata.creation,
			owner: metadata.owner ? jidNormalizedUser(metadata.owner) : undefined,
			desc: metadata.desc,
			descOwner: metadata.descOwner,
			participants: metadata.participants.map(
				p => ({
					id: jidNormalizedUser(p.id),
					admin: p.isSuperAdmin ? 'super-admin' : p.isAdmin ? 'admin' : undefined
				})
			),
			ephemeralDuration: metadata.ephemeralDuration
		}

		return meta
	}

	/** Get the metadata (works after you've left the group also) */
	const groupMetadataMinimal = async(jid: string) => {
		const { attrs, content }:BinaryNode = await query({
			json: {
				tag: 'query',
				attrs: { type: 'group', jid: jid, epoch: currentEpoch().toString() }
			},
			binaryTag: [WAMetric.group, WAFlag.ignore],
			expect200: true
		})
		const participants: GroupParticipant[] = []
		let desc: string | undefined
		if(Array.isArray(content) && Array.isArray(content[0].content)) {
			const nodes = content[0].content
			for(const item of nodes) {
				if(item.tag === 'participant') {
					participants.push({
						id: item.attrs.jid,
						isAdmin: item.attrs.type === 'admin',
						isSuperAdmin: false
					})
				} else if(item.tag === 'description') {
					desc = (item.content as Buffer).toString('utf-8')
				}
			}
		}

		const meta: GroupMetadata = {
			id: jid,
			owner: attrs?.creator,
			creation: +attrs?.create,
			subject: '',
			desc,
			participants
		}
		return meta
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

			if(minimal) {
				result = await groupMetadataMinimal(jid)
			} else {
				result = await groupMetadataFull(jid)
			}

			return result
		},
		/**
		 * Create a group
		 * @param title like, the title of the group
		 * @param participants people to include in the group
		 */
		groupCreate: async(title: string, participants: string[]) => {
			const response = await groupQuery('create', undefined, title, participants) as WAGroupCreateResponse
			const gid = response.gid!
			let metadata: GroupMetadata
			try {
				metadata = await groupMetadataFull(gid)
			} catch(error) {
				logger.warn (`error in group creation: ${error}, switching gid & checking`)
				// if metadata is not available
				const comps = gid.replace ('@g.us', '').split ('-')
				response.gid = `${comps[0]}-${+comps[1] + 1}@g.us`

				metadata = await groupMetadataFull(gid)
				logger.warn (`group ID switched from ${gid} to ${response.gid}`)
			}

			ev.emit('chats.upsert', [
				{
					id: response.gid!,
					name: title,
					conversationTimestamp: unixTimestampSeconds(),
					unreadCount: 0
				}
			])
			return metadata
		},
		/**
		 * Leave a group
		 * @param jid the ID of the group
		 */
		groupLeave: async(id: string) => {
			await groupQuery('leave', id)
			ev.emit('chats.update', [ { id, readOnly: true } ])
		},
		/**
		 * Update the subject of the group
		 * @param {string} jid the ID of the group
		 * @param {string} title the new title of the group
		 */
		groupUpdateSubject: async(id: string, title: string) => {
			await groupQuery('subject', id, title)
			ev.emit('chats.update', [ { id, name: title } ])
			ev.emit('contacts.update', [ { id, name: title } ])
			ev.emit('groups.update', [ { id: id, subject: title } ])
		},
		/**
		 * Update the group description
		 * @param {string} jid the ID of the group
		 * @param {string} title the new title of the group
		 */
		groupUpdateDescription: async(jid: string, description: string) => {
			const metadata = await groupMetadataFull(jid)
			const node: BinaryNode = {
				tag: 'description',
				attrs: { id: generateMessageID(), prev: metadata?.descId! },
				content: Buffer.from(description, 'utf-8')
			}

			const response = await groupQuery('description', jid, undefined, undefined, [node])
			ev.emit('groups.update', [ { id: jid, desc: description } ])
			return response
		},
		/**
		 * Update participants in the group
		 * @param jid the ID of the group
		 * @param participants the people to add
		 */
		groupParticipantsUpdate: async(id: string, participants: string[], action: ParticipantAction) => {
			const result: GroupModificationResponse = await groupQuery(action, id, undefined, participants)
			const jids = Object.keys(result.participants || {})
			ev.emit('group-participants.update', { id, participants: jids, action })
			return Object.keys(result.participants || {}).map(
				jid => ({ jid, status: result.participants?.[jid] })
			)
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
				owner: state.legacy?.user?.id,
				participants: result.recipients!.map(({ id }) => (
					{ id: jidNormalizedUser(id), isAdmin: false, isSuperAdmin: false }
				))
			}
			return metadata
		},
		groupInviteCode: async(jid: string) => {
			const response = await sock.query({
				json: ['query', 'inviteCode', jid],
				expect200: true,
				requiresPhoneConnection: false
			})
			return response.code as string
		}
	}

}

export default makeGroupsSocket