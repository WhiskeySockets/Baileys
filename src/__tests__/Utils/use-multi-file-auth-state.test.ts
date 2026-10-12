import { mkdtemp, readdir, readFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { useMultiFileAuthState } from '../../Utils/use-multi-file-auth-state'

describe('useMultiFileAuthState writes', () => {
	let folder: string

	beforeEach(async () => {
		folder = await mkdtemp(join(tmpdir(), 'baileys-auth-'))
	})

	afterEach(async () => {
		await rm(folder, { recursive: true, force: true })
	})

	it('saveCreds leaves a parseable creds.json and no temp file behind', async () => {
		const { saveCreds } = await useMultiFileAuthState(folder)
		await saveCreds()

		const raw = await readFile(join(folder, 'creds.json'), 'utf-8')
		expect(() => JSON.parse(raw)).not.toThrow()
		expect((await readdir(folder)).filter(f => f !== 'creds.json')).toEqual([])
	})

	it('never exposes a truncated creds.json while saving', async () => {
		// A process killed mid-write leaves whatever is on disk at that instant.
		// With an in-place writeFile that can be an empty or half-written file,
		// which readData turns into null and the caller into brand-new creds.
		const { state, saveCreds } = await useMultiFileAuthState(folder)
		const creds = state.creds as unknown as Record<string, unknown>
		creds.padding = 'a'.repeat(20 * 1024 * 1024)
		await saveCreds()

		creds.padding = 'b'.repeat(20 * 1024 * 1024)
		let done = false
		const saving = saveCreds().finally(() => {
			done = true
		})

		const torn: number[] = []
		while (!done) {
			const raw = await readFile(join(folder, 'creds.json'), 'utf-8').catch(() => '')
			try {
				JSON.parse(raw)
			} catch {
				torn.push(raw.length)
			}
		}

		await saving
		expect(torn).toEqual([])
	})
})
