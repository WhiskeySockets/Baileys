// ========================================
// IMPORTACIONES NECESARIAS
// ========================================

// Proto debe estar importado
import { proto } from '../WAProto/index.js'

// Otras importaciones necesarias
import makeWASocket from './Socket'
import { Browsers, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion } from './Utils'
import { downloadContentFromMessage, generateWAMessage, generateForwardMessageContent, generateWAMessageFromContent, generateWAMessageContent, extractMessageContent, getAggregateVotesInPollMessage, prepareWAMessageMedia } from './Utils/messages'
import { jidDecode, areJidsSameUser } from './WABinary'
import {
    DisconnectReason,
    WAMessageStubType,
    WAMessageStatus,
    type MessageRetryMap,
    type WAMessage
} from './Types'
import { WA_DEFAULT_EPHEMERAL } from './Defaults'

// ========================================
// EXPORTACIÓN PRINCIPAL COMPLETA
// ========================================

const exports = {
    // ✅ WEBSOCKET CONNECTION
    default: makeWASocket,
    makeWASocket,

    // ✅ PROTO (CRÍTICO)
    proto,

    // ✅ UTILS - DESCARGAS
    downloadContentFromMessage,

    // ✅ UTILS - JID
    jidDecode,
    areJidsSameUser,
    jidNormalizedUser: (jid: string) => {
        const { user, server } = jidDecode(jid) || {}
        return user && server ? `${user}@${server}` : jid
    },

    // ✅ UTILS - MENSAJES
    generateWAMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateWAMessageContent,
    extractMessageContent,
    prepareWAMessageMedia,
    getAggregateVotesInPollMessage,

    // ✅ TIPOS
    WAMessageStubType,
    WAMessageStatus,
    DisconnectReason,

    // ✅ DEFAULTS
    WA_DEFAULT_EPHEMERAL,

    // ✅ UTILS - AUTH
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,

    // ✅ UTILS - OTROS
    delay,
    Browsers,

    // ✅ CONSTANTES
    MessageRetryMap: {} as MessageRetryMap,

    // ✅ DEVICE
    getDevice: (id: string) => {
        const deviceID = (id.length > 21 ? '0' : id.substring(0, 2)) as '0' | '1' | '2' | '3' | '4'
        const dict = {
            '0': 'iOS',
            '1': 'Android',
            '2': 'Desktop',
            '3': 'Web',
            '4': 'Portal'
        }
        return dict[deviceID] || 'unknown'
    }
}

export default exports

// ✅ EXPORTACIONES NOMBRADAS (OPCIONAL PERO RECOMENDADO)
export {
    makeWASocket,
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateWAMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateWAMessageContent,
    WAMessageStubType,
    type WAMessage,
    extractMessageContent,
    getAggregateVotesInPollMessage,
    prepareWAMessageMedia,
    WA_DEFAULT_EPHEMERAL,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    delay,
    Browsers
}

export type WASocket = ReturnType<typeof makeWASocket>
