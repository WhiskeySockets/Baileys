import { Boom } from '@hapi/boom'
import { aesDecrypt, hmacSign, aesEncrypt, hkdf } from "./crypto"
import { AuthenticationState, WAPatchCreate, ChatMutation, WAPatchName, LTHashState, ChatModification } from "../Types"
import { proto } from '../../WAProto'
import { LT_HASH_ANTI_TAMPERING } from './lt-hash'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren } from '../WABinary'
import { toNumber } from './generics'
import { downloadContentFromMessage,  } from './messages-media'

export const mutationKeys = (keydata: Uint8Array) => {
    const expanded = hkdf(keydata, 160, { info: 'WhatsApp Mutation Keys' })
    return {
        indexKey: expanded.slice(0, 32),
        valueEncryptionKey: expanded.slice(32, 64),
        valueMacKey: expanded.slice(64, 96),
        snapshotMacKey: expanded.slice(96, 128),
        patchMacKey: expanded.slice(128, 160)
    }
}

const generateMac = (operation: proto.SyncdMutation.SyncdMutationSyncdOperation, data: Buffer, keyId: Uint8Array | string, key: Buffer) => {
    const getKeyData = () => {
        let r: number
        switch (operation) {
        case proto.SyncdMutation.SyncdMutationSyncdOperation.SET:
            r = 0x01
            break
        case proto.SyncdMutation.SyncdMutationSyncdOperation.REMOVE:
            r = 0x02
            break
        }
        const buff = Buffer.from([r])
        return Buffer.concat([ buff, Buffer.from(keyId as any, 'base64') ])
    }
    const keyData = getKeyData()

    const last = Buffer.alloc(8) // 8 bytes
    last.set([ keyData.length ], last.length-1)

    const total = Buffer.concat([ keyData, data, last ])
    const hmac = hmacSign(total, key, 'sha512')

    return hmac.slice(0, 32)
}

const to64BitNetworkOrder = function(e) {
    const t = new ArrayBuffer(8)
    new DataView(t).setUint32(4, e, !1)
    return Buffer.from(t)
}

type Mac = { indexMac: Uint8Array, valueMac: Uint8Array, operation: proto.SyncdMutation.SyncdMutationSyncdOperation }

const computeLtHash = (initial: Uint8Array, macs: Mac[], getPrevSetValueMac: (index: Uint8Array, internalIndex: number) => Uint8Array) => {
    const addBuffs: ArrayBuffer[] = []
    const subBuffs: ArrayBuffer[] = []
    for(let i = 0; i < macs.length;i++) {
        const { indexMac, valueMac, operation } = macs[i]
        const subBuff = getPrevSetValueMac(indexMac, i)
        if(operation === proto.SyncdMutation.SyncdMutationSyncdOperation.REMOVE) {
            if(!subBuff) {
                throw new Boom('tried remove, but no buffer', { statusCode: 500 })
            }
        } else {
            addBuffs.push(new Uint8Array(valueMac).buffer)
        }
        if(subBuff) {
            subBuffs.push(new Uint8Array(subBuff).buffer)
        }
    }

    const result = LT_HASH_ANTI_TAMPERING.subtractThenAdd(new Uint8Array(initial).buffer, addBuffs, subBuffs)
    const buff = Buffer.from(result)
    return buff
}

export const generateSnapshotMac = (lthash: Uint8Array, version: number, name: WAPatchName, key: Buffer) => {
    const total = Buffer.concat([
        lthash,
        to64BitNetworkOrder(version),
        Buffer.from(name, 'utf-8')
    ])
    return hmacSign(total, key, 'sha256')
}
const generatePatchMac = (snapshotMac: Uint8Array, valueMacs: Uint8Array[], version: number, type: WAPatchName, key: Buffer) => {
    const total = Buffer.concat([
        snapshotMac,
        ...valueMacs,
        to64BitNetworkOrder(version),
        Buffer.from(type, 'utf-8')
    ])
    return hmacSign(total, key)
}

