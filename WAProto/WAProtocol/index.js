/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAProtocol = (function() {

    /**
     * Namespace WAProtocol.
     * @exports WAProtocol
     * @namespace
     */
    var WAProtocol = {};

    WAProtocol.MessageKey = (function() {

        /**
         * Properties of a MessageKey.
         * @memberof WAProtocol
         * @interface IMessageKey
         * @property {string|null} [remoteJID] MessageKey remoteJID
         * @property {boolean|null} [fromMe] MessageKey fromMe
         * @property {string|null} [ID] MessageKey ID
         * @property {string|null} [participant] MessageKey participant
         */

        /**
         * Constructs a new MessageKey.
         * @memberof WAProtocol
         * @classdesc Represents a MessageKey.
         * @implements IMessageKey
         * @constructor
         * @param {WAProtocol.IMessageKey=} [properties] Properties to set
         */
        function MessageKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MessageKey remoteJID.
         * @member {string} remoteJID
         * @memberof WAProtocol.MessageKey
         * @instance
         */
        MessageKey.prototype.remoteJID = "";

        /**
         * MessageKey fromMe.
         * @member {boolean} fromMe
         * @memberof WAProtocol.MessageKey
         * @instance
         */
        MessageKey.prototype.fromMe = false;

        /**
         * MessageKey ID.
         * @member {string} ID
         * @memberof WAProtocol.MessageKey
         * @instance
         */
        MessageKey.prototype.ID = "";

        /**
         * MessageKey participant.
         * @member {string} participant
         * @memberof WAProtocol.MessageKey
         * @instance
         */
        MessageKey.prototype.participant = "";

        /**
         * Creates a new MessageKey instance using the specified properties.
         * @function create
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {WAProtocol.IMessageKey=} [properties] Properties to set
         * @returns {WAProtocol.MessageKey} MessageKey instance
         */
        MessageKey.create = function create(properties) {
            return new MessageKey(properties);
        };

        /**
         * Encodes the specified MessageKey message. Does not implicitly {@link WAProtocol.MessageKey.verify|verify} messages.
         * @function encode
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {WAProtocol.IMessageKey} message MessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.remoteJID != null && Object.hasOwnProperty.call(message, "remoteJID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.remoteJID);
            if (message.fromMe != null && Object.hasOwnProperty.call(message, "fromMe"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.fromMe);
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.ID);
            if (message.participant != null && Object.hasOwnProperty.call(message, "participant"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.participant);
            return writer;
        };

        /**
         * Encodes the specified MessageKey message, length delimited. Does not implicitly {@link WAProtocol.MessageKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {WAProtocol.IMessageKey} message MessageKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessageKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MessageKey message from the specified reader or buffer.
         * @function decode
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAProtocol.MessageKey} MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessageKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAProtocol.MessageKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.remoteJID = reader.string();
                        break;
                    }
                case 2: {
                        message.fromMe = reader.bool();
                        break;
                    }
                case 3: {
                        message.ID = reader.string();
                        break;
                    }
                case 4: {
                        message.participant = reader.string();
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
         * Decodes a MessageKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAProtocol.MessageKey} MessageKey
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
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MessageKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.remoteJID != null && message.hasOwnProperty("remoteJID"))
                if (!$util.isString(message.remoteJID))
                    return "remoteJID: string expected";
            if (message.fromMe != null && message.hasOwnProperty("fromMe"))
                if (typeof message.fromMe !== "boolean")
                    return "fromMe: boolean expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.participant != null && message.hasOwnProperty("participant"))
                if (!$util.isString(message.participant))
                    return "participant: string expected";
            return null;
        };

        /**
         * Creates a MessageKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAProtocol.MessageKey} MessageKey
         */
        MessageKey.fromObject = function fromObject(object) {
            if (object instanceof $root.WAProtocol.MessageKey)
                return object;
            var message = new $root.WAProtocol.MessageKey();
            if (object.remoteJID != null)
                message.remoteJID = String(object.remoteJID);
            if (object.fromMe != null)
                message.fromMe = Boolean(object.fromMe);
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.participant != null)
                message.participant = String(object.participant);
            return message;
        };

        /**
         * Creates a plain object from a MessageKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {WAProtocol.MessageKey} message MessageKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MessageKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.remoteJID = "";
                object.fromMe = false;
                object.ID = "";
                object.participant = "";
            }
            if (message.remoteJID != null && message.hasOwnProperty("remoteJID"))
                object.remoteJID = message.remoteJID;
            if (message.fromMe != null && message.hasOwnProperty("fromMe"))
                object.fromMe = message.fromMe;
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.participant != null && message.hasOwnProperty("participant"))
                object.participant = message.participant;
            return object;
        };

        /**
         * Converts this MessageKey to JSON.
         * @function toJSON
         * @memberof WAProtocol.MessageKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MessageKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MessageKey
         * @function getTypeUrl
         * @memberof WAProtocol.MessageKey
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MessageKey.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAProtocol.MessageKey";
        };

        return MessageKey;
    })();

    return WAProtocol;
})();

module.exports = $root;
