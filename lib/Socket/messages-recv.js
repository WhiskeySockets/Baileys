"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMessagesRecvSocket = void 0;
const boom_1 = require("@hapi/boom");
const crypto_1 = require("crypto");
const node_cache_1 = __importDefault(require("node-cache"));
const WAProto_1 = require("../../WAProto");
const Defaults_1 = require("../Defaults");
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const Utils_2 = require("../Utils");
const make_mutex_1 = require("../Utils/make-mutex");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");
const messages_send_1 = require("./messages-send");
const makeMessagesRecvSocket = (config) => {
    const { logger, retryRequestDelayMs, maxMsgRetryCount, getMessage, shouldIgnoreJid } = config;
    const sock = (0, messages_send_1.makeMessagesSocket)(config);
    const { ev, authState, ws, processingMutex, signalRepository, query, upsertMessage, resyncAppState, onUnexpectedError, assertSessions, sendNode, relayMessage, sendReceipt, uploadPreKeys, sendPeerDataOperationMessage, } = sock;
    /** this mutex ensures that each retryRequest will wait for the previous one to finish */
    const retryMutex = (0, make_mutex_1.makeMutex)();
    const msgRetryCache = config.msgRetryCounterCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.MSG_RETRY,
        useClones: false
    });
    const callOfferCache = config.callOfferCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.CALL_OFFER,
        useClones: false
    });
    const placeholderResendCache = config.placeholderResendCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.MSG_RETRY,
        useClones: false
    });
    let sendActiveReceipts = false;
    const sendMessageAck = async ({ tag, attrs, content }) => {
        const stanza = {
            tag: 'ack',
            attrs: {
                id: attrs.id,
                to: attrs.from,
                class: tag,
            }
        };
        if (!!attrs.participant) {
            stanza.attrs.participant = attrs.participant;
        }
        if (!!attrs.recipient) {
            stanza.attrs.recipient = attrs.recipient;
        }
        if (!!attrs.type && (tag !== 'message' || (0, WABinary_1.getBinaryNodeChild)({ tag, attrs, content }, 'unavailable'))) {
            stanza.attrs.type = attrs.type;
        }
        if (tag === 'message' && (0, WABinary_1.getBinaryNodeChild)({ tag, attrs, content }, 'unavailable')) {
            stanza.attrs.from = authState.creds.me.id;
        }
        logger.debug({ recv: { tag, attrs }, sent: stanza.attrs }, 'sent ack');
        await sendNode(stanza);
    };
    const rejectCall = async (callId, callFrom) => {
        const stanza = ({
            tag: 'call',
            attrs: {
                from: authState.creds.me.id,
                to: callFrom,
            },
            content: [{
                    tag: 'reject',
                    attrs: {
                        'call-id': callId,
                        'call-creator': callFrom,
                        count: '0',
                    },
                    content: undefined,
                }],
        });
        await query(stanza);
    };
    const sendRetryRequest = async (node, forceIncludeKeys = false) => {
        const { fullMessage } = (0, Utils_1.decodeMessageNode)(node, authState.creds.me.id, authState.creds.me.lid || '');
        const { key: msgKey } = fullMessage;
        const msgId = msgKey.id;
        const key = `${msgId}:${msgKey === null || msgKey === void 0 ? void 0 : msgKey.participant}`;
        let retryCount = msgRetryCache.get(key) || 0;
        if (retryCount >= maxMsgRetryCount) {
            logger.debug({ retryCount, msgId }, 'reached retry limit, clearing');
            msgRetryCache.del(key);
            return;
        }
        retryCount += 1;
        msgRetryCache.set(key, retryCount);
        const { account, signedPreKey, signedIdentityKey: identityKey } = authState.creds;
        if (retryCount === 1) {
            //request a resend via phone
            const msgId = await requestPlaceholderResend(msgKey);
            logger.debug(`sendRetryRequest: requested placeholder resend for message ${msgId}`);
        }
        const deviceIdentity = (0, Utils_1.encodeSignedDeviceIdentity)(account, true);
        await authState.keys.transaction(async () => {
            const receipt = {
                tag: 'receipt',
                attrs: {
                    id: msgId,
                    type: 'retry',
                    to: node.attrs.from
                },
                content: [
                    {
                        tag: 'retry',
                        attrs: {
                            count: retryCount.toString(),
                            id: node.attrs.id,
                            t: node.attrs.t,
                            v: '1'
                        }
                    },
                    {
                        tag: 'registration',
                        attrs: {},
                        content: (0, Utils_1.encodeBigEndian)(authState.creds.registrationId)
                    }
                ]
            };
            if (node.attrs.recipient) {
                receipt.attrs.recipient = node.attrs.recipient;
            }
            if (node.attrs.participant) {
                receipt.attrs.participant = node.attrs.participant;
            }
            if (retryCount > 1 || forceIncludeKeys) {
                const { update, preKeys } = await (0, Utils_1.getNextPreKeys)(authState, 1);
                const [keyId] = Object.keys(preKeys);
                const key = preKeys[+keyId];
                const content = receipt.content;
                content.push({
                    tag: 'keys',
                    attrs: {},
                    content: [
                        { tag: 'type', attrs: {}, content: Buffer.from(Defaults_1.KEY_BUNDLE_TYPE) },
                        { tag: 'identity', attrs: {}, content: identityKey.public },
                        (0, Utils_1.xmppPreKey)(key, +keyId),
                        (0, Utils_1.xmppSignedPreKey)(signedPreKey),
                        { tag: 'device-identity', attrs: {}, content: deviceIdentity }
                    ]
                });
                ev.emit('creds.update', update);
            }
            await sendNode(receipt);
            logger.info({ msgAttrs: node.attrs, retryCount }, 'sent retry receipt');
        });
    };
    const handleEncryptNotification = async (node) => {
        const from = node.attrs.from;
        if (from === WABinary_1.S_WHATSAPP_NET) {
            const countChild = (0, WABinary_1.getBinaryNodeChild)(node, 'count');
            const count = +countChild.attrs.value;
            const shouldUploadMorePreKeys = count < Defaults_1.MIN_PREKEY_COUNT;
            logger.debug({ count, shouldUploadMorePreKeys }, 'recv pre-key count');
            if (shouldUploadMorePreKeys) {
                await uploadPreKeys();
            }
        }
        else {
            const identityNode = (0, WABinary_1.getBinaryNodeChild)(node, 'identity');
            if (identityNode) {
                logger.info({ jid: from }, 'identity changed');
                // not handling right now
                // signal will override new identity anyway
            }
            else {
                logger.info({ node }, 'unknown encrypt notification');
            }
        }
    };
    const handleGroupNotification = (participant, child, msg) => {
        var _a, _b, _c, _d;
        const participantJid = ((_b = (_a = (0, WABinary_1.getBinaryNodeChild)(child, 'participant')) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.jid) || participant;
        switch (child === null || child === void 0 ? void 0 : child.tag) {
            case 'create':
                const metadata = (0, groups_1.extractGroupMetadata)(child);
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CREATE;
                msg.messageStubParameters = [metadata.subject];
                msg.key = { participant: metadata.owner };
                ev.emit('chats.upsert', [{
                        id: metadata.id,
                        name: metadata.subject,
                        conversationTimestamp: metadata.creation,
                    }]);
                ev.emit('groups.upsert', [{
                        ...metadata,
                        author: participant
                    }]);
                break;
            case 'ephemeral':
            case 'not_ephemeral':
                msg.message = {
                    protocolMessage: {
                        type: WAProto_1.proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING,
                        ephemeralExpiration: +(child.attrs.expiration || 0)
                    }
                };
                break;
            case 'modify':
                const oldNumber = (0, WABinary_1.getBinaryNodeChildren)(child, 'participant').map(p => p.attrs.jid);
                msg.messageStubParameters = oldNumber || [];
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER;
                break;
            case 'promote':
            case 'demote':
            case 'remove':
            case 'add':
            case 'leave':
                const stubType = `GROUP_PARTICIPANT_${child.tag.toUpperCase()}`;
                msg.messageStubType = Types_1.WAMessageStubType[stubType];
                const participants = (0, WABinary_1.getBinaryNodeChildren)(child, 'participant').map(p => p.attrs.jid);
                if (participants.length === 1 &&
                    // if recv. "remove" message and sender removed themselves
                    // mark as left
                    (0, WABinary_1.areJidsSameUser)(participants[0], participant) &&
                    child.tag === 'remove') {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_PARTICIPANT_LEAVE;
                }
                msg.messageStubParameters = participants;
                break;
            case 'subject':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_SUBJECT;
                msg.messageStubParameters = [child.attrs.subject];
                break;
            case 'description':
                const description = (_d = (_c = (0, WABinary_1.getBinaryNodeChild)(child, 'body')) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.toString();
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_DESCRIPTION;
                msg.messageStubParameters = description ? [description] : undefined;
                break;
            case 'announcement':
            case 'not_announcement':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_ANNOUNCE;
                msg.messageStubParameters = [(child.tag === 'announcement') ? 'on' : 'off'];
                break;
            case 'locked':
            case 'unlocked':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_RESTRICT;
                msg.messageStubParameters = [(child.tag === 'locked') ? 'on' : 'off'];
                break;
            case 'invite':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_INVITE_LINK;
                msg.messageStubParameters = [child.attrs.code];
                break;
            case 'member_add_mode':
                const addMode = child.content;
                if (addMode) {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBER_ADD_MODE;
                    msg.messageStubParameters = [addMode.toString()];
                }
                break;
            case 'membership_approval_mode':
                const approvalMode = (0, WABinary_1.getBinaryNodeChild)(child, 'group_join');
                if (approvalMode) {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE;
                    msg.messageStubParameters = [approvalMode.attrs.state];
                }
                break;
            case 'created_membership_requests':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD;
                msg.messageStubParameters = [participantJid, 'created', child.attrs.request_method];
                break;
            case 'revoked_membership_requests':
                const isDenied = (0, WABinary_1.areJidsSameUser)(participantJid, participant);
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD;
                msg.messageStubParameters = [participantJid, isDenied ? 'revoked' : 'rejected'];
                break;
        }
    };
    const processNotification = async (node) => {
        var _a, _b, _c;
        const result = {};
        const [child] = (0, WABinary_1.getAllBinaryNodeChildren)(node);
        const nodeType = node.attrs.type;
        const from = (0, WABinary_1.jidNormalizedUser)(node.attrs.from);
        switch (nodeType) {
            case 'privacy_token':
                const tokenList = (0, WABinary_1.getBinaryNodeChildren)(child, 'token');
                for (const { attrs, content } of tokenList) {
                    const jid = attrs.jid;
                    ev.emit('chats.update', [
                        {
                            id: jid,
                            tcToken: content
                        }
                    ]);
                    logger.debug({ jid }, 'got privacy token update');
                }
                break;
            case 'w:gp2':
                handleGroupNotification(node.attrs.participant, child, result);
                break;
            case 'mediaretry':
                const event = (0, Utils_1.decodeMediaRetryNode)(node);
                ev.emit('messages.media-update', [event]);
                break;
            case 'encrypt':
                await handleEncryptNotification(node);
                break;
            case 'devices':
                const devices = (0, WABinary_1.getBinaryNodeChildren)(child, 'device');
                if ((0, WABinary_1.areJidsSameUser)(child.attrs.jid, authState.creds.me.id)) {
                    const deviceJids = devices.map(d => d.attrs.jid);
                    logger.info({ deviceJids }, 'got my own devices');
                }
                break;
            case 'server_sync':
                const update = (0, WABinary_1.getBinaryNodeChild)(node, 'collection');
                if (update) {
                    const name = update.attrs.name;
                    await resyncAppState([name], false);
                }
                break;
            case 'picture':
                const setPicture = (0, WABinary_1.getBinaryNodeChild)(node, 'set');
                const delPicture = (0, WABinary_1.getBinaryNodeChild)(node, 'delete');
                ev.emit('contacts.update', [{
                        id: (0, WABinary_1.jidNormalizedUser)((_a = node === null || node === void 0 ? void 0 : node.attrs) === null || _a === void 0 ? void 0 : _a.from) || ((_c = (_b = (setPicture || delPicture)) === null || _b === void 0 ? void 0 : _b.attrs) === null || _c === void 0 ? void 0 : _c.hash) || '',
                        imgUrl: setPicture ? 'changed' : 'removed'
                    }]);
                if ((0, WABinary_1.isJidGroup)(from)) {
                    const node = setPicture || delPicture;
                    result.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_ICON;
                    if (setPicture) {
                        result.messageStubParameters = [setPicture.attrs.id];
                    }
                    result.participant = node === null || node === void 0 ? void 0 : node.attrs.author;
                    result.key = {
                        ...result.key || {},
                        participant: setPicture === null || setPicture === void 0 ? void 0 : setPicture.attrs.author
                    };
                }
                break;
            case 'account_sync':
                if (child.tag === 'disappearing_mode') {
                    const newDuration = +child.attrs.duration;
                    const timestamp = +child.attrs.t;
                    logger.info({ newDuration }, 'updated account disappearing mode');
                    ev.emit('creds.update', {
                        accountSettings: {
                            ...authState.creds.accountSettings,
                            defaultDisappearingMode: {
                                ephemeralExpiration: newDuration,
                                ephemeralSettingTimestamp: timestamp,
                            },
                        }
                    });
                }
                else if (child.tag === 'blocklist') {
                    const blocklists = (0, WABinary_1.getBinaryNodeChildren)(child, 'item');
                    for (const { attrs } of blocklists) {
                        const blocklist = [attrs.jid];
                        const type = (attrs.action === 'block') ? 'add' : 'remove';
                        ev.emit('blocklist.update', { blocklist, type });
                    }
                }
                break;
            case 'link_code_companion_reg':
                const linkCodeCompanionReg = (0, WABinary_1.getBinaryNodeChild)(node, 'link_code_companion_reg');
                const ref = toRequiredBuffer((0, WABinary_1.getBinaryNodeChildBuffer)(linkCodeCompanionReg, 'link_code_pairing_ref'));
                const primaryIdentityPublicKey = toRequiredBuffer((0, WABinary_1.getBinaryNodeChildBuffer)(linkCodeCompanionReg, 'primary_identity_pub'));
                const primaryEphemeralPublicKeyWrapped = toRequiredBuffer((0, WABinary_1.getBinaryNodeChildBuffer)(linkCodeCompanionReg, 'link_code_pairing_wrapped_primary_ephemeral_pub'));
                const codePairingPublicKey = await decipherLinkPublicKey(primaryEphemeralPublicKeyWrapped);
                const companionSharedKey = Utils_1.Curve.sharedKey(authState.creds.pairingEphemeralKeyPair.private, codePairingPublicKey);
                const random = (0, crypto_1.randomBytes)(32);
                const linkCodeSalt = (0, crypto_1.randomBytes)(32);
                const linkCodePairingExpanded = (0, Utils_1.hkdf)(companionSharedKey, 32, {
                    salt: linkCodeSalt,
                    info: 'link_code_pairing_key_bundle_encryption_key'
                });
                const encryptPayload = Buffer.concat([Buffer.from(authState.creds.signedIdentityKey.public), primaryIdentityPublicKey, random]);
                const encryptIv = (0, crypto_1.randomBytes)(12);
                const encrypted = (0, Utils_1.aesEncryptGCM)(encryptPayload, linkCodePairingExpanded, encryptIv, Buffer.alloc(0));
                const encryptedPayload = Buffer.concat([linkCodeSalt, encryptIv, encrypted]);
                const identitySharedKey = Utils_1.Curve.sharedKey(authState.creds.signedIdentityKey.private, primaryIdentityPublicKey);
                const identityPayload = Buffer.concat([companionSharedKey, identitySharedKey, random]);
                authState.creds.advSecretKey = (0, Utils_1.hkdf)(identityPayload, 32, { info: 'adv_secret' }).toString('base64');
                await query({
                    tag: 'iq',
                    attrs: {
                        to: WABinary_1.S_WHATSAPP_NET,
                        type: 'set',
                        id: sock.generateMessageTag(),
                        xmlns: 'md'
                    },
                    content: [
                        {
                            tag: 'link_code_companion_reg',
                            attrs: {
                                jid: authState.creds.me.id,
                                stage: 'companion_finish',
                            },
                            content: [
                                {
                                    tag: 'link_code_pairing_wrapped_key_bundle',
                                    attrs: {},
                                    content: encryptedPayload
                                },
                                {
                                    tag: 'companion_identity_public',
                                    attrs: {},
                                    content: authState.creds.signedIdentityKey.public
                                },
                                {
                                    tag: 'link_code_pairing_ref',
                                    attrs: {},
                                    content: ref
                                }
                            ]
                        }
                    ]
                });
                authState.creds.registered = true;
                ev.emit('creds.update', authState.creds);
        }
        if (Object.keys(result).length) {
            return result;
        }
    };
    async function decipherLinkPublicKey(data) {
        const buffer = toRequiredBuffer(data);
        const salt = buffer.slice(0, 32);
        const secretKey = await (0, Utils_1.derivePairingCodeKey)(authState.creds.pairingCode, salt);
        const iv = buffer.slice(32, 48);
        const payload = buffer.slice(48, 80);
        return (0, Utils_1.aesDecryptCTR)(payload, secretKey, iv);
    }
    function toRequiredBuffer(data) {
        if (data === undefined) {
            throw new boom_1.Boom('Invalid buffer', { statusCode: 400 });
        }
        return data instanceof Buffer ? data : Buffer.from(data);
    }
    const willSendMessageAgain = (id, participant) => {
        const key = `${id}:${participant}`;
        const retryCount = msgRetryCache.get(key) || 0;
        return retryCount < maxMsgRetryCount;
    };
    const updateSendMessageAgainCount = (id, participant) => {
        const key = `${id}:${participant}`;
        const newValue = (msgRetryCache.get(key) || 0) + 1;
        msgRetryCache.set(key, newValue);
    };
    const sendMessagesAgain = async (key, ids, retryNode) => {
        var _a;
        const msgs = await Promise.all(ids.map(id => getMessage({ ...key, id })));
        const remoteJid = key.remoteJid;
        const participant = key.participant || remoteJid;
        // if it's the primary jid sending the request
        // just re-send the message to everyone
        // prevents the first message decryption failure
        const sendToAll = !((_a = (0, WABinary_1.jidDecode)(participant)) === null || _a === void 0 ? void 0 : _a.device);
        await assertSessions([participant], true);
        if ((0, WABinary_1.isJidGroup)(remoteJid)) {
            await authState.keys.set({ 'sender-key-memory': { [remoteJid]: null } });
        }
        logger.debug({ participant, sendToAll }, 'forced new session for retry recp');
        for (const [i, msg] of msgs.entries()) {
            if (msg) {
                updateSendMessageAgainCount(ids[i], participant);
                const msgRelayOpts = { messageId: ids[i] };
                if (sendToAll) {
                    msgRelayOpts.useUserDevicesCache = false;
                }
                else {
                    msgRelayOpts.participant = {
                        jid: participant,
                        count: +retryNode.attrs.count
                    };
                }
                await relayMessage(key.remoteJid, msg, msgRelayOpts);
            }
            else {
                logger.debug({ jid: key.remoteJid, id: ids[i] }, 'recv retry request, but message not available');
            }
        }
    };
    const handleReceipt = async (node) => {
        var _a, _b;
        const { attrs, content } = node;
        const isLid = attrs.from.includes('lid');
        const isNodeFromMe = (0, WABinary_1.areJidsSameUser)(attrs.participant || attrs.from, isLid ? (_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.lid : (_b = authState.creds.me) === null || _b === void 0 ? void 0 : _b.id);
        const remoteJid = !isNodeFromMe || (0, WABinary_1.isJidGroup)(attrs.from) ? attrs.from : attrs.recipient;
        const fromMe = !attrs.recipient || (attrs.type === 'retry' && isNodeFromMe);
        const key = {
            remoteJid,
            id: '',
            fromMe,
            participant: attrs.participant
        };
        if (shouldIgnoreJid(remoteJid) && remoteJid !== '@s.whatsapp.net') {
            logger.debug({ remoteJid }, 'ignoring receipt from jid');
            await sendMessageAck(node);
            return;
        }
        const ids = [attrs.id];
        if (Array.isArray(content)) {
            const items = (0, WABinary_1.getBinaryNodeChildren)(content[0], 'item');
            ids.push(...items.map(i => i.attrs.id));
        }
        try {
            await Promise.all([
                processingMutex.mutex(async () => {
                    const status = (0, Utils_1.getStatusFromReceiptType)(attrs.type);
                    if (typeof status !== 'undefined' &&
                        (
                        // basically, we only want to know when a message from us has been delivered to/read by the other person
                        // or another device of ours has read some messages
                        status > WAProto_1.proto.WebMessageInfo.Status.DELIVERY_ACK ||
                            !isNodeFromMe)) {
                        if ((0, WABinary_1.isJidGroup)(remoteJid) || (0, WABinary_1.isJidStatusBroadcast)(remoteJid)) {
                            if (attrs.participant) {
                                const updateKey = status === WAProto_1.proto.WebMessageInfo.Status.DELIVERY_ACK ? 'receiptTimestamp' : 'readTimestamp';
                                ev.emit('message-receipt.update', ids.map(id => ({
                                    key: { ...key, id },
                                    receipt: {
                                        userJid: (0, WABinary_1.jidNormalizedUser)(attrs.participant),
                                        [updateKey]: +attrs.t
                                    }
                                })));
                            }
                        }
                        else {
                            ev.emit('messages.update', ids.map(id => ({
                                key: { ...key, id },
                                update: { status }
                            })));
                        }
                    }
                    if (attrs.type === 'retry') {
                        // correctly set who is asking for the retry
                        key.participant = key.participant || attrs.from;
                        const retryNode = (0, WABinary_1.getBinaryNodeChild)(node, 'retry');
                        if (willSendMessageAgain(ids[0], key.participant)) {
                            if (key.fromMe) {
                                try {
                                    logger.debug({ attrs, key }, 'recv retry request');
                                    await sendMessagesAgain(key, ids, retryNode);
                                }
                                catch (error) {
                                    logger.error({ key, ids, trace: error.stack }, 'error in sending message again');
                                }
                            }
                            else {
                                logger.info({ attrs, key }, 'recv retry for not fromMe message');
                            }
                        }
                        else {
                            logger.info({ attrs, key }, 'will not send message again, as sent too many times');
                        }
                    }
                })
            ]);
        }
        finally {
            await sendMessageAck(node);
        }
    };
    const handleNotification = async (node) => {
        const remoteJid = node.attrs.from;
        if (shouldIgnoreJid(remoteJid) && remoteJid !== '@s.whatsapp.net') {
            logger.debug({ remoteJid, id: node.attrs.id }, 'ignored notification');
            await sendMessageAck(node);
            return;
        }
        try {
            await Promise.all([
                processingMutex.mutex(async () => {
                    var _a;
                    const msg = await processNotification(node);
                    if (msg) {
                        const fromMe = (0, WABinary_1.areJidsSameUser)(node.attrs.participant || remoteJid, authState.creds.me.id);
                        msg.key = {
                            remoteJid,
                            fromMe,
                            participant: node.attrs.participant,
                            id: node.attrs.id,
                            ...(msg.key || {})
                        };
                        (_a = msg.participant) !== null && _a !== void 0 ? _a : (msg.participant = node.attrs.participant);
                        msg.messageTimestamp = +node.attrs.t;
                        const fullMsg = WAProto_1.proto.WebMessageInfo.fromObject(msg);
                        await upsertMessage(fullMsg, 'append');
                    }
                })
            ]);
        }
        finally {
            await sendMessageAck(node);
        }
    };
    const handleMessage = async (node) => {
        var _a, _b, _c;
        if (shouldIgnoreJid(node.attrs.from) && node.attrs.from !== '@s.whatsapp.net') {
            logger.debug({ key: node.attrs.key }, 'ignored message');
            await sendMessageAck(node);
            return;
        }
        let response;
        if ((0, WABinary_1.getBinaryNodeChild)(node, 'unavailable') && !(0, WABinary_1.getBinaryNodeChild)(node, 'enc')) {
            await sendMessageAck(node);
            const { key } = (0, Utils_1.decodeMessageNode)(node, authState.creds.me.id, authState.creds.me.lid || '').fullMessage;
            response = await requestPlaceholderResend(key);
            if (response === 'RESOLVED') {
                return;
            }
            logger.debug('received unavailable message, acked and requested resend from phone');
        }
        else {
            if (placeholderResendCache.get(node.attrs.id)) {
                placeholderResendCache.del(node.attrs.id);
            }
        }
        const { fullMessage: msg, category, author, decrypt } = (0, Utils_1.decryptMessageNode)(node, authState.creds.me.id, authState.creds.me.lid || '', signalRepository, logger);
        if (response && ((_a = msg === null || msg === void 0 ? void 0 : msg.messageStubParameters) === null || _a === void 0 ? void 0 : _a[0]) === Utils_1.NO_MESSAGE_FOUND_ERROR_TEXT) {
            msg.messageStubParameters = [Utils_1.NO_MESSAGE_FOUND_ERROR_TEXT, response];
        }
        if (((_c = (_b = msg.message) === null || _b === void 0 ? void 0 : _b.protocolMessage) === null || _c === void 0 ? void 0 : _c.type) === WAProto_1.proto.Message.ProtocolMessage.Type.SHARE_PHONE_NUMBER && node.attrs.sender_pn) {
            ev.emit('chats.phoneNumberShare', { lid: node.attrs.from, jid: node.attrs.sender_pn });
        }
        try {
            await Promise.all([
                processingMutex.mutex(async () => {
                    await decrypt();
                    // message failed to decrypt
                    if (msg.messageStubType === WAProto_1.proto.WebMessageInfo.StubType.CIPHERTEXT) {
                        retryMutex.mutex(async () => {
                            if (ws.isOpen) {
                                if ((0, WABinary_1.getBinaryNodeChild)(node, 'unavailable')) {
                                    return;
                                }
                                const encNode = (0, WABinary_1.getBinaryNodeChild)(node, 'enc');
                                await sendRetryRequest(node, !encNode);
                                if (retryRequestDelayMs) {
                                    await (0, Utils_1.delay)(retryRequestDelayMs);
                                }
                            }
                            else {
                                logger.debug({ node }, 'connection closed, ignoring retry req');
                            }
                        });
                    }
                    else {
                        // no type in the receipt => message delivered
                        let type = undefined;
                        let participant = msg.key.participant;
                        if (category === 'peer') { // special peer message
                            type = 'peer_msg';
                        }
                        else if (msg.key.fromMe) { // message was sent by us from a different device
                            type = 'sender';
                            // need to specially handle this case
                            if ((0, WABinary_1.isJidUser)(msg.key.remoteJid)) {
                                participant = author;
                            }
                        }
                        else if (!sendActiveReceipts) {
                            type = 'inactive';
                        }
                        await sendReceipt(msg.key.remoteJid, participant, [msg.key.id], type);
                        // send ack for history message
                        const isAnyHistoryMsg = (0, Utils_1.getHistoryMsg)(msg.message);
                        if (isAnyHistoryMsg) {
                            const jid = (0, WABinary_1.jidNormalizedUser)(msg.key.remoteJid);
                            await sendReceipt(jid, undefined, [msg.key.id], 'hist_sync');
                        }
                    }
                    (0, Utils_2.cleanMessage)(msg, authState.creds.me.id);
                    await upsertMessage(msg, node.attrs.offline ? 'append' : 'notify');
                })
            ]);
        }
        finally {
            await sendMessageAck(node);
        }
    };
    const fetchMessageHistory = async (count, oldestMsgKey, oldestMsgTimestamp) => {
        var _a;
        if (!((_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new boom_1.Boom('Not authenticated');
        }
        const pdoMessage = {
            historySyncOnDemandRequest: {
                chatJid: oldestMsgKey.remoteJid,
                oldestMsgFromMe: oldestMsgKey.fromMe,
                oldestMsgId: oldestMsgKey.id,
                oldestMsgTimestampMs: oldestMsgTimestamp,
                onDemandMsgCount: count
            },
            peerDataOperationRequestType: WAProto_1.proto.Message.PeerDataOperationRequestType.HISTORY_SYNC_ON_DEMAND
        };
        return sendPeerDataOperationMessage(pdoMessage);
    };
    const requestPlaceholderResend = async (messageKey) => {
        var _a;
        if (!((_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new boom_1.Boom('Not authenticated');
        }
        if (placeholderResendCache.get(messageKey === null || messageKey === void 0 ? void 0 : messageKey.id)) {
            logger.debug('already requested resend', { messageKey });
            return;
        }
        else {
            placeholderResendCache.set(messageKey === null || messageKey === void 0 ? void 0 : messageKey.id, true);
        }
        await (0, Utils_1.delay)(5000);
        if (!placeholderResendCache.get(messageKey === null || messageKey === void 0 ? void 0 : messageKey.id)) {
            logger.debug('message received while resend requested', { messageKey });
            return 'RESOLVED';
        }
        const pdoMessage = {
            placeholderMessageResendRequest: [{
                    messageKey
                }],
            peerDataOperationRequestType: WAProto_1.proto.Message.PeerDataOperationRequestType.PLACEHOLDER_MESSAGE_RESEND
        };
        setTimeout(() => {
            if (placeholderResendCache.get(messageKey === null || messageKey === void 0 ? void 0 : messageKey.id)) {
                logger.debug('PDO message without response after 15 seconds. Phone possibly offline', { messageKey });
                placeholderResendCache.del(messageKey === null || messageKey === void 0 ? void 0 : messageKey.id);
            }
        }, 15000);
        return sendPeerDataOperationMessage(pdoMessage);
    };
    const handleCall = async (node) => {
        const { attrs } = node;
        const [infoChild] = (0, WABinary_1.getAllBinaryNodeChildren)(node);
        const callId = infoChild.attrs['call-id'];
        const from = infoChild.attrs.from || infoChild.attrs['call-creator'];
        const status = (0, Utils_1.getCallStatusFromNode)(infoChild);
        const call = {
            chatId: attrs.from,
            from,
            id: callId,
            date: new Date(+attrs.t * 1000),
            offline: !!attrs.offline,
            status,
        };
        if (status === 'offer') {
            call.isVideo = !!(0, WABinary_1.getBinaryNodeChild)(infoChild, 'video');
            call.isGroup = infoChild.attrs.type === 'group' || !!infoChild.attrs['group-jid'];
            call.groupJid = infoChild.attrs['group-jid'];
            callOfferCache.set(call.id, call);
        }
        const existingCall = callOfferCache.get(call.id);
        // use existing call info to populate this event
        if (existingCall) {
            call.isVideo = existingCall.isVideo;
            call.isGroup = existingCall.isGroup;
        }
        // delete data once call has ended
        if (status === 'reject' || status === 'accept' || status === 'timeout' || status === 'terminate') {
            callOfferCache.del(call.id);
        }
        ev.emit('call', [call]);
        await sendMessageAck(node);
    };
    const handleBadAck = async ({ attrs }) => {
        const key = { remoteJid: attrs.from, fromMe: true, id: attrs.id };
        // current hypothesis is that if pash is sent in the ack
        // it means -- the message hasn't reached all devices yet
        // we'll retry sending the message here
        if (attrs.phash) {
            logger.info({ attrs }, 'received phash in ack, resending message...');
            const msg = await getMessage(key);
            if (msg) {
                await relayMessage(key.remoteJid, msg, { messageId: key.id, useUserDevicesCache: false });
            }
            else {
                logger.warn({ attrs }, 'could not send message again, as it was not found');
            }
        }
        // error in acknowledgement,
        // device could not display the message
        if (attrs.error) {
            logger.warn({ attrs }, 'received error in ack');
            ev.emit('messages.update', [
                {
                    key,
                    update: {
                        status: Types_1.WAMessageStatus.ERROR,
                        messageStubParameters: [
                            attrs.error
                        ]
                    }
                }
            ]);
        }
    };
    /// processes a node with the given function
    /// and adds the task to the existing buffer if we're buffering events
    const processNodeWithBuffer = async (node, identifier, exec) => {
        ev.buffer();
        await execTask();
        ev.flush();
        function execTask() {
            return exec(node)
                .catch(err => onUnexpectedError(err, identifier));
        }
    };
    // recv a message
    ws.on('CB:message', (node) => {
        processNodeWithBuffer(node, 'processing message', handleMessage);
    });
    ws.on('CB:call', async (node) => {
        processNodeWithBuffer(node, 'handling call', handleCall);
    });
    ws.on('CB:receipt', node => {
        processNodeWithBuffer(node, 'handling receipt', handleReceipt);
    });
    ws.on('CB:notification', async (node) => {
        processNodeWithBuffer(node, 'handling notification', handleNotification);
    });
    ws.on('CB:ack,class:message', (node) => {
        handleBadAck(node)
            .catch(error => onUnexpectedError(error, 'handling bad ack'));
    });
    ev.on('call', ([call]) => {
        // missed call + group call notification message generation
        if (call.status === 'timeout' || (call.status === 'offer' && call.isGroup)) {
            const msg = {
                key: {
                    remoteJid: call.chatId,
                    id: call.id,
                    fromMe: false
                },
                messageTimestamp: (0, Utils_1.unixTimestampSeconds)(call.date),
            };
            if (call.status === 'timeout') {
                if (call.isGroup) {
                    msg.messageStubType = call.isVideo ? Types_1.WAMessageStubType.CALL_MISSED_GROUP_VIDEO : Types_1.WAMessageStubType.CALL_MISSED_GROUP_VOICE;
                }
                else {
                    msg.messageStubType = call.isVideo ? Types_1.WAMessageStubType.CALL_MISSED_VIDEO : Types_1.WAMessageStubType.CALL_MISSED_VOICE;
                }
            }
            else {
                msg.message = { call: { callKey: Buffer.from(call.id) } };
            }
            const protoMsg = WAProto_1.proto.WebMessageInfo.fromObject(msg);
            upsertMessage(protoMsg, call.offline ? 'append' : 'notify');
        }
    });
    ev.on('connection.update', ({ isOnline }) => {
        if (typeof isOnline !== 'undefined') {
            sendActiveReceipts = isOnline;
            logger.trace(`sendActiveReceipts set to "${sendActiveReceipts}"`);
        }
    });
    return {
        ...sock,
        sendMessageAck,
        sendRetryRequest,
        rejectCall,
        fetchMessageHistory,
        requestPlaceholderResend,
    };
};
exports.makeMessagesRecvSocket = makeMessagesRecvSocket;
