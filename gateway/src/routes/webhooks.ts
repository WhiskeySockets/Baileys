import { FastifyPluginAsync } from 'fastify'
import { store, WebhookRecord } from '../db/store.js'
import { webhookDispatcher } from '../core/webhook-dispatcher.js'

export const webhookRoutes: FastifyPluginAsync = async fastify => {
	// List webhooks
	fastify.get('/', async () => {
		const list = store.getWebhooks()
		return { success: true, count: list.length, data: list }
	})

	// Create webhook
	fastify.post<{
		Body: {
			url: string
			events?: string[]
			secret?: string
		}
	}>('/', async (req, reply) => {
		const { url, events, secret } = req.body || {}

		if (!url) {
			return reply.status(400).send({ success: false, error: 'url is required' })
		}

		const webhook: WebhookRecord = {
			id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			url,
			events: events && events.length > 0 ? events : ['*'],
			secret,
			active: true,
			createdAt: new Date().toISOString(),
		}

		store.saveWebhook(webhook)
		return reply.status(201).send({ success: true, data: webhook })
	})

	// Delete webhook
	fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
		store.deleteWebhook(req.params.id)
		return { success: true, message: 'Webhook deleted' }
	})

	// Test webhook delivery
	fastify.post<{ Body: { url: string } }>('/test', async (req, reply) => {
		const { url } = req.body || {}
		if (!url) {
			return reply.status(400).send({ success: false, error: 'url is required' })
		}

		await webhookDispatcher.dispatch('test:ping', {
			message: 'Test ping event from Wassenger Gateway',
			time: new Date().toISOString(),
		})

		return { success: true, message: 'Test webhook event dispatched' }
	})

	// Get delivery logs
	fastify.get<{
		Querystring: { limit?: number }
	}>('/deliveries', async req => {
		const limit = Number(req.query.limit) || 50
		const logs = store.getWebhookDeliveries(limit)
		return { success: true, count: logs.length, deliveries: logs }
	})
}

