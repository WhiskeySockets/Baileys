# Live message-edit smoke

Run the manual message-edit smoke from an interactive terminal:

```bash
yarn smoke:live:edit
```

The command creates a linked-device session in an operating-system temporary directory and displays its QR code.
The pairing is retained by default for eight hours after the last run, so repeated runs during one development
session normally reconnect without another QR scan. After the connection opens, follow the two prompts:

1. From your phone's WhatsApp account, which must be separate from the account paired to the smoke client, type and
   send the exact synthetic message shown in the terminal, either in a direct chat with the paired account or in a
   group containing both accounts. Messages sent from the paired account itself are ignored.
2. Edit that same message to different synthetic text and save it.

The command reports the original and edited text, then exits successfully only if the encrypted edit path requested
the original message and emitted a readable `messages.update` event for the same message ID.

This command is manual, requires a TTY, and refuses to run in CI. It stores the original message only in memory.
The smoke lookup matches the original ID, conversation, direction, and group sender, accepting only PN/LID aliases
recorded with that original. Downstream `getMessage` implementations must also check `id`, `remoteJid`, and `fromMe`,
using trusted stored addressing or mappings to resolve PN/LID aliases, because the same callback supplies content
for retry/resend requests. An ID-only lookup can return another conversation's message for resend.
Preserve `messageContextInfo.messageSecret` when storing originals. If the original or its secret is unavailable
(for example, it was never persisted or predates pairing), the encrypted edit is skipped without a decrypted update.

Authentication state is isolated per checkout outside the repository. Its directory is restricted to the current
operating-system user, contained files are restricted to that user, symlinks are rejected, and concurrent runs are
blocked by an exclusive loopback TCP listener held for the run's lifetime. The operating system releases the lock
on exit, including crashes; obsolete PID lock files are no longer used. The port is derived from the canonical session directory, so filesystem aliases share a lock.
If another local service or a different checkout occupies that port, the run stops safely and reports the port number.
Stop any smoke runs using the same checkout before switching between versions of this tool.
After eight idle hours the next run deletes the local state and requests a new pairing. The old linked-device
entry may remain visible on the phone after local expiry and can be removed there.

Connection failures report the disconnect reason. Invalid sessions, competing connections, account restrictions,
and client compatibility errors stop immediately with recovery instructions; transient failures still retry. A competing
connection does not discard retained credentials. Only a logged-out retained pairing is reset automatically.

Socket protocol logging is disabled by default. Set `SMOKE_LOG_LEVEL` to a Pino level such as `debug` only when
diagnosing a failed run. Protocol diagnostics can include account identifiers and payload metadata, so do not
capture or share that output.

Use dedicated test accounts and synthetic text. Do not capture or share the QR code, authentication directory, phone
numbers, message secrets, or protocol payloads. Filesystem permissions do not protect against malware or other
processes already running as the same operating-system user, or against an administrator.
