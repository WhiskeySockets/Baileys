/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.groupproto = (function() {

    /**
     * Namespace groupproto.
     * @exports groupproto
     * @namespace
     */
    var groupproto = {};

    groupproto.SenderKeyMessage = (function() {

        /**
         * Properties of a SenderKeyMessage.
         * @memberof groupproto
         * @interface ISenderKeyMessage
         * @property {number|null} [id] SenderKeyMessage id
         * @property {number|null} [iteration] SenderKeyMessage iteration
         * @property {Uint8Array|null} [ciphertext] SenderKeyMessage ciphertext
         */

        /**
         * Constructs a new SenderKeyMessage.
         * @memberof groupproto
         * @classdesc Represents a SenderKeyMessage.
         * @implements ISenderKeyMessage
         * @constructor
         * @param {groupproto.ISenderKeyMessage=} [properties] Properties to set
         */
        function SenderKeyMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKeyMessage id.
         * @member {number} id
         * @memberof groupproto.SenderKeyMessage
         * @instance
         */
        SenderKeyMessage.prototype.id = 0;

        /**
         * SenderKeyMessage iteration.
         * @member {number} iteration
         * @memberof groupproto.SenderKeyMessage
         * @instance
         */
        SenderKeyMessage.prototype.iteration = 0;

        /**
         * SenderKeyMessage ciphertext.
         * @member {Uint8Array} ciphertext
         * @memberof groupproto.SenderKeyMessage
         * @instance
         */
        SenderKeyMessage.prototype.ciphertext = $util.newBuffer([]);

        /**
         * Creates a new SenderKeyMessage instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {groupproto.ISenderKeyMessage=} [properties] Properties to set
         * @returns {groupproto.SenderKeyMessage} SenderKeyMessage instance
         */
        SenderKeyMessage.create = function create(properties) {
            return new SenderKeyMessage(properties);
        };

        /**
         * Encodes the specified SenderKeyMessage message. Does not implicitly {@link groupproto.SenderKeyMessage.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {groupproto.ISenderKeyMessage} message SenderKeyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.iteration != null && Object.hasOwnProperty.call(message, "iteration"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.iteration);
            if (message.ciphertext != null && Object.hasOwnProperty.call(message, "ciphertext"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ciphertext);
            return writer;
        };

        /**
         * Encodes the specified SenderKeyMessage message, length delimited. Does not implicitly {@link groupproto.SenderKeyMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {groupproto.ISenderKeyMessage} message SenderKeyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKeyMessage message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderKeyMessage} SenderKeyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderKeyMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.iteration = reader.uint32();
                    break;
                case 3:
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
         * Decodes a SenderKeyMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderKeyMessage} SenderKeyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderKeyMessage message.
         * @function verify
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKeyMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                if (!$util.isInteger(message.iteration))
                    return "iteration: integer expected";
            if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
                if (!(message.ciphertext && typeof message.ciphertext.length === "number" || $util.isString(message.ciphertext)))
                    return "ciphertext: buffer expected";
            return null;
        };

        /**
         * Creates a SenderKeyMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderKeyMessage} SenderKeyMessage
         */
        SenderKeyMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderKeyMessage)
                return object;
            var message = new $root.groupproto.SenderKeyMessage();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.iteration != null)
                message.iteration = object.iteration >>> 0;
            if (object.ciphertext != null)
                if (typeof object.ciphertext === "string")
                    $util.base64.decode(object.ciphertext, message.ciphertext = $util.newBuffer($util.base64.length(object.ciphertext)), 0);
                else if (object.ciphertext.length)
                    message.ciphertext = object.ciphertext;
            return message;
        };

        /**
         * Creates a plain object from a SenderKeyMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderKeyMessage
         * @static
         * @param {groupproto.SenderKeyMessage} message SenderKeyMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKeyMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.iteration = 0;
                if (options.bytes === String)
                    object.ciphertext = "";
                else {
                    object.ciphertext = [];
                    if (options.bytes !== Array)
                        object.ciphertext = $util.newBuffer(object.ciphertext);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                object.iteration = message.iteration;
            if (message.ciphertext != null && message.hasOwnProperty("ciphertext"))
                object.ciphertext = options.bytes === String ? $util.base64.encode(message.ciphertext, 0, message.ciphertext.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertext) : message.ciphertext;
            return object;
        };

        /**
         * Converts this SenderKeyMessage to JSON.
         * @function toJSON
         * @memberof groupproto.SenderKeyMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKeyMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKeyMessage;
    })();

    groupproto.SenderKeyDistributionMessage = (function() {

        /**
         * Properties of a SenderKeyDistributionMessage.
         * @memberof groupproto
         * @interface ISenderKeyDistributionMessage
         * @property {number|null} [id] SenderKeyDistributionMessage id
         * @property {number|null} [iteration] SenderKeyDistributionMessage iteration
         * @property {Uint8Array|null} [chainKey] SenderKeyDistributionMessage chainKey
         * @property {Uint8Array|null} [signingKey] SenderKeyDistributionMessage signingKey
         */

        /**
         * Constructs a new SenderKeyDistributionMessage.
         * @memberof groupproto
         * @classdesc Represents a SenderKeyDistributionMessage.
         * @implements ISenderKeyDistributionMessage
         * @constructor
         * @param {groupproto.ISenderKeyDistributionMessage=} [properties] Properties to set
         */
        function SenderKeyDistributionMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKeyDistributionMessage id.
         * @member {number} id
         * @memberof groupproto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.id = 0;

        /**
         * SenderKeyDistributionMessage iteration.
         * @member {number} iteration
         * @memberof groupproto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.iteration = 0;

        /**
         * SenderKeyDistributionMessage chainKey.
         * @member {Uint8Array} chainKey
         * @memberof groupproto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.chainKey = $util.newBuffer([]);

        /**
         * SenderKeyDistributionMessage signingKey.
         * @member {Uint8Array} signingKey
         * @memberof groupproto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.signingKey = $util.newBuffer([]);

        /**
         * Creates a new SenderKeyDistributionMessage instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {groupproto.ISenderKeyDistributionMessage=} [properties] Properties to set
         * @returns {groupproto.SenderKeyDistributionMessage} SenderKeyDistributionMessage instance
         */
        SenderKeyDistributionMessage.create = function create(properties) {
            return new SenderKeyDistributionMessage(properties);
        };

        /**
         * Encodes the specified SenderKeyDistributionMessage message. Does not implicitly {@link groupproto.SenderKeyDistributionMessage.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {groupproto.ISenderKeyDistributionMessage} message SenderKeyDistributionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyDistributionMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.iteration != null && Object.hasOwnProperty.call(message, "iteration"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.iteration);
            if (message.chainKey != null && Object.hasOwnProperty.call(message, "chainKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.chainKey);
            if (message.signingKey != null && Object.hasOwnProperty.call(message, "signingKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.signingKey);
            return writer;
        };

        /**
         * Encodes the specified SenderKeyDistributionMessage message, length delimited. Does not implicitly {@link groupproto.SenderKeyDistributionMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {groupproto.ISenderKeyDistributionMessage} message SenderKeyDistributionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyDistributionMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKeyDistributionMessage message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyDistributionMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderKeyDistributionMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.iteration = reader.uint32();
                    break;
                case 3:
                    message.chainKey = reader.bytes();
                    break;
                case 4:
                    message.signingKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderKeyDistributionMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyDistributionMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderKeyDistributionMessage message.
         * @function verify
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKeyDistributionMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                if (!$util.isInteger(message.iteration))
                    return "iteration: integer expected";
            if (message.chainKey != null && message.hasOwnProperty("chainKey"))
                if (!(message.chainKey && typeof message.chainKey.length === "number" || $util.isString(message.chainKey)))
                    return "chainKey: buffer expected";
            if (message.signingKey != null && message.hasOwnProperty("signingKey"))
                if (!(message.signingKey && typeof message.signingKey.length === "number" || $util.isString(message.signingKey)))
                    return "signingKey: buffer expected";
            return null;
        };

        /**
         * Creates a SenderKeyDistributionMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
         */
        SenderKeyDistributionMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderKeyDistributionMessage)
                return object;
            var message = new $root.groupproto.SenderKeyDistributionMessage();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.iteration != null)
                message.iteration = object.iteration >>> 0;
            if (object.chainKey != null)
                if (typeof object.chainKey === "string")
                    $util.base64.decode(object.chainKey, message.chainKey = $util.newBuffer($util.base64.length(object.chainKey)), 0);
                else if (object.chainKey.length)
                    message.chainKey = object.chainKey;
            if (object.signingKey != null)
                if (typeof object.signingKey === "string")
                    $util.base64.decode(object.signingKey, message.signingKey = $util.newBuffer($util.base64.length(object.signingKey)), 0);
                else if (object.signingKey.length)
                    message.signingKey = object.signingKey;
            return message;
        };

        /**
         * Creates a plain object from a SenderKeyDistributionMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderKeyDistributionMessage
         * @static
         * @param {groupproto.SenderKeyDistributionMessage} message SenderKeyDistributionMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKeyDistributionMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.iteration = 0;
                if (options.bytes === String)
                    object.chainKey = "";
                else {
                    object.chainKey = [];
                    if (options.bytes !== Array)
                        object.chainKey = $util.newBuffer(object.chainKey);
                }
                if (options.bytes === String)
                    object.signingKey = "";
                else {
                    object.signingKey = [];
                    if (options.bytes !== Array)
                        object.signingKey = $util.newBuffer(object.signingKey);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                object.iteration = message.iteration;
            if (message.chainKey != null && message.hasOwnProperty("chainKey"))
                object.chainKey = options.bytes === String ? $util.base64.encode(message.chainKey, 0, message.chainKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.chainKey) : message.chainKey;
            if (message.signingKey != null && message.hasOwnProperty("signingKey"))
                object.signingKey = options.bytes === String ? $util.base64.encode(message.signingKey, 0, message.signingKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.signingKey) : message.signingKey;
            return object;
        };

        /**
         * Converts this SenderKeyDistributionMessage to JSON.
         * @function toJSON
         * @memberof groupproto.SenderKeyDistributionMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKeyDistributionMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKeyDistributionMessage;
    })();

    groupproto.SenderChainKey = (function() {

        /**
         * Properties of a SenderChainKey.
         * @memberof groupproto
         * @interface ISenderChainKey
         * @property {number|null} [iteration] SenderChainKey iteration
         * @property {Uint8Array|null} [seed] SenderChainKey seed
         */

        /**
         * Constructs a new SenderChainKey.
         * @memberof groupproto
         * @classdesc Represents a SenderChainKey.
         * @implements ISenderChainKey
         * @constructor
         * @param {groupproto.ISenderChainKey=} [properties] Properties to set
         */
        function SenderChainKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderChainKey iteration.
         * @member {number} iteration
         * @memberof groupproto.SenderChainKey
         * @instance
         */
        SenderChainKey.prototype.iteration = 0;

        /**
         * SenderChainKey seed.
         * @member {Uint8Array} seed
         * @memberof groupproto.SenderChainKey
         * @instance
         */
        SenderChainKey.prototype.seed = $util.newBuffer([]);

        /**
         * Creates a new SenderChainKey instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {groupproto.ISenderChainKey=} [properties] Properties to set
         * @returns {groupproto.SenderChainKey} SenderChainKey instance
         */
        SenderChainKey.create = function create(properties) {
            return new SenderChainKey(properties);
        };

        /**
         * Encodes the specified SenderChainKey message. Does not implicitly {@link groupproto.SenderChainKey.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {groupproto.ISenderChainKey} message SenderChainKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderChainKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.iteration != null && Object.hasOwnProperty.call(message, "iteration"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.iteration);
            if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.seed);
            return writer;
        };

        /**
         * Encodes the specified SenderChainKey message, length delimited. Does not implicitly {@link groupproto.SenderChainKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {groupproto.ISenderChainKey} message SenderChainKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderChainKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderChainKey message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderChainKey} SenderChainKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderChainKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderChainKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.iteration = reader.uint32();
                    break;
                case 2:
                    message.seed = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderChainKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderChainKey} SenderChainKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderChainKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderChainKey message.
         * @function verify
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderChainKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                if (!$util.isInteger(message.iteration))
                    return "iteration: integer expected";
            if (message.seed != null && message.hasOwnProperty("seed"))
                if (!(message.seed && typeof message.seed.length === "number" || $util.isString(message.seed)))
                    return "seed: buffer expected";
            return null;
        };

        /**
         * Creates a SenderChainKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderChainKey} SenderChainKey
         */
        SenderChainKey.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderChainKey)
                return object;
            var message = new $root.groupproto.SenderChainKey();
            if (object.iteration != null)
                message.iteration = object.iteration >>> 0;
            if (object.seed != null)
                if (typeof object.seed === "string")
                    $util.base64.decode(object.seed, message.seed = $util.newBuffer($util.base64.length(object.seed)), 0);
                else if (object.seed.length)
                    message.seed = object.seed;
            return message;
        };

        /**
         * Creates a plain object from a SenderChainKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderChainKey
         * @static
         * @param {groupproto.SenderChainKey} message SenderChainKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderChainKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.iteration = 0;
                if (options.bytes === String)
                    object.seed = "";
                else {
                    object.seed = [];
                    if (options.bytes !== Array)
                        object.seed = $util.newBuffer(object.seed);
                }
            }
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                object.iteration = message.iteration;
            if (message.seed != null && message.hasOwnProperty("seed"))
                object.seed = options.bytes === String ? $util.base64.encode(message.seed, 0, message.seed.length) : options.bytes === Array ? Array.prototype.slice.call(message.seed) : message.seed;
            return object;
        };

        /**
         * Converts this SenderChainKey to JSON.
         * @function toJSON
         * @memberof groupproto.SenderChainKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderChainKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderChainKey;
    })();

    groupproto.SenderMessageKey = (function() {

        /**
         * Properties of a SenderMessageKey.
         * @memberof groupproto
         * @interface ISenderMessageKey
         * @property {number|null} [iteration] SenderMessageKey iteration
         * @property {Uint8Array|null} [seed] SenderMessageKey seed
         */

        /**
         * Constructs a new SenderMessageKey.
         * @memberof groupproto
         * @classdesc Represents a SenderMessageKey.
         * @implements ISenderMessageKey
         * @constructor
         * @param {groupproto.ISenderMessageKey=} [properties] Properties to set
         */
        function SenderMessageKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderMessageKey iteration.
         * @member {number} iteration
         * @memberof groupproto.SenderMessageKey
         * @instance
         */
        SenderMessageKey.prototype.iteration = 0;

        /**
         * SenderMessageKey seed.
         * @member {Uint8Array} seed
         * @memberof groupproto.SenderMessageKey
         * @instance
         */
        SenderMessageKey.prototype.seed = $util.newBuffer([]);

        /**
         * Creates a new SenderMessageKey instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {groupproto.ISenderMessageKey=} [properties] Properties to set
         * @returns {groupproto.SenderMessageKey} SenderMessageKey instance
         */
        SenderMessageKey.create = function create(properties) {
            return new SenderMessageKey(properties);
        };

        /**
         * Encodes the specified SenderMessageKey message. Does not implicitly {@link groupproto.SenderMessageKey.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {groupproto.ISenderMessageKey} message SenderMessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderMessageKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.iteration != null && Object.hasOwnProperty.call(message, "iteration"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.iteration);
            if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.seed);
            return writer;
        };

        /**
         * Encodes the specified SenderMessageKey message, length delimited. Does not implicitly {@link groupproto.SenderMessageKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {groupproto.ISenderMessageKey} message SenderMessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderMessageKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderMessageKey message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderMessageKey} SenderMessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderMessageKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderMessageKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.iteration = reader.uint32();
                    break;
                case 2:
                    message.seed = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderMessageKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderMessageKey} SenderMessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderMessageKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderMessageKey message.
         * @function verify
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderMessageKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                if (!$util.isInteger(message.iteration))
                    return "iteration: integer expected";
            if (message.seed != null && message.hasOwnProperty("seed"))
                if (!(message.seed && typeof message.seed.length === "number" || $util.isString(message.seed)))
                    return "seed: buffer expected";
            return null;
        };

        /**
         * Creates a SenderMessageKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderMessageKey} SenderMessageKey
         */
        SenderMessageKey.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderMessageKey)
                return object;
            var message = new $root.groupproto.SenderMessageKey();
            if (object.iteration != null)
                message.iteration = object.iteration >>> 0;
            if (object.seed != null)
                if (typeof object.seed === "string")
                    $util.base64.decode(object.seed, message.seed = $util.newBuffer($util.base64.length(object.seed)), 0);
                else if (object.seed.length)
                    message.seed = object.seed;
            return message;
        };

        /**
         * Creates a plain object from a SenderMessageKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderMessageKey
         * @static
         * @param {groupproto.SenderMessageKey} message SenderMessageKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderMessageKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.iteration = 0;
                if (options.bytes === String)
                    object.seed = "";
                else {
                    object.seed = [];
                    if (options.bytes !== Array)
                        object.seed = $util.newBuffer(object.seed);
                }
            }
            if (message.iteration != null && message.hasOwnProperty("iteration"))
                object.iteration = message.iteration;
            if (message.seed != null && message.hasOwnProperty("seed"))
                object.seed = options.bytes === String ? $util.base64.encode(message.seed, 0, message.seed.length) : options.bytes === Array ? Array.prototype.slice.call(message.seed) : message.seed;
            return object;
        };

        /**
         * Converts this SenderMessageKey to JSON.
         * @function toJSON
         * @memberof groupproto.SenderMessageKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderMessageKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderMessageKey;
    })();

    groupproto.SenderSigningKey = (function() {

        /**
         * Properties of a SenderSigningKey.
         * @memberof groupproto
         * @interface ISenderSigningKey
         * @property {Uint8Array|null} ["public"] SenderSigningKey public
         * @property {Uint8Array|null} ["private"] SenderSigningKey private
         */

        /**
         * Constructs a new SenderSigningKey.
         * @memberof groupproto
         * @classdesc Represents a SenderSigningKey.
         * @implements ISenderSigningKey
         * @constructor
         * @param {groupproto.ISenderSigningKey=} [properties] Properties to set
         */
        function SenderSigningKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderSigningKey public.
         * @member {Uint8Array} public
         * @memberof groupproto.SenderSigningKey
         * @instance
         */
        SenderSigningKey.prototype["public"] = $util.newBuffer([]);

        /**
         * SenderSigningKey private.
         * @member {Uint8Array} private
         * @memberof groupproto.SenderSigningKey
         * @instance
         */
        SenderSigningKey.prototype["private"] = $util.newBuffer([]);

        /**
         * Creates a new SenderSigningKey instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {groupproto.ISenderSigningKey=} [properties] Properties to set
         * @returns {groupproto.SenderSigningKey} SenderSigningKey instance
         */
        SenderSigningKey.create = function create(properties) {
            return new SenderSigningKey(properties);
        };

        /**
         * Encodes the specified SenderSigningKey message. Does not implicitly {@link groupproto.SenderSigningKey.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {groupproto.ISenderSigningKey} message SenderSigningKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderSigningKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message["public"] != null && Object.hasOwnProperty.call(message, "public"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message["public"]);
            if (message["private"] != null && Object.hasOwnProperty.call(message, "private"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message["private"]);
            return writer;
        };

        /**
         * Encodes the specified SenderSigningKey message, length delimited. Does not implicitly {@link groupproto.SenderSigningKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {groupproto.ISenderSigningKey} message SenderSigningKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderSigningKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderSigningKey message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderSigningKey} SenderSigningKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderSigningKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderSigningKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message["public"] = reader.bytes();
                    break;
                case 2:
                    message["private"] = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderSigningKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderSigningKey} SenderSigningKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderSigningKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderSigningKey message.
         * @function verify
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderSigningKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message["public"] != null && message.hasOwnProperty("public"))
                if (!(message["public"] && typeof message["public"].length === "number" || $util.isString(message["public"])))
                    return "public: buffer expected";
            if (message["private"] != null && message.hasOwnProperty("private"))
                if (!(message["private"] && typeof message["private"].length === "number" || $util.isString(message["private"])))
                    return "private: buffer expected";
            return null;
        };

        /**
         * Creates a SenderSigningKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderSigningKey} SenderSigningKey
         */
        SenderSigningKey.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderSigningKey)
                return object;
            var message = new $root.groupproto.SenderSigningKey();
            if (object["public"] != null)
                if (typeof object["public"] === "string")
                    $util.base64.decode(object["public"], message["public"] = $util.newBuffer($util.base64.length(object["public"])), 0);
                else if (object["public"].length)
                    message["public"] = object["public"];
            if (object["private"] != null)
                if (typeof object["private"] === "string")
                    $util.base64.decode(object["private"], message["private"] = $util.newBuffer($util.base64.length(object["private"])), 0);
                else if (object["private"].length)
                    message["private"] = object["private"];
            return message;
        };

        /**
         * Creates a plain object from a SenderSigningKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderSigningKey
         * @static
         * @param {groupproto.SenderSigningKey} message SenderSigningKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderSigningKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object["public"] = "";
                else {
                    object["public"] = [];
                    if (options.bytes !== Array)
                        object["public"] = $util.newBuffer(object["public"]);
                }
                if (options.bytes === String)
                    object["private"] = "";
                else {
                    object["private"] = [];
                    if (options.bytes !== Array)
                        object["private"] = $util.newBuffer(object["private"]);
                }
            }
            if (message["public"] != null && message.hasOwnProperty("public"))
                object["public"] = options.bytes === String ? $util.base64.encode(message["public"], 0, message["public"].length) : options.bytes === Array ? Array.prototype.slice.call(message["public"]) : message["public"];
            if (message["private"] != null && message.hasOwnProperty("private"))
                object["private"] = options.bytes === String ? $util.base64.encode(message["private"], 0, message["private"].length) : options.bytes === Array ? Array.prototype.slice.call(message["private"]) : message["private"];
            return object;
        };

        /**
         * Converts this SenderSigningKey to JSON.
         * @function toJSON
         * @memberof groupproto.SenderSigningKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderSigningKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderSigningKey;
    })();

    groupproto.SenderKeyStateStructure = (function() {

        /**
         * Properties of a SenderKeyStateStructure.
         * @memberof groupproto
         * @interface ISenderKeyStateStructure
         * @property {number|null} [senderKeyId] SenderKeyStateStructure senderKeyId
         * @property {groupproto.ISenderChainKey|null} [senderChainKey] SenderKeyStateStructure senderChainKey
         * @property {groupproto.ISenderSigningKey|null} [senderSigningKey] SenderKeyStateStructure senderSigningKey
         * @property {Array.<groupproto.ISenderMessageKey>|null} [senderMessageKeys] SenderKeyStateStructure senderMessageKeys
         */

        /**
         * Constructs a new SenderKeyStateStructure.
         * @memberof groupproto
         * @classdesc Represents a SenderKeyStateStructure.
         * @implements ISenderKeyStateStructure
         * @constructor
         * @param {groupproto.ISenderKeyStateStructure=} [properties] Properties to set
         */
        function SenderKeyStateStructure(properties) {
            this.senderMessageKeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKeyStateStructure senderKeyId.
         * @member {number} senderKeyId
         * @memberof groupproto.SenderKeyStateStructure
         * @instance
         */
        SenderKeyStateStructure.prototype.senderKeyId = 0;

        /**
         * SenderKeyStateStructure senderChainKey.
         * @member {groupproto.ISenderChainKey|null|undefined} senderChainKey
         * @memberof groupproto.SenderKeyStateStructure
         * @instance
         */
        SenderKeyStateStructure.prototype.senderChainKey = null;

        /**
         * SenderKeyStateStructure senderSigningKey.
         * @member {groupproto.ISenderSigningKey|null|undefined} senderSigningKey
         * @memberof groupproto.SenderKeyStateStructure
         * @instance
         */
        SenderKeyStateStructure.prototype.senderSigningKey = null;

        /**
         * SenderKeyStateStructure senderMessageKeys.
         * @member {Array.<groupproto.ISenderMessageKey>} senderMessageKeys
         * @memberof groupproto.SenderKeyStateStructure
         * @instance
         */
        SenderKeyStateStructure.prototype.senderMessageKeys = $util.emptyArray;

        /**
         * Creates a new SenderKeyStateStructure instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {groupproto.ISenderKeyStateStructure=} [properties] Properties to set
         * @returns {groupproto.SenderKeyStateStructure} SenderKeyStateStructure instance
         */
        SenderKeyStateStructure.create = function create(properties) {
            return new SenderKeyStateStructure(properties);
        };

        /**
         * Encodes the specified SenderKeyStateStructure message. Does not implicitly {@link groupproto.SenderKeyStateStructure.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {groupproto.ISenderKeyStateStructure} message SenderKeyStateStructure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyStateStructure.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderKeyId != null && Object.hasOwnProperty.call(message, "senderKeyId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.senderKeyId);
            if (message.senderChainKey != null && Object.hasOwnProperty.call(message, "senderChainKey"))
                $root.groupproto.SenderChainKey.encode(message.senderChainKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.senderSigningKey != null && Object.hasOwnProperty.call(message, "senderSigningKey"))
                $root.groupproto.SenderSigningKey.encode(message.senderSigningKey, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.senderMessageKeys != null && message.senderMessageKeys.length)
                for (var i = 0; i < message.senderMessageKeys.length; ++i)
                    $root.groupproto.SenderMessageKey.encode(message.senderMessageKeys[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SenderKeyStateStructure message, length delimited. Does not implicitly {@link groupproto.SenderKeyStateStructure.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {groupproto.ISenderKeyStateStructure} message SenderKeyStateStructure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyStateStructure.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKeyStateStructure message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderKeyStateStructure} SenderKeyStateStructure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyStateStructure.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderKeyStateStructure();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.senderKeyId = reader.uint32();
                    break;
                case 2:
                    message.senderChainKey = $root.groupproto.SenderChainKey.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.senderSigningKey = $root.groupproto.SenderSigningKey.decode(reader, reader.uint32());
                    break;
                case 4:
                    if (!(message.senderMessageKeys && message.senderMessageKeys.length))
                        message.senderMessageKeys = [];
                    message.senderMessageKeys.push($root.groupproto.SenderMessageKey.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderKeyStateStructure message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderKeyStateStructure} SenderKeyStateStructure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyStateStructure.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderKeyStateStructure message.
         * @function verify
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKeyStateStructure.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderKeyId != null && message.hasOwnProperty("senderKeyId"))
                if (!$util.isInteger(message.senderKeyId))
                    return "senderKeyId: integer expected";
            if (message.senderChainKey != null && message.hasOwnProperty("senderChainKey")) {
                var error = $root.groupproto.SenderChainKey.verify(message.senderChainKey);
                if (error)
                    return "senderChainKey." + error;
            }
            if (message.senderSigningKey != null && message.hasOwnProperty("senderSigningKey")) {
                var error = $root.groupproto.SenderSigningKey.verify(message.senderSigningKey);
                if (error)
                    return "senderSigningKey." + error;
            }
            if (message.senderMessageKeys != null && message.hasOwnProperty("senderMessageKeys")) {
                if (!Array.isArray(message.senderMessageKeys))
                    return "senderMessageKeys: array expected";
                for (var i = 0; i < message.senderMessageKeys.length; ++i) {
                    var error = $root.groupproto.SenderMessageKey.verify(message.senderMessageKeys[i]);
                    if (error)
                        return "senderMessageKeys." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SenderKeyStateStructure message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderKeyStateStructure} SenderKeyStateStructure
         */
        SenderKeyStateStructure.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderKeyStateStructure)
                return object;
            var message = new $root.groupproto.SenderKeyStateStructure();
            if (object.senderKeyId != null)
                message.senderKeyId = object.senderKeyId >>> 0;
            if (object.senderChainKey != null) {
                if (typeof object.senderChainKey !== "object")
                    throw TypeError(".groupproto.SenderKeyStateStructure.senderChainKey: object expected");
                message.senderChainKey = $root.groupproto.SenderChainKey.fromObject(object.senderChainKey);
            }
            if (object.senderSigningKey != null) {
                if (typeof object.senderSigningKey !== "object")
                    throw TypeError(".groupproto.SenderKeyStateStructure.senderSigningKey: object expected");
                message.senderSigningKey = $root.groupproto.SenderSigningKey.fromObject(object.senderSigningKey);
            }
            if (object.senderMessageKeys) {
                if (!Array.isArray(object.senderMessageKeys))
                    throw TypeError(".groupproto.SenderKeyStateStructure.senderMessageKeys: array expected");
                message.senderMessageKeys = [];
                for (var i = 0; i < object.senderMessageKeys.length; ++i) {
                    if (typeof object.senderMessageKeys[i] !== "object")
                        throw TypeError(".groupproto.SenderKeyStateStructure.senderMessageKeys: object expected");
                    message.senderMessageKeys[i] = $root.groupproto.SenderMessageKey.fromObject(object.senderMessageKeys[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SenderKeyStateStructure message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderKeyStateStructure
         * @static
         * @param {groupproto.SenderKeyStateStructure} message SenderKeyStateStructure
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKeyStateStructure.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.senderMessageKeys = [];
            if (options.defaults) {
                object.senderKeyId = 0;
                object.senderChainKey = null;
                object.senderSigningKey = null;
            }
            if (message.senderKeyId != null && message.hasOwnProperty("senderKeyId"))
                object.senderKeyId = message.senderKeyId;
            if (message.senderChainKey != null && message.hasOwnProperty("senderChainKey"))
                object.senderChainKey = $root.groupproto.SenderChainKey.toObject(message.senderChainKey, options);
            if (message.senderSigningKey != null && message.hasOwnProperty("senderSigningKey"))
                object.senderSigningKey = $root.groupproto.SenderSigningKey.toObject(message.senderSigningKey, options);
            if (message.senderMessageKeys && message.senderMessageKeys.length) {
                object.senderMessageKeys = [];
                for (var j = 0; j < message.senderMessageKeys.length; ++j)
                    object.senderMessageKeys[j] = $root.groupproto.SenderMessageKey.toObject(message.senderMessageKeys[j], options);
            }
            return object;
        };

        /**
         * Converts this SenderKeyStateStructure to JSON.
         * @function toJSON
         * @memberof groupproto.SenderKeyStateStructure
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKeyStateStructure.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKeyStateStructure;
    })();

    groupproto.SenderKeyRecordStructure = (function() {

        /**
         * Properties of a SenderKeyRecordStructure.
         * @memberof groupproto
         * @interface ISenderKeyRecordStructure
         * @property {Array.<groupproto.ISenderKeyStateStructure>|null} [senderKeyStates] SenderKeyRecordStructure senderKeyStates
         */

        /**
         * Constructs a new SenderKeyRecordStructure.
         * @memberof groupproto
         * @classdesc Represents a SenderKeyRecordStructure.
         * @implements ISenderKeyRecordStructure
         * @constructor
         * @param {groupproto.ISenderKeyRecordStructure=} [properties] Properties to set
         */
        function SenderKeyRecordStructure(properties) {
            this.senderKeyStates = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKeyRecordStructure senderKeyStates.
         * @member {Array.<groupproto.ISenderKeyStateStructure>} senderKeyStates
         * @memberof groupproto.SenderKeyRecordStructure
         * @instance
         */
        SenderKeyRecordStructure.prototype.senderKeyStates = $util.emptyArray;

        /**
         * Creates a new SenderKeyRecordStructure instance using the specified properties.
         * @function create
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {groupproto.ISenderKeyRecordStructure=} [properties] Properties to set
         * @returns {groupproto.SenderKeyRecordStructure} SenderKeyRecordStructure instance
         */
        SenderKeyRecordStructure.create = function create(properties) {
            return new SenderKeyRecordStructure(properties);
        };

        /**
         * Encodes the specified SenderKeyRecordStructure message. Does not implicitly {@link groupproto.SenderKeyRecordStructure.verify|verify} messages.
         * @function encode
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {groupproto.ISenderKeyRecordStructure} message SenderKeyRecordStructure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyRecordStructure.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderKeyStates != null && message.senderKeyStates.length)
                for (var i = 0; i < message.senderKeyStates.length; ++i)
                    $root.groupproto.SenderKeyStateStructure.encode(message.senderKeyStates[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SenderKeyRecordStructure message, length delimited. Does not implicitly {@link groupproto.SenderKeyRecordStructure.verify|verify} messages.
         * @function encodeDelimited
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {groupproto.ISenderKeyRecordStructure} message SenderKeyRecordStructure message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyRecordStructure.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKeyRecordStructure message from the specified reader or buffer.
         * @function decode
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {groupproto.SenderKeyRecordStructure} SenderKeyRecordStructure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyRecordStructure.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.groupproto.SenderKeyRecordStructure();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.senderKeyStates && message.senderKeyStates.length))
                        message.senderKeyStates = [];
                    message.senderKeyStates.push($root.groupproto.SenderKeyStateStructure.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderKeyRecordStructure message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {groupproto.SenderKeyRecordStructure} SenderKeyRecordStructure
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyRecordStructure.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderKeyRecordStructure message.
         * @function verify
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKeyRecordStructure.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderKeyStates != null && message.hasOwnProperty("senderKeyStates")) {
                if (!Array.isArray(message.senderKeyStates))
                    return "senderKeyStates: array expected";
                for (var i = 0; i < message.senderKeyStates.length; ++i) {
                    var error = $root.groupproto.SenderKeyStateStructure.verify(message.senderKeyStates[i]);
                    if (error)
                        return "senderKeyStates." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SenderKeyRecordStructure message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {groupproto.SenderKeyRecordStructure} SenderKeyRecordStructure
         */
        SenderKeyRecordStructure.fromObject = function fromObject(object) {
            if (object instanceof $root.groupproto.SenderKeyRecordStructure)
                return object;
            var message = new $root.groupproto.SenderKeyRecordStructure();
            if (object.senderKeyStates) {
                if (!Array.isArray(object.senderKeyStates))
                    throw TypeError(".groupproto.SenderKeyRecordStructure.senderKeyStates: array expected");
                message.senderKeyStates = [];
                for (var i = 0; i < object.senderKeyStates.length; ++i) {
                    if (typeof object.senderKeyStates[i] !== "object")
                        throw TypeError(".groupproto.SenderKeyRecordStructure.senderKeyStates: object expected");
                    message.senderKeyStates[i] = $root.groupproto.SenderKeyStateStructure.fromObject(object.senderKeyStates[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SenderKeyRecordStructure message. Also converts values to other types if specified.
         * @function toObject
         * @memberof groupproto.SenderKeyRecordStructure
         * @static
         * @param {groupproto.SenderKeyRecordStructure} message SenderKeyRecordStructure
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKeyRecordStructure.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.senderKeyStates = [];
            if (message.senderKeyStates && message.senderKeyStates.length) {
                object.senderKeyStates = [];
                for (var j = 0; j < message.senderKeyStates.length; ++j)
                    object.senderKeyStates[j] = $root.groupproto.SenderKeyStateStructure.toObject(message.senderKeyStates[j], options);
            }
            return object;
        };

        /**
         * Converts this SenderKeyRecordStructure to JSON.
         * @function toJSON
         * @memberof groupproto.SenderKeyRecordStructure
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKeyRecordStructure.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKeyRecordStructure;
    })();

    return groupproto;
})();

module.exports = $root;
