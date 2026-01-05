# WhatsApp MCP Server - Architecture

## Overview

This document describes the architecture of the WhatsApp MCP Server, a Model Context Protocol server that exposes WhatsApp functionality via the Baileys library to LLM applications.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LLM Application                          │
│                    (Claude, GPT, etc.)                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │ MCP Protocol (stdio/JSON-RPC)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MCP Server Layer                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  StdioServerTransport                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      McpServer                            │  │
│  │  ┌─────────────┬─────────────┬─────────────┬──────────┐  │  │
│  │  │  Messaging  │    Chat     │    Group    │  Profile │  │  │
│  │  │    Tools    │   Tools     │    Tools    │  Tools   │  │  │
│  │  └─────────────┴─────────────┴─────────────┴──────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │   Connection    │ │     Message     │ │      Group      │   │
│  │    Service      │ │     Service     │ │     Service     │   │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘   │
│           │                   │                   │             │
│  ┌────────┴───────────────────┴───────────────────┴────────┐   │
│  │                      Auth Service                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Domain Layer (Baileys)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   makeWASocket                            │  │
│  │  ┌─────────────┬─────────────┬─────────────┬──────────┐  │  │
│  │  │   Socket    │   Signal    │   Binary    │  Proto   │  │  │
│  │  │   Layer     │  Protocol   │   Parser    │  Defs    │  │  │
│  │  └─────────────┴─────────────┴─────────────┴──────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WhatsApp Infrastructure                      │
│                    (WhatsApp Web Servers)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### MCP Server Layer

The entry point for LLM communication using the Model Context Protocol.

- **StdioServerTransport**: Handles JSON-RPC 2.0 communication over stdin/stdout
- **McpServer**: Registers and manages all tools and resources
- **Tools**: Exposed functions that LLMs can call (see [tools reference](./mcp-tools-reference.md))

### Application Layer

Business logic and orchestration services.

| Service | Responsibility |
|---------|----------------|
| **ConnectionService** | Singleton managing WhatsApp socket lifecycle |
| **AuthService** | Session credentials and authentication state |
| **MessageService** | Send, read, delete, forward messages |
| **GroupService** | Group creation and management |
| **ContactService** | Contact lookups and profile queries |

### Domain Layer (Baileys)

The existing Baileys library providing WhatsApp Web protocol implementation.

- Used as a dependency, not modified
- Provides `makeWASocket` factory function
- Handles encryption, binary protocol, WebSocket communication

## Design Principles

### SOLID

- **Single Responsibility**: Each service handles one domain area
- **Open/Closed**: Tools can be added without modifying existing ones
- **Liskov Substitution**: Services implement consistent interfaces
- **Interface Segregation**: Tools expose minimal required parameters
- **Dependency Inversion**: Services depend on abstractions

### Clean Architecture

- **Independence**: Business logic doesn't depend on MCP framework
- **Testability**: Services can be unit tested with mocked socket
- **Flexibility**: Transport layer can be swapped (stdio → HTTP)

## Data Flow

### Tool Execution Flow

```
1. LLM sends tool call request → StdioTransport
2. McpServer routes to registered tool handler
3. Tool validates input (Zod schema)
4. Tool calls appropriate Service method
5. Service uses ConnectionService to get socket
6. Socket executes Baileys operation
7. Result flows back through layers
8. Tool formats response for LLM
```

### Event Flow (Future Enhancement)

```
WhatsApp Event → Baileys Socket
            ↓
    ConnectionService (listener)
            ↓
    Resource Update / Notification
            ↓
    MCP Server → LLM
```

## Security Considerations

1. **Auth State Storage**: Credentials stored locally in configurable directory
2. **No Secrets in MCP**: Auth handled internally, not exposed as tools
3. **Input Validation**: All tool inputs validated with Zod schemas
4. **Error Handling**: Baileys errors wrapped and sanitized

## Future Extensibility

- ✅ ~~**HTTP Transport**: Add StreamableHTTP for remote server deployment~~ (Implemented)
- ✅ ~~**Webhooks**: Push notifications for real-time events~~ (Implemented)
- **Message Store**: Optional persistence layer for message history
- **Multi-Session**: Support multiple WhatsApp accounts
