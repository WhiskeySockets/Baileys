import { encodeSyncdPatch, decodePatches, extractSyncdPatches, chatModificationToAppPatch } from "../Utils/chat-utils";
import { SocketConfig, WAPresence, PresenceData, Chat, WAPatchCreate, WAMediaUpload, ChatMutation, WAPatchName, LTHashState, ChatModification, Contact } from "../Types";
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, S_WHATSAPP_NET } from "../WABinary";
import { proto } from '../../WAProto'
import { generateProfilePicture, toNumber } from "../Utils";
import { makeMessagesRecvSocket } from "./messages-recv";

export const makeChatsSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeMessagesRecvSocket(config)
	const { 
		ev,
		ws,
		authState,
        processMessage,
        relayMessage,
        generateMessageTag,
		sendNode,
        query
	} = sock

    const interactiveQuery = async(userNodes: BinaryNode[], queryNode: BinaryNode) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'usync',
            },
            content: [
                {
                    tag: 'usync',
                    attrs: {
                        sid: generateMessageTag(),
                        mode: 'query',
                        last: 'true',
                        index: '0',
                        context: 'interactive',
                    },
                    content: [
                        {
                            tag: 'query',
                            attrs: { },
                            content: [ queryNode ]
                        },
                        {
                            tag: 'list',
                            attrs: { },
                            content: userNodes
                        }
                    ]
                }
            ],
        })

        const usyncNode = getBinaryNodeChild(result, 'usync')
        const listNode = getBinaryNodeChild(usyncNode, 'list')
        const users = getBinaryNodeChildren(listNode, 'user')

        return users
    }

    const onWhatsApp = async(...jids: string[]) => {
        const results = await interactiveQuery(
            [
                {
                    tag: 'user',
                    attrs: { },
                    content: jids.map(
                        jid => ({
                            tag: 'contact',
                            attrs: { },
                            content: `+${jid}`
                        })
                    )
                }
            ],
            { tag: 'contact', attrs: { } }
        )

        return results.map(user => {
            const contact = getBinaryNodeChild(user, 'contact')
            return { exists: contact.attrs.type === 'in', jid: user.attrs.jid }
        }).filter(item => item.exists)
    }

    const fetchStatus = async(jid: string) => {
        const [result] = await interactiveQuery(
            [{ tag: 'user', attrs: { jid } }], 
            { tag: 'status', attrs: { } }
        )
        if(result) {
            const status = getBinaryNodeChild(result, 'status')
            return {
                status: status.content!.toString(),
                setAt: new Date(+status.attrs.t * 1000)
            }
        }
    }

    const updateProfilePicture = async(jid: string, content: WAMediaUpload) => {
        const { img } = await generateProfilePicture('url' in content ? content.url.toString() : content)
        await query({
            tag: 'iq',
            attrs: {
                to: jidNormalizedUser(jid),
                type: 'set',
                xmlns: 'w:profile:picture'
            },
            content: [
                {
                    tag: 'picture',
                    attrs: { type: 'image' },
                    content: img
                }
            ]
        })
    }

    const fetchBlocklist = async() => {
        const result = await query({
            tag: 'iq',
            attrs: {
                xmlns: 'blocklist', 
                to: S_WHATSAPP_NET, 
                type: 'get'
            }
        })
        console.log('blocklist', result)
    }

    const updateBlockStatus = async(jid: string, action: 'block' | 'unblock') => {
        await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set'
            },
            content: [
                {
                    tag: 'item',
                    attrs: {
                        action,
                        jid
                    }
                }
            ]
        })
    }

    const fetchPrivacySettings = async() => {
        const result = await query({
            tag: 'iq',
            attrs: {
                xmlns: 'privacy', 
                to: S_WHATSAPP_NET, 
                type: 'get'
            },
            content: [
                { tag: 'privacy', attrs: { } }
            ]
        })
        const nodes = getBinaryNodeChildren(result, 'category')
        const settings = nodes.reduce(
            (dict, { attrs }) => {
                dict[attrs.name] = attrs.value
                return dict
            }, { } as { [_: string]: string }
        )
        return settings
    }

    const updateAccountSyncTimestamp = async() => {
        await sendNode({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'urn:xmpp:whatsapp:dirty',
                id: generateMessageTag(),
            },
            content: [
                {
                    tag: 'clean',
                    attrs: {  }  
                }
            ]
        })
    }

    const collectionSync = async(collections: { name: WAPatchName, version: number }[]) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                xmlns: 'w:sync:app:state',
                type: 'set'
            },
            content: [
                {
                    tag: 'sync',
                    attrs: { },
                    content: collections.map(
                        ({ name, version }) => ({
                            tag: 'collection',
                            attrs:  { name, version: version.toString(), return_snapshot: 'true' }
                        })
                    )
                }
            ]
        })
        const syncNode = getBinaryNodeChild(result, 'sync')
        const collectionNodes = getBinaryNodeChildren(syncNode, 'collection')
        return collectionNodes.reduce(
            (dict, node) => {
                const snapshotNode = getBinaryNodeChild(node, 'snapshot')
                if(snapshotNode) {
                    dict[node.attrs.name] = snapshotNode.content as Uint8Array
                }
                return dict
            }, { } as { [P in WAPatchName]: Uint8Array }
        )
    }

    const profilePictureUrl = async(jid: string) => {
        jid = jidNormalizedUser(jid)
        const result = await query({
            tag: 'iq',
            attrs: {
                to: jid,
                type: 'get',
                xmlns: 'w:profile:picture'
            },
            content: [
                { tag: 'picture', attrs: { type: 'preview', query: 'url' } }
            ]
        })
        const child = getBinaryNodeChild(result, 'picture')
        return child?.attrs?.url
    }

    const sendPresenceUpdate = async(type: WAPresence, toJid?: string) => {
        if(type === 'available' || type === 'unavailable') {
            await sendNode({
                tag: 'presence',
                attrs: {
                    name: authState.creds.me!.name,
                    type
                }
            })
        } else {
            await sendNode({
                tag: 'chatstate',
                attrs: {
                    from: authState.creds.me!.id!,
                    to: toJid,
                },
                content: [
                    { tag: type, attrs: { } }
                ]
            })
        }
    }

    const presenceSubscribe = (toJid: string) => (
        sendNode({
            tag: 'presence',
            attrs: {
                to: toJid,
                id: generateMessageTag(),
                type: 'subscribe'
            }
        })
    )

    const handlePresenceUpdate = ({ tag, attrs, content }: BinaryNode) => {
        let presence: PresenceData
        const jid = attrs.from
        const participant = attrs.participant || attrs.from
        if(tag === 'presence') {
            presence = {
                lastKnownPresence: attrs.type === 'unavailable' ? 'unavailable' : 'available',
                lastSeen: attrs.t ? +attrs.t : undefined
            }
        } else if(Array.isArray(content)) {
            const [firstChild] = content
            let type = firstChild.tag as WAPresence
            if(type === 'paused') {
                type = 'available'
            }
            presence = { lastKnownPresence: type }
        } else {
            logger.error({ tag, attrs, content }, 'recv invalid presence node')
        }
        if(presence) {
            ev.emit('presence.update', { id: jid, presences: { [participant]: presence } })
        }
    }

    const processSyncActions = (actions: ChatMutation[]) => {

        const updates: { [jid: string]: Partial<Chat> } = {}
        const contactUpdates: { [jid: string]: Contact } = {}
        const msgDeletes: proto.IMessageKey[] = []

        for(const { action, index: [_, id, msgId, fromMe] } of actions) {
            const update: Partial<Chat> = { id }
            if(action?.muteAction) {
                update.mute = action.muteAction?.muted ? 
                        toNumber(action.muteAction!.muteEndTimestamp!) :
                        undefined
            } else if(action?.archiveChatAction) {
                update.archive = !!action.archiveChatAction?.archived
            } else if(action?.markChatAsReadAction) {
                update.unreadCount = !!action.markChatAsReadAction?.read ? 0 : -1
            } else if(action?.clearChatAction) {
                msgDeletes.push({
                    remoteJid: id,
                    id: msgId,
                    fromMe: fromMe === '1'
                })
            } else if(action?.contactAction) {
                contactUpdates[id] = {
                    ...(contactUpdates[id] || {}),
                    id,
                    name: action.contactAction!.fullName
                }
            } else if(action?.pushNameSetting) {
                authState.creds.me!.name = action?.pushNameSetting?.name!
                ev.emit('auth-state.update', authState)
            } else {
                logger.warn({ action, id }, 'unprocessable update')
            }
            if(Object.keys(update).length > 1) {
                updates[update.id] = {
                    ...(updates[update.id] || {}),
                    ...update
                }
            }
        }

        if(Object.values(updates).length) {
            ev.emit('chats.update', Object.values(updates))
        }
        if(Object.values(contactUpdates).length) {
            ev.emit('contacts.upsert', Object.values(contactUpdates))
        }
        if(msgDeletes.length) {
            ev.emit('messages.delete', { keys: msgDeletes })
        }
    }

    const appPatch = async(patchCreate: WAPatchCreate) => {
        const name = patchCreate.type

        await resyncState(name, false)
        const { patch, state } = await encodeSyncdPatch(
            patchCreate,
            authState,
        )
        const initial = await authState.keys.getAppStateSyncVersion(name)
        // temp: verify it was encoded correctly
        const result = await decodePatches({ syncds: [{ ...patch, version: { version: state.version }, }], name }, initial, authState)

        const node: BinaryNode = {
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:sync:app:state'
            },
            content: [
                {
                    tag: 'sync',
                    attrs: { },
                    content: [
                        {
                            tag: 'collection',
                            attrs: {
                                name,
                                version: (state.version-1).toString(),
                                return_snapshot: 'false'
                            },
                            content: [
                                {
                                    tag: 'patch',
                                    attrs: { },
                                    content: proto.SyncdPatch.encode(patch).finish()
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        await query(node)

        await authState.keys.setAppStateSyncVersion(name, state)
        ev.emit('auth-state.update', authState)
        if(config.emitOwnEvents) {
            processSyncActions(result.newMutations)
        }
    }

    const chatModify = (mod: ChatModification, jid: string, lastMessages: Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>[]) => {
        const patch = chatModificationToAppPatch(mod, jid, lastMessages)
        return appPatch(patch)
    }

    const fetchAppState = async(name: WAPatchName, fromVersion: number) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                type: 'set',
                xmlns: 'w:sync:app:state',
                to: S_WHATSAPP_NET
            },
            content: [
                {
                    tag: 'sync',
                    attrs: { },
                    content: [
                        {
                            tag: 'collection',
                            attrs: {
                                name,
                                version: fromVersion.toString(),
                                return_snapshot: 'false'
                            }
                        }
                    ]
                }
            ]
        })
        return result
    }

    const resyncState = async(name: WAPatchName, fromScratch: boolean) => {
        let state: LTHashState = fromScratch ? undefined : await authState.keys.getAppStateSyncVersion(name)
        if(!state) state = { version: 0, hash: Buffer.alloc(128), mutations: [] }

        logger.info(`resyncing ${name} from v${state.version}`)

        const result = await fetchAppState(name, state.version)
        const decoded = extractSyncdPatches(result) // extract from binary node
        const { newMutations, state: newState } = await decodePatches(decoded, state, authState, true)
        
        await authState.keys.setAppStateSyncVersion(name, newState)

        logger.info(`synced ${name} to v${newState.version}`)
        processSyncActions(newMutations)

        ev.emit('auth-state.update', authState)
    }

    ws.on('CB:presence', handlePresenceUpdate)
    ws.on('CB:chatstate', handlePresenceUpdate)

    ws.on('CB:notification,type:server_sync', (node: BinaryNode) => {
        const update = getBinaryNodeChild(node, 'collection')
        if(update) {
            resyncState(update.attrs.name as WAPatchName, false)
        }
    })

    ev.on('connection.update', ({ connection }) => {
        if(connection === 'open') {
            sendPresenceUpdate('available')
            fetchBlocklist()
            fetchPrivacySettings()
        }
    })

	return {
		...sock, 
        appPatch,
		sendPresenceUpdate,
		presenceSubscribe,
        profilePictureUrl,
        onWhatsApp,
        fetchBlocklist,
        fetchPrivacySettings,
        fetchStatus,
        updateProfilePicture,
        updateBlockStatus,
        resyncState,
        chatModify,
	}
}