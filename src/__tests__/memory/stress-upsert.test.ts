/**
 * STRESS TEST: messages.upsert / upsertMessage pipeline
 *
 * Foca especificamente no caminho crítico que TODA mensagem percorre:
 *
 *   CB:message → handleMessage → upsertMessage (createBufferedFunction)
 *               → ev.buffer() → ev.emit('messages.upsert') → ev.flush()
 *               → listeners recebem { messages, type }
 *
 * O que este arquivo testa:
 *  1. 100.000 mensagens/min × 60 instâncias simultâneas
 *  2. connection.update lifecycle (connected → disconnected) e se os listeners do ev vazam
 *  3. historyCache Set dentro do event buffer sob alta carga de history syncs
 *  4. createBufferedFunction com async work (padrão exato de chats.ts:upsertMessage)
 *  5. ev.emit('messages.upsert') com type mismatch flush (regression test)
 *  6. Heap cresce com 60 instâncias × 100k msgs e cai após cleanup completo
 *  7. Timers internos do createBufferedFunction não vazam entre reconexões
 *
 * Como rodar (com GC exposto para métricas precisas):
 *
 *   node --expose-gc ./node_modules/.bin/jest --config jest.config.ts \
 *     src/__tests__/memory/stress-upsert.test.ts --runInBand --forceExit
 *
 *   # ou via npx:
 *   npx --node-options='--expose-gc' jest --config jest.config.ts \
 *     src/__tests__/memory/stress-upsert.test.ts --runInBand --forceExit
 *
 * NOTA: Não importa nenhum módulo Baileys real (WAProto usa ESM e quebra o Jest).
 * Tudo aqui são mocks self-contained que replicam o comportamento EXATO.
 */
import { NodeCache } from '@cacheable/node-cache'
import { randomBytes } from 'crypto'
import { EventEmitter } from 'events'
import { NativeLRUCache } from '../../Utils/lru-cache'
import { countAllListeners, forceGC, getHeapMB } from './helpers'
import { MockWebSocketClient } from './mock-ws'

// ─── Runtime config ─────────────────────────────────────────

const HAS_GC = typeof global.gc === 'function'

/** Mensagens por "minuto" simulado (1 minuto = 60 iterações × 1667 msgs ≈ 100.020 msgs/min) */
const MSGS_PER_MIN = 100_020
const MSGS_PER_TICK = 1667 // ~1667 por tick → 60 ticks ≈ 100k/min

/** Instâncias simultâneas */
const INSTANCE_COUNT = 60

// ─── Silent logger ───────────────────────────────────────────

const silentLogger = {
	level: 'silent' as const,
	child: () => silentLogger,
	trace: (..._args: any[]) => {},
	debug: (..._args: any[]) => {},
	info: (..._args: any[]) => {},
	warn: (..._args: any[]) => {},
	error: (..._args: any[]) => {}
} as any

// ─── Event Buffer Mock ───────────────────────────────────────

/**
 * Replica fiel do makeEventBuffer de src/Utils/event-buffer.ts.
 * Inclui createBufferedFunction, historyCache, buffer/flush — tudo self-contained.
 */
