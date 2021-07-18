
const makeOrderedDictionary = function<T>(idGetter: (item: T) => string) {
	const array: T[] = []
	const dict: { [_: string]: T } = { }

	const get = (id: string) => dict[id]

	const update = (item: T) => {
		const id = idGetter(item)
		const idx = array.findIndex(i => idGetter(i) === id)
		if(idx >= 0) {
			array[idx] = item
			dict[id] = item
		}
		return false
	}

	const upsert = (item: T, mode: 'append' | 'prepend') => {
		const id = idGetter(item)
		if(get(id)) {
			update(item)
		} else {
			if(mode === 'append') {
				array.push(item)
			} else {
				array.splice(0, 0, item)
			}
			dict[id] = item
		}
	}
	
	const remove = (item: T) => {
		const id = idGetter(item)
		const idx = array.findIndex(i => idGetter(i) === id)
		if(idx >= 0) {
			array.splice(idx, 1)
			delete dict[id]
			return true
		}
		return false
	}

	return {
		array,
		get,
		upsert,
		update,
		remove,
		updateAssign: (update: Partial<T>) => {
			const item = get(idGetter(update as any))
			if(item) {
				Object.assign(item, update)
				return true
			}
			return false
		},
		clear: () => {
			array.splice(0, array.length)
			Object.keys(dict).forEach(key => { delete dict[key] })
		},
		filter: (contain: (item: T) => boolean) => {
			//const copy = 
		}
	}
}
export default makeOrderedDictionary
//export type OrderedDictionary<T> = ReturnType<typeof makeOrderedDictionary>