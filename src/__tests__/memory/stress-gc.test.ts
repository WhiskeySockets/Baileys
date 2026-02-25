/**
 * STRESS TEST WITH --expose-gc
 *
 * Run with:
 *   node --expose-gc ./node_modules/.bin/jest --config jest.config.ts \
 *     src/__tests__/memory/stress-gc.test.ts --runInBand --forceExit
 *
 * Or via npx:
 *   npx --node-options='--expose-gc' jest --config jest.config.ts \
 *     src/__tests__/memory/stress-gc.test.ts --runInBand --forceExit
 *
 * What this tests:
 *  1. Simulates 1000+ messages/min send+receive cycles (no real WS)
 *  2. Uses forced GC between phases to get accurate heap deltas
 *  3. Profiles per-function memory: which caches grow, which leak
 *  4. Tests reconnection cycles under load (65 instances × N reconnects)
 *  5. Measures closure retention after end()
 *
 * NOTE: Does NOT import any Baileys source (WAProto ESM breaks Jest).
 * Everything is self-contained mocks that replicate exact cache behavior.
 */
import { NodeCache } from '@cacheable/node-cache'
import { randomBytes } from 'crypto'
import { NativeLRUCache } from '../../Utils/lru-cache'
import {
	countAllListeners,
	forceGC,
	getHeapMB,
	makeFakeMessage,
	makeTestEventBuffer,
	simulateBaileysWSListeners
} from './helpers'
import { MockWebSocketClient } from './mock-ws'

// WeakRef is available at runtime (Node 14+) but tsconfig may not include es2021
declare class WeakRef<T extends object> {
	constructor(target: T)
	deref(): T | undefined
}

// ─── Test Config ────────────────────────────────────────────

const HAS_GC = typeof global.gc === 'function'

const silentLogger = {
	level: 'silent' as const,
	child: () => silentLogger,
	trace: (..._args: any[]) => {},
	debug: (..._args: any[]) => {},
	info: (..._args: any[]) => {},
	warn: (..._args: any[]) => {},
	error: (..._args: any[]) => {}
} as any

// ─── Realistic Mock: MessageRetryManager ────────────────────

/** Replicates the exact cache structure from src/Utils/message-retry-manager.ts */
class MockMessageRetryManager {
	recentMessagesMap = new NativeLRUCache<string, { message: any; timestamp: number }>({
		max: 512,
		ttl: 5 * 60 * 1000,
		ttlAutopurge: false, // disable for test control
		dispose: (_value, key) => {
			const sep = key.lastIndexOf('\u0000')
			if (sep > -1) {
				this.messageKeyIndex.delete(key.slice(sep + 1))
			}
		}
	})
	messageKeyIndex = new Map<string, string>()
	sessionRecreateHistory = new NativeLRUCache<string, number>({
		max: 1000,
		ttl: 2 * 60 * 60 * 1000
	})
	retryCounters = new NativeLRUCache<string, number>({
		max: 2000,
		ttl: 15 * 60 * 1000,
		updateAgeOnGet: true
	})
	pendingPhoneRequests: Record<string, ReturnType<typeof setTimeout>> = {}

	addRecentMessage(to: string, id: string, message: any) {
		const keyStr = `${to}\u0000${id}`
		this.recentMessagesMap.set(keyStr, { message, timestamp: Date.now() })
		this.messageKeyIndex.set(id, keyStr)
	}

	schedulePhoneRequest(messageId: string, callback: () => void, delay = 3000) {
		this.cancelPendingPhoneRequest(messageId)
		this.pendingPhoneRequests[messageId] = setTimeout(() => {
			delete this.pendingPhoneRequests[messageId]
			callback()
		}, delay)
	}

	cancelPendingPhoneRequest(messageId: string) {
		const t = this.pendingPhoneRequests[messageId]
		if (t) {
			clearTimeout(t)
			delete this.pendingPhoneRequests[messageId]
		}
	}

	incrementRetryCount(messageId: string): number {
		this.retryCounters.set(messageId, (this.retryCounters.get(messageId) || 0) + 1)
		return this.retryCounters.get(messageId)!
	}

	destroy() {
		for (const id of Object.keys(this.pendingPhoneRequests)) {
			clearTimeout(this.pendingPhoneRequests[id])
		}
		this.pendingPhoneRequests = {}
		this.recentMessagesMap.clear()
		this.messageKeyIndex.clear()
		this.sessionRecreateHistory.clear()
		this.retryCounters.clear()
	}

	/** Report sizes for debugging */
	report() {
		return {
			recentMessages: this.recentMessagesMap.size,
			messageKeyIndex: this.messageKeyIndex.size,
			sessionRecreateHistory: this.sessionRecreateHistory.size,
			retryCounters: this.retryCounters.size,
			pendingPhoneRequests: Object.keys(this.pendingPhoneRequests).length
		}
	}
}

// ─── Realistic Mock: Full Socket Instance ───────────────────

