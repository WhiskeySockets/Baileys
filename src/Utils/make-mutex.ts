/**
 * A highly performant, lightweight mutex implementation.
 * Uses a promise chain to sequence tasks, avoiding the overhead
 * of a full-blown mutex library for simple sequential operations.
 *
 * This implementation is "microtask-friendly" and minimizes the number
 * of promises created per lock acquisition.
 */
export const makeMutex = () => {
	let task: Promise<any> = Promise.resolve()

	return {
		/**
		 * Execute a task exclusively.
		 * The task will wait for all previously scheduled tasks to complete.
		 * Errors in the task do not block the queue.
		 */
		async mutex<T>(code: () => Promise<T> | T): Promise<T> {
			const p = task.then(code)
			// we update the task promise to wait for the new task
			// regardless of whether it fails or not
			task = p.catch(() => {})
			return p
		}
	}
}

export type Mutex = ReturnType<typeof makeMutex>

/**
 * A keyed version of the performant mutex.
 * Allows sequencing tasks based on a string key (e.g. a JID or file path).
 * Automatically cleans up memory when a key is no longer in use.
 */
export const makeKeyedMutex = () => {
	const map = new Map<string, Promise<any>>()

	return {
		/**
		 * Execute a task exclusively for a specific key.
		 */
		async mutex<T>(key: string, task: () => Promise<T> | T): Promise<T> {
			const prevTask = map.get(key) || Promise.resolve()
			const p = prevTask.then(task)
			const nextTask = p
				.catch(() => {})
				.finally(() => {
					// Clean up the map if this is still the latest promise for this key
					if (map.get(key) === nextTask) {
						map.delete(key)
					}
				})

			map.set(key, nextTask)
			return p
		}
	}
}

export type KeyedMutex = ReturnType<typeof makeKeyedMutex>
