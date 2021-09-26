import { Boom } from '@hapi/boom'
import { aesDecrypt, hmacSign, aesEncrypt, hkdf } from "./crypto"
import { AuthenticationState, ChatModification, ChatMutation } from "../Types"
import { proto } from '../../WAProto'
import { LT_HASH_ANTI_TAMPERING } from '../WABinary/LTHash'

type SyncdType = 'regular_high' | 'regular_low'

const mutationKeys = (keydata: Uint8Array) => {
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

const generateSnapshotMac = (version: number, indexMac: Uint8Array, valueMac: Uint8Array, type: SyncdType, key: Buffer) => {
    
    const ltHash = () => {
        const result = LT_HASH_ANTI_TAMPERING.subtractThenAdd(new Uint8Array(128).buffer, [ new Uint8Array(valueMac).buffer, new Uint8Array(indexMac).buffer ], [])
        const buff = Buffer.from(result)
        console.log(buff.toString('hex'))
        return buff
    }
    const total = Buffer.concat([
        ltHash(),
        to64BitNetworkOrder(version),
        Buffer.from(type, 'utf-8')
    ])
    return hmacSign(total, key)
}
const generatePatchMac = (snapshotMac: Uint8Array, valueMacs: Uint8Array[], version: number, type: SyncdType, key: Buffer) => {
    const total = Buffer.concat([
        snapshotMac,
        ...valueMacs,
        to64BitNetworkOrder(version),
        Buffer.from(type, 'utf-8')
    ])
    return hmacSign(total, key)
}

export const encodeSyncdPatch = async(action: ChatModification, lastMessageKey: proto.IMessageKey, { creds: { appStateVersion, myAppStateKeyId }, keys }: AuthenticationState) => {
    let syncAction: proto.ISyncActionValue = { }
    if('archive' in action) {
        syncAction.archiveChatAction = {
            archived: action.archive,
            messageRange: {
                messages: [
                    { key: lastMessageKey }
                ]
            }
        }
    } else if('mute' in action) {
        const value = typeof action.mute === 'number' ? true : false
        syncAction.muteAction = { 
            muted: value,
            muteEndTimestamp: typeof action.mute === 'number' ? action.mute : undefined
        }
    } else if('delete' in action) {
        syncAction.deleteChatAction = { }
    } else if('markRead' in action) {
        syncAction.markChatAsReadAction = {
            read: action.markRead
        }
    } else if('pin' in action) {
        throw new Boom('Pin not supported on multi-device yet', { statusCode: 400 })
    }

    const encoded = proto.SyncActionValue.encode(syncAction).finish()
    const key = !!myAppStateKeyId ? await keys.getAppStateSyncKey(myAppStateKeyId) : undefined
    if(!key) {
        throw new Boom(`myAppStateKey not present`, { statusCode: 404 })
    }

    const encKeyId = Buffer.from(myAppStateKeyId, 'base64')

    const index = JSON.stringify([Object.keys(action)[0], lastMessageKey.remoteJid])
    const keyValue = mutationKeys(key!.keyData!)

    const encValue = aesEncrypt(encoded, keyValue.valueEncryptionKey)
    const macValue = generateMac(1, encValue, encKeyId, keyValue.valueMacKey)
    const indexMacValue = hmacSign(Buffer.from(index), keyValue.indexKey)

    const type = 'regular_high'
    const v = appStateVersion[type]+1

    const snapshotMac = generateSnapshotMac(v, indexMacValue, macValue, type, keyValue.snapshotMacKey)

    const patch: proto.ISyncdPatch = {
        patchMac: generatePatchMac(snapshotMac, [macValue], v, type, keyValue.patchMacKey),
        snapshotMac: snapshotMac,
        keyId: { id: encKeyId },
        mutations: [
            {
                operation: 1,
                record: {
                    index: {
                        blob: indexMacValue
                    },
                    value: {
                        blob: Buffer.concat([  encValue, macValue ])
                    },
                    keyId: { id: encKeyId }
                }
            }
        ]
    }
    return patch
}

export const decodeSyncdPatch = async(msg: proto.ISyncdPatch, {keys}: AuthenticationState) => {
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
    const failures: Boom[] = []

    /*const mainKey = getKey(msg.keyId!.id)
    const mutation = msg.mutations![0]!.record

    const patchMac = generatePatchMac(msg.snapshotMac, [ mutation.value!.blob!.slice(-32) ], toNumber(msg.version!.version), 'regular_low', mainKey.patchMacKey)
    console.log(patchMac)
    console.log(msg.patchMac)*/

    // indexKey used to HMAC sign record.index.blob
    // valueEncryptionKey used to AES-256-CBC encrypt record.value.blob[0:-32]
    // the remaining record.value.blob[0:-32] is the mac, it the HMAC sign of key.keyId + decoded proto data + length of bytes in keyId
    for(const { operation, record } of msg.mutations!) {
        try {
            const key = await getKey(record.keyId!.id!)
            const content = Buffer.from(record.value!.blob!)
            const encContent = content.slice(0, -32)
            const contentHmac = generateMac(operation, encContent, record.keyId!.id!, key.valueMacKey)
            if(Buffer.compare(contentHmac, content.slice(-32)) !== 0) {
                throw new Boom('HMAC content verification failed')
            }

            const result = aesDecrypt(encContent, key.valueEncryptionKey)
            const syncAction = proto.SyncActionData.decode(result)

            const hmac = hmacSign(syncAction.index, key.indexKey)
            if(Buffer.compare(hmac, record.index!.blob) !== 0) {
                throw new Boom('HMAC index verification failed')
            }

            const indexStr = Buffer.from(syncAction.index).toString()
            mutations.push({ action: syncAction.value!, index: JSON.parse(indexStr) })
        } catch(error) {
            failures.push(new Boom(error, { data: { operation, record } }))
        }
    }

    return { mutations, failures }
}