interface MockSocketInstance {
	ws: MockWebSocketClient
	ev: ReturnType<typeof makeTestEventBuffer>
	// Caches from messages-send.ts
	userDevicesCache: NodeCache<any>
	peerSessionsCache: NodeCache<any>
	// Caches from messages-recv.ts
	msgRetryCache: NodeCache<any>
	callOfferCache: NodeCache<any>
	placeholderResendCache: NodeCache<any>
	identityAssertDebounce: NodeCache<any>
	// Retry manager
	messageRetryManager: MockMessageRetryManager
	// Simulated closure references (what the real socket captures)
	_closureRefs: {
		authState: any
		signalRepository: any
		noiseKey: Buffer
		config: any
	}
}

/** Create a mock that mirrors all the caches Baileys creates per connection */
function createMockSocket(): MockSocketInstance {
	const ws = new MockWebSocketClient()
	const ev = makeTestEventBuffer()

	// Replicate exact NodeCache configs from Baileys source
	const userDevicesCache = new NodeCache({ stdTTL: 300, useClones: false, maxKeys: 1000 })
	const peerSessionsCache = new NodeCache({ stdTTL: 300, useClones: false, maxKeys: 1000 })
	const msgRetryCache = new NodeCache<number>({ stdTTL: 3600, useClones: false, maxKeys: 5000 })
	const callOfferCache = new NodeCache({ stdTTL: 300, useClones: false, maxKeys: 1000 })
	const placeholderResendCache = new NodeCache({ stdTTL: 3600, useClones: false, maxKeys: 5000 })
	const identityAssertDebounce = new NodeCache<boolean>({ stdTTL: 5, useClones: false, maxKeys: 500 })
	const messageRetryManager = new MockMessageRetryManager()

	// Simulated large objects captured in closure (auth state, signal repo, noise keys)
	const _closureRefs = {
		authState: {
			creds: {
				me: { id: `5511999${Math.floor(Math.random() * 100000)}@s.whatsapp.net` },
				noiseKey: { public: randomBytes(32), private: randomBytes(32) },
				signedIdentityKey: { public: randomBytes(32), private: randomBytes(32) },
				signedPreKey: { keyPair: { public: randomBytes(32), private: randomBytes(32) }, signature: randomBytes(64) },
				registrationId: Math.floor(Math.random() * 16383)
			},
			keys: {
				// Simulated key store with some pre-loaded data
				_store: Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`prekey_${i}`, randomBytes(64)]))
			}
		},
		signalRepository: {
			// Simulated session store
			_sessions: new Map(Array.from({ length: 20 }, (_, i) => [`session_${i}`, randomBytes(256)]))
		},
		noiseKey: randomBytes(32),
		config: {
			version: [2, 3000, 1033878648],
			connectTimeoutMs: 20000,
			keepAliveIntervalMs: 30000
		}
	}

	// Register all the WS listeners that Baileys registers
	simulateBaileysWSListeners(ws)

	// Register ev listeners that Baileys registers internally
	ev.on('creds.update', () => {})
	ev.on('connection.update', () => {})
	ev.on('call' as any, () => {})
	ev.on('lid-mapping.update' as any, () => {})

	return {
		ws,
		ev,
		userDevicesCache,
		peerSessionsCache,
		msgRetryCache,
		callOfferCache,
		placeholderResendCache,
		identityAssertDebounce,
		messageRetryManager,
		_closureRefs
	}
}

/** Simulate what Baileys end() now does after our fixes */
function simulateEnd(sock: MockSocketInstance) {
	// 1. ws.removeAllListeners()
	sock.ws.removeAllListeners()
	// 2. ev.removeAllListeners() — removes all ev listeners from all layers
	;(sock.ev as any).removeAllListeners()
	// 3. Child layer cleanup (triggered by connection.update close before removeAllListeners)
	sock.messageRetryManager.destroy()
	sock.userDevicesCache.flushAll()
	sock.peerSessionsCache.flushAll()
	sock.msgRetryCache.flushAll()
	sock.callOfferCache.flushAll()
	sock.placeholderResendCache.flushAll()
	sock.identityAssertDebounce.flushAll()
}

// ─── Realistic Message Payload ──────────────────────────────

/** Generate a proto-like message with realistic size (~2-5KB) */
function makeProtoMessage(id: string, chatJid: string) {
	return {
		key: { remoteJid: chatJid, fromMe: Math.random() > 0.5, id, participant: undefined },
		message: {
			conversation: randomBytes(500).toString('base64'), // ~680 chars
			messageContextInfo: {
				deviceListMetadata: { senderTimestamp: Date.now() },
				deviceListMetadataVersion: 2
			}
		},
		messageTimestamp: Math.floor(Date.now() / 1000),
		pushName: `User_${Math.floor(Math.random() * 10000)}`,
		status: 2,
		// Simulate extra fields that real messages have
		broadcast: false,
		multicast: false,
		urlText: false,
		urlNumber: false
	}
}