export const encodeSyncdPatch = async(
    { type, index, syncAction, apiVersion }: WAPatchCreate,
    { creds: { myAppStateKeyId }, keys }: AuthenticationState
) => {
    const key = !!myAppStateKeyId ? await keys.getAppStateSyncKey(myAppStateKeyId) : undefined
    if(!key) {
        throw new Boom(`myAppStateKey not present`, { statusCode: 404 })
    }
    const encKeyId = Buffer.from(myAppStateKeyId, 'base64')

    const operation = proto.SyncdMutation.SyncdMutationSyncdOperation.SET

    const state = { ...await keys.getAppStateSyncVersion(type) }

    const indexBuffer = Buffer.from(JSON.stringify(index))
    const encoded = proto.SyncActionData.encode({
        index: indexBuffer,
        value: syncAction,
        padding: new Uint8Array(0),
        version: apiVersion
    }).finish()

    const keyValue = mutationKeys(key!.keyData!)

    const encValue = aesEncrypt(encoded, keyValue.valueEncryptionKey)
    const valueMac = generateMac(operation, encValue, encKeyId, keyValue.valueMacKey)
    const indexMac = hmacSign(indexBuffer, keyValue.indexKey)

    state.hash = computeLtHash(
        state.hash, 
        [ { indexMac, valueMac, operation } ],
        (index) => [...state.mutations].reverse().find(m => Buffer.compare(m.indexMac, index) === 0)?.valueMac
    )
    state.version += 1

    const snapshotMac = generateSnapshotMac(state.hash, state.version, type, keyValue.snapshotMacKey)

    const patch: proto.ISyncdPatch = {
        patchMac: generatePatchMac(snapshotMac, [valueMac], state.version, type, keyValue.patchMacKey),
        snapshotMac: snapshotMac,
        keyId: { id: encKeyId },
        mutations: [
            {
                operation: operation,
                record: {
                    index: {
                        blob: indexMac
                    },
                    value: {
                        blob: Buffer.concat([ encValue, valueMac ])
                    },
                    keyId: { id: encKeyId }
                }
            }
        ]
    }

    state.mutations = [
        ...state.mutations,
        {
            action: syncAction,
            index,
            valueMac,
            indexMac,
            operation
        }
    ]
    return { patch, state }
}

export const decodeSyncdPatch = async(
    msg: proto.ISyncdPatch, 
    name: WAPatchName,
    {keys}: AuthenticationState,
    validateMacs: boolean = true
) => {
    const keyCache: { [_: string]: ReturnType<typeof mutationKeys> } = { }
    const getKey = async(keyId: Uint8Array) => {
        const base64Key = Buffer.from(keyId!).toString('base64')
        let key = keyCache[base64Key]
        if(!key) {
            const keyEnc = await keys.getAppStateSyncKey(base64Key)
            if(!keyEnc) {
                throw new Boom(`failed to find key "${base64Key}" to decode mutation`, { statusCode: 500, data: msg })
            }
            const result = mutationKeys(keyEnc.keyData!)
            keyCache[base64Key] = result
            key = result
        }
        return key
    }

    const mutations: ChatMutation[] = []

    if(validateMacs) {
        const mainKey = await getKey(msg.keyId!.id)
        const mutationmacs = msg.mutations!.map(mutation => mutation.record!.value!.blob!.slice(-32))
    
        const patchMac = generatePatchMac(msg.snapshotMac, mutationmacs, toNumber(msg.version!.version), name, mainKey.patchMacKey)
        if(Buffer.compare(patchMac, msg.patchMac) !== 0) {
            throw new Boom('Invalid patch mac')
        } 
    }

    // indexKey used to HMAC sign record.index.blob
    // valueEncryptionKey used to AES-256-CBC encrypt record.value.blob[0:-32]
    // the remaining record.value.blob[0:-32] is the mac, it the HMAC sign of key.keyId + decoded proto data + length of bytes in keyId
    for(const { operation, record } of msg.mutations!) {
        const key = await getKey(record.keyId!.id!)
        const content = Buffer.from(record.value!.blob!)
        const encContent = content.slice(0, -32)
        const ogValueMac = content.slice(-32)
        if(validateMacs) {
            const contentHmac = generateMac(operation, encContent, record.keyId!.id!, key.valueMacKey)
            if(Buffer.compare(contentHmac, ogValueMac) !== 0) {
                throw new Boom('HMAC content verification failed')
            }
        }

        const result = aesDecrypt(encContent, key.valueEncryptionKey)
        const syncAction = proto.SyncActionData.decode(result)

        if(validateMacs) {
            const hmac = hmacSign(syncAction.index, key.indexKey)
            if(Buffer.compare(hmac, record.index!.blob) !== 0) {
                throw new Boom('HMAC index verification failed')
            }
        }

        const indexStr = Buffer.from(syncAction.index).toString()
        mutations.push({ 
            action: syncAction.value!, 
            index: JSON.parse(indexStr),
            indexMac: record.index!.blob!,
            valueMac: ogValueMac,
            operation: operation
        })
    }

    return { mutations }
}

export const extractSyncdPatches = (result: BinaryNode) => {
    const syncNode = getBinaryNodeChild(result, 'sync')
    const collectionNodes = getBinaryNodeChildren(syncNode, 'collection')
    
    const final = { } as { [T in WAPatchName]: proto.ISyncdPatch[] }
    for(const collectionNode of collectionNodes) {
        const patchesNode = getBinaryNodeChild(collectionNode, 'patches')

        const patches = getBinaryNodeChildren(patchesNode || collectionNode, 'patch')
        const syncds: proto.ISyncdPatch[] = []
        const name = collectionNode.attrs.name as WAPatchName
        for(let { content } of patches) {
            if(content) {
                const syncd = proto.SyncdPatch.decode(content! as Uint8Array)
                if(!syncd.version) {
                    syncd.version = { version: +collectionNode.attrs.version+1 }
                }
                syncds.push(syncd)
            }
        }

        final[name] = syncds
    }
    
    return final
}

