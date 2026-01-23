<p align="center">
  <img src="https://raw.githubusercontent.com/firdausmntp/Baileys-Joss/main/Media/logo.png" alt="Baileys-Joss" width="200"/>
</p>

<h1 align="center">Baileys-Joss</h1>

<p align="center">
  <b>🚀 WhatsApp Web API Library with Extra Features</b><br>
  Fork of <a href="https://github.com/WhiskeySockets/Baileys">Baileys</a> with added Interactive Button, LID/SenderPn Plotting features, and more.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/baileys-joss"><img src="https://img.shields.io/npm/v/baileys-joss?color=green&label=npm&style=flat-square" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/baileys-joss"><img src="https://img.shields.io/npm/dm/baileys-joss?color=blue&style=flat-square" alt="npm downloads"/></a>
  <a href="https://www.npmjs.com/package/baileys-joss"><img src="https://img.shields.io/npm/dt/baileys-joss?color=blue&style=flat-square" alt="npm total downloads"/></a>
  <a href="https://github.com/firdausmntp/Baileys-Joss/blob/main/LICENSE"><img src="https://img.shields.io/github/license/firdausmntp/Baileys-Joss?style=flat-square" alt="license"/></a>
  <a href="https://github.com/firdausmntp/Baileys-Joss/stargazers"><img src="https://img.shields.io/github/stars/firdausmntp/Baileys-Joss?style=flat-square" alt="stars"/></a>
  <a href="https://github.com/firdausmntp/Baileys-Joss/network/members"><img src="https://img.shields.io/github/forks/firdausmntp/Baileys-Joss?style=flat-square" alt="forks"/></a>
  <a href="https://github.com/firdausmntp/Baileys-Joss/issues"><img src="https://img.shields.io/github/issues/firdausmntp/Baileys-Joss?style=flat-square" alt="issues"/></a>
</p>

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <b>📖 Documentation:</b>
  <a href="../README.md">🇮🇩 Indonesia</a> |
  <a href="./README.en.md">🇺🇸 English</a>
</p>

---

## ✨ Why Baileys-Joss?

| Feature | Baileys Original | Baileys-Joss |
|---------|:----------------:|:------------:|
| Interactive Buttons | ❌ | ✅ |
| List Messages | ❌ | ✅ |
| Copy Code Button | ❌ | ✅ |
| URL Buttons | ❌ | ✅ |
| LID/SenderPn Plotting | ❌ | ✅ |
| Combined Button Types | ❌ | ✅ |
| Native Flow Messages | ❌ | ✅ |

---

## 📦 Installation

```bash
# Using npm
npm install baileys-joss

# Using yarn
yarn add baileys-joss

# Using pnpm
pnpm add baileys-joss
```

---

## 🎯 Features

### 1. 🎛️ Interactive Messages & Buttons

Complete and easy-to-use interactive button features:

```typescript
import { 
    generateInteractiveButtonMessage,
    generateInteractiveListMessage,
    generateTemplateMessage,
    generateCombinedButtons,
    generateCopyCodeButton,
    generateUrlButtonMessage,
    generateQuickReplyButtons
} from 'baileys-joss'

// Quick Reply Buttons
const quickButtons = generateQuickReplyButtons(
    'Choose an option below:',
    [
        { id: 'btn-1', displayText: '✅ Agree' },
        { id: 'btn-2', displayText: '❌ Decline' },
        { id: 'btn-3', displayText: '📞 Contact Support' }
    ],
    { footer: 'Powered by Baileys-Joss' }
)

await sock.sendMessage(jid, quickButtons)

// URL Button
const urlButton = generateUrlButtonMessage(
    'Visit our website for more information',
    [{ displayText: '🌐 Open Website', url: 'https://example.com' }],
    { title: 'Product Info', footer: 'Click to open' }
)

await sock.sendMessage(jid, urlButton)

// Copy Code Button (for OTP, promo codes, etc.)
const copyButton = generateCopyCodeButton(
    'Your OTP code is:',
    '123456',
    '📋 Copy Code'
)

await sock.sendMessage(jid, copyButton)

// Combined Buttons (mix URL, Reply, Copy, Call)
const combinedButtons = generateCombinedButtons(
    'Choose an action:',
    [
        { type: 'reply', displayText: '🛒 Order Now', id: 'order' },
        { type: 'url', displayText: '🌐 Website', url: 'https://example.com' },
        { type: 'call', displayText: '📞 Call Us', phoneNumber: '+6281234567890' },
        { type: 'copy', displayText: '📋 Copy Promo', copyCode: 'PROMO2024' }
    ],
    { title: 'Main Menu', footer: 'Baileys-Joss' }
)

await sock.sendMessage(jid, combinedButtons)

// List Message
const listMessage = generateInteractiveListMessage({
    title: '📋 Product Menu',
    buttonText: 'View Menu',
    description: 'Please select the product you want',
    footer: 'Type number to order',
    sections: [
        {
            title: 'Food',
            rows: [
                { rowId: 'fried-rice', title: 'Fried Rice', description: '$3.00' },
                { rowId: 'fried-noodles', title: 'Fried Noodles', description: '$2.50' }
            ]
        },
        {
            title: 'Drinks',
            rows: [
                { rowId: 'iced-tea', title: 'Iced Tea', description: '$0.50' },
                { rowId: 'coffee', title: 'Coffee', description: '$1.00' }
            ]
        }
    ]
})

await sock.sendMessage(jid, listMessage)
```

### 2. 📍 LID & SenderPn Plotting

Utilities for managing JID, LID (Linked ID), and senderPn:

