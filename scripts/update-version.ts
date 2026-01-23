#!/usr/bin/env node
/**
 * Script to update WhatsApp Web version across the codebase.
 * Fetches the latest version from web.whatsapp.com and updates:
 * - src/Defaults/baileys-version.json
 * - src/Defaults/index.ts
 * - src/Utils/generics.ts
 *
 * Usage: yarn update:version
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fetchLatestWaWebVersion } from '../src/Utils/generics.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')

function updateBaileysVersionJson(version: [number, number, number]): boolean {
	const filePath = join(ROOT_DIR, 'src/Defaults/baileys-version.json')
	const content = {
		version
	}

	try {
		const currentContent = readFileSync(filePath, 'utf-8')
		const currentVersion = JSON.parse(currentContent).version as number[]

		if (currentVersion[0] === version[0] && currentVersion[1] === version[1] && currentVersion[2] === version[2]) {
			console.log(`✓ baileys-version.json already up to date`)
			return false
		}

		writeFileSync(filePath, JSON.stringify(content) + '\n')
		console.log(`✓ Updated baileys-version.json: [${currentVersion.join(', ')}] → [${version.join(', ')}]`)
		return true
	} catch (error) {
		console.error(`✗ Failed to update baileys-version.json:`, error)
		throw error
	}
}

function updateGenerics(version: [number, number, number]): boolean {
	const filePath = join(ROOT_DIR, 'src/Utils/generics.ts')

	try {
		const content = readFileSync(filePath, 'utf-8')
		const versionRegex = /const baileysVersion = \[(\d+),\s*(\d+),\s*(\d+)\]/
		const match = content.match(versionRegex)

		if (!match) {
			throw new Error('Could not find baileysVersion declaration in generics.ts')
		}

		const currentVersion = [+match[1]!, +match[2]!, +match[3]!]

		if (currentVersion[0] === version[0] && currentVersion[1] === version[1] && currentVersion[2] === version[2]) {
			console.log(`✓ src/Utils/generics.ts already up to date`)
			return false
		}

		const newContent = content.replace(
			versionRegex,
			`const baileysVersion = [${version[0]}, ${version[1]}, ${version[2]}]`
		)

		writeFileSync(filePath, newContent)
		console.log(`✓ Updated src/Utils/generics.ts: [${currentVersion.join(', ')}] → [${version.join(', ')}]`)
		return true
	} catch (error) {
		console.error(`✗ Failed to update src/Utils/generics.ts:`, error)
		throw error
	}
}

function updateIndex(version: [number, number, number]): boolean {
	const filePath = join(ROOT_DIR, 'src/Defaults/index.ts')

	try {
		const content = readFileSync(filePath, 'utf-8')
		const versionRegex = /const version = \[(\d+),\s*(\d+),\s*(\d+)\]/
		const match = content.match(versionRegex)

		if (!match) {
			throw new Error('Could not find version declaration in index.ts')
		}

		const currentVersion = [+match[1]!, +match[2]!, +match[3]!]

		if (currentVersion[0] === version[0] && currentVersion[1] === version[1] && currentVersion[2] === version[2]) {
			console.log(`✓ src/Defaults/index.ts already up to date`)
			return false
		}

		const newContent = content.replace(versionRegex, `const version = [${version[0]}, ${version[1]}, ${version[2]}]`)

		writeFileSync(filePath, newContent)
		console.log(`✓ Updated src/Defaults/index.ts: [${currentVersion.join(', ')}] → [${version.join(', ')}]`)
		return true
	} catch (error) {
		console.error(`✗ Failed to update src/Defaults/index.ts:`, error)
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

	const updates = [
		updateBaileysVersionJson(result.version),
		updateGenerics(result.version),
		updateIndex(result.version)
	]

	const hasUpdates = updates.some(Boolean)

	console.log('')
	if (hasUpdates) {
		console.log('Version update complete!')
		// Set GitHub Actions output if running in CI
		if (process.env.GITHUB_OUTPUT) {
			const { appendFileSync } = await import('fs')
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=true\n`)
			appendFileSync(process.env.GITHUB_OUTPUT, `version=${result.version.join('.')}\n`)
		}
	} else {
		console.log('All files are already up to date.')
		if (process.env.GITHUB_OUTPUT) {
			const { appendFileSync } = await import('fs')
			appendFileSync(process.env.GITHUB_OUTPUT, `updated=false\n`)
		}
	}
}

main().catch(error => {
	console.error('Fatal error:', error)
	process.exit(1)
})
