/**
Node.js specific entry point.
*/

import {ReadableStream as WebReadableStream} from 'node:stream/web';
import {pipeline, PassThrough, Readable} from 'node:stream';
import * as strtok3 from 'strtok3';
import {FileTypeParser as DefaultFileTypeParser, reasonableDetectionSizeInBytes} from './core.js';

export class FileTypeParser extends DefaultFileTypeParser {
	async fromStream(stream) {
		const tokenizer = await (stream instanceof WebReadableStream ? strtok3.fromWebStream(stream, this.tokenizerOptions) : strtok3.fromStream(stream, this.tokenizerOptions));
		try {
			return await super.fromTokenizer(tokenizer);
		} finally {
			await tokenizer.close();
		}
	}

	async fromFile(path) {
		const tokenizer = await strtok3.fromFile(path);
		try {
			return await super.fromTokenizer(tokenizer);
		} finally {
			await tokenizer.close();
		}
	}

	async toDetectionStream(readableStream, options = {}) {
		if (!(readableStream instanceof Readable)) {
			return super.toDetectionStream(readableStream, options);
		}

		const {sampleSize = reasonableDetectionSizeInBytes} = options;

		return new Promise((resolve, reject) => {
			readableStream.on('error', reject);

			readableStream.once('readable', () => {
				(async () => {
					try {
						// Set up output stream
						const pass = new PassThrough();
						const outputStream = pipeline ? pipeline(readableStream, pass, () => {}) : readableStream.pipe(pass);

						// Read the input stream and detect the filetype
						const chunk = readableStream.read(sampleSize) ?? readableStream.read() ?? new Uint8Array(0);
						try {
							pass.fileType = await this.fromBuffer(chunk);
						} catch (error) {
							if (error instanceof strtok3.EndOfStreamError) {
								pass.fileType = undefined;
							} else {
								reject(error);
							}
						}

						resolve(outputStream);
					} catch (error) {
						reject(error);
					}
				})();
			});
		});
	}
}

export async function fileTypeFromFile(path, options) {
	return (new FileTypeParser(options)).fromFile(path, options);
}

export async function fileTypeFromStream(stream, options) {
	return (new FileTypeParser(options)).fromStream(stream);
}

export async function fileTypeStream(readableStream, options = {}) {
	return new FileTypeParser(options).toDetectionStream(readableStream, options);
}

export {
	fileTypeFromTokenizer,
	fileTypeFromBuffer,
	fileTypeFromBlob,
	supportedMimeTypes,
	supportedExtensions,
} from './core.js';
