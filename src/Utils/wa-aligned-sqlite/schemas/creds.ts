/**
 * Schema for `creds.db` — InfiniteAPI-specific root DB holding auth creds
 * (single row JSON-encoded, mirrors the legacy `creds.json` from
 * useMultiFileAuthState) + opaque key-value store for any signal data that
 * doesn't fit a typed table.
 *
 * WhatsApp Android doesn't have a direct equivalent — the equivalent state
 * lives across `Properties` rows in `msgstore.db` + native keystore. For a
 * gateway it's clearest to keep auth creds in their own file so a single
 * `creds.db` corruption doesn't take down the entire session.
 */
export const CREDS_SCHEMA = `
CREATE TABLE IF NOT EXISTS creds (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS app_state_sync_keys (
  key_id TEXT PRIMARY KEY,
  value BLOB NOT NULL,
  created_at INTEGER NOT NULL
);
`
