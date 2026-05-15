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
			if (typeof node.content === 'string') {
				return node.content
			}

			// Username may arrive as Uint8Array/Buffer — decode as UTF-8.
			// (Plain Uint8Array.prototype.toString() returns comma-separated byte
			// values like "97,98", not the actual text — use Buffer or TextDecoder.)
			if (node.content instanceof Uint8Array) {
				const decoded = Buffer.from(node.content).toString('utf8')
				return decoded.length > 0 ? decoded : null
			}
		}

		return null
	}
}
