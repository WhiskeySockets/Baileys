/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAMmsRetry = (function() {

    /**
     * Namespace WAMmsRetry.
     * @exports WAMmsRetry
     * @namespace
     */
    var WAMmsRetry = {};

    WAMmsRetry.MediaRetryNotification = (function() {

        /**
         * Properties of a MediaRetryNotification.
         * @memberof WAMmsRetry
         * @interface IMediaRetryNotification
         * @property {string|null} [stanzaID] MediaRetryNotification stanzaID
         * @property {string|null} [directPath] MediaRetryNotification directPath
         * @property {WAMmsRetry.MediaRetryNotification.ResultType|null} [result] MediaRetryNotification result
         */

        /**
         * Constructs a new MediaRetryNotification.
         * @memberof WAMmsRetry
         * @classdesc Represents a MediaRetryNotification.
         * @implements IMediaRetryNotification
         * @constructor
         * @param {WAMmsRetry.IMediaRetryNotification=} [properties] Properties to set
         */
        function MediaRetryNotification(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MediaRetryNotification stanzaID.
         * @member {string} stanzaID
         * @memberof WAMmsRetry.MediaRetryNotification
         * @instance
         */
        MediaRetryNotification.prototype.stanzaID = "";

        /**
         * MediaRetryNotification directPath.
         * @member {string} directPath
         * @memberof WAMmsRetry.MediaRetryNotification
         * @instance
         */
        MediaRetryNotification.prototype.directPath = "";

        /**
         * MediaRetryNotification result.
         * @member {WAMmsRetry.MediaRetryNotification.ResultType} result
         * @memberof WAMmsRetry.MediaRetryNotification
         * @instance
         */
        MediaRetryNotification.prototype.result = 0;

        /**
         * Creates a new MediaRetryNotification instance using the specified properties.
         * @function create
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {WAMmsRetry.IMediaRetryNotification=} [properties] Properties to set
         * @returns {WAMmsRetry.MediaRetryNotification} MediaRetryNotification instance
         */
        MediaRetryNotification.create = function create(properties) {
            return new MediaRetryNotification(properties);
        };

        /**
         * Encodes the specified MediaRetryNotification message. Does not implicitly {@link WAMmsRetry.MediaRetryNotification.verify|verify} messages.
         * @function encode
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {WAMmsRetry.IMediaRetryNotification} message MediaRetryNotification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MediaRetryNotification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stanzaID != null && Object.hasOwnProperty.call(message, "stanzaID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.stanzaID);
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.directPath);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified MediaRetryNotification message, length delimited. Does not implicitly {@link WAMmsRetry.MediaRetryNotification.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {WAMmsRetry.IMediaRetryNotification} message MediaRetryNotification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MediaRetryNotification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MediaRetryNotification message from the specified reader or buffer.
         * @function decode
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAMmsRetry.MediaRetryNotification} MediaRetryNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MediaRetryNotification.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAMmsRetry.MediaRetryNotification();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.stanzaID = reader.string();
                        break;
                    }
                case 2: {
                        message.directPath = reader.string();
                        break;
                    }
                case 3: {
                        message.result = reader.int32();
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
         * Decodes a MediaRetryNotification message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAMmsRetry.MediaRetryNotification} MediaRetryNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MediaRetryNotification.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MediaRetryNotification message.
         * @function verify
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MediaRetryNotification.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stanzaID != null && message.hasOwnProperty("stanzaID"))
                if (!$util.isString(message.stanzaID))
                    return "stanzaID: string expected";
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.result != null && message.hasOwnProperty("result"))
                switch (message.result) {
                default:
                    return "result: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates a MediaRetryNotification message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAMmsRetry.MediaRetryNotification} MediaRetryNotification
         */
        MediaRetryNotification.fromObject = function fromObject(object) {
            if (object instanceof $root.WAMmsRetry.MediaRetryNotification)
                return object;
            var message = new $root.WAMmsRetry.MediaRetryNotification();
            if (object.stanzaID != null)
                message.stanzaID = String(object.stanzaID);
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            switch (object.result) {
            default:
                if (typeof object.result === "number") {
                    message.result = object.result;
                    break;
                }
                break;
            case "GENERAL_ERROR":
            case 0:
                message.result = 0;
                break;
            case "SUCCESS":
            case 1:
                message.result = 1;
                break;
            case "NOT_FOUND":
            case 2:
                message.result = 2;
                break;
            case "DECRYPTION_ERROR":
            case 3:
                message.result = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a MediaRetryNotification message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {WAMmsRetry.MediaRetryNotification} message MediaRetryNotification
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MediaRetryNotification.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.stanzaID = "";
                object.directPath = "";
                object.result = options.enums === String ? "GENERAL_ERROR" : 0;
            }
            if (message.stanzaID != null && message.hasOwnProperty("stanzaID"))
                object.stanzaID = message.stanzaID;
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.WAMmsRetry.MediaRetryNotification.ResultType[message.result] === undefined ? message.result : $root.WAMmsRetry.MediaRetryNotification.ResultType[message.result] : message.result;
            return object;
        };

        /**
         * Converts this MediaRetryNotification to JSON.
         * @function toJSON
         * @memberof WAMmsRetry.MediaRetryNotification
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MediaRetryNotification.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MediaRetryNotification
         * @function getTypeUrl
         * @memberof WAMmsRetry.MediaRetryNotification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MediaRetryNotification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAMmsRetry.MediaRetryNotification";
        };

        /**
         * ResultType enum.
         * @name WAMmsRetry.MediaRetryNotification.ResultType
         * @enum {number}
         * @property {number} GENERAL_ERROR=0 GENERAL_ERROR value
         * @property {number} SUCCESS=1 SUCCESS value
         * @property {number} NOT_FOUND=2 NOT_FOUND value
         * @property {number} DECRYPTION_ERROR=3 DECRYPTION_ERROR value
         */
        MediaRetryNotification.ResultType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "GENERAL_ERROR"] = 0;
            values[valuesById[1] = "SUCCESS"] = 1;
            values[valuesById[2] = "NOT_FOUND"] = 2;
            values[valuesById[3] = "DECRYPTION_ERROR"] = 3;
            return values;
        })();

        return MediaRetryNotification;
    })();

    WAMmsRetry.ServerErrorReceipt = (function() {

        /**
         * Properties of a ServerErrorReceipt.
         * @memberof WAMmsRetry
         * @interface IServerErrorReceipt
         * @property {string|null} [stanzaID] ServerErrorReceipt stanzaID
         */

        /**
         * Constructs a new ServerErrorReceipt.
         * @memberof WAMmsRetry
         * @classdesc Represents a ServerErrorReceipt.
         * @implements IServerErrorReceipt
         * @constructor
         * @param {WAMmsRetry.IServerErrorReceipt=} [properties] Properties to set
         */
        function ServerErrorReceipt(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerErrorReceipt stanzaID.
         * @member {string} stanzaID
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @instance
         */
        ServerErrorReceipt.prototype.stanzaID = "";

        /**
         * Creates a new ServerErrorReceipt instance using the specified properties.
         * @function create
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {WAMmsRetry.IServerErrorReceipt=} [properties] Properties to set
         * @returns {WAMmsRetry.ServerErrorReceipt} ServerErrorReceipt instance
         */
        ServerErrorReceipt.create = function create(properties) {
            return new ServerErrorReceipt(properties);
        };

        /**
         * Encodes the specified ServerErrorReceipt message. Does not implicitly {@link WAMmsRetry.ServerErrorReceipt.verify|verify} messages.
         * @function encode
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {WAMmsRetry.IServerErrorReceipt} message ServerErrorReceipt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerErrorReceipt.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stanzaID != null && Object.hasOwnProperty.call(message, "stanzaID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.stanzaID);
            return writer;
        };

        /**
         * Encodes the specified ServerErrorReceipt message, length delimited. Does not implicitly {@link WAMmsRetry.ServerErrorReceipt.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {WAMmsRetry.IServerErrorReceipt} message ServerErrorReceipt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerErrorReceipt.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerErrorReceipt message from the specified reader or buffer.
         * @function decode
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAMmsRetry.ServerErrorReceipt} ServerErrorReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerErrorReceipt.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAMmsRetry.ServerErrorReceipt();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.stanzaID = reader.string();
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
         * Decodes a ServerErrorReceipt message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAMmsRetry.ServerErrorReceipt} ServerErrorReceipt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerErrorReceipt.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerErrorReceipt message.
         * @function verify
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerErrorReceipt.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stanzaID != null && message.hasOwnProperty("stanzaID"))
                if (!$util.isString(message.stanzaID))
                    return "stanzaID: string expected";
            return null;
        };

        /**
         * Creates a ServerErrorReceipt message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAMmsRetry.ServerErrorReceipt} ServerErrorReceipt
         */
        ServerErrorReceipt.fromObject = function fromObject(object) {
            if (object instanceof $root.WAMmsRetry.ServerErrorReceipt)
                return object;
            var message = new $root.WAMmsRetry.ServerErrorReceipt();
            if (object.stanzaID != null)
                message.stanzaID = String(object.stanzaID);
            return message;
        };

        /**
         * Creates a plain object from a ServerErrorReceipt message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {WAMmsRetry.ServerErrorReceipt} message ServerErrorReceipt
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerErrorReceipt.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.stanzaID = "";
            if (message.stanzaID != null && message.hasOwnProperty("stanzaID"))
                object.stanzaID = message.stanzaID;
            return object;
        };

        /**
         * Converts this ServerErrorReceipt to JSON.
         * @function toJSON
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerErrorReceipt.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerErrorReceipt
         * @function getTypeUrl
         * @memberof WAMmsRetry.ServerErrorReceipt
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerErrorReceipt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAMmsRetry.ServerErrorReceipt";
        };

        return ServerErrorReceipt;
    })();

    return WAMmsRetry;
})();

module.exports = $root;