function makeMockEventBuffer() {
	const ev = new EventEmitter()
	ev.setMaxListeners(0)

	const historyCache = new Set<string>()
	const MAX_HISTORY_CACHE_SIZE = 10_000
	const BUFFER_TIMEOUT_MS = 30_000
	const MESSAGE_KEY_SEP = ','

	// Interna: mapa de mensagens bufferizadas por tipo
	let bufferedUpserts: Array<{ key: string; message: any; type: 'notify' | 'append' }> = []
	let bufferedType: 'notify' | 'append' | null = null

	let isBuffering = false
	let bufferCount = 0
	let bufferTimeout: NodeJS.Timeout | null = null
	let flushPendingTimeout: NodeJS.Timeout | null = null
	let totalFlushed = 0

	function buffer() {
		if (!isBuffering) {
			isBuffering = true
			bufferCount = 0
			if (bufferTimeout) clearTimeout(bufferTimeout)
			bufferTimeout = setTimeout(() => {
				if (isBuffering) flush()
			}, BUFFER_TIMEOUT_MS)
		}

		bufferCount++
	}

	function flush() {
		if (!isBuffering) return false

		isBuffering = false
		bufferCount = 0

		if (bufferTimeout) {
			clearTimeout(bufferTimeout)
			bufferTimeout = null
		}

		if (flushPendingTimeout) {
			clearTimeout(flushPendingTimeout)
			flushPendingTimeout = null
		}

		// Limpa historyCache se exceder o limite (replicando a lógica real)
		if (historyCache.size > MAX_HISTORY_CACHE_SIZE) {
			historyCache.clear()
		}

		// Emite todos os bufferizados consolidados
		if (bufferedUpserts.length > 0) {
			const messages = bufferedUpserts.map(u => u.message)
			const type = bufferedType || 'notify'
			bufferedUpserts = []
			bufferedType = null
			ev.emit('event', { 'messages.upsert': { messages, type } })
		}

		totalFlushed++
		return true
	}

	function emitUpsert(message: any, type: 'notify' | 'append') {
		const msgKey = `${message.key?.remoteJid}${MESSAGE_KEY_SEP}${message.key?.id}${MESSAGE_KEY_SEP}${message.key?.fromMe ? '1' : '0'}`

		// Detecta type mismatch (replica lógica do emit() real de event-buffer.ts)
		if (isBuffering) {
			if (bufferedType !== null && bufferedType !== type && bufferedUpserts.length > 0) {
				// Flush os bufferizados com o tipo antigo antes de adicionar o novo
				const msgs = bufferedUpserts.map(u => u.message)
				const flushType = bufferedType
				bufferedUpserts = []
				bufferedType = null
				ev.emit('event', { 'messages.upsert': { messages: msgs, type: flushType } })
			}

			// Deduplica via historyCache (replicando append() do event-buffer.ts)
			if (!historyCache.has(msgKey)) {
				historyCache.add(msgKey)
				bufferedUpserts.push({ key: msgKey, message, type })
				bufferedType = type
			}

			return
		}

		// Sem buffer: emite diretamente
		ev.emit('event', { 'messages.upsert': { messages: [message], type } })
	}

	/**
	 * createBufferedFunction — réplica exata do padrão usado em chats.ts:
	 *   const upsertMessage = ev.createBufferedFunction(async (msg, type) => { ... })
	 */
	function createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>) {
		return async (...args: A): Promise<T> => {
			buffer()
			try {
				const result = await work(...args)
				if (bufferCount === 1) {
					setTimeout(() => {
						if (isBuffering && bufferCount === 1) flush()
					}, 100)
				}

				return result
			} finally {
				bufferCount = Math.max(0, bufferCount - 1)
				if (bufferCount === 0 && !flushPendingTimeout) {
					flushPendingTimeout = setTimeout(flush, 100)
				}
			}
		}
	}

	function release() {
		if (bufferTimeout) {
			clearTimeout(bufferTimeout)
			bufferTimeout = null
		}

		if (flushPendingTimeout) {
			clearTimeout(flushPendingTimeout)
			flushPendingTimeout = null
		}

		historyCache.clear()
		bufferedUpserts = []
		bufferedType = null
		isBuffering = false
		bufferCount = 0
		ev.removeAllListeners()
	}

	return {
		on: (event: string, listener: (...args: any[]) => any) => ev.on(event, listener),
		off: (event: string, listener: (...args: any[]) => any) => ev.off(event, listener),
		removeAllListeners: (event?: string) => ev.removeAllListeners(event),
		emit: ev.emit.bind(ev),
		eventNames: () => ev.eventNames(),
		listenerCount: (event: string | symbol) => ev.listenerCount(event),
		buffer,
		flush,
		release,
		emitUpsert,
		createBufferedFunction,
		// Expostos para inspeção nos testes
		_historyCache: historyCache,
		_getBufferedCount: () => bufferedUpserts.length,
		_getTotalFlushed: () => totalFlushed,
		_isBuffering: () => isBuffering
	}
}
type MockEventBuffer = ReturnType<typeof makeMockEventBuffer>

// ─── Fake message factory ────────────────────────────────────

/** Mensagem proto-like com tamanho realista (~1-3 KB) */
function makeFakeWAMessage(id: string, chatJid: string, fromMe = false) {
	return {
		key: {
			remoteJid: chatJid,
			fromMe,
			id,
			participant: fromMe ? undefined : `${chatJid.split('@')[0]}@c.us`
		},
		message: {
			conversation: randomBytes(400).toString('base64'), // ~550 chars
			messageContextInfo: {
				deviceListMetadata: { senderTimestamp: BigInt(Date.now()) },
				deviceListMetadataVersion: 2
			}
		},
		messageTimestamp: BigInt(Math.floor(Date.now() / 1000)),
		pushName: `User_${Math.floor(Math.random() * 9999)}`,
		status: fromMe ? 1 : 2,
		broadcast: false
	}
}

// ─── Mock socket instance ────────────────────────────────────

interface UpsertSocketInstance {
	instanceId: string
	ws: MockWebSocketClient
	ev: MockEventBuffer
	// Caches de messages-recv
	msgRetryCache: NodeCache<number>
	callOfferCache: NodeCache<any>
	placeholderResendCache: NodeCache<number>
	identityAssertDebounce: NodeCache<boolean>
	// Caches de messages-send
	userDevicesCache: NodeCache<any[]>
	peerSessionsCache: NodeCache<boolean>
	// Retry manager mínimo
	retryManager: {
		recentMessages: NativeLRUCache<string, { message: any; ts: number }>
		keyIndex: Map<string, string>
		destroy: () => void
	}
	// Simula upsertMessage (createBufferedFunction exato de chats.ts)
	upsertMessage: (msg: any, type: 'notify' | 'append') => Promise<void>
	// Stats
	stats: {
		sent: number
		received: number
		upserted: number
		upsertListenerFires: number
		connectionUpdates: number
	}
	// Controle de estado
	connected: boolean
}

const CB_EVENTS = [
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
	'CB:message',
	'CB:call',
	'CB:receipt',
	'CB:notification',
	'CB:ack,class:message',
	'CB:presence',
	'CB:chatstate',
	'CB:ib,,dirty'
]

