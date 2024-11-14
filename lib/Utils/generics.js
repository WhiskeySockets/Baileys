"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToCrockford = exports.trimUndefined = exports.isWABusinessPlatform = exports.getCodeFromWSError = exports.getCallStatusFromNode = exports.getErrorCodeFromStreamError = exports.getStatusFromReceiptType = exports.generateMdTagPrefix = exports.fetchLatestWaWebVersion = exports.fetchLatestBaileysVersion = exports.printQRIfNecessaryListener = exports.bindWaitForConnectionUpdate = exports.bindWaitForEvent = exports.generateMessageID = exports.generateMessageIDV2 = exports.promiseTimeout = exports.delayCancellable = exports.delay = exports.debouncedTimeout = exports.unixTimestampSeconds = exports.toNumber = exports.encodeBigEndian = exports.generateRegistrationId = exports.encodeWAMessage = exports.unpadRandomMax16 = exports.writeRandomPadMax16 = exports.getKeyAuthor = exports.BufferJSON = exports.getPlatformId = exports.Browsers = void 0;
const boom_1 = require("@hapi/boom");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const os_1 = require("os");
const WAProto_1 = require("../../WAProto");
const baileys_version_json_1 = require("../Defaults/baileys-version.json");
const Types_1 = require("../Types");
const WABinary_1 = require("../WABinary");
const PLATFORM_MAP = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'sunos': 'Solaris'
};
exports.Browsers = {
    ubuntu: (browser) => ['Ubuntu', browser, '22.04.4'],
    macOS: (browser) => ['Mac OS', browser, '14.4.1'],
    baileys: (browser) => ['Baileys', browser, '6.5.0'],
    windows: (browser) => ['Windows', browser, '10.0.22631'],
    /** The appropriate browser based on your OS & release */
    appropriate: (browser) => [PLATFORM_MAP[(0, os_1.platform)()] || 'Ubuntu', browser, (0, os_1.release)()]
};
const getPlatformId = (browser) => {
    const platformType = WAProto_1.proto.DeviceProps.PlatformType[browser.toUpperCase()];
    return platformType ? platformType.toString().charCodeAt(0).toString() : '49'; //chrome
};
exports.getPlatformId = getPlatformId;
exports.BufferJSON = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replacer: (k, value) => {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array || (value === null || value === void 0 ? void 0 : value.type) === 'Buffer') {
            return { type: 'Buffer', data: Buffer.from((value === null || value === void 0 ? void 0 : value.data) || value).toString('base64') };
        }
        return value;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviver: (_, value) => {
        if (typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
            const val = value.data || value.value;
            return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val || []);
        }
        return value;
    }
};
const getKeyAuthor = (key, meId = 'me') => (((key === null || key === void 0 ? void 0 : key.fromMe) ? meId : (key === null || key === void 0 ? void 0 : key.participant) || (key === null || key === void 0 ? void 0 : key.remoteJid)) || '');
exports.getKeyAuthor = getKeyAuthor;
const writeRandomPadMax16 = (msg) => {
    const pad = (0, crypto_1.randomBytes)(1);
    pad[0] &= 0xf;
    if (!pad[0]) {
        pad[0] = 0xf;
    }
    return Buffer.concat([msg, Buffer.alloc(pad[0], pad[0])]);
};
exports.writeRandomPadMax16 = writeRandomPadMax16;
const unpadRandomMax16 = (e) => {
    const t = new Uint8Array(e);
    if (0 === t.length) {
        throw new Error('unpadPkcs7 given empty bytes');
    }
    var r = t[t.length - 1];
    if (r > t.length) {
        throw new Error(`unpad given ${t.length} bytes, but pad is ${r}`);
    }
    return new Uint8Array(t.buffer, t.byteOffset, t.length - r);
};
exports.unpadRandomMax16 = unpadRandomMax16;
const encodeWAMessage = (message) => ((0, exports.writeRandomPadMax16)(WAProto_1.proto.Message.encode(message).finish()));
exports.encodeWAMessage = encodeWAMessage;
const generateRegistrationId = () => {
    return Uint16Array.from((0, crypto_1.randomBytes)(2))[0] & 16383;
};
exports.generateRegistrationId = generateRegistrationId;
const encodeBigEndian = (e, t = 4) => {
    let r = e;
    const a = new Uint8Array(t);
    for (let i = t - 1; i >= 0; i--) {
        a[i] = 255 & r;
        r >>>= 8;
    }
    return a;
};
exports.encodeBigEndian = encodeBigEndian;
const toNumber = (t) => ((typeof t === 'object' && t) ? ('toNumber' in t ? t.toNumber() : t.low) : t || 0);
exports.toNumber = toNumber;
/** unix timestamp of a date in seconds */
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);
exports.unixTimestampSeconds = unixTimestampSeconds;
const debouncedTimeout = (intervalMs = 1000, task) => {
    let timeout;
    return {
        start: (newIntervalMs, newTask) => {
            task = newTask || task;
            intervalMs = newIntervalMs || intervalMs;
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => task === null || task === void 0 ? void 0 : task(), intervalMs);
        },
        cancel: () => {
            timeout && clearTimeout(timeout);
            timeout = undefined;
        },
        setTask: (newTask) => task = newTask,
        setInterval: (newInterval) => intervalMs = newInterval
    };
};
exports.debouncedTimeout = debouncedTimeout;
const delay = (ms) => (0, exports.delayCancellable)(ms).delay;
exports.delay = delay;
const delayCancellable = (ms) => {
    const stack = new Error().stack;
    let timeout;
    let reject;
    const delay = new Promise((resolve, _reject) => {
        timeout = setTimeout(resolve, ms);
        reject = _reject;
    });
    const cancel = () => {
        clearTimeout(timeout);
        reject(new boom_1.Boom('Cancelled', {
            statusCode: 500,
            data: {
                stack
            }
        }));
    };
    return { delay, cancel };
};
exports.delayCancellable = delayCancellable;
async function promiseTimeout(ms, promise) {
    if (!ms) {
        return new Promise(promise);
    }
    const stack = new Error().stack;
    // Create a promise that rejects in <ms> milliseconds
    const { delay, cancel } = (0, exports.delayCancellable)(ms);
    const p = new Promise((resolve, reject) => {
        delay
            .then(() => reject(new boom_1.Boom('Timed Out', {
            statusCode: Types_1.DisconnectReason.timedOut,
            data: {
                stack
            }
        })))
            .catch(err => reject(err));
        promise(resolve, reject);
    })
        .finally(cancel);
    return p;
}
exports.promiseTimeout = promiseTimeout;
// inspired from whatsmeow code
// https://github.com/tulir/whatsmeow/blob/64bc969fbe78d31ae0dd443b8d4c80a5d026d07a/send.go#L42
const generateMessageIDV2 = (userId) => {
    const data = Buffer.alloc(8 + 20 + 16);
    data.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000)));
    if (userId) {
        const id = (0, WABinary_1.jidDecode)(userId);
        if (id === null || id === void 0 ? void 0 : id.user) {
            data.write(id.user, 8);
            data.write('@c.us', 8 + id.user.length);
        }
    }
    const random = (0, crypto_1.randomBytes)(16);
    random.copy(data, 28);
    const hash = (0, crypto_1.createHash)('sha256').update(data).digest();
    return '3EB0' + hash.toString('hex').toUpperCase().substring(0, 18);
};
exports.generateMessageIDV2 = generateMessageIDV2;
// generate a random ID to attach to a message
const generateMessageID = () => '3EB0' + (0, crypto_1.randomBytes)(18).toString('hex').toUpperCase();
exports.generateMessageID = generateMessageID;
function bindWaitForEvent(ev, event) {
    return async (check, timeoutMs) => {
        let listener;
        let closeListener;
        await (promiseTimeout(timeoutMs, (resolve, reject) => {
            closeListener = ({ connection, lastDisconnect }) => {
                if (connection === 'close') {
                    reject((lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error)
                        || new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed }));
                }
            };
            ev.on('connection.update', closeListener);
            listener = (update) => {
                if (check(update)) {
                    resolve();
                }
            };
            ev.on(event, listener);
        })
            .finally(() => {
            ev.off(event, listener);
            ev.off('connection.update', closeListener);
        }));
    };
}
exports.bindWaitForEvent = bindWaitForEvent;
const bindWaitForConnectionUpdate = (ev) => bindWaitForEvent(ev, 'connection.update');
exports.bindWaitForConnectionUpdate = bindWaitForConnectionUpdate;
const printQRIfNecessaryListener = (ev, logger) => {
    ev.on('connection.update', async ({ qr }) => {
        if (qr) {
            const QR = await Promise.resolve().then(() => __importStar(require('qrcode-terminal'))).then(m => m.default || m)
                .catch(() => {
                logger.error('QR code terminal not added as dependency');
            });
            QR === null || QR === void 0 ? void 0 : QR.generate(qr, { small: true });
        }
    });
};
exports.printQRIfNecessaryListener = printQRIfNecessaryListener;
/**
 * utility that fetches latest baileys version from the master branch.
 * Use to ensure your WA connection is always on the latest version
 */
