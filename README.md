# Baileys - Typescript/Javascript WhatsApp Web API
 
 Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a **WebSocket**. Not running Selenium or Chromimum saves you like **half a gig** of ram :/ 

 Thank you to [@Sigalor](https://github.com/sigalor/whatsapp-web-reveng) for writing his observations on the workings of WhatsApp Web and thanks to [@Rhymen](https://github.com/Rhymen/go-whatsapp/) for the __go__ implementation.

 Baileys is type-safe, extensible and simple to use. If you require more functionality than provided, it'll super easy for you to write an extension. More on this [here](#writing-custom-functionality).
 
 If you're interested in building a WhatsApp bot, you may wanna check out [WhatsAppInfoBot](https://github.com/adiwajshing/WhatsappInfoBot) and an actual bot built with it, [Messcat](https://github.com/ashokatechmin/Messcat).
 
 **Read the docs [here](https://adiwajshing.github.io/Baileys)**
 **Join the Discord [here](https://discord.gg/7FYURJyqng)**

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

Do note, the library will likely vary if you're using the NPM package, read that [here](https://www.npmjs.com/package/@adiwajshing/baileys)

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
    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of chats!
    conn.on('chats-received', async ({ hasNewChats }) => {
        console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

        const unread = await conn.loadAllUnreadMessages ()
        console.log ("you have " + unread.length + " unread messages")
    })
    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of contacts!
    conn.on('contacts-received', () => {
        console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
    })

    await conn.connect ()
    conn.on('chat-update', chatUpdate => {
        // `chatUpdate` is a partial object, containing the updated properties of the chat
        // received a new message
        if (chatUpdate.messages && chatUpdate.count) {
            const message = chatUpdate.messages.all()[0]
            console.log (message)
        } else console.log (chatUpdate) // see updates (can be archived, pinned etc.)
    })
}
// run in main file
connectToWhatsApp ()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors
``` 

If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!

Do note, the `conn.chats` object is a [KeyedDB](https://github.com/adiwajshing/keyed-db). This is done for the following reasons:
- Most applications require chats to be ordered in descending order of time. (`KeyedDB` does this in `log(N)` time)
- Most applications require pagination of chats (Use `chats.paginated()`)
- Most applications require **O(1)** access to chats via the chat ID. (Use `chats.get(jid)` with `KeyedDB`)

## Configuring the Connection

You can configure the connection via the `connectOptions` property. You can even specify an HTTPS proxy. For example:

``` ts
import { WAConnection, ProxyAgent } from '@adiwajshing/baileys'

const conn = new WAConnecion ()
conn.connectOptions.agent = ProxyAgent ('http://some-host:1234')

await conn.connect ()
console.log ("oh hello " + conn.user.name + "! You connected via a proxy")
```

The entire `WAConnectOptions` struct is mentioned here with default values:
``` ts
conn.connectOptions = {
    /** fails the connection if no data is received for X seconds */
    maxIdleTimeMs?: 60_000,
    /** maximum attempts to connect */
    maxRetries?: 10,
    /** max time for the phone to respond to a connectivity test */
    phoneResponseTime?: 15_000,
    /** minimum time between new connections */
    connectCooldownMs?: 4000,
    /** agent used for WS connections (could be a proxy agent) */
    agent?: Agent = undefined,
    /** agent used for fetch requests -- uploading/downloading media */
    fetchAgent?: Agent = undefined,
    /** always uses takeover for connecting */
    alwaysUseTakeover: true
	/** log QR to terminal */
    logQR: true
} as WAConnectOptions
```

## Saving & Restoring Sessions

You obviously don't want to keep scanning the QR code every time you want to connect. 

So, you can save the credentials to log back in via:
``` ts
import * as fs from 'fs'

const conn = new WAConnection() 
// this will be called as soon as the credentials are updated
conn.on ('open', () => {
    // save credentials whenever updated
    console.log (`credentials updated!`)
    const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
})
await conn.connect() // connect
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
conn.loadAuthInfo ('./auth_info_browser.json')
await conn.connect() // works the same
```
See the browser credentials type in the docs.

**Note**: Upon every successive connection, WA can update part of the stored credentials. Whenever that happens, the credentials are uploaded, and you should probably update your saved credentials upon receiving the `open` event. Not doing so *may* lead WA to log you out after a few weeks with a 419 error code.

## QR Callback

If you want to do some custom processing with the QR code used to authenticate, you can register for the following event:
``` ts
conn.on('qr', qr => {
    // Now, use the 'qr' string to display in QR UI or send somewhere
}
await conn.connect ()
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
/** when the socket is closed */
on (event: 'ws-close', listener: (err: {reason?: DisconnectReason | string}) => void): this
/** when a new QR is generated, ready for scanning */
on (event: 'qr', listener: (qr: string) => void): this
/** when the connection to the phone changes */
on (event: 'connection-phone-change', listener: (state: {connected: boolean}) => void): this
/** when a contact is updated */
on (event: 'contact-update', listener: (update: WAContactUpdate) => void): this
/** when a new chat is added */
on (event: 'chat-new', listener: (chat: WAChat) => void): this
/** when contacts are sent by WA */
on (event: 'contacts-received', listener: (u: { updatedContacts: Partial<WAContact>[] }) => void): this
/** when chats are sent by WA, and when all messages are received */
on (event: 'chats-received', listener: (update: {hasNewChats?: boolean}) => void): this
/** when all initial messages are received from WA */
on (event: 'initial-data-received', listener: (update: {chatsWithMissingMessages: { jid: string, count: number }[] }) => void): this
/** when multiple chats are updated (new message, updated message, deleted, pinned, etc) */
on (event: 'chats-update', listener: (chats: WAChatUpdate[]) => void): this
/** when a chat is updated (new message, updated message, read message, deleted, pinned, presence updated etc) */
on (event: 'chat-update', listener: (chat: WAChatUpdate) => void): this
/** when participants are added to a group */
on (event: 'group-participants-update', listener: (update: {jid: string, participants: string[], actor?: string, action: WAParticipantAction}) => void): this
/** when the group is updated */
on (event: 'group-update', listener: (update: Partial<WAGroupMetadata> & {jid: string, actor?: string}) => void): this
/** when WA sends back a pong */
on (event: 'received-pong', listener: () => void): this
/** when a user is blocked or unblockd */
on (event: 'blocklist-update', listener: (update: BlocklistUpdate) => void): this
```

## Sending Messages

**Send all types of messages with a single function:**

### Non-Media Messages

``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'

const id = 'abcd@s.whatsapp.net' // the WhatsApp ID 
// send a simple text!
const sentMsg  = await conn.sendMessage (id, 'oh hello there', MessageType.text)
// send a location!
const sentMsg  = await conn.sendMessage(id, {degreesLatitude: 24.121231, degreesLongitude: 55.1121221}, MessageType.location)
// send a contact!
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Jeff Singh\n' // full name
            + 'ORG:Ashoka Uni;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
            + 'END:VCARD'
const sentMsg  = await conn.sendMessage(id, {displayname: "Jeff", vcard: vcard}, MessageType.contact)
// send a list message!
const rows = [
 {title: 'Row 1', description: "Hello it's description 1", rowId:"rowid1"},
 {title: 'Row 2', description: "Hello it's description 2", rowId:"rowid2"}
]

const sections = [{title: "Section 1", rows: rows}]

const button = {
 buttonText: 'Click Me!',
 description: "Hello it's list message",
 sections: sections,
 listType: 1
}

const sendMsg = await conn.sendMessage(id, button, MessageType.listMessage)

// send a buttons message!
const buttons = [
  {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
  {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1}
]

const buttonMessage = {
    contentText: "Hi it's button message",
    footerText: 'Hello World',
    buttons: buttons,
    headerType: 1
}

const sendMsg = await conn.sendMessage(id, buttonMessage, MessageType.buttonsMessage)
```

### Media Messages

Sending media (video, stickers, images) is easier & more efficient than ever. 
- You can specify a buffer, a local url or even a remote url.
- When specifying a media url, Baileys never loads the entire buffer into memory, it even encrypts the media as a readable stream.

``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'
// Sending gifs
await conn.sendMessage(
    id, 
    fs.readFileSync("Media/ma_gif.mp4"), // load a gif and send it
    MessageType.video, 
    { mimetype: Mimetype.gif, caption: "hello!" }
)
await conn.sendMessage(
    id, 
    { url: 'Media/ma_gif.mp4' }, // send directly from local file
    MessageType.video, 
    { mimetype: Mimetype.gif, caption: "hello!" }
)

await conn.sendMessage(
    id, 
    { url: 'https://giphy.com/gifs/11JTxkrmq4bGE0/html5' }, // send directly from remote url!
    MessageType.video, 
    { mimetype: Mimetype.gif, caption: "hello!" }
)

// send an audio file
await conn.sendMessage(
    id, 
    { url: "Media/audio.mp3" }, // can send mp3, mp4, & ogg
    MessageType.audio, 
    { mimetype: Mimetype.mp4Audio } // some metadata (can't have caption in audio)
)
```


### Notes

- `id` is the WhatsApp ID of the person or group you're sending the message to. 
    - It must be in the format ```[country code without +][phone number]@s.whatsapp.net```, for example ```19999999999@s.whatsapp.net``` for people. For groups, it must be in the format ``` 123456789-123345@g.us ```. 
    - For broadcast lists it's `[timestamp of creation]@broadcast`.
    - For stories, the ID is `status@broadcast`.
- For media messages, the thumbnail can be generated automatically for images & stickers. Thumbnails for videos can also be generated automatically, though, you need to have `ffmpeg` installed on your system.
- **MessageOptions**: some extra info about the message. It can have the following __optional__ values:
    ``` ts
    const info: MessageOptions = {
        quoted: quotedMessage, // the message you want to quote
        contextInfo: { forwardingScore: 2, isForwarded: true }, // some random context info (can show a forwarded message with this too)
        timestamp: Date(), // optional, if you want to manually set the timestamp of the message
        caption: "hello there!", // (for media messages) the caption to send with the media (cannot be sent with stickers though)
        thumbnail: "23GD#4/==", /*  (for location & media messages) has to be a base 64 encoded JPEG if you want to send a custom thumb, 
                                    or set to null if you don't want to send a thumbnail.
                                    Do not enter this field if you want to automatically generate a thumb
                                */
        mimetype: Mimetype.pdf, /* (for media messages) specify the type of media (optional for all media types except documents),
                                    import {Mimetype} from '@adiwajshing/baileys'
                                */
        filename: 'somefile.pdf', // (for media messages) file name for the media
        /* will send audio messages as voice notes, if set to true */
        ptt: true,
        // will detect links & generate a link preview automatically (default true)
        detectLinks: true,
        /** Should it send as a disappearing messages. 
         * By default 'chat' -- which follows the setting of the chat */
        sendEphemeral: 'chat'
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
    paused = 'paused' // stopped typing, back to "online"
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

await conn.modifyChat (jid, ChatModification.delete) // will delete the chat (can be a group or broadcast list as well)
```

**Note:** to unmute or unpin a chat, one must pass the timestamp of the pinning or muting. This is returned by the pin & mute functions. This is also available in the `WAChat` objects of the respective chats, as a `mute` or `pin` property.

## Disappearing Messages

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
// turn on disappearing messages
await conn.toggleDisappearingMessages(
    jid, 
    WA_DEFAULT_EPHEMERAL // this is 1 week in seconds -- how long you want messages to appear for
) 
// will automatically send as a disappearing message
await conn.sendMessage(jid, 'Hello poof!', MessageType.text)
// turn off disappearing messages
await conn.toggleDisappearingMessages(jid, 0)

```

## Misc

- To load chats in a paginated manner
    ``` ts
    const {chats, cursor} = await conn.loadChats (25)
    if (cursor) {
        const moreChats = await conn.loadChats (25, cursor) // load the next 25 chats
    }
    ```
- To check if a given ID is on WhatsApp
    Note: this method falls back to using `https://wa.me` to determine whether a number is on WhatsApp in case the WebSocket connection is not open yet.
    ``` ts
    const id = '123456'
    const exists = await conn.isOnWhatsApp (id)
    if (exists) console.log (`${id} exists on WhatsApp, as jid: ${exists.jid}`)
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
    console.log("queried all messages") // promise resolves once all messages are retrieved
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
    conn.on ('CB:Presence', json => console.log(json.id + " presence is " + json.type))
    await conn.requestPresenceUpdate ("xyz@c.us") // request the update
    ```
- To search through messages
    ``` ts
    const response = await conn.searchMessages ('so cool', null, 25, 1) // search in all chats
    console.log (`got ${response.messages.length} messages in search`)

    const response2 = await conn.searchMessages ('so cool', '1234@c.us', 25, 1) // search in given chat
    ```
- To block or unblock user
    ``` ts
    await conn.blockUser ("xyz@c.us", "add") // Block user
    await conn.blockUser ("xyz@c.us", "remove") // Unblock user
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
- To change the group's subject
    ``` ts
    await conn.groupUpdateSubject("abcd-xyz@g.us", "New Subject!")
    ```
- To change the group's description
    ``` ts
    await conn.groupUpdateDescription("abcd-xyz@g.us", "This group has a new description")
    ```
- To change group settings
    ``` ts
    import { GroupSettingChange } from '@adiwajshing/baileys'
    // only allow admins to send messages
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.messageSend, true)
    // allow everyone to modify the group's settings -- like display picture etc.
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingsChange, false)
    // only allow admins to modify the group's settings
    await conn.groupSettingChange ("abcd-xyz@g.us", GroupSettingChange.settingsChange, true)
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
- To join the group using the invitation code
    ``` ts
    const response = await conn.acceptInvite ("xxx")
    console.log("joined to: " + response.gid)
    ```
    Of course, replace ``` xxx ``` with invitation code.
- To revokes the current invite link of a group
    ``` ts
    const response = await conn.revokeInvite ("abcd-xyz@g.us")
    console.log("new group code: " + response.code)
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
conn.logger.level = 'debug'
```
This will enable you to see all sorts of messages WhatsApp sends in the console. Some examples:

1. Functionality to track of the battery percentage of your phone.
    You enable logging and you'll see a message about your battery pop up in the console: 
    ```s22, ["action",null,[["battery",{"live":"false","value":"52"},null]]] ``` 
    
    You now know what a battery update looks like. It'll have the following characteristics.
    - Given ```const bMessage = ["action",null,[["battery",{"live":"false","value":"52"},null]]]```
    - ```bMessage[0]``` is always ``` "action" ```
    - ```bMessage[1]``` is always ``` null ```
    - ```bMessage[2][0][0]``` is always ``` "battery" ```

    Hence, you can register a callback for an event using the following:
    ``` ts
    conn.on (`CB:action,,battery`, json => {
        const batteryLevelStr = json[2][0][1].value
        const batterylevel = parseInt (batteryLevelStr)
        console.log ("battery level: " + batterylevel + "%")
    })
    ```
    This callback will be fired any time a message is received matching the following criteria:
    ``` message [0] === "action" && message [1] === null && message[2][0][0] === "battery" ```
2. Functionality to keep track of the pushname changes on your phone.
    You enable logging and you'll see an unhandled message about your pushanme pop up like this: 
    ```s24, ["Conn",{"pushname":"adiwajshing"}]``` 
    
    You now know what a pushname update looks like. It'll have the following characteristics.
    - Given ```const pMessage = ["Conn",{"pushname":"adiwajshing"}] ```
    - ```pMessage[0]``` is always ``` "Conn" ```
    - ```pMessage[1]``` always has the key ``` "pushname" ```
    - ```pMessage[2]``` is always ``` undefined ```

    Following this, one can implement the following callback:
    ``` ts
    conn.on ('CB:Conn,pushname', json => {
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
