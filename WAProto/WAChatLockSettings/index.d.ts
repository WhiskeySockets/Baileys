import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAChatLockSettings. */
export namespace WAChatLockSettings {

    /** Properties of a ChatLockSettings. */
    interface IChatLockSettings {

        /** ChatLockSettings hideLockedChats */
        hideLockedChats?: (boolean|null);

        /** ChatLockSettings secretCode */
        secretCode?: (WAUserPassword.IUserPassword|null);
    }

    /** Represents a ChatLockSettings. */
    class ChatLockSettings implements IChatLockSettings {

        /**
         * Constructs a new ChatLockSettings.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAChatLockSettings.IChatLockSettings);

        /** ChatLockSettings hideLockedChats. */
        public hideLockedChats: boolean;

        /** ChatLockSettings secretCode. */
        public secretCode?: (WAUserPassword.IUserPassword|null);

        /**
         * Creates a new ChatLockSettings instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatLockSettings instance
         */
        public static create(properties?: WAChatLockSettings.IChatLockSettings): WAChatLockSettings.ChatLockSettings;

        /**
         * Encodes the specified ChatLockSettings message. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @param message ChatLockSettings message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAChatLockSettings.IChatLockSettings, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatLockSettings message, length delimited. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @param message ChatLockSettings message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAChatLockSettings.IChatLockSettings, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatLockSettings message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAChatLockSettings.ChatLockSettings;

        /**
         * Decodes a ChatLockSettings message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAChatLockSettings.ChatLockSettings;

        /**
         * Verifies a ChatLockSettings message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatLockSettings message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatLockSettings
         */
        public static fromObject(object: { [k: string]: any }): WAChatLockSettings.ChatLockSettings;

        /**
         * Creates a plain object from a ChatLockSettings message. Also converts values to other types if specified.
         * @param message ChatLockSettings
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAChatLockSettings.ChatLockSettings, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatLockSettings to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatLockSettings
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace WAUserPassword. */
export namespace WAUserPassword {

    /** Properties of a UserPassword. */
    interface IUserPassword {

        /** UserPassword encoding */
        encoding?: (WAUserPassword.UserPassword.Encoding|null);

        /** UserPassword transformer */
        transformer?: (WAUserPassword.UserPassword.Transformer|null);

        /** UserPassword transformerArg */
        transformerArg?: (WAUserPassword.UserPassword.ITransformerArg[]|null);

        /** UserPassword transformedData */
        transformedData?: (Uint8Array|null);
    }

    /** Represents a UserPassword. */
    class UserPassword implements IUserPassword {

        /**
         * Constructs a new UserPassword.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAUserPassword.IUserPassword);

        /** UserPassword encoding. */
        public encoding: WAUserPassword.UserPassword.Encoding;

        /** UserPassword transformer. */
        public transformer: WAUserPassword.UserPassword.Transformer;

        /** UserPassword transformerArg. */
        public transformerArg: WAUserPassword.UserPassword.ITransformerArg[];

        /** UserPassword transformedData. */
        public transformedData: Uint8Array;

        /**
         * Creates a new UserPassword instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserPassword instance
         */
        public static create(properties?: WAUserPassword.IUserPassword): WAUserPassword.UserPassword;

        /**
         * Encodes the specified UserPassword message. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @param message UserPassword message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAUserPassword.IUserPassword, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserPassword message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @param message UserPassword message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAUserPassword.IUserPassword, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserPassword message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword;

        /**
         * Decodes a UserPassword message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword;

        /**
         * Verifies a UserPassword message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserPassword message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserPassword
         */
        public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword;

        /**
         * Creates a plain object from a UserPassword message. Also converts values to other types if specified.
         * @param message UserPassword
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAUserPassword.UserPassword, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserPassword to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserPassword
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UserPassword {

        /** Transformer enum. */
        enum Transformer {
            NONE = 0,
            PBKDF2_HMAC_SHA512 = 1,
            PBKDF2_HMAC_SHA384 = 2
        }

        /** Encoding enum. */
        enum Encoding {
            UTF8 = 0,
            UTF8_BROKEN = 1
        }

        /** Properties of a TransformerArg. */
        interface ITransformerArg {

            /** TransformerArg key */
            key?: (string|null);

            /** TransformerArg value */
            value?: (WAUserPassword.UserPassword.TransformerArg.IValue|null);
        }

        /** Represents a TransformerArg. */
        class TransformerArg implements ITransformerArg {

            /**
             * Constructs a new TransformerArg.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAUserPassword.UserPassword.ITransformerArg);

            /** TransformerArg key. */
            public key: string;

            /** TransformerArg value. */
            public value?: (WAUserPassword.UserPassword.TransformerArg.IValue|null);

            /**
             * Creates a new TransformerArg instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TransformerArg instance
             */
            public static create(properties?: WAUserPassword.UserPassword.ITransformerArg): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Encodes the specified TransformerArg message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @param message TransformerArg message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAUserPassword.UserPassword.ITransformerArg, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TransformerArg message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @param message TransformerArg message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAUserPassword.UserPassword.ITransformerArg, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TransformerArg message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Decodes a TransformerArg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Verifies a TransformerArg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TransformerArg message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TransformerArg
             */
            public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Creates a plain object from a TransformerArg message. Also converts values to other types if specified.
             * @param message TransformerArg
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAUserPassword.UserPassword.TransformerArg, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TransformerArg to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TransformerArg
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace TransformerArg {

            /** Properties of a Value. */
            interface IValue {

                /** Value asBlob */
                asBlob?: (Uint8Array|null);

                /** Value asUnsignedInteger */
                asUnsignedInteger?: (number|null);
            }

            /** Represents a Value. */
            class Value implements IValue {

                /**
                 * Constructs a new Value.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: WAUserPassword.UserPassword.TransformerArg.IValue);

                /** Value asBlob. */
                public asBlob?: (Uint8Array|null);

                /** Value asUnsignedInteger. */
                public asUnsignedInteger?: (number|null);

                /** Value value. */
                public value?: ("asBlob"|"asUnsignedInteger");

                /**
                 * Creates a new Value instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Value instance
                 */
                public static create(properties?: WAUserPassword.UserPassword.TransformerArg.IValue): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Encodes the specified Value message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @param message Value message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WAUserPassword.UserPassword.TransformerArg.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Value message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @param message Value message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WAUserPassword.UserPassword.TransformerArg.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Value message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Decodes a Value message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Verifies a Value message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Value message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Value
                 */
                public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Creates a plain object from a Value message. Also converts values to other types if specified.
                 * @param message Value
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WAUserPassword.UserPassword.TransformerArg.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Value to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Value
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