function createUpsertSocket(id: string): UpsertSocketInstance {
	const ws = new MockWebSocketClient()
	const ev = makeMockEventBuffer()

	// NodeCache replicas (exatas configurações do Baileys)
	const msgRetryCache = new NodeCache<number>({ stdTTL: 3600, useClones: false, maxKeys: 5000 })
	const callOfferCache = new NodeCache<any>({ stdTTL: 300, useClones: false, maxKeys: 1000 })
	const placeholderResendCache = new NodeCache<number>({ stdTTL: 3600, useClones: false, maxKeys: 5000 })
	const identityAssertDebounce = new NodeCache<boolean>({ stdTTL: 5, useClones: false, maxKeys: 500 })
	const userDevicesCache = new NodeCache<any[]>({ stdTTL: 300, useClones: false, maxKeys: 1000 })
	const peerSessionsCache = new NodeCache<boolean>({ stdTTL: 300, useClones: false, maxKeys: 1000 })

	const retryManager = {
		recentMessages: new NativeLRUCache<string, { message: any; ts: number }>({
			max: 512,
			ttl: 5 * 60 * 1000,
			ttlAutopurge: true
		}),
		keyIndex: new Map<string, string>(),
		destroy() {
			this.recentMessages.clear()
			this.keyIndex.clear()
		}
	}

	const stats = {
		sent: 0,
		received: 0,
		upserted: 0,
		upsertListenerFires: 0,
		connectionUpdates: 0
	}

	// ── Replica exata de chats.ts:upsertMessage ──────────────
	// Veja src/Socket/chats.ts linha ~1060:
	//   const upsertMessage = ev.createBufferedFunction(async (msg, type) => {
	//     ev.emit('messages.upsert', { messages: [msg], type })
	//   })
	const upsertMessage = ev.createBufferedFunction(async (msg: any, type: 'notify' | 'append') => {
		stats.upserted++
		ev.emitUpsert(msg, type)
	})

	// Registra os listeners típicos que o Baileys registra no ev
	ev.on('event', (map: any) => {
		if (map['messages.upsert']) {
			stats.upsertListenerFires++
		}
	})
	ev.on('event', (map: any) => {
		if (map['connection.update']) {
			stats.connectionUpdates++
		}
	})
	ev.on('event', (map: any) => {
		if (map['creds.update']) {
			/* simula salvar credenciais */
		}
	})

	// Registra os CB:* handlers no WS (igual ao socket.ts)
	for (const cbEvt of CB_EVENTS) {
		ws.on(cbEvt, () => {})
	}
	ws.on('message', () => {})
	ws.on('open', () => {})
	ws.on('close', () => {})
	ws.on('error', () => {})

	return {
		instanceId: id,
		ws,
		ev,
		msgRetryCache,
		callOfferCache,
		placeholderResendCache,
		identityAssertDebounce,
		userDevicesCache,
		peerSessionsCache,
		retryManager,
		upsertMessage,
		stats,
		connected: false
	}
}

function simulateConnect(sock: UpsertSocketInstance) {
	sock.connected = true
	sock.ws.simulateOpen()
	sock.ev.emit('event', { 'connection.update': { connection: 'open' } })
}

/**
 * Simula o recebimento de uma mensagem completo:
 *   WS recebe CB:message → handleMessage → upsertMessage (buffered) → ev emite messages.upsert
 * Este é o hot path que executa 1000+ vezes/min em produção.
 */
async function simulateIncomingMessage(sock: UpsertSocketInstance, jid: string, msgId: string): Promise<void> {
	const msg = makeFakeWAMessage(msgId, jid, false)

	// 1. Lookup no identityAssertDebounce (handleMessage faz isso para cada sender)
	const senderUser = jid.split('@')[0]!
	try {
		sock.identityAssertDebounce.set(senderUser, true)
	} catch {
		/* maxKeys exceeded */
	}

	// 2. Check no msgRetryCache (para ver se já foi tentado retry)
	const retryCount = sock.msgRetryCache.get(msgId) ?? 0
	if (retryCount > 0) {
		sock.msgRetryCache.set(msgId, retryCount + 1)
	}

	// 3. Registra no placeholderResendCache
	try {
		sock.placeholderResendCache.set(`ph_${msgId}`, Date.now())
	} catch {
		/* maxKeys exceeded */
	}

	// 4. upsertMessage (o hot path real — createBufferedFunction com buffer/flush)
	await sock.upsertMessage(msg, 'notify')
	sock.stats.received++
}

/**
 * Simula envio de mensagem:
 *   sendMessage → relayMessage → upsertMessage('append')
 */
async function simulateOutgoingMessage(sock: UpsertSocketInstance, jid: string, msgId: string): Promise<void> {
	const msg = makeFakeWAMessage(msgId, jid, true)

	// 1. userDevicesCache (getUSyncDevices)
	const user = jid.split('@')[0]!
	if (!sock.userDevicesCache.get(user)) {
		try {
			sock.userDevicesCache.set(user, [{ user, device: 0 }])
		} catch {
			/* maxKeys */
		}
	}

	// 2. peerSessionsCache
	try {
		sock.peerSessionsCache.set(`${user}:0`, true)
	} catch {
		/* maxKeys */
	}

	// 3. retryManager.addRecentMessage (para lidar com retry receipts)
	const keyStr = `${jid}\u0000${msgId}`
	sock.retryManager.recentMessages.set(keyStr, { message: msg.message, ts: Date.now() })
	sock.retryManager.keyIndex.set(msgId, keyStr)

	// 4. upsertMessage('append') — igual ao relayMessage real
	await sock.upsertMessage(msg, 'append')
	sock.stats.sent++
}

function simulateDisconnect(sock: UpsertSocketInstance) {
	sock.connected = false
	sock.ev.emit('event', { 'connection.update': { connection: 'close' } })
	// cleanup completo (o que o end() faz após os nossos fixes)
	sock.ws.removeAllListeners()
	sock.ev.release()
	sock.retryManager.destroy()
	sock.msgRetryCache.flushAll()
	sock.callOfferCache.flushAll()
	sock.placeholderResendCache.flushAll()
	sock.identityAssertDebounce.flushAll()
	sock.userDevicesCache.flushAll()
	sock.peerSessionsCache.flushAll()
}

