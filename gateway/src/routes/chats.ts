import { FastifyPluginAsync } from 'fastify'
import { sessionManager } from '../core/session-manager.js'
import { store, ChatRecord, ChatNote } from '../db/store.js'

export const chatRoutes: FastifyPluginAsync = async fastify => {
	// List all conversations for a device
	fastify.get<{ Params: { deviceId: string } }>('/:deviceId/chats', async (req, reply) => {
		const { deviceId } = req.params
		const chats = store.getChats(deviceId)
		return { success: true, count: chats.length, data: chats }
	})

	// Get single conversation
	fastify.get<{ Params: { deviceId: string; chatWid: string } }>('/:deviceId/chats/:chatWid', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat conversation not found' })
		}
		return { success: true, data: chat }
	})

	// Get messages for a specific conversation
	fastify.get<{
		Params: { deviceId: string; chatWid: string }
		Querystring: { limit?: string }
	}>('/:deviceId/chats/:chatWid/messages', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50
		const messages = store.getMessages(deviceId, limit, chatWid)
		return { success: true, count: messages.length, data: messages }
	})

	// Mark conversation as read / unread
	fastify.patch<{
		Params: { deviceId: string; chatWid: string }
		Body: { unread?: boolean }
	}>('/:deviceId/chats/:chatWid/unread', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const { unread } = req.body || {}

		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat not found' })
		}

		chat.unreadCount = unread ? 1 : 0
		store.saveChat(chat)

		const sock = sessionManager.getSession(deviceId)
		if (sock && !unread) {
			try {
				await sock.readMessages([{ remoteJid: chatWid, id: chat.lastMessage ? 'latest' : undefined } as any])
			} catch (e) {}
		}

		return { success: true, data: chat }
	})

	// Assign chat to agent (Team Inbox)
	fastify.patch<{
		Params: { deviceId: string; chatWid: string }
		Body: { owner?: string }
	}>('/:deviceId/chats/:chatWid/owner', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const { owner } = req.body || {}

		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat not found' })
		}

		chat.owner = owner || undefined
		store.saveChat(chat)
		return { success: true, data: chat }
	})

	// Add internal note to chat
	fastify.post<{
		Params: { deviceId: string; chatWid: string }
		Body: { author?: string; text: string }
	}>('/:deviceId/chats/:chatWid/notes', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const { author, text } = req.body || {}

		if (!text) {
			return reply.status(400).send({ success: false, error: 'Note text is required' })
		}

		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat not found' })
		}

		const note: ChatNote = {
			id: `note_${Date.now()}`,
			author: author || 'Agent',
			text,
			createdAt: new Date().toISOString(),
		}

		chat.notes.push(note)
		store.saveChat(chat)
		return reply.status(201).send({ success: true, data: note })
	})

	// Delete internal note
	fastify.delete<{
		Params: { deviceId: string; chatWid: string; noteId: string }
	}>('/:deviceId/chats/:chatWid/notes/:noteId', async (req, reply) => {
		const { deviceId, chatWid, noteId } = req.params
		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat not found' })
		}

		chat.notes = chat.notes.filter(n => n.id !== noteId)
		store.saveChat(chat)
		return { success: true, message: 'Note deleted' }
	})

	// Update chat labels
	fastify.patch<{
		Params: { deviceId: string; chatWid: string }
		Body: { labels: string[] }
	}>('/:deviceId/chats/:chatWid/labels', async (req, reply) => {
		const { deviceId, chatWid } = req.params
		const { labels } = req.body || {}

		const chat = store.getChat(deviceId, chatWid)
		if (!chat) {
			return reply.status(404).send({ success: false, error: 'Chat not found' })
		}

		chat.labels = Array.isArray(labels) ? labels : []
		store.saveChat(chat)
		return { success: true, data: chat }
	})

	// Send typing status
	fastify.post<{
		Params: { deviceId: string }
		Body: { phone: string; status?: 'composing' | 'paused' | 'recording' }
	}>('/:deviceId/typing', async (req, reply) => {
		const { deviceId } = req.params
		const { phone, status } = req.body || {}

		if (!phone) {
			return reply.status(400).send({ success: false, error: 'phone is required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		let recipientJid = phone.includes('@') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`
		try {
			await sock.sendPresenceUpdate((status as any) || 'composing', recipientJid)
			return { success: true, message: `Presence update ${status || 'composing'} sent to ${recipientJid}` }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Edit sent message
	fastify.patch<{
		Params: { deviceId: string; messageWid: string }
		Body: { phone: string; text: string }
	}>('/:deviceId/messages/:messageWid', async (req, reply) => {
		const { deviceId, messageWid } = req.params
		const { phone, text } = req.body || {}

		if (!phone || !text) {
			return reply.status(400).send({ success: false, error: 'phone and new text are required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const recipientJid = phone.includes('@') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`
		try {
			const key = { remoteJid: recipientJid, fromMe: true, id: messageWid }
			await sock.sendMessage(recipientJid, { text, edit: key })
			return { success: true, message: 'Message edited successfully' }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Delete / revoke message for everyone
	fastify.delete<{
		Params: { deviceId: string; messageWid: string }
		Body: { phone: string }
	}>('/:deviceId/messages/:messageWid', async (req, reply) => {
		const { deviceId, messageWid } = req.params
		const { phone } = req.body || {}

		if (!phone) {
			return reply.status(400).send({ success: false, error: 'phone is required to delete message' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const recipientJid = phone.includes('@') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`
		try {
			const key = { remoteJid: recipientJid, fromMe: true, id: messageWid }
			await sock.sendMessage(recipientJid, { delete: key })
			return { success: true, message: 'Message revoked for everyone' }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})
}
