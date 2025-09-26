import { BufferJSON } from './generics'

type ProtoMessageClass<T> = {
	new (...args: any[]): T
	decode(buffer: Uint8Array | Buffer): T
}

export function decodeAndHydrate<T>(MessageType: ProtoMessageClass<T>, buffer: Uint8Array | Buffer): T {
	const decoded = MessageType.decode(buffer)
	const hydrated = JSON.parse(JSON.stringify(decoded, BufferJSON.replacer), BufferJSON.reviver)
	return hydrated as T
}
