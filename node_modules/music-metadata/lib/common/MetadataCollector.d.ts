import { type FormatId, type IAudioMetadata, type ICommonTagsResult, type IFormat, type INativeTags, type IOptions, type IQualityInformation, type ITrackInfo, type AnyTagValue } from '../type.js';
import { type IGenericTag, type TagType } from './GenericTagTypes.js';
/**
 * Combines all generic-tag-mappers for each tag type
 */
export interface IWarningCollector {
    /**
     * Register parser warning
     * @param warning
     */
    addWarning(warning: string): void;
}
export interface INativeMetadataCollector extends IWarningCollector {
    /**
     * Only use this for reading
     */
    readonly format: IFormat;
    readonly native: INativeTags;
    readonly quality: IQualityInformation;
    /**
     * @returns {boolean} true if one or more tags have been found
     */
    hasAny(): boolean;
    setFormat(key: FormatId, value: AnyTagValue): void;
    addTag(tagType: TagType, tagId: string, value: AnyTagValue): Promise<void>;
    addStreamInfo(streamInfo: ITrackInfo): void;
    setAudioOnly(): void;
}
/**
 * Provided to the parser to uodate the metadata result.
 * Responsible for triggering async updates
 */
export declare class MetadataCollector implements INativeMetadataCollector {
    readonly format: IFormat;
    readonly native: INativeTags;
    readonly common: ICommonTagsResult;
    readonly quality: IQualityInformation;
    /**
     * Keeps track of origin priority for each mapped id
     */
    private readonly commonOrigin;
    /**
     * Maps a tag type to a priority
     */
    private readonly originPriority;
    private tagMapper;
    private opts?;
    constructor(opts?: IOptions);
    /**
     * @returns {boolean} true if one or more tags have been found
     */
    hasAny(): boolean;
    addStreamInfo(streamInfo: ITrackInfo): void;
    setFormat(key: FormatId, value: AnyTagValue): void;
    setAudioOnly(): void;
    addTag(tagType: TagType, tagId: string, value: AnyTagValue): Promise<void>;
    addWarning(warning: string): void;
    postMap(tagType: TagType | 'artificial', tag: IGenericTag): Promise<void>;
    /**
     * Convert native tags to common tags
     * @returns {IAudioMetadata} Native + common tags
     */
    toCommonMetadata(): IAudioMetadata;
    /**
     * Fix some common issues with picture object
     * @param picture Picture
     */
    private postFixPicture;
    /**
     * Convert native tag to common tags
     */
    private toCommon;
    /**
     * Set generic tag
     */
    private setGenericTag;
}
export declare function joinArtists(artists: string[]): string;
