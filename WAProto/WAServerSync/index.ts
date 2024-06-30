import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAServerSync. */
export namespace WAServerSync {

    /** Properties of a SyncdMutation. */
    interface ISyncdMutation {

        /** SyncdMutation operation */
        operation?: (WAServerSync.SyncdMutation.SyncdOperation|null);

        /** SyncdMutation record */
        record?: (WAServerSync.ISyncdRecord|null);
    }

    /** Represents a SyncdMutation. */
    class SyncdMutation implements ISyncdMutation {

        /**
         * Constructs a new SyncdMutation.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdMutation);

        /** SyncdMutation operation. */
        public operation: WAServerSync.SyncdMutation.SyncdOperation;

        /** SyncdMutation record. */
        public record?: (WAServerSync.ISyncdRecord|null);

        /**
         * Creates a new SyncdMutation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdMutation instance
         */
        public static create(properties?: WAServerSync.ISyncdMutation): WAServerSync.SyncdMutation;

        /**
         * Encodes the specified SyncdMutation message. Does not implicitly {@link WAServerSync.SyncdMutation.verify|verify} messages.
         * @param message SyncdMutation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdMutation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdMutation message, length delimited. Does not implicitly {@link WAServerSync.SyncdMutation.verify|verify} messages.
         * @param message SyncdMutation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdMutation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdMutation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdMutation;

        /**
         * Decodes a SyncdMutation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdMutation;

        /**
         * Verifies a SyncdMutation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdMutation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdMutation
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdMutation;

        /**
         * Creates a plain object from a SyncdMutation message. Also converts values to other types if specified.
         * @param message SyncdMutation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdMutation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdMutation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdMutation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SyncdMutation {

        /** SyncdOperation enum. */
        enum SyncdOperation {
            SET = 0,
            REMOVE = 1
        }
    }

    /** Properties of a SyncdVersion. */
    interface ISyncdVersion {

        /** SyncdVersion version */
        version?: (number|Long|null);
    }

    /** Represents a SyncdVersion. */
    class SyncdVersion implements ISyncdVersion {

        /**
         * Constructs a new SyncdVersion.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdVersion);

        /** SyncdVersion version. */
        public version: (number|Long);

        /**
         * Creates a new SyncdVersion instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdVersion instance
         */
        public static create(properties?: WAServerSync.ISyncdVersion): WAServerSync.SyncdVersion;

        /**
         * Encodes the specified SyncdVersion message. Does not implicitly {@link WAServerSync.SyncdVersion.verify|verify} messages.
         * @param message SyncdVersion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdVersion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdVersion message, length delimited. Does not implicitly {@link WAServerSync.SyncdVersion.verify|verify} messages.
         * @param message SyncdVersion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdVersion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdVersion message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdVersion;

        /**
         * Decodes a SyncdVersion message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdVersion;

        /**
         * Verifies a SyncdVersion message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdVersion message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdVersion
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdVersion;

        /**
         * Creates a plain object from a SyncdVersion message. Also converts values to other types if specified.
         * @param message SyncdVersion
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdVersion, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdVersion to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdVersion
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExitCode. */
    interface IExitCode {

        /** ExitCode code */
        code?: (number|Long|null);

        /** ExitCode text */
        text?: (string|null);
    }

    /** Represents an ExitCode. */
    class ExitCode implements IExitCode {

        /**
         * Constructs a new ExitCode.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.IExitCode);

        /** ExitCode code. */
        public code: (number|Long);

        /** ExitCode text. */
        public text: string;

        /**
         * Creates a new ExitCode instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExitCode instance
         */
        public static create(properties?: WAServerSync.IExitCode): WAServerSync.ExitCode;

        /**
         * Encodes the specified ExitCode message. Does not implicitly {@link WAServerSync.ExitCode.verify|verify} messages.
         * @param message ExitCode message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.IExitCode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExitCode message, length delimited. Does not implicitly {@link WAServerSync.ExitCode.verify|verify} messages.
         * @param message ExitCode message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.IExitCode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExitCode message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExitCode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.ExitCode;

        /**
         * Decodes an ExitCode message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExitCode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.ExitCode;

        /**
         * Verifies an ExitCode message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExitCode message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExitCode
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.ExitCode;

        /**
         * Creates a plain object from an ExitCode message. Also converts values to other types if specified.
         * @param message ExitCode
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.ExitCode, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExitCode to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExitCode
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdIndex. */
    interface ISyncdIndex {

        /** SyncdIndex blob */
        blob?: (Uint8Array|null);
    }

    /** Represents a SyncdIndex. */
    class SyncdIndex implements ISyncdIndex {

