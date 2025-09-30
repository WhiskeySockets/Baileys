import * as Token from 'token-types';
import initDebug from 'debug';
import { FourCcToken } from '../common/FourCC.js';
import { makeUnexpectedFileContentError } from '../ParseError.js';
import * as util from '../common/Util.js';
const debug = initDebug('music-metadata:parser:MP4:atom');
export class Mp4ContentError extends makeUnexpectedFileContentError('MP4') {
}
export const Header = {
    len: 8,
    get: (buf, off) => {
        const length = Token.UINT32_BE.get(buf, off);
        if (length < 0)
            throw new Mp4ContentError('Invalid atom header length');
        return {
            length: BigInt(length),
            name: new Token.StringType(4, 'latin1').get(buf, off + 4)
        };
    },
    put: (buf, off, hdr) => {
        Token.UINT32_BE.put(buf, off, Number(hdr.length));
        return FourCcToken.put(buf, off + 4, hdr.name);
    }
};
/**
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap1/qtff1.html#//apple_ref/doc/uid/TP40000939-CH203-38190
 */
export const ExtendedSize = Token.UINT64_BE;
export const ftyp = {
    len: 4,
    get: (buf, off) => {
        return {
            type: new Token.StringType(4, 'ascii').get(buf, off)
        };
    }
};
/**
 * Token: Movie Header Atom
 */
export const mhdr = {
    len: 8,
    get: (buf, off) => {
        return {
            version: Token.UINT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            nextItemID: Token.UINT32_BE.get(buf, off + 4)
        };
    }
};
/**
 * Base class for 'fixed' length atoms.
 * In some cases these atoms are longer then the sum of the described fields.
 * Issue: https://github.com/Borewit/music-metadata/issues/120
 */
export class FixedLengthAtom {
    /**
     *
     * @param {number} len Length as specified in the size field
     * @param {number} expLen Total length of sum of specified fields in the standard
     * @param atomId Atom ID
     */
    constructor(len, expLen, atomId) {
        if (len < expLen) {
            throw new Mp4ContentError(`Atom ${atomId} expected to be ${expLen}, but specifies ${len} bytes long.`);
        }
        if (len > expLen) {
            debug(`Warning: atom ${atomId} expected to be ${expLen}, but was actually ${len} bytes long.`);
        }
        this.len = len;
    }
}
/**
 * Timestamp stored in seconds since Mac Epoch (1 January 1904)
 */
const SecondsSinceMacEpoch = {
    len: 4,
    get: (buf, off) => {
        const secondsSinceUnixEpoch = Token.UINT32_BE.get(buf, off) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1000);
    }
};
/**
 * Token: Media Header Atom
 * Ref:
 * - https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-SW34
 * - https://wiki.multimedia.cx/index.php/QuickTime_container#mdhd
 */
export class MdhdAtom extends FixedLengthAtom {
    constructor(len) {
        super(len, 24, 'mdhd');
    }
    get(buf, off) {
        return {
            version: Token.UINT8.get(buf, off + 0),
            flags: Token.UINT24_BE.get(buf, off + 1),
            creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
            modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
            timeScale: Token.UINT32_BE.get(buf, off + 12),
            duration: Token.UINT32_BE.get(buf, off + 16),
            language: Token.UINT16_BE.get(buf, off + 20),
            quality: Token.UINT16_BE.get(buf, off + 22)
        };
    }
}
/**
 * Token: Movie Header Atom
 */
