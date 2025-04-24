import { USyncQueryProtocol } from '../../Types/USync'
import { BinaryNode } from '../../WABinary'

export class USyncLIDProtocol implements USyncQueryProtocol {
	name = 'lid'

	getQueryElement(): BinaryNode {
		return {
			tag: 'lid',
			attrs: {},
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): string | null {
		if(node.tag === 'lid') {
			return node.attrs.val
		}

		return null
	}
}
