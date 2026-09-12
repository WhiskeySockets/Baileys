import { FastifyPluginAsync } from 'fastify'
import { store } from '../db/store.js'

export const syncRoutes: FastifyPluginAsync = async fastify => {
	// Import data extracted from Wassenger console
	fastify.post<{
		Body: {
			token?: string
			devices?: any[]
			labels?: any[]
			quickReplies?: any[]
			webhooks?: any[]
			chats?: any[]
			team?: any[]
			uiConfig?: any
		}
	}>('/import', async (req, reply) => {
		const { token, devices, labels, quickReplies, webhooks, chats, team, uiConfig } = req.body || {}

		console.log('\n=============================================')
		console.log('📥 RECEIVED WASSENGER LIVE DATA SYNC FROM CHROME!')
		console.log(`🔑 Token detected: ${token ? 'Yes (Stored)' : 'No'}`)
		console.log(`📱 Devices found: ${devices?.length || 0}`)
		console.log(`🏷️ Labels found: ${labels?.length || 0}`)
		console.log(`⚡ Quick Replies found: ${quickReplies?.length || 0}`)
		console.log(`🔗 Webhooks found: ${webhooks?.length || 0}`)
		console.log('=============================================\n')

		let importedCount = 0

		// Import Labels
		if (Array.isArray(labels)) {
			for (const l of labels) {
				store.saveLabel({
					id: l.id || `lbl_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
					deviceId: l.device || l.deviceId || 'default',
					name: l.name || l.label,
					color: l.color || '#164e87',
				})
				importedCount++
			}
		}

		// Import Quick Replies
		if (Array.isArray(quickReplies)) {
			for (const q of quickReplies) {
				store.saveQuickReply({
					id: q.id || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
					deviceId: q.device || q.deviceId || 'default',
					shortcut: q.shortcut?.startsWith('/') ? q.shortcut : `/${q.shortcut || 'quick'}`,
					message: q.message || q.text || '',
				})
				importedCount++
			}
		}

		// Import Webhooks
		if (Array.isArray(webhooks)) {
			for (const w of webhooks) {
				store.saveWebhook({
					id: w.id || `wh_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
					url: w.url,
					events: Array.isArray(w.events) ? w.events : ['*'],
					active: w.status !== 'disabled',
					createdAt: w.createdAt || new Date().toISOString(),
				})
				importedCount++
			}
		}

		return {
			success: true,
			message: `Wassenger configuration successfully synced! Imported ${importedCount} items.`,
			summary: {
				labels: labels?.length || 0,
				quickReplies: quickReplies?.length || 0,
				webhooks: webhooks?.length || 0,
				devices: devices?.length || 0,
			},
		}
	})
}
