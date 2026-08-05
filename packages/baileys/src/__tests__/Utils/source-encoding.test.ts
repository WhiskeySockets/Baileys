import { describe, expect, it } from '@jest/globals'
import { readdirSync, readFileSync, statSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

/**
 * A raw NUL byte in a source file makes git classify it as binary: diffs stop
 * rendering in review, `git diff` reports only "Bin N -> M bytes", and merges
 * or cherry-picks conflict with no markers to resolve. The `\0` escape produces
 * the same string at runtime and keeps the file text.
 */
describe('source files', () => {
	// Relative to this file, not to the working directory: jest may be started
	// from the repo root, where `<cwd>/src` does not exist.
	const here = dirname(fileURLToPath(import.meta.url))
	const root = join(here, '..', '..')

	const sourceFiles = (dir: string): string[] => {
		const found: string[] = []
		for (const entry of readdirSync(dir)) {
			const full = join(dir, entry)
			if (statSync(full).isDirectory()) {
				found.push(...sourceFiles(full))
			} else if (entry.endsWith('.ts')) {
				found.push(full)
			}
		}

		return found
	}

	it('are reachable from this test', () => {
		// Without this the NUL check below would pass on an empty list and prove
		// nothing. Finding this very file confirms the scan walked real sources.
		const files = sourceFiles(root).map(file => relative(root, file))

		expect(files).toContain(join('__tests__', 'Utils', 'source-encoding.test.ts'))
	})

	it('contain no raw NUL bytes', () => {
		const offenders = sourceFiles(root).filter(file => readFileSync(file).includes(0))

		expect(offenders.map(file => relative(root, file))).toEqual([])
	})
})
