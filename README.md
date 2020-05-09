# Baileys

 Reverse Engineered WhatsApp Web API in pure Node.js. Baileys does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a WebSocket. Not running Selenium or Chromimum saves you like half a gig of ram :/ 
 
 Thank you to [Sigalor](https://github.com/sigalor/whatsapp-web-reveng) for writing the guide to reverse engineering WhatsApp Web and thanks to [Rhymen](https://github.com/Rhymen/go-whatsapp/tree/484cfe758705761d76724e01839d6fc473dc10c4) for the __go__ reimplementation.

Baileys is super easy to use:
* Install from npm using
    ``` npm install github:adiwajshing/Baileys ```
* Then import in your code using 
    ``` javascript 
        const WhatsAppWeb = require('Baileys') 
    ```
* Create an instance of Baileys & connect using 
    ``` javascript
        let client = new WhatsAppWeb() 
        client.connect()
    ``` 
    If the connection is successful, you will see a QR code printed on your terminal screen, scan it with WhatsApp on your phone and you'll be logged in!
* Implement the following event handlers in your code:
    ``` javascript 
        client.handlers.onConnected = () => { /* when you're successfully authenticated with the WhatsApp Web servers */ } 
    ```
    ``` javascript 
        client.handlers.onUnreadMessage = (message) => { /* called when you have a pending unread message or recieve a new message */ } 
    ```
    ``` javascript 
        client.handlers.onError = (error) => { /* called when there was an error */ } 
    ```
    ``` javascript 
        client.handlers.onGotContact = (contactArray) => { /* called when we recieve the contacts (contactArray is an array) */ } 
    ```
    ``` javascript 
        client.handlers.presenceUpdated = (id, presence) => { /* called when you recieve an update on someone's presence */ } 
    ```
    ``` javascript 
        client.handlers.onMessageStatusChanged = (id, messageID, status) => { /* called when your message gets delivered or read */ } 
    ```
    ``` javascript 
        client.handlers.onDisconnect = () => { /* called when internet gets disconnected */ } 
    ```
* Get the type of message using
    ``` javascript
        client.handlers.onUnreadMessage = (m) => { 
            const messageType = client.getMessageType(m.message) // get what type of message it is -- text, image, video
        }
    ```
* Decode a media message using
    ``` javascript
        client.handlers.onUnreadMessage = (m) => { 
            const messageType = client.getMessageType(m.message) // get what type of message it is -- text, image, video
            
            // if the message is not a text message
            if (messageType !== WhatsAppWeb.MessageType.text && messageType !== WhatsAppWeb.MessageType.extendedText) {
                client.decodeMediaMessage(m.message, "filename") // extension applied automatically
                .then (meta => console.log(m.key.remoteJid + " sent media, saved at: " + meta.fileName))
                .catch (err => console.log("error in decoding message: " + err))
            }
        }
    ```
* Send a text message using 
    ``` javascript 
        client.sendTextMessage(id, txtMessage) 
    ``` 
    Or if you want to quote another message:
    ``` javascript 
        client.sendTextMessage(id, txtMessage, quotedMessage) 
    ``` 
    The id is the phone number of the person the message is being sent to, it must be in the format '[country code][phone number]@s.whatsapp.net', for example '+19999999999@s.whatsapp.net'
* Send a media (image, video, sticker, pdf) message using
    ``` javascript
        client.sendMediaMessage(id, mediaBuffer, mediaType, info)
    ```
    - The thumbnail can be generated automatically for images & stickers.
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
    - ```info``` is a JSON object, providing some information about the media. It can have the following __optional__ values:
        ``` javascript
            info = {
                caption: "hello there!", // the caption to send with the media (cannot be sent with stickers though)
                thumbnail: null, /* has to be a base 64 encoded JPEG if you want to send a custom thumb, 
                                    or set to null if you don't want to send a thumbnail.
                                    Do not enter this field if you want to automatically generate a thumb
                                  */
                mimetype: "application/pdf", /* specify the type of media (optional for all media types except documents),
                                                for pdf files => set to "application/pdf",
                                                for txt files => set to "application/txt"
                                                etc.
                                            */
                gif: true // only applicable to video messages, if the video should be treated as a GIF
            }
        ```
    - Tested formats: png, jpeg, webp (sticker), mp4, ogg
    - To automatically generate thumbnails for videos, you need to have ``` ffmpeg ``` installed on your system
* Send a read reciept using 
    ``` javascript 
        client.sendReadReceipt(id, messageID) 
    ```
    The id is in the same format as mentioned earlier. The message ID is the unique identifier of the message that you are marking as read
* Update your status by using 
    ``` javascript
        client.updatePresence(id, presence) 
    ```
    This lets the person with ``` id ``` know your status. where ``` presence ``` can be one of the following:
    ``` javascript
        [
            WhatsAppWeb.Presence.available, // online
            WhatsAppWeb.Presence.unavailable, // offline
            WhatsAppWeb.Presence.composing, // typing...
            WhatsAppWeb.Presence.recording // recording...
        ]
    ```
    
* Once you want to close your session, you can get your authentication credentials using:
     ``` javascript
        const authJSON = client.base64EncodedAuthInfo() 
    ```
    and then save this JSON to a file
* If you want to restore your session (i.e. log back in without having to scan the QR code), simply retreive your previously saved credentials and use
    ``` javascript
        const authJSON = JSON.parse( fs.readFileSync("auth_info.json") )
        client.login(authJSON)
    ```
    This will use the credentials to connect & log back in. No need to call ``` connect() ``` after calling this function
* To query things like chat history and all, use:
    * To check if a given ID is on WhatsApp
    ``` javascript
        client.isOnWhatsApp ("xyz@c.us")
        .then (([exists, id]) => console.log(id + (exists ? " exists " : " does not exist") + "on WhatsApp"))
    ```
    * To query chat history on a group or with someone
    ``` javascript
        client.getMessages ("xyz@c.us", 25) // query the last 25 messages (replace 25 with the number of messages you want to query)
        .then (messages => console.log("got back " + messages.length + " messages"))
    ```
    * To query the entire chat history
    ``` javascript
        client.getAllMessages ("xyz@c.us", (message) => {
            console.log("GOT message with ID: " + message.key.id)
        })
        .then (() => console.log("queried all messages")) // promise ends once all messages are retreived
    ```
    * To query someone's status
    ``` javascript
        client.getStatus ("xyz@c.us")
        .then (json => console.log("status: " + json.status))
    ```
    * To get someone's profile picture
    ``` javascript
        client.getStatus ("xyz@c.us") // 
        .then (json => console.log("download profile picture from: " + json.eurl))
    ```
    * To get someone's presence (if they're typing, online)
    ``` javascript
        client.requestPresenceUpdate ("xyz@c.us")
        // the presence update is fetched and called here
        client.handlers.presenceUpdated = (id, presence) => {
            console.log(id + " has status: " + presence)
        } 

    ```
    
    Of course, replace ``` xyz ``` with an actual country code & number. 
    Also, append ``` @c.us ``` for individuals & ``` @g.us ``` for groups.


Do check out & run [example.js](example/example.js) to see example usage of all these functions.
To run the example script, download or clone the repo and then type the following in terminal:
1. ``` cd path/to/Baileys/example ```
2. ``` node example.js ```

# Note
 I am in no way affiliated with WhatsApp. This was written for educational purposes. Use at your own discretion.