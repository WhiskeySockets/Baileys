import { jest } from '@jest/globals'
import {
	type ContactPictureIdentityContext,
	resolveContactPictureIdentity
} from '../../Utils/contact-picture-identity'

type ResolverFn = (jid: string) => Promise<string | null>

describe('resolveContactPictureIdentity', () => {
	let mockGetPNForLID: jest.Mock<ResolverFn>
	let mockGetLIDForPN: jest.Mock<ResolverFn>

	const ME_ID = 'myuser@s.whatsapp.net'
	const ME_LID = 'mylid@lid'

	function createContext(): ContactPictureIdentityContext {
		return {
			getPNForLID: mockGetPNForLID,
			getLIDForPN: mockGetLIDForPN,
			meId: ME_ID,
			meLid: ME_LID
		}
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockGetPNForLID = jest.fn<ResolverFn>().mockResolvedValue(null)
		mockGetLIDForPN = jest.fn<ResolverFn>().mockResolvedValue(null)
	})

	it('resolves a LID to a PN and fills id, phoneNumber and lid', async () => {
		mockGetPNForLID.mockResolvedValue('12345:0@s.whatsapp.net')

		const result = await resolveContactPictureIdentity('98765@lid', createContext())

		expect(result).toEqual({
			id: '12345@s.whatsapp.net',
			phoneNumber: '12345@s.whatsapp.net',
			lid: '98765@lid'
		})
		expect(mockGetPNForLID).toHaveBeenCalledWith('98765@lid')
	})

	it('falls back to the raw LID when it cannot be resolved', async () => {
		mockGetPNForLID.mockResolvedValue(null)

		const result = await resolveContactPictureIdentity('98765@lid', createContext())

		expect(result).toEqual({ id: '98765@lid', lid: '98765@lid' })
		expect(result.phoneNumber).toBeUndefined()
	})

	it('discards a resolution that points at our own PN (bogus self) and keeps the raw LID', async () => {
		// a stranger's LID wrongly resolving to our own number must not be emitted as the contact
		mockGetPNForLID.mockResolvedValue(ME_ID)

		const result = await resolveContactPictureIdentity('98765@lid', createContext())

		expect(result).toEqual({ id: '98765@lid', lid: '98765@lid' })
		expect(result.phoneNumber).toBeUndefined()
	})

	it('keeps the resolved own PN when the source LID is our own LID', async () => {
		mockGetPNForLID.mockResolvedValue(ME_ID)

		const result = await resolveContactPictureIdentity(ME_LID, createContext())

		expect(result).toEqual({
			id: ME_ID,
			phoneNumber: ME_ID,
			lid: ME_LID
		})
	})

	it('fills lid from getLIDForPN when the input is a PN', async () => {
		mockGetLIDForPN.mockResolvedValue('98765@lid')

		const result = await resolveContactPictureIdentity('12345@s.whatsapp.net', createContext())

		expect(result).toEqual({
			id: '12345@s.whatsapp.net',
			phoneNumber: '12345@s.whatsapp.net',
			lid: '98765@lid'
		})
		expect(mockGetLIDForPN).toHaveBeenCalledWith('12345@s.whatsapp.net')
	})

	it('only fills phoneNumber when the PN resolves to a non-LID value', async () => {
		mockGetLIDForPN.mockResolvedValue('not-a-lid@s.whatsapp.net')

		const result = await resolveContactPictureIdentity('12345@s.whatsapp.net', createContext())

		expect(result).toEqual({ id: '12345@s.whatsapp.net', phoneNumber: '12345@s.whatsapp.net' })
		expect(result.lid).toBeUndefined()
	})

	it('swallows resolver errors and falls back to the raw LID', async () => {
		mockGetPNForLID.mockRejectedValue(new Error('lookup failed'))

		const result = await resolveContactPictureIdentity('98765@lid', createContext())

		expect(result).toEqual({ id: '98765@lid', lid: '98765@lid' })
	})

	it('does not attempt resolution for hosted LIDs (leaves id untouched)', async () => {
		const result = await resolveContactPictureIdentity('98765@hosted.lid', createContext())

		expect(result).toEqual({ id: '98765@hosted.lid' })
		expect(mockGetPNForLID).not.toHaveBeenCalled()
		expect(mockGetLIDForPN).not.toHaveBeenCalled()
	})
})
