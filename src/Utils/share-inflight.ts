/**
 * Shares one in-flight Promise per composite key until it settles (success or rejection).
 * Use for merging identical concurrent work; do not reuse for distinct logical payloads.
 */
export const shareInflightPromise = async <T>(bag: Map<string, Promise<T>>, key: string, create: () => Promise<T>): Promise<T> => {
	let pending = bag.get(key)
	if (pending) {
		return pending
	}

	const created = create()
	const tracked = created.finally(() => {
		if (bag.get(key) === tracked) {
			bag.delete(key)
		}
	})

	bag.set(key, tracked)

	return tracked
}
