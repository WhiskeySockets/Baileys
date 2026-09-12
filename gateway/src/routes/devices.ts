import { FastifyPluginAsync } from 'fastify'
import { sessionManager } from '../core/session-manager.js'
import { store } from '../db/store.js'

export const deviceRoutes: FastifyPluginAsync = async fastify => {
	// List devices
	fastify.get('/', async (req, reply) => {
		const devices = store.getDevices()
		return { success: true, count: devices.length, data: devices }
	})

	// Create device
	fastify.post<{
		Body: {
			id?: string
			name: string
			type?: 'baileys' | 'waba'
			metaConfig?: {
				phoneNumberId: string
				wabaId: string
				accessToken: string
			}
		}
	}>('/', async (req, reply) => {
		const name = req.body?.name || 'WhatsApp Device'
		const type = req.body?.type || 'baileys'
		const id = req.body?.id || `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

		if (type === 'waba') {
			const { phoneNumberId, wabaId, accessToken } = req.body?.metaConfig || {}
			if (!phoneNumberId || !accessToken) {
				return reply.status(400).send({ success: false, error: 'phoneNumberId and accessToken are required for Official WhatsApp API' })
			}

			const device = {
				id,
				name,
				type: 'waba' as const,
				status: 'connected' as const,
				metaConfig: { phoneNumberId, wabaId: wabaId || '', accessToken },
				createdAt: new Date().toISOString(),
			}

			store.saveDevice(device as any)
			return reply.status(201).send({
				success: true,
				message: 'Official WhatsApp Cloud API connected successfully',
				data: device,
			})
		}

		const device = await sessionManager.createDevice(id, name)
		return reply.status(201).send({
			success: true,
			message: 'Device created and connecting',
			data: device,
		})
	})

	// Get single device
	fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
		const device = store.getDevice(req.params.id)
		if (!device) {
			return reply.status(404).send({ success: false, error: 'Device not found' })
		}
		return { success: true, data: device }
	})

	// Get QR code for device
	fastify.get<{ Params: { id: string } }>('/:id/qr', async (req, reply) => {
		const device = store.getDevice(req.params.id)
		if (!device) {
			return reply.status(404).send({ success: false, error: 'Device not found' })
		}

		if (device.status === 'connected') {
			return { success: true, message: 'Device is already connected', status: 'connected' }
		}

		const qr = sessionManager.getQrCode(req.params.id)
		if (!qr) {
			return reply.status(202).send({
				success: true,
				message: 'QR code not generated yet, please try again in a few seconds',
				status: device.status,
			})
		}

		return {
			success: true,
			status: 'scan_qr',
			qrCode: qr.dataUrl,
			raw: qr.raw,
		}
	})

	// Request pairing code (alternative to QR code)
	fastify.post<{ Params: { id: string }; Body: { phoneNumber: string } }>('/:id/pair', async (req, reply) => {
		const { id } = req.params
		const { phoneNumber } = req.body || {}

		if (!phoneNumber) {
			return reply.status(400).send({ success: false, error: 'phoneNumber is required' })
		}

		try {
			const code = await sessionManager.requestPairingCode(id, phoneNumber)
			return {
				success: true,
				message: 'Pairing code generated. Enter this 8-digit code in WhatsApp > Linked Devices > Link with phone number',
				pairingCode: code,
			}
		} catch (err: any) {
			return reply.status(400).send({ success: false, error: err.message })
		}
	})

	// Delete device / logout
	fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
		const device = store.getDevice(req.params.id)
		if (!device) {
			return reply.status(404).send({ success: false, error: 'Device not found' })
		}

		await sessionManager.deleteSession(req.params.id)
		return { success: true, message: 'Device logged out and deleted successfully' }
	})
}
