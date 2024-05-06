import { EventInputType } from './constants'

export class BinaryInfo {
	protocolVersion = 5
	sequence = 0
	events = [] as EventInputType[]
	buffer: Buffer[] = []

	constructor(options: Partial<BinaryInfo> = {}) {
		Object.assign(this, options)
	}
}
