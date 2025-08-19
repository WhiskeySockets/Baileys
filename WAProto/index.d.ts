import * as $protobuf from "protobufjs";
import Long = require("long");
export namespace proto {

    interface IADVDeviceIdentity {
        rawId?: (number|null);
        timestamp?: (number|Long|null);
        keyIndex?: (number|null);
        accountType?: (proto.ADVEncryptionType|null);
        deviceType?: (proto.ADVEncryptionType|null);
    }

    class ADVDeviceIdentity implements IADVDeviceIdentity {
        constructor(p?: proto.IADVDeviceIdentity);
        public rawId: number;
        public timestamp: (number|Long);
        public keyIndex: number;
        public accountType: proto.ADVEncryptionType;
        public deviceType: proto.ADVEncryptionType;
        public static create(properties?: proto.IADVDeviceIdentity): proto.ADVDeviceIdentity;
        public static encode(m: proto.IADVDeviceIdentity, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ADVDeviceIdentity;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum ADVEncryptionType {
        E2EE = 0,
        HOSTED = 1
    }

    interface IADVKeyIndexList {
        rawId?: (number|null);
        timestamp?: (number|Long|null);
        currentIndex?: (number|null);
        validIndexes?: (number[]|null);
        accountType?: (proto.ADVEncryptionType|null);
    }

    class ADVKeyIndexList implements IADVKeyIndexList {
        constructor(p?: proto.IADVKeyIndexList);
        public rawId: number;
        public timestamp: (number|Long);
        public currentIndex: number;
        public validIndexes: number[];
        public accountType: proto.ADVEncryptionType;
        public static create(properties?: proto.IADVKeyIndexList): proto.ADVKeyIndexList;
        public static encode(m: proto.IADVKeyIndexList, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ADVKeyIndexList;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IADVSignedDeviceIdentity {
        details?: (Uint8Array|null);
        accountSignatureKey?: (Uint8Array|null);
        accountSignature?: (Uint8Array|null);
        deviceSignature?: (Uint8Array|null);
    }

    class ADVSignedDeviceIdentity implements IADVSignedDeviceIdentity {
        constructor(p?: proto.IADVSignedDeviceIdentity);
        public details: Uint8Array;
        public accountSignatureKey: Uint8Array;
        public accountSignature: Uint8Array;
        public deviceSignature: Uint8Array;
        public static create(properties?: proto.IADVSignedDeviceIdentity): proto.ADVSignedDeviceIdentity;
        public static encode(m: proto.IADVSignedDeviceIdentity, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ADVSignedDeviceIdentity;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IADVSignedDeviceIdentityHMAC {
        details?: (Uint8Array|null);
        hmac?: (Uint8Array|null);
        accountType?: (proto.ADVEncryptionType|null);
    }

    class ADVSignedDeviceIdentityHMAC implements IADVSignedDeviceIdentityHMAC {
        constructor(p?: proto.IADVSignedDeviceIdentityHMAC);
        public details: Uint8Array;
        public hmac: Uint8Array;
        public accountType: proto.ADVEncryptionType;
        public static create(properties?: proto.IADVSignedDeviceIdentityHMAC): proto.ADVSignedDeviceIdentityHMAC;
        public static encode(m: proto.IADVSignedDeviceIdentityHMAC, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ADVSignedDeviceIdentityHMAC;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IADVSignedKeyIndexList {
        details?: (Uint8Array|null);
        accountSignature?: (Uint8Array|null);
        accountSignatureKey?: (Uint8Array|null);
    }

    class ADVSignedKeyIndexList implements IADVSignedKeyIndexList {
        constructor(p?: proto.IADVSignedKeyIndexList);
        public details: Uint8Array;
        public accountSignature: Uint8Array;
        public accountSignatureKey: Uint8Array;
        public static create(properties?: proto.IADVSignedKeyIndexList): proto.ADVSignedKeyIndexList;
        public static encode(m: proto.IADVSignedKeyIndexList, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ADVSignedKeyIndexList;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IAIQueryFanout {
        messageKey?: (proto.IMessageKey|null);
        message?: (proto.IMessage|null);
        timestamp?: (number|Long|null);
    }

    class AIQueryFanout implements IAIQueryFanout {
        constructor(p?: proto.IAIQueryFanout);
        public messageKey?: (proto.IMessageKey|null);
        public message?: (proto.IMessage|null);
        public timestamp: (number|Long);
        public static create(properties?: proto.IAIQueryFanout): proto.AIQueryFanout;
        public static encode(m: proto.IAIQueryFanout, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIQueryFanout;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IAIRichResponseMessage {
        messageType?: (proto.AIRichResponseMessage.AIRichResponseMessageType|null);
        submessages?: (proto.AIRichResponseMessage.IAIRichResponseSubMessage[]|null);
        unifiedResponse?: (proto.AIRichResponseMessage.IAIRichResponseUnifiedResponse|null);
    }

    class AIRichResponseMessage implements IAIRichResponseMessage {
        constructor(p?: proto.IAIRichResponseMessage);
        public messageType: proto.AIRichResponseMessage.AIRichResponseMessageType;
        public submessages: proto.AIRichResponseMessage.IAIRichResponseSubMessage[];
        public unifiedResponse?: (proto.AIRichResponseMessage.IAIRichResponseUnifiedResponse|null);
        public static create(properties?: proto.IAIRichResponseMessage): proto.AIRichResponseMessage;
        public static encode(m: proto.IAIRichResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace AIRichResponseMessage {

        interface IAIRichResponseCodeMetadata {
            codeLanguage?: (string|null);
            codeBlocks?: (proto.AIRichResponseMessage.AIRichResponseCodeMetadata.IAIRichResponseCodeBlock[]|null);
        }

        class AIRichResponseCodeMetadata implements IAIRichResponseCodeMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseCodeMetadata);
            public codeLanguage: string;
            public codeBlocks: proto.AIRichResponseMessage.AIRichResponseCodeMetadata.IAIRichResponseCodeBlock[];
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseCodeMetadata): proto.AIRichResponseMessage.AIRichResponseCodeMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseCodeMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseCodeMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseCodeMetadata {

            interface IAIRichResponseCodeBlock {
                highlightType?: (proto.AIRichResponseMessage.AIRichResponseCodeMetadata.AIRichResponseCodeHighlightType|null);
                codeContent?: (string|null);
            }

            class AIRichResponseCodeBlock implements IAIRichResponseCodeBlock {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseCodeMetadata.IAIRichResponseCodeBlock);
                public highlightType: proto.AIRichResponseMessage.AIRichResponseCodeMetadata.AIRichResponseCodeHighlightType;
                public codeContent: string;
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseCodeMetadata.IAIRichResponseCodeBlock): proto.AIRichResponseMessage.AIRichResponseCodeMetadata.AIRichResponseCodeBlock;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseCodeMetadata.IAIRichResponseCodeBlock, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseCodeMetadata.AIRichResponseCodeBlock;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum AIRichResponseCodeHighlightType {
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_DEFAULT = 0,
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_KEYWORD = 1,
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_METHOD = 2,
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_STRING = 3,
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_NUMBER = 4,
                AI_RICH_RESPONSE_CODE_HIGHLIGHT_COMMENT = 5
            }
        }

        interface IAIRichResponseContentItemsMetadata {
            itemsMetadata?: (proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseContentItemMetadata[]|null);
            contentType?: (proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.ContentType|null);
        }

        class AIRichResponseContentItemsMetadata implements IAIRichResponseContentItemsMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseContentItemsMetadata);
            public itemsMetadata: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseContentItemMetadata[];
            public contentType: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.ContentType;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseContentItemsMetadata): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseContentItemsMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseContentItemsMetadata {

            interface IAIRichResponseContentItemMetadata {
                reelItem?: (proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseReelItem|null);
            }

            class AIRichResponseContentItemMetadata implements IAIRichResponseContentItemMetadata {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseContentItemMetadata);
                public reelItem?: (proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseReelItem|null);
                public aIRichResponseContentItem?: "reelItem";
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseContentItemMetadata): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.AIRichResponseContentItemMetadata;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseContentItemMetadata, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.AIRichResponseContentItemMetadata;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IAIRichResponseReelItem {
                title?: (string|null);
                profileIconUrl?: (string|null);
                thumbnailUrl?: (string|null);
                videoUrl?: (string|null);
            }

            class AIRichResponseReelItem implements IAIRichResponseReelItem {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseReelItem);
                public title: string;
                public profileIconUrl: string;
                public thumbnailUrl: string;
                public videoUrl: string;
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseReelItem): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.AIRichResponseReelItem;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.IAIRichResponseReelItem, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseContentItemsMetadata.AIRichResponseReelItem;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum ContentType {
                DEFAULT = 0,
                CAROUSEL = 1
            }
        }

        interface IAIRichResponseDynamicMetadata {
            type?: (proto.AIRichResponseMessage.AIRichResponseDynamicMetadata.AIRichResponseDynamicMetadataType|null);
            version?: (number|Long|null);
            url?: (string|null);
            loopCount?: (number|null);
        }

        class AIRichResponseDynamicMetadata implements IAIRichResponseDynamicMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseDynamicMetadata);
            public type: proto.AIRichResponseMessage.AIRichResponseDynamicMetadata.AIRichResponseDynamicMetadataType;
            public version: (number|Long);
            public url: string;
            public loopCount: number;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseDynamicMetadata): proto.AIRichResponseMessage.AIRichResponseDynamicMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseDynamicMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseDynamicMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseDynamicMetadata {

            enum AIRichResponseDynamicMetadataType {
                AI_RICH_RESPONSE_DYNAMIC_METADATA_TYPE_UNKNOWN = 0,
                AI_RICH_RESPONSE_DYNAMIC_METADATA_TYPE_IMAGE = 1,
                AI_RICH_RESPONSE_DYNAMIC_METADATA_TYPE_GIF = 2
            }
        }

        interface IAIRichResponseGridImageMetadata {
            gridImageUrl?: (proto.AIRichResponseMessage.IAIRichResponseImageURL|null);
            imageUrls?: (proto.AIRichResponseMessage.IAIRichResponseImageURL[]|null);
        }

        class AIRichResponseGridImageMetadata implements IAIRichResponseGridImageMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseGridImageMetadata);
            public gridImageUrl?: (proto.AIRichResponseMessage.IAIRichResponseImageURL|null);
            public imageUrls: proto.AIRichResponseMessage.IAIRichResponseImageURL[];
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseGridImageMetadata): proto.AIRichResponseMessage.AIRichResponseGridImageMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseGridImageMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseGridImageMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAIRichResponseImageURL {
            imagePreviewUrl?: (string|null);
            imageHighResUrl?: (string|null);
            sourceUrl?: (string|null);
        }

        class AIRichResponseImageURL implements IAIRichResponseImageURL {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseImageURL);
            public imagePreviewUrl: string;
            public imageHighResUrl: string;
            public sourceUrl: string;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseImageURL): proto.AIRichResponseMessage.AIRichResponseImageURL;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseImageURL, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseImageURL;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAIRichResponseInlineImageMetadata {
            imageUrl?: (proto.AIRichResponseMessage.IAIRichResponseImageURL|null);
            imageText?: (string|null);
            alignment?: (proto.AIRichResponseMessage.AIRichResponseInlineImageMetadata.AIRichResponseImageAlignment|null);
            tapLinkUrl?: (string|null);
        }

        class AIRichResponseInlineImageMetadata implements IAIRichResponseInlineImageMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseInlineImageMetadata);
            public imageUrl?: (proto.AIRichResponseMessage.IAIRichResponseImageURL|null);
            public imageText: string;
            public alignment: proto.AIRichResponseMessage.AIRichResponseInlineImageMetadata.AIRichResponseImageAlignment;
            public tapLinkUrl: string;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseInlineImageMetadata): proto.AIRichResponseMessage.AIRichResponseInlineImageMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseInlineImageMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseInlineImageMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseInlineImageMetadata {

            enum AIRichResponseImageAlignment {
                AI_RICH_RESPONSE_IMAGE_LAYOUT_LEADING_ALIGNED = 0,
                AI_RICH_RESPONSE_IMAGE_LAYOUT_TRAILING_ALIGNED = 1,
                AI_RICH_RESPONSE_IMAGE_LAYOUT_CENTER_ALIGNED = 2
            }
        }

        interface IAIRichResponseLatexMetadata {
            text?: (string|null);
            expressions?: (proto.AIRichResponseMessage.AIRichResponseLatexMetadata.IAIRichResponseLatexExpression[]|null);
        }

        class AIRichResponseLatexMetadata implements IAIRichResponseLatexMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseLatexMetadata);
            public text: string;
            public expressions: proto.AIRichResponseMessage.AIRichResponseLatexMetadata.IAIRichResponseLatexExpression[];
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseLatexMetadata): proto.AIRichResponseMessage.AIRichResponseLatexMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseLatexMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseLatexMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseLatexMetadata {

            interface IAIRichResponseLatexExpression {
                latexExpression?: (string|null);
                url?: (string|null);
                width?: (number|null);
                height?: (number|null);
                fontHeight?: (number|null);
                imageTopPadding?: (number|null);
                imageLeadingPadding?: (number|null);
                imageBottomPadding?: (number|null);
                imageTrailingPadding?: (number|null);
            }

            class AIRichResponseLatexExpression implements IAIRichResponseLatexExpression {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseLatexMetadata.IAIRichResponseLatexExpression);
                public latexExpression: string;
                public url: string;
                public width: number;
                public height: number;
                public fontHeight: number;
                public imageTopPadding: number;
                public imageLeadingPadding: number;
                public imageBottomPadding: number;
                public imageTrailingPadding: number;
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseLatexMetadata.IAIRichResponseLatexExpression): proto.AIRichResponseMessage.AIRichResponseLatexMetadata.AIRichResponseLatexExpression;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseLatexMetadata.IAIRichResponseLatexExpression, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseLatexMetadata.AIRichResponseLatexExpression;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IAIRichResponseMapMetadata {
            centerLatitude?: (number|null);
            centerLongitude?: (number|null);
            latitudeDelta?: (number|null);
            longitudeDelta?: (number|null);
            annotations?: (proto.AIRichResponseMessage.AIRichResponseMapMetadata.IAIRichResponseMapAnnotation[]|null);
            showInfoList?: (boolean|null);
        }

        class AIRichResponseMapMetadata implements IAIRichResponseMapMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseMapMetadata);
            public centerLatitude: number;
            public centerLongitude: number;
            public latitudeDelta: number;
            public longitudeDelta: number;
            public annotations: proto.AIRichResponseMessage.AIRichResponseMapMetadata.IAIRichResponseMapAnnotation[];
            public showInfoList: boolean;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseMapMetadata): proto.AIRichResponseMessage.AIRichResponseMapMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseMapMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseMapMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseMapMetadata {

            interface IAIRichResponseMapAnnotation {
                annotationNumber?: (number|null);
                latitude?: (number|null);
                longitude?: (number|null);
                title?: (string|null);
                body?: (string|null);
            }

            class AIRichResponseMapAnnotation implements IAIRichResponseMapAnnotation {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseMapMetadata.IAIRichResponseMapAnnotation);
                public annotationNumber: number;
                public latitude: number;
                public longitude: number;
                public title: string;
                public body: string;
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseMapMetadata.IAIRichResponseMapAnnotation): proto.AIRichResponseMessage.AIRichResponseMapMetadata.AIRichResponseMapAnnotation;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseMapMetadata.IAIRichResponseMapAnnotation, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseMapMetadata.AIRichResponseMapAnnotation;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        enum AIRichResponseMessageType {
            AI_RICH_RESPONSE_TYPE_UNKNOWN = 0,
            AI_RICH_RESPONSE_TYPE_STANDARD = 1
        }

        interface IAIRichResponseSubMessage {
            messageType?: (proto.AIRichResponseMessage.AIRichResponseSubMessageType|null);
            gridImageMetadata?: (proto.AIRichResponseMessage.IAIRichResponseGridImageMetadata|null);
            messageText?: (string|null);
            imageMetadata?: (proto.AIRichResponseMessage.IAIRichResponseInlineImageMetadata|null);
            codeMetadata?: (proto.AIRichResponseMessage.IAIRichResponseCodeMetadata|null);
            tableMetadata?: (proto.AIRichResponseMessage.IAIRichResponseTableMetadata|null);
            dynamicMetadata?: (proto.AIRichResponseMessage.IAIRichResponseDynamicMetadata|null);
            latexMetadata?: (proto.AIRichResponseMessage.IAIRichResponseLatexMetadata|null);
            mapMetadata?: (proto.AIRichResponseMessage.IAIRichResponseMapMetadata|null);
            contentItemsMetadata?: (proto.AIRichResponseMessage.IAIRichResponseContentItemsMetadata|null);
        }

        class AIRichResponseSubMessage implements IAIRichResponseSubMessage {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseSubMessage);
            public messageType: proto.AIRichResponseMessage.AIRichResponseSubMessageType;
            public gridImageMetadata?: (proto.AIRichResponseMessage.IAIRichResponseGridImageMetadata|null);
            public messageText: string;
            public imageMetadata?: (proto.AIRichResponseMessage.IAIRichResponseInlineImageMetadata|null);
            public codeMetadata?: (proto.AIRichResponseMessage.IAIRichResponseCodeMetadata|null);
            public tableMetadata?: (proto.AIRichResponseMessage.IAIRichResponseTableMetadata|null);
            public dynamicMetadata?: (proto.AIRichResponseMessage.IAIRichResponseDynamicMetadata|null);
            public latexMetadata?: (proto.AIRichResponseMessage.IAIRichResponseLatexMetadata|null);
            public mapMetadata?: (proto.AIRichResponseMessage.IAIRichResponseMapMetadata|null);
            public contentItemsMetadata?: (proto.AIRichResponseMessage.IAIRichResponseContentItemsMetadata|null);
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseSubMessage): proto.AIRichResponseMessage.AIRichResponseSubMessage;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseSubMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseSubMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum AIRichResponseSubMessageType {
            AI_RICH_RESPONSE_UNKNOWN = 0,
            AI_RICH_RESPONSE_GRID_IMAGE = 1,
            AI_RICH_RESPONSE_TEXT = 2,
            AI_RICH_RESPONSE_INLINE_IMAGE = 3,
            AI_RICH_RESPONSE_TABLE = 4,
            AI_RICH_RESPONSE_CODE = 5,
            AI_RICH_RESPONSE_DYNAMIC = 6,
            AI_RICH_RESPONSE_MAP = 7,
            AI_RICH_RESPONSE_LATEX = 8,
            AI_RICH_RESPONSE_CONTENT_ITEMS = 9
        }

        interface IAIRichResponseTableMetadata {
            rows?: (proto.AIRichResponseMessage.AIRichResponseTableMetadata.IAIRichResponseTableRow[]|null);
        }

        class AIRichResponseTableMetadata implements IAIRichResponseTableMetadata {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseTableMetadata);
            public rows: proto.AIRichResponseMessage.AIRichResponseTableMetadata.IAIRichResponseTableRow[];
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseTableMetadata): proto.AIRichResponseMessage.AIRichResponseTableMetadata;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseTableMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseTableMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AIRichResponseTableMetadata {

            interface IAIRichResponseTableRow {
                items?: (string[]|null);
                isHeading?: (boolean|null);
            }

            class AIRichResponseTableRow implements IAIRichResponseTableRow {
                constructor(p?: proto.AIRichResponseMessage.AIRichResponseTableMetadata.IAIRichResponseTableRow);
                public items: string[];
                public isHeading: boolean;
                public static create(properties?: proto.AIRichResponseMessage.AIRichResponseTableMetadata.IAIRichResponseTableRow): proto.AIRichResponseMessage.AIRichResponseTableMetadata.AIRichResponseTableRow;
                public static encode(m: proto.AIRichResponseMessage.AIRichResponseTableMetadata.IAIRichResponseTableRow, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseTableMetadata.AIRichResponseTableRow;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IAIRichResponseUnifiedResponse {
            data?: (Uint8Array|null);
        }

        class AIRichResponseUnifiedResponse implements IAIRichResponseUnifiedResponse {
            constructor(p?: proto.AIRichResponseMessage.IAIRichResponseUnifiedResponse);
            public data: Uint8Array;
            public static create(properties?: proto.AIRichResponseMessage.IAIRichResponseUnifiedResponse): proto.AIRichResponseMessage.AIRichResponseUnifiedResponse;
            public static encode(m: proto.AIRichResponseMessage.IAIRichResponseUnifiedResponse, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AIRichResponseMessage.AIRichResponseUnifiedResponse;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IAccount {
        lid?: (string|null);
        username?: (string|null);
        countryCode?: (string|null);
        isUsernameDeleted?: (boolean|null);
    }

    class Account implements IAccount {
        constructor(p?: proto.IAccount);
        public lid: string;
        public username: string;
        public countryCode: string;
        public isUsernameDeleted: boolean;
        public static create(properties?: proto.IAccount): proto.Account;
        public static encode(m: proto.IAccount, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Account;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IActionLink {
        url?: (string|null);
        buttonTitle?: (string|null);
    }

    class ActionLink implements IActionLink {
        constructor(p?: proto.IActionLink);
        public url: string;
        public buttonTitle: string;
        public static create(properties?: proto.IActionLink): proto.ActionLink;
        public static encode(m: proto.IActionLink, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ActionLink;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IAutoDownloadSettings {
        downloadImages?: (boolean|null);
        downloadAudio?: (boolean|null);
        downloadVideo?: (boolean|null);
        downloadDocuments?: (boolean|null);
    }

    class AutoDownloadSettings implements IAutoDownloadSettings {
        constructor(p?: proto.IAutoDownloadSettings);
        public downloadImages: boolean;
        public downloadAudio: boolean;
        public downloadVideo: boolean;
        public downloadDocuments: boolean;
        public static create(properties?: proto.IAutoDownloadSettings): proto.AutoDownloadSettings;
        public static encode(m: proto.IAutoDownloadSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AutoDownloadSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IAvatarUserSettings {
        fbid?: (string|null);
        password?: (string|null);
    }

    class AvatarUserSettings implements IAvatarUserSettings {
        constructor(p?: proto.IAvatarUserSettings);
        public fbid: string;
        public password: string;
        public static create(properties?: proto.IAvatarUserSettings): proto.AvatarUserSettings;
        public static encode(m: proto.IAvatarUserSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.AvatarUserSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBizAccountLinkInfo {
        whatsappBizAcctFbid?: (number|Long|null);
        whatsappAcctNumber?: (string|null);
        issueTime?: (number|Long|null);
        hostStorage?: (proto.BizAccountLinkInfo.HostStorageType|null);
        accountType?: (proto.BizAccountLinkInfo.AccountType|null);
    }

    class BizAccountLinkInfo implements IBizAccountLinkInfo {
        constructor(p?: proto.IBizAccountLinkInfo);
        public whatsappBizAcctFbid: (number|Long);
        public whatsappAcctNumber: string;
        public issueTime: (number|Long);
        public hostStorage: proto.BizAccountLinkInfo.HostStorageType;
        public accountType: proto.BizAccountLinkInfo.AccountType;
        public static create(properties?: proto.IBizAccountLinkInfo): proto.BizAccountLinkInfo;
        public static encode(m: proto.IBizAccountLinkInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BizAccountLinkInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BizAccountLinkInfo {

        enum AccountType {
            ENTERPRISE = 0
        }

        enum HostStorageType {
            ON_PREMISE = 0,
            FACEBOOK = 1
        }
    }

    interface IBizAccountPayload {
        vnameCert?: (proto.IVerifiedNameCertificate|null);
        bizAcctLinkInfo?: (Uint8Array|null);
    }

    class BizAccountPayload implements IBizAccountPayload {
        constructor(p?: proto.IBizAccountPayload);
        public vnameCert?: (proto.IVerifiedNameCertificate|null);
        public bizAcctLinkInfo: Uint8Array;
        public static create(properties?: proto.IBizAccountPayload): proto.BizAccountPayload;
        public static encode(m: proto.IBizAccountPayload, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BizAccountPayload;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBizIdentityInfo {
        vlevel?: (proto.BizIdentityInfo.VerifiedLevelValue|null);
        vnameCert?: (proto.IVerifiedNameCertificate|null);
        signed?: (boolean|null);
        revoked?: (boolean|null);
        hostStorage?: (proto.BizIdentityInfo.HostStorageType|null);
        actualActors?: (proto.BizIdentityInfo.ActualActorsType|null);
        privacyModeTs?: (number|Long|null);
        featureControls?: (number|Long|null);
    }

    class BizIdentityInfo implements IBizIdentityInfo {
        constructor(p?: proto.IBizIdentityInfo);
        public vlevel: proto.BizIdentityInfo.VerifiedLevelValue;
        public vnameCert?: (proto.IVerifiedNameCertificate|null);
        public signed: boolean;
        public revoked: boolean;
        public hostStorage: proto.BizIdentityInfo.HostStorageType;
        public actualActors: proto.BizIdentityInfo.ActualActorsType;
        public privacyModeTs: (number|Long);
        public featureControls: (number|Long);
        public static create(properties?: proto.IBizIdentityInfo): proto.BizIdentityInfo;
        public static encode(m: proto.IBizIdentityInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BizIdentityInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BizIdentityInfo {

        enum ActualActorsType {
            SELF = 0,
            BSP = 1
        }

        enum HostStorageType {
            ON_PREMISE = 0,
            FACEBOOK = 1
        }

        enum VerifiedLevelValue {
            UNKNOWN = 0,
            LOW = 1,
            HIGH = 2
        }
    }

    interface IBotAgeCollectionMetadata {
        ageCollectionEligible?: (boolean|null);
        shouldTriggerAgeCollectionOnClient?: (boolean|null);
    }

    class BotAgeCollectionMetadata implements IBotAgeCollectionMetadata {
        constructor(p?: proto.IBotAgeCollectionMetadata);
        public ageCollectionEligible: boolean;
        public shouldTriggerAgeCollectionOnClient: boolean;
        public static create(properties?: proto.IBotAgeCollectionMetadata): proto.BotAgeCollectionMetadata;
        public static encode(m: proto.IBotAgeCollectionMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotAgeCollectionMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotAvatarMetadata {
        sentiment?: (number|null);
        behaviorGraph?: (string|null);
        action?: (number|null);
        intensity?: (number|null);
        wordCount?: (number|null);
    }

    class BotAvatarMetadata implements IBotAvatarMetadata {
        constructor(p?: proto.IBotAvatarMetadata);
        public sentiment: number;
        public behaviorGraph: string;
        public action: number;
        public intensity: number;
        public wordCount: number;
        public static create(properties?: proto.IBotAvatarMetadata): proto.BotAvatarMetadata;
        public static encode(m: proto.IBotAvatarMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotAvatarMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotCapabilityMetadata {
        capabilities?: (proto.BotCapabilityMetadata.BotCapabilityType[]|null);
    }

    class BotCapabilityMetadata implements IBotCapabilityMetadata {
        constructor(p?: proto.IBotCapabilityMetadata);
        public capabilities: proto.BotCapabilityMetadata.BotCapabilityType[];
        public static create(properties?: proto.IBotCapabilityMetadata): proto.BotCapabilityMetadata;
        public static encode(m: proto.IBotCapabilityMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotCapabilityMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotCapabilityMetadata {

        enum BotCapabilityType {
            UNKNOWN = 0,
            PROGRESS_INDICATOR = 1,
            RICH_RESPONSE_HEADING = 2,
            RICH_RESPONSE_NESTED_LIST = 3,
            AI_MEMORY = 4,
            RICH_RESPONSE_THREAD_SURFING = 5,
            RICH_RESPONSE_TABLE = 6,
            RICH_RESPONSE_CODE = 7,
            RICH_RESPONSE_STRUCTURED_RESPONSE = 8,
            RICH_RESPONSE_INLINE_IMAGE = 9,
            WA_IG_1P_PLUGIN_RANKING_CONTROL = 10,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_1 = 11,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_2 = 12,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_3 = 13,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_4 = 14,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_5 = 15,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_6 = 16,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_7 = 17,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_8 = 18,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_9 = 19,
            WA_IG_1P_PLUGIN_RANKING_UPDATE_10 = 20,
            RICH_RESPONSE_SUB_HEADING = 21,
            RICH_RESPONSE_GRID_IMAGE = 22,
            AI_STUDIO_UGC_MEMORY = 23,
            RICH_RESPONSE_LATEX = 24,
            RICH_RESPONSE_MAPS = 25,
            RICH_RESPONSE_INLINE_REELS = 26,
            AGENTIC_PLANNING = 27,
            ACCOUNT_LINKING = 28,
            STREAMING_DISAGGREGATION = 29,
            RICH_RESPONSE_GRID_IMAGE_3P = 30,
            RICH_RESPONSE_LATEX_INLINE = 31,
            QUERY_PLAN = 32,
            PROACTIVE_MESSAGE = 33,
            RICH_RESPONSE_UNIFIED_RESPONSE = 34,
            PROMOTION_MESSAGE = 35
        }
    }

    interface IBotImagineMetadata {
        imagineType?: (proto.BotImagineMetadata.ImagineType|null);
    }

    class BotImagineMetadata implements IBotImagineMetadata {
        constructor(p?: proto.IBotImagineMetadata);
        public imagineType: proto.BotImagineMetadata.ImagineType;
        public static create(properties?: proto.IBotImagineMetadata): proto.BotImagineMetadata;
        public static encode(m: proto.IBotImagineMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotImagineMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotImagineMetadata {

        enum ImagineType {
            UNKNOWN = 0,
            IMAGINE = 1,
            MEMU = 2,
            FLASH = 3,
            EDIT = 4
        }
    }

    interface IBotLinkedAccount {
        type?: (proto.BotLinkedAccount.BotLinkedAccountType|null);
    }

    class BotLinkedAccount implements IBotLinkedAccount {
        constructor(p?: proto.IBotLinkedAccount);
        public type: proto.BotLinkedAccount.BotLinkedAccountType;
        public static create(properties?: proto.IBotLinkedAccount): proto.BotLinkedAccount;
        public static encode(m: proto.IBotLinkedAccount, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotLinkedAccount;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotLinkedAccount {

        enum BotLinkedAccountType {
            BOT_LINKED_ACCOUNT_TYPE_1P = 0
        }
    }

    interface IBotLinkedAccountsMetadata {
        accounts?: (proto.IBotLinkedAccount[]|null);
        acAuthTokens?: (Uint8Array|null);
        acErrorCode?: (number|null);
    }

    class BotLinkedAccountsMetadata implements IBotLinkedAccountsMetadata {
        constructor(p?: proto.IBotLinkedAccountsMetadata);
        public accounts: proto.IBotLinkedAccount[];
        public acAuthTokens: Uint8Array;
        public acErrorCode: number;
        public static create(properties?: proto.IBotLinkedAccountsMetadata): proto.BotLinkedAccountsMetadata;
        public static encode(m: proto.IBotLinkedAccountsMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotLinkedAccountsMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotMediaMetadata {
        fileSha256?: (string|null);
        mediaKey?: (string|null);
        fileEncSha256?: (string|null);
        directPath?: (string|null);
        mediaKeyTimestamp?: (number|Long|null);
        mimetype?: (string|null);
        orientationType?: (proto.BotMediaMetadata.OrientationType|null);
    }

    class BotMediaMetadata implements IBotMediaMetadata {
        constructor(p?: proto.IBotMediaMetadata);
        public fileSha256: string;
        public mediaKey: string;
        public fileEncSha256: string;
        public directPath: string;
        public mediaKeyTimestamp: (number|Long);
        public mimetype: string;
        public orientationType: proto.BotMediaMetadata.OrientationType;
        public static create(properties?: proto.IBotMediaMetadata): proto.BotMediaMetadata;
        public static encode(m: proto.IBotMediaMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMediaMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotMediaMetadata {

        enum OrientationType {
            CENTER = 1,
            LEFT = 2,
            RIGHT = 3
        }
    }

    interface IBotMemoryFact {
        fact?: (string|null);
        factId?: (string|null);
    }

    class BotMemoryFact implements IBotMemoryFact {
        constructor(p?: proto.IBotMemoryFact);
        public fact: string;
        public factId: string;
        public static create(properties?: proto.IBotMemoryFact): proto.BotMemoryFact;
        public static encode(m: proto.IBotMemoryFact, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMemoryFact;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotMemoryMetadata {
        addedFacts?: (proto.IBotMemoryFact[]|null);
        removedFacts?: (proto.IBotMemoryFact[]|null);
        disclaimer?: (string|null);
    }

    class BotMemoryMetadata implements IBotMemoryMetadata {
        constructor(p?: proto.IBotMemoryMetadata);
        public addedFacts: proto.IBotMemoryFact[];
        public removedFacts: proto.IBotMemoryFact[];
        public disclaimer: string;
        public static create(properties?: proto.IBotMemoryMetadata): proto.BotMemoryMetadata;
        public static encode(m: proto.IBotMemoryMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMemoryMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotMemuMetadata {
        faceImages?: (proto.IBotMediaMetadata[]|null);
    }

    class BotMemuMetadata implements IBotMemuMetadata {
        constructor(p?: proto.IBotMemuMetadata);
        public faceImages: proto.IBotMediaMetadata[];
        public static create(properties?: proto.IBotMemuMetadata): proto.BotMemuMetadata;
        public static encode(m: proto.IBotMemuMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMemuMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotMetadata {
        avatarMetadata?: (proto.IBotAvatarMetadata|null);
        personaId?: (string|null);
        pluginMetadata?: (proto.IBotPluginMetadata|null);
        suggestedPromptMetadata?: (proto.IBotSuggestedPromptMetadata|null);
        invokerJid?: (string|null);
        sessionMetadata?: (proto.IBotSessionMetadata|null);
        memuMetadata?: (proto.IBotMemuMetadata|null);
        timezone?: (string|null);
        reminderMetadata?: (proto.IBotReminderMetadata|null);
        modelMetadata?: (proto.IBotModelMetadata|null);
        messageDisclaimerText?: (string|null);
        progressIndicatorMetadata?: (proto.IBotProgressIndicatorMetadata|null);
        capabilityMetadata?: (proto.IBotCapabilityMetadata|null);
        imagineMetadata?: (proto.IBotImagineMetadata|null);
        memoryMetadata?: (proto.IBotMemoryMetadata|null);
        renderingMetadata?: (proto.IBotRenderingMetadata|null);
        botMetricsMetadata?: (proto.IBotMetricsMetadata|null);
        botLinkedAccountsMetadata?: (proto.IBotLinkedAccountsMetadata|null);
        richResponseSourcesMetadata?: (proto.IBotSourcesMetadata|null);
        aiConversationContext?: (Uint8Array|null);
        botPromotionMessageMetadata?: (proto.IBotPromotionMessageMetadata|null);
        botModeSelectionMetadata?: (proto.IBotModeSelectionMetadata|null);
        botQuotaMetadata?: (proto.IBotQuotaMetadata|null);
        botAgeCollectionMetadata?: (proto.IBotAgeCollectionMetadata|null);
    }

    class BotMetadata implements IBotMetadata {
        constructor(p?: proto.IBotMetadata);
        public avatarMetadata?: (proto.IBotAvatarMetadata|null);
        public personaId: string;
        public pluginMetadata?: (proto.IBotPluginMetadata|null);
        public suggestedPromptMetadata?: (proto.IBotSuggestedPromptMetadata|null);
        public invokerJid: string;
        public sessionMetadata?: (proto.IBotSessionMetadata|null);
        public memuMetadata?: (proto.IBotMemuMetadata|null);
        public timezone: string;
        public reminderMetadata?: (proto.IBotReminderMetadata|null);
        public modelMetadata?: (proto.IBotModelMetadata|null);
        public messageDisclaimerText: string;
        public progressIndicatorMetadata?: (proto.IBotProgressIndicatorMetadata|null);
        public capabilityMetadata?: (proto.IBotCapabilityMetadata|null);
        public imagineMetadata?: (proto.IBotImagineMetadata|null);
        public memoryMetadata?: (proto.IBotMemoryMetadata|null);
        public renderingMetadata?: (proto.IBotRenderingMetadata|null);
        public botMetricsMetadata?: (proto.IBotMetricsMetadata|null);
        public botLinkedAccountsMetadata?: (proto.IBotLinkedAccountsMetadata|null);
        public richResponseSourcesMetadata?: (proto.IBotSourcesMetadata|null);
        public aiConversationContext: Uint8Array;
        public botPromotionMessageMetadata?: (proto.IBotPromotionMessageMetadata|null);
        public botModeSelectionMetadata?: (proto.IBotModeSelectionMetadata|null);
        public botQuotaMetadata?: (proto.IBotQuotaMetadata|null);
        public botAgeCollectionMetadata?: (proto.IBotAgeCollectionMetadata|null);
        public static create(properties?: proto.IBotMetadata): proto.BotMetadata;
        public static encode(m: proto.IBotMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum BotMetricsEntryPoint {
        FAVICON = 1,
        CHATLIST = 2,
        AISEARCH_NULL_STATE_PAPER_PLANE = 3,
        AISEARCH_NULL_STATE_SUGGESTION = 4,
        AISEARCH_TYPE_AHEAD_SUGGESTION = 5,
        AISEARCH_TYPE_AHEAD_PAPER_PLANE = 6,
        AISEARCH_TYPE_AHEAD_RESULT_CHATLIST = 7,
        AISEARCH_TYPE_AHEAD_RESULT_MESSAGES = 8,
        AIVOICE_SEARCH_BAR = 9,
        AIVOICE_FAVICON = 10,
        AISTUDIO = 11,
        DEEPLINK = 12,
        NOTIFICATION = 13,
        PROFILE_MESSAGE_BUTTON = 14,
        FORWARD = 15,
        APP_SHORTCUT = 16,
        FF_FAMILY = 17,
        AI_TAB = 18,
        AI_HOME = 19,
        AI_DEEPLINK_IMMERSIVE = 20,
        AI_DEEPLINK = 21,
        META_AI_CHAT_SHORTCUT_AI_STUDIO = 22,
        UGC_CHAT_SHORTCUT_AI_STUDIO = 23,
        NEW_CHAT_AI_STUDIO = 24
    }

    interface IBotMetricsMetadata {
        destinationId?: (string|null);
        destinationEntryPoint?: (proto.BotMetricsEntryPoint|null);
        threadOrigin?: (proto.BotMetricsThreadEntryPoint|null);
    }

    class BotMetricsMetadata implements IBotMetricsMetadata {
        constructor(p?: proto.IBotMetricsMetadata);
        public destinationId: string;
        public destinationEntryPoint: proto.BotMetricsEntryPoint;
        public threadOrigin: proto.BotMetricsThreadEntryPoint;
        public static create(properties?: proto.IBotMetricsMetadata): proto.BotMetricsMetadata;
        public static encode(m: proto.IBotMetricsMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotMetricsMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum BotMetricsThreadEntryPoint {
        AI_TAB_THREAD = 1,
        AI_HOME_THREAD = 2,
        AI_DEEPLINK_IMMERSIVE_THREAD = 3,
        AI_DEEPLINK_THREAD = 4
    }

    interface IBotModeSelectionMetadata {
        mode?: (proto.BotModeSelectionMetadata.BotUserSelectionMode[]|null);
    }

    class BotModeSelectionMetadata implements IBotModeSelectionMetadata {
        constructor(p?: proto.IBotModeSelectionMetadata);
        public mode: proto.BotModeSelectionMetadata.BotUserSelectionMode[];
        public static create(properties?: proto.IBotModeSelectionMetadata): proto.BotModeSelectionMetadata;
        public static encode(m: proto.IBotModeSelectionMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotModeSelectionMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotModeSelectionMetadata {

        enum BotUserSelectionMode {
            UNKNOWN_MODE = 0,
            REASONING_MODE = 1
        }
    }

    interface IBotModelMetadata {
        modelType?: (proto.BotModelMetadata.ModelType|null);
        premiumModelStatus?: (proto.BotModelMetadata.PremiumModelStatus|null);
    }

    class BotModelMetadata implements IBotModelMetadata {
        constructor(p?: proto.IBotModelMetadata);
        public modelType: proto.BotModelMetadata.ModelType;
        public premiumModelStatus: proto.BotModelMetadata.PremiumModelStatus;
        public static create(properties?: proto.IBotModelMetadata): proto.BotModelMetadata;
        public static encode(m: proto.IBotModelMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotModelMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotModelMetadata {

        enum ModelType {
            UNKNOWN_TYPE = 0,
            LLAMA_PROD = 1,
            LLAMA_PROD_PREMIUM = 2
        }

        enum PremiumModelStatus {
            UNKNOWN_STATUS = 0,
            AVAILABLE = 1,
            QUOTA_EXCEED_LIMIT = 2
        }
    }

    interface IBotPluginMetadata {
        provider?: (proto.BotPluginMetadata.SearchProvider|null);
        pluginType?: (proto.BotPluginMetadata.PluginType|null);
        thumbnailCdnUrl?: (string|null);
        profilePhotoCdnUrl?: (string|null);
        searchProviderUrl?: (string|null);
        referenceIndex?: (number|null);
        expectedLinksCount?: (number|null);
        searchQuery?: (string|null);
        parentPluginMessageKey?: (proto.IMessageKey|null);
        deprecatedField?: (proto.BotPluginMetadata.PluginType|null);
        parentPluginType?: (proto.BotPluginMetadata.PluginType|null);
        faviconCdnUrl?: (string|null);
    }

    class BotPluginMetadata implements IBotPluginMetadata {
        constructor(p?: proto.IBotPluginMetadata);
        public provider: proto.BotPluginMetadata.SearchProvider;
        public pluginType: proto.BotPluginMetadata.PluginType;
        public thumbnailCdnUrl: string;
        public profilePhotoCdnUrl: string;
        public searchProviderUrl: string;
        public referenceIndex: number;
        public expectedLinksCount: number;
        public searchQuery: string;
        public parentPluginMessageKey?: (proto.IMessageKey|null);
        public deprecatedField: proto.BotPluginMetadata.PluginType;
        public parentPluginType: proto.BotPluginMetadata.PluginType;
        public faviconCdnUrl: string;
        public static create(properties?: proto.IBotPluginMetadata): proto.BotPluginMetadata;
        public static encode(m: proto.IBotPluginMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotPluginMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotPluginMetadata {

        enum PluginType {
            UNKNOWN_PLUGIN = 0,
            REELS = 1,
            SEARCH = 2
        }

        enum SearchProvider {
            UNKNOWN = 0,
            BING = 1,
            GOOGLE = 2,
            SUPPORT = 3
        }
    }

    interface IBotProgressIndicatorMetadata {
        progressDescription?: (string|null);
        stepsMetadata?: (proto.BotProgressIndicatorMetadata.IBotPlanningStepMetadata[]|null);
    }

    class BotProgressIndicatorMetadata implements IBotProgressIndicatorMetadata {
        constructor(p?: proto.IBotProgressIndicatorMetadata);
        public progressDescription: string;
        public stepsMetadata: proto.BotProgressIndicatorMetadata.IBotPlanningStepMetadata[];
        public static create(properties?: proto.IBotProgressIndicatorMetadata): proto.BotProgressIndicatorMetadata;
        public static encode(m: proto.IBotProgressIndicatorMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotProgressIndicatorMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotProgressIndicatorMetadata {

        interface IBotPlanningStepMetadata {
            statusTitle?: (string|null);
            statusBody?: (string|null);
            sourcesMetadata?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourcesMetadata[]|null);
            status?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.PlanningStepStatus|null);
            isReasoning?: (boolean|null);
            isEnhancedSearch?: (boolean|null);
            sections?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningStepSectionMetadata[]|null);
        }

        class BotPlanningStepMetadata implements IBotPlanningStepMetadata {
            constructor(p?: proto.BotProgressIndicatorMetadata.IBotPlanningStepMetadata);
            public statusTitle: string;
            public statusBody: string;
            public sourcesMetadata: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourcesMetadata[];
            public status: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.PlanningStepStatus;
            public isReasoning: boolean;
            public isEnhancedSearch: boolean;
            public sections: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningStepSectionMetadata[];
            public static create(properties?: proto.BotProgressIndicatorMetadata.IBotPlanningStepMetadata): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata;
            public static encode(m: proto.BotProgressIndicatorMetadata.IBotPlanningStepMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BotPlanningStepMetadata {

            interface IBotPlanningSearchSourceMetadata {
                title?: (string|null);
                provider?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotSearchSourceProvider|null);
                sourceUrl?: (string|null);
                favIconUrl?: (string|null);
            }

            class BotPlanningSearchSourceMetadata implements IBotPlanningSearchSourceMetadata {
                constructor(p?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourceMetadata);
                public title: string;
                public provider: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotSearchSourceProvider;
                public sourceUrl: string;
                public favIconUrl: string;
                public static create(properties?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourceMetadata): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourceMetadata;
                public static encode(m: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourceMetadata, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourceMetadata;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IBotPlanningSearchSourcesMetadata {
                sourceTitle?: (string|null);
                provider?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourcesMetadata.BotPlanningSearchSourceProvider|null);
                sourceUrl?: (string|null);
            }

            class BotPlanningSearchSourcesMetadata implements IBotPlanningSearchSourcesMetadata {
                constructor(p?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourcesMetadata);
                public sourceTitle: string;
                public provider: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourcesMetadata.BotPlanningSearchSourceProvider;
                public sourceUrl: string;
                public static create(properties?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourcesMetadata): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourcesMetadata;
                public static encode(m: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourcesMetadata, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningSearchSourcesMetadata;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace BotPlanningSearchSourcesMetadata {

                enum BotPlanningSearchSourceProvider {
                    UNKNOWN = 0,
                    OTHER = 1,
                    GOOGLE = 2,
                    BING = 3
                }
            }

            interface IBotPlanningStepSectionMetadata {
                sectionTitle?: (string|null);
                sectionBody?: (string|null);
                sourcesMetadata?: (proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourceMetadata[]|null);
            }

            class BotPlanningStepSectionMetadata implements IBotPlanningStepSectionMetadata {
                constructor(p?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningStepSectionMetadata);
                public sectionTitle: string;
                public sectionBody: string;
                public sourcesMetadata: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningSearchSourceMetadata[];
                public static create(properties?: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningStepSectionMetadata): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningStepSectionMetadata;
                public static encode(m: proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.IBotPlanningStepSectionMetadata, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotProgressIndicatorMetadata.BotPlanningStepMetadata.BotPlanningStepSectionMetadata;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum BotSearchSourceProvider {
                UNKNOWN_PROVIDER = 0,
                OTHER = 1,
                GOOGLE = 2,
                BING = 3
            }

            enum PlanningStepStatus {
                UNKNOWN = 0,
                PLANNED = 1,
                EXECUTING = 2,
                FINISHED = 3
            }
        }
    }

    interface IBotPromotionMessageMetadata {
        promotionType?: (proto.BotPromotionMessageMetadata.BotPromotionType|null);
        buttonTitle?: (string|null);
    }

    class BotPromotionMessageMetadata implements IBotPromotionMessageMetadata {
        constructor(p?: proto.IBotPromotionMessageMetadata);
        public promotionType: proto.BotPromotionMessageMetadata.BotPromotionType;
        public buttonTitle: string;
        public static create(properties?: proto.IBotPromotionMessageMetadata): proto.BotPromotionMessageMetadata;
        public static encode(m: proto.IBotPromotionMessageMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotPromotionMessageMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotPromotionMessageMetadata {

        enum BotPromotionType {
            UNKNOWN_TYPE = 0,
            C50 = 1
        }
    }

    interface IBotPromptSuggestion {
        prompt?: (string|null);
        promptId?: (string|null);
    }

    class BotPromptSuggestion implements IBotPromptSuggestion {
        constructor(p?: proto.IBotPromptSuggestion);
        public prompt: string;
        public promptId: string;
        public static create(properties?: proto.IBotPromptSuggestion): proto.BotPromptSuggestion;
        public static encode(m: proto.IBotPromptSuggestion, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotPromptSuggestion;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotPromptSuggestions {
        suggestions?: (proto.IBotPromptSuggestion[]|null);
    }

    class BotPromptSuggestions implements IBotPromptSuggestions {
        constructor(p?: proto.IBotPromptSuggestions);
        public suggestions: proto.IBotPromptSuggestion[];
        public static create(properties?: proto.IBotPromptSuggestions): proto.BotPromptSuggestions;
        public static encode(m: proto.IBotPromptSuggestions, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotPromptSuggestions;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IBotQuotaMetadata {
        botFeatureQuotaMetadata?: (proto.BotQuotaMetadata.IBotFeatureQuotaMetadata[]|null);
    }

    class BotQuotaMetadata implements IBotQuotaMetadata {
        constructor(p?: proto.IBotQuotaMetadata);
        public botFeatureQuotaMetadata: proto.BotQuotaMetadata.IBotFeatureQuotaMetadata[];
        public static create(properties?: proto.IBotQuotaMetadata): proto.BotQuotaMetadata;
        public static encode(m: proto.IBotQuotaMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotQuotaMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotQuotaMetadata {

        interface IBotFeatureQuotaMetadata {
            featureType?: (proto.BotQuotaMetadata.BotFeatureQuotaMetadata.BotFeatureType|null);
            remainingQuota?: (number|null);
            expirationTimestamp?: (number|Long|null);
        }

        class BotFeatureQuotaMetadata implements IBotFeatureQuotaMetadata {
            constructor(p?: proto.BotQuotaMetadata.IBotFeatureQuotaMetadata);
            public featureType: proto.BotQuotaMetadata.BotFeatureQuotaMetadata.BotFeatureType;
            public remainingQuota: number;
            public expirationTimestamp: (number|Long);
            public static create(properties?: proto.BotQuotaMetadata.IBotFeatureQuotaMetadata): proto.BotQuotaMetadata.BotFeatureQuotaMetadata;
            public static encode(m: proto.BotQuotaMetadata.IBotFeatureQuotaMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotQuotaMetadata.BotFeatureQuotaMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BotFeatureQuotaMetadata {

            enum BotFeatureType {
                UNKNOWN_FEATURE = 0,
                REASONING_FEATURE = 1
            }
        }
    }

    interface IBotReminderMetadata {
        requestMessageKey?: (proto.IMessageKey|null);
        action?: (proto.BotReminderMetadata.ReminderAction|null);
        name?: (string|null);
        nextTriggerTimestamp?: (number|Long|null);
        frequency?: (proto.BotReminderMetadata.ReminderFrequency|null);
    }

    class BotReminderMetadata implements IBotReminderMetadata {
        constructor(p?: proto.IBotReminderMetadata);
        public requestMessageKey?: (proto.IMessageKey|null);
        public action: proto.BotReminderMetadata.ReminderAction;
        public name: string;
        public nextTriggerTimestamp: (number|Long);
        public frequency: proto.BotReminderMetadata.ReminderFrequency;
        public static create(properties?: proto.IBotReminderMetadata): proto.BotReminderMetadata;
        public static encode(m: proto.IBotReminderMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotReminderMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotReminderMetadata {

        enum ReminderAction {
            NOTIFY = 1,
            CREATE = 2,
            DELETE = 3,
            UPDATE = 4
        }

        enum ReminderFrequency {
            ONCE = 1,
            DAILY = 2,
            WEEKLY = 3,
            BIWEEKLY = 4,
            MONTHLY = 5
        }
    }

    interface IBotRenderingMetadata {
        keywords?: (proto.BotRenderingMetadata.IKeyword[]|null);
    }

    class BotRenderingMetadata implements IBotRenderingMetadata {
        constructor(p?: proto.IBotRenderingMetadata);
        public keywords: proto.BotRenderingMetadata.IKeyword[];
        public static create(properties?: proto.IBotRenderingMetadata): proto.BotRenderingMetadata;
        public static encode(m: proto.IBotRenderingMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotRenderingMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotRenderingMetadata {

        interface IKeyword {
            value?: (string|null);
            associatedPrompts?: (string[]|null);
        }

        class Keyword implements IKeyword {
            constructor(p?: proto.BotRenderingMetadata.IKeyword);
            public value: string;
            public associatedPrompts: string[];
            public static create(properties?: proto.BotRenderingMetadata.IKeyword): proto.BotRenderingMetadata.Keyword;
            public static encode(m: proto.BotRenderingMetadata.IKeyword, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotRenderingMetadata.Keyword;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IBotSessionMetadata {
        sessionId?: (string|null);
        sessionSource?: (proto.BotSessionSource|null);
    }

    class BotSessionMetadata implements IBotSessionMetadata {
        constructor(p?: proto.IBotSessionMetadata);
        public sessionId: string;
        public sessionSource: proto.BotSessionSource;
        public static create(properties?: proto.IBotSessionMetadata): proto.BotSessionMetadata;
        public static encode(m: proto.IBotSessionMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotSessionMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum BotSessionSource {
        NONE = 0,
        NULL_STATE = 1,
        TYPEAHEAD = 2,
        USER_INPUT = 3,
        EMU_FLASH = 4,
        EMU_FLASH_FOLLOWUP = 5,
        VOICE = 6
    }

    interface IBotSourcesMetadata {
        sources?: (proto.BotSourcesMetadata.IBotSourceItem[]|null);
    }

    class BotSourcesMetadata implements IBotSourcesMetadata {
        constructor(p?: proto.IBotSourcesMetadata);
        public sources: proto.BotSourcesMetadata.IBotSourceItem[];
        public static create(properties?: proto.IBotSourcesMetadata): proto.BotSourcesMetadata;
        public static encode(m: proto.IBotSourcesMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotSourcesMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace BotSourcesMetadata {

        interface IBotSourceItem {
            provider?: (proto.BotSourcesMetadata.BotSourceItem.SourceProvider|null);
            thumbnailCdnUrl?: (string|null);
            sourceProviderUrl?: (string|null);
            sourceQuery?: (string|null);
            faviconCdnUrl?: (string|null);
            citationNumber?: (number|null);
        }

        class BotSourceItem implements IBotSourceItem {
            constructor(p?: proto.BotSourcesMetadata.IBotSourceItem);
            public provider: proto.BotSourcesMetadata.BotSourceItem.SourceProvider;
            public thumbnailCdnUrl: string;
            public sourceProviderUrl: string;
            public sourceQuery: string;
            public faviconCdnUrl: string;
            public citationNumber: number;
            public static create(properties?: proto.BotSourcesMetadata.IBotSourceItem): proto.BotSourcesMetadata.BotSourceItem;
            public static encode(m: proto.BotSourcesMetadata.IBotSourceItem, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotSourcesMetadata.BotSourceItem;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BotSourceItem {

            enum SourceProvider {
                UNKNOWN = 0,
                BING = 1,
                GOOGLE = 2,
                SUPPORT = 3
            }
        }
    }

    interface IBotSuggestedPromptMetadata {
        suggestedPrompts?: (string[]|null);
        selectedPromptIndex?: (number|null);
        promptSuggestions?: (proto.IBotPromptSuggestions|null);
        selectedPromptId?: (string|null);
    }

    class BotSuggestedPromptMetadata implements IBotSuggestedPromptMetadata {
        constructor(p?: proto.IBotSuggestedPromptMetadata);
        public suggestedPrompts: string[];
        public selectedPromptIndex: number;
        public promptSuggestions?: (proto.IBotPromptSuggestions|null);
        public selectedPromptId: string;
        public static create(properties?: proto.IBotSuggestedPromptMetadata): proto.BotSuggestedPromptMetadata;
        public static encode(m: proto.IBotSuggestedPromptMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.BotSuggestedPromptMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ICallLogRecord {
        callResult?: (proto.CallLogRecord.CallResult|null);
        isDndMode?: (boolean|null);
        silenceReason?: (proto.CallLogRecord.SilenceReason|null);
        duration?: (number|Long|null);
        startTime?: (number|Long|null);
        isIncoming?: (boolean|null);
        isVideo?: (boolean|null);
        isCallLink?: (boolean|null);
        callLinkToken?: (string|null);
        scheduledCallId?: (string|null);
        callId?: (string|null);
        callCreatorJid?: (string|null);
        groupJid?: (string|null);
        participants?: (proto.CallLogRecord.IParticipantInfo[]|null);
        callType?: (proto.CallLogRecord.CallType|null);
    }

    class CallLogRecord implements ICallLogRecord {
        constructor(p?: proto.ICallLogRecord);
        public callResult: proto.CallLogRecord.CallResult;
        public isDndMode: boolean;
        public silenceReason: proto.CallLogRecord.SilenceReason;
        public duration: (number|Long);
        public startTime: (number|Long);
        public isIncoming: boolean;
        public isVideo: boolean;
        public isCallLink: boolean;
        public callLinkToken: string;
        public scheduledCallId: string;
        public callId: string;
        public callCreatorJid: string;
        public groupJid: string;
        public participants: proto.CallLogRecord.IParticipantInfo[];
        public callType: proto.CallLogRecord.CallType;
        public static create(properties?: proto.ICallLogRecord): proto.CallLogRecord;
        public static encode(m: proto.ICallLogRecord, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CallLogRecord;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace CallLogRecord {

        enum CallResult {
            CONNECTED = 0,
            REJECTED = 1,
            CANCELLED = 2,
            ACCEPTEDELSEWHERE = 3,
            MISSED = 4,
            INVALID = 5,
            UNAVAILABLE = 6,
            UPCOMING = 7,
            FAILED = 8,
            ABANDONED = 9,
            ONGOING = 10
        }

        enum CallType {
            REGULAR = 0,
            SCHEDULED_CALL = 1,
            VOICE_CHAT = 2
        }

        interface IParticipantInfo {
            userJid?: (string|null);
            callResult?: (proto.CallLogRecord.CallResult|null);
        }

        class ParticipantInfo implements IParticipantInfo {
            constructor(p?: proto.CallLogRecord.IParticipantInfo);
            public userJid: string;
            public callResult: proto.CallLogRecord.CallResult;
            public static create(properties?: proto.CallLogRecord.IParticipantInfo): proto.CallLogRecord.ParticipantInfo;
            public static encode(m: proto.CallLogRecord.IParticipantInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CallLogRecord.ParticipantInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum SilenceReason {
            NONE = 0,
            SCHEDULED = 1,
            PRIVACY = 2,
            LIGHTWEIGHT = 3
        }
    }

    interface ICertChain {
        leaf?: (proto.CertChain.INoiseCertificate|null);
        intermediate?: (proto.CertChain.INoiseCertificate|null);
    }

    class CertChain implements ICertChain {
        constructor(p?: proto.ICertChain);
        public leaf?: (proto.CertChain.INoiseCertificate|null);
        public intermediate?: (proto.CertChain.INoiseCertificate|null);
        public static create(properties?: proto.ICertChain): proto.CertChain;
        public static encode(m: proto.ICertChain, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CertChain;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace CertChain {

        interface INoiseCertificate {
            details?: (Uint8Array|null);
            signature?: (Uint8Array|null);
        }

        class NoiseCertificate implements INoiseCertificate {
            constructor(p?: proto.CertChain.INoiseCertificate);
            public details: Uint8Array;
            public signature: Uint8Array;
            public static create(properties?: proto.CertChain.INoiseCertificate): proto.CertChain.NoiseCertificate;
            public static encode(m: proto.CertChain.INoiseCertificate, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CertChain.NoiseCertificate;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace NoiseCertificate {

            interface IDetails {
                serial?: (number|null);
                issuerSerial?: (number|null);
                key?: (Uint8Array|null);
                notBefore?: (number|Long|null);
                notAfter?: (number|Long|null);
            }

            class Details implements IDetails {
                constructor(p?: proto.CertChain.NoiseCertificate.IDetails);
                public serial: number;
                public issuerSerial: number;
                public key: Uint8Array;
                public notBefore: (number|Long);
                public notAfter: (number|Long);
                public static create(properties?: proto.CertChain.NoiseCertificate.IDetails): proto.CertChain.NoiseCertificate.Details;
                public static encode(m: proto.CertChain.NoiseCertificate.IDetails, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CertChain.NoiseCertificate.Details;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    interface IChatLockSettings {
        hideLockedChats?: (boolean|null);
        secretCode?: (proto.IUserPassword|null);
    }

    class ChatLockSettings implements IChatLockSettings {
        constructor(p?: proto.IChatLockSettings);
        public hideLockedChats: boolean;
        public secretCode?: (proto.IUserPassword|null);
        public static create(properties?: proto.IChatLockSettings): proto.ChatLockSettings;
        public static encode(m: proto.IChatLockSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ChatLockSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IChatRowOpaqueData {
        draftMessage?: (proto.ChatRowOpaqueData.IDraftMessage|null);
    }

    class ChatRowOpaqueData implements IChatRowOpaqueData {
        constructor(p?: proto.IChatRowOpaqueData);
        public draftMessage?: (proto.ChatRowOpaqueData.IDraftMessage|null);
        public static create(properties?: proto.IChatRowOpaqueData): proto.ChatRowOpaqueData;
        public static encode(m: proto.IChatRowOpaqueData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ChatRowOpaqueData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ChatRowOpaqueData {

        interface IDraftMessage {
            text?: (string|null);
            omittedUrl?: (string|null);
            ctwaContextLinkData?: (proto.ChatRowOpaqueData.DraftMessage.ICtwaContextLinkData|null);
            ctwaContext?: (proto.ChatRowOpaqueData.DraftMessage.ICtwaContextData|null);
            timestamp?: (number|Long|null);
        }

        class DraftMessage implements IDraftMessage {
            constructor(p?: proto.ChatRowOpaqueData.IDraftMessage);
            public text: string;
            public omittedUrl: string;
            public ctwaContextLinkData?: (proto.ChatRowOpaqueData.DraftMessage.ICtwaContextLinkData|null);
            public ctwaContext?: (proto.ChatRowOpaqueData.DraftMessage.ICtwaContextData|null);
            public timestamp: (number|Long);
            public static create(properties?: proto.ChatRowOpaqueData.IDraftMessage): proto.ChatRowOpaqueData.DraftMessage;
            public static encode(m: proto.ChatRowOpaqueData.IDraftMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ChatRowOpaqueData.DraftMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DraftMessage {

            interface ICtwaContextData {
                conversionSource?: (string|null);
                conversionData?: (Uint8Array|null);
                sourceUrl?: (string|null);
                sourceId?: (string|null);
                sourceType?: (string|null);
                title?: (string|null);
                description?: (string|null);
                thumbnail?: (string|null);
                thumbnailUrl?: (string|null);
                mediaType?: (proto.ChatRowOpaqueData.DraftMessage.CtwaContextData.ContextInfoExternalAdReplyInfoMediaType|null);
                mediaUrl?: (string|null);
                isSuspiciousLink?: (boolean|null);
            }

            class CtwaContextData implements ICtwaContextData {
                constructor(p?: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextData);
                public conversionSource: string;
                public conversionData: Uint8Array;
                public sourceUrl: string;
                public sourceId: string;
                public sourceType: string;
                public title: string;
                public description: string;
                public thumbnail: string;
                public thumbnailUrl: string;
                public mediaType: proto.ChatRowOpaqueData.DraftMessage.CtwaContextData.ContextInfoExternalAdReplyInfoMediaType;
                public mediaUrl: string;
                public isSuspiciousLink: boolean;
                public static create(properties?: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextData): proto.ChatRowOpaqueData.DraftMessage.CtwaContextData;
                public static encode(m: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextData, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ChatRowOpaqueData.DraftMessage.CtwaContextData;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace CtwaContextData {

                enum ContextInfoExternalAdReplyInfoMediaType {
                    NONE = 0,
                    IMAGE = 1,
                    VIDEO = 2
                }
            }

            interface ICtwaContextLinkData {
                context?: (string|null);
                sourceUrl?: (string|null);
                icebreaker?: (string|null);
                phone?: (string|null);
            }

            class CtwaContextLinkData implements ICtwaContextLinkData {
                constructor(p?: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextLinkData);
                public context: string;
                public sourceUrl: string;
                public icebreaker: string;
                public phone: string;
                public static create(properties?: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextLinkData): proto.ChatRowOpaqueData.DraftMessage.CtwaContextLinkData;
                public static encode(m: proto.ChatRowOpaqueData.DraftMessage.ICtwaContextLinkData, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ChatRowOpaqueData.DraftMessage.CtwaContextLinkData;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    interface ICitation {
        title: string;
        subtitle: string;
        cmsId: string;
        imageUrl: string;
    }

    class Citation implements ICitation {
        constructor(p?: proto.ICitation);
        public title: string;
        public subtitle: string;
        public cmsId: string;
        public imageUrl: string;
        public static create(properties?: proto.ICitation): proto.Citation;
        public static encode(m: proto.ICitation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Citation;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IClientPairingProps {
        isChatDbLidMigrated?: (boolean|null);
        isSyncdPureLidSession?: (boolean|null);
    }

    class ClientPairingProps implements IClientPairingProps {
        constructor(p?: proto.IClientPairingProps);
        public isChatDbLidMigrated: boolean;
        public isSyncdPureLidSession: boolean;
        public static create(properties?: proto.IClientPairingProps): proto.ClientPairingProps;
        public static encode(m: proto.IClientPairingProps, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPairingProps;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IClientPayload {
        username?: (number|Long|null);
        passive?: (boolean|null);
        userAgent?: (proto.ClientPayload.IUserAgent|null);
        webInfo?: (proto.ClientPayload.IWebInfo|null);
        pushName?: (string|null);
        sessionId?: (number|null);
        shortConnect?: (boolean|null);
        connectType?: (proto.ClientPayload.ConnectType|null);
        connectReason?: (proto.ClientPayload.ConnectReason|null);
        shards?: (number[]|null);
        dnsSource?: (proto.ClientPayload.IDNSSource|null);
        connectAttemptCount?: (number|null);
        device?: (number|null);
        devicePairingData?: (proto.ClientPayload.IDevicePairingRegistrationData|null);
        product?: (proto.ClientPayload.Product|null);
        fbCat?: (Uint8Array|null);
        fbUserAgent?: (Uint8Array|null);
        oc?: (boolean|null);
        lc?: (number|null);
        iosAppExtension?: (proto.ClientPayload.IOSAppExtension|null);
        fbAppId?: (number|Long|null);
        fbDeviceId?: (Uint8Array|null);
        pull?: (boolean|null);
        paddingBytes?: (Uint8Array|null);
        yearClass?: (number|null);
        memClass?: (number|null);
        interopData?: (proto.ClientPayload.IInteropData|null);
        trafficAnonymization?: (proto.ClientPayload.TrafficAnonymization|null);
        lidDbMigrated?: (boolean|null);
        accountType?: (proto.ClientPayload.AccountType|null);
    }

    class ClientPayload implements IClientPayload {
        constructor(p?: proto.IClientPayload);
        public username: (number|Long);
        public passive: boolean;
        public userAgent?: (proto.ClientPayload.IUserAgent|null);
        public webInfo?: (proto.ClientPayload.IWebInfo|null);
        public pushName: string;
        public sessionId: number;
        public shortConnect: boolean;
        public connectType: proto.ClientPayload.ConnectType;
        public connectReason: proto.ClientPayload.ConnectReason;
        public shards: number[];
        public dnsSource?: (proto.ClientPayload.IDNSSource|null);
        public connectAttemptCount: number;
        public device: number;
        public devicePairingData?: (proto.ClientPayload.IDevicePairingRegistrationData|null);
        public product: proto.ClientPayload.Product;
        public fbCat: Uint8Array;
        public fbUserAgent: Uint8Array;
        public oc: boolean;
        public lc: number;
        public iosAppExtension: proto.ClientPayload.IOSAppExtension;
        public fbAppId: (number|Long);
        public fbDeviceId: Uint8Array;
        public pull: boolean;
        public paddingBytes: Uint8Array;
        public yearClass: number;
        public memClass: number;
        public interopData?: (proto.ClientPayload.IInteropData|null);
        public trafficAnonymization: proto.ClientPayload.TrafficAnonymization;
        public lidDbMigrated: boolean;
        public accountType: proto.ClientPayload.AccountType;
        public static create(properties?: proto.IClientPayload): proto.ClientPayload;
        public static encode(m: proto.IClientPayload, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ClientPayload {

        enum AccountType {
            DEFAULT = 0,
            GUEST = 1
        }

        enum ConnectReason {
            PUSH = 0,
            USER_ACTIVATED = 1,
            SCHEDULED = 2,
            ERROR_RECONNECT = 3,
            NETWORK_SWITCH = 4,
            PING_RECONNECT = 5,
            UNKNOWN = 6
        }

        enum ConnectType {
            CELLULAR_UNKNOWN = 0,
            WIFI_UNKNOWN = 1,
            CELLULAR_EDGE = 100,
            CELLULAR_IDEN = 101,
            CELLULAR_UMTS = 102,
            CELLULAR_EVDO = 103,
            CELLULAR_GPRS = 104,
            CELLULAR_HSDPA = 105,
            CELLULAR_HSUPA = 106,
            CELLULAR_HSPA = 107,
            CELLULAR_CDMA = 108,
            CELLULAR_1XRTT = 109,
            CELLULAR_EHRPD = 110,
            CELLULAR_LTE = 111,
            CELLULAR_HSPAP = 112
        }

        interface IDNSSource {
            dnsMethod?: (proto.ClientPayload.DNSSource.DNSResolutionMethod|null);
            appCached?: (boolean|null);
        }

        class DNSSource implements IDNSSource {
            constructor(p?: proto.ClientPayload.IDNSSource);
            public dnsMethod: proto.ClientPayload.DNSSource.DNSResolutionMethod;
            public appCached: boolean;
            public static create(properties?: proto.ClientPayload.IDNSSource): proto.ClientPayload.DNSSource;
            public static encode(m: proto.ClientPayload.IDNSSource, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.DNSSource;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DNSSource {

            enum DNSResolutionMethod {
                SYSTEM = 0,
                GOOGLE = 1,
                HARDCODED = 2,
                OVERRIDE = 3,
                FALLBACK = 4,
                MNS = 5
            }
        }

        interface IDevicePairingRegistrationData {
            eRegid?: (Uint8Array|null);
            eKeytype?: (Uint8Array|null);
            eIdent?: (Uint8Array|null);
            eSkeyId?: (Uint8Array|null);
            eSkeyVal?: (Uint8Array|null);
            eSkeySig?: (Uint8Array|null);
            buildHash?: (Uint8Array|null);
            deviceProps?: (Uint8Array|null);
        }

        class DevicePairingRegistrationData implements IDevicePairingRegistrationData {
            constructor(p?: proto.ClientPayload.IDevicePairingRegistrationData);
            public eRegid: Uint8Array;
            public eKeytype: Uint8Array;
            public eIdent: Uint8Array;
            public eSkeyId: Uint8Array;
            public eSkeyVal: Uint8Array;
            public eSkeySig: Uint8Array;
            public buildHash: Uint8Array;
            public deviceProps: Uint8Array;
            public static create(properties?: proto.ClientPayload.IDevicePairingRegistrationData): proto.ClientPayload.DevicePairingRegistrationData;
            public static encode(m: proto.ClientPayload.IDevicePairingRegistrationData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.DevicePairingRegistrationData;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum IOSAppExtension {
            SHARE_EXTENSION = 0,
            SERVICE_EXTENSION = 1,
            INTENTS_EXTENSION = 2
        }

        interface IInteropData {
            accountId?: (number|Long|null);
            token?: (Uint8Array|null);
            enableReadReceipts?: (boolean|null);
        }

        class InteropData implements IInteropData {
            constructor(p?: proto.ClientPayload.IInteropData);
            public accountId: (number|Long);
            public token: Uint8Array;
            public enableReadReceipts: boolean;
            public static create(properties?: proto.ClientPayload.IInteropData): proto.ClientPayload.InteropData;
            public static encode(m: proto.ClientPayload.IInteropData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.InteropData;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum Product {
            WHATSAPP = 0,
            MESSENGER = 1,
            INTEROP = 2,
            INTEROP_MSGR = 3,
            WHATSAPP_LID = 4
        }

        enum TrafficAnonymization {
            OFF = 0,
            STANDARD = 1
        }

        interface IUserAgent {
            platform?: (proto.ClientPayload.UserAgent.Platform|null);
            appVersion?: (proto.ClientPayload.UserAgent.IAppVersion|null);
            mcc?: (string|null);
            mnc?: (string|null);
            osVersion?: (string|null);
            manufacturer?: (string|null);
            device?: (string|null);
            osBuildNumber?: (string|null);
            phoneId?: (string|null);
            releaseChannel?: (proto.ClientPayload.UserAgent.ReleaseChannel|null);
            localeLanguageIso6391?: (string|null);
            localeCountryIso31661Alpha2?: (string|null);
            deviceBoard?: (string|null);
            deviceExpId?: (string|null);
            deviceType?: (proto.ClientPayload.UserAgent.DeviceType|null);
            deviceModelType?: (string|null);
        }

        class UserAgent implements IUserAgent {
            constructor(p?: proto.ClientPayload.IUserAgent);
            public platform: proto.ClientPayload.UserAgent.Platform;
            public appVersion?: (proto.ClientPayload.UserAgent.IAppVersion|null);
            public mcc: string;
            public mnc: string;
            public osVersion: string;
            public manufacturer: string;
            public device: string;
            public osBuildNumber: string;
            public phoneId: string;
            public releaseChannel: proto.ClientPayload.UserAgent.ReleaseChannel;
            public localeLanguageIso6391: string;
            public localeCountryIso31661Alpha2: string;
            public deviceBoard: string;
            public deviceExpId: string;
            public deviceType: proto.ClientPayload.UserAgent.DeviceType;
            public deviceModelType: string;
            public static create(properties?: proto.ClientPayload.IUserAgent): proto.ClientPayload.UserAgent;
            public static encode(m: proto.ClientPayload.IUserAgent, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.UserAgent;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace UserAgent {

            interface IAppVersion {
                primary?: (number|null);
                secondary?: (number|null);
                tertiary?: (number|null);
                quaternary?: (number|null);
                quinary?: (number|null);
            }

            class AppVersion implements IAppVersion {
                constructor(p?: proto.ClientPayload.UserAgent.IAppVersion);
                public primary: number;
                public secondary: number;
                public tertiary: number;
                public quaternary: number;
                public quinary: number;
                public static create(properties?: proto.ClientPayload.UserAgent.IAppVersion): proto.ClientPayload.UserAgent.AppVersion;
                public static encode(m: proto.ClientPayload.UserAgent.IAppVersion, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.UserAgent.AppVersion;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum DeviceType {
                PHONE = 0,
                TABLET = 1,
                DESKTOP = 2,
                WEARABLE = 3,
                VR = 4
            }

            enum Platform {
                ANDROID = 0,
                IOS = 1,
                WINDOWS_PHONE = 2,
                BLACKBERRY = 3,
                BLACKBERRYX = 4,
                S40 = 5,
                S60 = 6,
                PYTHON_CLIENT = 7,
                TIZEN = 8,
                ENTERPRISE = 9,
                SMB_ANDROID = 10,
                KAIOS = 11,
                SMB_IOS = 12,
                WINDOWS = 13,
                WEB = 14,
                PORTAL = 15,
                GREEN_ANDROID = 16,
                GREEN_IPHONE = 17,
                BLUE_ANDROID = 18,
                BLUE_IPHONE = 19,
                FBLITE_ANDROID = 20,
                MLITE_ANDROID = 21,
                IGLITE_ANDROID = 22,
                PAGE = 23,
                MACOS = 24,
                OCULUS_MSG = 25,
                OCULUS_CALL = 26,
                MILAN = 27,
                CAPI = 28,
                WEAROS = 29,
                ARDEVICE = 30,
                VRDEVICE = 31,
                BLUE_WEB = 32,
                IPAD = 33,
                TEST = 34,
                SMART_GLASSES = 35
            }

            enum ReleaseChannel {
                RELEASE = 0,
                BETA = 1,
                ALPHA = 2,
                DEBUG = 3
            }
        }

        interface IWebInfo {
            refToken?: (string|null);
            version?: (string|null);
            webdPayload?: (proto.ClientPayload.WebInfo.IWebdPayload|null);
            webSubPlatform?: (proto.ClientPayload.WebInfo.WebSubPlatform|null);
        }

        class WebInfo implements IWebInfo {
            constructor(p?: proto.ClientPayload.IWebInfo);
            public refToken: string;
            public version: string;
            public webdPayload?: (proto.ClientPayload.WebInfo.IWebdPayload|null);
            public webSubPlatform: proto.ClientPayload.WebInfo.WebSubPlatform;
            public static create(properties?: proto.ClientPayload.IWebInfo): proto.ClientPayload.WebInfo;
            public static encode(m: proto.ClientPayload.IWebInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.WebInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WebInfo {

            enum WebSubPlatform {
                WEB_BROWSER = 0,
                APP_STORE = 1,
                WIN_STORE = 2,
                DARWIN = 3,
                WIN32 = 4,
                WIN_HYBRID = 5
            }

            interface IWebdPayload {
                usesParticipantInKey?: (boolean|null);
                supportsStarredMessages?: (boolean|null);
                supportsDocumentMessages?: (boolean|null);
                supportsUrlMessages?: (boolean|null);
                supportsMediaRetry?: (boolean|null);
                supportsE2EImage?: (boolean|null);
                supportsE2EVideo?: (boolean|null);
                supportsE2EAudio?: (boolean|null);
                supportsE2EDocument?: (boolean|null);
                documentTypes?: (string|null);
                features?: (Uint8Array|null);
            }

            class WebdPayload implements IWebdPayload {
                constructor(p?: proto.ClientPayload.WebInfo.IWebdPayload);
                public usesParticipantInKey: boolean;
                public supportsStarredMessages: boolean;
                public supportsDocumentMessages: boolean;
                public supportsUrlMessages: boolean;
                public supportsMediaRetry: boolean;
                public supportsE2EImage: boolean;
                public supportsE2EVideo: boolean;
                public supportsE2EAudio: boolean;
                public supportsE2EDocument: boolean;
                public documentTypes: string;
                public features: Uint8Array;
                public static create(properties?: proto.ClientPayload.WebInfo.IWebdPayload): proto.ClientPayload.WebInfo.WebdPayload;
                public static encode(m: proto.ClientPayload.WebInfo.IWebdPayload, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ClientPayload.WebInfo.WebdPayload;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    interface ICommentMetadata {
        commentParentKey?: (proto.IMessageKey|null);
        replyCount?: (number|null);
    }

    class CommentMetadata implements ICommentMetadata {
        constructor(p?: proto.ICommentMetadata);
        public commentParentKey?: (proto.IMessageKey|null);
        public replyCount: number;
        public static create(properties?: proto.ICommentMetadata): proto.CommentMetadata;
        public static encode(m: proto.ICommentMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CommentMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ICompanionCommitment {
        hash?: (Uint8Array|null);
    }

    class CompanionCommitment implements ICompanionCommitment {
        constructor(p?: proto.ICompanionCommitment);
        public hash: Uint8Array;
        public static create(properties?: proto.ICompanionCommitment): proto.CompanionCommitment;
        public static encode(m: proto.ICompanionCommitment, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CompanionCommitment;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ICompanionEphemeralIdentity {
        publicKey?: (Uint8Array|null);
        deviceType?: (proto.DeviceProps.PlatformType|null);
        ref?: (string|null);
    }

    class CompanionEphemeralIdentity implements ICompanionEphemeralIdentity {
        constructor(p?: proto.ICompanionEphemeralIdentity);
        public publicKey: Uint8Array;
        public deviceType: proto.DeviceProps.PlatformType;
        public ref: string;
        public static create(properties?: proto.ICompanionEphemeralIdentity): proto.CompanionEphemeralIdentity;
        public static encode(m: proto.ICompanionEphemeralIdentity, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.CompanionEphemeralIdentity;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IConfig {
        field?: ({ [k: string]: proto.IField }|null);
        version?: (number|null);
    }

    class Config implements IConfig {
        constructor(p?: proto.IConfig);
        public field: { [k: string]: proto.IField };
        public version: number;
        public static create(properties?: proto.IConfig): proto.Config;
        public static encode(m: proto.IConfig, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Config;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IContextInfo {
        stanzaId?: (string|null);
        participant?: (string|null);
        quotedMessage?: (proto.IMessage|null);
        remoteJid?: (string|null);
        mentionedJid?: (string[]|null);
        conversionSource?: (string|null);
        conversionData?: (Uint8Array|null);
        conversionDelaySeconds?: (number|null);
        forwardingScore?: (number|null);
        isForwarded?: (boolean|null);
        quotedAd?: (proto.ContextInfo.IAdReplyInfo|null);
        placeholderKey?: (proto.IMessageKey|null);
        expiration?: (number|null);
        ephemeralSettingTimestamp?: (number|Long|null);
        ephemeralSharedSecret?: (Uint8Array|null);
        externalAdReply?: (proto.ContextInfo.IExternalAdReplyInfo|null);
        entryPointConversionSource?: (string|null);
        entryPointConversionApp?: (string|null);
        entryPointConversionDelaySeconds?: (number|null);
        disappearingMode?: (proto.IDisappearingMode|null);
        actionLink?: (proto.IActionLink|null);
        groupSubject?: (string|null);
        parentGroupJid?: (string|null);
        trustBannerType?: (string|null);
        trustBannerAction?: (number|null);
        isSampled?: (boolean|null);
        groupMentions?: (proto.IGroupMention[]|null);
        utm?: (proto.ContextInfo.IUTMInfo|null);
        forwardedNewsletterMessageInfo?: (proto.ContextInfo.IForwardedNewsletterMessageInfo|null);
        businessMessageForwardInfo?: (proto.ContextInfo.IBusinessMessageForwardInfo|null);
        smbClientCampaignId?: (string|null);
        smbServerCampaignId?: (string|null);
        dataSharingContext?: (proto.ContextInfo.IDataSharingContext|null);
        alwaysShowAdAttribution?: (boolean|null);
        featureEligibilities?: (proto.ContextInfo.IFeatureEligibilities|null);
        entryPointConversionExternalSource?: (string|null);
        entryPointConversionExternalMedium?: (string|null);
        ctwaSignals?: (string|null);
        ctwaPayload?: (Uint8Array|null);
        forwardedAiBotMessageInfo?: (proto.ContextInfo.IForwardedAIBotMessageInfo|null);
        statusAttributionType?: (proto.ContextInfo.StatusAttributionType|null);
        urlTrackingMap?: (proto.IUrlTrackingMap|null);
        pairedMediaType?: (proto.ContextInfo.PairedMediaType|null);
        rankingVersion?: (number|null);
        memberLabel?: (proto.IMemberLabel|null);
        isQuestion?: (boolean|null);
        statusSourceType?: (proto.ContextInfo.StatusSourceType|null);
    }

    class ContextInfo implements IContextInfo {
        constructor(p?: proto.IContextInfo);
        public stanzaId: string;
        public participant: string;
        public quotedMessage?: (proto.IMessage|null);
        public remoteJid: string;
        public mentionedJid: string[];
        public conversionSource: string;
        public conversionData: Uint8Array;
        public conversionDelaySeconds: number;
        public forwardingScore: number;
        public isForwarded: boolean;
        public quotedAd?: (proto.ContextInfo.IAdReplyInfo|null);
        public placeholderKey?: (proto.IMessageKey|null);
        public expiration: number;
        public ephemeralSettingTimestamp: (number|Long);
        public ephemeralSharedSecret: Uint8Array;
        public externalAdReply?: (proto.ContextInfo.IExternalAdReplyInfo|null);
        public entryPointConversionSource: string;
        public entryPointConversionApp: string;
        public entryPointConversionDelaySeconds: number;
        public disappearingMode?: (proto.IDisappearingMode|null);
        public actionLink?: (proto.IActionLink|null);
        public groupSubject: string;
        public parentGroupJid: string;
        public trustBannerType: string;
        public trustBannerAction: number;
        public isSampled: boolean;
        public groupMentions: proto.IGroupMention[];
        public utm?: (proto.ContextInfo.IUTMInfo|null);
        public forwardedNewsletterMessageInfo?: (proto.ContextInfo.IForwardedNewsletterMessageInfo|null);
        public businessMessageForwardInfo?: (proto.ContextInfo.IBusinessMessageForwardInfo|null);
        public smbClientCampaignId: string;
        public smbServerCampaignId: string;
        public dataSharingContext?: (proto.ContextInfo.IDataSharingContext|null);
        public alwaysShowAdAttribution: boolean;
        public featureEligibilities?: (proto.ContextInfo.IFeatureEligibilities|null);
        public entryPointConversionExternalSource: string;
        public entryPointConversionExternalMedium: string;
        public ctwaSignals: string;
        public ctwaPayload: Uint8Array;
        public forwardedAiBotMessageInfo?: (proto.ContextInfo.IForwardedAIBotMessageInfo|null);
        public statusAttributionType: proto.ContextInfo.StatusAttributionType;
        public urlTrackingMap?: (proto.IUrlTrackingMap|null);
        public pairedMediaType: proto.ContextInfo.PairedMediaType;
        public rankingVersion: number;
        public memberLabel?: (proto.IMemberLabel|null);
        public isQuestion: boolean;
        public statusSourceType: proto.ContextInfo.StatusSourceType;
        public static create(properties?: proto.IContextInfo): proto.ContextInfo;
        public static encode(m: proto.IContextInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ContextInfo {

        interface IAdReplyInfo {
            advertiserName?: (string|null);
            mediaType?: (proto.ContextInfo.AdReplyInfo.MediaType|null);
            jpegThumbnail?: (Uint8Array|null);
            caption?: (string|null);
        }

        class AdReplyInfo implements IAdReplyInfo {
            constructor(p?: proto.ContextInfo.IAdReplyInfo);
            public advertiserName: string;
            public mediaType: proto.ContextInfo.AdReplyInfo.MediaType;
            public jpegThumbnail: Uint8Array;
            public caption: string;
            public static create(properties?: proto.ContextInfo.IAdReplyInfo): proto.ContextInfo.AdReplyInfo;
            public static encode(m: proto.ContextInfo.IAdReplyInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.AdReplyInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AdReplyInfo {

            enum MediaType {
                NONE = 0,
                IMAGE = 1,
                VIDEO = 2
            }
        }

        interface IBusinessMessageForwardInfo {
            businessOwnerJid?: (string|null);
        }

        class BusinessMessageForwardInfo implements IBusinessMessageForwardInfo {
            constructor(p?: proto.ContextInfo.IBusinessMessageForwardInfo);
            public businessOwnerJid: string;
            public static create(properties?: proto.ContextInfo.IBusinessMessageForwardInfo): proto.ContextInfo.BusinessMessageForwardInfo;
            public static encode(m: proto.ContextInfo.IBusinessMessageForwardInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.BusinessMessageForwardInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDataSharingContext {
            showMmDisclosure?: (boolean|null);
            encryptedSignalTokenConsented?: (string|null);
            parameters?: (proto.ContextInfo.DataSharingContext.IParameters[]|null);
        }

        class DataSharingContext implements IDataSharingContext {
            constructor(p?: proto.ContextInfo.IDataSharingContext);
            public showMmDisclosure: boolean;
            public encryptedSignalTokenConsented: string;
            public parameters: proto.ContextInfo.DataSharingContext.IParameters[];
            public static create(properties?: proto.ContextInfo.IDataSharingContext): proto.ContextInfo.DataSharingContext;
            public static encode(m: proto.ContextInfo.IDataSharingContext, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.DataSharingContext;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DataSharingContext {

            interface IParameters {
                key?: (string|null);
                stringData?: (string|null);
                intData?: (number|Long|null);
                floatData?: (number|null);
                contents?: (proto.ContextInfo.DataSharingContext.IParameters|null);
            }

            class Parameters implements IParameters {
                constructor(p?: proto.ContextInfo.DataSharingContext.IParameters);
                public key: string;
                public stringData: string;
                public intData: (number|Long);
                public floatData: number;
                public contents?: (proto.ContextInfo.DataSharingContext.IParameters|null);
                public static create(properties?: proto.ContextInfo.DataSharingContext.IParameters): proto.ContextInfo.DataSharingContext.Parameters;
                public static encode(m: proto.ContextInfo.DataSharingContext.IParameters, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.DataSharingContext.Parameters;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IExternalAdReplyInfo {
            title?: (string|null);
            body?: (string|null);
            mediaType?: (proto.ContextInfo.ExternalAdReplyInfo.MediaType|null);
            thumbnailUrl?: (string|null);
            mediaUrl?: (string|null);
            thumbnail?: (Uint8Array|null);
            sourceType?: (string|null);
            sourceId?: (string|null);
            sourceUrl?: (string|null);
            containsAutoReply?: (boolean|null);
            renderLargerThumbnail?: (boolean|null);
            showAdAttribution?: (boolean|null);
            ctwaClid?: (string|null);
            ref?: (string|null);
            clickToWhatsappCall?: (boolean|null);
            adContextPreviewDismissed?: (boolean|null);
            sourceApp?: (string|null);
            automatedGreetingMessageShown?: (boolean|null);
            greetingMessageBody?: (string|null);
            ctaPayload?: (string|null);
            disableNudge?: (boolean|null);
            originalImageUrl?: (string|null);
            automatedGreetingMessageCtaType?: (string|null);
            wtwaAdFormat?: (boolean|null);
            adType?: (proto.ContextInfo.ExternalAdReplyInfo.AdType|null);
        }

        class ExternalAdReplyInfo implements IExternalAdReplyInfo {
            constructor(p?: proto.ContextInfo.IExternalAdReplyInfo);
            public title: string;
            public body: string;
            public mediaType: proto.ContextInfo.ExternalAdReplyInfo.MediaType;
            public thumbnailUrl: string;
            public mediaUrl: string;
            public thumbnail: Uint8Array;
            public sourceType: string;
            public sourceId: string;
            public sourceUrl: string;
            public containsAutoReply: boolean;
            public renderLargerThumbnail: boolean;
            public showAdAttribution: boolean;
            public ctwaClid: string;
            public ref: string;
            public clickToWhatsappCall: boolean;
            public adContextPreviewDismissed: boolean;
            public sourceApp: string;
            public automatedGreetingMessageShown: boolean;
            public greetingMessageBody: string;
            public ctaPayload: string;
            public disableNudge: boolean;
            public originalImageUrl: string;
            public automatedGreetingMessageCtaType: string;
            public wtwaAdFormat: boolean;
            public adType: proto.ContextInfo.ExternalAdReplyInfo.AdType;
            public static create(properties?: proto.ContextInfo.IExternalAdReplyInfo): proto.ContextInfo.ExternalAdReplyInfo;
            public static encode(m: proto.ContextInfo.IExternalAdReplyInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.ExternalAdReplyInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ExternalAdReplyInfo {

            enum AdType {
                CTWA = 0,
                CAWC = 1
            }

            enum MediaType {
                NONE = 0,
                IMAGE = 1,
                VIDEO = 2
            }
        }

        interface IFeatureEligibilities {
            cannotBeReactedTo?: (boolean|null);
            cannotBeRanked?: (boolean|null);
            canRequestFeedback?: (boolean|null);
            canBeReshared?: (boolean|null);
        }

        class FeatureEligibilities implements IFeatureEligibilities {
            constructor(p?: proto.ContextInfo.IFeatureEligibilities);
            public cannotBeReactedTo: boolean;
            public cannotBeRanked: boolean;
            public canRequestFeedback: boolean;
            public canBeReshared: boolean;
            public static create(properties?: proto.ContextInfo.IFeatureEligibilities): proto.ContextInfo.FeatureEligibilities;
            public static encode(m: proto.ContextInfo.IFeatureEligibilities, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.FeatureEligibilities;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IForwardedAIBotMessageInfo {
            botName?: (string|null);
            botJid?: (string|null);
            creatorName?: (string|null);
        }

        class ForwardedAIBotMessageInfo implements IForwardedAIBotMessageInfo {
            constructor(p?: proto.ContextInfo.IForwardedAIBotMessageInfo);
            public botName: string;
            public botJid: string;
            public creatorName: string;
            public static create(properties?: proto.ContextInfo.IForwardedAIBotMessageInfo): proto.ContextInfo.ForwardedAIBotMessageInfo;
            public static encode(m: proto.ContextInfo.IForwardedAIBotMessageInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.ForwardedAIBotMessageInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IForwardedNewsletterMessageInfo {
            newsletterJid?: (string|null);
            serverMessageId?: (number|null);
            newsletterName?: (string|null);
            contentType?: (proto.ContextInfo.ForwardedNewsletterMessageInfo.ContentType|null);
            accessibilityText?: (string|null);
        }

        class ForwardedNewsletterMessageInfo implements IForwardedNewsletterMessageInfo {
            constructor(p?: proto.ContextInfo.IForwardedNewsletterMessageInfo);
            public newsletterJid: string;
            public serverMessageId: number;
            public newsletterName: string;
            public contentType: proto.ContextInfo.ForwardedNewsletterMessageInfo.ContentType;
            public accessibilityText: string;
            public static create(properties?: proto.ContextInfo.IForwardedNewsletterMessageInfo): proto.ContextInfo.ForwardedNewsletterMessageInfo;
            public static encode(m: proto.ContextInfo.IForwardedNewsletterMessageInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.ForwardedNewsletterMessageInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ForwardedNewsletterMessageInfo {

            enum ContentType {
                UPDATE = 1,
                UPDATE_CARD = 2,
                LINK_CARD = 3
            }
        }

        enum PairedMediaType {
            NOT_PAIRED_MEDIA = 0,
            SD_VIDEO_PARENT = 1,
            HD_VIDEO_CHILD = 2,
            SD_IMAGE_PARENT = 3,
            HD_IMAGE_CHILD = 4,
            MOTION_PHOTO_PARENT = 5,
            MOTION_PHOTO_CHILD = 6
        }

        enum StatusAttributionType {
            NONE = 0,
            RESHARED_FROM_MENTION = 1,
            RESHARED_FROM_POST = 2
        }

        enum StatusSourceType {
            IMAGE = 0,
            VIDEO = 1,
            GIF = 2,
            AUDIO = 3,
            TEXT = 4,
            MUSIC_STANDALONE = 5
        }

        interface IUTMInfo {
            utmSource?: (string|null);
            utmCampaign?: (string|null);
        }

        class UTMInfo implements IUTMInfo {
            constructor(p?: proto.ContextInfo.IUTMInfo);
            public utmSource: string;
            public utmCampaign: string;
            public static create(properties?: proto.ContextInfo.IUTMInfo): proto.ContextInfo.UTMInfo;
            public static encode(m: proto.ContextInfo.IUTMInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ContextInfo.UTMInfo;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IConversation {
        id: string;
        messages?: (proto.IHistorySyncMsg[]|null);
        newJid?: (string|null);
        oldJid?: (string|null);
        lastMsgTimestamp?: (number|Long|null);
        unreadCount?: (number|null);
        readOnly?: (boolean|null);
        endOfHistoryTransfer?: (boolean|null);
        ephemeralExpiration?: (number|null);
        ephemeralSettingTimestamp?: (number|Long|null);
        endOfHistoryTransferType?: (proto.Conversation.EndOfHistoryTransferType|null);
        conversationTimestamp?: (number|Long|null);
        name?: (string|null);
        pHash?: (string|null);
        notSpam?: (boolean|null);
        archived?: (boolean|null);
        disappearingMode?: (proto.IDisappearingMode|null);
        unreadMentionCount?: (number|null);
        markedAsUnread?: (boolean|null);
        participant?: (proto.IGroupParticipant[]|null);
        tcToken?: (Uint8Array|null);
        tcTokenTimestamp?: (number|Long|null);
        contactPrimaryIdentityKey?: (Uint8Array|null);
        pinned?: (number|null);
        muteEndTime?: (number|Long|null);
        wallpaper?: (proto.IWallpaperSettings|null);
        mediaVisibility?: (proto.MediaVisibility|null);
        tcTokenSenderTimestamp?: (number|Long|null);
        suspended?: (boolean|null);
        terminated?: (boolean|null);
        createdAt?: (number|Long|null);
        createdBy?: (string|null);
        description?: (string|null);
        support?: (boolean|null);
        isParentGroup?: (boolean|null);
        parentGroupId?: (string|null);
        isDefaultSubgroup?: (boolean|null);
        displayName?: (string|null);
        pnJid?: (string|null);
        shareOwnPn?: (boolean|null);
        pnhDuplicateLidThread?: (boolean|null);
        lidJid?: (string|null);
        username?: (string|null);
        lidOriginType?: (string|null);
        commentsCount?: (number|null);
        locked?: (boolean|null);
        systemMessageToInsert?: (proto.PrivacySystemMessage|null);
        capiCreatedGroup?: (boolean|null);
        accountLid?: (string|null);
        limitSharing?: (boolean|null);
        limitSharingSettingTimestamp?: (number|Long|null);
        limitSharingTrigger?: (proto.LimitSharing.TriggerType|null);
        limitSharingInitiatedByMe?: (boolean|null);
    }

    class Conversation implements IConversation {
        constructor(p?: proto.IConversation);
        public id: string;
        public messages: proto.IHistorySyncMsg[];
        public newJid: string;
        public oldJid: string;
        public lastMsgTimestamp: (number|Long);
        public unreadCount: number;
        public readOnly: boolean;
        public endOfHistoryTransfer: boolean;
        public ephemeralExpiration: number;
        public ephemeralSettingTimestamp: (number|Long);
        public endOfHistoryTransferType: proto.Conversation.EndOfHistoryTransferType;
        public conversationTimestamp: (number|Long);
        public name: string;
        public pHash: string;
        public notSpam: boolean;
        public archived: boolean;
        public disappearingMode?: (proto.IDisappearingMode|null);
        public unreadMentionCount: number;
        public markedAsUnread: boolean;
        public participant: proto.IGroupParticipant[];
        public tcToken: Uint8Array;
        public tcTokenTimestamp: (number|Long);
        public contactPrimaryIdentityKey: Uint8Array;
        public pinned: number;
        public muteEndTime: (number|Long);
        public wallpaper?: (proto.IWallpaperSettings|null);
        public mediaVisibility: proto.MediaVisibility;
        public tcTokenSenderTimestamp: (number|Long);
        public suspended: boolean;
        public terminated: boolean;
        public createdAt: (number|Long);
        public createdBy: string;
        public description: string;
        public support: boolean;
        public isParentGroup: boolean;
        public parentGroupId: string;
        public isDefaultSubgroup: boolean;
        public displayName: string;
        public pnJid: string;
        public shareOwnPn: boolean;
        public pnhDuplicateLidThread: boolean;
        public lidJid: string;
        public username: string;
        public lidOriginType: string;
        public commentsCount: number;
        public locked: boolean;
        public systemMessageToInsert: proto.PrivacySystemMessage;
        public capiCreatedGroup: boolean;
        public accountLid: string;
        public limitSharing: boolean;
        public limitSharingSettingTimestamp: (number|Long);
        public limitSharingTrigger: proto.LimitSharing.TriggerType;
        public limitSharingInitiatedByMe: boolean;
        public static create(properties?: proto.IConversation): proto.Conversation;
        public static encode(m: proto.IConversation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Conversation;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Conversation {

        enum EndOfHistoryTransferType {
            COMPLETE_BUT_MORE_MESSAGES_REMAIN_ON_PRIMARY = 0,
            COMPLETE_AND_NO_MORE_MESSAGE_REMAIN_ON_PRIMARY = 1,
            COMPLETE_ON_DEMAND_SYNC_BUT_MORE_MSG_REMAIN_ON_PRIMARY = 2
        }
    }

    interface IDeviceCapabilities {
        chatLockSupportLevel?: (proto.DeviceCapabilities.ChatLockSupportLevel|null);
        lidMigration?: (proto.DeviceCapabilities.ILIDMigration|null);
    }

    class DeviceCapabilities implements IDeviceCapabilities {
        constructor(p?: proto.IDeviceCapabilities);
        public chatLockSupportLevel: proto.DeviceCapabilities.ChatLockSupportLevel;
        public lidMigration?: (proto.DeviceCapabilities.ILIDMigration|null);
        public static create(properties?: proto.IDeviceCapabilities): proto.DeviceCapabilities;
        public static encode(m: proto.IDeviceCapabilities, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceCapabilities;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DeviceCapabilities {

        enum ChatLockSupportLevel {
            NONE = 0,
            MINIMAL = 1,
            FULL = 2
        }

        interface ILIDMigration {
            chatDbMigrationTimestamp?: (number|Long|null);
        }

        class LIDMigration implements ILIDMigration {
            constructor(p?: proto.DeviceCapabilities.ILIDMigration);
            public chatDbMigrationTimestamp: (number|Long);
            public static create(properties?: proto.DeviceCapabilities.ILIDMigration): proto.DeviceCapabilities.LIDMigration;
            public static encode(m: proto.DeviceCapabilities.ILIDMigration, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceCapabilities.LIDMigration;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IDeviceConsistencyCodeMessage {
        generation?: (number|null);
        signature?: (Uint8Array|null);
    }

    class DeviceConsistencyCodeMessage implements IDeviceConsistencyCodeMessage {
        constructor(p?: proto.IDeviceConsistencyCodeMessage);
        public generation: number;
        public signature: Uint8Array;
        public static create(properties?: proto.IDeviceConsistencyCodeMessage): proto.DeviceConsistencyCodeMessage;
        public static encode(m: proto.IDeviceConsistencyCodeMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceConsistencyCodeMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IDeviceListMetadata {
        senderKeyHash?: (Uint8Array|null);
        senderTimestamp?: (number|Long|null);
        senderKeyIndexes?: (number[]|null);
        senderAccountType?: (proto.ADVEncryptionType|null);
        receiverAccountType?: (proto.ADVEncryptionType|null);
        recipientKeyHash?: (Uint8Array|null);
        recipientTimestamp?: (number|Long|null);
        recipientKeyIndexes?: (number[]|null);
    }

    class DeviceListMetadata implements IDeviceListMetadata {
        constructor(p?: proto.IDeviceListMetadata);
        public senderKeyHash: Uint8Array;
        public senderTimestamp: (number|Long);
        public senderKeyIndexes: number[];
        public senderAccountType: proto.ADVEncryptionType;
        public receiverAccountType: proto.ADVEncryptionType;
        public recipientKeyHash: Uint8Array;
        public recipientTimestamp: (number|Long);
        public recipientKeyIndexes: number[];
        public static create(properties?: proto.IDeviceListMetadata): proto.DeviceListMetadata;
        public static encode(m: proto.IDeviceListMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceListMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IDeviceProps {
        os?: (string|null);
        version?: (proto.DeviceProps.IAppVersion|null);
        platformType?: (proto.DeviceProps.PlatformType|null);
        requireFullSync?: (boolean|null);
        historySyncConfig?: (proto.DeviceProps.IHistorySyncConfig|null);
    }

    class DeviceProps implements IDeviceProps {
        constructor(p?: proto.IDeviceProps);
        public os: string;
        public version?: (proto.DeviceProps.IAppVersion|null);
        public platformType: proto.DeviceProps.PlatformType;
        public requireFullSync: boolean;
        public historySyncConfig?: (proto.DeviceProps.IHistorySyncConfig|null);
        public static create(properties?: proto.IDeviceProps): proto.DeviceProps;
        public static encode(m: proto.IDeviceProps, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceProps;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DeviceProps {

        interface IAppVersion {
            primary?: (number|null);
            secondary?: (number|null);
            tertiary?: (number|null);
            quaternary?: (number|null);
            quinary?: (number|null);
        }

        class AppVersion implements IAppVersion {
            constructor(p?: proto.DeviceProps.IAppVersion);
            public primary: number;
            public secondary: number;
            public tertiary: number;
            public quaternary: number;
            public quinary: number;
            public static create(properties?: proto.DeviceProps.IAppVersion): proto.DeviceProps.AppVersion;
            public static encode(m: proto.DeviceProps.IAppVersion, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceProps.AppVersion;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IHistorySyncConfig {
            fullSyncDaysLimit?: (number|null);
            fullSyncSizeMbLimit?: (number|null);
            storageQuotaMb?: (number|null);
            inlineInitialPayloadInE2EeMsg?: (boolean|null);
            recentSyncDaysLimit?: (number|null);
            supportCallLogHistory?: (boolean|null);
            supportBotUserAgentChatHistory?: (boolean|null);
            supportCagReactionsAndPolls?: (boolean|null);
            supportBizHostedMsg?: (boolean|null);
            supportRecentSyncChunkMessageCountTuning?: (boolean|null);
            supportHostedGroupMsg?: (boolean|null);
            supportFbidBotChatHistory?: (boolean|null);
            supportAddOnHistorySyncMigration?: (boolean|null);
            supportMessageAssociation?: (boolean|null);
        }

        class HistorySyncConfig implements IHistorySyncConfig {
            constructor(p?: proto.DeviceProps.IHistorySyncConfig);
            public fullSyncDaysLimit: number;
            public fullSyncSizeMbLimit: number;
            public storageQuotaMb: number;
            public inlineInitialPayloadInE2EeMsg: boolean;
            public recentSyncDaysLimit: number;
            public supportCallLogHistory: boolean;
            public supportBotUserAgentChatHistory: boolean;
            public supportCagReactionsAndPolls: boolean;
            public supportBizHostedMsg: boolean;
            public supportRecentSyncChunkMessageCountTuning: boolean;
            public supportHostedGroupMsg: boolean;
            public supportFbidBotChatHistory: boolean;
            public supportAddOnHistorySyncMigration: boolean;
            public supportMessageAssociation: boolean;
            public static create(properties?: proto.DeviceProps.IHistorySyncConfig): proto.DeviceProps.HistorySyncConfig;
            public static encode(m: proto.DeviceProps.IHistorySyncConfig, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DeviceProps.HistorySyncConfig;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum PlatformType {
            UNKNOWN = 0,
            CHROME = 1,
            FIREFOX = 2,
            IE = 3,
            OPERA = 4,
            SAFARI = 5,
            EDGE = 6,
            DESKTOP = 7,
            IPAD = 8,
            ANDROID_TABLET = 9,
            OHANA = 10,
            ALOHA = 11,
            CATALINA = 12,
            TCL_TV = 13,
            IOS_PHONE = 14,
            IOS_CATALYST = 15,
            ANDROID_PHONE = 16,
            ANDROID_AMBIGUOUS = 17,
            WEAR_OS = 18,
            AR_WRIST = 19,
            AR_DEVICE = 20,
            UWP = 21,
            VR = 22,
            CLOUD_API = 23,
            SMARTGLASSES = 24
        }
    }

    interface IDisappearingMode {
        initiator?: (proto.DisappearingMode.Initiator|null);
        trigger?: (proto.DisappearingMode.Trigger|null);
        initiatorDeviceJid?: (string|null);
        initiatedByMe?: (boolean|null);
    }

    class DisappearingMode implements IDisappearingMode {
        constructor(p?: proto.IDisappearingMode);
        public initiator: proto.DisappearingMode.Initiator;
        public trigger: proto.DisappearingMode.Trigger;
        public initiatorDeviceJid: string;
        public initiatedByMe: boolean;
        public static create(properties?: proto.IDisappearingMode): proto.DisappearingMode;
        public static encode(m: proto.IDisappearingMode, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.DisappearingMode;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DisappearingMode {

        enum Initiator {
            CHANGED_IN_CHAT = 0,
            INITIATED_BY_ME = 1,
            INITIATED_BY_OTHER = 2,
            BIZ_UPGRADE_FB_HOSTING = 3
        }

        enum Trigger {
            UNKNOWN = 0,
            CHAT_SETTING = 1,
            ACCOUNT_SETTING = 2,
            BULK_CHANGE = 3,
            BIZ_SUPPORTS_FB_HOSTING = 4,
            UNKNOWN_GROUPS = 5
        }
    }

    interface IEmbeddedContent {
        embeddedMessage?: (proto.IEmbeddedMessage|null);
        embeddedMusic?: (proto.IEmbeddedMusic|null);
    }

    class EmbeddedContent implements IEmbeddedContent {
        constructor(p?: proto.IEmbeddedContent);
        public embeddedMessage?: (proto.IEmbeddedMessage|null);
        public embeddedMusic?: (proto.IEmbeddedMusic|null);
        public content?: ("embeddedMessage"|"embeddedMusic");
        public static create(properties?: proto.IEmbeddedContent): proto.EmbeddedContent;
        public static encode(m: proto.IEmbeddedContent, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EmbeddedContent;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEmbeddedMessage {
        stanzaId?: (string|null);
        message?: (proto.IMessage|null);
    }

    class EmbeddedMessage implements IEmbeddedMessage {
        constructor(p?: proto.IEmbeddedMessage);
        public stanzaId: string;
        public message?: (proto.IMessage|null);
        public static create(properties?: proto.IEmbeddedMessage): proto.EmbeddedMessage;
        public static encode(m: proto.IEmbeddedMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EmbeddedMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEmbeddedMusic {
        musicContentMediaId?: (string|null);
        songId?: (string|null);
        author?: (string|null);
        title?: (string|null);
        artworkDirectPath?: (string|null);
        artworkSha256?: (Uint8Array|null);
        artworkEncSha256?: (Uint8Array|null);
        artworkMediaKey?: (Uint8Array|null);
        artistAttribution?: (string|null);
        countryBlocklist?: (Uint8Array|null);
        isExplicit?: (boolean|null);
    }

    class EmbeddedMusic implements IEmbeddedMusic {
        constructor(p?: proto.IEmbeddedMusic);
        public musicContentMediaId: string;
        public songId: string;
        public author: string;
        public title: string;
        public artworkDirectPath: string;
        public artworkSha256: Uint8Array;
        public artworkEncSha256: Uint8Array;
        public artworkMediaKey: Uint8Array;
        public artistAttribution: string;
        public countryBlocklist: Uint8Array;
        public isExplicit: boolean;
        public static create(properties?: proto.IEmbeddedMusic): proto.EmbeddedMusic;
        public static encode(m: proto.IEmbeddedMusic, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EmbeddedMusic;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEncryptedPairingRequest {
        encryptedPayload?: (Uint8Array|null);
        iv?: (Uint8Array|null);
    }

    class EncryptedPairingRequest implements IEncryptedPairingRequest {
        constructor(p?: proto.IEncryptedPairingRequest);
        public encryptedPayload: Uint8Array;
        public iv: Uint8Array;
        public static create(properties?: proto.IEncryptedPairingRequest): proto.EncryptedPairingRequest;
        public static encode(m: proto.IEncryptedPairingRequest, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EncryptedPairingRequest;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEphemeralSetting {
        duration?: (number|null);
        timestamp?: (number|Long|null);
    }

    class EphemeralSetting implements IEphemeralSetting {
        constructor(p?: proto.IEphemeralSetting);
        public duration: number;
        public timestamp: (number|Long);
        public static create(properties?: proto.IEphemeralSetting): proto.EphemeralSetting;
        public static encode(m: proto.IEphemeralSetting, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EphemeralSetting;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEventAdditionalMetadata {
        isStale?: (boolean|null);
    }

    class EventAdditionalMetadata implements IEventAdditionalMetadata {
        constructor(p?: proto.IEventAdditionalMetadata);
        public isStale: boolean;
        public static create(properties?: proto.IEventAdditionalMetadata): proto.EventAdditionalMetadata;
        public static encode(m: proto.IEventAdditionalMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EventAdditionalMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IEventResponse {
        eventResponseMessageKey?: (proto.IMessageKey|null);
        timestampMs?: (number|Long|null);
        eventResponseMessage?: (proto.Message.IEventResponseMessage|null);
        unread?: (boolean|null);
    }

    class EventResponse implements IEventResponse {
        constructor(p?: proto.IEventResponse);
        public eventResponseMessageKey?: (proto.IMessageKey|null);
        public timestampMs: (number|Long);
        public eventResponseMessage?: (proto.Message.IEventResponseMessage|null);
        public unread: boolean;
        public static create(properties?: proto.IEventResponse): proto.EventResponse;
        public static encode(m: proto.IEventResponse, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.EventResponse;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IExitCode {
        code?: (number|Long|null);
        text?: (string|null);
    }

    class ExitCode implements IExitCode {
        constructor(p?: proto.IExitCode);
        public code: (number|Long);
        public text: string;
        public static create(properties?: proto.IExitCode): proto.ExitCode;
        public static encode(m: proto.IExitCode, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ExitCode;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IExternalBlobReference {
        mediaKey?: (Uint8Array|null);
        directPath?: (string|null);
        handle?: (string|null);
        fileSizeBytes?: (number|Long|null);
        fileSha256?: (Uint8Array|null);
        fileEncSha256?: (Uint8Array|null);
    }

    class ExternalBlobReference implements IExternalBlobReference {
        constructor(p?: proto.IExternalBlobReference);
        public mediaKey: Uint8Array;
        public directPath: string;
        public handle: string;
        public fileSizeBytes: (number|Long);
        public fileSha256: Uint8Array;
        public fileEncSha256: Uint8Array;
        public static create(properties?: proto.IExternalBlobReference): proto.ExternalBlobReference;
        public static encode(m: proto.IExternalBlobReference, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ExternalBlobReference;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IField {
        minVersion?: (number|null);
        maxVersion?: (number|null);
        notReportableMinVersion?: (number|null);
        isMessage?: (boolean|null);
        subfield?: ({ [k: string]: proto.IField }|null);
    }

    class Field implements IField {
        constructor(p?: proto.IField);
        public minVersion: number;
        public maxVersion: number;
        public notReportableMinVersion: number;
        public isMessage: boolean;
        public subfield: { [k: string]: proto.IField };
        public static create(properties?: proto.IField): proto.Field;
        public static encode(m: proto.IField, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Field;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IGlobalSettings {
        lightThemeWallpaper?: (proto.IWallpaperSettings|null);
        mediaVisibility?: (proto.MediaVisibility|null);
        darkThemeWallpaper?: (proto.IWallpaperSettings|null);
        autoDownloadWiFi?: (proto.IAutoDownloadSettings|null);
        autoDownloadCellular?: (proto.IAutoDownloadSettings|null);
        autoDownloadRoaming?: (proto.IAutoDownloadSettings|null);
        showIndividualNotificationsPreview?: (boolean|null);
        showGroupNotificationsPreview?: (boolean|null);
        disappearingModeDuration?: (number|null);
        disappearingModeTimestamp?: (number|Long|null);
        avatarUserSettings?: (proto.IAvatarUserSettings|null);
        fontSize?: (number|null);
        securityNotifications?: (boolean|null);
        autoUnarchiveChats?: (boolean|null);
        videoQualityMode?: (number|null);
        photoQualityMode?: (number|null);
        individualNotificationSettings?: (proto.INotificationSettings|null);
        groupNotificationSettings?: (proto.INotificationSettings|null);
        chatLockSettings?: (proto.IChatLockSettings|null);
        chatDbLidMigrationTimestamp?: (number|Long|null);
    }

    class GlobalSettings implements IGlobalSettings {
        constructor(p?: proto.IGlobalSettings);
        public lightThemeWallpaper?: (proto.IWallpaperSettings|null);
        public mediaVisibility: proto.MediaVisibility;
        public darkThemeWallpaper?: (proto.IWallpaperSettings|null);
        public autoDownloadWiFi?: (proto.IAutoDownloadSettings|null);
        public autoDownloadCellular?: (proto.IAutoDownloadSettings|null);
        public autoDownloadRoaming?: (proto.IAutoDownloadSettings|null);
        public showIndividualNotificationsPreview: boolean;
        public showGroupNotificationsPreview: boolean;
        public disappearingModeDuration: number;
        public disappearingModeTimestamp: (number|Long);
        public avatarUserSettings?: (proto.IAvatarUserSettings|null);
        public fontSize: number;
        public securityNotifications: boolean;
        public autoUnarchiveChats: boolean;
        public videoQualityMode: number;
        public photoQualityMode: number;
        public individualNotificationSettings?: (proto.INotificationSettings|null);
        public groupNotificationSettings?: (proto.INotificationSettings|null);
        public chatLockSettings?: (proto.IChatLockSettings|null);
        public chatDbLidMigrationTimestamp: (number|Long);
        public static create(properties?: proto.IGlobalSettings): proto.GlobalSettings;
        public static encode(m: proto.IGlobalSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.GlobalSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IGroupMention {
        groupJid?: (string|null);
        groupSubject?: (string|null);
    }

    class GroupMention implements IGroupMention {
        constructor(p?: proto.IGroupMention);
        public groupJid: string;
        public groupSubject: string;
        public static create(properties?: proto.IGroupMention): proto.GroupMention;
        public static encode(m: proto.IGroupMention, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.GroupMention;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IGroupParticipant {
        userJid: string;
        rank?: (proto.GroupParticipant.Rank|null);
    }

    class GroupParticipant implements IGroupParticipant {
        constructor(p?: proto.IGroupParticipant);
        public userJid: string;
        public rank: proto.GroupParticipant.Rank;
        public static create(properties?: proto.IGroupParticipant): proto.GroupParticipant;
        public static encode(m: proto.IGroupParticipant, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.GroupParticipant;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace GroupParticipant {

        enum Rank {
            REGULAR = 0,
            ADMIN = 1,
            SUPERADMIN = 2
        }
    }

    interface IHandshakeMessage {
        clientHello?: (proto.HandshakeMessage.IClientHello|null);
        serverHello?: (proto.HandshakeMessage.IServerHello|null);
        clientFinish?: (proto.HandshakeMessage.IClientFinish|null);
    }

    class HandshakeMessage implements IHandshakeMessage {
        constructor(p?: proto.IHandshakeMessage);
        public clientHello?: (proto.HandshakeMessage.IClientHello|null);
        public serverHello?: (proto.HandshakeMessage.IServerHello|null);
        public clientFinish?: (proto.HandshakeMessage.IClientFinish|null);
        public static create(properties?: proto.IHandshakeMessage): proto.HandshakeMessage;
        public static encode(m: proto.IHandshakeMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HandshakeMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace HandshakeMessage {

        interface IClientFinish {
            "static"?: (Uint8Array|null);
            payload?: (Uint8Array|null);
        }

        class ClientFinish implements IClientFinish {
            constructor(p?: proto.HandshakeMessage.IClientFinish);
            public static: Uint8Array;
            public payload: Uint8Array;
            public static create(properties?: proto.HandshakeMessage.IClientFinish): proto.HandshakeMessage.ClientFinish;
            public static encode(m: proto.HandshakeMessage.IClientFinish, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HandshakeMessage.ClientFinish;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IClientHello {
            ephemeral?: (Uint8Array|null);
            "static"?: (Uint8Array|null);
            payload?: (Uint8Array|null);
        }

        class ClientHello implements IClientHello {
            constructor(p?: proto.HandshakeMessage.IClientHello);
            public ephemeral: Uint8Array;
            public static: Uint8Array;
            public payload: Uint8Array;
            public static create(properties?: proto.HandshakeMessage.IClientHello): proto.HandshakeMessage.ClientHello;
            public static encode(m: proto.HandshakeMessage.IClientHello, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HandshakeMessage.ClientHello;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IServerHello {
            ephemeral?: (Uint8Array|null);
            "static"?: (Uint8Array|null);
            payload?: (Uint8Array|null);
        }

        class ServerHello implements IServerHello {
            constructor(p?: proto.HandshakeMessage.IServerHello);
            public ephemeral: Uint8Array;
            public static: Uint8Array;
            public payload: Uint8Array;
            public static create(properties?: proto.HandshakeMessage.IServerHello): proto.HandshakeMessage.ServerHello;
            public static encode(m: proto.HandshakeMessage.IServerHello, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HandshakeMessage.ServerHello;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IHistorySync {
        syncType: proto.HistorySync.HistorySyncType;
        conversations?: (proto.IConversation[]|null);
        statusV3Messages?: (proto.IWebMessageInfo[]|null);
        chunkOrder?: (number|null);
        progress?: (number|null);
        pushnames?: (proto.IPushname[]|null);
        globalSettings?: (proto.IGlobalSettings|null);
        threadIdUserSecret?: (Uint8Array|null);
        threadDsTimeframeOffset?: (number|null);
        recentStickers?: (proto.IStickerMetadata[]|null);
        pastParticipants?: (proto.IPastParticipants[]|null);
        callLogRecords?: (proto.ICallLogRecord[]|null);
        aiWaitListState?: (proto.HistorySync.BotAIWaitListState|null);
        phoneNumberToLidMappings?: (proto.IPhoneNumberToLIDMapping[]|null);
        companionMetaNonce?: (string|null);
        shareableChatIdentifierEncryptionKey?: (Uint8Array|null);
        accounts?: (proto.IAccount[]|null);
    }

    class HistorySync implements IHistorySync {
        constructor(p?: proto.IHistorySync);
        public syncType: proto.HistorySync.HistorySyncType;
        public conversations: proto.IConversation[];
        public statusV3Messages: proto.IWebMessageInfo[];
        public chunkOrder: number;
        public progress: number;
        public pushnames: proto.IPushname[];
        public globalSettings?: (proto.IGlobalSettings|null);
        public threadIdUserSecret: Uint8Array;
        public threadDsTimeframeOffset: number;
        public recentStickers: proto.IStickerMetadata[];
        public pastParticipants: proto.IPastParticipants[];
        public callLogRecords: proto.ICallLogRecord[];
        public aiWaitListState: proto.HistorySync.BotAIWaitListState;
        public phoneNumberToLidMappings: proto.IPhoneNumberToLIDMapping[];
        public companionMetaNonce: string;
        public shareableChatIdentifierEncryptionKey: Uint8Array;
        public accounts: proto.IAccount[];
        public static create(properties?: proto.IHistorySync): proto.HistorySync;
        public static encode(m: proto.IHistorySync, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HistorySync;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace HistorySync {

        enum BotAIWaitListState {
            IN_WAITLIST = 0,
            AI_AVAILABLE = 1
        }

        enum HistorySyncType {
            INITIAL_BOOTSTRAP = 0,
            INITIAL_STATUS_V3 = 1,
            FULL = 2,
            RECENT = 3,
            PUSH_NAME = 4,
            NON_BLOCKING_DATA = 5,
            ON_DEMAND = 6
        }
    }

    interface IHistorySyncMsg {
        message?: (proto.IWebMessageInfo|null);
        msgOrderId?: (number|Long|null);
    }

    class HistorySyncMsg implements IHistorySyncMsg {
        constructor(p?: proto.IHistorySyncMsg);
        public message?: (proto.IWebMessageInfo|null);
        public msgOrderId: (number|Long);
        public static create(properties?: proto.IHistorySyncMsg): proto.HistorySyncMsg;
        public static encode(m: proto.IHistorySyncMsg, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HistorySyncMsg;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IHydratedTemplateButton {
        index?: (number|null);
        quickReplyButton?: (proto.HydratedTemplateButton.IHydratedQuickReplyButton|null);
        urlButton?: (proto.HydratedTemplateButton.IHydratedURLButton|null);
        callButton?: (proto.HydratedTemplateButton.IHydratedCallButton|null);
    }

    class HydratedTemplateButton implements IHydratedTemplateButton {
        constructor(p?: proto.IHydratedTemplateButton);
        public index: number;
        public quickReplyButton?: (proto.HydratedTemplateButton.IHydratedQuickReplyButton|null);
        public urlButton?: (proto.HydratedTemplateButton.IHydratedURLButton|null);
        public callButton?: (proto.HydratedTemplateButton.IHydratedCallButton|null);
        public hydratedButton?: ("quickReplyButton"|"urlButton"|"callButton");
        public static create(properties?: proto.IHydratedTemplateButton): proto.HydratedTemplateButton;
        public static encode(m: proto.IHydratedTemplateButton, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HydratedTemplateButton;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace HydratedTemplateButton {

        interface IHydratedCallButton {
            displayText?: (string|null);
            phoneNumber?: (string|null);
        }

        class HydratedCallButton implements IHydratedCallButton {
            constructor(p?: proto.HydratedTemplateButton.IHydratedCallButton);
            public displayText: string;
            public phoneNumber: string;
            public static create(properties?: proto.HydratedTemplateButton.IHydratedCallButton): proto.HydratedTemplateButton.HydratedCallButton;
            public static encode(m: proto.HydratedTemplateButton.IHydratedCallButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HydratedTemplateButton.HydratedCallButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IHydratedQuickReplyButton {
            displayText?: (string|null);
            id?: (string|null);
        }

        class HydratedQuickReplyButton implements IHydratedQuickReplyButton {
            constructor(p?: proto.HydratedTemplateButton.IHydratedQuickReplyButton);
            public displayText: string;
            public id: string;
            public static create(properties?: proto.HydratedTemplateButton.IHydratedQuickReplyButton): proto.HydratedTemplateButton.HydratedQuickReplyButton;
            public static encode(m: proto.HydratedTemplateButton.IHydratedQuickReplyButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HydratedTemplateButton.HydratedQuickReplyButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IHydratedURLButton {
            displayText?: (string|null);
            url?: (string|null);
            consentedUsersUrl?: (string|null);
            webviewPresentation?: (proto.HydratedTemplateButton.HydratedURLButton.WebviewPresentationType|null);
        }

        class HydratedURLButton implements IHydratedURLButton {
            constructor(p?: proto.HydratedTemplateButton.IHydratedURLButton);
            public displayText: string;
            public url: string;
            public consentedUsersUrl: string;
            public webviewPresentation: proto.HydratedTemplateButton.HydratedURLButton.WebviewPresentationType;
            public static create(properties?: proto.HydratedTemplateButton.IHydratedURLButton): proto.HydratedTemplateButton.HydratedURLButton;
            public static encode(m: proto.HydratedTemplateButton.IHydratedURLButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.HydratedTemplateButton.HydratedURLButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace HydratedURLButton {

            enum WebviewPresentationType {
                FULL = 1,
                TALL = 2,
                COMPACT = 3
            }
        }
    }

    interface IIdentityKeyPairStructure {
        publicKey?: (Uint8Array|null);
        privateKey?: (Uint8Array|null);
    }

    class IdentityKeyPairStructure implements IIdentityKeyPairStructure {
        constructor(p?: proto.IIdentityKeyPairStructure);
        public publicKey: Uint8Array;
        public privateKey: Uint8Array;
        public static create(properties?: proto.IIdentityKeyPairStructure): proto.IdentityKeyPairStructure;
        public static encode(m: proto.IIdentityKeyPairStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.IdentityKeyPairStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IInteractiveAnnotation {
        polygonVertices?: (proto.IPoint[]|null);
        shouldSkipConfirmation?: (boolean|null);
        embeddedContent?: (proto.IEmbeddedContent|null);
        statusLinkType?: (proto.InteractiveAnnotation.StatusLinkType|null);
        location?: (proto.ILocation|null);
        newsletter?: (proto.ContextInfo.IForwardedNewsletterMessageInfo|null);
        embeddedAction?: (boolean|null);
        tapAction?: (proto.ITapLinkAction|null);
    }

    class InteractiveAnnotation implements IInteractiveAnnotation {
        constructor(p?: proto.IInteractiveAnnotation);
        public polygonVertices: proto.IPoint[];
        public shouldSkipConfirmation: boolean;
        public embeddedContent?: (proto.IEmbeddedContent|null);
        public statusLinkType: proto.InteractiveAnnotation.StatusLinkType;
        public location?: (proto.ILocation|null);
        public newsletter?: (proto.ContextInfo.IForwardedNewsletterMessageInfo|null);
        public embeddedAction?: (boolean|null);
        public tapAction?: (proto.ITapLinkAction|null);
        public action?: ("location"|"newsletter"|"embeddedAction"|"tapAction");
        public static create(properties?: proto.IInteractiveAnnotation): proto.InteractiveAnnotation;
        public static encode(m: proto.IInteractiveAnnotation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.InteractiveAnnotation;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace InteractiveAnnotation {

        enum StatusLinkType {
            RASTERIZED_LINK_PREVIEW = 1,
            RASTERIZED_LINK_TRUNCATED = 2,
            RASTERIZED_LINK_FULL_URL = 3
        }
    }

    interface IKeepInChat {
        keepType?: (proto.KeepType|null);
        serverTimestamp?: (number|Long|null);
        key?: (proto.IMessageKey|null);
        deviceJid?: (string|null);
        clientTimestampMs?: (number|Long|null);
        serverTimestampMs?: (number|Long|null);
    }

    class KeepInChat implements IKeepInChat {
        constructor(p?: proto.IKeepInChat);
        public keepType: proto.KeepType;
        public serverTimestamp: (number|Long);
        public key?: (proto.IMessageKey|null);
        public deviceJid: string;
        public clientTimestampMs: (number|Long);
        public serverTimestampMs: (number|Long);
        public static create(properties?: proto.IKeepInChat): proto.KeepInChat;
        public static encode(m: proto.IKeepInChat, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.KeepInChat;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum KeepType {
        UNKNOWN = 0,
        KEEP_FOR_ALL = 1,
        UNDO_KEEP_FOR_ALL = 2
    }

    interface IKeyExchangeMessage {
        id?: (number|null);
        baseKey?: (Uint8Array|null);
        ratchetKey?: (Uint8Array|null);
        identityKey?: (Uint8Array|null);
        baseKeySignature?: (Uint8Array|null);
    }

    class KeyExchangeMessage implements IKeyExchangeMessage {
        constructor(p?: proto.IKeyExchangeMessage);
        public id: number;
        public baseKey: Uint8Array;
        public ratchetKey: Uint8Array;
        public identityKey: Uint8Array;
        public baseKeySignature: Uint8Array;
        public static create(properties?: proto.IKeyExchangeMessage): proto.KeyExchangeMessage;
        public static encode(m: proto.IKeyExchangeMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.KeyExchangeMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IKeyId {
        id?: (Uint8Array|null);
    }

    class KeyId implements IKeyId {
        constructor(p?: proto.IKeyId);
        public id: Uint8Array;
        public static create(properties?: proto.IKeyId): proto.KeyId;
        public static encode(m: proto.IKeyId, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.KeyId;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILIDMigrationMapping {
        pn: (number|Long);
        assignedLid: (number|Long);
        latestLid?: (number|Long|null);
    }

    class LIDMigrationMapping implements ILIDMigrationMapping {
        constructor(p?: proto.ILIDMigrationMapping);
        public pn: (number|Long);
        public assignedLid: (number|Long);
        public latestLid: (number|Long);
        public static create(properties?: proto.ILIDMigrationMapping): proto.LIDMigrationMapping;
        public static encode(m: proto.ILIDMigrationMapping, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LIDMigrationMapping;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILIDMigrationMappingSyncMessage {
        encodedMappingPayload?: (Uint8Array|null);
    }

    class LIDMigrationMappingSyncMessage implements ILIDMigrationMappingSyncMessage {
        constructor(p?: proto.ILIDMigrationMappingSyncMessage);
        public encodedMappingPayload: Uint8Array;
        public static create(properties?: proto.ILIDMigrationMappingSyncMessage): proto.LIDMigrationMappingSyncMessage;
        public static encode(m: proto.ILIDMigrationMappingSyncMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LIDMigrationMappingSyncMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILIDMigrationMappingSyncPayload {
        pnToLidMappings?: (proto.ILIDMigrationMapping[]|null);
        chatDbMigrationTimestamp?: (number|Long|null);
    }

    class LIDMigrationMappingSyncPayload implements ILIDMigrationMappingSyncPayload {
        constructor(p?: proto.ILIDMigrationMappingSyncPayload);
        public pnToLidMappings: proto.ILIDMigrationMapping[];
        public chatDbMigrationTimestamp: (number|Long);
        public static create(properties?: proto.ILIDMigrationMappingSyncPayload): proto.LIDMigrationMappingSyncPayload;
        public static encode(m: proto.ILIDMigrationMappingSyncPayload, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LIDMigrationMappingSyncPayload;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILegacyMessage {
        eventResponseMessage?: (proto.Message.IEventResponseMessage|null);
        pollVote?: (proto.Message.IPollVoteMessage|null);
    }

    class LegacyMessage implements ILegacyMessage {
        constructor(p?: proto.ILegacyMessage);
        public eventResponseMessage?: (proto.Message.IEventResponseMessage|null);
        public pollVote?: (proto.Message.IPollVoteMessage|null);
        public static create(properties?: proto.ILegacyMessage): proto.LegacyMessage;
        public static encode(m: proto.ILegacyMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LegacyMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILimitSharing {
        sharingLimited?: (boolean|null);
        trigger?: (proto.LimitSharing.TriggerType|null);
        limitSharingSettingTimestamp?: (number|Long|null);
        initiatedByMe?: (boolean|null);
    }

    class LimitSharing implements ILimitSharing {
        constructor(p?: proto.ILimitSharing);
        public sharingLimited: boolean;
        public trigger: proto.LimitSharing.TriggerType;
        public limitSharingSettingTimestamp: (number|Long);
        public initiatedByMe: boolean;
        public static create(properties?: proto.ILimitSharing): proto.LimitSharing;
        public static encode(m: proto.ILimitSharing, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LimitSharing;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace LimitSharing {

        enum TriggerType {
            UNKNOWN = 0,
            CHAT_SETTING = 1,
            BIZ_SUPPORTS_FB_HOSTING = 2,
            UNKNOWN_GROUP = 3
        }
    }

    interface ILocalizedName {
        lg?: (string|null);
        lc?: (string|null);
        verifiedName?: (string|null);
    }

    class LocalizedName implements ILocalizedName {
        constructor(p?: proto.ILocalizedName);
        public lg: string;
        public lc: string;
        public verifiedName: string;
        public static create(properties?: proto.ILocalizedName): proto.LocalizedName;
        public static encode(m: proto.ILocalizedName, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.LocalizedName;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ILocation {
        degreesLatitude?: (number|null);
        degreesLongitude?: (number|null);
        name?: (string|null);
    }

    class Location implements ILocation {
        constructor(p?: proto.ILocation);
        public degreesLatitude: number;
        public degreesLongitude: number;
        public name: string;
        public static create(properties?: proto.ILocation): proto.Location;
        public static encode(m: proto.ILocation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Location;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMediaData {
        localPath?: (string|null);
    }

    class MediaData implements IMediaData {
        constructor(p?: proto.IMediaData);
        public localPath: string;
        public static create(properties?: proto.IMediaData): proto.MediaData;
        public static encode(m: proto.IMediaData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MediaData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMediaNotifyMessage {
        expressPathUrl?: (string|null);
        fileEncSha256?: (Uint8Array|null);
        fileLength?: (number|Long|null);
    }

    class MediaNotifyMessage implements IMediaNotifyMessage {
        constructor(p?: proto.IMediaNotifyMessage);
        public expressPathUrl: string;
        public fileEncSha256: Uint8Array;
        public fileLength: (number|Long);
        public static create(properties?: proto.IMediaNotifyMessage): proto.MediaNotifyMessage;
        public static encode(m: proto.IMediaNotifyMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MediaNotifyMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMediaRetryNotification {
        stanzaId?: (string|null);
        directPath?: (string|null);
        result?: (proto.MediaRetryNotification.ResultType|null);
        messageSecret?: (Uint8Array|null);
    }

    class MediaRetryNotification implements IMediaRetryNotification {
        constructor(p?: proto.IMediaRetryNotification);
        public stanzaId: string;
        public directPath: string;
        public result: proto.MediaRetryNotification.ResultType;
        public messageSecret: Uint8Array;
        public static create(properties?: proto.IMediaRetryNotification): proto.MediaRetryNotification;
        public static encode(m: proto.IMediaRetryNotification, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MediaRetryNotification;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MediaRetryNotification {

        enum ResultType {
            GENERAL_ERROR = 0,
            SUCCESS = 1,
            NOT_FOUND = 2,
            DECRYPTION_ERROR = 3
        }
    }

    enum MediaVisibility {
        DEFAULT = 0,
        OFF = 1,
        ON = 2
    }

    interface IMemberLabel {
        label?: (string|null);
        labelTimestamp?: (number|Long|null);
    }

    class MemberLabel implements IMemberLabel {
        constructor(p?: proto.IMemberLabel);
        public label: string;
        public labelTimestamp: (number|Long);
        public static create(properties?: proto.IMemberLabel): proto.MemberLabel;
        public static encode(m: proto.IMemberLabel, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MemberLabel;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMessage {
        conversation?: (string|null);
        senderKeyDistributionMessage?: (proto.Message.ISenderKeyDistributionMessage|null);
        imageMessage?: (proto.Message.IImageMessage|null);
        contactMessage?: (proto.Message.IContactMessage|null);
        locationMessage?: (proto.Message.ILocationMessage|null);
        extendedTextMessage?: (proto.Message.IExtendedTextMessage|null);
        documentMessage?: (proto.Message.IDocumentMessage|null);
        audioMessage?: (proto.Message.IAudioMessage|null);
        videoMessage?: (proto.Message.IVideoMessage|null);
        call?: (proto.Message.ICall|null);
        chat?: (proto.Message.IChat|null);
        protocolMessage?: (proto.Message.IProtocolMessage|null);
        contactsArrayMessage?: (proto.Message.IContactsArrayMessage|null);
        highlyStructuredMessage?: (proto.Message.IHighlyStructuredMessage|null);
        fastRatchetKeySenderKeyDistributionMessage?: (proto.Message.ISenderKeyDistributionMessage|null);
        sendPaymentMessage?: (proto.Message.ISendPaymentMessage|null);
        liveLocationMessage?: (proto.Message.ILiveLocationMessage|null);
        requestPaymentMessage?: (proto.Message.IRequestPaymentMessage|null);
        declinePaymentRequestMessage?: (proto.Message.IDeclinePaymentRequestMessage|null);
        cancelPaymentRequestMessage?: (proto.Message.ICancelPaymentRequestMessage|null);
        templateMessage?: (proto.Message.ITemplateMessage|null);
        stickerMessage?: (proto.Message.IStickerMessage|null);
        groupInviteMessage?: (proto.Message.IGroupInviteMessage|null);
        templateButtonReplyMessage?: (proto.Message.ITemplateButtonReplyMessage|null);
        productMessage?: (proto.Message.IProductMessage|null);
        deviceSentMessage?: (proto.Message.IDeviceSentMessage|null);
        messageContextInfo?: (proto.IMessageContextInfo|null);
        listMessage?: (proto.Message.IListMessage|null);
        viewOnceMessage?: (proto.Message.IFutureProofMessage|null);
        orderMessage?: (proto.Message.IOrderMessage|null);
        listResponseMessage?: (proto.Message.IListResponseMessage|null);
        ephemeralMessage?: (proto.Message.IFutureProofMessage|null);
        invoiceMessage?: (proto.Message.IInvoiceMessage|null);
        buttonsMessage?: (proto.Message.IButtonsMessage|null);
        buttonsResponseMessage?: (proto.Message.IButtonsResponseMessage|null);
        paymentInviteMessage?: (proto.Message.IPaymentInviteMessage|null);
        interactiveMessage?: (proto.Message.IInteractiveMessage|null);
        reactionMessage?: (proto.Message.IReactionMessage|null);
        stickerSyncRmrMessage?: (proto.Message.IStickerSyncRMRMessage|null);
        interactiveResponseMessage?: (proto.Message.IInteractiveResponseMessage|null);
        pollCreationMessage?: (proto.Message.IPollCreationMessage|null);
        pollUpdateMessage?: (proto.Message.IPollUpdateMessage|null);
        keepInChatMessage?: (proto.Message.IKeepInChatMessage|null);
        documentWithCaptionMessage?: (proto.Message.IFutureProofMessage|null);
        requestPhoneNumberMessage?: (proto.Message.IRequestPhoneNumberMessage|null);
        viewOnceMessageV2?: (proto.Message.IFutureProofMessage|null);
        encReactionMessage?: (proto.Message.IEncReactionMessage|null);
        editedMessage?: (proto.Message.IFutureProofMessage|null);
        viewOnceMessageV2Extension?: (proto.Message.IFutureProofMessage|null);
        pollCreationMessageV2?: (proto.Message.IPollCreationMessage|null);
        scheduledCallCreationMessage?: (proto.Message.IScheduledCallCreationMessage|null);
        groupMentionedMessage?: (proto.Message.IFutureProofMessage|null);
        pinInChatMessage?: (proto.Message.IPinInChatMessage|null);
        pollCreationMessageV3?: (proto.Message.IPollCreationMessage|null);
        scheduledCallEditMessage?: (proto.Message.IScheduledCallEditMessage|null);
        ptvMessage?: (proto.Message.IVideoMessage|null);
        botInvokeMessage?: (proto.Message.IFutureProofMessage|null);
        callLogMesssage?: (proto.Message.ICallLogMessage|null);
        messageHistoryBundle?: (proto.Message.IMessageHistoryBundle|null);
        encCommentMessage?: (proto.Message.IEncCommentMessage|null);
        bcallMessage?: (proto.Message.IBCallMessage|null);
        lottieStickerMessage?: (proto.Message.IFutureProofMessage|null);
        eventMessage?: (proto.Message.IEventMessage|null);
        encEventResponseMessage?: (proto.Message.IEncEventResponseMessage|null);
        commentMessage?: (proto.Message.ICommentMessage|null);
        newsletterAdminInviteMessage?: (proto.Message.INewsletterAdminInviteMessage|null);
        placeholderMessage?: (proto.Message.IPlaceholderMessage|null);
        secretEncryptedMessage?: (proto.Message.ISecretEncryptedMessage|null);
        albumMessage?: (proto.Message.IAlbumMessage|null);
        eventCoverImage?: (proto.Message.IFutureProofMessage|null);
        stickerPackMessage?: (proto.Message.IStickerPackMessage|null);
        statusMentionMessage?: (proto.Message.IFutureProofMessage|null);
        pollResultSnapshotMessage?: (proto.Message.IPollResultSnapshotMessage|null);
        pollCreationOptionImageMessage?: (proto.Message.IFutureProofMessage|null);
        associatedChildMessage?: (proto.Message.IFutureProofMessage|null);
        groupStatusMentionMessage?: (proto.Message.IFutureProofMessage|null);
        pollCreationMessageV4?: (proto.Message.IFutureProofMessage|null);
        pollCreationMessageV5?: (proto.Message.IFutureProofMessage|null);
        statusAddYours?: (proto.Message.IFutureProofMessage|null);
        groupStatusMessage?: (proto.Message.IFutureProofMessage|null);
        richResponseMessage?: (proto.IAIRichResponseMessage|null);
        statusNotificationMessage?: (proto.Message.IStatusNotificationMessage|null);
        limitSharingMessage?: (proto.Message.IFutureProofMessage|null);
        botTaskMessage?: (proto.Message.IFutureProofMessage|null);
        questionMessage?: (proto.Message.IFutureProofMessage|null);
        messageHistoryNotice?: (proto.Message.IMessageHistoryNotice|null);
    }

    class Message implements IMessage {
        constructor(p?: proto.IMessage);
        public conversation: string;
        public senderKeyDistributionMessage?: (proto.Message.ISenderKeyDistributionMessage|null);
        public imageMessage?: (proto.Message.IImageMessage|null);
        public contactMessage?: (proto.Message.IContactMessage|null);
        public locationMessage?: (proto.Message.ILocationMessage|null);
        public extendedTextMessage?: (proto.Message.IExtendedTextMessage|null);
        public documentMessage?: (proto.Message.IDocumentMessage|null);
        public audioMessage?: (proto.Message.IAudioMessage|null);
        public videoMessage?: (proto.Message.IVideoMessage|null);
        public call?: (proto.Message.ICall|null);
        public chat?: (proto.Message.IChat|null);
        public protocolMessage?: (proto.Message.IProtocolMessage|null);
        public contactsArrayMessage?: (proto.Message.IContactsArrayMessage|null);
        public highlyStructuredMessage?: (proto.Message.IHighlyStructuredMessage|null);
        public fastRatchetKeySenderKeyDistributionMessage?: (proto.Message.ISenderKeyDistributionMessage|null);
        public sendPaymentMessage?: (proto.Message.ISendPaymentMessage|null);
        public liveLocationMessage?: (proto.Message.ILiveLocationMessage|null);
        public requestPaymentMessage?: (proto.Message.IRequestPaymentMessage|null);
        public declinePaymentRequestMessage?: (proto.Message.IDeclinePaymentRequestMessage|null);
        public cancelPaymentRequestMessage?: (proto.Message.ICancelPaymentRequestMessage|null);
        public templateMessage?: (proto.Message.ITemplateMessage|null);
        public stickerMessage?: (proto.Message.IStickerMessage|null);
        public groupInviteMessage?: (proto.Message.IGroupInviteMessage|null);
        public templateButtonReplyMessage?: (proto.Message.ITemplateButtonReplyMessage|null);
        public productMessage?: (proto.Message.IProductMessage|null);
        public deviceSentMessage?: (proto.Message.IDeviceSentMessage|null);
        public messageContextInfo?: (proto.IMessageContextInfo|null);
        public listMessage?: (proto.Message.IListMessage|null);
        public viewOnceMessage?: (proto.Message.IFutureProofMessage|null);
        public orderMessage?: (proto.Message.IOrderMessage|null);
        public listResponseMessage?: (proto.Message.IListResponseMessage|null);
        public ephemeralMessage?: (proto.Message.IFutureProofMessage|null);
        public invoiceMessage?: (proto.Message.IInvoiceMessage|null);
        public buttonsMessage?: (proto.Message.IButtonsMessage|null);
        public buttonsResponseMessage?: (proto.Message.IButtonsResponseMessage|null);
        public paymentInviteMessage?: (proto.Message.IPaymentInviteMessage|null);
        public interactiveMessage?: (proto.Message.IInteractiveMessage|null);
        public reactionMessage?: (proto.Message.IReactionMessage|null);
        public stickerSyncRmrMessage?: (proto.Message.IStickerSyncRMRMessage|null);
        public interactiveResponseMessage?: (proto.Message.IInteractiveResponseMessage|null);
        public pollCreationMessage?: (proto.Message.IPollCreationMessage|null);
        public pollUpdateMessage?: (proto.Message.IPollUpdateMessage|null);
        public keepInChatMessage?: (proto.Message.IKeepInChatMessage|null);
        public documentWithCaptionMessage?: (proto.Message.IFutureProofMessage|null);
        public requestPhoneNumberMessage?: (proto.Message.IRequestPhoneNumberMessage|null);
        public viewOnceMessageV2?: (proto.Message.IFutureProofMessage|null);
        public encReactionMessage?: (proto.Message.IEncReactionMessage|null);
        public editedMessage?: (proto.Message.IFutureProofMessage|null);
        public viewOnceMessageV2Extension?: (proto.Message.IFutureProofMessage|null);
        public pollCreationMessageV2?: (proto.Message.IPollCreationMessage|null);
        public scheduledCallCreationMessage?: (proto.Message.IScheduledCallCreationMessage|null);
        public groupMentionedMessage?: (proto.Message.IFutureProofMessage|null);
        public pinInChatMessage?: (proto.Message.IPinInChatMessage|null);
        public pollCreationMessageV3?: (proto.Message.IPollCreationMessage|null);
        public scheduledCallEditMessage?: (proto.Message.IScheduledCallEditMessage|null);
        public ptvMessage?: (proto.Message.IVideoMessage|null);
        public botInvokeMessage?: (proto.Message.IFutureProofMessage|null);
        public callLogMesssage?: (proto.Message.ICallLogMessage|null);
        public messageHistoryBundle?: (proto.Message.IMessageHistoryBundle|null);
        public encCommentMessage?: (proto.Message.IEncCommentMessage|null);
        public bcallMessage?: (proto.Message.IBCallMessage|null);
        public lottieStickerMessage?: (proto.Message.IFutureProofMessage|null);
        public eventMessage?: (proto.Message.IEventMessage|null);
        public encEventResponseMessage?: (proto.Message.IEncEventResponseMessage|null);
        public commentMessage?: (proto.Message.ICommentMessage|null);
        public newsletterAdminInviteMessage?: (proto.Message.INewsletterAdminInviteMessage|null);
        public placeholderMessage?: (proto.Message.IPlaceholderMessage|null);
        public secretEncryptedMessage?: (proto.Message.ISecretEncryptedMessage|null);
        public albumMessage?: (proto.Message.IAlbumMessage|null);
        public eventCoverImage?: (proto.Message.IFutureProofMessage|null);
        public stickerPackMessage?: (proto.Message.IStickerPackMessage|null);
        public statusMentionMessage?: (proto.Message.IFutureProofMessage|null);
        public pollResultSnapshotMessage?: (proto.Message.IPollResultSnapshotMessage|null);
        public pollCreationOptionImageMessage?: (proto.Message.IFutureProofMessage|null);
        public associatedChildMessage?: (proto.Message.IFutureProofMessage|null);
        public groupStatusMentionMessage?: (proto.Message.IFutureProofMessage|null);
        public pollCreationMessageV4?: (proto.Message.IFutureProofMessage|null);
        public pollCreationMessageV5?: (proto.Message.IFutureProofMessage|null);
        public statusAddYours?: (proto.Message.IFutureProofMessage|null);
        public groupStatusMessage?: (proto.Message.IFutureProofMessage|null);
        public richResponseMessage?: (proto.IAIRichResponseMessage|null);
        public statusNotificationMessage?: (proto.Message.IStatusNotificationMessage|null);
        public limitSharingMessage?: (proto.Message.IFutureProofMessage|null);
        public botTaskMessage?: (proto.Message.IFutureProofMessage|null);
        public questionMessage?: (proto.Message.IFutureProofMessage|null);
        public messageHistoryNotice?: (proto.Message.IMessageHistoryNotice|null);
        public static create(properties?: proto.IMessage): proto.Message;
        public static encode(m: proto.IMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Message {

        interface IAlbumMessage {
            expectedImageCount?: (number|null);
            expectedVideoCount?: (number|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class AlbumMessage implements IAlbumMessage {
            constructor(p?: proto.Message.IAlbumMessage);
            public expectedImageCount: number;
            public expectedVideoCount: number;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IAlbumMessage): proto.Message.AlbumMessage;
            public static encode(m: proto.Message.IAlbumMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AlbumMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateFatalExceptionNotification {
            collectionNames?: (string[]|null);
            timestamp?: (number|Long|null);
        }

        class AppStateFatalExceptionNotification implements IAppStateFatalExceptionNotification {
            constructor(p?: proto.Message.IAppStateFatalExceptionNotification);
            public collectionNames: string[];
            public timestamp: (number|Long);
            public static create(properties?: proto.Message.IAppStateFatalExceptionNotification): proto.Message.AppStateFatalExceptionNotification;
            public static encode(m: proto.Message.IAppStateFatalExceptionNotification, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateFatalExceptionNotification;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKey {
            keyId?: (proto.Message.IAppStateSyncKeyId|null);
            keyData?: (proto.Message.IAppStateSyncKeyData|null);
        }

        class AppStateSyncKey implements IAppStateSyncKey {
            constructor(p?: proto.Message.IAppStateSyncKey);
            public keyId?: (proto.Message.IAppStateSyncKeyId|null);
            public keyData?: (proto.Message.IAppStateSyncKeyData|null);
            public static create(properties?: proto.Message.IAppStateSyncKey): proto.Message.AppStateSyncKey;
            public static encode(m: proto.Message.IAppStateSyncKey, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKey;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKeyData {
            keyData?: (Uint8Array|null);
            fingerprint?: (proto.Message.IAppStateSyncKeyFingerprint|null);
            timestamp?: (number|Long|null);
        }

        class AppStateSyncKeyData implements IAppStateSyncKeyData {
            constructor(p?: proto.Message.IAppStateSyncKeyData);
            public keyData: Uint8Array;
            public fingerprint?: (proto.Message.IAppStateSyncKeyFingerprint|null);
            public timestamp: (number|Long);
            public static create(properties?: proto.Message.IAppStateSyncKeyData): proto.Message.AppStateSyncKeyData;
            public static encode(m: proto.Message.IAppStateSyncKeyData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKeyData;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKeyFingerprint {
            rawId?: (number|null);
            currentIndex?: (number|null);
            deviceIndexes?: (number[]|null);
        }

        class AppStateSyncKeyFingerprint implements IAppStateSyncKeyFingerprint {
            constructor(p?: proto.Message.IAppStateSyncKeyFingerprint);
            public rawId: number;
            public currentIndex: number;
            public deviceIndexes: number[];
            public static create(properties?: proto.Message.IAppStateSyncKeyFingerprint): proto.Message.AppStateSyncKeyFingerprint;
            public static encode(m: proto.Message.IAppStateSyncKeyFingerprint, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKeyFingerprint;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKeyId {
            keyId?: (Uint8Array|null);
        }

        class AppStateSyncKeyId implements IAppStateSyncKeyId {
            constructor(p?: proto.Message.IAppStateSyncKeyId);
            public keyId: Uint8Array;
            public static create(properties?: proto.Message.IAppStateSyncKeyId): proto.Message.AppStateSyncKeyId;
            public static encode(m: proto.Message.IAppStateSyncKeyId, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKeyId;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKeyRequest {
            keyIds?: (proto.Message.IAppStateSyncKeyId[]|null);
        }

        class AppStateSyncKeyRequest implements IAppStateSyncKeyRequest {
            constructor(p?: proto.Message.IAppStateSyncKeyRequest);
            public keyIds: proto.Message.IAppStateSyncKeyId[];
            public static create(properties?: proto.Message.IAppStateSyncKeyRequest): proto.Message.AppStateSyncKeyRequest;
            public static encode(m: proto.Message.IAppStateSyncKeyRequest, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKeyRequest;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAppStateSyncKeyShare {
            keys?: (proto.Message.IAppStateSyncKey[]|null);
        }

        class AppStateSyncKeyShare implements IAppStateSyncKeyShare {
            constructor(p?: proto.Message.IAppStateSyncKeyShare);
            public keys: proto.Message.IAppStateSyncKey[];
            public static create(properties?: proto.Message.IAppStateSyncKeyShare): proto.Message.AppStateSyncKeyShare;
            public static encode(m: proto.Message.IAppStateSyncKeyShare, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AppStateSyncKeyShare;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAudioMessage {
            url?: (string|null);
            mimetype?: (string|null);
            fileSha256?: (Uint8Array|null);
            fileLength?: (number|Long|null);
            seconds?: (number|null);
            ptt?: (boolean|null);
            mediaKey?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            directPath?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            contextInfo?: (proto.IContextInfo|null);
            streamingSidecar?: (Uint8Array|null);
            waveform?: (Uint8Array|null);
            backgroundArgb?: (number|null);
            viewOnce?: (boolean|null);
            accessibilityLabel?: (string|null);
        }

        class AudioMessage implements IAudioMessage {
            constructor(p?: proto.Message.IAudioMessage);
            public url: string;
            public mimetype: string;
            public fileSha256: Uint8Array;
            public fileLength: (number|Long);
            public seconds: number;
            public ptt: boolean;
            public mediaKey: Uint8Array;
            public fileEncSha256: Uint8Array;
            public directPath: string;
            public mediaKeyTimestamp: (number|Long);
            public contextInfo?: (proto.IContextInfo|null);
            public streamingSidecar: Uint8Array;
            public waveform: Uint8Array;
            public backgroundArgb: number;
            public viewOnce: boolean;
            public accessibilityLabel: string;
            public static create(properties?: proto.Message.IAudioMessage): proto.Message.AudioMessage;
            public static encode(m: proto.Message.IAudioMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.AudioMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IBCallMessage {
            sessionId?: (string|null);
            mediaType?: (proto.Message.BCallMessage.MediaType|null);
            masterKey?: (Uint8Array|null);
            caption?: (string|null);
        }

        class BCallMessage implements IBCallMessage {
            constructor(p?: proto.Message.IBCallMessage);
            public sessionId: string;
            public mediaType: proto.Message.BCallMessage.MediaType;
            public masterKey: Uint8Array;
            public caption: string;
            public static create(properties?: proto.Message.IBCallMessage): proto.Message.BCallMessage;
            public static encode(m: proto.Message.IBCallMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.BCallMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BCallMessage {

            enum MediaType {
                UNKNOWN = 0,
                AUDIO = 1,
                VIDEO = 2
            }
        }

        interface IBotFeedbackMessage {
            messageKey?: (proto.IMessageKey|null);
            kind?: (proto.Message.BotFeedbackMessage.BotFeedbackKind|null);
            text?: (string|null);
            kindNegative?: (number|Long|null);
            kindPositive?: (number|Long|null);
            kindReport?: (proto.Message.BotFeedbackMessage.ReportKind|null);
        }

        class BotFeedbackMessage implements IBotFeedbackMessage {
            constructor(p?: proto.Message.IBotFeedbackMessage);
            public messageKey?: (proto.IMessageKey|null);
            public kind: proto.Message.BotFeedbackMessage.BotFeedbackKind;
            public text: string;
            public kindNegative: (number|Long);
            public kindPositive: (number|Long);
            public kindReport: proto.Message.BotFeedbackMessage.ReportKind;
            public static create(properties?: proto.Message.IBotFeedbackMessage): proto.Message.BotFeedbackMessage;
            public static encode(m: proto.Message.IBotFeedbackMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.BotFeedbackMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BotFeedbackMessage {

            enum BotFeedbackKind {
                BOT_FEEDBACK_POSITIVE = 0,
                BOT_FEEDBACK_NEGATIVE_GENERIC = 1,
                BOT_FEEDBACK_NEGATIVE_HELPFUL = 2,
                BOT_FEEDBACK_NEGATIVE_INTERESTING = 3,
                BOT_FEEDBACK_NEGATIVE_ACCURATE = 4,
                BOT_FEEDBACK_NEGATIVE_SAFE = 5,
                BOT_FEEDBACK_NEGATIVE_OTHER = 6,
                BOT_FEEDBACK_NEGATIVE_REFUSED = 7,
                BOT_FEEDBACK_NEGATIVE_NOT_VISUALLY_APPEALING = 8,
                BOT_FEEDBACK_NEGATIVE_NOT_RELEVANT_TO_TEXT = 9,
                BOT_FEEDBACK_NEGATIVE_PERSONALIZED = 10,
                BOT_FEEDBACK_NEGATIVE_CLARITY = 11,
                BOT_FEEDBACK_NEGATIVE_DOESNT_LOOK_LIKE_THE_PERSON = 12
            }

            enum BotFeedbackKindMultipleNegative {
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_GENERIC = 1,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_HELPFUL = 2,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_INTERESTING = 4,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_ACCURATE = 8,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_SAFE = 16,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_OTHER = 32,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_REFUSED = 64,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_NOT_VISUALLY_APPEALING = 128,
                BOT_FEEDBACK_MULTIPLE_NEGATIVE_NOT_RELEVANT_TO_TEXT = 256
            }

            enum BotFeedbackKindMultiplePositive {
                BOT_FEEDBACK_MULTIPLE_POSITIVE_GENERIC = 1
            }

            enum ReportKind {
                GENERIC = 0
            }
        }

        interface IButtonsMessage {
            contentText?: (string|null);
            footerText?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            buttons?: (proto.Message.ButtonsMessage.IButton[]|null);
            headerType?: (proto.Message.ButtonsMessage.HeaderType|null);
            text?: (string|null);
            documentMessage?: (proto.Message.IDocumentMessage|null);
            imageMessage?: (proto.Message.IImageMessage|null);
            videoMessage?: (proto.Message.IVideoMessage|null);
            locationMessage?: (proto.Message.ILocationMessage|null);
        }

        class ButtonsMessage implements IButtonsMessage {
            constructor(p?: proto.Message.IButtonsMessage);
            public contentText: string;
            public footerText: string;
            public contextInfo?: (proto.IContextInfo|null);
            public buttons: proto.Message.ButtonsMessage.IButton[];
            public headerType: proto.Message.ButtonsMessage.HeaderType;
            public text?: (string|null);
            public documentMessage?: (proto.Message.IDocumentMessage|null);
            public imageMessage?: (proto.Message.IImageMessage|null);
            public videoMessage?: (proto.Message.IVideoMessage|null);
            public locationMessage?: (proto.Message.ILocationMessage|null);
            public header?: ("text"|"documentMessage"|"imageMessage"|"videoMessage"|"locationMessage");
            public static create(properties?: proto.Message.IButtonsMessage): proto.Message.ButtonsMessage;
            public static encode(m: proto.Message.IButtonsMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ButtonsMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ButtonsMessage {

            interface IButton {
                buttonId?: (string|null);
                buttonText?: (proto.Message.ButtonsMessage.Button.IButtonText|null);
                type?: (proto.Message.ButtonsMessage.Button.Type|null);
                nativeFlowInfo?: (proto.Message.ButtonsMessage.Button.INativeFlowInfo|null);
            }

            class Button implements IButton {
                constructor(p?: proto.Message.ButtonsMessage.IButton);
                public buttonId: string;
                public buttonText?: (proto.Message.ButtonsMessage.Button.IButtonText|null);
                public type: proto.Message.ButtonsMessage.Button.Type;
                public nativeFlowInfo?: (proto.Message.ButtonsMessage.Button.INativeFlowInfo|null);
                public static create(properties?: proto.Message.ButtonsMessage.IButton): proto.Message.ButtonsMessage.Button;
                public static encode(m: proto.Message.ButtonsMessage.IButton, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ButtonsMessage.Button;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Button {

                interface IButtonText {
                    displayText?: (string|null);
                }

                class ButtonText implements IButtonText {
                    constructor(p?: proto.Message.ButtonsMessage.Button.IButtonText);
                    public displayText: string;
                    public static create(properties?: proto.Message.ButtonsMessage.Button.IButtonText): proto.Message.ButtonsMessage.Button.ButtonText;
                    public static encode(m: proto.Message.ButtonsMessage.Button.IButtonText, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ButtonsMessage.Button.ButtonText;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                interface INativeFlowInfo {
                    name?: (string|null);
                    paramsJson?: (string|null);
                }

                class NativeFlowInfo implements INativeFlowInfo {
                    constructor(p?: proto.Message.ButtonsMessage.Button.INativeFlowInfo);
                    public name: string;
                    public paramsJson: string;
                    public static create(properties?: proto.Message.ButtonsMessage.Button.INativeFlowInfo): proto.Message.ButtonsMessage.Button.NativeFlowInfo;
                    public static encode(m: proto.Message.ButtonsMessage.Button.INativeFlowInfo, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ButtonsMessage.Button.NativeFlowInfo;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                enum Type {
                    UNKNOWN = 0,
                    RESPONSE = 1,
                    NATIVE_FLOW = 2
                }
            }

            enum HeaderType {
                UNKNOWN = 0,
                EMPTY = 1,
                TEXT = 2,
                DOCUMENT = 3,
                IMAGE = 4,
                VIDEO = 5,
                LOCATION = 6
            }
        }

        interface IButtonsResponseMessage {
            selectedButtonId?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            type?: (proto.Message.ButtonsResponseMessage.Type|null);
            selectedDisplayText?: (string|null);
        }

        class ButtonsResponseMessage implements IButtonsResponseMessage {
            constructor(p?: proto.Message.IButtonsResponseMessage);
            public selectedButtonId: string;
            public contextInfo?: (proto.IContextInfo|null);
            public type: proto.Message.ButtonsResponseMessage.Type;
            public selectedDisplayText?: (string|null);
            public response?: "selectedDisplayText";
            public static create(properties?: proto.Message.IButtonsResponseMessage): proto.Message.ButtonsResponseMessage;
            public static encode(m: proto.Message.IButtonsResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ButtonsResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ButtonsResponseMessage {

            enum Type {
                UNKNOWN = 0,
                DISPLAY_TEXT = 1
            }
        }

        interface ICall {
            callKey?: (Uint8Array|null);
            conversionSource?: (string|null);
            conversionData?: (Uint8Array|null);
            conversionDelaySeconds?: (number|null);
            ctwaSignals?: (string|null);
            ctwaPayload?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class Call implements ICall {
            constructor(p?: proto.Message.ICall);
            public callKey: Uint8Array;
            public conversionSource: string;
            public conversionData: Uint8Array;
            public conversionDelaySeconds: number;
            public ctwaSignals: string;
            public ctwaPayload: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.ICall): proto.Message.Call;
            public static encode(m: proto.Message.ICall, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.Call;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICallLogMessage {
            isVideo?: (boolean|null);
            callOutcome?: (proto.Message.CallLogMessage.CallOutcome|null);
            durationSecs?: (number|Long|null);
            callType?: (proto.Message.CallLogMessage.CallType|null);
            participants?: (proto.Message.CallLogMessage.ICallParticipant[]|null);
        }

        class CallLogMessage implements ICallLogMessage {
            constructor(p?: proto.Message.ICallLogMessage);
            public isVideo: boolean;
            public callOutcome: proto.Message.CallLogMessage.CallOutcome;
            public durationSecs: (number|Long);
            public callType: proto.Message.CallLogMessage.CallType;
            public participants: proto.Message.CallLogMessage.ICallParticipant[];
            public static create(properties?: proto.Message.ICallLogMessage): proto.Message.CallLogMessage;
            public static encode(m: proto.Message.ICallLogMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CallLogMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace CallLogMessage {

            enum CallOutcome {
                CONNECTED = 0,
                MISSED = 1,
                FAILED = 2,
                REJECTED = 3,
                ACCEPTED_ELSEWHERE = 4,
                ONGOING = 5,
                SILENCED_BY_DND = 6,
                SILENCED_UNKNOWN_CALLER = 7
            }

            interface ICallParticipant {
                jid?: (string|null);
                callOutcome?: (proto.Message.CallLogMessage.CallOutcome|null);
            }

            class CallParticipant implements ICallParticipant {
                constructor(p?: proto.Message.CallLogMessage.ICallParticipant);
                public jid: string;
                public callOutcome: proto.Message.CallLogMessage.CallOutcome;
                public static create(properties?: proto.Message.CallLogMessage.ICallParticipant): proto.Message.CallLogMessage.CallParticipant;
                public static encode(m: proto.Message.CallLogMessage.ICallParticipant, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CallLogMessage.CallParticipant;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum CallType {
                REGULAR = 0,
                SCHEDULED_CALL = 1,
                VOICE_CHAT = 2
            }
        }

        interface ICancelPaymentRequestMessage {
            key?: (proto.IMessageKey|null);
        }

        class CancelPaymentRequestMessage implements ICancelPaymentRequestMessage {
            constructor(p?: proto.Message.ICancelPaymentRequestMessage);
            public key?: (proto.IMessageKey|null);
            public static create(properties?: proto.Message.ICancelPaymentRequestMessage): proto.Message.CancelPaymentRequestMessage;
            public static encode(m: proto.Message.ICancelPaymentRequestMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CancelPaymentRequestMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IChat {
            displayName?: (string|null);
            id?: (string|null);
        }

        class Chat implements IChat {
            constructor(p?: proto.Message.IChat);
            public displayName: string;
            public id: string;
            public static create(properties?: proto.Message.IChat): proto.Message.Chat;
            public static encode(m: proto.Message.IChat, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.Chat;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICloudAPIThreadControlNotification {
            status?: (proto.Message.CloudAPIThreadControlNotification.CloudAPIThreadControl|null);
            senderNotificationTimestampMs?: (number|Long|null);
            consumerLid?: (string|null);
            consumerPhoneNumber?: (string|null);
            notificationContent?: (proto.Message.CloudAPIThreadControlNotification.ICloudAPIThreadControlNotificationContent|null);
        }

        class CloudAPIThreadControlNotification implements ICloudAPIThreadControlNotification {
            constructor(p?: proto.Message.ICloudAPIThreadControlNotification);
            public status: proto.Message.CloudAPIThreadControlNotification.CloudAPIThreadControl;
            public senderNotificationTimestampMs: (number|Long);
            public consumerLid: string;
            public consumerPhoneNumber: string;
            public notificationContent?: (proto.Message.CloudAPIThreadControlNotification.ICloudAPIThreadControlNotificationContent|null);
            public static create(properties?: proto.Message.ICloudAPIThreadControlNotification): proto.Message.CloudAPIThreadControlNotification;
            public static encode(m: proto.Message.ICloudAPIThreadControlNotification, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CloudAPIThreadControlNotification;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace CloudAPIThreadControlNotification {

            enum CloudAPIThreadControl {
                UNKNOWN = 0,
                CONTROL_PASSED = 1,
                CONTROL_TAKEN = 2
            }

            interface ICloudAPIThreadControlNotificationContent {
                handoffNotificationText?: (string|null);
                extraJson?: (string|null);
            }

            class CloudAPIThreadControlNotificationContent implements ICloudAPIThreadControlNotificationContent {
                constructor(p?: proto.Message.CloudAPIThreadControlNotification.ICloudAPIThreadControlNotificationContent);
                public handoffNotificationText: string;
                public extraJson: string;
                public static create(properties?: proto.Message.CloudAPIThreadControlNotification.ICloudAPIThreadControlNotificationContent): proto.Message.CloudAPIThreadControlNotification.CloudAPIThreadControlNotificationContent;
                public static encode(m: proto.Message.CloudAPIThreadControlNotification.ICloudAPIThreadControlNotificationContent, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CloudAPIThreadControlNotification.CloudAPIThreadControlNotificationContent;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface ICommentMessage {
            message?: (proto.IMessage|null);
            targetMessageKey?: (proto.IMessageKey|null);
        }

        class CommentMessage implements ICommentMessage {
            constructor(p?: proto.Message.ICommentMessage);
            public message?: (proto.IMessage|null);
            public targetMessageKey?: (proto.IMessageKey|null);
            public static create(properties?: proto.Message.ICommentMessage): proto.Message.CommentMessage;
            public static encode(m: proto.Message.ICommentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.CommentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IContactMessage {
            displayName?: (string|null);
            vcard?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class ContactMessage implements IContactMessage {
            constructor(p?: proto.Message.IContactMessage);
            public displayName: string;
            public vcard: string;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IContactMessage): proto.Message.ContactMessage;
            public static encode(m: proto.Message.IContactMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ContactMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IContactsArrayMessage {
            displayName?: (string|null);
            contacts?: (proto.Message.IContactMessage[]|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class ContactsArrayMessage implements IContactsArrayMessage {
            constructor(p?: proto.Message.IContactsArrayMessage);
            public displayName: string;
            public contacts: proto.Message.IContactMessage[];
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IContactsArrayMessage): proto.Message.ContactsArrayMessage;
            public static encode(m: proto.Message.IContactsArrayMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ContactsArrayMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDeclinePaymentRequestMessage {
            key?: (proto.IMessageKey|null);
        }

        class DeclinePaymentRequestMessage implements IDeclinePaymentRequestMessage {
            constructor(p?: proto.Message.IDeclinePaymentRequestMessage);
            public key?: (proto.IMessageKey|null);
            public static create(properties?: proto.Message.IDeclinePaymentRequestMessage): proto.Message.DeclinePaymentRequestMessage;
            public static encode(m: proto.Message.IDeclinePaymentRequestMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.DeclinePaymentRequestMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDeviceSentMessage {
            destinationJid?: (string|null);
            message?: (proto.IMessage|null);
            phash?: (string|null);
        }

        class DeviceSentMessage implements IDeviceSentMessage {
            constructor(p?: proto.Message.IDeviceSentMessage);
            public destinationJid: string;
            public message?: (proto.IMessage|null);
            public phash: string;
            public static create(properties?: proto.Message.IDeviceSentMessage): proto.Message.DeviceSentMessage;
            public static encode(m: proto.Message.IDeviceSentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.DeviceSentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDocumentMessage {
            url?: (string|null);
            mimetype?: (string|null);
            title?: (string|null);
            fileSha256?: (Uint8Array|null);
            fileLength?: (number|Long|null);
            pageCount?: (number|null);
            mediaKey?: (Uint8Array|null);
            fileName?: (string|null);
            fileEncSha256?: (Uint8Array|null);
            directPath?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            contactVcard?: (boolean|null);
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
            thumbnailHeight?: (number|null);
            thumbnailWidth?: (number|null);
            caption?: (string|null);
            accessibilityLabel?: (string|null);
        }

        class DocumentMessage implements IDocumentMessage {
            constructor(p?: proto.Message.IDocumentMessage);
            public url: string;
            public mimetype: string;
            public title: string;
            public fileSha256: Uint8Array;
            public fileLength: (number|Long);
            public pageCount: number;
            public mediaKey: Uint8Array;
            public fileName: string;
            public fileEncSha256: Uint8Array;
            public directPath: string;
            public mediaKeyTimestamp: (number|Long);
            public contactVcard: boolean;
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public thumbnailHeight: number;
            public thumbnailWidth: number;
            public caption: string;
            public accessibilityLabel: string;
            public static create(properties?: proto.Message.IDocumentMessage): proto.Message.DocumentMessage;
            public static encode(m: proto.Message.IDocumentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.DocumentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IEncCommentMessage {
            targetMessageKey?: (proto.IMessageKey|null);
            encPayload?: (Uint8Array|null);
            encIv?: (Uint8Array|null);
        }

        class EncCommentMessage implements IEncCommentMessage {
            constructor(p?: proto.Message.IEncCommentMessage);
            public targetMessageKey?: (proto.IMessageKey|null);
            public encPayload: Uint8Array;
            public encIv: Uint8Array;
            public static create(properties?: proto.Message.IEncCommentMessage): proto.Message.EncCommentMessage;
            public static encode(m: proto.Message.IEncCommentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.EncCommentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IEncEventResponseMessage {
            eventCreationMessageKey?: (proto.IMessageKey|null);
            encPayload?: (Uint8Array|null);
            encIv?: (Uint8Array|null);
        }

        class EncEventResponseMessage implements IEncEventResponseMessage {
            constructor(p?: proto.Message.IEncEventResponseMessage);
            public eventCreationMessageKey?: (proto.IMessageKey|null);
            public encPayload: Uint8Array;
            public encIv: Uint8Array;
            public static create(properties?: proto.Message.IEncEventResponseMessage): proto.Message.EncEventResponseMessage;
            public static encode(m: proto.Message.IEncEventResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.EncEventResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IEncReactionMessage {
            targetMessageKey?: (proto.IMessageKey|null);
            encPayload?: (Uint8Array|null);
            encIv?: (Uint8Array|null);
        }

        class EncReactionMessage implements IEncReactionMessage {
            constructor(p?: proto.Message.IEncReactionMessage);
            public targetMessageKey?: (proto.IMessageKey|null);
            public encPayload: Uint8Array;
            public encIv: Uint8Array;
            public static create(properties?: proto.Message.IEncReactionMessage): proto.Message.EncReactionMessage;
            public static encode(m: proto.Message.IEncReactionMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.EncReactionMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IEventMessage {
            contextInfo?: (proto.IContextInfo|null);
            isCanceled?: (boolean|null);
            name?: (string|null);
            description?: (string|null);
            location?: (proto.Message.ILocationMessage|null);
            joinLink?: (string|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
            extraGuestsAllowed?: (boolean|null);
            isScheduleCall?: (boolean|null);
        }

        class EventMessage implements IEventMessage {
            constructor(p?: proto.Message.IEventMessage);
            public contextInfo?: (proto.IContextInfo|null);
            public isCanceled: boolean;
            public name: string;
            public description: string;
            public location?: (proto.Message.ILocationMessage|null);
            public joinLink: string;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public extraGuestsAllowed: boolean;
            public isScheduleCall: boolean;
            public static create(properties?: proto.Message.IEventMessage): proto.Message.EventMessage;
            public static encode(m: proto.Message.IEventMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.EventMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IEventResponseMessage {
            response?: (proto.Message.EventResponseMessage.EventResponseType|null);
            timestampMs?: (number|Long|null);
            extraGuestCount?: (number|null);
        }

        class EventResponseMessage implements IEventResponseMessage {
            constructor(p?: proto.Message.IEventResponseMessage);
            public response: proto.Message.EventResponseMessage.EventResponseType;
            public timestampMs: (number|Long);
            public extraGuestCount: number;
            public static create(properties?: proto.Message.IEventResponseMessage): proto.Message.EventResponseMessage;
            public static encode(m: proto.Message.IEventResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.EventResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace EventResponseMessage {

            enum EventResponseType {
                UNKNOWN = 0,
                GOING = 1,
                NOT_GOING = 2,
                MAYBE = 3
            }
        }

        interface IExtendedTextMessage {
            text?: (string|null);
            matchedText?: (string|null);
            description?: (string|null);
            title?: (string|null);
            textArgb?: (number|null);
            backgroundArgb?: (number|null);
            font?: (proto.Message.ExtendedTextMessage.FontType|null);
            previewType?: (proto.Message.ExtendedTextMessage.PreviewType|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
            doNotPlayInline?: (boolean|null);
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            mediaKeyTimestamp?: (number|Long|null);
            thumbnailHeight?: (number|null);
            thumbnailWidth?: (number|null);
            inviteLinkGroupType?: (proto.Message.ExtendedTextMessage.InviteLinkGroupType|null);
            inviteLinkParentGroupSubjectV2?: (string|null);
            inviteLinkParentGroupThumbnailV2?: (Uint8Array|null);
            inviteLinkGroupTypeV2?: (proto.Message.ExtendedTextMessage.InviteLinkGroupType|null);
            viewOnce?: (boolean|null);
            videoHeight?: (number|null);
            videoWidth?: (number|null);
            faviconMMSMetadata?: (proto.Message.IMMSThumbnailMetadata|null);
            linkPreviewMetadata?: (proto.Message.ILinkPreviewMetadata|null);
            paymentLinkMetadata?: (proto.Message.IPaymentLinkMetadata|null);
        }

        class ExtendedTextMessage implements IExtendedTextMessage {
            constructor(p?: proto.Message.IExtendedTextMessage);
            public text: string;
            public matchedText: string;
            public description: string;
            public title: string;
            public textArgb: number;
            public backgroundArgb: number;
            public font: proto.Message.ExtendedTextMessage.FontType;
            public previewType: proto.Message.ExtendedTextMessage.PreviewType;
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public doNotPlayInline: boolean;
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public mediaKeyTimestamp: (number|Long);
            public thumbnailHeight: number;
            public thumbnailWidth: number;
            public inviteLinkGroupType: proto.Message.ExtendedTextMessage.InviteLinkGroupType;
            public inviteLinkParentGroupSubjectV2: string;
            public inviteLinkParentGroupThumbnailV2: Uint8Array;
            public inviteLinkGroupTypeV2: proto.Message.ExtendedTextMessage.InviteLinkGroupType;
            public viewOnce: boolean;
            public videoHeight: number;
            public videoWidth: number;
            public faviconMMSMetadata?: (proto.Message.IMMSThumbnailMetadata|null);
            public linkPreviewMetadata?: (proto.Message.ILinkPreviewMetadata|null);
            public paymentLinkMetadata?: (proto.Message.IPaymentLinkMetadata|null);
            public static create(properties?: proto.Message.IExtendedTextMessage): proto.Message.ExtendedTextMessage;
            public static encode(m: proto.Message.IExtendedTextMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ExtendedTextMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ExtendedTextMessage {

            enum FontType {
                SYSTEM = 0,
                SYSTEM_TEXT = 1,
                FB_SCRIPT = 2,
                SYSTEM_BOLD = 6,
                MORNINGBREEZE_REGULAR = 7,
                CALISTOGA_REGULAR = 8,
                EXO2_EXTRABOLD = 9,
                COURIERPRIME_BOLD = 10
            }

            enum InviteLinkGroupType {
                DEFAULT = 0,
                PARENT = 1,
                SUB = 2,
                DEFAULT_SUB = 3
            }

            enum PreviewType {
                NONE = 0,
                VIDEO = 1,
                PLACEHOLDER = 4,
                IMAGE = 5,
                PAYMENT_LINKS = 6,
                PROFILE = 7
            }
        }

        interface IFullHistorySyncOnDemandRequestMetadata {
            requestId?: (string|null);
        }

        class FullHistorySyncOnDemandRequestMetadata implements IFullHistorySyncOnDemandRequestMetadata {
            constructor(p?: proto.Message.IFullHistorySyncOnDemandRequestMetadata);
            public requestId: string;
            public static create(properties?: proto.Message.IFullHistorySyncOnDemandRequestMetadata): proto.Message.FullHistorySyncOnDemandRequestMetadata;
            public static encode(m: proto.Message.IFullHistorySyncOnDemandRequestMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.FullHistorySyncOnDemandRequestMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IFutureProofMessage {
            message?: (proto.IMessage|null);
        }

        class FutureProofMessage implements IFutureProofMessage {
            constructor(p?: proto.Message.IFutureProofMessage);
            public message?: (proto.IMessage|null);
            public static create(properties?: proto.Message.IFutureProofMessage): proto.Message.FutureProofMessage;
            public static encode(m: proto.Message.IFutureProofMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.FutureProofMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IGroupInviteMessage {
            groupJid?: (string|null);
            inviteCode?: (string|null);
            inviteExpiration?: (number|Long|null);
            groupName?: (string|null);
            jpegThumbnail?: (Uint8Array|null);
            caption?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            groupType?: (proto.Message.GroupInviteMessage.GroupType|null);
        }

        class GroupInviteMessage implements IGroupInviteMessage {
            constructor(p?: proto.Message.IGroupInviteMessage);
            public groupJid: string;
            public inviteCode: string;
            public inviteExpiration: (number|Long);
            public groupName: string;
            public jpegThumbnail: Uint8Array;
            public caption: string;
            public contextInfo?: (proto.IContextInfo|null);
            public groupType: proto.Message.GroupInviteMessage.GroupType;
            public static create(properties?: proto.Message.IGroupInviteMessage): proto.Message.GroupInviteMessage;
            public static encode(m: proto.Message.IGroupInviteMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.GroupInviteMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GroupInviteMessage {

            enum GroupType {
                DEFAULT = 0,
                PARENT = 1
            }
        }

        interface IHighlyStructuredMessage {
            namespace?: (string|null);
            elementName?: (string|null);
            params?: (string[]|null);
            fallbackLg?: (string|null);
            fallbackLc?: (string|null);
            localizableParams?: (proto.Message.HighlyStructuredMessage.IHSMLocalizableParameter[]|null);
            deterministicLg?: (string|null);
            deterministicLc?: (string|null);
            hydratedHsm?: (proto.Message.ITemplateMessage|null);
        }

        class HighlyStructuredMessage implements IHighlyStructuredMessage {
            constructor(p?: proto.Message.IHighlyStructuredMessage);
            public namespace: string;
            public elementName: string;
            public params: string[];
            public fallbackLg: string;
            public fallbackLc: string;
            public localizableParams: proto.Message.HighlyStructuredMessage.IHSMLocalizableParameter[];
            public deterministicLg: string;
            public deterministicLc: string;
            public hydratedHsm?: (proto.Message.ITemplateMessage|null);
            public static create(properties?: proto.Message.IHighlyStructuredMessage): proto.Message.HighlyStructuredMessage;
            public static encode(m: proto.Message.IHighlyStructuredMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace HighlyStructuredMessage {

            interface IHSMLocalizableParameter {
                "default"?: (string|null);
                currency?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMCurrency|null);
                dateTime?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMDateTime|null);
            }

            class HSMLocalizableParameter implements IHSMLocalizableParameter {
                constructor(p?: proto.Message.HighlyStructuredMessage.IHSMLocalizableParameter);
                public default: string;
                public currency?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMCurrency|null);
                public dateTime?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMDateTime|null);
                public paramOneof?: ("currency"|"dateTime");
                public static create(properties?: proto.Message.HighlyStructuredMessage.IHSMLocalizableParameter): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter;
                public static encode(m: proto.Message.HighlyStructuredMessage.IHSMLocalizableParameter, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace HSMLocalizableParameter {

                interface IHSMCurrency {
                    currencyCode?: (string|null);
                    amount1000?: (number|Long|null);
                }

                class HSMCurrency implements IHSMCurrency {
                    constructor(p?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMCurrency);
                    public currencyCode: string;
                    public amount1000: (number|Long);
                    public static create(properties?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMCurrency): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMCurrency;
                    public static encode(m: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMCurrency, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMCurrency;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                interface IHSMDateTime {
                    component?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeComponent|null);
                    unixEpoch?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeUnixEpoch|null);
                }

                class HSMDateTime implements IHSMDateTime {
                    constructor(p?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMDateTime);
                    public component?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeComponent|null);
                    public unixEpoch?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeUnixEpoch|null);
                    public datetimeOneof?: ("component"|"unixEpoch");
                    public static create(properties?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMDateTime): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime;
                    public static encode(m: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.IHSMDateTime, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace HSMDateTime {

                    interface IHSMDateTimeComponent {
                        dayOfWeek?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent.DayOfWeekType|null);
                        year?: (number|null);
                        month?: (number|null);
                        dayOfMonth?: (number|null);
                        hour?: (number|null);
                        minute?: (number|null);
                        calendar?: (proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent.CalendarType|null);
                    }

                    class HSMDateTimeComponent implements IHSMDateTimeComponent {
                        constructor(p?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeComponent);
                        public dayOfWeek: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent.DayOfWeekType;
                        public year: number;
                        public month: number;
                        public dayOfMonth: number;
                        public hour: number;
                        public minute: number;
                        public calendar: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent.CalendarType;
                        public static create(properties?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeComponent): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent;
                        public static encode(m: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeComponent, w?: $protobuf.Writer): $protobuf.Writer;
                        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent;
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    namespace HSMDateTimeComponent {

                        enum CalendarType {
                            GREGORIAN = 1,
                            SOLAR_HIJRI = 2
                        }

                        enum DayOfWeekType {
                            MONDAY = 1,
                            TUESDAY = 2,
                            WEDNESDAY = 3,
                            THURSDAY = 4,
                            FRIDAY = 5,
                            SATURDAY = 6,
                            SUNDAY = 7
                        }
                    }

                    interface IHSMDateTimeUnixEpoch {
                        timestamp?: (number|Long|null);
                    }

                    class HSMDateTimeUnixEpoch implements IHSMDateTimeUnixEpoch {
                        constructor(p?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeUnixEpoch);
                        public timestamp: (number|Long);
                        public static create(properties?: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeUnixEpoch): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeUnixEpoch;
                        public static encode(m: proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.IHSMDateTimeUnixEpoch, w?: $protobuf.Writer): $protobuf.Writer;
                        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeUnixEpoch;
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }
        }

        interface IHistorySyncNotification {
            fileSha256?: (Uint8Array|null);
            fileLength?: (number|Long|null);
            mediaKey?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            directPath?: (string|null);
            syncType?: (proto.Message.HistorySyncNotification.HistorySyncType|null);
            chunkOrder?: (number|null);
            originalMessageId?: (string|null);
            progress?: (number|null);
            oldestMsgInChunkTimestampSec?: (number|Long|null);
            initialHistBootstrapInlinePayload?: (Uint8Array|null);
            peerDataRequestSessionId?: (string|null);
            fullHistorySyncOnDemandRequestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
            encHandle?: (string|null);
        }

        class HistorySyncNotification implements IHistorySyncNotification {
            constructor(p?: proto.Message.IHistorySyncNotification);
            public fileSha256: Uint8Array;
            public fileLength: (number|Long);
            public mediaKey: Uint8Array;
            public fileEncSha256: Uint8Array;
            public directPath: string;
            public syncType: proto.Message.HistorySyncNotification.HistorySyncType;
            public chunkOrder: number;
            public originalMessageId: string;
            public progress: number;
            public oldestMsgInChunkTimestampSec: (number|Long);
            public initialHistBootstrapInlinePayload: Uint8Array;
            public peerDataRequestSessionId: string;
            public fullHistorySyncOnDemandRequestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
            public encHandle: string;
            public static create(properties?: proto.Message.IHistorySyncNotification): proto.Message.HistorySyncNotification;
            public static encode(m: proto.Message.IHistorySyncNotification, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.HistorySyncNotification;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace HistorySyncNotification {

            enum HistorySyncType {
                INITIAL_BOOTSTRAP = 0,
                INITIAL_STATUS_V3 = 1,
                FULL = 2,
                RECENT = 3,
                PUSH_NAME = 4,
                NON_BLOCKING_DATA = 5,
                ON_DEMAND = 6,
                NO_HISTORY = 7
            }
        }

        interface IImageMessage {
            url?: (string|null);
            mimetype?: (string|null);
            caption?: (string|null);
            fileSha256?: (Uint8Array|null);
            fileLength?: (number|Long|null);
            height?: (number|null);
            width?: (number|null);
            mediaKey?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            interactiveAnnotations?: (proto.IInteractiveAnnotation[]|null);
            directPath?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
            firstScanSidecar?: (Uint8Array|null);
            firstScanLength?: (number|null);
            experimentGroupId?: (number|null);
            scansSidecar?: (Uint8Array|null);
            scanLengths?: (number[]|null);
            midQualityFileSha256?: (Uint8Array|null);
            midQualityFileEncSha256?: (Uint8Array|null);
            viewOnce?: (boolean|null);
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            staticUrl?: (string|null);
            annotations?: (proto.IInteractiveAnnotation[]|null);
            imageSourceType?: (proto.Message.ImageMessage.ImageSourceType|null);
            accessibilityLabel?: (string|null);
        }

        class ImageMessage implements IImageMessage {
            constructor(p?: proto.Message.IImageMessage);
            public url: string;
            public mimetype: string;
            public caption: string;
            public fileSha256: Uint8Array;
            public fileLength: (number|Long);
            public height: number;
            public width: number;
            public mediaKey: Uint8Array;
            public fileEncSha256: Uint8Array;
            public interactiveAnnotations: proto.IInteractiveAnnotation[];
            public directPath: string;
            public mediaKeyTimestamp: (number|Long);
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public firstScanSidecar: Uint8Array;
            public firstScanLength: number;
            public experimentGroupId: number;
            public scansSidecar: Uint8Array;
            public scanLengths: number[];
            public midQualityFileSha256: Uint8Array;
            public midQualityFileEncSha256: Uint8Array;
            public viewOnce: boolean;
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public staticUrl: string;
            public annotations: proto.IInteractiveAnnotation[];
            public imageSourceType: proto.Message.ImageMessage.ImageSourceType;
            public accessibilityLabel: string;
            public static create(properties?: proto.Message.IImageMessage): proto.Message.ImageMessage;
            public static encode(m: proto.Message.IImageMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ImageMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ImageMessage {

            enum ImageSourceType {
                USER_IMAGE = 0,
                AI_GENERATED = 1,
                AI_MODIFIED = 2,
                RASTERIZED_TEXT_STATUS = 3
            }
        }

        interface IInitialSecurityNotificationSettingSync {
            securityNotificationEnabled?: (boolean|null);
        }

        class InitialSecurityNotificationSettingSync implements IInitialSecurityNotificationSettingSync {
            constructor(p?: proto.Message.IInitialSecurityNotificationSettingSync);
            public securityNotificationEnabled: boolean;
            public static create(properties?: proto.Message.IInitialSecurityNotificationSettingSync): proto.Message.InitialSecurityNotificationSettingSync;
            public static encode(m: proto.Message.IInitialSecurityNotificationSettingSync, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InitialSecurityNotificationSettingSync;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IInteractiveMessage {
            header?: (proto.Message.InteractiveMessage.IHeader|null);
            body?: (proto.Message.InteractiveMessage.IBody|null);
            footer?: (proto.Message.InteractiveMessage.IFooter|null);
            contextInfo?: (proto.IContextInfo|null);
            urlTrackingMap?: (proto.IUrlTrackingMap|null);
            shopStorefrontMessage?: (proto.Message.InteractiveMessage.IShopMessage|null);
            collectionMessage?: (proto.Message.InteractiveMessage.ICollectionMessage|null);
            nativeFlowMessage?: (proto.Message.InteractiveMessage.INativeFlowMessage|null);
            carouselMessage?: (proto.Message.InteractiveMessage.ICarouselMessage|null);
        }

        class InteractiveMessage implements IInteractiveMessage {
            constructor(p?: proto.Message.IInteractiveMessage);
            public header?: (proto.Message.InteractiveMessage.IHeader|null);
            public body?: (proto.Message.InteractiveMessage.IBody|null);
            public footer?: (proto.Message.InteractiveMessage.IFooter|null);
            public contextInfo?: (proto.IContextInfo|null);
            public urlTrackingMap?: (proto.IUrlTrackingMap|null);
            public shopStorefrontMessage?: (proto.Message.InteractiveMessage.IShopMessage|null);
            public collectionMessage?: (proto.Message.InteractiveMessage.ICollectionMessage|null);
            public nativeFlowMessage?: (proto.Message.InteractiveMessage.INativeFlowMessage|null);
            public carouselMessage?: (proto.Message.InteractiveMessage.ICarouselMessage|null);
            public interactiveMessage?: ("shopStorefrontMessage"|"collectionMessage"|"nativeFlowMessage"|"carouselMessage");
            public static create(properties?: proto.Message.IInteractiveMessage): proto.Message.InteractiveMessage;
            public static encode(m: proto.Message.IInteractiveMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace InteractiveMessage {

            interface IBody {
                text?: (string|null);
            }

            class Body implements IBody {
                constructor(p?: proto.Message.InteractiveMessage.IBody);
                public text: string;
                public static create(properties?: proto.Message.InteractiveMessage.IBody): proto.Message.InteractiveMessage.Body;
                public static encode(m: proto.Message.InteractiveMessage.IBody, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.Body;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface ICarouselMessage {
                cards?: (proto.Message.IInteractiveMessage[]|null);
                messageVersion?: (number|null);
            }

            class CarouselMessage implements ICarouselMessage {
                constructor(p?: proto.Message.InteractiveMessage.ICarouselMessage);
                public cards: proto.Message.IInteractiveMessage[];
                public messageVersion: number;
                public static create(properties?: proto.Message.InteractiveMessage.ICarouselMessage): proto.Message.InteractiveMessage.CarouselMessage;
                public static encode(m: proto.Message.InteractiveMessage.ICarouselMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.CarouselMessage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface ICollectionMessage {
                bizJid?: (string|null);
                id?: (string|null);
                messageVersion?: (number|null);
            }

            class CollectionMessage implements ICollectionMessage {
                constructor(p?: proto.Message.InteractiveMessage.ICollectionMessage);
                public bizJid: string;
                public id: string;
                public messageVersion: number;
                public static create(properties?: proto.Message.InteractiveMessage.ICollectionMessage): proto.Message.InteractiveMessage.CollectionMessage;
                public static encode(m: proto.Message.InteractiveMessage.ICollectionMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.CollectionMessage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IFooter {
                text?: (string|null);
            }

            class Footer implements IFooter {
                constructor(p?: proto.Message.InteractiveMessage.IFooter);
                public text: string;
                public static create(properties?: proto.Message.InteractiveMessage.IFooter): proto.Message.InteractiveMessage.Footer;
                public static encode(m: proto.Message.InteractiveMessage.IFooter, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.Footer;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IHeader {
                title?: (string|null);
                subtitle?: (string|null);
                hasMediaAttachment?: (boolean|null);
                documentMessage?: (proto.Message.IDocumentMessage|null);
                imageMessage?: (proto.Message.IImageMessage|null);
                jpegThumbnail?: (Uint8Array|null);
                videoMessage?: (proto.Message.IVideoMessage|null);
                locationMessage?: (proto.Message.ILocationMessage|null);
                productMessage?: (proto.Message.IProductMessage|null);
            }

            class Header implements IHeader {
                constructor(p?: proto.Message.InteractiveMessage.IHeader);
                public title: string;
                public subtitle: string;
                public hasMediaAttachment: boolean;
                public documentMessage?: (proto.Message.IDocumentMessage|null);
                public imageMessage?: (proto.Message.IImageMessage|null);
                public jpegThumbnail?: (Uint8Array|null);
                public videoMessage?: (proto.Message.IVideoMessage|null);
                public locationMessage?: (proto.Message.ILocationMessage|null);
                public productMessage?: (proto.Message.IProductMessage|null);
                public media?: ("documentMessage"|"imageMessage"|"jpegThumbnail"|"videoMessage"|"locationMessage"|"productMessage");
                public static create(properties?: proto.Message.InteractiveMessage.IHeader): proto.Message.InteractiveMessage.Header;
                public static encode(m: proto.Message.InteractiveMessage.IHeader, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.Header;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface INativeFlowMessage {
                buttons?: (proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton[]|null);
                messageParamsJson?: (string|null);
                messageVersion?: (number|null);
            }

            class NativeFlowMessage implements INativeFlowMessage {
                constructor(p?: proto.Message.InteractiveMessage.INativeFlowMessage);
                public buttons: proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton[];
                public messageParamsJson: string;
                public messageVersion: number;
                public static create(properties?: proto.Message.InteractiveMessage.INativeFlowMessage): proto.Message.InteractiveMessage.NativeFlowMessage;
                public static encode(m: proto.Message.InteractiveMessage.INativeFlowMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.NativeFlowMessage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace NativeFlowMessage {

                interface INativeFlowButton {
                    name?: (string|null);
                    buttonParamsJson?: (string|null);
                }

                class NativeFlowButton implements INativeFlowButton {
                    constructor(p?: proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton);
                    public name: string;
                    public buttonParamsJson: string;
                    public static create(properties?: proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton): proto.Message.InteractiveMessage.NativeFlowMessage.NativeFlowButton;
                    public static encode(m: proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.NativeFlowMessage.NativeFlowButton;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }

            interface IShopMessage {
                id?: (string|null);
                surface?: (proto.Message.InteractiveMessage.ShopMessage.Surface|null);
                messageVersion?: (number|null);
            }

            class ShopMessage implements IShopMessage {
                constructor(p?: proto.Message.InteractiveMessage.IShopMessage);
                public id: string;
                public surface: proto.Message.InteractiveMessage.ShopMessage.Surface;
                public messageVersion: number;
                public static create(properties?: proto.Message.InteractiveMessage.IShopMessage): proto.Message.InteractiveMessage.ShopMessage;
                public static encode(m: proto.Message.InteractiveMessage.IShopMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveMessage.ShopMessage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace ShopMessage {

                enum Surface {
                    UNKNOWN_SURFACE = 0,
                    FB = 1,
                    IG = 2,
                    WA = 3
                }
            }
        }

        interface IInteractiveResponseMessage {
            body?: (proto.Message.InteractiveResponseMessage.IBody|null);
            contextInfo?: (proto.IContextInfo|null);
            nativeFlowResponseMessage?: (proto.Message.InteractiveResponseMessage.INativeFlowResponseMessage|null);
        }

        class InteractiveResponseMessage implements IInteractiveResponseMessage {
            constructor(p?: proto.Message.IInteractiveResponseMessage);
            public body?: (proto.Message.InteractiveResponseMessage.IBody|null);
            public contextInfo?: (proto.IContextInfo|null);
            public nativeFlowResponseMessage?: (proto.Message.InteractiveResponseMessage.INativeFlowResponseMessage|null);
            public interactiveResponseMessage?: "nativeFlowResponseMessage";
            public static create(properties?: proto.Message.IInteractiveResponseMessage): proto.Message.InteractiveResponseMessage;
            public static encode(m: proto.Message.IInteractiveResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace InteractiveResponseMessage {

            interface IBody {
                text?: (string|null);
                format?: (proto.Message.InteractiveResponseMessage.Body.Format|null);
            }

            class Body implements IBody {
                constructor(p?: proto.Message.InteractiveResponseMessage.IBody);
                public text: string;
                public format: proto.Message.InteractiveResponseMessage.Body.Format;
                public static create(properties?: proto.Message.InteractiveResponseMessage.IBody): proto.Message.InteractiveResponseMessage.Body;
                public static encode(m: proto.Message.InteractiveResponseMessage.IBody, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveResponseMessage.Body;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Body {

                enum Format {
                    DEFAULT = 0,
                    EXTENSIONS_1 = 1
                }
            }

            interface INativeFlowResponseMessage {
                name?: (string|null);
                paramsJson?: (string|null);
                version?: (number|null);
            }

            class NativeFlowResponseMessage implements INativeFlowResponseMessage {
                constructor(p?: proto.Message.InteractiveResponseMessage.INativeFlowResponseMessage);
                public name: string;
                public paramsJson: string;
                public version: number;
                public static create(properties?: proto.Message.InteractiveResponseMessage.INativeFlowResponseMessage): proto.Message.InteractiveResponseMessage.NativeFlowResponseMessage;
                public static encode(m: proto.Message.InteractiveResponseMessage.INativeFlowResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InteractiveResponseMessage.NativeFlowResponseMessage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IInvoiceMessage {
            note?: (string|null);
            token?: (string|null);
            attachmentType?: (proto.Message.InvoiceMessage.AttachmentType|null);
            attachmentMimetype?: (string|null);
            attachmentMediaKey?: (Uint8Array|null);
            attachmentMediaKeyTimestamp?: (number|Long|null);
            attachmentFileSha256?: (Uint8Array|null);
            attachmentFileEncSha256?: (Uint8Array|null);
            attachmentDirectPath?: (string|null);
            attachmentJpegThumbnail?: (Uint8Array|null);
        }

        class InvoiceMessage implements IInvoiceMessage {
            constructor(p?: proto.Message.IInvoiceMessage);
            public note: string;
            public token: string;
            public attachmentType: proto.Message.InvoiceMessage.AttachmentType;
            public attachmentMimetype: string;
            public attachmentMediaKey: Uint8Array;
            public attachmentMediaKeyTimestamp: (number|Long);
            public attachmentFileSha256: Uint8Array;
            public attachmentFileEncSha256: Uint8Array;
            public attachmentDirectPath: string;
            public attachmentJpegThumbnail: Uint8Array;
            public static create(properties?: proto.Message.IInvoiceMessage): proto.Message.InvoiceMessage;
            public static encode(m: proto.Message.IInvoiceMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.InvoiceMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace InvoiceMessage {

            enum AttachmentType {
                IMAGE = 0,
                PDF = 1
            }
        }

        interface IKeepInChatMessage {
            key?: (proto.IMessageKey|null);
            keepType?: (proto.KeepType|null);
            timestampMs?: (number|Long|null);
        }

        class KeepInChatMessage implements IKeepInChatMessage {
            constructor(p?: proto.Message.IKeepInChatMessage);
            public key?: (proto.IMessageKey|null);
            public keepType: proto.KeepType;
            public timestampMs: (number|Long);
            public static create(properties?: proto.Message.IKeepInChatMessage): proto.Message.KeepInChatMessage;
            public static encode(m: proto.Message.IKeepInChatMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.KeepInChatMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILinkPreviewMetadata {
            paymentLinkMetadata?: (proto.Message.IPaymentLinkMetadata|null);
            urlMetadata?: (proto.Message.IURLMetadata|null);
            fbExperimentId?: (number|null);
        }

        class LinkPreviewMetadata implements ILinkPreviewMetadata {
            constructor(p?: proto.Message.ILinkPreviewMetadata);
            public paymentLinkMetadata?: (proto.Message.IPaymentLinkMetadata|null);
            public urlMetadata?: (proto.Message.IURLMetadata|null);
            public fbExperimentId: number;
            public static create(properties?: proto.Message.ILinkPreviewMetadata): proto.Message.LinkPreviewMetadata;
            public static encode(m: proto.Message.ILinkPreviewMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.LinkPreviewMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IListMessage {
            title?: (string|null);
            description?: (string|null);
            buttonText?: (string|null);
            listType?: (proto.Message.ListMessage.ListType|null);
            sections?: (proto.Message.ListMessage.ISection[]|null);
            productListInfo?: (proto.Message.ListMessage.IProductListInfo|null);
            footerText?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class ListMessage implements IListMessage {
            constructor(p?: proto.Message.IListMessage);
            public title: string;
            public description: string;
            public buttonText: string;
            public listType: proto.Message.ListMessage.ListType;
            public sections: proto.Message.ListMessage.ISection[];
            public productListInfo?: (proto.Message.ListMessage.IProductListInfo|null);
            public footerText: string;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IListMessage): proto.Message.ListMessage;
            public static encode(m: proto.Message.IListMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ListMessage {

            enum ListType {
                UNKNOWN = 0,
                SINGLE_SELECT = 1,
                PRODUCT_LIST = 2
            }

            interface IProduct {
                productId?: (string|null);
            }

            class Product implements IProduct {
                constructor(p?: proto.Message.ListMessage.IProduct);
                public productId: string;
                public static create(properties?: proto.Message.ListMessage.IProduct): proto.Message.ListMessage.Product;
                public static encode(m: proto.Message.ListMessage.IProduct, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.Product;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IProductListHeaderImage {
                productId?: (string|null);
                jpegThumbnail?: (Uint8Array|null);
            }

            class ProductListHeaderImage implements IProductListHeaderImage {
                constructor(p?: proto.Message.ListMessage.IProductListHeaderImage);
                public productId: string;
                public jpegThumbnail: Uint8Array;
                public static create(properties?: proto.Message.ListMessage.IProductListHeaderImage): proto.Message.ListMessage.ProductListHeaderImage;
                public static encode(m: proto.Message.ListMessage.IProductListHeaderImage, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.ProductListHeaderImage;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IProductListInfo {
                productSections?: (proto.Message.ListMessage.IProductSection[]|null);
                headerImage?: (proto.Message.ListMessage.IProductListHeaderImage|null);
                businessOwnerJid?: (string|null);
            }

            class ProductListInfo implements IProductListInfo {
                constructor(p?: proto.Message.ListMessage.IProductListInfo);
                public productSections: proto.Message.ListMessage.IProductSection[];
                public headerImage?: (proto.Message.ListMessage.IProductListHeaderImage|null);
                public businessOwnerJid: string;
                public static create(properties?: proto.Message.ListMessage.IProductListInfo): proto.Message.ListMessage.ProductListInfo;
                public static encode(m: proto.Message.ListMessage.IProductListInfo, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.ProductListInfo;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IProductSection {
                title?: (string|null);
                products?: (proto.Message.ListMessage.IProduct[]|null);
            }

            class ProductSection implements IProductSection {
                constructor(p?: proto.Message.ListMessage.IProductSection);
                public title: string;
                public products: proto.Message.ListMessage.IProduct[];
                public static create(properties?: proto.Message.ListMessage.IProductSection): proto.Message.ListMessage.ProductSection;
                public static encode(m: proto.Message.ListMessage.IProductSection, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.ProductSection;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IRow {
                title?: (string|null);
                description?: (string|null);
                rowId?: (string|null);
            }

            class Row implements IRow {
                constructor(p?: proto.Message.ListMessage.IRow);
                public title: string;
                public description: string;
                public rowId: string;
                public static create(properties?: proto.Message.ListMessage.IRow): proto.Message.ListMessage.Row;
                public static encode(m: proto.Message.ListMessage.IRow, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.Row;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface ISection {
                title?: (string|null);
                rows?: (proto.Message.ListMessage.IRow[]|null);
            }

            class Section implements ISection {
                constructor(p?: proto.Message.ListMessage.ISection);
                public title: string;
                public rows: proto.Message.ListMessage.IRow[];
                public static create(properties?: proto.Message.ListMessage.ISection): proto.Message.ListMessage.Section;
                public static encode(m: proto.Message.ListMessage.ISection, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListMessage.Section;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IListResponseMessage {
            title?: (string|null);
            listType?: (proto.Message.ListResponseMessage.ListType|null);
            singleSelectReply?: (proto.Message.ListResponseMessage.ISingleSelectReply|null);
            contextInfo?: (proto.IContextInfo|null);
            description?: (string|null);
        }

        class ListResponseMessage implements IListResponseMessage {
            constructor(p?: proto.Message.IListResponseMessage);
            public title: string;
            public listType: proto.Message.ListResponseMessage.ListType;
            public singleSelectReply?: (proto.Message.ListResponseMessage.ISingleSelectReply|null);
            public contextInfo?: (proto.IContextInfo|null);
            public description: string;
            public static create(properties?: proto.Message.IListResponseMessage): proto.Message.ListResponseMessage;
            public static encode(m: proto.Message.IListResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ListResponseMessage {

            enum ListType {
                UNKNOWN = 0,
                SINGLE_SELECT = 1
            }

            interface ISingleSelectReply {
                selectedRowId?: (string|null);
            }

            class SingleSelectReply implements ISingleSelectReply {
                constructor(p?: proto.Message.ListResponseMessage.ISingleSelectReply);
                public selectedRowId: string;
                public static create(properties?: proto.Message.ListResponseMessage.ISingleSelectReply): proto.Message.ListResponseMessage.SingleSelectReply;
                public static encode(m: proto.Message.ListResponseMessage.ISingleSelectReply, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ListResponseMessage.SingleSelectReply;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface ILiveLocationMessage {
            degreesLatitude?: (number|null);
            degreesLongitude?: (number|null);
            accuracyInMeters?: (number|null);
            speedInMps?: (number|null);
            degreesClockwiseFromMagneticNorth?: (number|null);
            caption?: (string|null);
            sequenceNumber?: (number|Long|null);
            timeOffset?: (number|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class LiveLocationMessage implements ILiveLocationMessage {
            constructor(p?: proto.Message.ILiveLocationMessage);
            public degreesLatitude: number;
            public degreesLongitude: number;
            public accuracyInMeters: number;
            public speedInMps: number;
            public degreesClockwiseFromMagneticNorth: number;
            public caption: string;
            public sequenceNumber: (number|Long);
            public timeOffset: number;
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.ILiveLocationMessage): proto.Message.LiveLocationMessage;
            public static encode(m: proto.Message.ILiveLocationMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.LiveLocationMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILocationMessage {
            degreesLatitude?: (number|null);
            degreesLongitude?: (number|null);
            name?: (string|null);
            address?: (string|null);
            url?: (string|null);
            isLive?: (boolean|null);
            accuracyInMeters?: (number|null);
            speedInMps?: (number|null);
            degreesClockwiseFromMagneticNorth?: (number|null);
            comment?: (string|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class LocationMessage implements ILocationMessage {
            constructor(p?: proto.Message.ILocationMessage);
            public degreesLatitude: number;
            public degreesLongitude: number;
            public name: string;
            public address: string;
            public url: string;
            public isLive: boolean;
            public accuracyInMeters: number;
            public speedInMps: number;
            public degreesClockwiseFromMagneticNorth: number;
            public comment: string;
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.ILocationMessage): proto.Message.LocationMessage;
            public static encode(m: proto.Message.ILocationMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.LocationMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMMSThumbnailMetadata {
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            mediaKeyTimestamp?: (number|Long|null);
            thumbnailHeight?: (number|null);
            thumbnailWidth?: (number|null);
        }

        class MMSThumbnailMetadata implements IMMSThumbnailMetadata {
            constructor(p?: proto.Message.IMMSThumbnailMetadata);
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public mediaKeyTimestamp: (number|Long);
            public thumbnailHeight: number;
            public thumbnailWidth: number;
            public static create(properties?: proto.Message.IMMSThumbnailMetadata): proto.Message.MMSThumbnailMetadata;
            public static encode(m: proto.Message.IMMSThumbnailMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.MMSThumbnailMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMessageHistoryBundle {
            mimetype?: (string|null);
            fileSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            directPath?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            contextInfo?: (proto.IContextInfo|null);
            messageHistoryMetadata?: (proto.Message.IMessageHistoryMetadata|null);
        }

        class MessageHistoryBundle implements IMessageHistoryBundle {
            constructor(p?: proto.Message.IMessageHistoryBundle);
            public mimetype: string;
            public fileSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public fileEncSha256: Uint8Array;
            public directPath: string;
            public mediaKeyTimestamp: (number|Long);
            public contextInfo?: (proto.IContextInfo|null);
            public messageHistoryMetadata?: (proto.Message.IMessageHistoryMetadata|null);
            public static create(properties?: proto.Message.IMessageHistoryBundle): proto.Message.MessageHistoryBundle;
            public static encode(m: proto.Message.IMessageHistoryBundle, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.MessageHistoryBundle;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMessageHistoryMetadata {
            historyReceivers?: (string[]|null);
            firstMessageTimestamp?: (number|Long|null);
            messageCount?: (number|Long|null);
        }

        class MessageHistoryMetadata implements IMessageHistoryMetadata {
            constructor(p?: proto.Message.IMessageHistoryMetadata);
            public historyReceivers: string[];
            public firstMessageTimestamp: (number|Long);
            public messageCount: (number|Long);
            public static create(properties?: proto.Message.IMessageHistoryMetadata): proto.Message.MessageHistoryMetadata;
            public static encode(m: proto.Message.IMessageHistoryMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.MessageHistoryMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMessageHistoryNotice {
            contextInfo?: (proto.IContextInfo|null);
            messageHistoryMetadata?: (proto.Message.IMessageHistoryMetadata|null);
        }

        class MessageHistoryNotice implements IMessageHistoryNotice {
            constructor(p?: proto.Message.IMessageHistoryNotice);
            public contextInfo?: (proto.IContextInfo|null);
            public messageHistoryMetadata?: (proto.Message.IMessageHistoryMetadata|null);
            public static create(properties?: proto.Message.IMessageHistoryNotice): proto.Message.MessageHistoryNotice;
            public static encode(m: proto.Message.IMessageHistoryNotice, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.MessageHistoryNotice;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface INewsletterAdminInviteMessage {
            newsletterJid?: (string|null);
            newsletterName?: (string|null);
            jpegThumbnail?: (Uint8Array|null);
            caption?: (string|null);
            inviteExpiration?: (number|Long|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class NewsletterAdminInviteMessage implements INewsletterAdminInviteMessage {
            constructor(p?: proto.Message.INewsletterAdminInviteMessage);
            public newsletterJid: string;
            public newsletterName: string;
            public jpegThumbnail: Uint8Array;
            public caption: string;
            public inviteExpiration: (number|Long);
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.INewsletterAdminInviteMessage): proto.Message.NewsletterAdminInviteMessage;
            public static encode(m: proto.Message.INewsletterAdminInviteMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.NewsletterAdminInviteMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IOrderMessage {
            orderId?: (string|null);
            thumbnail?: (Uint8Array|null);
            itemCount?: (number|null);
            status?: (proto.Message.OrderMessage.OrderStatus|null);
            surface?: (proto.Message.OrderMessage.OrderSurface|null);
            message?: (string|null);
            orderTitle?: (string|null);
            sellerJid?: (string|null);
            token?: (string|null);
            totalAmount1000?: (number|Long|null);
            totalCurrencyCode?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            messageVersion?: (number|null);
            orderRequestMessageId?: (proto.IMessageKey|null);
            catalogType?: (string|null);
        }

        class OrderMessage implements IOrderMessage {
            constructor(p?: proto.Message.IOrderMessage);
            public orderId: string;
            public thumbnail: Uint8Array;
            public itemCount: number;
            public status: proto.Message.OrderMessage.OrderStatus;
            public surface: proto.Message.OrderMessage.OrderSurface;
            public message: string;
            public orderTitle: string;
            public sellerJid: string;
            public token: string;
            public totalAmount1000: (number|Long);
            public totalCurrencyCode: string;
            public contextInfo?: (proto.IContextInfo|null);
            public messageVersion: number;
            public orderRequestMessageId?: (proto.IMessageKey|null);
            public catalogType: string;
            public static create(properties?: proto.Message.IOrderMessage): proto.Message.OrderMessage;
            public static encode(m: proto.Message.IOrderMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.OrderMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace OrderMessage {

            enum OrderStatus {
                INQUIRY = 1,
                ACCEPTED = 2,
                DECLINED = 3
            }

            enum OrderSurface {
                CATALOG = 1
            }
        }

        interface IPaymentInviteMessage {
            serviceType?: (proto.Message.PaymentInviteMessage.ServiceType|null);
            expiryTimestamp?: (number|Long|null);
        }

        class PaymentInviteMessage implements IPaymentInviteMessage {
            constructor(p?: proto.Message.IPaymentInviteMessage);
            public serviceType: proto.Message.PaymentInviteMessage.ServiceType;
            public expiryTimestamp: (number|Long);
            public static create(properties?: proto.Message.IPaymentInviteMessage): proto.Message.PaymentInviteMessage;
            public static encode(m: proto.Message.IPaymentInviteMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PaymentInviteMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PaymentInviteMessage {

            enum ServiceType {
                UNKNOWN = 0,
                FBPAY = 1,
                NOVI = 2,
                UPI = 3
            }
        }

        interface IPaymentLinkMetadata {
            button?: (proto.Message.PaymentLinkMetadata.IPaymentLinkButton|null);
            header?: (proto.Message.PaymentLinkMetadata.IPaymentLinkHeader|null);
        }

        class PaymentLinkMetadata implements IPaymentLinkMetadata {
            constructor(p?: proto.Message.IPaymentLinkMetadata);
            public button?: (proto.Message.PaymentLinkMetadata.IPaymentLinkButton|null);
            public header?: (proto.Message.PaymentLinkMetadata.IPaymentLinkHeader|null);
            public static create(properties?: proto.Message.IPaymentLinkMetadata): proto.Message.PaymentLinkMetadata;
            public static encode(m: proto.Message.IPaymentLinkMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PaymentLinkMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PaymentLinkMetadata {

            interface IPaymentLinkButton {
                displayText?: (string|null);
            }

            class PaymentLinkButton implements IPaymentLinkButton {
                constructor(p?: proto.Message.PaymentLinkMetadata.IPaymentLinkButton);
                public displayText: string;
                public static create(properties?: proto.Message.PaymentLinkMetadata.IPaymentLinkButton): proto.Message.PaymentLinkMetadata.PaymentLinkButton;
                public static encode(m: proto.Message.PaymentLinkMetadata.IPaymentLinkButton, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PaymentLinkMetadata.PaymentLinkButton;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IPaymentLinkHeader {
                headerType?: (proto.Message.PaymentLinkMetadata.PaymentLinkHeader.PaymentLinkHeaderType|null);
            }

            class PaymentLinkHeader implements IPaymentLinkHeader {
                constructor(p?: proto.Message.PaymentLinkMetadata.IPaymentLinkHeader);
                public headerType: proto.Message.PaymentLinkMetadata.PaymentLinkHeader.PaymentLinkHeaderType;
                public static create(properties?: proto.Message.PaymentLinkMetadata.IPaymentLinkHeader): proto.Message.PaymentLinkMetadata.PaymentLinkHeader;
                public static encode(m: proto.Message.PaymentLinkMetadata.IPaymentLinkHeader, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PaymentLinkMetadata.PaymentLinkHeader;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace PaymentLinkHeader {

                enum PaymentLinkHeaderType {
                    LINK_PREVIEW = 0,
                    ORDER = 1
                }
            }
        }

        interface IPeerDataOperationRequestMessage {
            peerDataOperationRequestType?: (proto.Message.PeerDataOperationRequestType|null);
            requestStickerReupload?: (proto.Message.PeerDataOperationRequestMessage.IRequestStickerReupload[]|null);
            requestUrlPreview?: (proto.Message.PeerDataOperationRequestMessage.IRequestUrlPreview[]|null);
            historySyncOnDemandRequest?: (proto.Message.PeerDataOperationRequestMessage.IHistorySyncOnDemandRequest|null);
            placeholderMessageResendRequest?: (proto.Message.PeerDataOperationRequestMessage.IPlaceholderMessageResendRequest[]|null);
            fullHistorySyncOnDemandRequest?: (proto.Message.PeerDataOperationRequestMessage.IFullHistorySyncOnDemandRequest|null);
            syncdCollectionFatalRecoveryRequest?: (proto.Message.PeerDataOperationRequestMessage.ISyncDCollectionFatalRecoveryRequest|null);
        }

        class PeerDataOperationRequestMessage implements IPeerDataOperationRequestMessage {
            constructor(p?: proto.Message.IPeerDataOperationRequestMessage);
            public peerDataOperationRequestType: proto.Message.PeerDataOperationRequestType;
            public requestStickerReupload: proto.Message.PeerDataOperationRequestMessage.IRequestStickerReupload[];
            public requestUrlPreview: proto.Message.PeerDataOperationRequestMessage.IRequestUrlPreview[];
            public historySyncOnDemandRequest?: (proto.Message.PeerDataOperationRequestMessage.IHistorySyncOnDemandRequest|null);
            public placeholderMessageResendRequest: proto.Message.PeerDataOperationRequestMessage.IPlaceholderMessageResendRequest[];
            public fullHistorySyncOnDemandRequest?: (proto.Message.PeerDataOperationRequestMessage.IFullHistorySyncOnDemandRequest|null);
            public syncdCollectionFatalRecoveryRequest?: (proto.Message.PeerDataOperationRequestMessage.ISyncDCollectionFatalRecoveryRequest|null);
            public static create(properties?: proto.Message.IPeerDataOperationRequestMessage): proto.Message.PeerDataOperationRequestMessage;
            public static encode(m: proto.Message.IPeerDataOperationRequestMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PeerDataOperationRequestMessage {

            interface IFullHistorySyncOnDemandRequest {
                requestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
                historySyncConfig?: (proto.DeviceProps.IHistorySyncConfig|null);
            }

            class FullHistorySyncOnDemandRequest implements IFullHistorySyncOnDemandRequest {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.IFullHistorySyncOnDemandRequest);
                public requestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
                public historySyncConfig?: (proto.DeviceProps.IHistorySyncConfig|null);
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.IFullHistorySyncOnDemandRequest): proto.Message.PeerDataOperationRequestMessage.FullHistorySyncOnDemandRequest;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.IFullHistorySyncOnDemandRequest, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.FullHistorySyncOnDemandRequest;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IHistorySyncOnDemandRequest {
                chatJid?: (string|null);
                oldestMsgId?: (string|null);
                oldestMsgFromMe?: (boolean|null);
                onDemandMsgCount?: (number|null);
                oldestMsgTimestampMs?: (number|Long|null);
                accountLid?: (string|null);
            }

            class HistorySyncOnDemandRequest implements IHistorySyncOnDemandRequest {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.IHistorySyncOnDemandRequest);
                public chatJid: string;
                public oldestMsgId: string;
                public oldestMsgFromMe: boolean;
                public onDemandMsgCount: number;
                public oldestMsgTimestampMs: (number|Long);
                public accountLid: string;
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.IHistorySyncOnDemandRequest): proto.Message.PeerDataOperationRequestMessage.HistorySyncOnDemandRequest;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.IHistorySyncOnDemandRequest, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.HistorySyncOnDemandRequest;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IPlaceholderMessageResendRequest {
                messageKey?: (proto.IMessageKey|null);
            }

            class PlaceholderMessageResendRequest implements IPlaceholderMessageResendRequest {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.IPlaceholderMessageResendRequest);
                public messageKey?: (proto.IMessageKey|null);
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.IPlaceholderMessageResendRequest): proto.Message.PeerDataOperationRequestMessage.PlaceholderMessageResendRequest;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.IPlaceholderMessageResendRequest, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.PlaceholderMessageResendRequest;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IRequestStickerReupload {
                fileSha256?: (string|null);
            }

            class RequestStickerReupload implements IRequestStickerReupload {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.IRequestStickerReupload);
                public fileSha256: string;
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.IRequestStickerReupload): proto.Message.PeerDataOperationRequestMessage.RequestStickerReupload;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.IRequestStickerReupload, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.RequestStickerReupload;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IRequestUrlPreview {
                url?: (string|null);
                includeHqThumbnail?: (boolean|null);
            }

            class RequestUrlPreview implements IRequestUrlPreview {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.IRequestUrlPreview);
                public url: string;
                public includeHqThumbnail: boolean;
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.IRequestUrlPreview): proto.Message.PeerDataOperationRequestMessage.RequestUrlPreview;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.IRequestUrlPreview, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.RequestUrlPreview;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface ISyncDCollectionFatalRecoveryRequest {
                collectionName?: (string|null);
                timestamp?: (number|Long|null);
            }

            class SyncDCollectionFatalRecoveryRequest implements ISyncDCollectionFatalRecoveryRequest {
                constructor(p?: proto.Message.PeerDataOperationRequestMessage.ISyncDCollectionFatalRecoveryRequest);
                public collectionName: string;
                public timestamp: (number|Long);
                public static create(properties?: proto.Message.PeerDataOperationRequestMessage.ISyncDCollectionFatalRecoveryRequest): proto.Message.PeerDataOperationRequestMessage.SyncDCollectionFatalRecoveryRequest;
                public static encode(m: proto.Message.PeerDataOperationRequestMessage.ISyncDCollectionFatalRecoveryRequest, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestMessage.SyncDCollectionFatalRecoveryRequest;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IPeerDataOperationRequestResponseMessage {
            peerDataOperationRequestType?: (proto.Message.PeerDataOperationRequestType|null);
            stanzaId?: (string|null);
            peerDataOperationResult?: (proto.Message.PeerDataOperationRequestResponseMessage.IPeerDataOperationResult[]|null);
        }

        class PeerDataOperationRequestResponseMessage implements IPeerDataOperationRequestResponseMessage {
            constructor(p?: proto.Message.IPeerDataOperationRequestResponseMessage);
            public peerDataOperationRequestType: proto.Message.PeerDataOperationRequestType;
            public stanzaId: string;
            public peerDataOperationResult: proto.Message.PeerDataOperationRequestResponseMessage.IPeerDataOperationResult[];
            public static create(properties?: proto.Message.IPeerDataOperationRequestResponseMessage): proto.Message.PeerDataOperationRequestResponseMessage;
            public static encode(m: proto.Message.IPeerDataOperationRequestResponseMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PeerDataOperationRequestResponseMessage {

            interface IPeerDataOperationResult {
                mediaUploadResult?: (proto.MediaRetryNotification.ResultType|null);
                stickerMessage?: (proto.Message.IStickerMessage|null);
                linkPreviewResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ILinkPreviewResponse|null);
                placeholderMessageResendResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IPlaceholderMessageResendResponse|null);
                waffleNonceFetchRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IWaffleNonceFetchResponse|null);
                fullHistorySyncOnDemandRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IFullHistorySyncOnDemandRequestResponse|null);
                companionMetaNonceFetchRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ICompanionMetaNonceFetchResponse|null);
                syncdSnapshotFatalRecoveryResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ISyncDSnapshotFatalRecoveryResponse|null);
            }

            class PeerDataOperationResult implements IPeerDataOperationResult {
                constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.IPeerDataOperationResult);
                public mediaUploadResult: proto.MediaRetryNotification.ResultType;
                public stickerMessage?: (proto.Message.IStickerMessage|null);
                public linkPreviewResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ILinkPreviewResponse|null);
                public placeholderMessageResendResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IPlaceholderMessageResendResponse|null);
                public waffleNonceFetchRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IWaffleNonceFetchResponse|null);
                public fullHistorySyncOnDemandRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IFullHistorySyncOnDemandRequestResponse|null);
                public companionMetaNonceFetchRequestResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ICompanionMetaNonceFetchResponse|null);
                public syncdSnapshotFatalRecoveryResponse?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ISyncDSnapshotFatalRecoveryResponse|null);
                public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.IPeerDataOperationResult): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult;
                public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.IPeerDataOperationResult, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace PeerDataOperationResult {

                interface ICompanionMetaNonceFetchResponse {
                    nonce?: (string|null);
                }

                class CompanionMetaNonceFetchResponse implements ICompanionMetaNonceFetchResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ICompanionMetaNonceFetchResponse);
                    public nonce: string;
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ICompanionMetaNonceFetchResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.CompanionMetaNonceFetchResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ICompanionMetaNonceFetchResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.CompanionMetaNonceFetchResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                interface IFullHistorySyncOnDemandRequestResponse {
                    requestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
                    responseCode?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.FullHistorySyncOnDemandResponseCode|null);
                }

                class FullHistorySyncOnDemandRequestResponse implements IFullHistorySyncOnDemandRequestResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IFullHistorySyncOnDemandRequestResponse);
                    public requestMetadata?: (proto.Message.IFullHistorySyncOnDemandRequestMetadata|null);
                    public responseCode: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.FullHistorySyncOnDemandResponseCode;
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IFullHistorySyncOnDemandRequestResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.FullHistorySyncOnDemandRequestResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IFullHistorySyncOnDemandRequestResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.FullHistorySyncOnDemandRequestResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                enum FullHistorySyncOnDemandResponseCode {
                    REQUEST_SUCCESS = 0,
                    REQUEST_TIME_EXPIRED = 1,
                    DECLINED_SHARING_HISTORY = 2,
                    GENERIC_ERROR = 3,
                    ERROR_REQUEST_ON_NON_SMB_PRIMARY = 4,
                    ERROR_HOSTED_DEVICE_NOT_CONNECTED = 5,
                    ERROR_HOSTED_DEVICE_LOGIN_TIME_NOT_SET = 6
                }

                interface ILinkPreviewResponse {
                    url?: (string|null);
                    title?: (string|null);
                    description?: (string|null);
                    thumbData?: (Uint8Array|null);
                    matchText?: (string|null);
                    previewType?: (string|null);
                    hqThumbnail?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.ILinkPreviewHighQualityThumbnail|null);
                }

                class LinkPreviewResponse implements ILinkPreviewResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ILinkPreviewResponse);
                    public url: string;
                    public title: string;
                    public description: string;
                    public thumbData: Uint8Array;
                    public matchText: string;
                    public previewType: string;
                    public hqThumbnail?: (proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.ILinkPreviewHighQualityThumbnail|null);
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ILinkPreviewResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ILinkPreviewResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace LinkPreviewResponse {

                    interface ILinkPreviewHighQualityThumbnail {
                        directPath?: (string|null);
                        thumbHash?: (string|null);
                        encThumbHash?: (string|null);
                        mediaKey?: (Uint8Array|null);
                        mediaKeyTimestampMs?: (number|Long|null);
                        thumbWidth?: (number|null);
                        thumbHeight?: (number|null);
                    }

                    class LinkPreviewHighQualityThumbnail implements ILinkPreviewHighQualityThumbnail {
                        constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.ILinkPreviewHighQualityThumbnail);
                        public directPath: string;
                        public thumbHash: string;
                        public encThumbHash: string;
                        public mediaKey: Uint8Array;
                        public mediaKeyTimestampMs: (number|Long);
                        public thumbWidth: number;
                        public thumbHeight: number;
                        public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.ILinkPreviewHighQualityThumbnail): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.LinkPreviewHighQualityThumbnail;
                        public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.ILinkPreviewHighQualityThumbnail, w?: $protobuf.Writer): $protobuf.Writer;
                        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.LinkPreviewResponse.LinkPreviewHighQualityThumbnail;
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                interface IPlaceholderMessageResendResponse {
                    webMessageInfoBytes?: (Uint8Array|null);
                }

                class PlaceholderMessageResendResponse implements IPlaceholderMessageResendResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IPlaceholderMessageResendResponse);
                    public webMessageInfoBytes: Uint8Array;
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IPlaceholderMessageResendResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.PlaceholderMessageResendResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IPlaceholderMessageResendResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.PlaceholderMessageResendResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                interface ISyncDSnapshotFatalRecoveryResponse {
                    collectionSnapshot?: (Uint8Array|null);
                    isCompressed?: (boolean|null);
                }

                class SyncDSnapshotFatalRecoveryResponse implements ISyncDSnapshotFatalRecoveryResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ISyncDSnapshotFatalRecoveryResponse);
                    public collectionSnapshot: Uint8Array;
                    public isCompressed: boolean;
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ISyncDSnapshotFatalRecoveryResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.SyncDSnapshotFatalRecoveryResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.ISyncDSnapshotFatalRecoveryResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.SyncDSnapshotFatalRecoveryResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                interface IWaffleNonceFetchResponse {
                    nonce?: (string|null);
                    waEntFbid?: (string|null);
                }

                class WaffleNonceFetchResponse implements IWaffleNonceFetchResponse {
                    constructor(p?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IWaffleNonceFetchResponse);
                    public nonce: string;
                    public waEntFbid: string;
                    public static create(properties?: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IWaffleNonceFetchResponse): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.WaffleNonceFetchResponse;
                    public static encode(m: proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.IWaffleNonceFetchResponse, w?: $protobuf.Writer): $protobuf.Writer;
                    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PeerDataOperationRequestResponseMessage.PeerDataOperationResult.WaffleNonceFetchResponse;
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        enum PeerDataOperationRequestType {
            UPLOAD_STICKER = 0,
            SEND_RECENT_STICKER_BOOTSTRAP = 1,
            GENERATE_LINK_PREVIEW = 2,
            HISTORY_SYNC_ON_DEMAND = 3,
            PLACEHOLDER_MESSAGE_RESEND = 4,
            WAFFLE_LINKING_NONCE_FETCH = 5,
            FULL_HISTORY_SYNC_ON_DEMAND = 6,
            COMPANION_META_NONCE_FETCH = 7,
            COMPANION_SYNCD_SNAPSHOT_FATAL_RECOVERY = 8
        }

        interface IPinInChatMessage {
            key?: (proto.IMessageKey|null);
            type?: (proto.Message.PinInChatMessage.Type|null);
            senderTimestampMs?: (number|Long|null);
        }

        class PinInChatMessage implements IPinInChatMessage {
            constructor(p?: proto.Message.IPinInChatMessage);
            public key?: (proto.IMessageKey|null);
            public type: proto.Message.PinInChatMessage.Type;
            public senderTimestampMs: (number|Long);
            public static create(properties?: proto.Message.IPinInChatMessage): proto.Message.PinInChatMessage;
            public static encode(m: proto.Message.IPinInChatMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PinInChatMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PinInChatMessage {

            enum Type {
                UNKNOWN_TYPE = 0,
                PIN_FOR_ALL = 1,
                UNPIN_FOR_ALL = 2
            }
        }

        interface IPlaceholderMessage {
            type?: (proto.Message.PlaceholderMessage.PlaceholderType|null);
        }

        class PlaceholderMessage implements IPlaceholderMessage {
            constructor(p?: proto.Message.IPlaceholderMessage);
            public type: proto.Message.PlaceholderMessage.PlaceholderType;
            public static create(properties?: proto.Message.IPlaceholderMessage): proto.Message.PlaceholderMessage;
            public static encode(m: proto.Message.IPlaceholderMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PlaceholderMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PlaceholderMessage {

            enum PlaceholderType {
                MASK_LINKED_DEVICES = 0
            }
        }

        enum PollContentType {
            UNKNOWN = 0,
            TEXT = 1,
            IMAGE = 2
        }

        interface IPollCreationMessage {
            encKey?: (Uint8Array|null);
            name?: (string|null);
            options?: (proto.Message.PollCreationMessage.IOption[]|null);
            selectableOptionsCount?: (number|null);
            contextInfo?: (proto.IContextInfo|null);
            pollContentType?: (proto.Message.PollContentType|null);
            pollType?: (proto.Message.PollCreationMessage.PollType|null);
            correctAnswer?: (proto.Message.PollCreationMessage.IOption|null);
        }

        class PollCreationMessage implements IPollCreationMessage {
            constructor(p?: proto.Message.IPollCreationMessage);
            public encKey: Uint8Array;
            public name: string;
            public options: proto.Message.PollCreationMessage.IOption[];
            public selectableOptionsCount: number;
            public contextInfo?: (proto.IContextInfo|null);
            public pollContentType: proto.Message.PollContentType;
            public pollType: proto.Message.PollCreationMessage.PollType;
            public correctAnswer?: (proto.Message.PollCreationMessage.IOption|null);
            public static create(properties?: proto.Message.IPollCreationMessage): proto.Message.PollCreationMessage;
            public static encode(m: proto.Message.IPollCreationMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollCreationMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PollCreationMessage {

            interface IOption {
                optionName?: (string|null);
                optionHash?: (string|null);
            }

            class Option implements IOption {
                constructor(p?: proto.Message.PollCreationMessage.IOption);
                public optionName: string;
                public optionHash: string;
                public static create(properties?: proto.Message.PollCreationMessage.IOption): proto.Message.PollCreationMessage.Option;
                public static encode(m: proto.Message.PollCreationMessage.IOption, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollCreationMessage.Option;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum PollType {
                POLL = 0,
                QUIZ = 1
            }
        }

        interface IPollEncValue {
            encPayload?: (Uint8Array|null);
            encIv?: (Uint8Array|null);
        }

        class PollEncValue implements IPollEncValue {
            constructor(p?: proto.Message.IPollEncValue);
            public encPayload: Uint8Array;
            public encIv: Uint8Array;
            public static create(properties?: proto.Message.IPollEncValue): proto.Message.PollEncValue;
            public static encode(m: proto.Message.IPollEncValue, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollEncValue;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPollResultSnapshotMessage {
            name?: (string|null);
            pollVotes?: (proto.Message.PollResultSnapshotMessage.IPollVote[]|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class PollResultSnapshotMessage implements IPollResultSnapshotMessage {
            constructor(p?: proto.Message.IPollResultSnapshotMessage);
            public name: string;
            public pollVotes: proto.Message.PollResultSnapshotMessage.IPollVote[];
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IPollResultSnapshotMessage): proto.Message.PollResultSnapshotMessage;
            public static encode(m: proto.Message.IPollResultSnapshotMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollResultSnapshotMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PollResultSnapshotMessage {

            interface IPollVote {
                optionName?: (string|null);
                optionVoteCount?: (number|Long|null);
            }

            class PollVote implements IPollVote {
                constructor(p?: proto.Message.PollResultSnapshotMessage.IPollVote);
                public optionName: string;
                public optionVoteCount: (number|Long);
                public static create(properties?: proto.Message.PollResultSnapshotMessage.IPollVote): proto.Message.PollResultSnapshotMessage.PollVote;
                public static encode(m: proto.Message.PollResultSnapshotMessage.IPollVote, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollResultSnapshotMessage.PollVote;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IPollUpdateMessage {
            pollCreationMessageKey?: (proto.IMessageKey|null);
            vote?: (proto.Message.IPollEncValue|null);
            metadata?: (proto.Message.IPollUpdateMessageMetadata|null);
            senderTimestampMs?: (number|Long|null);
        }

        class PollUpdateMessage implements IPollUpdateMessage {
            constructor(p?: proto.Message.IPollUpdateMessage);
            public pollCreationMessageKey?: (proto.IMessageKey|null);
            public vote?: (proto.Message.IPollEncValue|null);
            public metadata?: (proto.Message.IPollUpdateMessageMetadata|null);
            public senderTimestampMs: (number|Long);
            public static create(properties?: proto.Message.IPollUpdateMessage): proto.Message.PollUpdateMessage;
            public static encode(m: proto.Message.IPollUpdateMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollUpdateMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPollUpdateMessageMetadata {
        }

        class PollUpdateMessageMetadata implements IPollUpdateMessageMetadata {
            constructor(p?: proto.Message.IPollUpdateMessageMetadata);
            public static create(properties?: proto.Message.IPollUpdateMessageMetadata): proto.Message.PollUpdateMessageMetadata;
            public static encode(m: proto.Message.IPollUpdateMessageMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollUpdateMessageMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPollVoteMessage {
            selectedOptions?: (Uint8Array[]|null);
        }

        class PollVoteMessage implements IPollVoteMessage {
            constructor(p?: proto.Message.IPollVoteMessage);
            public selectedOptions: Uint8Array[];
            public static create(properties?: proto.Message.IPollVoteMessage): proto.Message.PollVoteMessage;
            public static encode(m: proto.Message.IPollVoteMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.PollVoteMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IProductMessage {
            product?: (proto.Message.ProductMessage.IProductSnapshot|null);
            businessOwnerJid?: (string|null);
            catalog?: (proto.Message.ProductMessage.ICatalogSnapshot|null);
            body?: (string|null);
            footer?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
        }

        class ProductMessage implements IProductMessage {
            constructor(p?: proto.Message.IProductMessage);
            public product?: (proto.Message.ProductMessage.IProductSnapshot|null);
            public businessOwnerJid: string;
            public catalog?: (proto.Message.ProductMessage.ICatalogSnapshot|null);
            public body: string;
            public footer: string;
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IProductMessage): proto.Message.ProductMessage;
            public static encode(m: proto.Message.IProductMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ProductMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ProductMessage {

            interface ICatalogSnapshot {
                catalogImage?: (proto.Message.IImageMessage|null);
                title?: (string|null);
                description?: (string|null);
            }

            class CatalogSnapshot implements ICatalogSnapshot {
                constructor(p?: proto.Message.ProductMessage.ICatalogSnapshot);
                public catalogImage?: (proto.Message.IImageMessage|null);
                public title: string;
                public description: string;
                public static create(properties?: proto.Message.ProductMessage.ICatalogSnapshot): proto.Message.ProductMessage.CatalogSnapshot;
                public static encode(m: proto.Message.ProductMessage.ICatalogSnapshot, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ProductMessage.CatalogSnapshot;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IProductSnapshot {
                productImage?: (proto.Message.IImageMessage|null);
                productId?: (string|null);
                title?: (string|null);
                description?: (string|null);
                currencyCode?: (string|null);
                priceAmount1000?: (number|Long|null);
                retailerId?: (string|null);
                url?: (string|null);
                productImageCount?: (number|null);
                firstImageId?: (string|null);
                salePriceAmount1000?: (number|Long|null);
                signedUrl?: (string|null);
            }

            class ProductSnapshot implements IProductSnapshot {
                constructor(p?: proto.Message.ProductMessage.IProductSnapshot);
                public productImage?: (proto.Message.IImageMessage|null);
                public productId: string;
                public title: string;
                public description: string;
                public currencyCode: string;
                public priceAmount1000: (number|Long);
                public retailerId: string;
                public url: string;
                public productImageCount: number;
                public firstImageId: string;
                public salePriceAmount1000: (number|Long);
                public signedUrl: string;
                public static create(properties?: proto.Message.ProductMessage.IProductSnapshot): proto.Message.ProductMessage.ProductSnapshot;
                public static encode(m: proto.Message.ProductMessage.IProductSnapshot, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ProductMessage.ProductSnapshot;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IProtocolMessage {
            key?: (proto.IMessageKey|null);
            type?: (proto.Message.ProtocolMessage.Type|null);
            ephemeralExpiration?: (number|null);
            ephemeralSettingTimestamp?: (number|Long|null);
            historySyncNotification?: (proto.Message.IHistorySyncNotification|null);
            appStateSyncKeyShare?: (proto.Message.IAppStateSyncKeyShare|null);
            appStateSyncKeyRequest?: (proto.Message.IAppStateSyncKeyRequest|null);
            initialSecurityNotificationSettingSync?: (proto.Message.IInitialSecurityNotificationSettingSync|null);
            appStateFatalExceptionNotification?: (proto.Message.IAppStateFatalExceptionNotification|null);
            disappearingMode?: (proto.IDisappearingMode|null);
            editedMessage?: (proto.IMessage|null);
            timestampMs?: (number|Long|null);
            peerDataOperationRequestMessage?: (proto.Message.IPeerDataOperationRequestMessage|null);
            peerDataOperationRequestResponseMessage?: (proto.Message.IPeerDataOperationRequestResponseMessage|null);
            botFeedbackMessage?: (proto.Message.IBotFeedbackMessage|null);
            invokerJid?: (string|null);
            requestWelcomeMessageMetadata?: (proto.Message.IRequestWelcomeMessageMetadata|null);
            mediaNotifyMessage?: (proto.IMediaNotifyMessage|null);
            cloudApiThreadControlNotification?: (proto.Message.ICloudAPIThreadControlNotification|null);
            lidMigrationMappingSyncMessage?: (proto.ILIDMigrationMappingSyncMessage|null);
            limitSharing?: (proto.ILimitSharing|null);
            aiPsiMetadata?: (Uint8Array|null);
            aiQueryFanout?: (proto.IAIQueryFanout|null);
            memberLabel?: (proto.IMemberLabel|null);
        }

        class ProtocolMessage implements IProtocolMessage {
            constructor(p?: proto.Message.IProtocolMessage);
            public key?: (proto.IMessageKey|null);
            public type: proto.Message.ProtocolMessage.Type;
            public ephemeralExpiration: number;
            public ephemeralSettingTimestamp: (number|Long);
            public historySyncNotification?: (proto.Message.IHistorySyncNotification|null);
            public appStateSyncKeyShare?: (proto.Message.IAppStateSyncKeyShare|null);
            public appStateSyncKeyRequest?: (proto.Message.IAppStateSyncKeyRequest|null);
            public initialSecurityNotificationSettingSync?: (proto.Message.IInitialSecurityNotificationSettingSync|null);
            public appStateFatalExceptionNotification?: (proto.Message.IAppStateFatalExceptionNotification|null);
            public disappearingMode?: (proto.IDisappearingMode|null);
            public editedMessage?: (proto.IMessage|null);
            public timestampMs: (number|Long);
            public peerDataOperationRequestMessage?: (proto.Message.IPeerDataOperationRequestMessage|null);
            public peerDataOperationRequestResponseMessage?: (proto.Message.IPeerDataOperationRequestResponseMessage|null);
            public botFeedbackMessage?: (proto.Message.IBotFeedbackMessage|null);
            public invokerJid: string;
            public requestWelcomeMessageMetadata?: (proto.Message.IRequestWelcomeMessageMetadata|null);
            public mediaNotifyMessage?: (proto.IMediaNotifyMessage|null);
            public cloudApiThreadControlNotification?: (proto.Message.ICloudAPIThreadControlNotification|null);
            public lidMigrationMappingSyncMessage?: (proto.ILIDMigrationMappingSyncMessage|null);
            public limitSharing?: (proto.ILimitSharing|null);
            public aiPsiMetadata: Uint8Array;
            public aiQueryFanout?: (proto.IAIQueryFanout|null);
            public memberLabel?: (proto.IMemberLabel|null);
            public static create(properties?: proto.Message.IProtocolMessage): proto.Message.ProtocolMessage;
            public static encode(m: proto.Message.IProtocolMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ProtocolMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ProtocolMessage {

            enum Type {
                REVOKE = 0,
                EPHEMERAL_SETTING = 3,
                EPHEMERAL_SYNC_RESPONSE = 4,
                HISTORY_SYNC_NOTIFICATION = 5,
                APP_STATE_SYNC_KEY_SHARE = 6,
                APP_STATE_SYNC_KEY_REQUEST = 7,
                MSG_FANOUT_BACKFILL_REQUEST = 8,
                INITIAL_SECURITY_NOTIFICATION_SETTING_SYNC = 9,
                APP_STATE_FATAL_EXCEPTION_NOTIFICATION = 10,
                SHARE_PHONE_NUMBER = 11,
                MESSAGE_EDIT = 14,
                PEER_DATA_OPERATION_REQUEST_MESSAGE = 16,
                PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE = 17,
                REQUEST_WELCOME_MESSAGE = 18,
                BOT_FEEDBACK_MESSAGE = 19,
                MEDIA_NOTIFY_MESSAGE = 20,
                CLOUD_API_THREAD_CONTROL_NOTIFICATION = 21,
                LID_MIGRATION_MAPPING_SYNC = 22,
                REMINDER_MESSAGE = 23,
                BOT_MEMU_ONBOARDING_MESSAGE = 24,
                STATUS_MENTION_MESSAGE = 25,
                STOP_GENERATION_MESSAGE = 26,
                LIMIT_SHARING = 27,
                AI_PSI_METADATA = 28,
                AI_QUERY_FANOUT = 29,
                GROUP_MEMBER_LABEL_CHANGE = 30
            }
        }

        interface IReactionMessage {
            key?: (proto.IMessageKey|null);
            text?: (string|null);
            groupingKey?: (string|null);
            senderTimestampMs?: (number|Long|null);
        }

        class ReactionMessage implements IReactionMessage {
            constructor(p?: proto.Message.IReactionMessage);
            public key?: (proto.IMessageKey|null);
            public text: string;
            public groupingKey: string;
            public senderTimestampMs: (number|Long);
            public static create(properties?: proto.Message.IReactionMessage): proto.Message.ReactionMessage;
            public static encode(m: proto.Message.IReactionMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ReactionMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IRequestPaymentMessage {
            noteMessage?: (proto.IMessage|null);
            currencyCodeIso4217?: (string|null);
            amount1000?: (number|Long|null);
            requestFrom?: (string|null);
            expiryTimestamp?: (number|Long|null);
            amount?: (proto.IMoney|null);
            background?: (proto.IPaymentBackground|null);
        }

        class RequestPaymentMessage implements IRequestPaymentMessage {
            constructor(p?: proto.Message.IRequestPaymentMessage);
            public noteMessage?: (proto.IMessage|null);
            public currencyCodeIso4217: string;
            public amount1000: (number|Long);
            public requestFrom: string;
            public expiryTimestamp: (number|Long);
            public amount?: (proto.IMoney|null);
            public background?: (proto.IPaymentBackground|null);
            public static create(properties?: proto.Message.IRequestPaymentMessage): proto.Message.RequestPaymentMessage;
            public static encode(m: proto.Message.IRequestPaymentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.RequestPaymentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IRequestPhoneNumberMessage {
            contextInfo?: (proto.IContextInfo|null);
        }

        class RequestPhoneNumberMessage implements IRequestPhoneNumberMessage {
            constructor(p?: proto.Message.IRequestPhoneNumberMessage);
            public contextInfo?: (proto.IContextInfo|null);
            public static create(properties?: proto.Message.IRequestPhoneNumberMessage): proto.Message.RequestPhoneNumberMessage;
            public static encode(m: proto.Message.IRequestPhoneNumberMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.RequestPhoneNumberMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IRequestWelcomeMessageMetadata {
            localChatState?: (proto.Message.RequestWelcomeMessageMetadata.LocalChatState|null);
        }

        class RequestWelcomeMessageMetadata implements IRequestWelcomeMessageMetadata {
            constructor(p?: proto.Message.IRequestWelcomeMessageMetadata);
            public localChatState: proto.Message.RequestWelcomeMessageMetadata.LocalChatState;
            public static create(properties?: proto.Message.IRequestWelcomeMessageMetadata): proto.Message.RequestWelcomeMessageMetadata;
            public static encode(m: proto.Message.IRequestWelcomeMessageMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.RequestWelcomeMessageMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace RequestWelcomeMessageMetadata {

            enum LocalChatState {
                EMPTY = 0,
                NON_EMPTY = 1
            }
        }

        interface IScheduledCallCreationMessage {
            scheduledTimestampMs?: (number|Long|null);
            callType?: (proto.Message.ScheduledCallCreationMessage.CallType|null);
            title?: (string|null);
        }

        class ScheduledCallCreationMessage implements IScheduledCallCreationMessage {
            constructor(p?: proto.Message.IScheduledCallCreationMessage);
            public scheduledTimestampMs: (number|Long);
            public callType: proto.Message.ScheduledCallCreationMessage.CallType;
            public title: string;
            public static create(properties?: proto.Message.IScheduledCallCreationMessage): proto.Message.ScheduledCallCreationMessage;
            public static encode(m: proto.Message.IScheduledCallCreationMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ScheduledCallCreationMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ScheduledCallCreationMessage {

            enum CallType {
                UNKNOWN = 0,
                VOICE = 1,
                VIDEO = 2
            }
        }

        interface IScheduledCallEditMessage {
            key?: (proto.IMessageKey|null);
            editType?: (proto.Message.ScheduledCallEditMessage.EditType|null);
        }

        class ScheduledCallEditMessage implements IScheduledCallEditMessage {
            constructor(p?: proto.Message.IScheduledCallEditMessage);
            public key?: (proto.IMessageKey|null);
            public editType: proto.Message.ScheduledCallEditMessage.EditType;
            public static create(properties?: proto.Message.IScheduledCallEditMessage): proto.Message.ScheduledCallEditMessage;
            public static encode(m: proto.Message.IScheduledCallEditMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.ScheduledCallEditMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ScheduledCallEditMessage {

            enum EditType {
                UNKNOWN = 0,
                CANCEL = 1
            }
        }

        interface ISecretEncryptedMessage {
            targetMessageKey?: (proto.IMessageKey|null);
            encPayload?: (Uint8Array|null);
            encIv?: (Uint8Array|null);
            secretEncType?: (proto.Message.SecretEncryptedMessage.SecretEncType|null);
        }

        class SecretEncryptedMessage implements ISecretEncryptedMessage {
            constructor(p?: proto.Message.ISecretEncryptedMessage);
            public targetMessageKey?: (proto.IMessageKey|null);
            public encPayload: Uint8Array;
            public encIv: Uint8Array;
            public secretEncType: proto.Message.SecretEncryptedMessage.SecretEncType;
            public static create(properties?: proto.Message.ISecretEncryptedMessage): proto.Message.SecretEncryptedMessage;
            public static encode(m: proto.Message.ISecretEncryptedMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.SecretEncryptedMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace SecretEncryptedMessage {

            enum SecretEncType {
                UNKNOWN = 0,
                EVENT_EDIT = 1,
                MESSAGE_EDIT = 2
            }
        }

        interface ISendPaymentMessage {
            noteMessage?: (proto.IMessage|null);
            requestMessageKey?: (proto.IMessageKey|null);
            background?: (proto.IPaymentBackground|null);
        }

        class SendPaymentMessage implements ISendPaymentMessage {
            constructor(p?: proto.Message.ISendPaymentMessage);
            public noteMessage?: (proto.IMessage|null);
            public requestMessageKey?: (proto.IMessageKey|null);
            public background?: (proto.IPaymentBackground|null);
            public static create(properties?: proto.Message.ISendPaymentMessage): proto.Message.SendPaymentMessage;
            public static encode(m: proto.Message.ISendPaymentMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.SendPaymentMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISenderKeyDistributionMessage {
            groupId?: (string|null);
            axolotlSenderKeyDistributionMessage?: (Uint8Array|null);
        }

        class SenderKeyDistributionMessage implements ISenderKeyDistributionMessage {
            constructor(p?: proto.Message.ISenderKeyDistributionMessage);
            public groupId: string;
            public axolotlSenderKeyDistributionMessage: Uint8Array;
            public static create(properties?: proto.Message.ISenderKeyDistributionMessage): proto.Message.SenderKeyDistributionMessage;
            public static encode(m: proto.Message.ISenderKeyDistributionMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.SenderKeyDistributionMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IStatusNotificationMessage {
            responseMessageKey?: (proto.IMessageKey|null);
            originalMessageKey?: (proto.IMessageKey|null);
            type?: (proto.Message.StatusNotificationMessage.StatusNotificationType|null);
        }

        class StatusNotificationMessage implements IStatusNotificationMessage {
            constructor(p?: proto.Message.IStatusNotificationMessage);
            public responseMessageKey?: (proto.IMessageKey|null);
            public originalMessageKey?: (proto.IMessageKey|null);
            public type: proto.Message.StatusNotificationMessage.StatusNotificationType;
            public static create(properties?: proto.Message.IStatusNotificationMessage): proto.Message.StatusNotificationMessage;
            public static encode(m: proto.Message.IStatusNotificationMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.StatusNotificationMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace StatusNotificationMessage {

            enum StatusNotificationType {
                UNKNOWN = 0,
                STATUS_ADD_YOURS = 1,
                STATUS_RESHARE = 2
            }
        }

        interface IStickerMessage {
            url?: (string|null);
            fileSha256?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            mimetype?: (string|null);
            height?: (number|null);
            width?: (number|null);
            directPath?: (string|null);
            fileLength?: (number|Long|null);
            mediaKeyTimestamp?: (number|Long|null);
            firstFrameLength?: (number|null);
            firstFrameSidecar?: (Uint8Array|null);
            isAnimated?: (boolean|null);
            pngThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
            stickerSentTs?: (number|Long|null);
            isAvatar?: (boolean|null);
            isAiSticker?: (boolean|null);
            isLottie?: (boolean|null);
            accessibilityLabel?: (string|null);
        }

        class StickerMessage implements IStickerMessage {
            constructor(p?: proto.Message.IStickerMessage);
            public url: string;
            public fileSha256: Uint8Array;
            public fileEncSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public mimetype: string;
            public height: number;
            public width: number;
            public directPath: string;
            public fileLength: (number|Long);
            public mediaKeyTimestamp: (number|Long);
            public firstFrameLength: number;
            public firstFrameSidecar: Uint8Array;
            public isAnimated: boolean;
            public pngThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public stickerSentTs: (number|Long);
            public isAvatar: boolean;
            public isAiSticker: boolean;
            public isLottie: boolean;
            public accessibilityLabel: string;
            public static create(properties?: proto.Message.IStickerMessage): proto.Message.StickerMessage;
            public static encode(m: proto.Message.IStickerMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.StickerMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IStickerPackMessage {
            stickerPackId?: (string|null);
            name?: (string|null);
            publisher?: (string|null);
            stickers?: (proto.Message.StickerPackMessage.ISticker[]|null);
            fileLength?: (number|Long|null);
            fileSha256?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            directPath?: (string|null);
            caption?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            packDescription?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            trayIconFileName?: (string|null);
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            thumbnailHeight?: (number|null);
            thumbnailWidth?: (number|null);
            imageDataHash?: (string|null);
            stickerPackSize?: (number|Long|null);
            stickerPackOrigin?: (proto.Message.StickerPackMessage.StickerPackOrigin|null);
        }

        class StickerPackMessage implements IStickerPackMessage {
            constructor(p?: proto.Message.IStickerPackMessage);
            public stickerPackId: string;
            public name: string;
            public publisher: string;
            public stickers: proto.Message.StickerPackMessage.ISticker[];
            public fileLength: (number|Long);
            public fileSha256: Uint8Array;
            public fileEncSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public directPath: string;
            public caption: string;
            public contextInfo?: (proto.IContextInfo|null);
            public packDescription: string;
            public mediaKeyTimestamp: (number|Long);
            public trayIconFileName: string;
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public thumbnailHeight: number;
            public thumbnailWidth: number;
            public imageDataHash: string;
            public stickerPackSize: (number|Long);
            public stickerPackOrigin: proto.Message.StickerPackMessage.StickerPackOrigin;
            public static create(properties?: proto.Message.IStickerPackMessage): proto.Message.StickerPackMessage;
            public static encode(m: proto.Message.IStickerPackMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.StickerPackMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace StickerPackMessage {

            interface ISticker {
                fileName?: (string|null);
                isAnimated?: (boolean|null);
                emojis?: (string[]|null);
                accessibilityLabel?: (string|null);
                isLottie?: (boolean|null);
                mimetype?: (string|null);
            }

            class Sticker implements ISticker {
                constructor(p?: proto.Message.StickerPackMessage.ISticker);
                public fileName: string;
                public isAnimated: boolean;
                public emojis: string[];
                public accessibilityLabel: string;
                public isLottie: boolean;
                public mimetype: string;
                public static create(properties?: proto.Message.StickerPackMessage.ISticker): proto.Message.StickerPackMessage.Sticker;
                public static encode(m: proto.Message.StickerPackMessage.ISticker, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.StickerPackMessage.Sticker;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            enum StickerPackOrigin {
                FIRST_PARTY = 0,
                THIRD_PARTY = 1,
                USER_CREATED = 2
            }
        }

        interface IStickerSyncRMRMessage {
            filehash?: (string[]|null);
            rmrSource?: (string|null);
            requestTimestamp?: (number|Long|null);
        }

        class StickerSyncRMRMessage implements IStickerSyncRMRMessage {
            constructor(p?: proto.Message.IStickerSyncRMRMessage);
            public filehash: string[];
            public rmrSource: string;
            public requestTimestamp: (number|Long);
            public static create(properties?: proto.Message.IStickerSyncRMRMessage): proto.Message.StickerSyncRMRMessage;
            public static encode(m: proto.Message.IStickerSyncRMRMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.StickerSyncRMRMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ITemplateButtonReplyMessage {
            selectedId?: (string|null);
            selectedDisplayText?: (string|null);
            contextInfo?: (proto.IContextInfo|null);
            selectedIndex?: (number|null);
            selectedCarouselCardIndex?: (number|null);
        }

        class TemplateButtonReplyMessage implements ITemplateButtonReplyMessage {
            constructor(p?: proto.Message.ITemplateButtonReplyMessage);
            public selectedId: string;
            public selectedDisplayText: string;
            public contextInfo?: (proto.IContextInfo|null);
            public selectedIndex: number;
            public selectedCarouselCardIndex: number;
            public static create(properties?: proto.Message.ITemplateButtonReplyMessage): proto.Message.TemplateButtonReplyMessage;
            public static encode(m: proto.Message.ITemplateButtonReplyMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.TemplateButtonReplyMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ITemplateMessage {
            contextInfo?: (proto.IContextInfo|null);
            hydratedTemplate?: (proto.Message.TemplateMessage.IHydratedFourRowTemplate|null);
            templateId?: (string|null);
            fourRowTemplate?: (proto.Message.TemplateMessage.IFourRowTemplate|null);
            hydratedFourRowTemplate?: (proto.Message.TemplateMessage.IHydratedFourRowTemplate|null);
            interactiveMessageTemplate?: (proto.Message.IInteractiveMessage|null);
        }

        class TemplateMessage implements ITemplateMessage {
            constructor(p?: proto.Message.ITemplateMessage);
            public contextInfo?: (proto.IContextInfo|null);
            public hydratedTemplate?: (proto.Message.TemplateMessage.IHydratedFourRowTemplate|null);
            public templateId: string;
            public fourRowTemplate?: (proto.Message.TemplateMessage.IFourRowTemplate|null);
            public hydratedFourRowTemplate?: (proto.Message.TemplateMessage.IHydratedFourRowTemplate|null);
            public interactiveMessageTemplate?: (proto.Message.IInteractiveMessage|null);
            public format?: ("fourRowTemplate"|"hydratedFourRowTemplate"|"interactiveMessageTemplate");
            public static create(properties?: proto.Message.ITemplateMessage): proto.Message.TemplateMessage;
            public static encode(m: proto.Message.ITemplateMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.TemplateMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace TemplateMessage {

            interface IFourRowTemplate {
                content?: (proto.Message.IHighlyStructuredMessage|null);
                footer?: (proto.Message.IHighlyStructuredMessage|null);
                buttons?: (proto.ITemplateButton[]|null);
                documentMessage?: (proto.Message.IDocumentMessage|null);
                highlyStructuredMessage?: (proto.Message.IHighlyStructuredMessage|null);
                imageMessage?: (proto.Message.IImageMessage|null);
                videoMessage?: (proto.Message.IVideoMessage|null);
                locationMessage?: (proto.Message.ILocationMessage|null);
            }

            class FourRowTemplate implements IFourRowTemplate {
                constructor(p?: proto.Message.TemplateMessage.IFourRowTemplate);
                public content?: (proto.Message.IHighlyStructuredMessage|null);
                public footer?: (proto.Message.IHighlyStructuredMessage|null);
                public buttons: proto.ITemplateButton[];
                public documentMessage?: (proto.Message.IDocumentMessage|null);
                public highlyStructuredMessage?: (proto.Message.IHighlyStructuredMessage|null);
                public imageMessage?: (proto.Message.IImageMessage|null);
                public videoMessage?: (proto.Message.IVideoMessage|null);
                public locationMessage?: (proto.Message.ILocationMessage|null);
                public title?: ("documentMessage"|"highlyStructuredMessage"|"imageMessage"|"videoMessage"|"locationMessage");
                public static create(properties?: proto.Message.TemplateMessage.IFourRowTemplate): proto.Message.TemplateMessage.FourRowTemplate;
                public static encode(m: proto.Message.TemplateMessage.IFourRowTemplate, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.TemplateMessage.FourRowTemplate;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IHydratedFourRowTemplate {
                hydratedContentText?: (string|null);
                hydratedFooterText?: (string|null);
                hydratedButtons?: (proto.IHydratedTemplateButton[]|null);
                templateId?: (string|null);
                maskLinkedDevices?: (boolean|null);
                documentMessage?: (proto.Message.IDocumentMessage|null);
                hydratedTitleText?: (string|null);
                imageMessage?: (proto.Message.IImageMessage|null);
                videoMessage?: (proto.Message.IVideoMessage|null);
                locationMessage?: (proto.Message.ILocationMessage|null);
            }

            class HydratedFourRowTemplate implements IHydratedFourRowTemplate {
                constructor(p?: proto.Message.TemplateMessage.IHydratedFourRowTemplate);
                public hydratedContentText: string;
                public hydratedFooterText: string;
                public hydratedButtons: proto.IHydratedTemplateButton[];
                public templateId: string;
                public maskLinkedDevices: boolean;
                public documentMessage?: (proto.Message.IDocumentMessage|null);
                public hydratedTitleText?: (string|null);
                public imageMessage?: (proto.Message.IImageMessage|null);
                public videoMessage?: (proto.Message.IVideoMessage|null);
                public locationMessage?: (proto.Message.ILocationMessage|null);
                public title?: ("documentMessage"|"hydratedTitleText"|"imageMessage"|"videoMessage"|"locationMessage");
                public static create(properties?: proto.Message.TemplateMessage.IHydratedFourRowTemplate): proto.Message.TemplateMessage.HydratedFourRowTemplate;
                public static encode(m: proto.Message.TemplateMessage.IHydratedFourRowTemplate, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.TemplateMessage.HydratedFourRowTemplate;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IURLMetadata {
            fbExperimentId?: (number|null);
        }

        class URLMetadata implements IURLMetadata {
            constructor(p?: proto.Message.IURLMetadata);
            public fbExperimentId: number;
            public static create(properties?: proto.Message.IURLMetadata): proto.Message.URLMetadata;
            public static encode(m: proto.Message.IURLMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.URLMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IVideoMessage {
            url?: (string|null);
            mimetype?: (string|null);
            fileSha256?: (Uint8Array|null);
            fileLength?: (number|Long|null);
            seconds?: (number|null);
            mediaKey?: (Uint8Array|null);
            caption?: (string|null);
            gifPlayback?: (boolean|null);
            height?: (number|null);
            width?: (number|null);
            fileEncSha256?: (Uint8Array|null);
            interactiveAnnotations?: (proto.IInteractiveAnnotation[]|null);
            directPath?: (string|null);
            mediaKeyTimestamp?: (number|Long|null);
            jpegThumbnail?: (Uint8Array|null);
            contextInfo?: (proto.IContextInfo|null);
            streamingSidecar?: (Uint8Array|null);
            gifAttribution?: (proto.Message.VideoMessage.Attribution|null);
            viewOnce?: (boolean|null);
            thumbnailDirectPath?: (string|null);
            thumbnailSha256?: (Uint8Array|null);
            thumbnailEncSha256?: (Uint8Array|null);
            staticUrl?: (string|null);
            annotations?: (proto.IInteractiveAnnotation[]|null);
            accessibilityLabel?: (string|null);
            processedVideos?: (proto.IProcessedVideo[]|null);
            externalShareFullVideoDurationInSeconds?: (number|null);
        }

        class VideoMessage implements IVideoMessage {
            constructor(p?: proto.Message.IVideoMessage);
            public url: string;
            public mimetype: string;
            public fileSha256: Uint8Array;
            public fileLength: (number|Long);
            public seconds: number;
            public mediaKey: Uint8Array;
            public caption: string;
            public gifPlayback: boolean;
            public height: number;
            public width: number;
            public fileEncSha256: Uint8Array;
            public interactiveAnnotations: proto.IInteractiveAnnotation[];
            public directPath: string;
            public mediaKeyTimestamp: (number|Long);
            public jpegThumbnail: Uint8Array;
            public contextInfo?: (proto.IContextInfo|null);
            public streamingSidecar: Uint8Array;
            public gifAttribution: proto.Message.VideoMessage.Attribution;
            public viewOnce: boolean;
            public thumbnailDirectPath: string;
            public thumbnailSha256: Uint8Array;
            public thumbnailEncSha256: Uint8Array;
            public staticUrl: string;
            public annotations: proto.IInteractiveAnnotation[];
            public accessibilityLabel: string;
            public processedVideos: proto.IProcessedVideo[];
            public externalShareFullVideoDurationInSeconds: number;
            public static create(properties?: proto.Message.IVideoMessage): proto.Message.VideoMessage;
            public static encode(m: proto.Message.IVideoMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Message.VideoMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace VideoMessage {

            enum Attribution {
                NONE = 0,
                GIPHY = 1,
                TENOR = 2
            }
        }
    }

    interface IMessageAddOn {
        messageAddOnType?: (proto.MessageAddOn.MessageAddOnType|null);
        messageAddOn?: (proto.IMessage|null);
        senderTimestampMs?: (number|Long|null);
        serverTimestampMs?: (number|Long|null);
        status?: (proto.WebMessageInfo.Status|null);
        addOnContextInfo?: (proto.IMessageAddOnContextInfo|null);
        messageAddOnKey?: (proto.IMessageKey|null);
        legacyMessage?: (proto.ILegacyMessage|null);
    }

    class MessageAddOn implements IMessageAddOn {
        constructor(p?: proto.IMessageAddOn);
        public messageAddOnType: proto.MessageAddOn.MessageAddOnType;
        public messageAddOn?: (proto.IMessage|null);
        public senderTimestampMs: (number|Long);
        public serverTimestampMs: (number|Long);
        public status: proto.WebMessageInfo.Status;
        public addOnContextInfo?: (proto.IMessageAddOnContextInfo|null);
        public messageAddOnKey?: (proto.IMessageKey|null);
        public legacyMessage?: (proto.ILegacyMessage|null);
        public static create(properties?: proto.IMessageAddOn): proto.MessageAddOn;
        public static encode(m: proto.IMessageAddOn, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageAddOn;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MessageAddOn {

        enum MessageAddOnType {
            UNDEFINED = 0,
            REACTION = 1,
            EVENT_RESPONSE = 2,
            POLL_UPDATE = 3,
            PIN_IN_CHAT = 4
        }
    }

    interface IMessageAddOnContextInfo {
        messageAddOnDurationInSecs?: (number|null);
        messageAddOnExpiryType?: (proto.MessageContextInfo.MessageAddonExpiryType|null);
    }

    class MessageAddOnContextInfo implements IMessageAddOnContextInfo {
        constructor(p?: proto.IMessageAddOnContextInfo);
        public messageAddOnDurationInSecs: number;
        public messageAddOnExpiryType: proto.MessageContextInfo.MessageAddonExpiryType;
        public static create(properties?: proto.IMessageAddOnContextInfo): proto.MessageAddOnContextInfo;
        public static encode(m: proto.IMessageAddOnContextInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageAddOnContextInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMessageAssociation {
        associationType?: (proto.MessageAssociation.AssociationType|null);
        parentMessageKey?: (proto.IMessageKey|null);
        messageIndex?: (number|null);
    }

    class MessageAssociation implements IMessageAssociation {
        constructor(p?: proto.IMessageAssociation);
        public associationType: proto.MessageAssociation.AssociationType;
        public parentMessageKey?: (proto.IMessageKey|null);
        public messageIndex: number;
        public static create(properties?: proto.IMessageAssociation): proto.MessageAssociation;
        public static encode(m: proto.IMessageAssociation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageAssociation;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MessageAssociation {

        enum AssociationType {
            UNKNOWN = 0,
            MEDIA_ALBUM = 1,
            BOT_PLUGIN = 2,
            EVENT_COVER_IMAGE = 3,
            STATUS_POLL = 4,
            HD_VIDEO_DUAL_UPLOAD = 5,
            STATUS_EXTERNAL_RESHARE = 6,
            MEDIA_POLL = 7,
            STATUS_ADD_YOURS = 8,
            STATUS_NOTIFICATION = 9,
            HD_IMAGE_DUAL_UPLOAD = 10,
            STICKER_ANNOTATION = 11,
            MOTION_PHOTO = 12,
            STATUS_LINK_ACTION = 13,
            VIEW_ALL_REPLIES = 14
        }
    }

    interface IMessageContextInfo {
        deviceListMetadata?: (proto.IDeviceListMetadata|null);
        deviceListMetadataVersion?: (number|null);
        messageSecret?: (Uint8Array|null);
        paddingBytes?: (Uint8Array|null);
        messageAddOnDurationInSecs?: (number|null);
        botMessageSecret?: (Uint8Array|null);
        botMetadata?: (proto.IBotMetadata|null);
        reportingTokenVersion?: (number|null);
        messageAddOnExpiryType?: (proto.MessageContextInfo.MessageAddonExpiryType|null);
        messageAssociation?: (proto.IMessageAssociation|null);
        capiCreatedGroup?: (boolean|null);
        supportPayload?: (string|null);
        limitSharing?: (proto.ILimitSharing|null);
        limitSharingV2?: (proto.ILimitSharing|null);
    }

    class MessageContextInfo implements IMessageContextInfo {
        constructor(p?: proto.IMessageContextInfo);
        public deviceListMetadata?: (proto.IDeviceListMetadata|null);
        public deviceListMetadataVersion: number;
        public messageSecret: Uint8Array;
        public paddingBytes: Uint8Array;
        public messageAddOnDurationInSecs: number;
        public botMessageSecret: Uint8Array;
        public botMetadata?: (proto.IBotMetadata|null);
        public reportingTokenVersion: number;
        public messageAddOnExpiryType: proto.MessageContextInfo.MessageAddonExpiryType;
        public messageAssociation?: (proto.IMessageAssociation|null);
        public capiCreatedGroup: boolean;
        public supportPayload: string;
        public limitSharing?: (proto.ILimitSharing|null);
        public limitSharingV2?: (proto.ILimitSharing|null);
        public static create(properties?: proto.IMessageContextInfo): proto.MessageContextInfo;
        public static encode(m: proto.IMessageContextInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageContextInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MessageContextInfo {

        enum MessageAddonExpiryType {
            STATIC = 1,
            DEPENDENT_ON_PARENT = 2
        }
    }

    interface IMessageKey {
        remoteJid?: (string|null);
        fromMe?: (boolean|null);
        id?: (string|null);
        participant?: (string|null);
    }

    class MessageKey implements IMessageKey {
        constructor(p?: proto.IMessageKey);
        public remoteJid: string;
        public fromMe: boolean;
        public id: string;
        public participant: string;
        public static create(properties?: proto.IMessageKey): proto.MessageKey;
        public static encode(m: proto.IMessageKey, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageKey;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMessageSecretMessage {
        version?: (number|null);
        encIv?: (Uint8Array|null);
        encPayload?: (Uint8Array|null);
    }

    class MessageSecretMessage implements IMessageSecretMessage {
        constructor(p?: proto.IMessageSecretMessage);
        public version: number;
        public encIv: Uint8Array;
        public encPayload: Uint8Array;
        public static create(properties?: proto.IMessageSecretMessage): proto.MessageSecretMessage;
        public static encode(m: proto.IMessageSecretMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MessageSecretMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMoney {
        value?: (number|Long|null);
        offset?: (number|null);
        currencyCode?: (string|null);
    }

    class Money implements IMoney {
        constructor(p?: proto.IMoney);
        public value: (number|Long);
        public offset: number;
        public currencyCode: string;
        public static create(properties?: proto.IMoney): proto.Money;
        public static encode(m: proto.IMoney, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Money;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMsgOpaqueData {
        body?: (string|null);
        caption?: (string|null);
        lng?: (number|null);
        isLive?: (boolean|null);
        lat?: (number|null);
        paymentAmount1000?: (number|null);
        paymentNoteMsgBody?: (string|null);
        matchedText?: (string|null);
        title?: (string|null);
        description?: (string|null);
        futureproofBuffer?: (Uint8Array|null);
        clientUrl?: (string|null);
        loc?: (string|null);
        pollName?: (string|null);
        pollOptions?: (proto.MsgOpaqueData.IPollOption[]|null);
        pollSelectableOptionsCount?: (number|null);
        messageSecret?: (Uint8Array|null);
        originalSelfAuthor?: (string|null);
        senderTimestampMs?: (number|Long|null);
        pollUpdateParentKey?: (string|null);
        encPollVote?: (proto.IPollEncValue|null);
        isSentCagPollCreation?: (boolean|null);
        pollContentType?: (proto.MsgOpaqueData.PollContentType|null);
        pollVotesSnapshot?: (proto.MsgOpaqueData.IPollVotesSnapshot|null);
        encReactionTargetMessageKey?: (string|null);
        encReactionEncPayload?: (Uint8Array|null);
        encReactionEncIv?: (Uint8Array|null);
        botMessageSecret?: (Uint8Array|null);
        targetMessageKey?: (string|null);
        encPayload?: (Uint8Array|null);
        encIv?: (Uint8Array|null);
        eventName?: (string|null);
        isEventCanceled?: (boolean|null);
        eventDescription?: (string|null);
        eventJoinLink?: (string|null);
        eventStartTime?: (number|Long|null);
        eventLocation?: (proto.MsgOpaqueData.IEventLocation|null);
        eventEndTime?: (number|Long|null);
        plainProtobufBytes?: (Uint8Array|null);
    }

    class MsgOpaqueData implements IMsgOpaqueData {
        constructor(p?: proto.IMsgOpaqueData);
        public body: string;
        public caption: string;
        public lng: number;
        public isLive: boolean;
        public lat: number;
        public paymentAmount1000: number;
        public paymentNoteMsgBody: string;
        public matchedText: string;
        public title: string;
        public description: string;
        public futureproofBuffer: Uint8Array;
        public clientUrl: string;
        public loc: string;
        public pollName: string;
        public pollOptions: proto.MsgOpaqueData.IPollOption[];
        public pollSelectableOptionsCount: number;
        public messageSecret: Uint8Array;
        public originalSelfAuthor: string;
        public senderTimestampMs: (number|Long);
        public pollUpdateParentKey: string;
        public encPollVote?: (proto.IPollEncValue|null);
        public isSentCagPollCreation: boolean;
        public pollContentType: proto.MsgOpaqueData.PollContentType;
        public pollVotesSnapshot?: (proto.MsgOpaqueData.IPollVotesSnapshot|null);
        public encReactionTargetMessageKey: string;
        public encReactionEncPayload: Uint8Array;
        public encReactionEncIv: Uint8Array;
        public botMessageSecret: Uint8Array;
        public targetMessageKey: string;
        public encPayload: Uint8Array;
        public encIv: Uint8Array;
        public eventName: string;
        public isEventCanceled: boolean;
        public eventDescription: string;
        public eventJoinLink: string;
        public eventStartTime: (number|Long);
        public eventLocation?: (proto.MsgOpaqueData.IEventLocation|null);
        public eventEndTime: (number|Long);
        public plainProtobufBytes: Uint8Array;
        public static create(properties?: proto.IMsgOpaqueData): proto.MsgOpaqueData;
        public static encode(m: proto.IMsgOpaqueData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgOpaqueData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MsgOpaqueData {

        interface IEventLocation {
            degreesLatitude?: (number|null);
            degreesLongitude?: (number|null);
            name?: (string|null);
            address?: (string|null);
            url?: (string|null);
            jpegThumbnail?: (Uint8Array|null);
        }

        class EventLocation implements IEventLocation {
            constructor(p?: proto.MsgOpaqueData.IEventLocation);
            public degreesLatitude: number;
            public degreesLongitude: number;
            public name: string;
            public address: string;
            public url: string;
            public jpegThumbnail: Uint8Array;
            public static create(properties?: proto.MsgOpaqueData.IEventLocation): proto.MsgOpaqueData.EventLocation;
            public static encode(m: proto.MsgOpaqueData.IEventLocation, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgOpaqueData.EventLocation;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum PollContentType {
            UNKNOWN = 0,
            TEXT = 1,
            IMAGE = 2
        }

        interface IPollOption {
            name?: (string|null);
            hash?: (string|null);
        }

        class PollOption implements IPollOption {
            constructor(p?: proto.MsgOpaqueData.IPollOption);
            public name: string;
            public hash: string;
            public static create(properties?: proto.MsgOpaqueData.IPollOption): proto.MsgOpaqueData.PollOption;
            public static encode(m: proto.MsgOpaqueData.IPollOption, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgOpaqueData.PollOption;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPollVoteSnapshot {
            option?: (proto.MsgOpaqueData.IPollOption|null);
            optionVoteCount?: (number|null);
        }

        class PollVoteSnapshot implements IPollVoteSnapshot {
            constructor(p?: proto.MsgOpaqueData.IPollVoteSnapshot);
            public option?: (proto.MsgOpaqueData.IPollOption|null);
            public optionVoteCount: number;
            public static create(properties?: proto.MsgOpaqueData.IPollVoteSnapshot): proto.MsgOpaqueData.PollVoteSnapshot;
            public static encode(m: proto.MsgOpaqueData.IPollVoteSnapshot, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgOpaqueData.PollVoteSnapshot;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPollVotesSnapshot {
            pollVotes?: (proto.MsgOpaqueData.IPollVoteSnapshot[]|null);
        }

        class PollVotesSnapshot implements IPollVotesSnapshot {
            constructor(p?: proto.MsgOpaqueData.IPollVotesSnapshot);
            public pollVotes: proto.MsgOpaqueData.IPollVoteSnapshot[];
            public static create(properties?: proto.MsgOpaqueData.IPollVotesSnapshot): proto.MsgOpaqueData.PollVotesSnapshot;
            public static encode(m: proto.MsgOpaqueData.IPollVotesSnapshot, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgOpaqueData.PollVotesSnapshot;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IMsgRowOpaqueData {
        currentMsg?: (proto.IMsgOpaqueData|null);
        quotedMsg?: (proto.IMsgOpaqueData|null);
    }

    class MsgRowOpaqueData implements IMsgRowOpaqueData {
        constructor(p?: proto.IMsgRowOpaqueData);
        public currentMsg?: (proto.IMsgOpaqueData|null);
        public quotedMsg?: (proto.IMsgOpaqueData|null);
        public static create(properties?: proto.IMsgRowOpaqueData): proto.MsgRowOpaqueData;
        public static encode(m: proto.IMsgRowOpaqueData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.MsgRowOpaqueData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface INoiseCertificate {
        details?: (Uint8Array|null);
        signature?: (Uint8Array|null);
    }

    class NoiseCertificate implements INoiseCertificate {
        constructor(p?: proto.INoiseCertificate);
        public details: Uint8Array;
        public signature: Uint8Array;
        public static create(properties?: proto.INoiseCertificate): proto.NoiseCertificate;
        public static encode(m: proto.INoiseCertificate, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.NoiseCertificate;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace NoiseCertificate {

        interface IDetails {
            serial?: (number|null);
            issuer?: (string|null);
            expires?: (number|Long|null);
            subject?: (string|null);
            key?: (Uint8Array|null);
        }

        class Details implements IDetails {
            constructor(p?: proto.NoiseCertificate.IDetails);
            public serial: number;
            public issuer: string;
            public expires: (number|Long);
            public subject: string;
            public key: Uint8Array;
            public static create(properties?: proto.NoiseCertificate.IDetails): proto.NoiseCertificate.Details;
            public static encode(m: proto.NoiseCertificate.IDetails, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.NoiseCertificate.Details;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface INotificationMessageInfo {
        key?: (proto.IMessageKey|null);
        message?: (proto.IMessage|null);
        messageTimestamp?: (number|Long|null);
        participant?: (string|null);
    }

    class NotificationMessageInfo implements INotificationMessageInfo {
        constructor(p?: proto.INotificationMessageInfo);
        public key?: (proto.IMessageKey|null);
        public message?: (proto.IMessage|null);
        public messageTimestamp: (number|Long);
        public participant: string;
        public static create(properties?: proto.INotificationMessageInfo): proto.NotificationMessageInfo;
        public static encode(m: proto.INotificationMessageInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.NotificationMessageInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface INotificationSettings {
        messageVibrate?: (string|null);
        messagePopup?: (string|null);
        messageLight?: (string|null);
        lowPriorityNotifications?: (boolean|null);
        reactionsMuted?: (boolean|null);
        callVibrate?: (string|null);
    }

    class NotificationSettings implements INotificationSettings {
        constructor(p?: proto.INotificationSettings);
        public messageVibrate: string;
        public messagePopup: string;
        public messageLight: string;
        public lowPriorityNotifications: boolean;
        public reactionsMuted: boolean;
        public callVibrate: string;
        public static create(properties?: proto.INotificationSettings): proto.NotificationSettings;
        public static encode(m: proto.INotificationSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.NotificationSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPairingRequest {
        companionPublicKey?: (Uint8Array|null);
        companionIdentityKey?: (Uint8Array|null);
        advSecret?: (Uint8Array|null);
    }

    class PairingRequest implements IPairingRequest {
        constructor(p?: proto.IPairingRequest);
        public companionPublicKey: Uint8Array;
        public companionIdentityKey: Uint8Array;
        public advSecret: Uint8Array;
        public static create(properties?: proto.IPairingRequest): proto.PairingRequest;
        public static encode(m: proto.IPairingRequest, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PairingRequest;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPastParticipant {
        userJid?: (string|null);
        leaveReason?: (proto.PastParticipant.LeaveReason|null);
        leaveTs?: (number|Long|null);
    }

    class PastParticipant implements IPastParticipant {
        constructor(p?: proto.IPastParticipant);
        public userJid: string;
        public leaveReason: proto.PastParticipant.LeaveReason;
        public leaveTs: (number|Long);
        public static create(properties?: proto.IPastParticipant): proto.PastParticipant;
        public static encode(m: proto.IPastParticipant, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PastParticipant;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PastParticipant {

        enum LeaveReason {
            LEFT = 0,
            REMOVED = 1
        }
    }

    interface IPastParticipants {
        groupJid?: (string|null);
        pastParticipants?: (proto.IPastParticipant[]|null);
    }

    class PastParticipants implements IPastParticipants {
        constructor(p?: proto.IPastParticipants);
        public groupJid: string;
        public pastParticipants: proto.IPastParticipant[];
        public static create(properties?: proto.IPastParticipants): proto.PastParticipants;
        public static encode(m: proto.IPastParticipants, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PastParticipants;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPatchDebugData {
        currentLthash?: (Uint8Array|null);
        newLthash?: (Uint8Array|null);
        patchVersion?: (Uint8Array|null);
        collectionName?: (Uint8Array|null);
        firstFourBytesFromAHashOfSnapshotMacKey?: (Uint8Array|null);
        newLthashSubtract?: (Uint8Array|null);
        numberAdd?: (number|null);
        numberRemove?: (number|null);
        numberOverride?: (number|null);
        senderPlatform?: (proto.PatchDebugData.Platform|null);
        isSenderPrimary?: (boolean|null);
    }

    class PatchDebugData implements IPatchDebugData {
        constructor(p?: proto.IPatchDebugData);
        public currentLthash: Uint8Array;
        public newLthash: Uint8Array;
        public patchVersion: Uint8Array;
        public collectionName: Uint8Array;
        public firstFourBytesFromAHashOfSnapshotMacKey: Uint8Array;
        public newLthashSubtract: Uint8Array;
        public numberAdd: number;
        public numberRemove: number;
        public numberOverride: number;
        public senderPlatform: proto.PatchDebugData.Platform;
        public isSenderPrimary: boolean;
        public static create(properties?: proto.IPatchDebugData): proto.PatchDebugData;
        public static encode(m: proto.IPatchDebugData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PatchDebugData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PatchDebugData {

        enum Platform {
            ANDROID = 0,
            SMBA = 1,
            IPHONE = 2,
            SMBI = 3,
            WEB = 4,
            UWP = 5,
            DARWIN = 6,
            IPAD = 7,
            WEAROS = 8
        }
    }

    interface IPaymentBackground {
        id?: (string|null);
        fileLength?: (number|Long|null);
        width?: (number|null);
        height?: (number|null);
        mimetype?: (string|null);
        placeholderArgb?: (number|null);
        textArgb?: (number|null);
        subtextArgb?: (number|null);
        mediaData?: (proto.PaymentBackground.IMediaData|null);
        type?: (proto.PaymentBackground.Type|null);
    }

    class PaymentBackground implements IPaymentBackground {
        constructor(p?: proto.IPaymentBackground);
        public id: string;
        public fileLength: (number|Long);
        public width: number;
        public height: number;
        public mimetype: string;
        public placeholderArgb: number;
        public textArgb: number;
        public subtextArgb: number;
        public mediaData?: (proto.PaymentBackground.IMediaData|null);
        public type: proto.PaymentBackground.Type;
        public static create(properties?: proto.IPaymentBackground): proto.PaymentBackground;
        public static encode(m: proto.IPaymentBackground, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PaymentBackground;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PaymentBackground {

        interface IMediaData {
            mediaKey?: (Uint8Array|null);
            mediaKeyTimestamp?: (number|Long|null);
            fileSha256?: (Uint8Array|null);
            fileEncSha256?: (Uint8Array|null);
            directPath?: (string|null);
        }

        class MediaData implements IMediaData {
            constructor(p?: proto.PaymentBackground.IMediaData);
            public mediaKey: Uint8Array;
            public mediaKeyTimestamp: (number|Long);
            public fileSha256: Uint8Array;
            public fileEncSha256: Uint8Array;
            public directPath: string;
            public static create(properties?: proto.PaymentBackground.IMediaData): proto.PaymentBackground.MediaData;
            public static encode(m: proto.PaymentBackground.IMediaData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PaymentBackground.MediaData;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        enum Type {
            UNKNOWN = 0,
            DEFAULT = 1
        }
    }

    interface IPaymentInfo {
        currencyDeprecated?: (proto.PaymentInfo.Currency|null);
        amount1000?: (number|Long|null);
        receiverJid?: (string|null);
        status?: (proto.PaymentInfo.Status|null);
        transactionTimestamp?: (number|Long|null);
        requestMessageKey?: (proto.IMessageKey|null);
        expiryTimestamp?: (number|Long|null);
        futureproofed?: (boolean|null);
        currency?: (string|null);
        txnStatus?: (proto.PaymentInfo.TxnStatus|null);
        useNoviFiatFormat?: (boolean|null);
        primaryAmount?: (proto.IMoney|null);
        exchangeAmount?: (proto.IMoney|null);
    }

    class PaymentInfo implements IPaymentInfo {
        constructor(p?: proto.IPaymentInfo);
        public currencyDeprecated: proto.PaymentInfo.Currency;
        public amount1000: (number|Long);
        public receiverJid: string;
        public status: proto.PaymentInfo.Status;
        public transactionTimestamp: (number|Long);
        public requestMessageKey?: (proto.IMessageKey|null);
        public expiryTimestamp: (number|Long);
        public futureproofed: boolean;
        public currency: string;
        public txnStatus: proto.PaymentInfo.TxnStatus;
        public useNoviFiatFormat: boolean;
        public primaryAmount?: (proto.IMoney|null);
        public exchangeAmount?: (proto.IMoney|null);
        public static create(properties?: proto.IPaymentInfo): proto.PaymentInfo;
        public static encode(m: proto.IPaymentInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PaymentInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PaymentInfo {

        enum Currency {
            UNKNOWN_CURRENCY = 0,
            INR = 1
        }

        enum Status {
            UNKNOWN_STATUS = 0,
            PROCESSING = 1,
            SENT = 2,
            NEED_TO_ACCEPT = 3,
            COMPLETE = 4,
            COULD_NOT_COMPLETE = 5,
            REFUNDED = 6,
            EXPIRED = 7,
            REJECTED = 8,
            CANCELLED = 9,
            WAITING_FOR_PAYER = 10,
            WAITING = 11
        }

        enum TxnStatus {
            UNKNOWN = 0,
            PENDING_SETUP = 1,
            PENDING_RECEIVER_SETUP = 2,
            INIT = 3,
            SUCCESS = 4,
            COMPLETED = 5,
            FAILED = 6,
            FAILED_RISK = 7,
            FAILED_PROCESSING = 8,
            FAILED_RECEIVER_PROCESSING = 9,
            FAILED_DA = 10,
            FAILED_DA_FINAL = 11,
            REFUNDED_TXN = 12,
            REFUND_FAILED = 13,
            REFUND_FAILED_PROCESSING = 14,
            REFUND_FAILED_DA = 15,
            EXPIRED_TXN = 16,
            AUTH_CANCELED = 17,
            AUTH_CANCEL_FAILED_PROCESSING = 18,
            AUTH_CANCEL_FAILED = 19,
            COLLECT_INIT = 20,
            COLLECT_SUCCESS = 21,
            COLLECT_FAILED = 22,
            COLLECT_FAILED_RISK = 23,
            COLLECT_REJECTED = 24,
            COLLECT_EXPIRED = 25,
            COLLECT_CANCELED = 26,
            COLLECT_CANCELLING = 27,
            IN_REVIEW = 28,
            REVERSAL_SUCCESS = 29,
            REVERSAL_PENDING = 30,
            REFUND_PENDING = 31
        }
    }

    interface IPhoneNumberToLIDMapping {
        pnJid?: (string|null);
        lidJid?: (string|null);
    }

    class PhoneNumberToLIDMapping implements IPhoneNumberToLIDMapping {
        constructor(p?: proto.IPhoneNumberToLIDMapping);
        public pnJid: string;
        public lidJid: string;
        public static create(properties?: proto.IPhoneNumberToLIDMapping): proto.PhoneNumberToLIDMapping;
        public static encode(m: proto.IPhoneNumberToLIDMapping, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PhoneNumberToLIDMapping;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPhotoChange {
        oldPhoto?: (Uint8Array|null);
        newPhoto?: (Uint8Array|null);
        newPhotoId?: (number|null);
    }

    class PhotoChange implements IPhotoChange {
        constructor(p?: proto.IPhotoChange);
        public oldPhoto: Uint8Array;
        public newPhoto: Uint8Array;
        public newPhotoId: number;
        public static create(properties?: proto.IPhotoChange): proto.PhotoChange;
        public static encode(m: proto.IPhotoChange, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PhotoChange;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPinInChat {
        type?: (proto.PinInChat.Type|null);
        key?: (proto.IMessageKey|null);
        senderTimestampMs?: (number|Long|null);
        serverTimestampMs?: (number|Long|null);
        messageAddOnContextInfo?: (proto.IMessageAddOnContextInfo|null);
    }

    class PinInChat implements IPinInChat {
        constructor(p?: proto.IPinInChat);
        public type: proto.PinInChat.Type;
        public key?: (proto.IMessageKey|null);
        public senderTimestampMs: (number|Long);
        public serverTimestampMs: (number|Long);
        public messageAddOnContextInfo?: (proto.IMessageAddOnContextInfo|null);
        public static create(properties?: proto.IPinInChat): proto.PinInChat;
        public static encode(m: proto.IPinInChat, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PinInChat;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PinInChat {

        enum Type {
            UNKNOWN_TYPE = 0,
            PIN_FOR_ALL = 1,
            UNPIN_FOR_ALL = 2
        }
    }

    interface IPoint {
        xDeprecated?: (number|null);
        yDeprecated?: (number|null);
        x?: (number|null);
        y?: (number|null);
    }

    class Point implements IPoint {
        constructor(p?: proto.IPoint);
        public xDeprecated: number;
        public yDeprecated: number;
        public x: number;
        public y: number;
        public static create(properties?: proto.IPoint): proto.Point;
        public static encode(m: proto.IPoint, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Point;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPollAdditionalMetadata {
        pollInvalidated?: (boolean|null);
    }

    class PollAdditionalMetadata implements IPollAdditionalMetadata {
        constructor(p?: proto.IPollAdditionalMetadata);
        public pollInvalidated: boolean;
        public static create(properties?: proto.IPollAdditionalMetadata): proto.PollAdditionalMetadata;
        public static encode(m: proto.IPollAdditionalMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PollAdditionalMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPollEncValue {
        encPayload?: (Uint8Array|null);
        encIv?: (Uint8Array|null);
    }

    class PollEncValue implements IPollEncValue {
        constructor(p?: proto.IPollEncValue);
        public encPayload: Uint8Array;
        public encIv: Uint8Array;
        public static create(properties?: proto.IPollEncValue): proto.PollEncValue;
        public static encode(m: proto.IPollEncValue, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PollEncValue;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPollUpdate {
        pollUpdateMessageKey?: (proto.IMessageKey|null);
        vote?: (proto.Message.IPollVoteMessage|null);
        senderTimestampMs?: (number|Long|null);
        serverTimestampMs?: (number|Long|null);
        unread?: (boolean|null);
    }

    class PollUpdate implements IPollUpdate {
        constructor(p?: proto.IPollUpdate);
        public pollUpdateMessageKey?: (proto.IMessageKey|null);
        public vote?: (proto.Message.IPollVoteMessage|null);
        public senderTimestampMs: (number|Long);
        public serverTimestampMs: (number|Long);
        public unread: boolean;
        public static create(properties?: proto.IPollUpdate): proto.PollUpdate;
        public static encode(m: proto.IPollUpdate, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PollUpdate;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPreKeyRecordStructure {
        id?: (number|null);
        publicKey?: (Uint8Array|null);
        privateKey?: (Uint8Array|null);
    }

    class PreKeyRecordStructure implements IPreKeyRecordStructure {
        constructor(p?: proto.IPreKeyRecordStructure);
        public id: number;
        public publicKey: Uint8Array;
        public privateKey: Uint8Array;
        public static create(properties?: proto.IPreKeyRecordStructure): proto.PreKeyRecordStructure;
        public static encode(m: proto.IPreKeyRecordStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PreKeyRecordStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPreKeySignalMessage {
        registrationId?: (number|null);
        preKeyId?: (number|null);
        signedPreKeyId?: (number|null);
        baseKey?: (Uint8Array|null);
        identityKey?: (Uint8Array|null);
        message?: (Uint8Array|null);
    }

    class PreKeySignalMessage implements IPreKeySignalMessage {
        constructor(p?: proto.IPreKeySignalMessage);
        public registrationId: number;
        public preKeyId: number;
        public signedPreKeyId: number;
        public baseKey: Uint8Array;
        public identityKey: Uint8Array;
        public message: Uint8Array;
        public static create(properties?: proto.IPreKeySignalMessage): proto.PreKeySignalMessage;
        public static encode(m: proto.IPreKeySignalMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PreKeySignalMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPremiumMessageInfo {
        serverCampaignId?: (string|null);
    }

    class PremiumMessageInfo implements IPremiumMessageInfo {
        constructor(p?: proto.IPremiumMessageInfo);
        public serverCampaignId: string;
        public static create(properties?: proto.IPremiumMessageInfo): proto.PremiumMessageInfo;
        public static encode(m: proto.IPremiumMessageInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PremiumMessageInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPrimaryEphemeralIdentity {
        publicKey?: (Uint8Array|null);
        nonce?: (Uint8Array|null);
    }

    class PrimaryEphemeralIdentity implements IPrimaryEphemeralIdentity {
        constructor(p?: proto.IPrimaryEphemeralIdentity);
        public publicKey: Uint8Array;
        public nonce: Uint8Array;
        public static create(properties?: proto.IPrimaryEphemeralIdentity): proto.PrimaryEphemeralIdentity;
        public static encode(m: proto.IPrimaryEphemeralIdentity, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.PrimaryEphemeralIdentity;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum PrivacySystemMessage {
        E2EE_MSG = 1,
        NE2EE_SELF = 2,
        NE2EE_OTHER = 3
    }

    interface IProcessedVideo {
        directPath?: (string|null);
        fileSha256?: (Uint8Array|null);
        height?: (number|null);
        width?: (number|null);
        fileLength?: (number|Long|null);
        bitrate?: (number|null);
        quality?: (proto.ProcessedVideo.VideoQuality|null);
        capabilities?: (string[]|null);
    }

    class ProcessedVideo implements IProcessedVideo {
        constructor(p?: proto.IProcessedVideo);
        public directPath: string;
        public fileSha256: Uint8Array;
        public height: number;
        public width: number;
        public fileLength: (number|Long);
        public bitrate: number;
        public quality: proto.ProcessedVideo.VideoQuality;
        public capabilities: string[];
        public static create(properties?: proto.IProcessedVideo): proto.ProcessedVideo;
        public static encode(m: proto.IProcessedVideo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ProcessedVideo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ProcessedVideo {

        enum VideoQuality {
            UNDEFINED = 0,
            LOW = 1,
            MID = 2,
            HIGH = 3
        }
    }

    interface IProloguePayload {
        companionEphemeralIdentity?: (Uint8Array|null);
        commitment?: (proto.ICompanionCommitment|null);
    }

    class ProloguePayload implements IProloguePayload {
        constructor(p?: proto.IProloguePayload);
        public companionEphemeralIdentity: Uint8Array;
        public commitment?: (proto.ICompanionCommitment|null);
        public static create(properties?: proto.IProloguePayload): proto.ProloguePayload;
        public static encode(m: proto.IProloguePayload, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ProloguePayload;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IPushname {
        id?: (string|null);
        pushname?: (string|null);
    }

    class Pushname implements IPushname {
        constructor(p?: proto.IPushname);
        public id: string;
        public pushname: string;
        public static create(properties?: proto.IPushname): proto.Pushname;
        public static encode(m: proto.IPushname, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Pushname;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IReaction {
        key?: (proto.IMessageKey|null);
        text?: (string|null);
        groupingKey?: (string|null);
        senderTimestampMs?: (number|Long|null);
        unread?: (boolean|null);
    }

    class Reaction implements IReaction {
        constructor(p?: proto.IReaction);
        public key?: (proto.IMessageKey|null);
        public text: string;
        public groupingKey: string;
        public senderTimestampMs: (number|Long);
        public unread: boolean;
        public static create(properties?: proto.IReaction): proto.Reaction;
        public static encode(m: proto.IReaction, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Reaction;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IRecentEmojiWeight {
        emoji?: (string|null);
        weight?: (number|null);
    }

    class RecentEmojiWeight implements IRecentEmojiWeight {
        constructor(p?: proto.IRecentEmojiWeight);
        public emoji: string;
        public weight: number;
        public static create(properties?: proto.IRecentEmojiWeight): proto.RecentEmojiWeight;
        public static encode(m: proto.IRecentEmojiWeight, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.RecentEmojiWeight;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IRecordStructure {
        currentSession?: (proto.ISessionStructure|null);
        previousSessions?: (proto.ISessionStructure[]|null);
    }

    class RecordStructure implements IRecordStructure {
        constructor(p?: proto.IRecordStructure);
        public currentSession?: (proto.ISessionStructure|null);
        public previousSessions: proto.ISessionStructure[];
        public static create(properties?: proto.IRecordStructure): proto.RecordStructure;
        public static encode(m: proto.IRecordStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.RecordStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IReportable {
        minVersion?: (number|null);
        maxVersion?: (number|null);
        notReportableMinVersion?: (number|null);
        never?: (boolean|null);
    }

    class Reportable implements IReportable {
        constructor(p?: proto.IReportable);
        public minVersion: number;
        public maxVersion: number;
        public notReportableMinVersion: number;
        public never: boolean;
        public static create(properties?: proto.IReportable): proto.Reportable;
        public static encode(m: proto.IReportable, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.Reportable;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IReportingTokenInfo {
        reportingTag?: (Uint8Array|null);
    }

    class ReportingTokenInfo implements IReportingTokenInfo {
        constructor(p?: proto.IReportingTokenInfo);
        public reportingTag: Uint8Array;
        public static create(properties?: proto.IReportingTokenInfo): proto.ReportingTokenInfo;
        public static encode(m: proto.IReportingTokenInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ReportingTokenInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISenderKeyDistributionMessage {
        id?: (number|null);
        iteration?: (number|null);
        chainKey?: (Uint8Array|null);
        signingKey?: (Uint8Array|null);
    }

    class SenderKeyDistributionMessage implements ISenderKeyDistributionMessage {
        constructor(p?: proto.ISenderKeyDistributionMessage);
        public id: number;
        public iteration: number;
        public chainKey: Uint8Array;
        public signingKey: Uint8Array;
        public static create(properties?: proto.ISenderKeyDistributionMessage): proto.SenderKeyDistributionMessage;
        public static encode(m: proto.ISenderKeyDistributionMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyDistributionMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISenderKeyMessage {
        id?: (number|null);
        iteration?: (number|null);
        ciphertext?: (Uint8Array|null);
    }

    class SenderKeyMessage implements ISenderKeyMessage {
        constructor(p?: proto.ISenderKeyMessage);
        public id: number;
        public iteration: number;
        public ciphertext: Uint8Array;
        public static create(properties?: proto.ISenderKeyMessage): proto.SenderKeyMessage;
        public static encode(m: proto.ISenderKeyMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISenderKeyRecordStructure {
        senderKeyStates?: (proto.ISenderKeyStateStructure[]|null);
    }

    class SenderKeyRecordStructure implements ISenderKeyRecordStructure {
        constructor(p?: proto.ISenderKeyRecordStructure);
        public senderKeyStates: proto.ISenderKeyStateStructure[];
        public static create(properties?: proto.ISenderKeyRecordStructure): proto.SenderKeyRecordStructure;
        public static encode(m: proto.ISenderKeyRecordStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyRecordStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISenderKeyStateStructure {
        senderKeyId?: (number|null);
        senderChainKey?: (proto.SenderKeyStateStructure.ISenderChainKey|null);
        senderSigningKey?: (proto.SenderKeyStateStructure.ISenderSigningKey|null);
        senderMessageKeys?: (proto.SenderKeyStateStructure.ISenderMessageKey[]|null);
    }

    class SenderKeyStateStructure implements ISenderKeyStateStructure {
        constructor(p?: proto.ISenderKeyStateStructure);
        public senderKeyId: number;
        public senderChainKey?: (proto.SenderKeyStateStructure.ISenderChainKey|null);
        public senderSigningKey?: (proto.SenderKeyStateStructure.ISenderSigningKey|null);
        public senderMessageKeys: proto.SenderKeyStateStructure.ISenderMessageKey[];
        public static create(properties?: proto.ISenderKeyStateStructure): proto.SenderKeyStateStructure;
        public static encode(m: proto.ISenderKeyStateStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyStateStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SenderKeyStateStructure {

        interface ISenderChainKey {
            iteration?: (number|null);
            seed?: (Uint8Array|null);
        }

        class SenderChainKey implements ISenderChainKey {
            constructor(p?: proto.SenderKeyStateStructure.ISenderChainKey);
            public iteration: number;
            public seed: Uint8Array;
            public static create(properties?: proto.SenderKeyStateStructure.ISenderChainKey): proto.SenderKeyStateStructure.SenderChainKey;
            public static encode(m: proto.SenderKeyStateStructure.ISenderChainKey, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyStateStructure.SenderChainKey;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISenderMessageKey {
            iteration?: (number|null);
            seed?: (Uint8Array|null);
        }

        class SenderMessageKey implements ISenderMessageKey {
            constructor(p?: proto.SenderKeyStateStructure.ISenderMessageKey);
            public iteration: number;
            public seed: Uint8Array;
            public static create(properties?: proto.SenderKeyStateStructure.ISenderMessageKey): proto.SenderKeyStateStructure.SenderMessageKey;
            public static encode(m: proto.SenderKeyStateStructure.ISenderMessageKey, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyStateStructure.SenderMessageKey;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISenderSigningKey {
            "public"?: (Uint8Array|null);
            "private"?: (Uint8Array|null);
        }

        class SenderSigningKey implements ISenderSigningKey {
            constructor(p?: proto.SenderKeyStateStructure.ISenderSigningKey);
            public public: Uint8Array;
            public private: Uint8Array;
            public static create(properties?: proto.SenderKeyStateStructure.ISenderSigningKey): proto.SenderKeyStateStructure.SenderSigningKey;
            public static encode(m: proto.SenderKeyStateStructure.ISenderSigningKey, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SenderKeyStateStructure.SenderSigningKey;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IServerErrorReceipt {
        stanzaId?: (string|null);
    }

    class ServerErrorReceipt implements IServerErrorReceipt {
        constructor(p?: proto.IServerErrorReceipt);
        public stanzaId: string;
        public static create(properties?: proto.IServerErrorReceipt): proto.ServerErrorReceipt;
        public static encode(m: proto.IServerErrorReceipt, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.ServerErrorReceipt;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISessionStructure {
        sessionVersion?: (number|null);
        localIdentityPublic?: (Uint8Array|null);
        remoteIdentityPublic?: (Uint8Array|null);
        rootKey?: (Uint8Array|null);
        previousCounter?: (number|null);
        senderChain?: (proto.SessionStructure.IChain|null);
        receiverChains?: (proto.SessionStructure.IChain[]|null);
        pendingKeyExchange?: (proto.SessionStructure.IPendingKeyExchange|null);
        pendingPreKey?: (proto.SessionStructure.IPendingPreKey|null);
        remoteRegistrationId?: (number|null);
        localRegistrationId?: (number|null);
        needsRefresh?: (boolean|null);
        aliceBaseKey?: (Uint8Array|null);
    }

    class SessionStructure implements ISessionStructure {
        constructor(p?: proto.ISessionStructure);
        public sessionVersion: number;
        public localIdentityPublic: Uint8Array;
        public remoteIdentityPublic: Uint8Array;
        public rootKey: Uint8Array;
        public previousCounter: number;
        public senderChain?: (proto.SessionStructure.IChain|null);
        public receiverChains: proto.SessionStructure.IChain[];
        public pendingKeyExchange?: (proto.SessionStructure.IPendingKeyExchange|null);
        public pendingPreKey?: (proto.SessionStructure.IPendingPreKey|null);
        public remoteRegistrationId: number;
        public localRegistrationId: number;
        public needsRefresh: boolean;
        public aliceBaseKey: Uint8Array;
        public static create(properties?: proto.ISessionStructure): proto.SessionStructure;
        public static encode(m: proto.ISessionStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SessionStructure {

        interface IChain {
            senderRatchetKey?: (Uint8Array|null);
            senderRatchetKeyPrivate?: (Uint8Array|null);
            chainKey?: (proto.SessionStructure.Chain.IChainKey|null);
            messageKeys?: (proto.SessionStructure.Chain.IMessageKey[]|null);
        }

        class Chain implements IChain {
            constructor(p?: proto.SessionStructure.IChain);
            public senderRatchetKey: Uint8Array;
            public senderRatchetKeyPrivate: Uint8Array;
            public chainKey?: (proto.SessionStructure.Chain.IChainKey|null);
            public messageKeys: proto.SessionStructure.Chain.IMessageKey[];
            public static create(properties?: proto.SessionStructure.IChain): proto.SessionStructure.Chain;
            public static encode(m: proto.SessionStructure.IChain, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure.Chain;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Chain {

            interface IChainKey {
                index?: (number|null);
                key?: (Uint8Array|null);
            }

            class ChainKey implements IChainKey {
                constructor(p?: proto.SessionStructure.Chain.IChainKey);
                public index: number;
                public key: Uint8Array;
                public static create(properties?: proto.SessionStructure.Chain.IChainKey): proto.SessionStructure.Chain.ChainKey;
                public static encode(m: proto.SessionStructure.Chain.IChainKey, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure.Chain.ChainKey;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            interface IMessageKey {
                index?: (number|null);
                cipherKey?: (Uint8Array|null);
                macKey?: (Uint8Array|null);
                iv?: (Uint8Array|null);
            }

            class MessageKey implements IMessageKey {
                constructor(p?: proto.SessionStructure.Chain.IMessageKey);
                public index: number;
                public cipherKey: Uint8Array;
                public macKey: Uint8Array;
                public iv: Uint8Array;
                public static create(properties?: proto.SessionStructure.Chain.IMessageKey): proto.SessionStructure.Chain.MessageKey;
                public static encode(m: proto.SessionStructure.Chain.IMessageKey, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure.Chain.MessageKey;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IPendingKeyExchange {
            sequence?: (number|null);
            localBaseKey?: (Uint8Array|null);
            localBaseKeyPrivate?: (Uint8Array|null);
            localRatchetKey?: (Uint8Array|null);
            localRatchetKeyPrivate?: (Uint8Array|null);
            localIdentityKey?: (Uint8Array|null);
            localIdentityKeyPrivate?: (Uint8Array|null);
        }

        class PendingKeyExchange implements IPendingKeyExchange {
            constructor(p?: proto.SessionStructure.IPendingKeyExchange);
            public sequence: number;
            public localBaseKey: Uint8Array;
            public localBaseKeyPrivate: Uint8Array;
            public localRatchetKey: Uint8Array;
            public localRatchetKeyPrivate: Uint8Array;
            public localIdentityKey: Uint8Array;
            public localIdentityKeyPrivate: Uint8Array;
            public static create(properties?: proto.SessionStructure.IPendingKeyExchange): proto.SessionStructure.PendingKeyExchange;
            public static encode(m: proto.SessionStructure.IPendingKeyExchange, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure.PendingKeyExchange;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPendingPreKey {
            preKeyId?: (number|null);
            signedPreKeyId?: (number|null);
            baseKey?: (Uint8Array|null);
        }

        class PendingPreKey implements IPendingPreKey {
            constructor(p?: proto.SessionStructure.IPendingPreKey);
            public preKeyId: number;
            public signedPreKeyId: number;
            public baseKey: Uint8Array;
            public static create(properties?: proto.SessionStructure.IPendingPreKey): proto.SessionStructure.PendingPreKey;
            public static encode(m: proto.SessionStructure.IPendingPreKey, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SessionStructure.PendingPreKey;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface ISignalMessage {
        ratchetKey?: (Uint8Array|null);
        counter?: (number|null);
        previousCounter?: (number|null);
        ciphertext?: (Uint8Array|null);
    }

    class SignalMessage implements ISignalMessage {
        constructor(p?: proto.ISignalMessage);
        public ratchetKey: Uint8Array;
        public counter: number;
        public previousCounter: number;
        public ciphertext: Uint8Array;
        public static create(properties?: proto.ISignalMessage): proto.SignalMessage;
        public static encode(m: proto.ISignalMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SignalMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISignedPreKeyRecordStructure {
        id?: (number|null);
        publicKey?: (Uint8Array|null);
        privateKey?: (Uint8Array|null);
        signature?: (Uint8Array|null);
        timestamp?: (number|Long|null);
    }

    class SignedPreKeyRecordStructure implements ISignedPreKeyRecordStructure {
        constructor(p?: proto.ISignedPreKeyRecordStructure);
        public id: number;
        public publicKey: Uint8Array;
        public privateKey: Uint8Array;
        public signature: Uint8Array;
        public timestamp: (number|Long);
        public static create(properties?: proto.ISignedPreKeyRecordStructure): proto.SignedPreKeyRecordStructure;
        public static encode(m: proto.ISignedPreKeyRecordStructure, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SignedPreKeyRecordStructure;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IStatusMentionMessage {
        quotedStatus?: (proto.IMessage|null);
    }

    class StatusMentionMessage implements IStatusMentionMessage {
        constructor(p?: proto.IStatusMentionMessage);
        public quotedStatus?: (proto.IMessage|null);
        public static create(properties?: proto.IStatusMentionMessage): proto.StatusMentionMessage;
        public static encode(m: proto.IStatusMentionMessage, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.StatusMentionMessage;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IStatusPSA {
        campaignId: (number|Long);
        campaignExpirationTimestamp?: (number|Long|null);
    }

    class StatusPSA implements IStatusPSA {
        constructor(p?: proto.IStatusPSA);
        public campaignId: (number|Long);
        public campaignExpirationTimestamp: (number|Long);
        public static create(properties?: proto.IStatusPSA): proto.StatusPSA;
        public static encode(m: proto.IStatusPSA, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.StatusPSA;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IStickerMetadata {
        url?: (string|null);
        fileSha256?: (Uint8Array|null);
        fileEncSha256?: (Uint8Array|null);
        mediaKey?: (Uint8Array|null);
        mimetype?: (string|null);
        height?: (number|null);
        width?: (number|null);
        directPath?: (string|null);
        fileLength?: (number|Long|null);
        weight?: (number|null);
        lastStickerSentTs?: (number|Long|null);
        isLottie?: (boolean|null);
    }

    class StickerMetadata implements IStickerMetadata {
        constructor(p?: proto.IStickerMetadata);
        public url: string;
        public fileSha256: Uint8Array;
        public fileEncSha256: Uint8Array;
        public mediaKey: Uint8Array;
        public mimetype: string;
        public height: number;
        public width: number;
        public directPath: string;
        public fileLength: (number|Long);
        public weight: number;
        public lastStickerSentTs: (number|Long);
        public isLottie: boolean;
        public static create(properties?: proto.IStickerMetadata): proto.StickerMetadata;
        public static encode(m: proto.IStickerMetadata, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.StickerMetadata;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncActionData {
        index?: (Uint8Array|null);
        value?: (proto.ISyncActionValue|null);
        padding?: (Uint8Array|null);
        version?: (number|null);
    }

    class SyncActionData implements ISyncActionData {
        constructor(p?: proto.ISyncActionData);
        public index: Uint8Array;
        public value?: (proto.ISyncActionValue|null);
        public padding: Uint8Array;
        public version: number;
        public static create(properties?: proto.ISyncActionData): proto.SyncActionData;
        public static encode(m: proto.ISyncActionData, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionData;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncActionValue {
        timestamp?: (number|Long|null);
        starAction?: (proto.SyncActionValue.IStarAction|null);
        contactAction?: (proto.SyncActionValue.IContactAction|null);
        muteAction?: (proto.SyncActionValue.IMuteAction|null);
        pinAction?: (proto.SyncActionValue.IPinAction|null);
        securityNotificationSetting?: (proto.SyncActionValue.ISecurityNotificationSetting|null);
        pushNameSetting?: (proto.SyncActionValue.IPushNameSetting|null);
        quickReplyAction?: (proto.SyncActionValue.IQuickReplyAction|null);
        recentEmojiWeightsAction?: (proto.SyncActionValue.IRecentEmojiWeightsAction|null);
        labelEditAction?: (proto.SyncActionValue.ILabelEditAction|null);
        labelAssociationAction?: (proto.SyncActionValue.ILabelAssociationAction|null);
        localeSetting?: (proto.SyncActionValue.ILocaleSetting|null);
        archiveChatAction?: (proto.SyncActionValue.IArchiveChatAction|null);
        deleteMessageForMeAction?: (proto.SyncActionValue.IDeleteMessageForMeAction|null);
        keyExpiration?: (proto.SyncActionValue.IKeyExpiration|null);
        markChatAsReadAction?: (proto.SyncActionValue.IMarkChatAsReadAction|null);
        clearChatAction?: (proto.SyncActionValue.IClearChatAction|null);
        deleteChatAction?: (proto.SyncActionValue.IDeleteChatAction|null);
        unarchiveChatsSetting?: (proto.SyncActionValue.IUnarchiveChatsSetting|null);
        primaryFeature?: (proto.SyncActionValue.IPrimaryFeature|null);
        androidUnsupportedActions?: (proto.SyncActionValue.IAndroidUnsupportedActions|null);
        agentAction?: (proto.SyncActionValue.IAgentAction|null);
        subscriptionAction?: (proto.SyncActionValue.ISubscriptionAction|null);
        userStatusMuteAction?: (proto.SyncActionValue.IUserStatusMuteAction|null);
        timeFormatAction?: (proto.SyncActionValue.ITimeFormatAction|null);
        nuxAction?: (proto.SyncActionValue.INuxAction|null);
        primaryVersionAction?: (proto.SyncActionValue.IPrimaryVersionAction|null);
        stickerAction?: (proto.SyncActionValue.IStickerAction|null);
        removeRecentStickerAction?: (proto.SyncActionValue.IRemoveRecentStickerAction|null);
        chatAssignment?: (proto.SyncActionValue.IChatAssignmentAction|null);
        chatAssignmentOpenedStatus?: (proto.SyncActionValue.IChatAssignmentOpenedStatusAction|null);
        pnForLidChatAction?: (proto.SyncActionValue.IPnForLidChatAction|null);
        marketingMessageAction?: (proto.SyncActionValue.IMarketingMessageAction|null);
        marketingMessageBroadcastAction?: (proto.SyncActionValue.IMarketingMessageBroadcastAction|null);
        externalWebBetaAction?: (proto.SyncActionValue.IExternalWebBetaAction|null);
        privacySettingRelayAllCalls?: (proto.SyncActionValue.IPrivacySettingRelayAllCalls|null);
        callLogAction?: (proto.SyncActionValue.ICallLogAction|null);
        statusPrivacy?: (proto.SyncActionValue.IStatusPrivacyAction|null);
        botWelcomeRequestAction?: (proto.SyncActionValue.IBotWelcomeRequestAction|null);
        deleteIndividualCallLog?: (proto.SyncActionValue.IDeleteIndividualCallLogAction|null);
        labelReorderingAction?: (proto.SyncActionValue.ILabelReorderingAction|null);
        paymentInfoAction?: (proto.SyncActionValue.IPaymentInfoAction|null);
        customPaymentMethodsAction?: (proto.SyncActionValue.ICustomPaymentMethodsAction|null);
        lockChatAction?: (proto.SyncActionValue.ILockChatAction|null);
        chatLockSettings?: (proto.IChatLockSettings|null);
        wamoUserIdentifierAction?: (proto.SyncActionValue.IWamoUserIdentifierAction|null);
        privacySettingDisableLinkPreviewsAction?: (proto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null);
        deviceCapabilities?: (proto.IDeviceCapabilities|null);
        noteEditAction?: (proto.SyncActionValue.INoteEditAction|null);
        favoritesAction?: (proto.SyncActionValue.IFavoritesAction|null);
        merchantPaymentPartnerAction?: (proto.SyncActionValue.IMerchantPaymentPartnerAction|null);
        waffleAccountLinkStateAction?: (proto.SyncActionValue.IWaffleAccountLinkStateAction|null);
        usernameChatStartMode?: (proto.SyncActionValue.IUsernameChatStartModeAction|null);
        notificationActivitySettingAction?: (proto.SyncActionValue.INotificationActivitySettingAction|null);
        lidContactAction?: (proto.SyncActionValue.ILidContactAction|null);
        ctwaPerCustomerDataSharingAction?: (proto.SyncActionValue.ICtwaPerCustomerDataSharingAction|null);
        paymentTosAction?: (proto.SyncActionValue.IPaymentTosAction|null);
    }

    class SyncActionValue implements ISyncActionValue {
        constructor(p?: proto.ISyncActionValue);
        public timestamp: (number|Long);
        public starAction?: (proto.SyncActionValue.IStarAction|null);
        public contactAction?: (proto.SyncActionValue.IContactAction|null);
        public muteAction?: (proto.SyncActionValue.IMuteAction|null);
        public pinAction?: (proto.SyncActionValue.IPinAction|null);
        public securityNotificationSetting?: (proto.SyncActionValue.ISecurityNotificationSetting|null);
        public pushNameSetting?: (proto.SyncActionValue.IPushNameSetting|null);
        public quickReplyAction?: (proto.SyncActionValue.IQuickReplyAction|null);
        public recentEmojiWeightsAction?: (proto.SyncActionValue.IRecentEmojiWeightsAction|null);
        public labelEditAction?: (proto.SyncActionValue.ILabelEditAction|null);
        public labelAssociationAction?: (proto.SyncActionValue.ILabelAssociationAction|null);
        public localeSetting?: (proto.SyncActionValue.ILocaleSetting|null);
        public archiveChatAction?: (proto.SyncActionValue.IArchiveChatAction|null);
        public deleteMessageForMeAction?: (proto.SyncActionValue.IDeleteMessageForMeAction|null);
        public keyExpiration?: (proto.SyncActionValue.IKeyExpiration|null);
        public markChatAsReadAction?: (proto.SyncActionValue.IMarkChatAsReadAction|null);
        public clearChatAction?: (proto.SyncActionValue.IClearChatAction|null);
        public deleteChatAction?: (proto.SyncActionValue.IDeleteChatAction|null);
        public unarchiveChatsSetting?: (proto.SyncActionValue.IUnarchiveChatsSetting|null);
        public primaryFeature?: (proto.SyncActionValue.IPrimaryFeature|null);
        public androidUnsupportedActions?: (proto.SyncActionValue.IAndroidUnsupportedActions|null);
        public agentAction?: (proto.SyncActionValue.IAgentAction|null);
        public subscriptionAction?: (proto.SyncActionValue.ISubscriptionAction|null);
        public userStatusMuteAction?: (proto.SyncActionValue.IUserStatusMuteAction|null);
        public timeFormatAction?: (proto.SyncActionValue.ITimeFormatAction|null);
        public nuxAction?: (proto.SyncActionValue.INuxAction|null);
        public primaryVersionAction?: (proto.SyncActionValue.IPrimaryVersionAction|null);
        public stickerAction?: (proto.SyncActionValue.IStickerAction|null);
        public removeRecentStickerAction?: (proto.SyncActionValue.IRemoveRecentStickerAction|null);
        public chatAssignment?: (proto.SyncActionValue.IChatAssignmentAction|null);
        public chatAssignmentOpenedStatus?: (proto.SyncActionValue.IChatAssignmentOpenedStatusAction|null);
        public pnForLidChatAction?: (proto.SyncActionValue.IPnForLidChatAction|null);
        public marketingMessageAction?: (proto.SyncActionValue.IMarketingMessageAction|null);
        public marketingMessageBroadcastAction?: (proto.SyncActionValue.IMarketingMessageBroadcastAction|null);
        public externalWebBetaAction?: (proto.SyncActionValue.IExternalWebBetaAction|null);
        public privacySettingRelayAllCalls?: (proto.SyncActionValue.IPrivacySettingRelayAllCalls|null);
        public callLogAction?: (proto.SyncActionValue.ICallLogAction|null);
        public statusPrivacy?: (proto.SyncActionValue.IStatusPrivacyAction|null);
        public botWelcomeRequestAction?: (proto.SyncActionValue.IBotWelcomeRequestAction|null);
        public deleteIndividualCallLog?: (proto.SyncActionValue.IDeleteIndividualCallLogAction|null);
        public labelReorderingAction?: (proto.SyncActionValue.ILabelReorderingAction|null);
        public paymentInfoAction?: (proto.SyncActionValue.IPaymentInfoAction|null);
        public customPaymentMethodsAction?: (proto.SyncActionValue.ICustomPaymentMethodsAction|null);
        public lockChatAction?: (proto.SyncActionValue.ILockChatAction|null);
        public chatLockSettings?: (proto.IChatLockSettings|null);
        public wamoUserIdentifierAction?: (proto.SyncActionValue.IWamoUserIdentifierAction|null);
        public privacySettingDisableLinkPreviewsAction?: (proto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null);
        public deviceCapabilities?: (proto.IDeviceCapabilities|null);
        public noteEditAction?: (proto.SyncActionValue.INoteEditAction|null);
        public favoritesAction?: (proto.SyncActionValue.IFavoritesAction|null);
        public merchantPaymentPartnerAction?: (proto.SyncActionValue.IMerchantPaymentPartnerAction|null);
        public waffleAccountLinkStateAction?: (proto.SyncActionValue.IWaffleAccountLinkStateAction|null);
        public usernameChatStartMode?: (proto.SyncActionValue.IUsernameChatStartModeAction|null);
        public notificationActivitySettingAction?: (proto.SyncActionValue.INotificationActivitySettingAction|null);
        public lidContactAction?: (proto.SyncActionValue.ILidContactAction|null);
        public ctwaPerCustomerDataSharingAction?: (proto.SyncActionValue.ICtwaPerCustomerDataSharingAction|null);
        public paymentTosAction?: (proto.SyncActionValue.IPaymentTosAction|null);
        public static create(properties?: proto.ISyncActionValue): proto.SyncActionValue;
        public static encode(m: proto.ISyncActionValue, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SyncActionValue {

        interface IAgentAction {
            name?: (string|null);
            deviceID?: (number|null);
            isDeleted?: (boolean|null);
        }

        class AgentAction implements IAgentAction {
            constructor(p?: proto.SyncActionValue.IAgentAction);
            public name: string;
            public deviceID: number;
            public isDeleted: boolean;
            public static create(properties?: proto.SyncActionValue.IAgentAction): proto.SyncActionValue.AgentAction;
            public static encode(m: proto.SyncActionValue.IAgentAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.AgentAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IAndroidUnsupportedActions {
            allowed?: (boolean|null);
        }

        class AndroidUnsupportedActions implements IAndroidUnsupportedActions {
            constructor(p?: proto.SyncActionValue.IAndroidUnsupportedActions);
            public allowed: boolean;
            public static create(properties?: proto.SyncActionValue.IAndroidUnsupportedActions): proto.SyncActionValue.AndroidUnsupportedActions;
            public static encode(m: proto.SyncActionValue.IAndroidUnsupportedActions, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.AndroidUnsupportedActions;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IArchiveChatAction {
            archived?: (boolean|null);
            messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
        }

        class ArchiveChatAction implements IArchiveChatAction {
            constructor(p?: proto.SyncActionValue.IArchiveChatAction);
            public archived: boolean;
            public messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
            public static create(properties?: proto.SyncActionValue.IArchiveChatAction): proto.SyncActionValue.ArchiveChatAction;
            public static encode(m: proto.SyncActionValue.IArchiveChatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ArchiveChatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IBotWelcomeRequestAction {
            isSent?: (boolean|null);
        }

        class BotWelcomeRequestAction implements IBotWelcomeRequestAction {
            constructor(p?: proto.SyncActionValue.IBotWelcomeRequestAction);
            public isSent: boolean;
            public static create(properties?: proto.SyncActionValue.IBotWelcomeRequestAction): proto.SyncActionValue.BotWelcomeRequestAction;
            public static encode(m: proto.SyncActionValue.IBotWelcomeRequestAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.BotWelcomeRequestAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICallLogAction {
            callLogRecord?: (proto.ICallLogRecord|null);
        }

        class CallLogAction implements ICallLogAction {
            constructor(p?: proto.SyncActionValue.ICallLogAction);
            public callLogRecord?: (proto.ICallLogRecord|null);
            public static create(properties?: proto.SyncActionValue.ICallLogAction): proto.SyncActionValue.CallLogAction;
            public static encode(m: proto.SyncActionValue.ICallLogAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.CallLogAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IChatAssignmentAction {
            deviceAgentID?: (string|null);
        }

        class ChatAssignmentAction implements IChatAssignmentAction {
            constructor(p?: proto.SyncActionValue.IChatAssignmentAction);
            public deviceAgentID: string;
            public static create(properties?: proto.SyncActionValue.IChatAssignmentAction): proto.SyncActionValue.ChatAssignmentAction;
            public static encode(m: proto.SyncActionValue.IChatAssignmentAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ChatAssignmentAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IChatAssignmentOpenedStatusAction {
            chatOpened?: (boolean|null);
        }

        class ChatAssignmentOpenedStatusAction implements IChatAssignmentOpenedStatusAction {
            constructor(p?: proto.SyncActionValue.IChatAssignmentOpenedStatusAction);
            public chatOpened: boolean;
            public static create(properties?: proto.SyncActionValue.IChatAssignmentOpenedStatusAction): proto.SyncActionValue.ChatAssignmentOpenedStatusAction;
            public static encode(m: proto.SyncActionValue.IChatAssignmentOpenedStatusAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ChatAssignmentOpenedStatusAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IClearChatAction {
            messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
        }

        class ClearChatAction implements IClearChatAction {
            constructor(p?: proto.SyncActionValue.IClearChatAction);
            public messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
            public static create(properties?: proto.SyncActionValue.IClearChatAction): proto.SyncActionValue.ClearChatAction;
            public static encode(m: proto.SyncActionValue.IClearChatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ClearChatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IContactAction {
            fullName?: (string|null);
            firstName?: (string|null);
            lidJid?: (string|null);
            saveOnPrimaryAddressbook?: (boolean|null);
            pnJid?: (string|null);
            username?: (string|null);
        }

        class ContactAction implements IContactAction {
            constructor(p?: proto.SyncActionValue.IContactAction);
            public fullName: string;
            public firstName: string;
            public lidJid: string;
            public saveOnPrimaryAddressbook: boolean;
            public pnJid: string;
            public username: string;
            public static create(properties?: proto.SyncActionValue.IContactAction): proto.SyncActionValue.ContactAction;
            public static encode(m: proto.SyncActionValue.IContactAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ContactAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICtwaPerCustomerDataSharingAction {
            isCtwaPerCustomerDataSharingEnabled?: (boolean|null);
        }

        class CtwaPerCustomerDataSharingAction implements ICtwaPerCustomerDataSharingAction {
            constructor(p?: proto.SyncActionValue.ICtwaPerCustomerDataSharingAction);
            public isCtwaPerCustomerDataSharingEnabled: boolean;
            public static create(properties?: proto.SyncActionValue.ICtwaPerCustomerDataSharingAction): proto.SyncActionValue.CtwaPerCustomerDataSharingAction;
            public static encode(m: proto.SyncActionValue.ICtwaPerCustomerDataSharingAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.CtwaPerCustomerDataSharingAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICustomPaymentMethod {
            credentialId: string;
            country: string;
            type: string;
            metadata?: (proto.SyncActionValue.ICustomPaymentMethodMetadata[]|null);
        }

        class CustomPaymentMethod implements ICustomPaymentMethod {
            constructor(p?: proto.SyncActionValue.ICustomPaymentMethod);
            public credentialId: string;
            public country: string;
            public type: string;
            public metadata: proto.SyncActionValue.ICustomPaymentMethodMetadata[];
            public static create(properties?: proto.SyncActionValue.ICustomPaymentMethod): proto.SyncActionValue.CustomPaymentMethod;
            public static encode(m: proto.SyncActionValue.ICustomPaymentMethod, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.CustomPaymentMethod;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICustomPaymentMethodMetadata {
            key: string;
            value: string;
        }

        class CustomPaymentMethodMetadata implements ICustomPaymentMethodMetadata {
            constructor(p?: proto.SyncActionValue.ICustomPaymentMethodMetadata);
            public key: string;
            public value: string;
            public static create(properties?: proto.SyncActionValue.ICustomPaymentMethodMetadata): proto.SyncActionValue.CustomPaymentMethodMetadata;
            public static encode(m: proto.SyncActionValue.ICustomPaymentMethodMetadata, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.CustomPaymentMethodMetadata;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ICustomPaymentMethodsAction {
            customPaymentMethods?: (proto.SyncActionValue.ICustomPaymentMethod[]|null);
        }

        class CustomPaymentMethodsAction implements ICustomPaymentMethodsAction {
            constructor(p?: proto.SyncActionValue.ICustomPaymentMethodsAction);
            public customPaymentMethods: proto.SyncActionValue.ICustomPaymentMethod[];
            public static create(properties?: proto.SyncActionValue.ICustomPaymentMethodsAction): proto.SyncActionValue.CustomPaymentMethodsAction;
            public static encode(m: proto.SyncActionValue.ICustomPaymentMethodsAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.CustomPaymentMethodsAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDeleteChatAction {
            messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
        }

        class DeleteChatAction implements IDeleteChatAction {
            constructor(p?: proto.SyncActionValue.IDeleteChatAction);
            public messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
            public static create(properties?: proto.SyncActionValue.IDeleteChatAction): proto.SyncActionValue.DeleteChatAction;
            public static encode(m: proto.SyncActionValue.IDeleteChatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.DeleteChatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDeleteIndividualCallLogAction {
            peerJid?: (string|null);
            isIncoming?: (boolean|null);
        }

        class DeleteIndividualCallLogAction implements IDeleteIndividualCallLogAction {
            constructor(p?: proto.SyncActionValue.IDeleteIndividualCallLogAction);
            public peerJid: string;
            public isIncoming: boolean;
            public static create(properties?: proto.SyncActionValue.IDeleteIndividualCallLogAction): proto.SyncActionValue.DeleteIndividualCallLogAction;
            public static encode(m: proto.SyncActionValue.IDeleteIndividualCallLogAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.DeleteIndividualCallLogAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IDeleteMessageForMeAction {
            deleteMedia?: (boolean|null);
            messageTimestamp?: (number|Long|null);
        }

        class DeleteMessageForMeAction implements IDeleteMessageForMeAction {
            constructor(p?: proto.SyncActionValue.IDeleteMessageForMeAction);
            public deleteMedia: boolean;
            public messageTimestamp: (number|Long);
            public static create(properties?: proto.SyncActionValue.IDeleteMessageForMeAction): proto.SyncActionValue.DeleteMessageForMeAction;
            public static encode(m: proto.SyncActionValue.IDeleteMessageForMeAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.DeleteMessageForMeAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IExternalWebBetaAction {
            isOptIn?: (boolean|null);
        }

        class ExternalWebBetaAction implements IExternalWebBetaAction {
            constructor(p?: proto.SyncActionValue.IExternalWebBetaAction);
            public isOptIn: boolean;
            public static create(properties?: proto.SyncActionValue.IExternalWebBetaAction): proto.SyncActionValue.ExternalWebBetaAction;
            public static encode(m: proto.SyncActionValue.IExternalWebBetaAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.ExternalWebBetaAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IFavoritesAction {
            favorites?: (proto.SyncActionValue.FavoritesAction.IFavorite[]|null);
        }

        class FavoritesAction implements IFavoritesAction {
            constructor(p?: proto.SyncActionValue.IFavoritesAction);
            public favorites: proto.SyncActionValue.FavoritesAction.IFavorite[];
            public static create(properties?: proto.SyncActionValue.IFavoritesAction): proto.SyncActionValue.FavoritesAction;
            public static encode(m: proto.SyncActionValue.IFavoritesAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.FavoritesAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FavoritesAction {

            interface IFavorite {
                id?: (string|null);
            }

            class Favorite implements IFavorite {
                constructor(p?: proto.SyncActionValue.FavoritesAction.IFavorite);
                public id: string;
                public static create(properties?: proto.SyncActionValue.FavoritesAction.IFavorite): proto.SyncActionValue.FavoritesAction.Favorite;
                public static encode(m: proto.SyncActionValue.FavoritesAction.IFavorite, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.FavoritesAction.Favorite;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        interface IKeyExpiration {
            expiredKeyEpoch?: (number|null);
        }

        class KeyExpiration implements IKeyExpiration {
            constructor(p?: proto.SyncActionValue.IKeyExpiration);
            public expiredKeyEpoch: number;
            public static create(properties?: proto.SyncActionValue.IKeyExpiration): proto.SyncActionValue.KeyExpiration;
            public static encode(m: proto.SyncActionValue.IKeyExpiration, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.KeyExpiration;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILabelAssociationAction {
            labeled?: (boolean|null);
        }

        class LabelAssociationAction implements ILabelAssociationAction {
            constructor(p?: proto.SyncActionValue.ILabelAssociationAction);
            public labeled: boolean;
            public static create(properties?: proto.SyncActionValue.ILabelAssociationAction): proto.SyncActionValue.LabelAssociationAction;
            public static encode(m: proto.SyncActionValue.ILabelAssociationAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LabelAssociationAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILabelEditAction {
            name?: (string|null);
            color?: (number|null);
            predefinedId?: (number|null);
            deleted?: (boolean|null);
            orderIndex?: (number|null);
            isActive?: (boolean|null);
            type?: (proto.SyncActionValue.LabelEditAction.ListType|null);
            isImmutable?: (boolean|null);
        }

        class LabelEditAction implements ILabelEditAction {
            constructor(p?: proto.SyncActionValue.ILabelEditAction);
            public name: string;
            public color: number;
            public predefinedId: number;
            public deleted: boolean;
            public orderIndex: number;
            public isActive: boolean;
            public type: proto.SyncActionValue.LabelEditAction.ListType;
            public isImmutable: boolean;
            public static create(properties?: proto.SyncActionValue.ILabelEditAction): proto.SyncActionValue.LabelEditAction;
            public static encode(m: proto.SyncActionValue.ILabelEditAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LabelEditAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace LabelEditAction {

            enum ListType {
                NONE = 0,
                UNREAD = 1,
                GROUPS = 2,
                FAVORITES = 3,
                PREDEFINED = 4,
                CUSTOM = 5,
                COMMUNITY = 6,
                SERVER_ASSIGNED = 7
            }
        }

        interface ILabelReorderingAction {
            sortedLabelIds?: (number[]|null);
        }

        class LabelReorderingAction implements ILabelReorderingAction {
            constructor(p?: proto.SyncActionValue.ILabelReorderingAction);
            public sortedLabelIds: number[];
            public static create(properties?: proto.SyncActionValue.ILabelReorderingAction): proto.SyncActionValue.LabelReorderingAction;
            public static encode(m: proto.SyncActionValue.ILabelReorderingAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LabelReorderingAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILidContactAction {
            fullName?: (string|null);
            firstName?: (string|null);
            username?: (string|null);
            saveOnPrimaryAddressbook?: (boolean|null);
        }

        class LidContactAction implements ILidContactAction {
            constructor(p?: proto.SyncActionValue.ILidContactAction);
            public fullName: string;
            public firstName: string;
            public username: string;
            public saveOnPrimaryAddressbook: boolean;
            public static create(properties?: proto.SyncActionValue.ILidContactAction): proto.SyncActionValue.LidContactAction;
            public static encode(m: proto.SyncActionValue.ILidContactAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LidContactAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILocaleSetting {
            locale?: (string|null);
        }

        class LocaleSetting implements ILocaleSetting {
            constructor(p?: proto.SyncActionValue.ILocaleSetting);
            public locale: string;
            public static create(properties?: proto.SyncActionValue.ILocaleSetting): proto.SyncActionValue.LocaleSetting;
            public static encode(m: proto.SyncActionValue.ILocaleSetting, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LocaleSetting;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ILockChatAction {
            locked?: (boolean|null);
        }

        class LockChatAction implements ILockChatAction {
            constructor(p?: proto.SyncActionValue.ILockChatAction);
            public locked: boolean;
            public static create(properties?: proto.SyncActionValue.ILockChatAction): proto.SyncActionValue.LockChatAction;
            public static encode(m: proto.SyncActionValue.ILockChatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.LockChatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMarkChatAsReadAction {
            read?: (boolean|null);
            messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
        }

        class MarkChatAsReadAction implements IMarkChatAsReadAction {
            constructor(p?: proto.SyncActionValue.IMarkChatAsReadAction);
            public read: boolean;
            public messageRange?: (proto.SyncActionValue.ISyncActionMessageRange|null);
            public static create(properties?: proto.SyncActionValue.IMarkChatAsReadAction): proto.SyncActionValue.MarkChatAsReadAction;
            public static encode(m: proto.SyncActionValue.IMarkChatAsReadAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.MarkChatAsReadAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMarketingMessageAction {
            name?: (string|null);
            message?: (string|null);
            type?: (proto.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType|null);
            createdAt?: (number|Long|null);
            lastSentAt?: (number|Long|null);
            isDeleted?: (boolean|null);
            mediaId?: (string|null);
        }

        class MarketingMessageAction implements IMarketingMessageAction {
            constructor(p?: proto.SyncActionValue.IMarketingMessageAction);
            public name: string;
            public message: string;
            public type: proto.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType;
            public createdAt: (number|Long);
            public lastSentAt: (number|Long);
            public isDeleted: boolean;
            public mediaId: string;
            public static create(properties?: proto.SyncActionValue.IMarketingMessageAction): proto.SyncActionValue.MarketingMessageAction;
            public static encode(m: proto.SyncActionValue.IMarketingMessageAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.MarketingMessageAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace MarketingMessageAction {

            enum MarketingMessagePrototypeType {
                PERSONALIZED = 0
            }
        }

        interface IMarketingMessageBroadcastAction {
            repliedCount?: (number|null);
        }

        class MarketingMessageBroadcastAction implements IMarketingMessageBroadcastAction {
            constructor(p?: proto.SyncActionValue.IMarketingMessageBroadcastAction);
            public repliedCount: number;
            public static create(properties?: proto.SyncActionValue.IMarketingMessageBroadcastAction): proto.SyncActionValue.MarketingMessageBroadcastAction;
            public static encode(m: proto.SyncActionValue.IMarketingMessageBroadcastAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.MarketingMessageBroadcastAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IMerchantPaymentPartnerAction {
            status: proto.SyncActionValue.MerchantPaymentPartnerAction.Status;
            country: string;
            gatewayName?: (string|null);
            credentialId?: (string|null);
        }

        class MerchantPaymentPartnerAction implements IMerchantPaymentPartnerAction {
            constructor(p?: proto.SyncActionValue.IMerchantPaymentPartnerAction);
            public status: proto.SyncActionValue.MerchantPaymentPartnerAction.Status;
            public country: string;
            public gatewayName: string;
            public credentialId: string;
            public static create(properties?: proto.SyncActionValue.IMerchantPaymentPartnerAction): proto.SyncActionValue.MerchantPaymentPartnerAction;
            public static encode(m: proto.SyncActionValue.IMerchantPaymentPartnerAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.MerchantPaymentPartnerAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace MerchantPaymentPartnerAction {

            enum Status {
                ACTIVE = 0,
                INACTIVE = 1
            }
        }

        interface IMuteAction {
            muted?: (boolean|null);
            muteEndTimestamp?: (number|Long|null);
            autoMuted?: (boolean|null);
        }

        class MuteAction implements IMuteAction {
            constructor(p?: proto.SyncActionValue.IMuteAction);
            public muted: boolean;
            public muteEndTimestamp: (number|Long);
            public autoMuted: boolean;
            public static create(properties?: proto.SyncActionValue.IMuteAction): proto.SyncActionValue.MuteAction;
            public static encode(m: proto.SyncActionValue.IMuteAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.MuteAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface INoteEditAction {
            type?: (proto.SyncActionValue.NoteEditAction.NoteType|null);
            chatJid?: (string|null);
            createdAt?: (number|Long|null);
            deleted?: (boolean|null);
            unstructuredContent?: (string|null);
        }

        class NoteEditAction implements INoteEditAction {
            constructor(p?: proto.SyncActionValue.INoteEditAction);
            public type: proto.SyncActionValue.NoteEditAction.NoteType;
            public chatJid: string;
            public createdAt: (number|Long);
            public deleted: boolean;
            public unstructuredContent: string;
            public static create(properties?: proto.SyncActionValue.INoteEditAction): proto.SyncActionValue.NoteEditAction;
            public static encode(m: proto.SyncActionValue.INoteEditAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.NoteEditAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace NoteEditAction {

            enum NoteType {
                UNSTRUCTURED = 1,
                STRUCTURED = 2
            }
        }

        interface INotificationActivitySettingAction {
            notificationActivitySetting?: (proto.SyncActionValue.NotificationActivitySettingAction.NotificationActivitySetting|null);
        }

        class NotificationActivitySettingAction implements INotificationActivitySettingAction {
            constructor(p?: proto.SyncActionValue.INotificationActivitySettingAction);
            public notificationActivitySetting: proto.SyncActionValue.NotificationActivitySettingAction.NotificationActivitySetting;
            public static create(properties?: proto.SyncActionValue.INotificationActivitySettingAction): proto.SyncActionValue.NotificationActivitySettingAction;
            public static encode(m: proto.SyncActionValue.INotificationActivitySettingAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.NotificationActivitySettingAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace NotificationActivitySettingAction {

            enum NotificationActivitySetting {
                DEFAULT_ALL_MESSAGES = 0,
                ALL_MESSAGES = 1,
                HIGHLIGHTS = 2,
                DEFAULT_HIGHLIGHTS = 3
            }
        }

        interface INuxAction {
            acknowledged?: (boolean|null);
        }

        class NuxAction implements INuxAction {
            constructor(p?: proto.SyncActionValue.INuxAction);
            public acknowledged: boolean;
            public static create(properties?: proto.SyncActionValue.INuxAction): proto.SyncActionValue.NuxAction;
            public static encode(m: proto.SyncActionValue.INuxAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.NuxAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPaymentInfoAction {
            cpi?: (string|null);
        }

        class PaymentInfoAction implements IPaymentInfoAction {
            constructor(p?: proto.SyncActionValue.IPaymentInfoAction);
            public cpi: string;
            public static create(properties?: proto.SyncActionValue.IPaymentInfoAction): proto.SyncActionValue.PaymentInfoAction;
            public static encode(m: proto.SyncActionValue.IPaymentInfoAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PaymentInfoAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPaymentTosAction {
            paymentNotice: proto.SyncActionValue.PaymentTosAction.PaymentNotice;
            accepted: boolean;
        }

        class PaymentTosAction implements IPaymentTosAction {
            constructor(p?: proto.SyncActionValue.IPaymentTosAction);
            public paymentNotice: proto.SyncActionValue.PaymentTosAction.PaymentNotice;
            public accepted: boolean;
            public static create(properties?: proto.SyncActionValue.IPaymentTosAction): proto.SyncActionValue.PaymentTosAction;
            public static encode(m: proto.SyncActionValue.IPaymentTosAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PaymentTosAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PaymentTosAction {

            enum PaymentNotice {
                BR_PAY_PRIVACY_POLICY = 0
            }
        }

        interface IPinAction {
            pinned?: (boolean|null);
        }

        class PinAction implements IPinAction {
            constructor(p?: proto.SyncActionValue.IPinAction);
            public pinned: boolean;
            public static create(properties?: proto.SyncActionValue.IPinAction): proto.SyncActionValue.PinAction;
            public static encode(m: proto.SyncActionValue.IPinAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PinAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPnForLidChatAction {
            pnJid?: (string|null);
        }

        class PnForLidChatAction implements IPnForLidChatAction {
            constructor(p?: proto.SyncActionValue.IPnForLidChatAction);
            public pnJid: string;
            public static create(properties?: proto.SyncActionValue.IPnForLidChatAction): proto.SyncActionValue.PnForLidChatAction;
            public static encode(m: proto.SyncActionValue.IPnForLidChatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PnForLidChatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPrimaryFeature {
            flags?: (string[]|null);
        }

        class PrimaryFeature implements IPrimaryFeature {
            constructor(p?: proto.SyncActionValue.IPrimaryFeature);
            public flags: string[];
            public static create(properties?: proto.SyncActionValue.IPrimaryFeature): proto.SyncActionValue.PrimaryFeature;
            public static encode(m: proto.SyncActionValue.IPrimaryFeature, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PrimaryFeature;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPrimaryVersionAction {
            version?: (string|null);
        }

        class PrimaryVersionAction implements IPrimaryVersionAction {
            constructor(p?: proto.SyncActionValue.IPrimaryVersionAction);
            public version: string;
            public static create(properties?: proto.SyncActionValue.IPrimaryVersionAction): proto.SyncActionValue.PrimaryVersionAction;
            public static encode(m: proto.SyncActionValue.IPrimaryVersionAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PrimaryVersionAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPrivacySettingDisableLinkPreviewsAction {
            isPreviewsDisabled?: (boolean|null);
        }

        class PrivacySettingDisableLinkPreviewsAction implements IPrivacySettingDisableLinkPreviewsAction {
            constructor(p?: proto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction);
            public isPreviewsDisabled: boolean;
            public static create(properties?: proto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction): proto.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;
            public static encode(m: proto.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPrivacySettingRelayAllCalls {
            isEnabled?: (boolean|null);
        }

        class PrivacySettingRelayAllCalls implements IPrivacySettingRelayAllCalls {
            constructor(p?: proto.SyncActionValue.IPrivacySettingRelayAllCalls);
            public isEnabled: boolean;
            public static create(properties?: proto.SyncActionValue.IPrivacySettingRelayAllCalls): proto.SyncActionValue.PrivacySettingRelayAllCalls;
            public static encode(m: proto.SyncActionValue.IPrivacySettingRelayAllCalls, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PrivacySettingRelayAllCalls;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IPushNameSetting {
            name?: (string|null);
        }

        class PushNameSetting implements IPushNameSetting {
            constructor(p?: proto.SyncActionValue.IPushNameSetting);
            public name: string;
            public static create(properties?: proto.SyncActionValue.IPushNameSetting): proto.SyncActionValue.PushNameSetting;
            public static encode(m: proto.SyncActionValue.IPushNameSetting, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.PushNameSetting;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IQuickReplyAction {
            shortcut?: (string|null);
            message?: (string|null);
            keywords?: (string[]|null);
            count?: (number|null);
            deleted?: (boolean|null);
        }

        class QuickReplyAction implements IQuickReplyAction {
            constructor(p?: proto.SyncActionValue.IQuickReplyAction);
            public shortcut: string;
            public message: string;
            public keywords: string[];
            public count: number;
            public deleted: boolean;
            public static create(properties?: proto.SyncActionValue.IQuickReplyAction): proto.SyncActionValue.QuickReplyAction;
            public static encode(m: proto.SyncActionValue.IQuickReplyAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.QuickReplyAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IRecentEmojiWeightsAction {
            weights?: (proto.IRecentEmojiWeight[]|null);
        }

        class RecentEmojiWeightsAction implements IRecentEmojiWeightsAction {
            constructor(p?: proto.SyncActionValue.IRecentEmojiWeightsAction);
            public weights: proto.IRecentEmojiWeight[];
            public static create(properties?: proto.SyncActionValue.IRecentEmojiWeightsAction): proto.SyncActionValue.RecentEmojiWeightsAction;
            public static encode(m: proto.SyncActionValue.IRecentEmojiWeightsAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.RecentEmojiWeightsAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IRemoveRecentStickerAction {
            lastStickerSentTs?: (number|Long|null);
        }

        class RemoveRecentStickerAction implements IRemoveRecentStickerAction {
            constructor(p?: proto.SyncActionValue.IRemoveRecentStickerAction);
            public lastStickerSentTs: (number|Long);
            public static create(properties?: proto.SyncActionValue.IRemoveRecentStickerAction): proto.SyncActionValue.RemoveRecentStickerAction;
            public static encode(m: proto.SyncActionValue.IRemoveRecentStickerAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.RemoveRecentStickerAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISecurityNotificationSetting {
            showNotification?: (boolean|null);
        }

        class SecurityNotificationSetting implements ISecurityNotificationSetting {
            constructor(p?: proto.SyncActionValue.ISecurityNotificationSetting);
            public showNotification: boolean;
            public static create(properties?: proto.SyncActionValue.ISecurityNotificationSetting): proto.SyncActionValue.SecurityNotificationSetting;
            public static encode(m: proto.SyncActionValue.ISecurityNotificationSetting, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.SecurityNotificationSetting;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IStarAction {
            starred?: (boolean|null);
        }

        class StarAction implements IStarAction {
            constructor(p?: proto.SyncActionValue.IStarAction);
            public starred: boolean;
            public static create(properties?: proto.SyncActionValue.IStarAction): proto.SyncActionValue.StarAction;
            public static encode(m: proto.SyncActionValue.IStarAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.StarAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IStatusPrivacyAction {
            mode?: (proto.SyncActionValue.StatusPrivacyAction.StatusDistributionMode|null);
            userJid?: (string[]|null);
        }

        class StatusPrivacyAction implements IStatusPrivacyAction {
            constructor(p?: proto.SyncActionValue.IStatusPrivacyAction);
            public mode: proto.SyncActionValue.StatusPrivacyAction.StatusDistributionMode;
            public userJid: string[];
            public static create(properties?: proto.SyncActionValue.IStatusPrivacyAction): proto.SyncActionValue.StatusPrivacyAction;
            public static encode(m: proto.SyncActionValue.IStatusPrivacyAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.StatusPrivacyAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace StatusPrivacyAction {

            enum StatusDistributionMode {
                ALLOW_LIST = 0,
                DENY_LIST = 1,
                CONTACTS = 2
            }
        }

        interface IStickerAction {
            url?: (string|null);
            fileEncSha256?: (Uint8Array|null);
            mediaKey?: (Uint8Array|null);
            mimetype?: (string|null);
            height?: (number|null);
            width?: (number|null);
            directPath?: (string|null);
            fileLength?: (number|Long|null);
            isFavorite?: (boolean|null);
            deviceIdHint?: (number|null);
            isLottie?: (boolean|null);
        }

        class StickerAction implements IStickerAction {
            constructor(p?: proto.SyncActionValue.IStickerAction);
            public url: string;
            public fileEncSha256: Uint8Array;
            public mediaKey: Uint8Array;
            public mimetype: string;
            public height: number;
            public width: number;
            public directPath: string;
            public fileLength: (number|Long);
            public isFavorite: boolean;
            public deviceIdHint: number;
            public isLottie: boolean;
            public static create(properties?: proto.SyncActionValue.IStickerAction): proto.SyncActionValue.StickerAction;
            public static encode(m: proto.SyncActionValue.IStickerAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.StickerAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISubscriptionAction {
            isDeactivated?: (boolean|null);
            isAutoRenewing?: (boolean|null);
            expirationDate?: (number|Long|null);
        }

        class SubscriptionAction implements ISubscriptionAction {
            constructor(p?: proto.SyncActionValue.ISubscriptionAction);
            public isDeactivated: boolean;
            public isAutoRenewing: boolean;
            public expirationDate: (number|Long);
            public static create(properties?: proto.SyncActionValue.ISubscriptionAction): proto.SyncActionValue.SubscriptionAction;
            public static encode(m: proto.SyncActionValue.ISubscriptionAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.SubscriptionAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISyncActionMessage {
            key?: (proto.IMessageKey|null);
            timestamp?: (number|Long|null);
        }

        class SyncActionMessage implements ISyncActionMessage {
            constructor(p?: proto.SyncActionValue.ISyncActionMessage);
            public key?: (proto.IMessageKey|null);
            public timestamp: (number|Long);
            public static create(properties?: proto.SyncActionValue.ISyncActionMessage): proto.SyncActionValue.SyncActionMessage;
            public static encode(m: proto.SyncActionValue.ISyncActionMessage, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.SyncActionMessage;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ISyncActionMessageRange {
            lastMessageTimestamp?: (number|Long|null);
            lastSystemMessageTimestamp?: (number|Long|null);
            messages?: (proto.SyncActionValue.ISyncActionMessage[]|null);
        }

        class SyncActionMessageRange implements ISyncActionMessageRange {
            constructor(p?: proto.SyncActionValue.ISyncActionMessageRange);
            public lastMessageTimestamp: (number|Long);
            public lastSystemMessageTimestamp: (number|Long);
            public messages: proto.SyncActionValue.ISyncActionMessage[];
            public static create(properties?: proto.SyncActionValue.ISyncActionMessageRange): proto.SyncActionValue.SyncActionMessageRange;
            public static encode(m: proto.SyncActionValue.ISyncActionMessageRange, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.SyncActionMessageRange;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface ITimeFormatAction {
            isTwentyFourHourFormatEnabled?: (boolean|null);
        }

        class TimeFormatAction implements ITimeFormatAction {
            constructor(p?: proto.SyncActionValue.ITimeFormatAction);
            public isTwentyFourHourFormatEnabled: boolean;
            public static create(properties?: proto.SyncActionValue.ITimeFormatAction): proto.SyncActionValue.TimeFormatAction;
            public static encode(m: proto.SyncActionValue.ITimeFormatAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.TimeFormatAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IUnarchiveChatsSetting {
            unarchiveChats?: (boolean|null);
        }

        class UnarchiveChatsSetting implements IUnarchiveChatsSetting {
            constructor(p?: proto.SyncActionValue.IUnarchiveChatsSetting);
            public unarchiveChats: boolean;
            public static create(properties?: proto.SyncActionValue.IUnarchiveChatsSetting): proto.SyncActionValue.UnarchiveChatsSetting;
            public static encode(m: proto.SyncActionValue.IUnarchiveChatsSetting, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.UnarchiveChatsSetting;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IUserStatusMuteAction {
            muted?: (boolean|null);
        }

        class UserStatusMuteAction implements IUserStatusMuteAction {
            constructor(p?: proto.SyncActionValue.IUserStatusMuteAction);
            public muted: boolean;
            public static create(properties?: proto.SyncActionValue.IUserStatusMuteAction): proto.SyncActionValue.UserStatusMuteAction;
            public static encode(m: proto.SyncActionValue.IUserStatusMuteAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.UserStatusMuteAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IUsernameChatStartModeAction {
            chatStartMode?: (proto.SyncActionValue.UsernameChatStartModeAction.ChatStartMode|null);
        }

        class UsernameChatStartModeAction implements IUsernameChatStartModeAction {
            constructor(p?: proto.SyncActionValue.IUsernameChatStartModeAction);
            public chatStartMode: proto.SyncActionValue.UsernameChatStartModeAction.ChatStartMode;
            public static create(properties?: proto.SyncActionValue.IUsernameChatStartModeAction): proto.SyncActionValue.UsernameChatStartModeAction;
            public static encode(m: proto.SyncActionValue.IUsernameChatStartModeAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.UsernameChatStartModeAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace UsernameChatStartModeAction {

            enum ChatStartMode {
                LID = 1,
                PN = 2
            }
        }

        interface IWaffleAccountLinkStateAction {
            linkState?: (proto.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState|null);
        }

        class WaffleAccountLinkStateAction implements IWaffleAccountLinkStateAction {
            constructor(p?: proto.SyncActionValue.IWaffleAccountLinkStateAction);
            public linkState: proto.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState;
            public static create(properties?: proto.SyncActionValue.IWaffleAccountLinkStateAction): proto.SyncActionValue.WaffleAccountLinkStateAction;
            public static encode(m: proto.SyncActionValue.IWaffleAccountLinkStateAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.WaffleAccountLinkStateAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WaffleAccountLinkStateAction {

            enum AccountLinkState {
                ACTIVE = 0
            }
        }

        interface IWamoUserIdentifierAction {
            identifier?: (string|null);
        }

        class WamoUserIdentifierAction implements IWamoUserIdentifierAction {
            constructor(p?: proto.SyncActionValue.IWamoUserIdentifierAction);
            public identifier: string;
            public static create(properties?: proto.SyncActionValue.IWamoUserIdentifierAction): proto.SyncActionValue.WamoUserIdentifierAction;
            public static encode(m: proto.SyncActionValue.IWamoUserIdentifierAction, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncActionValue.WamoUserIdentifierAction;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface ISyncdIndex {
        blob?: (Uint8Array|null);
    }

    class SyncdIndex implements ISyncdIndex {
        constructor(p?: proto.ISyncdIndex);
        public blob: Uint8Array;
        public static create(properties?: proto.ISyncdIndex): proto.SyncdIndex;
        public static encode(m: proto.ISyncdIndex, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdIndex;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdMutation {
        operation?: (proto.SyncdMutation.SyncdOperation|null);
        record?: (proto.ISyncdRecord|null);
    }

    class SyncdMutation implements ISyncdMutation {
        constructor(p?: proto.ISyncdMutation);
        public operation: proto.SyncdMutation.SyncdOperation;
        public record?: (proto.ISyncdRecord|null);
        public static create(properties?: proto.ISyncdMutation): proto.SyncdMutation;
        public static encode(m: proto.ISyncdMutation, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdMutation;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SyncdMutation {

        enum SyncdOperation {
            SET = 0,
            REMOVE = 1
        }
    }

    interface ISyncdMutations {
        mutations?: (proto.ISyncdMutation[]|null);
    }

    class SyncdMutations implements ISyncdMutations {
        constructor(p?: proto.ISyncdMutations);
        public mutations: proto.ISyncdMutation[];
        public static create(properties?: proto.ISyncdMutations): proto.SyncdMutations;
        public static encode(m: proto.ISyncdMutations, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdMutations;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdPatch {
        version?: (proto.ISyncdVersion|null);
        mutations?: (proto.ISyncdMutation[]|null);
        externalMutations?: (proto.IExternalBlobReference|null);
        snapshotMac?: (Uint8Array|null);
        patchMac?: (Uint8Array|null);
        keyId?: (proto.IKeyId|null);
        exitCode?: (proto.IExitCode|null);
        deviceIndex?: (number|null);
        clientDebugData?: (Uint8Array|null);
    }

    class SyncdPatch implements ISyncdPatch {
        constructor(p?: proto.ISyncdPatch);
        public version?: (proto.ISyncdVersion|null);
        public mutations: proto.ISyncdMutation[];
        public externalMutations?: (proto.IExternalBlobReference|null);
        public snapshotMac: Uint8Array;
        public patchMac: Uint8Array;
        public keyId?: (proto.IKeyId|null);
        public exitCode?: (proto.IExitCode|null);
        public deviceIndex: number;
        public clientDebugData: Uint8Array;
        public static create(properties?: proto.ISyncdPatch): proto.SyncdPatch;
        public static encode(m: proto.ISyncdPatch, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdPatch;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdRecord {
        index?: (proto.ISyncdIndex|null);
        value?: (proto.ISyncdValue|null);
        keyId?: (proto.IKeyId|null);
    }

    class SyncdRecord implements ISyncdRecord {
        constructor(p?: proto.ISyncdRecord);
        public index?: (proto.ISyncdIndex|null);
        public value?: (proto.ISyncdValue|null);
        public keyId?: (proto.IKeyId|null);
        public static create(properties?: proto.ISyncdRecord): proto.SyncdRecord;
        public static encode(m: proto.ISyncdRecord, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdRecord;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdSnapshot {
        version?: (proto.ISyncdVersion|null);
        records?: (proto.ISyncdRecord[]|null);
        mac?: (Uint8Array|null);
        keyId?: (proto.IKeyId|null);
    }

    class SyncdSnapshot implements ISyncdSnapshot {
        constructor(p?: proto.ISyncdSnapshot);
        public version?: (proto.ISyncdVersion|null);
        public records: proto.ISyncdRecord[];
        public mac: Uint8Array;
        public keyId?: (proto.IKeyId|null);
        public static create(properties?: proto.ISyncdSnapshot): proto.SyncdSnapshot;
        public static encode(m: proto.ISyncdSnapshot, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdSnapshot;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdValue {
        blob?: (Uint8Array|null);
    }

    class SyncdValue implements ISyncdValue {
        constructor(p?: proto.ISyncdValue);
        public blob: Uint8Array;
        public static create(properties?: proto.ISyncdValue): proto.SyncdValue;
        public static encode(m: proto.ISyncdValue, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdValue;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ISyncdVersion {
        version?: (number|Long|null);
    }

    class SyncdVersion implements ISyncdVersion {
        constructor(p?: proto.ISyncdVersion);
        public version: (number|Long);
        public static create(properties?: proto.ISyncdVersion): proto.SyncdVersion;
        public static encode(m: proto.ISyncdVersion, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.SyncdVersion;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ITapLinkAction {
        title?: (string|null);
        tapUrl?: (string|null);
    }

    class TapLinkAction implements ITapLinkAction {
        constructor(p?: proto.ITapLinkAction);
        public title: string;
        public tapUrl: string;
        public static create(properties?: proto.ITapLinkAction): proto.TapLinkAction;
        public static encode(m: proto.ITapLinkAction, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.TapLinkAction;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface ITemplateButton {
        index?: (number|null);
        quickReplyButton?: (proto.TemplateButton.IQuickReplyButton|null);
        urlButton?: (proto.TemplateButton.IURLButton|null);
        callButton?: (proto.TemplateButton.ICallButton|null);
    }

    class TemplateButton implements ITemplateButton {
        constructor(p?: proto.ITemplateButton);
        public index: number;
        public quickReplyButton?: (proto.TemplateButton.IQuickReplyButton|null);
        public urlButton?: (proto.TemplateButton.IURLButton|null);
        public callButton?: (proto.TemplateButton.ICallButton|null);
        public button?: ("quickReplyButton"|"urlButton"|"callButton");
        public static create(properties?: proto.ITemplateButton): proto.TemplateButton;
        public static encode(m: proto.ITemplateButton, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.TemplateButton;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace TemplateButton {

        interface ICallButton {
            displayText?: (proto.Message.IHighlyStructuredMessage|null);
            phoneNumber?: (proto.Message.IHighlyStructuredMessage|null);
        }

        class CallButton implements ICallButton {
            constructor(p?: proto.TemplateButton.ICallButton);
            public displayText?: (proto.Message.IHighlyStructuredMessage|null);
            public phoneNumber?: (proto.Message.IHighlyStructuredMessage|null);
            public static create(properties?: proto.TemplateButton.ICallButton): proto.TemplateButton.CallButton;
            public static encode(m: proto.TemplateButton.ICallButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.TemplateButton.CallButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IQuickReplyButton {
            displayText?: (proto.Message.IHighlyStructuredMessage|null);
            id?: (string|null);
        }

        class QuickReplyButton implements IQuickReplyButton {
            constructor(p?: proto.TemplateButton.IQuickReplyButton);
            public displayText?: (proto.Message.IHighlyStructuredMessage|null);
            public id: string;
            public static create(properties?: proto.TemplateButton.IQuickReplyButton): proto.TemplateButton.QuickReplyButton;
            public static encode(m: proto.TemplateButton.IQuickReplyButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.TemplateButton.QuickReplyButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        interface IURLButton {
            displayText?: (proto.Message.IHighlyStructuredMessage|null);
            url?: (proto.Message.IHighlyStructuredMessage|null);
        }

        class URLButton implements IURLButton {
            constructor(p?: proto.TemplateButton.IURLButton);
            public displayText?: (proto.Message.IHighlyStructuredMessage|null);
            public url?: (proto.Message.IHighlyStructuredMessage|null);
            public static create(properties?: proto.TemplateButton.IURLButton): proto.TemplateButton.URLButton;
            public static encode(m: proto.TemplateButton.IURLButton, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.TemplateButton.URLButton;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IUrlTrackingMap {
        urlTrackingMapElements?: (proto.UrlTrackingMap.IUrlTrackingMapElement[]|null);
    }

    class UrlTrackingMap implements IUrlTrackingMap {
        constructor(p?: proto.IUrlTrackingMap);
        public urlTrackingMapElements: proto.UrlTrackingMap.IUrlTrackingMapElement[];
        public static create(properties?: proto.IUrlTrackingMap): proto.UrlTrackingMap;
        public static encode(m: proto.IUrlTrackingMap, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UrlTrackingMap;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UrlTrackingMap {

        interface IUrlTrackingMapElement {
            originalUrl?: (string|null);
            unconsentedUsersUrl?: (string|null);
            consentedUsersUrl?: (string|null);
            cardIndex?: (number|null);
        }

        class UrlTrackingMapElement implements IUrlTrackingMapElement {
            constructor(p?: proto.UrlTrackingMap.IUrlTrackingMapElement);
            public originalUrl: string;
            public unconsentedUsersUrl: string;
            public consentedUsersUrl: string;
            public cardIndex: number;
            public static create(properties?: proto.UrlTrackingMap.IUrlTrackingMapElement): proto.UrlTrackingMap.UrlTrackingMapElement;
            public static encode(m: proto.UrlTrackingMap.IUrlTrackingMapElement, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UrlTrackingMap.UrlTrackingMapElement;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IUserPassword {
        encoding?: (proto.UserPassword.Encoding|null);
        transformer?: (proto.UserPassword.Transformer|null);
        transformerArg?: (proto.UserPassword.ITransformerArg[]|null);
        transformedData?: (Uint8Array|null);
    }

    class UserPassword implements IUserPassword {
        constructor(p?: proto.IUserPassword);
        public encoding: proto.UserPassword.Encoding;
        public transformer: proto.UserPassword.Transformer;
        public transformerArg: proto.UserPassword.ITransformerArg[];
        public transformedData: Uint8Array;
        public static create(properties?: proto.IUserPassword): proto.UserPassword;
        public static encode(m: proto.IUserPassword, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UserPassword;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UserPassword {

        enum Encoding {
            UTF8 = 0,
            UTF8_BROKEN = 1
        }

        enum Transformer {
            NONE = 0,
            PBKDF2_HMAC_SHA512 = 1,
            PBKDF2_HMAC_SHA384 = 2
        }

        interface ITransformerArg {
            key?: (string|null);
            value?: (proto.UserPassword.TransformerArg.IValue|null);
        }

        class TransformerArg implements ITransformerArg {
            constructor(p?: proto.UserPassword.ITransformerArg);
            public key: string;
            public value?: (proto.UserPassword.TransformerArg.IValue|null);
            public static create(properties?: proto.UserPassword.ITransformerArg): proto.UserPassword.TransformerArg;
            public static encode(m: proto.UserPassword.ITransformerArg, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UserPassword.TransformerArg;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace TransformerArg {

            interface IValue {
                asBlob?: (Uint8Array|null);
                asUnsignedInteger?: (number|null);
            }

            class Value implements IValue {
                constructor(p?: proto.UserPassword.TransformerArg.IValue);
                public asBlob?: (Uint8Array|null);
                public asUnsignedInteger?: (number|null);
                public value?: ("asBlob"|"asUnsignedInteger");
                public static create(properties?: proto.UserPassword.TransformerArg.IValue): proto.UserPassword.TransformerArg.Value;
                public static encode(m: proto.UserPassword.TransformerArg.IValue, w?: $protobuf.Writer): $protobuf.Writer;
                public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UserPassword.TransformerArg.Value;
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    interface IUserReceipt {
        userJid: string;
        receiptTimestamp?: (number|Long|null);
        readTimestamp?: (number|Long|null);
        playedTimestamp?: (number|Long|null);
        pendingDeviceJid?: (string[]|null);
        deliveredDeviceJid?: (string[]|null);
    }

    class UserReceipt implements IUserReceipt {
        constructor(p?: proto.IUserReceipt);
        public userJid: string;
        public receiptTimestamp: (number|Long);
        public readTimestamp: (number|Long);
        public playedTimestamp: (number|Long);
        public pendingDeviceJid: string[];
        public deliveredDeviceJid: string[];
        public static create(properties?: proto.IUserReceipt): proto.UserReceipt;
        public static encode(m: proto.IUserReceipt, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.UserReceipt;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IVerifiedNameCertificate {
        details?: (Uint8Array|null);
        signature?: (Uint8Array|null);
        serverSignature?: (Uint8Array|null);
    }

    class VerifiedNameCertificate implements IVerifiedNameCertificate {
        constructor(p?: proto.IVerifiedNameCertificate);
        public details: Uint8Array;
        public signature: Uint8Array;
        public serverSignature: Uint8Array;
        public static create(properties?: proto.IVerifiedNameCertificate): proto.VerifiedNameCertificate;
        public static encode(m: proto.IVerifiedNameCertificate, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.VerifiedNameCertificate;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace VerifiedNameCertificate {

        interface IDetails {
            serial?: (number|Long|null);
            issuer?: (string|null);
            verifiedName?: (string|null);
            localizedNames?: (proto.ILocalizedName[]|null);
            issueTime?: (number|Long|null);
        }

        class Details implements IDetails {
            constructor(p?: proto.VerifiedNameCertificate.IDetails);
            public serial: (number|Long);
            public issuer: string;
            public verifiedName: string;
            public localizedNames: proto.ILocalizedName[];
            public issueTime: (number|Long);
            public static create(properties?: proto.VerifiedNameCertificate.IDetails): proto.VerifiedNameCertificate.Details;
            public static encode(m: proto.VerifiedNameCertificate.IDetails, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.VerifiedNameCertificate.Details;
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    interface IWallpaperSettings {
        filename?: (string|null);
        opacity?: (number|null);
    }

    class WallpaperSettings implements IWallpaperSettings {
        constructor(p?: proto.IWallpaperSettings);
        public filename: string;
        public opacity: number;
        public static create(properties?: proto.IWallpaperSettings): proto.WallpaperSettings;
        public static encode(m: proto.IWallpaperSettings, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.WallpaperSettings;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IWebFeatures {
        labelsDisplay?: (proto.WebFeatures.Flag|null);
        voipIndividualOutgoing?: (proto.WebFeatures.Flag|null);
        groupsV3?: (proto.WebFeatures.Flag|null);
        groupsV3Create?: (proto.WebFeatures.Flag|null);
        changeNumberV2?: (proto.WebFeatures.Flag|null);
        queryStatusV3Thumbnail?: (proto.WebFeatures.Flag|null);
        liveLocations?: (proto.WebFeatures.Flag|null);
        queryVname?: (proto.WebFeatures.Flag|null);
        voipIndividualIncoming?: (proto.WebFeatures.Flag|null);
        quickRepliesQuery?: (proto.WebFeatures.Flag|null);
        payments?: (proto.WebFeatures.Flag|null);
        stickerPackQuery?: (proto.WebFeatures.Flag|null);
        liveLocationsFinal?: (proto.WebFeatures.Flag|null);
        labelsEdit?: (proto.WebFeatures.Flag|null);
        mediaUpload?: (proto.WebFeatures.Flag|null);
        mediaUploadRichQuickReplies?: (proto.WebFeatures.Flag|null);
        vnameV2?: (proto.WebFeatures.Flag|null);
        videoPlaybackUrl?: (proto.WebFeatures.Flag|null);
        statusRanking?: (proto.WebFeatures.Flag|null);
        voipIndividualVideo?: (proto.WebFeatures.Flag|null);
        thirdPartyStickers?: (proto.WebFeatures.Flag|null);
        frequentlyForwardedSetting?: (proto.WebFeatures.Flag|null);
        groupsV4JoinPermission?: (proto.WebFeatures.Flag|null);
        recentStickers?: (proto.WebFeatures.Flag|null);
        catalog?: (proto.WebFeatures.Flag|null);
        starredStickers?: (proto.WebFeatures.Flag|null);
        voipGroupCall?: (proto.WebFeatures.Flag|null);
        templateMessage?: (proto.WebFeatures.Flag|null);
        templateMessageInteractivity?: (proto.WebFeatures.Flag|null);
        ephemeralMessages?: (proto.WebFeatures.Flag|null);
        e2ENotificationSync?: (proto.WebFeatures.Flag|null);
        recentStickersV2?: (proto.WebFeatures.Flag|null);
        recentStickersV3?: (proto.WebFeatures.Flag|null);
        userNotice?: (proto.WebFeatures.Flag|null);
        support?: (proto.WebFeatures.Flag|null);
        groupUiiCleanup?: (proto.WebFeatures.Flag|null);
        groupDogfoodingInternalOnly?: (proto.WebFeatures.Flag|null);
        settingsSync?: (proto.WebFeatures.Flag|null);
        archiveV2?: (proto.WebFeatures.Flag|null);
        ephemeralAllowGroupMembers?: (proto.WebFeatures.Flag|null);
        ephemeral24HDuration?: (proto.WebFeatures.Flag|null);
        mdForceUpgrade?: (proto.WebFeatures.Flag|null);
        disappearingMode?: (proto.WebFeatures.Flag|null);
        externalMdOptInAvailable?: (proto.WebFeatures.Flag|null);
        noDeleteMessageTimeLimit?: (proto.WebFeatures.Flag|null);
    }

    class WebFeatures implements IWebFeatures {
        constructor(p?: proto.IWebFeatures);
        public labelsDisplay: proto.WebFeatures.Flag;
        public voipIndividualOutgoing: proto.WebFeatures.Flag;
        public groupsV3: proto.WebFeatures.Flag;
        public groupsV3Create: proto.WebFeatures.Flag;
        public changeNumberV2: proto.WebFeatures.Flag;
        public queryStatusV3Thumbnail: proto.WebFeatures.Flag;
        public liveLocations: proto.WebFeatures.Flag;
        public queryVname: proto.WebFeatures.Flag;
        public voipIndividualIncoming: proto.WebFeatures.Flag;
        public quickRepliesQuery: proto.WebFeatures.Flag;
        public payments: proto.WebFeatures.Flag;
        public stickerPackQuery: proto.WebFeatures.Flag;
        public liveLocationsFinal: proto.WebFeatures.Flag;
        public labelsEdit: proto.WebFeatures.Flag;
        public mediaUpload: proto.WebFeatures.Flag;
        public mediaUploadRichQuickReplies: proto.WebFeatures.Flag;
        public vnameV2: proto.WebFeatures.Flag;
        public videoPlaybackUrl: proto.WebFeatures.Flag;
        public statusRanking: proto.WebFeatures.Flag;
        public voipIndividualVideo: proto.WebFeatures.Flag;
        public thirdPartyStickers: proto.WebFeatures.Flag;
        public frequentlyForwardedSetting: proto.WebFeatures.Flag;
        public groupsV4JoinPermission: proto.WebFeatures.Flag;
        public recentStickers: proto.WebFeatures.Flag;
        public catalog: proto.WebFeatures.Flag;
        public starredStickers: proto.WebFeatures.Flag;
        public voipGroupCall: proto.WebFeatures.Flag;
        public templateMessage: proto.WebFeatures.Flag;
        public templateMessageInteractivity: proto.WebFeatures.Flag;
        public ephemeralMessages: proto.WebFeatures.Flag;
        public e2ENotificationSync: proto.WebFeatures.Flag;
        public recentStickersV2: proto.WebFeatures.Flag;
        public recentStickersV3: proto.WebFeatures.Flag;
        public userNotice: proto.WebFeatures.Flag;
        public support: proto.WebFeatures.Flag;
        public groupUiiCleanup: proto.WebFeatures.Flag;
        public groupDogfoodingInternalOnly: proto.WebFeatures.Flag;
        public settingsSync: proto.WebFeatures.Flag;
        public archiveV2: proto.WebFeatures.Flag;
        public ephemeralAllowGroupMembers: proto.WebFeatures.Flag;
        public ephemeral24HDuration: proto.WebFeatures.Flag;
        public mdForceUpgrade: proto.WebFeatures.Flag;
        public disappearingMode: proto.WebFeatures.Flag;
        public externalMdOptInAvailable: proto.WebFeatures.Flag;
        public noDeleteMessageTimeLimit: proto.WebFeatures.Flag;
        public static create(properties?: proto.IWebFeatures): proto.WebFeatures;
        public static encode(m: proto.IWebFeatures, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.WebFeatures;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace WebFeatures {

        enum Flag {
            NOT_STARTED = 0,
            FORCE_UPGRADE = 1,
            DEVELOPMENT = 2,
            PRODUCTION = 3
        }
    }

    interface IWebMessageInfo {
        key: proto.IMessageKey;
        message?: (proto.IMessage|null);
        messageTimestamp?: (number|Long|null);
        status?: (proto.WebMessageInfo.Status|null);
        participant?: (string|null);
        messageC2STimestamp?: (number|Long|null);
        ignore?: (boolean|null);
        starred?: (boolean|null);
        broadcast?: (boolean|null);
        pushName?: (string|null);
        mediaCiphertextSha256?: (Uint8Array|null);
        multicast?: (boolean|null);
        urlText?: (boolean|null);
        urlNumber?: (boolean|null);
        messageStubType?: (proto.WebMessageInfo.StubType|null);
        clearMedia?: (boolean|null);
        messageStubParameters?: (string[]|null);
        duration?: (number|null);
        labels?: (string[]|null);
        paymentInfo?: (proto.IPaymentInfo|null);
        finalLiveLocation?: (proto.Message.ILiveLocationMessage|null);
        quotedPaymentInfo?: (proto.IPaymentInfo|null);
        ephemeralStartTimestamp?: (number|Long|null);
        ephemeralDuration?: (number|null);
        ephemeralOffToOn?: (boolean|null);
        ephemeralOutOfSync?: (boolean|null);
        bizPrivacyStatus?: (proto.WebMessageInfo.BizPrivacyStatus|null);
        verifiedBizName?: (string|null);
        mediaData?: (proto.IMediaData|null);
        photoChange?: (proto.IPhotoChange|null);
        userReceipt?: (proto.IUserReceipt[]|null);
        reactions?: (proto.IReaction[]|null);
        quotedStickerData?: (proto.IMediaData|null);
        futureproofData?: (Uint8Array|null);
        statusPsa?: (proto.IStatusPSA|null);
        pollUpdates?: (proto.IPollUpdate[]|null);
        pollAdditionalMetadata?: (proto.IPollAdditionalMetadata|null);
        agentId?: (string|null);
        statusAlreadyViewed?: (boolean|null);
        messageSecret?: (Uint8Array|null);
        keepInChat?: (proto.IKeepInChat|null);
        originalSelfAuthorUserJidString?: (string|null);
        revokeMessageTimestamp?: (number|Long|null);
        pinInChat?: (proto.IPinInChat|null);
        premiumMessageInfo?: (proto.IPremiumMessageInfo|null);
        is1PBizBotMessage?: (boolean|null);
        isGroupHistoryMessage?: (boolean|null);
        botMessageInvokerJid?: (string|null);
        commentMetadata?: (proto.ICommentMetadata|null);
        eventResponses?: (proto.IEventResponse[]|null);
        reportingTokenInfo?: (proto.IReportingTokenInfo|null);
        newsletterServerId?: (number|Long|null);
        eventAdditionalMetadata?: (proto.IEventAdditionalMetadata|null);
        isMentionedInStatus?: (boolean|null);
        statusMentions?: (string[]|null);
        targetMessageId?: (proto.IMessageKey|null);
        messageAddOns?: (proto.IMessageAddOn[]|null);
        statusMentionMessageInfo?: (proto.IStatusMentionMessage|null);
        isSupportAiMessage?: (boolean|null);
        statusMentionSources?: (string[]|null);
        supportAiCitations?: (proto.ICitation[]|null);
        botTargetId?: (string|null);
    }

    class WebMessageInfo implements IWebMessageInfo {
        constructor(p?: proto.IWebMessageInfo);
        public key: proto.IMessageKey;
        public message?: (proto.IMessage|null);
        public messageTimestamp: (number|Long);
        public status: proto.WebMessageInfo.Status;
        public participant: string;
        public messageC2STimestamp: (number|Long);
        public ignore: boolean;
        public starred: boolean;
        public broadcast: boolean;
        public pushName: string;
        public mediaCiphertextSha256: Uint8Array;
        public multicast: boolean;
        public urlText: boolean;
        public urlNumber: boolean;
        public messageStubType: proto.WebMessageInfo.StubType;
        public clearMedia: boolean;
        public messageStubParameters: string[];
        public duration: number;
        public labels: string[];
        public paymentInfo?: (proto.IPaymentInfo|null);
        public finalLiveLocation?: (proto.Message.ILiveLocationMessage|null);
        public quotedPaymentInfo?: (proto.IPaymentInfo|null);
        public ephemeralStartTimestamp: (number|Long);
        public ephemeralDuration: number;
        public ephemeralOffToOn: boolean;
        public ephemeralOutOfSync: boolean;
        public bizPrivacyStatus: proto.WebMessageInfo.BizPrivacyStatus;
        public verifiedBizName: string;
        public mediaData?: (proto.IMediaData|null);
        public photoChange?: (proto.IPhotoChange|null);
        public userReceipt: proto.IUserReceipt[];
        public reactions: proto.IReaction[];
        public quotedStickerData?: (proto.IMediaData|null);
        public futureproofData: Uint8Array;
        public statusPsa?: (proto.IStatusPSA|null);
        public pollUpdates: proto.IPollUpdate[];
        public pollAdditionalMetadata?: (proto.IPollAdditionalMetadata|null);
        public agentId: string;
        public statusAlreadyViewed: boolean;
        public messageSecret: Uint8Array;
        public keepInChat?: (proto.IKeepInChat|null);
        public originalSelfAuthorUserJidString: string;
        public revokeMessageTimestamp: (number|Long);
        public pinInChat?: (proto.IPinInChat|null);
        public premiumMessageInfo?: (proto.IPremiumMessageInfo|null);
        public is1PBizBotMessage: boolean;
        public isGroupHistoryMessage: boolean;
        public botMessageInvokerJid: string;
        public commentMetadata?: (proto.ICommentMetadata|null);
        public eventResponses: proto.IEventResponse[];
        public reportingTokenInfo?: (proto.IReportingTokenInfo|null);
        public newsletterServerId: (number|Long);
        public eventAdditionalMetadata?: (proto.IEventAdditionalMetadata|null);
        public isMentionedInStatus: boolean;
        public statusMentions: string[];
        public targetMessageId?: (proto.IMessageKey|null);
        public messageAddOns: proto.IMessageAddOn[];
        public statusMentionMessageInfo?: (proto.IStatusMentionMessage|null);
        public isSupportAiMessage: boolean;
        public statusMentionSources: string[];
        public supportAiCitations: proto.ICitation[];
        public botTargetId: string;
        public static create(properties?: proto.IWebMessageInfo): proto.WebMessageInfo;
        public static encode(m: proto.IWebMessageInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.WebMessageInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace WebMessageInfo {

        enum BizPrivacyStatus {
            E2EE = 0,
            FB = 2,
            BSP = 1,
            BSP_AND_FB = 3
        }

        enum Status {
            ERROR = 0,
            PENDING = 1,
            SERVER_ACK = 2,
            DELIVERY_ACK = 3,
            READ = 4,
            PLAYED = 5
        }

        enum StubType {
            UNKNOWN = 0,
            REVOKE = 1,
            CIPHERTEXT = 2,
            FUTUREPROOF = 3,
            NON_VERIFIED_TRANSITION = 4,
            UNVERIFIED_TRANSITION = 5,
            VERIFIED_TRANSITION = 6,
            VERIFIED_LOW_UNKNOWN = 7,
            VERIFIED_HIGH = 8,
            VERIFIED_INITIAL_UNKNOWN = 9,
            VERIFIED_INITIAL_LOW = 10,
            VERIFIED_INITIAL_HIGH = 11,
            VERIFIED_TRANSITION_ANY_TO_NONE = 12,
            VERIFIED_TRANSITION_ANY_TO_HIGH = 13,
            VERIFIED_TRANSITION_HIGH_TO_LOW = 14,
            VERIFIED_TRANSITION_HIGH_TO_UNKNOWN = 15,
            VERIFIED_TRANSITION_UNKNOWN_TO_LOW = 16,
            VERIFIED_TRANSITION_LOW_TO_UNKNOWN = 17,
            VERIFIED_TRANSITION_NONE_TO_LOW = 18,
            VERIFIED_TRANSITION_NONE_TO_UNKNOWN = 19,
            GROUP_CREATE = 20,
            GROUP_CHANGE_SUBJECT = 21,
            GROUP_CHANGE_ICON = 22,
            GROUP_CHANGE_INVITE_LINK = 23,
            GROUP_CHANGE_DESCRIPTION = 24,
            GROUP_CHANGE_RESTRICT = 25,
            GROUP_CHANGE_ANNOUNCE = 26,
            GROUP_PARTICIPANT_ADD = 27,
            GROUP_PARTICIPANT_REMOVE = 28,
            GROUP_PARTICIPANT_PROMOTE = 29,
            GROUP_PARTICIPANT_DEMOTE = 30,
            GROUP_PARTICIPANT_INVITE = 31,
            GROUP_PARTICIPANT_LEAVE = 32,
            GROUP_PARTICIPANT_CHANGE_NUMBER = 33,
            BROADCAST_CREATE = 34,
            BROADCAST_ADD = 35,
            BROADCAST_REMOVE = 36,
            GENERIC_NOTIFICATION = 37,
            E2E_IDENTITY_CHANGED = 38,
            E2E_ENCRYPTED = 39,
            CALL_MISSED_VOICE = 40,
            CALL_MISSED_VIDEO = 41,
            INDIVIDUAL_CHANGE_NUMBER = 42,
            GROUP_DELETE = 43,
            GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE = 44,
            CALL_MISSED_GROUP_VOICE = 45,
            CALL_MISSED_GROUP_VIDEO = 46,
            PAYMENT_CIPHERTEXT = 47,
            PAYMENT_FUTUREPROOF = 48,
            PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED = 49,
            PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED = 50,
            PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED = 51,
            PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP = 52,
            PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP = 53,
            PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER = 54,
            PAYMENT_ACTION_SEND_PAYMENT_REMINDER = 55,
            PAYMENT_ACTION_SEND_PAYMENT_INVITATION = 56,
            PAYMENT_ACTION_REQUEST_DECLINED = 57,
            PAYMENT_ACTION_REQUEST_EXPIRED = 58,
            PAYMENT_ACTION_REQUEST_CANCELLED = 59,
            BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM = 60,
            BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP = 61,
            BIZ_INTRO_TOP = 62,
            BIZ_INTRO_BOTTOM = 63,
            BIZ_NAME_CHANGE = 64,
            BIZ_MOVE_TO_CONSUMER_APP = 65,
            BIZ_TWO_TIER_MIGRATION_TOP = 66,
            BIZ_TWO_TIER_MIGRATION_BOTTOM = 67,
            OVERSIZED = 68,
            GROUP_CHANGE_NO_FREQUENTLY_FORWARDED = 69,
            GROUP_V4_ADD_INVITE_SENT = 70,
            GROUP_PARTICIPANT_ADD_REQUEST_JOIN = 71,
            CHANGE_EPHEMERAL_SETTING = 72,
            E2E_DEVICE_CHANGED = 73,
            VIEWED_ONCE = 74,
            E2E_ENCRYPTED_NOW = 75,
            BLUE_MSG_BSP_FB_TO_BSP_PREMISE = 76,
            BLUE_MSG_BSP_FB_TO_SELF_FB = 77,
            BLUE_MSG_BSP_FB_TO_SELF_PREMISE = 78,
            BLUE_MSG_BSP_FB_UNVERIFIED = 79,
            BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 80,
            BLUE_MSG_BSP_FB_VERIFIED = 81,
            BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 82,
            BLUE_MSG_BSP_PREMISE_TO_SELF_PREMISE = 83,
            BLUE_MSG_BSP_PREMISE_UNVERIFIED = 84,
            BLUE_MSG_BSP_PREMISE_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 85,
            BLUE_MSG_BSP_PREMISE_VERIFIED = 86,
            BLUE_MSG_BSP_PREMISE_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 87,
            BLUE_MSG_CONSUMER_TO_BSP_FB_UNVERIFIED = 88,
            BLUE_MSG_CONSUMER_TO_BSP_PREMISE_UNVERIFIED = 89,
            BLUE_MSG_CONSUMER_TO_SELF_FB_UNVERIFIED = 90,
            BLUE_MSG_CONSUMER_TO_SELF_PREMISE_UNVERIFIED = 91,
            BLUE_MSG_SELF_FB_TO_BSP_PREMISE = 92,
            BLUE_MSG_SELF_FB_TO_SELF_PREMISE = 93,
            BLUE_MSG_SELF_FB_UNVERIFIED = 94,
            BLUE_MSG_SELF_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 95,
            BLUE_MSG_SELF_FB_VERIFIED = 96,
            BLUE_MSG_SELF_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 97,
            BLUE_MSG_SELF_PREMISE_TO_BSP_PREMISE = 98,
            BLUE_MSG_SELF_PREMISE_UNVERIFIED = 99,
            BLUE_MSG_SELF_PREMISE_VERIFIED = 100,
            BLUE_MSG_TO_BSP_FB = 101,
            BLUE_MSG_TO_CONSUMER = 102,
            BLUE_MSG_TO_SELF_FB = 103,
            BLUE_MSG_UNVERIFIED_TO_BSP_FB_VERIFIED = 104,
            BLUE_MSG_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 105,
            BLUE_MSG_UNVERIFIED_TO_SELF_FB_VERIFIED = 106,
            BLUE_MSG_UNVERIFIED_TO_VERIFIED = 107,
            BLUE_MSG_VERIFIED_TO_BSP_FB_UNVERIFIED = 108,
            BLUE_MSG_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 109,
            BLUE_MSG_VERIFIED_TO_SELF_FB_UNVERIFIED = 110,
            BLUE_MSG_VERIFIED_TO_UNVERIFIED = 111,
            BLUE_MSG_BSP_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 112,
            BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_FB_VERIFIED = 113,
            BLUE_MSG_BSP_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 114,
            BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_FB_UNVERIFIED = 115,
            BLUE_MSG_SELF_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 116,
            BLUE_MSG_SELF_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 117,
            E2E_IDENTITY_UNAVAILABLE = 118,
            GROUP_CREATING = 119,
            GROUP_CREATE_FAILED = 120,
            GROUP_BOUNCED = 121,
            BLOCK_CONTACT = 122,
            EPHEMERAL_SETTING_NOT_APPLIED = 123,
            SYNC_FAILED = 124,
            SYNCING = 125,
            BIZ_PRIVACY_MODE_INIT_FB = 126,
            BIZ_PRIVACY_MODE_INIT_BSP = 127,
            BIZ_PRIVACY_MODE_TO_FB = 128,
            BIZ_PRIVACY_MODE_TO_BSP = 129,
            DISAPPEARING_MODE = 130,
            E2E_DEVICE_FETCH_FAILED = 131,
            ADMIN_REVOKE = 132,
            GROUP_INVITE_LINK_GROWTH_LOCKED = 133,
            COMMUNITY_LINK_PARENT_GROUP = 134,
            COMMUNITY_LINK_SIBLING_GROUP = 135,
            COMMUNITY_LINK_SUB_GROUP = 136,
            COMMUNITY_UNLINK_PARENT_GROUP = 137,
            COMMUNITY_UNLINK_SIBLING_GROUP = 138,
            COMMUNITY_UNLINK_SUB_GROUP = 139,
            GROUP_PARTICIPANT_ACCEPT = 140,
            GROUP_PARTICIPANT_LINKED_GROUP_JOIN = 141,
            COMMUNITY_CREATE = 142,
            EPHEMERAL_KEEP_IN_CHAT = 143,
            GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST = 144,
            GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE = 145,
            INTEGRITY_UNLINK_PARENT_GROUP = 146,
            COMMUNITY_PARTICIPANT_PROMOTE = 147,
            COMMUNITY_PARTICIPANT_DEMOTE = 148,
            COMMUNITY_PARENT_GROUP_DELETED = 149,
            COMMUNITY_LINK_PARENT_GROUP_MEMBERSHIP_APPROVAL = 150,
            GROUP_PARTICIPANT_JOINED_GROUP_AND_PARENT_GROUP = 151,
            MASKED_THREAD_CREATED = 152,
            MASKED_THREAD_UNMASKED = 153,
            BIZ_CHAT_ASSIGNMENT = 154,
            CHAT_PSA = 155,
            CHAT_POLL_CREATION_MESSAGE = 156,
            CAG_MASKED_THREAD_CREATED = 157,
            COMMUNITY_PARENT_GROUP_SUBJECT_CHANGED = 158,
            CAG_INVITE_AUTO_ADD = 159,
            BIZ_CHAT_ASSIGNMENT_UNASSIGN = 160,
            CAG_INVITE_AUTO_JOINED = 161,
            SCHEDULED_CALL_START_MESSAGE = 162,
            COMMUNITY_INVITE_RICH = 163,
            COMMUNITY_INVITE_AUTO_ADD_RICH = 164,
            SUB_GROUP_INVITE_RICH = 165,
            SUB_GROUP_PARTICIPANT_ADD_RICH = 166,
            COMMUNITY_LINK_PARENT_GROUP_RICH = 167,
            COMMUNITY_PARTICIPANT_ADD_RICH = 168,
            SILENCED_UNKNOWN_CALLER_AUDIO = 169,
            SILENCED_UNKNOWN_CALLER_VIDEO = 170,
            GROUP_MEMBER_ADD_MODE = 171,
            GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD = 172,
            COMMUNITY_CHANGE_DESCRIPTION = 173,
            SENDER_INVITE = 174,
            RECEIVER_INVITE = 175,
            COMMUNITY_ALLOW_MEMBER_ADDED_GROUPS = 176,
            PINNED_MESSAGE_IN_CHAT = 177,
            PAYMENT_INVITE_SETUP_INVITER = 178,
            PAYMENT_INVITE_SETUP_INVITEE_RECEIVE_ONLY = 179,
            PAYMENT_INVITE_SETUP_INVITEE_SEND_AND_RECEIVE = 180,
            LINKED_GROUP_CALL_START = 181,
            REPORT_TO_ADMIN_ENABLED_STATUS = 182,
            EMPTY_SUBGROUP_CREATE = 183,
            SCHEDULED_CALL_CANCEL = 184,
            SUBGROUP_ADMIN_TRIGGERED_AUTO_ADD_RICH = 185,
            GROUP_CHANGE_RECENT_HISTORY_SHARING = 186,
            PAID_MESSAGE_SERVER_CAMPAIGN_ID = 187,
            GENERAL_CHAT_CREATE = 188,
            GENERAL_CHAT_ADD = 189,
            GENERAL_CHAT_AUTO_ADD_DISABLED = 190,
            SUGGESTED_SUBGROUP_ANNOUNCE = 191,
            BIZ_BOT_1P_MESSAGING_ENABLED = 192,
            CHANGE_USERNAME = 193,
            BIZ_COEX_PRIVACY_INIT_SELF = 194,
            BIZ_COEX_PRIVACY_TRANSITION_SELF = 195,
            SUPPORT_AI_EDUCATION = 196,
            BIZ_BOT_3P_MESSAGING_ENABLED = 197,
            REMINDER_SETUP_MESSAGE = 198,
            REMINDER_SENT_MESSAGE = 199,
            REMINDER_CANCEL_MESSAGE = 200,
            BIZ_COEX_PRIVACY_INIT = 201,
            BIZ_COEX_PRIVACY_TRANSITION = 202,
            GROUP_DEACTIVATED = 203,
            COMMUNITY_DEACTIVATE_SIBLING_GROUP = 204,
            EVENT_UPDATED = 205,
            EVENT_CANCELED = 206,
            COMMUNITY_OWNER_UPDATED = 207,
            COMMUNITY_SUB_GROUP_VISIBILITY_HIDDEN = 208,
            CAPI_GROUP_NE2EE_SYSTEM_MESSAGE = 209,
            STATUS_MENTION = 210,
            USER_CONTROLS_SYSTEM_MESSAGE = 211,
            SUPPORT_SYSTEM_MESSAGE = 212,
            CHANGE_LID = 213,
            BIZ_CUSTOMER_3PD_DATA_SHARING_OPT_IN_MESSAGE = 214,
            BIZ_CUSTOMER_3PD_DATA_SHARING_OPT_OUT_MESSAGE = 215,
            CHANGE_LIMIT_SHARING = 216,
            GROUP_MEMBER_LINK_MODE = 217,
            BIZ_AUTOMATICALLY_LABELED_CHAT_SYSTEM_MESSAGE = 218
        }
    }

    interface IWebNotificationsInfo {
        timestamp?: (number|Long|null);
        unreadChats?: (number|null);
        notifyMessageCount?: (number|null);
        notifyMessages?: (proto.IWebMessageInfo[]|null);
    }

    class WebNotificationsInfo implements IWebNotificationsInfo {
        constructor(p?: proto.IWebNotificationsInfo);
        public timestamp: (number|Long);
        public unreadChats: number;
        public notifyMessageCount: number;
        public notifyMessages: proto.IWebMessageInfo[];
        public static create(properties?: proto.IWebNotificationsInfo): proto.WebNotificationsInfo;
        public static encode(m: proto.IWebNotificationsInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): proto.WebNotificationsInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
