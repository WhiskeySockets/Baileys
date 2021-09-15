import { generateMessageID } from "../Utils";
import { SocketConfig, GroupMetadata, ParticipantAction } from "../Types";
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidDecode, jidEncode } from "../WABinary";
import { makeChatsSocket } from "./chats";

const extractGroupMetadata = (result: BinaryNode) => {
	const group = getBinaryNodeChild(result, 'group')
	const descChild = getBinaryNodeChild(group, 'description')
	let desc: string | undefined
	let descId: string | undefined
	if(descChild) {
		desc = getBinaryNodeChild(descChild, 'body')?.content as string
		descId = descChild.attrs.id
	}

	const metadata: GroupMetadata = {
		id: jidEncode(jidDecode(group.attrs.id).user, 'g.us'),
		subject: group.attrs.subject,
		creation: +group.attrs.creation,
		owner: group.attrs.creator,
		desc,
		descId,
		restrict: !!getBinaryNodeChild(result, 'locked') ? 'true' : 'false',
		announce: !!getBinaryNodeChild(result, 'announcement') ? 'true' : 'false',
		participants: getBinaryNodeChildren(group, 'participant').map(
			({ attrs }) => {
				return {
					id: attrs.jid,
					admin: attrs.type || null as any,
				}
			}
		)
	}
	return metadata
}

export const makeGroupsSocket = (config: SocketConfig) => {
	const sock = makeChatsSocket(config)
	const { query } = sock

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
		groupLeave: async(jid: string) => {
			await groupQuery(
				'@g.us',
				'set',
				[
					{
						tag: 'leave',
						attrs: { },
						content: [
							{ tag: 'group', attrs: { jid } }
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
				participants.map(
					jid => ({
						tag: action,
						attrs: { },
						content: [{ tag: 'participant', attrs: { jid } }]
					})
				)
			)
			const node = getBinaryNodeChild(result, action)
			const participantsAffected = getBinaryNodeChildren(node!, 'participant')
			return participantsAffected.map(p => p.attrs.jid)
		},
		groupInviteCode: async(jid: string) => {
			const result = await groupQuery(jid, 'get', [{ tag: 'invite', attrs: {} }])
			const inviteNode = getBinaryNodeChild(result, 'invite')
			return inviteNode.attrs.code
		},
		groupToggleEphemeral: async(jid: string, ephemeralExpiration: number) => {
			const content: BinaryNode = ephemeralExpiration ? 
				{ tag: 'ephemeral', attrs: { ephemeral: ephemeralExpiration.toString() } } :
				{ tag: 'not_ephemeral', attrs: { } }
			await groupQuery(jid, 'set', [content])
		},
		groupSettingUpdate: async(jid: string, setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked') => {
			await groupQuery(jid, 'set', [ { tag: setting, attrs: { } } ])
		}
	}
}