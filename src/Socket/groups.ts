import { proto } from '../../WAProto'
import { GroupMetadata, ParticipantAction, SocketConfig, WAMessageKey, WAMessageStubType } from '../Types'
import { generateMessageID, unixTimestampSeconds } from '../Utils'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString, jidEncode, jidNormalizedUser } from '../WABinary'
import { makeChatsSocket } from './chats'

export const makeGroupsSocket = (config: SocketConfig) => {
	const sock = makeChatsSocket(config)
	const { authState, ev, query, upsertMessage } = sock

	const groupQuery = async(jid: string, type: 'get' | 'set', content: BinaryNode[]) => (
		query({
			tag: 'iq',
			attrs: {
				type,
				xmlns: 'w:g2',
				to: jid,
			},
			content
		})
	)

	const groupMetadata = async(jid: string) => {
		const result = await groupQuery(
			jid,
			'get',
			[ { tag: 'query', attrs: { request: 'interactive' } } ]
		)
		return extractGroupMetadata(result)
	}

	return {
		...sock,
		groupMetadata,
		groupCreate: async(subject: string, participants: string[]) => {
			const key = generateMessageID()
			const result = await groupQuery(
				'@g.us',
				'set',
				[
					{
						tag: 'create',
						attrs: {
							subject,
							key
						},
						content: participants.map(jid => ({
							tag: 'participant',
							attrs: { jid }
						}))
					}
				]
			)
			return extractGroupMetadata(result)
		},
		groupLeave: async(id: string) => {
			await groupQuery(
				'@g.us',
				'set',
				[
					{
						tag: 'leave',
						attrs: { },
						content: [
							{ tag: 'group', attrs: { id } }
						]
					}
				]
			)
		},
		groupUpdateSubject: async(jid: string, subject: string) => {
			await groupQuery(
				jid,
				'set',
				[
					{
						tag: 'subject',
						attrs: { },
						content: Buffer.from(subject, 'utf-8')
					}
				]
			)
		},
		groupParticipantsUpdate: async(
			jid: string,
			participants: string[],
			action: ParticipantAction
		) => {
			const result = await groupQuery(
				jid,
				'set',
				[
					{
						tag: action,
						attrs: { },
						content: participants.map(jid => ({
							tag: 'participant',
							attrs: { jid }
						}))
					}
				]
			)
			const node = getBinaryNodeChild(result, action)
			const participantsAffected = getBinaryNodeChildren(node!, 'participant')
			return participantsAffected.map(p => {
				return { status: p.attrs.error || '200', jid: p.attrs.jid }
			})
		},
		groupUpdateDescription: async(jid: string, description?: string) => {
			const metadata = await groupMetadata(jid)
			const prev = metadata.descId ?? null

			await groupQuery(
				jid,
				'set',
				[
					{
						tag: 'description',
						attrs: {
							...(description ? { id: generateMessageID() } : { delete: 'true' }),
							...(prev ? { prev } : {})
						},
						content: description ? [
							{ tag: 'body', attrs: {}, content: Buffer.from(description, 'utf-8') }
						] : undefined
					}
				]
			)
		},
		groupInviteCode: async(jid: string) => {
			const result = await groupQuery(jid, 'get', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		groupRevokeInvite: async(jid: string) => {
			const result = await groupQuery(jid, 'set', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		groupAcceptInvite: async(code: string) => {
			const results = await groupQuery('@g.us', 'set', [{ tag: 'invite', attrs: { code } }])
			const result = getBinaryNodeChild(results, 'group')
			return result?.attrs.jid
		},
		/**
		 * accept a GroupInviteMessage
		 * @param key the key of the invite message, or optionally only provide the jid of the person who sent the invite
		 * @param inviteMessage the message to accept
		 */
		groupAcceptInviteV4: ev.createBufferedFunction(async(key: string | WAMessageKey, inviteMessage: proto.Message.IGroupInviteMessage) => {
			key = typeof key === 'string' ? { remoteJid: key } : key
			const results = await groupQuery(inviteMessage.groupJid!, 'set', [{
				tag: 'accept',
				attrs: {
					code: inviteMessage.inviteCode!,
					expiration: inviteMessage.inviteExpiration!.toString(),
					admin: key.remoteJid!
				}
			}])

			// if we have the full message key
			// update the invite message to be expired
			if(key.id) {
				// create new invite message that is expired
				inviteMessage = proto.Message.GroupInviteMessage.fromObject(inviteMessage)
				inviteMessage.inviteExpiration = 0
				inviteMessage.inviteCode = ''
				ev.emit('messages.update', [
					{
						key,
						update: {
							message: {
								groupInviteMessage: inviteMessage
							}
						}
					}
				])
			}

			// generate the group add message
			await upsertMessage(
				{
					key: {
						remoteJid: inviteMessage.groupJid,
						id: generateMessageID(),
						fromMe: false,
						participant: key.remoteJid,
					},
					messageStubType: WAMessageStubType.GROUP_PARTICIPANT_ADD,
					messageStubParameters: [
						authState.creds.me!.id
					],
					participant: key.remoteJid,
					messageTimestamp: unixTimestampSeconds()
				},
				'notify'
			)

			return results.attrs.from
		}),
		groupGetInviteInfo: async(code: string) => {
			const results = await groupQuery('@g.us', 'get', [{ tag: 'invite', attrs: { code } }])
			return extractGroupMetadata(results)
		},
		groupToggleEphemeral: async(jid: string, ephemeralExpiration: number) => {
			const content: BinaryNode = ephemeralExpiration ?
				{ tag: 'ephemeral', attrs: { expiration: ephemeralExpiration.toString() } } :
				{ tag: 'not_ephemeral', attrs: { } }
			await groupQuery(jid, 'set', [content])
		},
		groupSettingUpdate: async(jid: string, setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked') => {
			await groupQuery(jid, 'set', [ { tag: setting, attrs: { } } ])
		},
		groupFetchAllParticipating: async() => {
			const result = await query({
				tag: 'iq',
				attrs: {
					to: '@g.us',
					xmlns: 'w:g2',
					type: 'get',
				},
				content: [
					{
						tag: 'participating',
						attrs: { },
						content: [
							{ tag: 'participants', attrs: { } },
							{ tag: 'description', attrs: { } }
						]
					}
				]
			})
			const data: { [_: string]: GroupMetadata } = { }
			const groupsChild = getBinaryNodeChild(result, 'groups')
			if(groupsChild) {
				const groups = getBinaryNodeChildren(groupsChild, 'group')
				for(const groupNode of groups) {
					const meta = extractGroupMetadata({
						tag: 'result',
						attrs: { },
						content: [groupNode]
					})
					data[meta.id] = meta
				}
			}

			return data
		}
	}
}


export const extractGroupMetadata = (result: BinaryNode) => {
	const group = getBinaryNodeChild(result, 'group')!
	const descChild = getBinaryNodeChild(group, 'description')
	let desc: string | undefined
	let descId: string | undefined
	if(descChild) {
		desc = getBinaryNodeChildString(descChild, 'body')
		descId = descChild.attrs.id
	}

	const groupId = group.attrs.id.includes('@') ? group.attrs.id : jidEncode(group.attrs.id, 'g.us')
	const eph = getBinaryNodeChild(group, 'ephemeral')?.attrs.expiration
	const metadata: GroupMetadata = {
		id: groupId,
		subject: group.attrs.subject,
		subjectOwner: group.attrs.s_o,
		subjectTime: +group.attrs.s_t,
		size: +group.attrs.size,
		creation: +group.attrs.creation,
		owner: group.attrs.creator ? jidNormalizedUser(group.attrs.creator) : undefined,
		desc,
		descId,
		restrict: !!getBinaryNodeChild(group, 'locked'),
		announce: !!getBinaryNodeChild(group, 'announcement'),
		participants: getBinaryNodeChildren(group, 'participant').map(
			({ attrs }) => {
				return {
					id: attrs.jid,
					admin: attrs.type || null as any,
				}
			}
		),
		ephemeralDuration: eph ? +eph : undefined
	}
	return metadata
}
