/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAServerSync = (function() {

    /**
     * Namespace WAServerSync.
     * @exports WAServerSync
     * @namespace
     */
    var WAServerSync = {};

    WAServerSync.SyncdMutation = (function() {

        /**
         * Properties of a SyncdMutation.
         * @memberof WAServerSync
         * @interface ISyncdMutation
         * @property {WAServerSync.SyncdMutation.SyncdOperation|null} [operation] SyncdMutation operation
         * @property {WAServerSync.ISyncdRecord|null} [record] SyncdMutation record
         */

        /**
         * Constructs a new SyncdMutation.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdMutation.
         * @implements ISyncdMutation
         * @constructor
         * @param {WAServerSync.ISyncdMutation=} [properties] Properties to set
         */
        function SyncdMutation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdMutation operation.
         * @member {WAServerSync.SyncdMutation.SyncdOperation} operation
         * @memberof WAServerSync.SyncdMutation
         * @instance
         */
        SyncdMutation.prototype.operation = 0;

        /**
         * SyncdMutation record.
         * @member {WAServerSync.ISyncdRecord|null|undefined} record
         * @memberof WAServerSync.SyncdMutation
         * @instance
         */
        SyncdMutation.prototype.record = null;

        /**
         * Creates a new SyncdMutation instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {WAServerSync.ISyncdMutation=} [properties] Properties to set
         * @returns {WAServerSync.SyncdMutation} SyncdMutation instance
         */
        SyncdMutation.create = function create(properties) {
            return new SyncdMutation(properties);
        };

        /**
         * Encodes the specified SyncdMutation message. Does not implicitly {@link WAServerSync.SyncdMutation.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {WAServerSync.ISyncdMutation} message SyncdMutation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdMutation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.operation != null && Object.hasOwnProperty.call(message, "operation"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.operation);
            if (message.record != null && Object.hasOwnProperty.call(message, "record"))
                $root.WAServerSync.SyncdRecord.encode(message.record, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncdMutation message, length delimited. Does not implicitly {@link WAServerSync.SyncdMutation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {WAServerSync.ISyncdMutation} message SyncdMutation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdMutation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdMutation message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdMutation} SyncdMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdMutation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdMutation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.operation = reader.int32();
                        break;
                    }
                case 2: {
                        message.record = $root.WAServerSync.SyncdRecord.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdMutation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdMutation} SyncdMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdMutation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdMutation message.
         * @function verify
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdMutation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.operation != null && message.hasOwnProperty("operation"))
                switch (message.operation) {
                default:
                    return "operation: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.record != null && message.hasOwnProperty("record")) {
                var error = $root.WAServerSync.SyncdRecord.verify(message.record);
                if (error)
                    return "record." + error;
            }
            return null;
        };

        /**
         * Creates a SyncdMutation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdMutation} SyncdMutation
         */
        SyncdMutation.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdMutation)
                return object;
            var message = new $root.WAServerSync.SyncdMutation();
            switch (object.operation) {
            default:
                if (typeof object.operation === "number") {
                    message.operation = object.operation;
                    break;
                }
                break;
            case "SET":
            case 0:
                message.operation = 0;
                break;
            case "REMOVE":
            case 1:
                message.operation = 1;
                break;
            }
            if (object.record != null) {
                if (typeof object.record !== "object")
                    throw TypeError(".WAServerSync.SyncdMutation.record: object expected");
                message.record = $root.WAServerSync.SyncdRecord.fromObject(object.record);
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncdMutation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {WAServerSync.SyncdMutation} message SyncdMutation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdMutation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.operation = options.enums === String ? "SET" : 0;
                object.record = null;
            }
            if (message.operation != null && message.hasOwnProperty("operation"))
                object.operation = options.enums === String ? $root.WAServerSync.SyncdMutation.SyncdOperation[message.operation] === undefined ? message.operation : $root.WAServerSync.SyncdMutation.SyncdOperation[message.operation] : message.operation;
            if (message.record != null && message.hasOwnProperty("record"))
                object.record = $root.WAServerSync.SyncdRecord.toObject(message.record, options);
            return object;
        };

        /**
         * Converts this SyncdMutation to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdMutation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdMutation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdMutation
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdMutation
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdMutation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdMutation";
        };

        /**
         * SyncdOperation enum.
         * @name WAServerSync.SyncdMutation.SyncdOperation
         * @enum {number}
         * @property {number} SET=0 SET value
         * @property {number} REMOVE=1 REMOVE value
         */
        SyncdMutation.SyncdOperation = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SET"] = 0;
            values[valuesById[1] = "REMOVE"] = 1;
            return values;
        })();

        return SyncdMutation;
    })();

    WAServerSync.SyncdVersion = (function() {

        /**
         * Properties of a SyncdVersion.
         * @memberof WAServerSync
         * @interface ISyncdVersion
         * @property {number|Long|null} [version] SyncdVersion version
         */

        /**
         * Constructs a new SyncdVersion.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdVersion.
         * @implements ISyncdVersion
         * @constructor
         * @param {WAServerSync.ISyncdVersion=} [properties] Properties to set
         */
        function SyncdVersion(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdVersion version.
         * @member {number|Long} version
         * @memberof WAServerSync.SyncdVersion
         * @instance
         */
        SyncdVersion.prototype.version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new SyncdVersion instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {WAServerSync.ISyncdVersion=} [properties] Properties to set
         * @returns {WAServerSync.SyncdVersion} SyncdVersion instance
         */
        SyncdVersion.create = function create(properties) {
            return new SyncdVersion(properties);
        };

        /**
         * Encodes the specified SyncdVersion message. Does not implicitly {@link WAServerSync.SyncdVersion.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {WAServerSync.ISyncdVersion} message SyncdVersion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdVersion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.version);
            return writer;
        };

        /**
         * Encodes the specified SyncdVersion message, length delimited. Does not implicitly {@link WAServerSync.SyncdVersion.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {WAServerSync.ISyncdVersion} message SyncdVersion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdVersion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdVersion message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdVersion} SyncdVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdVersion.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdVersion();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.version = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdVersion message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdVersion} SyncdVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdVersion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdVersion message.
         * @function verify
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdVersion.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version) && !(message.version && $util.isInteger(message.version.low) && $util.isInteger(message.version.high)))
                    return "version: integer|Long expected";
            return null;
        };

        /**
         * Creates a SyncdVersion message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdVersion} SyncdVersion
         */
        SyncdVersion.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdVersion)
                return object;
            var message = new $root.WAServerSync.SyncdVersion();
            if (object.version != null)
                if ($util.Long)
                    (message.version = $util.Long.fromValue(object.version)).unsigned = true;
                else if (typeof object.version === "string")
                    message.version = parseInt(object.version, 10);
                else if (typeof object.version === "number")
                    message.version = object.version;
                else if (typeof object.version === "object")
                    message.version = new $util.LongBits(object.version.low >>> 0, object.version.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a SyncdVersion message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {WAServerSync.SyncdVersion} message SyncdVersion
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdVersion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.version = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.version = options.longs === String ? "0" : 0;
            if (message.version != null && message.hasOwnProperty("version"))
                if (typeof message.version === "number")
                    object.version = options.longs === String ? String(message.version) : message.version;
                else
                    object.version = options.longs === String ? $util.Long.prototype.toString.call(message.version) : options.longs === Number ? new $util.LongBits(message.version.low >>> 0, message.version.high >>> 0).toNumber(true) : message.version;
            return object;
        };

        /**
         * Converts this SyncdVersion to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdVersion
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdVersion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdVersion
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdVersion
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdVersion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdVersion";
        };

        return SyncdVersion;
    })();

    WAServerSync.ExitCode = (function() {

        /**
         * Properties of an ExitCode.
         * @memberof WAServerSync
         * @interface IExitCode
         * @property {number|Long|null} [code] ExitCode code
         * @property {string|null} [text] ExitCode text
         */

        /**
         * Constructs a new ExitCode.
         * @memberof WAServerSync
         * @classdesc Represents an ExitCode.
         * @implements IExitCode
         * @constructor
         * @param {WAServerSync.IExitCode=} [properties] Properties to set
         */
        function ExitCode(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExitCode code.
         * @member {number|Long} code
         * @memberof WAServerSync.ExitCode
         * @instance
         */
        ExitCode.prototype.code = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ExitCode text.
         * @member {string} text
         * @memberof WAServerSync.ExitCode
         * @instance
         */
        ExitCode.prototype.text = "";

        /**
         * Creates a new ExitCode instance using the specified properties.
         * @function create
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {WAServerSync.IExitCode=} [properties] Properties to set
         * @returns {WAServerSync.ExitCode} ExitCode instance
         */
        ExitCode.create = function create(properties) {
            return new ExitCode(properties);
        };

        /**
         * Encodes the specified ExitCode message. Does not implicitly {@link WAServerSync.ExitCode.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {WAServerSync.IExitCode} message ExitCode message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitCode.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.code);
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.text);
            return writer;
        };

        /**
         * Encodes the specified ExitCode message, length delimited. Does not implicitly {@link WAServerSync.ExitCode.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {WAServerSync.IExitCode} message ExitCode message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitCode.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExitCode message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.ExitCode} ExitCode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitCode.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.ExitCode();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.uint64();
                        break;
                    }
                case 2: {
                        message.text = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExitCode message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.ExitCode} ExitCode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitCode.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExitCode message.
         * @function verify
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExitCode.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code) && !(message.code && $util.isInteger(message.code.low) && $util.isInteger(message.code.high)))
                    return "code: integer|Long expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            return null;
        };

        /**
         * Creates an ExitCode message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.ExitCode} ExitCode
         */
        ExitCode.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.ExitCode)
                return object;
            var message = new $root.WAServerSync.ExitCode();
            if (object.code != null)
                if ($util.Long)
                    (message.code = $util.Long.fromValue(object.code)).unsigned = true;
                else if (typeof object.code === "string")
                    message.code = parseInt(object.code, 10);
                else if (typeof object.code === "number")
                    message.code = object.code;
                else if (typeof object.code === "object")
                    message.code = new $util.LongBits(object.code.low >>> 0, object.code.high >>> 0).toNumber(true);
            if (object.text != null)
                message.text = String(object.text);
            return message;
        };

        /**
         * Creates a plain object from an ExitCode message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {WAServerSync.ExitCode} message ExitCode
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExitCode.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.code = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.code = options.longs === String ? "0" : 0;
                object.text = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                if (typeof message.code === "number")
                    object.code = options.longs === String ? String(message.code) : message.code;
                else
                    object.code = options.longs === String ? $util.Long.prototype.toString.call(message.code) : options.longs === Number ? new $util.LongBits(message.code.low >>> 0, message.code.high >>> 0).toNumber(true) : message.code;
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            return object;
        };

        /**
         * Converts this ExitCode to JSON.
         * @function toJSON
         * @memberof WAServerSync.ExitCode
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExitCode.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExitCode
         * @function getTypeUrl
         * @memberof WAServerSync.ExitCode
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExitCode.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.ExitCode";
        };

        return ExitCode;
    })();

    WAServerSync.SyncdIndex = (function() {

        /**
         * Properties of a SyncdIndex.
         * @memberof WAServerSync
         * @interface ISyncdIndex
         * @property {Uint8Array|null} [blob] SyncdIndex blob
         */

        /**
         * Constructs a new SyncdIndex.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdIndex.
         * @implements ISyncdIndex
         * @constructor
         * @param {WAServerSync.ISyncdIndex=} [properties] Properties to set
         */
        function SyncdIndex(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdIndex blob.
         * @member {Uint8Array} blob
         * @memberof WAServerSync.SyncdIndex
         * @instance
         */
        SyncdIndex.prototype.blob = $util.newBuffer([]);

        /**
         * Creates a new SyncdIndex instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {WAServerSync.ISyncdIndex=} [properties] Properties to set
         * @returns {WAServerSync.SyncdIndex} SyncdIndex instance
         */
        SyncdIndex.create = function create(properties) {
            return new SyncdIndex(properties);
        };

        /**
         * Encodes the specified SyncdIndex message. Does not implicitly {@link WAServerSync.SyncdIndex.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {WAServerSync.ISyncdIndex} message SyncdIndex message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdIndex.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blob != null && Object.hasOwnProperty.call(message, "blob"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.blob);
            return writer;
        };

        /**
         * Encodes the specified SyncdIndex message, length delimited. Does not implicitly {@link WAServerSync.SyncdIndex.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {WAServerSync.ISyncdIndex} message SyncdIndex message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdIndex.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdIndex message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdIndex} SyncdIndex
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdIndex.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdIndex();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.blob = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdIndex message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdIndex} SyncdIndex
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdIndex.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdIndex message.
         * @function verify
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdIndex.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.blob != null && message.hasOwnProperty("blob"))
                if (!(message.blob && typeof message.blob.length === "number" || $util.isString(message.blob)))
                    return "blob: buffer expected";
            return null;
        };

        /**
         * Creates a SyncdIndex message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdIndex} SyncdIndex
         */
        SyncdIndex.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdIndex)
                return object;
            var message = new $root.WAServerSync.SyncdIndex();
            if (object.blob != null)
                if (typeof object.blob === "string")
                    $util.base64.decode(object.blob, message.blob = $util.newBuffer($util.base64.length(object.blob)), 0);
                else if (object.blob.length >= 0)
                    message.blob = object.blob;
            return message;
        };

        /**
         * Creates a plain object from a SyncdIndex message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {WAServerSync.SyncdIndex} message SyncdIndex
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdIndex.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.blob = "";
                else {
                    object.blob = [];
                    if (options.bytes !== Array)
                        object.blob = $util.newBuffer(object.blob);
                }
            if (message.blob != null && message.hasOwnProperty("blob"))
                object.blob = options.bytes === String ? $util.base64.encode(message.blob, 0, message.blob.length) : options.bytes === Array ? Array.prototype.slice.call(message.blob) : message.blob;
            return object;
        };

        /**
         * Converts this SyncdIndex to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdIndex
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdIndex.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdIndex
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdIndex
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdIndex.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdIndex";
        };

        return SyncdIndex;
    })();

    WAServerSync.SyncdValue = (function() {

        /**
         * Properties of a SyncdValue.
         * @memberof WAServerSync
         * @interface ISyncdValue
         * @property {Uint8Array|null} [blob] SyncdValue blob
         */

        /**
         * Constructs a new SyncdValue.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdValue.
         * @implements ISyncdValue
         * @constructor
         * @param {WAServerSync.ISyncdValue=} [properties] Properties to set
         */
        function SyncdValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdValue blob.
         * @member {Uint8Array} blob
         * @memberof WAServerSync.SyncdValue
         * @instance
         */
        SyncdValue.prototype.blob = $util.newBuffer([]);

        /**
         * Creates a new SyncdValue instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {WAServerSync.ISyncdValue=} [properties] Properties to set
         * @returns {WAServerSync.SyncdValue} SyncdValue instance
         */
        SyncdValue.create = function create(properties) {
            return new SyncdValue(properties);
        };

        /**
         * Encodes the specified SyncdValue message. Does not implicitly {@link WAServerSync.SyncdValue.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {WAServerSync.ISyncdValue} message SyncdValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blob != null && Object.hasOwnProperty.call(message, "blob"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.blob);
            return writer;
        };

        /**
         * Encodes the specified SyncdValue message, length delimited. Does not implicitly {@link WAServerSync.SyncdValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {WAServerSync.ISyncdValue} message SyncdValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdValue message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdValue} SyncdValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.blob = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdValue} SyncdValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdValue message.
         * @function verify
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.blob != null && message.hasOwnProperty("blob"))
                if (!(message.blob && typeof message.blob.length === "number" || $util.isString(message.blob)))
                    return "blob: buffer expected";
            return null;
        };

        /**
         * Creates a SyncdValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdValue} SyncdValue
         */
        SyncdValue.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdValue)
                return object;
            var message = new $root.WAServerSync.SyncdValue();
            if (object.blob != null)
                if (typeof object.blob === "string")
                    $util.base64.decode(object.blob, message.blob = $util.newBuffer($util.base64.length(object.blob)), 0);
                else if (object.blob.length >= 0)
                    message.blob = object.blob;
            return message;
        };

        /**
         * Creates a plain object from a SyncdValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {WAServerSync.SyncdValue} message SyncdValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.blob = "";
                else {
                    object.blob = [];
                    if (options.bytes !== Array)
                        object.blob = $util.newBuffer(object.blob);
                }
            if (message.blob != null && message.hasOwnProperty("blob"))
                object.blob = options.bytes === String ? $util.base64.encode(message.blob, 0, message.blob.length) : options.bytes === Array ? Array.prototype.slice.call(message.blob) : message.blob;
            return object;
        };

        /**
         * Converts this SyncdValue to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdValue
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdValue";
        };

        return SyncdValue;
    })();

    WAServerSync.KeyId = (function() {

        /**
         * Properties of a KeyId.
         * @memberof WAServerSync
         * @interface IKeyId
         * @property {Uint8Array|null} [ID] KeyId ID
         */

        /**
         * Constructs a new KeyId.
         * @memberof WAServerSync
         * @classdesc Represents a KeyId.
         * @implements IKeyId
         * @constructor
         * @param {WAServerSync.IKeyId=} [properties] Properties to set
         */
        function KeyId(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyId ID.
         * @member {Uint8Array} ID
         * @memberof WAServerSync.KeyId
         * @instance
         */
        KeyId.prototype.ID = $util.newBuffer([]);

        /**
         * Creates a new KeyId instance using the specified properties.
         * @function create
         * @memberof WAServerSync.KeyId
         * @static
         * @param {WAServerSync.IKeyId=} [properties] Properties to set
         * @returns {WAServerSync.KeyId} KeyId instance
         */
        KeyId.create = function create(properties) {
            return new KeyId(properties);
        };

        /**
         * Encodes the specified KeyId message. Does not implicitly {@link WAServerSync.KeyId.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.KeyId
         * @static
         * @param {WAServerSync.IKeyId} message KeyId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyId.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ID);
            return writer;
        };

        /**
         * Encodes the specified KeyId message, length delimited. Does not implicitly {@link WAServerSync.KeyId.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.KeyId
         * @static
         * @param {WAServerSync.IKeyId} message KeyId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyId.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyId message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.KeyId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.KeyId} KeyId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyId.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.KeyId();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KeyId message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.KeyId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.KeyId} KeyId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyId.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyId message.
         * @function verify
         * @memberof WAServerSync.KeyId
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyId.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!(message.ID && typeof message.ID.length === "number" || $util.isString(message.ID)))
                    return "ID: buffer expected";
            return null;
        };

        /**
         * Creates a KeyId message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.KeyId
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.KeyId} KeyId
         */
        KeyId.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.KeyId)
                return object;
            var message = new $root.WAServerSync.KeyId();
            if (object.ID != null)
                if (typeof object.ID === "string")
                    $util.base64.decode(object.ID, message.ID = $util.newBuffer($util.base64.length(object.ID)), 0);
                else if (object.ID.length >= 0)
                    message.ID = object.ID;
            return message;
        };

        /**
         * Creates a plain object from a KeyId message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.KeyId
         * @static
         * @param {WAServerSync.KeyId} message KeyId
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyId.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.ID = "";
                else {
                    object.ID = [];
                    if (options.bytes !== Array)
                        object.ID = $util.newBuffer(object.ID);
                }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = options.bytes === String ? $util.base64.encode(message.ID, 0, message.ID.length) : options.bytes === Array ? Array.prototype.slice.call(message.ID) : message.ID;
            return object;
        };

        /**
         * Converts this KeyId to JSON.
         * @function toJSON
         * @memberof WAServerSync.KeyId
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyId.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for KeyId
         * @function getTypeUrl
         * @memberof WAServerSync.KeyId
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        KeyId.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.KeyId";
        };

        return KeyId;
    })();

    WAServerSync.SyncdRecord = (function() {

        /**
         * Properties of a SyncdRecord.
         * @memberof WAServerSync
         * @interface ISyncdRecord
         * @property {WAServerSync.ISyncdIndex|null} [index] SyncdRecord index
         * @property {WAServerSync.ISyncdValue|null} [value] SyncdRecord value
         * @property {WAServerSync.IKeyId|null} [keyID] SyncdRecord keyID
         */

        /**
         * Constructs a new SyncdRecord.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdRecord.
         * @implements ISyncdRecord
         * @constructor
         * @param {WAServerSync.ISyncdRecord=} [properties] Properties to set
         */
        function SyncdRecord(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdRecord index.
         * @member {WAServerSync.ISyncdIndex|null|undefined} index
         * @memberof WAServerSync.SyncdRecord
         * @instance
         */
        SyncdRecord.prototype.index = null;

        /**
         * SyncdRecord value.
         * @member {WAServerSync.ISyncdValue|null|undefined} value
         * @memberof WAServerSync.SyncdRecord
         * @instance
         */
        SyncdRecord.prototype.value = null;

        /**
         * SyncdRecord keyID.
         * @member {WAServerSync.IKeyId|null|undefined} keyID
         * @memberof WAServerSync.SyncdRecord
         * @instance
         */
        SyncdRecord.prototype.keyID = null;

        /**
         * Creates a new SyncdRecord instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {WAServerSync.ISyncdRecord=} [properties] Properties to set
         * @returns {WAServerSync.SyncdRecord} SyncdRecord instance
         */
        SyncdRecord.create = function create(properties) {
            return new SyncdRecord(properties);
        };

        /**
         * Encodes the specified SyncdRecord message. Does not implicitly {@link WAServerSync.SyncdRecord.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {WAServerSync.ISyncdRecord} message SyncdRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdRecord.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                $root.WAServerSync.SyncdIndex.encode(message.index, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.WAServerSync.SyncdValue.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.keyID != null && Object.hasOwnProperty.call(message, "keyID"))
                $root.WAServerSync.KeyId.encode(message.keyID, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncdRecord message, length delimited. Does not implicitly {@link WAServerSync.SyncdRecord.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {WAServerSync.ISyncdRecord} message SyncdRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdRecord.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdRecord message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdRecord} SyncdRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdRecord.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdRecord();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.index = $root.WAServerSync.SyncdIndex.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.value = $root.WAServerSync.SyncdValue.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.keyID = $root.WAServerSync.KeyId.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdRecord message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdRecord} SyncdRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdRecord.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdRecord message.
         * @function verify
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdRecord.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.index != null && message.hasOwnProperty("index")) {
                var error = $root.WAServerSync.SyncdIndex.verify(message.index);
                if (error)
                    return "index." + error;
            }
            if (message.value != null && message.hasOwnProperty("value")) {
                var error = $root.WAServerSync.SyncdValue.verify(message.value);
                if (error)
                    return "value." + error;
            }
            if (message.keyID != null && message.hasOwnProperty("keyID")) {
                var error = $root.WAServerSync.KeyId.verify(message.keyID);
                if (error)
                    return "keyID." + error;
            }
            return null;
        };

        /**
         * Creates a SyncdRecord message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdRecord} SyncdRecord
         */
        SyncdRecord.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdRecord)
                return object;
            var message = new $root.WAServerSync.SyncdRecord();
            if (object.index != null) {
                if (typeof object.index !== "object")
                    throw TypeError(".WAServerSync.SyncdRecord.index: object expected");
                message.index = $root.WAServerSync.SyncdIndex.fromObject(object.index);
            }
            if (object.value != null) {
                if (typeof object.value !== "object")
                    throw TypeError(".WAServerSync.SyncdRecord.value: object expected");
                message.value = $root.WAServerSync.SyncdValue.fromObject(object.value);
            }
            if (object.keyID != null) {
                if (typeof object.keyID !== "object")
                    throw TypeError(".WAServerSync.SyncdRecord.keyID: object expected");
                message.keyID = $root.WAServerSync.KeyId.fromObject(object.keyID);
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncdRecord message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {WAServerSync.SyncdRecord} message SyncdRecord
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdRecord.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.index = null;
                object.value = null;
                object.keyID = null;
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = $root.WAServerSync.SyncdIndex.toObject(message.index, options);
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = $root.WAServerSync.SyncdValue.toObject(message.value, options);
            if (message.keyID != null && message.hasOwnProperty("keyID"))
                object.keyID = $root.WAServerSync.KeyId.toObject(message.keyID, options);
            return object;
        };

        /**
         * Converts this SyncdRecord to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdRecord
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdRecord.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdRecord
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdRecord
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdRecord";
        };

        return SyncdRecord;
    })();

    WAServerSync.ExternalBlobReference = (function() {

        /**
         * Properties of an ExternalBlobReference.
         * @memberof WAServerSync
         * @interface IExternalBlobReference
         * @property {Uint8Array|null} [mediaKey] ExternalBlobReference mediaKey
         * @property {string|null} [directPath] ExternalBlobReference directPath
         * @property {string|null} [handle] ExternalBlobReference handle
         * @property {number|Long|null} [fileSizeBytes] ExternalBlobReference fileSizeBytes
         * @property {Uint8Array|null} [fileSHA256] ExternalBlobReference fileSHA256
         * @property {Uint8Array|null} [fileEncSHA256] ExternalBlobReference fileEncSHA256
         */

        /**
         * Constructs a new ExternalBlobReference.
         * @memberof WAServerSync
         * @classdesc Represents an ExternalBlobReference.
         * @implements IExternalBlobReference
         * @constructor
         * @param {WAServerSync.IExternalBlobReference=} [properties] Properties to set
         */
        function ExternalBlobReference(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExternalBlobReference mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.mediaKey = $util.newBuffer([]);

        /**
         * ExternalBlobReference directPath.
         * @member {string} directPath
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.directPath = "";

        /**
         * ExternalBlobReference handle.
         * @member {string} handle
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.handle = "";

        /**
         * ExternalBlobReference fileSizeBytes.
         * @member {number|Long} fileSizeBytes
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.fileSizeBytes = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ExternalBlobReference fileSHA256.
         * @member {Uint8Array} fileSHA256
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.fileSHA256 = $util.newBuffer([]);

        /**
         * ExternalBlobReference fileEncSHA256.
         * @member {Uint8Array} fileEncSHA256
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         */
        ExternalBlobReference.prototype.fileEncSHA256 = $util.newBuffer([]);

        /**
         * Creates a new ExternalBlobReference instance using the specified properties.
         * @function create
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {WAServerSync.IExternalBlobReference=} [properties] Properties to set
         * @returns {WAServerSync.ExternalBlobReference} ExternalBlobReference instance
         */
        ExternalBlobReference.create = function create(properties) {
            return new ExternalBlobReference(properties);
        };

        /**
         * Encodes the specified ExternalBlobReference message. Does not implicitly {@link WAServerSync.ExternalBlobReference.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {WAServerSync.IExternalBlobReference} message ExternalBlobReference message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalBlobReference.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.mediaKey);
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.directPath);
            if (message.handle != null && Object.hasOwnProperty.call(message, "handle"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.handle);
            if (message.fileSizeBytes != null && Object.hasOwnProperty.call(message, "fileSizeBytes"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.fileSizeBytes);
            if (message.fileSHA256 != null && Object.hasOwnProperty.call(message, "fileSHA256"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.fileSHA256);
            if (message.fileEncSHA256 != null && Object.hasOwnProperty.call(message, "fileEncSHA256"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.fileEncSHA256);
            return writer;
        };

        /**
         * Encodes the specified ExternalBlobReference message, length delimited. Does not implicitly {@link WAServerSync.ExternalBlobReference.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {WAServerSync.IExternalBlobReference} message ExternalBlobReference message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalBlobReference.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExternalBlobReference message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.ExternalBlobReference} ExternalBlobReference
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalBlobReference.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.ExternalBlobReference();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.mediaKey = reader.bytes();
                        break;
                    }
                case 2: {
                        message.directPath = reader.string();
                        break;
                    }
                case 3: {
                        message.handle = reader.string();
                        break;
                    }
                case 4: {
                        message.fileSizeBytes = reader.uint64();
                        break;
                    }
                case 5: {
                        message.fileSHA256 = reader.bytes();
                        break;
                    }
                case 6: {
                        message.fileEncSHA256 = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExternalBlobReference message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.ExternalBlobReference} ExternalBlobReference
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalBlobReference.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExternalBlobReference message.
         * @function verify
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExternalBlobReference.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.handle != null && message.hasOwnProperty("handle"))
                if (!$util.isString(message.handle))
                    return "handle: string expected";
            if (message.fileSizeBytes != null && message.hasOwnProperty("fileSizeBytes"))
                if (!$util.isInteger(message.fileSizeBytes) && !(message.fileSizeBytes && $util.isInteger(message.fileSizeBytes.low) && $util.isInteger(message.fileSizeBytes.high)))
                    return "fileSizeBytes: integer|Long expected";
            if (message.fileSHA256 != null && message.hasOwnProperty("fileSHA256"))
                if (!(message.fileSHA256 && typeof message.fileSHA256.length === "number" || $util.isString(message.fileSHA256)))
                    return "fileSHA256: buffer expected";
            if (message.fileEncSHA256 != null && message.hasOwnProperty("fileEncSHA256"))
                if (!(message.fileEncSHA256 && typeof message.fileEncSHA256.length === "number" || $util.isString(message.fileEncSHA256)))
                    return "fileEncSHA256: buffer expected";
            return null;
        };

        /**
         * Creates an ExternalBlobReference message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.ExternalBlobReference} ExternalBlobReference
         */
        ExternalBlobReference.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.ExternalBlobReference)
                return object;
            var message = new $root.WAServerSync.ExternalBlobReference();
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length >= 0)
                    message.mediaKey = object.mediaKey;
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.handle != null)
                message.handle = String(object.handle);
            if (object.fileSizeBytes != null)
                if ($util.Long)
                    (message.fileSizeBytes = $util.Long.fromValue(object.fileSizeBytes)).unsigned = true;
                else if (typeof object.fileSizeBytes === "string")
                    message.fileSizeBytes = parseInt(object.fileSizeBytes, 10);
                else if (typeof object.fileSizeBytes === "number")
                    message.fileSizeBytes = object.fileSizeBytes;
                else if (typeof object.fileSizeBytes === "object")
                    message.fileSizeBytes = new $util.LongBits(object.fileSizeBytes.low >>> 0, object.fileSizeBytes.high >>> 0).toNumber(true);
            if (object.fileSHA256 != null)
                if (typeof object.fileSHA256 === "string")
                    $util.base64.decode(object.fileSHA256, message.fileSHA256 = $util.newBuffer($util.base64.length(object.fileSHA256)), 0);
                else if (object.fileSHA256.length >= 0)
                    message.fileSHA256 = object.fileSHA256;
            if (object.fileEncSHA256 != null)
                if (typeof object.fileEncSHA256 === "string")
                    $util.base64.decode(object.fileEncSHA256, message.fileEncSHA256 = $util.newBuffer($util.base64.length(object.fileEncSHA256)), 0);
                else if (object.fileEncSHA256.length >= 0)
                    message.fileEncSHA256 = object.fileEncSHA256;
            return message;
        };

        /**
         * Creates a plain object from an ExternalBlobReference message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {WAServerSync.ExternalBlobReference} message ExternalBlobReference
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExternalBlobReference.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                object.directPath = "";
                object.handle = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileSizeBytes = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileSizeBytes = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.fileSHA256 = "";
                else {
                    object.fileSHA256 = [];
                    if (options.bytes !== Array)
                        object.fileSHA256 = $util.newBuffer(object.fileSHA256);
                }
                if (options.bytes === String)
                    object.fileEncSHA256 = "";
                else {
                    object.fileEncSHA256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSHA256 = $util.newBuffer(object.fileEncSHA256);
                }
            }
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.handle != null && message.hasOwnProperty("handle"))
                object.handle = message.handle;
            if (message.fileSizeBytes != null && message.hasOwnProperty("fileSizeBytes"))
                if (typeof message.fileSizeBytes === "number")
                    object.fileSizeBytes = options.longs === String ? String(message.fileSizeBytes) : message.fileSizeBytes;
                else
                    object.fileSizeBytes = options.longs === String ? $util.Long.prototype.toString.call(message.fileSizeBytes) : options.longs === Number ? new $util.LongBits(message.fileSizeBytes.low >>> 0, message.fileSizeBytes.high >>> 0).toNumber(true) : message.fileSizeBytes;
            if (message.fileSHA256 != null && message.hasOwnProperty("fileSHA256"))
                object.fileSHA256 = options.bytes === String ? $util.base64.encode(message.fileSHA256, 0, message.fileSHA256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSHA256) : message.fileSHA256;
            if (message.fileEncSHA256 != null && message.hasOwnProperty("fileEncSHA256"))
                object.fileEncSHA256 = options.bytes === String ? $util.base64.encode(message.fileEncSHA256, 0, message.fileEncSHA256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSHA256) : message.fileEncSHA256;
            return object;
        };

        /**
         * Converts this ExternalBlobReference to JSON.
         * @function toJSON
         * @memberof WAServerSync.ExternalBlobReference
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExternalBlobReference.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExternalBlobReference
         * @function getTypeUrl
         * @memberof WAServerSync.ExternalBlobReference
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExternalBlobReference.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.ExternalBlobReference";
        };

        return ExternalBlobReference;
    })();

    WAServerSync.SyncdSnapshot = (function() {

        /**
         * Properties of a SyncdSnapshot.
         * @memberof WAServerSync
         * @interface ISyncdSnapshot
         * @property {WAServerSync.ISyncdVersion|null} [version] SyncdSnapshot version
         * @property {Array.<WAServerSync.ISyncdRecord>|null} [records] SyncdSnapshot records
         * @property {Uint8Array|null} [mac] SyncdSnapshot mac
         * @property {WAServerSync.IKeyId|null} [keyID] SyncdSnapshot keyID
         */

        /**
         * Constructs a new SyncdSnapshot.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdSnapshot.
         * @implements ISyncdSnapshot
         * @constructor
         * @param {WAServerSync.ISyncdSnapshot=} [properties] Properties to set
         */
        function SyncdSnapshot(properties) {
            this.records = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdSnapshot version.
         * @member {WAServerSync.ISyncdVersion|null|undefined} version
         * @memberof WAServerSync.SyncdSnapshot
         * @instance
         */
        SyncdSnapshot.prototype.version = null;

        /**
         * SyncdSnapshot records.
         * @member {Array.<WAServerSync.ISyncdRecord>} records
         * @memberof WAServerSync.SyncdSnapshot
         * @instance
         */
        SyncdSnapshot.prototype.records = $util.emptyArray;

        /**
         * SyncdSnapshot mac.
         * @member {Uint8Array} mac
         * @memberof WAServerSync.SyncdSnapshot
         * @instance
         */
        SyncdSnapshot.prototype.mac = $util.newBuffer([]);

        /**
         * SyncdSnapshot keyID.
         * @member {WAServerSync.IKeyId|null|undefined} keyID
         * @memberof WAServerSync.SyncdSnapshot
         * @instance
         */
        SyncdSnapshot.prototype.keyID = null;

        /**
         * Creates a new SyncdSnapshot instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {WAServerSync.ISyncdSnapshot=} [properties] Properties to set
         * @returns {WAServerSync.SyncdSnapshot} SyncdSnapshot instance
         */
        SyncdSnapshot.create = function create(properties) {
            return new SyncdSnapshot(properties);
        };

        /**
         * Encodes the specified SyncdSnapshot message. Does not implicitly {@link WAServerSync.SyncdSnapshot.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {WAServerSync.ISyncdSnapshot} message SyncdSnapshot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdSnapshot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                $root.WAServerSync.SyncdVersion.encode(message.version, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.records != null && message.records.length)
                for (var i = 0; i < message.records.length; ++i)
                    $root.WAServerSync.SyncdRecord.encode(message.records[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.mac != null && Object.hasOwnProperty.call(message, "mac"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.mac);
            if (message.keyID != null && Object.hasOwnProperty.call(message, "keyID"))
                $root.WAServerSync.KeyId.encode(message.keyID, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncdSnapshot message, length delimited. Does not implicitly {@link WAServerSync.SyncdSnapshot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {WAServerSync.ISyncdSnapshot} message SyncdSnapshot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdSnapshot message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdSnapshot} SyncdSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdSnapshot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdSnapshot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.version = $root.WAServerSync.SyncdVersion.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.records && message.records.length))
                            message.records = [];
                        message.records.push($root.WAServerSync.SyncdRecord.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.mac = reader.bytes();
                        break;
                    }
                case 4: {
                        message.keyID = $root.WAServerSync.KeyId.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdSnapshot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdSnapshot} SyncdSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdSnapshot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdSnapshot message.
         * @function verify
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdSnapshot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version")) {
                var error = $root.WAServerSync.SyncdVersion.verify(message.version);
                if (error)
                    return "version." + error;
            }
            if (message.records != null && message.hasOwnProperty("records")) {
                if (!Array.isArray(message.records))
                    return "records: array expected";
                for (var i = 0; i < message.records.length; ++i) {
                    var error = $root.WAServerSync.SyncdRecord.verify(message.records[i]);
                    if (error)
                        return "records." + error;
                }
            }
            if (message.mac != null && message.hasOwnProperty("mac"))
                if (!(message.mac && typeof message.mac.length === "number" || $util.isString(message.mac)))
                    return "mac: buffer expected";
            if (message.keyID != null && message.hasOwnProperty("keyID")) {
                var error = $root.WAServerSync.KeyId.verify(message.keyID);
                if (error)
                    return "keyID." + error;
            }
            return null;
        };

        /**
         * Creates a SyncdSnapshot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdSnapshot} SyncdSnapshot
         */
        SyncdSnapshot.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdSnapshot)
                return object;
            var message = new $root.WAServerSync.SyncdSnapshot();
            if (object.version != null) {
                if (typeof object.version !== "object")
                    throw TypeError(".WAServerSync.SyncdSnapshot.version: object expected");
                message.version = $root.WAServerSync.SyncdVersion.fromObject(object.version);
            }
            if (object.records) {
                if (!Array.isArray(object.records))
                    throw TypeError(".WAServerSync.SyncdSnapshot.records: array expected");
                message.records = [];
                for (var i = 0; i < object.records.length; ++i) {
                    if (typeof object.records[i] !== "object")
                        throw TypeError(".WAServerSync.SyncdSnapshot.records: object expected");
                    message.records[i] = $root.WAServerSync.SyncdRecord.fromObject(object.records[i]);
                }
            }
            if (object.mac != null)
                if (typeof object.mac === "string")
                    $util.base64.decode(object.mac, message.mac = $util.newBuffer($util.base64.length(object.mac)), 0);
                else if (object.mac.length >= 0)
                    message.mac = object.mac;
            if (object.keyID != null) {
                if (typeof object.keyID !== "object")
                    throw TypeError(".WAServerSync.SyncdSnapshot.keyID: object expected");
                message.keyID = $root.WAServerSync.KeyId.fromObject(object.keyID);
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncdSnapshot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {WAServerSync.SyncdSnapshot} message SyncdSnapshot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdSnapshot.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.records = [];
            if (options.defaults) {
                object.version = null;
                if (options.bytes === String)
                    object.mac = "";
                else {
                    object.mac = [];
                    if (options.bytes !== Array)
                        object.mac = $util.newBuffer(object.mac);
                }
                object.keyID = null;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = $root.WAServerSync.SyncdVersion.toObject(message.version, options);
            if (message.records && message.records.length) {
                object.records = [];
                for (var j = 0; j < message.records.length; ++j)
                    object.records[j] = $root.WAServerSync.SyncdRecord.toObject(message.records[j], options);
            }
            if (message.mac != null && message.hasOwnProperty("mac"))
                object.mac = options.bytes === String ? $util.base64.encode(message.mac, 0, message.mac.length) : options.bytes === Array ? Array.prototype.slice.call(message.mac) : message.mac;
            if (message.keyID != null && message.hasOwnProperty("keyID"))
                object.keyID = $root.WAServerSync.KeyId.toObject(message.keyID, options);
            return object;
        };

        /**
         * Converts this SyncdSnapshot to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdSnapshot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdSnapshot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdSnapshot
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdSnapshot
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdSnapshot";
        };

        return SyncdSnapshot;
    })();

    WAServerSync.SyncdMutations = (function() {

        /**
         * Properties of a SyncdMutations.
         * @memberof WAServerSync
         * @interface ISyncdMutations
         * @property {Array.<WAServerSync.ISyncdMutation>|null} [mutations] SyncdMutations mutations
         */

        /**
         * Constructs a new SyncdMutations.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdMutations.
         * @implements ISyncdMutations
         * @constructor
         * @param {WAServerSync.ISyncdMutations=} [properties] Properties to set
         */
        function SyncdMutations(properties) {
            this.mutations = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdMutations mutations.
         * @member {Array.<WAServerSync.ISyncdMutation>} mutations
         * @memberof WAServerSync.SyncdMutations
         * @instance
         */
        SyncdMutations.prototype.mutations = $util.emptyArray;

        /**
         * Creates a new SyncdMutations instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {WAServerSync.ISyncdMutations=} [properties] Properties to set
         * @returns {WAServerSync.SyncdMutations} SyncdMutations instance
         */
        SyncdMutations.create = function create(properties) {
            return new SyncdMutations(properties);
        };

        /**
         * Encodes the specified SyncdMutations message. Does not implicitly {@link WAServerSync.SyncdMutations.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {WAServerSync.ISyncdMutations} message SyncdMutations message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdMutations.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mutations != null && message.mutations.length)
                for (var i = 0; i < message.mutations.length; ++i)
                    $root.WAServerSync.SyncdMutation.encode(message.mutations[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncdMutations message, length delimited. Does not implicitly {@link WAServerSync.SyncdMutations.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {WAServerSync.ISyncdMutations} message SyncdMutations message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdMutations.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdMutations message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdMutations} SyncdMutations
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdMutations.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdMutations();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.mutations && message.mutations.length))
                            message.mutations = [];
                        message.mutations.push($root.WAServerSync.SyncdMutation.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdMutations message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdMutations} SyncdMutations
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdMutations.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdMutations message.
         * @function verify
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdMutations.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.mutations != null && message.hasOwnProperty("mutations")) {
                if (!Array.isArray(message.mutations))
                    return "mutations: array expected";
                for (var i = 0; i < message.mutations.length; ++i) {
                    var error = $root.WAServerSync.SyncdMutation.verify(message.mutations[i]);
                    if (error)
                        return "mutations." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SyncdMutations message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdMutations} SyncdMutations
         */
        SyncdMutations.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdMutations)
                return object;
            var message = new $root.WAServerSync.SyncdMutations();
            if (object.mutations) {
                if (!Array.isArray(object.mutations))
                    throw TypeError(".WAServerSync.SyncdMutations.mutations: array expected");
                message.mutations = [];
                for (var i = 0; i < object.mutations.length; ++i) {
                    if (typeof object.mutations[i] !== "object")
                        throw TypeError(".WAServerSync.SyncdMutations.mutations: object expected");
                    message.mutations[i] = $root.WAServerSync.SyncdMutation.fromObject(object.mutations[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncdMutations message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {WAServerSync.SyncdMutations} message SyncdMutations
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdMutations.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.mutations = [];
            if (message.mutations && message.mutations.length) {
                object.mutations = [];
                for (var j = 0; j < message.mutations.length; ++j)
                    object.mutations[j] = $root.WAServerSync.SyncdMutation.toObject(message.mutations[j], options);
            }
            return object;
        };

        /**
         * Converts this SyncdMutations to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdMutations
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdMutations.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdMutations
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdMutations
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdMutations.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdMutations";
        };

        return SyncdMutations;
    })();

    WAServerSync.SyncdPatch = (function() {

        /**
         * Properties of a SyncdPatch.
         * @memberof WAServerSync
         * @interface ISyncdPatch
         * @property {WAServerSync.ISyncdVersion|null} [version] SyncdPatch version
         * @property {Array.<WAServerSync.ISyncdMutation>|null} [mutations] SyncdPatch mutations
         * @property {WAServerSync.IExternalBlobReference|null} [externalMutations] SyncdPatch externalMutations
         * @property {Uint8Array|null} [snapshotMAC] SyncdPatch snapshotMAC
         * @property {Uint8Array|null} [patchMAC] SyncdPatch patchMAC
         * @property {WAServerSync.IKeyId|null} [keyID] SyncdPatch keyID
         * @property {WAServerSync.IExitCode|null} [exitCode] SyncdPatch exitCode
         * @property {number|null} [deviceIndex] SyncdPatch deviceIndex
         * @property {Uint8Array|null} [clientDebugData] SyncdPatch clientDebugData
         */

        /**
         * Constructs a new SyncdPatch.
         * @memberof WAServerSync
         * @classdesc Represents a SyncdPatch.
         * @implements ISyncdPatch
         * @constructor
         * @param {WAServerSync.ISyncdPatch=} [properties] Properties to set
         */
        function SyncdPatch(properties) {
            this.mutations = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncdPatch version.
         * @member {WAServerSync.ISyncdVersion|null|undefined} version
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.version = null;

        /**
         * SyncdPatch mutations.
         * @member {Array.<WAServerSync.ISyncdMutation>} mutations
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.mutations = $util.emptyArray;

        /**
         * SyncdPatch externalMutations.
         * @member {WAServerSync.IExternalBlobReference|null|undefined} externalMutations
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.externalMutations = null;

        /**
         * SyncdPatch snapshotMAC.
         * @member {Uint8Array} snapshotMAC
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.snapshotMAC = $util.newBuffer([]);

        /**
         * SyncdPatch patchMAC.
         * @member {Uint8Array} patchMAC
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.patchMAC = $util.newBuffer([]);

        /**
         * SyncdPatch keyID.
         * @member {WAServerSync.IKeyId|null|undefined} keyID
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.keyID = null;

        /**
         * SyncdPatch exitCode.
         * @member {WAServerSync.IExitCode|null|undefined} exitCode
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.exitCode = null;

        /**
         * SyncdPatch deviceIndex.
         * @member {number} deviceIndex
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.deviceIndex = 0;

        /**
         * SyncdPatch clientDebugData.
         * @member {Uint8Array} clientDebugData
         * @memberof WAServerSync.SyncdPatch
         * @instance
         */
        SyncdPatch.prototype.clientDebugData = $util.newBuffer([]);

        /**
         * Creates a new SyncdPatch instance using the specified properties.
         * @function create
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {WAServerSync.ISyncdPatch=} [properties] Properties to set
         * @returns {WAServerSync.SyncdPatch} SyncdPatch instance
         */
        SyncdPatch.create = function create(properties) {
            return new SyncdPatch(properties);
        };

        /**
         * Encodes the specified SyncdPatch message. Does not implicitly {@link WAServerSync.SyncdPatch.verify|verify} messages.
         * @function encode
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {WAServerSync.ISyncdPatch} message SyncdPatch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdPatch.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                $root.WAServerSync.SyncdVersion.encode(message.version, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.mutations != null && message.mutations.length)
                for (var i = 0; i < message.mutations.length; ++i)
                    $root.WAServerSync.SyncdMutation.encode(message.mutations[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.externalMutations != null && Object.hasOwnProperty.call(message, "externalMutations"))
                $root.WAServerSync.ExternalBlobReference.encode(message.externalMutations, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.snapshotMAC != null && Object.hasOwnProperty.call(message, "snapshotMAC"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.snapshotMAC);
            if (message.patchMAC != null && Object.hasOwnProperty.call(message, "patchMAC"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.patchMAC);
            if (message.keyID != null && Object.hasOwnProperty.call(message, "keyID"))
                $root.WAServerSync.KeyId.encode(message.keyID, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.exitCode != null && Object.hasOwnProperty.call(message, "exitCode"))
                $root.WAServerSync.ExitCode.encode(message.exitCode, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.deviceIndex != null && Object.hasOwnProperty.call(message, "deviceIndex"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.deviceIndex);
            if (message.clientDebugData != null && Object.hasOwnProperty.call(message, "clientDebugData"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.clientDebugData);
            return writer;
        };

        /**
         * Encodes the specified SyncdPatch message, length delimited. Does not implicitly {@link WAServerSync.SyncdPatch.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {WAServerSync.ISyncdPatch} message SyncdPatch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncdPatch.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncdPatch message from the specified reader or buffer.
         * @function decode
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAServerSync.SyncdPatch} SyncdPatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdPatch.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAServerSync.SyncdPatch();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.version = $root.WAServerSync.SyncdVersion.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.mutations && message.mutations.length))
                            message.mutations = [];
                        message.mutations.push($root.WAServerSync.SyncdMutation.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.externalMutations = $root.WAServerSync.ExternalBlobReference.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.snapshotMAC = reader.bytes();
                        break;
                    }
                case 5: {
                        message.patchMAC = reader.bytes();
                        break;
                    }
                case 6: {
                        message.keyID = $root.WAServerSync.KeyId.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.exitCode = $root.WAServerSync.ExitCode.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.deviceIndex = reader.uint32();
                        break;
                    }
                case 9: {
                        message.clientDebugData = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncdPatch message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAServerSync.SyncdPatch} SyncdPatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncdPatch.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncdPatch message.
         * @function verify
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncdPatch.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version")) {
                var error = $root.WAServerSync.SyncdVersion.verify(message.version);
                if (error)
                    return "version." + error;
            }
            if (message.mutations != null && message.hasOwnProperty("mutations")) {
                if (!Array.isArray(message.mutations))
                    return "mutations: array expected";
                for (var i = 0; i < message.mutations.length; ++i) {
                    var error = $root.WAServerSync.SyncdMutation.verify(message.mutations[i]);
                    if (error)
                        return "mutations." + error;
                }
            }
            if (message.externalMutations != null && message.hasOwnProperty("externalMutations")) {
                var error = $root.WAServerSync.ExternalBlobReference.verify(message.externalMutations);
                if (error)
                    return "externalMutations." + error;
            }
            if (message.snapshotMAC != null && message.hasOwnProperty("snapshotMAC"))
                if (!(message.snapshotMAC && typeof message.snapshotMAC.length === "number" || $util.isString(message.snapshotMAC)))
                    return "snapshotMAC: buffer expected";
            if (message.patchMAC != null && message.hasOwnProperty("patchMAC"))
                if (!(message.patchMAC && typeof message.patchMAC.length === "number" || $util.isString(message.patchMAC)))
                    return "patchMAC: buffer expected";
            if (message.keyID != null && message.hasOwnProperty("keyID")) {
                var error = $root.WAServerSync.KeyId.verify(message.keyID);
                if (error)
                    return "keyID." + error;
            }
            if (message.exitCode != null && message.hasOwnProperty("exitCode")) {
                var error = $root.WAServerSync.ExitCode.verify(message.exitCode);
                if (error)
                    return "exitCode." + error;
            }
            if (message.deviceIndex != null && message.hasOwnProperty("deviceIndex"))
                if (!$util.isInteger(message.deviceIndex))
                    return "deviceIndex: integer expected";
            if (message.clientDebugData != null && message.hasOwnProperty("clientDebugData"))
                if (!(message.clientDebugData && typeof message.clientDebugData.length === "number" || $util.isString(message.clientDebugData)))
                    return "clientDebugData: buffer expected";
            return null;
        };

        /**
         * Creates a SyncdPatch message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAServerSync.SyncdPatch} SyncdPatch
         */
        SyncdPatch.fromObject = function fromObject(object) {
            if (object instanceof $root.WAServerSync.SyncdPatch)
                return object;
            var message = new $root.WAServerSync.SyncdPatch();
            if (object.version != null) {
                if (typeof object.version !== "object")
                    throw TypeError(".WAServerSync.SyncdPatch.version: object expected");
                message.version = $root.WAServerSync.SyncdVersion.fromObject(object.version);
            }
            if (object.mutations) {
                if (!Array.isArray(object.mutations))
                    throw TypeError(".WAServerSync.SyncdPatch.mutations: array expected");
                message.mutations = [];
                for (var i = 0; i < object.mutations.length; ++i) {
                    if (typeof object.mutations[i] !== "object")
                        throw TypeError(".WAServerSync.SyncdPatch.mutations: object expected");
                    message.mutations[i] = $root.WAServerSync.SyncdMutation.fromObject(object.mutations[i]);
                }
            }
            if (object.externalMutations != null) {
                if (typeof object.externalMutations !== "object")
                    throw TypeError(".WAServerSync.SyncdPatch.externalMutations: object expected");
                message.externalMutations = $root.WAServerSync.ExternalBlobReference.fromObject(object.externalMutations);
            }
            if (object.snapshotMAC != null)
                if (typeof object.snapshotMAC === "string")
                    $util.base64.decode(object.snapshotMAC, message.snapshotMAC = $util.newBuffer($util.base64.length(object.snapshotMAC)), 0);
                else if (object.snapshotMAC.length >= 0)
                    message.snapshotMAC = object.snapshotMAC;
            if (object.patchMAC != null)
                if (typeof object.patchMAC === "string")
                    $util.base64.decode(object.patchMAC, message.patchMAC = $util.newBuffer($util.base64.length(object.patchMAC)), 0);
                else if (object.patchMAC.length >= 0)
                    message.patchMAC = object.patchMAC;
            if (object.keyID != null) {
                if (typeof object.keyID !== "object")
                    throw TypeError(".WAServerSync.SyncdPatch.keyID: object expected");
                message.keyID = $root.WAServerSync.KeyId.fromObject(object.keyID);
            }
            if (object.exitCode != null) {
                if (typeof object.exitCode !== "object")
                    throw TypeError(".WAServerSync.SyncdPatch.exitCode: object expected");
                message.exitCode = $root.WAServerSync.ExitCode.fromObject(object.exitCode);
            }
            if (object.deviceIndex != null)
                message.deviceIndex = object.deviceIndex >>> 0;
            if (object.clientDebugData != null)
                if (typeof object.clientDebugData === "string")
                    $util.base64.decode(object.clientDebugData, message.clientDebugData = $util.newBuffer($util.base64.length(object.clientDebugData)), 0);
                else if (object.clientDebugData.length >= 0)
                    message.clientDebugData = object.clientDebugData;
            return message;
        };

        /**
         * Creates a plain object from a SyncdPatch message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {WAServerSync.SyncdPatch} message SyncdPatch
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncdPatch.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.mutations = [];
            if (options.defaults) {
                object.version = null;
                object.externalMutations = null;
                if (options.bytes === String)
                    object.snapshotMAC = "";
                else {
                    object.snapshotMAC = [];
                    if (options.bytes !== Array)
                        object.snapshotMAC = $util.newBuffer(object.snapshotMAC);
                }
                if (options.bytes === String)
                    object.patchMAC = "";
                else {
                    object.patchMAC = [];
                    if (options.bytes !== Array)
                        object.patchMAC = $util.newBuffer(object.patchMAC);
                }
                object.keyID = null;
                object.exitCode = null;
                object.deviceIndex = 0;
                if (options.bytes === String)
                    object.clientDebugData = "";
                else {
                    object.clientDebugData = [];
                    if (options.bytes !== Array)
                        object.clientDebugData = $util.newBuffer(object.clientDebugData);
                }
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = $root.WAServerSync.SyncdVersion.toObject(message.version, options);
            if (message.mutations && message.mutations.length) {
                object.mutations = [];
                for (var j = 0; j < message.mutations.length; ++j)
                    object.mutations[j] = $root.WAServerSync.SyncdMutation.toObject(message.mutations[j], options);
            }
            if (message.externalMutations != null && message.hasOwnProperty("externalMutations"))
                object.externalMutations = $root.WAServerSync.ExternalBlobReference.toObject(message.externalMutations, options);
            if (message.snapshotMAC != null && message.hasOwnProperty("snapshotMAC"))
                object.snapshotMAC = options.bytes === String ? $util.base64.encode(message.snapshotMAC, 0, message.snapshotMAC.length) : options.bytes === Array ? Array.prototype.slice.call(message.snapshotMAC) : message.snapshotMAC;
            if (message.patchMAC != null && message.hasOwnProperty("patchMAC"))
                object.patchMAC = options.bytes === String ? $util.base64.encode(message.patchMAC, 0, message.patchMAC.length) : options.bytes === Array ? Array.prototype.slice.call(message.patchMAC) : message.patchMAC;
            if (message.keyID != null && message.hasOwnProperty("keyID"))
                object.keyID = $root.WAServerSync.KeyId.toObject(message.keyID, options);
            if (message.exitCode != null && message.hasOwnProperty("exitCode"))
                object.exitCode = $root.WAServerSync.ExitCode.toObject(message.exitCode, options);
            if (message.deviceIndex != null && message.hasOwnProperty("deviceIndex"))
                object.deviceIndex = message.deviceIndex;
            if (message.clientDebugData != null && message.hasOwnProperty("clientDebugData"))
                object.clientDebugData = options.bytes === String ? $util.base64.encode(message.clientDebugData, 0, message.clientDebugData.length) : options.bytes === Array ? Array.prototype.slice.call(message.clientDebugData) : message.clientDebugData;
            return object;
        };

        /**
         * Converts this SyncdPatch to JSON.
         * @function toJSON
         * @memberof WAServerSync.SyncdPatch
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncdPatch.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncdPatch
         * @function getTypeUrl
         * @memberof WAServerSync.SyncdPatch
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncdPatch.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAServerSync.SyncdPatch";
        };

        return SyncdPatch;
    })();

    return WAServerSync;
})();

module.exports = $root;
