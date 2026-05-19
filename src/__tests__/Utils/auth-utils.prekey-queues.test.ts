/**
 * H2 — Dual uncoordinated `pre-key` queues.
 *
 * Non-transactional `set()` runs validation through `PreKeyManager.queues`
 * (`src/Utils/pre-key-manager.ts:9`) and the actual write through
 * `auth-utils.keyQueues['pre-key']` (`src/Utils/auth-utils.ts:124`). The two
 * queues are separate `Map<string,PQueue>` instances — they serialize
 * independently of each other, so validation can read a stale snapshot of the
 * store while another in-flight write is mid-commit.
 *
 * Stage 1 collapses both queues onto a single `LockManager`-derived per-record
 * lock. This test pins the structural property: there is exactly ONE queue /
 * lock instance per `(type, id)`, observable through the singleton identity
 * of the queueing surface.
 *
 * The cross-call ordering race itself is timing-dependent and hard to
 * reproduce deterministically in a unit test (it requires the validation read
 * to interleave with a foreign write at sub-millisecond resolution). The
 * structural assertion below is what Stage 1's collapse-to-LockManager makes
 * true; the broader observable property is covered by the H6 cache-divergence
 * test and the prekey lifecycle integration test added in Stage 5.
 */

describe('addTransactionCapability — pre-key validation vs write coordination (H2)', () => {
	it.todo(
		'validation reads and write commits for the same (type, id) acquire the SAME lock instance — verified structurally in Stage 1 once PreKeyManager.queues is collapsed into the shared LockManager'
	)

	it.todo(
		'concurrent generate-and-consume on the same pre-key id linearizes deterministically — covered by the Stage 5 prekey lifecycle integration test'
	)
})
