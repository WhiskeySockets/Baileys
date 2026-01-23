import { Boom } from '@hapi/boom'
import NodeCache from '@cacheable/node-cache'
import readline from 'readline'
import makeWASocket, { 
	CacheStore, 
	DEFAULT_CONNECTION_CONFIG, 
	DisconnectReason, 
	fetchLatestBaileysVersion, 
	generateMessageIDV2, 
	getAggregateVotesInPollMessage, 
	isJidNewsletter, 
	makeCacheableSignalKeyStore, 
	proto, 
	useMultiFileAuthState, 
	WAMessageContent, 
	WAMessageKey,
	// Baileys-Joss: Interactive Message features
	generateQuickReplyButtons,
	generateInteractiveListMessage,
	generateCombinedButtons,
	generateCopyCodeButton,
	generateUrlButtonMessage,
	// Baileys-Joss: JID Plotting features
	getCurrentSenderInfo,
	parseJid,
	isSelf,
	getRemoteJidFromMessage
} from '../src'
import P from 'pino'

const logger = P({
  level: "trace",
  transport: {
    targets: [
      {
        target: "pino-pretty", // pretty-print for console
        options: { colorize: true },
        level: "trace",
      },
      {
        target: "pino/file", // raw file output
        options: { destination: './wa-logs.txt' },
        level: "trace",
      },
    ],
  },
})
logger.level = 'trace'

const doReplies = process.argv.includes('--do-reply')
const usePairingCode = process.argv.includes('--use-pairing-code')

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache() as CacheStore

const onDemandMap = new Map<string, string>()

// Read line interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text: string) => new Promise<string>((resolve) => rl.question(text, resolve))

