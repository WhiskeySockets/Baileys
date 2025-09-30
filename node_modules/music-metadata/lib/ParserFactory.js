import { fileTypeFromBuffer } from 'file-type';
import ContentType from 'content-type';
import { parse as mimeTypeParse } from 'media-typer';
import initDebug from 'debug';
import { MetadataCollector } from './common/MetadataCollector.js';
import { TrackType } from './type.js';
import { mpegParserLoader } from './mpeg/MpegLoader.js';
import { CouldNotDetermineFileTypeError, UnsupportedFileTypeError } from './ParseError.js';
import { apeParserLoader } from './apev2/Apev2Loader.js';
import { asfParserLoader } from './asf/AsfLoader.js';
import { dsdiffParserLoader } from './dsdiff/DsdiffLoader.js';
import { aiffParserLoader } from './aiff/AiffLoader.js';
import { dsfParserLoader } from './dsf/DsfLoader.js';
import { flacParserLoader } from './flac/FlacLoader.js';
import { matroskaParserLoader } from './matroska/MatroskaLoader.js';
import { mp4ParserLoader } from './mp4/Mp4Loader.js';
import { musepackParserLoader } from './musepack/MusepackLoader.js';
import { oggParserLoader } from './ogg/OggLoader.js';
import { wavpackParserLoader } from './wavpack/WavPackLoader.js';
import { riffParserLoader } from './wav/WaveLoader.js';
import { scanAppendingHeaders } from './core.js';
const debug = initDebug('music-metadata:parser:factory');
export function parseHttpContentType(contentType) {
    const type = ContentType.parse(contentType);
    const mime = mimeTypeParse(type.type);
    return {
        type: mime.type,
        subtype: mime.subtype,
        suffix: mime.suffix,
        parameters: type.parameters
    };
}
export class ParserFactory {
    constructor() {
        this.parsers = [];
        [
            flacParserLoader,
            mpegParserLoader,
            apeParserLoader,
            mp4ParserLoader,
            matroskaParserLoader,
            riffParserLoader,
            oggParserLoader,
            asfParserLoader,
            aiffParserLoader,
            wavpackParserLoader,
            musepackParserLoader,
            dsfParserLoader,
            dsdiffParserLoader
        ].forEach(parser => { this.registerParser(parser); });
    }
    registerParser(parser) {
        this.parsers.push(parser);
    }
    async parse(tokenizer, parserLoader, opts) {
        if (tokenizer.supportsRandomAccess()) {
            debug('tokenizer supports random-access, scanning for appending headers');
            await scanAppendingHeaders(tokenizer, opts);
        }
        else {
            debug('tokenizer does not support random-access, cannot scan for appending headers');
        }
        if (!parserLoader) {
            const buf = new Uint8Array(4100);
            if (tokenizer.fileInfo.mimeType) {
                parserLoader = this.findLoaderForContentType(tokenizer.fileInfo.mimeType);
            }
            if (!parserLoader && tokenizer.fileInfo.path) {
                parserLoader = this.findLoaderForExtension(tokenizer.fileInfo.path);
            }
            if (!parserLoader) {
                // Parser could not be determined on MIME-type or extension
                debug('Guess parser on content...');
                await tokenizer.peekBuffer(buf, { mayBeLess: true });
                const guessedType = await fileTypeFromBuffer(buf, { mpegOffsetTolerance: 10 });
                if (!guessedType || !guessedType.mime) {
                    throw new CouldNotDetermineFileTypeError('Failed to determine audio format');
                }
                debug(`Guessed file type is mime=${guessedType.mime}, extension=${guessedType.ext}`);
                parserLoader = this.findLoaderForContentType(guessedType.mime);
                if (!parserLoader) {
                    throw new UnsupportedFileTypeError(`Guessed MIME-type not supported: ${guessedType.mime}`);
                }
            }
        }
        // Parser found, execute parser
        debug(`Loading ${parserLoader.parserType} parser...`);
        const metadata = new MetadataCollector(opts);
        const ParserImpl = await parserLoader.load();
        const parser = new ParserImpl(metadata, tokenizer, opts ?? {});
        debug(`Parser ${parserLoader.parserType} loaded`);
        await parser.parse();
        if (metadata.format.trackInfo) {
            if (metadata.format.hasAudio === undefined) {
                metadata.setFormat('hasAudio', !!metadata.format.trackInfo.find(track => track.type === TrackType.audio));
            }
            if (metadata.format.hasVideo === undefined) {
                metadata.setFormat('hasVideo', !!metadata.format.trackInfo.find(track => track.type === TrackType.video));
            }
        }
        return metadata.toCommonMetadata();
    }
    /**
     * @param filePath - Path, filename or extension to audio file
     * @return Parser submodule name
     */
    findLoaderForExtension(filePath) {
        if (!filePath)
            return;
        const extension = getExtension(filePath).toLocaleLowerCase() || filePath;
        return this.parsers.find(parser => parser.extensions.indexOf(extension) !== -1);
    }
    findLoaderForContentType(httpContentType) {
        let mime;
        if (!httpContentType)
            return;
        try {
            mime = parseHttpContentType(httpContentType);
        }
        catch (_err) {
            debug(`Invalid HTTP Content-Type header value: ${httpContentType}`);
            return;
        }
        const subType = mime.subtype.indexOf('x-') === 0 ? mime.subtype.substring(2) : mime.subtype;
        return this.parsers.find(parser => parser.mimeTypes.find(loader => loader.indexOf(`${mime.type}/${subType}`) !== -1));
    }
    getSupportedMimeTypes() {
        const mimeTypeSet = new Set();
        this.parsers.forEach(loader => {
            loader.mimeTypes.forEach(mimeType => {
                mimeTypeSet.add(mimeType);
                mimeTypeSet.add(mimeType.replace('/', '/x-'));
            });
        });
        return Array.from(mimeTypeSet);
    }
}
function getExtension(fname) {
    const i = fname.lastIndexOf('.');
    return i === -1 ? '' : fname.substring(i);
}
