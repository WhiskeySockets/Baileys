/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WACert = (function() {

    /**
     * Namespace WACert.
     * @exports WACert
     * @namespace
     */
    var WACert = {};

    WACert.NoiseCertificate = (function() {

        /**
         * Properties of a NoiseCertificate.
         * @memberof WACert
         * @interface INoiseCertificate
         * @property {Uint8Array|null} [details] NoiseCertificate details
         * @property {Uint8Array|null} [signature] NoiseCertificate signature
         */

        /**
         * Constructs a new NoiseCertificate.
         * @memberof WACert
         * @classdesc Represents a NoiseCertificate.
         * @implements INoiseCertificate
         * @constructor
         * @param {WACert.INoiseCertificate=} [properties] Properties to set
         */
        function NoiseCertificate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NoiseCertificate details.
         * @member {Uint8Array} details
         * @memberof WACert.NoiseCertificate
         * @instance
         */
        NoiseCertificate.prototype.details = $util.newBuffer([]);

        /**
         * NoiseCertificate signature.
         * @member {Uint8Array} signature
         * @memberof WACert.NoiseCertificate
         * @instance
         */
        NoiseCertificate.prototype.signature = $util.newBuffer([]);

        /**
         * Creates a new NoiseCertificate instance using the specified properties.
         * @function create
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {WACert.INoiseCertificate=} [properties] Properties to set
         * @returns {WACert.NoiseCertificate} NoiseCertificate instance
         */
        NoiseCertificate.create = function create(properties) {
            return new NoiseCertificate(properties);
        };

        /**
         * Encodes the specified NoiseCertificate message. Does not implicitly {@link WACert.NoiseCertificate.verify|verify} messages.
         * @function encode
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {WACert.INoiseCertificate} message NoiseCertificate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoiseCertificate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
            return writer;
        };

        /**
         * Encodes the specified NoiseCertificate message, length delimited. Does not implicitly {@link WACert.NoiseCertificate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {WACert.INoiseCertificate} message NoiseCertificate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoiseCertificate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NoiseCertificate message from the specified reader or buffer.
         * @function decode
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WACert.NoiseCertificate} NoiseCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoiseCertificate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WACert.NoiseCertificate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.details = reader.bytes();
                        break;
                    }
                case 2: {
                        message.signature = reader.bytes();
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
         * Decodes a NoiseCertificate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WACert.NoiseCertificate} NoiseCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoiseCertificate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NoiseCertificate message.
         * @function verify
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NoiseCertificate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details"))
                if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                    return "details: buffer expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            return null;
        };

        /**
         * Creates a NoiseCertificate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WACert.NoiseCertificate} NoiseCertificate
         */
        NoiseCertificate.fromObject = function fromObject(object) {
            if (object instanceof $root.WACert.NoiseCertificate)
                return object;
            var message = new $root.WACert.NoiseCertificate();
            if (object.details != null)
                if (typeof object.details === "string")
                    $util.base64.decode(object.details, message.details = $util.newBuffer($util.base64.length(object.details)), 0);
                else if (object.details.length >= 0)
                    message.details = object.details;
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length >= 0)
                    message.signature = object.signature;
            return message;
        };

        /**
         * Creates a plain object from a NoiseCertificate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {WACert.NoiseCertificate} message NoiseCertificate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NoiseCertificate.toObject = function toObject(message, options) {
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
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            return object;
        };

        /**
         * Converts this NoiseCertificate to JSON.
         * @function toJSON
         * @memberof WACert.NoiseCertificate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NoiseCertificate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for NoiseCertificate
         * @function getTypeUrl
         * @memberof WACert.NoiseCertificate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NoiseCertificate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WACert.NoiseCertificate";
        };

        NoiseCertificate.Details = (function() {

            /**
             * Properties of a Details.
             * @memberof WACert.NoiseCertificate
             * @interface IDetails
             * @property {number|null} [serial] Details serial
             * @property {string|null} [issuer] Details issuer
             * @property {number|Long|null} [expires] Details expires
             * @property {string|null} [subject] Details subject
             * @property {Uint8Array|null} [key] Details key
             */

            /**
             * Constructs a new Details.
             * @memberof WACert.NoiseCertificate
             * @classdesc Represents a Details.
             * @implements IDetails
             * @constructor
             * @param {WACert.NoiseCertificate.IDetails=} [properties] Properties to set
             */
            function Details(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Details serial.
             * @member {number} serial
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             */
            Details.prototype.serial = 0;

            /**
             * Details issuer.
             * @member {string} issuer
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             */
            Details.prototype.issuer = "";

            /**
             * Details expires.
             * @member {number|Long} expires
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             */
            Details.prototype.expires = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Details subject.
             * @member {string} subject
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             */
            Details.prototype.subject = "";

            /**
             * Details key.
             * @member {Uint8Array} key
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             */
            Details.prototype.key = $util.newBuffer([]);

            /**
             * Creates a new Details instance using the specified properties.
             * @function create
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {WACert.NoiseCertificate.IDetails=} [properties] Properties to set
             * @returns {WACert.NoiseCertificate.Details} Details instance
             */
            Details.create = function create(properties) {
                return new Details(properties);
            };

            /**
             * Encodes the specified Details message. Does not implicitly {@link WACert.NoiseCertificate.Details.verify|verify} messages.
             * @function encode
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {WACert.NoiseCertificate.IDetails} message Details message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Details.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.serial != null && Object.hasOwnProperty.call(message, "serial"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.serial);
                if (message.issuer != null && Object.hasOwnProperty.call(message, "issuer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.issuer);
                if (message.expires != null && Object.hasOwnProperty.call(message, "expires"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.expires);
                if (message.subject != null && Object.hasOwnProperty.call(message, "subject"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.subject);
                if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.key);
                return writer;
            };

            /**
             * Encodes the specified Details message, length delimited. Does not implicitly {@link WACert.NoiseCertificate.Details.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {WACert.NoiseCertificate.IDetails} message Details message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Details.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Details message from the specified reader or buffer.
             * @function decode
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WACert.NoiseCertificate.Details} Details
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Details.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WACert.NoiseCertificate.Details();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.serial = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.issuer = reader.string();
                            break;
                        }
                    case 3: {
                            message.expires = reader.uint64();
                            break;
                        }
                    case 4: {
                            message.subject = reader.string();
                            break;
                        }
                    case 5: {
                            message.key = reader.bytes();
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
             * Decodes a Details message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WACert.NoiseCertificate.Details} Details
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Details.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Details message.
             * @function verify
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Details.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.serial != null && message.hasOwnProperty("serial"))
                    if (!$util.isInteger(message.serial))
                        return "serial: integer expected";
                if (message.issuer != null && message.hasOwnProperty("issuer"))
                    if (!$util.isString(message.issuer))
                        return "issuer: string expected";
                if (message.expires != null && message.hasOwnProperty("expires"))
                    if (!$util.isInteger(message.expires) && !(message.expires && $util.isInteger(message.expires.low) && $util.isInteger(message.expires.high)))
                        return "expires: integer|Long expected";
                if (message.subject != null && message.hasOwnProperty("subject"))
                    if (!$util.isString(message.subject))
                        return "subject: string expected";
                if (message.key != null && message.hasOwnProperty("key"))
                    if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                        return "key: buffer expected";
                return null;
            };

            /**
             * Creates a Details message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WACert.NoiseCertificate.Details} Details
             */
            Details.fromObject = function fromObject(object) {
                if (object instanceof $root.WACert.NoiseCertificate.Details)
                    return object;
                var message = new $root.WACert.NoiseCertificate.Details();
                if (object.serial != null)
                    message.serial = object.serial >>> 0;
                if (object.issuer != null)
                    message.issuer = String(object.issuer);
                if (object.expires != null)
                    if ($util.Long)
                        (message.expires = $util.Long.fromValue(object.expires)).unsigned = true;
                    else if (typeof object.expires === "string")
                        message.expires = parseInt(object.expires, 10);
                    else if (typeof object.expires === "number")
                        message.expires = object.expires;
                    else if (typeof object.expires === "object")
                        message.expires = new $util.LongBits(object.expires.low >>> 0, object.expires.high >>> 0).toNumber(true);
                if (object.subject != null)
                    message.subject = String(object.subject);
                if (object.key != null)
                    if (typeof object.key === "string")
                        $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                    else if (object.key.length >= 0)
                        message.key = object.key;
                return message;
            };

            /**
             * Creates a plain object from a Details message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {WACert.NoiseCertificate.Details} message Details
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Details.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.serial = 0;
                    object.issuer = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.expires = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.expires = options.longs === String ? "0" : 0;
                    object.subject = "";
                    if (options.bytes === String)
                        object.key = "";
                    else {
                        object.key = [];
                        if (options.bytes !== Array)
                            object.key = $util.newBuffer(object.key);
                    }
                }
                if (message.serial != null && message.hasOwnProperty("serial"))
                    object.serial = message.serial;
                if (message.issuer != null && message.hasOwnProperty("issuer"))
                    object.issuer = message.issuer;
                if (message.expires != null && message.hasOwnProperty("expires"))
                    if (typeof message.expires === "number")
                        object.expires = options.longs === String ? String(message.expires) : message.expires;
                    else
                        object.expires = options.longs === String ? $util.Long.prototype.toString.call(message.expires) : options.longs === Number ? new $util.LongBits(message.expires.low >>> 0, message.expires.high >>> 0).toNumber(true) : message.expires;
                if (message.subject != null && message.hasOwnProperty("subject"))
                    object.subject = message.subject;
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
                return object;
            };

            /**
             * Converts this Details to JSON.
             * @function toJSON
             * @memberof WACert.NoiseCertificate.Details
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Details.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Details
             * @function getTypeUrl
             * @memberof WACert.NoiseCertificate.Details
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Details.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WACert.NoiseCertificate.Details";
            };

            return Details;
        })();

        return NoiseCertificate;
    })();

    WACert.CertChain = (function() {

        /**
         * Properties of a CertChain.
         * @memberof WACert
         * @interface ICertChain
         * @property {WACert.CertChain.INoiseCertificate|null} [leaf] CertChain leaf
         * @property {WACert.CertChain.INoiseCertificate|null} [intermediate] CertChain intermediate
         */

        /**
         * Constructs a new CertChain.
         * @memberof WACert
         * @classdesc Represents a CertChain.
         * @implements ICertChain
         * @constructor
         * @param {WACert.ICertChain=} [properties] Properties to set
         */
        function CertChain(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CertChain leaf.
         * @member {WACert.CertChain.INoiseCertificate|null|undefined} leaf
         * @memberof WACert.CertChain
         * @instance
         */
        CertChain.prototype.leaf = null;

        /**
         * CertChain intermediate.
         * @member {WACert.CertChain.INoiseCertificate|null|undefined} intermediate
         * @memberof WACert.CertChain
         * @instance
         */
        CertChain.prototype.intermediate = null;

        /**
         * Creates a new CertChain instance using the specified properties.
         * @function create
         * @memberof WACert.CertChain
         * @static
         * @param {WACert.ICertChain=} [properties] Properties to set
         * @returns {WACert.CertChain} CertChain instance
         */
        CertChain.create = function create(properties) {
            return new CertChain(properties);
        };

        /**
         * Encodes the specified CertChain message. Does not implicitly {@link WACert.CertChain.verify|verify} messages.
         * @function encode
         * @memberof WACert.CertChain
         * @static
         * @param {WACert.ICertChain} message CertChain message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CertChain.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.leaf != null && Object.hasOwnProperty.call(message, "leaf"))
                $root.WACert.CertChain.NoiseCertificate.encode(message.leaf, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.intermediate != null && Object.hasOwnProperty.call(message, "intermediate"))
                $root.WACert.CertChain.NoiseCertificate.encode(message.intermediate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CertChain message, length delimited. Does not implicitly {@link WACert.CertChain.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WACert.CertChain
         * @static
         * @param {WACert.ICertChain} message CertChain message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CertChain.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CertChain message from the specified reader or buffer.
         * @function decode
         * @memberof WACert.CertChain
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WACert.CertChain} CertChain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CertChain.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WACert.CertChain();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.leaf = $root.WACert.CertChain.NoiseCertificate.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.intermediate = $root.WACert.CertChain.NoiseCertificate.decode(reader, reader.uint32());
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
         * Decodes a CertChain message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WACert.CertChain
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WACert.CertChain} CertChain
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CertChain.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CertChain message.
         * @function verify
         * @memberof WACert.CertChain
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CertChain.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.leaf != null && message.hasOwnProperty("leaf")) {
                var error = $root.WACert.CertChain.NoiseCertificate.verify(message.leaf);
                if (error)
                    return "leaf." + error;
            }
            if (message.intermediate != null && message.hasOwnProperty("intermediate")) {
                var error = $root.WACert.CertChain.NoiseCertificate.verify(message.intermediate);
                if (error)
                    return "intermediate." + error;
            }
            return null;
        };

        /**
         * Creates a CertChain message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WACert.CertChain
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WACert.CertChain} CertChain
         */
        CertChain.fromObject = function fromObject(object) {
            if (object instanceof $root.WACert.CertChain)
                return object;
            var message = new $root.WACert.CertChain();
            if (object.leaf != null) {
                if (typeof object.leaf !== "object")
                    throw TypeError(".WACert.CertChain.leaf: object expected");
                message.leaf = $root.WACert.CertChain.NoiseCertificate.fromObject(object.leaf);
            }
            if (object.intermediate != null) {
                if (typeof object.intermediate !== "object")
                    throw TypeError(".WACert.CertChain.intermediate: object expected");
                message.intermediate = $root.WACert.CertChain.NoiseCertificate.fromObject(object.intermediate);
            }
            return message;
        };

        /**
         * Creates a plain object from a CertChain message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WACert.CertChain
         * @static
         * @param {WACert.CertChain} message CertChain
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CertChain.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.leaf = null;
                object.intermediate = null;
            }
            if (message.leaf != null && message.hasOwnProperty("leaf"))
                object.leaf = $root.WACert.CertChain.NoiseCertificate.toObject(message.leaf, options);
            if (message.intermediate != null && message.hasOwnProperty("intermediate"))
                object.intermediate = $root.WACert.CertChain.NoiseCertificate.toObject(message.intermediate, options);
            return object;
        };

        /**
         * Converts this CertChain to JSON.
         * @function toJSON
         * @memberof WACert.CertChain
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CertChain.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CertChain
         * @function getTypeUrl
         * @memberof WACert.CertChain
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CertChain.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WACert.CertChain";
        };

        CertChain.NoiseCertificate = (function() {

            /**
             * Properties of a NoiseCertificate.
             * @memberof WACert.CertChain
             * @interface INoiseCertificate
             * @property {Uint8Array|null} [details] NoiseCertificate details
             * @property {Uint8Array|null} [signature] NoiseCertificate signature
             */

            /**
             * Constructs a new NoiseCertificate.
             * @memberof WACert.CertChain
             * @classdesc Represents a NoiseCertificate.
             * @implements INoiseCertificate
             * @constructor
             * @param {WACert.CertChain.INoiseCertificate=} [properties] Properties to set
             */
            function NoiseCertificate(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NoiseCertificate details.
             * @member {Uint8Array} details
             * @memberof WACert.CertChain.NoiseCertificate
             * @instance
             */
            NoiseCertificate.prototype.details = $util.newBuffer([]);

            /**
             * NoiseCertificate signature.
             * @member {Uint8Array} signature
             * @memberof WACert.CertChain.NoiseCertificate
             * @instance
             */
            NoiseCertificate.prototype.signature = $util.newBuffer([]);

            /**
             * Creates a new NoiseCertificate instance using the specified properties.
             * @function create
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {WACert.CertChain.INoiseCertificate=} [properties] Properties to set
             * @returns {WACert.CertChain.NoiseCertificate} NoiseCertificate instance
             */
            NoiseCertificate.create = function create(properties) {
                return new NoiseCertificate(properties);
            };

            /**
             * Encodes the specified NoiseCertificate message. Does not implicitly {@link WACert.CertChain.NoiseCertificate.verify|verify} messages.
             * @function encode
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {WACert.CertChain.INoiseCertificate} message NoiseCertificate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoiseCertificate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
                if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
                return writer;
            };

            /**
             * Encodes the specified NoiseCertificate message, length delimited. Does not implicitly {@link WACert.CertChain.NoiseCertificate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {WACert.CertChain.INoiseCertificate} message NoiseCertificate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoiseCertificate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NoiseCertificate message from the specified reader or buffer.
             * @function decode
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WACert.CertChain.NoiseCertificate} NoiseCertificate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoiseCertificate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WACert.CertChain.NoiseCertificate();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.details = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.signature = reader.bytes();
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
             * Decodes a NoiseCertificate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WACert.CertChain.NoiseCertificate} NoiseCertificate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoiseCertificate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NoiseCertificate message.
             * @function verify
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NoiseCertificate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.details != null && message.hasOwnProperty("details"))
                    if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                        return "details: buffer expected";
                if (message.signature != null && message.hasOwnProperty("signature"))
                    if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                        return "signature: buffer expected";
                return null;
            };

            /**
             * Creates a NoiseCertificate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WACert.CertChain.NoiseCertificate} NoiseCertificate
             */
            NoiseCertificate.fromObject = function fromObject(object) {
                if (object instanceof $root.WACert.CertChain.NoiseCertificate)
                    return object;
                var message = new $root.WACert.CertChain.NoiseCertificate();
                if (object.details != null)
                    if (typeof object.details === "string")
                        $util.base64.decode(object.details, message.details = $util.newBuffer($util.base64.length(object.details)), 0);
                    else if (object.details.length >= 0)
                        message.details = object.details;
                if (object.signature != null)
                    if (typeof object.signature === "string")
                        $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                    else if (object.signature.length >= 0)
                        message.signature = object.signature;
                return message;
            };

            /**
             * Creates a plain object from a NoiseCertificate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {WACert.CertChain.NoiseCertificate} message NoiseCertificate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NoiseCertificate.toObject = function toObject(message, options) {
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
                        object.signature = "";
                    else {
                        object.signature = [];
                        if (options.bytes !== Array)
                            object.signature = $util.newBuffer(object.signature);
                    }
                }
                if (message.details != null && message.hasOwnProperty("details"))
                    object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
                if (message.signature != null && message.hasOwnProperty("signature"))
                    object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
                return object;
            };

            /**
             * Converts this NoiseCertificate to JSON.
             * @function toJSON
             * @memberof WACert.CertChain.NoiseCertificate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NoiseCertificate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NoiseCertificate
             * @function getTypeUrl
             * @memberof WACert.CertChain.NoiseCertificate
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NoiseCertificate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WACert.CertChain.NoiseCertificate";
            };

            NoiseCertificate.Details = (function() {

                /**
                 * Properties of a Details.
                 * @memberof WACert.CertChain.NoiseCertificate
                 * @interface IDetails
                 * @property {number|null} [serial] Details serial
                 * @property {number|null} [issuerSerial] Details issuerSerial
                 * @property {Uint8Array|null} [key] Details key
                 * @property {number|Long|null} [notBefore] Details notBefore
                 * @property {number|Long|null} [notAfter] Details notAfter
                 */

                /**
                 * Constructs a new Details.
                 * @memberof WACert.CertChain.NoiseCertificate
                 * @classdesc Represents a Details.
                 * @implements IDetails
                 * @constructor
                 * @param {WACert.CertChain.NoiseCertificate.IDetails=} [properties] Properties to set
                 */
                function Details(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Details serial.
                 * @member {number} serial
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 */
                Details.prototype.serial = 0;

                /**
                 * Details issuerSerial.
                 * @member {number} issuerSerial
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 */
                Details.prototype.issuerSerial = 0;

                /**
                 * Details key.
                 * @member {Uint8Array} key
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 */
                Details.prototype.key = $util.newBuffer([]);

                /**
                 * Details notBefore.
                 * @member {number|Long} notBefore
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 */
                Details.prototype.notBefore = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * Details notAfter.
                 * @member {number|Long} notAfter
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 */
                Details.prototype.notAfter = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * Creates a new Details instance using the specified properties.
                 * @function create
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {WACert.CertChain.NoiseCertificate.IDetails=} [properties] Properties to set
                 * @returns {WACert.CertChain.NoiseCertificate.Details} Details instance
                 */
                Details.create = function create(properties) {
                    return new Details(properties);
                };

                /**
                 * Encodes the specified Details message. Does not implicitly {@link WACert.CertChain.NoiseCertificate.Details.verify|verify} messages.
                 * @function encode
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {WACert.CertChain.NoiseCertificate.IDetails} message Details message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Details.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.serial != null && Object.hasOwnProperty.call(message, "serial"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.serial);
                    if (message.issuerSerial != null && Object.hasOwnProperty.call(message, "issuerSerial"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.issuerSerial);
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.key);
                    if (message.notBefore != null && Object.hasOwnProperty.call(message, "notBefore"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.notBefore);
                    if (message.notAfter != null && Object.hasOwnProperty.call(message, "notAfter"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.notAfter);
                    return writer;
                };

                /**
                 * Encodes the specified Details message, length delimited. Does not implicitly {@link WACert.CertChain.NoiseCertificate.Details.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {WACert.CertChain.NoiseCertificate.IDetails} message Details message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Details.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Details message from the specified reader or buffer.
                 * @function decode
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {WACert.CertChain.NoiseCertificate.Details} Details
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Details.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WACert.CertChain.NoiseCertificate.Details();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.serial = reader.uint32();
                                break;
                            }
                        case 2: {
                                message.issuerSerial = reader.uint32();
                                break;
                            }
                        case 3: {
                                message.key = reader.bytes();
                                break;
                            }
                        case 4: {
                                message.notBefore = reader.uint64();
                                break;
                            }
                        case 5: {
                                message.notAfter = reader.uint64();
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
                 * Decodes a Details message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {WACert.CertChain.NoiseCertificate.Details} Details
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Details.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Details message.
                 * @function verify
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Details.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.serial != null && message.hasOwnProperty("serial"))
                        if (!$util.isInteger(message.serial))
                            return "serial: integer expected";
                    if (message.issuerSerial != null && message.hasOwnProperty("issuerSerial"))
                        if (!$util.isInteger(message.issuerSerial))
                            return "issuerSerial: integer expected";
                    if (message.key != null && message.hasOwnProperty("key"))
                        if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                            return "key: buffer expected";
                    if (message.notBefore != null && message.hasOwnProperty("notBefore"))
                        if (!$util.isInteger(message.notBefore) && !(message.notBefore && $util.isInteger(message.notBefore.low) && $util.isInteger(message.notBefore.high)))
                            return "notBefore: integer|Long expected";
                    if (message.notAfter != null && message.hasOwnProperty("notAfter"))
                        if (!$util.isInteger(message.notAfter) && !(message.notAfter && $util.isInteger(message.notAfter.low) && $util.isInteger(message.notAfter.high)))
                            return "notAfter: integer|Long expected";
                    return null;
                };

                /**
                 * Creates a Details message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {WACert.CertChain.NoiseCertificate.Details} Details
                 */
                Details.fromObject = function fromObject(object) {
                    if (object instanceof $root.WACert.CertChain.NoiseCertificate.Details)
                        return object;
                    var message = new $root.WACert.CertChain.NoiseCertificate.Details();
                    if (object.serial != null)
                        message.serial = object.serial >>> 0;
                    if (object.issuerSerial != null)
                        message.issuerSerial = object.issuerSerial >>> 0;
                    if (object.key != null)
                        if (typeof object.key === "string")
                            $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                        else if (object.key.length >= 0)
                            message.key = object.key;
                    if (object.notBefore != null)
                        if ($util.Long)
                            (message.notBefore = $util.Long.fromValue(object.notBefore)).unsigned = true;
                        else if (typeof object.notBefore === "string")
                            message.notBefore = parseInt(object.notBefore, 10);
                        else if (typeof object.notBefore === "number")
                            message.notBefore = object.notBefore;
                        else if (typeof object.notBefore === "object")
                            message.notBefore = new $util.LongBits(object.notBefore.low >>> 0, object.notBefore.high >>> 0).toNumber(true);
                    if (object.notAfter != null)
                        if ($util.Long)
                            (message.notAfter = $util.Long.fromValue(object.notAfter)).unsigned = true;
                        else if (typeof object.notAfter === "string")
                            message.notAfter = parseInt(object.notAfter, 10);
                        else if (typeof object.notAfter === "number")
                            message.notAfter = object.notAfter;
                        else if (typeof object.notAfter === "object")
                            message.notAfter = new $util.LongBits(object.notAfter.low >>> 0, object.notAfter.high >>> 0).toNumber(true);
                    return message;
                };

                /**
                 * Creates a plain object from a Details message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {WACert.CertChain.NoiseCertificate.Details} message Details
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Details.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.serial = 0;
                        object.issuerSerial = 0;
                        if (options.bytes === String)
                            object.key = "";
                        else {
                            object.key = [];
                            if (options.bytes !== Array)
                                object.key = $util.newBuffer(object.key);
                        }
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.notBefore = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.notBefore = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.notAfter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.notAfter = options.longs === String ? "0" : 0;
                    }
                    if (message.serial != null && message.hasOwnProperty("serial"))
                        object.serial = message.serial;
                    if (message.issuerSerial != null && message.hasOwnProperty("issuerSerial"))
                        object.issuerSerial = message.issuerSerial;
                    if (message.key != null && message.hasOwnProperty("key"))
                        object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
                    if (message.notBefore != null && message.hasOwnProperty("notBefore"))
                        if (typeof message.notBefore === "number")
                            object.notBefore = options.longs === String ? String(message.notBefore) : message.notBefore;
                        else
                            object.notBefore = options.longs === String ? $util.Long.prototype.toString.call(message.notBefore) : options.longs === Number ? new $util.LongBits(message.notBefore.low >>> 0, message.notBefore.high >>> 0).toNumber(true) : message.notBefore;
                    if (message.notAfter != null && message.hasOwnProperty("notAfter"))
                        if (typeof message.notAfter === "number")
                            object.notAfter = options.longs === String ? String(message.notAfter) : message.notAfter;
                        else
                            object.notAfter = options.longs === String ? $util.Long.prototype.toString.call(message.notAfter) : options.longs === Number ? new $util.LongBits(message.notAfter.low >>> 0, message.notAfter.high >>> 0).toNumber(true) : message.notAfter;
                    return object;
                };

                /**
                 * Converts this Details to JSON.
                 * @function toJSON
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Details.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Details
                 * @function getTypeUrl
                 * @memberof WACert.CertChain.NoiseCertificate.Details
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Details.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/WACert.CertChain.NoiseCertificate.Details";
                };

                return Details;
            })();

            return NoiseCertificate;
        })();

        return CertChain;
    })();

    return WACert;
})();

module.exports = $root;
