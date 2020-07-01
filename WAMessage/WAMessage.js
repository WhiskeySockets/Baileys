/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto = (function() {

    /**
     * Namespace proto.
     * @exports proto
     * @namespace
     */
    var proto = {};

    proto.HydratedQuickReplyButton = (function() {

        /**
         * Properties of a HydratedQuickReplyButton.
         * @memberof proto
         * @interface IHydratedQuickReplyButton
         * @property {string|null} [displayText] HydratedQuickReplyButton displayText
         * @property {string|null} [id] HydratedQuickReplyButton id
         */

        /**
         * Constructs a new HydratedQuickReplyButton.
         * @memberof proto
         * @classdesc Represents a HydratedQuickReplyButton.
         * @implements IHydratedQuickReplyButton
         * @constructor
         * @param {proto.IHydratedQuickReplyButton=} [properties] Properties to set
         */
        function HydratedQuickReplyButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HydratedQuickReplyButton displayText.
         * @member {string} displayText
         * @memberof proto.HydratedQuickReplyButton
         * @instance
         */
        HydratedQuickReplyButton.prototype.displayText = "";

        /**
         * HydratedQuickReplyButton id.
         * @member {string} id
         * @memberof proto.HydratedQuickReplyButton
         * @instance
         */
        HydratedQuickReplyButton.prototype.id = "";

        /**
         * Creates a new HydratedQuickReplyButton instance using the specified properties.
         * @function create
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {proto.IHydratedQuickReplyButton=} [properties] Properties to set
         * @returns {proto.HydratedQuickReplyButton} HydratedQuickReplyButton instance
         */
        HydratedQuickReplyButton.create = function create(properties) {
            return new HydratedQuickReplyButton(properties);
        };

        /**
         * Encodes the specified HydratedQuickReplyButton message. Does not implicitly {@link proto.HydratedQuickReplyButton.verify|verify} messages.
         * @function encode
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {proto.IHydratedQuickReplyButton} message HydratedQuickReplyButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedQuickReplyButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayText);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified HydratedQuickReplyButton message, length delimited. Does not implicitly {@link proto.HydratedQuickReplyButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {proto.IHydratedQuickReplyButton} message HydratedQuickReplyButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedQuickReplyButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HydratedQuickReplyButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HydratedQuickReplyButton} HydratedQuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedQuickReplyButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HydratedQuickReplyButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HydratedQuickReplyButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HydratedQuickReplyButton} HydratedQuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedQuickReplyButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HydratedQuickReplyButton message.
         * @function verify
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HydratedQuickReplyButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                if (!$util.isString(message.displayText))
                    return "displayText: string expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a HydratedQuickReplyButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HydratedQuickReplyButton} HydratedQuickReplyButton
         */
        HydratedQuickReplyButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HydratedQuickReplyButton)
                return object;
            var message = new $root.proto.HydratedQuickReplyButton();
            if (object.displayText != null)
                message.displayText = String(object.displayText);
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a HydratedQuickReplyButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HydratedQuickReplyButton
         * @static
         * @param {proto.HydratedQuickReplyButton} message HydratedQuickReplyButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HydratedQuickReplyButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = "";
                object.id = "";
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = message.displayText;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this HydratedQuickReplyButton to JSON.
         * @function toJSON
         * @memberof proto.HydratedQuickReplyButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HydratedQuickReplyButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HydratedQuickReplyButton;
    })();

    proto.HydratedURLButton = (function() {

        /**
         * Properties of a HydratedURLButton.
         * @memberof proto
         * @interface IHydratedURLButton
         * @property {string|null} [displayText] HydratedURLButton displayText
         * @property {string|null} [url] HydratedURLButton url
         */

        /**
         * Constructs a new HydratedURLButton.
         * @memberof proto
         * @classdesc Represents a HydratedURLButton.
         * @implements IHydratedURLButton
         * @constructor
         * @param {proto.IHydratedURLButton=} [properties] Properties to set
         */
        function HydratedURLButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HydratedURLButton displayText.
         * @member {string} displayText
         * @memberof proto.HydratedURLButton
         * @instance
         */
        HydratedURLButton.prototype.displayText = "";

        /**
         * HydratedURLButton url.
         * @member {string} url
         * @memberof proto.HydratedURLButton
         * @instance
         */
        HydratedURLButton.prototype.url = "";

        /**
         * Creates a new HydratedURLButton instance using the specified properties.
         * @function create
         * @memberof proto.HydratedURLButton
         * @static
         * @param {proto.IHydratedURLButton=} [properties] Properties to set
         * @returns {proto.HydratedURLButton} HydratedURLButton instance
         */
        HydratedURLButton.create = function create(properties) {
            return new HydratedURLButton(properties);
        };

        /**
         * Encodes the specified HydratedURLButton message. Does not implicitly {@link proto.HydratedURLButton.verify|verify} messages.
         * @function encode
         * @memberof proto.HydratedURLButton
         * @static
         * @param {proto.IHydratedURLButton} message HydratedURLButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedURLButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayText);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.url);
            return writer;
        };

        /**
         * Encodes the specified HydratedURLButton message, length delimited. Does not implicitly {@link proto.HydratedURLButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HydratedURLButton
         * @static
         * @param {proto.IHydratedURLButton} message HydratedURLButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedURLButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HydratedURLButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HydratedURLButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HydratedURLButton} HydratedURLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedURLButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HydratedURLButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = reader.string();
                    break;
                case 2:
                    message.url = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HydratedURLButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HydratedURLButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HydratedURLButton} HydratedURLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedURLButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HydratedURLButton message.
         * @function verify
         * @memberof proto.HydratedURLButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HydratedURLButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                if (!$util.isString(message.displayText))
                    return "displayText: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            return null;
        };

        /**
         * Creates a HydratedURLButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HydratedURLButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HydratedURLButton} HydratedURLButton
         */
        HydratedURLButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HydratedURLButton)
                return object;
            var message = new $root.proto.HydratedURLButton();
            if (object.displayText != null)
                message.displayText = String(object.displayText);
            if (object.url != null)
                message.url = String(object.url);
            return message;
        };

        /**
         * Creates a plain object from a HydratedURLButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HydratedURLButton
         * @static
         * @param {proto.HydratedURLButton} message HydratedURLButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HydratedURLButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = "";
                object.url = "";
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = message.displayText;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            return object;
        };

        /**
         * Converts this HydratedURLButton to JSON.
         * @function toJSON
         * @memberof proto.HydratedURLButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HydratedURLButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HydratedURLButton;
    })();

    proto.HydratedCallButton = (function() {

        /**
         * Properties of a HydratedCallButton.
         * @memberof proto
         * @interface IHydratedCallButton
         * @property {string|null} [displayText] HydratedCallButton displayText
         * @property {string|null} [phoneNumber] HydratedCallButton phoneNumber
         */

        /**
         * Constructs a new HydratedCallButton.
         * @memberof proto
         * @classdesc Represents a HydratedCallButton.
         * @implements IHydratedCallButton
         * @constructor
         * @param {proto.IHydratedCallButton=} [properties] Properties to set
         */
        function HydratedCallButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HydratedCallButton displayText.
         * @member {string} displayText
         * @memberof proto.HydratedCallButton
         * @instance
         */
        HydratedCallButton.prototype.displayText = "";

        /**
         * HydratedCallButton phoneNumber.
         * @member {string} phoneNumber
         * @memberof proto.HydratedCallButton
         * @instance
         */
        HydratedCallButton.prototype.phoneNumber = "";

        /**
         * Creates a new HydratedCallButton instance using the specified properties.
         * @function create
         * @memberof proto.HydratedCallButton
         * @static
         * @param {proto.IHydratedCallButton=} [properties] Properties to set
         * @returns {proto.HydratedCallButton} HydratedCallButton instance
         */
        HydratedCallButton.create = function create(properties) {
            return new HydratedCallButton(properties);
        };

        /**
         * Encodes the specified HydratedCallButton message. Does not implicitly {@link proto.HydratedCallButton.verify|verify} messages.
         * @function encode
         * @memberof proto.HydratedCallButton
         * @static
         * @param {proto.IHydratedCallButton} message HydratedCallButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedCallButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayText);
            if (message.phoneNumber != null && Object.hasOwnProperty.call(message, "phoneNumber"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.phoneNumber);
            return writer;
        };

        /**
         * Encodes the specified HydratedCallButton message, length delimited. Does not implicitly {@link proto.HydratedCallButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HydratedCallButton
         * @static
         * @param {proto.IHydratedCallButton} message HydratedCallButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedCallButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HydratedCallButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HydratedCallButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HydratedCallButton} HydratedCallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedCallButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HydratedCallButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = reader.string();
                    break;
                case 2:
                    message.phoneNumber = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HydratedCallButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HydratedCallButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HydratedCallButton} HydratedCallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedCallButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HydratedCallButton message.
         * @function verify
         * @memberof proto.HydratedCallButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HydratedCallButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                if (!$util.isString(message.displayText))
                    return "displayText: string expected";
            if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber"))
                if (!$util.isString(message.phoneNumber))
                    return "phoneNumber: string expected";
            return null;
        };

        /**
         * Creates a HydratedCallButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HydratedCallButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HydratedCallButton} HydratedCallButton
         */
        HydratedCallButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HydratedCallButton)
                return object;
            var message = new $root.proto.HydratedCallButton();
            if (object.displayText != null)
                message.displayText = String(object.displayText);
            if (object.phoneNumber != null)
                message.phoneNumber = String(object.phoneNumber);
            return message;
        };

        /**
         * Creates a plain object from a HydratedCallButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HydratedCallButton
         * @static
         * @param {proto.HydratedCallButton} message HydratedCallButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HydratedCallButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = "";
                object.phoneNumber = "";
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = message.displayText;
            if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber"))
                object.phoneNumber = message.phoneNumber;
            return object;
        };

        /**
         * Converts this HydratedCallButton to JSON.
         * @function toJSON
         * @memberof proto.HydratedCallButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HydratedCallButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HydratedCallButton;
    })();

    proto.HydratedTemplateButton = (function() {

        /**
         * Properties of a HydratedTemplateButton.
         * @memberof proto
         * @interface IHydratedTemplateButton
         * @property {number|null} [index] HydratedTemplateButton index
         * @property {proto.IHydratedQuickReplyButton|null} [quickReplyButton] HydratedTemplateButton quickReplyButton
         * @property {proto.IHydratedURLButton|null} [urlButton] HydratedTemplateButton urlButton
         * @property {proto.IHydratedCallButton|null} [callButton] HydratedTemplateButton callButton
         */

        /**
         * Constructs a new HydratedTemplateButton.
         * @memberof proto
         * @classdesc Represents a HydratedTemplateButton.
         * @implements IHydratedTemplateButton
         * @constructor
         * @param {proto.IHydratedTemplateButton=} [properties] Properties to set
         */
        function HydratedTemplateButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HydratedTemplateButton index.
         * @member {number} index
         * @memberof proto.HydratedTemplateButton
         * @instance
         */
        HydratedTemplateButton.prototype.index = 0;

        /**
         * HydratedTemplateButton quickReplyButton.
         * @member {proto.IHydratedQuickReplyButton|null|undefined} quickReplyButton
         * @memberof proto.HydratedTemplateButton
         * @instance
         */
        HydratedTemplateButton.prototype.quickReplyButton = null;

        /**
         * HydratedTemplateButton urlButton.
         * @member {proto.IHydratedURLButton|null|undefined} urlButton
         * @memberof proto.HydratedTemplateButton
         * @instance
         */
        HydratedTemplateButton.prototype.urlButton = null;

        /**
         * HydratedTemplateButton callButton.
         * @member {proto.IHydratedCallButton|null|undefined} callButton
         * @memberof proto.HydratedTemplateButton
         * @instance
         */
        HydratedTemplateButton.prototype.callButton = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * HydratedTemplateButton hydratedButton.
         * @member {"quickReplyButton"|"urlButton"|"callButton"|undefined} hydratedButton
         * @memberof proto.HydratedTemplateButton
         * @instance
         */
        Object.defineProperty(HydratedTemplateButton.prototype, "hydratedButton", {
            get: $util.oneOfGetter($oneOfFields = ["quickReplyButton", "urlButton", "callButton"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new HydratedTemplateButton instance using the specified properties.
         * @function create
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {proto.IHydratedTemplateButton=} [properties] Properties to set
         * @returns {proto.HydratedTemplateButton} HydratedTemplateButton instance
         */
        HydratedTemplateButton.create = function create(properties) {
            return new HydratedTemplateButton(properties);
        };

        /**
         * Encodes the specified HydratedTemplateButton message. Does not implicitly {@link proto.HydratedTemplateButton.verify|verify} messages.
         * @function encode
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {proto.IHydratedTemplateButton} message HydratedTemplateButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedTemplateButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.quickReplyButton != null && Object.hasOwnProperty.call(message, "quickReplyButton"))
                $root.proto.HydratedQuickReplyButton.encode(message.quickReplyButton, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.urlButton != null && Object.hasOwnProperty.call(message, "urlButton"))
                $root.proto.HydratedURLButton.encode(message.urlButton, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.callButton != null && Object.hasOwnProperty.call(message, "callButton"))
                $root.proto.HydratedCallButton.encode(message.callButton, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.index);
            return writer;
        };

        /**
         * Encodes the specified HydratedTemplateButton message, length delimited. Does not implicitly {@link proto.HydratedTemplateButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {proto.IHydratedTemplateButton} message HydratedTemplateButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedTemplateButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HydratedTemplateButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HydratedTemplateButton} HydratedTemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedTemplateButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HydratedTemplateButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 4:
                    message.index = reader.uint32();
                    break;
                case 1:
                    message.quickReplyButton = $root.proto.HydratedQuickReplyButton.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.urlButton = $root.proto.HydratedURLButton.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.callButton = $root.proto.HydratedCallButton.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HydratedTemplateButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HydratedTemplateButton} HydratedTemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedTemplateButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HydratedTemplateButton message.
         * @function verify
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HydratedTemplateButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.quickReplyButton != null && message.hasOwnProperty("quickReplyButton")) {
                properties.hydratedButton = 1;
                {
                    var error = $root.proto.HydratedQuickReplyButton.verify(message.quickReplyButton);
                    if (error)
                        return "quickReplyButton." + error;
                }
            }
            if (message.urlButton != null && message.hasOwnProperty("urlButton")) {
                if (properties.hydratedButton === 1)
                    return "hydratedButton: multiple values";
                properties.hydratedButton = 1;
                {
                    var error = $root.proto.HydratedURLButton.verify(message.urlButton);
                    if (error)
                        return "urlButton." + error;
                }
            }
            if (message.callButton != null && message.hasOwnProperty("callButton")) {
                if (properties.hydratedButton === 1)
                    return "hydratedButton: multiple values";
                properties.hydratedButton = 1;
                {
                    var error = $root.proto.HydratedCallButton.verify(message.callButton);
                    if (error)
                        return "callButton." + error;
                }
            }
            return null;
        };

        /**
         * Creates a HydratedTemplateButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HydratedTemplateButton} HydratedTemplateButton
         */
        HydratedTemplateButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HydratedTemplateButton)
                return object;
            var message = new $root.proto.HydratedTemplateButton();
            if (object.index != null)
                message.index = object.index >>> 0;
            if (object.quickReplyButton != null) {
                if (typeof object.quickReplyButton !== "object")
                    throw TypeError(".proto.HydratedTemplateButton.quickReplyButton: object expected");
                message.quickReplyButton = $root.proto.HydratedQuickReplyButton.fromObject(object.quickReplyButton);
            }
            if (object.urlButton != null) {
                if (typeof object.urlButton !== "object")
                    throw TypeError(".proto.HydratedTemplateButton.urlButton: object expected");
                message.urlButton = $root.proto.HydratedURLButton.fromObject(object.urlButton);
            }
            if (object.callButton != null) {
                if (typeof object.callButton !== "object")
                    throw TypeError(".proto.HydratedTemplateButton.callButton: object expected");
                message.callButton = $root.proto.HydratedCallButton.fromObject(object.callButton);
            }
            return message;
        };

        /**
         * Creates a plain object from a HydratedTemplateButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HydratedTemplateButton
         * @static
         * @param {proto.HydratedTemplateButton} message HydratedTemplateButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HydratedTemplateButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.index = 0;
            if (message.quickReplyButton != null && message.hasOwnProperty("quickReplyButton")) {
                object.quickReplyButton = $root.proto.HydratedQuickReplyButton.toObject(message.quickReplyButton, options);
                if (options.oneofs)
                    object.hydratedButton = "quickReplyButton";
            }
            if (message.urlButton != null && message.hasOwnProperty("urlButton")) {
                object.urlButton = $root.proto.HydratedURLButton.toObject(message.urlButton, options);
                if (options.oneofs)
                    object.hydratedButton = "urlButton";
            }
            if (message.callButton != null && message.hasOwnProperty("callButton")) {
                object.callButton = $root.proto.HydratedCallButton.toObject(message.callButton, options);
                if (options.oneofs)
                    object.hydratedButton = "callButton";
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            return object;
        };

        /**
         * Converts this HydratedTemplateButton to JSON.
         * @function toJSON
         * @memberof proto.HydratedTemplateButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HydratedTemplateButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HydratedTemplateButton;
    })();

    proto.QuickReplyButton = (function() {

        /**
         * Properties of a QuickReplyButton.
         * @memberof proto
         * @interface IQuickReplyButton
         * @property {proto.IHighlyStructuredMessage|null} [displayText] QuickReplyButton displayText
         * @property {string|null} [id] QuickReplyButton id
         */

        /**
         * Constructs a new QuickReplyButton.
         * @memberof proto
         * @classdesc Represents a QuickReplyButton.
         * @implements IQuickReplyButton
         * @constructor
         * @param {proto.IQuickReplyButton=} [properties] Properties to set
         */
        function QuickReplyButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuickReplyButton displayText.
         * @member {proto.IHighlyStructuredMessage|null|undefined} displayText
         * @memberof proto.QuickReplyButton
         * @instance
         */
        QuickReplyButton.prototype.displayText = null;

        /**
         * QuickReplyButton id.
         * @member {string} id
         * @memberof proto.QuickReplyButton
         * @instance
         */
        QuickReplyButton.prototype.id = "";

        /**
         * Creates a new QuickReplyButton instance using the specified properties.
         * @function create
         * @memberof proto.QuickReplyButton
         * @static
         * @param {proto.IQuickReplyButton=} [properties] Properties to set
         * @returns {proto.QuickReplyButton} QuickReplyButton instance
         */
        QuickReplyButton.create = function create(properties) {
            return new QuickReplyButton(properties);
        };

        /**
         * Encodes the specified QuickReplyButton message. Does not implicitly {@link proto.QuickReplyButton.verify|verify} messages.
         * @function encode
         * @memberof proto.QuickReplyButton
         * @static
         * @param {proto.IQuickReplyButton} message QuickReplyButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuickReplyButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                $root.proto.HighlyStructuredMessage.encode(message.displayText, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified QuickReplyButton message, length delimited. Does not implicitly {@link proto.QuickReplyButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.QuickReplyButton
         * @static
         * @param {proto.IQuickReplyButton} message QuickReplyButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuickReplyButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QuickReplyButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.QuickReplyButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.QuickReplyButton} QuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuickReplyButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.QuickReplyButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a QuickReplyButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.QuickReplyButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.QuickReplyButton} QuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuickReplyButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QuickReplyButton message.
         * @function verify
         * @memberof proto.QuickReplyButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QuickReplyButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.displayText);
                if (error)
                    return "displayText." + error;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a QuickReplyButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.QuickReplyButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.QuickReplyButton} QuickReplyButton
         */
        QuickReplyButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.QuickReplyButton)
                return object;
            var message = new $root.proto.QuickReplyButton();
            if (object.displayText != null) {
                if (typeof object.displayText !== "object")
                    throw TypeError(".proto.QuickReplyButton.displayText: object expected");
                message.displayText = $root.proto.HighlyStructuredMessage.fromObject(object.displayText);
            }
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a QuickReplyButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.QuickReplyButton
         * @static
         * @param {proto.QuickReplyButton} message QuickReplyButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QuickReplyButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = null;
                object.id = "";
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = $root.proto.HighlyStructuredMessage.toObject(message.displayText, options);
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this QuickReplyButton to JSON.
         * @function toJSON
         * @memberof proto.QuickReplyButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QuickReplyButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QuickReplyButton;
    })();

    proto.URLButton = (function() {

        /**
         * Properties of a URLButton.
         * @memberof proto
         * @interface IURLButton
         * @property {proto.IHighlyStructuredMessage|null} [displayText] URLButton displayText
         * @property {proto.IHighlyStructuredMessage|null} [url] URLButton url
         */

        /**
         * Constructs a new URLButton.
         * @memberof proto
         * @classdesc Represents a URLButton.
         * @implements IURLButton
         * @constructor
         * @param {proto.IURLButton=} [properties] Properties to set
         */
        function URLButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * URLButton displayText.
         * @member {proto.IHighlyStructuredMessage|null|undefined} displayText
         * @memberof proto.URLButton
         * @instance
         */
        URLButton.prototype.displayText = null;

        /**
         * URLButton url.
         * @member {proto.IHighlyStructuredMessage|null|undefined} url
         * @memberof proto.URLButton
         * @instance
         */
        URLButton.prototype.url = null;

        /**
         * Creates a new URLButton instance using the specified properties.
         * @function create
         * @memberof proto.URLButton
         * @static
         * @param {proto.IURLButton=} [properties] Properties to set
         * @returns {proto.URLButton} URLButton instance
         */
        URLButton.create = function create(properties) {
            return new URLButton(properties);
        };

        /**
         * Encodes the specified URLButton message. Does not implicitly {@link proto.URLButton.verify|verify} messages.
         * @function encode
         * @memberof proto.URLButton
         * @static
         * @param {proto.IURLButton} message URLButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        URLButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                $root.proto.HighlyStructuredMessage.encode(message.displayText, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                $root.proto.HighlyStructuredMessage.encode(message.url, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified URLButton message, length delimited. Does not implicitly {@link proto.URLButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.URLButton
         * @static
         * @param {proto.IURLButton} message URLButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        URLButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a URLButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.URLButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.URLButton} URLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        URLButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.URLButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.url = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a URLButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.URLButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.URLButton} URLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        URLButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a URLButton message.
         * @function verify
         * @memberof proto.URLButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        URLButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.displayText);
                if (error)
                    return "displayText." + error;
            }
            if (message.url != null && message.hasOwnProperty("url")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.url);
                if (error)
                    return "url." + error;
            }
            return null;
        };

        /**
         * Creates a URLButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.URLButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.URLButton} URLButton
         */
        URLButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.URLButton)
                return object;
            var message = new $root.proto.URLButton();
            if (object.displayText != null) {
                if (typeof object.displayText !== "object")
                    throw TypeError(".proto.URLButton.displayText: object expected");
                message.displayText = $root.proto.HighlyStructuredMessage.fromObject(object.displayText);
            }
            if (object.url != null) {
                if (typeof object.url !== "object")
                    throw TypeError(".proto.URLButton.url: object expected");
                message.url = $root.proto.HighlyStructuredMessage.fromObject(object.url);
            }
            return message;
        };

        /**
         * Creates a plain object from a URLButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.URLButton
         * @static
         * @param {proto.URLButton} message URLButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        URLButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = null;
                object.url = null;
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = $root.proto.HighlyStructuredMessage.toObject(message.displayText, options);
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = $root.proto.HighlyStructuredMessage.toObject(message.url, options);
            return object;
        };

        /**
         * Converts this URLButton to JSON.
         * @function toJSON
         * @memberof proto.URLButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        URLButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return URLButton;
    })();

    proto.CallButton = (function() {

        /**
         * Properties of a CallButton.
         * @memberof proto
         * @interface ICallButton
         * @property {proto.IHighlyStructuredMessage|null} [displayText] CallButton displayText
         * @property {proto.IHighlyStructuredMessage|null} [phoneNumber] CallButton phoneNumber
         */

        /**
         * Constructs a new CallButton.
         * @memberof proto
         * @classdesc Represents a CallButton.
         * @implements ICallButton
         * @constructor
         * @param {proto.ICallButton=} [properties] Properties to set
         */
        function CallButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CallButton displayText.
         * @member {proto.IHighlyStructuredMessage|null|undefined} displayText
         * @memberof proto.CallButton
         * @instance
         */
        CallButton.prototype.displayText = null;

        /**
         * CallButton phoneNumber.
         * @member {proto.IHighlyStructuredMessage|null|undefined} phoneNumber
         * @memberof proto.CallButton
         * @instance
         */
        CallButton.prototype.phoneNumber = null;

        /**
         * Creates a new CallButton instance using the specified properties.
         * @function create
         * @memberof proto.CallButton
         * @static
         * @param {proto.ICallButton=} [properties] Properties to set
         * @returns {proto.CallButton} CallButton instance
         */
        CallButton.create = function create(properties) {
            return new CallButton(properties);
        };

        /**
         * Encodes the specified CallButton message. Does not implicitly {@link proto.CallButton.verify|verify} messages.
         * @function encode
         * @memberof proto.CallButton
         * @static
         * @param {proto.ICallButton} message CallButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayText != null && Object.hasOwnProperty.call(message, "displayText"))
                $root.proto.HighlyStructuredMessage.encode(message.displayText, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.phoneNumber != null && Object.hasOwnProperty.call(message, "phoneNumber"))
                $root.proto.HighlyStructuredMessage.encode(message.phoneNumber, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CallButton message, length delimited. Does not implicitly {@link proto.CallButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.CallButton
         * @static
         * @param {proto.ICallButton} message CallButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CallButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.CallButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.CallButton} CallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.CallButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayText = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.phoneNumber = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CallButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.CallButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.CallButton} CallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CallButton message.
         * @function verify
         * @memberof proto.CallButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayText != null && message.hasOwnProperty("displayText")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.displayText);
                if (error)
                    return "displayText." + error;
            }
            if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.phoneNumber);
                if (error)
                    return "phoneNumber." + error;
            }
            return null;
        };

        /**
         * Creates a CallButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.CallButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.CallButton} CallButton
         */
        CallButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.CallButton)
                return object;
            var message = new $root.proto.CallButton();
            if (object.displayText != null) {
                if (typeof object.displayText !== "object")
                    throw TypeError(".proto.CallButton.displayText: object expected");
                message.displayText = $root.proto.HighlyStructuredMessage.fromObject(object.displayText);
            }
            if (object.phoneNumber != null) {
                if (typeof object.phoneNumber !== "object")
                    throw TypeError(".proto.CallButton.phoneNumber: object expected");
                message.phoneNumber = $root.proto.HighlyStructuredMessage.fromObject(object.phoneNumber);
            }
            return message;
        };

        /**
         * Creates a plain object from a CallButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.CallButton
         * @static
         * @param {proto.CallButton} message CallButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayText = null;
                object.phoneNumber = null;
            }
            if (message.displayText != null && message.hasOwnProperty("displayText"))
                object.displayText = $root.proto.HighlyStructuredMessage.toObject(message.displayText, options);
            if (message.phoneNumber != null && message.hasOwnProperty("phoneNumber"))
                object.phoneNumber = $root.proto.HighlyStructuredMessage.toObject(message.phoneNumber, options);
            return object;
        };

        /**
         * Converts this CallButton to JSON.
         * @function toJSON
         * @memberof proto.CallButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CallButton;
    })();

    proto.TemplateButton = (function() {

        /**
         * Properties of a TemplateButton.
         * @memberof proto
         * @interface ITemplateButton
         * @property {number|null} [index] TemplateButton index
         * @property {proto.IQuickReplyButton|null} [quickReplyButton] TemplateButton quickReplyButton
         * @property {proto.IURLButton|null} [urlButton] TemplateButton urlButton
         * @property {proto.ICallButton|null} [callButton] TemplateButton callButton
         */

        /**
         * Constructs a new TemplateButton.
         * @memberof proto
         * @classdesc Represents a TemplateButton.
         * @implements ITemplateButton
         * @constructor
         * @param {proto.ITemplateButton=} [properties] Properties to set
         */
        function TemplateButton(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TemplateButton index.
         * @member {number} index
         * @memberof proto.TemplateButton
         * @instance
         */
        TemplateButton.prototype.index = 0;

        /**
         * TemplateButton quickReplyButton.
         * @member {proto.IQuickReplyButton|null|undefined} quickReplyButton
         * @memberof proto.TemplateButton
         * @instance
         */
        TemplateButton.prototype.quickReplyButton = null;

        /**
         * TemplateButton urlButton.
         * @member {proto.IURLButton|null|undefined} urlButton
         * @memberof proto.TemplateButton
         * @instance
         */
        TemplateButton.prototype.urlButton = null;

        /**
         * TemplateButton callButton.
         * @member {proto.ICallButton|null|undefined} callButton
         * @memberof proto.TemplateButton
         * @instance
         */
        TemplateButton.prototype.callButton = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * TemplateButton button.
         * @member {"quickReplyButton"|"urlButton"|"callButton"|undefined} button
         * @memberof proto.TemplateButton
         * @instance
         */
        Object.defineProperty(TemplateButton.prototype, "button", {
            get: $util.oneOfGetter($oneOfFields = ["quickReplyButton", "urlButton", "callButton"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new TemplateButton instance using the specified properties.
         * @function create
         * @memberof proto.TemplateButton
         * @static
         * @param {proto.ITemplateButton=} [properties] Properties to set
         * @returns {proto.TemplateButton} TemplateButton instance
         */
        TemplateButton.create = function create(properties) {
            return new TemplateButton(properties);
        };

        /**
         * Encodes the specified TemplateButton message. Does not implicitly {@link proto.TemplateButton.verify|verify} messages.
         * @function encode
         * @memberof proto.TemplateButton
         * @static
         * @param {proto.ITemplateButton} message TemplateButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateButton.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.quickReplyButton != null && Object.hasOwnProperty.call(message, "quickReplyButton"))
                $root.proto.QuickReplyButton.encode(message.quickReplyButton, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.urlButton != null && Object.hasOwnProperty.call(message, "urlButton"))
                $root.proto.URLButton.encode(message.urlButton, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.callButton != null && Object.hasOwnProperty.call(message, "callButton"))
                $root.proto.CallButton.encode(message.callButton, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.index);
            return writer;
        };

        /**
         * Encodes the specified TemplateButton message, length delimited. Does not implicitly {@link proto.TemplateButton.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.TemplateButton
         * @static
         * @param {proto.ITemplateButton} message TemplateButton message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateButton.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TemplateButton message from the specified reader or buffer.
         * @function decode
         * @memberof proto.TemplateButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.TemplateButton} TemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateButton.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.TemplateButton();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 4:
                    message.index = reader.uint32();
                    break;
                case 1:
                    message.quickReplyButton = $root.proto.QuickReplyButton.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.urlButton = $root.proto.URLButton.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.callButton = $root.proto.CallButton.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TemplateButton message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.TemplateButton
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.TemplateButton} TemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateButton.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TemplateButton message.
         * @function verify
         * @memberof proto.TemplateButton
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TemplateButton.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.quickReplyButton != null && message.hasOwnProperty("quickReplyButton")) {
                properties.button = 1;
                {
                    var error = $root.proto.QuickReplyButton.verify(message.quickReplyButton);
                    if (error)
                        return "quickReplyButton." + error;
                }
            }
            if (message.urlButton != null && message.hasOwnProperty("urlButton")) {
                if (properties.button === 1)
                    return "button: multiple values";
                properties.button = 1;
                {
                    var error = $root.proto.URLButton.verify(message.urlButton);
                    if (error)
                        return "urlButton." + error;
                }
            }
            if (message.callButton != null && message.hasOwnProperty("callButton")) {
                if (properties.button === 1)
                    return "button: multiple values";
                properties.button = 1;
                {
                    var error = $root.proto.CallButton.verify(message.callButton);
                    if (error)
                        return "callButton." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TemplateButton message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.TemplateButton
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.TemplateButton} TemplateButton
         */
        TemplateButton.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.TemplateButton)
                return object;
            var message = new $root.proto.TemplateButton();
            if (object.index != null)
                message.index = object.index >>> 0;
            if (object.quickReplyButton != null) {
                if (typeof object.quickReplyButton !== "object")
                    throw TypeError(".proto.TemplateButton.quickReplyButton: object expected");
                message.quickReplyButton = $root.proto.QuickReplyButton.fromObject(object.quickReplyButton);
            }
            if (object.urlButton != null) {
                if (typeof object.urlButton !== "object")
                    throw TypeError(".proto.TemplateButton.urlButton: object expected");
                message.urlButton = $root.proto.URLButton.fromObject(object.urlButton);
            }
            if (object.callButton != null) {
                if (typeof object.callButton !== "object")
                    throw TypeError(".proto.TemplateButton.callButton: object expected");
                message.callButton = $root.proto.CallButton.fromObject(object.callButton);
            }
            return message;
        };

        /**
         * Creates a plain object from a TemplateButton message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.TemplateButton
         * @static
         * @param {proto.TemplateButton} message TemplateButton
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TemplateButton.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.index = 0;
            if (message.quickReplyButton != null && message.hasOwnProperty("quickReplyButton")) {
                object.quickReplyButton = $root.proto.QuickReplyButton.toObject(message.quickReplyButton, options);
                if (options.oneofs)
                    object.button = "quickReplyButton";
            }
            if (message.urlButton != null && message.hasOwnProperty("urlButton")) {
                object.urlButton = $root.proto.URLButton.toObject(message.urlButton, options);
                if (options.oneofs)
                    object.button = "urlButton";
            }
            if (message.callButton != null && message.hasOwnProperty("callButton")) {
                object.callButton = $root.proto.CallButton.toObject(message.callButton, options);
                if (options.oneofs)
                    object.button = "callButton";
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            return object;
        };

        /**
         * Converts this TemplateButton to JSON.
         * @function toJSON
         * @memberof proto.TemplateButton
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TemplateButton.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TemplateButton;
    })();

    proto.Location = (function() {

        /**
         * Properties of a Location.
         * @memberof proto
         * @interface ILocation
         * @property {number|null} [degreesLatitude] Location degreesLatitude
         * @property {number|null} [degreesLongitude] Location degreesLongitude
         * @property {string|null} [name] Location name
         */

        /**
         * Constructs a new Location.
         * @memberof proto
         * @classdesc Represents a Location.
         * @implements ILocation
         * @constructor
         * @param {proto.ILocation=} [properties] Properties to set
         */
        function Location(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Location degreesLatitude.
         * @member {number} degreesLatitude
         * @memberof proto.Location
         * @instance
         */
        Location.prototype.degreesLatitude = 0;

        /**
         * Location degreesLongitude.
         * @member {number} degreesLongitude
         * @memberof proto.Location
         * @instance
         */
        Location.prototype.degreesLongitude = 0;

        /**
         * Location name.
         * @member {string} name
         * @memberof proto.Location
         * @instance
         */
        Location.prototype.name = "";

        /**
         * Creates a new Location instance using the specified properties.
         * @function create
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation=} [properties] Properties to set
         * @returns {proto.Location} Location instance
         */
        Location.create = function create(properties) {
            return new Location(properties);
        };

        /**
         * Encodes the specified Location message. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @function encode
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation} message Location message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Location.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.degreesLatitude != null && Object.hasOwnProperty.call(message, "degreesLatitude"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.degreesLatitude);
            if (message.degreesLongitude != null && Object.hasOwnProperty.call(message, "degreesLongitude"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.degreesLongitude);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Location message, length delimited. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation} message Location message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Location.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Location message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Location
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Location} Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Location.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Location();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.degreesLatitude = reader.double();
                    break;
                case 2:
                    message.degreesLongitude = reader.double();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Location message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Location
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Location} Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Location.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Location message.
         * @function verify
         * @memberof proto.Location
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Location.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                if (typeof message.degreesLatitude !== "number")
                    return "degreesLatitude: number expected";
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                if (typeof message.degreesLongitude !== "number")
                    return "degreesLongitude: number expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a Location message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Location
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Location} Location
         */
        Location.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Location)
                return object;
            var message = new $root.proto.Location();
            if (object.degreesLatitude != null)
                message.degreesLatitude = Number(object.degreesLatitude);
            if (object.degreesLongitude != null)
                message.degreesLongitude = Number(object.degreesLongitude);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a Location message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Location
         * @static
         * @param {proto.Location} message Location
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Location.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.degreesLatitude = 0;
                object.degreesLongitude = 0;
                object.name = "";
            }
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                object.degreesLatitude = options.json && !isFinite(message.degreesLatitude) ? String(message.degreesLatitude) : message.degreesLatitude;
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                object.degreesLongitude = options.json && !isFinite(message.degreesLongitude) ? String(message.degreesLongitude) : message.degreesLongitude;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this Location to JSON.
         * @function toJSON
         * @memberof proto.Location
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Location.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Location;
    })();

    proto.Point = (function() {

        /**
         * Properties of a Point.
         * @memberof proto
         * @interface IPoint
         * @property {number|null} [x] Point x
         * @property {number|null} [y] Point y
         */

        /**
         * Constructs a new Point.
         * @memberof proto
         * @classdesc Represents a Point.
         * @implements IPoint
         * @constructor
         * @param {proto.IPoint=} [properties] Properties to set
         */
        function Point(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Point x.
         * @member {number} x
         * @memberof proto.Point
         * @instance
         */
        Point.prototype.x = 0;

        /**
         * Point y.
         * @member {number} y
         * @memberof proto.Point
         * @instance
         */
        Point.prototype.y = 0;

        /**
         * Creates a new Point instance using the specified properties.
         * @function create
         * @memberof proto.Point
         * @static
         * @param {proto.IPoint=} [properties] Properties to set
         * @returns {proto.Point} Point instance
         */
        Point.create = function create(properties) {
            return new Point(properties);
        };

        /**
         * Encodes the specified Point message. Does not implicitly {@link proto.Point.verify|verify} messages.
         * @function encode
         * @memberof proto.Point
         * @static
         * @param {proto.IPoint} message Point message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Point.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.y);
            return writer;
        };

        /**
         * Encodes the specified Point message, length delimited. Does not implicitly {@link proto.Point.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Point
         * @static
         * @param {proto.IPoint} message Point message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Point.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Point message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Point
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Point} Point
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Point.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Point();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 3:
                    message.x = reader.double();
                    break;
                case 4:
                    message.y = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Point message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Point
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Point} Point
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Point.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Point message.
         * @function verify
         * @memberof proto.Point
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Point.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            return null;
        };

        /**
         * Creates a Point message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Point
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Point} Point
         */
        Point.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Point)
                return object;
            var message = new $root.proto.Point();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            return message;
        };

        /**
         * Creates a plain object from a Point message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Point
         * @static
         * @param {proto.Point} message Point
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Point.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            return object;
        };

        /**
         * Converts this Point to JSON.
         * @function toJSON
         * @memberof proto.Point
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Point.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Point;
    })();

    proto.InteractiveAnnotation = (function() {

        /**
         * Properties of an InteractiveAnnotation.
         * @memberof proto
         * @interface IInteractiveAnnotation
         * @property {Array.<proto.IPoint>|null} [polygonVertices] InteractiveAnnotation polygonVertices
         * @property {proto.ILocation|null} [location] InteractiveAnnotation location
         */

        /**
         * Constructs a new InteractiveAnnotation.
         * @memberof proto
         * @classdesc Represents an InteractiveAnnotation.
         * @implements IInteractiveAnnotation
         * @constructor
         * @param {proto.IInteractiveAnnotation=} [properties] Properties to set
         */
        function InteractiveAnnotation(properties) {
            this.polygonVertices = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InteractiveAnnotation polygonVertices.
         * @member {Array.<proto.IPoint>} polygonVertices
         * @memberof proto.InteractiveAnnotation
         * @instance
         */
        InteractiveAnnotation.prototype.polygonVertices = $util.emptyArray;

        /**
         * InteractiveAnnotation location.
         * @member {proto.ILocation|null|undefined} location
         * @memberof proto.InteractiveAnnotation
         * @instance
         */
        InteractiveAnnotation.prototype.location = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * InteractiveAnnotation action.
         * @member {"location"|undefined} action
         * @memberof proto.InteractiveAnnotation
         * @instance
         */
        Object.defineProperty(InteractiveAnnotation.prototype, "action", {
            get: $util.oneOfGetter($oneOfFields = ["location"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new InteractiveAnnotation instance using the specified properties.
         * @function create
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {proto.IInteractiveAnnotation=} [properties] Properties to set
         * @returns {proto.InteractiveAnnotation} InteractiveAnnotation instance
         */
        InteractiveAnnotation.create = function create(properties) {
            return new InteractiveAnnotation(properties);
        };

        /**
         * Encodes the specified InteractiveAnnotation message. Does not implicitly {@link proto.InteractiveAnnotation.verify|verify} messages.
         * @function encode
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {proto.IInteractiveAnnotation} message InteractiveAnnotation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InteractiveAnnotation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.polygonVertices != null && message.polygonVertices.length)
                for (var i = 0; i < message.polygonVertices.length; ++i)
                    $root.proto.Point.encode(message.polygonVertices[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                $root.proto.Location.encode(message.location, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified InteractiveAnnotation message, length delimited. Does not implicitly {@link proto.InteractiveAnnotation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {proto.IInteractiveAnnotation} message InteractiveAnnotation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InteractiveAnnotation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InteractiveAnnotation message from the specified reader or buffer.
         * @function decode
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.InteractiveAnnotation} InteractiveAnnotation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InteractiveAnnotation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.InteractiveAnnotation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.polygonVertices && message.polygonVertices.length))
                        message.polygonVertices = [];
                    message.polygonVertices.push($root.proto.Point.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.location = $root.proto.Location.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InteractiveAnnotation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.InteractiveAnnotation} InteractiveAnnotation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InteractiveAnnotation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InteractiveAnnotation message.
         * @function verify
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InteractiveAnnotation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.polygonVertices != null && message.hasOwnProperty("polygonVertices")) {
                if (!Array.isArray(message.polygonVertices))
                    return "polygonVertices: array expected";
                for (var i = 0; i < message.polygonVertices.length; ++i) {
                    var error = $root.proto.Point.verify(message.polygonVertices[i]);
                    if (error)
                        return "polygonVertices." + error;
                }
            }
            if (message.location != null && message.hasOwnProperty("location")) {
                properties.action = 1;
                {
                    var error = $root.proto.Location.verify(message.location);
                    if (error)
                        return "location." + error;
                }
            }
            return null;
        };

        /**
         * Creates an InteractiveAnnotation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.InteractiveAnnotation} InteractiveAnnotation
         */
        InteractiveAnnotation.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.InteractiveAnnotation)
                return object;
            var message = new $root.proto.InteractiveAnnotation();
            if (object.polygonVertices) {
                if (!Array.isArray(object.polygonVertices))
                    throw TypeError(".proto.InteractiveAnnotation.polygonVertices: array expected");
                message.polygonVertices = [];
                for (var i = 0; i < object.polygonVertices.length; ++i) {
                    if (typeof object.polygonVertices[i] !== "object")
                        throw TypeError(".proto.InteractiveAnnotation.polygonVertices: object expected");
                    message.polygonVertices[i] = $root.proto.Point.fromObject(object.polygonVertices[i]);
                }
            }
            if (object.location != null) {
                if (typeof object.location !== "object")
                    throw TypeError(".proto.InteractiveAnnotation.location: object expected");
                message.location = $root.proto.Location.fromObject(object.location);
            }
            return message;
        };

        /**
         * Creates a plain object from an InteractiveAnnotation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.InteractiveAnnotation
         * @static
         * @param {proto.InteractiveAnnotation} message InteractiveAnnotation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InteractiveAnnotation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.polygonVertices = [];
            if (message.polygonVertices && message.polygonVertices.length) {
                object.polygonVertices = [];
                for (var j = 0; j < message.polygonVertices.length; ++j)
                    object.polygonVertices[j] = $root.proto.Point.toObject(message.polygonVertices[j], options);
            }
            if (message.location != null && message.hasOwnProperty("location")) {
                object.location = $root.proto.Location.toObject(message.location, options);
                if (options.oneofs)
                    object.action = "location";
            }
            return object;
        };

        /**
         * Converts this InteractiveAnnotation to JSON.
         * @function toJSON
         * @memberof proto.InteractiveAnnotation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InteractiveAnnotation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InteractiveAnnotation;
    })();

    proto.AdReplyInfo = (function() {

        /**
         * Properties of an AdReplyInfo.
         * @memberof proto
         * @interface IAdReplyInfo
         * @property {string|null} [advertiserName] AdReplyInfo advertiserName
         * @property {proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE|null} [mediaType] AdReplyInfo mediaType
         * @property {Uint8Array|null} [jpegThumbnail] AdReplyInfo jpegThumbnail
         * @property {string|null} [caption] AdReplyInfo caption
         */

        /**
         * Constructs a new AdReplyInfo.
         * @memberof proto
         * @classdesc Represents an AdReplyInfo.
         * @implements IAdReplyInfo
         * @constructor
         * @param {proto.IAdReplyInfo=} [properties] Properties to set
         */
        function AdReplyInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AdReplyInfo advertiserName.
         * @member {string} advertiserName
         * @memberof proto.AdReplyInfo
         * @instance
         */
        AdReplyInfo.prototype.advertiserName = "";

        /**
         * AdReplyInfo mediaType.
         * @member {proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE} mediaType
         * @memberof proto.AdReplyInfo
         * @instance
         */
        AdReplyInfo.prototype.mediaType = 0;

        /**
         * AdReplyInfo jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.AdReplyInfo
         * @instance
         */
        AdReplyInfo.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * AdReplyInfo caption.
         * @member {string} caption
         * @memberof proto.AdReplyInfo
         * @instance
         */
        AdReplyInfo.prototype.caption = "";

        /**
         * Creates a new AdReplyInfo instance using the specified properties.
         * @function create
         * @memberof proto.AdReplyInfo
         * @static
         * @param {proto.IAdReplyInfo=} [properties] Properties to set
         * @returns {proto.AdReplyInfo} AdReplyInfo instance
         */
        AdReplyInfo.create = function create(properties) {
            return new AdReplyInfo(properties);
        };

        /**
         * Encodes the specified AdReplyInfo message. Does not implicitly {@link proto.AdReplyInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.AdReplyInfo
         * @static
         * @param {proto.IAdReplyInfo} message AdReplyInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AdReplyInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.advertiserName != null && Object.hasOwnProperty.call(message, "advertiserName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.advertiserName);
            if (message.mediaType != null && Object.hasOwnProperty.call(message, "mediaType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.mediaType);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.caption != null && Object.hasOwnProperty.call(message, "caption"))
                writer.uint32(/* id 17, wireType 2 =*/138).string(message.caption);
            return writer;
        };

        /**
         * Encodes the specified AdReplyInfo message, length delimited. Does not implicitly {@link proto.AdReplyInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.AdReplyInfo
         * @static
         * @param {proto.IAdReplyInfo} message AdReplyInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AdReplyInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AdReplyInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.AdReplyInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.AdReplyInfo} AdReplyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AdReplyInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.AdReplyInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.advertiserName = reader.string();
                    break;
                case 2:
                    message.mediaType = reader.int32();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.caption = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AdReplyInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.AdReplyInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.AdReplyInfo} AdReplyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AdReplyInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AdReplyInfo message.
         * @function verify
         * @memberof proto.AdReplyInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AdReplyInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.advertiserName != null && message.hasOwnProperty("advertiserName"))
                if (!$util.isString(message.advertiserName))
                    return "advertiserName: string expected";
            if (message.mediaType != null && message.hasOwnProperty("mediaType"))
                switch (message.mediaType) {
                default:
                    return "mediaType: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.caption != null && message.hasOwnProperty("caption"))
                if (!$util.isString(message.caption))
                    return "caption: string expected";
            return null;
        };

        /**
         * Creates an AdReplyInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.AdReplyInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.AdReplyInfo} AdReplyInfo
         */
        AdReplyInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.AdReplyInfo)
                return object;
            var message = new $root.proto.AdReplyInfo();
            if (object.advertiserName != null)
                message.advertiserName = String(object.advertiserName);
            switch (object.mediaType) {
            case "NONE":
            case 0:
                message.mediaType = 0;
                break;
            case "IMAGE":
            case 1:
                message.mediaType = 1;
                break;
            case "VIDEO":
            case 2:
                message.mediaType = 2;
                break;
            }
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.caption != null)
                message.caption = String(object.caption);
            return message;
        };

        /**
         * Creates a plain object from an AdReplyInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.AdReplyInfo
         * @static
         * @param {proto.AdReplyInfo} message AdReplyInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AdReplyInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.advertiserName = "";
                object.mediaType = options.enums === String ? "NONE" : 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.caption = "";
            }
            if (message.advertiserName != null && message.hasOwnProperty("advertiserName"))
                object.advertiserName = message.advertiserName;
            if (message.mediaType != null && message.hasOwnProperty("mediaType"))
                object.mediaType = options.enums === String ? $root.proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE[message.mediaType] : message.mediaType;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.caption != null && message.hasOwnProperty("caption"))
                object.caption = message.caption;
            return object;
        };

        /**
         * Converts this AdReplyInfo to JSON.
         * @function toJSON
         * @memberof proto.AdReplyInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AdReplyInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * AD_REPLY_INFO_MEDIATYPE enum.
         * @name proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} IMAGE=1 IMAGE value
         * @property {number} VIDEO=2 VIDEO value
         */
        AdReplyInfo.AD_REPLY_INFO_MEDIATYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "IMAGE"] = 1;
            values[valuesById[2] = "VIDEO"] = 2;
            return values;
        })();

        return AdReplyInfo;
    })();

    proto.ContextInfo = (function() {

        /**
         * Properties of a ContextInfo.
         * @memberof proto
         * @interface IContextInfo
         * @property {string|null} [stanzaId] ContextInfo stanzaId
         * @property {string|null} [participant] ContextInfo participant
         * @property {proto.IMessage|null} [quotedMessage] ContextInfo quotedMessage
         * @property {string|null} [remoteJid] ContextInfo remoteJid
         * @property {Array.<string>|null} [mentionedJid] ContextInfo mentionedJid
         * @property {string|null} [conversionSource] ContextInfo conversionSource
         * @property {Uint8Array|null} [conversionData] ContextInfo conversionData
         * @property {number|null} [conversionDelaySeconds] ContextInfo conversionDelaySeconds
         * @property {number|null} [forwardingScore] ContextInfo forwardingScore
         * @property {boolean|null} [isForwarded] ContextInfo isForwarded
         * @property {proto.IAdReplyInfo|null} [quotedAd] ContextInfo quotedAd
         * @property {proto.IMessageKey|null} [placeholderKey] ContextInfo placeholderKey
         * @property {number|null} [expiration] ContextInfo expiration
         */

        /**
         * Constructs a new ContextInfo.
         * @memberof proto
         * @classdesc Represents a ContextInfo.
         * @implements IContextInfo
         * @constructor
         * @param {proto.IContextInfo=} [properties] Properties to set
         */
        function ContextInfo(properties) {
            this.mentionedJid = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContextInfo stanzaId.
         * @member {string} stanzaId
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.stanzaId = "";

        /**
         * ContextInfo participant.
         * @member {string} participant
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.participant = "";

        /**
         * ContextInfo quotedMessage.
         * @member {proto.IMessage|null|undefined} quotedMessage
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.quotedMessage = null;

        /**
         * ContextInfo remoteJid.
         * @member {string} remoteJid
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.remoteJid = "";

        /**
         * ContextInfo mentionedJid.
         * @member {Array.<string>} mentionedJid
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.mentionedJid = $util.emptyArray;

        /**
         * ContextInfo conversionSource.
         * @member {string} conversionSource
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.conversionSource = "";

        /**
         * ContextInfo conversionData.
         * @member {Uint8Array} conversionData
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.conversionData = $util.newBuffer([]);

        /**
         * ContextInfo conversionDelaySeconds.
         * @member {number} conversionDelaySeconds
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.conversionDelaySeconds = 0;

        /**
         * ContextInfo forwardingScore.
         * @member {number} forwardingScore
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.forwardingScore = 0;

        /**
         * ContextInfo isForwarded.
         * @member {boolean} isForwarded
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.isForwarded = false;

        /**
         * ContextInfo quotedAd.
         * @member {proto.IAdReplyInfo|null|undefined} quotedAd
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.quotedAd = null;

        /**
         * ContextInfo placeholderKey.
         * @member {proto.IMessageKey|null|undefined} placeholderKey
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.placeholderKey = null;

        /**
         * ContextInfo expiration.
         * @member {number} expiration
         * @memberof proto.ContextInfo
         * @instance
         */
        ContextInfo.prototype.expiration = 0;

        /**
         * Creates a new ContextInfo instance using the specified properties.
         * @function create
         * @memberof proto.ContextInfo
         * @static
         * @param {proto.IContextInfo=} [properties] Properties to set
         * @returns {proto.ContextInfo} ContextInfo instance
         */
        ContextInfo.create = function create(properties) {
            return new ContextInfo(properties);
        };

        /**
         * Encodes the specified ContextInfo message. Does not implicitly {@link proto.ContextInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.ContextInfo
         * @static
         * @param {proto.IContextInfo} message ContextInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContextInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stanzaId != null && Object.hasOwnProperty.call(message, "stanzaId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.stanzaId);
            if (message.participant != null && Object.hasOwnProperty.call(message, "participant"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.participant);
            if (message.quotedMessage != null && Object.hasOwnProperty.call(message, "quotedMessage"))
                $root.proto.Message.encode(message.quotedMessage, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.remoteJid != null && Object.hasOwnProperty.call(message, "remoteJid"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.remoteJid);
            if (message.mentionedJid != null && message.mentionedJid.length)
                for (var i = 0; i < message.mentionedJid.length; ++i)
                    writer.uint32(/* id 15, wireType 2 =*/122).string(message.mentionedJid[i]);
            if (message.conversionSource != null && Object.hasOwnProperty.call(message, "conversionSource"))
                writer.uint32(/* id 18, wireType 2 =*/146).string(message.conversionSource);
            if (message.conversionData != null && Object.hasOwnProperty.call(message, "conversionData"))
                writer.uint32(/* id 19, wireType 2 =*/154).bytes(message.conversionData);
            if (message.conversionDelaySeconds != null && Object.hasOwnProperty.call(message, "conversionDelaySeconds"))
                writer.uint32(/* id 20, wireType 0 =*/160).uint32(message.conversionDelaySeconds);
            if (message.forwardingScore != null && Object.hasOwnProperty.call(message, "forwardingScore"))
                writer.uint32(/* id 21, wireType 0 =*/168).uint32(message.forwardingScore);
            if (message.isForwarded != null && Object.hasOwnProperty.call(message, "isForwarded"))
                writer.uint32(/* id 22, wireType 0 =*/176).bool(message.isForwarded);
            if (message.quotedAd != null && Object.hasOwnProperty.call(message, "quotedAd"))
                $root.proto.AdReplyInfo.encode(message.quotedAd, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.placeholderKey != null && Object.hasOwnProperty.call(message, "placeholderKey"))
                $root.proto.MessageKey.encode(message.placeholderKey, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.expiration != null && Object.hasOwnProperty.call(message, "expiration"))
                writer.uint32(/* id 25, wireType 0 =*/200).uint32(message.expiration);
            return writer;
        };

        /**
         * Encodes the specified ContextInfo message, length delimited. Does not implicitly {@link proto.ContextInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ContextInfo
         * @static
         * @param {proto.IContextInfo} message ContextInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContextInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContextInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ContextInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ContextInfo} ContextInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContextInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ContextInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.stanzaId = reader.string();
                    break;
                case 2:
                    message.participant = reader.string();
                    break;
                case 3:
                    message.quotedMessage = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.remoteJid = reader.string();
                    break;
                case 15:
                    if (!(message.mentionedJid && message.mentionedJid.length))
                        message.mentionedJid = [];
                    message.mentionedJid.push(reader.string());
                    break;
                case 18:
                    message.conversionSource = reader.string();
                    break;
                case 19:
                    message.conversionData = reader.bytes();
                    break;
                case 20:
                    message.conversionDelaySeconds = reader.uint32();
                    break;
                case 21:
                    message.forwardingScore = reader.uint32();
                    break;
                case 22:
                    message.isForwarded = reader.bool();
                    break;
                case 23:
                    message.quotedAd = $root.proto.AdReplyInfo.decode(reader, reader.uint32());
                    break;
                case 24:
                    message.placeholderKey = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                case 25:
                    message.expiration = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContextInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ContextInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ContextInfo} ContextInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContextInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContextInfo message.
         * @function verify
         * @memberof proto.ContextInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContextInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stanzaId != null && message.hasOwnProperty("stanzaId"))
                if (!$util.isString(message.stanzaId))
                    return "stanzaId: string expected";
            if (message.participant != null && message.hasOwnProperty("participant"))
                if (!$util.isString(message.participant))
                    return "participant: string expected";
            if (message.quotedMessage != null && message.hasOwnProperty("quotedMessage")) {
                var error = $root.proto.Message.verify(message.quotedMessage);
                if (error)
                    return "quotedMessage." + error;
            }
            if (message.remoteJid != null && message.hasOwnProperty("remoteJid"))
                if (!$util.isString(message.remoteJid))
                    return "remoteJid: string expected";
            if (message.mentionedJid != null && message.hasOwnProperty("mentionedJid")) {
                if (!Array.isArray(message.mentionedJid))
                    return "mentionedJid: array expected";
                for (var i = 0; i < message.mentionedJid.length; ++i)
                    if (!$util.isString(message.mentionedJid[i]))
                        return "mentionedJid: string[] expected";
            }
            if (message.conversionSource != null && message.hasOwnProperty("conversionSource"))
                if (!$util.isString(message.conversionSource))
                    return "conversionSource: string expected";
            if (message.conversionData != null && message.hasOwnProperty("conversionData"))
                if (!(message.conversionData && typeof message.conversionData.length === "number" || $util.isString(message.conversionData)))
                    return "conversionData: buffer expected";
            if (message.conversionDelaySeconds != null && message.hasOwnProperty("conversionDelaySeconds"))
                if (!$util.isInteger(message.conversionDelaySeconds))
                    return "conversionDelaySeconds: integer expected";
            if (message.forwardingScore != null && message.hasOwnProperty("forwardingScore"))
                if (!$util.isInteger(message.forwardingScore))
                    return "forwardingScore: integer expected";
            if (message.isForwarded != null && message.hasOwnProperty("isForwarded"))
                if (typeof message.isForwarded !== "boolean")
                    return "isForwarded: boolean expected";
            if (message.quotedAd != null && message.hasOwnProperty("quotedAd")) {
                var error = $root.proto.AdReplyInfo.verify(message.quotedAd);
                if (error)
                    return "quotedAd." + error;
            }
            if (message.placeholderKey != null && message.hasOwnProperty("placeholderKey")) {
                var error = $root.proto.MessageKey.verify(message.placeholderKey);
                if (error)
                    return "placeholderKey." + error;
            }
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                if (!$util.isInteger(message.expiration))
                    return "expiration: integer expected";
            return null;
        };

        /**
         * Creates a ContextInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ContextInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ContextInfo} ContextInfo
         */
        ContextInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ContextInfo)
                return object;
            var message = new $root.proto.ContextInfo();
            if (object.stanzaId != null)
                message.stanzaId = String(object.stanzaId);
            if (object.participant != null)
                message.participant = String(object.participant);
            if (object.quotedMessage != null) {
                if (typeof object.quotedMessage !== "object")
                    throw TypeError(".proto.ContextInfo.quotedMessage: object expected");
                message.quotedMessage = $root.proto.Message.fromObject(object.quotedMessage);
            }
            if (object.remoteJid != null)
                message.remoteJid = String(object.remoteJid);
            if (object.mentionedJid) {
                if (!Array.isArray(object.mentionedJid))
                    throw TypeError(".proto.ContextInfo.mentionedJid: array expected");
                message.mentionedJid = [];
                for (var i = 0; i < object.mentionedJid.length; ++i)
                    message.mentionedJid[i] = String(object.mentionedJid[i]);
            }
            if (object.conversionSource != null)
                message.conversionSource = String(object.conversionSource);
            if (object.conversionData != null)
                if (typeof object.conversionData === "string")
                    $util.base64.decode(object.conversionData, message.conversionData = $util.newBuffer($util.base64.length(object.conversionData)), 0);
                else if (object.conversionData.length)
                    message.conversionData = object.conversionData;
            if (object.conversionDelaySeconds != null)
                message.conversionDelaySeconds = object.conversionDelaySeconds >>> 0;
            if (object.forwardingScore != null)
                message.forwardingScore = object.forwardingScore >>> 0;
            if (object.isForwarded != null)
                message.isForwarded = Boolean(object.isForwarded);
            if (object.quotedAd != null) {
                if (typeof object.quotedAd !== "object")
                    throw TypeError(".proto.ContextInfo.quotedAd: object expected");
                message.quotedAd = $root.proto.AdReplyInfo.fromObject(object.quotedAd);
            }
            if (object.placeholderKey != null) {
                if (typeof object.placeholderKey !== "object")
                    throw TypeError(".proto.ContextInfo.placeholderKey: object expected");
                message.placeholderKey = $root.proto.MessageKey.fromObject(object.placeholderKey);
            }
            if (object.expiration != null)
                message.expiration = object.expiration >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ContextInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ContextInfo
         * @static
         * @param {proto.ContextInfo} message ContextInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContextInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.mentionedJid = [];
            if (options.defaults) {
                object.stanzaId = "";
                object.participant = "";
                object.quotedMessage = null;
                object.remoteJid = "";
                object.conversionSource = "";
                if (options.bytes === String)
                    object.conversionData = "";
                else {
                    object.conversionData = [];
                    if (options.bytes !== Array)
                        object.conversionData = $util.newBuffer(object.conversionData);
                }
                object.conversionDelaySeconds = 0;
                object.forwardingScore = 0;
                object.isForwarded = false;
                object.quotedAd = null;
                object.placeholderKey = null;
                object.expiration = 0;
            }
            if (message.stanzaId != null && message.hasOwnProperty("stanzaId"))
                object.stanzaId = message.stanzaId;
            if (message.participant != null && message.hasOwnProperty("participant"))
                object.participant = message.participant;
            if (message.quotedMessage != null && message.hasOwnProperty("quotedMessage"))
                object.quotedMessage = $root.proto.Message.toObject(message.quotedMessage, options);
            if (message.remoteJid != null && message.hasOwnProperty("remoteJid"))
                object.remoteJid = message.remoteJid;
            if (message.mentionedJid && message.mentionedJid.length) {
                object.mentionedJid = [];
                for (var j = 0; j < message.mentionedJid.length; ++j)
                    object.mentionedJid[j] = message.mentionedJid[j];
            }
            if (message.conversionSource != null && message.hasOwnProperty("conversionSource"))
                object.conversionSource = message.conversionSource;
            if (message.conversionData != null && message.hasOwnProperty("conversionData"))
                object.conversionData = options.bytes === String ? $util.base64.encode(message.conversionData, 0, message.conversionData.length) : options.bytes === Array ? Array.prototype.slice.call(message.conversionData) : message.conversionData;
            if (message.conversionDelaySeconds != null && message.hasOwnProperty("conversionDelaySeconds"))
                object.conversionDelaySeconds = message.conversionDelaySeconds;
            if (message.forwardingScore != null && message.hasOwnProperty("forwardingScore"))
                object.forwardingScore = message.forwardingScore;
            if (message.isForwarded != null && message.hasOwnProperty("isForwarded"))
                object.isForwarded = message.isForwarded;
            if (message.quotedAd != null && message.hasOwnProperty("quotedAd"))
                object.quotedAd = $root.proto.AdReplyInfo.toObject(message.quotedAd, options);
            if (message.placeholderKey != null && message.hasOwnProperty("placeholderKey"))
                object.placeholderKey = $root.proto.MessageKey.toObject(message.placeholderKey, options);
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                object.expiration = message.expiration;
            return object;
        };

        /**
         * Converts this ContextInfo to JSON.
         * @function toJSON
         * @memberof proto.ContextInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContextInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContextInfo;
    })();

    proto.SenderKeyDistributionMessage = (function() {

        /**
         * Properties of a SenderKeyDistributionMessage.
         * @memberof proto
         * @interface ISenderKeyDistributionMessage
         * @property {string|null} [groupId] SenderKeyDistributionMessage groupId
         * @property {Uint8Array|null} [axolotlSenderKeyDistributionMessage] SenderKeyDistributionMessage axolotlSenderKeyDistributionMessage
         */

        /**
         * Constructs a new SenderKeyDistributionMessage.
         * @memberof proto
         * @classdesc Represents a SenderKeyDistributionMessage.
         * @implements ISenderKeyDistributionMessage
         * @constructor
         * @param {proto.ISenderKeyDistributionMessage=} [properties] Properties to set
         */
        function SenderKeyDistributionMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKeyDistributionMessage groupId.
         * @member {string} groupId
         * @memberof proto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.groupId = "";

        /**
         * SenderKeyDistributionMessage axolotlSenderKeyDistributionMessage.
         * @member {Uint8Array} axolotlSenderKeyDistributionMessage
         * @memberof proto.SenderKeyDistributionMessage
         * @instance
         */
        SenderKeyDistributionMessage.prototype.axolotlSenderKeyDistributionMessage = $util.newBuffer([]);

        /**
         * Creates a new SenderKeyDistributionMessage instance using the specified properties.
         * @function create
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {proto.ISenderKeyDistributionMessage=} [properties] Properties to set
         * @returns {proto.SenderKeyDistributionMessage} SenderKeyDistributionMessage instance
         */
        SenderKeyDistributionMessage.create = function create(properties) {
            return new SenderKeyDistributionMessage(properties);
        };

        /**
         * Encodes the specified SenderKeyDistributionMessage message. Does not implicitly {@link proto.SenderKeyDistributionMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {proto.ISenderKeyDistributionMessage} message SenderKeyDistributionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyDistributionMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupId);
            if (message.axolotlSenderKeyDistributionMessage != null && Object.hasOwnProperty.call(message, "axolotlSenderKeyDistributionMessage"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.axolotlSenderKeyDistributionMessage);
            return writer;
        };

        /**
         * Encodes the specified SenderKeyDistributionMessage message, length delimited. Does not implicitly {@link proto.SenderKeyDistributionMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {proto.ISenderKeyDistributionMessage} message SenderKeyDistributionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKeyDistributionMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKeyDistributionMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKeyDistributionMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SenderKeyDistributionMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.groupId = reader.string();
                    break;
                case 2:
                    message.axolotlSenderKeyDistributionMessage = reader.bytes();
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
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
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
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKeyDistributionMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.groupId != null && message.hasOwnProperty("groupId"))
                if (!$util.isString(message.groupId))
                    return "groupId: string expected";
            if (message.axolotlSenderKeyDistributionMessage != null && message.hasOwnProperty("axolotlSenderKeyDistributionMessage"))
                if (!(message.axolotlSenderKeyDistributionMessage && typeof message.axolotlSenderKeyDistributionMessage.length === "number" || $util.isString(message.axolotlSenderKeyDistributionMessage)))
                    return "axolotlSenderKeyDistributionMessage: buffer expected";
            return null;
        };

        /**
         * Creates a SenderKeyDistributionMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SenderKeyDistributionMessage} SenderKeyDistributionMessage
         */
        SenderKeyDistributionMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SenderKeyDistributionMessage)
                return object;
            var message = new $root.proto.SenderKeyDistributionMessage();
            if (object.groupId != null)
                message.groupId = String(object.groupId);
            if (object.axolotlSenderKeyDistributionMessage != null)
                if (typeof object.axolotlSenderKeyDistributionMessage === "string")
                    $util.base64.decode(object.axolotlSenderKeyDistributionMessage, message.axolotlSenderKeyDistributionMessage = $util.newBuffer($util.base64.length(object.axolotlSenderKeyDistributionMessage)), 0);
                else if (object.axolotlSenderKeyDistributionMessage.length)
                    message.axolotlSenderKeyDistributionMessage = object.axolotlSenderKeyDistributionMessage;
            return message;
        };

        /**
         * Creates a plain object from a SenderKeyDistributionMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SenderKeyDistributionMessage
         * @static
         * @param {proto.SenderKeyDistributionMessage} message SenderKeyDistributionMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKeyDistributionMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.groupId = "";
                if (options.bytes === String)
                    object.axolotlSenderKeyDistributionMessage = "";
                else {
                    object.axolotlSenderKeyDistributionMessage = [];
                    if (options.bytes !== Array)
                        object.axolotlSenderKeyDistributionMessage = $util.newBuffer(object.axolotlSenderKeyDistributionMessage);
                }
            }
            if (message.groupId != null && message.hasOwnProperty("groupId"))
                object.groupId = message.groupId;
            if (message.axolotlSenderKeyDistributionMessage != null && message.hasOwnProperty("axolotlSenderKeyDistributionMessage"))
                object.axolotlSenderKeyDistributionMessage = options.bytes === String ? $util.base64.encode(message.axolotlSenderKeyDistributionMessage, 0, message.axolotlSenderKeyDistributionMessage.length) : options.bytes === Array ? Array.prototype.slice.call(message.axolotlSenderKeyDistributionMessage) : message.axolotlSenderKeyDistributionMessage;
            return object;
        };

        /**
         * Converts this SenderKeyDistributionMessage to JSON.
         * @function toJSON
         * @memberof proto.SenderKeyDistributionMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKeyDistributionMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKeyDistributionMessage;
    })();

    proto.ImageMessage = (function() {

        /**
         * Properties of an ImageMessage.
         * @memberof proto
         * @interface IImageMessage
         * @property {string|null} [url] ImageMessage url
         * @property {string|null} [mimetype] ImageMessage mimetype
         * @property {string|null} [caption] ImageMessage caption
         * @property {Uint8Array|null} [fileSha256] ImageMessage fileSha256
         * @property {number|Long|null} [fileLength] ImageMessage fileLength
         * @property {number|null} [height] ImageMessage height
         * @property {number|null} [width] ImageMessage width
         * @property {Uint8Array|null} [mediaKey] ImageMessage mediaKey
         * @property {Uint8Array|null} [fileEncSha256] ImageMessage fileEncSha256
         * @property {Array.<proto.IInteractiveAnnotation>|null} [interactiveAnnotations] ImageMessage interactiveAnnotations
         * @property {string|null} [directPath] ImageMessage directPath
         * @property {number|Long|null} [mediaKeyTimestamp] ImageMessage mediaKeyTimestamp
         * @property {Uint8Array|null} [jpegThumbnail] ImageMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] ImageMessage contextInfo
         * @property {Uint8Array|null} [firstScanSidecar] ImageMessage firstScanSidecar
         * @property {number|null} [firstScanLength] ImageMessage firstScanLength
         * @property {number|null} [experimentGroupId] ImageMessage experimentGroupId
         * @property {Uint8Array|null} [scansSidecar] ImageMessage scansSidecar
         * @property {Array.<number>|null} [scanLengths] ImageMessage scanLengths
         * @property {Uint8Array|null} [midQualityFileSha256] ImageMessage midQualityFileSha256
         * @property {Uint8Array|null} [midQualityFileEncSha256] ImageMessage midQualityFileEncSha256
         */

        /**
         * Constructs a new ImageMessage.
         * @memberof proto
         * @classdesc Represents an ImageMessage.
         * @implements IImageMessage
         * @constructor
         * @param {proto.IImageMessage=} [properties] Properties to set
         */
        function ImageMessage(properties) {
            this.interactiveAnnotations = [];
            this.scanLengths = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ImageMessage url.
         * @member {string} url
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.url = "";

        /**
         * ImageMessage mimetype.
         * @member {string} mimetype
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.mimetype = "";

        /**
         * ImageMessage caption.
         * @member {string} caption
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.caption = "";

        /**
         * ImageMessage fileSha256.
         * @member {Uint8Array} fileSha256
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.fileSha256 = $util.newBuffer([]);

        /**
         * ImageMessage fileLength.
         * @member {number|Long} fileLength
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ImageMessage height.
         * @member {number} height
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.height = 0;

        /**
         * ImageMessage width.
         * @member {number} width
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.width = 0;

        /**
         * ImageMessage mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.mediaKey = $util.newBuffer([]);

        /**
         * ImageMessage fileEncSha256.
         * @member {Uint8Array} fileEncSha256
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.fileEncSha256 = $util.newBuffer([]);

        /**
         * ImageMessage interactiveAnnotations.
         * @member {Array.<proto.IInteractiveAnnotation>} interactiveAnnotations
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.interactiveAnnotations = $util.emptyArray;

        /**
         * ImageMessage directPath.
         * @member {string} directPath
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.directPath = "";

        /**
         * ImageMessage mediaKeyTimestamp.
         * @member {number|Long} mediaKeyTimestamp
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.mediaKeyTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ImageMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * ImageMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.contextInfo = null;

        /**
         * ImageMessage firstScanSidecar.
         * @member {Uint8Array} firstScanSidecar
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.firstScanSidecar = $util.newBuffer([]);

        /**
         * ImageMessage firstScanLength.
         * @member {number} firstScanLength
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.firstScanLength = 0;

        /**
         * ImageMessage experimentGroupId.
         * @member {number} experimentGroupId
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.experimentGroupId = 0;

        /**
         * ImageMessage scansSidecar.
         * @member {Uint8Array} scansSidecar
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.scansSidecar = $util.newBuffer([]);

        /**
         * ImageMessage scanLengths.
         * @member {Array.<number>} scanLengths
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.scanLengths = $util.emptyArray;

        /**
         * ImageMessage midQualityFileSha256.
         * @member {Uint8Array} midQualityFileSha256
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.midQualityFileSha256 = $util.newBuffer([]);

        /**
         * ImageMessage midQualityFileEncSha256.
         * @member {Uint8Array} midQualityFileEncSha256
         * @memberof proto.ImageMessage
         * @instance
         */
        ImageMessage.prototype.midQualityFileEncSha256 = $util.newBuffer([]);

        /**
         * Creates a new ImageMessage instance using the specified properties.
         * @function create
         * @memberof proto.ImageMessage
         * @static
         * @param {proto.IImageMessage=} [properties] Properties to set
         * @returns {proto.ImageMessage} ImageMessage instance
         */
        ImageMessage.create = function create(properties) {
            return new ImageMessage(properties);
        };

        /**
         * Encodes the specified ImageMessage message. Does not implicitly {@link proto.ImageMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ImageMessage
         * @static
         * @param {proto.IImageMessage} message ImageMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimetype);
            if (message.caption != null && Object.hasOwnProperty.call(message, "caption"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.caption);
            if (message.fileSha256 != null && Object.hasOwnProperty.call(message, "fileSha256"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.fileSha256);
            if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.fileLength);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.height);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.width);
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.mediaKey);
            if (message.fileEncSha256 != null && Object.hasOwnProperty.call(message, "fileEncSha256"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.fileEncSha256);
            if (message.interactiveAnnotations != null && message.interactiveAnnotations.length)
                for (var i = 0; i < message.interactiveAnnotations.length; ++i)
                    $root.proto.InteractiveAnnotation.encode(message.interactiveAnnotations[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.directPath);
            if (message.mediaKeyTimestamp != null && Object.hasOwnProperty.call(message, "mediaKeyTimestamp"))
                writer.uint32(/* id 12, wireType 0 =*/96).int64(message.mediaKeyTimestamp);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.firstScanSidecar != null && Object.hasOwnProperty.call(message, "firstScanSidecar"))
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.firstScanSidecar);
            if (message.firstScanLength != null && Object.hasOwnProperty.call(message, "firstScanLength"))
                writer.uint32(/* id 19, wireType 0 =*/152).uint32(message.firstScanLength);
            if (message.experimentGroupId != null && Object.hasOwnProperty.call(message, "experimentGroupId"))
                writer.uint32(/* id 20, wireType 0 =*/160).uint32(message.experimentGroupId);
            if (message.scansSidecar != null && Object.hasOwnProperty.call(message, "scansSidecar"))
                writer.uint32(/* id 21, wireType 2 =*/170).bytes(message.scansSidecar);
            if (message.scanLengths != null && message.scanLengths.length)
                for (var i = 0; i < message.scanLengths.length; ++i)
                    writer.uint32(/* id 22, wireType 0 =*/176).uint32(message.scanLengths[i]);
            if (message.midQualityFileSha256 != null && Object.hasOwnProperty.call(message, "midQualityFileSha256"))
                writer.uint32(/* id 23, wireType 2 =*/186).bytes(message.midQualityFileSha256);
            if (message.midQualityFileEncSha256 != null && Object.hasOwnProperty.call(message, "midQualityFileEncSha256"))
                writer.uint32(/* id 24, wireType 2 =*/194).bytes(message.midQualityFileEncSha256);
            return writer;
        };

        /**
         * Encodes the specified ImageMessage message, length delimited. Does not implicitly {@link proto.ImageMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ImageMessage
         * @static
         * @param {proto.IImageMessage} message ImageMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ImageMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ImageMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ImageMessage} ImageMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ImageMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.mimetype = reader.string();
                    break;
                case 3:
                    message.caption = reader.string();
                    break;
                case 4:
                    message.fileSha256 = reader.bytes();
                    break;
                case 5:
                    message.fileLength = reader.uint64();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                case 7:
                    message.width = reader.uint32();
                    break;
                case 8:
                    message.mediaKey = reader.bytes();
                    break;
                case 9:
                    message.fileEncSha256 = reader.bytes();
                    break;
                case 10:
                    if (!(message.interactiveAnnotations && message.interactiveAnnotations.length))
                        message.interactiveAnnotations = [];
                    message.interactiveAnnotations.push($root.proto.InteractiveAnnotation.decode(reader, reader.uint32()));
                    break;
                case 11:
                    message.directPath = reader.string();
                    break;
                case 12:
                    message.mediaKeyTimestamp = reader.int64();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.firstScanSidecar = reader.bytes();
                    break;
                case 19:
                    message.firstScanLength = reader.uint32();
                    break;
                case 20:
                    message.experimentGroupId = reader.uint32();
                    break;
                case 21:
                    message.scansSidecar = reader.bytes();
                    break;
                case 22:
                    if (!(message.scanLengths && message.scanLengths.length))
                        message.scanLengths = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.scanLengths.push(reader.uint32());
                    } else
                        message.scanLengths.push(reader.uint32());
                    break;
                case 23:
                    message.midQualityFileSha256 = reader.bytes();
                    break;
                case 24:
                    message.midQualityFileEncSha256 = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ImageMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ImageMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ImageMessage} ImageMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ImageMessage message.
         * @function verify
         * @memberof proto.ImageMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ImageMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                if (!$util.isString(message.mimetype))
                    return "mimetype: string expected";
            if (message.caption != null && message.hasOwnProperty("caption"))
                if (!$util.isString(message.caption))
                    return "caption: string expected";
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                if (!(message.fileSha256 && typeof message.fileSha256.length === "number" || $util.isString(message.fileSha256)))
                    return "fileSha256: buffer expected";
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
                    return "fileLength: integer|Long expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                if (!(message.fileEncSha256 && typeof message.fileEncSha256.length === "number" || $util.isString(message.fileEncSha256)))
                    return "fileEncSha256: buffer expected";
            if (message.interactiveAnnotations != null && message.hasOwnProperty("interactiveAnnotations")) {
                if (!Array.isArray(message.interactiveAnnotations))
                    return "interactiveAnnotations: array expected";
                for (var i = 0; i < message.interactiveAnnotations.length; ++i) {
                    var error = $root.proto.InteractiveAnnotation.verify(message.interactiveAnnotations[i]);
                    if (error)
                        return "interactiveAnnotations." + error;
                }
            }
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (!$util.isInteger(message.mediaKeyTimestamp) && !(message.mediaKeyTimestamp && $util.isInteger(message.mediaKeyTimestamp.low) && $util.isInteger(message.mediaKeyTimestamp.high)))
                    return "mediaKeyTimestamp: integer|Long expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.firstScanSidecar != null && message.hasOwnProperty("firstScanSidecar"))
                if (!(message.firstScanSidecar && typeof message.firstScanSidecar.length === "number" || $util.isString(message.firstScanSidecar)))
                    return "firstScanSidecar: buffer expected";
            if (message.firstScanLength != null && message.hasOwnProperty("firstScanLength"))
                if (!$util.isInteger(message.firstScanLength))
                    return "firstScanLength: integer expected";
            if (message.experimentGroupId != null && message.hasOwnProperty("experimentGroupId"))
                if (!$util.isInteger(message.experimentGroupId))
                    return "experimentGroupId: integer expected";
            if (message.scansSidecar != null && message.hasOwnProperty("scansSidecar"))
                if (!(message.scansSidecar && typeof message.scansSidecar.length === "number" || $util.isString(message.scansSidecar)))
                    return "scansSidecar: buffer expected";
            if (message.scanLengths != null && message.hasOwnProperty("scanLengths")) {
                if (!Array.isArray(message.scanLengths))
                    return "scanLengths: array expected";
                for (var i = 0; i < message.scanLengths.length; ++i)
                    if (!$util.isInteger(message.scanLengths[i]))
                        return "scanLengths: integer[] expected";
            }
            if (message.midQualityFileSha256 != null && message.hasOwnProperty("midQualityFileSha256"))
                if (!(message.midQualityFileSha256 && typeof message.midQualityFileSha256.length === "number" || $util.isString(message.midQualityFileSha256)))
                    return "midQualityFileSha256: buffer expected";
            if (message.midQualityFileEncSha256 != null && message.hasOwnProperty("midQualityFileEncSha256"))
                if (!(message.midQualityFileEncSha256 && typeof message.midQualityFileEncSha256.length === "number" || $util.isString(message.midQualityFileEncSha256)))
                    return "midQualityFileEncSha256: buffer expected";
            return null;
        };

        /**
         * Creates an ImageMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ImageMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ImageMessage} ImageMessage
         */
        ImageMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ImageMessage)
                return object;
            var message = new $root.proto.ImageMessage();
            if (object.url != null)
                message.url = String(object.url);
            if (object.mimetype != null)
                message.mimetype = String(object.mimetype);
            if (object.caption != null)
                message.caption = String(object.caption);
            if (object.fileSha256 != null)
                if (typeof object.fileSha256 === "string")
                    $util.base64.decode(object.fileSha256, message.fileSha256 = $util.newBuffer($util.base64.length(object.fileSha256)), 0);
                else if (object.fileSha256.length)
                    message.fileSha256 = object.fileSha256;
            if (object.fileLength != null)
                if ($util.Long)
                    (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = true;
                else if (typeof object.fileLength === "string")
                    message.fileLength = parseInt(object.fileLength, 10);
                else if (typeof object.fileLength === "number")
                    message.fileLength = object.fileLength;
                else if (typeof object.fileLength === "object")
                    message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber(true);
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length)
                    message.mediaKey = object.mediaKey;
            if (object.fileEncSha256 != null)
                if (typeof object.fileEncSha256 === "string")
                    $util.base64.decode(object.fileEncSha256, message.fileEncSha256 = $util.newBuffer($util.base64.length(object.fileEncSha256)), 0);
                else if (object.fileEncSha256.length)
                    message.fileEncSha256 = object.fileEncSha256;
            if (object.interactiveAnnotations) {
                if (!Array.isArray(object.interactiveAnnotations))
                    throw TypeError(".proto.ImageMessage.interactiveAnnotations: array expected");
                message.interactiveAnnotations = [];
                for (var i = 0; i < object.interactiveAnnotations.length; ++i) {
                    if (typeof object.interactiveAnnotations[i] !== "object")
                        throw TypeError(".proto.ImageMessage.interactiveAnnotations: object expected");
                    message.interactiveAnnotations[i] = $root.proto.InteractiveAnnotation.fromObject(object.interactiveAnnotations[i]);
                }
            }
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.mediaKeyTimestamp != null)
                if ($util.Long)
                    (message.mediaKeyTimestamp = $util.Long.fromValue(object.mediaKeyTimestamp)).unsigned = false;
                else if (typeof object.mediaKeyTimestamp === "string")
                    message.mediaKeyTimestamp = parseInt(object.mediaKeyTimestamp, 10);
                else if (typeof object.mediaKeyTimestamp === "number")
                    message.mediaKeyTimestamp = object.mediaKeyTimestamp;
                else if (typeof object.mediaKeyTimestamp === "object")
                    message.mediaKeyTimestamp = new $util.LongBits(object.mediaKeyTimestamp.low >>> 0, object.mediaKeyTimestamp.high >>> 0).toNumber();
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.ImageMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.firstScanSidecar != null)
                if (typeof object.firstScanSidecar === "string")
                    $util.base64.decode(object.firstScanSidecar, message.firstScanSidecar = $util.newBuffer($util.base64.length(object.firstScanSidecar)), 0);
                else if (object.firstScanSidecar.length)
                    message.firstScanSidecar = object.firstScanSidecar;
            if (object.firstScanLength != null)
                message.firstScanLength = object.firstScanLength >>> 0;
            if (object.experimentGroupId != null)
                message.experimentGroupId = object.experimentGroupId >>> 0;
            if (object.scansSidecar != null)
                if (typeof object.scansSidecar === "string")
                    $util.base64.decode(object.scansSidecar, message.scansSidecar = $util.newBuffer($util.base64.length(object.scansSidecar)), 0);
                else if (object.scansSidecar.length)
                    message.scansSidecar = object.scansSidecar;
            if (object.scanLengths) {
                if (!Array.isArray(object.scanLengths))
                    throw TypeError(".proto.ImageMessage.scanLengths: array expected");
                message.scanLengths = [];
                for (var i = 0; i < object.scanLengths.length; ++i)
                    message.scanLengths[i] = object.scanLengths[i] >>> 0;
            }
            if (object.midQualityFileSha256 != null)
                if (typeof object.midQualityFileSha256 === "string")
                    $util.base64.decode(object.midQualityFileSha256, message.midQualityFileSha256 = $util.newBuffer($util.base64.length(object.midQualityFileSha256)), 0);
                else if (object.midQualityFileSha256.length)
                    message.midQualityFileSha256 = object.midQualityFileSha256;
            if (object.midQualityFileEncSha256 != null)
                if (typeof object.midQualityFileEncSha256 === "string")
                    $util.base64.decode(object.midQualityFileEncSha256, message.midQualityFileEncSha256 = $util.newBuffer($util.base64.length(object.midQualityFileEncSha256)), 0);
                else if (object.midQualityFileEncSha256.length)
                    message.midQualityFileEncSha256 = object.midQualityFileEncSha256;
            return message;
        };

        /**
         * Creates a plain object from an ImageMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ImageMessage
         * @static
         * @param {proto.ImageMessage} message ImageMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ImageMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.interactiveAnnotations = [];
                object.scanLengths = [];
            }
            if (options.defaults) {
                object.url = "";
                object.mimetype = "";
                object.caption = "";
                if (options.bytes === String)
                    object.fileSha256 = "";
                else {
                    object.fileSha256 = [];
                    if (options.bytes !== Array)
                        object.fileSha256 = $util.newBuffer(object.fileSha256);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileLength = options.longs === String ? "0" : 0;
                object.height = 0;
                object.width = 0;
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                if (options.bytes === String)
                    object.fileEncSha256 = "";
                else {
                    object.fileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSha256 = $util.newBuffer(object.fileEncSha256);
                }
                object.directPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mediaKeyTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mediaKeyTimestamp = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
                if (options.bytes === String)
                    object.firstScanSidecar = "";
                else {
                    object.firstScanSidecar = [];
                    if (options.bytes !== Array)
                        object.firstScanSidecar = $util.newBuffer(object.firstScanSidecar);
                }
                object.firstScanLength = 0;
                object.experimentGroupId = 0;
                if (options.bytes === String)
                    object.scansSidecar = "";
                else {
                    object.scansSidecar = [];
                    if (options.bytes !== Array)
                        object.scansSidecar = $util.newBuffer(object.scansSidecar);
                }
                if (options.bytes === String)
                    object.midQualityFileSha256 = "";
                else {
                    object.midQualityFileSha256 = [];
                    if (options.bytes !== Array)
                        object.midQualityFileSha256 = $util.newBuffer(object.midQualityFileSha256);
                }
                if (options.bytes === String)
                    object.midQualityFileEncSha256 = "";
                else {
                    object.midQualityFileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.midQualityFileEncSha256 = $util.newBuffer(object.midQualityFileEncSha256);
                }
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                object.mimetype = message.mimetype;
            if (message.caption != null && message.hasOwnProperty("caption"))
                object.caption = message.caption;
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                object.fileSha256 = options.bytes === String ? $util.base64.encode(message.fileSha256, 0, message.fileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSha256) : message.fileSha256;
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (typeof message.fileLength === "number")
                    object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
                else
                    object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber(true) : message.fileLength;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                object.fileEncSha256 = options.bytes === String ? $util.base64.encode(message.fileEncSha256, 0, message.fileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSha256) : message.fileEncSha256;
            if (message.interactiveAnnotations && message.interactiveAnnotations.length) {
                object.interactiveAnnotations = [];
                for (var j = 0; j < message.interactiveAnnotations.length; ++j)
                    object.interactiveAnnotations[j] = $root.proto.InteractiveAnnotation.toObject(message.interactiveAnnotations[j], options);
            }
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (typeof message.mediaKeyTimestamp === "number")
                    object.mediaKeyTimestamp = options.longs === String ? String(message.mediaKeyTimestamp) : message.mediaKeyTimestamp;
                else
                    object.mediaKeyTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.mediaKeyTimestamp) : options.longs === Number ? new $util.LongBits(message.mediaKeyTimestamp.low >>> 0, message.mediaKeyTimestamp.high >>> 0).toNumber() : message.mediaKeyTimestamp;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.firstScanSidecar != null && message.hasOwnProperty("firstScanSidecar"))
                object.firstScanSidecar = options.bytes === String ? $util.base64.encode(message.firstScanSidecar, 0, message.firstScanSidecar.length) : options.bytes === Array ? Array.prototype.slice.call(message.firstScanSidecar) : message.firstScanSidecar;
            if (message.firstScanLength != null && message.hasOwnProperty("firstScanLength"))
                object.firstScanLength = message.firstScanLength;
            if (message.experimentGroupId != null && message.hasOwnProperty("experimentGroupId"))
                object.experimentGroupId = message.experimentGroupId;
            if (message.scansSidecar != null && message.hasOwnProperty("scansSidecar"))
                object.scansSidecar = options.bytes === String ? $util.base64.encode(message.scansSidecar, 0, message.scansSidecar.length) : options.bytes === Array ? Array.prototype.slice.call(message.scansSidecar) : message.scansSidecar;
            if (message.scanLengths && message.scanLengths.length) {
                object.scanLengths = [];
                for (var j = 0; j < message.scanLengths.length; ++j)
                    object.scanLengths[j] = message.scanLengths[j];
            }
            if (message.midQualityFileSha256 != null && message.hasOwnProperty("midQualityFileSha256"))
                object.midQualityFileSha256 = options.bytes === String ? $util.base64.encode(message.midQualityFileSha256, 0, message.midQualityFileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.midQualityFileSha256) : message.midQualityFileSha256;
            if (message.midQualityFileEncSha256 != null && message.hasOwnProperty("midQualityFileEncSha256"))
                object.midQualityFileEncSha256 = options.bytes === String ? $util.base64.encode(message.midQualityFileEncSha256, 0, message.midQualityFileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.midQualityFileEncSha256) : message.midQualityFileEncSha256;
            return object;
        };

        /**
         * Converts this ImageMessage to JSON.
         * @function toJSON
         * @memberof proto.ImageMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ImageMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ImageMessage;
    })();

    proto.ContactMessage = (function() {

        /**
         * Properties of a ContactMessage.
         * @memberof proto
         * @interface IContactMessage
         * @property {string|null} [displayName] ContactMessage displayName
         * @property {string|null} [vcard] ContactMessage vcard
         * @property {proto.IContextInfo|null} [contextInfo] ContactMessage contextInfo
         */

        /**
         * Constructs a new ContactMessage.
         * @memberof proto
         * @classdesc Represents a ContactMessage.
         * @implements IContactMessage
         * @constructor
         * @param {proto.IContactMessage=} [properties] Properties to set
         */
        function ContactMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContactMessage displayName.
         * @member {string} displayName
         * @memberof proto.ContactMessage
         * @instance
         */
        ContactMessage.prototype.displayName = "";

        /**
         * ContactMessage vcard.
         * @member {string} vcard
         * @memberof proto.ContactMessage
         * @instance
         */
        ContactMessage.prototype.vcard = "";

        /**
         * ContactMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.ContactMessage
         * @instance
         */
        ContactMessage.prototype.contextInfo = null;

        /**
         * Creates a new ContactMessage instance using the specified properties.
         * @function create
         * @memberof proto.ContactMessage
         * @static
         * @param {proto.IContactMessage=} [properties] Properties to set
         * @returns {proto.ContactMessage} ContactMessage instance
         */
        ContactMessage.create = function create(properties) {
            return new ContactMessage(properties);
        };

        /**
         * Encodes the specified ContactMessage message. Does not implicitly {@link proto.ContactMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ContactMessage
         * @static
         * @param {proto.IContactMessage} message ContactMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayName);
            if (message.vcard != null && Object.hasOwnProperty.call(message, "vcard"))
                writer.uint32(/* id 16, wireType 2 =*/130).string(message.vcard);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContactMessage message, length delimited. Does not implicitly {@link proto.ContactMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ContactMessage
         * @static
         * @param {proto.IContactMessage} message ContactMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContactMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ContactMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ContactMessage} ContactMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ContactMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayName = reader.string();
                    break;
                case 16:
                    message.vcard = reader.string();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContactMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ContactMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ContactMessage} ContactMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContactMessage message.
         * @function verify
         * @memberof proto.ContactMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContactMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.vcard != null && message.hasOwnProperty("vcard"))
                if (!$util.isString(message.vcard))
                    return "vcard: string expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a ContactMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ContactMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ContactMessage} ContactMessage
         */
        ContactMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ContactMessage)
                return object;
            var message = new $root.proto.ContactMessage();
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.vcard != null)
                message.vcard = String(object.vcard);
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.ContactMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContactMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ContactMessage
         * @static
         * @param {proto.ContactMessage} message ContactMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContactMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayName = "";
                object.vcard = "";
                object.contextInfo = null;
            }
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.vcard != null && message.hasOwnProperty("vcard"))
                object.vcard = message.vcard;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this ContactMessage to JSON.
         * @function toJSON
         * @memberof proto.ContactMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContactMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContactMessage;
    })();

    proto.LocationMessage = (function() {

        /**
         * Properties of a LocationMessage.
         * @memberof proto
         * @interface ILocationMessage
         * @property {number|null} [degreesLatitude] LocationMessage degreesLatitude
         * @property {number|null} [degreesLongitude] LocationMessage degreesLongitude
         * @property {string|null} [name] LocationMessage name
         * @property {string|null} [address] LocationMessage address
         * @property {string|null} [url] LocationMessage url
         * @property {Uint8Array|null} [jpegThumbnail] LocationMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] LocationMessage contextInfo
         */

        /**
         * Constructs a new LocationMessage.
         * @memberof proto
         * @classdesc Represents a LocationMessage.
         * @implements ILocationMessage
         * @constructor
         * @param {proto.ILocationMessage=} [properties] Properties to set
         */
        function LocationMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LocationMessage degreesLatitude.
         * @member {number} degreesLatitude
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.degreesLatitude = 0;

        /**
         * LocationMessage degreesLongitude.
         * @member {number} degreesLongitude
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.degreesLongitude = 0;

        /**
         * LocationMessage name.
         * @member {string} name
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.name = "";

        /**
         * LocationMessage address.
         * @member {string} address
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.address = "";

        /**
         * LocationMessage url.
         * @member {string} url
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.url = "";

        /**
         * LocationMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * LocationMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.LocationMessage
         * @instance
         */
        LocationMessage.prototype.contextInfo = null;

        /**
         * Creates a new LocationMessage instance using the specified properties.
         * @function create
         * @memberof proto.LocationMessage
         * @static
         * @param {proto.ILocationMessage=} [properties] Properties to set
         * @returns {proto.LocationMessage} LocationMessage instance
         */
        LocationMessage.create = function create(properties) {
            return new LocationMessage(properties);
        };

        /**
         * Encodes the specified LocationMessage message. Does not implicitly {@link proto.LocationMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.LocationMessage
         * @static
         * @param {proto.ILocationMessage} message LocationMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocationMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.degreesLatitude != null && Object.hasOwnProperty.call(message, "degreesLatitude"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.degreesLatitude);
            if (message.degreesLongitude != null && Object.hasOwnProperty.call(message, "degreesLongitude"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.degreesLongitude);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.address);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.url);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LocationMessage message, length delimited. Does not implicitly {@link proto.LocationMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.LocationMessage
         * @static
         * @param {proto.ILocationMessage} message LocationMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocationMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LocationMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.LocationMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.LocationMessage} LocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocationMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.LocationMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.degreesLatitude = reader.double();
                    break;
                case 2:
                    message.degreesLongitude = reader.double();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.address = reader.string();
                    break;
                case 5:
                    message.url = reader.string();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LocationMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.LocationMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.LocationMessage} LocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocationMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LocationMessage message.
         * @function verify
         * @memberof proto.LocationMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LocationMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                if (typeof message.degreesLatitude !== "number")
                    return "degreesLatitude: number expected";
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                if (typeof message.degreesLongitude !== "number")
                    return "degreesLongitude: number expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a LocationMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.LocationMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.LocationMessage} LocationMessage
         */
        LocationMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.LocationMessage)
                return object;
            var message = new $root.proto.LocationMessage();
            if (object.degreesLatitude != null)
                message.degreesLatitude = Number(object.degreesLatitude);
            if (object.degreesLongitude != null)
                message.degreesLongitude = Number(object.degreesLongitude);
            if (object.name != null)
                message.name = String(object.name);
            if (object.address != null)
                message.address = String(object.address);
            if (object.url != null)
                message.url = String(object.url);
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.LocationMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a LocationMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.LocationMessage
         * @static
         * @param {proto.LocationMessage} message LocationMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LocationMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.degreesLatitude = 0;
                object.degreesLongitude = 0;
                object.name = "";
                object.address = "";
                object.url = "";
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
            }
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                object.degreesLatitude = options.json && !isFinite(message.degreesLatitude) ? String(message.degreesLatitude) : message.degreesLatitude;
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                object.degreesLongitude = options.json && !isFinite(message.degreesLongitude) ? String(message.degreesLongitude) : message.degreesLongitude;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this LocationMessage to JSON.
         * @function toJSON
         * @memberof proto.LocationMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LocationMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LocationMessage;
    })();

    proto.ExtendedTextMessage = (function() {

        /**
         * Properties of an ExtendedTextMessage.
         * @memberof proto
         * @interface IExtendedTextMessage
         * @property {string|null} [text] ExtendedTextMessage text
         * @property {string|null} [matchedText] ExtendedTextMessage matchedText
         * @property {string|null} [canonicalUrl] ExtendedTextMessage canonicalUrl
         * @property {string|null} [description] ExtendedTextMessage description
         * @property {string|null} [title] ExtendedTextMessage title
         * @property {number|null} [textArgb] ExtendedTextMessage textArgb
         * @property {number|null} [backgroundArgb] ExtendedTextMessage backgroundArgb
         * @property {proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE|null} [font] ExtendedTextMessage font
         * @property {proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE|null} [previewType] ExtendedTextMessage previewType
         * @property {Uint8Array|null} [jpegThumbnail] ExtendedTextMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] ExtendedTextMessage contextInfo
         * @property {boolean|null} [doNotPlayInline] ExtendedTextMessage doNotPlayInline
         */

        /**
         * Constructs a new ExtendedTextMessage.
         * @memberof proto
         * @classdesc Represents an ExtendedTextMessage.
         * @implements IExtendedTextMessage
         * @constructor
         * @param {proto.IExtendedTextMessage=} [properties] Properties to set
         */
        function ExtendedTextMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExtendedTextMessage text.
         * @member {string} text
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.text = "";

        /**
         * ExtendedTextMessage matchedText.
         * @member {string} matchedText
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.matchedText = "";

        /**
         * ExtendedTextMessage canonicalUrl.
         * @member {string} canonicalUrl
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.canonicalUrl = "";

        /**
         * ExtendedTextMessage description.
         * @member {string} description
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.description = "";

        /**
         * ExtendedTextMessage title.
         * @member {string} title
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.title = "";

        /**
         * ExtendedTextMessage textArgb.
         * @member {number} textArgb
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.textArgb = 0;

        /**
         * ExtendedTextMessage backgroundArgb.
         * @member {number} backgroundArgb
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.backgroundArgb = 0;

        /**
         * ExtendedTextMessage font.
         * @member {proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE} font
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.font = 0;

        /**
         * ExtendedTextMessage previewType.
         * @member {proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE} previewType
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.previewType = 0;

        /**
         * ExtendedTextMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * ExtendedTextMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.contextInfo = null;

        /**
         * ExtendedTextMessage doNotPlayInline.
         * @member {boolean} doNotPlayInline
         * @memberof proto.ExtendedTextMessage
         * @instance
         */
        ExtendedTextMessage.prototype.doNotPlayInline = false;

        /**
         * Creates a new ExtendedTextMessage instance using the specified properties.
         * @function create
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {proto.IExtendedTextMessage=} [properties] Properties to set
         * @returns {proto.ExtendedTextMessage} ExtendedTextMessage instance
         */
        ExtendedTextMessage.create = function create(properties) {
            return new ExtendedTextMessage(properties);
        };

        /**
         * Encodes the specified ExtendedTextMessage message. Does not implicitly {@link proto.ExtendedTextMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {proto.IExtendedTextMessage} message ExtendedTextMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExtendedTextMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.matchedText != null && Object.hasOwnProperty.call(message, "matchedText"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.matchedText);
            if (message.canonicalUrl != null && Object.hasOwnProperty.call(message, "canonicalUrl"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.canonicalUrl);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.description);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.title);
            if (message.textArgb != null && Object.hasOwnProperty.call(message, "textArgb"))
                writer.uint32(/* id 7, wireType 5 =*/61).fixed32(message.textArgb);
            if (message.backgroundArgb != null && Object.hasOwnProperty.call(message, "backgroundArgb"))
                writer.uint32(/* id 8, wireType 5 =*/69).fixed32(message.backgroundArgb);
            if (message.font != null && Object.hasOwnProperty.call(message, "font"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.font);
            if (message.previewType != null && Object.hasOwnProperty.call(message, "previewType"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.previewType);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.doNotPlayInline != null && Object.hasOwnProperty.call(message, "doNotPlayInline"))
                writer.uint32(/* id 18, wireType 0 =*/144).bool(message.doNotPlayInline);
            return writer;
        };

        /**
         * Encodes the specified ExtendedTextMessage message, length delimited. Does not implicitly {@link proto.ExtendedTextMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {proto.IExtendedTextMessage} message ExtendedTextMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExtendedTextMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExtendedTextMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ExtendedTextMessage} ExtendedTextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExtendedTextMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ExtendedTextMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.text = reader.string();
                    break;
                case 2:
                    message.matchedText = reader.string();
                    break;
                case 4:
                    message.canonicalUrl = reader.string();
                    break;
                case 5:
                    message.description = reader.string();
                    break;
                case 6:
                    message.title = reader.string();
                    break;
                case 7:
                    message.textArgb = reader.fixed32();
                    break;
                case 8:
                    message.backgroundArgb = reader.fixed32();
                    break;
                case 9:
                    message.font = reader.int32();
                    break;
                case 10:
                    message.previewType = reader.int32();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.doNotPlayInline = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExtendedTextMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ExtendedTextMessage} ExtendedTextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExtendedTextMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExtendedTextMessage message.
         * @function verify
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExtendedTextMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.matchedText != null && message.hasOwnProperty("matchedText"))
                if (!$util.isString(message.matchedText))
                    return "matchedText: string expected";
            if (message.canonicalUrl != null && message.hasOwnProperty("canonicalUrl"))
                if (!$util.isString(message.canonicalUrl))
                    return "canonicalUrl: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.textArgb != null && message.hasOwnProperty("textArgb"))
                if (!$util.isInteger(message.textArgb))
                    return "textArgb: integer expected";
            if (message.backgroundArgb != null && message.hasOwnProperty("backgroundArgb"))
                if (!$util.isInteger(message.backgroundArgb))
                    return "backgroundArgb: integer expected";
            if (message.font != null && message.hasOwnProperty("font"))
                switch (message.font) {
                default:
                    return "font: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.previewType != null && message.hasOwnProperty("previewType"))
                switch (message.previewType) {
                default:
                    return "previewType: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.doNotPlayInline != null && message.hasOwnProperty("doNotPlayInline"))
                if (typeof message.doNotPlayInline !== "boolean")
                    return "doNotPlayInline: boolean expected";
            return null;
        };

        /**
         * Creates an ExtendedTextMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ExtendedTextMessage} ExtendedTextMessage
         */
        ExtendedTextMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ExtendedTextMessage)
                return object;
            var message = new $root.proto.ExtendedTextMessage();
            if (object.text != null)
                message.text = String(object.text);
            if (object.matchedText != null)
                message.matchedText = String(object.matchedText);
            if (object.canonicalUrl != null)
                message.canonicalUrl = String(object.canonicalUrl);
            if (object.description != null)
                message.description = String(object.description);
            if (object.title != null)
                message.title = String(object.title);
            if (object.textArgb != null)
                message.textArgb = object.textArgb >>> 0;
            if (object.backgroundArgb != null)
                message.backgroundArgb = object.backgroundArgb >>> 0;
            switch (object.font) {
            case "SANS_SERIF":
            case 0:
                message.font = 0;
                break;
            case "SERIF":
            case 1:
                message.font = 1;
                break;
            case "NORICAN_REGULAR":
            case 2:
                message.font = 2;
                break;
            case "BRYNDAN_WRITE":
            case 3:
                message.font = 3;
                break;
            case "BEBASNEUE_REGULAR":
            case 4:
                message.font = 4;
                break;
            case "OSWALD_HEAVY":
            case 5:
                message.font = 5;
                break;
            }
            switch (object.previewType) {
            case "NONE":
            case 0:
                message.previewType = 0;
                break;
            case "VIDEO":
            case 1:
                message.previewType = 1;
                break;
            }
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.ExtendedTextMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.doNotPlayInline != null)
                message.doNotPlayInline = Boolean(object.doNotPlayInline);
            return message;
        };

        /**
         * Creates a plain object from an ExtendedTextMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ExtendedTextMessage
         * @static
         * @param {proto.ExtendedTextMessage} message ExtendedTextMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExtendedTextMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.text = "";
                object.matchedText = "";
                object.canonicalUrl = "";
                object.description = "";
                object.title = "";
                object.textArgb = 0;
                object.backgroundArgb = 0;
                object.font = options.enums === String ? "SANS_SERIF" : 0;
                object.previewType = options.enums === String ? "NONE" : 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
                object.doNotPlayInline = false;
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            if (message.matchedText != null && message.hasOwnProperty("matchedText"))
                object.matchedText = message.matchedText;
            if (message.canonicalUrl != null && message.hasOwnProperty("canonicalUrl"))
                object.canonicalUrl = message.canonicalUrl;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.textArgb != null && message.hasOwnProperty("textArgb"))
                object.textArgb = message.textArgb;
            if (message.backgroundArgb != null && message.hasOwnProperty("backgroundArgb"))
                object.backgroundArgb = message.backgroundArgb;
            if (message.font != null && message.hasOwnProperty("font"))
                object.font = options.enums === String ? $root.proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE[message.font] : message.font;
            if (message.previewType != null && message.hasOwnProperty("previewType"))
                object.previewType = options.enums === String ? $root.proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE[message.previewType] : message.previewType;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.doNotPlayInline != null && message.hasOwnProperty("doNotPlayInline"))
                object.doNotPlayInline = message.doNotPlayInline;
            return object;
        };

        /**
         * Converts this ExtendedTextMessage to JSON.
         * @function toJSON
         * @memberof proto.ExtendedTextMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExtendedTextMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * EXTENDED_TEXT_MESSAGE_FONTTYPE enum.
         * @name proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE
         * @enum {number}
         * @property {number} SANS_SERIF=0 SANS_SERIF value
         * @property {number} SERIF=1 SERIF value
         * @property {number} NORICAN_REGULAR=2 NORICAN_REGULAR value
         * @property {number} BRYNDAN_WRITE=3 BRYNDAN_WRITE value
         * @property {number} BEBASNEUE_REGULAR=4 BEBASNEUE_REGULAR value
         * @property {number} OSWALD_HEAVY=5 OSWALD_HEAVY value
         */
        ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SANS_SERIF"] = 0;
            values[valuesById[1] = "SERIF"] = 1;
            values[valuesById[2] = "NORICAN_REGULAR"] = 2;
            values[valuesById[3] = "BRYNDAN_WRITE"] = 3;
            values[valuesById[4] = "BEBASNEUE_REGULAR"] = 4;
            values[valuesById[5] = "OSWALD_HEAVY"] = 5;
            return values;
        })();

        /**
         * EXTENDED_TEXT_MESSAGE_PREVIEWTYPE enum.
         * @name proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} VIDEO=1 VIDEO value
         */
        ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "VIDEO"] = 1;
            return values;
        })();

        return ExtendedTextMessage;
    })();

    proto.DocumentMessage = (function() {

        /**
         * Properties of a DocumentMessage.
         * @memberof proto
         * @interface IDocumentMessage
         * @property {string|null} [url] DocumentMessage url
         * @property {string|null} [mimetype] DocumentMessage mimetype
         * @property {string|null} [title] DocumentMessage title
         * @property {Uint8Array|null} [fileSha256] DocumentMessage fileSha256
         * @property {number|Long|null} [fileLength] DocumentMessage fileLength
         * @property {number|null} [pageCount] DocumentMessage pageCount
         * @property {Uint8Array|null} [mediaKey] DocumentMessage mediaKey
         * @property {string|null} [fileName] DocumentMessage fileName
         * @property {Uint8Array|null} [fileEncSha256] DocumentMessage fileEncSha256
         * @property {string|null} [directPath] DocumentMessage directPath
         * @property {number|Long|null} [mediaKeyTimestamp] DocumentMessage mediaKeyTimestamp
         * @property {Uint8Array|null} [jpegThumbnail] DocumentMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] DocumentMessage contextInfo
         */

        /**
         * Constructs a new DocumentMessage.
         * @memberof proto
         * @classdesc Represents a DocumentMessage.
         * @implements IDocumentMessage
         * @constructor
         * @param {proto.IDocumentMessage=} [properties] Properties to set
         */
        function DocumentMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DocumentMessage url.
         * @member {string} url
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.url = "";

        /**
         * DocumentMessage mimetype.
         * @member {string} mimetype
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.mimetype = "";

        /**
         * DocumentMessage title.
         * @member {string} title
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.title = "";

        /**
         * DocumentMessage fileSha256.
         * @member {Uint8Array} fileSha256
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.fileSha256 = $util.newBuffer([]);

        /**
         * DocumentMessage fileLength.
         * @member {number|Long} fileLength
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DocumentMessage pageCount.
         * @member {number} pageCount
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.pageCount = 0;

        /**
         * DocumentMessage mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.mediaKey = $util.newBuffer([]);

        /**
         * DocumentMessage fileName.
         * @member {string} fileName
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.fileName = "";

        /**
         * DocumentMessage fileEncSha256.
         * @member {Uint8Array} fileEncSha256
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.fileEncSha256 = $util.newBuffer([]);

        /**
         * DocumentMessage directPath.
         * @member {string} directPath
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.directPath = "";

        /**
         * DocumentMessage mediaKeyTimestamp.
         * @member {number|Long} mediaKeyTimestamp
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.mediaKeyTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DocumentMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * DocumentMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.DocumentMessage
         * @instance
         */
        DocumentMessage.prototype.contextInfo = null;

        /**
         * Creates a new DocumentMessage instance using the specified properties.
         * @function create
         * @memberof proto.DocumentMessage
         * @static
         * @param {proto.IDocumentMessage=} [properties] Properties to set
         * @returns {proto.DocumentMessage} DocumentMessage instance
         */
        DocumentMessage.create = function create(properties) {
            return new DocumentMessage(properties);
        };

        /**
         * Encodes the specified DocumentMessage message. Does not implicitly {@link proto.DocumentMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.DocumentMessage
         * @static
         * @param {proto.IDocumentMessage} message DocumentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DocumentMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimetype);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
            if (message.fileSha256 != null && Object.hasOwnProperty.call(message, "fileSha256"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.fileSha256);
            if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.fileLength);
            if (message.pageCount != null && Object.hasOwnProperty.call(message, "pageCount"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.pageCount);
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.mediaKey);
            if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.fileName);
            if (message.fileEncSha256 != null && Object.hasOwnProperty.call(message, "fileEncSha256"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.fileEncSha256);
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.directPath);
            if (message.mediaKeyTimestamp != null && Object.hasOwnProperty.call(message, "mediaKeyTimestamp"))
                writer.uint32(/* id 11, wireType 0 =*/88).int64(message.mediaKeyTimestamp);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DocumentMessage message, length delimited. Does not implicitly {@link proto.DocumentMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.DocumentMessage
         * @static
         * @param {proto.IDocumentMessage} message DocumentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DocumentMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DocumentMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.DocumentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.DocumentMessage} DocumentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DocumentMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.DocumentMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.mimetype = reader.string();
                    break;
                case 3:
                    message.title = reader.string();
                    break;
                case 4:
                    message.fileSha256 = reader.bytes();
                    break;
                case 5:
                    message.fileLength = reader.uint64();
                    break;
                case 6:
                    message.pageCount = reader.uint32();
                    break;
                case 7:
                    message.mediaKey = reader.bytes();
                    break;
                case 8:
                    message.fileName = reader.string();
                    break;
                case 9:
                    message.fileEncSha256 = reader.bytes();
                    break;
                case 10:
                    message.directPath = reader.string();
                    break;
                case 11:
                    message.mediaKeyTimestamp = reader.int64();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DocumentMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.DocumentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.DocumentMessage} DocumentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DocumentMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DocumentMessage message.
         * @function verify
         * @memberof proto.DocumentMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DocumentMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                if (!$util.isString(message.mimetype))
                    return "mimetype: string expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                if (!(message.fileSha256 && typeof message.fileSha256.length === "number" || $util.isString(message.fileSha256)))
                    return "fileSha256: buffer expected";
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
                    return "fileLength: integer|Long expected";
            if (message.pageCount != null && message.hasOwnProperty("pageCount"))
                if (!$util.isInteger(message.pageCount))
                    return "pageCount: integer expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                if (!$util.isString(message.fileName))
                    return "fileName: string expected";
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                if (!(message.fileEncSha256 && typeof message.fileEncSha256.length === "number" || $util.isString(message.fileEncSha256)))
                    return "fileEncSha256: buffer expected";
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (!$util.isInteger(message.mediaKeyTimestamp) && !(message.mediaKeyTimestamp && $util.isInteger(message.mediaKeyTimestamp.low) && $util.isInteger(message.mediaKeyTimestamp.high)))
                    return "mediaKeyTimestamp: integer|Long expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a DocumentMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.DocumentMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.DocumentMessage} DocumentMessage
         */
        DocumentMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.DocumentMessage)
                return object;
            var message = new $root.proto.DocumentMessage();
            if (object.url != null)
                message.url = String(object.url);
            if (object.mimetype != null)
                message.mimetype = String(object.mimetype);
            if (object.title != null)
                message.title = String(object.title);
            if (object.fileSha256 != null)
                if (typeof object.fileSha256 === "string")
                    $util.base64.decode(object.fileSha256, message.fileSha256 = $util.newBuffer($util.base64.length(object.fileSha256)), 0);
                else if (object.fileSha256.length)
                    message.fileSha256 = object.fileSha256;
            if (object.fileLength != null)
                if ($util.Long)
                    (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = true;
                else if (typeof object.fileLength === "string")
                    message.fileLength = parseInt(object.fileLength, 10);
                else if (typeof object.fileLength === "number")
                    message.fileLength = object.fileLength;
                else if (typeof object.fileLength === "object")
                    message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber(true);
            if (object.pageCount != null)
                message.pageCount = object.pageCount >>> 0;
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length)
                    message.mediaKey = object.mediaKey;
            if (object.fileName != null)
                message.fileName = String(object.fileName);
            if (object.fileEncSha256 != null)
                if (typeof object.fileEncSha256 === "string")
                    $util.base64.decode(object.fileEncSha256, message.fileEncSha256 = $util.newBuffer($util.base64.length(object.fileEncSha256)), 0);
                else if (object.fileEncSha256.length)
                    message.fileEncSha256 = object.fileEncSha256;
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.mediaKeyTimestamp != null)
                if ($util.Long)
                    (message.mediaKeyTimestamp = $util.Long.fromValue(object.mediaKeyTimestamp)).unsigned = false;
                else if (typeof object.mediaKeyTimestamp === "string")
                    message.mediaKeyTimestamp = parseInt(object.mediaKeyTimestamp, 10);
                else if (typeof object.mediaKeyTimestamp === "number")
                    message.mediaKeyTimestamp = object.mediaKeyTimestamp;
                else if (typeof object.mediaKeyTimestamp === "object")
                    message.mediaKeyTimestamp = new $util.LongBits(object.mediaKeyTimestamp.low >>> 0, object.mediaKeyTimestamp.high >>> 0).toNumber();
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.DocumentMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a DocumentMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.DocumentMessage
         * @static
         * @param {proto.DocumentMessage} message DocumentMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DocumentMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.url = "";
                object.mimetype = "";
                object.title = "";
                if (options.bytes === String)
                    object.fileSha256 = "";
                else {
                    object.fileSha256 = [];
                    if (options.bytes !== Array)
                        object.fileSha256 = $util.newBuffer(object.fileSha256);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileLength = options.longs === String ? "0" : 0;
                object.pageCount = 0;
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                object.fileName = "";
                if (options.bytes === String)
                    object.fileEncSha256 = "";
                else {
                    object.fileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSha256 = $util.newBuffer(object.fileEncSha256);
                }
                object.directPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mediaKeyTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mediaKeyTimestamp = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                object.mimetype = message.mimetype;
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                object.fileSha256 = options.bytes === String ? $util.base64.encode(message.fileSha256, 0, message.fileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSha256) : message.fileSha256;
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (typeof message.fileLength === "number")
                    object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
                else
                    object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber(true) : message.fileLength;
            if (message.pageCount != null && message.hasOwnProperty("pageCount"))
                object.pageCount = message.pageCount;
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                object.fileName = message.fileName;
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                object.fileEncSha256 = options.bytes === String ? $util.base64.encode(message.fileEncSha256, 0, message.fileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSha256) : message.fileEncSha256;
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (typeof message.mediaKeyTimestamp === "number")
                    object.mediaKeyTimestamp = options.longs === String ? String(message.mediaKeyTimestamp) : message.mediaKeyTimestamp;
                else
                    object.mediaKeyTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.mediaKeyTimestamp) : options.longs === Number ? new $util.LongBits(message.mediaKeyTimestamp.low >>> 0, message.mediaKeyTimestamp.high >>> 0).toNumber() : message.mediaKeyTimestamp;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this DocumentMessage to JSON.
         * @function toJSON
         * @memberof proto.DocumentMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DocumentMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DocumentMessage;
    })();

    proto.AudioMessage = (function() {

        /**
         * Properties of an AudioMessage.
         * @memberof proto
         * @interface IAudioMessage
         * @property {string|null} [url] AudioMessage url
         * @property {string|null} [mimetype] AudioMessage mimetype
         * @property {Uint8Array|null} [fileSha256] AudioMessage fileSha256
         * @property {number|Long|null} [fileLength] AudioMessage fileLength
         * @property {number|null} [seconds] AudioMessage seconds
         * @property {boolean|null} [ptt] AudioMessage ptt
         * @property {Uint8Array|null} [mediaKey] AudioMessage mediaKey
         * @property {Uint8Array|null} [fileEncSha256] AudioMessage fileEncSha256
         * @property {string|null} [directPath] AudioMessage directPath
         * @property {number|Long|null} [mediaKeyTimestamp] AudioMessage mediaKeyTimestamp
         * @property {proto.IContextInfo|null} [contextInfo] AudioMessage contextInfo
         * @property {Uint8Array|null} [streamingSidecar] AudioMessage streamingSidecar
         */

        /**
         * Constructs a new AudioMessage.
         * @memberof proto
         * @classdesc Represents an AudioMessage.
         * @implements IAudioMessage
         * @constructor
         * @param {proto.IAudioMessage=} [properties] Properties to set
         */
        function AudioMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AudioMessage url.
         * @member {string} url
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.url = "";

        /**
         * AudioMessage mimetype.
         * @member {string} mimetype
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.mimetype = "";

        /**
         * AudioMessage fileSha256.
         * @member {Uint8Array} fileSha256
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.fileSha256 = $util.newBuffer([]);

        /**
         * AudioMessage fileLength.
         * @member {number|Long} fileLength
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * AudioMessage seconds.
         * @member {number} seconds
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.seconds = 0;

        /**
         * AudioMessage ptt.
         * @member {boolean} ptt
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.ptt = false;

        /**
         * AudioMessage mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.mediaKey = $util.newBuffer([]);

        /**
         * AudioMessage fileEncSha256.
         * @member {Uint8Array} fileEncSha256
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.fileEncSha256 = $util.newBuffer([]);

        /**
         * AudioMessage directPath.
         * @member {string} directPath
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.directPath = "";

        /**
         * AudioMessage mediaKeyTimestamp.
         * @member {number|Long} mediaKeyTimestamp
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.mediaKeyTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AudioMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.contextInfo = null;

        /**
         * AudioMessage streamingSidecar.
         * @member {Uint8Array} streamingSidecar
         * @memberof proto.AudioMessage
         * @instance
         */
        AudioMessage.prototype.streamingSidecar = $util.newBuffer([]);

        /**
         * Creates a new AudioMessage instance using the specified properties.
         * @function create
         * @memberof proto.AudioMessage
         * @static
         * @param {proto.IAudioMessage=} [properties] Properties to set
         * @returns {proto.AudioMessage} AudioMessage instance
         */
        AudioMessage.create = function create(properties) {
            return new AudioMessage(properties);
        };

        /**
         * Encodes the specified AudioMessage message. Does not implicitly {@link proto.AudioMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.AudioMessage
         * @static
         * @param {proto.IAudioMessage} message AudioMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AudioMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimetype);
            if (message.fileSha256 != null && Object.hasOwnProperty.call(message, "fileSha256"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fileSha256);
            if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.fileLength);
            if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.seconds);
            if (message.ptt != null && Object.hasOwnProperty.call(message, "ptt"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.ptt);
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.mediaKey);
            if (message.fileEncSha256 != null && Object.hasOwnProperty.call(message, "fileEncSha256"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.fileEncSha256);
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.directPath);
            if (message.mediaKeyTimestamp != null && Object.hasOwnProperty.call(message, "mediaKeyTimestamp"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.mediaKeyTimestamp);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.streamingSidecar != null && Object.hasOwnProperty.call(message, "streamingSidecar"))
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.streamingSidecar);
            return writer;
        };

        /**
         * Encodes the specified AudioMessage message, length delimited. Does not implicitly {@link proto.AudioMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.AudioMessage
         * @static
         * @param {proto.IAudioMessage} message AudioMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AudioMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AudioMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.AudioMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.AudioMessage} AudioMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AudioMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.AudioMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.mimetype = reader.string();
                    break;
                case 3:
                    message.fileSha256 = reader.bytes();
                    break;
                case 4:
                    message.fileLength = reader.uint64();
                    break;
                case 5:
                    message.seconds = reader.uint32();
                    break;
                case 6:
                    message.ptt = reader.bool();
                    break;
                case 7:
                    message.mediaKey = reader.bytes();
                    break;
                case 8:
                    message.fileEncSha256 = reader.bytes();
                    break;
                case 9:
                    message.directPath = reader.string();
                    break;
                case 10:
                    message.mediaKeyTimestamp = reader.int64();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.streamingSidecar = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AudioMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.AudioMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.AudioMessage} AudioMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AudioMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AudioMessage message.
         * @function verify
         * @memberof proto.AudioMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AudioMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                if (!$util.isString(message.mimetype))
                    return "mimetype: string expected";
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                if (!(message.fileSha256 && typeof message.fileSha256.length === "number" || $util.isString(message.fileSha256)))
                    return "fileSha256: buffer expected";
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
                    return "fileLength: integer|Long expected";
            if (message.seconds != null && message.hasOwnProperty("seconds"))
                if (!$util.isInteger(message.seconds))
                    return "seconds: integer expected";
            if (message.ptt != null && message.hasOwnProperty("ptt"))
                if (typeof message.ptt !== "boolean")
                    return "ptt: boolean expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                if (!(message.fileEncSha256 && typeof message.fileEncSha256.length === "number" || $util.isString(message.fileEncSha256)))
                    return "fileEncSha256: buffer expected";
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (!$util.isInteger(message.mediaKeyTimestamp) && !(message.mediaKeyTimestamp && $util.isInteger(message.mediaKeyTimestamp.low) && $util.isInteger(message.mediaKeyTimestamp.high)))
                    return "mediaKeyTimestamp: integer|Long expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.streamingSidecar != null && message.hasOwnProperty("streamingSidecar"))
                if (!(message.streamingSidecar && typeof message.streamingSidecar.length === "number" || $util.isString(message.streamingSidecar)))
                    return "streamingSidecar: buffer expected";
            return null;
        };

        /**
         * Creates an AudioMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.AudioMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.AudioMessage} AudioMessage
         */
        AudioMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.AudioMessage)
                return object;
            var message = new $root.proto.AudioMessage();
            if (object.url != null)
                message.url = String(object.url);
            if (object.mimetype != null)
                message.mimetype = String(object.mimetype);
            if (object.fileSha256 != null)
                if (typeof object.fileSha256 === "string")
                    $util.base64.decode(object.fileSha256, message.fileSha256 = $util.newBuffer($util.base64.length(object.fileSha256)), 0);
                else if (object.fileSha256.length)
                    message.fileSha256 = object.fileSha256;
            if (object.fileLength != null)
                if ($util.Long)
                    (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = true;
                else if (typeof object.fileLength === "string")
                    message.fileLength = parseInt(object.fileLength, 10);
                else if (typeof object.fileLength === "number")
                    message.fileLength = object.fileLength;
                else if (typeof object.fileLength === "object")
                    message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber(true);
            if (object.seconds != null)
                message.seconds = object.seconds >>> 0;
            if (object.ptt != null)
                message.ptt = Boolean(object.ptt);
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length)
                    message.mediaKey = object.mediaKey;
            if (object.fileEncSha256 != null)
                if (typeof object.fileEncSha256 === "string")
                    $util.base64.decode(object.fileEncSha256, message.fileEncSha256 = $util.newBuffer($util.base64.length(object.fileEncSha256)), 0);
                else if (object.fileEncSha256.length)
                    message.fileEncSha256 = object.fileEncSha256;
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.mediaKeyTimestamp != null)
                if ($util.Long)
                    (message.mediaKeyTimestamp = $util.Long.fromValue(object.mediaKeyTimestamp)).unsigned = false;
                else if (typeof object.mediaKeyTimestamp === "string")
                    message.mediaKeyTimestamp = parseInt(object.mediaKeyTimestamp, 10);
                else if (typeof object.mediaKeyTimestamp === "number")
                    message.mediaKeyTimestamp = object.mediaKeyTimestamp;
                else if (typeof object.mediaKeyTimestamp === "object")
                    message.mediaKeyTimestamp = new $util.LongBits(object.mediaKeyTimestamp.low >>> 0, object.mediaKeyTimestamp.high >>> 0).toNumber();
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.AudioMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.streamingSidecar != null)
                if (typeof object.streamingSidecar === "string")
                    $util.base64.decode(object.streamingSidecar, message.streamingSidecar = $util.newBuffer($util.base64.length(object.streamingSidecar)), 0);
                else if (object.streamingSidecar.length)
                    message.streamingSidecar = object.streamingSidecar;
            return message;
        };

        /**
         * Creates a plain object from an AudioMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.AudioMessage
         * @static
         * @param {proto.AudioMessage} message AudioMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AudioMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.url = "";
                object.mimetype = "";
                if (options.bytes === String)
                    object.fileSha256 = "";
                else {
                    object.fileSha256 = [];
                    if (options.bytes !== Array)
                        object.fileSha256 = $util.newBuffer(object.fileSha256);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileLength = options.longs === String ? "0" : 0;
                object.seconds = 0;
                object.ptt = false;
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                if (options.bytes === String)
                    object.fileEncSha256 = "";
                else {
                    object.fileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSha256 = $util.newBuffer(object.fileEncSha256);
                }
                object.directPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mediaKeyTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mediaKeyTimestamp = options.longs === String ? "0" : 0;
                object.contextInfo = null;
                if (options.bytes === String)
                    object.streamingSidecar = "";
                else {
                    object.streamingSidecar = [];
                    if (options.bytes !== Array)
                        object.streamingSidecar = $util.newBuffer(object.streamingSidecar);
                }
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                object.mimetype = message.mimetype;
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                object.fileSha256 = options.bytes === String ? $util.base64.encode(message.fileSha256, 0, message.fileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSha256) : message.fileSha256;
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (typeof message.fileLength === "number")
                    object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
                else
                    object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber(true) : message.fileLength;
            if (message.seconds != null && message.hasOwnProperty("seconds"))
                object.seconds = message.seconds;
            if (message.ptt != null && message.hasOwnProperty("ptt"))
                object.ptt = message.ptt;
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                object.fileEncSha256 = options.bytes === String ? $util.base64.encode(message.fileEncSha256, 0, message.fileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSha256) : message.fileEncSha256;
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (typeof message.mediaKeyTimestamp === "number")
                    object.mediaKeyTimestamp = options.longs === String ? String(message.mediaKeyTimestamp) : message.mediaKeyTimestamp;
                else
                    object.mediaKeyTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.mediaKeyTimestamp) : options.longs === Number ? new $util.LongBits(message.mediaKeyTimestamp.low >>> 0, message.mediaKeyTimestamp.high >>> 0).toNumber() : message.mediaKeyTimestamp;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.streamingSidecar != null && message.hasOwnProperty("streamingSidecar"))
                object.streamingSidecar = options.bytes === String ? $util.base64.encode(message.streamingSidecar, 0, message.streamingSidecar.length) : options.bytes === Array ? Array.prototype.slice.call(message.streamingSidecar) : message.streamingSidecar;
            return object;
        };

        /**
         * Converts this AudioMessage to JSON.
         * @function toJSON
         * @memberof proto.AudioMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AudioMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AudioMessage;
    })();

    proto.VideoMessage = (function() {

        /**
         * Properties of a VideoMessage.
         * @memberof proto
         * @interface IVideoMessage
         * @property {string|null} [url] VideoMessage url
         * @property {string|null} [mimetype] VideoMessage mimetype
         * @property {Uint8Array|null} [fileSha256] VideoMessage fileSha256
         * @property {number|Long|null} [fileLength] VideoMessage fileLength
         * @property {number|null} [seconds] VideoMessage seconds
         * @property {Uint8Array|null} [mediaKey] VideoMessage mediaKey
         * @property {string|null} [caption] VideoMessage caption
         * @property {boolean|null} [gifPlayback] VideoMessage gifPlayback
         * @property {number|null} [height] VideoMessage height
         * @property {number|null} [width] VideoMessage width
         * @property {Uint8Array|null} [fileEncSha256] VideoMessage fileEncSha256
         * @property {Array.<proto.IInteractiveAnnotation>|null} [interactiveAnnotations] VideoMessage interactiveAnnotations
         * @property {string|null} [directPath] VideoMessage directPath
         * @property {number|Long|null} [mediaKeyTimestamp] VideoMessage mediaKeyTimestamp
         * @property {Uint8Array|null} [jpegThumbnail] VideoMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] VideoMessage contextInfo
         * @property {Uint8Array|null} [streamingSidecar] VideoMessage streamingSidecar
         * @property {proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION|null} [gifAttribution] VideoMessage gifAttribution
         */

        /**
         * Constructs a new VideoMessage.
         * @memberof proto
         * @classdesc Represents a VideoMessage.
         * @implements IVideoMessage
         * @constructor
         * @param {proto.IVideoMessage=} [properties] Properties to set
         */
        function VideoMessage(properties) {
            this.interactiveAnnotations = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VideoMessage url.
         * @member {string} url
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.url = "";

        /**
         * VideoMessage mimetype.
         * @member {string} mimetype
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.mimetype = "";

        /**
         * VideoMessage fileSha256.
         * @member {Uint8Array} fileSha256
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.fileSha256 = $util.newBuffer([]);

        /**
         * VideoMessage fileLength.
         * @member {number|Long} fileLength
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * VideoMessage seconds.
         * @member {number} seconds
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.seconds = 0;

        /**
         * VideoMessage mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.mediaKey = $util.newBuffer([]);

        /**
         * VideoMessage caption.
         * @member {string} caption
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.caption = "";

        /**
         * VideoMessage gifPlayback.
         * @member {boolean} gifPlayback
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.gifPlayback = false;

        /**
         * VideoMessage height.
         * @member {number} height
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.height = 0;

        /**
         * VideoMessage width.
         * @member {number} width
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.width = 0;

        /**
         * VideoMessage fileEncSha256.
         * @member {Uint8Array} fileEncSha256
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.fileEncSha256 = $util.newBuffer([]);

        /**
         * VideoMessage interactiveAnnotations.
         * @member {Array.<proto.IInteractiveAnnotation>} interactiveAnnotations
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.interactiveAnnotations = $util.emptyArray;

        /**
         * VideoMessage directPath.
         * @member {string} directPath
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.directPath = "";

        /**
         * VideoMessage mediaKeyTimestamp.
         * @member {number|Long} mediaKeyTimestamp
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.mediaKeyTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * VideoMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * VideoMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.contextInfo = null;

        /**
         * VideoMessage streamingSidecar.
         * @member {Uint8Array} streamingSidecar
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.streamingSidecar = $util.newBuffer([]);

        /**
         * VideoMessage gifAttribution.
         * @member {proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION} gifAttribution
         * @memberof proto.VideoMessage
         * @instance
         */
        VideoMessage.prototype.gifAttribution = 0;

        /**
         * Creates a new VideoMessage instance using the specified properties.
         * @function create
         * @memberof proto.VideoMessage
         * @static
         * @param {proto.IVideoMessage=} [properties] Properties to set
         * @returns {proto.VideoMessage} VideoMessage instance
         */
        VideoMessage.create = function create(properties) {
            return new VideoMessage(properties);
        };

        /**
         * Encodes the specified VideoMessage message. Does not implicitly {@link proto.VideoMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.VideoMessage
         * @static
         * @param {proto.IVideoMessage} message VideoMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VideoMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimetype);
            if (message.fileSha256 != null && Object.hasOwnProperty.call(message, "fileSha256"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fileSha256);
            if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.fileLength);
            if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.seconds);
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.mediaKey);
            if (message.caption != null && Object.hasOwnProperty.call(message, "caption"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.caption);
            if (message.gifPlayback != null && Object.hasOwnProperty.call(message, "gifPlayback"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.gifPlayback);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.height);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.width);
            if (message.fileEncSha256 != null && Object.hasOwnProperty.call(message, "fileEncSha256"))
                writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.fileEncSha256);
            if (message.interactiveAnnotations != null && message.interactiveAnnotations.length)
                for (var i = 0; i < message.interactiveAnnotations.length; ++i)
                    $root.proto.InteractiveAnnotation.encode(message.interactiveAnnotations[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.directPath);
            if (message.mediaKeyTimestamp != null && Object.hasOwnProperty.call(message, "mediaKeyTimestamp"))
                writer.uint32(/* id 14, wireType 0 =*/112).int64(message.mediaKeyTimestamp);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.streamingSidecar != null && Object.hasOwnProperty.call(message, "streamingSidecar"))
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.streamingSidecar);
            if (message.gifAttribution != null && Object.hasOwnProperty.call(message, "gifAttribution"))
                writer.uint32(/* id 19, wireType 0 =*/152).int32(message.gifAttribution);
            return writer;
        };

        /**
         * Encodes the specified VideoMessage message, length delimited. Does not implicitly {@link proto.VideoMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.VideoMessage
         * @static
         * @param {proto.IVideoMessage} message VideoMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VideoMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VideoMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.VideoMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.VideoMessage} VideoMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VideoMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.VideoMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.mimetype = reader.string();
                    break;
                case 3:
                    message.fileSha256 = reader.bytes();
                    break;
                case 4:
                    message.fileLength = reader.uint64();
                    break;
                case 5:
                    message.seconds = reader.uint32();
                    break;
                case 6:
                    message.mediaKey = reader.bytes();
                    break;
                case 7:
                    message.caption = reader.string();
                    break;
                case 8:
                    message.gifPlayback = reader.bool();
                    break;
                case 9:
                    message.height = reader.uint32();
                    break;
                case 10:
                    message.width = reader.uint32();
                    break;
                case 11:
                    message.fileEncSha256 = reader.bytes();
                    break;
                case 12:
                    if (!(message.interactiveAnnotations && message.interactiveAnnotations.length))
                        message.interactiveAnnotations = [];
                    message.interactiveAnnotations.push($root.proto.InteractiveAnnotation.decode(reader, reader.uint32()));
                    break;
                case 13:
                    message.directPath = reader.string();
                    break;
                case 14:
                    message.mediaKeyTimestamp = reader.int64();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.streamingSidecar = reader.bytes();
                    break;
                case 19:
                    message.gifAttribution = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VideoMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.VideoMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.VideoMessage} VideoMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VideoMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VideoMessage message.
         * @function verify
         * @memberof proto.VideoMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VideoMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                if (!$util.isString(message.mimetype))
                    return "mimetype: string expected";
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                if (!(message.fileSha256 && typeof message.fileSha256.length === "number" || $util.isString(message.fileSha256)))
                    return "fileSha256: buffer expected";
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
                    return "fileLength: integer|Long expected";
            if (message.seconds != null && message.hasOwnProperty("seconds"))
                if (!$util.isInteger(message.seconds))
                    return "seconds: integer expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.caption != null && message.hasOwnProperty("caption"))
                if (!$util.isString(message.caption))
                    return "caption: string expected";
            if (message.gifPlayback != null && message.hasOwnProperty("gifPlayback"))
                if (typeof message.gifPlayback !== "boolean")
                    return "gifPlayback: boolean expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                if (!(message.fileEncSha256 && typeof message.fileEncSha256.length === "number" || $util.isString(message.fileEncSha256)))
                    return "fileEncSha256: buffer expected";
            if (message.interactiveAnnotations != null && message.hasOwnProperty("interactiveAnnotations")) {
                if (!Array.isArray(message.interactiveAnnotations))
                    return "interactiveAnnotations: array expected";
                for (var i = 0; i < message.interactiveAnnotations.length; ++i) {
                    var error = $root.proto.InteractiveAnnotation.verify(message.interactiveAnnotations[i]);
                    if (error)
                        return "interactiveAnnotations." + error;
                }
            }
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (!$util.isInteger(message.mediaKeyTimestamp) && !(message.mediaKeyTimestamp && $util.isInteger(message.mediaKeyTimestamp.low) && $util.isInteger(message.mediaKeyTimestamp.high)))
                    return "mediaKeyTimestamp: integer|Long expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.streamingSidecar != null && message.hasOwnProperty("streamingSidecar"))
                if (!(message.streamingSidecar && typeof message.streamingSidecar.length === "number" || $util.isString(message.streamingSidecar)))
                    return "streamingSidecar: buffer expected";
            if (message.gifAttribution != null && message.hasOwnProperty("gifAttribution"))
                switch (message.gifAttribution) {
                default:
                    return "gifAttribution: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a VideoMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.VideoMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.VideoMessage} VideoMessage
         */
        VideoMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.VideoMessage)
                return object;
            var message = new $root.proto.VideoMessage();
            if (object.url != null)
                message.url = String(object.url);
            if (object.mimetype != null)
                message.mimetype = String(object.mimetype);
            if (object.fileSha256 != null)
                if (typeof object.fileSha256 === "string")
                    $util.base64.decode(object.fileSha256, message.fileSha256 = $util.newBuffer($util.base64.length(object.fileSha256)), 0);
                else if (object.fileSha256.length)
                    message.fileSha256 = object.fileSha256;
            if (object.fileLength != null)
                if ($util.Long)
                    (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = true;
                else if (typeof object.fileLength === "string")
                    message.fileLength = parseInt(object.fileLength, 10);
                else if (typeof object.fileLength === "number")
                    message.fileLength = object.fileLength;
                else if (typeof object.fileLength === "object")
                    message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber(true);
            if (object.seconds != null)
                message.seconds = object.seconds >>> 0;
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length)
                    message.mediaKey = object.mediaKey;
            if (object.caption != null)
                message.caption = String(object.caption);
            if (object.gifPlayback != null)
                message.gifPlayback = Boolean(object.gifPlayback);
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.fileEncSha256 != null)
                if (typeof object.fileEncSha256 === "string")
                    $util.base64.decode(object.fileEncSha256, message.fileEncSha256 = $util.newBuffer($util.base64.length(object.fileEncSha256)), 0);
                else if (object.fileEncSha256.length)
                    message.fileEncSha256 = object.fileEncSha256;
            if (object.interactiveAnnotations) {
                if (!Array.isArray(object.interactiveAnnotations))
                    throw TypeError(".proto.VideoMessage.interactiveAnnotations: array expected");
                message.interactiveAnnotations = [];
                for (var i = 0; i < object.interactiveAnnotations.length; ++i) {
                    if (typeof object.interactiveAnnotations[i] !== "object")
                        throw TypeError(".proto.VideoMessage.interactiveAnnotations: object expected");
                    message.interactiveAnnotations[i] = $root.proto.InteractiveAnnotation.fromObject(object.interactiveAnnotations[i]);
                }
            }
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.mediaKeyTimestamp != null)
                if ($util.Long)
                    (message.mediaKeyTimestamp = $util.Long.fromValue(object.mediaKeyTimestamp)).unsigned = false;
                else if (typeof object.mediaKeyTimestamp === "string")
                    message.mediaKeyTimestamp = parseInt(object.mediaKeyTimestamp, 10);
                else if (typeof object.mediaKeyTimestamp === "number")
                    message.mediaKeyTimestamp = object.mediaKeyTimestamp;
                else if (typeof object.mediaKeyTimestamp === "object")
                    message.mediaKeyTimestamp = new $util.LongBits(object.mediaKeyTimestamp.low >>> 0, object.mediaKeyTimestamp.high >>> 0).toNumber();
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.VideoMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.streamingSidecar != null)
                if (typeof object.streamingSidecar === "string")
                    $util.base64.decode(object.streamingSidecar, message.streamingSidecar = $util.newBuffer($util.base64.length(object.streamingSidecar)), 0);
                else if (object.streamingSidecar.length)
                    message.streamingSidecar = object.streamingSidecar;
            switch (object.gifAttribution) {
            case "NONE":
            case 0:
                message.gifAttribution = 0;
                break;
            case "GIPHY":
            case 1:
                message.gifAttribution = 1;
                break;
            case "TENOR":
            case 2:
                message.gifAttribution = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a VideoMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.VideoMessage
         * @static
         * @param {proto.VideoMessage} message VideoMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VideoMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.interactiveAnnotations = [];
            if (options.defaults) {
                object.url = "";
                object.mimetype = "";
                if (options.bytes === String)
                    object.fileSha256 = "";
                else {
                    object.fileSha256 = [];
                    if (options.bytes !== Array)
                        object.fileSha256 = $util.newBuffer(object.fileSha256);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileLength = options.longs === String ? "0" : 0;
                object.seconds = 0;
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                object.caption = "";
                object.gifPlayback = false;
                object.height = 0;
                object.width = 0;
                if (options.bytes === String)
                    object.fileEncSha256 = "";
                else {
                    object.fileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSha256 = $util.newBuffer(object.fileEncSha256);
                }
                object.directPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mediaKeyTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mediaKeyTimestamp = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
                if (options.bytes === String)
                    object.streamingSidecar = "";
                else {
                    object.streamingSidecar = [];
                    if (options.bytes !== Array)
                        object.streamingSidecar = $util.newBuffer(object.streamingSidecar);
                }
                object.gifAttribution = options.enums === String ? "NONE" : 0;
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                object.mimetype = message.mimetype;
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                object.fileSha256 = options.bytes === String ? $util.base64.encode(message.fileSha256, 0, message.fileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSha256) : message.fileSha256;
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (typeof message.fileLength === "number")
                    object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
                else
                    object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber(true) : message.fileLength;
            if (message.seconds != null && message.hasOwnProperty("seconds"))
                object.seconds = message.seconds;
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.caption != null && message.hasOwnProperty("caption"))
                object.caption = message.caption;
            if (message.gifPlayback != null && message.hasOwnProperty("gifPlayback"))
                object.gifPlayback = message.gifPlayback;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                object.fileEncSha256 = options.bytes === String ? $util.base64.encode(message.fileEncSha256, 0, message.fileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSha256) : message.fileEncSha256;
            if (message.interactiveAnnotations && message.interactiveAnnotations.length) {
                object.interactiveAnnotations = [];
                for (var j = 0; j < message.interactiveAnnotations.length; ++j)
                    object.interactiveAnnotations[j] = $root.proto.InteractiveAnnotation.toObject(message.interactiveAnnotations[j], options);
            }
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (typeof message.mediaKeyTimestamp === "number")
                    object.mediaKeyTimestamp = options.longs === String ? String(message.mediaKeyTimestamp) : message.mediaKeyTimestamp;
                else
                    object.mediaKeyTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.mediaKeyTimestamp) : options.longs === Number ? new $util.LongBits(message.mediaKeyTimestamp.low >>> 0, message.mediaKeyTimestamp.high >>> 0).toNumber() : message.mediaKeyTimestamp;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.streamingSidecar != null && message.hasOwnProperty("streamingSidecar"))
                object.streamingSidecar = options.bytes === String ? $util.base64.encode(message.streamingSidecar, 0, message.streamingSidecar.length) : options.bytes === Array ? Array.prototype.slice.call(message.streamingSidecar) : message.streamingSidecar;
            if (message.gifAttribution != null && message.hasOwnProperty("gifAttribution"))
                object.gifAttribution = options.enums === String ? $root.proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION[message.gifAttribution] : message.gifAttribution;
            return object;
        };

        /**
         * Converts this VideoMessage to JSON.
         * @function toJSON
         * @memberof proto.VideoMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VideoMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * VIDEO_MESSAGE_ATTRIBUTION enum.
         * @name proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} GIPHY=1 GIPHY value
         * @property {number} TENOR=2 TENOR value
         */
        VideoMessage.VIDEO_MESSAGE_ATTRIBUTION = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "GIPHY"] = 1;
            values[valuesById[2] = "TENOR"] = 2;
            return values;
        })();

        return VideoMessage;
    })();

    proto.Call = (function() {

        /**
         * Properties of a Call.
         * @memberof proto
         * @interface ICall
         * @property {Uint8Array|null} [callKey] Call callKey
         */

        /**
         * Constructs a new Call.
         * @memberof proto
         * @classdesc Represents a Call.
         * @implements ICall
         * @constructor
         * @param {proto.ICall=} [properties] Properties to set
         */
        function Call(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Call callKey.
         * @member {Uint8Array} callKey
         * @memberof proto.Call
         * @instance
         */
        Call.prototype.callKey = $util.newBuffer([]);

        /**
         * Creates a new Call instance using the specified properties.
         * @function create
         * @memberof proto.Call
         * @static
         * @param {proto.ICall=} [properties] Properties to set
         * @returns {proto.Call} Call instance
         */
        Call.create = function create(properties) {
            return new Call(properties);
        };

        /**
         * Encodes the specified Call message. Does not implicitly {@link proto.Call.verify|verify} messages.
         * @function encode
         * @memberof proto.Call
         * @static
         * @param {proto.ICall} message Call message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Call.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callKey != null && Object.hasOwnProperty.call(message, "callKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.callKey);
            return writer;
        };

        /**
         * Encodes the specified Call message, length delimited. Does not implicitly {@link proto.Call.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Call
         * @static
         * @param {proto.ICall} message Call message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Call.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Call message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Call
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Call} Call
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Call.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Call();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.callKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Call message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Call
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Call} Call
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Call.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Call message.
         * @function verify
         * @memberof proto.Call
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Call.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callKey != null && message.hasOwnProperty("callKey"))
                if (!(message.callKey && typeof message.callKey.length === "number" || $util.isString(message.callKey)))
                    return "callKey: buffer expected";
            return null;
        };

        /**
         * Creates a Call message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Call
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Call} Call
         */
        Call.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Call)
                return object;
            var message = new $root.proto.Call();
            if (object.callKey != null)
                if (typeof object.callKey === "string")
                    $util.base64.decode(object.callKey, message.callKey = $util.newBuffer($util.base64.length(object.callKey)), 0);
                else if (object.callKey.length)
                    message.callKey = object.callKey;
            return message;
        };

        /**
         * Creates a plain object from a Call message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Call
         * @static
         * @param {proto.Call} message Call
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Call.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.callKey = "";
                else {
                    object.callKey = [];
                    if (options.bytes !== Array)
                        object.callKey = $util.newBuffer(object.callKey);
                }
            if (message.callKey != null && message.hasOwnProperty("callKey"))
                object.callKey = options.bytes === String ? $util.base64.encode(message.callKey, 0, message.callKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.callKey) : message.callKey;
            return object;
        };

        /**
         * Converts this Call to JSON.
         * @function toJSON
         * @memberof proto.Call
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Call.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Call;
    })();

    proto.Chat = (function() {

        /**
         * Properties of a Chat.
         * @memberof proto
         * @interface IChat
         * @property {string|null} [displayName] Chat displayName
         * @property {string|null} [id] Chat id
         */

        /**
         * Constructs a new Chat.
         * @memberof proto
         * @classdesc Represents a Chat.
         * @implements IChat
         * @constructor
         * @param {proto.IChat=} [properties] Properties to set
         */
        function Chat(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Chat displayName.
         * @member {string} displayName
         * @memberof proto.Chat
         * @instance
         */
        Chat.prototype.displayName = "";

        /**
         * Chat id.
         * @member {string} id
         * @memberof proto.Chat
         * @instance
         */
        Chat.prototype.id = "";

        /**
         * Creates a new Chat instance using the specified properties.
         * @function create
         * @memberof proto.Chat
         * @static
         * @param {proto.IChat=} [properties] Properties to set
         * @returns {proto.Chat} Chat instance
         */
        Chat.create = function create(properties) {
            return new Chat(properties);
        };

        /**
         * Encodes the specified Chat message. Does not implicitly {@link proto.Chat.verify|verify} messages.
         * @function encode
         * @memberof proto.Chat
         * @static
         * @param {proto.IChat} message Chat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Chat.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayName);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified Chat message, length delimited. Does not implicitly {@link proto.Chat.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Chat
         * @static
         * @param {proto.IChat} message Chat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Chat.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Chat message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Chat
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Chat} Chat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Chat.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Chat();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayName = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Chat message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Chat
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Chat} Chat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Chat.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Chat message.
         * @function verify
         * @memberof proto.Chat
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Chat.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a Chat message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Chat
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Chat} Chat
         */
        Chat.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Chat)
                return object;
            var message = new $root.proto.Chat();
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a Chat message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Chat
         * @static
         * @param {proto.Chat} message Chat
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Chat.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.displayName = "";
                object.id = "";
            }
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this Chat to JSON.
         * @function toJSON
         * @memberof proto.Chat
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Chat.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Chat;
    })();

    proto.ProtocolMessage = (function() {

        /**
         * Properties of a ProtocolMessage.
         * @memberof proto
         * @interface IProtocolMessage
         * @property {proto.IMessageKey|null} [key] ProtocolMessage key
         * @property {proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE|null} [type] ProtocolMessage type
         * @property {number|null} [ephemeralExpiration] ProtocolMessage ephemeralExpiration
         */

        /**
         * Constructs a new ProtocolMessage.
         * @memberof proto
         * @classdesc Represents a ProtocolMessage.
         * @implements IProtocolMessage
         * @constructor
         * @param {proto.IProtocolMessage=} [properties] Properties to set
         */
        function ProtocolMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProtocolMessage key.
         * @member {proto.IMessageKey|null|undefined} key
         * @memberof proto.ProtocolMessage
         * @instance
         */
        ProtocolMessage.prototype.key = null;

        /**
         * ProtocolMessage type.
         * @member {proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE} type
         * @memberof proto.ProtocolMessage
         * @instance
         */
        ProtocolMessage.prototype.type = 0;

        /**
         * ProtocolMessage ephemeralExpiration.
         * @member {number} ephemeralExpiration
         * @memberof proto.ProtocolMessage
         * @instance
         */
        ProtocolMessage.prototype.ephemeralExpiration = 0;

        /**
         * Creates a new ProtocolMessage instance using the specified properties.
         * @function create
         * @memberof proto.ProtocolMessage
         * @static
         * @param {proto.IProtocolMessage=} [properties] Properties to set
         * @returns {proto.ProtocolMessage} ProtocolMessage instance
         */
        ProtocolMessage.create = function create(properties) {
            return new ProtocolMessage(properties);
        };

        /**
         * Encodes the specified ProtocolMessage message. Does not implicitly {@link proto.ProtocolMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ProtocolMessage
         * @static
         * @param {proto.IProtocolMessage} message ProtocolMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtocolMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                $root.proto.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.ephemeralExpiration != null && Object.hasOwnProperty.call(message, "ephemeralExpiration"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.ephemeralExpiration);
            return writer;
        };

        /**
         * Encodes the specified ProtocolMessage message, length delimited. Does not implicitly {@link proto.ProtocolMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ProtocolMessage
         * @static
         * @param {proto.IProtocolMessage} message ProtocolMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtocolMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProtocolMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ProtocolMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ProtocolMessage} ProtocolMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtocolMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ProtocolMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 4:
                    message.ephemeralExpiration = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProtocolMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ProtocolMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ProtocolMessage} ProtocolMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtocolMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProtocolMessage message.
         * @function verify
         * @memberof proto.ProtocolMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProtocolMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key")) {
                var error = $root.proto.MessageKey.verify(message.key);
                if (error)
                    return "key." + error;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 3:
                    break;
                }
            if (message.ephemeralExpiration != null && message.hasOwnProperty("ephemeralExpiration"))
                if (!$util.isInteger(message.ephemeralExpiration))
                    return "ephemeralExpiration: integer expected";
            return null;
        };

        /**
         * Creates a ProtocolMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ProtocolMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ProtocolMessage} ProtocolMessage
         */
        ProtocolMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ProtocolMessage)
                return object;
            var message = new $root.proto.ProtocolMessage();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".proto.ProtocolMessage.key: object expected");
                message.key = $root.proto.MessageKey.fromObject(object.key);
            }
            switch (object.type) {
            case "REVOKE":
            case 0:
                message.type = 0;
                break;
            case "EPHEMERAL_SETTING":
            case 3:
                message.type = 3;
                break;
            }
            if (object.ephemeralExpiration != null)
                message.ephemeralExpiration = object.ephemeralExpiration >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ProtocolMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ProtocolMessage
         * @static
         * @param {proto.ProtocolMessage} message ProtocolMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProtocolMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = null;
                object.type = options.enums === String ? "REVOKE" : 0;
                object.ephemeralExpiration = 0;
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.proto.MessageKey.toObject(message.key, options);
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE[message.type] : message.type;
            if (message.ephemeralExpiration != null && message.hasOwnProperty("ephemeralExpiration"))
                object.ephemeralExpiration = message.ephemeralExpiration;
            return object;
        };

        /**
         * Converts this ProtocolMessage to JSON.
         * @function toJSON
         * @memberof proto.ProtocolMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProtocolMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * PROTOCOL_MESSAGE_TYPE enum.
         * @name proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE
         * @enum {number}
         * @property {number} REVOKE=0 REVOKE value
         * @property {number} EPHEMERAL_SETTING=3 EPHEMERAL_SETTING value
         */
        ProtocolMessage.PROTOCOL_MESSAGE_TYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "REVOKE"] = 0;
            values[valuesById[3] = "EPHEMERAL_SETTING"] = 3;
            return values;
        })();

        return ProtocolMessage;
    })();

    proto.ContactsArrayMessage = (function() {

        /**
         * Properties of a ContactsArrayMessage.
         * @memberof proto
         * @interface IContactsArrayMessage
         * @property {string|null} [displayName] ContactsArrayMessage displayName
         * @property {Array.<proto.IContactMessage>|null} [contacts] ContactsArrayMessage contacts
         * @property {proto.IContextInfo|null} [contextInfo] ContactsArrayMessage contextInfo
         */

        /**
         * Constructs a new ContactsArrayMessage.
         * @memberof proto
         * @classdesc Represents a ContactsArrayMessage.
         * @implements IContactsArrayMessage
         * @constructor
         * @param {proto.IContactsArrayMessage=} [properties] Properties to set
         */
        function ContactsArrayMessage(properties) {
            this.contacts = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContactsArrayMessage displayName.
         * @member {string} displayName
         * @memberof proto.ContactsArrayMessage
         * @instance
         */
        ContactsArrayMessage.prototype.displayName = "";

        /**
         * ContactsArrayMessage contacts.
         * @member {Array.<proto.IContactMessage>} contacts
         * @memberof proto.ContactsArrayMessage
         * @instance
         */
        ContactsArrayMessage.prototype.contacts = $util.emptyArray;

        /**
         * ContactsArrayMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.ContactsArrayMessage
         * @instance
         */
        ContactsArrayMessage.prototype.contextInfo = null;

        /**
         * Creates a new ContactsArrayMessage instance using the specified properties.
         * @function create
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {proto.IContactsArrayMessage=} [properties] Properties to set
         * @returns {proto.ContactsArrayMessage} ContactsArrayMessage instance
         */
        ContactsArrayMessage.create = function create(properties) {
            return new ContactsArrayMessage(properties);
        };

        /**
         * Encodes the specified ContactsArrayMessage message. Does not implicitly {@link proto.ContactsArrayMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {proto.IContactsArrayMessage} message ContactsArrayMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactsArrayMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayName);
            if (message.contacts != null && message.contacts.length)
                for (var i = 0; i < message.contacts.length; ++i)
                    $root.proto.ContactMessage.encode(message.contacts[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContactsArrayMessage message, length delimited. Does not implicitly {@link proto.ContactsArrayMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {proto.IContactsArrayMessage} message ContactsArrayMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactsArrayMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContactsArrayMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ContactsArrayMessage} ContactsArrayMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactsArrayMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ContactsArrayMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.displayName = reader.string();
                    break;
                case 2:
                    if (!(message.contacts && message.contacts.length))
                        message.contacts = [];
                    message.contacts.push($root.proto.ContactMessage.decode(reader, reader.uint32()));
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContactsArrayMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ContactsArrayMessage} ContactsArrayMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactsArrayMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContactsArrayMessage message.
         * @function verify
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContactsArrayMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                if (!Array.isArray(message.contacts))
                    return "contacts: array expected";
                for (var i = 0; i < message.contacts.length; ++i) {
                    var error = $root.proto.ContactMessage.verify(message.contacts[i]);
                    if (error)
                        return "contacts." + error;
                }
            }
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a ContactsArrayMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ContactsArrayMessage} ContactsArrayMessage
         */
        ContactsArrayMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ContactsArrayMessage)
                return object;
            var message = new $root.proto.ContactsArrayMessage();
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.contacts) {
                if (!Array.isArray(object.contacts))
                    throw TypeError(".proto.ContactsArrayMessage.contacts: array expected");
                message.contacts = [];
                for (var i = 0; i < object.contacts.length; ++i) {
                    if (typeof object.contacts[i] !== "object")
                        throw TypeError(".proto.ContactsArrayMessage.contacts: object expected");
                    message.contacts[i] = $root.proto.ContactMessage.fromObject(object.contacts[i]);
                }
            }
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.ContactsArrayMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContactsArrayMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ContactsArrayMessage
         * @static
         * @param {proto.ContactsArrayMessage} message ContactsArrayMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContactsArrayMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.contacts = [];
            if (options.defaults) {
                object.displayName = "";
                object.contextInfo = null;
            }
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.contacts && message.contacts.length) {
                object.contacts = [];
                for (var j = 0; j < message.contacts.length; ++j)
                    object.contacts[j] = $root.proto.ContactMessage.toObject(message.contacts[j], options);
            }
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this ContactsArrayMessage to JSON.
         * @function toJSON
         * @memberof proto.ContactsArrayMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContactsArrayMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContactsArrayMessage;
    })();

    proto.HSMCurrency = (function() {

        /**
         * Properties of a HSMCurrency.
         * @memberof proto
         * @interface IHSMCurrency
         * @property {string|null} [currencyCode] HSMCurrency currencyCode
         * @property {number|Long|null} [amount1000] HSMCurrency amount1000
         */

        /**
         * Constructs a new HSMCurrency.
         * @memberof proto
         * @classdesc Represents a HSMCurrency.
         * @implements IHSMCurrency
         * @constructor
         * @param {proto.IHSMCurrency=} [properties] Properties to set
         */
        function HSMCurrency(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HSMCurrency currencyCode.
         * @member {string} currencyCode
         * @memberof proto.HSMCurrency
         * @instance
         */
        HSMCurrency.prototype.currencyCode = "";

        /**
         * HSMCurrency amount1000.
         * @member {number|Long} amount1000
         * @memberof proto.HSMCurrency
         * @instance
         */
        HSMCurrency.prototype.amount1000 = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HSMCurrency instance using the specified properties.
         * @function create
         * @memberof proto.HSMCurrency
         * @static
         * @param {proto.IHSMCurrency=} [properties] Properties to set
         * @returns {proto.HSMCurrency} HSMCurrency instance
         */
        HSMCurrency.create = function create(properties) {
            return new HSMCurrency(properties);
        };

        /**
         * Encodes the specified HSMCurrency message. Does not implicitly {@link proto.HSMCurrency.verify|verify} messages.
         * @function encode
         * @memberof proto.HSMCurrency
         * @static
         * @param {proto.IHSMCurrency} message HSMCurrency message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMCurrency.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.currencyCode != null && Object.hasOwnProperty.call(message, "currencyCode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.currencyCode);
            if (message.amount1000 != null && Object.hasOwnProperty.call(message, "amount1000"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount1000);
            return writer;
        };

        /**
         * Encodes the specified HSMCurrency message, length delimited. Does not implicitly {@link proto.HSMCurrency.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HSMCurrency
         * @static
         * @param {proto.IHSMCurrency} message HSMCurrency message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMCurrency.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HSMCurrency message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HSMCurrency
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HSMCurrency} HSMCurrency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMCurrency.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HSMCurrency();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.currencyCode = reader.string();
                    break;
                case 2:
                    message.amount1000 = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HSMCurrency message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HSMCurrency
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HSMCurrency} HSMCurrency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMCurrency.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HSMCurrency message.
         * @function verify
         * @memberof proto.HSMCurrency
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HSMCurrency.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.currencyCode != null && message.hasOwnProperty("currencyCode"))
                if (!$util.isString(message.currencyCode))
                    return "currencyCode: string expected";
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (!$util.isInteger(message.amount1000) && !(message.amount1000 && $util.isInteger(message.amount1000.low) && $util.isInteger(message.amount1000.high)))
                    return "amount1000: integer|Long expected";
            return null;
        };

        /**
         * Creates a HSMCurrency message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HSMCurrency
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HSMCurrency} HSMCurrency
         */
        HSMCurrency.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HSMCurrency)
                return object;
            var message = new $root.proto.HSMCurrency();
            if (object.currencyCode != null)
                message.currencyCode = String(object.currencyCode);
            if (object.amount1000 != null)
                if ($util.Long)
                    (message.amount1000 = $util.Long.fromValue(object.amount1000)).unsigned = false;
                else if (typeof object.amount1000 === "string")
                    message.amount1000 = parseInt(object.amount1000, 10);
                else if (typeof object.amount1000 === "number")
                    message.amount1000 = object.amount1000;
                else if (typeof object.amount1000 === "object")
                    message.amount1000 = new $util.LongBits(object.amount1000.low >>> 0, object.amount1000.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HSMCurrency message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HSMCurrency
         * @static
         * @param {proto.HSMCurrency} message HSMCurrency
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HSMCurrency.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.currencyCode = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount1000 = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount1000 = options.longs === String ? "0" : 0;
            }
            if (message.currencyCode != null && message.hasOwnProperty("currencyCode"))
                object.currencyCode = message.currencyCode;
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (typeof message.amount1000 === "number")
                    object.amount1000 = options.longs === String ? String(message.amount1000) : message.amount1000;
                else
                    object.amount1000 = options.longs === String ? $util.Long.prototype.toString.call(message.amount1000) : options.longs === Number ? new $util.LongBits(message.amount1000.low >>> 0, message.amount1000.high >>> 0).toNumber() : message.amount1000;
            return object;
        };

        /**
         * Converts this HSMCurrency to JSON.
         * @function toJSON
         * @memberof proto.HSMCurrency
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HSMCurrency.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HSMCurrency;
    })();

    proto.HSMDateTimeComponent = (function() {

        /**
         * Properties of a HSMDateTimeComponent.
         * @memberof proto
         * @interface IHSMDateTimeComponent
         * @property {proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE|null} [dayOfWeek] HSMDateTimeComponent dayOfWeek
         * @property {number|null} [year] HSMDateTimeComponent year
         * @property {number|null} [month] HSMDateTimeComponent month
         * @property {number|null} [dayOfMonth] HSMDateTimeComponent dayOfMonth
         * @property {number|null} [hour] HSMDateTimeComponent hour
         * @property {number|null} [minute] HSMDateTimeComponent minute
         * @property {proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE|null} [calendar] HSMDateTimeComponent calendar
         */

        /**
         * Constructs a new HSMDateTimeComponent.
         * @memberof proto
         * @classdesc Represents a HSMDateTimeComponent.
         * @implements IHSMDateTimeComponent
         * @constructor
         * @param {proto.IHSMDateTimeComponent=} [properties] Properties to set
         */
        function HSMDateTimeComponent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HSMDateTimeComponent dayOfWeek.
         * @member {proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE} dayOfWeek
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.dayOfWeek = 1;

        /**
         * HSMDateTimeComponent year.
         * @member {number} year
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.year = 0;

        /**
         * HSMDateTimeComponent month.
         * @member {number} month
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.month = 0;

        /**
         * HSMDateTimeComponent dayOfMonth.
         * @member {number} dayOfMonth
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.dayOfMonth = 0;

        /**
         * HSMDateTimeComponent hour.
         * @member {number} hour
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.hour = 0;

        /**
         * HSMDateTimeComponent minute.
         * @member {number} minute
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.minute = 0;

        /**
         * HSMDateTimeComponent calendar.
         * @member {proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE} calendar
         * @memberof proto.HSMDateTimeComponent
         * @instance
         */
        HSMDateTimeComponent.prototype.calendar = 1;

        /**
         * Creates a new HSMDateTimeComponent instance using the specified properties.
         * @function create
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {proto.IHSMDateTimeComponent=} [properties] Properties to set
         * @returns {proto.HSMDateTimeComponent} HSMDateTimeComponent instance
         */
        HSMDateTimeComponent.create = function create(properties) {
            return new HSMDateTimeComponent(properties);
        };

        /**
         * Encodes the specified HSMDateTimeComponent message. Does not implicitly {@link proto.HSMDateTimeComponent.verify|verify} messages.
         * @function encode
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {proto.IHSMDateTimeComponent} message HSMDateTimeComponent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTimeComponent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dayOfWeek != null && Object.hasOwnProperty.call(message, "dayOfWeek"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.dayOfWeek);
            if (message.year != null && Object.hasOwnProperty.call(message, "year"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.year);
            if (message.month != null && Object.hasOwnProperty.call(message, "month"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.month);
            if (message.dayOfMonth != null && Object.hasOwnProperty.call(message, "dayOfMonth"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.dayOfMonth);
            if (message.hour != null && Object.hasOwnProperty.call(message, "hour"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.hour);
            if (message.minute != null && Object.hasOwnProperty.call(message, "minute"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.minute);
            if (message.calendar != null && Object.hasOwnProperty.call(message, "calendar"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.calendar);
            return writer;
        };

        /**
         * Encodes the specified HSMDateTimeComponent message, length delimited. Does not implicitly {@link proto.HSMDateTimeComponent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {proto.IHSMDateTimeComponent} message HSMDateTimeComponent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTimeComponent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HSMDateTimeComponent message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HSMDateTimeComponent} HSMDateTimeComponent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTimeComponent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HSMDateTimeComponent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.dayOfWeek = reader.int32();
                    break;
                case 2:
                    message.year = reader.uint32();
                    break;
                case 3:
                    message.month = reader.uint32();
                    break;
                case 4:
                    message.dayOfMonth = reader.uint32();
                    break;
                case 5:
                    message.hour = reader.uint32();
                    break;
                case 6:
                    message.minute = reader.uint32();
                    break;
                case 7:
                    message.calendar = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HSMDateTimeComponent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HSMDateTimeComponent} HSMDateTimeComponent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTimeComponent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HSMDateTimeComponent message.
         * @function verify
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HSMDateTimeComponent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dayOfWeek != null && message.hasOwnProperty("dayOfWeek"))
                switch (message.dayOfWeek) {
                default:
                    return "dayOfWeek: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.year != null && message.hasOwnProperty("year"))
                if (!$util.isInteger(message.year))
                    return "year: integer expected";
            if (message.month != null && message.hasOwnProperty("month"))
                if (!$util.isInteger(message.month))
                    return "month: integer expected";
            if (message.dayOfMonth != null && message.hasOwnProperty("dayOfMonth"))
                if (!$util.isInteger(message.dayOfMonth))
                    return "dayOfMonth: integer expected";
            if (message.hour != null && message.hasOwnProperty("hour"))
                if (!$util.isInteger(message.hour))
                    return "hour: integer expected";
            if (message.minute != null && message.hasOwnProperty("minute"))
                if (!$util.isInteger(message.minute))
                    return "minute: integer expected";
            if (message.calendar != null && message.hasOwnProperty("calendar"))
                switch (message.calendar) {
                default:
                    return "calendar: enum value expected";
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a HSMDateTimeComponent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HSMDateTimeComponent} HSMDateTimeComponent
         */
        HSMDateTimeComponent.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HSMDateTimeComponent)
                return object;
            var message = new $root.proto.HSMDateTimeComponent();
            switch (object.dayOfWeek) {
            case "MONDAY":
            case 1:
                message.dayOfWeek = 1;
                break;
            case "TUESDAY":
            case 2:
                message.dayOfWeek = 2;
                break;
            case "WEDNESDAY":
            case 3:
                message.dayOfWeek = 3;
                break;
            case "THURSDAY":
            case 4:
                message.dayOfWeek = 4;
                break;
            case "FRIDAY":
            case 5:
                message.dayOfWeek = 5;
                break;
            case "SATURDAY":
            case 6:
                message.dayOfWeek = 6;
                break;
            case "SUNDAY":
            case 7:
                message.dayOfWeek = 7;
                break;
            }
            if (object.year != null)
                message.year = object.year >>> 0;
            if (object.month != null)
                message.month = object.month >>> 0;
            if (object.dayOfMonth != null)
                message.dayOfMonth = object.dayOfMonth >>> 0;
            if (object.hour != null)
                message.hour = object.hour >>> 0;
            if (object.minute != null)
                message.minute = object.minute >>> 0;
            switch (object.calendar) {
            case "GREGORIAN":
            case 1:
                message.calendar = 1;
                break;
            case "SOLAR_HIJRI":
            case 2:
                message.calendar = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a HSMDateTimeComponent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HSMDateTimeComponent
         * @static
         * @param {proto.HSMDateTimeComponent} message HSMDateTimeComponent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HSMDateTimeComponent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.dayOfWeek = options.enums === String ? "MONDAY" : 1;
                object.year = 0;
                object.month = 0;
                object.dayOfMonth = 0;
                object.hour = 0;
                object.minute = 0;
                object.calendar = options.enums === String ? "GREGORIAN" : 1;
            }
            if (message.dayOfWeek != null && message.hasOwnProperty("dayOfWeek"))
                object.dayOfWeek = options.enums === String ? $root.proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE[message.dayOfWeek] : message.dayOfWeek;
            if (message.year != null && message.hasOwnProperty("year"))
                object.year = message.year;
            if (message.month != null && message.hasOwnProperty("month"))
                object.month = message.month;
            if (message.dayOfMonth != null && message.hasOwnProperty("dayOfMonth"))
                object.dayOfMonth = message.dayOfMonth;
            if (message.hour != null && message.hasOwnProperty("hour"))
                object.hour = message.hour;
            if (message.minute != null && message.hasOwnProperty("minute"))
                object.minute = message.minute;
            if (message.calendar != null && message.hasOwnProperty("calendar"))
                object.calendar = options.enums === String ? $root.proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE[message.calendar] : message.calendar;
            return object;
        };

        /**
         * Converts this HSMDateTimeComponent to JSON.
         * @function toJSON
         * @memberof proto.HSMDateTimeComponent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HSMDateTimeComponent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE enum.
         * @name proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE
         * @enum {number}
         * @property {number} MONDAY=1 MONDAY value
         * @property {number} TUESDAY=2 TUESDAY value
         * @property {number} WEDNESDAY=3 WEDNESDAY value
         * @property {number} THURSDAY=4 THURSDAY value
         * @property {number} FRIDAY=5 FRIDAY value
         * @property {number} SATURDAY=6 SATURDAY value
         * @property {number} SUNDAY=7 SUNDAY value
         */
        HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "MONDAY"] = 1;
            values[valuesById[2] = "TUESDAY"] = 2;
            values[valuesById[3] = "WEDNESDAY"] = 3;
            values[valuesById[4] = "THURSDAY"] = 4;
            values[valuesById[5] = "FRIDAY"] = 5;
            values[valuesById[6] = "SATURDAY"] = 6;
            values[valuesById[7] = "SUNDAY"] = 7;
            return values;
        })();

        /**
         * HSM_DATE_TIME_COMPONENT_CALENDARTYPE enum.
         * @name proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE
         * @enum {number}
         * @property {number} GREGORIAN=1 GREGORIAN value
         * @property {number} SOLAR_HIJRI=2 SOLAR_HIJRI value
         */
        HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "GREGORIAN"] = 1;
            values[valuesById[2] = "SOLAR_HIJRI"] = 2;
            return values;
        })();

        return HSMDateTimeComponent;
    })();

    proto.HSMDateTimeUnixEpoch = (function() {

        /**
         * Properties of a HSMDateTimeUnixEpoch.
         * @memberof proto
         * @interface IHSMDateTimeUnixEpoch
         * @property {number|Long|null} [timestamp] HSMDateTimeUnixEpoch timestamp
         */

        /**
         * Constructs a new HSMDateTimeUnixEpoch.
         * @memberof proto
         * @classdesc Represents a HSMDateTimeUnixEpoch.
         * @implements IHSMDateTimeUnixEpoch
         * @constructor
         * @param {proto.IHSMDateTimeUnixEpoch=} [properties] Properties to set
         */
        function HSMDateTimeUnixEpoch(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HSMDateTimeUnixEpoch timestamp.
         * @member {number|Long} timestamp
         * @memberof proto.HSMDateTimeUnixEpoch
         * @instance
         */
        HSMDateTimeUnixEpoch.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HSMDateTimeUnixEpoch instance using the specified properties.
         * @function create
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {proto.IHSMDateTimeUnixEpoch=} [properties] Properties to set
         * @returns {proto.HSMDateTimeUnixEpoch} HSMDateTimeUnixEpoch instance
         */
        HSMDateTimeUnixEpoch.create = function create(properties) {
            return new HSMDateTimeUnixEpoch(properties);
        };

        /**
         * Encodes the specified HSMDateTimeUnixEpoch message. Does not implicitly {@link proto.HSMDateTimeUnixEpoch.verify|verify} messages.
         * @function encode
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {proto.IHSMDateTimeUnixEpoch} message HSMDateTimeUnixEpoch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTimeUnixEpoch.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified HSMDateTimeUnixEpoch message, length delimited. Does not implicitly {@link proto.HSMDateTimeUnixEpoch.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {proto.IHSMDateTimeUnixEpoch} message HSMDateTimeUnixEpoch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTimeUnixEpoch.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HSMDateTimeUnixEpoch} HSMDateTimeUnixEpoch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTimeUnixEpoch.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HSMDateTimeUnixEpoch();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HSMDateTimeUnixEpoch} HSMDateTimeUnixEpoch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTimeUnixEpoch.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HSMDateTimeUnixEpoch message.
         * @function verify
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HSMDateTimeUnixEpoch.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a HSMDateTimeUnixEpoch message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HSMDateTimeUnixEpoch} HSMDateTimeUnixEpoch
         */
        HSMDateTimeUnixEpoch.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HSMDateTimeUnixEpoch)
                return object;
            var message = new $root.proto.HSMDateTimeUnixEpoch();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HSMDateTimeUnixEpoch message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HSMDateTimeUnixEpoch
         * @static
         * @param {proto.HSMDateTimeUnixEpoch} message HSMDateTimeUnixEpoch
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HSMDateTimeUnixEpoch.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this HSMDateTimeUnixEpoch to JSON.
         * @function toJSON
         * @memberof proto.HSMDateTimeUnixEpoch
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HSMDateTimeUnixEpoch.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HSMDateTimeUnixEpoch;
    })();

    proto.HSMDateTime = (function() {

        /**
         * Properties of a HSMDateTime.
         * @memberof proto
         * @interface IHSMDateTime
         * @property {proto.IHSMDateTimeComponent|null} [component] HSMDateTime component
         * @property {proto.IHSMDateTimeUnixEpoch|null} [unixEpoch] HSMDateTime unixEpoch
         */

        /**
         * Constructs a new HSMDateTime.
         * @memberof proto
         * @classdesc Represents a HSMDateTime.
         * @implements IHSMDateTime
         * @constructor
         * @param {proto.IHSMDateTime=} [properties] Properties to set
         */
        function HSMDateTime(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HSMDateTime component.
         * @member {proto.IHSMDateTimeComponent|null|undefined} component
         * @memberof proto.HSMDateTime
         * @instance
         */
        HSMDateTime.prototype.component = null;

        /**
         * HSMDateTime unixEpoch.
         * @member {proto.IHSMDateTimeUnixEpoch|null|undefined} unixEpoch
         * @memberof proto.HSMDateTime
         * @instance
         */
        HSMDateTime.prototype.unixEpoch = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * HSMDateTime datetimeOneof.
         * @member {"component"|"unixEpoch"|undefined} datetimeOneof
         * @memberof proto.HSMDateTime
         * @instance
         */
        Object.defineProperty(HSMDateTime.prototype, "datetimeOneof", {
            get: $util.oneOfGetter($oneOfFields = ["component", "unixEpoch"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new HSMDateTime instance using the specified properties.
         * @function create
         * @memberof proto.HSMDateTime
         * @static
         * @param {proto.IHSMDateTime=} [properties] Properties to set
         * @returns {proto.HSMDateTime} HSMDateTime instance
         */
        HSMDateTime.create = function create(properties) {
            return new HSMDateTime(properties);
        };

        /**
         * Encodes the specified HSMDateTime message. Does not implicitly {@link proto.HSMDateTime.verify|verify} messages.
         * @function encode
         * @memberof proto.HSMDateTime
         * @static
         * @param {proto.IHSMDateTime} message HSMDateTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTime.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                $root.proto.HSMDateTimeComponent.encode(message.component, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.unixEpoch != null && Object.hasOwnProperty.call(message, "unixEpoch"))
                $root.proto.HSMDateTimeUnixEpoch.encode(message.unixEpoch, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified HSMDateTime message, length delimited. Does not implicitly {@link proto.HSMDateTime.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HSMDateTime
         * @static
         * @param {proto.IHSMDateTime} message HSMDateTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMDateTime.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HSMDateTime message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HSMDateTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HSMDateTime} HSMDateTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTime.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HSMDateTime();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.component = $root.proto.HSMDateTimeComponent.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.unixEpoch = $root.proto.HSMDateTimeUnixEpoch.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HSMDateTime message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HSMDateTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HSMDateTime} HSMDateTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMDateTime.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HSMDateTime message.
         * @function verify
         * @memberof proto.HSMDateTime
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HSMDateTime.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.component != null && message.hasOwnProperty("component")) {
                properties.datetimeOneof = 1;
                {
                    var error = $root.proto.HSMDateTimeComponent.verify(message.component);
                    if (error)
                        return "component." + error;
                }
            }
            if (message.unixEpoch != null && message.hasOwnProperty("unixEpoch")) {
                if (properties.datetimeOneof === 1)
                    return "datetimeOneof: multiple values";
                properties.datetimeOneof = 1;
                {
                    var error = $root.proto.HSMDateTimeUnixEpoch.verify(message.unixEpoch);
                    if (error)
                        return "unixEpoch." + error;
                }
            }
            return null;
        };

        /**
         * Creates a HSMDateTime message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HSMDateTime
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HSMDateTime} HSMDateTime
         */
        HSMDateTime.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HSMDateTime)
                return object;
            var message = new $root.proto.HSMDateTime();
            if (object.component != null) {
                if (typeof object.component !== "object")
                    throw TypeError(".proto.HSMDateTime.component: object expected");
                message.component = $root.proto.HSMDateTimeComponent.fromObject(object.component);
            }
            if (object.unixEpoch != null) {
                if (typeof object.unixEpoch !== "object")
                    throw TypeError(".proto.HSMDateTime.unixEpoch: object expected");
                message.unixEpoch = $root.proto.HSMDateTimeUnixEpoch.fromObject(object.unixEpoch);
            }
            return message;
        };

        /**
         * Creates a plain object from a HSMDateTime message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HSMDateTime
         * @static
         * @param {proto.HSMDateTime} message HSMDateTime
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HSMDateTime.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.component != null && message.hasOwnProperty("component")) {
                object.component = $root.proto.HSMDateTimeComponent.toObject(message.component, options);
                if (options.oneofs)
                    object.datetimeOneof = "component";
            }
            if (message.unixEpoch != null && message.hasOwnProperty("unixEpoch")) {
                object.unixEpoch = $root.proto.HSMDateTimeUnixEpoch.toObject(message.unixEpoch, options);
                if (options.oneofs)
                    object.datetimeOneof = "unixEpoch";
            }
            return object;
        };

        /**
         * Converts this HSMDateTime to JSON.
         * @function toJSON
         * @memberof proto.HSMDateTime
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HSMDateTime.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HSMDateTime;
    })();

    proto.HSMLocalizableParameter = (function() {

        /**
         * Properties of a HSMLocalizableParameter.
         * @memberof proto
         * @interface IHSMLocalizableParameter
         * @property {string|null} ["default"] HSMLocalizableParameter default
         * @property {proto.IHSMCurrency|null} [currency] HSMLocalizableParameter currency
         * @property {proto.IHSMDateTime|null} [dateTime] HSMLocalizableParameter dateTime
         */

        /**
         * Constructs a new HSMLocalizableParameter.
         * @memberof proto
         * @classdesc Represents a HSMLocalizableParameter.
         * @implements IHSMLocalizableParameter
         * @constructor
         * @param {proto.IHSMLocalizableParameter=} [properties] Properties to set
         */
        function HSMLocalizableParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HSMLocalizableParameter default.
         * @member {string} default
         * @memberof proto.HSMLocalizableParameter
         * @instance
         */
        HSMLocalizableParameter.prototype["default"] = "";

        /**
         * HSMLocalizableParameter currency.
         * @member {proto.IHSMCurrency|null|undefined} currency
         * @memberof proto.HSMLocalizableParameter
         * @instance
         */
        HSMLocalizableParameter.prototype.currency = null;

        /**
         * HSMLocalizableParameter dateTime.
         * @member {proto.IHSMDateTime|null|undefined} dateTime
         * @memberof proto.HSMLocalizableParameter
         * @instance
         */
        HSMLocalizableParameter.prototype.dateTime = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * HSMLocalizableParameter paramOneof.
         * @member {"currency"|"dateTime"|undefined} paramOneof
         * @memberof proto.HSMLocalizableParameter
         * @instance
         */
        Object.defineProperty(HSMLocalizableParameter.prototype, "paramOneof", {
            get: $util.oneOfGetter($oneOfFields = ["currency", "dateTime"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new HSMLocalizableParameter instance using the specified properties.
         * @function create
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {proto.IHSMLocalizableParameter=} [properties] Properties to set
         * @returns {proto.HSMLocalizableParameter} HSMLocalizableParameter instance
         */
        HSMLocalizableParameter.create = function create(properties) {
            return new HSMLocalizableParameter(properties);
        };

        /**
         * Encodes the specified HSMLocalizableParameter message. Does not implicitly {@link proto.HSMLocalizableParameter.verify|verify} messages.
         * @function encode
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {proto.IHSMLocalizableParameter} message HSMLocalizableParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMLocalizableParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message["default"] != null && Object.hasOwnProperty.call(message, "default"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message["default"]);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                $root.proto.HSMCurrency.encode(message.currency, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.dateTime != null && Object.hasOwnProperty.call(message, "dateTime"))
                $root.proto.HSMDateTime.encode(message.dateTime, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified HSMLocalizableParameter message, length delimited. Does not implicitly {@link proto.HSMLocalizableParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {proto.IHSMLocalizableParameter} message HSMLocalizableParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HSMLocalizableParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HSMLocalizableParameter message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HSMLocalizableParameter} HSMLocalizableParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMLocalizableParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HSMLocalizableParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message["default"] = reader.string();
                    break;
                case 2:
                    message.currency = $root.proto.HSMCurrency.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.dateTime = $root.proto.HSMDateTime.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HSMLocalizableParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HSMLocalizableParameter} HSMLocalizableParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HSMLocalizableParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HSMLocalizableParameter message.
         * @function verify
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HSMLocalizableParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message["default"] != null && message.hasOwnProperty("default"))
                if (!$util.isString(message["default"]))
                    return "default: string expected";
            if (message.currency != null && message.hasOwnProperty("currency")) {
                properties.paramOneof = 1;
                {
                    var error = $root.proto.HSMCurrency.verify(message.currency);
                    if (error)
                        return "currency." + error;
                }
            }
            if (message.dateTime != null && message.hasOwnProperty("dateTime")) {
                if (properties.paramOneof === 1)
                    return "paramOneof: multiple values";
                properties.paramOneof = 1;
                {
                    var error = $root.proto.HSMDateTime.verify(message.dateTime);
                    if (error)
                        return "dateTime." + error;
                }
            }
            return null;
        };

        /**
         * Creates a HSMLocalizableParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HSMLocalizableParameter} HSMLocalizableParameter
         */
        HSMLocalizableParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HSMLocalizableParameter)
                return object;
            var message = new $root.proto.HSMLocalizableParameter();
            if (object["default"] != null)
                message["default"] = String(object["default"]);
            if (object.currency != null) {
                if (typeof object.currency !== "object")
                    throw TypeError(".proto.HSMLocalizableParameter.currency: object expected");
                message.currency = $root.proto.HSMCurrency.fromObject(object.currency);
            }
            if (object.dateTime != null) {
                if (typeof object.dateTime !== "object")
                    throw TypeError(".proto.HSMLocalizableParameter.dateTime: object expected");
                message.dateTime = $root.proto.HSMDateTime.fromObject(object.dateTime);
            }
            return message;
        };

        /**
         * Creates a plain object from a HSMLocalizableParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HSMLocalizableParameter
         * @static
         * @param {proto.HSMLocalizableParameter} message HSMLocalizableParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HSMLocalizableParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object["default"] = "";
            if (message["default"] != null && message.hasOwnProperty("default"))
                object["default"] = message["default"];
            if (message.currency != null && message.hasOwnProperty("currency")) {
                object.currency = $root.proto.HSMCurrency.toObject(message.currency, options);
                if (options.oneofs)
                    object.paramOneof = "currency";
            }
            if (message.dateTime != null && message.hasOwnProperty("dateTime")) {
                object.dateTime = $root.proto.HSMDateTime.toObject(message.dateTime, options);
                if (options.oneofs)
                    object.paramOneof = "dateTime";
            }
            return object;
        };

        /**
         * Converts this HSMLocalizableParameter to JSON.
         * @function toJSON
         * @memberof proto.HSMLocalizableParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HSMLocalizableParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HSMLocalizableParameter;
    })();

    proto.HighlyStructuredMessage = (function() {

        /**
         * Properties of a HighlyStructuredMessage.
         * @memberof proto
         * @interface IHighlyStructuredMessage
         * @property {string|null} [namespace] HighlyStructuredMessage namespace
         * @property {string|null} [elementName] HighlyStructuredMessage elementName
         * @property {Array.<string>|null} [params] HighlyStructuredMessage params
         * @property {string|null} [fallbackLg] HighlyStructuredMessage fallbackLg
         * @property {string|null} [fallbackLc] HighlyStructuredMessage fallbackLc
         * @property {Array.<proto.IHSMLocalizableParameter>|null} [localizableParams] HighlyStructuredMessage localizableParams
         * @property {string|null} [deterministicLg] HighlyStructuredMessage deterministicLg
         * @property {string|null} [deterministicLc] HighlyStructuredMessage deterministicLc
         * @property {proto.ITemplateMessage|null} [hydratedHsm] HighlyStructuredMessage hydratedHsm
         */

        /**
         * Constructs a new HighlyStructuredMessage.
         * @memberof proto
         * @classdesc Represents a HighlyStructuredMessage.
         * @implements IHighlyStructuredMessage
         * @constructor
         * @param {proto.IHighlyStructuredMessage=} [properties] Properties to set
         */
        function HighlyStructuredMessage(properties) {
            this.params = [];
            this.localizableParams = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HighlyStructuredMessage namespace.
         * @member {string} namespace
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.namespace = "";

        /**
         * HighlyStructuredMessage elementName.
         * @member {string} elementName
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.elementName = "";

        /**
         * HighlyStructuredMessage params.
         * @member {Array.<string>} params
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.params = $util.emptyArray;

        /**
         * HighlyStructuredMessage fallbackLg.
         * @member {string} fallbackLg
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.fallbackLg = "";

        /**
         * HighlyStructuredMessage fallbackLc.
         * @member {string} fallbackLc
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.fallbackLc = "";

        /**
         * HighlyStructuredMessage localizableParams.
         * @member {Array.<proto.IHSMLocalizableParameter>} localizableParams
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.localizableParams = $util.emptyArray;

        /**
         * HighlyStructuredMessage deterministicLg.
         * @member {string} deterministicLg
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.deterministicLg = "";

        /**
         * HighlyStructuredMessage deterministicLc.
         * @member {string} deterministicLc
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.deterministicLc = "";

        /**
         * HighlyStructuredMessage hydratedHsm.
         * @member {proto.ITemplateMessage|null|undefined} hydratedHsm
         * @memberof proto.HighlyStructuredMessage
         * @instance
         */
        HighlyStructuredMessage.prototype.hydratedHsm = null;

        /**
         * Creates a new HighlyStructuredMessage instance using the specified properties.
         * @function create
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {proto.IHighlyStructuredMessage=} [properties] Properties to set
         * @returns {proto.HighlyStructuredMessage} HighlyStructuredMessage instance
         */
        HighlyStructuredMessage.create = function create(properties) {
            return new HighlyStructuredMessage(properties);
        };

        /**
         * Encodes the specified HighlyStructuredMessage message. Does not implicitly {@link proto.HighlyStructuredMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {proto.IHighlyStructuredMessage} message HighlyStructuredMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HighlyStructuredMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.namespace != null && Object.hasOwnProperty.call(message, "namespace"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.namespace);
            if (message.elementName != null && Object.hasOwnProperty.call(message, "elementName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.elementName);
            if (message.params != null && message.params.length)
                for (var i = 0; i < message.params.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.params[i]);
            if (message.fallbackLg != null && Object.hasOwnProperty.call(message, "fallbackLg"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.fallbackLg);
            if (message.fallbackLc != null && Object.hasOwnProperty.call(message, "fallbackLc"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.fallbackLc);
            if (message.localizableParams != null && message.localizableParams.length)
                for (var i = 0; i < message.localizableParams.length; ++i)
                    $root.proto.HSMLocalizableParameter.encode(message.localizableParams[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.deterministicLg != null && Object.hasOwnProperty.call(message, "deterministicLg"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.deterministicLg);
            if (message.deterministicLc != null && Object.hasOwnProperty.call(message, "deterministicLc"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.deterministicLc);
            if (message.hydratedHsm != null && Object.hasOwnProperty.call(message, "hydratedHsm"))
                $root.proto.TemplateMessage.encode(message.hydratedHsm, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified HighlyStructuredMessage message, length delimited. Does not implicitly {@link proto.HighlyStructuredMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {proto.IHighlyStructuredMessage} message HighlyStructuredMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HighlyStructuredMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HighlyStructuredMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HighlyStructuredMessage} HighlyStructuredMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HighlyStructuredMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HighlyStructuredMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.namespace = reader.string();
                    break;
                case 2:
                    message.elementName = reader.string();
                    break;
                case 3:
                    if (!(message.params && message.params.length))
                        message.params = [];
                    message.params.push(reader.string());
                    break;
                case 4:
                    message.fallbackLg = reader.string();
                    break;
                case 5:
                    message.fallbackLc = reader.string();
                    break;
                case 6:
                    if (!(message.localizableParams && message.localizableParams.length))
                        message.localizableParams = [];
                    message.localizableParams.push($root.proto.HSMLocalizableParameter.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.deterministicLg = reader.string();
                    break;
                case 8:
                    message.deterministicLc = reader.string();
                    break;
                case 9:
                    message.hydratedHsm = $root.proto.TemplateMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HighlyStructuredMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HighlyStructuredMessage} HighlyStructuredMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HighlyStructuredMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HighlyStructuredMessage message.
         * @function verify
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HighlyStructuredMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                if (!$util.isString(message.namespace))
                    return "namespace: string expected";
            if (message.elementName != null && message.hasOwnProperty("elementName"))
                if (!$util.isString(message.elementName))
                    return "elementName: string expected";
            if (message.params != null && message.hasOwnProperty("params")) {
                if (!Array.isArray(message.params))
                    return "params: array expected";
                for (var i = 0; i < message.params.length; ++i)
                    if (!$util.isString(message.params[i]))
                        return "params: string[] expected";
            }
            if (message.fallbackLg != null && message.hasOwnProperty("fallbackLg"))
                if (!$util.isString(message.fallbackLg))
                    return "fallbackLg: string expected";
            if (message.fallbackLc != null && message.hasOwnProperty("fallbackLc"))
                if (!$util.isString(message.fallbackLc))
                    return "fallbackLc: string expected";
            if (message.localizableParams != null && message.hasOwnProperty("localizableParams")) {
                if (!Array.isArray(message.localizableParams))
                    return "localizableParams: array expected";
                for (var i = 0; i < message.localizableParams.length; ++i) {
                    var error = $root.proto.HSMLocalizableParameter.verify(message.localizableParams[i]);
                    if (error)
                        return "localizableParams." + error;
                }
            }
            if (message.deterministicLg != null && message.hasOwnProperty("deterministicLg"))
                if (!$util.isString(message.deterministicLg))
                    return "deterministicLg: string expected";
            if (message.deterministicLc != null && message.hasOwnProperty("deterministicLc"))
                if (!$util.isString(message.deterministicLc))
                    return "deterministicLc: string expected";
            if (message.hydratedHsm != null && message.hasOwnProperty("hydratedHsm")) {
                var error = $root.proto.TemplateMessage.verify(message.hydratedHsm);
                if (error)
                    return "hydratedHsm." + error;
            }
            return null;
        };

        /**
         * Creates a HighlyStructuredMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HighlyStructuredMessage} HighlyStructuredMessage
         */
        HighlyStructuredMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HighlyStructuredMessage)
                return object;
            var message = new $root.proto.HighlyStructuredMessage();
            if (object.namespace != null)
                message.namespace = String(object.namespace);
            if (object.elementName != null)
                message.elementName = String(object.elementName);
            if (object.params) {
                if (!Array.isArray(object.params))
                    throw TypeError(".proto.HighlyStructuredMessage.params: array expected");
                message.params = [];
                for (var i = 0; i < object.params.length; ++i)
                    message.params[i] = String(object.params[i]);
            }
            if (object.fallbackLg != null)
                message.fallbackLg = String(object.fallbackLg);
            if (object.fallbackLc != null)
                message.fallbackLc = String(object.fallbackLc);
            if (object.localizableParams) {
                if (!Array.isArray(object.localizableParams))
                    throw TypeError(".proto.HighlyStructuredMessage.localizableParams: array expected");
                message.localizableParams = [];
                for (var i = 0; i < object.localizableParams.length; ++i) {
                    if (typeof object.localizableParams[i] !== "object")
                        throw TypeError(".proto.HighlyStructuredMessage.localizableParams: object expected");
                    message.localizableParams[i] = $root.proto.HSMLocalizableParameter.fromObject(object.localizableParams[i]);
                }
            }
            if (object.deterministicLg != null)
                message.deterministicLg = String(object.deterministicLg);
            if (object.deterministicLc != null)
                message.deterministicLc = String(object.deterministicLc);
            if (object.hydratedHsm != null) {
                if (typeof object.hydratedHsm !== "object")
                    throw TypeError(".proto.HighlyStructuredMessage.hydratedHsm: object expected");
                message.hydratedHsm = $root.proto.TemplateMessage.fromObject(object.hydratedHsm);
            }
            return message;
        };

        /**
         * Creates a plain object from a HighlyStructuredMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HighlyStructuredMessage
         * @static
         * @param {proto.HighlyStructuredMessage} message HighlyStructuredMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HighlyStructuredMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.params = [];
                object.localizableParams = [];
            }
            if (options.defaults) {
                object.namespace = "";
                object.elementName = "";
                object.fallbackLg = "";
                object.fallbackLc = "";
                object.deterministicLg = "";
                object.deterministicLc = "";
                object.hydratedHsm = null;
            }
            if (message.namespace != null && message.hasOwnProperty("namespace"))
                object.namespace = message.namespace;
            if (message.elementName != null && message.hasOwnProperty("elementName"))
                object.elementName = message.elementName;
            if (message.params && message.params.length) {
                object.params = [];
                for (var j = 0; j < message.params.length; ++j)
                    object.params[j] = message.params[j];
            }
            if (message.fallbackLg != null && message.hasOwnProperty("fallbackLg"))
                object.fallbackLg = message.fallbackLg;
            if (message.fallbackLc != null && message.hasOwnProperty("fallbackLc"))
                object.fallbackLc = message.fallbackLc;
            if (message.localizableParams && message.localizableParams.length) {
                object.localizableParams = [];
                for (var j = 0; j < message.localizableParams.length; ++j)
                    object.localizableParams[j] = $root.proto.HSMLocalizableParameter.toObject(message.localizableParams[j], options);
            }
            if (message.deterministicLg != null && message.hasOwnProperty("deterministicLg"))
                object.deterministicLg = message.deterministicLg;
            if (message.deterministicLc != null && message.hasOwnProperty("deterministicLc"))
                object.deterministicLc = message.deterministicLc;
            if (message.hydratedHsm != null && message.hasOwnProperty("hydratedHsm"))
                object.hydratedHsm = $root.proto.TemplateMessage.toObject(message.hydratedHsm, options);
            return object;
        };

        /**
         * Converts this HighlyStructuredMessage to JSON.
         * @function toJSON
         * @memberof proto.HighlyStructuredMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HighlyStructuredMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HighlyStructuredMessage;
    })();

    proto.SendPaymentMessage = (function() {

        /**
         * Properties of a SendPaymentMessage.
         * @memberof proto
         * @interface ISendPaymentMessage
         * @property {proto.IMessage|null} [noteMessage] SendPaymentMessage noteMessage
         * @property {proto.IMessageKey|null} [requestMessageKey] SendPaymentMessage requestMessageKey
         */

        /**
         * Constructs a new SendPaymentMessage.
         * @memberof proto
         * @classdesc Represents a SendPaymentMessage.
         * @implements ISendPaymentMessage
         * @constructor
         * @param {proto.ISendPaymentMessage=} [properties] Properties to set
         */
        function SendPaymentMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendPaymentMessage noteMessage.
         * @member {proto.IMessage|null|undefined} noteMessage
         * @memberof proto.SendPaymentMessage
         * @instance
         */
        SendPaymentMessage.prototype.noteMessage = null;

        /**
         * SendPaymentMessage requestMessageKey.
         * @member {proto.IMessageKey|null|undefined} requestMessageKey
         * @memberof proto.SendPaymentMessage
         * @instance
         */
        SendPaymentMessage.prototype.requestMessageKey = null;

        /**
         * Creates a new SendPaymentMessage instance using the specified properties.
         * @function create
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {proto.ISendPaymentMessage=} [properties] Properties to set
         * @returns {proto.SendPaymentMessage} SendPaymentMessage instance
         */
        SendPaymentMessage.create = function create(properties) {
            return new SendPaymentMessage(properties);
        };

        /**
         * Encodes the specified SendPaymentMessage message. Does not implicitly {@link proto.SendPaymentMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {proto.ISendPaymentMessage} message SendPaymentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPaymentMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.noteMessage != null && Object.hasOwnProperty.call(message, "noteMessage"))
                $root.proto.Message.encode(message.noteMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.requestMessageKey != null && Object.hasOwnProperty.call(message, "requestMessageKey"))
                $root.proto.MessageKey.encode(message.requestMessageKey, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SendPaymentMessage message, length delimited. Does not implicitly {@link proto.SendPaymentMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {proto.ISendPaymentMessage} message SendPaymentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPaymentMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendPaymentMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.SendPaymentMessage} SendPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPaymentMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.SendPaymentMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.noteMessage = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.requestMessageKey = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SendPaymentMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.SendPaymentMessage} SendPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPaymentMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendPaymentMessage message.
         * @function verify
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendPaymentMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.noteMessage != null && message.hasOwnProperty("noteMessage")) {
                var error = $root.proto.Message.verify(message.noteMessage);
                if (error)
                    return "noteMessage." + error;
            }
            if (message.requestMessageKey != null && message.hasOwnProperty("requestMessageKey")) {
                var error = $root.proto.MessageKey.verify(message.requestMessageKey);
                if (error)
                    return "requestMessageKey." + error;
            }
            return null;
        };

        /**
         * Creates a SendPaymentMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.SendPaymentMessage} SendPaymentMessage
         */
        SendPaymentMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.SendPaymentMessage)
                return object;
            var message = new $root.proto.SendPaymentMessage();
            if (object.noteMessage != null) {
                if (typeof object.noteMessage !== "object")
                    throw TypeError(".proto.SendPaymentMessage.noteMessage: object expected");
                message.noteMessage = $root.proto.Message.fromObject(object.noteMessage);
            }
            if (object.requestMessageKey != null) {
                if (typeof object.requestMessageKey !== "object")
                    throw TypeError(".proto.SendPaymentMessage.requestMessageKey: object expected");
                message.requestMessageKey = $root.proto.MessageKey.fromObject(object.requestMessageKey);
            }
            return message;
        };

        /**
         * Creates a plain object from a SendPaymentMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.SendPaymentMessage
         * @static
         * @param {proto.SendPaymentMessage} message SendPaymentMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendPaymentMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.noteMessage = null;
                object.requestMessageKey = null;
            }
            if (message.noteMessage != null && message.hasOwnProperty("noteMessage"))
                object.noteMessage = $root.proto.Message.toObject(message.noteMessage, options);
            if (message.requestMessageKey != null && message.hasOwnProperty("requestMessageKey"))
                object.requestMessageKey = $root.proto.MessageKey.toObject(message.requestMessageKey, options);
            return object;
        };

        /**
         * Converts this SendPaymentMessage to JSON.
         * @function toJSON
         * @memberof proto.SendPaymentMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendPaymentMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendPaymentMessage;
    })();

    proto.RequestPaymentMessage = (function() {

        /**
         * Properties of a RequestPaymentMessage.
         * @memberof proto
         * @interface IRequestPaymentMessage
         * @property {proto.IMessage|null} [noteMessage] RequestPaymentMessage noteMessage
         * @property {string|null} [currencyCodeIso4217] RequestPaymentMessage currencyCodeIso4217
         * @property {number|Long|null} [amount1000] RequestPaymentMessage amount1000
         * @property {string|null} [requestFrom] RequestPaymentMessage requestFrom
         * @property {number|Long|null} [expiryTimestamp] RequestPaymentMessage expiryTimestamp
         */

        /**
         * Constructs a new RequestPaymentMessage.
         * @memberof proto
         * @classdesc Represents a RequestPaymentMessage.
         * @implements IRequestPaymentMessage
         * @constructor
         * @param {proto.IRequestPaymentMessage=} [properties] Properties to set
         */
        function RequestPaymentMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestPaymentMessage noteMessage.
         * @member {proto.IMessage|null|undefined} noteMessage
         * @memberof proto.RequestPaymentMessage
         * @instance
         */
        RequestPaymentMessage.prototype.noteMessage = null;

        /**
         * RequestPaymentMessage currencyCodeIso4217.
         * @member {string} currencyCodeIso4217
         * @memberof proto.RequestPaymentMessage
         * @instance
         */
        RequestPaymentMessage.prototype.currencyCodeIso4217 = "";

        /**
         * RequestPaymentMessage amount1000.
         * @member {number|Long} amount1000
         * @memberof proto.RequestPaymentMessage
         * @instance
         */
        RequestPaymentMessage.prototype.amount1000 = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * RequestPaymentMessage requestFrom.
         * @member {string} requestFrom
         * @memberof proto.RequestPaymentMessage
         * @instance
         */
        RequestPaymentMessage.prototype.requestFrom = "";

        /**
         * RequestPaymentMessage expiryTimestamp.
         * @member {number|Long} expiryTimestamp
         * @memberof proto.RequestPaymentMessage
         * @instance
         */
        RequestPaymentMessage.prototype.expiryTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new RequestPaymentMessage instance using the specified properties.
         * @function create
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {proto.IRequestPaymentMessage=} [properties] Properties to set
         * @returns {proto.RequestPaymentMessage} RequestPaymentMessage instance
         */
        RequestPaymentMessage.create = function create(properties) {
            return new RequestPaymentMessage(properties);
        };

        /**
         * Encodes the specified RequestPaymentMessage message. Does not implicitly {@link proto.RequestPaymentMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {proto.IRequestPaymentMessage} message RequestPaymentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestPaymentMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.currencyCodeIso4217 != null && Object.hasOwnProperty.call(message, "currencyCodeIso4217"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.currencyCodeIso4217);
            if (message.amount1000 != null && Object.hasOwnProperty.call(message, "amount1000"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.amount1000);
            if (message.requestFrom != null && Object.hasOwnProperty.call(message, "requestFrom"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.requestFrom);
            if (message.noteMessage != null && Object.hasOwnProperty.call(message, "noteMessage"))
                $root.proto.Message.encode(message.noteMessage, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.expiryTimestamp != null && Object.hasOwnProperty.call(message, "expiryTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.expiryTimestamp);
            return writer;
        };

        /**
         * Encodes the specified RequestPaymentMessage message, length delimited. Does not implicitly {@link proto.RequestPaymentMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {proto.IRequestPaymentMessage} message RequestPaymentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestPaymentMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestPaymentMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.RequestPaymentMessage} RequestPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestPaymentMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.RequestPaymentMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 4:
                    message.noteMessage = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                case 1:
                    message.currencyCodeIso4217 = reader.string();
                    break;
                case 2:
                    message.amount1000 = reader.uint64();
                    break;
                case 3:
                    message.requestFrom = reader.string();
                    break;
                case 5:
                    message.expiryTimestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RequestPaymentMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.RequestPaymentMessage} RequestPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestPaymentMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestPaymentMessage message.
         * @function verify
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestPaymentMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.noteMessage != null && message.hasOwnProperty("noteMessage")) {
                var error = $root.proto.Message.verify(message.noteMessage);
                if (error)
                    return "noteMessage." + error;
            }
            if (message.currencyCodeIso4217 != null && message.hasOwnProperty("currencyCodeIso4217"))
                if (!$util.isString(message.currencyCodeIso4217))
                    return "currencyCodeIso4217: string expected";
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (!$util.isInteger(message.amount1000) && !(message.amount1000 && $util.isInteger(message.amount1000.low) && $util.isInteger(message.amount1000.high)))
                    return "amount1000: integer|Long expected";
            if (message.requestFrom != null && message.hasOwnProperty("requestFrom"))
                if (!$util.isString(message.requestFrom))
                    return "requestFrom: string expected";
            if (message.expiryTimestamp != null && message.hasOwnProperty("expiryTimestamp"))
                if (!$util.isInteger(message.expiryTimestamp) && !(message.expiryTimestamp && $util.isInteger(message.expiryTimestamp.low) && $util.isInteger(message.expiryTimestamp.high)))
                    return "expiryTimestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a RequestPaymentMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.RequestPaymentMessage} RequestPaymentMessage
         */
        RequestPaymentMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.RequestPaymentMessage)
                return object;
            var message = new $root.proto.RequestPaymentMessage();
            if (object.noteMessage != null) {
                if (typeof object.noteMessage !== "object")
                    throw TypeError(".proto.RequestPaymentMessage.noteMessage: object expected");
                message.noteMessage = $root.proto.Message.fromObject(object.noteMessage);
            }
            if (object.currencyCodeIso4217 != null)
                message.currencyCodeIso4217 = String(object.currencyCodeIso4217);
            if (object.amount1000 != null)
                if ($util.Long)
                    (message.amount1000 = $util.Long.fromValue(object.amount1000)).unsigned = true;
                else if (typeof object.amount1000 === "string")
                    message.amount1000 = parseInt(object.amount1000, 10);
                else if (typeof object.amount1000 === "number")
                    message.amount1000 = object.amount1000;
                else if (typeof object.amount1000 === "object")
                    message.amount1000 = new $util.LongBits(object.amount1000.low >>> 0, object.amount1000.high >>> 0).toNumber(true);
            if (object.requestFrom != null)
                message.requestFrom = String(object.requestFrom);
            if (object.expiryTimestamp != null)
                if ($util.Long)
                    (message.expiryTimestamp = $util.Long.fromValue(object.expiryTimestamp)).unsigned = false;
                else if (typeof object.expiryTimestamp === "string")
                    message.expiryTimestamp = parseInt(object.expiryTimestamp, 10);
                else if (typeof object.expiryTimestamp === "number")
                    message.expiryTimestamp = object.expiryTimestamp;
                else if (typeof object.expiryTimestamp === "object")
                    message.expiryTimestamp = new $util.LongBits(object.expiryTimestamp.low >>> 0, object.expiryTimestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a RequestPaymentMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.RequestPaymentMessage
         * @static
         * @param {proto.RequestPaymentMessage} message RequestPaymentMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestPaymentMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.currencyCodeIso4217 = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.amount1000 = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount1000 = options.longs === String ? "0" : 0;
                object.requestFrom = "";
                object.noteMessage = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.expiryTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.expiryTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.currencyCodeIso4217 != null && message.hasOwnProperty("currencyCodeIso4217"))
                object.currencyCodeIso4217 = message.currencyCodeIso4217;
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (typeof message.amount1000 === "number")
                    object.amount1000 = options.longs === String ? String(message.amount1000) : message.amount1000;
                else
                    object.amount1000 = options.longs === String ? $util.Long.prototype.toString.call(message.amount1000) : options.longs === Number ? new $util.LongBits(message.amount1000.low >>> 0, message.amount1000.high >>> 0).toNumber(true) : message.amount1000;
            if (message.requestFrom != null && message.hasOwnProperty("requestFrom"))
                object.requestFrom = message.requestFrom;
            if (message.noteMessage != null && message.hasOwnProperty("noteMessage"))
                object.noteMessage = $root.proto.Message.toObject(message.noteMessage, options);
            if (message.expiryTimestamp != null && message.hasOwnProperty("expiryTimestamp"))
                if (typeof message.expiryTimestamp === "number")
                    object.expiryTimestamp = options.longs === String ? String(message.expiryTimestamp) : message.expiryTimestamp;
                else
                    object.expiryTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.expiryTimestamp) : options.longs === Number ? new $util.LongBits(message.expiryTimestamp.low >>> 0, message.expiryTimestamp.high >>> 0).toNumber() : message.expiryTimestamp;
            return object;
        };

        /**
         * Converts this RequestPaymentMessage to JSON.
         * @function toJSON
         * @memberof proto.RequestPaymentMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestPaymentMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RequestPaymentMessage;
    })();

    proto.DeclinePaymentRequestMessage = (function() {

        /**
         * Properties of a DeclinePaymentRequestMessage.
         * @memberof proto
         * @interface IDeclinePaymentRequestMessage
         * @property {proto.IMessageKey|null} [key] DeclinePaymentRequestMessage key
         */

        /**
         * Constructs a new DeclinePaymentRequestMessage.
         * @memberof proto
         * @classdesc Represents a DeclinePaymentRequestMessage.
         * @implements IDeclinePaymentRequestMessage
         * @constructor
         * @param {proto.IDeclinePaymentRequestMessage=} [properties] Properties to set
         */
        function DeclinePaymentRequestMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeclinePaymentRequestMessage key.
         * @member {proto.IMessageKey|null|undefined} key
         * @memberof proto.DeclinePaymentRequestMessage
         * @instance
         */
        DeclinePaymentRequestMessage.prototype.key = null;

        /**
         * Creates a new DeclinePaymentRequestMessage instance using the specified properties.
         * @function create
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {proto.IDeclinePaymentRequestMessage=} [properties] Properties to set
         * @returns {proto.DeclinePaymentRequestMessage} DeclinePaymentRequestMessage instance
         */
        DeclinePaymentRequestMessage.create = function create(properties) {
            return new DeclinePaymentRequestMessage(properties);
        };

        /**
         * Encodes the specified DeclinePaymentRequestMessage message. Does not implicitly {@link proto.DeclinePaymentRequestMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {proto.IDeclinePaymentRequestMessage} message DeclinePaymentRequestMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeclinePaymentRequestMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                $root.proto.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DeclinePaymentRequestMessage message, length delimited. Does not implicitly {@link proto.DeclinePaymentRequestMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {proto.IDeclinePaymentRequestMessage} message DeclinePaymentRequestMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeclinePaymentRequestMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.DeclinePaymentRequestMessage} DeclinePaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeclinePaymentRequestMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.DeclinePaymentRequestMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.DeclinePaymentRequestMessage} DeclinePaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeclinePaymentRequestMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeclinePaymentRequestMessage message.
         * @function verify
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeclinePaymentRequestMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key")) {
                var error = $root.proto.MessageKey.verify(message.key);
                if (error)
                    return "key." + error;
            }
            return null;
        };

        /**
         * Creates a DeclinePaymentRequestMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.DeclinePaymentRequestMessage} DeclinePaymentRequestMessage
         */
        DeclinePaymentRequestMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.DeclinePaymentRequestMessage)
                return object;
            var message = new $root.proto.DeclinePaymentRequestMessage();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".proto.DeclinePaymentRequestMessage.key: object expected");
                message.key = $root.proto.MessageKey.fromObject(object.key);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeclinePaymentRequestMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.DeclinePaymentRequestMessage
         * @static
         * @param {proto.DeclinePaymentRequestMessage} message DeclinePaymentRequestMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeclinePaymentRequestMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.key = null;
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.proto.MessageKey.toObject(message.key, options);
            return object;
        };

        /**
         * Converts this DeclinePaymentRequestMessage to JSON.
         * @function toJSON
         * @memberof proto.DeclinePaymentRequestMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeclinePaymentRequestMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeclinePaymentRequestMessage;
    })();

    proto.CancelPaymentRequestMessage = (function() {

        /**
         * Properties of a CancelPaymentRequestMessage.
         * @memberof proto
         * @interface ICancelPaymentRequestMessage
         * @property {proto.IMessageKey|null} [key] CancelPaymentRequestMessage key
         */

        /**
         * Constructs a new CancelPaymentRequestMessage.
         * @memberof proto
         * @classdesc Represents a CancelPaymentRequestMessage.
         * @implements ICancelPaymentRequestMessage
         * @constructor
         * @param {proto.ICancelPaymentRequestMessage=} [properties] Properties to set
         */
        function CancelPaymentRequestMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CancelPaymentRequestMessage key.
         * @member {proto.IMessageKey|null|undefined} key
         * @memberof proto.CancelPaymentRequestMessage
         * @instance
         */
        CancelPaymentRequestMessage.prototype.key = null;

        /**
         * Creates a new CancelPaymentRequestMessage instance using the specified properties.
         * @function create
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {proto.ICancelPaymentRequestMessage=} [properties] Properties to set
         * @returns {proto.CancelPaymentRequestMessage} CancelPaymentRequestMessage instance
         */
        CancelPaymentRequestMessage.create = function create(properties) {
            return new CancelPaymentRequestMessage(properties);
        };

        /**
         * Encodes the specified CancelPaymentRequestMessage message. Does not implicitly {@link proto.CancelPaymentRequestMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {proto.ICancelPaymentRequestMessage} message CancelPaymentRequestMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CancelPaymentRequestMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                $root.proto.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CancelPaymentRequestMessage message, length delimited. Does not implicitly {@link proto.CancelPaymentRequestMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {proto.ICancelPaymentRequestMessage} message CancelPaymentRequestMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CancelPaymentRequestMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CancelPaymentRequestMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.CancelPaymentRequestMessage} CancelPaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CancelPaymentRequestMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.CancelPaymentRequestMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CancelPaymentRequestMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.CancelPaymentRequestMessage} CancelPaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CancelPaymentRequestMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CancelPaymentRequestMessage message.
         * @function verify
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CancelPaymentRequestMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key")) {
                var error = $root.proto.MessageKey.verify(message.key);
                if (error)
                    return "key." + error;
            }
            return null;
        };

        /**
         * Creates a CancelPaymentRequestMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.CancelPaymentRequestMessage} CancelPaymentRequestMessage
         */
        CancelPaymentRequestMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.CancelPaymentRequestMessage)
                return object;
            var message = new $root.proto.CancelPaymentRequestMessage();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".proto.CancelPaymentRequestMessage.key: object expected");
                message.key = $root.proto.MessageKey.fromObject(object.key);
            }
            return message;
        };

        /**
         * Creates a plain object from a CancelPaymentRequestMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.CancelPaymentRequestMessage
         * @static
         * @param {proto.CancelPaymentRequestMessage} message CancelPaymentRequestMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CancelPaymentRequestMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.key = null;
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.proto.MessageKey.toObject(message.key, options);
            return object;
        };

        /**
         * Converts this CancelPaymentRequestMessage to JSON.
         * @function toJSON
         * @memberof proto.CancelPaymentRequestMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CancelPaymentRequestMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CancelPaymentRequestMessage;
    })();

    proto.LiveLocationMessage = (function() {

        /**
         * Properties of a LiveLocationMessage.
         * @memberof proto
         * @interface ILiveLocationMessage
         * @property {number|null} [degreesLatitude] LiveLocationMessage degreesLatitude
         * @property {number|null} [degreesLongitude] LiveLocationMessage degreesLongitude
         * @property {number|null} [accuracyInMeters] LiveLocationMessage accuracyInMeters
         * @property {number|null} [speedInMps] LiveLocationMessage speedInMps
         * @property {number|null} [degreesClockwiseFromMagneticNorth] LiveLocationMessage degreesClockwiseFromMagneticNorth
         * @property {string|null} [caption] LiveLocationMessage caption
         * @property {number|Long|null} [sequenceNumber] LiveLocationMessage sequenceNumber
         * @property {number|null} [timeOffset] LiveLocationMessage timeOffset
         * @property {Uint8Array|null} [jpegThumbnail] LiveLocationMessage jpegThumbnail
         * @property {proto.IContextInfo|null} [contextInfo] LiveLocationMessage contextInfo
         */

        /**
         * Constructs a new LiveLocationMessage.
         * @memberof proto
         * @classdesc Represents a LiveLocationMessage.
         * @implements ILiveLocationMessage
         * @constructor
         * @param {proto.ILiveLocationMessage=} [properties] Properties to set
         */
        function LiveLocationMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LiveLocationMessage degreesLatitude.
         * @member {number} degreesLatitude
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.degreesLatitude = 0;

        /**
         * LiveLocationMessage degreesLongitude.
         * @member {number} degreesLongitude
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.degreesLongitude = 0;

        /**
         * LiveLocationMessage accuracyInMeters.
         * @member {number} accuracyInMeters
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.accuracyInMeters = 0;

        /**
         * LiveLocationMessage speedInMps.
         * @member {number} speedInMps
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.speedInMps = 0;

        /**
         * LiveLocationMessage degreesClockwiseFromMagneticNorth.
         * @member {number} degreesClockwiseFromMagneticNorth
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.degreesClockwiseFromMagneticNorth = 0;

        /**
         * LiveLocationMessage caption.
         * @member {string} caption
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.caption = "";

        /**
         * LiveLocationMessage sequenceNumber.
         * @member {number|Long} sequenceNumber
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.sequenceNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * LiveLocationMessage timeOffset.
         * @member {number} timeOffset
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.timeOffset = 0;

        /**
         * LiveLocationMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * LiveLocationMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.LiveLocationMessage
         * @instance
         */
        LiveLocationMessage.prototype.contextInfo = null;

        /**
         * Creates a new LiveLocationMessage instance using the specified properties.
         * @function create
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {proto.ILiveLocationMessage=} [properties] Properties to set
         * @returns {proto.LiveLocationMessage} LiveLocationMessage instance
         */
        LiveLocationMessage.create = function create(properties) {
            return new LiveLocationMessage(properties);
        };

        /**
         * Encodes the specified LiveLocationMessage message. Does not implicitly {@link proto.LiveLocationMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {proto.ILiveLocationMessage} message LiveLocationMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LiveLocationMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.degreesLatitude != null && Object.hasOwnProperty.call(message, "degreesLatitude"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.degreesLatitude);
            if (message.degreesLongitude != null && Object.hasOwnProperty.call(message, "degreesLongitude"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.degreesLongitude);
            if (message.accuracyInMeters != null && Object.hasOwnProperty.call(message, "accuracyInMeters"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.accuracyInMeters);
            if (message.speedInMps != null && Object.hasOwnProperty.call(message, "speedInMps"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.speedInMps);
            if (message.degreesClockwiseFromMagneticNorth != null && Object.hasOwnProperty.call(message, "degreesClockwiseFromMagneticNorth"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.degreesClockwiseFromMagneticNorth);
            if (message.caption != null && Object.hasOwnProperty.call(message, "caption"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.caption);
            if (message.sequenceNumber != null && Object.hasOwnProperty.call(message, "sequenceNumber"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.sequenceNumber);
            if (message.timeOffset != null && Object.hasOwnProperty.call(message, "timeOffset"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.timeOffset);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.jpegThumbnail);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LiveLocationMessage message, length delimited. Does not implicitly {@link proto.LiveLocationMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {proto.ILiveLocationMessage} message LiveLocationMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LiveLocationMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LiveLocationMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.LiveLocationMessage} LiveLocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LiveLocationMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.LiveLocationMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.degreesLatitude = reader.double();
                    break;
                case 2:
                    message.degreesLongitude = reader.double();
                    break;
                case 3:
                    message.accuracyInMeters = reader.uint32();
                    break;
                case 4:
                    message.speedInMps = reader.float();
                    break;
                case 5:
                    message.degreesClockwiseFromMagneticNorth = reader.uint32();
                    break;
                case 6:
                    message.caption = reader.string();
                    break;
                case 7:
                    message.sequenceNumber = reader.int64();
                    break;
                case 8:
                    message.timeOffset = reader.uint32();
                    break;
                case 16:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LiveLocationMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.LiveLocationMessage} LiveLocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LiveLocationMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LiveLocationMessage message.
         * @function verify
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LiveLocationMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                if (typeof message.degreesLatitude !== "number")
                    return "degreesLatitude: number expected";
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                if (typeof message.degreesLongitude !== "number")
                    return "degreesLongitude: number expected";
            if (message.accuracyInMeters != null && message.hasOwnProperty("accuracyInMeters"))
                if (!$util.isInteger(message.accuracyInMeters))
                    return "accuracyInMeters: integer expected";
            if (message.speedInMps != null && message.hasOwnProperty("speedInMps"))
                if (typeof message.speedInMps !== "number")
                    return "speedInMps: number expected";
            if (message.degreesClockwiseFromMagneticNorth != null && message.hasOwnProperty("degreesClockwiseFromMagneticNorth"))
                if (!$util.isInteger(message.degreesClockwiseFromMagneticNorth))
                    return "degreesClockwiseFromMagneticNorth: integer expected";
            if (message.caption != null && message.hasOwnProperty("caption"))
                if (!$util.isString(message.caption))
                    return "caption: string expected";
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (!$util.isInteger(message.sequenceNumber) && !(message.sequenceNumber && $util.isInteger(message.sequenceNumber.low) && $util.isInteger(message.sequenceNumber.high)))
                    return "sequenceNumber: integer|Long expected";
            if (message.timeOffset != null && message.hasOwnProperty("timeOffset"))
                if (!$util.isInteger(message.timeOffset))
                    return "timeOffset: integer expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a LiveLocationMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.LiveLocationMessage} LiveLocationMessage
         */
        LiveLocationMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.LiveLocationMessage)
                return object;
            var message = new $root.proto.LiveLocationMessage();
            if (object.degreesLatitude != null)
                message.degreesLatitude = Number(object.degreesLatitude);
            if (object.degreesLongitude != null)
                message.degreesLongitude = Number(object.degreesLongitude);
            if (object.accuracyInMeters != null)
                message.accuracyInMeters = object.accuracyInMeters >>> 0;
            if (object.speedInMps != null)
                message.speedInMps = Number(object.speedInMps);
            if (object.degreesClockwiseFromMagneticNorth != null)
                message.degreesClockwiseFromMagneticNorth = object.degreesClockwiseFromMagneticNorth >>> 0;
            if (object.caption != null)
                message.caption = String(object.caption);
            if (object.sequenceNumber != null)
                if ($util.Long)
                    (message.sequenceNumber = $util.Long.fromValue(object.sequenceNumber)).unsigned = false;
                else if (typeof object.sequenceNumber === "string")
                    message.sequenceNumber = parseInt(object.sequenceNumber, 10);
                else if (typeof object.sequenceNumber === "number")
                    message.sequenceNumber = object.sequenceNumber;
                else if (typeof object.sequenceNumber === "object")
                    message.sequenceNumber = new $util.LongBits(object.sequenceNumber.low >>> 0, object.sequenceNumber.high >>> 0).toNumber();
            if (object.timeOffset != null)
                message.timeOffset = object.timeOffset >>> 0;
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.LiveLocationMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a LiveLocationMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.LiveLocationMessage
         * @static
         * @param {proto.LiveLocationMessage} message LiveLocationMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LiveLocationMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.degreesLatitude = 0;
                object.degreesLongitude = 0;
                object.accuracyInMeters = 0;
                object.speedInMps = 0;
                object.degreesClockwiseFromMagneticNorth = 0;
                object.caption = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sequenceNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sequenceNumber = options.longs === String ? "0" : 0;
                object.timeOffset = 0;
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.contextInfo = null;
            }
            if (message.degreesLatitude != null && message.hasOwnProperty("degreesLatitude"))
                object.degreesLatitude = options.json && !isFinite(message.degreesLatitude) ? String(message.degreesLatitude) : message.degreesLatitude;
            if (message.degreesLongitude != null && message.hasOwnProperty("degreesLongitude"))
                object.degreesLongitude = options.json && !isFinite(message.degreesLongitude) ? String(message.degreesLongitude) : message.degreesLongitude;
            if (message.accuracyInMeters != null && message.hasOwnProperty("accuracyInMeters"))
                object.accuracyInMeters = message.accuracyInMeters;
            if (message.speedInMps != null && message.hasOwnProperty("speedInMps"))
                object.speedInMps = options.json && !isFinite(message.speedInMps) ? String(message.speedInMps) : message.speedInMps;
            if (message.degreesClockwiseFromMagneticNorth != null && message.hasOwnProperty("degreesClockwiseFromMagneticNorth"))
                object.degreesClockwiseFromMagneticNorth = message.degreesClockwiseFromMagneticNorth;
            if (message.caption != null && message.hasOwnProperty("caption"))
                object.caption = message.caption;
            if (message.sequenceNumber != null && message.hasOwnProperty("sequenceNumber"))
                if (typeof message.sequenceNumber === "number")
                    object.sequenceNumber = options.longs === String ? String(message.sequenceNumber) : message.sequenceNumber;
                else
                    object.sequenceNumber = options.longs === String ? $util.Long.prototype.toString.call(message.sequenceNumber) : options.longs === Number ? new $util.LongBits(message.sequenceNumber.low >>> 0, message.sequenceNumber.high >>> 0).toNumber() : message.sequenceNumber;
            if (message.timeOffset != null && message.hasOwnProperty("timeOffset"))
                object.timeOffset = message.timeOffset;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this LiveLocationMessage to JSON.
         * @function toJSON
         * @memberof proto.LiveLocationMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LiveLocationMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LiveLocationMessage;
    })();

    proto.StickerMessage = (function() {

        /**
         * Properties of a StickerMessage.
         * @memberof proto
         * @interface IStickerMessage
         * @property {string|null} [url] StickerMessage url
         * @property {Uint8Array|null} [fileSha256] StickerMessage fileSha256
         * @property {Uint8Array|null} [fileEncSha256] StickerMessage fileEncSha256
         * @property {Uint8Array|null} [mediaKey] StickerMessage mediaKey
         * @property {string|null} [mimetype] StickerMessage mimetype
         * @property {number|null} [height] StickerMessage height
         * @property {number|null} [width] StickerMessage width
         * @property {string|null} [directPath] StickerMessage directPath
         * @property {number|Long|null} [fileLength] StickerMessage fileLength
         * @property {number|Long|null} [mediaKeyTimestamp] StickerMessage mediaKeyTimestamp
         * @property {number|null} [firstFrameLength] StickerMessage firstFrameLength
         * @property {Uint8Array|null} [firstFrameSidecar] StickerMessage firstFrameSidecar
         * @property {proto.IContextInfo|null} [contextInfo] StickerMessage contextInfo
         */

        /**
         * Constructs a new StickerMessage.
         * @memberof proto
         * @classdesc Represents a StickerMessage.
         * @implements IStickerMessage
         * @constructor
         * @param {proto.IStickerMessage=} [properties] Properties to set
         */
        function StickerMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StickerMessage url.
         * @member {string} url
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.url = "";

        /**
         * StickerMessage fileSha256.
         * @member {Uint8Array} fileSha256
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.fileSha256 = $util.newBuffer([]);

        /**
         * StickerMessage fileEncSha256.
         * @member {Uint8Array} fileEncSha256
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.fileEncSha256 = $util.newBuffer([]);

        /**
         * StickerMessage mediaKey.
         * @member {Uint8Array} mediaKey
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.mediaKey = $util.newBuffer([]);

        /**
         * StickerMessage mimetype.
         * @member {string} mimetype
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.mimetype = "";

        /**
         * StickerMessage height.
         * @member {number} height
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.height = 0;

        /**
         * StickerMessage width.
         * @member {number} width
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.width = 0;

        /**
         * StickerMessage directPath.
         * @member {string} directPath
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.directPath = "";

        /**
         * StickerMessage fileLength.
         * @member {number|Long} fileLength
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * StickerMessage mediaKeyTimestamp.
         * @member {number|Long} mediaKeyTimestamp
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.mediaKeyTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * StickerMessage firstFrameLength.
         * @member {number} firstFrameLength
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.firstFrameLength = 0;

        /**
         * StickerMessage firstFrameSidecar.
         * @member {Uint8Array} firstFrameSidecar
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.firstFrameSidecar = $util.newBuffer([]);

        /**
         * StickerMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.StickerMessage
         * @instance
         */
        StickerMessage.prototype.contextInfo = null;

        /**
         * Creates a new StickerMessage instance using the specified properties.
         * @function create
         * @memberof proto.StickerMessage
         * @static
         * @param {proto.IStickerMessage=} [properties] Properties to set
         * @returns {proto.StickerMessage} StickerMessage instance
         */
        StickerMessage.create = function create(properties) {
            return new StickerMessage(properties);
        };

        /**
         * Encodes the specified StickerMessage message. Does not implicitly {@link proto.StickerMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.StickerMessage
         * @static
         * @param {proto.IStickerMessage} message StickerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StickerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.fileSha256 != null && Object.hasOwnProperty.call(message, "fileSha256"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.fileSha256);
            if (message.fileEncSha256 != null && Object.hasOwnProperty.call(message, "fileEncSha256"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.fileEncSha256);
            if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.mediaKey);
            if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.mimetype);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.height);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.width);
            if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.directPath);
            if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.fileLength);
            if (message.mediaKeyTimestamp != null && Object.hasOwnProperty.call(message, "mediaKeyTimestamp"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.mediaKeyTimestamp);
            if (message.firstFrameLength != null && Object.hasOwnProperty.call(message, "firstFrameLength"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.firstFrameLength);
            if (message.firstFrameSidecar != null && Object.hasOwnProperty.call(message, "firstFrameSidecar"))
                writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.firstFrameSidecar);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified StickerMessage message, length delimited. Does not implicitly {@link proto.StickerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.StickerMessage
         * @static
         * @param {proto.IStickerMessage} message StickerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StickerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StickerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.StickerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.StickerMessage} StickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StickerMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.StickerMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.fileSha256 = reader.bytes();
                    break;
                case 3:
                    message.fileEncSha256 = reader.bytes();
                    break;
                case 4:
                    message.mediaKey = reader.bytes();
                    break;
                case 5:
                    message.mimetype = reader.string();
                    break;
                case 6:
                    message.height = reader.uint32();
                    break;
                case 7:
                    message.width = reader.uint32();
                    break;
                case 8:
                    message.directPath = reader.string();
                    break;
                case 9:
                    message.fileLength = reader.uint64();
                    break;
                case 10:
                    message.mediaKeyTimestamp = reader.int64();
                    break;
                case 11:
                    message.firstFrameLength = reader.uint32();
                    break;
                case 12:
                    message.firstFrameSidecar = reader.bytes();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StickerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.StickerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.StickerMessage} StickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StickerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StickerMessage message.
         * @function verify
         * @memberof proto.StickerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StickerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                if (!(message.fileSha256 && typeof message.fileSha256.length === "number" || $util.isString(message.fileSha256)))
                    return "fileSha256: buffer expected";
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                if (!(message.fileEncSha256 && typeof message.fileEncSha256.length === "number" || $util.isString(message.fileEncSha256)))
                    return "fileEncSha256: buffer expected";
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                if (!(message.mediaKey && typeof message.mediaKey.length === "number" || $util.isString(message.mediaKey)))
                    return "mediaKey: buffer expected";
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                if (!$util.isString(message.mimetype))
                    return "mimetype: string expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                if (!$util.isString(message.directPath))
                    return "directPath: string expected";
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
                    return "fileLength: integer|Long expected";
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (!$util.isInteger(message.mediaKeyTimestamp) && !(message.mediaKeyTimestamp && $util.isInteger(message.mediaKeyTimestamp.low) && $util.isInteger(message.mediaKeyTimestamp.high)))
                    return "mediaKeyTimestamp: integer|Long expected";
            if (message.firstFrameLength != null && message.hasOwnProperty("firstFrameLength"))
                if (!$util.isInteger(message.firstFrameLength))
                    return "firstFrameLength: integer expected";
            if (message.firstFrameSidecar != null && message.hasOwnProperty("firstFrameSidecar"))
                if (!(message.firstFrameSidecar && typeof message.firstFrameSidecar.length === "number" || $util.isString(message.firstFrameSidecar)))
                    return "firstFrameSidecar: buffer expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a StickerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.StickerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.StickerMessage} StickerMessage
         */
        StickerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.StickerMessage)
                return object;
            var message = new $root.proto.StickerMessage();
            if (object.url != null)
                message.url = String(object.url);
            if (object.fileSha256 != null)
                if (typeof object.fileSha256 === "string")
                    $util.base64.decode(object.fileSha256, message.fileSha256 = $util.newBuffer($util.base64.length(object.fileSha256)), 0);
                else if (object.fileSha256.length)
                    message.fileSha256 = object.fileSha256;
            if (object.fileEncSha256 != null)
                if (typeof object.fileEncSha256 === "string")
                    $util.base64.decode(object.fileEncSha256, message.fileEncSha256 = $util.newBuffer($util.base64.length(object.fileEncSha256)), 0);
                else if (object.fileEncSha256.length)
                    message.fileEncSha256 = object.fileEncSha256;
            if (object.mediaKey != null)
                if (typeof object.mediaKey === "string")
                    $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                else if (object.mediaKey.length)
                    message.mediaKey = object.mediaKey;
            if (object.mimetype != null)
                message.mimetype = String(object.mimetype);
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.directPath != null)
                message.directPath = String(object.directPath);
            if (object.fileLength != null)
                if ($util.Long)
                    (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = true;
                else if (typeof object.fileLength === "string")
                    message.fileLength = parseInt(object.fileLength, 10);
                else if (typeof object.fileLength === "number")
                    message.fileLength = object.fileLength;
                else if (typeof object.fileLength === "object")
                    message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber(true);
            if (object.mediaKeyTimestamp != null)
                if ($util.Long)
                    (message.mediaKeyTimestamp = $util.Long.fromValue(object.mediaKeyTimestamp)).unsigned = false;
                else if (typeof object.mediaKeyTimestamp === "string")
                    message.mediaKeyTimestamp = parseInt(object.mediaKeyTimestamp, 10);
                else if (typeof object.mediaKeyTimestamp === "number")
                    message.mediaKeyTimestamp = object.mediaKeyTimestamp;
                else if (typeof object.mediaKeyTimestamp === "object")
                    message.mediaKeyTimestamp = new $util.LongBits(object.mediaKeyTimestamp.low >>> 0, object.mediaKeyTimestamp.high >>> 0).toNumber();
            if (object.firstFrameLength != null)
                message.firstFrameLength = object.firstFrameLength >>> 0;
            if (object.firstFrameSidecar != null)
                if (typeof object.firstFrameSidecar === "string")
                    $util.base64.decode(object.firstFrameSidecar, message.firstFrameSidecar = $util.newBuffer($util.base64.length(object.firstFrameSidecar)), 0);
                else if (object.firstFrameSidecar.length)
                    message.firstFrameSidecar = object.firstFrameSidecar;
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.StickerMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a StickerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.StickerMessage
         * @static
         * @param {proto.StickerMessage} message StickerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StickerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.url = "";
                if (options.bytes === String)
                    object.fileSha256 = "";
                else {
                    object.fileSha256 = [];
                    if (options.bytes !== Array)
                        object.fileSha256 = $util.newBuffer(object.fileSha256);
                }
                if (options.bytes === String)
                    object.fileEncSha256 = "";
                else {
                    object.fileEncSha256 = [];
                    if (options.bytes !== Array)
                        object.fileEncSha256 = $util.newBuffer(object.fileEncSha256);
                }
                if (options.bytes === String)
                    object.mediaKey = "";
                else {
                    object.mediaKey = [];
                    if (options.bytes !== Array)
                        object.mediaKey = $util.newBuffer(object.mediaKey);
                }
                object.mimetype = "";
                object.height = 0;
                object.width = 0;
                object.directPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fileLength = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mediaKeyTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mediaKeyTimestamp = options.longs === String ? "0" : 0;
                object.firstFrameLength = 0;
                if (options.bytes === String)
                    object.firstFrameSidecar = "";
                else {
                    object.firstFrameSidecar = [];
                    if (options.bytes !== Array)
                        object.firstFrameSidecar = $util.newBuffer(object.firstFrameSidecar);
                }
                object.contextInfo = null;
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.fileSha256 != null && message.hasOwnProperty("fileSha256"))
                object.fileSha256 = options.bytes === String ? $util.base64.encode(message.fileSha256, 0, message.fileSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileSha256) : message.fileSha256;
            if (message.fileEncSha256 != null && message.hasOwnProperty("fileEncSha256"))
                object.fileEncSha256 = options.bytes === String ? $util.base64.encode(message.fileEncSha256, 0, message.fileEncSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSha256) : message.fileEncSha256;
            if (message.mediaKey != null && message.hasOwnProperty("mediaKey"))
                object.mediaKey = options.bytes === String ? $util.base64.encode(message.mediaKey, 0, message.mediaKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaKey) : message.mediaKey;
            if (message.mimetype != null && message.hasOwnProperty("mimetype"))
                object.mimetype = message.mimetype;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.directPath != null && message.hasOwnProperty("directPath"))
                object.directPath = message.directPath;
            if (message.fileLength != null && message.hasOwnProperty("fileLength"))
                if (typeof message.fileLength === "number")
                    object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
                else
                    object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber(true) : message.fileLength;
            if (message.mediaKeyTimestamp != null && message.hasOwnProperty("mediaKeyTimestamp"))
                if (typeof message.mediaKeyTimestamp === "number")
                    object.mediaKeyTimestamp = options.longs === String ? String(message.mediaKeyTimestamp) : message.mediaKeyTimestamp;
                else
                    object.mediaKeyTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.mediaKeyTimestamp) : options.longs === Number ? new $util.LongBits(message.mediaKeyTimestamp.low >>> 0, message.mediaKeyTimestamp.high >>> 0).toNumber() : message.mediaKeyTimestamp;
            if (message.firstFrameLength != null && message.hasOwnProperty("firstFrameLength"))
                object.firstFrameLength = message.firstFrameLength;
            if (message.firstFrameSidecar != null && message.hasOwnProperty("firstFrameSidecar"))
                object.firstFrameSidecar = options.bytes === String ? $util.base64.encode(message.firstFrameSidecar, 0, message.firstFrameSidecar.length) : options.bytes === Array ? Array.prototype.slice.call(message.firstFrameSidecar) : message.firstFrameSidecar;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this StickerMessage to JSON.
         * @function toJSON
         * @memberof proto.StickerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StickerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StickerMessage;
    })();

    proto.FourRowTemplate = (function() {

        /**
         * Properties of a FourRowTemplate.
         * @memberof proto
         * @interface IFourRowTemplate
         * @property {proto.IHighlyStructuredMessage|null} [content] FourRowTemplate content
         * @property {proto.IHighlyStructuredMessage|null} [footer] FourRowTemplate footer
         * @property {Array.<proto.ITemplateButton>|null} [buttons] FourRowTemplate buttons
         * @property {proto.IDocumentMessage|null} [documentMessage] FourRowTemplate documentMessage
         * @property {proto.IHighlyStructuredMessage|null} [highlyStructuredMessage] FourRowTemplate highlyStructuredMessage
         * @property {proto.IImageMessage|null} [imageMessage] FourRowTemplate imageMessage
         * @property {proto.IVideoMessage|null} [videoMessage] FourRowTemplate videoMessage
         * @property {proto.ILocationMessage|null} [locationMessage] FourRowTemplate locationMessage
         */

        /**
         * Constructs a new FourRowTemplate.
         * @memberof proto
         * @classdesc Represents a FourRowTemplate.
         * @implements IFourRowTemplate
         * @constructor
         * @param {proto.IFourRowTemplate=} [properties] Properties to set
         */
        function FourRowTemplate(properties) {
            this.buttons = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FourRowTemplate content.
         * @member {proto.IHighlyStructuredMessage|null|undefined} content
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.content = null;

        /**
         * FourRowTemplate footer.
         * @member {proto.IHighlyStructuredMessage|null|undefined} footer
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.footer = null;

        /**
         * FourRowTemplate buttons.
         * @member {Array.<proto.ITemplateButton>} buttons
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.buttons = $util.emptyArray;

        /**
         * FourRowTemplate documentMessage.
         * @member {proto.IDocumentMessage|null|undefined} documentMessage
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.documentMessage = null;

        /**
         * FourRowTemplate highlyStructuredMessage.
         * @member {proto.IHighlyStructuredMessage|null|undefined} highlyStructuredMessage
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.highlyStructuredMessage = null;

        /**
         * FourRowTemplate imageMessage.
         * @member {proto.IImageMessage|null|undefined} imageMessage
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.imageMessage = null;

        /**
         * FourRowTemplate videoMessage.
         * @member {proto.IVideoMessage|null|undefined} videoMessage
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.videoMessage = null;

        /**
         * FourRowTemplate locationMessage.
         * @member {proto.ILocationMessage|null|undefined} locationMessage
         * @memberof proto.FourRowTemplate
         * @instance
         */
        FourRowTemplate.prototype.locationMessage = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * FourRowTemplate title.
         * @member {"documentMessage"|"highlyStructuredMessage"|"imageMessage"|"videoMessage"|"locationMessage"|undefined} title
         * @memberof proto.FourRowTemplate
         * @instance
         */
        Object.defineProperty(FourRowTemplate.prototype, "title", {
            get: $util.oneOfGetter($oneOfFields = ["documentMessage", "highlyStructuredMessage", "imageMessage", "videoMessage", "locationMessage"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new FourRowTemplate instance using the specified properties.
         * @function create
         * @memberof proto.FourRowTemplate
         * @static
         * @param {proto.IFourRowTemplate=} [properties] Properties to set
         * @returns {proto.FourRowTemplate} FourRowTemplate instance
         */
        FourRowTemplate.create = function create(properties) {
            return new FourRowTemplate(properties);
        };

        /**
         * Encodes the specified FourRowTemplate message. Does not implicitly {@link proto.FourRowTemplate.verify|verify} messages.
         * @function encode
         * @memberof proto.FourRowTemplate
         * @static
         * @param {proto.IFourRowTemplate} message FourRowTemplate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FourRowTemplate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.documentMessage != null && Object.hasOwnProperty.call(message, "documentMessage"))
                $root.proto.DocumentMessage.encode(message.documentMessage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.highlyStructuredMessage != null && Object.hasOwnProperty.call(message, "highlyStructuredMessage"))
                $root.proto.HighlyStructuredMessage.encode(message.highlyStructuredMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.imageMessage != null && Object.hasOwnProperty.call(message, "imageMessage"))
                $root.proto.ImageMessage.encode(message.imageMessage, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.videoMessage != null && Object.hasOwnProperty.call(message, "videoMessage"))
                $root.proto.VideoMessage.encode(message.videoMessage, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.locationMessage != null && Object.hasOwnProperty.call(message, "locationMessage"))
                $root.proto.LocationMessage.encode(message.locationMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                $root.proto.HighlyStructuredMessage.encode(message.content, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.footer != null && Object.hasOwnProperty.call(message, "footer"))
                $root.proto.HighlyStructuredMessage.encode(message.footer, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.buttons != null && message.buttons.length)
                for (var i = 0; i < message.buttons.length; ++i)
                    $root.proto.TemplateButton.encode(message.buttons[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FourRowTemplate message, length delimited. Does not implicitly {@link proto.FourRowTemplate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.FourRowTemplate
         * @static
         * @param {proto.IFourRowTemplate} message FourRowTemplate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FourRowTemplate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FourRowTemplate message from the specified reader or buffer.
         * @function decode
         * @memberof proto.FourRowTemplate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.FourRowTemplate} FourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FourRowTemplate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.FourRowTemplate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 6:
                    message.content = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.footer = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 8:
                    if (!(message.buttons && message.buttons.length))
                        message.buttons = [];
                    message.buttons.push($root.proto.TemplateButton.decode(reader, reader.uint32()));
                    break;
                case 1:
                    message.documentMessage = $root.proto.DocumentMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.imageMessage = $root.proto.ImageMessage.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.videoMessage = $root.proto.VideoMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.locationMessage = $root.proto.LocationMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FourRowTemplate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.FourRowTemplate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.FourRowTemplate} FourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FourRowTemplate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FourRowTemplate message.
         * @function verify
         * @memberof proto.FourRowTemplate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FourRowTemplate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.content != null && message.hasOwnProperty("content")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.content);
                if (error)
                    return "content." + error;
            }
            if (message.footer != null && message.hasOwnProperty("footer")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.footer);
                if (error)
                    return "footer." + error;
            }
            if (message.buttons != null && message.hasOwnProperty("buttons")) {
                if (!Array.isArray(message.buttons))
                    return "buttons: array expected";
                for (var i = 0; i < message.buttons.length; ++i) {
                    var error = $root.proto.TemplateButton.verify(message.buttons[i]);
                    if (error)
                        return "buttons." + error;
                }
            }
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage")) {
                properties.title = 1;
                {
                    var error = $root.proto.DocumentMessage.verify(message.documentMessage);
                    if (error)
                        return "documentMessage." + error;
                }
            }
            if (message.highlyStructuredMessage != null && message.hasOwnProperty("highlyStructuredMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.HighlyStructuredMessage.verify(message.highlyStructuredMessage);
                    if (error)
                        return "highlyStructuredMessage." + error;
                }
            }
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.ImageMessage.verify(message.imageMessage);
                    if (error)
                        return "imageMessage." + error;
                }
            }
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.VideoMessage.verify(message.videoMessage);
                    if (error)
                        return "videoMessage." + error;
                }
            }
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.LocationMessage.verify(message.locationMessage);
                    if (error)
                        return "locationMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FourRowTemplate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.FourRowTemplate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.FourRowTemplate} FourRowTemplate
         */
        FourRowTemplate.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.FourRowTemplate)
                return object;
            var message = new $root.proto.FourRowTemplate();
            if (object.content != null) {
                if (typeof object.content !== "object")
                    throw TypeError(".proto.FourRowTemplate.content: object expected");
                message.content = $root.proto.HighlyStructuredMessage.fromObject(object.content);
            }
            if (object.footer != null) {
                if (typeof object.footer !== "object")
                    throw TypeError(".proto.FourRowTemplate.footer: object expected");
                message.footer = $root.proto.HighlyStructuredMessage.fromObject(object.footer);
            }
            if (object.buttons) {
                if (!Array.isArray(object.buttons))
                    throw TypeError(".proto.FourRowTemplate.buttons: array expected");
                message.buttons = [];
                for (var i = 0; i < object.buttons.length; ++i) {
                    if (typeof object.buttons[i] !== "object")
                        throw TypeError(".proto.FourRowTemplate.buttons: object expected");
                    message.buttons[i] = $root.proto.TemplateButton.fromObject(object.buttons[i]);
                }
            }
            if (object.documentMessage != null) {
                if (typeof object.documentMessage !== "object")
                    throw TypeError(".proto.FourRowTemplate.documentMessage: object expected");
                message.documentMessage = $root.proto.DocumentMessage.fromObject(object.documentMessage);
            }
            if (object.highlyStructuredMessage != null) {
                if (typeof object.highlyStructuredMessage !== "object")
                    throw TypeError(".proto.FourRowTemplate.highlyStructuredMessage: object expected");
                message.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.fromObject(object.highlyStructuredMessage);
            }
            if (object.imageMessage != null) {
                if (typeof object.imageMessage !== "object")
                    throw TypeError(".proto.FourRowTemplate.imageMessage: object expected");
                message.imageMessage = $root.proto.ImageMessage.fromObject(object.imageMessage);
            }
            if (object.videoMessage != null) {
                if (typeof object.videoMessage !== "object")
                    throw TypeError(".proto.FourRowTemplate.videoMessage: object expected");
                message.videoMessage = $root.proto.VideoMessage.fromObject(object.videoMessage);
            }
            if (object.locationMessage != null) {
                if (typeof object.locationMessage !== "object")
                    throw TypeError(".proto.FourRowTemplate.locationMessage: object expected");
                message.locationMessage = $root.proto.LocationMessage.fromObject(object.locationMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a FourRowTemplate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.FourRowTemplate
         * @static
         * @param {proto.FourRowTemplate} message FourRowTemplate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FourRowTemplate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.buttons = [];
            if (options.defaults) {
                object.content = null;
                object.footer = null;
            }
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage")) {
                object.documentMessage = $root.proto.DocumentMessage.toObject(message.documentMessage, options);
                if (options.oneofs)
                    object.title = "documentMessage";
            }
            if (message.highlyStructuredMessage != null && message.hasOwnProperty("highlyStructuredMessage")) {
                object.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.toObject(message.highlyStructuredMessage, options);
                if (options.oneofs)
                    object.title = "highlyStructuredMessage";
            }
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage")) {
                object.imageMessage = $root.proto.ImageMessage.toObject(message.imageMessage, options);
                if (options.oneofs)
                    object.title = "imageMessage";
            }
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage")) {
                object.videoMessage = $root.proto.VideoMessage.toObject(message.videoMessage, options);
                if (options.oneofs)
                    object.title = "videoMessage";
            }
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage")) {
                object.locationMessage = $root.proto.LocationMessage.toObject(message.locationMessage, options);
                if (options.oneofs)
                    object.title = "locationMessage";
            }
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = $root.proto.HighlyStructuredMessage.toObject(message.content, options);
            if (message.footer != null && message.hasOwnProperty("footer"))
                object.footer = $root.proto.HighlyStructuredMessage.toObject(message.footer, options);
            if (message.buttons && message.buttons.length) {
                object.buttons = [];
                for (var j = 0; j < message.buttons.length; ++j)
                    object.buttons[j] = $root.proto.TemplateButton.toObject(message.buttons[j], options);
            }
            return object;
        };

        /**
         * Converts this FourRowTemplate to JSON.
         * @function toJSON
         * @memberof proto.FourRowTemplate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FourRowTemplate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FourRowTemplate;
    })();

    proto.HydratedFourRowTemplate = (function() {

        /**
         * Properties of a HydratedFourRowTemplate.
         * @memberof proto
         * @interface IHydratedFourRowTemplate
         * @property {string|null} [hydratedContentText] HydratedFourRowTemplate hydratedContentText
         * @property {string|null} [hydratedFooterText] HydratedFourRowTemplate hydratedFooterText
         * @property {Array.<proto.IHydratedTemplateButton>|null} [hydratedButtons] HydratedFourRowTemplate hydratedButtons
         * @property {string|null} [templateId] HydratedFourRowTemplate templateId
         * @property {proto.IDocumentMessage|null} [documentMessage] HydratedFourRowTemplate documentMessage
         * @property {string|null} [hydratedTitleText] HydratedFourRowTemplate hydratedTitleText
         * @property {proto.IImageMessage|null} [imageMessage] HydratedFourRowTemplate imageMessage
         * @property {proto.IVideoMessage|null} [videoMessage] HydratedFourRowTemplate videoMessage
         * @property {proto.ILocationMessage|null} [locationMessage] HydratedFourRowTemplate locationMessage
         */

        /**
         * Constructs a new HydratedFourRowTemplate.
         * @memberof proto
         * @classdesc Represents a HydratedFourRowTemplate.
         * @implements IHydratedFourRowTemplate
         * @constructor
         * @param {proto.IHydratedFourRowTemplate=} [properties] Properties to set
         */
        function HydratedFourRowTemplate(properties) {
            this.hydratedButtons = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HydratedFourRowTemplate hydratedContentText.
         * @member {string} hydratedContentText
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.hydratedContentText = "";

        /**
         * HydratedFourRowTemplate hydratedFooterText.
         * @member {string} hydratedFooterText
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.hydratedFooterText = "";

        /**
         * HydratedFourRowTemplate hydratedButtons.
         * @member {Array.<proto.IHydratedTemplateButton>} hydratedButtons
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.hydratedButtons = $util.emptyArray;

        /**
         * HydratedFourRowTemplate templateId.
         * @member {string} templateId
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.templateId = "";

        /**
         * HydratedFourRowTemplate documentMessage.
         * @member {proto.IDocumentMessage|null|undefined} documentMessage
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.documentMessage = null;

        /**
         * HydratedFourRowTemplate hydratedTitleText.
         * @member {string} hydratedTitleText
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.hydratedTitleText = "";

        /**
         * HydratedFourRowTemplate imageMessage.
         * @member {proto.IImageMessage|null|undefined} imageMessage
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.imageMessage = null;

        /**
         * HydratedFourRowTemplate videoMessage.
         * @member {proto.IVideoMessage|null|undefined} videoMessage
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.videoMessage = null;

        /**
         * HydratedFourRowTemplate locationMessage.
         * @member {proto.ILocationMessage|null|undefined} locationMessage
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        HydratedFourRowTemplate.prototype.locationMessage = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * HydratedFourRowTemplate title.
         * @member {"documentMessage"|"hydratedTitleText"|"imageMessage"|"videoMessage"|"locationMessage"|undefined} title
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         */
        Object.defineProperty(HydratedFourRowTemplate.prototype, "title", {
            get: $util.oneOfGetter($oneOfFields = ["documentMessage", "hydratedTitleText", "imageMessage", "videoMessage", "locationMessage"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new HydratedFourRowTemplate instance using the specified properties.
         * @function create
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {proto.IHydratedFourRowTemplate=} [properties] Properties to set
         * @returns {proto.HydratedFourRowTemplate} HydratedFourRowTemplate instance
         */
        HydratedFourRowTemplate.create = function create(properties) {
            return new HydratedFourRowTemplate(properties);
        };

        /**
         * Encodes the specified HydratedFourRowTemplate message. Does not implicitly {@link proto.HydratedFourRowTemplate.verify|verify} messages.
         * @function encode
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {proto.IHydratedFourRowTemplate} message HydratedFourRowTemplate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedFourRowTemplate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.documentMessage != null && Object.hasOwnProperty.call(message, "documentMessage"))
                $root.proto.DocumentMessage.encode(message.documentMessage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.hydratedTitleText != null && Object.hasOwnProperty.call(message, "hydratedTitleText"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.hydratedTitleText);
            if (message.imageMessage != null && Object.hasOwnProperty.call(message, "imageMessage"))
                $root.proto.ImageMessage.encode(message.imageMessage, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.videoMessage != null && Object.hasOwnProperty.call(message, "videoMessage"))
                $root.proto.VideoMessage.encode(message.videoMessage, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.locationMessage != null && Object.hasOwnProperty.call(message, "locationMessage"))
                $root.proto.LocationMessage.encode(message.locationMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.hydratedContentText != null && Object.hasOwnProperty.call(message, "hydratedContentText"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.hydratedContentText);
            if (message.hydratedFooterText != null && Object.hasOwnProperty.call(message, "hydratedFooterText"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.hydratedFooterText);
            if (message.hydratedButtons != null && message.hydratedButtons.length)
                for (var i = 0; i < message.hydratedButtons.length; ++i)
                    $root.proto.HydratedTemplateButton.encode(message.hydratedButtons[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.templateId != null && Object.hasOwnProperty.call(message, "templateId"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.templateId);
            return writer;
        };

        /**
         * Encodes the specified HydratedFourRowTemplate message, length delimited. Does not implicitly {@link proto.HydratedFourRowTemplate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {proto.IHydratedFourRowTemplate} message HydratedFourRowTemplate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HydratedFourRowTemplate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HydratedFourRowTemplate message from the specified reader or buffer.
         * @function decode
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.HydratedFourRowTemplate} HydratedFourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedFourRowTemplate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.HydratedFourRowTemplate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 6:
                    message.hydratedContentText = reader.string();
                    break;
                case 7:
                    message.hydratedFooterText = reader.string();
                    break;
                case 8:
                    if (!(message.hydratedButtons && message.hydratedButtons.length))
                        message.hydratedButtons = [];
                    message.hydratedButtons.push($root.proto.HydratedTemplateButton.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.templateId = reader.string();
                    break;
                case 1:
                    message.documentMessage = $root.proto.DocumentMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.hydratedTitleText = reader.string();
                    break;
                case 3:
                    message.imageMessage = $root.proto.ImageMessage.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.videoMessage = $root.proto.VideoMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.locationMessage = $root.proto.LocationMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HydratedFourRowTemplate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.HydratedFourRowTemplate} HydratedFourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HydratedFourRowTemplate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HydratedFourRowTemplate message.
         * @function verify
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HydratedFourRowTemplate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.hydratedContentText != null && message.hasOwnProperty("hydratedContentText"))
                if (!$util.isString(message.hydratedContentText))
                    return "hydratedContentText: string expected";
            if (message.hydratedFooterText != null && message.hasOwnProperty("hydratedFooterText"))
                if (!$util.isString(message.hydratedFooterText))
                    return "hydratedFooterText: string expected";
            if (message.hydratedButtons != null && message.hasOwnProperty("hydratedButtons")) {
                if (!Array.isArray(message.hydratedButtons))
                    return "hydratedButtons: array expected";
                for (var i = 0; i < message.hydratedButtons.length; ++i) {
                    var error = $root.proto.HydratedTemplateButton.verify(message.hydratedButtons[i]);
                    if (error)
                        return "hydratedButtons." + error;
                }
            }
            if (message.templateId != null && message.hasOwnProperty("templateId"))
                if (!$util.isString(message.templateId))
                    return "templateId: string expected";
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage")) {
                properties.title = 1;
                {
                    var error = $root.proto.DocumentMessage.verify(message.documentMessage);
                    if (error)
                        return "documentMessage." + error;
                }
            }
            if (message.hydratedTitleText != null && message.hasOwnProperty("hydratedTitleText")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                if (!$util.isString(message.hydratedTitleText))
                    return "hydratedTitleText: string expected";
            }
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.ImageMessage.verify(message.imageMessage);
                    if (error)
                        return "imageMessage." + error;
                }
            }
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.VideoMessage.verify(message.videoMessage);
                    if (error)
                        return "videoMessage." + error;
                }
            }
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage")) {
                if (properties.title === 1)
                    return "title: multiple values";
                properties.title = 1;
                {
                    var error = $root.proto.LocationMessage.verify(message.locationMessage);
                    if (error)
                        return "locationMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a HydratedFourRowTemplate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.HydratedFourRowTemplate} HydratedFourRowTemplate
         */
        HydratedFourRowTemplate.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.HydratedFourRowTemplate)
                return object;
            var message = new $root.proto.HydratedFourRowTemplate();
            if (object.hydratedContentText != null)
                message.hydratedContentText = String(object.hydratedContentText);
            if (object.hydratedFooterText != null)
                message.hydratedFooterText = String(object.hydratedFooterText);
            if (object.hydratedButtons) {
                if (!Array.isArray(object.hydratedButtons))
                    throw TypeError(".proto.HydratedFourRowTemplate.hydratedButtons: array expected");
                message.hydratedButtons = [];
                for (var i = 0; i < object.hydratedButtons.length; ++i) {
                    if (typeof object.hydratedButtons[i] !== "object")
                        throw TypeError(".proto.HydratedFourRowTemplate.hydratedButtons: object expected");
                    message.hydratedButtons[i] = $root.proto.HydratedTemplateButton.fromObject(object.hydratedButtons[i]);
                }
            }
            if (object.templateId != null)
                message.templateId = String(object.templateId);
            if (object.documentMessage != null) {
                if (typeof object.documentMessage !== "object")
                    throw TypeError(".proto.HydratedFourRowTemplate.documentMessage: object expected");
                message.documentMessage = $root.proto.DocumentMessage.fromObject(object.documentMessage);
            }
            if (object.hydratedTitleText != null)
                message.hydratedTitleText = String(object.hydratedTitleText);
            if (object.imageMessage != null) {
                if (typeof object.imageMessage !== "object")
                    throw TypeError(".proto.HydratedFourRowTemplate.imageMessage: object expected");
                message.imageMessage = $root.proto.ImageMessage.fromObject(object.imageMessage);
            }
            if (object.videoMessage != null) {
                if (typeof object.videoMessage !== "object")
                    throw TypeError(".proto.HydratedFourRowTemplate.videoMessage: object expected");
                message.videoMessage = $root.proto.VideoMessage.fromObject(object.videoMessage);
            }
            if (object.locationMessage != null) {
                if (typeof object.locationMessage !== "object")
                    throw TypeError(".proto.HydratedFourRowTemplate.locationMessage: object expected");
                message.locationMessage = $root.proto.LocationMessage.fromObject(object.locationMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a HydratedFourRowTemplate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.HydratedFourRowTemplate
         * @static
         * @param {proto.HydratedFourRowTemplate} message HydratedFourRowTemplate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HydratedFourRowTemplate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.hydratedButtons = [];
            if (options.defaults) {
                object.hydratedContentText = "";
                object.hydratedFooterText = "";
                object.templateId = "";
            }
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage")) {
                object.documentMessage = $root.proto.DocumentMessage.toObject(message.documentMessage, options);
                if (options.oneofs)
                    object.title = "documentMessage";
            }
            if (message.hydratedTitleText != null && message.hasOwnProperty("hydratedTitleText")) {
                object.hydratedTitleText = message.hydratedTitleText;
                if (options.oneofs)
                    object.title = "hydratedTitleText";
            }
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage")) {
                object.imageMessage = $root.proto.ImageMessage.toObject(message.imageMessage, options);
                if (options.oneofs)
                    object.title = "imageMessage";
            }
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage")) {
                object.videoMessage = $root.proto.VideoMessage.toObject(message.videoMessage, options);
                if (options.oneofs)
                    object.title = "videoMessage";
            }
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage")) {
                object.locationMessage = $root.proto.LocationMessage.toObject(message.locationMessage, options);
                if (options.oneofs)
                    object.title = "locationMessage";
            }
            if (message.hydratedContentText != null && message.hasOwnProperty("hydratedContentText"))
                object.hydratedContentText = message.hydratedContentText;
            if (message.hydratedFooterText != null && message.hasOwnProperty("hydratedFooterText"))
                object.hydratedFooterText = message.hydratedFooterText;
            if (message.hydratedButtons && message.hydratedButtons.length) {
                object.hydratedButtons = [];
                for (var j = 0; j < message.hydratedButtons.length; ++j)
                    object.hydratedButtons[j] = $root.proto.HydratedTemplateButton.toObject(message.hydratedButtons[j], options);
            }
            if (message.templateId != null && message.hasOwnProperty("templateId"))
                object.templateId = message.templateId;
            return object;
        };

        /**
         * Converts this HydratedFourRowTemplate to JSON.
         * @function toJSON
         * @memberof proto.HydratedFourRowTemplate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HydratedFourRowTemplate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HydratedFourRowTemplate;
    })();

    proto.TemplateMessage = (function() {

        /**
         * Properties of a TemplateMessage.
         * @memberof proto
         * @interface ITemplateMessage
         * @property {proto.IContextInfo|null} [contextInfo] TemplateMessage contextInfo
         * @property {proto.IHydratedFourRowTemplate|null} [hydratedTemplate] TemplateMessage hydratedTemplate
         * @property {proto.IFourRowTemplate|null} [fourRowTemplate] TemplateMessage fourRowTemplate
         * @property {proto.IHydratedFourRowTemplate|null} [hydratedFourRowTemplate] TemplateMessage hydratedFourRowTemplate
         */

        /**
         * Constructs a new TemplateMessage.
         * @memberof proto
         * @classdesc Represents a TemplateMessage.
         * @implements ITemplateMessage
         * @constructor
         * @param {proto.ITemplateMessage=} [properties] Properties to set
         */
        function TemplateMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TemplateMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.TemplateMessage
         * @instance
         */
        TemplateMessage.prototype.contextInfo = null;

        /**
         * TemplateMessage hydratedTemplate.
         * @member {proto.IHydratedFourRowTemplate|null|undefined} hydratedTemplate
         * @memberof proto.TemplateMessage
         * @instance
         */
        TemplateMessage.prototype.hydratedTemplate = null;

        /**
         * TemplateMessage fourRowTemplate.
         * @member {proto.IFourRowTemplate|null|undefined} fourRowTemplate
         * @memberof proto.TemplateMessage
         * @instance
         */
        TemplateMessage.prototype.fourRowTemplate = null;

        /**
         * TemplateMessage hydratedFourRowTemplate.
         * @member {proto.IHydratedFourRowTemplate|null|undefined} hydratedFourRowTemplate
         * @memberof proto.TemplateMessage
         * @instance
         */
        TemplateMessage.prototype.hydratedFourRowTemplate = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * TemplateMessage format.
         * @member {"fourRowTemplate"|"hydratedFourRowTemplate"|undefined} format
         * @memberof proto.TemplateMessage
         * @instance
         */
        Object.defineProperty(TemplateMessage.prototype, "format", {
            get: $util.oneOfGetter($oneOfFields = ["fourRowTemplate", "hydratedFourRowTemplate"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new TemplateMessage instance using the specified properties.
         * @function create
         * @memberof proto.TemplateMessage
         * @static
         * @param {proto.ITemplateMessage=} [properties] Properties to set
         * @returns {proto.TemplateMessage} TemplateMessage instance
         */
        TemplateMessage.create = function create(properties) {
            return new TemplateMessage(properties);
        };

        /**
         * Encodes the specified TemplateMessage message. Does not implicitly {@link proto.TemplateMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.TemplateMessage
         * @static
         * @param {proto.ITemplateMessage} message TemplateMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fourRowTemplate != null && Object.hasOwnProperty.call(message, "fourRowTemplate"))
                $root.proto.FourRowTemplate.encode(message.fourRowTemplate, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.hydratedFourRowTemplate != null && Object.hasOwnProperty.call(message, "hydratedFourRowTemplate"))
                $root.proto.HydratedFourRowTemplate.encode(message.hydratedFourRowTemplate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.hydratedTemplate != null && Object.hasOwnProperty.call(message, "hydratedTemplate"))
                $root.proto.HydratedFourRowTemplate.encode(message.hydratedTemplate, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TemplateMessage message, length delimited. Does not implicitly {@link proto.TemplateMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.TemplateMessage
         * @static
         * @param {proto.ITemplateMessage} message TemplateMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TemplateMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.TemplateMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.TemplateMessage} TemplateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.TemplateMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 3:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.hydratedTemplate = $root.proto.HydratedFourRowTemplate.decode(reader, reader.uint32());
                    break;
                case 1:
                    message.fourRowTemplate = $root.proto.FourRowTemplate.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.hydratedFourRowTemplate = $root.proto.HydratedFourRowTemplate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TemplateMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.TemplateMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.TemplateMessage} TemplateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TemplateMessage message.
         * @function verify
         * @memberof proto.TemplateMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TemplateMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.hydratedTemplate != null && message.hasOwnProperty("hydratedTemplate")) {
                var error = $root.proto.HydratedFourRowTemplate.verify(message.hydratedTemplate);
                if (error)
                    return "hydratedTemplate." + error;
            }
            if (message.fourRowTemplate != null && message.hasOwnProperty("fourRowTemplate")) {
                properties.format = 1;
                {
                    var error = $root.proto.FourRowTemplate.verify(message.fourRowTemplate);
                    if (error)
                        return "fourRowTemplate." + error;
                }
            }
            if (message.hydratedFourRowTemplate != null && message.hasOwnProperty("hydratedFourRowTemplate")) {
                if (properties.format === 1)
                    return "format: multiple values";
                properties.format = 1;
                {
                    var error = $root.proto.HydratedFourRowTemplate.verify(message.hydratedFourRowTemplate);
                    if (error)
                        return "hydratedFourRowTemplate." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TemplateMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.TemplateMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.TemplateMessage} TemplateMessage
         */
        TemplateMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.TemplateMessage)
                return object;
            var message = new $root.proto.TemplateMessage();
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.TemplateMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.hydratedTemplate != null) {
                if (typeof object.hydratedTemplate !== "object")
                    throw TypeError(".proto.TemplateMessage.hydratedTemplate: object expected");
                message.hydratedTemplate = $root.proto.HydratedFourRowTemplate.fromObject(object.hydratedTemplate);
            }
            if (object.fourRowTemplate != null) {
                if (typeof object.fourRowTemplate !== "object")
                    throw TypeError(".proto.TemplateMessage.fourRowTemplate: object expected");
                message.fourRowTemplate = $root.proto.FourRowTemplate.fromObject(object.fourRowTemplate);
            }
            if (object.hydratedFourRowTemplate != null) {
                if (typeof object.hydratedFourRowTemplate !== "object")
                    throw TypeError(".proto.TemplateMessage.hydratedFourRowTemplate: object expected");
                message.hydratedFourRowTemplate = $root.proto.HydratedFourRowTemplate.fromObject(object.hydratedFourRowTemplate);
            }
            return message;
        };

        /**
         * Creates a plain object from a TemplateMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.TemplateMessage
         * @static
         * @param {proto.TemplateMessage} message TemplateMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TemplateMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.contextInfo = null;
                object.hydratedTemplate = null;
            }
            if (message.fourRowTemplate != null && message.hasOwnProperty("fourRowTemplate")) {
                object.fourRowTemplate = $root.proto.FourRowTemplate.toObject(message.fourRowTemplate, options);
                if (options.oneofs)
                    object.format = "fourRowTemplate";
            }
            if (message.hydratedFourRowTemplate != null && message.hasOwnProperty("hydratedFourRowTemplate")) {
                object.hydratedFourRowTemplate = $root.proto.HydratedFourRowTemplate.toObject(message.hydratedFourRowTemplate, options);
                if (options.oneofs)
                    object.format = "hydratedFourRowTemplate";
            }
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.hydratedTemplate != null && message.hasOwnProperty("hydratedTemplate"))
                object.hydratedTemplate = $root.proto.HydratedFourRowTemplate.toObject(message.hydratedTemplate, options);
            return object;
        };

        /**
         * Converts this TemplateMessage to JSON.
         * @function toJSON
         * @memberof proto.TemplateMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TemplateMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TemplateMessage;
    })();

    proto.TemplateButtonReplyMessage = (function() {

        /**
         * Properties of a TemplateButtonReplyMessage.
         * @memberof proto
         * @interface ITemplateButtonReplyMessage
         * @property {string|null} [selectedId] TemplateButtonReplyMessage selectedId
         * @property {string|null} [selectedDisplayText] TemplateButtonReplyMessage selectedDisplayText
         * @property {proto.IContextInfo|null} [contextInfo] TemplateButtonReplyMessage contextInfo
         * @property {number|null} [selectedIndex] TemplateButtonReplyMessage selectedIndex
         */

        /**
         * Constructs a new TemplateButtonReplyMessage.
         * @memberof proto
         * @classdesc Represents a TemplateButtonReplyMessage.
         * @implements ITemplateButtonReplyMessage
         * @constructor
         * @param {proto.ITemplateButtonReplyMessage=} [properties] Properties to set
         */
        function TemplateButtonReplyMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TemplateButtonReplyMessage selectedId.
         * @member {string} selectedId
         * @memberof proto.TemplateButtonReplyMessage
         * @instance
         */
        TemplateButtonReplyMessage.prototype.selectedId = "";

        /**
         * TemplateButtonReplyMessage selectedDisplayText.
         * @member {string} selectedDisplayText
         * @memberof proto.TemplateButtonReplyMessage
         * @instance
         */
        TemplateButtonReplyMessage.prototype.selectedDisplayText = "";

        /**
         * TemplateButtonReplyMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.TemplateButtonReplyMessage
         * @instance
         */
        TemplateButtonReplyMessage.prototype.contextInfo = null;

        /**
         * TemplateButtonReplyMessage selectedIndex.
         * @member {number} selectedIndex
         * @memberof proto.TemplateButtonReplyMessage
         * @instance
         */
        TemplateButtonReplyMessage.prototype.selectedIndex = 0;

        /**
         * Creates a new TemplateButtonReplyMessage instance using the specified properties.
         * @function create
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {proto.ITemplateButtonReplyMessage=} [properties] Properties to set
         * @returns {proto.TemplateButtonReplyMessage} TemplateButtonReplyMessage instance
         */
        TemplateButtonReplyMessage.create = function create(properties) {
            return new TemplateButtonReplyMessage(properties);
        };

        /**
         * Encodes the specified TemplateButtonReplyMessage message. Does not implicitly {@link proto.TemplateButtonReplyMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {proto.ITemplateButtonReplyMessage} message TemplateButtonReplyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateButtonReplyMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.selectedId != null && Object.hasOwnProperty.call(message, "selectedId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.selectedId);
            if (message.selectedDisplayText != null && Object.hasOwnProperty.call(message, "selectedDisplayText"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.selectedDisplayText);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.selectedIndex != null && Object.hasOwnProperty.call(message, "selectedIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.selectedIndex);
            return writer;
        };

        /**
         * Encodes the specified TemplateButtonReplyMessage message, length delimited. Does not implicitly {@link proto.TemplateButtonReplyMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {proto.ITemplateButtonReplyMessage} message TemplateButtonReplyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TemplateButtonReplyMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TemplateButtonReplyMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.TemplateButtonReplyMessage} TemplateButtonReplyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateButtonReplyMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.TemplateButtonReplyMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.selectedId = reader.string();
                    break;
                case 2:
                    message.selectedDisplayText = reader.string();
                    break;
                case 3:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.selectedIndex = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TemplateButtonReplyMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.TemplateButtonReplyMessage} TemplateButtonReplyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TemplateButtonReplyMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TemplateButtonReplyMessage message.
         * @function verify
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TemplateButtonReplyMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.selectedId != null && message.hasOwnProperty("selectedId"))
                if (!$util.isString(message.selectedId))
                    return "selectedId: string expected";
            if (message.selectedDisplayText != null && message.hasOwnProperty("selectedDisplayText"))
                if (!$util.isString(message.selectedDisplayText))
                    return "selectedDisplayText: string expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            if (message.selectedIndex != null && message.hasOwnProperty("selectedIndex"))
                if (!$util.isInteger(message.selectedIndex))
                    return "selectedIndex: integer expected";
            return null;
        };

        /**
         * Creates a TemplateButtonReplyMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.TemplateButtonReplyMessage} TemplateButtonReplyMessage
         */
        TemplateButtonReplyMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.TemplateButtonReplyMessage)
                return object;
            var message = new $root.proto.TemplateButtonReplyMessage();
            if (object.selectedId != null)
                message.selectedId = String(object.selectedId);
            if (object.selectedDisplayText != null)
                message.selectedDisplayText = String(object.selectedDisplayText);
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.TemplateButtonReplyMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            if (object.selectedIndex != null)
                message.selectedIndex = object.selectedIndex >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a TemplateButtonReplyMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.TemplateButtonReplyMessage
         * @static
         * @param {proto.TemplateButtonReplyMessage} message TemplateButtonReplyMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TemplateButtonReplyMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.selectedId = "";
                object.selectedDisplayText = "";
                object.contextInfo = null;
                object.selectedIndex = 0;
            }
            if (message.selectedId != null && message.hasOwnProperty("selectedId"))
                object.selectedId = message.selectedId;
            if (message.selectedDisplayText != null && message.hasOwnProperty("selectedDisplayText"))
                object.selectedDisplayText = message.selectedDisplayText;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            if (message.selectedIndex != null && message.hasOwnProperty("selectedIndex"))
                object.selectedIndex = message.selectedIndex;
            return object;
        };

        /**
         * Converts this TemplateButtonReplyMessage to JSON.
         * @function toJSON
         * @memberof proto.TemplateButtonReplyMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TemplateButtonReplyMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TemplateButtonReplyMessage;
    })();

    proto.ProductSnapshot = (function() {

        /**
         * Properties of a ProductSnapshot.
         * @memberof proto
         * @interface IProductSnapshot
         * @property {proto.IImageMessage|null} [productImage] ProductSnapshot productImage
         * @property {string|null} [productId] ProductSnapshot productId
         * @property {string|null} [title] ProductSnapshot title
         * @property {string|null} [description] ProductSnapshot description
         * @property {string|null} [currencyCode] ProductSnapshot currencyCode
         * @property {number|Long|null} [priceAmount1000] ProductSnapshot priceAmount1000
         * @property {string|null} [retailerId] ProductSnapshot retailerId
         * @property {string|null} [url] ProductSnapshot url
         * @property {number|null} [productImageCount] ProductSnapshot productImageCount
         * @property {string|null} [firstImageId] ProductSnapshot firstImageId
         */

        /**
         * Constructs a new ProductSnapshot.
         * @memberof proto
         * @classdesc Represents a ProductSnapshot.
         * @implements IProductSnapshot
         * @constructor
         * @param {proto.IProductSnapshot=} [properties] Properties to set
         */
        function ProductSnapshot(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProductSnapshot productImage.
         * @member {proto.IImageMessage|null|undefined} productImage
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.productImage = null;

        /**
         * ProductSnapshot productId.
         * @member {string} productId
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.productId = "";

        /**
         * ProductSnapshot title.
         * @member {string} title
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.title = "";

        /**
         * ProductSnapshot description.
         * @member {string} description
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.description = "";

        /**
         * ProductSnapshot currencyCode.
         * @member {string} currencyCode
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.currencyCode = "";

        /**
         * ProductSnapshot priceAmount1000.
         * @member {number|Long} priceAmount1000
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.priceAmount1000 = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ProductSnapshot retailerId.
         * @member {string} retailerId
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.retailerId = "";

        /**
         * ProductSnapshot url.
         * @member {string} url
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.url = "";

        /**
         * ProductSnapshot productImageCount.
         * @member {number} productImageCount
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.productImageCount = 0;

        /**
         * ProductSnapshot firstImageId.
         * @member {string} firstImageId
         * @memberof proto.ProductSnapshot
         * @instance
         */
        ProductSnapshot.prototype.firstImageId = "";

        /**
         * Creates a new ProductSnapshot instance using the specified properties.
         * @function create
         * @memberof proto.ProductSnapshot
         * @static
         * @param {proto.IProductSnapshot=} [properties] Properties to set
         * @returns {proto.ProductSnapshot} ProductSnapshot instance
         */
        ProductSnapshot.create = function create(properties) {
            return new ProductSnapshot(properties);
        };

        /**
         * Encodes the specified ProductSnapshot message. Does not implicitly {@link proto.ProductSnapshot.verify|verify} messages.
         * @function encode
         * @memberof proto.ProductSnapshot
         * @static
         * @param {proto.IProductSnapshot} message ProductSnapshot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProductSnapshot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.productImage != null && Object.hasOwnProperty.call(message, "productImage"))
                $root.proto.ImageMessage.encode(message.productImage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.productId != null && Object.hasOwnProperty.call(message, "productId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.productId);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.description);
            if (message.currencyCode != null && Object.hasOwnProperty.call(message, "currencyCode"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.currencyCode);
            if (message.priceAmount1000 != null && Object.hasOwnProperty.call(message, "priceAmount1000"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.priceAmount1000);
            if (message.retailerId != null && Object.hasOwnProperty.call(message, "retailerId"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.retailerId);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.url);
            if (message.productImageCount != null && Object.hasOwnProperty.call(message, "productImageCount"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.productImageCount);
            if (message.firstImageId != null && Object.hasOwnProperty.call(message, "firstImageId"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.firstImageId);
            return writer;
        };

        /**
         * Encodes the specified ProductSnapshot message, length delimited. Does not implicitly {@link proto.ProductSnapshot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ProductSnapshot
         * @static
         * @param {proto.IProductSnapshot} message ProductSnapshot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProductSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProductSnapshot message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ProductSnapshot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ProductSnapshot} ProductSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProductSnapshot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ProductSnapshot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.productImage = $root.proto.ImageMessage.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.productId = reader.string();
                    break;
                case 3:
                    message.title = reader.string();
                    break;
                case 4:
                    message.description = reader.string();
                    break;
                case 5:
                    message.currencyCode = reader.string();
                    break;
                case 6:
                    message.priceAmount1000 = reader.int64();
                    break;
                case 7:
                    message.retailerId = reader.string();
                    break;
                case 8:
                    message.url = reader.string();
                    break;
                case 9:
                    message.productImageCount = reader.uint32();
                    break;
                case 11:
                    message.firstImageId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProductSnapshot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ProductSnapshot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ProductSnapshot} ProductSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProductSnapshot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProductSnapshot message.
         * @function verify
         * @memberof proto.ProductSnapshot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProductSnapshot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.productImage != null && message.hasOwnProperty("productImage")) {
                var error = $root.proto.ImageMessage.verify(message.productImage);
                if (error)
                    return "productImage." + error;
            }
            if (message.productId != null && message.hasOwnProperty("productId"))
                if (!$util.isString(message.productId))
                    return "productId: string expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.currencyCode != null && message.hasOwnProperty("currencyCode"))
                if (!$util.isString(message.currencyCode))
                    return "currencyCode: string expected";
            if (message.priceAmount1000 != null && message.hasOwnProperty("priceAmount1000"))
                if (!$util.isInteger(message.priceAmount1000) && !(message.priceAmount1000 && $util.isInteger(message.priceAmount1000.low) && $util.isInteger(message.priceAmount1000.high)))
                    return "priceAmount1000: integer|Long expected";
            if (message.retailerId != null && message.hasOwnProperty("retailerId"))
                if (!$util.isString(message.retailerId))
                    return "retailerId: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.productImageCount != null && message.hasOwnProperty("productImageCount"))
                if (!$util.isInteger(message.productImageCount))
                    return "productImageCount: integer expected";
            if (message.firstImageId != null && message.hasOwnProperty("firstImageId"))
                if (!$util.isString(message.firstImageId))
                    return "firstImageId: string expected";
            return null;
        };

        /**
         * Creates a ProductSnapshot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ProductSnapshot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ProductSnapshot} ProductSnapshot
         */
        ProductSnapshot.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ProductSnapshot)
                return object;
            var message = new $root.proto.ProductSnapshot();
            if (object.productImage != null) {
                if (typeof object.productImage !== "object")
                    throw TypeError(".proto.ProductSnapshot.productImage: object expected");
                message.productImage = $root.proto.ImageMessage.fromObject(object.productImage);
            }
            if (object.productId != null)
                message.productId = String(object.productId);
            if (object.title != null)
                message.title = String(object.title);
            if (object.description != null)
                message.description = String(object.description);
            if (object.currencyCode != null)
                message.currencyCode = String(object.currencyCode);
            if (object.priceAmount1000 != null)
                if ($util.Long)
                    (message.priceAmount1000 = $util.Long.fromValue(object.priceAmount1000)).unsigned = false;
                else if (typeof object.priceAmount1000 === "string")
                    message.priceAmount1000 = parseInt(object.priceAmount1000, 10);
                else if (typeof object.priceAmount1000 === "number")
                    message.priceAmount1000 = object.priceAmount1000;
                else if (typeof object.priceAmount1000 === "object")
                    message.priceAmount1000 = new $util.LongBits(object.priceAmount1000.low >>> 0, object.priceAmount1000.high >>> 0).toNumber();
            if (object.retailerId != null)
                message.retailerId = String(object.retailerId);
            if (object.url != null)
                message.url = String(object.url);
            if (object.productImageCount != null)
                message.productImageCount = object.productImageCount >>> 0;
            if (object.firstImageId != null)
                message.firstImageId = String(object.firstImageId);
            return message;
        };

        /**
         * Creates a plain object from a ProductSnapshot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ProductSnapshot
         * @static
         * @param {proto.ProductSnapshot} message ProductSnapshot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProductSnapshot.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.productImage = null;
                object.productId = "";
                object.title = "";
                object.description = "";
                object.currencyCode = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.priceAmount1000 = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.priceAmount1000 = options.longs === String ? "0" : 0;
                object.retailerId = "";
                object.url = "";
                object.productImageCount = 0;
                object.firstImageId = "";
            }
            if (message.productImage != null && message.hasOwnProperty("productImage"))
                object.productImage = $root.proto.ImageMessage.toObject(message.productImage, options);
            if (message.productId != null && message.hasOwnProperty("productId"))
                object.productId = message.productId;
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.currencyCode != null && message.hasOwnProperty("currencyCode"))
                object.currencyCode = message.currencyCode;
            if (message.priceAmount1000 != null && message.hasOwnProperty("priceAmount1000"))
                if (typeof message.priceAmount1000 === "number")
                    object.priceAmount1000 = options.longs === String ? String(message.priceAmount1000) : message.priceAmount1000;
                else
                    object.priceAmount1000 = options.longs === String ? $util.Long.prototype.toString.call(message.priceAmount1000) : options.longs === Number ? new $util.LongBits(message.priceAmount1000.low >>> 0, message.priceAmount1000.high >>> 0).toNumber() : message.priceAmount1000;
            if (message.retailerId != null && message.hasOwnProperty("retailerId"))
                object.retailerId = message.retailerId;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.productImageCount != null && message.hasOwnProperty("productImageCount"))
                object.productImageCount = message.productImageCount;
            if (message.firstImageId != null && message.hasOwnProperty("firstImageId"))
                object.firstImageId = message.firstImageId;
            return object;
        };

        /**
         * Converts this ProductSnapshot to JSON.
         * @function toJSON
         * @memberof proto.ProductSnapshot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProductSnapshot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProductSnapshot;
    })();

    proto.ProductMessage = (function() {

        /**
         * Properties of a ProductMessage.
         * @memberof proto
         * @interface IProductMessage
         * @property {proto.IProductSnapshot|null} [product] ProductMessage product
         * @property {string|null} [businessOwnerJid] ProductMessage businessOwnerJid
         * @property {proto.IContextInfo|null} [contextInfo] ProductMessage contextInfo
         */

        /**
         * Constructs a new ProductMessage.
         * @memberof proto
         * @classdesc Represents a ProductMessage.
         * @implements IProductMessage
         * @constructor
         * @param {proto.IProductMessage=} [properties] Properties to set
         */
        function ProductMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProductMessage product.
         * @member {proto.IProductSnapshot|null|undefined} product
         * @memberof proto.ProductMessage
         * @instance
         */
        ProductMessage.prototype.product = null;

        /**
         * ProductMessage businessOwnerJid.
         * @member {string} businessOwnerJid
         * @memberof proto.ProductMessage
         * @instance
         */
        ProductMessage.prototype.businessOwnerJid = "";

        /**
         * ProductMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.ProductMessage
         * @instance
         */
        ProductMessage.prototype.contextInfo = null;

        /**
         * Creates a new ProductMessage instance using the specified properties.
         * @function create
         * @memberof proto.ProductMessage
         * @static
         * @param {proto.IProductMessage=} [properties] Properties to set
         * @returns {proto.ProductMessage} ProductMessage instance
         */
        ProductMessage.create = function create(properties) {
            return new ProductMessage(properties);
        };

        /**
         * Encodes the specified ProductMessage message. Does not implicitly {@link proto.ProductMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.ProductMessage
         * @static
         * @param {proto.IProductMessage} message ProductMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProductMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.product != null && Object.hasOwnProperty.call(message, "product"))
                $root.proto.ProductSnapshot.encode(message.product, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.businessOwnerJid != null && Object.hasOwnProperty.call(message, "businessOwnerJid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.businessOwnerJid);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProductMessage message, length delimited. Does not implicitly {@link proto.ProductMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.ProductMessage
         * @static
         * @param {proto.IProductMessage} message ProductMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProductMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProductMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.ProductMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.ProductMessage} ProductMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProductMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.ProductMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.product = $root.proto.ProductSnapshot.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.businessOwnerJid = reader.string();
                    break;
                case 17:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProductMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.ProductMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.ProductMessage} ProductMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProductMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProductMessage message.
         * @function verify
         * @memberof proto.ProductMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProductMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.product != null && message.hasOwnProperty("product")) {
                var error = $root.proto.ProductSnapshot.verify(message.product);
                if (error)
                    return "product." + error;
            }
            if (message.businessOwnerJid != null && message.hasOwnProperty("businessOwnerJid"))
                if (!$util.isString(message.businessOwnerJid))
                    return "businessOwnerJid: string expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a ProductMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.ProductMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.ProductMessage} ProductMessage
         */
        ProductMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.ProductMessage)
                return object;
            var message = new $root.proto.ProductMessage();
            if (object.product != null) {
                if (typeof object.product !== "object")
                    throw TypeError(".proto.ProductMessage.product: object expected");
                message.product = $root.proto.ProductSnapshot.fromObject(object.product);
            }
            if (object.businessOwnerJid != null)
                message.businessOwnerJid = String(object.businessOwnerJid);
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.ProductMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProductMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.ProductMessage
         * @static
         * @param {proto.ProductMessage} message ProductMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProductMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.product = null;
                object.businessOwnerJid = "";
                object.contextInfo = null;
            }
            if (message.product != null && message.hasOwnProperty("product"))
                object.product = $root.proto.ProductSnapshot.toObject(message.product, options);
            if (message.businessOwnerJid != null && message.hasOwnProperty("businessOwnerJid"))
                object.businessOwnerJid = message.businessOwnerJid;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this ProductMessage to JSON.
         * @function toJSON
         * @memberof proto.ProductMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProductMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProductMessage;
    })();

    proto.GroupInviteMessage = (function() {

        /**
         * Properties of a GroupInviteMessage.
         * @memberof proto
         * @interface IGroupInviteMessage
         * @property {string|null} [groupJid] GroupInviteMessage groupJid
         * @property {string|null} [inviteCode] GroupInviteMessage inviteCode
         * @property {number|Long|null} [inviteExpiration] GroupInviteMessage inviteExpiration
         * @property {string|null} [groupName] GroupInviteMessage groupName
         * @property {Uint8Array|null} [jpegThumbnail] GroupInviteMessage jpegThumbnail
         * @property {string|null} [caption] GroupInviteMessage caption
         * @property {proto.IContextInfo|null} [contextInfo] GroupInviteMessage contextInfo
         */

        /**
         * Constructs a new GroupInviteMessage.
         * @memberof proto
         * @classdesc Represents a GroupInviteMessage.
         * @implements IGroupInviteMessage
         * @constructor
         * @param {proto.IGroupInviteMessage=} [properties] Properties to set
         */
        function GroupInviteMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GroupInviteMessage groupJid.
         * @member {string} groupJid
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.groupJid = "";

        /**
         * GroupInviteMessage inviteCode.
         * @member {string} inviteCode
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.inviteCode = "";

        /**
         * GroupInviteMessage inviteExpiration.
         * @member {number|Long} inviteExpiration
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.inviteExpiration = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * GroupInviteMessage groupName.
         * @member {string} groupName
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.groupName = "";

        /**
         * GroupInviteMessage jpegThumbnail.
         * @member {Uint8Array} jpegThumbnail
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.jpegThumbnail = $util.newBuffer([]);

        /**
         * GroupInviteMessage caption.
         * @member {string} caption
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.caption = "";

        /**
         * GroupInviteMessage contextInfo.
         * @member {proto.IContextInfo|null|undefined} contextInfo
         * @memberof proto.GroupInviteMessage
         * @instance
         */
        GroupInviteMessage.prototype.contextInfo = null;

        /**
         * Creates a new GroupInviteMessage instance using the specified properties.
         * @function create
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {proto.IGroupInviteMessage=} [properties] Properties to set
         * @returns {proto.GroupInviteMessage} GroupInviteMessage instance
         */
        GroupInviteMessage.create = function create(properties) {
            return new GroupInviteMessage(properties);
        };

        /**
         * Encodes the specified GroupInviteMessage message. Does not implicitly {@link proto.GroupInviteMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {proto.IGroupInviteMessage} message GroupInviteMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroupInviteMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.groupJid != null && Object.hasOwnProperty.call(message, "groupJid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupJid);
            if (message.inviteCode != null && Object.hasOwnProperty.call(message, "inviteCode"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.inviteCode);
            if (message.inviteExpiration != null && Object.hasOwnProperty.call(message, "inviteExpiration"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.inviteExpiration);
            if (message.groupName != null && Object.hasOwnProperty.call(message, "groupName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.groupName);
            if (message.jpegThumbnail != null && Object.hasOwnProperty.call(message, "jpegThumbnail"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.jpegThumbnail);
            if (message.caption != null && Object.hasOwnProperty.call(message, "caption"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.caption);
            if (message.contextInfo != null && Object.hasOwnProperty.call(message, "contextInfo"))
                $root.proto.ContextInfo.encode(message.contextInfo, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GroupInviteMessage message, length delimited. Does not implicitly {@link proto.GroupInviteMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {proto.IGroupInviteMessage} message GroupInviteMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroupInviteMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GroupInviteMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.GroupInviteMessage} GroupInviteMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroupInviteMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.GroupInviteMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.groupJid = reader.string();
                    break;
                case 2:
                    message.inviteCode = reader.string();
                    break;
                case 3:
                    message.inviteExpiration = reader.int64();
                    break;
                case 4:
                    message.groupName = reader.string();
                    break;
                case 5:
                    message.jpegThumbnail = reader.bytes();
                    break;
                case 6:
                    message.caption = reader.string();
                    break;
                case 7:
                    message.contextInfo = $root.proto.ContextInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GroupInviteMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.GroupInviteMessage} GroupInviteMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroupInviteMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GroupInviteMessage message.
         * @function verify
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GroupInviteMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.groupJid != null && message.hasOwnProperty("groupJid"))
                if (!$util.isString(message.groupJid))
                    return "groupJid: string expected";
            if (message.inviteCode != null && message.hasOwnProperty("inviteCode"))
                if (!$util.isString(message.inviteCode))
                    return "inviteCode: string expected";
            if (message.inviteExpiration != null && message.hasOwnProperty("inviteExpiration"))
                if (!$util.isInteger(message.inviteExpiration) && !(message.inviteExpiration && $util.isInteger(message.inviteExpiration.low) && $util.isInteger(message.inviteExpiration.high)))
                    return "inviteExpiration: integer|Long expected";
            if (message.groupName != null && message.hasOwnProperty("groupName"))
                if (!$util.isString(message.groupName))
                    return "groupName: string expected";
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                if (!(message.jpegThumbnail && typeof message.jpegThumbnail.length === "number" || $util.isString(message.jpegThumbnail)))
                    return "jpegThumbnail: buffer expected";
            if (message.caption != null && message.hasOwnProperty("caption"))
                if (!$util.isString(message.caption))
                    return "caption: string expected";
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo")) {
                var error = $root.proto.ContextInfo.verify(message.contextInfo);
                if (error)
                    return "contextInfo." + error;
            }
            return null;
        };

        /**
         * Creates a GroupInviteMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.GroupInviteMessage} GroupInviteMessage
         */
        GroupInviteMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.GroupInviteMessage)
                return object;
            var message = new $root.proto.GroupInviteMessage();
            if (object.groupJid != null)
                message.groupJid = String(object.groupJid);
            if (object.inviteCode != null)
                message.inviteCode = String(object.inviteCode);
            if (object.inviteExpiration != null)
                if ($util.Long)
                    (message.inviteExpiration = $util.Long.fromValue(object.inviteExpiration)).unsigned = false;
                else if (typeof object.inviteExpiration === "string")
                    message.inviteExpiration = parseInt(object.inviteExpiration, 10);
                else if (typeof object.inviteExpiration === "number")
                    message.inviteExpiration = object.inviteExpiration;
                else if (typeof object.inviteExpiration === "object")
                    message.inviteExpiration = new $util.LongBits(object.inviteExpiration.low >>> 0, object.inviteExpiration.high >>> 0).toNumber();
            if (object.groupName != null)
                message.groupName = String(object.groupName);
            if (object.jpegThumbnail != null)
                if (typeof object.jpegThumbnail === "string")
                    $util.base64.decode(object.jpegThumbnail, message.jpegThumbnail = $util.newBuffer($util.base64.length(object.jpegThumbnail)), 0);
                else if (object.jpegThumbnail.length)
                    message.jpegThumbnail = object.jpegThumbnail;
            if (object.caption != null)
                message.caption = String(object.caption);
            if (object.contextInfo != null) {
                if (typeof object.contextInfo !== "object")
                    throw TypeError(".proto.GroupInviteMessage.contextInfo: object expected");
                message.contextInfo = $root.proto.ContextInfo.fromObject(object.contextInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a GroupInviteMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.GroupInviteMessage
         * @static
         * @param {proto.GroupInviteMessage} message GroupInviteMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GroupInviteMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.groupJid = "";
                object.inviteCode = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.inviteExpiration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.inviteExpiration = options.longs === String ? "0" : 0;
                object.groupName = "";
                if (options.bytes === String)
                    object.jpegThumbnail = "";
                else {
                    object.jpegThumbnail = [];
                    if (options.bytes !== Array)
                        object.jpegThumbnail = $util.newBuffer(object.jpegThumbnail);
                }
                object.caption = "";
                object.contextInfo = null;
            }
            if (message.groupJid != null && message.hasOwnProperty("groupJid"))
                object.groupJid = message.groupJid;
            if (message.inviteCode != null && message.hasOwnProperty("inviteCode"))
                object.inviteCode = message.inviteCode;
            if (message.inviteExpiration != null && message.hasOwnProperty("inviteExpiration"))
                if (typeof message.inviteExpiration === "number")
                    object.inviteExpiration = options.longs === String ? String(message.inviteExpiration) : message.inviteExpiration;
                else
                    object.inviteExpiration = options.longs === String ? $util.Long.prototype.toString.call(message.inviteExpiration) : options.longs === Number ? new $util.LongBits(message.inviteExpiration.low >>> 0, message.inviteExpiration.high >>> 0).toNumber() : message.inviteExpiration;
            if (message.groupName != null && message.hasOwnProperty("groupName"))
                object.groupName = message.groupName;
            if (message.jpegThumbnail != null && message.hasOwnProperty("jpegThumbnail"))
                object.jpegThumbnail = options.bytes === String ? $util.base64.encode(message.jpegThumbnail, 0, message.jpegThumbnail.length) : options.bytes === Array ? Array.prototype.slice.call(message.jpegThumbnail) : message.jpegThumbnail;
            if (message.caption != null && message.hasOwnProperty("caption"))
                object.caption = message.caption;
            if (message.contextInfo != null && message.hasOwnProperty("contextInfo"))
                object.contextInfo = $root.proto.ContextInfo.toObject(message.contextInfo, options);
            return object;
        };

        /**
         * Converts this GroupInviteMessage to JSON.
         * @function toJSON
         * @memberof proto.GroupInviteMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GroupInviteMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GroupInviteMessage;
    })();

    proto.DeviceSentMessage = (function() {

        /**
         * Properties of a DeviceSentMessage.
         * @memberof proto
         * @interface IDeviceSentMessage
         * @property {string|null} [destinationJid] DeviceSentMessage destinationJid
         * @property {proto.IMessage|null} [message] DeviceSentMessage message
         */

        /**
         * Constructs a new DeviceSentMessage.
         * @memberof proto
         * @classdesc Represents a DeviceSentMessage.
         * @implements IDeviceSentMessage
         * @constructor
         * @param {proto.IDeviceSentMessage=} [properties] Properties to set
         */
        function DeviceSentMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeviceSentMessage destinationJid.
         * @member {string} destinationJid
         * @memberof proto.DeviceSentMessage
         * @instance
         */
        DeviceSentMessage.prototype.destinationJid = "";

        /**
         * DeviceSentMessage message.
         * @member {proto.IMessage|null|undefined} message
         * @memberof proto.DeviceSentMessage
         * @instance
         */
        DeviceSentMessage.prototype.message = null;

        /**
         * Creates a new DeviceSentMessage instance using the specified properties.
         * @function create
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {proto.IDeviceSentMessage=} [properties] Properties to set
         * @returns {proto.DeviceSentMessage} DeviceSentMessage instance
         */
        DeviceSentMessage.create = function create(properties) {
            return new DeviceSentMessage(properties);
        };

        /**
         * Encodes the specified DeviceSentMessage message. Does not implicitly {@link proto.DeviceSentMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {proto.IDeviceSentMessage} message DeviceSentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceSentMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.destinationJid != null && Object.hasOwnProperty.call(message, "destinationJid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.destinationJid);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.proto.Message.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DeviceSentMessage message, length delimited. Does not implicitly {@link proto.DeviceSentMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {proto.IDeviceSentMessage} message DeviceSentMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceSentMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeviceSentMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.DeviceSentMessage} DeviceSentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceSentMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.DeviceSentMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.destinationJid = reader.string();
                    break;
                case 2:
                    message.message = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeviceSentMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.DeviceSentMessage} DeviceSentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceSentMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeviceSentMessage message.
         * @function verify
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeviceSentMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.destinationJid != null && message.hasOwnProperty("destinationJid"))
                if (!$util.isString(message.destinationJid))
                    return "destinationJid: string expected";
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.proto.Message.verify(message.message);
                if (error)
                    return "message." + error;
            }
            return null;
        };

        /**
         * Creates a DeviceSentMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.DeviceSentMessage} DeviceSentMessage
         */
        DeviceSentMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.DeviceSentMessage)
                return object;
            var message = new $root.proto.DeviceSentMessage();
            if (object.destinationJid != null)
                message.destinationJid = String(object.destinationJid);
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".proto.DeviceSentMessage.message: object expected");
                message.message = $root.proto.Message.fromObject(object.message);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeviceSentMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.DeviceSentMessage
         * @static
         * @param {proto.DeviceSentMessage} message DeviceSentMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeviceSentMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.destinationJid = "";
                object.message = null;
            }
            if (message.destinationJid != null && message.hasOwnProperty("destinationJid"))
                object.destinationJid = message.destinationJid;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.proto.Message.toObject(message.message, options);
            return object;
        };

        /**
         * Converts this DeviceSentMessage to JSON.
         * @function toJSON
         * @memberof proto.DeviceSentMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeviceSentMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeviceSentMessage;
    })();

    proto.DeviceSyncMessage = (function() {

        /**
         * Properties of a DeviceSyncMessage.
         * @memberof proto
         * @interface IDeviceSyncMessage
         * @property {Uint8Array|null} [serializedXmlBytes] DeviceSyncMessage serializedXmlBytes
         */

        /**
         * Constructs a new DeviceSyncMessage.
         * @memberof proto
         * @classdesc Represents a DeviceSyncMessage.
         * @implements IDeviceSyncMessage
         * @constructor
         * @param {proto.IDeviceSyncMessage=} [properties] Properties to set
         */
        function DeviceSyncMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeviceSyncMessage serializedXmlBytes.
         * @member {Uint8Array} serializedXmlBytes
         * @memberof proto.DeviceSyncMessage
         * @instance
         */
        DeviceSyncMessage.prototype.serializedXmlBytes = $util.newBuffer([]);

        /**
         * Creates a new DeviceSyncMessage instance using the specified properties.
         * @function create
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {proto.IDeviceSyncMessage=} [properties] Properties to set
         * @returns {proto.DeviceSyncMessage} DeviceSyncMessage instance
         */
        DeviceSyncMessage.create = function create(properties) {
            return new DeviceSyncMessage(properties);
        };

        /**
         * Encodes the specified DeviceSyncMessage message. Does not implicitly {@link proto.DeviceSyncMessage.verify|verify} messages.
         * @function encode
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {proto.IDeviceSyncMessage} message DeviceSyncMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceSyncMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serializedXmlBytes != null && Object.hasOwnProperty.call(message, "serializedXmlBytes"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.serializedXmlBytes);
            return writer;
        };

        /**
         * Encodes the specified DeviceSyncMessage message, length delimited. Does not implicitly {@link proto.DeviceSyncMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {proto.IDeviceSyncMessage} message DeviceSyncMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceSyncMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeviceSyncMessage message from the specified reader or buffer.
         * @function decode
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.DeviceSyncMessage} DeviceSyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceSyncMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.DeviceSyncMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serializedXmlBytes = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeviceSyncMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.DeviceSyncMessage} DeviceSyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceSyncMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeviceSyncMessage message.
         * @function verify
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeviceSyncMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serializedXmlBytes != null && message.hasOwnProperty("serializedXmlBytes"))
                if (!(message.serializedXmlBytes && typeof message.serializedXmlBytes.length === "number" || $util.isString(message.serializedXmlBytes)))
                    return "serializedXmlBytes: buffer expected";
            return null;
        };

        /**
         * Creates a DeviceSyncMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.DeviceSyncMessage} DeviceSyncMessage
         */
        DeviceSyncMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.DeviceSyncMessage)
                return object;
            var message = new $root.proto.DeviceSyncMessage();
            if (object.serializedXmlBytes != null)
                if (typeof object.serializedXmlBytes === "string")
                    $util.base64.decode(object.serializedXmlBytes, message.serializedXmlBytes = $util.newBuffer($util.base64.length(object.serializedXmlBytes)), 0);
                else if (object.serializedXmlBytes.length)
                    message.serializedXmlBytes = object.serializedXmlBytes;
            return message;
        };

        /**
         * Creates a plain object from a DeviceSyncMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.DeviceSyncMessage
         * @static
         * @param {proto.DeviceSyncMessage} message DeviceSyncMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeviceSyncMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.serializedXmlBytes = "";
                else {
                    object.serializedXmlBytes = [];
                    if (options.bytes !== Array)
                        object.serializedXmlBytes = $util.newBuffer(object.serializedXmlBytes);
                }
            if (message.serializedXmlBytes != null && message.hasOwnProperty("serializedXmlBytes"))
                object.serializedXmlBytes = options.bytes === String ? $util.base64.encode(message.serializedXmlBytes, 0, message.serializedXmlBytes.length) : options.bytes === Array ? Array.prototype.slice.call(message.serializedXmlBytes) : message.serializedXmlBytes;
            return object;
        };

        /**
         * Converts this DeviceSyncMessage to JSON.
         * @function toJSON
         * @memberof proto.DeviceSyncMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeviceSyncMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeviceSyncMessage;
    })();

    proto.Message = (function() {

        /**
         * Properties of a Message.
         * @memberof proto
         * @interface IMessage
         * @property {string|null} [conversation] Message conversation
         * @property {proto.ISenderKeyDistributionMessage|null} [senderKeyDistributionMessage] Message senderKeyDistributionMessage
         * @property {proto.IImageMessage|null} [imageMessage] Message imageMessage
         * @property {proto.IContactMessage|null} [contactMessage] Message contactMessage
         * @property {proto.ILocationMessage|null} [locationMessage] Message locationMessage
         * @property {proto.IExtendedTextMessage|null} [extendedTextMessage] Message extendedTextMessage
         * @property {proto.IDocumentMessage|null} [documentMessage] Message documentMessage
         * @property {proto.IAudioMessage|null} [audioMessage] Message audioMessage
         * @property {proto.IVideoMessage|null} [videoMessage] Message videoMessage
         * @property {proto.ICall|null} [call] Message call
         * @property {proto.IChat|null} [chat] Message chat
         * @property {proto.IProtocolMessage|null} [protocolMessage] Message protocolMessage
         * @property {proto.IContactsArrayMessage|null} [contactsArrayMessage] Message contactsArrayMessage
         * @property {proto.IHighlyStructuredMessage|null} [highlyStructuredMessage] Message highlyStructuredMessage
         * @property {proto.ISenderKeyDistributionMessage|null} [fastRatchetKeySenderKeyDistributionMessage] Message fastRatchetKeySenderKeyDistributionMessage
         * @property {proto.ISendPaymentMessage|null} [sendPaymentMessage] Message sendPaymentMessage
         * @property {proto.ILiveLocationMessage|null} [liveLocationMessage] Message liveLocationMessage
         * @property {proto.IRequestPaymentMessage|null} [requestPaymentMessage] Message requestPaymentMessage
         * @property {proto.IDeclinePaymentRequestMessage|null} [declinePaymentRequestMessage] Message declinePaymentRequestMessage
         * @property {proto.ICancelPaymentRequestMessage|null} [cancelPaymentRequestMessage] Message cancelPaymentRequestMessage
         * @property {proto.ITemplateMessage|null} [templateMessage] Message templateMessage
         * @property {proto.IStickerMessage|null} [stickerMessage] Message stickerMessage
         * @property {proto.IGroupInviteMessage|null} [groupInviteMessage] Message groupInviteMessage
         * @property {proto.ITemplateButtonReplyMessage|null} [templateButtonReplyMessage] Message templateButtonReplyMessage
         * @property {proto.IProductMessage|null} [productMessage] Message productMessage
         * @property {proto.IDeviceSentMessage|null} [deviceSentMessage] Message deviceSentMessage
         * @property {proto.IDeviceSyncMessage|null} [deviceSyncMessage] Message deviceSyncMessage
         */

        /**
         * Constructs a new Message.
         * @memberof proto
         * @classdesc Represents a Message.
         * @implements IMessage
         * @constructor
         * @param {proto.IMessage=} [properties] Properties to set
         */
        function Message(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Message conversation.
         * @member {string} conversation
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.conversation = "";

        /**
         * Message senderKeyDistributionMessage.
         * @member {proto.ISenderKeyDistributionMessage|null|undefined} senderKeyDistributionMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.senderKeyDistributionMessage = null;

        /**
         * Message imageMessage.
         * @member {proto.IImageMessage|null|undefined} imageMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.imageMessage = null;

        /**
         * Message contactMessage.
         * @member {proto.IContactMessage|null|undefined} contactMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.contactMessage = null;

        /**
         * Message locationMessage.
         * @member {proto.ILocationMessage|null|undefined} locationMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.locationMessage = null;

        /**
         * Message extendedTextMessage.
         * @member {proto.IExtendedTextMessage|null|undefined} extendedTextMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.extendedTextMessage = null;

        /**
         * Message documentMessage.
         * @member {proto.IDocumentMessage|null|undefined} documentMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.documentMessage = null;

        /**
         * Message audioMessage.
         * @member {proto.IAudioMessage|null|undefined} audioMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.audioMessage = null;

        /**
         * Message videoMessage.
         * @member {proto.IVideoMessage|null|undefined} videoMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.videoMessage = null;

        /**
         * Message call.
         * @member {proto.ICall|null|undefined} call
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.call = null;

        /**
         * Message chat.
         * @member {proto.IChat|null|undefined} chat
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.chat = null;

        /**
         * Message protocolMessage.
         * @member {proto.IProtocolMessage|null|undefined} protocolMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.protocolMessage = null;

        /**
         * Message contactsArrayMessage.
         * @member {proto.IContactsArrayMessage|null|undefined} contactsArrayMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.contactsArrayMessage = null;

        /**
         * Message highlyStructuredMessage.
         * @member {proto.IHighlyStructuredMessage|null|undefined} highlyStructuredMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.highlyStructuredMessage = null;

        /**
         * Message fastRatchetKeySenderKeyDistributionMessage.
         * @member {proto.ISenderKeyDistributionMessage|null|undefined} fastRatchetKeySenderKeyDistributionMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.fastRatchetKeySenderKeyDistributionMessage = null;

        /**
         * Message sendPaymentMessage.
         * @member {proto.ISendPaymentMessage|null|undefined} sendPaymentMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.sendPaymentMessage = null;

        /**
         * Message liveLocationMessage.
         * @member {proto.ILiveLocationMessage|null|undefined} liveLocationMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.liveLocationMessage = null;

        /**
         * Message requestPaymentMessage.
         * @member {proto.IRequestPaymentMessage|null|undefined} requestPaymentMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.requestPaymentMessage = null;

        /**
         * Message declinePaymentRequestMessage.
         * @member {proto.IDeclinePaymentRequestMessage|null|undefined} declinePaymentRequestMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.declinePaymentRequestMessage = null;

        /**
         * Message cancelPaymentRequestMessage.
         * @member {proto.ICancelPaymentRequestMessage|null|undefined} cancelPaymentRequestMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.cancelPaymentRequestMessage = null;

        /**
         * Message templateMessage.
         * @member {proto.ITemplateMessage|null|undefined} templateMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.templateMessage = null;

        /**
         * Message stickerMessage.
         * @member {proto.IStickerMessage|null|undefined} stickerMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.stickerMessage = null;

        /**
         * Message groupInviteMessage.
         * @member {proto.IGroupInviteMessage|null|undefined} groupInviteMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.groupInviteMessage = null;

        /**
         * Message templateButtonReplyMessage.
         * @member {proto.ITemplateButtonReplyMessage|null|undefined} templateButtonReplyMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.templateButtonReplyMessage = null;

        /**
         * Message productMessage.
         * @member {proto.IProductMessage|null|undefined} productMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.productMessage = null;

        /**
         * Message deviceSentMessage.
         * @member {proto.IDeviceSentMessage|null|undefined} deviceSentMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.deviceSentMessage = null;

        /**
         * Message deviceSyncMessage.
         * @member {proto.IDeviceSyncMessage|null|undefined} deviceSyncMessage
         * @memberof proto.Message
         * @instance
         */
        Message.prototype.deviceSyncMessage = null;

        /**
         * Creates a new Message instance using the specified properties.
         * @function create
         * @memberof proto.Message
         * @static
         * @param {proto.IMessage=} [properties] Properties to set
         * @returns {proto.Message} Message instance
         */
        Message.create = function create(properties) {
            return new Message(properties);
        };

        /**
         * Encodes the specified Message message. Does not implicitly {@link proto.Message.verify|verify} messages.
         * @function encode
         * @memberof proto.Message
         * @static
         * @param {proto.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.conversation);
            if (message.senderKeyDistributionMessage != null && Object.hasOwnProperty.call(message, "senderKeyDistributionMessage"))
                $root.proto.SenderKeyDistributionMessage.encode(message.senderKeyDistributionMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.imageMessage != null && Object.hasOwnProperty.call(message, "imageMessage"))
                $root.proto.ImageMessage.encode(message.imageMessage, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.contactMessage != null && Object.hasOwnProperty.call(message, "contactMessage"))
                $root.proto.ContactMessage.encode(message.contactMessage, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.locationMessage != null && Object.hasOwnProperty.call(message, "locationMessage"))
                $root.proto.LocationMessage.encode(message.locationMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.extendedTextMessage != null && Object.hasOwnProperty.call(message, "extendedTextMessage"))
                $root.proto.ExtendedTextMessage.encode(message.extendedTextMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.documentMessage != null && Object.hasOwnProperty.call(message, "documentMessage"))
                $root.proto.DocumentMessage.encode(message.documentMessage, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.audioMessage != null && Object.hasOwnProperty.call(message, "audioMessage"))
                $root.proto.AudioMessage.encode(message.audioMessage, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.videoMessage != null && Object.hasOwnProperty.call(message, "videoMessage"))
                $root.proto.VideoMessage.encode(message.videoMessage, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.call != null && Object.hasOwnProperty.call(message, "call"))
                $root.proto.Call.encode(message.call, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.chat != null && Object.hasOwnProperty.call(message, "chat"))
                $root.proto.Chat.encode(message.chat, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.protocolMessage != null && Object.hasOwnProperty.call(message, "protocolMessage"))
                $root.proto.ProtocolMessage.encode(message.protocolMessage, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.contactsArrayMessage != null && Object.hasOwnProperty.call(message, "contactsArrayMessage"))
                $root.proto.ContactsArrayMessage.encode(message.contactsArrayMessage, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.highlyStructuredMessage != null && Object.hasOwnProperty.call(message, "highlyStructuredMessage"))
                $root.proto.HighlyStructuredMessage.encode(message.highlyStructuredMessage, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.fastRatchetKeySenderKeyDistributionMessage != null && Object.hasOwnProperty.call(message, "fastRatchetKeySenderKeyDistributionMessage"))
                $root.proto.SenderKeyDistributionMessage.encode(message.fastRatchetKeySenderKeyDistributionMessage, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.sendPaymentMessage != null && Object.hasOwnProperty.call(message, "sendPaymentMessage"))
                $root.proto.SendPaymentMessage.encode(message.sendPaymentMessage, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.liveLocationMessage != null && Object.hasOwnProperty.call(message, "liveLocationMessage"))
                $root.proto.LiveLocationMessage.encode(message.liveLocationMessage, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.requestPaymentMessage != null && Object.hasOwnProperty.call(message, "requestPaymentMessage"))
                $root.proto.RequestPaymentMessage.encode(message.requestPaymentMessage, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            if (message.declinePaymentRequestMessage != null && Object.hasOwnProperty.call(message, "declinePaymentRequestMessage"))
                $root.proto.DeclinePaymentRequestMessage.encode(message.declinePaymentRequestMessage, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.cancelPaymentRequestMessage != null && Object.hasOwnProperty.call(message, "cancelPaymentRequestMessage"))
                $root.proto.CancelPaymentRequestMessage.encode(message.cancelPaymentRequestMessage, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.templateMessage != null && Object.hasOwnProperty.call(message, "templateMessage"))
                $root.proto.TemplateMessage.encode(message.templateMessage, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
            if (message.stickerMessage != null && Object.hasOwnProperty.call(message, "stickerMessage"))
                $root.proto.StickerMessage.encode(message.stickerMessage, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.groupInviteMessage != null && Object.hasOwnProperty.call(message, "groupInviteMessage"))
                $root.proto.GroupInviteMessage.encode(message.groupInviteMessage, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
            if (message.templateButtonReplyMessage != null && Object.hasOwnProperty.call(message, "templateButtonReplyMessage"))
                $root.proto.TemplateButtonReplyMessage.encode(message.templateButtonReplyMessage, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
            if (message.productMessage != null && Object.hasOwnProperty.call(message, "productMessage"))
                $root.proto.ProductMessage.encode(message.productMessage, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.deviceSentMessage != null && Object.hasOwnProperty.call(message, "deviceSentMessage"))
                $root.proto.DeviceSentMessage.encode(message.deviceSentMessage, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
            if (message.deviceSyncMessage != null && Object.hasOwnProperty.call(message, "deviceSyncMessage"))
                $root.proto.DeviceSyncMessage.encode(message.deviceSyncMessage, writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link proto.Message.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Message
         * @static
         * @param {proto.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Message();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.conversation = reader.string();
                    break;
                case 2:
                    message.senderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.imageMessage = $root.proto.ImageMessage.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.contactMessage = $root.proto.ContactMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.locationMessage = $root.proto.LocationMessage.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.extendedTextMessage = $root.proto.ExtendedTextMessage.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.documentMessage = $root.proto.DocumentMessage.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.audioMessage = $root.proto.AudioMessage.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.videoMessage = $root.proto.VideoMessage.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.call = $root.proto.Call.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.chat = $root.proto.Chat.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.protocolMessage = $root.proto.ProtocolMessage.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.contactsArrayMessage = $root.proto.ContactsArrayMessage.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.fastRatchetKeySenderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.sendPaymentMessage = $root.proto.SendPaymentMessage.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.liveLocationMessage = $root.proto.LiveLocationMessage.decode(reader, reader.uint32());
                    break;
                case 22:
                    message.requestPaymentMessage = $root.proto.RequestPaymentMessage.decode(reader, reader.uint32());
                    break;
                case 23:
                    message.declinePaymentRequestMessage = $root.proto.DeclinePaymentRequestMessage.decode(reader, reader.uint32());
                    break;
                case 24:
                    message.cancelPaymentRequestMessage = $root.proto.CancelPaymentRequestMessage.decode(reader, reader.uint32());
                    break;
                case 25:
                    message.templateMessage = $root.proto.TemplateMessage.decode(reader, reader.uint32());
                    break;
                case 26:
                    message.stickerMessage = $root.proto.StickerMessage.decode(reader, reader.uint32());
                    break;
                case 28:
                    message.groupInviteMessage = $root.proto.GroupInviteMessage.decode(reader, reader.uint32());
                    break;
                case 29:
                    message.templateButtonReplyMessage = $root.proto.TemplateButtonReplyMessage.decode(reader, reader.uint32());
                    break;
                case 30:
                    message.productMessage = $root.proto.ProductMessage.decode(reader, reader.uint32());
                    break;
                case 31:
                    message.deviceSentMessage = $root.proto.DeviceSentMessage.decode(reader, reader.uint32());
                    break;
                case 32:
                    message.deviceSyncMessage = $root.proto.DeviceSyncMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message message.
         * @function verify
         * @memberof proto.Message
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.conversation != null && message.hasOwnProperty("conversation"))
                if (!$util.isString(message.conversation))
                    return "conversation: string expected";
            if (message.senderKeyDistributionMessage != null && message.hasOwnProperty("senderKeyDistributionMessage")) {
                var error = $root.proto.SenderKeyDistributionMessage.verify(message.senderKeyDistributionMessage);
                if (error)
                    return "senderKeyDistributionMessage." + error;
            }
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage")) {
                var error = $root.proto.ImageMessage.verify(message.imageMessage);
                if (error)
                    return "imageMessage." + error;
            }
            if (message.contactMessage != null && message.hasOwnProperty("contactMessage")) {
                var error = $root.proto.ContactMessage.verify(message.contactMessage);
                if (error)
                    return "contactMessage." + error;
            }
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage")) {
                var error = $root.proto.LocationMessage.verify(message.locationMessage);
                if (error)
                    return "locationMessage." + error;
            }
            if (message.extendedTextMessage != null && message.hasOwnProperty("extendedTextMessage")) {
                var error = $root.proto.ExtendedTextMessage.verify(message.extendedTextMessage);
                if (error)
                    return "extendedTextMessage." + error;
            }
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage")) {
                var error = $root.proto.DocumentMessage.verify(message.documentMessage);
                if (error)
                    return "documentMessage." + error;
            }
            if (message.audioMessage != null && message.hasOwnProperty("audioMessage")) {
                var error = $root.proto.AudioMessage.verify(message.audioMessage);
                if (error)
                    return "audioMessage." + error;
            }
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage")) {
                var error = $root.proto.VideoMessage.verify(message.videoMessage);
                if (error)
                    return "videoMessage." + error;
            }
            if (message.call != null && message.hasOwnProperty("call")) {
                var error = $root.proto.Call.verify(message.call);
                if (error)
                    return "call." + error;
            }
            if (message.chat != null && message.hasOwnProperty("chat")) {
                var error = $root.proto.Chat.verify(message.chat);
                if (error)
                    return "chat." + error;
            }
            if (message.protocolMessage != null && message.hasOwnProperty("protocolMessage")) {
                var error = $root.proto.ProtocolMessage.verify(message.protocolMessage);
                if (error)
                    return "protocolMessage." + error;
            }
            if (message.contactsArrayMessage != null && message.hasOwnProperty("contactsArrayMessage")) {
                var error = $root.proto.ContactsArrayMessage.verify(message.contactsArrayMessage);
                if (error)
                    return "contactsArrayMessage." + error;
            }
            if (message.highlyStructuredMessage != null && message.hasOwnProperty("highlyStructuredMessage")) {
                var error = $root.proto.HighlyStructuredMessage.verify(message.highlyStructuredMessage);
                if (error)
                    return "highlyStructuredMessage." + error;
            }
            if (message.fastRatchetKeySenderKeyDistributionMessage != null && message.hasOwnProperty("fastRatchetKeySenderKeyDistributionMessage")) {
                var error = $root.proto.SenderKeyDistributionMessage.verify(message.fastRatchetKeySenderKeyDistributionMessage);
                if (error)
                    return "fastRatchetKeySenderKeyDistributionMessage." + error;
            }
            if (message.sendPaymentMessage != null && message.hasOwnProperty("sendPaymentMessage")) {
                var error = $root.proto.SendPaymentMessage.verify(message.sendPaymentMessage);
                if (error)
                    return "sendPaymentMessage." + error;
            }
            if (message.liveLocationMessage != null && message.hasOwnProperty("liveLocationMessage")) {
                var error = $root.proto.LiveLocationMessage.verify(message.liveLocationMessage);
                if (error)
                    return "liveLocationMessage." + error;
            }
            if (message.requestPaymentMessage != null && message.hasOwnProperty("requestPaymentMessage")) {
                var error = $root.proto.RequestPaymentMessage.verify(message.requestPaymentMessage);
                if (error)
                    return "requestPaymentMessage." + error;
            }
            if (message.declinePaymentRequestMessage != null && message.hasOwnProperty("declinePaymentRequestMessage")) {
                var error = $root.proto.DeclinePaymentRequestMessage.verify(message.declinePaymentRequestMessage);
                if (error)
                    return "declinePaymentRequestMessage." + error;
            }
            if (message.cancelPaymentRequestMessage != null && message.hasOwnProperty("cancelPaymentRequestMessage")) {
                var error = $root.proto.CancelPaymentRequestMessage.verify(message.cancelPaymentRequestMessage);
                if (error)
                    return "cancelPaymentRequestMessage." + error;
            }
            if (message.templateMessage != null && message.hasOwnProperty("templateMessage")) {
                var error = $root.proto.TemplateMessage.verify(message.templateMessage);
                if (error)
                    return "templateMessage." + error;
            }
            if (message.stickerMessage != null && message.hasOwnProperty("stickerMessage")) {
                var error = $root.proto.StickerMessage.verify(message.stickerMessage);
                if (error)
                    return "stickerMessage." + error;
            }
            if (message.groupInviteMessage != null && message.hasOwnProperty("groupInviteMessage")) {
                var error = $root.proto.GroupInviteMessage.verify(message.groupInviteMessage);
                if (error)
                    return "groupInviteMessage." + error;
            }
            if (message.templateButtonReplyMessage != null && message.hasOwnProperty("templateButtonReplyMessage")) {
                var error = $root.proto.TemplateButtonReplyMessage.verify(message.templateButtonReplyMessage);
                if (error)
                    return "templateButtonReplyMessage." + error;
            }
            if (message.productMessage != null && message.hasOwnProperty("productMessage")) {
                var error = $root.proto.ProductMessage.verify(message.productMessage);
                if (error)
                    return "productMessage." + error;
            }
            if (message.deviceSentMessage != null && message.hasOwnProperty("deviceSentMessage")) {
                var error = $root.proto.DeviceSentMessage.verify(message.deviceSentMessage);
                if (error)
                    return "deviceSentMessage." + error;
            }
            if (message.deviceSyncMessage != null && message.hasOwnProperty("deviceSyncMessage")) {
                var error = $root.proto.DeviceSyncMessage.verify(message.deviceSyncMessage);
                if (error)
                    return "deviceSyncMessage." + error;
            }
            return null;
        };

        /**
         * Creates a Message message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Message
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Message} Message
         */
        Message.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Message)
                return object;
            var message = new $root.proto.Message();
            if (object.conversation != null)
                message.conversation = String(object.conversation);
            if (object.senderKeyDistributionMessage != null) {
                if (typeof object.senderKeyDistributionMessage !== "object")
                    throw TypeError(".proto.Message.senderKeyDistributionMessage: object expected");
                message.senderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.fromObject(object.senderKeyDistributionMessage);
            }
            if (object.imageMessage != null) {
                if (typeof object.imageMessage !== "object")
                    throw TypeError(".proto.Message.imageMessage: object expected");
                message.imageMessage = $root.proto.ImageMessage.fromObject(object.imageMessage);
            }
            if (object.contactMessage != null) {
                if (typeof object.contactMessage !== "object")
                    throw TypeError(".proto.Message.contactMessage: object expected");
                message.contactMessage = $root.proto.ContactMessage.fromObject(object.contactMessage);
            }
            if (object.locationMessage != null) {
                if (typeof object.locationMessage !== "object")
                    throw TypeError(".proto.Message.locationMessage: object expected");
                message.locationMessage = $root.proto.LocationMessage.fromObject(object.locationMessage);
            }
            if (object.extendedTextMessage != null) {
                if (typeof object.extendedTextMessage !== "object")
                    throw TypeError(".proto.Message.extendedTextMessage: object expected");
                message.extendedTextMessage = $root.proto.ExtendedTextMessage.fromObject(object.extendedTextMessage);
            }
            if (object.documentMessage != null) {
                if (typeof object.documentMessage !== "object")
                    throw TypeError(".proto.Message.documentMessage: object expected");
                message.documentMessage = $root.proto.DocumentMessage.fromObject(object.documentMessage);
            }
            if (object.audioMessage != null) {
                if (typeof object.audioMessage !== "object")
                    throw TypeError(".proto.Message.audioMessage: object expected");
                message.audioMessage = $root.proto.AudioMessage.fromObject(object.audioMessage);
            }
            if (object.videoMessage != null) {
                if (typeof object.videoMessage !== "object")
                    throw TypeError(".proto.Message.videoMessage: object expected");
                message.videoMessage = $root.proto.VideoMessage.fromObject(object.videoMessage);
            }
            if (object.call != null) {
                if (typeof object.call !== "object")
                    throw TypeError(".proto.Message.call: object expected");
                message.call = $root.proto.Call.fromObject(object.call);
            }
            if (object.chat != null) {
                if (typeof object.chat !== "object")
                    throw TypeError(".proto.Message.chat: object expected");
                message.chat = $root.proto.Chat.fromObject(object.chat);
            }
            if (object.protocolMessage != null) {
                if (typeof object.protocolMessage !== "object")
                    throw TypeError(".proto.Message.protocolMessage: object expected");
                message.protocolMessage = $root.proto.ProtocolMessage.fromObject(object.protocolMessage);
            }
            if (object.contactsArrayMessage != null) {
                if (typeof object.contactsArrayMessage !== "object")
                    throw TypeError(".proto.Message.contactsArrayMessage: object expected");
                message.contactsArrayMessage = $root.proto.ContactsArrayMessage.fromObject(object.contactsArrayMessage);
            }
            if (object.highlyStructuredMessage != null) {
                if (typeof object.highlyStructuredMessage !== "object")
                    throw TypeError(".proto.Message.highlyStructuredMessage: object expected");
                message.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.fromObject(object.highlyStructuredMessage);
            }
            if (object.fastRatchetKeySenderKeyDistributionMessage != null) {
                if (typeof object.fastRatchetKeySenderKeyDistributionMessage !== "object")
                    throw TypeError(".proto.Message.fastRatchetKeySenderKeyDistributionMessage: object expected");
                message.fastRatchetKeySenderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.fromObject(object.fastRatchetKeySenderKeyDistributionMessage);
            }
            if (object.sendPaymentMessage != null) {
                if (typeof object.sendPaymentMessage !== "object")
                    throw TypeError(".proto.Message.sendPaymentMessage: object expected");
                message.sendPaymentMessage = $root.proto.SendPaymentMessage.fromObject(object.sendPaymentMessage);
            }
            if (object.liveLocationMessage != null) {
                if (typeof object.liveLocationMessage !== "object")
                    throw TypeError(".proto.Message.liveLocationMessage: object expected");
                message.liveLocationMessage = $root.proto.LiveLocationMessage.fromObject(object.liveLocationMessage);
            }
            if (object.requestPaymentMessage != null) {
                if (typeof object.requestPaymentMessage !== "object")
                    throw TypeError(".proto.Message.requestPaymentMessage: object expected");
                message.requestPaymentMessage = $root.proto.RequestPaymentMessage.fromObject(object.requestPaymentMessage);
            }
            if (object.declinePaymentRequestMessage != null) {
                if (typeof object.declinePaymentRequestMessage !== "object")
                    throw TypeError(".proto.Message.declinePaymentRequestMessage: object expected");
                message.declinePaymentRequestMessage = $root.proto.DeclinePaymentRequestMessage.fromObject(object.declinePaymentRequestMessage);
            }
            if (object.cancelPaymentRequestMessage != null) {
                if (typeof object.cancelPaymentRequestMessage !== "object")
                    throw TypeError(".proto.Message.cancelPaymentRequestMessage: object expected");
                message.cancelPaymentRequestMessage = $root.proto.CancelPaymentRequestMessage.fromObject(object.cancelPaymentRequestMessage);
            }
            if (object.templateMessage != null) {
                if (typeof object.templateMessage !== "object")
                    throw TypeError(".proto.Message.templateMessage: object expected");
                message.templateMessage = $root.proto.TemplateMessage.fromObject(object.templateMessage);
            }
            if (object.stickerMessage != null) {
                if (typeof object.stickerMessage !== "object")
                    throw TypeError(".proto.Message.stickerMessage: object expected");
                message.stickerMessage = $root.proto.StickerMessage.fromObject(object.stickerMessage);
            }
            if (object.groupInviteMessage != null) {
                if (typeof object.groupInviteMessage !== "object")
                    throw TypeError(".proto.Message.groupInviteMessage: object expected");
                message.groupInviteMessage = $root.proto.GroupInviteMessage.fromObject(object.groupInviteMessage);
            }
            if (object.templateButtonReplyMessage != null) {
                if (typeof object.templateButtonReplyMessage !== "object")
                    throw TypeError(".proto.Message.templateButtonReplyMessage: object expected");
                message.templateButtonReplyMessage = $root.proto.TemplateButtonReplyMessage.fromObject(object.templateButtonReplyMessage);
            }
            if (object.productMessage != null) {
                if (typeof object.productMessage !== "object")
                    throw TypeError(".proto.Message.productMessage: object expected");
                message.productMessage = $root.proto.ProductMessage.fromObject(object.productMessage);
            }
            if (object.deviceSentMessage != null) {
                if (typeof object.deviceSentMessage !== "object")
                    throw TypeError(".proto.Message.deviceSentMessage: object expected");
                message.deviceSentMessage = $root.proto.DeviceSentMessage.fromObject(object.deviceSentMessage);
            }
            if (object.deviceSyncMessage != null) {
                if (typeof object.deviceSyncMessage !== "object")
                    throw TypeError(".proto.Message.deviceSyncMessage: object expected");
                message.deviceSyncMessage = $root.proto.DeviceSyncMessage.fromObject(object.deviceSyncMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a Message message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Message
         * @static
         * @param {proto.Message} message Message
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.conversation = "";
                object.senderKeyDistributionMessage = null;
                object.imageMessage = null;
                object.contactMessage = null;
                object.locationMessage = null;
                object.extendedTextMessage = null;
                object.documentMessage = null;
                object.audioMessage = null;
                object.videoMessage = null;
                object.call = null;
                object.chat = null;
                object.protocolMessage = null;
                object.contactsArrayMessage = null;
                object.highlyStructuredMessage = null;
                object.fastRatchetKeySenderKeyDistributionMessage = null;
                object.sendPaymentMessage = null;
                object.liveLocationMessage = null;
                object.requestPaymentMessage = null;
                object.declinePaymentRequestMessage = null;
                object.cancelPaymentRequestMessage = null;
                object.templateMessage = null;
                object.stickerMessage = null;
                object.groupInviteMessage = null;
                object.templateButtonReplyMessage = null;
                object.productMessage = null;
                object.deviceSentMessage = null;
                object.deviceSyncMessage = null;
            }
            if (message.conversation != null && message.hasOwnProperty("conversation"))
                object.conversation = message.conversation;
            if (message.senderKeyDistributionMessage != null && message.hasOwnProperty("senderKeyDistributionMessage"))
                object.senderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.toObject(message.senderKeyDistributionMessage, options);
            if (message.imageMessage != null && message.hasOwnProperty("imageMessage"))
                object.imageMessage = $root.proto.ImageMessage.toObject(message.imageMessage, options);
            if (message.contactMessage != null && message.hasOwnProperty("contactMessage"))
                object.contactMessage = $root.proto.ContactMessage.toObject(message.contactMessage, options);
            if (message.locationMessage != null && message.hasOwnProperty("locationMessage"))
                object.locationMessage = $root.proto.LocationMessage.toObject(message.locationMessage, options);
            if (message.extendedTextMessage != null && message.hasOwnProperty("extendedTextMessage"))
                object.extendedTextMessage = $root.proto.ExtendedTextMessage.toObject(message.extendedTextMessage, options);
            if (message.documentMessage != null && message.hasOwnProperty("documentMessage"))
                object.documentMessage = $root.proto.DocumentMessage.toObject(message.documentMessage, options);
            if (message.audioMessage != null && message.hasOwnProperty("audioMessage"))
                object.audioMessage = $root.proto.AudioMessage.toObject(message.audioMessage, options);
            if (message.videoMessage != null && message.hasOwnProperty("videoMessage"))
                object.videoMessage = $root.proto.VideoMessage.toObject(message.videoMessage, options);
            if (message.call != null && message.hasOwnProperty("call"))
                object.call = $root.proto.Call.toObject(message.call, options);
            if (message.chat != null && message.hasOwnProperty("chat"))
                object.chat = $root.proto.Chat.toObject(message.chat, options);
            if (message.protocolMessage != null && message.hasOwnProperty("protocolMessage"))
                object.protocolMessage = $root.proto.ProtocolMessage.toObject(message.protocolMessage, options);
            if (message.contactsArrayMessage != null && message.hasOwnProperty("contactsArrayMessage"))
                object.contactsArrayMessage = $root.proto.ContactsArrayMessage.toObject(message.contactsArrayMessage, options);
            if (message.highlyStructuredMessage != null && message.hasOwnProperty("highlyStructuredMessage"))
                object.highlyStructuredMessage = $root.proto.HighlyStructuredMessage.toObject(message.highlyStructuredMessage, options);
            if (message.fastRatchetKeySenderKeyDistributionMessage != null && message.hasOwnProperty("fastRatchetKeySenderKeyDistributionMessage"))
                object.fastRatchetKeySenderKeyDistributionMessage = $root.proto.SenderKeyDistributionMessage.toObject(message.fastRatchetKeySenderKeyDistributionMessage, options);
            if (message.sendPaymentMessage != null && message.hasOwnProperty("sendPaymentMessage"))
                object.sendPaymentMessage = $root.proto.SendPaymentMessage.toObject(message.sendPaymentMessage, options);
            if (message.liveLocationMessage != null && message.hasOwnProperty("liveLocationMessage"))
                object.liveLocationMessage = $root.proto.LiveLocationMessage.toObject(message.liveLocationMessage, options);
            if (message.requestPaymentMessage != null && message.hasOwnProperty("requestPaymentMessage"))
                object.requestPaymentMessage = $root.proto.RequestPaymentMessage.toObject(message.requestPaymentMessage, options);
            if (message.declinePaymentRequestMessage != null && message.hasOwnProperty("declinePaymentRequestMessage"))
                object.declinePaymentRequestMessage = $root.proto.DeclinePaymentRequestMessage.toObject(message.declinePaymentRequestMessage, options);
            if (message.cancelPaymentRequestMessage != null && message.hasOwnProperty("cancelPaymentRequestMessage"))
                object.cancelPaymentRequestMessage = $root.proto.CancelPaymentRequestMessage.toObject(message.cancelPaymentRequestMessage, options);
            if (message.templateMessage != null && message.hasOwnProperty("templateMessage"))
                object.templateMessage = $root.proto.TemplateMessage.toObject(message.templateMessage, options);
            if (message.stickerMessage != null && message.hasOwnProperty("stickerMessage"))
                object.stickerMessage = $root.proto.StickerMessage.toObject(message.stickerMessage, options);
            if (message.groupInviteMessage != null && message.hasOwnProperty("groupInviteMessage"))
                object.groupInviteMessage = $root.proto.GroupInviteMessage.toObject(message.groupInviteMessage, options);
            if (message.templateButtonReplyMessage != null && message.hasOwnProperty("templateButtonReplyMessage"))
                object.templateButtonReplyMessage = $root.proto.TemplateButtonReplyMessage.toObject(message.templateButtonReplyMessage, options);
            if (message.productMessage != null && message.hasOwnProperty("productMessage"))
                object.productMessage = $root.proto.ProductMessage.toObject(message.productMessage, options);
            if (message.deviceSentMessage != null && message.hasOwnProperty("deviceSentMessage"))
                object.deviceSentMessage = $root.proto.DeviceSentMessage.toObject(message.deviceSentMessage, options);
            if (message.deviceSyncMessage != null && message.hasOwnProperty("deviceSyncMessage"))
                object.deviceSyncMessage = $root.proto.DeviceSyncMessage.toObject(message.deviceSyncMessage, options);
            return object;
        };

        /**
         * Converts this Message to JSON.
         * @function toJSON
         * @memberof proto.Message
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Message;
    })();

    proto.MessageKey = (function() {

        /**
         * Properties of a MessageKey.
         * @memberof proto
         * @interface IMessageKey
         * @property {string|null} [remoteJid] MessageKey remoteJid
         * @property {boolean|null} [fromMe] MessageKey fromMe
         * @property {string|null} [id] MessageKey id
         * @property {string|null} [participant] MessageKey participant
         */

        /**
         * Constructs a new MessageKey.
         * @memberof proto
         * @classdesc Represents a MessageKey.
         * @implements IMessageKey
         * @constructor
         * @param {proto.IMessageKey=} [properties] Properties to set
         */
        function MessageKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MessageKey remoteJid.
         * @member {string} remoteJid
         * @memberof proto.MessageKey
         * @instance
         */
        MessageKey.prototype.remoteJid = "";

        /**
         * MessageKey fromMe.
         * @member {boolean} fromMe
         * @memberof proto.MessageKey
         * @instance
         */
        MessageKey.prototype.fromMe = false;

        /**
         * MessageKey id.
         * @member {string} id
         * @memberof proto.MessageKey
         * @instance
         */
        MessageKey.prototype.id = "";

        /**
         * MessageKey participant.
         * @member {string} participant
         * @memberof proto.MessageKey
         * @instance
         */
        MessageKey.prototype.participant = "";

        /**
         * Creates a new MessageKey instance using the specified properties.
         * @function create
         * @memberof proto.MessageKey
         * @static
         * @param {proto.IMessageKey=} [properties] Properties to set
         * @returns {proto.MessageKey} MessageKey instance
         */
        MessageKey.create = function create(properties) {
            return new MessageKey(properties);
        };

        /**
         * Encodes the specified MessageKey message. Does not implicitly {@link proto.MessageKey.verify|verify} messages.
         * @function encode
         * @memberof proto.MessageKey
         * @static
         * @param {proto.IMessageKey} message MessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.remoteJid != null && Object.hasOwnProperty.call(message, "remoteJid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.remoteJid);
            if (message.fromMe != null && Object.hasOwnProperty.call(message, "fromMe"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.fromMe);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.id);
            if (message.participant != null && Object.hasOwnProperty.call(message, "participant"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.participant);
            return writer;
        };

        /**
         * Encodes the specified MessageKey message, length delimited. Does not implicitly {@link proto.MessageKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.MessageKey
         * @static
         * @param {proto.IMessageKey} message MessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MessageKey message from the specified reader or buffer.
         * @function decode
         * @memberof proto.MessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.MessageKey} MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessageKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.MessageKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.remoteJid = reader.string();
                    break;
                case 2:
                    message.fromMe = reader.bool();
                    break;
                case 3:
                    message.id = reader.string();
                    break;
                case 4:
                    message.participant = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MessageKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.MessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.MessageKey} MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessageKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MessageKey message.
         * @function verify
         * @memberof proto.MessageKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MessageKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.remoteJid != null && message.hasOwnProperty("remoteJid"))
                if (!$util.isString(message.remoteJid))
                    return "remoteJid: string expected";
            if (message.fromMe != null && message.hasOwnProperty("fromMe"))
                if (typeof message.fromMe !== "boolean")
                    return "fromMe: boolean expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.participant != null && message.hasOwnProperty("participant"))
                if (!$util.isString(message.participant))
                    return "participant: string expected";
            return null;
        };

        /**
         * Creates a MessageKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.MessageKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.MessageKey} MessageKey
         */
        MessageKey.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.MessageKey)
                return object;
            var message = new $root.proto.MessageKey();
            if (object.remoteJid != null)
                message.remoteJid = String(object.remoteJid);
            if (object.fromMe != null)
                message.fromMe = Boolean(object.fromMe);
            if (object.id != null)
                message.id = String(object.id);
            if (object.participant != null)
                message.participant = String(object.participant);
            return message;
        };

        /**
         * Creates a plain object from a MessageKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.MessageKey
         * @static
         * @param {proto.MessageKey} message MessageKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MessageKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.remoteJid = "";
                object.fromMe = false;
                object.id = "";
                object.participant = "";
            }
            if (message.remoteJid != null && message.hasOwnProperty("remoteJid"))
                object.remoteJid = message.remoteJid;
            if (message.fromMe != null && message.hasOwnProperty("fromMe"))
                object.fromMe = message.fromMe;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.participant != null && message.hasOwnProperty("participant"))
                object.participant = message.participant;
            return object;
        };

        /**
         * Converts this MessageKey to JSON.
         * @function toJSON
         * @memberof proto.MessageKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MessageKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MessageKey;
    })();

    proto.WebFeatures = (function() {

        /**
         * Properties of a WebFeatures.
         * @memberof proto
         * @interface IWebFeatures
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [labelsDisplay] WebFeatures labelsDisplay
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [voipIndividualOutgoing] WebFeatures voipIndividualOutgoing
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [groupsV3] WebFeatures groupsV3
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [groupsV3Create] WebFeatures groupsV3Create
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [changeNumberV2] WebFeatures changeNumberV2
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [queryStatusV3Thumbnail] WebFeatures queryStatusV3Thumbnail
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [liveLocations] WebFeatures liveLocations
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [queryVname] WebFeatures queryVname
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [voipIndividualIncoming] WebFeatures voipIndividualIncoming
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [quickRepliesQuery] WebFeatures quickRepliesQuery
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [payments] WebFeatures payments
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [stickerPackQuery] WebFeatures stickerPackQuery
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [liveLocationsFinal] WebFeatures liveLocationsFinal
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [labelsEdit] WebFeatures labelsEdit
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [mediaUpload] WebFeatures mediaUpload
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [mediaUploadRichQuickReplies] WebFeatures mediaUploadRichQuickReplies
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [vnameV2] WebFeatures vnameV2
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [videoPlaybackUrl] WebFeatures videoPlaybackUrl
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [statusRanking] WebFeatures statusRanking
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [voipIndividualVideo] WebFeatures voipIndividualVideo
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [thirdPartyStickers] WebFeatures thirdPartyStickers
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [frequentlyForwardedSetting] WebFeatures frequentlyForwardedSetting
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [groupsV4JoinPermission] WebFeatures groupsV4JoinPermission
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [recentStickers] WebFeatures recentStickers
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [catalog] WebFeatures catalog
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [starredStickers] WebFeatures starredStickers
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [voipGroupCall] WebFeatures voipGroupCall
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [templateMessage] WebFeatures templateMessage
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [templateMessageInteractivity] WebFeatures templateMessageInteractivity
         * @property {proto.WebFeatures.WEB_FEATURES_FLAG|null} [ephemeralMessages] WebFeatures ephemeralMessages
         */

        /**
         * Constructs a new WebFeatures.
         * @memberof proto
         * @classdesc Represents a WebFeatures.
         * @implements IWebFeatures
         * @constructor
         * @param {proto.IWebFeatures=} [properties] Properties to set
         */
        function WebFeatures(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WebFeatures labelsDisplay.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} labelsDisplay
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.labelsDisplay = 0;

        /**
         * WebFeatures voipIndividualOutgoing.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} voipIndividualOutgoing
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.voipIndividualOutgoing = 0;

        /**
         * WebFeatures groupsV3.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} groupsV3
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.groupsV3 = 0;

        /**
         * WebFeatures groupsV3Create.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} groupsV3Create
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.groupsV3Create = 0;

        /**
         * WebFeatures changeNumberV2.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} changeNumberV2
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.changeNumberV2 = 0;

        /**
         * WebFeatures queryStatusV3Thumbnail.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} queryStatusV3Thumbnail
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.queryStatusV3Thumbnail = 0;

        /**
         * WebFeatures liveLocations.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} liveLocations
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.liveLocations = 0;

        /**
         * WebFeatures queryVname.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} queryVname
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.queryVname = 0;

        /**
         * WebFeatures voipIndividualIncoming.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} voipIndividualIncoming
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.voipIndividualIncoming = 0;

        /**
         * WebFeatures quickRepliesQuery.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} quickRepliesQuery
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.quickRepliesQuery = 0;

        /**
         * WebFeatures payments.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} payments
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.payments = 0;

        /**
         * WebFeatures stickerPackQuery.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} stickerPackQuery
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.stickerPackQuery = 0;

        /**
         * WebFeatures liveLocationsFinal.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} liveLocationsFinal
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.liveLocationsFinal = 0;

        /**
         * WebFeatures labelsEdit.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} labelsEdit
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.labelsEdit = 0;

        /**
         * WebFeatures mediaUpload.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} mediaUpload
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.mediaUpload = 0;

        /**
         * WebFeatures mediaUploadRichQuickReplies.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} mediaUploadRichQuickReplies
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.mediaUploadRichQuickReplies = 0;

        /**
         * WebFeatures vnameV2.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} vnameV2
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.vnameV2 = 0;

        /**
         * WebFeatures videoPlaybackUrl.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} videoPlaybackUrl
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.videoPlaybackUrl = 0;

        /**
         * WebFeatures statusRanking.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} statusRanking
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.statusRanking = 0;

        /**
         * WebFeatures voipIndividualVideo.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} voipIndividualVideo
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.voipIndividualVideo = 0;

        /**
         * WebFeatures thirdPartyStickers.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} thirdPartyStickers
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.thirdPartyStickers = 0;

        /**
         * WebFeatures frequentlyForwardedSetting.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} frequentlyForwardedSetting
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.frequentlyForwardedSetting = 0;

        /**
         * WebFeatures groupsV4JoinPermission.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} groupsV4JoinPermission
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.groupsV4JoinPermission = 0;

        /**
         * WebFeatures recentStickers.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} recentStickers
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.recentStickers = 0;

        /**
         * WebFeatures catalog.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} catalog
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.catalog = 0;

        /**
         * WebFeatures starredStickers.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} starredStickers
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.starredStickers = 0;

        /**
         * WebFeatures voipGroupCall.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} voipGroupCall
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.voipGroupCall = 0;

        /**
         * WebFeatures templateMessage.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} templateMessage
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.templateMessage = 0;

        /**
         * WebFeatures templateMessageInteractivity.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} templateMessageInteractivity
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.templateMessageInteractivity = 0;

        /**
         * WebFeatures ephemeralMessages.
         * @member {proto.WebFeatures.WEB_FEATURES_FLAG} ephemeralMessages
         * @memberof proto.WebFeatures
         * @instance
         */
        WebFeatures.prototype.ephemeralMessages = 0;

        /**
         * Creates a new WebFeatures instance using the specified properties.
         * @function create
         * @memberof proto.WebFeatures
         * @static
         * @param {proto.IWebFeatures=} [properties] Properties to set
         * @returns {proto.WebFeatures} WebFeatures instance
         */
        WebFeatures.create = function create(properties) {
            return new WebFeatures(properties);
        };

        /**
         * Encodes the specified WebFeatures message. Does not implicitly {@link proto.WebFeatures.verify|verify} messages.
         * @function encode
         * @memberof proto.WebFeatures
         * @static
         * @param {proto.IWebFeatures} message WebFeatures message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebFeatures.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.labelsDisplay != null && Object.hasOwnProperty.call(message, "labelsDisplay"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.labelsDisplay);
            if (message.voipIndividualOutgoing != null && Object.hasOwnProperty.call(message, "voipIndividualOutgoing"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.voipIndividualOutgoing);
            if (message.groupsV3 != null && Object.hasOwnProperty.call(message, "groupsV3"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.groupsV3);
            if (message.groupsV3Create != null && Object.hasOwnProperty.call(message, "groupsV3Create"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.groupsV3Create);
            if (message.changeNumberV2 != null && Object.hasOwnProperty.call(message, "changeNumberV2"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.changeNumberV2);
            if (message.queryStatusV3Thumbnail != null && Object.hasOwnProperty.call(message, "queryStatusV3Thumbnail"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.queryStatusV3Thumbnail);
            if (message.liveLocations != null && Object.hasOwnProperty.call(message, "liveLocations"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.liveLocations);
            if (message.queryVname != null && Object.hasOwnProperty.call(message, "queryVname"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.queryVname);
            if (message.voipIndividualIncoming != null && Object.hasOwnProperty.call(message, "voipIndividualIncoming"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.voipIndividualIncoming);
            if (message.quickRepliesQuery != null && Object.hasOwnProperty.call(message, "quickRepliesQuery"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.quickRepliesQuery);
            if (message.payments != null && Object.hasOwnProperty.call(message, "payments"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.payments);
            if (message.stickerPackQuery != null && Object.hasOwnProperty.call(message, "stickerPackQuery"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.stickerPackQuery);
            if (message.liveLocationsFinal != null && Object.hasOwnProperty.call(message, "liveLocationsFinal"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.liveLocationsFinal);
            if (message.labelsEdit != null && Object.hasOwnProperty.call(message, "labelsEdit"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.labelsEdit);
            if (message.mediaUpload != null && Object.hasOwnProperty.call(message, "mediaUpload"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.mediaUpload);
            if (message.mediaUploadRichQuickReplies != null && Object.hasOwnProperty.call(message, "mediaUploadRichQuickReplies"))
                writer.uint32(/* id 18, wireType 0 =*/144).int32(message.mediaUploadRichQuickReplies);
            if (message.vnameV2 != null && Object.hasOwnProperty.call(message, "vnameV2"))
                writer.uint32(/* id 19, wireType 0 =*/152).int32(message.vnameV2);
            if (message.videoPlaybackUrl != null && Object.hasOwnProperty.call(message, "videoPlaybackUrl"))
                writer.uint32(/* id 20, wireType 0 =*/160).int32(message.videoPlaybackUrl);
            if (message.statusRanking != null && Object.hasOwnProperty.call(message, "statusRanking"))
                writer.uint32(/* id 21, wireType 0 =*/168).int32(message.statusRanking);
            if (message.voipIndividualVideo != null && Object.hasOwnProperty.call(message, "voipIndividualVideo"))
                writer.uint32(/* id 22, wireType 0 =*/176).int32(message.voipIndividualVideo);
            if (message.thirdPartyStickers != null && Object.hasOwnProperty.call(message, "thirdPartyStickers"))
                writer.uint32(/* id 23, wireType 0 =*/184).int32(message.thirdPartyStickers);
            if (message.frequentlyForwardedSetting != null && Object.hasOwnProperty.call(message, "frequentlyForwardedSetting"))
                writer.uint32(/* id 24, wireType 0 =*/192).int32(message.frequentlyForwardedSetting);
            if (message.groupsV4JoinPermission != null && Object.hasOwnProperty.call(message, "groupsV4JoinPermission"))
                writer.uint32(/* id 25, wireType 0 =*/200).int32(message.groupsV4JoinPermission);
            if (message.recentStickers != null && Object.hasOwnProperty.call(message, "recentStickers"))
                writer.uint32(/* id 26, wireType 0 =*/208).int32(message.recentStickers);
            if (message.catalog != null && Object.hasOwnProperty.call(message, "catalog"))
                writer.uint32(/* id 27, wireType 0 =*/216).int32(message.catalog);
            if (message.starredStickers != null && Object.hasOwnProperty.call(message, "starredStickers"))
                writer.uint32(/* id 28, wireType 0 =*/224).int32(message.starredStickers);
            if (message.voipGroupCall != null && Object.hasOwnProperty.call(message, "voipGroupCall"))
                writer.uint32(/* id 29, wireType 0 =*/232).int32(message.voipGroupCall);
            if (message.templateMessage != null && Object.hasOwnProperty.call(message, "templateMessage"))
                writer.uint32(/* id 30, wireType 0 =*/240).int32(message.templateMessage);
            if (message.templateMessageInteractivity != null && Object.hasOwnProperty.call(message, "templateMessageInteractivity"))
                writer.uint32(/* id 31, wireType 0 =*/248).int32(message.templateMessageInteractivity);
            if (message.ephemeralMessages != null && Object.hasOwnProperty.call(message, "ephemeralMessages"))
                writer.uint32(/* id 32, wireType 0 =*/256).int32(message.ephemeralMessages);
            return writer;
        };

        /**
         * Encodes the specified WebFeatures message, length delimited. Does not implicitly {@link proto.WebFeatures.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.WebFeatures
         * @static
         * @param {proto.IWebFeatures} message WebFeatures message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebFeatures.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WebFeatures message from the specified reader or buffer.
         * @function decode
         * @memberof proto.WebFeatures
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.WebFeatures} WebFeatures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebFeatures.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.WebFeatures();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.labelsDisplay = reader.int32();
                    break;
                case 2:
                    message.voipIndividualOutgoing = reader.int32();
                    break;
                case 3:
                    message.groupsV3 = reader.int32();
                    break;
                case 4:
                    message.groupsV3Create = reader.int32();
                    break;
                case 5:
                    message.changeNumberV2 = reader.int32();
                    break;
                case 6:
                    message.queryStatusV3Thumbnail = reader.int32();
                    break;
                case 7:
                    message.liveLocations = reader.int32();
                    break;
                case 8:
                    message.queryVname = reader.int32();
                    break;
                case 9:
                    message.voipIndividualIncoming = reader.int32();
                    break;
                case 10:
                    message.quickRepliesQuery = reader.int32();
                    break;
                case 11:
                    message.payments = reader.int32();
                    break;
                case 12:
                    message.stickerPackQuery = reader.int32();
                    break;
                case 13:
                    message.liveLocationsFinal = reader.int32();
                    break;
                case 14:
                    message.labelsEdit = reader.int32();
                    break;
                case 15:
                    message.mediaUpload = reader.int32();
                    break;
                case 18:
                    message.mediaUploadRichQuickReplies = reader.int32();
                    break;
                case 19:
                    message.vnameV2 = reader.int32();
                    break;
                case 20:
                    message.videoPlaybackUrl = reader.int32();
                    break;
                case 21:
                    message.statusRanking = reader.int32();
                    break;
                case 22:
                    message.voipIndividualVideo = reader.int32();
                    break;
                case 23:
                    message.thirdPartyStickers = reader.int32();
                    break;
                case 24:
                    message.frequentlyForwardedSetting = reader.int32();
                    break;
                case 25:
                    message.groupsV4JoinPermission = reader.int32();
                    break;
                case 26:
                    message.recentStickers = reader.int32();
                    break;
                case 27:
                    message.catalog = reader.int32();
                    break;
                case 28:
                    message.starredStickers = reader.int32();
                    break;
                case 29:
                    message.voipGroupCall = reader.int32();
                    break;
                case 30:
                    message.templateMessage = reader.int32();
                    break;
                case 31:
                    message.templateMessageInteractivity = reader.int32();
                    break;
                case 32:
                    message.ephemeralMessages = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WebFeatures message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.WebFeatures
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.WebFeatures} WebFeatures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebFeatures.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WebFeatures message.
         * @function verify
         * @memberof proto.WebFeatures
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WebFeatures.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.labelsDisplay != null && message.hasOwnProperty("labelsDisplay"))
                switch (message.labelsDisplay) {
                default:
                    return "labelsDisplay: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.voipIndividualOutgoing != null && message.hasOwnProperty("voipIndividualOutgoing"))
                switch (message.voipIndividualOutgoing) {
                default:
                    return "voipIndividualOutgoing: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.groupsV3 != null && message.hasOwnProperty("groupsV3"))
                switch (message.groupsV3) {
                default:
                    return "groupsV3: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.groupsV3Create != null && message.hasOwnProperty("groupsV3Create"))
                switch (message.groupsV3Create) {
                default:
                    return "groupsV3Create: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.changeNumberV2 != null && message.hasOwnProperty("changeNumberV2"))
                switch (message.changeNumberV2) {
                default:
                    return "changeNumberV2: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.queryStatusV3Thumbnail != null && message.hasOwnProperty("queryStatusV3Thumbnail"))
                switch (message.queryStatusV3Thumbnail) {
                default:
                    return "queryStatusV3Thumbnail: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.liveLocations != null && message.hasOwnProperty("liveLocations"))
                switch (message.liveLocations) {
                default:
                    return "liveLocations: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.queryVname != null && message.hasOwnProperty("queryVname"))
                switch (message.queryVname) {
                default:
                    return "queryVname: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.voipIndividualIncoming != null && message.hasOwnProperty("voipIndividualIncoming"))
                switch (message.voipIndividualIncoming) {
                default:
                    return "voipIndividualIncoming: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.quickRepliesQuery != null && message.hasOwnProperty("quickRepliesQuery"))
                switch (message.quickRepliesQuery) {
                default:
                    return "quickRepliesQuery: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.payments != null && message.hasOwnProperty("payments"))
                switch (message.payments) {
                default:
                    return "payments: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.stickerPackQuery != null && message.hasOwnProperty("stickerPackQuery"))
                switch (message.stickerPackQuery) {
                default:
                    return "stickerPackQuery: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.liveLocationsFinal != null && message.hasOwnProperty("liveLocationsFinal"))
                switch (message.liveLocationsFinal) {
                default:
                    return "liveLocationsFinal: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.labelsEdit != null && message.hasOwnProperty("labelsEdit"))
                switch (message.labelsEdit) {
                default:
                    return "labelsEdit: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.mediaUpload != null && message.hasOwnProperty("mediaUpload"))
                switch (message.mediaUpload) {
                default:
                    return "mediaUpload: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.mediaUploadRichQuickReplies != null && message.hasOwnProperty("mediaUploadRichQuickReplies"))
                switch (message.mediaUploadRichQuickReplies) {
                default:
                    return "mediaUploadRichQuickReplies: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.vnameV2 != null && message.hasOwnProperty("vnameV2"))
                switch (message.vnameV2) {
                default:
                    return "vnameV2: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.videoPlaybackUrl != null && message.hasOwnProperty("videoPlaybackUrl"))
                switch (message.videoPlaybackUrl) {
                default:
                    return "videoPlaybackUrl: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.statusRanking != null && message.hasOwnProperty("statusRanking"))
                switch (message.statusRanking) {
                default:
                    return "statusRanking: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.voipIndividualVideo != null && message.hasOwnProperty("voipIndividualVideo"))
                switch (message.voipIndividualVideo) {
                default:
                    return "voipIndividualVideo: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.thirdPartyStickers != null && message.hasOwnProperty("thirdPartyStickers"))
                switch (message.thirdPartyStickers) {
                default:
                    return "thirdPartyStickers: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.frequentlyForwardedSetting != null && message.hasOwnProperty("frequentlyForwardedSetting"))
                switch (message.frequentlyForwardedSetting) {
                default:
                    return "frequentlyForwardedSetting: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.groupsV4JoinPermission != null && message.hasOwnProperty("groupsV4JoinPermission"))
                switch (message.groupsV4JoinPermission) {
                default:
                    return "groupsV4JoinPermission: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.recentStickers != null && message.hasOwnProperty("recentStickers"))
                switch (message.recentStickers) {
                default:
                    return "recentStickers: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.catalog != null && message.hasOwnProperty("catalog"))
                switch (message.catalog) {
                default:
                    return "catalog: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.starredStickers != null && message.hasOwnProperty("starredStickers"))
                switch (message.starredStickers) {
                default:
                    return "starredStickers: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.voipGroupCall != null && message.hasOwnProperty("voipGroupCall"))
                switch (message.voipGroupCall) {
                default:
                    return "voipGroupCall: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.templateMessage != null && message.hasOwnProperty("templateMessage"))
                switch (message.templateMessage) {
                default:
                    return "templateMessage: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.templateMessageInteractivity != null && message.hasOwnProperty("templateMessageInteractivity"))
                switch (message.templateMessageInteractivity) {
                default:
                    return "templateMessageInteractivity: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.ephemeralMessages != null && message.hasOwnProperty("ephemeralMessages"))
                switch (message.ephemeralMessages) {
                default:
                    return "ephemeralMessages: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates a WebFeatures message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.WebFeatures
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.WebFeatures} WebFeatures
         */
        WebFeatures.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.WebFeatures)
                return object;
            var message = new $root.proto.WebFeatures();
            switch (object.labelsDisplay) {
            case "NOT_STARTED":
            case 0:
                message.labelsDisplay = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.labelsDisplay = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.labelsDisplay = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.labelsDisplay = 3;
                break;
            }
            switch (object.voipIndividualOutgoing) {
            case "NOT_STARTED":
            case 0:
                message.voipIndividualOutgoing = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.voipIndividualOutgoing = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.voipIndividualOutgoing = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.voipIndividualOutgoing = 3;
                break;
            }
            switch (object.groupsV3) {
            case "NOT_STARTED":
            case 0:
                message.groupsV3 = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.groupsV3 = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.groupsV3 = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.groupsV3 = 3;
                break;
            }
            switch (object.groupsV3Create) {
            case "NOT_STARTED":
            case 0:
                message.groupsV3Create = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.groupsV3Create = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.groupsV3Create = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.groupsV3Create = 3;
                break;
            }
            switch (object.changeNumberV2) {
            case "NOT_STARTED":
            case 0:
                message.changeNumberV2 = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.changeNumberV2 = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.changeNumberV2 = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.changeNumberV2 = 3;
                break;
            }
            switch (object.queryStatusV3Thumbnail) {
            case "NOT_STARTED":
            case 0:
                message.queryStatusV3Thumbnail = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.queryStatusV3Thumbnail = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.queryStatusV3Thumbnail = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.queryStatusV3Thumbnail = 3;
                break;
            }
            switch (object.liveLocations) {
            case "NOT_STARTED":
            case 0:
                message.liveLocations = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.liveLocations = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.liveLocations = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.liveLocations = 3;
                break;
            }
            switch (object.queryVname) {
            case "NOT_STARTED":
            case 0:
                message.queryVname = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.queryVname = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.queryVname = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.queryVname = 3;
                break;
            }
            switch (object.voipIndividualIncoming) {
            case "NOT_STARTED":
            case 0:
                message.voipIndividualIncoming = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.voipIndividualIncoming = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.voipIndividualIncoming = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.voipIndividualIncoming = 3;
                break;
            }
            switch (object.quickRepliesQuery) {
            case "NOT_STARTED":
            case 0:
                message.quickRepliesQuery = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.quickRepliesQuery = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.quickRepliesQuery = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.quickRepliesQuery = 3;
                break;
            }
            switch (object.payments) {
            case "NOT_STARTED":
            case 0:
                message.payments = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.payments = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.payments = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.payments = 3;
                break;
            }
            switch (object.stickerPackQuery) {
            case "NOT_STARTED":
            case 0:
                message.stickerPackQuery = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.stickerPackQuery = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.stickerPackQuery = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.stickerPackQuery = 3;
                break;
            }
            switch (object.liveLocationsFinal) {
            case "NOT_STARTED":
            case 0:
                message.liveLocationsFinal = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.liveLocationsFinal = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.liveLocationsFinal = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.liveLocationsFinal = 3;
                break;
            }
            switch (object.labelsEdit) {
            case "NOT_STARTED":
            case 0:
                message.labelsEdit = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.labelsEdit = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.labelsEdit = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.labelsEdit = 3;
                break;
            }
            switch (object.mediaUpload) {
            case "NOT_STARTED":
            case 0:
                message.mediaUpload = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.mediaUpload = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.mediaUpload = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.mediaUpload = 3;
                break;
            }
            switch (object.mediaUploadRichQuickReplies) {
            case "NOT_STARTED":
            case 0:
                message.mediaUploadRichQuickReplies = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.mediaUploadRichQuickReplies = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.mediaUploadRichQuickReplies = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.mediaUploadRichQuickReplies = 3;
                break;
            }
            switch (object.vnameV2) {
            case "NOT_STARTED":
            case 0:
                message.vnameV2 = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.vnameV2 = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.vnameV2 = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.vnameV2 = 3;
                break;
            }
            switch (object.videoPlaybackUrl) {
            case "NOT_STARTED":
            case 0:
                message.videoPlaybackUrl = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.videoPlaybackUrl = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.videoPlaybackUrl = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.videoPlaybackUrl = 3;
                break;
            }
            switch (object.statusRanking) {
            case "NOT_STARTED":
            case 0:
                message.statusRanking = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.statusRanking = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.statusRanking = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.statusRanking = 3;
                break;
            }
            switch (object.voipIndividualVideo) {
            case "NOT_STARTED":
            case 0:
                message.voipIndividualVideo = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.voipIndividualVideo = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.voipIndividualVideo = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.voipIndividualVideo = 3;
                break;
            }
            switch (object.thirdPartyStickers) {
            case "NOT_STARTED":
            case 0:
                message.thirdPartyStickers = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.thirdPartyStickers = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.thirdPartyStickers = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.thirdPartyStickers = 3;
                break;
            }
            switch (object.frequentlyForwardedSetting) {
            case "NOT_STARTED":
            case 0:
                message.frequentlyForwardedSetting = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.frequentlyForwardedSetting = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.frequentlyForwardedSetting = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.frequentlyForwardedSetting = 3;
                break;
            }
            switch (object.groupsV4JoinPermission) {
            case "NOT_STARTED":
            case 0:
                message.groupsV4JoinPermission = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.groupsV4JoinPermission = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.groupsV4JoinPermission = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.groupsV4JoinPermission = 3;
                break;
            }
            switch (object.recentStickers) {
            case "NOT_STARTED":
            case 0:
                message.recentStickers = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.recentStickers = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.recentStickers = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.recentStickers = 3;
                break;
            }
            switch (object.catalog) {
            case "NOT_STARTED":
            case 0:
                message.catalog = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.catalog = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.catalog = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.catalog = 3;
                break;
            }
            switch (object.starredStickers) {
            case "NOT_STARTED":
            case 0:
                message.starredStickers = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.starredStickers = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.starredStickers = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.starredStickers = 3;
                break;
            }
            switch (object.voipGroupCall) {
            case "NOT_STARTED":
            case 0:
                message.voipGroupCall = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.voipGroupCall = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.voipGroupCall = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.voipGroupCall = 3;
                break;
            }
            switch (object.templateMessage) {
            case "NOT_STARTED":
            case 0:
                message.templateMessage = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.templateMessage = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.templateMessage = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.templateMessage = 3;
                break;
            }
            switch (object.templateMessageInteractivity) {
            case "NOT_STARTED":
            case 0:
                message.templateMessageInteractivity = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.templateMessageInteractivity = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.templateMessageInteractivity = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.templateMessageInteractivity = 3;
                break;
            }
            switch (object.ephemeralMessages) {
            case "NOT_STARTED":
            case 0:
                message.ephemeralMessages = 0;
                break;
            case "FORCE_UPGRADE":
            case 1:
                message.ephemeralMessages = 1;
                break;
            case "DEVELOPMENT":
            case 2:
                message.ephemeralMessages = 2;
                break;
            case "PRODUCTION":
            case 3:
                message.ephemeralMessages = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a WebFeatures message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.WebFeatures
         * @static
         * @param {proto.WebFeatures} message WebFeatures
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WebFeatures.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.labelsDisplay = options.enums === String ? "NOT_STARTED" : 0;
                object.voipIndividualOutgoing = options.enums === String ? "NOT_STARTED" : 0;
                object.groupsV3 = options.enums === String ? "NOT_STARTED" : 0;
                object.groupsV3Create = options.enums === String ? "NOT_STARTED" : 0;
                object.changeNumberV2 = options.enums === String ? "NOT_STARTED" : 0;
                object.queryStatusV3Thumbnail = options.enums === String ? "NOT_STARTED" : 0;
                object.liveLocations = options.enums === String ? "NOT_STARTED" : 0;
                object.queryVname = options.enums === String ? "NOT_STARTED" : 0;
                object.voipIndividualIncoming = options.enums === String ? "NOT_STARTED" : 0;
                object.quickRepliesQuery = options.enums === String ? "NOT_STARTED" : 0;
                object.payments = options.enums === String ? "NOT_STARTED" : 0;
                object.stickerPackQuery = options.enums === String ? "NOT_STARTED" : 0;
                object.liveLocationsFinal = options.enums === String ? "NOT_STARTED" : 0;
                object.labelsEdit = options.enums === String ? "NOT_STARTED" : 0;
                object.mediaUpload = options.enums === String ? "NOT_STARTED" : 0;
                object.mediaUploadRichQuickReplies = options.enums === String ? "NOT_STARTED" : 0;
                object.vnameV2 = options.enums === String ? "NOT_STARTED" : 0;
                object.videoPlaybackUrl = options.enums === String ? "NOT_STARTED" : 0;
                object.statusRanking = options.enums === String ? "NOT_STARTED" : 0;
                object.voipIndividualVideo = options.enums === String ? "NOT_STARTED" : 0;
                object.thirdPartyStickers = options.enums === String ? "NOT_STARTED" : 0;
                object.frequentlyForwardedSetting = options.enums === String ? "NOT_STARTED" : 0;
                object.groupsV4JoinPermission = options.enums === String ? "NOT_STARTED" : 0;
                object.recentStickers = options.enums === String ? "NOT_STARTED" : 0;
                object.catalog = options.enums === String ? "NOT_STARTED" : 0;
                object.starredStickers = options.enums === String ? "NOT_STARTED" : 0;
                object.voipGroupCall = options.enums === String ? "NOT_STARTED" : 0;
                object.templateMessage = options.enums === String ? "NOT_STARTED" : 0;
                object.templateMessageInteractivity = options.enums === String ? "NOT_STARTED" : 0;
                object.ephemeralMessages = options.enums === String ? "NOT_STARTED" : 0;
            }
            if (message.labelsDisplay != null && message.hasOwnProperty("labelsDisplay"))
                object.labelsDisplay = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.labelsDisplay] : message.labelsDisplay;
            if (message.voipIndividualOutgoing != null && message.hasOwnProperty("voipIndividualOutgoing"))
                object.voipIndividualOutgoing = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.voipIndividualOutgoing] : message.voipIndividualOutgoing;
            if (message.groupsV3 != null && message.hasOwnProperty("groupsV3"))
                object.groupsV3 = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.groupsV3] : message.groupsV3;
            if (message.groupsV3Create != null && message.hasOwnProperty("groupsV3Create"))
                object.groupsV3Create = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.groupsV3Create] : message.groupsV3Create;
            if (message.changeNumberV2 != null && message.hasOwnProperty("changeNumberV2"))
                object.changeNumberV2 = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.changeNumberV2] : message.changeNumberV2;
            if (message.queryStatusV3Thumbnail != null && message.hasOwnProperty("queryStatusV3Thumbnail"))
                object.queryStatusV3Thumbnail = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.queryStatusV3Thumbnail] : message.queryStatusV3Thumbnail;
            if (message.liveLocations != null && message.hasOwnProperty("liveLocations"))
                object.liveLocations = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.liveLocations] : message.liveLocations;
            if (message.queryVname != null && message.hasOwnProperty("queryVname"))
                object.queryVname = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.queryVname] : message.queryVname;
            if (message.voipIndividualIncoming != null && message.hasOwnProperty("voipIndividualIncoming"))
                object.voipIndividualIncoming = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.voipIndividualIncoming] : message.voipIndividualIncoming;
            if (message.quickRepliesQuery != null && message.hasOwnProperty("quickRepliesQuery"))
                object.quickRepliesQuery = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.quickRepliesQuery] : message.quickRepliesQuery;
            if (message.payments != null && message.hasOwnProperty("payments"))
                object.payments = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.payments] : message.payments;
            if (message.stickerPackQuery != null && message.hasOwnProperty("stickerPackQuery"))
                object.stickerPackQuery = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.stickerPackQuery] : message.stickerPackQuery;
            if (message.liveLocationsFinal != null && message.hasOwnProperty("liveLocationsFinal"))
                object.liveLocationsFinal = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.liveLocationsFinal] : message.liveLocationsFinal;
            if (message.labelsEdit != null && message.hasOwnProperty("labelsEdit"))
                object.labelsEdit = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.labelsEdit] : message.labelsEdit;
            if (message.mediaUpload != null && message.hasOwnProperty("mediaUpload"))
                object.mediaUpload = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.mediaUpload] : message.mediaUpload;
            if (message.mediaUploadRichQuickReplies != null && message.hasOwnProperty("mediaUploadRichQuickReplies"))
                object.mediaUploadRichQuickReplies = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.mediaUploadRichQuickReplies] : message.mediaUploadRichQuickReplies;
            if (message.vnameV2 != null && message.hasOwnProperty("vnameV2"))
                object.vnameV2 = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.vnameV2] : message.vnameV2;
            if (message.videoPlaybackUrl != null && message.hasOwnProperty("videoPlaybackUrl"))
                object.videoPlaybackUrl = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.videoPlaybackUrl] : message.videoPlaybackUrl;
            if (message.statusRanking != null && message.hasOwnProperty("statusRanking"))
                object.statusRanking = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.statusRanking] : message.statusRanking;
            if (message.voipIndividualVideo != null && message.hasOwnProperty("voipIndividualVideo"))
                object.voipIndividualVideo = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.voipIndividualVideo] : message.voipIndividualVideo;
            if (message.thirdPartyStickers != null && message.hasOwnProperty("thirdPartyStickers"))
                object.thirdPartyStickers = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.thirdPartyStickers] : message.thirdPartyStickers;
            if (message.frequentlyForwardedSetting != null && message.hasOwnProperty("frequentlyForwardedSetting"))
                object.frequentlyForwardedSetting = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.frequentlyForwardedSetting] : message.frequentlyForwardedSetting;
            if (message.groupsV4JoinPermission != null && message.hasOwnProperty("groupsV4JoinPermission"))
                object.groupsV4JoinPermission = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.groupsV4JoinPermission] : message.groupsV4JoinPermission;
            if (message.recentStickers != null && message.hasOwnProperty("recentStickers"))
                object.recentStickers = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.recentStickers] : message.recentStickers;
            if (message.catalog != null && message.hasOwnProperty("catalog"))
                object.catalog = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.catalog] : message.catalog;
            if (message.starredStickers != null && message.hasOwnProperty("starredStickers"))
                object.starredStickers = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.starredStickers] : message.starredStickers;
            if (message.voipGroupCall != null && message.hasOwnProperty("voipGroupCall"))
                object.voipGroupCall = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.voipGroupCall] : message.voipGroupCall;
            if (message.templateMessage != null && message.hasOwnProperty("templateMessage"))
                object.templateMessage = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.templateMessage] : message.templateMessage;
            if (message.templateMessageInteractivity != null && message.hasOwnProperty("templateMessageInteractivity"))
                object.templateMessageInteractivity = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.templateMessageInteractivity] : message.templateMessageInteractivity;
            if (message.ephemeralMessages != null && message.hasOwnProperty("ephemeralMessages"))
                object.ephemeralMessages = options.enums === String ? $root.proto.WebFeatures.WEB_FEATURES_FLAG[message.ephemeralMessages] : message.ephemeralMessages;
            return object;
        };

        /**
         * Converts this WebFeatures to JSON.
         * @function toJSON
         * @memberof proto.WebFeatures
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WebFeatures.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * WEB_FEATURES_FLAG enum.
         * @name proto.WebFeatures.WEB_FEATURES_FLAG
         * @enum {number}
         * @property {number} NOT_STARTED=0 NOT_STARTED value
         * @property {number} FORCE_UPGRADE=1 FORCE_UPGRADE value
         * @property {number} DEVELOPMENT=2 DEVELOPMENT value
         * @property {number} PRODUCTION=3 PRODUCTION value
         */
        WebFeatures.WEB_FEATURES_FLAG = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NOT_STARTED"] = 0;
            values[valuesById[1] = "FORCE_UPGRADE"] = 1;
            values[valuesById[2] = "DEVELOPMENT"] = 2;
            values[valuesById[3] = "PRODUCTION"] = 3;
            return values;
        })();

        return WebFeatures;
    })();

    proto.TabletNotificationsInfo = (function() {

        /**
         * Properties of a TabletNotificationsInfo.
         * @memberof proto
         * @interface ITabletNotificationsInfo
         * @property {number|Long|null} [timestamp] TabletNotificationsInfo timestamp
         * @property {number|null} [unreadChats] TabletNotificationsInfo unreadChats
         * @property {number|null} [notifyMessageCount] TabletNotificationsInfo notifyMessageCount
         * @property {Array.<proto.INotificationMessageInfo>|null} [notifyMessage] TabletNotificationsInfo notifyMessage
         */

        /**
         * Constructs a new TabletNotificationsInfo.
         * @memberof proto
         * @classdesc Represents a TabletNotificationsInfo.
         * @implements ITabletNotificationsInfo
         * @constructor
         * @param {proto.ITabletNotificationsInfo=} [properties] Properties to set
         */
        function TabletNotificationsInfo(properties) {
            this.notifyMessage = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TabletNotificationsInfo timestamp.
         * @member {number|Long} timestamp
         * @memberof proto.TabletNotificationsInfo
         * @instance
         */
        TabletNotificationsInfo.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * TabletNotificationsInfo unreadChats.
         * @member {number} unreadChats
         * @memberof proto.TabletNotificationsInfo
         * @instance
         */
        TabletNotificationsInfo.prototype.unreadChats = 0;

        /**
         * TabletNotificationsInfo notifyMessageCount.
         * @member {number} notifyMessageCount
         * @memberof proto.TabletNotificationsInfo
         * @instance
         */
        TabletNotificationsInfo.prototype.notifyMessageCount = 0;

        /**
         * TabletNotificationsInfo notifyMessage.
         * @member {Array.<proto.INotificationMessageInfo>} notifyMessage
         * @memberof proto.TabletNotificationsInfo
         * @instance
         */
        TabletNotificationsInfo.prototype.notifyMessage = $util.emptyArray;

        /**
         * Creates a new TabletNotificationsInfo instance using the specified properties.
         * @function create
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {proto.ITabletNotificationsInfo=} [properties] Properties to set
         * @returns {proto.TabletNotificationsInfo} TabletNotificationsInfo instance
         */
        TabletNotificationsInfo.create = function create(properties) {
            return new TabletNotificationsInfo(properties);
        };

        /**
         * Encodes the specified TabletNotificationsInfo message. Does not implicitly {@link proto.TabletNotificationsInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {proto.ITabletNotificationsInfo} message TabletNotificationsInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TabletNotificationsInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.unreadChats != null && Object.hasOwnProperty.call(message, "unreadChats"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.unreadChats);
            if (message.notifyMessageCount != null && Object.hasOwnProperty.call(message, "notifyMessageCount"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.notifyMessageCount);
            if (message.notifyMessage != null && message.notifyMessage.length)
                for (var i = 0; i < message.notifyMessage.length; ++i)
                    $root.proto.NotificationMessageInfo.encode(message.notifyMessage[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TabletNotificationsInfo message, length delimited. Does not implicitly {@link proto.TabletNotificationsInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {proto.ITabletNotificationsInfo} message TabletNotificationsInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TabletNotificationsInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TabletNotificationsInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.TabletNotificationsInfo} TabletNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TabletNotificationsInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.TabletNotificationsInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.unreadChats = reader.uint32();
                    break;
                case 4:
                    message.notifyMessageCount = reader.uint32();
                    break;
                case 5:
                    if (!(message.notifyMessage && message.notifyMessage.length))
                        message.notifyMessage = [];
                    message.notifyMessage.push($root.proto.NotificationMessageInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TabletNotificationsInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.TabletNotificationsInfo} TabletNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TabletNotificationsInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TabletNotificationsInfo message.
         * @function verify
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TabletNotificationsInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.unreadChats != null && message.hasOwnProperty("unreadChats"))
                if (!$util.isInteger(message.unreadChats))
                    return "unreadChats: integer expected";
            if (message.notifyMessageCount != null && message.hasOwnProperty("notifyMessageCount"))
                if (!$util.isInteger(message.notifyMessageCount))
                    return "notifyMessageCount: integer expected";
            if (message.notifyMessage != null && message.hasOwnProperty("notifyMessage")) {
                if (!Array.isArray(message.notifyMessage))
                    return "notifyMessage: array expected";
                for (var i = 0; i < message.notifyMessage.length; ++i) {
                    var error = $root.proto.NotificationMessageInfo.verify(message.notifyMessage[i]);
                    if (error)
                        return "notifyMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TabletNotificationsInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.TabletNotificationsInfo} TabletNotificationsInfo
         */
        TabletNotificationsInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.TabletNotificationsInfo)
                return object;
            var message = new $root.proto.TabletNotificationsInfo();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.unreadChats != null)
                message.unreadChats = object.unreadChats >>> 0;
            if (object.notifyMessageCount != null)
                message.notifyMessageCount = object.notifyMessageCount >>> 0;
            if (object.notifyMessage) {
                if (!Array.isArray(object.notifyMessage))
                    throw TypeError(".proto.TabletNotificationsInfo.notifyMessage: array expected");
                message.notifyMessage = [];
                for (var i = 0; i < object.notifyMessage.length; ++i) {
                    if (typeof object.notifyMessage[i] !== "object")
                        throw TypeError(".proto.TabletNotificationsInfo.notifyMessage: object expected");
                    message.notifyMessage[i] = $root.proto.NotificationMessageInfo.fromObject(object.notifyMessage[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TabletNotificationsInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.TabletNotificationsInfo
         * @static
         * @param {proto.TabletNotificationsInfo} message TabletNotificationsInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TabletNotificationsInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.notifyMessage = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.unreadChats = 0;
                object.notifyMessageCount = 0;
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.unreadChats != null && message.hasOwnProperty("unreadChats"))
                object.unreadChats = message.unreadChats;
            if (message.notifyMessageCount != null && message.hasOwnProperty("notifyMessageCount"))
                object.notifyMessageCount = message.notifyMessageCount;
            if (message.notifyMessage && message.notifyMessage.length) {
                object.notifyMessage = [];
                for (var j = 0; j < message.notifyMessage.length; ++j)
                    object.notifyMessage[j] = $root.proto.NotificationMessageInfo.toObject(message.notifyMessage[j], options);
            }
            return object;
        };

        /**
         * Converts this TabletNotificationsInfo to JSON.
         * @function toJSON
         * @memberof proto.TabletNotificationsInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TabletNotificationsInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TabletNotificationsInfo;
    })();

    proto.NotificationMessageInfo = (function() {

        /**
         * Properties of a NotificationMessageInfo.
         * @memberof proto
         * @interface INotificationMessageInfo
         * @property {proto.IMessageKey|null} [key] NotificationMessageInfo key
         * @property {proto.IMessage|null} [message] NotificationMessageInfo message
         * @property {number|Long|null} [messageTimestamp] NotificationMessageInfo messageTimestamp
         * @property {string|null} [participant] NotificationMessageInfo participant
         */

        /**
         * Constructs a new NotificationMessageInfo.
         * @memberof proto
         * @classdesc Represents a NotificationMessageInfo.
         * @implements INotificationMessageInfo
         * @constructor
         * @param {proto.INotificationMessageInfo=} [properties] Properties to set
         */
        function NotificationMessageInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NotificationMessageInfo key.
         * @member {proto.IMessageKey|null|undefined} key
         * @memberof proto.NotificationMessageInfo
         * @instance
         */
        NotificationMessageInfo.prototype.key = null;

        /**
         * NotificationMessageInfo message.
         * @member {proto.IMessage|null|undefined} message
         * @memberof proto.NotificationMessageInfo
         * @instance
         */
        NotificationMessageInfo.prototype.message = null;

        /**
         * NotificationMessageInfo messageTimestamp.
         * @member {number|Long} messageTimestamp
         * @memberof proto.NotificationMessageInfo
         * @instance
         */
        NotificationMessageInfo.prototype.messageTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * NotificationMessageInfo participant.
         * @member {string} participant
         * @memberof proto.NotificationMessageInfo
         * @instance
         */
        NotificationMessageInfo.prototype.participant = "";

        /**
         * Creates a new NotificationMessageInfo instance using the specified properties.
         * @function create
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {proto.INotificationMessageInfo=} [properties] Properties to set
         * @returns {proto.NotificationMessageInfo} NotificationMessageInfo instance
         */
        NotificationMessageInfo.create = function create(properties) {
            return new NotificationMessageInfo(properties);
        };

        /**
         * Encodes the specified NotificationMessageInfo message. Does not implicitly {@link proto.NotificationMessageInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {proto.INotificationMessageInfo} message NotificationMessageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotificationMessageInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                $root.proto.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.proto.Message.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.messageTimestamp != null && Object.hasOwnProperty.call(message, "messageTimestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.messageTimestamp);
            if (message.participant != null && Object.hasOwnProperty.call(message, "participant"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.participant);
            return writer;
        };

        /**
         * Encodes the specified NotificationMessageInfo message, length delimited. Does not implicitly {@link proto.NotificationMessageInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {proto.INotificationMessageInfo} message NotificationMessageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotificationMessageInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NotificationMessageInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.NotificationMessageInfo} NotificationMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotificationMessageInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.NotificationMessageInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.message = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.messageTimestamp = reader.uint64();
                    break;
                case 4:
                    message.participant = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NotificationMessageInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.NotificationMessageInfo} NotificationMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotificationMessageInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NotificationMessageInfo message.
         * @function verify
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotificationMessageInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key")) {
                var error = $root.proto.MessageKey.verify(message.key);
                if (error)
                    return "key." + error;
            }
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.proto.Message.verify(message.message);
                if (error)
                    return "message." + error;
            }
            if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                if (!$util.isInteger(message.messageTimestamp) && !(message.messageTimestamp && $util.isInteger(message.messageTimestamp.low) && $util.isInteger(message.messageTimestamp.high)))
                    return "messageTimestamp: integer|Long expected";
            if (message.participant != null && message.hasOwnProperty("participant"))
                if (!$util.isString(message.participant))
                    return "participant: string expected";
            return null;
        };

        /**
         * Creates a NotificationMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.NotificationMessageInfo} NotificationMessageInfo
         */
        NotificationMessageInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.NotificationMessageInfo)
                return object;
            var message = new $root.proto.NotificationMessageInfo();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".proto.NotificationMessageInfo.key: object expected");
                message.key = $root.proto.MessageKey.fromObject(object.key);
            }
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".proto.NotificationMessageInfo.message: object expected");
                message.message = $root.proto.Message.fromObject(object.message);
            }
            if (object.messageTimestamp != null)
                if ($util.Long)
                    (message.messageTimestamp = $util.Long.fromValue(object.messageTimestamp)).unsigned = true;
                else if (typeof object.messageTimestamp === "string")
                    message.messageTimestamp = parseInt(object.messageTimestamp, 10);
                else if (typeof object.messageTimestamp === "number")
                    message.messageTimestamp = object.messageTimestamp;
                else if (typeof object.messageTimestamp === "object")
                    message.messageTimestamp = new $util.LongBits(object.messageTimestamp.low >>> 0, object.messageTimestamp.high >>> 0).toNumber(true);
            if (object.participant != null)
                message.participant = String(object.participant);
            return message;
        };

        /**
         * Creates a plain object from a NotificationMessageInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.NotificationMessageInfo
         * @static
         * @param {proto.NotificationMessageInfo} message NotificationMessageInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotificationMessageInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = null;
                object.message = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.messageTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.messageTimestamp = options.longs === String ? "0" : 0;
                object.participant = "";
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.proto.MessageKey.toObject(message.key, options);
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.proto.Message.toObject(message.message, options);
            if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                if (typeof message.messageTimestamp === "number")
                    object.messageTimestamp = options.longs === String ? String(message.messageTimestamp) : message.messageTimestamp;
                else
                    object.messageTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.messageTimestamp) : options.longs === Number ? new $util.LongBits(message.messageTimestamp.low >>> 0, message.messageTimestamp.high >>> 0).toNumber(true) : message.messageTimestamp;
            if (message.participant != null && message.hasOwnProperty("participant"))
                object.participant = message.participant;
            return object;
        };

        /**
         * Converts this NotificationMessageInfo to JSON.
         * @function toJSON
         * @memberof proto.NotificationMessageInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotificationMessageInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NotificationMessageInfo;
    })();

    proto.WebNotificationsInfo = (function() {

        /**
         * Properties of a WebNotificationsInfo.
         * @memberof proto
         * @interface IWebNotificationsInfo
         * @property {number|Long|null} [timestamp] WebNotificationsInfo timestamp
         * @property {number|null} [unreadChats] WebNotificationsInfo unreadChats
         * @property {number|null} [notifyMessageCount] WebNotificationsInfo notifyMessageCount
         * @property {Array.<proto.IWebMessageInfo>|null} [notifyMessages] WebNotificationsInfo notifyMessages
         */

        /**
         * Constructs a new WebNotificationsInfo.
         * @memberof proto
         * @classdesc Represents a WebNotificationsInfo.
         * @implements IWebNotificationsInfo
         * @constructor
         * @param {proto.IWebNotificationsInfo=} [properties] Properties to set
         */
        function WebNotificationsInfo(properties) {
            this.notifyMessages = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WebNotificationsInfo timestamp.
         * @member {number|Long} timestamp
         * @memberof proto.WebNotificationsInfo
         * @instance
         */
        WebNotificationsInfo.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * WebNotificationsInfo unreadChats.
         * @member {number} unreadChats
         * @memberof proto.WebNotificationsInfo
         * @instance
         */
        WebNotificationsInfo.prototype.unreadChats = 0;

        /**
         * WebNotificationsInfo notifyMessageCount.
         * @member {number} notifyMessageCount
         * @memberof proto.WebNotificationsInfo
         * @instance
         */
        WebNotificationsInfo.prototype.notifyMessageCount = 0;

        /**
         * WebNotificationsInfo notifyMessages.
         * @member {Array.<proto.IWebMessageInfo>} notifyMessages
         * @memberof proto.WebNotificationsInfo
         * @instance
         */
        WebNotificationsInfo.prototype.notifyMessages = $util.emptyArray;

        /**
         * Creates a new WebNotificationsInfo instance using the specified properties.
         * @function create
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {proto.IWebNotificationsInfo=} [properties] Properties to set
         * @returns {proto.WebNotificationsInfo} WebNotificationsInfo instance
         */
        WebNotificationsInfo.create = function create(properties) {
            return new WebNotificationsInfo(properties);
        };

        /**
         * Encodes the specified WebNotificationsInfo message. Does not implicitly {@link proto.WebNotificationsInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {proto.IWebNotificationsInfo} message WebNotificationsInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebNotificationsInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.unreadChats != null && Object.hasOwnProperty.call(message, "unreadChats"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.unreadChats);
            if (message.notifyMessageCount != null && Object.hasOwnProperty.call(message, "notifyMessageCount"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.notifyMessageCount);
            if (message.notifyMessages != null && message.notifyMessages.length)
                for (var i = 0; i < message.notifyMessages.length; ++i)
                    $root.proto.WebMessageInfo.encode(message.notifyMessages[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified WebNotificationsInfo message, length delimited. Does not implicitly {@link proto.WebNotificationsInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {proto.IWebNotificationsInfo} message WebNotificationsInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebNotificationsInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WebNotificationsInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.WebNotificationsInfo} WebNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebNotificationsInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.WebNotificationsInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.unreadChats = reader.uint32();
                    break;
                case 4:
                    message.notifyMessageCount = reader.uint32();
                    break;
                case 5:
                    if (!(message.notifyMessages && message.notifyMessages.length))
                        message.notifyMessages = [];
                    message.notifyMessages.push($root.proto.WebMessageInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WebNotificationsInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.WebNotificationsInfo} WebNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebNotificationsInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WebNotificationsInfo message.
         * @function verify
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WebNotificationsInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.unreadChats != null && message.hasOwnProperty("unreadChats"))
                if (!$util.isInteger(message.unreadChats))
                    return "unreadChats: integer expected";
            if (message.notifyMessageCount != null && message.hasOwnProperty("notifyMessageCount"))
                if (!$util.isInteger(message.notifyMessageCount))
                    return "notifyMessageCount: integer expected";
            if (message.notifyMessages != null && message.hasOwnProperty("notifyMessages")) {
                if (!Array.isArray(message.notifyMessages))
                    return "notifyMessages: array expected";
                for (var i = 0; i < message.notifyMessages.length; ++i) {
                    var error = $root.proto.WebMessageInfo.verify(message.notifyMessages[i]);
                    if (error)
                        return "notifyMessages." + error;
                }
            }
            return null;
        };

        /**
         * Creates a WebNotificationsInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.WebNotificationsInfo} WebNotificationsInfo
         */
        WebNotificationsInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.WebNotificationsInfo)
                return object;
            var message = new $root.proto.WebNotificationsInfo();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.unreadChats != null)
                message.unreadChats = object.unreadChats >>> 0;
            if (object.notifyMessageCount != null)
                message.notifyMessageCount = object.notifyMessageCount >>> 0;
            if (object.notifyMessages) {
                if (!Array.isArray(object.notifyMessages))
                    throw TypeError(".proto.WebNotificationsInfo.notifyMessages: array expected");
                message.notifyMessages = [];
                for (var i = 0; i < object.notifyMessages.length; ++i) {
                    if (typeof object.notifyMessages[i] !== "object")
                        throw TypeError(".proto.WebNotificationsInfo.notifyMessages: object expected");
                    message.notifyMessages[i] = $root.proto.WebMessageInfo.fromObject(object.notifyMessages[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a WebNotificationsInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.WebNotificationsInfo
         * @static
         * @param {proto.WebNotificationsInfo} message WebNotificationsInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WebNotificationsInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.notifyMessages = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.unreadChats = 0;
                object.notifyMessageCount = 0;
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.unreadChats != null && message.hasOwnProperty("unreadChats"))
                object.unreadChats = message.unreadChats;
            if (message.notifyMessageCount != null && message.hasOwnProperty("notifyMessageCount"))
                object.notifyMessageCount = message.notifyMessageCount;
            if (message.notifyMessages && message.notifyMessages.length) {
                object.notifyMessages = [];
                for (var j = 0; j < message.notifyMessages.length; ++j)
                    object.notifyMessages[j] = $root.proto.WebMessageInfo.toObject(message.notifyMessages[j], options);
            }
            return object;
        };

        /**
         * Converts this WebNotificationsInfo to JSON.
         * @function toJSON
         * @memberof proto.WebNotificationsInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WebNotificationsInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WebNotificationsInfo;
    })();

    proto.PaymentInfo = (function() {

        /**
         * Properties of a PaymentInfo.
         * @memberof proto
         * @interface IPaymentInfo
         * @property {number|Long|null} [amount1000] PaymentInfo amount1000
         * @property {string|null} [receiverJid] PaymentInfo receiverJid
         * @property {proto.PaymentInfo.PAYMENT_INFO_STATUS|null} [status] PaymentInfo status
         * @property {number|Long|null} [transactionTimestamp] PaymentInfo transactionTimestamp
         * @property {proto.IMessageKey|null} [requestMessageKey] PaymentInfo requestMessageKey
         * @property {number|Long|null} [expiryTimestamp] PaymentInfo expiryTimestamp
         * @property {boolean|null} [futureproofed] PaymentInfo futureproofed
         * @property {string|null} [currency] PaymentInfo currency
         */

        /**
         * Constructs a new PaymentInfo.
         * @memberof proto
         * @classdesc Represents a PaymentInfo.
         * @implements IPaymentInfo
         * @constructor
         * @param {proto.IPaymentInfo=} [properties] Properties to set
         */
        function PaymentInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PaymentInfo amount1000.
         * @member {number|Long} amount1000
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.amount1000 = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PaymentInfo receiverJid.
         * @member {string} receiverJid
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.receiverJid = "";

        /**
         * PaymentInfo status.
         * @member {proto.PaymentInfo.PAYMENT_INFO_STATUS} status
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.status = 0;

        /**
         * PaymentInfo transactionTimestamp.
         * @member {number|Long} transactionTimestamp
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.transactionTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PaymentInfo requestMessageKey.
         * @member {proto.IMessageKey|null|undefined} requestMessageKey
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.requestMessageKey = null;

        /**
         * PaymentInfo expiryTimestamp.
         * @member {number|Long} expiryTimestamp
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.expiryTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * PaymentInfo futureproofed.
         * @member {boolean} futureproofed
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.futureproofed = false;

        /**
         * PaymentInfo currency.
         * @member {string} currency
         * @memberof proto.PaymentInfo
         * @instance
         */
        PaymentInfo.prototype.currency = "";

        /**
         * Creates a new PaymentInfo instance using the specified properties.
         * @function create
         * @memberof proto.PaymentInfo
         * @static
         * @param {proto.IPaymentInfo=} [properties] Properties to set
         * @returns {proto.PaymentInfo} PaymentInfo instance
         */
        PaymentInfo.create = function create(properties) {
            return new PaymentInfo(properties);
        };

        /**
         * Encodes the specified PaymentInfo message. Does not implicitly {@link proto.PaymentInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.PaymentInfo
         * @static
         * @param {proto.IPaymentInfo} message PaymentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaymentInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.amount1000 != null && Object.hasOwnProperty.call(message, "amount1000"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.amount1000);
            if (message.receiverJid != null && Object.hasOwnProperty.call(message, "receiverJid"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.receiverJid);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
            if (message.transactionTimestamp != null && Object.hasOwnProperty.call(message, "transactionTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.transactionTimestamp);
            if (message.requestMessageKey != null && Object.hasOwnProperty.call(message, "requestMessageKey"))
                $root.proto.MessageKey.encode(message.requestMessageKey, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.expiryTimestamp != null && Object.hasOwnProperty.call(message, "expiryTimestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.expiryTimestamp);
            if (message.futureproofed != null && Object.hasOwnProperty.call(message, "futureproofed"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.futureproofed);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.currency);
            return writer;
        };

        /**
         * Encodes the specified PaymentInfo message, length delimited. Does not implicitly {@link proto.PaymentInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.PaymentInfo
         * @static
         * @param {proto.IPaymentInfo} message PaymentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PaymentInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PaymentInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.PaymentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.PaymentInfo} PaymentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaymentInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.PaymentInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.amount1000 = reader.uint64();
                    break;
                case 3:
                    message.receiverJid = reader.string();
                    break;
                case 4:
                    message.status = reader.int32();
                    break;
                case 5:
                    message.transactionTimestamp = reader.uint64();
                    break;
                case 6:
                    message.requestMessageKey = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.expiryTimestamp = reader.uint64();
                    break;
                case 8:
                    message.futureproofed = reader.bool();
                    break;
                case 9:
                    message.currency = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PaymentInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.PaymentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.PaymentInfo} PaymentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PaymentInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PaymentInfo message.
         * @function verify
         * @memberof proto.PaymentInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PaymentInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (!$util.isInteger(message.amount1000) && !(message.amount1000 && $util.isInteger(message.amount1000.low) && $util.isInteger(message.amount1000.high)))
                    return "amount1000: integer|Long expected";
            if (message.receiverJid != null && message.hasOwnProperty("receiverJid"))
                if (!$util.isString(message.receiverJid))
                    return "receiverJid: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    break;
                }
            if (message.transactionTimestamp != null && message.hasOwnProperty("transactionTimestamp"))
                if (!$util.isInteger(message.transactionTimestamp) && !(message.transactionTimestamp && $util.isInteger(message.transactionTimestamp.low) && $util.isInteger(message.transactionTimestamp.high)))
                    return "transactionTimestamp: integer|Long expected";
            if (message.requestMessageKey != null && message.hasOwnProperty("requestMessageKey")) {
                var error = $root.proto.MessageKey.verify(message.requestMessageKey);
                if (error)
                    return "requestMessageKey." + error;
            }
            if (message.expiryTimestamp != null && message.hasOwnProperty("expiryTimestamp"))
                if (!$util.isInteger(message.expiryTimestamp) && !(message.expiryTimestamp && $util.isInteger(message.expiryTimestamp.low) && $util.isInteger(message.expiryTimestamp.high)))
                    return "expiryTimestamp: integer|Long expected";
            if (message.futureproofed != null && message.hasOwnProperty("futureproofed"))
                if (typeof message.futureproofed !== "boolean")
                    return "futureproofed: boolean expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            return null;
        };

        /**
         * Creates a PaymentInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.PaymentInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.PaymentInfo} PaymentInfo
         */
        PaymentInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.PaymentInfo)
                return object;
            var message = new $root.proto.PaymentInfo();
            if (object.amount1000 != null)
                if ($util.Long)
                    (message.amount1000 = $util.Long.fromValue(object.amount1000)).unsigned = true;
                else if (typeof object.amount1000 === "string")
                    message.amount1000 = parseInt(object.amount1000, 10);
                else if (typeof object.amount1000 === "number")
                    message.amount1000 = object.amount1000;
                else if (typeof object.amount1000 === "object")
                    message.amount1000 = new $util.LongBits(object.amount1000.low >>> 0, object.amount1000.high >>> 0).toNumber(true);
            if (object.receiverJid != null)
                message.receiverJid = String(object.receiverJid);
            switch (object.status) {
            case "UNKNOWN_STATUS":
            case 0:
                message.status = 0;
                break;
            case "PROCESSING":
            case 1:
                message.status = 1;
                break;
            case "SENT":
            case 2:
                message.status = 2;
                break;
            case "NEED_TO_ACCEPT":
            case 3:
                message.status = 3;
                break;
            case "COMPLETE":
            case 4:
                message.status = 4;
                break;
            case "COULD_NOT_COMPLETE":
            case 5:
                message.status = 5;
                break;
            case "REFUNDED":
            case 6:
                message.status = 6;
                break;
            case "EXPIRED":
            case 7:
                message.status = 7;
                break;
            case "REJECTED":
            case 8:
                message.status = 8;
                break;
            case "CANCELLED":
            case 9:
                message.status = 9;
                break;
            case "WAITING_FOR_PAYER":
            case 10:
                message.status = 10;
                break;
            case "WAITING":
            case 11:
                message.status = 11;
                break;
            }
            if (object.transactionTimestamp != null)
                if ($util.Long)
                    (message.transactionTimestamp = $util.Long.fromValue(object.transactionTimestamp)).unsigned = true;
                else if (typeof object.transactionTimestamp === "string")
                    message.transactionTimestamp = parseInt(object.transactionTimestamp, 10);
                else if (typeof object.transactionTimestamp === "number")
                    message.transactionTimestamp = object.transactionTimestamp;
                else if (typeof object.transactionTimestamp === "object")
                    message.transactionTimestamp = new $util.LongBits(object.transactionTimestamp.low >>> 0, object.transactionTimestamp.high >>> 0).toNumber(true);
            if (object.requestMessageKey != null) {
                if (typeof object.requestMessageKey !== "object")
                    throw TypeError(".proto.PaymentInfo.requestMessageKey: object expected");
                message.requestMessageKey = $root.proto.MessageKey.fromObject(object.requestMessageKey);
            }
            if (object.expiryTimestamp != null)
                if ($util.Long)
                    (message.expiryTimestamp = $util.Long.fromValue(object.expiryTimestamp)).unsigned = true;
                else if (typeof object.expiryTimestamp === "string")
                    message.expiryTimestamp = parseInt(object.expiryTimestamp, 10);
                else if (typeof object.expiryTimestamp === "number")
                    message.expiryTimestamp = object.expiryTimestamp;
                else if (typeof object.expiryTimestamp === "object")
                    message.expiryTimestamp = new $util.LongBits(object.expiryTimestamp.low >>> 0, object.expiryTimestamp.high >>> 0).toNumber(true);
            if (object.futureproofed != null)
                message.futureproofed = Boolean(object.futureproofed);
            if (object.currency != null)
                message.currency = String(object.currency);
            return message;
        };

        /**
         * Creates a plain object from a PaymentInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.PaymentInfo
         * @static
         * @param {proto.PaymentInfo} message PaymentInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PaymentInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.amount1000 = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount1000 = options.longs === String ? "0" : 0;
                object.receiverJid = "";
                object.status = options.enums === String ? "UNKNOWN_STATUS" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.transactionTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.transactionTimestamp = options.longs === String ? "0" : 0;
                object.requestMessageKey = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.expiryTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.expiryTimestamp = options.longs === String ? "0" : 0;
                object.futureproofed = false;
                object.currency = "";
            }
            if (message.amount1000 != null && message.hasOwnProperty("amount1000"))
                if (typeof message.amount1000 === "number")
                    object.amount1000 = options.longs === String ? String(message.amount1000) : message.amount1000;
                else
                    object.amount1000 = options.longs === String ? $util.Long.prototype.toString.call(message.amount1000) : options.longs === Number ? new $util.LongBits(message.amount1000.low >>> 0, message.amount1000.high >>> 0).toNumber(true) : message.amount1000;
            if (message.receiverJid != null && message.hasOwnProperty("receiverJid"))
                object.receiverJid = message.receiverJid;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.proto.PaymentInfo.PAYMENT_INFO_STATUS[message.status] : message.status;
            if (message.transactionTimestamp != null && message.hasOwnProperty("transactionTimestamp"))
                if (typeof message.transactionTimestamp === "number")
                    object.transactionTimestamp = options.longs === String ? String(message.transactionTimestamp) : message.transactionTimestamp;
                else
                    object.transactionTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.transactionTimestamp) : options.longs === Number ? new $util.LongBits(message.transactionTimestamp.low >>> 0, message.transactionTimestamp.high >>> 0).toNumber(true) : message.transactionTimestamp;
            if (message.requestMessageKey != null && message.hasOwnProperty("requestMessageKey"))
                object.requestMessageKey = $root.proto.MessageKey.toObject(message.requestMessageKey, options);
            if (message.expiryTimestamp != null && message.hasOwnProperty("expiryTimestamp"))
                if (typeof message.expiryTimestamp === "number")
                    object.expiryTimestamp = options.longs === String ? String(message.expiryTimestamp) : message.expiryTimestamp;
                else
                    object.expiryTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.expiryTimestamp) : options.longs === Number ? new $util.LongBits(message.expiryTimestamp.low >>> 0, message.expiryTimestamp.high >>> 0).toNumber(true) : message.expiryTimestamp;
            if (message.futureproofed != null && message.hasOwnProperty("futureproofed"))
                object.futureproofed = message.futureproofed;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            return object;
        };

        /**
         * Converts this PaymentInfo to JSON.
         * @function toJSON
         * @memberof proto.PaymentInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PaymentInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * PAYMENT_INFO_STATUS enum.
         * @name proto.PaymentInfo.PAYMENT_INFO_STATUS
         * @enum {number}
         * @property {number} UNKNOWN_STATUS=0 UNKNOWN_STATUS value
         * @property {number} PROCESSING=1 PROCESSING value
         * @property {number} SENT=2 SENT value
         * @property {number} NEED_TO_ACCEPT=3 NEED_TO_ACCEPT value
         * @property {number} COMPLETE=4 COMPLETE value
         * @property {number} COULD_NOT_COMPLETE=5 COULD_NOT_COMPLETE value
         * @property {number} REFUNDED=6 REFUNDED value
         * @property {number} EXPIRED=7 EXPIRED value
         * @property {number} REJECTED=8 REJECTED value
         * @property {number} CANCELLED=9 CANCELLED value
         * @property {number} WAITING_FOR_PAYER=10 WAITING_FOR_PAYER value
         * @property {number} WAITING=11 WAITING value
         */
        PaymentInfo.PAYMENT_INFO_STATUS = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN_STATUS"] = 0;
            values[valuesById[1] = "PROCESSING"] = 1;
            values[valuesById[2] = "SENT"] = 2;
            values[valuesById[3] = "NEED_TO_ACCEPT"] = 3;
            values[valuesById[4] = "COMPLETE"] = 4;
            values[valuesById[5] = "COULD_NOT_COMPLETE"] = 5;
            values[valuesById[6] = "REFUNDED"] = 6;
            values[valuesById[7] = "EXPIRED"] = 7;
            values[valuesById[8] = "REJECTED"] = 8;
            values[valuesById[9] = "CANCELLED"] = 9;
            values[valuesById[10] = "WAITING_FOR_PAYER"] = 10;
            values[valuesById[11] = "WAITING"] = 11;
            return values;
        })();

        return PaymentInfo;
    })();

    proto.WebMessageInfo = (function() {

        /**
         * Properties of a WebMessageInfo.
         * @memberof proto
         * @interface IWebMessageInfo
         * @property {proto.IMessageKey} key WebMessageInfo key
         * @property {proto.IMessage|null} [message] WebMessageInfo message
         * @property {number|Long|null} [messageTimestamp] WebMessageInfo messageTimestamp
         * @property {proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS|null} [status] WebMessageInfo status
         * @property {string|null} [participant] WebMessageInfo participant
         * @property {boolean|null} [ignore] WebMessageInfo ignore
         * @property {boolean|null} [starred] WebMessageInfo starred
         * @property {boolean|null} [broadcast] WebMessageInfo broadcast
         * @property {string|null} [pushName] WebMessageInfo pushName
         * @property {Uint8Array|null} [mediaCiphertextSha256] WebMessageInfo mediaCiphertextSha256
         * @property {boolean|null} [multicast] WebMessageInfo multicast
         * @property {boolean|null} [urlText] WebMessageInfo urlText
         * @property {boolean|null} [urlNumber] WebMessageInfo urlNumber
         * @property {proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE|null} [messageStubType] WebMessageInfo messageStubType
         * @property {boolean|null} [clearMedia] WebMessageInfo clearMedia
         * @property {Array.<string>|null} [messageStubParameters] WebMessageInfo messageStubParameters
         * @property {number|null} [duration] WebMessageInfo duration
         * @property {Array.<string>|null} [labels] WebMessageInfo labels
         * @property {proto.IPaymentInfo|null} [paymentInfo] WebMessageInfo paymentInfo
         * @property {proto.ILiveLocationMessage|null} [finalLiveLocation] WebMessageInfo finalLiveLocation
         * @property {proto.IPaymentInfo|null} [quotedPaymentInfo] WebMessageInfo quotedPaymentInfo
         * @property {number|Long|null} [ephemeralStartTimestamp] WebMessageInfo ephemeralStartTimestamp
         * @property {number|null} [ephemeralDuration] WebMessageInfo ephemeralDuration
         */

        /**
         * Constructs a new WebMessageInfo.
         * @memberof proto
         * @classdesc Represents a WebMessageInfo.
         * @implements IWebMessageInfo
         * @constructor
         * @param {proto.IWebMessageInfo=} [properties] Properties to set
         */
        function WebMessageInfo(properties) {
            this.messageStubParameters = [];
            this.labels = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WebMessageInfo key.
         * @member {proto.IMessageKey} key
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.key = null;

        /**
         * WebMessageInfo message.
         * @member {proto.IMessage|null|undefined} message
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.message = null;

        /**
         * WebMessageInfo messageTimestamp.
         * @member {number|Long} messageTimestamp
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.messageTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * WebMessageInfo status.
         * @member {proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS} status
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.status = 0;

        /**
         * WebMessageInfo participant.
         * @member {string} participant
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.participant = "";

        /**
         * WebMessageInfo ignore.
         * @member {boolean} ignore
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.ignore = false;

        /**
         * WebMessageInfo starred.
         * @member {boolean} starred
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.starred = false;

        /**
         * WebMessageInfo broadcast.
         * @member {boolean} broadcast
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.broadcast = false;

        /**
         * WebMessageInfo pushName.
         * @member {string} pushName
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.pushName = "";

        /**
         * WebMessageInfo mediaCiphertextSha256.
         * @member {Uint8Array} mediaCiphertextSha256
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.mediaCiphertextSha256 = $util.newBuffer([]);

        /**
         * WebMessageInfo multicast.
         * @member {boolean} multicast
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.multicast = false;

        /**
         * WebMessageInfo urlText.
         * @member {boolean} urlText
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.urlText = false;

        /**
         * WebMessageInfo urlNumber.
         * @member {boolean} urlNumber
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.urlNumber = false;

        /**
         * WebMessageInfo messageStubType.
         * @member {proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE} messageStubType
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.messageStubType = 0;

        /**
         * WebMessageInfo clearMedia.
         * @member {boolean} clearMedia
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.clearMedia = false;

        /**
         * WebMessageInfo messageStubParameters.
         * @member {Array.<string>} messageStubParameters
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.messageStubParameters = $util.emptyArray;

        /**
         * WebMessageInfo duration.
         * @member {number} duration
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.duration = 0;

        /**
         * WebMessageInfo labels.
         * @member {Array.<string>} labels
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.labels = $util.emptyArray;

        /**
         * WebMessageInfo paymentInfo.
         * @member {proto.IPaymentInfo|null|undefined} paymentInfo
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.paymentInfo = null;

        /**
         * WebMessageInfo finalLiveLocation.
         * @member {proto.ILiveLocationMessage|null|undefined} finalLiveLocation
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.finalLiveLocation = null;

        /**
         * WebMessageInfo quotedPaymentInfo.
         * @member {proto.IPaymentInfo|null|undefined} quotedPaymentInfo
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.quotedPaymentInfo = null;

        /**
         * WebMessageInfo ephemeralStartTimestamp.
         * @member {number|Long} ephemeralStartTimestamp
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.ephemeralStartTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * WebMessageInfo ephemeralDuration.
         * @member {number} ephemeralDuration
         * @memberof proto.WebMessageInfo
         * @instance
         */
        WebMessageInfo.prototype.ephemeralDuration = 0;

        /**
         * Creates a new WebMessageInfo instance using the specified properties.
         * @function create
         * @memberof proto.WebMessageInfo
         * @static
         * @param {proto.IWebMessageInfo=} [properties] Properties to set
         * @returns {proto.WebMessageInfo} WebMessageInfo instance
         */
        WebMessageInfo.create = function create(properties) {
            return new WebMessageInfo(properties);
        };

        /**
         * Encodes the specified WebMessageInfo message. Does not implicitly {@link proto.WebMessageInfo.verify|verify} messages.
         * @function encode
         * @memberof proto.WebMessageInfo
         * @static
         * @param {proto.IWebMessageInfo} message WebMessageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebMessageInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.proto.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.proto.Message.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.messageTimestamp != null && Object.hasOwnProperty.call(message, "messageTimestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.messageTimestamp);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
            if (message.participant != null && Object.hasOwnProperty.call(message, "participant"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.participant);
            if (message.ignore != null && Object.hasOwnProperty.call(message, "ignore"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.ignore);
            if (message.starred != null && Object.hasOwnProperty.call(message, "starred"))
                writer.uint32(/* id 17, wireType 0 =*/136).bool(message.starred);
            if (message.broadcast != null && Object.hasOwnProperty.call(message, "broadcast"))
                writer.uint32(/* id 18, wireType 0 =*/144).bool(message.broadcast);
            if (message.pushName != null && Object.hasOwnProperty.call(message, "pushName"))
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.pushName);
            if (message.mediaCiphertextSha256 != null && Object.hasOwnProperty.call(message, "mediaCiphertextSha256"))
                writer.uint32(/* id 20, wireType 2 =*/162).bytes(message.mediaCiphertextSha256);
            if (message.multicast != null && Object.hasOwnProperty.call(message, "multicast"))
                writer.uint32(/* id 21, wireType 0 =*/168).bool(message.multicast);
            if (message.urlText != null && Object.hasOwnProperty.call(message, "urlText"))
                writer.uint32(/* id 22, wireType 0 =*/176).bool(message.urlText);
            if (message.urlNumber != null && Object.hasOwnProperty.call(message, "urlNumber"))
                writer.uint32(/* id 23, wireType 0 =*/184).bool(message.urlNumber);
            if (message.messageStubType != null && Object.hasOwnProperty.call(message, "messageStubType"))
                writer.uint32(/* id 24, wireType 0 =*/192).int32(message.messageStubType);
            if (message.clearMedia != null && Object.hasOwnProperty.call(message, "clearMedia"))
                writer.uint32(/* id 25, wireType 0 =*/200).bool(message.clearMedia);
            if (message.messageStubParameters != null && message.messageStubParameters.length)
                for (var i = 0; i < message.messageStubParameters.length; ++i)
                    writer.uint32(/* id 26, wireType 2 =*/210).string(message.messageStubParameters[i]);
            if (message.duration != null && Object.hasOwnProperty.call(message, "duration"))
                writer.uint32(/* id 27, wireType 0 =*/216).uint32(message.duration);
            if (message.labels != null && message.labels.length)
                for (var i = 0; i < message.labels.length; ++i)
                    writer.uint32(/* id 28, wireType 2 =*/226).string(message.labels[i]);
            if (message.paymentInfo != null && Object.hasOwnProperty.call(message, "paymentInfo"))
                $root.proto.PaymentInfo.encode(message.paymentInfo, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
            if (message.finalLiveLocation != null && Object.hasOwnProperty.call(message, "finalLiveLocation"))
                $root.proto.LiveLocationMessage.encode(message.finalLiveLocation, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.quotedPaymentInfo != null && Object.hasOwnProperty.call(message, "quotedPaymentInfo"))
                $root.proto.PaymentInfo.encode(message.quotedPaymentInfo, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
            if (message.ephemeralStartTimestamp != null && Object.hasOwnProperty.call(message, "ephemeralStartTimestamp"))
                writer.uint32(/* id 32, wireType 0 =*/256).uint64(message.ephemeralStartTimestamp);
            if (message.ephemeralDuration != null && Object.hasOwnProperty.call(message, "ephemeralDuration"))
                writer.uint32(/* id 33, wireType 0 =*/264).uint32(message.ephemeralDuration);
            return writer;
        };

        /**
         * Encodes the specified WebMessageInfo message, length delimited. Does not implicitly {@link proto.WebMessageInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.WebMessageInfo
         * @static
         * @param {proto.IWebMessageInfo} message WebMessageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebMessageInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WebMessageInfo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.WebMessageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.WebMessageInfo} WebMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebMessageInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.WebMessageInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = $root.proto.MessageKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.message = $root.proto.Message.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.messageTimestamp = reader.uint64();
                    break;
                case 4:
                    message.status = reader.int32();
                    break;
                case 5:
                    message.participant = reader.string();
                    break;
                case 16:
                    message.ignore = reader.bool();
                    break;
                case 17:
                    message.starred = reader.bool();
                    break;
                case 18:
                    message.broadcast = reader.bool();
                    break;
                case 19:
                    message.pushName = reader.string();
                    break;
                case 20:
                    message.mediaCiphertextSha256 = reader.bytes();
                    break;
                case 21:
                    message.multicast = reader.bool();
                    break;
                case 22:
                    message.urlText = reader.bool();
                    break;
                case 23:
                    message.urlNumber = reader.bool();
                    break;
                case 24:
                    message.messageStubType = reader.int32();
                    break;
                case 25:
                    message.clearMedia = reader.bool();
                    break;
                case 26:
                    if (!(message.messageStubParameters && message.messageStubParameters.length))
                        message.messageStubParameters = [];
                    message.messageStubParameters.push(reader.string());
                    break;
                case 27:
                    message.duration = reader.uint32();
                    break;
                case 28:
                    if (!(message.labels && message.labels.length))
                        message.labels = [];
                    message.labels.push(reader.string());
                    break;
                case 29:
                    message.paymentInfo = $root.proto.PaymentInfo.decode(reader, reader.uint32());
                    break;
                case 30:
                    message.finalLiveLocation = $root.proto.LiveLocationMessage.decode(reader, reader.uint32());
                    break;
                case 31:
                    message.quotedPaymentInfo = $root.proto.PaymentInfo.decode(reader, reader.uint32());
                    break;
                case 32:
                    message.ephemeralStartTimestamp = reader.uint64();
                    break;
                case 33:
                    message.ephemeralDuration = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("key"))
                throw $util.ProtocolError("missing required 'key'", { instance: message });
            return message;
        };

        /**
         * Decodes a WebMessageInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.WebMessageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.WebMessageInfo} WebMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebMessageInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WebMessageInfo message.
         * @function verify
         * @memberof proto.WebMessageInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WebMessageInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                var error = $root.proto.MessageKey.verify(message.key);
                if (error)
                    return "key." + error;
            }
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.proto.Message.verify(message.message);
                if (error)
                    return "message." + error;
            }
            if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                if (!$util.isInteger(message.messageTimestamp) && !(message.messageTimestamp && $util.isInteger(message.messageTimestamp.low) && $util.isInteger(message.messageTimestamp.high)))
                    return "messageTimestamp: integer|Long expected";
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.participant != null && message.hasOwnProperty("participant"))
                if (!$util.isString(message.participant))
                    return "participant: string expected";
            if (message.ignore != null && message.hasOwnProperty("ignore"))
                if (typeof message.ignore !== "boolean")
                    return "ignore: boolean expected";
            if (message.starred != null && message.hasOwnProperty("starred"))
                if (typeof message.starred !== "boolean")
                    return "starred: boolean expected";
            if (message.broadcast != null && message.hasOwnProperty("broadcast"))
                if (typeof message.broadcast !== "boolean")
                    return "broadcast: boolean expected";
            if (message.pushName != null && message.hasOwnProperty("pushName"))
                if (!$util.isString(message.pushName))
                    return "pushName: string expected";
            if (message.mediaCiphertextSha256 != null && message.hasOwnProperty("mediaCiphertextSha256"))
                if (!(message.mediaCiphertextSha256 && typeof message.mediaCiphertextSha256.length === "number" || $util.isString(message.mediaCiphertextSha256)))
                    return "mediaCiphertextSha256: buffer expected";
            if (message.multicast != null && message.hasOwnProperty("multicast"))
                if (typeof message.multicast !== "boolean")
                    return "multicast: boolean expected";
            if (message.urlText != null && message.hasOwnProperty("urlText"))
                if (typeof message.urlText !== "boolean")
                    return "urlText: boolean expected";
            if (message.urlNumber != null && message.hasOwnProperty("urlNumber"))
                if (typeof message.urlNumber !== "boolean")
                    return "urlNumber: boolean expected";
            if (message.messageStubType != null && message.hasOwnProperty("messageStubType"))
                switch (message.messageStubType) {
                default:
                    return "messageStubType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                case 39:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                case 59:
                case 60:
                case 61:
                case 62:
                case 63:
                case 64:
                case 65:
                case 66:
                case 67:
                case 68:
                case 69:
                case 70:
                case 71:
                case 72:
                    break;
                }
            if (message.clearMedia != null && message.hasOwnProperty("clearMedia"))
                if (typeof message.clearMedia !== "boolean")
                    return "clearMedia: boolean expected";
            if (message.messageStubParameters != null && message.hasOwnProperty("messageStubParameters")) {
                if (!Array.isArray(message.messageStubParameters))
                    return "messageStubParameters: array expected";
                for (var i = 0; i < message.messageStubParameters.length; ++i)
                    if (!$util.isString(message.messageStubParameters[i]))
                        return "messageStubParameters: string[] expected";
            }
            if (message.duration != null && message.hasOwnProperty("duration"))
                if (!$util.isInteger(message.duration))
                    return "duration: integer expected";
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!Array.isArray(message.labels))
                    return "labels: array expected";
                for (var i = 0; i < message.labels.length; ++i)
                    if (!$util.isString(message.labels[i]))
                        return "labels: string[] expected";
            }
            if (message.paymentInfo != null && message.hasOwnProperty("paymentInfo")) {
                var error = $root.proto.PaymentInfo.verify(message.paymentInfo);
                if (error)
                    return "paymentInfo." + error;
            }
            if (message.finalLiveLocation != null && message.hasOwnProperty("finalLiveLocation")) {
                var error = $root.proto.LiveLocationMessage.verify(message.finalLiveLocation);
                if (error)
                    return "finalLiveLocation." + error;
            }
            if (message.quotedPaymentInfo != null && message.hasOwnProperty("quotedPaymentInfo")) {
                var error = $root.proto.PaymentInfo.verify(message.quotedPaymentInfo);
                if (error)
                    return "quotedPaymentInfo." + error;
            }
            if (message.ephemeralStartTimestamp != null && message.hasOwnProperty("ephemeralStartTimestamp"))
                if (!$util.isInteger(message.ephemeralStartTimestamp) && !(message.ephemeralStartTimestamp && $util.isInteger(message.ephemeralStartTimestamp.low) && $util.isInteger(message.ephemeralStartTimestamp.high)))
                    return "ephemeralStartTimestamp: integer|Long expected";
            if (message.ephemeralDuration != null && message.hasOwnProperty("ephemeralDuration"))
                if (!$util.isInteger(message.ephemeralDuration))
                    return "ephemeralDuration: integer expected";
            return null;
        };

        /**
         * Creates a WebMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.WebMessageInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.WebMessageInfo} WebMessageInfo
         */
        WebMessageInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.WebMessageInfo)
                return object;
            var message = new $root.proto.WebMessageInfo();
            if (object.key != null) {
                if (typeof object.key !== "object")
                    throw TypeError(".proto.WebMessageInfo.key: object expected");
                message.key = $root.proto.MessageKey.fromObject(object.key);
            }
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".proto.WebMessageInfo.message: object expected");
                message.message = $root.proto.Message.fromObject(object.message);
            }
            if (object.messageTimestamp != null)
                if ($util.Long)
                    (message.messageTimestamp = $util.Long.fromValue(object.messageTimestamp)).unsigned = true;
                else if (typeof object.messageTimestamp === "string")
                    message.messageTimestamp = parseInt(object.messageTimestamp, 10);
                else if (typeof object.messageTimestamp === "number")
                    message.messageTimestamp = object.messageTimestamp;
                else if (typeof object.messageTimestamp === "object")
                    message.messageTimestamp = new $util.LongBits(object.messageTimestamp.low >>> 0, object.messageTimestamp.high >>> 0).toNumber(true);
            switch (object.status) {
            case "ERROR":
            case 0:
                message.status = 0;
                break;
            case "PENDING":
            case 1:
                message.status = 1;
                break;
            case "SERVER_ACK":
            case 2:
                message.status = 2;
                break;
            case "DELIVERY_ACK":
            case 3:
                message.status = 3;
                break;
            case "READ":
            case 4:
                message.status = 4;
                break;
            case "PLAYED":
            case 5:
                message.status = 5;
                break;
            }
            if (object.participant != null)
                message.participant = String(object.participant);
            if (object.ignore != null)
                message.ignore = Boolean(object.ignore);
            if (object.starred != null)
                message.starred = Boolean(object.starred);
            if (object.broadcast != null)
                message.broadcast = Boolean(object.broadcast);
            if (object.pushName != null)
                message.pushName = String(object.pushName);
            if (object.mediaCiphertextSha256 != null)
                if (typeof object.mediaCiphertextSha256 === "string")
                    $util.base64.decode(object.mediaCiphertextSha256, message.mediaCiphertextSha256 = $util.newBuffer($util.base64.length(object.mediaCiphertextSha256)), 0);
                else if (object.mediaCiphertextSha256.length)
                    message.mediaCiphertextSha256 = object.mediaCiphertextSha256;
            if (object.multicast != null)
                message.multicast = Boolean(object.multicast);
            if (object.urlText != null)
                message.urlText = Boolean(object.urlText);
            if (object.urlNumber != null)
                message.urlNumber = Boolean(object.urlNumber);
            switch (object.messageStubType) {
            case "UNKNOWN":
            case 0:
                message.messageStubType = 0;
                break;
            case "REVOKE":
            case 1:
                message.messageStubType = 1;
                break;
            case "CIPHERTEXT":
            case 2:
                message.messageStubType = 2;
                break;
            case "FUTUREPROOF":
            case 3:
                message.messageStubType = 3;
                break;
            case "NON_VERIFIED_TRANSITION":
            case 4:
                message.messageStubType = 4;
                break;
            case "UNVERIFIED_TRANSITION":
            case 5:
                message.messageStubType = 5;
                break;
            case "VERIFIED_TRANSITION":
            case 6:
                message.messageStubType = 6;
                break;
            case "VERIFIED_LOW_UNKNOWN":
            case 7:
                message.messageStubType = 7;
                break;
            case "VERIFIED_HIGH":
            case 8:
                message.messageStubType = 8;
                break;
            case "VERIFIED_INITIAL_UNKNOWN":
            case 9:
                message.messageStubType = 9;
                break;
            case "VERIFIED_INITIAL_LOW":
            case 10:
                message.messageStubType = 10;
                break;
            case "VERIFIED_INITIAL_HIGH":
            case 11:
                message.messageStubType = 11;
                break;
            case "VERIFIED_TRANSITION_ANY_TO_NONE":
            case 12:
                message.messageStubType = 12;
                break;
            case "VERIFIED_TRANSITION_ANY_TO_HIGH":
            case 13:
                message.messageStubType = 13;
                break;
            case "VERIFIED_TRANSITION_HIGH_TO_LOW":
            case 14:
                message.messageStubType = 14;
                break;
            case "VERIFIED_TRANSITION_HIGH_TO_UNKNOWN":
            case 15:
                message.messageStubType = 15;
                break;
            case "VERIFIED_TRANSITION_UNKNOWN_TO_LOW":
            case 16:
                message.messageStubType = 16;
                break;
            case "VERIFIED_TRANSITION_LOW_TO_UNKNOWN":
            case 17:
                message.messageStubType = 17;
                break;
            case "VERIFIED_TRANSITION_NONE_TO_LOW":
            case 18:
                message.messageStubType = 18;
                break;
            case "VERIFIED_TRANSITION_NONE_TO_UNKNOWN":
            case 19:
                message.messageStubType = 19;
                break;
            case "GROUP_CREATE":
            case 20:
                message.messageStubType = 20;
                break;
            case "GROUP_CHANGE_SUBJECT":
            case 21:
                message.messageStubType = 21;
                break;
            case "GROUP_CHANGE_ICON":
            case 22:
                message.messageStubType = 22;
                break;
            case "GROUP_CHANGE_INVITE_LINK":
            case 23:
                message.messageStubType = 23;
                break;
            case "GROUP_CHANGE_DESCRIPTION":
            case 24:
                message.messageStubType = 24;
                break;
            case "GROUP_CHANGE_RESTRICT":
            case 25:
                message.messageStubType = 25;
                break;
            case "GROUP_CHANGE_ANNOUNCE":
            case 26:
                message.messageStubType = 26;
                break;
            case "GROUP_PARTICIPANT_ADD":
            case 27:
                message.messageStubType = 27;
                break;
            case "GROUP_PARTICIPANT_REMOVE":
            case 28:
                message.messageStubType = 28;
                break;
            case "GROUP_PARTICIPANT_PROMOTE":
            case 29:
                message.messageStubType = 29;
                break;
            case "GROUP_PARTICIPANT_DEMOTE":
            case 30:
                message.messageStubType = 30;
                break;
            case "GROUP_PARTICIPANT_INVITE":
            case 31:
                message.messageStubType = 31;
                break;
            case "GROUP_PARTICIPANT_LEAVE":
            case 32:
                message.messageStubType = 32;
                break;
            case "GROUP_PARTICIPANT_CHANGE_NUMBER":
            case 33:
                message.messageStubType = 33;
                break;
            case "BROADCAST_CREATE":
            case 34:
                message.messageStubType = 34;
                break;
            case "BROADCAST_ADD":
            case 35:
                message.messageStubType = 35;
                break;
            case "BROADCAST_REMOVE":
            case 36:
                message.messageStubType = 36;
                break;
            case "GENERIC_NOTIFICATION":
            case 37:
                message.messageStubType = 37;
                break;
            case "E2E_IDENTITY_CHANGED":
            case 38:
                message.messageStubType = 38;
                break;
            case "E2E_ENCRYPTED":
            case 39:
                message.messageStubType = 39;
                break;
            case "CALL_MISSED_VOICE":
            case 40:
                message.messageStubType = 40;
                break;
            case "CALL_MISSED_VIDEO":
            case 41:
                message.messageStubType = 41;
                break;
            case "INDIVIDUAL_CHANGE_NUMBER":
            case 42:
                message.messageStubType = 42;
                break;
            case "GROUP_DELETE":
            case 43:
                message.messageStubType = 43;
                break;
            case "GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE":
            case 44:
                message.messageStubType = 44;
                break;
            case "CALL_MISSED_GROUP_VOICE":
            case 45:
                message.messageStubType = 45;
                break;
            case "CALL_MISSED_GROUP_VIDEO":
            case 46:
                message.messageStubType = 46;
                break;
            case "PAYMENT_CIPHERTEXT":
            case 47:
                message.messageStubType = 47;
                break;
            case "PAYMENT_FUTUREPROOF":
            case 48:
                message.messageStubType = 48;
                break;
            case "PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED":
            case 49:
                message.messageStubType = 49;
                break;
            case "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED":
            case 50:
                message.messageStubType = 50;
                break;
            case "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED":
            case 51:
                message.messageStubType = 51;
                break;
            case "PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP":
            case 52:
                message.messageStubType = 52;
                break;
            case "PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP":
            case 53:
                message.messageStubType = 53;
                break;
            case "PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER":
            case 54:
                message.messageStubType = 54;
                break;
            case "PAYMENT_ACTION_SEND_PAYMENT_REMINDER":
            case 55:
                message.messageStubType = 55;
                break;
            case "PAYMENT_ACTION_SEND_PAYMENT_INVITATION":
            case 56:
                message.messageStubType = 56;
                break;
            case "PAYMENT_ACTION_REQUEST_DECLINED":
            case 57:
                message.messageStubType = 57;
                break;
            case "PAYMENT_ACTION_REQUEST_EXPIRED":
            case 58:
                message.messageStubType = 58;
                break;
            case "PAYMENT_ACTION_REQUEST_CANCELLED":
            case 59:
                message.messageStubType = 59;
                break;
            case "BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM":
            case 60:
                message.messageStubType = 60;
                break;
            case "BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP":
            case 61:
                message.messageStubType = 61;
                break;
            case "BIZ_INTRO_TOP":
            case 62:
                message.messageStubType = 62;
                break;
            case "BIZ_INTRO_BOTTOM":
            case 63:
                message.messageStubType = 63;
                break;
            case "BIZ_NAME_CHANGE":
            case 64:
                message.messageStubType = 64;
                break;
            case "BIZ_MOVE_TO_CONSUMER_APP":
            case 65:
                message.messageStubType = 65;
                break;
            case "BIZ_TWO_TIER_MIGRATION_TOP":
            case 66:
                message.messageStubType = 66;
                break;
            case "BIZ_TWO_TIER_MIGRATION_BOTTOM":
            case 67:
                message.messageStubType = 67;
                break;
            case "OVERSIZED":
            case 68:
                message.messageStubType = 68;
                break;
            case "GROUP_CHANGE_NO_FREQUENTLY_FORWARDED":
            case 69:
                message.messageStubType = 69;
                break;
            case "GROUP_V4_ADD_INVITE_SENT":
            case 70:
                message.messageStubType = 70;
                break;
            case "GROUP_PARTICIPANT_ADD_REQUEST_JOIN":
            case 71:
                message.messageStubType = 71;
                break;
            case "CHANGE_EPHEMERAL_SETTING":
            case 72:
                message.messageStubType = 72;
                break;
            }
            if (object.clearMedia != null)
                message.clearMedia = Boolean(object.clearMedia);
            if (object.messageStubParameters) {
                if (!Array.isArray(object.messageStubParameters))
                    throw TypeError(".proto.WebMessageInfo.messageStubParameters: array expected");
                message.messageStubParameters = [];
                for (var i = 0; i < object.messageStubParameters.length; ++i)
                    message.messageStubParameters[i] = String(object.messageStubParameters[i]);
            }
            if (object.duration != null)
                message.duration = object.duration >>> 0;
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".proto.WebMessageInfo.labels: array expected");
                message.labels = [];
                for (var i = 0; i < object.labels.length; ++i)
                    message.labels[i] = String(object.labels[i]);
            }
            if (object.paymentInfo != null) {
                if (typeof object.paymentInfo !== "object")
                    throw TypeError(".proto.WebMessageInfo.paymentInfo: object expected");
                message.paymentInfo = $root.proto.PaymentInfo.fromObject(object.paymentInfo);
            }
            if (object.finalLiveLocation != null) {
                if (typeof object.finalLiveLocation !== "object")
                    throw TypeError(".proto.WebMessageInfo.finalLiveLocation: object expected");
                message.finalLiveLocation = $root.proto.LiveLocationMessage.fromObject(object.finalLiveLocation);
            }
            if (object.quotedPaymentInfo != null) {
                if (typeof object.quotedPaymentInfo !== "object")
                    throw TypeError(".proto.WebMessageInfo.quotedPaymentInfo: object expected");
                message.quotedPaymentInfo = $root.proto.PaymentInfo.fromObject(object.quotedPaymentInfo);
            }
            if (object.ephemeralStartTimestamp != null)
                if ($util.Long)
                    (message.ephemeralStartTimestamp = $util.Long.fromValue(object.ephemeralStartTimestamp)).unsigned = true;
                else if (typeof object.ephemeralStartTimestamp === "string")
                    message.ephemeralStartTimestamp = parseInt(object.ephemeralStartTimestamp, 10);
                else if (typeof object.ephemeralStartTimestamp === "number")
                    message.ephemeralStartTimestamp = object.ephemeralStartTimestamp;
                else if (typeof object.ephemeralStartTimestamp === "object")
                    message.ephemeralStartTimestamp = new $util.LongBits(object.ephemeralStartTimestamp.low >>> 0, object.ephemeralStartTimestamp.high >>> 0).toNumber(true);
            if (object.ephemeralDuration != null)
                message.ephemeralDuration = object.ephemeralDuration >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a WebMessageInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.WebMessageInfo
         * @static
         * @param {proto.WebMessageInfo} message WebMessageInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WebMessageInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.messageStubParameters = [];
                object.labels = [];
            }
            if (options.defaults) {
                object.key = null;
                object.message = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.messageTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.messageTimestamp = options.longs === String ? "0" : 0;
                object.status = options.enums === String ? "ERROR" : 0;
                object.participant = "";
                object.ignore = false;
                object.starred = false;
                object.broadcast = false;
                object.pushName = "";
                if (options.bytes === String)
                    object.mediaCiphertextSha256 = "";
                else {
                    object.mediaCiphertextSha256 = [];
                    if (options.bytes !== Array)
                        object.mediaCiphertextSha256 = $util.newBuffer(object.mediaCiphertextSha256);
                }
                object.multicast = false;
                object.urlText = false;
                object.urlNumber = false;
                object.messageStubType = options.enums === String ? "UNKNOWN" : 0;
                object.clearMedia = false;
                object.duration = 0;
                object.paymentInfo = null;
                object.finalLiveLocation = null;
                object.quotedPaymentInfo = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.ephemeralStartTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.ephemeralStartTimestamp = options.longs === String ? "0" : 0;
                object.ephemeralDuration = 0;
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = $root.proto.MessageKey.toObject(message.key, options);
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.proto.Message.toObject(message.message, options);
            if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                if (typeof message.messageTimestamp === "number")
                    object.messageTimestamp = options.longs === String ? String(message.messageTimestamp) : message.messageTimestamp;
                else
                    object.messageTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.messageTimestamp) : options.longs === Number ? new $util.LongBits(message.messageTimestamp.low >>> 0, message.messageTimestamp.high >>> 0).toNumber(true) : message.messageTimestamp;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS[message.status] : message.status;
            if (message.participant != null && message.hasOwnProperty("participant"))
                object.participant = message.participant;
            if (message.ignore != null && message.hasOwnProperty("ignore"))
                object.ignore = message.ignore;
            if (message.starred != null && message.hasOwnProperty("starred"))
                object.starred = message.starred;
            if (message.broadcast != null && message.hasOwnProperty("broadcast"))
                object.broadcast = message.broadcast;
            if (message.pushName != null && message.hasOwnProperty("pushName"))
                object.pushName = message.pushName;
            if (message.mediaCiphertextSha256 != null && message.hasOwnProperty("mediaCiphertextSha256"))
                object.mediaCiphertextSha256 = options.bytes === String ? $util.base64.encode(message.mediaCiphertextSha256, 0, message.mediaCiphertextSha256.length) : options.bytes === Array ? Array.prototype.slice.call(message.mediaCiphertextSha256) : message.mediaCiphertextSha256;
            if (message.multicast != null && message.hasOwnProperty("multicast"))
                object.multicast = message.multicast;
            if (message.urlText != null && message.hasOwnProperty("urlText"))
                object.urlText = message.urlText;
            if (message.urlNumber != null && message.hasOwnProperty("urlNumber"))
                object.urlNumber = message.urlNumber;
            if (message.messageStubType != null && message.hasOwnProperty("messageStubType"))
                object.messageStubType = options.enums === String ? $root.proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE[message.messageStubType] : message.messageStubType;
            if (message.clearMedia != null && message.hasOwnProperty("clearMedia"))
                object.clearMedia = message.clearMedia;
            if (message.messageStubParameters && message.messageStubParameters.length) {
                object.messageStubParameters = [];
                for (var j = 0; j < message.messageStubParameters.length; ++j)
                    object.messageStubParameters[j] = message.messageStubParameters[j];
            }
            if (message.duration != null && message.hasOwnProperty("duration"))
                object.duration = message.duration;
            if (message.labels && message.labels.length) {
                object.labels = [];
                for (var j = 0; j < message.labels.length; ++j)
                    object.labels[j] = message.labels[j];
            }
            if (message.paymentInfo != null && message.hasOwnProperty("paymentInfo"))
                object.paymentInfo = $root.proto.PaymentInfo.toObject(message.paymentInfo, options);
            if (message.finalLiveLocation != null && message.hasOwnProperty("finalLiveLocation"))
                object.finalLiveLocation = $root.proto.LiveLocationMessage.toObject(message.finalLiveLocation, options);
            if (message.quotedPaymentInfo != null && message.hasOwnProperty("quotedPaymentInfo"))
                object.quotedPaymentInfo = $root.proto.PaymentInfo.toObject(message.quotedPaymentInfo, options);
            if (message.ephemeralStartTimestamp != null && message.hasOwnProperty("ephemeralStartTimestamp"))
                if (typeof message.ephemeralStartTimestamp === "number")
                    object.ephemeralStartTimestamp = options.longs === String ? String(message.ephemeralStartTimestamp) : message.ephemeralStartTimestamp;
                else
                    object.ephemeralStartTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.ephemeralStartTimestamp) : options.longs === Number ? new $util.LongBits(message.ephemeralStartTimestamp.low >>> 0, message.ephemeralStartTimestamp.high >>> 0).toNumber(true) : message.ephemeralStartTimestamp;
            if (message.ephemeralDuration != null && message.hasOwnProperty("ephemeralDuration"))
                object.ephemeralDuration = message.ephemeralDuration;
            return object;
        };

        /**
         * Converts this WebMessageInfo to JSON.
         * @function toJSON
         * @memberof proto.WebMessageInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WebMessageInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * WEB_MESSAGE_INFO_STATUS enum.
         * @name proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS
         * @enum {number}
         * @property {number} ERROR=0 ERROR value
         * @property {number} PENDING=1 PENDING value
         * @property {number} SERVER_ACK=2 SERVER_ACK value
         * @property {number} DELIVERY_ACK=3 DELIVERY_ACK value
         * @property {number} READ=4 READ value
         * @property {number} PLAYED=5 PLAYED value
         */
        WebMessageInfo.WEB_MESSAGE_INFO_STATUS = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ERROR"] = 0;
            values[valuesById[1] = "PENDING"] = 1;
            values[valuesById[2] = "SERVER_ACK"] = 2;
            values[valuesById[3] = "DELIVERY_ACK"] = 3;
            values[valuesById[4] = "READ"] = 4;
            values[valuesById[5] = "PLAYED"] = 5;
            return values;
        })();

        /**
         * WEB_MESSAGE_INFO_STUBTYPE enum.
         * @name proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} REVOKE=1 REVOKE value
         * @property {number} CIPHERTEXT=2 CIPHERTEXT value
         * @property {number} FUTUREPROOF=3 FUTUREPROOF value
         * @property {number} NON_VERIFIED_TRANSITION=4 NON_VERIFIED_TRANSITION value
         * @property {number} UNVERIFIED_TRANSITION=5 UNVERIFIED_TRANSITION value
         * @property {number} VERIFIED_TRANSITION=6 VERIFIED_TRANSITION value
         * @property {number} VERIFIED_LOW_UNKNOWN=7 VERIFIED_LOW_UNKNOWN value
         * @property {number} VERIFIED_HIGH=8 VERIFIED_HIGH value
         * @property {number} VERIFIED_INITIAL_UNKNOWN=9 VERIFIED_INITIAL_UNKNOWN value
         * @property {number} VERIFIED_INITIAL_LOW=10 VERIFIED_INITIAL_LOW value
         * @property {number} VERIFIED_INITIAL_HIGH=11 VERIFIED_INITIAL_HIGH value
         * @property {number} VERIFIED_TRANSITION_ANY_TO_NONE=12 VERIFIED_TRANSITION_ANY_TO_NONE value
         * @property {number} VERIFIED_TRANSITION_ANY_TO_HIGH=13 VERIFIED_TRANSITION_ANY_TO_HIGH value
         * @property {number} VERIFIED_TRANSITION_HIGH_TO_LOW=14 VERIFIED_TRANSITION_HIGH_TO_LOW value
         * @property {number} VERIFIED_TRANSITION_HIGH_TO_UNKNOWN=15 VERIFIED_TRANSITION_HIGH_TO_UNKNOWN value
         * @property {number} VERIFIED_TRANSITION_UNKNOWN_TO_LOW=16 VERIFIED_TRANSITION_UNKNOWN_TO_LOW value
         * @property {number} VERIFIED_TRANSITION_LOW_TO_UNKNOWN=17 VERIFIED_TRANSITION_LOW_TO_UNKNOWN value
         * @property {number} VERIFIED_TRANSITION_NONE_TO_LOW=18 VERIFIED_TRANSITION_NONE_TO_LOW value
         * @property {number} VERIFIED_TRANSITION_NONE_TO_UNKNOWN=19 VERIFIED_TRANSITION_NONE_TO_UNKNOWN value
         * @property {number} GROUP_CREATE=20 GROUP_CREATE value
         * @property {number} GROUP_CHANGE_SUBJECT=21 GROUP_CHANGE_SUBJECT value
         * @property {number} GROUP_CHANGE_ICON=22 GROUP_CHANGE_ICON value
         * @property {number} GROUP_CHANGE_INVITE_LINK=23 GROUP_CHANGE_INVITE_LINK value
         * @property {number} GROUP_CHANGE_DESCRIPTION=24 GROUP_CHANGE_DESCRIPTION value
         * @property {number} GROUP_CHANGE_RESTRICT=25 GROUP_CHANGE_RESTRICT value
         * @property {number} GROUP_CHANGE_ANNOUNCE=26 GROUP_CHANGE_ANNOUNCE value
         * @property {number} GROUP_PARTICIPANT_ADD=27 GROUP_PARTICIPANT_ADD value
         * @property {number} GROUP_PARTICIPANT_REMOVE=28 GROUP_PARTICIPANT_REMOVE value
         * @property {number} GROUP_PARTICIPANT_PROMOTE=29 GROUP_PARTICIPANT_PROMOTE value
         * @property {number} GROUP_PARTICIPANT_DEMOTE=30 GROUP_PARTICIPANT_DEMOTE value
         * @property {number} GROUP_PARTICIPANT_INVITE=31 GROUP_PARTICIPANT_INVITE value
         * @property {number} GROUP_PARTICIPANT_LEAVE=32 GROUP_PARTICIPANT_LEAVE value
         * @property {number} GROUP_PARTICIPANT_CHANGE_NUMBER=33 GROUP_PARTICIPANT_CHANGE_NUMBER value
         * @property {number} BROADCAST_CREATE=34 BROADCAST_CREATE value
         * @property {number} BROADCAST_ADD=35 BROADCAST_ADD value
         * @property {number} BROADCAST_REMOVE=36 BROADCAST_REMOVE value
         * @property {number} GENERIC_NOTIFICATION=37 GENERIC_NOTIFICATION value
         * @property {number} E2E_IDENTITY_CHANGED=38 E2E_IDENTITY_CHANGED value
         * @property {number} E2E_ENCRYPTED=39 E2E_ENCRYPTED value
         * @property {number} CALL_MISSED_VOICE=40 CALL_MISSED_VOICE value
         * @property {number} CALL_MISSED_VIDEO=41 CALL_MISSED_VIDEO value
         * @property {number} INDIVIDUAL_CHANGE_NUMBER=42 INDIVIDUAL_CHANGE_NUMBER value
         * @property {number} GROUP_DELETE=43 GROUP_DELETE value
         * @property {number} GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE=44 GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE value
         * @property {number} CALL_MISSED_GROUP_VOICE=45 CALL_MISSED_GROUP_VOICE value
         * @property {number} CALL_MISSED_GROUP_VIDEO=46 CALL_MISSED_GROUP_VIDEO value
         * @property {number} PAYMENT_CIPHERTEXT=47 PAYMENT_CIPHERTEXT value
         * @property {number} PAYMENT_FUTUREPROOF=48 PAYMENT_FUTUREPROOF value
         * @property {number} PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED=49 PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED value
         * @property {number} PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED=50 PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED value
         * @property {number} PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED=51 PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED value
         * @property {number} PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP=52 PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP value
         * @property {number} PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP=53 PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP value
         * @property {number} PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER=54 PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER value
         * @property {number} PAYMENT_ACTION_SEND_PAYMENT_REMINDER=55 PAYMENT_ACTION_SEND_PAYMENT_REMINDER value
         * @property {number} PAYMENT_ACTION_SEND_PAYMENT_INVITATION=56 PAYMENT_ACTION_SEND_PAYMENT_INVITATION value
         * @property {number} PAYMENT_ACTION_REQUEST_DECLINED=57 PAYMENT_ACTION_REQUEST_DECLINED value
         * @property {number} PAYMENT_ACTION_REQUEST_EXPIRED=58 PAYMENT_ACTION_REQUEST_EXPIRED value
         * @property {number} PAYMENT_ACTION_REQUEST_CANCELLED=59 PAYMENT_ACTION_REQUEST_CANCELLED value
         * @property {number} BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM=60 BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM value
         * @property {number} BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP=61 BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP value
         * @property {number} BIZ_INTRO_TOP=62 BIZ_INTRO_TOP value
         * @property {number} BIZ_INTRO_BOTTOM=63 BIZ_INTRO_BOTTOM value
         * @property {number} BIZ_NAME_CHANGE=64 BIZ_NAME_CHANGE value
         * @property {number} BIZ_MOVE_TO_CONSUMER_APP=65 BIZ_MOVE_TO_CONSUMER_APP value
         * @property {number} BIZ_TWO_TIER_MIGRATION_TOP=66 BIZ_TWO_TIER_MIGRATION_TOP value
         * @property {number} BIZ_TWO_TIER_MIGRATION_BOTTOM=67 BIZ_TWO_TIER_MIGRATION_BOTTOM value
         * @property {number} OVERSIZED=68 OVERSIZED value
         * @property {number} GROUP_CHANGE_NO_FREQUENTLY_FORWARDED=69 GROUP_CHANGE_NO_FREQUENTLY_FORWARDED value
         * @property {number} GROUP_V4_ADD_INVITE_SENT=70 GROUP_V4_ADD_INVITE_SENT value
         * @property {number} GROUP_PARTICIPANT_ADD_REQUEST_JOIN=71 GROUP_PARTICIPANT_ADD_REQUEST_JOIN value
         * @property {number} CHANGE_EPHEMERAL_SETTING=72 CHANGE_EPHEMERAL_SETTING value
         */
        WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "REVOKE"] = 1;
            values[valuesById[2] = "CIPHERTEXT"] = 2;
            values[valuesById[3] = "FUTUREPROOF"] = 3;
            values[valuesById[4] = "NON_VERIFIED_TRANSITION"] = 4;
            values[valuesById[5] = "UNVERIFIED_TRANSITION"] = 5;
            values[valuesById[6] = "VERIFIED_TRANSITION"] = 6;
            values[valuesById[7] = "VERIFIED_LOW_UNKNOWN"] = 7;
            values[valuesById[8] = "VERIFIED_HIGH"] = 8;
            values[valuesById[9] = "VERIFIED_INITIAL_UNKNOWN"] = 9;
            values[valuesById[10] = "VERIFIED_INITIAL_LOW"] = 10;
            values[valuesById[11] = "VERIFIED_INITIAL_HIGH"] = 11;
            values[valuesById[12] = "VERIFIED_TRANSITION_ANY_TO_NONE"] = 12;
            values[valuesById[13] = "VERIFIED_TRANSITION_ANY_TO_HIGH"] = 13;
            values[valuesById[14] = "VERIFIED_TRANSITION_HIGH_TO_LOW"] = 14;
            values[valuesById[15] = "VERIFIED_TRANSITION_HIGH_TO_UNKNOWN"] = 15;
            values[valuesById[16] = "VERIFIED_TRANSITION_UNKNOWN_TO_LOW"] = 16;
            values[valuesById[17] = "VERIFIED_TRANSITION_LOW_TO_UNKNOWN"] = 17;
            values[valuesById[18] = "VERIFIED_TRANSITION_NONE_TO_LOW"] = 18;
            values[valuesById[19] = "VERIFIED_TRANSITION_NONE_TO_UNKNOWN"] = 19;
            values[valuesById[20] = "GROUP_CREATE"] = 20;
            values[valuesById[21] = "GROUP_CHANGE_SUBJECT"] = 21;
            values[valuesById[22] = "GROUP_CHANGE_ICON"] = 22;
            values[valuesById[23] = "GROUP_CHANGE_INVITE_LINK"] = 23;
            values[valuesById[24] = "GROUP_CHANGE_DESCRIPTION"] = 24;
            values[valuesById[25] = "GROUP_CHANGE_RESTRICT"] = 25;
            values[valuesById[26] = "GROUP_CHANGE_ANNOUNCE"] = 26;
            values[valuesById[27] = "GROUP_PARTICIPANT_ADD"] = 27;
            values[valuesById[28] = "GROUP_PARTICIPANT_REMOVE"] = 28;
            values[valuesById[29] = "GROUP_PARTICIPANT_PROMOTE"] = 29;
            values[valuesById[30] = "GROUP_PARTICIPANT_DEMOTE"] = 30;
            values[valuesById[31] = "GROUP_PARTICIPANT_INVITE"] = 31;
            values[valuesById[32] = "GROUP_PARTICIPANT_LEAVE"] = 32;
            values[valuesById[33] = "GROUP_PARTICIPANT_CHANGE_NUMBER"] = 33;
            values[valuesById[34] = "BROADCAST_CREATE"] = 34;
            values[valuesById[35] = "BROADCAST_ADD"] = 35;
            values[valuesById[36] = "BROADCAST_REMOVE"] = 36;
            values[valuesById[37] = "GENERIC_NOTIFICATION"] = 37;
            values[valuesById[38] = "E2E_IDENTITY_CHANGED"] = 38;
            values[valuesById[39] = "E2E_ENCRYPTED"] = 39;
            values[valuesById[40] = "CALL_MISSED_VOICE"] = 40;
            values[valuesById[41] = "CALL_MISSED_VIDEO"] = 41;
            values[valuesById[42] = "INDIVIDUAL_CHANGE_NUMBER"] = 42;
            values[valuesById[43] = "GROUP_DELETE"] = 43;
            values[valuesById[44] = "GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE"] = 44;
            values[valuesById[45] = "CALL_MISSED_GROUP_VOICE"] = 45;
            values[valuesById[46] = "CALL_MISSED_GROUP_VIDEO"] = 46;
            values[valuesById[47] = "PAYMENT_CIPHERTEXT"] = 47;
            values[valuesById[48] = "PAYMENT_FUTUREPROOF"] = 48;
            values[valuesById[49] = "PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED"] = 49;
            values[valuesById[50] = "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED"] = 50;
            values[valuesById[51] = "PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED"] = 51;
            values[valuesById[52] = "PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP"] = 52;
            values[valuesById[53] = "PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP"] = 53;
            values[valuesById[54] = "PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER"] = 54;
            values[valuesById[55] = "PAYMENT_ACTION_SEND_PAYMENT_REMINDER"] = 55;
            values[valuesById[56] = "PAYMENT_ACTION_SEND_PAYMENT_INVITATION"] = 56;
            values[valuesById[57] = "PAYMENT_ACTION_REQUEST_DECLINED"] = 57;
            values[valuesById[58] = "PAYMENT_ACTION_REQUEST_EXPIRED"] = 58;
            values[valuesById[59] = "PAYMENT_ACTION_REQUEST_CANCELLED"] = 59;
            values[valuesById[60] = "BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM"] = 60;
            values[valuesById[61] = "BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP"] = 61;
            values[valuesById[62] = "BIZ_INTRO_TOP"] = 62;
            values[valuesById[63] = "BIZ_INTRO_BOTTOM"] = 63;
            values[valuesById[64] = "BIZ_NAME_CHANGE"] = 64;
            values[valuesById[65] = "BIZ_MOVE_TO_CONSUMER_APP"] = 65;
            values[valuesById[66] = "BIZ_TWO_TIER_MIGRATION_TOP"] = 66;
            values[valuesById[67] = "BIZ_TWO_TIER_MIGRATION_BOTTOM"] = 67;
            values[valuesById[68] = "OVERSIZED"] = 68;
            values[valuesById[69] = "GROUP_CHANGE_NO_FREQUENTLY_FORWARDED"] = 69;
            values[valuesById[70] = "GROUP_V4_ADD_INVITE_SENT"] = 70;
            values[valuesById[71] = "GROUP_PARTICIPANT_ADD_REQUEST_JOIN"] = 71;
            values[valuesById[72] = "CHANGE_EPHEMERAL_SETTING"] = 72;
            return values;
        })();

        return WebMessageInfo;
    })();

    return proto;
})();

module.exports = $root;
