const { default: makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const NodeCache = require("node-cache");
const readline = require("readline");
const clc = require("cli-color");

const msgRetryCounterCache = new NodeCache();
const usePairingCode = process.argv.includes("--use-pairing-code")

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function connectToWhatsApp() {
   let { state, saveCreds } = await useMultiFileAuthState("./auth");
   let { version } = await fetchLatestBaileysVersion();

   const sock = makeWASocket({
      version,
      logger: pino({level: "silent"}),
      printQRInTerminal: !usePairingCode,
      mobile: false,
      browser: ["FireFox (linux)"],
      auth: state,
      msgRetryCounterCache,
   });

   if (usePairingCode && !sock.authState.creds.registered) {
      const phoneNumber = await question(`Enter your phone number:\n/> `);
      const code = await sock.requestPairingCode(phoneNumber);
      console.log(`Your connection code: ${clc.bold(code)}\n`);
      console.log(`Open your WhatsApp, go to ${clc.bold("Connected Devices > Connect a new Device > Connect using phone number.")}`)
   }

   sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
        console.log(`${clc.red("➜")} ${clc.yellowBright("connected")}`);
    }
  });

  sock.ev.on("creds.update", saveCreds);
  return sock;
}

module.exports = connectToWhatsApp;