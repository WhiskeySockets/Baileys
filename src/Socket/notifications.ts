import { WAMessage, WASocket } from '../Types'
import { getContentType } from '../Utils'

/**
 * Sets up a listener for incoming message notifications.
 * @param sock The active WASocket instance
 */
export const setupNotifications = (sock: WASocket) => {
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return

        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue

            const jid = msg.key.remoteJid
            const sender = msg.pushName || 'Unknown'
            const contentType = getContentType(msg.message) || 'unknown'
            const content = extractMessageContent(msg)

            console.log(`🔔 New message from ${sender} (${jid})`)
            console.log(`📨 Type: ${contentType}`)
            console.log(`💬 Content: ${content}`)
        }
    })
}

/**
 * Extracts readable content from a WhatsApp message.
 * @param msg The WhatsApp message object
 * @returns A string representing the message content
 */
const extractMessageContent = (msg: WAMessage): string => {
    const message = msg.message
    if (!message) return '[no content]'

    if ('conversation' in message) return message.conversation
    if ('extendedTextMessage' in message) return message.extendedTextMessage?.text || ''
    if ('imageMessage' in message) return '[image]'
    if ('videoMessage' in message) return '[video]'
    if ('audioMessage' in message) return '[audio]'
    if ('documentMessage' in message) return '[document]'
    if ('stickerMessage' in message) return '[sticker]'
    if ('contactMessage' in message) return '[contact]'
    if ('locationMessage' in message) return '[location]'

    return '[unknown type]'
}
