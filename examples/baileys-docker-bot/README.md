# Baileys Docker Bot Example

Run a minimal WhatsApp bot (Baileys) inside Docker. First run prints a QR in the logs; scan it from WhatsApp > Linked Devices.

## Prerequisites
- Docker and Docker Compose v2

## Usage

```bash
cd examples/baileys-docker-bot
# Build and start
docker compose up --build
# If you started detached, follow logs to see the QR
# docker compose up --build -d && docker compose logs -f
```

- On first run, a QR code appears in the container logs. Scan it from WhatsApp (Linked Devices).
- Auth state is persisted in `./auth` on your host via a bind-mount.
- To test, message `!ping` to the linked account; the bot replies with `pong`.

## Re-authenticating
If you see `status=401`, delete the `auth` folder and start again to relink.

## Notes
- Uses Node.js 20 Alpine base image.
- Uses Baileys multi-file auth to persist credentials across restarts.
- Keep this example isolated; it doesn't modify the library source.