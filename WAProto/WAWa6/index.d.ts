import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAWa6. */
export namespace WAWa6 {

    /** Properties of a ClientPayload. */
    interface IClientPayload {

        /** ClientPayload username */
        username?: (number|Long|null);

        /** ClientPayload passive */
        passive?: (boolean|null);

        /** ClientPayload userAgent */
        userAgent?: (WAWa6.ClientPayload.IUserAgent|null);

        /** ClientPayload webInfo */
        webInfo?: (WAWa6.ClientPayload.IWebInfo|null);

        /** ClientPayload pushName */
        pushName?: (string|null);

        /** ClientPayload sessionID */
        sessionID?: (number|null);

        /** ClientPayload shortConnect */
        shortConnect?: (boolean|null);

        /** ClientPayload connectType */
        connectType?: (WAWa6.ClientPayload.ConnectType|null);

        /** ClientPayload connectReason */
        connectReason?: (WAWa6.ClientPayload.ConnectReason|null);

        /** ClientPayload shards */
        shards?: (number[]|null);

        /** ClientPayload dnsSource */
        dnsSource?: (WAWa6.ClientPayload.IDNSSource|null);

        /** ClientPayload connectAttemptCount */
        connectAttemptCount?: (number|null);

        /** ClientPayload device */
        device?: (number|null);

        /** ClientPayload devicePairingData */
        devicePairingData?: (WAWa6.ClientPayload.IDevicePairingRegistrationData|null);

        /** ClientPayload product */
        product?: (WAWa6.ClientPayload.Product|null);

        /** ClientPayload fbCat */
        fbCat?: (Uint8Array|null);

        /** ClientPayload fbUserAgent */
        fbUserAgent?: (Uint8Array|null);

        /** ClientPayload oc */
        oc?: (boolean|null);

        /** ClientPayload lc */
        lc?: (number|null);

        /** ClientPayload iosAppExtension */
        iosAppExtension?: (WAWa6.ClientPayload.IOSAppExtension|null);

        /** ClientPayload fbAppID */
        fbAppID?: (number|Long|null);

        /** ClientPayload fbDeviceID */
        fbDeviceID?: (Uint8Array|null);

        /** ClientPayload pull */
        pull?: (boolean|null);

        /** ClientPayload paddingBytes */
        paddingBytes?: (Uint8Array|null);

        /** ClientPayload yearClass */
        yearClass?: (number|null);

        /** ClientPayload memClass */
        memClass?: (number|null);

        /** ClientPayload interopData */
        interopData?: (WAWa6.ClientPayload.IInteropData|null);

        /** ClientPayload isPcr */
        isPcr?: (boolean|null);
    }

    /** Represents a ClientPayload. */
    class ClientPayload implements IClientPayload {

        /**
         * Constructs a new ClientPayload.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAWa6.IClientPayload);

        /** ClientPayload username. */
        public username: (number|Long);

        /** ClientPayload passive. */
        public passive: boolean;

        /** ClientPayload userAgent. */
        public userAgent?: (WAWa6.ClientPayload.IUserAgent|null);

        /** ClientPayload webInfo. */
        public webInfo?: (WAWa6.ClientPayload.IWebInfo|null);

        /** ClientPayload pushName. */
        public pushName: string;

        /** ClientPayload sessionID. */
        public sessionID: number;

        /** ClientPayload shortConnect. */
        public shortConnect: boolean;

        /** ClientPayload connectType. */
        public connectType: WAWa6.ClientPayload.ConnectType;

        /** ClientPayload connectReason. */
        public connectReason: WAWa6.ClientPayload.ConnectReason;

        /** ClientPayload shards. */
        public shards: number[];

        /** ClientPayload dnsSource. */
        public dnsSource?: (WAWa6.ClientPayload.IDNSSource|null);

        /** ClientPayload connectAttemptCount. */
        public connectAttemptCount: number;

        /** ClientPayload device. */
        public device: number;

        /** ClientPayload devicePairingData. */
        public devicePairingData?: (WAWa6.ClientPayload.IDevicePairingRegistrationData|null);

