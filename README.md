# Baileys - WhatsApp Web API for Node.js

 Reverse Engineered WhatsApp Web API in pure Node.js. Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a WebSocket. Not running Selenium or Chromimum saves you like half a gig of ram :/ 

 Thank you to [@Sigalor](https://github.com/sigalor/whatsapp-web-reveng) for writing the guide to reverse engineering WhatsApp Web and thanks to [@Rhymen](https://github.com/Rhymen/go-whatsapp/) for the __go__ reimplementation.

 Baileys has also been written from the ground up to be very extensible and simple to use. 
 If you require more functionality than provided, it'll super easy for you to write an extension (More on this at the end).
 
 If you're interested in building a WhatsApp bot, you may wanna check out [WhatsAppInfoBot](https://github.com/adiwajshing/WhatsappInfoBot) and an actual bot built with it, [Messcat](https://github.com/adiwajshing/Messcat).

## Install
Create and cd to your NPM project directory and then in terminal, write: ``` npm install baileys ```
Then import in your code using:
``` javascript 
    const WhatsAppWeb = require('baileys') 
```

## Connecting
``` javascript
    const client = new WhatsAppWeb() 
    client.connect() 
    .then (([user, chats, contacts, unread]) => {
        console.log ("oh hello " + user.name + " (" + user.id + ")")
        console.log ("you have " + unread.length + " unread messages")
        console.log ("you have " + chats.length + " chats")
    })
    .catch (err => console.log("unexpected error: " + err) )
``` 
If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!

If you don't want to wait for WhatsApp to send all your chats while connecting, you can use the following function:

``` javascript
    const client = new WhatsAppWeb() 
    client.connectSlim() // does not wait for chats & contacts
    .then (user => {
        console.log ("oh hello " + user.name + " (" + user.id + ")")
        
        client.receiveChatsAndContacts () // wait for chats & contacts in the background
        .then (([chats, contacts, unread]) => {
            console.log ("you have " + unread.length + " unread messages")
            console.log ("you have " + chats.length + " chats")
        })
    })
    .catch (err => console.log("unexpected error: " + err))
``` 
## Handling Events
Implement the following callbacks in your code:

- Called when you have a pending unread message or recieve a new message
    ``` javascript 
    client.setOnUnreadMessage (m => {
        const [notificationType, messageType] = client.getNotificationType(m) // get what type of notification it is -- message, group add notification etc.
        console.log("got notification of type: " + notificationType) // message, groupAdd, groupLeave
        console.log("message type: " + messageType) // conversation, imageMessage, videoMessage, contactMessage etc.
    }, false) // set to `true` if you want to receive outgoing messages that may be sent from your phone
    ```
- Called when you recieve an update on someone's presence, they went offline or online
    ``` javascript 
    client.setOnPresenceUpdate (json => console.log(json.id + " presence is " + json.type))
    ```
- Called when your message gets delivered or read
    ``` javascript 
    client.setOnMessageStatusChange (json => {
        let sent = json.to
        if (json.participant) // participant exists when the message is from a group
            sent += " ("+json.participant+")" // mention as the one sent to
        // log that they acknowledged the message
        console.log(sent + " acknowledged message(s) " + json.ids + " as " + json.type + " at " + json.timestamp)
    })
    ```
- Called when the connection gets disconnected (either the server loses internet or the phone gets unpaired)
    ``` javascript 
    client.setOnUnexpectedDisconnect (err => console.log ("disconnected unexpectedly: " + err) )
    ```
## Sending Messages
It's super simple
- Send text messages using
    ``` javascript 
    client.sendTextMessage(id, "oh hello there!") 
    ``` 
- Send text messages & quote another message using
    ``` javascript 
        const options = {quoted: quotedMessage}
        client.sendTextMessage(id, "oh hello there", options) 
    ``` 
    ``` quotedMessage ``` is a message object
- Send a location using
    ``` javascript
        client.sendLocationMessage(id, 24.121231, 55.1121221) // the latitude, longitude of the location
    ```
- Send a contact using
    ``` javascript
        // format the contact as a VCARD
        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                    + 'VERSION:3.0\n' 
                    + 'FN:Jeff Singh\n' // full name
                    + 'ORG:Ashoka Uni;\n' // the organization of the contact
                    + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
                    + 'END:VCARD'
        client.sendContactMessage(id, "Jeff", vcard) 
    ```
- Send a media (image, video, sticker, pdf) message using
    ``` javascript
        const buffer = fs.readFileSync("example/ma_gif.mp4") // load some gif
        const options = {gif: true, caption: "hello!"} // some metadata & caption
        client.sendMediaMessage(id, buffer, WhatsAppWeb.MessageType.video, options)
    ```
    - The thumbnail can be generated automatically for images & stickers. Though, to automatically generate thumbnails for videos, you need to have ``` ffmpeg ``` installed on your system
    - ```mediaBuffer``` is just a Buffer containing the contents of the media you want to send
    - ```mediaType``` represents the type of message you are sending. This can be one of the following:
        ``` javascript
            [
                WhatsAppWeb.MessageType.image, // an image message
                WhatsAppWeb.MessageType.video, // a video message
                WhatsAppWeb.MessageType.audio, // an audio message
                WhatsAppWeb.MessageType.sticker // a sticker message
            ]
        ```
    - Tested formats: png, jpeg, webp (sticker), mp4, ogg

The last parameter when sending messages is `info`, a JSON object, providing some information about the message. It can have the following __optional__ values:
``` javascript
info = {
    caption: "hello there!", // (for media messages) the caption to send with the media (cannot be sent with stickers though)
    thumbnail: "23GD#4/==", /*  (for location & media messages) has to be a base 64 encoded JPEG if you want to send a custom thumb, 
                                or set to null if you don't want to send a thumbnail.
                                Do not enter this field if you want to automatically generate a thumb
                            */
    mimetype: "application/pdf", /* (for media messages) specify the type of media (optional for all media types except documents),
                                    for pdf files => set to "application/pdf",
                                    for txt files => set to "application/txt"
                                    etc.
                                */
    gif: true, // (for video messages) if the video should be treated as a GIF
    quoted: quotedMessage, // the message you want to quote (can be used with sending all kinds of messages)
    timestamp: Date() // optional, if you want to manually set the timestamp of the message
}
```

``` id ``` is the WhatsApp id of the person or group you're sending the message to. 

It must be in the format ```[country code][phone number]@s.whatsapp.net```, for example ```+19999999999@s.whatsapp.net``` for people. For groups, it must be in the format ``` 123456789-123345@g.us ```. **Do not attach** `@c.us` for individual people IDs, It won't work

## Sending Read Receipts
``` javascript 
    client.sendReadReceipt(id, messageID) 
```
The id is in the same format as mentioned earlier. The message ID is the unique identifier of the message that you are marking as read. On a message object, it can be accessed using ```messageID = message.key.id```.

## Update Presence
``` javascript
    client.updatePresence(id, WhatsAppWeb.Presence.available) 
```
This lets the person/group with ``` id ``` know whether you're online, offline, typing etc. where ``` presence ``` can be one of the following:
``` javascript
    [
        WhatsAppWeb.Presence.available, // online
        WhatsAppWeb.Presence.unavailable, // offline
        WhatsAppWeb.Presence.composing, // typing...
        WhatsAppWeb.Presence.recording // recording...
    ]
```

## Decoding Media
If you want to save & process some images, videos, documents or stickers you received
``` javascript
    client.setOnUnreadMessage (m => {
        const messageType = client.getMessageType(m.message) // get what type of message it is -- text, image, video
        // if the message is not a text message
        if (messageType !== WhatsAppWeb.MessageType.text && messageType !== WhatsAppWeb.MessageType.extendedText) {
            client.decodeMediaMessage(m.message, "filename") // extension applied automatically
            .then (meta => console.log(m.key.remoteJid + " sent media, saved at: " + meta.filename))
            .catch (err => console.log("error in decoding message: " + err))
        }
    }
```

## Restoring Sessions
Once you connect successfully, you can get your authentication credentials using
``` javascript
    const authJSON = client.base64EncodedAuthInfo() 
```
Then you can use this JSON to log back in without needing to scan a QR code using
``` javascript
    const authJSON = JSON.parse( fs.readFileSync("auth_info.json") )
    client.connect (authJSON)
    .then (([user, chats, contacts, unread]) => console.log ("yay connected"))
```

## Querying
- To check if a given ID is on WhatsApp
    ``` javascript
        client.isOnWhatsApp ("xyz@c.us")
        .then (([exists, id]) => console.log(id + (exists ? " exists " : " does not exist") + "on WhatsApp"))
    ```
- To query chat history on a group or with someone
    ``` javascript
    client.loadConversation ("xyz-abc@g.us", 25) // query the last 25 messages (replace 25 with the number of messages you want to query)
    .then (messages => console.log("got back " + messages.length + " messages"))
    ```
    You can also load the entire conversation history if you want
    ``` javascript
    client.loadEntireConversation ("xyz@c.us", (message) => console.log("Loaded message with ID: " + message.key.id))
    .then (() => console.log("queried all messages")) // promise resolves once all messages are retreived
    ```
- To get the status of some person
    ``` javascript
    client.getStatus ("xyz@c.us") // leave empty to get your own
    .then ((json, q) => console.log("status: " + json.status))
    ```
- To get the display picture of some person/group
    ``` javascript
    client.getProfilePicture ("xyz@g.us") // leave empty to get your own
    .then (([json, q]) => console.log("download profile picture from: " + json.eurl))
    ```
- To get someone's presence (if they're typing, online)
    ``` javascript
    client.requestPresenceUpdate ("xyz@c.us")
    // the presence update is fetched and called here
    client.setOnPresenceUpdate (json => console.log(json.id + " presence is " + json.type))
    ```

