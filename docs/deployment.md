# Web Deployment Guide

This guide covers deploying the WhatsApp MCP Server as a web service.

## Overview

The MCP server supports two transport modes:

| Mode | Command | Use Case |
|------|---------|----------|
| **Stdio** | `npm start` | Local LLM apps (Claude Desktop) |
| **HTTP** | `npm run start:http` | Remote/web deployment |

---

## HTTP Server Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check + WhatsApp status |
| `POST` | `/mcp` | MCP protocol messages |
| `GET` | `/mcp` | SSE notifications (with session) |
| `DELETE` | `/mcp` | Close session |

---

## Local Development

```bash
# Run with hot-reload
npm run dev:http

# Or production mode
npm run build && npm run start:http
```

Server starts at: `http://localhost:3000`

---

## Docker Deployment

### Build Image

```bash
cd mcp-server
npm run build
docker build -t whatsapp-mcp .
```

### Run Container

```bash
docker run -d \
  --name whatsapp-mcp \
  -p 3000:3000 \
  -v $(pwd)/auth_info:/app/auth_info \
  whatsapp-mcp
```

> **Note**: Mount `auth_info` volume to persist WhatsApp session.

### First Authentication

```bash
# View QR code in logs
docker logs -f whatsapp-mcp
```

Scan QR code with WhatsApp on your phone.

---

## Cloud Deployment

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `LOG_LEVEL` | `info` | Logging level |

### Cloud Platforms

#### Railway / Render / Fly.io

1. Push to Git repository
2. Connect repository to platform
3. Set build command: `npm run build`
4. Set start command: `npm run start:http`
5. Add persistent volume for `/app/auth_info`

#### Docker Compose

```yaml
version: '3.8'
services:
  whatsapp-mcp:
    build: ./mcp-server
    ports:
      - "3000:3000"
    volumes:
      - whatsapp-auth:/app/auth_info
    environment:
      - PORT=3000
      - LOG_LEVEL=info
    restart: unless-stopped

volumes:
  whatsapp-auth:
```

---

## Connecting Clients

### From Remote LLM

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const client = new Client({ name: 'my-app', version: '1.0.0' });

const transport = new StreamableHTTPClientTransport(
  new URL('https://your-server.com/mcp')
);

await client.connect(transport);

// Use tools
const result = await client.callTool({
  name: 'whatsapp_send_text',
  arguments: { jid: '1234567890@s.whatsapp.net', text: 'Hello!' }
});
```

---

## Security Considerations

> ⚠️ **Important**: This server has full WhatsApp access.

- Use HTTPS in production (reverse proxy)
- Add authentication layer (API key, JWT)
- Restrict network access (firewall/VPN)
- Never expose publicly without auth
