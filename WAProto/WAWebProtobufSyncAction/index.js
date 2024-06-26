/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.WAWebProtobufSyncAction = (function() {

    /**
     * Namespace WAWebProtobufSyncAction.
     * @exports WAWebProtobufSyncAction
     * @namespace
     */
    var WAWebProtobufSyncAction = {};

    WAWebProtobufSyncAction.CallLogRecord = (function() {

        /**
         * Properties of a CallLogRecord.
         * @memberof WAWebProtobufSyncAction
         * @interface ICallLogRecord
         * @property {WAWebProtobufSyncAction.CallLogRecord.CallResult|null} [callResult] CallLogRecord callResult
         * @property {boolean|null} [isDndMode] CallLogRecord isDndMode
         * @property {WAWebProtobufSyncAction.CallLogRecord.SilenceReason|null} [silenceReason] CallLogRecord silenceReason
         * @property {number|Long|null} [duration] CallLogRecord duration
         * @property {number|Long|null} [startTime] CallLogRecord startTime
         * @property {boolean|null} [isIncoming] CallLogRecord isIncoming
         * @property {boolean|null} [isVideo] CallLogRecord isVideo
         * @property {boolean|null} [isCallLink] CallLogRecord isCallLink
         * @property {string|null} [callLinkToken] CallLogRecord callLinkToken
         * @property {string|null} [scheduledCallID] CallLogRecord scheduledCallID
         * @property {string|null} [callID] CallLogRecord callID
         * @property {string|null} [callCreatorJID] CallLogRecord callCreatorJID
         * @property {string|null} [groupJID] CallLogRecord groupJID
         * @property {Array.<WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo>|null} [participants] CallLogRecord participants
         * @property {WAWebProtobufSyncAction.CallLogRecord.CallType|null} [callType] CallLogRecord callType
         */

        /**
         * Constructs a new CallLogRecord.
         * @memberof WAWebProtobufSyncAction
         * @classdesc Represents a CallLogRecord.
         * @implements ICallLogRecord
         * @constructor
         * @param {WAWebProtobufSyncAction.ICallLogRecord=} [properties] Properties to set
         */
        function CallLogRecord(properties) {
            this.participants = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CallLogRecord callResult.
         * @member {WAWebProtobufSyncAction.CallLogRecord.CallResult} callResult
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.callResult = 0;

        /**
         * CallLogRecord isDndMode.
         * @member {boolean} isDndMode
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.isDndMode = false;

        /**
         * CallLogRecord silenceReason.
         * @member {WAWebProtobufSyncAction.CallLogRecord.SilenceReason} silenceReason
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.silenceReason = 0;

        /**
         * CallLogRecord duration.
         * @member {number|Long} duration
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.duration = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CallLogRecord startTime.
         * @member {number|Long} startTime
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CallLogRecord isIncoming.
         * @member {boolean} isIncoming
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.isIncoming = false;

        /**
         * CallLogRecord isVideo.
         * @member {boolean} isVideo
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.isVideo = false;

        /**
         * CallLogRecord isCallLink.
         * @member {boolean} isCallLink
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.isCallLink = false;

        /**
         * CallLogRecord callLinkToken.
         * @member {string} callLinkToken
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.callLinkToken = "";

        /**
         * CallLogRecord scheduledCallID.
         * @member {string} scheduledCallID
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.scheduledCallID = "";

        /**
         * CallLogRecord callID.
         * @member {string} callID
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.callID = "";

        /**
         * CallLogRecord callCreatorJID.
         * @member {string} callCreatorJID
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.callCreatorJID = "";

        /**
         * CallLogRecord groupJID.
         * @member {string} groupJID
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.groupJID = "";

        /**
         * CallLogRecord participants.
         * @member {Array.<WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo>} participants
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.participants = $util.emptyArray;

        /**
         * CallLogRecord callType.
         * @member {WAWebProtobufSyncAction.CallLogRecord.CallType} callType
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         */
        CallLogRecord.prototype.callType = 0;

        /**
         * Creates a new CallLogRecord instance using the specified properties.
         * @function create
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {WAWebProtobufSyncAction.ICallLogRecord=} [properties] Properties to set
         * @returns {WAWebProtobufSyncAction.CallLogRecord} CallLogRecord instance
         */
        CallLogRecord.create = function create(properties) {
            return new CallLogRecord(properties);
        };

        /**
         * Encodes the specified CallLogRecord message. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.verify|verify} messages.
         * @function encode
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {WAWebProtobufSyncAction.ICallLogRecord} message CallLogRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallLogRecord.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callResult != null && Object.hasOwnProperty.call(message, "callResult"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.callResult);
            if (message.isDndMode != null && Object.hasOwnProperty.call(message, "isDndMode"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isDndMode);
            if (message.silenceReason != null && Object.hasOwnProperty.call(message, "silenceReason"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.silenceReason);
            if (message.duration != null && Object.hasOwnProperty.call(message, "duration"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.duration);
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.startTime);
            if (message.isIncoming != null && Object.hasOwnProperty.call(message, "isIncoming"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isIncoming);
            if (message.isVideo != null && Object.hasOwnProperty.call(message, "isVideo"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isVideo);
            if (message.isCallLink != null && Object.hasOwnProperty.call(message, "isCallLink"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.isCallLink);
            if (message.callLinkToken != null && Object.hasOwnProperty.call(message, "callLinkToken"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.callLinkToken);
            if (message.scheduledCallID != null && Object.hasOwnProperty.call(message, "scheduledCallID"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.scheduledCallID);
            if (message.callID != null && Object.hasOwnProperty.call(message, "callID"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.callID);
            if (message.callCreatorJID != null && Object.hasOwnProperty.call(message, "callCreatorJID"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.callCreatorJID);
            if (message.groupJID != null && Object.hasOwnProperty.call(message, "groupJID"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.groupJID);
            if (message.participants != null && message.participants.length)
                for (var i = 0; i < message.participants.length; ++i)
                    $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.encode(message.participants[i], writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.callType != null && Object.hasOwnProperty.call(message, "callType"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.callType);
            return writer;
        };

        /**
         * Encodes the specified CallLogRecord message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {WAWebProtobufSyncAction.ICallLogRecord} message CallLogRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallLogRecord.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CallLogRecord message from the specified reader or buffer.
         * @function decode
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWebProtobufSyncAction.CallLogRecord} CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallLogRecord.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.CallLogRecord();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.callResult = reader.int32();
                        break;
                    }
                case 2: {
                        message.isDndMode = reader.bool();
                        break;
                    }
                case 3: {
                        message.silenceReason = reader.int32();
                        break;
                    }
                case 4: {
                        message.duration = reader.int64();
                        break;
                    }
                case 5: {
                        message.startTime = reader.int64();
                        break;
                    }
                case 6: {
                        message.isIncoming = reader.bool();
                        break;
                    }
                case 7: {
                        message.isVideo = reader.bool();
                        break;
                    }
                case 8: {
                        message.isCallLink = reader.bool();
                        break;
                    }
                case 9: {
                        message.callLinkToken = reader.string();
                        break;
                    }
                case 10: {
                        message.scheduledCallID = reader.string();
                        break;
                    }
                case 11: {
                        message.callID = reader.string();
                        break;
                    }
                case 12: {
                        message.callCreatorJID = reader.string();
                        break;
                    }
                case 13: {
                        message.groupJID = reader.string();
                        break;
                    }
                case 14: {
                        if (!(message.participants && message.participants.length))
                            message.participants = [];
                        message.participants.push($root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 15: {
                        message.callType = reader.int32();
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
         * Decodes a CallLogRecord message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWebProtobufSyncAction.CallLogRecord} CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallLogRecord.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CallLogRecord message.
         * @function verify
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallLogRecord.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callResult != null && message.hasOwnProperty("callResult"))
                switch (message.callResult) {
                default:
                    return "callResult: enum value expected";
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
                    break;
                }
            if (message.isDndMode != null && message.hasOwnProperty("isDndMode"))
                if (typeof message.isDndMode !== "boolean")
                    return "isDndMode: boolean expected";
            if (message.silenceReason != null && message.hasOwnProperty("silenceReason"))
                switch (message.silenceReason) {
                default:
                    return "silenceReason: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.duration != null && message.hasOwnProperty("duration"))
                if (!$util.isInteger(message.duration) && !(message.duration && $util.isInteger(message.duration.low) && $util.isInteger(message.duration.high)))
                    return "duration: integer|Long expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                    return "startTime: integer|Long expected";
            if (message.isIncoming != null && message.hasOwnProperty("isIncoming"))
                if (typeof message.isIncoming !== "boolean")
                    return "isIncoming: boolean expected";
            if (message.isVideo != null && message.hasOwnProperty("isVideo"))
                if (typeof message.isVideo !== "boolean")
                    return "isVideo: boolean expected";
            if (message.isCallLink != null && message.hasOwnProperty("isCallLink"))
                if (typeof message.isCallLink !== "boolean")
                    return "isCallLink: boolean expected";
            if (message.callLinkToken != null && message.hasOwnProperty("callLinkToken"))
                if (!$util.isString(message.callLinkToken))
                    return "callLinkToken: string expected";
            if (message.scheduledCallID != null && message.hasOwnProperty("scheduledCallID"))
                if (!$util.isString(message.scheduledCallID))
                    return "scheduledCallID: string expected";
            if (message.callID != null && message.hasOwnProperty("callID"))
                if (!$util.isString(message.callID))
                    return "callID: string expected";
            if (message.callCreatorJID != null && message.hasOwnProperty("callCreatorJID"))
                if (!$util.isString(message.callCreatorJID))
                    return "callCreatorJID: string expected";
            if (message.groupJID != null && message.hasOwnProperty("groupJID"))
                if (!$util.isString(message.groupJID))
                    return "groupJID: string expected";
            if (message.participants != null && message.hasOwnProperty("participants")) {
                if (!Array.isArray(message.participants))
                    return "participants: array expected";
                for (var i = 0; i < message.participants.length; ++i) {
                    var error = $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.verify(message.participants[i]);
                    if (error)
                        return "participants." + error;
                }
            }
            if (message.callType != null && message.hasOwnProperty("callType"))
                switch (message.callType) {
                default:
                    return "callType: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a CallLogRecord message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWebProtobufSyncAction.CallLogRecord} CallLogRecord
         */
        CallLogRecord.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWebProtobufSyncAction.CallLogRecord)
                return object;
            var message = new $root.WAWebProtobufSyncAction.CallLogRecord();
            switch (object.callResult) {
            default:
                if (typeof object.callResult === "number") {
                    message.callResult = object.callResult;
                    break;
                }
                break;
            case "CONNECTED":
            case 0:
                message.callResult = 0;
                break;
            case "REJECTED":
            case 1:
                message.callResult = 1;
                break;
            case "CANCELLED":
            case 2:
                message.callResult = 2;
                break;
            case "ACCEPTEDELSEWHERE":
            case 3:
                message.callResult = 3;
                break;
            case "MISSED":
            case 4:
                message.callResult = 4;
                break;
            case "INVALID":
            case 5:
                message.callResult = 5;
                break;
            case "UNAVAILABLE":
            case 6:
                message.callResult = 6;
                break;
            case "UPCOMING":
            case 7:
                message.callResult = 7;
                break;
            case "FAILED":
            case 8:
                message.callResult = 8;
                break;
            case "ABANDONED":
            case 9:
                message.callResult = 9;
                break;
            case "ONGOING":
            case 10:
                message.callResult = 10;
                break;
            }
            if (object.isDndMode != null)
                message.isDndMode = Boolean(object.isDndMode);
            switch (object.silenceReason) {
            default:
                if (typeof object.silenceReason === "number") {
                    message.silenceReason = object.silenceReason;
                    break;
                }
                break;
            case "NONE":
            case 0:
                message.silenceReason = 0;
                break;
            case "SCHEDULED":
            case 1:
                message.silenceReason = 1;
                break;
            case "PRIVACY":
            case 2:
                message.silenceReason = 2;
                break;
            case "LIGHTWEIGHT":
            case 3:
                message.silenceReason = 3;
                break;
            }
            if (object.duration != null)
                if ($util.Long)
                    (message.duration = $util.Long.fromValue(object.duration)).unsigned = false;
                else if (typeof object.duration === "string")
                    message.duration = parseInt(object.duration, 10);
                else if (typeof object.duration === "number")
                    message.duration = object.duration;
                else if (typeof object.duration === "object")
                    message.duration = new $util.LongBits(object.duration.low >>> 0, object.duration.high >>> 0).toNumber();
            if (object.startTime != null)
                if ($util.Long)
                    (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                else if (typeof object.startTime === "string")
                    message.startTime = parseInt(object.startTime, 10);
                else if (typeof object.startTime === "number")
                    message.startTime = object.startTime;
                else if (typeof object.startTime === "object")
                    message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
            if (object.isIncoming != null)
                message.isIncoming = Boolean(object.isIncoming);
            if (object.isVideo != null)
                message.isVideo = Boolean(object.isVideo);
            if (object.isCallLink != null)
                message.isCallLink = Boolean(object.isCallLink);
            if (object.callLinkToken != null)
                message.callLinkToken = String(object.callLinkToken);
            if (object.scheduledCallID != null)
                message.scheduledCallID = String(object.scheduledCallID);
            if (object.callID != null)
                message.callID = String(object.callID);
            if (object.callCreatorJID != null)
                message.callCreatorJID = String(object.callCreatorJID);
            if (object.groupJID != null)
                message.groupJID = String(object.groupJID);
            if (object.participants) {
                if (!Array.isArray(object.participants))
                    throw TypeError(".WAWebProtobufSyncAction.CallLogRecord.participants: array expected");
                message.participants = [];
                for (var i = 0; i < object.participants.length; ++i) {
                    if (typeof object.participants[i] !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.CallLogRecord.participants: object expected");
                    message.participants[i] = $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.fromObject(object.participants[i]);
                }
            }
            switch (object.callType) {
            default:
                if (typeof object.callType === "number") {
                    message.callType = object.callType;
                    break;
                }
                break;
            case "REGULAR":
            case 0:
                message.callType = 0;
                break;
            case "SCHEDULED_CALL":
            case 1:
                message.callType = 1;
                break;
            case "VOICE_CHAT":
            case 2:
                message.callType = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a CallLogRecord message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {WAWebProtobufSyncAction.CallLogRecord} message CallLogRecord
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallLogRecord.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.participants = [];
            if (options.defaults) {
                object.callResult = options.enums === String ? "CONNECTED" : 0;
                object.isDndMode = false;
                object.silenceReason = options.enums === String ? "NONE" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.duration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.duration = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTime = options.longs === String ? "0" : 0;
                object.isIncoming = false;
                object.isVideo = false;
                object.isCallLink = false;
                object.callLinkToken = "";
                object.scheduledCallID = "";
                object.callID = "";
                object.callCreatorJID = "";
                object.groupJID = "";
                object.callType = options.enums === String ? "REGULAR" : 0;
            }
            if (message.callResult != null && message.hasOwnProperty("callResult"))
                object.callResult = options.enums === String ? $root.WAWebProtobufSyncAction.CallLogRecord.CallResult[message.callResult] === undefined ? message.callResult : $root.WAWebProtobufSyncAction.CallLogRecord.CallResult[message.callResult] : message.callResult;
            if (message.isDndMode != null && message.hasOwnProperty("isDndMode"))
                object.isDndMode = message.isDndMode;
            if (message.silenceReason != null && message.hasOwnProperty("silenceReason"))
                object.silenceReason = options.enums === String ? $root.WAWebProtobufSyncAction.CallLogRecord.SilenceReason[message.silenceReason] === undefined ? message.silenceReason : $root.WAWebProtobufSyncAction.CallLogRecord.SilenceReason[message.silenceReason] : message.silenceReason;
            if (message.duration != null && message.hasOwnProperty("duration"))
                if (typeof message.duration === "number")
                    object.duration = options.longs === String ? String(message.duration) : message.duration;
                else
                    object.duration = options.longs === String ? $util.Long.prototype.toString.call(message.duration) : options.longs === Number ? new $util.LongBits(message.duration.low >>> 0, message.duration.high >>> 0).toNumber() : message.duration;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (typeof message.startTime === "number")
                    object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                else
                    object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
            if (message.isIncoming != null && message.hasOwnProperty("isIncoming"))
                object.isIncoming = message.isIncoming;
            if (message.isVideo != null && message.hasOwnProperty("isVideo"))
                object.isVideo = message.isVideo;
            if (message.isCallLink != null && message.hasOwnProperty("isCallLink"))
                object.isCallLink = message.isCallLink;
            if (message.callLinkToken != null && message.hasOwnProperty("callLinkToken"))
                object.callLinkToken = message.callLinkToken;
            if (message.scheduledCallID != null && message.hasOwnProperty("scheduledCallID"))
                object.scheduledCallID = message.scheduledCallID;
            if (message.callID != null && message.hasOwnProperty("callID"))
                object.callID = message.callID;
            if (message.callCreatorJID != null && message.hasOwnProperty("callCreatorJID"))
                object.callCreatorJID = message.callCreatorJID;
            if (message.groupJID != null && message.hasOwnProperty("groupJID"))
                object.groupJID = message.groupJID;
            if (message.participants && message.participants.length) {
                object.participants = [];
                for (var j = 0; j < message.participants.length; ++j)
                    object.participants[j] = $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.toObject(message.participants[j], options);
            }
            if (message.callType != null && message.hasOwnProperty("callType"))
                object.callType = options.enums === String ? $root.WAWebProtobufSyncAction.CallLogRecord.CallType[message.callType] === undefined ? message.callType : $root.WAWebProtobufSyncAction.CallLogRecord.CallType[message.callType] : message.callType;
            return object;
        };

        /**
         * Converts this CallLogRecord to JSON.
         * @function toJSON
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallLogRecord.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CallLogRecord
         * @function getTypeUrl
         * @memberof WAWebProtobufSyncAction.CallLogRecord
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CallLogRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWebProtobufSyncAction.CallLogRecord";
        };

        /**
         * CallType enum.
         * @name WAWebProtobufSyncAction.CallLogRecord.CallType
         * @enum {number}
         * @property {number} REGULAR=0 REGULAR value
         * @property {number} SCHEDULED_CALL=1 SCHEDULED_CALL value
         * @property {number} VOICE_CHAT=2 VOICE_CHAT value
         */
        CallLogRecord.CallType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "REGULAR"] = 0;
            values[valuesById[1] = "SCHEDULED_CALL"] = 1;
            values[valuesById[2] = "VOICE_CHAT"] = 2;
            return values;
        })();

        /**
         * SilenceReason enum.
         * @name WAWebProtobufSyncAction.CallLogRecord.SilenceReason
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} SCHEDULED=1 SCHEDULED value
         * @property {number} PRIVACY=2 PRIVACY value
         * @property {number} LIGHTWEIGHT=3 LIGHTWEIGHT value
         */
        CallLogRecord.SilenceReason = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "SCHEDULED"] = 1;
            values[valuesById[2] = "PRIVACY"] = 2;
            values[valuesById[3] = "LIGHTWEIGHT"] = 3;
            return values;
        })();

        /**
         * CallResult enum.
         * @name WAWebProtobufSyncAction.CallLogRecord.CallResult
         * @enum {number}
         * @property {number} CONNECTED=0 CONNECTED value
         * @property {number} REJECTED=1 REJECTED value
         * @property {number} CANCELLED=2 CANCELLED value
         * @property {number} ACCEPTEDELSEWHERE=3 ACCEPTEDELSEWHERE value
         * @property {number} MISSED=4 MISSED value
         * @property {number} INVALID=5 INVALID value
         * @property {number} UNAVAILABLE=6 UNAVAILABLE value
         * @property {number} UPCOMING=7 UPCOMING value
         * @property {number} FAILED=8 FAILED value
         * @property {number} ABANDONED=9 ABANDONED value
         * @property {number} ONGOING=10 ONGOING value
         */
        CallLogRecord.CallResult = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CONNECTED"] = 0;
            values[valuesById[1] = "REJECTED"] = 1;
            values[valuesById[2] = "CANCELLED"] = 2;
            values[valuesById[3] = "ACCEPTEDELSEWHERE"] = 3;
            values[valuesById[4] = "MISSED"] = 4;
            values[valuesById[5] = "INVALID"] = 5;
            values[valuesById[6] = "UNAVAILABLE"] = 6;
            values[valuesById[7] = "UPCOMING"] = 7;
            values[valuesById[8] = "FAILED"] = 8;
            values[valuesById[9] = "ABANDONED"] = 9;
            values[valuesById[10] = "ONGOING"] = 10;
            return values;
        })();

        CallLogRecord.ParticipantInfo = (function() {

            /**
             * Properties of a ParticipantInfo.
             * @memberof WAWebProtobufSyncAction.CallLogRecord
             * @interface IParticipantInfo
             * @property {string|null} [userJID] ParticipantInfo userJID
             * @property {WAWebProtobufSyncAction.CallLogRecord.CallResult|null} [callResult] ParticipantInfo callResult
             */

            /**
             * Constructs a new ParticipantInfo.
             * @memberof WAWebProtobufSyncAction.CallLogRecord
             * @classdesc Represents a ParticipantInfo.
             * @implements IParticipantInfo
             * @constructor
             * @param {WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo=} [properties] Properties to set
             */
            function ParticipantInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ParticipantInfo userJID.
             * @member {string} userJID
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @instance
             */
            ParticipantInfo.prototype.userJID = "";

            /**
             * ParticipantInfo callResult.
             * @member {WAWebProtobufSyncAction.CallLogRecord.CallResult} callResult
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @instance
             */
            ParticipantInfo.prototype.callResult = 0;

            /**
             * Creates a new ParticipantInfo instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo} ParticipantInfo instance
             */
            ParticipantInfo.create = function create(properties) {
                return new ParticipantInfo(properties);
            };

            /**
             * Encodes the specified ParticipantInfo message. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo} message ParticipantInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ParticipantInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.userJID != null && Object.hasOwnProperty.call(message, "userJID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.userJID);
                if (message.callResult != null && Object.hasOwnProperty.call(message, "callResult"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.callResult);
                return writer;
            };

            /**
             * Encodes the specified ParticipantInfo message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo} message ParticipantInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ParticipantInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ParticipantInfo message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo} ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ParticipantInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.userJID = reader.string();
                            break;
                        }
                    case 2: {
                            message.callResult = reader.int32();
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
             * Decodes a ParticipantInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo} ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ParticipantInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ParticipantInfo message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ParticipantInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.userJID != null && message.hasOwnProperty("userJID"))
                    if (!$util.isString(message.userJID))
                        return "userJID: string expected";
                if (message.callResult != null && message.hasOwnProperty("callResult"))
                    switch (message.callResult) {
                    default:
                        return "callResult: enum value expected";
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
                        break;
                    }
                return null;
            };

            /**
             * Creates a ParticipantInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo} ParticipantInfo
             */
            ParticipantInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo();
                if (object.userJID != null)
                    message.userJID = String(object.userJID);
                switch (object.callResult) {
                default:
                    if (typeof object.callResult === "number") {
                        message.callResult = object.callResult;
                        break;
                    }
                    break;
                case "CONNECTED":
                case 0:
                    message.callResult = 0;
                    break;
                case "REJECTED":
                case 1:
                    message.callResult = 1;
                    break;
                case "CANCELLED":
                case 2:
                    message.callResult = 2;
                    break;
                case "ACCEPTEDELSEWHERE":
                case 3:
                    message.callResult = 3;
                    break;
                case "MISSED":
                case 4:
                    message.callResult = 4;
                    break;
                case "INVALID":
                case 5:
                    message.callResult = 5;
                    break;
                case "UNAVAILABLE":
                case 6:
                    message.callResult = 6;
                    break;
                case "UPCOMING":
                case 7:
                    message.callResult = 7;
                    break;
                case "FAILED":
                case 8:
                    message.callResult = 8;
                    break;
                case "ABANDONED":
                case 9:
                    message.callResult = 9;
                    break;
                case "ONGOING":
                case 10:
                    message.callResult = 10;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a ParticipantInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo} message ParticipantInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ParticipantInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.userJID = "";
                    object.callResult = options.enums === String ? "CONNECTED" : 0;
                }
                if (message.userJID != null && message.hasOwnProperty("userJID"))
                    object.userJID = message.userJID;
                if (message.callResult != null && message.hasOwnProperty("callResult"))
                    object.callResult = options.enums === String ? $root.WAWebProtobufSyncAction.CallLogRecord.CallResult[message.callResult] === undefined ? message.callResult : $root.WAWebProtobufSyncAction.CallLogRecord.CallResult[message.callResult] : message.callResult;
                return object;
            };

            /**
             * Converts this ParticipantInfo to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ParticipantInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ParticipantInfo
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ParticipantInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo";
            };

            return ParticipantInfo;
        })();

        return CallLogRecord;
    })();

    WAWebProtobufSyncAction.SyncActionValue = (function() {

        /**
         * Properties of a SyncActionValue.
         * @memberof WAWebProtobufSyncAction
         * @interface ISyncActionValue
         * @property {number|Long|null} [timestamp] SyncActionValue timestamp
         * @property {WAWebProtobufSyncAction.SyncActionValue.IStarAction|null} [starAction] SyncActionValue starAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IContactAction|null} [contactAction] SyncActionValue contactAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IMuteAction|null} [muteAction] SyncActionValue muteAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPinAction|null} [pinAction] SyncActionValue pinAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting|null} [securityNotificationSetting] SyncActionValue securityNotificationSetting
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting|null} [pushNameSetting] SyncActionValue pushNameSetting
         * @property {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction|null} [quickReplyAction] SyncActionValue quickReplyAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction|null} [recentEmojiWeightsAction] SyncActionValue recentEmojiWeightsAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction|null} [labelEditAction] SyncActionValue labelEditAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction|null} [labelAssociationAction] SyncActionValue labelAssociationAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting|null} [localeSetting] SyncActionValue localeSetting
         * @property {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction|null} [archiveChatAction] SyncActionValue archiveChatAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction|null} [deleteMessageForMeAction] SyncActionValue deleteMessageForMeAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration|null} [keyExpiration] SyncActionValue keyExpiration
         * @property {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction|null} [markChatAsReadAction] SyncActionValue markChatAsReadAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction|null} [clearChatAction] SyncActionValue clearChatAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction|null} [deleteChatAction] SyncActionValue deleteChatAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting|null} [unarchiveChatsSetting] SyncActionValue unarchiveChatsSetting
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature|null} [primaryFeature] SyncActionValue primaryFeature
         * @property {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions|null} [androidUnsupportedActions] SyncActionValue androidUnsupportedActions
         * @property {WAWebProtobufSyncAction.SyncActionValue.IAgentAction|null} [agentAction] SyncActionValue agentAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction|null} [subscriptionAction] SyncActionValue subscriptionAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction|null} [userStatusMuteAction] SyncActionValue userStatusMuteAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction|null} [timeFormatAction] SyncActionValue timeFormatAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.INuxAction|null} [nuxAction] SyncActionValue nuxAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction|null} [primaryVersionAction] SyncActionValue primaryVersionAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IStickerAction|null} [stickerAction] SyncActionValue stickerAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction|null} [removeRecentStickerAction] SyncActionValue removeRecentStickerAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction|null} [chatAssignment] SyncActionValue chatAssignment
         * @property {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction|null} [chatAssignmentOpenedStatus] SyncActionValue chatAssignmentOpenedStatus
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction|null} [pnForLidChatAction] SyncActionValue pnForLidChatAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction|null} [marketingMessageAction] SyncActionValue marketingMessageAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction|null} [marketingMessageBroadcastAction] SyncActionValue marketingMessageBroadcastAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction|null} [externalWebBetaAction] SyncActionValue externalWebBetaAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls|null} [privacySettingRelayAllCalls] SyncActionValue privacySettingRelayAllCalls
         * @property {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction|null} [callLogAction] SyncActionValue callLogAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction|null} [statusPrivacy] SyncActionValue statusPrivacy
         * @property {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction|null} [botWelcomeRequestAction] SyncActionValue botWelcomeRequestAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction|null} [deleteIndividualCallLog] SyncActionValue deleteIndividualCallLog
         * @property {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction|null} [labelReorderingAction] SyncActionValue labelReorderingAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction|null} [paymentInfoAction] SyncActionValue paymentInfoAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction|null} [customPaymentMethodsAction] SyncActionValue customPaymentMethodsAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction|null} [lockChatAction] SyncActionValue lockChatAction
         * @property {WAChatLockSettings.IChatLockSettings|null} [chatLockSettings] SyncActionValue chatLockSettings
         * @property {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction|null} [wamoUserIdentifierAction] SyncActionValue wamoUserIdentifierAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null} [privacySettingDisableLinkPreviewsAction] SyncActionValue privacySettingDisableLinkPreviewsAction
         * @property {WADeviceCapabilities.IDeviceCapabilities|null} [deviceCapabilities] SyncActionValue deviceCapabilities
         * @property {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction|null} [noteEditAction] SyncActionValue noteEditAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction|null} [favoritesAction] SyncActionValue favoritesAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction|null} [merchantPaymentPartnerAction] SyncActionValue merchantPaymentPartnerAction
         * @property {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction|null} [waffleAccountLinkStateAction] SyncActionValue waffleAccountLinkStateAction
         */

        /**
         * Constructs a new SyncActionValue.
         * @memberof WAWebProtobufSyncAction
         * @classdesc Represents a SyncActionValue.
         * @implements ISyncActionValue
         * @constructor
         * @param {WAWebProtobufSyncAction.ISyncActionValue=} [properties] Properties to set
         */
        function SyncActionValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncActionValue timestamp.
         * @member {number|Long} timestamp
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SyncActionValue starAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IStarAction|null|undefined} starAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.starAction = null;

        /**
         * SyncActionValue contactAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IContactAction|null|undefined} contactAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.contactAction = null;

        /**
         * SyncActionValue muteAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IMuteAction|null|undefined} muteAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.muteAction = null;

        /**
         * SyncActionValue pinAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPinAction|null|undefined} pinAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.pinAction = null;

        /**
         * SyncActionValue securityNotificationSetting.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting|null|undefined} securityNotificationSetting
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.securityNotificationSetting = null;

        /**
         * SyncActionValue pushNameSetting.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting|null|undefined} pushNameSetting
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.pushNameSetting = null;

        /**
         * SyncActionValue quickReplyAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction|null|undefined} quickReplyAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.quickReplyAction = null;

        /**
         * SyncActionValue recentEmojiWeightsAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction|null|undefined} recentEmojiWeightsAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.recentEmojiWeightsAction = null;

        /**
         * SyncActionValue labelEditAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction|null|undefined} labelEditAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.labelEditAction = null;

        /**
         * SyncActionValue labelAssociationAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction|null|undefined} labelAssociationAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.labelAssociationAction = null;

        /**
         * SyncActionValue localeSetting.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting|null|undefined} localeSetting
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.localeSetting = null;

        /**
         * SyncActionValue archiveChatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction|null|undefined} archiveChatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.archiveChatAction = null;

        /**
         * SyncActionValue deleteMessageForMeAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction|null|undefined} deleteMessageForMeAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.deleteMessageForMeAction = null;

        /**
         * SyncActionValue keyExpiration.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration|null|undefined} keyExpiration
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.keyExpiration = null;

        /**
         * SyncActionValue markChatAsReadAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction|null|undefined} markChatAsReadAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.markChatAsReadAction = null;

        /**
         * SyncActionValue clearChatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction|null|undefined} clearChatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.clearChatAction = null;

        /**
         * SyncActionValue deleteChatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction|null|undefined} deleteChatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.deleteChatAction = null;

        /**
         * SyncActionValue unarchiveChatsSetting.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting|null|undefined} unarchiveChatsSetting
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.unarchiveChatsSetting = null;

        /**
         * SyncActionValue primaryFeature.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature|null|undefined} primaryFeature
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.primaryFeature = null;

        /**
         * SyncActionValue androidUnsupportedActions.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions|null|undefined} androidUnsupportedActions
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.androidUnsupportedActions = null;

        /**
         * SyncActionValue agentAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IAgentAction|null|undefined} agentAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.agentAction = null;

        /**
         * SyncActionValue subscriptionAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction|null|undefined} subscriptionAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.subscriptionAction = null;

        /**
         * SyncActionValue userStatusMuteAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction|null|undefined} userStatusMuteAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.userStatusMuteAction = null;

        /**
         * SyncActionValue timeFormatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction|null|undefined} timeFormatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.timeFormatAction = null;

        /**
         * SyncActionValue nuxAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.INuxAction|null|undefined} nuxAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.nuxAction = null;

        /**
         * SyncActionValue primaryVersionAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction|null|undefined} primaryVersionAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.primaryVersionAction = null;

        /**
         * SyncActionValue stickerAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IStickerAction|null|undefined} stickerAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.stickerAction = null;

        /**
         * SyncActionValue removeRecentStickerAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction|null|undefined} removeRecentStickerAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.removeRecentStickerAction = null;

        /**
         * SyncActionValue chatAssignment.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction|null|undefined} chatAssignment
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.chatAssignment = null;

        /**
         * SyncActionValue chatAssignmentOpenedStatus.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction|null|undefined} chatAssignmentOpenedStatus
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.chatAssignmentOpenedStatus = null;

        /**
         * SyncActionValue pnForLidChatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction|null|undefined} pnForLidChatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.pnForLidChatAction = null;

        /**
         * SyncActionValue marketingMessageAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction|null|undefined} marketingMessageAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.marketingMessageAction = null;

        /**
         * SyncActionValue marketingMessageBroadcastAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction|null|undefined} marketingMessageBroadcastAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.marketingMessageBroadcastAction = null;

        /**
         * SyncActionValue externalWebBetaAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction|null|undefined} externalWebBetaAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.externalWebBetaAction = null;

        /**
         * SyncActionValue privacySettingRelayAllCalls.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls|null|undefined} privacySettingRelayAllCalls
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.privacySettingRelayAllCalls = null;

        /**
         * SyncActionValue callLogAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction|null|undefined} callLogAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.callLogAction = null;

        /**
         * SyncActionValue statusPrivacy.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction|null|undefined} statusPrivacy
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.statusPrivacy = null;

        /**
         * SyncActionValue botWelcomeRequestAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction|null|undefined} botWelcomeRequestAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.botWelcomeRequestAction = null;

        /**
         * SyncActionValue deleteIndividualCallLog.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction|null|undefined} deleteIndividualCallLog
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.deleteIndividualCallLog = null;

        /**
         * SyncActionValue labelReorderingAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction|null|undefined} labelReorderingAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.labelReorderingAction = null;

        /**
         * SyncActionValue paymentInfoAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction|null|undefined} paymentInfoAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.paymentInfoAction = null;

        /**
         * SyncActionValue customPaymentMethodsAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction|null|undefined} customPaymentMethodsAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.customPaymentMethodsAction = null;

        /**
         * SyncActionValue lockChatAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction|null|undefined} lockChatAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.lockChatAction = null;

        /**
         * SyncActionValue chatLockSettings.
         * @member {WAChatLockSettings.IChatLockSettings|null|undefined} chatLockSettings
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.chatLockSettings = null;

        /**
         * SyncActionValue wamoUserIdentifierAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction|null|undefined} wamoUserIdentifierAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.wamoUserIdentifierAction = null;

        /**
         * SyncActionValue privacySettingDisableLinkPreviewsAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null|undefined} privacySettingDisableLinkPreviewsAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.privacySettingDisableLinkPreviewsAction = null;

        /**
         * SyncActionValue deviceCapabilities.
         * @member {WADeviceCapabilities.IDeviceCapabilities|null|undefined} deviceCapabilities
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.deviceCapabilities = null;

        /**
         * SyncActionValue noteEditAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction|null|undefined} noteEditAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.noteEditAction = null;

        /**
         * SyncActionValue favoritesAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction|null|undefined} favoritesAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.favoritesAction = null;

        /**
         * SyncActionValue merchantPaymentPartnerAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction|null|undefined} merchantPaymentPartnerAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.merchantPaymentPartnerAction = null;

        /**
         * SyncActionValue waffleAccountLinkStateAction.
         * @member {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction|null|undefined} waffleAccountLinkStateAction
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         */
        SyncActionValue.prototype.waffleAccountLinkStateAction = null;

        /**
         * Creates a new SyncActionValue instance using the specified properties.
         * @function create
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionValue=} [properties] Properties to set
         * @returns {WAWebProtobufSyncAction.SyncActionValue} SyncActionValue instance
         */
        SyncActionValue.create = function create(properties) {
            return new SyncActionValue(properties);
        };

        /**
         * Encodes the specified SyncActionValue message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.verify|verify} messages.
         * @function encode
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionValue} message SyncActionValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncActionValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            if (message.starAction != null && Object.hasOwnProperty.call(message, "starAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.StarAction.encode(message.starAction, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.contactAction != null && Object.hasOwnProperty.call(message, "contactAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction.encode(message.contactAction, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.muteAction != null && Object.hasOwnProperty.call(message, "muteAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction.encode(message.muteAction, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.pinAction != null && Object.hasOwnProperty.call(message, "pinAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PinAction.encode(message.pinAction, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.securityNotificationSetting != null && Object.hasOwnProperty.call(message, "securityNotificationSetting"))
                $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.encode(message.securityNotificationSetting, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pushNameSetting != null && Object.hasOwnProperty.call(message, "pushNameSetting"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.encode(message.pushNameSetting, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.quickReplyAction != null && Object.hasOwnProperty.call(message, "quickReplyAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.encode(message.quickReplyAction, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.recentEmojiWeightsAction != null && Object.hasOwnProperty.call(message, "recentEmojiWeightsAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.encode(message.recentEmojiWeightsAction, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.labelEditAction != null && Object.hasOwnProperty.call(message, "labelEditAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.encode(message.labelEditAction, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.labelAssociationAction != null && Object.hasOwnProperty.call(message, "labelAssociationAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.encode(message.labelAssociationAction, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.localeSetting != null && Object.hasOwnProperty.call(message, "localeSetting"))
                $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.encode(message.localeSetting, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.archiveChatAction != null && Object.hasOwnProperty.call(message, "archiveChatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.encode(message.archiveChatAction, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.deleteMessageForMeAction != null && Object.hasOwnProperty.call(message, "deleteMessageForMeAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.encode(message.deleteMessageForMeAction, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.keyExpiration != null && Object.hasOwnProperty.call(message, "keyExpiration"))
                $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.encode(message.keyExpiration, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            if (message.markChatAsReadAction != null && Object.hasOwnProperty.call(message, "markChatAsReadAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.encode(message.markChatAsReadAction, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.clearChatAction != null && Object.hasOwnProperty.call(message, "clearChatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.encode(message.clearChatAction, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            if (message.deleteChatAction != null && Object.hasOwnProperty.call(message, "deleteChatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.encode(message.deleteChatAction, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            if (message.unarchiveChatsSetting != null && Object.hasOwnProperty.call(message, "unarchiveChatsSetting"))
                $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.encode(message.unarchiveChatsSetting, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.primaryFeature != null && Object.hasOwnProperty.call(message, "primaryFeature"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.encode(message.primaryFeature, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.androidUnsupportedActions != null && Object.hasOwnProperty.call(message, "androidUnsupportedActions"))
                $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.encode(message.androidUnsupportedActions, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.agentAction != null && Object.hasOwnProperty.call(message, "agentAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction.encode(message.agentAction, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
            if (message.subscriptionAction != null && Object.hasOwnProperty.call(message, "subscriptionAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.encode(message.subscriptionAction, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
            if (message.userStatusMuteAction != null && Object.hasOwnProperty.call(message, "userStatusMuteAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.encode(message.userStatusMuteAction, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
            if (message.timeFormatAction != null && Object.hasOwnProperty.call(message, "timeFormatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.encode(message.timeFormatAction, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.nuxAction != null && Object.hasOwnProperty.call(message, "nuxAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction.encode(message.nuxAction, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
            if (message.primaryVersionAction != null && Object.hasOwnProperty.call(message, "primaryVersionAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.encode(message.primaryVersionAction, writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
            if (message.stickerAction != null && Object.hasOwnProperty.call(message, "stickerAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction.encode(message.stickerAction, writer.uint32(/* id 33, wireType 2 =*/266).fork()).ldelim();
            if (message.removeRecentStickerAction != null && Object.hasOwnProperty.call(message, "removeRecentStickerAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.encode(message.removeRecentStickerAction, writer.uint32(/* id 34, wireType 2 =*/274).fork()).ldelim();
            if (message.chatAssignment != null && Object.hasOwnProperty.call(message, "chatAssignment"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.encode(message.chatAssignment, writer.uint32(/* id 35, wireType 2 =*/282).fork()).ldelim();
            if (message.chatAssignmentOpenedStatus != null && Object.hasOwnProperty.call(message, "chatAssignmentOpenedStatus"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.encode(message.chatAssignmentOpenedStatus, writer.uint32(/* id 36, wireType 2 =*/290).fork()).ldelim();
            if (message.pnForLidChatAction != null && Object.hasOwnProperty.call(message, "pnForLidChatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.encode(message.pnForLidChatAction, writer.uint32(/* id 37, wireType 2 =*/298).fork()).ldelim();
            if (message.marketingMessageAction != null && Object.hasOwnProperty.call(message, "marketingMessageAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.encode(message.marketingMessageAction, writer.uint32(/* id 38, wireType 2 =*/306).fork()).ldelim();
            if (message.marketingMessageBroadcastAction != null && Object.hasOwnProperty.call(message, "marketingMessageBroadcastAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.encode(message.marketingMessageBroadcastAction, writer.uint32(/* id 39, wireType 2 =*/314).fork()).ldelim();
            if (message.externalWebBetaAction != null && Object.hasOwnProperty.call(message, "externalWebBetaAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.encode(message.externalWebBetaAction, writer.uint32(/* id 40, wireType 2 =*/322).fork()).ldelim();
            if (message.privacySettingRelayAllCalls != null && Object.hasOwnProperty.call(message, "privacySettingRelayAllCalls"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.encode(message.privacySettingRelayAllCalls, writer.uint32(/* id 41, wireType 2 =*/330).fork()).ldelim();
            if (message.callLogAction != null && Object.hasOwnProperty.call(message, "callLogAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction.encode(message.callLogAction, writer.uint32(/* id 42, wireType 2 =*/338).fork()).ldelim();
            if (message.statusPrivacy != null && Object.hasOwnProperty.call(message, "statusPrivacy"))
                $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.encode(message.statusPrivacy, writer.uint32(/* id 44, wireType 2 =*/354).fork()).ldelim();
            if (message.botWelcomeRequestAction != null && Object.hasOwnProperty.call(message, "botWelcomeRequestAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.encode(message.botWelcomeRequestAction, writer.uint32(/* id 45, wireType 2 =*/362).fork()).ldelim();
            if (message.deleteIndividualCallLog != null && Object.hasOwnProperty.call(message, "deleteIndividualCallLog"))
                $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.encode(message.deleteIndividualCallLog, writer.uint32(/* id 46, wireType 2 =*/370).fork()).ldelim();
            if (message.labelReorderingAction != null && Object.hasOwnProperty.call(message, "labelReorderingAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.encode(message.labelReorderingAction, writer.uint32(/* id 47, wireType 2 =*/378).fork()).ldelim();
            if (message.paymentInfoAction != null && Object.hasOwnProperty.call(message, "paymentInfoAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.encode(message.paymentInfoAction, writer.uint32(/* id 48, wireType 2 =*/386).fork()).ldelim();
            if (message.customPaymentMethodsAction != null && Object.hasOwnProperty.call(message, "customPaymentMethodsAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.encode(message.customPaymentMethodsAction, writer.uint32(/* id 49, wireType 2 =*/394).fork()).ldelim();
            if (message.lockChatAction != null && Object.hasOwnProperty.call(message, "lockChatAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction.encode(message.lockChatAction, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
            if (message.chatLockSettings != null && Object.hasOwnProperty.call(message, "chatLockSettings"))
                $root.WAChatLockSettings.ChatLockSettings.encode(message.chatLockSettings, writer.uint32(/* id 51, wireType 2 =*/410).fork()).ldelim();
            if (message.wamoUserIdentifierAction != null && Object.hasOwnProperty.call(message, "wamoUserIdentifierAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.encode(message.wamoUserIdentifierAction, writer.uint32(/* id 52, wireType 2 =*/418).fork()).ldelim();
            if (message.privacySettingDisableLinkPreviewsAction != null && Object.hasOwnProperty.call(message, "privacySettingDisableLinkPreviewsAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.encode(message.privacySettingDisableLinkPreviewsAction, writer.uint32(/* id 53, wireType 2 =*/426).fork()).ldelim();
            if (message.deviceCapabilities != null && Object.hasOwnProperty.call(message, "deviceCapabilities"))
                $root.WADeviceCapabilities.DeviceCapabilities.encode(message.deviceCapabilities, writer.uint32(/* id 54, wireType 2 =*/434).fork()).ldelim();
            if (message.noteEditAction != null && Object.hasOwnProperty.call(message, "noteEditAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.encode(message.noteEditAction, writer.uint32(/* id 55, wireType 2 =*/442).fork()).ldelim();
            if (message.favoritesAction != null && Object.hasOwnProperty.call(message, "favoritesAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.encode(message.favoritesAction, writer.uint32(/* id 56, wireType 2 =*/450).fork()).ldelim();
            if (message.merchantPaymentPartnerAction != null && Object.hasOwnProperty.call(message, "merchantPaymentPartnerAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.encode(message.merchantPaymentPartnerAction, writer.uint32(/* id 57, wireType 2 =*/458).fork()).ldelim();
            if (message.waffleAccountLinkStateAction != null && Object.hasOwnProperty.call(message, "waffleAccountLinkStateAction"))
                $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.encode(message.waffleAccountLinkStateAction, writer.uint32(/* id 58, wireType 2 =*/466).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncActionValue message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionValue} message SyncActionValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncActionValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncActionValue message from the specified reader or buffer.
         * @function decode
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWebProtobufSyncAction.SyncActionValue} SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncActionValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.int64();
                        break;
                    }
                case 2: {
                        message.starAction = $root.WAWebProtobufSyncAction.SyncActionValue.StarAction.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.contactAction = $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.muteAction = $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.pinAction = $root.WAWebProtobufSyncAction.SyncActionValue.PinAction.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.securityNotificationSetting = $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.pushNameSetting = $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.quickReplyAction = $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.recentEmojiWeightsAction = $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.decode(reader, reader.uint32());
                        break;
                    }
                case 14: {
                        message.labelEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.decode(reader, reader.uint32());
                        break;
                    }
                case 15: {
                        message.labelAssociationAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.decode(reader, reader.uint32());
                        break;
                    }
                case 16: {
                        message.localeSetting = $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 17: {
                        message.archiveChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 18: {
                        message.deleteMessageForMeAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.decode(reader, reader.uint32());
                        break;
                    }
                case 19: {
                        message.keyExpiration = $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.decode(reader, reader.uint32());
                        break;
                    }
                case 20: {
                        message.markChatAsReadAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.decode(reader, reader.uint32());
                        break;
                    }
                case 21: {
                        message.clearChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 22: {
                        message.deleteChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 23: {
                        message.unarchiveChatsSetting = $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 24: {
                        message.primaryFeature = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.decode(reader, reader.uint32());
                        break;
                    }
                case 26: {
                        message.androidUnsupportedActions = $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.decode(reader, reader.uint32());
                        break;
                    }
                case 27: {
                        message.agentAction = $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction.decode(reader, reader.uint32());
                        break;
                    }
                case 28: {
                        message.subscriptionAction = $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.decode(reader, reader.uint32());
                        break;
                    }
                case 29: {
                        message.userStatusMuteAction = $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.decode(reader, reader.uint32());
                        break;
                    }
                case 30: {
                        message.timeFormatAction = $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 31: {
                        message.nuxAction = $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction.decode(reader, reader.uint32());
                        break;
                    }
                case 32: {
                        message.primaryVersionAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.decode(reader, reader.uint32());
                        break;
                    }
                case 33: {
                        message.stickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction.decode(reader, reader.uint32());
                        break;
                    }
                case 34: {
                        message.removeRecentStickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.decode(reader, reader.uint32());
                        break;
                    }
                case 35: {
                        message.chatAssignment = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.decode(reader, reader.uint32());
                        break;
                    }
                case 36: {
                        message.chatAssignmentOpenedStatus = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.decode(reader, reader.uint32());
                        break;
                    }
                case 37: {
                        message.pnForLidChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 38: {
                        message.marketingMessageAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.decode(reader, reader.uint32());
                        break;
                    }
                case 39: {
                        message.marketingMessageBroadcastAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.decode(reader, reader.uint32());
                        break;
                    }
                case 40: {
                        message.externalWebBetaAction = $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.decode(reader, reader.uint32());
                        break;
                    }
                case 41: {
                        message.privacySettingRelayAllCalls = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.decode(reader, reader.uint32());
                        break;
                    }
                case 42: {
                        message.callLogAction = $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction.decode(reader, reader.uint32());
                        break;
                    }
                case 44: {
                        message.statusPrivacy = $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.decode(reader, reader.uint32());
                        break;
                    }
                case 45: {
                        message.botWelcomeRequestAction = $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.decode(reader, reader.uint32());
                        break;
                    }
                case 46: {
                        message.deleteIndividualCallLog = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.decode(reader, reader.uint32());
                        break;
                    }
                case 47: {
                        message.labelReorderingAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.decode(reader, reader.uint32());
                        break;
                    }
                case 48: {
                        message.paymentInfoAction = $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.decode(reader, reader.uint32());
                        break;
                    }
                case 49: {
                        message.customPaymentMethodsAction = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.decode(reader, reader.uint32());
                        break;
                    }
                case 50: {
                        message.lockChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction.decode(reader, reader.uint32());
                        break;
                    }
                case 51: {
                        message.chatLockSettings = $root.WAChatLockSettings.ChatLockSettings.decode(reader, reader.uint32());
                        break;
                    }
                case 52: {
                        message.wamoUserIdentifierAction = $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.decode(reader, reader.uint32());
                        break;
                    }
                case 53: {
                        message.privacySettingDisableLinkPreviewsAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.decode(reader, reader.uint32());
                        break;
                    }
                case 54: {
                        message.deviceCapabilities = $root.WADeviceCapabilities.DeviceCapabilities.decode(reader, reader.uint32());
                        break;
                    }
                case 55: {
                        message.noteEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.decode(reader, reader.uint32());
                        break;
                    }
                case 56: {
                        message.favoritesAction = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.decode(reader, reader.uint32());
                        break;
                    }
                case 57: {
                        message.merchantPaymentPartnerAction = $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.decode(reader, reader.uint32());
                        break;
                    }
                case 58: {
                        message.waffleAccountLinkStateAction = $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.decode(reader, reader.uint32());
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
         * Decodes a SyncActionValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWebProtobufSyncAction.SyncActionValue} SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncActionValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncActionValue message.
         * @function verify
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncActionValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.starAction != null && message.hasOwnProperty("starAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.StarAction.verify(message.starAction);
                if (error)
                    return "starAction." + error;
            }
            if (message.contactAction != null && message.hasOwnProperty("contactAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction.verify(message.contactAction);
                if (error)
                    return "contactAction." + error;
            }
            if (message.muteAction != null && message.hasOwnProperty("muteAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction.verify(message.muteAction);
                if (error)
                    return "muteAction." + error;
            }
            if (message.pinAction != null && message.hasOwnProperty("pinAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PinAction.verify(message.pinAction);
                if (error)
                    return "pinAction." + error;
            }
            if (message.securityNotificationSetting != null && message.hasOwnProperty("securityNotificationSetting")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.verify(message.securityNotificationSetting);
                if (error)
                    return "securityNotificationSetting." + error;
            }
            if (message.pushNameSetting != null && message.hasOwnProperty("pushNameSetting")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.verify(message.pushNameSetting);
                if (error)
                    return "pushNameSetting." + error;
            }
            if (message.quickReplyAction != null && message.hasOwnProperty("quickReplyAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.verify(message.quickReplyAction);
                if (error)
                    return "quickReplyAction." + error;
            }
            if (message.recentEmojiWeightsAction != null && message.hasOwnProperty("recentEmojiWeightsAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.verify(message.recentEmojiWeightsAction);
                if (error)
                    return "recentEmojiWeightsAction." + error;
            }
            if (message.labelEditAction != null && message.hasOwnProperty("labelEditAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.verify(message.labelEditAction);
                if (error)
                    return "labelEditAction." + error;
            }
            if (message.labelAssociationAction != null && message.hasOwnProperty("labelAssociationAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.verify(message.labelAssociationAction);
                if (error)
                    return "labelAssociationAction." + error;
            }
            if (message.localeSetting != null && message.hasOwnProperty("localeSetting")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.verify(message.localeSetting);
                if (error)
                    return "localeSetting." + error;
            }
            if (message.archiveChatAction != null && message.hasOwnProperty("archiveChatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.verify(message.archiveChatAction);
                if (error)
                    return "archiveChatAction." + error;
            }
            if (message.deleteMessageForMeAction != null && message.hasOwnProperty("deleteMessageForMeAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.verify(message.deleteMessageForMeAction);
                if (error)
                    return "deleteMessageForMeAction." + error;
            }
            if (message.keyExpiration != null && message.hasOwnProperty("keyExpiration")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.verify(message.keyExpiration);
                if (error)
                    return "keyExpiration." + error;
            }
            if (message.markChatAsReadAction != null && message.hasOwnProperty("markChatAsReadAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.verify(message.markChatAsReadAction);
                if (error)
                    return "markChatAsReadAction." + error;
            }
            if (message.clearChatAction != null && message.hasOwnProperty("clearChatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.verify(message.clearChatAction);
                if (error)
                    return "clearChatAction." + error;
            }
            if (message.deleteChatAction != null && message.hasOwnProperty("deleteChatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.verify(message.deleteChatAction);
                if (error)
                    return "deleteChatAction." + error;
            }
            if (message.unarchiveChatsSetting != null && message.hasOwnProperty("unarchiveChatsSetting")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.verify(message.unarchiveChatsSetting);
                if (error)
                    return "unarchiveChatsSetting." + error;
            }
            if (message.primaryFeature != null && message.hasOwnProperty("primaryFeature")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.verify(message.primaryFeature);
                if (error)
                    return "primaryFeature." + error;
            }
            if (message.androidUnsupportedActions != null && message.hasOwnProperty("androidUnsupportedActions")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.verify(message.androidUnsupportedActions);
                if (error)
                    return "androidUnsupportedActions." + error;
            }
            if (message.agentAction != null && message.hasOwnProperty("agentAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction.verify(message.agentAction);
                if (error)
                    return "agentAction." + error;
            }
            if (message.subscriptionAction != null && message.hasOwnProperty("subscriptionAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.verify(message.subscriptionAction);
                if (error)
                    return "subscriptionAction." + error;
            }
            if (message.userStatusMuteAction != null && message.hasOwnProperty("userStatusMuteAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.verify(message.userStatusMuteAction);
                if (error)
                    return "userStatusMuteAction." + error;
            }
            if (message.timeFormatAction != null && message.hasOwnProperty("timeFormatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.verify(message.timeFormatAction);
                if (error)
                    return "timeFormatAction." + error;
            }
            if (message.nuxAction != null && message.hasOwnProperty("nuxAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction.verify(message.nuxAction);
                if (error)
                    return "nuxAction." + error;
            }
            if (message.primaryVersionAction != null && message.hasOwnProperty("primaryVersionAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.verify(message.primaryVersionAction);
                if (error)
                    return "primaryVersionAction." + error;
            }
            if (message.stickerAction != null && message.hasOwnProperty("stickerAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction.verify(message.stickerAction);
                if (error)
                    return "stickerAction." + error;
            }
            if (message.removeRecentStickerAction != null && message.hasOwnProperty("removeRecentStickerAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.verify(message.removeRecentStickerAction);
                if (error)
                    return "removeRecentStickerAction." + error;
            }
            if (message.chatAssignment != null && message.hasOwnProperty("chatAssignment")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.verify(message.chatAssignment);
                if (error)
                    return "chatAssignment." + error;
            }
            if (message.chatAssignmentOpenedStatus != null && message.hasOwnProperty("chatAssignmentOpenedStatus")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.verify(message.chatAssignmentOpenedStatus);
                if (error)
                    return "chatAssignmentOpenedStatus." + error;
            }
            if (message.pnForLidChatAction != null && message.hasOwnProperty("pnForLidChatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.verify(message.pnForLidChatAction);
                if (error)
                    return "pnForLidChatAction." + error;
            }
            if (message.marketingMessageAction != null && message.hasOwnProperty("marketingMessageAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.verify(message.marketingMessageAction);
                if (error)
                    return "marketingMessageAction." + error;
            }
            if (message.marketingMessageBroadcastAction != null && message.hasOwnProperty("marketingMessageBroadcastAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.verify(message.marketingMessageBroadcastAction);
                if (error)
                    return "marketingMessageBroadcastAction." + error;
            }
            if (message.externalWebBetaAction != null && message.hasOwnProperty("externalWebBetaAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.verify(message.externalWebBetaAction);
                if (error)
                    return "externalWebBetaAction." + error;
            }
            if (message.privacySettingRelayAllCalls != null && message.hasOwnProperty("privacySettingRelayAllCalls")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.verify(message.privacySettingRelayAllCalls);
                if (error)
                    return "privacySettingRelayAllCalls." + error;
            }
            if (message.callLogAction != null && message.hasOwnProperty("callLogAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction.verify(message.callLogAction);
                if (error)
                    return "callLogAction." + error;
            }
            if (message.statusPrivacy != null && message.hasOwnProperty("statusPrivacy")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.verify(message.statusPrivacy);
                if (error)
                    return "statusPrivacy." + error;
            }
            if (message.botWelcomeRequestAction != null && message.hasOwnProperty("botWelcomeRequestAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.verify(message.botWelcomeRequestAction);
                if (error)
                    return "botWelcomeRequestAction." + error;
            }
            if (message.deleteIndividualCallLog != null && message.hasOwnProperty("deleteIndividualCallLog")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.verify(message.deleteIndividualCallLog);
                if (error)
                    return "deleteIndividualCallLog." + error;
            }
            if (message.labelReorderingAction != null && message.hasOwnProperty("labelReorderingAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.verify(message.labelReorderingAction);
                if (error)
                    return "labelReorderingAction." + error;
            }
            if (message.paymentInfoAction != null && message.hasOwnProperty("paymentInfoAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.verify(message.paymentInfoAction);
                if (error)
                    return "paymentInfoAction." + error;
            }
            if (message.customPaymentMethodsAction != null && message.hasOwnProperty("customPaymentMethodsAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.verify(message.customPaymentMethodsAction);
                if (error)
                    return "customPaymentMethodsAction." + error;
            }
            if (message.lockChatAction != null && message.hasOwnProperty("lockChatAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction.verify(message.lockChatAction);
                if (error)
                    return "lockChatAction." + error;
            }
            if (message.chatLockSettings != null && message.hasOwnProperty("chatLockSettings")) {
                var error = $root.WAChatLockSettings.ChatLockSettings.verify(message.chatLockSettings);
                if (error)
                    return "chatLockSettings." + error;
            }
            if (message.wamoUserIdentifierAction != null && message.hasOwnProperty("wamoUserIdentifierAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.verify(message.wamoUserIdentifierAction);
                if (error)
                    return "wamoUserIdentifierAction." + error;
            }
            if (message.privacySettingDisableLinkPreviewsAction != null && message.hasOwnProperty("privacySettingDisableLinkPreviewsAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.verify(message.privacySettingDisableLinkPreviewsAction);
                if (error)
                    return "privacySettingDisableLinkPreviewsAction." + error;
            }
            if (message.deviceCapabilities != null && message.hasOwnProperty("deviceCapabilities")) {
                var error = $root.WADeviceCapabilities.DeviceCapabilities.verify(message.deviceCapabilities);
                if (error)
                    return "deviceCapabilities." + error;
            }
            if (message.noteEditAction != null && message.hasOwnProperty("noteEditAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.verify(message.noteEditAction);
                if (error)
                    return "noteEditAction." + error;
            }
            if (message.favoritesAction != null && message.hasOwnProperty("favoritesAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.verify(message.favoritesAction);
                if (error)
                    return "favoritesAction." + error;
            }
            if (message.merchantPaymentPartnerAction != null && message.hasOwnProperty("merchantPaymentPartnerAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.verify(message.merchantPaymentPartnerAction);
                if (error)
                    return "merchantPaymentPartnerAction." + error;
            }
            if (message.waffleAccountLinkStateAction != null && message.hasOwnProperty("waffleAccountLinkStateAction")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.verify(message.waffleAccountLinkStateAction);
                if (error)
                    return "waffleAccountLinkStateAction." + error;
            }
            return null;
        };

        /**
         * Creates a SyncActionValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWebProtobufSyncAction.SyncActionValue} SyncActionValue
         */
        SyncActionValue.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue)
                return object;
            var message = new $root.WAWebProtobufSyncAction.SyncActionValue();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.starAction != null) {
                if (typeof object.starAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.starAction: object expected");
                message.starAction = $root.WAWebProtobufSyncAction.SyncActionValue.StarAction.fromObject(object.starAction);
            }
            if (object.contactAction != null) {
                if (typeof object.contactAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.contactAction: object expected");
                message.contactAction = $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction.fromObject(object.contactAction);
            }
            if (object.muteAction != null) {
                if (typeof object.muteAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.muteAction: object expected");
                message.muteAction = $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction.fromObject(object.muteAction);
            }
            if (object.pinAction != null) {
                if (typeof object.pinAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.pinAction: object expected");
                message.pinAction = $root.WAWebProtobufSyncAction.SyncActionValue.PinAction.fromObject(object.pinAction);
            }
            if (object.securityNotificationSetting != null) {
                if (typeof object.securityNotificationSetting !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.securityNotificationSetting: object expected");
                message.securityNotificationSetting = $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.fromObject(object.securityNotificationSetting);
            }
            if (object.pushNameSetting != null) {
                if (typeof object.pushNameSetting !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.pushNameSetting: object expected");
                message.pushNameSetting = $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.fromObject(object.pushNameSetting);
            }
            if (object.quickReplyAction != null) {
                if (typeof object.quickReplyAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.quickReplyAction: object expected");
                message.quickReplyAction = $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.fromObject(object.quickReplyAction);
            }
            if (object.recentEmojiWeightsAction != null) {
                if (typeof object.recentEmojiWeightsAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.recentEmojiWeightsAction: object expected");
                message.recentEmojiWeightsAction = $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.fromObject(object.recentEmojiWeightsAction);
            }
            if (object.labelEditAction != null) {
                if (typeof object.labelEditAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.labelEditAction: object expected");
                message.labelEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.fromObject(object.labelEditAction);
            }
            if (object.labelAssociationAction != null) {
                if (typeof object.labelAssociationAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.labelAssociationAction: object expected");
                message.labelAssociationAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.fromObject(object.labelAssociationAction);
            }
            if (object.localeSetting != null) {
                if (typeof object.localeSetting !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.localeSetting: object expected");
                message.localeSetting = $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.fromObject(object.localeSetting);
            }
            if (object.archiveChatAction != null) {
                if (typeof object.archiveChatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.archiveChatAction: object expected");
                message.archiveChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.fromObject(object.archiveChatAction);
            }
            if (object.deleteMessageForMeAction != null) {
                if (typeof object.deleteMessageForMeAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.deleteMessageForMeAction: object expected");
                message.deleteMessageForMeAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.fromObject(object.deleteMessageForMeAction);
            }
            if (object.keyExpiration != null) {
                if (typeof object.keyExpiration !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.keyExpiration: object expected");
                message.keyExpiration = $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.fromObject(object.keyExpiration);
            }
            if (object.markChatAsReadAction != null) {
                if (typeof object.markChatAsReadAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.markChatAsReadAction: object expected");
                message.markChatAsReadAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.fromObject(object.markChatAsReadAction);
            }
            if (object.clearChatAction != null) {
                if (typeof object.clearChatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.clearChatAction: object expected");
                message.clearChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.fromObject(object.clearChatAction);
            }
            if (object.deleteChatAction != null) {
                if (typeof object.deleteChatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.deleteChatAction: object expected");
                message.deleteChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.fromObject(object.deleteChatAction);
            }
            if (object.unarchiveChatsSetting != null) {
                if (typeof object.unarchiveChatsSetting !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.unarchiveChatsSetting: object expected");
                message.unarchiveChatsSetting = $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.fromObject(object.unarchiveChatsSetting);
            }
            if (object.primaryFeature != null) {
                if (typeof object.primaryFeature !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.primaryFeature: object expected");
                message.primaryFeature = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.fromObject(object.primaryFeature);
            }
            if (object.androidUnsupportedActions != null) {
                if (typeof object.androidUnsupportedActions !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.androidUnsupportedActions: object expected");
                message.androidUnsupportedActions = $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.fromObject(object.androidUnsupportedActions);
            }
            if (object.agentAction != null) {
                if (typeof object.agentAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.agentAction: object expected");
                message.agentAction = $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction.fromObject(object.agentAction);
            }
            if (object.subscriptionAction != null) {
                if (typeof object.subscriptionAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.subscriptionAction: object expected");
                message.subscriptionAction = $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.fromObject(object.subscriptionAction);
            }
            if (object.userStatusMuteAction != null) {
                if (typeof object.userStatusMuteAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.userStatusMuteAction: object expected");
                message.userStatusMuteAction = $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.fromObject(object.userStatusMuteAction);
            }
            if (object.timeFormatAction != null) {
                if (typeof object.timeFormatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.timeFormatAction: object expected");
                message.timeFormatAction = $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.fromObject(object.timeFormatAction);
            }
            if (object.nuxAction != null) {
                if (typeof object.nuxAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.nuxAction: object expected");
                message.nuxAction = $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction.fromObject(object.nuxAction);
            }
            if (object.primaryVersionAction != null) {
                if (typeof object.primaryVersionAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.primaryVersionAction: object expected");
                message.primaryVersionAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.fromObject(object.primaryVersionAction);
            }
            if (object.stickerAction != null) {
                if (typeof object.stickerAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.stickerAction: object expected");
                message.stickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction.fromObject(object.stickerAction);
            }
            if (object.removeRecentStickerAction != null) {
                if (typeof object.removeRecentStickerAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.removeRecentStickerAction: object expected");
                message.removeRecentStickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.fromObject(object.removeRecentStickerAction);
            }
            if (object.chatAssignment != null) {
                if (typeof object.chatAssignment !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.chatAssignment: object expected");
                message.chatAssignment = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.fromObject(object.chatAssignment);
            }
            if (object.chatAssignmentOpenedStatus != null) {
                if (typeof object.chatAssignmentOpenedStatus !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.chatAssignmentOpenedStatus: object expected");
                message.chatAssignmentOpenedStatus = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.fromObject(object.chatAssignmentOpenedStatus);
            }
            if (object.pnForLidChatAction != null) {
                if (typeof object.pnForLidChatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.pnForLidChatAction: object expected");
                message.pnForLidChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.fromObject(object.pnForLidChatAction);
            }
            if (object.marketingMessageAction != null) {
                if (typeof object.marketingMessageAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.marketingMessageAction: object expected");
                message.marketingMessageAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.fromObject(object.marketingMessageAction);
            }
            if (object.marketingMessageBroadcastAction != null) {
                if (typeof object.marketingMessageBroadcastAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.marketingMessageBroadcastAction: object expected");
                message.marketingMessageBroadcastAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.fromObject(object.marketingMessageBroadcastAction);
            }
            if (object.externalWebBetaAction != null) {
                if (typeof object.externalWebBetaAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.externalWebBetaAction: object expected");
                message.externalWebBetaAction = $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.fromObject(object.externalWebBetaAction);
            }
            if (object.privacySettingRelayAllCalls != null) {
                if (typeof object.privacySettingRelayAllCalls !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.privacySettingRelayAllCalls: object expected");
                message.privacySettingRelayAllCalls = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.fromObject(object.privacySettingRelayAllCalls);
            }
            if (object.callLogAction != null) {
                if (typeof object.callLogAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.callLogAction: object expected");
                message.callLogAction = $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction.fromObject(object.callLogAction);
            }
            if (object.statusPrivacy != null) {
                if (typeof object.statusPrivacy !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.statusPrivacy: object expected");
                message.statusPrivacy = $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.fromObject(object.statusPrivacy);
            }
            if (object.botWelcomeRequestAction != null) {
                if (typeof object.botWelcomeRequestAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.botWelcomeRequestAction: object expected");
                message.botWelcomeRequestAction = $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.fromObject(object.botWelcomeRequestAction);
            }
            if (object.deleteIndividualCallLog != null) {
                if (typeof object.deleteIndividualCallLog !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.deleteIndividualCallLog: object expected");
                message.deleteIndividualCallLog = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.fromObject(object.deleteIndividualCallLog);
            }
            if (object.labelReorderingAction != null) {
                if (typeof object.labelReorderingAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.labelReorderingAction: object expected");
                message.labelReorderingAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.fromObject(object.labelReorderingAction);
            }
            if (object.paymentInfoAction != null) {
                if (typeof object.paymentInfoAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.paymentInfoAction: object expected");
                message.paymentInfoAction = $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.fromObject(object.paymentInfoAction);
            }
            if (object.customPaymentMethodsAction != null) {
                if (typeof object.customPaymentMethodsAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.customPaymentMethodsAction: object expected");
                message.customPaymentMethodsAction = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.fromObject(object.customPaymentMethodsAction);
            }
            if (object.lockChatAction != null) {
                if (typeof object.lockChatAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.lockChatAction: object expected");
                message.lockChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction.fromObject(object.lockChatAction);
            }
            if (object.chatLockSettings != null) {
                if (typeof object.chatLockSettings !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.chatLockSettings: object expected");
                message.chatLockSettings = $root.WAChatLockSettings.ChatLockSettings.fromObject(object.chatLockSettings);
            }
            if (object.wamoUserIdentifierAction != null) {
                if (typeof object.wamoUserIdentifierAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.wamoUserIdentifierAction: object expected");
                message.wamoUserIdentifierAction = $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.fromObject(object.wamoUserIdentifierAction);
            }
            if (object.privacySettingDisableLinkPreviewsAction != null) {
                if (typeof object.privacySettingDisableLinkPreviewsAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.privacySettingDisableLinkPreviewsAction: object expected");
                message.privacySettingDisableLinkPreviewsAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.fromObject(object.privacySettingDisableLinkPreviewsAction);
            }
            if (object.deviceCapabilities != null) {
                if (typeof object.deviceCapabilities !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.deviceCapabilities: object expected");
                message.deviceCapabilities = $root.WADeviceCapabilities.DeviceCapabilities.fromObject(object.deviceCapabilities);
            }
            if (object.noteEditAction != null) {
                if (typeof object.noteEditAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.noteEditAction: object expected");
                message.noteEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.fromObject(object.noteEditAction);
            }
            if (object.favoritesAction != null) {
                if (typeof object.favoritesAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.favoritesAction: object expected");
                message.favoritesAction = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.fromObject(object.favoritesAction);
            }
            if (object.merchantPaymentPartnerAction != null) {
                if (typeof object.merchantPaymentPartnerAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.merchantPaymentPartnerAction: object expected");
                message.merchantPaymentPartnerAction = $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.fromObject(object.merchantPaymentPartnerAction);
            }
            if (object.waffleAccountLinkStateAction != null) {
                if (typeof object.waffleAccountLinkStateAction !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.waffleAccountLinkStateAction: object expected");
                message.waffleAccountLinkStateAction = $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.fromObject(object.waffleAccountLinkStateAction);
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncActionValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {WAWebProtobufSyncAction.SyncActionValue} message SyncActionValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncActionValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.starAction = null;
                object.contactAction = null;
                object.muteAction = null;
                object.pinAction = null;
                object.securityNotificationSetting = null;
                object.pushNameSetting = null;
                object.quickReplyAction = null;
                object.recentEmojiWeightsAction = null;
                object.labelEditAction = null;
                object.labelAssociationAction = null;
                object.localeSetting = null;
                object.archiveChatAction = null;
                object.deleteMessageForMeAction = null;
                object.keyExpiration = null;
                object.markChatAsReadAction = null;
                object.clearChatAction = null;
                object.deleteChatAction = null;
                object.unarchiveChatsSetting = null;
                object.primaryFeature = null;
                object.androidUnsupportedActions = null;
                object.agentAction = null;
                object.subscriptionAction = null;
                object.userStatusMuteAction = null;
                object.timeFormatAction = null;
                object.nuxAction = null;
                object.primaryVersionAction = null;
                object.stickerAction = null;
                object.removeRecentStickerAction = null;
                object.chatAssignment = null;
                object.chatAssignmentOpenedStatus = null;
                object.pnForLidChatAction = null;
                object.marketingMessageAction = null;
                object.marketingMessageBroadcastAction = null;
                object.externalWebBetaAction = null;
                object.privacySettingRelayAllCalls = null;
                object.callLogAction = null;
                object.statusPrivacy = null;
                object.botWelcomeRequestAction = null;
                object.deleteIndividualCallLog = null;
                object.labelReorderingAction = null;
                object.paymentInfoAction = null;
                object.customPaymentMethodsAction = null;
                object.lockChatAction = null;
                object.chatLockSettings = null;
                object.wamoUserIdentifierAction = null;
                object.privacySettingDisableLinkPreviewsAction = null;
                object.deviceCapabilities = null;
                object.noteEditAction = null;
                object.favoritesAction = null;
                object.merchantPaymentPartnerAction = null;
                object.waffleAccountLinkStateAction = null;
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.starAction != null && message.hasOwnProperty("starAction"))
                object.starAction = $root.WAWebProtobufSyncAction.SyncActionValue.StarAction.toObject(message.starAction, options);
            if (message.contactAction != null && message.hasOwnProperty("contactAction"))
                object.contactAction = $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction.toObject(message.contactAction, options);
            if (message.muteAction != null && message.hasOwnProperty("muteAction"))
                object.muteAction = $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction.toObject(message.muteAction, options);
            if (message.pinAction != null && message.hasOwnProperty("pinAction"))
                object.pinAction = $root.WAWebProtobufSyncAction.SyncActionValue.PinAction.toObject(message.pinAction, options);
            if (message.securityNotificationSetting != null && message.hasOwnProperty("securityNotificationSetting"))
                object.securityNotificationSetting = $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.toObject(message.securityNotificationSetting, options);
            if (message.pushNameSetting != null && message.hasOwnProperty("pushNameSetting"))
                object.pushNameSetting = $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.toObject(message.pushNameSetting, options);
            if (message.quickReplyAction != null && message.hasOwnProperty("quickReplyAction"))
                object.quickReplyAction = $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.toObject(message.quickReplyAction, options);
            if (message.recentEmojiWeightsAction != null && message.hasOwnProperty("recentEmojiWeightsAction"))
                object.recentEmojiWeightsAction = $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.toObject(message.recentEmojiWeightsAction, options);
            if (message.labelEditAction != null && message.hasOwnProperty("labelEditAction"))
                object.labelEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.toObject(message.labelEditAction, options);
            if (message.labelAssociationAction != null && message.hasOwnProperty("labelAssociationAction"))
                object.labelAssociationAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.toObject(message.labelAssociationAction, options);
            if (message.localeSetting != null && message.hasOwnProperty("localeSetting"))
                object.localeSetting = $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.toObject(message.localeSetting, options);
            if (message.archiveChatAction != null && message.hasOwnProperty("archiveChatAction"))
                object.archiveChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.toObject(message.archiveChatAction, options);
            if (message.deleteMessageForMeAction != null && message.hasOwnProperty("deleteMessageForMeAction"))
                object.deleteMessageForMeAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.toObject(message.deleteMessageForMeAction, options);
            if (message.keyExpiration != null && message.hasOwnProperty("keyExpiration"))
                object.keyExpiration = $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.toObject(message.keyExpiration, options);
            if (message.markChatAsReadAction != null && message.hasOwnProperty("markChatAsReadAction"))
                object.markChatAsReadAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.toObject(message.markChatAsReadAction, options);
            if (message.clearChatAction != null && message.hasOwnProperty("clearChatAction"))
                object.clearChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.toObject(message.clearChatAction, options);
            if (message.deleteChatAction != null && message.hasOwnProperty("deleteChatAction"))
                object.deleteChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.toObject(message.deleteChatAction, options);
            if (message.unarchiveChatsSetting != null && message.hasOwnProperty("unarchiveChatsSetting"))
                object.unarchiveChatsSetting = $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.toObject(message.unarchiveChatsSetting, options);
            if (message.primaryFeature != null && message.hasOwnProperty("primaryFeature"))
                object.primaryFeature = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.toObject(message.primaryFeature, options);
            if (message.androidUnsupportedActions != null && message.hasOwnProperty("androidUnsupportedActions"))
                object.androidUnsupportedActions = $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.toObject(message.androidUnsupportedActions, options);
            if (message.agentAction != null && message.hasOwnProperty("agentAction"))
                object.agentAction = $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction.toObject(message.agentAction, options);
            if (message.subscriptionAction != null && message.hasOwnProperty("subscriptionAction"))
                object.subscriptionAction = $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.toObject(message.subscriptionAction, options);
            if (message.userStatusMuteAction != null && message.hasOwnProperty("userStatusMuteAction"))
                object.userStatusMuteAction = $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.toObject(message.userStatusMuteAction, options);
            if (message.timeFormatAction != null && message.hasOwnProperty("timeFormatAction"))
                object.timeFormatAction = $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.toObject(message.timeFormatAction, options);
            if (message.nuxAction != null && message.hasOwnProperty("nuxAction"))
                object.nuxAction = $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction.toObject(message.nuxAction, options);
            if (message.primaryVersionAction != null && message.hasOwnProperty("primaryVersionAction"))
                object.primaryVersionAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.toObject(message.primaryVersionAction, options);
            if (message.stickerAction != null && message.hasOwnProperty("stickerAction"))
                object.stickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction.toObject(message.stickerAction, options);
            if (message.removeRecentStickerAction != null && message.hasOwnProperty("removeRecentStickerAction"))
                object.removeRecentStickerAction = $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.toObject(message.removeRecentStickerAction, options);
            if (message.chatAssignment != null && message.hasOwnProperty("chatAssignment"))
                object.chatAssignment = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.toObject(message.chatAssignment, options);
            if (message.chatAssignmentOpenedStatus != null && message.hasOwnProperty("chatAssignmentOpenedStatus"))
                object.chatAssignmentOpenedStatus = $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.toObject(message.chatAssignmentOpenedStatus, options);
            if (message.pnForLidChatAction != null && message.hasOwnProperty("pnForLidChatAction"))
                object.pnForLidChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.toObject(message.pnForLidChatAction, options);
            if (message.marketingMessageAction != null && message.hasOwnProperty("marketingMessageAction"))
                object.marketingMessageAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.toObject(message.marketingMessageAction, options);
            if (message.marketingMessageBroadcastAction != null && message.hasOwnProperty("marketingMessageBroadcastAction"))
                object.marketingMessageBroadcastAction = $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.toObject(message.marketingMessageBroadcastAction, options);
            if (message.externalWebBetaAction != null && message.hasOwnProperty("externalWebBetaAction"))
                object.externalWebBetaAction = $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.toObject(message.externalWebBetaAction, options);
            if (message.privacySettingRelayAllCalls != null && message.hasOwnProperty("privacySettingRelayAllCalls"))
                object.privacySettingRelayAllCalls = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.toObject(message.privacySettingRelayAllCalls, options);
            if (message.callLogAction != null && message.hasOwnProperty("callLogAction"))
                object.callLogAction = $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction.toObject(message.callLogAction, options);
            if (message.statusPrivacy != null && message.hasOwnProperty("statusPrivacy"))
                object.statusPrivacy = $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.toObject(message.statusPrivacy, options);
            if (message.botWelcomeRequestAction != null && message.hasOwnProperty("botWelcomeRequestAction"))
                object.botWelcomeRequestAction = $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.toObject(message.botWelcomeRequestAction, options);
            if (message.deleteIndividualCallLog != null && message.hasOwnProperty("deleteIndividualCallLog"))
                object.deleteIndividualCallLog = $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.toObject(message.deleteIndividualCallLog, options);
            if (message.labelReorderingAction != null && message.hasOwnProperty("labelReorderingAction"))
                object.labelReorderingAction = $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.toObject(message.labelReorderingAction, options);
            if (message.paymentInfoAction != null && message.hasOwnProperty("paymentInfoAction"))
                object.paymentInfoAction = $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.toObject(message.paymentInfoAction, options);
            if (message.customPaymentMethodsAction != null && message.hasOwnProperty("customPaymentMethodsAction"))
                object.customPaymentMethodsAction = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.toObject(message.customPaymentMethodsAction, options);
            if (message.lockChatAction != null && message.hasOwnProperty("lockChatAction"))
                object.lockChatAction = $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction.toObject(message.lockChatAction, options);
            if (message.chatLockSettings != null && message.hasOwnProperty("chatLockSettings"))
                object.chatLockSettings = $root.WAChatLockSettings.ChatLockSettings.toObject(message.chatLockSettings, options);
            if (message.wamoUserIdentifierAction != null && message.hasOwnProperty("wamoUserIdentifierAction"))
                object.wamoUserIdentifierAction = $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.toObject(message.wamoUserIdentifierAction, options);
            if (message.privacySettingDisableLinkPreviewsAction != null && message.hasOwnProperty("privacySettingDisableLinkPreviewsAction"))
                object.privacySettingDisableLinkPreviewsAction = $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.toObject(message.privacySettingDisableLinkPreviewsAction, options);
            if (message.deviceCapabilities != null && message.hasOwnProperty("deviceCapabilities"))
                object.deviceCapabilities = $root.WADeviceCapabilities.DeviceCapabilities.toObject(message.deviceCapabilities, options);
            if (message.noteEditAction != null && message.hasOwnProperty("noteEditAction"))
                object.noteEditAction = $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.toObject(message.noteEditAction, options);
            if (message.favoritesAction != null && message.hasOwnProperty("favoritesAction"))
                object.favoritesAction = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.toObject(message.favoritesAction, options);
            if (message.merchantPaymentPartnerAction != null && message.hasOwnProperty("merchantPaymentPartnerAction"))
                object.merchantPaymentPartnerAction = $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.toObject(message.merchantPaymentPartnerAction, options);
            if (message.waffleAccountLinkStateAction != null && message.hasOwnProperty("waffleAccountLinkStateAction"))
                object.waffleAccountLinkStateAction = $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.toObject(message.waffleAccountLinkStateAction, options);
            return object;
        };

        /**
         * Converts this SyncActionValue to JSON.
         * @function toJSON
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncActionValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncActionValue
         * @function getTypeUrl
         * @memberof WAWebProtobufSyncAction.SyncActionValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncActionValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue";
        };

        SyncActionValue.WaffleAccountLinkStateAction = (function() {

            /**
             * Properties of a WaffleAccountLinkStateAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IWaffleAccountLinkStateAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState|null} [linkState] WaffleAccountLinkStateAction linkState
             */

            /**
             * Constructs a new WaffleAccountLinkStateAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a WaffleAccountLinkStateAction.
             * @implements IWaffleAccountLinkStateAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction=} [properties] Properties to set
             */
            function WaffleAccountLinkStateAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * WaffleAccountLinkStateAction linkState.
             * @member {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState} linkState
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @instance
             */
            WaffleAccountLinkStateAction.prototype.linkState = 0;

            /**
             * Creates a new WaffleAccountLinkStateAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction} WaffleAccountLinkStateAction instance
             */
            WaffleAccountLinkStateAction.create = function create(properties) {
                return new WaffleAccountLinkStateAction(properties);
            };

            /**
             * Encodes the specified WaffleAccountLinkStateAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction} message WaffleAccountLinkStateAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WaffleAccountLinkStateAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.linkState != null && Object.hasOwnProperty.call(message, "linkState"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.linkState);
                return writer;
            };

            /**
             * Encodes the specified WaffleAccountLinkStateAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction} message WaffleAccountLinkStateAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WaffleAccountLinkStateAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction} WaffleAccountLinkStateAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WaffleAccountLinkStateAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.linkState = reader.int32();
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
             * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction} WaffleAccountLinkStateAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WaffleAccountLinkStateAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WaffleAccountLinkStateAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WaffleAccountLinkStateAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.linkState != null && message.hasOwnProperty("linkState"))
                    switch (message.linkState) {
                    default:
                        return "linkState: enum value expected";
                    case 0:
                        break;
                    }
                return null;
            };

            /**
             * Creates a WaffleAccountLinkStateAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction} WaffleAccountLinkStateAction
             */
            WaffleAccountLinkStateAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction();
                switch (object.linkState) {
                default:
                    if (typeof object.linkState === "number") {
                        message.linkState = object.linkState;
                        break;
                    }
                    break;
                case "ACTIVE":
                case 0:
                    message.linkState = 0;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a WaffleAccountLinkStateAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction} message WaffleAccountLinkStateAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WaffleAccountLinkStateAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.linkState = options.enums === String ? "ACTIVE" : 0;
                if (message.linkState != null && message.hasOwnProperty("linkState"))
                    object.linkState = options.enums === String ? $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState[message.linkState] === undefined ? message.linkState : $root.WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState[message.linkState] : message.linkState;
                return object;
            };

            /**
             * Converts this WaffleAccountLinkStateAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WaffleAccountLinkStateAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for WaffleAccountLinkStateAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            WaffleAccountLinkStateAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction";
            };

            /**
             * AccountLinkState enum.
             * @name WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState
             * @enum {number}
             * @property {number} ACTIVE=0 ACTIVE value
             */
            WaffleAccountLinkStateAction.AccountLinkState = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ACTIVE"] = 0;
                return values;
            })();

            return WaffleAccountLinkStateAction;
        })();

        SyncActionValue.MerchantPaymentPartnerAction = (function() {

            /**
             * Properties of a MerchantPaymentPartnerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IMerchantPaymentPartnerAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status} status MerchantPaymentPartnerAction status
             * @property {string} country MerchantPaymentPartnerAction country
             * @property {string|null} [gatewayName] MerchantPaymentPartnerAction gatewayName
             * @property {string|null} [credentialID] MerchantPaymentPartnerAction credentialID
             */

            /**
             * Constructs a new MerchantPaymentPartnerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a MerchantPaymentPartnerAction.
             * @implements IMerchantPaymentPartnerAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction=} [properties] Properties to set
             */
            function MerchantPaymentPartnerAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MerchantPaymentPartnerAction status.
             * @member {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status} status
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @instance
             */
            MerchantPaymentPartnerAction.prototype.status = 0;

            /**
             * MerchantPaymentPartnerAction country.
             * @member {string} country
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @instance
             */
            MerchantPaymentPartnerAction.prototype.country = "";

            /**
             * MerchantPaymentPartnerAction gatewayName.
             * @member {string} gatewayName
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @instance
             */
            MerchantPaymentPartnerAction.prototype.gatewayName = "";

            /**
             * MerchantPaymentPartnerAction credentialID.
             * @member {string} credentialID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @instance
             */
            MerchantPaymentPartnerAction.prototype.credentialID = "";

            /**
             * Creates a new MerchantPaymentPartnerAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction} MerchantPaymentPartnerAction instance
             */
            MerchantPaymentPartnerAction.create = function create(properties) {
                return new MerchantPaymentPartnerAction(properties);
            };

            /**
             * Encodes the specified MerchantPaymentPartnerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction} message MerchantPaymentPartnerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MerchantPaymentPartnerAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.country);
                if (message.gatewayName != null && Object.hasOwnProperty.call(message, "gatewayName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.gatewayName);
                if (message.credentialID != null && Object.hasOwnProperty.call(message, "credentialID"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.credentialID);
                return writer;
            };

            /**
             * Encodes the specified MerchantPaymentPartnerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction} message MerchantPaymentPartnerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MerchantPaymentPartnerAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction} MerchantPaymentPartnerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MerchantPaymentPartnerAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.status = reader.int32();
                            break;
                        }
                    case 2: {
                            message.country = reader.string();
                            break;
                        }
                    case 3: {
                            message.gatewayName = reader.string();
                            break;
                        }
                    case 4: {
                            message.credentialID = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                if (!message.hasOwnProperty("country"))
                    throw $util.ProtocolError("missing required 'country'", { instance: message });
                return message;
            };

            /**
             * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction} MerchantPaymentPartnerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MerchantPaymentPartnerAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MerchantPaymentPartnerAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MerchantPaymentPartnerAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 1:
                    break;
                }
                if (!$util.isString(message.country))
                    return "country: string expected";
                if (message.gatewayName != null && message.hasOwnProperty("gatewayName"))
                    if (!$util.isString(message.gatewayName))
                        return "gatewayName: string expected";
                if (message.credentialID != null && message.hasOwnProperty("credentialID"))
                    if (!$util.isString(message.credentialID))
                        return "credentialID: string expected";
                return null;
            };

            /**
             * Creates a MerchantPaymentPartnerAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction} MerchantPaymentPartnerAction
             */
            MerchantPaymentPartnerAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction();
                switch (object.status) {
                default:
                    if (typeof object.status === "number") {
                        message.status = object.status;
                        break;
                    }
                    break;
                case "ACTIVE":
                case 0:
                    message.status = 0;
                    break;
                case "INACTIVE":
                case 1:
                    message.status = 1;
                    break;
                }
                if (object.country != null)
                    message.country = String(object.country);
                if (object.gatewayName != null)
                    message.gatewayName = String(object.gatewayName);
                if (object.credentialID != null)
                    message.credentialID = String(object.credentialID);
                return message;
            };

            /**
             * Creates a plain object from a MerchantPaymentPartnerAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction} message MerchantPaymentPartnerAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MerchantPaymentPartnerAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.status = options.enums === String ? "ACTIVE" : 0;
                    object.country = "";
                    object.gatewayName = "";
                    object.credentialID = "";
                }
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = options.enums === String ? $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status[message.status] === undefined ? message.status : $root.WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status[message.status] : message.status;
                if (message.country != null && message.hasOwnProperty("country"))
                    object.country = message.country;
                if (message.gatewayName != null && message.hasOwnProperty("gatewayName"))
                    object.gatewayName = message.gatewayName;
                if (message.credentialID != null && message.hasOwnProperty("credentialID"))
                    object.credentialID = message.credentialID;
                return object;
            };

            /**
             * Converts this MerchantPaymentPartnerAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MerchantPaymentPartnerAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MerchantPaymentPartnerAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MerchantPaymentPartnerAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction";
            };

            /**
             * Status enum.
             * @name WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status
             * @enum {number}
             * @property {number} ACTIVE=0 ACTIVE value
             * @property {number} INACTIVE=1 INACTIVE value
             */
            MerchantPaymentPartnerAction.Status = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ACTIVE"] = 0;
                values[valuesById[1] = "INACTIVE"] = 1;
                return values;
            })();

            return MerchantPaymentPartnerAction;
        })();

        SyncActionValue.NoteEditAction = (function() {

            /**
             * Properties of a NoteEditAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface INoteEditAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType|null} [type] NoteEditAction type
             * @property {string|null} [chatJID] NoteEditAction chatJID
             * @property {number|Long|null} [createdAt] NoteEditAction createdAt
             * @property {boolean|null} [deleted] NoteEditAction deleted
             * @property {string|null} [unstructuredContent] NoteEditAction unstructuredContent
             */

            /**
             * Constructs a new NoteEditAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a NoteEditAction.
             * @implements INoteEditAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction=} [properties] Properties to set
             */
            function NoteEditAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NoteEditAction type.
             * @member {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType} type
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             */
            NoteEditAction.prototype.type = 1;

            /**
             * NoteEditAction chatJID.
             * @member {string} chatJID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             */
            NoteEditAction.prototype.chatJID = "";

            /**
             * NoteEditAction createdAt.
             * @member {number|Long} createdAt
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             */
            NoteEditAction.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * NoteEditAction deleted.
             * @member {boolean} deleted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             */
            NoteEditAction.prototype.deleted = false;

            /**
             * NoteEditAction unstructuredContent.
             * @member {string} unstructuredContent
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             */
            NoteEditAction.prototype.unstructuredContent = "";

            /**
             * Creates a new NoteEditAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction} NoteEditAction instance
             */
            NoteEditAction.create = function create(properties) {
                return new NoteEditAction(properties);
            };

            /**
             * Encodes the specified NoteEditAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction} message NoteEditAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoteEditAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.chatJID != null && Object.hasOwnProperty.call(message, "chatJID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.chatJID);
                if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.createdAt);
                if (message.deleted != null && Object.hasOwnProperty.call(message, "deleted"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deleted);
                if (message.unstructuredContent != null && Object.hasOwnProperty.call(message, "unstructuredContent"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.unstructuredContent);
                return writer;
            };

            /**
             * Encodes the specified NoteEditAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INoteEditAction} message NoteEditAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NoteEditAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NoteEditAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction} NoteEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoteEditAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.chatJID = reader.string();
                            break;
                        }
                    case 3: {
                            message.createdAt = reader.int64();
                            break;
                        }
                    case 4: {
                            message.deleted = reader.bool();
                            break;
                        }
                    case 5: {
                            message.unstructuredContent = reader.string();
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
             * Decodes a NoteEditAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction} NoteEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NoteEditAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NoteEditAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NoteEditAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 1:
                    case 2:
                        break;
                    }
                if (message.chatJID != null && message.hasOwnProperty("chatJID"))
                    if (!$util.isString(message.chatJID))
                        return "chatJID: string expected";
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                        return "createdAt: integer|Long expected";
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    if (typeof message.deleted !== "boolean")
                        return "deleted: boolean expected";
                if (message.unstructuredContent != null && message.hasOwnProperty("unstructuredContent"))
                    if (!$util.isString(message.unstructuredContent))
                        return "unstructuredContent: string expected";
                return null;
            };

            /**
             * Creates a NoteEditAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction} NoteEditAction
             */
            NoteEditAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "UNSTRUCTURED":
                case 1:
                    message.type = 1;
                    break;
                case "STRUCTURED":
                case 2:
                    message.type = 2;
                    break;
                }
                if (object.chatJID != null)
                    message.chatJID = String(object.chatJID);
                if (object.createdAt != null)
                    if ($util.Long)
                        (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                    else if (typeof object.createdAt === "string")
                        message.createdAt = parseInt(object.createdAt, 10);
                    else if (typeof object.createdAt === "number")
                        message.createdAt = object.createdAt;
                    else if (typeof object.createdAt === "object")
                        message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
                if (object.deleted != null)
                    message.deleted = Boolean(object.deleted);
                if (object.unstructuredContent != null)
                    message.unstructuredContent = String(object.unstructuredContent);
                return message;
            };

            /**
             * Creates a plain object from a NoteEditAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.NoteEditAction} message NoteEditAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NoteEditAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "UNSTRUCTURED" : 1;
                    object.chatJID = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.createdAt = options.longs === String ? "0" : 0;
                    object.deleted = false;
                    object.unstructuredContent = "";
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType[message.type] === undefined ? message.type : $root.WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType[message.type] : message.type;
                if (message.chatJID != null && message.hasOwnProperty("chatJID"))
                    object.chatJID = message.chatJID;
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (typeof message.createdAt === "number")
                        object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                    else
                        object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    object.deleted = message.deleted;
                if (message.unstructuredContent != null && message.hasOwnProperty("unstructuredContent"))
                    object.unstructuredContent = message.unstructuredContent;
                return object;
            };

            /**
             * Converts this NoteEditAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NoteEditAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NoteEditAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NoteEditAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NoteEditAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.NoteEditAction";
            };

            /**
             * NoteType enum.
             * @name WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType
             * @enum {number}
             * @property {number} UNSTRUCTURED=1 UNSTRUCTURED value
             * @property {number} STRUCTURED=2 STRUCTURED value
             */
            NoteEditAction.NoteType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[1] = "UNSTRUCTURED"] = 1;
                values[valuesById[2] = "STRUCTURED"] = 2;
                return values;
            })();

            return NoteEditAction;
        })();

        SyncActionValue.StatusPrivacyAction = (function() {

            /**
             * Properties of a StatusPrivacyAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IStatusPrivacyAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode|null} [mode] StatusPrivacyAction mode
             * @property {Array.<string>|null} [userJID] StatusPrivacyAction userJID
             */

            /**
             * Constructs a new StatusPrivacyAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a StatusPrivacyAction.
             * @implements IStatusPrivacyAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction=} [properties] Properties to set
             */
            function StatusPrivacyAction(properties) {
                this.userJID = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StatusPrivacyAction mode.
             * @member {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode} mode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @instance
             */
            StatusPrivacyAction.prototype.mode = 0;

            /**
             * StatusPrivacyAction userJID.
             * @member {Array.<string>} userJID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @instance
             */
            StatusPrivacyAction.prototype.userJID = $util.emptyArray;

            /**
             * Creates a new StatusPrivacyAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction} StatusPrivacyAction instance
             */
            StatusPrivacyAction.create = function create(properties) {
                return new StatusPrivacyAction(properties);
            };

            /**
             * Encodes the specified StatusPrivacyAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction} message StatusPrivacyAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StatusPrivacyAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.mode);
                if (message.userJID != null && message.userJID.length)
                    for (var i = 0; i < message.userJID.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.userJID[i]);
                return writer;
            };

            /**
             * Encodes the specified StatusPrivacyAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction} message StatusPrivacyAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StatusPrivacyAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StatusPrivacyAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction} StatusPrivacyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StatusPrivacyAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.mode = reader.int32();
                            break;
                        }
                    case 2: {
                            if (!(message.userJID && message.userJID.length))
                                message.userJID = [];
                            message.userJID.push(reader.string());
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
             * Decodes a StatusPrivacyAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction} StatusPrivacyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StatusPrivacyAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StatusPrivacyAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StatusPrivacyAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.mode != null && message.hasOwnProperty("mode"))
                    switch (message.mode) {
                    default:
                        return "mode: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.userJID != null && message.hasOwnProperty("userJID")) {
                    if (!Array.isArray(message.userJID))
                        return "userJID: array expected";
                    for (var i = 0; i < message.userJID.length; ++i)
                        if (!$util.isString(message.userJID[i]))
                            return "userJID: string[] expected";
                }
                return null;
            };

            /**
             * Creates a StatusPrivacyAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction} StatusPrivacyAction
             */
            StatusPrivacyAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction();
                switch (object.mode) {
                default:
                    if (typeof object.mode === "number") {
                        message.mode = object.mode;
                        break;
                    }
                    break;
                case "ALLOW_LIST":
                case 0:
                    message.mode = 0;
                    break;
                case "DENY_LIST":
                case 1:
                    message.mode = 1;
                    break;
                case "CONTACTS":
                case 2:
                    message.mode = 2;
                    break;
                }
                if (object.userJID) {
                    if (!Array.isArray(object.userJID))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.userJID: array expected");
                    message.userJID = [];
                    for (var i = 0; i < object.userJID.length; ++i)
                        message.userJID[i] = String(object.userJID[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a StatusPrivacyAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction} message StatusPrivacyAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StatusPrivacyAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.userJID = [];
                if (options.defaults)
                    object.mode = options.enums === String ? "ALLOW_LIST" : 0;
                if (message.mode != null && message.hasOwnProperty("mode"))
                    object.mode = options.enums === String ? $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode[message.mode] === undefined ? message.mode : $root.WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode[message.mode] : message.mode;
                if (message.userJID && message.userJID.length) {
                    object.userJID = [];
                    for (var j = 0; j < message.userJID.length; ++j)
                        object.userJID[j] = message.userJID[j];
                }
                return object;
            };

            /**
             * Converts this StatusPrivacyAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StatusPrivacyAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StatusPrivacyAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StatusPrivacyAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction";
            };

            /**
             * StatusDistributionMode enum.
             * @name WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode
             * @enum {number}
             * @property {number} ALLOW_LIST=0 ALLOW_LIST value
             * @property {number} DENY_LIST=1 DENY_LIST value
             * @property {number} CONTACTS=2 CONTACTS value
             */
            StatusPrivacyAction.StatusDistributionMode = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ALLOW_LIST"] = 0;
                values[valuesById[1] = "DENY_LIST"] = 1;
                values[valuesById[2] = "CONTACTS"] = 2;
                return values;
            })();

            return StatusPrivacyAction;
        })();

        SyncActionValue.MarketingMessageAction = (function() {

            /**
             * Properties of a MarketingMessageAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IMarketingMessageAction
             * @property {string|null} [name] MarketingMessageAction name
             * @property {string|null} [message] MarketingMessageAction message
             * @property {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType|null} [type] MarketingMessageAction type
             * @property {number|Long|null} [createdAt] MarketingMessageAction createdAt
             * @property {number|Long|null} [lastSentAt] MarketingMessageAction lastSentAt
             * @property {boolean|null} [isDeleted] MarketingMessageAction isDeleted
             * @property {string|null} [mediaID] MarketingMessageAction mediaID
             */

            /**
             * Constructs a new MarketingMessageAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a MarketingMessageAction.
             * @implements IMarketingMessageAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction=} [properties] Properties to set
             */
            function MarketingMessageAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarketingMessageAction name.
             * @member {string} name
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.name = "";

            /**
             * MarketingMessageAction message.
             * @member {string} message
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.message = "";

            /**
             * MarketingMessageAction type.
             * @member {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType} type
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.type = 0;

            /**
             * MarketingMessageAction createdAt.
             * @member {number|Long} createdAt
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * MarketingMessageAction lastSentAt.
             * @member {number|Long} lastSentAt
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.lastSentAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * MarketingMessageAction isDeleted.
             * @member {boolean} isDeleted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.isDeleted = false;

            /**
             * MarketingMessageAction mediaID.
             * @member {string} mediaID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             */
            MarketingMessageAction.prototype.mediaID = "";

            /**
             * Creates a new MarketingMessageAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction} MarketingMessageAction instance
             */
            MarketingMessageAction.create = function create(properties) {
                return new MarketingMessageAction(properties);
            };

            /**
             * Encodes the specified MarketingMessageAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction} message MarketingMessageAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketingMessageAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.createdAt);
                if (message.lastSentAt != null && Object.hasOwnProperty.call(message, "lastSentAt"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.lastSentAt);
                if (message.isDeleted != null && Object.hasOwnProperty.call(message, "isDeleted"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isDeleted);
                if (message.mediaID != null && Object.hasOwnProperty.call(message, "mediaID"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.mediaID);
                return writer;
            };

            /**
             * Encodes the specified MarketingMessageAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction} message MarketingMessageAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketingMessageAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarketingMessageAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction} MarketingMessageAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketingMessageAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            message.type = reader.int32();
                            break;
                        }
                    case 4: {
                            message.createdAt = reader.int64();
                            break;
                        }
                    case 5: {
                            message.lastSentAt = reader.int64();
                            break;
                        }
                    case 6: {
                            message.isDeleted = reader.bool();
                            break;
                        }
                    case 7: {
                            message.mediaID = reader.string();
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
             * Decodes a MarketingMessageAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction} MarketingMessageAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketingMessageAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarketingMessageAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarketingMessageAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                        break;
                    }
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                        return "createdAt: integer|Long expected";
                if (message.lastSentAt != null && message.hasOwnProperty("lastSentAt"))
                    if (!$util.isInteger(message.lastSentAt) && !(message.lastSentAt && $util.isInteger(message.lastSentAt.low) && $util.isInteger(message.lastSentAt.high)))
                        return "lastSentAt: integer|Long expected";
                if (message.isDeleted != null && message.hasOwnProperty("isDeleted"))
                    if (typeof message.isDeleted !== "boolean")
                        return "isDeleted: boolean expected";
                if (message.mediaID != null && message.hasOwnProperty("mediaID"))
                    if (!$util.isString(message.mediaID))
                        return "mediaID: string expected";
                return null;
            };

            /**
             * Creates a MarketingMessageAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction} MarketingMessageAction
             */
            MarketingMessageAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.message != null)
                    message.message = String(object.message);
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "PERSONALIZED":
                case 0:
                    message.type = 0;
                    break;
                }
                if (object.createdAt != null)
                    if ($util.Long)
                        (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                    else if (typeof object.createdAt === "string")
                        message.createdAt = parseInt(object.createdAt, 10);
                    else if (typeof object.createdAt === "number")
                        message.createdAt = object.createdAt;
                    else if (typeof object.createdAt === "object")
                        message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
                if (object.lastSentAt != null)
                    if ($util.Long)
                        (message.lastSentAt = $util.Long.fromValue(object.lastSentAt)).unsigned = false;
                    else if (typeof object.lastSentAt === "string")
                        message.lastSentAt = parseInt(object.lastSentAt, 10);
                    else if (typeof object.lastSentAt === "number")
                        message.lastSentAt = object.lastSentAt;
                    else if (typeof object.lastSentAt === "object")
                        message.lastSentAt = new $util.LongBits(object.lastSentAt.low >>> 0, object.lastSentAt.high >>> 0).toNumber();
                if (object.isDeleted != null)
                    message.isDeleted = Boolean(object.isDeleted);
                if (object.mediaID != null)
                    message.mediaID = String(object.mediaID);
                return message;
            };

            /**
             * Creates a plain object from a MarketingMessageAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction} message MarketingMessageAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarketingMessageAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.message = "";
                    object.type = options.enums === String ? "PERSONALIZED" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.createdAt = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.lastSentAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastSentAt = options.longs === String ? "0" : 0;
                    object.isDeleted = false;
                    object.mediaID = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType[message.type] === undefined ? message.type : $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType[message.type] : message.type;
                if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                    if (typeof message.createdAt === "number")
                        object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                    else
                        object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
                if (message.lastSentAt != null && message.hasOwnProperty("lastSentAt"))
                    if (typeof message.lastSentAt === "number")
                        object.lastSentAt = options.longs === String ? String(message.lastSentAt) : message.lastSentAt;
                    else
                        object.lastSentAt = options.longs === String ? $util.Long.prototype.toString.call(message.lastSentAt) : options.longs === Number ? new $util.LongBits(message.lastSentAt.low >>> 0, message.lastSentAt.high >>> 0).toNumber() : message.lastSentAt;
                if (message.isDeleted != null && message.hasOwnProperty("isDeleted"))
                    object.isDeleted = message.isDeleted;
                if (message.mediaID != null && message.hasOwnProperty("mediaID"))
                    object.mediaID = message.mediaID;
                return object;
            };

            /**
             * Converts this MarketingMessageAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarketingMessageAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MarketingMessageAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MarketingMessageAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction";
            };

            /**
             * MarketingMessagePrototypeType enum.
             * @name WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType
             * @enum {number}
             * @property {number} PERSONALIZED=0 PERSONALIZED value
             */
            MarketingMessageAction.MarketingMessagePrototypeType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PERSONALIZED"] = 0;
                return values;
            })();

            return MarketingMessageAction;
        })();

        SyncActionValue.FavoritesAction = (function() {

            /**
             * Properties of a FavoritesAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IFavoritesAction
             * @property {Array.<WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite>|null} [favorites] FavoritesAction favorites
             */

            /**
             * Constructs a new FavoritesAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a FavoritesAction.
             * @implements IFavoritesAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction=} [properties] Properties to set
             */
            function FavoritesAction(properties) {
                this.favorites = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FavoritesAction favorites.
             * @member {Array.<WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite>} favorites
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @instance
             */
            FavoritesAction.prototype.favorites = $util.emptyArray;

            /**
             * Creates a new FavoritesAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction} FavoritesAction instance
             */
            FavoritesAction.create = function create(properties) {
                return new FavoritesAction(properties);
            };

            /**
             * Encodes the specified FavoritesAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction} message FavoritesAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FavoritesAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.favorites != null && message.favorites.length)
                    for (var i = 0; i < message.favorites.length; ++i)
                        $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.encode(message.favorites[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified FavoritesAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction} message FavoritesAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FavoritesAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FavoritesAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction} FavoritesAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FavoritesAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.favorites && message.favorites.length))
                                message.favorites = [];
                            message.favorites.push($root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.decode(reader, reader.uint32()));
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
             * Decodes a FavoritesAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction} FavoritesAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FavoritesAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FavoritesAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FavoritesAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.favorites != null && message.hasOwnProperty("favorites")) {
                    if (!Array.isArray(message.favorites))
                        return "favorites: array expected";
                    for (var i = 0; i < message.favorites.length; ++i) {
                        var error = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.verify(message.favorites[i]);
                        if (error)
                            return "favorites." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a FavoritesAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction} FavoritesAction
             */
            FavoritesAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction();
                if (object.favorites) {
                    if (!Array.isArray(object.favorites))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.favorites: array expected");
                    message.favorites = [];
                    for (var i = 0; i < object.favorites.length; ++i) {
                        if (typeof object.favorites[i] !== "object")
                            throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.favorites: object expected");
                        message.favorites[i] = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.fromObject(object.favorites[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a FavoritesAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction} message FavoritesAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FavoritesAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.favorites = [];
                if (message.favorites && message.favorites.length) {
                    object.favorites = [];
                    for (var j = 0; j < message.favorites.length; ++j)
                        object.favorites[j] = $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.toObject(message.favorites[j], options);
                }
                return object;
            };

            /**
             * Converts this FavoritesAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FavoritesAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FavoritesAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FavoritesAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.FavoritesAction";
            };

            FavoritesAction.Favorite = (function() {

                /**
                 * Properties of a Favorite.
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
                 * @interface IFavorite
                 * @property {string|null} [ID] Favorite ID
                 */

                /**
                 * Constructs a new Favorite.
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction
                 * @classdesc Represents a Favorite.
                 * @implements IFavorite
                 * @constructor
                 * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite=} [properties] Properties to set
                 */
                function Favorite(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Favorite ID.
                 * @member {string} ID
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @instance
                 */
                Favorite.prototype.ID = "";

                /**
                 * Creates a new Favorite instance using the specified properties.
                 * @function create
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite=} [properties] Properties to set
                 * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite} Favorite instance
                 */
                Favorite.create = function create(properties) {
                    return new Favorite(properties);
                };

                /**
                 * Encodes the specified Favorite message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.verify|verify} messages.
                 * @function encode
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite} message Favorite message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Favorite.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
                    return writer;
                };

                /**
                 * Encodes the specified Favorite message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite} message Favorite message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Favorite.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Favorite message from the specified reader or buffer.
                 * @function decode
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite} Favorite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Favorite.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.ID = reader.string();
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
                 * Decodes a Favorite message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite} Favorite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Favorite.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Favorite message.
                 * @function verify
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Favorite.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.ID != null && message.hasOwnProperty("ID"))
                        if (!$util.isString(message.ID))
                            return "ID: string expected";
                    return null;
                };

                /**
                 * Creates a Favorite message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite} Favorite
                 */
                Favorite.fromObject = function fromObject(object) {
                    if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite)
                        return object;
                    var message = new $root.WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite();
                    if (object.ID != null)
                        message.ID = String(object.ID);
                    return message;
                };

                /**
                 * Creates a plain object from a Favorite message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite} message Favorite
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Favorite.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.ID = "";
                    if (message.ID != null && message.hasOwnProperty("ID"))
                        object.ID = message.ID;
                    return object;
                };

                /**
                 * Converts this Favorite to JSON.
                 * @function toJSON
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Favorite.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Favorite
                 * @function getTypeUrl
                 * @memberof WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Favorite.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite";
                };

                return Favorite;
            })();

            return FavoritesAction;
        })();

        SyncActionValue.PrivacySettingDisableLinkPreviewsAction = (function() {

            /**
             * Properties of a PrivacySettingDisableLinkPreviewsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPrivacySettingDisableLinkPreviewsAction
             * @property {boolean|null} [isPreviewsDisabled] PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled
             */

            /**
             * Constructs a new PrivacySettingDisableLinkPreviewsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PrivacySettingDisableLinkPreviewsAction.
             * @implements IPrivacySettingDisableLinkPreviewsAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction=} [properties] Properties to set
             */
            function PrivacySettingDisableLinkPreviewsAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled.
             * @member {boolean} isPreviewsDisabled
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @instance
             */
            PrivacySettingDisableLinkPreviewsAction.prototype.isPreviewsDisabled = false;

            /**
             * Creates a new PrivacySettingDisableLinkPreviewsAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction} PrivacySettingDisableLinkPreviewsAction instance
             */
            PrivacySettingDisableLinkPreviewsAction.create = function create(properties) {
                return new PrivacySettingDisableLinkPreviewsAction(properties);
            };

            /**
             * Encodes the specified PrivacySettingDisableLinkPreviewsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction} message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrivacySettingDisableLinkPreviewsAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isPreviewsDisabled != null && Object.hasOwnProperty.call(message, "isPreviewsDisabled"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isPreviewsDisabled);
                return writer;
            };

            /**
             * Encodes the specified PrivacySettingDisableLinkPreviewsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction} message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrivacySettingDisableLinkPreviewsAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction} PrivacySettingDisableLinkPreviewsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrivacySettingDisableLinkPreviewsAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isPreviewsDisabled = reader.bool();
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
             * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction} PrivacySettingDisableLinkPreviewsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrivacySettingDisableLinkPreviewsAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PrivacySettingDisableLinkPreviewsAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PrivacySettingDisableLinkPreviewsAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isPreviewsDisabled != null && message.hasOwnProperty("isPreviewsDisabled"))
                    if (typeof message.isPreviewsDisabled !== "boolean")
                        return "isPreviewsDisabled: boolean expected";
                return null;
            };

            /**
             * Creates a PrivacySettingDisableLinkPreviewsAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction} PrivacySettingDisableLinkPreviewsAction
             */
            PrivacySettingDisableLinkPreviewsAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction();
                if (object.isPreviewsDisabled != null)
                    message.isPreviewsDisabled = Boolean(object.isPreviewsDisabled);
                return message;
            };

            /**
             * Creates a plain object from a PrivacySettingDisableLinkPreviewsAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction} message PrivacySettingDisableLinkPreviewsAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PrivacySettingDisableLinkPreviewsAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.isPreviewsDisabled = false;
                if (message.isPreviewsDisabled != null && message.hasOwnProperty("isPreviewsDisabled"))
                    object.isPreviewsDisabled = message.isPreviewsDisabled;
                return object;
            };

            /**
             * Converts this PrivacySettingDisableLinkPreviewsAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PrivacySettingDisableLinkPreviewsAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PrivacySettingDisableLinkPreviewsAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PrivacySettingDisableLinkPreviewsAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction";
            };

            return PrivacySettingDisableLinkPreviewsAction;
        })();

        SyncActionValue.WamoUserIdentifierAction = (function() {

            /**
             * Properties of a WamoUserIdentifierAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IWamoUserIdentifierAction
             * @property {string|null} [identifier] WamoUserIdentifierAction identifier
             */

            /**
             * Constructs a new WamoUserIdentifierAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a WamoUserIdentifierAction.
             * @implements IWamoUserIdentifierAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction=} [properties] Properties to set
             */
            function WamoUserIdentifierAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * WamoUserIdentifierAction identifier.
             * @member {string} identifier
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @instance
             */
            WamoUserIdentifierAction.prototype.identifier = "";

            /**
             * Creates a new WamoUserIdentifierAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction} WamoUserIdentifierAction instance
             */
            WamoUserIdentifierAction.create = function create(properties) {
                return new WamoUserIdentifierAction(properties);
            };

            /**
             * Encodes the specified WamoUserIdentifierAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction} message WamoUserIdentifierAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WamoUserIdentifierAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.identifier != null && Object.hasOwnProperty.call(message, "identifier"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.identifier);
                return writer;
            };

            /**
             * Encodes the specified WamoUserIdentifierAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction} message WamoUserIdentifierAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WamoUserIdentifierAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a WamoUserIdentifierAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction} WamoUserIdentifierAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WamoUserIdentifierAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.identifier = reader.string();
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
             * Decodes a WamoUserIdentifierAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction} WamoUserIdentifierAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WamoUserIdentifierAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WamoUserIdentifierAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WamoUserIdentifierAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.identifier != null && message.hasOwnProperty("identifier"))
                    if (!$util.isString(message.identifier))
                        return "identifier: string expected";
                return null;
            };

            /**
             * Creates a WamoUserIdentifierAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction} WamoUserIdentifierAction
             */
            WamoUserIdentifierAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction();
                if (object.identifier != null)
                    message.identifier = String(object.identifier);
                return message;
            };

            /**
             * Creates a plain object from a WamoUserIdentifierAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction} message WamoUserIdentifierAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WamoUserIdentifierAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.identifier = "";
                if (message.identifier != null && message.hasOwnProperty("identifier"))
                    object.identifier = message.identifier;
                return object;
            };

            /**
             * Converts this WamoUserIdentifierAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WamoUserIdentifierAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for WamoUserIdentifierAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            WamoUserIdentifierAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction";
            };

            return WamoUserIdentifierAction;
        })();

        SyncActionValue.LockChatAction = (function() {

            /**
             * Properties of a LockChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ILockChatAction
             * @property {boolean|null} [locked] LockChatAction locked
             */

            /**
             * Constructs a new LockChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a LockChatAction.
             * @implements ILockChatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction=} [properties] Properties to set
             */
            function LockChatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LockChatAction locked.
             * @member {boolean} locked
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @instance
             */
            LockChatAction.prototype.locked = false;

            /**
             * Creates a new LockChatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LockChatAction} LockChatAction instance
             */
            LockChatAction.create = function create(properties) {
                return new LockChatAction(properties);
            };

            /**
             * Encodes the specified LockChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LockChatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction} message LockChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LockChatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.locked != null && Object.hasOwnProperty.call(message, "locked"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.locked);
                return writer;
            };

            /**
             * Encodes the specified LockChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LockChatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILockChatAction} message LockChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LockChatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LockChatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LockChatAction} LockChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LockChatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.locked = reader.bool();
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
             * Decodes a LockChatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LockChatAction} LockChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LockChatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LockChatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LockChatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.locked != null && message.hasOwnProperty("locked"))
                    if (typeof message.locked !== "boolean")
                        return "locked: boolean expected";
                return null;
            };

            /**
             * Creates a LockChatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LockChatAction} LockChatAction
             */
            LockChatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.LockChatAction();
                if (object.locked != null)
                    message.locked = Boolean(object.locked);
                return message;
            };

            /**
             * Creates a plain object from a LockChatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.LockChatAction} message LockChatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LockChatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.locked = false;
                if (message.locked != null && message.hasOwnProperty("locked"))
                    object.locked = message.locked;
                return object;
            };

            /**
             * Converts this LockChatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LockChatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LockChatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LockChatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LockChatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.LockChatAction";
            };

            return LockChatAction;
        })();

        SyncActionValue.CustomPaymentMethodsAction = (function() {

            /**
             * Properties of a CustomPaymentMethodsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ICustomPaymentMethodsAction
             * @property {Array.<WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod>|null} [customPaymentMethods] CustomPaymentMethodsAction customPaymentMethods
             */

            /**
             * Constructs a new CustomPaymentMethodsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a CustomPaymentMethodsAction.
             * @implements ICustomPaymentMethodsAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction=} [properties] Properties to set
             */
            function CustomPaymentMethodsAction(properties) {
                this.customPaymentMethods = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CustomPaymentMethodsAction customPaymentMethods.
             * @member {Array.<WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod>} customPaymentMethods
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @instance
             */
            CustomPaymentMethodsAction.prototype.customPaymentMethods = $util.emptyArray;

            /**
             * Creates a new CustomPaymentMethodsAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction} CustomPaymentMethodsAction instance
             */
            CustomPaymentMethodsAction.create = function create(properties) {
                return new CustomPaymentMethodsAction(properties);
            };

            /**
             * Encodes the specified CustomPaymentMethodsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction} message CustomPaymentMethodsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethodsAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.customPaymentMethods != null && message.customPaymentMethods.length)
                    for (var i = 0; i < message.customPaymentMethods.length; ++i)
                        $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.encode(message.customPaymentMethods[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CustomPaymentMethodsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction} message CustomPaymentMethodsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethodsAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction} CustomPaymentMethodsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethodsAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.customPaymentMethods && message.customPaymentMethods.length))
                                message.customPaymentMethods = [];
                            message.customPaymentMethods.push($root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.decode(reader, reader.uint32()));
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
             * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction} CustomPaymentMethodsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethodsAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CustomPaymentMethodsAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CustomPaymentMethodsAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.customPaymentMethods != null && message.hasOwnProperty("customPaymentMethods")) {
                    if (!Array.isArray(message.customPaymentMethods))
                        return "customPaymentMethods: array expected";
                    for (var i = 0; i < message.customPaymentMethods.length; ++i) {
                        var error = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.verify(message.customPaymentMethods[i]);
                        if (error)
                            return "customPaymentMethods." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CustomPaymentMethodsAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction} CustomPaymentMethodsAction
             */
            CustomPaymentMethodsAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction();
                if (object.customPaymentMethods) {
                    if (!Array.isArray(object.customPaymentMethods))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.customPaymentMethods: array expected");
                    message.customPaymentMethods = [];
                    for (var i = 0; i < object.customPaymentMethods.length; ++i) {
                        if (typeof object.customPaymentMethods[i] !== "object")
                            throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.customPaymentMethods: object expected");
                        message.customPaymentMethods[i] = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.fromObject(object.customPaymentMethods[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a CustomPaymentMethodsAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction} message CustomPaymentMethodsAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CustomPaymentMethodsAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.customPaymentMethods = [];
                if (message.customPaymentMethods && message.customPaymentMethods.length) {
                    object.customPaymentMethods = [];
                    for (var j = 0; j < message.customPaymentMethods.length; ++j)
                        object.customPaymentMethods[j] = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.toObject(message.customPaymentMethods[j], options);
                }
                return object;
            };

            /**
             * Converts this CustomPaymentMethodsAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CustomPaymentMethodsAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CustomPaymentMethodsAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CustomPaymentMethodsAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction";
            };

            return CustomPaymentMethodsAction;
        })();

        SyncActionValue.CustomPaymentMethod = (function() {

            /**
             * Properties of a CustomPaymentMethod.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ICustomPaymentMethod
             * @property {string} credentialID CustomPaymentMethod credentialID
             * @property {string} country CustomPaymentMethod country
             * @property {string} type CustomPaymentMethod type
             * @property {Array.<WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata>|null} [metadata] CustomPaymentMethod metadata
             */

            /**
             * Constructs a new CustomPaymentMethod.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a CustomPaymentMethod.
             * @implements ICustomPaymentMethod
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod=} [properties] Properties to set
             */
            function CustomPaymentMethod(properties) {
                this.metadata = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CustomPaymentMethod credentialID.
             * @member {string} credentialID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @instance
             */
            CustomPaymentMethod.prototype.credentialID = "";

            /**
             * CustomPaymentMethod country.
             * @member {string} country
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @instance
             */
            CustomPaymentMethod.prototype.country = "";

            /**
             * CustomPaymentMethod type.
             * @member {string} type
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @instance
             */
            CustomPaymentMethod.prototype.type = "";

            /**
             * CustomPaymentMethod metadata.
             * @member {Array.<WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata>} metadata
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @instance
             */
            CustomPaymentMethod.prototype.metadata = $util.emptyArray;

            /**
             * Creates a new CustomPaymentMethod instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod} CustomPaymentMethod instance
             */
            CustomPaymentMethod.create = function create(properties) {
                return new CustomPaymentMethod(properties);
            };

            /**
             * Encodes the specified CustomPaymentMethod message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod} message CustomPaymentMethod message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethod.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.credentialID);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.country);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
                if (message.metadata != null && message.metadata.length)
                    for (var i = 0; i < message.metadata.length; ++i)
                        $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.encode(message.metadata[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CustomPaymentMethod message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod} message CustomPaymentMethod message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethod.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CustomPaymentMethod message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod} CustomPaymentMethod
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethod.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.credentialID = reader.string();
                            break;
                        }
                    case 2: {
                            message.country = reader.string();
                            break;
                        }
                    case 3: {
                            message.type = reader.string();
                            break;
                        }
                    case 4: {
                            if (!(message.metadata && message.metadata.length))
                                message.metadata = [];
                            message.metadata.push($root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("credentialID"))
                    throw $util.ProtocolError("missing required 'credentialID'", { instance: message });
                if (!message.hasOwnProperty("country"))
                    throw $util.ProtocolError("missing required 'country'", { instance: message });
                if (!message.hasOwnProperty("type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                return message;
            };

            /**
             * Decodes a CustomPaymentMethod message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod} CustomPaymentMethod
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethod.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CustomPaymentMethod message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CustomPaymentMethod.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.credentialID))
                    return "credentialID: string expected";
                if (!$util.isString(message.country))
                    return "country: string expected";
                if (!$util.isString(message.type))
                    return "type: string expected";
                if (message.metadata != null && message.hasOwnProperty("metadata")) {
                    if (!Array.isArray(message.metadata))
                        return "metadata: array expected";
                    for (var i = 0; i < message.metadata.length; ++i) {
                        var error = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.verify(message.metadata[i]);
                        if (error)
                            return "metadata." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CustomPaymentMethod message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod} CustomPaymentMethod
             */
            CustomPaymentMethod.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod();
                if (object.credentialID != null)
                    message.credentialID = String(object.credentialID);
                if (object.country != null)
                    message.country = String(object.country);
                if (object.type != null)
                    message.type = String(object.type);
                if (object.metadata) {
                    if (!Array.isArray(object.metadata))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.metadata: array expected");
                    message.metadata = [];
                    for (var i = 0; i < object.metadata.length; ++i) {
                        if (typeof object.metadata[i] !== "object")
                            throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.metadata: object expected");
                        message.metadata[i] = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.fromObject(object.metadata[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a CustomPaymentMethod message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod} message CustomPaymentMethod
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CustomPaymentMethod.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.metadata = [];
                if (options.defaults) {
                    object.credentialID = "";
                    object.country = "";
                    object.type = "";
                }
                if (message.credentialID != null && message.hasOwnProperty("credentialID"))
                    object.credentialID = message.credentialID;
                if (message.country != null && message.hasOwnProperty("country"))
                    object.country = message.country;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.metadata && message.metadata.length) {
                    object.metadata = [];
                    for (var j = 0; j < message.metadata.length; ++j)
                        object.metadata[j] = $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.toObject(message.metadata[j], options);
                }
                return object;
            };

            /**
             * Converts this CustomPaymentMethod to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CustomPaymentMethod.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CustomPaymentMethod
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CustomPaymentMethod.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod";
            };

            return CustomPaymentMethod;
        })();

        SyncActionValue.CustomPaymentMethodMetadata = (function() {

            /**
             * Properties of a CustomPaymentMethodMetadata.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ICustomPaymentMethodMetadata
             * @property {string} key CustomPaymentMethodMetadata key
             * @property {string} value CustomPaymentMethodMetadata value
             */

            /**
             * Constructs a new CustomPaymentMethodMetadata.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a CustomPaymentMethodMetadata.
             * @implements ICustomPaymentMethodMetadata
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata=} [properties] Properties to set
             */
            function CustomPaymentMethodMetadata(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CustomPaymentMethodMetadata key.
             * @member {string} key
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @instance
             */
            CustomPaymentMethodMetadata.prototype.key = "";

            /**
             * CustomPaymentMethodMetadata value.
             * @member {string} value
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @instance
             */
            CustomPaymentMethodMetadata.prototype.value = "";

            /**
             * Creates a new CustomPaymentMethodMetadata instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata} CustomPaymentMethodMetadata instance
             */
            CustomPaymentMethodMetadata.create = function create(properties) {
                return new CustomPaymentMethodMetadata(properties);
            };

            /**
             * Encodes the specified CustomPaymentMethodMetadata message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata} message CustomPaymentMethodMetadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethodMetadata.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified CustomPaymentMethodMetadata message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata} message CustomPaymentMethodMetadata message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CustomPaymentMethodMetadata.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata} CustomPaymentMethodMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethodMetadata.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.key = reader.string();
                            break;
                        }
                    case 2: {
                            message.value = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("key"))
                    throw $util.ProtocolError("missing required 'key'", { instance: message });
                if (!message.hasOwnProperty("value"))
                    throw $util.ProtocolError("missing required 'value'", { instance: message });
                return message;
            };

            /**
             * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata} CustomPaymentMethodMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CustomPaymentMethodMetadata.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CustomPaymentMethodMetadata message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CustomPaymentMethodMetadata.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.key))
                    return "key: string expected";
                if (!$util.isString(message.value))
                    return "value: string expected";
                return null;
            };

            /**
             * Creates a CustomPaymentMethodMetadata message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata} CustomPaymentMethodMetadata
             */
            CustomPaymentMethodMetadata.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata();
                if (object.key != null)
                    message.key = String(object.key);
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a CustomPaymentMethodMetadata message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata} message CustomPaymentMethodMetadata
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CustomPaymentMethodMetadata.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.key = "";
                    object.value = "";
                }
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = message.key;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this CustomPaymentMethodMetadata to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CustomPaymentMethodMetadata.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CustomPaymentMethodMetadata
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CustomPaymentMethodMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata";
            };

            return CustomPaymentMethodMetadata;
        })();

        SyncActionValue.PaymentInfoAction = (function() {

            /**
             * Properties of a PaymentInfoAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPaymentInfoAction
             * @property {string|null} [cpi] PaymentInfoAction cpi
             */

            /**
             * Constructs a new PaymentInfoAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PaymentInfoAction.
             * @implements IPaymentInfoAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction=} [properties] Properties to set
             */
            function PaymentInfoAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PaymentInfoAction cpi.
             * @member {string} cpi
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @instance
             */
            PaymentInfoAction.prototype.cpi = "";

            /**
             * Creates a new PaymentInfoAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction} PaymentInfoAction instance
             */
            PaymentInfoAction.create = function create(properties) {
                return new PaymentInfoAction(properties);
            };

            /**
             * Encodes the specified PaymentInfoAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction} message PaymentInfoAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PaymentInfoAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cpi != null && Object.hasOwnProperty.call(message, "cpi"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.cpi);
                return writer;
            };

            /**
             * Encodes the specified PaymentInfoAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction} message PaymentInfoAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PaymentInfoAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PaymentInfoAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction} PaymentInfoAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PaymentInfoAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cpi = reader.string();
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
             * Decodes a PaymentInfoAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction} PaymentInfoAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PaymentInfoAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PaymentInfoAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PaymentInfoAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cpi != null && message.hasOwnProperty("cpi"))
                    if (!$util.isString(message.cpi))
                        return "cpi: string expected";
                return null;
            };

            /**
             * Creates a PaymentInfoAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction} PaymentInfoAction
             */
            PaymentInfoAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction();
                if (object.cpi != null)
                    message.cpi = String(object.cpi);
                return message;
            };

            /**
             * Creates a plain object from a PaymentInfoAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction} message PaymentInfoAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PaymentInfoAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.cpi = "";
                if (message.cpi != null && message.hasOwnProperty("cpi"))
                    object.cpi = message.cpi;
                return object;
            };

            /**
             * Converts this PaymentInfoAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PaymentInfoAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PaymentInfoAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PaymentInfoAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction";
            };

            return PaymentInfoAction;
        })();

        SyncActionValue.LabelReorderingAction = (function() {

            /**
             * Properties of a LabelReorderingAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ILabelReorderingAction
             * @property {Array.<number>|null} [sortedLabelIDs] LabelReorderingAction sortedLabelIDs
             */

            /**
             * Constructs a new LabelReorderingAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a LabelReorderingAction.
             * @implements ILabelReorderingAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction=} [properties] Properties to set
             */
            function LabelReorderingAction(properties) {
                this.sortedLabelIDs = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LabelReorderingAction sortedLabelIDs.
             * @member {Array.<number>} sortedLabelIDs
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @instance
             */
            LabelReorderingAction.prototype.sortedLabelIDs = $util.emptyArray;

            /**
             * Creates a new LabelReorderingAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction} LabelReorderingAction instance
             */
            LabelReorderingAction.create = function create(properties) {
                return new LabelReorderingAction(properties);
            };

            /**
             * Encodes the specified LabelReorderingAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction} message LabelReorderingAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelReorderingAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sortedLabelIDs != null && message.sortedLabelIDs.length)
                    for (var i = 0; i < message.sortedLabelIDs.length; ++i)
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sortedLabelIDs[i]);
                return writer;
            };

            /**
             * Encodes the specified LabelReorderingAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction} message LabelReorderingAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelReorderingAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LabelReorderingAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction} LabelReorderingAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelReorderingAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.sortedLabelIDs && message.sortedLabelIDs.length))
                                message.sortedLabelIDs = [];
                            if ((tag & 7) === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.sortedLabelIDs.push(reader.int32());
                            } else
                                message.sortedLabelIDs.push(reader.int32());
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
             * Decodes a LabelReorderingAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction} LabelReorderingAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelReorderingAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LabelReorderingAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LabelReorderingAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sortedLabelIDs != null && message.hasOwnProperty("sortedLabelIDs")) {
                    if (!Array.isArray(message.sortedLabelIDs))
                        return "sortedLabelIDs: array expected";
                    for (var i = 0; i < message.sortedLabelIDs.length; ++i)
                        if (!$util.isInteger(message.sortedLabelIDs[i]))
                            return "sortedLabelIDs: integer[] expected";
                }
                return null;
            };

            /**
             * Creates a LabelReorderingAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction} LabelReorderingAction
             */
            LabelReorderingAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction();
                if (object.sortedLabelIDs) {
                    if (!Array.isArray(object.sortedLabelIDs))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.sortedLabelIDs: array expected");
                    message.sortedLabelIDs = [];
                    for (var i = 0; i < object.sortedLabelIDs.length; ++i)
                        message.sortedLabelIDs[i] = object.sortedLabelIDs[i] | 0;
                }
                return message;
            };

            /**
             * Creates a plain object from a LabelReorderingAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction} message LabelReorderingAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LabelReorderingAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.sortedLabelIDs = [];
                if (message.sortedLabelIDs && message.sortedLabelIDs.length) {
                    object.sortedLabelIDs = [];
                    for (var j = 0; j < message.sortedLabelIDs.length; ++j)
                        object.sortedLabelIDs[j] = message.sortedLabelIDs[j];
                }
                return object;
            };

            /**
             * Converts this LabelReorderingAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LabelReorderingAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LabelReorderingAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LabelReorderingAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction";
            };

            return LabelReorderingAction;
        })();

        SyncActionValue.DeleteIndividualCallLogAction = (function() {

            /**
             * Properties of a DeleteIndividualCallLogAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IDeleteIndividualCallLogAction
             * @property {string|null} [peerJID] DeleteIndividualCallLogAction peerJID
             * @property {boolean|null} [isIncoming] DeleteIndividualCallLogAction isIncoming
             */

            /**
             * Constructs a new DeleteIndividualCallLogAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a DeleteIndividualCallLogAction.
             * @implements IDeleteIndividualCallLogAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction=} [properties] Properties to set
             */
            function DeleteIndividualCallLogAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteIndividualCallLogAction peerJID.
             * @member {string} peerJID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @instance
             */
            DeleteIndividualCallLogAction.prototype.peerJID = "";

            /**
             * DeleteIndividualCallLogAction isIncoming.
             * @member {boolean} isIncoming
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @instance
             */
            DeleteIndividualCallLogAction.prototype.isIncoming = false;

            /**
             * Creates a new DeleteIndividualCallLogAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction} DeleteIndividualCallLogAction instance
             */
            DeleteIndividualCallLogAction.create = function create(properties) {
                return new DeleteIndividualCallLogAction(properties);
            };

            /**
             * Encodes the specified DeleteIndividualCallLogAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction} message DeleteIndividualCallLogAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteIndividualCallLogAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.peerJID != null && Object.hasOwnProperty.call(message, "peerJID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.peerJID);
                if (message.isIncoming != null && Object.hasOwnProperty.call(message, "isIncoming"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isIncoming);
                return writer;
            };

            /**
             * Encodes the specified DeleteIndividualCallLogAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction} message DeleteIndividualCallLogAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteIndividualCallLogAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction} DeleteIndividualCallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteIndividualCallLogAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.peerJID = reader.string();
                            break;
                        }
                    case 2: {
                            message.isIncoming = reader.bool();
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
             * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction} DeleteIndividualCallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteIndividualCallLogAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteIndividualCallLogAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteIndividualCallLogAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.peerJID != null && message.hasOwnProperty("peerJID"))
                    if (!$util.isString(message.peerJID))
                        return "peerJID: string expected";
                if (message.isIncoming != null && message.hasOwnProperty("isIncoming"))
                    if (typeof message.isIncoming !== "boolean")
                        return "isIncoming: boolean expected";
                return null;
            };

            /**
             * Creates a DeleteIndividualCallLogAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction} DeleteIndividualCallLogAction
             */
            DeleteIndividualCallLogAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction();
                if (object.peerJID != null)
                    message.peerJID = String(object.peerJID);
                if (object.isIncoming != null)
                    message.isIncoming = Boolean(object.isIncoming);
                return message;
            };

            /**
             * Creates a plain object from a DeleteIndividualCallLogAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction} message DeleteIndividualCallLogAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteIndividualCallLogAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.peerJID = "";
                    object.isIncoming = false;
                }
                if (message.peerJID != null && message.hasOwnProperty("peerJID"))
                    object.peerJID = message.peerJID;
                if (message.isIncoming != null && message.hasOwnProperty("isIncoming"))
                    object.isIncoming = message.isIncoming;
                return object;
            };

            /**
             * Converts this DeleteIndividualCallLogAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteIndividualCallLogAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteIndividualCallLogAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteIndividualCallLogAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction";
            };

            return DeleteIndividualCallLogAction;
        })();

        SyncActionValue.BotWelcomeRequestAction = (function() {

            /**
             * Properties of a BotWelcomeRequestAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IBotWelcomeRequestAction
             * @property {boolean|null} [isSent] BotWelcomeRequestAction isSent
             */

            /**
             * Constructs a new BotWelcomeRequestAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a BotWelcomeRequestAction.
             * @implements IBotWelcomeRequestAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction=} [properties] Properties to set
             */
            function BotWelcomeRequestAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BotWelcomeRequestAction isSent.
             * @member {boolean} isSent
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @instance
             */
            BotWelcomeRequestAction.prototype.isSent = false;

            /**
             * Creates a new BotWelcomeRequestAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction} BotWelcomeRequestAction instance
             */
            BotWelcomeRequestAction.create = function create(properties) {
                return new BotWelcomeRequestAction(properties);
            };

            /**
             * Encodes the specified BotWelcomeRequestAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction} message BotWelcomeRequestAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BotWelcomeRequestAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isSent != null && Object.hasOwnProperty.call(message, "isSent"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSent);
                return writer;
            };

            /**
             * Encodes the specified BotWelcomeRequestAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction} message BotWelcomeRequestAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BotWelcomeRequestAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BotWelcomeRequestAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction} BotWelcomeRequestAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BotWelcomeRequestAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isSent = reader.bool();
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
             * Decodes a BotWelcomeRequestAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction} BotWelcomeRequestAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BotWelcomeRequestAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BotWelcomeRequestAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BotWelcomeRequestAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isSent != null && message.hasOwnProperty("isSent"))
                    if (typeof message.isSent !== "boolean")
                        return "isSent: boolean expected";
                return null;
            };

            /**
             * Creates a BotWelcomeRequestAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction} BotWelcomeRequestAction
             */
            BotWelcomeRequestAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction();
                if (object.isSent != null)
                    message.isSent = Boolean(object.isSent);
                return message;
            };

            /**
             * Creates a plain object from a BotWelcomeRequestAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction} message BotWelcomeRequestAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BotWelcomeRequestAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.isSent = false;
                if (message.isSent != null && message.hasOwnProperty("isSent"))
                    object.isSent = message.isSent;
                return object;
            };

            /**
             * Converts this BotWelcomeRequestAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BotWelcomeRequestAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BotWelcomeRequestAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BotWelcomeRequestAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction";
            };

            return BotWelcomeRequestAction;
        })();

        SyncActionValue.CallLogAction = (function() {

            /**
             * Properties of a CallLogAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ICallLogAction
             * @property {WAWebProtobufSyncAction.ICallLogRecord|null} [callLogRecord] CallLogAction callLogRecord
             */

            /**
             * Constructs a new CallLogAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a CallLogAction.
             * @implements ICallLogAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction=} [properties] Properties to set
             */
            function CallLogAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CallLogAction callLogRecord.
             * @member {WAWebProtobufSyncAction.ICallLogRecord|null|undefined} callLogRecord
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @instance
             */
            CallLogAction.prototype.callLogRecord = null;

            /**
             * Creates a new CallLogAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CallLogAction} CallLogAction instance
             */
            CallLogAction.create = function create(properties) {
                return new CallLogAction(properties);
            };

            /**
             * Encodes the specified CallLogAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CallLogAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction} message CallLogAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallLogAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.callLogRecord != null && Object.hasOwnProperty.call(message, "callLogRecord"))
                    $root.WAWebProtobufSyncAction.CallLogRecord.encode(message.callLogRecord, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CallLogAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CallLogAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ICallLogAction} message CallLogAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallLogAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CallLogAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CallLogAction} CallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallLogAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.callLogRecord = $root.WAWebProtobufSyncAction.CallLogRecord.decode(reader, reader.uint32());
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
             * Decodes a CallLogAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CallLogAction} CallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallLogAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CallLogAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallLogAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.callLogRecord != null && message.hasOwnProperty("callLogRecord")) {
                    var error = $root.WAWebProtobufSyncAction.CallLogRecord.verify(message.callLogRecord);
                    if (error)
                        return "callLogRecord." + error;
                }
                return null;
            };

            /**
             * Creates a CallLogAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.CallLogAction} CallLogAction
             */
            CallLogAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.CallLogAction();
                if (object.callLogRecord != null) {
                    if (typeof object.callLogRecord !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.CallLogAction.callLogRecord: object expected");
                    message.callLogRecord = $root.WAWebProtobufSyncAction.CallLogRecord.fromObject(object.callLogRecord);
                }
                return message;
            };

            /**
             * Creates a plain object from a CallLogAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.CallLogAction} message CallLogAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallLogAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.callLogRecord = null;
                if (message.callLogRecord != null && message.hasOwnProperty("callLogRecord"))
                    object.callLogRecord = $root.WAWebProtobufSyncAction.CallLogRecord.toObject(message.callLogRecord, options);
                return object;
            };

            /**
             * Converts this CallLogAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallLogAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CallLogAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.CallLogAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CallLogAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.CallLogAction";
            };

            return CallLogAction;
        })();

        SyncActionValue.PrivacySettingRelayAllCalls = (function() {

            /**
             * Properties of a PrivacySettingRelayAllCalls.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPrivacySettingRelayAllCalls
             * @property {boolean|null} [isEnabled] PrivacySettingRelayAllCalls isEnabled
             */

            /**
             * Constructs a new PrivacySettingRelayAllCalls.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PrivacySettingRelayAllCalls.
             * @implements IPrivacySettingRelayAllCalls
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls=} [properties] Properties to set
             */
            function PrivacySettingRelayAllCalls(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PrivacySettingRelayAllCalls isEnabled.
             * @member {boolean} isEnabled
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @instance
             */
            PrivacySettingRelayAllCalls.prototype.isEnabled = false;

            /**
             * Creates a new PrivacySettingRelayAllCalls instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls} PrivacySettingRelayAllCalls instance
             */
            PrivacySettingRelayAllCalls.create = function create(properties) {
                return new PrivacySettingRelayAllCalls(properties);
            };

            /**
             * Encodes the specified PrivacySettingRelayAllCalls message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls} message PrivacySettingRelayAllCalls message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrivacySettingRelayAllCalls.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isEnabled != null && Object.hasOwnProperty.call(message, "isEnabled"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isEnabled);
                return writer;
            };

            /**
             * Encodes the specified PrivacySettingRelayAllCalls message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls} message PrivacySettingRelayAllCalls message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrivacySettingRelayAllCalls.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls} PrivacySettingRelayAllCalls
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrivacySettingRelayAllCalls.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isEnabled = reader.bool();
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
             * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls} PrivacySettingRelayAllCalls
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrivacySettingRelayAllCalls.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PrivacySettingRelayAllCalls message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PrivacySettingRelayAllCalls.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isEnabled != null && message.hasOwnProperty("isEnabled"))
                    if (typeof message.isEnabled !== "boolean")
                        return "isEnabled: boolean expected";
                return null;
            };

            /**
             * Creates a PrivacySettingRelayAllCalls message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls} PrivacySettingRelayAllCalls
             */
            PrivacySettingRelayAllCalls.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls();
                if (object.isEnabled != null)
                    message.isEnabled = Boolean(object.isEnabled);
                return message;
            };

            /**
             * Creates a plain object from a PrivacySettingRelayAllCalls message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls} message PrivacySettingRelayAllCalls
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PrivacySettingRelayAllCalls.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.isEnabled = false;
                if (message.isEnabled != null && message.hasOwnProperty("isEnabled"))
                    object.isEnabled = message.isEnabled;
                return object;
            };

            /**
             * Converts this PrivacySettingRelayAllCalls to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PrivacySettingRelayAllCalls.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PrivacySettingRelayAllCalls
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PrivacySettingRelayAllCalls.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls";
            };

            return PrivacySettingRelayAllCalls;
        })();

        SyncActionValue.ExternalWebBetaAction = (function() {

            /**
             * Properties of an ExternalWebBetaAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IExternalWebBetaAction
             * @property {boolean|null} [isOptIn] ExternalWebBetaAction isOptIn
             */

            /**
             * Constructs a new ExternalWebBetaAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents an ExternalWebBetaAction.
             * @implements IExternalWebBetaAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction=} [properties] Properties to set
             */
            function ExternalWebBetaAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ExternalWebBetaAction isOptIn.
             * @member {boolean} isOptIn
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @instance
             */
            ExternalWebBetaAction.prototype.isOptIn = false;

            /**
             * Creates a new ExternalWebBetaAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction} ExternalWebBetaAction instance
             */
            ExternalWebBetaAction.create = function create(properties) {
                return new ExternalWebBetaAction(properties);
            };

            /**
             * Encodes the specified ExternalWebBetaAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction} message ExternalWebBetaAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExternalWebBetaAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isOptIn != null && Object.hasOwnProperty.call(message, "isOptIn"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isOptIn);
                return writer;
            };

            /**
             * Encodes the specified ExternalWebBetaAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction} message ExternalWebBetaAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExternalWebBetaAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ExternalWebBetaAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction} ExternalWebBetaAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExternalWebBetaAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isOptIn = reader.bool();
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
             * Decodes an ExternalWebBetaAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction} ExternalWebBetaAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExternalWebBetaAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ExternalWebBetaAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExternalWebBetaAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isOptIn != null && message.hasOwnProperty("isOptIn"))
                    if (typeof message.isOptIn !== "boolean")
                        return "isOptIn: boolean expected";
                return null;
            };

            /**
             * Creates an ExternalWebBetaAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction} ExternalWebBetaAction
             */
            ExternalWebBetaAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction();
                if (object.isOptIn != null)
                    message.isOptIn = Boolean(object.isOptIn);
                return message;
            };

            /**
             * Creates a plain object from an ExternalWebBetaAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction} message ExternalWebBetaAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExternalWebBetaAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.isOptIn = false;
                if (message.isOptIn != null && message.hasOwnProperty("isOptIn"))
                    object.isOptIn = message.isOptIn;
                return object;
            };

            /**
             * Converts this ExternalWebBetaAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExternalWebBetaAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ExternalWebBetaAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ExternalWebBetaAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction";
            };

            return ExternalWebBetaAction;
        })();

        SyncActionValue.MarketingMessageBroadcastAction = (function() {

            /**
             * Properties of a MarketingMessageBroadcastAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IMarketingMessageBroadcastAction
             * @property {number|null} [repliedCount] MarketingMessageBroadcastAction repliedCount
             */

            /**
             * Constructs a new MarketingMessageBroadcastAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a MarketingMessageBroadcastAction.
             * @implements IMarketingMessageBroadcastAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction=} [properties] Properties to set
             */
            function MarketingMessageBroadcastAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarketingMessageBroadcastAction repliedCount.
             * @member {number} repliedCount
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @instance
             */
            MarketingMessageBroadcastAction.prototype.repliedCount = 0;

            /**
             * Creates a new MarketingMessageBroadcastAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction} MarketingMessageBroadcastAction instance
             */
            MarketingMessageBroadcastAction.create = function create(properties) {
                return new MarketingMessageBroadcastAction(properties);
            };

            /**
             * Encodes the specified MarketingMessageBroadcastAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction} message MarketingMessageBroadcastAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketingMessageBroadcastAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.repliedCount != null && Object.hasOwnProperty.call(message, "repliedCount"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.repliedCount);
                return writer;
            };

            /**
             * Encodes the specified MarketingMessageBroadcastAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction} message MarketingMessageBroadcastAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarketingMessageBroadcastAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction} MarketingMessageBroadcastAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketingMessageBroadcastAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.repliedCount = reader.int32();
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
             * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction} MarketingMessageBroadcastAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarketingMessageBroadcastAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarketingMessageBroadcastAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarketingMessageBroadcastAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.repliedCount != null && message.hasOwnProperty("repliedCount"))
                    if (!$util.isInteger(message.repliedCount))
                        return "repliedCount: integer expected";
                return null;
            };

            /**
             * Creates a MarketingMessageBroadcastAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction} MarketingMessageBroadcastAction
             */
            MarketingMessageBroadcastAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction();
                if (object.repliedCount != null)
                    message.repliedCount = object.repliedCount | 0;
                return message;
            };

            /**
             * Creates a plain object from a MarketingMessageBroadcastAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction} message MarketingMessageBroadcastAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarketingMessageBroadcastAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.repliedCount = 0;
                if (message.repliedCount != null && message.hasOwnProperty("repliedCount"))
                    object.repliedCount = message.repliedCount;
                return object;
            };

            /**
             * Converts this MarketingMessageBroadcastAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarketingMessageBroadcastAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MarketingMessageBroadcastAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MarketingMessageBroadcastAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction";
            };

            return MarketingMessageBroadcastAction;
        })();

        SyncActionValue.PnForLidChatAction = (function() {

            /**
             * Properties of a PnForLidChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPnForLidChatAction
             * @property {string|null} [pnJID] PnForLidChatAction pnJID
             */

            /**
             * Constructs a new PnForLidChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PnForLidChatAction.
             * @implements IPnForLidChatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction=} [properties] Properties to set
             */
            function PnForLidChatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PnForLidChatAction pnJID.
             * @member {string} pnJID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @instance
             */
            PnForLidChatAction.prototype.pnJID = "";

            /**
             * Creates a new PnForLidChatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction} PnForLidChatAction instance
             */
            PnForLidChatAction.create = function create(properties) {
                return new PnForLidChatAction(properties);
            };

            /**
             * Encodes the specified PnForLidChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction} message PnForLidChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PnForLidChatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pnJID != null && Object.hasOwnProperty.call(message, "pnJID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pnJID);
                return writer;
            };

            /**
             * Encodes the specified PnForLidChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction} message PnForLidChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PnForLidChatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PnForLidChatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction} PnForLidChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PnForLidChatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.pnJID = reader.string();
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
             * Decodes a PnForLidChatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction} PnForLidChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PnForLidChatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PnForLidChatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PnForLidChatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pnJID != null && message.hasOwnProperty("pnJID"))
                    if (!$util.isString(message.pnJID))
                        return "pnJID: string expected";
                return null;
            };

            /**
             * Creates a PnForLidChatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction} PnForLidChatAction
             */
            PnForLidChatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction();
                if (object.pnJID != null)
                    message.pnJID = String(object.pnJID);
                return message;
            };

            /**
             * Creates a plain object from a PnForLidChatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction} message PnForLidChatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PnForLidChatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pnJID = "";
                if (message.pnJID != null && message.hasOwnProperty("pnJID"))
                    object.pnJID = message.pnJID;
                return object;
            };

            /**
             * Converts this PnForLidChatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PnForLidChatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PnForLidChatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PnForLidChatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction";
            };

            return PnForLidChatAction;
        })();

        SyncActionValue.ChatAssignmentOpenedStatusAction = (function() {

            /**
             * Properties of a ChatAssignmentOpenedStatusAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IChatAssignmentOpenedStatusAction
             * @property {boolean|null} [chatOpened] ChatAssignmentOpenedStatusAction chatOpened
             */

            /**
             * Constructs a new ChatAssignmentOpenedStatusAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a ChatAssignmentOpenedStatusAction.
             * @implements IChatAssignmentOpenedStatusAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction=} [properties] Properties to set
             */
            function ChatAssignmentOpenedStatusAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChatAssignmentOpenedStatusAction chatOpened.
             * @member {boolean} chatOpened
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @instance
             */
            ChatAssignmentOpenedStatusAction.prototype.chatOpened = false;

            /**
             * Creates a new ChatAssignmentOpenedStatusAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction} ChatAssignmentOpenedStatusAction instance
             */
            ChatAssignmentOpenedStatusAction.create = function create(properties) {
                return new ChatAssignmentOpenedStatusAction(properties);
            };

            /**
             * Encodes the specified ChatAssignmentOpenedStatusAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction} message ChatAssignmentOpenedStatusAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatAssignmentOpenedStatusAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.chatOpened != null && Object.hasOwnProperty.call(message, "chatOpened"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.chatOpened);
                return writer;
            };

            /**
             * Encodes the specified ChatAssignmentOpenedStatusAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction} message ChatAssignmentOpenedStatusAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatAssignmentOpenedStatusAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction} ChatAssignmentOpenedStatusAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatAssignmentOpenedStatusAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.chatOpened = reader.bool();
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
             * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction} ChatAssignmentOpenedStatusAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatAssignmentOpenedStatusAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChatAssignmentOpenedStatusAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChatAssignmentOpenedStatusAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.chatOpened != null && message.hasOwnProperty("chatOpened"))
                    if (typeof message.chatOpened !== "boolean")
                        return "chatOpened: boolean expected";
                return null;
            };

            /**
             * Creates a ChatAssignmentOpenedStatusAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction} ChatAssignmentOpenedStatusAction
             */
            ChatAssignmentOpenedStatusAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction();
                if (object.chatOpened != null)
                    message.chatOpened = Boolean(object.chatOpened);
                return message;
            };

            /**
             * Creates a plain object from a ChatAssignmentOpenedStatusAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction} message ChatAssignmentOpenedStatusAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChatAssignmentOpenedStatusAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.chatOpened = false;
                if (message.chatOpened != null && message.hasOwnProperty("chatOpened"))
                    object.chatOpened = message.chatOpened;
                return object;
            };

            /**
             * Converts this ChatAssignmentOpenedStatusAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChatAssignmentOpenedStatusAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChatAssignmentOpenedStatusAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChatAssignmentOpenedStatusAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction";
            };

            return ChatAssignmentOpenedStatusAction;
        })();

        SyncActionValue.ChatAssignmentAction = (function() {

            /**
             * Properties of a ChatAssignmentAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IChatAssignmentAction
             * @property {string|null} [deviceAgentID] ChatAssignmentAction deviceAgentID
             */

            /**
             * Constructs a new ChatAssignmentAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a ChatAssignmentAction.
             * @implements IChatAssignmentAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction=} [properties] Properties to set
             */
            function ChatAssignmentAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ChatAssignmentAction deviceAgentID.
             * @member {string} deviceAgentID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @instance
             */
            ChatAssignmentAction.prototype.deviceAgentID = "";

            /**
             * Creates a new ChatAssignmentAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction} ChatAssignmentAction instance
             */
            ChatAssignmentAction.create = function create(properties) {
                return new ChatAssignmentAction(properties);
            };

            /**
             * Encodes the specified ChatAssignmentAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction} message ChatAssignmentAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatAssignmentAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.deviceAgentID != null && Object.hasOwnProperty.call(message, "deviceAgentID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceAgentID);
                return writer;
            };

            /**
             * Encodes the specified ChatAssignmentAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction} message ChatAssignmentAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatAssignmentAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ChatAssignmentAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction} ChatAssignmentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatAssignmentAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.deviceAgentID = reader.string();
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
             * Decodes a ChatAssignmentAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction} ChatAssignmentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatAssignmentAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ChatAssignmentAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChatAssignmentAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.deviceAgentID != null && message.hasOwnProperty("deviceAgentID"))
                    if (!$util.isString(message.deviceAgentID))
                        return "deviceAgentID: string expected";
                return null;
            };

            /**
             * Creates a ChatAssignmentAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction} ChatAssignmentAction
             */
            ChatAssignmentAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction();
                if (object.deviceAgentID != null)
                    message.deviceAgentID = String(object.deviceAgentID);
                return message;
            };

            /**
             * Creates a plain object from a ChatAssignmentAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction} message ChatAssignmentAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChatAssignmentAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.deviceAgentID = "";
                if (message.deviceAgentID != null && message.hasOwnProperty("deviceAgentID"))
                    object.deviceAgentID = message.deviceAgentID;
                return object;
            };

            /**
             * Converts this ChatAssignmentAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChatAssignmentAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ChatAssignmentAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ChatAssignmentAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction";
            };

            return ChatAssignmentAction;
        })();

        SyncActionValue.StickerAction = (function() {

            /**
             * Properties of a StickerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IStickerAction
             * @property {string|null} [URL] StickerAction URL
             * @property {Uint8Array|null} [fileEncSHA256] StickerAction fileEncSHA256
             * @property {Uint8Array|null} [mediaKey] StickerAction mediaKey
             * @property {string|null} [mimetype] StickerAction mimetype
             * @property {number|null} [height] StickerAction height
             * @property {number|null} [width] StickerAction width
             * @property {string|null} [directPath] StickerAction directPath
             * @property {number|Long|null} [fileLength] StickerAction fileLength
             * @property {boolean|null} [isFavorite] StickerAction isFavorite
             * @property {number|null} [deviceIDHint] StickerAction deviceIDHint
             * @property {boolean|null} [isLottie] StickerAction isLottie
             */

            /**
             * Constructs a new StickerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a StickerAction.
             * @implements IStickerAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStickerAction=} [properties] Properties to set
             */
            function StickerAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StickerAction URL.
             * @member {string} URL
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.URL = "";

            /**
             * StickerAction fileEncSHA256.
             * @member {Uint8Array} fileEncSHA256
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.fileEncSHA256 = $util.newBuffer([]);

            /**
             * StickerAction mediaKey.
             * @member {Uint8Array} mediaKey
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.mediaKey = $util.newBuffer([]);

            /**
             * StickerAction mimetype.
             * @member {string} mimetype
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.mimetype = "";

            /**
             * StickerAction height.
             * @member {number} height
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.height = 0;

            /**
             * StickerAction width.
             * @member {number} width
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.width = 0;

            /**
             * StickerAction directPath.
             * @member {string} directPath
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.directPath = "";

            /**
             * StickerAction fileLength.
             * @member {number|Long} fileLength
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.fileLength = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StickerAction isFavorite.
             * @member {boolean} isFavorite
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.isFavorite = false;

            /**
             * StickerAction deviceIDHint.
             * @member {number} deviceIDHint
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.deviceIDHint = 0;

            /**
             * StickerAction isLottie.
             * @member {boolean} isLottie
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             */
            StickerAction.prototype.isLottie = false;

            /**
             * Creates a new StickerAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStickerAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StickerAction} StickerAction instance
             */
            StickerAction.create = function create(properties) {
                return new StickerAction(properties);
            };

            /**
             * Encodes the specified StickerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StickerAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStickerAction} message StickerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StickerAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.URL != null && Object.hasOwnProperty.call(message, "URL"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.URL);
                if (message.fileEncSHA256 != null && Object.hasOwnProperty.call(message, "fileEncSHA256"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.fileEncSHA256);
                if (message.mediaKey != null && Object.hasOwnProperty.call(message, "mediaKey"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.mediaKey);
                if (message.mimetype != null && Object.hasOwnProperty.call(message, "mimetype"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.mimetype);
                if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.height);
                if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.width);
                if (message.directPath != null && Object.hasOwnProperty.call(message, "directPath"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.directPath);
                if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.fileLength);
                if (message.isFavorite != null && Object.hasOwnProperty.call(message, "isFavorite"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.isFavorite);
                if (message.deviceIDHint != null && Object.hasOwnProperty.call(message, "deviceIDHint"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.deviceIDHint);
                if (message.isLottie != null && Object.hasOwnProperty.call(message, "isLottie"))
                    writer.uint32(/* id 11, wireType 0 =*/88).bool(message.isLottie);
                return writer;
            };

            /**
             * Encodes the specified StickerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StickerAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStickerAction} message StickerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StickerAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StickerAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StickerAction} StickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StickerAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.URL = reader.string();
                            break;
                        }
                    case 2: {
                            message.fileEncSHA256 = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.mediaKey = reader.bytes();
                            break;
                        }
                    case 4: {
                            message.mimetype = reader.string();
                            break;
                        }
                    case 5: {
                            message.height = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.width = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.directPath = reader.string();
                            break;
                        }
                    case 8: {
                            message.fileLength = reader.uint64();
                            break;
                        }
                    case 9: {
                            message.isFavorite = reader.bool();
                            break;
                        }
                    case 10: {
                            message.deviceIDHint = reader.uint32();
                            break;
                        }
                    case 11: {
                            message.isLottie = reader.bool();
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
             * Decodes a StickerAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StickerAction} StickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StickerAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StickerAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StickerAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.URL != null && message.hasOwnProperty("URL"))
                    if (!$util.isString(message.URL))
                        return "URL: string expected";
                if (message.fileEncSHA256 != null && message.hasOwnProperty("fileEncSHA256"))
                    if (!(message.fileEncSHA256 && typeof message.fileEncSHA256.length === "number" || $util.isString(message.fileEncSHA256)))
                        return "fileEncSHA256: buffer expected";
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
                if (message.isFavorite != null && message.hasOwnProperty("isFavorite"))
                    if (typeof message.isFavorite !== "boolean")
                        return "isFavorite: boolean expected";
                if (message.deviceIDHint != null && message.hasOwnProperty("deviceIDHint"))
                    if (!$util.isInteger(message.deviceIDHint))
                        return "deviceIDHint: integer expected";
                if (message.isLottie != null && message.hasOwnProperty("isLottie"))
                    if (typeof message.isLottie !== "boolean")
                        return "isLottie: boolean expected";
                return null;
            };

            /**
             * Creates a StickerAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StickerAction} StickerAction
             */
            StickerAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.StickerAction();
                if (object.URL != null)
                    message.URL = String(object.URL);
                if (object.fileEncSHA256 != null)
                    if (typeof object.fileEncSHA256 === "string")
                        $util.base64.decode(object.fileEncSHA256, message.fileEncSHA256 = $util.newBuffer($util.base64.length(object.fileEncSHA256)), 0);
                    else if (object.fileEncSHA256.length >= 0)
                        message.fileEncSHA256 = object.fileEncSHA256;
                if (object.mediaKey != null)
                    if (typeof object.mediaKey === "string")
                        $util.base64.decode(object.mediaKey, message.mediaKey = $util.newBuffer($util.base64.length(object.mediaKey)), 0);
                    else if (object.mediaKey.length >= 0)
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
                if (object.isFavorite != null)
                    message.isFavorite = Boolean(object.isFavorite);
                if (object.deviceIDHint != null)
                    message.deviceIDHint = object.deviceIDHint >>> 0;
                if (object.isLottie != null)
                    message.isLottie = Boolean(object.isLottie);
                return message;
            };

            /**
             * Creates a plain object from a StickerAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.StickerAction} message StickerAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StickerAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.URL = "";
                    if (options.bytes === String)
                        object.fileEncSHA256 = "";
                    else {
                        object.fileEncSHA256 = [];
                        if (options.bytes !== Array)
                            object.fileEncSHA256 = $util.newBuffer(object.fileEncSHA256);
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
                    object.isFavorite = false;
                    object.deviceIDHint = 0;
                    object.isLottie = false;
                }
                if (message.URL != null && message.hasOwnProperty("URL"))
                    object.URL = message.URL;
                if (message.fileEncSHA256 != null && message.hasOwnProperty("fileEncSHA256"))
                    object.fileEncSHA256 = options.bytes === String ? $util.base64.encode(message.fileEncSHA256, 0, message.fileEncSHA256.length) : options.bytes === Array ? Array.prototype.slice.call(message.fileEncSHA256) : message.fileEncSHA256;
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
                if (message.isFavorite != null && message.hasOwnProperty("isFavorite"))
                    object.isFavorite = message.isFavorite;
                if (message.deviceIDHint != null && message.hasOwnProperty("deviceIDHint"))
                    object.deviceIDHint = message.deviceIDHint;
                if (message.isLottie != null && message.hasOwnProperty("isLottie"))
                    object.isLottie = message.isLottie;
                return object;
            };

            /**
             * Converts this StickerAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StickerAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StickerAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StickerAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StickerAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.StickerAction";
            };

            return StickerAction;
        })();

        SyncActionValue.RemoveRecentStickerAction = (function() {

            /**
             * Properties of a RemoveRecentStickerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IRemoveRecentStickerAction
             * @property {number|Long|null} [lastStickerSentTS] RemoveRecentStickerAction lastStickerSentTS
             */

            /**
             * Constructs a new RemoveRecentStickerAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a RemoveRecentStickerAction.
             * @implements IRemoveRecentStickerAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction=} [properties] Properties to set
             */
            function RemoveRecentStickerAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RemoveRecentStickerAction lastStickerSentTS.
             * @member {number|Long} lastStickerSentTS
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @instance
             */
            RemoveRecentStickerAction.prototype.lastStickerSentTS = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new RemoveRecentStickerAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction} RemoveRecentStickerAction instance
             */
            RemoveRecentStickerAction.create = function create(properties) {
                return new RemoveRecentStickerAction(properties);
            };

            /**
             * Encodes the specified RemoveRecentStickerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction} message RemoveRecentStickerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveRecentStickerAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.lastStickerSentTS != null && Object.hasOwnProperty.call(message, "lastStickerSentTS"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.lastStickerSentTS);
                return writer;
            };

            /**
             * Encodes the specified RemoveRecentStickerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction} message RemoveRecentStickerAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RemoveRecentStickerAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RemoveRecentStickerAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction} RemoveRecentStickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveRecentStickerAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.lastStickerSentTS = reader.int64();
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
             * Decodes a RemoveRecentStickerAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction} RemoveRecentStickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RemoveRecentStickerAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RemoveRecentStickerAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RemoveRecentStickerAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.lastStickerSentTS != null && message.hasOwnProperty("lastStickerSentTS"))
                    if (!$util.isInteger(message.lastStickerSentTS) && !(message.lastStickerSentTS && $util.isInteger(message.lastStickerSentTS.low) && $util.isInteger(message.lastStickerSentTS.high)))
                        return "lastStickerSentTS: integer|Long expected";
                return null;
            };

            /**
             * Creates a RemoveRecentStickerAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction} RemoveRecentStickerAction
             */
            RemoveRecentStickerAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction();
                if (object.lastStickerSentTS != null)
                    if ($util.Long)
                        (message.lastStickerSentTS = $util.Long.fromValue(object.lastStickerSentTS)).unsigned = false;
                    else if (typeof object.lastStickerSentTS === "string")
                        message.lastStickerSentTS = parseInt(object.lastStickerSentTS, 10);
                    else if (typeof object.lastStickerSentTS === "number")
                        message.lastStickerSentTS = object.lastStickerSentTS;
                    else if (typeof object.lastStickerSentTS === "object")
                        message.lastStickerSentTS = new $util.LongBits(object.lastStickerSentTS.low >>> 0, object.lastStickerSentTS.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a RemoveRecentStickerAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction} message RemoveRecentStickerAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RemoveRecentStickerAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.lastStickerSentTS = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastStickerSentTS = options.longs === String ? "0" : 0;
                if (message.lastStickerSentTS != null && message.hasOwnProperty("lastStickerSentTS"))
                    if (typeof message.lastStickerSentTS === "number")
                        object.lastStickerSentTS = options.longs === String ? String(message.lastStickerSentTS) : message.lastStickerSentTS;
                    else
                        object.lastStickerSentTS = options.longs === String ? $util.Long.prototype.toString.call(message.lastStickerSentTS) : options.longs === Number ? new $util.LongBits(message.lastStickerSentTS.low >>> 0, message.lastStickerSentTS.high >>> 0).toNumber() : message.lastStickerSentTS;
                return object;
            };

            /**
             * Converts this RemoveRecentStickerAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RemoveRecentStickerAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RemoveRecentStickerAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RemoveRecentStickerAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction";
            };

            return RemoveRecentStickerAction;
        })();

        SyncActionValue.PrimaryVersionAction = (function() {

            /**
             * Properties of a PrimaryVersionAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPrimaryVersionAction
             * @property {string|null} [version] PrimaryVersionAction version
             */

            /**
             * Constructs a new PrimaryVersionAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PrimaryVersionAction.
             * @implements IPrimaryVersionAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction=} [properties] Properties to set
             */
            function PrimaryVersionAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PrimaryVersionAction version.
             * @member {string} version
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @instance
             */
            PrimaryVersionAction.prototype.version = "";

            /**
             * Creates a new PrimaryVersionAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction} PrimaryVersionAction instance
             */
            PrimaryVersionAction.create = function create(properties) {
                return new PrimaryVersionAction(properties);
            };

            /**
             * Encodes the specified PrimaryVersionAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction} message PrimaryVersionAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrimaryVersionAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.version);
                return writer;
            };

            /**
             * Encodes the specified PrimaryVersionAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction} message PrimaryVersionAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrimaryVersionAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PrimaryVersionAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction} PrimaryVersionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrimaryVersionAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.version = reader.string();
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
             * Decodes a PrimaryVersionAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction} PrimaryVersionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrimaryVersionAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PrimaryVersionAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PrimaryVersionAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                return null;
            };

            /**
             * Creates a PrimaryVersionAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction} PrimaryVersionAction
             */
            PrimaryVersionAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction();
                if (object.version != null)
                    message.version = String(object.version);
                return message;
            };

            /**
             * Creates a plain object from a PrimaryVersionAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction} message PrimaryVersionAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PrimaryVersionAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.version = "";
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                return object;
            };

            /**
             * Converts this PrimaryVersionAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PrimaryVersionAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PrimaryVersionAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PrimaryVersionAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction";
            };

            return PrimaryVersionAction;
        })();

        SyncActionValue.NuxAction = (function() {

            /**
             * Properties of a NuxAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface INuxAction
             * @property {boolean|null} [acknowledged] NuxAction acknowledged
             */

            /**
             * Constructs a new NuxAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a NuxAction.
             * @implements INuxAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.INuxAction=} [properties] Properties to set
             */
            function NuxAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NuxAction acknowledged.
             * @member {boolean} acknowledged
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @instance
             */
            NuxAction.prototype.acknowledged = false;

            /**
             * Creates a new NuxAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INuxAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NuxAction} NuxAction instance
             */
            NuxAction.create = function create(properties) {
                return new NuxAction(properties);
            };

            /**
             * Encodes the specified NuxAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NuxAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INuxAction} message NuxAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NuxAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.acknowledged != null && Object.hasOwnProperty.call(message, "acknowledged"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.acknowledged);
                return writer;
            };

            /**
             * Encodes the specified NuxAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NuxAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.INuxAction} message NuxAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NuxAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NuxAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NuxAction} NuxAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NuxAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.acknowledged = reader.bool();
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
             * Decodes a NuxAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NuxAction} NuxAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NuxAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NuxAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NuxAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.acknowledged != null && message.hasOwnProperty("acknowledged"))
                    if (typeof message.acknowledged !== "boolean")
                        return "acknowledged: boolean expected";
                return null;
            };

            /**
             * Creates a NuxAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.NuxAction} NuxAction
             */
            NuxAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.NuxAction();
                if (object.acknowledged != null)
                    message.acknowledged = Boolean(object.acknowledged);
                return message;
            };

            /**
             * Creates a plain object from a NuxAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.NuxAction} message NuxAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NuxAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.acknowledged = false;
                if (message.acknowledged != null && message.hasOwnProperty("acknowledged"))
                    object.acknowledged = message.acknowledged;
                return object;
            };

            /**
             * Converts this NuxAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NuxAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NuxAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.NuxAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NuxAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.NuxAction";
            };

            return NuxAction;
        })();

        SyncActionValue.TimeFormatAction = (function() {

            /**
             * Properties of a TimeFormatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ITimeFormatAction
             * @property {boolean|null} [isTwentyFourHourFormatEnabled] TimeFormatAction isTwentyFourHourFormatEnabled
             */

            /**
             * Constructs a new TimeFormatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a TimeFormatAction.
             * @implements ITimeFormatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction=} [properties] Properties to set
             */
            function TimeFormatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TimeFormatAction isTwentyFourHourFormatEnabled.
             * @member {boolean} isTwentyFourHourFormatEnabled
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @instance
             */
            TimeFormatAction.prototype.isTwentyFourHourFormatEnabled = false;

            /**
             * Creates a new TimeFormatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction} TimeFormatAction instance
             */
            TimeFormatAction.create = function create(properties) {
                return new TimeFormatAction(properties);
            };

            /**
             * Encodes the specified TimeFormatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction} message TimeFormatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TimeFormatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isTwentyFourHourFormatEnabled != null && Object.hasOwnProperty.call(message, "isTwentyFourHourFormatEnabled"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isTwentyFourHourFormatEnabled);
                return writer;
            };

            /**
             * Encodes the specified TimeFormatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction} message TimeFormatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TimeFormatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TimeFormatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction} TimeFormatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TimeFormatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isTwentyFourHourFormatEnabled = reader.bool();
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
             * Decodes a TimeFormatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction} TimeFormatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TimeFormatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TimeFormatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TimeFormatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isTwentyFourHourFormatEnabled != null && message.hasOwnProperty("isTwentyFourHourFormatEnabled"))
                    if (typeof message.isTwentyFourHourFormatEnabled !== "boolean")
                        return "isTwentyFourHourFormatEnabled: boolean expected";
                return null;
            };

            /**
             * Creates a TimeFormatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction} TimeFormatAction
             */
            TimeFormatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction();
                if (object.isTwentyFourHourFormatEnabled != null)
                    message.isTwentyFourHourFormatEnabled = Boolean(object.isTwentyFourHourFormatEnabled);
                return message;
            };

            /**
             * Creates a plain object from a TimeFormatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction} message TimeFormatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TimeFormatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.isTwentyFourHourFormatEnabled = false;
                if (message.isTwentyFourHourFormatEnabled != null && message.hasOwnProperty("isTwentyFourHourFormatEnabled"))
                    object.isTwentyFourHourFormatEnabled = message.isTwentyFourHourFormatEnabled;
                return object;
            };

            /**
             * Converts this TimeFormatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TimeFormatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TimeFormatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TimeFormatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction";
            };

            return TimeFormatAction;
        })();

        SyncActionValue.UserStatusMuteAction = (function() {

            /**
             * Properties of a UserStatusMuteAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IUserStatusMuteAction
             * @property {boolean|null} [muted] UserStatusMuteAction muted
             */

            /**
             * Constructs a new UserStatusMuteAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a UserStatusMuteAction.
             * @implements IUserStatusMuteAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction=} [properties] Properties to set
             */
            function UserStatusMuteAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UserStatusMuteAction muted.
             * @member {boolean} muted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @instance
             */
            UserStatusMuteAction.prototype.muted = false;

            /**
             * Creates a new UserStatusMuteAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction} UserStatusMuteAction instance
             */
            UserStatusMuteAction.create = function create(properties) {
                return new UserStatusMuteAction(properties);
            };

            /**
             * Encodes the specified UserStatusMuteAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction} message UserStatusMuteAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserStatusMuteAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.muted);
                return writer;
            };

            /**
             * Encodes the specified UserStatusMuteAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction} message UserStatusMuteAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserStatusMuteAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserStatusMuteAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction} UserStatusMuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserStatusMuteAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.muted = reader.bool();
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
             * Decodes a UserStatusMuteAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction} UserStatusMuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserStatusMuteAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UserStatusMuteAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserStatusMuteAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                return null;
            };

            /**
             * Creates a UserStatusMuteAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction} UserStatusMuteAction
             */
            UserStatusMuteAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction();
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                return message;
            };

            /**
             * Creates a plain object from a UserStatusMuteAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction} message UserStatusMuteAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserStatusMuteAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.muted = false;
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                return object;
            };

            /**
             * Converts this UserStatusMuteAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserStatusMuteAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UserStatusMuteAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UserStatusMuteAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction";
            };

            return UserStatusMuteAction;
        })();

        SyncActionValue.SubscriptionAction = (function() {

            /**
             * Properties of a SubscriptionAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ISubscriptionAction
             * @property {boolean|null} [isDeactivated] SubscriptionAction isDeactivated
             * @property {boolean|null} [isAutoRenewing] SubscriptionAction isAutoRenewing
             * @property {number|Long|null} [expirationDate] SubscriptionAction expirationDate
             */

            /**
             * Constructs a new SubscriptionAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a SubscriptionAction.
             * @implements ISubscriptionAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction=} [properties] Properties to set
             */
            function SubscriptionAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SubscriptionAction isDeactivated.
             * @member {boolean} isDeactivated
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @instance
             */
            SubscriptionAction.prototype.isDeactivated = false;

            /**
             * SubscriptionAction isAutoRenewing.
             * @member {boolean} isAutoRenewing
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @instance
             */
            SubscriptionAction.prototype.isAutoRenewing = false;

            /**
             * SubscriptionAction expirationDate.
             * @member {number|Long} expirationDate
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @instance
             */
            SubscriptionAction.prototype.expirationDate = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new SubscriptionAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction} SubscriptionAction instance
             */
            SubscriptionAction.create = function create(properties) {
                return new SubscriptionAction(properties);
            };

            /**
             * Encodes the specified SubscriptionAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction} message SubscriptionAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isDeactivated != null && Object.hasOwnProperty.call(message, "isDeactivated"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isDeactivated);
                if (message.isAutoRenewing != null && Object.hasOwnProperty.call(message, "isAutoRenewing"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isAutoRenewing);
                if (message.expirationDate != null && Object.hasOwnProperty.call(message, "expirationDate"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.expirationDate);
                return writer;
            };

            /**
             * Encodes the specified SubscriptionAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction} message SubscriptionAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SubscriptionAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SubscriptionAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction} SubscriptionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.isDeactivated = reader.bool();
                            break;
                        }
                    case 2: {
                            message.isAutoRenewing = reader.bool();
                            break;
                        }
                    case 3: {
                            message.expirationDate = reader.int64();
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
             * Decodes a SubscriptionAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction} SubscriptionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SubscriptionAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SubscriptionAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SubscriptionAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isDeactivated != null && message.hasOwnProperty("isDeactivated"))
                    if (typeof message.isDeactivated !== "boolean")
                        return "isDeactivated: boolean expected";
                if (message.isAutoRenewing != null && message.hasOwnProperty("isAutoRenewing"))
                    if (typeof message.isAutoRenewing !== "boolean")
                        return "isAutoRenewing: boolean expected";
                if (message.expirationDate != null && message.hasOwnProperty("expirationDate"))
                    if (!$util.isInteger(message.expirationDate) && !(message.expirationDate && $util.isInteger(message.expirationDate.low) && $util.isInteger(message.expirationDate.high)))
                        return "expirationDate: integer|Long expected";
                return null;
            };

            /**
             * Creates a SubscriptionAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction} SubscriptionAction
             */
            SubscriptionAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction();
                if (object.isDeactivated != null)
                    message.isDeactivated = Boolean(object.isDeactivated);
                if (object.isAutoRenewing != null)
                    message.isAutoRenewing = Boolean(object.isAutoRenewing);
                if (object.expirationDate != null)
                    if ($util.Long)
                        (message.expirationDate = $util.Long.fromValue(object.expirationDate)).unsigned = false;
                    else if (typeof object.expirationDate === "string")
                        message.expirationDate = parseInt(object.expirationDate, 10);
                    else if (typeof object.expirationDate === "number")
                        message.expirationDate = object.expirationDate;
                    else if (typeof object.expirationDate === "object")
                        message.expirationDate = new $util.LongBits(object.expirationDate.low >>> 0, object.expirationDate.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a SubscriptionAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction} message SubscriptionAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SubscriptionAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.isDeactivated = false;
                    object.isAutoRenewing = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.expirationDate = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.expirationDate = options.longs === String ? "0" : 0;
                }
                if (message.isDeactivated != null && message.hasOwnProperty("isDeactivated"))
                    object.isDeactivated = message.isDeactivated;
                if (message.isAutoRenewing != null && message.hasOwnProperty("isAutoRenewing"))
                    object.isAutoRenewing = message.isAutoRenewing;
                if (message.expirationDate != null && message.hasOwnProperty("expirationDate"))
                    if (typeof message.expirationDate === "number")
                        object.expirationDate = options.longs === String ? String(message.expirationDate) : message.expirationDate;
                    else
                        object.expirationDate = options.longs === String ? $util.Long.prototype.toString.call(message.expirationDate) : options.longs === Number ? new $util.LongBits(message.expirationDate.low >>> 0, message.expirationDate.high >>> 0).toNumber() : message.expirationDate;
                return object;
            };

            /**
             * Converts this SubscriptionAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SubscriptionAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SubscriptionAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SubscriptionAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction";
            };

            return SubscriptionAction;
        })();

        SyncActionValue.AgentAction = (function() {

            /**
             * Properties of an AgentAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IAgentAction
             * @property {string|null} [name] AgentAction name
             * @property {number|null} [deviceID] AgentAction deviceID
             * @property {boolean|null} [isDeleted] AgentAction isDeleted
             */

            /**
             * Constructs a new AgentAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents an AgentAction.
             * @implements IAgentAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAgentAction=} [properties] Properties to set
             */
            function AgentAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AgentAction name.
             * @member {string} name
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @instance
             */
            AgentAction.prototype.name = "";

            /**
             * AgentAction deviceID.
             * @member {number} deviceID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @instance
             */
            AgentAction.prototype.deviceID = 0;

            /**
             * AgentAction isDeleted.
             * @member {boolean} isDeleted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @instance
             */
            AgentAction.prototype.isDeleted = false;

            /**
             * Creates a new AgentAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAgentAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AgentAction} AgentAction instance
             */
            AgentAction.create = function create(properties) {
                return new AgentAction(properties);
            };

            /**
             * Encodes the specified AgentAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AgentAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAgentAction} message AgentAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AgentAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.deviceID != null && Object.hasOwnProperty.call(message, "deviceID"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.deviceID);
                if (message.isDeleted != null && Object.hasOwnProperty.call(message, "isDeleted"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isDeleted);
                return writer;
            };

            /**
             * Encodes the specified AgentAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AgentAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAgentAction} message AgentAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AgentAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AgentAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AgentAction} AgentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AgentAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.deviceID = reader.int32();
                            break;
                        }
                    case 3: {
                            message.isDeleted = reader.bool();
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
             * Decodes an AgentAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AgentAction} AgentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AgentAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AgentAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AgentAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.deviceID != null && message.hasOwnProperty("deviceID"))
                    if (!$util.isInteger(message.deviceID))
                        return "deviceID: integer expected";
                if (message.isDeleted != null && message.hasOwnProperty("isDeleted"))
                    if (typeof message.isDeleted !== "boolean")
                        return "isDeleted: boolean expected";
                return null;
            };

            /**
             * Creates an AgentAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AgentAction} AgentAction
             */
            AgentAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.AgentAction();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.deviceID != null)
                    message.deviceID = object.deviceID | 0;
                if (object.isDeleted != null)
                    message.isDeleted = Boolean(object.isDeleted);
                return message;
            };

            /**
             * Creates a plain object from an AgentAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.AgentAction} message AgentAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AgentAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.deviceID = 0;
                    object.isDeleted = false;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.deviceID != null && message.hasOwnProperty("deviceID"))
                    object.deviceID = message.deviceID;
                if (message.isDeleted != null && message.hasOwnProperty("isDeleted"))
                    object.isDeleted = message.isDeleted;
                return object;
            };

            /**
             * Converts this AgentAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AgentAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AgentAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AgentAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AgentAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.AgentAction";
            };

            return AgentAction;
        })();

        SyncActionValue.AndroidUnsupportedActions = (function() {

            /**
             * Properties of an AndroidUnsupportedActions.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IAndroidUnsupportedActions
             * @property {boolean|null} [allowed] AndroidUnsupportedActions allowed
             */

            /**
             * Constructs a new AndroidUnsupportedActions.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents an AndroidUnsupportedActions.
             * @implements IAndroidUnsupportedActions
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions=} [properties] Properties to set
             */
            function AndroidUnsupportedActions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AndroidUnsupportedActions allowed.
             * @member {boolean} allowed
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @instance
             */
            AndroidUnsupportedActions.prototype.allowed = false;

            /**
             * Creates a new AndroidUnsupportedActions instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions} AndroidUnsupportedActions instance
             */
            AndroidUnsupportedActions.create = function create(properties) {
                return new AndroidUnsupportedActions(properties);
            };

            /**
             * Encodes the specified AndroidUnsupportedActions message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions} message AndroidUnsupportedActions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AndroidUnsupportedActions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.allowed != null && Object.hasOwnProperty.call(message, "allowed"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.allowed);
                return writer;
            };

            /**
             * Encodes the specified AndroidUnsupportedActions message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions} message AndroidUnsupportedActions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AndroidUnsupportedActions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AndroidUnsupportedActions message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions} AndroidUnsupportedActions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AndroidUnsupportedActions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.allowed = reader.bool();
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
             * Decodes an AndroidUnsupportedActions message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions} AndroidUnsupportedActions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AndroidUnsupportedActions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AndroidUnsupportedActions message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AndroidUnsupportedActions.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.allowed != null && message.hasOwnProperty("allowed"))
                    if (typeof message.allowed !== "boolean")
                        return "allowed: boolean expected";
                return null;
            };

            /**
             * Creates an AndroidUnsupportedActions message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions} AndroidUnsupportedActions
             */
            AndroidUnsupportedActions.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions();
                if (object.allowed != null)
                    message.allowed = Boolean(object.allowed);
                return message;
            };

            /**
             * Creates a plain object from an AndroidUnsupportedActions message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions} message AndroidUnsupportedActions
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AndroidUnsupportedActions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.allowed = false;
                if (message.allowed != null && message.hasOwnProperty("allowed"))
                    object.allowed = message.allowed;
                return object;
            };

            /**
             * Converts this AndroidUnsupportedActions to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AndroidUnsupportedActions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AndroidUnsupportedActions
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AndroidUnsupportedActions.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions";
            };

            return AndroidUnsupportedActions;
        })();

        SyncActionValue.PrimaryFeature = (function() {

            /**
             * Properties of a PrimaryFeature.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPrimaryFeature
             * @property {Array.<string>|null} [flags] PrimaryFeature flags
             */

            /**
             * Constructs a new PrimaryFeature.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PrimaryFeature.
             * @implements IPrimaryFeature
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature=} [properties] Properties to set
             */
            function PrimaryFeature(properties) {
                this.flags = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PrimaryFeature flags.
             * @member {Array.<string>} flags
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @instance
             */
            PrimaryFeature.prototype.flags = $util.emptyArray;

            /**
             * Creates a new PrimaryFeature instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature} PrimaryFeature instance
             */
            PrimaryFeature.create = function create(properties) {
                return new PrimaryFeature(properties);
            };

            /**
             * Encodes the specified PrimaryFeature message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature} message PrimaryFeature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrimaryFeature.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.flags != null && message.flags.length)
                    for (var i = 0; i < message.flags.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.flags[i]);
                return writer;
            };

            /**
             * Encodes the specified PrimaryFeature message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature} message PrimaryFeature message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PrimaryFeature.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PrimaryFeature message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature} PrimaryFeature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrimaryFeature.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.flags && message.flags.length))
                                message.flags = [];
                            message.flags.push(reader.string());
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
             * Decodes a PrimaryFeature message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature} PrimaryFeature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PrimaryFeature.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PrimaryFeature message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PrimaryFeature.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.flags != null && message.hasOwnProperty("flags")) {
                    if (!Array.isArray(message.flags))
                        return "flags: array expected";
                    for (var i = 0; i < message.flags.length; ++i)
                        if (!$util.isString(message.flags[i]))
                            return "flags: string[] expected";
                }
                return null;
            };

            /**
             * Creates a PrimaryFeature message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature} PrimaryFeature
             */
            PrimaryFeature.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature();
                if (object.flags) {
                    if (!Array.isArray(object.flags))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.flags: array expected");
                    message.flags = [];
                    for (var i = 0; i < object.flags.length; ++i)
                        message.flags[i] = String(object.flags[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a PrimaryFeature message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature} message PrimaryFeature
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PrimaryFeature.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.flags = [];
                if (message.flags && message.flags.length) {
                    object.flags = [];
                    for (var j = 0; j < message.flags.length; ++j)
                        object.flags[j] = message.flags[j];
                }
                return object;
            };

            /**
             * Converts this PrimaryFeature to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PrimaryFeature.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PrimaryFeature
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PrimaryFeature.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature";
            };

            return PrimaryFeature;
        })();

        SyncActionValue.KeyExpiration = (function() {

            /**
             * Properties of a KeyExpiration.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IKeyExpiration
             * @property {number|null} [expiredKeyEpoch] KeyExpiration expiredKeyEpoch
             */

            /**
             * Constructs a new KeyExpiration.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a KeyExpiration.
             * @implements IKeyExpiration
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration=} [properties] Properties to set
             */
            function KeyExpiration(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * KeyExpiration expiredKeyEpoch.
             * @member {number} expiredKeyEpoch
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @instance
             */
            KeyExpiration.prototype.expiredKeyEpoch = 0;

            /**
             * Creates a new KeyExpiration instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.KeyExpiration} KeyExpiration instance
             */
            KeyExpiration.create = function create(properties) {
                return new KeyExpiration(properties);
            };

            /**
             * Encodes the specified KeyExpiration message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration} message KeyExpiration message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyExpiration.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.expiredKeyEpoch != null && Object.hasOwnProperty.call(message, "expiredKeyEpoch"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.expiredKeyEpoch);
                return writer;
            };

            /**
             * Encodes the specified KeyExpiration message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration} message KeyExpiration message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KeyExpiration.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KeyExpiration message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.KeyExpiration} KeyExpiration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyExpiration.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.expiredKeyEpoch = reader.int32();
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
             * Decodes a KeyExpiration message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.KeyExpiration} KeyExpiration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KeyExpiration.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KeyExpiration message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KeyExpiration.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.expiredKeyEpoch != null && message.hasOwnProperty("expiredKeyEpoch"))
                    if (!$util.isInteger(message.expiredKeyEpoch))
                        return "expiredKeyEpoch: integer expected";
                return null;
            };

            /**
             * Creates a KeyExpiration message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.KeyExpiration} KeyExpiration
             */
            KeyExpiration.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.KeyExpiration();
                if (object.expiredKeyEpoch != null)
                    message.expiredKeyEpoch = object.expiredKeyEpoch | 0;
                return message;
            };

            /**
             * Creates a plain object from a KeyExpiration message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.KeyExpiration} message KeyExpiration
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KeyExpiration.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.expiredKeyEpoch = 0;
                if (message.expiredKeyEpoch != null && message.hasOwnProperty("expiredKeyEpoch"))
                    object.expiredKeyEpoch = message.expiredKeyEpoch;
                return object;
            };

            /**
             * Converts this KeyExpiration to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KeyExpiration.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for KeyExpiration
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.KeyExpiration
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            KeyExpiration.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.KeyExpiration";
            };

            return KeyExpiration;
        })();

        SyncActionValue.SyncActionMessage = (function() {

            /**
             * Properties of a SyncActionMessage.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ISyncActionMessage
             * @property {WAProtocol.IMessageKey|null} [key] SyncActionMessage key
             * @property {number|Long|null} [timestamp] SyncActionMessage timestamp
             */

            /**
             * Constructs a new SyncActionMessage.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a SyncActionMessage.
             * @implements ISyncActionMessage
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage=} [properties] Properties to set
             */
            function SyncActionMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncActionMessage key.
             * @member {WAProtocol.IMessageKey|null|undefined} key
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @instance
             */
            SyncActionMessage.prototype.key = null;

            /**
             * SyncActionMessage timestamp.
             * @member {number|Long} timestamp
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @instance
             */
            SyncActionMessage.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new SyncActionMessage instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage} SyncActionMessage instance
             */
            SyncActionMessage.create = function create(properties) {
                return new SyncActionMessage(properties);
            };

            /**
             * Encodes the specified SyncActionMessage message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage} message SyncActionMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncActionMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                    $root.WAProtocol.MessageKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
                return writer;
            };

            /**
             * Encodes the specified SyncActionMessage message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage} message SyncActionMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncActionMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SyncActionMessage message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage} SyncActionMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncActionMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.key = $root.WAProtocol.MessageKey.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.int64();
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
             * Decodes a SyncActionMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage} SyncActionMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncActionMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncActionMessage message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncActionMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.key != null && message.hasOwnProperty("key")) {
                    var error = $root.WAProtocol.MessageKey.verify(message.key);
                    if (error)
                        return "key." + error;
                }
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                        return "timestamp: integer|Long expected";
                return null;
            };

            /**
             * Creates a SyncActionMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage} SyncActionMessage
             */
            SyncActionMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage();
                if (object.key != null) {
                    if (typeof object.key !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.key: object expected");
                    message.key = $root.WAProtocol.MessageKey.fromObject(object.key);
                }
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
             * Creates a plain object from a SyncActionMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage} message SyncActionMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncActionMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.key = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.timestamp = options.longs === String ? "0" : 0;
                }
                if (message.key != null && message.hasOwnProperty("key"))
                    object.key = $root.WAProtocol.MessageKey.toObject(message.key, options);
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (typeof message.timestamp === "number")
                        object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                    else
                        object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                return object;
            };

            /**
             * Converts this SyncActionMessage to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncActionMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncActionMessage
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncActionMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage";
            };

            return SyncActionMessage;
        })();

        SyncActionValue.SyncActionMessageRange = (function() {

            /**
             * Properties of a SyncActionMessageRange.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ISyncActionMessageRange
             * @property {number|Long|null} [lastMessageTimestamp] SyncActionMessageRange lastMessageTimestamp
             * @property {number|Long|null} [lastSystemMessageTimestamp] SyncActionMessageRange lastSystemMessageTimestamp
             * @property {Array.<WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage>|null} [messages] SyncActionMessageRange messages
             */

            /**
             * Constructs a new SyncActionMessageRange.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a SyncActionMessageRange.
             * @implements ISyncActionMessageRange
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange=} [properties] Properties to set
             */
            function SyncActionMessageRange(properties) {
                this.messages = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SyncActionMessageRange lastMessageTimestamp.
             * @member {number|Long} lastMessageTimestamp
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @instance
             */
            SyncActionMessageRange.prototype.lastMessageTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * SyncActionMessageRange lastSystemMessageTimestamp.
             * @member {number|Long} lastSystemMessageTimestamp
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @instance
             */
            SyncActionMessageRange.prototype.lastSystemMessageTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * SyncActionMessageRange messages.
             * @member {Array.<WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage>} messages
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @instance
             */
            SyncActionMessageRange.prototype.messages = $util.emptyArray;

            /**
             * Creates a new SyncActionMessageRange instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange} SyncActionMessageRange instance
             */
            SyncActionMessageRange.create = function create(properties) {
                return new SyncActionMessageRange(properties);
            };

            /**
             * Encodes the specified SyncActionMessageRange message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange} message SyncActionMessageRange message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncActionMessageRange.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.lastMessageTimestamp != null && Object.hasOwnProperty.call(message, "lastMessageTimestamp"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.lastMessageTimestamp);
                if (message.lastSystemMessageTimestamp != null && Object.hasOwnProperty.call(message, "lastSystemMessageTimestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.lastSystemMessageTimestamp);
                if (message.messages != null && message.messages.length)
                    for (var i = 0; i < message.messages.length; ++i)
                        $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.encode(message.messages[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified SyncActionMessageRange message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange} message SyncActionMessageRange message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncActionMessageRange.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SyncActionMessageRange message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange} SyncActionMessageRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncActionMessageRange.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.lastMessageTimestamp = reader.int64();
                            break;
                        }
                    case 2: {
                            message.lastSystemMessageTimestamp = reader.int64();
                            break;
                        }
                    case 3: {
                            if (!(message.messages && message.messages.length))
                                message.messages = [];
                            message.messages.push($root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.decode(reader, reader.uint32()));
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
             * Decodes a SyncActionMessageRange message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange} SyncActionMessageRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncActionMessageRange.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SyncActionMessageRange message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncActionMessageRange.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.lastMessageTimestamp != null && message.hasOwnProperty("lastMessageTimestamp"))
                    if (!$util.isInteger(message.lastMessageTimestamp) && !(message.lastMessageTimestamp && $util.isInteger(message.lastMessageTimestamp.low) && $util.isInteger(message.lastMessageTimestamp.high)))
                        return "lastMessageTimestamp: integer|Long expected";
                if (message.lastSystemMessageTimestamp != null && message.hasOwnProperty("lastSystemMessageTimestamp"))
                    if (!$util.isInteger(message.lastSystemMessageTimestamp) && !(message.lastSystemMessageTimestamp && $util.isInteger(message.lastSystemMessageTimestamp.low) && $util.isInteger(message.lastSystemMessageTimestamp.high)))
                        return "lastSystemMessageTimestamp: integer|Long expected";
                if (message.messages != null && message.hasOwnProperty("messages")) {
                    if (!Array.isArray(message.messages))
                        return "messages: array expected";
                    for (var i = 0; i < message.messages.length; ++i) {
                        var error = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.verify(message.messages[i]);
                        if (error)
                            return "messages." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a SyncActionMessageRange message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange} SyncActionMessageRange
             */
            SyncActionMessageRange.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange();
                if (object.lastMessageTimestamp != null)
                    if ($util.Long)
                        (message.lastMessageTimestamp = $util.Long.fromValue(object.lastMessageTimestamp)).unsigned = false;
                    else if (typeof object.lastMessageTimestamp === "string")
                        message.lastMessageTimestamp = parseInt(object.lastMessageTimestamp, 10);
                    else if (typeof object.lastMessageTimestamp === "number")
                        message.lastMessageTimestamp = object.lastMessageTimestamp;
                    else if (typeof object.lastMessageTimestamp === "object")
                        message.lastMessageTimestamp = new $util.LongBits(object.lastMessageTimestamp.low >>> 0, object.lastMessageTimestamp.high >>> 0).toNumber();
                if (object.lastSystemMessageTimestamp != null)
                    if ($util.Long)
                        (message.lastSystemMessageTimestamp = $util.Long.fromValue(object.lastSystemMessageTimestamp)).unsigned = false;
                    else if (typeof object.lastSystemMessageTimestamp === "string")
                        message.lastSystemMessageTimestamp = parseInt(object.lastSystemMessageTimestamp, 10);
                    else if (typeof object.lastSystemMessageTimestamp === "number")
                        message.lastSystemMessageTimestamp = object.lastSystemMessageTimestamp;
                    else if (typeof object.lastSystemMessageTimestamp === "object")
                        message.lastSystemMessageTimestamp = new $util.LongBits(object.lastSystemMessageTimestamp.low >>> 0, object.lastSystemMessageTimestamp.high >>> 0).toNumber();
                if (object.messages) {
                    if (!Array.isArray(object.messages))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.messages: array expected");
                    message.messages = [];
                    for (var i = 0; i < object.messages.length; ++i) {
                        if (typeof object.messages[i] !== "object")
                            throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.messages: object expected");
                        message.messages[i] = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.fromObject(object.messages[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a SyncActionMessageRange message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange} message SyncActionMessageRange
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncActionMessageRange.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.messages = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.lastMessageTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastMessageTimestamp = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.lastSystemMessageTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastSystemMessageTimestamp = options.longs === String ? "0" : 0;
                }
                if (message.lastMessageTimestamp != null && message.hasOwnProperty("lastMessageTimestamp"))
                    if (typeof message.lastMessageTimestamp === "number")
                        object.lastMessageTimestamp = options.longs === String ? String(message.lastMessageTimestamp) : message.lastMessageTimestamp;
                    else
                        object.lastMessageTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.lastMessageTimestamp) : options.longs === Number ? new $util.LongBits(message.lastMessageTimestamp.low >>> 0, message.lastMessageTimestamp.high >>> 0).toNumber() : message.lastMessageTimestamp;
                if (message.lastSystemMessageTimestamp != null && message.hasOwnProperty("lastSystemMessageTimestamp"))
                    if (typeof message.lastSystemMessageTimestamp === "number")
                        object.lastSystemMessageTimestamp = options.longs === String ? String(message.lastSystemMessageTimestamp) : message.lastSystemMessageTimestamp;
                    else
                        object.lastSystemMessageTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.lastSystemMessageTimestamp) : options.longs === Number ? new $util.LongBits(message.lastSystemMessageTimestamp.low >>> 0, message.lastSystemMessageTimestamp.high >>> 0).toNumber() : message.lastSystemMessageTimestamp;
                if (message.messages && message.messages.length) {
                    object.messages = [];
                    for (var j = 0; j < message.messages.length; ++j)
                        object.messages[j] = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.toObject(message.messages[j], options);
                }
                return object;
            };

            /**
             * Converts this SyncActionMessageRange to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncActionMessageRange.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SyncActionMessageRange
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SyncActionMessageRange.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange";
            };

            return SyncActionMessageRange;
        })();

        SyncActionValue.UnarchiveChatsSetting = (function() {

            /**
             * Properties of an UnarchiveChatsSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IUnarchiveChatsSetting
             * @property {boolean|null} [unarchiveChats] UnarchiveChatsSetting unarchiveChats
             */

            /**
             * Constructs a new UnarchiveChatsSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents an UnarchiveChatsSetting.
             * @implements IUnarchiveChatsSetting
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting=} [properties] Properties to set
             */
            function UnarchiveChatsSetting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UnarchiveChatsSetting unarchiveChats.
             * @member {boolean} unarchiveChats
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @instance
             */
            UnarchiveChatsSetting.prototype.unarchiveChats = false;

            /**
             * Creates a new UnarchiveChatsSetting instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting} UnarchiveChatsSetting instance
             */
            UnarchiveChatsSetting.create = function create(properties) {
                return new UnarchiveChatsSetting(properties);
            };

            /**
             * Encodes the specified UnarchiveChatsSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting} message UnarchiveChatsSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UnarchiveChatsSetting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.unarchiveChats != null && Object.hasOwnProperty.call(message, "unarchiveChats"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.unarchiveChats);
                return writer;
            };

            /**
             * Encodes the specified UnarchiveChatsSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting} message UnarchiveChatsSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UnarchiveChatsSetting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UnarchiveChatsSetting message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting} UnarchiveChatsSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UnarchiveChatsSetting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.unarchiveChats = reader.bool();
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
             * Decodes an UnarchiveChatsSetting message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting} UnarchiveChatsSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UnarchiveChatsSetting.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UnarchiveChatsSetting message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UnarchiveChatsSetting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.unarchiveChats != null && message.hasOwnProperty("unarchiveChats"))
                    if (typeof message.unarchiveChats !== "boolean")
                        return "unarchiveChats: boolean expected";
                return null;
            };

            /**
             * Creates an UnarchiveChatsSetting message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting} UnarchiveChatsSetting
             */
            UnarchiveChatsSetting.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting();
                if (object.unarchiveChats != null)
                    message.unarchiveChats = Boolean(object.unarchiveChats);
                return message;
            };

            /**
             * Creates a plain object from an UnarchiveChatsSetting message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting} message UnarchiveChatsSetting
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UnarchiveChatsSetting.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.unarchiveChats = false;
                if (message.unarchiveChats != null && message.hasOwnProperty("unarchiveChats"))
                    object.unarchiveChats = message.unarchiveChats;
                return object;
            };

            /**
             * Converts this UnarchiveChatsSetting to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UnarchiveChatsSetting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UnarchiveChatsSetting
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UnarchiveChatsSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting";
            };

            return UnarchiveChatsSetting;
        })();

        SyncActionValue.DeleteChatAction = (function() {

            /**
             * Properties of a DeleteChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IDeleteChatAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null} [messageRange] DeleteChatAction messageRange
             */

            /**
             * Constructs a new DeleteChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a DeleteChatAction.
             * @implements IDeleteChatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction=} [properties] Properties to set
             */
            function DeleteChatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteChatAction messageRange.
             * @member {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null|undefined} messageRange
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @instance
             */
            DeleteChatAction.prototype.messageRange = null;

            /**
             * Creates a new DeleteChatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction} DeleteChatAction instance
             */
            DeleteChatAction.create = function create(properties) {
                return new DeleteChatAction(properties);
            };

            /**
             * Encodes the specified DeleteChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction} message DeleteChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteChatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageRange != null && Object.hasOwnProperty.call(message, "messageRange"))
                    $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.encode(message.messageRange, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DeleteChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction} message DeleteChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteChatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteChatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction} DeleteChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteChatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.decode(reader, reader.uint32());
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
             * Decodes a DeleteChatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction} DeleteChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteChatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteChatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteChatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageRange != null && message.hasOwnProperty("messageRange")) {
                    var error = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify(message.messageRange);
                    if (error)
                        return "messageRange." + error;
                }
                return null;
            };

            /**
             * Creates a DeleteChatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction} DeleteChatAction
             */
            DeleteChatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction();
                if (object.messageRange != null) {
                    if (typeof object.messageRange !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.messageRange: object expected");
                    message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.fromObject(object.messageRange);
                }
                return message;
            };

            /**
             * Creates a plain object from a DeleteChatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction} message DeleteChatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteChatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.messageRange = null;
                if (message.messageRange != null && message.hasOwnProperty("messageRange"))
                    object.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.toObject(message.messageRange, options);
                return object;
            };

            /**
             * Converts this DeleteChatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteChatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteChatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteChatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction";
            };

            return DeleteChatAction;
        })();

        SyncActionValue.ClearChatAction = (function() {

            /**
             * Properties of a ClearChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IClearChatAction
             * @property {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null} [messageRange] ClearChatAction messageRange
             */

            /**
             * Constructs a new ClearChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a ClearChatAction.
             * @implements IClearChatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction=} [properties] Properties to set
             */
            function ClearChatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ClearChatAction messageRange.
             * @member {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null|undefined} messageRange
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @instance
             */
            ClearChatAction.prototype.messageRange = null;

            /**
             * Creates a new ClearChatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ClearChatAction} ClearChatAction instance
             */
            ClearChatAction.create = function create(properties) {
                return new ClearChatAction(properties);
            };

            /**
             * Encodes the specified ClearChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction} message ClearChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearChatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.messageRange != null && Object.hasOwnProperty.call(message, "messageRange"))
                    $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.encode(message.messageRange, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ClearChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IClearChatAction} message ClearChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClearChatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ClearChatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ClearChatAction} ClearChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearChatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.decode(reader, reader.uint32());
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
             * Decodes a ClearChatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ClearChatAction} ClearChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClearChatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClearChatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClearChatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.messageRange != null && message.hasOwnProperty("messageRange")) {
                    var error = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify(message.messageRange);
                    if (error)
                        return "messageRange." + error;
                }
                return null;
            };

            /**
             * Creates a ClearChatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ClearChatAction} ClearChatAction
             */
            ClearChatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ClearChatAction();
                if (object.messageRange != null) {
                    if (typeof object.messageRange !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.messageRange: object expected");
                    message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.fromObject(object.messageRange);
                }
                return message;
            };

            /**
             * Creates a plain object from a ClearChatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ClearChatAction} message ClearChatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClearChatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.messageRange = null;
                if (message.messageRange != null && message.hasOwnProperty("messageRange"))
                    object.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.toObject(message.messageRange, options);
                return object;
            };

            /**
             * Converts this ClearChatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClearChatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ClearChatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ClearChatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ClearChatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ClearChatAction";
            };

            return ClearChatAction;
        })();

        SyncActionValue.MarkChatAsReadAction = (function() {

            /**
             * Properties of a MarkChatAsReadAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IMarkChatAsReadAction
             * @property {boolean|null} [read] MarkChatAsReadAction read
             * @property {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null} [messageRange] MarkChatAsReadAction messageRange
             */

            /**
             * Constructs a new MarkChatAsReadAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a MarkChatAsReadAction.
             * @implements IMarkChatAsReadAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction=} [properties] Properties to set
             */
            function MarkChatAsReadAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MarkChatAsReadAction read.
             * @member {boolean} read
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @instance
             */
            MarkChatAsReadAction.prototype.read = false;

            /**
             * MarkChatAsReadAction messageRange.
             * @member {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null|undefined} messageRange
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @instance
             */
            MarkChatAsReadAction.prototype.messageRange = null;

            /**
             * Creates a new MarkChatAsReadAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction} MarkChatAsReadAction instance
             */
            MarkChatAsReadAction.create = function create(properties) {
                return new MarkChatAsReadAction(properties);
            };

            /**
             * Encodes the specified MarkChatAsReadAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction} message MarkChatAsReadAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkChatAsReadAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.read != null && Object.hasOwnProperty.call(message, "read"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.read);
                if (message.messageRange != null && Object.hasOwnProperty.call(message, "messageRange"))
                    $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.encode(message.messageRange, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified MarkChatAsReadAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction} message MarkChatAsReadAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MarkChatAsReadAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MarkChatAsReadAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction} MarkChatAsReadAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkChatAsReadAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.read = reader.bool();
                            break;
                        }
                    case 2: {
                            message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.decode(reader, reader.uint32());
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
             * Decodes a MarkChatAsReadAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction} MarkChatAsReadAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MarkChatAsReadAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MarkChatAsReadAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MarkChatAsReadAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.read != null && message.hasOwnProperty("read"))
                    if (typeof message.read !== "boolean")
                        return "read: boolean expected";
                if (message.messageRange != null && message.hasOwnProperty("messageRange")) {
                    var error = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify(message.messageRange);
                    if (error)
                        return "messageRange." + error;
                }
                return null;
            };

            /**
             * Creates a MarkChatAsReadAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction} MarkChatAsReadAction
             */
            MarkChatAsReadAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction();
                if (object.read != null)
                    message.read = Boolean(object.read);
                if (object.messageRange != null) {
                    if (typeof object.messageRange !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.messageRange: object expected");
                    message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.fromObject(object.messageRange);
                }
                return message;
            };

            /**
             * Creates a plain object from a MarkChatAsReadAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction} message MarkChatAsReadAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MarkChatAsReadAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.read = false;
                    object.messageRange = null;
                }
                if (message.read != null && message.hasOwnProperty("read"))
                    object.read = message.read;
                if (message.messageRange != null && message.hasOwnProperty("messageRange"))
                    object.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.toObject(message.messageRange, options);
                return object;
            };

            /**
             * Converts this MarkChatAsReadAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MarkChatAsReadAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MarkChatAsReadAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MarkChatAsReadAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction";
            };

            return MarkChatAsReadAction;
        })();

        SyncActionValue.DeleteMessageForMeAction = (function() {

            /**
             * Properties of a DeleteMessageForMeAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IDeleteMessageForMeAction
             * @property {boolean|null} [deleteMedia] DeleteMessageForMeAction deleteMedia
             * @property {number|Long|null} [messageTimestamp] DeleteMessageForMeAction messageTimestamp
             */

            /**
             * Constructs a new DeleteMessageForMeAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a DeleteMessageForMeAction.
             * @implements IDeleteMessageForMeAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction=} [properties] Properties to set
             */
            function DeleteMessageForMeAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteMessageForMeAction deleteMedia.
             * @member {boolean} deleteMedia
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @instance
             */
            DeleteMessageForMeAction.prototype.deleteMedia = false;

            /**
             * DeleteMessageForMeAction messageTimestamp.
             * @member {number|Long} messageTimestamp
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @instance
             */
            DeleteMessageForMeAction.prototype.messageTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new DeleteMessageForMeAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction} DeleteMessageForMeAction instance
             */
            DeleteMessageForMeAction.create = function create(properties) {
                return new DeleteMessageForMeAction(properties);
            };

            /**
             * Encodes the specified DeleteMessageForMeAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction} message DeleteMessageForMeAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteMessageForMeAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.deleteMedia != null && Object.hasOwnProperty.call(message, "deleteMedia"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.deleteMedia);
                if (message.messageTimestamp != null && Object.hasOwnProperty.call(message, "messageTimestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.messageTimestamp);
                return writer;
            };

            /**
             * Encodes the specified DeleteMessageForMeAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction} message DeleteMessageForMeAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteMessageForMeAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteMessageForMeAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction} DeleteMessageForMeAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteMessageForMeAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.deleteMedia = reader.bool();
                            break;
                        }
                    case 2: {
                            message.messageTimestamp = reader.int64();
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
             * Decodes a DeleteMessageForMeAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction} DeleteMessageForMeAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteMessageForMeAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteMessageForMeAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteMessageForMeAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.deleteMedia != null && message.hasOwnProperty("deleteMedia"))
                    if (typeof message.deleteMedia !== "boolean")
                        return "deleteMedia: boolean expected";
                if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                    if (!$util.isInteger(message.messageTimestamp) && !(message.messageTimestamp && $util.isInteger(message.messageTimestamp.low) && $util.isInteger(message.messageTimestamp.high)))
                        return "messageTimestamp: integer|Long expected";
                return null;
            };

            /**
             * Creates a DeleteMessageForMeAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction} DeleteMessageForMeAction
             */
            DeleteMessageForMeAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction();
                if (object.deleteMedia != null)
                    message.deleteMedia = Boolean(object.deleteMedia);
                if (object.messageTimestamp != null)
                    if ($util.Long)
                        (message.messageTimestamp = $util.Long.fromValue(object.messageTimestamp)).unsigned = false;
                    else if (typeof object.messageTimestamp === "string")
                        message.messageTimestamp = parseInt(object.messageTimestamp, 10);
                    else if (typeof object.messageTimestamp === "number")
                        message.messageTimestamp = object.messageTimestamp;
                    else if (typeof object.messageTimestamp === "object")
                        message.messageTimestamp = new $util.LongBits(object.messageTimestamp.low >>> 0, object.messageTimestamp.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a DeleteMessageForMeAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction} message DeleteMessageForMeAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteMessageForMeAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.deleteMedia = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.messageTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.messageTimestamp = options.longs === String ? "0" : 0;
                }
                if (message.deleteMedia != null && message.hasOwnProperty("deleteMedia"))
                    object.deleteMedia = message.deleteMedia;
                if (message.messageTimestamp != null && message.hasOwnProperty("messageTimestamp"))
                    if (typeof message.messageTimestamp === "number")
                        object.messageTimestamp = options.longs === String ? String(message.messageTimestamp) : message.messageTimestamp;
                    else
                        object.messageTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.messageTimestamp) : options.longs === Number ? new $util.LongBits(message.messageTimestamp.low >>> 0, message.messageTimestamp.high >>> 0).toNumber() : message.messageTimestamp;
                return object;
            };

            /**
             * Converts this DeleteMessageForMeAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteMessageForMeAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeleteMessageForMeAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeleteMessageForMeAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction";
            };

            return DeleteMessageForMeAction;
        })();

        SyncActionValue.ArchiveChatAction = (function() {

            /**
             * Properties of an ArchiveChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IArchiveChatAction
             * @property {boolean|null} [archived] ArchiveChatAction archived
             * @property {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null} [messageRange] ArchiveChatAction messageRange
             */

            /**
             * Constructs a new ArchiveChatAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents an ArchiveChatAction.
             * @implements IArchiveChatAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction=} [properties] Properties to set
             */
            function ArchiveChatAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ArchiveChatAction archived.
             * @member {boolean} archived
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @instance
             */
            ArchiveChatAction.prototype.archived = false;

            /**
             * ArchiveChatAction messageRange.
             * @member {WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null|undefined} messageRange
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @instance
             */
            ArchiveChatAction.prototype.messageRange = null;

            /**
             * Creates a new ArchiveChatAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction} ArchiveChatAction instance
             */
            ArchiveChatAction.create = function create(properties) {
                return new ArchiveChatAction(properties);
            };

            /**
             * Encodes the specified ArchiveChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction} message ArchiveChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ArchiveChatAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.archived != null && Object.hasOwnProperty.call(message, "archived"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.archived);
                if (message.messageRange != null && Object.hasOwnProperty.call(message, "messageRange"))
                    $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.encode(message.messageRange, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ArchiveChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction} message ArchiveChatAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ArchiveChatAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ArchiveChatAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction} ArchiveChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ArchiveChatAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.archived = reader.bool();
                            break;
                        }
                    case 2: {
                            message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.decode(reader, reader.uint32());
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
             * Decodes an ArchiveChatAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction} ArchiveChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ArchiveChatAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ArchiveChatAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ArchiveChatAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.archived != null && message.hasOwnProperty("archived"))
                    if (typeof message.archived !== "boolean")
                        return "archived: boolean expected";
                if (message.messageRange != null && message.hasOwnProperty("messageRange")) {
                    var error = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify(message.messageRange);
                    if (error)
                        return "messageRange." + error;
                }
                return null;
            };

            /**
             * Creates an ArchiveChatAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction} ArchiveChatAction
             */
            ArchiveChatAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction();
                if (object.archived != null)
                    message.archived = Boolean(object.archived);
                if (object.messageRange != null) {
                    if (typeof object.messageRange !== "object")
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.messageRange: object expected");
                    message.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.fromObject(object.messageRange);
                }
                return message;
            };

            /**
             * Creates a plain object from an ArchiveChatAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction} message ArchiveChatAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ArchiveChatAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.archived = false;
                    object.messageRange = null;
                }
                if (message.archived != null && message.hasOwnProperty("archived"))
                    object.archived = message.archived;
                if (message.messageRange != null && message.hasOwnProperty("messageRange"))
                    object.messageRange = $root.WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.toObject(message.messageRange, options);
                return object;
            };

            /**
             * Converts this ArchiveChatAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ArchiveChatAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ArchiveChatAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ArchiveChatAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction";
            };

            return ArchiveChatAction;
        })();

        SyncActionValue.RecentEmojiWeightsAction = (function() {

            /**
             * Properties of a RecentEmojiWeightsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IRecentEmojiWeightsAction
             * @property {Array.<WAWebProtobufSyncAction.IRecentEmojiWeight>|null} [weights] RecentEmojiWeightsAction weights
             */

            /**
             * Constructs a new RecentEmojiWeightsAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a RecentEmojiWeightsAction.
             * @implements IRecentEmojiWeightsAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction=} [properties] Properties to set
             */
            function RecentEmojiWeightsAction(properties) {
                this.weights = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RecentEmojiWeightsAction weights.
             * @member {Array.<WAWebProtobufSyncAction.IRecentEmojiWeight>} weights
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @instance
             */
            RecentEmojiWeightsAction.prototype.weights = $util.emptyArray;

            /**
             * Creates a new RecentEmojiWeightsAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction} RecentEmojiWeightsAction instance
             */
            RecentEmojiWeightsAction.create = function create(properties) {
                return new RecentEmojiWeightsAction(properties);
            };

            /**
             * Encodes the specified RecentEmojiWeightsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction} message RecentEmojiWeightsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecentEmojiWeightsAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.weights != null && message.weights.length)
                    for (var i = 0; i < message.weights.length; ++i)
                        $root.WAWebProtobufSyncAction.RecentEmojiWeight.encode(message.weights[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified RecentEmojiWeightsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction} message RecentEmojiWeightsAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecentEmojiWeightsAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction} RecentEmojiWeightsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecentEmojiWeightsAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.weights && message.weights.length))
                                message.weights = [];
                            message.weights.push($root.WAWebProtobufSyncAction.RecentEmojiWeight.decode(reader, reader.uint32()));
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
             * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction} RecentEmojiWeightsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecentEmojiWeightsAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RecentEmojiWeightsAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RecentEmojiWeightsAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.weights != null && message.hasOwnProperty("weights")) {
                    if (!Array.isArray(message.weights))
                        return "weights: array expected";
                    for (var i = 0; i < message.weights.length; ++i) {
                        var error = $root.WAWebProtobufSyncAction.RecentEmojiWeight.verify(message.weights[i]);
                        if (error)
                            return "weights." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a RecentEmojiWeightsAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction} RecentEmojiWeightsAction
             */
            RecentEmojiWeightsAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction();
                if (object.weights) {
                    if (!Array.isArray(object.weights))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.weights: array expected");
                    message.weights = [];
                    for (var i = 0; i < object.weights.length; ++i) {
                        if (typeof object.weights[i] !== "object")
                            throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.weights: object expected");
                        message.weights[i] = $root.WAWebProtobufSyncAction.RecentEmojiWeight.fromObject(object.weights[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a RecentEmojiWeightsAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction} message RecentEmojiWeightsAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RecentEmojiWeightsAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.weights = [];
                if (message.weights && message.weights.length) {
                    object.weights = [];
                    for (var j = 0; j < message.weights.length; ++j)
                        object.weights[j] = $root.WAWebProtobufSyncAction.RecentEmojiWeight.toObject(message.weights[j], options);
                }
                return object;
            };

            /**
             * Converts this RecentEmojiWeightsAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RecentEmojiWeightsAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for RecentEmojiWeightsAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            RecentEmojiWeightsAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction";
            };

            return RecentEmojiWeightsAction;
        })();

        SyncActionValue.LabelEditAction = (function() {

            /**
             * Properties of a LabelEditAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ILabelEditAction
             * @property {string|null} [name] LabelEditAction name
             * @property {number|null} [color] LabelEditAction color
             * @property {number|null} [predefinedID] LabelEditAction predefinedID
             * @property {boolean|null} [deleted] LabelEditAction deleted
             * @property {number|null} [orderIndex] LabelEditAction orderIndex
             */

            /**
             * Constructs a new LabelEditAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a LabelEditAction.
             * @implements ILabelEditAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction=} [properties] Properties to set
             */
            function LabelEditAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LabelEditAction name.
             * @member {string} name
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             */
            LabelEditAction.prototype.name = "";

            /**
             * LabelEditAction color.
             * @member {number} color
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             */
            LabelEditAction.prototype.color = 0;

            /**
             * LabelEditAction predefinedID.
             * @member {number} predefinedID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             */
            LabelEditAction.prototype.predefinedID = 0;

            /**
             * LabelEditAction deleted.
             * @member {boolean} deleted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             */
            LabelEditAction.prototype.deleted = false;

            /**
             * LabelEditAction orderIndex.
             * @member {number} orderIndex
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             */
            LabelEditAction.prototype.orderIndex = 0;

            /**
             * Creates a new LabelEditAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelEditAction} LabelEditAction instance
             */
            LabelEditAction.create = function create(properties) {
                return new LabelEditAction(properties);
            };

            /**
             * Encodes the specified LabelEditAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction} message LabelEditAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelEditAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.color);
                if (message.predefinedID != null && Object.hasOwnProperty.call(message, "predefinedID"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.predefinedID);
                if (message.deleted != null && Object.hasOwnProperty.call(message, "deleted"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deleted);
                if (message.orderIndex != null && Object.hasOwnProperty.call(message, "orderIndex"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.orderIndex);
                return writer;
            };

            /**
             * Encodes the specified LabelEditAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction} message LabelEditAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelEditAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LabelEditAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelEditAction} LabelEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelEditAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
                            break;
                        }
                    case 2: {
                            message.color = reader.int32();
                            break;
                        }
                    case 3: {
                            message.predefinedID = reader.int32();
                            break;
                        }
                    case 4: {
                            message.deleted = reader.bool();
                            break;
                        }
                    case 5: {
                            message.orderIndex = reader.int32();
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
             * Decodes a LabelEditAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelEditAction} LabelEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelEditAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LabelEditAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LabelEditAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.color != null && message.hasOwnProperty("color"))
                    if (!$util.isInteger(message.color))
                        return "color: integer expected";
                if (message.predefinedID != null && message.hasOwnProperty("predefinedID"))
                    if (!$util.isInteger(message.predefinedID))
                        return "predefinedID: integer expected";
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    if (typeof message.deleted !== "boolean")
                        return "deleted: boolean expected";
                if (message.orderIndex != null && message.hasOwnProperty("orderIndex"))
                    if (!$util.isInteger(message.orderIndex))
                        return "orderIndex: integer expected";
                return null;
            };

            /**
             * Creates a LabelEditAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelEditAction} LabelEditAction
             */
            LabelEditAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelEditAction();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.color != null)
                    message.color = object.color | 0;
                if (object.predefinedID != null)
                    message.predefinedID = object.predefinedID | 0;
                if (object.deleted != null)
                    message.deleted = Boolean(object.deleted);
                if (object.orderIndex != null)
                    message.orderIndex = object.orderIndex | 0;
                return message;
            };

            /**
             * Creates a plain object from a LabelEditAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.LabelEditAction} message LabelEditAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LabelEditAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.color = 0;
                    object.predefinedID = 0;
                    object.deleted = false;
                    object.orderIndex = 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.color != null && message.hasOwnProperty("color"))
                    object.color = message.color;
                if (message.predefinedID != null && message.hasOwnProperty("predefinedID"))
                    object.predefinedID = message.predefinedID;
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    object.deleted = message.deleted;
                if (message.orderIndex != null && message.hasOwnProperty("orderIndex"))
                    object.orderIndex = message.orderIndex;
                return object;
            };

            /**
             * Converts this LabelEditAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LabelEditAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LabelEditAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelEditAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LabelEditAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.LabelEditAction";
            };

            return LabelEditAction;
        })();

        SyncActionValue.LabelAssociationAction = (function() {

            /**
             * Properties of a LabelAssociationAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ILabelAssociationAction
             * @property {boolean|null} [labeled] LabelAssociationAction labeled
             */

            /**
             * Constructs a new LabelAssociationAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a LabelAssociationAction.
             * @implements ILabelAssociationAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction=} [properties] Properties to set
             */
            function LabelAssociationAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LabelAssociationAction labeled.
             * @member {boolean} labeled
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @instance
             */
            LabelAssociationAction.prototype.labeled = false;

            /**
             * Creates a new LabelAssociationAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction} LabelAssociationAction instance
             */
            LabelAssociationAction.create = function create(properties) {
                return new LabelAssociationAction(properties);
            };

            /**
             * Encodes the specified LabelAssociationAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction} message LabelAssociationAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelAssociationAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.labeled != null && Object.hasOwnProperty.call(message, "labeled"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.labeled);
                return writer;
            };

            /**
             * Encodes the specified LabelAssociationAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction} message LabelAssociationAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LabelAssociationAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LabelAssociationAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction} LabelAssociationAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelAssociationAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.labeled = reader.bool();
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
             * Decodes a LabelAssociationAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction} LabelAssociationAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LabelAssociationAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LabelAssociationAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LabelAssociationAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.labeled != null && message.hasOwnProperty("labeled"))
                    if (typeof message.labeled !== "boolean")
                        return "labeled: boolean expected";
                return null;
            };

            /**
             * Creates a LabelAssociationAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction} LabelAssociationAction
             */
            LabelAssociationAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction();
                if (object.labeled != null)
                    message.labeled = Boolean(object.labeled);
                return message;
            };

            /**
             * Creates a plain object from a LabelAssociationAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction} message LabelAssociationAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LabelAssociationAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.labeled = false;
                if (message.labeled != null && message.hasOwnProperty("labeled"))
                    object.labeled = message.labeled;
                return object;
            };

            /**
             * Converts this LabelAssociationAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LabelAssociationAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LabelAssociationAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LabelAssociationAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction";
            };

            return LabelAssociationAction;
        })();

        SyncActionValue.QuickReplyAction = (function() {

            /**
             * Properties of a QuickReplyAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IQuickReplyAction
             * @property {string|null} [shortcut] QuickReplyAction shortcut
             * @property {string|null} [message] QuickReplyAction message
             * @property {Array.<string>|null} [keywords] QuickReplyAction keywords
             * @property {number|null} [count] QuickReplyAction count
             * @property {boolean|null} [deleted] QuickReplyAction deleted
             */

            /**
             * Constructs a new QuickReplyAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a QuickReplyAction.
             * @implements IQuickReplyAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction=} [properties] Properties to set
             */
            function QuickReplyAction(properties) {
                this.keywords = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * QuickReplyAction shortcut.
             * @member {string} shortcut
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             */
            QuickReplyAction.prototype.shortcut = "";

            /**
             * QuickReplyAction message.
             * @member {string} message
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             */
            QuickReplyAction.prototype.message = "";

            /**
             * QuickReplyAction keywords.
             * @member {Array.<string>} keywords
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             */
            QuickReplyAction.prototype.keywords = $util.emptyArray;

            /**
             * QuickReplyAction count.
             * @member {number} count
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             */
            QuickReplyAction.prototype.count = 0;

            /**
             * QuickReplyAction deleted.
             * @member {boolean} deleted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             */
            QuickReplyAction.prototype.deleted = false;

            /**
             * Creates a new QuickReplyAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction} QuickReplyAction instance
             */
            QuickReplyAction.create = function create(properties) {
                return new QuickReplyAction(properties);
            };

            /**
             * Encodes the specified QuickReplyAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction} message QuickReplyAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QuickReplyAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.shortcut != null && Object.hasOwnProperty.call(message, "shortcut"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.shortcut);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                if (message.keywords != null && message.keywords.length)
                    for (var i = 0; i < message.keywords.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.keywords[i]);
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.count);
                if (message.deleted != null && Object.hasOwnProperty.call(message, "deleted"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.deleted);
                return writer;
            };

            /**
             * Encodes the specified QuickReplyAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction} message QuickReplyAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QuickReplyAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a QuickReplyAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction} QuickReplyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QuickReplyAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.shortcut = reader.string();
                            break;
                        }
                    case 2: {
                            message.message = reader.string();
                            break;
                        }
                    case 3: {
                            if (!(message.keywords && message.keywords.length))
                                message.keywords = [];
                            message.keywords.push(reader.string());
                            break;
                        }
                    case 4: {
                            message.count = reader.int32();
                            break;
                        }
                    case 5: {
                            message.deleted = reader.bool();
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
             * Decodes a QuickReplyAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction} QuickReplyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QuickReplyAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a QuickReplyAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            QuickReplyAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.shortcut != null && message.hasOwnProperty("shortcut"))
                    if (!$util.isString(message.shortcut))
                        return "shortcut: string expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.keywords != null && message.hasOwnProperty("keywords")) {
                    if (!Array.isArray(message.keywords))
                        return "keywords: array expected";
                    for (var i = 0; i < message.keywords.length; ++i)
                        if (!$util.isString(message.keywords[i]))
                            return "keywords: string[] expected";
                }
                if (message.count != null && message.hasOwnProperty("count"))
                    if (!$util.isInteger(message.count))
                        return "count: integer expected";
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    if (typeof message.deleted !== "boolean")
                        return "deleted: boolean expected";
                return null;
            };

            /**
             * Creates a QuickReplyAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction} QuickReplyAction
             */
            QuickReplyAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction();
                if (object.shortcut != null)
                    message.shortcut = String(object.shortcut);
                if (object.message != null)
                    message.message = String(object.message);
                if (object.keywords) {
                    if (!Array.isArray(object.keywords))
                        throw TypeError(".WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.keywords: array expected");
                    message.keywords = [];
                    for (var i = 0; i < object.keywords.length; ++i)
                        message.keywords[i] = String(object.keywords[i]);
                }
                if (object.count != null)
                    message.count = object.count | 0;
                if (object.deleted != null)
                    message.deleted = Boolean(object.deleted);
                return message;
            };

            /**
             * Creates a plain object from a QuickReplyAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction} message QuickReplyAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            QuickReplyAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.keywords = [];
                if (options.defaults) {
                    object.shortcut = "";
                    object.message = "";
                    object.count = 0;
                    object.deleted = false;
                }
                if (message.shortcut != null && message.hasOwnProperty("shortcut"))
                    object.shortcut = message.shortcut;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.keywords && message.keywords.length) {
                    object.keywords = [];
                    for (var j = 0; j < message.keywords.length; ++j)
                        object.keywords[j] = message.keywords[j];
                }
                if (message.count != null && message.hasOwnProperty("count"))
                    object.count = message.count;
                if (message.deleted != null && message.hasOwnProperty("deleted"))
                    object.deleted = message.deleted;
                return object;
            };

            /**
             * Converts this QuickReplyAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            QuickReplyAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for QuickReplyAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            QuickReplyAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction";
            };

            return QuickReplyAction;
        })();

        SyncActionValue.LocaleSetting = (function() {

            /**
             * Properties of a LocaleSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ILocaleSetting
             * @property {string|null} [locale] LocaleSetting locale
             */

            /**
             * Constructs a new LocaleSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a LocaleSetting.
             * @implements ILocaleSetting
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting=} [properties] Properties to set
             */
            function LocaleSetting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LocaleSetting locale.
             * @member {string} locale
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @instance
             */
            LocaleSetting.prototype.locale = "";

            /**
             * Creates a new LocaleSetting instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LocaleSetting} LocaleSetting instance
             */
            LocaleSetting.create = function create(properties) {
                return new LocaleSetting(properties);
            };

            /**
             * Encodes the specified LocaleSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting} message LocaleSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocaleSetting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.locale != null && Object.hasOwnProperty.call(message, "locale"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.locale);
                return writer;
            };

            /**
             * Encodes the specified LocaleSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting} message LocaleSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocaleSetting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LocaleSetting message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LocaleSetting} LocaleSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocaleSetting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.locale = reader.string();
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
             * Decodes a LocaleSetting message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LocaleSetting} LocaleSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocaleSetting.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LocaleSetting message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LocaleSetting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.locale != null && message.hasOwnProperty("locale"))
                    if (!$util.isString(message.locale))
                        return "locale: string expected";
                return null;
            };

            /**
             * Creates a LocaleSetting message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.LocaleSetting} LocaleSetting
             */
            LocaleSetting.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.LocaleSetting();
                if (object.locale != null)
                    message.locale = String(object.locale);
                return message;
            };

            /**
             * Creates a plain object from a LocaleSetting message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.LocaleSetting} message LocaleSetting
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LocaleSetting.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.locale = "";
                if (message.locale != null && message.hasOwnProperty("locale"))
                    object.locale = message.locale;
                return object;
            };

            /**
             * Converts this LocaleSetting to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LocaleSetting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LocaleSetting
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.LocaleSetting
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LocaleSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.LocaleSetting";
            };

            return LocaleSetting;
        })();

        SyncActionValue.PushNameSetting = (function() {

            /**
             * Properties of a PushNameSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPushNameSetting
             * @property {string|null} [name] PushNameSetting name
             */

            /**
             * Constructs a new PushNameSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PushNameSetting.
             * @implements IPushNameSetting
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting=} [properties] Properties to set
             */
            function PushNameSetting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushNameSetting name.
             * @member {string} name
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @instance
             */
            PushNameSetting.prototype.name = "";

            /**
             * Creates a new PushNameSetting instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PushNameSetting} PushNameSetting instance
             */
            PushNameSetting.create = function create(properties) {
                return new PushNameSetting(properties);
            };

            /**
             * Encodes the specified PushNameSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting} message PushNameSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushNameSetting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified PushNameSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting} message PushNameSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushNameSetting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushNameSetting message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PushNameSetting} PushNameSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushNameSetting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.name = reader.string();
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
             * Decodes a PushNameSetting message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PushNameSetting} PushNameSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushNameSetting.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushNameSetting message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushNameSetting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a PushNameSetting message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PushNameSetting} PushNameSetting
             */
            PushNameSetting.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PushNameSetting();
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a PushNameSetting message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PushNameSetting} message PushNameSetting
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushNameSetting.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.name = "";
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this PushNameSetting to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushNameSetting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushNameSetting
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PushNameSetting
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushNameSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PushNameSetting";
            };

            return PushNameSetting;
        })();

        SyncActionValue.SecurityNotificationSetting = (function() {

            /**
             * Properties of a SecurityNotificationSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface ISecurityNotificationSetting
             * @property {boolean|null} [showNotification] SecurityNotificationSetting showNotification
             */

            /**
             * Constructs a new SecurityNotificationSetting.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a SecurityNotificationSetting.
             * @implements ISecurityNotificationSetting
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting=} [properties] Properties to set
             */
            function SecurityNotificationSetting(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SecurityNotificationSetting showNotification.
             * @member {boolean} showNotification
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @instance
             */
            SecurityNotificationSetting.prototype.showNotification = false;

            /**
             * Creates a new SecurityNotificationSetting instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting} SecurityNotificationSetting instance
             */
            SecurityNotificationSetting.create = function create(properties) {
                return new SecurityNotificationSetting(properties);
            };

            /**
             * Encodes the specified SecurityNotificationSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting} message SecurityNotificationSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecurityNotificationSetting.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.showNotification != null && Object.hasOwnProperty.call(message, "showNotification"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.showNotification);
                return writer;
            };

            /**
             * Encodes the specified SecurityNotificationSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting} message SecurityNotificationSetting message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecurityNotificationSetting.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SecurityNotificationSetting message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting} SecurityNotificationSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SecurityNotificationSetting.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.showNotification = reader.bool();
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
             * Decodes a SecurityNotificationSetting message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting} SecurityNotificationSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SecurityNotificationSetting.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SecurityNotificationSetting message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SecurityNotificationSetting.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.showNotification != null && message.hasOwnProperty("showNotification"))
                    if (typeof message.showNotification !== "boolean")
                        return "showNotification: boolean expected";
                return null;
            };

            /**
             * Creates a SecurityNotificationSetting message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting} SecurityNotificationSetting
             */
            SecurityNotificationSetting.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting();
                if (object.showNotification != null)
                    message.showNotification = Boolean(object.showNotification);
                return message;
            };

            /**
             * Creates a plain object from a SecurityNotificationSetting message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting} message SecurityNotificationSetting
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SecurityNotificationSetting.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.showNotification = false;
                if (message.showNotification != null && message.hasOwnProperty("showNotification"))
                    object.showNotification = message.showNotification;
                return object;
            };

            /**
             * Converts this SecurityNotificationSetting to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SecurityNotificationSetting.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SecurityNotificationSetting
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SecurityNotificationSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting";
            };

            return SecurityNotificationSetting;
        })();

        SyncActionValue.PinAction = (function() {

            /**
             * Properties of a PinAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IPinAction
             * @property {boolean|null} [pinned] PinAction pinned
             */

            /**
             * Constructs a new PinAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a PinAction.
             * @implements IPinAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPinAction=} [properties] Properties to set
             */
            function PinAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PinAction pinned.
             * @member {boolean} pinned
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @instance
             */
            PinAction.prototype.pinned = false;

            /**
             * Creates a new PinAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPinAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PinAction} PinAction instance
             */
            PinAction.create = function create(properties) {
                return new PinAction(properties);
            };

            /**
             * Encodes the specified PinAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PinAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPinAction} message PinAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PinAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.pinned != null && Object.hasOwnProperty.call(message, "pinned"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.pinned);
                return writer;
            };

            /**
             * Encodes the specified PinAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PinAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IPinAction} message PinAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PinAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PinAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PinAction} PinAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PinAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.PinAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.pinned = reader.bool();
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
             * Decodes a PinAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PinAction} PinAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PinAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PinAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PinAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.pinned != null && message.hasOwnProperty("pinned"))
                    if (typeof message.pinned !== "boolean")
                        return "pinned: boolean expected";
                return null;
            };

            /**
             * Creates a PinAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.PinAction} PinAction
             */
            PinAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.PinAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.PinAction();
                if (object.pinned != null)
                    message.pinned = Boolean(object.pinned);
                return message;
            };

            /**
             * Creates a plain object from a PinAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.PinAction} message PinAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PinAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.pinned = false;
                if (message.pinned != null && message.hasOwnProperty("pinned"))
                    object.pinned = message.pinned;
                return object;
            };

            /**
             * Converts this PinAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PinAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PinAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.PinAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PinAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.PinAction";
            };

            return PinAction;
        })();

        SyncActionValue.MuteAction = (function() {

            /**
             * Properties of a MuteAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IMuteAction
             * @property {boolean|null} [muted] MuteAction muted
             * @property {number|Long|null} [muteEndTimestamp] MuteAction muteEndTimestamp
             * @property {boolean|null} [autoMuted] MuteAction autoMuted
             */

            /**
             * Constructs a new MuteAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a MuteAction.
             * @implements IMuteAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMuteAction=} [properties] Properties to set
             */
            function MuteAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MuteAction muted.
             * @member {boolean} muted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @instance
             */
            MuteAction.prototype.muted = false;

            /**
             * MuteAction muteEndTimestamp.
             * @member {number|Long} muteEndTimestamp
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @instance
             */
            MuteAction.prototype.muteEndTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * MuteAction autoMuted.
             * @member {boolean} autoMuted
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @instance
             */
            MuteAction.prototype.autoMuted = false;

            /**
             * Creates a new MuteAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMuteAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MuteAction} MuteAction instance
             */
            MuteAction.create = function create(properties) {
                return new MuteAction(properties);
            };

            /**
             * Encodes the specified MuteAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MuteAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMuteAction} message MuteAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MuteAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.muted);
                if (message.muteEndTimestamp != null && Object.hasOwnProperty.call(message, "muteEndTimestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.muteEndTimestamp);
                if (message.autoMuted != null && Object.hasOwnProperty.call(message, "autoMuted"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.autoMuted);
                return writer;
            };

            /**
             * Encodes the specified MuteAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MuteAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IMuteAction} message MuteAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MuteAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MuteAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MuteAction} MuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MuteAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.muted = reader.bool();
                            break;
                        }
                    case 2: {
                            message.muteEndTimestamp = reader.int64();
                            break;
                        }
                    case 3: {
                            message.autoMuted = reader.bool();
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
             * Decodes a MuteAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MuteAction} MuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MuteAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MuteAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MuteAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.muted != null && message.hasOwnProperty("muted"))
                    if (typeof message.muted !== "boolean")
                        return "muted: boolean expected";
                if (message.muteEndTimestamp != null && message.hasOwnProperty("muteEndTimestamp"))
                    if (!$util.isInteger(message.muteEndTimestamp) && !(message.muteEndTimestamp && $util.isInteger(message.muteEndTimestamp.low) && $util.isInteger(message.muteEndTimestamp.high)))
                        return "muteEndTimestamp: integer|Long expected";
                if (message.autoMuted != null && message.hasOwnProperty("autoMuted"))
                    if (typeof message.autoMuted !== "boolean")
                        return "autoMuted: boolean expected";
                return null;
            };

            /**
             * Creates a MuteAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.MuteAction} MuteAction
             */
            MuteAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.MuteAction();
                if (object.muted != null)
                    message.muted = Boolean(object.muted);
                if (object.muteEndTimestamp != null)
                    if ($util.Long)
                        (message.muteEndTimestamp = $util.Long.fromValue(object.muteEndTimestamp)).unsigned = false;
                    else if (typeof object.muteEndTimestamp === "string")
                        message.muteEndTimestamp = parseInt(object.muteEndTimestamp, 10);
                    else if (typeof object.muteEndTimestamp === "number")
                        message.muteEndTimestamp = object.muteEndTimestamp;
                    else if (typeof object.muteEndTimestamp === "object")
                        message.muteEndTimestamp = new $util.LongBits(object.muteEndTimestamp.low >>> 0, object.muteEndTimestamp.high >>> 0).toNumber();
                if (object.autoMuted != null)
                    message.autoMuted = Boolean(object.autoMuted);
                return message;
            };

            /**
             * Creates a plain object from a MuteAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.MuteAction} message MuteAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MuteAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.muted = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.muteEndTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.muteEndTimestamp = options.longs === String ? "0" : 0;
                    object.autoMuted = false;
                }
                if (message.muted != null && message.hasOwnProperty("muted"))
                    object.muted = message.muted;
                if (message.muteEndTimestamp != null && message.hasOwnProperty("muteEndTimestamp"))
                    if (typeof message.muteEndTimestamp === "number")
                        object.muteEndTimestamp = options.longs === String ? String(message.muteEndTimestamp) : message.muteEndTimestamp;
                    else
                        object.muteEndTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.muteEndTimestamp) : options.longs === Number ? new $util.LongBits(message.muteEndTimestamp.low >>> 0, message.muteEndTimestamp.high >>> 0).toNumber() : message.muteEndTimestamp;
                if (message.autoMuted != null && message.hasOwnProperty("autoMuted"))
                    object.autoMuted = message.autoMuted;
                return object;
            };

            /**
             * Converts this MuteAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MuteAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MuteAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.MuteAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MuteAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.MuteAction";
            };

            return MuteAction;
        })();

        SyncActionValue.ContactAction = (function() {

            /**
             * Properties of a ContactAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IContactAction
             * @property {string|null} [fullName] ContactAction fullName
             * @property {string|null} [firstName] ContactAction firstName
             * @property {string|null} [lidJID] ContactAction lidJID
             * @property {boolean|null} [saveOnPrimaryAddressbook] ContactAction saveOnPrimaryAddressbook
             */

            /**
             * Constructs a new ContactAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a ContactAction.
             * @implements IContactAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IContactAction=} [properties] Properties to set
             */
            function ContactAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ContactAction fullName.
             * @member {string} fullName
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @instance
             */
            ContactAction.prototype.fullName = "";

            /**
             * ContactAction firstName.
             * @member {string} firstName
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @instance
             */
            ContactAction.prototype.firstName = "";

            /**
             * ContactAction lidJID.
             * @member {string} lidJID
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @instance
             */
            ContactAction.prototype.lidJID = "";

            /**
             * ContactAction saveOnPrimaryAddressbook.
             * @member {boolean} saveOnPrimaryAddressbook
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @instance
             */
            ContactAction.prototype.saveOnPrimaryAddressbook = false;

            /**
             * Creates a new ContactAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IContactAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ContactAction} ContactAction instance
             */
            ContactAction.create = function create(properties) {
                return new ContactAction(properties);
            };

            /**
             * Encodes the specified ContactAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ContactAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IContactAction} message ContactAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ContactAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fullName != null && Object.hasOwnProperty.call(message, "fullName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fullName);
                if (message.firstName != null && Object.hasOwnProperty.call(message, "firstName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.firstName);
                if (message.lidJID != null && Object.hasOwnProperty.call(message, "lidJID"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.lidJID);
                if (message.saveOnPrimaryAddressbook != null && Object.hasOwnProperty.call(message, "saveOnPrimaryAddressbook"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.saveOnPrimaryAddressbook);
                return writer;
            };

            /**
             * Encodes the specified ContactAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ContactAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IContactAction} message ContactAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ContactAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ContactAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ContactAction} ContactAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ContactAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.fullName = reader.string();
                            break;
                        }
                    case 2: {
                            message.firstName = reader.string();
                            break;
                        }
                    case 3: {
                            message.lidJID = reader.string();
                            break;
                        }
                    case 4: {
                            message.saveOnPrimaryAddressbook = reader.bool();
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
             * Decodes a ContactAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ContactAction} ContactAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ContactAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ContactAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ContactAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fullName != null && message.hasOwnProperty("fullName"))
                    if (!$util.isString(message.fullName))
                        return "fullName: string expected";
                if (message.firstName != null && message.hasOwnProperty("firstName"))
                    if (!$util.isString(message.firstName))
                        return "firstName: string expected";
                if (message.lidJID != null && message.hasOwnProperty("lidJID"))
                    if (!$util.isString(message.lidJID))
                        return "lidJID: string expected";
                if (message.saveOnPrimaryAddressbook != null && message.hasOwnProperty("saveOnPrimaryAddressbook"))
                    if (typeof message.saveOnPrimaryAddressbook !== "boolean")
                        return "saveOnPrimaryAddressbook: boolean expected";
                return null;
            };

            /**
             * Creates a ContactAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.ContactAction} ContactAction
             */
            ContactAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.ContactAction();
                if (object.fullName != null)
                    message.fullName = String(object.fullName);
                if (object.firstName != null)
                    message.firstName = String(object.firstName);
                if (object.lidJID != null)
                    message.lidJID = String(object.lidJID);
                if (object.saveOnPrimaryAddressbook != null)
                    message.saveOnPrimaryAddressbook = Boolean(object.saveOnPrimaryAddressbook);
                return message;
            };

            /**
             * Creates a plain object from a ContactAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.ContactAction} message ContactAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ContactAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.fullName = "";
                    object.firstName = "";
                    object.lidJID = "";
                    object.saveOnPrimaryAddressbook = false;
                }
                if (message.fullName != null && message.hasOwnProperty("fullName"))
                    object.fullName = message.fullName;
                if (message.firstName != null && message.hasOwnProperty("firstName"))
                    object.firstName = message.firstName;
                if (message.lidJID != null && message.hasOwnProperty("lidJID"))
                    object.lidJID = message.lidJID;
                if (message.saveOnPrimaryAddressbook != null && message.hasOwnProperty("saveOnPrimaryAddressbook"))
                    object.saveOnPrimaryAddressbook = message.saveOnPrimaryAddressbook;
                return object;
            };

            /**
             * Converts this ContactAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ContactAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ContactAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.ContactAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ContactAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.ContactAction";
            };

            return ContactAction;
        })();

        SyncActionValue.StarAction = (function() {

            /**
             * Properties of a StarAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @interface IStarAction
             * @property {boolean|null} [starred] StarAction starred
             */

            /**
             * Constructs a new StarAction.
             * @memberof WAWebProtobufSyncAction.SyncActionValue
             * @classdesc Represents a StarAction.
             * @implements IStarAction
             * @constructor
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStarAction=} [properties] Properties to set
             */
            function StarAction(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StarAction starred.
             * @member {boolean} starred
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @instance
             */
            StarAction.prototype.starred = false;

            /**
             * Creates a new StarAction instance using the specified properties.
             * @function create
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStarAction=} [properties] Properties to set
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StarAction} StarAction instance
             */
            StarAction.create = function create(properties) {
                return new StarAction(properties);
            };

            /**
             * Encodes the specified StarAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StarAction.verify|verify} messages.
             * @function encode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStarAction} message StarAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StarAction.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.starred != null && Object.hasOwnProperty.call(message, "starred"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.starred);
                return writer;
            };

            /**
             * Encodes the specified StarAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StarAction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.IStarAction} message StarAction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StarAction.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StarAction message from the specified reader or buffer.
             * @function decode
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StarAction} StarAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StarAction.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionValue.StarAction();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.starred = reader.bool();
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
             * Decodes a StarAction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StarAction} StarAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StarAction.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StarAction message.
             * @function verify
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StarAction.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.starred != null && message.hasOwnProperty("starred"))
                    if (typeof message.starred !== "boolean")
                        return "starred: boolean expected";
                return null;
            };

            /**
             * Creates a StarAction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {WAWebProtobufSyncAction.SyncActionValue.StarAction} StarAction
             */
            StarAction.fromObject = function fromObject(object) {
                if (object instanceof $root.WAWebProtobufSyncAction.SyncActionValue.StarAction)
                    return object;
                var message = new $root.WAWebProtobufSyncAction.SyncActionValue.StarAction();
                if (object.starred != null)
                    message.starred = Boolean(object.starred);
                return message;
            };

            /**
             * Creates a plain object from a StarAction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {WAWebProtobufSyncAction.SyncActionValue.StarAction} message StarAction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StarAction.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.starred = false;
                if (message.starred != null && message.hasOwnProperty("starred"))
                    object.starred = message.starred;
                return object;
            };

            /**
             * Converts this StarAction to JSON.
             * @function toJSON
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StarAction.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StarAction
             * @function getTypeUrl
             * @memberof WAWebProtobufSyncAction.SyncActionValue.StarAction
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StarAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionValue.StarAction";
            };

            return StarAction;
        })();

        return SyncActionValue;
    })();

    WAWebProtobufSyncAction.PatchDebugData = (function() {

        /**
         * Properties of a PatchDebugData.
         * @memberof WAWebProtobufSyncAction
         * @interface IPatchDebugData
         * @property {Uint8Array|null} [currentLthash] PatchDebugData currentLthash
         * @property {Uint8Array|null} [newLthash] PatchDebugData newLthash
         * @property {Uint8Array|null} [patchVersion] PatchDebugData patchVersion
         * @property {Uint8Array|null} [collectionName] PatchDebugData collectionName
         * @property {Uint8Array|null} [firstFourBytesFromAHashOfSnapshotMACKey] PatchDebugData firstFourBytesFromAHashOfSnapshotMACKey
         * @property {Uint8Array|null} [newLthashSubtract] PatchDebugData newLthashSubtract
         * @property {number|null} [numberAdd] PatchDebugData numberAdd
         * @property {number|null} [numberRemove] PatchDebugData numberRemove
         * @property {number|null} [numberOverride] PatchDebugData numberOverride
         * @property {WAWebProtobufSyncAction.PatchDebugData.Platform|null} [senderPlatform] PatchDebugData senderPlatform
         * @property {boolean|null} [isSenderPrimary] PatchDebugData isSenderPrimary
         */

        /**
         * Constructs a new PatchDebugData.
         * @memberof WAWebProtobufSyncAction
         * @classdesc Represents a PatchDebugData.
         * @implements IPatchDebugData
         * @constructor
         * @param {WAWebProtobufSyncAction.IPatchDebugData=} [properties] Properties to set
         */
        function PatchDebugData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PatchDebugData currentLthash.
         * @member {Uint8Array} currentLthash
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.currentLthash = $util.newBuffer([]);

        /**
         * PatchDebugData newLthash.
         * @member {Uint8Array} newLthash
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.newLthash = $util.newBuffer([]);

        /**
         * PatchDebugData patchVersion.
         * @member {Uint8Array} patchVersion
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.patchVersion = $util.newBuffer([]);

        /**
         * PatchDebugData collectionName.
         * @member {Uint8Array} collectionName
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.collectionName = $util.newBuffer([]);

        /**
         * PatchDebugData firstFourBytesFromAHashOfSnapshotMACKey.
         * @member {Uint8Array} firstFourBytesFromAHashOfSnapshotMACKey
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.firstFourBytesFromAHashOfSnapshotMACKey = $util.newBuffer([]);

        /**
         * PatchDebugData newLthashSubtract.
         * @member {Uint8Array} newLthashSubtract
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.newLthashSubtract = $util.newBuffer([]);

        /**
         * PatchDebugData numberAdd.
         * @member {number} numberAdd
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.numberAdd = 0;

        /**
         * PatchDebugData numberRemove.
         * @member {number} numberRemove
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.numberRemove = 0;

        /**
         * PatchDebugData numberOverride.
         * @member {number} numberOverride
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.numberOverride = 0;

        /**
         * PatchDebugData senderPlatform.
         * @member {WAWebProtobufSyncAction.PatchDebugData.Platform} senderPlatform
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.senderPlatform = 0;

        /**
         * PatchDebugData isSenderPrimary.
         * @member {boolean} isSenderPrimary
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         */
        PatchDebugData.prototype.isSenderPrimary = false;

        /**
         * Creates a new PatchDebugData instance using the specified properties.
         * @function create
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {WAWebProtobufSyncAction.IPatchDebugData=} [properties] Properties to set
         * @returns {WAWebProtobufSyncAction.PatchDebugData} PatchDebugData instance
         */
        PatchDebugData.create = function create(properties) {
            return new PatchDebugData(properties);
        };

        /**
         * Encodes the specified PatchDebugData message. Does not implicitly {@link WAWebProtobufSyncAction.PatchDebugData.verify|verify} messages.
         * @function encode
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {WAWebProtobufSyncAction.IPatchDebugData} message PatchDebugData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PatchDebugData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.currentLthash != null && Object.hasOwnProperty.call(message, "currentLthash"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.currentLthash);
            if (message.newLthash != null && Object.hasOwnProperty.call(message, "newLthash"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.newLthash);
            if (message.patchVersion != null && Object.hasOwnProperty.call(message, "patchVersion"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.patchVersion);
            if (message.collectionName != null && Object.hasOwnProperty.call(message, "collectionName"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.collectionName);
            if (message.firstFourBytesFromAHashOfSnapshotMACKey != null && Object.hasOwnProperty.call(message, "firstFourBytesFromAHashOfSnapshotMACKey"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.firstFourBytesFromAHashOfSnapshotMACKey);
            if (message.newLthashSubtract != null && Object.hasOwnProperty.call(message, "newLthashSubtract"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.newLthashSubtract);
            if (message.numberAdd != null && Object.hasOwnProperty.call(message, "numberAdd"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.numberAdd);
            if (message.numberRemove != null && Object.hasOwnProperty.call(message, "numberRemove"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.numberRemove);
            if (message.numberOverride != null && Object.hasOwnProperty.call(message, "numberOverride"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.numberOverride);
            if (message.senderPlatform != null && Object.hasOwnProperty.call(message, "senderPlatform"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.senderPlatform);
            if (message.isSenderPrimary != null && Object.hasOwnProperty.call(message, "isSenderPrimary"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.isSenderPrimary);
            return writer;
        };

        /**
         * Encodes the specified PatchDebugData message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.PatchDebugData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {WAWebProtobufSyncAction.IPatchDebugData} message PatchDebugData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PatchDebugData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PatchDebugData message from the specified reader or buffer.
         * @function decode
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWebProtobufSyncAction.PatchDebugData} PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PatchDebugData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.PatchDebugData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.currentLthash = reader.bytes();
                        break;
                    }
                case 2: {
                        message.newLthash = reader.bytes();
                        break;
                    }
                case 3: {
                        message.patchVersion = reader.bytes();
                        break;
                    }
                case 4: {
                        message.collectionName = reader.bytes();
                        break;
                    }
                case 5: {
                        message.firstFourBytesFromAHashOfSnapshotMACKey = reader.bytes();
                        break;
                    }
                case 6: {
                        message.newLthashSubtract = reader.bytes();
                        break;
                    }
                case 7: {
                        message.numberAdd = reader.int32();
                        break;
                    }
                case 8: {
                        message.numberRemove = reader.int32();
                        break;
                    }
                case 9: {
                        message.numberOverride = reader.int32();
                        break;
                    }
                case 10: {
                        message.senderPlatform = reader.int32();
                        break;
                    }
                case 11: {
                        message.isSenderPrimary = reader.bool();
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
         * Decodes a PatchDebugData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWebProtobufSyncAction.PatchDebugData} PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PatchDebugData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PatchDebugData message.
         * @function verify
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PatchDebugData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.currentLthash != null && message.hasOwnProperty("currentLthash"))
                if (!(message.currentLthash && typeof message.currentLthash.length === "number" || $util.isString(message.currentLthash)))
                    return "currentLthash: buffer expected";
            if (message.newLthash != null && message.hasOwnProperty("newLthash"))
                if (!(message.newLthash && typeof message.newLthash.length === "number" || $util.isString(message.newLthash)))
                    return "newLthash: buffer expected";
            if (message.patchVersion != null && message.hasOwnProperty("patchVersion"))
                if (!(message.patchVersion && typeof message.patchVersion.length === "number" || $util.isString(message.patchVersion)))
                    return "patchVersion: buffer expected";
            if (message.collectionName != null && message.hasOwnProperty("collectionName"))
                if (!(message.collectionName && typeof message.collectionName.length === "number" || $util.isString(message.collectionName)))
                    return "collectionName: buffer expected";
            if (message.firstFourBytesFromAHashOfSnapshotMACKey != null && message.hasOwnProperty("firstFourBytesFromAHashOfSnapshotMACKey"))
                if (!(message.firstFourBytesFromAHashOfSnapshotMACKey && typeof message.firstFourBytesFromAHashOfSnapshotMACKey.length === "number" || $util.isString(message.firstFourBytesFromAHashOfSnapshotMACKey)))
                    return "firstFourBytesFromAHashOfSnapshotMACKey: buffer expected";
            if (message.newLthashSubtract != null && message.hasOwnProperty("newLthashSubtract"))
                if (!(message.newLthashSubtract && typeof message.newLthashSubtract.length === "number" || $util.isString(message.newLthashSubtract)))
                    return "newLthashSubtract: buffer expected";
            if (message.numberAdd != null && message.hasOwnProperty("numberAdd"))
                if (!$util.isInteger(message.numberAdd))
                    return "numberAdd: integer expected";
            if (message.numberRemove != null && message.hasOwnProperty("numberRemove"))
                if (!$util.isInteger(message.numberRemove))
                    return "numberRemove: integer expected";
            if (message.numberOverride != null && message.hasOwnProperty("numberOverride"))
                if (!$util.isInteger(message.numberOverride))
                    return "numberOverride: integer expected";
            if (message.senderPlatform != null && message.hasOwnProperty("senderPlatform"))
                switch (message.senderPlatform) {
                default:
                    return "senderPlatform: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            if (message.isSenderPrimary != null && message.hasOwnProperty("isSenderPrimary"))
                if (typeof message.isSenderPrimary !== "boolean")
                    return "isSenderPrimary: boolean expected";
            return null;
        };

        /**
         * Creates a PatchDebugData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWebProtobufSyncAction.PatchDebugData} PatchDebugData
         */
        PatchDebugData.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWebProtobufSyncAction.PatchDebugData)
                return object;
            var message = new $root.WAWebProtobufSyncAction.PatchDebugData();
            if (object.currentLthash != null)
                if (typeof object.currentLthash === "string")
                    $util.base64.decode(object.currentLthash, message.currentLthash = $util.newBuffer($util.base64.length(object.currentLthash)), 0);
                else if (object.currentLthash.length >= 0)
                    message.currentLthash = object.currentLthash;
            if (object.newLthash != null)
                if (typeof object.newLthash === "string")
                    $util.base64.decode(object.newLthash, message.newLthash = $util.newBuffer($util.base64.length(object.newLthash)), 0);
                else if (object.newLthash.length >= 0)
                    message.newLthash = object.newLthash;
            if (object.patchVersion != null)
                if (typeof object.patchVersion === "string")
                    $util.base64.decode(object.patchVersion, message.patchVersion = $util.newBuffer($util.base64.length(object.patchVersion)), 0);
                else if (object.patchVersion.length >= 0)
                    message.patchVersion = object.patchVersion;
            if (object.collectionName != null)
                if (typeof object.collectionName === "string")
                    $util.base64.decode(object.collectionName, message.collectionName = $util.newBuffer($util.base64.length(object.collectionName)), 0);
                else if (object.collectionName.length >= 0)
                    message.collectionName = object.collectionName;
            if (object.firstFourBytesFromAHashOfSnapshotMACKey != null)
                if (typeof object.firstFourBytesFromAHashOfSnapshotMACKey === "string")
                    $util.base64.decode(object.firstFourBytesFromAHashOfSnapshotMACKey, message.firstFourBytesFromAHashOfSnapshotMACKey = $util.newBuffer($util.base64.length(object.firstFourBytesFromAHashOfSnapshotMACKey)), 0);
                else if (object.firstFourBytesFromAHashOfSnapshotMACKey.length >= 0)
                    message.firstFourBytesFromAHashOfSnapshotMACKey = object.firstFourBytesFromAHashOfSnapshotMACKey;
            if (object.newLthashSubtract != null)
                if (typeof object.newLthashSubtract === "string")
                    $util.base64.decode(object.newLthashSubtract, message.newLthashSubtract = $util.newBuffer($util.base64.length(object.newLthashSubtract)), 0);
                else if (object.newLthashSubtract.length >= 0)
                    message.newLthashSubtract = object.newLthashSubtract;
            if (object.numberAdd != null)
                message.numberAdd = object.numberAdd | 0;
            if (object.numberRemove != null)
                message.numberRemove = object.numberRemove | 0;
            if (object.numberOverride != null)
                message.numberOverride = object.numberOverride | 0;
            switch (object.senderPlatform) {
            default:
                if (typeof object.senderPlatform === "number") {
                    message.senderPlatform = object.senderPlatform;
                    break;
                }
                break;
            case "ANDROID":
            case 0:
                message.senderPlatform = 0;
                break;
            case "SMBA":
            case 1:
                message.senderPlatform = 1;
                break;
            case "IPHONE":
            case 2:
                message.senderPlatform = 2;
                break;
            case "SMBI":
            case 3:
                message.senderPlatform = 3;
                break;
            case "WEB":
            case 4:
                message.senderPlatform = 4;
                break;
            case "UWP":
            case 5:
                message.senderPlatform = 5;
                break;
            case "DARWIN":
            case 6:
                message.senderPlatform = 6;
                break;
            }
            if (object.isSenderPrimary != null)
                message.isSenderPrimary = Boolean(object.isSenderPrimary);
            return message;
        };

        /**
         * Creates a plain object from a PatchDebugData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {WAWebProtobufSyncAction.PatchDebugData} message PatchDebugData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PatchDebugData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.currentLthash = "";
                else {
                    object.currentLthash = [];
                    if (options.bytes !== Array)
                        object.currentLthash = $util.newBuffer(object.currentLthash);
                }
                if (options.bytes === String)
                    object.newLthash = "";
                else {
                    object.newLthash = [];
                    if (options.bytes !== Array)
                        object.newLthash = $util.newBuffer(object.newLthash);
                }
                if (options.bytes === String)
                    object.patchVersion = "";
                else {
                    object.patchVersion = [];
                    if (options.bytes !== Array)
                        object.patchVersion = $util.newBuffer(object.patchVersion);
                }
                if (options.bytes === String)
                    object.collectionName = "";
                else {
                    object.collectionName = [];
                    if (options.bytes !== Array)
                        object.collectionName = $util.newBuffer(object.collectionName);
                }
                if (options.bytes === String)
                    object.firstFourBytesFromAHashOfSnapshotMACKey = "";
                else {
                    object.firstFourBytesFromAHashOfSnapshotMACKey = [];
                    if (options.bytes !== Array)
                        object.firstFourBytesFromAHashOfSnapshotMACKey = $util.newBuffer(object.firstFourBytesFromAHashOfSnapshotMACKey);
                }
                if (options.bytes === String)
                    object.newLthashSubtract = "";
                else {
                    object.newLthashSubtract = [];
                    if (options.bytes !== Array)
                        object.newLthashSubtract = $util.newBuffer(object.newLthashSubtract);
                }
                object.numberAdd = 0;
                object.numberRemove = 0;
                object.numberOverride = 0;
                object.senderPlatform = options.enums === String ? "ANDROID" : 0;
                object.isSenderPrimary = false;
            }
            if (message.currentLthash != null && message.hasOwnProperty("currentLthash"))
                object.currentLthash = options.bytes === String ? $util.base64.encode(message.currentLthash, 0, message.currentLthash.length) : options.bytes === Array ? Array.prototype.slice.call(message.currentLthash) : message.currentLthash;
            if (message.newLthash != null && message.hasOwnProperty("newLthash"))
                object.newLthash = options.bytes === String ? $util.base64.encode(message.newLthash, 0, message.newLthash.length) : options.bytes === Array ? Array.prototype.slice.call(message.newLthash) : message.newLthash;
            if (message.patchVersion != null && message.hasOwnProperty("patchVersion"))
                object.patchVersion = options.bytes === String ? $util.base64.encode(message.patchVersion, 0, message.patchVersion.length) : options.bytes === Array ? Array.prototype.slice.call(message.patchVersion) : message.patchVersion;
            if (message.collectionName != null && message.hasOwnProperty("collectionName"))
                object.collectionName = options.bytes === String ? $util.base64.encode(message.collectionName, 0, message.collectionName.length) : options.bytes === Array ? Array.prototype.slice.call(message.collectionName) : message.collectionName;
            if (message.firstFourBytesFromAHashOfSnapshotMACKey != null && message.hasOwnProperty("firstFourBytesFromAHashOfSnapshotMACKey"))
                object.firstFourBytesFromAHashOfSnapshotMACKey = options.bytes === String ? $util.base64.encode(message.firstFourBytesFromAHashOfSnapshotMACKey, 0, message.firstFourBytesFromAHashOfSnapshotMACKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.firstFourBytesFromAHashOfSnapshotMACKey) : message.firstFourBytesFromAHashOfSnapshotMACKey;
            if (message.newLthashSubtract != null && message.hasOwnProperty("newLthashSubtract"))
                object.newLthashSubtract = options.bytes === String ? $util.base64.encode(message.newLthashSubtract, 0, message.newLthashSubtract.length) : options.bytes === Array ? Array.prototype.slice.call(message.newLthashSubtract) : message.newLthashSubtract;
            if (message.numberAdd != null && message.hasOwnProperty("numberAdd"))
                object.numberAdd = message.numberAdd;
            if (message.numberRemove != null && message.hasOwnProperty("numberRemove"))
                object.numberRemove = message.numberRemove;
            if (message.numberOverride != null && message.hasOwnProperty("numberOverride"))
                object.numberOverride = message.numberOverride;
            if (message.senderPlatform != null && message.hasOwnProperty("senderPlatform"))
                object.senderPlatform = options.enums === String ? $root.WAWebProtobufSyncAction.PatchDebugData.Platform[message.senderPlatform] === undefined ? message.senderPlatform : $root.WAWebProtobufSyncAction.PatchDebugData.Platform[message.senderPlatform] : message.senderPlatform;
            if (message.isSenderPrimary != null && message.hasOwnProperty("isSenderPrimary"))
                object.isSenderPrimary = message.isSenderPrimary;
            return object;
        };

        /**
         * Converts this PatchDebugData to JSON.
         * @function toJSON
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PatchDebugData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PatchDebugData
         * @function getTypeUrl
         * @memberof WAWebProtobufSyncAction.PatchDebugData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PatchDebugData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWebProtobufSyncAction.PatchDebugData";
        };

        /**
         * Platform enum.
         * @name WAWebProtobufSyncAction.PatchDebugData.Platform
         * @enum {number}
         * @property {number} ANDROID=0 ANDROID value
         * @property {number} SMBA=1 SMBA value
         * @property {number} IPHONE=2 IPHONE value
         * @property {number} SMBI=3 SMBI value
         * @property {number} WEB=4 WEB value
         * @property {number} UWP=5 UWP value
         * @property {number} DARWIN=6 DARWIN value
         */
        PatchDebugData.Platform = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ANDROID"] = 0;
            values[valuesById[1] = "SMBA"] = 1;
            values[valuesById[2] = "IPHONE"] = 2;
            values[valuesById[3] = "SMBI"] = 3;
            values[valuesById[4] = "WEB"] = 4;
            values[valuesById[5] = "UWP"] = 5;
            values[valuesById[6] = "DARWIN"] = 6;
            return values;
        })();

        return PatchDebugData;
    })();

    WAWebProtobufSyncAction.RecentEmojiWeight = (function() {

        /**
         * Properties of a RecentEmojiWeight.
         * @memberof WAWebProtobufSyncAction
         * @interface IRecentEmojiWeight
         * @property {string|null} [emoji] RecentEmojiWeight emoji
         * @property {number|null} [weight] RecentEmojiWeight weight
         */

        /**
         * Constructs a new RecentEmojiWeight.
         * @memberof WAWebProtobufSyncAction
         * @classdesc Represents a RecentEmojiWeight.
         * @implements IRecentEmojiWeight
         * @constructor
         * @param {WAWebProtobufSyncAction.IRecentEmojiWeight=} [properties] Properties to set
         */
        function RecentEmojiWeight(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RecentEmojiWeight emoji.
         * @member {string} emoji
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @instance
         */
        RecentEmojiWeight.prototype.emoji = "";

        /**
         * RecentEmojiWeight weight.
         * @member {number} weight
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @instance
         */
        RecentEmojiWeight.prototype.weight = 0;

        /**
         * Creates a new RecentEmojiWeight instance using the specified properties.
         * @function create
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {WAWebProtobufSyncAction.IRecentEmojiWeight=} [properties] Properties to set
         * @returns {WAWebProtobufSyncAction.RecentEmojiWeight} RecentEmojiWeight instance
         */
        RecentEmojiWeight.create = function create(properties) {
            return new RecentEmojiWeight(properties);
        };

        /**
         * Encodes the specified RecentEmojiWeight message. Does not implicitly {@link WAWebProtobufSyncAction.RecentEmojiWeight.verify|verify} messages.
         * @function encode
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {WAWebProtobufSyncAction.IRecentEmojiWeight} message RecentEmojiWeight message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecentEmojiWeight.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.emoji != null && Object.hasOwnProperty.call(message, "emoji"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.emoji);
            if (message.weight != null && Object.hasOwnProperty.call(message, "weight"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.weight);
            return writer;
        };

        /**
         * Encodes the specified RecentEmojiWeight message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.RecentEmojiWeight.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {WAWebProtobufSyncAction.IRecentEmojiWeight} message RecentEmojiWeight message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecentEmojiWeight.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RecentEmojiWeight message from the specified reader or buffer.
         * @function decode
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWebProtobufSyncAction.RecentEmojiWeight} RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecentEmojiWeight.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.RecentEmojiWeight();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.emoji = reader.string();
                        break;
                    }
                case 2: {
                        message.weight = reader.float();
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
         * Decodes a RecentEmojiWeight message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWebProtobufSyncAction.RecentEmojiWeight} RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecentEmojiWeight.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RecentEmojiWeight message.
         * @function verify
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RecentEmojiWeight.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.emoji != null && message.hasOwnProperty("emoji"))
                if (!$util.isString(message.emoji))
                    return "emoji: string expected";
            if (message.weight != null && message.hasOwnProperty("weight"))
                if (typeof message.weight !== "number")
                    return "weight: number expected";
            return null;
        };

        /**
         * Creates a RecentEmojiWeight message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWebProtobufSyncAction.RecentEmojiWeight} RecentEmojiWeight
         */
        RecentEmojiWeight.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWebProtobufSyncAction.RecentEmojiWeight)
                return object;
            var message = new $root.WAWebProtobufSyncAction.RecentEmojiWeight();
            if (object.emoji != null)
                message.emoji = String(object.emoji);
            if (object.weight != null)
                message.weight = Number(object.weight);
            return message;
        };

        /**
         * Creates a plain object from a RecentEmojiWeight message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {WAWebProtobufSyncAction.RecentEmojiWeight} message RecentEmojiWeight
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RecentEmojiWeight.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.emoji = "";
                object.weight = 0;
            }
            if (message.emoji != null && message.hasOwnProperty("emoji"))
                object.emoji = message.emoji;
            if (message.weight != null && message.hasOwnProperty("weight"))
                object.weight = options.json && !isFinite(message.weight) ? String(message.weight) : message.weight;
            return object;
        };

        /**
         * Converts this RecentEmojiWeight to JSON.
         * @function toJSON
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RecentEmojiWeight.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RecentEmojiWeight
         * @function getTypeUrl
         * @memberof WAWebProtobufSyncAction.RecentEmojiWeight
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RecentEmojiWeight.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWebProtobufSyncAction.RecentEmojiWeight";
        };

        return RecentEmojiWeight;
    })();

    WAWebProtobufSyncAction.SyncActionData = (function() {

        /**
         * Properties of a SyncActionData.
         * @memberof WAWebProtobufSyncAction
         * @interface ISyncActionData
         * @property {Uint8Array|null} [index] SyncActionData index
         * @property {WAWebProtobufSyncAction.ISyncActionValue|null} [value] SyncActionData value
         * @property {Uint8Array|null} [padding] SyncActionData padding
         * @property {number|null} [version] SyncActionData version
         */

        /**
         * Constructs a new SyncActionData.
         * @memberof WAWebProtobufSyncAction
         * @classdesc Represents a SyncActionData.
         * @implements ISyncActionData
         * @constructor
         * @param {WAWebProtobufSyncAction.ISyncActionData=} [properties] Properties to set
         */
        function SyncActionData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncActionData index.
         * @member {Uint8Array} index
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @instance
         */
        SyncActionData.prototype.index = $util.newBuffer([]);

        /**
         * SyncActionData value.
         * @member {WAWebProtobufSyncAction.ISyncActionValue|null|undefined} value
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @instance
         */
        SyncActionData.prototype.value = null;

        /**
         * SyncActionData padding.
         * @member {Uint8Array} padding
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @instance
         */
        SyncActionData.prototype.padding = $util.newBuffer([]);

        /**
         * SyncActionData version.
         * @member {number} version
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @instance
         */
        SyncActionData.prototype.version = 0;

        /**
         * Creates a new SyncActionData instance using the specified properties.
         * @function create
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionData=} [properties] Properties to set
         * @returns {WAWebProtobufSyncAction.SyncActionData} SyncActionData instance
         */
        SyncActionData.create = function create(properties) {
            return new SyncActionData(properties);
        };

        /**
         * Encodes the specified SyncActionData message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionData.verify|verify} messages.
         * @function encode
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionData} message SyncActionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncActionData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.index);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.WAWebProtobufSyncAction.SyncActionValue.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.padding != null && Object.hasOwnProperty.call(message, "padding"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.padding);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.version);
            return writer;
        };

        /**
         * Encodes the specified SyncActionData message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {WAWebProtobufSyncAction.ISyncActionData} message SyncActionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncActionData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncActionData message from the specified reader or buffer.
         * @function decode
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WAWebProtobufSyncAction.SyncActionData} SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncActionData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WAWebProtobufSyncAction.SyncActionData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.index = reader.bytes();
                        break;
                    }
                case 2: {
                        message.value = $root.WAWebProtobufSyncAction.SyncActionValue.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.padding = reader.bytes();
                        break;
                    }
                case 4: {
                        message.version = reader.int32();
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
         * Decodes a SyncActionData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WAWebProtobufSyncAction.SyncActionData} SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncActionData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncActionData message.
         * @function verify
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncActionData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.index != null && message.hasOwnProperty("index"))
                if (!(message.index && typeof message.index.length === "number" || $util.isString(message.index)))
                    return "index: buffer expected";
            if (message.value != null && message.hasOwnProperty("value")) {
                var error = $root.WAWebProtobufSyncAction.SyncActionValue.verify(message.value);
                if (error)
                    return "value." + error;
            }
            if (message.padding != null && message.hasOwnProperty("padding"))
                if (!(message.padding && typeof message.padding.length === "number" || $util.isString(message.padding)))
                    return "padding: buffer expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            return null;
        };

        /**
         * Creates a SyncActionData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WAWebProtobufSyncAction.SyncActionData} SyncActionData
         */
        SyncActionData.fromObject = function fromObject(object) {
            if (object instanceof $root.WAWebProtobufSyncAction.SyncActionData)
                return object;
            var message = new $root.WAWebProtobufSyncAction.SyncActionData();
            if (object.index != null)
                if (typeof object.index === "string")
                    $util.base64.decode(object.index, message.index = $util.newBuffer($util.base64.length(object.index)), 0);
                else if (object.index.length >= 0)
                    message.index = object.index;
            if (object.value != null) {
                if (typeof object.value !== "object")
                    throw TypeError(".WAWebProtobufSyncAction.SyncActionData.value: object expected");
                message.value = $root.WAWebProtobufSyncAction.SyncActionValue.fromObject(object.value);
            }
            if (object.padding != null)
                if (typeof object.padding === "string")
                    $util.base64.decode(object.padding, message.padding = $util.newBuffer($util.base64.length(object.padding)), 0);
                else if (object.padding.length >= 0)
                    message.padding = object.padding;
            if (object.version != null)
                message.version = object.version | 0;
            return message;
        };

        /**
         * Creates a plain object from a SyncActionData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {WAWebProtobufSyncAction.SyncActionData} message SyncActionData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncActionData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.index = "";
                else {
                    object.index = [];
                    if (options.bytes !== Array)
                        object.index = $util.newBuffer(object.index);
                }
                object.value = null;
                if (options.bytes === String)
                    object.padding = "";
                else {
                    object.padding = [];
                    if (options.bytes !== Array)
                        object.padding = $util.newBuffer(object.padding);
                }
                object.version = 0;
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = options.bytes === String ? $util.base64.encode(message.index, 0, message.index.length) : options.bytes === Array ? Array.prototype.slice.call(message.index) : message.index;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = $root.WAWebProtobufSyncAction.SyncActionValue.toObject(message.value, options);
            if (message.padding != null && message.hasOwnProperty("padding"))
                object.padding = options.bytes === String ? $util.base64.encode(message.padding, 0, message.padding.length) : options.bytes === Array ? Array.prototype.slice.call(message.padding) : message.padding;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            return object;
        };

        /**
         * Converts this SyncActionData to JSON.
         * @function toJSON
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncActionData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncActionData
         * @function getTypeUrl
         * @memberof WAWebProtobufSyncAction.SyncActionData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncActionData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WAWebProtobufSyncAction.SyncActionData";
        };

        return SyncActionData;
    })();

    return WAWebProtobufSyncAction;
})();

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

$root.WADeviceCapabilities = (function() {

    /**
     * Namespace WADeviceCapabilities.
     * @exports WADeviceCapabilities
     * @namespace
     */
    var WADeviceCapabilities = {};

    WADeviceCapabilities.DeviceCapabilities = (function() {

        /**
         * Properties of a DeviceCapabilities.
         * @memberof WADeviceCapabilities
         * @interface IDeviceCapabilities
         * @property {WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel|null} [chatLockSupportLevel] DeviceCapabilities chatLockSupportLevel
         */

        /**
         * Constructs a new DeviceCapabilities.
         * @memberof WADeviceCapabilities
         * @classdesc Represents a DeviceCapabilities.
         * @implements IDeviceCapabilities
         * @constructor
         * @param {WADeviceCapabilities.IDeviceCapabilities=} [properties] Properties to set
         */
        function DeviceCapabilities(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeviceCapabilities chatLockSupportLevel.
         * @member {WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel} chatLockSupportLevel
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @instance
         */
        DeviceCapabilities.prototype.chatLockSupportLevel = 0;

        /**
         * Creates a new DeviceCapabilities instance using the specified properties.
         * @function create
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {WADeviceCapabilities.IDeviceCapabilities=} [properties] Properties to set
         * @returns {WADeviceCapabilities.DeviceCapabilities} DeviceCapabilities instance
         */
        DeviceCapabilities.create = function create(properties) {
            return new DeviceCapabilities(properties);
        };

        /**
         * Encodes the specified DeviceCapabilities message. Does not implicitly {@link WADeviceCapabilities.DeviceCapabilities.verify|verify} messages.
         * @function encode
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {WADeviceCapabilities.IDeviceCapabilities} message DeviceCapabilities message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceCapabilities.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chatLockSupportLevel != null && Object.hasOwnProperty.call(message, "chatLockSupportLevel"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chatLockSupportLevel);
            return writer;
        };

        /**
         * Encodes the specified DeviceCapabilities message, length delimited. Does not implicitly {@link WADeviceCapabilities.DeviceCapabilities.verify|verify} messages.
         * @function encodeDelimited
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {WADeviceCapabilities.IDeviceCapabilities} message DeviceCapabilities message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceCapabilities.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeviceCapabilities message from the specified reader or buffer.
         * @function decode
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {WADeviceCapabilities.DeviceCapabilities} DeviceCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceCapabilities.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WADeviceCapabilities.DeviceCapabilities();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.chatLockSupportLevel = reader.int32();
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
         * Decodes a DeviceCapabilities message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {WADeviceCapabilities.DeviceCapabilities} DeviceCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceCapabilities.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeviceCapabilities message.
         * @function verify
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeviceCapabilities.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chatLockSupportLevel != null && message.hasOwnProperty("chatLockSupportLevel"))
                switch (message.chatLockSupportLevel) {
                default:
                    return "chatLockSupportLevel: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a DeviceCapabilities message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {WADeviceCapabilities.DeviceCapabilities} DeviceCapabilities
         */
        DeviceCapabilities.fromObject = function fromObject(object) {
            if (object instanceof $root.WADeviceCapabilities.DeviceCapabilities)
                return object;
            var message = new $root.WADeviceCapabilities.DeviceCapabilities();
            switch (object.chatLockSupportLevel) {
            default:
                if (typeof object.chatLockSupportLevel === "number") {
                    message.chatLockSupportLevel = object.chatLockSupportLevel;
                    break;
                }
                break;
            case "NONE":
            case 0:
                message.chatLockSupportLevel = 0;
                break;
            case "MINIMAL":
            case 1:
                message.chatLockSupportLevel = 1;
                break;
            case "FULL":
            case 2:
                message.chatLockSupportLevel = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a DeviceCapabilities message. Also converts values to other types if specified.
         * @function toObject
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {WADeviceCapabilities.DeviceCapabilities} message DeviceCapabilities
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeviceCapabilities.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.chatLockSupportLevel = options.enums === String ? "NONE" : 0;
            if (message.chatLockSupportLevel != null && message.hasOwnProperty("chatLockSupportLevel"))
                object.chatLockSupportLevel = options.enums === String ? $root.WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel[message.chatLockSupportLevel] === undefined ? message.chatLockSupportLevel : $root.WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel[message.chatLockSupportLevel] : message.chatLockSupportLevel;
            return object;
        };

        /**
         * Converts this DeviceCapabilities to JSON.
         * @function toJSON
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeviceCapabilities.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeviceCapabilities
         * @function getTypeUrl
         * @memberof WADeviceCapabilities.DeviceCapabilities
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeviceCapabilities.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/WADeviceCapabilities.DeviceCapabilities";
        };

        /**
         * ChatLockSupportLevel enum.
         * @name WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} MINIMAL=1 MINIMAL value
         * @property {number} FULL=2 FULL value
         */
        DeviceCapabilities.ChatLockSupportLevel = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "MINIMAL"] = 1;
            values[valuesById[2] = "FULL"] = 2;
            return values;
        })();

        return DeviceCapabilities;
    })();

    return WADeviceCapabilities;
})();

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
