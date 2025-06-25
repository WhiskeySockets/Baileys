import { Boom } from '@hapi/boom'
import { makeWASocket, makeEnhancedLibSignalRepository, DisconnectReason, useMultiFileAuthState } from '../src'
import { join } from 'path'
import MAIN_LOGGER from '../src/Utils/logger'

const logger = MAIN_LOGGER.child({})
logger.level = 'info'

// External map to store the retry counts for each message
const msgRetryCounterMap = {}

async function connectToWhatsApp() {
    // Use the enhanced signal repository to prevent "Bad MAC" errors
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    // Create a socket with the enhanced signal repository
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger,
        msgRetryCounterMap,
        // Use the enhanced signal repository
        makeSignalRepository: makeEnhancedLibSignalRepository
    })
    
    // Listen for connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            
            // Reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    
    // Listen for credential updates
    sock.ev.on('creds.update', saveCreds)
    
    // Listen for messages
    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))
        
        const msg = m.messages[0]
        if(!msg.key.fromMe && m.type === 'notify') {
            // Mark message as read
            await sock.readMessages([msg.key])
            
            // Reply to the message
            await sock.sendMessage(msg.key.remoteJid!, { text: 'Hello there!' })
        }
    })
}

// Start the connection
connectToWhatsApp()