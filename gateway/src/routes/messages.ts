import { FastifyPluginAsync } from 'fastify'
import { sessionManager } from '../core/session-manager.js'
import { store } from '../db/store.js'

export const messageRoutes: FastifyPluginAsync = async fastify => {
	// Send message
	fastify.post<{
		Body: {
			deviceId?: string
			phone: string
			message?: string
			mediaUrl?: string
			mediaType?: 'image' | 'video' | 'audio' | 'document'
			fileName?: string
			mimetype?: string
			caption?: string
		}
	}>('/', async (req, reply) => {
		const { phone, message, mediaUrl, mediaType, fileName, mimetype, caption } = req.body || {}

		if (!phone) {
			return reply.status(400).send({ success: false, error: 'Recipient phone number is required' })
		}

		if (!message && !mediaUrl) {
			return reply.status(400).send({ success: false, error: 'Either message text or mediaUrl is required' })
		}

		// Find device
		let targetDeviceId = req.body?.deviceId
		if (!targetDeviceId) {
			const connected = store.getDevices().find(d => d.status === 'connected')
			if (!connected) {
				return reply.status(400).send({
					success: false,
					error: 'No active connected device found. Please create and link a device first.',
				})
			}
			targetDeviceId = connected.id
		}

		try {
			let content: any = {}

			if (mediaUrl) {
				const buffer = { url: mediaUrl }
				if (mediaType === 'image') {
					content = { image: buffer, caption: caption || message }
				} else if (mediaType === 'video') {
					content = { video: buffer, caption: caption || message }
				} else if (mediaType === 'audio') {
					content = { audio: buffer, mimetype: mimetype || 'audio/mp4', ptt: true }
				} else {
					content = {
						document: buffer,
						mimetype: mimetype || 'application/pdf',
						fileName: fileName || 'document.pdf',
						caption: caption || message,
					}
				}
			} else {
				content = { text: message }
			}

			const sent = await sessionManager.sendMessage(targetDeviceId, phone, content)

			return {
				success: true,
				messageId: sent.messageId,
				data: sent.record,
			}
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Get message history
	fastify.get<{ Querystring: { deviceId?: string; limit?: string } }>('/', async (req, reply) => {
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50
		const messages = store.getMessages(req.query.deviceId, limit)
		return { success: true, count: messages.length, data: messages }
	})
}
