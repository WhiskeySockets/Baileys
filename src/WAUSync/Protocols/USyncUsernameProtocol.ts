import type { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, type BinaryNode } from '../../WABinary'
import { USyncUser } from '../USyncUser'

export class USyncUsernameProtocol implements USyncQueryProtocol {
	name = 'username'

	getQueryElement(): BinaryNode {
		return {
			tag: 'username',
			attrs: {}
		}
	}

	getUserElement(user: USyncUser): BinaryNode | null {
		void user
		return null
	}

	parser(node: BinaryNode): string | null {
		if (node.tag === 'username') {
			assertNodeErrorFree(node)
			return typeof node.content === 'string' ? node.content : null
		}

		return null
	}
}
