import type { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, type BinaryNode } from '../../WABinary'
import { USyncUser } from '../USyncUser'

export class USyncContactProtocol implements USyncQueryProtocol {
	name = 'contact'

	getQueryElement(): BinaryNode {
		return {
			tag: 'contact',
			attrs: {}
		}
	}

	getUserElement(user: USyncUser): BinaryNode {
		if (user.phone) {
			return {
				tag: 'contact',
				attrs: {},
				content: user.phone
			}
		}

		// username/type/lid are combinable: a username lookup may also require a
		// contact `type` (e.g. INBOUND). Merging keeps all advertised fields on a
		// single contact stanza instead of letting username silently drop `type`.
		const attrs: BinaryNode['attrs'] = {}
		if (user.username) attrs.username = user.username
		if (user.usernameKey) attrs.pin = user.usernameKey
		if (user.lid) attrs.lid = user.lid
		if (user.type) attrs.type = user.type

		return {
			tag: 'contact',
			attrs
		}
	}

	parser(node: BinaryNode): boolean {
		if (node.tag === 'contact') {
			assertNodeErrorFree(node)
			return node?.attrs?.type === 'in'
		}

		return false
	}
}