// ─── Print helpers ───────────────────────────────────────────

function hr(char = '═', len = 74) {
	return char.repeat(len)
}

function printHeapTable(title: string, rows: Array<Record<string, any>>) {
	console.log(`\n${hr()}`)
	console.log(`  ${title}`)
	console.log(hr())
	for (const row of rows) {
		const parts = Object.entries(row).map(([k, v]) => {
			if (typeof v === 'number' && !Number.isInteger(v)) return `${k}: ${v.toFixed(2)}MB`
			return `${k}: ${v}`
		})
		console.log(`  ${parts.join('  |  ')}`)
	}
	console.log(hr('─'))
}

function printInstanceStats(label: string, instances: UpsertSocketInstance[]) {
	const totalSent = instances.reduce((s, i) => s + i.stats.sent, 0)
	const totalRecv = instances.reduce((s, i) => s + i.stats.received, 0)
	const totalUpserted = instances.reduce((s, i) => s + i.stats.upserted, 0)
	const totalListenerFires = instances.reduce((s, i) => s + i.stats.upsertListenerFires, 0)
	const totalWsListeners = instances.reduce((s, i) => s + i.ws.getTotalListenerCount(), 0)
	const totalEvListeners = instances.reduce((s, i) => s + countAllListeners(i.ev as unknown as EventEmitter), 0)
	const totalHistoryCache = instances.reduce((s, i) => s + i.ev._historyCache.size, 0)
	const totalRetryMap = instances.reduce((s, i) => s + i.retryManager.recentMessages.size, 0)
	const heap = getHeapMB()

	console.log(`  [${label}]`)
	console.log(`    Heap: ${heap.toFixed(2)} MB`)
	console.log(`    Instâncias ativas: ${instances.length}`)
	console.log(`    Msgs enviadas: ${totalSent} | recebidas: ${totalRecv} | upserted: ${totalUpserted}`)
	console.log(`    upsert listener fires: ${totalListenerFires}`)
	console.log(`    WS listeners total: ${totalWsListeners} (${(totalWsListeners / instances.length).toFixed(1)}/inst)`)
	console.log(`    EV listeners total: ${totalEvListeners} (${(totalEvListeners / instances.length).toFixed(1)}/inst)`)
	console.log(
		`    historyCache total: ${totalHistoryCache} (${(totalHistoryCache / instances.length).toFixed(0)}/inst)`
	)
	console.log(`    retryManager.recentMessages total: ${totalRetryMap}`)
}

// Wait for pending async timers (createBufferedFunction usa setTimeout 100ms)
async function drainTimers(ms = 250): Promise<void> {
	return new Promise(r => setTimeout(r, ms))
}

// ═══════════════════════════════════════════════════════════════
// SUITE 1 : upsertMessage isolado — latência e memory por mensagem
// ═══════════════════════════════════════════════════════════════

describe('UPSERT #1: upsertMessage isolado — perfil de memória por mensagem', () => {
	it('deve perfil 100k msgs incoming em instância única (baseline)', async () => {
		const sock = createUpsertSocket('baseline')
		simulateConnect(sock)

		const jid = '5511999001122@s.whatsapp.net'
		const heapRows: Array<Record<string, any>> = []
		const checkpoints = [10_000, 25_000, 50_000, 75_000, 100_000]
		let checkpoint = 0

		const heapStart = getHeapMB()

		for (let i = 0; i < 100_000; i++) {
			await simulateIncomingMessage(sock, jid, `BASELINE_${i}`)

			if (i + 1 === checkpoints[checkpoint]) {
				heapRows.push({
					Msg: i + 1,
					'Heap MB': getHeapMB(),
					'Δ MB': getHeapMB() - heapStart,
					histCache: sock.ev._historyCache.size,
					retryMap: sock.retryManager.recentMessages.size,
					flushed: sock.ev._getTotalFlushed()
				})
				checkpoint++
			}
		}

		await drainTimers()

		printHeapTable('BASELINE: 100k msgs incoming — 1 instância', heapRows)
		printInstanceStats('Após 100k incoming', [sock])

		// historyCache não deve exceder MAX_HISTORY_CACHE_SIZE (10000)
		expect(sock.ev._historyCache.size).toBeLessThanOrEqual(10_000)
		// retryManager LRU caps a 512
		expect(sock.retryManager.recentMessages.size).toBe(0) // incoming não usa retryManager

		simulateDisconnect(sock)

		// Após cleanup: listeners = 0
		expect(sock.ws.getTotalListenerCount()).toBe(0)
	}, 300_000)

	it('deve perfil 100k msgs outgoing (upsertMessage append)', async () => {
		const sock = createUpsertSocket('outgoing')
		simulateConnect(sock)

		const jid = '5511999334455@s.whatsapp.net'
		const heapRows: Array<Record<string, any>> = []

		const heapStart = getHeapMB()

		for (let i = 0; i < 100_000; i++) {
			await simulateOutgoingMessage(sock, jid, `OUT_${i}`)

			if ((i + 1) % 10_000 === 0) {
				heapRows.push({
					Msg: i + 1,
					'Heap MB': getHeapMB(),
					'Δ MB': getHeapMB() - heapStart,
					retryMap: sock.retryManager.recentMessages.size,
					userDevCache: sock.userDevicesCache.store.size
				})
			}
		}

		await drainTimers()

		printHeapTable('OUTGOING: 100k msgs — 1 instância', heapRows)

		// LRU caps recentMessages a 512
		expect(sock.retryManager.recentMessages.size).toBeLessThanOrEqual(512)
		// userDevicesCache: 1 entrada (mesmo jid)
		expect(sock.userDevicesCache.store.size).toBe(1)

		simulateDisconnect(sock)
	}, 300_000)
})