// start a connection
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	// NOTE: For unit testing purposes only
	if (process.env.ADV_SECRET_KEY) {
		state.creds.advSecretKey = process.env.ADV_SECRET_KEY
	}
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	logger.debug({version: version.join('.'), isLatest}, `using latest WA version`)

	const sock = makeWASocket({
		version,
		logger,
		waWebSocketUrl: process.env.SOCKET_URL ?? DEFAULT_CONNECTION_CONFIG.waWebSocketUrl,
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
		getMessage
	})

	// the process function lets you process all events that just occurred
	// efficiently in a batch
	sock.ev.process(
		// events is a map for event name => event data
		async(events) => {
			// something about the connection changed
			// maybe it closed, or we received all offline message or connection opened
			if(events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect, qr } = update
				if(connection === 'close') {
					// reconnect if not logged out
					if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
						startSock()
					} else {
						logger.fatal('Connection closed. You are logged out.')
					}
				}

				if (qr) {
					// Pairing code for Web clients
					if (usePairingCode && !sock.authState.creds.registered) {
						const phoneNumber = await question('Please enter your phone number:\n')
						const code = await sock.requestPairingCode(phoneNumber)
						console.log(`Pairing code: ${code}`)
					}
				}

				// Baileys-Joss: Log sender info when connected
				if (connection === 'open') {
					const senderInfo = getCurrentSenderInfo(sock.authState)
					if (senderInfo) {
						logger.info({
							phone: senderInfo.phoneNumber,
							phoneJid: senderInfo.phoneJid,
							lid: senderInfo.lid,
							deviceId: senderInfo.deviceId,
							name: senderInfo.pushName
						}, 'Baileys-Joss: Connected as')
					}
				}

				logger.debug(update, 'connection update')
			}

			// credentials updated -- save them
			if(events['creds.update']) {
				await saveCreds()
				logger.debug({}, 'creds save triggered')
			}

			if(events['labels.association']) {
				logger.debug(events['labels.association'], 'labels.association event fired')
			}


			if(events['labels.edit']) {
				logger.debug(events['labels.edit'], 'labels.edit event fired')
			}

			if(events['call']) {
				logger.debug(events['call'], 'call event fired')
			}

			// history received
			if(events['messaging-history.set']) {
				const { chats, contacts, messages, isLatest, progress, syncType } = events['messaging-history.set']
				if (syncType === proto.HistorySync.HistorySyncType.ON_DEMAND) {
					logger.debug(messages, 'received on-demand history sync')
				}
				logger.debug({contacts: contacts.length, chats: chats.length, messages: messages.length, isLatest, progress, syncType: syncType?.toString() }, 'messaging-history.set event fired')
			}

			// received a new message
      if (events['messages.upsert']) {
        const upsert = events['messages.upsert']
        logger.debug(upsert, 'messages.upsert fired')

        if (!!upsert.requestId) {
          logger.debug(upsert, 'placeholder request message received')
        }



        if (upsert.type === 'notify') {
          for (const msg of upsert.messages) {
            if (msg.message?.conversation || msg.message?.extendedTextMessage?.text) {
              const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
              if (text == "requestPlaceholder" && !upsert.requestId) {
                const messageId = await sock.requestPlaceholderResend(msg.key)
								logger.debug({ id: messageId }, 'requested placeholder resync')
              }

              // go to an old chat and send this
              if (text == "onDemandHistSync") {
                const messageId = await sock.fetchMessageHistory(50, msg.key, msg.messageTimestamp!)
                logger.debug({ id: messageId }, 'requested on-demand history resync')
              }

              if (!msg.key.fromMe && doReplies && !isJidNewsletter(msg.key?.remoteJid!)) {
              	const id = generateMessageIDV2(sock.user?.id)
              	logger.debug({id, orig_id: msg.key.id }, 'replying to message')
                await sock.sendMessage(msg.key.remoteJid!, { text: 'pong '+msg.key.id }, {messageId: id })
              }

              // ============================================
              // Baileys-Joss: Interactive Button Examples
              // ============================================
              
              // Test: Quick Reply Buttons
              if (text === '/buttons' || text === '/tombol') {
                const buttons = generateQuickReplyButtons(
                  '🎛️ *Baileys-Joss Interactive Buttons*\n\nPilih salah satu opsi di bawah:',
                  [
                    { id: 'btn-1', displayText: '✅ Setuju' },
                    { id: 'btn-2', displayText: '❌ Tolak' },
                    { id: 'btn-3', displayText: '📞 Hubungi CS' }
                  ],
                  { footer: 'Powered by Baileys-Joss', title: 'Menu Pilihan' }
                )
                await sock.sendMessage(msg.key.remoteJid!, buttons)
              }

              // Test: List Message
              if (text === '/list' || text === '/menu') {
                const listMessage = generateInteractiveListMessage({
                  title: '📋 Menu Produk',
                  buttonText: 'Lihat Menu',
                  description: 'Silahkan pilih produk yang diinginkan',
                  footer: 'Ketik nomor untuk memesan',
                  sections: [
                    {
                      title: '🍔 Makanan',
                      rows: [
                        { rowId: 'nasi-goreng', title: 'Nasi Goreng', description: 'Rp 25.000' },
                        { rowId: 'mie-goreng', title: 'Mie Goreng', description: 'Rp 22.000' },
                        { rowId: 'ayam-bakar', title: 'Ayam Bakar', description: 'Rp 35.000' }
                      ]
                    },
                    {
                      title: '🥤 Minuman',
                      rows: [
                        { rowId: 'es-teh', title: 'Es Teh', description: 'Rp 5.000' },
                        { rowId: 'es-jeruk', title: 'Es Jeruk', description: 'Rp 7.000' },
                        { rowId: 'kopi', title: 'Kopi', description: 'Rp 10.000' }
                      ]
                    }
                  ]
                })
                await sock.sendMessage(msg.key.remoteJid!, listMessage)
              }

              // Test: Combined Buttons (URL, Reply, Copy, Call)
              if (text === '/combined' || text === '/gabung') {
                const combinedButtons = generateCombinedButtons(
                  '🔥 *Promo Spesial!*\n\nDapatkan diskon 50% untuk pembelian pertama.',
                  [
                    { type: 'reply', displayText: '🛒 Pesan Sekarang', id: 'order' },
                    { type: 'url', displayText: '🌐 Website', url: 'https://example.com' },
                    { type: 'copy', displayText: '📋 Copy Promo', copyCode: 'DISKON50' }
                  ],
                  { title: '✨ Promo', footer: 'Berlaku s/d 31 Desember' }
                )
                await sock.sendMessage(msg.key.remoteJid!, combinedButtons)
              }

              // Test: Copy Code Button
              if (text === '/otp' || text === '/code') {
                const copyButton = generateCopyCodeButton(
                  '🔐 *Kode OTP Anda*\n\nGunakan kode ini untuk verifikasi:',
                  '123456',
                  '📋 Copy Kode',
                  { footer: 'Kode berlaku 5 menit' }
                )
                await sock.sendMessage(msg.key.remoteJid!, copyButton)
              }

              // Test: URL Button
              if (text === '/link' || text === '/url') {
                const urlButton = generateUrlButtonMessage(
                  '🔗 *Kunjungi Website Kami*\n\nTemukan berbagai produk menarik!',
                  [
                    { displayText: '🌐 Buka Website', url: 'https://example.com' },
                    { displayText: '📱 Download App', url: 'https://play.google.com' }
                  ],
                  { title: 'Link Penting', footer: 'Click untuk membuka' }
                )
                await sock.sendMessage(msg.key.remoteJid!, urlButton)
              }

              // Test: JID Info
              if (text === '/jidinfo' || text === '/info') {
                const jidDetails = getRemoteJidFromMessage(msg)
                const parsedJid = parseJid(msg.key.remoteJid!)
                const senderInfo = getCurrentSenderInfo(sock.authState)
                
                let infoText = '📍 *JID Information*\n\n'
                infoText += `*Chat JID:* ${jidDetails?.chatJid}\n`
                infoText += `*Sender JID:* ${jidDetails?.senderJid}\n\n`
                
                if (parsedJid) {
                  infoText += `*User:* ${parsedJid.user}\n`
                  infoText += `*Server:* ${parsedJid.server}\n`
                  infoText += `*Device:* ${parsedJid.device}\n`
                  infoText += `*Is LID:* ${parsedJid.isLid}\n`
                  infoText += `*Is PN:* ${parsedJid.isPn}\n`
                  infoText += `*Is Group:* ${parsedJid.isGroup}\n`
                }
                
                if (senderInfo) {
                  infoText += `\n*Your Phone:* ${senderInfo.phoneNumber}\n`
                  infoText += `*Your LID:* ${senderInfo.lid || 'N/A'}\n`
                  infoText += `*Is Self:* ${isSelf(msg.key.remoteJid!, senderInfo)}\n`
                }

                await sock.sendMessage(msg.key.remoteJid!, { text: infoText })
              }

              // Help command
              if (text === '/help' || text === '/bantuan') {
                const helpText = `🤖 *Baileys-Joss Commands*

*Interactive Buttons:*
/buttons - Quick reply buttons
/list - List message dengan sections
/combined - Combined buttons (URL, Reply, Copy)
/otp - Copy code button
/link - URL buttons

*JID Plotting:*
/jidinfo - Info tentang JID

*Other:*
/help - Tampilkan bantuan ini

_Powered by Baileys-Joss_`
                await sock.sendMessage(msg.key.remoteJid!, { text: helpText })
              }
            }
          }
        }
      }

			// messages updated like status delivered, message deleted etc.
			if(events['messages.update']) {
				logger.debug(events['messages.update'], 'messages.update fired')

				for(const { key, update } of events['messages.update']) {
					if(update.pollUpdates) {
						const pollCreation: proto.IMessage = {} // get the poll creation message somehow
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
			}

			if(events['message-receipt.update']) {
				logger.debug(events['message-receipt.update'])
			}

			if (events['contacts.upsert']) {
				logger.debug(events['message-receipt.update'])
			}

			if(events['messages.reaction']) {
				logger.debug(events['messages.reaction'])
			}

			if(events['presence.update']) {
				logger.debug(events['presence.update'])
			}

			if(events['chats.update']) {
				logger.debug(events['chats.update'])
			}

			if(events['contacts.update']) {
				for(const contact of events['contacts.update']) {
					if(typeof contact.imgUrl !== 'undefined') {
						const newUrl = contact.imgUrl === null
							? null
							: await sock!.profilePictureUrl(contact.id!).catch(() => null)
						logger.debug({id: contact.id, newUrl}, `contact has a new profile pic` )
					}
				}
			}

			if(events['chats.delete']) {
				logger.debug('chats deleted ', events['chats.delete'])
			}

			if(events['group.member-tag.update']) {
				logger.debug('group member tag update', JSON.stringify(events['group.member-tag.update'], undefined, 2))
			}
		}
	)

	return sock

	async function getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
	  // Implement a way to retreive messages that were upserted from messages.upsert
			// up to you

		// only if store is present
		return proto.Message.create({ conversation: 'test' })
	}
}

startSock()