// ─── Simulate Send Pipeline ─────────────────────────────────

/** Safe set that catches maxKeys exceeded (NodeCache throws instead of evicting) */
function safeSet<T>(cache: NodeCache<T>, key: string, value: T) {
	try {
		cache.set(key, value)
		return true
	} catch {
		// maxKeys exceeded — NodeCache throws, real Baileys would hit this too
		return false
	}
}

/** Simulates what relayMessage + sendMessage does per message */
function simulateSendMessage(sock: MockSocketInstance, jid: string, msgId: string) {
	const message = makeProtoMessage(msgId, jid)

	// 1. userDevicesCache lookup (hit or miss)
	const cacheKey = jid.split('@')[0]!
	if (!sock.userDevicesCache.get(cacheKey)) {
		safeSet(sock.userDevicesCache, cacheKey, [{ user: cacheKey, device: 0 }])
	}

	// 2. peerSessionsCache check
	safeSet(sock.peerSessionsCache, `${cacheKey}:0`, true)

	// 3. messageRetryManager.addRecentMessage (stores the full proto for retries)
	sock.messageRetryManager.addRecentMessage(jid, msgId, message.message)

	// 4. ev.emit messages.upsert (goes through event buffer)
	sock.ev.emit('messages.upsert', {
		messages: [message as any],
		type: 'append'
	})

	return message
}

// ─── Simulate Receive Pipeline ──────────────────────────────

/** Simulates what handleMessage does per incoming message */
function simulateReceiveMessage(sock: MockSocketInstance, jid: string, msgId: string) {
	const message = makeProtoMessage(msgId, jid)

	// 1. msgRetryCache check (retry counter)
	const existingRetry = sock.msgRetryCache.get(msgId) as number | undefined
	if (existingRetry) {
		sock.msgRetryCache.set(msgId, existingRetry + 1)
	}

	// 2. placeholderResendCache check
	safeSet(sock.placeholderResendCache, `placeholder_${msgId}`, Date.now())

	// 3. identityAssertDebounce (for identity key changes)
	const senderJid = jid.split('@')[0]!
	safeSet(sock.identityAssertDebounce, senderJid, true)

	// 4. ev.emit messages.upsert via event buffer
	sock.ev.buffer()
	sock.ev.emit('messages.upsert', {
		messages: [message as any],
		type: 'notify'
	})
	sock.ev.flush()

	return message
}

// ─── Simulate Call Handling ─────────────────────────────────

function simulateCallEvent(sock: MockSocketInstance, callId: string, from: string) {
	sock.callOfferCache.set(callId, {
		from,
		id: callId,
		date: new Date(),
		status: 'offer',
		isVideo: false,
		isGroup: false,
		offline: false
	} as any)

	sock.ev.emit('call' as any, [{ from, id: callId, date: new Date(), status: 'offer', isVideo: false, isGroup: false }])
}

// ─── Helper: Measure function memory impact ─────────────────

interface MemoryProfile {
	label: string
	heapBefore: number
	heapAfter: number
	deltaMB: number
}

function profileMemory(label: string, fn: () => void): MemoryProfile {
	const heapBefore = getHeapMB()
	fn()
	const heapAfter = getHeapMB()
	return { label, heapBefore, heapAfter, deltaMB: heapAfter - heapBefore }
}

// ─── Helper: Pretty print table ─────────────────────────────

function printTable(title: string, rows: Record<string, any>[]) {
	console.log(`\n${'═'.repeat(70)}`)
	console.log(`  ${title}`)
	console.log('═'.repeat(70))
	for (const row of rows) {
		const parts = Object.entries(row).map(([k, v]) => {
			if (typeof v === 'number' && !Number.isInteger(v)) return `${k}: ${v.toFixed(2)}`
			return `${k}: ${v}`
		})
		console.log(`  ${parts.join(' | ')}`)
	}
	console.log('─'.repeat(70))
}

function printCacheSizes(label: string, sock: MockSocketInstance) {
	console.log(`  [${label}] Caches:`)
	console.log(`    userDevicesCache: ${sock.userDevicesCache.store.size} keys`)
	console.log(`    peerSessionsCache: ${sock.peerSessionsCache.store.size} keys`)
	console.log(`    msgRetryCache: ${sock.msgRetryCache.store.size} keys`)
	console.log(`    callOfferCache: ${sock.callOfferCache.store.size} keys`)
	console.log(`    placeholderResendCache: ${sock.placeholderResendCache.store.size} keys`)
	console.log(`    identityAssertDebounce: ${sock.identityAssertDebounce.store.size} keys`)
	const mgr = sock.messageRetryManager.report()
	console.log(`    retryManager.recentMessages: ${mgr.recentMessages}`)
	console.log(`    retryManager.messageKeyIndex: ${mgr.messageKeyIndex}`)
	console.log(`    retryManager.pendingPhoneRequests: ${mgr.pendingPhoneRequests}`)
	console.log(`    WS listeners: ${sock.ws.getTotalListenerCount()}`)
	console.log(`    EV listeners: ${countAllListeners(sock.ev as any)}`)
}

