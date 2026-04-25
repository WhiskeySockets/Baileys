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
		const fetchLatestWaWebVersionFn = jest.fn(async () => ({
			version: [2, 9999, 1] as [number, number, number],
			isLatest: true
		}))
		const fetchLatestBaileysVersionFn = jest.fn(async () => ({
			version: [2, 8888, 1] as [number, number, number],
			isLatest: true
		}))
		const result = await resolveWaVersion({
			logger,
			versionOverride: [2, 3000, 111] as [number, number, number],
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestWaWebVersionFn,
			fetchLatestBaileysVersionFn
		})

		expect(fetchLatestWaWebVersionFn).not.toHaveBeenCalled()
		expect(fetchLatestBaileysVersionFn).not.toHaveBeenCalled()
		expect(result.source).toBe('env/manual')
		expect(result.version).toEqual([2, 3000, 111])
	})

	it('uses WA Web latest version first when fetch succeeds', async () => {
		const fetchLatestBaileysVersionFn = jest.fn(async () => ({
			version: [2, 3000, 111] as [number, number, number],
			isLatest: true
		}))
		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestWaWebVersionFn: async () => ({
				version: [2, 3000, 999] as [number, number, number],
				isLatest: true
			}),
			fetchLatestBaileysVersionFn
		})

		expect(fetchLatestBaileysVersionFn).not.toHaveBeenCalled()
		expect(result.source).toBe('latest')
		expect(result.version).toEqual([2, 3000, 999])
	})

	it('falls back to Baileys latest when WA Web latest fails', async () => {
		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestWaWebVersionFn: async () => ({
				version: [2, 3000, 1] as [number, number, number],
				isLatest: false,
				error: new Error('wa web fetch failed')
			}),
			fetchLatestBaileysVersionFn: async () => ({
				version: [2, 3000, 888] as [number, number, number],
				isLatest: true
			})
		})

		expect(result.source).toBe('latest')
		expect(result.version).toEqual([2, 3000, 888])
	})

	it('falls back to lastKnownGood when all latest fetches fail', async () => {
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
			fetchLatestWaWebVersionFn: async () => ({
				version: [2, 3000, 1] as [number, number, number],
				isLatest: false,
				error: new Error('wa web fetch failed')
			}),
			fetchLatestBaileysVersionFn: async () => ({
				version: [2, 3000, 1] as [number, number, number],
				isLatest: false,
				error: new Error('baileys fetch failed')
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

		clearLastKnownGoodVersionMemoryCache(cachePath)
		const loaded = await getLastKnownGoodVersion(logger, cachePath)
		expect(loaded).toEqual([2, 3000, 777])
	})

	it('keeps memory cache isolated per cache path', async () => {
		const cachePathOne = join(dir, 'cache-one.json')
		const cachePathTwo = join(dir, 'cache-two.json')

		await saveLastKnownGoodVersion({
			logger,
			version: [2, 3000, 111] as [number, number, number],
			versionCachePath: cachePathOne
		})

		await saveLastKnownGoodVersion({
			logger,
			version: [2, 3000, 222] as [number, number, number],
			versionCachePath: cachePathTwo
		})

		const loadedOne = await getLastKnownGoodVersion(logger, cachePathOne)
		const loadedTwo = await getLastKnownGoodVersion(logger, cachePathTwo)

		expect(loadedOne).toEqual([2, 3000, 111])
		expect(loadedTwo).toEqual([2, 3000, 222])
	})

	it('continues fallback chain when latest fetchers throw', async () => {
		await saveLastKnownGoodVersion({
			logger,
			version: [2, 3000, 444] as [number, number, number],
			versionCachePath: cachePath
		})

		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: true,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			versionCachePath: cachePath,
			fetchLatestWaWebVersionFn: async () => {
				throw new Error('wa web fetch exception')
			},
			fetchLatestBaileysVersionFn: async () => {
				throw new Error('baileys fetch exception')
			}
		})

		expect(result.source).toBe('lastKnownGood')
		expect(result.version).toEqual([2, 3000, 444])
	})

	it('snapshots version before async disk persistence', async () => {
		const version = [2, 3000, 901] as [number, number, number]
		const savePromise = saveLastKnownGoodVersion({
			logger,
			version,
			versionCachePath: cachePath
		})

		version[2] = 999
		await savePromise

		clearLastKnownGoodVersionMemoryCache(cachePath)
		const loaded = await getLastKnownGoodVersion(logger, cachePath)
		expect(loaded).toEqual([2, 3000, 901])
	})

	it('returns independent clones for resolved lastKnownGood result fields', async () => {
		const result = await resolveWaVersion({
			logger,
			allowLatestFetch: false,
			defaultVersion: [2, 3000, 1] as [number, number, number],
			fetchOptions: {},
			cachedLastKnownGoodVersion: [2, 3000, 123] as [number, number, number],
			versionCachePath: cachePath
		})

		expect(result.source).toBe('lastKnownGood')
		expect(result.version).toEqual([2, 3000, 123])
		expect(result.lastKnownGoodVersion).toEqual([2, 3000, 123])

		result.version[2] = 777
		expect(result.lastKnownGoodVersion).toEqual([2, 3000, 123])
	})
})
