import { proto } from '../../../WAProto/index.js'
import { isViewOnceMessage } from '../../Utils/messages'

describe('isViewOnceMessage', () => {
	const image = { imageMessage: { caption: 'hi' } }

	it('detects every view once wrapper', () => {
		expect(isViewOnceMessage({ viewOnceMessage: { message: image } })).toBe(true)
		expect(isViewOnceMessage({ viewOnceMessageV2: { message: image } })).toBe(true)
		expect(isViewOnceMessage({ viewOnceMessageV2Extension: { message: { audioMessage: { ptt: true } } } })).toBe(true)
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
	})
})