export class MvhdAtom extends FixedLengthAtom {
    constructor(len) {
        super(len, 100, 'mvhd');
    }
    get(buf, off) {
        return {
            version: Token.UINT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
            modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
            timeScale: Token.UINT32_BE.get(buf, off + 12),
            duration: Token.UINT32_BE.get(buf, off + 16),
            preferredRate: Token.UINT32_BE.get(buf, off + 20),
            preferredVolume: Token.UINT16_BE.get(buf, off + 24),
            // ignore reserver: 10 bytes
            // ignore matrix structure: 36 bytes
            previewTime: Token.UINT32_BE.get(buf, off + 72),
            previewDuration: Token.UINT32_BE.get(buf, off + 76),
            posterTime: Token.UINT32_BE.get(buf, off + 80),
            selectionTime: Token.UINT32_BE.get(buf, off + 84),
            selectionDuration: Token.UINT32_BE.get(buf, off + 88),
            currentTime: Token.UINT32_BE.get(buf, off + 92),
            nextTrackID: Token.UINT32_BE.get(buf, off + 96)
        };
    }
}
/**
 * Data Atom Structure
 */
export class DataAtom {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        return {
            type: {
                set: Token.UINT8.get(buf, off + 0),
                type: Token.UINT24_BE.get(buf, off + 1)
            },
            locale: Token.UINT24_BE.get(buf, off + 4),
            value: new Token.Uint8ArrayType(this.len - 8).get(buf, off + 8)
        };
    }
}
/**
 * Data Atom Structure
 * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW31
 */
export class NameAtom {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        return {
            version: Token.UINT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            name: new Token.StringType(this.len - 4, 'utf-8').get(buf, off + 4)
        };
    }
}
/**
 * Track Header Atoms structure (`tkhd`)
 * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25550
 */
export class TrackHeaderAtom {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        return {
            version: Token.UINT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
            modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
            trackId: Token.UINT32_BE.get(buf, off + 12),
            // reserved 4 bytes
            duration: Token.UINT32_BE.get(buf, off + 20),
            layer: Token.UINT16_BE.get(buf, off + 24),
            alternateGroup: Token.UINT16_BE.get(buf, off + 26),
            volume: Token.UINT16_BE.get(buf, off + 28) // ToDo: fixed point
            // ToDo: add remaining fields
        };
    }
}
/**
 * Atom: Sample Description Atom ('stsd')
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25691
 */
const stsdHeader = {
    len: 8,
    get: (buf, off) => {
        return {
            version: Token.UINT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            numberOfEntries: Token.UINT32_BE.get(buf, off + 4)
        };
    }
};
/**
 * Atom: Sample Description Atom ('stsd')
 * Ref: https://developer.apple.com/documentation/quicktime-file-format/sample_description_atom
 */
class SampleDescriptionTable {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const descrLen = this.len - 12;
        return {
            dataFormat: FourCcToken.get(buf, off),
            dataReferenceIndex: Token.UINT16_BE.get(buf, off + 10),
            description: descrLen > 0 ? new Token.Uint8ArrayType(descrLen).get(buf, off + 12) : undefined
        };
    }
}
/**
 * Atom: Sample-description Atom ('stsd')
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25691
 */
export class StsdAtom {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const header = stsdHeader.get(buf, off);
        off += stsdHeader.len;
        const table = [];
        for (let n = 0; n < header.numberOfEntries; ++n) {
            const size = Token.UINT32_BE.get(buf, off); // Sample description size
            off += Token.UINT32_BE.len;
            table.push(new SampleDescriptionTable(size - Token.UINT32_BE.len).get(buf, off));
            off += size;
        }
        return {
            header,
            table
        };
    }
}
/**
 * Common Sound Sample Description (version & revision)
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-57317
 */
export const SoundSampleDescriptionVersion = {
    len: 8,
    get(buf, off) {
        return {
            version: Token.INT16_BE.get(buf, off),
            revision: Token.INT16_BE.get(buf, off + 2),
            vendor: Token.INT32_BE.get(buf, off + 4)
        };
    }
};
/**
 * Sound Sample Description (Version 0)
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-130736
 */
