import { proto } from '../../WAProto'
import { BufferJSON } from './generics'

type ProtoMessageClass<T = any> = {
	new (...args: any[]): T
	decode(buffer: Uint8Array | Buffer): T
}

type DecodableProtoKey = {
	[K in keyof typeof proto]: (typeof proto)[K] extends ProtoMessageClass ? K : never
}[keyof typeof proto]

export function decodeAndHydrate<T extends DecodableProtoKey>(
	type: T,
	buffer: Uint8Array | Buffer
): InstanceType<(typeof proto)[T]> {
	const MessageType = proto[type]

	const decoded = MessageType.decode(buffer)
	const hydrated = JSON.parse(JSON.stringify(decoded, BufferJSON.replacer), BufferJSON.reviver)

	return hydrated as InstanceType<(typeof proto)[T]>
}
