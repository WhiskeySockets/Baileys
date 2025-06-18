import { WAMessageContent } from '../Types'
import { normalizeMessageContent } from '../Utils'

describe('Messages Tests', () => {
	it('should correctly unwrap messages', () => {
		const CONTENT = { imageMessage: {} }
		expectRightContent(CONTENT)
		expectRightContent({
			ephemeralMessage: { message: CONTENT }
		})
		expectRightContent({
			viewOnceMessage: {
				message: {
					ephemeralMessage: { message: CONTENT }
				}
			}
		})
		expectRightContent({
			viewOnceMessage: {
				message: {
					viewOnceMessageV2: {
						message: {
							ephemeralMessage: { message: CONTENT }
						}
					}
				}
			}
		})

		function expectRightContent(content: WAMessageContent) {
			expect(normalizeMessageContent(content)).toHaveProperty('imageMessage')
		}
	})
})
