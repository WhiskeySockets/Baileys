import { store, CampaignRecord } from '../db/store.js'
import { sessionManager } from './session-manager.js'
import { webhookDispatcher } from './webhook-dispatcher.js'

export class CampaignWorker {
	private isProcessing = false
	private interval: NodeJS.Timeout | null = null

	start() {
		if (this.interval) return
		this.interval = setInterval(() => this.processNext(), 3000)
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = null
		}
	}

	async processNext() {
		if (this.isProcessing) return

		const campaigns = store.getCampaigns().filter(c => c.status === 'running')
		if (campaigns.length === 0) return

		this.isProcessing = true

		try {
			for (const campaign of campaigns) {
				const nextRecipient = campaign.recipients.find(r => r.status === 'pending')

				if (!nextRecipient) {
					campaign.status = 'completed'
					store.saveCampaign(campaign)
					webhookDispatcher.dispatch('campaign:completed', {
						campaignId: campaign.id,
						progress: campaign.progress,
					})
					continue
				}

				// Check if device is connected
				const sock = sessionManager.getSession(campaign.deviceId)
				if (!sock) {
					console.warn(`[Campaign] Device ${campaign.deviceId} is not connected. Pausing campaign ${campaign.id}`)
					campaign.status = 'paused'
					store.saveCampaign(campaign)
					continue
				}

				// Send message to recipient
				try {
					let content: any = { text: campaign.message }
					if (campaign.mediaUrl) {
						const buffer = { url: campaign.mediaUrl }
						if (campaign.mediaType === 'image') content = { image: buffer, caption: campaign.message }
						else if (campaign.mediaType === 'video') content = { video: buffer, caption: campaign.message }
						else if (campaign.mediaType === 'audio') content = { audio: buffer }
						else content = { document: buffer, caption: campaign.message }
					}

					await sessionManager.sendMessage(campaign.deviceId, nextRecipient.phone, content)

					nextRecipient.status = 'sent'
					nextRecipient.sentAt = new Date().toISOString()
					campaign.progress.sent += 1
				} catch (err: any) {
					nextRecipient.status = 'failed'
					nextRecipient.error = err.message
					campaign.progress.failed += 1
				}

				store.saveCampaign(campaign)

				// Calculate anti-ban pacing delay
				const min = campaign.minDelayMs || 5000
				const max = campaign.maxDelayMs || 15000
				const delay = Math.floor(Math.random() * (max - min + 1)) + min

				await new Promise(r => setTimeout(r, delay))
				break // Process one message per tick to allow interleaving
			}
		} finally {
			this.isProcessing = false
		}
	}
}

export const campaignWorker = new CampaignWorker()
