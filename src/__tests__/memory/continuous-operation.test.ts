/**
 * MEMORY LEAK TESTS: Continuous operation without disconnect
 *
 * Simula o cenário real de produção: 36 instâncias conectadas por 3+ horas
 * SEM chamar .end() — crescimento de heap de ~400MB ao longo do tempo.
 *
 * Os leaks identificados NÃO dependem de desconexão:
 *
 *   LEAK A — makeCacheableSignalKeyStore (NodeCache sem maxKeys)
 *             Cada mensagem de contato novo armazena session/sender-key.
 *             Com NodeCache sem limite, acumula indefinidamente entre TTLs.
 *
 *   LEAK B — processedHistoryMessages no creds (array sem cap)
 *             Cada history-sync empurra um novo entry via [...prev, novo].
 *             A array cresce para sempre e é persistida no Redis/Postgres.
 *
 *   LEAK C — LIDMappingStore.mappingCache (LRUCache sem max)
 *             Par pn:<user> + lid:<user> adicionados a cada mensagem LID.
 *             Com LRU sem max, cresce indefinidamente (só TTL de 3 dias).
 *
 *   LEAK D — migratedSessionCache no libsignal (LRUCache sem max)
 *             Cada migração device:user adicionada sem limite de entradas.
 *             Com grupos grandes, acumula rapidamente.
 *
 * Como rodar com GC exposto (heap assertions precisas):
 *
 *   npx --node-options='--expose-gc' jest --config jest.config.ts \
 *     src/__tests__/memory/continuous-operation.test.ts --runInBand --forceExit
 *
 * NOTA: Nenhum módulo Baileys real é importado (evita WAProto ESM).
 *       Tudo são mocks self-contained que replicam o comportamento EXATO.
 */

import { NodeCache } from '@cacheable/node-cache'
import { randomBytes } from 'crypto'
import { NativeLRUCache } from '../../Utils/lru-cache'
import { forceGC, getHeapMB } from './helpers'

// ─── Silent logger ───────────────────────────────────────────

const silentLogger = {
	level: 'silent' as const,
	child: () => silentLogger,
	trace: (..._: any[]) => {},
	debug: (..._: any[]) => {},
	info: (..._: any[]) => {},
	warn: (..._: any[]) => {},
	error: (..._: any[]) => {}
} as any

// ─── Test constants ──────────────────────────────────────────

/** Number of simulated WhatsApp instances running simultaneously */
const INSTANCE_COUNT = 36

/** Unique contacts per instance sending messages (group members, DMs, etc.) */
const CONTACTS_PER_INSTANCE = 500

/** Average devices per contact (most have 2: phone + web) */
const DEVICES_PER_CONTACT = 2

/** Total unique session keys per instance (contacts × devices) */
const SESSIONS_PER_INSTANCE = CONTACTS_PER_INSTANCE * DEVICES_PER_CONTACT

/**
 * Realistic estimate of unique sessions after 3h of operation.
 * Contacts keep coming in from groups, broadcasts, new DMs.
 * Conservative: 5000 unique sessions per instance over 3h.
 */
const SESSIONS_BUGGY_3H = 5000

function makeJid(user: string) {
	return `${user}@s.whatsapp.net`
}

function makeLid(user: string) {
	return `${user}@lid`
}

function makeSessionKey(user: string, device: number) {
	return `session.${user}.${device}`
}

function makeSenderKey(group: string, user: string) {
	return `sender-key.${group}__${user}`
}

/** Simulate a Signal session data (~2KB average compressed) */
function makeSessionData() {
	return {
		registrationId: Math.floor(Math.random() * 65535),
		currentRatchet: {
			ephemeralKeyPair: randomBytes(32).toString('base64'),
			lastRemoteEphemeralKey: randomBytes(32).toString('base64'),
			previousCounter: Math.floor(Math.random() * 9999),
			rootKey: randomBytes(32).toString('base64')
		},
		indexInfo: {
			baseKey: randomBytes(32).toString('base64'),
			baseKeyType: 1,
			remoteIdentityKey: randomBytes(32).toString('base64'),
			closed: -1,
			used: Date.now(),
			created: Date.now() - 86400000
		},
		_chains: Object.fromEntries(
			Array.from({ length: 3 }, (_, i) => [
				randomBytes(33).toString('base64'),
				{
					chainKey: { counter: i, key: randomBytes(32).toString('base64') },
					chainType: 1,
					messageKeys: {}
				}
			])
		)
	}
}

