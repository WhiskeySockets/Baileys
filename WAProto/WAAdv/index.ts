import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAAdv. */
export namespace WAAdv {

    /** ADVEncryptionType enum. */
    enum ADVEncryptionType {
        E2EE = 0,
        HOSTED = 1
    }

    /** Properties of a ADVKeyIndexList. */
    interface IADVKeyIndexList {

        /** ADVKeyIndexList rawID */
        rawID?: (number|null);

        /** ADVKeyIndexList timestamp */
        timestamp?: (number|Long|null);

        /** ADVKeyIndexList currentIndex */
        currentIndex?: (number|null);

        /** ADVKeyIndexList validIndexes */
        validIndexes?: (number[]|null);

        /** ADVKeyIndexList accountType */
        accountType?: (WAAdv.ADVEncryptionType|null);
    }

    /** Represents a ADVKeyIndexList. */
    class ADVKeyIndexList implements IADVKeyIndexList {

        /**
         * Constructs a new ADVKeyIndexList.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAAdv.IADVKeyIndexList);

        /** ADVKeyIndexList rawID. */
        public rawID: number;

        /** ADVKeyIndexList timestamp. */
        public timestamp: (number|Long);

        /** ADVKeyIndexList currentIndex. */
        public currentIndex: number;

        /** ADVKeyIndexList validIndexes. */
        public validIndexes: number[];

        /** ADVKeyIndexList accountType. */
        public accountType: WAAdv.ADVEncryptionType;

        /**
         * Creates a new ADVKeyIndexList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVKeyIndexList instance
         */
        public static create(properties?: WAAdv.IADVKeyIndexList): WAAdv.ADVKeyIndexList;

        /**
         * Encodes the specified ADVKeyIndexList message. Does not implicitly {@link WAAdv.ADVKeyIndexList.verify|verify} messages.
         * @param message ADVKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAAdv.IADVKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVKeyIndexList message, length delimited. Does not implicitly {@link WAAdv.ADVKeyIndexList.verify|verify} messages.
         * @param message ADVKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAAdv.IADVKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVKeyIndexList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAAdv.ADVKeyIndexList;

        /**
         * Decodes a ADVKeyIndexList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAAdv.ADVKeyIndexList;

        /**
         * Verifies a ADVKeyIndexList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVKeyIndexList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVKeyIndexList
         */
        public static fromObject(object: { [k: string]: any }): WAAdv.ADVKeyIndexList;

        /**
         * Creates a plain object from a ADVKeyIndexList message. Also converts values to other types if specified.
         * @param message ADVKeyIndexList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAAdv.ADVKeyIndexList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVKeyIndexList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ADVKeyIndexList
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ADVSignedKeyIndexList. */
    interface IADVSignedKeyIndexList {

        /** ADVSignedKeyIndexList details */
        details?: (Uint8Array|null);

        /** ADVSignedKeyIndexList accountSignature */
        accountSignature?: (Uint8Array|null);

        /** ADVSignedKeyIndexList accountSignatureKey */
        accountSignatureKey?: (Uint8Array|null);
    }

    /** Represents a ADVSignedKeyIndexList. */
    class ADVSignedKeyIndexList implements IADVSignedKeyIndexList {

        /**
         * Constructs a new ADVSignedKeyIndexList.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAAdv.IADVSignedKeyIndexList);

        /** ADVSignedKeyIndexList details. */
        public details: Uint8Array;

        /** ADVSignedKeyIndexList accountSignature. */
        public accountSignature: Uint8Array;

        /** ADVSignedKeyIndexList accountSignatureKey. */
        public accountSignatureKey: Uint8Array;

        /**
         * Creates a new ADVSignedKeyIndexList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedKeyIndexList instance
         */
        public static create(properties?: WAAdv.IADVSignedKeyIndexList): WAAdv.ADVSignedKeyIndexList;

