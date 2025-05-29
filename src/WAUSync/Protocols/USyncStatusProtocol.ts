import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode } from '../../WABinary'

export type StatusData = {
	status?: string | null
	setAt?: Date
}

export class USyncStatusProtocol implements USyncQueryProtocol {
	name = 'status'

	getQueryElement(): BinaryNode {
		return {
			tag: 'status',
			attrs: {}
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): StatusData | undefined {
		if (node.tag === 'status') {
			assertNodeErrorFree(node)
			let status: string | null = node?.content?.toString() ?? null
			const setAt = new Date(+(node?.attrs.t || 0) * 1000)
			if (!status) {
				if (+node.attrs?.code === 401) {
					status = ''
				} else {
					status = null
				}
			} else if (typeof status === 'string' && status.length === 0) {
				status = null
			}

			return {
				status,
				setAt
			}
		}
	}
}