export const SoundSampleDescriptionV0 = {
    len: 12,
    get(buf, off) {
        return {
            numAudioChannels: Token.INT16_BE.get(buf, off + 0),
            sampleSize: Token.INT16_BE.get(buf, off + 2),
            compressionId: Token.INT16_BE.get(buf, off + 4),
            packetSize: Token.INT16_BE.get(buf, off + 6),
            sampleRate: Token.UINT16_BE.get(buf, off + 8) + Token.UINT16_BE.get(buf, off + 10) / 10000
        };
    }
};
class SimpleTableAtom {
    constructor(len, token) {
        this.len = len;
        this.token = token;
    }
    get(buf, off) {
        const nrOfEntries = Token.INT32_BE.get(buf, off + 4);
        return {
            version: Token.INT8.get(buf, off + 0),
            flags: Token.INT24_BE.get(buf, off + 1),
            numberOfEntries: nrOfEntries,
            entries: readTokenTable(buf, this.token, off + 8, this.len - 8, nrOfEntries)
        };
    }
}
export const TimeToSampleToken = {
    len: 8,
    get(buf, off) {
        return {
            count: Token.INT32_BE.get(buf, off + 0),
            duration: Token.INT32_BE.get(buf, off + 4)
        };
    }
};
/**
 * Time-to-sample('stts') atom.
 * Store duration information for a media’s samples.
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25696
 */
export class SttsAtom extends SimpleTableAtom {
    constructor(len) {
        super(len, TimeToSampleToken);
    }
}
export const SampleToChunkToken = {
    len: 12,
    get(buf, off) {
        return {
            firstChunk: Token.INT32_BE.get(buf, off),
            samplesPerChunk: Token.INT32_BE.get(buf, off + 4),
            sampleDescriptionId: Token.INT32_BE.get(buf, off + 8)
        };
    }
};
/**
 * Sample-to-Chunk ('stsc') atom interface
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25706
 */
export class StscAtom extends SimpleTableAtom {
    constructor(len) {
        super(len, SampleToChunkToken);
    }
}
/**
 * Sample-size ('stsz') atom
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25710
 */
export class StszAtom {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const nrOfEntries = Token.INT32_BE.get(buf, off + 8);
        return {
            version: Token.INT8.get(buf, off),
            flags: Token.INT24_BE.get(buf, off + 1),
            sampleSize: Token.INT32_BE.get(buf, off + 4),
            numberOfEntries: nrOfEntries,
            entries: readTokenTable(buf, Token.INT32_BE, off + 12, this.len - 12, nrOfEntries)
        };
    }
}
/**
 * Chunk offset atom, 'stco'
 * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25715
 */
export class StcoAtom extends SimpleTableAtom {
    constructor(len) {
        super(len, Token.INT32_BE);
        this.len = len;
    }
}
/**
 * Token used to decode text-track from 'mdat' atom (raw data stream)
 */
export class ChapterText {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const titleLen = Token.INT16_BE.get(buf, off + 0);
        const str = new Token.StringType(titleLen, 'utf-8');
        return str.get(buf, off + 2);
    }
}
function readTokenTable(buf, token, off, remainingLen, numberOfEntries) {
    debug(`remainingLen=${remainingLen}, numberOfEntries=${numberOfEntries} * token-len=${token.len}`);
    if (remainingLen === 0)
        return [];
    if (remainingLen !== numberOfEntries * token.len)
        throw new Mp4ContentError('mismatch number-of-entries with remaining atom-length');
    const entries = [];
    // parse offset-table
    for (let n = 0; n < numberOfEntries; ++n) {
        entries.push(token.get(buf, off));
        off += token.len;
    }
    return entries;
}
/**
 * Sample-size ('tfhd') TrackFragmentHeaderBox
 */