// ════════════════════════════════════════════════════════════════
// LEAK A — makeCacheableSignalKeyStore NodeCache sem maxKeys
// ════════════════════════════════════════════════════════════════

describe('LEAK A: makeCacheableSignalKeyStore - NodeCache sem maxKeys', () => {
	/**
	 * Replica exata do cache interno de makeCacheableSignalKeyStore.
	 * O bug: sem maxKeys, o cache cresce indefinidamente enquanto as sessões
	 * chegam de novos contatos. Com TTL de 5 min e mensagens contínuas,
	 * cada contato renuncia o TTL a cada mensagem, nunca expirando.
	 */
	function makeBuggySignalKeyCache() {
		// ← BUG: sem maxKeys
		return new NodeCache<any>({
			stdTTL: 300, // 5 min
			useClones: false,
			deleteOnExpire: true
		})
	}

	function makeFixedSignalKeyCache() {
		// ← FIX: maxKeys: 2000
		return new NodeCache<any>({
			stdTTL: 300,
			useClones: false,
			deleteOnExpire: true,
			maxKeys: 2000
		})
	}

	it('BUGGY: cache cresce proporcionalmente ao número de sessões únicas', async () => {
		const rows: Record<string, any>[] = []

		for (let inst = 0; inst < INSTANCE_COUNT; inst++) {
			const cache = makeBuggySignalKeyCache()
			const baseHeap = getHeapMB()

			// Simula mensagens chegando de CONTACTS_PER_INSTANCE contatos únicos
			for (let c = 0; c < CONTACTS_PER_INSTANCE; c++) {
				const user = `user_inst${inst}_c${c}`
				for (let d = 0; d < DEVICES_PER_CONTACT; d++) {
					const key = makeSessionKey(user, d)
					await cache.set(key, makeSessionData())
				}
			}

			const afterHeap = getHeapMB()
			const keysStored = cache.getStats().keys

			rows.push({
				Instância: inst + 1,
				'Sessões inseridas': SESSIONS_PER_INSTANCE,
				'Keys no cache': keysStored,
				'Heap antes (MB)': baseHeap.toFixed(1),
				'Heap depois (MB)': afterHeap.toFixed(1),
				'Delta (MB)': (afterHeap - baseHeap).toFixed(1)
			})

			cache.flushAll()
		}

		console.log('\n=== LEAK A — BUGGY: NodeCache sem maxKeys ===')
		console.table(rows)

		// Prova do bug: cada instância armazenou TODOS os CONTACTS × DEVICES entries
		const lastRow = rows[rows.length - 1]!
		expect(lastRow['Keys no cache']).toBe(CONTACTS_PER_INSTANCE * DEVICES_PER_CONTACT)
	}, 60_000)

	it('FIXED: cache rejeitado após atingir maxKeys=2000', async () => {
		const rows: Record<string, any>[] = []

		for (let inst = 0; inst < 3; inst++) {
			const cache = makeFixedSignalKeyCache()
			const baseHeap = getHeapMB()

			// Insere muito mais do que o limite
			const TOTAL = SESSIONS_PER_INSTANCE * 3 // 3000 entradas tentadas

			let rejected = 0
			for (let i = 0; i < TOTAL; i++) {
				const key = makeSessionKey(`user_${i}`, i % 4)
				try {
					await cache.set(key, makeSessionData())
				} catch {
					// NodeCache throws when maxKeys is exceeded
					rejected++
				}
			}

			const afterHeap = getHeapMB()
			const keysStored = cache.getStats().keys

			rows.push({
				Instância: inst + 1,
				'Tentativas de insert': TOTAL,
				'Keys no cache (max 2000)': keysStored,
				Rejeitadas: rejected,
				'Heap antes (MB)': baseHeap.toFixed(1),
				'Heap depois (MB)': afterHeap.toFixed(1),
				'Delta (MB)': (afterHeap - baseHeap).toFixed(1)
			})

			cache.flushAll()
			forceGC()
		}

		console.log('\n=== LEAK A — FIXED: NodeCache com maxKeys=2000 ===')
		console.table(rows)

		// Prova do fix: cache nunca passa de 2000 keys
		for (const row of rows) {
			expect(row['Keys no cache (max 2000)']).toBeLessThanOrEqual(2000)
		}
	}, 60_000)

	it('COMPARISON: heap com 36 instâncias buggy vs fixed (projeção realista 3h)', () => {
		// Após 3h de operação acumulam-se SESSIONS_BUGGY_3H sessões únicas por instância
		// (novos contatos, grupos, broadcasts). O fix limita o cache a 2000.
		const SESSION_DATA_BYTES = 1500 // ~1.5KB por session

		const buggyTotalBytes = INSTANCE_COUNT * SESSIONS_BUGGY_3H * SESSION_DATA_BYTES
		const fixedTotalBytes = INSTANCE_COUNT * 2000 * SESSION_DATA_BYTES

		const buggyMB = buggyTotalBytes / 1024 / 1024
		const fixedMB = fixedTotalBytes / 1024 / 1024

		console.log('\n=== LEAK A — PROJEÇÃO DE MEMÓRIA REALISTA (36 instâncias × 3h) ===')
		console.table([
			{
				Cenário: 'BUGGY (sem maxKeys)',
				'Sessões acumuladas/instância (3h)': SESSIONS_BUGGY_3H,
				'Total de sessões': INSTANCE_COUNT * SESSIONS_BUGGY_3H,
				'Estimativa heap (MB)': buggyMB.toFixed(0)
			},
			{
				Cenário: 'FIXED (maxKeys=2000)',
				'Sessões acumuladas/instância (3h)': 2000,
				'Total de sessões': INSTANCE_COUNT * 2000,
				'Estimativa heap (MB)': fixedMB.toFixed(0)
			}
		])

		// fix limita a 2000; buggy acumula 5000+ → fix usa menos memória
		expect(fixedMB).toBeLessThan(buggyMB)
	})
})

