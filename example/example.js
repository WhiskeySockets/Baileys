const WhatsAppWeb = require("../WhatsAppWeb")
const fs = require("fs")

const client = new WhatsAppWeb() // instantiate
client.autoReconnect = true // auto reconnect on disconnect
client.logUnhandledMessages = false // set to true to see what kind of stuff you can implement
var authInfo = null

try {
    const file = fs.readFileSync("auth_info.json") // load a closed session back if it exists
    authInfo = JSON.parse(file)
} catch { }

client.connect (authInfo, 20*1000) // connect or timeout in 20 seconds
.then (([user, chats, contacts, unread]) => {
    console.log ("oh hello " + user.name + " (" + user.id + ")")
    console.log ("you have " + unread.length + " unread messages")
    console.log ("you have " + chats.length + " chats & " + contacts.length + " contacts")

    const authInfo = client.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    fs.writeFileSync("auth_info.json", JSON.stringify(authInfo, null, "\t")) // save this info to a file
    /*  Note: one can take this auth_info.json file and login again from any computer without having to scan the QR code, 
        and get full access to one's WhatsApp. Despite the convenience, be careful with this file */

    client.setOnPresenceUpdate (json => console.log(json.id + " presence is " + json.type))
    client.setOnMessageStatusChange (json => {
        const participant = json.participant ? " ("+json.participant+")" : "" // participant exists when the message is from a group
        console.log(json.to + participant + 
            " acknowledged message(s) " + json.ids + 
            " as " + json.type + " at " + json.timestamp)
    })
    client.setOnUnreadMessage (m => {
        const [notificationType, messageType] = client.getNotificationType(m) // get what type of notification it is -- message, group add notification etc.
        console.log("got notification of type: " + notificationType)

        if (notificationType !== "message") {
            return
        }
        if (m.key.fromMe) {
            console.log ("relayed my own message")
            return
        }

        let sender = m.key.remoteJid
        if (m.key.participant) { // participant exists if the message is in a group 
            sender += " ("+m.key.participant+")"
        }
        if (messageType === WhatsAppWeb.MessageType.text) {
            const text =  m.message.conversation
            console.log (sender + " sent: " + text)
        } else if (messageType === WhatsAppWeb.MessageType.extendedText) {
            const text =  m.message.extendedTextMessage.text
            console.log (sender + " sent: " + text + " and quoted message: " + JSON.stringify(m.message))
        } else if (messageType === WhatsAppWeb.MessageType.contact) {
            const contact = m.message.contactMessage
            console.log (sender + " sent contact (" + contact.displayName + "): " + contact.vcard)
        } else if (messageType === WhatsAppWeb.MessageType.location || messageType === WhatsAppWeb.MessageType.liveLocation) {
            const locMessage = m.message[messageType]
            console.log (sender + " sent location (lat: " + locMessage.degreesLatitude + ", long: " + locMessage.degreesLongitude + "), saving thumbnail...")
            client.decodeMediaMessage(m.message, "loc_thumb_in_" + m.key.id)

            if (messageType === WhatsAppWeb.MessageType.liveLocation) {
                console.log (sender + " sent live location for duration: " + m.duration/60 + " minutes, seq number: " + locMessage.sequenceNumber)
            }
        } else { // if it is a media (audio, image, video) message
            // decode, decrypt & save the media. 
            // The extension to the is applied automatically based on the media type
            client.decodeMediaMessage(m.message, "media_in_" + m.key.id)
            .then (meta => console.log(sender + " sent media, saved at: " + meta.filename))
            .catch (err => console.log("error in decoding message: " + err))
        }
        // send a reply after 3 seconds
        setTimeout (() => {
            client.sendReadReceipt (m.key.remoteJid, m.key.id) // send read receipt
            .then (() => client.updatePresence(m.key.remoteJid, WhatsAppWeb.Presence.available)) // tell them we're available
            .then (() => client.updatePresence(m.key.remoteJid, WhatsAppWeb.Presence.composing)) // tell them we're composing
            .then (() => { // send the message
                let options = {quoted: m}
                const rand = Math.random()
                if (rand > 0.66) { // choose at random
                    return client.sendTextMessage(m.key.remoteJid, "hello!", options) // send a "hello!" & quote the message recieved
                } else if (rand > 0.33) { // choose at random
                    return client.sendLocationMessage(m.key.remoteJid, 32.123123, 12.12123123) // send a random location lol
                } else {
                    const buffer = fs.readFileSync("example/ma_gif.mp4") // load the gif
                    options.gif = true // the video is a gif
                    options.caption = "hello!" // the caption
                    return client.sendMediaMessage (m.key.remoteJid, buffer, WhatsAppWeb.MessageType.video, options) // send this gif!
                }
            })
            .then (([m, q]) => { // check if it went successfully
                const success = m.status === 200
                const messageID = q[2][0][2].key.id
                console.log("sent message with ID '" + messageID + "' successfully: " + success)
            })
        }, 3*1000)
    }, true) // set to false to not relay your own sent messages
    /* custom functionality for tracking battery */
    client.registerCallback (["action", null, "battery"], json => {
        const batteryLevelStr = json[2][0][1].value
        const batterylevel = parseInt (batteryLevelStr)
        console.log ("battery level: " + batterylevel)
    })
    client.setOnUnexpectedDisconnect (err => console.log ("disconnected unexpectedly: " + err) )
})
.catch (err => console.log ("encountered error: " + err))