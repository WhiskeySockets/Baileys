# Security Policy

## Reporting a Vulnerability

**Do not file security issues as public GitHub issues, Discord posts, or PRs.** A public report is itself an exploit broadcast — many downstream projects pull Baileys directly from `master` or from `github:WhiskeySockets/Baileys`, so a vulnerable version is in the wild within minutes.

Use either of these private channels:

1. **Preferred:** [GitHub Security Advisories](https://github.com/WhiskeySockets/Baileys/security/advisories/new) on this repository. This gives us a private workspace to coordinate the fix, draft a CVE, and notify downstream projects.
2. **Email:** **rajeh@reforward.dev** — Rajeh Taher, current maintainer. Use this if GitHub Advisories is unavailable, or if the report involves the maintainer's keys / accounts directly.

If you don't get an acknowledgement within **72 hours**, please re-send — mail filtering does occasionally swallow security reports.

## What to include

A useful report contains:

- **Affected versions** (commit SHA or release tag)
- **Component**: socket, signal/crypto, auth state, message decoding, media handling, etc.
- **Impact**: what an attacker can do (read messages, hijack sessions, impersonate, DoS, etc.) and under what preconditions
- **Reproduction**: minimal code, captured stanza, or a deterministic test case. If repro requires a paired account or live connection, describe the setup instead — don't attach session state.
- **Suggested fix** (optional but appreciated)

If a fix touches the wire protocol or signal-protocol session state, please flag that explicitly — those changes need extra coordination because they affect persisted state on every downstream user.

## What we treat as a vulnerability

In scope:

- Auth state / key store leakage or downgrade
- Session, prekey, or sender-key handling that lets a remote party impersonate, replay, or decrypt outside the intended audience
- Memory corruption / RCE via crafted stanzas, media, or protobuf payloads
- Logic bugs that bypass intended access controls (e.g., reading messages from chats the local account isn't part of)
- Vulnerabilities in dependencies that are reachable through Baileys' public API
- Information disclosure (PII, message content, JIDs/phone numbers, tokens) through logs or error messages on default configurations

Out of scope (please file as regular issues or PRs):

- Bugs that only affect availability of the local process (a malformed input that throws an exception in your handler is not a CVE; a malformed input that lets a remote party crash any Baileys client is)
- Issues in third-party WhatsApp clones or forks of Baileys
- Behavior of WhatsApp itself — we don't control the server; report those to Meta
- Missing rate limiting in *your* application — Baileys doesn't add rate limiting on top of WhatsApp's
- Reports that boil down to "the library can be misused for spam." See `CODE_OF_CONDUCT.md` § Project-Specific Conduct; that's a contributions matter, not a vulnerability.

## Coordinated disclosure

Our default timeline:

| Day | Step |
|---|---|
| 0 | Report received, acknowledged within 72h |
| ≤ 7 | Initial assessment shared with reporter; severity and rough timeline agreed |
| ≤ 30 | Fix prepared on a private branch; reporter invited to validate if they want |
| Coordinated date | Fix merged, release published, advisory + CVE published |

If you need to disclose sooner (e.g., active exploitation in the wild), tell us — we'll prioritize accordingly. If a fix is taking longer than 30 days, we'll keep you updated and explain why.

We're happy to credit reporters in the advisory. Tell us how you'd like to be credited (name, handle, organization) or if you'd prefer to remain anonymous.

## Supported versions

Security fixes are backported to the **latest minor release line**. Older majors (≤ 6.x) are unmaintained — please upgrade. The `master` branch is also patched immediately, but downstream pinning to `master` is at your own risk for stability.

| Version | Supported |
|---|---|
| `7.x` (current) | ✅ |
| `< 7.0` | ❌ |

## Operational security for users

A few notes for downstream users — these aren't vulnerabilities in Baileys, but they are common ways production systems leak:

- **`baileys_auth_info/` is equivalent to a long-lived credential.** Store it like an SSH private key. Don't commit it. Don't put it in container images. Encrypt it at rest if you can.
- **Logs leak.** The default logger emits debug-level information that includes JIDs and message metadata. Set `level: 'silent'` or filter aggressively in production.
- **Don't paste auth state into AI tools, screenshots, or support tickets.** It's not redactable — anyone with the directory contents can hijack the session.
- **Pin a release.** Pulling `github:WhiskeySockets/Baileys` always grabs `master`. Use a tagged release in production.

For non-security questions, see Discord (https://discord.gg/WeJM5FP9GG) or the wiki (https://baileys.wiki).
