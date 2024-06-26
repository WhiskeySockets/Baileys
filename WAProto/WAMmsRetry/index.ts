import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAMmsRetry. */
export namespace WAMmsRetry {

    /** Properties of a MediaRetryNotification. */
    interface IMediaRetryNotification {

        /** MediaRetryNotification stanzaID */
        stanzaID?: (string|null);

        /** MediaRetryNotification directPath */
        directPath?: (string|null);

        /** MediaRetryNotification result */
        result?: (WAMmsRetry.MediaRetryNotification.ResultType|null);
    }

    /** Represents a MediaRetryNotification. */
    class MediaRetryNotification implements IMediaRetryNotification {

        /**
         * Constructs a new MediaRetryNotification.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAMmsRetry.IMediaRetryNotification);

        /** MediaRetryNotification stanzaID. */
        public stanzaID: string;

        /** MediaRetryNotification directPath. */
        public directPath: string;

        /** MediaRetryNotification result. */
        public result: WAMmsRetry.MediaRetryNotification.ResultType;

        /**
         * Creates a new MediaRetryNotification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MediaRetryNotification instance
         */
        public static create(properties?: WAMmsRetry.IMediaRetryNotification): WAMmsRetry.MediaRetryNotification;

        /**
         * Encodes the specified MediaRetryNotification message. Does not implicitly {@link WAMmsRetry.MediaRetryNotification.verify|verify} messages.
         * @param message MediaRetryNotification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAMmsRetry.IMediaRetryNotification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MediaRetryNotification message, length delimited. Does not implicitly {@link WAMmsRetry.MediaRetryNotification.verify|verify} messages.
         * @param message MediaRetryNotification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAMmsRetry.IMediaRetryNotification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MediaRetryNotification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MediaRetryNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAMmsRetry.MediaRetryNotification;

        /**
         * Decodes a MediaRetryNotification message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MediaRetryNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAMmsRetry.MediaRetryNotification;

        /**
         * Verifies a MediaRetryNotification message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MediaRetryNotification message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MediaRetryNotification
         */
        public static fromObject(object: { [k: string]: any }): WAMmsRetry.MediaRetryNotification;

        /**
         * Creates a plain object from a MediaRetryNotification message. Also converts values to other types if specified.
         * @param message MediaRetryNotification
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAMmsRetry.MediaRetryNotification, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MediaRetryNotification to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MediaRetryNotification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MediaRetryNotification {

        /** ResultType enum. */
        enum ResultType {
            GENERAL_ERROR = 0,
            SUCCESS = 1,
            NOT_FOUND = 2,
            DECRYPTION_ERROR = 3
        }
    }

    /** Properties of a ServerErrorReceipt. */
    interface IServerErrorReceipt {

        /** ServerErrorReceipt stanzaID */
        stanzaID?: (string|null);
    }

    /** Represents a ServerErrorReceipt. */
    class ServerErrorReceipt implements IServerErrorReceipt {

        /**
         * Constructs a new ServerErrorReceipt.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAMmsRetry.IServerErrorReceipt);

        /** ServerErrorReceipt stanzaID. */
        public stanzaID: string;

        /**
         * Creates a new ServerErrorReceipt instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerErrorReceipt instance
         */
        public static create(properties?: WAMmsRetry.IServerErrorReceipt): WAMmsRetry.ServerErrorReceipt;

        /**
         * Encodes the specified ServerErrorReceipt message. Does not implicitly {@link WAMmsRetry.ServerErrorReceipt.verify|verify} messages.
         * @param message ServerErrorReceipt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAMmsRetry.IServerErrorReceipt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerErrorReceipt message, length delimited. Does not implicitly {@link WAMmsRetry.ServerErrorReceipt.verify|verify} messages.
         * @param message ServerErrorReceipt message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAMmsRetry.IServerErrorReceipt, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerErrorReceipt message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerErrorReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAMmsRetry.ServerErrorReceipt;

        /**
         * Decodes a ServerErrorReceipt message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerErrorReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAMmsRetry.ServerErrorReceipt;

        /**
         * Verifies a ServerErrorReceipt message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerErrorReceipt message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerErrorReceipt
         */
        public static fromObject(object: { [k: string]: any }): WAMmsRetry.ServerErrorReceipt;

        /**
         * Creates a plain object from a ServerErrorReceipt message. Also converts values to other types if specified.
         * @param message ServerErrorReceipt
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAMmsRetry.ServerErrorReceipt, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerErrorReceipt to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerErrorReceipt
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
