import { decodeSyncdPatch, encodeSyncdPatch } from "../Utils/chat-utils";
import { SocketConfig, WAPresence, PresenceData, Chat, ChatModification, WAMediaUpload } from "../Types";
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, jidNormalizedUser, S_WHATSAPP_NET } from "../WABinary";
import { makeSocket } from "./socket";
import { proto } from '../../WAProto'
import { toNumber } from "../Utils/generics";
import { compressImage, generateProfilePicture } from "..";

export const makeChatsSocket = (config: SocketConfig) => {
	const { logger } = config
	const sock = makeSocket(config)
	const { 
		ev,
		ws,
		authState,
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
            }
        })
        console.log('privacy', result)
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

    const collectionSync = async() => {
        const COLLECTIONS = ['critical_block', 'critical_unblock_low', 'regular_low', 'regular_high']
        await sendNode({
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                xmlns: 'w:sync:app:state',
                type: 'set',
                id: generateMessageTag(),
            },
            content: [
                {
                    tag: 'sync',
                    attrs: { },
                    content: COLLECTIONS.map(
                        name => ({
                            tag: 'collection',
                            attrs:  { name, version: '0', return_snapshot: 'true' }
                        })
                    )
                }
            ]
        })
        logger.info('synced collection')
    }

    const profilePictureUrl = async(jid: string) => {
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

    const processSyncActions = (actions: { action: proto.ISyncActionValue, index: [string, string] }[]) => {
        const updates: Partial<Chat>[] = []
        for(const { action, index: [_, id] } of actions) {
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
                console.log(action.clearChatAction)
            } else if(action?.contactAction) {
                ev.emit('contacts.update', [{ id, name: action.contactAction!.fullName }])  
            } else if(action?.pushNameSetting) {
                authState.creds.me!.name = action?.pushNameSetting?.name!
                ev.emit('auth-state.update', authState)
            } else {
                logger.warn({ action, id }, 'unprocessable update')
            }
            updates.push(update)
        }
        ev.emit('chats.update', updates)
    }

    const patchChat = async(
        jid: string,
        modification: ChatModification
    ) => {
        const patch = encodeSyncdPatch(modification, { remoteJid: jid }, authState)
        const type = 'regular_high'
        const ver = authState.creds.appStateVersion![type] || 0
        const node: BinaryNode = {
            tag: 'iq',
            attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:sync:app:state'
            },
            content: [
                {
                    tag: 'patch',
                    attrs: {
                        name: type,
                        version: (ver+1).toString(),
                        return_snapshot: 'false'
                    },
                    content: proto.SyncdPatch.encode(patch).finish()
                }
            ]
        }
        await query(node)

        authState.creds.appStateVersion![type] += 1
        ev.emit('auth-state.update', authState)
    }

    const resyncState = async(name: 'regular_high' | 'regular_low' = 'regular_high') => {
        authState.creds.appStateVersion = authState.creds.appStateVersion || {
            regular_high: 0,
            regular_low: 0,
            critical_unblock_low: 0,
            critical_block: 0
        }
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
                                version: authState.creds.appStateVersion[name].toString(),
                                return_snapshot: 'false'
                            }
                        }
                    ]
                }
            ]
        })
        const syncNode = getBinaryNodeChild(result, 'sync')
        const collectionNode = getBinaryNodeChild(syncNode, 'collection')
        const patchesNode = getBinaryNodeChild(collectionNode, 'patches')

        const patches = getBinaryNodeChildren(patchesNode, 'patch')
        const successfulMutations = patches.flatMap(({ content }) => {
            if(content) {
                const syncd = proto.SyncdPatch.decode(content! as Uint8Array)
                const version = toNumber(syncd.version!.version!)
                if(version) { 
                    authState.creds.appStateVersion[name] = Math.max(version, authState.creds.appStateVersion[name])
                }
                const { mutations, failures } = decodeSyncdPatch(syncd, authState)
                if(failures.length) {
                    logger.info(
                        { failures: failures.map(f => ({ trace: f.stack, data: f.data })) }, 
                        'failed to decode'
                    )
                }
                return mutations
            }
            return []
        })
        processSyncActions(successfulMutations)
        ev.emit('auth-state.update', authState)
    }

    ws.on('CB:presence', handlePresenceUpdate)
    ws.on('CB:chatstate', handlePresenceUpdate)

    ws.on('CB:notification,type:server_sync', (node: BinaryNode) => {
        const update = getBinaryNodeChild(node, 'collection')
        if(update) {
            resyncState(update.attrs.name as any)
        }
    })

    ev.on('connection.update', ({ connection }) => {
        if(connection === 'open') {
            sendPresenceUpdate('available')
            fetchBlocklist()
            fetchPrivacySettings()
            //collectionSync()
        }
    })

	return {
		...sock, 
        patchChat,
		sendPresenceUpdate,
		presenceSubscribe,
        profilePictureUrl,
        onWhatsApp,
        fetchBlocklist,
        fetchPrivacySettings,
        fetchStatus,
        updateProfilePicture,
        updateBlockStatus
	}
}