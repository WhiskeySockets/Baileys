import crypto from 'crypto'
import { store, WebhookRecord } from '../db/store.js'
import { CONFIG } from '../config.js'

export interface WebhookEventPayload {
	event: string
	timestamp: string
	data: Record<string, any>
}

export class WebhookDispatcher {
	async dispatch(event: string, data: Record<string, any>) {
		const webhooks = store.getWebhooks().filter(w => w.active && (w.events.includes(event) || w.events.includes('*')))

		if (webhooks.length === 0) return

		const payload: WebhookEventPayload = {
			event,
			timestamp: new Date().toISOString(),
			data,
		}

		for (const webhook of webhooks) {
			this.sendWithRetry(webhook, payload).catch(err => {
				console.error(`[Webhook] Failed to deliver ${event} to ${webhook.url}:`, err.message)
			})
		}
	}

	private async sendWithRetry(webhook: WebhookRecord, payload: WebhookEventPayload, attempt = 1) {
		const body = JSON.stringify(payload)
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'User-Agent': 'Wassenger-Baileys-Gateway/1.0',
		}

		if (webhook.secret) {
			const signature = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex')
			headers['X-Webhook-Signature'] = signature
		}

		const startTime = Date.now()
		try {
			const controller = new AbortController()
			const timeout = setTimeout(() => controller.abort(), CONFIG.WEBHOOK_TIMEOUT)

			const response = await fetch(webhook.url, {
				method: 'POST',
				headers,
				body,
				signal: controller.signal,
			})

			clearTimeout(timeout)
			const durationMs = Date.now() - startTime

			store.saveWebhookDelivery({
				id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				webhookId: webhook.id,
				event: payload.event,
				url: webhook.url,
				statusCode: response.status,
				durationMs,
				payload,
				timestamp: new Date().toISOString(),
				success: response.ok,
			})

			if (!response.ok && attempt < CONFIG.MAX_RETRIES) {
				const delay = Math.pow(2, attempt) * 1000
				setTimeout(() => this.sendWithRetry(webhook, payload, attempt + 1), delay)
			}
		} catch (err: any) {
			const durationMs = Date.now() - startTime
			store.saveWebhookDelivery({
				id: `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				webhookId: webhook.id,
				event: payload.event,
				url: webhook.url,
				statusCode: 0,
				durationMs,
				payload: { ...payload, error: err.message },
				timestamp: new Date().toISOString(),
				success: false,
			})

			if (attempt < CONFIG.MAX_RETRIES) {
				const delay = Math.pow(2, attempt) * 1000
				setTimeout(() => this.sendWithRetry(webhook, payload, attempt + 1), delay)
			}
		}
	}
}

export const webhookDispatcher = new WebhookDispatcher()
