/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAChatLockSettings = (function() {

    /**
     * Namespace WAChatLockSettings.
     * @exports WAChatLockSettings
     * @namespace
     */
    var WAChatLockSettings = {};

    WAChatLockSettings.ChatLockSettings = (function() {

        /**
         * Properties of a ChatLockSettings.
         * @memberof WAChatLockSettings
         * @interface IChatLockSettings
         * @property {boolean|null} [hideLockedChats] ChatLockSettings hideLockedChats
         * @property {WAUserPassword.IUserPassword|null} [secretCode] ChatLockSettings secretCode
         */

        /**
         * Constructs a new ChatLockSettings.
         * @memberof WAChatLockSettings
         * @classdesc Represents a ChatLockSettings.
         * @implements IChatLockSettings
         * @constructor
         * @param {WAChatLockSettings.IChatLockSettings=} [properties] Properties to set
         */
        function ChatLockSettings(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatLockSettings hideLockedChats.
         * @member {boolean} hideLockedChats
         * @memberof WAChatLockSettings.ChatLockSettings
         * @instance
         */
        ChatLockSettings.prototype.hideLockedChats = false;

        /**
         * ChatLockSettings secretCode.
         * @member {WAUserPassword.IUserPassword|null|undefined} secretCode
         * @memberof WAChatLockSettings.ChatLockSettings
         * @instance
         */
        ChatLockSettings.prototype.secretCode = null;

        /**
         * Creates a new ChatLockSettings instance using the specified properties.
         * @function create
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {WAChatLockSettings.IChatLockSettings=} [properties] Properties to set
         * @returns {WAChatLockSettings.ChatLockSettings} ChatLockSettings instance
         */
        ChatLockSettings.create = function create(properties) {
            return new ChatLockSettings(properties);
        };

        /**
         * Encodes the specified ChatLockSettings message. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @function encode
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {WAChatLockSettings.IChatLockSettings} message ChatLockSettings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatLockSettings.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hideLockedChats != null && Object.hasOwnProperty.call(message, "hideLockedChats"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.hideLockedChats);
            if (message.secretCode != null && Object.hasOwnProperty.call(message, "secretCode"))
                $root.WAUserPassword.UserPassword.encode(message.secretCode, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ChatLockSettings message, length delimited. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {WAChatLockSettings.IChatLockSettings} message ChatLockSettings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatLockSettings.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatLockSettings message from the specified reader or buffer.
         * @function decode
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAChatLockSettings.ChatLockSettings} ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatLockSettings.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAChatLockSettings.ChatLockSettings();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.hideLockedChats = reader.bool();
                        break;
                    }
                case 2: {
                        message.secretCode = $root.WAUserPassword.UserPassword.decode(reader, reader.uint32());
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
         * Decodes a ChatLockSettings message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAChatLockSettings.ChatLockSettings} ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatLockSettings.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatLockSettings message.
         * @function verify
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatLockSettings.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hideLockedChats != null && message.hasOwnProperty("hideLockedChats"))
                if (typeof message.hideLockedChats !== "boolean")
                    return "hideLockedChats: boolean expected";
            if (message.secretCode != null && message.hasOwnProperty("secretCode")) {
                var error = $root.WAUserPassword.UserPassword.verify(message.secretCode);
                if (error)
                    return "secretCode." + error;
            }
            return null;
        };

        /**
         * Creates a ChatLockSettings message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAChatLockSettings.ChatLockSettings} ChatLockSettings
         */
        ChatLockSettings.fromObject = function fromObject(object) {
            if (object instanceof $root.WAChatLockSettings.ChatLockSettings)
                return object;
            var message = new $root.WAChatLockSettings.ChatLockSettings();
            if (object.hideLockedChats != null)
                message.hideLockedChats = Boolean(object.hideLockedChats);
            if (object.secretCode != null) {
                if (typeof object.secretCode !== "object")
                    throw TypeError(".WAChatLockSettings.ChatLockSettings.secretCode: object expected");
                message.secretCode = $root.WAUserPassword.UserPassword.fromObject(object.secretCode);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatLockSettings message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {WAChatLockSettings.ChatLockSettings} message ChatLockSettings
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatLockSettings.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hideLockedChats = false;
                object.secretCode = null;
            }
            if (message.hideLockedChats != null && message.hasOwnProperty("hideLockedChats"))
                object.hideLockedChats = message.hideLockedChats;
            if (message.secretCode != null && message.hasOwnProperty("secretCode"))
                object.secretCode = $root.WAUserPassword.UserPassword.toObject(message.secretCode, options);
            return object;
        };

        /**
         * Converts this ChatLockSettings to JSON.
         * @function toJSON
         * @memberof WAChatLockSettings.ChatLockSettings
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatLockSettings.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ChatLockSettings
         * @function getTypeUrl
         * @memberof WAChatLockSettings.ChatLockSettings
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatLockSettings.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAChatLockSettings.ChatLockSettings";
        };

        return ChatLockSettings;
    })();

    return WAChatLockSettings;
})();

$root.WAUserPassword = (function() {

    /**
     * Namespace WAUserPassword.
     * @exports WAUserPassword
     * @namespace
     */
    var WAUserPassword = {};

    WAUserPassword.UserPassword = (function() {

        /**
         * Properties of a UserPassword.
         * @memberof WAUserPassword
         * @interface IUserPassword
         * @property {WAUserPassword.UserPassword.Encoding|null} [encoding] UserPassword encoding
         * @property {WAUserPassword.UserPassword.Transformer|null} [transformer] UserPassword transformer
         * @property {Array.<WAUserPassword.UserPassword.ITransformerArg>|null} [transformerArg] UserPassword transformerArg
         * @property {Uint8Array|null} [transformedData] UserPassword transformedData
         */

        /**
         * Constructs a new UserPassword.
         * @memberof WAUserPassword
         * @classdesc Represents a UserPassword.
         * @implements IUserPassword
         * @constructor
         * @param {WAUserPassword.IUserPassword=} [properties] Properties to set
         */
        function UserPassword(properties) {
            this.transformerArg = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserPassword encoding.
         * @member {WAUserPassword.UserPassword.Encoding} encoding
         * @memberof WAUserPassword.UserPassword
         * @instance
         */
        UserPassword.prototype.encoding = 0;

        /**
         * UserPassword transformer.
         * @member {WAUserPassword.UserPassword.Transformer} transformer
         * @memberof WAUserPassword.UserPassword
         * @instance
         */
        UserPassword.prototype.transformer = 0;

        /**
         * UserPassword transformerArg.
         * @member {Array.<WAUserPassword.UserPassword.ITransformerArg>} transformerArg
         * @memberof WAUserPassword.UserPassword
         * @instance
         */
        UserPassword.prototype.transformerArg = $util.emptyArray;

        /**
         * UserPassword transformedData.
         * @member {Uint8Array} transformedData
         * @memberof WAUserPassword.UserPassword
         * @instance
         */
        UserPassword.prototype.transformedData = $util.newBuffer([]);

        /**
         * Creates a new UserPassword instance using the specified properties.
         * @function create
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {WAUserPassword.IUserPassword=} [properties] Properties to set
         * @returns {WAUserPassword.UserPassword} UserPassword instance
         */
        UserPassword.create = function create(properties) {
            return new UserPassword(properties);
        };

        /**
         * Encodes the specified UserPassword message. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @function encode
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {WAUserPassword.IUserPassword} message UserPassword message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserPassword.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.encoding != null && Object.hasOwnProperty.call(message, "encoding"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.encoding);
            if (message.transformer != null && Object.hasOwnProperty.call(message, "transformer"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.transformer);
            if (message.transformerArg != null && message.transformerArg.length)
                for (var i = 0; i < message.transformerArg.length; ++i)
                    $root.WAUserPassword.UserPassword.TransformerArg.encode(message.transformerArg[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.transformedData != null && Object.hasOwnProperty.call(message, "transformedData"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.transformedData);
            return writer;
        };

        /**
         * Encodes the specified UserPassword message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {WAUserPassword.IUserPassword} message UserPassword message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserPassword.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserPassword message from the specified reader or buffer.
         * @function decode
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAUserPassword.UserPassword} UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserPassword.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAUserPassword.UserPassword();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.encoding = reader.int32();
                        break;
                    }
                case 2: {
                        message.transformer = reader.int32();
                        break;
                    }
                case 3: {
                        if (!(message.transformerArg && message.transformerArg.length))
                            message.transformerArg = [];
                        message.transformerArg.push($root.WAUserPassword.UserPassword.TransformerArg.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        message.transformedData = reader.bytes();
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
         * Decodes a UserPassword message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAUserPassword.UserPassword} UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserPassword.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserPassword message.
         * @function verify
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserPassword.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.encoding != null && message.hasOwnProperty("encoding"))
                switch (message.encoding) {
                default:
                    return "encoding: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.transformer != null && message.hasOwnProperty("transformer"))
                switch (message.transformer) {
                default:
                    return "transformer: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.transformerArg != null && message.hasOwnProperty("transformerArg")) {
                if (!Array.isArray(message.transformerArg))
                    return "transformerArg: array expected";
                for (var i = 0; i < message.transformerArg.length; ++i) {
                    var error = $root.WAUserPassword.UserPassword.TransformerArg.verify(message.transformerArg[i]);
                    if (error)
                        return "transformerArg." + error;
                }
            }
            if (message.transformedData != null && message.hasOwnProperty("transformedData"))
                if (!(message.transformedData && typeof message.transformedData.length === "number" || $util.isString(message.transformedData)))
                    return "transformedData: buffer expected";
            return null;
        };

        /**
         * Creates a UserPassword message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAUserPassword.UserPassword} UserPassword
         */
        UserPassword.fromObject = function fromObject(object) {
            if (object instanceof $root.WAUserPassword.UserPassword)
                return object;
            var message = new $root.WAUserPassword.UserPassword();
            switch (object.encoding) {
            default:
                if (typeof object.encoding === "number") {
                    message.encoding = object.encoding;
                    break;
                }
                break;
            case "UTF8":
            case 0:
                message.encoding = 0;
                break;
            case "UTF8_BROKEN":
            case 1:
                message.encoding = 1;
                break;
            }
            switch (object.transformer) {
            default:
                if (typeof object.transformer === "number") {
                    message.transformer = object.transformer;
                    break;
                }
                break;
            case "NONE":
            case 0:
                message.transformer = 0;
                break;
            case "PBKDF2_HMAC_SHA512":
            case 1:
                message.transformer = 1;
                break;
            case "PBKDF2_HMAC_SHA384":
            case 2:
                message.transformer = 2;
                break;
            }
            if (object.transformerArg) {
                if (!Array.isArray(object.transformerArg))
                    throw TypeError(".WAUserPassword.UserPassword.transformerArg: array expected");
                message.transformerArg = [];
                for (var i = 0; i < object.transformerArg.length; ++i) {
                    if (typeof object.transformerArg[i] !== "object")
                        throw TypeError(".WAUserPassword.UserPassword.transformerArg: object expected");
                    message.transformerArg[i] = $root.WAUserPassword.UserPassword.TransformerArg.fromObject(object.transformerArg[i]);
                }
            }
            if (object.transformedData != null)
                if (typeof object.transformedData === "string")
                    $util.base64.decode(object.transformedData, message.transformedData = $util.newBuffer($util.base64.length(object.transformedData)), 0);
                else if (object.transformedData.length >= 0)
                    message.transformedData = object.transformedData;
            return message;
        };

        /**
         * Creates a plain object from a UserPassword message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {WAUserPassword.UserPassword} message UserPassword
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserPassword.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.transformerArg = [];
            if (options.defaults) {
                object.encoding = options.enums === String ? "UTF8" : 0;
                object.transformer = options.enums === String ? "NONE" : 0;
                if (options.bytes === String)
                    object.transformedData = "";
                else {
                    object.transformedData = [];
                    if (options.bytes !== Array)
                        object.transformedData = $util.newBuffer(object.transformedData);
                }
            }
            if (message.encoding != null && message.hasOwnProperty("encoding"))
                object.encoding = options.enums === String ? $root.WAUserPassword.UserPassword.Encoding[message.encoding] === undefined ? message.encoding : $root.WAUserPassword.UserPassword.Encoding[message.encoding] : message.encoding;
            if (message.transformer != null && message.hasOwnProperty("transformer"))
                object.transformer = options.enums === String ? $root.WAUserPassword.UserPassword.Transformer[message.transformer] === undefined ? message.transformer : $root.WAUserPassword.UserPassword.Transformer[message.transformer] : message.transformer;
            if (message.transformerArg && message.transformerArg.length) {
                object.transformerArg = [];
                for (var j = 0; j < message.transformerArg.length; ++j)
                    object.transformerArg[j] = $root.WAUserPassword.UserPassword.TransformerArg.toObject(message.transformerArg[j], options);
            }
            if (message.transformedData != null && message.hasOwnProperty("transformedData"))
                object.transformedData = options.bytes === String ? $util.base64.encode(message.transformedData, 0, message.transformedData.length) : options.bytes === Array ? Array.prototype.slice.call(message.transformedData) : message.transformedData;
            return object;
        };

        /**
         * Converts this UserPassword to JSON.
         * @function toJSON
         * @memberof WAUserPassword.UserPassword
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserPassword.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserPassword
         * @function getTypeUrl
         * @memberof WAUserPassword.UserPassword
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserPassword.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAUserPassword.UserPassword";
        };

        /**
         * Transformer enum.
         * @name WAUserPassword.UserPassword.Transformer
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} PBKDF2_HMAC_SHA512=1 PBKDF2_HMAC_SHA512 value
         * @property {number} PBKDF2_HMAC_SHA384=2 PBKDF2_HMAC_SHA384 value
         */
        UserPassword.Transformer = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "PBKDF2_HMAC_SHA512"] = 1;
            values[valuesById[2] = "PBKDF2_HMAC_SHA384"] = 2;
            return values;
        })();

        /**
         * Encoding enum.
         * @name WAUserPassword.UserPassword.Encoding
         * @enum {number}
         * @property {number} UTF8=0 UTF8 value
         * @property {number} UTF8_BROKEN=1 UTF8_BROKEN value
         */
        UserPassword.Encoding = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UTF8"] = 0;
            values[valuesById[1] = "UTF8_BROKEN"] = 1;
            return values;
        })();

        UserPassword.TransformerArg = (function() {

            /**
             * Properties of a TransformerArg.
             * @memberof WAUserPassword.UserPassword
             * @interface ITransformerArg
             * @property {string|null} [key] TransformerArg key
             * @property {WAUserPassword.UserPassword.TransformerArg.IValue|null} [value] TransformerArg value
             */

            /**
             * Constructs a new TransformerArg.
             * @memberof WAUserPassword.UserPassword
             * @classdesc Represents a TransformerArg.
             * @implements ITransformerArg
             * @constructor
             * @param {WAUserPassword.UserPassword.ITransformerArg=} [properties] Properties to set
             */
            function TransformerArg(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TransformerArg key.
             * @member {string} key
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @instance
             */
            TransformerArg.prototype.key = "";

            /**
             * TransformerArg value.
             * @member {WAUserPassword.UserPassword.TransformerArg.IValue|null|undefined} value
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @instance
             */
            TransformerArg.prototype.value = null;

            /**
             * Creates a new TransformerArg instance using the specified properties.
             * @function create
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {WAUserPassword.UserPassword.ITransformerArg=} [properties] Properties to set
             * @returns {WAUserPassword.UserPassword.TransformerArg} TransformerArg instance
             */
            TransformerArg.create = function create(properties) {
                return new TransformerArg(properties);
            };

            /**
             * Encodes the specified TransformerArg message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @function encode
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {WAUserPassword.UserPassword.ITransformerArg} message TransformerArg message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransformerArg.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    $root.WAUserPassword.UserPassword.TransformerArg.Value.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified TransformerArg message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {WAUserPassword.UserPassword.ITransformerArg} message TransformerArg message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransformerArg.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TransformerArg message from the specified reader or buffer.
             * @function decode
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAUserPassword.UserPassword.TransformerArg} TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransformerArg.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAUserPassword.UserPassword.TransformerArg();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.key = reader.string();
                            break;
                        }
                    case 2: {
                            message.value = $root.WAUserPassword.UserPassword.TransformerArg.Value.decode(reader, reader.uint32());
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
             * Decodes a TransformerArg message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAUserPassword.UserPassword.TransformerArg} TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransformerArg.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TransformerArg message.
             * @function verify
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransformerArg.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.key != null && message.hasOwnProperty("key"))
                    if (!$util.isString(message.key))
                        return "key: string expected";
                if (message.value != null && message.hasOwnProperty("value")) {
                    var error = $root.WAUserPassword.UserPassword.TransformerArg.Value.verify(message.value);
                    if (error)
                        return "value." + error;
                }
                return null;
            };

            /**
             * Creates a TransformerArg message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAUserPassword.UserPassword.TransformerArg} TransformerArg
             */
            TransformerArg.fromObject = function fromObject(object) {
                if (object instanceof $root.WAUserPassword.UserPassword.TransformerArg)
                    return object;
                var message = new $root.WAUserPassword.UserPassword.TransformerArg();
                if (object.key != null)
                    message.key = String(object.key);
                if (object.value != null) {
                    if (typeof object.value !== "object")
                        throw TypeError(".WAUserPassword.UserPassword.TransformerArg.value: object expected");
                    message.value = $root.WAUserPassword.UserPassword.TransformerArg.Value.fromObject(object.value);
                }
                return message;
            };

            /**
             * Creates a plain object from a TransformerArg message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {WAUserPassword.UserPassword.TransformerArg} message TransformerArg
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransformerArg.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.key = "";
                    object.value = null;
                }
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = message.key;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = $root.WAUserPassword.UserPassword.TransformerArg.Value.toObject(message.value, options);
                return object;
            };

            /**
             * Converts this TransformerArg to JSON.
             * @function toJSON
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransformerArg.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TransformerArg
             * @function getTypeUrl
             * @memberof WAUserPassword.UserPassword.TransformerArg
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TransformerArg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAUserPassword.UserPassword.TransformerArg";
            };

            TransformerArg.Value = (function() {

                /**
                 * Properties of a Value.
                 * @memberof WAUserPassword.UserPassword.TransformerArg
                 * @interface IValue
                 * @property {Uint8Array|null} [asBlob] Value asBlob
                 * @property {number|null} [asUnsignedInteger] Value asUnsignedInteger
                 */

                /**
                 * Constructs a new Value.
                 * @memberof WAUserPassword.UserPassword.TransformerArg
                 * @classdesc Represents a Value.
                 * @implements IValue
                 * @constructor
                 * @param {WAUserPassword.UserPassword.TransformerArg.IValue=} [properties] Properties to set
                 */
                function Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Value asBlob.
                 * @member {Uint8Array|null|undefined} asBlob
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @instance
                 */
                Value.prototype.asBlob = null;

                /**
                 * Value asUnsignedInteger.
                 * @member {number|null|undefined} asUnsignedInteger
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @instance
                 */
                Value.prototype.asUnsignedInteger = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * Value value.
                 * @member {"asBlob"|"asUnsignedInteger"|undefined} value
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @instance
                 */
                Object.defineProperty(Value.prototype, "value", {
                    get: $util.oneOfGetter($oneOfFields = ["asBlob", "asUnsignedInteger"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Value instance using the specified properties.
                 * @function create
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {WAUserPassword.UserPassword.TransformerArg.IValue=} [properties] Properties to set
                 * @returns {WAUserPassword.UserPassword.TransformerArg.Value} Value instance
                 */
                Value.create = function create(properties) {
                    return new Value(properties);
                };

                /**
                 * Encodes the specified Value message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @function encode
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {WAUserPassword.UserPassword.TransformerArg.IValue} message Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Value.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.asBlob != null && Object.hasOwnProperty.call(message, "asBlob"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.asBlob);
                    if (message.asUnsignedInteger != null && Object.hasOwnProperty.call(message, "asUnsignedInteger"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.asUnsignedInteger);
                    return writer;
                };

                /**
                 * Encodes the specified Value message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {WAUserPassword.UserPassword.TransformerArg.IValue} message Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Value.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {WAUserPassword.UserPassword.TransformerArg.Value} Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAUserPassword.UserPassword.TransformerArg.Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.asBlob = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.asUnsignedInteger = reader.uint32();
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
                 * Decodes a Value message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {WAUserPassword.UserPassword.TransformerArg.Value} Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Value.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Value message.
                 * @function verify
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Value.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.asBlob != null && message.hasOwnProperty("asBlob")) {
                        properties.value = 1;
                        if (!(message.asBlob && typeof message.asBlob.length === "number" || $util.isString(message.asBlob)))
                            return "asBlob: buffer expected";
                    }
                    if (message.asUnsignedInteger != null && message.hasOwnProperty("asUnsignedInteger")) {
                        if (properties.value === 1)
                            return "value: multiple values";
                        properties.value = 1;
                        if (!$util.isInteger(message.asUnsignedInteger))
                            return "asUnsignedInteger: integer expected";
                    }
                    return null;
                };

                /**
                 * Creates a Value message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {WAUserPassword.UserPassword.TransformerArg.Value} Value
                 */
                Value.fromObject = function fromObject(object) {
                    if (object instanceof $root.WAUserPassword.UserPassword.TransformerArg.Value)
                        return object;
                    var message = new $root.WAUserPassword.UserPassword.TransformerArg.Value();
                    if (object.asBlob != null)
                        if (typeof object.asBlob === "string")
                            $util.base64.decode(object.asBlob, message.asBlob = $util.newBuffer($util.base64.length(object.asBlob)), 0);
                        else if (object.asBlob.length >= 0)
                            message.asBlob = object.asBlob;
                    if (object.asUnsignedInteger != null)
                        message.asUnsignedInteger = object.asUnsignedInteger >>> 0;
                    return message;
                };

                /**
                 * Creates a plain object from a Value message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {WAUserPassword.UserPassword.TransformerArg.Value} message Value
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Value.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (message.asBlob != null && message.hasOwnProperty("asBlob")) {
                        object.asBlob = options.bytes === String ? $util.base64.encode(message.asBlob, 0, message.asBlob.length) : options.bytes === Array ? Array.prototype.slice.call(message.asBlob) : message.asBlob;
                        if (options.oneofs)
                            object.value = "asBlob";
                    }
                    if (message.asUnsignedInteger != null && message.hasOwnProperty("asUnsignedInteger")) {
                        object.asUnsignedInteger = message.asUnsignedInteger;
                        if (options.oneofs)
                            object.value = "asUnsignedInteger";
                    }
                    return object;
                };

                /**
                 * Converts this Value to JSON.
                 * @function toJSON
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Value.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Value
                 * @function getTypeUrl
                 * @memberof WAUserPassword.UserPassword.TransformerArg.Value
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/WAUserPassword.UserPassword.TransformerArg.Value";
                };

                return Value;
            })();

            return TransformerArg;
        })();

        return UserPassword;
    })();

    return WAUserPassword;
})();

module.exports = $root;
