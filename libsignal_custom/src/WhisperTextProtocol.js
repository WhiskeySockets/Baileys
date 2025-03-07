/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.textsecure = (function() {

    /**
     * Namespace textsecure.
     * @exports textsecure
     * @namespace
     */
    var textsecure = {};

    textsecure.WhisperMessage = (function() {

        /**
         * Properties of a WhisperMessage.
         * @memberof textsecure
         * @interface IWhisperMessage
         * @property {Uint8Array|null} [ephemeralKey] WhisperMessage ephemeralKey
         * @property {number|null} [counter] WhisperMessage counter
         * @property {number|null} [previousCounter] WhisperMessage previousCounter
         * @property {Uint8Array|null} [ciphertext] WhisperMessage ciphertext
         */

        /**
         * Constructs a new WhisperMessage.
         * @memberof textsecure
         * @classdesc Represents a WhisperMessage.
         * @implements IWhisperMessage
         * @constructor
         * @param {textsecure.IWhisperMessage=} [properties] Properties to set
         */
        function WhisperMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WhisperMessage ephemeralKey.
         * @member {Uint8Array} ephemeralKey
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.ephemeralKey = $util.newBuffer([]);

        /**
         * WhisperMessage counter.
         * @member {number} counter
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.counter = 0;

        /**
         * WhisperMessage previousCounter.
         * @member {number} previousCounter
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.previousCounter = 0;

        /**
         * WhisperMessage ciphertext.
         * @member {Uint8Array} ciphertext
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.ciphertext = $util.newBuffer([]);

        /**
         * Creates a new WhisperMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.IWhisperMessage=} [properties] Properties to set
         * @returns {textsecure.WhisperMessage} WhisperMessage instance
         */
        WhisperMessage.create = function create(properties) {
            return new WhisperMessage(properties);
        };

        /**
         * Encodes the specified WhisperMessage message. Does not implicitly {@link textsecure.WhisperMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.IWhisperMessage} message WhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WhisperMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ephemeralKey);
            if (message.counter != null && message.hasOwnProperty("counter"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.counter);
            if (message.previousCounter != null && message.hasOwnProperty("previousCounter"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.previousCounter);
            if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.ciphertext);
            return writer;
        };

        /**
         * Encodes the specified WhisperMessage message, length delimited. Does not implicitly {@link textsecure.WhisperMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.IWhisperMessage} message WhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WhisperMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WhisperMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.WhisperMessage} WhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WhisperMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.textsecure.WhisperMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ephemeralKey = reader.bytes();
                    break;
                case 2:
                    message.counter = reader.uint32();
                    break;
                case 3:
                    message.previousCounter = reader.uint32();
                    break;
                case 4:
                    message.ciphertext = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WhisperMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {textsecure.WhisperMessage} WhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WhisperMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WhisperMessage message.
         * @function verify
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WhisperMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                if (!(message.ephemeralKey && typeof message.ephemeralKey.length === "number" || $util.isString(message.ephemeralKey)))
                    return "ephemeralKey: buffer expected";
            if (message.counter != null && message.hasOwnProperty("counter"))
                if (!$util.isInteger(message.counter))
                    return "counter: integer expected";
            if (message.previousCounter != null && message.hasOwnProperty("previousCounter"))
                if (!$util.isInteger(message.previousCounter))
                    return "previousCounter: integer expected";
            if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
                if (!(message.ciphertext && typeof message.ciphertext.length === "number" || $util.isString(message.ciphertext)))
                    return "ciphertext: buffer expected";
            return null;
        };

        /**
         * Creates a WhisperMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {textsecure.WhisperMessage} WhisperMessage
         */
        WhisperMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.textsecure.WhisperMessage)
                return object;
            var message = new $root.textsecure.WhisperMessage();
            if (object.ephemeralKey != null)
                if (typeof object.ephemeralKey === "string")
                    $util.base64.decode(object.ephemeralKey, message.ephemeralKey = $util.newBuffer($util.base64.length(object.ephemeralKey)), 0);
                else if (object.ephemeralKey.length)
                    message.ephemeralKey = object.ephemeralKey;
            if (object.counter != null)
                message.counter = object.counter >>> 0;
            if (object.previousCounter != null)
                message.previousCounter = object.previousCounter >>> 0;
            if (object.ciphertext != null)
                if (typeof object.ciphertext === "string")
                    $util.base64.decode(object.ciphertext, message.ciphertext = $util.newBuffer($util.base64.length(object.ciphertext)), 0);
                else if (object.ciphertext.length)
                    message.ciphertext = object.ciphertext;
            return message;
        };

        /**
         * Creates a plain object from a WhisperMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.WhisperMessage} message WhisperMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WhisperMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.ephemeralKey = "";
                else {
                    object.ephemeralKey = [];
                    if (options.bytes !== Array)
                        object.ephemeralKey = $util.newBuffer(object.ephemeralKey);
                }
                object.counter = 0;
                object.previousCounter = 0;
                if (options.bytes === String)
                    object.ciphertext = "";
                else {
                    object.ciphertext = [];
                    if (options.bytes !== Array)
                        object.ciphertext = $util.newBuffer(object.ciphertext);
                }
            }
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                object.ephemeralKey = options.bytes === String ? $util.base64.encode(message.ephemeralKey, 0, message.ephemeralKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.ephemeralKey) : message.ephemeralKey;
            if (message.counter != null && message.hasOwnProperty("counter"))
                object.counter = message.counter;
            if (message.previousCounter != null && message.hasOwnProperty("previousCounter"))
                object.previousCounter = message.previousCounter;
            if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
                object.ciphertext = options.bytes === String ? $util.base64.encode(message.ciphertext, 0, message.ciphertext.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertext) : message.ciphertext;
            return object;
        };

        /**
         * Converts this WhisperMessage to JSON.
         * @function toJSON
         * @memberof textsecure.WhisperMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WhisperMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WhisperMessage;
    })();

    textsecure.PreKeyWhisperMessage = (function() {

        /**
         * Properties of a PreKeyWhisperMessage.
         * @memberof textsecure
         * @interface IPreKeyWhisperMessage
         * @property {number|null} [registrationId] PreKeyWhisperMessage registrationId
         * @property {number|null} [preKeyId] PreKeyWhisperMessage preKeyId
         * @property {number|null} [signedPreKeyId] PreKeyWhisperMessage signedPreKeyId
         * @property {Uint8Array|null} [baseKey] PreKeyWhisperMessage baseKey
         * @property {Uint8Array|null} [identityKey] PreKeyWhisperMessage identityKey
         * @property {Uint8Array|null} [message] PreKeyWhisperMessage message
         */

        /**
         * Constructs a new PreKeyWhisperMessage.
         * @memberof textsecure
         * @classdesc Represents a PreKeyWhisperMessage.
         * @implements IPreKeyWhisperMessage
         * @constructor
         * @param {textsecure.IPreKeyWhisperMessage=} [properties] Properties to set
         */
        function PreKeyWhisperMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PreKeyWhisperMessage registrationId.
         * @member {number} registrationId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.registrationId = 0;

        /**
         * PreKeyWhisperMessage preKeyId.
         * @member {number} preKeyId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.preKeyId = 0;

        /**
         * PreKeyWhisperMessage signedPreKeyId.
         * @member {number} signedPreKeyId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.signedPreKeyId = 0;

        /**
         * PreKeyWhisperMessage baseKey.
         * @member {Uint8Array} baseKey
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.baseKey = $util.newBuffer([]);

        /**
         * PreKeyWhisperMessage identityKey.
         * @member {Uint8Array} identityKey
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.identityKey = $util.newBuffer([]);

        /**
         * PreKeyWhisperMessage message.
         * @member {Uint8Array} message
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.message = $util.newBuffer([]);

        /**
         * Creates a new PreKeyWhisperMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.IPreKeyWhisperMessage=} [properties] Properties to set
         * @returns {textsecure.PreKeyWhisperMessage} PreKeyWhisperMessage instance
         */
        PreKeyWhisperMessage.create = function create(properties) {
            return new PreKeyWhisperMessage(properties);
        };

        /**
         * Encodes the specified PreKeyWhisperMessage message. Does not implicitly {@link textsecure.PreKeyWhisperMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.IPreKeyWhisperMessage} message PreKeyWhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PreKeyWhisperMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.preKeyId != null && message.hasOwnProperty("preKeyId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.preKeyId);
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.baseKey);
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.identityKey);
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.message);
            if (message.registrationId != null && message.hasOwnProperty("registrationId"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.registrationId);
            if (message.signedPreKeyId != null && message.hasOwnProperty("signedPreKeyId"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.signedPreKeyId);
            return writer;
        };

        /**
         * Encodes the specified PreKeyWhisperMessage message, length delimited. Does not implicitly {@link textsecure.PreKeyWhisperMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.IPreKeyWhisperMessage} message PreKeyWhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PreKeyWhisperMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PreKeyWhisperMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.PreKeyWhisperMessage} PreKeyWhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PreKeyWhisperMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.textsecure.PreKeyWhisperMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 5:
                    message.registrationId = reader.uint32();
                    break;
                case 1:
                    message.preKeyId = reader.uint32();
                    break;
                case 6:
                    message.signedPreKeyId = reader.uint32();
                    break;
                case 2:
                    message.baseKey = reader.bytes();
                    break;
                case 3:
                    message.identityKey = reader.bytes();
                    break;
                case 4:
                    message.message = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PreKeyWhisperMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {textsecure.PreKeyWhisperMessage} PreKeyWhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PreKeyWhisperMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PreKeyWhisperMessage message.
         * @function verify
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PreKeyWhisperMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.registrationId != null && message.hasOwnProperty("registrationId"))
                if (!$util.isInteger(message.registrationId))
                    return "registrationId: integer expected";
            if (message.preKeyId != null && message.hasOwnProperty("preKeyId"))
                if (!$util.isInteger(message.preKeyId))
                    return "preKeyId: integer expected";
            if (message.signedPreKeyId != null && message.hasOwnProperty("signedPreKeyId"))
                if (!$util.isInteger(message.signedPreKeyId))
                    return "signedPreKeyId: integer expected";
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                if (!(message.baseKey && typeof message.baseKey.length === "number" || $util.isString(message.baseKey)))
                    return "baseKey: buffer expected";
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                if (!(message.identityKey && typeof message.identityKey.length === "number" || $util.isString(message.identityKey)))
                    return "identityKey: buffer expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!(message.message && typeof message.message.length === "number" || $util.isString(message.message)))
                    return "message: buffer expected";
            return null;
        };

        /**
         * Creates a PreKeyWhisperMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {textsecure.PreKeyWhisperMessage} PreKeyWhisperMessage
         */
        PreKeyWhisperMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.textsecure.PreKeyWhisperMessage)
                return object;
            var message = new $root.textsecure.PreKeyWhisperMessage();
            if (object.registrationId != null)
                message.registrationId = object.registrationId >>> 0;
            if (object.preKeyId != null)
                message.preKeyId = object.preKeyId >>> 0;
            if (object.signedPreKeyId != null)
                message.signedPreKeyId = object.signedPreKeyId >>> 0;
            if (object.baseKey != null)
                if (typeof object.baseKey === "string")
                    $util.base64.decode(object.baseKey, message.baseKey = $util.newBuffer($util.base64.length(object.baseKey)), 0);
                else if (object.baseKey.length)
                    message.baseKey = object.baseKey;
            if (object.identityKey != null)
                if (typeof object.identityKey === "string")
                    $util.base64.decode(object.identityKey, message.identityKey = $util.newBuffer($util.base64.length(object.identityKey)), 0);
                else if (object.identityKey.length)
                    message.identityKey = object.identityKey;
            if (object.message != null)
                if (typeof object.message === "string")
                    $util.base64.decode(object.message, message.message = $util.newBuffer($util.base64.length(object.message)), 0);
                else if (object.message.length)
                    message.message = object.message;
            return message;
        };

        /**
         * Creates a plain object from a PreKeyWhisperMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.PreKeyWhisperMessage} message PreKeyWhisperMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PreKeyWhisperMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.preKeyId = 0;
                if (options.bytes === String)
                    object.baseKey = "";
                else {
                    object.baseKey = [];
                    if (options.bytes !== Array)
                        object.baseKey = $util.newBuffer(object.baseKey);
                }
                if (options.bytes === String)
                    object.identityKey = "";
                else {
                    object.identityKey = [];
                    if (options.bytes !== Array)
                        object.identityKey = $util.newBuffer(object.identityKey);
                }
                if (options.bytes === String)
                    object.message = "";
                else {
                    object.message = [];
                    if (options.bytes !== Array)
                        object.message = $util.newBuffer(object.message);
                }
                object.registrationId = 0;
                object.signedPreKeyId = 0;
            }
            if (message.preKeyId != null && message.hasOwnProperty("preKeyId"))
                object.preKeyId = message.preKeyId;
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                object.baseKey = options.bytes === String ? $util.base64.encode(message.baseKey, 0, message.baseKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.baseKey) : message.baseKey;
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                object.identityKey = options.bytes === String ? $util.base64.encode(message.identityKey, 0, message.identityKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.identityKey) : message.identityKey;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = options.bytes === String ? $util.base64.encode(message.message, 0, message.message.length) : options.bytes === Array ? Array.prototype.slice.call(message.message) : message.message;
            if (message.registrationId != null && message.hasOwnProperty("registrationId"))
                object.registrationId = message.registrationId;
            if (message.signedPreKeyId != null && message.hasOwnProperty("signedPreKeyId"))
                object.signedPreKeyId = message.signedPreKeyId;
            return object;
        };

        /**
         * Converts this PreKeyWhisperMessage to JSON.
         * @function toJSON
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PreKeyWhisperMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PreKeyWhisperMessage;
    })();

    textsecure.KeyExchangeMessage = (function() {

        /**
         * Properties of a KeyExchangeMessage.
         * @memberof textsecure
         * @interface IKeyExchangeMessage
         * @property {number|null} [id] KeyExchangeMessage id
         * @property {Uint8Array|null} [baseKey] KeyExchangeMessage baseKey
         * @property {Uint8Array|null} [ephemeralKey] KeyExchangeMessage ephemeralKey
         * @property {Uint8Array|null} [identityKey] KeyExchangeMessage identityKey
         * @property {Uint8Array|null} [baseKeySignature] KeyExchangeMessage baseKeySignature
         */

        /**
         * Constructs a new KeyExchangeMessage.
         * @memberof textsecure
         * @classdesc Represents a KeyExchangeMessage.
         * @implements IKeyExchangeMessage
         * @constructor
         * @param {textsecure.IKeyExchangeMessage=} [properties] Properties to set
         */
        function KeyExchangeMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KeyExchangeMessage id.
         * @member {number} id
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.id = 0;

        /**
         * KeyExchangeMessage baseKey.
         * @member {Uint8Array} baseKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.baseKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage ephemeralKey.
         * @member {Uint8Array} ephemeralKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.ephemeralKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage identityKey.
         * @member {Uint8Array} identityKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.identityKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage baseKeySignature.
         * @member {Uint8Array} baseKeySignature
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.baseKeySignature = $util.newBuffer([]);

        /**
         * Creates a new KeyExchangeMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.IKeyExchangeMessage=} [properties] Properties to set
         * @returns {textsecure.KeyExchangeMessage} KeyExchangeMessage instance
         */
        KeyExchangeMessage.create = function create(properties) {
            return new KeyExchangeMessage(properties);
        };

        /**
         * Encodes the specified KeyExchangeMessage message. Does not implicitly {@link textsecure.KeyExchangeMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.IKeyExchangeMessage} message KeyExchangeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyExchangeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.baseKey);
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ephemeralKey);
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.identityKey);
            if (message.baseKeySignature != null && message.hasOwnProperty("baseKeySignature"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.baseKeySignature);
            return writer;
        };

        /**
         * Encodes the specified KeyExchangeMessage message, length delimited. Does not implicitly {@link textsecure.KeyExchangeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.IKeyExchangeMessage} message KeyExchangeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyExchangeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KeyExchangeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.KeyExchangeMessage} KeyExchangeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyExchangeMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.textsecure.KeyExchangeMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.baseKey = reader.bytes();
                    break;
                case 3:
                    message.ephemeralKey = reader.bytes();
                    break;
                case 4:
                    message.identityKey = reader.bytes();
                    break;
                case 5:
                    message.baseKeySignature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a KeyExchangeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {textsecure.KeyExchangeMessage} KeyExchangeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyExchangeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KeyExchangeMessage message.
         * @function verify
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KeyExchangeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                if (!(message.baseKey && typeof message.baseKey.length === "number" || $util.isString(message.baseKey)))
                    return "baseKey: buffer expected";
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                if (!(message.ephemeralKey && typeof message.ephemeralKey.length === "number" || $util.isString(message.ephemeralKey)))
                    return "ephemeralKey: buffer expected";
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                if (!(message.identityKey && typeof message.identityKey.length === "number" || $util.isString(message.identityKey)))
                    return "identityKey: buffer expected";
            if (message.baseKeySignature != null && message.hasOwnProperty("baseKeySignature"))
                if (!(message.baseKeySignature && typeof message.baseKeySignature.length === "number" || $util.isString(message.baseKeySignature)))
                    return "baseKeySignature: buffer expected";
            return null;
        };

        /**
         * Creates a KeyExchangeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {textsecure.KeyExchangeMessage} KeyExchangeMessage
         */
        KeyExchangeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.textsecure.KeyExchangeMessage)
                return object;
            var message = new $root.textsecure.KeyExchangeMessage();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.baseKey != null)
                if (typeof object.baseKey === "string")
                    $util.base64.decode(object.baseKey, message.baseKey = $util.newBuffer($util.base64.length(object.baseKey)), 0);
                else if (object.baseKey.length)
                    message.baseKey = object.baseKey;
            if (object.ephemeralKey != null)
                if (typeof object.ephemeralKey === "string")
                    $util.base64.decode(object.ephemeralKey, message.ephemeralKey = $util.newBuffer($util.base64.length(object.ephemeralKey)), 0);
                else if (object.ephemeralKey.length)
                    message.ephemeralKey = object.ephemeralKey;
            if (object.identityKey != null)
                if (typeof object.identityKey === "string")
                    $util.base64.decode(object.identityKey, message.identityKey = $util.newBuffer($util.base64.length(object.identityKey)), 0);
                else if (object.identityKey.length)
                    message.identityKey = object.identityKey;
            if (object.baseKeySignature != null)
                if (typeof object.baseKeySignature === "string")
                    $util.base64.decode(object.baseKeySignature, message.baseKeySignature = $util.newBuffer($util.base64.length(object.baseKeySignature)), 0);
                else if (object.baseKeySignature.length)
                    message.baseKeySignature = object.baseKeySignature;
            return message;
        };

        /**
         * Creates a plain object from a KeyExchangeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.KeyExchangeMessage} message KeyExchangeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KeyExchangeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                if (options.bytes === String)
                    object.baseKey = "";
                else {
                    object.baseKey = [];
                    if (options.bytes !== Array)
                        object.baseKey = $util.newBuffer(object.baseKey);
                }
                if (options.bytes === String)
                    object.ephemeralKey = "";
                else {
                    object.ephemeralKey = [];
                    if (options.bytes !== Array)
                        object.ephemeralKey = $util.newBuffer(object.ephemeralKey);
                }
                if (options.bytes === String)
                    object.identityKey = "";
                else {
                    object.identityKey = [];
                    if (options.bytes !== Array)
                        object.identityKey = $util.newBuffer(object.identityKey);
                }
                if (options.bytes === String)
                    object.baseKeySignature = "";
                else {
                    object.baseKeySignature = [];
                    if (options.bytes !== Array)
                        object.baseKeySignature = $util.newBuffer(object.baseKeySignature);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.baseKey != null && message.hasOwnProperty("baseKey"))
                object.baseKey = options.bytes === String ? $util.base64.encode(message.baseKey, 0, message.baseKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.baseKey) : message.baseKey;
            if (message.ephemeralKey != null && message.hasOwnProperty("ephemeralKey"))
                object.ephemeralKey = options.bytes === String ? $util.base64.encode(message.ephemeralKey, 0, message.ephemeralKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.ephemeralKey) : message.ephemeralKey;
            if (message.identityKey != null && message.hasOwnProperty("identityKey"))
                object.identityKey = options.bytes === String ? $util.base64.encode(message.identityKey, 0, message.identityKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.identityKey) : message.identityKey;
            if (message.baseKeySignature != null && message.hasOwnProperty("baseKeySignature"))
                object.baseKeySignature = options.bytes === String ? $util.base64.encode(message.baseKeySignature, 0, message.baseKeySignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.baseKeySignature) : message.baseKeySignature;
            return object;
        };

        /**
         * Converts this KeyExchangeMessage to JSON.
         * @function toJSON
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KeyExchangeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KeyExchangeMessage;
    })();

    return textsecure;
})();

module.exports = $root;
