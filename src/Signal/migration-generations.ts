/** Bounded migration history; eviction must never make an old admission current. */
export class MigrationGenerations {
	private readonly entries = new Map<string, number>()
	private epoch = 0
	private floor = 0

	constructor(private readonly capacity = 1024) {
		if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error('Invalid migration history capacity')
	}

	get size() {
		return this.entries.size
	}

	get(key: string) {
		return this.entries.get(key) ?? this.floor
	}

	advance(keys: readonly string[]) {
		if (this.epoch === Number.MAX_SAFE_INTEGER) throw new Error('Migration generation exhausted')
		const generation = ++this.epoch
		for (const key of new Set(keys)) {
			this.entries.delete(key)
			this.entries.set(key, generation)
			while (this.entries.size > this.capacity) {
				const oldest = this.entries.entries().next().value
				if (!oldest) throw new Error('Missing migration history entry')
				this.entries.delete(oldest[0])
				// Missing entries use the eviction floor, never the initial zero.
				// This can conservatively retry unrelated old admissions after pruning.
				this.floor = Math.max(this.floor, oldest[1])
			}
		}
	}
}
