/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAVnameCert = (function() {

    /**
     * Namespace WAVnameCert.
     * @exports WAVnameCert
     * @namespace
     */
    var WAVnameCert = {};

    WAVnameCert.BizAccountLinkInfo = (function() {

        /**
         * Properties of a BizAccountLinkInfo.
         * @memberof WAVnameCert
         * @interface IBizAccountLinkInfo
         * @property {number|Long|null} [whatsappBizAcctFbid] BizAccountLinkInfo whatsappBizAcctFbid
         * @property {string|null} [whatsappAcctNumber] BizAccountLinkInfo whatsappAcctNumber
         * @property {number|Long|null} [issueTime] BizAccountLinkInfo issueTime
         * @property {WAVnameCert.BizAccountLinkInfo.HostStorageType|null} [hostStorage] BizAccountLinkInfo hostStorage
         * @property {WAVnameCert.BizAccountLinkInfo.AccountType|null} [accountType] BizAccountLinkInfo accountType
         */

        /**
         * Constructs a new BizAccountLinkInfo.
         * @memberof WAVnameCert
         * @classdesc Represents a BizAccountLinkInfo.
         * @implements IBizAccountLinkInfo
         * @constructor
         * @param {WAVnameCert.IBizAccountLinkInfo=} [properties] Properties to set
         */
        function BizAccountLinkInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BizAccountLinkInfo whatsappBizAcctFbid.
         * @member {number|Long} whatsappBizAcctFbid
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         */
        BizAccountLinkInfo.prototype.whatsappBizAcctFbid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * BizAccountLinkInfo whatsappAcctNumber.
         * @member {string} whatsappAcctNumber
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         */
        BizAccountLinkInfo.prototype.whatsappAcctNumber = "";

        /**
         * BizAccountLinkInfo issueTime.
         * @member {number|Long} issueTime
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         */
        BizAccountLinkInfo.prototype.issueTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * BizAccountLinkInfo hostStorage.
         * @member {WAVnameCert.BizAccountLinkInfo.HostStorageType} hostStorage
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         */
        BizAccountLinkInfo.prototype.hostStorage = 0;

        /**
         * BizAccountLinkInfo accountType.
         * @member {WAVnameCert.BizAccountLinkInfo.AccountType} accountType
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         */
        BizAccountLinkInfo.prototype.accountType = 0;

        /**
         * Creates a new BizAccountLinkInfo instance using the specified properties.
         * @function create
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {WAVnameCert.IBizAccountLinkInfo=} [properties] Properties to set
         * @returns {WAVnameCert.BizAccountLinkInfo} BizAccountLinkInfo instance
         */
        BizAccountLinkInfo.create = function create(properties) {
            return new BizAccountLinkInfo(properties);
        };

        /**
         * Encodes the specified BizAccountLinkInfo message. Does not implicitly {@link WAVnameCert.BizAccountLinkInfo.verify|verify} messages.
         * @function encode
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {WAVnameCert.IBizAccountLinkInfo} message BizAccountLinkInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizAccountLinkInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.whatsappBizAcctFbid != null && Object.hasOwnProperty.call(message, "whatsappBizAcctFbid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.whatsappBizAcctFbid);
            if (message.whatsappAcctNumber != null && Object.hasOwnProperty.call(message, "whatsappAcctNumber"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.whatsappAcctNumber);
            if (message.issueTime != null && Object.hasOwnProperty.call(message, "issueTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.issueTime);
            if (message.hostStorage != null && Object.hasOwnProperty.call(message, "hostStorage"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.hostStorage);
            if (message.accountType != null && Object.hasOwnProperty.call(message, "accountType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.accountType);
            return writer;
        };

        /**
         * Encodes the specified BizAccountLinkInfo message, length delimited. Does not implicitly {@link WAVnameCert.BizAccountLinkInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {WAVnameCert.IBizAccountLinkInfo} message BizAccountLinkInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizAccountLinkInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BizAccountLinkInfo message from the specified reader or buffer.
         * @function decode
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAVnameCert.BizAccountLinkInfo} BizAccountLinkInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizAccountLinkInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.BizAccountLinkInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.whatsappBizAcctFbid = reader.uint64();
                        break;
                    }
                case 2: {
                        message.whatsappAcctNumber = reader.string();
                        break;
                    }
                case 3: {
                        message.issueTime = reader.uint64();
                        break;
                    }
                case 4: {
                        message.hostStorage = reader.int32();
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
         * Decodes a BizAccountLinkInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAVnameCert.BizAccountLinkInfo} BizAccountLinkInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizAccountLinkInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BizAccountLinkInfo message.
         * @function verify
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BizAccountLinkInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.whatsappBizAcctFbid != null && message.hasOwnProperty("whatsappBizAcctFbid"))
                if (!$util.isInteger(message.whatsappBizAcctFbid) && !(message.whatsappBizAcctFbid && $util.isInteger(message.whatsappBizAcctFbid.low) && $util.isInteger(message.whatsappBizAcctFbid.high)))
                    return "whatsappBizAcctFbid: integer|Long expected";
            if (message.whatsappAcctNumber != null && message.hasOwnProperty("whatsappAcctNumber"))
                if (!$util.isString(message.whatsappAcctNumber))
                    return "whatsappAcctNumber: string expected";
            if (message.issueTime != null && message.hasOwnProperty("issueTime"))
                if (!$util.isInteger(message.issueTime) && !(message.issueTime && $util.isInteger(message.issueTime.low) && $util.isInteger(message.issueTime.high)))
                    return "issueTime: integer|Long expected";
            if (message.hostStorage != null && message.hasOwnProperty("hostStorage"))
                switch (message.hostStorage) {
                default:
                    return "hostStorage: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                switch (message.accountType) {
                default:
                    return "accountType: enum value expected";
                case 0:
                    break;
                }
            return null;
        };

        /**
         * Creates a BizAccountLinkInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAVnameCert.BizAccountLinkInfo} BizAccountLinkInfo
         */
        BizAccountLinkInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.WAVnameCert.BizAccountLinkInfo)
                return object;
            var message = new $root.WAVnameCert.BizAccountLinkInfo();
            if (object.whatsappBizAcctFbid != null)
                if ($util.Long)
                    (message.whatsappBizAcctFbid = $util.Long.fromValue(object.whatsappBizAcctFbid)).unsigned = true;
                else if (typeof object.whatsappBizAcctFbid === "string")
                    message.whatsappBizAcctFbid = parseInt(object.whatsappBizAcctFbid, 10);
                else if (typeof object.whatsappBizAcctFbid === "number")
                    message.whatsappBizAcctFbid = object.whatsappBizAcctFbid;
                else if (typeof object.whatsappBizAcctFbid === "object")
                    message.whatsappBizAcctFbid = new $util.LongBits(object.whatsappBizAcctFbid.low >>> 0, object.whatsappBizAcctFbid.high >>> 0).toNumber(true);
            if (object.whatsappAcctNumber != null)
                message.whatsappAcctNumber = String(object.whatsappAcctNumber);
            if (object.issueTime != null)
                if ($util.Long)
                    (message.issueTime = $util.Long.fromValue(object.issueTime)).unsigned = true;
                else if (typeof object.issueTime === "string")
                    message.issueTime = parseInt(object.issueTime, 10);
                else if (typeof object.issueTime === "number")
                    message.issueTime = object.issueTime;
                else if (typeof object.issueTime === "object")
                    message.issueTime = new $util.LongBits(object.issueTime.low >>> 0, object.issueTime.high >>> 0).toNumber(true);
            switch (object.hostStorage) {
            default:
                if (typeof object.hostStorage === "number") {
                    message.hostStorage = object.hostStorage;
                    break;
                }
                break;
            case "ON_PREMISE":
            case 0:
                message.hostStorage = 0;
                break;
            case "FACEBOOK":
            case 1:
                message.hostStorage = 1;
                break;
            }
            switch (object.accountType) {
            default:
                if (typeof object.accountType === "number") {
                    message.accountType = object.accountType;
                    break;
                }
                break;
            case "ENTERPRISE":
            case 0:
                message.accountType = 0;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a BizAccountLinkInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {WAVnameCert.BizAccountLinkInfo} message BizAccountLinkInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BizAccountLinkInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.whatsappBizAcctFbid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.whatsappBizAcctFbid = options.longs === String ? "0" : 0;
                object.whatsappAcctNumber = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.issueTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.issueTime = options.longs === String ? "0" : 0;
                object.hostStorage = options.enums === String ? "ON_PREMISE" : 0;
                object.accountType = options.enums === String ? "ENTERPRISE" : 0;
            }
            if (message.whatsappBizAcctFbid != null && message.hasOwnProperty("whatsappBizAcctFbid"))
                if (typeof message.whatsappBizAcctFbid === "number")
                    object.whatsappBizAcctFbid = options.longs === String ? String(message.whatsappBizAcctFbid) : message.whatsappBizAcctFbid;
                else
                    object.whatsappBizAcctFbid = options.longs === String ? $util.Long.prototype.toString.call(message.whatsappBizAcctFbid) : options.longs === Number ? new $util.LongBits(message.whatsappBizAcctFbid.low >>> 0, message.whatsappBizAcctFbid.high >>> 0).toNumber(true) : message.whatsappBizAcctFbid;
            if (message.whatsappAcctNumber != null && message.hasOwnProperty("whatsappAcctNumber"))
                object.whatsappAcctNumber = message.whatsappAcctNumber;
            if (message.issueTime != null && message.hasOwnProperty("issueTime"))
                if (typeof message.issueTime === "number")
                    object.issueTime = options.longs === String ? String(message.issueTime) : message.issueTime;
                else
                    object.issueTime = options.longs === String ? $util.Long.prototype.toString.call(message.issueTime) : options.longs === Number ? new $util.LongBits(message.issueTime.low >>> 0, message.issueTime.high >>> 0).toNumber(true) : message.issueTime;
            if (message.hostStorage != null && message.hasOwnProperty("hostStorage"))
                object.hostStorage = options.enums === String ? $root.WAVnameCert.BizAccountLinkInfo.HostStorageType[message.hostStorage] === undefined ? message.hostStorage : $root.WAVnameCert.BizAccountLinkInfo.HostStorageType[message.hostStorage] : message.hostStorage;
            if (message.accountType != null && message.hasOwnProperty("accountType"))
                object.accountType = options.enums === String ? $root.WAVnameCert.BizAccountLinkInfo.AccountType[message.accountType] === undefined ? message.accountType : $root.WAVnameCert.BizAccountLinkInfo.AccountType[message.accountType] : message.accountType;
            return object;
        };

        /**
         * Converts this BizAccountLinkInfo to JSON.
         * @function toJSON
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BizAccountLinkInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BizAccountLinkInfo
         * @function getTypeUrl
         * @memberof WAVnameCert.BizAccountLinkInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BizAccountLinkInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAVnameCert.BizAccountLinkInfo";
        };

        /**
         * AccountType enum.
         * @name WAVnameCert.BizAccountLinkInfo.AccountType
         * @enum {number}
         * @property {number} ENTERPRISE=0 ENTERPRISE value
         */
        BizAccountLinkInfo.AccountType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ENTERPRISE"] = 0;
            return values;
        })();

        /**
         * HostStorageType enum.
         * @name WAVnameCert.BizAccountLinkInfo.HostStorageType
         * @enum {number}
         * @property {number} ON_PREMISE=0 ON_PREMISE value
         * @property {number} FACEBOOK=1 FACEBOOK value
         */
        BizAccountLinkInfo.HostStorageType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ON_PREMISE"] = 0;
            values[valuesById[1] = "FACEBOOK"] = 1;
            return values;
        })();

        return BizAccountLinkInfo;
    })();

    WAVnameCert.BizIdentityInfo = (function() {

        /**
         * Properties of a BizIdentityInfo.
         * @memberof WAVnameCert
         * @interface IBizIdentityInfo
         * @property {WAVnameCert.BizIdentityInfo.VerifiedLevelValue|null} [vlevel] BizIdentityInfo vlevel
         * @property {WAVnameCert.IVerifiedNameCertificate|null} [vnameCert] BizIdentityInfo vnameCert
         * @property {boolean|null} [signed] BizIdentityInfo signed
         * @property {boolean|null} [revoked] BizIdentityInfo revoked
         * @property {WAVnameCert.BizIdentityInfo.HostStorageType|null} [hostStorage] BizIdentityInfo hostStorage
         * @property {WAVnameCert.BizIdentityInfo.ActualActorsType|null} [actualActors] BizIdentityInfo actualActors
         * @property {number|Long|null} [privacyModeTS] BizIdentityInfo privacyModeTS
         * @property {number|Long|null} [featureControls] BizIdentityInfo featureControls
         */

        /**
         * Constructs a new BizIdentityInfo.
         * @memberof WAVnameCert
         * @classdesc Represents a BizIdentityInfo.
         * @implements IBizIdentityInfo
         * @constructor
         * @param {WAVnameCert.IBizIdentityInfo=} [properties] Properties to set
         */
        function BizIdentityInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BizIdentityInfo vlevel.
         * @member {WAVnameCert.BizIdentityInfo.VerifiedLevelValue} vlevel
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.vlevel = 0;

        /**
         * BizIdentityInfo vnameCert.
         * @member {WAVnameCert.IVerifiedNameCertificate|null|undefined} vnameCert
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.vnameCert = null;

        /**
         * BizIdentityInfo signed.
         * @member {boolean} signed
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.signed = false;

        /**
         * BizIdentityInfo revoked.
         * @member {boolean} revoked
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.revoked = false;

        /**
         * BizIdentityInfo hostStorage.
         * @member {WAVnameCert.BizIdentityInfo.HostStorageType} hostStorage
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.hostStorage = 0;

        /**
         * BizIdentityInfo actualActors.
         * @member {WAVnameCert.BizIdentityInfo.ActualActorsType} actualActors
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.actualActors = 0;

        /**
         * BizIdentityInfo privacyModeTS.
         * @member {number|Long} privacyModeTS
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.privacyModeTS = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * BizIdentityInfo featureControls.
         * @member {number|Long} featureControls
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         */
        BizIdentityInfo.prototype.featureControls = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new BizIdentityInfo instance using the specified properties.
         * @function create
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {WAVnameCert.IBizIdentityInfo=} [properties] Properties to set
         * @returns {WAVnameCert.BizIdentityInfo} BizIdentityInfo instance
         */
        BizIdentityInfo.create = function create(properties) {
            return new BizIdentityInfo(properties);
        };

        /**
         * Encodes the specified BizIdentityInfo message. Does not implicitly {@link WAVnameCert.BizIdentityInfo.verify|verify} messages.
         * @function encode
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {WAVnameCert.IBizIdentityInfo} message BizIdentityInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizIdentityInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.vlevel != null && Object.hasOwnProperty.call(message, "vlevel"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.vlevel);
            if (message.vnameCert != null && Object.hasOwnProperty.call(message, "vnameCert"))
                $root.WAVnameCert.VerifiedNameCertificate.encode(message.vnameCert, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.signed != null && Object.hasOwnProperty.call(message, "signed"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.signed);
            if (message.revoked != null && Object.hasOwnProperty.call(message, "revoked"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.revoked);
            if (message.hostStorage != null && Object.hasOwnProperty.call(message, "hostStorage"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.hostStorage);
            if (message.actualActors != null && Object.hasOwnProperty.call(message, "actualActors"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.actualActors);
            if (message.privacyModeTS != null && Object.hasOwnProperty.call(message, "privacyModeTS"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.privacyModeTS);
            if (message.featureControls != null && Object.hasOwnProperty.call(message, "featureControls"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.featureControls);
            return writer;
        };

        /**
         * Encodes the specified BizIdentityInfo message, length delimited. Does not implicitly {@link WAVnameCert.BizIdentityInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {WAVnameCert.IBizIdentityInfo} message BizIdentityInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizIdentityInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BizIdentityInfo message from the specified reader or buffer.
         * @function decode
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAVnameCert.BizIdentityInfo} BizIdentityInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizIdentityInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.BizIdentityInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.vlevel = reader.int32();
                        break;
                    }
                case 2: {
                        message.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.signed = reader.bool();
                        break;
                    }
                case 4: {
                        message.revoked = reader.bool();
                        break;
                    }
                case 5: {
                        message.hostStorage = reader.int32();
                        break;
                    }
                case 6: {
                        message.actualActors = reader.int32();
                        break;
                    }
                case 7: {
                        message.privacyModeTS = reader.uint64();
                        break;
                    }
                case 8: {
                        message.featureControls = reader.uint64();
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
         * Decodes a BizIdentityInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAVnameCert.BizIdentityInfo} BizIdentityInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizIdentityInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BizIdentityInfo message.
         * @function verify
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BizIdentityInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.vlevel != null && message.hasOwnProperty("vlevel"))
                switch (message.vlevel) {
                default:
                    return "vlevel: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.vnameCert != null && message.hasOwnProperty("vnameCert")) {
                var error = $root.WAVnameCert.VerifiedNameCertificate.verify(message.vnameCert);
                if (error)
                    return "vnameCert." + error;
            }
            if (message.signed != null && message.hasOwnProperty("signed"))
                if (typeof message.signed !== "boolean")
                    return "signed: boolean expected";
            if (message.revoked != null && message.hasOwnProperty("revoked"))
                if (typeof message.revoked !== "boolean")
                    return "revoked: boolean expected";
            if (message.hostStorage != null && message.hasOwnProperty("hostStorage"))
                switch (message.hostStorage) {
                default:
                    return "hostStorage: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.actualActors != null && message.hasOwnProperty("actualActors"))
                switch (message.actualActors) {
                default:
                    return "actualActors: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.privacyModeTS != null && message.hasOwnProperty("privacyModeTS"))
                if (!$util.isInteger(message.privacyModeTS) && !(message.privacyModeTS && $util.isInteger(message.privacyModeTS.low) && $util.isInteger(message.privacyModeTS.high)))
                    return "privacyModeTS: integer|Long expected";
            if (message.featureControls != null && message.hasOwnProperty("featureControls"))
                if (!$util.isInteger(message.featureControls) && !(message.featureControls && $util.isInteger(message.featureControls.low) && $util.isInteger(message.featureControls.high)))
                    return "featureControls: integer|Long expected";
            return null;
        };

        /**
         * Creates a BizIdentityInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAVnameCert.BizIdentityInfo} BizIdentityInfo
         */
        BizIdentityInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.WAVnameCert.BizIdentityInfo)
                return object;
            var message = new $root.WAVnameCert.BizIdentityInfo();
            switch (object.vlevel) {
            default:
                if (typeof object.vlevel === "number") {
                    message.vlevel = object.vlevel;
                    break;
                }
                break;
            case "UNKNOWN":
            case 0:
                message.vlevel = 0;
                break;
            case "LOW":
            case 1:
                message.vlevel = 1;
                break;
            case "HIGH":
            case 2:
                message.vlevel = 2;
                break;
            }
            if (object.vnameCert != null) {
                if (typeof object.vnameCert !== "object")
                    throw TypeError(".WAVnameCert.BizIdentityInfo.vnameCert: object expected");
                message.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.fromObject(object.vnameCert);
            }
            if (object.signed != null)
                message.signed = Boolean(object.signed);
            if (object.revoked != null)
                message.revoked = Boolean(object.revoked);
            switch (object.hostStorage) {
            default:
                if (typeof object.hostStorage === "number") {
                    message.hostStorage = object.hostStorage;
                    break;
                }
                break;
            case "ON_PREMISE":
            case 0:
                message.hostStorage = 0;
                break;
            case "FACEBOOK":
            case 1:
                message.hostStorage = 1;
                break;
            }
            switch (object.actualActors) {
            default:
                if (typeof object.actualActors === "number") {
                    message.actualActors = object.actualActors;
                    break;
                }
                break;
            case "SELF":
            case 0:
                message.actualActors = 0;
                break;
            case "BSP":
            case 1:
                message.actualActors = 1;
                break;
            }
            if (object.privacyModeTS != null)
                if ($util.Long)
                    (message.privacyModeTS = $util.Long.fromValue(object.privacyModeTS)).unsigned = true;
                else if (typeof object.privacyModeTS === "string")
                    message.privacyModeTS = parseInt(object.privacyModeTS, 10);
                else if (typeof object.privacyModeTS === "number")
                    message.privacyModeTS = object.privacyModeTS;
                else if (typeof object.privacyModeTS === "object")
                    message.privacyModeTS = new $util.LongBits(object.privacyModeTS.low >>> 0, object.privacyModeTS.high >>> 0).toNumber(true);
            if (object.featureControls != null)
                if ($util.Long)
                    (message.featureControls = $util.Long.fromValue(object.featureControls)).unsigned = true;
                else if (typeof object.featureControls === "string")
                    message.featureControls = parseInt(object.featureControls, 10);
                else if (typeof object.featureControls === "number")
                    message.featureControls = object.featureControls;
                else if (typeof object.featureControls === "object")
                    message.featureControls = new $util.LongBits(object.featureControls.low >>> 0, object.featureControls.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a BizIdentityInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {WAVnameCert.BizIdentityInfo} message BizIdentityInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BizIdentityInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.vlevel = options.enums === String ? "UNKNOWN" : 0;
                object.vnameCert = null;
                object.signed = false;
                object.revoked = false;
                object.hostStorage = options.enums === String ? "ON_PREMISE" : 0;
                object.actualActors = options.enums === String ? "SELF" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.privacyModeTS = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.privacyModeTS = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.featureControls = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.featureControls = options.longs === String ? "0" : 0;
            }
            if (message.vlevel != null && message.hasOwnProperty("vlevel"))
                object.vlevel = options.enums === String ? $root.WAVnameCert.BizIdentityInfo.VerifiedLevelValue[message.vlevel] === undefined ? message.vlevel : $root.WAVnameCert.BizIdentityInfo.VerifiedLevelValue[message.vlevel] : message.vlevel;
            if (message.vnameCert != null && message.hasOwnProperty("vnameCert"))
                object.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.toObject(message.vnameCert, options);
            if (message.signed != null && message.hasOwnProperty("signed"))
                object.signed = message.signed;
            if (message.revoked != null && message.hasOwnProperty("revoked"))
                object.revoked = message.revoked;
            if (message.hostStorage != null && message.hasOwnProperty("hostStorage"))
                object.hostStorage = options.enums === String ? $root.WAVnameCert.BizIdentityInfo.HostStorageType[message.hostStorage] === undefined ? message.hostStorage : $root.WAVnameCert.BizIdentityInfo.HostStorageType[message.hostStorage] : message.hostStorage;
            if (message.actualActors != null && message.hasOwnProperty("actualActors"))
                object.actualActors = options.enums === String ? $root.WAVnameCert.BizIdentityInfo.ActualActorsType[message.actualActors] === undefined ? message.actualActors : $root.WAVnameCert.BizIdentityInfo.ActualActorsType[message.actualActors] : message.actualActors;
            if (message.privacyModeTS != null && message.hasOwnProperty("privacyModeTS"))
                if (typeof message.privacyModeTS === "number")
                    object.privacyModeTS = options.longs === String ? String(message.privacyModeTS) : message.privacyModeTS;
                else
                    object.privacyModeTS = options.longs === String ? $util.Long.prototype.toString.call(message.privacyModeTS) : options.longs === Number ? new $util.LongBits(message.privacyModeTS.low >>> 0, message.privacyModeTS.high >>> 0).toNumber(true) : message.privacyModeTS;
            if (message.featureControls != null && message.hasOwnProperty("featureControls"))
                if (typeof message.featureControls === "number")
                    object.featureControls = options.longs === String ? String(message.featureControls) : message.featureControls;
                else
                    object.featureControls = options.longs === String ? $util.Long.prototype.toString.call(message.featureControls) : options.longs === Number ? new $util.LongBits(message.featureControls.low >>> 0, message.featureControls.high >>> 0).toNumber(true) : message.featureControls;
            return object;
        };

        /**
         * Converts this BizIdentityInfo to JSON.
         * @function toJSON
         * @memberof WAVnameCert.BizIdentityInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BizIdentityInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BizIdentityInfo
         * @function getTypeUrl
         * @memberof WAVnameCert.BizIdentityInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BizIdentityInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAVnameCert.BizIdentityInfo";
        };

        /**
         * ActualActorsType enum.
         * @name WAVnameCert.BizIdentityInfo.ActualActorsType
         * @enum {number}
         * @property {number} SELF=0 SELF value
         * @property {number} BSP=1 BSP value
         */
        BizIdentityInfo.ActualActorsType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SELF"] = 0;
            values[valuesById[1] = "BSP"] = 1;
            return values;
        })();

        /**
         * HostStorageType enum.
         * @name WAVnameCert.BizIdentityInfo.HostStorageType
         * @enum {number}
         * @property {number} ON_PREMISE=0 ON_PREMISE value
         * @property {number} FACEBOOK=1 FACEBOOK value
         */
        BizIdentityInfo.HostStorageType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ON_PREMISE"] = 0;
            values[valuesById[1] = "FACEBOOK"] = 1;
            return values;
        })();

        /**
         * VerifiedLevelValue enum.
         * @name WAVnameCert.BizIdentityInfo.VerifiedLevelValue
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} LOW=1 LOW value
         * @property {number} HIGH=2 HIGH value
         */
        BizIdentityInfo.VerifiedLevelValue = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "LOW"] = 1;
            values[valuesById[2] = "HIGH"] = 2;
            return values;
        })();

        return BizIdentityInfo;
    })();

    WAVnameCert.LocalizedName = (function() {

        /**
         * Properties of a LocalizedName.
         * @memberof WAVnameCert
         * @interface ILocalizedName
         * @property {string|null} [lg] LocalizedName lg
         * @property {string|null} [lc] LocalizedName lc
         * @property {string|null} [verifiedName] LocalizedName verifiedName
         */

        /**
         * Constructs a new LocalizedName.
         * @memberof WAVnameCert
         * @classdesc Represents a LocalizedName.
         * @implements ILocalizedName
         * @constructor
         * @param {WAVnameCert.ILocalizedName=} [properties] Properties to set
         */
        function LocalizedName(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LocalizedName lg.
         * @member {string} lg
         * @memberof WAVnameCert.LocalizedName
         * @instance
         */
        LocalizedName.prototype.lg = "";

        /**
         * LocalizedName lc.
         * @member {string} lc
         * @memberof WAVnameCert.LocalizedName
         * @instance
         */
        LocalizedName.prototype.lc = "";

        /**
         * LocalizedName verifiedName.
         * @member {string} verifiedName
         * @memberof WAVnameCert.LocalizedName
         * @instance
         */
        LocalizedName.prototype.verifiedName = "";

        /**
         * Creates a new LocalizedName instance using the specified properties.
         * @function create
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {WAVnameCert.ILocalizedName=} [properties] Properties to set
         * @returns {WAVnameCert.LocalizedName} LocalizedName instance
         */
        LocalizedName.create = function create(properties) {
            return new LocalizedName(properties);
        };

        /**
         * Encodes the specified LocalizedName message. Does not implicitly {@link WAVnameCert.LocalizedName.verify|verify} messages.
         * @function encode
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {WAVnameCert.ILocalizedName} message LocalizedName message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocalizedName.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lg != null && Object.hasOwnProperty.call(message, "lg"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.lg);
            if (message.lc != null && Object.hasOwnProperty.call(message, "lc"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.lc);
            if (message.verifiedName != null && Object.hasOwnProperty.call(message, "verifiedName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.verifiedName);
            return writer;
        };

        /**
         * Encodes the specified LocalizedName message, length delimited. Does not implicitly {@link WAVnameCert.LocalizedName.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {WAVnameCert.ILocalizedName} message LocalizedName message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocalizedName.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LocalizedName message from the specified reader or buffer.
         * @function decode
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAVnameCert.LocalizedName} LocalizedName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocalizedName.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.LocalizedName();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.lg = reader.string();
                        break;
                    }
                case 2: {
                        message.lc = reader.string();
                        break;
                    }
                case 3: {
                        message.verifiedName = reader.string();
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
         * Decodes a LocalizedName message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAVnameCert.LocalizedName} LocalizedName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocalizedName.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LocalizedName message.
         * @function verify
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LocalizedName.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lg != null && message.hasOwnProperty("lg"))
                if (!$util.isString(message.lg))
                    return "lg: string expected";
            if (message.lc != null && message.hasOwnProperty("lc"))
                if (!$util.isString(message.lc))
                    return "lc: string expected";
            if (message.verifiedName != null && message.hasOwnProperty("verifiedName"))
                if (!$util.isString(message.verifiedName))
                    return "verifiedName: string expected";
            return null;
        };

        /**
         * Creates a LocalizedName message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAVnameCert.LocalizedName} LocalizedName
         */
        LocalizedName.fromObject = function fromObject(object) {
            if (object instanceof $root.WAVnameCert.LocalizedName)
                return object;
            var message = new $root.WAVnameCert.LocalizedName();
            if (object.lg != null)
                message.lg = String(object.lg);
            if (object.lc != null)
                message.lc = String(object.lc);
            if (object.verifiedName != null)
                message.verifiedName = String(object.verifiedName);
            return message;
        };

        /**
         * Creates a plain object from a LocalizedName message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {WAVnameCert.LocalizedName} message LocalizedName
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LocalizedName.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.lg = "";
                object.lc = "";
                object.verifiedName = "";
            }
            if (message.lg != null && message.hasOwnProperty("lg"))
                object.lg = message.lg;
            if (message.lc != null && message.hasOwnProperty("lc"))
                object.lc = message.lc;
            if (message.verifiedName != null && message.hasOwnProperty("verifiedName"))
                object.verifiedName = message.verifiedName;
            return object;
        };

        /**
         * Converts this LocalizedName to JSON.
         * @function toJSON
         * @memberof WAVnameCert.LocalizedName
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LocalizedName.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LocalizedName
         * @function getTypeUrl
         * @memberof WAVnameCert.LocalizedName
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LocalizedName.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAVnameCert.LocalizedName";
        };

        return LocalizedName;
    })();

    WAVnameCert.VerifiedNameCertificate = (function() {

        /**
         * Properties of a VerifiedNameCertificate.
         * @memberof WAVnameCert
         * @interface IVerifiedNameCertificate
         * @property {Uint8Array|null} [details] VerifiedNameCertificate details
         * @property {Uint8Array|null} [signature] VerifiedNameCertificate signature
         * @property {Uint8Array|null} [serverSignature] VerifiedNameCertificate serverSignature
         */

        /**
         * Constructs a new VerifiedNameCertificate.
         * @memberof WAVnameCert
         * @classdesc Represents a VerifiedNameCertificate.
         * @implements IVerifiedNameCertificate
         * @constructor
         * @param {WAVnameCert.IVerifiedNameCertificate=} [properties] Properties to set
         */
        function VerifiedNameCertificate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VerifiedNameCertificate details.
         * @member {Uint8Array} details
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @instance
         */
        VerifiedNameCertificate.prototype.details = $util.newBuffer([]);

        /**
         * VerifiedNameCertificate signature.
         * @member {Uint8Array} signature
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @instance
         */
        VerifiedNameCertificate.prototype.signature = $util.newBuffer([]);

        /**
         * VerifiedNameCertificate serverSignature.
         * @member {Uint8Array} serverSignature
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @instance
         */
        VerifiedNameCertificate.prototype.serverSignature = $util.newBuffer([]);

        /**
         * Creates a new VerifiedNameCertificate instance using the specified properties.
         * @function create
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {WAVnameCert.IVerifiedNameCertificate=} [properties] Properties to set
         * @returns {WAVnameCert.VerifiedNameCertificate} VerifiedNameCertificate instance
         */
        VerifiedNameCertificate.create = function create(properties) {
            return new VerifiedNameCertificate(properties);
        };

        /**
         * Encodes the specified VerifiedNameCertificate message. Does not implicitly {@link WAVnameCert.VerifiedNameCertificate.verify|verify} messages.
         * @function encode
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {WAVnameCert.IVerifiedNameCertificate} message VerifiedNameCertificate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VerifiedNameCertificate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.details);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
            if (message.serverSignature != null && Object.hasOwnProperty.call(message, "serverSignature"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.serverSignature);
            return writer;
        };

        /**
         * Encodes the specified VerifiedNameCertificate message, length delimited. Does not implicitly {@link WAVnameCert.VerifiedNameCertificate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {WAVnameCert.IVerifiedNameCertificate} message VerifiedNameCertificate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VerifiedNameCertificate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VerifiedNameCertificate message from the specified reader or buffer.
         * @function decode
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAVnameCert.VerifiedNameCertificate} VerifiedNameCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VerifiedNameCertificate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.VerifiedNameCertificate();
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
                case 3: {
                        message.serverSignature = reader.bytes();
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
         * Decodes a VerifiedNameCertificate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAVnameCert.VerifiedNameCertificate} VerifiedNameCertificate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VerifiedNameCertificate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VerifiedNameCertificate message.
         * @function verify
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VerifiedNameCertificate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details"))
                if (!(message.details && typeof message.details.length === "number" || $util.isString(message.details)))
                    return "details: buffer expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            if (message.serverSignature != null && message.hasOwnProperty("serverSignature"))
                if (!(message.serverSignature && typeof message.serverSignature.length === "number" || $util.isString(message.serverSignature)))
                    return "serverSignature: buffer expected";
            return null;
        };

        /**
         * Creates a VerifiedNameCertificate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAVnameCert.VerifiedNameCertificate} VerifiedNameCertificate
         */
        VerifiedNameCertificate.fromObject = function fromObject(object) {
            if (object instanceof $root.WAVnameCert.VerifiedNameCertificate)
                return object;
            var message = new $root.WAVnameCert.VerifiedNameCertificate();
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
            if (object.serverSignature != null)
                if (typeof object.serverSignature === "string")
                    $util.base64.decode(object.serverSignature, message.serverSignature = $util.newBuffer($util.base64.length(object.serverSignature)), 0);
                else if (object.serverSignature.length >= 0)
                    message.serverSignature = object.serverSignature;
            return message;
        };

        /**
         * Creates a plain object from a VerifiedNameCertificate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {WAVnameCert.VerifiedNameCertificate} message VerifiedNameCertificate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VerifiedNameCertificate.toObject = function toObject(message, options) {
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
                if (options.bytes === String)
                    object.serverSignature = "";
                else {
                    object.serverSignature = [];
                    if (options.bytes !== Array)
                        object.serverSignature = $util.newBuffer(object.serverSignature);
                }
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = options.bytes === String ? $util.base64.encode(message.details, 0, message.details.length) : options.bytes === Array ? Array.prototype.slice.call(message.details) : message.details;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            if (message.serverSignature != null && message.hasOwnProperty("serverSignature"))
                object.serverSignature = options.bytes === String ? $util.base64.encode(message.serverSignature, 0, message.serverSignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.serverSignature) : message.serverSignature;
            return object;
        };

        /**
         * Converts this VerifiedNameCertificate to JSON.
         * @function toJSON
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VerifiedNameCertificate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VerifiedNameCertificate
         * @function getTypeUrl
         * @memberof WAVnameCert.VerifiedNameCertificate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VerifiedNameCertificate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAVnameCert.VerifiedNameCertificate";
        };

        VerifiedNameCertificate.Details = (function() {

            /**
             * Properties of a Details.
             * @memberof WAVnameCert.VerifiedNameCertificate
             * @interface IDetails
             * @property {number|Long|null} [serial] Details serial
             * @property {string|null} [issuer] Details issuer
             * @property {string|null} [verifiedName] Details verifiedName
             * @property {Array.<WAVnameCert.ILocalizedName>|null} [localizedNames] Details localizedNames
             * @property {number|Long|null} [issueTime] Details issueTime
             */

            /**
             * Constructs a new Details.
             * @memberof WAVnameCert.VerifiedNameCertificate
             * @classdesc Represents a Details.
             * @implements IDetails
             * @constructor
             * @param {WAVnameCert.VerifiedNameCertificate.IDetails=} [properties] Properties to set
             */
            function Details(properties) {
                this.localizedNames = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Details serial.
             * @member {number|Long} serial
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             */
            Details.prototype.serial = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Details issuer.
             * @member {string} issuer
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             */
            Details.prototype.issuer = "";

            /**
             * Details verifiedName.
             * @member {string} verifiedName
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             */
            Details.prototype.verifiedName = "";

            /**
             * Details localizedNames.
             * @member {Array.<WAVnameCert.ILocalizedName>} localizedNames
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             */
            Details.prototype.localizedNames = $util.emptyArray;

            /**
             * Details issueTime.
             * @member {number|Long} issueTime
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             */
            Details.prototype.issueTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Details instance using the specified properties.
             * @function create
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {WAVnameCert.VerifiedNameCertificate.IDetails=} [properties] Properties to set
             * @returns {WAVnameCert.VerifiedNameCertificate.Details} Details instance
             */
            Details.create = function create(properties) {
                return new Details(properties);
            };

            /**
             * Encodes the specified Details message. Does not implicitly {@link WAVnameCert.VerifiedNameCertificate.Details.verify|verify} messages.
             * @function encode
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {WAVnameCert.VerifiedNameCertificate.IDetails} message Details message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Details.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.serial != null && Object.hasOwnProperty.call(message, "serial"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.serial);
                if (message.issuer != null && Object.hasOwnProperty.call(message, "issuer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.issuer);
                if (message.verifiedName != null && Object.hasOwnProperty.call(message, "verifiedName"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.verifiedName);
                if (message.localizedNames != null && message.localizedNames.length)
                    for (var i = 0; i < message.localizedNames.length; ++i)
                        $root.WAVnameCert.LocalizedName.encode(message.localizedNames[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.issueTime != null && Object.hasOwnProperty.call(message, "issueTime"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.issueTime);
                return writer;
            };

            /**
             * Encodes the specified Details message, length delimited. Does not implicitly {@link WAVnameCert.VerifiedNameCertificate.Details.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {WAVnameCert.VerifiedNameCertificate.IDetails} message Details message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Details.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Details message from the specified reader or buffer.
             * @function decode
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAVnameCert.VerifiedNameCertificate.Details} Details
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Details.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.VerifiedNameCertificate.Details();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.serial = reader.uint64();
                            break;
                        }
                    case 2: {
                            message.issuer = reader.string();
                            break;
                        }
                    case 4: {
                            message.verifiedName = reader.string();
                            break;
                        }
                    case 8: {
                            if (!(message.localizedNames && message.localizedNames.length))
                                message.localizedNames = [];
                            message.localizedNames.push($root.WAVnameCert.LocalizedName.decode(reader, reader.uint32()));
                            break;
                        }
                    case 10: {
                            message.issueTime = reader.uint64();
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
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAVnameCert.VerifiedNameCertificate.Details} Details
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
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Details.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.serial != null && message.hasOwnProperty("serial"))
                    if (!$util.isInteger(message.serial) && !(message.serial && $util.isInteger(message.serial.low) && $util.isInteger(message.serial.high)))
                        return "serial: integer|Long expected";
                if (message.issuer != null && message.hasOwnProperty("issuer"))
                    if (!$util.isString(message.issuer))
                        return "issuer: string expected";
                if (message.verifiedName != null && message.hasOwnProperty("verifiedName"))
                    if (!$util.isString(message.verifiedName))
                        return "verifiedName: string expected";
                if (message.localizedNames != null && message.hasOwnProperty("localizedNames")) {
                    if (!Array.isArray(message.localizedNames))
                        return "localizedNames: array expected";
                    for (var i = 0; i < message.localizedNames.length; ++i) {
                        var error = $root.WAVnameCert.LocalizedName.verify(message.localizedNames[i]);
                        if (error)
                            return "localizedNames." + error;
                    }
                }
                if (message.issueTime != null && message.hasOwnProperty("issueTime"))
                    if (!$util.isInteger(message.issueTime) && !(message.issueTime && $util.isInteger(message.issueTime.low) && $util.isInteger(message.issueTime.high)))
                        return "issueTime: integer|Long expected";
                return null;
            };

            /**
             * Creates a Details message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAVnameCert.VerifiedNameCertificate.Details} Details
             */
            Details.fromObject = function fromObject(object) {
                if (object instanceof $root.WAVnameCert.VerifiedNameCertificate.Details)
                    return object;
                var message = new $root.WAVnameCert.VerifiedNameCertificate.Details();
                if (object.serial != null)
                    if ($util.Long)
                        (message.serial = $util.Long.fromValue(object.serial)).unsigned = true;
                    else if (typeof object.serial === "string")
                        message.serial = parseInt(object.serial, 10);
                    else if (typeof object.serial === "number")
                        message.serial = object.serial;
                    else if (typeof object.serial === "object")
                        message.serial = new $util.LongBits(object.serial.low >>> 0, object.serial.high >>> 0).toNumber(true);
                if (object.issuer != null)
                    message.issuer = String(object.issuer);
                if (object.verifiedName != null)
                    message.verifiedName = String(object.verifiedName);
                if (object.localizedNames) {
                    if (!Array.isArray(object.localizedNames))
                        throw TypeError(".WAVnameCert.VerifiedNameCertificate.Details.localizedNames: array expected");
                    message.localizedNames = [];
                    for (var i = 0; i < object.localizedNames.length; ++i) {
                        if (typeof object.localizedNames[i] !== "object")
                            throw TypeError(".WAVnameCert.VerifiedNameCertificate.Details.localizedNames: object expected");
                        message.localizedNames[i] = $root.WAVnameCert.LocalizedName.fromObject(object.localizedNames[i]);
                    }
                }
                if (object.issueTime != null)
                    if ($util.Long)
                        (message.issueTime = $util.Long.fromValue(object.issueTime)).unsigned = true;
                    else if (typeof object.issueTime === "string")
                        message.issueTime = parseInt(object.issueTime, 10);
                    else if (typeof object.issueTime === "number")
                        message.issueTime = object.issueTime;
                    else if (typeof object.issueTime === "object")
                        message.issueTime = new $util.LongBits(object.issueTime.low >>> 0, object.issueTime.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Details message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {WAVnameCert.VerifiedNameCertificate.Details} message Details
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Details.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.localizedNames = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.serial = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.serial = options.longs === String ? "0" : 0;
                    object.issuer = "";
                    object.verifiedName = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.issueTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.issueTime = options.longs === String ? "0" : 0;
                }
                if (message.serial != null && message.hasOwnProperty("serial"))
                    if (typeof message.serial === "number")
                        object.serial = options.longs === String ? String(message.serial) : message.serial;
                    else
                        object.serial = options.longs === String ? $util.Long.prototype.toString.call(message.serial) : options.longs === Number ? new $util.LongBits(message.serial.low >>> 0, message.serial.high >>> 0).toNumber(true) : message.serial;
                if (message.issuer != null && message.hasOwnProperty("issuer"))
                    object.issuer = message.issuer;
                if (message.verifiedName != null && message.hasOwnProperty("verifiedName"))
                    object.verifiedName = message.verifiedName;
                if (message.localizedNames && message.localizedNames.length) {
                    object.localizedNames = [];
                    for (var j = 0; j < message.localizedNames.length; ++j)
                        object.localizedNames[j] = $root.WAVnameCert.LocalizedName.toObject(message.localizedNames[j], options);
                }
                if (message.issueTime != null && message.hasOwnProperty("issueTime"))
                    if (typeof message.issueTime === "number")
                        object.issueTime = options.longs === String ? String(message.issueTime) : message.issueTime;
                    else
                        object.issueTime = options.longs === String ? $util.Long.prototype.toString.call(message.issueTime) : options.longs === Number ? new $util.LongBits(message.issueTime.low >>> 0, message.issueTime.high >>> 0).toNumber(true) : message.issueTime;
                return object;
            };

            /**
             * Converts this Details to JSON.
             * @function toJSON
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Details.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Details
             * @function getTypeUrl
             * @memberof WAVnameCert.VerifiedNameCertificate.Details
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Details.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAVnameCert.VerifiedNameCertificate.Details";
            };

            return Details;
        })();

        return VerifiedNameCertificate;
    })();

    WAVnameCert.BizAccountPayload = (function() {

        /**
         * Properties of a BizAccountPayload.
         * @memberof WAVnameCert
         * @interface IBizAccountPayload
         * @property {WAVnameCert.IVerifiedNameCertificate|null} [vnameCert] BizAccountPayload vnameCert
         * @property {Uint8Array|null} [bizAcctLinkInfo] BizAccountPayload bizAcctLinkInfo
         */

        /**
         * Constructs a new BizAccountPayload.
         * @memberof WAVnameCert
         * @classdesc Represents a BizAccountPayload.
         * @implements IBizAccountPayload
         * @constructor
         * @param {WAVnameCert.IBizAccountPayload=} [properties] Properties to set
         */
        function BizAccountPayload(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BizAccountPayload vnameCert.
         * @member {WAVnameCert.IVerifiedNameCertificate|null|undefined} vnameCert
         * @memberof WAVnameCert.BizAccountPayload
         * @instance
         */
        BizAccountPayload.prototype.vnameCert = null;

        /**
         * BizAccountPayload bizAcctLinkInfo.
         * @member {Uint8Array} bizAcctLinkInfo
         * @memberof WAVnameCert.BizAccountPayload
         * @instance
         */
        BizAccountPayload.prototype.bizAcctLinkInfo = $util.newBuffer([]);

        /**
         * Creates a new BizAccountPayload instance using the specified properties.
         * @function create
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {WAVnameCert.IBizAccountPayload=} [properties] Properties to set
         * @returns {WAVnameCert.BizAccountPayload} BizAccountPayload instance
         */
        BizAccountPayload.create = function create(properties) {
            return new BizAccountPayload(properties);
        };

        /**
         * Encodes the specified BizAccountPayload message. Does not implicitly {@link WAVnameCert.BizAccountPayload.verify|verify} messages.
         * @function encode
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {WAVnameCert.IBizAccountPayload} message BizAccountPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizAccountPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.vnameCert != null && Object.hasOwnProperty.call(message, "vnameCert"))
                $root.WAVnameCert.VerifiedNameCertificate.encode(message.vnameCert, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.bizAcctLinkInfo != null && Object.hasOwnProperty.call(message, "bizAcctLinkInfo"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.bizAcctLinkInfo);
            return writer;
        };

        /**
         * Encodes the specified BizAccountPayload message, length delimited. Does not implicitly {@link WAVnameCert.BizAccountPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {WAVnameCert.IBizAccountPayload} message BizAccountPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BizAccountPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BizAccountPayload message from the specified reader or buffer.
         * @function decode
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAVnameCert.BizAccountPayload} BizAccountPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizAccountPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAVnameCert.BizAccountPayload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.bizAcctLinkInfo = reader.bytes();
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
         * Decodes a BizAccountPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAVnameCert.BizAccountPayload} BizAccountPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BizAccountPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BizAccountPayload message.
         * @function verify
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BizAccountPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.vnameCert != null && message.hasOwnProperty("vnameCert")) {
                var error = $root.WAVnameCert.VerifiedNameCertificate.verify(message.vnameCert);
                if (error)
                    return "vnameCert." + error;
            }
            if (message.bizAcctLinkInfo != null && message.hasOwnProperty("bizAcctLinkInfo"))
                if (!(message.bizAcctLinkInfo && typeof message.bizAcctLinkInfo.length === "number" || $util.isString(message.bizAcctLinkInfo)))
                    return "bizAcctLinkInfo: buffer expected";
            return null;
        };

        /**
         * Creates a BizAccountPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAVnameCert.BizAccountPayload} BizAccountPayload
         */
        BizAccountPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.WAVnameCert.BizAccountPayload)
                return object;
            var message = new $root.WAVnameCert.BizAccountPayload();
            if (object.vnameCert != null) {
                if (typeof object.vnameCert !== "object")
                    throw TypeError(".WAVnameCert.BizAccountPayload.vnameCert: object expected");
                message.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.fromObject(object.vnameCert);
            }
            if (object.bizAcctLinkInfo != null)
                if (typeof object.bizAcctLinkInfo === "string")
                    $util.base64.decode(object.bizAcctLinkInfo, message.bizAcctLinkInfo = $util.newBuffer($util.base64.length(object.bizAcctLinkInfo)), 0);
                else if (object.bizAcctLinkInfo.length >= 0)
                    message.bizAcctLinkInfo = object.bizAcctLinkInfo;
            return message;
        };

        /**
         * Creates a plain object from a BizAccountPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {WAVnameCert.BizAccountPayload} message BizAccountPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BizAccountPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.vnameCert = null;
                if (options.bytes === String)
                    object.bizAcctLinkInfo = "";
                else {
                    object.bizAcctLinkInfo = [];
                    if (options.bytes !== Array)
                        object.bizAcctLinkInfo = $util.newBuffer(object.bizAcctLinkInfo);
                }
            }
            if (message.vnameCert != null && message.hasOwnProperty("vnameCert"))
                object.vnameCert = $root.WAVnameCert.VerifiedNameCertificate.toObject(message.vnameCert, options);
            if (message.bizAcctLinkInfo != null && message.hasOwnProperty("bizAcctLinkInfo"))
                object.bizAcctLinkInfo = options.bytes === String ? $util.base64.encode(message.bizAcctLinkInfo, 0, message.bizAcctLinkInfo.length) : options.bytes === Array ? Array.prototype.slice.call(message.bizAcctLinkInfo) : message.bizAcctLinkInfo;
            return object;
        };

        /**
         * Converts this BizAccountPayload to JSON.
         * @function toJSON
         * @memberof WAVnameCert.BizAccountPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BizAccountPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BizAccountPayload
         * @function getTypeUrl
         * @memberof WAVnameCert.BizAccountPayload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BizAccountPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAVnameCert.BizAccountPayload";
        };

        return BizAccountPayload;
    })();

    return WAVnameCert;
})();

module.exports = $root;
