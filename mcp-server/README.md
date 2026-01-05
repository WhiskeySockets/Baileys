# WhatsApp MCP Server

MCP (Model Context Protocol) server that exposes WhatsApp functionality via Baileys library for LLM integration.

## Features

- 🔧 **23 MCP Tools**: Messaging, Contacts, Groups, Connection management
- 📊 **2 Resources**: Connection status, Groups list
- 🚀 **Dual Transport**: Stdio (local) + HTTP (remote/web)
- 🔐 **Persistent Auth**: Session stored locally

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Option 1: Stdio mode (for Claude Desktop)
npm start

# Option 2: HTTP mode (for web deployment)
npm run start:http
```

## Transport Modes

| Mode | Command | Port | Use Case |
|------|---------|------|----------|
| Stdio | `npm start` | - | Claude Desktop, local LLMs |
| HTTP | `npm run start:http` | 3000 | Remote servers, web apps |

## Claude Desktop Configuration

Add to `claude_desktop_config.json`:

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

## HTTP Server

For remote deployment, see [docs/deployment.md](../docs/deployment.md).

```bash
# Development with hot-reload
npm run dev:http

# Production
npm run start:http
```

Endpoints:
- `GET /health` - Health check
- `POST /mcp` - MCP protocol
- `GET /mcp` - SSE notifications

## Documentation

- [Architecture](../docs/architecture.md)
- [MCP Tools Reference](../docs/mcp-tools-reference.md)
- [Getting Started](../docs/getting-started.md)
- [Deployment Guide](../docs/deployment.md)

## Requirements

- Node.js 20+
- WhatsApp account for authentication
