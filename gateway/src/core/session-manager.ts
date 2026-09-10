import path from 'path'
import fs from 'fs'
import QRCode from 'qrcode'
import NodeCache from '@cacheable/node-cache'
import { Boom } from '@hapi/boom'
import P from 'pino'

import makeWASocket, {
	DisconnectReason,
	fetchLatestBaileysVersion,
	makeCacheableSignalKeyStore,
	useMultiFileAuthState,
	WAMessage,
	proto,
	type AnyMessageContent,
	jidNormalizedUser,
} from '../../../lib/index.js'

import { CONFIG } from '../config.js'
import { store, DeviceRecord, MessageRecord } from '../db/store.js'
import { webhookDispatcher } from './webhook-dispatcher.js'
import { autoResponder } from './auto-responder.js'

export class SessionManager {
	private sockets = new Map<string, ReturnType<typeof makeWASocket>>()
	private retryCaches = new Map<string, NodeCache>()
	private qrCodes = new Map<string, { raw: string; dataUrl: string }>()
	private pairingCodes = new Map<string, string>()
	private logger = P({ level: 'warn' })

	async init() {
		const devices = store.getDevices()
		for (const device of devices) {
			if (device.status === 'connected' || device.status === 'connecting') {
				console.log(`[SessionManager] Restoring session for device: ${device.id} (${device.name})`)
				this.startSession(device.id, device.name).catch(err => {
					console.error(`[SessionManager] Failed to restore session ${device.id}:`, err)
				})
			}
		}
	}

	getSession(id: string) {
		return this.sockets.get(id)
	}

	getQrCode(id: string) {
		return this.qrCodes.get(id)
	}

	getPairingCode(id: string) {
		return this.pairingCodes.get(id)
	}

	async createDevice(id: string, name: string) {
		const existing = store.getDevice(id)
		if (existing && this.sockets.has(id)) {
			return existing
		}

		const device: DeviceRecord = {
			id,
			name,
			status: 'connecting',
			createdAt: new Date().toISOString(),
		}

		store.saveDevice(device)
		await this.startSession(id, name)
		return store.getDevice(id)
	}

	async requestPairingCode(id: string, phoneNumber: string): Promise<string> {
		const sock = this.sockets.get(id)
		if (!sock) {
			throw new Error(`Device ${id} is not initialized. Please create or start it first.`)
		}

		const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
		if (!cleanPhone) {
			throw new Error('Invalid phone number provided for pairing code')
		}

		const code = await sock.requestPairingCode(cleanPhone)
		this.pairingCodes.set(id, code)

		const device = store.getDevice(id)
		if (device) {
			device.pairingCode = code
			store.saveDevice(device)
		}

		webhookDispatcher.dispatch('device:pairing_code', {
			deviceId: id,
			pairingCode: code,
			phoneNumber: cleanPhone,
		})

		return code
	}

