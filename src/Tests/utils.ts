import { SignalDataTypeMap, SignalKeyStore } from '../Types'
import { jidEncode } from '../WABinary'

export function randomJid() {
	return jidEncode(Math.floor(Math.random() * 1000000), Math.random() < 0.5 ? 's.whatsapp.net' : 'g.us')
}

export function makeMockSignalKeyStore(): SignalKeyStore {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const store: { [_: string]: any } = {}

	return {
		get(type, ids) {
			const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
			for(const id of ids) {
				const item = store[getUniqueId(type, id)]
				if(typeof item !== 'undefined') {
					data[id] = item
				}
			}

			return data
		},
		set(data) {
			for(const type in data) {
				for(const id in data[type]) {
					store[getUniqueId(type, id)] = data[type][id]
				}
			}
		},
	}

	function getUniqueId(type: string, id: string) {
		return `${type}.${id}`
	}
}