// @ts-check
/**
 * Baileys Enhanced - Mejora automática con JsDoc typing
 * Compatible con proyectos TypeScript estrictos
 * @module baileys-enhanced
 */
const makeWASocket = require('@whiskeysockets/baileys').default;
const chalk = require('chalk');

// ==================== TYPES (JSDoc) ====================

/**
 * @typedef {Object} CacheEntry
 * @property {string} jid
 * @property {number} time
 */
/**
 * @typedef {Object} GroupCacheEntry
 * @property {EnhancedGroupMetadata} data
 * @property {number} time
 */
/**
 * @typedef {Object} EnhancedParticipant
 * @property {string} jid
 * @property {string | null} admin
 * @property {boolean} isAdmin
 */
/**
 * @typedef {Object} EnhancedGroupMetadata
 * @property {string} id
 * @property {string} subject
 * @property {string | null} owner
 * @property {EnhancedParticipant[]} participants
 * @property {EnhancedParticipant[]} admins
 * @property {number} size
 */
/**
 * @typedef {Object} MessageInfo
 * @property {string} chat
 * @property {string} sender
 * @property {boolean} isGroup
 * @property {string} id
 */

// ==================== CONFIGURACIÓN ====================

const SECURE_PAIRING = { code: 'CLOUDEVX', locked: true };

/** @type {Map<string, CacheEntry>} */
const jidCache = new Map();

/** @type {Map<string, GroupCacheEntry>} */
const groupCache = new Map();

/** @type {Set<string>} */
const failedLids = new Set();

const CONFIG = {
    TTL: 5 * 60 * 1000,
    MAX_SIZE: 500
};

// ==================== CORE FUNCTIONS ====================

/**
 * Limpia JID automáticamente
 * @param {string | null | undefined} jid
 * @returns {string | null}
 */
function autoCleanJid(jid) {
    if (!jid) return null;
    try {
        return String(jid).trim().split(':')[0].split('/')[0];
    } catch {
        return null;
    }
}

/**
 * Detecta si es un LID
 * @param {string | null | undefined} jid
 * @returns {boolean}
 */
function isLidJid(jid) {
    if (!jid) return false;
    const str = String(jid);
    return str.includes('@lid') || str.includes('lid:');
}

/**
 * Valida formato de JID
 * @param {string | null | undefined} jid
 * @returns {boolean}
 */
function isValidJid(jid) {
    if (!jid) return false;
    const cleaned = autoCleanJid(jid);
    if (!cleaned || isLidJid(cleaned)) return false;
    return /^(\d{10,15})@(s.whatsapp.net|g.us)$/.test(cleaned);
}

/**
 * Resuelve LID a JID real
 * @param {any} conn - Conexión de Baileys
 * @param {string} lid
 * @returns {Promise<string | null>}
 */
async function autoResolveLid(conn, lid) {
    if (!lid || !isLidJid(lid)) return lid;

    const cached = jidCache.get(lid);
    if (cached && (Date.now() - cached.time) < CONFIG.TTL) {
        return cached.jid;
    }

    if (failedLids.has(lid)) return null;

    try {
        const phone = lid.split('@')[0].replace(/\D/g, '');
        if (!phone || phone.length < 10) return null;

        const [result] = await conn.onWhatsApp(phone);
        if (result?.jid) {
            const resolved = autoCleanJid(result.jid);
            if (isValidJid(resolved)) {
                jidCache.set(lid, { jid: resolved, time: Date.now() });

                if (jidCache.size > CONFIG.MAX_SIZE) {
                    const firstKey = jidCache.keys().next().value;
                    jidCache.delete(firstKey);
                }

                return resolved;
            }
        }
    } catch (err) {
        // Silent fail
    }

    failedLids.add(lid);
    return null;
}

/**
 * Procesa array de JIDs
 * @param {any} conn
 * @param {(string | null | undefined)[]} jids
 * @returns {Promise<string[]>}
 */
async function autoProcessJids(conn, jids) {
    if (!Array.isArray(jids)) return [];

    const promises = jids.map(async (jid) => {
        if (!jid) return null;

        const cleaned = autoCleanJid(jid);
        if (isLidJid(cleaned)) {
            return await autoResolveLid(conn, cleaned);
        }

        return isValidJid(cleaned) ? cleaned : null;
    });

    const results = await Promise.all(promises);
    return results.filter((j) => j !== null);
}

/**
 * Obtiene metadata mejorada
 * @param {any} conn
 * @param {string} groupJid
 * @returns {Promise<EnhancedGroupMetadata | null>}
 */
async function getEnhancedGroupMetadata(conn, groupJid) {
    const cached = groupCache.get(groupJid);
    if (cached && (Date.now() - cached.time) < CONFIG.TTL) {
        return cached.data;
    }

    const metadata = await conn.groupMetadata(groupJid);
    if (!metadata?.participants) throw new Error('Invalid metadata');

    const processedParticipants = await Promise.all(
        metadata.participants.map(async (p) => {
            let jid = p.id || p.jid;
            jid = autoCleanJid(jid);

            if (isLidJid(jid)) {
                jid = await autoResolveLid(conn, jid);
                if (!jid) return null;
            }

            if (!isValidJid(jid)) return null;

            return {
                jid,
                admin: p.admin || null,
                isAdmin: ['admin', 'superadmin'].includes(p.admin)
            };
        })
    );

    const validParticipants = processedParticipants.filter(p => p !== null);

    const enhancedMetadata = {
        id: metadata.id,
        subject: metadata.subject,
        owner: metadata.owner ? autoCleanJid(metadata.owner) : null,
        participants: validParticipants,
        admins: validParticipants.filter(p => p.isAdmin),
        size: validParticipants.length,
    };

    groupCache.set(groupJid, { data: enhancedMetadata, time: Date.now() });

    if (groupCache.size > CONFIG.MAX_SIZE) {
        const firstKey = groupCache.keys().next().value;
        groupCache.delete(firstKey);
    }

    return enhancedMetadata;
}
