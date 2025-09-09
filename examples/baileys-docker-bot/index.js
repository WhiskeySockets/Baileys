const Baileys = require('@whiskeysockets/baileys')
const makeWASocket = Baileys.default
const { useMultiFileAuthState, fetchLatestBaileysVersion } = Baileys
const pino = require('pino')

async function start() {
  const authDir = process.env.BAILEYS_AUTH_DIR || './auth'
  const { state, saveCreds } = await useMultiFileAuthState(authDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'info' })
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    
    if (qr) {
      console.log('QR Code received, scan the following:')
      console.log(qr)
    }
    
    if (connection === 'open') {
      console.log('Connected to WhatsApp!')
    } else if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = statusCode !== 401 // 401 => invalid auth; new QR needed
      console.log(`Connection closed. status=${statusCode} reconnect=${shouldReconnect}`)
      if (shouldReconnect) {
        start().catch(console.error)
      } else {
        console.log('Authentication invalid. Remove auth folder and restart to re-link.')
      }
    }
  })

  // Simple ping-pong example
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages && messages[0]
    if (!msg) return

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      ''

    if (!msg.key.fromMe && text.trim().toLowerCase() === '!ping') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'pong' }, { quoted: msg })
    }
  })
}

start().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})