const WhatsAppWeb = require("./WhatsAppWeb")
const fs = require("fs")

let client = new WhatsAppWeb() // instantiate
try {
    const file = fs.readFileSync("auth_info.json") // load a closed session back if it exists
    const authInfo = JSON.parse(file)
    client.login( authInfo ) // log back in using the info we just loaded
} catch {
    // if no auth info exists, start a new session
    client.connect() // start a new session, with QR code scanning and what not
}
// called once the client connects successfully to the WhatsApp servers
client.handlers.onConnected = () => {
    const authInfo = client.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    fs.writeFileSync("auth_info.json", JSON.stringify(authInfo, null, "\t")) // save this info to a file
    /* 
        Note: one can take this file and login again from any computer without having to scan the QR code, and get full access to one's WhatsApp 
        Despite the convenience, be careful with this file
    */
}
// called when you have a pending unread message or recieve a new message
client.handlers.onUnreadMessage = (m) => { 
    console.log("recieved message: " + JSON.stringify(m)) // log and see what the message looks like

    /* send a message after at least a 1 second timeout after recieving a message, otherwise WhatsApp will reject the message otherwise */
    setTimeout(() => client.sendReadReceipt(m.key.remoteJid, m.key.id), 2*1000) // send a read reciept for the message in 2 seconds
    setTimeout(() => client.updatePresence(m.key.remoteJid, WhatsAppWeb.Presence.composing), 2.5*1000) // let them know you're typing in 2.5 seconds
    setTimeout(() => client.sendTextMessage(m.key.remoteJid, "hello!"), 4*1000) // send the actual message after 4 seconds
}
// called if an error occurs
client.handlers.onError = (err) => console.log(err)
client.handlers.onDisconnect = () => { /* internet got disconnected, save chats here or whatever; will reconnect automatically */ }


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
readline.question("type exit to disconnect\n", (txt) => {
    if (txt === "exit") {
        client.disconnect()
        process.exit(0)
    }
})