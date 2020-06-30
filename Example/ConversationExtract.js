const WhatsAppWeb = require("../WhatsAppWeb")
const fs = require("fs")

/** 
 * Extract all your WhatsApp conversations & save them to a file
 * produceAnonData => should the Id of the chat be recorded
 * */ 
function extractChats (authCreds, outputFile, produceAnonData=false, offset=null) {
    let client = new WhatsAppWeb() // instantiate an instance
    // internal extract function
    const extract = function () {
        let rows = 0
        let chats = Object.keys(client.chats)
        let encounteredOffset
        if (offset) {
            encounteredOffset = false
        } else {
            encounteredOffset = true
            fs.writeFileSync(outputFile, "chat,input,output\n") // write header to file
        }

        const extractChat = function (index) {
            const id = chats[index]
            if (id.includes("g.us") || !encounteredOffset) { // skip groups
                if (id === offset) {
                    encounteredOffset = true
                }
                if (index+1 < chats.length) {
                    return extractChat(index+1)
                }
                return
            }
            console.log("extracting for " + id + "...")

            var curInput = ""
            var curOutput = ""
            var lastMessage
            return client.loadEntireConversation (id, m => {
                var text
                if (!m.message) { // if message not present, return
                    return
                } else if (m.message.conversation) { // if its a plain text message
                    text = m.message.conversation
                } else if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) { // if its a reply to a previous message
                    const mText = m.message.extendedTextMessage.text
                    const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage 
                    // if it's like a '.' and the quoted message has no text, then just forget it
                    if (mText.length <= 2 && !quotedMessage.conversation) {
                        return
                    }
                    // if somebody sent like a '.', then the text should be the quoted message
                    if (mText.length <= 2) {
                        text = quotedMessage.conversation
                    } else { // otherwise just use this text
                        text = mText
                    }
                } else {
                    return
                }
                // if the person who sent the message has switched, flush the row
                if (lastMessage && !m.key.fromMe && lastMessage.key.fromMe) {

                    let row = "" + (produceAnonData ? "" : id) + ",\"" + curInput + "\",\"" + curOutput + "\"\n"
                    fs.appendFileSync (outputFile, row)
                    rows += 1
                    curInput = ""
                    curOutput = ""
                }

                if (m.key.fromMe) {
                    curOutput += curOutput === "" ? text : ("\n"+text)
                } else {
                    curInput += curInput === "" ? text : ("\n"+text)
                }

                lastMessage = m
            }, 50, false) // load from the start, in chunks of 50
            .then (() => console.log("finished extraction for " + id))
            .then (() => {
                if (index+1 < chats.length) {
                    return extractChat(index+1)
                }
            })
        }

        extractChat(0)
        .then (() => {
            console.log("extracted all; total " + rows + " rows")
            client.logout ()
        })
    }
    client.connect (authCreds)
    .then (() => extract())
    .catch (err => console.log("got error: " + error))
}
let creds = null//JSON.parse(fs.readFileSync("auth_info.json"))
extractChats(creds, "output.csv")