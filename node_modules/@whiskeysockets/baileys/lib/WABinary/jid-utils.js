export const S_WHATSAPP_NET = '@s.whatsapp.net';
export const OFFICIAL_BIZ_JID = '16505361212@c.us';
export const SERVER_JID = 'server@c.us';
export const PSA_WID = '0@c.us';
export const STORIES_JID = 'status@broadcast';
export const META_AI_JID = '13135550002@c.us';
export const jidEncode = (user, server, device, agent) => {
    return `${user || ''}${!!agent ? `_${agent}` : ''}${!!device ? `:${device}` : ''}@${server}`;
};
export const jidDecode = (jid) => {
    const sepIdx = typeof jid === 'string' ? jid.indexOf('@') : -1;
    if (sepIdx < 0) {
        return undefined;
    }
    const server = jid.slice(sepIdx + 1);
    const userCombined = jid.slice(0, sepIdx);
    const [userAgent, device] = userCombined.split(':');
    const user = userAgent.split('_')[0];
    return {
        server: server,
        user,
        domainType: server === 'lid' ? 1 : 0,
        device: device ? +device : undefined
    };
};
/** is the jid a user */
export const areJidsSameUser = (jid1, jid2) => jidDecode(jid1)?.user === jidDecode(jid2)?.user;
/** is the jid Meta AI */
export const isJidMetaAI = (jid) => jid?.endsWith('@bot');
/** is the jid a PN user */
export const isPnUser = (jid) => jid?.endsWith('@s.whatsapp.net');
/** is the jid a LID */
export const isLidUser = (jid) => jid?.endsWith('@lid');
/** is the jid a broadcast */
export const isJidBroadcast = (jid) => jid?.endsWith('@broadcast');
/** is the jid a group */
export const isJidGroup = (jid) => jid?.endsWith('@g.us');
/** is the jid the status broadcast */
export const isJidStatusBroadcast = (jid) => jid === 'status@broadcast';
/** is the jid a newsletter */
export const isJidNewsletter = (jid) => jid?.endsWith('@newsletter');
const botRegexp = /^1313555\d{4}$|^131655500\d{2}$/;
export const isJidBot = (jid) => jid && botRegexp.test(jid.split('@')[0]) && jid.endsWith('@c.us');
export const jidNormalizedUser = (jid) => {
    const result = jidDecode(jid);
    if (!result) {
        return '';
    }
    const { user, server } = result;
    return jidEncode(user, server === 'c.us' ? 's.whatsapp.net' : server);
};
export const transferDevice = (fromJid, toJid) => {
    const fromDecoded = jidDecode(fromJid);
    const deviceId = fromDecoded?.device || 0;
    const { server, user } = jidDecode(toJid);
    return jidEncode(user, server, deviceId);
};
//# sourceMappingURL=jid-utils.js.map