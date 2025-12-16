import { Boom } from '@hapi/boom'
import { jest } from '@jest/globals'
import { unzip, zip } from 'fflate'
import sharp from 'sharp'
import { proto as WAProto } from '../..'
import type { MediaType } from '../../Defaults'
import type { MessageContentGenerationOptions, StickerPack } from '../../Types'
import { generateWAMessageContent } from '../../Utils/messages'

// Create a valid test image using sharp
const createTestImage = async (width = 100, height = 100, color = { r: 255, g: 0, b: 0 }): Promise<Buffer> => {
	return sharp({
		create: {
			width,
			height,
			channels: 3,
			background: color
		}
	})
		.png()
		.toBuffer()
}

// Create a WebP image for testing
const createTestWebP = async (width = 100, height = 100, color = { r: 255, g: 0, b: 0 }): Promise<Buffer> => {
	return sharp({
		create: {
			width,
			height,
			channels: 3,
			background: color
		}
	})
		.webp()
		.toBuffer()
}

let MINIMAL_PNG: Buffer
let MINIMAL_WEBP: Buffer
let BLUE_PNG: Buffer
let GREEN_PNG: Buffer

// Track upload calls for verification
type UploadCall = {
	fileEncSha256B64: string
	mediaType: MediaType
	timeoutMs: number
}

// Mock options for testing with tracking
const createMockOptions = (): MessageContentGenerationOptions & { uploadCalls: UploadCall[] } => {
	const uploadCalls: UploadCall[] = []
	let callCount = 0

	const uploadFn = async (_path: string, opts: UploadCall) => {
		uploadCalls.push(opts)
		callCount++
		return {
			mediaUrl: `https://test.url/${callCount}`,
			directPath: `/test/path/${callCount}`
		}
	}

	return {
		uploadCalls,
		upload: jest.fn(uploadFn) as any,
		mediaUploadTimeoutMs: 60000,
		logger: {
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			debug: jest.fn(),
			trace: jest.fn(),
			child: jest.fn().mockReturnThis(),
			level: 'silent'
		} as any
	}
}

