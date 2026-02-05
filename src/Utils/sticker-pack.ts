import { createHash } from 'crypto'
import { zipSync } from 'fflate'
import { promises as fs } from 'fs'
import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import type { MediaType } from '../Defaults/index.js'
import type { Sticker, StickerPack, WAMediaUpload, WAMediaUploadFunction } from '../Types/Message.js'
import type { ILogger } from './logger.js'
import { generateMessageIDV2 } from './generics.js'
import { getImageProcessingLibrary, encryptedStream } from './messages-media.js'

/**
 * Verifica se um buffer é um arquivo WebP válido
 * Valida os magic bytes: RIFF....WEBP
 *
 * @param buffer - Buffer to check
 * @returns true if buffer is valid WebP format
 *
 * @example
 * ```typescript
 * const buffer = await readFile('image.webp')
 * if (isWebPBuffer(buffer)) {
 *   console.log('Valid WebP file')
 * }
 * ```
 */
export const isWebPBuffer = (buffer: Buffer): boolean => {
	if (buffer.length < 12) return false

	// Verifica magic bytes RIFF (0-3) e WEBP (8-11)
	const riffHeader = buffer.toString('ascii', 0, 4)
	const webpHeader = buffer.toString('ascii', 8, 12)

	return riffHeader === 'RIFF' && webpHeader === 'WEBP'
}

/**
 * Detecta se um WebP é animado através da análise de chunks
 *
 * Analisa a estrutura do arquivo WebP procurando por:
 * - VP8X header com animation flag (bit 1)
 * - Chunks ANIM (animation) ou ANMF (animation frame)
 *
 * @param buffer - WebP buffer to analyze
 * @returns true if WebP is animated
 *
 * @example
 * ```typescript
 * const webpBuffer = await readFile('sticker.webp')
 * if (isAnimatedWebP(webpBuffer)) {
 *   console.log('Animated sticker detected')
 * }
 * ```
 */
export const isAnimatedWebP = (buffer: Buffer): boolean => {
	if (!isWebPBuffer(buffer)) return false

	let offset = 12 // Skip RIFF header (12 bytes)

	while (offset < buffer.length - 8) {
		const chunkFourCC = buffer.toString('ascii', offset, offset + 4)
		const chunkSize = buffer.readUInt32LE(offset + 4)

		// VP8X extended header - check animation flag
		if (chunkFourCC === 'VP8X' && offset + 8 < buffer.length) {
			const flags = buffer[offset + 8]
			// Bit 1 (0x02) = animation flag
			if (flags && (flags & 0x02)) return true
		}

		// Animation chunks
		if (chunkFourCC === 'ANIM' || chunkFourCC === 'ANMF') {
			return true
		}

		// Move to next chunk (8 byte header + chunk size + padding)
		offset += 8 + chunkSize + (chunkSize % 2)
	}

	return false
}

/**
 * Converte uma imagem para WebP usando Sharp
 * Preserva o buffer original se já for WebP para manter EXIF e animações
 *
 * @param buffer - Image buffer to convert
 * @param logger - Optional logger for debugging
 * @returns Object with WebP buffer and animation status
 *
 * @throws {Boom} If Sharp is not installed and buffer is not WebP
 */
const convertToWebP = async (
	buffer: Buffer,
	logger?: ILogger
): Promise<{ webpBuffer: Buffer; isAnimated: boolean }> => {
	// Se já é WebP, preserva o buffer original (mantém EXIF e animações)
	if (isWebPBuffer(buffer)) {
		const isAnimated = isAnimatedWebP(buffer)
		logger?.trace({ isAnimated }, 'Input is already WebP, preserving original buffer')
		return { webpBuffer: buffer, isAnimated }
	}

	// Tenta usar Sharp para converter
	const lib = await getImageProcessingLibrary()

	if (!lib?.sharp) {
		throw new Boom(
			'Sharp library is required to convert non-WebP images to WebP format. Install with: yarn add sharp',
			{ statusCode: 400 }
		)
	}

	logger?.trace('Converting image to WebP using Sharp')
	const webpBuffer = await lib.sharp(buffer).webp().toBuffer()

	return { webpBuffer, isAnimated: false }
}

