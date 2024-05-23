import { proto } from '../../WAProto'
import { GroupMetadata, GroupParticipant, ParticipantAction, SocketConfig, WAMessageKey, WAMessageStubType } from '../Types'
import { generateMessageID, unixTimestampSeconds } from '../Utils'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString, jidEncode, jidNormalizedUser } from '../WABinary'
import { makeGroupsSocket } from './groups'

export const makeNewsletterSocket = (config: SocketConfig) => {
	const sock = makeGroupsSocket(config)
	const { authState, ev, query, upsertMessage, generateMessageTag } = sock

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

    const enableLiveUpdates = async(jid: string) => {
        return newsletterQuery(jid, 'set', [{tag: 'live_updates', attrs: {}, content: []}])
            .then(() => true)
    }

    return {
		...sock,
        enableLiveUpdates
    }
}