        /**
         * Constructs a new SyncdIndex.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdIndex);

        /** SyncdIndex blob. */
        public blob: Uint8Array;

        /**
         * Creates a new SyncdIndex instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdIndex instance
         */
        public static create(properties?: WAServerSync.ISyncdIndex): WAServerSync.SyncdIndex;

        /**
         * Encodes the specified SyncdIndex message. Does not implicitly {@link WAServerSync.SyncdIndex.verify|verify} messages.
         * @param message SyncdIndex message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdIndex, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdIndex message, length delimited. Does not implicitly {@link WAServerSync.SyncdIndex.verify|verify} messages.
         * @param message SyncdIndex message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdIndex, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdIndex message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdIndex
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdIndex;

        /**
         * Decodes a SyncdIndex message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdIndex
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdIndex;

        /**
         * Verifies a SyncdIndex message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdIndex message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdIndex
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdIndex;

        /**
         * Creates a plain object from a SyncdIndex message. Also converts values to other types if specified.
         * @param message SyncdIndex
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdIndex, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdIndex to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdIndex
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdValue. */
    interface ISyncdValue {

        /** SyncdValue blob */
        blob?: (Uint8Array|null);
    }

    /** Represents a SyncdValue. */
    class SyncdValue implements ISyncdValue {

        /**
         * Constructs a new SyncdValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdValue);

        /** SyncdValue blob. */
        public blob: Uint8Array;

        /**
         * Creates a new SyncdValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdValue instance
         */
        public static create(properties?: WAServerSync.ISyncdValue): WAServerSync.SyncdValue;

        /**
         * Encodes the specified SyncdValue message. Does not implicitly {@link WAServerSync.SyncdValue.verify|verify} messages.
         * @param message SyncdValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdValue message, length delimited. Does not implicitly {@link WAServerSync.SyncdValue.verify|verify} messages.
         * @param message SyncdValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdValue;

        /**
         * Decodes a SyncdValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdValue;

        /**
         * Verifies a SyncdValue message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdValue message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdValue
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdValue;

        /**
         * Creates a plain object from a SyncdValue message. Also converts values to other types if specified.
         * @param message SyncdValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdValue to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdValue
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a KeyId. */
    interface IKeyId {

        /** KeyId ID */
        ID?: (Uint8Array|null);
    }

    /** Represents a KeyId. */
    class KeyId implements IKeyId {

        /**
         * Constructs a new KeyId.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.IKeyId);

        /** KeyId ID. */
        public ID: Uint8Array;

        /**
         * Creates a new KeyId instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyId instance
         */
        public static create(properties?: WAServerSync.IKeyId): WAServerSync.KeyId;

        /**
         * Encodes the specified KeyId message. Does not implicitly {@link WAServerSync.KeyId.verify|verify} messages.
         * @param message KeyId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.IKeyId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyId message, length delimited. Does not implicitly {@link WAServerSync.KeyId.verify|verify} messages.
         * @param message KeyId message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.IKeyId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyId message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.KeyId;

        /**
         * Decodes a KeyId message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.KeyId;

        /**
         * Verifies a KeyId message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyId message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyId
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.KeyId;

        /**
         * Creates a plain object from a KeyId message. Also converts values to other types if specified.
         * @param message KeyId
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.KeyId, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyId to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for KeyId
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdRecord. */
    interface ISyncdRecord {

        /** SyncdRecord index */
        index?: (WAServerSync.ISyncdIndex|null);

        /** SyncdRecord value */
        value?: (WAServerSync.ISyncdValue|null);

        /** SyncdRecord keyID */
        keyID?: (WAServerSync.IKeyId|null);
    }

    /** Represents a SyncdRecord. */
    class SyncdRecord implements ISyncdRecord {

        /**
         * Constructs a new SyncdRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdRecord);

        /** SyncdRecord index. */
        public index?: (WAServerSync.ISyncdIndex|null);

        /** SyncdRecord value. */
        public value?: (WAServerSync.ISyncdValue|null);

        /** SyncdRecord keyID. */
        public keyID?: (WAServerSync.IKeyId|null);

        /**
         * Creates a new SyncdRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdRecord instance
         */
        public static create(properties?: WAServerSync.ISyncdRecord): WAServerSync.SyncdRecord;

        /**
         * Encodes the specified SyncdRecord message. Does not implicitly {@link WAServerSync.SyncdRecord.verify|verify} messages.
         * @param message SyncdRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdRecord message, length delimited. Does not implicitly {@link WAServerSync.SyncdRecord.verify|verify} messages.
         * @param message SyncdRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdRecord;

        /**
         * Decodes a SyncdRecord message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdRecord;

        /**
         * Verifies a SyncdRecord message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdRecord message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdRecord
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdRecord;

        /**
         * Creates a plain object from a SyncdRecord message. Also converts values to other types if specified.
         * @param message SyncdRecord
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdRecord to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdRecord
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExternalBlobReference. */
    interface IExternalBlobReference {

