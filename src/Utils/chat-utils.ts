import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import { ChatModification, ChatMutation, LastMessageList, LTHashState, WAPatchCreate, WAPatchName } from '../Types'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren } from '../WABinary'
import { aesDecrypt, aesEncrypt, hkdf, hmacSign } from './crypto'
import { toNumber } from './generics'
import { LT_HASH_ANTI_TAMPERING } from './lt-hash'
import { downloadContentFromMessage,  } from './messages-media'

type FetchAppStateSyncKey = (keyId: string) => Promise<proto.IAppStateSyncKeyData> | proto.IAppStateSyncKeyData

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

const to64BitNetworkOrder = (e: number) => {
	const t = new ArrayBuffer(8)
	new DataView(t).setUint32(4, e, !1)
	return Buffer.from(t)
}

type Mac = { indexMac: Uint8Array, valueMac: Uint8Array, operation: proto.SyncdMutation.SyncdMutationSyncdOperation }

const makeLtHashGenerator = ({ indexValueMap, hash }: Pick<LTHashState, 'hash' | 'indexValueMap'>) => {
	indexValueMap = { ...indexValueMap }
	const addBuffs: ArrayBuffer[] = []
	const subBuffs: ArrayBuffer[] = []

	return {
		mix: ({ indexMac, valueMac, operation }: Mac) => {
			const indexMacBase64 = Buffer.from(indexMac).toString('base64')
			const prevOp = indexValueMap[indexMacBase64]
			if(operation === proto.SyncdMutation.SyncdMutationSyncdOperation.REMOVE) {
				if(!prevOp) {
					throw new Boom('tried remove, but no previous op', { data: { indexMac, valueMac } })
				}

				// remove from index value mac, since this mutation is erased
				delete indexValueMap[indexMacBase64]
			} else {
				addBuffs.push(new Uint8Array(valueMac).buffer)
				// add this index into the history map
				indexValueMap[indexMacBase64] = { valueMac }
			}

			if(prevOp) {
				subBuffs.push(new Uint8Array(prevOp.valueMac).buffer)
			}
		},
		finish: () => {
			const result = LT_HASH_ANTI_TAMPERING.subtractThenAdd(new Uint8Array(hash).buffer, addBuffs, subBuffs)
			const buffer = Buffer.from(result)

			return {
				hash: buffer,
				indexValueMap
			}
		}
	}
}