export class TrackFragmentHeaderBox {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const flagOffset = off + 1;
        const header = {
            version: Token.INT8.get(buf, off),
            flags: {
                baseDataOffsetPresent: util.getBit(buf, flagOffset + 2, 0),
                sampleDescriptionIndexPresent: util.getBit(buf, flagOffset + 2, 1),
                defaultSampleDurationPresent: util.getBit(buf, flagOffset + 2, 3),
                defaultSampleSizePresent: util.getBit(buf, flagOffset + 2, 4),
                defaultSampleFlagsPresent: util.getBit(buf, flagOffset + 2, 5),
                defaultDurationIsEmpty: util.getBit(buf, flagOffset, 0),
                defaultBaseIsMoof: util.getBit(buf, flagOffset, 1)
            },
            trackId: Token.UINT32_BE.get(buf, 4)
        };
        let dynOffset = 8;
        if (header.flags.baseDataOffsetPresent) {
            header.baseDataOffset = Token.UINT64_BE.get(buf, dynOffset);
            dynOffset += 8;
        }
        if (header.flags.sampleDescriptionIndexPresent) {
            header.sampleDescriptionIndex = Token.UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
        }
        if (header.flags.defaultSampleDurationPresent) {
            header.defaultSampleDuration = Token.UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
        }
        if (header.flags.defaultSampleSizePresent) {
            header.defaultSampleSize = Token.UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
        }
        if (header.flags.defaultSampleFlagsPresent) {
            header.defaultSampleFlags = Token.UINT32_BE.get(buf, dynOffset);
        }
        return header;
    }
}
/**
 * Sample-size ('trun') TrackRunBox
 */
export class TrackRunBox {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const flagOffset = off + 1;
        const trun = {
            version: Token.INT8.get(buf, off),
            flags: {
                dataOffsetPresent: util.getBit(buf, flagOffset + 2, 0),
                firstSampleFlagsPresent: util.getBit(buf, flagOffset + 2, 2),
                sampleDurationPresent: util.getBit(buf, flagOffset + 1, 0),
                sampleSizePresent: util.getBit(buf, flagOffset + 1, 1),
                sampleFlagsPresent: util.getBit(buf, flagOffset + 1, 2),
                sampleCompositionTimeOffsetsPresent: util.getBit(buf, flagOffset + 1, 3)
            },
            sampleCount: Token.UINT32_BE.get(buf, off + 4),
            samples: []
        };
        let dynOffset = off + 8;
        if (trun.flags.dataOffsetPresent) {
            trun.dataOffset = Token.UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
        }
        if (trun.flags.firstSampleFlagsPresent) {
            trun.firstSampleFlags = Token.UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
        }
        for (let n = 0; n < trun.sampleCount; ++n) {
            if (dynOffset >= this.len) {
                debug("TrackRunBox size mismatch");
                break;
            }
            const sample = {};
            if (trun.flags.sampleDurationPresent) {
                sample.sampleDuration = Token.UINT32_BE.get(buf, dynOffset);
                dynOffset += 4;
            }
            if (trun.flags.sampleSizePresent) {
                sample.sampleSize = Token.UINT32_BE.get(buf, dynOffset);
                dynOffset += 4;
            }
            if (trun.flags.sampleFlagsPresent) {
                sample.sampleFlags = Token.UINT32_BE.get(buf, dynOffset);
                dynOffset += 4;
            }
            if (trun.flags.sampleCompositionTimeOffsetsPresent) {
                sample.sampleCompositionTimeOffset = Token.UINT32_BE.get(buf, dynOffset);
                dynOffset += 4;
            }
            trun.samples.push(sample);
        }
        return trun;
    }
}
/**
 * HandlerBox (`hdlr`)
 */
export class HandlerBox {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        const _flagOffset = off + 1;
        const charTypeToken = new Token.StringType(4, 'utf-8');
        return {
            version: Token.INT8.get(buf, off),
            flags: Token.UINT24_BE.get(buf, off + 1),
            componentType: charTypeToken.get(buf, off + 4),
            handlerType: charTypeToken.get(buf, off + 8),
            componentName: new Token.StringType(this.len - 28, 'utf-8').get(buf, off + 28),
        };
    }
}
/**
 * Chapter Track Reference Box (`chap`)
 */
export class ChapterTrackReferenceBox {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        let dynOffset = 0;
        const trackIds = [];
        while (dynOffset < this.len) {
            trackIds.push(Token.UINT32_BE.get(buf, off + dynOffset));
            dynOffset += 4;
        }
        return trackIds;
    }
}
