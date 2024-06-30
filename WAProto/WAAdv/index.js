/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAAdv = (function() {

    /**
     * Namespace WAAdv.
     * @exports WAAdv
     * @namespace
     */
    var WAAdv = {};

    /**
     * ADVEncryptionType enum.
     * @name WAAdv.ADVEncryptionType
     * @enum {number}
     * @property {number} E2EE=0 E2EE value
     * @property {number} HOSTED=1 HOSTED value
     */
    WAAdv.ADVEncryptionType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "E2EE"] = 0;
        values[valuesById[1] = "HOSTED"] = 1;
        return values;
    })();

    WAAdv.ADVKeyIndexList = (function() {

        /**
         * Properties of a ADVKeyIndexList.
         * @memberof WAAdv
         * @interface IADVKeyIndexList
         * @property {number|null} [rawID] ADVKeyIndexList rawID
         * @property {number|Long|null} [timestamp] ADVKeyIndexList timestamp
         * @property {number|null} [currentIndex] ADVKeyIndexList currentIndex
         * @property {Array.<number>|null} [validIndexes] ADVKeyIndexList validIndexes
         * @property {WAAdv.ADVEncryptionType|null} [accountType] ADVKeyIndexList accountType
         */

        /**
         * Constructs a new ADVKeyIndexList.
         * @memberof WAAdv
         * @classdesc Represents a ADVKeyIndexList.
         * @implements IADVKeyIndexList
         * @constructor
         * @param {WAAdv.IADVKeyIndexList=} [properties] Properties to set
         */
        function ADVKeyIndexList(properties) {
            this.validIndexes = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ADVKeyIndexList rawID.
         * @member {number} rawID
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         */
        ADVKeyIndexList.prototype.rawID = 0;

        /**
         * ADVKeyIndexList timestamp.
         * @member {number|Long} timestamp
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         */
        ADVKeyIndexList.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ADVKeyIndexList currentIndex.
         * @member {number} currentIndex
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         */
        ADVKeyIndexList.prototype.currentIndex = 0;

        /**
         * ADVKeyIndexList validIndexes.
         * @member {Array.<number>} validIndexes
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         */
        ADVKeyIndexList.prototype.validIndexes = $util.emptyArray;

        /**
         * ADVKeyIndexList accountType.
         * @member {WAAdv.ADVEncryptionType} accountType
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         */
        ADVKeyIndexList.prototype.accountType = 0;

        /**
         * Creates a new ADVKeyIndexList instance using the specified properties.
         * @function create
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {WAAdv.IADVKeyIndexList=} [properties] Properties to set
         * @returns {WAAdv.ADVKeyIndexList} ADVKeyIndexList instance
         */
        ADVKeyIndexList.create = function create(properties) {
            return new ADVKeyIndexList(properties);
        };

        /**
         * Encodes the specified ADVKeyIndexList message. Does not implicitly {@link WAAdv.ADVKeyIndexList.verify|verify} messages.
         * @function encode
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {WAAdv.IADVKeyIndexList} message ADVKeyIndexList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVKeyIndexList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rawID != null && Object.hasOwnProperty.call(message, "rawID"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rawID);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.currentIndex != null && Object.hasOwnProperty.call(message, "currentIndex"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.currentIndex);
            if (message.validIndexes != null && message.validIndexes.length) {
                writer.uint32(/* id 4, wireType 2 =*/34).fork();
                for (var i = 0; i < message.validIndexes.length; ++i)
                    writer.uint32(message.validIndexes[i]);
                writer.ldelim();
            }
            if (message.accountType != null && Object.hasOwnProperty.call(message, "accountType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.accountType);
            return writer;
        };

        /**
         * Encodes the specified ADVKeyIndexList message, length delimited. Does not implicitly {@link WAAdv.ADVKeyIndexList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {WAAdv.IADVKeyIndexList} message ADVKeyIndexList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVKeyIndexList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ADVKeyIndexList message from the specified reader or buffer.
         * @function decode
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAAdv.ADVKeyIndexList} ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVKeyIndexList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAAdv.ADVKeyIndexList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rawID = reader.uint32();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 3: {
                        message.currentIndex = reader.uint32();
                        break;
                    }
                case 4: {
                        if (!(message.validIndexes && message.validIndexes.length))
                            message.validIndexes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.validIndexes.push(reader.uint32());
                        } else
                            message.validIndexes.push(reader.uint32());
                        break;
                    }
                case 5: {
                        message.accountType = reader.int32();
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
         * Decodes a ADVKeyIndexList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAAdv.ADVKeyIndexList} ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVKeyIndexList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ADVKeyIndexList message.
         * @function verify
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ADVKeyIndexList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rawID != null && message.hasOwnProperty("rawID"))
                if (!$util.isInteger(message.rawID))
                    return "rawID: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.currentIndex != null && message.hasOwnProperty("currentIndex"))
                if (!$util.isInteger(message.currentIndex))
                    return "currentIndex: integer expected";
            if (message.validIndexes != null && message.hasOwnProperty("validIndexes")) {
                if (!Array.isArray(message.validIndexes))
                    return "validIndexes: array expected";
                for (var i = 0; i < message.validIndexes.length; ++i)
                    if (!$util.isInteger(message.validIndexes[i]))
                        return "validIndexes: integer[] expected";
            }
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                switch (message.accountType) {
                default:
                    return "accountType: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a ADVKeyIndexList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAAdv.ADVKeyIndexList} ADVKeyIndexList
         */
        ADVKeyIndexList.fromObject = function fromObject(object) {
            if (object instanceof $root.WAAdv.ADVKeyIndexList)
                return object;
            var message = new $root.WAAdv.ADVKeyIndexList();
            if (object.rawID != null)
                message.rawID = object.rawID >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.currentIndex != null)
                message.currentIndex = object.currentIndex >>> 0;
            if (object.validIndexes) {
                if (!Array.isArray(object.validIndexes))
                    throw TypeError(".WAAdv.ADVKeyIndexList.validIndexes: array expected");
                message.validIndexes = [];
                for (var i = 0; i < object.validIndexes.length; ++i)
                    message.validIndexes[i] = object.validIndexes[i] >>> 0;
            }
            switch (object.accountType) {
            default:
                if (typeof object.accountType === "number") {
                    message.accountType = object.accountType;
                    break;
                }
                break;
            case "E2EE":
            case 0:
                message.accountType = 0;
                break;
            case "HOSTED":
            case 1:
                message.accountType = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ADVKeyIndexList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {WAAdv.ADVKeyIndexList} message ADVKeyIndexList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ADVKeyIndexList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.validIndexes = [];
            if (options.defaults) {
                object.rawID = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.currentIndex = 0;
                object.accountType = options.enums === String ? "E2EE" : 0;
            }
            if (message.rawID != null && message.hasOwnProperty("rawID"))
                object.rawID = message.rawID;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.currentIndex != null && message.hasOwnProperty("currentIndex"))
                object.currentIndex = message.currentIndex;
            if (message.validIndexes && message.validIndexes.length) {
                object.validIndexes = [];
                for (var j = 0; j < message.validIndexes.length; ++j)
                    object.validIndexes[j] = message.validIndexes[j];
            }
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                object.accountType = options.enums === String ? $root.WAAdv.ADVEncryptionType[message.accountType] === undefined ? message.accountType : $root.WAAdv.ADVEncryptionType[message.accountType] : message.accountType;
            return object;
        };

        /**
         * Converts this ADVKeyIndexList to JSON.
         * @function toJSON
         * @memberof WAAdv.ADVKeyIndexList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ADVKeyIndexList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ADVKeyIndexList
         * @function getTypeUrl
         * @memberof WAAdv.ADVKeyIndexList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ADVKeyIndexList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAAdv.ADVKeyIndexList";
        };

        return ADVKeyIndexList;
    })();

    WAAdv.ADVSignedKeyIndexList = (function() {

        /**
         * Properties of a ADVSignedKeyIndexList.
         * @memberof WAAdv
         * @interface IADVSignedKeyIndexList
         * @property {Uint8Array|null} [details] ADVSignedKeyIndexList details
         * @property {Uint8Array|null} [accountSignature] ADVSignedKeyIndexList accountSignature
         * @property {Uint8Array|null} [accountSignatureKey] ADVSignedKeyIndexList accountSignatureKey
         */

        /**
         * Constructs a new ADVSignedKeyIndexList.
         * @memberof WAAdv
         * @classdesc Represents a ADVSignedKeyIndexList.
         * @implements IADVSignedKeyIndexList
         * @constructor
         * @param {WAAdv.IADVSignedKeyIndexList=} [properties] Properties to set
         */
        function ADVSignedKeyIndexList(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ADVSignedKeyIndexList details.
         * @member {Uint8Array} details
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @instance
         */
        ADVSignedKeyIndexList.prototype.details = $util.newBuffer([]);

        /**
         * ADVSignedKeyIndexList accountSignature.
         * @member {Uint8Array} accountSignature
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @instance
         */
        ADVSignedKeyIndexList.prototype.accountSignature = $util.newBuffer([]);

        /**
         * ADVSignedKeyIndexList accountSignatureKey.
         * @member {Uint8Array} accountSignatureKey
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @instance
         */
        ADVSignedKeyIndexList.prototype.accountSignatureKey = $util.newBuffer([]);

        /**
         * Creates a new ADVSignedKeyIndexList instance using the specified properties.
         * @function create
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {WAAdv.IADVSignedKeyIndexList=} [properties] Properties to set
         * @returns {WAAdv.ADVSignedKeyIndexList} ADVSignedKeyIndexList instance
         */
        ADVSignedKeyIndexList.create = function create(properties) {
            return new ADVSignedKeyIndexList(properties);
        };

        /**
         * Encodes the specified ADVSignedKeyIndexList message. Does not implicitly {@link WAAdv.ADVSignedKeyIndexList.verify|verify} messages.
         * @function encode
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {WAAdv.IADVSignedKeyIndexList} message ADVSignedKeyIndexList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedKeyIndexList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
            if (message.accountSignature != null && Object.hasOwnProperty.call(message, "accountSignature"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.accountSignature);
            if (message.accountSignatureKey != null && Object.hasOwnProperty.call(message, "accountSignatureKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.accountSignatureKey);
            return writer;
        };

        /**
         * Encodes the specified ADVSignedKeyIndexList message, length delimited. Does not implicitly {@link WAAdv.ADVSignedKeyIndexList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {WAAdv.IADVSignedKeyIndexList} message ADVSignedKeyIndexList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedKeyIndexList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ADVSignedKeyIndexList message from the specified reader or buffer.
         * @function decode
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAAdv.ADVSignedKeyIndexList} ADVSignedKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedKeyIndexList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAAdv.ADVSignedKeyIndexList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.details = reader.bytes();
                        break;
                    }
                case 2: {
                        message.accountSignature = reader.bytes();
                        break;
                    }
                case 3: {
                        message.accountSignatureKey = reader.bytes();
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
         * Decodes a ADVSignedKeyIndexList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAAdv.ADVSignedKeyIndexList} ADVSignedKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedKeyIndexList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ADVSignedKeyIndexList message.
         * @function verify
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ADVSignedKeyIndexList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details"))
                if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                    return "details: buffer expected";
            if (message.accountSignature != null && message.hasOwnProperty("accountSignature"))
                if (!(message.accountSignature && typeof message.accountSignature.length === "number" || $util.isString(message.accountSignature)))
                    return "accountSignature: buffer expected";
            if (message.accountSignatureKey != null && message.hasOwnProperty("accountSignatureKey"))
                if (!(message.accountSignatureKey && typeof message.accountSignatureKey.length === "number" || $util.isString(message.accountSignatureKey)))
                    return "accountSignatureKey: buffer expected";
            return null;
        };

        /**
         * Creates a ADVSignedKeyIndexList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAAdv.ADVSignedKeyIndexList} ADVSignedKeyIndexList
         */
        ADVSignedKeyIndexList.fromObject = function fromObject(object) {
            if (object instanceof $root.WAAdv.ADVSignedKeyIndexList)
                return object;
            var message = new $root.WAAdv.ADVSignedKeyIndexList();
            if (object.details != null)
                if (typeof object.details === "string")
                    $util.base64.decode(object.details, message.details = $util.newBuffer($util.base64.length(object.details)), 0);
                else if (object.details.length >= 0)
                    message.details = object.details;
            if (object.accountSignature != null)
                if (typeof object.accountSignature === "string")
                    $util.base64.decode(object.accountSignature, message.accountSignature = $util.newBuffer($util.base64.length(object.accountSignature)), 0);
                else if (object.accountSignature.length >= 0)
                    message.accountSignature = object.accountSignature;
            if (object.accountSignatureKey != null)
                if (typeof object.accountSignatureKey === "string")
                    $util.base64.decode(object.accountSignatureKey, message.accountSignatureKey = $util.newBuffer($util.base64.length(object.accountSignatureKey)), 0);
                else if (object.accountSignatureKey.length >= 0)
                    message.accountSignatureKey = object.accountSignatureKey;
            return message;
        };

        /**
         * Creates a plain object from a ADVSignedKeyIndexList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {WAAdv.ADVSignedKeyIndexList} message ADVSignedKeyIndexList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ADVSignedKeyIndexList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.details = "";
                else {
                    object.details = [];
                    if (options.bytes !== Array)
                        object.details = $util.newBuffer(object.details);
                }
                if (options.bytes === String)
                    object.accountSignature = "";
                else {
                    object.accountSignature = [];
                    if (options.bytes !== Array)
                        object.accountSignature = $util.newBuffer(object.accountSignature);
                }
                if (options.bytes === String)
                    object.accountSignatureKey = "";
                else {
                    object.accountSignatureKey = [];
                    if (options.bytes !== Array)
                        object.accountSignatureKey = $util.newBuffer(object.accountSignatureKey);
                }
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
            if (message.accountSignature != null && message.hasOwnProperty("accountSignature"))
                object.accountSignature = options.bytes === String ? $util.base64.encode(message.accountSignature, 0, message.accountSignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.accountSignature) : message.accountSignature;
            if (message.accountSignatureKey != null && message.hasOwnProperty("accountSignatureKey"))
                object.accountSignatureKey = options.bytes === String ? $util.base64.encode(message.accountSignatureKey, 0, message.accountSignatureKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.accountSignatureKey) : message.accountSignatureKey;
            return object;
        };

        /**
         * Converts this ADVSignedKeyIndexList to JSON.
         * @function toJSON
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ADVSignedKeyIndexList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ADVSignedKeyIndexList
         * @function getTypeUrl
         * @memberof WAAdv.ADVSignedKeyIndexList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ADVSignedKeyIndexList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAAdv.ADVSignedKeyIndexList";
        };

        return ADVSignedKeyIndexList;
    })();

    WAAdv.ADVDeviceIdentity = (function() {

        /**
         * Properties of a ADVDeviceIdentity.
         * @memberof WAAdv
         * @interface IADVDeviceIdentity
         * @property {number|null} [rawID] ADVDeviceIdentity rawID
         * @property {number|Long|null} [timestamp] ADVDeviceIdentity timestamp
         * @property {number|null} [keyIndex] ADVDeviceIdentity keyIndex
         * @property {WAAdv.ADVEncryptionType|null} [accountType] ADVDeviceIdentity accountType
         * @property {WAAdv.ADVEncryptionType|null} [deviceType] ADVDeviceIdentity deviceType
         */

        /**
         * Constructs a new ADVDeviceIdentity.
         * @memberof WAAdv
         * @classdesc Represents a ADVDeviceIdentity.
         * @implements IADVDeviceIdentity
         * @constructor
         * @param {WAAdv.IADVDeviceIdentity=} [properties] Properties to set
         */
        function ADVDeviceIdentity(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ADVDeviceIdentity rawID.
         * @member {number} rawID
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         */
        ADVDeviceIdentity.prototype.rawID = 0;

        /**
         * ADVDeviceIdentity timestamp.
         * @member {number|Long} timestamp
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         */
        ADVDeviceIdentity.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ADVDeviceIdentity keyIndex.
         * @member {number} keyIndex
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         */
        ADVDeviceIdentity.prototype.keyIndex = 0;

        /**
         * ADVDeviceIdentity accountType.
         * @member {WAAdv.ADVEncryptionType} accountType
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         */
        ADVDeviceIdentity.prototype.accountType = 0;

        /**
         * ADVDeviceIdentity deviceType.
         * @member {WAAdv.ADVEncryptionType} deviceType
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         */
        ADVDeviceIdentity.prototype.deviceType = 0;

        /**
         * Creates a new ADVDeviceIdentity instance using the specified properties.
         * @function create
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {WAAdv.IADVDeviceIdentity=} [properties] Properties to set
         * @returns {WAAdv.ADVDeviceIdentity} ADVDeviceIdentity instance
         */
        ADVDeviceIdentity.create = function create(properties) {
            return new ADVDeviceIdentity(properties);
        };

        /**
         * Encodes the specified ADVDeviceIdentity message. Does not implicitly {@link WAAdv.ADVDeviceIdentity.verify|verify} messages.
         * @function encode
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {WAAdv.IADVDeviceIdentity} message ADVDeviceIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVDeviceIdentity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rawID != null && Object.hasOwnProperty.call(message, "rawID"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rawID);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.keyIndex != null && Object.hasOwnProperty.call(message, "keyIndex"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.keyIndex);
            if (message.accountType != null && Object.hasOwnProperty.call(message, "accountType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.accountType);
            if (message.deviceType != null && Object.hasOwnProperty.call(message, "deviceType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.deviceType);
            return writer;
        };

        /**
         * Encodes the specified ADVDeviceIdentity message, length delimited. Does not implicitly {@link WAAdv.ADVDeviceIdentity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {WAAdv.IADVDeviceIdentity} message ADVDeviceIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVDeviceIdentity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer.
         * @function decode
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAAdv.ADVDeviceIdentity} ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVDeviceIdentity.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAAdv.ADVDeviceIdentity();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rawID = reader.uint32();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 3: {
                        message.keyIndex = reader.uint32();
                        break;
                    }
                case 4: {
                        message.accountType = reader.int32();
                        break;
                    }
                case 5: {
                        message.deviceType = reader.int32();
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
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAAdv.ADVDeviceIdentity} ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVDeviceIdentity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ADVDeviceIdentity message.
         * @function verify
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ADVDeviceIdentity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rawID != null && message.hasOwnProperty("rawID"))
                if (!$util.isInteger(message.rawID))
                    return "rawID: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.keyIndex != null && message.hasOwnProperty("keyIndex"))
                if (!$util.isInteger(message.keyIndex))
                    return "keyIndex: integer expected";
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                switch (message.accountType) {
                default:
                    return "accountType: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                switch (message.deviceType) {
                default:
                    return "deviceType: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a ADVDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAAdv.ADVDeviceIdentity} ADVDeviceIdentity
         */
        ADVDeviceIdentity.fromObject = function fromObject(object) {
            if (object instanceof $root.WAAdv.ADVDeviceIdentity)
                return object;
            var message = new $root.WAAdv.ADVDeviceIdentity();
            if (object.rawID != null)
                message.rawID = object.rawID >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.keyIndex != null)
                message.keyIndex = object.keyIndex >>> 0;
            switch (object.accountType) {
            default:
                if (typeof object.accountType === "number") {
                    message.accountType = object.accountType;
                    break;
                }
                break;
            case "E2EE":
            case 0:
                message.accountType = 0;
                break;
            case "HOSTED":
            case 1:
                message.accountType = 1;
                break;
            }
            switch (object.deviceType) {
            default:
                if (typeof object.deviceType === "number") {
                    message.deviceType = object.deviceType;
                    break;
                }
                break;
            case "E2EE":
            case 0:
                message.deviceType = 0;
                break;
            case "HOSTED":
            case 1:
                message.deviceType = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ADVDeviceIdentity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {WAAdv.ADVDeviceIdentity} message ADVDeviceIdentity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ADVDeviceIdentity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.rawID = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.keyIndex = 0;
                object.accountType = options.enums === String ? "E2EE" : 0;
                object.deviceType = options.enums === String ? "E2EE" : 0;
            }
            if (message.rawID != null && message.hasOwnProperty("rawID"))
                object.rawID = message.rawID;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.keyIndex != null && message.hasOwnProperty("keyIndex"))
                object.keyIndex = message.keyIndex;
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                object.accountType = options.enums === String ? $root.WAAdv.ADVEncryptionType[message.accountType] === undefined ? message.accountType : $root.WAAdv.ADVEncryptionType[message.accountType] : message.accountType;
            if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                object.deviceType = options.enums === String ? $root.WAAdv.ADVEncryptionType[message.deviceType] === undefined ? message.deviceType : $root.WAAdv.ADVEncryptionType[message.deviceType] : message.deviceType;
            return object;
        };

        /**
         * Converts this ADVDeviceIdentity to JSON.
         * @function toJSON
         * @memberof WAAdv.ADVDeviceIdentity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ADVDeviceIdentity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ADVDeviceIdentity
         * @function getTypeUrl
         * @memberof WAAdv.ADVDeviceIdentity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ADVDeviceIdentity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAAdv.ADVDeviceIdentity";
        };

        return ADVDeviceIdentity;
    })();

    WAAdv.ADVSignedDeviceIdentity = (function() {

        /**
         * Properties of a ADVSignedDeviceIdentity.
         * @memberof WAAdv
         * @interface IADVSignedDeviceIdentity
         * @property {Uint8Array|null} [details] ADVSignedDeviceIdentity details
         * @property {Uint8Array|null} [accountSignatureKey] ADVSignedDeviceIdentity accountSignatureKey
         * @property {Uint8Array|null} [accountSignature] ADVSignedDeviceIdentity accountSignature
         * @property {Uint8Array|null} [deviceSignature] ADVSignedDeviceIdentity deviceSignature
         */

        /**
         * Constructs a new ADVSignedDeviceIdentity.
         * @memberof WAAdv
         * @classdesc Represents a ADVSignedDeviceIdentity.
         * @implements IADVSignedDeviceIdentity
         * @constructor
         * @param {WAAdv.IADVSignedDeviceIdentity=} [properties] Properties to set
         */
        function ADVSignedDeviceIdentity(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ADVSignedDeviceIdentity details.
         * @member {Uint8Array} details
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @instance
         */
        ADVSignedDeviceIdentity.prototype.details = $util.newBuffer([]);

        /**
         * ADVSignedDeviceIdentity accountSignatureKey.
         * @member {Uint8Array} accountSignatureKey
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @instance
         */
        ADVSignedDeviceIdentity.prototype.accountSignatureKey = $util.newBuffer([]);

        /**
         * ADVSignedDeviceIdentity accountSignature.
         * @member {Uint8Array} accountSignature
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @instance
         */
        ADVSignedDeviceIdentity.prototype.accountSignature = $util.newBuffer([]);

        /**
         * ADVSignedDeviceIdentity deviceSignature.
         * @member {Uint8Array} deviceSignature
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @instance
         */
        ADVSignedDeviceIdentity.prototype.deviceSignature = $util.newBuffer([]);

        /**
         * Creates a new ADVSignedDeviceIdentity instance using the specified properties.
         * @function create
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentity=} [properties] Properties to set
         * @returns {WAAdv.ADVSignedDeviceIdentity} ADVSignedDeviceIdentity instance
         */
        ADVSignedDeviceIdentity.create = function create(properties) {
            return new ADVSignedDeviceIdentity(properties);
        };

        /**
         * Encodes the specified ADVSignedDeviceIdentity message. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentity.verify|verify} messages.
         * @function encode
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentity} message ADVSignedDeviceIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedDeviceIdentity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
            if (message.accountSignatureKey != null && Object.hasOwnProperty.call(message, "accountSignatureKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.accountSignatureKey);
            if (message.accountSignature != null && Object.hasOwnProperty.call(message, "accountSignature"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.accountSignature);
            if (message.deviceSignature != null && Object.hasOwnProperty.call(message, "deviceSignature"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.deviceSignature);
            return writer;
        };

        /**
         * Encodes the specified ADVSignedDeviceIdentity message, length delimited. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentity} message ADVSignedDeviceIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedDeviceIdentity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer.
         * @function decode
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAAdv.ADVSignedDeviceIdentity} ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedDeviceIdentity.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAAdv.ADVSignedDeviceIdentity();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.details = reader.bytes();
                        break;
                    }
                case 2: {
                        message.accountSignatureKey = reader.bytes();
                        break;
                    }
                case 3: {
                        message.accountSignature = reader.bytes();
                        break;
                    }
                case 4: {
                        message.deviceSignature = reader.bytes();
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
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAAdv.ADVSignedDeviceIdentity} ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedDeviceIdentity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ADVSignedDeviceIdentity message.
         * @function verify
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ADVSignedDeviceIdentity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details"))
                if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                    return "details: buffer expected";
            if (message.accountSignatureKey != null && message.hasOwnProperty("accountSignatureKey"))
                if (!(message.accountSignatureKey && typeof message.accountSignatureKey.length === "number" || $util.isString(message.accountSignatureKey)))
                    return "accountSignatureKey: buffer expected";
            if (message.accountSignature != null && message.hasOwnProperty("accountSignature"))
                if (!(message.accountSignature && typeof message.accountSignature.length === "number" || $util.isString(message.accountSignature)))
                    return "accountSignature: buffer expected";
            if (message.deviceSignature != null && message.hasOwnProperty("deviceSignature"))
                if (!(message.deviceSignature && typeof message.deviceSignature.length === "number" || $util.isString(message.deviceSignature)))
                    return "deviceSignature: buffer expected";
            return null;
        };

        /**
         * Creates a ADVSignedDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAAdv.ADVSignedDeviceIdentity} ADVSignedDeviceIdentity
         */
        ADVSignedDeviceIdentity.fromObject = function fromObject(object) {
            if (object instanceof $root.WAAdv.ADVSignedDeviceIdentity)
                return object;
            var message = new $root.WAAdv.ADVSignedDeviceIdentity();
            if (object.details != null)
                if (typeof object.details === "string")
                    $util.base64.decode(object.details, message.details = $util.newBuffer($util.base64.length(object.details)), 0);
                else if (object.details.length >= 0)
                    message.details = object.details;
            if (object.accountSignatureKey != null)
                if (typeof object.accountSignatureKey === "string")
                    $util.base64.decode(object.accountSignatureKey, message.accountSignatureKey = $util.newBuffer($util.base64.length(object.accountSignatureKey)), 0);
                else if (object.accountSignatureKey.length >= 0)
                    message.accountSignatureKey = object.accountSignatureKey;
            if (object.accountSignature != null)
                if (typeof object.accountSignature === "string")
                    $util.base64.decode(object.accountSignature, message.accountSignature = $util.newBuffer($util.base64.length(object.accountSignature)), 0);
                else if (object.accountSignature.length >= 0)
                    message.accountSignature = object.accountSignature;
            if (object.deviceSignature != null)
                if (typeof object.deviceSignature === "string")
                    $util.base64.decode(object.deviceSignature, message.deviceSignature = $util.newBuffer($util.base64.length(object.deviceSignature)), 0);
                else if (object.deviceSignature.length >= 0)
                    message.deviceSignature = object.deviceSignature;
            return message;
        };

        /**
         * Creates a plain object from a ADVSignedDeviceIdentity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {WAAdv.ADVSignedDeviceIdentity} message ADVSignedDeviceIdentity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ADVSignedDeviceIdentity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.details = "";
                else {
                    object.details = [];
                    if (options.bytes !== Array)
                        object.details = $util.newBuffer(object.details);
                }
                if (options.bytes === String)
                    object.accountSignatureKey = "";
                else {
                    object.accountSignatureKey = [];
                    if (options.bytes !== Array)
                        object.accountSignatureKey = $util.newBuffer(object.accountSignatureKey);
                }
                if (options.bytes === String)
                    object.accountSignature = "";
                else {
                    object.accountSignature = [];
                    if (options.bytes !== Array)
                        object.accountSignature = $util.newBuffer(object.accountSignature);
                }
                if (options.bytes === String)
                    object.deviceSignature = "";
                else {
                    object.deviceSignature = [];
                    if (options.bytes !== Array)
                        object.deviceSignature = $util.newBuffer(object.deviceSignature);
                }
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
            if (message.accountSignatureKey != null && message.hasOwnProperty("accountSignatureKey"))
                object.accountSignatureKey = options.bytes === String ? $util.base64.encode(message.accountSignatureKey, 0, message.accountSignatureKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.accountSignatureKey) : message.accountSignatureKey;
            if (message.accountSignature != null && message.hasOwnProperty("accountSignature"))
                object.accountSignature = options.bytes === String ? $util.base64.encode(message.accountSignature, 0, message.accountSignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.accountSignature) : message.accountSignature;
            if (message.deviceSignature != null && message.hasOwnProperty("deviceSignature"))
                object.deviceSignature = options.bytes === String ? $util.base64.encode(message.deviceSignature, 0, message.deviceSignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.deviceSignature) : message.deviceSignature;
            return object;
        };

        /**
         * Converts this ADVSignedDeviceIdentity to JSON.
         * @function toJSON
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ADVSignedDeviceIdentity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ADVSignedDeviceIdentity
         * @function getTypeUrl
         * @memberof WAAdv.ADVSignedDeviceIdentity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ADVSignedDeviceIdentity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAAdv.ADVSignedDeviceIdentity";
        };

        return ADVSignedDeviceIdentity;
    })();

    WAAdv.ADVSignedDeviceIdentityHMAC = (function() {

        /**
         * Properties of a ADVSignedDeviceIdentityHMAC.
         * @memberof WAAdv
         * @interface IADVSignedDeviceIdentityHMAC
         * @property {Uint8Array|null} [details] ADVSignedDeviceIdentityHMAC details
         * @property {Uint8Array|null} [HMAC] ADVSignedDeviceIdentityHMAC HMAC
         * @property {WAAdv.ADVEncryptionType|null} [accountType] ADVSignedDeviceIdentityHMAC accountType
         */

        /**
         * Constructs a new ADVSignedDeviceIdentityHMAC.
         * @memberof WAAdv
         * @classdesc Represents a ADVSignedDeviceIdentityHMAC.
         * @implements IADVSignedDeviceIdentityHMAC
         * @constructor
         * @param {WAAdv.IADVSignedDeviceIdentityHMAC=} [properties] Properties to set
         */
        function ADVSignedDeviceIdentityHMAC(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ADVSignedDeviceIdentityHMAC details.
         * @member {Uint8Array} details
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @instance
         */
        ADVSignedDeviceIdentityHMAC.prototype.details = $util.newBuffer([]);

        /**
         * ADVSignedDeviceIdentityHMAC HMAC.
         * @member {Uint8Array} HMAC
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @instance
         */
        ADVSignedDeviceIdentityHMAC.prototype.HMAC = $util.newBuffer([]);

        /**
         * ADVSignedDeviceIdentityHMAC accountType.
         * @member {WAAdv.ADVEncryptionType} accountType
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @instance
         */
        ADVSignedDeviceIdentityHMAC.prototype.accountType = 0;

        /**
         * Creates a new ADVSignedDeviceIdentityHMAC instance using the specified properties.
         * @function create
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentityHMAC=} [properties] Properties to set
         * @returns {WAAdv.ADVSignedDeviceIdentityHMAC} ADVSignedDeviceIdentityHMAC instance
         */
        ADVSignedDeviceIdentityHMAC.create = function create(properties) {
            return new ADVSignedDeviceIdentityHMAC(properties);
        };

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @function encode
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentityHMAC} message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedDeviceIdentityHMAC.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
            if (message.HMAC != null && Object.hasOwnProperty.call(message, "HMAC"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.HMAC);
            if (message.accountType != null && Object.hasOwnProperty.call(message, "accountType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.accountType);
            return writer;
        };

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message, length delimited. Does not implicitly {@link WAAdv.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {WAAdv.IADVSignedDeviceIdentityHMAC} message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ADVSignedDeviceIdentityHMAC.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer.
         * @function decode
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAAdv.ADVSignedDeviceIdentityHMAC} ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedDeviceIdentityHMAC.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAAdv.ADVSignedDeviceIdentityHMAC();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.details = reader.bytes();
                        break;
                    }
                case 2: {
                        message.HMAC = reader.bytes();
                        break;
                    }
                case 3: {
                        message.accountType = reader.int32();
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
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAAdv.ADVSignedDeviceIdentityHMAC} ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ADVSignedDeviceIdentityHMAC.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ADVSignedDeviceIdentityHMAC message.
         * @function verify
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ADVSignedDeviceIdentityHMAC.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details"))
                if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                    return "details: buffer expected";
            if (message.HMAC != null && message.hasOwnProperty("HMAC"))
                if (!(message.HMAC && typeof message.HMAC.length === "number" || $util.isString(message.HMAC)))
                    return "HMAC: buffer expected";
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                switch (message.accountType) {
                default:
                    return "accountType: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a ADVSignedDeviceIdentityHMAC message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAAdv.ADVSignedDeviceIdentityHMAC} ADVSignedDeviceIdentityHMAC
         */
        ADVSignedDeviceIdentityHMAC.fromObject = function fromObject(object) {
            if (object instanceof $root.WAAdv.ADVSignedDeviceIdentityHMAC)
                return object;
            var message = new $root.WAAdv.ADVSignedDeviceIdentityHMAC();
            if (object.details != null)
                if (typeof object.details === "string")
                    $util.base64.decode(object.details, message.details = $util.newBuffer($util.base64.length(object.details)), 0);
                else if (object.details.length >= 0)
                    message.details = object.details;
            if (object.HMAC != null)
                if (typeof object.HMAC === "string")
                    $util.base64.decode(object.HMAC, message.HMAC = $util.newBuffer($util.base64.length(object.HMAC)), 0);
                else if (object.HMAC.length >= 0)
                    message.HMAC = object.HMAC;
            switch (object.accountType) {
            default:
                if (typeof object.accountType === "number") {
                    message.accountType = object.accountType;
                    break;
                }
                break;
            case "E2EE":
            case 0:
                message.accountType = 0;
                break;
            case "HOSTED":
            case 1:
                message.accountType = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ADVSignedDeviceIdentityHMAC message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {WAAdv.ADVSignedDeviceIdentityHMAC} message ADVSignedDeviceIdentityHMAC
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ADVSignedDeviceIdentityHMAC.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.details = "";
                else {
                    object.details = [];
                    if (options.bytes !== Array)
                        object.details = $util.newBuffer(object.details);
                }
                if (options.bytes === String)
                    object.HMAC = "";
                else {
                    object.HMAC = [];
                    if (options.bytes !== Array)
                        object.HMAC = $util.newBuffer(object.HMAC);
                }
                object.accountType = options.enums === String ? "E2EE" : 0;
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
            if (message.HMAC != null && message.hasOwnProperty("HMAC"))
                object.HMAC = options.bytes === String ? $util.base64.encode(message.HMAC, 0, message.HMAC.length) : options.bytes === Array ? Array.prototype.slice.call(message.HMAC) : message.HMAC;
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                object.accountType = options.enums === String ? $root.WAAdv.ADVEncryptionType[message.accountType] === undefined ? message.accountType : $root.WAAdv.ADVEncryptionType[message.accountType] : message.accountType;
            return object;
        };

        /**
         * Converts this ADVSignedDeviceIdentityHMAC to JSON.
         * @function toJSON
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ADVSignedDeviceIdentityHMAC.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ADVSignedDeviceIdentityHMAC
         * @function getTypeUrl
         * @memberof WAAdv.ADVSignedDeviceIdentityHMAC
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ADVSignedDeviceIdentityHMAC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAAdv.ADVSignedDeviceIdentityHMAC";
        };

        return ADVSignedDeviceIdentityHMAC;
    })();

    return WAAdv;
})();

module.exports = $root;