        /** ClientPayload product. */
        public product: WAWa6.ClientPayload.Product;

        /** ClientPayload fbCat. */
        public fbCat: Uint8Array;

        /** ClientPayload fbUserAgent. */
        public fbUserAgent: Uint8Array;

        /** ClientPayload oc. */
        public oc: boolean;

        /** ClientPayload lc. */
        public lc: number;

        /** ClientPayload iosAppExtension. */
        public iosAppExtension: WAWa6.ClientPayload.IOSAppExtension;

        /** ClientPayload fbAppID. */
        public fbAppID: (number|Long);

        /** ClientPayload fbDeviceID. */
        public fbDeviceID: Uint8Array;

        /** ClientPayload pull. */
        public pull: boolean;

        /** ClientPayload paddingBytes. */
        public paddingBytes: Uint8Array;

        /** ClientPayload yearClass. */
        public yearClass: number;

        /** ClientPayload memClass. */
        public memClass: number;

        /** ClientPayload interopData. */
        public interopData?: (WAWa6.ClientPayload.IInteropData|null);

        /** ClientPayload isPcr. */
        public isPcr: boolean;

        /**
         * Creates a new ClientPayload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientPayload instance
         */
        public static create(properties?: WAWa6.IClientPayload): WAWa6.ClientPayload;

        /**
         * Encodes the specified ClientPayload message. Does not implicitly {@link WAWa6.ClientPayload.verify|verify} messages.
         * @param message ClientPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWa6.IClientPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientPayload message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.verify|verify} messages.
         * @param message ClientPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWa6.IClientPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientPayload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload;

        /**
         * Decodes a ClientPayload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload;

        /**
         * Verifies a ClientPayload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientPayload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientPayload
         */
        public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload;

        /**
         * Creates a plain object from a ClientPayload message. Also converts values to other types if specified.
         * @param message ClientPayload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWa6.ClientPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientPayload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientPayload
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ClientPayload {

        /** Product enum. */
        enum Product {
            WHATSAPP = 0,
            MESSENGER = 1,
            INTEROP = 2,
            INTEROP_MSGR = 3
        }

        /** ConnectType enum. */
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

        /** ConnectReason enum. */
        enum ConnectReason {
            PUSH = 0,
            USER_ACTIVATED = 1,
            SCHEDULED = 2,
            ERROR_RECONNECT = 3,
            NETWORK_SWITCH = 4,
            PING_RECONNECT = 5,
            UNKNOWN = 6
        }

        /** IOSAppExtension enum. */
        enum IOSAppExtension {
            SHARE_EXTENSION = 0,
            SERVICE_EXTENSION = 1,
            INTENTS_EXTENSION = 2
        }

        /** Properties of a DNSSource. */
        interface IDNSSource {

            /** DNSSource dnsMethod */
            dnsMethod?: (WAWa6.ClientPayload.DNSSource.DNSResolutionMethod|null);

            /** DNSSource appCached */
            appCached?: (boolean|null);
        }

        /** Represents a DNSSource. */
        class DNSSource implements IDNSSource {

            /**
             * Constructs a new DNSSource.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.ClientPayload.IDNSSource);

            /** DNSSource dnsMethod. */
            public dnsMethod: WAWa6.ClientPayload.DNSSource.DNSResolutionMethod;

            /** DNSSource appCached. */
            public appCached: boolean;

            /**
             * Creates a new DNSSource instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DNSSource instance
             */
            public static create(properties?: WAWa6.ClientPayload.IDNSSource): WAWa6.ClientPayload.DNSSource;

