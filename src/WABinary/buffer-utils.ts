/**
 * Efficient Buffer writer that avoids creating intermediate arrays
 * and copies. Writes directly to a pre-allocated Buffer, growing
 * it exponentially as needed.
 */
export class BufferWriter {
	private buffer: Buffer
	private offset: number = 0

	constructor(initialSize: number = 1024 * 8) {
		this.buffer = Buffer.alloc(initialSize)
	}

	private ensureCapacity(needed: number) {
		if (this.offset + needed > this.buffer.length) {
			// Grow buffer exponentially (2x)
			const newSize = Math.max(this.buffer.length * 2, this.offset + needed)
			const newBuffer = Buffer.alloc(newSize)
			this.buffer.copy(newBuffer, 0, 0, this.offset)
			this.buffer = newBuffer
		}
	}

	public writeByte(value: number): void {
		this.ensureCapacity(1)
		this.buffer.writeUInt8(value & 0xff, this.offset)
		this.offset += 1
	}

	public writeBytes(data: Uint8Array | Buffer | number[]): void {
		const len = data.length
		this.ensureCapacity(len)

		if (Buffer.isBuffer(data)) {
			// Fast path for Buffer - use native copy
			data.copy(this.buffer, this.offset)
		} else if (data instanceof Uint8Array) {
			// Uint8Array - use set
			this.buffer.set(data, this.offset)
		} else {
			// Fallback for number arrays
			for (let i = 0; i < len; i++) {
				const byte = data[i]
				if (typeof byte !== 'undefined') {
					this.buffer[this.offset + i] = byte & 0xff
				}
			}
		}

		this.offset += len
	}

	public writeInt(value: number, n: number, littleEndian = false): void {
		this.ensureCapacity(n)

		for (let i = 0; i < n; i++) {
			const curShift = littleEndian ? i : n - 1 - i
			this.buffer.writeUInt8((value >> (curShift * 8)) & 0xff, this.offset + i)
		}

		this.offset += n
	}

	public writeInt16(value: number): void {
		this.ensureCapacity(2)
		this.buffer.writeUInt16BE(value, this.offset)
		this.offset += 2
	}

	public writeInt20(value: number): void {
		this.ensureCapacity(3)
		this.buffer.writeUInt8((value >> 16) & 0x0f, this.offset)
		this.buffer.writeUInt8((value >> 8) & 0xff, this.offset + 1)
		this.buffer.writeUInt8(value & 0xff, this.offset + 2)
		this.offset += 3
	}

	public writeInt32(value: number): void {
		this.ensureCapacity(4)
		this.buffer.writeUInt32BE(value, this.offset)
		this.offset += 4
	}

	/**
	 * Returns a slice of the buffer containing only the written data
	 */
	public toBuffer(): Buffer {
		return this.buffer.slice(0, this.offset)
	}

	/**
	 * Get current write offset
	 */
	public getOffset(): number {
		return this.offset
	}
}

/**
 * Efficient Buffer reader that avoids creating excessive slice objects.
 * Manages offset internally for clean API.
 */
export class BufferReader {
	private offset: number = 0

	constructor(private buffer: Buffer) {}

	private checkEOS(length: number): void {
		if (this.offset + length > this.buffer.length) {
			throw new Error('end of stream')
		}
	}

	public readByte(): number {
		this.checkEOS(1)
		const value = this.buffer.readUInt8(this.offset)
		this.offset += 1
		return value
	}

	public readBytes(n: number): Buffer {
		this.checkEOS(n)
		// Use subarray instead of slice for view semantics when possible,
		// but return as Buffer for consistency
		const value = this.buffer.subarray(this.offset, this.offset + n) as unknown as Buffer
		this.offset += n
		return value
	}

	public readStringFromChars(length: number): string {
		this.checkEOS(length)
		const value = this.buffer.toString('utf-8', this.offset, this.offset + length)
		this.offset += length
		return value
	}

	public readInt(n: number, littleEndian = false): number {
		this.checkEOS(n)
		let val = 0

		for (let i = 0; i < n; i++) {
			const shift = littleEndian ? i : n - 1 - i
			val |= this.buffer.readUInt8(this.offset + i) << (shift * 8)
		}

		this.offset += n
		return val
	}

	public readInt20(): number {
		this.checkEOS(3)
		const b1 = this.buffer.readUInt8(this.offset)
		const b2 = this.buffer.readUInt8(this.offset + 1)
		const b3 = this.buffer.readUInt8(this.offset + 2)
		this.offset += 3
		return ((b1 & 15) << 16) + (b2 << 8) + b3
	}

	public readInt16(): number {
		this.checkEOS(2)
		const value = this.buffer.readUInt16BE(this.offset)
		this.offset += 2
		return value
	}

	public readInt32(): number {
		this.checkEOS(4)
		const value = this.buffer.readUInt32BE(this.offset)
		this.offset += 4
		return value
	}

	/**
	 * Get current read offset
	 */
	public getOffset(): number {
		return this.offset
	}

	/**
	 * Set read offset (useful for recursive decoding)
	 */
	public setOffset(offset: number): void {
		this.offset = offset
	}
}