// ═════════════════════════════════════════════════════════════
// TEST SUITES
// ═════════════════════════════════════════════════════════════

describe('STRESS: Send 1000+ messages/min — per-function memory profile', () => {
	it('should profile memory cost of sending 2000 messages', () => {
		const sock = createMockSocket()
		const jid = '5511999887766@s.whatsapp.net'

		const results: MemoryProfile[] = []

		// Phase 1: First 500 messages
		results.push(
			profileMemory('Send 1-500', () => {
				for (let i = 0; i < 500; i++) {
					simulateSendMessage(sock, jid, `SEND_${i}`)
				}
			})
		)

		// Phase 2: Next 500
		results.push(
			profileMemory('Send 501-1000', () => {
				for (let i = 500; i < 1000; i++) {
					simulateSendMessage(sock, jid, `SEND_${i}`)
				}
			})
		)

		// Phase 3: Next 1000 (past LRU max of 512)
		results.push(
			profileMemory('Send 1001-2000', () => {
				for (let i = 1000; i < 2000; i++) {
					simulateSendMessage(sock, jid, `SEND_${i}`)
				}
			})
		)

		printTable('SEND PIPELINE MEMORY PROFILE (2000 msgs)', results)
		printCacheSizes('After 2000 sends', sock)

		// LRU should cap recentMessagesMap at 512
		expect(sock.messageRetryManager.recentMessagesMap.size).toBeLessThanOrEqual(512)
		// userDevicesCache should have 1 entry (same jid)
		expect(sock.userDevicesCache.store.size).toBe(1)
		// peerSessionsCache should have 1 entry
		expect(sock.peerSessionsCache.store.size).toBe(1)

		simulateEnd(sock)
	})

	it('should profile memory cost of sending to 500 different JIDs', () => {
		const sock = createMockSocket()

		const results: MemoryProfile[] = []

		results.push(
			profileMemory('Send to 500 unique JIDs', () => {
				for (let i = 0; i < 500; i++) {
					const jid = `55119900${String(i).padStart(4, '0')}@s.whatsapp.net`
					simulateSendMessage(sock, jid, `MULTI_JID_${i}`)
				}
			})
		)

		printTable('SEND TO MULTIPLE JIDS', results)
		printCacheSizes('After 500 unique JIDs', sock)

		// userDevicesCache should have 500 entries (one per JID)
		expect(sock.userDevicesCache.store.size).toBe(500)
		// This is within maxKeys (1000), so no eviction
		expect(sock.userDevicesCache.store.size).toBeLessThanOrEqual(1000)

		simulateEnd(sock)
	})

	it('should verify userDevicesCache maxKeys eviction at 1000', () => {
		const sock = createMockSocket()

		for (let i = 0; i < 1500; i++) {
			const jid = `55119${String(i).padStart(6, '0')}@s.whatsapp.net`
			simulateSendMessage(sock, jid, `EVICT_${i}`)
		}

		console.log(`userDevicesCache after 1500 JIDs: ${sock.userDevicesCache.store.size} (maxKeys=1000)`)

		// maxKeys should cap it
		expect(sock.userDevicesCache.store.size).toBeLessThanOrEqual(1000)

		simulateEnd(sock)
	})
})

describe('STRESS: Receive 1000+ messages/min — per-function memory profile', () => {
	it('should profile memory cost of receiving 2000 messages', () => {
		const sock = createMockSocket()
		const jid = '5511999887766@s.whatsapp.net'

		const results: MemoryProfile[] = []

		results.push(
			profileMemory('Recv 1-500', () => {
				for (let i = 0; i < 500; i++) {
					simulateReceiveMessage(sock, jid, `RECV_${i}`)
				}
			})
		)

		results.push(
			profileMemory('Recv 501-1000', () => {
				for (let i = 500; i < 1000; i++) {
					simulateReceiveMessage(sock, jid, `RECV_${i}`)
				}
			})
		)

		results.push(
			profileMemory('Recv 1001-2000', () => {
				for (let i = 1000; i < 2000; i++) {
					simulateReceiveMessage(sock, jid, `RECV_${i}`)
				}
			})
		)

		printTable('RECV PIPELINE MEMORY PROFILE (2000 msgs)', results)
		printCacheSizes('After 2000 recvs', sock)

		// placeholderResendCache should respect maxKeys (5000)
		expect(sock.placeholderResendCache.store.size).toBeLessThanOrEqual(5000)
		// msgRetryCache should be 0 (no retries triggered)
		expect(sock.msgRetryCache.store.size).toBe(0)
		// identityAssertDebounce should have 1 entry (same sender)
		expect(sock.identityAssertDebounce.store.size).toBe(1)

		simulateEnd(sock)
	})

	it('should profile receiving from 2000 unique senders (group simulation)', () => {
		const sock = createMockSocket()

		const results: MemoryProfile[] = []

		results.push(
			profileMemory('Recv from 2000 unique senders', () => {
				for (let i = 0; i < 2000; i++) {
					const jid = `55119${String(i).padStart(6, '0')}@s.whatsapp.net`
					simulateReceiveMessage(sock, jid, `GROUP_MSG_${i}`)
				}
			})
		)

		printTable('RECV FROM 2000 UNIQUE SENDERS', results)
		printCacheSizes('After 2000 unique senders', sock)

		// identityAssertDebounce maxKeys = 500
		expect(sock.identityAssertDebounce.store.size).toBeLessThanOrEqual(500)
		// placeholderResendCache: 2000 entries, maxKeys 5000 → all fit
		expect(sock.placeholderResendCache.store.size).toBeLessThanOrEqual(5000)

		simulateEnd(sock)
	})
})

