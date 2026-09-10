import fs from 'fs'
import path from 'path'
import { CONFIG } from '../config.js'

export interface DeviceRecord {
	id: string
	name: string
	status: 'connecting' | 'scan_qr' | 'connected' | 'disconnected'
	phone?: string
	pushName?: string
	qrCode?: string
	pairingCode?: string
	createdAt: string
	lastSeen?: string
}

export interface WebhookRecord {
	id: string
	url: string
	events: string[]
	secret?: string
	active: boolean
	createdAt: string
}

export interface MessageRecord {
	id: string
	deviceId: string
	to: string
	from?: string
	body?: string
	type: string
	direction: 'inbound' | 'outbound'
	status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
	timestamp: string
}

interface DBData {
	devices: Record<string, DeviceRecord>
	webhooks: Record<string, WebhookRecord>
	messages: MessageRecord[]
}

export class Store {
	private filePath: string
	private data: DBData = {
		devices: {},
		webhooks: {},
		messages: [],
	}

	constructor() {
		if (!fs.existsSync(CONFIG.DATA_DIR)) {
			fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true })
		}
		if (!fs.existsSync(CONFIG.SESSIONS_DIR)) {
			fs.mkdirSync(CONFIG.SESSIONS_DIR, { recursive: true })
		}

		this.filePath = path.join(CONFIG.DATA_DIR, 'db.json')
		this.load()
	}

	private load() {
		try {
			if (fs.existsSync(this.filePath)) {
				const raw = fs.readFileSync(this.filePath, 'utf-8')
				this.data = JSON.parse(raw)
			} else {
				this.save()
			}
		} catch (err) {
			console.error('Failed to load db.json, creating new store', err)
			this.save()
		}
	}

	private save() {
		try {
			const tmpPath = `${this.filePath}.tmp`
			fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8')
			fs.renameSync(tmpPath, this.filePath)
		} catch (err) {
			console.error('Error saving db.json:', err)
		}
	}

	// Device operations
	getDevices(): DeviceRecord[] {
		return Object.values(this.data.devices)
	}

	getDevice(id: string): DeviceRecord | undefined {
		return this.data.devices[id]
	}

	saveDevice(device: DeviceRecord) {
		this.data.devices[device.id] = device
		this.save()
	}

	deleteDevice(id: string) {
		delete this.data.devices[id]
		this.save()
	}

	// Webhook operations
	getWebhooks(): WebhookRecord[] {
		return Object.values(this.data.webhooks)
	}

	saveWebhook(webhook: WebhookRecord) {
		this.data.webhooks[webhook.id] = webhook
		this.save()
	}

	deleteWebhook(id: string) {
		delete this.data.webhooks[id]
		this.save()
	}

	// Message operations
	addMessage(msg: MessageRecord) {
		this.data.messages.unshift(msg)
		// Limit in-memory message history to latest 5000 items
		if (this.data.messages.length > 5000) {
			this.data.messages = this.data.messages.slice(0, 5000)
		}
		this.save()
	}

	getMessages(deviceId?: string, limit = 50): MessageRecord[] {
		if (deviceId) {
			return this.data.messages.filter(m => m.deviceId === deviceId).slice(0, limit)
		}
		return this.data.messages.slice(0, limit)
	}

	updateMessageStatus(id: string, status: MessageRecord['status']) {
		const msg = this.data.messages.find(m => m.id === id)
		if (msg) {
			msg.status = status
			this.save()
		}
	}
}

export const store = new Store()
