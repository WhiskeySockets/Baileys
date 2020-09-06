# Baileys - Typescript/Javascript WhatsApp Web API
 
 Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a **WebSocket**. Not running Selenium or Chromimum saves you like **half a gig** of ram :/ 

 Thank you to [@Sigalor](https://github.com/sigalor/whatsapp-web-reveng) for writing his observations on the workings of WhatsApp Web and thanks to [@Rhymen](https://github.com/Rhymen/go-whatsapp/) for the __go__ implementation.

 Baileys is type-safe, extensible and simple to use. If you require more functionality than provided, it'll super easy for you to write an extension. More on this [here](#WritingCustomFunctionality).
 
 If you're interested in building a WhatsApp bot, you may wanna check out [WhatsAppInfoBot](https://github.com/adiwajshing/WhatsappInfoBot) and an actual bot built with it, [Messcat](https://github.com/adiwajshing/Messcat).
 
 **Read the docs [here](https://adiwajshing.github.io/Baileys)**

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

Do note, the library will most likely vary if you're using the NPM package, read that [here](https://www.npmjs.com/package/@adiwajshing/baileys)

Then import in your code using:
``` ts 
import { WAConnection } from '@adiwajshing/baileys'
```

## Unit Tests
Baileys also comes with a unit test suite. Simply cd into the Baileys directory & run `npm test`.

You will require a phone with WhatsApp to test, and a second WhatsApp number to send messages to.
Set the phone number you can randomly send messages to in a `.env` file with `TEST_JID=1234@s.whatsapp.net` 

## Connecting
``` ts
import { WAConnection } from '@adiwajshing/baileys'

async function connectToWhatsApp () {
    const conn = new WAConnection() 
    
    await conn.connect ()
    console.log ("oh hello " + conn.user.name + " (" + conn.user.id + ")")
    // every chat object has a list of most recent messages
    console.log ("you have " + conn.chats.all().length + " chats")

    const unread = await conn.loadAllUnreadMessages ()
    console.log ("you have " + unread.length + " unread messages")
}
// run in main file
connectToWhatsApp ()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors
``` 

If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!

If you don't want to wait for WhatsApp to send all your chats while connecting, you can set the following property to false:
``` ts
conn.connectOptions.waitForChats = false
``` 

Do note, the `chats` object returned is now a [KeyedDB](https://github.com/adiwajshing/keyed-db). This is done for the following reasons:
- Most applications require chats to be ordered in descending order of time. (`KeyedDB` does this in `log(N)` time)
- Most applications require pagination of chats (Use `chats.paginated()`)
- Most applications require **O(1)** access to chats via the chat ID. (Use `chats.get(jid)` with `KeyedDB`)

## Connecting via an HTTPS proxy

``` ts
import { WAConnection, ProxyAgent } from '@adiwajshing/baileys'

const conn = new WAConnecion ()
conn.connectOptions.agent = ProxyAgent ('http://some-host:1234')

await conn.connect ()
console.log ("oh hello " + conn.user.name + "! You connected via a proxy")
```

## Saving & Restoring Sessions

You obviously don't want to keep scanning the QR code every time you want to connect. 

So, do the following every time you open a new connection:
``` ts
import * as fs from 'fs'

const conn = new WAConnection() 
await conn.connect() // connect first
const creds = conn.base64EncodedAuthInfo () // contains all the keys you need to restore a session
fs.writeFileSync('./auth_info.json', JSON.stringify(creds, null, '\t')) // save JSON to file
```

Then, to restore a session:
``` ts
const conn = new WAConnection() 
conn.loadAuthInfo ('./auth_info.json') // will load JSON credentials from file
await conn.connect() 
// yay connected without scanning QR
/*
    Optionally, you can load the credentials yourself from somewhere 
    & pass in the JSON object to loadAuthInfo () as well.
*/
```

If you're considering switching from a Chromium/Puppeteer based library, you can use WhatsApp Web's Browser credentials to restore sessions too:
``` ts
conn.loadAuthInfo ('./auth_info_browser.json') // use loaded credentials & timeout in 20s
await conn.connect() // works the same
```
See the browser credentials type in the docs.

## QR Callback

If you want to do some custom processing with the QR code used to authenticate, you can register for the following event:
``` ts
conn.on('qr', qr => {
    // Now, use the 'qr' string to display in QR UI or send somewhere
}
await conn.connect ()
```

The QR will auto-regenerate and will fire a new `qr` event after 30 seconds, if you don't want to regenerate or want to change the re-gen interval:
``` ts
conn.regenerateQRIntervalMs = null // no QR regen
conn.regenerateQRIntervalMs = 20000 // QR regen every 20 seconds
```

## Handling Events

Baileys now uses the EventEmitter syntax for events. 
They're all nicely typed up, so you shouldn't have any issues with an Intellisense editor like VS Code.

Also, these events are fired regardless of whether they are initiated by the Baileys client or are relayed from your phone.

``` ts
/** when the connection has opened successfully */
on (event: 'open', listener: (result: WAOpenResult) => void): this
/** when the connection is opening */
on (event: 'connecting', listener: () => void): this
/** when the connection has closed */
on (event: 'close', listener: (err: {reason?: DisconnectReason | string, isReconnecting: boolean}) => void): this
/** when a new QR is generated, ready for scanning */
on (event: 'qr', listener: (qr: string) => void): this
/** when the connection to the phone changes */
on (event: 'connection-phone-change', listener: (state: {connected: boolean}) => void): this
/** when a user's presence is updated */
on (event: 'user-presence-update', listener: (update: PresenceUpdate) => void): this
/** when a user's status is updated */
on (event: 'user-status-update', listener: (update: {jid: string, status?: string}) => void): this
/** when a new chat is added */
on (event: 'chat-new', listener: (chat: WAChat) => void): this
/** when a chat is updated (archived, deleted, pinned) */
on (event: 'chat-update', listener: (chat: Partial<WAChat> & { jid: string }) => void): this
/** when a new message is relayed */
on (event: 'message-new', listener: (message: WAMessage) => void): this
/** when a message object itself is updated (receives its media info or is deleted) */
on (event: 'message-update', listener: (message: WAMessage) => void): this
/** when a message's status is updated (deleted, delivered, read, sent etc.) */
on (event: 'message-status-update', listener: (message: WAMessageStatusUpdate) => void): this
/** when participants are added to a group */
on (event: 'group-participants-add', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
/** when participants are removed or leave from a group */
on (event: 'group-participants-remove', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
/** when participants are promoted in a group */
on (event: 'group-participants-promote', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
/** when participants are demoted in a group */
on (event: 'group-participants-demote', listener: (update: {jid: string, participants: string[], actor?: string}) => void): this
/** when the group settings is updated */
on (event: 'group-settings-update', listener: (update: {jid: string, restrict?: string, announce?: string, actor?: string}) => void): this
/** when the group description is updated */
on (event: 'group-description-update', listener: (update: {jid: string, description?: string, actor?: string}) => void): this
```

## Sending Messages

Send like, all types of messages with a single function:
``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'

const id = 'abcd@s.whatsapp.net' // the WhatsApp ID 
// send a simple text!
conn.sendMessage (id, 'oh hello there', MessageType.text)
// send a location!
conn.sendMessage(id, {degreesLatitude: 24.121231, degreesLongitude: 55.1121221}, MessageType.location)
// send a contact!
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Jeff Singh\n' // full name
            + 'ORG:Ashoka Uni;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
            + 'END:VCARD'
conn.sendMessage(id, {displayname: "Jeff", vcard: vcard}, MessageType.contact)
// send a gif
const buffer = fs.readFileSync("Media/ma_gif.mp4") // load some gif
const options: MessageOptions = {mimetype: Mimetype.gif, caption: "hello!"} // some metadata & caption
conn.sendMessage(id, buffer, MessageType.video, options)
// send an audio file
const buffer = fs.readFileSync("Media/audio.mp3") // can send mp3, mp4, & ogg -- but for mp3 files the mimetype must be set to ogg
const options: MessageOptions = {mimetype: Mimetype.ogg} // some metadata (can't have caption in audio)
conn.sendMessage(id, buffer, MessageType.audio, options)
```

To note:
- `id` is the WhatsApp ID of the person or group you're sending the message to. 
    - It must be in the format ```[country code][phone number]@s.whatsapp.net```, for example ```+19999999999@s.whatsapp.net``` for people. For groups, it must be in the format ``` 123456789-123345@g.us ```. 
- For media messages, the thumbnail can be generated automatically for images & stickers. Thumbnails for videos can also be generated automatically, though, you need to have `ffmpeg` installed on your system.
- **MessageOptions**: some extra info about the message. It can have the following __optional__ values:
    ``` ts
    const info: MessageOptions = {
        quoted: quotedMessage, // the message you want to quote
        contextInfo: { forwardingScore: 2, isForwarded: true }, // some random context info 
        // (can show a forwarded message with this too)
        timestamp: Date(), // optional, if you want to manually set the timestamp of the message
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
const messages = await conn.loadConversation ('1234@s.whatsapp.net', 1)
const message = messages[0] // get the last message from this conversation
await conn.forwardMessage ('455@s.whatsapp.net', message) // WA forward the message!
```

## Reading Messages

``` ts 
const id = '1234-123@g.us'
const messageID = 'AHASHH123123AHGA' // id of the message you want to read

await conn.chatRead (id) // mark all messages in chat as read (equivalent of opening a chat in WA)
await conn.chatRead (id, 'unread') // mark the chat as unread
```

The message ID is the unique identifier of the message that you are marking as read. On a `WAMessage`, the `messageID` can be accessed using ```messageID = message.key.id```.

## Update Presence

``` ts
import { Presence } from '@adiwajshing/baileys'
await conn.updatePresence(id, Presence.available) 

```
This lets the person/group with ``` id ``` know whether you're online, offline, typing etc. where ``` presence ``` can be one of the following:
``` ts
export enum Presence {
    available = 'available', // "online"
    composing = 'composing', // "typing..."
    recording = 'recording', // "recording..."
}
```

The presence expires after about 10 seconds.

## Downloading Media Messages

If you want to save the media you received
``` ts
import { MessageType } from '@adiwajshing/baileys'
conn.on ('message-new', async m => {
    if (!m.message) return // if there is no text or media message
    const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
    // if the message is not a text message
    if (messageType !== MessageType.text && messageType !== MessageType.extendedText) {
        const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
        
        const savedFilename = await conn.downloadAndSaveMediaMessage (m) // to decrypt & save to file
        console.log(m.key.remoteJid + " sent media, saved at: " + savedFilename)
    }
}
```

## Deleting Messages

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
const response = await conn.sendMessage (jid, 'hello!', MessageType.text) // send a message

await conn.deleteMessage (jid, {id: response.messageID, remoteJid: jid, fromMe: true}) // will delete the sent message for everyone!
await conn.clearMessage (jid, {id: response.messageID, remoteJid: jid, fromMe: true}) // will delete the sent message for only you!
```

## Modifying Chats

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
await conn.modifyChat (jid, ChatModification.archive) // archive chat
await conn.modifyChat (jid, ChatModification.unarchive) // unarchive chat

const response = await conn.modifyChat (jid, ChatModification.pin) // pin the chat
await conn.modifyChat (jid, ChatModification.unpin) // unpin it

await conn.modifyChat (jid, ChatModification.mute, 8*60*60*1000) // mute for 8 hours
setTimeout (() => {
    conn.modifyChat (jid, ChatModification.unmute)
}, 5000) // unmute after 5 seconds

await conn.deleteChat (jid) // will delete the chat (can be a group or broadcast list as well)
```

**Note:** to unmute or unpin a chat, one must pass the timestamp of the pinning or muting. This is returned by the pin & mute functions. This is also available in the `WAChat` objects of the respective chats, as a `mute` or `pin` property.

## Misc

- To load chats in a paginated manner
    ``` ts
    const {chats, cursor} = await conn.loadChats (25)
    if (cursor) {
        const moreChats = await conn.loadChats (25, cursor) // load the next 25 chats
    }
    ```
- To check if a given ID is on WhatsApp
    ``` ts
    const id = 'xyz@s.whatsapp.net'
    const exists = await conn.isOnWhatsApp (id)
    console.log (`${id} ${exists ? " exists " : " does not exist"} on WhatsApp`)
    ```
- To query chat history on a group or with someone
    ``` ts
    // query the last 25 messages (replace 25 with the number of messages you want to query)
    const messages = await conn.loadMessages ("xyz-abc@g.us", 25)
    console.log("got back " + messages.length + " messages")
    ```
    You can also load the entire conversation history if you want
    ``` ts
    await conn.loadAllMessages ("xyz@c.us", message => console.log("Loaded message with ID: " + message.key.id))
    console.log("queried all messages") // promise resolves once all messages are retreived
    ```
- To get the status of some person
    ``` ts
    const status = await conn.getStatus ("xyz@c.us") // leave empty to get your own status
    console.log("status: " + status)
    ```
- To get the display picture of some person/group
    ``` ts
    const ppUrl = await conn.getProfilePicture ("xyz@g.us") // leave empty to get your own
    console.log("download profile picture from: " + ppUrl)
    ```
- To change your display picture or a group's
    ``` ts
    const jid = '111234567890-1594482450@g.us' // can be your own too
    const img = fs.readFileSync ('new-profile-picture.jpeg') // can be PNG also
    await conn.updateProfilePicture (jid, img)
    ```
- To get someone's presence (if they're typing, online)
    ``` ts
    // the presence update is fetched and called here
    conn.on ('user-presence-update', json => console.log(json.id + " presence is " + json.type))
    await conn.requestPresenceUpdate ("xyz@c.us") // request the update
    ```
- To search through messages
    ``` ts
    const response = await conn.searchMessages ('so cool', null, 25, 1) // search in all chats
    console.log (`got ${response.messages.length} messages in search`)

    const response2 = await conn.searchMessages ('so cool', '1234@c.us', 25, 1) // search in given chat
    ```
Of course, replace ``` xyz ``` with an actual ID. 

## Groups
- To create a group
    ``` ts
    // title & participants
    const group = await conn.groupCreate ("My Fab Group", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    console.log ("created group with id: " + group.gid)
    conn.sendMessage(group.gid, "hello everyone", MessageType.extendedText) // say hello to everyone on the group
    ```
- To add people to a group
    ``` ts
    // id & people to add to the group (will throw error if it fails)
    const response = await conn.groupAdd ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    ```
- To make/demote admins on a group
    ``` ts
    // id & people to make admin (will throw error if it fails)
    await conn.groupMakeAdmin ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"])
    await conn.groupDemoteAdmin ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"]) // demote admins
    ```
- To change group settings
    ``` ts
    import { GroupSettingChange } from '@adiwajshing/baileys'
    // only allow admins to send messages
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.messageSend, true)
    // allow everyone to modify the group's settings -- like display picture etc.
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingChange, false)
    // only allow admins to modify the group's settings
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingChange, true)
    ```
- To leave a group
    ``` ts
    await conn.groupLeave ("abcd-xyz@g.us") // (will throw error if it fails)
    ```
- To get the invite code for a group
    ``` ts
    const code = await conn.groupInviteCode ("abcd-xyz@g.us")
    console.log("group code: " + code)
    ```
- To query the metadata of a group
    ``` ts
    const metadata = await conn.groupMetadata ("abcd-xyz@g.us") 
    console.log(json.id + ", title: " + json.subject + ", description: " + json.desc)

    // Or if you've left the group -- call this
    const metadata2 = await conn.groupMetadataMinimal ("abcd-xyz@g.us") 
    ```

## Broadcast Lists & Stories

- You can send messages to broadcast lists the same way you send messages to groups & individual chats.
- Unfortunately, WA Web does not support creating broadcast lists right now but you can still delete them.
- Broadcast IDs are in the format `12345678@broadcast`
- To query a broadcast list's recipients & name:
    ``` ts
    const bList = await conn.getBroadcastListInfo ("1234@broadcast")
    console.log (`list name: ${bList.name}, recps: ${bList.recipients}`)
    ```

## Writing Custom Functionality
Baileys is written, keeping in mind, that you may require other custom functionality. Hence, instead of having to fork the project & re-write the internals, you can simply write extensions in your own code.

First, enable the logging of unhandled messages from WhatsApp by setting
``` ts
conn.logLevel = MessageLogLevel.unhandled // set to MessageLogLevel.all to see all messages received
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
    conn.registerCallback (["action", null, "battery"], json => {
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
    conn.registerCallback (["Conn", "pushname"], json => {
        const pushname = json[1].pushname
        conn.user.name = pushname // update on client too
        console.log ("Name updated: " + pushname)
    })
    ```
    This callback will be fired any time a message is received matching the following criteria:
    ``` message [0] === "Conn" && message [1].pushname ```

A little more testing will reveal that almost all WhatsApp messages are in the format illustrated above. 
Note: except for the first parameter (in the above cases, ```"action"``` or ```"Conn"```), all the other parameters are optional.

### Note
 This library was originally a project for **CS-2362 at Ashoka University** and is in no way affiliated with WhatsApp. Use at your own discretion. Do not spam people with this.
