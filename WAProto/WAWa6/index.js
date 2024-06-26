/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAWa6 = (function() {

    /**
     * Namespace WAWa6.
     * @exports WAWa6
     * @namespace
     */
    var WAWa6 = {};

    WAWa6.ClientPayload = (function() {

        /**
         * Properties of a ClientPayload.
         * @memberof WAWa6
         * @interface IClientPayload
         * @property {number|Long|null} [username] ClientPayload username
         * @property {boolean|null} [passive] ClientPayload passive
         * @property {WAWa6.ClientPayload.IUserAgent|null} [userAgent] ClientPayload userAgent
         * @property {WAWa6.ClientPayload.IWebInfo|null} [webInfo] ClientPayload webInfo
         * @property {string|null} [pushName] ClientPayload pushName
         * @property {number|null} [sessionID] ClientPayload sessionID
         * @property {boolean|null} [shortConnect] ClientPayload shortConnect
         * @property {WAWa6.ClientPayload.ConnectType|null} [connectType] ClientPayload connectType
         * @property {WAWa6.ClientPayload.ConnectReason|null} [connectReason] ClientPayload connectReason
         * @property {Array.<number>|null} [shards] ClientPayload shards
         * @property {WAWa6.ClientPayload.IDNSSource|null} [dnsSource] ClientPayload dnsSource
         * @property {number|null} [connectAttemptCount] ClientPayload connectAttemptCount
         * @property {number|null} [device] ClientPayload device
         * @property {WAWa6.ClientPayload.IDevicePairingRegistrationData|null} [devicePairingData] ClientPayload devicePairingData
         * @property {WAWa6.ClientPayload.Product|null} [product] ClientPayload product
         * @property {Uint8Array|null} [fbCat] ClientPayload fbCat
         * @property {Uint8Array|null} [fbUserAgent] ClientPayload fbUserAgent
         * @property {boolean|null} [oc] ClientPayload oc
         * @property {number|null} [lc] ClientPayload lc
         * @property {WAWa6.ClientPayload.IOSAppExtension|null} [iosAppExtension] ClientPayload iosAppExtension
         * @property {number|Long|null} [fbAppID] ClientPayload fbAppID
         * @property {Uint8Array|null} [fbDeviceID] ClientPayload fbDeviceID
         * @property {boolean|null} [pull] ClientPayload pull
         * @property {Uint8Array|null} [paddingBytes] ClientPayload paddingBytes
         * @property {number|null} [yearClass] ClientPayload yearClass
         * @property {number|null} [memClass] ClientPayload memClass
         * @property {WAWa6.ClientPayload.IInteropData|null} [interopData] ClientPayload interopData
         * @property {boolean|null} [isPcr] ClientPayload isPcr
         */

        /**
         * Constructs a new ClientPayload.
         * @memberof WAWa6
         * @classdesc Represents a ClientPayload.
         * @implements IClientPayload
         * @constructor
         * @param {WAWa6.IClientPayload=} [properties] Properties to set
         */
        function ClientPayload(properties) {
            this.shards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientPayload username.
         * @member {number|Long} username
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.username = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ClientPayload passive.
         * @member {boolean} passive
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.passive = false;

        /**
         * ClientPayload userAgent.
         * @member {WAWa6.ClientPayload.IUserAgent|null|undefined} userAgent
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.userAgent = null;

        /**
         * ClientPayload webInfo.
         * @member {WAWa6.ClientPayload.IWebInfo|null|undefined} webInfo
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.webInfo = null;

        /**
         * ClientPayload pushName.
         * @member {string} pushName
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.pushName = "";

        /**
         * ClientPayload sessionID.
         * @member {number} sessionID
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.sessionID = 0;

        /**
         * ClientPayload shortConnect.
         * @member {boolean} shortConnect
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.shortConnect = false;

        /**
         * ClientPayload connectType.
         * @member {WAWa6.ClientPayload.ConnectType} connectType
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.connectType = 0;

        /**
         * ClientPayload connectReason.
         * @member {WAWa6.ClientPayload.ConnectReason} connectReason
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.connectReason = 0;

        /**
         * ClientPayload shards.
         * @member {Array.<number>} shards
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.shards = $util.emptyArray;

        /**
         * ClientPayload dnsSource.
         * @member {WAWa6.ClientPayload.IDNSSource|null|undefined} dnsSource
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.dnsSource = null;

        /**
         * ClientPayload connectAttemptCount.
         * @member {number} connectAttemptCount
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.connectAttemptCount = 0;

        /**
         * ClientPayload device.
         * @member {number} device
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.device = 0;

        /**
         * ClientPayload devicePairingData.
         * @member {WAWa6.ClientPayload.IDevicePairingRegistrationData|null|undefined} devicePairingData
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.devicePairingData = null;

        /**
         * ClientPayload product.
         * @member {WAWa6.ClientPayload.Product} product
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.product = 0;

        /**
         * ClientPayload fbCat.
         * @member {Uint8Array} fbCat
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.fbCat = $util.newBuffer([]);

        /**
         * ClientPayload fbUserAgent.
         * @member {Uint8Array} fbUserAgent
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.fbUserAgent = $util.newBuffer([]);

        /**
         * ClientPayload oc.
         * @member {boolean} oc
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.oc = false;

        /**
         * ClientPayload lc.
         * @member {number} lc
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.lc = 0;

        /**
         * ClientPayload iosAppExtension.
         * @member {WAWa6.ClientPayload.IOSAppExtension} iosAppExtension
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.iosAppExtension = 0;

        /**
         * ClientPayload fbAppID.
         * @member {number|Long} fbAppID
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.fbAppID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * ClientPayload fbDeviceID.
         * @member {Uint8Array} fbDeviceID
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.fbDeviceID = $util.newBuffer([]);

        /**
         * ClientPayload pull.
         * @member {boolean} pull
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.pull = false;

        /**
         * ClientPayload paddingBytes.
         * @member {Uint8Array} paddingBytes
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.paddingBytes = $util.newBuffer([]);

        /**
         * ClientPayload yearClass.
         * @member {number} yearClass
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.yearClass = 0;

        /**
         * ClientPayload memClass.
         * @member {number} memClass
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.memClass = 0;

        /**
         * ClientPayload interopData.
         * @member {WAWa6.ClientPayload.IInteropData|null|undefined} interopData
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.interopData = null;

        /**
         * ClientPayload isPcr.
         * @member {boolean} isPcr
         * @memberof WAWa6.ClientPayload
         * @instance
         */
        ClientPayload.prototype.isPcr = false;

        /**
         * Creates a new ClientPayload instance using the specified properties.
         * @function create
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {WAWa6.IClientPayload=} [properties] Properties to set
         * @returns {WAWa6.ClientPayload} ClientPayload instance
         */
        ClientPayload.create = function create(properties) {
            return new ClientPayload(properties);
        };

        /**
         * Encodes the specified ClientPayload message. Does not implicitly {@link WAWa6.ClientPayload.verify|verify} messages.
         * @function encode
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {WAWa6.IClientPayload} message ClientPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.username);
            if (message.passive != null && Object.hasOwnProperty.call(message, "passive"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.passive);
            if (message.userAgent != null && Object.hasOwnProperty.call(message, "userAgent"))
                $root.WAWa6.ClientPayload.UserAgent.encode(message.userAgent, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.webInfo != null && Object.hasOwnProperty.call(message, "webInfo"))
                $root.WAWa6.ClientPayload.WebInfo.encode(message.webInfo, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pushName != null && Object.hasOwnProperty.call(message, "pushName"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.pushName);
            if (message.sessionID != null && Object.hasOwnProperty.call(message, "sessionID"))
                writer.uint32(/* id 9, wireType 5 =*/77).sfixed32(message.sessionID);
            if (message.shortConnect != null && Object.hasOwnProperty.call(message, "shortConnect"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.shortConnect);
            if (message.connectType != null && Object.hasOwnProperty.call(message, "connectType"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.connectType);
            if (message.connectReason != null && Object.hasOwnProperty.call(message, "connectReason"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.connectReason);
            if (message.shards != null && message.shards.length)
                for (var i = 0; i < message.shards.length; ++i)
                    writer.uint32(/* id 14, wireType 0 =*/112).int32(message.shards[i]);
            if (message.dnsSource != null && Object.hasOwnProperty.call(message, "dnsSource"))
                $root.WAWa6.ClientPayload.DNSSource.encode(message.dnsSource, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.connectAttemptCount != null && Object.hasOwnProperty.call(message, "connectAttemptCount"))
                writer.uint32(/* id 16, wireType 0 =*/128).uint32(message.connectAttemptCount);
            if (message.device != null && Object.hasOwnProperty.call(message, "device"))
                writer.uint32(/* id 18, wireType 0 =*/144).uint32(message.device);
            if (message.devicePairingData != null && Object.hasOwnProperty.call(message, "devicePairingData"))
                $root.WAWa6.ClientPayload.DevicePairingRegistrationData.encode(message.devicePairingData, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            if (message.product != null && Object.hasOwnProperty.call(message, "product"))
                writer.uint32(/* id 20, wireType 0 =*/160).int32(message.product);
            if (message.fbCat != null && Object.hasOwnProperty.call(message, "fbCat"))
                writer.uint32(/* id 21, wireType 2 =*/170).bytes(message.fbCat);
            if (message.fbUserAgent != null && Object.hasOwnProperty.call(message, "fbUserAgent"))
                writer.uint32(/* id 22, wireType 2 =*/178).bytes(message.fbUserAgent);
            if (message.oc != null && Object.hasOwnProperty.call(message, "oc"))
                writer.uint32(/* id 23, wireType 0 =*/184).bool(message.oc);
            if (message.lc != null && Object.hasOwnProperty.call(message, "lc"))
                writer.uint32(/* id 24, wireType 0 =*/192).int32(message.lc);
            if (message.iosAppExtension != null && Object.hasOwnProperty.call(message, "iosAppExtension"))
                writer.uint32(/* id 30, wireType 0 =*/240).int32(message.iosAppExtension);
            if (message.fbAppID != null && Object.hasOwnProperty.call(message, "fbAppID"))
                writer.uint32(/* id 31, wireType 0 =*/248).uint64(message.fbAppID);
            if (message.fbDeviceID != null && Object.hasOwnProperty.call(message, "fbDeviceID"))
                writer.uint32(/* id 32, wireType 2 =*/258).bytes(message.fbDeviceID);
            if (message.pull != null && Object.hasOwnProperty.call(message, "pull"))
                writer.uint32(/* id 33, wireType 0 =*/264).bool(message.pull);
            if (message.paddingBytes != null && Object.hasOwnProperty.call(message, "paddingBytes"))
                writer.uint32(/* id 34, wireType 2 =*/274).bytes(message.paddingBytes);
            if (message.yearClass != null && Object.hasOwnProperty.call(message, "yearClass"))
                writer.uint32(/* id 36, wireType 0 =*/288).int32(message.yearClass);
            if (message.memClass != null && Object.hasOwnProperty.call(message, "memClass"))
                writer.uint32(/* id 37, wireType 0 =*/296).int32(message.memClass);
            if (message.interopData != null && Object.hasOwnProperty.call(message, "interopData"))
                $root.WAWa6.ClientPayload.InteropData.encode(message.interopData, writer.uint32(/* id 38, wireType 2 =*/306).fork()).ldelim();
            if (message.isPcr != null && Object.hasOwnProperty.call(message, "isPcr"))
                writer.uint32(/* id 39, wireType 0 =*/312).bool(message.isPcr);
            return writer;
        };

        /**
         * Encodes the specified ClientPayload message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {WAWa6.IClientPayload} message ClientPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientPayload message from the specified reader or buffer.
         * @function decode
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWa6.ClientPayload} ClientPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.uint64();
                        break;
                    }
                case 3: {
                        message.passive = reader.bool();
                        break;
                    }
                case 5: {
                        message.userAgent = $root.WAWa6.ClientPayload.UserAgent.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.webInfo = $root.WAWa6.ClientPayload.WebInfo.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.pushName = reader.string();
                        break;
                    }
                case 9: {
                        message.sessionID = reader.sfixed32();
                        break;
                    }
                case 10: {
                        message.shortConnect = reader.bool();
                        break;
                    }
                case 12: {
                        message.connectType = reader.int32();
                        break;
                    }
                case 13: {
                        message.connectReason = reader.int32();
                        break;
                    }
                case 14: {
                        if (!(message.shards && message.shards.length))
                            message.shards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.shards.push(reader.int32());
                        } else
                            message.shards.push(reader.int32());
                        break;
                    }
                case 15: {
                        message.dnsSource = $root.WAWa6.ClientPayload.DNSSource.decode(reader, reader.uint32());
                        break;
                    }
                case 16: {
                        message.connectAttemptCount = reader.uint32();
                        break;
                    }
                case 18: {
                        message.device = reader.uint32();
                        break;
                    }
                case 19: {
                        message.devicePairingData = $root.WAWa6.ClientPayload.DevicePairingRegistrationData.decode(reader, reader.uint32());
                        break;
                    }
                case 20: {
                        message.product = reader.int32();
                        break;
                    }
                case 21: {
                        message.fbCat = reader.bytes();
                        break;
                    }
                case 22: {
                        message.fbUserAgent = reader.bytes();
                        break;
                    }
                case 23: {
                        message.oc = reader.bool();
                        break;
                    }
                case 24: {
                        message.lc = reader.int32();
                        break;
                    }
                case 30: {
                        message.iosAppExtension = reader.int32();
                        break;
                    }
                case 31: {
                        message.fbAppID = reader.uint64();
                        break;
                    }
                case 32: {
                        message.fbDeviceID = reader.bytes();
                        break;
                    }
                case 33: {
                        message.pull = reader.bool();
                        break;
                    }
                case 34: {
                        message.paddingBytes = reader.bytes();
                        break;
                    }
                case 36: {
                        message.yearClass = reader.int32();
                        break;
                    }
                case 37: {
                        message.memClass = reader.int32();
                        break;
                    }
                case 38: {
                        message.interopData = $root.WAWa6.ClientPayload.InteropData.decode(reader, reader.uint32());
                        break;
                    }
                case 39: {
                        message.isPcr = reader.bool();
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
         * Decodes a ClientPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWa6.ClientPayload} ClientPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientPayload message.
         * @function verify
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isInteger(message.username) && !(message.username && $util.isInteger(message.username.low) && $util.isInteger(message.username.high)))
                    return "username: integer|Long expected";
            if (message.passive != null && message.hasOwnProperty("passive"))
                if (typeof message.passive !== "boolean")
                    return "passive: boolean expected";
            if (message.userAgent != null && message.hasOwnProperty("userAgent")) {
                var error = $root.WAWa6.ClientPayload.UserAgent.verify(message.userAgent);
                if (error)
                    return "userAgent." + error;
            }
            if (message.webInfo != null && message.hasOwnProperty("webInfo")) {
                var error = $root.WAWa6.ClientPayload.WebInfo.verify(message.webInfo);
                if (error)
                    return "webInfo." + error;
            }
            if (message.pushName != null && message.hasOwnProperty("pushName"))
                if (!$util.isString(message.pushName))
                    return "pushName: string expected";
            if (message.sessionID != null && message.hasOwnProperty("sessionID"))
                if (!$util.isInteger(message.sessionID))
                    return "sessionID: integer expected";
            if (message.shortConnect != null && message.hasOwnProperty("shortConnect"))
                if (typeof message.shortConnect !== "boolean")
                    return "shortConnect: boolean expected";
            if (message.connectType != null && message.hasOwnProperty("connectType"))
                switch (message.connectType) {
                default:
                    return "connectType: enum value expected";
                case 0:
                case 1:
                case 100:
                case 101:
                case 102:
                case 103:
                case 104:
                case 105:
                case 106:
                case 107:
                case 108:
                case 109:
                case 110:
                case 111:
                case 112:
                    break;
                }
            if (message.connectReason != null && message.hasOwnProperty("connectReason"))
                switch (message.connectReason) {
                default:
                    return "connectReason: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            if (message.shards != null && message.hasOwnProperty("shards")) {
                if (!Array.isArray(message.shards))
                    return "shards: array expected";
                for (var i = 0; i < message.shards.length; ++i)
                    if (!$util.isInteger(message.shards[i]))
                        return "shards: integer[] expected";
            }
            if (message.dnsSource != null && message.hasOwnProperty("dnsSource")) {
                var error = $root.WAWa6.ClientPayload.DNSSource.verify(message.dnsSource);
                if (error)
                    return "dnsSource." + error;
            }
            if (message.connectAttemptCount != null && message.hasOwnProperty("connectAttemptCount"))
                if (!$util.isInteger(message.connectAttemptCount))
                    return "connectAttemptCount: integer expected";
            if (message.device != null && message.hasOwnProperty("device"))
                if (!$util.isInteger(message.device))
                    return "device: integer expected";
            if (message.devicePairingData != null && message.hasOwnProperty("devicePairingData")) {
                var error = $root.WAWa6.ClientPayload.DevicePairingRegistrationData.verify(message.devicePairingData);
                if (error)
                    return "devicePairingData." + error;
            }
            if (message.product != null && message.hasOwnProperty("product"))
                switch (message.product) {
                default:
                    return "product: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.fbCat != null && message.hasOwnProperty("fbCat"))
                if (!(message.fbCat && typeof message.fbCat.length === "number" || $util.isString(message.fbCat)))
                    return "fbCat: buffer expected";
            if (message.fbUserAgent != null && message.hasOwnProperty("fbUserAgent"))
                if (!(message.fbUserAgent && typeof message.fbUserAgent.length === "number" || $util.isString(message.fbUserAgent)))
                    return "fbUserAgent: buffer expected";
            if (message.oc != null && message.hasOwnProperty("oc"))
                if (typeof message.oc !== "boolean")
                    return "oc: boolean expected";
            if (message.lc != null && message.hasOwnProperty("lc"))
                if (!$util.isInteger(message.lc))
                    return "lc: integer expected";
            if (message.iosAppExtension != null && message.hasOwnProperty("iosAppExtension"))
                switch (message.iosAppExtension) {
                default:
                    return "iosAppExtension: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.fbAppID != null && message.hasOwnProperty("fbAppID"))
                if (!$util.isInteger(message.fbAppID) && !(message.fbAppID && $util.isInteger(message.fbAppID.low) && $util.isInteger(message.fbAppID.high)))
                    return "fbAppID: integer|Long expected";
            if (message.fbDeviceID != null && message.hasOwnProperty("fbDeviceID"))
                if (!(message.fbDeviceID && typeof message.fbDeviceID.length === "number" || $util.isString(message.fbDeviceID)))
                    return "fbDeviceID: buffer expected";
            if (message.pull != null && message.hasOwnProperty("pull"))
                if (typeof message.pull !== "boolean")
                    return "pull: boolean expected";
            if (message.paddingBytes != null && message.hasOwnProperty("paddingBytes"))
                if (!(message.paddingBytes && typeof message.paddingBytes.length === "number" || $util.isString(message.paddingBytes)))
                    return "paddingBytes: buffer expected";
            if (message.yearClass != null && message.hasOwnProperty("yearClass"))
                if (!$util.isInteger(message.yearClass))
                    return "yearClass: integer expected";
            if (message.memClass != null && message.hasOwnProperty("memClass"))
                if (!$util.isInteger(message.memClass))
                    return "memClass: integer expected";
            if (message.interopData != null && message.hasOwnProperty("interopData")) {
                var error = $root.WAWa6.ClientPayload.InteropData.verify(message.interopData);
                if (error)
                    return "interopData." + error;
            }
            if (message.isPcr != null && message.hasOwnProperty("isPcr"))
                if (typeof message.isPcr !== "boolean")
                    return "isPcr: boolean expected";
            return null;
        };

        /**
         * Creates a ClientPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWa6.ClientPayload} ClientPayload
         */
        ClientPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWa6.ClientPayload)
                return object;
            var message = new $root.WAWa6.ClientPayload();
            if (object.username != null)
                if ($util.Long)
                    (message.username = $util.Long.fromValue(object.username)).unsigned = true;
                else if (typeof object.username === "string")
                    message.username = parseInt(object.username, 10);
                else if (typeof object.username === "number")
                    message.username = object.username;
                else if (typeof object.username === "object")
                    message.username = new $util.LongBits(object.username.low >>> 0, object.username.high >>> 0).toNumber(true);
            if (object.passive != null)
                message.passive = Boolean(object.passive);
            if (object.userAgent != null) {
                if (typeof object.userAgent !== "object")
                    throw TypeError(".WAWa6.ClientPayload.userAgent: object expected");
                message.userAgent = $root.WAWa6.ClientPayload.UserAgent.fromObject(object.userAgent);
            }
            if (object.webInfo != null) {
                if (typeof object.webInfo !== "object")
                    throw TypeError(".WAWa6.ClientPayload.webInfo: object expected");
                message.webInfo = $root.WAWa6.ClientPayload.WebInfo.fromObject(object.webInfo);
            }
            if (object.pushName != null)
                message.pushName = String(object.pushName);
            if (object.sessionID != null)
                message.sessionID = object.sessionID | 0;
            if (object.shortConnect != null)
                message.shortConnect = Boolean(object.shortConnect);
            switch (object.connectType) {
            default:
                if (typeof object.connectType === "number") {
                    message.connectType = object.connectType;
                    break;
                }
                break;
            case "CELLULAR_UNKNOWN":
            case 0:
                message.connectType = 0;
                break;
            case "WIFI_UNKNOWN":
            case 1:
                message.connectType = 1;
                break;
            case "CELLULAR_EDGE":
            case 100:
                message.connectType = 100;
                break;
            case "CELLULAR_IDEN":
            case 101:
                message.connectType = 101;
                break;
            case "CELLULAR_UMTS":
            case 102:
                message.connectType = 102;
                break;
            case "CELLULAR_EVDO":
            case 103:
                message.connectType = 103;
                break;
            case "CELLULAR_GPRS":
            case 104:
                message.connectType = 104;
                break;
            case "CELLULAR_HSDPA":
            case 105:
                message.connectType = 105;
                break;
            case "CELLULAR_HSUPA":
            case 106:
                message.connectType = 106;
                break;
            case "CELLULAR_HSPA":
            case 107:
                message.connectType = 107;
                break;
            case "CELLULAR_CDMA":
            case 108:
                message.connectType = 108;
                break;
            case "CELLULAR_1XRTT":
            case 109:
                message.connectType = 109;
                break;
            case "CELLULAR_EHRPD":
            case 110:
                message.connectType = 110;
                break;
            case "CELLULAR_LTE":
            case 111:
                message.connectType = 111;
                break;
            case "CELLULAR_HSPAP":
            case 112:
                message.connectType = 112;
                break;
            }
            switch (object.connectReason) {
            default:
                if (typeof object.connectReason === "number") {
                    message.connectReason = object.connectReason;
                    break;
                }
                break;
            case "PUSH":
            case 0:
                message.connectReason = 0;
                break;
            case "USER_ACTIVATED":
            case 1:
                message.connectReason = 1;
                break;
            case "SCHEDULED":
            case 2:
                message.connectReason = 2;
                break;
            case "ERROR_RECONNECT":
            case 3:
                message.connectReason = 3;
                break;
            case "NETWORK_SWITCH":
            case 4:
                message.connectReason = 4;
                break;
            case "PING_RECONNECT":
            case 5:
                message.connectReason = 5;
                break;
            case "UNKNOWN":
            case 6:
                message.connectReason = 6;
                break;
            }
            if (object.shards) {
                if (!Array.isArray(object.shards))
                    throw TypeError(".WAWa6.ClientPayload.shards: array expected");
                message.shards = [];
                for (var i = 0; i < object.shards.length; ++i)
                    message.shards[i] = object.shards[i] | 0;
            }
            if (object.dnsSource != null) {
                if (typeof object.dnsSource !== "object")
                    throw TypeError(".WAWa6.ClientPayload.dnsSource: object expected");
                message.dnsSource = $root.WAWa6.ClientPayload.DNSSource.fromObject(object.dnsSource);
            }
            if (object.connectAttemptCount != null)
                message.connectAttemptCount = object.connectAttemptCount >>> 0;
            if (object.device != null)
                message.device = object.device >>> 0;
            if (object.devicePairingData != null) {
                if (typeof object.devicePairingData !== "object")
                    throw TypeError(".WAWa6.ClientPayload.devicePairingData: object expected");
                message.devicePairingData = $root.WAWa6.ClientPayload.DevicePairingRegistrationData.fromObject(object.devicePairingData);
            }
            switch (object.product) {
            default:
                if (typeof object.product === "number") {
                    message.product = object.product;
                    break;
                }
                break;
            case "WHATSAPP":
            case 0:
                message.product = 0;
                break;
            case "MESSENGER":
            case 1:
                message.product = 1;
                break;
            case "INTEROP":
            case 2:
                message.product = 2;
                break;
            case "INTEROP_MSGR":
            case 3:
                message.product = 3;
                break;
            }
            if (object.fbCat != null)
                if (typeof object.fbCat === "string")
                    $util.base64.decode(object.fbCat, message.fbCat = $util.newBuffer($util.base64.length(object.fbCat)), 0);
                else if (object.fbCat.length >= 0)
                    message.fbCat = object.fbCat;
            if (object.fbUserAgent != null)
                if (typeof object.fbUserAgent === "string")
                    $util.base64.decode(object.fbUserAgent, message.fbUserAgent = $util.newBuffer($util.base64.length(object.fbUserAgent)), 0);
                else if (object.fbUserAgent.length >= 0)
                    message.fbUserAgent = object.fbUserAgent;
            if (object.oc != null)
                message.oc = Boolean(object.oc);
            if (object.lc != null)
                message.lc = object.lc | 0;
            switch (object.iosAppExtension) {
            default:
                if (typeof object.iosAppExtension === "number") {
                    message.iosAppExtension = object.iosAppExtension;
                    break;
                }
                break;
            case "SHARE_EXTENSION":
            case 0:
                message.iosAppExtension = 0;
                break;
            case "SERVICE_EXTENSION":
            case 1:
                message.iosAppExtension = 1;
                break;
            case "INTENTS_EXTENSION":
            case 2:
                message.iosAppExtension = 2;
                break;
            }
            if (object.fbAppID != null)
                if ($util.Long)
                    (message.fbAppID = $util.Long.fromValue(object.fbAppID)).unsigned = true;
                else if (typeof object.fbAppID === "string")
                    message.fbAppID = parseInt(object.fbAppID, 10);
                else if (typeof object.fbAppID === "number")
                    message.fbAppID = object.fbAppID;
                else if (typeof object.fbAppID === "object")
                    message.fbAppID = new $util.LongBits(object.fbAppID.low >>> 0, object.fbAppID.high >>> 0).toNumber(true);
            if (object.fbDeviceID != null)
                if (typeof object.fbDeviceID === "string")
                    $util.base64.decode(object.fbDeviceID, message.fbDeviceID = $util.newBuffer($util.base64.length(object.fbDeviceID)), 0);
                else if (object.fbDeviceID.length >= 0)
                    message.fbDeviceID = object.fbDeviceID;
            if (object.pull != null)
                message.pull = Boolean(object.pull);
            if (object.paddingBytes != null)
                if (typeof object.paddingBytes === "string")
                    $util.base64.decode(object.paddingBytes, message.paddingBytes = $util.newBuffer($util.base64.length(object.paddingBytes)), 0);
                else if (object.paddingBytes.length >= 0)
                    message.paddingBytes = object.paddingBytes;
            if (object.yearClass != null)
                message.yearClass = object.yearClass | 0;
            if (object.memClass != null)
                message.memClass = object.memClass | 0;
            if (object.interopData != null) {
                if (typeof object.interopData !== "object")
                    throw TypeError(".WAWa6.ClientPayload.interopData: object expected");
                message.interopData = $root.WAWa6.ClientPayload.InteropData.fromObject(object.interopData);
            }
            if (object.isPcr != null)
                message.isPcr = Boolean(object.isPcr);
            return message;
        };

        /**
         * Creates a plain object from a ClientPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {WAWa6.ClientPayload} message ClientPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.shards = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.username = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.username = options.longs === String ? "0" : 0;
                object.passive = false;
                object.userAgent = null;
                object.webInfo = null;
                object.pushName = "";
                object.sessionID = 0;
                object.shortConnect = false;
                object.connectType = options.enums === String ? "CELLULAR_UNKNOWN" : 0;
                object.connectReason = options.enums === String ? "PUSH" : 0;
                object.dnsSource = null;
                object.connectAttemptCount = 0;
                object.device = 0;
                object.devicePairingData = null;
                object.product = options.enums === String ? "WHATSAPP" : 0;
                if (options.bytes === String)
                    object.fbCat = "";
                else {
                    object.fbCat = [];
                    if (options.bytes !== Array)
                        object.fbCat = $util.newBuffer(object.fbCat);
                }
                if (options.bytes === String)
                    object.fbUserAgent = "";
                else {
                    object.fbUserAgent = [];
                    if (options.bytes !== Array)
                        object.fbUserAgent = $util.newBuffer(object.fbUserAgent);
                }
                object.oc = false;
                object.lc = 0;
                object.iosAppExtension = options.enums === String ? "SHARE_EXTENSION" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.fbAppID = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fbAppID = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.fbDeviceID = "";
                else {
                    object.fbDeviceID = [];
                    if (options.bytes !== Array)
                        object.fbDeviceID = $util.newBuffer(object.fbDeviceID);
                }
                object.pull = false;
                if (options.bytes === String)
                    object.paddingBytes = "";
                else {
                    object.paddingBytes = [];
                    if (options.bytes !== Array)
                        object.paddingBytes = $util.newBuffer(object.paddingBytes);
                }
                object.yearClass = 0;
                object.memClass = 0;
                object.interopData = null;
                object.isPcr = false;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                if (typeof message.username === "number")
                    object.username = options.longs === String ? String(message.username) : message.username;
                else
                    object.username = options.longs === String ? $util.Long.prototype.toString.call(message.username) : options.longs === Number ? new $util.LongBits(message.username.low >>> 0, message.username.high >>> 0).toNumber(true) : message.username;
            if (message.passive != null && message.hasOwnProperty("passive"))
                object.passive = message.passive;
            if (message.userAgent != null && message.hasOwnProperty("userAgent"))
                object.userAgent = $root.WAWa6.ClientPayload.UserAgent.toObject(message.userAgent, options);
            if (message.webInfo != null && message.hasOwnProperty("webInfo"))
                object.webInfo = $root.WAWa6.ClientPayload.WebInfo.toObject(message.webInfo, options);
            if (message.pushName != null && message.hasOwnProperty("pushName"))
                object.pushName = message.pushName;
            if (message.sessionID != null && message.hasOwnProperty("sessionID"))
                object.sessionID = message.sessionID;
            if (message.shortConnect != null && message.hasOwnProperty("shortConnect"))
                object.shortConnect = message.shortConnect;
            if (message.connectType != null && message.hasOwnProperty("connectType"))
                object.connectType = options.enums === String ? $root.WAWa6.ClientPayload.ConnectType[message.connectType] === undefined ? message.connectType : $root.WAWa6.ClientPayload.ConnectType[message.connectType] : message.connectType;
            if (message.connectReason != null && message.hasOwnProperty("connectReason"))
                object.connectReason = options.enums === String ? $root.WAWa6.ClientPayload.ConnectReason[message.connectReason] === undefined ? message.connectReason : $root.WAWa6.ClientPayload.ConnectReason[message.connectReason] : message.connectReason;
            if (message.shards && message.shards.length) {
                object.shards = [];
                for (var j = 0; j < message.shards.length; ++j)
                    object.shards[j] = message.shards[j];
            }
            if (message.dnsSource != null && message.hasOwnProperty("dnsSource"))
                object.dnsSource = $root.WAWa6.ClientPayload.DNSSource.toObject(message.dnsSource, options);
            if (message.connectAttemptCount != null && message.hasOwnProperty("connectAttemptCount"))
                object.connectAttemptCount = message.connectAttemptCount;
            if (message.device != null && message.hasOwnProperty("device"))
                object.device = message.device;
            if (message.devicePairingData != null && message.hasOwnProperty("devicePairingData"))
                object.devicePairingData = $root.WAWa6.ClientPayload.DevicePairingRegistrationData.toObject(message.devicePairingData, options);
            if (message.product != null && message.hasOwnProperty("product"))
                object.product = options.enums === String ? $root.WAWa6.ClientPayload.Product[message.product] === undefined ? message.product : $root.WAWa6.ClientPayload.Product[message.product] : message.product;
            if (message.fbCat != null && message.hasOwnProperty("fbCat"))
                object.fbCat = options.bytes === String ? $util.base64.encode(message.fbCat, 0, message.fbCat.length) : options.bytes === Array ? Array.prototype.slice.call(message.fbCat) : message.fbCat;
            if (message.fbUserAgent != null && message.hasOwnProperty("fbUserAgent"))
                object.fbUserAgent = options.bytes === String ? $util.base64.encode(message.fbUserAgent, 0, message.fbUserAgent.length) : options.bytes === Array ? Array.prototype.slice.call(message.fbUserAgent) : message.fbUserAgent;
            if (message.oc != null && message.hasOwnProperty("oc"))
                object.oc = message.oc;
            if (message.lc != null && message.hasOwnProperty("lc"))
                object.lc = message.lc;
            if (message.iosAppExtension != null && message.hasOwnProperty("iosAppExtension"))
                object.iosAppExtension = options.enums === String ? $root.WAWa6.ClientPayload.IOSAppExtension[message.iosAppExtension] === undefined ? message.iosAppExtension : $root.WAWa6.ClientPayload.IOSAppExtension[message.iosAppExtension] : message.iosAppExtension;
            if (message.fbAppID != null && message.hasOwnProperty("fbAppID"))
                if (typeof message.fbAppID === "number")
                    object.fbAppID = options.longs === String ? String(message.fbAppID) : message.fbAppID;
                else
                    object.fbAppID = options.longs === String ? $util.Long.prototype.toString.call(message.fbAppID) : options.longs === Number ? new $util.LongBits(message.fbAppID.low >>> 0, message.fbAppID.high >>> 0).toNumber(true) : message.fbAppID;
            if (message.fbDeviceID != null && message.hasOwnProperty("fbDeviceID"))
                object.fbDeviceID = options.bytes === String ? $util.base64.encode(message.fbDeviceID, 0, message.fbDeviceID.length) : options.bytes === Array ? Array.prototype.slice.call(message.fbDeviceID) : message.fbDeviceID;
            if (message.pull != null && message.hasOwnProperty("pull"))
                object.pull = message.pull;
            if (message.paddingBytes != null && message.hasOwnProperty("paddingBytes"))
                object.paddingBytes = options.bytes === String ? $util.base64.encode(message.paddingBytes, 0, message.paddingBytes.length) : options.bytes === Array ? Array.prototype.slice.call(message.paddingBytes) : message.paddingBytes;
            if (message.yearClass != null && message.hasOwnProperty("yearClass"))
                object.yearClass = message.yearClass;
            if (message.memClass != null && message.hasOwnProperty("memClass"))
                object.memClass = message.memClass;
            if (message.interopData != null && message.hasOwnProperty("interopData"))
                object.interopData = $root.WAWa6.ClientPayload.InteropData.toObject(message.interopData, options);
            if (message.isPcr != null && message.hasOwnProperty("isPcr"))
                object.isPcr = message.isPcr;
            return object;
        };

        /**
         * Converts this ClientPayload to JSON.
         * @function toJSON
         * @memberof WAWa6.ClientPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ClientPayload
         * @function getTypeUrl
         * @memberof WAWa6.ClientPayload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ClientPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWa6.ClientPayload";
        };

        /**
         * Product enum.
         * @name WAWa6.ClientPayload.Product
         * @enum {number}
         * @property {number} WHATSAPP=0 WHATSAPP value
         * @property {number} MESSENGER=1 MESSENGER value
         * @property {number} INTEROP=2 INTEROP value
         * @property {number} INTEROP_MSGR=3 INTEROP_MSGR value
         */
        ClientPayload.Product = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "WHATSAPP"] = 0;
            values[valuesById[1] = "MESSENGER"] = 1;
            values[valuesById[2] = "INTEROP"] = 2;
            values[valuesById[3] = "INTEROP_MSGR"] = 3;
            return values;
        })();

        /**
         * ConnectType enum.
         * @name WAWa6.ClientPayload.ConnectType
         * @enum {number}
         * @property {number} CELLULAR_UNKNOWN=0 CELLULAR_UNKNOWN value
         * @property {number} WIFI_UNKNOWN=1 WIFI_UNKNOWN value
         * @property {number} CELLULAR_EDGE=100 CELLULAR_EDGE value
         * @property {number} CELLULAR_IDEN=101 CELLULAR_IDEN value
         * @property {number} CELLULAR_UMTS=102 CELLULAR_UMTS value
         * @property {number} CELLULAR_EVDO=103 CELLULAR_EVDO value
         * @property {number} CELLULAR_GPRS=104 CELLULAR_GPRS value
         * @property {number} CELLULAR_HSDPA=105 CELLULAR_HSDPA value
         * @property {number} CELLULAR_HSUPA=106 CELLULAR_HSUPA value
         * @property {number} CELLULAR_HSPA=107 CELLULAR_HSPA value
         * @property {number} CELLULAR_CDMA=108 CELLULAR_CDMA value
         * @property {number} CELLULAR_1XRTT=109 CELLULAR_1XRTT value
         * @property {number} CELLULAR_EHRPD=110 CELLULAR_EHRPD value
         * @property {number} CELLULAR_LTE=111 CELLULAR_LTE value
         * @property {number} CELLULAR_HSPAP=112 CELLULAR_HSPAP value
         */
        ClientPayload.ConnectType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CELLULAR_UNKNOWN"] = 0;
            values[valuesById[1] = "WIFI_UNKNOWN"] = 1;
            values[valuesById[100] = "CELLULAR_EDGE"] = 100;
            values[valuesById[101] = "CELLULAR_IDEN"] = 101;
            values[valuesById[102] = "CELLULAR_UMTS"] = 102;
            values[valuesById[103] = "CELLULAR_EVDO"] = 103;
            values[valuesById[104] = "CELLULAR_GPRS"] = 104;
            values[valuesById[105] = "CELLULAR_HSDPA"] = 105;
            values[valuesById[106] = "CELLULAR_HSUPA"] = 106;
            values[valuesById[107] = "CELLULAR_HSPA"] = 107;
            values[valuesById[108] = "CELLULAR_CDMA"] = 108;
            values[valuesById[109] = "CELLULAR_1XRTT"] = 109;
            values[valuesById[110] = "CELLULAR_EHRPD"] = 110;
            values[valuesById[111] = "CELLULAR_LTE"] = 111;
            values[valuesById[112] = "CELLULAR_HSPAP"] = 112;
            return values;
        })();

        /**
         * ConnectReason enum.
         * @name WAWa6.ClientPayload.ConnectReason
         * @enum {number}
         * @property {number} PUSH=0 PUSH value
         * @property {number} USER_ACTIVATED=1 USER_ACTIVATED value
         * @property {number} SCHEDULED=2 SCHEDULED value
         * @property {number} ERROR_RECONNECT=3 ERROR_RECONNECT value
         * @property {number} NETWORK_SWITCH=4 NETWORK_SWITCH value
         * @property {number} PING_RECONNECT=5 PING_RECONNECT value
         * @property {number} UNKNOWN=6 UNKNOWN value
         */
        ClientPayload.ConnectReason = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PUSH"] = 0;
            values[valuesById[1] = "USER_ACTIVATED"] = 1;
            values[valuesById[2] = "SCHEDULED"] = 2;
            values[valuesById[3] = "ERROR_RECONNECT"] = 3;
            values[valuesById[4] = "NETWORK_SWITCH"] = 4;
            values[valuesById[5] = "PING_RECONNECT"] = 5;
            values[valuesById[6] = "UNKNOWN"] = 6;
            return values;
        })();

        /**
         * IOSAppExtension enum.
         * @name WAWa6.ClientPayload.IOSAppExtension
         * @enum {number}
         * @property {number} SHARE_EXTENSION=0 SHARE_EXTENSION value
         * @property {number} SERVICE_EXTENSION=1 SERVICE_EXTENSION value
         * @property {number} INTENTS_EXTENSION=2 INTENTS_EXTENSION value
         */
        ClientPayload.IOSAppExtension = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SHARE_EXTENSION"] = 0;
            values[valuesById[1] = "SERVICE_EXTENSION"] = 1;
            values[valuesById[2] = "INTENTS_EXTENSION"] = 2;
            return values;
        })();

        ClientPayload.DNSSource = (function() {

            /**
             * Properties of a DNSSource.
             * @memberof WAWa6.ClientPayload
             * @interface IDNSSource
             * @property {WAWa6.ClientPayload.DNSSource.DNSResolutionMethod|null} [dnsMethod] DNSSource dnsMethod
             * @property {boolean|null} [appCached] DNSSource appCached
             */

            /**
             * Constructs a new DNSSource.
             * @memberof WAWa6.ClientPayload
             * @classdesc Represents a DNSSource.
             * @implements IDNSSource
             * @constructor
             * @param {WAWa6.ClientPayload.IDNSSource=} [properties] Properties to set
             */
            function DNSSource(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DNSSource dnsMethod.
             * @member {WAWa6.ClientPayload.DNSSource.DNSResolutionMethod} dnsMethod
             * @memberof WAWa6.ClientPayload.DNSSource
             * @instance
             */
            DNSSource.prototype.dnsMethod = 0;

            /**
             * DNSSource appCached.
             * @member {boolean} appCached
             * @memberof WAWa6.ClientPayload.DNSSource
             * @instance
             */
            DNSSource.prototype.appCached = false;

            /**
             * Creates a new DNSSource instance using the specified properties.
             * @function create
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {WAWa6.ClientPayload.IDNSSource=} [properties] Properties to set
             * @returns {WAWa6.ClientPayload.DNSSource} DNSSource instance
             */
            DNSSource.create = function create(properties) {
                return new DNSSource(properties);
            };

            /**
             * Encodes the specified DNSSource message. Does not implicitly {@link WAWa6.ClientPayload.DNSSource.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {WAWa6.ClientPayload.IDNSSource} message DNSSource message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DNSSource.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.dnsMethod != null && Object.hasOwnProperty.call(message, "dnsMethod"))
                    writer.uint32(/* id 15, wireType 0 =*/120).int32(message.dnsMethod);
                if (message.appCached != null && Object.hasOwnProperty.call(message, "appCached"))
                    writer.uint32(/* id 16, wireType 0 =*/128).bool(message.appCached);
                return writer;
            };

            /**
             * Encodes the specified DNSSource message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.DNSSource.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {WAWa6.ClientPayload.IDNSSource} message DNSSource message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DNSSource.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DNSSource message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.ClientPayload.DNSSource} DNSSource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DNSSource.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.DNSSource();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 15: {
                            message.dnsMethod = reader.int32();
                            break;
                        }
                    case 16: {
                            message.appCached = reader.bool();
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
             * Decodes a DNSSource message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.ClientPayload.DNSSource} DNSSource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DNSSource.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DNSSource message.
             * @function verify
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DNSSource.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.dnsMethod != null && message.hasOwnProperty("dnsMethod"))
                    switch (message.dnsMethod) {
                    default:
                        return "dnsMethod: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.appCached != null && message.hasOwnProperty("appCached"))
                    if (typeof message.appCached !== "boolean")
                        return "appCached: boolean expected";
                return null;
            };

            /**
             * Creates a DNSSource message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.ClientPayload.DNSSource} DNSSource
             */
            DNSSource.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.ClientPayload.DNSSource)
                    return object;
                var message = new $root.WAWa6.ClientPayload.DNSSource();
                switch (object.dnsMethod) {
                default:
                    if (typeof object.dnsMethod === "number") {
                        message.dnsMethod = object.dnsMethod;
                        break;
                    }
                    break;
                case "SYSTEM":
                case 0:
                    message.dnsMethod = 0;
                    break;
                case "GOOGLE":
                case 1:
                    message.dnsMethod = 1;
                    break;
                case "HARDCODED":
                case 2:
                    message.dnsMethod = 2;
                    break;
                case "OVERRIDE":
                case 3:
                    message.dnsMethod = 3;
                    break;
                case "FALLBACK":
                case 4:
                    message.dnsMethod = 4;
                    break;
                }
                if (object.appCached != null)
                    message.appCached = Boolean(object.appCached);
                return message;
            };

            /**
             * Creates a plain object from a DNSSource message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {WAWa6.ClientPayload.DNSSource} message DNSSource
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DNSSource.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.dnsMethod = options.enums === String ? "SYSTEM" : 0;
                    object.appCached = false;
                }
                if (message.dnsMethod != null && message.hasOwnProperty("dnsMethod"))
                    object.dnsMethod = options.enums === String ? $root.WAWa6.ClientPayload.DNSSource.DNSResolutionMethod[message.dnsMethod] === undefined ? message.dnsMethod : $root.WAWa6.ClientPayload.DNSSource.DNSResolutionMethod[message.dnsMethod] : message.dnsMethod;
                if (message.appCached != null && message.hasOwnProperty("appCached"))
                    object.appCached = message.appCached;
                return object;
            };

            /**
             * Converts this DNSSource to JSON.
             * @function toJSON
             * @memberof WAWa6.ClientPayload.DNSSource
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DNSSource.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DNSSource
             * @function getTypeUrl
             * @memberof WAWa6.ClientPayload.DNSSource
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DNSSource.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.ClientPayload.DNSSource";
            };

            /**
             * DNSResolutionMethod enum.
             * @name WAWa6.ClientPayload.DNSSource.DNSResolutionMethod
             * @enum {number}
             * @property {number} SYSTEM=0 SYSTEM value
             * @property {number} GOOGLE=1 GOOGLE value
             * @property {number} HARDCODED=2 HARDCODED value
             * @property {number} OVERRIDE=3 OVERRIDE value
             * @property {number} FALLBACK=4 FALLBACK value
             */
            DNSSource.DNSResolutionMethod = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "SYSTEM"] = 0;
                values[valuesById[1] = "GOOGLE"] = 1;
                values[valuesById[2] = "HARDCODED"] = 2;
                values[valuesById[3] = "OVERRIDE"] = 3;
                values[valuesById[4] = "FALLBACK"] = 4;
                return values;
            })();

            return DNSSource;
        })();

        ClientPayload.WebInfo = (function() {

            /**
             * Properties of a WebInfo.
             * @memberof WAWa6.ClientPayload
             * @interface IWebInfo
             * @property {string|null} [refToken] WebInfo refToken
             * @property {string|null} [version] WebInfo version
             * @property {WAWa6.ClientPayload.WebInfo.IWebdPayload|null} [webdPayload] WebInfo webdPayload
             * @property {WAWa6.ClientPayload.WebInfo.WebSubPlatform|null} [webSubPlatform] WebInfo webSubPlatform
             */

            /**
             * Constructs a new WebInfo.
             * @memberof WAWa6.ClientPayload
             * @classdesc Represents a WebInfo.
             * @implements IWebInfo
             * @constructor
             * @param {WAWa6.ClientPayload.IWebInfo=} [properties] Properties to set
             */
            function WebInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * WebInfo refToken.
             * @member {string} refToken
             * @memberof WAWa6.ClientPayload.WebInfo
             * @instance
             */
            WebInfo.prototype.refToken = "";

            /**
             * WebInfo version.
             * @member {string} version
             * @memberof WAWa6.ClientPayload.WebInfo
             * @instance
             */
            WebInfo.prototype.version = "";

            /**
             * WebInfo webdPayload.
             * @member {WAWa6.ClientPayload.WebInfo.IWebdPayload|null|undefined} webdPayload
             * @memberof WAWa6.ClientPayload.WebInfo
             * @instance
             */
            WebInfo.prototype.webdPayload = null;

            /**
             * WebInfo webSubPlatform.
             * @member {WAWa6.ClientPayload.WebInfo.WebSubPlatform} webSubPlatform
             * @memberof WAWa6.ClientPayload.WebInfo
             * @instance
             */
            WebInfo.prototype.webSubPlatform = 0;

            /**
             * Creates a new WebInfo instance using the specified properties.
             * @function create
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {WAWa6.ClientPayload.IWebInfo=} [properties] Properties to set
             * @returns {WAWa6.ClientPayload.WebInfo} WebInfo instance
             */
            WebInfo.create = function create(properties) {
                return new WebInfo(properties);
            };

            /**
             * Encodes the specified WebInfo message. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {WAWa6.ClientPayload.IWebInfo} message WebInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.refToken != null && Object.hasOwnProperty.call(message, "refToken"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.refToken);
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.version);
                if (message.webdPayload != null && Object.hasOwnProperty.call(message, "webdPayload"))
                    $root.WAWa6.ClientPayload.WebInfo.WebdPayload.encode(message.webdPayload, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.webSubPlatform != null && Object.hasOwnProperty.call(message, "webSubPlatform"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.webSubPlatform);
                return writer;
            };

            /**
             * Encodes the specified WebInfo message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {WAWa6.ClientPayload.IWebInfo} message WebInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WebInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a WebInfo message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.ClientPayload.WebInfo} WebInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.WebInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.refToken = reader.string();
                            break;
                        }
                    case 2: {
                            message.version = reader.string();
                            break;
                        }
                    case 3: {
                            message.webdPayload = $root.WAWa6.ClientPayload.WebInfo.WebdPayload.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.webSubPlatform = reader.int32();
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
             * Decodes a WebInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.ClientPayload.WebInfo} WebInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WebInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WebInfo message.
             * @function verify
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WebInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.refToken != null && message.hasOwnProperty("refToken"))
                    if (!$util.isString(message.refToken))
                        return "refToken: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.webdPayload != null && message.hasOwnProperty("webdPayload")) {
                    var error = $root.WAWa6.ClientPayload.WebInfo.WebdPayload.verify(message.webdPayload);
                    if (error)
                        return "webdPayload." + error;
                }
                if (message.webSubPlatform != null && message.hasOwnProperty("webSubPlatform"))
                    switch (message.webSubPlatform) {
                    default:
                        return "webSubPlatform: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                return null;
            };

            /**
             * Creates a WebInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.ClientPayload.WebInfo} WebInfo
             */
            WebInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.ClientPayload.WebInfo)
                    return object;
                var message = new $root.WAWa6.ClientPayload.WebInfo();
                if (object.refToken != null)
                    message.refToken = String(object.refToken);
                if (object.version != null)
                    message.version = String(object.version);
                if (object.webdPayload != null) {
                    if (typeof object.webdPayload !== "object")
                        throw TypeError(".WAWa6.ClientPayload.WebInfo.webdPayload: object expected");
                    message.webdPayload = $root.WAWa6.ClientPayload.WebInfo.WebdPayload.fromObject(object.webdPayload);
                }
                switch (object.webSubPlatform) {
                default:
                    if (typeof object.webSubPlatform === "number") {
                        message.webSubPlatform = object.webSubPlatform;
                        break;
                    }
                    break;
                case "WEB_BROWSER":
                case 0:
                    message.webSubPlatform = 0;
                    break;
                case "APP_STORE":
                case 1:
                    message.webSubPlatform = 1;
                    break;
                case "WIN_STORE":
                case 2:
                    message.webSubPlatform = 2;
                    break;
                case "DARWIN":
                case 3:
                    message.webSubPlatform = 3;
                    break;
                case "WIN32":
                case 4:
                    message.webSubPlatform = 4;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a WebInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {WAWa6.ClientPayload.WebInfo} message WebInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WebInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.refToken = "";
                    object.version = "";
                    object.webdPayload = null;
                    object.webSubPlatform = options.enums === String ? "WEB_BROWSER" : 0;
                }
                if (message.refToken != null && message.hasOwnProperty("refToken"))
                    object.refToken = message.refToken;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.webdPayload != null && message.hasOwnProperty("webdPayload"))
                    object.webdPayload = $root.WAWa6.ClientPayload.WebInfo.WebdPayload.toObject(message.webdPayload, options);
                if (message.webSubPlatform != null && message.hasOwnProperty("webSubPlatform"))
                    object.webSubPlatform = options.enums === String ? $root.WAWa6.ClientPayload.WebInfo.WebSubPlatform[message.webSubPlatform] === undefined ? message.webSubPlatform : $root.WAWa6.ClientPayload.WebInfo.WebSubPlatform[message.webSubPlatform] : message.webSubPlatform;
                return object;
            };

            /**
             * Converts this WebInfo to JSON.
             * @function toJSON
             * @memberof WAWa6.ClientPayload.WebInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WebInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for WebInfo
             * @function getTypeUrl
             * @memberof WAWa6.ClientPayload.WebInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            WebInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.ClientPayload.WebInfo";
            };

            /**
             * WebSubPlatform enum.
             * @name WAWa6.ClientPayload.WebInfo.WebSubPlatform
             * @enum {number}
             * @property {number} WEB_BROWSER=0 WEB_BROWSER value
             * @property {number} APP_STORE=1 APP_STORE value
             * @property {number} WIN_STORE=2 WIN_STORE value
             * @property {number} DARWIN=3 DARWIN value
             * @property {number} WIN32=4 WIN32 value
             */
            WebInfo.WebSubPlatform = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "WEB_BROWSER"] = 0;
                values[valuesById[1] = "APP_STORE"] = 1;
                values[valuesById[2] = "WIN_STORE"] = 2;
                values[valuesById[3] = "DARWIN"] = 3;
                values[valuesById[4] = "WIN32"] = 4;
                return values;
            })();

            WebInfo.WebdPayload = (function() {

                /**
                 * Properties of a WebdPayload.
                 * @memberof WAWa6.ClientPayload.WebInfo
                 * @interface IWebdPayload
                 * @property {boolean|null} [usesParticipantInKey] WebdPayload usesParticipantInKey
                 * @property {boolean|null} [supportsStarredMessages] WebdPayload supportsStarredMessages
                 * @property {boolean|null} [supportsDocumentMessages] WebdPayload supportsDocumentMessages
                 * @property {boolean|null} [supportsURLMessages] WebdPayload supportsURLMessages
                 * @property {boolean|null} [supportsMediaRetry] WebdPayload supportsMediaRetry
                 * @property {boolean|null} [supportsE2EImage] WebdPayload supportsE2EImage
                 * @property {boolean|null} [supportsE2EVideo] WebdPayload supportsE2EVideo
                 * @property {boolean|null} [supportsE2EAudio] WebdPayload supportsE2EAudio
                 * @property {boolean|null} [supportsE2EDocument] WebdPayload supportsE2EDocument
                 * @property {string|null} [documentTypes] WebdPayload documentTypes
                 * @property {Uint8Array|null} [features] WebdPayload features
                 */

                /**
                 * Constructs a new WebdPayload.
                 * @memberof WAWa6.ClientPayload.WebInfo
                 * @classdesc Represents a WebdPayload.
                 * @implements IWebdPayload
                 * @constructor
                 * @param {WAWa6.ClientPayload.WebInfo.IWebdPayload=} [properties] Properties to set
                 */
                function WebdPayload(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * WebdPayload usesParticipantInKey.
                 * @member {boolean} usesParticipantInKey
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.usesParticipantInKey = false;

                /**
                 * WebdPayload supportsStarredMessages.
                 * @member {boolean} supportsStarredMessages
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsStarredMessages = false;

                /**
                 * WebdPayload supportsDocumentMessages.
                 * @member {boolean} supportsDocumentMessages
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsDocumentMessages = false;

                /**
                 * WebdPayload supportsURLMessages.
                 * @member {boolean} supportsURLMessages
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsURLMessages = false;

                /**
                 * WebdPayload supportsMediaRetry.
                 * @member {boolean} supportsMediaRetry
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsMediaRetry = false;

                /**
                 * WebdPayload supportsE2EImage.
                 * @member {boolean} supportsE2EImage
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsE2EImage = false;

                /**
                 * WebdPayload supportsE2EVideo.
                 * @member {boolean} supportsE2EVideo
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsE2EVideo = false;

                /**
                 * WebdPayload supportsE2EAudio.
                 * @member {boolean} supportsE2EAudio
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsE2EAudio = false;

                /**
                 * WebdPayload supportsE2EDocument.
                 * @member {boolean} supportsE2EDocument
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.supportsE2EDocument = false;

                /**
                 * WebdPayload documentTypes.
                 * @member {string} documentTypes
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.documentTypes = "";

                /**
                 * WebdPayload features.
                 * @member {Uint8Array} features
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 */
                WebdPayload.prototype.features = $util.newBuffer([]);

                /**
                 * Creates a new WebdPayload instance using the specified properties.
                 * @function create
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {WAWa6.ClientPayload.WebInfo.IWebdPayload=} [properties] Properties to set
                 * @returns {WAWa6.ClientPayload.WebInfo.WebdPayload} WebdPayload instance
                 */
                WebdPayload.create = function create(properties) {
                    return new WebdPayload(properties);
                };

                /**
                 * Encodes the specified WebdPayload message. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.WebdPayload.verify|verify} messages.
                 * @function encode
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {WAWa6.ClientPayload.WebInfo.IWebdPayload} message WebdPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WebdPayload.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.usesParticipantInKey != null && Object.hasOwnProperty.call(message, "usesParticipantInKey"))
                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.usesParticipantInKey);
                    if (message.supportsStarredMessages != null && Object.hasOwnProperty.call(message, "supportsStarredMessages"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.supportsStarredMessages);
                    if (message.supportsDocumentMessages != null && Object.hasOwnProperty.call(message, "supportsDocumentMessages"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.supportsDocumentMessages);
                    if (message.supportsURLMessages != null && Object.hasOwnProperty.call(message, "supportsURLMessages"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.supportsURLMessages);
                    if (message.supportsMediaRetry != null && Object.hasOwnProperty.call(message, "supportsMediaRetry"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.supportsMediaRetry);
                    if (message.supportsE2EImage != null && Object.hasOwnProperty.call(message, "supportsE2EImage"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.supportsE2EImage);
                    if (message.supportsE2EVideo != null && Object.hasOwnProperty.call(message, "supportsE2EVideo"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.supportsE2EVideo);
                    if (message.supportsE2EAudio != null && Object.hasOwnProperty.call(message, "supportsE2EAudio"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.supportsE2EAudio);
                    if (message.supportsE2EDocument != null && Object.hasOwnProperty.call(message, "supportsE2EDocument"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.supportsE2EDocument);
                    if (message.documentTypes != null && Object.hasOwnProperty.call(message, "documentTypes"))
                        writer.uint32(/* id 10, wireType 2 =*/82).string(message.documentTypes);
                    if (message.features != null && Object.hasOwnProperty.call(message, "features"))
                        writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.features);
                    return writer;
                };

                /**
                 * Encodes the specified WebdPayload message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.WebInfo.WebdPayload.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {WAWa6.ClientPayload.WebInfo.IWebdPayload} message WebdPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WebdPayload.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a WebdPayload message from the specified reader or buffer.
                 * @function decode
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {WAWa6.ClientPayload.WebInfo.WebdPayload} WebdPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WebdPayload.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.WebInfo.WebdPayload();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.usesParticipantInKey = reader.bool();
                                break;
                            }
                        case 2: {
                                message.supportsStarredMessages = reader.bool();
                                break;
                            }
                        case 3: {
                                message.supportsDocumentMessages = reader.bool();
                                break;
                            }
                        case 4: {
                                message.supportsURLMessages = reader.bool();
                                break;
                            }
                        case 5: {
                                message.supportsMediaRetry = reader.bool();
                                break;
                            }
                        case 6: {
                                message.supportsE2EImage = reader.bool();
                                break;
                            }
                        case 7: {
                                message.supportsE2EVideo = reader.bool();
                                break;
                            }
                        case 8: {
                                message.supportsE2EAudio = reader.bool();
                                break;
                            }
                        case 9: {
                                message.supportsE2EDocument = reader.bool();
                                break;
                            }
                        case 10: {
                                message.documentTypes = reader.string();
                                break;
                            }
                        case 11: {
                                message.features = reader.bytes();
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
                 * Decodes a WebdPayload message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {WAWa6.ClientPayload.WebInfo.WebdPayload} WebdPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WebdPayload.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a WebdPayload message.
                 * @function verify
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                WebdPayload.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.usesParticipantInKey != null && message.hasOwnProperty("usesParticipantInKey"))
                        if (typeof message.usesParticipantInKey !== "boolean")
                            return "usesParticipantInKey: boolean expected";
                    if (message.supportsStarredMessages != null && message.hasOwnProperty("supportsStarredMessages"))
                        if (typeof message.supportsStarredMessages !== "boolean")
                            return "supportsStarredMessages: boolean expected";
                    if (message.supportsDocumentMessages != null && message.hasOwnProperty("supportsDocumentMessages"))
                        if (typeof message.supportsDocumentMessages !== "boolean")
                            return "supportsDocumentMessages: boolean expected";
                    if (message.supportsURLMessages != null && message.hasOwnProperty("supportsURLMessages"))
                        if (typeof message.supportsURLMessages !== "boolean")
                            return "supportsURLMessages: boolean expected";
                    if (message.supportsMediaRetry != null && message.hasOwnProperty("supportsMediaRetry"))
                        if (typeof message.supportsMediaRetry !== "boolean")
                            return "supportsMediaRetry: boolean expected";
                    if (message.supportsE2EImage != null && message.hasOwnProperty("supportsE2EImage"))
                        if (typeof message.supportsE2EImage !== "boolean")
                            return "supportsE2EImage: boolean expected";
                    if (message.supportsE2EVideo != null && message.hasOwnProperty("supportsE2EVideo"))
                        if (typeof message.supportsE2EVideo !== "boolean")
                            return "supportsE2EVideo: boolean expected";
                    if (message.supportsE2EAudio != null && message.hasOwnProperty("supportsE2EAudio"))
                        if (typeof message.supportsE2EAudio !== "boolean")
                            return "supportsE2EAudio: boolean expected";
                    if (message.supportsE2EDocument != null && message.hasOwnProperty("supportsE2EDocument"))
                        if (typeof message.supportsE2EDocument !== "boolean")
                            return "supportsE2EDocument: boolean expected";
                    if (message.documentTypes != null && message.hasOwnProperty("documentTypes"))
                        if (!$util.isString(message.documentTypes))
                            return "documentTypes: string expected";
                    if (message.features != null && message.hasOwnProperty("features"))
                        if (!(message.features && typeof message.features.length === "number" || $util.isString(message.features)))
                            return "features: buffer expected";
                    return null;
                };

                /**
                 * Creates a WebdPayload message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {WAWa6.ClientPayload.WebInfo.WebdPayload} WebdPayload
                 */
                WebdPayload.fromObject = function fromObject(object) {
                    if (object instanceof $root.WAWa6.ClientPayload.WebInfo.WebdPayload)
                        return object;
                    var message = new $root.WAWa6.ClientPayload.WebInfo.WebdPayload();
                    if (object.usesParticipantInKey != null)
                        message.usesParticipantInKey = Boolean(object.usesParticipantInKey);
                    if (object.supportsStarredMessages != null)
                        message.supportsStarredMessages = Boolean(object.supportsStarredMessages);
                    if (object.supportsDocumentMessages != null)
                        message.supportsDocumentMessages = Boolean(object.supportsDocumentMessages);
                    if (object.supportsURLMessages != null)
                        message.supportsURLMessages = Boolean(object.supportsURLMessages);
                    if (object.supportsMediaRetry != null)
                        message.supportsMediaRetry = Boolean(object.supportsMediaRetry);
                    if (object.supportsE2EImage != null)
                        message.supportsE2EImage = Boolean(object.supportsE2EImage);
                    if (object.supportsE2EVideo != null)
                        message.supportsE2EVideo = Boolean(object.supportsE2EVideo);
                    if (object.supportsE2EAudio != null)
                        message.supportsE2EAudio = Boolean(object.supportsE2EAudio);
                    if (object.supportsE2EDocument != null)
                        message.supportsE2EDocument = Boolean(object.supportsE2EDocument);
                    if (object.documentTypes != null)
                        message.documentTypes = String(object.documentTypes);
                    if (object.features != null)
                        if (typeof object.features === "string")
                            $util.base64.decode(object.features, message.features = $util.newBuffer($util.base64.length(object.features)), 0);
                        else if (object.features.length >= 0)
                            message.features = object.features;
                    return message;
                };

                /**
                 * Creates a plain object from a WebdPayload message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {WAWa6.ClientPayload.WebInfo.WebdPayload} message WebdPayload
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                WebdPayload.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.usesParticipantInKey = false;
                        object.supportsStarredMessages = false;
                        object.supportsDocumentMessages = false;
                        object.supportsURLMessages = false;
                        object.supportsMediaRetry = false;
                        object.supportsE2EImage = false;
                        object.supportsE2EVideo = false;
                        object.supportsE2EAudio = false;
                        object.supportsE2EDocument = false;
                        object.documentTypes = "";
                        if (options.bytes === String)
                            object.features = "";
                        else {
                            object.features = [];
                            if (options.bytes !== Array)
                                object.features = $util.newBuffer(object.features);
                        }
                    }
                    if (message.usesParticipantInKey != null && message.hasOwnProperty("usesParticipantInKey"))
                        object.usesParticipantInKey = message.usesParticipantInKey;
                    if (message.supportsStarredMessages != null && message.hasOwnProperty("supportsStarredMessages"))
                        object.supportsStarredMessages = message.supportsStarredMessages;
                    if (message.supportsDocumentMessages != null && message.hasOwnProperty("supportsDocumentMessages"))
                        object.supportsDocumentMessages = message.supportsDocumentMessages;
                    if (message.supportsURLMessages != null && message.hasOwnProperty("supportsURLMessages"))
                        object.supportsURLMessages = message.supportsURLMessages;
                    if (message.supportsMediaRetry != null && message.hasOwnProperty("supportsMediaRetry"))
                        object.supportsMediaRetry = message.supportsMediaRetry;
                    if (message.supportsE2EImage != null && message.hasOwnProperty("supportsE2EImage"))
                        object.supportsE2EImage = message.supportsE2EImage;
                    if (message.supportsE2EVideo != null && message.hasOwnProperty("supportsE2EVideo"))
                        object.supportsE2EVideo = message.supportsE2EVideo;
                    if (message.supportsE2EAudio != null && message.hasOwnProperty("supportsE2EAudio"))
                        object.supportsE2EAudio = message.supportsE2EAudio;
                    if (message.supportsE2EDocument != null && message.hasOwnProperty("supportsE2EDocument"))
                        object.supportsE2EDocument = message.supportsE2EDocument;
                    if (message.documentTypes != null && message.hasOwnProperty("documentTypes"))
                        object.documentTypes = message.documentTypes;
                    if (message.features != null && message.hasOwnProperty("features"))
                        object.features = options.bytes === String ? $util.base64.encode(message.features, 0, message.features.length) : options.bytes === Array ? Array.prototype.slice.call(message.features) : message.features;
                    return object;
                };

                /**
                 * Converts this WebdPayload to JSON.
                 * @function toJSON
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                WebdPayload.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for WebdPayload
                 * @function getTypeUrl
                 * @memberof WAWa6.ClientPayload.WebInfo.WebdPayload
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                WebdPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/WAWa6.ClientPayload.WebInfo.WebdPayload";
                };

                return WebdPayload;
            })();

            return WebInfo;
        })();

        ClientPayload.UserAgent = (function() {

            /**
             * Properties of a UserAgent.
             * @memberof WAWa6.ClientPayload
             * @interface IUserAgent
             * @property {WAWa6.ClientPayload.UserAgent.Platform|null} [platform] UserAgent platform
             * @property {WAWa6.ClientPayload.UserAgent.IAppVersion|null} [appVersion] UserAgent appVersion
             * @property {string|null} [mcc] UserAgent mcc
             * @property {string|null} [mnc] UserAgent mnc
             * @property {string|null} [osVersion] UserAgent osVersion
             * @property {string|null} [manufacturer] UserAgent manufacturer
             * @property {string|null} [device] UserAgent device
             * @property {string|null} [osBuildNumber] UserAgent osBuildNumber
             * @property {string|null} [phoneID] UserAgent phoneID
             * @property {WAWa6.ClientPayload.UserAgent.ReleaseChannel|null} [releaseChannel] UserAgent releaseChannel
             * @property {string|null} [localeLanguageIso6391] UserAgent localeLanguageIso6391
             * @property {string|null} [localeCountryIso31661Alpha2] UserAgent localeCountryIso31661Alpha2
             * @property {string|null} [deviceBoard] UserAgent deviceBoard
             * @property {string|null} [deviceExpID] UserAgent deviceExpID
             * @property {WAWa6.ClientPayload.UserAgent.DeviceType|null} [deviceType] UserAgent deviceType
             * @property {string|null} [deviceModelType] UserAgent deviceModelType
             */

            /**
             * Constructs a new UserAgent.
             * @memberof WAWa6.ClientPayload
             * @classdesc Represents a UserAgent.
             * @implements IUserAgent
             * @constructor
             * @param {WAWa6.ClientPayload.IUserAgent=} [properties] Properties to set
             */
            function UserAgent(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UserAgent platform.
             * @member {WAWa6.ClientPayload.UserAgent.Platform} platform
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.platform = 0;

            /**
             * UserAgent appVersion.
             * @member {WAWa6.ClientPayload.UserAgent.IAppVersion|null|undefined} appVersion
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.appVersion = null;

            /**
             * UserAgent mcc.
             * @member {string} mcc
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.mcc = "";

            /**
             * UserAgent mnc.
             * @member {string} mnc
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.mnc = "";

            /**
             * UserAgent osVersion.
             * @member {string} osVersion
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.osVersion = "";

            /**
             * UserAgent manufacturer.
             * @member {string} manufacturer
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.manufacturer = "";

            /**
             * UserAgent device.
             * @member {string} device
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.device = "";

            /**
             * UserAgent osBuildNumber.
             * @member {string} osBuildNumber
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.osBuildNumber = "";

            /**
             * UserAgent phoneID.
             * @member {string} phoneID
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.phoneID = "";

            /**
             * UserAgent releaseChannel.
             * @member {WAWa6.ClientPayload.UserAgent.ReleaseChannel} releaseChannel
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.releaseChannel = 0;

            /**
             * UserAgent localeLanguageIso6391.
             * @member {string} localeLanguageIso6391
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.localeLanguageIso6391 = "";

            /**
             * UserAgent localeCountryIso31661Alpha2.
             * @member {string} localeCountryIso31661Alpha2
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.localeCountryIso31661Alpha2 = "";

            /**
             * UserAgent deviceBoard.
             * @member {string} deviceBoard
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.deviceBoard = "";

            /**
             * UserAgent deviceExpID.
             * @member {string} deviceExpID
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.deviceExpID = "";

            /**
             * UserAgent deviceType.
             * @member {WAWa6.ClientPayload.UserAgent.DeviceType} deviceType
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.deviceType = 0;

            /**
             * UserAgent deviceModelType.
             * @member {string} deviceModelType
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             */
            UserAgent.prototype.deviceModelType = "";

            /**
             * Creates a new UserAgent instance using the specified properties.
             * @function create
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {WAWa6.ClientPayload.IUserAgent=} [properties] Properties to set
             * @returns {WAWa6.ClientPayload.UserAgent} UserAgent instance
             */
            UserAgent.create = function create(properties) {
                return new UserAgent(properties);
            };

            /**
             * Encodes the specified UserAgent message. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {WAWa6.ClientPayload.IUserAgent} message UserAgent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.platform != null && Object.hasOwnProperty.call(message, "platform"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.platform);
                if (message.appVersion != null && Object.hasOwnProperty.call(message, "appVersion"))
                    $root.WAWa6.ClientPayload.UserAgent.AppVersion.encode(message.appVersion, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.mcc != null && Object.hasOwnProperty.call(message, "mcc"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.mcc);
                if (message.mnc != null && Object.hasOwnProperty.call(message, "mnc"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.mnc);
                if (message.osVersion != null && Object.hasOwnProperty.call(message, "osVersion"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.osVersion);
                if (message.manufacturer != null && Object.hasOwnProperty.call(message, "manufacturer"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.manufacturer);
                if (message.device != null && Object.hasOwnProperty.call(message, "device"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.device);
                if (message.osBuildNumber != null && Object.hasOwnProperty.call(message, "osBuildNumber"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.osBuildNumber);
                if (message.phoneID != null && Object.hasOwnProperty.call(message, "phoneID"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.phoneID);
                if (message.releaseChannel != null && Object.hasOwnProperty.call(message, "releaseChannel"))
                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.releaseChannel);
                if (message.localeLanguageIso6391 != null && Object.hasOwnProperty.call(message, "localeLanguageIso6391"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.localeLanguageIso6391);
                if (message.localeCountryIso31661Alpha2 != null && Object.hasOwnProperty.call(message, "localeCountryIso31661Alpha2"))
                    writer.uint32(/* id 12, wireType 2 =*/98).string(message.localeCountryIso31661Alpha2);
                if (message.deviceBoard != null && Object.hasOwnProperty.call(message, "deviceBoard"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.deviceBoard);
                if (message.deviceExpID != null && Object.hasOwnProperty.call(message, "deviceExpID"))
                    writer.uint32(/* id 14, wireType 2 =*/114).string(message.deviceExpID);
                if (message.deviceType != null && Object.hasOwnProperty.call(message, "deviceType"))
                    writer.uint32(/* id 15, wireType 0 =*/120).int32(message.deviceType);
                if (message.deviceModelType != null && Object.hasOwnProperty.call(message, "deviceModelType"))
                    writer.uint32(/* id 16, wireType 2 =*/130).string(message.deviceModelType);
                return writer;
            };

            /**
             * Encodes the specified UserAgent message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {WAWa6.ClientPayload.IUserAgent} message UserAgent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserAgent message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.ClientPayload.UserAgent} UserAgent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserAgent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.UserAgent();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.platform = reader.int32();
                            break;
                        }
                    case 2: {
                            message.appVersion = $root.WAWa6.ClientPayload.UserAgent.AppVersion.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.mcc = reader.string();
                            break;
                        }
                    case 4: {
                            message.mnc = reader.string();
                            break;
                        }
                    case 5: {
                            message.osVersion = reader.string();
                            break;
                        }
                    case 6: {
                            message.manufacturer = reader.string();
                            break;
                        }
                    case 7: {
                            message.device = reader.string();
                            break;
                        }
                    case 8: {
                            message.osBuildNumber = reader.string();
                            break;
                        }
                    case 9: {
                            message.phoneID = reader.string();
                            break;
                        }
                    case 10: {
                            message.releaseChannel = reader.int32();
                            break;
                        }
                    case 11: {
                            message.localeLanguageIso6391 = reader.string();
                            break;
                        }
                    case 12: {
                            message.localeCountryIso31661Alpha2 = reader.string();
                            break;
                        }
                    case 13: {
                            message.deviceBoard = reader.string();
                            break;
                        }
                    case 14: {
                            message.deviceExpID = reader.string();
                            break;
                        }
                    case 15: {
                            message.deviceType = reader.int32();
                            break;
                        }
                    case 16: {
                            message.deviceModelType = reader.string();
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
             * Decodes a UserAgent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.ClientPayload.UserAgent} UserAgent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserAgent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UserAgent message.
             * @function verify
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserAgent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.platform != null && message.hasOwnProperty("platform"))
                    switch (message.platform) {
                    default:
                        return "platform: enum value expected";
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
                        break;
                    }
                if (message.appVersion != null && message.hasOwnProperty("appVersion")) {
                    var error = $root.WAWa6.ClientPayload.UserAgent.AppVersion.verify(message.appVersion);
                    if (error)
                        return "appVersion." + error;
                }
                if (message.mcc != null && message.hasOwnProperty("mcc"))
                    if (!$util.isString(message.mcc))
                        return "mcc: string expected";
                if (message.mnc != null && message.hasOwnProperty("mnc"))
                    if (!$util.isString(message.mnc))
                        return "mnc: string expected";
                if (message.osVersion != null && message.hasOwnProperty("osVersion"))
                    if (!$util.isString(message.osVersion))
                        return "osVersion: string expected";
                if (message.manufacturer != null && message.hasOwnProperty("manufacturer"))
                    if (!$util.isString(message.manufacturer))
                        return "manufacturer: string expected";
                if (message.device != null && message.hasOwnProperty("device"))
                    if (!$util.isString(message.device))
                        return "device: string expected";
                if (message.osBuildNumber != null && message.hasOwnProperty("osBuildNumber"))
                    if (!$util.isString(message.osBuildNumber))
                        return "osBuildNumber: string expected";
                if (message.phoneID != null && message.hasOwnProperty("phoneID"))
                    if (!$util.isString(message.phoneID))
                        return "phoneID: string expected";
                if (message.releaseChannel != null && message.hasOwnProperty("releaseChannel"))
                    switch (message.releaseChannel) {
                    default:
                        return "releaseChannel: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.localeLanguageIso6391 != null && message.hasOwnProperty("localeLanguageIso6391"))
                    if (!$util.isString(message.localeLanguageIso6391))
                        return "localeLanguageIso6391: string expected";
                if (message.localeCountryIso31661Alpha2 != null && message.hasOwnProperty("localeCountryIso31661Alpha2"))
                    if (!$util.isString(message.localeCountryIso31661Alpha2))
                        return "localeCountryIso31661Alpha2: string expected";
                if (message.deviceBoard != null && message.hasOwnProperty("deviceBoard"))
                    if (!$util.isString(message.deviceBoard))
                        return "deviceBoard: string expected";
                if (message.deviceExpID != null && message.hasOwnProperty("deviceExpID"))
                    if (!$util.isString(message.deviceExpID))
                        return "deviceExpID: string expected";
                if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                    switch (message.deviceType) {
                    default:
                        return "deviceType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.deviceModelType != null && message.hasOwnProperty("deviceModelType"))
                    if (!$util.isString(message.deviceModelType))
                        return "deviceModelType: string expected";
                return null;
            };

            /**
             * Creates a UserAgent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.ClientPayload.UserAgent} UserAgent
             */
            UserAgent.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.ClientPayload.UserAgent)
                    return object;
                var message = new $root.WAWa6.ClientPayload.UserAgent();
                switch (object.platform) {
                default:
                    if (typeof object.platform === "number") {
                        message.platform = object.platform;
                        break;
                    }
                    break;
                case "ANDROID":
                case 0:
                    message.platform = 0;
                    break;
                case "IOS":
                case 1:
                    message.platform = 1;
                    break;
                case "WINDOWS_PHONE":
                case 2:
                    message.platform = 2;
                    break;
                case "BLACKBERRY":
                case 3:
                    message.platform = 3;
                    break;
                case "BLACKBERRYX":
                case 4:
                    message.platform = 4;
                    break;
                case "S40":
                case 5:
                    message.platform = 5;
                    break;
                case "S60":
                case 6:
                    message.platform = 6;
                    break;
                case "PYTHON_CLIENT":
                case 7:
                    message.platform = 7;
                    break;
                case "TIZEN":
                case 8:
                    message.platform = 8;
                    break;
                case "ENTERPRISE":
                case 9:
                    message.platform = 9;
                    break;
                case "SMB_ANDROID":
                case 10:
                    message.platform = 10;
                    break;
                case "KAIOS":
                case 11:
                    message.platform = 11;
                    break;
                case "SMB_IOS":
                case 12:
                    message.platform = 12;
                    break;
                case "WINDOWS":
                case 13:
                    message.platform = 13;
                    break;
                case "WEB":
                case 14:
                    message.platform = 14;
                    break;
                case "PORTAL":
                case 15:
                    message.platform = 15;
                    break;
                case "GREEN_ANDROID":
                case 16:
                    message.platform = 16;
                    break;
                case "GREEN_IPHONE":
                case 17:
                    message.platform = 17;
                    break;
                case "BLUE_ANDROID":
                case 18:
                    message.platform = 18;
                    break;
                case "BLUE_IPHONE":
                case 19:
                    message.platform = 19;
                    break;
                case "FBLITE_ANDROID":
                case 20:
                    message.platform = 20;
                    break;
                case "MLITE_ANDROID":
                case 21:
                    message.platform = 21;
                    break;
                case "IGLITE_ANDROID":
                case 22:
                    message.platform = 22;
                    break;
                case "PAGE":
                case 23:
                    message.platform = 23;
                    break;
                case "MACOS":
                case 24:
                    message.platform = 24;
                    break;
                case "OCULUS_MSG":
                case 25:
                    message.platform = 25;
                    break;
                case "OCULUS_CALL":
                case 26:
                    message.platform = 26;
                    break;
                case "MILAN":
                case 27:
                    message.platform = 27;
                    break;
                case "CAPI":
                case 28:
                    message.platform = 28;
                    break;
                case "WEAROS":
                case 29:
                    message.platform = 29;
                    break;
                case "ARDEVICE":
                case 30:
                    message.platform = 30;
                    break;
                case "VRDEVICE":
                case 31:
                    message.platform = 31;
                    break;
                case "BLUE_WEB":
                case 32:
                    message.platform = 32;
                    break;
                case "IPAD":
                case 33:
                    message.platform = 33;
                    break;
                case "TEST":
                case 34:
                    message.platform = 34;
                    break;
                case "SMART_GLASSES":
                case 35:
                    message.platform = 35;
                    break;
                }
                if (object.appVersion != null) {
                    if (typeof object.appVersion !== "object")
                        throw TypeError(".WAWa6.ClientPayload.UserAgent.appVersion: object expected");
                    message.appVersion = $root.WAWa6.ClientPayload.UserAgent.AppVersion.fromObject(object.appVersion);
                }
                if (object.mcc != null)
                    message.mcc = String(object.mcc);
                if (object.mnc != null)
                    message.mnc = String(object.mnc);
                if (object.osVersion != null)
                    message.osVersion = String(object.osVersion);
                if (object.manufacturer != null)
                    message.manufacturer = String(object.manufacturer);
                if (object.device != null)
                    message.device = String(object.device);
                if (object.osBuildNumber != null)
                    message.osBuildNumber = String(object.osBuildNumber);
                if (object.phoneID != null)
                    message.phoneID = String(object.phoneID);
                switch (object.releaseChannel) {
                default:
                    if (typeof object.releaseChannel === "number") {
                        message.releaseChannel = object.releaseChannel;
                        break;
                    }
                    break;
                case "RELEASE":
                case 0:
                    message.releaseChannel = 0;
                    break;
                case "BETA":
                case 1:
                    message.releaseChannel = 1;
                    break;
                case "ALPHA":
                case 2:
                    message.releaseChannel = 2;
                    break;
                case "DEBUG":
                case 3:
                    message.releaseChannel = 3;
                    break;
                }
                if (object.localeLanguageIso6391 != null)
                    message.localeLanguageIso6391 = String(object.localeLanguageIso6391);
                if (object.localeCountryIso31661Alpha2 != null)
                    message.localeCountryIso31661Alpha2 = String(object.localeCountryIso31661Alpha2);
                if (object.deviceBoard != null)
                    message.deviceBoard = String(object.deviceBoard);
                if (object.deviceExpID != null)
                    message.deviceExpID = String(object.deviceExpID);
                switch (object.deviceType) {
                default:
                    if (typeof object.deviceType === "number") {
                        message.deviceType = object.deviceType;
                        break;
                    }
                    break;
                case "PHONE":
                case 0:
                    message.deviceType = 0;
                    break;
                case "TABLET":
                case 1:
                    message.deviceType = 1;
                    break;
                case "DESKTOP":
                case 2:
                    message.deviceType = 2;
                    break;
                case "WEARABLE":
                case 3:
                    message.deviceType = 3;
                    break;
                case "VR":
                case 4:
                    message.deviceType = 4;
                    break;
                }
                if (object.deviceModelType != null)
                    message.deviceModelType = String(object.deviceModelType);
                return message;
            };

            /**
             * Creates a plain object from a UserAgent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {WAWa6.ClientPayload.UserAgent} message UserAgent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserAgent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.platform = options.enums === String ? "ANDROID" : 0;
                    object.appVersion = null;
                    object.mcc = "";
                    object.mnc = "";
                    object.osVersion = "";
                    object.manufacturer = "";
                    object.device = "";
                    object.osBuildNumber = "";
                    object.phoneID = "";
                    object.releaseChannel = options.enums === String ? "RELEASE" : 0;
                    object.localeLanguageIso6391 = "";
                    object.localeCountryIso31661Alpha2 = "";
                    object.deviceBoard = "";
                    object.deviceExpID = "";
                    object.deviceType = options.enums === String ? "PHONE" : 0;
                    object.deviceModelType = "";
                }
                if (message.platform != null && message.hasOwnProperty("platform"))
                    object.platform = options.enums === String ? $root.WAWa6.ClientPayload.UserAgent.Platform[message.platform] === undefined ? message.platform : $root.WAWa6.ClientPayload.UserAgent.Platform[message.platform] : message.platform;
                if (message.appVersion != null && message.hasOwnProperty("appVersion"))
                    object.appVersion = $root.WAWa6.ClientPayload.UserAgent.AppVersion.toObject(message.appVersion, options);
                if (message.mcc != null && message.hasOwnProperty("mcc"))
                    object.mcc = message.mcc;
                if (message.mnc != null && message.hasOwnProperty("mnc"))
                    object.mnc = message.mnc;
                if (message.osVersion != null && message.hasOwnProperty("osVersion"))
                    object.osVersion = message.osVersion;
                if (message.manufacturer != null && message.hasOwnProperty("manufacturer"))
                    object.manufacturer = message.manufacturer;
                if (message.device != null && message.hasOwnProperty("device"))
                    object.device = message.device;
                if (message.osBuildNumber != null && message.hasOwnProperty("osBuildNumber"))
                    object.osBuildNumber = message.osBuildNumber;
                if (message.phoneID != null && message.hasOwnProperty("phoneID"))
                    object.phoneID = message.phoneID;
                if (message.releaseChannel != null && message.hasOwnProperty("releaseChannel"))
                    object.releaseChannel = options.enums === String ? $root.WAWa6.ClientPayload.UserAgent.ReleaseChannel[message.releaseChannel] === undefined ? message.releaseChannel : $root.WAWa6.ClientPayload.UserAgent.ReleaseChannel[message.releaseChannel] : message.releaseChannel;
                if (message.localeLanguageIso6391 != null && message.hasOwnProperty("localeLanguageIso6391"))
                    object.localeLanguageIso6391 = message.localeLanguageIso6391;
                if (message.localeCountryIso31661Alpha2 != null && message.hasOwnProperty("localeCountryIso31661Alpha2"))
                    object.localeCountryIso31661Alpha2 = message.localeCountryIso31661Alpha2;
                if (message.deviceBoard != null && message.hasOwnProperty("deviceBoard"))
                    object.deviceBoard = message.deviceBoard;
                if (message.deviceExpID != null && message.hasOwnProperty("deviceExpID"))
                    object.deviceExpID = message.deviceExpID;
                if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                    object.deviceType = options.enums === String ? $root.WAWa6.ClientPayload.UserAgent.DeviceType[message.deviceType] === undefined ? message.deviceType : $root.WAWa6.ClientPayload.UserAgent.DeviceType[message.deviceType] : message.deviceType;
                if (message.deviceModelType != null && message.hasOwnProperty("deviceModelType"))
                    object.deviceModelType = message.deviceModelType;
                return object;
            };

            /**
             * Converts this UserAgent to JSON.
             * @function toJSON
             * @memberof WAWa6.ClientPayload.UserAgent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserAgent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UserAgent
             * @function getTypeUrl
             * @memberof WAWa6.ClientPayload.UserAgent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UserAgent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.ClientPayload.UserAgent";
            };

            /**
             * DeviceType enum.
             * @name WAWa6.ClientPayload.UserAgent.DeviceType
             * @enum {number}
             * @property {number} PHONE=0 PHONE value
             * @property {number} TABLET=1 TABLET value
             * @property {number} DESKTOP=2 DESKTOP value
             * @property {number} WEARABLE=3 WEARABLE value
             * @property {number} VR=4 VR value
             */
            UserAgent.DeviceType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PHONE"] = 0;
                values[valuesById[1] = "TABLET"] = 1;
                values[valuesById[2] = "DESKTOP"] = 2;
                values[valuesById[3] = "WEARABLE"] = 3;
                values[valuesById[4] = "VR"] = 4;
                return values;
            })();

            /**
             * ReleaseChannel enum.
             * @name WAWa6.ClientPayload.UserAgent.ReleaseChannel
             * @enum {number}
             * @property {number} RELEASE=0 RELEASE value
             * @property {number} BETA=1 BETA value
             * @property {number} ALPHA=2 ALPHA value
             * @property {number} DEBUG=3 DEBUG value
             */
            UserAgent.ReleaseChannel = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "RELEASE"] = 0;
                values[valuesById[1] = "BETA"] = 1;
                values[valuesById[2] = "ALPHA"] = 2;
                values[valuesById[3] = "DEBUG"] = 3;
                return values;
            })();

            /**
             * Platform enum.
             * @name WAWa6.ClientPayload.UserAgent.Platform
             * @enum {number}
             * @property {number} ANDROID=0 ANDROID value
             * @property {number} IOS=1 IOS value
             * @property {number} WINDOWS_PHONE=2 WINDOWS_PHONE value
             * @property {number} BLACKBERRY=3 BLACKBERRY value
             * @property {number} BLACKBERRYX=4 BLACKBERRYX value
             * @property {number} S40=5 S40 value
             * @property {number} S60=6 S60 value
             * @property {number} PYTHON_CLIENT=7 PYTHON_CLIENT value
             * @property {number} TIZEN=8 TIZEN value
             * @property {number} ENTERPRISE=9 ENTERPRISE value
             * @property {number} SMB_ANDROID=10 SMB_ANDROID value
             * @property {number} KAIOS=11 KAIOS value
             * @property {number} SMB_IOS=12 SMB_IOS value
             * @property {number} WINDOWS=13 WINDOWS value
             * @property {number} WEB=14 WEB value
             * @property {number} PORTAL=15 PORTAL value
             * @property {number} GREEN_ANDROID=16 GREEN_ANDROID value
             * @property {number} GREEN_IPHONE=17 GREEN_IPHONE value
             * @property {number} BLUE_ANDROID=18 BLUE_ANDROID value
             * @property {number} BLUE_IPHONE=19 BLUE_IPHONE value
             * @property {number} FBLITE_ANDROID=20 FBLITE_ANDROID value
             * @property {number} MLITE_ANDROID=21 MLITE_ANDROID value
             * @property {number} IGLITE_ANDROID=22 IGLITE_ANDROID value
             * @property {number} PAGE=23 PAGE value
             * @property {number} MACOS=24 MACOS value
             * @property {number} OCULUS_MSG=25 OCULUS_MSG value
             * @property {number} OCULUS_CALL=26 OCULUS_CALL value
             * @property {number} MILAN=27 MILAN value
             * @property {number} CAPI=28 CAPI value
             * @property {number} WEAROS=29 WEAROS value
             * @property {number} ARDEVICE=30 ARDEVICE value
             * @property {number} VRDEVICE=31 VRDEVICE value
             * @property {number} BLUE_WEB=32 BLUE_WEB value
             * @property {number} IPAD=33 IPAD value
             * @property {number} TEST=34 TEST value
             * @property {number} SMART_GLASSES=35 SMART_GLASSES value
             */
            UserAgent.Platform = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ANDROID"] = 0;
                values[valuesById[1] = "IOS"] = 1;
                values[valuesById[2] = "WINDOWS_PHONE"] = 2;
                values[valuesById[3] = "BLACKBERRY"] = 3;
                values[valuesById[4] = "BLACKBERRYX"] = 4;
                values[valuesById[5] = "S40"] = 5;
                values[valuesById[6] = "S60"] = 6;
                values[valuesById[7] = "PYTHON_CLIENT"] = 7;
                values[valuesById[8] = "TIZEN"] = 8;
                values[valuesById[9] = "ENTERPRISE"] = 9;
                values[valuesById[10] = "SMB_ANDROID"] = 10;
                values[valuesById[11] = "KAIOS"] = 11;
                values[valuesById[12] = "SMB_IOS"] = 12;
                values[valuesById[13] = "WINDOWS"] = 13;
                values[valuesById[14] = "WEB"] = 14;
                values[valuesById[15] = "PORTAL"] = 15;
                values[valuesById[16] = "GREEN_ANDROID"] = 16;
                values[valuesById[17] = "GREEN_IPHONE"] = 17;
                values[valuesById[18] = "BLUE_ANDROID"] = 18;
                values[valuesById[19] = "BLUE_IPHONE"] = 19;
                values[valuesById[20] = "FBLITE_ANDROID"] = 20;
                values[valuesById[21] = "MLITE_ANDROID"] = 21;
                values[valuesById[22] = "IGLITE_ANDROID"] = 22;
                values[valuesById[23] = "PAGE"] = 23;
                values[valuesById[24] = "MACOS"] = 24;
                values[valuesById[25] = "OCULUS_MSG"] = 25;
                values[valuesById[26] = "OCULUS_CALL"] = 26;
                values[valuesById[27] = "MILAN"] = 27;
                values[valuesById[28] = "CAPI"] = 28;
                values[valuesById[29] = "WEAROS"] = 29;
                values[valuesById[30] = "ARDEVICE"] = 30;
                values[valuesById[31] = "VRDEVICE"] = 31;
                values[valuesById[32] = "BLUE_WEB"] = 32;
                values[valuesById[33] = "IPAD"] = 33;
                values[valuesById[34] = "TEST"] = 34;
                values[valuesById[35] = "SMART_GLASSES"] = 35;
                return values;
            })();

            UserAgent.AppVersion = (function() {

                /**
                 * Properties of an AppVersion.
                 * @memberof WAWa6.ClientPayload.UserAgent
                 * @interface IAppVersion
                 * @property {number|null} [primary] AppVersion primary
                 * @property {number|null} [secondary] AppVersion secondary
                 * @property {number|null} [tertiary] AppVersion tertiary
                 * @property {number|null} [quaternary] AppVersion quaternary
                 * @property {number|null} [quinary] AppVersion quinary
                 */

                /**
                 * Constructs a new AppVersion.
                 * @memberof WAWa6.ClientPayload.UserAgent
                 * @classdesc Represents an AppVersion.
                 * @implements IAppVersion
                 * @constructor
                 * @param {WAWa6.ClientPayload.UserAgent.IAppVersion=} [properties] Properties to set
                 */
                function AppVersion(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AppVersion primary.
                 * @member {number} primary
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 */
                AppVersion.prototype.primary = 0;

                /**
                 * AppVersion secondary.
                 * @member {number} secondary
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 */
                AppVersion.prototype.secondary = 0;

                /**
                 * AppVersion tertiary.
                 * @member {number} tertiary
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 */
                AppVersion.prototype.tertiary = 0;

                /**
                 * AppVersion quaternary.
                 * @member {number} quaternary
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 */
                AppVersion.prototype.quaternary = 0;

                /**
                 * AppVersion quinary.
                 * @member {number} quinary
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 */
                AppVersion.prototype.quinary = 0;

                /**
                 * Creates a new AppVersion instance using the specified properties.
                 * @function create
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {WAWa6.ClientPayload.UserAgent.IAppVersion=} [properties] Properties to set
                 * @returns {WAWa6.ClientPayload.UserAgent.AppVersion} AppVersion instance
                 */
                AppVersion.create = function create(properties) {
                    return new AppVersion(properties);
                };

                /**
                 * Encodes the specified AppVersion message. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.AppVersion.verify|verify} messages.
                 * @function encode
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {WAWa6.ClientPayload.UserAgent.IAppVersion} message AppVersion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AppVersion.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.primary != null && Object.hasOwnProperty.call(message, "primary"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.primary);
                    if (message.secondary != null && Object.hasOwnProperty.call(message, "secondary"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.secondary);
                    if (message.tertiary != null && Object.hasOwnProperty.call(message, "tertiary"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.tertiary);
                    if (message.quaternary != null && Object.hasOwnProperty.call(message, "quaternary"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.quaternary);
                    if (message.quinary != null && Object.hasOwnProperty.call(message, "quinary"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.quinary);
                    return writer;
                };

                /**
                 * Encodes the specified AppVersion message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.UserAgent.AppVersion.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {WAWa6.ClientPayload.UserAgent.IAppVersion} message AppVersion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AppVersion.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an AppVersion message from the specified reader or buffer.
                 * @function decode
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {WAWa6.ClientPayload.UserAgent.AppVersion} AppVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AppVersion.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.UserAgent.AppVersion();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.primary = reader.uint32();
                                break;
                            }
                        case 2: {
                                message.secondary = reader.uint32();
                                break;
                            }
                        case 3: {
                                message.tertiary = reader.uint32();
                                break;
                            }
                        case 4: {
                                message.quaternary = reader.uint32();
                                break;
                            }
                        case 5: {
                                message.quinary = reader.uint32();
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
                 * Decodes an AppVersion message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {WAWa6.ClientPayload.UserAgent.AppVersion} AppVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AppVersion.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AppVersion message.
                 * @function verify
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AppVersion.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.primary != null && message.hasOwnProperty("primary"))
                        if (!$util.isInteger(message.primary))
                            return "primary: integer expected";
                    if (message.secondary != null && message.hasOwnProperty("secondary"))
                        if (!$util.isInteger(message.secondary))
                            return "secondary: integer expected";
                    if (message.tertiary != null && message.hasOwnProperty("tertiary"))
                        if (!$util.isInteger(message.tertiary))
                            return "tertiary: integer expected";
                    if (message.quaternary != null && message.hasOwnProperty("quaternary"))
                        if (!$util.isInteger(message.quaternary))
                            return "quaternary: integer expected";
                    if (message.quinary != null && message.hasOwnProperty("quinary"))
                        if (!$util.isInteger(message.quinary))
                            return "quinary: integer expected";
                    return null;
                };

                /**
                 * Creates an AppVersion message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {WAWa6.ClientPayload.UserAgent.AppVersion} AppVersion
                 */
                AppVersion.fromObject = function fromObject(object) {
                    if (object instanceof $root.WAWa6.ClientPayload.UserAgent.AppVersion)
                        return object;
                    var message = new $root.WAWa6.ClientPayload.UserAgent.AppVersion();
                    if (object.primary != null)
                        message.primary = object.primary >>> 0;
                    if (object.secondary != null)
                        message.secondary = object.secondary >>> 0;
                    if (object.tertiary != null)
                        message.tertiary = object.tertiary >>> 0;
                    if (object.quaternary != null)
                        message.quaternary = object.quaternary >>> 0;
                    if (object.quinary != null)
                        message.quinary = object.quinary >>> 0;
                    return message;
                };

                /**
                 * Creates a plain object from an AppVersion message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {WAWa6.ClientPayload.UserAgent.AppVersion} message AppVersion
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AppVersion.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.primary = 0;
                        object.secondary = 0;
                        object.tertiary = 0;
                        object.quaternary = 0;
                        object.quinary = 0;
                    }
                    if (message.primary != null && message.hasOwnProperty("primary"))
                        object.primary = message.primary;
                    if (message.secondary != null && message.hasOwnProperty("secondary"))
                        object.secondary = message.secondary;
                    if (message.tertiary != null && message.hasOwnProperty("tertiary"))
                        object.tertiary = message.tertiary;
                    if (message.quaternary != null && message.hasOwnProperty("quaternary"))
                        object.quaternary = message.quaternary;
                    if (message.quinary != null && message.hasOwnProperty("quinary"))
                        object.quinary = message.quinary;
                    return object;
                };

                /**
                 * Converts this AppVersion to JSON.
                 * @function toJSON
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AppVersion.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AppVersion
                 * @function getTypeUrl
                 * @memberof WAWa6.ClientPayload.UserAgent.AppVersion
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AppVersion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/WAWa6.ClientPayload.UserAgent.AppVersion";
                };

                return AppVersion;
            })();

            return UserAgent;
        })();

        ClientPayload.InteropData = (function() {

            /**
             * Properties of an InteropData.
             * @memberof WAWa6.ClientPayload
             * @interface IInteropData
             * @property {number|Long|null} [accountID] InteropData accountID
             * @property {Uint8Array|null} [token] InteropData token
             */

            /**
             * Constructs a new InteropData.
             * @memberof WAWa6.ClientPayload
             * @classdesc Represents an InteropData.
             * @implements IInteropData
             * @constructor
             * @param {WAWa6.ClientPayload.IInteropData=} [properties] Properties to set
             */
            function InteropData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * InteropData accountID.
             * @member {number|Long} accountID
             * @memberof WAWa6.ClientPayload.InteropData
             * @instance
             */
            InteropData.prototype.accountID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * InteropData token.
             * @member {Uint8Array} token
             * @memberof WAWa6.ClientPayload.InteropData
             * @instance
             */
            InteropData.prototype.token = $util.newBuffer([]);

            /**
             * Creates a new InteropData instance using the specified properties.
             * @function create
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {WAWa6.ClientPayload.IInteropData=} [properties] Properties to set
             * @returns {WAWa6.ClientPayload.InteropData} InteropData instance
             */
            InteropData.create = function create(properties) {
                return new InteropData(properties);
            };

            /**
             * Encodes the specified InteropData message. Does not implicitly {@link WAWa6.ClientPayload.InteropData.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {WAWa6.ClientPayload.IInteropData} message InteropData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InteropData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.accountID != null && Object.hasOwnProperty.call(message, "accountID"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.accountID);
                if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.token);
                return writer;
            };

            /**
             * Encodes the specified InteropData message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.InteropData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {WAWa6.ClientPayload.IInteropData} message InteropData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InteropData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InteropData message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.ClientPayload.InteropData} InteropData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InteropData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.InteropData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.accountID = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.token = reader.bytes();
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
             * Decodes an InteropData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.ClientPayload.InteropData} InteropData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InteropData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InteropData message.
             * @function verify
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InteropData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.accountID != null && message.hasOwnProperty("accountID"))
                    if (!$util.isInteger(message.accountID) && !(message.accountID && $util.isInteger(message.accountID.low) && $util.isInteger(message.accountID.high)))
                        return "accountID: integer|Long expected";
                if (message.token != null && message.hasOwnProperty("token"))
                    if (!(message.token && typeof message.token.length === "number" || $util.isString(message.token)))
                        return "token: buffer expected";
                return null;
            };

            /**
             * Creates an InteropData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.ClientPayload.InteropData} InteropData
             */
            InteropData.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.ClientPayload.InteropData)
                    return object;
                var message = new $root.WAWa6.ClientPayload.InteropData();
                if (object.accountID != null)
                    if ($util.Long)
                        (message.accountID = $util.Long.fromValue(object.accountID)).unsigned = true;
                    else if (typeof object.accountID === "string")
                        message.accountID = parseInt(object.accountID, 10);
                    else if (typeof object.accountID === "number")
                        message.accountID = object.accountID;
                    else if (typeof object.accountID === "object")
                        message.accountID = new $util.LongBits(object.accountID.low >>> 0, object.accountID.high >>> 0).toNumber(true);
                if (object.token != null)
                    if (typeof object.token === "string")
                        $util.base64.decode(object.token, message.token = $util.newBuffer($util.base64.length(object.token)), 0);
                    else if (object.token.length >= 0)
                        message.token = object.token;
                return message;
            };

            /**
             * Creates a plain object from an InteropData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {WAWa6.ClientPayload.InteropData} message InteropData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InteropData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.accountID = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.accountID = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.token = "";
                    else {
                        object.token = [];
                        if (options.bytes !== Array)
                            object.token = $util.newBuffer(object.token);
                    }
                }
                if (message.accountID != null && message.hasOwnProperty("accountID"))
                    if (typeof message.accountID === "number")
                        object.accountID = options.longs === String ? String(message.accountID) : message.accountID;
                    else
                        object.accountID = options.longs === String ? $util.Long.prototype.toString.call(message.accountID) : options.longs === Number ? new $util.LongBits(message.accountID.low >>> 0, message.accountID.high >>> 0).toNumber(true) : message.accountID;
                if (message.token != null && message.hasOwnProperty("token"))
                    object.token = options.bytes === String ? $util.base64.encode(message.token, 0, message.token.length) : options.bytes === Array ? Array.prototype.slice.call(message.token) : message.token;
                return object;
            };

            /**
             * Converts this InteropData to JSON.
             * @function toJSON
             * @memberof WAWa6.ClientPayload.InteropData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InteropData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for InteropData
             * @function getTypeUrl
             * @memberof WAWa6.ClientPayload.InteropData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            InteropData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.ClientPayload.InteropData";
            };

            return InteropData;
        })();

        ClientPayload.DevicePairingRegistrationData = (function() {

            /**
             * Properties of a DevicePairingRegistrationData.
             * @memberof WAWa6.ClientPayload
             * @interface IDevicePairingRegistrationData
             * @property {Uint8Array|null} [eRegid] DevicePairingRegistrationData eRegid
             * @property {Uint8Array|null} [eKeytype] DevicePairingRegistrationData eKeytype
             * @property {Uint8Array|null} [eIdent] DevicePairingRegistrationData eIdent
             * @property {Uint8Array|null} [eSkeyID] DevicePairingRegistrationData eSkeyID
             * @property {Uint8Array|null} [eSkeyVal] DevicePairingRegistrationData eSkeyVal
             * @property {Uint8Array|null} [eSkeySig] DevicePairingRegistrationData eSkeySig
             * @property {Uint8Array|null} [buildHash] DevicePairingRegistrationData buildHash
             * @property {Uint8Array|null} [deviceProps] DevicePairingRegistrationData deviceProps
             */

            /**
             * Constructs a new DevicePairingRegistrationData.
             * @memberof WAWa6.ClientPayload
             * @classdesc Represents a DevicePairingRegistrationData.
             * @implements IDevicePairingRegistrationData
             * @constructor
             * @param {WAWa6.ClientPayload.IDevicePairingRegistrationData=} [properties] Properties to set
             */
            function DevicePairingRegistrationData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DevicePairingRegistrationData eRegid.
             * @member {Uint8Array} eRegid
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eRegid = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData eKeytype.
             * @member {Uint8Array} eKeytype
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eKeytype = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData eIdent.
             * @member {Uint8Array} eIdent
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eIdent = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData eSkeyID.
             * @member {Uint8Array} eSkeyID
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eSkeyID = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData eSkeyVal.
             * @member {Uint8Array} eSkeyVal
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eSkeyVal = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData eSkeySig.
             * @member {Uint8Array} eSkeySig
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.eSkeySig = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData buildHash.
             * @member {Uint8Array} buildHash
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.buildHash = $util.newBuffer([]);

            /**
             * DevicePairingRegistrationData deviceProps.
             * @member {Uint8Array} deviceProps
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             */
            DevicePairingRegistrationData.prototype.deviceProps = $util.newBuffer([]);

            /**
             * Creates a new DevicePairingRegistrationData instance using the specified properties.
             * @function create
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {WAWa6.ClientPayload.IDevicePairingRegistrationData=} [properties] Properties to set
             * @returns {WAWa6.ClientPayload.DevicePairingRegistrationData} DevicePairingRegistrationData instance
             */
            DevicePairingRegistrationData.create = function create(properties) {
                return new DevicePairingRegistrationData(properties);
            };

            /**
             * Encodes the specified DevicePairingRegistrationData message. Does not implicitly {@link WAWa6.ClientPayload.DevicePairingRegistrationData.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {WAWa6.ClientPayload.IDevicePairingRegistrationData} message DevicePairingRegistrationData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DevicePairingRegistrationData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eRegid != null && Object.hasOwnProperty.call(message, "eRegid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.eRegid);
                if (message.eKeytype != null && Object.hasOwnProperty.call(message, "eKeytype"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.eKeytype);
                if (message.eIdent != null && Object.hasOwnProperty.call(message, "eIdent"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.eIdent);
                if (message.eSkeyID != null && Object.hasOwnProperty.call(message, "eSkeyID"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.eSkeyID);
                if (message.eSkeyVal != null && Object.hasOwnProperty.call(message, "eSkeyVal"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.eSkeyVal);
                if (message.eSkeySig != null && Object.hasOwnProperty.call(message, "eSkeySig"))
                    writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.eSkeySig);
                if (message.buildHash != null && Object.hasOwnProperty.call(message, "buildHash"))
                    writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.buildHash);
                if (message.deviceProps != null && Object.hasOwnProperty.call(message, "deviceProps"))
                    writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.deviceProps);
                return writer;
            };

            /**
             * Encodes the specified DevicePairingRegistrationData message, length delimited. Does not implicitly {@link WAWa6.ClientPayload.DevicePairingRegistrationData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {WAWa6.ClientPayload.IDevicePairingRegistrationData} message DevicePairingRegistrationData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DevicePairingRegistrationData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DevicePairingRegistrationData message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.ClientPayload.DevicePairingRegistrationData} DevicePairingRegistrationData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DevicePairingRegistrationData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.ClientPayload.DevicePairingRegistrationData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.eRegid = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.eKeytype = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.eIdent = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.eSkeyID = reader.bytes();
                            break;
                        }
                    case 5: {
                            message.eSkeyVal = reader.bytes();
                            break;
                        }
                    case 6: {
                            message.eSkeySig = reader.bytes();
                            break;
                        }
                    case 7: {
                            message.buildHash = reader.bytes();
                            break;
                        }
                    case 8: {
                            message.deviceProps = reader.bytes();
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
             * Decodes a DevicePairingRegistrationData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.ClientPayload.DevicePairingRegistrationData} DevicePairingRegistrationData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DevicePairingRegistrationData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DevicePairingRegistrationData message.
             * @function verify
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DevicePairingRegistrationData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.eRegid != null && message.hasOwnProperty("eRegid"))
                    if (!(message.eRegid && typeof message.eRegid.length === "number" || $util.isString(message.eRegid)))
                        return "eRegid: buffer expected";
                if (message.eKeytype != null && message.hasOwnProperty("eKeytype"))
                    if (!(message.eKeytype && typeof message.eKeytype.length === "number" || $util.isString(message.eKeytype)))
                        return "eKeytype: buffer expected";
                if (message.eIdent != null && message.hasOwnProperty("eIdent"))
                    if (!(message.eIdent && typeof message.eIdent.length === "number" || $util.isString(message.eIdent)))
                        return "eIdent: buffer expected";
                if (message.eSkeyID != null && message.hasOwnProperty("eSkeyID"))
                    if (!(message.eSkeyID && typeof message.eSkeyID.length === "number" || $util.isString(message.eSkeyID)))
                        return "eSkeyID: buffer expected";
                if (message.eSkeyVal != null && message.hasOwnProperty("eSkeyVal"))
                    if (!(message.eSkeyVal && typeof message.eSkeyVal.length === "number" || $util.isString(message.eSkeyVal)))
                        return "eSkeyVal: buffer expected";
                if (message.eSkeySig != null && message.hasOwnProperty("eSkeySig"))
                    if (!(message.eSkeySig && typeof message.eSkeySig.length === "number" || $util.isString(message.eSkeySig)))
                        return "eSkeySig: buffer expected";
                if (message.buildHash != null && message.hasOwnProperty("buildHash"))
                    if (!(message.buildHash && typeof message.buildHash.length === "number" || $util.isString(message.buildHash)))
                        return "buildHash: buffer expected";
                if (message.deviceProps != null && message.hasOwnProperty("deviceProps"))
                    if (!(message.deviceProps && typeof message.deviceProps.length === "number" || $util.isString(message.deviceProps)))
                        return "deviceProps: buffer expected";
                return null;
            };

            /**
             * Creates a DevicePairingRegistrationData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.ClientPayload.DevicePairingRegistrationData} DevicePairingRegistrationData
             */
            DevicePairingRegistrationData.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.ClientPayload.DevicePairingRegistrationData)
                    return object;
                var message = new $root.WAWa6.ClientPayload.DevicePairingRegistrationData();
                if (object.eRegid != null)
                    if (typeof object.eRegid === "string")
                        $util.base64.decode(object.eRegid, message.eRegid = $util.newBuffer($util.base64.length(object.eRegid)), 0);
                    else if (object.eRegid.length >= 0)
                        message.eRegid = object.eRegid;
                if (object.eKeytype != null)
                    if (typeof object.eKeytype === "string")
                        $util.base64.decode(object.eKeytype, message.eKeytype = $util.newBuffer($util.base64.length(object.eKeytype)), 0);
                    else if (object.eKeytype.length >= 0)
                        message.eKeytype = object.eKeytype;
                if (object.eIdent != null)
                    if (typeof object.eIdent === "string")
                        $util.base64.decode(object.eIdent, message.eIdent = $util.newBuffer($util.base64.length(object.eIdent)), 0);
                    else if (object.eIdent.length >= 0)
                        message.eIdent = object.eIdent;
                if (object.eSkeyID != null)
                    if (typeof object.eSkeyID === "string")
                        $util.base64.decode(object.eSkeyID, message.eSkeyID = $util.newBuffer($util.base64.length(object.eSkeyID)), 0);
                    else if (object.eSkeyID.length >= 0)
                        message.eSkeyID = object.eSkeyID;
                if (object.eSkeyVal != null)
                    if (typeof object.eSkeyVal === "string")
                        $util.base64.decode(object.eSkeyVal, message.eSkeyVal = $util.newBuffer($util.base64.length(object.eSkeyVal)), 0);
                    else if (object.eSkeyVal.length >= 0)
                        message.eSkeyVal = object.eSkeyVal;
                if (object.eSkeySig != null)
                    if (typeof object.eSkeySig === "string")
                        $util.base64.decode(object.eSkeySig, message.eSkeySig = $util.newBuffer($util.base64.length(object.eSkeySig)), 0);
                    else if (object.eSkeySig.length >= 0)
                        message.eSkeySig = object.eSkeySig;
                if (object.buildHash != null)
                    if (typeof object.buildHash === "string")
                        $util.base64.decode(object.buildHash, message.buildHash = $util.newBuffer($util.base64.length(object.buildHash)), 0);
                    else if (object.buildHash.length >= 0)
                        message.buildHash = object.buildHash;
                if (object.deviceProps != null)
                    if (typeof object.deviceProps === "string")
                        $util.base64.decode(object.deviceProps, message.deviceProps = $util.newBuffer($util.base64.length(object.deviceProps)), 0);
                    else if (object.deviceProps.length >= 0)
                        message.deviceProps = object.deviceProps;
                return message;
            };

            /**
             * Creates a plain object from a DevicePairingRegistrationData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {WAWa6.ClientPayload.DevicePairingRegistrationData} message DevicePairingRegistrationData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DevicePairingRegistrationData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.eRegid = "";
                    else {
                        object.eRegid = [];
                        if (options.bytes !== Array)
                            object.eRegid = $util.newBuffer(object.eRegid);
                    }
                    if (options.bytes === String)
                        object.eKeytype = "";
                    else {
                        object.eKeytype = [];
                        if (options.bytes !== Array)
                            object.eKeytype = $util.newBuffer(object.eKeytype);
                    }
                    if (options.bytes === String)
                        object.eIdent = "";
                    else {
                        object.eIdent = [];
                        if (options.bytes !== Array)
                            object.eIdent = $util.newBuffer(object.eIdent);
                    }
                    if (options.bytes === String)
                        object.eSkeyID = "";
                    else {
                        object.eSkeyID = [];
                        if (options.bytes !== Array)
                            object.eSkeyID = $util.newBuffer(object.eSkeyID);
                    }
                    if (options.bytes === String)
                        object.eSkeyVal = "";
                    else {
                        object.eSkeyVal = [];
                        if (options.bytes !== Array)
                            object.eSkeyVal = $util.newBuffer(object.eSkeyVal);
                    }
                    if (options.bytes === String)
                        object.eSkeySig = "";
                    else {
                        object.eSkeySig = [];
                        if (options.bytes !== Array)
                            object.eSkeySig = $util.newBuffer(object.eSkeySig);
                    }
                    if (options.bytes === String)
                        object.buildHash = "";
                    else {
                        object.buildHash = [];
                        if (options.bytes !== Array)
                            object.buildHash = $util.newBuffer(object.buildHash);
                    }
                    if (options.bytes === String)
                        object.deviceProps = "";
                    else {
                        object.deviceProps = [];
                        if (options.bytes !== Array)
                            object.deviceProps = $util.newBuffer(object.deviceProps);
                    }
                }
                if (message.eRegid != null && message.hasOwnProperty("eRegid"))
                    object.eRegid = options.bytes === String ? $util.base64.encode(message.eRegid, 0, message.eRegid.length) : options.bytes === Array ? Array.prototype.slice.call(message.eRegid) : message.eRegid;
                if (message.eKeytype != null && message.hasOwnProperty("eKeytype"))
                    object.eKeytype = options.bytes === String ? $util.base64.encode(message.eKeytype, 0, message.eKeytype.length) : options.bytes === Array ? Array.prototype.slice.call(message.eKeytype) : message.eKeytype;
                if (message.eIdent != null && message.hasOwnProperty("eIdent"))
                    object.eIdent = options.bytes === String ? $util.base64.encode(message.eIdent, 0, message.eIdent.length) : options.bytes === Array ? Array.prototype.slice.call(message.eIdent) : message.eIdent;
                if (message.eSkeyID != null && message.hasOwnProperty("eSkeyID"))
                    object.eSkeyID = options.bytes === String ? $util.base64.encode(message.eSkeyID, 0, message.eSkeyID.length) : options.bytes === Array ? Array.prototype.slice.call(message.eSkeyID) : message.eSkeyID;
                if (message.eSkeyVal != null && message.hasOwnProperty("eSkeyVal"))
                    object.eSkeyVal = options.bytes === String ? $util.base64.encode(message.eSkeyVal, 0, message.eSkeyVal.length) : options.bytes === Array ? Array.prototype.slice.call(message.eSkeyVal) : message.eSkeyVal;
                if (message.eSkeySig != null && message.hasOwnProperty("eSkeySig"))
                    object.eSkeySig = options.bytes === String ? $util.base64.encode(message.eSkeySig, 0, message.eSkeySig.length) : options.bytes === Array ? Array.prototype.slice.call(message.eSkeySig) : message.eSkeySig;
                if (message.buildHash != null && message.hasOwnProperty("buildHash"))
                    object.buildHash = options.bytes === String ? $util.base64.encode(message.buildHash, 0, message.buildHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.buildHash) : message.buildHash;
                if (message.deviceProps != null && message.hasOwnProperty("deviceProps"))
                    object.deviceProps = options.bytes === String ? $util.base64.encode(message.deviceProps, 0, message.deviceProps.length) : options.bytes === Array ? Array.prototype.slice.call(message.deviceProps) : message.deviceProps;
                return object;
            };

            /**
             * Converts this DevicePairingRegistrationData to JSON.
             * @function toJSON
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DevicePairingRegistrationData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DevicePairingRegistrationData
             * @function getTypeUrl
             * @memberof WAWa6.ClientPayload.DevicePairingRegistrationData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DevicePairingRegistrationData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.ClientPayload.DevicePairingRegistrationData";
            };

            return DevicePairingRegistrationData;
        })();

        return ClientPayload;
    })();

    WAWa6.HandshakeMessage = (function() {

        /**
         * Properties of a HandshakeMessage.
         * @memberof WAWa6
         * @interface IHandshakeMessage
         * @property {WAWa6.HandshakeMessage.IClientHello|null} [clientHello] HandshakeMessage clientHello
         * @property {WAWa6.HandshakeMessage.IServerHello|null} [serverHello] HandshakeMessage serverHello
         * @property {WAWa6.HandshakeMessage.IClientFinish|null} [clientFinish] HandshakeMessage clientFinish
         */

        /**
         * Constructs a new HandshakeMessage.
         * @memberof WAWa6
         * @classdesc Represents a HandshakeMessage.
         * @implements IHandshakeMessage
         * @constructor
         * @param {WAWa6.IHandshakeMessage=} [properties] Properties to set
         */
        function HandshakeMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HandshakeMessage clientHello.
         * @member {WAWa6.HandshakeMessage.IClientHello|null|undefined} clientHello
         * @memberof WAWa6.HandshakeMessage
         * @instance
         */
        HandshakeMessage.prototype.clientHello = null;

        /**
         * HandshakeMessage serverHello.
         * @member {WAWa6.HandshakeMessage.IServerHello|null|undefined} serverHello
         * @memberof WAWa6.HandshakeMessage
         * @instance
         */
        HandshakeMessage.prototype.serverHello = null;

        /**
         * HandshakeMessage clientFinish.
         * @member {WAWa6.HandshakeMessage.IClientFinish|null|undefined} clientFinish
         * @memberof WAWa6.HandshakeMessage
         * @instance
         */
        HandshakeMessage.prototype.clientFinish = null;

        /**
         * Creates a new HandshakeMessage instance using the specified properties.
         * @function create
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {WAWa6.IHandshakeMessage=} [properties] Properties to set
         * @returns {WAWa6.HandshakeMessage} HandshakeMessage instance
         */
        HandshakeMessage.create = function create(properties) {
            return new HandshakeMessage(properties);
        };

        /**
         * Encodes the specified HandshakeMessage message. Does not implicitly {@link WAWa6.HandshakeMessage.verify|verify} messages.
         * @function encode
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {WAWa6.IHandshakeMessage} message HandshakeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandshakeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientHello != null && Object.hasOwnProperty.call(message, "clientHello"))
                $root.WAWa6.HandshakeMessage.ClientHello.encode(message.clientHello, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.serverHello != null && Object.hasOwnProperty.call(message, "serverHello"))
                $root.WAWa6.HandshakeMessage.ServerHello.encode(message.serverHello, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.clientFinish != null && Object.hasOwnProperty.call(message, "clientFinish"))
                $root.WAWa6.HandshakeMessage.ClientFinish.encode(message.clientFinish, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified HandshakeMessage message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {WAWa6.IHandshakeMessage} message HandshakeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandshakeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HandshakeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWa6.HandshakeMessage} HandshakeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandshakeMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.HandshakeMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.clientHello = $root.WAWa6.HandshakeMessage.ClientHello.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.serverHello = $root.WAWa6.HandshakeMessage.ServerHello.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.clientFinish = $root.WAWa6.HandshakeMessage.ClientFinish.decode(reader, reader.uint32());
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
         * Decodes a HandshakeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWa6.HandshakeMessage} HandshakeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandshakeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HandshakeMessage message.
         * @function verify
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HandshakeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientHello != null && message.hasOwnProperty("clientHello")) {
                var error = $root.WAWa6.HandshakeMessage.ClientHello.verify(message.clientHello);
                if (error)
                    return "clientHello." + error;
            }
            if (message.serverHello != null && message.hasOwnProperty("serverHello")) {
                var error = $root.WAWa6.HandshakeMessage.ServerHello.verify(message.serverHello);
                if (error)
                    return "serverHello." + error;
            }
            if (message.clientFinish != null && message.hasOwnProperty("clientFinish")) {
                var error = $root.WAWa6.HandshakeMessage.ClientFinish.verify(message.clientFinish);
                if (error)
                    return "clientFinish." + error;
            }
            return null;
        };

        /**
         * Creates a HandshakeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWa6.HandshakeMessage} HandshakeMessage
         */
        HandshakeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWa6.HandshakeMessage)
                return object;
            var message = new $root.WAWa6.HandshakeMessage();
            if (object.clientHello != null) {
                if (typeof object.clientHello !== "object")
                    throw TypeError(".WAWa6.HandshakeMessage.clientHello: object expected");
                message.clientHello = $root.WAWa6.HandshakeMessage.ClientHello.fromObject(object.clientHello);
            }
            if (object.serverHello != null) {
                if (typeof object.serverHello !== "object")
                    throw TypeError(".WAWa6.HandshakeMessage.serverHello: object expected");
                message.serverHello = $root.WAWa6.HandshakeMessage.ServerHello.fromObject(object.serverHello);
            }
            if (object.clientFinish != null) {
                if (typeof object.clientFinish !== "object")
                    throw TypeError(".WAWa6.HandshakeMessage.clientFinish: object expected");
                message.clientFinish = $root.WAWa6.HandshakeMessage.ClientFinish.fromObject(object.clientFinish);
            }
            return message;
        };

        /**
         * Creates a plain object from a HandshakeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {WAWa6.HandshakeMessage} message HandshakeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HandshakeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.clientHello = null;
                object.serverHello = null;
                object.clientFinish = null;
            }
            if (message.clientHello != null && message.hasOwnProperty("clientHello"))
                object.clientHello = $root.WAWa6.HandshakeMessage.ClientHello.toObject(message.clientHello, options);
            if (message.serverHello != null && message.hasOwnProperty("serverHello"))
                object.serverHello = $root.WAWa6.HandshakeMessage.ServerHello.toObject(message.serverHello, options);
            if (message.clientFinish != null && message.hasOwnProperty("clientFinish"))
                object.clientFinish = $root.WAWa6.HandshakeMessage.ClientFinish.toObject(message.clientFinish, options);
            return object;
        };

        /**
         * Converts this HandshakeMessage to JSON.
         * @function toJSON
         * @memberof WAWa6.HandshakeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HandshakeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HandshakeMessage
         * @function getTypeUrl
         * @memberof WAWa6.HandshakeMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HandshakeMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWa6.HandshakeMessage";
        };

        HandshakeMessage.ClientFinish = (function() {

            /**
             * Properties of a ClientFinish.
             * @memberof WAWa6.HandshakeMessage
             * @interface IClientFinish
             * @property {Uint8Array|null} ["static"] ClientFinish static
             * @property {Uint8Array|null} [payload] ClientFinish payload
             */

            /**
             * Constructs a new ClientFinish.
             * @memberof WAWa6.HandshakeMessage
             * @classdesc Represents a ClientFinish.
             * @implements IClientFinish
             * @constructor
             * @param {WAWa6.HandshakeMessage.IClientFinish=} [properties] Properties to set
             */
            function ClientFinish(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ClientFinish static.
             * @member {Uint8Array} static
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @instance
             */
            ClientFinish.prototype["static"] = $util.newBuffer([]);

            /**
             * ClientFinish payload.
             * @member {Uint8Array} payload
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @instance
             */
            ClientFinish.prototype.payload = $util.newBuffer([]);

            /**
             * Creates a new ClientFinish instance using the specified properties.
             * @function create
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {WAWa6.HandshakeMessage.IClientFinish=} [properties] Properties to set
             * @returns {WAWa6.HandshakeMessage.ClientFinish} ClientFinish instance
             */
            ClientFinish.create = function create(properties) {
                return new ClientFinish(properties);
            };

            /**
             * Encodes the specified ClientFinish message. Does not implicitly {@link WAWa6.HandshakeMessage.ClientFinish.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {WAWa6.HandshakeMessage.IClientFinish} message ClientFinish message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientFinish.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message["static"]);
                if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.payload);
                return writer;
            };

            /**
             * Encodes the specified ClientFinish message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ClientFinish.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {WAWa6.HandshakeMessage.IClientFinish} message ClientFinish message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientFinish.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClientFinish message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.HandshakeMessage.ClientFinish} ClientFinish
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientFinish.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.HandshakeMessage.ClientFinish();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message["static"] = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.payload = reader.bytes();
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
             * Decodes a ClientFinish message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.HandshakeMessage.ClientFinish} ClientFinish
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientFinish.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClientFinish message.
             * @function verify
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClientFinish.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message["static"] != null && message.hasOwnProperty("static"))
                    if (!(message["static"] && typeof message["static"].length === "number" || $util.isString(message["static"])))
                        return "static: buffer expected";
                if (message.payload != null && message.hasOwnProperty("payload"))
                    if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                        return "payload: buffer expected";
                return null;
            };

            /**
             * Creates a ClientFinish message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.HandshakeMessage.ClientFinish} ClientFinish
             */
            ClientFinish.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.HandshakeMessage.ClientFinish)
                    return object;
                var message = new $root.WAWa6.HandshakeMessage.ClientFinish();
                if (object["static"] != null)
                    if (typeof object["static"] === "string")
                        $util.base64.decode(object["static"], message["static"] = $util.newBuffer($util.base64.length(object["static"])), 0);
                    else if (object["static"].length >= 0)
                        message["static"] = object["static"];
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length >= 0)
                        message.payload = object.payload;
                return message;
            };

            /**
             * Creates a plain object from a ClientFinish message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {WAWa6.HandshakeMessage.ClientFinish} message ClientFinish
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClientFinish.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object["static"] = "";
                    else {
                        object["static"] = [];
                        if (options.bytes !== Array)
                            object["static"] = $util.newBuffer(object["static"]);
                    }
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                }
                if (message["static"] != null && message.hasOwnProperty("static"))
                    object["static"] = options.bytes === String ? $util.base64.encode(message["static"], 0, message["static"].length) : options.bytes === Array ? Array.prototype.slice.call(message["static"]) : message["static"];
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                return object;
            };

            /**
             * Converts this ClientFinish to JSON.
             * @function toJSON
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClientFinish.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClientFinish
             * @function getTypeUrl
             * @memberof WAWa6.HandshakeMessage.ClientFinish
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClientFinish.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.HandshakeMessage.ClientFinish";
            };

            return ClientFinish;
        })();

        HandshakeMessage.ServerHello = (function() {

            /**
             * Properties of a ServerHello.
             * @memberof WAWa6.HandshakeMessage
             * @interface IServerHello
             * @property {Uint8Array|null} [ephemeral] ServerHello ephemeral
             * @property {Uint8Array|null} ["static"] ServerHello static
             * @property {Uint8Array|null} [payload] ServerHello payload
             */

            /**
             * Constructs a new ServerHello.
             * @memberof WAWa6.HandshakeMessage
             * @classdesc Represents a ServerHello.
             * @implements IServerHello
             * @constructor
             * @param {WAWa6.HandshakeMessage.IServerHello=} [properties] Properties to set
             */
            function ServerHello(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServerHello ephemeral.
             * @member {Uint8Array} ephemeral
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @instance
             */
            ServerHello.prototype.ephemeral = $util.newBuffer([]);

            /**
             * ServerHello static.
             * @member {Uint8Array} static
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @instance
             */
            ServerHello.prototype["static"] = $util.newBuffer([]);

            /**
             * ServerHello payload.
             * @member {Uint8Array} payload
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @instance
             */
            ServerHello.prototype.payload = $util.newBuffer([]);

            /**
             * Creates a new ServerHello instance using the specified properties.
             * @function create
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {WAWa6.HandshakeMessage.IServerHello=} [properties] Properties to set
             * @returns {WAWa6.HandshakeMessage.ServerHello} ServerHello instance
             */
            ServerHello.create = function create(properties) {
                return new ServerHello(properties);
            };

            /**
             * Encodes the specified ServerHello message. Does not implicitly {@link WAWa6.HandshakeMessage.ServerHello.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {WAWa6.HandshakeMessage.IServerHello} message ServerHello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerHello.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ephemeral != null && Object.hasOwnProperty.call(message, "ephemeral"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ephemeral);
                if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message["static"]);
                if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.payload);
                return writer;
            };

            /**
             * Encodes the specified ServerHello message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ServerHello.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {WAWa6.HandshakeMessage.IServerHello} message ServerHello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerHello.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServerHello message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.HandshakeMessage.ServerHello} ServerHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerHello.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.HandshakeMessage.ServerHello();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.ephemeral = reader.bytes();
                            break;
                        }
                    case 2: {
                            message["static"] = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.payload = reader.bytes();
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
             * Decodes a ServerHello message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.HandshakeMessage.ServerHello} ServerHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerHello.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerHello message.
             * @function verify
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerHello.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.ephemeral != null && message.hasOwnProperty("ephemeral"))
                    if (!(message.ephemeral && typeof message.ephemeral.length === "number" || $util.isString(message.ephemeral)))
                        return "ephemeral: buffer expected";
                if (message["static"] != null && message.hasOwnProperty("static"))
                    if (!(message["static"] && typeof message["static"].length === "number" || $util.isString(message["static"])))
                        return "static: buffer expected";
                if (message.payload != null && message.hasOwnProperty("payload"))
                    if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                        return "payload: buffer expected";
                return null;
            };

            /**
             * Creates a ServerHello message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.HandshakeMessage.ServerHello} ServerHello
             */
            ServerHello.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.HandshakeMessage.ServerHello)
                    return object;
                var message = new $root.WAWa6.HandshakeMessage.ServerHello();
                if (object.ephemeral != null)
                    if (typeof object.ephemeral === "string")
                        $util.base64.decode(object.ephemeral, message.ephemeral = $util.newBuffer($util.base64.length(object.ephemeral)), 0);
                    else if (object.ephemeral.length >= 0)
                        message.ephemeral = object.ephemeral;
                if (object["static"] != null)
                    if (typeof object["static"] === "string")
                        $util.base64.decode(object["static"], message["static"] = $util.newBuffer($util.base64.length(object["static"])), 0);
                    else if (object["static"].length >= 0)
                        message["static"] = object["static"];
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length >= 0)
                        message.payload = object.payload;
                return message;
            };

            /**
             * Creates a plain object from a ServerHello message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {WAWa6.HandshakeMessage.ServerHello} message ServerHello
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerHello.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.ephemeral = "";
                    else {
                        object.ephemeral = [];
                        if (options.bytes !== Array)
                            object.ephemeral = $util.newBuffer(object.ephemeral);
                    }
                    if (options.bytes === String)
                        object["static"] = "";
                    else {
                        object["static"] = [];
                        if (options.bytes !== Array)
                            object["static"] = $util.newBuffer(object["static"]);
                    }
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                }
                if (message.ephemeral != null && message.hasOwnProperty("ephemeral"))
                    object.ephemeral = options.bytes === String ? $util.base64.encode(message.ephemeral, 0, message.ephemeral.length) : options.bytes === Array ? Array.prototype.slice.call(message.ephemeral) : message.ephemeral;
                if (message["static"] != null && message.hasOwnProperty("static"))
                    object["static"] = options.bytes === String ? $util.base64.encode(message["static"], 0, message["static"].length) : options.bytes === Array ? Array.prototype.slice.call(message["static"]) : message["static"];
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                return object;
            };

            /**
             * Converts this ServerHello to JSON.
             * @function toJSON
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerHello.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ServerHello
             * @function getTypeUrl
             * @memberof WAWa6.HandshakeMessage.ServerHello
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ServerHello.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.HandshakeMessage.ServerHello";
            };

            return ServerHello;
        })();

        HandshakeMessage.ClientHello = (function() {

            /**
             * Properties of a ClientHello.
             * @memberof WAWa6.HandshakeMessage
             * @interface IClientHello
             * @property {Uint8Array|null} [ephemeral] ClientHello ephemeral
             * @property {Uint8Array|null} ["static"] ClientHello static
             * @property {Uint8Array|null} [payload] ClientHello payload
             */

            /**
             * Constructs a new ClientHello.
             * @memberof WAWa6.HandshakeMessage
             * @classdesc Represents a ClientHello.
             * @implements IClientHello
             * @constructor
             * @param {WAWa6.HandshakeMessage.IClientHello=} [properties] Properties to set
             */
            function ClientHello(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ClientHello ephemeral.
             * @member {Uint8Array} ephemeral
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @instance
             */
            ClientHello.prototype.ephemeral = $util.newBuffer([]);

            /**
             * ClientHello static.
             * @member {Uint8Array} static
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @instance
             */
            ClientHello.prototype["static"] = $util.newBuffer([]);

            /**
             * ClientHello payload.
             * @member {Uint8Array} payload
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @instance
             */
            ClientHello.prototype.payload = $util.newBuffer([]);

            /**
             * Creates a new ClientHello instance using the specified properties.
             * @function create
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {WAWa6.HandshakeMessage.IClientHello=} [properties] Properties to set
             * @returns {WAWa6.HandshakeMessage.ClientHello} ClientHello instance
             */
            ClientHello.create = function create(properties) {
                return new ClientHello(properties);
            };

            /**
             * Encodes the specified ClientHello message. Does not implicitly {@link WAWa6.HandshakeMessage.ClientHello.verify|verify} messages.
             * @function encode
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {WAWa6.HandshakeMessage.IClientHello} message ClientHello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientHello.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ephemeral != null && Object.hasOwnProperty.call(message, "ephemeral"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ephemeral);
                if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message["static"]);
                if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.payload);
                return writer;
            };

            /**
             * Encodes the specified ClientHello message, length delimited. Does not implicitly {@link WAWa6.HandshakeMessage.ClientHello.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {WAWa6.HandshakeMessage.IClientHello} message ClientHello message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientHello.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClientHello message from the specified reader or buffer.
             * @function decode
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWa6.HandshakeMessage.ClientHello} ClientHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientHello.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWa6.HandshakeMessage.ClientHello();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.ephemeral = reader.bytes();
                            break;
                        }
                    case 2: {
                            message["static"] = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.payload = reader.bytes();
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
             * Decodes a ClientHello message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWa6.HandshakeMessage.ClientHello} ClientHello
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientHello.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClientHello message.
             * @function verify
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClientHello.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.ephemeral != null && message.hasOwnProperty("ephemeral"))
                    if (!(message.ephemeral && typeof message.ephemeral.length === "number" || $util.isString(message.ephemeral)))
                        return "ephemeral: buffer expected";
                if (message["static"] != null && message.hasOwnProperty("static"))
                    if (!(message["static"] && typeof message["static"].length === "number" || $util.isString(message["static"])))
                        return "static: buffer expected";
                if (message.payload != null && message.hasOwnProperty("payload"))
                    if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                        return "payload: buffer expected";
                return null;
            };

            /**
             * Creates a ClientHello message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWa6.HandshakeMessage.ClientHello} ClientHello
             */
            ClientHello.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWa6.HandshakeMessage.ClientHello)
                    return object;
                var message = new $root.WAWa6.HandshakeMessage.ClientHello();
                if (object.ephemeral != null)
                    if (typeof object.ephemeral === "string")
                        $util.base64.decode(object.ephemeral, message.ephemeral = $util.newBuffer($util.base64.length(object.ephemeral)), 0);
                    else if (object.ephemeral.length >= 0)
                        message.ephemeral = object.ephemeral;
                if (object["static"] != null)
                    if (typeof object["static"] === "string")
                        $util.base64.decode(object["static"], message["static"] = $util.newBuffer($util.base64.length(object["static"])), 0);
                    else if (object["static"].length >= 0)
                        message["static"] = object["static"];
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length >= 0)
                        message.payload = object.payload;
                return message;
            };

            /**
             * Creates a plain object from a ClientHello message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {WAWa6.HandshakeMessage.ClientHello} message ClientHello
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClientHello.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.ephemeral = "";
                    else {
                        object.ephemeral = [];
                        if (options.bytes !== Array)
                            object.ephemeral = $util.newBuffer(object.ephemeral);
                    }
                    if (options.bytes === String)
                        object["static"] = "";
                    else {
                        object["static"] = [];
                        if (options.bytes !== Array)
                            object["static"] = $util.newBuffer(object["static"]);
                    }
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                }
                if (message.ephemeral != null && message.hasOwnProperty("ephemeral"))
                    object.ephemeral = options.bytes === String ? $util.base64.encode(message.ephemeral, 0, message.ephemeral.length) : options.bytes === Array ? Array.prototype.slice.call(message.ephemeral) : message.ephemeral;
                if (message["static"] != null && message.hasOwnProperty("static"))
                    object["static"] = options.bytes === String ? $util.base64.encode(message["static"], 0, message["static"].length) : options.bytes === Array ? Array.prototype.slice.call(message["static"]) : message["static"];
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                return object;
            };

            /**
             * Converts this ClientHello to JSON.
             * @function toJSON
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClientHello.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClientHello
             * @function getTypeUrl
             * @memberof WAWa6.HandshakeMessage.ClientHello
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClientHello.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWa6.HandshakeMessage.ClientHello";
            };

            return ClientHello;
        })();

        return HandshakeMessage;
    })();

    return WAWa6;
})();

module.exports = $root;
