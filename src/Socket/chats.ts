import { SocketConfig, WAPresence, PresenceData, Chat, WAPatchCreate, WAMediaUpload, ChatMutation, WAPatchName, LTHashState, ChatModification, Contact } from "../Types";
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, S_WHATSAPP_NET } from "../WABinary";
import { proto } from '../../WAProto'
import { generateProfilePicture, toNumber, encodeSyncdPatch, decodePatches, extractSyncdPatches, chatModificationToAppPatch, decodeSyncdSnapshot, newLTHashState } from "../Utils";
import { makeMessagesSocket } from "./messages-send";
import makeMutex from "../Utils/make-mutex";

export const makeChatsSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeMessagesSocket(config)
	const { 
		ev,
		ws,
		authState,
        generateMessageTag,
		sendNode,
        query,
        fetchPrivacySettings,
	} = sock

    const mutationMutex = makeMutex()

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

    const updateAccountSyncTimestamp = async(fromTimestamp: number | string) => {
        logger.info({ fromTimestamp }, 'requesting account sync')
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
                    attrs: {
                        type: 'account_sync',
                        timestamp: fromTimestamp.toString(),
                    }  
                }
            ]
        })
    }

    const resyncAppStateInternal = async(collections: WAPatchName[], fromScratch: boolean = false, returnSnapshot: boolean = false) => {
        if(fromScratch) returnSnapshot = true

        const states = { } as { [T in WAPatchName]: LTHashState }
        for(const name of collections) {
            let state: LTHashState = fromScratch ? undefined : await authState.keys.getAppStateSyncVersion(name)
            if(!state) state = newLTHashState()

            states[name] = state

            logger.info(`resyncing ${name} from v${state.version}`)
        }
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
                        (name) => ({
                            tag: 'collection',
                            attrs:  { 
                                name, 
                                version: states[name].version.toString(), 
                                return_snapshot: returnSnapshot ? 'true' : 'false'
                            }
                        })
                    )
                }
            ]
        })
        
        const decoded = await extractSyncdPatches(result) // extract from binary node
        const totalMutations: ChatMutation[] = []
        for(const key in decoded) {
            const name = key as WAPatchName
            const { patches, snapshot } = decoded[name]
            if(snapshot) {
                const newState = await decodeSyncdSnapshot(name, snapshot, authState.keys.getAppStateSyncKey)
                states[name] = newState

                logger.info(`restored state of ${name} from snapshot to v${newState.version}`)
            }
            // only process if there are syncd patches
            if(patches.length) {
                const { newMutations, state: newState } = await decodePatches(name, patches, states[name], authState.keys.getAppStateSyncKey, true)

                await authState.keys.setAppStateSyncVersion(name, newState)
    
                logger.info(`synced ${name} to v${newState.version}`)
                processSyncActions(newMutations)

                totalMutations.push(...newMutations)
            }
        }

        return totalMutations
    }

    const resyncAppState = async(collections: WAPatchName[], returnSnapshot: boolean = false) => {
        let result: ChatMutation[]
        try {
            result = await resyncAppStateInternal(collections, false, returnSnapshot)
        } catch(error) {
            logger.info({ collections, error: error.stack }, 'failed to sync state from version, trying from scratch')
            result = await resyncAppStateInternal(collections, true, true)
        }
        return result
    }

    /**
     * fetch the profile picture of a user/group
     * type = "preview" for a low res picture
     * type = "image for the high res picture"
     */
    const profilePictureUrl = async(jid: string, type: 'preview' | 'image' = 'preview') => {
        jid = jidNormalizedUser(jid)
        const result = await query({
            tag: 'iq',
            attrs: {
                to: jid,
                type: 'get',
                xmlns: 'w:profile:picture'
            },
            content: [
                { tag: 'picture', attrs: { type, query: 'url' } }
            ]
        })
        const child = getBinaryNodeChild(result, 'picture')
        return child?.attrs?.url
    }

    const sendPresenceUpdate = async(type: WAPresence, toJid?: string) => {
        const me = authState.creds.me!
        if(type === 'available' || type === 'unavailable') {
            await sendNode({
                tag: 'presence',
                attrs: {
                    name: me!.name,
                    type
                }
            })
        } else {
            await sendNode({
                tag: 'chatstate',
                attrs: {
                    from: me!.id!,
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

    const resyncMainAppState = async() => {
        
        logger.debug('resyncing main app state')
        
        await (
            mutationMutex.mutex(
                () => resyncAppState([ 
                    'critical_block', 
                    'critical_unblock_low', 
                    'regular_high', 
                    'regular_low', 
                    'regular' 
                ])
            )
            .catch(err => (
                logger.warn({ trace: err.stack }, 'failed to sync app state')
            ))
        )
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
                const me = {
                    ...authState.creds.me!,
                    name:  action?.pushNameSetting?.name!
                }
                ev.emit('creds.update', { me })
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
        await mutationMutex.mutex(
            async() => {
                await resyncAppState([name])
                const { patch, state } = await encodeSyncdPatch(
                    patchCreate,
                    authState,
                )
                const initial = await authState.keys.getAppStateSyncVersion(name)
                // temp: verify it was encoded correctly
                const result = await decodePatches(name, [{ ...patch, version: { version: state.version }, }], initial, authState.keys.getAppStateSyncKey)
        
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
                
                if(config.emitOwnEvents) {
                    processSyncActions(result.newMutations)
                }
            }
        )
    }

    const chatModify = (mod: ChatModification, jid: string, lastMessages: Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>[]) => {
        const patch = chatModificationToAppPatch(mod, jid, lastMessages)
        return appPatch(patch)
    }

    ws.on('CB:presence', handlePresenceUpdate)
    ws.on('CB:chatstate', handlePresenceUpdate)

    /*ws.on('CB:ib,,dirty', async(node: BinaryNode) => {
        const { attrs } = getBinaryNodeChild(node, 'dirty')
        const type = attrs.type
        switch(type) {
            case 'account_sync':
                await updateAccountSyncTimestamp(attrs.timestamp)
            break
            default:
                logger.info({ node }, `received unknown sync`)
            break
        }
    })*/

    ws.on('CB:notification,type:server_sync', (node: BinaryNode) => {
        const update = getBinaryNodeChild(node, 'collection')
        if(update) {
            const name = update.attrs.name as WAPatchName
            mutationMutex.mutex(
                async() => {
                    await resyncAppState([name], false)
                        .catch(err => logger.error({ trace: err.stack, node }, `failed to sync state`))
                }
            )
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
        fetchStatus,
        updateProfilePicture,
        updateBlockStatus,
        resyncAppState,
        chatModify,
        resyncMainAppState,
	}
}