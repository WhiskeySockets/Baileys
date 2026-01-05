# Getting Started with WhatsApp MCP Server

This guide covers everything you need to know to set up, run, debug, and use the WhatsApp MCP Server.

## 📋 Prerequisites

- **Node.js**: Version 20 or higher.
- **npm** or **yarn**.
- **WhatsApp**: A real WhatsApp account on a mobile phone (for pairing).
- **Database (Optional)**: PostgreSQL/Supabase if running in database mode.

---

## 🚀 Installation & Setup

### 1. Install Dependencies

Navigate to the server directory and install packages:

```bash
cd mcp-server
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

**Key Environment Variables:**

- `LOG_LEVEL`: Set to `debug` for detailed logging.
- `USE_DATABASE`: Set to `true` to use PostgreSQL/Supabase (requires `DATABASE_URL`).
- `DATABASE_URL`: Connection string (e.g., `postgresql://user:pass@host:5432/db`).

### 3. Build the Server

Compile the TypeScript code:

```bash
npm run build
```

---

## 🐛 Running in Debug Mode

There are two primary ways to run and debug the server:

### Option A: VS Code Debugger (Recommended)

1. Create a `.vscode/launch.json` file in the root of your project:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug MCP Server",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/mcp-server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug with MCP Inspector",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/mcp-server",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["@modelcontextprotocol/inspector", "tsx", "src/index.ts"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

2. Go to the **Run and Debug** tab in VS Code.
3. Select **"Debug MCP Server"** to just run the server.
4. Select **"Debug with MCP Inspector"** to launch the interactive Inspector UI.

### Option B: MCP Inspector (Interactive UI)

The MCP Inspector is the best way to verify your server and test tools individually without a full client like Claude.

```bash
# In mcp-server directory
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

This will open a web interface (usually at http://localhost:5173) where you can:
- View all registered tools.
- Execute tools with custom JSON input.
- See logs and connection status.

---

## 📲 Usage Guide

### 1. Initial Authentication

When you first start the server (via `npm start`, `npm run dev`, or Inspector), it will attempt to connect to WhatsApp.

**If not authenticated:**
1. Check the console logs.
2. A **QR Code** will be displayed in the terminal.
3. Open WhatsApp on your phone.
4. Go to **Settings > Linked Devices > Link a Device**.
5. Scan the QR code.

> **Note:** If using the MCP Inspector or Claude Desktop, you might need to check the underlying server logs to see the QR code.

### 2. Verifying Connection

Use the `whatsapp_connection_status` tool to check if you are connected:

```json
// Tool Input
{}

// Expected Output
{
  "status": "connected",
  "isConnected": true,
  "sessionInfo": {
    "id": "...",
    "name": "Your Name",
    "phoneNumber": "..."
  }
}
```

### 3. Using Tools

Here are examples of how to use common tools via JSON input (in Inspector or Claude):

**Send a Text Message:**
```json
// Tool: whatsapp_send_text
{
  "jid": "1234567890@s.whatsapp.net",
  "text": "Hello! Sending this via MCP."
}
```

**Check a Phone Number:**
```json
// Tool: whatsapp_check_number
{
  "phoneNumber": "15551234567"
}
```

**Send a Reaction:**
```json
// Tool: whatsapp_send_reaction
{
  "jid": "1234567890@s.whatsapp.net",
  "messageId": "BAE5F...",
  "emoji": "👍"
}
```

---

## 🔌 Integration with Claude Desktop

To use this server with the Claude Desktop app:

1. Open your config file:
   - **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "whatsapp": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/Baileys-wa-mcp/mcp-server/lib/index.js"],
      "env": {
        "USE_DATABASE": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```
*Make sure to replace `/ABSOLUTE/PATH/TO/...` with the actual path on your machine.*

3. Restart Claude Desktop. The 🔌 icon should appear, indicating the server is active.

---

## 🛠 Troubleshooting

**"Logged Out" Error:**
If the session becomes invalid:
1. Stop the server.
2. Delete the `auth_info` folder (or clear the database session).
3. Restart and re-scan the QR code.

**QR Code Not Scanning:**
- Ensure your terminal has a dark background (QR codes invert on light backgrounds).
- Try resizing the terminal window.

**Connection Flapping:**
- Ensure only one instance of the server is running.
- Multi-device login conflicts can occur if you run multiple MCP instances with the same session.

