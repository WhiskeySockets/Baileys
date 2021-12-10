import { MediaType, DownloadableMessage } from '../Types'
import { downloadContentFromMessage } from '../Utils'
import { proto } from '../../WAProto'
import { readFileSync } from 'fs'

jest.setTimeout(20_000)

type TestVector = {
	type: MediaType
	message: DownloadableMessage
	plaintext: Buffer
}

const TEST_VECTORS: TestVector[] = [
	{
		type: 'image',
		message: proto.ImageMessage.decode(
			Buffer.from(
				'Ck1odHRwczovL21tZy53aGF0c2FwcC5uZXQvZC9mL0FwaHR4WG9fWXZZcDZlUVNSa0tjOHE5d2ozVUpleWdoY3poM3ExX3I0ektnLmVuYxIKaW1hZ2UvanBlZyIgKTuVFyxDc6mTm4GXPlO3Z911Wd8RBeTrPLSWAEdqW8MomcUBQiB7wH5a4nXMKyLOT0A2nFgnnM/DUH8YjQf8QtkCIekaSkogTB+BXKCWDFrmNzozY0DCPn0L4VKd7yG1ZbZwbgRhzVc=',
				'base64'
			)
		),
		plaintext: readFileSync('./Media/cat.jpeg')
	},
	{
		type: 'image',
		message: proto.ImageMessage.decode(
			Buffer.from(
				'Ck1odHRwczovL21tZy53aGF0c2FwcC5uZXQvZC9mL0Ftb2tnWkphNWF6QWZxa3dVRzc0eUNUdTlGeWpjMmd5akpqcXNmMUFpZEU5LmVuYxIKaW1hZ2UvanBlZyIg8IS5TQzdzcuvcR7F8HMhWnXmlsV+GOo9JE1/t2k+o9Yoz6o6QiA7kDk8j5KOEQC0kDFE1qW7lBBDYhm5z06N3SirfUj3CUog/CjYF8e670D5wUJwWv2B2mKzDEo8IJLStDv76YmtPfs=',
				'base64'
			)
		),
		plaintext: readFileSync('./Media/icon.png')
	},
]

describe('Media Download Tests', () => {

	it('should download a full encrypted media correctly', async() => {
		for(const { type, message, plaintext } of TEST_VECTORS) {
			const readPipe = await downloadContentFromMessage(message, type)
			
			let buffer = Buffer.alloc(0)
			for await(const read of readPipe) {
				buffer = Buffer.concat([ buffer, read ])
			}

			expect(buffer).toEqual(plaintext)
		}
	})

	it('should download an encrypted media correctly piece', async() => {
		for(const { type, message, plaintext } of TEST_VECTORS) {
			// check all edge cases
			const ranges = [
				{ startByte: 51, endByte: plaintext.length-100 }, // random numbers
				{ startByte: 1024, endByte: 2038 }, // larger random multiples of 16
				{ startByte: 1, endByte: plaintext.length-1 } // borders
			]
			for(const range of ranges) {
				const readPipe = await downloadContentFromMessage(message, type, range)
			
				let buffer = Buffer.alloc(0)
				for await(const read of readPipe) {
					buffer = Buffer.concat([ buffer, read ])
				}

				const hex = buffer.toString('hex')
				const expectedHex = plaintext.slice(range.startByte || 0, range.endByte || undefined).toString('hex')
				expect(hex).toBe(expectedHex)

				console.log('success on ', range)
			}
		}
	})
})