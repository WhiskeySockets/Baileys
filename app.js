import {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

async function start() {
  // folder untuk simpan session
  const { state, saveCreds } = await useMultiFileAuthState("./middlewares/auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    // ini yg bikin error kemarin karena Browsers belum di-import
    browser: Browsers.ubuntu(""),
  });

  // event saat QR diterima
  sock.ev.on("connection.update", (update) => {
    const { qr } = update;
    if (qr) {
      console.log("Scan QR berikut untuk login:");
      qrcode.generate(qr, { small: true }); // tampilkan QR di terminal
    }
  });

  // supaya session tersimpan otomatis
  sock.ev.on("creds.update", saveCreds);
}

start();