```typescript
import { 
    parseJid,
    getSenderPn,
    getCurrentSenderInfo,
    isSelf,
    plotJid,
    normalizePhoneToJid,
    extractPhoneNumber,
    formatJidDisplay,
    isSameUser,
    getJidVariants,
    getRemoteJidFromMessage,
    createJidPlotter
} from 'baileys-joss'

// Get current session info (senderPn)
const senderInfo = getCurrentSenderInfo(sock.authState)
console.log('Phone:', senderInfo.phoneNumber)
console.log('Phone JID:', senderInfo.phoneJid)
console.log('LID:', senderInfo.lid)
console.log('Device ID:', senderInfo.deviceId)
console.log('Name:', senderInfo.pushName)

// Parse JID for complete info
const jidInfo = parseJid('6281234567890@s.whatsapp.net')
console.log('User:', jidInfo.user)
console.log('Is LID:', jidInfo.isLid)
console.log('Is PN:', jidInfo.isPn)
console.log('Device:', jidInfo.device)

// Check if JID is self
const isMe = isSelf(someJid, senderInfo)

// Normalize various phone formats
const jid = normalizePhoneToJid('+62 812-3456-7890') // -> 6281234567890@s.whatsapp.net

// Extract phone number from JID
const phone = extractPhoneNumber('6281234567890@s.whatsapp.net') // -> 6281234567890

// Format for display
const display = formatJidDisplay('6281234567890:1@s.whatsapp.net', {
    showDevice: true,
    showType: true
}) // -> 6281234567890:1 (PN)

// Compare two JIDs
const same = isSameUser('6281234567890@s.whatsapp.net', '6281234567890:1@s.whatsapp.net') // true

// Get sender from message
sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
        const { chatJid, senderJid } = getRemoteJidFromMessage(msg)
        console.log('Chat:', chatJid)
        console.log('Sender:', senderJid)
    }
})

// Advanced: Create plotter with LID mapping support
const plotter = createJidPlotter(
    sock.lidMapping.getLIDForPN.bind(sock.lidMapping),
    sock.lidMapping.getPNForLID.bind(sock.lidMapping)
)

const plotted = await plotter.plotBidirectional('6281234567890@s.whatsapp.net')
console.log('Phone:', plotted.pn)
console.log('LID:', plotted.lid)
```

---

## 🚀 Quick Start

```typescript
import makeWASocket, { 
    useMultiFileAuthState,
    DisconnectReason,
    // Interactive Message features
    generateQuickReplyButtons,
    generateInteractiveListMessage,
    generateCombinedButtons,
    // JID Plotting features
    getCurrentSenderInfo,
    parseJid,
    isSelf
} from 'baileys-joss'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_session')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })
    
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) {
                startBot()
            }
        } else if (connection === 'open') {
            console.log('Connected!')
            
            // Get sender info
            const sender = getCurrentSenderInfo(sock.authState)
            console.log('Logged in as:', sender?.phoneNumber)
        }
    })
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        
        const text = msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || ''
        
        if (text === '/menu') {
            // Send interactive buttons
            const buttons = generateQuickReplyButtons(
                '🤖 Bot Menu\n\nChoose an option:',
                [
                    { id: 'help', displayText: '❓ Help' },
                    { id: 'info', displayText: 'ℹ️ Info' },
                    { id: 'order', displayText: '🛒 Order' }
                ],
                { footer: 'Baileys-Joss Bot' }
            )
            
            await sock.sendMessage(msg.key.remoteJid!, buttons)
        }
    })
}

startBot()
```

---

## 📋 API Reference

### Interactive Messages

| Function | Description |
|----------|-------------|
| `generateInteractiveButtonMessage()` | Create button message with media header |
| `generateInteractiveListMessage()` | Create list message with sections |
| `generateTemplateMessage()` | Create template message (Quick Reply, URL, Call) |
| `generateNativeFlowMessage()` | Create native flow message (latest format) |
| `generateCopyCodeButton()` | Button to copy code |
| `generateUrlButtonMessage()` | Button with URL |
| `generateQuickReplyButtons()` | Quick reply buttons |
| `generateCombinedButtons()` | Combination of various button types |

### JID Plotting

| Function | Description |
|----------|-------------|
| `parseJid()` | Parse JID and extract complete info |
| `getSenderPn()` | Get senderPn from AuthenticationCreds |
| `getCurrentSenderInfo()` | Get current sender info from authState |
| `isSelf()` | Check if JID is self |
| `plotJid()` | Plot JID (basic, without LID mapping) |
| `normalizePhoneToJid()` | Normalize phone number to JID |
| `extractPhoneNumber()` | Extract phone number from JID |
| `formatJidDisplay()` | Format JID for display |
| `isSameUser()` | Compare two JIDs |
| `getJidVariants()` | Get all JID variants from a number |
| `constructJidWithDevice()` | Construct JID with device ID |
| `getRemoteJidFromMessage()` | Get remoteJid from message |
| `createJidPlotter()` | Create plotter with LID mapping support |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💖 Support

If this project helps you, give it a ⭐ on [GitHub](https://github.com/firdausmntp/Baileys-Joss)!

---

## ⚠️ Disclaimer

This project is not affiliated with WhatsApp. Use responsibly and in accordance with WhatsApp's Terms of Service. **Don't spam!**

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details.

---

## 🙏 Credits

- [Baileys Original](https://github.com/WhiskeySockets/Baileys) - Base library
- [WhiskeySockets](https://github.com/WhiskeySockets) - Baileys Maintainer

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/firdausmntp">firdausmntp</a>
</p>