            /**
             * Encodes the specified DNSSource message. Does not implicitly {@link WAWa6.ClientPayload.DNSSource.verify|verify} messages.
             * @param message DNSSource message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.ClientPayload.IDNSSource, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DNSSource message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.DNSSource.verify|verify} messages.
             * @param message DNSSource message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.ClientPayload.IDNSSource, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DNSSource message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DNSSource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.DNSSource;

            /**
             * Decodes a DNSSource message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DNSSource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.DNSSource;

            /**
             * Verifies a DNSSource message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DNSSource message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DNSSource
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.DNSSource;

            /**
             * Creates a plain object from a DNSSource message. Also converts values to other types if specified.
             * @param message DNSSource
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.ClientPayload.DNSSource, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DNSSource to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DNSSource
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DNSSource {

            /** DNSResolutionMethod enum. */
            enum DNSResolutionMethod {
                SYSTEM = 0,
                GOOGLE = 1,
                HARDCODED = 2,
                OVERRIDE = 3,
                FALLBACK = 4
            }
        }

        /** Properties of a WebInfo. */
        interface IWebInfo {

            /** WebInfo refToken */
            refToken?: (string|null);

            /** WebInfo version */
            version?: (string|null);

            /** WebInfo webdPayload */
            webdPayload?: (WAWa6.ClientPayload.WebInfo.IWebdPayload|null);

            /** WebInfo webSubPlatform */
            webSubPlatform?: (WAWa6.ClientPayload.WebInfo.WebSubPlatform|null);
        }

        /** Represents a WebInfo. */
        class WebInfo implements IWebInfo {

            /**
             * Constructs a new WebInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.ClientPayload.IWebInfo);

            /** WebInfo refToken. */
            public refToken: string;

            /** WebInfo version. */
            public version: string;

            /** WebInfo webdPayload. */
            public webdPayload?: (WAWa6.ClientPayload.WebInfo.IWebdPayload|null);

            /** WebInfo webSubPlatform. */
            public webSubPlatform: WAWa6.ClientPayload.WebInfo.WebSubPlatform;

            /**
             * Creates a new WebInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WebInfo instance
             */
            public static create(properties?: WAWa6.ClientPayload.IWebInfo): WAWa6.ClientPayload.WebInfo;

            /**
             * Encodes the specified WebInfo message. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.verify|verify} messages.
             * @param message WebInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.ClientPayload.IWebInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WebInfo message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.verify|verify} messages.
             * @param message WebInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.ClientPayload.IWebInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WebInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WebInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.WebInfo;

            /**
             * Decodes a WebInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WebInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.WebInfo;

            /**
             * Verifies a WebInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WebInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WebInfo
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.WebInfo;

            /**
             * Creates a plain object from a WebInfo message. Also converts values to other types if specified.
             * @param message WebInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.ClientPayload.WebInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WebInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WebInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WebInfo {

            /** WebSubPlatform enum. */
            enum WebSubPlatform {
                WEB_BROWSER = 0,
                APP_STORE = 1,
                WIN_STORE = 2,
                DARWIN = 3,
                WIN32 = 4
            }

            /** Properties of a WebdPayload. */
            interface IWebdPayload {

                /** WebdPayload usesParticipantInKey */
                usesParticipantInKey?: (boolean|null);

                /** WebdPayload supportsStarredMessages */
                supportsStarredMessages?: (boolean|null);

                /** WebdPayload supportsDocumentMessages */
                supportsDocumentMessages?: (boolean|null);

                /** WebdPayload supportsURLMessages */
                supportsURLMessages?: (boolean|null);

                /** WebdPayload supportsMediaRetry */
                supportsMediaRetry?: (boolean|null);

                /** WebdPayload supportsE2EImage */
                supportsE2EImage?: (boolean|null);

                /** WebdPayload supportsE2EVideo */
                supportsE2EVideo?: (boolean|null);

                /** WebdPayload supportsE2EAudio */
                supportsE2EAudio?: (boolean|null);

                /** WebdPayload supportsE2EDocument */
                supportsE2EDocument?: (boolean|null);

                /** WebdPayload documentTypes */
                documentTypes?: (string|null);

                /** WebdPayload features */
                features?: (Uint8Array|null);
            }

            /** Represents a WebdPayload. */
            class WebdPayload implements IWebdPayload {

                /**
                 * Constructs a new WebdPayload.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: WAWa6.ClientPayload.WebInfo.IWebdPayload);

                /** WebdPayload usesParticipantInKey. */
                public usesParticipantInKey: boolean;

