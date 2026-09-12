import { FastifyPluginAsync } from 'fastify'
import { store, LabelRecord } from '../db/store.js'

export const labelRoutes: FastifyPluginAsync = async fastify => {
	// List labels
	fastify.get<{ Params: { deviceId: string } }>('/:deviceId/labels', async req => {
		const labels = store.getLabels(req.params.deviceId)
		return { success: true, count: labels.length, data: labels }
	})

	// Create label
	fastify.post<{
		Params: { deviceId: string }
		Body: { name: string; color?: string }
	}>('/:deviceId/labels', async (req, reply) => {
		const { deviceId } = req.params
		const { name, color } = req.body || {}

		if (!name) {
			return reply.status(400).send({ success: false, error: 'name is required' })
		}

		const label: LabelRecord = {
			id: `lbl_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
			deviceId,
			name,
			color: color || '#10b981',
		}

		store.saveLabel(label)
		return reply.status(201).send({ success: true, data: label })
	})

	// Delete label
	fastify.delete<{ Params: { deviceId: string; id: string } }>('/:deviceId/labels/:id', async (req, reply) => {
		store.deleteLabel(req.params.id)
		return { success: true, message: 'Label deleted' }
	})
}
