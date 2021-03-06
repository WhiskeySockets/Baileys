import {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
} from '../src/WAConnection'
import * as fs from 'fs'

async function example() {
    const conn = new WAConnection() // instantiate
    conn.autoReconnect = ReconnectMode.onConnectionLost // only automatically reconnect when the connection breaks
    conn.logger.level = 'debug' // set to 'debug' to see what kind of stuff you can implement
    // attempt to reconnect at most 10 times in a row
    conn.connectOptions.maxRetries = 10
    conn.chatOrderingKey = waChatKey(true) // order chats such that pinned chats are on top
    conn.on('chats-received', ({ hasNewChats }) => {
        console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)
    })
    conn.on('contacts-received', () => {
        console.log(`you have ${Object.keys(conn.contacts).length} contacts`)
    })
    conn.on('initial-data-received', () => {
        console.log('received all initial messages')
    })

    // loads the auth file credentials if present
    /*  Note: one can take this auth_info.json file and login again from any computer without having to scan the QR code, 
        and get full access to one's WhatsApp. Despite the convenience, be careful with this file */
    fs.existsSync('./auth_info.json') && conn.loadAuthInfo ('./auth_info.json')
    // uncomment the following line to proxy the connection; some random proxy I got off of: https://proxyscrape.com/free-proxy-list
    //conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
    await conn.connect()
    // credentials are updated on every connect
    const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file

    console.log('oh hello ' + conn.user.name + ' (' + conn.user.jid + ')')    
    // uncomment to load all unread messages
    //const unread = await conn.loadAllUnreadMessages ()
    //console.log ('you have ' + unread.length + ' unread messages')

    /**
     * The universal event for anything that happens
     * New messages, updated messages, read & delivered messages, participants typing etc.
     */
    conn.on('chat-update', async chat => {
        if (chat.presences) { // receive presence updates -- composing, available, etc.
            Object.values(chat.presences).forEach(presence => console.log( `${presence.name}'s presence is ${presence.lastKnownPresence} in ${chat.jid}`))
        }
        if(chat.imgUrl) {
            console.log('imgUrl of chat changed ', chat.imgUrl)
            return
        }
        // only do something when a new message is received
        if (!chat.hasNewMessage) {
            if(chat.messages) {
                console.log('updated message: ', chat.messages.first)
            }
            return
        } 
        
        const m = chat.messages.all()[0] // pull the new message from the update
        const messageStubType = WA_MESSAGE_STUB_TYPES[m.messageStubType] ||  'MESSAGE'
        console.log('got notification of type: ' + messageStubType)

        const messageContent = m.message
        // if it is not a regular text or media message
        if (!messageContent) return
        
        if (m.key.fromMe) {
            console.log('relayed my own message')
            return
        }

        let sender = m.key.remoteJid
        if (m.key.participant) {
            // participant exists if the message is in a group
            sender += ' (' + m.key.participant + ')'
        }
        const messageType = Object.keys (messageContent)[0] // message will always contain one key signifying what kind of message
        if (messageType === MessageType.text) {
            const text = m.message.conversation
            console.log(sender + ' sent: ' + text)
        } else if (messageType === MessageType.extendedText) {
            const text = m.message.extendedTextMessage.text
            console.log(sender + ' sent: ' + text + ' and quoted message: ' + JSON.stringify(m.message))
        } else if (messageType === MessageType.contact) {
            const contact = m.message.contactMessage
            console.log(sender + ' sent contact (' + contact.displayName + '): ' + contact.vcard)
        } else if (messageType === MessageType.location || messageType === MessageType.liveLocation) {
            const locMessage = m.message[messageType] as WALocationMessage
            console.log(`${sender} sent location (lat: ${locMessage.degreesLatitude}, long: ${locMessage.degreesLongitude})`)
            
            await conn.downloadAndSaveMediaMessage(m, './Media/media_loc_thumb_in_' + m.key.id) // save location thumbnail

            if (messageType === MessageType.liveLocation) {
                console.log(`${sender} sent live location for duration: ${m.duration/60}`)
            }
        } else {
            // if it is a media (audio, image, video, sticker) message
            // decode, decrypt & save the media.
            // The extension to the is applied automatically based on the media type
            try {
                const savedFile = await conn.downloadAndSaveMediaMessage(m, './Media/media_in_' + m.key.id)
                console.log(sender + ' sent media, saved at: ' + savedFile)
            } catch (err) {
                console.log('error in decoding message: ' + err)
            }
        }
        // send a reply after 3 seconds
        setTimeout(async () => {
            await conn.chatRead(m.key.remoteJid) // mark chat read
            await conn.updatePresence(m.key.remoteJid, Presence.available) // tell them we're available
            await conn.updatePresence(m.key.remoteJid, Presence.composing) // tell them we're composing

            const options: MessageOptions = { quoted: m }
            let content
            let type: MessageType
            const rand = Math.random()
            if (rand > 0.66) { // choose at random
                content = 'hello!' // send a "hello!" & quote the message recieved
                type = MessageType.text
            } else if (rand > 0.33) { // choose at random
                content = { degreesLatitude: 32.123123, degreesLongitude: 12.12123123 }
                type = MessageType.location
            } else {
                content = fs.readFileSync('./Media/ma_gif.mp4') // load the gif
                options.mimetype = Mimetype.gif
                type = MessageType.video
            }
            const response = await conn.sendMessage(m.key.remoteJid, content, type, options)
            console.log("sent message with ID '" + response.key.id + "' successfully")
        }, 3 * 1000)
    })

    /* example of custom functionality for tracking battery */
    conn.on('CB:action,,battery', json => {
        const batteryLevelStr = json[2][0][1].value
        const batterylevel = parseInt(batteryLevelStr)
        console.log('battery level: ' + batterylevel)
    })
    conn.on('close', ({reason, isReconnecting}) => (
        console.log ('oh no got disconnected: ' + reason + ', reconnecting: ' + isReconnecting)
    ))
}

example().catch((err) => console.log(`encountered error: ${err}`))