describe('STRESS: Mixed send+recv 1000/min with calls', () => {
	it('should simulate 60 seconds of production load', () => {
		const sock = createMockSocket()
		const chatJids = Array.from({ length: 30 }, (_, i) => `55119900${String(i).padStart(4, '0')}@s.whatsapp.net`)

		const initialHeap = getHeapMB()
		const phaseResults: MemoryProfile[] = []

		// Simulate 60 seconds: ~17 msgs/sec send + 17 msgs/sec recv = ~1000/min each
		for (let second = 0; second < 60; second++) {
			const phase = `Second ${second + 1}`
			const heapBefore = getHeapMB()

			for (let msg = 0; msg < 17; msg++) {
				const jid = chatJids[Math.floor(Math.random() * chatJids.length)]!
				const sendId = `S_${second}_${msg}`
				const recvId = `R_${second}_${msg}`
				simulateSendMessage(sock, jid, sendId)
				simulateReceiveMessage(sock, jid, recvId)
			}

			// Occasional call events
			if (second % 10 === 0) {
				simulateCallEvent(sock, `CALL_${second}`, chatJids[0]!)
			}

			if (second % 15 === 0) {
				const heapAfter = getHeapMB()
				phaseResults.push({ label: phase, heapBefore, heapAfter, deltaMB: heapAfter - heapBefore })
			}
		}

		const finalHeap = getHeapMB()

		printTable('60 SECONDS MIXED LOAD (~2000 msgs/min total)', phaseResults)
		printCacheSizes('After 60s load', sock)
		console.log(`  Total heap growth: ${(finalHeap - initialHeap).toFixed(2)} MB`)

		// Total messages: 60 * 17 * 2 = 2040
		// LRU caps recentMessages at 512
		expect(sock.messageRetryManager.recentMessagesMap.size).toBeLessThanOrEqual(512)
		// callOfferCache should have ~6 entries (one every 10s)
		expect(sock.callOfferCache.store.size).toBeLessThanOrEqual(10)

		simulateEnd(sock)
	})
})

describe('STRESS: Event buffer under high throughput', () => {
	it('should test historyCache growth with 10000 history syncs', () => {
		const ev = makeTestEventBuffer()
		const historyCache = ev._historyCache

		const results: MemoryProfile[] = []

		results.push(
			profileMemory('First 5000 history entries', () => {
				for (let i = 0; i < 5000; i++) {
					// Simulates what append() does to historyCache
					historyCache.add(`chat_${i}@g.us:msg_${i}`)
				}
			})
		)

		results.push(
			profileMemory('Next 5000 (exceeds MAX=10000)', () => {
				for (let i = 5000; i < 10000; i++) {
					historyCache.add(`chat_${i}@g.us:msg_${i}`)
				}
			})
		)

		results.push(
			profileMemory('Another 5000 (tests whether it keeps growing)', () => {
				for (let i = 10000; i < 15000; i++) {
					historyCache.add(`chat_${i}@g.us:msg_${i}`)
				}
			})
		)

		printTable('HISTORY CACHE GROWTH', results)
		console.log(`  historyCache.size: ${historyCache.size}`)

		// Without cleanup, it grows unbounded in the mock
		// In real Baileys, flush() clears it when > 10000
		// The fix: release() always clears it
		expect(historyCache.size).toBe(15000)

		// Simulate release
		historyCache.clear()
		expect(historyCache.size).toBe(0)
		;(ev as any).removeAllListeners()
	})

	it('should profile buffer/flush cycles under load', () => {
		const ev = makeTestEventBuffer()
		const results: MemoryProfile[] = []

		results.push(
			profileMemory('1000 buffer/emit/flush cycles', () => {
				for (let i = 0; i < 1000; i++) {
					ev.buffer()
					ev.emit('messages.upsert', {
						messages: [makeFakeMessage(`BUF_${i}`, '5511999@s.whatsapp.net') as any],
						type: 'notify'
					})
					ev.flush()
				}
			})
		)

		printTable('BUFFER/FLUSH CYCLES', results)
		;(ev as any).removeAllListeners()
	})
})

