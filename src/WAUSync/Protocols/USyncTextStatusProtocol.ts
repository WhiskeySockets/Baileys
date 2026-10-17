import type { USyncQueryProtocol } from '../../Types/USync'
import { type BinaryNode, getBinaryNodeChild } from '../../WABinary'

export type TextStatusData = {
	text?: string
	emoji?: string
	ephemeralDurationSeconds?: number
	lastUpdateTime?: Date
}

export class USyncTextStatusProtocol implements USyncQueryProtocol {
	name = 'text_status'

	getQueryElement(): BinaryNode {
		return {
			tag: 'text_status',
			attrs: {}
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): TextStatusData | undefined {
		if (node.tag === 'text_status') {
			if (getBinaryNodeChild(node, 'error')) {
				return undefined
			}

			const text = node.attrs?.text
			const emojiChild = getBinaryNodeChild(node, 'emoji')
			const emoji = emojiChild?.attrs?.content
			const ephemeralDurationSeconds = node.attrs?.ephemeral_duration_sec
				? +node.attrs.ephemeral_duration_sec
				: undefined
			const lastUpdateTime = node.attrs?.last_update_time ? new Date(+node.attrs.last_update_time * 1000) : undefined

			return {
				text,
				emoji,
				ephemeralDurationSeconds,
				lastUpdateTime
			}
		}
	}
}
