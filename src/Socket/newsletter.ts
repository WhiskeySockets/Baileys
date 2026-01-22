import type { NewsletterCreateResponse, SocketConfig, NewsletterFetchedUpdate, NewsletterReaction, WAMediaUpload } from '../Types'
import type { NewsletterMetadata, NewsletterUpdate } from '../Types'
import type { BinaryNode } from "../WABinary"
import { QueryIds, XWAPaths } from '../Types'
import { decryptMessageNode } from '../Utils'
import { generateProfilePicture } from '../Utils/messages-media'
import {
	getAllBinaryNodeChildren,
	getBinaryNodeChild,
	getBinaryNodeChildren,
	S_WHATSAPP_NET
} from '../WABinary'
import { makeGroupsSocket } from './groups'
import { executeWMexQuery as genericExecuteWMexQuery } from './mex'

export const parseNewsletterCreateResponse = (response: NewsletterCreateResponse): NewsletterMetadata => {
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
		picture: thread?.picture
			? {
					id: thread.picture.id,
					directPath: thread.picture.direct_path
				}
			: undefined,
		mute_state: viewer.mute
	}
}

const parseNewsletterMetadata = (result: unknown): NewsletterMetadata | null => {
	if (typeof result !== 'object' || result === null) {
		return null
	}

	if ('id' in result && typeof result.id === 'string') {
		return result as NewsletterMetadata
	}

	if ('result' in result && typeof result.result === 'object' && result.result !== null && 'id' in result.result) {
		return result.result as NewsletterMetadata
	}

	return null
}

export const makeNewsletterSocket = (config: SocketConfig) => {
	const sock = makeGroupsSocket(config)
	const { query, generateMessageTag, authState, signalRepository } = sock

	const executeWMexQuery = <T>(
		variables: Record<string, unknown>,
		queryId: string,
		dataPath: string,
		error = false
	): Promise<T> => {
		return genericExecuteWMexQuery<T>(variables, queryId, dataPath, query, generateMessageTag, error)
	}

	const newsletterUpdate = async (jid: string, updates: NewsletterUpdate) => {
		const variables = {
			newsletter_id: jid,
			updates: {
				...updates,
				settings: null
			}
		}
		return executeWMexQuery(variables, QueryIds.UPDATE_METADATA, 'xwa2_newsletter_update')
	}

	const parseFetchedUpdates = async (node: BinaryNode, type: 'messages' | 'updates') => {
		let child: BinaryNode

		if (type === 'messages') {
			child = getBinaryNodeChild(node, 'messages') as BinaryNode
		} else {
			const parent = getBinaryNodeChild(node, 'message_updates')
			child = getBinaryNodeChild(parent, 'messages') as BinaryNode
		}

		return await Promise.all(
			getAllBinaryNodeChildren(child).map(async messageNode => {
				messageNode.attrs.from = child?.attrs.jid as string

				const views = getBinaryNodeChild(messageNode, 'views_count')?.attrs?.count
				const reactionNode = getBinaryNodeChild(messageNode, 'reactions')
				const reactions = getBinaryNodeChildren(reactionNode, 'reaction').map(
					({ attrs }) => ({ count: +(attrs.count || 0), code: attrs.code }) as NewsletterReaction
				)

				let data: NewsletterFetchedUpdate
				if (type === 'messages') {
					const { fullMessage: message, decrypt } = await decryptMessageNode(
						messageNode,
						authState.creds.me!.id,
						authState.creds.me!.lid || '',
						signalRepository,
						sock.config.logger
					)

					await decrypt()

					data = {
						server_id: messageNode.attrs.server_id as string,
						views: views ? +views : undefined,
						reactions,
						message
					}

					return data
				} else {
					data = {
						server_id: messageNode.attrs.server_id as string,
						views: views ? +views : undefined,
						reactions
					}

					return data
				}
			})
		)
	}

	return {
		...sock,
		executeWMexQuery,
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
			return rawResponse as any
		},

		newsletterUpdate,

		newsletterSubscribed: async (): Promise<NewsletterMetadata[]> => {
			const result = await executeWMexQuery<any[]>({}, QueryIds.SUBSCRIBED, XWAPaths.xwa2_newsletter_subscribed)
			return result.map(parseNewsletterMetadata).filter(a => a !== null) as NewsletterMetadata[]
		},

		newsletterSubscribers: async (jid: string) => {
			return executeWMexQuery<{ subscribers: number }>(
				{ newsletter_id: jid },
				QueryIds.SUBSCRIBERS,
				XWAPaths.xwa2_newsletter_subscribers
			)
		},

		newsletterMetadata: async (type: 'invite' | 'jid', key: string) => {
			const variables = {
				fetch_creation_time: true,
				fetch_full_image: true,
				fetch_viewer_metadata: true,
				input: {
					key,
					type: type.toUpperCase(),
					view_role: 'GUEST'
				}
			}
			const result = await executeWMexQuery<unknown>(
				variables,
				QueryIds.METADATA,
				XWAPaths.xwa2_newsletter_metadata,
				false
			)
			return parseNewsletterMetadata(result)
		},

		newsletterFollow: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.FOLLOW, XWAPaths.xwa2_newsletter_join_v2)
		},

		newsletterUnfollow: (jid: string) => {
			return executeWMexQuery({ newsletter_id: jid }, QueryIds.UNFOLLOW, XWAPaths.xwa2_newsletter_leave_v2)
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

		newsletterFetchMessages: async (jid: string, count: number, since: number, after: number) => {
			const messageUpdateAttrs: { count: string; since?: string; after?: string } = {
				count: count.toString()
			}
			if (typeof since === 'number') {
				messageUpdateAttrs.since = since.toString()
			}

			if (after) {
				messageUpdateAttrs.after = after.toString()
			}

			const result = await query({
				tag: 'iq',
				attrs: {
					id: generateMessageTag(),
					type: 'get',
					xmlns: 'newsletter',
					to: jid
				},
				content: [
					{
						tag: 'message_updates',
						attrs: messageUpdateAttrs
					}
				]
			})
			return result
		},

		subscribeNewsletterUpdates: async (jid: string): Promise<{ duration: string } | null> => {
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
			const liveUpdatesNode = getBinaryNodeChild(result, 'live_updates')
			const duration = liveUpdatesNode?.attrs?.duration
			return duration ? { duration: duration } : null
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
		},

		newsletterFetchPreviewMessages: async (type: 'invite' | 'jid', key: string, count: number, after?: number) => {
			const afterStr: any = after?.toString()
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
						attrs: { type, ...(type === 'invite' ? { key } : { jid: key }), count: count.toString(), after: afterStr }
					}
				]
			})
			return await parseFetchedUpdates(result, 'messages')
		}
	}
}

export type NewsletterSocket = ReturnType<typeof makeNewsletterSocket>