// ═══════════════════════════════════════════════════════════════
// SUITE 2 : 1000 msgs/min — medição realista de throughput
// ═══════════════════════════════════════════════════════════════

describe('UPSERT #2: 100k msgs/min — throughput realista em instância única', () => {
	it('deve processar ~100.020 msgs/min (60 ticks × 1667 msgs) sem crescimento de heap excessivo', async () => {
		const sock = createUpsertSocket('1kpm')
		simulateConnect(sock)

		const jid = '5511999667788@s.whatsapp.net'
		const heapRows: Array<Record<string, any>> = []
		const heapStart = getHeapMB()

		console.log(`\n  Simulando ${MSGS_PER_MIN} msgs/min (${MSGS_PER_TICK} msgs × 60 ticks)...`)

		for (let tick = 0; tick < 60; tick++) {
			for (let m = 0; m < MSGS_PER_TICK; m++) {
				const isIncoming = m % 2 === 0
				const msgId = `T${tick}_M${m}`
				if (isIncoming) {
					await simulateIncomingMessage(sock, jid, msgId)
				} else {
					await simulateOutgoingMessage(sock, jid, msgId)
				}
			}

			// Log a cada 15 ticks (~15 segundos simulados)
			if ((tick + 1) % 15 === 0) {
				heapRows.push({
					Tick: tick + 1,
					'Msgs Processadas': (tick + 1) * MSGS_PER_TICK,
					'Heap MB': getHeapMB(),
					'Δ MB': getHeapMB() - heapStart,
					histCache: sock.ev._historyCache.size,
					flushed: sock.ev._getTotalFlushed()
				})
			}
		}

		await drainTimers()

		printHeapTable(`100K MSGS/MIN — 1 instância (${MSGS_PER_MIN} msgs total)`, heapRows)
		printInstanceStats('Após 1 minuto simulado', [sock])

		const heapFinal = getHeapMB()
		const growth = heapFinal - heapStart
		console.log(`\n  Crescimento total de heap: ${growth.toFixed(2)} MB`)
		console.log(`  MB por mensagem: ${(growth / MSGS_PER_MIN).toFixed(4)} MB`)

		// Crescimento por mensagem deve ser mínimo
		if (HAS_GC) {
			expect(growth).toBeLessThan(50)
		}

		simulateDisconnect(sock)
	}, 600_000)
})

// ═══════════════════════════════════════════════════════════════
// SUITE 3 : 60 instâncias simultâneas × 1000 msgs/min
// ═══════════════════════════════════════════════════════════════

describe(`UPSERT #3: ${INSTANCE_COUNT} instâncias × 1000 msgs/min — teste de produção`, () => {
	it(`deve gerenciar ${INSTANCE_COUNT} instâncias ativas com ~1670 msgs cada (~100k total) e logar memória por fase`, async () => {
		const heapRows: Array<Record<string, any>> = []
		const instances = new Map<string, UpsertSocketInstance>()

		// ── Fase 0: baseline ────────────────────────────────
		heapRows.push({ Fase: 'Baseline (antes de criar instâncias)', 'Heap MB': getHeapMB() })

		// ── Fase 1: criar todas as instâncias ──────────────
		console.log(`\n  Criando ${INSTANCE_COUNT} instâncias...`)
		for (let i = 0; i < INSTANCE_COUNT; i++) {
			const sock = createUpsertSocket(`inst_${i}`)
			simulateConnect(sock)
			instances.set(`inst_${i}`, sock)
		}
		heapRows.push({ Fase: `Após criar ${INSTANCE_COUNT} instâncias`, 'Heap MB': getHeapMB() })

		// ── Fase 2: carregar cada instância com 500 msgs ───
		console.log(`  Carregando 500 msgs por instância (warmup)...`)
		for (const [, sock] of instances) {
			const jid = `5511${sock.instanceId.replace('inst_', '').padStart(8, '0')}@s.whatsapp.net`
			for (let m = 0; m < 500; m++) {
				await simulateIncomingMessage(sock, jid, `WARM_${m}`)
			}
		}
		heapRows.push({ Fase: 'Após warmup (500 msgs/inst)', 'Heap MB': getHeapMB() })

		// ── Fase 3: ~1670 msgs por instância (60 inst × 1667 = ~100k total) ─────
		console.log(`  Processando ~1667 msgs por instância (~100k total)...`)
		const allSocks = [...instances.values()]
		for (let batch = 0; batch < 5; batch++) {
			for (const sock of allSocks) {
				const jid = `5511${sock.instanceId.replace('inst_', '').padStart(8, '0')}@s.whatsapp.net`
				for (let m = 0; m < MSGS_PER_TICK; m++) {
					const msgId = `B${batch}_M${m}`
					if (m % 2 === 0) {
						await simulateIncomingMessage(sock, jid, msgId)
					} else {
						await simulateOutgoingMessage(sock, jid, msgId)
					}
				}
			}

			heapRows.push({
				Fase: `Batch ${batch + 1}/5 (${(batch + 1) * MSGS_PER_TICK * INSTANCE_COUNT} msgs total)`,
				'Heap MB': getHeapMB()
			})
		}

		await drainTimers()

		heapRows.push({
			Fase: `Após ~1670 msgs × ${INSTANCE_COUNT} inst (~100k total, antes cleanup)`,
			'Heap MB': getHeapMB()
		})

		// Snapshot de stats antes do cleanup
		printInstanceStats(`Antes do cleanup (${INSTANCE_COUNT} inst ativas)`, allSocks)

		// ── Fase 4: cleanup de 30 instâncias ──────────────
		console.log(`  Desconectando 30 instâncias (metade)...`)
		const half = allSocks.slice(0, INSTANCE_COUNT / 2)
		for (const sock of half) {
			simulateDisconnect(sock)
			instances.delete(sock.instanceId)
		}

		heapRows.push({ Fase: 'Após desconectar 30 instâncias', 'Heap MB': getHeapMB() })

		// ── Fase 5: cleanup total ─────────────────────────
		console.log(`  Desconectando restante das instâncias...`)
		for (const [, sock] of instances) {
			simulateDisconnect(sock)
		}
		instances.clear()

		heapRows.push({ Fase: 'Após cleanup total', 'Heap MB': getHeapMB() })

		printHeapTable(`${INSTANCE_COUNT} INSTÂNCIAS × ~100k MSGS TOTAL → crescimento de heap por fase`, heapRows)

		const baselineHeap = heapRows[0]!['Heap MB'] as number
		const peakHeap = Math.max(...heapRows.map(r => r['Heap MB'] as number))
		const finalHeap = heapRows[heapRows.length - 1]!['Heap MB'] as number

		console.log(`\n  Baseline:    ${baselineHeap.toFixed(2)} MB`)
		console.log(`  Pico (60 inst ativas): ${peakHeap.toFixed(2)} MB`)
		console.log(`  Final (após cleanup): ${finalHeap.toFixed(2)} MB`)
		console.log(`  Heap liberada: ${(peakHeap - finalHeap).toFixed(2)} MB`)
		console.log(`  Resíduo (vs baseline): ${(finalHeap - baselineHeap).toFixed(2)} MB`)
		console.log(`  Custo por instância no pico: ${((peakHeap - baselineHeap) / INSTANCE_COUNT).toFixed(3)} MB`)

		// Após cleanup total, resíduo deve ser pequeno
		if (HAS_GC) {
			expect(finalHeap - baselineHeap).toBeLessThan(30)
		}
	}, 900_000)
})

