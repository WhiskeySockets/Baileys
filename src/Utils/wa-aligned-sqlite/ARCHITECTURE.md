# WA-Aligned SQLite — Architecture

InfiniteAPI's Phase 9 persistence layer mirrors WhatsApp Android's own
on-disk SQLite layout: **one physical `.db` file per concern**, with
schemas captured verbatim from a paired companion device via Frida runtime
inspection (`com.whatsapp.w4b v2.26.15.8-beta`, 2026-05-27).

## Why mirror WhatsApp Android directly?

Three operational wins, all observed at WA scale (~2700 LID↔PN mappings,
1500 identities, 1200 user devices on a single account):

1. **Lock isolation under load** — a heavy `INSERT INTO jid_map ...`
   write burst from a sync flow does not block point reads on
   `signal_sessions` (which sit on the message-send hot path). With a
   single consolidated DB those would contend on the same WAL writer slot.
2. **Corruption blast radius** — WAL checkpoint corruption on `msgstore.db`
   leaves `creds.db` untouched. A gateway can recover its session
   credentials and restart even if message routing state is hosed.
3. **Schema verifiability** — every column name and type matches WA's own
   schema strings. When something looks wrong, the comparison target is
   one `adb pull` away.

The DEX dump found 27 distinct `.db` filenames referenced in WA Business
code. We capture and mirror **only those active in the gateway hot path**;
the rest (status, backup, migration, multi-account) belong to mobile UX
concerns and are intentionally excluded.

## The five files

```
sessionDir/
├── creds.db        (InfiniteAPI-specific — auth credentials root)
├── axolotl.db      (Signal Protocol — sessions, prekeys, identities, sender_keys)
├── msgstore.db     (JID routing, device cache, quarantine, retry counters)
├── wa.db           (contacts + Trusted Contact tokens)
└── sync.db         (app-state sync — collection_versions, syncd_mutations)
```

Each file carries:

- `journal_mode = WAL` — concurrent readers alongside a single writer
- `synchronous = NORMAL` — fsync at checkpoint boundaries (sufficient for a
  gateway; WA's `FULL` is phone-durability paranoia we don't need)
- `busy_timeout = 5000` — internal wait before SQLITE_BUSY
- WA-aligned tables created via `CREATE TABLE IF NOT EXISTS` on every open

`extraPragmas` lets ops layer further tuning (e.g. `cache_size = -8000`,
`mmap_size = 268435456`) without forking the adapter.

## Phase roadmap

This directory ships the **skeleton** — files exist, schemas materialize,
and `useWaAlignedSqliteAuthState` works as a drop-in replacement for
`useSqliteAuthState`. Component-level integrations follow:

### Phase 9.0 (this PR) — Skeleton
- `WaAlignedSqliteStore` opens all 5 files
- `useWaAlignedSqliteAuthState` routes:
  - auth creds → `creds.db.creds(key, value, updated_at)`
  - signal data → `axolotl.db.signal_kv(type, id, value)` (opaque)
- Typed tables (`signal_sessions`, `jid_map`, etc.) created and indexed
  but **not yet populated** — they wait for the integrations below.

### Phase 9.1 — `LIDMappingStore` → `msgstore.jid_map`
**Replaces:** the in-RAM `Map<lid, pn>` plus `Map<pn, lid>` pair.
**Schema target:** `msgstore.jid_map(lid_row_id, jid_row_id, sort_id)` joined
with `msgstore.jid(_id, user, server, agent, device, type, raw_string)`.
**Insight:** WA stores both addressing forms as rows in `jid` and uses
`jid_map` as the lookup table. ~2700 mappings in a real account — that's
the RAM we shed from the gateway.

### Phase 9.2 — `userDevicesCache` → `msgstore.user_device(_info)`
**Replaces:** the in-RAM device list cache.
**Schema target:** `msgstore.user_device(user_jid_row_id, device_jid_row_id, key_index)`
+ `msgstore.user_device_info(user_jid_row_id, raw_id, timestamp, expected_timestamp)`.
**Insight:** WA's `user_device_info.expected_timestamp` gives a **native TTL**
column — no application-level eviction loop needed.

### Phase 9.3 — `msgRetryCounterCache` → `msgstore.message_orphaned_edit`
**Replaces:** the in-RAM retry counter.
**Schema target:** `msgstore.message_orphaned_edit(message_row_id, key_id,
from_me, chat_id, sender_id, retry_count, last_attempt)` with `UNIQUE
(key_id, from_me, chat_id, sender_id)` matching the natural key Baileys
uses for retry dedup.

