# Baileys MD - Typescript/Javascript WhatsApp Web API
 
 Early Multi-Device Edition. Breaks completely from master.

 Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a **WebSocket**. Not running Selenium or Chromimum saves you like **half a gig** of ram :/ 

 Thank you to [@pokearaujo](https://github.com/pokearaujo/multidevice) for writing his observations on the workings of WhatsApp Multi-Device.

 Baileys is type-safe, extensible and simple to use. If you require more functionality than provided, it'll super easy for you to write an extension. More on this [here](#WritingCustomFunctionality).
 
 If you're interested in building a WhatsApp bot, you may wanna check out [WhatsAppInfoBot](https://github.com/adiwajshing/WhatsappInfoBot) and an actual bot built with it, [Messcat](https://github.com/ashokatechmin/Messcat).
 
 **Read the docs [here](https://adiwajshing.github.io/Baileys)**
 **Join the Discord [here](https://discord.gg/7FYURJyqng)**

## Example

Do check out & run [example.ts](Example/example.ts) to see example usage of the library.
The script covers most common use cases.
To run the example script, download or clone the repo and then type the following in terminal:
1. ``` cd path/to/Baileys ```
2. ``` yarn```
3. ``` yarn example ```

## Install

Right now, the multi-device branch is only available from GitHub, install using:
```
yarn add github:adiwajshing/baileys#multi-device
```

Then import in your code using:
``` ts 
import makeWASocket from '@adiwajshing/baileys-md'
```

## Unit Tests

TODO

## Connecting

``` ts
import makeWASocket from '@adiwajshing/baileys-md'

async function connectToWhatsApp () {
    const conn = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                sock = startSock()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', m => {
        console.log(JSON.stringify(m, undefined, 2))

        console.log('replying to', m.messages[0].key.remoteJid)
        sendMessageWTyping({ text: 'Hello there!' }, m.messages[0].key.remoteJid!)
    })
}
// run in main file
connectToWhatsApp()
``` 

If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!

**Note:** install `qrcode-terminal` using `yarn add qrcode-terminal` to auto-print the QR to the terminal.

## Notable Differences Between Baileys Web & MD

1. Baileys has been written from the ground up to have a more "functional" structure. This is done primarily for simplicity & more testability
2. Baileys no longer maintains an internal state of chats/contacts/messages. You must take this on your own, simply because your state in MD is its own source of truth & there is no one-size-fits-all way to handle the storage for this.
3. A baileys "socket" is meant to be a temporary & disposable object -- this is done to maintain simplicity & prevent bugs. I felt the entire Baileys object became too bloated as it supported too many configurations. You're encouraged to write your own implementation to handle missing functionality.
4. Moreover, Baileys does not offer an inbuilt reconnect mechanism anymore (though it's super easy to set one up on your own with your own rules, check the example script)

## Configuring the Connection

You can configure the connection by passing a `SocketConfig` object.

The entire `SocketConfig` structure is mentioned here with default values:
``` ts
type SocketConfig = {
    /** provide an auth state object to maintain the auth state */
    auth?: AuthenticationState
    /** the WS url to connect to WA */
    waWebSocketUrl: string | URL 
    /** Fails the connection if the connection times out in this time interval or no data is received */
	connectTimeoutMs: number
    /** ping-pong interval for WS connection */
    keepAliveIntervalMs: number
    /** proxy agent */
	agent?: Agent
    /** pino logger */
	logger: Logger
    /** version to connect with */
    version: WAVersion
    /** override browser config */
	browser: WABrowserDescription
	/** agent used for fetch requests -- uploading/downloading media */
	fetchAgent?: Agent
    /** should the QR be printed in the terminal */
    printQRInTerminal: boolean
}
```

## Saving & Restoring Sessions

You obviously don't want to keep scanning the QR code every time you want to connect. 

So, you can save the credentials to log back in via:
``` ts
import makeWASocket, { BufferJSON } from '@adiwajshing/baileys-md'
import * as fs from 'fs'

// will initialize a default in-memory auth session
const conn = makeSocket() 
// this will be called as soon as the credentials are updated
conn.ev.on ('auth-state.update', () => {
    // save credentials whenever updated
    console.log (`credentials updated!`)
    const authInfo = conn.authState // get all the auth info we need to restore this session
    // save this info to a file
    fs.writeFileSync(
        './auth_info.json', 
        JSON.stringify(authInfo, BufferJSON.replacer, 2)
    ) 
})
```

Then, to restore a session:
``` ts
import makeWASocket, { BufferJSON, initInMemoryKeyStore } from '@adiwajshing/baileys-md'
import * as fs from 'fs'

const authJSON = JSON.parse(
    fs.readFileSync(
        './auth_info.json',
        { encoding: 'utf-8' }
    ),
    BufferJSON.reviver
)
const auth = { 
    creds: authJSON.creds, 
    // stores pre-keys, session & other keys in a JSON object
    // we deserialize it here
    keys: initInMemoryKeyStore(authJSON.keys) 
}
const conn = makeWASocket(auth)
// yay will connect without scanning QR
```

**Note**: Upon every successive connection, the auth state can update part of the stored credentials. It will also update when a message is received/sent due to signal sessions needing updating. Whenever that happens, the `auth-state.update` event is fired uploaded, and you must update your saved credentials upon receiving the event. Not doing so will prevent your messages from reaching the recipient & other unexpected consequences.

## Listening to Connection Updates

Baileys now fires the `connection.update` event to let you know something has updated in the connection. This data has the following structure:
``` ts
type ConnectionState = {
	/** connection is now open, connecting or closed */
	connection: WAConnectionState
	/** the error that caused the connection to close */
	lastDisconnect?: {
		error: Error
		date: Date
	}
	/** is this a new login */
	isNewLogin?: boolean
	/** the current QR code */
	qr?: string
	/** has the device received all pending notifications while it was offline */
	receivedPendingNotifications?: boolean 
}
```

Note: this also offers any updates to the QR

## Handling Events

Baileys uses the EventEmitter syntax for events. 
They're all nicely typed up, so you shouldn't have any issues with an Intellisense editor like VS Code.

The events are typed up in a type map, as mentioned here:

``` ts

export type BaileysEventMap = {
    /** connection state has been updated -- WS closed, opened, connecting etc. */
	'connection.update': Partial<ConnectionState>
    /** auth state updated -- some pre keys, or identity keys etc. */
    'auth-state.update': AuthenticationState
    /** set chats (history sync), messages are reverse chronologically sorted */
    'chats.set': { chats: Chat[], messages: WAMessage[] }
    /** upsert chats */
    'chats.upsert': Chat[]
    /** update the given chats */
    'chats.update': Partial<Chat>[]
    /** delete chats with given ID */
    'chats.delete': string[]
    /** presence of contact in a chat updated */
    'presence.update': { id: string, presences: { [participant: string]: PresenceData }  }

    'contacts.upsert': Contact[]
    'contacts.update': Partial<Contact>[] 
    
    'messages.delete': { keys: WAMessageKey[] } | { jid: string, all: true }
    'messages.update': WAMessageUpdate[]
    /** 
     * add/update the given messages. If they were received while the connection was online, 
     * the update will have type: "notify"
     *  */
    'messages.upsert': { messages: WAMessage[], type: MessageUpdateType }

    'message-info.update': MessageInfoUpdate[]

    'groups.update': Partial<GroupMetadata>[]
    /** apply an action to participants in a group */
    'group-participants.update': { id: string, participants: string[], action: ParticipantAction }

    'blocklist.set': { blocklist: string[] }
    'blocklist.update': { blocklist: string[], type: 'add' | 'remove' }
}
```

You can listen to these events like this:
``` ts

const sock = makeWASocket()
sock.ev.on('messages.upsert', ({ messages }) => {
    console.log('got messages', messages)
})

```

## Sending Messages

**Send all types of messages with a single function:**

### Non-Media Messages

``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys-md'

const id = 'abcd@s.whatsapp.net' // the WhatsApp ID 
// send a simple text!
const sentMsg  = await conn.sendMessage(id, { text: 'oh hello there' })
// send a location!
const sentMsg  = await conn.sendMessage(
    id, 
    { location: { degreesLatitude: 24.121231, degreesLongitude: 55.1121221 } }
)
// send a contact!
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Jeff Singh\n' // full name
            + 'ORG:Ashoka Uni;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
            + 'END:VCARD'
const sentMsg  = await conn.sendMessage(
    id,
    { 
        contacts: { 
            displayName: 'Jeff', 
            contacts: [{ vcard }] 
        }
    }
)
```

### Media Messages

Sending media (video, stickers, images) is easier & more efficient than ever. 
- You can specify a buffer, a local url or even a remote url.
- When specifying a media url, Baileys never loads the entire buffer into memory, it even encrypts the media as a readable stream.

``` ts
import { MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys-md'
// Sending gifs
await conn.sendMessage(
    id, 
    { 
        video: fs.readFileSync("Media/ma_gif.mp4"), 
        caption: "hello!",
        gifPlayback: true
    }
)
await conn.sendMessage(
    id, 
    { 
        video: "./Media/ma_gif.mp4", 
        caption: "hello!",
        gifPlayback: true
    }
)

await conn.sendMessage(
    id, 
    { 
        video: "./Media/ma_gif.mp4", 
        caption: "hello!",
        gifPlayback: true
    }
)

// send an audio file
await conn.sendMessage(
    id, 
    { audio: { url: "./Media/audio.mp3" }, mimetype: 'audio/mp4' }
    { url: "Media/audio.mp3" }, // can send mp3, mp4, & ogg
)
```

### Notes

- `id` is the WhatsApp ID of the person or group you're sending the message to. 
    - It must be in the format ```[country code][phone number]@s.whatsapp.net```, for example ```+19999999999@s.whatsapp.net``` for people. For groups, it must be in the format ``` 123456789-123345@g.us ```. 
    - For broadcast lists it's `[timestamp of creation]@broadcast`.
    - For stories, the ID is `status@broadcast`.
- For media messages, the thumbnail can be generated automatically for images & stickers. Thumbnails for videos can also be generated automatically, though, you need to have `ffmpeg` installed on your system.
- **MiscGenerationOptions**: some extra info about the message. It can have the following __optional__ values:
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
                                    import {Mimetype} from '@adiwajshing/baileys-md'
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
const msg = getMessageFromStore('455@s.whatsapp.net', 'HSJHJWH7323HSJSJ') // implement this on your end
await conn.sendMessage('1234@s.whatsapp.net', { forward: msg }) // WA forward the message!
```

## Reading Messages

A set of message IDs must be explicitly marked read now. 
Cannot mark an entire "chat" read as it were with Baileys Web.
This does mean you have to keep track of unread messages.

``` ts 
const id = '1234-123@g.us'
const messageID = 'AHASHH123123AHGA' // id of the message you want to read
const participant = '912121232@s.whatsapp.net' // the ID of the user that sent the message (undefined for individual chats)

await conn.sendReadReceipt(id, participant, [messageID])
```

The message ID is the unique identifier of the message that you are marking as read. On a `WAMessage`, the `messageID` can be accessed using ```messageID = message.key.id```.

## Update Presence

``` ts
await conn.updatePresence(id, 'available') 

```
This lets the person/group with ``` id ``` know whether you're online, offline, typing etc. where ``` presence ``` can be one of the following:
``` ts
type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'
```

The presence expires after about 10 seconds.

## Downloading Media Messages

If you want to save the media you received
``` ts
import { writeFile } from 'fs/promises'
import { downloadContentFromMessage } from '@adiwajshing/baileys-md'

conn.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]

    if (!m.message) return // if there is no text or media message
    const messageType = Object.keys (m.message)[0]// get what type of message it is -- text, image, video
    // if the message is an image
    if (messageType === 'imageMessage') {
        // download stream
        const stream = await downloadContentFromMessage(m.message.imageMessage, 'image')
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        // save to file
        await writeFile('./my-download.jpeg', buffer)
    }
}
```

## Deleting Messages

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
const response = await conn.sendMessage(jid, { text: 'hello!' }) // send a message
// sends a message to delete the given message
// this deletes the message for everyone
await conn.sendMessage(jid, { delete: response.key })
```

Note: deleting for oneself is supported via `chatModify` (next section)

## Modifying Chats

WA uses an encrypted form of communication to send chat/app updates. This has been implemented mostly and you can send the following updates:

- Archive a chat
  ``` ts
  const lastMsgInChat = await getLastMessageInChat('123456@s.whatsapp.net') // implement this on your end
  await conn.chatModify({ archive: true }, '123456@s.whatsapp.net', [lastMsgInChat])
  ```
- Mute/unmute a chat
  ``` ts
  // mute for 8 hours
  await conn.chatModify({ mute: 8*60*60*1000 }, '123456@s.whatsapp.net', [])
  // unmute
  await conn.chatModify({ mute: null }, '123456@s.whatsapp.net', [])
  ```
- Mark a chat read/unread
  ``` ts
  const lastMsgInChat = await getLastMessageInChat('123456@s.whatsapp.net') // implement this on your end
  // mark it unread
  await conn.chatModify({ markRead: false }, '123456@s.whatsapp.net', [lastMsgInChat])
  ```

- Delete message for me
  ``` ts
  // mark it unread
  await conn.chatModify(
      { clear: { message: { id: 'ATWYHDNNWU81732J', fromMe: true } } }, 
      '123456@s.whatsapp.net', 
      []
  )
  ```

Note: if you mess up one of your updates, WA can log you out of all your devices and you'll have to login again.

## Disappearing Messages

``` ts
const jid = '1234@s.whatsapp.net' // can also be a group
// turn on disappearing messages
await conn.sendMessage(
    jid, 
    // this is 1 week in seconds -- how long you want messages to appear for
    { disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL }
)
// will send as a disappearing message
await conn.sendMessage(jid, { text: 'hello' }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
// turn off disappearing messages
await conn.sendMessage(
    jid, 
    { disappearingMessagesInChat: false }
)

```

## Misc

- To check if a given ID is on WhatsApp
    ``` ts
    const id = '123456'
    const [result] = await conn.onWhatsApp(id)
    if (result.exists) console.log (`${id} exists on WhatsApp, as jid: ${result.jid}`)
    ```
- To query chat history on a group or with someone
    TODO, if possible
- To get the status of some person
    ``` ts
    const status = await conn.fetchStatus("xyz@s.whatsapp.net")
    console.log("status: " + status)
    ```
- To get the display picture of some person/group
    ``` ts
    const ppUrl = await conn.profilePictureUrl("xyz@g.us")
    console.log("download profile picture from: " + ppUrl)
    ```
- To change your display picture or a group's
    ``` ts
    const jid = '111234567890-1594482450@g.us' // can be your own too
    await conn.updateProfilePicture(jid, { url: './new-profile-picture.jpeg' })
    ```
- To get someone's presence (if they're typing, online)
    ``` ts
    // the presence update is fetched and called here
    conn.ev.on('presence-update', json => console.log(json))
    // request updates for a chat
    await conn.presenceSubscribe("xyz@s.whatsapp.net") 
    ```
- To block or unblock user
    ``` ts
    await conn.updateBlockStatus("xyz@s.whatsapp.net", "block") // Block user
    await conn.updateBlockStatus("xyz@s.whatsapp.net", "unblock") // Unblock user
    ```
Of course, replace ``` xyz ``` with an actual ID. 

## Groups
- To create a group
    ``` ts
    // title & participants
    const group = await conn.groupCreate("My Fab Group", ["1234@s.whatsapp.net", "4564@s.whatsapp.net"])
    console.log ("created group with id: " + group.gid)
    conn.sendMessage(group.id, { text: 'hello there' }) // say hello to everyone on the group
    ```
- To add/remove people to a group or demote/promote people
    ``` ts
    // id & people to add to the group (will throw error if it fails)
    const response = await conn.groupParticipantsUpdate(
        "abcd-xyz@g.us", 
        ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"],
        "add" // replace this parameter with "remove", "demote" or "promote"
    )
    ```
- To change the group's subject
    ``` ts
    await conn.groupUpdateSubject("abcd-xyz@g.us", "New Subject!")
    ```
- To change group settings
    ``` ts
    // only allow admins to send messages
    await conn.groupSettingUpdate("abcd-xyz@g.us", 'announcement')
    // allow everyone to modify the group's settings -- like display picture etc.
    await conn.groupSettingUpdate("abcd-xyz@g.us", 'unlocked')
    // only allow admins to modify the group's settings
    await conn.groupSettingUpdate("abcd-xyz@g.us", 'locked')
    ```
- To leave a group
    ``` ts
    await conn.groupLeave("abcd-xyz@g.us") // (will throw error if it fails)
    ```
- To get the invite code for a group
    ``` ts
    const code = await conn.groupInviteCode("abcd-xyz@g.us")
    console.log("group code: " + code)
    ```
- To query the metadata of a group
    ``` ts
    const metadata = await conn.groupMetadata("abcd-xyz@g.us") 
    console.log(json.id + ", title: " + json.subject + ", description: " + json.desc)
    ```
- To join the group using the invitation code
    ``` ts
    const response = await conn.acceptInvite("xxx")
    console.log("joined to: " + response.gid)
    ```
    Of course, replace ``` xxx ``` with invitation code.

## Broadcast Lists & Stories

- You can send messages to broadcast lists the same way you send messages to groups & individual chats.
- Unfortunately, WA Web does not support creating broadcast lists right now but you can still delete them.
- Broadcast IDs are in the format `12345678@broadcast`
- To query a broadcast list's recipients & name:
    ``` ts
    const bList = await conn.getBroadcastListInfo("1234@broadcast")
    console.log (`list name: ${bList.name}, recps: ${bList.recipients}`)
    ```

## Writing Custom Functionality
Baileys is written, keeping in mind, that you may require other custom functionality. Hence, instead of having to fork the project & re-write the internals, you can simply write extensions in your own code.

First, enable the logging of unhandled messages from WhatsApp by setting
``` ts
const sock = makeWASocket({
    logger: P({ level: 'debug' }),
})
```
This will enable you to see all sorts of messages WhatsApp sends in the console. Some examples:

1. Functionality to track of the battery percentage of your phone.
    You enable logging and you'll see a message about your battery pop up in the console: 
    ```{"level":10,"fromMe":false,"frame":{"tag":"ib","attrs":{"from":"@s.whatsapp.net"},"content":[{"tag":"edge_routing","attrs":{},"content":[{"tag":"routing_info","attrs":{},"content":{"type":"Buffer","data":[8,2,8,5]}}]}]},"msg":"communication"} ``` 
    
   The "frame" is what the message received is, it has three components:
   - `tag` -- what this frame is about (eg. message will have "message")
   - `attrs` -- a string key-value pair with some metadata (contains ID of the message usually)
   - `content` -- the actual data (eg. a message node will have the actual message content in it)
   - read more about this format [here](/src/WABinary/readme.md)

    Hence, you can register a callback for an event using the following:
    ``` ts
    // for any message with tag 'edge_routing'
    conn.ws.on(`CB:edge_routing`, (node: BinaryNode) => { })
    // for any message with tag 'edge_routing' and id attribute = abcd
    conn.ws.on(`CB:edge_routing,id:abcd`, (node: BinaryNode) => { })
    // for any message with tag 'edge_routing', id attribute = abcd & first content node routing_info
    conn.ws.on(`CB:edge_routing,id:abcd,routing_info`, (node: BinaryNode) => { })
    ```

### Note

 This library was originally a project for **CS-2362 at Ashoka University** and is in no way affiliated with WhatsApp. Use at your own discretion. Do not spam people with this.

 Also, this repo is now licenced under GPL 3 since it uses [libsignal-node](https://git.questbook.io/backend/service-coderunner/-/merge_requests/1)