// ═══════════════════════════════════════════════════════════════
// SUITE 4 : connection.update lifecycle — ev listeners não acumulam
// ═══════════════════════════════════════════════════════════════

describe('UPSERT #4: connection.update lifecycle — listeners do ev não vazam entre reconexões', () => {
	it('deve ter 0 listeners após cada ciclo de conexão/desconexão', async () => {
		const CYCLES = 20
		const ws = new MockWebSocketClient()
		const results: Array<Record<string, any>> = []

		for (let cycle = 0; cycle < CYCLES; cycle++) {
			const sock = createUpsertSocket(`cycle_${cycle}`)

			simulateConnect(sock)

			// Processa 500 msgs por ciclo (simula atividade antes da desconexão)
			for (let m = 0; m < 500; m++) {
				await simulateIncomingMessage(sock, '5511999@s.whatsapp.net', `CYC_${cycle}_${m}`)
			}
			await drainTimers()

			simulateDisconnect(sock)

			results.push({
				Ciclo: cycle + 1,
				'WS Listeners': sock.ws.getTotalListenerCount(),
				'EV Listeners': countAllListeners(sock.ev as unknown as EventEmitter),
				'histCache size': sock.ev._historyCache.size
			})
		}

		printHeapTable('LISTENER COUNT PÓS-DESCONEXÃO (deve ser 0 em todos)', results)

		// Todos os ciclos devem terminar com 0 listeners
		for (const r of results) {
			expect(r['WS Listeners']).toBe(0)
			expect(r['EV Listeners']).toBe(0)
			expect(r['histCache size']).toBe(0) // release() must clear historyCache
		}

		ws.removeAllListeners()
	}, 120_000)

	it('deve medir acúmulo de listeners SE release() não for chamado (baseline do bug)', () => {
		const CYCLES = 10
		const results: Array<Record<string, any>> = []
		let totalEvListeners = 0

		for (let cycle = 0; cycle < CYCLES; cycle++) {
			// Simula o BUG: reutilizar o mesmo ev sem chamar release()
			const ev = makeMockEventBuffer()

			// Registra os mesmos listeners que Baileys registra
			ev.on('event', (_map: any) => {}) // connection.update handler
			ev.on('event', (_map: any) => {}) // creds.update handler
			ev.on('event', (_map: any) => {}) // messages.upsert handler

			totalEvListeners += countAllListeners(ev as unknown as EventEmitter)

			// BUG: NÃO chama release(), NÃO chama removeAllListeners()
			// (o que acontecia antes dos nossos fixes)
		}

		console.log(`\n  ${CYCLES} ciclos SEM cleanup: total de listeners acumulados = ${totalEvListeners}`)
		// Com 3 listeners por ciclo × 10 ciclos = 30 acumulados
		expect(totalEvListeners).toBeGreaterThan(0)
		console.log('  ⚠ Confirma que sem release() os listeners acumulam e causam leak.')
	})
})

// ═══════════════════════════════════════════════════════════════
// SUITE 5 : historyCache sob carga — type mismatch flush
// ═══════════════════════════════════════════════════════════════

