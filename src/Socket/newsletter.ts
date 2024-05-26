import { SocketConfig, WAMediaUpload, NewsletterMetadata, ReactionMode, ViewRole, XWAPaths } from '../Types'
import { generateMessageID, generateProfilePicture } from '../Utils'
import { BinaryNode, getBinaryNodeChild, S_WHATSAPP_NET } from '../WABinary'
import { makeGroupsSocket } from './groups'

enum QueryIds {
    JOB_MUTATION = "7150902998257522",
    METADATA = "6620195908089573",
    UNFOLLOW = "7238632346214362",
    FOLLOW = "7871414976211147",
    UNMUTE = "7337137176362961",
    MUTE = "25151904754424642",
    CREATE = "6996806640408138",
    ADMIN_COUNT = "7130823597031706",
    CHANGE_OWNER = "7341777602580933",
    DELETE = "8316537688363079",
    DEMOTE = "6551828931592903"
}

export const makeNewsletterSocket = (config: SocketConfig) => {
	const sock = makeGroupsSocket(config)
	const { query, generateMessageTag } = sock

    const encoder = new TextEncoder()

	const newsletterQuery = async(jid: string, type: 'get' | 'set', content: BinaryNode[]) => (
		query({
			tag: 'iq',
			attrs: {
                id: generateMessageTag(),
				type,
				xmlns: 'newsletter',
				to: jid,
			},
			content
		})
	)

    const newsletterWMexQuery = async(jid: string | undefined, query_id: QueryIds, content?: object) => (
        query({
			tag: 'iq',
			attrs: {
                id: generateMessageTag(),
				type: 'get',
				xmlns: 'w:mex',
				to: S_WHATSAPP_NET,
			},
			content: [
                {
                    tag: 'query',
                    attrs: {query_id},
                    content: encoder.encode(JSON.stringify({"variables":{"newsletter_id": jid, ...content}}))
                }
            ]
		})
    )

    const subscribeNewsletterUpdates = async(jid: string) => {
        return newsletterQuery(jid, 'set', [{tag: 'live_updates', attrs: {}, content: []}])
            .then(() => true)
    }

    const newsletterReactionMode = async(jid: string, mode: ReactionMode) => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {settings: {reaction_codes: {value: mode}}}
        })
    }

    const newsletterUpdateDescription = async(jid: string, description?: string) => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {description: description || "", settings: null}
        })
    }

    const newsletterUpdateName = async(jid: string, name: string) => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {name, settings: null}
        })
    }
    
    const newsletterUpdatePicture = async(jid: string, content: WAMediaUpload) => {
        const { img } = await generateProfilePicture(content)

        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {picture: img.toString('base64'), settings: null}
        })
    }

    const newsletterRemovePicture = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {picture: "", settings: null}
        })
    }

    const newsletterUnfollow = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.UNFOLLOW)
    }

    const newsletterFollow = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.FOLLOW)
    }

    const newsletterUnmute = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.UNMUTE)
    }

    const newsletterMute = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.MUTE)
    }

    const newsletterCreate = async(name: string, description: string) => {
        let result = await newsletterWMexQuery(undefined, QueryIds.CREATE, {
            input: {name, description}
        })

        return extractNewsletterMetadata(result, true)
    }

    const newsletterMetadata = async(jid: string, role: ViewRole) => {
        let result = await newsletterWMexQuery(jid, QueryIds.METADATA, {
            input: {
                key: jid,
                type: "JID",
                view_role: role
            },
            fetch_viewer_metadata: true,
            fetch_full_image: true,
            fetch_creation_time: true
        })

        return extractNewsletterMetadata(result)
    }

    const newsletterAdminCount = async(jid: string) => {
        let result = await newsletterWMexQuery(jid, QueryIds.ADMIN_COUNT)

        let buff = getBinaryNodeChild(result, 'result')?.content?.toString()
        
        return JSON.parse(buff!).data[XWAPaths.ADMIN_COUNT].admin_count as number
    }

    const newsletterChangeOwner = async(jid: string, user: string) => {
        await newsletterWMexQuery(jid, QueryIds.CHANGE_OWNER, {
            user_id: user
        })
    }

    const newsletterDemote = async(jid: string, user: string) => {
        await newsletterWMexQuery(jid, QueryIds.DEMOTE, {
            user_id: user
        })
    }

    const newsletterDelete = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.DELETE)
    }

    const newsletterReactMessage = async(jid: string, server_id: string, code: string) => {
        await query({
            tag: 'message',
            attrs: {to: jid, type: 'reaction', server_id, id: generateMessageID()},
            content: [{
                tag: 'reaction',
                attrs: {code}
            }]
        })
    }

    const newsletterfetchMessages = async(jid: string, count: number, after: number) => {
        await newsletterQuery(S_WHATSAPP_NET, 'get', [
            {
                tag: 'messages',
                attrs: {type: 'jid', jid, count: count.toString(), after: after.toString()}
            }
        ])
    }

    const newsletterfetchMessagesUpdates = async(jid: string, count: number, after: number, since: number) => {
        await newsletterQuery(S_WHATSAPP_NET, 'get', [
            {
                tag: 'messages_updates',
                attrs: {count: count.toString(), after: after.toString(), since: since.toString()}
            }
        ])
    }

    return {
		...sock,
        subscribeNewsletterUpdates,
        newsletterReactionMode,
        newsletterCreate,
        newsletterFollow,
        newsletterUnfollow,
        newsletterUnmute,
        newsletterMute,
        newsletterUpdatePicture,
        newsletterRemovePicture,
        newsletterUpdateName,
        newsletterUpdateDescription,
        newsletterMetadata,
        newsletterAdminCount,
        newsletterChangeOwner,
        newsletterDemote,
        newsletterDelete,
        newsletterReactMessage,
        newsletterfetchMessages,
        newsletterfetchMessagesUpdates
    }
}


export const extractNewsletterMetadata = (node: BinaryNode, isCreate?: boolean) => {
    let result = getBinaryNodeChild(node, 'result')?.content?.toString()
    let metadataPath = JSON.parse(result!).data[isCreate ? XWAPaths.CREATE : XWAPaths.NEWSLETTER]

    let metadata: NewsletterMetadata = {
        id: metadataPath.id,
        state: metadataPath.state.type,
        creation_time: +metadataPath.thread_metadata.creation_time,
        name: metadataPath.thread_metadata.name.text,
        nameTime: +metadataPath.thread_metadata.name.update_time,
        description: metadataPath.thread_metadata.description.text,
        descriptionTime: +metadataPath.thread_metadata.description.update_time,
        invite: metadataPath.thread_metadata.invite,
        handle: metadataPath.thread_metadata.handle,
        picture: metadataPath.thread_metadata.picture.direct_path || undefined,
        preview: metadataPath.thread_metadata.preview.direct_path || null,
        reaction_codes: metadataPath.thread_metadata.settings.reaction_codes.value,
        subscribers: +metadataPath.thread_metadata.subscribers_count,
        verification: metadataPath.thread_metadata.verification,
        viewer_metadata: metadataPath.viewer_metadata
    }

    return metadata
}