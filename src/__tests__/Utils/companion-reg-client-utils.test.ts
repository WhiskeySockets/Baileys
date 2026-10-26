import { Browsers } from '../../Utils/browser-utils'
import { getPairingCodePlatform } from '../../Utils/companion-reg-client-utils'

describe('getPairingCodePlatform', () => {
	it('normalizes a custom OS label to a canonical pairing display', () => {
		expect(getPairingCodePlatform(['Aidy Staging', 'Chrome', '20.0.04'])).toEqual({
			id: '1',
			display: 'Chrome (Mac OS)'
		})
	})

	it('preserves Ubuntu as a canonical pairing display OS', () => {
		expect(getPairingCodePlatform(Browsers.ubuntu('Chrome'))).toEqual({
			id: '1',
			display: 'Chrome (Ubuntu)'
		})
	})

	it('uses the Safari pairing platform id', () => {
		expect(getPairingCodePlatform(Browsers.macOS('Safari'))).toEqual({
			id: '5',
			display: 'Safari (Mac OS)'
		})
	})

	it('falls back to Chrome for non-browser platform names', () => {
		expect(getPairingCodePlatform(Browsers.macOS('Desktop'))).toEqual({
			id: '1',
			display: 'Chrome (Mac OS)'
		})

		expect(getPairingCodePlatform(Browsers.macOS('Unknown Browser'))).toEqual({
			id: '1',
			display: 'Chrome (Mac OS)'
		})
	})
})