        /**
         * Encodes the specified ADVSignedKeyIndexList message. Does not implicitly {@link WAAdv.ADVSignedKeyIndexList.verify|verify} messages.
         * @param message ADVSignedKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAAdv.IADVSignedKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVSignedKeyIndexList message, length delimited. Does not implicitly {@link WAAdv.ADVSignedKeyIndexList.verify|verify} messages.
         * @param message ADVSignedKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAAdv.IADVSignedKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVSignedKeyIndexList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVSignedKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAAdv.ADVSignedKeyIndexList;

        /**
         * Decodes a ADVSignedKeyIndexList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVSignedKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAAdv.ADVSignedKeyIndexList;

        /**
         * Verifies a ADVSignedKeyIndexList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVSignedKeyIndexList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVSignedKeyIndexList
         */
        public static fromObject(object: { [k: string]: any }): WAAdv.ADVSignedKeyIndexList;

        /**
         * Creates a plain object from a ADVSignedKeyIndexList message. Also converts values to other types if specified.
         * @param message ADVSignedKeyIndexList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAAdv.ADVSignedKeyIndexList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVSignedKeyIndexList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ADVSignedKeyIndexList
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ADVDeviceIdentity. */
    interface IADVDeviceIdentity {

        /** ADVDeviceIdentity rawID */
        rawID?: (number|null);

        /** ADVDeviceIdentity timestamp */
        timestamp?: (number|Long|null);

        /** ADVDeviceIdentity keyIndex */
        keyIndex?: (number|null);

        /** ADVDeviceIdentity accountType */
        accountType?: (WAAdv.ADVEncryptionType|null);

        /** ADVDeviceIdentity deviceType */
        deviceType?: (WAAdv.ADVEncryptionType|null);
    }

    /** Represents a ADVDeviceIdentity. */
    class ADVDeviceIdentity implements IADVDeviceIdentity {

        /**
         * Constructs a new ADVDeviceIdentity.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAAdv.IADVDeviceIdentity);

        /** ADVDeviceIdentity rawID. */
        public rawID: number;

        /** ADVDeviceIdentity timestamp. */
        public timestamp: (number|Long);

        /** ADVDeviceIdentity keyIndex. */
        public keyIndex: number;

        /** ADVDeviceIdentity accountType. */
        public accountType: WAAdv.ADVEncryptionType;

        /** ADVDeviceIdentity deviceType. */
        public deviceType: WAAdv.ADVEncryptionType;

        /**
         * Creates a new ADVDeviceIdentity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVDeviceIdentity instance
         */
        public static create(properties?: WAAdv.IADVDeviceIdentity): WAAdv.ADVDeviceIdentity;

        /**
         * Encodes the specified ADVDeviceIdentity message. Does not implicitly {@link WAAdv.ADVDeviceIdentity.verify|verify} messages.
         * @param message ADVDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAAdv.IADVDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVDeviceIdentity message, length delimited. Does not implicitly {@link WAAdv.ADVDeviceIdentity.verify|verify} messages.
         * @param message ADVDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAAdv.IADVDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAAdv.ADVDeviceIdentity;

        /**
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAAdv.ADVDeviceIdentity;

        /**
         * Verifies a ADVDeviceIdentity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVDeviceIdentity
         */
        public static fromObject(object: { [k: string]: any }): WAAdv.ADVDeviceIdentity;

        /**
         * Creates a plain object from a ADVDeviceIdentity message. Also converts values to other types if specified.
         * @param message ADVDeviceIdentity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAAdv.ADVDeviceIdentity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVDeviceIdentity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ADVDeviceIdentity
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ADVSignedDeviceIdentity. */
    interface IADVSignedDeviceIdentity {

        /** ADVSignedDeviceIdentity details */
        details?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity accountSignatureKey */
        accountSignatureKey?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity accountSignature */
        accountSignature?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity deviceSignature */
        deviceSignature?: (Uint8Array|null);
    }

    /** Represents a ADVSignedDeviceIdentity. */
    class ADVSignedDeviceIdentity implements IADVSignedDeviceIdentity {