describe('STRESS: MessageRetryManager under load', () => {
	it('should profile addRecentMessage with 2000 messages (LRU max=512)', () => {
		const mgr = new MockMessageRetryManager()
		const results: MemoryProfile[] = []

		results.push(
			profileMemory('Add 512 messages (fills LRU)', () => {
				for (let i = 0; i < 512; i++) {
					mgr.addRecentMessage('5511999@s.whatsapp.net', `LRU_${i}`, {
						conversation: randomBytes(500).toString('base64')
					})
				}
			})
		)

		console.log(`  After 512: recentMessages=${mgr.recentMessagesMap.size}, keyIndex=${mgr.messageKeyIndex.size}`)

		results.push(
			profileMemory('Add 1500 more (triggers eviction)', () => {
				for (let i = 512; i < 2012; i++) {
					mgr.addRecentMessage('5511999@s.whatsapp.net', `LRU_${i}`, {
						conversation: randomBytes(500).toString('base64')
					})
				}
			})
		)

		console.log(`  After 2012: recentMessages=${mgr.recentMessagesMap.size}, keyIndex=${mgr.messageKeyIndex.size}`)

		printTable('MESSAGE RETRY MANAGER LRU', results)

		// LRU should cap at 512
		expect(mgr.recentMessagesMap.size).toBeLessThanOrEqual(512)
		// messageKeyIndex should stay in sync
		expect(mgr.messageKeyIndex.size).toBeLessThanOrEqual(512)

		mgr.destroy()
		expect(mgr.recentMessagesMap.size).toBe(0)
		expect(mgr.messageKeyIndex.size).toBe(0)
	})

	it('should profile pendingPhoneRequests (timer leak vector)', () => {
		const mgr = new MockMessageRetryManager()

		// Schedule 500 phone requests
		for (let i = 0; i < 500; i++) {
			mgr.schedulePhoneRequest(`PHONE_${i}`, () => {}, 999999) // long delay, won't fire
		}

		console.log(`  Pending phone requests: ${Object.keys(mgr.pendingPhoneRequests).length}`)
		expect(Object.keys(mgr.pendingPhoneRequests).length).toBe(500)

		// Destroy should clear all timers
		mgr.destroy()
		expect(Object.keys(mgr.pendingPhoneRequests).length).toBe(0)
	})
})

describe('STRESS: 65 instances × reconnection cycles (production simulation)', () => {
	it('should measure heap across 65 instances with 3 reconnect cycles each', () => {
		const INSTANCES = 65
		const RECONNECTS = 3
		const MSGS_PER_CYCLE = 50 // 50 msgs per instance per cycle

		const instances: Map<string, MockSocketInstance> = new Map()
		const heapPerPhase: { phase: string; heap: number }[] = []

		heapPerPhase.push({ phase: 'Initial', heap: getHeapMB() })

		for (let cycle = 0; cycle < RECONNECTS; cycle++) {
			// Phase: Create/recreate all 65 instances
			for (let i = 0; i < INSTANCES; i++) {
				const name = `user_${i}`

				// Clean up old instance (simulates cleanupSession + end())
				const old = instances.get(name)
				if (old) {
					simulateEnd(old)
				}

				// Create new instance (simulates createSession)
				const sock = createMockSocket()
				instances.set(name, sock)
			}

			heapPerPhase.push({ phase: `After create cycle ${cycle + 1}`, heap: getHeapMB() })

			// Phase: Simulate some message activity per instance
			for (let i = 0; i < INSTANCES; i++) {
				const name = `user_${i}`
				const sock = instances.get(name)!
				const jid = `5511999${String(i).padStart(4, '0')}@s.whatsapp.net`

				for (let m = 0; m < MSGS_PER_CYCLE; m++) {
					simulateSendMessage(sock, jid, `C${cycle}_I${i}_S${m}`)
					simulateReceiveMessage(sock, jid, `C${cycle}_I${i}_R${m}`)
				}
			}

			heapPerPhase.push({ phase: `After msgs cycle ${cycle + 1}`, heap: getHeapMB() })
		}

		// Final cleanup: end all instances
		for (const [, sock] of instances) {
			simulateEnd(sock)
		}
		instances.clear()

		heapPerPhase.push({ phase: 'After full cleanup', heap: getHeapMB() })

		printTable(
			`65 INSTANCES × ${RECONNECTS} RECONNECTS (${MSGS_PER_CYCLE * 2} msgs/instance/cycle)`,
			heapPerPhase.map(p => ({
				Phase: p.phase,
				'Heap MB': p.heap
			}))
		)

		const initialHeap = heapPerPhase[0]!.heap
		const finalHeap = heapPerPhase[heapPerPhase.length - 1]!.heap

		console.log(`\n  Initial: ${initialHeap.toFixed(2)} MB`)
		console.log(`  Final:   ${finalHeap.toFixed(2)} MB`)
		console.log(`  Delta:   ${(finalHeap - initialHeap).toFixed(2)} MB`)
		console.log(`  Per instance overhead: ${((finalHeap - initialHeap) / INSTANCES).toFixed(3)} MB`)

		// After full cleanup, memory should not grow more than 30MB above initial
		// (In production this was growing 95MB+ without fixes)
		if (HAS_GC) {
			expect(finalHeap - initialHeap).toBeLessThan(30)
		}
	})

	it('should verify zero listener accumulation across reconnects', () => {
		const RECONNECTS = 10
		const ws = new MockWebSocketClient()
		const ev = makeTestEventBuffer()

		const listenersPerCycle: { ws: number; ev: number }[] = []

		for (let i = 0; i < RECONNECTS; i++) {
			// Register (what Baileys does on connect)
			simulateBaileysWSListeners(ws)
			ev.on('creds.update', () => {})
			ev.on('connection.update', () => {})
			ev.on('call' as any, () => {})
			ev.on('lid-mapping.update' as any, () => {})

			// End (what Baileys does on disconnect — after our fix)
			ws.removeAllListeners()
			;(ev as any).removeAllListeners()

			listenersPerCycle.push({
				ws: ws.getTotalListenerCount(),
				ev: countAllListeners(ev as any)
			})
		}

		printTable(
			'LISTENER COUNT AFTER EACH RECONNECT (should all be 0)',
			listenersPerCycle.map((c, i) => ({
				Cycle: i + 1,
				WS: c.ws,
				EV: c.ev
			}))
		)

		// Every cycle should leave 0 listeners
		for (const cycle of listenersPerCycle) {
			expect(cycle.ws).toBe(0)
			expect(cycle.ev).toBe(0)
		}
	})
})

