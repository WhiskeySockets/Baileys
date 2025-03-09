
import NodeCache from '@cacheable/node-cache'
import P from 'pino'
import type { Boom } from '@hapi/boom'
import { ExecutionContext, R2Bucket } from "@cloudflare/workers-types"
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, logForDevelopment, makeCacheableSignalKeyStore, useMultiFileAuthState } from "../src"
import registerWhatsappHtml from './registerWhatsappHtml.html'
import sendMessageHtml from './sendMessageHtml.html'


export type envData = {
    R2_whatsappCloudflareWorkers: R2Bucket;
}


export default {
	async fetch(request: Request, env: envData, ctx: ExecutionContext): Promise<Response> {
		const newUrl = new URL(request.url)
		const pathName = newUrl.pathname
		// Used to retrieve all userBot in registerWhatsappHtml.html and sendMessageHtml.html
		const prefixUserBot = 'userBot'

		// Site: /site/register-whatsapp
		if (pathName.startsWith('/site/register-whatsapp')) {
            const response = new Response(registerWhatsappHtml, {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            return response
		}

		// Site: /site/send-message
		else if (pathName.startsWith('/site/send-message')) {
            const response = new Response(sendMessageHtml, {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            return response
		}

		// Example: POST /api/register-whatsapp {userBot: "bot01", adminPassword: "123456"}
		else if (pathName.startsWith('/api/register-whatsapp') && request.method === 'POST') {
			try {
				const requestBody = await request.json()

				let userBot = requestBody.userBot
				const adminPassword = requestBody.adminPassword

				if (adminPassword !== '123456') {
					console.log('WARNING [adminPassword !== ***] No permission')
					return new Response('WARNING [adminPassword !== ***] No permission', {status: 401})
				}

				if (!userBot) {
					console.log('WARNING [!userBot] Missing userBot')
					return new Response('WARNING [!userBot] Missing userBot', {status: 400})
				}

				userBot = `${prefixUserBot}/${userBot}`

				console.log(`SUCCESS [userBot] Name userBot: ${userBot}`)

				// IMPORTANT
				// Deleting old creds.json is necessary to avoid bugs
				// IMPORTANT
				await env.R2_whatsappCloudflareWorkers.delete(`${userBot}/creds.json`)

				const sockAndLink = await apiRegisterWhatsapp(userBot, env.R2_whatsappCloudflareWorkers)

				if (!sockAndLink) {
					console.log('WARNING [!sock] Generating link');
					return new Response('WARNING [!sock] Generating link', { status: 400 })
				}

				const sock = sockAndLink.sock
				const link = sockAndLink.link

				ctx.waitUntil(
					new Promise((resolve, reject) => {
						setTimeout(async () => {
							try {
								await sock.ws.close()
								sock.end({
									name: 'false',
									message: 'false'
								})
								resolve(undefined)
							}

							catch (error) {
								reject(error)
							}
						}, 30000)
					})
				)

				return new Response(JSON.stringify({
					link: link
				}), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}

			catch (error) {
				console.log('ERRO [catch] Erro in /send-message', error)
				return new Response('ERRO [catch] Erro in /send-message', {status: 500})
			}
		}

		// Example: POST /api/send-message { userBot: "bot01", phone: "1234567890", message: "Hello World", adminPassword: "123456" }
		else if (pathName.startsWith('/api/send-message') && request.method === 'POST') {
			try {
				const requestBody = await request.json()

				let userBot = requestBody.userBot
				const phone = requestBody.phone
				let message = requestBody.message
				const adminPassword = requestBody.adminPassword

				if (adminPassword !== '123456') {
					console.log('WARNING [adminPassword !== ***] No permission')
					return new Response('WARNING [adminPassword !== ***] No permission', {status: 401})
				}

				if (!userBot || !phone || !message) {
					console.log('WARNING [!userBot || !phone || !message] Missing phone or message')
					return new Response('WARNING [!phone || !message] Missing phone or message', {status: 400})
				}

				userBot = `${prefixUserBot}/${userBot}`
				message = message?.replace(/\r?\n|\r/g, '\n')

				console.log(`SUCCESS [userBot] Name userBot: ${userBot}`)
				console.log(`SUCCESS [message] Sending message: ${message}`)
				console.log(`SUCCESS [phone] To the phone: ${phone}`)

				// IMPORTANT
				// It is necessary to have already stored in R2 the auth_info_baileys/creds.json of the sender's WhatsApp account
				// IMPORTANT
				const creds = await env.R2_whatsappCloudflareWorkers.get(`${userBot}/creds.json`)
				if (!creds) {
					console.log('WARNING [!creds] No credentials found')
					return new Response('WARNING [!creds] No credentials found', {status: 400})
				}

				//var sock = await iniciar(env, phone, message)
				const sockAndSuccessSend = await apiSendMessage(userBot, phone, message, env.R2_whatsappCloudflareWorkers)

				if(!sockAndSuccessSend) {
					console.log('WARNING [!sock] Sending message')
					return new Response('WARNING [!sock] Sending message', {status: 400})
				}

				const sock = sockAndSuccessSend.sock
				const successSend = sockAndSuccessSend.successSend

				await sock.ws.close()
				sock.end({
					name: 'false',
					message: 'false'
				})

				if (!successSend) {
					console.log('WARNING [!successSend] Message not sent')
					return new Response('WARNING [!successSend] Message not sent', {status: 400})
				}

				return new Response('SUCCESS [sent] Message sent successfully!', {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}

			catch (error) {
				console.log('ERRO [catch] Erro in /send-message', error)
				return new Response('ERRO [catch] Erro in /send-message', {status: 500})
			}
		}

		// Example: GET /api/get-all-user-bot
		else if (pathName.startsWith('/api/get-all-user-bot') && request.method === 'GET') {
			const allUserBotHead = await env.R2_whatsappCloudflareWorkers.list({ prefix: `${prefixUserBot}/` })

			const objects: { userBot: string; name: string; phone: string; path: string; size: number; created: string; updated: Date; }[] = []
			for (const obj of allUserBotHead.objects) {
				const head = await env.R2_whatsappCloudflareWorkers.head(obj.key)

				objects.push({
					userBot: head?.customMetadata?.userBot || 'not found',
					name: head?.customMetadata?.name || 'not found',
					phone: head?.customMetadata?.phone || 'not found',
					path: head?.customMetadata?.path || 'not found',
					size: obj.size,
					created: head?.customMetadata?.created || 'not found',
					updated: obj.uploaded
				})
			}

			objects.sort((a, b) => {
				const createdA = new Date(!a?.created || a?.created === 'not found' ? '11/11/1111-11:11' : a?.created).getTime()
				const createdB = new Date(!b?.created || b?.created === 'not found' ? '11/11/1111-11:11' : b?.created).getTime()
		
				return createdB - createdA
			})

			return new Response(JSON.stringify(objects), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		}

		else {
			return new Response('No found', {status: 404})
		}
	}
}

async function apiSendMessage(userBot: string, phone: string, message: string, R2FileStorage: R2Bucket): Promise<{sock: ReturnType<typeof makeWASocket>, successSend: boolean} | false> {
	try {
		const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` })
		logger.level = 'silent'

		const msgRetryCounterCache = new NodeCache()

		let successSend = false
		const startSock = async() => {
			const { state, saveCreds } = await useMultiFileAuthState(userBot, R2FileStorage) //CF
			const { version, isLatest } = await fetchLatestBaileysVersion()
			if (logForDevelopment) console.log(`WARNING [startSock = async() => {...] Using WA v${version.join('.')}, isLatest: ${isLatest}`)

			const sock = makeWASocket({
				version,
				logger,
				printQRInTerminal: false,
				auth: {
					creds: state.creds,
					keys: makeCacheableSignalKeyStore(state.keys, logger),
				},
				msgRetryCounterCache,
				generateHighQualityLinkPreview: true
			})

			sock.ev.process(
				async(events) => {
					if(events['connection.update']) {
						const update = events['connection.update']
						const { connection, lastDisconnect } = update
						if(connection === 'close') {
							if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
								if (logForDevelopment) console.log('WARNING [events["connection.update"]] Reconnection not allowed')
							}

							else {
								if (logForDevelopment) console.log('WARNING [events["connection.update"]] Connection closed. You are logged out')
							}
						}

						if (logForDevelopment) console.log('WARNING [events["connection.update"]] Connection update', update)
					}

					if(events['creds.update']) {
						await saveCreds()
					}
				}
			)

			const delay = (ms: number) => new Promise<true>((resolve) => setTimeout(() => resolve(true), ms))

			let countAttempt = 0

			await delay(2000)

			while (!successSend && countAttempt < 2) {
				countAttempt++;
				if (logForDevelopment) console.log(`WARNING [while (!successSend && countAttempt < 2) {...] Attempted sending of message n°${countAttempt}`)

				try {
					const jid = `${phone}@s.whatsapp.net`

					await sock.sendPresenceUpdate('composing', jid)
					await delay(2000 + Math.random() * 3000)

					await sock.sendPresenceUpdate('paused', jid)

					const responseSendMessage = await sock.sendMessage(jid, { text: message })

					if (responseSendMessage?.status! >= 1) {
						successSend = true
						if (logForDevelopment) console.log("WARNING [responseSendMessage?.status! >= 1] {...] Message sent successfully!", responseSendMessage)

						await delay(5000)
						break
					}

					if (logForDevelopment) console.log("ERRO [!(responseSendMessage?.status! >= 1)] sending message, trying again in 2 seconds...", responseSendMessage)
				}
				catch (error) {
					if (logForDevelopment) console.log("ERRO [catch] sending message, trying again in 2 seconds...", error)
				}

				await delay(2000)
			}

			return sock
		}

		const returnIntermediary = await startSock()
		if (!returnIntermediary) {
			return false
		}

		return {sock: returnIntermediary, successSend: successSend}
	}

	catch (error) {
		if (logForDevelopment) console.log('ERRO [catch] [sendMessage()]:', error)
		return false
	}
}

async function apiRegisterWhatsapp(userBot: string, R2FileStorage: R2Bucket): Promise<{sock: ReturnType<typeof makeWASocket>, link: string} | false> {
	try {
		const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` })
		logger.level = 'silent'

		const msgRetryCounterCache = new NodeCache()

		const dateNowForReconnection = Date.now()
		const startSock = async() => {
			const { state, saveCreds } = await useMultiFileAuthState(userBot, R2FileStorage)
			const { version, isLatest } = await fetchLatestBaileysVersion()
			if (logForDevelopment) console.log(`WARNING [startSock = async() => {...] Using WA v${version.join('.')}, isLatest: ${isLatest}`)

			const sock = makeWASocket({
				version,
				logger,
				printQRInTerminal: false,
				auth: {
					creds: state.creds,
					keys: makeCacheableSignalKeyStore(state.keys, logger),
				},
				msgRetryCounterCache,
				generateHighQualityLinkPreview: true
			})

			let waitForLink = ''
			sock.ev.process(
				async(events) => {
					if(events['connection.update']) {
						const update = events['connection.update']
						const { connection, lastDisconnect } = update
						if(connection === 'close') {
							if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
								if ((Date.now() - dateNowForReconnection) <= 15000) {
									if (logForDevelopment) console.log('WARNING [events["connection.update"]] Reconnection allowed')
									startSock()
								}

								else {
									if (logForDevelopment) console.log('WARNING [events["connection.update"]] Reconnection not allowed')
								}
							}

							else {
								if (logForDevelopment) console.log('WARNING [events["connection.update"]] Connection closed. You are logged out')
							}
						}

						if (update.qr) {
							waitForLink = update.qr
						}
					}

					if(events['creds.update']) {
						await saveCreds()
					}
				}
			)

			while (!waitForLink) {
				await new Promise(resolve => setTimeout(resolve, 1000))
			}

			return {
				sock,
				link: waitForLink
			}
		}

		const returnIntermediary = await startSock()
		if (!returnIntermediary) {
			return false
		}

		return returnIntermediary
	}

	catch (error) {
		if (logForDevelopment) console.log('ERRO [catch] [connectWhatsapp()]:', error)
		return false
	}
}
