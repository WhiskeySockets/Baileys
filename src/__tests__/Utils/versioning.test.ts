import { jest } from '@jest/globals'
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import type { ILogger } from '../../Utils/logger'
import {
	clearLastKnownGoodVersionMemoryCache,
	getLastKnownGoodVersion,
	resolveWaVersion,
	saveLastKnownGoodVersion
} from '../../Utils/versioning'

const makeLogger = (): ILogger => {
	const noop = () => {}

	return {
		level: 'silent',
		child: () => makeLogger(),
		trace: noop,
		debug: noop,
		info: noop,
		warn: noop,
		error: noop
	}
}

describe('versioning', () => {
	const logger = makeLogger()
	let dir: string
	let cachePath: string

	beforeEach(async () => {
		clearLastKnownGoodVersionMemoryCache()
		dir = await mkdtemp(join(tmpdir(), 'baileys-versioning-'))
		cachePath = join(dir, 'last-known-good.json')
	})

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true })
	})

	it('prioritizes versionOverride over all other sources', async () => {
		const fetchLatestVersion = jest.fn(async () => ({
			version: [2, 9999, 1] as [number, number, number],
			isLatest: true
		}))
		const result = await resolveWaVersion({
			logger,
			versionOverride: [2, 3000, 111] as [number, number, number],
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestVersion
		})

		expect(fetchLatestVersion).not.toHaveBeenCalled()
		expect(result.source).toBe('env/manual')
		expect(result.version).toEqual([2, 3000, 111])
	})

	it('uses latest version when fetch succeeds', async () => {
		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestVersion: async () => ({
				version: [2, 3000, 999] as [number, number, number],
				isLatest: true
			})
		})

		expect(result.source).toBe('latest')
		expect(result.version).toEqual([2, 3000, 999])
	})

	it('falls back to lastKnownGood when latest fetch fails', async () => {
		await saveLastKnownGoodVersion({
			logger,
			version: [2, 3000, 555] as [number, number, number],
			versionCachePath: cachePath
		})

		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestVersion: async () => ({
				version: [2, 3000, 1] as [number, number, number],
				isLatest: false,
				error: new Error('fetch failed')
			})
		})

		expect(result.source).toBe('lastKnownGood')
		expect(result.version).toEqual([2, 3000, 555])
	})

	it('falls back to default when no other source is available', async () => {
		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: false,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath
		})

		expect(result.source).toBe('default')
		expect(result.version).toEqual([2, 3000, 1])
	})

	it('persists and reloads lastKnownGoodVersion from disk', async () => {
		await saveLastKnownGoodVersion({
			logger,
			version: [2, 3000, 777] as [number, number, number],
			versionCachePath: cachePath
		})

		const loaded = await getLastKnownGoodVersion(logger, cachePath)
		expect(loaded).toEqual([2, 3000, 777])
	})
})