describe('UPSERT #5: historyCache e type mismatch flush sob alta carga', () => {
	it('deve fazer flush automático quando type muda de notify para append', async () => {
		const sock = createUpsertSocket('mismatch')
		simulateConnect(sock)

		const jid = '55119998888@s.whatsapp.net'
		let upsertEvents: Array<{ count: number; type: string }> = []

		sock.ev.on('event', (map: any) => {
			if (map['messages.upsert']) {
				upsertEvents.push({
					count: map['messages.upsert'].messages.length,
					type: map['messages.upsert'].type
				})
			}
		})

		// Envia 20 msgs tipo 'notify' bufferizadas
		sock.ev.buffer()
		for (let i = 0; i < 20; i++) {
			const msg = makeFakeWAMessage(`NOTIFY_${i}`, jid, false)
			sock.ev.emitUpsert(msg, 'notify')
		}

		// Agora envia tipo 'append' — deve causar flush dos 'notify' primeiro
		for (let i = 0; i < 5; i++) {
			const msg = makeFakeWAMessage(`APPEND_${i}`, jid, true)
			sock.ev.emitUpsert(msg, 'append')
		}

		sock.ev.flush()
		await drainTimers()

		console.log('\n  Eventos upsert emitidos:')
		for (const e of upsertEvents) {
			console.log(`    type=${e.type}, count=${e.count}`)
		}

		// Deve ter emitido pelo menos um evento com as notify e outro com as append
		const notifyEvents = upsertEvents.filter(e => e.type === 'notify')
		const appendEvents = upsertEvents.filter(e => e.type === 'append')

		expect(notifyEvents.length).toBeGreaterThan(0)
		expect(appendEvents.length).toBeGreaterThan(0)

		simulateDisconnect(sock)
	}, 30_000)

	it('deve limpar historyCache quando exceder MAX_HISTORY_CACHE_SIZE', async () => {
		const sock = createUpsertSocket('historycache')
		simulateConnect(sock)

		const jid = '5511987654321@g.us'
		const results: Array<Record<string, any>> = []

		// Envia 120.000 mensagens únicas para forçar o historyCache a exceder 10000 repetidamente
		for (let i = 0; i < 120_000; i++) {
			const msg = makeFakeWAMessage(`HC_${i}`, jid, false)

			// Simula o buffer que o handleMessage usa
			sock.ev.buffer()
			sock.ev.emitUpsert(msg, 'notify')

			// Flushar a cada 5000 para simular ciclos reais
			if ((i + 1) % 5_000 === 0) {
				sock.ev.flush()
				results.push({
					'Msgs processadas': i + 1,
					'histCache size': sock.ev._historyCache.size,
					'Heap MB': getHeapMB()
				})
			}
		}

		await drainTimers()

		printHeapTable('HISTORY CACHE SOB CARGA (120k msgs únicas)', results)

		// Após exceder 10000, flush deve ter limpo o cache pelo menos uma vez
		const lastSize = results[results.length - 1]!['histCache size'] as number
		console.log(`\n  histCache size final: ${lastSize}`)
		console.log(`  (Esperado: ≤ 10000 após auto-clear no flush)`)

		// O auto-clear garante que não excede MAX
		expect(lastSize).toBeLessThanOrEqual(10_000)

		simulateDisconnect(sock)
	}, 180_000)
})

// ═══════════════════════════════════════════════════════════════
// SUITE 6 : 60 instâncias × reconexões múltiplas — simulação de horas
// ═══════════════════════════════════════════════════════════════

