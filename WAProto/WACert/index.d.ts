import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WACert. */
export namespace WACert {

    /** Properties of a NoiseCertificate. */
    interface INoiseCertificate {

        /** NoiseCertificate details */
        details?: (Uint8Array|null);

        /** NoiseCertificate signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a NoiseCertificate. */
    class NoiseCertificate implements INoiseCertificate {

        /**
         * Constructs a new NoiseCertificate.
         * @param [properties] Properties to set
         */
        constructor(properties?: WACert.INoiseCertificate);

        /** NoiseCertificate details. */
        public details: Uint8Array;

        /** NoiseCertificate signature. */
        public signature: Uint8Array;

        /**
         * Creates a new NoiseCertificate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NoiseCertificate instance
         */
        public static create(properties?: WACert.INoiseCertificate): WACert.NoiseCertificate;

        /**
         * Encodes the specified NoiseCertificate message. Does not implicitly {@link WACert.NoiseCertificate.verify|verify} messages.
         * @param message NoiseCertificate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WACert.INoiseCertificate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NoiseCertificate message, length delimited. Does not implicitly {@link WACert.NoiseCertificate.verify|verify} messages.
         * @param message NoiseCertificate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WACert.INoiseCertificate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NoiseCertificate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NoiseCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WACert.NoiseCertificate;

        /**
         * Decodes a NoiseCertificate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NoiseCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WACert.NoiseCertificate;

        /**
         * Verifies a NoiseCertificate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NoiseCertificate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NoiseCertificate
         */
        public static fromObject(object: { [k: string]: any }): WACert.NoiseCertificate;

        /**
         * Creates a plain object from a NoiseCertificate message. Also converts values to other types if specified.
         * @param message NoiseCertificate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WACert.NoiseCertificate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NoiseCertificate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NoiseCertificate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace NoiseCertificate {

        /** Properties of a Details. */
        interface IDetails {

            /** Details serial */
            serial?: (number|null);

            /** Details issuer */
            issuer?: (string|null);

            /** Details expires */
            expires?: (number|Long|null);

            /** Details subject */
            subject?: (string|null);

            /** Details key */
            key?: (Uint8Array|null);
        }

        /** Represents a Details. */
        class Details implements IDetails {

            /**
             * Constructs a new Details.
             * @param [properties] Properties to set
             */
            constructor(properties?: WACert.NoiseCertificate.IDetails);

            /** Details serial. */
            public serial: number;

            /** Details issuer. */
            public issuer: string;

            /** Details expires. */
            public expires: (number|Long);

            /** Details subject. */
            public subject: string;

            /** Details key. */
            public key: Uint8Array;

            /**
             * Creates a new Details instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Details instance
             */
            public static create(properties?: WACert.NoiseCertificate.IDetails): WACert.NoiseCertificate.Details;

            /**
             * Encodes the specified Details message. Does not implicitly {@link WACert.NoiseCertificate.Details.verify|verify} messages.
             * @param message Details message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WACert.NoiseCertificate.IDetails, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Details message, length delimited. Does not implicitly {@link WACert.NoiseCertificate.Details.verify|verify} messages.
             * @param message Details message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WACert.NoiseCertificate.IDetails, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Details message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Details
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WACert.NoiseCertificate.Details;

            /**
             * Decodes a Details message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Details
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WACert.NoiseCertificate.Details;

            /**
             * Verifies a Details message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Details message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Details
             */
            public static fromObject(object: { [k: string]: any }): WACert.NoiseCertificate.Details;

            /**
             * Creates a plain object from a Details message. Also converts values to other types if specified.
             * @param message Details
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WACert.NoiseCertificate.Details, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Details to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Details
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a CertChain. */
    interface ICertChain {

        /** CertChain leaf */
        leaf?: (WACert.CertChain.INoiseCertificate|null);

        /** CertChain intermediate */
        intermediate?: (WACert.CertChain.INoiseCertificate|null);
    }

    /** Represents a CertChain. */
    class CertChain implements ICertChain {

        /**
         * Constructs a new CertChain.
         * @param [properties] Properties to set
         */
        constructor(properties?: WACert.ICertChain);

        /** CertChain leaf. */
        public leaf?: (WACert.CertChain.INoiseCertificate|null);

        /** CertChain intermediate. */
        public intermediate?: (WACert.CertChain.INoiseCertificate|null);

        /**
         * Creates a new CertChain instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CertChain instance
         */
        public static create(properties?: WACert.ICertChain): WACert.CertChain;