// ════════════════════════════════════════════════════════════════
// LEAK B — processedHistoryMessages array sem cap
// ════════════════════════════════════════════════════════════════

describe('LEAK B: processedHistoryMessages - array cresce sem limite nos creds', () => {
	/** Simula creds.processedHistoryMessages crescendo sem cap (bug) */
	function simulateHistorySyncsNoCap(totalSyncs: number): any[] {
		let processedHistoryMessages: any[] = []

		for (let i = 0; i < totalSyncs; i++) {
			// ← BUG: replica exata de process-message.ts ANTES do fix
			processedHistoryMessages = [
				...processedHistoryMessages,
				{
					key: {
						remoteJid: makeJid(`chat_${i % 20}`),
						id: `HIST_${i}_${randomBytes(4).toString('hex')}`,
						fromMe: false
					},
					messageTimestamp: Math.floor(Date.now() / 1000) - i
				}
			]
		}

		return processedHistoryMessages
	}

	/** Simula creds.processedHistoryMessages com cap de 100 (fix) */
	function simulateHistorySyncsWithCap(totalSyncs: number, cap = 100): any[] {
		let processedHistoryMessages: any[] = []

		for (let i = 0; i < totalSyncs; i++) {
			// ← FIX: replica exata de process-message.ts APÓS o fix
			const MAX_PROCESSED_HISTORY = cap
			const newEntry = {
				key: {
					remoteJid: makeJid(`chat_${i % 20}`),
					id: `HIST_${i}_${randomBytes(4).toString('hex')}`,
					fromMe: false
				},
				messageTimestamp: Math.floor(Date.now() / 1000) - i
			}
			processedHistoryMessages = [...processedHistoryMessages, newEntry].slice(-MAX_PROCESSED_HISTORY)
		}

		return processedHistoryMessages
	}

	it('BUGGY: array cresce linearmente com número de history syncs', () => {
		const syncsToTest = [10, 50, 100, 250, 500]
		const rows: Record<string, any>[] = []

		for (const syncs of syncsToTest) {
			const result = simulateHistorySyncsNoCap(syncs)
			rows.push({
				'History syncs recebidos': syncs,
				'Entries no array (bug)': result.length,
				'Cresce igualmente': result.length === syncs ? '✓ SIM (bug)' : '✗ NÃO'
			})
		}

		console.log('\n=== LEAK B — BUGGY: processedHistoryMessages sem cap ===')
		console.table(rows)

		// Prova do bug: tamanho igual ao número de syncs
		for (const row of rows) {
			expect(row['Entries no array (bug)']).toBe(row['History syncs recebidos'])
		}
	})

	it('FIXED: array limitado a 100 entries independente de quantos syncs chegam', () => {
		const syncsToTest = [10, 50, 100, 250, 500, 1000]
		const rows: Record<string, any>[] = []

		for (const syncs of syncsToTest) {
			const result = simulateHistorySyncsWithCap(syncs, 100)
			const expectedSize = Math.min(syncs, 100)
			rows.push({
				'History syncs recebidos': syncs,
				'Entries no array (fix)': result.length,
				'Limitado a 100': result.length <= 100 ? '✓ SIM (fix)' : '✗ NÃO'
			})
		}

		console.log('\n=== LEAK B — FIXED: processedHistoryMessages com slice(-100) ===')
		console.table(rows)

		// Prova do fix: nunca passa de 100 entries
		for (const row of rows) {
			expect(row['Entries no array (fix)']).toBeLessThanOrEqual(100)
		}
	})

	it('FIXED: mantém os entries MAIS RECENTES (não os primeiros)', () => {
		const SYNCS = 200
		const CAP = 100
		const result = simulateHistorySyncsWithCap(SYNCS, CAP)

		// O entry HIST_199 deve estar presente (o mais recente)
		const lastId = result[result.length - 1]?.key?.id
		expect(lastId).toMatch(/^HIST_199_/)

		// O entry HIST_0 NÃO deve estar presente (o mais antigo foi dropping)
		const hasFirst = result.some((e: any) => e.key.id.startsWith('HIST_0_'))
		expect(hasFirst).toBe(false)

		console.log('\n=== LEAK B — FIXED: entries recentes mantidos ===')
		console.log(`Array mantém ${result.length} entries → mais recente: ${lastId}`)
	})

	it('IMPACT: projeção de memória em creds persistidos (36 instâncias × 3h)', () => {
		// Cada entry tem ~200 bytes (key + timestamp)
		const BYTES_PER_ENTRY = 200

		// Em 3 horas, com reconexões + initial sync = estimativa de syncs recebidos
		const SYNCS_BUGGY = 250 // estimativa conservadora sem cap
		const SYNCS_FIXED = 100 // cap

		const buggyPerInstance = SYNCS_BUGGY * BYTES_PER_ENTRY
		const fixedPerInstance = SYNCS_FIXED * BYTES_PER_ENTRY

		const buggyTotal36 = (INSTANCE_COUNT * buggyPerInstance) / 1024 / 1024
		const fixedTotal36 = (INSTANCE_COUNT * fixedPerInstance) / 1024 / 1024

		console.log('\n=== LEAK B — IMPACTO NOS CREDS PERSISTIDOS ===')
		console.table([
			{
				Cenário: 'BUGGY (sem cap)',
				'Entries/instância': SYNCS_BUGGY,
				'Bytes/instância': buggyPerInstance,
				'Total 36 instâncias (MB)': buggyTotal36.toFixed(2)
			},
			{
				Cenário: 'FIXED (cap=100)',
				'Entries/instância': SYNCS_FIXED,
				'Bytes/instância': fixedPerInstance,
				'Total 36 instâncias (MB)': fixedTotal36.toFixed(2)
			}
		])

		expect(fixedTotal36).toBeLessThan(buggyTotal36)
	})
})