        /**
         * Constructs a new ADVSignedDeviceIdentity.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAAdv.IADVSignedDeviceIdentity);

        /** ADVSignedDeviceIdentity details. */
        public details: Uint8Array;

        /** ADVSignedDeviceIdentity accountSignatureKey. */
        public accountSignatureKey: Uint8Array;

        /** ADVSignedDeviceIdentity accountSignature. */
        public accountSignature: Uint8Array;

        /** ADVSignedDeviceIdentity deviceSignature. */
        public deviceSignature: Uint8Array;

        /**
         * Creates a new ADVSignedDeviceIdentity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedDeviceIdentity instance
         */
        public static create(properties?: WAAdv.IADVSignedDeviceIdentity): WAAdv.ADVSignedDeviceIdentity;

        /**
         * Encodes the specified ADVSignedDeviceIdentity message. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentity.verify|verify} messages.
         * @param message ADVSignedDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAAdv.IADVSignedDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVSignedDeviceIdentity message, length delimited. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentity.verify|verify} messages.
         * @param message ADVSignedDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAAdv.IADVSignedDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAAdv.ADVSignedDeviceIdentity;

        /**
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAAdv.ADVSignedDeviceIdentity;

        /**
         * Verifies a ADVSignedDeviceIdentity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVSignedDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVSignedDeviceIdentity
         */
        public static fromObject(object: { [k: string]: any }): WAAdv.ADVSignedDeviceIdentity;

        /**
         * Creates a plain object from a ADVSignedDeviceIdentity message. Also converts values to other types if specified.
         * @param message ADVSignedDeviceIdentity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAAdv.ADVSignedDeviceIdentity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVSignedDeviceIdentity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ADVSignedDeviceIdentity
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ADVSignedDeviceIdentityHMAC. */
    interface IADVSignedDeviceIdentityHMAC {

        /** ADVSignedDeviceIdentityHMAC details */
        details?: (Uint8Array|null);

        /** ADVSignedDeviceIdentityHMAC HMAC */
        HMAC?: (Uint8Array|null);

        /** ADVSignedDeviceIdentityHMAC accountType */
        accountType?: (WAAdv.ADVEncryptionType|null);
    }

    /** Represents a ADVSignedDeviceIdentityHMAC. */
    class ADVSignedDeviceIdentityHMAC implements IADVSignedDeviceIdentityHMAC {

        /**
         * Constructs a new ADVSignedDeviceIdentityHMAC.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAAdv.IADVSignedDeviceIdentityHMAC);

        /** ADVSignedDeviceIdentityHMAC details. */
        public details: Uint8Array;

        /** ADVSignedDeviceIdentityHMAC HMAC. */
        public HMAC: Uint8Array;

        /** ADVSignedDeviceIdentityHMAC accountType. */
        public accountType: WAAdv.ADVEncryptionType;

        /**
         * Creates a new ADVSignedDeviceIdentityHMAC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedDeviceIdentityHMAC instance
         */
        public static create(properties?: WAAdv.IADVSignedDeviceIdentityHMAC): WAAdv.ADVSignedDeviceIdentityHMAC;

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @param message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAAdv.IADVSignedDeviceIdentityHMAC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message, length delimited. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @param message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAAdv.IADVSignedDeviceIdentityHMAC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAAdv.ADVSignedDeviceIdentityHMAC;

        /**
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAAdv.ADVSignedDeviceIdentityHMAC;

        /**
         * Verifies a ADVSignedDeviceIdentityHMAC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVSignedDeviceIdentityHMAC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVSignedDeviceIdentityHMAC
         */
        public static fromObject(object: { [k: string]: any }): WAAdv.ADVSignedDeviceIdentityHMAC;

        /**
         * Creates a plain object from a ADVSignedDeviceIdentityHMAC message. Also converts values to other types if specified.
         * @param message ADVSignedDeviceIdentityHMAC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAAdv.ADVSignedDeviceIdentityHMAC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVSignedDeviceIdentityHMAC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ADVSignedDeviceIdentityHMAC
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
