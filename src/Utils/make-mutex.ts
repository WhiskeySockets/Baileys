import { Mutex as AsyncMutex } from 'async-mutex'

export const makeMutex = () => {
	const mutex = new AsyncMutex()

	return {
		mutex<T>(code: () => Promise<T> | T): Promise<T> {
			return mutex.runExclusive(code)
		}
	}
}

export type Mutex = ReturnType<typeof makeMutex>

export const makeKeyedMutex = () => {
	const map: { [id: string]: AsyncMutex } = {}

	return {
		mutex<T>(key: string, task: () => Promise<T> | T): Promise<T> {
			if (! map[key]) {
				map[key] = new AsyncMutex()
			}

			return map[key].runExclusive(task)
		}
	}
}
