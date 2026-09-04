import { Boom } from '@hapi/boom'
import { randomBytes } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'
import P from 'pino'
import qrcode from 'qrcode-terminal'
import makeWASocket, {
	type BaileysEventMap,
	Browsers,
	DisconnectReason,
	type WASocket,
	type WAMessage,
	useMultiFileAuthState
} from '../../src'
import {
	extractEditedText,
	findOriginalMessage,
	hasUsableMessageSecret,
	OriginalMessageLookup
} from './message-edit-helpers'
import { openRetainedAuthSession, type RetainedAuthSession } from './auth-session'

const PAIRING_TIMEOUT_MS = 5 * 60 * 1000
const OPERATOR_TIMEOUT_MS = 5 * 60 * 1000
const MAX_CONNECTION_ATTEMPTS = 5
const CONNECTION_RETRY_DELAY_MS = 1000

const writeLine = (message = ''): void => {
	process.stdout.write(`${message}\n`)
}

const writeError = (message: string): void => {
	process.stderr.write(`${message}\n`)
}

const toError = (value: unknown): Error => (value instanceof Error ? value : new Error(String(value)))

type Subscribe<T> = (resolve: (value: T) => void, reject: (error: Error) => void) => () => void

const waitFor = <T>(label: string, timeoutMs: number, signal: AbortSignal, subscribe: Subscribe<T>): Promise<T> => {
	if (signal.aborted) {
		return Promise.reject(toError(signal.reason || 'Interrupted'))
	}

	return new Promise<T>((resolve, reject) => {
		let settled = false
		let unsubscribe: () => void = () => {}

		const cleanup = () => {
			clearTimeout(timer)
			signal.removeEventListener('abort', onAbort)
			unsubscribe()
		}

		const resolveOnce = (value: T) => {
			if (settled) return
			settled = true
			cleanup()
			resolve(value)
		}

		const rejectOnce = (error: Error) => {
			if (settled) return
			settled = true
			cleanup()
			reject(error)
		}

		const onAbort = () => rejectOnce(toError(signal.reason || 'Interrupted'))
		const timer = setTimeout(() => rejectOnce(new Error(`Timed out waiting for ${label}`)), timeoutMs)

		signal.addEventListener('abort', onAbort, { once: true })
		try {
			unsubscribe = subscribe(resolveOnce, rejectOnce)
		} catch (error) {
			rejectOnce(toError(error))
		}
	})
}

const disconnectReason = (lastDisconnect: { error?: unknown } | undefined): DisconnectReason | undefined => {
	const error = lastDisconnect?.error
	return error instanceof Boom ? error.output?.statusCode : undefined
}

const safeEnd = async (sock: WASocket): Promise<void> => {
	try {
		await sock.end(undefined)
	} catch {
		// The socket may already be closed after the pairing handoff.
	}
}

class PairingLoggedOutError extends Error {}

type ConnectionAttemptResult = 'open' | 'reconnect'

const waitForConnectionAttempt = (
	sock: WASocket,
	signal: AbortSignal,
	renderedQrs: Set<string>
): Promise<ConnectionAttemptResult> =>
	waitFor<ConnectionAttemptResult>('pairing and connection', PAIRING_TIMEOUT_MS, signal, (resolve, reject) => {
		const handler = (update: BaileysEventMap['connection.update']) => {
			if (update.qr && !renderedQrs.has(update.qr)) {
				renderedQrs.add(update.qr)
				writeLine()
				writeLine('[PAIR] Scan this QR code with the WhatsApp account the smoke client will hold.')
				qrcode.generate(update.qr, { small: true }, rendered => writeLine(rendered))
			}

			if (update.connection === 'open') {
				resolve('open')
				return
			}

			if (update.connection === 'close') {
				const reason = disconnectReason(update.lastDisconnect)
				if (reason === DisconnectReason.loggedOut) {
					reject(new PairingLoggedOutError('The paired account logged out while connecting'))
					return
				}

				resolve('reconnect')
			}
		}

		sock.ev.on('connection.update', handler)
		return () => sock.ev.off('connection.update', handler)
	})

interface ConnectedSocket {
	sock: WASocket
	saveCreds: () => Promise<void>
}

