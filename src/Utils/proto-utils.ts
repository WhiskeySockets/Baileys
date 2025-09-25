import { proto } from '../../WAProto'

type ProtoMessageClass<T = any> = {
	new (...args: any[]): T
	decode(buffer: Uint8Array | Buffer): T
}

type DecodableProtoKey = {
	[K in keyof typeof proto]: (typeof proto)[K] extends ProtoMessageClass ? K : never
}[keyof typeof proto]

function recursivelyNormalizeBuffer(obj: any): any {
	if (!obj || typeof obj !== 'object' || Buffer.isBuffer(obj)) {
		return obj
	}

	if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
		return Buffer.from(obj.data)
	}

	const keys = Object.keys(obj)
	if (keys.length > 0 && keys.every(k => !isNaN(parseInt(k, 10)))) {
		return Buffer.from(Object.values(obj))
	}

	if (Array.isArray(obj)) {
		return obj.map(recursivelyNormalizeBuffer)
	}

	const newObj: { [key: string]: any } = {}
	for (const key of keys) {
		newObj[key] = recursivelyNormalizeBuffer(obj[key])
	}

	return newObj
}

export function decodeAndHydrate<T extends DecodableProtoKey>(
	type: T,
	buffer: Uint8Array | Buffer
): InstanceType<(typeof proto)[T]> {
	const MessageType = proto[type]

	const decoded = MessageType.decode(buffer)
	const hydrated = recursivelyNormalizeBuffer(decoded)

	return hydrated as InstanceType<(typeof proto)[T]>
}