                /** WebdPayload supportsStarredMessages. */
                public supportsStarredMessages: boolean;

                /** WebdPayload supportsDocumentMessages. */
                public supportsDocumentMessages: boolean;

                /** WebdPayload supportsURLMessages. */
                public supportsURLMessages: boolean;

                /** WebdPayload supportsMediaRetry. */
                public supportsMediaRetry: boolean;

                /** WebdPayload supportsE2EImage. */
                public supportsE2EImage: boolean;

                /** WebdPayload supportsE2EVideo. */
                public supportsE2EVideo: boolean;

                /** WebdPayload supportsE2EAudio. */
                public supportsE2EAudio: boolean;

                /** WebdPayload supportsE2EDocument. */
                public supportsE2EDocument: boolean;

                /** WebdPayload documentTypes. */
                public documentTypes: string;

                /** WebdPayload features. */
                public features: Uint8Array;

                /**
                 * Creates a new WebdPayload instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns WebdPayload instance
                 */
                public static create(properties?: WAWa6.ClientPayload.WebInfo.IWebdPayload): WAWa6.ClientPayload.WebInfo.WebdPayload;

                /**
                 * Encodes the specified WebdPayload message. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.WebdPayload.verify|verify} messages.
                 * @param message WebdPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WAWa6.ClientPayload.WebInfo.IWebdPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified WebdPayload message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.WebdPayload.verify|verify} messages.
                 * @param message WebdPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WAWa6.ClientPayload.WebInfo.IWebdPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a WebdPayload message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns WebdPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.WebInfo.WebdPayload;

                /**
                 * Decodes a WebdPayload message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns WebdPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.WebInfo.WebdPayload;

                /**
                 * Verifies a WebdPayload message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a WebdPayload message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns WebdPayload
                 */
                public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.WebInfo.WebdPayload;

                /**
                 * Creates a plain object from a WebdPayload message. Also converts values to other types if specified.
                 * @param message WebdPayload
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WAWa6.ClientPayload.WebInfo.WebdPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this WebdPayload to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for WebdPayload
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a UserAgent. */
        interface IUserAgent {

            /** UserAgent platform */
            platform?: (WAWa6.ClientPayload.UserAgent.Platform|null);

            /** UserAgent appVersion */
            appVersion?: (WAWa6.ClientPayload.UserAgent.IAppVersion|null);

            /** UserAgent mcc */
            mcc?: (string|null);

            /** UserAgent mnc */
            mnc?: (string|null);

            /** UserAgent osVersion */
            osVersion?: (string|null);

            /** UserAgent manufacturer */
            manufacturer?: (string|null);

            /** UserAgent device */
            device?: (string|null);

            /** UserAgent osBuildNumber */
            osBuildNumber?: (string|null);

            /** UserAgent phoneID */
            phoneID?: (string|null);

            /** UserAgent releaseChannel */
            releaseChannel?: (WAWa6.ClientPayload.UserAgent.ReleaseChannel|null);

            /** UserAgent localeLanguageIso6391 */
            localeLanguageIso6391?: (string|null);

            /** UserAgent localeCountryIso31661Alpha2 */
            localeCountryIso31661Alpha2?: (string|null);

            /** UserAgent deviceBoard */
            deviceBoard?: (string|null);

            /** UserAgent deviceExpID */
            deviceExpID?: (string|null);

            /** UserAgent deviceType */
            deviceType?: (WAWa6.ClientPayload.UserAgent.DeviceType|null);

            /** UserAgent deviceModelType */
            deviceModelType?: (string|null);
        }

        /** Represents a UserAgent. */
        class UserAgent implements IUserAgent {

            /**
             * Constructs a new UserAgent.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.ClientPayload.IUserAgent);

            /** UserAgent platform. */
            public platform: WAWa6.ClientPayload.UserAgent.Platform;

            /** UserAgent appVersion. */
            public appVersion?: (WAWa6.ClientPayload.UserAgent.IAppVersion|null);

            /** UserAgent mcc. */
            public mcc: string;

            /** UserAgent mnc. */
            public mnc: string;

