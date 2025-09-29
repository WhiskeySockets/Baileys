import { proto } from '../../WAProto/index.js'
import type { GroupMetadata, GroupParticipant, ParticipantAction, SocketConfig, WAMessageKey } from '../Types'
import { WAMessageAddressingMode, WAMessageStubType } from '../Types'
import { generateMessageIDV2, unixTimestampSeconds } from '../Utils'
import {
	type BinaryNode,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	getBinaryNodeChildString,
	isLidUser,
	isPnUser,
	jidEncode,
	jidNormalizedUser
} from '../WABinary'
import { makeChatsSocket } from './chats'

const XMLNS_G2 = 'w:g2'
const GROUP_TAG = 'group'
const MEMBERSHIP_APPROVAL_REQUESTS = 'membership_approval_requests'
const MEMBER_ADD_MODE = 'member_add_mode'

export const makeGroupsSocket = (config: SocketConfig) => {
	const sock = makeChatsSocket(config)
	const { authState, ev, query, upsertMessage } = sock

	const groupQuery = async (jid: string, type: 'get' | 'set', content: BinaryNode[]): Promise<BinaryNode> =>
		query({
			tag: 'iq',
			attrs: {
				type,
				xmlns: XMLNS_G2,
				to: jid
			},
			content
		})

	const groupMetadata = async (jid: string): Promise<GroupMetadata> => {
		const result = await groupQuery(jid, 'get', [{ tag: 'query', attrs: { request: 'interactive' } }])
		return extractGroupMetadata(result)
	}

	const groupFetchAllParticipating = async (): Promise<{ [key: string]: GroupMetadata }> => {
		const result = await query({
			tag: 'iq',
			attrs: {
				to: '@g.us',
				xmlns: XMLNS_G2,
				type: 'get'
			},
			content: [
				{
					tag: 'participating',
					attrs: {},
					content: [
						{ tag: 'participants', attrs: {} },
						{ tag: 'description', attrs: {} }
					]
				}
			]
		})
		const data: { [key: string]: GroupMetadata } = {}
		const groupsChild = getBinaryNodeChild(result, 'groups')
		if (groupsChild) {
			const groups = getBinaryNodeChildren(groupsChild, GROUP_TAG)
			for (const groupNode of groups) {
				const meta = extractGroupMetadata({
					tag: 'result',
					attrs: {},
					content: [groupNode]
				})
				data[meta.id] = meta
			}
		}

		sock.ev.emit('groups.update', Object.values(data))

		return data
	}

	sock.ws.on('CB:ib,,dirty', async (node: BinaryNode): Promise<void> => {
		const dirtyNode = getBinaryNodeChild(node, 'dirty')
		if (!dirtyNode) {
			logger.error('No dirty node found')
			return
		}
		const { attrs } = dirtyNode
		if (attrs.type !== 'groups') {
			return
		}

		await groupFetchAllParticipating()
		await sock.cleanDirtyBits('groups')
	})

	return {
		...sock,
		groupMetadata,
		groupCreate: async (subject: string, participants: string[]): Promise<GroupMetadata> => {
			const key = generateMessageIDV2()
			const result = await groupQuery('@g.us', 'set', [
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
			])
			return extractGroupMetadata(result)
		},
		groupLeave: async (id: string): Promise<void> => {
			await groupQuery('@g.us', 'set', [
				{
					tag: 'leave',
					attrs: {},
					content: [{ tag: GROUP_TAG, attrs: { id } }]
				}
			])
		},
		groupUpdateSubject: async (jid: string, subject: string): Promise<void> => {
			await groupQuery(jid, 'set', [
				{
					tag: 'subject',
					attrs: {},
					content: Buffer.from(subject, 'utf-8')
				}
			])
		},
		groupRequestParticipantsList: async (jid: string): Promise<{ [key: string]: string }[]> => {
			const result = await groupQuery(jid, 'get', [
				{
					tag: MEMBERSHIP_APPROVAL_REQUESTS,
					attrs: {}
				}
			])
			const node = getBinaryNodeChild(result, MEMBERSHIP_APPROVAL_REQUESTS)
			if (!node) {
				return []
			}
			const participants = getBinaryNodeChildren(node, 'membership_approval_request')
			return participants.map(v => v.attrs)
		},
		groupRequestParticipantsUpdate: async (
			jid: string,
			participants: string[],
			action: 'approve' | 'reject'
		): Promise<{ status: string, jid: string }[]> => {
			const result = await groupQuery(jid, 'set', [
				{
					tag: 'membership_requests_action',
					attrs: {},
					content: [
						{
							tag: action,
							attrs: {},
							content: participants.map(jid => ({
								tag: 'participant',
								attrs: { jid }
							}))
						}
					]
				}
			])
			const node = getBinaryNodeChild(result, 'membership_requests_action')
			if (!node) {
				return []
			}
			const nodeAction = getBinaryNodeChild(node, action)
			if (!nodeAction) {
				return []
			}
			const participantsAffected = getBinaryNodeChildren(nodeAction, 'participant')
			return participantsAffected.map(p => ({
				status: p.attrs.error || '200',
				jid: jidNormalizedUser(p.attrs.jid)
			}))
		},
		groupParticipantsUpdate: async (
			jid: string,
			participants: string[],
			action: ParticipantAction
		): Promise<{ status: string, jid: string, content: BinaryNode }[]> => {
			const result = await groupQuery(jid, 'set', [
				{
					tag: action,
					attrs: {},
					content: participants.map(jid => ({
						tag: 'participant',
						attrs: { jid }
					}))
				}
			])
			const node = getBinaryNodeChild(result, action)
			if (!node) {
				return []
			}
			const participantsAffected = getBinaryNodeChildren(node, 'participant')
			return participantsAffected.map(p => ({
				status: p.attrs.error || '200',
				jid: jidNormalizedUser(p.attrs.jid),
				content: p
			}))
		},
		groupUpdateDescription: async (jid: string, description?: string): Promise<void> => {
			const metadata = await groupMetadata(jid)
			const prev = metadata.descId ?? null

			await groupQuery(jid, 'set', [
				{
					tag: 'description',
					attrs: {
						...(description ? { id: generateMessageIDV2() } : { delete: 'true' }),
						...(prev ? { prev } : {})
					},
					content: description ? [{ tag: 'body', attrs: {}, content: Buffer.from(description, 'utf-8') }] : undefined
				}
			])
		},
		groupInviteCode: async (jid: string): Promise<string | undefined> => {
			const result = await groupQuery(jid, 'get', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		groupRevokeInvite: async (jid: string): Promise<string | undefined> => {
			const result = await groupQuery(jid, 'set', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		groupAcceptInvite: async (code: string): Promise<string | undefined> => {
			const results = await groupQuery('@g.us', 'set', [{ tag: 'invite', attrs: { code } }])
			const result = getBinaryNodeChild(results, GROUP_TAG)
			return result?.attrs.jid
		},
		/**
		 * Revoke a v4 invite for someone
		 * @param groupJid group JID
		 * @param invitedJid JID of the person invited
		 * @returns true if successful
		 */
		groupRevokeInviteV4: async (groupJid: string, invitedJid: string): Promise<boolean> => {
			const result = await groupQuery(groupJid, 'set', [
				{ tag: 'revoke', attrs: {}, content: [{ tag: 'participant', attrs: { jid: invitedJid } }] }
			])
			return !!result
		},
		/**
		 * Accept a GroupInviteMessage
		 * @param key the key of the invite message, or optionally only provide the JID of the person who sent the invite
		 * @param inviteMessage the message to accept
		 */
		groupAcceptInviteV4: ev.createBufferedFunction(
			async (key: string | WAMessageKey, inviteMessage: proto.Message.IGroupInviteMessage): Promise<string | undefined> => {
				key = typeof key === 'string' ? { remoteJid: key } : key
				const results = await groupQuery(inviteMessage.groupJid!, 'set', [
					{
						tag: 'accept',
						attrs: {
							code: inviteMessage.inviteCode!,
							expiration: inviteMessage.inviteExpiration!.toString(),
							admin: key.remoteJid!
						}
					}
				])

				if (key.id) {
					const updatedInviteMessage = proto.Message.GroupInviteMessage.create(inviteMessage)
					updatedInviteMessage.inviteExpiration = 0
					updatedInviteMessage.inviteCode = ''
					ev.emit('messages.update', [
						{
							key,
							update: {
								message: {
									groupInviteMessage: updatedInviteMessage
								}
							}
						}
					])
				}

				await upsertMessage(
					{
						key: {
							remoteJid: inviteMessage.groupJid,
							id: generateMessageIDV2(sock.user?.id),
							fromMe: false,
							participant: key.remoteJid
						},
						messageStubType: WAMessageStubType.GROUP_PARTICIPANT_ADD,
						messageStubParameters: [jidNormalizedUser(authState.creds.me!.id)],
						participant: key.remoteJid,
						messageTimestamp: unixTimestampSeconds()
					},
					'notify'
				)

				return results.attrs.from
			}
		),
		groupGetInviteInfo: async (code: string): Promise<GroupMetadata> => {
			const results = await groupQuery('@g.us', 'get', [{ tag: 'invite', attrs: { code } }])
			return extractGroupMetadata(results)
		},
		groupToggleEphemeral: async (jid: string, ephemeralExpiration: number): Promise<void> => {
			const content: BinaryNode = ephemeralExpiration
				? { tag: 'ephemeral', attrs: { expiration: ephemeralExpiration.toString() } }
				: { tag: 'not_ephemeral', attrs: {} }
			await groupQuery(jid, 'set', [content])
		},
		groupSettingUpdate: async (
			jid: string,
			setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
		): Promise<void> => {
			await groupQuery(jid, 'set', [{ tag: setting, attrs: {} }])
		},
		groupMemberAddMode: async (jid: string, mode: 'admin_add' | 'all_member_add'): Promise<void> => {
			await groupQuery(jid, 'set', [{ tag: MEMBER_ADD_MODE, attrs: {}, content: mode }])
		},
		groupJoinApprovalMode: async (jid: string, mode: 'on' | 'off'): Promise<void> => {
			await groupQuery(jid, 'set', [
				{ tag: 'membership_approval_mode', attrs: {}, content: [{ tag: 'group_join', attrs: { state: mode } }] }
			])
		},
		groupFetchAllParticipating
	}
}

export const extractGroupMetadata = (result: BinaryNode): GroupMetadata => {
	const group = getBinaryNodeChild(result, GROUP_TAG)
	if (!group) {
		throw new Error('Group node not found in result')
	}
	const descChild = getBinaryNodeChild(group, 'description')
	let desc: string | undefined
	let descId: string | undefined
	let descOwner: string | undefined
	let descOwnerPn: string | undefined
	let descTime: number | undefined
	if (descChild) {
		desc = getBinaryNodeChildString(descChild, 'body')
		descOwner = descChild.attrs.participant ? jidNormalizedUser(descChild.attrs.participant) : undefined
		descOwnerPn = descChild.attrs.participant_pn ? jidNormalizedUser(descChild.attrs.participant_pn) : undefined
		descTime = descChild.attrs.t ? +descChild.attrs.t : undefined
		descId = descChild.attrs.id
	}

	const groupId = group.attrs.id?.includes('@') ? group.attrs.id : jidEncode(group.attrs.id || '', 'g.us')
	const eph = getBinaryNodeChild(group, 'ephemeral')?.attrs.expiration
	const memberAddMode = getBinaryNodeChildString(group, MEMBER_ADD_MODE) === 'all_member_add'
	const metadata: GroupMetadata = {
		id: groupId,
		notify: group.attrs.notify,
		addressingMode: group.attrs.addressing_mode === 'lid' ? WAMessageAddressingMode.LID : WAMessageAddressingMode.PN,
		subject: group.attrs.subject || '',
		subjectOwner: group.attrs.s_o,
		subjectOwnerPn: group.attrs.s_o_pn,
		subjectTime: group.attrs.s_t ? +group.attrs.s_t : 0,
		size: group.attrs.size ? +group.attrs.size : getBinaryNodeChildren(group, 'participant').length,
		creation: group.attrs.creation ? +group.attrs.creation : 0,
		owner: group.attrs.creator ? jidNormalizedUser(group.attrs.creator) : undefined,
		ownerPn: group.attrs.creator_pn ? jidNormalizedUser(group.attrs.creator_pn) : undefined,
		owner_country_code: group.attrs.creator_country_code,
		desc,
		descId,
		descOwner,
		descOwnerPn,
		descTime,
		linkedParent: getBinaryNodeChild(group, 'linked_parent')?.attrs.jid || undefined,
		restrict: !!getBinaryNodeChild(group, 'locked'),
		announce: !!getBinaryNodeChild(group, 'announcement'),
		isCommunity: !!getBinaryNodeChild(group, 'parent'),
		isCommunityAnnounce: !!getBinaryNodeChild(group, 'default_sub_group'),
		joinApprovalMode: !!getBinaryNodeChild(group, 'membership_approval_mode'),
		memberAddMode,
		participants: getBinaryNodeChildren(group, 'participant').map(({ attrs }) => {
			const normalizedId = jidNormalizedUser(attrs.jid)
			const phoneNumber = attrs.phone_number && isPnUser(attrs.phone_number) ? jidNormalizedUser(attrs.phone_number) : undefined
			const lidVal = attrs.lid && isLidUser(attrs.lid) ? jidNormalizedUser(attrs.lid) : undefined
			const adminType = (attrs.type || null) as GroupParticipant['admin']

			return {
				id: normalizedId,
				phoneNumber,
				lid: lidVal,
				admin: adminType,
				isAdmin: adminType === 'admin',
				isSuperAdmin: adminType === 'superadmin'
			}
		}),
		ephemeralDuration: eph ? +eph : undefined
	}
	return metadata
}

export type GroupsSocket = ReturnType<typeof makeGroupsSocket>