Of course, replace ``` xyz ``` with an actual ID. Also, append ``` @c.us ``` for individuals & ``` @g.us ``` for groups.

## Groups
- To query the metadata of a group
    ``` javascript
    client.groupMetadata ("abcd-xyz@g.us")
    .then (([json, _]) => console.log(json.id + ", title: " + json.subject + ", description: " + json.desc))
    ```
- To create a group
    ``` javascript
    client.groupCreate ("My Fab Group", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"]) // title & participants
    .then (([json, _]) => {
        console.log ("created group with id: " + json.gid)
        client.sendTextMessage(json.gid, "hello everyone") // say hello to everyone on the group
    })
    ```
- To add people to a group
    ``` javascript
    client.groupAdd ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"]) // id & people to add to the group
    .then (([json, _]) => console.log("added successfully: " + (json.status===200)))
    ```
- To make someone admin on a group
    ``` javascript
    client.groupMakeAdmin ("abcd-xyz@g.us", ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"]) // id & people to make admin
    .then (([json, _]) => console.log("made admin successfully: " + (json.status===200)))
    ```
- To leave a group
    ``` javascript
    client.groupLeave ("abcd-xyz@g.us")
    .then (([json, _]) => console.log("left group successfully: " + (json.status===200)))
    ```
- To get the invite code for a group
    ``` javascript
    client.groupInviteCode ("abcd-xyz@g.us")
    .then (code => console.log(code))
    ```

## Writing Custom Functionality
Baileys is written, keeping in mind, that you may require other custom functionality. Hence, instead of having to fork the project & re-write the internals, you can simply write extensions in your own code.

First, enable the logging of unhandled messages from WhatsApp by setting
``` javascript
client.logUnhandledMessages = true
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
    ``` javascript
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
    ``` javascript
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

## Example
Do check out & run [example.js](example/example.js) to see example usage of these functions.
To run the example script, download or clone the repo and then type the following in terminal:
1. ``` cd path/to/Baileys/example ```
2. ``` node example.js ```

### Note
 I am in no way affiliated with WhatsApp. This was written for educational purposes. Use at your own discretion.
