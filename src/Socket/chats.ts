import { SocketConfig, WAPresence, PresenceData, Chat, WAPatchCreate, WAMediaUpload, ChatMutation, WAPatchName, AppStateChunk, LTHashState, ChatModification, Contact, WABusinessProfile, WABusinessHoursConfig } from "../Types";
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, S_WHATSAPP_NET, reduceBinaryNodeToDictionary } from "../WABinary";
import { proto } from '../../WAProto'
import { generateProfilePicture, toNumber, encodeSyncdPatch, decodePatches, extractSyncdPatches, chatModificationToAppPatch, decodeSyncdSnapshot, newLTHashState } from "../Utils";
import { makeMessagesSocket } from "./messages-send";
import makeMutex from "../Utils/make-mutex";
import { Boom } from "@hapi/boom";

const MAX_SYNC_ATTEMPTS = 5

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

    const getAppStateSyncKey = async(keyId: string) => {
        const { [keyId]: key } = await authState.keys.get('app-state-sync-key', [keyId])
        return key
    }

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
        const { img } = await generateProfilePicture(content)
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
        const child = result.content?.[0] as BinaryNode
        return (child.content as BinaryNode[])?.map(i => i.attrs.jid)
    }

    const updateBlockStatus = async(jid: string, action: 'block' | 'unblock') => {
        await query({
            tag: 'iq',
            attrs: {
		xmlns: 'blocklist',
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

    const getBusinessProfile = async (jid: string): Promise<WABusinessProfile | void> => {
        const results = await query({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                xmlns: 'w:biz',
                type: 'get'
            },
            content: [{
                tag: 'business_profile',
                attrs: { v: '244' },
                content: [{
                    tag: 'profile',
                    attrs: { jid }
                }]
            }]
        })
        const profiles = getBinaryNodeChild(getBinaryNodeChild(results, 'business_profile'), 'profile')
        if (!profiles) {
            // if not bussines
            if (logger.level == 'trace') logger.trace({ jid }, 'Not bussines')
            return
        }
        const address = getBinaryNodeChild(profiles, 'address')
        const description = getBinaryNodeChild(profiles, 'description')
        const website = getBinaryNodeChild(profiles, 'website')
        const email = getBinaryNodeChild(profiles, 'email')
        const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
        const business_hours = getBinaryNodeChild(profiles, 'business_hours')
        const business_hours_config = business_hours && getBinaryNodeChildren(business_hours, 'business_hours_config')
        return {
            wid: profiles.attrs?.jid,
            address: address?.content.toString(),
            description: description?.content.toString(),
            website: [website?.content.toString()],
            email: email?.content.toString(),
            category: category?.content.toString(),
            business_hours: {
                timezone: business_hours?.attrs?.timezone,
                business_config: business_hours_config?.map(({ attrs }) => attrs as unknown as WABusinessHoursConfig)
            }
        } as unknown as WABusinessProfile
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

    const resyncAppState = async(collections: WAPatchName[], fromScratch: boolean = false) => {
        const appStateChunk : AppStateChunk = {totalMutations: [], collectionsToHandle: []}
        
        await authState.keys.transaction(
            async() => {
                const collectionsToHandle = new Set<string>(collections)
                // in case something goes wrong -- ensure we don't enter a loop that cannot be exited from 
                const attemptsMap = { } as { [T in WAPatchName]: number | undefined }
                // keep executing till all collections are done
                // sometimes a single patch request will not return all the patches (God knows why)
                // so we fetch till they're all done (this is determined by the "has_more_patches" flag)
                while(collectionsToHandle.size) {
                    const states = { } as { [T in WAPatchName]: LTHashState }
                    const nodes: BinaryNode[] = []

                    for(const name of collectionsToHandle) {
                        let state: LTHashState 
                        if(!fromScratch) {
                            const result = await authState.keys.get('app-state-sync-version', [name])
                            state = result[name]
                        }
                        if(!state) state = newLTHashState()

                        states[name] = state

                        logger.info(`resyncing ${name} from v${state.version}`)

                        nodes.push({
                            tag: 'collection',
                            attrs:  { 
                                name, 
                                version: state.version.toString(), 
                                // return snapshot if being synced from scratch
                                return_snapshot: (!state.version).toString()
                            }
                        })
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
                                content: nodes
                            }
                        ]
                    })
                    
                    const decoded = await extractSyncdPatches(result) // extract from binary node
                    for(const key in decoded) {
                        const name = key as WAPatchName
                        const { patches, hasMorePatches, snapshot } = decoded[name]
                        try {
                            if(snapshot) {
                                const newState = await decodeSyncdSnapshot(name, snapshot, getAppStateSyncKey)
                                states[name] = newState
    
                                logger.info(`restored state of ${name} from snapshot to v${newState.version}`)

                                await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })
                            }
                            // only process if there are syncd patches
                            if(patches.length) {
                                const { newMutations, state: newState } = await decodePatches(name, patches, states[name], getAppStateSyncKey, true)
    
                                await authState.keys.set({ 'app-state-sync-version': { [name]: newState } })
                    
                                logger.info(`synced ${name} to v${newState.version}`)
                                if(newMutations.length) {
                                    logger.trace({ newMutations, name }, 'recv new mutations')
                                }
    
                                appStateChunk.totalMutations.push(...newMutations)
                            }
                            if(hasMorePatches) {
                                logger.info(`${name} has more patches...`)
                            } else { // collection is done with sync
                                collectionsToHandle.delete(name)
                            }
                        } catch(error) {
                            logger.info({ name, error: error.stack }, 'failed to sync state from version, removing and trying from scratch')
                            await authState.keys.set({ "app-state-sync-version": { [name]: null } })

                            attemptsMap[name] = (attemptsMap[name] || 0) + 1
                            if(attemptsMap[name] >= MAX_SYNC_ATTEMPTS) {
                                collectionsToHandle.delete(name)
                            }
                        }
                    }
                }
            }
        )

        processSyncActions(appStateChunk.totalMutations)

        return appStateChunk
    }

    /**
     * fetch the profile picture of a user/group
     * type = "preview" for a low res picture
     * type = "image for the high res picture"
     */
    const profilePictureUrl = async(jid: string, type: 'preview' | 'image' = 'preview', timeoutMs?: number) => {
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
        }, timeoutMs)
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

        for(const { syncAction: { value: action }, index: [_, id, msgId, fromMe] } of actions) {
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
            } else if(action?.pinAction) {
                update.pin = action.pinAction?.pinned ? toNumber(action.timestamp) : undefined
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
        const myAppStateKeyId = authState.creds.myAppStateKeyId
        if(!myAppStateKeyId) {
            throw new Boom(`App state key not present!`, { statusCode: 400 })
        }

        await mutationMutex.mutex(
            async() => {
                logger.debug({ patch: patchCreate }, 'applying app patch')

                await resyncAppState([name])
                const { [name]: initial } = await authState.keys.get('app-state-sync-version', [name])
                const { patch, state } = await encodeSyncdPatch(
                    patchCreate,
                    myAppStateKeyId,
                    initial,
                    getAppStateSyncKey,
                )

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
        
                await authState.keys.set({ 'app-state-sync-version': { [name]: state } })
                
                if(config.emitOwnEvents) {
                    const result = await decodePatches(name, [{ ...patch, version: { version: state.version }, }], initial, getAppStateSyncKey)
                    processSyncActions(result.newMutations)
                }
            }
        )
    }
    /** sending abt props may fix QR scan fail if server expects */
    const fetchAbt = async() => {
        const abtNode = await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                xmlns: 'abt',
                type: 'get',
                id: generateMessageTag(),
            },
            content: [
                { tag: 'props', attrs: { protocol: '1' } }
            ]
        })

        const propsNode = getBinaryNodeChild(abtNode, 'props')
        
        let props: { [_: string]: string } = { }
        if(propsNode) {
            props = reduceBinaryNodeToDictionary(propsNode, 'prop')
        }
        logger.debug('fetched abt')

        return props
    }
    /** sending non-abt props may fix QR scan fail if server expects */
    const fetchProps = async() => {
        const resultNode = await query({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                xmlns: 'w',
                type: 'get',
                id: generateMessageTag(),
            },
            content: [
                { tag: 'props', attrs: { } }
            ]
        })

        const propsNode = getBinaryNodeChild(resultNode, 'props')
        
        let props: { [_: string]: string } = { }
        if(propsNode) {
            props = reduceBinaryNodeToDictionary(propsNode, 'prop')
        }
        logger.debug('fetched props')

        return props
    }
    /**
     * modify a chat -- mark unread, read etc.
     * lastMessages must be sorted in reverse chronologically
     * requires the last messages till the last message received; required for archive & unread
    */
    const chatModify = (mod: ChatModification, jid: string) => {
        const patch = chatModificationToAppPatch(mod, jid)
        return appPatch(patch)
    }

    ws.on('CB:presence', handlePresenceUpdate)
    ws.on('CB:chatstate', handlePresenceUpdate)

    ws.on('CB:ib,,dirty', async(node: BinaryNode) => {
        const { attrs } = getBinaryNodeChild(node, 'dirty')
        const type = attrs.type
        switch(type) {
            case 'account_sync':
                let { lastAccountSyncTimestamp } = authState.creds
                if(lastAccountSyncTimestamp) {
                    await updateAccountSyncTimestamp(lastAccountSyncTimestamp)
                }
                lastAccountSyncTimestamp = +attrs.timestamp
                ev.emit('creds.update', { lastAccountSyncTimestamp })                
            break
            default:
                logger.info({ node }, `received unknown sync`)
            break
        }
    })

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
            fetchAbt()
            fetchProps()
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
        getBusinessProfile,
        resyncAppState,
        chatModify,
        resyncMainAppState,
	}
}