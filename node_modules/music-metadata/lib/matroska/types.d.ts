import type { IEbmlDoc } from '../ebml/types.js';
export interface ISeek {
    id: Uint8Array;
    position: number;
}
export interface ISeekHead {
    seek: ISeek[];
}
export interface ISegmentInformation {
    uid?: Uint8Array;
    timecodeScale?: number;
    duration?: number;
    dateUTC?: number;
    title?: string;
    muxingApp?: string;
    writingApp?: string;
}
export interface ITrackEntry {
    uid?: Uint8Array;
    trackNumber: number;
    trackType?: TrackType;
    audio: ITrackAudio;
    video?: ITrackVideo;
    flagEnabled?: boolean;
    flagDefault?: boolean;
    flagLacing?: boolean;
    defaultDuration?: number;
    trackTimecodeScale?: number;
    name?: string;
    language?: string;
    codecID: string;
    codecPrivate?: Uint8Array;
    codecName?: string;
    codecSettings?: string;
    codecInfoUrl?: string;
    codecDownloadUrl?: string;
    codecDecodeAll?: string;
    trackOverlay?: string;
}
export interface ITrackVideo {
    flagInterlaced?: boolean;
    stereoMode?: number;
    pixelWidth?: number;
    pixelHeight?: number;
    displayWidth?: number;
    displayHeight?: number;
    displayUnit?: number;
    aspectRatioType?: number;
    colourSpace?: Uint8Array;
    gammaValue?: number;
}
export interface ITrackAudio {
    samplingFrequency?: number;
    outputSamplingFrequency?: number;
    channels?: number;
    channelPositions?: Uint8Array;
    bitDepth?: number;
}
export interface ICuePoint {
    cueTime?: number;
    cueTrackPositions: ICueTrackPosition[];
}
export interface ICueTrackPosition {
    cueTrack?: number;
    cueClusterPosition?: number;
    cueBlockNumber?: number;
    cueCodecState?: number;
    cueReference?: ICueReference;
}
export interface ICueReference {
    cueRefTime?: number;
    cueRefCluster?: number;
    cueRefNumber?: number;
    cueRefCodecState?: number;
}
export interface ISimpleTag {
    name?: string;
    'string'?: string;
    binary?: Uint8Array;
    language?: string;
    default?: boolean;
}
export declare const TargetType: {
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
};
export declare const TrackType: {
    video: number;
    audio: number;
    complex: number;
    logo: number;
    subtitle: number;
    button: number;
    control: number;
};
export type TrackType = typeof TrackType[keyof typeof TrackType];
export type TrackTypeKey = keyof typeof TrackType;
export declare const TrackTypeValueToKeyMap: Record<TrackType, TrackTypeKey>;
export interface ITarget {
    trackUID?: Uint8Array;
    chapterUID?: Uint8Array;
    attachmentUID?: Uint8Array;
    targetTypeValue?: keyof typeof TargetType;
    targetType?: string;
}
export interface ITag {
    target: ITarget;
    simpleTags: ISimpleTag[];
}
export interface ITags {
    tag: ITag[];
}
export interface ITrackElement {
    entries?: ITrackEntry[];
}
export interface IAttachmedFile {
    description?: string;
    name: string;
    mimeType: string;
    data: Uint8Array;
    uid: string;
}
export interface IAttachments {
    attachedFiles: IAttachmedFile[];
}
export interface IMatroskaSegment {
    metaSeekInfo?: ISeekHead;
    seekHeads?: ISeek[];
    info?: ISegmentInformation;
    tracks?: ITrackElement;
    tags?: ITags;
    cues?: ICuePoint[];
    attachments?: IAttachments;
}
export interface IMatroskaDoc extends IEbmlDoc {
    segment: IMatroskaSegment;
}