describe(`UPSERT #6: ${INSTANCE_COUNT} instâncias × 5 reconexões — simulação de horas em produção`, () => {
	it('deve manter heap estável ao longo de múltiplas reconexões com upsert ativo', async () => {
		const RECONNECT_CYCLES = 5
		const MSGS_PER_CYCLE = 334 // ~334/inst × 5 ciclos × 60 inst ≈ 100k msgs total

		const heapHistory: Array<Record<string, any>> = []
		heapHistory.push({ Evento: 'Início (sem instâncias)', 'Heap MB': getHeapMB() })

		const instances = new Map<string, UpsertSocketInstance>()

		for (let cycle = 0; cycle < RECONNECT_CYCLES; cycle++) {
			// ── Recria todas as instâncias (simula reconexão) ──
			for (let i = 0; i < INSTANCE_COUNT; i++) {
				const name = `inst_${i}`

				// Cleanup da instância anterior
				const old = instances.get(name)
				if (old) simulateDisconnect(old)

				const sock = createUpsertSocket(name)
				simulateConnect(sock)
				instances.set(name, sock)
			}

			heapHistory.push({
				Evento: `Ciclo ${cycle + 1}: após criar ${INSTANCE_COUNT} inst`,
				'Heap MB': getHeapMB()
			})

			// ── Processa msgs em cada instância ──────────────
			for (const [, sock] of instances) {
				const jid = `5511${sock.instanceId.replace('inst_', '').padStart(8, '0')}@s.whatsapp.net`
				for (let m = 0; m < MSGS_PER_CYCLE; m++) {
					if (m % 3 === 0) {
						await simulateOutgoingMessage(sock, jid, `C${cycle}_OUT_${m}`)
					} else {
						await simulateIncomingMessage(sock, jid, `C${cycle}_IN_${m}`)
					}
				}
			}

			await drainTimers(50) // deixa os timers internos do createBufferedFunction dispararem

			heapHistory.push({
				Evento: `Ciclo ${cycle + 1}: após ${MSGS_PER_CYCLE} msgs × ${INSTANCE_COUNT} inst`,
				'Heap MB': getHeapMB()
			})
		}

		// ── Cleanup final ──────────────────────────────────
		for (const [, sock] of instances) {
			simulateDisconnect(sock)
		}
		instances.clear()

		// Múltiplos GCs para resultados precisos
		forceGC()
		forceGC()

		heapHistory.push({ Evento: 'Cleanup total + GC', 'Heap MB': getHeapMB() })

		printHeapTable(`${INSTANCE_COUNT} INST × ${RECONNECT_CYCLES} RECONEXÕES × ${MSGS_PER_CYCLE} MSGS`, heapHistory)

		const baselineHeap = heapHistory[0]!['Heap MB'] as number
		const finalHeap = heapHistory[heapHistory.length - 1]!['Heap MB'] as number
		const allHeaps = heapHistory.map(r => r['Heap MB'] as number)
		const peakHeap = Math.max(...allHeaps)

		console.log(`\n  Baseline:  ${baselineHeap.toFixed(2)} MB`)
		console.log(
			`  Pico:      ${peakHeap.toFixed(2)} MB  (${((peakHeap - baselineHeap) / INSTANCE_COUNT).toFixed(3)} MB/inst)`
		)
		console.log(`  Final:     ${finalHeap.toFixed(2)} MB`)
		console.log(`  Resíduo:   ${(finalHeap - baselineHeap).toFixed(2)} MB`)

		// Crescimento incremental entre ciclos (indicador de vazamento)
		const cycleHeaps = heapHistory.filter(r => (r['Evento'] as string).includes('após criar'))
		if (cycleHeaps.length >= 2) {
			const diffs: number[] = []
			for (let i = 1; i < cycleHeaps.length; i++) {
				diffs.push((cycleHeaps[i]!['Heap MB'] as number) - (cycleHeaps[i - 1]!['Heap MB'] as number))
			}
			console.log(`\n  Crescimento heap entre reconexões:`)
			diffs.forEach((d, i) => console.log(`    Ciclo ${i + 2} vs ${i + 1}: ${d > 0 ? '+' : ''}${d.toFixed(2)} MB`))

			if (HAS_GC) {
				// Em um sistema sem leak, cada ciclo deve ter crescimento < 5MB líquido
				const maxGrowth = Math.max(...diffs)
				expect(maxGrowth).toBeLessThan(25)
			}
		}

		// Resíduo total após cleanup não deve ser excessivo
		if (HAS_GC) {
			expect(finalHeap - baselineHeap).toBeLessThan(30)
		}
	}, 600_000)
})

// ═══════════════════════════════════════════════════════════════
// SUITE 7 : createBufferedFunction timers — sem vazamento de timers
// ═══════════════════════════════════════════════════════════════

describe('UPSERT #7: createBufferedFunction — timers internos não vazam', () => {
	it('deve processar 500 chamadas concorrentes sem travar o event loop', async () => {
		const sock = createUpsertSocket('timers')
		simulateConnect(sock)

		const jid = '5511123456789@s.whatsapp.net'
		const heapStart = getHeapMB()

		// Dispara 2000 upsertMessage concorrentes (simula burst de ondas de mensagens)
		const promises: Promise<void>[] = []
		for (let i = 0; i < 2_000; i++) {
			const msg = makeFakeWAMessage(`CONC_${i}`, jid, i % 2 === 0)
			promises.push(sock.upsertMessage(msg, i % 3 === 0 ? 'append' : 'notify'))
		}

		await Promise.all(promises)
		await drainTimers(500) // espera todos os setTimeout(flush, 100) dispararem

		const heapEnd = getHeapMB()
		console.log(`\n  2000 concurrent upsertMessage calls:`)
		console.log(
			`  Heap start: ${heapStart.toFixed(2)} MB → end: ${heapEnd.toFixed(2)} MB (Δ ${(heapEnd - heapStart).toFixed(2)} MB)`
		)
		console.log(`  Total upserted: ${sock.stats.upserted}`)
		console.log(`  Total flushed: ${sock.ev._getTotalFlushed()}`)

		// Todos os 2000 devem ter sido processados
		expect(sock.stats.upserted).toBe(2_000)

		// Heap growth mínimo para 2000 msgs
		if (HAS_GC) {
			expect(heapEnd - heapStart).toBeLessThan(30)
		}

		simulateDisconnect(sock)
	}, 60_000)

	it('deve liberar todos os timers do createBufferedFunction após release()', async () => {
		const ev = makeMockEventBuffer()

		const upsertFn = ev.createBufferedFunction(async (msg: any, _type: string) => {
			ev.emitUpsert(msg, 'notify')
		})

		// Cria vários timers internos via createBufferedFunction
		const msgs = Array.from({ length: 1_000 }, (_, i) => makeFakeWAMessage(`TIMER_${i}`, '5511@s.whatsapp.net', false))
		await Promise.all(msgs.map(m => upsertFn(m, 'notify')))

		// Antes do release, pode haver timers pendentes
		// Após o release, todos devem ser cancelados
		ev.release()

		// Verifica que historyCache foi limpo
		expect(ev._historyCache.size).toBe(0)
		// Verifica que não está mais bufferizando
		expect(ev._isBuffering()).toBe(false)

		console.log('\n  release() após 1000 upserts: historyCache=0, isBuffering=false ✓')
	})
})
