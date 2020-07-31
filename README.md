# Baileys - Typescript/Javascript WhatsApp Web API
 
 Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a **WebSocket**. Not running Selenium or Chromimum saves you like **half a gig** of ram :/ 

 Thank you to [@Sigalor](https://github.com/sigalor/whatsapp-web-reveng) for writing the guide to reverse engineering WhatsApp Web and thanks to [@Rhymen](https://github.com/Rhymen/go-whatsapp/) for the __go__ implementation.

 Baileys is type-safe, extensible and simple to use. If you require more functionality than provided, it'll super easy for you to write an extension. More on this [here](#WritingCustomFunctionality).
 
 If you're interested in building a WhatsApp bot, you may wanna check out [WhatsAppInfoBot](https://github.com/adiwajshing/WhatsappInfoBot) and an actual bot built with it, [Messcat](https://github.com/adiwajshing/Messcat).

## Example
Do check out & run [example.ts](Example/example.ts) to see example usage of the library.
The script covers most common use cases.
To run the example script, download or clone the repo and then type the following in terminal:
1. ``` cd path/to/Baileys ```
2. ``` npm install ```
3. ``` npm run example ```

## Install
Create and cd to your NPM project directory and then in terminal, write: 
1. stable: `npm install @adiwajshing/baileys`
2. stabl-ish w quicker fixes & latest features: `npm install github:adiwajshing/baileys`

Then import in your code using:
``` ts 
import { WAClient } from '@adiwajshing/baileys'
```

## Unit Tests
Baileys also comes with a unit test suite. Simply cd into the Baileys directory & run `npm test`.

You will require a phone with WhatsApp to test, and a second WhatsApp number to send messages to.
Set the phone number you can randomly send messages to in a `.env` file with `TEST_JID=1234@s.whatsapp.net` 

## Connecting
``` ts
import { WAClient } from '@adiwajshing/baileys'

async function connectToWhatsApp () {
    const client = new WAClient() 
    const [user, chats, contacts] = await client.connect ()
    console.log ("oh hello " + user.name + " (" + user.id + ")")
    console.log ("you have " + chats.length + " chats")

    // every chat object has a list of most recent messages
    // can use that to retreive all your pending unread messages
    // the 'count' property a chat object reflects the number of unread messages 
    // the 'count' property is -1 if the entire thread has been marked unread
    const unread = chats.all().flatMap (chat => chat.messages.slice(chat.messages.length-chat.count))

    console.log ("you have " + unread.length + " unread messages")
}

// run in main file
connectToWhatsApp ()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors
``` 

If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!
If you don't want to wait for WhatsApp to send all your chats while connecting, you can use the following function:
``` ts
import { WAClient } from '@adiwajshing/baileys'

async function connectToWhatsApp () {
    const client = new WAClient() 
    const user = await client.connectSlim ()
    console.log ("oh hello " + user.name + " (" + user.id + ")")

    client.receiveChatsAndContacts () // wait for chats & contacts in the background
    .then (([chats, contacts]) => {
        console.log ("you have " + chats.all().length + " chats and " + contacts.length + " contacts")
    })
}
// run in main file
connectToWhatsApp ()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors
``` 

Do note, the `chats` object returned is now a [KeyedDB](https://github.com/adiwajshing/keyed-db). This is done for the following reasons:
- Most applications require chats to be ordered in descending order of time. (`KeyedDB` does this in `log(N)` time)
- Most applications require pagination of chats (Use `chats.paginated()`)
- Most applications require **O(1)** access to chats via the chat ID. (Use `chats.get(jid)` with `KeyedDB`)

## Saving & Restoring Sessions

You obviously don't want to keep scanning the QR code every time you want to connect. 

So, do the following the first time you connect:
``` ts
import * as fs from 'fs'

const client = new WAClient() 
client.connectSlim() // connect first
.then (user => {
    const creds = client.base64EncodedAuthInfo () // contains all the keys you need to restore a session
    fs.writeFileSync('./auth_info.json', JSON.stringify(creds, null, '\t')) // save JSON to file
})
```

Then, to restore a session:
``` ts
const client = new WAClient() 
client.connectSlim('./auth_info.json') // will load JSON credentials from file
.then (user => {
    // yay connected without scanning QR
})

/*
    Optionally, you can load the credentials yourself from somewhere 
    & pass in the JSON object to connectSlim () as well.
*/
```

If you're considering switching from a Chromium/Puppeteer based library, you can use WhatsApp Web's Browser credentials to restore sessions too:
``` ts
client.loadAuthInfoFromBrowser ('./auth_info_browser.json')
client.connectSlim(null, 20*1000) // use loaded credentials & timeout in 20s
.then (user => {
    // yay! connected using browser keys & without scanning QR
})
```
See the browser credentials type [here](/src/WAConnection/Constants.ts).

## QR Overriding

If you want to do some custom processing with the QR code used to authenticate, you can override the following method:
``` ts
client.onReadyForPhoneAuthentication = ([ref, publicKey, clientID]) => {
    const str = ref + ',' + publicKey + ',' + clientID // the QR string
    // Now, use 'str' to display in QR UI or send somewhere
}
const user = await client.connect ()
```

If you need to regenerate the QR, you can also do so using:
``` ts
let generateQR: async () => void // call generateQR on some timeout or error
client.onReadyForPhoneAuthentication = ([ref, publicKey, clientID]) => {
    generateQR = async () => {
        ref = await client.generateNewQRCode () // returns a new ref code to use for QR generation
        const str = ref + ',' + publicKey + ',' + clientID // the QR string
        // re-print str as QR or update in UI or send somewhere
        //QR.generate(str, { small: true })
    }
}
const user = await client.connect ()
```
## Handling Events

Implement the following callbacks in your code:

- Called when you have a pending unread message or recieve a new message
    ``` ts 
    import { getNotificationType } from '@adiwajshing/baileys'
    // set first param to `true` if you want to receive outgoing messages that may be sent from your phone
    client.setOnUnreadMessage (false, (m: WAMessage) => {
        // get what type of notification it is -- message, group add notification etc.
        const [notificationType, messageType] = getNotificationType(m)

        console.log("got notification of type: " + notificationType) // message, groupAdd, groupLeave
        console.log("message type: " + messageType) // conversation, imageMessage, videoMessage, contactMessage etc.
    })
    ```
- Called when you recieve an update on someone's presence, they went offline or online
    ``` ts 
    client.setOnPresenceUpdate ((json: PresenceUpdate) => console.log(json.id + " presence is " + json.type))
    ```
- Called when your message gets delivered or read
    ``` ts 
    client.setOnMessageStatusChange ((json: MessageStatusUpdate) => {
        let sent = json.to
        if (json.participant) // participant exists when the message is from a group
            sent += " ("+json.participant+")" // mention as the one sent to
        // log that they acknowledged the message
        console.log(sent + " acknowledged message(s) " + json.ids + " as " + json.type + " at " + json.timestamp)
    })
    ```
- Called when the connection gets disconnected (either the server loses internet, the phone gets unpaired, or the connection is taken over from somewhere)
    ``` ts 
    client.setOnUnexpectedDisconnect (reason => console.log ("disconnected unexpectedly: " + reason) )
    ```
## Sending Messages

Send like, all types of messages with a single function:
``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'

const id = 'abcd@s.whatsapp.net' // the WhatsApp ID 
// send a simple text!
client.sendMessage (id, 'oh hello there', MessageType.text)
// send a location!
client.sendMessage(id, {degreeslatitude: 24.121231, degreesLongitude: 55.1121221}, MessageType.location)
// send a contact!
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Jeff Singh\n' // full name
            + 'ORG:Ashoka Uni;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
            + 'END:VCARD'
client.sendMessage(id, {displayname: "Jeff", vcard: vcard}, MessageType.contact)
// send a gif
const buffer = fs.readFileSync("Media/ma_gif.mp4") // load some gif
const options: MessageOptions = {mimetype: Mimetype.gif, caption: "hello!"} // some metadata & caption
client.sendMessage(id, buffer, MessageType.video, options)
```
To note:
- `id` is the WhatsApp ID of the person or group you're sending the message to. 
    - It must be in the format ```[country code][phone number]@s.whatsapp.net```, for example ```+19999999999@s.whatsapp.net``` for people. For groups, it must be in the format ``` 123456789-123345@g.us ```. 
    - **Do not attach** `@c.us` for individual people IDs, It won't work.
    - Please do not explicitly disable ID validation (in `MessageOptions`) because then your messages may fail for no apparent reason.
- For media messages, the thumbnail can be generated automatically for images & stickers. Thumbnails for videos can also be generated automatically, though, you need to have `ffmpeg` installed on your system.
- **MessageOptions**: some extra info about the message. It can have the following __optional__ values:
    ``` ts
    const info: MessageOptions = {
        quoted: quotedMessage, // the message you want to quote
        contextInfo: { forwardingScore: 2, isForwarded: true }, // some random context info 
        // (can show a forwarded message with this too)
        timestamp: Date(), // optional, if you want to manually set the timestamp of the message
        validateID: true, // if you want to validate the ID before sending the message, true by default
        caption: "hello there!", // (for media messages) the caption to send with the media (cannot be sent with stickers though)
        thumbnail: "23GD#4/==", /*  (for location & media messages) has to be a base 64 encoded JPEG if you want to send a custom thumb, 
                                    or set to null if you don't want to send a thumbnail.
                                    Do not enter this field if you want to automatically generate a thumb
                                */
        mimetype: Mimetype.pdf, /* (for media messages) specify the type of media (optional for all media types except documents),
                                        import {Mimetype} from '@adiwajshing/baileys'
                                */
        filename: 'somefile.pdf' // (for media messages) file name for the media
    }
    ```
## Forwarding Messages

``` ts
const messages = await client.loadConversation ('1234@s.whatsapp.net', 1)
const message = messages[0] // get the last message from this conversation
await client.forwardMessage ('455@s.whatsapp.net', message) // WA forward the message!
```

## Reading Messages
``` ts 
const id = '1234-123@g.us'
const messageID = 'AHASHH123123AHGA' // id of the message you want to read

await client.sendReadReceipt(id, messageID) // mark as read
await client.sendReadReceipt (id) // mark all messages in chat as read

await client.sendReadReceipt(id, null, 'unread') // mark the chat as unread
```

- `id` is in the same format as mentioned earlier. 
- The message ID is the unique identifier of the message that you are marking as read. 
- On a `WAMessage`, the `messageID` can be accessed using ```messageID = message.key.id```.

## Update Presence

``` ts
import { Presence } from '@adiwajshing/baileys'

client.updatePresence(id, Presence.available) 
```
This lets the person/group with ``` id ``` know whether you're online, offline, typing etc. where ``` presence ``` can be one of the following:
``` ts
export enum Presence {
    available = 'available', // "online"
    unavailable = 'unavailable', // "offline"
    composing = 'composing', // "typing..."
    recording = 'recording', // "recording..."
    paused = 'paused', // I have no clue
}
```

## Downloading Media
If you want to save the media you received
``` ts
import { MessageType, extensionForMediaMessage } from '@adiwajshing/baileys'
client.setOnUnreadMessage (false, async m => {
    if (!m.message) return // if there is no text or media message

    const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
    // if the message is not a text message
    if (messageType !== MessageType.text && messageType !== MessageType.extendedText) {
        const buffer = await client.downloadMediaMessage(m) // to decrypt & use as a buffer
        
        const savedFilename = await client.downloadAndSaveMediaMessage (m) // to decrypt & save to file
        console.log(m.key.remoteJid + " sent media, saved at: " + savedFilename)
    }
}
```

## Deleting Messages

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
const response = await client.sendMessage (jid, 'hello!', MessageType.text) // send a message

await client.deleteMessage (jid, {id: response.messageID, remoteJid: jid, fromMe: true}) // will delete the sent message for everyone!
await client.clearMessage (jid, {id: response.messageID, remoteJid: jid, fromMe: true}) // will delete the sent message for only you!
```

## Modifying Chats

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
await client.modifyChat (jid, ChatModification.archive) // archive chat
await client.modifyChat (jid, ChatModification.unarchive) // unarchive chat

const response = await client.modifyChat (jid, ChatModification.pin) // pin the chat
await client.modifyChat (jid, ChatModification.unpin, {stamp: response.stamp})

const mutedate = new Date (new Date().getTime() + 8*60*60*1000) // mute for 8 hours in the future
await client.modifyChat (jid, ChatModification.mute, {stamp: mutedate}) // mute
setTimeout (() => {
    client.modifyChat (jid, ChatModification.unmute, {stamp: mutedate})
}, 5000) // unmute after 5 seconds

await client.deleteChat (jid) // will delete the chat (can be a group or broadcast list)
```

**Note:** to unmute or unpin a chat, one must pass the timestamp of the pinning or muting. This is returned by the pin & mute functions. This is also available in the `WAChat` objects of the respective chats, as a `mute` or `pin` property.

## Misc

- To check if a given ID is on WhatsApp
    ``` ts
    const id = 'xyz@s.whatsapp.net'
    const exists = await client.isOnWhatsApp (id)
    console.log (`${id} ${exists ? " exists " : " does not exist"} on WhatsApp`)
    ```
- To query chat history on a group or with someone
    ``` ts
    // query the last 25 messages (replace 25 with the number of messages you want to query)
    const messages = await client.loadConversation ("xyz-abc@g.us", 25)
    console.log("got back " + messages.length + " messages")
    ```
    You can also load the entire conversation history if you want
    ``` ts
    await client.loadEntireConversation ("xyz@c.us", message => console.log("Loaded message with ID: " + message.key.id))
    console.log("queried all messages") // promise resolves once all messages are retreived
    ```
- To get the status of some person
    ``` ts
    const status = await client.getStatus ("xyz@c.us") // leave empty to get your own status
    console.log("status: " + status)
    ```
- To get the display picture of some person/group
    ``` ts
    const ppUrl = await client.getProfilePicture ("xyz@g.us") // leave empty to get your own
    console.log("download profile picture from: " + ppUrl)
    ```
- To change your display picture or a group's
    ``` ts
    const jid = '111234567890-1594482450@g.us' // can be your own too
    const img = fs.readFileSync ('new-profile-picture.jpeg') // can be PNG also
    await client.updateProfilePicture (jid, newPP)
    ```
- To get someone's presence (if they're typing, online)
    ``` ts
    // the presence update is fetched and called here
    client.setOnPresenceUpdate (json => console.log(json.id + " presence is " + json.type))
    await client.requestPresenceUpdate ("xyz@c.us") // request the update
    ```
- To search through messages
    ``` ts
    const response = await client.searchMessages ('so cool', null, 25, 1) // search in all chats
    console.log (`got ${response.messages.length} messages in search`)

    const response2 = await client.searchMessages ('so cool', '1234@c.us', 25, 1) // search in given chat
    ```
Of course, replace ``` xyz ``` with an actual ID. 
Append ``` @s.whatsapp.net ``` for individuals & ``` @g.us ``` for groups.

## Groups
- To create a group
    ``` ts
    // title & participants
    const group = await client.groupCreate ("My Fab Group", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    console.log ("created group with id: " + group.gid)
    client.sendTextMessage(group.gid, "hello everyone") // say hello to everyone on the group
    ```
- To add people to a group
    ``` ts
    // id & people to add to the group (will throw error if it fails)
    const response = await client.groupAdd ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    ```
- To make/demote admins on a group
    ``` ts
    // id & people to make admin (will throw error if it fails)
    await client.groupMakeAdmin ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    await client.groupDemoteAdmin ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"]) // demote admins
    ```
- To change group settings
    ``` ts
    import { GroupSettingChange } from '@adiwajshing/baileys'
    // only allow admins to send messages
    await client.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.messageSend, true)
    // allow everyone to modify the group's settings -- like display picture etc.
    await client.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingChange, false)
    // only allow admins to modify the group's settings
    await client.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingChange, true)
    ```
- To leave a group
    ``` ts
    await client.groupLeave ("abcd-xyz@g.us") // (will throw error if it fails)
    ```
- To get the invite code for a group
    ``` ts
    const code = await client.groupInviteCode ("abcd-xyz@g.us")
    console.log("group code: " + code)
    ```
- To query the metadata of a group
    ``` ts
    const metadata = await client.groupMetadata ("abcd-xyz@g.us") 
    console.log(json.id + ", title: " + json.subject + ", description: " + json.desc)

    // Or if you've left the group -- call this
    const metadata2 = await client.groupMetadataMinimal ("abcd-xyz@g.us") 
    ```

## Broadcast Lists & Stories

- You can send messages to broadcast lists the same way you send messages to groups & individual chats.
- Unfortunately, WA Web does not support creating broadcast lists right now but you can still delete them.
- Broadcast IDs are in the format `12345678@broadcast`
- To query a broadcast list's recipients & name:
    ``` ts
    const bList = await client.getBroadcastListInfo ("1234@broadcast")
    console.log (`list name: ${bList.name}, recps: ${bList.recipients}`)
    ```

## Writing Custom Functionality
Baileys is written, keeping in mind, that you may require other custom functionality. Hence, instead of having to fork the project & re-write the internals, you can simply write extensions in your own code.

First, enable the logging of unhandled messages from WhatsApp by setting
``` ts
client.logLevel = MessageLogLevel.unhandled // set to MessageLogLevel.all to see all messages received
```
This will enable you to see all sorts of messages WhatsApp sends in the console. Some examples:

1. Functionality to track of the battery percentage of your phone.
    You enable logging and you'll see a message about your battery pop up in the console: 
    ``` [Baileys] [Unhandled] s22, ["action",null,[["battery",{"live":"false","value":"52"},null]]] ``` 
    
    You now know what a battery update looks like. It'll have the following characteristics.
    - Given ```const bMessage = ["action",null,[["battery",{"live":"false","value":"52"},null]]]```
    - ```bMessage[0]``` is always ``` "action" ```
    - ```bMessage[1]``` is always ``` null ```
    - ```bMessage[2][0][0]``` is always ``` "battery" ```

    Hence, you can register a callback for an event using the following:
    ``` ts
    client.registerCallback (["action", null, "battery"], json => {
        const batteryLevelStr = json[2][0][1].value
        const batterylevel = parseInt (batteryLevelStr)
        console.log ("battery level: " + batterylevel + "%")
    })
    ```
    This callback will be fired any time a message is received matching the following criteria:
    ``` message [0] === "action" && message [1] === null && message[2][0][0] === "battery" ```
2. Functionality to keep track of the pushname changes on your phone.
    You enable logging and you'll see an unhandled message about your pushanme pop up like this: 
    ```[Baileys] [Unhandled] s24, ["Conn",{"pushname":"adiwajshing"}]``` 
    
    You now know what a pushname update looks like. It'll have the following characteristics.
    - Given ```const pMessage = ["Conn",{"pushname":"adiwajshing"}] ```
    - ```pMessage[0]``` is always ``` "Conn" ```
    - ```pMessage[1]``` always has the key ``` "pushname" ```
    - ```pMessage[2]``` is always ``` undefined ```

    Following this, one can implement the following callback:
    ``` ts
    client.registerCallback (["Conn", "pushname"], json => {
        const pushname = json[1].pushname
        client.userMetaData.name = pushname // update on client too
        console.log ("Name updated: " + pushname)
    })
    ```
    This callback will be fired any time a message is received matching the following criteria:
    ``` message [0] === "Conn" && message [1].pushname ```

A little more testing will reveal that almost all WhatsApp messages are in the format illustrated above. 
Note: except for the first parameter (in the above cases, ```"action"``` or ```"Conn"```), all the other parameters are optional.

### Note
 This library is in no way affiliated with WhatsApp. Use at your own discretion. Do not spam people with this.