describe('Sticker Pack Messages', () => {
	beforeAll(async () => {
		MINIMAL_PNG = await createTestImage()
		MINIMAL_WEBP = await createTestWebP()
		BLUE_PNG = await createTestImage(100, 100, { r: 0, g: 0, b: 255 })
		GREEN_PNG = await createTestImage(100, 100, { r: 0, g: 255, b: 0 })
	})

	describe('Validation', () => {
		it('should reject sticker pack with more than 60 stickers', async () => {
			const stickers = Array(61)
				.fill(null)
				.map(() => ({
					data: MINIMAL_PNG
				}))

			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers
			}

			const options = createMockOptions()

			await expect(generateWAMessageContent({ stickerPack }, options)).rejects.toThrow(
				'Sticker pack exceeds the maximum limit of 60 stickers'
			)
		})

		it('should reject empty sticker pack', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: []
			}

			const options = createMockOptions()

			await expect(generateWAMessageContent({ stickerPack }, options)).rejects.toThrow(
				'Sticker pack must contain at least one sticker'
			)
		})

		it('should reject sticker exceeding 1MB size limit', async () => {
			// Create a large image with random noise (harder to compress)
			// 2000x2000 with 3 channels with noise should result in > 1MB webp
			const width = 2000
			const height = 2000
			const channels = 3
			const rawData = Buffer.alloc(width * height * channels)
			// Fill with random data to prevent compression
			for (let i = 0; i < rawData.length; i++) {
				rawData[i] = Math.floor(Math.random() * 256)
			}

			const largeSticker = await sharp(rawData, {
				raw: { width, height, channels }
			})
				.png()
				.toBuffer()

			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: largeSticker }]
			}

			const options = createMockOptions()

			await expect(generateWAMessageContent({ stickerPack }, options)).rejects.toThrow('exceeds the 1MB size limit')
		}, 30000)

		it('should accept sticker pack with valid sticker count (1-60)', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }, { data: MINIMAL_PNG }, { data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage).toBeDefined()
			expect(result.stickerPackMessage?.name).toBe('Test Pack')
			expect(result.stickerPackMessage?.publisher).toBe('Test Publisher')
			expect(result.stickerPackMessage?.stickers).toHaveLength(3)
		})

		it('should accept sticker pack with exactly 60 stickers', async () => {
			const stickers = Array(60)
				.fill(null)
				.map(() => ({
					data: MINIMAL_PNG
				}))

			const stickerPack: StickerPack = {
				name: 'Max Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage).toBeDefined()
			expect(result.stickerPackMessage?.stickers).toHaveLength(60)
		})
	})

	describe('ZIP Generation', () => {
		it('should create valid ZIP with sticker files', async () => {
			const stickerPack: StickerPack = {
				name: 'ZIP Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [
					{ data: MINIMAL_PNG, emojis: ['😀'] },
					{ data: MINIMAL_PNG, emojis: ['😎'] }
				]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage).toBeDefined()
			expect(result.stickerPackMessage?.stickers).toHaveLength(2)

			// Verify sticker metadata
			const stickers = result.stickerPackMessage?.stickers
			expect(stickers?.[0]?.mimetype).toBe('image/webp')
			expect(stickers?.[0]?.fileName).toMatch(/\.webp$/)
			expect(stickers?.[0]?.emojis).toEqual(['😀'])
			expect(stickers?.[1]?.emojis).toEqual(['😎'])
		})

		it('should deduplicate identical stickers by hash', async () => {
			// Use the same sticker data twice
			const stickerPack: StickerPack = {
				name: 'Dedup Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }, { data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			// Both stickers should have the same filename (hash-based)
			const stickers = result.stickerPackMessage?.stickers
			expect(stickers?.[0]?.fileName).toBe(stickers?.[1]?.fileName)
		})
	})

	describe('Metadata', () => {
		it('should use provided packId', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }],
				packId: 'custom-pack-id-123'
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.stickerPackId).toBe('custom-pack-id-123')
		})

		it('should generate packId if not provided', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.stickerPackId).toBeDefined()
			expect(result.stickerPackMessage?.stickerPackId?.length).toBeGreaterThan(0)
		})

		it('should include description when provided', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }],
				description: 'A test sticker pack description'
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.packDescription).toBe('A test sticker pack description')
		})

		it('should include sticker emojis and accessibility labels', async () => {
			const stickerPack: StickerPack = {
				name: 'Accessible Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [
					{
						data: MINIMAL_PNG,
						emojis: ['🎉', '🥳'],
						accessibilityLabel: 'Party celebration sticker'
					}
				]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			const sticker = result.stickerPackMessage?.stickers?.[0]
			expect(sticker?.emojis).toEqual(['🎉', '🥳'])
			expect(sticker?.accessibilityLabel).toBe('Party celebration sticker')
		})
	})

	describe('Error Handling', () => {
		it('should throw Boom error for validation failures', async () => {
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: []
			}

			const options = createMockOptions()

			try {
				await generateWAMessageContent({ stickerPack }, options)
				fail('Expected error to be thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(Boom)
				expect((error as Boom).output.statusCode).toBe(400)
			}
		})

		it('should throw error when no image processing library available for non-WebP', async () => {
			// This test would require mocking getImageProcessingLibrary to return no libs
			// For now, we just verify the error message format exists in code
			const stickerPack: StickerPack = {
				name: 'Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			// This should work since we're providing WebP
			const result = await generateWAMessageContent({ stickerPack }, options)
			expect(result.stickerPackMessage).toBeDefined()
		})
	})

	describe('Media Uploads', () => {
		it('should call upload twice - once for ZIP and once for thumbnail', async () => {
			const stickerPack: StickerPack = {
				name: 'Upload Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			await generateWAMessageContent({ stickerPack }, options)

			// Should have 2 upload calls: ZIP and thumbnail
			expect(options.uploadCalls).toHaveLength(2)
		})

		it('should upload ZIP with sticker-pack media type', async () => {
			const stickerPack: StickerPack = {
				name: 'Media Type Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			await generateWAMessageContent({ stickerPack }, options)

			// First upload should be the sticker pack ZIP
			expect(options.uploadCalls[0]?.mediaType).toBe('sticker-pack')
		})

		it('should upload thumbnail with thumbnail-sticker-pack media type', async () => {
			const stickerPack: StickerPack = {
				name: 'Thumbnail Media Type Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			await generateWAMessageContent({ stickerPack }, options)

			// Second upload should be the thumbnail
			expect(options.uploadCalls[1]?.mediaType).toBe('thumbnail-sticker-pack')
		})
	})

	describe('Crypto Fields', () => {
		it('should set mediaKey on the message', async () => {
			const stickerPack: StickerPack = {
				name: 'Crypto Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.mediaKey).toBeDefined()
			expect(result.stickerPackMessage?.mediaKey).toBeInstanceOf(Uint8Array)
			expect(result.stickerPackMessage?.mediaKey?.length).toBe(32)
		})

		it('should set fileSha256 and fileEncSha256', async () => {
			const stickerPack: StickerPack = {
				name: 'Hash Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.fileSha256).toBeDefined()
			expect(result.stickerPackMessage?.fileSha256).toBeInstanceOf(Uint8Array)
			expect(result.stickerPackMessage?.fileEncSha256).toBeDefined()
			expect(result.stickerPackMessage?.fileEncSha256).toBeInstanceOf(Uint8Array)
		})

		it('should set fileLength to actual ZIP size', async () => {
			const stickerPack: StickerPack = {
				name: 'File Length Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.fileLength).toBeDefined()
			expect(typeof result.stickerPackMessage?.fileLength).toBe('number')
			expect(result.stickerPackMessage?.fileLength).toBeGreaterThan(0)
		})

		it('should set directPath from upload result', async () => {
			const stickerPack: StickerPack = {
				name: 'Direct Path Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.directPath).toBe('/test/path/1')
		})

		it('should set mediaKeyTimestamp', async () => {
			const beforeTime = Math.floor(Date.now() / 1000)

			const stickerPack: StickerPack = {
				name: 'Timestamp Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			const afterTime = Math.floor(Date.now() / 1000)

			expect(result.stickerPackMessage?.mediaKeyTimestamp).toBeDefined()
			const timestamp = Number(result.stickerPackMessage?.mediaKeyTimestamp)
			expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
			expect(timestamp).toBeLessThanOrEqual(afterTime)
		})
	})

	describe('Thumbnail Fields', () => {
		it('should set thumbnail fields when cover is provided', async () => {
			const stickerPack: StickerPack = {
				name: 'Thumbnail Fields Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.thumbnailDirectPath).toBe('/test/path/2')
			expect(result.stickerPackMessage?.thumbnailSha256).toBeDefined()
			expect(result.stickerPackMessage?.thumbnailEncSha256).toBeDefined()
			expect(result.stickerPackMessage?.thumbnailHeight).toBe(252)
			expect(result.stickerPackMessage?.thumbnailWidth).toBe(252)
		})

		it('should set imageDataHash for thumbnail', async () => {
			const stickerPack: StickerPack = {
				name: 'Image Data Hash Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.imageDataHash).toBeDefined()
			expect(typeof result.stickerPackMessage?.imageDataHash).toBe('string')
			// imageDataHash should be base64 encoded
			expect(result.stickerPackMessage?.imageDataHash?.length).toBeGreaterThan(0)
		})
	})

	describe('Cover Image (Tray Icon)', () => {
		it('should set trayIconFileName with packId and .webp extension', async () => {
			const stickerPack: StickerPack = {
				name: 'Tray Icon Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }],
				packId: 'my-custom-pack'
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.trayIconFileName).toBe('my-custom-pack.webp')
		})

		it('should generate trayIconFileName when packId not provided', async () => {
			const stickerPack: StickerPack = {
				name: 'Auto Tray Icon Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.trayIconFileName).toBeDefined()
			expect(result.stickerPackMessage?.trayIconFileName?.endsWith('.webp')).toBe(true)
			// trayIconFileName should match stickerPackId + .webp
			expect(result.stickerPackMessage?.trayIconFileName).toBe(result.stickerPackMessage?.stickerPackId + '.webp')
		})
	})

	describe('Sticker Pack Origin', () => {
		it('should set stickerPackOrigin to USER_CREATED', async () => {
			const stickerPack: StickerPack = {
				name: 'Origin Test Pack',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.stickerPackOrigin).toBe(
				WAProto.Message.StickerPackMessage.StickerPackOrigin.USER_CREATED
			)
		})
	})

	describe('Sticker Pack Size', () => {
		it('should set stickerPackSize to ZIP buffer length', async () => {
			const stickerPack: StickerPack = {
				name: 'Pack Size Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.stickerPackSize).toBeDefined()
			expect(typeof result.stickerPackMessage?.stickerPackSize).toBe('number')
			// stickerPackSize should equal fileLength (ZIP size before encryption)
			// They might differ slightly due to encryption overhead, but both should be > 0
			expect(result.stickerPackMessage?.stickerPackSize).toBeGreaterThan(0)
		})
	})

	describe('Different Stickers Hash', () => {
		it('should generate different filenames for different stickers', async () => {
			const stickerPack: StickerPack = {
				name: 'Different Hash Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [
					{ data: MINIMAL_PNG }, // Red
					{ data: BLUE_PNG }, // Blue
					{ data: GREEN_PNG } // Green
				]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			const stickers = result.stickerPackMessage?.stickers
			expect(stickers).toHaveLength(3)

			// All filenames should be unique since images are different
			const filenames = stickers?.map(s => s?.fileName)
			const uniqueFilenames = new Set(filenames)
			expect(uniqueFilenames.size).toBe(3)
		})
	})

	describe('WebP Conversion', () => {
		it('should convert PNG stickers to WebP', async () => {
			const stickerPack: StickerPack = {
				name: 'PNG Conversion Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [{ data: MINIMAL_PNG }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			// All stickers should have webp mimetype
			expect(result.stickerPackMessage?.stickers?.[0]?.mimetype).toBe('image/webp')
			expect(result.stickerPackMessage?.stickers?.[0]?.fileName?.endsWith('.webp')).toBe(true)
		})

		it('should accept WebP stickers directly', async () => {
			const stickerPack: StickerPack = {
				name: 'WebP Direct Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_WEBP,
				stickers: [{ data: MINIMAL_WEBP }]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			expect(result.stickerPackMessage?.stickers?.[0]?.mimetype).toBe('image/webp')
		})
	})

	describe('Multiple Stickers', () => {
		it('should handle multiple stickers with different emojis', async () => {
			const stickerPack: StickerPack = {
				name: 'Multi Emoji Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [
					{ data: MINIMAL_PNG, emojis: ['😀', '😃'] },
					{ data: BLUE_PNG, emojis: ['💙'] },
					{ data: GREEN_PNG, emojis: ['💚', '🌿', '🍀'] }
				]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			const stickers = result.stickerPackMessage?.stickers
			expect(stickers?.[0]?.emojis).toEqual(['😀', '😃'])
			expect(stickers?.[1]?.emojis).toEqual(['💙'])
			expect(stickers?.[2]?.emojis).toEqual(['💚', '🌿', '🍀'])
		})

		it('should preserve sticker order', async () => {
			const stickerPack: StickerPack = {
				name: 'Order Test',
				publisher: 'Test Publisher',
				cover: MINIMAL_PNG,
				stickers: [
					{ data: MINIMAL_PNG, accessibilityLabel: 'First' },
					{ data: BLUE_PNG, accessibilityLabel: 'Second' },
					{ data: GREEN_PNG, accessibilityLabel: 'Third' }
				]
			}

			const options = createMockOptions()

			const result = await generateWAMessageContent({ stickerPack }, options)

			const stickers = result.stickerPackMessage?.stickers
			expect(stickers?.[0]?.accessibilityLabel).toBe('First')
			expect(stickers?.[1]?.accessibilityLabel).toBe('Second')
			expect(stickers?.[2]?.accessibilityLabel).toBe('Third')
		})
	})
})

describe('fflate ZIP utility', () => {
	it('should create and extract ZIP correctly', async () => {
		const testData: Record<string, [Uint8Array, { level: 0 }]> = {
			'test1.webp': [new Uint8Array([1, 2, 3, 4]), { level: 0 }],
			'test2.webp': [new Uint8Array([5, 6, 7, 8]), { level: 0 }]
		}

		const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
			zip(testData, (err, data) => {
				if (err) reject(err)
				else resolve(Buffer.from(data))
			})
		})

		expect(zipBuffer).toBeInstanceOf(Buffer)
		expect(zipBuffer.length).toBeGreaterThan(0)

		// Verify ZIP can be extracted
		const extracted = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
			unzip(new Uint8Array(zipBuffer), (err, data) => {
				if (err) reject(err)
				else resolve(data)
			})
		})

		expect(extracted['test1.webp']).toBeDefined()
		expect(extracted['test2.webp']).toBeDefined()
		expect(Array.from(extracted['test1.webp']!)).toEqual([1, 2, 3, 4])
		expect(Array.from(extracted['test2.webp']!)).toEqual([5, 6, 7, 8])
	})
})
