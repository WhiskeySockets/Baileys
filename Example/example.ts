import { Boom } from '@hapi/boom'
import NodeCache from '@cacheable/node-cache'
//CF import readline from 'readline'
import makeWASocket, { AnyMessageContent, BinaryInfo, delay, DisconnectReason, downloadAndProcessHistorySyncNotification, encodeWAM, fetchLatestBaileysVersion, getAggregateVotesInPollMessage, getHistoryMsg, isJidNewsletter, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState, WAMessageContent, WAMessageKey } from '../src'
//import MAIN_LOGGER from '../src/Utils/logger'
//CF import open from 'open'
//CF import fs from 'fs'
import P from 'pino'


import { ExecutionContext, R2Bucket } from '@cloudflare/workers-types' //CF


//CF \/
type Type_envData = {
    R2_fileStorage: R2Bucket;
}
//CF /\


//CF \/
export default {
	async fetch(Parameter_request: Request, Parameter_env: Type_envData, Parameter_ctx: ExecutionContext): Promise<Response> {
		const Const_newUrl = new URL(Parameter_request.url)
		const Const_pathName = Const_newUrl.pathname

		// Example: /send-message?phone=1234567890&message=Hello%20World&code=123456
		if (Const_pathName.startsWith('/send-message')) {
			try {
				const Const_number = Const_newUrl.searchParams.get('phone') || ''
				const Const_message = Const_newUrl.searchParams.get('message') || ''
				const Const_code = Const_newUrl.searchParams.get('code') || ''

				if (Const_code !== '123456') {
					console.log('WARNING [Const_code !== ***] No permission')
					return new Response('WARNING [Const_code !== ***] No permission', {status: 401})
				}

				if (!Const_number || !Const_message) {
					console.log('WARNING [!Const_number || !Const_message] Missing phone or message')
					return new Response('WARNING [!Const_number || !Const_message] Missing phone or message', {status: 400})
				}

				console.log(`SUCCESS [Const_message] Sending message: ${Const_message}`)
				console.log(`SUCCESS [Const_number] To the number: ${Const_number}`)

				// IMPORTANT
				// It is necessary to have already stored in R2 the auth_info_baileys/creds.json of the sender's WhatsApp account
				// IMPORTANT
				const Const_creds = await Parameter_env.R2_fileStorage.get('auth_info_baileys/creds.json')
				if (!Const_creds) {
					console.log('WARNING [!Const_creds] No credentials found')
					return new Response('WARNING [!Const_creds] No credentials found', {status: 400})
				}

				var Const_sock = await Function_sendMessage(Const_number, Const_message, Parameter_env.R2_fileStorage)
				if(!Const_sock) {
					console.log('WARNING [!Const_sock] Sending message')
					return new Response('WARNING [!Const_sock] Sending message', {status: 400})
				}

				await Const_sock.ws.close()
				Const_sock.end({
					name: 'false',
					message: 'false'
				})

				return new Response('SUCCESS [sent] Message sent successfully!', {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}

			catch (Parameter_error) {
				console.log('ERRO [catch] Erro in /send-message', Parameter_error)
				return new Response('ERRO [catch] Erro in /send-message', {status: 500})
			}
		}

		else {
			console.log('WARNING [else] Not found')
			return new Response('WARNING [else] Not found', {status: 404})
		}
	}
}
//CF /\


async function Function_sendMessage(Parameter_phone: string, Parameter_message: string, Parameter_R2FileStorage: R2Bucket): Promise<ReturnType<typeof makeWASocket> | false> { //CF
	try { //CF
		const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` } /*CF , P.destination('./wa-logs.txt') */)
		logger.level = 'silent' /*CF 'trace' */

		const useStore = false /*CF !process.argv.includes('--no-store') */
		const doReplies = true /*CF process.argv.includes('--do-reply') */
		const usePairingCode = false /* process.argv.includes('--use-pairing-code') */

		// external map to store retry counts of messages when decryption/encryption fails
		// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
		const msgRetryCounterCache = new NodeCache()

		const onDemandMap = new Map<string, string>()

		// Read line interface
		/*CF const rl = readline.createInterface({ input: process.stdin, output: process.stdout }) */
		/*CF const question = (text: string) => new Promise<string>((resolve) => rl.question(text, resolve)) */

		// the store maintains the data of the WA connection in memory
		// can be written out to a file & read from it
		/*CF const store = useStore ? makeInMemoryStore({ logger }) : undefined
		store?.readFromFile('./baileys_store_multi.json') */
		// save every 10s
		/*CF setInterval(() => {
			store?.writeToFile('./baileys_store_multi.json')
		}, 10_000) */

		// start a connection
		const startSock = async() => {
			const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info', Parameter_R2FileStorage) //CF
			// fetch latest version of WA Web
			const { version, isLatest } = await fetchLatestBaileysVersion()
			console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

			const sock = makeWASocket({
				version,
				logger,
				printQRInTerminal: !usePairingCode,
				auth: {
					creds: state.creds,
					/** caching makes the store faster to send/recv messages */
					keys: makeCacheableSignalKeyStore(state.keys, logger),
				},
				msgRetryCounterCache,
				generateHighQualityLinkPreview: true,
				// ignore all broadcast messages -- to receive the same
				// comment the line below out
				// shouldIgnoreJid: jid => isJidBroadcast(jid),
				// implement to handle retries & poll updates
				/* getMessage, */
			})

			/*CF store?.bind(sock.ev) */

			// Pairing code for Web clients
			/*CF if (usePairingCode && !sock.authState.creds.registered) {
				// todo move to QR event
				const phoneNumber = await question('Please enter your phone number:\n')
				const code = await sock.requestPairingCode(phoneNumber)
				console.log(`Pairing code: ${code}`)
			} */

			const sendMessageWTyping = async(msg: AnyMessageContent, jid: string): Promise<proto.WebMessageInfo | undefined> => { //CF
				await sock.presenceSubscribe(jid)
				await delay(500) //CF

				await sock.sendPresenceUpdate('composing', jid)
				await delay(2000) //CF

				await sock.sendPresenceUpdate('paused', jid)

				return await sock.sendMessage(jid, msg) //CF
			}

			// the process function lets you process all events that just occurred
			// efficiently in a batch
			sock.ev.process(
				// events is a map for event name => event data
				async(events) => {
					// something about the connection changed
					// maybe it closed, or we received all offline message or connection opened
					if(events['connection.update']) {
						const update = events['connection.update']
						const { connection, lastDisconnect } = update
						if(connection === 'close') {
							// reconnect if not logged out
							if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
								startSock()
							} else {
								console.log('Connection closed. You are logged out.')
							}
						}
						
						// WARNING: THIS WILL SEND A WAM EXAMPLE AND THIS IS A ****CAPTURED MESSAGE.****
						// DO NOT ACTUALLY ENABLE THIS UNLESS YOU MODIFIED THE FILE.JSON!!!!!
						// THE ANALYTICS IN THE FILE ARE OLD. DO NOT USE THEM.
						// YOUR APP SHOULD HAVE GLOBALS AND ANALYTICS ACCURATE TO TIME, DATE AND THE SESSION
						// THIS FILE.JSON APPROACH IS JUST AN APPROACH I USED, BE FREE TO DO THIS IN ANOTHER WAY.
						// THE FIRST EVENT CONTAINS THE CONSTANT GLOBALS, EXCEPT THE seqenceNumber(in the event) and commitTime
						// THIS INCLUDES STUFF LIKE ocVersion WHICH IS CRUCIAL FOR THE PREVENTION OF THE WARNING
						/*CF const sendWAMExample = false;
						if(connection === 'open' && sendWAMExample) {
							/// sending WAM EXAMPLE
							const {
								header: {
									wamVersion,
									eventSequenceNumber,
								},
								events,
							} = JSON.parse(await fs.promises.readFile("./boot_analytics_test.json", "utf-8"))

							const binaryInfo = new BinaryInfo({
								protocolVersion: wamVersion,
								sequence: eventSequenceNumber,
								events: events
							})

							const buffer = encodeWAM(binaryInfo);
							
							const result = await sock.sendWAMBuffer(buffer)
							console.log(result)
						} */

						console.log('connection update', update)
					}

					// credentials updated -- save them
					if(events['creds.update']) {
						await saveCreds()
					}

					/*CF if(events['labels.association']) {
						console.log(events['labels.association'])
					} */


					/*CF if(events['labels.edit']) {
						console.log(events['labels.edit'])
					} */

					/*CF if(events.call) {
						console.log('recv call event', events.call)
					} */

					// history received
					/*CF if(events['messaging-history.set']) {
						const { chats, contacts, messages, isLatest, progress, syncType } = events['messaging-history.set']
						if (syncType === proto.HistorySync.HistorySyncType.ON_DEMAND) {
							console.log('received on-demand history sync, messages=', messages)
						}
						console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest}, progress: ${progress}%), type: ${syncType}`)
					} */

					// received a new message
					/*CF if(events['messages.upsert']) {
						const upsert = events['messages.upsert']
						console.log('recv messages ', JSON.stringify(upsert, undefined, 2))

						if(upsert.type === 'notify') {
							for (const msg of upsert.messages) { */
								//TODO: More built-in implementation of this
								/* if (
									msg.message?.protocolMessage?.type ===
									proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION
								) {
									const historySyncNotification = getHistoryMsg(msg.message)
									if (
									historySyncNotification?.syncType ==
									proto.HistorySync.HistorySyncType.ON_DEMAND
									) {
									const { messages } =
										await downloadAndProcessHistorySyncNotification(
										historySyncNotification,
										{}
										)

										
										const chatId = onDemandMap.get(
											historySyncNotification!.peerDataRequestSessionId!
										)
										
										console.log(messages)

									onDemandMap.delete(
										historySyncNotification!.peerDataRequestSessionId!
									)

									/*
										// 50 messages is the limit imposed by whatsapp
										//TODO: Add ratelimit of 7200 seconds
										//TODO: Max retries 10
										const messageId = await sock.fetchMessageHistory(
											50,
											oldestMessageKey,
											oldestMessageTimestamp
										)
										onDemandMap.set(messageId, chatId)
									}
								} */

								/*CF if (msg.message?.conversation || msg.message?.extendedTextMessage?.text) {
									const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
									if (text == "requestPlaceholder" && !upsert.requestId) {
										const messageId = await sock.requestPlaceholderResend(msg.key) 
										console.log('requested placeholder resync, id=', messageId)
									} else if (upsert.requestId) {
										console.log('Message received from phone, id=', upsert.requestId, msg)
									}

									// go to an old chat and send this
									if (text == "onDemandHistSync") {
										const messageId = await sock.fetchMessageHistory(50, msg.key, msg.messageTimestamp!) 
										console.log('requested on-demand sync, id=', messageId)
									}
								}

								if(!msg.key.fromMe && doReplies && !isJidNewsletter(msg.key?.remoteJid!)) {

									console.log('replying to', msg.key.remoteJid)
									await sock!.readMessages([msg.key])
									await sendMessageWTyping({ text: 'Hello there!' }, msg.key.remoteJid!)
								}
							}
						}
					} */

					// messages updated like status delivered, message deleted etc.
					/*CF if(events['messages.update']) {
						console.log(
							JSON.stringify(events['messages.update'], undefined, 2)
						)

						for(const { key, update } of events['messages.update']) {
							if(update.pollUpdates) {
								const pollCreation = await getMessage(key)
								if(pollCreation) {
									console.log(
										'got poll update, aggregation: ',
										getAggregateVotesInPollMessage({
											message: pollCreation,
											pollUpdates: update.pollUpdates,
										})
									)
								}
							}
						}
					} */

					/*CF if(events['message-receipt.update']) {
						console.log(events['message-receipt.update'])
					} */

					/*CF if(events['messages.reaction']) {
						console.log(events['messages.reaction'])
					} */

					/*CF if(events['presence.update']) {
						console.log(events['presence.update'])
					} */

					/*CF if(events['chats.update']) {
						console.log(events['chats.update'])
					} */

					/*CF if(events['contacts.update']) {
						for(const contact of events['contacts.update']) {
							if(typeof contact.imgUrl !== 'undefined') {
								const newUrl = contact.imgUrl === null
									? null
									: await sock!.profilePictureUrl(contact.id!).catch(() => null)
								console.log(
									`contact ${contact.id} has a new profile pic: ${newUrl}`,
								)
							}
						}
					} */

					/*CF if(events['chats.delete']) {
						console.log('chats deleted ', events['chats.delete'])
					} */
				}
			)

			/*CF return sock */

			/*CF async function getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
				if(store) {
					const msg = await store.loadMessage(key.remoteJid!, key.id!)
					return msg?.message || undefined
				}

				// only if store is present
				return proto.Message.fromObject({})
			} */

			//CF \/
			const Function_delay = (Parameter_ms: number) => new Promise<true>((Parameter_resolve) => setTimeout(() => Parameter_resolve(true), Parameter_ms))

			let Let_successSend = false
			let Let_countAttempt = 0

			await Function_delay(2000)

			while (!Let_successSend && Let_countAttempt < 10) {
				Let_countAttempt++;
				console.log(`Attempted sending of message n°${Let_countAttempt + 1}`)

				try {
					const Const_responseSendMessage = await sendMessageWTyping({ text: Parameter_message }, `${Parameter_phone}@s.whatsapp.net`)

					if (Const_responseSendMessage?.status! >= 1) {
						Let_successSend = true
						console.log("Message sent successfully!", Const_responseSendMessage)

						await Function_delay(5000)
						break
					}

					console.log("Error [!(Const_responseSendMessage?.status! >= 1)] sending message, trying again in 2 seconds...", Const_responseSendMessage)
				}
				catch (error) {
					console.error("Error [CATCH] sending message, trying again in 2 seconds...", error)
				}

				await Function_delay(2000)
			}
			//CF /\

			return sock
		}

		const Const_return = await startSock()
		if (!Const_return) {
			return false
		}

		return Const_return
	} //CF

	//CF \/
	catch (Parameter_error) {
		console.log('ERRO [CATCH] [Function_sendMessage]:', Parameter_error)
		return false
	}
	//CF /\
} //CF