const generateSnapshotMac = (lthash: Uint8Array, version: number, name: WAPatchName, key: Buffer) => {
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

export const newLTHashState = (): LTHashState => ({ version: 0, hash: Buffer.alloc(128), indexValueMap: {} })

export const encodeSyncdPatch = async(
	{ type, index, syncAction, apiVersion, operation }: WAPatchCreate,
	myAppStateKeyId: string,
	state: LTHashState,
	getAppStateSyncKey: FetchAppStateSyncKey
) => {
	const key = !!myAppStateKeyId ? await getAppStateSyncKey(myAppStateKeyId) : undefined
	if(!key) {
		throw new Boom(`myAppStateKey ("${myAppStateKeyId}") not present`, { statusCode: 404 })
	}

	const encKeyId = Buffer.from(myAppStateKeyId, 'base64')

	state = { ...state, indexValueMap: { ...state.indexValueMap } }

	const indexBuffer = Buffer.from(JSON.stringify(index))
	const dataProto = proto.SyncActionData.fromObject({
		index: indexBuffer,
		value: syncAction,
		padding: new Uint8Array(0),
		version: apiVersion
	})
	const encoded = proto.SyncActionData.encode(dataProto).finish()

	const keyValue = mutationKeys(key!.keyData!)

	const encValue = aesEncrypt(encoded, keyValue.valueEncryptionKey)
	const valueMac = generateMac(operation, encValue, encKeyId, keyValue.valueMacKey)
	const indexMac = hmacSign(indexBuffer, keyValue.indexKey)

	// update LT hash
	const generator = makeLtHashGenerator(state)
	generator.mix({ indexMac, valueMac, operation })
	Object.assign(state, generator.finish())

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

	const base64Index = indexMac.toString('base64')
	state.indexValueMap[base64Index] = { valueMac }

	return { patch, state }
}

export const decodeSyncdMutations = async(
	msgMutations: (proto.ISyncdMutation | proto.ISyncdRecord)[], 
	initialState: LTHashState,
	getAppStateSyncKey: FetchAppStateSyncKey,
	validateMacs: boolean
) => {
	const keyCache: { [_: string]: ReturnType<typeof mutationKeys> } = { }
	const getKey = async(keyId: Uint8Array) => {
		const base64Key = Buffer.from(keyId!).toString('base64')
		let key = keyCache[base64Key]
		if(!key) {
			const keyEnc = await getAppStateSyncKey(base64Key)
			if(!keyEnc) {
				throw new Boom(`failed to find key "${base64Key}" to decode mutation`, { statusCode: 404, data: { msgMutations } })
			}

			const result = mutationKeys(keyEnc.keyData!)
			keyCache[base64Key] = result
			key = result
		}

		return key
	}

	const ltGenerator = makeLtHashGenerator(initialState)

	const mutations: ChatMutation[] = []
	// indexKey used to HMAC sign record.index.blob
	// valueEncryptionKey used to AES-256-CBC encrypt record.value.blob[0:-32]
	// the remaining record.value.blob[0:-32] is the mac, it the HMAC sign of key.keyId + decoded proto data + length of bytes in keyId
	for(const msgMutation of msgMutations!) {
		// if it's a syncdmutation, get the operation property
		// otherwise, if it's only a record -- it'll be a SET mutation
		const operation = 'operation' in msgMutation ? msgMutation.operation : proto.SyncdMutation.SyncdMutationSyncdOperation.SET
		const record = ('record' in msgMutation && !!msgMutation.record) ? msgMutation.record : msgMutation as proto.ISyncdRecord
        
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
			syncAction,
			index: JSON.parse(indexStr),
		})
		ltGenerator.mix({ 
			indexMac: record.index!.blob!,
			valueMac: ogValueMac,
			operation: operation
		})
	}

	return { mutations, ...ltGenerator.finish() }
}

export const decodeSyncdPatch = async(
	msg: proto.ISyncdPatch, 
	name: WAPatchName,
	initialState: LTHashState,
	getAppStateSyncKey: FetchAppStateSyncKey,
	validateMacs: boolean
) => {
	if(validateMacs) {
		const base64Key = Buffer.from(msg.keyId!.id).toString('base64')
		const mainKeyObj = await getAppStateSyncKey(base64Key)
		const mainKey = mutationKeys(mainKeyObj.keyData!)
		const mutationmacs = msg.mutations!.map(mutation => mutation.record!.value!.blob!.slice(-32))
    
		const patchMac = generatePatchMac(msg.snapshotMac, mutationmacs, toNumber(msg.version!.version), name, mainKey.patchMacKey)
		if(Buffer.compare(patchMac, msg.patchMac) !== 0) {
			throw new Boom('Invalid patch mac')
		} 
	}

	const result = await decodeSyncdMutations(msg!.mutations!, initialState, getAppStateSyncKey, validateMacs)
	return result
}