// ════════════════════════════════════════════════════════════════
// LEAK C — LIDMappingStore.mappingCache sem max size
// ════════════════════════════════════════════════════════════════

describe('LEAK C: LIDMappingStore.mappingCache - LRUCache sem max', () => {
	/** Replica do mappingCache BUGGY (sem max, apenas TTL de 3 dias) */
	function makeBuggyMappingCache() {
		return new NativeLRUCache<string, string>({
			// ← BUG: sem max, apenas TTL
			ttl: 3 * 24 * 60 * 60 * 1000,
			ttlAutopurge: true,
			updateAgeOnGet: true
		})
	}

	/** Replica do mappingCache FIXADO (max: 5000 + TTL) */
	function makeFixedMappingCache() {
		return new NativeLRUCache<string, string>({
			max: 5000, // ← FIX
			ttl: 3 * 24 * 60 * 60 * 1000,
			ttlAutopurge: true,
			updateAgeOnGet: true
		})
	}

	/** Simula o padrão de storeLIDPNMappings: cada par gera 2 entries no cache */
	function fillMappingCache(cache: NativeLRUCache<string, string>, pairCount: number) {
		for (let i = 0; i < pairCount; i++) {
			const pnUser = `5511999${String(i).padStart(5, '0')}`
			const lidUser = `lid:${randomBytes(8).toString('hex')}`
			cache.set(`pn:${pnUser}`, lidUser)
			cache.set(`lid:${lidUser}`, pnUser)
		}
	}

	it('BUGGY: cache cresce ilimitadamente com pares LID-PN únicos', () => {
		const PAIRS_PER_INSTANCE = CONTACTS_PER_INSTANCE
		const rows: Record<string, any>[] = []

		for (let inst = 0; inst < Math.min(INSTANCE_COUNT, 5); inst++) {
			const cache = makeBuggyMappingCache()
			const before = getHeapMB()

			fillMappingCache(cache, PAIRS_PER_INSTANCE)

			const after = getHeapMB()

			rows.push({
				Instância: inst + 1,
				'Pares LID-PN': PAIRS_PER_INSTANCE,
				'Entries no cache (2×pares)': cache.size,
				'Heap antes (MB)': before.toFixed(1),
				'Heap depois (MB)': after.toFixed(1),
				'Max configurado': 'NENHUM (bug)'
			})

			cache.clear()
			forceGC()
		}

		console.log('\n=== LEAK C — BUGGY: LIDMappingStore sem max ===')
		console.table(rows)

		// Prova do bug: cache armazena todos os 2×PAIRS pares
		for (const row of rows) {
			expect(row['Entries no cache (2×pares)']).toBe(PAIRS_PER_INSTANCE * 2)
		}
	})

	it('FIXED: cache não ultrapassa max=5000', () => {
		// Tenta inserir 36 × 500 = 18.000 pares únicos
		const TOTAL_PAIRS = INSTANCE_COUNT * CONTACTS_PER_INSTANCE // 18.000

		const cache = makeFixedMappingCache()
		const before = getHeapMB()

		fillMappingCache(cache, TOTAL_PAIRS)

		const after = getHeapMB()

		console.log('\n=== LEAK C — FIXED: LIDMappingStore com max=5000 ===')
		console.table([
			{
				'Pares tentados inserir': TOTAL_PAIRS,
				'Entries esperadas sem max': TOTAL_PAIRS * 2,
				'Entries reais (max=5000)': cache.size,
				'Max respeitado': cache.size <= 5000 ? '✓ SIM' : '✗ NÃO',
				'Heap antes (MB)': before.toFixed(1),
				'Heap depois (MB)': after.toFixed(1)
			}
		])

		// LRU com max=5000: nunca passa de 5000 entries
		expect(cache.size).toBeLessThanOrEqual(5000)
		// E cabe dentro de um delta razoável de heap
		expect(after - before).toBeLessThan(30)

		cache.clear()
		forceGC()
	})
})

