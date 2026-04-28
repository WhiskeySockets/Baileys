import { Boom } from '@hapi/boom'
import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import { Agent } from 'node:https'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import P, { type Logger } from 'pino'
import makeWASocket, {
	type BaileysEventMap,
	DisconnectReason,
	jidNormalizedUser,
	makeCacheableSignalKeyStore,
	type proto,
	useMultiFileAuthState
} from '../../../index'
import { postQrToMockPhone } from './mock-phone'

const DEFAULT_SOCKET_URL = 'wss://127.0.0.1:8080/ws/chat'
const DEFAULT_ADV_SECRET_KEY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
const DEFAULT_TIMEOUT_MS = 30_000

export type Socket = ReturnType<typeof makeWASocket>
export type WAMessageInfo = proto.IWebMessageInfo
export type MessagePredicate = (msg: WAMessageInfo) => boolean

export interface TestClientOptions {
	socketUrl?: string
	/** Defaults to a unique tmp dir so concurrent clients don't collide. */
	authDir?: string
	/** Bartender derives a deterministic phone number from this. Defaults to a unique value. */
	pushName?: string
	advSecretKey?: string
	logLevel?: P.Level
	resolveTestGroup?: boolean
	testGroupName?: string
}

interface ResolvedConfig {
	socketUrl: string
	authDir: string
	pushName?: string
	advSecretKey: string
	logger: Logger
	agent: Agent
}

const uniquePushName = (prefix = 'baileys-e2e') => `${prefix}-${randomUUID()}`

const resolveConfig = (opts: TestClientOptions): ResolvedConfig => ({
	socketUrl: opts.socketUrl ?? process.env.SOCKET_URL ?? DEFAULT_SOCKET_URL,
	authDir: opts.authDir ?? join(tmpdir(), `baileys-e2e-${randomUUID()}`),
	pushName: opts.pushName,
	advSecretKey: opts.advSecretKey ?? process.env.ADV_SECRET_KEY ?? DEFAULT_ADV_SECRET_KEY,
	logger: P({ level: opts.logLevel ?? 'debug' }),
	// self-signed mock-server cert
	agent: new Agent({ rejectUnauthorized: false })
})

const getDisconnectReason = (lastDisconnect: { error?: unknown } | undefined): DisconnectReason | undefined => {
	const error = lastDisconnect?.error
	if (error instanceof Boom) {
		return error.output?.statusCode
	}

	return undefined
}

type AttemptResult =
	| { kind: 'open'; meJid: string; meLid: string | undefined }
	| { kind: 'reconnect'; reason: string }
	| { kind: 'logged-out' }
	| { kind: 'error'; error: Error }

interface AttemptOutcome {
	sock: Socket
	saveCreds: () => Promise<void>
	result: AttemptResult
}

const attemptConnect = async (config: ResolvedConfig): Promise<AttemptOutcome> => {
	const { state, saveCreds } = await useMultiFileAuthState(config.authDir)
	state.creds.advSecretKey = config.advSecretKey

	const sock = makeWASocket({
		auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, config.logger) },
		waWebSocketUrl: config.socketUrl,
		pushName: config.pushName,
		logger: config.logger,
		agent: config.agent,
		fetchAgent: config.agent
	})
	sock.ev.on('creds.update', saveCreds)

	const result = await new Promise<AttemptResult>(resolve => {
		let qrScanned = false

		sock.ev.on('connection.update', update => {
			const { connection, lastDisconnect, qr } = update

			if (qr && !qrScanned) {
				qrScanned = true
				postQrToMockPhone(config.socketUrl, qr).catch(error => resolve({ kind: 'error', error: toError(error) }))
				return
			}

			if (connection === 'open') {
				if (!sock.user?.id) {
					resolve({ kind: 'error', error: new Error('socket reported open without user.id') })
					return
				}

				resolve({ kind: 'open', meJid: jidNormalizedUser(sock.user.id), meLid: sock.user.lid })
				return
			}

			if (connection === 'close') {
				const reason = getDisconnectReason(lastDisconnect)
				if (reason === DisconnectReason.loggedOut) {
					resolve({ kind: 'logged-out' })
					return
				}

				const label = reason !== undefined ? (DisconnectReason[reason] ?? String(reason)) : 'unknown'
				resolve({ kind: 'reconnect', reason: label })
			}
		})
	})

	return { sock, saveCreds, result }
}

const safeEnd = async (sock: Socket): Promise<void> => {
	try {
		await sock.end(undefined)
	} catch {
		// already closed; nothing actionable in tests
	}
}

/**
 * Generic event-listener-with-timeout. `subscribe` registers a listener that
 * may call `emit(value)` once a match is found, and returns an unsubscribe
 * function. The first emit (or the timeout) cleans up before settling.
 */
