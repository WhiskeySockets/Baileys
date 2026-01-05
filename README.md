# WhatsApp MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server that enables LLM applications to interact with WhatsApp through the Baileys library.

## Features

- 📱 **WhatsApp Integration** - Send and receive WhatsApp messages through MCP
- 🔐 **Session Management** - QR code and pairing code authentication
- 💬 **Message Tools** - Send text, media, and interactive messages
- 👥 **Group Management** - Create groups, manage participants
- 📞 **Contact Operations** - Check contacts, get profile info
- 🗄️ **Database Support** - Optional Prisma integration for persistent sessions

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Installation

```bash
cd mcp-server
npm install
```

### Configuration

Copy the environment template:

```bash
cp .env.template .env
```

Edit `.env` with your settings. See [Environment Variables](docs/env-variables.md) for details.

### Running

**STDIO Mode** (for MCP clients like Claude Desktop):

```bash
npm run build
npm start
```

**HTTP Mode** (for web applications):

```bash
npm run build
npm run start:http
```

**Development Mode**:

```bash
npm run dev       # STDIO with hot reload
npm run dev:http  # HTTP with hot reload
```

## Documentation

| Document                                           | Description                  |
| -------------------------------------------------- | ---------------------------- |
| [Getting Started](docs/getting-started.md)         | Setup guide and first steps  |
| [Architecture](docs/architecture.md)               | System design and components |
| [MCP Tools Reference](docs/mcp-tools-reference.md) | Complete API documentation   |
| [Environment Variables](docs/env-variables.md)     | Configuration options        |
| [Webhooks](docs/webhooks.md)                       | Event notifications setup    |
| [Deployment](docs/deployment.md)                   | Production deployment guide  |

## MCP Client Configuration

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "whatsapp": {
      "command": "node",
      "args": ["/path/to/mcp-server/lib/index.js"]
    }
  }
}
```

## Project Structure

```
├── mcp-server/          # MCP Server implementation
│   ├── src/             # TypeScript source code
│   ├── prisma/          # Database schema (optional)
│   └── lib/             # Compiled JavaScript
├── docs/                # Documentation
└── starting_point/      # Original Baileys library (reference)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Credits

Built on top of [Baileys](https://github.com/WhiskeySockets/Baileys) by WhiskeySockets.

Original Baileys library copyright © 2025 Rajeh Taher/WhiskeySockets.

---

> **Disclaimer**: This project is not affiliated with WhatsApp. Use responsibly and in accordance with WhatsApp's Terms of Service.
