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

	it.failing('a torn creds.json write does not lose the previous good state on re-open', async () => {
		const { state, saveCreds } = await useMultiFileAuthState(dir)
		state.creds.advSecretKey = 'sentinel-value-A'
		await saveCreds()

		const credsPath = join(dir, 'creds.json')

		state.creds.advSecretKey = 'sentinel-value-B'
		await saveCreds()

		// Simulate a torn write — process crashed mid-rewrite, leaving a partial file.
		// Under Stage 5's atomic temp-rename, a partial file cannot replace the real
		// creds.json; the previous good state survives.
		await writeFile(credsPath, '{ "advSecretKey": "sent') // truncated JSON

		const reopened = await useMultiFileAuthState(dir)

		expect(reopened.state.creds.advSecretKey).toBe('sentinel-value-B')
	})

	it(
		'reading a corrupted creds.json throws (or recovers), never silently returns a fresh-init state',
		async () => {
			// Pre-seed dir with a deliberately corrupt creds.json.
			await writeFile(join(dir, 'creds.json'), '{ "this is": not val')

			// Stage 5 H7 fix: useMultiFileAuthState now throws `AuthFileCorruptError`
			// when both `creds.json` AND `creds.json.bak` fail to parse — caller
			// can distinguish corruption from a brand new install (which returns
			// initAuthCreds() silently). With no `.bak` present (first boot), the
			// throw must surface so the operator can recover the file or re-pair
			// deliberately rather than discovering it silently regenerated.
			await expect(useMultiFileAuthState(dir)).rejects.toThrow()
		}
	)

	it.failing('a multi-key set() either persists every type or fails the whole call', async () => {
		const { state } = await useMultiFileAuthState(dir)

		const jid = 'peer@s.whatsapp.net'

		// Inject a write that fails on `identity-key` to simulate disk pressure
		// or permission denial.
		const realKeySet = state.keys.set
		let count = 0
		state.keys.set = (async (data: any) => {
			count++
			if (count === 1) {
				// Pretend disk fills up halfway: write session, fail identity-key.
				if (data['identity-key'] && data['session']) {
					await realKeySet({ session: data['session'] })
					throw new Error('disk full')
				}
			}

			return realKeySet(data)
		}) as typeof state.keys.set

		await expect(
			state.keys.set({
				session: { [jid]: Buffer.from([0x01]) as any },
				'identity-key': { [jid]: Buffer.from([0x02]) as any }
			})
		).rejects.toThrow('disk full')

		const persisted = await state.keys.get('session', [jid])
		// Desired contract: the partial write was rolled back / never observable.
		expect(persisted[jid]).toBeUndefined()
	})

	it('round-7 regression: repeated writes survive a pre-existing .bak (Windows EEXIST guard)', async () => {
		// Copilot round-7 fix guard: on Windows, `fs.rename(filePath, bakPath)`
		// fails with EEXIST/EPERM if `bakPath` already exists. Before the
		// `renameOverwrite` wrapper, the second `saveCreds()` would throw and
		// permanently break auth persistence on Windows. POSIX gets the same
		// behaviour for free (atomic replace); this test exercises both via
		// repeated rewrites that each must rotate the previous `.bak`.
		const { state, saveCreds } = await useMultiFileAuthState(dir)

		// 1st write — primary only, no .bak yet.
		state.creds.advSecretKey = 'gen-1'
		await saveCreds()

		// 2nd write — first one created the .bak, this must overwrite it.
		state.creds.advSecretKey = 'gen-2'
		await saveCreds()

		// 3rd write — proves the overwrite continues to work, not just a
		// "first overwrite happens to succeed" edge case.
		state.creds.advSecretKey = 'gen-3'
		await saveCreds()

		// Reopen and read — must observe the latest generation. Recovery
		// from .bak would surface 'gen-2' instead; only a working rotate
		// surfaces 'gen-3'.
		const reopened = await useMultiFileAuthState(dir)
		expect(reopened.state.creds.advSecretKey).toBe('gen-3')
	})
})