const waitWithTimeout = <T>(
	subscribe: (emit: (value: T) => void) => () => void,
	timeoutMs: number,
	label: string
): Promise<T> =>
	new Promise<T>((resolve, reject) => {
		let unsubscribe: () => void = () => {}

		const cleanup = () => {
			clearTimeout(timer)
			unsubscribe()
		}

		const timer = setTimeout(() => {
			cleanup()
			reject(new Error(`Timed out after ${timeoutMs}ms waiting for ${label}`))
		}, timeoutMs)

		unsubscribe = subscribe(value => {
			cleanup()
			resolve(value)
		})
	})

const toError = (value: unknown): Error => (value instanceof Error ? value : new Error(String(value)))

const openConnection = async (
	config: ResolvedConfig
): Promise<{ sock: Socket; saveCreds: () => Promise<void>; meJid: string; meLid?: string }> => {
	for (;;) {
		const { sock, saveCreds, result } = await attemptConnect(config)

		if (result.kind === 'open') {
			return { sock, saveCreds, meJid: result.meJid, meLid: result.meLid }
		}

		await safeEnd(sock)

		if (result.kind === 'logged-out') {
			throw new Error('Logged out during e2e bring-up')
		}

		if (result.kind === 'error') {
			throw result.error
		}

		// pairing-handoff close: Baileys terminates the noise socket once paired, we re-open
		config.logger.debug({ reason: result.reason }, 'reconnecting after pairing handoff')
	}
}

/**
 * Baileys socket wrapped with e2e ergonomics: QR autoscan via bartender admin,
 * tmp auth dir per instance, and event/message wait helpers with timeouts.
 *
 *   const tc = await TestClient.connect()
 *   await tc.sock.sendMessage(tc.meJid, { text: 'hi' })
 *   await tc.waitForText('hi')
 *   await tc.cleanup()
 */
export class TestClient {
	groupJid?: string

	private constructor(
		readonly sock: Socket,
		readonly meJid: string,
		readonly meLid: string | undefined,
		readonly config: ResolvedConfig,
		private readonly saveCreds: () => Promise<void>
	) {}

	static async connect(opts: TestClientOptions = {}): Promise<TestClient> {
		const config = resolveConfig({ ...opts, pushName: opts.pushName ?? uniquePushName() })
		// stale auth would skip pairing and disconnect with logged-out
		await rm(config.authDir, { recursive: true, force: true })

		const { sock, saveCreds, meJid, meLid } = await openConnection(config)
		const client = new TestClient(sock, meJid, meLid, config, saveCreds)

		if (opts.resolveTestGroup) {
			await client.resolveTestGroup(opts.testGroupName)
		}

		return client
	}

	get pushName(): string | undefined {
		return this.config.pushName
	}

	async resolveTestGroup(name = 'Baileys Group Test'): Promise<string | undefined> {
		const groups = await this.sock.groupFetchAllParticipating()
		this.groupJid = Object.values(groups).find(g => g.subject === name)?.id
		return this.groupJid
	}

	/** Wait for an event matching `predicate`, with a timeout that auto-detaches the listener. */
	waitForEvent<K extends keyof BaileysEventMap>(
		event: K,
		predicate: (data: BaileysEventMap[K]) => boolean,
		timeoutMs = DEFAULT_TIMEOUT_MS
	): Promise<BaileysEventMap[K]> {
		return waitWithTimeout<BaileysEventMap[K]>(
			emit => {
				const handler = (data: BaileysEventMap[K]) => {
					if (predicate(data)) emit(data)
				}

				this.sock.ev.on(event, handler)
				return () => this.sock.ev.off(event, handler)
			},
			timeoutMs,
			String(event)
		)
	}

	/** Wait for a single message inside `messages.upsert` matching `predicate`. */
	waitForMessage(predicate: MessagePredicate, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<WAMessageInfo> {
		return waitWithTimeout<WAMessageInfo>(
			emit => {
				const handler = ({ messages }: { messages: WAMessageInfo[] }) => {
					const hit = messages.find(predicate)
					if (hit) emit(hit)
				}

				this.sock.ev.on('messages.upsert', handler)
				return () => this.sock.ev.off('messages.upsert', handler)
			},
			timeoutMs,
			'message'
		)
	}

	waitForText(text: string, opts: { remoteJid?: string; timeoutMs?: number } = {}): Promise<WAMessageInfo> {
		return this.waitForMessage(
			msg =>
				(opts.remoteJid === undefined || msg.key?.remoteJid === opts.remoteJid) &&
				(msg.message?.conversation === text || msg.message?.extendedTextMessage?.text === text),
			opts.timeoutMs
		)
	}

	async cleanup(): Promise<void> {
		// In-flight signal session writes can race with cleanup; leave the tmp dir in place
		// (it's recreated fresh in connect()) so late writes don't ENOENT the test runner.
		this.sock.ev.off('creds.update', this.saveCreds)
		await safeEnd(this.sock)
	}
}