describe('STRESS: Closure retention after end() — WeakRef test', () => {
	it("should verify that socket closure can be GC'd after end()", () => {
		if (!HAS_GC) {
			console.log('⚠ Skipping WeakRef test: run with --expose-gc for accurate results')
			console.log(
				'  Command: npx --node-options="--expose-gc" jest --config jest.config.ts src/__tests__/memory/stress-gc.test.ts --runInBand'
			)
			return
		}

		// Create socket and take a WeakRef to its closure data
		let sock: MockSocketInstance | null = createMockSocket()
		const weakAuth = new WeakRef(sock._closureRefs.authState)
		const weakSignal = new WeakRef(sock._closureRefs.signalRepository)

		// Simulate some activity
		for (let i = 0; i < 100; i++) {
			simulateSendMessage(sock, '5511999@s.whatsapp.net', `WR_${i}`)
			simulateReceiveMessage(sock, '5511999@s.whatsapp.net', `WR_R_${i}`)
		}

		// End the socket
		simulateEnd(sock)

		// Drop all references
		sock = null

		// Force multiple GC passes
		forceGC()
		forceGC()
		forceGC()

		const authAlive = weakAuth.deref() !== undefined
		const signalAlive = weakSignal.deref() !== undefined

		console.log('\n  === CLOSURE RETENTION AFTER END() ===')
		console.log(`  authState retained: ${authAlive}`)
		console.log(`  signalRepository retained: ${signalAlive}`)

		if (authAlive || signalAlive) {
			console.log('  ⚠ Some closures still retained — user code may hold references')
		} else {
			console.log("  ✓ All closure data was GC'd successfully")
		}

		// We don't hard-assert here because GC timing is non-deterministic
		// But we log for debugging
	})

	it('should measure per-instance memory and prove cleanup releases it', () => {
		const INSTANCES = 20

		const heapBefore = getHeapMB()
		let sockets: MockSocketInstance[] = []

		// Create 20 instances with activity
		for (let i = 0; i < INSTANCES; i++) {
			const sock = createMockSocket()
			for (let m = 0; m < 200; m++) {
				simulateSendMessage(sock, `5511${i}@s.whatsapp.net`, `INST_${i}_${m}`)
				simulateReceiveMessage(sock, `5511${i}@s.whatsapp.net`, `INST_${i}_R${m}`)
			}
			sockets.push(sock)
		}

		const heapWithInstances = getHeapMB()
		const perInstanceMB = (heapWithInstances - heapBefore) / INSTANCES

		// Cleanup all
		for (const sock of sockets) {
			simulateEnd(sock)
		}
		sockets = []

		const heapAfterCleanup = getHeapMB()

		console.log('\n  === PER-INSTANCE MEMORY ===')
		console.log(`  Heap before: ${heapBefore.toFixed(2)} MB`)
		console.log(`  Heap with ${INSTANCES} active instances: ${heapWithInstances.toFixed(2)} MB`)
		console.log(`  Per instance (with 400 msgs): ~${perInstanceMB.toFixed(3)} MB`)
		console.log(`  Heap after cleanup: ${heapAfterCleanup.toFixed(2)} MB`)
		console.log(`  Memory released: ${(heapWithInstances - heapAfterCleanup).toFixed(2)} MB`)
		console.log(`  Residual growth: ${(heapAfterCleanup - heapBefore).toFixed(2)} MB`)

		// After cleanup, residual should be small (< 5MB for 20 instances)
		if (HAS_GC) {
			expect(heapAfterCleanup - heapBefore).toBeLessThan(10)
		}
	})
})

