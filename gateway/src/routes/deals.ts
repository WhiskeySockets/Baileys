import { FastifyPluginAsync } from 'fastify'
import { store, DealRecord } from '../db/store.js'

export const dealRoutes: FastifyPluginAsync = async fastify => {
	// List deals
	fastify.get<{
		Querystring: { deviceId?: string }
	}>('/', async req => {
		const deals = store.getDeals(req.query.deviceId)
		return { success: true, count: deals.length, deals }
	})

	// Create deal
	fastify.post<{
		Body: {
			deviceId: string
			contactPhone: string
			contactName: string
			title: string
			value?: number
			currency?: string
			stage?: DealRecord['stage']
			assignedTo?: string
			notes?: string
			tags?: string[]
		}
	}>('/', async (req, reply) => {
		const {
			deviceId,
			contactPhone,
			contactName,
			title,
			value = 0,
			currency = 'USD',
			stage = 'lead',
			assignedTo,
			notes,
			tags = [],
		} = req.body

		if (!deviceId || !contactPhone || !title) {
			return reply.status(400).send({ error: 'deviceId, contactPhone, and title are required' })
		}

		const newDeal: DealRecord = {
			id: `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			deviceId,
			contactPhone,
			contactName: contactName || contactPhone,
			title,
			value: Number(value) || 0,
			currency,
			stage,
			assignedTo,
			notes,
			tags,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		store.saveDeal(newDeal)
		return reply.status(201).send({ success: true, deal: newDeal })
	})

	// Update deal (stage change, value, notes, assignedTo)
	fastify.patch<{
		Params: { id: string }
		Body: Partial<Omit<DealRecord, 'id' | 'createdAt'>>
	}>('/:id', async (req, reply) => {
		const deal = store.getDeal(req.params.id)
		if (!deal) {
			return reply.status(404).send({ error: 'Deal not found' })
		}

		const updated: DealRecord = {
			...deal,
			...req.body,
			updatedAt: new Date().toISOString(),
		}

		store.saveDeal(updated)
		return { success: true, deal: updated }
	})

	// Delete deal
	fastify.delete<{
		Params: { id: string }
	}>('/:id', async (req, reply) => {
		const deal = store.getDeal(req.params.id)
		if (!deal) {
			return reply.status(404).send({ error: 'Deal not found' })
		}

		store.deleteDeal(req.params.id)
		return { success: true, message: 'Deal removed' }
	})
}
