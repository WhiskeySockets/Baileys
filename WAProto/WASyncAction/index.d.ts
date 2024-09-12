import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WASyncAction. */
export namespace WASyncAction {

    /** Properties of a CallLogRecord. */
    interface ICallLogRecord {

        /** CallLogRecord callResult */
        callResult?: (WASyncAction.CallLogRecord.CallResult|null);

        /** CallLogRecord isDndMode */
        isDndMode?: (boolean|null);

        /** CallLogRecord silenceReason */
        silenceReason?: (WASyncAction.CallLogRecord.SilenceReason|null);

        /** CallLogRecord duration */
        duration?: (number|Long|null);

        /** CallLogRecord startTime */
        startTime?: (number|Long|null);

        /** CallLogRecord isIncoming */
        isIncoming?: (boolean|null);

        /** CallLogRecord isVideo */
        isVideo?: (boolean|null);

        /** CallLogRecord isCallLink */
        isCallLink?: (boolean|null);

        /** CallLogRecord callLinkToken */
        callLinkToken?: (string|null);

        /** CallLogRecord scheduledCallID */
        scheduledCallID?: (string|null);

        /** CallLogRecord callID */
        callID?: (string|null);

        /** CallLogRecord callCreatorJID */
        callCreatorJID?: (string|null);

        /** CallLogRecord groupJID */
        groupJID?: (string|null);

        /** CallLogRecord participants */
        participants?: (WASyncAction.CallLogRecord.IParticipantInfo[]|null);

        /** CallLogRecord callType */
        callType?: (WASyncAction.CallLogRecord.CallType|null);
    }

    /** Represents a CallLogRecord. */
    class CallLogRecord implements ICallLogRecord {

        /**
         * Constructs a new CallLogRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ICallLogRecord);

        /** CallLogRecord callResult. */
        public callResult: WASyncAction.CallLogRecord.CallResult;

        /** CallLogRecord isDndMode. */
        public isDndMode: boolean;

        /** CallLogRecord silenceReason. */
        public silenceReason: WASyncAction.CallLogRecord.SilenceReason;

        /** CallLogRecord duration. */
        public duration: (number|Long);

        /** CallLogRecord startTime. */
        public startTime: (number|Long);

        /** CallLogRecord isIncoming. */
        public isIncoming: boolean;

        /** CallLogRecord isVideo. */
        public isVideo: boolean;

        /** CallLogRecord isCallLink. */
        public isCallLink: boolean;

        /** CallLogRecord callLinkToken. */
        public callLinkToken: string;

        /** CallLogRecord scheduledCallID. */
        public scheduledCallID: string;

        /** CallLogRecord callID. */
        public callID: string;

        /** CallLogRecord callCreatorJID. */
        public callCreatorJID: string;

        /** CallLogRecord groupJID. */
        public groupJID: string;

        /** CallLogRecord participants. */
        public participants: WASyncAction.CallLogRecord.IParticipantInfo[];

        /** CallLogRecord callType. */
        public callType: WASyncAction.CallLogRecord.CallType;

        /**
         * Creates a new CallLogRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallLogRecord instance
         */
        public static create(properties?: WASyncAction.ICallLogRecord): WASyncAction.CallLogRecord;

        /**
         * Encodes the specified CallLogRecord message. Does not implicitly {@link WASyncAction.CallLogRecord.verify|verify} messages.
         * @param message CallLogRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ICallLogRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallLogRecord message, length delimited. Does not implicitly {@link WASyncAction.CallLogRecord.verify|verify} messages.
         * @param message CallLogRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ICallLogRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallLogRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CallLogRecord;

        /**
         * Decodes a CallLogRecord message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CallLogRecord;

        /**
         * Verifies a CallLogRecord message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallLogRecord message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallLogRecord
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.CallLogRecord;

        /**
         * Creates a plain object from a CallLogRecord message. Also converts values to other types if specified.
         * @param message CallLogRecord
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.CallLogRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallLogRecord to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CallLogRecord
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace CallLogRecord {

        /** CallType enum. */
        enum CallType {
            REGULAR = 0,
            SCHEDULED_CALL = 1,
            VOICE_CHAT = 2
        }

        /** SilenceReason enum. */
        enum SilenceReason {
            NONE = 0,
            SCHEDULED = 1,
            PRIVACY = 2,
            LIGHTWEIGHT = 3
        }

        /** CallResult enum. */
        enum CallResult {
            CONNECTED = 0,
            REJECTED = 1,
            CANCELLED = 2,
            ACCEPTEDELSEWHERE = 3,
            MISSED = 4,
            INVALID = 5,
            UNAVAILABLE = 6,
            UPCOMING = 7,
            FAILED = 8,
            ABANDONED = 9,
            ONGOING = 10
        }

        /** Properties of a ParticipantInfo. */
        interface IParticipantInfo {

            /** ParticipantInfo userJID */
            userJID?: (string|null);

            /** ParticipantInfo callResult */
            callResult?: (WASyncAction.CallLogRecord.CallResult|null);
        }

        /** Represents a ParticipantInfo. */
        class ParticipantInfo implements IParticipantInfo {

            /**
             * Constructs a new ParticipantInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: WASyncAction.CallLogRecord.IParticipantInfo);

            /** ParticipantInfo userJID. */
            public userJID: string;

            /** ParticipantInfo callResult. */
            public callResult: WASyncAction.CallLogRecord.CallResult;

