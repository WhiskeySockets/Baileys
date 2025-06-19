import { Boom } from '@hapi/boom'
import type { NewsletterCreateResponse } from '../Types'
import { NewsletterMetadata, NewsletterUpdate, QueryIds, XWAPaths } from '../Types'
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

	// const newsletterQuery = async (jid: string, type: 'get' | 'set', content: BinaryNode[] = []) => {
	// 	const result = await query({
	// 		tag: 'iq',
	// 		attrs: {
	// 			id: generateMessageTag(),
	// 			type,
	// 			xmlns: 'newsletter',
	// 			to: S_WHATSAPP_NET
	// 		},
	// 		content: [
	// 			{
	// 				tag: 'newsletter',
	// 				attrs: { jid },
	// 				content
	// 			}
	// 		]
	// 	})

	// 	return result
	// }

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
		const child = getBinaryNodeChild(result, 'result')
		let data: any
		if (child?.content) {
			data = JSON.parse(child.content.toString())
			const response = data?.data?.[dataPath]
			if (response) {
				return response as T
			}
		}

		const action = dataPath.replace('xwa2_newsletter_', '').replace(/_/g, ' ')
		throw new Boom(`Failed to ${action}`, { statusCode: 400 })
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

		// newsletterMetadata: async (type: 'invite' | 'jid', key: string): Promise<NewsletterMetadata> => {
		// 	const variables = { [type]: key }
		// 	return executeWMexQuery(variables, QueryIds.METADATA, XWAPaths.xwa2_newsletter_metadata)
		// },

		// newsletterAction: async (jid: string, type: 'follow' | 'unfollow' | 'mute' | 'unmute') => {
		// 	const variables = { newsletter_jid: jid }
		// 	let queryId: string

		// 	switch (type) {
		// 		case 'follow':
		// 			queryId = QueryIds.FOLLOW
		// 			break
		// 		case 'unfollow':
		// 			queryId = QueryIds.UNFOLLOW
		// 			break
		// 		case 'mute':
		// 			queryId = QueryIds.MUTE
		// 			break
		// 		case 'unmute':
		// 			queryId = QueryIds.UNMUTE
		// 			break
		// 		default:
		// 			throw new Boom('Invalid newsletter action', { statusCode: 400 })
		// 	}

		// 	return executeWMexQuery(variables, queryId, `xwa2_newsletter_${type}`)
		// },

		newsletterUpdate: async (jid: string, updates: NewsletterUpdate) => {
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

		// newsletterUpdatePicture: async (jid: string, picture: any) => {
		// 	const variables = {
		// 		newsletter_jid: jid,
		// 		picture
		// 	}
		// 	return executeWMexQuery(variables, QueryIds.UPDATE_PICTURE, 'xwa2_newsletter_update_picture')
		// },

		// newsletterFetchMessages: async (jid: string, count = 25, after?: string): Promise<NewsletterFetchedUpdate[]> => {
		// 	const variables = {
		// 		newsletter_jid: jid,
		// 		count,
		// 		after
		// 	}
		// 	const updates = await executeWMexQuery<{ updates: NewsletterFetchedUpdate[] }>(
		// 		variables,
		// 		QueryIds.FETCH_MESSAGES,
		// 		XWAPaths.xwa2_newsletter_fetch_messages
		// 	)
		// 	return updates?.updates || []
		// },

		// newsletterReactMessage: async (jid: string, serverId: string, code: string) => {
		// 	const variables = {
		// 		newsletter_jid: jid,
		// 		server_id: serverId,
		// 		reaction_code: code
		// 	}
		// 	return executeWMexQuery(variables, QueryIds.REACT_MESSAGE, XWAPaths.xwa2_newsletter_react_message)
		// }
	}
}

export type NewsletterSocket = ReturnType<typeof makeNewsletterSocket>
