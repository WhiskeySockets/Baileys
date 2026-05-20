/**
 * H7 — `useMultiFileAuthState` has no atomic writes and no corruption recovery.
 *
 * `writeFile` (use-multi-file-auth-state.ts:43) writes JSON in place. A crash
 * mid-write produces a truncated file. `readData` (line 50-66) catches every
 * error — `JSON.parse`, `EACCES`, `ENOSPC` — and returns `null`, which the
 * caller treats as "key absent." A crash mid-write of `creds.json` therefore
 * looks identical to a fresh install on next boot, producing silent identity
 * loss.
 *
 * Desired behavior:
 *   - persistent writes go to a `.tmp` file and rename atomically;
 *   - read distinguishes ENOENT (return null) from corruption (throw with
 *     diagnostic detail) so operators see the problem and can recover.
 *
 * Failing while H7 is unresolved. Flipped to `it(...)` in Stage 5.
 */
import { mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { useMultiFileAuthState } from '../../Utils/use-multi-file-auth-state'

describe('useMultiFileAuthState — atomic write & corruption recovery (H7)', () => {
	let dir: string

	beforeEach(async () => {
		dir = await mkdtemp(join(tmpdir(), 'baileys-h7-'))
	})

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true })
	})

	it('a torn creds.json write does not silently degrade to a fresh-install state', async () => {
		const { state, saveCreds } = await useMultiFileAuthState(dir)
		state.creds.advSecretKey = 'sentinel-value-A'
		await saveCreds()

		const credsPath = join(dir, 'creds.json')

		state.creds.advSecretKey = 'sentinel-value-B'
		await saveCreds()

		// Simulate a torn write — process crashed mid-rewrite, leaving a partial file.
		// Under Stage 5's atomic temp-rename + .bak rotation, recovery falls back to
		// the previous good state. The new value (B) may be lost if the rename had
		// already completed before the corruption; what matters for H7 is that the
		// reopen does NOT silently re-init creds, which would lose the device pairing.
		await writeFile(credsPath, '{ "advSecretKey": "sent') // truncated JSON

		const reopened = await useMultiFileAuthState(dir)

		// Either the latest value (B) or the previous-good value (A) is acceptable;
		// what's unacceptable is a freshly-initialized creds with no advSecretKey set.
		expect(['sentinel-value-A', 'sentinel-value-B']).toContain(reopened.state.creds.advSecretKey)
	})

	it('reading a corrupted creds.json throws (or recovers), never silently returns a fresh-init state', async () => {
		// Pre-seed dir with a deliberately corrupt creds.json.
		await writeFile(join(dir, 'creds.json'), '{ "this is": not val')

		// Today: useMultiFileAuthState swallows the error and returns initAuthCreds()
		// — caller can't tell corruption apart from a brand new install.
		await expect(useMultiFileAuthState(dir)).rejects.toThrow()
	})

	it.todo(
		"a multi-key set() either persists every type or fails the whole call — true cross-file atomicity is a SQLite-only guarantee; covered by Stage 5's `useSqliteAuthState` integration test"
	)
})
