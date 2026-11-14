import { proto } from '../../../WAProto/index.js'
import { isViewOnceMessage } from '../../Utils/messages'

describe('isViewOnceMessage', () => {
	const image = { imageMessage: { caption: 'hi' } }

	it('detects every view once wrapper', () => {
		expect(isViewOnceMessage({ viewOnceMessage: { message: image } })).toBe(true)
		expect(isViewOnceMessage({ viewOnceMessageV2: { message: image } })).toBe(true)
		expect(isViewOnceMessage({ viewOnceMessageV2Extension: { message: { audioMessage: { ptt: true } } } })).toBe(true)
		expect(isViewOnceMessage({ viewOnceMessage: { message: { ptvMessage: { seconds: 5 } } } })).toBe(true)
	})

	it('looks through a disappearing message wrapper', () => {
		expect(isViewOnceMessage({ ephemeralMessage: { message: { viewOnceMessageV2: { message: image } } } })).toBe(true)
		expect(isViewOnceMessage({ ephemeralMessage: { message: image } })).toBe(false)
	})

	it('ignores view once wrappers around non-media content', () => {
		const buttons = { buttonsMessage: { contentText: 'pick one' } }
		expect(isViewOnceMessage({ viewOnceMessage: { message: buttons } })).toBe(false)
		expect(isViewOnceMessage({ viewOnceMessageV2: { message: { conversation: 'hi' } } })).toBe(false)
		expect(isViewOnceMessage({ viewOnceMessage: {} })).toBe(false)
	})

	it('ignores regular and empty content', () => {
		expect(isViewOnceMessage(image)).toBe(false)
		expect(isViewOnceMessage({ conversation: 'hello' })).toBe(false)
		expect(isViewOnceMessage(undefined)).toBe(false)
		expect(isViewOnceMessage(null)).toBe(false)
	})

	it('works on decoded protobuf messages', () => {
		const encoded = proto.Message.encode({ viewOnceMessageV2: { message: image } }).finish()
		expect(isViewOnceMessage(proto.Message.decode(encoded))).toBe(true)
		const plain = proto.Message.encode({ conversation: 'hello' }).finish()
		expect(isViewOnceMessage(proto.Message.decode(plain))).toBe(false)
	})
})
