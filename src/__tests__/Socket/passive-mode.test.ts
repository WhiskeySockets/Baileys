import { getPassiveModeIqTag } from '../../Utils/passive-mode'

describe('passive mode IQ selection', () => {
	it('keeps the companion passive when markOnlineOnConnect is false', () => {
		expect(getPassiveModeIqTag(false)).toBe('passive')
	})

	it('marks the companion active when markOnlineOnConnect is true', () => {
		expect(getPassiveModeIqTag(true)).toBe('active')
	})
})