            /** UserAgent osVersion. */
            public osVersion: string;

            /** UserAgent manufacturer. */
            public manufacturer: string;

            /** UserAgent device. */
            public device: string;

            /** UserAgent osBuildNumber. */
            public osBuildNumber: string;

            /** UserAgent phoneID. */
            public phoneID: string;

            /** UserAgent releaseChannel. */
            public releaseChannel: WAWa6.ClientPayload.UserAgent.ReleaseChannel;

            /** UserAgent localeLanguageIso6391. */
            public localeLanguageIso6391: string;

            /** UserAgent localeCountryIso31661Alpha2. */
            public localeCountryIso31661Alpha2: string;

            /** UserAgent deviceBoard. */
            public deviceBoard: string;

            /** UserAgent deviceExpID. */
            public deviceExpID: string;

            /** UserAgent deviceType. */
            public deviceType: WAWa6.ClientPayload.UserAgent.DeviceType;

            /** UserAgent deviceModelType. */
            public deviceModelType: string;

            /**
             * Creates a new UserAgent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UserAgent instance
             */
            public static create(properties?: WAWa6.ClientPayload.IUserAgent): WAWa6.ClientPayload.UserAgent;

            /**
             * Encodes the specified UserAgent message. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.verify|verify} messages.
             * @param message UserAgent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.ClientPayload.IUserAgent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UserAgent message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.verify|verify} messages.
             * @param message UserAgent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.ClientPayload.IUserAgent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UserAgent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UserAgent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.UserAgent;

            /**
             * Decodes a UserAgent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UserAgent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.UserAgent;

            /**
             * Verifies a UserAgent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UserAgent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UserAgent
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.UserAgent;

            /**
             * Creates a plain object from a UserAgent message. Also converts values to other types if specified.
             * @param message UserAgent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.ClientPayload.UserAgent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UserAgent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UserAgent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace UserAgent {

            /** DeviceType enum. */
            enum DeviceType {
                PHONE = 0,
                TABLET = 1,
                DESKTOP = 2,
                WEARABLE = 3,
                VR = 4
            }

            /** ReleaseChannel enum. */
            enum ReleaseChannel {
                RELEASE = 0,
                BETA = 1,
                ALPHA = 2,
                DEBUG = 3
            }

            /** Platform enum. */
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

            /** Properties of an AppVersion. */
            interface IAppVersion {

                /** AppVersion primary */
                primary?: (number|null);

                /** AppVersion secondary */
                secondary?: (number|null);

                /** AppVersion tertiary */
                tertiary?: (number|null);

                /** AppVersion quaternary */
                quaternary?: (number|null);

                /** AppVersion quinary */
                quinary?: (number|null);
            }

            /** Represents an AppVersion. */
            class AppVersion implements IAppVersion {

                /**
                 * Constructs a new AppVersion.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: WAWa6.ClientPayload.UserAgent.IAppVersion);

                /** AppVersion primary. */
                public primary: number;

                /** AppVersion secondary. */
                public secondary: number;

                /** AppVersion tertiary. */
                public tertiary: number;

                /** AppVersion quaternary. */
                public quaternary: number;

                /** AppVersion quinary. */
                public quinary: number;

                /**
                 * Creates a new AppVersion instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AppVersion instance
                 */
                public static create(properties?: WAWa6.ClientPayload.UserAgent.IAppVersion): WAWa6.ClientPayload.UserAgent.AppVersion;

                /**
                 * Encodes the specified AppVersion message. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.AppVersion.verify|verify} messages.
                 * @param message AppVersion message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WAWa6.ClientPayload.UserAgent.IAppVersion, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AppVersion message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.AppVersion.verify|verify} messages.
                 * @param message AppVersion message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WAWa6.ClientPayload.UserAgent.IAppVersion, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AppVersion message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AppVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.UserAgent.AppVersion;

                /**
                 * Decodes an AppVersion message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AppVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.UserAgent.AppVersion;

                /**
                 * Verifies an AppVersion message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AppVersion message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AppVersion
                 */
                public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.UserAgent.AppVersion;