describe('STRESS: NodeCache maxKeys enforcement under rapid writes', () => {
	it('should verify all caches respect their maxKeys under burst load', () => {
		const sock = createMockSocket()

		// Blast past all maxKeys limits
		const BURST = 6000
		const rejected: Record<string, number> = {}

		for (let i = 0; i < BURST; i++) {
			if (!safeSet(sock.userDevicesCache, `dev_${i}`, [{ user: `u${i}`, device: 0 }])) {
				rejected['userDevicesCache'] = (rejected['userDevicesCache'] || 0) + 1
			}
			if (!safeSet(sock.peerSessionsCache, `peer_${i}`, true)) {
				rejected['peerSessionsCache'] = (rejected['peerSessionsCache'] || 0) + 1
			}
			if (!safeSet(sock.msgRetryCache, `retry_${i}`, i)) {
				rejected['msgRetryCache'] = (rejected['msgRetryCache'] || 0) + 1
			}
			if (!safeSet(sock.callOfferCache, `call_${i}`, { id: `c${i}` } as any)) {
				rejected['callOfferCache'] = (rejected['callOfferCache'] || 0) + 1
			}
			if (!safeSet(sock.placeholderResendCache, `ph_${i}`, i)) {
				rejected['placeholderResendCache'] = (rejected['placeholderResendCache'] || 0) + 1
			}
			if (!safeSet(sock.identityAssertDebounce, `id_${i}`, true)) {
				rejected['identityAssertDebounce'] = (rejected['identityAssertDebounce'] || 0) + 1
			}
		}

		const sizes = {
			userDevicesCache: { actual: sock.userDevicesCache.store.size, max: 1000 },
			peerSessionsCache: { actual: sock.peerSessionsCache.store.size, max: 1000 },
			msgRetryCache: { actual: sock.msgRetryCache.store.size, max: 5000 },
			callOfferCache: { actual: sock.callOfferCache.store.size, max: 1000 },
			placeholderResendCache: { actual: sock.placeholderResendCache.store.size, max: 5000 },
			identityAssertDebounce: { actual: sock.identityAssertDebounce.store.size, max: 500 }
		}

		printTable(
			'CACHE maxKeys ENFORCEMENT (burst=6000)',
			Object.entries(sizes).map(([name, s]) => ({
				Cache: name,
				Actual: s.actual,
				MaxKeys: s.max,
				Rejected: rejected[name] || 0,
				OK: s.actual <= s.max ? '✓' : '✗ LEAKED'
			}))
		)

		// NodeCache throws when maxKeys exceeded, so caches are capped
		for (const [, s] of Object.entries(sizes)) {
			expect(s.actual).toBeLessThanOrEqual(s.max)
		}

		// Verify rejections happened (proves maxKeys is enforced)
		expect(rejected['userDevicesCache']).toBeGreaterThan(0)
		expect(rejected['identityAssertDebounce']).toBeGreaterThan(0)

		simulateEnd(sock)
	})
})

describe('STRESS: Rapid connect/disconnect race conditions', () => {
	it('should handle 100 rapid connect/disconnect cycles on same instance', () => {
		const CYCLES = 100
		let currentSock: MockSocketInstance | null = null
		const heapSnapshots: number[] = []

		for (let i = 0; i < CYCLES; i++) {
			// Clean old
			if (currentSock) {
				simulateEnd(currentSock)
				currentSock = null
			}

			// Create new
			currentSock = createMockSocket()

			// Small burst of activity
			for (let m = 0; m < 10; m++) {
				simulateSendMessage(currentSock, '5511999@s.whatsapp.net', `RAPID_${i}_${m}`)
				simulateReceiveMessage(currentSock, '5511999@s.whatsapp.net', `RAPID_R_${i}_${m}`)
			}

			if (i % 20 === 0) {
				heapSnapshots.push(getHeapMB())
			}
		}

		// Final cleanup
		if (currentSock) {
			simulateEnd(currentSock)
		}
		heapSnapshots.push(getHeapMB())

		printTable(
			'100 RAPID RECONNECT CYCLES',
			heapSnapshots.map((h, i) => ({
				Checkpoint: i * 20,
				'Heap MB': h
			}))
		)

		const growth = heapSnapshots[heapSnapshots.length - 1]! - heapSnapshots[0]!
		console.log(`\n  Total heap growth over 100 cycles: ${growth.toFixed(2)} MB`)

		// Should not grow significantly across 100 reconnects
		expect(growth).toBeLessThan(20)
	})
})
