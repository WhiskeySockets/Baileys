import { jest } from '@jest/globals'
import type { LIDMapping } from '../../Types'
import { resolveStatusJidList } from '../../Utils/status-broadcast'

type GetLIDsForPNs = (pns: string[]) => Promise<LIDMapping[] | null>

describe('resolveStatusJidList', () => {
	it('resolves PN recipients to LID and includes the sender LID', async () => {
		const getLIDsForPNs = jest.fn<GetLIDsForPNs>().mockResolvedValue([
			{ pn: '12345@s.whatsapp.net', lid: '54321@lid' }
		])

		await expect(
			resolveStatusJidList({
				statusJidList: ['12345@s.whatsapp.net', '77777@lid'],
				meLid: '88888:1@lid',
				getLIDsForPNs
			})
		).resolves.toEqual(['54321@lid', '77777@lid', '88888@lid'])

		expect(getLIDsForPNs).toHaveBeenCalledWith(['12345@s.whatsapp.net'])
	})

	it('deduplicates recipients after PN to LID resolution', async () => {
		const getLIDsForPNs = jest.fn<GetLIDsForPNs>().mockResolvedValue([
			{ pn: '99999@s.whatsapp.net', lid: '88888@lid' }
		])

		await expect(
			resolveStatusJidList({
				statusJidList: ['99999@s.whatsapp.net', '88888@lid'],
				meLid: '88888:1@lid',
				getLIDsForPNs
			})
		).resolves.toEqual(['88888@lid'])
	})

	it('fails instead of emitting mixed PN and LID recipients when a PN cannot be resolved', async () => {
		const getLIDsForPNs = jest.fn<GetLIDsForPNs>().mockResolvedValue(null)

		await expect(
			resolveStatusJidList({
				statusJidList: ['12345@s.whatsapp.net'],
				meLid: '88888:1@lid',
				getLIDsForPNs
			})
		).rejects.toThrow('Could not resolve LID for status recipient 12345@s.whatsapp.net')
	})

	it('does not query mappings when recipients are already LID addressed', async () => {
		const getLIDsForPNs = jest.fn<GetLIDsForPNs>()

		await expect(
			resolveStatusJidList({
				statusJidList: ['77777@lid'],
				meLid: '88888:1@lid',
				getLIDsForPNs
			})
		).resolves.toEqual(['77777@lid', '88888@lid'])

		expect(getLIDsForPNs).not.toHaveBeenCalled()
	})

	it('leaves legacy PN-only account recipients unchanged', async () => {
		const getLIDsForPNs = jest.fn<GetLIDsForPNs>()

		await expect(
			resolveStatusJidList({
				statusJidList: ['12345@s.whatsapp.net'],
				getLIDsForPNs
			})
		).resolves.toEqual(['12345@s.whatsapp.net'])

		expect(getLIDsForPNs).not.toHaveBeenCalled()
	})
})
