//! Reuses public verification precomputation across sender-key operations.
//! Private signing material stays in the operation's record and is not cached.

use std::cell::RefCell;
use std::collections::HashMap;

use wacore_libsignal::core::curve::PreparedVerifyingKey;
use wacore_libsignal::protocol::SenderKeyRecord;

const MAX_ENTRIES: usize = 256;

thread_local! {
    static CACHE: RefCell<HashMap<[u8; 33], PreparedVerifyingKey>> = RefCell::new(HashMap::new());
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
    if let Some(verifier) = hit {
        if state.prewarm_verifying_key(verifier).is_ok() {
            #[cfg(test)]
            HITS.with(|hits| hits.set(hits.get() + 1));
        }
        return;
    }
    let Ok(verifier) = state.signing_key_verifier() else {
        return;
    };
    CACHE.with(|cache| {
        let mut cache = cache.borrow_mut();
        if cache.len() >= MAX_ENTRIES {
            cache.clear();
        }

        cache.insert(key, verifier.clone());
    });
}

#[cfg(test)]
thread_local! {
    static HITS: std::cell::Cell<usize> = const { std::cell::Cell::new(0) };
}

#[cfg(test)]
pub(crate) fn reset() {
    CACHE.with(|cache| cache.borrow_mut().clear());
    HITS.with(|hits| hits.set(0));
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
    fn repeated_keys_reuse_verification_precomputation() {
        reset();
        let pair = keys();

        warm(&record_with(&pair, true));
        assert_eq!(len(), 1);
        assert_eq!(HITS.with(|hits| hits.get()), 0);

        // A record rebuilt from storage: same signing key, cold memo.
        let rebuilt = record_with(&pair, true);
        warm(&rebuilt);

        assert_eq!(len(), 1, "the same key must not add a second entry");
        assert_eq!(HITS.with(|hits| hits.get()), 1);
        let state = rebuilt.sender_key_state().expect("state");
        assert!(
            state.signing_key_private().is_ok(),
            "the rebuilt record must retain usable signing material"
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
