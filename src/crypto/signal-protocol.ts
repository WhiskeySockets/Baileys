import nodeCrypto from 'node:crypto'

export function calculateMAC(key: Buffer, data: Buffer) {
	const hmac = nodeCrypto.createHmac('sha256', key)
	hmac.update(data)
	return Buffer.from(hmac.digest())
}

export function deriveSecrets(input: Buffer, salt: Buffer, info: Buffer, chunks = 3) {
	if (salt.byteLength !== 32) {
		throw new Error('Got salt of incorrect length')
	}

	if (chunks < 1 || chunks > 3) {
		throw new Error('Chunks must be between 1 and 3')
	}

	const PRK = calculateMAC(salt, input)
	const infoArray = new Uint8Array(info.byteLength + 1 + 32)
	infoArray.set(info, 32)
	infoArray[infoArray.length - 1] = 1
	const signed = [calculateMAC(PRK, Buffer.from(infoArray.slice(32)))]
	if (chunks > 1) {
		infoArray.set(signed[signed.length - 1])
		infoArray[infoArray.length - 1] = 2
		signed.push(calculateMAC(PRK, Buffer.from(infoArray)))
	}

	if (chunks > 2) {
		infoArray.set(signed[signed.length - 1])
		infoArray[infoArray.length - 1] = 3
		signed.push(calculateMAC(PRK, Buffer.from(infoArray)))
	}

	return signed
}

export function verifyMAC(data: Buffer, key: Buffer, mac: Buffer, length: number) {
	const calculatedMac = calculateMAC(key, data).slice(0, length)
	if (mac.length !== length || calculatedMac.length !== length) {
		throw new Error('Bad MAC length')
	}

	if (!mac.equals(calculatedMac)) {
		throw new Error('Bad MAC')
	}
}

export function hmacSign(
	buffer: Buffer | Uint8Array,
	key: Buffer | Uint8Array,
	variant: 'sha256' | 'sha512' = 'sha256'
) {
	return nodeCrypto.createHmac(variant, key).update(buffer).digest()
}

export function sha256(buffer: Buffer) {
	return require('crypto').createHash('sha256').update(buffer).digest()
}
