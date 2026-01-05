# Environment Variables Reference

This document details all the environment variables used to configure the Baileys WhatsApp MCP Server.

You can set these variables in your system environment or in a `.env` file in the root directory.

## Core Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | The port on which the HTTP server allows connections. | `3000` | No |
| `HOST` | The network interface to bind the server to. Use `0.0.0.0` to listen on all interfaces (required for Docker/VPS). | `0.0.0.0` | No |
| `LOG_LEVEL` | Controls the verbosity of the logs. Options: `debug`, `info`, `warn`, `error`. | `info` | No |
| `NODE_ENV` | Application environment. If set to `production`, logs are JSON formatted; otherwise, they are pretty-printed. | `development` | No |

## Database Configuration (Supabase/PostgreSQL)

These settings are required if `USE_DATABASE=true`.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `USE_DATABASE` | Set to `true` to enable database storage for sessions and credentials. If `false`, filesystem storage is used. | `false` | No |
| `DATABASE_URL` | The PostgreSQL connection string used by the application (usually with connection pooling). | - | Yes (if DB on) |
| `DIRECT_URL` | The direct PostgreSQL connection string used for Prisma migrations. | - | Yes (if DB on) |

## Filesystem Storage (Legacy/Development)

These settings apply when `USE_DATABASE` is not set or `false`.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `AUTH_DIR` | The base directory where WhatsApp authentication files will be stored. A subdirectory strictly named after the `sessionId` will be created inside this folder. | `./baileys_auth_info` | No |

## Example `.env` File

```env
# Server Config
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# Database Config (Recommended for Production)
USE_DATABASE=true
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# Filesystem Config (Alternative to Database)
# AUTH_DIR="/absolute/path/to/storage"
```
