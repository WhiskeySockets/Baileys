import { Boom } from '@hapi/boom'
import type { NewsletterCreateResponse, WAMediaUpload } from '../Types'
import { NewsletterMetadata, NewsletterUpdate, QueryIds, XWAPaths } from '../Types'
import type { NewsletterViewRole } from '../Types/Newsletter'
import { generateProfilePicture } from '../Utils/messages-media'
import { getBinaryNodeChild, S_WHATSAPP_NET } from '../WABinary'
import { GroupsSocket } from './groups'

const parseNewsletterCreateResponse = (response: NewsletterCreateResponse): NewsletterMetadata => {
	const { id, thread_metadata: thread, viewer_metadata: viewer } = response
	return {
		id: id,
		owner: undefined,
		name: thread.name.text,
		creation_time: parseInt(thread.creation_time, 10),
		description: thread.description.text,
		invite: thread.invite,
		subscribers: parseInt(thread.subscribers_count, 10),
		verification: thread.verification,
		picture: {
			id: thread.picture.id,
			directPath: thread.picture.direct_path
		},
		mute_state: viewer.mute
	}
}

export const makeNewsletterSocket = (sock: GroupsSocket) => {
	const { query, generateMessageTag } = sock

	const newsletterWMexQuery = async (variables: any, queryId: string) => {
		const result = await query({
			tag: 'iq',
			attrs: {
				id: generateMessageTag(),
				type: 'get',
				to: S_WHATSAPP_NET,
				xmlns: 'w:mex'
			},
			content: [
				{
					tag: 'query',
					attrs: { query_id: queryId },
					content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
				}
			]
		})

		return result
	}

	const executeWMexQuery = async <T>(variables: any, queryId: string, dataPath: string): Promise<T> => {
		const result = await newsletterWMexQuery(variables, queryId)
		console.log('WMex Query Result:', JSON.stringify(result, null, 2))
		const child = getBinaryNodeChild(result, 'result')
		console.log('WMex Query Child:', JSON.stringify(child, null, 2))
		let data: any
		if (child?.content) {
			data = JSON.parse(child.content.toString())
			const response = data?.data?.[dataPath]
			if (typeof response !== 'undefined') {
				return response as T
			}
		}

		const action = dataPath.replace('xwa2_newsletter_', '').replace(/_/g, ' ')
		throw new Boom(`Failed to ${action}`, { statusCode: 400 })
	}

	const newsletterUpdate = async (jid: string, updates: NewsletterUpdate) => {
		const variables = {
			newsletter_id: jid,
			updates: {
				...updates,
				settings: null
			}
		}

		const result = await newsletterWMexQuery(variables, QueryIds.UPDATE_METADATA)
		const child = getBinaryNodeChild(result, 'result')
		if (child?.content) {
			const data = JSON.parse(child.content.toString())
			return data?.data?.xwa2_newsletter_update
		}

		throw new Boom('Failed to update newsletter metadata', { statusCode: 400 })
	}

	return {
		...sock,

		newsletterCreate: async (name: string, description?: string): Promise<NewsletterMetadata> => {
			const variables = {
				input: {
					name,
					description: description ?? null
				}
			}
			const rawResponse = await executeWMexQuery<NewsletterCreateResponse>(
				variables,
				QueryIds.CREATE,
				XWAPaths.xwa2_newsletter_create
			)
			return parseNewsletterCreateResponse(rawResponse)
		},

		newsletterUpdate,

		newsletterSubscribers: async (jid: string) => {
			return executeWMexQuery<{ subscribers: number }>(
				{ newsletter_id: jid },
				QueryIds.SUBSCRIBERS,
				XWAPaths.xwa2_newsletter_subscribers
			)
		},

		newsletterMetadata: async (type: 'invite' | 'jid', key: string, role: NewsletterViewRole = 'GUEST') => {
			const result = await executeWMexQuery<any>(
				{
					input: {
						key,
						type: type.toUpperCase(),
						view_role: role
					},
					fetch_viewer_metadata: true,
					fetch_full_image: true,
					fetch_creation_time: false,
					fetch_wam_sub: false
				},
				QueryIds.METADATA,
				XWAPaths.xwa2_newsletter_metadata
			)
			return typeof result === 'object' && result !== null && result.id
				? result
				: typeof result === 'object' && result !== null && result.result
					? result.result
					: result
		},

		newsletterFollow: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.FOLLOW, XWAPaths.xwa2_newsletter_follow)
		},

		newsletterUnfollow: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.UNFOLLOW, XWAPaths.xwa2_newsletter_unfollow)
		},

		newsletterMute: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.MUTE, XWAPaths.xwa2_newsletter_mute_v2)
		},

		newsletterUnmute: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.UNMUTE, XWAPaths.xwa2_newsletter_unmute_v2)
		},

		newsletterUpdateName: async (jid: string, name: string) => {
			return await newsletterUpdate(jid, { name })
		},

		newsletterUpdateDescription: async (jid: string, description: string) => {
			return await newsletterUpdate(jid, { description })
		},

		newsletterUpdatePicture: async (jid: string, content: WAMediaUpload) => {
			const { img } = await generateProfilePicture(content)
			return await newsletterUpdate(jid, { picture: img.toString('base64') })
		},

		newsletterRemovePicture: async (jid: string) => {
			return await newsletterUpdate(jid, { picture: '' })
		},

		newsletterReactMessage: async (jid: string, serverId: string, reaction?: string) => {
			await query({
				tag: 'message',
				attrs: {
					to: jid,
					...(reaction ? {} : { edit: '7' }),
					type: 'reaction',
					server_id: serverId,
					id: generateMessageTag()
				},
				content: [
					{
						tag: 'reaction',
						attrs: reaction ? { code: reaction } : {}
					}
				]
			})
		},

		newsletterFetchMessages: async (jid: string, count: number, after?: number) => {
			const result = await query({
				tag: 'iq',
				attrs: {
					id: generateMessageTag(),
					type: 'get',
					xmlns: 'newsletter',
					to: S_WHATSAPP_NET
				},
				content: [
					{
						tag: 'messages',
						attrs: { jid: jid, count: count.toString(), after: after?.toString() || '100' }
					}
				]
			})

			return result
		},

		subscribeNewsletterUpdates: async (jid: string) => {
			const result = await query({
				tag: 'iq',
				attrs: {
					id: generateMessageTag(),
					type: 'set',
					xmlns: 'newsletter',
					to: jid
				},
				content: [{ tag: 'live_updates', attrs: {}, content: [] }]
			})
			return getBinaryNodeChild(result, 'live_updates')?.attrs as { duration: string }
		},

		newsletterAdminCount: async (jid: string): Promise<number> => {
			const response = await executeWMexQuery<{ admin_count: number }>(
				{ newsletter_id: jid },
				QueryIds.ADMIN_COUNT,
				XWAPaths.xwa2_newsletter_admin_count
			)
			return response.admin_count
		},

		newsletterChangeOwner: async (jid: string, newOwnerJid: string) => {
			await executeWMexQuery(
				{ newsletter_id: jid, user_id: newOwnerJid },
				QueryIds.CHANGE_OWNER,
				XWAPaths.xwa2_newsletter_change_owner
			)
		},

		newsletterDemote: async (jid: string, userJid: string) => {
			await executeWMexQuery({ newsletter_id: jid, user_id: userJid }, QueryIds.DEMOTE, XWAPaths.xwa2_newsletter_demote)
		},

		newsletterDelete: async (jid: string) => {
			await executeWMexQuery({ newsletter_id: jid }, QueryIds.DELETE, XWAPaths.xwa2_newsletter_delete_v2)
		}
	}
}

export type NewsletterSocket = ReturnType<typeof makeNewsletterSocket>
