import { FastifyPluginAsync } from 'fastify'
import { store, CampaignRecord } from '../db/store.js'

export const campaignRoutes: FastifyPluginAsync = async fastify => {
	// List campaigns
	fastify.get<{ Querystring: { deviceId?: string } }>('/', async req => {
		const campaigns = store.getCampaigns(req.query.deviceId)
		return { success: true, count: campaigns.length, data: campaigns }
	})

	// Create new campaign
	fastify.post<{
		Body: {
			deviceId?: string
			name: string
			message: string
			mediaUrl?: string
			mediaType?: 'image' | 'video' | 'audio' | 'document'
			recipients: string[]
			minDelayMs?: number
			maxDelayMs?: number
			autoStart?: boolean
		}
	}>('/', async (req, reply) => {
		const { name, message, mediaUrl, mediaType, recipients, minDelayMs, maxDelayMs, autoStart } = req.body || {}

		if (!name || !message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
			return reply.status(400).send({
				success: false,
				error: 'name, message, and a non-empty array of recipient phone numbers are required',
			})
		}

		let targetDeviceId = req.body.deviceId
		if (!targetDeviceId) {
			const connected = store.getDevices().find(d => d.status === 'connected')
			if (!connected) {
				return reply.status(400).send({ success: false, error: 'No connected device found for campaign' })
			}
			targetDeviceId = connected.id
		}

		const recipientList = recipients.map(phone => ({
			phone: phone.replace(/[^0-9]/g, ''),
			status: 'pending' as const,
		}))

		const campaign: CampaignRecord = {
			id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			deviceId: targetDeviceId,
			name,
			message,
			mediaUrl,
			mediaType,
			recipients: recipientList,
			minDelayMs: minDelayMs || 5000,
			maxDelayMs: maxDelayMs || 15000,
			status: autoStart !== false ? 'running' : 'pending',
			progress: {
				total: recipientList.length,
				sent: 0,
				failed: 0,
			},
			createdAt: new Date().toISOString(),
		}

		store.saveCampaign(campaign)
		return reply.status(201).send({ success: true, data: campaign })
	})

	// Get campaign details
	fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
		const campaign = store.getCampaign(req.params.id)
		if (!campaign) {
			return reply.status(404).send({ success: false, error: 'Campaign not found' })
		}
		return { success: true, data: campaign }
	})

	// Update campaign status (pause / resume / cancel)
	fastify.put<{
		Params: { id: string }
		Body: { status: 'running' | 'paused' | 'cancelled' }
	}>('/:id/status', async (req, reply) => {
		const { status } = req.body || {}
		const campaign = store.getCampaign(req.params.id)
		if (!campaign) {
			return reply.status(404).send({ success: false, error: 'Campaign not found' })
		}

		if (!['running', 'paused', 'cancelled'].includes(status)) {
			return reply.status(400).send({ success: false, error: 'Invalid status. Must be running, paused, or cancelled' })
		}

		campaign.status = status
		store.saveCampaign(campaign)
		return { success: true, data: campaign }
	})

	// Delete campaign
	fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
		store.deleteCampaign(req.params.id)
		return { success: true, message: 'Campaign deleted' }
	})
}