        /**
         * Encodes the specified CertChain message. Does not implicitly {@link WACert.CertChain.verify|verify} messages.
         * @param message CertChain message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WACert.ICertChain, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CertChain message, length delimited. Does not implicitly {@link WACert.CertChain.verify|verify} messages.
         * @param message CertChain message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WACert.ICertChain, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CertChain message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CertChain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WACert.CertChain;

        /**
         * Decodes a CertChain message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CertChain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WACert.CertChain;

        /**
         * Verifies a CertChain message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CertChain message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CertChain
         */
        public static fromObject(object: { [k: string]: any }): WACert.CertChain;

        /**
         * Creates a plain object from a CertChain message. Also converts values to other types if specified.
         * @param message CertChain
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WACert.CertChain, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CertChain to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CertChain
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace CertChain {

        /** Properties of a NoiseCertificate. */
        interface INoiseCertificate {

            /** NoiseCertificate details */
            details?: (Uint8Array|null);

            /** NoiseCertificate signature */
            signature?: (Uint8Array|null);
        }

        /** Represents a NoiseCertificate. */
        class NoiseCertificate implements INoiseCertificate {

            /**
             * Constructs a new NoiseCertificate.
             * @param [properties] Properties to set
             */
            constructor(properties?: WACert.CertChain.INoiseCertificate);

            /** NoiseCertificate details. */
            public details: Uint8Array;

            /** NoiseCertificate signature. */
            public signature: Uint8Array;

            /**
             * Creates a new NoiseCertificate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NoiseCertificate instance
             */
            public static create(properties?: WACert.CertChain.INoiseCertificate): WACert.CertChain.NoiseCertificate;

            /**
             * Encodes the specified NoiseCertificate message. Does not implicitly {@link WACert.CertChain.NoiseCertificate.verify|verify} messages.
             * @param message NoiseCertificate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WACert.CertChain.INoiseCertificate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NoiseCertificate message, length delimited. Does not implicitly {@link WACert.CertChain.NoiseCertificate.verify|verify} messages.
             * @param message NoiseCertificate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WACert.CertChain.INoiseCertificate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NoiseCertificate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns NoiseCertificate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WACert.CertChain.NoiseCertificate;

            /**
             * Decodes a NoiseCertificate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns NoiseCertificate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WACert.CertChain.NoiseCertificate;

            /**
             * Verifies a NoiseCertificate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NoiseCertificate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NoiseCertificate
             */
            public static fromObject(object: { [k: string]: any }): WACert.CertChain.NoiseCertificate;

            /**
             * Creates a plain object from a NoiseCertificate message. Also converts values to other types if specified.
             * @param message NoiseCertificate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WACert.CertChain.NoiseCertificate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NoiseCertificate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for NoiseCertificate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace NoiseCertificate {

            /** Properties of a Details. */
            interface IDetails {

                /** Details serial */
                serial?: (number|null);

                /** Details issuerSerial */
                issuerSerial?: (number|null);

                /** Details key */
                key?: (Uint8Array|null);

                /** Details notBefore */
                notBefore?: (number|Long|null);

                /** Details notAfter */
                notAfter?: (number|Long|null);
            }

            /** Represents a Details. */
            class Details implements IDetails {

                /**
                 * Constructs a new Details.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: WACert.CertChain.NoiseCertificate.IDetails);

                /** Details serial. */
                public serial: number;

                /** Details issuerSerial. */
                public issuerSerial: number;

                /** Details key. */
                public key: Uint8Array;

                /** Details notBefore. */
                public notBefore: (number|Long);

                /** Details notAfter. */
                public notAfter: (number|Long);

                /**
                 * Creates a new Details instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Details instance
                 */
                public static create(properties?: WACert.CertChain.NoiseCertificate.IDetails): WACert.CertChain.NoiseCertificate.Details;

                /**
                 * Encodes the specified Details message. Does not implicitly {@link WACert.CertChain.NoiseCertificate.Details.verify|verify} messages.
                 * @param message Details message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WACert.CertChain.NoiseCertificate.IDetails, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Details message, length delimited. Does not implicitly {@link WACert.CertChain.NoiseCertificate.Details.verify|verify} messages.
                 * @param message Details message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WACert.CertChain.NoiseCertificate.IDetails, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Details message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Details
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WACert.CertChain.NoiseCertificate.Details;

                /**
                 * Decodes a Details message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Details
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WACert.CertChain.NoiseCertificate.Details;

                /**
                 * Verifies a Details message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Details message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Details
                 */
                public static fromObject(object: { [k: string]: any }): WACert.CertChain.NoiseCertificate.Details;

                /**
                 * Creates a plain object from a Details message. Also converts values to other types if specified.
                 * @param message Details
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WACert.CertChain.NoiseCertificate.Details, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Details to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Details
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