            /**
             * Creates a new ParticipantInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ParticipantInfo instance
             */
            public static create(properties?: WASyncAction.CallLogRecord.IParticipantInfo): WASyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Encodes the specified ParticipantInfo message. Does not implicitly {@link WASyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @param message ParticipantInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WASyncAction.CallLogRecord.IParticipantInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ParticipantInfo message, length delimited. Does not implicitly {@link WASyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @param message ParticipantInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WASyncAction.CallLogRecord.IParticipantInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ParticipantInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Decodes a ParticipantInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Verifies a ParticipantInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ParticipantInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ParticipantInfo
             */
            public static fromObject(object: { [k: string]: any }): WASyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Creates a plain object from a ParticipantInfo message. Also converts values to other types if specified.
             * @param message ParticipantInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WASyncAction.CallLogRecord.ParticipantInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ParticipantInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ParticipantInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a WaffleAccountLinkStateAction. */
    interface IWaffleAccountLinkStateAction {

        /** WaffleAccountLinkStateAction linkState */
        linkState?: (WASyncAction.WaffleAccountLinkStateAction.AccountLinkState|null);
    }

    /** Represents a WaffleAccountLinkStateAction. */
    class WaffleAccountLinkStateAction implements IWaffleAccountLinkStateAction {

        /**
         * Constructs a new WaffleAccountLinkStateAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IWaffleAccountLinkStateAction);

        /** WaffleAccountLinkStateAction linkState. */
        public linkState: WASyncAction.WaffleAccountLinkStateAction.AccountLinkState;

        /**
         * Creates a new WaffleAccountLinkStateAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WaffleAccountLinkStateAction instance
         */
        public static create(properties?: WASyncAction.IWaffleAccountLinkStateAction): WASyncAction.WaffleAccountLinkStateAction;

        /**
         * Encodes the specified WaffleAccountLinkStateAction message. Does not implicitly {@link WASyncAction.WaffleAccountLinkStateAction.verify|verify} messages.
         * @param message WaffleAccountLinkStateAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IWaffleAccountLinkStateAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WaffleAccountLinkStateAction message, length delimited. Does not implicitly {@link WASyncAction.WaffleAccountLinkStateAction.verify|verify} messages.
         * @param message WaffleAccountLinkStateAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IWaffleAccountLinkStateAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WaffleAccountLinkStateAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.WaffleAccountLinkStateAction;

        /**
         * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WaffleAccountLinkStateAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.WaffleAccountLinkStateAction;

        /**
         * Verifies a WaffleAccountLinkStateAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WaffleAccountLinkStateAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WaffleAccountLinkStateAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.WaffleAccountLinkStateAction;

        /**
         * Creates a plain object from a WaffleAccountLinkStateAction message. Also converts values to other types if specified.
         * @param message WaffleAccountLinkStateAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.WaffleAccountLinkStateAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WaffleAccountLinkStateAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WaffleAccountLinkStateAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace WaffleAccountLinkStateAction {

        /** AccountLinkState enum. */
        enum AccountLinkState {
            ACTIVE = 0
        }
    }

    /** Properties of a MerchantPaymentPartnerAction. */
    interface IMerchantPaymentPartnerAction {

        /** MerchantPaymentPartnerAction status */
        status: WASyncAction.MerchantPaymentPartnerAction.Status;

        /** MerchantPaymentPartnerAction country */
        country: string;

        /** MerchantPaymentPartnerAction gatewayName */
        gatewayName?: (string|null);

        /** MerchantPaymentPartnerAction credentialID */
        credentialID?: (string|null);
    }

    /** Represents a MerchantPaymentPartnerAction. */
    class MerchantPaymentPartnerAction implements IMerchantPaymentPartnerAction {

        /**
         * Constructs a new MerchantPaymentPartnerAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IMerchantPaymentPartnerAction);

        /** MerchantPaymentPartnerAction status. */
        public status: WASyncAction.MerchantPaymentPartnerAction.Status;

        /** MerchantPaymentPartnerAction country. */
        public country: string;

        /** MerchantPaymentPartnerAction gatewayName. */
        public gatewayName: string;

        /** MerchantPaymentPartnerAction credentialID. */
        public credentialID: string;

        /**
         * Creates a new MerchantPaymentPartnerAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MerchantPaymentPartnerAction instance
         */
        public static create(properties?: WASyncAction.IMerchantPaymentPartnerAction): WASyncAction.MerchantPaymentPartnerAction;

        /**
         * Encodes the specified MerchantPaymentPartnerAction message. Does not implicitly {@link WASyncAction.MerchantPaymentPartnerAction.verify|verify} messages.
         * @param message MerchantPaymentPartnerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IMerchantPaymentPartnerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MerchantPaymentPartnerAction message, length delimited. Does not implicitly {@link WASyncAction.MerchantPaymentPartnerAction.verify|verify} messages.
         * @param message MerchantPaymentPartnerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IMerchantPaymentPartnerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MerchantPaymentPartnerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.MerchantPaymentPartnerAction;

        /**
         * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MerchantPaymentPartnerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.MerchantPaymentPartnerAction;

        /**
         * Verifies a MerchantPaymentPartnerAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MerchantPaymentPartnerAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MerchantPaymentPartnerAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.MerchantPaymentPartnerAction;

        /**
         * Creates a plain object from a MerchantPaymentPartnerAction message. Also converts values to other types if specified.
         * @param message MerchantPaymentPartnerAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.MerchantPaymentPartnerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MerchantPaymentPartnerAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MerchantPaymentPartnerAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MerchantPaymentPartnerAction {

        /** Status enum. */
        enum Status {
            ACTIVE = 0,
            INACTIVE = 1
        }
    }

    /** Properties of a NoteEditAction. */
    interface INoteEditAction {

        /** NoteEditAction type */
        type?: (WASyncAction.NoteEditAction.NoteType|null);

        /** NoteEditAction chatJID */
        chatJID?: (string|null);

        /** NoteEditAction createdAt */
        createdAt?: (number|Long|null);

        /** NoteEditAction deleted */
        deleted?: (boolean|null);

        /** NoteEditAction unstructuredContent */
        unstructuredContent?: (string|null);
    }

    /** Represents a NoteEditAction. */
    class NoteEditAction implements INoteEditAction {

        /**
         * Constructs a new NoteEditAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.INoteEditAction);

        /** NoteEditAction type. */
        public type: WASyncAction.NoteEditAction.NoteType;

        /** NoteEditAction chatJID. */
        public chatJID: string;

        /** NoteEditAction createdAt. */
        public createdAt: (number|Long);

        /** NoteEditAction deleted. */
        public deleted: boolean;

        /** NoteEditAction unstructuredContent. */
        public unstructuredContent: string;

        /**
         * Creates a new NoteEditAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NoteEditAction instance
         */
        public static create(properties?: WASyncAction.INoteEditAction): WASyncAction.NoteEditAction;

        /**
         * Encodes the specified NoteEditAction message. Does not implicitly {@link WASyncAction.NoteEditAction.verify|verify} messages.
         * @param message NoteEditAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.INoteEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NoteEditAction message, length delimited. Does not implicitly {@link WASyncAction.NoteEditAction.verify|verify} messages.
         * @param message NoteEditAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.INoteEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NoteEditAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NoteEditAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.NoteEditAction;

        /**
         * Decodes a NoteEditAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NoteEditAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.NoteEditAction;

        /**
         * Verifies a NoteEditAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NoteEditAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NoteEditAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.NoteEditAction;

        /**
         * Creates a plain object from a NoteEditAction message. Also converts values to other types if specified.
         * @param message NoteEditAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.NoteEditAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NoteEditAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NoteEditAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace NoteEditAction {

        /** NoteType enum. */
        enum NoteType {
            UNSTRUCTURED = 1,
            STRUCTURED = 2
        }
    }

    /** Properties of a StatusPrivacyAction. */
    interface IStatusPrivacyAction {

        /** StatusPrivacyAction mode */
        mode?: (WASyncAction.StatusPrivacyAction.StatusDistributionMode|null);

        /** StatusPrivacyAction userJID */
        userJID?: (string[]|null);
    }

    /** Represents a StatusPrivacyAction. */
    class StatusPrivacyAction implements IStatusPrivacyAction {

        /**
         * Constructs a new StatusPrivacyAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IStatusPrivacyAction);

        /** StatusPrivacyAction mode. */
        public mode: WASyncAction.StatusPrivacyAction.StatusDistributionMode;

        /** StatusPrivacyAction userJID. */
        public userJID: string[];

        /**
         * Creates a new StatusPrivacyAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StatusPrivacyAction instance
         */
        public static create(properties?: WASyncAction.IStatusPrivacyAction): WASyncAction.StatusPrivacyAction;

        /**
         * Encodes the specified StatusPrivacyAction message. Does not implicitly {@link WASyncAction.StatusPrivacyAction.verify|verify} messages.
         * @param message StatusPrivacyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IStatusPrivacyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StatusPrivacyAction message, length delimited. Does not implicitly {@link WASyncAction.StatusPrivacyAction.verify|verify} messages.
         * @param message StatusPrivacyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IStatusPrivacyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StatusPrivacyAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StatusPrivacyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.StatusPrivacyAction;

        /**
         * Decodes a StatusPrivacyAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StatusPrivacyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.StatusPrivacyAction;

        /**
         * Verifies a StatusPrivacyAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StatusPrivacyAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StatusPrivacyAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.StatusPrivacyAction;

        /**
         * Creates a plain object from a StatusPrivacyAction message. Also converts values to other types if specified.
         * @param message StatusPrivacyAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.StatusPrivacyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StatusPrivacyAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StatusPrivacyAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace StatusPrivacyAction {

        /** StatusDistributionMode enum. */
        enum StatusDistributionMode {
            ALLOW_LIST = 0,
            DENY_LIST = 1,
            CONTACTS = 2
        }
    }

    /** Properties of a MarketingMessageAction. */
    interface IMarketingMessageAction {

        /** MarketingMessageAction name */
        name?: (string|null);

        /** MarketingMessageAction message */
        message?: (string|null);

        /** MarketingMessageAction type */
        type?: (WASyncAction.MarketingMessageAction.MarketingMessagePrototypeType|null);

        /** MarketingMessageAction createdAt */
        createdAt?: (number|Long|null);

        /** MarketingMessageAction lastSentAt */
        lastSentAt?: (number|Long|null);

        /** MarketingMessageAction isDeleted */
        isDeleted?: (boolean|null);

        /** MarketingMessageAction mediaID */
        mediaID?: (string|null);
    }

    /** Represents a MarketingMessageAction. */
    class MarketingMessageAction implements IMarketingMessageAction {

        /**
         * Constructs a new MarketingMessageAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IMarketingMessageAction);

        /** MarketingMessageAction name. */
        public name: string;

        /** MarketingMessageAction message. */
        public message: string;

        /** MarketingMessageAction type. */
        public type: WASyncAction.MarketingMessageAction.MarketingMessagePrototypeType;

        /** MarketingMessageAction createdAt. */
        public createdAt: (number|Long);

        /** MarketingMessageAction lastSentAt. */
        public lastSentAt: (number|Long);

        /** MarketingMessageAction isDeleted. */
        public isDeleted: boolean;

        /** MarketingMessageAction mediaID. */
        public mediaID: string;

        /**
         * Creates a new MarketingMessageAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarketingMessageAction instance
         */
        public static create(properties?: WASyncAction.IMarketingMessageAction): WASyncAction.MarketingMessageAction;

        /**
         * Encodes the specified MarketingMessageAction message. Does not implicitly {@link WASyncAction.MarketingMessageAction.verify|verify} messages.
         * @param message MarketingMessageAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IMarketingMessageAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarketingMessageAction message, length delimited. Does not implicitly {@link WASyncAction.MarketingMessageAction.verify|verify} messages.
         * @param message MarketingMessageAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IMarketingMessageAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarketingMessageAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarketingMessageAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.MarketingMessageAction;

        /**
         * Decodes a MarketingMessageAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarketingMessageAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.MarketingMessageAction;

        /**
         * Verifies a MarketingMessageAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarketingMessageAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarketingMessageAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.MarketingMessageAction;

        /**
         * Creates a plain object from a MarketingMessageAction message. Also converts values to other types if specified.
         * @param message MarketingMessageAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.MarketingMessageAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarketingMessageAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MarketingMessageAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MarketingMessageAction {

        /** MarketingMessagePrototypeType enum. */
        enum MarketingMessagePrototypeType {
            PERSONALIZED = 0
        }
    }

    /** Properties of a PatchDebugData. */
    interface IPatchDebugData {

        /** PatchDebugData currentLthash */
        currentLthash?: (Uint8Array|null);

        /** PatchDebugData newLthash */
        newLthash?: (Uint8Array|null);

        /** PatchDebugData patchVersion */
        patchVersion?: (Uint8Array|null);

        /** PatchDebugData collectionName */
        collectionName?: (Uint8Array|null);

        /** PatchDebugData firstFourBytesFromAHashOfSnapshotMACKey */
        firstFourBytesFromAHashOfSnapshotMACKey?: (Uint8Array|null);

        /** PatchDebugData newLthashSubtract */
        newLthashSubtract?: (Uint8Array|null);

        /** PatchDebugData numberAdd */
        numberAdd?: (number|null);

        /** PatchDebugData numberRemove */
        numberRemove?: (number|null);

        /** PatchDebugData numberOverride */
        numberOverride?: (number|null);

        /** PatchDebugData senderPlatform */
        senderPlatform?: (WASyncAction.PatchDebugData.Platform|null);

        /** PatchDebugData isSenderPrimary */
        isSenderPrimary?: (boolean|null);
    }

    /** Represents a PatchDebugData. */
    class PatchDebugData implements IPatchDebugData {

        /**
         * Constructs a new PatchDebugData.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPatchDebugData);

        /** PatchDebugData currentLthash. */
        public currentLthash: Uint8Array;

        /** PatchDebugData newLthash. */
        public newLthash: Uint8Array;

        /** PatchDebugData patchVersion. */
        public patchVersion: Uint8Array;

        /** PatchDebugData collectionName. */
        public collectionName: Uint8Array;

        /** PatchDebugData firstFourBytesFromAHashOfSnapshotMACKey. */
        public firstFourBytesFromAHashOfSnapshotMACKey: Uint8Array;

        /** PatchDebugData newLthashSubtract. */
        public newLthashSubtract: Uint8Array;

        /** PatchDebugData numberAdd. */
        public numberAdd: number;

        /** PatchDebugData numberRemove. */
        public numberRemove: number;

        /** PatchDebugData numberOverride. */
        public numberOverride: number;

        /** PatchDebugData senderPlatform. */
        public senderPlatform: WASyncAction.PatchDebugData.Platform;

        /** PatchDebugData isSenderPrimary. */
        public isSenderPrimary: boolean;

        /**
         * Creates a new PatchDebugData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PatchDebugData instance
         */
        public static create(properties?: WASyncAction.IPatchDebugData): WASyncAction.PatchDebugData;

        /**
         * Encodes the specified PatchDebugData message. Does not implicitly {@link WASyncAction.PatchDebugData.verify|verify} messages.
         * @param message PatchDebugData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPatchDebugData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PatchDebugData message, length delimited. Does not implicitly {@link WASyncAction.PatchDebugData.verify|verify} messages.
         * @param message PatchDebugData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPatchDebugData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PatchDebugData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PatchDebugData;

        /**
         * Decodes a PatchDebugData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PatchDebugData;

        /**
         * Verifies a PatchDebugData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PatchDebugData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PatchDebugData
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PatchDebugData;

        /**
         * Creates a plain object from a PatchDebugData message. Also converts values to other types if specified.
         * @param message PatchDebugData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PatchDebugData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PatchDebugData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PatchDebugData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace PatchDebugData {

        /** Platform enum. */
        enum Platform {
            ANDROID = 0,
            SMBA = 1,
            IPHONE = 2,
            SMBI = 3,
            WEB = 4,
            UWP = 5,
            DARWIN = 6
        }
    }

    /** Properties of a RecentEmojiWeight. */
    interface IRecentEmojiWeight {

        /** RecentEmojiWeight emoji */
        emoji?: (string|null);

        /** RecentEmojiWeight weight */
        weight?: (number|null);
    }

    /** Represents a RecentEmojiWeight. */
    class RecentEmojiWeight implements IRecentEmojiWeight {

        /**
         * Constructs a new RecentEmojiWeight.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IRecentEmojiWeight);

        /** RecentEmojiWeight emoji. */
        public emoji: string;

        /** RecentEmojiWeight weight. */
        public weight: number;

        /**
         * Creates a new RecentEmojiWeight instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecentEmojiWeight instance
         */
        public static create(properties?: WASyncAction.IRecentEmojiWeight): WASyncAction.RecentEmojiWeight;

        /**
         * Encodes the specified RecentEmojiWeight message. Does not implicitly {@link WASyncAction.RecentEmojiWeight.verify|verify} messages.
         * @param message RecentEmojiWeight message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IRecentEmojiWeight, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecentEmojiWeight message, length delimited. Does not implicitly {@link WASyncAction.RecentEmojiWeight.verify|verify} messages.
         * @param message RecentEmojiWeight message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IRecentEmojiWeight, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecentEmojiWeight message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.RecentEmojiWeight;

        /**
         * Decodes a RecentEmojiWeight message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.RecentEmojiWeight;

        /**
         * Verifies a RecentEmojiWeight message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RecentEmojiWeight message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RecentEmojiWeight
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.RecentEmojiWeight;

        /**
         * Creates a plain object from a RecentEmojiWeight message. Also converts values to other types if specified.
         * @param message RecentEmojiWeight
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.RecentEmojiWeight, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RecentEmojiWeight to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RecentEmojiWeight
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncActionValue. */
    interface ISyncActionValue {

        /** SyncActionValue timestamp */
        timestamp?: (number|Long|null);

        /** SyncActionValue starAction */
        starAction?: (WASyncAction.IStarAction|null);

        /** SyncActionValue contactAction */
        contactAction?: (WASyncAction.IContactAction|null);

        /** SyncActionValue muteAction */
        muteAction?: (WASyncAction.IMuteAction|null);

        /** SyncActionValue pinAction */
        pinAction?: (WASyncAction.IPinAction|null);

        /** SyncActionValue securityNotificationSetting */
        securityNotificationSetting?: (WASyncAction.ISecurityNotificationSetting|null);

        /** SyncActionValue pushNameSetting */
        pushNameSetting?: (WASyncAction.IPushNameSetting|null);

        /** SyncActionValue quickReplyAction */
        quickReplyAction?: (WASyncAction.IQuickReplyAction|null);

        /** SyncActionValue recentEmojiWeightsAction */
        recentEmojiWeightsAction?: (WASyncAction.IRecentEmojiWeightsAction|null);

        /** SyncActionValue labelEditAction */
        labelEditAction?: (WASyncAction.ILabelEditAction|null);

        /** SyncActionValue labelAssociationAction */
        labelAssociationAction?: (WASyncAction.ILabelAssociationAction|null);

        /** SyncActionValue localeSetting */
        localeSetting?: (WASyncAction.ILocaleSetting|null);

        /** SyncActionValue archiveChatAction */
        archiveChatAction?: (WASyncAction.IArchiveChatAction|null);

        /** SyncActionValue deleteMessageForMeAction */
        deleteMessageForMeAction?: (WASyncAction.IDeleteMessageForMeAction|null);

        /** SyncActionValue keyExpiration */
        keyExpiration?: (WASyncAction.IKeyExpiration|null);

        /** SyncActionValue markChatAsReadAction */
        markChatAsReadAction?: (WASyncAction.IMarkChatAsReadAction|null);

        /** SyncActionValue clearChatAction */
        clearChatAction?: (WASyncAction.IClearChatAction|null);

        /** SyncActionValue deleteChatAction */
        deleteChatAction?: (WASyncAction.IDeleteChatAction|null);

        /** SyncActionValue unarchiveChatsSetting */
        unarchiveChatsSetting?: (WASyncAction.IUnarchiveChatsSetting|null);

        /** SyncActionValue primaryFeature */
        primaryFeature?: (WASyncAction.IPrimaryFeature|null);

        /** SyncActionValue androidUnsupportedActions */
        androidUnsupportedActions?: (WASyncAction.IAndroidUnsupportedActions|null);

        /** SyncActionValue agentAction */
        agentAction?: (WASyncAction.IAgentAction|null);

        /** SyncActionValue subscriptionAction */
        subscriptionAction?: (WASyncAction.ISubscriptionAction|null);

        /** SyncActionValue userStatusMuteAction */
        userStatusMuteAction?: (WASyncAction.IUserStatusMuteAction|null);

        /** SyncActionValue timeFormatAction */
        timeFormatAction?: (WASyncAction.ITimeFormatAction|null);

        /** SyncActionValue nuxAction */
        nuxAction?: (WASyncAction.INuxAction|null);

        /** SyncActionValue primaryVersionAction */
        primaryVersionAction?: (WASyncAction.IPrimaryVersionAction|null);

        /** SyncActionValue stickerAction */
        stickerAction?: (WASyncAction.IStickerAction|null);

        /** SyncActionValue removeRecentStickerAction */
        removeRecentStickerAction?: (WASyncAction.IRemoveRecentStickerAction|null);

        /** SyncActionValue chatAssignment */
        chatAssignment?: (WASyncAction.IChatAssignmentAction|null);

        /** SyncActionValue chatAssignmentOpenedStatus */
        chatAssignmentOpenedStatus?: (WASyncAction.IChatAssignmentOpenedStatusAction|null);

        /** SyncActionValue pnForLidChatAction */
        pnForLidChatAction?: (WASyncAction.IPnForLidChatAction|null);

        /** SyncActionValue marketingMessageAction */
        marketingMessageAction?: (WASyncAction.IMarketingMessageAction|null);

        /** SyncActionValue marketingMessageBroadcastAction */
        marketingMessageBroadcastAction?: (WASyncAction.IMarketingMessageBroadcastAction|null);

        /** SyncActionValue externalWebBetaAction */
        externalWebBetaAction?: (WASyncAction.IExternalWebBetaAction|null);

        /** SyncActionValue privacySettingRelayAllCalls */
        privacySettingRelayAllCalls?: (WASyncAction.IPrivacySettingRelayAllCalls|null);

        /** SyncActionValue callLogAction */
        callLogAction?: (WASyncAction.ICallLogAction|null);

        /** SyncActionValue statusPrivacy */
        statusPrivacy?: (WASyncAction.IStatusPrivacyAction|null);

        /** SyncActionValue botWelcomeRequestAction */
        botWelcomeRequestAction?: (WASyncAction.IBotWelcomeRequestAction|null);

        /** SyncActionValue deleteIndividualCallLog */
        deleteIndividualCallLog?: (WASyncAction.IDeleteIndividualCallLogAction|null);

        /** SyncActionValue labelReorderingAction */
        labelReorderingAction?: (WASyncAction.ILabelReorderingAction|null);

        /** SyncActionValue paymentInfoAction */
        paymentInfoAction?: (WASyncAction.IPaymentInfoAction|null);

        /** SyncActionValue customPaymentMethodsAction */
        customPaymentMethodsAction?: (WASyncAction.ICustomPaymentMethodsAction|null);

        /** SyncActionValue lockChatAction */
        lockChatAction?: (WASyncAction.ILockChatAction|null);

        /** SyncActionValue chatLockSettings */
        chatLockSettings?: (WAChatLockSettings.IChatLockSettings|null);

        /** SyncActionValue wamoUserIdentifierAction */
        wamoUserIdentifierAction?: (WASyncAction.IWamoUserIdentifierAction|null);

        /** SyncActionValue privacySettingDisableLinkPreviewsAction */
        privacySettingDisableLinkPreviewsAction?: (WASyncAction.IPrivacySettingDisableLinkPreviewsAction|null);

        /** SyncActionValue deviceCapabilities */
        deviceCapabilities?: (WADeviceCapabilities.IDeviceCapabilities|null);

        /** SyncActionValue noteEditAction */
        noteEditAction?: (WASyncAction.INoteEditAction|null);

        /** SyncActionValue favoritesAction */
        favoritesAction?: (WASyncAction.IFavoritesAction|null);

        /** SyncActionValue merchantPaymentPartnerAction */
        merchantPaymentPartnerAction?: (WASyncAction.IMerchantPaymentPartnerAction|null);

        /** SyncActionValue waffleAccountLinkStateAction */
        waffleAccountLinkStateAction?: (WASyncAction.IWaffleAccountLinkStateAction|null);
    }

    /** Represents a SyncActionValue. */
    class SyncActionValue implements ISyncActionValue {

        /**
         * Constructs a new SyncActionValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISyncActionValue);

        /** SyncActionValue timestamp. */
        public timestamp: (number|Long);

        /** SyncActionValue starAction. */
        public starAction?: (WASyncAction.IStarAction|null);

        /** SyncActionValue contactAction. */
        public contactAction?: (WASyncAction.IContactAction|null);

        /** SyncActionValue muteAction. */
        public muteAction?: (WASyncAction.IMuteAction|null);

        /** SyncActionValue pinAction. */
        public pinAction?: (WASyncAction.IPinAction|null);

        /** SyncActionValue securityNotificationSetting. */
        public securityNotificationSetting?: (WASyncAction.ISecurityNotificationSetting|null);

        /** SyncActionValue pushNameSetting. */
        public pushNameSetting?: (WASyncAction.IPushNameSetting|null);

        /** SyncActionValue quickReplyAction. */
        public quickReplyAction?: (WASyncAction.IQuickReplyAction|null);

        /** SyncActionValue recentEmojiWeightsAction. */
        public recentEmojiWeightsAction?: (WASyncAction.IRecentEmojiWeightsAction|null);

        /** SyncActionValue labelEditAction. */
        public labelEditAction?: (WASyncAction.ILabelEditAction|null);

        /** SyncActionValue labelAssociationAction. */
        public labelAssociationAction?: (WASyncAction.ILabelAssociationAction|null);

        /** SyncActionValue localeSetting. */
        public localeSetting?: (WASyncAction.ILocaleSetting|null);

        /** SyncActionValue archiveChatAction. */
        public archiveChatAction?: (WASyncAction.IArchiveChatAction|null);

        /** SyncActionValue deleteMessageForMeAction. */
        public deleteMessageForMeAction?: (WASyncAction.IDeleteMessageForMeAction|null);

        /** SyncActionValue keyExpiration. */
        public keyExpiration?: (WASyncAction.IKeyExpiration|null);

        /** SyncActionValue markChatAsReadAction. */
        public markChatAsReadAction?: (WASyncAction.IMarkChatAsReadAction|null);

        /** SyncActionValue clearChatAction. */
        public clearChatAction?: (WASyncAction.IClearChatAction|null);

        /** SyncActionValue deleteChatAction. */
        public deleteChatAction?: (WASyncAction.IDeleteChatAction|null);

        /** SyncActionValue unarchiveChatsSetting. */
        public unarchiveChatsSetting?: (WASyncAction.IUnarchiveChatsSetting|null);

        /** SyncActionValue primaryFeature. */
        public primaryFeature?: (WASyncAction.IPrimaryFeature|null);

        /** SyncActionValue androidUnsupportedActions. */
        public androidUnsupportedActions?: (WASyncAction.IAndroidUnsupportedActions|null);

        /** SyncActionValue agentAction. */
        public agentAction?: (WASyncAction.IAgentAction|null);

        /** SyncActionValue subscriptionAction. */
        public subscriptionAction?: (WASyncAction.ISubscriptionAction|null);

        /** SyncActionValue userStatusMuteAction. */
        public userStatusMuteAction?: (WASyncAction.IUserStatusMuteAction|null);

        /** SyncActionValue timeFormatAction. */
        public timeFormatAction?: (WASyncAction.ITimeFormatAction|null);

        /** SyncActionValue nuxAction. */
        public nuxAction?: (WASyncAction.INuxAction|null);

        /** SyncActionValue primaryVersionAction. */
        public primaryVersionAction?: (WASyncAction.IPrimaryVersionAction|null);

        /** SyncActionValue stickerAction. */
        public stickerAction?: (WASyncAction.IStickerAction|null);

        /** SyncActionValue removeRecentStickerAction. */
        public removeRecentStickerAction?: (WASyncAction.IRemoveRecentStickerAction|null);

        /** SyncActionValue chatAssignment. */
        public chatAssignment?: (WASyncAction.IChatAssignmentAction|null);

        /** SyncActionValue chatAssignmentOpenedStatus. */
        public chatAssignmentOpenedStatus?: (WASyncAction.IChatAssignmentOpenedStatusAction|null);

        /** SyncActionValue pnForLidChatAction. */
        public pnForLidChatAction?: (WASyncAction.IPnForLidChatAction|null);

        /** SyncActionValue marketingMessageAction. */
        public marketingMessageAction?: (WASyncAction.IMarketingMessageAction|null);

        /** SyncActionValue marketingMessageBroadcastAction. */
        public marketingMessageBroadcastAction?: (WASyncAction.IMarketingMessageBroadcastAction|null);

        /** SyncActionValue externalWebBetaAction. */
        public externalWebBetaAction?: (WASyncAction.IExternalWebBetaAction|null);

        /** SyncActionValue privacySettingRelayAllCalls. */
        public privacySettingRelayAllCalls?: (WASyncAction.IPrivacySettingRelayAllCalls|null);

        /** SyncActionValue callLogAction. */
        public callLogAction?: (WASyncAction.ICallLogAction|null);

        /** SyncActionValue statusPrivacy. */
        public statusPrivacy?: (WASyncAction.IStatusPrivacyAction|null);

        /** SyncActionValue botWelcomeRequestAction. */
        public botWelcomeRequestAction?: (WASyncAction.IBotWelcomeRequestAction|null);

        /** SyncActionValue deleteIndividualCallLog. */
        public deleteIndividualCallLog?: (WASyncAction.IDeleteIndividualCallLogAction|null);

        /** SyncActionValue labelReorderingAction. */
        public labelReorderingAction?: (WASyncAction.ILabelReorderingAction|null);

        /** SyncActionValue paymentInfoAction. */
        public paymentInfoAction?: (WASyncAction.IPaymentInfoAction|null);

        /** SyncActionValue customPaymentMethodsAction. */
        public customPaymentMethodsAction?: (WASyncAction.ICustomPaymentMethodsAction|null);

        /** SyncActionValue lockChatAction. */
        public lockChatAction?: (WASyncAction.ILockChatAction|null);

        /** SyncActionValue chatLockSettings. */
        public chatLockSettings?: (WAChatLockSettings.IChatLockSettings|null);

        /** SyncActionValue wamoUserIdentifierAction. */
        public wamoUserIdentifierAction?: (WASyncAction.IWamoUserIdentifierAction|null);

        /** SyncActionValue privacySettingDisableLinkPreviewsAction. */
        public privacySettingDisableLinkPreviewsAction?: (WASyncAction.IPrivacySettingDisableLinkPreviewsAction|null);

        /** SyncActionValue deviceCapabilities. */
        public deviceCapabilities?: (WADeviceCapabilities.IDeviceCapabilities|null);

        /** SyncActionValue noteEditAction. */
        public noteEditAction?: (WASyncAction.INoteEditAction|null);

        /** SyncActionValue favoritesAction. */
        public favoritesAction?: (WASyncAction.IFavoritesAction|null);

        /** SyncActionValue merchantPaymentPartnerAction. */
        public merchantPaymentPartnerAction?: (WASyncAction.IMerchantPaymentPartnerAction|null);

        /** SyncActionValue waffleAccountLinkStateAction. */
        public waffleAccountLinkStateAction?: (WASyncAction.IWaffleAccountLinkStateAction|null);

        /**
         * Creates a new SyncActionValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionValue instance
         */
        public static create(properties?: WASyncAction.ISyncActionValue): WASyncAction.SyncActionValue;

        /**
         * Encodes the specified SyncActionValue message. Does not implicitly {@link WASyncAction.SyncActionValue.verify|verify} messages.
         * @param message SyncActionValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISyncActionValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionValue message, length delimited. Does not implicitly {@link WASyncAction.SyncActionValue.verify|verify} messages.
         * @param message SyncActionValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISyncActionValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SyncActionValue;

        /**
         * Decodes a SyncActionValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SyncActionValue;

        /**
         * Verifies a SyncActionValue message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncActionValue message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncActionValue
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SyncActionValue;

        /**
         * Creates a plain object from a SyncActionValue message. Also converts values to other types if specified.
         * @param message SyncActionValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SyncActionValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncActionValue to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncActionValue
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FavoritesAction. */
    interface IFavoritesAction {

        /** FavoritesAction favorites */
        favorites?: (WASyncAction.FavoritesAction.IFavorite[]|null);
    }

    /** Represents a FavoritesAction. */
    class FavoritesAction implements IFavoritesAction {

        /**
         * Constructs a new FavoritesAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IFavoritesAction);

        /** FavoritesAction favorites. */
        public favorites: WASyncAction.FavoritesAction.IFavorite[];

        /**
         * Creates a new FavoritesAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FavoritesAction instance
         */
        public static create(properties?: WASyncAction.IFavoritesAction): WASyncAction.FavoritesAction;

        /**
         * Encodes the specified FavoritesAction message. Does not implicitly {@link WASyncAction.FavoritesAction.verify|verify} messages.
         * @param message FavoritesAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IFavoritesAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FavoritesAction message, length delimited. Does not implicitly {@link WASyncAction.FavoritesAction.verify|verify} messages.
         * @param message FavoritesAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IFavoritesAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FavoritesAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FavoritesAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.FavoritesAction;

        /**
         * Decodes a FavoritesAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FavoritesAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.FavoritesAction;

        /**
         * Verifies a FavoritesAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FavoritesAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FavoritesAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.FavoritesAction;

        /**
         * Creates a plain object from a FavoritesAction message. Also converts values to other types if specified.
         * @param message FavoritesAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.FavoritesAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FavoritesAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FavoritesAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace FavoritesAction {

        /** Properties of a Favorite. */
        interface IFavorite {

            /** Favorite ID */
            ID?: (string|null);
        }

        /** Represents a Favorite. */
        class Favorite implements IFavorite {

            /**
             * Constructs a new Favorite.
             * @param [properties] Properties to set
             */
            constructor(properties?: WASyncAction.FavoritesAction.IFavorite);

            /** Favorite ID. */
            public ID: string;

            /**
             * Creates a new Favorite instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Favorite instance
             */
            public static create(properties?: WASyncAction.FavoritesAction.IFavorite): WASyncAction.FavoritesAction.Favorite;

            /**
             * Encodes the specified Favorite message. Does not implicitly {@link WASyncAction.FavoritesAction.Favorite.verify|verify} messages.
             * @param message Favorite message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WASyncAction.FavoritesAction.IFavorite, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Favorite message, length delimited. Does not implicitly {@link WASyncAction.FavoritesAction.Favorite.verify|verify} messages.
             * @param message Favorite message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WASyncAction.FavoritesAction.IFavorite, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Favorite message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Favorite
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.FavoritesAction.Favorite;

            /**
             * Decodes a Favorite message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Favorite
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.FavoritesAction.Favorite;

            /**
             * Verifies a Favorite message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Favorite message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Favorite
             */
            public static fromObject(object: { [k: string]: any }): WASyncAction.FavoritesAction.Favorite;

            /**
             * Creates a plain object from a Favorite message. Also converts values to other types if specified.
             * @param message Favorite
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WASyncAction.FavoritesAction.Favorite, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Favorite to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Favorite
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a PrivacySettingDisableLinkPreviewsAction. */
    interface IPrivacySettingDisableLinkPreviewsAction {

        /** PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled */
        isPreviewsDisabled?: (boolean|null);
    }

    /** Represents a PrivacySettingDisableLinkPreviewsAction. */
    class PrivacySettingDisableLinkPreviewsAction implements IPrivacySettingDisableLinkPreviewsAction {

        /**
         * Constructs a new PrivacySettingDisableLinkPreviewsAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPrivacySettingDisableLinkPreviewsAction);

        /** PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled. */
        public isPreviewsDisabled: boolean;

        /**
         * Creates a new PrivacySettingDisableLinkPreviewsAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PrivacySettingDisableLinkPreviewsAction instance
         */
        public static create(properties?: WASyncAction.IPrivacySettingDisableLinkPreviewsAction): WASyncAction.PrivacySettingDisableLinkPreviewsAction;

        /**
         * Encodes the specified PrivacySettingDisableLinkPreviewsAction message. Does not implicitly {@link WASyncAction.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
         * @param message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPrivacySettingDisableLinkPreviewsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PrivacySettingDisableLinkPreviewsAction message, length delimited. Does not implicitly {@link WASyncAction.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
         * @param message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPrivacySettingDisableLinkPreviewsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PrivacySettingDisableLinkPreviewsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PrivacySettingDisableLinkPreviewsAction;

        /**
         * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PrivacySettingDisableLinkPreviewsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PrivacySettingDisableLinkPreviewsAction;

        /**
         * Verifies a PrivacySettingDisableLinkPreviewsAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PrivacySettingDisableLinkPreviewsAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PrivacySettingDisableLinkPreviewsAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PrivacySettingDisableLinkPreviewsAction;

        /**
         * Creates a plain object from a PrivacySettingDisableLinkPreviewsAction message. Also converts values to other types if specified.
         * @param message PrivacySettingDisableLinkPreviewsAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PrivacySettingDisableLinkPreviewsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PrivacySettingDisableLinkPreviewsAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PrivacySettingDisableLinkPreviewsAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WamoUserIdentifierAction. */
    interface IWamoUserIdentifierAction {

        /** WamoUserIdentifierAction identifier */
        identifier?: (string|null);
    }

    /** Represents a WamoUserIdentifierAction. */
    class WamoUserIdentifierAction implements IWamoUserIdentifierAction {

        /**
         * Constructs a new WamoUserIdentifierAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IWamoUserIdentifierAction);

        /** WamoUserIdentifierAction identifier. */
        public identifier: string;

        /**
         * Creates a new WamoUserIdentifierAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WamoUserIdentifierAction instance
         */
        public static create(properties?: WASyncAction.IWamoUserIdentifierAction): WASyncAction.WamoUserIdentifierAction;

        /**
         * Encodes the specified WamoUserIdentifierAction message. Does not implicitly {@link WASyncAction.WamoUserIdentifierAction.verify|verify} messages.
         * @param message WamoUserIdentifierAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IWamoUserIdentifierAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WamoUserIdentifierAction message, length delimited. Does not implicitly {@link WASyncAction.WamoUserIdentifierAction.verify|verify} messages.
         * @param message WamoUserIdentifierAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IWamoUserIdentifierAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WamoUserIdentifierAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WamoUserIdentifierAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.WamoUserIdentifierAction;

        /**
         * Decodes a WamoUserIdentifierAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WamoUserIdentifierAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.WamoUserIdentifierAction;

        /**
         * Verifies a WamoUserIdentifierAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WamoUserIdentifierAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WamoUserIdentifierAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.WamoUserIdentifierAction;

        /**
         * Creates a plain object from a WamoUserIdentifierAction message. Also converts values to other types if specified.
         * @param message WamoUserIdentifierAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.WamoUserIdentifierAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WamoUserIdentifierAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WamoUserIdentifierAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LockChatAction. */
    interface ILockChatAction {

        /** LockChatAction locked */
        locked?: (boolean|null);
    }

    /** Represents a LockChatAction. */
    class LockChatAction implements ILockChatAction {

        /**
         * Constructs a new LockChatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ILockChatAction);

        /** LockChatAction locked. */
        public locked: boolean;

        /**
         * Creates a new LockChatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LockChatAction instance
         */
        public static create(properties?: WASyncAction.ILockChatAction): WASyncAction.LockChatAction;

        /**
         * Encodes the specified LockChatAction message. Does not implicitly {@link WASyncAction.LockChatAction.verify|verify} messages.
         * @param message LockChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ILockChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LockChatAction message, length delimited. Does not implicitly {@link WASyncAction.LockChatAction.verify|verify} messages.
         * @param message LockChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ILockChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LockChatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LockChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.LockChatAction;

        /**
         * Decodes a LockChatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LockChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.LockChatAction;

        /**
         * Verifies a LockChatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LockChatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LockChatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.LockChatAction;

        /**
         * Creates a plain object from a LockChatAction message. Also converts values to other types if specified.
         * @param message LockChatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.LockChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LockChatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LockChatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CustomPaymentMethodsAction. */
    interface ICustomPaymentMethodsAction {

        /** CustomPaymentMethodsAction customPaymentMethods */
        customPaymentMethods?: (WASyncAction.ICustomPaymentMethod[]|null);
    }

    /** Represents a CustomPaymentMethodsAction. */
    class CustomPaymentMethodsAction implements ICustomPaymentMethodsAction {

        /**
         * Constructs a new CustomPaymentMethodsAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ICustomPaymentMethodsAction);

        /** CustomPaymentMethodsAction customPaymentMethods. */
        public customPaymentMethods: WASyncAction.ICustomPaymentMethod[];

        /**
         * Creates a new CustomPaymentMethodsAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CustomPaymentMethodsAction instance
         */
        public static create(properties?: WASyncAction.ICustomPaymentMethodsAction): WASyncAction.CustomPaymentMethodsAction;

        /**
         * Encodes the specified CustomPaymentMethodsAction message. Does not implicitly {@link WASyncAction.CustomPaymentMethodsAction.verify|verify} messages.
         * @param message CustomPaymentMethodsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ICustomPaymentMethodsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CustomPaymentMethodsAction message, length delimited. Does not implicitly {@link WASyncAction.CustomPaymentMethodsAction.verify|verify} messages.
         * @param message CustomPaymentMethodsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ICustomPaymentMethodsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CustomPaymentMethodsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CustomPaymentMethodsAction;

        /**
         * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CustomPaymentMethodsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CustomPaymentMethodsAction;

        /**
         * Verifies a CustomPaymentMethodsAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CustomPaymentMethodsAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CustomPaymentMethodsAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.CustomPaymentMethodsAction;

        /**
         * Creates a plain object from a CustomPaymentMethodsAction message. Also converts values to other types if specified.
         * @param message CustomPaymentMethodsAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.CustomPaymentMethodsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CustomPaymentMethodsAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CustomPaymentMethodsAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CustomPaymentMethod. */
    interface ICustomPaymentMethod {

        /** CustomPaymentMethod credentialID */
        credentialID: string;

        /** CustomPaymentMethod country */
        country: string;

        /** CustomPaymentMethod type */
        type: string;

        /** CustomPaymentMethod metadata */
        metadata?: (WASyncAction.ICustomPaymentMethodMetadata[]|null);
    }

    /** Represents a CustomPaymentMethod. */
    class CustomPaymentMethod implements ICustomPaymentMethod {

        /**
         * Constructs a new CustomPaymentMethod.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ICustomPaymentMethod);

        /** CustomPaymentMethod credentialID. */
        public credentialID: string;

        /** CustomPaymentMethod country. */
        public country: string;

        /** CustomPaymentMethod type. */
        public type: string;

        /** CustomPaymentMethod metadata. */
        public metadata: WASyncAction.ICustomPaymentMethodMetadata[];

        /**
         * Creates a new CustomPaymentMethod instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CustomPaymentMethod instance
         */
        public static create(properties?: WASyncAction.ICustomPaymentMethod): WASyncAction.CustomPaymentMethod;

        /**
         * Encodes the specified CustomPaymentMethod message. Does not implicitly {@link WASyncAction.CustomPaymentMethod.verify|verify} messages.
         * @param message CustomPaymentMethod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ICustomPaymentMethod, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CustomPaymentMethod message, length delimited. Does not implicitly {@link WASyncAction.CustomPaymentMethod.verify|verify} messages.
         * @param message CustomPaymentMethod message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ICustomPaymentMethod, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CustomPaymentMethod message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CustomPaymentMethod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CustomPaymentMethod;

        /**
         * Decodes a CustomPaymentMethod message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CustomPaymentMethod
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CustomPaymentMethod;

        /**
         * Verifies a CustomPaymentMethod message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CustomPaymentMethod message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CustomPaymentMethod
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.CustomPaymentMethod;

        /**
         * Creates a plain object from a CustomPaymentMethod message. Also converts values to other types if specified.
         * @param message CustomPaymentMethod
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.CustomPaymentMethod, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CustomPaymentMethod to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CustomPaymentMethod
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CustomPaymentMethodMetadata. */
    interface ICustomPaymentMethodMetadata {

        /** CustomPaymentMethodMetadata key */
        key: string;

        /** CustomPaymentMethodMetadata value */
        value: string;
    }

    /** Represents a CustomPaymentMethodMetadata. */
    class CustomPaymentMethodMetadata implements ICustomPaymentMethodMetadata {

        /**
         * Constructs a new CustomPaymentMethodMetadata.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ICustomPaymentMethodMetadata);

        /** CustomPaymentMethodMetadata key. */
        public key: string;

        /** CustomPaymentMethodMetadata value. */
        public value: string;

        /**
         * Creates a new CustomPaymentMethodMetadata instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CustomPaymentMethodMetadata instance
         */
        public static create(properties?: WASyncAction.ICustomPaymentMethodMetadata): WASyncAction.CustomPaymentMethodMetadata;

        /**
         * Encodes the specified CustomPaymentMethodMetadata message. Does not implicitly {@link WASyncAction.CustomPaymentMethodMetadata.verify|verify} messages.
         * @param message CustomPaymentMethodMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ICustomPaymentMethodMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CustomPaymentMethodMetadata message, length delimited. Does not implicitly {@link WASyncAction.CustomPaymentMethodMetadata.verify|verify} messages.
         * @param message CustomPaymentMethodMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ICustomPaymentMethodMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CustomPaymentMethodMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CustomPaymentMethodMetadata;

        /**
         * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CustomPaymentMethodMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CustomPaymentMethodMetadata;

        /**
         * Verifies a CustomPaymentMethodMetadata message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CustomPaymentMethodMetadata message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CustomPaymentMethodMetadata
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.CustomPaymentMethodMetadata;

        /**
         * Creates a plain object from a CustomPaymentMethodMetadata message. Also converts values to other types if specified.
         * @param message CustomPaymentMethodMetadata
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.CustomPaymentMethodMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CustomPaymentMethodMetadata to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CustomPaymentMethodMetadata
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PaymentInfoAction. */
    interface IPaymentInfoAction {

        /** PaymentInfoAction cpi */
        cpi?: (string|null);
    }

    /** Represents a PaymentInfoAction. */
    class PaymentInfoAction implements IPaymentInfoAction {

        /**
         * Constructs a new PaymentInfoAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPaymentInfoAction);

        /** PaymentInfoAction cpi. */
        public cpi: string;

        /**
         * Creates a new PaymentInfoAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PaymentInfoAction instance
         */
        public static create(properties?: WASyncAction.IPaymentInfoAction): WASyncAction.PaymentInfoAction;

        /**
         * Encodes the specified PaymentInfoAction message. Does not implicitly {@link WASyncAction.PaymentInfoAction.verify|verify} messages.
         * @param message PaymentInfoAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPaymentInfoAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PaymentInfoAction message, length delimited. Does not implicitly {@link WASyncAction.PaymentInfoAction.verify|verify} messages.
         * @param message PaymentInfoAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPaymentInfoAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PaymentInfoAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PaymentInfoAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PaymentInfoAction;

        /**
         * Decodes a PaymentInfoAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PaymentInfoAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PaymentInfoAction;

        /**
         * Verifies a PaymentInfoAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PaymentInfoAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PaymentInfoAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PaymentInfoAction;

        /**
         * Creates a plain object from a PaymentInfoAction message. Also converts values to other types if specified.
         * @param message PaymentInfoAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PaymentInfoAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PaymentInfoAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PaymentInfoAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LabelReorderingAction. */
    interface ILabelReorderingAction {

        /** LabelReorderingAction sortedLabelIDs */
        sortedLabelIDs?: (number[]|null);
    }

    /** Represents a LabelReorderingAction. */
    class LabelReorderingAction implements ILabelReorderingAction {

        /**
         * Constructs a new LabelReorderingAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ILabelReorderingAction);

        /** LabelReorderingAction sortedLabelIDs. */
        public sortedLabelIDs: number[];

        /**
         * Creates a new LabelReorderingAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LabelReorderingAction instance
         */
        public static create(properties?: WASyncAction.ILabelReorderingAction): WASyncAction.LabelReorderingAction;

        /**
         * Encodes the specified LabelReorderingAction message. Does not implicitly {@link WASyncAction.LabelReorderingAction.verify|verify} messages.
         * @param message LabelReorderingAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ILabelReorderingAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LabelReorderingAction message, length delimited. Does not implicitly {@link WASyncAction.LabelReorderingAction.verify|verify} messages.
         * @param message LabelReorderingAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ILabelReorderingAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LabelReorderingAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LabelReorderingAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.LabelReorderingAction;

        /**
         * Decodes a LabelReorderingAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LabelReorderingAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.LabelReorderingAction;

        /**
         * Verifies a LabelReorderingAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LabelReorderingAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LabelReorderingAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.LabelReorderingAction;

        /**
         * Creates a plain object from a LabelReorderingAction message. Also converts values to other types if specified.
         * @param message LabelReorderingAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.LabelReorderingAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LabelReorderingAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LabelReorderingAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteIndividualCallLogAction. */
    interface IDeleteIndividualCallLogAction {

        /** DeleteIndividualCallLogAction peerJID */
        peerJID?: (string|null);

        /** DeleteIndividualCallLogAction isIncoming */
        isIncoming?: (boolean|null);
    }

    /** Represents a DeleteIndividualCallLogAction. */
    class DeleteIndividualCallLogAction implements IDeleteIndividualCallLogAction {

        /**
         * Constructs a new DeleteIndividualCallLogAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IDeleteIndividualCallLogAction);

        /** DeleteIndividualCallLogAction peerJID. */
        public peerJID: string;

        /** DeleteIndividualCallLogAction isIncoming. */
        public isIncoming: boolean;

        /**
         * Creates a new DeleteIndividualCallLogAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteIndividualCallLogAction instance
         */
        public static create(properties?: WASyncAction.IDeleteIndividualCallLogAction): WASyncAction.DeleteIndividualCallLogAction;

        /**
         * Encodes the specified DeleteIndividualCallLogAction message. Does not implicitly {@link WASyncAction.DeleteIndividualCallLogAction.verify|verify} messages.
         * @param message DeleteIndividualCallLogAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IDeleteIndividualCallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteIndividualCallLogAction message, length delimited. Does not implicitly {@link WASyncAction.DeleteIndividualCallLogAction.verify|verify} messages.
         * @param message DeleteIndividualCallLogAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IDeleteIndividualCallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteIndividualCallLogAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.DeleteIndividualCallLogAction;

        /**
         * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteIndividualCallLogAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.DeleteIndividualCallLogAction;

        /**
         * Verifies a DeleteIndividualCallLogAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteIndividualCallLogAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteIndividualCallLogAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.DeleteIndividualCallLogAction;

        /**
         * Creates a plain object from a DeleteIndividualCallLogAction message. Also converts values to other types if specified.
         * @param message DeleteIndividualCallLogAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.DeleteIndividualCallLogAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteIndividualCallLogAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeleteIndividualCallLogAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BotWelcomeRequestAction. */
    interface IBotWelcomeRequestAction {

        /** BotWelcomeRequestAction isSent */
        isSent?: (boolean|null);
    }

    /** Represents a BotWelcomeRequestAction. */
    class BotWelcomeRequestAction implements IBotWelcomeRequestAction {

        /**
         * Constructs a new BotWelcomeRequestAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IBotWelcomeRequestAction);

        /** BotWelcomeRequestAction isSent. */
        public isSent: boolean;

        /**
         * Creates a new BotWelcomeRequestAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BotWelcomeRequestAction instance
         */
        public static create(properties?: WASyncAction.IBotWelcomeRequestAction): WASyncAction.BotWelcomeRequestAction;

        /**
         * Encodes the specified BotWelcomeRequestAction message. Does not implicitly {@link WASyncAction.BotWelcomeRequestAction.verify|verify} messages.
         * @param message BotWelcomeRequestAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IBotWelcomeRequestAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BotWelcomeRequestAction message, length delimited. Does not implicitly {@link WASyncAction.BotWelcomeRequestAction.verify|verify} messages.
         * @param message BotWelcomeRequestAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IBotWelcomeRequestAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BotWelcomeRequestAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BotWelcomeRequestAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.BotWelcomeRequestAction;

        /**
         * Decodes a BotWelcomeRequestAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BotWelcomeRequestAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.BotWelcomeRequestAction;

        /**
         * Verifies a BotWelcomeRequestAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BotWelcomeRequestAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BotWelcomeRequestAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.BotWelcomeRequestAction;

        /**
         * Creates a plain object from a BotWelcomeRequestAction message. Also converts values to other types if specified.
         * @param message BotWelcomeRequestAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.BotWelcomeRequestAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BotWelcomeRequestAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BotWelcomeRequestAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CallLogAction. */
    interface ICallLogAction {

        /** CallLogAction callLogRecord */
        callLogRecord?: (WASyncAction.ICallLogRecord|null);
    }

    /** Represents a CallLogAction. */
    class CallLogAction implements ICallLogAction {

        /**
         * Constructs a new CallLogAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ICallLogAction);

        /** CallLogAction callLogRecord. */
        public callLogRecord?: (WASyncAction.ICallLogRecord|null);

        /**
         * Creates a new CallLogAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallLogAction instance
         */
        public static create(properties?: WASyncAction.ICallLogAction): WASyncAction.CallLogAction;

        /**
         * Encodes the specified CallLogAction message. Does not implicitly {@link WASyncAction.CallLogAction.verify|verify} messages.
         * @param message CallLogAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ICallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallLogAction message, length delimited. Does not implicitly {@link WASyncAction.CallLogAction.verify|verify} messages.
         * @param message CallLogAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ICallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallLogAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallLogAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.CallLogAction;

        /**
         * Decodes a CallLogAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallLogAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.CallLogAction;

        /**
         * Verifies a CallLogAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallLogAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallLogAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.CallLogAction;

        /**
         * Creates a plain object from a CallLogAction message. Also converts values to other types if specified.
         * @param message CallLogAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.CallLogAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallLogAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CallLogAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PrivacySettingRelayAllCalls. */
    interface IPrivacySettingRelayAllCalls {

        /** PrivacySettingRelayAllCalls isEnabled */
        isEnabled?: (boolean|null);
    }

    /** Represents a PrivacySettingRelayAllCalls. */
    class PrivacySettingRelayAllCalls implements IPrivacySettingRelayAllCalls {

        /**
         * Constructs a new PrivacySettingRelayAllCalls.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPrivacySettingRelayAllCalls);

        /** PrivacySettingRelayAllCalls isEnabled. */
        public isEnabled: boolean;

        /**
         * Creates a new PrivacySettingRelayAllCalls instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PrivacySettingRelayAllCalls instance
         */
        public static create(properties?: WASyncAction.IPrivacySettingRelayAllCalls): WASyncAction.PrivacySettingRelayAllCalls;

        /**
         * Encodes the specified PrivacySettingRelayAllCalls message. Does not implicitly {@link WASyncAction.PrivacySettingRelayAllCalls.verify|verify} messages.
         * @param message PrivacySettingRelayAllCalls message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPrivacySettingRelayAllCalls, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PrivacySettingRelayAllCalls message, length delimited. Does not implicitly {@link WASyncAction.PrivacySettingRelayAllCalls.verify|verify} messages.
         * @param message PrivacySettingRelayAllCalls message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPrivacySettingRelayAllCalls, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PrivacySettingRelayAllCalls
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PrivacySettingRelayAllCalls;

        /**
         * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PrivacySettingRelayAllCalls
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PrivacySettingRelayAllCalls;

        /**
         * Verifies a PrivacySettingRelayAllCalls message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PrivacySettingRelayAllCalls message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PrivacySettingRelayAllCalls
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PrivacySettingRelayAllCalls;

        /**
         * Creates a plain object from a PrivacySettingRelayAllCalls message. Also converts values to other types if specified.
         * @param message PrivacySettingRelayAllCalls
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PrivacySettingRelayAllCalls, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PrivacySettingRelayAllCalls to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PrivacySettingRelayAllCalls
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExternalWebBetaAction. */
    interface IExternalWebBetaAction {

        /** ExternalWebBetaAction isOptIn */
        isOptIn?: (boolean|null);
    }

    /** Represents an ExternalWebBetaAction. */
    class ExternalWebBetaAction implements IExternalWebBetaAction {

        /**
         * Constructs a new ExternalWebBetaAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IExternalWebBetaAction);

        /** ExternalWebBetaAction isOptIn. */
        public isOptIn: boolean;

        /**
         * Creates a new ExternalWebBetaAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExternalWebBetaAction instance
         */
        public static create(properties?: WASyncAction.IExternalWebBetaAction): WASyncAction.ExternalWebBetaAction;

        /**
         * Encodes the specified ExternalWebBetaAction message. Does not implicitly {@link WASyncAction.ExternalWebBetaAction.verify|verify} messages.
         * @param message ExternalWebBetaAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IExternalWebBetaAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExternalWebBetaAction message, length delimited. Does not implicitly {@link WASyncAction.ExternalWebBetaAction.verify|verify} messages.
         * @param message ExternalWebBetaAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IExternalWebBetaAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExternalWebBetaAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExternalWebBetaAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ExternalWebBetaAction;

        /**
         * Decodes an ExternalWebBetaAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExternalWebBetaAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ExternalWebBetaAction;

        /**
         * Verifies an ExternalWebBetaAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExternalWebBetaAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExternalWebBetaAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ExternalWebBetaAction;

        /**
         * Creates a plain object from an ExternalWebBetaAction message. Also converts values to other types if specified.
         * @param message ExternalWebBetaAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ExternalWebBetaAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExternalWebBetaAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExternalWebBetaAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MarketingMessageBroadcastAction. */
    interface IMarketingMessageBroadcastAction {

        /** MarketingMessageBroadcastAction repliedCount */
        repliedCount?: (number|null);
    }

    /** Represents a MarketingMessageBroadcastAction. */
    class MarketingMessageBroadcastAction implements IMarketingMessageBroadcastAction {

        /**
         * Constructs a new MarketingMessageBroadcastAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IMarketingMessageBroadcastAction);

        /** MarketingMessageBroadcastAction repliedCount. */
        public repliedCount: number;

        /**
         * Creates a new MarketingMessageBroadcastAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarketingMessageBroadcastAction instance
         */
        public static create(properties?: WASyncAction.IMarketingMessageBroadcastAction): WASyncAction.MarketingMessageBroadcastAction;

        /**
         * Encodes the specified MarketingMessageBroadcastAction message. Does not implicitly {@link WASyncAction.MarketingMessageBroadcastAction.verify|verify} messages.
         * @param message MarketingMessageBroadcastAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IMarketingMessageBroadcastAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarketingMessageBroadcastAction message, length delimited. Does not implicitly {@link WASyncAction.MarketingMessageBroadcastAction.verify|verify} messages.
         * @param message MarketingMessageBroadcastAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IMarketingMessageBroadcastAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarketingMessageBroadcastAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.MarketingMessageBroadcastAction;

        /**
         * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarketingMessageBroadcastAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.MarketingMessageBroadcastAction;

        /**
         * Verifies a MarketingMessageBroadcastAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarketingMessageBroadcastAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarketingMessageBroadcastAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.MarketingMessageBroadcastAction;

        /**
         * Creates a plain object from a MarketingMessageBroadcastAction message. Also converts values to other types if specified.
         * @param message MarketingMessageBroadcastAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.MarketingMessageBroadcastAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarketingMessageBroadcastAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MarketingMessageBroadcastAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PnForLidChatAction. */
    interface IPnForLidChatAction {

        /** PnForLidChatAction pnJID */
        pnJID?: (string|null);
    }

    /** Represents a PnForLidChatAction. */
    class PnForLidChatAction implements IPnForLidChatAction {

        /**
         * Constructs a new PnForLidChatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPnForLidChatAction);

        /** PnForLidChatAction pnJID. */
        public pnJID: string;

        /**
         * Creates a new PnForLidChatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PnForLidChatAction instance
         */
        public static create(properties?: WASyncAction.IPnForLidChatAction): WASyncAction.PnForLidChatAction;

        /**
         * Encodes the specified PnForLidChatAction message. Does not implicitly {@link WASyncAction.PnForLidChatAction.verify|verify} messages.
         * @param message PnForLidChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPnForLidChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PnForLidChatAction message, length delimited. Does not implicitly {@link WASyncAction.PnForLidChatAction.verify|verify} messages.
         * @param message PnForLidChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPnForLidChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PnForLidChatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PnForLidChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PnForLidChatAction;

        /**
         * Decodes a PnForLidChatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PnForLidChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PnForLidChatAction;

        /**
         * Verifies a PnForLidChatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PnForLidChatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PnForLidChatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PnForLidChatAction;

        /**
         * Creates a plain object from a PnForLidChatAction message. Also converts values to other types if specified.
         * @param message PnForLidChatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PnForLidChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PnForLidChatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PnForLidChatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatAssignmentOpenedStatusAction. */
    interface IChatAssignmentOpenedStatusAction {

        /** ChatAssignmentOpenedStatusAction chatOpened */
        chatOpened?: (boolean|null);
    }

    /** Represents a ChatAssignmentOpenedStatusAction. */
    class ChatAssignmentOpenedStatusAction implements IChatAssignmentOpenedStatusAction {

        /**
         * Constructs a new ChatAssignmentOpenedStatusAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IChatAssignmentOpenedStatusAction);

        /** ChatAssignmentOpenedStatusAction chatOpened. */
        public chatOpened: boolean;

        /**
         * Creates a new ChatAssignmentOpenedStatusAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatAssignmentOpenedStatusAction instance
         */
        public static create(properties?: WASyncAction.IChatAssignmentOpenedStatusAction): WASyncAction.ChatAssignmentOpenedStatusAction;

        /**
         * Encodes the specified ChatAssignmentOpenedStatusAction message. Does not implicitly {@link WASyncAction.ChatAssignmentOpenedStatusAction.verify|verify} messages.
         * @param message ChatAssignmentOpenedStatusAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IChatAssignmentOpenedStatusAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatAssignmentOpenedStatusAction message, length delimited. Does not implicitly {@link WASyncAction.ChatAssignmentOpenedStatusAction.verify|verify} messages.
         * @param message ChatAssignmentOpenedStatusAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IChatAssignmentOpenedStatusAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatAssignmentOpenedStatusAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ChatAssignmentOpenedStatusAction;

        /**
         * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatAssignmentOpenedStatusAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ChatAssignmentOpenedStatusAction;

        /**
         * Verifies a ChatAssignmentOpenedStatusAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatAssignmentOpenedStatusAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatAssignmentOpenedStatusAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ChatAssignmentOpenedStatusAction;

        /**
         * Creates a plain object from a ChatAssignmentOpenedStatusAction message. Also converts values to other types if specified.
         * @param message ChatAssignmentOpenedStatusAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ChatAssignmentOpenedStatusAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatAssignmentOpenedStatusAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatAssignmentOpenedStatusAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatAssignmentAction. */
    interface IChatAssignmentAction {

        /** ChatAssignmentAction deviceAgentID */
        deviceAgentID?: (string|null);
    }

    /** Represents a ChatAssignmentAction. */
    class ChatAssignmentAction implements IChatAssignmentAction {

        /**
         * Constructs a new ChatAssignmentAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IChatAssignmentAction);

        /** ChatAssignmentAction deviceAgentID. */
        public deviceAgentID: string;

        /**
         * Creates a new ChatAssignmentAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatAssignmentAction instance
         */
        public static create(properties?: WASyncAction.IChatAssignmentAction): WASyncAction.ChatAssignmentAction;

        /**
         * Encodes the specified ChatAssignmentAction message. Does not implicitly {@link WASyncAction.ChatAssignmentAction.verify|verify} messages.
         * @param message ChatAssignmentAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IChatAssignmentAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatAssignmentAction message, length delimited. Does not implicitly {@link WASyncAction.ChatAssignmentAction.verify|verify} messages.
         * @param message ChatAssignmentAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IChatAssignmentAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatAssignmentAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatAssignmentAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ChatAssignmentAction;

        /**
         * Decodes a ChatAssignmentAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatAssignmentAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ChatAssignmentAction;

        /**
         * Verifies a ChatAssignmentAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatAssignmentAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatAssignmentAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ChatAssignmentAction;

        /**
         * Creates a plain object from a ChatAssignmentAction message. Also converts values to other types if specified.
         * @param message ChatAssignmentAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ChatAssignmentAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatAssignmentAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatAssignmentAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a StickerAction. */
    interface IStickerAction {

        /** StickerAction URL */
        URL?: (string|null);

        /** StickerAction fileEncSHA256 */
        fileEncSHA256?: (Uint8Array|null);

        /** StickerAction mediaKey */
        mediaKey?: (Uint8Array|null);

        /** StickerAction mimetype */
        mimetype?: (string|null);

        /** StickerAction height */
        height?: (number|null);

        /** StickerAction width */
        width?: (number|null);

        /** StickerAction directPath */
        directPath?: (string|null);

        /** StickerAction fileLength */
        fileLength?: (number|Long|null);

        /** StickerAction isFavorite */
        isFavorite?: (boolean|null);

        /** StickerAction deviceIDHint */
        deviceIDHint?: (number|null);

        /** StickerAction isLottie */
        isLottie?: (boolean|null);
    }

    /** Represents a StickerAction. */
    class StickerAction implements IStickerAction {

        /**
         * Constructs a new StickerAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IStickerAction);

        /** StickerAction URL. */
        public URL: string;

        /** StickerAction fileEncSHA256. */
        public fileEncSHA256: Uint8Array;

        /** StickerAction mediaKey. */
        public mediaKey: Uint8Array;

        /** StickerAction mimetype. */
        public mimetype: string;

        /** StickerAction height. */
        public height: number;

        /** StickerAction width. */
        public width: number;

        /** StickerAction directPath. */
        public directPath: string;

        /** StickerAction fileLength. */
        public fileLength: (number|Long);

        /** StickerAction isFavorite. */
        public isFavorite: boolean;

        /** StickerAction deviceIDHint. */
        public deviceIDHint: number;

        /** StickerAction isLottie. */
        public isLottie: boolean;

        /**
         * Creates a new StickerAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StickerAction instance
         */
        public static create(properties?: WASyncAction.IStickerAction): WASyncAction.StickerAction;

        /**
         * Encodes the specified StickerAction message. Does not implicitly {@link WASyncAction.StickerAction.verify|verify} messages.
         * @param message StickerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StickerAction message, length delimited. Does not implicitly {@link WASyncAction.StickerAction.verify|verify} messages.
         * @param message StickerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StickerAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StickerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.StickerAction;

        /**
         * Decodes a StickerAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StickerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.StickerAction;

        /**
         * Verifies a StickerAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StickerAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StickerAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.StickerAction;

        /**
         * Creates a plain object from a StickerAction message. Also converts values to other types if specified.
         * @param message StickerAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.StickerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StickerAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StickerAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RemoveRecentStickerAction. */
    interface IRemoveRecentStickerAction {

        /** RemoveRecentStickerAction lastStickerSentTS */
        lastStickerSentTS?: (number|Long|null);
    }

    /** Represents a RemoveRecentStickerAction. */
    class RemoveRecentStickerAction implements IRemoveRecentStickerAction {

        /**
         * Constructs a new RemoveRecentStickerAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IRemoveRecentStickerAction);

        /** RemoveRecentStickerAction lastStickerSentTS. */
        public lastStickerSentTS: (number|Long);

        /**
         * Creates a new RemoveRecentStickerAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveRecentStickerAction instance
         */
        public static create(properties?: WASyncAction.IRemoveRecentStickerAction): WASyncAction.RemoveRecentStickerAction;

        /**
         * Encodes the specified RemoveRecentStickerAction message. Does not implicitly {@link WASyncAction.RemoveRecentStickerAction.verify|verify} messages.
         * @param message RemoveRecentStickerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IRemoveRecentStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveRecentStickerAction message, length delimited. Does not implicitly {@link WASyncAction.RemoveRecentStickerAction.verify|verify} messages.
         * @param message RemoveRecentStickerAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IRemoveRecentStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveRecentStickerAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveRecentStickerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.RemoveRecentStickerAction;

        /**
         * Decodes a RemoveRecentStickerAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveRecentStickerAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.RemoveRecentStickerAction;

        /**
         * Verifies a RemoveRecentStickerAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveRecentStickerAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveRecentStickerAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.RemoveRecentStickerAction;

        /**
         * Creates a plain object from a RemoveRecentStickerAction message. Also converts values to other types if specified.
         * @param message RemoveRecentStickerAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.RemoveRecentStickerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveRecentStickerAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RemoveRecentStickerAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PrimaryVersionAction. */
    interface IPrimaryVersionAction {

        /** PrimaryVersionAction version */
        version?: (string|null);
    }

    /** Represents a PrimaryVersionAction. */
    class PrimaryVersionAction implements IPrimaryVersionAction {

        /**
         * Constructs a new PrimaryVersionAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPrimaryVersionAction);

        /** PrimaryVersionAction version. */
        public version: string;

        /**
         * Creates a new PrimaryVersionAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PrimaryVersionAction instance
         */
        public static create(properties?: WASyncAction.IPrimaryVersionAction): WASyncAction.PrimaryVersionAction;

        /**
         * Encodes the specified PrimaryVersionAction message. Does not implicitly {@link WASyncAction.PrimaryVersionAction.verify|verify} messages.
         * @param message PrimaryVersionAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPrimaryVersionAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PrimaryVersionAction message, length delimited. Does not implicitly {@link WASyncAction.PrimaryVersionAction.verify|verify} messages.
         * @param message PrimaryVersionAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPrimaryVersionAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PrimaryVersionAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PrimaryVersionAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PrimaryVersionAction;

        /**
         * Decodes a PrimaryVersionAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PrimaryVersionAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PrimaryVersionAction;

        /**
         * Verifies a PrimaryVersionAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PrimaryVersionAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PrimaryVersionAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PrimaryVersionAction;

        /**
         * Creates a plain object from a PrimaryVersionAction message. Also converts values to other types if specified.
         * @param message PrimaryVersionAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PrimaryVersionAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PrimaryVersionAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PrimaryVersionAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NuxAction. */
    interface INuxAction {

        /** NuxAction acknowledged */
        acknowledged?: (boolean|null);
    }

    /** Represents a NuxAction. */
    class NuxAction implements INuxAction {

        /**
         * Constructs a new NuxAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.INuxAction);

        /** NuxAction acknowledged. */
        public acknowledged: boolean;

        /**
         * Creates a new NuxAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NuxAction instance
         */
        public static create(properties?: WASyncAction.INuxAction): WASyncAction.NuxAction;

        /**
         * Encodes the specified NuxAction message. Does not implicitly {@link WASyncAction.NuxAction.verify|verify} messages.
         * @param message NuxAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.INuxAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NuxAction message, length delimited. Does not implicitly {@link WASyncAction.NuxAction.verify|verify} messages.
         * @param message NuxAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.INuxAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NuxAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NuxAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.NuxAction;

        /**
         * Decodes a NuxAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NuxAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.NuxAction;

        /**
         * Verifies a NuxAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NuxAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NuxAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.NuxAction;

        /**
         * Creates a plain object from a NuxAction message. Also converts values to other types if specified.
         * @param message NuxAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.NuxAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NuxAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NuxAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TimeFormatAction. */
    interface ITimeFormatAction {

        /** TimeFormatAction isTwentyFourHourFormatEnabled */
        isTwentyFourHourFormatEnabled?: (boolean|null);
    }

    /** Represents a TimeFormatAction. */
    class TimeFormatAction implements ITimeFormatAction {

        /**
         * Constructs a new TimeFormatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ITimeFormatAction);

        /** TimeFormatAction isTwentyFourHourFormatEnabled. */
        public isTwentyFourHourFormatEnabled: boolean;

        /**
         * Creates a new TimeFormatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TimeFormatAction instance
         */
        public static create(properties?: WASyncAction.ITimeFormatAction): WASyncAction.TimeFormatAction;

        /**
         * Encodes the specified TimeFormatAction message. Does not implicitly {@link WASyncAction.TimeFormatAction.verify|verify} messages.
         * @param message TimeFormatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ITimeFormatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TimeFormatAction message, length delimited. Does not implicitly {@link WASyncAction.TimeFormatAction.verify|verify} messages.
         * @param message TimeFormatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ITimeFormatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TimeFormatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TimeFormatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.TimeFormatAction;

        /**
         * Decodes a TimeFormatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TimeFormatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.TimeFormatAction;

        /**
         * Verifies a TimeFormatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TimeFormatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TimeFormatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.TimeFormatAction;

        /**
         * Creates a plain object from a TimeFormatAction message. Also converts values to other types if specified.
         * @param message TimeFormatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.TimeFormatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TimeFormatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TimeFormatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserStatusMuteAction. */
    interface IUserStatusMuteAction {

        /** UserStatusMuteAction muted */
        muted?: (boolean|null);
    }

    /** Represents a UserStatusMuteAction. */
    class UserStatusMuteAction implements IUserStatusMuteAction {

        /**
         * Constructs a new UserStatusMuteAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IUserStatusMuteAction);

        /** UserStatusMuteAction muted. */
        public muted: boolean;

        /**
         * Creates a new UserStatusMuteAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserStatusMuteAction instance
         */
        public static create(properties?: WASyncAction.IUserStatusMuteAction): WASyncAction.UserStatusMuteAction;

        /**
         * Encodes the specified UserStatusMuteAction message. Does not implicitly {@link WASyncAction.UserStatusMuteAction.verify|verify} messages.
         * @param message UserStatusMuteAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IUserStatusMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserStatusMuteAction message, length delimited. Does not implicitly {@link WASyncAction.UserStatusMuteAction.verify|verify} messages.
         * @param message UserStatusMuteAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IUserStatusMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserStatusMuteAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserStatusMuteAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.UserStatusMuteAction;

        /**
         * Decodes a UserStatusMuteAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserStatusMuteAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.UserStatusMuteAction;

        /**
         * Verifies a UserStatusMuteAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserStatusMuteAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserStatusMuteAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.UserStatusMuteAction;

        /**
         * Creates a plain object from a UserStatusMuteAction message. Also converts values to other types if specified.
         * @param message UserStatusMuteAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.UserStatusMuteAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserStatusMuteAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserStatusMuteAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SubscriptionAction. */
    interface ISubscriptionAction {

        /** SubscriptionAction isDeactivated */
        isDeactivated?: (boolean|null);

        /** SubscriptionAction isAutoRenewing */
        isAutoRenewing?: (boolean|null);

        /** SubscriptionAction expirationDate */
        expirationDate?: (number|Long|null);
    }

    /** Represents a SubscriptionAction. */
    class SubscriptionAction implements ISubscriptionAction {

        /**
         * Constructs a new SubscriptionAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISubscriptionAction);

        /** SubscriptionAction isDeactivated. */
        public isDeactivated: boolean;

        /** SubscriptionAction isAutoRenewing. */
        public isAutoRenewing: boolean;

        /** SubscriptionAction expirationDate. */
        public expirationDate: (number|Long);

        /**
         * Creates a new SubscriptionAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubscriptionAction instance
         */
        public static create(properties?: WASyncAction.ISubscriptionAction): WASyncAction.SubscriptionAction;

        /**
         * Encodes the specified SubscriptionAction message. Does not implicitly {@link WASyncAction.SubscriptionAction.verify|verify} messages.
         * @param message SubscriptionAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISubscriptionAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubscriptionAction message, length delimited. Does not implicitly {@link WASyncAction.SubscriptionAction.verify|verify} messages.
         * @param message SubscriptionAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISubscriptionAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubscriptionAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubscriptionAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SubscriptionAction;

        /**
         * Decodes a SubscriptionAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubscriptionAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SubscriptionAction;

        /**
         * Verifies a SubscriptionAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubscriptionAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubscriptionAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SubscriptionAction;

        /**
         * Creates a plain object from a SubscriptionAction message. Also converts values to other types if specified.
         * @param message SubscriptionAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SubscriptionAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubscriptionAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SubscriptionAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AgentAction. */
    interface IAgentAction {

        /** AgentAction name */
        name?: (string|null);

        /** AgentAction deviceID */
        deviceID?: (number|null);

        /** AgentAction isDeleted */
        isDeleted?: (boolean|null);
    }

    /** Represents an AgentAction. */
    class AgentAction implements IAgentAction {

        /**
         * Constructs a new AgentAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IAgentAction);

        /** AgentAction name. */
        public name: string;

        /** AgentAction deviceID. */
        public deviceID: number;

        /** AgentAction isDeleted. */
        public isDeleted: boolean;

        /**
         * Creates a new AgentAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AgentAction instance
         */
        public static create(properties?: WASyncAction.IAgentAction): WASyncAction.AgentAction;

        /**
         * Encodes the specified AgentAction message. Does not implicitly {@link WASyncAction.AgentAction.verify|verify} messages.
         * @param message AgentAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IAgentAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AgentAction message, length delimited. Does not implicitly {@link WASyncAction.AgentAction.verify|verify} messages.
         * @param message AgentAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IAgentAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AgentAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AgentAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.AgentAction;

        /**
         * Decodes an AgentAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AgentAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.AgentAction;

        /**
         * Verifies an AgentAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AgentAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AgentAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.AgentAction;

        /**
         * Creates a plain object from an AgentAction message. Also converts values to other types if specified.
         * @param message AgentAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.AgentAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AgentAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AgentAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AndroidUnsupportedActions. */
    interface IAndroidUnsupportedActions {

        /** AndroidUnsupportedActions allowed */
        allowed?: (boolean|null);
    }

    /** Represents an AndroidUnsupportedActions. */
    class AndroidUnsupportedActions implements IAndroidUnsupportedActions {

        /**
         * Constructs a new AndroidUnsupportedActions.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IAndroidUnsupportedActions);

        /** AndroidUnsupportedActions allowed. */
        public allowed: boolean;

        /**
         * Creates a new AndroidUnsupportedActions instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AndroidUnsupportedActions instance
         */
        public static create(properties?: WASyncAction.IAndroidUnsupportedActions): WASyncAction.AndroidUnsupportedActions;

        /**
         * Encodes the specified AndroidUnsupportedActions message. Does not implicitly {@link WASyncAction.AndroidUnsupportedActions.verify|verify} messages.
         * @param message AndroidUnsupportedActions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IAndroidUnsupportedActions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AndroidUnsupportedActions message, length delimited. Does not implicitly {@link WASyncAction.AndroidUnsupportedActions.verify|verify} messages.
         * @param message AndroidUnsupportedActions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IAndroidUnsupportedActions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AndroidUnsupportedActions message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AndroidUnsupportedActions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.AndroidUnsupportedActions;

        /**
         * Decodes an AndroidUnsupportedActions message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AndroidUnsupportedActions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.AndroidUnsupportedActions;

        /**
         * Verifies an AndroidUnsupportedActions message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AndroidUnsupportedActions message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AndroidUnsupportedActions
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.AndroidUnsupportedActions;

        /**
         * Creates a plain object from an AndroidUnsupportedActions message. Also converts values to other types if specified.
         * @param message AndroidUnsupportedActions
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.AndroidUnsupportedActions, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AndroidUnsupportedActions to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AndroidUnsupportedActions
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PrimaryFeature. */
    interface IPrimaryFeature {

        /** PrimaryFeature flags */
        flags?: (string[]|null);
    }

    /** Represents a PrimaryFeature. */
    class PrimaryFeature implements IPrimaryFeature {

        /**
         * Constructs a new PrimaryFeature.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPrimaryFeature);

        /** PrimaryFeature flags. */
        public flags: string[];

        /**
         * Creates a new PrimaryFeature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PrimaryFeature instance
         */
        public static create(properties?: WASyncAction.IPrimaryFeature): WASyncAction.PrimaryFeature;

        /**
         * Encodes the specified PrimaryFeature message. Does not implicitly {@link WASyncAction.PrimaryFeature.verify|verify} messages.
         * @param message PrimaryFeature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPrimaryFeature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PrimaryFeature message, length delimited. Does not implicitly {@link WASyncAction.PrimaryFeature.verify|verify} messages.
         * @param message PrimaryFeature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPrimaryFeature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PrimaryFeature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PrimaryFeature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PrimaryFeature;

        /**
         * Decodes a PrimaryFeature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PrimaryFeature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PrimaryFeature;

        /**
         * Verifies a PrimaryFeature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PrimaryFeature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PrimaryFeature
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PrimaryFeature;

        /**
         * Creates a plain object from a PrimaryFeature message. Also converts values to other types if specified.
         * @param message PrimaryFeature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PrimaryFeature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PrimaryFeature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PrimaryFeature
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a KeyExpiration. */
    interface IKeyExpiration {

        /** KeyExpiration expiredKeyEpoch */
        expiredKeyEpoch?: (number|null);
    }

    /** Represents a KeyExpiration. */
    class KeyExpiration implements IKeyExpiration {

        /**
         * Constructs a new KeyExpiration.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IKeyExpiration);

        /** KeyExpiration expiredKeyEpoch. */
        public expiredKeyEpoch: number;

        /**
         * Creates a new KeyExpiration instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KeyExpiration instance
         */
        public static create(properties?: WASyncAction.IKeyExpiration): WASyncAction.KeyExpiration;

        /**
         * Encodes the specified KeyExpiration message. Does not implicitly {@link WASyncAction.KeyExpiration.verify|verify} messages.
         * @param message KeyExpiration message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IKeyExpiration, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KeyExpiration message, length delimited. Does not implicitly {@link WASyncAction.KeyExpiration.verify|verify} messages.
         * @param message KeyExpiration message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IKeyExpiration, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KeyExpiration message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KeyExpiration
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.KeyExpiration;

        /**
         * Decodes a KeyExpiration message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KeyExpiration
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.KeyExpiration;

        /**
         * Verifies a KeyExpiration message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KeyExpiration message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KeyExpiration
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.KeyExpiration;

        /**
         * Creates a plain object from a KeyExpiration message. Also converts values to other types if specified.
         * @param message KeyExpiration
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.KeyExpiration, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KeyExpiration to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for KeyExpiration
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncActionMessage. */
    interface ISyncActionMessage {

        /** SyncActionMessage key */
        key?: (WAProtocol.IMessageKey|null);

        /** SyncActionMessage timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a SyncActionMessage. */
    class SyncActionMessage implements ISyncActionMessage {

        /**
         * Constructs a new SyncActionMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISyncActionMessage);

        /** SyncActionMessage key. */
        public key?: (WAProtocol.IMessageKey|null);

        /** SyncActionMessage timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new SyncActionMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionMessage instance
         */
        public static create(properties?: WASyncAction.ISyncActionMessage): WASyncAction.SyncActionMessage;

        /**
         * Encodes the specified SyncActionMessage message. Does not implicitly {@link WASyncAction.SyncActionMessage.verify|verify} messages.
         * @param message SyncActionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISyncActionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionMessage message, length delimited. Does not implicitly {@link WASyncAction.SyncActionMessage.verify|verify} messages.
         * @param message SyncActionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISyncActionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SyncActionMessage;

        /**
         * Decodes a SyncActionMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SyncActionMessage;

        /**
         * Verifies a SyncActionMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncActionMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncActionMessage
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SyncActionMessage;

        /**
         * Creates a plain object from a SyncActionMessage message. Also converts values to other types if specified.
         * @param message SyncActionMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SyncActionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncActionMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncActionMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncActionMessageRange. */
    interface ISyncActionMessageRange {

        /** SyncActionMessageRange lastMessageTimestamp */
        lastMessageTimestamp?: (number|Long|null);

        /** SyncActionMessageRange lastSystemMessageTimestamp */
        lastSystemMessageTimestamp?: (number|Long|null);

        /** SyncActionMessageRange messages */
        messages?: (WASyncAction.ISyncActionMessage[]|null);
    }

    /** Represents a SyncActionMessageRange. */
    class SyncActionMessageRange implements ISyncActionMessageRange {

        /**
         * Constructs a new SyncActionMessageRange.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISyncActionMessageRange);

        /** SyncActionMessageRange lastMessageTimestamp. */
        public lastMessageTimestamp: (number|Long);

        /** SyncActionMessageRange lastSystemMessageTimestamp. */
        public lastSystemMessageTimestamp: (number|Long);

        /** SyncActionMessageRange messages. */
        public messages: WASyncAction.ISyncActionMessage[];

        /**
         * Creates a new SyncActionMessageRange instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionMessageRange instance
         */
        public static create(properties?: WASyncAction.ISyncActionMessageRange): WASyncAction.SyncActionMessageRange;

        /**
         * Encodes the specified SyncActionMessageRange message. Does not implicitly {@link WASyncAction.SyncActionMessageRange.verify|verify} messages.
         * @param message SyncActionMessageRange message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISyncActionMessageRange, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionMessageRange message, length delimited. Does not implicitly {@link WASyncAction.SyncActionMessageRange.verify|verify} messages.
         * @param message SyncActionMessageRange message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISyncActionMessageRange, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionMessageRange message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionMessageRange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SyncActionMessageRange;

        /**
         * Decodes a SyncActionMessageRange message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionMessageRange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SyncActionMessageRange;

        /**
         * Verifies a SyncActionMessageRange message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncActionMessageRange message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncActionMessageRange
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SyncActionMessageRange;

        /**
         * Creates a plain object from a SyncActionMessageRange message. Also converts values to other types if specified.
         * @param message SyncActionMessageRange
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SyncActionMessageRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncActionMessageRange to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncActionMessageRange
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UnarchiveChatsSetting. */
    interface IUnarchiveChatsSetting {

        /** UnarchiveChatsSetting unarchiveChats */
        unarchiveChats?: (boolean|null);
    }

    /** Represents an UnarchiveChatsSetting. */
    class UnarchiveChatsSetting implements IUnarchiveChatsSetting {

        /**
         * Constructs a new UnarchiveChatsSetting.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IUnarchiveChatsSetting);

        /** UnarchiveChatsSetting unarchiveChats. */
        public unarchiveChats: boolean;

        /**
         * Creates a new UnarchiveChatsSetting instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UnarchiveChatsSetting instance
         */
        public static create(properties?: WASyncAction.IUnarchiveChatsSetting): WASyncAction.UnarchiveChatsSetting;

        /**
         * Encodes the specified UnarchiveChatsSetting message. Does not implicitly {@link WASyncAction.UnarchiveChatsSetting.verify|verify} messages.
         * @param message UnarchiveChatsSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IUnarchiveChatsSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UnarchiveChatsSetting message, length delimited. Does not implicitly {@link WASyncAction.UnarchiveChatsSetting.verify|verify} messages.
         * @param message UnarchiveChatsSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IUnarchiveChatsSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UnarchiveChatsSetting message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UnarchiveChatsSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.UnarchiveChatsSetting;

        /**
         * Decodes an UnarchiveChatsSetting message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UnarchiveChatsSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.UnarchiveChatsSetting;

        /**
         * Verifies an UnarchiveChatsSetting message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UnarchiveChatsSetting message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UnarchiveChatsSetting
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.UnarchiveChatsSetting;

        /**
         * Creates a plain object from an UnarchiveChatsSetting message. Also converts values to other types if specified.
         * @param message UnarchiveChatsSetting
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.UnarchiveChatsSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UnarchiveChatsSetting to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UnarchiveChatsSetting
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteChatAction. */
    interface IDeleteChatAction {

        /** DeleteChatAction messageRange */
        messageRange?: (WASyncAction.ISyncActionMessageRange|null);
    }

    /** Represents a DeleteChatAction. */
    class DeleteChatAction implements IDeleteChatAction {

        /**
         * Constructs a new DeleteChatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IDeleteChatAction);

        /** DeleteChatAction messageRange. */
        public messageRange?: (WASyncAction.ISyncActionMessageRange|null);

        /**
         * Creates a new DeleteChatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteChatAction instance
         */
        public static create(properties?: WASyncAction.IDeleteChatAction): WASyncAction.DeleteChatAction;

        /**
         * Encodes the specified DeleteChatAction message. Does not implicitly {@link WASyncAction.DeleteChatAction.verify|verify} messages.
         * @param message DeleteChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IDeleteChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteChatAction message, length delimited. Does not implicitly {@link WASyncAction.DeleteChatAction.verify|verify} messages.
         * @param message DeleteChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IDeleteChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteChatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.DeleteChatAction;

        /**
         * Decodes a DeleteChatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.DeleteChatAction;

        /**
         * Verifies a DeleteChatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteChatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteChatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.DeleteChatAction;

        /**
         * Creates a plain object from a DeleteChatAction message. Also converts values to other types if specified.
         * @param message DeleteChatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.DeleteChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteChatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeleteChatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ClearChatAction. */
    interface IClearChatAction {

        /** ClearChatAction messageRange */
        messageRange?: (WASyncAction.ISyncActionMessageRange|null);
    }

    /** Represents a ClearChatAction. */
    class ClearChatAction implements IClearChatAction {

        /**
         * Constructs a new ClearChatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IClearChatAction);

        /** ClearChatAction messageRange. */
        public messageRange?: (WASyncAction.ISyncActionMessageRange|null);

        /**
         * Creates a new ClearChatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClearChatAction instance
         */
        public static create(properties?: WASyncAction.IClearChatAction): WASyncAction.ClearChatAction;

        /**
         * Encodes the specified ClearChatAction message. Does not implicitly {@link WASyncAction.ClearChatAction.verify|verify} messages.
         * @param message ClearChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IClearChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClearChatAction message, length delimited. Does not implicitly {@link WASyncAction.ClearChatAction.verify|verify} messages.
         * @param message ClearChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IClearChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClearChatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClearChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ClearChatAction;

        /**
         * Decodes a ClearChatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClearChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ClearChatAction;

        /**
         * Verifies a ClearChatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClearChatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClearChatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ClearChatAction;

        /**
         * Creates a plain object from a ClearChatAction message. Also converts values to other types if specified.
         * @param message ClearChatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ClearChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClearChatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClearChatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MarkChatAsReadAction. */
    interface IMarkChatAsReadAction {

        /** MarkChatAsReadAction read */
        read?: (boolean|null);

        /** MarkChatAsReadAction messageRange */
        messageRange?: (WASyncAction.ISyncActionMessageRange|null);
    }

    /** Represents a MarkChatAsReadAction. */
    class MarkChatAsReadAction implements IMarkChatAsReadAction {

        /**
         * Constructs a new MarkChatAsReadAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IMarkChatAsReadAction);

        /** MarkChatAsReadAction read. */
        public read: boolean;

        /** MarkChatAsReadAction messageRange. */
        public messageRange?: (WASyncAction.ISyncActionMessageRange|null);

        /**
         * Creates a new MarkChatAsReadAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MarkChatAsReadAction instance
         */
        public static create(properties?: WASyncAction.IMarkChatAsReadAction): WASyncAction.MarkChatAsReadAction;

        /**
         * Encodes the specified MarkChatAsReadAction message. Does not implicitly {@link WASyncAction.MarkChatAsReadAction.verify|verify} messages.
         * @param message MarkChatAsReadAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IMarkChatAsReadAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MarkChatAsReadAction message, length delimited. Does not implicitly {@link WASyncAction.MarkChatAsReadAction.verify|verify} messages.
         * @param message MarkChatAsReadAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IMarkChatAsReadAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MarkChatAsReadAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MarkChatAsReadAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.MarkChatAsReadAction;

        /**
         * Decodes a MarkChatAsReadAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MarkChatAsReadAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.MarkChatAsReadAction;

        /**
         * Verifies a MarkChatAsReadAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MarkChatAsReadAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MarkChatAsReadAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.MarkChatAsReadAction;

        /**
         * Creates a plain object from a MarkChatAsReadAction message. Also converts values to other types if specified.
         * @param message MarkChatAsReadAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.MarkChatAsReadAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MarkChatAsReadAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MarkChatAsReadAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteMessageForMeAction. */
    interface IDeleteMessageForMeAction {

        /** DeleteMessageForMeAction deleteMedia */
        deleteMedia?: (boolean|null);

        /** DeleteMessageForMeAction messageTimestamp */
        messageTimestamp?: (number|Long|null);
    }

    /** Represents a DeleteMessageForMeAction. */
    class DeleteMessageForMeAction implements IDeleteMessageForMeAction {

        /**
         * Constructs a new DeleteMessageForMeAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IDeleteMessageForMeAction);

        /** DeleteMessageForMeAction deleteMedia. */
        public deleteMedia: boolean;

        /** DeleteMessageForMeAction messageTimestamp. */
        public messageTimestamp: (number|Long);

        /**
         * Creates a new DeleteMessageForMeAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteMessageForMeAction instance
         */
        public static create(properties?: WASyncAction.IDeleteMessageForMeAction): WASyncAction.DeleteMessageForMeAction;

        /**
         * Encodes the specified DeleteMessageForMeAction message. Does not implicitly {@link WASyncAction.DeleteMessageForMeAction.verify|verify} messages.
         * @param message DeleteMessageForMeAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IDeleteMessageForMeAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteMessageForMeAction message, length delimited. Does not implicitly {@link WASyncAction.DeleteMessageForMeAction.verify|verify} messages.
         * @param message DeleteMessageForMeAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IDeleteMessageForMeAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteMessageForMeAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteMessageForMeAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.DeleteMessageForMeAction;

        /**
         * Decodes a DeleteMessageForMeAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteMessageForMeAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.DeleteMessageForMeAction;

        /**
         * Verifies a DeleteMessageForMeAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteMessageForMeAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteMessageForMeAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.DeleteMessageForMeAction;

        /**
         * Creates a plain object from a DeleteMessageForMeAction message. Also converts values to other types if specified.
         * @param message DeleteMessageForMeAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.DeleteMessageForMeAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteMessageForMeAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeleteMessageForMeAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ArchiveChatAction. */
    interface IArchiveChatAction {

        /** ArchiveChatAction archived */
        archived?: (boolean|null);

        /** ArchiveChatAction messageRange */
        messageRange?: (WASyncAction.ISyncActionMessageRange|null);
    }

    /** Represents an ArchiveChatAction. */
    class ArchiveChatAction implements IArchiveChatAction {

        /**
         * Constructs a new ArchiveChatAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IArchiveChatAction);

        /** ArchiveChatAction archived. */
        public archived: boolean;

        /** ArchiveChatAction messageRange. */
        public messageRange?: (WASyncAction.ISyncActionMessageRange|null);

        /**
         * Creates a new ArchiveChatAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArchiveChatAction instance
         */
        public static create(properties?: WASyncAction.IArchiveChatAction): WASyncAction.ArchiveChatAction;

        /**
         * Encodes the specified ArchiveChatAction message. Does not implicitly {@link WASyncAction.ArchiveChatAction.verify|verify} messages.
         * @param message ArchiveChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IArchiveChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArchiveChatAction message, length delimited. Does not implicitly {@link WASyncAction.ArchiveChatAction.verify|verify} messages.
         * @param message ArchiveChatAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IArchiveChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArchiveChatAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArchiveChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ArchiveChatAction;

        /**
         * Decodes an ArchiveChatAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArchiveChatAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ArchiveChatAction;

        /**
         * Verifies an ArchiveChatAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ArchiveChatAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ArchiveChatAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ArchiveChatAction;

        /**
         * Creates a plain object from an ArchiveChatAction message. Also converts values to other types if specified.
         * @param message ArchiveChatAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ArchiveChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ArchiveChatAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ArchiveChatAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RecentEmojiWeightsAction. */
    interface IRecentEmojiWeightsAction {

        /** RecentEmojiWeightsAction weights */
        weights?: (WASyncAction.IRecentEmojiWeight[]|null);
    }

    /** Represents a RecentEmojiWeightsAction. */
    class RecentEmojiWeightsAction implements IRecentEmojiWeightsAction {

        /**
         * Constructs a new RecentEmojiWeightsAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IRecentEmojiWeightsAction);

        /** RecentEmojiWeightsAction weights. */
        public weights: WASyncAction.IRecentEmojiWeight[];

        /**
         * Creates a new RecentEmojiWeightsAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecentEmojiWeightsAction instance
         */
        public static create(properties?: WASyncAction.IRecentEmojiWeightsAction): WASyncAction.RecentEmojiWeightsAction;

        /**
         * Encodes the specified RecentEmojiWeightsAction message. Does not implicitly {@link WASyncAction.RecentEmojiWeightsAction.verify|verify} messages.
         * @param message RecentEmojiWeightsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IRecentEmojiWeightsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecentEmojiWeightsAction message, length delimited. Does not implicitly {@link WASyncAction.RecentEmojiWeightsAction.verify|verify} messages.
         * @param message RecentEmojiWeightsAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IRecentEmojiWeightsAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecentEmojiWeightsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.RecentEmojiWeightsAction;

        /**
         * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecentEmojiWeightsAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.RecentEmojiWeightsAction;

        /**
         * Verifies a RecentEmojiWeightsAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RecentEmojiWeightsAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RecentEmojiWeightsAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.RecentEmojiWeightsAction;

        /**
         * Creates a plain object from a RecentEmojiWeightsAction message. Also converts values to other types if specified.
         * @param message RecentEmojiWeightsAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.RecentEmojiWeightsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RecentEmojiWeightsAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RecentEmojiWeightsAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LabelEditAction. */
    interface ILabelEditAction {

        /** LabelEditAction name */
        name?: (string|null);

        /** LabelEditAction color */
        color?: (number|null);

        /** LabelEditAction predefinedID */
        predefinedID?: (number|null);

        /** LabelEditAction deleted */
        deleted?: (boolean|null);

        /** LabelEditAction orderIndex */
        orderIndex?: (number|null);
    }

    /** Represents a LabelEditAction. */
    class LabelEditAction implements ILabelEditAction {

        /**
         * Constructs a new LabelEditAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ILabelEditAction);

        /** LabelEditAction name. */
        public name: string;

        /** LabelEditAction color. */
        public color: number;

        /** LabelEditAction predefinedID. */
        public predefinedID: number;

        /** LabelEditAction deleted. */
        public deleted: boolean;

        /** LabelEditAction orderIndex. */
        public orderIndex: number;

        /**
         * Creates a new LabelEditAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LabelEditAction instance
         */
        public static create(properties?: WASyncAction.ILabelEditAction): WASyncAction.LabelEditAction;

        /**
         * Encodes the specified LabelEditAction message. Does not implicitly {@link WASyncAction.LabelEditAction.verify|verify} messages.
         * @param message LabelEditAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ILabelEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LabelEditAction message, length delimited. Does not implicitly {@link WASyncAction.LabelEditAction.verify|verify} messages.
         * @param message LabelEditAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ILabelEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LabelEditAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LabelEditAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.LabelEditAction;

        /**
         * Decodes a LabelEditAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LabelEditAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.LabelEditAction;

        /**
         * Verifies a LabelEditAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LabelEditAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LabelEditAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.LabelEditAction;

        /**
         * Creates a plain object from a LabelEditAction message. Also converts values to other types if specified.
         * @param message LabelEditAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.LabelEditAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LabelEditAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LabelEditAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LabelAssociationAction. */
    interface ILabelAssociationAction {

        /** LabelAssociationAction labeled */
        labeled?: (boolean|null);
    }

    /** Represents a LabelAssociationAction. */
    class LabelAssociationAction implements ILabelAssociationAction {

        /**
         * Constructs a new LabelAssociationAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ILabelAssociationAction);

        /** LabelAssociationAction labeled. */
        public labeled: boolean;

        /**
         * Creates a new LabelAssociationAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LabelAssociationAction instance
         */
        public static create(properties?: WASyncAction.ILabelAssociationAction): WASyncAction.LabelAssociationAction;

        /**
         * Encodes the specified LabelAssociationAction message. Does not implicitly {@link WASyncAction.LabelAssociationAction.verify|verify} messages.
         * @param message LabelAssociationAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ILabelAssociationAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LabelAssociationAction message, length delimited. Does not implicitly {@link WASyncAction.LabelAssociationAction.verify|verify} messages.
         * @param message LabelAssociationAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ILabelAssociationAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LabelAssociationAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LabelAssociationAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.LabelAssociationAction;

        /**
         * Decodes a LabelAssociationAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LabelAssociationAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.LabelAssociationAction;

        /**
         * Verifies a LabelAssociationAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LabelAssociationAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LabelAssociationAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.LabelAssociationAction;

        /**
         * Creates a plain object from a LabelAssociationAction message. Also converts values to other types if specified.
         * @param message LabelAssociationAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.LabelAssociationAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LabelAssociationAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LabelAssociationAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuickReplyAction. */
    interface IQuickReplyAction {

        /** QuickReplyAction shortcut */
        shortcut?: (string|null);

        /** QuickReplyAction message */
        message?: (string|null);

        /** QuickReplyAction keywords */
        keywords?: (string[]|null);

        /** QuickReplyAction count */
        count?: (number|null);

        /** QuickReplyAction deleted */
        deleted?: (boolean|null);
    }

    /** Represents a QuickReplyAction. */
    class QuickReplyAction implements IQuickReplyAction {

        /**
         * Constructs a new QuickReplyAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IQuickReplyAction);

        /** QuickReplyAction shortcut. */
        public shortcut: string;

        /** QuickReplyAction message. */
        public message: string;

        /** QuickReplyAction keywords. */
        public keywords: string[];

        /** QuickReplyAction count. */
        public count: number;

        /** QuickReplyAction deleted. */
        public deleted: boolean;

        /**
         * Creates a new QuickReplyAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuickReplyAction instance
         */
        public static create(properties?: WASyncAction.IQuickReplyAction): WASyncAction.QuickReplyAction;

        /**
         * Encodes the specified QuickReplyAction message. Does not implicitly {@link WASyncAction.QuickReplyAction.verify|verify} messages.
         * @param message QuickReplyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IQuickReplyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QuickReplyAction message, length delimited. Does not implicitly {@link WASyncAction.QuickReplyAction.verify|verify} messages.
         * @param message QuickReplyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IQuickReplyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuickReplyAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuickReplyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.QuickReplyAction;

        /**
         * Decodes a QuickReplyAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QuickReplyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.QuickReplyAction;

        /**
         * Verifies a QuickReplyAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QuickReplyAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QuickReplyAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.QuickReplyAction;

        /**
         * Creates a plain object from a QuickReplyAction message. Also converts values to other types if specified.
         * @param message QuickReplyAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.QuickReplyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QuickReplyAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for QuickReplyAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LocaleSetting. */
    interface ILocaleSetting {

        /** LocaleSetting locale */
        locale?: (string|null);
    }

    /** Represents a LocaleSetting. */
    class LocaleSetting implements ILocaleSetting {

        /**
         * Constructs a new LocaleSetting.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ILocaleSetting);

        /** LocaleSetting locale. */
        public locale: string;

        /**
         * Creates a new LocaleSetting instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LocaleSetting instance
         */
        public static create(properties?: WASyncAction.ILocaleSetting): WASyncAction.LocaleSetting;

        /**
         * Encodes the specified LocaleSetting message. Does not implicitly {@link WASyncAction.LocaleSetting.verify|verify} messages.
         * @param message LocaleSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ILocaleSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LocaleSetting message, length delimited. Does not implicitly {@link WASyncAction.LocaleSetting.verify|verify} messages.
         * @param message LocaleSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ILocaleSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LocaleSetting message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LocaleSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.LocaleSetting;

        /**
         * Decodes a LocaleSetting message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LocaleSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.LocaleSetting;

        /**
         * Verifies a LocaleSetting message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LocaleSetting message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LocaleSetting
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.LocaleSetting;

        /**
         * Creates a plain object from a LocaleSetting message. Also converts values to other types if specified.
         * @param message LocaleSetting
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.LocaleSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LocaleSetting to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LocaleSetting
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PushNameSetting. */
    interface IPushNameSetting {

        /** PushNameSetting name */
        name?: (string|null);
    }

    /** Represents a PushNameSetting. */
    class PushNameSetting implements IPushNameSetting {

        /**
         * Constructs a new PushNameSetting.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPushNameSetting);

        /** PushNameSetting name. */
        public name: string;

        /**
         * Creates a new PushNameSetting instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PushNameSetting instance
         */
        public static create(properties?: WASyncAction.IPushNameSetting): WASyncAction.PushNameSetting;

        /**
         * Encodes the specified PushNameSetting message. Does not implicitly {@link WASyncAction.PushNameSetting.verify|verify} messages.
         * @param message PushNameSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPushNameSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PushNameSetting message, length delimited. Does not implicitly {@link WASyncAction.PushNameSetting.verify|verify} messages.
         * @param message PushNameSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPushNameSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PushNameSetting message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PushNameSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PushNameSetting;

        /**
         * Decodes a PushNameSetting message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PushNameSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PushNameSetting;

        /**
         * Verifies a PushNameSetting message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PushNameSetting message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PushNameSetting
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PushNameSetting;

        /**
         * Creates a plain object from a PushNameSetting message. Also converts values to other types if specified.
         * @param message PushNameSetting
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PushNameSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PushNameSetting to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PushNameSetting
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SecurityNotificationSetting. */
    interface ISecurityNotificationSetting {

        /** SecurityNotificationSetting showNotification */
        showNotification?: (boolean|null);
    }

    /** Represents a SecurityNotificationSetting. */
    class SecurityNotificationSetting implements ISecurityNotificationSetting {

        /**
         * Constructs a new SecurityNotificationSetting.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISecurityNotificationSetting);

        /** SecurityNotificationSetting showNotification. */
        public showNotification: boolean;

        /**
         * Creates a new SecurityNotificationSetting instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SecurityNotificationSetting instance
         */
        public static create(properties?: WASyncAction.ISecurityNotificationSetting): WASyncAction.SecurityNotificationSetting;

        /**
         * Encodes the specified SecurityNotificationSetting message. Does not implicitly {@link WASyncAction.SecurityNotificationSetting.verify|verify} messages.
         * @param message SecurityNotificationSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISecurityNotificationSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SecurityNotificationSetting message, length delimited. Does not implicitly {@link WASyncAction.SecurityNotificationSetting.verify|verify} messages.
         * @param message SecurityNotificationSetting message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISecurityNotificationSetting, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SecurityNotificationSetting message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SecurityNotificationSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SecurityNotificationSetting;

        /**
         * Decodes a SecurityNotificationSetting message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SecurityNotificationSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SecurityNotificationSetting;

        /**
         * Verifies a SecurityNotificationSetting message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SecurityNotificationSetting message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SecurityNotificationSetting
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SecurityNotificationSetting;

        /**
         * Creates a plain object from a SecurityNotificationSetting message. Also converts values to other types if specified.
         * @param message SecurityNotificationSetting
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SecurityNotificationSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SecurityNotificationSetting to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SecurityNotificationSetting
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PinAction. */
    interface IPinAction {

        /** PinAction pinned */
        pinned?: (boolean|null);
    }

    /** Represents a PinAction. */
    class PinAction implements IPinAction {

        /**
         * Constructs a new PinAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IPinAction);

        /** PinAction pinned. */
        public pinned: boolean;

        /**
         * Creates a new PinAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PinAction instance
         */
        public static create(properties?: WASyncAction.IPinAction): WASyncAction.PinAction;

        /**
         * Encodes the specified PinAction message. Does not implicitly {@link WASyncAction.PinAction.verify|verify} messages.
         * @param message PinAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IPinAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PinAction message, length delimited. Does not implicitly {@link WASyncAction.PinAction.verify|verify} messages.
         * @param message PinAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IPinAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PinAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PinAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.PinAction;

        /**
         * Decodes a PinAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PinAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.PinAction;

        /**
         * Verifies a PinAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PinAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PinAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.PinAction;

        /**
         * Creates a plain object from a PinAction message. Also converts values to other types if specified.
         * @param message PinAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.PinAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PinAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PinAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MuteAction. */
    interface IMuteAction {

        /** MuteAction muted */
        muted?: (boolean|null);

        /** MuteAction muteEndTimestamp */
        muteEndTimestamp?: (number|Long|null);

        /** MuteAction autoMuted */
        autoMuted?: (boolean|null);
    }

    /** Represents a MuteAction. */
    class MuteAction implements IMuteAction {

        /**
         * Constructs a new MuteAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IMuteAction);

        /** MuteAction muted. */
        public muted: boolean;

        /** MuteAction muteEndTimestamp. */
        public muteEndTimestamp: (number|Long);

        /** MuteAction autoMuted. */
        public autoMuted: boolean;

        /**
         * Creates a new MuteAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MuteAction instance
         */
        public static create(properties?: WASyncAction.IMuteAction): WASyncAction.MuteAction;

        /**
         * Encodes the specified MuteAction message. Does not implicitly {@link WASyncAction.MuteAction.verify|verify} messages.
         * @param message MuteAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MuteAction message, length delimited. Does not implicitly {@link WASyncAction.MuteAction.verify|verify} messages.
         * @param message MuteAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MuteAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MuteAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.MuteAction;

        /**
         * Decodes a MuteAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MuteAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.MuteAction;

        /**
         * Verifies a MuteAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MuteAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MuteAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.MuteAction;

        /**
         * Creates a plain object from a MuteAction message. Also converts values to other types if specified.
         * @param message MuteAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.MuteAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MuteAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MuteAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ContactAction. */
    interface IContactAction {

        /** ContactAction fullName */
        fullName?: (string|null);

        /** ContactAction firstName */
        firstName?: (string|null);

        /** ContactAction lidJID */
        lidJID?: (string|null);

        /** ContactAction saveOnPrimaryAddressbook */
        saveOnPrimaryAddressbook?: (boolean|null);
    }

    /** Represents a ContactAction. */
    class ContactAction implements IContactAction {

        /**
         * Constructs a new ContactAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IContactAction);

        /** ContactAction fullName. */
        public fullName: string;

        /** ContactAction firstName. */
        public firstName: string;

        /** ContactAction lidJID. */
        public lidJID: string;

        /** ContactAction saveOnPrimaryAddressbook. */
        public saveOnPrimaryAddressbook: boolean;

        /**
         * Creates a new ContactAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactAction instance
         */
        public static create(properties?: WASyncAction.IContactAction): WASyncAction.ContactAction;

        /**
         * Encodes the specified ContactAction message. Does not implicitly {@link WASyncAction.ContactAction.verify|verify} messages.
         * @param message ContactAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IContactAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactAction message, length delimited. Does not implicitly {@link WASyncAction.ContactAction.verify|verify} messages.
         * @param message ContactAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IContactAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.ContactAction;

        /**
         * Decodes a ContactAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.ContactAction;

        /**
         * Verifies a ContactAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.ContactAction;

        /**
         * Creates a plain object from a ContactAction message. Also converts values to other types if specified.
         * @param message ContactAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.ContactAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ContactAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a StarAction. */
    interface IStarAction {

        /** StarAction starred */
        starred?: (boolean|null);
    }

    /** Represents a StarAction. */
    class StarAction implements IStarAction {

        /**
         * Constructs a new StarAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.IStarAction);

        /** StarAction starred. */
        public starred: boolean;

        /**
         * Creates a new StarAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StarAction instance
         */
        public static create(properties?: WASyncAction.IStarAction): WASyncAction.StarAction;

        /**
         * Encodes the specified StarAction message. Does not implicitly {@link WASyncAction.StarAction.verify|verify} messages.
         * @param message StarAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.IStarAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StarAction message, length delimited. Does not implicitly {@link WASyncAction.StarAction.verify|verify} messages.
         * @param message StarAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.IStarAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StarAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StarAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.StarAction;

        /**
         * Decodes a StarAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StarAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.StarAction;

        /**
         * Verifies a StarAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StarAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StarAction
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.StarAction;

        /**
         * Creates a plain object from a StarAction message. Also converts values to other types if specified.
         * @param message StarAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.StarAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StarAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StarAction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SyncActionData. */
    interface ISyncActionData {

        /** SyncActionData index */
        index?: (Uint8Array|null);

        /** SyncActionData value */
        value?: (WASyncAction.ISyncActionValue|null);

        /** SyncActionData padding */
        padding?: (Uint8Array|null);

        /** SyncActionData version */
        version?: (number|null);
    }

    /** Represents a SyncActionData. */
    class SyncActionData implements ISyncActionData {

        /**
         * Constructs a new SyncActionData.
         * @param [properties] Properties to set
         */
        constructor(properties?: WASyncAction.ISyncActionData);

        /** SyncActionData index. */
        public index: Uint8Array;

        /** SyncActionData value. */
        public value?: (WASyncAction.ISyncActionValue|null);

        /** SyncActionData padding. */
        public padding: Uint8Array;

        /** SyncActionData version. */
        public version: number;

        /**
         * Creates a new SyncActionData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionData instance
         */
        public static create(properties?: WASyncAction.ISyncActionData): WASyncAction.SyncActionData;

        /**
         * Encodes the specified SyncActionData message. Does not implicitly {@link WASyncAction.SyncActionData.verify|verify} messages.
         * @param message SyncActionData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WASyncAction.ISyncActionData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionData message, length delimited. Does not implicitly {@link WASyncAction.SyncActionData.verify|verify} messages.
         * @param message SyncActionData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WASyncAction.ISyncActionData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WASyncAction.SyncActionData;

        /**
         * Decodes a SyncActionData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WASyncAction.SyncActionData;

        /**
         * Verifies a SyncActionData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncActionData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncActionData
         */
        public static fromObject(object: { [k: string]: any }): WASyncAction.SyncActionData;

        /**
         * Creates a plain object from a SyncActionData message. Also converts values to other types if specified.
         * @param message SyncActionData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WASyncAction.SyncActionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncActionData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncActionData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace WAChatLockSettings. */
export namespace WAChatLockSettings {

    /** Properties of a ChatLockSettings. */
    interface IChatLockSettings {

        /** ChatLockSettings hideLockedChats */
        hideLockedChats?: (boolean|null);

        /** ChatLockSettings secretCode */
        secretCode?: (WAUserPassword.IUserPassword|null);
    }

    /** Represents a ChatLockSettings. */
    class ChatLockSettings implements IChatLockSettings {

        /**
         * Constructs a new ChatLockSettings.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAChatLockSettings.IChatLockSettings);

        /** ChatLockSettings hideLockedChats. */
        public hideLockedChats: boolean;

        /** ChatLockSettings secretCode. */
        public secretCode?: (WAUserPassword.IUserPassword|null);

        /**
         * Creates a new ChatLockSettings instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatLockSettings instance
         */
        public static create(properties?: WAChatLockSettings.IChatLockSettings): WAChatLockSettings.ChatLockSettings;

        /**
         * Encodes the specified ChatLockSettings message. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @param message ChatLockSettings message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAChatLockSettings.IChatLockSettings, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatLockSettings message, length delimited. Does not implicitly {@link WAChatLockSettings.ChatLockSettings.verify|verify} messages.
         * @param message ChatLockSettings message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAChatLockSettings.IChatLockSettings, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatLockSettings message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAChatLockSettings.ChatLockSettings;

        /**
         * Decodes a ChatLockSettings message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatLockSettings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAChatLockSettings.ChatLockSettings;

        /**
         * Verifies a ChatLockSettings message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatLockSettings message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatLockSettings
         */
        public static fromObject(object: { [k: string]: any }): WAChatLockSettings.ChatLockSettings;

        /**
         * Creates a plain object from a ChatLockSettings message. Also converts values to other types if specified.
         * @param message ChatLockSettings
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAChatLockSettings.ChatLockSettings, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatLockSettings to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatLockSettings
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace WAUserPassword. */
export namespace WAUserPassword {

    /** Properties of a UserPassword. */
    interface IUserPassword {

        /** UserPassword encoding */
        encoding?: (WAUserPassword.UserPassword.Encoding|null);

        /** UserPassword transformer */
        transformer?: (WAUserPassword.UserPassword.Transformer|null);

        /** UserPassword transformerArg */
        transformerArg?: (WAUserPassword.UserPassword.ITransformerArg[]|null);

        /** UserPassword transformedData */
        transformedData?: (Uint8Array|null);
    }

    /** Represents a UserPassword. */
    class UserPassword implements IUserPassword {

        /**
         * Constructs a new UserPassword.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAUserPassword.IUserPassword);

        /** UserPassword encoding. */
        public encoding: WAUserPassword.UserPassword.Encoding;

        /** UserPassword transformer. */
        public transformer: WAUserPassword.UserPassword.Transformer;

        /** UserPassword transformerArg. */
        public transformerArg: WAUserPassword.UserPassword.ITransformerArg[];

        /** UserPassword transformedData. */
        public transformedData: Uint8Array;

        /**
         * Creates a new UserPassword instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserPassword instance
         */
        public static create(properties?: WAUserPassword.IUserPassword): WAUserPassword.UserPassword;

        /**
         * Encodes the specified UserPassword message. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @param message UserPassword message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAUserPassword.IUserPassword, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserPassword message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.verify|verify} messages.
         * @param message UserPassword message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAUserPassword.IUserPassword, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserPassword message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword;

        /**
         * Decodes a UserPassword message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserPassword
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword;

        /**
         * Verifies a UserPassword message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserPassword message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserPassword
         */
        public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword;

        /**
         * Creates a plain object from a UserPassword message. Also converts values to other types if specified.
         * @param message UserPassword
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAUserPassword.UserPassword, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserPassword to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserPassword
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UserPassword {

        /** Transformer enum. */
        enum Transformer {
            NONE = 0,
            PBKDF2_HMAC_SHA512 = 1,
            PBKDF2_HMAC_SHA384 = 2
        }

        /** Encoding enum. */
        enum Encoding {
            UTF8 = 0,
            UTF8_BROKEN = 1
        }

        /** Properties of a TransformerArg. */
        interface ITransformerArg {

            /** TransformerArg key */
            key?: (string|null);

            /** TransformerArg value */
            value?: (WAUserPassword.UserPassword.TransformerArg.IValue|null);
        }

        /** Represents a TransformerArg. */
        class TransformerArg implements ITransformerArg {

            /**
             * Constructs a new TransformerArg.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAUserPassword.UserPassword.ITransformerArg);

            /** TransformerArg key. */
            public key: string;

            /** TransformerArg value. */
            public value?: (WAUserPassword.UserPassword.TransformerArg.IValue|null);

            /**
             * Creates a new TransformerArg instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TransformerArg instance
             */
            public static create(properties?: WAUserPassword.UserPassword.ITransformerArg): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Encodes the specified TransformerArg message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @param message TransformerArg message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAUserPassword.UserPassword.ITransformerArg, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TransformerArg message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.verify|verify} messages.
             * @param message TransformerArg message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAUserPassword.UserPassword.ITransformerArg, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TransformerArg message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Decodes a TransformerArg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TransformerArg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Verifies a TransformerArg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TransformerArg message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TransformerArg
             */
            public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword.TransformerArg;

            /**
             * Creates a plain object from a TransformerArg message. Also converts values to other types if specified.
             * @param message TransformerArg
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAUserPassword.UserPassword.TransformerArg, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TransformerArg to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TransformerArg
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace TransformerArg {

            /** Properties of a Value. */
            interface IValue {

                /** Value asBlob */
                asBlob?: (Uint8Array|null);

                /** Value asUnsignedInteger */
                asUnsignedInteger?: (number|null);
            }

            /** Represents a Value. */
            class Value implements IValue {

                /**
                 * Constructs a new Value.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: WAUserPassword.UserPassword.TransformerArg.IValue);

                /** Value asBlob. */
                public asBlob?: (Uint8Array|null);

                /** Value asUnsignedInteger. */
                public asUnsignedInteger?: (number|null);

                /** Value value. */
                public value?: ("asBlob"|"asUnsignedInteger");

                /**
                 * Creates a new Value instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Value instance
                 */
                public static create(properties?: WAUserPassword.UserPassword.TransformerArg.IValue): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Encodes the specified Value message. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @param message Value message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WAUserPassword.UserPassword.TransformerArg.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Value message, length delimited. Does not implicitly {@link WAUserPassword.UserPassword.TransformerArg.Value.verify|verify} messages.
                 * @param message Value message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WAUserPassword.UserPassword.TransformerArg.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Value message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Decodes a Value message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Verifies a Value message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Value message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Value
                 */
                public static fromObject(object: { [k: string]: any }): WAUserPassword.UserPassword.TransformerArg.Value;

                /**
                 * Creates a plain object from a Value message. Also converts values to other types if specified.
                 * @param message Value
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WAUserPassword.UserPassword.TransformerArg.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Value to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Value
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}

/** Namespace WADeviceCapabilities. */
export namespace WADeviceCapabilities {

    /** Properties of a DeviceCapabilities. */
    interface IDeviceCapabilities {

        /** DeviceCapabilities chatLockSupportLevel */
        chatLockSupportLevel?: (WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel|null);
    }

    /** Represents a DeviceCapabilities. */
    class DeviceCapabilities implements IDeviceCapabilities {

        /**
         * Constructs a new DeviceCapabilities.
         * @param [properties] Properties to set
         */
        constructor(properties?: WADeviceCapabilities.IDeviceCapabilities);

        /** DeviceCapabilities chatLockSupportLevel. */
        public chatLockSupportLevel: WADeviceCapabilities.DeviceCapabilities.ChatLockSupportLevel;

        /**
         * Creates a new DeviceCapabilities instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeviceCapabilities instance
         */
        public static create(properties?: WADeviceCapabilities.IDeviceCapabilities): WADeviceCapabilities.DeviceCapabilities;

        /**
         * Encodes the specified DeviceCapabilities message. Does not implicitly {@link WADeviceCapabilities.DeviceCapabilities.verify|verify} messages.
         * @param message DeviceCapabilities message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WADeviceCapabilities.IDeviceCapabilities, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeviceCapabilities message, length delimited. Does not implicitly {@link WADeviceCapabilities.DeviceCapabilities.verify|verify} messages.
         * @param message DeviceCapabilities message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WADeviceCapabilities.IDeviceCapabilities, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeviceCapabilities message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeviceCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WADeviceCapabilities.DeviceCapabilities;

        /**
         * Decodes a DeviceCapabilities message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeviceCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WADeviceCapabilities.DeviceCapabilities;

        /**
         * Verifies a DeviceCapabilities message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeviceCapabilities message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeviceCapabilities
         */
        public static fromObject(object: { [k: string]: any }): WADeviceCapabilities.DeviceCapabilities;

        /**
         * Creates a plain object from a DeviceCapabilities message. Also converts values to other types if specified.
         * @param message DeviceCapabilities
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WADeviceCapabilities.DeviceCapabilities, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeviceCapabilities to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeviceCapabilities
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DeviceCapabilities {

        /** ChatLockSupportLevel enum. */
        enum ChatLockSupportLevel {
            NONE = 0,
            MINIMAL = 1,
            FULL = 2
        }
    }
}

/** Namespace WAProtocol. */
export namespace WAProtocol {

    /** Properties of a MessageKey. */
    interface IMessageKey {

        /** MessageKey remoteJID */
        remoteJID?: (string|null);

        /** MessageKey fromMe */
        fromMe?: (boolean|null);

        /** MessageKey ID */
        ID?: (string|null);

        /** MessageKey participant */
        participant?: (string|null);
    }

    /** Represents a MessageKey. */
    class MessageKey implements IMessageKey {

        /**
         * Constructs a new MessageKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAProtocol.IMessageKey);

        /** MessageKey remoteJID. */
        public remoteJID: string;

        /** MessageKey fromMe. */
        public fromMe: boolean;

        /** MessageKey ID. */
        public ID: string;

        /** MessageKey participant. */
        public participant: string;

        /**
         * Creates a new MessageKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageKey instance
         */
        public static create(properties?: WAProtocol.IMessageKey): WAProtocol.MessageKey;

        /**
         * Encodes the specified MessageKey message. Does not implicitly {@link WAProtocol.MessageKey.verify|verify} messages.
         * @param message MessageKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAProtocol.IMessageKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageKey message, length delimited. Does not implicitly {@link WAProtocol.MessageKey.verify|verify} messages.
         * @param message MessageKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAProtocol.IMessageKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAProtocol.MessageKey;

        /**
         * Decodes a MessageKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAProtocol.MessageKey;

        /**
         * Verifies a MessageKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageKey
         */
        public static fromObject(object: { [k: string]: any }): WAProtocol.MessageKey;

        /**
         * Creates a plain object from a MessageKey message. Also converts values to other types if specified.
         * @param message MessageKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAProtocol.MessageKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageKey
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