export const downloadExternalPatch = async(blob: proto.IExternalBlobReference) => {
    const stream = await downloadContentFromMessage(blob, 'md-app-state')
	let buffer = Buffer.from([])
	for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
	}
	const syncData = proto.SyncdMutations.decode(buffer)
	return syncData
}

export const decodePatches = async(
    name: WAPatchName,
    syncds: proto.ISyncdPatch[],
    initial: LTHashState,
    auth: AuthenticationState,
    validateMacs: boolean = true
) => {
    const successfulMutations: ChatMutation[] = []

    let current = initial.hash
    let currentVersion = initial.version

    for(const syncd of syncds) {
        const { mutations, version, keyId, snapshotMac, externalMutations } = syncd
        if(externalMutations) {
            const ref = await downloadExternalPatch(externalMutations)
            mutations.push(...ref.mutations)
        }
        const macs = mutations.map(
            m => ({
                operation: m.operation!,
                indexMac: m.record.index!.blob!,
                valueMac: m.record.value!.blob!.slice(-32)
            })
        )
        
        currentVersion = toNumber(version.version!)

        current = computeLtHash(current, macs, (index, maxIndex) => {
            let value: Uint8Array
            for(const item of initial.mutations) {
                if(Buffer.compare(item.indexMac, index) === 0) {
                    value = item.valueMac
                }
            }
            for(const { version, mutations } of syncds) {
                const versionNum = toNumber(version.version!)
                const mutationIdx = mutations.findIndex(m => {
                    return Buffer.compare(m.record!.index!.blob, index) === 0
                })

                if(mutationIdx >= 0 && (versionNum < currentVersion || mutationIdx < maxIndex)) {
                    value = mutations[mutationIdx].record!.value!.blob!.slice(-32)
                }

                if(versionNum >= currentVersion) {
                    break
                }
            }
            return value
        })
        
        if(validateMacs) {
            const base64Key = Buffer.from(keyId!.id!).toString('base64')
            const keyEnc = await auth.keys.getAppStateSyncKey(base64Key)
            if(!keyEnc) {
                throw new Boom(`failed to find key "${base64Key}" to decode mutation`, { statusCode: 500 })
            }
            const result = mutationKeys(keyEnc.keyData!)
            const computedSnapshotMac = generateSnapshotMac(current, currentVersion, name, result.snapshotMacKey)
            if(Buffer.compare(snapshotMac, computedSnapshotMac) !== 0) {
                throw new Boom(`failed to verify LTHash at ${currentVersion} of ${name}`, { statusCode: 500 })
            }
        }

        const decodeResult = await decodeSyncdPatch(syncd, name, auth!, validateMacs)
        successfulMutations.push(...decodeResult.mutations)
    }
    return {
        newMutations: successfulMutations,
        state: { 
            hash: current, 
            version: currentVersion, 
            mutations: [...initial.mutations, ...successfulMutations]
        } as LTHashState
    }
}

export const chatModificationToAppPatch = (
    mod: ChatModification,
    jid: string,
    lastMessages: Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>[]
) => {
    const messageRange: proto.ISyncActionMessageRange = {
        lastMessageTimestamp: lastMessages[lastMessages.length-1].messageTimestamp,
        messages: lastMessages
    }
    const timestamp = Date.now()
    let patch: WAPatchCreate
    if('mute' in mod) {
        patch = {
            syncAction: {
                timestamp,
                muteAction: {
                    muted: !!mod.mute,
                    muteEndTimestamp: mod.mute || undefined
                }
            },
            index: ['mute', jid],
            type: 'regular_high',
            apiVersion: 2
        }
    } else if('archive' in mod) {
        patch = {
            syncAction: {
                timestamp,
                archiveChatAction: {
                    archived: !!mod.archive,
                    messageRange
                }
            },
            index: ['archive', jid],
            type: 'regular_low',
            apiVersion: 3
        }
    } else if('markRead' in mod) {
        patch = {
            syncAction: {
                timestamp,
                markChatAsReadAction: {
                    read: mod.markRead,
                    messageRange
                }
            },
            index: ['markChatAsRead', jid],
            type: 'regular_low',
            apiVersion: 3
        }
    } else if('clear' in mod) {
        if(mod.clear === 'all') {
            throw new Boom('not supported')
        } else {
            const key = mod.clear.message
            patch = {
                syncAction: {
                    timestamp,
                    deleteMessageForMeAction: {
                        deleteMedia: false
                    }
                },
                index: ['deleteMessageForMe', jid, key.id, key.fromMe ? '1' : '0', '0'],
                type: 'regular_high',
                apiVersion: 3,
            }
        }
    } else {
        throw new Boom('not supported')
    }
    return patch
}