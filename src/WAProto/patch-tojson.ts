import $protobuf from 'protobufjs/minimal.js'
import { proto } from '../../WAProto/index.js'

const PATCHED_SYMBOL = Symbol.for('baileys.proto.tojson.patched')

const isMessageConstructor = (value: unknown): value is {
	encode: (message: unknown) => $protobuf.Writer
	decode: (buffer: Uint8Array) => unknown
	toObject: (message: unknown, options?: $protobuf.IConversionOptions) => Record<string, unknown>
	prototype: Record<string, unknown>
} => {
	return (
		typeof value === 'function' &&
		!!value.prototype &&
		typeof (value as any).encode === 'function' &&
		typeof (value as any).decode === 'function' &&
		typeof (value as any).toObject === 'function'
	)
}

const patchConstructor = (ctor: unknown) => {
	if (!isMessageConstructor(ctor)) {
		return
	}

	const protoCtor = ctor as unknown as {
		prototype: { toJSON?: () => Record<string, unknown>; [PATCHED_SYMBOL]?: boolean }
		encode: (message: unknown) => $protobuf.Writer
		decode: (buffer: Uint8Array) => unknown
		toObject: (message: unknown, options?: $protobuf.IConversionOptions) => Record<string, unknown>
	}

	if (protoCtor.prototype[PATCHED_SYMBOL]) {
		return
	}

	const original = protoCtor.prototype.toJSON

	protoCtor.prototype.toJSON = function patchedToJSON() {
		try {
			const encoded = protoCtor.encode(this).finish()
			const normalised = protoCtor.decode(encoded)
			return protoCtor.toObject(normalised, $protobuf.util.toJSONOptions)
		} catch (error) {
			if (typeof original === 'function') {
				return original.call(this)
			}

			throw error
		}
	}

	Object.defineProperty(protoCtor.prototype, PATCHED_SYMBOL, {
		value: true,
		enumerable: false,
		configurable: false
	})
}

const visit = (value: unknown, seen = new Set<unknown>()) => {
	if (!value) {
		return
	}

	const valueType = typeof value
	if ((valueType !== 'object' && valueType !== 'function') || seen.has(value)) {
		return
	}

	seen.add(value)

	for (const child of Object.values(value)) {
		if (!child) {
			continue
		}

		if (isMessageConstructor(child)) {
			patchConstructor(child)
		}

		const childType = typeof child
		if ((childType === 'object' || childType === 'function') && child !== value) {
			visit(child, seen)
		}
	}
}

visit(proto)
