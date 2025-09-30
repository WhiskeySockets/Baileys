import { proto } from '../../WAProto/index.js';
import type { SocketConfig } from '../Types/index.js';
export declare const UNAUTHORIZED_CODES: number[];
export declare const DEFAULT_ORIGIN = "https://web.whatsapp.com";
export declare const CALL_VIDEO_PREFIX = "https://call.whatsapp.com/video/";
export declare const CALL_AUDIO_PREFIX = "https://call.whatsapp.com/voice/";
export declare const DEF_CALLBACK_PREFIX = "CB:";
export declare const DEF_TAG_PREFIX = "TAG:";
export declare const PHONE_CONNECTION_CB = "CB:Pong";
export declare const WA_DEFAULT_EPHEMERAL: number;
export declare const NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\0\0\0\0";
export declare const DICT_VERSION = 3;
export declare const KEY_BUNDLE_TYPE: Buffer<ArrayBuffer>;
export declare const NOISE_WA_HEADER: Buffer<ArrayBuffer>;
/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export declare const URL_REGEX: RegExp;
export declare const WA_CERT_DETAILS: {
    SERIAL: number;
};
export declare const PROCESSABLE_HISTORY_TYPES: proto.Message.HistorySyncNotification.HistorySyncType[];
export declare const DEFAULT_CONNECTION_CONFIG: SocketConfig;
export declare const MEDIA_PATH_MAP: {
    [T in MediaType]?: string;
};
export declare const MEDIA_HKDF_KEY_MAPPING: {
    audio: string;
    document: string;
    gif: string;
    image: string;
    ppic: string;
    product: string;
    ptt: string;
    sticker: string;
    video: string;
    'thumbnail-document': string;
    'thumbnail-image': string;
    'thumbnail-video': string;
    'thumbnail-link': string;
    'md-msg-hist': string;
    'md-app-state': string;
    'product-catalog-image': string;
    'payment-bg-image': string;
    ptv: string;
    'biz-cover-photo': string;
};
export type MediaType = keyof typeof MEDIA_HKDF_KEY_MAPPING;
export declare const MEDIA_KEYS: MediaType[];
export declare const MIN_PREKEY_COUNT = 5;
export declare const INITIAL_PREKEY_COUNT = 30;
export declare const UPLOAD_TIMEOUT = 30000;
export declare const MIN_UPLOAD_INTERVAL = 5000;
export declare const DEFAULT_CACHE_TTLS: {
    SIGNAL_STORE: number;
    MSG_RETRY: number;
    CALL_OFFER: number;
    USER_DEVICES: number;
};
//# sourceMappingURL=index.d.ts.map