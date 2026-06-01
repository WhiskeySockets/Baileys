/**
 * M2 — `uploadPreKeys` race + uncancellable retry.
 *
 * `socket.ts:496-524`:
 *  - Emits `creds.update` INSIDE the key transaction before the upload
 *    completes. If the upload fails afterwards, local creds advanced but the
 *    server has nothing.
 *  - The upload timeout is `Promise.race` — the underlying upload logic is
 *    NOT cancelled when the timeout wins, so the caller sees failure while
 *    the old operation continues in the background.
 *  - Each retry generates fresh pre-keys with new IDs (L499 comment). After
 *    3 network failures, `nextPreKeyId` has permanently advanced by
 *    `3 × MIN_PREKEY_COUNT` with nothing uploaded.
 *
 * Desired behavior:
 *  - `nextPreKeyId` advances only after a successful upload.
 *  - Failed uploads do not orphan generated pre-keys.
 *  - Timeout actually cancels the in-flight upload (AbortSignal).
 *
 * Failing while M2 is unresolved. Flipped to `it(...)` in Stage 2.
 *
 * This is a primitive-level test of the desired "generate → upload → commit"
 * sequencing. The Stage 2 refactor introduces a public surface for this
 * pattern that the real `uploadPreKeys` will use.
 */

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

interface CredsLike {
	nextPreKeyId: number
	firstUnuploadedPreKeyId: number
}

/**
 * Today's pattern (paraphrased from `socket.ts:496-524`): generate keys,
 * advance `nextPreKeyId`, fire upload, retry on failure — each retry advances
 * IDs again.
 */
const todaysUploadPreKeys = async (
	creds: CredsLike,
	upload: () => Promise<void>,
	MIN_PREKEY_COUNT: number,
	maxAttempts: number
): Promise<void> => {
	let lastError: unknown
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		// Advance ids up-front — once per attempt.
		const start = creds.nextPreKeyId
		creds.nextPreKeyId = start + MIN_PREKEY_COUNT
		creds.firstUnuploadedPreKeyId = creds.nextPreKeyId

		try {
			await upload()
			return
		} catch (e) {
			lastError = e
			await delay(2)
		}
	}

	throw lastError
}

describe('uploadPreKeys — id advancement gated on upload success (M2)', () => {
	it.failing('nextPreKeyId is unchanged after N consecutive upload failures', async () => {
		const creds: CredsLike = { nextPreKeyId: 1, firstUnuploadedPreKeyId: 1 }
		const MIN_PREKEY_COUNT = 30
		const ATTEMPTS = 3

		// Upload always fails.
		const upload = async () => {
			throw new Error('network error')
		}

		await expect(todaysUploadPreKeys(creds, upload, MIN_PREKEY_COUNT, ATTEMPTS)).rejects.toThrow('network error')

		// Desired: after every attempt failed, ids have NOT been burned.
		expect(creds.nextPreKeyId).toBe(1)
		expect(creds.firstUnuploadedPreKeyId).toBe(1)
	})

	it.failing('a successful retry after one failure advances ids by exactly one batch, not two', async () => {
		const creds: CredsLike = { nextPreKeyId: 1, firstUnuploadedPreKeyId: 1 }
		const MIN_PREKEY_COUNT = 30

		let calls = 0
		const upload = async () => {
			calls++
			if (calls === 1) throw new Error('transient')
		}

		await todaysUploadPreKeys(creds, upload, MIN_PREKEY_COUNT, 3)

		// Desired: one successful upload = one batch advance.
		expect(creds.nextPreKeyId).toBe(1 + MIN_PREKEY_COUNT)
		expect(creds.firstUnuploadedPreKeyId).toBe(1 + MIN_PREKEY_COUNT)
	})

	it.todo(
		'a timed-out upload is cancelled, not allowed to continue in the background — Stage 2 rewrites uploadPreKeys with AbortSignal threading; the integration assertion lands in socket.ts unit tests at that stage'
	)
})