const fetchLatestBaileysVersion = async (options = {}) => {
    const URL = 'https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json';
    try {
        const result = await axios_1.default.get(URL, {
            ...options,
            responseType: 'json'
        });
        return {
            version: result.data.version,
            isLatest: true
        };
    }
    catch (error) {
        return {
            version: baileys_version_json_1.version,
            isLatest: false,
            error
        };
    }
};
exports.fetchLatestBaileysVersion = fetchLatestBaileysVersion;
/**
 * A utility that fetches the latest web version of whatsapp.
 * Use to ensure your WA connection is always on the latest version
 */
const fetchLatestWaWebVersion = async (options) => {
    try {
        const result = await axios_1.default.get('https://web.whatsapp.com/check-update?version=1&platform=web', {
            ...options,
            responseType: 'json'
        });
        const version = result.data.currentVersion.split('.');
        return {
            version: [+version[0], +version[1], +version[2]],
            isLatest: true
        };
    }
    catch (error) {
        return {
            version: baileys_version_json_1.version,
            isLatest: false,
            error
        };
    }
};
exports.fetchLatestWaWebVersion = fetchLatestWaWebVersion;
/** unique message tag prefix for MD clients */
const generateMdTagPrefix = () => {
    const bytes = (0, crypto_1.randomBytes)(4);
    return `${bytes.readUInt16BE()}.${bytes.readUInt16BE(2)}-`;
};
exports.generateMdTagPrefix = generateMdTagPrefix;
const STATUS_MAP = {
    'played': WAProto_1.proto.WebMessageInfo.Status.PLAYED,
    'read': WAProto_1.proto.WebMessageInfo.Status.READ,
    'read-self': WAProto_1.proto.WebMessageInfo.Status.READ
};
/**
 * Given a type of receipt, returns what the new status of the message should be
 * @param type type from receipt
 */
