#!/usr/bin/env node
/**
 * Script to update WhatsApp Web version.
 * Fetches the latest version from web.whatsapp.com and updates:
 * - src/Defaults/baileys-version.json (SINGLE SOURCE OF TRUTH)
 *
 * Other files (index.ts, generics.ts) import from this JSON file,
 * so only one file needs to be updated.
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
	error?: unknown
}

/**
 * Fetches the latest WhatsApp Web version from web.whatsapp.com
 * Extracted here to avoid circular dependency with generics.ts
 */
async function fetchLatestWaWebVersion(): Promise<VersionResult> {
	// Read current version as fallback
	const currentContent = readFileSync(VERSION_FILE_PATH, 'utf-8')
	const fallbackVersion = JSON.parse(currentContent).version as WAVersion

	try {
		const headers = {
			'sec-fetch-site': 'none',
			'user-agent':
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
		}

		const response = await fetch('https://web.whatsapp.com/sw.js', {
			method: 'GET',
			headers
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch sw.js: ${response.statusText}`)
		}

		const data = await response.text()
		const regex = /\\?"client_revision\\?":\s*(\d+)/
		const match = data.match(regex)

		if (!match?.[1]) {
			return {
				version: fallbackVersion,
				isLatest: false,
				error: { message: 'Could not find client revision in the fetched content' }
			}
		}

		return {
			version: [2, 3000, +match[1]] as WAVersion,
			isLatest: true
		}
	} catch (error) {
		return {
			version: fallbackVersion,
			isLatest: false,
			error
		}
	}
}

function updateBaileysVersionJson(version: WAVersion): boolean {
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
		console.log(`  (index.ts and generics.ts will automatically use the new version)`)
		return true
	} catch (error) {
		console.error(`✗ Failed to update baileys-version.json:`, error)
		throw error
	}
}

async function main() {
	console.log('Fetching latest WhatsApp Web version...\n')

	const result = await fetchLatestWaWebVersion()

	if (!result.isLatest) {
		console.error('Failed to fetch latest version:', result.error)
		process.exit(1)
	}

	console.log(`Latest version: [${result.version.join(', ')}]\n`)

	const hasUpdates = updateBaileysVersionJson(result.version)

	console.log('')
	if (hasUpdates) {
		console.log('Version update complete!')
		console.log('Note: Only baileys-version.json needs updating - other files import from it.')
		if (process.env.GITHUB_OUTPUT) {
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=true\n`)
			appendFileSync(process.env.GITHUB_OUTPUT, `version=${result.version.join('.')}\n`)
		}
	} else {
		console.log('Already up to date.')
		if (process.env.GITHUB_OUTPUT) {
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=false\n`)
		}
	}
}

main().catch(error => {
	console.error('Fatal error:', error)
	process.exit(1)
})