### Phase 9.4 — Bad MAC quarantine → `msgstore.message_quarantine`
**Replaces:** the in-RAM ring buffer InfiniteAPI uses today.
**Schema target:** `msgstore.message_quarantine(... original_protobuf BLOB,
serialized_stanza BLOB, failure_reason, quarantined_at)`. Critical
property: **survives restart** — Bad MAC stanzas captured for forensic
replay or out-of-order retry don't vanish on gateway crash.

### Phase 9.5 — `signal_kv` → typed Signal Protocol tables
**Migrates** the opaque `axolotl.db.signal_kv(type, id, value)` row set
into the WA-aligned typed tables:
- `signal_sessions(recipient_id, device_id, recipient_account_type, record BLOB)`
- `signal_prekeys(prekey_id PK, record BLOB, consumed_at)`
- `signal_signed_prekeys(prekey_id PK, record BLOB, created_at)`
- `signal_kyber_prekeys(prekey_id PK, record BLOB, created_at, is_one_time)`
- `signal_identities(recipient_id, recipient_account_type, public_key BLOB, trust_level, first_seen)`
- `signal_sender_keys(group_id, sender_id, device_id, record BLOB)`

**Identity dual-storage:** WA writes each contact's identity TWICE — LID
(`recipient_account_type=1`) and PN (`recipient_account_type=0`), ~12 ms
apart. We mirror that column so identity lookups by either addressing
form land in a single row without a join.

**PreKey deletion is IMMEDIATE in WA** — no grace period (Frida observed
~33 ms after session establishment). InfiniteAPI's 5-minute grace remains
more lenient; the typed schema doesn't force a behavior change.

### Phase 9.6 — TC tokens → `wa.wa_trusted_contacts(_send)`
**Replaces:** trusted-contact-token storage scattered in creds JSON.
**Schema target:** `wa_trusted_contacts(jid, incoming_tc_token BLOB,
incoming_tc_token_timestamp)` + `wa_trusted_contacts_send(jid,
sent_tc_token_timestamp, real_issue_timestamp)`.

### Phase 9.7 — App-state sync → `sync.collection_versions` + `syncd_mutations`
**Replaces:** the multi-file blob storage for app-state sync.
**Schema target:** mirrors WA's `sync.db` exactly so we get the same
ordered mutation log (1576 prod rows observed) plus per-collection
version tracking (5 collections in prod).

## Backwards compatibility

`useWaAlignedSqliteAuthState` is **additive** — it does not replace
`useSqliteAuthState` or `useMultiFileAuthState`. Existing deployments stay
on their current backend until they choose to migrate via
`migrateAuthState` (Phase 9.8 — to be wired once the typed tables are
populated by phases 9.1–9.7).

## Source of truth

The schemas in `schemas/` were captured via Frida runtime inspection
(see `memory/wa_android_sqlite_master_reference.md`). They are the
authoritative source for column names, types, defaults, and indexes.

Captured DBs verbatim in `memory/wa-android-sqlite/*.sql` (msgstore_db.sql,
axolotl_db.sql, wa_db.sql, sync_db.sql, and 10 others). When in doubt
about whether a column matches WA's, the `.sql` files win.

## Concurrency contract

- **point reads** via prepared statements — constant time, no transaction
- **`set()`** runs as a single `BEGIN IMMEDIATE` ... `COMMIT` on the
  affected DB file; the multi-type payload commits atomically or rolls
  back the whole call
- **SQLITE_BUSY** on the BEGIN IMMEDIATE retries up to `MAX_BUSY_ATTEMPTS`
  (5) with jittered exponential backoff (base 25 ms, factor 2)
- **`clear()`** is a single DELETE — serializes naturally under WAL
- **`list`/`listIds`** stream via `better-sqlite3`'s `.iterate()` so they
  do not block the single writer

## Lifecycle

- `useWaAlignedSqliteAuthState({ sessionDir })` opens all 5 handles
- The returned `close()` closes every handle in order; safe to call twice
- After `close()`, the same `sessionDir` can be reopened to resume
- File locking: each `.db` carries its own WAL — independent locks across
  the 5 files, hence the isolation properties stated above
