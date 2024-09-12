import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAReporting. */
export namespace WAReporting {

    /** Properties of a Reportable. */
    interface IReportable {

        /** Reportable minVersion */
        minVersion?: (number|null);

        /** Reportable maxVersion */
        maxVersion?: (number|null);

        /** Reportable notReportableMinVersion */
        notReportableMinVersion?: (number|null);

        /** Reportable never */
        never?: (boolean|null);
    }

    /** Represents a Reportable. */
    class Reportable implements IReportable {

        /**
         * Constructs a new Reportable.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAReporting.IReportable);

        /** Reportable minVersion. */
        public minVersion: number;

        /** Reportable maxVersion. */
        public maxVersion: number;

        /** Reportable notReportableMinVersion. */
        public notReportableMinVersion: number;

        /** Reportable never. */
        public never: boolean;

        /**
         * Creates a new Reportable instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Reportable instance
         */
        public static create(properties?: WAReporting.IReportable): WAReporting.Reportable;

        /**
         * Encodes the specified Reportable message. Does not implicitly {@link WAReporting.Reportable.verify|verify} messages.
         * @param message Reportable message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAReporting.IReportable, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Reportable message, length delimited. Does not implicitly {@link WAReporting.Reportable.verify|verify} messages.
         * @param message Reportable message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAReporting.IReportable, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Reportable message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Reportable
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAReporting.Reportable;

        /**
         * Decodes a Reportable message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Reportable
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAReporting.Reportable;

        /**
         * Verifies a Reportable message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Reportable message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Reportable
         */
        public static fromObject(object: { [k: string]: any }): WAReporting.Reportable;

        /**
         * Creates a plain object from a Reportable message. Also converts values to other types if specified.
         * @param message Reportable
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAReporting.Reportable, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Reportable to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Reportable
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Config. */
    interface IConfig {

        /** Config field */
        field?: ({ [k: string]: WAReporting.IField }|null);

        /** Config version */
        version?: (number|null);
    }

    /** Represents a Config. */
    class Config implements IConfig {

        /**
         * Constructs a new Config.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAReporting.IConfig);

        /** Config field. */
        public field: { [k: string]: WAReporting.IField };

        /** Config version. */
        public version: number;

        /**
         * Creates a new Config instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Config instance
         */
        public static create(properties?: WAReporting.IConfig): WAReporting.Config;

        /**
         * Encodes the specified Config message. Does not implicitly {@link WAReporting.Config.verify|verify} messages.
         * @param message Config message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAReporting.IConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Config message, length delimited. Does not implicitly {@link WAReporting.Config.verify|verify} messages.
         * @param message Config message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAReporting.IConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Config message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Config
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAReporting.Config;

        /**
         * Decodes a Config message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Config
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAReporting.Config;

        /**
         * Verifies a Config message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Config message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Config
         */
        public static fromObject(object: { [k: string]: any }): WAReporting.Config;

        /**
         * Creates a plain object from a Config message. Also converts values to other types if specified.
         * @param message Config
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAReporting.Config, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Config to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Config
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Field. */
    interface IField {

        /** Field minVersion */
        minVersion?: (number|null);

        /** Field maxVersion */
        maxVersion?: (number|null);

        /** Field notReportableMinVersion */
        notReportableMinVersion?: (number|null);

        /** Field isMessage */
        isMessage?: (boolean|null);

        /** Field subfield */
        subfield?: ({ [k: string]: WAReporting.IField }|null);
    }

    /** Represents a Field. */
    class Field implements IField {

        /**
         * Constructs a new Field.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAReporting.IField);

        /** Field minVersion. */
        public minVersion: number;

        /** Field maxVersion. */
        public maxVersion: number;

        /** Field notReportableMinVersion. */
        public notReportableMinVersion: number;

        /** Field isMessage. */
        public isMessage: boolean;

        /** Field subfield. */
        public subfield: { [k: string]: WAReporting.IField };

        /**
         * Creates a new Field instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Field instance
         */
        public static create(properties?: WAReporting.IField): WAReporting.Field;

        /**
         * Encodes the specified Field message. Does not implicitly {@link WAReporting.Field.verify|verify} messages.
         * @param message Field message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAReporting.IField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Field message, length delimited. Does not implicitly {@link WAReporting.Field.verify|verify} messages.
         * @param message Field message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAReporting.IField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Field message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAReporting.Field;

        /**
         * Decodes a Field message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAReporting.Field;

        /**
         * Verifies a Field message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Field message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Field
         */
        public static fromObject(object: { [k: string]: any }): WAReporting.Field;

        /**
         * Creates a plain object from a Field message. Also converts values to other types if specified.
         * @param message Field
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAReporting.Field, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Field to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Field
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