/**
 * Gera hash SHA256 em formato base64 URL-safe
 * Usado para nomear arquivos de stickers no ZIP (auto-deduplicação)
 *
 * @param buffer - Buffer to hash
 * @returns Base64 URL-safe SHA256 hash
 */
const generateSha256Hash = (buffer: Buffer): string => {
	return createHash('sha256')
		.update(buffer)
		.digest('base64')
		.replace(/\//g, '-') // Base64 URL-safe
		.replace(/\+/g, '-')
		.replace(/=/g, '')
}

/**
 * Converte WAMediaUpload para Buffer
 * Suporta Buffer, Stream e URL
 *
 * @param media - Media input (Buffer, Stream or URL)
 * @param context - Context for error messages (e.g., 'sticker', 'cover')
 * @returns Buffer with media content
 *
 * @throws {Boom} If media format is invalid
 */
const mediaToBuffer = async (media: WAMediaUpload, context: string): Promise<Buffer> => {
	if (Buffer.isBuffer(media)) {
		return media
	} else if (typeof media === 'object' && 'stream' in media) {
		// Read stream to buffer
		const chunks: Buffer[] = []
		for await (const chunk of media.stream) {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
		}
		return Buffer.concat(chunks)
	} else if (typeof media === 'object' && 'url' in media) {
		// Download from URL
		const url = media.url.toString()
		const response = await fetch(url)

		if (!response.ok) {
			throw new Boom(`Failed to download ${context} from URL: ${url}`, {
				statusCode: 400,
				data: { url, status: response.status }
			})
		}

		return Buffer.from(await response.arrayBuffer())
	} else {
		throw new Boom(`Invalid ${context} data format`, { statusCode: 400 })
	}
}

export type PrepareStickerPackMessageOptions = {
	/** Upload function to encrypt and upload media to WhatsApp servers */
	upload: WAMediaUploadFunction
	/** Optional logger for debugging */
	logger?: ILogger
	/** Timeout for media uploads */
	mediaUploadTimeoutMs?: number
}

/**
 * Prepara uma mensagem de sticker pack para envio
 *
 * **Processo:**
 * 1. Valida número de stickers (3-30 conforme padrão WhatsApp oficial)
 * 2. Processa cada sticker (converte para WebP se necessário)
 * 3. Cria ZIP com stickers + cover (deduplicação automática por hash)
 * 4. Criptografa ZIP usando AES-256-CBC + HMAC-SHA256
 * 5. Gera thumbnail da capa (252x252 JPEG)
 * 6. Faz upload do ZIP e thumbnail (reutiliza mesma mediaKey)
 * 7. Retorna proto.Message.StickerPackMessage completo
 *
 * **Especificações WhatsApp:**
 * - 3-30 stickers por pack (oficial)
 * - WebP obrigatório
 * - Recomendado: 100KB por sticker estático, 500KB animado
 * - Tray icon: 252x252 pixels
 *
 * @param stickerPack - Sticker pack data with stickers, cover, name, publisher
 * @param options - Upload function and optional logger
 * @returns Prepared StickerPackMessage ready to send
 *
 * @throws {Boom} If validation fails (sticker count, size limits, format issues)
 *
 * @example
 * ```typescript
 * const stickerPackMessage = await prepareStickerPackMessage(
 *   {
 *     name: 'My Pack',
 *     publisher: 'Author',
 *     cover: coverBuffer,
 *     stickers: [
 *       { data: sticker1Buffer, emojis: ['😀'] },
 *       { data: sticker2Buffer, emojis: ['😎'] }
 *     ]
 *   },
 *   { upload: uploadFunction, logger }
 * )
 * ```
 */
export const prepareStickerPackMessage = async (
	stickerPack: StickerPack,
	options: PrepareStickerPackMessageOptions
): Promise<proto.Message.StickerPackMessage> => {
	const { upload, logger, mediaUploadTimeoutMs } = options
	const { stickers, cover, name, publisher, description, packId } = stickerPack

	// Helper function to encrypt and upload media
	const uploadMedia = async (buffer: Buffer, mediaType: MediaType, opts?: { mediaKey?: Uint8Array }) => {
		// Encrypt the media
		const encrypted = await encryptedStream(buffer, mediaType, {
			logger,
			mediaKey: opts?.mediaKey
		})

		// Upload encrypted file
		const result = await upload(encrypted.encFilePath, {
			fileEncSha256B64: encrypted.fileEncSha256.toString('base64'),
			mediaType,
			timeoutMs: mediaUploadTimeoutMs
		})

		// Clean up encrypted file
		await fs.unlink(encrypted.encFilePath)

		return {
			mediaKey: encrypted.mediaKey,
			fileSha256: encrypted.fileSha256,
			fileEncSha256: encrypted.fileEncSha256,
			directPath: result.directPath,
			mediaKeyTimestamp: result.ts
		}
	}

	// 1. Validações - Padrão WhatsApp oficial: 3-30 stickers
	if (stickers.length < 3 || stickers.length > 30) {
		throw new Boom(
			`Sticker pack must contain between 3 and 30 stickers per WhatsApp official spec. Provided: ${stickers.length}`,
			{ statusCode: 400 }
		)
	}

	// Validação de nomes (max 128 caracteres)
	if (name.length > 128) {
		throw new Boom(`Pack name must be 128 characters or less. Current length: ${name.length}`, {
			statusCode: 400
		})
	}

	if (publisher.length > 128) {
		throw new Boom(`Publisher name must be 128 characters or less. Current length: ${publisher.length}`, {
			statusCode: 400
		})
	}

	logger?.info({ stickerCount: stickers.length, name, publisher }, 'Preparing sticker pack message')

	// 2. Gera ID do pack se não fornecido
	const stickerPackId = packId || generateMessageIDV2()

	// 3. Processa stickers e cria estrutura ZIP
	const stickerData: Record<string, [Uint8Array, { level: 0 }]> = {}
	const stickerMetadata: proto.Message.StickerPackMessage.ISticker[] = []

	for (let i = 0; i < stickers.length; i++) {
		const sticker = stickers[i]
		if (!sticker) continue // Skip undefined stickers

		logger?.trace({ index: i }, 'Processing sticker')

		// Obtém buffer do sticker
		const buffer = await mediaToBuffer(sticker.data, `sticker ${i + 1}`)

		// Converte para WebP
		const { webpBuffer, isAnimated } = await convertToWebP(buffer, logger)

		// Validação de tamanho (1MB hard limit, mas avisa se exceder recomendado)
		const sizeKB = webpBuffer.length / 1024
		const recommendedLimit = isAnimated ? 500 : 100

		if (webpBuffer.length > 1024 * 1024) {
			throw new Boom(
				`Sticker ${i + 1} exceeds the 1MB hard limit (${sizeKB.toFixed(2)}KB). ` +
					`Please compress or reduce quality.`,
				{ statusCode: 400 }
			)
		}

		if (sizeKB > recommendedLimit) {
			logger?.warn(
				{ index: i, sizeKB, recommendedLimit, isAnimated },
				`Sticker ${i + 1} exceeds WhatsApp recommended size (${recommendedLimit}KB). ` +
					`This may cause slower sending or delivery issues.`
			)
		}

		// Gera nome do arquivo: hash.webp (deduplicação automática)
		const sha256Hash = generateSha256Hash(webpBuffer)
		const fileName = `${sha256Hash}.webp`

		// Adiciona ao ZIP (se já existe, sobrescreve - deduplicação)
		stickerData[fileName] = [new Uint8Array(webpBuffer), { level: 0 as 0 }]

		// Metadata do sticker
		stickerMetadata.push({
			fileName,
			isAnimated,
			emojis: sticker.emojis || [],
			accessibilityLabel: sticker.accessibilityLabel,
			isLottie: false,
			mimetype: 'image/webp'
		})

		logger?.trace(
			{ index: i, fileName, sizeKB: sizeKB.toFixed(2), isAnimated },
			'Sticker processed successfully'
		)
	}

	// 4. Processa cover image (tray icon)
	logger?.trace('Processing cover image')
	const coverBuffer = await mediaToBuffer(cover, 'cover image')

	// Converte cover para WebP e adiciona ao ZIP
	const { webpBuffer: coverWebP } = await convertToWebP(coverBuffer, logger)
	const coverFileName = `${stickerPackId}.webp`
	stickerData[coverFileName] = [new Uint8Array(coverWebP), { level: 0 as 0 }]

	// 5. Cria ZIP (level 0 = sem compressão para velocidade)
	const uniqueFiles = Object.keys(stickerData).length
	logger?.trace({ totalFiles: uniqueFiles, includingCover: true }, 'Creating ZIP file')

	const zipBuffer = Buffer.from(zipSync(stickerData))

	logger?.info({ zipSizeKB: (zipBuffer.length / 1024).toFixed(2) }, 'ZIP file created successfully')

	// Validação de tamanho total (30MB limit para segurança)
	const MAX_PACK_SIZE = 30 * 1024 * 1024
	if (zipBuffer.length > MAX_PACK_SIZE) {
		throw new Boom(
			`Total pack size exceeds ${MAX_PACK_SIZE / 1024 / 1024}MB limit. ` +
				`Current size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)}MB. ` +
				`Try compressing stickers or reducing pack size.`,
			{ statusCode: 400 }
		)
	}

	// 6. Upload do ZIP criptografado
	logger?.trace('Uploading encrypted sticker pack ZIP')
	const stickerPackUpload = await uploadMedia(zipBuffer, 'sticker-pack')

	// 7. Gera thumbnail 252x252 JPEG
	logger?.trace('Generating thumbnail (252x252 JPEG)')
	const lib = await getImageProcessingLibrary()
	let thumbnailBuffer: Buffer

	if (!lib?.sharp) {
		throw new Boom(
			'Sharp library is required for thumbnail generation. Install with: yarn add sharp',
			{ statusCode: 400 }
		)
	}

	thumbnailBuffer = await lib
		.sharp(coverBuffer)
		.resize(252, 252, { fit: 'cover', position: 'center' })
		.jpeg({ quality: 85 })
		.toBuffer()

	logger?.trace({ thumbnailSizeKB: (thumbnailBuffer.length / 1024).toFixed(2) }, 'Thumbnail generated')

	// 8. Upload do thumbnail (REUTILIZA mesma mediaKey - requerido pelo protocolo!)
	logger?.trace('Uploading thumbnail with same mediaKey')
	const thumbUpload = await uploadMedia(thumbnailBuffer, 'thumbnail-sticker-pack', {
		mediaKey: stickerPackUpload.mediaKey // CRÍTICO: mesma chave!
	})

	// 9. Monta mensagem protobuf
	logger?.info(
		{
			packId: stickerPackId,
			totalStickers: stickers.length,
			uniqueFiles: uniqueFiles - 1, // minus cover
			zipSizeKB: (zipBuffer.length / 1024).toFixed(2)
		},
		'Sticker pack message prepared successfully'
	)

	return proto.Message.StickerPackMessage.create({
		// Metadata do pack
		stickerPackId,
		name,
		publisher,
		packDescription: description,
		stickerPackOrigin: proto.Message.StickerPackMessage.StickerPackOrigin.USER_CREATED,
		stickerPackSize: zipBuffer.length,
		stickers: stickerMetadata,

		// ZIP file (criptografado)
		fileSha256: stickerPackUpload.fileSha256,
		fileEncSha256: stickerPackUpload.fileEncSha256,
		mediaKey: stickerPackUpload.mediaKey,
		directPath: stickerPackUpload.directPath,
		fileLength: zipBuffer.length,
		mediaKeyTimestamp: stickerPackUpload.mediaKeyTimestamp,

		// Tray icon info
		trayIconFileName: coverFileName,

		// Thumbnail (criptografado com mesma key)
		thumbnailDirectPath: thumbUpload.directPath,
		thumbnailSha256: createHash('sha256').update(thumbnailBuffer).digest(),
		thumbnailEncSha256: thumbUpload.fileEncSha256,
		thumbnailHeight: 252,
		thumbnailWidth: 252,
		imageDataHash: createHash('sha256').update(thumbnailBuffer).digest('base64')
	})
}
