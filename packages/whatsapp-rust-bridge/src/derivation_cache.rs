//! Keeps the XEdDSA derivations that a sender-key record cannot keep for us.
//!
//! `SenderKeyState` memoizes the signing key's basepoint multiplication and the
//! verifier's Edwards entries, but the memo lives in the record. This crate
//! rebuilds the record from storage on every operation, so the memo is always
//! cold and every message repays a derivation that never changes.
//!
//! Keeping the record alive instead would be the obvious fix and is the wrong
//! one: the record would go stale the moment anything else rotated the key, and
//! an encrypt under a chain the peer already dropped is worse than a slow one.
//! Keying on the signing key's public bytes has no such window. A rotated key
//! is a different entry by construction, and a stale entry is unreachable
//! rather than wrong.
//!
//! The core takes the derivations back through `prewarm_*`, which verify that
//! what they are handed belongs to the state before installing it, so a wrong
//! entry here cannot become a signature under the wrong key.

use std::cell::RefCell;
use std::collections::HashMap;

use wacore_libsignal::core::curve::PreparedVerifyingKey;
use wacore_libsignal::protocol::{PrivateKey, SenderKeyRecord};

/// Entries are ~200 bytes and a live conversation touches a handful of senders,
/// so this is far above any working set while staying bounded. On overflow the
/// map is cleared rather than evicted one by one: picking a victim needs
/// bookkeeping this does not otherwise carry, and the cost of being wrong is
/// one derivation per active sender, paid once.
const MAX_ENTRIES: usize = 256;

#[derive(Clone)]
struct Derivations {
    verifier: PreparedVerifyingKey,
    /// Absent for a sender key received from someone else, which has no private
    /// half to sign with.
    signing: Option<PrivateKey>,
}

thread_local! {
    static CACHE: RefCell<HashMap<[u8; 33], Derivations>> = RefCell::new(HashMap::new());
}

/// Hand the record whatever has already been derived for its signing key, and
/// remember what it had to derive itself.
///
/// Failures are silent by design: this is a cache, and a record it cannot read
/// is one the caller is about to fail on for a better reason.
pub(crate) fn warm(record: &SenderKeyRecord) {
    let Ok(state) = record.sender_key_state() else {
        return;
    };
    let Ok(public) = state.signing_key_public() else {
        return;
    };
    let key = public.serialize();

    let hit = CACHE.with(|cache| cache.borrow().get(&key).cloned());
    if let Some(derivations) = hit {
        let _ = state.prewarm_verifying_key(derivations.verifier);
        if let Some(signing) = derivations.signing {
            let _ = state.prewarm_signing_key(signing);
        }

        return;
    }

    // A miss derives both halves even though one operation uses one of them.
    // That is one wasted derivation per sender, against one per message.
    let Ok(verifier) = state.signing_key_verifier() else {
        return;
    };
    let derivations = Derivations {
        verifier: verifier.clone(),
        signing: state.signing_key_private().ok(),
    };

    CACHE.with(|cache| {
        let mut cache = cache.borrow_mut();
        if cache.len() >= MAX_ENTRIES {
            cache.clear();
        }

        cache.insert(key, derivations);
    });
}

#[cfg(test)]
pub(crate) fn reset() {
    CACHE.with(|cache| cache.borrow_mut().clear());
}

#[cfg(test)]
pub(crate) fn len() -> usize {
    CACHE.with(|cache| cache.borrow().len())
}

#[cfg(test)]
mod tests {
    use super::*;
    use wacore_libsignal::protocol::KeyPair;
    use wasm_bindgen_test::wasm_bindgen_test;

    fn keys() -> KeyPair {
        KeyPair::generate(&mut rand::make_rng::<rand::rngs::StdRng>())
    }

    /// Round-tripped through its serialized form, which is what leaves the memo
    /// cold: a record built in place would already carry a warm one.
    fn record_with(pair: &KeyPair, with_private: bool) -> SenderKeyRecord {
        let mut record = SenderKeyRecord::new_empty();
        record
            .add_sender_key_state(
                3,
                7,
                0,
                &[9u8; 32],
                pair.public_key,
                with_private.then(|| pair.private_key.clone()),
            )
            .expect("valid state");

        SenderKeyRecord::deserialize(&record.serialize().expect("serialize")).expect("round trip")
    }

    #[wasm_bindgen_test]
    fn a_second_record_for_the_same_key_is_served_from_the_cache() {
        reset();
        let pair = keys();

        warm(&record_with(&pair, true));
        assert_eq!(len(), 1);

        // A record rebuilt from storage: same signing key, cold memo.
        let rebuilt = record_with(&pair, true);
        warm(&rebuilt);

        assert_eq!(len(), 1, "the same key must not add a second entry");
        let state = rebuilt.sender_key_state().expect("state");
        assert!(
            state.signing_key_private().is_ok(),
            "the served derivation has to be usable"
        );
    }

    #[wasm_bindgen_test]
    fn a_rotated_key_lands_on_its_own_entry() {
        reset();
        warm(&record_with(&keys(), true));
        warm(&record_with(&keys(), true));

        // Distinct public bytes, so a rotation can never be served a stale
        // derivation: it simply misses.
        assert_eq!(len(), 2);
    }

    #[wasm_bindgen_test]
    fn a_received_sender_key_caches_only_its_verifier() {
        reset();
        let pair = keys();

        warm(&record_with(&pair, false));

        assert_eq!(len(), 1);
        let rebuilt = record_with(&pair, false);
        warm(&rebuilt);
        let state = rebuilt.sender_key_state().expect("state");
        assert!(
            state.signing_key_verifier().is_ok(),
            "the verifier is the half a receiver needs"
        );
    }

    #[wasm_bindgen_test]
    fn the_map_stays_bounded() {
        reset();
        for _ in 0..(MAX_ENTRIES + 2) {
            warm(&record_with(&keys(), true));
        }

        assert!(len() <= MAX_ENTRIES, "got {}", len());
    }
}
