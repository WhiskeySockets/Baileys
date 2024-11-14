"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSyncAction = exports.chatModificationToAppPatch = exports.decodePatches = exports.decodeSyncdSnapshot = exports.downloadExternalPatch = exports.downloadExternalBlob = exports.extractSyncdPatches = exports.decodeSyncdPatch = exports.decodeSyncdMutations = exports.encodeSyncdPatch = exports.newLTHashState = void 0;
const boom_1 = require("@hapi/boom");
const WAProto_1 = require("../../WAProto");
const LabelAssociation_1 = require("../Types/LabelAssociation");
const WABinary_1 = require("../WABinary");
const crypto_1 = require("./crypto");
const generics_1 = require("./generics");
const lt_hash_1 = require("./lt-hash");
const messages_media_1 = require("./messages-media");
const mutationKeys = (keydata) => {
    const expanded = (0, crypto_1.hkdf)(keydata, 160, { info: 'WhatsApp Mutation Keys' });
    return {
        indexKey: expanded.slice(0, 32),
        valueEncryptionKey: expanded.slice(32, 64),
        valueMacKey: expanded.slice(64, 96),
        snapshotMacKey: expanded.slice(96, 128),
        patchMacKey: expanded.slice(128, 160)
    };
};
const generateMac = (operation, data, keyId, key) => {
    const getKeyData = () => {
        let r;
        switch (operation) {
            case WAProto_1.proto.SyncdMutation.SyncdOperation.SET:
                r = 0x01;
                break;
            case WAProto_1.proto.SyncdMutation.SyncdOperation.REMOVE:
                r = 0x02;
                break;
        }
        const buff = Buffer.from([r]);
        return Buffer.concat([buff, Buffer.from(keyId, 'base64')]);
    };
    const keyData = getKeyData();
    const last = Buffer.alloc(8); // 8 bytes
    last.set([keyData.length], last.length - 1);
    const total = Buffer.concat([keyData, data, last]);
    const hmac = (0, crypto_1.hmacSign)(total, key, 'sha512');
    return hmac.slice(0, 32);
};
const to64BitNetworkOrder = (e) => {
    const buff = Buffer.alloc(8);
    buff.writeUint32BE(e, 4);
    return buff;
};
const makeLtHashGenerator = ({ indexValueMap, hash }) => {
    indexValueMap = { ...indexValueMap };
    const addBuffs = [];
    const subBuffs = [];
    return {
        mix: ({ indexMac, valueMac, operation }) => {
            const indexMacBase64 = Buffer.from(indexMac).toString('base64');
            const prevOp = indexValueMap[indexMacBase64];
            if (operation === WAProto_1.proto.SyncdMutation.SyncdOperation.REMOVE) {
                if (!prevOp) {
                    throw new boom_1.Boom('tried remove, but no previous op', { data: { indexMac, valueMac } });
                }
                // remove from index value mac, since this mutation is erased
                delete indexValueMap[indexMacBase64];
            }
            else {
                addBuffs.push(new Uint8Array(valueMac).buffer);
                // add this index into the history map
                indexValueMap[indexMacBase64] = { valueMac };
            }
            if (prevOp) {
                subBuffs.push(new Uint8Array(prevOp.valueMac).buffer);
            }
        },
        finish: () => {
            const hashArrayBuffer = new Uint8Array(hash).buffer;
            const result = lt_hash_1.LT_HASH_ANTI_TAMPERING.subtractThenAdd(hashArrayBuffer, addBuffs, subBuffs);
            const buffer = Buffer.from(result);
            return {
                hash: buffer,
                indexValueMap
            };
        }
    };
};
const generateSnapshotMac = (lthash, version, name, key) => {
    const total = Buffer.concat([
        lthash,
        to64BitNetworkOrder(version),
        Buffer.from(name, 'utf-8')
    ]);
    return (0, crypto_1.hmacSign)(total, key, 'sha256');
};
const generatePatchMac = (snapshotMac, valueMacs, version, type, key) => {
    const total = Buffer.concat([
        snapshotMac,
        ...valueMacs,
        to64BitNetworkOrder(version),
        Buffer.from(type, 'utf-8')
    ]);
    return (0, crypto_1.hmacSign)(total, key);
};
const newLTHashState = () => ({ version: 0, hash: Buffer.alloc(128), indexValueMap: {} });
exports.newLTHashState = newLTHashState;
const encodeSyncdPatch = async ({ type, index, syncAction, apiVersion, operation }, myAppStateKeyId, state, getAppStateSyncKey) => {
    const key = !!myAppStateKeyId ? await getAppStateSyncKey(myAppStateKeyId) : undefined;
    if (!key) {
        throw new boom_1.Boom(`myAppStateKey ("${myAppStateKeyId}") not present`, { statusCode: 404 });
    }
    const encKeyId = Buffer.from(myAppStateKeyId, 'base64');
    state = { ...state, indexValueMap: { ...state.indexValueMap } };
    const indexBuffer = Buffer.from(JSON.stringify(index));
    const dataProto = WAProto_1.proto.SyncActionData.fromObject({
        index: indexBuffer,
        value: syncAction,
        padding: new Uint8Array(0),
        version: apiVersion
    });
    const encoded = WAProto_1.proto.SyncActionData.encode(dataProto).finish();
    const keyValue = mutationKeys(key.keyData);
    const encValue = (0, crypto_1.aesEncrypt)(encoded, keyValue.valueEncryptionKey);
    const valueMac = generateMac(operation, encValue, encKeyId, keyValue.valueMacKey);
    const indexMac = (0, crypto_1.hmacSign)(indexBuffer, keyValue.indexKey);
    // update LT hash
    const generator = makeLtHashGenerator(state);
    generator.mix({ indexMac, valueMac, operation });
    Object.assign(state, generator.finish());
    state.version += 1;
    const snapshotMac = generateSnapshotMac(state.hash, state.version, type, keyValue.snapshotMacKey);
    const patch = {
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
                        blob: Buffer.concat([encValue, valueMac])
                    },
                    keyId: { id: encKeyId }
                }
            }
        ]
    };
    const base64Index = indexMac.toString('base64');
    state.indexValueMap[base64Index] = { valueMac };
    return { patch, state };
};
exports.encodeSyncdPatch = encodeSyncdPatch;
const decodeSyncdMutations = async (msgMutations, initialState, getAppStateSyncKey, onMutation, validateMacs) => {
    const ltGenerator = makeLtHashGenerator(initialState);
    // indexKey used to HMAC sign record.index.blob
    // valueEncryptionKey used to AES-256-CBC encrypt record.value.blob[0:-32]
    // the remaining record.value.blob[0:-32] is the mac, it the HMAC sign of key.keyId + decoded proto data + length of bytes in keyId
    for (const msgMutation of msgMutations) {
        // if it's a syncdmutation, get the operation property
        // otherwise, if it's only a record -- it'll be a SET mutation
        const operation = 'operation' in msgMutation ? msgMutation.operation : WAProto_1.proto.SyncdMutation.SyncdOperation.SET;
        const record = ('record' in msgMutation && !!msgMutation.record) ? msgMutation.record : msgMutation;
        const key = await getKey(record.keyId.id);
        const content = Buffer.from(record.value.blob);
        const encContent = content.slice(0, -32);
        const ogValueMac = content.slice(-32);
        if (validateMacs) {
            const contentHmac = generateMac(operation, encContent, record.keyId.id, key.valueMacKey);
            if (Buffer.compare(contentHmac, ogValueMac) !== 0) {
                throw new boom_1.Boom('HMAC content verification failed');
            }
        }
        const result = (0, crypto_1.aesDecrypt)(encContent, key.valueEncryptionKey);
        const syncAction = WAProto_1.proto.SyncActionData.decode(result);
        if (validateMacs) {
            const hmac = (0, crypto_1.hmacSign)(syncAction.index, key.indexKey);
            if (Buffer.compare(hmac, record.index.blob) !== 0) {
                throw new boom_1.Boom('HMAC index verification failed');
            }
        }
        const indexStr = Buffer.from(syncAction.index).toString();
        onMutation({ syncAction, index: JSON.parse(indexStr) });
        ltGenerator.mix({
            indexMac: record.index.blob,
            valueMac: ogValueMac,
            operation: operation
        });
    }
    return ltGenerator.finish();
    async function getKey(keyId) {
        const base64Key = Buffer.from(keyId).toString('base64');
        const keyEnc = await getAppStateSyncKey(base64Key);
        if (!keyEnc) {
            throw new boom_1.Boom(`failed to find key "${base64Key}" to decode mutation`, { statusCode: 404, data: { msgMutations } });
        }
        return mutationKeys(keyEnc.keyData);
    }
};
exports.decodeSyncdMutations = decodeSyncdMutations;
const decodeSyncdPatch = async (msg, name, initialState, getAppStateSyncKey, onMutation, validateMacs) => {
    if (validateMacs) {
        const base64Key = Buffer.from(msg.keyId.id).toString('base64');
        const mainKeyObj = await getAppStateSyncKey(base64Key);
        if (!mainKeyObj) {
            throw new boom_1.Boom(`failed to find key "${base64Key}" to decode patch`, { statusCode: 404, data: { msg } });
        }
        const mainKey = mutationKeys(mainKeyObj.keyData);
        const mutationmacs = msg.mutations.map(mutation => mutation.record.value.blob.slice(-32));
        const patchMac = generatePatchMac(msg.snapshotMac, mutationmacs, (0, generics_1.toNumber)(msg.version.version), name, mainKey.patchMacKey);
        if (Buffer.compare(patchMac, msg.patchMac) !== 0) {
            throw new boom_1.Boom('Invalid patch mac');
        }
    }
    const result = await (0, exports.decodeSyncdMutations)(msg.mutations, initialState, getAppStateSyncKey, onMutation, validateMacs);
    return result;
};
exports.decodeSyncdPatch = decodeSyncdPatch;
const extractSyncdPatches = async (result, options) => {
    const syncNode = (0, WABinary_1.getBinaryNodeChild)(result, 'sync');
    const collectionNodes = (0, WABinary_1.getBinaryNodeChildren)(syncNode, 'collection');
    const final = {};
    await Promise.all(collectionNodes.map(async (collectionNode) => {
        const patchesNode = (0, WABinary_1.getBinaryNodeChild)(collectionNode, 'patches');
        const patches = (0, WABinary_1.getBinaryNodeChildren)(patchesNode || collectionNode, 'patch');
        const snapshotNode = (0, WABinary_1.getBinaryNodeChild)(collectionNode, 'snapshot');
        const syncds = [];
        const name = collectionNode.attrs.name;
        const hasMorePatches = collectionNode.attrs.has_more_patches === 'true';
        let snapshot = undefined;
        if (snapshotNode && !!snapshotNode.content) {
            if (!Buffer.isBuffer(snapshotNode)) {
                snapshotNode.content = Buffer.from(Object.values(snapshotNode.content));
            }
            const blobRef = WAProto_1.proto.ExternalBlobReference.decode(snapshotNode.content);
            const data = await (0, exports.downloadExternalBlob)(blobRef, options);
            snapshot = WAProto_1.proto.SyncdSnapshot.decode(data);
        }
        for (let { content } of patches) {
            if (content) {
                if (!Buffer.isBuffer(content)) {
                    content = Buffer.from(Object.values(content));
                }
                const syncd = WAProto_1.proto.SyncdPatch.decode(content);
                if (!syncd.version) {
                    syncd.version = { version: +collectionNode.attrs.version + 1 };
                }
                syncds.push(syncd);
            }
        }
        final[name] = { patches: syncds, hasMorePatches, snapshot };
    }));
    return final;
};
exports.extractSyncdPatches = extractSyncdPatches;
const downloadExternalBlob = async (blob, options) => {
    const stream = await (0, messages_media_1.downloadContentFromMessage)(blob, 'md-app-state', { options });
    const bufferArray = [];
    for await (const chunk of stream) {
        bufferArray.push(chunk);
    }
    return Buffer.concat(bufferArray);
};
exports.downloadExternalBlob = downloadExternalBlob;
const downloadExternalPatch = async (blob, options) => {
    const buffer = await (0, exports.downloadExternalBlob)(blob, options);
    const syncData = WAProto_1.proto.SyncdMutations.decode(buffer);
    return syncData;
};
exports.downloadExternalPatch = downloadExternalPatch;
const decodeSyncdSnapshot = async (name, snapshot, getAppStateSyncKey, minimumVersionNumber, validateMacs = true) => {
    const newState = (0, exports.newLTHashState)();
    newState.version = (0, generics_1.toNumber)(snapshot.version.version);
    const mutationMap = {};
    const areMutationsRequired = typeof minimumVersionNumber === 'undefined'
        || newState.version > minimumVersionNumber;
    const { hash, indexValueMap } = await (0, exports.decodeSyncdMutations)(snapshot.records, newState, getAppStateSyncKey, areMutationsRequired
        ? (mutation) => {
            var _a;
            const index = (_a = mutation.syncAction.index) === null || _a === void 0 ? void 0 : _a.toString();
            mutationMap[index] = mutation;
        }
        : () => { }, validateMacs);
    newState.hash = hash;
    newState.indexValueMap = indexValueMap;
    if (validateMacs) {
        const base64Key = Buffer.from(snapshot.keyId.id).toString('base64');
        const keyEnc = await getAppStateSyncKey(base64Key);
        if (!keyEnc) {
            throw new boom_1.Boom(`failed to find key "${base64Key}" to decode mutation`);
        }
        const result = mutationKeys(keyEnc.keyData);
        const computedSnapshotMac = generateSnapshotMac(newState.hash, newState.version, name, result.snapshotMacKey);
        if (Buffer.compare(snapshot.mac, computedSnapshotMac) !== 0) {
            throw new boom_1.Boom(`failed to verify LTHash at ${newState.version} of ${name} from snapshot`);
        }
    }
    return {
        state: newState,
        mutationMap
    };
};
exports.decodeSyncdSnapshot = decodeSyncdSnapshot;
const decodePatches = async (name, syncds, initial, getAppStateSyncKey, options, minimumVersionNumber, logger, validateMacs = true) => {
    var _a;
    const newState = {
        ...initial,
        indexValueMap: { ...initial.indexValueMap }
    };
    const mutationMap = {};
    for (const syncd of syncds) {
        const { version, keyId, snapshotMac } = syncd;
        if (syncd.externalMutations) {
            logger === null || logger === void 0 ? void 0 : logger.trace({ name, version }, 'downloading external patch');
            const ref = await (0, exports.downloadExternalPatch)(syncd.externalMutations, options);
            logger === null || logger === void 0 ? void 0 : logger.debug({ name, version, mutations: ref.mutations.length }, 'downloaded external patch');
            (_a = syncd.mutations) === null || _a === void 0 ? void 0 : _a.push(...ref.mutations);
        }
        const patchVersion = (0, generics_1.toNumber)(version.version);
        newState.version = patchVersion;
        const shouldMutate = typeof minimumVersionNumber === 'undefined' || patchVersion > minimumVersionNumber;
        const decodeResult = await (0, exports.decodeSyncdPatch)(syncd, name, newState, getAppStateSyncKey, shouldMutate
            ? mutation => {
                var _a;
                const index = (_a = mutation.syncAction.index) === null || _a === void 0 ? void 0 : _a.toString();
                mutationMap[index] = mutation;
            }
            : (() => { }), true);
        newState.hash = decodeResult.hash;
        newState.indexValueMap = decodeResult.indexValueMap;
        if (validateMacs) {
            const base64Key = Buffer.from(keyId.id).toString('base64');
            const keyEnc = await getAppStateSyncKey(base64Key);
            if (!keyEnc) {
                throw new boom_1.Boom(`failed to find key "${base64Key}" to decode mutation`);
            }
            const result = mutationKeys(keyEnc.keyData);
            const computedSnapshotMac = generateSnapshotMac(newState.hash, newState.version, name, result.snapshotMacKey);
            if (Buffer.compare(snapshotMac, computedSnapshotMac) !== 0) {
                throw new boom_1.Boom(`failed to verify LTHash at ${newState.version} of ${name}`);
            }
        }
        // clear memory used up by the mutations
        syncd.mutations = [];
    }
    return { state: newState, mutationMap };
};
exports.decodePatches = decodePatches;
const chatModificationToAppPatch = (mod, jid) => {
    const OP = WAProto_1.proto.SyncdMutation.SyncdOperation;
    const getMessageRange = (lastMessages) => {
        let messageRange;
        if (Array.isArray(lastMessages)) {
            const lastMsg = lastMessages[lastMessages.length - 1];
            messageRange = {
                lastMessageTimestamp: lastMsg === null || lastMsg === void 0 ? void 0 : lastMsg.messageTimestamp,
                messages: (lastMessages === null || lastMessages === void 0 ? void 0 : lastMessages.length) ? lastMessages.map(m => {
                    var _a, _b;
                    if (!((_a = m.key) === null || _a === void 0 ? void 0 : _a.id) || !((_b = m.key) === null || _b === void 0 ? void 0 : _b.remoteJid)) {
                        throw new boom_1.Boom('Incomplete key', { statusCode: 400, data: m });
                    }
                    if ((0, WABinary_1.isJidGroup)(m.key.remoteJid) && !m.key.fromMe && !m.key.participant) {
                        throw new boom_1.Boom('Expected not from me message to have participant', { statusCode: 400, data: m });
                    }
                    if (!m.messageTimestamp || !(0, generics_1.toNumber)(m.messageTimestamp)) {
                        throw new boom_1.Boom('Missing timestamp in last message list', { statusCode: 400, data: m });
                    }
                    if (m.key.participant) {
                        m.key.participant = (0, WABinary_1.jidNormalizedUser)(m.key.participant);
                    }
                    return m;
                }) : undefined
            };
        }
        else {
            messageRange = lastMessages;
        }
        return messageRange;
    };
    let patch;
    if ('mute' in mod) {
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
        };
    }
    else if ('archive' in mod) {
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
        };
    }
    else if ('markRead' in mod) {
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
        };
    }
    else if ('deleteForMe' in mod) {
        const { timestamp, key, deleteMedia } = mod.deleteForMe;
        patch = {
            syncAction: {
                deleteMessageForMeAction: {
                    deleteMedia,
                    messageTimestamp: timestamp
                }
            },
            index: ['deleteMessageForMe', jid, key.id, key.fromMe ? '1' : '0', '0'],
            type: 'regular_high',
            apiVersion: 3,
            operation: OP.SET
        };
    }
    else if ('clear' in mod) {
        patch = {
            syncAction: {
                clearChatAction: {} // add message range later
            },
            index: ['clearChat', jid, '1' /*the option here is 0 when keep starred messages is enabled*/, '0'],
            type: 'regular_high',
            apiVersion: 6,
            operation: OP.SET
        };
    }
    else if ('pin' in mod) {
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
        };
    }
    else if ('star' in mod) {
        const key = mod.star.messages[0];
        patch = {
            syncAction: {
                starAction: {
                    starred: !!mod.star.star
                }
            },
            index: ['star', jid, key.id, key.fromMe ? '1' : '0', '0'],
            type: 'regular_low',
            apiVersion: 2,
            operation: OP.SET
        };
    }
    else if ('delete' in mod) {
        patch = {
            syncAction: {
                deleteChatAction: {
                    messageRange: getMessageRange(mod.lastMessages),
                }
            },
            index: ['deleteChat', jid, '1'],
            type: 'regular_high',
            apiVersion: 6,
            operation: OP.SET
        };
    }
    else if ('pushNameSetting' in mod) {
        patch = {
            syncAction: {
                pushNameSetting: {
                    name: mod.pushNameSetting
                }
            },
            index: ['setting_pushName'],
            type: 'critical_block',
            apiVersion: 1,
            operation: OP.SET,
        };
    }
    else if ('addLabel' in mod) {
        patch = {
            syncAction: {
                labelEditAction: {
                    name: mod.addLabel.name,
                    color: mod.addLabel.color,
                    predefinedId: mod.addLabel.predefinedId,
                    deleted: mod.addLabel.deleted
                }
            },
            index: ['label_edit', mod.addLabel.id],
            type: 'regular',
            apiVersion: 3,
            operation: OP.SET,
        };
    }
    else if ('addChatLabel' in mod) {
        patch = {
            syncAction: {
                labelAssociationAction: {
                    labeled: true,
                }
            },
            index: [LabelAssociation_1.LabelAssociationType.Chat, mod.addChatLabel.labelId, jid],
            type: 'regular',
            apiVersion: 3,
            operation: OP.SET,
        };
    }
    else if ('removeChatLabel' in mod) {
        patch = {
            syncAction: {
                labelAssociationAction: {
                    labeled: false,
                }
            },
            index: [LabelAssociation_1.LabelAssociationType.Chat, mod.removeChatLabel.labelId, jid],
            type: 'regular',
            apiVersion: 3,
            operation: OP.SET,
        };
    }
    else if ('addMessageLabel' in mod) {
        patch = {
            syncAction: {
                labelAssociationAction: {
                    labeled: true,
                }
            },
            index: [
                LabelAssociation_1.LabelAssociationType.Message,
                mod.addMessageLabel.labelId,
                jid,
                mod.addMessageLabel.messageId,
                '0',
                '0'
            ],
            type: 'regular',
            apiVersion: 3,
            operation: OP.SET,
        };
    }
    else if ('removeMessageLabel' in mod) {
        patch = {
            syncAction: {
                labelAssociationAction: {
                    labeled: false,
                }
            },
            index: [
                LabelAssociation_1.LabelAssociationType.Message,
                mod.removeMessageLabel.labelId,
                jid,
                mod.removeMessageLabel.messageId,
                '0',
                '0'
            ],
            type: 'regular',
            apiVersion: 3,
            operation: OP.SET,
        };
    }
    else {
        throw new boom_1.Boom('not supported');
    }
    patch.syncAction.timestamp = Date.now();
    return patch;
};
exports.chatModificationToAppPatch = chatModificationToAppPatch;
const processSyncAction = (syncAction, ev, me, initialSyncOpts, logger) => {
    var _a, _b, _c, _d;
    const isInitialSync = !!initialSyncOpts;
    const accountSettings = initialSyncOpts === null || initialSyncOpts === void 0 ? void 0 : initialSyncOpts.accountSettings;
    logger === null || logger === void 0 ? void 0 : logger.trace({ syncAction, initialSync: !!initialSyncOpts }, 'processing sync action');
    const { syncAction: { value: action }, index: [type, id, msgId, fromMe] } = syncAction;
    if (action === null || action === void 0 ? void 0 : action.muteAction) {
        ev.emit('chats.update', [
            {
                id,
                muteEndTime: ((_a = action.muteAction) === null || _a === void 0 ? void 0 : _a.muted)
                    ? (0, generics_1.toNumber)(action.muteAction.muteEndTimestamp)
                    : null,
                conditional: getChatUpdateConditional(id, undefined)
            }
        ]);
    }
    else if ((action === null || action === void 0 ? void 0 : action.archiveChatAction) || type === 'archive' || type === 'unarchive') {
        // okay so we've to do some annoying computation here
        // when we're initially syncing the app state
        // there are a few cases we need to handle
        // 1. if the account unarchiveChats setting is true
        //   a. if the chat is archived, and no further messages have been received -- simple, keep archived
        //   b. if the chat was archived, and the user received messages from the other person afterwards
        //		then the chat should be marked unarchved --
        //		we compare the timestamp of latest message from the other person to determine this
        // 2. if the account unarchiveChats setting is false -- then it doesn't matter,
        //	it'll always take an app state action to mark in unarchived -- which we'll get anyway
        const archiveAction = action === null || action === void 0 ? void 0 : action.archiveChatAction;
        const isArchived = archiveAction
            ? archiveAction.archived
            : type === 'archive';
        // // basically we don't need to fire an "archive" update if the chat is being marked unarchvied
        // // this only applies for the initial sync
        // if(isInitialSync && !isArchived) {
        // 	isArchived = false
        // }
        const msgRange = !(accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.unarchiveChats) ? undefined : archiveAction === null || archiveAction === void 0 ? void 0 : archiveAction.messageRange;
        // logger?.debug({ chat: id, syncAction }, 'message range archive')
        ev.emit('chats.update', [{
                id,
                archived: isArchived,
                conditional: getChatUpdateConditional(id, msgRange)
            }]);
    }
    else if (action === null || action === void 0 ? void 0 : action.markChatAsReadAction) {
        const markReadAction = action.markChatAsReadAction;
        // basically we don't need to fire an "read" update if the chat is being marked as read
        // because the chat is read by default
        // this only applies for the initial sync
        const isNullUpdate = isInitialSync && markReadAction.read;
        ev.emit('chats.update', [{
                id,
                unreadCount: isNullUpdate ? null : !!(markReadAction === null || markReadAction === void 0 ? void 0 : markReadAction.read) ? 0 : -1,
                conditional: getChatUpdateConditional(id, markReadAction === null || markReadAction === void 0 ? void 0 : markReadAction.messageRange)
            }]);
    }
    else if ((action === null || action === void 0 ? void 0 : action.deleteMessageForMeAction) || type === 'deleteMessageForMe') {
        ev.emit('messages.delete', {
            keys: [
                {
                    remoteJid: id,
                    id: msgId,
                    fromMe: fromMe === '1'
                }
            ]
        });
    }
    else if (action === null || action === void 0 ? void 0 : action.contactAction) {
        ev.emit('contacts.upsert', [{ id, name: action.contactAction.fullName }]);
    }
    else if (action === null || action === void 0 ? void 0 : action.pushNameSetting) {
        const name = (_b = action === null || action === void 0 ? void 0 : action.pushNameSetting) === null || _b === void 0 ? void 0 : _b.name;
        if (name && (me === null || me === void 0 ? void 0 : me.name) !== name) {
            ev.emit('creds.update', { me: { ...me, name } });
        }
    }
    else if (action === null || action === void 0 ? void 0 : action.pinAction) {
        ev.emit('chats.update', [{
                id,
                pinned: ((_c = action.pinAction) === null || _c === void 0 ? void 0 : _c.pinned) ? (0, generics_1.toNumber)(action.timestamp) : null,
                conditional: getChatUpdateConditional(id, undefined)
            }]);
    }
    else if (action === null || action === void 0 ? void 0 : action.unarchiveChatsSetting) {
        const unarchiveChats = !!action.unarchiveChatsSetting.unarchiveChats;
        ev.emit('creds.update', { accountSettings: { unarchiveChats } });
        logger === null || logger === void 0 ? void 0 : logger.info(`archive setting updated => '${action.unarchiveChatsSetting.unarchiveChats}'`);
        if (accountSettings) {
            accountSettings.unarchiveChats = unarchiveChats;
        }
    }
    else if ((action === null || action === void 0 ? void 0 : action.starAction) || type === 'star') {
        let starred = (_d = action === null || action === void 0 ? void 0 : action.starAction) === null || _d === void 0 ? void 0 : _d.starred;
        if (typeof starred !== 'boolean') {
            starred = syncAction.index[syncAction.index.length - 1] === '1';
        }
        ev.emit('messages.update', [
            {
                key: { remoteJid: id, id: msgId, fromMe: fromMe === '1' },
                update: { starred }
            }
        ]);
    }
    else if ((action === null || action === void 0 ? void 0 : action.deleteChatAction) || type === 'deleteChat') {
        if (!isInitialSync) {
            ev.emit('chats.delete', [id]);
        }
    }
    else if (action === null || action === void 0 ? void 0 : action.labelEditAction) {
        const { name, color, deleted, predefinedId } = action.labelEditAction;
        ev.emit('labels.edit', {
            id,
            name: name,
            color: color,
            deleted: deleted,
            predefinedId: predefinedId ? String(predefinedId) : undefined
        });
    }
    else if (action === null || action === void 0 ? void 0 : action.labelAssociationAction) {
        ev.emit('labels.association', {
            type: action.labelAssociationAction.labeled
                ? 'add'
                : 'remove',
            association: type === LabelAssociation_1.LabelAssociationType.Chat
                ? {
                    type: LabelAssociation_1.LabelAssociationType.Chat,
                    chatId: syncAction.index[2],
                    labelId: syncAction.index[1]
                }
                : {
                    type: LabelAssociation_1.LabelAssociationType.Message,
                    chatId: syncAction.index[2],
                    messageId: syncAction.index[3],
                    labelId: syncAction.index[1]
                }
        });
    }
    else {
        logger === null || logger === void 0 ? void 0 : logger.debug({ syncAction, id }, 'unprocessable update');
    }
    function getChatUpdateConditional(id, msgRange) {
        return isInitialSync
            ? (data) => {
                const chat = data.historySets.chats[id] || data.chatUpserts[id];
                if (chat) {
                    return msgRange ? isValidPatchBasedOnMessageRange(chat, msgRange) : true;
                }
            }
            : undefined;
    }
    function isValidPatchBasedOnMessageRange(chat, msgRange) {
        const lastMsgTimestamp = Number((msgRange === null || msgRange === void 0 ? void 0 : msgRange.lastMessageTimestamp) || (msgRange === null || msgRange === void 0 ? void 0 : msgRange.lastSystemMessageTimestamp) || 0);
        const chatLastMsgTimestamp = Number((chat === null || chat === void 0 ? void 0 : chat.lastMessageRecvTimestamp) || 0);
        return lastMsgTimestamp >= chatLastMsgTimestamp;
    }
};
exports.processSyncAction = processSyncAction;
