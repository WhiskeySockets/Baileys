import { buildProfilePictureQueryContent } from '../../Socket/chats'
import type { BinaryNode } from '../../WABinary'

describe('buildProfilePictureQueryContent', () => {
	it('builds a profile picture query without tctoken content', () => {
		expect(buildProfilePictureQueryContent('preview')).toEqual([
			{
				tag: 'picture',
				attrs: { type: 'preview', query: 'url' }
			}
		])
	})

	it('nests tctoken under the picture node', () => {
		const tcToken: BinaryNode = {
			tag: 'tctoken',
			attrs: { t: '1770000000' },
			content: Buffer.from([4, 1, 33])
		}

		expect(buildProfilePictureQueryContent('image', [tcToken])).toEqual([
			{
				tag: 'picture',
				attrs: { type: 'image', query: 'url' },
				content: [tcToken]
			}
		])
	})
})
