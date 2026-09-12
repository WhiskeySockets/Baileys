import { FastifyPluginAsync } from 'fastify'
import { sessionManager } from '../core/session-manager.js'

export const groupRoutes: FastifyPluginAsync = async fastify => {
	// List joined groups
	fastify.get<{ Params: { deviceId: string } }>('/:deviceId/groups', async (req, reply) => {
		const { deviceId } = req.params
		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		try {
			const groups = await sock.groupFetchAllParticipating()
			const list = Object.values(groups).map(g => ({
				id: g.id,
				subject: g.subject,
				owner: g.owner,
				creation: g.creation,
				desc: g.desc,
				participantsCount: g.participants?.length || 0,
			}))
			return { success: true, count: list.length, data: list }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Create group
	fastify.post<{
		Params: { deviceId: string }
		Body: { subject: string; participants: string[] }
	}>('/:deviceId/groups', async (req, reply) => {
		const { deviceId } = req.params
		const { subject, participants } = req.body || {}

		if (!subject || !participants || !Array.isArray(participants) || participants.length === 0) {
			return reply.status(400).send({ success: false, error: 'subject and participants array are required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const jids = participants.map(p => (p.includes('@') ? p : `${p.replace(/[^0-9]/g, '')}@s.whatsapp.net`))

		try {
			const group = await sock.groupCreate(subject, jids)
			return reply.status(201).send({ success: true, data: group })
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Get group metadata
	fastify.get<{ Params: { deviceId: string; groupId: string } }>(
		'/:deviceId/groups/:groupId',
		async (req, reply) => {
			const { deviceId, groupId } = req.params
			const sock = sessionManager.getSession(deviceId)
			if (!sock) {
				return reply.status(400).send({ success: false, error: 'Device not connected' })
			}

			try {
				const metadata = await sock.groupMetadata(groupId)
				return { success: true, data: metadata }
			} catch (err: any) {
				return reply.status(500).send({ success: false, error: err.message })
			}
		}
	)

	// Add participants to group
	fastify.post<{
		Params: { deviceId: string; groupId: string }
		Body: { participants: string[] }
	}>('/:deviceId/groups/:groupId/participants', async (req, reply) => {
		const { deviceId, groupId } = req.params
		const { participants } = req.body || {}

		if (!participants || !Array.isArray(participants) || participants.length === 0) {
			return reply.status(400).send({ success: false, error: 'participants array is required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const jids = participants.map(p => (p.includes('@') ? p : `${p.replace(/[^0-9]/g, '')}@s.whatsapp.net`))

		try {
			const result = await sock.groupParticipantsUpdate(groupId, jids, 'add')
			return { success: true, data: result }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Remove participants from group
	fastify.delete<{
		Params: { deviceId: string; groupId: string }
		Body: { participants: string[] }
	}>('/:deviceId/groups/:groupId/participants', async (req, reply) => {
		const { deviceId, groupId } = req.params
		const { participants } = req.body || {}

		if (!participants || !Array.isArray(participants) || participants.length === 0) {
			return reply.status(400).send({ success: false, error: 'participants array is required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const jids = participants.map(p => (p.includes('@') ? p : `${p.replace(/[^0-9]/g, '')}@s.whatsapp.net`))

		try {
			const result = await sock.groupParticipantsUpdate(groupId, jids, 'remove')
			return { success: true, data: result }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Promote/demote participants
	fastify.patch<{
		Params: { deviceId: string; groupId: string }
		Body: { participants: string[]; action: 'promote' | 'demote' }
	}>('/:deviceId/groups/:groupId/participants', async (req, reply) => {
		const { deviceId, groupId } = req.params
		const { participants, action } = req.body || {}

		if (!participants || !['promote', 'demote'].includes(action)) {
			return reply.status(400).send({ success: false, error: 'participants and action (promote|demote) are required' })
		}

		const sock = sessionManager.getSession(deviceId)
		if (!sock) {
			return reply.status(400).send({ success: false, error: 'Device not connected' })
		}

		const jids = participants.map(p => (p.includes('@') ? p : `${p.replace(/[^0-9]/g, '')}@s.whatsapp.net`))

		try {
			const result = await sock.groupParticipantsUpdate(groupId, jids, action)
			return { success: true, data: result }
		} catch (err: any) {
			return reply.status(500).send({ success: false, error: err.message })
		}
	})

	// Get group invite code / link
	fastify.get<{ Params: { deviceId: string; groupId: string } }>(
		'/:deviceId/groups/:groupId/invite',
		async (req, reply) => {
			const { deviceId, groupId } = req.params
			const sock = sessionManager.getSession(deviceId)
			if (!sock) {
				return reply.status(400).send({ success: false, error: 'Device not connected' })
			}

			try {
				const code = await sock.groupInviteCode(groupId)
				return {
					success: true,
					inviteCode: code,
					inviteUrl: `https://chat.whatsapp.com/${code}`,
				}
			} catch (err: any) {
				return reply.status(500).send({ success: false, error: err.message })
			}
		}
	)
}
