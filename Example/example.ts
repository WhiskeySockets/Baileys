import {
    WAClient,
    MessageType,
    decodeMediaMessage,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    MessageLogLevel,
    WAMessageType,
} from '../src/WAClient/WAClient'
import * as fs from 'fs'

async function example() {
    const client = new WAClient() // instantiate
    client.autoReconnect = true // auto reconnect on disconnect
    client.logLevel = MessageLogLevel.info // set to unhandled to see what kind of stuff you can implement

    // connect or timeout in 20 seconds (loads the auth file credentials if present)
    const [user, chats, contacts] = await client.connect('./auth_info.json', 20 * 1000)
    const unread = chats.all().flatMap (chat => chat.messages.slice(chat.messages.length-chat.count))

    console.log('oh hello ' + user.name + ' (' + user.id + ')')
    console.log('you have ' + chats.all().length + ' chats & ' + contacts.length + ' contacts')
    console.log ('you have ' + unread.length + ' unread messages')

    const authInfo = client.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
    /*  Note: one can take this auth_info.json file and login again from any computer without having to scan the QR code, 
        and get full access to one's WhatsApp. Despite the convenience, be careful with this file */
    client.setOnPresenceUpdate(json => console.log(json.id + ' presence is ' + json.type))
    client.setOnMessageStatusChange(json => {
        const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
        console.log(`${json.to}${participant} acknlowledged message(s) ${json.ids} as ${json.type}`)
    })
     // set to false to NOT relay your own sent messages
    client.setOnUnreadMessage(true, async (m) => {
        const messageStubType = WAMessageType[m.messageStubType] ||  'MESSAGE'
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
            
            decodeMediaMessage(m.message, './Media/media_loc_thumb_in_' + m.key.id) // save location thumbnail

            if (messageType === MessageType.liveLocation) {
                console.log(`${sender} sent live location for duration: ${m.duration/60}`)
            }
        } else {
            // if it is a media (audio, image, video) message
            // decode, decrypt & save the media.
            // The extension to the is applied automatically based on the media type
            try {
                const savedFile = await decodeMediaMessage(m.message, './Media/media_in_' + m.key.id)
                console.log(sender + ' sent media, saved at: ' + savedFile)
            } catch (err) {
                console.log('error in decoding message: ' + err)
            }
        }
        // send a reply after 3 seconds
        setTimeout(async () => {
            await client.sendReadReceipt(m.key.remoteJid, m.key.id) // send read receipt
            await client.updatePresence(m.key.remoteJid, Presence.available) // tell them we're available
            await client.updatePresence(m.key.remoteJid, Presence.composing) // tell them we're composing

            const options: MessageOptions = { quoted: m }
            let content
            let type: MessageType
            const rand = Math.random()
            if (rand > 0.66) {
                // choose at random
                content = 'hello!' // send a "hello!" & quote the message recieved
                type = MessageType.text
            } else if (rand > 0.33) {
                // choose at random
                content = { degreesLatitude: 32.123123, degreesLongitude: 12.12123123 }
                type = MessageType.location
            } else {
                content = fs.readFileSync('./Media/ma_gif.mp4') // load the gif
                options.mimetype = Mimetype.gif
                type = MessageType.video
            }
            const response = await client.sendMessage(m.key.remoteJid, content, type, options)
            console.log("sent message with ID '" + response.messageID + "' successfully: " + (response.status === 200))
        }, 3 * 1000)
    })

    /* example of custom functionality for tracking battery */
    client.registerCallback(['action', null, 'battery'], json => {
        const batteryLevelStr = json[2][0][1].value
        const batterylevel = parseInt(batteryLevelStr)
        console.log('battery level: ' + batterylevel)
    })
    client.setOnUnexpectedDisconnect(reason => {
        if (reason === 'replaced') {
            // uncomment to reconnect whenever the connection gets taken over from somewhere else
            // await client.connect ()
        } else {
            console.log ('oh no got disconnected: ' + reason)
        }
    })
}

example().catch((err) => console.log(`encountered error: ${err}`))
