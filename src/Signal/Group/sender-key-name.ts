interface Sender {
	id: string
	deviceId: number
	toString(): string
}

function isNull(str: string | null): boolean {
	return str === null || str === ''
}

function intValue(num: number): number {
	const MAX_VALUE = 0x7fffffff
	const MIN_VALUE = -0x80000000
	if (num > MAX_VALUE || num < MIN_VALUE) {
		return num & 0xffffffff
	}

	return num
}

function hashCode(strKey: string): number {
	let hash = 0
	if (!isNull(strKey)) {
		for (let i = 0; i < strKey.length; i++) {
			hash = hash * 31 + strKey.charCodeAt(i)
			hash = intValue(hash)
		}
	}

	return hash
}

export class SenderKeyName {
	private readonly groupId: string
	private readonly sender: Sender

	constructor(groupId: string, sender: Sender) {
		this.groupId = groupId
		this.sender = sender
	}

	public getGroupId(): string {
		return this.groupId
	}

	public getSender(): Sender {
		return this.sender
	}

	public serialize(): string {
		return `${this.groupId}::${this.sender.id}::${this.sender.deviceId}`
	}

	public toString(): string {
		return this.serialize()
	}

	public equals(other: SenderKeyName | null): boolean {
		if (other === null) return false
		return this.groupId === other.groupId && this.sender.toString() === other.sender.toString()
	}

	public hashCode(): number {
		return hashCode(this.groupId) ^ hashCode(this.sender.toString())
	}
}