const getStatusFromReceiptType = (type) => {
    const status = STATUS_MAP[type];
    if (typeof type === 'undefined') {
        return WAProto_1.proto.WebMessageInfo.Status.DELIVERY_ACK;
    }
    return status;
};
exports.getStatusFromReceiptType = getStatusFromReceiptType;
const CODE_MAP = {
    conflict: Types_1.DisconnectReason.connectionReplaced
};
/**
 * Stream errors generally provide a reason, map that to a baileys DisconnectReason
 * @param reason the string reason given, eg. "conflict"
 */
const getErrorCodeFromStreamError = (node) => {
    const [reasonNode] = (0, WABinary_1.getAllBinaryNodeChildren)(node);
    let reason = (reasonNode === null || reasonNode === void 0 ? void 0 : reasonNode.tag) || 'unknown';
    const statusCode = +(node.attrs.code || CODE_MAP[reason] || Types_1.DisconnectReason.badSession);
    if (statusCode === Types_1.DisconnectReason.restartRequired) {
        reason = 'restart required';
    }
    return {
        reason,
        statusCode
    };
};
exports.getErrorCodeFromStreamError = getErrorCodeFromStreamError;
const getCallStatusFromNode = ({ tag, attrs }) => {
    let status;
    switch (tag) {
        case 'offer':
        case 'offer_notice':
            status = 'offer';
            break;
        case 'terminate':
            if (attrs.reason === 'timeout') {
                status = 'timeout';
            }
            else {
                //fired when accepted/rejected/timeout/caller hangs up
                status = 'terminate';
            }
            break;
        case 'reject':
            status = 'reject';
            break;
        case 'accept':
            status = 'accept';
            break;
        default:
            status = 'ringing';
            break;
    }
    return status;
};
exports.getCallStatusFromNode = getCallStatusFromNode;
const UNEXPECTED_SERVER_CODE_TEXT = 'Unexpected server response: ';
const getCodeFromWSError = (error) => {
    var _a, _b, _c;
    let statusCode = 500;
    if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes(UNEXPECTED_SERVER_CODE_TEXT)) {
        const code = +(error === null || error === void 0 ? void 0 : error.message.slice(UNEXPECTED_SERVER_CODE_TEXT.length));
        if (!Number.isNaN(code) && code >= 400) {
            statusCode = code;
        }
    }
    else if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((_b = error === null || error === void 0 ? void 0 : error.code) === null || _b === void 0 ? void 0 : _b.startsWith('E'))
        || ((_c = error === null || error === void 0 ? void 0 : error.message) === null || _c === void 0 ? void 0 : _c.includes('timed out'))) { // handle ETIMEOUT, ENOTFOUND etc
        statusCode = 408;
    }
    return statusCode;
};
exports.getCodeFromWSError = getCodeFromWSError;
/**
 * Is the given platform WA business
 * @param platform AuthenticationCreds.platform
 */
const isWABusinessPlatform = (platform) => {
    return platform === 'smbi' || platform === 'smba';
};
exports.isWABusinessPlatform = isWABusinessPlatform;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function trimUndefined(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'undefined') {
            delete obj[key];
        }
    }
    return obj;
}
exports.trimUndefined = trimUndefined;
const CROCKFORD_CHARACTERS = '123456789ABCDEFGHJKLMNPQRSTVWXYZ';
function bytesToCrockford(buffer) {
    let value = 0;
    let bitCount = 0;
    const crockford = [];
    for (const element of buffer) {
        value = (value << 8) | (element & 0xff);
        bitCount += 8;
        while (bitCount >= 5) {
            crockford.push(CROCKFORD_CHARACTERS.charAt((value >>> (bitCount - 5)) & 31));
            bitCount -= 5;
        }
    }
    if (bitCount > 0) {
        crockford.push(CROCKFORD_CHARACTERS.charAt((value << (5 - bitCount)) & 31));
    }
    return crockford.join('');
}
exports.bytesToCrockford = bytesToCrockford;