const connect = async (
	authDir: string,
	lookup: OriginalMessageLookup,
	signal: AbortSignal,
	secureAuthFiles: () => Promise<void>
): Promise<ConnectedSocket> => {
	const renderedQrs = new Set<string>()
	// Protocol logs stay off by default because they can contain identifiers and payload metadata.
	const logger = P({ level: process.env.SMOKE_LOG_LEVEL?.trim() || 'silent' })

	for (let attempt = 1; attempt <= MAX_CONNECTION_ATTEMPTS; attempt++) {
		const { state, saveCreds } = await useMultiFileAuthState(authDir)
		const persistCreds = async () => {
			await saveCreds()
			await secureAuthFiles()
		}
		const sock = makeWASocket({
			auth: state,
			browser: Browsers.macOS('Message edit smoke'),
			getMessage: key => lookup.getMessage(key),
			logger,
			markOnlineOnConnect: false,
			syncFullHistory: false
		})
		sock.ev.on('creds.update', persistCreds)

		let result: ConnectionAttemptResult
		try {
			result = await waitForConnectionAttempt(sock, signal, renderedQrs)
		} catch (error) {
			sock.ev.off('creds.update', persistCreds)
			try {
				await persistCreds()
			} finally {
				await safeEnd(sock)
			}
			throw error
		}

		if (result === 'open') {
			try {
				await persistCreds()
				return { sock, saveCreds: persistCreds }
			} catch (error) {
				sock.ev.off('creds.update', persistCreds)
				await safeEnd(sock)
				throw error
			}
		}

		sock.ev.off('creds.update', persistCreds)
		try {
			await persistCreds()
		} finally {
			await safeEnd(sock)
		}
		if (attempt < MAX_CONNECTION_ATTEMPTS) {
			const retryDelayMs = CONNECTION_RETRY_DELAY_MS * attempt
			writeLine(`[PAIR] Pairing handoff received; reconnecting the smoke client in ${retryDelayMs / 1000} second(s).`)
			await delay(retryDelayMs, undefined, { signal })
		}
	}

	throw new Error(`Could not establish a connection after ${MAX_CONNECTION_ATTEMPTS} attempts`)
}

const waitForOriginal = (sock: WASocket, expectedText: string, signal: AbortSignal): Promise<WAMessage> =>
	waitFor<WAMessage>('your original message', OPERATOR_TIMEOUT_MS, signal, (resolve, reject) => {
		const onUpsert = (upsert: BaileysEventMap['messages.upsert']) => {
			const message = findOriginalMessage(upsert, expectedText)
			if (!message) return

			if (!hasUsableMessageSecret(message)) {
				reject(new Error('The original message arrived without a usable 32-byte message secret'))
				return
			}

			resolve(message)
		}

		const onConnection = (update: BaileysEventMap['connection.update']) => {
			if (update.connection === 'close') {
				reject(new Error('The connection closed while waiting for your original message'))
			}
		}

		sock.ev.on('messages.upsert', onUpsert)
		sock.ev.on('connection.update', onConnection)
		return () => {
			sock.ev.off('messages.upsert', onUpsert)
			sock.ev.off('connection.update', onConnection)
		}
	})

interface ReadableEdit {
	text: string
}

const waitForEdit = (
	sock: WASocket,
	originalMessageId: string,
	originalText: string,
	signal: AbortSignal
): Promise<ReadableEdit> =>
	waitFor<ReadableEdit>('your readable message edit', OPERATOR_TIMEOUT_MS, signal, (resolve, reject) => {
		const onUpdate = (updates: BaileysEventMap['messages.update']) => {
			for (const update of updates) {
				const text = extractEditedText(update, originalMessageId)
				if (text === undefined) continue

				if (text === originalText) {
					reject(new Error('The edit event contained the original text unchanged'))
					return
				}

				resolve({ text })
				return
			}
		}

		const onConnection = (update: BaileysEventMap['connection.update']) => {
			if (update.connection === 'close') {
				reject(new Error('The connection closed while waiting for your edit'))
			}
		}

		sock.ev.on('messages.update', onUpdate)
		sock.ev.on('connection.update', onConnection)
		return () => {
			sock.ev.off('messages.update', onUpdate)
			sock.ev.off('connection.update', onConnection)
		}
	})