        /** ExternalBlobReference mediaKey */
        mediaKey?: (Uint8Array|null);

        /** ExternalBlobReference directPath */
        directPath?: (string|null);

        /** ExternalBlobReference handle */
        handle?: (string|null);

        /** ExternalBlobReference fileSizeBytes */
        fileSizeBytes?: (number|Long|null);

        /** ExternalBlobReference fileSHA256 */
        fileSHA256?: (Uint8Array|null);

        /** ExternalBlobReference fileEncSHA256 */
        fileEncSHA256?: (Uint8Array|null);
    }

    /** Represents an ExternalBlobReference. */
    class ExternalBlobReference implements IExternalBlobReference {

        /**
         * Constructs a new ExternalBlobReference.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.IExternalBlobReference);

        /** ExternalBlobReference mediaKey. */
        public mediaKey: Uint8Array;

        /** ExternalBlobReference directPath. */
        public directPath: string;

        /** ExternalBlobReference handle. */
        public handle: string;

        /** ExternalBlobReference fileSizeBytes. */
        public fileSizeBytes: (number|Long);

        /** ExternalBlobReference fileSHA256. */
        public fileSHA256: Uint8Array;

        /** ExternalBlobReference fileEncSHA256. */
        public fileEncSHA256: Uint8Array;

        /**
         * Creates a new ExternalBlobReference instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExternalBlobReference instance
         */
        public static create(properties?: WAServerSync.IExternalBlobReference): WAServerSync.ExternalBlobReference;

        /**
         * Encodes the specified ExternalBlobReference message. Does not implicitly {@link WAServerSync.ExternalBlobReference.verify|verify} messages.
         * @param message ExternalBlobReference message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.IExternalBlobReference, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExternalBlobReference message, length delimited. Does not implicitly {@link WAServerSync.ExternalBlobReference.verify|verify} messages.
         * @param message ExternalBlobReference message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.IExternalBlobReference, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExternalBlobReference message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExternalBlobReference
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.ExternalBlobReference;

        /**
         * Decodes an ExternalBlobReference message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExternalBlobReference
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.ExternalBlobReference;

        /**
         * Verifies an ExternalBlobReference message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExternalBlobReference message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExternalBlobReference
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.ExternalBlobReference;

        /**
         * Creates a plain object from an ExternalBlobReference message. Also converts values to other types if specified.
         * @param message ExternalBlobReference
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.ExternalBlobReference, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExternalBlobReference to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExternalBlobReference
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdSnapshot. */
    interface ISyncdSnapshot {

        /** SyncdSnapshot version */
        version?: (WAServerSync.ISyncdVersion|null);

        /** SyncdSnapshot records */
        records?: (WAServerSync.ISyncdRecord[]|null);

        /** SyncdSnapshot mac */
        mac?: (Uint8Array|null);

        /** SyncdSnapshot keyID */
        keyID?: (WAServerSync.IKeyId|null);
    }

    /** Represents a SyncdSnapshot. */
    class SyncdSnapshot implements ISyncdSnapshot {

        /**
         * Constructs a new SyncdSnapshot.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdSnapshot);

        /** SyncdSnapshot version. */
        public version?: (WAServerSync.ISyncdVersion|null);

        /** SyncdSnapshot records. */
        public records: WAServerSync.ISyncdRecord[];

        /** SyncdSnapshot mac. */
        public mac: Uint8Array;

        /** SyncdSnapshot keyID. */
        public keyID?: (WAServerSync.IKeyId|null);

        /**
         * Creates a new SyncdSnapshot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdSnapshot instance
         */
        public static create(properties?: WAServerSync.ISyncdSnapshot): WAServerSync.SyncdSnapshot;

        /**
         * Encodes the specified SyncdSnapshot message. Does not implicitly {@link WAServerSync.SyncdSnapshot.verify|verify} messages.
         * @param message SyncdSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdSnapshot message, length delimited. Does not implicitly {@link WAServerSync.SyncdSnapshot.verify|verify} messages.
         * @param message SyncdSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdSnapshot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdSnapshot;

        /**
         * Decodes a SyncdSnapshot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdSnapshot;

        /**
         * Verifies a SyncdSnapshot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdSnapshot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdSnapshot
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdSnapshot;

        /**
         * Creates a plain object from a SyncdSnapshot message. Also converts values to other types if specified.
         * @param message SyncdSnapshot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdSnapshot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdSnapshot
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdMutations. */
    interface ISyncdMutations {

