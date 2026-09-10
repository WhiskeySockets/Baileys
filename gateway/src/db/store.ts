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

export interface ChatNote {
	id: string
	author: string
	text: string
	createdAt: string
}

export interface ChatRecord {
	id: string
	deviceId: string
	jid: string
	name?: string
	phone?: string
	unreadCount: number
	owner?: string // Assigned agent name
	labels: string[] // Label IDs or names
	notes: ChatNote[]
	lastMessage?: {
		body?: string
		type: string
		timestamp: string
		direction: 'inbound' | 'outbound'
	}
	updatedAt: string
}

export interface CampaignRecipient {
	phone: string
	status: 'pending' | 'sent' | 'failed'
	error?: string
	sentAt?: string
}

export interface CampaignRecord {
	id: string
	deviceId: string
	name: string
	message: string
	mediaUrl?: string
	mediaType?: 'image' | 'video' | 'audio' | 'document'
	recipients: CampaignRecipient[]
	minDelayMs: number
	maxDelayMs: number
	status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled'
	progress: {
		total: number
		sent: number
		failed: number
	}
	createdAt: string
}

export interface LabelRecord {
	id: string
	deviceId: string
	name: string
	color: string
}

export interface QuickReplyRecord {
	id: string
	deviceId: string
	shortcut: string
	message: string
}

export interface AutoReplyRule {
	id: string
	deviceId: string
	keyword: string
	matchType: 'exact' | 'contains' | 'regex' | 'default'
	reply: string
	active: boolean
}

interface DBData {
	devices: Record<string, DeviceRecord>
	webhooks: Record<string, WebhookRecord>
	messages: MessageRecord[]
	chats: Record<string, ChatRecord>
	campaigns: Record<string, CampaignRecord>
	labels: Record<string, LabelRecord>
	quickReplies: Record<string, QuickReplyRecord>
	autoReplies: Record<string, AutoReplyRule>
}

export class Store {
	private filePath: string
	private data: DBData = {
		devices: {},
		webhooks: {},
		messages: [],
		chats: {},
		campaigns: {},
		labels: {},
		quickReplies: {},
		autoReplies: {},
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
				const parsed = JSON.parse(raw)
				this.data = {
					devices: parsed.devices || {},
					webhooks: parsed.webhooks || {},
					messages: parsed.messages || [],
					chats: parsed.chats || {},
					campaigns: parsed.campaigns || {},
					labels: parsed.labels || {},
					quickReplies: parsed.quickReplies || {},
					autoReplies: parsed.autoReplies || {},
				}
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

	// Devices
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

	// Webhooks
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

	// Messages
	addMessage(msg: MessageRecord) {
		this.data.messages.unshift(msg)
		if (this.data.messages.length > 5000) {
			this.data.messages = this.data.messages.slice(0, 5000)
		}

		// Update or create ChatRecord
		const chatJid = msg.direction === 'outbound' ? msg.to : (msg.from || msg.to)
		const chatId = `${msg.deviceId}_${chatJid}`
		let chat = this.data.chats[chatId]
		if (!chat) {
			chat = {
				id: chatId,
				deviceId: msg.deviceId,
				jid: chatJid,
				phone: chatJid.split('@')[0],
				unreadCount: msg.direction === 'inbound' ? 1 : 0,
				labels: [],
				notes: [],
				updatedAt: msg.timestamp,
			}
		} else {
			if (msg.direction === 'inbound') {
				chat.unreadCount += 1
			}
			chat.updatedAt = msg.timestamp
		}

		chat.lastMessage = {
			body: msg.body,
			type: msg.type,
			timestamp: msg.timestamp,
			direction: msg.direction,
		}

		this.data.chats[chatId] = chat
		this.save()
	}

	getMessages(deviceId?: string, limit = 50, chatJid?: string): MessageRecord[] {
		let list = this.data.messages
		if (deviceId) {
			list = list.filter(m => m.deviceId === deviceId)
		}
		if (chatJid) {
			list = list.filter(m => m.to === chatJid || m.from === chatJid)
		}
		return list.slice(0, limit)
	}

	updateMessageStatus(id: string, status: MessageRecord['status']) {
		const msg = this.data.messages.find(m => m.id === id)
		if (msg) {
			msg.status = status
			this.save()
		}
	}

	// Chats
	getChats(deviceId?: string): ChatRecord[] {
		let list = Object.values(this.data.chats)
		if (deviceId) {
			list = list.filter(c => c.deviceId === deviceId)
		}
		return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
	}

	getChat(deviceId: string, chatJid: string): ChatRecord | undefined {
		const id = `${deviceId}_${chatJid}`
		return this.data.chats[id]
	}

	saveChat(chat: ChatRecord) {
		this.data.chats[chat.id] = chat
		this.save()
	}

	// Campaigns
	getCampaigns(deviceId?: string): CampaignRecord[] {
		let list = Object.values(this.data.campaigns)
		if (deviceId) {
			list = list.filter(c => c.deviceId === deviceId)
		}
		return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	}

	getCampaign(id: string): CampaignRecord | undefined {
		return this.data.campaigns[id]
	}

	saveCampaign(campaign: CampaignRecord) {
		this.data.campaigns[campaign.id] = campaign
		this.save()
	}

	deleteCampaign(id: string) {
		delete this.data.campaigns[id]
		this.save()
	}

	// Labels
	getLabels(deviceId?: string): LabelRecord[] {
		let list = Object.values(this.data.labels)
		if (deviceId) {
			list = list.filter(l => l.deviceId === deviceId)
		}
		return list
	}

	saveLabel(label: LabelRecord) {
		this.data.labels[label.id] = label
		this.save()
	}

	deleteLabel(id: string) {
		delete this.data.labels[id]
		this.save()
	}

	// Quick Replies
	getQuickReplies(deviceId?: string): QuickReplyRecord[] {
		let list = Object.values(this.data.quickReplies)
		if (deviceId) {
			list = list.filter(q => q.deviceId === deviceId)
		}
		return list
	}

	saveQuickReply(qr: QuickReplyRecord) {
		this.data.quickReplies[qr.id] = qr
		this.save()
	}

	deleteQuickReply(id: string) {
		delete this.data.quickReplies[id]
		this.save()
	}

	// Auto Replies
	getAutoReplies(deviceId?: string): AutoReplyRule[] {
		let list = Object.values(this.data.autoReplies)
		if (deviceId) {
			list = list.filter(a => a.deviceId === deviceId)
		}
		return list
	}

	saveAutoReply(rule: AutoReplyRule) {
		this.data.autoReplies[rule.id] = rule
		this.save()
	}

	deleteAutoReply(id: string) {
		delete this.data.autoReplies[id]
		this.save()
	}
}

export const store = new Store()
