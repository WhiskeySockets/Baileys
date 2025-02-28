import { test } from 'node:test';
import assert from 'node:assert';
import { WAMessageContent } from '../Types'
import { normalizeMessageContent } from '../Utils'

test('Messages Tests', async (t) => {

	await t.test('should correctly unwrap messages', () => {
		const CONTENT = { imageMessage: { } }
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
			assert.ok(
				normalizeMessageContent(content)?.imageMessage
			)
		}
	})
})