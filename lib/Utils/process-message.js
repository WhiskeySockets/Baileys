"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPollVote = exports.getChatId = exports.shouldIncrementChatUnread = exports.isRealMessage = exports.cleanMessage = void 0;
const WAProto_1 = require("../../WAProto");
const Types_1 = require("../Types");
const messages_1 = require("../Utils/messages");
const WABinary_1 = require("../WABinary");
const crypto_1 = require("./crypto");
const generics_1 = require("./generics");
const history_1 = require("./history");
const REAL_MSG_STUB_TYPES = new Set([
    Types_1.WAMessageStubType.CALL_MISSED_GROUP_VIDEO,
    Types_1.WAMessageStubType.CALL_MISSED_GROUP_VOICE,
    Types_1.WAMessageStubType.CALL_MISSED_VIDEO,
    Types_1.WAMessageStubType.CALL_MISSED_VOICE
]);
const REAL_MSG_REQ_ME_STUB_TYPES = new Set([
    Types_1.WAMessageStubType.GROUP_PARTICIPANT_ADD
]);
/** Cleans a received message to further processing */
const cleanMessage = (message, meId) => {
    // ensure remoteJid and participant doesn't have device or agent in it
    message.key.remoteJid = (0, WABinary_1.jidNormalizedUser)(message.key.remoteJid);
    message.key.participant = message.key.participant ? (0, WABinary_1.jidNormalizedUser)(message.key.participant) : undefined;
    const content = (0, messages_1.normalizeMessageContent)(message.message);
    // if the message has a reaction, ensure fromMe & remoteJid are from our perspective
    if (content === null || content === void 0 ? void 0 : content.reactionMessage) {
        normaliseKey(content.reactionMessage.key);
    }
    if (content === null || content === void 0 ? void 0 : content.pollUpdateMessage) {
        normaliseKey(content.pollUpdateMessage.pollCreationMessageKey);
    }
    function normaliseKey(msgKey) {
        // if the reaction is from another user
        // we've to correctly map the key to this user's perspective
        if (!message.key.fromMe) {
            // if the sender believed the message being reacted to is not from them
            // we've to correct the key to be from them, or some other participant
            msgKey.fromMe = !msgKey.fromMe
                ? (0, WABinary_1.areJidsSameUser)(msgKey.participant || msgKey.remoteJid, meId)
                // if the message being reacted to, was from them
                // fromMe automatically becomes false
                : false;
            // set the remoteJid to being the same as the chat the message came from
            msgKey.remoteJid = message.key.remoteJid;
            // set participant of the message
            msgKey.participant = msgKey.participant || message.key.participant;
        }
    }
};
exports.cleanMessage = cleanMessage;
const isRealMessage = (message, meId) => {
    var _a;
    const normalizedContent = (0, messages_1.normalizeMessageContent)(message.message);
    const hasSomeContent = !!(0, messages_1.getContentType)(normalizedContent);
    return (!!normalizedContent
        || REAL_MSG_STUB_TYPES.has(message.messageStubType)
        || (REAL_MSG_REQ_ME_STUB_TYPES.has(message.messageStubType)
            && ((_a = message.messageStubParameters) === null || _a === void 0 ? void 0 : _a.some(p => (0, WABinary_1.areJidsSameUser)(meId, p)))))
        && hasSomeContent
        && !(normalizedContent === null || normalizedContent === void 0 ? void 0 : normalizedContent.protocolMessage)
        && !(normalizedContent === null || normalizedContent === void 0 ? void 0 : normalizedContent.reactionMessage)
        && !(normalizedContent === null || normalizedContent === void 0 ? void 0 : normalizedContent.pollUpdateMessage);
};
exports.isRealMessage = isRealMessage;
const shouldIncrementChatUnread = (message) => (!message.key.fromMe && !message.messageStubType);
exports.shouldIncrementChatUnread = shouldIncrementChatUnread;
/**
 * Get the ID of the chat from the given key.
 * Typically -- that'll be the remoteJid, but for broadcasts, it'll be the participant
 */
