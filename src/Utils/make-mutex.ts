export const makeMutex = () => {
    let task = Promise.resolve() as Promise<any>
    let taskTimeout: NodeJS. Timeout | undefined
    let chainLength = 0
    const MAX_CHAIN = 50

    return {
        mutex<T>(code: () => Promise<T> | T): Promise<T> {
            // break the chain periodically so old promises can be GC'd
            if (++chainLength > MAX_CHAIN) {
                task = Promise. resolve()
                chainLength = 0
            }

            task = (async () => {
                try {
                    await task
                } catch {}

                try {
                    const result = await code()
                    return result
                } finally {
                    clearTimeout(taskTimeout)
                }
            })()
            return task
        }
    }
}

export type Mutex = ReturnType<typeof makeMutex>

export const makeKeyedMutex = () => {
	const map: { [id: string]: Mutex } = {}

	return {
		mutex<T>(key: string, task: () => Promise<T> | T): Promise<T> {
			if (!map[key]) {
				map[key] = makeMutex()
			}

			return map[key].mutex(task)
		}
	}
}
