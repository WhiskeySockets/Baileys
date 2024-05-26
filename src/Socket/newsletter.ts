import { NewsLetterMetadata, RectionSettingsNewsletter, SocketConfig, WAMediaUpload } from '../Types'
import { generateProfilePicture } from '../Utils'
import { getBinaryNodeChildString, S_WHATSAPP_NET } from '../WABinary'
import { makeGroupsSocket } from './groups'

enum QueryId {
	METADATA = '6620195908089573',
	GETSUBSCRIBED = '6388546374527196',
	CREATE = '6996806640408138',
	UNMUTE = '7337137176362961',
	MUTE = '25151904754424642',
	FOLLOW = '7871414976211147',
	UNFOLLOW = '7238632346214362',
	UPDATE = '7150902998257522'
}

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
					'query_id': queryId
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
			'fetch_viewer_metadata': false,
			'fetch_full_image': true,
			'fetch_creation_time': true,
		}, QueryId.METADATA)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while fetch newsletter info ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter)
	}

	const getSubscribedNewsletters = async(): Promise<NewsLetterMetadata[]> => {
		const result = await newsletterQuery(undefined, QueryId.GETSUBSCRIBED)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while fetch subscribed newsletters ' + json)
		}

		return json.data.xwa2_newsletter_subscribed.map((v: any) => extractNewsletterMetadata(v))
	}

	const createNewsLetter = async(name: string, desc?: string, picture?: WAMediaUpload): Promise<NewsLetterMetadata> => {
		const result = await newsletterQuery({
			input: {
				name,
				description: desc ?? null,
				picture: picture ? (await generateProfilePicture(picture)).img.toString('base64') : null
			}
		}, QueryId.CREATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while create newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_create)
	}


	const toggleMuteNewsletter = async(jid: string, mute: boolean) => {
		let queryId = QueryId.UNMUTE
		if(mute) {
			queryId = QueryId.MUTE
		}

		const result = await newsletterQuery({
			'newsletter_id': jid
		}, queryId)
		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		return json
	}

	const followNewsletter = async(jid: string) => {
		const result = await newsletterQuery({
			'newsletter_id': jid
		}, QueryId.FOLLOW)
		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		return json
	}

	const unFollowNewsletter = async(jid: string) => {
		const result = await newsletterQuery({
			'newsletter_id': jid
		}, QueryId.UNFOLLOW)
		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		return json
	}

	const updateNewsletterName = async(jid: string, name: string) => {
		const result = await newsletterQuery({
			'newsletter_id': jid,
			updates: {
				name,
				description: undefined,
				picture: undefined,
				settings: null
			}
		}, QueryId.UPDATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while update newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_update)
	}

	const updateNewsletterDesc = async(jid: string, description: string) => {
		const result = await newsletterQuery({
			'newsletter_id': jid,
			updates: {
				name: undefined,
				description,
				picture: undefined,
				settings: null
			}
		}, QueryId.UPDATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while update newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_update)
	}

	const updateNewsletterPicture = async(jid: string, picture: WAMediaUpload) => {
		const result = await newsletterQuery({
			'newsletter_id': jid,
			updates: {
				name: undefined,
				description: undefined,
				picture: (await generateProfilePicture(picture)).img.toString('base64'),
				settings: null
			}
		}, QueryId.UPDATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while update newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_update)
	}

	const removeNewsletterPicture = async(jid: string) => {
		const result = await newsletterQuery({
			'newsletter_id': jid,
			updates: {
				name: undefined,
				description: undefined,
				picture: '',
				settings: null
			}
		}, QueryId.UPDATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while update newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_update)
	}

	const updateNewsletterReactionSetting = async(jid: string, value: RectionSettingsNewsletter) => {
		const result = await newsletterQuery({
			'newsletter_id': jid,
			updates: {
				name: undefined,
				description: undefined,
				picture: undefined,
				settings: {
					'reaction_codes': { value }
				}
			}
		}, QueryId.UPDATE)

		const node = getBinaryNodeChildString(result, 'result')
		const json = JSON.parse(node!)
		if(!json.data) {
			throw new Error('Error while update newsletter ' + json)
		}

		return extractNewsletterMetadata(json.data?.xwa2_newsletter_update)
	}

	return {
		...sock,
		getNewsletterInfo,
		createNewsLetter,
		getSubscribedNewsletters,
		toggleMuteNewsletter,
		followNewsletter,
		unFollowNewsletter,
		updateNewsletterName,
		updateNewsletterDesc,
		updateNewsletterPicture,
		updateNewsletterReactionSetting,
		removeNewsletterPicture
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