const getChatId = ({ remoteJid, participant, fromMe }) => {
    if ((0, WABinary_1.isJidBroadcast)(remoteJid)
        && !(0, WABinary_1.isJidStatusBroadcast)(remoteJid)
        && !fromMe) {
        return participant;
    }
    return remoteJid;
};
exports.getChatId = getChatId;
/**
 * Decrypt a poll vote
 * @param vote encrypted vote
 * @param ctx additional info about the poll required for decryption
 * @returns list of SHA256 options
 */
function decryptPollVote({ encPayload, encIv }, { pollCreatorJid, pollMsgId, pollEncKey, voterJid, }) {
    const sign = Buffer.concat([
        toBinary(pollMsgId),
        toBinary(pollCreatorJid),
        toBinary(voterJid),
        toBinary('Poll Vote'),
        new Uint8Array([1])
    ]);
    const key0 = (0, crypto_1.hmacSign)(pollEncKey, new Uint8Array(32), 'sha256');
    const decKey = (0, crypto_1.hmacSign)(sign, key0, 'sha256');
    const aad = toBinary(`${pollMsgId}\u0000${voterJid}`);
    const decrypted = (0, crypto_1.aesDecryptGCM)(encPayload, decKey, encIv, aad);
    return WAProto_1.proto.Message.PollVoteMessage.decode(decrypted);
    function toBinary(txt) {
        return Buffer.from(txt);
    }
}
exports.decryptPollVote = decryptPollVote;
const processMessage = async (message, { shouldProcessHistoryMsg, placeholderResendCache, ev, creds, keyStore, logger, options, getMessage }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const meId = creds.me.id;
    const { accountSettings } = creds;
    const chat = { id: (0, WABinary_1.jidNormalizedUser)((0, exports.getChatId)(message.key)) };
    const isRealMsg = (0, exports.isRealMessage)(message, meId);
    if (isRealMsg) {
        chat.conversationTimestamp = (0, generics_1.toNumber)(message.messageTimestamp);
        // only increment unread count if not CIPHERTEXT and from another person
        if ((0, exports.shouldIncrementChatUnread)(message)) {
            chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
    }
    const content = (0, messages_1.normalizeMessageContent)(message.message);
    // unarchive chat if it's a real message, or someone reacted to our message
    // and we've the unarchive chats setting on
    if ((isRealMsg || ((_b = (_a = content === null || content === void 0 ? void 0 : content.reactionMessage) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.fromMe))
        && (accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.unarchiveChats)) {
        chat.archived = false;
        chat.readOnly = false;
    }
    const protocolMsg = content === null || content === void 0 ? void 0 : content.protocolMessage;
    if (protocolMsg) {
        switch (protocolMsg.type) {
            case WAProto_1.proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION:
                const histNotification = protocolMsg.historySyncNotification;
                const process = shouldProcessHistoryMsg;
                const isLatest = !((_c = creds.processedHistoryMessages) === null || _c === void 0 ? void 0 : _c.length);
                logger === null || logger === void 0 ? void 0 : logger.info({
                    histNotification,
                    process,
                    id: message.key.id,
                    isLatest,
                }, 'got history notification');
                if (process) {
                    if (histNotification.syncType !== WAProto_1.proto.HistorySync.HistorySyncType.ON_DEMAND) {
                        ev.emit('creds.update', {
                            processedHistoryMessages: [
                                ...(creds.processedHistoryMessages || []),
                                { key: message.key, messageTimestamp: message.messageTimestamp }
                            ]
                        });
                    }
                    const data = await (0, history_1.downloadAndProcessHistorySyncNotification)(histNotification, options);
                    ev.emit('messaging-history.set', {
                        ...data,
                        isLatest: histNotification.syncType !== WAProto_1.proto.HistorySync.HistorySyncType.ON_DEMAND
                            ? isLatest
                            : undefined,
                        peerDataRequestSessionId: histNotification.peerDataRequestSessionId
                    });
                }
                break;
            case WAProto_1.proto.Message.ProtocolMessage.Type.APP_STATE_SYNC_KEY_SHARE:
                const keys = protocolMsg.appStateSyncKeyShare.keys;
                if (keys === null || keys === void 0 ? void 0 : keys.length) {
                    let newAppStateSyncKeyId = '';
                    await keyStore.transaction(async () => {
                        const newKeys = [];
                        for (const { keyData, keyId } of keys) {
                            const strKeyId = Buffer.from(keyId.keyId).toString('base64');
                            newKeys.push(strKeyId);
                            await keyStore.set({ 'app-state-sync-key': { [strKeyId]: keyData } });
                            newAppStateSyncKeyId = strKeyId;
                        }
                        logger === null || logger === void 0 ? void 0 : logger.info({ newAppStateSyncKeyId, newKeys }, 'injecting new app state sync keys');
                    });
                    ev.emit('creds.update', { myAppStateKeyId: newAppStateSyncKeyId });
                }
                else {
                    logger === null || logger === void 0 ? void 0 : logger.info({ protocolMsg }, 'recv app state sync with 0 keys');
                }
                break;
            case WAProto_1.proto.Message.ProtocolMessage.Type.REVOKE:
                ev.emit('messages.update', [
                    {
                        key: {
                            ...message.key,
                            id: protocolMsg.key.id
                        },
                        update: { message: null, messageStubType: Types_1.WAMessageStubType.REVOKE, key: message.key }
                    }
                ]);
                break;
            case WAProto_1.proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING:
                Object.assign(chat, {
                    ephemeralSettingTimestamp: (0, generics_1.toNumber)(message.messageTimestamp),
                    ephemeralExpiration: protocolMsg.ephemeralExpiration || null
                });
                break;
            case WAProto_1.proto.Message.ProtocolMessage.Type.PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE:
                const response = protocolMsg.peerDataOperationRequestResponseMessage;
                if (response) {
                    placeholderResendCache === null || placeholderResendCache === void 0 ? void 0 : placeholderResendCache.del(response.stanzaId);
                    // TODO: IMPLEMENT HISTORY SYNC ETC (sticker uploads etc.).
                    const { peerDataOperationResult } = response;
                    for (const result of peerDataOperationResult) {
                        const { placeholderMessageResendResponse: retryResponse } = result;
                        //eslint-disable-next-line max-depth
                        if (retryResponse) {
                            const webMessageInfo = WAProto_1.proto.WebMessageInfo.decode(retryResponse.webMessageInfoBytes);
                            // wait till another upsert event is available, don't want it to be part of the PDO response message
                            setTimeout(() => {
                                ev.emit('messages.upsert', {
                                    messages: [webMessageInfo],
                                    type: 'notify',
                                    requestId: response.stanzaId
                                });
                            }, 500);
                        }
                    }
                }
                break;
        }
    }
    else if (content === null || content === void 0 ? void 0 : content.reactionMessage) {
        const reaction = {
            ...content.reactionMessage,
            key: message.key,
        };
        ev.emit('messages.reaction', [{
                reaction,
                key: (_d = content.reactionMessage) === null || _d === void 0 ? void 0 : _d.key,
            }]);
    }
    else if (message.messageStubType) {
        const jid = (_e = message.key) === null || _e === void 0 ? void 0 : _e.remoteJid;
        //let actor = whatsappID (message.participant)
        let participants;
        const emitParticipantsUpdate = (action) => (ev.emit('group-participants.update', { id: jid, author: message.participant, participants, action }));
        const emitGroupUpdate = (update) => {
            var _a;
            ev.emit('groups.update', [{ id: jid, ...update, author: (_a = message.participant) !== null && _a !== void 0 ? _a : undefined }]);
        };
        const emitGroupRequestJoin = (participant, action, method) => {
            ev.emit('group.join-request', { id: jid, author: message.participant, participant, action, method: method });
        };
        const participantsIncludesMe = () => participants.find(jid => (0, WABinary_1.areJidsSameUser)(meId, jid));
        switch (message.messageStubType) {
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER:
                participants = message.messageStubParameters || [];
                emitParticipantsUpdate('modify');
                break;
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
                participants = message.messageStubParameters || [];
                emitParticipantsUpdate('remove');
                // mark the chat read only if you left the group
                if (participantsIncludesMe()) {
                    chat.readOnly = true;
                }
                break;
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_ADD:
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_INVITE:
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                participants = message.messageStubParameters || [];
                if (participantsIncludesMe()) {
                    chat.readOnly = false;
                }
                emitParticipantsUpdate('add');
                break;
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_DEMOTE:
                participants = message.messageStubParameters || [];
                emitParticipantsUpdate('demote');
                break;
            case Types_1.WAMessageStubType.GROUP_PARTICIPANT_PROMOTE:
                participants = message.messageStubParameters || [];
                emitParticipantsUpdate('promote');
                break;
            case Types_1.WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
                const announceValue = (_f = message.messageStubParameters) === null || _f === void 0 ? void 0 : _f[0];
                emitGroupUpdate({ announce: announceValue === 'true' || announceValue === 'on' });
                break;
            case Types_1.WAMessageStubType.GROUP_CHANGE_RESTRICT:
                const restrictValue = (_g = message.messageStubParameters) === null || _g === void 0 ? void 0 : _g[0];
                emitGroupUpdate({ restrict: restrictValue === 'true' || restrictValue === 'on' });
                break;
            case Types_1.WAMessageStubType.GROUP_CHANGE_SUBJECT:
                const name = (_h = message.messageStubParameters) === null || _h === void 0 ? void 0 : _h[0];
                chat.name = name;
                emitGroupUpdate({ subject: name });
                break;
            case Types_1.WAMessageStubType.GROUP_CHANGE_DESCRIPTION:
                const description = (_j = message.messageStubParameters) === null || _j === void 0 ? void 0 : _j[0];
                chat.description = description;
                emitGroupUpdate({ desc: description });
                break;
            case Types_1.WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
                const code = (_k = message.messageStubParameters) === null || _k === void 0 ? void 0 : _k[0];
                emitGroupUpdate({ inviteCode: code });
                break;
            case Types_1.WAMessageStubType.GROUP_MEMBER_ADD_MODE:
                const memberAddValue = (_l = message.messageStubParameters) === null || _l === void 0 ? void 0 : _l[0];
                emitGroupUpdate({ memberAddMode: memberAddValue === 'all_member_add' });
                break;
            case Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE:
                const approvalMode = (_m = message.messageStubParameters) === null || _m === void 0 ? void 0 : _m[0];
                emitGroupUpdate({ joinApprovalMode: approvalMode === 'on' });
                break;
            case Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD:
                const participant = (_o = message.messageStubParameters) === null || _o === void 0 ? void 0 : _o[0];
                const action = (_p = message.messageStubParameters) === null || _p === void 0 ? void 0 : _p[1];
                const method = (_q = message.messageStubParameters) === null || _q === void 0 ? void 0 : _q[2];
                emitGroupRequestJoin(participant, action, method);
                break;
        }
    }
    else if (content === null || content === void 0 ? void 0 : content.pollUpdateMessage) {
        const creationMsgKey = content.pollUpdateMessage.pollCreationMessageKey;
        // we need to fetch the poll creation message to get the poll enc key
        const pollMsg = await getMessage(creationMsgKey);
        if (pollMsg) {
            const meIdNormalised = (0, WABinary_1.jidNormalizedUser)(meId);
            const pollCreatorJid = (0, generics_1.getKeyAuthor)(creationMsgKey, meIdNormalised);
            const voterJid = (0, generics_1.getKeyAuthor)(message.key, meIdNormalised);
            const pollEncKey = (_r = pollMsg.messageContextInfo) === null || _r === void 0 ? void 0 : _r.messageSecret;
            try {
                const voteMsg = decryptPollVote(content.pollUpdateMessage.vote, {
                    pollEncKey,
                    pollCreatorJid,
                    pollMsgId: creationMsgKey.id,
                    voterJid,
                });
                ev.emit('messages.update', [
                    {
                        key: creationMsgKey,
                        update: {
                            pollUpdates: [
                                {
                                    pollUpdateMessageKey: message.key,
                                    vote: voteMsg,
                                    senderTimestampMs: content.pollUpdateMessage.senderTimestampMs.toNumber(),
                                }
                            ]
                        }
                    }
                ]);
            }
            catch (err) {
                logger === null || logger === void 0 ? void 0 : logger.warn({ err, creationMsgKey }, 'failed to decrypt poll vote');
            }
        }
        else {
            logger === null || logger === void 0 ? void 0 : logger.warn({ creationMsgKey }, 'poll creation message not found, cannot decrypt update');
        }
    }
    if (Object.keys(chat).length > 1) {
        ev.emit('chats.update', [chat]);
    }
};
exports.default = processMessage;
