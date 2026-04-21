import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import type { SocketConfig, WAVersion } from '../Types'
import { fetchLatestBaileysVersion, fetchLatestWaWebVersion } from './generics'
import type { ILogger } from './logger'

export type VersionSource = 'env/manual' | 'latest' | 'lastKnownGood' | 'default'

type FetchLatestVersionFn = typeof fetchLatestBaileysVersion

type ResolveVersionParams = {
	logger: ILogger
	versionOverride?: WAVersion
	allowLatestFetch: boolean
	defaultVersion: WAVersion
	fetchOptions: SocketConfig['options']
	cachedLastKnownGoodVersion?: WAVersion
	versionCachePath?: string
	fetchLatestWaWebVersionFn?: FetchLatestVersionFn
	fetchLatestBaileysVersionFn?: FetchLatestVersionFn
}

type ResolveVersionResult = {
	version: WAVersion
	source: VersionSource
	lastKnownGoodVersion?: WAVersion
}

const DEFAULT_VERSION_CACHE_FILENAME = '.baileys-last-known-good-version.json'
const memoryLastKnownGoodVersionByPath = new Map<string, WAVersion>()

const isWAVersion = (value: unknown): value is WAVersion => {
	return Array.isArray(value) && value.length === 3 && value.every(item => Number.isInteger(item) && Number(item) >= 0)
}

const getVersionCachePath = (pathOverride?: string) => {
	return pathOverride || process.env.BAILEYS_VERSION_CACHE_PATH || join(process.cwd(), DEFAULT_VERSION_CACHE_FILENAME)
}

const cloneVersion = (version: WAVersion): WAVersion => {
	return [...version] as WAVersion
}

const summarizeError = (error: unknown) => {
	const err = error as { code?: string; message?: string; name?: string } | undefined
	return {
		code: err?.code,
		name: err?.name || 'Error',
		message: err?.message || 'Unknown error'
	}
}

const summarizeLatestResult = (result: Awaited<ReturnType<FetchLatestVersionFn>>) => {
	return {
		isLatest: result.isLatest,
		version: isWAVersion(result.version) ? result.version : undefined,
		hasError: 'error' in result && typeof result.error !== 'undefined'
	}
}

const readVersionFromDisk = async (logger: ILogger, versionCachePath?: string): Promise<WAVersion | undefined> => {
	const path = getVersionCachePath(versionCachePath)
	try {
		const raw = await readFile(path, 'utf-8')
		const parsed = JSON.parse(raw) as { version?: unknown }
		if (isWAVersion(parsed.version)) {
			return cloneVersion(parsed.version)
		}

		logger.warn(
			{ path, hasVersionField: typeof parsed.version !== 'undefined' },
			'ignoring invalid lastKnownGoodVersion cache payload'
		)
	} catch (error) {
		const fileError = error as { code?: string } | undefined
		if (fileError?.code !== 'ENOENT') {
			logger.warn({ path, error: summarizeError(error) }, 'failed reading lastKnownGoodVersion cache from disk')
		}
	}

	return undefined
}

export const getLastKnownGoodVersion = async (
	logger: ILogger,
	versionCachePath?: string
): Promise<WAVersion | undefined> => {
	const cachePath = getVersionCachePath(versionCachePath)
	const memoryVersion = memoryLastKnownGoodVersionByPath.get(cachePath)
	if (memoryVersion) {
		return cloneVersion(memoryVersion)
	}

	const diskVersion = await readVersionFromDisk(logger, versionCachePath)
	if (diskVersion) {
		memoryLastKnownGoodVersionByPath.set(cachePath, cloneVersion(diskVersion))
	}

	return diskVersion
}

