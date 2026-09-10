import { FastifyPluginAsync } from 'fastify'
import { store, ChatbotFlowRecord, ChatbotStep } from '../db/store.js'

export const chatbotRoutes: FastifyPluginAsync = async fastify => {
	// List chatbots
	fastify.get<{
		Querystring: { deviceId?: string }
	}>('/', async req => {
		const bots = store.getChatbots(req.query.deviceId)
		return { success: true, count: bots.length, chatbots: bots }
	})

	// Create chatbot flow
	fastify.post<{
		Body: {
			deviceId: string
			name: string
			triggerKeywords: string[]
			matchType?: 'exact' | 'contains'
			steps: ChatbotStep[]
			active?: boolean
		}
	}>('/', async (req, reply) => {
		const {
			deviceId,
			name,
			triggerKeywords,
			matchType = 'contains',
			steps = [],
			active = true,
		} = req.body

		if (!deviceId || !name || !Array.isArray(triggerKeywords) || triggerKeywords.length === 0) {
			return reply.status(400).send({ error: 'deviceId, name, and triggerKeywords array are required' })
		}

		const newBot: ChatbotFlowRecord = {
			id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			deviceId,
			name,
			triggerKeywords: triggerKeywords.map(k => k.trim().toLowerCase()),
			matchType,
			steps,
			active,
			createdAt: new Date().toISOString(),
		}

		store.saveChatbot(newBot)
		return reply.status(201).send({ success: true, chatbot: newBot })
	})

	// Update chatbot flow
	fastify.patch<{
		Params: { id: string }
		Body: Partial<Omit<ChatbotFlowRecord, 'id' | 'createdAt'>>
	}>('/:id', async (req, reply) => {
		const bot = store.getChatbot(req.params.id)
		if (!bot) {
			return reply.status(404).send({ error: 'Chatbot flow not found' })
		}

		const updated: ChatbotFlowRecord = {
			...bot,
			...req.body,
		}
		if (req.body.triggerKeywords) {
			updated.triggerKeywords = req.body.triggerKeywords.map(k => k.trim().toLowerCase())
		}

		store.saveChatbot(updated)
		return { success: true, chatbot: updated }
	})

	// Delete chatbot
	fastify.delete<{
		Params: { id: string }
	}>('/:id', async (req, reply) => {
		const bot = store.getChatbot(req.params.id)
		if (!bot) {
			return reply.status(404).send({ error: 'Chatbot flow not found' })
		}

		store.deleteChatbot(req.params.id)
		return { success: true, message: 'Chatbot flow deleted' }
	})

	// Simulate chatbot match
	fastify.post<{
		Params: { id: string }
		Body: { message: string }
	}>('/:id/simulate', async (req, reply) => {
		const bot = store.getChatbot(req.params.id)
		if (!bot) {
			return reply.status(404).send({ error: 'Chatbot flow not found' })
		}

		const msgText = (req.body.message || '').trim().toLowerCase()
		const matched = bot.triggerKeywords.some(keyword => {
			if (bot.matchType === 'exact') return msgText === keyword
			return msgText.includes(keyword)
		})

		return {
			success: true,
			matched,
			triggeredSteps: matched ? bot.steps : [],
		}
	})
}
