import { proto } from '../../WAProto/index.js'
import {
	type GroupMetadata,
	type GroupParticipant,
	type ParticipantAction,
	type SocketConfig,
	type WAMessageKey,
	WAMessageStubType
} from '../Types'
import { generateMessageID, generateMessageIDV2, unixTimestampSeconds } from '../Utils'
import logger from '../Utils/logger'
import {
	type BinaryNode,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	jidEncode,
	jidNormalizedUser
} from '../WABinary'
import { makeBusinessSocket } from './business'

const XMLNS_G2 = 'w:g2'
const COMMUNITY_TAG = 'community'
const MEMBERSHIP_APPROVAL_REQUESTS = 'membership_approval_requests'
const MEMBER_ADD_MODE = 'member_add_mode'
const ADDRESSING_MODE = 'addressing_mode'

export const makeCommunitiesSocket = (config: SocketConfig) => {
	const sock = makeBusinessSocket(config)
	const { authState, ev, query, upsertMessage } = sock

	const communityQuery = async (jid: string, type: 'get' | 'set', content: BinaryNode[]): Promise<BinaryNode> =>
		query({
			tag: 'iq',
			attrs: {
				type,
				xmlns: XMLNS_G2,
				to: jid
			},
			content
		})

	const communityMetadata = async (jid: string): Promise<GroupMetadata> => {
		const result = await communityQuery(jid, 'get', [{ tag: 'query', attrs: { request: 'interactive' } }])
		return extractCommunityMetadata(result)
	}

	const communityFetchAllParticipating = async (): Promise<{ [_: string]: GroupMetadata }> => {
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
		const data: { [_: string]: GroupMetadata } = {}
		const communitiesChild = getBinaryNodeChild(result, 'communities')
		if (communitiesChild) {
			const communities = getBinaryNodeChildren(communitiesChild, COMMUNITY_TAG)
			for (const communityNode of communities) {
				const meta = extractCommunityMetadata({
					tag: 'result',
					attrs: {},
					content: [communityNode]
				})
				data[meta.id] = meta
			}
		}

		sock.ev.emit('groups.update', Object.values(data))

		return data
	}

	async function parseGroupResult(node: BinaryNode): Promise<GroupMetadata | null> {
		logger.info({ node }, 'parseGroupResult')
		const groupNode = getBinaryNodeChild(node, 'group')
		if (groupNode) {
			try {
				logger.info({ groupNode }, 'groupNode')
				const metadata = await sock.groupMetadata(`${groupNode.attrs.id}@g.us`)
				return metadata ?? null
			} catch (error) {
				logger.error('Error parsing group metadata:', error)
				return null
			}
		}

		return null
	}

	sock.ws.on('CB:ib,,dirty', async (node: BinaryNode) => {
		const dirtyNode = getBinaryNodeChild(node, 'dirty')
		if (!dirtyNode) {
			logger.error('No dirty node found')
			return
		}
		const { attrs } = dirtyNode
		if (attrs.type !== 'communities') {
			return
		}

		await communityFetchAllParticipating()
		await sock.cleanDirtyBits('groups')
	})

	return {
		...sock,
		communityMetadata,
		communityCreate: async (subject: string, body: string): Promise<GroupMetadata | null> => {
			const descriptionId = generateMessageID().substring(0, 12)

			const result = await communityQuery('@g.us', 'set', [
				{
					tag: 'create',
					attrs: { subject },
					content: [
						{
							tag: 'description',
							attrs: { id: descriptionId },
							content: [
								{
									tag: 'body',
									attrs: {},
									content: Buffer.from(body || '', 'utf-8')
								}
							]
						},
						{
							tag: 'parent',
							attrs: { default_membership_approval_mode: 'request_required' }
						},
						{
							tag: 'allow_non_admin_sub_group_creation',
							attrs: {}
						},
						{
							tag: 'create_general_chat',
							attrs: {}
						}
					]
				}
			])

			return await parseGroupResult(result)
		},
		communityCreateGroup: async (subject: string, participants: string[], parentCommunityJid: string): Promise<GroupMetadata | null> => {
			const key = generateMessageIDV2()
			const result = await communityQuery('@g.us', 'set', [
				{
					tag: 'create',
					attrs: {
						subject,
						key
					},
					content: [
						...participants.map(jid => ({
							tag: 'participant',
							attrs: { jid }
						})),
						{ tag: 'linked_parent', attrs: { jid: parentCommunityJid } }
					]
				}
			])
			return await parseGroupResult(result)
		},
		communityLeave: async (id: string): Promise<void> => {
			await communityQuery('@g.us', 'set', [
				{
					tag: 'leave',
					attrs: {},
					content: [{ tag: COMMUNITY_TAG, attrs: { id } }]
				}
			])
		},
		communityUpdateSubject: async (jid: string, subject: string): Promise<void> => {
			await communityQuery(jid, 'set', [
				{
					tag: 'subject',
					attrs: {},
					content: Buffer.from(subject, 'utf-8')
				}
			])
		},
		communityLinkGroup: async (groupJid: string, parentCommunityJid: string): Promise<void> => {
			await communityQuery(parentCommunityJid, 'set', [
				{
					tag: 'links',
					attrs: {},
					content: [
						{
							tag: 'link',
							attrs: { link_type: 'sub_group' },
							content: [{ tag: 'group', attrs: { jid: groupJid } }]
						}
					]
				}
			])
		},
		communityUnlinkGroup: async (groupJid: string, parentCommunityJid: string): Promise<void> => {
			await communityQuery(parentCommunityJid, 'set', [
				{
					tag: 'unlink',
					attrs: { unlink_type: 'sub_group' },
					content: [{ tag: 'group', attrs: { jid: groupJid } }]
				}
			])
		},
		communityRequestParticipantsList: async (jid: string): Promise<{ [key: string]: string }[]> => {
			const result = await communityQuery(jid, 'get', [
				{
					tag: MEMBERSHIP_APPROVAL_REQUESTS,
					attrs: {}
				}
			])
			const node = getBinaryNodeChild(result, MEMBERSHIP_APPROVAL_REQUESTS)
			const participants = getBinaryNodeChildren(node, 'membership_approval_request')
			return participants.map(v => v.attrs)
		},
		communityRequestParticipantsUpdate: async (jid: string, participants: string[], action: 'approve' | 'reject'): Promise<{ status: string, jid: string }[]> => {
			const result = await communityQuery(jid, 'set', [
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
			const nodeAction = getBinaryNodeChild(node, action)
			const participantsAffected = getBinaryNodeChildren(nodeAction, 'participant')
			return participantsAffected.map(p => {
				return { status: p.attrs.error || '200', jid: jidNormalizedUser(p.attrs.jid) }
			})
		},
		communityParticipantsUpdate: async (jid: string, participants: string[], action: ParticipantAction): Promise<{ status: string, jid: string, content: BinaryNode }[]> => {
			const result = await communityQuery(jid, 'set', [
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
			const participantsAffected = getBinaryNodeChildren(node, 'participant')
			return participantsAffected.map(p => {
				return { status: p.attrs.error || '200', jid: jidNormalizedUser(p.attrs.jid), content: p }
			})
		},
		communityUpdateDescription: async (jid: string, description?: string): Promise<void> => {
			const metadata = await communityMetadata(jid)
			const prev = metadata.descId ?? null

			await communityQuery(jid, 'set', [
				{
					tag: 'description',
					attrs: {
						...(description ? { id: generateMessageID() } : { delete: 'true' }),
						...(prev ? { prev } : {})
					},
					content: description ? [{ tag: 'body', attrs: {}, content: Buffer.from(description, 'utf-8') }] : undefined
				}
			])
		},
		communityInviteCode: async (jid: string): Promise<string | undefined> => {
			const result = await communityQuery(jid, 'get', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		communityRevokeInvite: async (jid: string): Promise<string | undefined> => {
			const result = await communityQuery(jid, 'set', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode?.attrs.code
		},
		communityAcceptInvite: async (code: string): Promise<string | undefined> => {
			const results = await communityQuery('@g.us', 'set', [{ tag: 'invite', attrs: { code } }])
			const result = getBinaryNodeChild(results, COMMUNITY_TAG)
			return result?.attrs.jid
		},

		/**
		 * revoke a v4 invite for someone
		 * @param communityJid community jid
		 * @param invitedJid jid of person you invited
		 * @returns true if successful
		 */
		communityRevokeInviteV4: async (communityJid: string, invitedJid: string): Promise<boolean> => {
			const result = await communityQuery(communityJid, 'set', [
				{ tag: 'revoke', attrs: {}, content: [{ tag: 'participant', attrs: { jid: invitedJid } }] }
			])
			return !!result
		},

		/**
		 * accept a CommunityInviteMessage
		 * @param key the key of the invite message, or optionally only provide the jid of the person who sent the invite
		 * @param inviteMessage the message to accept
		 */
		communityAcceptInviteV4: ev.createBufferedFunction(
			async (key: string | WAMessageKey, inviteMessage: proto.Message.IGroupInviteMessage): Promise<string | undefined> => {
				key = typeof key === 'string' ? { remoteJid: key } : key
				const results = await communityQuery(inviteMessage.groupJid!, 'set', [
					{
						tag: 'accept',
						attrs: {
							code: inviteMessage.inviteCode!,
							expiration: inviteMessage.inviteExpiration!.toString(),
							admin: key.remoteJid!
						}
					}
				])

				// if we have the full message key
				// update the invite message to be expired
				if (key.id) {
					// create new invite message that is expired
					inviteMessage = proto.Message.GroupInviteMessage.create(inviteMessage)
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

				// generate the community add message
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
		communityGetInviteInfo: async (code: string): Promise<GroupMetadata> => {
			const results = await communityQuery('@g.us', 'get', [{ tag: 'invite', attrs: { code } }])
			return extractCommunityMetadata(results)
		},
		communityToggleEphemeral: async (jid: string, ephemeralExpiration: number): Promise<void> => {
			const content: BinaryNode = ephemeralExpiration
				? { tag: 'ephemeral', attrs: { expiration: ephemeralExpiration.toString() } }
				: { tag: 'not_ephemeral', attrs: {} }
			await communityQuery(jid, 'set', [content])
		},
		communitySettingUpdate: async (
			jid: string,
			setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
		): Promise<void> => {
			await communityQuery(jid, 'set', [{ tag: setting, attrs: {} }])
		},
		communityMemberAddMode: async (jid: string, mode: 'admin_add' | 'all_member_add'): Promise<void> => {
			await communityQuery(jid, 'set', [{ tag: MEMBER_ADD_MODE, attrs: {}, content: mode }])
		},
		communityJoinApprovalMode: async (jid: string, mode: 'on' | 'off'): Promise<void> => {
			await communityQuery(jid, 'set', [
				{ tag: 'membership_approval_mode', attrs: {}, content: [{ tag: 'community_join', attrs: { state: mode } }] }
			])
		},
		communityFetchAllParticipating
	}
}

export const extractCommunityMetadata = (result: BinaryNode): GroupMetadata => {
	const community = getBinaryNodeChild(result, COMMUNITY_TAG)
	if (!community) {
		throw new Error('Community node not found in result')
	}
	const descChild = getBinaryNodeChild(community, 'description')
	let desc: string | undefined
	let descId: string | undefined
	if (descChild) {
		desc = getBinaryNodeChild(community, 'body')?.content?.toString()
		descId = descChild.attrs.id
	}

	const communityId = community.attrs.id?.includes('@')
		? community.attrs.id
		: jidEncode(community.attrs.id || '', 'g.us')
	const eph = getBinaryNodeChild(community, 'ephemeral')?.attrs.expiration
	const memberAddModeValue = getBinaryNodeChild(community, MEMBER_ADD_MODE)?.content?.toString() ?? ''
	const memberAddMode = memberAddModeValue === 'all_member_add'
	const metadata: GroupMetadata = {
		id: communityId,
		subject: community.attrs.subject || '',
		subjectOwner: community.attrs.s_o,
		subjectTime: Number(community.attrs.s_t || 0),
		size: getBinaryNodeChildren(community, 'participant').length,
		creation: Number(community.attrs.creation || 0),
		owner: community.attrs.creator ? jidNormalizedUser(community.attrs.creator) : undefined,
		desc,
		descId,
		linkedParent: getBinaryNodeChild(community, 'linked_parent')?.attrs.jid || undefined,
		restrict: !!getBinaryNodeChild(community, 'locked'),
		announce: !!getBinaryNodeChild(community, 'announcement'),
		isCommunity: !!getBinaryNodeChild(community, 'parent'),
		isCommunityAnnounce: !!getBinaryNodeChild(community, 'default_sub_community'),
		joinApprovalMode: !!getBinaryNodeChild(community, 'membership_approval_mode'),
		memberAddMode,
		participants: getBinaryNodeChildren(community, 'participant').map(({ attrs }) => {
			const normalizedId = jidNormalizedUser(attrs.jid)
			const adminType = (attrs.type || null) as GroupParticipant['admin']
			return {
				id: normalizedId,
				admin: adminType,
				isAdmin: adminType === 'admin',
				isSuperAdmin: adminType === 'superadmin'
			}
		}),
		ephemeralDuration: eph ? +eph : undefined,
		addressingMode: getBinaryNodeChild(community, ADDRESSING_MODE)?.content?.toString()! as GroupMetadata['addressingMode']
	}
	return metadata
}