export const extractSyncdPatches = async(result: BinaryNode) => {
	const syncNode = getBinaryNodeChild(result, 'sync')
	const collectionNodes = getBinaryNodeChildren(syncNode, 'collection')
    
	const final = { } as { [T in WAPatchName]: { patches: proto.ISyncdPatch[], hasMorePatches: boolean, snapshot?: proto.ISyncdSnapshot } }
	await Promise.all(
		collectionNodes.map(
			async collectionNode => {
				const patchesNode = getBinaryNodeChild(collectionNode, 'patches')

				const patches = getBinaryNodeChildren(patchesNode || collectionNode, 'patch')
				const snapshotNode = getBinaryNodeChild(collectionNode, 'snapshot')

				const syncds: proto.ISyncdPatch[] = []
				const name = collectionNode.attrs.name as WAPatchName

				const hasMorePatches = collectionNode.attrs.has_more_patches === 'true'
        
				let snapshot: proto.ISyncdSnapshot | undefined = undefined
				if(snapshotNode && !!snapshotNode.content) {
					if(!Buffer.isBuffer(snapshotNode)) {
						snapshotNode.content = Buffer.from(Object.values(snapshotNode.content))
					}

					const blobRef = proto.ExternalBlobReference.decode(
                        snapshotNode.content! as Buffer
					)
					const data = await downloadExternalBlob(blobRef)
					snapshot = proto.SyncdSnapshot.decode(data)
				}

				for(let { content } of patches) {
					if(content) {
						if(!Buffer.isBuffer(content)) {
							content = Buffer.from(Object.values(content))
						}

						const syncd = proto.SyncdPatch.decode(content! as Uint8Array)
						if(!syncd.version) {
							syncd.version = { version: +collectionNode.attrs.version+1 }
						}

						syncds.push(syncd)
					}
				}
        
				final[name] = { patches: syncds, hasMorePatches, snapshot }
			}
		)
	)

	return final
}


export const downloadExternalBlob = async(blob: proto.IExternalBlobReference) => {
	const stream = await downloadContentFromMessage(blob, 'md-app-state')
	let buffer = Buffer.from([])
	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
	}

	return buffer
}

export const downloadExternalPatch = async(blob: proto.IExternalBlobReference) => {
	const buffer = await downloadExternalBlob(blob)
	const syncData = proto.SyncdMutations.decode(buffer)
	return syncData
}

export const decodeSyncdSnapshot = async(
	name: WAPatchName,
	snapshot: proto.ISyncdSnapshot,
	getAppStateSyncKey: FetchAppStateSyncKey,
	minimumVersionNumber: number | undefined,
	validateMacs: boolean = true
) => {
	const newState = newLTHashState()
	newState.version = toNumber(snapshot.version!.version!)
    
	const { hash, indexValueMap, mutations } = await decodeSyncdMutations(snapshot.records!, newState, getAppStateSyncKey, validateMacs)
	newState.hash = hash
	newState.indexValueMap = indexValueMap

	if(validateMacs) {
		const base64Key = Buffer.from(snapshot.keyId!.id!).toString('base64')
		const keyEnc = await getAppStateSyncKey(base64Key)
		if(!keyEnc) {
			throw new Boom(`failed to find key "${base64Key}" to decode mutation`, { statusCode: 500 })
		}

		const result = mutationKeys(keyEnc.keyData!)
		const computedSnapshotMac = generateSnapshotMac(newState.hash, newState.version, name, result.snapshotMacKey)
		if(Buffer.compare(snapshot.mac!, computedSnapshotMac) !== 0) {
			throw new Boom(`failed to verify LTHash at ${newState.version} of ${name} from snapshot`, { statusCode: 500 })
		}
	}

	const areMutationsRequired = typeof minimumVersionNumber === 'undefined' || newState.version > minimumVersionNumber
	if(!areMutationsRequired) {
		// clear array
		mutations.splice(0, mutations.length)
	}

	return {
		state: newState,
		mutations
	}
}

