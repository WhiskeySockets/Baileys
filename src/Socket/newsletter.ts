import { proto } from '../../WAProto'
import { GroupMetadata, GroupParticipant, ParticipantAction, SocketConfig, WAMediaUpload, WAMessageKey, WAMessageStubType } from '../Types'
import { generateMessageID, generateProfilePicture, unixTimestampSeconds } from '../Utils'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString, jidEncode, jidNormalizedUser, S_WHATSAPP_NET } from '../WABinary'
import { makeGroupsSocket } from './groups'

enum QueryIds {
    JOB_MUTATION = "7150902998257522",
    METADATA = "6620195908089573",
    UNFOLLOW = "7238632346214362",
    FOLLOW = "7871414976211147",
    UNMUTE = "7337137176362961",
    MUTE = "25151904754424642",
    CREATE = "6996806640408138",
    ADMIN_COUNT = "7130823597031706"
}

export const makeNewsletterSocket = (config: SocketConfig) => {
	const sock = makeGroupsSocket(config)
	const { authState, ev, query, upsertMessage, generateMessageTag } = sock

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

    const newsletterWMexQuery = async(jid: string, query_id: QueryIds, content?: object) => (
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

    const enableNewsletterUpdates = async(jid: string) => {
        return newsletterQuery(jid, 'set', [{tag: 'live_updates', attrs: {}, content: []}])
            .then(() => true)
    }

    const newsletterReactionMode = async(jid: string, mode: 'all' | 'basic' | 'none') => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {settings: {reaction_codes: {value: mode.toUpperCase()}}}
        })
    }

    const newsletterUpdateDescription = async(jid: string, description?: string) => {
        await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION, {
            updates: {description: description ? description : "", settings: null}
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

    const newsletterCreate = async(jid: string, name: string, description: string) => {
        await newsletterWMexQuery(jid, QueryIds.CREATE, {
            input: {name, description}
        })
    }

    const newsletterMetadata = async(jid: string, isOwner: boolean) => {
        await newsletterWMexQuery(jid, QueryIds.METADATA, {
            input: {
                key: jid,
                type: "JID",
                view_role: isOwner ? "OWNER" : "SUBSCRIBER"
            },
            fetch_viewer_metadata: true,
            fetch_full_image: true,
            fetch_creation_time: true
        })
    }

    const newsletterAdminCount = async(jid: string) => {
        await newsletterWMexQuery(jid, QueryIds.ADMIN_COUNT)
    }

    return {
		...sock,
        enableNewsletterUpdates,
        newsletterReactionMode,
        newsletterCreate,
        newsletterFollow,
        newsletterUnfollow,
        newsletterUpdatePicture,
        newsletterRemovePicture,
        newsletterUpdateName,
        newsletterUpdateDescription,
        newsletterMetadata
    }
}


export const extractNewsletterMetadata = (node) => {
    let result = getBinaryNodeChild(node, 'result')?.content?.toString()
    
}