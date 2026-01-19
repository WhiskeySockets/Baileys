import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import { readFileSync } from 'node:fs'
import P from 'pino'
import makeWASocket, {
	DisconnectReason,
	downloadContentFromMessage,
	downloadMediaMessage,
	jidNormalizedUser,
	proto,
	toBuffer,
	useMultiFileAuthState,
	type WAMessage
} from '../../index'

jest.setTimeout(30_000)
interface MemoryMetrics {
	heapUsed: number
	heapTotal: number
	external: number
	rss: number
}

interface PerformanceMetrics {
	memoryBefore: MemoryMetrics
	memoryAfter: MemoryMetrics
	memoryDelta: MemoryMetrics
	cpuUsage: NodeJS.CpuUsage
	duration: number
}

function getMemoryUsage(): MemoryMetrics {
	const mem = process.memoryUsage()
	return {
		heapUsed: mem.heapUsed,
		heapTotal: mem.heapTotal,
		external: mem.external,
		rss: mem.rss
	}
}

function formatBytes(bytes: number): string {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function logMemoryMetrics(label: string, metrics: MemoryMetrics): void {
	console.log(`\n📊 ${label}:`)
	console.log(`  Heap Usado: ${formatBytes(metrics.heapUsed)}`)
	console.log(`  Heap Total: ${formatBytes(metrics.heapTotal)}`)
	console.log(`  Externo: ${formatBytes(metrics.external)}`)
	console.log(`  RSS: ${formatBytes(metrics.rss)}`)
}

function logPerformanceMetrics(testName: string, metrics: PerformanceMetrics): void {
	console.log(`\n🔍 Métricas de Performance - ${testName}`)
	console.log(`⏱️  Duração: ${metrics.duration.toFixed(2)}ms`)

	logMemoryMetrics('Memória Antes', metrics.memoryBefore)
	logMemoryMetrics('Memória Depois', metrics.memoryAfter)

	console.log(`\n📈 Delta de Memória:`)
	console.log(
		`  Heap Usado: ${formatBytes(metrics.memoryDelta.heapUsed)} ${metrics.memoryDelta.heapUsed > 0 ? '⬆️' : '⬇️'}`
	)
	console.log(
		`  Heap Total: ${formatBytes(metrics.memoryDelta.heapTotal)} ${metrics.memoryDelta.heapTotal > 0 ? '⬆️' : '⬇️'}`
	)
	console.log(
		`  Externo: ${formatBytes(metrics.memoryDelta.external)} ${metrics.memoryDelta.external > 0 ? '⬆️' : '⬇️'}`
	)
	console.log(`  RSS: ${formatBytes(metrics.memoryDelta.rss)} ${metrics.memoryDelta.rss > 0 ? '⬆️' : '⬇️'}`)

	console.log(`\n💻 Uso de CPU:`)
	console.log(`  User: ${(metrics.cpuUsage.user / 1000).toFixed(2)}ms`)
	console.log(`  System: ${(metrics.cpuUsage.system / 1000).toFixed(2)}ms`)
	console.log(`  Total: ${((metrics.cpuUsage.user + metrics.cpuUsage.system) / 1000).toFixed(2)}ms`)

	if (metrics.memoryDelta.heapUsed > 10 * 1024 * 1024) {
		// Mais de 10MB
		console.log(`\n⚠️  AVISO: Aumento significativo no uso de memória (${formatBytes(metrics.memoryDelta.heapUsed)})`)
	}
}

async function measurePerformance<T>(
	testName: string,
	operation: () => Promise<T>,
	history?: Array<{ testName: string; metrics: PerformanceMetrics }>
): Promise<T> {
	if (global.gc) {
		global.gc()
	}

	const memoryBefore = getMemoryUsage()
	const cpuBefore = process.cpuUsage()
	const startTime = performance.now()

	const result = await operation()

	const endTime = performance.now()
	const cpuAfter = process.cpuUsage(cpuBefore)
	const memoryAfter = getMemoryUsage()

	const metrics: PerformanceMetrics = {
		memoryBefore,
		memoryAfter,
		memoryDelta: {
			heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
			heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
			external: memoryAfter.external - memoryBefore.external,
			rss: memoryAfter.rss - memoryBefore.rss
		},
		cpuUsage: cpuAfter,
		duration: endTime - startTime
	}

	logPerformanceMetrics(testName, metrics)

	if (history) {
		history.push({ testName, metrics })
	}

	return result
}

describe('E2E Tests', () => {
	let sock: ReturnType<typeof makeWASocket>
	let meJid: string | undefined
	let meLid: string | undefined
	let groupJid: string | undefined

	const performanceHistory: Array<{ testName: string; metrics: PerformanceMetrics }> = []
	let initialMemory: MemoryMetrics

	async function measureTest<T>(testName: string, operation: () => Promise<T>): Promise<T> {
		return measurePerformance(testName, operation, performanceHistory)
	}

	beforeAll(async () => {
		initialMemory = getMemoryUsage()
		console.log(`\n🚀 Iniciando testes E2E com monitoramento de performance`)
		console.log(`📊 Memória inicial do processo: ${formatBytes(initialMemory.heapUsed)}`)
		console.log(`⚙️  Node.js: ${process.version}`)
		console.log(`💻 Plataforma: ${process.platform} ${process.arch}\n`)
		const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
		const logger = P({ level: 'silent' })

		sock = makeWASocket({
			auth: state,
			logger
		})

		sock.ev.on('creds.update', saveCreds)

		await new Promise<void>((resolve, reject) => {
			sock.ev.on('connection.update', update => {
				const { connection, lastDisconnect } = update
				if (connection === 'open') {
					meJid = jidNormalizedUser(sock.user?.id)
					meLid = sock.user?.lid

					sock
						.groupFetchAllParticipating()
						.then(groups => {
							const group = Object.values(groups).find(g => g.subject === 'Baileys Group Test')
							if (group) {
								groupJid = group.id
								console.log(`Found test group "${group.subject}" with JID: ${groupJid}`)
							}

							resolve()
						})
						.catch(reject)
				} else if (connection === 'close') {
					const reason = (lastDisconnect?.error as Boom)?.output?.statusCode
					if (reason === DisconnectReason.loggedOut) {
						console.error('Logged out, please delete the baileys_auth_info_e2e folder and re-run the test')
					}

					if (lastDisconnect?.error) {
						reject(new Error(`Connection closed: ${DisconnectReason[reason] || 'unknown'}`))
					}
				}
			})
		})
	})

	afterAll(async () => {
		if (sock) {
			await sock.end(undefined)
		}

		const finalMemory = getMemoryUsage()

		if (performanceHistory.length > 0) {
			process.stdout.write(`\n\n${'='.repeat(80)}\n`)
			process.stdout.write(`📊 RELATÓRIO FINAL DE PERFORMANCE\n`)
			process.stdout.write(`${'='.repeat(80)}\n\n`)

			process.stdout.write(`🔍 Memória do Processo:\n`)
			process.stdout.write(`  Memória Inicial: ${formatBytes(initialMemory.heapUsed)}\n`)
			process.stdout.write(`  Memória Final: ${formatBytes(finalMemory.heapUsed)}\n`)
			const processDelta = finalMemory.heapUsed - initialMemory.heapUsed
			process.stdout.write(
				`  Delta Total do Processo: ${formatBytes(Math.abs(processDelta))} ${processDelta > 0 ? '⬆️ (aumento)' : '⬇️ (redução)'}\n`
			)
			process.stdout.write(`  RSS Inicial: ${formatBytes(initialMemory.rss)}\n`)
			process.stdout.write(`  RSS Final: ${formatBytes(finalMemory.rss)}\n`)
			const rssDelta = finalMemory.rss - initialMemory.rss
			process.stdout.write(
				`  Delta RSS: ${formatBytes(Math.abs(rssDelta))} ${rssDelta > 0 ? '⬆️ (aumento)' : '⬇️ (redução)'}\n`
			)

			const totalMemoryIncrease = performanceHistory.reduce((sum, p) => sum + p.metrics.memoryDelta.heapUsed, 0)
			const totalCpuTime = performanceHistory.reduce(
				(sum, p) => sum + p.metrics.cpuUsage.user + p.metrics.cpuUsage.system,
				0
			)
			const totalDuration = performanceHistory.reduce((sum, p) => sum + p.metrics.duration, 0)

			const memoryIncreases = performanceHistory.filter(p => p.metrics.memoryDelta.heapUsed > 0)
			const memoryDecreases = performanceHistory.filter(p => p.metrics.memoryDelta.heapUsed < 0)
			const totalIncrease = memoryIncreases.reduce((sum, p) => sum + p.metrics.memoryDelta.heapUsed, 0)
			const totalDecrease = Math.abs(memoryDecreases.reduce((sum, p) => sum + p.metrics.memoryDelta.heapUsed, 0))

			process.stdout.write(`\n📈 Resumo Geral:\n`)
			process.stdout.write(`  Total de testes com monitoramento: ${performanceHistory.length}\n`)
			process.stdout.write(
				`  Total de aumentos de memória: ${formatBytes(totalIncrease)} (${memoryIncreases.length} testes)\n`
			)
			process.stdout.write(
				`  Total de reduções de memória: ${formatBytes(totalDecrease)} (${memoryDecreases.length} testes - GC)\n`
			)
			process.stdout.write(
				`  Balanço líquido de memória: ${formatBytes(Math.abs(totalMemoryIncrease))} ${totalMemoryIncrease > 0 ? '⬆️' : '⬇️'}\n`
			)
			process.stdout.write(`  Tempo total de CPU: ${(totalCpuTime / 1000).toFixed(2)}ms\n`)
			process.stdout.write(`  Duração total das operações: ${totalDuration.toFixed(2)}ms\n`)
			process.stdout.write(
				`  Média de duração por teste: ${(totalDuration / performanceHistory.length).toFixed(2)}ms\n`
			)

			process.stdout.write(`\n📋 Detalhes por teste:\n`)
			performanceHistory.forEach((p, idx) => {
				const memDelta = p.metrics.memoryDelta.heapUsed
				const memStr = memDelta < 0 ? `${formatBytes(Math.abs(memDelta))} ⬇️ (GC)` : `${formatBytes(memDelta)} ⬆️`
				process.stdout.write(`\n  ${idx + 1}. ${p.testName}\n`)
				process.stdout.write(
					`     Memória: ${memStr} | CPU: ${((p.metrics.cpuUsage.user + p.metrics.cpuUsage.system) / 1000).toFixed(2)}ms | Duração: ${p.metrics.duration.toFixed(2)}ms\n`
				)
			})

			const sortedByMemoryIncrease = memoryIncreases.sort(
				(a, b) => b.metrics.memoryDelta.heapUsed - a.metrics.memoryDelta.heapUsed
			)
			const sortedByCpu = [...performanceHistory].sort(
				(a, b) =>
					b.metrics.cpuUsage.user + b.metrics.cpuUsage.system - (a.metrics.cpuUsage.user + a.metrics.cpuUsage.system)
			)
			const sortedByDuration = [...performanceHistory].sort((a, b) => b.metrics.duration - a.metrics.duration)

			process.stdout.write(`\n⚠️  Top 3 - Maior consumo de memória:\n`)
			sortedByMemoryIncrease.slice(0, 3).forEach((p, idx) => {
				process.stdout.write(`  ${idx + 1}. ${p.testName}: ${formatBytes(p.metrics.memoryDelta.heapUsed)}\n`)
			})

			process.stdout.write(`\n⚡ Top 3 - Maior uso de CPU:\n`)
			sortedByCpu.slice(0, 3).forEach((p, idx) => {
				const cpuTotal = (p.metrics.cpuUsage.user + p.metrics.cpuUsage.system) / 1000
				process.stdout.write(`  ${idx + 1}. ${p.testName}: ${cpuTotal.toFixed(2)}ms\n`)
			})

			process.stdout.write(`\n⏱️  Top 3 - Maior duração:\n`)
			sortedByDuration.slice(0, 3).forEach((p, idx) => {
				process.stdout.write(`  ${idx + 1}. ${p.testName}: ${p.metrics.duration.toFixed(2)}ms\n`)
			})

			const highMemoryTests = memoryIncreases.filter(p => p.metrics.memoryDelta.heapUsed > 5 * 1024 * 1024)
			const slowTests = performanceHistory.filter(p => p.metrics.duration > 500)

			if (highMemoryTests.length > 0 || slowTests.length > 0) {
				process.stdout.write(`\n⚠️  Análise de Problemas Potenciais:\n`)

				if (highMemoryTests.length > 0) {
					process.stdout.write(`  • ${highMemoryTests.length} teste(s) com alto consumo de memória (>5MB):\n`)
					highMemoryTests.forEach(p => {
						process.stdout.write(`    - ${p.testName}: ${formatBytes(p.metrics.memoryDelta.heapUsed)}\n`)
					})
				}

				if (slowTests.length > 0) {
					process.stdout.write(`  • ${slowTests.length} teste(s) lentos (>500ms):\n`)
					slowTests.forEach(p => {
						process.stdout.write(`    - ${p.testName}: ${p.metrics.duration.toFixed(2)}ms\n`)
					})
				}
			}

			process.stdout.write(
				`\n💡 Nota: Valores negativos indicam que o Garbage Collector liberou memória durante a operação.\n`
			)
			process.stdout.write(`${'='.repeat(80)}\n\n`)
		}
	})

	test('should send a message', async () => {
		const messageContent = `E2E Test Message ${Date.now()}`

		const sentMessage = await measureTest('Envio de Mensagem de Texto', async () => {
			return await sock.sendMessage(meJid!, { text: messageContent })
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent message:', sentMessage!.key.id)
		expect(sentMessage!.key.id).toBeTruthy()
		expect(sentMessage!.message?.extendedTextMessage?.text || sentMessage!.message?.conversation).toBe(messageContent)
	})

	test('should edit a message', async () => {
		const messageContent = `E2E Test Message to Edit ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to edit:', sentMessage!.key.id)

		const newContent = `E2E Edited Message ${Date.now()}`
		const editedMessage = await measureTest('Edição de Mensagem', async () => {
			return await sock.sendMessage(meJid!, {
				text: newContent,
				edit: sentMessage!.key
			})
		})

		expect(editedMessage).toBeDefined()
		console.log('Edited message response:', editedMessage!.key.id)

		expect(editedMessage!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		const editedContent = editedMessage!.message?.protocolMessage?.editedMessage
		expect(editedContent?.extendedTextMessage?.text || editedContent?.conversation).toBe(newContent)
	})

	test('should react to a message', async () => {
		const messageContent = `E2E Test Message to React to ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to react to:', sentMessage!.key.id)

		const reaction = '👍'
		const reactionMessage = await measureTest('Envio de Reação', async () => {
			return await sock.sendMessage(meJid!, {
				react: {
					text: reaction,
					key: sentMessage!.key
				}
			})
		})

		expect(reactionMessage).toBeDefined()
		console.log('Sent reaction:', reactionMessage!.key.id)

		expect(reactionMessage!.message?.reactionMessage?.text).toBe(reaction)
		expect(reactionMessage!.message?.reactionMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should remove a reaction from a message', async () => {
		const messageContent = `E2E Test Message to Remove Reaction from ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to remove reaction from:', sentMessage!.key.id)

		await sock.sendMessage(meJid!, {
			react: {
				text: '😄',
				key: sentMessage!.key
			}
		})

		const removeReactionMessage = await sock.sendMessage(meJid!, {
			react: {
				text: '',
				key: sentMessage!.key
			}
		})

		expect(removeReactionMessage).toBeDefined()
		console.log('Sent remove reaction:', removeReactionMessage!.key.id)

		expect(removeReactionMessage!.message?.reactionMessage?.text).toBe('')
		expect(removeReactionMessage!.message?.reactionMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should delete a message', async () => {
		const messageContent = `E2E Test Message to Delete ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, { text: messageContent })

		expect(sentMessage).toBeDefined()
		console.log('Sent message to delete:', sentMessage!.key.id)

		const deleteMessage = await sock.sendMessage(meJid!, {
			delete: sentMessage!.key
		})

		expect(deleteMessage).toBeDefined()
		console.log('Sent delete message command:', deleteMessage!.key.id)

		expect(deleteMessage!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.REVOKE)
		expect(deleteMessage!.message?.protocolMessage?.key?.id).toBe(sentMessage!.key.id)
	})

	test('should forward a message', async () => {
		const messageContent = `E2E Test Message to Forward ${Date.now()}`
		const sentMessage = await sock.sendMessage(meJid!, {
			text: messageContent
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent message to forward:', sentMessage!.key.id)

		const forwardedMessage = await sock.sendMessage(meJid!, {
			forward: sentMessage!
		})

		expect(forwardedMessage).toBeDefined()
		console.log('Forwarded message:', forwardedMessage!.key.id)

		const content = forwardedMessage!.message?.extendedTextMessage?.text || forwardedMessage!.message?.conversation
		expect(content).toBe(messageContent)
		expect(forwardedMessage!.key.id).not.toBe(sentMessage!.key.id)
	})

	test('should send an image message', async () => {
		const image = readFileSync('./Media/cat.jpeg')

		const sentMessage = await measureTest('Envio de Imagem', async () => {
			return await sock.sendMessage(meJid!, {
				image: image,
				caption: 'E2E Test Image'
			})
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent image message:', sentMessage!.key.id)
		expect(sentMessage!.message?.imageMessage).toBeDefined()
		expect(sentMessage!.message?.imageMessage?.caption).toBe('E2E Test Image')
	})

	test('should send a video message with a thumbnail', async () => {
		const video = readFileSync('./Media/ma_gif.mp4')

		const sentMessage = await measureTest('Envio de Vídeo', async () => {
			return await sock.sendMessage(meJid!, {
				video: video,
				caption: 'E2E Test Video'
			})
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent video message:', sentMessage!.key.id)
		expect(sentMessage!.message?.videoMessage).toBeDefined()
		expect(sentMessage!.message?.videoMessage?.caption).toBe('E2E Test Video')
	})

	test('should send a PTT (push-to-talk) audio message', async () => {
		const audio = readFileSync('./Media/sonata.mp3')

		const sentMessage = await measureTest('Envio de Áudio PTT', async () => {
			return await sock.sendMessage(meJid!, {
				audio: audio,
				ptt: true,
				mimetype: 'audio/mp4'
			})
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent PTT audio message:', sentMessage!.key.id)
		expect(sentMessage!.message?.audioMessage).toBeDefined()
		expect(sentMessage!.message?.audioMessage?.ptt).toBe(true)
	})

	test('should send a document message', async () => {
		const document = readFileSync('./Media/ma_gif.mp4')

		const sentMessage = await measureTest('Envio de Documento', async () => {
			return await sock.sendMessage(meJid!, {
				document: document,
				mimetype: 'application/pdf',
				fileName: 'E2E Test Document.pdf'
			})
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent document message:', sentMessage!.key.id)
		expect(sentMessage!.message?.documentMessage).toBeDefined()
		expect(sentMessage!.message?.documentMessage?.fileName).toBe('E2E Test Document.pdf')
	})

	test('should send a sticker message', async () => {
		const sticker = readFileSync('./Media/cat.jpeg')

		const sentMessage = await measureTest('Envio de Sticker', async () => {
			return await sock.sendMessage(meJid!, {
				sticker: sticker
			})
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent sticker message:', sentMessage!.key.id)
		expect(sentMessage!.message?.stickerMessage).toBeDefined()
	})

	test('should send a poll message and receive a vote', async () => {
		const poll = {
			name: 'E2E Test Poll',
			values: ['Option 1', 'Option 2', 'Option 3'],
			selectableCount: 1
		}

		const sentPoll = await measureTest('Envio de Enquete', async () => {
			return await sock.sendMessage(meJid!, { poll })
		})

		expect(sentPoll).toBeDefined()
		console.log('Sent poll message:', sentPoll!.key.id)
		expect(sentPoll?.message?.pollCreationMessageV3).toBeDefined()
		expect(sentPoll?.message?.pollCreationMessageV3?.name).toBe('E2E Test Poll')
	})

	test('should send a contact (vCard) message', async () => {
		const vcard =
			'BEGIN:VCARD\n' +
			'VERSION:3.0\n' +
			'FN:E2E Test Contact\n' +
			'ORG:Baileys Tests;\n' +
			'TEL;type=CELL;type=VOICE;waid=1234567890:+1 234-567-890\n' +
			'END:VCARD'
		const sentMessage = await sock.sendMessage(meJid!, {
			contacts: {
				displayName: 'E2E Test Contact',
				contacts: [{ vcard }]
			}
		})

		expect(sentMessage).toBeDefined()
		console.log('Sent contact message:', sentMessage!.key.id)
		expect(sentMessage!.message?.contactMessage).toBeDefined()
		expect(sentMessage!.message?.contactMessage?.vcard).toContain('FN:E2E Test Contact')
	})

	test('should send and download an image message', async () => {
		const image = readFileSync('./Media/cat.jpeg')
		const caption = 'E2E Test Image Download Success'

		let listener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let timeoutId: NodeJS.Timeout | undefined

		try {
			const receivedMsgPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				listener = ({ messages }) => {
					const msg = messages.find(m => m.message?.imageMessage?.caption === caption)
					if (msg) {
						resolve(msg)
					}
				}

				timeoutId = setTimeout(() => {
					reject(new Error('Timed out waiting for the image message to be received'))
				}, 30_000)

				sock.ev.on('messages.upsert', listener)
			})

			await sock.sendMessage(meJid!, {
				image: image,
				caption: caption
			})

			const receivedMsg = await receivedMsgPromise

			clearTimeout(timeoutId)
			timeoutId = undefined

			console.log('Received image message, attempting to download...')

			const buffer = await downloadMediaMessage(
				receivedMsg as WAMessage,
				'buffer',
				{},
				{
					logger: sock.logger,
					reuploadRequest: m => sock.updateMediaMessage(m)
				}
			)

			expect(Buffer.isBuffer(buffer)).toBe(true)
			expect(buffer.length).toBeGreaterThan(0)

			console.log('Successfully downloaded the image.')
		} finally {
			if (listener) {
				sock.ev.off('messages.upsert', listener)
			}

			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	})

	test('should send and download an image message via LID', async () => {
		console.log(`Testing with self-LID: ${meLid}`)

		const image = readFileSync('./Media/cat.jpeg')
		const caption = 'E2E Test LID Image Download'

		let listener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let timeoutId: NodeJS.Timeout | undefined

		try {
			const receivedMsgPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				listener = ({ messages }) => {
					const msg = messages.find(m => m.message?.imageMessage?.caption === caption)
					if (msg) {
						resolve(msg)
					}
				}

				timeoutId = setTimeout(() => {
					reject(new Error('Timed out waiting for the LID image message to be received'))
				}, 30_000)

				sock.ev.on('messages.upsert', listener)
			})

			await sock.sendMessage(meLid!, {
				image: image,
				caption: caption
			})

			const receivedMsg = await receivedMsgPromise
			clearTimeout(timeoutId)
			timeoutId = undefined

			console.log('Received LID image message, attempting to download...')

			const buffer = await downloadMediaMessage(
				receivedMsg as WAMessage,
				'buffer',
				{},
				{
					logger: sock.logger,
					reuploadRequest: m => sock.updateMediaMessage(m)
				}
			)

			expect(Buffer.isBuffer(buffer)).toBe(true)
			expect(buffer.length).toBeGreaterThan(0)

			console.log('Successfully downloaded the image sent via LID.')
		} finally {
			if (listener) {
				sock.ev.off('messages.upsert', listener)
			}

			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	})

	test('should send and download an image using the low-level downloadContentFromMessage', async () => {
		const image = readFileSync('./Media/cat.jpeg')
		const caption = 'E2E Test Low-Level Download'

		let listener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let timeoutId: NodeJS.Timeout | undefined

		try {
			const receivedMsgPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				listener = ({ messages }) => {
					const msg = messages.find(m => m.message?.imageMessage?.caption === caption)
					if (msg) {
						resolve(msg)
					}
				}

				timeoutId = setTimeout(() => {
					reject(new Error('Timed out waiting for the low-level test message'))
				}, 30_000)

				sock.ev.on('messages.upsert', listener)
			})

			await sock.sendMessage(meJid!, {
				image: image,
				caption: caption
			})

			const receivedMsg = await receivedMsgPromise
			clearTimeout(timeoutId)
			timeoutId = undefined

			console.log('Received message for low-level download test, preparing to download...')

			const imageMessage = receivedMsg.message?.imageMessage
			expect(imageMessage).toBeDefined()

			const downloadable: proto.Message.IImageMessage = {
				url: imageMessage!.url,
				mediaKey: imageMessage!.mediaKey,
				directPath: imageMessage!.directPath
			}

			const stream = await downloadContentFromMessage(downloadable, 'image')
			const buffer = await toBuffer(stream)

			expect(Buffer.isBuffer(buffer)).toBe(true)
			expect(buffer.length).toBeGreaterThan(0)

			console.log('Successfully downloaded the image using downloadContentFromMessage.')
		} finally {
			if (listener) {
				sock.ev.off('messages.upsert', listener)
			}

			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	})

	test('should download a quoted image message using downloadContentFromMessage', async () => {
		const image = readFileSync('./Media/cat.jpeg')
		const originalCaption = 'This is the original media message'
		const commandText = '-download'

		let imageListener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let commandListener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let timeoutId: NodeJS.Timeout | undefined

		try {
			console.log('Sending initial image message...')
			const receivedImagePromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				imageListener = ({ messages }) => {
					const msg = messages.find(m => m.message?.imageMessage?.caption === originalCaption)
					if (msg) resolve(msg)
				}

				sock.ev.on('messages.upsert', imageListener)
				timeoutId = setTimeout(() => reject(new Error('Timed out waiting for initial image message')), 30_000)
			})

			const sentImageMessage = await sock.sendMessage(meJid!, {
				image: image,
				caption: originalCaption
			})
			await receivedImagePromise
			clearTimeout(timeoutId)
			timeoutId = undefined

			if (imageListener) {
				sock.ev.off('messages.upsert', imageListener)
			}

			console.log('Initial image message sent and received.')

			console.log('Sending command message as a reply...')
			const receivedCommandPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				commandListener = ({ messages }) => {
					const msg = messages.find(m => m.message?.extendedTextMessage?.text === commandText)
					if (msg) resolve(msg)
				}

				sock.ev.on('messages.upsert', commandListener)
				timeoutId = setTimeout(() => reject(new Error('Timed out waiting for command message')), 30_000)
			})

			await sock.sendMessage(meJid!, { text: commandText }, { quoted: sentImageMessage })
			const receivedCommandMessage = await receivedCommandPromise
			clearTimeout(timeoutId)
			timeoutId = undefined
			console.log('Command message received.')

			console.log('Extracting quoted message and attempting download...')

			const quotedMessage = receivedCommandMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
			expect(quotedMessage).toBeDefined()

			const quotedImage = quotedMessage!.imageMessage
			expect(quotedImage).toBeDefined()

			const downloadable: proto.Message.IImageMessage = {
				url: quotedImage!.url,
				mediaKey: quotedImage!.mediaKey,
				directPath: quotedImage!.directPath
			}

			const stream = await downloadContentFromMessage(downloadable, 'image')
			const buffer = await toBuffer(stream)

			expect(Buffer.isBuffer(buffer)).toBe(true)
			expect(buffer.length).toBeGreaterThan(0)

			console.log('Successfully downloaded quoted image using downloadContentFromMessage.')
		} finally {
			if (imageListener) sock.ev.off('messages.upsert', imageListener)
			if (commandListener) sock.ev.off('messages.upsert', commandListener)
			if (timeoutId) clearTimeout(timeoutId)
		}
	})

	test('should download a quoted videos message within a group', async () => {
		if (!groupJid) {
			console.warn('⚠️ Skipping group test because "Baileys Group Test" was not found.')
			return
		}

		const video = readFileSync('./Media/ma_gif.mp4')
		const originalCaption = 'This is the original media message for the group test'
		const commandText = '-download group'

		let videoListener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let commandListener: ((data: { messages: proto.IWebMessageInfo[] }) => void) | undefined
		let timeoutId: NodeJS.Timeout | undefined

		try {
			console.log(`Sending initial video message to group ${groupJid}...`)
			const receivedVideoPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				videoListener = ({ messages }) => {
					const msg = messages.find(
						m => m.key!.remoteJid === groupJid && m.message?.videoMessage?.caption === originalCaption
					)
					if (msg) resolve(msg)
				}

				sock.ev.on('messages.upsert', videoListener)
				timeoutId = setTimeout(() => reject(new Error('Timed out waiting for initial group image message')), 30_000)
			})

			const sentVideoMessage = await sock.sendMessage(groupJid, {
				video: video,
				caption: originalCaption
			})
			await receivedVideoPromise
			clearTimeout(timeoutId)
			timeoutId = undefined
			if (videoListener) sock.ev.off('messages.upsert', videoListener)
			console.log('Initial group image message sent and received.')

			console.log('Sending command message as a reply in the group...')
			const receivedCommandPromise = new Promise<proto.IWebMessageInfo>((resolve, reject) => {
				commandListener = ({ messages }) => {
					const msg = messages.find(
						m => m.key!.remoteJid === groupJid && m.message?.extendedTextMessage?.text === commandText
					)
					if (msg) resolve(msg)
				}

				sock.ev.on('messages.upsert', commandListener)
				timeoutId = setTimeout(() => reject(new Error('Timed out waiting for group command message')), 30_000)
			})

			await sock.sendMessage(groupJid, { text: commandText }, { quoted: sentVideoMessage })
			const receivedCommandMessage = await receivedCommandPromise
			clearTimeout(timeoutId)
			timeoutId = undefined
			console.log('Group command message received.')

			console.log('Extracting quoted message from group chat and attempting download...')

			const quotedMessage = receivedCommandMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
			expect(quotedMessage).toBeDefined()

			console.log('quotedMessage', JSON.stringify(quotedMessage, null, 2))

			const quotedVideo = quotedMessage!.videoMessage
			expect(quotedVideo).toBeDefined()

			console.log('quotedVideo', JSON.stringify(quotedVideo, null, 2))

			const downloadable: proto.Message.IVideoMessage = {
				url: quotedVideo!.url,
				mediaKey: quotedVideo!.mediaKey,
				directPath: quotedVideo!.directPath
			}

			const stream = await downloadContentFromMessage(downloadable, 'video')
			const buffer = await toBuffer(stream)

			expect(Buffer.isBuffer(buffer)).toBe(true)
			expect(buffer.length).toBeGreaterThan(0)

			console.log('Successfully downloaded quoted image from group message.')
		} finally {
			if (videoListener) sock.ev.off('messages.upsert', videoListener)
			if (commandListener) sock.ev.off('messages.upsert', commandListener)
			if (timeoutId) clearTimeout(timeoutId)
		}
	})
})