                /**
                 * Creates a plain object from an AppVersion message. Also converts values to other types if specified.
                 * @param message AppVersion
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WAWa6.ClientPayload.UserAgent.AppVersion, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AppVersion to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AppVersion
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of an InteropData. */
        interface IInteropData {

            /** InteropData accountID */
            accountID?: (number|Long|null);

            /** InteropData token */
            token?: (Uint8Array|null);
        }

        /** Represents an InteropData. */
        class InteropData implements IInteropData {

            /**
             * Constructs a new InteropData.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.ClientPayload.IInteropData);

            /** InteropData accountID. */
            public accountID: (number|Long);

            /** InteropData token. */
            public token: Uint8Array;

            /**
             * Creates a new InteropData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InteropData instance
             */
            public static create(properties?: WAWa6.ClientPayload.IInteropData): WAWa6.ClientPayload.InteropData;

            /**
             * Encodes the specified InteropData message. Does not implicitly {@link WAWa6.ClientPayload.InteropData.verify|verify} messages.
             * @param message InteropData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.ClientPayload.IInteropData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InteropData message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.InteropData.verify|verify} messages.
             * @param message InteropData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.ClientPayload.IInteropData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InteropData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InteropData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.InteropData;

            /**
             * Decodes an InteropData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InteropData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.InteropData;

            /**
             * Verifies an InteropData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InteropData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InteropData
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.InteropData;

            /**
             * Creates a plain object from an InteropData message. Also converts values to other types if specified.
             * @param message InteropData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.ClientPayload.InteropData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InteropData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InteropData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DevicePairingRegistrationData. */
        interface IDevicePairingRegistrationData {

            /** DevicePairingRegistrationData eRegid */
            eRegid?: (Uint8Array|null);

            /** DevicePairingRegistrationData eKeytype */
            eKeytype?: (Uint8Array|null);

            /** DevicePairingRegistrationData eIdent */
            eIdent?: (Uint8Array|null);

            /** DevicePairingRegistrationData eSkeyID */
            eSkeyID?: (Uint8Array|null);

            /** DevicePairingRegistrationData eSkeyVal */
            eSkeyVal?: (Uint8Array|null);

            /** DevicePairingRegistrationData eSkeySig */
            eSkeySig?: (Uint8Array|null);

            /** DevicePairingRegistrationData buildHash */
            buildHash?: (Uint8Array|null);

            /** DevicePairingRegistrationData deviceProps */
            deviceProps?: (Uint8Array|null);
        }

        /** Represents a DevicePairingRegistrationData. */
        class DevicePairingRegistrationData implements IDevicePairingRegistrationData {

            /**
             * Constructs a new DevicePairingRegistrationData.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.ClientPayload.IDevicePairingRegistrationData);

            /** DevicePairingRegistrationData eRegid. */
            public eRegid: Uint8Array;

            /** DevicePairingRegistrationData eKeytype. */
            public eKeytype: Uint8Array;

            /** DevicePairingRegistrationData eIdent. */
            public eIdent: Uint8Array;

            /** DevicePairingRegistrationData eSkeyID. */
            public eSkeyID: Uint8Array;

            /** DevicePairingRegistrationData eSkeyVal. */
            public eSkeyVal: Uint8Array;

            /** DevicePairingRegistrationData eSkeySig. */
            public eSkeySig: Uint8Array;

            /** DevicePairingRegistrationData buildHash. */
            public buildHash: Uint8Array;

            /** DevicePairingRegistrationData deviceProps. */
            public deviceProps: Uint8Array;

            /**
             * Creates a new DevicePairingRegistrationData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DevicePairingRegistrationData instance
             */
            public static create(properties?: WAWa6.ClientPayload.IDevicePairingRegistrationData): WAWa6.ClientPayload.DevicePairingRegistrationData;