export const saveLastKnownGoodVersion = async (params: {
	logger: ILogger
	version: WAVersion
	versionCachePath?: string
}) => {
	const { logger, version, versionCachePath } = params
	const cachePath = getVersionCachePath(versionCachePath)
	memoryLastKnownGoodVersionByPath.set(cachePath, cloneVersion(version))

	try {
		await mkdir(dirname(cachePath), { recursive: true })
		await writeFile(
			cachePath,
			JSON.stringify(
				{
					version,
					updatedAt: new Date().toISOString()
				},
				null,
				2
			),
			'utf-8'
		)
	} catch (error) {
		logger.warn({ path: cachePath, error: summarizeError(error) }, 'failed persisting lastKnownGoodVersion to disk')
	}
}

export const clearLastKnownGoodVersionMemoryCache = (versionCachePath?: string) => {
	if (versionCachePath) {
		memoryLastKnownGoodVersionByPath.delete(getVersionCachePath(versionCachePath))
		return
	}

	memoryLastKnownGoodVersionByPath.clear()
}

export const resolveWaVersion = async ({
	logger,
	versionOverride,
	allowLatestFetch,
	defaultVersion,
	fetchOptions,
	cachedLastKnownGoodVersion,
	versionCachePath,
	fetchLatestWaWebVersionFn = fetchLatestWaWebVersion,
	fetchLatestBaileysVersionFn = fetchLatestBaileysVersion
}: ResolveVersionParams): Promise<ResolveVersionResult> => {
	if (versionOverride && isWAVersion(versionOverride)) {
		return {
			version: cloneVersion(versionOverride),
			source: 'env/manual',
			lastKnownGoodVersion: cachedLastKnownGoodVersion
		}
	}

	if (allowLatestFetch) {
		let latestWaWeb: Awaited<ReturnType<FetchLatestVersionFn>>
		try {
			latestWaWeb = await fetchLatestWaWebVersionFn(fetchOptions)
		} catch (error) {
			logger.warn(
				{ error: summarizeError(error) },
				'latest WA Web version fetch threw; attempting Baileys latest fallback'
			)
			latestWaWeb = { version: defaultVersion, isLatest: false } as Awaited<ReturnType<FetchLatestVersionFn>>
		}

		if (latestWaWeb.isLatest && isWAVersion(latestWaWeb.version)) {
			return {
				version: cloneVersion(latestWaWeb.version),
				source: 'latest',
				lastKnownGoodVersion: cachedLastKnownGoodVersion
			}
		}

		logger.warn(
			{ latestWaWeb: summarizeLatestResult(latestWaWeb) },
			'latest WA Web version fetch failed; attempting Baileys latest fallback'
		)

		let latestBaileys: Awaited<ReturnType<FetchLatestVersionFn>>
		try {
			latestBaileys = await fetchLatestBaileysVersionFn(fetchOptions)
		} catch (error) {
			logger.warn({ error: summarizeError(error) }, 'latest Baileys version fetch threw; attempting fallback chain')
			latestBaileys = { version: defaultVersion, isLatest: false } as Awaited<ReturnType<FetchLatestVersionFn>>
		}

		if (latestBaileys.isLatest && isWAVersion(latestBaileys.version)) {
			return {
				version: cloneVersion(latestBaileys.version),
				source: 'latest',
				lastKnownGoodVersion: cachedLastKnownGoodVersion
			}
		}

		logger.warn(
			{ latestBaileys: summarizeLatestResult(latestBaileys) },
			'latest Baileys version fetch failed; attempting fallback chain'
		)
	}

	const resolvedLastKnownGood =
		cachedLastKnownGoodVersion && isWAVersion(cachedLastKnownGoodVersion)
			? cloneVersion(cachedLastKnownGoodVersion)
			: await getLastKnownGoodVersion(logger, versionCachePath)

	if (resolvedLastKnownGood) {
		return {
			version: resolvedLastKnownGood,
			source: 'lastKnownGood',
			lastKnownGoodVersion: resolvedLastKnownGood
		}
	}

	return {
		version: cloneVersion(defaultVersion),
		source: 'default',
		lastKnownGoodVersion: undefined
	}
}