const disconnect = async (connection: ConnectedSocket, session: RetainedAuthSession): Promise<void> => {
	connection.sock.ev.off('creds.update', connection.saveCreds)
	try {
		await connection.saveCreds()
	} finally {
		await safeEnd(connection.sock)
		await session.secureAuthFiles()
	}
}

const assertInteractiveTerminal = (): void => {
	if (process.env.CI && process.env.CI !== 'false') {
		throw new Error('This manual live smoke refuses to run in CI')
	}

	if (!process.stdin.isTTY || !process.stdout.isTTY) {
		throw new Error('This manual live smoke requires an interactive terminal')
	}
}

const run = async (): Promise<void> => {
	assertInteractiveTerminal()

	const previousUmask = process.umask(0o077)
	const abortController = new AbortController()
	let interruptedExitCode = 1
	const onSigint = () => {
		interruptedExitCode = 130
		abortController.abort(new Error('Interrupted by SIGINT'))
	}
	const onSigterm = () => {
		interruptedExitCode = 143
		abortController.abort(new Error('Interrupted by SIGTERM'))
	}
	process.once('SIGINT', onSigint)
	process.once('SIGTERM', onSigterm)

	const marker = randomBytes(3).toString('hex').toUpperCase()
	const originalText = `[EDIT-SMOKE-${marker}] before`
	const lookup = new OriginalMessageLookup()
	let session: RetainedAuthSession | undefined
	let connection: ConnectedSocket | undefined
	let editedText: string | undefined

	try {
		session = await openRetainedAuthSession()
		if (session.expired) {
			writeLine('[SESSION] The previous local pairing expired; a new QR scan is required.')
		} else if (session.reused) {
			writeLine('[SESSION] Reusing the retained pairing for this development session.')
		}

		writeLine('[START] Opening a live message-edit smoke session.')
		try {
			connection = await connect(session.authDir, lookup, abortController.signal, session.secureAuthFiles)
		} catch (error) {
			if (!(error instanceof PairingLoggedOutError) || !session.reused) {
				throw error
			}

			writeLine('[SESSION] The retained pairing is no longer valid; requesting a new pairing.')
			await session.reset()
			connection = await connect(session.authDir, lookup, abortController.signal, session.secureAuthFiles)
		}
		await session.markUsed()

		writeLine()
		writeLine('[READY] Connected.')
		writeLine(
			'[ACTION] On your phone, open either a direct chat with the paired account or a group containing both accounts.'
		)
		writeLine('[ACTION] Type and send this exact synthetic message:')
		writeLine()
		writeLine(`  ${originalText}`)
		writeLine()
		writeLine('[WAIT] Waiting for you to type and send the original message.')

		const original = await waitForOriginal(connection.sock, originalText, abortController.signal)
		lookup.record(original)
		writeLine(`[ORIGINAL] ${JSON.stringify(originalText)}`)
		writeLine('[ACTION] On your phone, edit that same message to any different synthetic text and save it.')
		writeLine('[WAIT] Waiting for you to type and save the edit.')

		const edit = await waitForEdit(connection.sock, original.key.id!, originalText, abortController.signal)
		if (lookup.matchingLookupCount === 0) {
			throw new Error('A readable edit arrived, but the encrypted edit path did not request the original message')
		}
		editedText = edit.text
	} catch (error) {
		if (abortController.signal.aborted) {
			process.exitCode = interruptedExitCode
		}
		throw error
	} finally {
		process.removeListener('SIGINT', onSigint)
		process.removeListener('SIGTERM', onSigterm)
		try {
			if (connection && session) {
				await disconnect(connection, session)
				await session.markUsed()
			}
		} finally {
			try {
				await session?.release()
			} finally {
				process.umask(previousUmask)
			}
		}
	}

	writeLine()
	writeLine('[EDIT]')
	writeLine(`  from: ${JSON.stringify(originalText)}`)
	writeLine(`  to:   ${JSON.stringify(editedText)}`)
	writeLine()
	writeLine('[PASS] Original lookup, edit decryption, and messages.update completed successfully.')
}

run().catch(error => {
	writeError(`[FAIL] ${toError(error).message}`)
	if (!process.exitCode) {
		process.exitCode = 1
	}
})
