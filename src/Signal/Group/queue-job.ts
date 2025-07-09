interface QueueJob<T> {
	awaitable: () => Promise<T>
	resolve: (value: T | PromiseLike<T>) => void
	reject: (reason?: unknown) => void
}

const _queueAsyncBuckets = new Map<string | number, Array<QueueJob<any>>>()
const _gcLimit = 10000

async function _asyncQueueExecutor(queue: Array<QueueJob<any>>, cleanup: () => void): Promise<void> {
	let offt = 0
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const limit = Math.min(queue.length, _gcLimit)
		for (let i = offt; i < limit; i++) {
			const job = queue[i]
			try {
				job.resolve(await job.awaitable())
			} catch (e) {
				job.reject(e)
			}
		}

		if (limit < queue.length) {
			if (limit >= _gcLimit) {
				queue.splice(0, limit)
				offt = 0
			} else {
				offt = limit
			}
		} else {
			break
		}
	}

	cleanup()
}

export default function queueJob<T>(bucket: string | number, awaitable: () => Promise<T>): Promise<T> {
	// Skip name assignment since it's readonly in strict mode
	if (typeof bucket !== 'string') {
		console.warn('Unhandled bucket type (for naming):', typeof bucket, bucket)
	}

	let inactive = false
	if (!_queueAsyncBuckets.has(bucket)) {
		_queueAsyncBuckets.set(bucket, [])
		inactive = true
	}

	const queue = _queueAsyncBuckets.get(bucket)!
	const job = new Promise<T>((resolve, reject) => {
		queue.push({
			awaitable,
			resolve: resolve as (value: any) => void,
			reject
		})
	})

	if (inactive) {
		_asyncQueueExecutor(queue, () => _queueAsyncBuckets.delete(bucket))
	}

	return job
}