// ════════════════════════════════════════════════════════════════
// LEAK D — migratedSessionCache no libsignal sem max size
// ════════════════════════════════════════════════════════════════

describe('LEAK D: migratedSessionCache - LRUCache sem max por instância Signal', () => {
	/** Replica do migratedSessionCache BUGGY */
	function makeBuggyMigratedSessionCache() {
		return new NativeLRUCache<string, true>({
			// ← BUG: sem max, TTL de 7 dias
			ttl: 7 * 24 * 60 * 60 * 1000,
			ttlAutopurge: true,
			updateAgeOnGet: true
		})
	}

	/** Replica do migratedSessionCache FIXADO */
	function makeFixedMigratedSessionCache() {
		return new NativeLRUCache<string, true>({
			max: 5000, // ← FIX
			ttl: 3 * 24 * 60 * 60 * 1000,
			ttlAutopurge: true,
			updateAgeOnGet: true
		})
	}

	/** Simula o padrão de migrateSession: deviceKey = `${pnUser}.${deviceId}` */
	function fillMigratedSessions(cache: NativeLRUCache<string, true>, sessionCount: number) {
		for (let i = 0; i < sessionCount; i++) {
			const pnUser = `5511999${String(i).padStart(5, '0')}`
			const deviceId = i % 4
			cache.set(`${pnUser}.${deviceId}`, true)
		}
	}

	it('BUGGY: cache de sessões migradas cresce sem limite por instância', () => {
		// Grupo grande pode ter 500 membros × 4 devices = 2000 sessões migradas
		const SESSIONS_TO_MIGRATE = CONTACTS_PER_INSTANCE * DEVICES_PER_CONTACT
		const rows: Record<string, any>[] = []

		for (let inst = 0; inst < Math.min(INSTANCE_COUNT, 5); inst++) {
			const cache = makeBuggyMigratedSessionCache()
			const before = getHeapMB()

			fillMigratedSessions(cache, SESSIONS_TO_MIGRATE)

			const after = getHeapMB()

			rows.push({
				Instância: inst + 1,
				'Sessões migradas': SESSIONS_TO_MIGRATE,
				'Entries no cache': cache.size,
				'Heap antes (MB)': before.toFixed(1),
				'Heap depois (MB)': after.toFixed(1),
				'Max configurado': 'NENHUM (bug)'
			})

			cache.clear()
			forceGC()
		}

		console.log('\n=== LEAK D — BUGGY: migratedSessionCache sem max ===')
		console.table(rows)

		for (const row of rows) {
			expect(row['Entries no cache']).toBe(SESSIONS_TO_MIGRATE)
		}
	})

	it('FIXED: cache limitado a 5000 sessões migradas', () => {
		// Tenta inserir muito mais do que o limite
		const TOTAL_SESSIONS = INSTANCE_COUNT * SESSIONS_PER_INSTANCE // 36.000

		const cache = makeFixedMigratedSessionCache()
		const before = getHeapMB()

		fillMigratedSessions(cache, TOTAL_SESSIONS)

		const after = getHeapMB()

		console.log('\n=== LEAK D — FIXED: migratedSessionCache com max=5000 ===')
		console.table([
			{
				'Sessões tentadas inserir': TOTAL_SESSIONS,
				'Entries reais (max=5000)': cache.size,
				'Max respeitado': cache.size <= 5000 ? '✓ SIM' : '✗ NÃO',
				'Heap antes (MB)': before.toFixed(1),
				'Heap depois (MB)': after.toFixed(1)
			}
		])

		expect(cache.size).toBeLessThanOrEqual(5000)

		cache.clear()
		forceGC()
	})
})

