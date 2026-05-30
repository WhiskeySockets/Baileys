import { extractLinkCodeCompanionRegBuffers } from '../../Socket/messages-recv'
import type { BinaryNode } from '../../WABinary'

const linkCodeCompanionRegNode = (content?: BinaryNode[]): BinaryNode => ({
	tag: 'notification',
	attrs: {
		from: '@s.whatsapp.net',
		type: 'link_code_companion_reg',
		id: '3728034975'
	},
	content
})

describe('extractLinkCodeCompanionRegBuffers', () => {
	it('returns undefined for notification without pairing data', () => {
		expect(extractLinkCodeCompanionRegBuffers(linkCodeCompanionRegNode())).toBeUndefined()
	})

	it('returns undefined when a required pairing field is missing', () => {
		const node = linkCodeCompanionRegNode([
			{
				tag: 'link_code_companion_reg',
				attrs: {},
				content: [
					{ tag: 'link_code_pairing_ref', attrs: {}, content: Buffer.from('ref') },
					{ tag: 'primary_identity_pub', attrs: {}, content: Buffer.from('identity') }
				]
			}
		])

		expect(extractLinkCodeCompanionRegBuffers(node)).toBeUndefined()
	})

	it('extracts required pairing buffers', () => {
		const ref = Buffer.from('ref')
		const primaryIdentityPublicKey = Buffer.from('identity')
		const primaryEphemeralPublicKeyWrapped = new Uint8Array([1, 2, 3])
		const node = linkCodeCompanionRegNode([
			{
				tag: 'link_code_companion_reg',
				attrs: {},
				content: [
					{ tag: 'link_code_pairing_ref', attrs: {}, content: ref },
					{ tag: 'primary_identity_pub', attrs: {}, content: primaryIdentityPublicKey },
					{
						tag: 'link_code_pairing_wrapped_primary_ephemeral_pub',
						attrs: {},
						content: primaryEphemeralPublicKeyWrapped
					}
				]
			}
		])

		const result = extractLinkCodeCompanionRegBuffers(node)

		expect(result).toEqual({
			ref,
			primaryIdentityPublicKey,
			primaryEphemeralPublicKeyWrapped: Buffer.from(primaryEphemeralPublicKeyWrapped)
		})
	})
})