            /**
             * Encodes the specified DevicePairingRegistrationData message. Does not implicitly {@link WAWa6.ClientPayload.DevicePairingRegistrationData.verify|verify} messages.
             * @param message DevicePairingRegistrationData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.ClientPayload.IDevicePairingRegistrationData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DevicePairingRegistrationData message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.DevicePairingRegistrationData.verify|verify} messages.
             * @param message DevicePairingRegistrationData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.ClientPayload.IDevicePairingRegistrationData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DevicePairingRegistrationData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DevicePairingRegistrationData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.ClientPayload.DevicePairingRegistrationData;

            /**
             * Decodes a DevicePairingRegistrationData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DevicePairingRegistrationData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.ClientPayload.DevicePairingRegistrationData;

            /**
             * Verifies a DevicePairingRegistrationData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DevicePairingRegistrationData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DevicePairingRegistrationData
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.ClientPayload.DevicePairingRegistrationData;

            /**
             * Creates a plain object from a DevicePairingRegistrationData message. Also converts values to other types if specified.
             * @param message DevicePairingRegistrationData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.ClientPayload.DevicePairingRegistrationData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DevicePairingRegistrationData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DevicePairingRegistrationData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a HandshakeMessage. */
    interface IHandshakeMessage {

        /** HandshakeMessage clientHello */
        clientHello?: (WAWa6.HandshakeMessage.IClientHello|null);

        /** HandshakeMessage serverHello */
        serverHello?: (WAWa6.HandshakeMessage.IServerHello|null);

        /** HandshakeMessage clientFinish */
        clientFinish?: (WAWa6.HandshakeMessage.IClientFinish|null);
    }

    /** Represents a HandshakeMessage. */
    class HandshakeMessage implements IHandshakeMessage {

        /**
         * Constructs a new HandshakeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAWa6.IHandshakeMessage);

        /** HandshakeMessage clientHello. */
        public clientHello?: (WAWa6.HandshakeMessage.IClientHello|null);

        /** HandshakeMessage serverHello. */
        public serverHello?: (WAWa6.HandshakeMessage.IServerHello|null);

        /** HandshakeMessage clientFinish. */
        public clientFinish?: (WAWa6.HandshakeMessage.IClientFinish|null);

        /**
         * Creates a new HandshakeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HandshakeMessage instance
         */
        public static create(properties?: WAWa6.IHandshakeMessage): WAWa6.HandshakeMessage;

        /**
         * Encodes the specified HandshakeMessage message. Does not implicitly {@link WAWa6.HandshakeMessage.verify|verify} messages.
         * @param message HandshakeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWa6.IHandshakeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HandshakeMessage message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.verify|verify} messages.
         * @param message HandshakeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWa6.IHandshakeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HandshakeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HandshakeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.HandshakeMessage;

        /**
         * Decodes a HandshakeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HandshakeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.HandshakeMessage;

        /**
         * Verifies a HandshakeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HandshakeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HandshakeMessage
         */
        public static fromObject(object: { [k: string]: any }): WAWa6.HandshakeMessage;

        /**
         * Creates a plain object from a HandshakeMessage message. Also converts values to other types if specified.
         * @param message HandshakeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWa6.HandshakeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HandshakeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HandshakeMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace HandshakeMessage {

        /** Properties of a ClientFinish. */
        interface IClientFinish {

            /** ClientFinish static */
            "static"?: (Uint8Array|null);

            /** ClientFinish payload */
            payload?: (Uint8Array|null);
        }

        /** Represents a ClientFinish. */
        class ClientFinish implements IClientFinish {

            /**
             * Constructs a new ClientFinish.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.HandshakeMessage.IClientFinish);

            /** ClientFinish static. */
            public static: Uint8Array;

            /** ClientFinish payload. */
            public payload: Uint8Array;

            /**
             * Creates a new ClientFinish instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClientFinish instance
             */
            public static create(properties?: WAWa6.HandshakeMessage.IClientFinish): WAWa6.HandshakeMessage.ClientFinish;