export const decodePatches = async(
	name: WAPatchName,
	syncds: proto.ISyncdPatch[],
	initial: LTHashState,
	getAppStateSyncKey: FetchAppStateSyncKey,
	minimumVersionNumber?: number,
	validateMacs: boolean = true
) => {
	const successfulMutations: ChatMutation[] = []

	const newState: LTHashState = {
		...initial,
		indexValueMap: { ...initial.indexValueMap }
	}

	for(const syncd of syncds) {
		const { version, keyId, snapshotMac } = syncd
		if(syncd.externalMutations) {
			const ref = await downloadExternalPatch(syncd.externalMutations)
			syncd.mutations.push(...ref.mutations)
		}

		const patchVersion = toNumber(version.version!)
        
		newState.version = patchVersion

		const decodeResult = await decodeSyncdPatch(syncd, name, newState, getAppStateSyncKey, validateMacs)

		newState.hash = decodeResult.hash
		newState.indexValueMap = decodeResult.indexValueMap
		if(typeof minimumVersionNumber === 'undefined' || patchVersion > minimumVersionNumber) {
			successfulMutations.push(...decodeResult.mutations)
		}
        
		if(validateMacs) {
			const base64Key = Buffer.from(keyId!.id!).toString('base64')
			const keyEnc = await getAppStateSyncKey(base64Key)
			if(!keyEnc) {
				throw new Boom(`failed to find key "${base64Key}" to decode mutation`)
			}

			const result = mutationKeys(keyEnc.keyData!)
			const computedSnapshotMac = generateSnapshotMac(newState.hash, newState.version, name, result.snapshotMacKey)
			if(Buffer.compare(snapshotMac, computedSnapshotMac) !== 0) {
				throw new Boom(`failed to verify LTHash at ${newState.version} of ${name}`)
			}
		}
	}

	return {
		newMutations: successfulMutations,
		state: newState
	}
}

export const chatModificationToAppPatch = (
	mod: ChatModification,
	jid: string
) => {
	const OP = proto.SyncdMutation.SyncdMutationSyncdOperation
	const getMessageRange = (lastMessages: LastMessageList) => {
		if(!lastMessages?.length) {
			throw new Boom('Expected last message to be not from me', { statusCode: 400 })
		}

		const lastMsg = lastMessages[lastMessages.length-1]
		if(lastMsg.key.fromMe) {
			throw new Boom('Expected last message in array to be not from me', { statusCode: 400 })
		}

		const messageRange: proto.ISyncActionMessageRange = {
			lastMessageTimestamp: lastMsg?.messageTimestamp,
			messages: lastMessages
		}
		return messageRange
	}

	let patch: WAPatchCreate
	if('mute' in mod) {
		patch = {
			syncAction: {
				muteAction: {
					muted: !!mod.mute,
					muteEndTimestamp: mod.mute || undefined
				}
			},
			index: ['mute', jid],
			type: 'regular_high',
			apiVersion: 2,
			operation: OP.SET
		}
	} else if('archive' in mod) {
		patch = {
			syncAction: {
				archiveChatAction: {
					archived: !!mod.archive,
					messageRange: getMessageRange(mod.lastMessages)
				}
			},
			index: ['archive', jid],
			type: 'regular_low',
			apiVersion: 3,
			operation: OP.SET
		}
	} else if('markRead' in mod) {
		patch = {
			syncAction: {
				markChatAsReadAction: {
					read: mod.markRead,
					messageRange: getMessageRange(mod.lastMessages)
				}
			},
			index: ['markChatAsRead', jid],
			type: 'regular_low',
			apiVersion: 3,
			operation: OP.SET
		}
	} else if('clear' in mod) {
		if(mod.clear === 'all') {
			throw new Boom('not supported')
		} else {
			const key = mod.clear.messages[0]
			patch = {
				syncAction: {
					deleteMessageForMeAction: {
						deleteMedia: false
					}
				},
				index: ['deleteMessageForMe', jid, key.id, key.fromMe ? '1' : '0', '0'],
				type: 'regular_high',
				apiVersion: 3,
				operation: OP.SET
			}
		}
	} else if('pin' in mod) {
		patch = {
			syncAction: {
				pinAction: {
					pinned: !!mod.pin
				}
			},
			index: ['pin_v1', jid],
			type: 'regular_low',
			apiVersion: 5,
			operation: OP.SET
		}
	} else {
		throw new Boom('not supported')
	}

	patch.syncAction.timestamp = Date.now()

	return patch
}