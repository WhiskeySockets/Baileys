#!/usr/bin/env node
/**
 * Script to update WhatsApp Web version with robust error handling.
 * Fetches the latest version from web.whatsapp.com with:
 * - Retry with exponential backoff
 * - Multiple source endpoints for redundancy
 * - Version validation before updating
 *
 * Updates: src/Defaults/baileys-version.json (SINGLE SOURCE OF TRUTH)
 *
 * Usage: yarn update:version
 */

import { readFileSync, writeFileSync, appendFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')
const VERSION_FILE_PATH = join(ROOT_DIR, 'src/Defaults/baileys-version.json')

type WAVersion = [number, number, number]

interface VersionResult {
	version: WAVersion
	isLatest: boolean
	source?: string
	error?: unknown
}

// Configuration
const CONFIG = {
	maxRetries: 3,
	retryDelayMs: 2000, // Base delay, will be multiplied by attempt number
	requestTimeoutMs: 10000,
	// Version sanity checks
	minRevision: 1000000000, // Minimum expected revision (to catch parsing errors)
	maxRevision: 9999999999, // Maximum expected revision
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), timeoutMs)

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		})
		return response
	} finally {
		clearTimeout(timeout)
	}
}

/**
 * Validates that a revision number looks reasonable
 */
function isValidRevision(revision: number): boolean {
	return (
		Number.isInteger(revision) &&
		revision >= CONFIG.minRevision &&
		revision <= CONFIG.maxRevision
	)
}

/**
 * Fetches version from WhatsApp Web Service Worker (primary source)
 */
async function fetchFromServiceWorker(): Promise<VersionResult> {
	const url = 'https://web.whatsapp.com/sw.js'
	const headers = {
		'sec-fetch-site': 'none',
		'sec-fetch-mode': 'navigate',
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
		'accept': '*/*',
		'accept-language': 'en-US,en;q=0.9',
	}

	const response = await fetchWithTimeout(url, { method: 'GET', headers }, CONFIG.requestTimeoutMs)

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`)
	}

	const data = await response.text()

	// Try multiple patterns for robustness
	const patterns = [
		/\\?"client_revision\\?":\s*(\d+)/,
		/"client_revision":\s*(\d+)/,
		/client_revision["']?\s*:\s*(\d+)/,
	]

	for (const regex of patterns) {
		const match = data.match(regex)
		if (match?.[1]) {
			const revision = parseInt(match[1], 10)
			if (isValidRevision(revision)) {
				return {
					version: [2, 3000, revision] as WAVersion,
					isLatest: true,
					source: 'sw.js'
				}
			}
		}
	}

	throw new Error('Could not find valid client_revision in sw.js')
}

/**
 * Fetches version from WhatsApp Web bootstrap (backup source)
 */
async function fetchFromBootstrap(): Promise<VersionResult> {
	const url = 'https://web.whatsapp.com/'
	const headers = {
		'sec-fetch-site': 'none',
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
		'accept': 'text/html,application/xhtml+xml',
	}

	const response = await fetchWithTimeout(url, { method: 'GET', headers }, CONFIG.requestTimeoutMs)

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`)
	}

	const data = await response.text()

	// Look for version in HTML/JS bootstrap
	const patterns = [
		/\"client_revision\":(\d+)/,
		/clientRevision['":\s]+(\d+)/i,
	]

	for (const regex of patterns) {
		const match = data.match(regex)
		if (match?.[1]) {
			const revision = parseInt(match[1], 10)
			if (isValidRevision(revision)) {
				return {
					version: [2, 3000, revision] as WAVersion,
					isLatest: true,
					source: 'bootstrap'
				}
			}
		}
	}

	throw new Error('Could not find valid client_revision in bootstrap page')
}

/**
 * Fetches the latest WhatsApp Web version with retry and fallback
 */
