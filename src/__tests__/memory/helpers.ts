/**
 * Helpers for memory leak tests.
 * Provides utilities to measure heap, create fake auth states,
 * and detect listener accumulation.
 *
 * IMPORTANT: This file does NOT import any Baileys modules that transitively
 * import WAProto (which uses ESM `import` and breaks Jest).
 * Everything here is self-contained using pure Node.js.
 */
import { randomBytes } from 'crypto'
import { EventEmitter } from 'events'
import { MockWebSocketClient } from './mock-ws'

// ─── Heap Measurement ───────────────────────────────────────

/**
 * Force a full garbage collection (requires --expose-gc flag).
 * Falls back to no-op if GC is not exposed.
 */
export function forceGC() {
	if (typeof global.gc === 'function') {
		global.gc()
	}
}

/** Get current heap usage in MB after forcing GC */
export function getHeapMB(): number {
	forceGC()
	return process.memoryUsage().heapUsed / 1024 / 1024
}

/** Get detailed memory snapshot */
export function getMemorySnapshot() {
	forceGC()
	const mem = process.memoryUsage()
	return {
		heapUsedMB: mem.heapUsed / 1024 / 1024,
		heapTotalMB: mem.heapTotal / 1024 / 1024,
		externalMB: mem.external / 1024 / 1024,
		rssMB: mem.rss / 1024 / 1024,
		arrayBuffersMB: mem.arrayBuffers / 1024 / 1024
	}
}

// ─── Fake Auth State ────────────────────────────────────────

/** Creates a raw fake key pair (32 random bytes each, no real curve ops) */
function fakeKeyPair() {
	return {
		public: randomBytes(32),
		private: randomBytes(32)
	}
}

/** Creates a minimal fake AuthenticationCreds without importing Curve */
export function makeFakeCreds() {
	return {
		noiseKey: fakeKeyPair(),
		pairingEphemeralKeyPair: fakeKeyPair(),
		signedIdentityKey: fakeKeyPair(),
		signedPreKey: {
			keyPair: fakeKeyPair(),
			signature: randomBytes(64),
			keyId: 1
		},
		registrationId: Math.floor(Math.random() * 16383),
		advSecretKey: randomBytes(32).toString('base64'),
		processedHistoryMessages: [],
		nextPreKeyId: 1,
		firstUnuploadedPreKeyId: 1,
		accountSyncCounter: 0,
		accountSettings: {
			unarchiveChats: false
		},
		registered: false,
		pairingCode: undefined,
		lastPropHash: undefined,
		routingInfo: undefined,
		additionalData: undefined
	}
}

/** Creates a fake in-memory key store */
export function makeFakeKeyStore() {
	const store: Record<string, Record<string, any>> = {}
	return {
		get: async (type: string, ids: string[]) => {
			const result: Record<string, any> = {}
			for (const id of ids) {
				result[id] = store[type]?.[id] ?? null
			}
			return result
		},
		set: async (data: Record<string, Record<string, any> | undefined>) => {
			for (const type in data) {
				store[type] = store[type] || {}
				const entries = data[type as keyof typeof data]
				if (entries) {
					for (const id in entries) {
						if (entries[id] === null) {
							delete store[type]![id]
						} else {
							store[type]![id] = entries[id]
						}
					}
				}
			}
		},
		clear: async () => {
			for (const key in store) {
				delete store[key]
			}
		}
	}
}

/** Creates a full fake AuthenticationState */
export function makeFakeAuthState() {
	return {
		creds: makeFakeCreds(),
		keys: makeFakeKeyStore()
	}
}

// ─── Event Emitter Analysis ─────────────────────────────────

/** Count total listeners across all events on a given emitter */
export function countAllListeners(emitter: EventEmitter): number {
	return emitter.eventNames().reduce((total, name) => total + emitter.listenerCount(name), 0)
}

/** Get listener breakdown per event */
export function getListenerBreakdown(emitter: EventEmitter): Record<string, number> {
	const breakdown: Record<string, number> = {}
	for (const name of emitter.eventNames()) {
		breakdown[String(name)] = emitter.listenerCount(name)
	}
	return breakdown
}

// ─── Simulated Event Buffer ─────────────────────────────────

