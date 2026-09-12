import { FastifyPluginAsync } from 'fastify'
import { store, AutoReplyRule } from '../db/store.js'

export const autoReplyRoutes: FastifyPluginAsync = async fastify => {
	// List auto-reply rules
	fastify.get<{ Params: { deviceId: string } }>('/:deviceId/autoreplies', async req => {
		const list = store.getAutoReplies(req.params.deviceId)
		return { success: true, count: list.length, data: list }
	})

	// Create auto-reply rule
	fastify.post<{
		Params: { deviceId: string }
		Body: { keyword: string; matchType?: 'exact' | 'contains' | 'regex' | 'default'; reply: string }
	}>('/:deviceId/autoreplies', async (req, reply) => {
		const { deviceId } = req.params
		const { keyword, matchType, reply: replyText } = req.body || {}

		if (!keyword || !replyText) {
			return reply.status(400).send({ success: false, error: 'keyword and reply text are required' })
		}

		const rule: AutoReplyRule = {
			id: `ar_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
			deviceId,
			keyword,
			matchType: matchType || 'contains',
			reply: replyText,
			active: true,
		}

		store.saveAutoReply(rule)
		return reply.status(201).send({ success: true, data: rule })
	})

	// Delete auto-reply rule
	fastify.delete<{ Params: { deviceId: string; id: string } }>(
		'/:deviceId/autoreplies/:id',
		async (req, reply) => {
			store.deleteAutoReply(req.params.id)
			return { success: true, message: 'Auto-reply rule deleted' }
		}
	)
}