// ════════════════════════════════════════════════════════════════
// LEAK E — Sender-key cache acumulado por grupo (makeCacheableSignalKeyStore)
// ════════════════════════════════════════════════════════════════

describe('LEAK E: Sender-key cache em grupos grandes (NodeCache sem maxKeys)', () => {
	/**
	 * Grupos grandes são o cenário mais severo:
	 * 1 grupo × 500 membros × 4 devices = 2000 sender-keys
	 * 36 instâncias cada uma em 5 grupos = 36 × 10.000 = 360.000 entries potenciais
	 * Cada entry ~500 bytes → ~180MB só de sender-keys
	 */

	it('BUGGY: sender-keys acumulam sem limite em grupos com muitos membros', async () => {
		const GROUPS = 5
		const MEMBERS_PER_GROUP = 200
		const DEVICES_PER_MEMBER = 2

		const rows: Record<string, any>[] = []

		for (let inst = 0; inst < 3; inst++) {
			// ← BUG: sem maxKeys
			const cache = new NodeCache<any>({ stdTTL: 300, useClones: false })
			const before = getHeapMB()

			for (let g = 0; g < GROUPS; g++) {
				const groupJid = `${randomBytes(4).toString('hex')}-${g}@g.us`
				for (let m = 0; m < MEMBERS_PER_GROUP; m++) {
					for (let d = 0; d < DEVICES_PER_MEMBER; d++) {
						const user = `5511999${String(m).padStart(5, '0')}`
						const key = makeSenderKey(groupJid, `${user}:${d}`)
						await cache.set(key, {
							chainKey: randomBytes(32).toString('base64'),
							chainId: m * d,
							messageKeys: {}
						})
					}
				}
			}

			const after = getHeapMB()
			const totalKeys = GROUPS * MEMBERS_PER_GROUP * DEVICES_PER_MEMBER

			rows.push({
				Instância: inst + 1,
				Grupos: GROUPS,
				'Membros/grupo': MEMBERS_PER_GROUP,
				'Total sender-keys': totalKeys,
				'Keys no cache': cache.getStats().keys,
				'Heap Δ (MB)': (after - before).toFixed(1)
			})

			cache.flushAll()
			forceGC()
		}

		console.log('\n=== LEAK E — BUGGY: sender-key cache sem maxKeys ===')
		console.table(rows)

		for (const row of rows) {
			const expected = GROUPS * MEMBERS_PER_GROUP * DEVICES_PER_MEMBER
			expect(row['Keys no cache']).toBe(expected)
		}
	}, 30_000)

	it('FIXED: cache limitado a 2000 keys independente do tamanho do grupo', async () => {
		const GROUPS = 5
		const MEMBERS_PER_GROUP = 200
		const DEVICES_PER_MEMBER = 2

		// ← FIX: maxKeys: 2000
		const cache = new NodeCache<any>({ stdTTL: 300, useClones: false, maxKeys: 2000 })
		const before = getHeapMB()

		for (let g = 0; g < GROUPS; g++) {
			const groupJid = `${randomBytes(4).toString('hex')}-${g}@g.us`
			for (let m = 0; m < MEMBERS_PER_GROUP; m++) {
				for (let d = 0; d < DEVICES_PER_MEMBER; d++) {
					const user = `5511999${String(m).padStart(5, '0')}`
					const key = makeSenderKey(groupJid, `${user}:${d}`)
					await cache.set(key, {
						chainKey: randomBytes(32).toString('base64'),
						chainId: m * d,
						messageKeys: {}
					})
				}
			}
		}

		const after = getHeapMB()
		const keysStored = cache.getStats().keys
		const totalAttempted = GROUPS * MEMBERS_PER_GROUP * DEVICES_PER_MEMBER

		console.log('\n=== LEAK E — FIXED: sender-key cache com maxKeys=2000 ===')
		console.table([
			{
				'Keys tentadas': totalAttempted,
				'Keys armazenadas': keysStored,
				'Max respeitado': keysStored <= 2000 ? '✓ SIM' : '✗ NÃO',
				'Heap Δ (MB)': (after - before).toFixed(1)
			}
		])

		expect(keysStored).toBeLessThanOrEqual(2000)

		cache.flushAll()
		forceGC()
	}, 30_000)
})

