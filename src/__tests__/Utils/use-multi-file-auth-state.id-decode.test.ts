/**
 * Regression: `list()` / `listIds()` on `useMultiFileAuthState` must yield the
 * SAME logical id that callers passed to `set`, not the on-disk mangled form.
 *
 * Two types where `fixFileName`'s `:` → `-` and `/` → `__` substitutions
 * matter in practice:
 *
 *   - `sender-key`: ids look like `groupId-creator@g.us::signalAddr`,
 *     mangled to `groupId-creator@g.us--signalAddr` on disk. A naive
 *     `migrateAuthState` to SQLite would store the mangled id, then libsignal
 *     lookups using the real id would miss.
 *   - `app-state-sync-key`: ids are base64 of the binary key id and can
 *     contain `/` (e.g. `aB/cD==`). Mangled to `aB__cD==`. Same migration
 *     hazard.
 *
 * Per-type decoding in `iterateType` reverses each mangling against its
 * known id-space (no original `--` in sender-key, no original `__` in
 * standard base64), so `list`/`listIds` surface the logical id and
 * cross-store migrations round-trip cleanly.
 */
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { useMultiFileAuthState } from '../../Utils/use-multi-file-auth-state'

describe('useMultiFileAuthState — list/listIds id decoding', () => {
	let dir: string

	beforeEach(async () => {
		dir = await mkdtemp(join(tmpdir(), 'baileys-id-decode-'))
	})

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true })
	})

	it('round-trips sender-key ids through set → listIds (decodes -- back to ::)', async () => {
		const { state } = await useMultiFileAuthState(dir)

		const senderKeyId = '15551234567-1700000000@g.us::15559999999.0'
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await state.keys.set({ 'sender-key': { [senderKeyId]: Buffer.from([1, 2, 3]) as any } })

		const enumerated: string[] = []
		for await (const id of state.keys.listIds!('sender-key')) enumerated.push(id)

		expect(enumerated).toEqual([senderKeyId])

		// And `list()` yields the same id (decoded) — not the on-disk mangled form.
		const listed: string[] = []
		for await (const [id] of state.keys.list!('sender-key')) listed.push(id)
		expect(listed).toEqual([senderKeyId])
	})

	it('round-trips app-state-sync-key ids through set → listIds (decodes __ back to /)', async () => {
		const { state } = await useMultiFileAuthState(dir)

		// Base64-shaped id containing a `/` — what
		// `Buffer.from(keyId.keyId!).toString('base64')` produces for a binary
		// key id whose bytes happen to land on the `/` code point in base64.
		const keyId = 'aB/cD=='
		await state.keys.set({
			'app-state-sync-key': {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				[keyId]: { keyData: Buffer.from([9, 9, 9]) } as any
			}
		})

		const enumerated: string[] = []
		for await (const id of state.keys.listIds!('app-state-sync-key')) enumerated.push(id)

		expect(enumerated).toEqual([keyId])
	})

	it('leaves tctoken __index sentinel untouched (per-type dispatch, not blanket __ → /)', async () => {
		const { state } = await useMultiFileAuthState(dir)

		// tctoken's index uses a literal `__index` id. A blanket `__` → `/`
		// decoder would mangle it to `/index` and break every subsequent
		// lookup. The per-type decoder must restrict the substitution to
		// id spaces that actually need it.
		await state.keys.set({
			tctoken: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				__index: { token: Buffer.from([0xaa]) } as any
			}
		})

		const enumerated: string[] = []
		for await (const id of state.keys.listIds!('tctoken')) enumerated.push(id)

		expect(enumerated).toEqual(['__index'])
	})
})