            /**
             * Encodes the specified ClientFinish message. Does not implicitly {@link WAWa6.HandshakeMessage.ClientFinish.verify|verify} messages.
             * @param message ClientFinish message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.HandshakeMessage.IClientFinish, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClientFinish message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ClientFinish.verify|verify} messages.
             * @param message ClientFinish message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.HandshakeMessage.IClientFinish, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClientFinish message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ClientFinish
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.HandshakeMessage.ClientFinish;

            /**
             * Decodes a ClientFinish message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ClientFinish
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.HandshakeMessage.ClientFinish;

            /**
             * Verifies a ClientFinish message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ClientFinish message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ClientFinish
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.HandshakeMessage.ClientFinish;

            /**
             * Creates a plain object from a ClientFinish message. Also converts values to other types if specified.
             * @param message ClientFinish
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.HandshakeMessage.ClientFinish, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ClientFinish to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ClientFinish
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServerHello. */
        interface IServerHello {

            /** ServerHello ephemeral */
            ephemeral?: (Uint8Array|null);

            /** ServerHello static */
            "static"?: (Uint8Array|null);

            /** ServerHello payload */
            payload?: (Uint8Array|null);
        }

        /** Represents a ServerHello. */
        class ServerHello implements IServerHello {

            /**
             * Constructs a new ServerHello.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.HandshakeMessage.IServerHello);

            /** ServerHello ephemeral. */
            public ephemeral: Uint8Array;

            /** ServerHello static. */
            public static: Uint8Array;

            /** ServerHello payload. */
            public payload: Uint8Array;

            /**
             * Creates a new ServerHello instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerHello instance
             */
            public static create(properties?: WAWa6.HandshakeMessage.IServerHello): WAWa6.HandshakeMessage.ServerHello;

            /**
             * Encodes the specified ServerHello message. Does not implicitly {@link WAWa6.HandshakeMessage.ServerHello.verify|verify} messages.
             * @param message ServerHello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.HandshakeMessage.IServerHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerHello message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ServerHello.verify|verify} messages.
             * @param message ServerHello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.HandshakeMessage.IServerHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerHello message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServerHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.HandshakeMessage.ServerHello;

            /**
             * Decodes a ServerHello message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServerHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.HandshakeMessage.ServerHello;

            /**
             * Verifies a ServerHello message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerHello message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerHello
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.HandshakeMessage.ServerHello;

            /**
             * Creates a plain object from a ServerHello message. Also converts values to other types if specified.
             * @param message ServerHello
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.HandshakeMessage.ServerHello, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerHello to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServerHello
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ClientHello. */
        interface IClientHello {

            /** ClientHello ephemeral */
            ephemeral?: (Uint8Array|null);

            /** ClientHello static */
            "static"?: (Uint8Array|null);

            /** ClientHello payload */
            payload?: (Uint8Array|null);
        }

        /** Represents a ClientHello. */
        class ClientHello implements IClientHello {

            /**
             * Constructs a new ClientHello.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWa6.HandshakeMessage.IClientHello);

            /** ClientHello ephemeral. */
            public ephemeral: Uint8Array;

            /** ClientHello static. */
            public static: Uint8Array;

            /** ClientHello payload. */
            public payload: Uint8Array;

            /**
             * Creates a new ClientHello instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClientHello instance
             */
            public static create(properties?: WAWa6.HandshakeMessage.IClientHello): WAWa6.HandshakeMessage.ClientHello;

            /**
             * Encodes the specified ClientHello message. Does not implicitly {@link WAWa6.HandshakeMessage.ClientHello.verify|verify} messages.
             * @param message ClientHello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWa6.HandshakeMessage.IClientHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClientHello message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ClientHello.verify|verify} messages.
             * @param message ClientHello message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWa6.HandshakeMessage.IClientHello, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClientHello message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ClientHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWa6.HandshakeMessage.ClientHello;

            /**
             * Decodes a ClientHello message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ClientHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWa6.HandshakeMessage.ClientHello;

            /**
             * Verifies a ClientHello message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ClientHello message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ClientHello
             */
            public static fromObject(object: { [k: string]: any }): WAWa6.HandshakeMessage.ClientHello;

            /**
             * Creates a plain object from a ClientHello message. Also converts values to other types if specified.
             * @param message ClientHello
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWa6.HandshakeMessage.ClientHello, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ClientHello to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ClientHello
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