        /** SyncdMutations mutations */
        mutations?: (WAServerSync.ISyncdMutation[]|null);
    }

    /** Represents a SyncdMutations. */
    class SyncdMutations implements ISyncdMutations {

        /**
         * Constructs a new SyncdMutations.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdMutations);

        /** SyncdMutations mutations. */
        public mutations: WAServerSync.ISyncdMutation[];

        /**
         * Creates a new SyncdMutations instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdMutations instance
         */
        public static create(properties?: WAServerSync.ISyncdMutations): WAServerSync.SyncdMutations;

        /**
         * Encodes the specified SyncdMutations message. Does not implicitly {@link WAServerSync.SyncdMutations.verify|verify} messages.
         * @param message SyncdMutations message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdMutations, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdMutations message, length delimited. Does not implicitly {@link WAServerSync.SyncdMutations.verify|verify} messages.
         * @param message SyncdMutations message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdMutations, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdMutations message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdMutations
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdMutations;

        /**
         * Decodes a SyncdMutations message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdMutations
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdMutations;

        /**
         * Verifies a SyncdMutations message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdMutations message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdMutations
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdMutations;

        /**
         * Creates a plain object from a SyncdMutations message. Also converts values to other types if specified.
         * @param message SyncdMutations
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdMutations, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdMutations to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdMutations
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncdPatch. */
    interface ISyncdPatch {

        /** SyncdPatch version */
        version?: (WAServerSync.ISyncdVersion|null);

        /** SyncdPatch mutations */
        mutations?: (WAServerSync.ISyncdMutation[]|null);

        /** SyncdPatch externalMutations */
        externalMutations?: (WAServerSync.IExternalBlobReference|null);

        /** SyncdPatch snapshotMAC */
        snapshotMAC?: (Uint8Array|null);

        /** SyncdPatch patchMAC */
        patchMAC?: (Uint8Array|null);

        /** SyncdPatch keyID */
        keyID?: (WAServerSync.IKeyId|null);

        /** SyncdPatch exitCode */
        exitCode?: (WAServerSync.IExitCode|null);

        /** SyncdPatch deviceIndex */
        deviceIndex?: (number|null);

        /** SyncdPatch clientDebugData */
        clientDebugData?: (Uint8Array|null);
    }

    /** Represents a SyncdPatch. */
    class SyncdPatch implements ISyncdPatch {

        /**
         * Constructs a new SyncdPatch.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAServerSync.ISyncdPatch);

        /** SyncdPatch version. */
        public version?: (WAServerSync.ISyncdVersion|null);

        /** SyncdPatch mutations. */
        public mutations: WAServerSync.ISyncdMutation[];

        /** SyncdPatch externalMutations. */
        public externalMutations?: (WAServerSync.IExternalBlobReference|null);

        /** SyncdPatch snapshotMAC. */
        public snapshotMAC: Uint8Array;

        /** SyncdPatch patchMAC. */
        public patchMAC: Uint8Array;

        /** SyncdPatch keyID. */
        public keyID?: (WAServerSync.IKeyId|null);

        /** SyncdPatch exitCode. */
        public exitCode?: (WAServerSync.IExitCode|null);

        /** SyncdPatch deviceIndex. */
        public deviceIndex: number;

        /** SyncdPatch clientDebugData. */
        public clientDebugData: Uint8Array;

        /**
         * Creates a new SyncdPatch instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncdPatch instance
         */
        public static create(properties?: WAServerSync.ISyncdPatch): WAServerSync.SyncdPatch;

        /**
         * Encodes the specified SyncdPatch message. Does not implicitly {@link WAServerSync.SyncdPatch.verify|verify} messages.
         * @param message SyncdPatch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAServerSync.ISyncdPatch, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncdPatch message, length delimited. Does not implicitly {@link WAServerSync.SyncdPatch.verify|verify} messages.
         * @param message SyncdPatch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAServerSync.ISyncdPatch, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncdPatch message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncdPatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAServerSync.SyncdPatch;

        /**
         * Decodes a SyncdPatch message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncdPatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAServerSync.SyncdPatch;

        /**
         * Verifies a SyncdPatch message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncdPatch message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncdPatch
         */
        public static fromObject(object: { [k: string]: any }): WAServerSync.SyncdPatch;

        /**
         * Creates a plain object from a SyncdPatch message. Also converts values to other types if specified.
         * @param message SyncdPatch
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAServerSync.SyncdPatch, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncdPatch to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncdPatch
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
