import { Boom } from '@hapi/boom'
import parsePhoneNumber from 'libphonenumber-js'
import NodeCache from 'node-cache'
import P from 'pino'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, PHONENUMBER_MCC, useMultiFileAuthState } from '../src'

const logger = P({
	transport: {
   		target: 'pino-pretty'
	},
	level: 'trace'
})

const useStore = !process.argv.includes('--no-store')
const doReplies = !process.argv.includes('--no-reply')
const useMobile = process.argv.includes('--mobile')

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache()

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

// start a connection
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

	const sock = makeWASocket({
		version,
		logger,
		printQRInTerminal: true,
		mobile: useMobile,
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
		// implement to handle retries
		getMessage: async key => {
			if(store) {
				const msg = await store.loadMessage(key.remoteJid!, key.id!)
				return msg?.message || undefined
			}

			// only if store is present
			return {
				conversation: 'hello'
			}
		}
	})

	store?.bind(sock.ev)

	// If mobile was chosen, ask for the code
	if(useMobile && !sock.authState.creds.registered) {
		import('readline').then(async(readline) => {
			const question = (text: string) => new Promise<string>((resolve) => rl.question(text, resolve))

			const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
			const { registration } = sock.authState.creds || { registration: {} }

			if(!registration.phoneNumber) {
				registration.phoneNumber = await question('Please enter your mobile phone number:\n')
			} else {
				console.log('Your mobile phone number is not registered.')
			}

			const phoneNumber = parsePhoneNumber(registration!.phoneNumber)
			if(!phoneNumber?.isValid()) {
				throw new Error('Invalid phone number: ' + registration!.phoneNumber)
			}

			registration.phoneNumber = phoneNumber.format('E.164')
			registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
			registration.phoneNumberNationalNumber = phoneNumber.nationalNumber
			const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode]
			if(!mcc) {
				throw new Error('Could not find MCC for phone number: ' + registration!.phoneNumber + '\nPlease specify the MCC manually.')
			}

			registration.phoneNumberMobileCountryCode = mcc

			async function enterCode() {
				try {
					const code = await question('Please enter the one time code:\n')
					const response = await sock.register(code.replace(/["']/g, '').trim().toLowerCase())
					console.log('Successfully registered your phone number.')
					console.log(response)
					rl.close()
				} catch(error) {
					console.error('Failed to register your phone number. Please try again.\n', error)
					await askForOTP()
				}
			}

			async function askForOTP() {
				let code = await question('How would you like to receive the one time code for registration? "sms" or "voice"\nIf you already have a one time registration code enter "code"\n')
				code = code.replace(/["']/g, '').trim().toLowerCase()

				if(code === 'code') {
					await enterCode()
				} else if(code === 'sms' || code === 'voice') {
					registration.method = code

					try {
						await sock.requestRegistrationCode(registration)
						await enterCode()
					} catch(error) {
						console.error('Failed to request registration code. Please try again.\n', error)
						await askForOTP()
					}
				} else {
					await askForOTP()
				}
			}

			await askForOTP()
		}).catch(() => console.error('Not running in a node environment. Please install the readline module to use the automatic registration option.'))
	}

	const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
		await sock.presenceSubscribe(jid)
		await delay(500)

		await sock.sendPresenceUpdate('composing', jid)
		await delay(2000)

		await sock.sendPresenceUpdate('paused', jid)

		await sock.sendMessage(jid, msg)
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

				console.log('connection update', update)
			}

			// credentials updated -- save them
			if(events['creds.update']) {
				await saveCreds()
			}

			if(events.call) {
				console.log('recv call event', events.call)
			}

			// history received
			if(events['messaging-history.set']) {
				const { chats, contacts, messages, isLatest } = events['messaging-history.set']
				console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`)
			}

			// received a new message
			if(events['messages.upsert']) {
				const upsert = events['messages.upsert']
				console.log('recv messages ', JSON.stringify(upsert, undefined, 2))

				if(upsert.type === 'notify') {
					for(const msg of upsert.messages) {
						if(!msg.key.fromMe && doReplies) {
							console.log('replying to', msg.key.remoteJid)
							await sock!.readMessages([msg.key])
							await sendMessageWTyping({ text: 'Hello there!' }, msg.key.remoteJid!)
						}
					}
				}
			}

			// messages updated like status delivered, message deleted etc.
			if(events['messages.update']) {
				console.log(events['messages.update'])
			}

			if(events['message-receipt.update']) {
				console.log(events['message-receipt.update'])
			}

			if(events['messages.reaction']) {
				console.log(events['messages.reaction'])
			}

			if(events['presence.update']) {
				console.log(events['presence.update'])
			}

			if(events['chats.update']) {
				console.log(events['chats.update'])
			}

			if(events['contacts.update']) {
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
			}

			if(events['chats.delete']) {
				console.log('chats deleted ', events['chats.delete'])
			}
		}
	)

	return sock
}

startSock()