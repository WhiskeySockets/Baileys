//! Waives outbound counter reservations for protocol operations.
//!
//! The caller persists each changeset before returning ciphertext. Legacy
//! records cannot carry the core's reservation ceiling, so retaining it would
//! burn a batch of counters on every serialization and create skipped keys at
//! the peer. Fresh imports have no reservation until an operation uses them.

use wacore_libsignal::protocol::error::Result as SignalResult;
use wacore_libsignal::protocol::{SenderKeyRecord, SessionRecord};

pub(crate) fn waive_session(mut record: SessionRecord) -> SessionRecord {
    record.waive_counter_lease();
    record
}

pub(crate) fn waive_sender_key(mut record: SenderKeyRecord) -> SignalResult<SenderKeyRecord> {
    record.waive_counter_lease()?;
    Ok(record)
}
