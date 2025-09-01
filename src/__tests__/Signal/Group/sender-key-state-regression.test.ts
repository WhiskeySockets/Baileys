import { SenderKeyState } from '../../../Signal/Group/sender-key-state'
import { SenderMessageKey } from '../../../Signal/Group/sender-message-key'

describe('SenderKeyState regression: missing senderMessageKeys array', () => {
	it('should initialize senderMessageKeys when absent in provided structure', () => {
		const legacyStructure = {
			senderKeyId: 42,
			senderChainKey: { iteration: 0, seed: Buffer.from([1, 2, 3]) },
			senderSigningKey: { public: Buffer.from([4, 5, 6]) }
		}

		const state = new SenderKeyState(null, null, null, null, null, null, legacyStructure as any)
		const msgKey = new SenderMessageKey(0, Buffer.from([7, 8, 9]))
		state.addSenderMessageKey(msgKey)

		const structure = state.getStructure()
		expect(structure.senderMessageKeys).toBeDefined()
		expect(Array.isArray(structure.senderMessageKeys)).toBe(true)
		expect(structure.senderMessageKeys.length).toBe(1)
		expect(structure.senderMessageKeys[0]?.iteration).toBe(0)
	})
})
