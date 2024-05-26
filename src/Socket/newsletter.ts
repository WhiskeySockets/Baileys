import { NewsLetterMetadata, SocketConfig, WAMediaUpload } from "../Types";
import { generateProfilePicture } from "../Utils";
import { S_WHATSAPP_NET, getBinaryNodeChildString } from "../WABinary";
import { makeGroupsSocket } from "./groups";

export const makeNewsLetterSocket = (config: SocketConfig) => {
    const sock = makeGroupsSocket(config)
    const { query } = sock

    const newsletterQuery = async(variables: object | undefined, queryId: string) => (
		query({
			tag: 'iq',
			attrs: {
				type: 'get',
				xmlns: 'w:mex',
				to: S_WHATSAPP_NET,
			},
			content: [{
                tag: 'query',
                attrs: {
                    query_id: queryId
                },
                content: JSON.stringify({ variables })
            }]
		})
	)

    /**
     * 
     * @param code https://whatsapp.com/channel/key
     */
    const getNewsletterInfo = async(key: string): Promise<NewsLetterMetadata> => {
        const result = await newsletterQuery({
            input: {
                key,
                type: 'INVITE'
            },
            fetch_viewer_metadata: false,
            fetch_full_image: true,
            fetch_creation_time: true,
        }, '6620195908089573')

        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        if (!json.data) throw new Error('Error while fetch newsletter info ' + json)
        return extractNewsletterMetadata(json.data?.xwa2_newsletter)
    }

    const getSubscribedNewsletters = async (): Promise<NewsLetterMetadata[]> => {
        const result = await newsletterQuery(undefined, '6388546374527196')

        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        if (!json.data) throw new Error('Error while fetch subscribed newsletters ' + json)
        return json.data.xwa2_newsletter_subscribed.map((v: any) => extractNewsletterMetadata(v))
    }

    const createNewsLetter = async(name: string, desc?: string, picture?: WAMediaUpload): Promise<NewsLetterMetadata> => {
        const result = await newsletterQuery({
            newsletter_input: {
                name,
                description: desc ?? null,
                picture: picture ? (await generateProfilePicture(picture)).img : null
            }
        }, "6234210096708695")

        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        if (!json.data) throw new Error('Error while create newsletter ' + json)
        return extractNewsletterMetadata(json.data?.xwa2_newsletter_create)
    }


    const toggleMuteNewsletter = async(jid: string, mute: boolean) => {
        let queryId = '6068417879924485'
        if (mute) queryId = '6274038279359549'
        const result = await newsletterQuery({
            newsletter_id: jid
        }, queryId)
        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        return json
    }

    const followNewsletter = async(jid: string) => {
        const result = await newsletterQuery({
            newsletter_id: jid
        }, '9926858900719341')
        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        return json
    }

    const unFollowNewsletter = async(jid: string) => {
        const result = await newsletterQuery({
            newsletter_id: jid
        }, '6392786840836363')
        const node = getBinaryNodeChildString(result, 'result')
        const json = JSON.parse(node!)
        return json
    }


    return {
        ...sock,
        getNewsletterInfo,
        createNewsLetter,
        getSubscribedNewsletters,
        toggleMuteNewsletter,
        followNewsletter,
        unFollowNewsletter
    }
}


export const extractNewsletterMetadata = (data: any): NewsLetterMetadata => {
    return {
        id: data.id,
        state: data.state,
        creationTime: +data.thread_metadata.creation_time,
        inviteCode: data.thread_metadata.invite,
        name: data.thread_metadata.name.text,
        desc: data.thread_metadata.description.text,
        subscriberCount: +data.thread_metadata.subscribers_count,
        verification: data.thread_metadata.verification,
        picture: data.thread_metadata.picture?.direct_path,
        preview: data.thread_metadata.preview.direct_path,
        settings: {
            reaction: data.thread_metadata.settings?.reaction_codes.value
        },
        mute: data.viewer_metadata?.mute,
        role: data.viewer_metadata?.role
    }
}