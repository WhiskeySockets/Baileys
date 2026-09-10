import { FastifyPluginAsync } from 'fastify'
import { store, QuickReplyRecord } from '../db/store.js'

export const quickReplyRoutes: FastifyPluginAsync = async fastify => {
	// List quick replies
	fastify.get<{ Params: { deviceId: string } }>('/:deviceId/quickReplies', async req => {
		const list = store.getQuickReplies(req.params.deviceId)
		return { success: true, count: list.length, data: list }
	})

	// Create quick reply
	fastify.post<{
		Params: { deviceId: string }
		Body: { shortcut: string; message: string }
	}>('/:deviceId/quickReplies', async (req, reply) => {
		const { deviceId } = req.params
		const { shortcut, message } = req.body || {}

		if (!shortcut || !message) {
			return reply.status(400).send({ success: false, error: 'shortcut and message are required' })
		}

		const cleanShortcut = shortcut.startsWith('/') ? shortcut : `/${shortcut}`

		const qr: QuickReplyRecord = {
			id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
			deviceId,
			shortcut: cleanShortcut,
			message,
		}

		store.saveQuickReply(qr)
		return reply.status(201).send({ success: true, data: qr })
	})

	// Delete quick reply
	fastify.delete<{ Params: { deviceId: string; id: string } }>(
		'/:deviceId/quickReplies/:id',
		async (req, reply) => {
			store.deleteQuickReply(req.params.id)
			return { success: true, message: 'Quick reply deleted' }
		}
	)
}