	async startSession(id: string, name: string) {
		const sessionPath = path.join(CONFIG.SESSIONS_DIR, id)
		const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
		const { version } = await fetchLatestBaileysVersion()

		let retryCache = this.retryCaches.get(id)
		if (!retryCache) {
			retryCache = new NodeCache()
			this.retryCaches.set(id, retryCache)
		}

		const sock = makeWASocket({
			version,
			logger: this.logger,
			auth: {
				creds: state.creds,
				keys: makeCacheableSignalKeyStore(state.keys, this.logger),
			},
			msgRetryCounterCache: retryCache as any,
			generateHighQualityLinkPreview: true,
			printQRInTerminal: false,
		})

		this.sockets.set(id, sock)

		sock.ev.process(async events => {
			if (events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect, qr } = update

				if (qr) {
					try {
						const dataUrl = await QRCode.toDataURL(qr)
						this.qrCodes.set(id, { raw: qr, dataUrl })

						const device = store.getDevice(id)
						if (device) {
							device.status = 'scan_qr'
							device.qrCode = dataUrl
							store.saveDevice(device)
						}

						webhookDispatcher.dispatch('device:status', {
							deviceId: id,
							status: 'scan_qr',
							qrDataUrl: dataUrl,
						})
					} catch (e) {
						console.error(`[QR Error] Failed to generate QR for ${id}`, e)
					}
				}

				if (connection === 'open') {
					this.qrCodes.delete(id)
					this.pairingCodes.delete(id)

					const user = sock.user
					const phone = user?.id ? user.id.split(':')[0] : undefined

					const device = store.getDevice(id) || {
						id,
						name,
						status: 'connected',
						createdAt: new Date().toISOString(),
					}

					device.status = 'connected'
					device.phone = phone
					device.pushName = user?.name
					device.qrCode = undefined
					device.pairingCode = undefined
					device.lastSeen = new Date().toISOString()
					store.saveDevice(device)

					console.log(`[SessionManager] Device ${id} connected as ${phone} (${user?.name})`)

					webhookDispatcher.dispatch('device:status', {
						deviceId: id,
						status: 'connected',
						phone,
						pushName: user?.name,
					})
				}

				if (connection === 'close') {
					const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
					const shouldReconnect = statusCode !== DisconnectReason.loggedOut

					console.log(`[SessionManager] Connection closed for ${id}, statusCode: ${statusCode}, shouldReconnect: ${shouldReconnect}`)

					const device = store.getDevice(id)
					if (device) {
						device.status = shouldReconnect ? 'connecting' : 'disconnected'
						device.qrCode = undefined
						store.saveDevice(device)
					}

					webhookDispatcher.dispatch('device:status', {
						deviceId: id,
						status: device?.status || 'disconnected',
						reason: statusCode,
					})

					if (shouldReconnect) {
						setTimeout(() => this.startSession(id, name), 3000)
					} else {
						this.sockets.delete(id)
						try {
							fs.rmSync(sessionPath, { recursive: true, force: true })
						} catch (e) {}
					}
				}
			}

			if (events['creds.update']) {
				await saveCreds()
			}

			if (events['messages.upsert']) {
				const { messages, type } = events['messages.upsert']
				for (const msg of messages) {
					if (!msg.message) continue

					const jid = msg.key.remoteJid
					if (!jid) continue

					const isFromMe = msg.key.fromMe ?? false
					const sender = isFromMe ? sock.user?.id : (msg.key.participant || jid)
					const messageId = msg.key.id || `${Date.now()}`

					const body =
						msg.message.conversation ||
						msg.message.extendedTextMessage?.text ||
						msg.message.imageMessage?.caption ||
						msg.message.videoMessage?.caption ||
						''

					let msgType = 'text'
					if (msg.message.imageMessage) msgType = 'image'
					else if (msg.message.videoMessage) msgType = 'video'
					else if (msg.message.audioMessage) msgType = 'audio'
					else if (msg.message.documentMessage) msgType = 'document'
					else if (msg.message.locationMessage) msgType = 'location'
					else if (msg.message.contactMessage) msgType = 'contact'

					const record: MessageRecord = {
						id: messageId,
						deviceId: id,
						to: isFromMe ? jid : (sock.user?.id || ''),
						from: sender,
						body,
						type: msgType,
						direction: isFromMe ? 'outbound' : 'inbound',
						status: isFromMe ? 'sent' : 'delivered',
						timestamp: new Date((msg.messageTimestamp as number) * 1000 || Date.now()).toISOString(),
					}

					store.addMessage(record)

					if (!isFromMe) {
						webhookDispatcher.dispatch('message:in:new', {
							deviceId: id,
							message: record,
							raw: msg,
						})

						if (body) {
							autoResponder.handleInbound(id, jid, body).catch(err => {
								console.error('[AutoResponder Error]', err)
							})
						}
					}
				}
			}

			if (events['messages.update']) {
				for (const update of events['messages.update']) {
					const id = update.key.id
					if (!id) continue

					let newStatus: MessageRecord['status'] | undefined
					if (update.update.status === proto.WebMessageInfo.Status.DELIVERY_ACK) {
						newStatus = 'delivered'
					} else if (update.update.status === proto.WebMessageInfo.Status.READ) {
						newStatus = 'read'
					}

					if (newStatus) {
						store.updateMessageStatus(id, newStatus)
						webhookDispatcher.dispatch('message:out:status', {
							messageId: id,
							status: newStatus,
							key: update.key,
						})
					}
				}
			}
		})
	}

	async sendMessage(deviceId: string, to: string, content: AnyMessageContent) {
		const sock = this.sockets.get(deviceId)
		if (!sock) {
			throw new Error(`Device ${deviceId} is not connected.`)
		}

		let recipientJid = to.trim()
		if (!recipientJid.includes('@')) {
			const clean = recipientJid.replace(/[^0-9]/g, '')
			recipientJid = `${clean}@s.whatsapp.net`
		}

		const result = await sock.sendMessage(recipientJid, content)
		const messageId = result?.key.id || `msg_${Date.now()}`

		const record: MessageRecord = {
			id: messageId,
			deviceId,
			to: recipientJid,
			from: sock.user?.id || '',
			body: typeof content === 'object' && 'text' in content ? (content as any).text : undefined,
			type: typeof content === 'object' && 'image' in content ? 'image' : 'text',
			direction: 'outbound',
			status: 'sent',
			timestamp: new Date().toISOString(),
		}

		store.addMessage(record)

		webhookDispatcher.dispatch('message:out:new', {
			deviceId,
			message: record,
			raw: result,
		})

		return { messageId, result, record }
	}

	async deleteSession(id: string) {
		const sock = this.sockets.get(id)
		if (sock) {
			try {
				await sock.logout()
			} catch (e) {}
			this.sockets.delete(id)
		}

		this.qrCodes.delete(id)
		this.pairingCodes.delete(id)
		store.deleteDevice(id)

		const sessionPath = path.join(CONFIG.SESSIONS_DIR, id)
		try {
			fs.rmSync(sessionPath, { recursive: true, force: true })
		} catch (e) {}

		webhookDispatcher.dispatch('device:status', {
			deviceId: id,
			status: 'deleted',
		})
	}
}

export const sessionManager = new SessionManager()