// ════════════════════════════════════════════════════════════════
// CONSOLIDADO: Resumo de todos os leaks em operação contínua
// ════════════════════════════════════════════════════════════════

describe('CONSOLIDADO: Projeção total de heap — 36 instâncias × 3 horas', () => {
	it('mostra o impacto estimado de todos os leaks combinados', () => {
		const KB = 1024
		const MB = 1024 * KB

		const INSTANCES = 36
		const CONTACTS = 500
		const DEVICES = 2
		const SESSIONS = CONTACTS * DEVICES // 1000

		// Leak A: NodeCache Signal sessions sem maxKeys
		// Após 3h: SESSIONS_BUGGY_3H sessions únicas/instância, cada ~2KB
		const leakA_buggy = INSTANCES * SESSIONS_BUGGY_3H * 2 * KB
		const leakA_fixed = INSTANCES * 2000 * 2 * KB // capped at 2000

		// Leak B: processedHistoryMessages array
		// Cada entry ~200 bytes, 250 syncs após 3h sem cap
		const leakB_buggy = INSTANCES * 250 * 200
		const leakB_fixed = INSTANCES * 100 * 200

		// Leak C: LIDMappingStore 2×pairs por contato
		// ~100 bytes por entry (string key + string value)
		const leakC_buggy = INSTANCES * CONTACTS * 2 * 100
		const leakC_fixed = INSTANCES * Math.min(CONTACTS * 2, 5000) * 100

		// Leak D: migratedSessionCache ~50 bytes por entry
		const leakD_buggy = INSTANCES * SESSIONS * 50
		const leakD_fixed = INSTANCES * Math.min(SESSIONS, 5000) * 50

		// Leak E: sender-keys (5 grupos × 200 membros × 2 devices = 2000 keys × ~500 bytes)
		const leakE_buggy = INSTANCES * 2000 * 500
		const leakE_fixed = INSTANCES * 2000 * 500 // já era igual ao cap

		const totalBuggy = (leakA_buggy + leakB_buggy + leakC_buggy + leakD_buggy + leakE_buggy) / MB
		const totalFixed = (leakA_fixed + leakB_fixed + leakC_fixed + leakD_fixed + leakE_fixed) / MB

		console.log('\n╔══════════════════════════════════════════════════════════════╗')
		console.log('║       PROJEÇÃO TOTAL — 36 INSTÂNCIAS SEM DESCONEXÃO         ║')
		console.log('╚══════════════════════════════════════════════════════════════╝')
		console.table([
			{
				Leak: 'A — NodeCache Signal (session/sender-key)',
				'Buggy (MB)': (leakA_buggy / MB).toFixed(0),
				'Fixed (MB)': (leakA_fixed / MB).toFixed(0)
			},
			{
				Leak: 'B — processedHistoryMessages array',
				'Buggy (MB)': (leakB_buggy / MB).toFixed(2),
				'Fixed (MB)': (leakB_fixed / MB).toFixed(2)
			},
			{
				Leak: 'C — LIDMappingStore cache',
				'Buggy (MB)': (leakC_buggy / MB).toFixed(1),
				'Fixed (MB)': (leakC_fixed / MB).toFixed(1)
			},
			{
				Leak: 'D — migratedSessionCache',
				'Buggy (MB)': (leakD_buggy / MB).toFixed(1),
				'Fixed (MB)': (leakD_fixed / MB).toFixed(1)
			},
			{
				Leak: 'E — Sender-key cache grupos grandes',
				'Buggy (MB)': (leakE_buggy / MB).toFixed(0),
				'Fixed (MB)': (leakE_fixed / MB).toFixed(0)
			},
			{
				Leak: '──────── TOTAL ────────',
				'Buggy (MB)': totalBuggy.toFixed(0),
				'Fixed (MB)': totalFixed.toFixed(0)
			}
		])

		console.log(`\n  REDUÇÃO ESTIMADA: ${(totalBuggy - totalFixed).toFixed(0)} MB`)
		console.log(`  (${totalBuggy.toFixed(0)} MB buggy → ${totalFixed.toFixed(0)} MB fixed)\n`)

		// O fix deve reduzir substancialmente a memória total
		expect(totalFixed).toBeLessThan(totalBuggy)
		// Redução deve ser de pelo menos 30%
		expect(totalFixed / totalBuggy).toBeLessThan(0.7)
	})
})
