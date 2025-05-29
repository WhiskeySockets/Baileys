import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode } from '../../WABinary'

export type DisappearingModeData = {
	duration: number
	setAt?: Date
}

export class USyncDisappearingModeProtocol implements USyncQueryProtocol {
	name = 'disappearing_mode'

	getQueryElement(): BinaryNode {
		return {
			tag: 'disappearing_mode',
			attrs: {}
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): DisappearingModeData | undefined {
		if (node.tag === 'status') {
			assertNodeErrorFree(node)
			const duration: number = +node?.attrs.duration
			const setAt = new Date(+(node?.attrs.t || 0) * 1000)

			return {
				duration,
				setAt
			}
		}
	}
}