async function fetchLatestWaWebVersion(): Promise<VersionResult> {
	// Read current version as fallback
	const currentContent = readFileSync(VERSION_FILE_PATH, 'utf-8')
	const fallbackVersion = JSON.parse(currentContent).version as WAVersion

	const sources = [
		{ name: 'Service Worker', fetch: fetchFromServiceWorker },
		{ name: 'Bootstrap Page', fetch: fetchFromBootstrap },
	]

	const errors: string[] = []

	for (const source of sources) {
		for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
			try {
				console.log(`  Attempting ${source.name} (attempt ${attempt}/${CONFIG.maxRetries})...`)
				const result = await source.fetch()
				console.log(`  ✓ Success from ${source.name}`)
				return result
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error)
				errors.push(`${source.name} attempt ${attempt}: ${errorMsg}`)
				console.log(`  ✗ ${source.name} failed: ${errorMsg}`)

				if (attempt < CONFIG.maxRetries) {
					const delay = CONFIG.retryDelayMs * attempt
					console.log(`  Waiting ${delay}ms before retry...`)
					await sleep(delay)
				}
			}
		}
	}

	console.log('\n⚠ All sources failed, using fallback version')
	return {
		version: fallbackVersion,
		isLatest: false,
		error: { message: 'All fetch attempts failed', details: errors }
	}
}

function updateBaileysVersionJson(version: WAVersion, source?: string): boolean {
	const content = { version }

	try {
		const currentContent = readFileSync(VERSION_FILE_PATH, 'utf-8')
		const currentVersion = JSON.parse(currentContent).version as number[]

		if (
			currentVersion[0] === version[0] &&
			currentVersion[1] === version[1] &&
			currentVersion[2] === version[2]
		) {
			console.log(`✓ baileys-version.json already up to date`)
			return false
		}

		writeFileSync(VERSION_FILE_PATH, JSON.stringify(content) + '\n')
		console.log(`✓ Updated baileys-version.json: [${currentVersion.join(', ')}] → [${version.join(', ')}]`)
		if (source) {
			console.log(`  Source: ${source}`)
		}
		console.log(`  (index.ts and generics.ts automatically use the new version via import)`)
		return true
	} catch (error) {
		console.error(`✗ Failed to update baileys-version.json:`, error)
		throw error
	}
}

async function main() {
	console.log('╔════════════════════════════════════════════════╗')
	console.log('║     WhatsApp Web Version Update Script         ║')
	console.log('╚════════════════════════════════════════════════╝\n')

	console.log('Fetching latest WhatsApp Web version...\n')

	const result = await fetchLatestWaWebVersion()

	console.log('')
	if (result.isLatest) {
		console.log(`Latest version: [${result.version.join(', ')}]`)
		if (result.source) {
			console.log(`Source: ${result.source}\n`)
		}
	} else {
		console.log(`⚠ Using fallback version: [${result.version.join(', ')}]`)
		console.log(`Reason: ${JSON.stringify(result.error)}\n`)
	}

	const hasUpdates = updateBaileysVersionJson(result.version, result.source)

	console.log('')
	if (hasUpdates) {
		console.log('═══════════════════════════════════════════════')
		console.log('Version update complete!')
		console.log('═══════════════════════════════════════════════')
		if (process.env.GITHUB_OUTPUT) {
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=true\n`)
			appendFileSync(process.env.GITHUB_OUTPUT, `version=${result.version.join('.')}\n`)
			appendFileSync(process.env.GITHUB_OUTPUT, `source=${result.source || 'fallback'}\n`)
		}
	} else {
		console.log('Already up to date. No changes needed.')
		if (process.env.GITHUB_OUTPUT) {
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=false\n`)
		}
	}

	// Exit with error if we couldn't fetch latest (so CI knows)
	if (!result.isLatest) {
		console.log('\n⚠ Warning: Could not fetch latest version from WhatsApp servers')
		process.exit(0) // Don't fail the workflow, just warn
	}
}

main().catch(error => {
	console.error('Fatal error:', error)
	process.exit(1)
})
