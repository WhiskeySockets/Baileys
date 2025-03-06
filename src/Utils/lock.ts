export class Lock {
	queue: Function[]
	locked: boolean
	constructor() {
		this.queue = [] // Queue of waiting operations
		this.locked = false // Lock status
	}

	async acquire() {
		if(this.locked) {
			// If locked, wait until released
			await new Promise(resolve => this.queue.push(resolve))
		}

		this.locked = true // Acquire the lock
	}

	release() {
		if(this.queue.length > 0) {
			// Release to the next waiting operation
			const resolve = this.queue.shift()
			resolve?.()
		} else {
			// No one waiting, unlock
			this.locked = false
		}
	}
}