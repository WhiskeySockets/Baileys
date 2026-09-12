import { FastifyPluginAsync } from 'fastify'
import { sessionManager } from '../core/session-manager.js'
import { store } from '../db/store.js'

export const contactRoutes: FastifyPluginAsync = async fastify => {
	// Check if a phone number exists on WhatsApp
	fastify.get<{ Params: { phone: string }; Querystring: { deviceId?: string } }>(
		'/:phone/exists',
		async (req, reply) => {
			const { phone } = req.params
			const clean = phone.replace(/[^0-9]/g, '')

			let targetDeviceId = req.query.deviceId
			if (!targetDeviceId) {
				const connected = store.getDevices().find(d => d.status === 'connected')
				if (!connected) {
					return reply.status(400).send({ success: false, error: 'No connected device available to check contact' })
				}
				targetDeviceId = connected.id
			}

			const sock = sessionManager.getSession(targetDeviceId)
			if (!sock) {
				return reply.status(400).send({ success: false, error: 'Device is not connected' })
			}

			try {
				const results = await sock.onWhatsApp(clean)
				const exists = results && results.length > 0 && results[0]?.exists

				return {
					success: true,
					phone: clean,
					exists: !!exists,
					jid: results && results[0]?.jid ? results[0].jid : undefined,
				}
			} catch (err: any) {
				return reply.status(500).send({ success: false, error: err.message })
			}
		}
	)

	// Fetch contact profile picture
	fastify.get<{ Params: { phone: string }; Querystring: { deviceId?: string } }>(
		'/:phone/picture',
		async (req, reply) => {
			const { phone } = req.params
			const clean = phone.replace(/[^0-9]/g, '')
			const jid = `${clean}@s.whatsapp.net`

			let targetDeviceId = req.query.deviceId
			if (!targetDeviceId) {
				const connected = store.getDevices().find(d => d.status === 'connected')
				if (!connected) {
					return reply.status(400).send({ success: false, error: 'No connected device available' })
				}
				targetDeviceId = connected.id
			}

			const sock = sessionManager.getSession(targetDeviceId)
			if (!sock) {
				return reply.status(400).send({ success: false, error: 'Device is not connected' })
			}

			try {
				const url = await sock.profilePictureUrl(jid, 'image')
				return { success: true, phone: clean, profilePictureUrl: url }
			} catch (err: any) {
				return { success: false, phone: clean, profilePictureUrl: null, error: 'No public profile picture' }
			}
		}
	)
}