/**
 * Create a lightweight event emitter that mimics the Baileys event buffer.
 * We can't import the real makeEventBuffer because it transitively imports WAProto.
 * This mock reproduces the EXACT same behavior relevant for leak testing:
 * - Acts as an EventEmitter (on, off, removeAllListeners, emit)
 * - Has buffer/flush methods
 * - Maintains an internal historyCache Set (the leak we're testing)
 */
export function makeTestEventBuffer() {
	const ev = new EventEmitter()
	ev.setMaxListeners(0) // mimic Baileys

	const historyCache = new Set<string>()
	let isBuffering = false
	let bufferTimeout: NodeJS.Timeout | null = null

	const buffer = () => {
		isBuffering = true
		if (bufferTimeout) clearTimeout(bufferTimeout)
		bufferTimeout = setTimeout(() => {
			if (isBuffering) flush()
		}, 30_000)
	}

	const flush = () => {
		isBuffering = false
		if (bufferTimeout) {
			clearTimeout(bufferTimeout)
			bufferTimeout = null
		}
		// historyCache is NEVER cleared here (the bug)
		return true
	}

	return Object.assign(ev, {
		buffer,
		flush,
		isBuffering: () => isBuffering,
		/** Expose for testing — the real one is hidden in closure */
		_historyCache: historyCache
	})
}

// ─── Heavy Data Generators ──────────────────────────────────

/** Generate a fake WAMessage-like object with realistic payload size */
export function makeFakeMessage(id: string, chatJid: string) {
	return {
		key: {
			remoteJid: chatJid,
			fromMe: false,
			id
		},
		message: {
			conversation: 'A'.repeat(500) // ~500 bytes payload
		},
		messageTimestamp: Math.floor(Date.now() / 1000),
		pushName: 'Test User',
		status: 2
	}
}

/** Generate N fake messages for a chat */
export function makeFakeMessages(count: number, chatJid: string = '5511999999999@s.whatsapp.net') {
	return Array.from({ length: count }, (_, i) => makeFakeMessage(`MSG_${Date.now()}_${i}`, chatJid))
}

/** Generate a fake chat object */
export function makeFakeChat(id: string) {
	return {
		id,
		conversationTimestamp: Math.floor(Date.now() / 1000),
		unreadCount: 0,
		name: `Chat ${id}`
	}
}

/** Generate N fake contacts */
export function makeFakeContacts(count: number) {
	return Array.from({ length: count }, (_, i) => ({
		id: `551199900${String(i).padStart(4, '0')}@s.whatsapp.net`,
		name: `Contact ${i}`,
		notify: `Notify ${i}`
	}))
}

// ─── CB Event Simulation ────────────────────────────────────

/**
 * List of all CB:* events that socket.ts registers
 * on the WebSocket but does NOT remove in end().
 * These are the prime suspects for listener leaks.
 */
export const LEAKED_WS_EVENTS = [
	'CB:xmlstreamend',
	'CB:iq,type:set,pair-device',
	'CB:iq,,pair-success',
	'CB:success',
	'CB:stream:error',
	'CB:failure',
	'CB:ib,,downgrade_webclient',
	'CB:ib,,offline_preview',
	'CB:ib,,edge_routing',
	'CB:ib,,offline',
	// from messages-recv.ts
	'CB:message',
	'CB:call',
	'CB:receipt',
	'CB:notification',
	'CB:ack,class:message',
	// from chats.ts
	'CB:presence',
	'CB:chatstate',
	'CB:ib,,dirty'
]

/** Events that socket.ts DOES remove in end() */
export const CLEANED_WS_EVENTS = ['close', 'open', 'message']

/**
 * Simulate registering the same CB handlers that Baileys registers
 * to measure accumulation across connection cycles.
 */
export function simulateBaileysWSListeners(ws: MockWebSocketClient) {
	// These simulate what socket.ts does
	for (const event of LEAKED_WS_EVENTS) {
		ws.on(event, () => {})
	}
	// These are cleaned
	for (const event of CLEANED_WS_EVENTS) {
		ws.on(event, () => {})
	}
}

/**
 * Simulate the partial cleanup that end() does
 * (only removes 3 of ~20+ event types)
 */
export function simulateBaileysEndCleanup(ws: MockWebSocketClient) {
	ws.removeAllListeners('close')
	ws.removeAllListeners('open')
	ws.removeAllListeners('message')
}

/**
 * Simulate FULL cleanup (what end() SHOULD do)
 */
export function simulateFullCleanup(ws: MockWebSocketClient) {
	ws.removeAllListeners()
}
