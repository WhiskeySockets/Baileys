/**
 * Schema for `msgstore.db` — WA-aligned message routing / device cache /
 * retry / quarantine.
 *
 * Gateway scope: we do NOT mirror the full 292-table msgstore.db that the
 * WhatsApp Android client uses for chat history rendering. We only mirror
 * the tables that solve operational pain points in InfiniteAPI:
 *
 *   - `jid_map` — LID↔PN bidirectional mapping (replaces in-RAM
 *     `LIDMappingStore`; 2708 prod rows observed at WA scale)
 *   - `user_device` + `user_device_info` — companion device list with native
 *     TTL via `expected_timestamp` (replaces in-RAM `userDevicesCache`)
 *   - `primary_device_version` — short-circuits device list refetch
 *   - `message_quarantine` — Bad MAC stanzas survive restart for forensic
 *     replay (replaces in-RAM quarantine ring buffer)
 *   - `message_orphaned_edit` — InfiniteAPI's `msgRetryCounterCache`
 *     persistence target (UNIQUE on the natural key)
 *
 * Column names + types match the WA Android schema verbatim where possible.
 */
export const MSGSTORE_SCHEMA = `
CREATE TABLE IF NOT EXISTS jid (
  _id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  server TEXT NOT NULL,
  agent INTEGER NOT NULL DEFAULT 0,
  device INTEGER NOT NULL DEFAULT 0,
  type INTEGER NOT NULL DEFAULT 0,
  raw_string TEXT NOT NULL,
  UNIQUE(raw_string)
);

CREATE INDEX IF NOT EXISTS jid_by_user_server ON jid (user, server);

CREATE TABLE IF NOT EXISTS jid_map (
  lid_row_id INTEGER PRIMARY KEY,
  jid_row_id INTEGER NOT NULL,
  sort_id INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (lid_row_id) REFERENCES jid(_id) ON DELETE CASCADE,
  FOREIGN KEY (jid_row_id) REFERENCES jid(_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS jid_map_by_pn ON jid_map (jid_row_id);

CREATE TABLE IF NOT EXISTS user_device (
  user_jid_row_id INTEGER NOT NULL,
  device_jid_row_id INTEGER NOT NULL,
  key_index INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_jid_row_id, device_jid_row_id)
);

CREATE INDEX IF NOT EXISTS user_device_by_user ON user_device (user_jid_row_id);

CREATE TABLE IF NOT EXISTS user_device_info (
  user_jid_row_id INTEGER PRIMARY KEY,
  raw_id INTEGER NOT NULL DEFAULT 0,
  timestamp INTEGER NOT NULL,
  expected_timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS primary_device_version (
  user_jid_row_id INTEGER PRIMARY KEY,
  version INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS message_orphaned_edit (
  message_row_id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_id TEXT NOT NULL,
  from_me INTEGER NOT NULL,
  chat_id TEXT NOT NULL,
  sender_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt INTEGER NOT NULL,
  UNIQUE(key_id, from_me, chat_id, sender_id)
);

CREATE INDEX IF NOT EXISTS message_orphaned_edit_by_chat
  ON message_orphaned_edit (chat_id);

CREATE TABLE IF NOT EXISTS message_quarantine (
  message_row_id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_id TEXT NOT NULL,
  from_me INTEGER NOT NULL DEFAULT 0,
  chat_id TEXT NOT NULL,
  sender_id TEXT,
  original_protobuf BLOB,
  serialized_stanza BLOB,
  failure_reason TEXT,
  quarantined_at INTEGER NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(key_id, from_me, chat_id, sender_id)
);

CREATE INDEX IF NOT EXISTS message_quarantine_by_chat
  ON message_quarantine (chat_id);
`
