import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace WAWebProtobufSyncAction. */
export namespace WAWebProtobufSyncAction {

    /** Properties of a CallLogRecord. */
    interface ICallLogRecord {

        /** CallLogRecord callResult */
        callResult?: (WAWebProtobufSyncAction.CallLogRecord.CallResult|null);

        /** CallLogRecord isDndMode */
        isDndMode?: (boolean|null);

        /** CallLogRecord silenceReason */
        silenceReason?: (WAWebProtobufSyncAction.CallLogRecord.SilenceReason|null);

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
        participants?: (WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo[]|null);

        /** CallLogRecord callType */
        callType?: (WAWebProtobufSyncAction.CallLogRecord.CallType|null);
    }

    /** Represents a CallLogRecord. */
    class CallLogRecord implements ICallLogRecord {

        /**
         * Constructs a new CallLogRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAWebProtobufSyncAction.ICallLogRecord);

        /** CallLogRecord callResult. */
        public callResult: WAWebProtobufSyncAction.CallLogRecord.CallResult;

        /** CallLogRecord isDndMode. */
        public isDndMode: boolean;

        /** CallLogRecord silenceReason. */
        public silenceReason: WAWebProtobufSyncAction.CallLogRecord.SilenceReason;

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
        public participants: WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo[];

        /** CallLogRecord callType. */
        public callType: WAWebProtobufSyncAction.CallLogRecord.CallType;

        /**
         * Creates a new CallLogRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallLogRecord instance
         */
        public static create(properties?: WAWebProtobufSyncAction.ICallLogRecord): WAWebProtobufSyncAction.CallLogRecord;

        /**
         * Encodes the specified CallLogRecord message. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.verify|verify} messages.
         * @param message CallLogRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWebProtobufSyncAction.ICallLogRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallLogRecord message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.verify|verify} messages.
         * @param message CallLogRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWebProtobufSyncAction.ICallLogRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallLogRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.CallLogRecord;

        /**
         * Decodes a CallLogRecord message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallLogRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.CallLogRecord;

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
        public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.CallLogRecord;

        /**
         * Creates a plain object from a CallLogRecord message. Also converts values to other types if specified.
         * @param message CallLogRecord
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWebProtobufSyncAction.CallLogRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            callResult?: (WAWebProtobufSyncAction.CallLogRecord.CallResult|null);
        }

        /** Represents a ParticipantInfo. */
        class ParticipantInfo implements IParticipantInfo {

            /**
             * Constructs a new ParticipantInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo);

            /** ParticipantInfo userJID. */
            public userJID: string;

            /** ParticipantInfo callResult. */
            public callResult: WAWebProtobufSyncAction.CallLogRecord.CallResult;

            /**
             * Creates a new ParticipantInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ParticipantInfo instance
             */
            public static create(properties?: WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo): WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Encodes the specified ParticipantInfo message. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @param message ParticipantInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ParticipantInfo message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo.verify|verify} messages.
             * @param message ParticipantInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.CallLogRecord.IParticipantInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ParticipantInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Decodes a ParticipantInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ParticipantInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo;

            /**
             * Creates a plain object from a ParticipantInfo message. Also converts values to other types if specified.
             * @param message ParticipantInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.CallLogRecord.ParticipantInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Properties of a SyncActionValue. */
    interface ISyncActionValue {

        /** SyncActionValue timestamp */
        timestamp?: (number|Long|null);

        /** SyncActionValue starAction */
        starAction?: (WAWebProtobufSyncAction.SyncActionValue.IStarAction|null);

        /** SyncActionValue contactAction */
        contactAction?: (WAWebProtobufSyncAction.SyncActionValue.IContactAction|null);

        /** SyncActionValue muteAction */
        muteAction?: (WAWebProtobufSyncAction.SyncActionValue.IMuteAction|null);

        /** SyncActionValue pinAction */
        pinAction?: (WAWebProtobufSyncAction.SyncActionValue.IPinAction|null);

        /** SyncActionValue securityNotificationSetting */
        securityNotificationSetting?: (WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting|null);

        /** SyncActionValue pushNameSetting */
        pushNameSetting?: (WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting|null);

        /** SyncActionValue quickReplyAction */
        quickReplyAction?: (WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction|null);

        /** SyncActionValue recentEmojiWeightsAction */
        recentEmojiWeightsAction?: (WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction|null);

        /** SyncActionValue labelEditAction */
        labelEditAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction|null);

        /** SyncActionValue labelAssociationAction */
        labelAssociationAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction|null);

        /** SyncActionValue localeSetting */
        localeSetting?: (WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting|null);

        /** SyncActionValue archiveChatAction */
        archiveChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction|null);

        /** SyncActionValue deleteMessageForMeAction */
        deleteMessageForMeAction?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction|null);

        /** SyncActionValue keyExpiration */
        keyExpiration?: (WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration|null);

        /** SyncActionValue markChatAsReadAction */
        markChatAsReadAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction|null);

        /** SyncActionValue clearChatAction */
        clearChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IClearChatAction|null);

        /** SyncActionValue deleteChatAction */
        deleteChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction|null);

        /** SyncActionValue unarchiveChatsSetting */
        unarchiveChatsSetting?: (WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting|null);

        /** SyncActionValue primaryFeature */
        primaryFeature?: (WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature|null);

        /** SyncActionValue androidUnsupportedActions */
        androidUnsupportedActions?: (WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions|null);

        /** SyncActionValue agentAction */
        agentAction?: (WAWebProtobufSyncAction.SyncActionValue.IAgentAction|null);

        /** SyncActionValue subscriptionAction */
        subscriptionAction?: (WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction|null);

        /** SyncActionValue userStatusMuteAction */
        userStatusMuteAction?: (WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction|null);

        /** SyncActionValue timeFormatAction */
        timeFormatAction?: (WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction|null);

        /** SyncActionValue nuxAction */
        nuxAction?: (WAWebProtobufSyncAction.SyncActionValue.INuxAction|null);

        /** SyncActionValue primaryVersionAction */
        primaryVersionAction?: (WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction|null);

        /** SyncActionValue stickerAction */
        stickerAction?: (WAWebProtobufSyncAction.SyncActionValue.IStickerAction|null);

        /** SyncActionValue removeRecentStickerAction */
        removeRecentStickerAction?: (WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction|null);

        /** SyncActionValue chatAssignment */
        chatAssignment?: (WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction|null);

        /** SyncActionValue chatAssignmentOpenedStatus */
        chatAssignmentOpenedStatus?: (WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction|null);

        /** SyncActionValue pnForLidChatAction */
        pnForLidChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction|null);

        /** SyncActionValue marketingMessageAction */
        marketingMessageAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction|null);

        /** SyncActionValue marketingMessageBroadcastAction */
        marketingMessageBroadcastAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction|null);

        /** SyncActionValue externalWebBetaAction */
        externalWebBetaAction?: (WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction|null);

        /** SyncActionValue privacySettingRelayAllCalls */
        privacySettingRelayAllCalls?: (WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls|null);

        /** SyncActionValue callLogAction */
        callLogAction?: (WAWebProtobufSyncAction.SyncActionValue.ICallLogAction|null);

        /** SyncActionValue statusPrivacy */
        statusPrivacy?: (WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction|null);

        /** SyncActionValue botWelcomeRequestAction */
        botWelcomeRequestAction?: (WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction|null);

        /** SyncActionValue deleteIndividualCallLog */
        deleteIndividualCallLog?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction|null);

        /** SyncActionValue labelReorderingAction */
        labelReorderingAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction|null);

        /** SyncActionValue paymentInfoAction */
        paymentInfoAction?: (WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction|null);

        /** SyncActionValue customPaymentMethodsAction */
        customPaymentMethodsAction?: (WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction|null);

        /** SyncActionValue lockChatAction */
        lockChatAction?: (WAWebProtobufSyncAction.SyncActionValue.ILockChatAction|null);

        /** SyncActionValue chatLockSettings */
        chatLockSettings?: (WAChatLockSettings.IChatLockSettings|null);

        /** SyncActionValue wamoUserIdentifierAction */
        wamoUserIdentifierAction?: (WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction|null);

        /** SyncActionValue privacySettingDisableLinkPreviewsAction */
        privacySettingDisableLinkPreviewsAction?: (WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null);

        /** SyncActionValue deviceCapabilities */
        deviceCapabilities?: (WADeviceCapabilities.IDeviceCapabilities|null);

        /** SyncActionValue noteEditAction */
        noteEditAction?: (WAWebProtobufSyncAction.SyncActionValue.INoteEditAction|null);

        /** SyncActionValue favoritesAction */
        favoritesAction?: (WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction|null);

        /** SyncActionValue merchantPaymentPartnerAction */
        merchantPaymentPartnerAction?: (WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction|null);

        /** SyncActionValue waffleAccountLinkStateAction */
        waffleAccountLinkStateAction?: (WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction|null);
    }

    /** Represents a SyncActionValue. */
    class SyncActionValue implements ISyncActionValue {

        /**
         * Constructs a new SyncActionValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAWebProtobufSyncAction.ISyncActionValue);

        /** SyncActionValue timestamp. */
        public timestamp: (number|Long);

        /** SyncActionValue starAction. */
        public starAction?: (WAWebProtobufSyncAction.SyncActionValue.IStarAction|null);

        /** SyncActionValue contactAction. */
        public contactAction?: (WAWebProtobufSyncAction.SyncActionValue.IContactAction|null);

        /** SyncActionValue muteAction. */
        public muteAction?: (WAWebProtobufSyncAction.SyncActionValue.IMuteAction|null);

        /** SyncActionValue pinAction. */
        public pinAction?: (WAWebProtobufSyncAction.SyncActionValue.IPinAction|null);

        /** SyncActionValue securityNotificationSetting. */
        public securityNotificationSetting?: (WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting|null);

        /** SyncActionValue pushNameSetting. */
        public pushNameSetting?: (WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting|null);

        /** SyncActionValue quickReplyAction. */
        public quickReplyAction?: (WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction|null);

        /** SyncActionValue recentEmojiWeightsAction. */
        public recentEmojiWeightsAction?: (WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction|null);

        /** SyncActionValue labelEditAction. */
        public labelEditAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction|null);

        /** SyncActionValue labelAssociationAction. */
        public labelAssociationAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction|null);

        /** SyncActionValue localeSetting. */
        public localeSetting?: (WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting|null);

        /** SyncActionValue archiveChatAction. */
        public archiveChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction|null);

        /** SyncActionValue deleteMessageForMeAction. */
        public deleteMessageForMeAction?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction|null);

        /** SyncActionValue keyExpiration. */
        public keyExpiration?: (WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration|null);

        /** SyncActionValue markChatAsReadAction. */
        public markChatAsReadAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction|null);

        /** SyncActionValue clearChatAction. */
        public clearChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IClearChatAction|null);

        /** SyncActionValue deleteChatAction. */
        public deleteChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction|null);

        /** SyncActionValue unarchiveChatsSetting. */
        public unarchiveChatsSetting?: (WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting|null);

        /** SyncActionValue primaryFeature. */
        public primaryFeature?: (WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature|null);

        /** SyncActionValue androidUnsupportedActions. */
        public androidUnsupportedActions?: (WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions|null);

        /** SyncActionValue agentAction. */
        public agentAction?: (WAWebProtobufSyncAction.SyncActionValue.IAgentAction|null);

        /** SyncActionValue subscriptionAction. */
        public subscriptionAction?: (WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction|null);

        /** SyncActionValue userStatusMuteAction. */
        public userStatusMuteAction?: (WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction|null);

        /** SyncActionValue timeFormatAction. */
        public timeFormatAction?: (WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction|null);

        /** SyncActionValue nuxAction. */
        public nuxAction?: (WAWebProtobufSyncAction.SyncActionValue.INuxAction|null);

        /** SyncActionValue primaryVersionAction. */
        public primaryVersionAction?: (WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction|null);

        /** SyncActionValue stickerAction. */
        public stickerAction?: (WAWebProtobufSyncAction.SyncActionValue.IStickerAction|null);

        /** SyncActionValue removeRecentStickerAction. */
        public removeRecentStickerAction?: (WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction|null);

        /** SyncActionValue chatAssignment. */
        public chatAssignment?: (WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction|null);

        /** SyncActionValue chatAssignmentOpenedStatus. */
        public chatAssignmentOpenedStatus?: (WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction|null);

        /** SyncActionValue pnForLidChatAction. */
        public pnForLidChatAction?: (WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction|null);

        /** SyncActionValue marketingMessageAction. */
        public marketingMessageAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction|null);

        /** SyncActionValue marketingMessageBroadcastAction. */
        public marketingMessageBroadcastAction?: (WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction|null);

        /** SyncActionValue externalWebBetaAction. */
        public externalWebBetaAction?: (WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction|null);

        /** SyncActionValue privacySettingRelayAllCalls. */
        public privacySettingRelayAllCalls?: (WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls|null);

        /** SyncActionValue callLogAction. */
        public callLogAction?: (WAWebProtobufSyncAction.SyncActionValue.ICallLogAction|null);

        /** SyncActionValue statusPrivacy. */
        public statusPrivacy?: (WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction|null);

        /** SyncActionValue botWelcomeRequestAction. */
        public botWelcomeRequestAction?: (WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction|null);

        /** SyncActionValue deleteIndividualCallLog. */
        public deleteIndividualCallLog?: (WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction|null);

        /** SyncActionValue labelReorderingAction. */
        public labelReorderingAction?: (WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction|null);

        /** SyncActionValue paymentInfoAction. */
        public paymentInfoAction?: (WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction|null);

        /** SyncActionValue customPaymentMethodsAction. */
        public customPaymentMethodsAction?: (WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction|null);

        /** SyncActionValue lockChatAction. */
        public lockChatAction?: (WAWebProtobufSyncAction.SyncActionValue.ILockChatAction|null);

        /** SyncActionValue chatLockSettings. */
        public chatLockSettings?: (WAChatLockSettings.IChatLockSettings|null);

        /** SyncActionValue wamoUserIdentifierAction. */
        public wamoUserIdentifierAction?: (WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction|null);

        /** SyncActionValue privacySettingDisableLinkPreviewsAction. */
        public privacySettingDisableLinkPreviewsAction?: (WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction|null);

        /** SyncActionValue deviceCapabilities. */
        public deviceCapabilities?: (WADeviceCapabilities.IDeviceCapabilities|null);

        /** SyncActionValue noteEditAction. */
        public noteEditAction?: (WAWebProtobufSyncAction.SyncActionValue.INoteEditAction|null);

        /** SyncActionValue favoritesAction. */
        public favoritesAction?: (WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction|null);

        /** SyncActionValue merchantPaymentPartnerAction. */
        public merchantPaymentPartnerAction?: (WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction|null);

        /** SyncActionValue waffleAccountLinkStateAction. */
        public waffleAccountLinkStateAction?: (WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction|null);

        /**
         * Creates a new SyncActionValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionValue instance
         */
        public static create(properties?: WAWebProtobufSyncAction.ISyncActionValue): WAWebProtobufSyncAction.SyncActionValue;

        /**
         * Encodes the specified SyncActionValue message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.verify|verify} messages.
         * @param message SyncActionValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWebProtobufSyncAction.ISyncActionValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionValue message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.verify|verify} messages.
         * @param message SyncActionValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWebProtobufSyncAction.ISyncActionValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue;

        /**
         * Decodes a SyncActionValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue;

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
        public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue;

        /**
         * Creates a plain object from a SyncActionValue message. Also converts values to other types if specified.
         * @param message SyncActionValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWebProtobufSyncAction.SyncActionValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    namespace SyncActionValue {

        /** Properties of a WaffleAccountLinkStateAction. */
        interface IWaffleAccountLinkStateAction {

            /** WaffleAccountLinkStateAction linkState */
            linkState?: (WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState|null);
        }

        /** Represents a WaffleAccountLinkStateAction. */
        class WaffleAccountLinkStateAction implements IWaffleAccountLinkStateAction {

            /**
             * Constructs a new WaffleAccountLinkStateAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction);

            /** WaffleAccountLinkStateAction linkState. */
            public linkState: WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.AccountLinkState;

            /**
             * Creates a new WaffleAccountLinkStateAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WaffleAccountLinkStateAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction): WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction;

            /**
             * Encodes the specified WaffleAccountLinkStateAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.verify|verify} messages.
             * @param message WaffleAccountLinkStateAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WaffleAccountLinkStateAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction.verify|verify} messages.
             * @param message WaffleAccountLinkStateAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IWaffleAccountLinkStateAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WaffleAccountLinkStateAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction;

            /**
             * Decodes a WaffleAccountLinkStateAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WaffleAccountLinkStateAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction;

            /**
             * Creates a plain object from a WaffleAccountLinkStateAction message. Also converts values to other types if specified.
             * @param message WaffleAccountLinkStateAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.WaffleAccountLinkStateAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            status: WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status;

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction);

            /** MerchantPaymentPartnerAction status. */
            public status: WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.Status;

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction): WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction;

            /**
             * Encodes the specified MerchantPaymentPartnerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.verify|verify} messages.
             * @param message MerchantPaymentPartnerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MerchantPaymentPartnerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction.verify|verify} messages.
             * @param message MerchantPaymentPartnerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IMerchantPaymentPartnerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MerchantPaymentPartnerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction;

            /**
             * Decodes a MerchantPaymentPartnerAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MerchantPaymentPartnerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction;

            /**
             * Creates a plain object from a MerchantPaymentPartnerAction message. Also converts values to other types if specified.
             * @param message MerchantPaymentPartnerAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.MerchantPaymentPartnerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            type?: (WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType|null);

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.INoteEditAction);

            /** NoteEditAction type. */
            public type: WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.NoteType;

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.INoteEditAction): WAWebProtobufSyncAction.SyncActionValue.NoteEditAction;

            /**
             * Encodes the specified NoteEditAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.verify|verify} messages.
             * @param message NoteEditAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.INoteEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NoteEditAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NoteEditAction.verify|verify} messages.
             * @param message NoteEditAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.INoteEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NoteEditAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns NoteEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.NoteEditAction;

            /**
             * Decodes a NoteEditAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns NoteEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.NoteEditAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.NoteEditAction;

            /**
             * Creates a plain object from a NoteEditAction message. Also converts values to other types if specified.
             * @param message NoteEditAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.NoteEditAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            mode?: (WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode|null);

            /** StatusPrivacyAction userJID */
            userJID?: (string[]|null);
        }

        /** Represents a StatusPrivacyAction. */
        class StatusPrivacyAction implements IStatusPrivacyAction {

            /**
             * Constructs a new StatusPrivacyAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction);

            /** StatusPrivacyAction mode. */
            public mode: WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.StatusDistributionMode;

            /** StatusPrivacyAction userJID. */
            public userJID: string[];

            /**
             * Creates a new StatusPrivacyAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StatusPrivacyAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction): WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction;

            /**
             * Encodes the specified StatusPrivacyAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.verify|verify} messages.
             * @param message StatusPrivacyAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StatusPrivacyAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction.verify|verify} messages.
             * @param message StatusPrivacyAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IStatusPrivacyAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StatusPrivacyAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StatusPrivacyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction;

            /**
             * Decodes a StatusPrivacyAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StatusPrivacyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction;

            /**
             * Creates a plain object from a StatusPrivacyAction message. Also converts values to other types if specified.
             * @param message StatusPrivacyAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.StatusPrivacyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            type?: (WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType|null);

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction);

            /** MarketingMessageAction name. */
            public name: string;

            /** MarketingMessageAction message. */
            public message: string;

            /** MarketingMessageAction type. */
            public type: WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.MarketingMessagePrototypeType;

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction;

            /**
             * Encodes the specified MarketingMessageAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.verify|verify} messages.
             * @param message MarketingMessageAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MarketingMessageAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction.verify|verify} messages.
             * @param message MarketingMessageAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MarketingMessageAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketingMessageAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction;

            /**
             * Decodes a MarketingMessageAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketingMessageAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction;

            /**
             * Creates a plain object from a MarketingMessageAction message. Also converts values to other types if specified.
             * @param message MarketingMessageAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.MarketingMessageAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a FavoritesAction. */
        interface IFavoritesAction {

            /** FavoritesAction favorites */
            favorites?: (WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite[]|null);
        }

        /** Represents a FavoritesAction. */
        class FavoritesAction implements IFavoritesAction {

            /**
             * Constructs a new FavoritesAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction);

            /** FavoritesAction favorites. */
            public favorites: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite[];

            /**
             * Creates a new FavoritesAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FavoritesAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction;

            /**
             * Encodes the specified FavoritesAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.verify|verify} messages.
             * @param message FavoritesAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FavoritesAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.verify|verify} messages.
             * @param message FavoritesAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IFavoritesAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FavoritesAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FavoritesAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction;

            /**
             * Decodes a FavoritesAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FavoritesAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction;

            /**
             * Creates a plain object from a FavoritesAction message. Also converts values to other types if specified.
             * @param message FavoritesAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite);

                /** Favorite ID. */
                public ID: string;

                /**
                 * Creates a new Favorite instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Favorite instance
                 */
                public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite;

                /**
                 * Encodes the specified Favorite message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.verify|verify} messages.
                 * @param message Favorite message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Favorite message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite.verify|verify} messages.
                 * @param message Favorite message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.IFavorite, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Favorite message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Favorite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite;

                /**
                 * Decodes a Favorite message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Favorite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite;

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
                public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite;

                /**
                 * Creates a plain object from a Favorite message. Also converts values to other types if specified.
                 * @param message Favorite
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.FavoritesAction.Favorite, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction);

            /** PrivacySettingDisableLinkPreviewsAction isPreviewsDisabled. */
            public isPreviewsDisabled: boolean;

            /**
             * Creates a new PrivacySettingDisableLinkPreviewsAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PrivacySettingDisableLinkPreviewsAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;

            /**
             * Encodes the specified PrivacySettingDisableLinkPreviewsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
             * @param message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PrivacySettingDisableLinkPreviewsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction.verify|verify} messages.
             * @param message PrivacySettingDisableLinkPreviewsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingDisableLinkPreviewsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PrivacySettingDisableLinkPreviewsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;

            /**
             * Decodes a PrivacySettingDisableLinkPreviewsAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PrivacySettingDisableLinkPreviewsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction;

            /**
             * Creates a plain object from a PrivacySettingDisableLinkPreviewsAction message. Also converts values to other types if specified.
             * @param message PrivacySettingDisableLinkPreviewsAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PrivacySettingDisableLinkPreviewsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction);

            /** WamoUserIdentifierAction identifier. */
            public identifier: string;

            /**
             * Creates a new WamoUserIdentifierAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WamoUserIdentifierAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction): WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction;

            /**
             * Encodes the specified WamoUserIdentifierAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.verify|verify} messages.
             * @param message WamoUserIdentifierAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WamoUserIdentifierAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction.verify|verify} messages.
             * @param message WamoUserIdentifierAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IWamoUserIdentifierAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WamoUserIdentifierAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WamoUserIdentifierAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction;

            /**
             * Decodes a WamoUserIdentifierAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WamoUserIdentifierAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction;

            /**
             * Creates a plain object from a WamoUserIdentifierAction message. Also converts values to other types if specified.
             * @param message WamoUserIdentifierAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.WamoUserIdentifierAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ILockChatAction);

            /** LockChatAction locked. */
            public locked: boolean;

            /**
             * Creates a new LockChatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LockChatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ILockChatAction): WAWebProtobufSyncAction.SyncActionValue.LockChatAction;

            /**
             * Encodes the specified LockChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LockChatAction.verify|verify} messages.
             * @param message LockChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ILockChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LockChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LockChatAction.verify|verify} messages.
             * @param message LockChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ILockChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LockChatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LockChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.LockChatAction;

            /**
             * Decodes a LockChatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LockChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.LockChatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.LockChatAction;

            /**
             * Creates a plain object from a LockChatAction message. Also converts values to other types if specified.
             * @param message LockChatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.LockChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            customPaymentMethods?: (WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod[]|null);
        }

        /** Represents a CustomPaymentMethodsAction. */
        class CustomPaymentMethodsAction implements ICustomPaymentMethodsAction {

            /**
             * Constructs a new CustomPaymentMethodsAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction);

            /** CustomPaymentMethodsAction customPaymentMethods. */
            public customPaymentMethods: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod[];

            /**
             * Creates a new CustomPaymentMethodsAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CustomPaymentMethodsAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction;

            /**
             * Encodes the specified CustomPaymentMethodsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.verify|verify} messages.
             * @param message CustomPaymentMethodsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CustomPaymentMethodsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction.verify|verify} messages.
             * @param message CustomPaymentMethodsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CustomPaymentMethodsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction;

            /**
             * Decodes a CustomPaymentMethodsAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CustomPaymentMethodsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction;

            /**
             * Creates a plain object from a CustomPaymentMethodsAction message. Also converts values to other types if specified.
             * @param message CustomPaymentMethodsAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            metadata?: (WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata[]|null);
        }

        /** Represents a CustomPaymentMethod. */
        class CustomPaymentMethod implements ICustomPaymentMethod {

            /**
             * Constructs a new CustomPaymentMethod.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod);

            /** CustomPaymentMethod credentialID. */
            public credentialID: string;

            /** CustomPaymentMethod country. */
            public country: string;

            /** CustomPaymentMethod type. */
            public type: string;

            /** CustomPaymentMethod metadata. */
            public metadata: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata[];

            /**
             * Creates a new CustomPaymentMethod instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CustomPaymentMethod instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod;

            /**
             * Encodes the specified CustomPaymentMethod message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.verify|verify} messages.
             * @param message CustomPaymentMethod message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CustomPaymentMethod message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod.verify|verify} messages.
             * @param message CustomPaymentMethod message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethod, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CustomPaymentMethod message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CustomPaymentMethod
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod;

            /**
             * Decodes a CustomPaymentMethod message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CustomPaymentMethod
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod;

            /**
             * Creates a plain object from a CustomPaymentMethod message. Also converts values to other types if specified.
             * @param message CustomPaymentMethod
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethod, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata);

            /** CustomPaymentMethodMetadata key. */
            public key: string;

            /** CustomPaymentMethodMetadata value. */
            public value: string;

            /**
             * Creates a new CustomPaymentMethodMetadata instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CustomPaymentMethodMetadata instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata;

            /**
             * Encodes the specified CustomPaymentMethodMetadata message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.verify|verify} messages.
             * @param message CustomPaymentMethodMetadata message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CustomPaymentMethodMetadata message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata.verify|verify} messages.
             * @param message CustomPaymentMethodMetadata message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ICustomPaymentMethodMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CustomPaymentMethodMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata;

            /**
             * Decodes a CustomPaymentMethodMetadata message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CustomPaymentMethodMetadata
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata;

            /**
             * Creates a plain object from a CustomPaymentMethodMetadata message. Also converts values to other types if specified.
             * @param message CustomPaymentMethodMetadata
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.CustomPaymentMethodMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction);

            /** PaymentInfoAction cpi. */
            public cpi: string;

            /**
             * Creates a new PaymentInfoAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PaymentInfoAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction): WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction;

            /**
             * Encodes the specified PaymentInfoAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.verify|verify} messages.
             * @param message PaymentInfoAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PaymentInfoAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction.verify|verify} messages.
             * @param message PaymentInfoAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPaymentInfoAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PaymentInfoAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PaymentInfoAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction;

            /**
             * Decodes a PaymentInfoAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PaymentInfoAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction;

            /**
             * Creates a plain object from a PaymentInfoAction message. Also converts values to other types if specified.
             * @param message PaymentInfoAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PaymentInfoAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction);

            /** LabelReorderingAction sortedLabelIDs. */
            public sortedLabelIDs: number[];

            /**
             * Creates a new LabelReorderingAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LabelReorderingAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction): WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction;

            /**
             * Encodes the specified LabelReorderingAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.verify|verify} messages.
             * @param message LabelReorderingAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LabelReorderingAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction.verify|verify} messages.
             * @param message LabelReorderingAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ILabelReorderingAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LabelReorderingAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LabelReorderingAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction;

            /**
             * Decodes a LabelReorderingAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LabelReorderingAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction;

            /**
             * Creates a plain object from a LabelReorderingAction message. Also converts values to other types if specified.
             * @param message LabelReorderingAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.LabelReorderingAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction);

            /** DeleteIndividualCallLogAction peerJID. */
            public peerJID: string;

            /** DeleteIndividualCallLogAction isIncoming. */
            public isIncoming: boolean;

            /**
             * Creates a new DeleteIndividualCallLogAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteIndividualCallLogAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction): WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction;

            /**
             * Encodes the specified DeleteIndividualCallLogAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.verify|verify} messages.
             * @param message DeleteIndividualCallLogAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteIndividualCallLogAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction.verify|verify} messages.
             * @param message DeleteIndividualCallLogAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteIndividualCallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteIndividualCallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction;

            /**
             * Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteIndividualCallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction;

            /**
             * Creates a plain object from a DeleteIndividualCallLogAction message. Also converts values to other types if specified.
             * @param message DeleteIndividualCallLogAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.DeleteIndividualCallLogAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction);

            /** BotWelcomeRequestAction isSent. */
            public isSent: boolean;

            /**
             * Creates a new BotWelcomeRequestAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BotWelcomeRequestAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction): WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction;

            /**
             * Encodes the specified BotWelcomeRequestAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.verify|verify} messages.
             * @param message BotWelcomeRequestAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BotWelcomeRequestAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction.verify|verify} messages.
             * @param message BotWelcomeRequestAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IBotWelcomeRequestAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BotWelcomeRequestAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BotWelcomeRequestAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction;

            /**
             * Decodes a BotWelcomeRequestAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BotWelcomeRequestAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction;

            /**
             * Creates a plain object from a BotWelcomeRequestAction message. Also converts values to other types if specified.
             * @param message BotWelcomeRequestAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.BotWelcomeRequestAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            callLogRecord?: (WAWebProtobufSyncAction.ICallLogRecord|null);
        }

        /** Represents a CallLogAction. */
        class CallLogAction implements ICallLogAction {

            /**
             * Constructs a new CallLogAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ICallLogAction);

            /** CallLogAction callLogRecord. */
            public callLogRecord?: (WAWebProtobufSyncAction.ICallLogRecord|null);

            /**
             * Creates a new CallLogAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallLogAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ICallLogAction): WAWebProtobufSyncAction.SyncActionValue.CallLogAction;

            /**
             * Encodes the specified CallLogAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CallLogAction.verify|verify} messages.
             * @param message CallLogAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ICallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallLogAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.CallLogAction.verify|verify} messages.
             * @param message CallLogAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ICallLogAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallLogAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.CallLogAction;

            /**
             * Decodes a CallLogAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallLogAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.CallLogAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.CallLogAction;

            /**
             * Creates a plain object from a CallLogAction message. Also converts values to other types if specified.
             * @param message CallLogAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.CallLogAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls);

            /** PrivacySettingRelayAllCalls isEnabled. */
            public isEnabled: boolean;

            /**
             * Creates a new PrivacySettingRelayAllCalls instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PrivacySettingRelayAllCalls instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls;

            /**
             * Encodes the specified PrivacySettingRelayAllCalls message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.verify|verify} messages.
             * @param message PrivacySettingRelayAllCalls message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PrivacySettingRelayAllCalls message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls.verify|verify} messages.
             * @param message PrivacySettingRelayAllCalls message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPrivacySettingRelayAllCalls, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PrivacySettingRelayAllCalls
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls;

            /**
             * Decodes a PrivacySettingRelayAllCalls message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PrivacySettingRelayAllCalls
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls;

            /**
             * Creates a plain object from a PrivacySettingRelayAllCalls message. Also converts values to other types if specified.
             * @param message PrivacySettingRelayAllCalls
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PrivacySettingRelayAllCalls, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction);

            /** ExternalWebBetaAction isOptIn. */
            public isOptIn: boolean;

            /**
             * Creates a new ExternalWebBetaAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExternalWebBetaAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction): WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction;

            /**
             * Encodes the specified ExternalWebBetaAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.verify|verify} messages.
             * @param message ExternalWebBetaAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExternalWebBetaAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction.verify|verify} messages.
             * @param message ExternalWebBetaAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IExternalWebBetaAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExternalWebBetaAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExternalWebBetaAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction;

            /**
             * Decodes an ExternalWebBetaAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExternalWebBetaAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction;

            /**
             * Creates a plain object from an ExternalWebBetaAction message. Also converts values to other types if specified.
             * @param message ExternalWebBetaAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ExternalWebBetaAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction);

            /** MarketingMessageBroadcastAction repliedCount. */
            public repliedCount: number;

            /**
             * Creates a new MarketingMessageBroadcastAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketingMessageBroadcastAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction;

            /**
             * Encodes the specified MarketingMessageBroadcastAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.verify|verify} messages.
             * @param message MarketingMessageBroadcastAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MarketingMessageBroadcastAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction.verify|verify} messages.
             * @param message MarketingMessageBroadcastAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IMarketingMessageBroadcastAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketingMessageBroadcastAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction;

            /**
             * Decodes a MarketingMessageBroadcastAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketingMessageBroadcastAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction;

            /**
             * Creates a plain object from a MarketingMessageBroadcastAction message. Also converts values to other types if specified.
             * @param message MarketingMessageBroadcastAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.MarketingMessageBroadcastAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction);

            /** PnForLidChatAction pnJID. */
            public pnJID: string;

            /**
             * Creates a new PnForLidChatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PnForLidChatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction): WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction;

            /**
             * Encodes the specified PnForLidChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.verify|verify} messages.
             * @param message PnForLidChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PnForLidChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction.verify|verify} messages.
             * @param message PnForLidChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPnForLidChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PnForLidChatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PnForLidChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction;

            /**
             * Decodes a PnForLidChatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PnForLidChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction;

            /**
             * Creates a plain object from a PnForLidChatAction message. Also converts values to other types if specified.
             * @param message PnForLidChatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PnForLidChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction);

            /** ChatAssignmentOpenedStatusAction chatOpened. */
            public chatOpened: boolean;

            /**
             * Creates a new ChatAssignmentOpenedStatusAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ChatAssignmentOpenedStatusAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction;

            /**
             * Encodes the specified ChatAssignmentOpenedStatusAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.verify|verify} messages.
             * @param message ChatAssignmentOpenedStatusAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ChatAssignmentOpenedStatusAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction.verify|verify} messages.
             * @param message ChatAssignmentOpenedStatusAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentOpenedStatusAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ChatAssignmentOpenedStatusAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction;

            /**
             * Decodes a ChatAssignmentOpenedStatusAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ChatAssignmentOpenedStatusAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction;

            /**
             * Creates a plain object from a ChatAssignmentOpenedStatusAction message. Also converts values to other types if specified.
             * @param message ChatAssignmentOpenedStatusAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentOpenedStatusAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction);

            /** ChatAssignmentAction deviceAgentID. */
            public deviceAgentID: string;

            /**
             * Creates a new ChatAssignmentAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ChatAssignmentAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction;

            /**
             * Encodes the specified ChatAssignmentAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.verify|verify} messages.
             * @param message ChatAssignmentAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ChatAssignmentAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction.verify|verify} messages.
             * @param message ChatAssignmentAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IChatAssignmentAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ChatAssignmentAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ChatAssignmentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction;

            /**
             * Decodes a ChatAssignmentAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ChatAssignmentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction;

            /**
             * Creates a plain object from a ChatAssignmentAction message. Also converts values to other types if specified.
             * @param message ChatAssignmentAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ChatAssignmentAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IStickerAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IStickerAction): WAWebProtobufSyncAction.SyncActionValue.StickerAction;

            /**
             * Encodes the specified StickerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StickerAction.verify|verify} messages.
             * @param message StickerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StickerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StickerAction.verify|verify} messages.
             * @param message StickerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StickerAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.StickerAction;

            /**
             * Decodes a StickerAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.StickerAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.StickerAction;

            /**
             * Creates a plain object from a StickerAction message. Also converts values to other types if specified.
             * @param message StickerAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.StickerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction);

            /** RemoveRecentStickerAction lastStickerSentTS. */
            public lastStickerSentTS: (number|Long);

            /**
             * Creates a new RemoveRecentStickerAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RemoveRecentStickerAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction): WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction;

            /**
             * Encodes the specified RemoveRecentStickerAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.verify|verify} messages.
             * @param message RemoveRecentStickerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RemoveRecentStickerAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction.verify|verify} messages.
             * @param message RemoveRecentStickerAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IRemoveRecentStickerAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RemoveRecentStickerAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RemoveRecentStickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction;

            /**
             * Decodes a RemoveRecentStickerAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RemoveRecentStickerAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction;

            /**
             * Creates a plain object from a RemoveRecentStickerAction message. Also converts values to other types if specified.
             * @param message RemoveRecentStickerAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.RemoveRecentStickerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction);

            /** PrimaryVersionAction version. */
            public version: string;

            /**
             * Creates a new PrimaryVersionAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PrimaryVersionAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction): WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction;

            /**
             * Encodes the specified PrimaryVersionAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.verify|verify} messages.
             * @param message PrimaryVersionAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PrimaryVersionAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction.verify|verify} messages.
             * @param message PrimaryVersionAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPrimaryVersionAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PrimaryVersionAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PrimaryVersionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction;

            /**
             * Decodes a PrimaryVersionAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PrimaryVersionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction;

            /**
             * Creates a plain object from a PrimaryVersionAction message. Also converts values to other types if specified.
             * @param message PrimaryVersionAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PrimaryVersionAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.INuxAction);

            /** NuxAction acknowledged. */
            public acknowledged: boolean;

            /**
             * Creates a new NuxAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NuxAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.INuxAction): WAWebProtobufSyncAction.SyncActionValue.NuxAction;

            /**
             * Encodes the specified NuxAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NuxAction.verify|verify} messages.
             * @param message NuxAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.INuxAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NuxAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.NuxAction.verify|verify} messages.
             * @param message NuxAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.INuxAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NuxAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns NuxAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.NuxAction;

            /**
             * Decodes a NuxAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns NuxAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.NuxAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.NuxAction;

            /**
             * Creates a plain object from a NuxAction message. Also converts values to other types if specified.
             * @param message NuxAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.NuxAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction);

            /** TimeFormatAction isTwentyFourHourFormatEnabled. */
            public isTwentyFourHourFormatEnabled: boolean;

            /**
             * Creates a new TimeFormatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TimeFormatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction): WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction;

            /**
             * Encodes the specified TimeFormatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.verify|verify} messages.
             * @param message TimeFormatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TimeFormatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction.verify|verify} messages.
             * @param message TimeFormatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ITimeFormatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TimeFormatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TimeFormatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction;

            /**
             * Decodes a TimeFormatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TimeFormatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction;

            /**
             * Creates a plain object from a TimeFormatAction message. Also converts values to other types if specified.
             * @param message TimeFormatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.TimeFormatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction);

            /** UserStatusMuteAction muted. */
            public muted: boolean;

            /**
             * Creates a new UserStatusMuteAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UserStatusMuteAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction): WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction;

            /**
             * Encodes the specified UserStatusMuteAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.verify|verify} messages.
             * @param message UserStatusMuteAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UserStatusMuteAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction.verify|verify} messages.
             * @param message UserStatusMuteAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IUserStatusMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UserStatusMuteAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UserStatusMuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction;

            /**
             * Decodes a UserStatusMuteAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UserStatusMuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction;

            /**
             * Creates a plain object from a UserStatusMuteAction message. Also converts values to other types if specified.
             * @param message UserStatusMuteAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.UserStatusMuteAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction): WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction;

            /**
             * Encodes the specified SubscriptionAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.verify|verify} messages.
             * @param message SubscriptionAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubscriptionAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction.verify|verify} messages.
             * @param message SubscriptionAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ISubscriptionAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubscriptionAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubscriptionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction;

            /**
             * Decodes a SubscriptionAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubscriptionAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction;

            /**
             * Creates a plain object from a SubscriptionAction message. Also converts values to other types if specified.
             * @param message SubscriptionAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.SubscriptionAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IAgentAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IAgentAction): WAWebProtobufSyncAction.SyncActionValue.AgentAction;

            /**
             * Encodes the specified AgentAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AgentAction.verify|verify} messages.
             * @param message AgentAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IAgentAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AgentAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AgentAction.verify|verify} messages.
             * @param message AgentAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IAgentAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AgentAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AgentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.AgentAction;

            /**
             * Decodes an AgentAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AgentAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.AgentAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.AgentAction;

            /**
             * Creates a plain object from an AgentAction message. Also converts values to other types if specified.
             * @param message AgentAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.AgentAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions);

            /** AndroidUnsupportedActions allowed. */
            public allowed: boolean;

            /**
             * Creates a new AndroidUnsupportedActions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AndroidUnsupportedActions instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions): WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions;

            /**
             * Encodes the specified AndroidUnsupportedActions message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.verify|verify} messages.
             * @param message AndroidUnsupportedActions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AndroidUnsupportedActions message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions.verify|verify} messages.
             * @param message AndroidUnsupportedActions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IAndroidUnsupportedActions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AndroidUnsupportedActions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AndroidUnsupportedActions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions;

            /**
             * Decodes an AndroidUnsupportedActions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AndroidUnsupportedActions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions;

            /**
             * Creates a plain object from an AndroidUnsupportedActions message. Also converts values to other types if specified.
             * @param message AndroidUnsupportedActions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.AndroidUnsupportedActions, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature);

            /** PrimaryFeature flags. */
            public flags: string[];

            /**
             * Creates a new PrimaryFeature instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PrimaryFeature instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature): WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature;

            /**
             * Encodes the specified PrimaryFeature message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.verify|verify} messages.
             * @param message PrimaryFeature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PrimaryFeature message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature.verify|verify} messages.
             * @param message PrimaryFeature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPrimaryFeature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PrimaryFeature message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PrimaryFeature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature;

            /**
             * Decodes a PrimaryFeature message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PrimaryFeature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature;

            /**
             * Creates a plain object from a PrimaryFeature message. Also converts values to other types if specified.
             * @param message PrimaryFeature
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PrimaryFeature, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration);

            /** KeyExpiration expiredKeyEpoch. */
            public expiredKeyEpoch: number;

            /**
             * Creates a new KeyExpiration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KeyExpiration instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration): WAWebProtobufSyncAction.SyncActionValue.KeyExpiration;

            /**
             * Encodes the specified KeyExpiration message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.verify|verify} messages.
             * @param message KeyExpiration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KeyExpiration message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.KeyExpiration.verify|verify} messages.
             * @param message KeyExpiration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IKeyExpiration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KeyExpiration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KeyExpiration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.KeyExpiration;

            /**
             * Decodes a KeyExpiration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KeyExpiration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.KeyExpiration;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.KeyExpiration;

            /**
             * Creates a plain object from a KeyExpiration message. Also converts values to other types if specified.
             * @param message KeyExpiration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.KeyExpiration, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage);

            /** SyncActionMessage key. */
            public key?: (WAProtocol.IMessageKey|null);

            /** SyncActionMessage timestamp. */
            public timestamp: (number|Long);

            /**
             * Creates a new SyncActionMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncActionMessage instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage;

            /**
             * Encodes the specified SyncActionMessage message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.verify|verify} messages.
             * @param message SyncActionMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncActionMessage message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage.verify|verify} messages.
             * @param message SyncActionMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncActionMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncActionMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage;

            /**
             * Decodes a SyncActionMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncActionMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage;

            /**
             * Creates a plain object from a SyncActionMessage message. Also converts values to other types if specified.
             * @param message SyncActionMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.SyncActionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            messages?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage[]|null);
        }

        /** Represents a SyncActionMessageRange. */
        class SyncActionMessageRange implements ISyncActionMessageRange {

            /**
             * Constructs a new SyncActionMessageRange.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange);

            /** SyncActionMessageRange lastMessageTimestamp. */
            public lastMessageTimestamp: (number|Long);

            /** SyncActionMessageRange lastSystemMessageTimestamp. */
            public lastSystemMessageTimestamp: (number|Long);

            /** SyncActionMessageRange messages. */
            public messages: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessage[];

            /**
             * Creates a new SyncActionMessageRange instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SyncActionMessageRange instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange;

            /**
             * Encodes the specified SyncActionMessageRange message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify|verify} messages.
             * @param message SyncActionMessageRange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SyncActionMessageRange message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange.verify|verify} messages.
             * @param message SyncActionMessageRange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SyncActionMessageRange message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SyncActionMessageRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange;

            /**
             * Decodes a SyncActionMessageRange message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SyncActionMessageRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange;

            /**
             * Creates a plain object from a SyncActionMessageRange message. Also converts values to other types if specified.
             * @param message SyncActionMessageRange
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.SyncActionMessageRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting);

            /** UnarchiveChatsSetting unarchiveChats. */
            public unarchiveChats: boolean;

            /**
             * Creates a new UnarchiveChatsSetting instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UnarchiveChatsSetting instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting): WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting;

            /**
             * Encodes the specified UnarchiveChatsSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.verify|verify} messages.
             * @param message UnarchiveChatsSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UnarchiveChatsSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting.verify|verify} messages.
             * @param message UnarchiveChatsSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IUnarchiveChatsSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UnarchiveChatsSetting message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UnarchiveChatsSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting;

            /**
             * Decodes an UnarchiveChatsSetting message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UnarchiveChatsSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting;

            /**
             * Creates a plain object from an UnarchiveChatsSetting message. Also converts values to other types if specified.
             * @param message UnarchiveChatsSetting
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.UnarchiveChatsSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);
        }

        /** Represents a DeleteChatAction. */
        class DeleteChatAction implements IDeleteChatAction {

            /**
             * Constructs a new DeleteChatAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction);

            /** DeleteChatAction messageRange. */
            public messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);

            /**
             * Creates a new DeleteChatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteChatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction): WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction;

            /**
             * Encodes the specified DeleteChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.verify|verify} messages.
             * @param message DeleteChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction.verify|verify} messages.
             * @param message DeleteChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteChatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction;

            /**
             * Decodes a DeleteChatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction;

            /**
             * Creates a plain object from a DeleteChatAction message. Also converts values to other types if specified.
             * @param message DeleteChatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.DeleteChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);
        }

        /** Represents a ClearChatAction. */
        class ClearChatAction implements IClearChatAction {

            /**
             * Constructs a new ClearChatAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IClearChatAction);

            /** ClearChatAction messageRange. */
            public messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);

            /**
             * Creates a new ClearChatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClearChatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IClearChatAction): WAWebProtobufSyncAction.SyncActionValue.ClearChatAction;

            /**
             * Encodes the specified ClearChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.verify|verify} messages.
             * @param message ClearChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IClearChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClearChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ClearChatAction.verify|verify} messages.
             * @param message ClearChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IClearChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClearChatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ClearChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ClearChatAction;

            /**
             * Decodes a ClearChatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ClearChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ClearChatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ClearChatAction;

            /**
             * Creates a plain object from a ClearChatAction message. Also converts values to other types if specified.
             * @param message ClearChatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ClearChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);
        }

        /** Represents a MarkChatAsReadAction. */
        class MarkChatAsReadAction implements IMarkChatAsReadAction {

            /**
             * Constructs a new MarkChatAsReadAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction);

            /** MarkChatAsReadAction read. */
            public read: boolean;

            /** MarkChatAsReadAction messageRange. */
            public messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);

            /**
             * Creates a new MarkChatAsReadAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarkChatAsReadAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction): WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction;

            /**
             * Encodes the specified MarkChatAsReadAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.verify|verify} messages.
             * @param message MarkChatAsReadAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MarkChatAsReadAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction.verify|verify} messages.
             * @param message MarkChatAsReadAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IMarkChatAsReadAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MarkChatAsReadAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarkChatAsReadAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction;

            /**
             * Decodes a MarkChatAsReadAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarkChatAsReadAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction;

            /**
             * Creates a plain object from a MarkChatAsReadAction message. Also converts values to other types if specified.
             * @param message MarkChatAsReadAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.MarkChatAsReadAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction);

            /** DeleteMessageForMeAction deleteMedia. */
            public deleteMedia: boolean;

            /** DeleteMessageForMeAction messageTimestamp. */
            public messageTimestamp: (number|Long);

            /**
             * Creates a new DeleteMessageForMeAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteMessageForMeAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction): WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction;

            /**
             * Encodes the specified DeleteMessageForMeAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.verify|verify} messages.
             * @param message DeleteMessageForMeAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteMessageForMeAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction.verify|verify} messages.
             * @param message DeleteMessageForMeAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IDeleteMessageForMeAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteMessageForMeAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteMessageForMeAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction;

            /**
             * Decodes a DeleteMessageForMeAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteMessageForMeAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction;

            /**
             * Creates a plain object from a DeleteMessageForMeAction message. Also converts values to other types if specified.
             * @param message DeleteMessageForMeAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.DeleteMessageForMeAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);
        }

        /** Represents an ArchiveChatAction. */
        class ArchiveChatAction implements IArchiveChatAction {

            /**
             * Constructs a new ArchiveChatAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction);

            /** ArchiveChatAction archived. */
            public archived: boolean;

            /** ArchiveChatAction messageRange. */
            public messageRange?: (WAWebProtobufSyncAction.SyncActionValue.ISyncActionMessageRange|null);

            /**
             * Creates a new ArchiveChatAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ArchiveChatAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction): WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction;

            /**
             * Encodes the specified ArchiveChatAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.verify|verify} messages.
             * @param message ArchiveChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ArchiveChatAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction.verify|verify} messages.
             * @param message ArchiveChatAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IArchiveChatAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ArchiveChatAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ArchiveChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction;

            /**
             * Decodes an ArchiveChatAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ArchiveChatAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction;

            /**
             * Creates a plain object from an ArchiveChatAction message. Also converts values to other types if specified.
             * @param message ArchiveChatAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ArchiveChatAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            weights?: (WAWebProtobufSyncAction.IRecentEmojiWeight[]|null);
        }

        /** Represents a RecentEmojiWeightsAction. */
        class RecentEmojiWeightsAction implements IRecentEmojiWeightsAction {

            /**
             * Constructs a new RecentEmojiWeightsAction.
             * @param [properties] Properties to set
             */
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction);

            /** RecentEmojiWeightsAction weights. */
            public weights: WAWebProtobufSyncAction.IRecentEmojiWeight[];

            /**
             * Creates a new RecentEmojiWeightsAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RecentEmojiWeightsAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction): WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction;

            /**
             * Encodes the specified RecentEmojiWeightsAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.verify|verify} messages.
             * @param message RecentEmojiWeightsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RecentEmojiWeightsAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction.verify|verify} messages.
             * @param message RecentEmojiWeightsAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IRecentEmojiWeightsAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RecentEmojiWeightsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction;

            /**
             * Decodes a RecentEmojiWeightsAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RecentEmojiWeightsAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction;

            /**
             * Creates a plain object from a RecentEmojiWeightsAction message. Also converts values to other types if specified.
             * @param message RecentEmojiWeightsAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.RecentEmojiWeightsAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction): WAWebProtobufSyncAction.SyncActionValue.LabelEditAction;

            /**
             * Encodes the specified LabelEditAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.verify|verify} messages.
             * @param message LabelEditAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LabelEditAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelEditAction.verify|verify} messages.
             * @param message LabelEditAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ILabelEditAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LabelEditAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LabelEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.LabelEditAction;

            /**
             * Decodes a LabelEditAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LabelEditAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.LabelEditAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.LabelEditAction;

            /**
             * Creates a plain object from a LabelEditAction message. Also converts values to other types if specified.
             * @param message LabelEditAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.LabelEditAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction);

            /** LabelAssociationAction labeled. */
            public labeled: boolean;

            /**
             * Creates a new LabelAssociationAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LabelAssociationAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction): WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction;

            /**
             * Encodes the specified LabelAssociationAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.verify|verify} messages.
             * @param message LabelAssociationAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LabelAssociationAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction.verify|verify} messages.
             * @param message LabelAssociationAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ILabelAssociationAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LabelAssociationAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LabelAssociationAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction;

            /**
             * Decodes a LabelAssociationAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LabelAssociationAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction;

            /**
             * Creates a plain object from a LabelAssociationAction message. Also converts values to other types if specified.
             * @param message LabelAssociationAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.LabelAssociationAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction): WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction;

            /**
             * Encodes the specified QuickReplyAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.verify|verify} messages.
             * @param message QuickReplyAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified QuickReplyAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction.verify|verify} messages.
             * @param message QuickReplyAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IQuickReplyAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a QuickReplyAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns QuickReplyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction;

            /**
             * Decodes a QuickReplyAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns QuickReplyAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction;

            /**
             * Creates a plain object from a QuickReplyAction message. Also converts values to other types if specified.
             * @param message QuickReplyAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.QuickReplyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting);

            /** LocaleSetting locale. */
            public locale: string;

            /**
             * Creates a new LocaleSetting instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocaleSetting instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting): WAWebProtobufSyncAction.SyncActionValue.LocaleSetting;

            /**
             * Encodes the specified LocaleSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.verify|verify} messages.
             * @param message LocaleSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocaleSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.LocaleSetting.verify|verify} messages.
             * @param message LocaleSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ILocaleSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocaleSetting message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocaleSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.LocaleSetting;

            /**
             * Decodes a LocaleSetting message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocaleSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.LocaleSetting;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.LocaleSetting;

            /**
             * Creates a plain object from a LocaleSetting message. Also converts values to other types if specified.
             * @param message LocaleSetting
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.LocaleSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting);

            /** PushNameSetting name. */
            public name: string;

            /**
             * Creates a new PushNameSetting instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PushNameSetting instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting): WAWebProtobufSyncAction.SyncActionValue.PushNameSetting;

            /**
             * Encodes the specified PushNameSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.verify|verify} messages.
             * @param message PushNameSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PushNameSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PushNameSetting.verify|verify} messages.
             * @param message PushNameSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPushNameSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PushNameSetting message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PushNameSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PushNameSetting;

            /**
             * Decodes a PushNameSetting message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PushNameSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PushNameSetting;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PushNameSetting;

            /**
             * Creates a plain object from a PushNameSetting message. Also converts values to other types if specified.
             * @param message PushNameSetting
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PushNameSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting);

            /** SecurityNotificationSetting showNotification. */
            public showNotification: boolean;

            /**
             * Creates a new SecurityNotificationSetting instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SecurityNotificationSetting instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting): WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting;

            /**
             * Encodes the specified SecurityNotificationSetting message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.verify|verify} messages.
             * @param message SecurityNotificationSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SecurityNotificationSetting message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting.verify|verify} messages.
             * @param message SecurityNotificationSetting message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.ISecurityNotificationSetting, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SecurityNotificationSetting message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SecurityNotificationSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting;

            /**
             * Decodes a SecurityNotificationSetting message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SecurityNotificationSetting
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting;

            /**
             * Creates a plain object from a SecurityNotificationSetting message. Also converts values to other types if specified.
             * @param message SecurityNotificationSetting
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.SecurityNotificationSetting, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IPinAction);

            /** PinAction pinned. */
            public pinned: boolean;

            /**
             * Creates a new PinAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PinAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IPinAction): WAWebProtobufSyncAction.SyncActionValue.PinAction;

            /**
             * Encodes the specified PinAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PinAction.verify|verify} messages.
             * @param message PinAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IPinAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PinAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.PinAction.verify|verify} messages.
             * @param message PinAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IPinAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PinAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PinAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.PinAction;

            /**
             * Decodes a PinAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PinAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.PinAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.PinAction;

            /**
             * Creates a plain object from a PinAction message. Also converts values to other types if specified.
             * @param message PinAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.PinAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IMuteAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IMuteAction): WAWebProtobufSyncAction.SyncActionValue.MuteAction;

            /**
             * Encodes the specified MuteAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MuteAction.verify|verify} messages.
             * @param message MuteAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MuteAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.MuteAction.verify|verify} messages.
             * @param message MuteAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IMuteAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MuteAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.MuteAction;

            /**
             * Decodes a MuteAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MuteAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.MuteAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.MuteAction;

            /**
             * Creates a plain object from a MuteAction message. Also converts values to other types if specified.
             * @param message MuteAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.MuteAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IContactAction);

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
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IContactAction): WAWebProtobufSyncAction.SyncActionValue.ContactAction;

            /**
             * Encodes the specified ContactAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ContactAction.verify|verify} messages.
             * @param message ContactAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IContactAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ContactAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.ContactAction.verify|verify} messages.
             * @param message ContactAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IContactAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ContactAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ContactAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.ContactAction;

            /**
             * Decodes a ContactAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ContactAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.ContactAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.ContactAction;

            /**
             * Creates a plain object from a ContactAction message. Also converts values to other types if specified.
             * @param message ContactAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.ContactAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: WAWebProtobufSyncAction.SyncActionValue.IStarAction);

            /** StarAction starred. */
            public starred: boolean;

            /**
             * Creates a new StarAction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StarAction instance
             */
            public static create(properties?: WAWebProtobufSyncAction.SyncActionValue.IStarAction): WAWebProtobufSyncAction.SyncActionValue.StarAction;

            /**
             * Encodes the specified StarAction message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StarAction.verify|verify} messages.
             * @param message StarAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: WAWebProtobufSyncAction.SyncActionValue.IStarAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StarAction message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionValue.StarAction.verify|verify} messages.
             * @param message StarAction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: WAWebProtobufSyncAction.SyncActionValue.IStarAction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StarAction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StarAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionValue.StarAction;

            /**
             * Decodes a StarAction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StarAction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionValue.StarAction;

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
            public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionValue.StarAction;

            /**
             * Creates a plain object from a StarAction message. Also converts values to other types if specified.
             * @param message StarAction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WAWebProtobufSyncAction.SyncActionValue.StarAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
        senderPlatform?: (WAWebProtobufSyncAction.PatchDebugData.Platform|null);

        /** PatchDebugData isSenderPrimary */
        isSenderPrimary?: (boolean|null);
    }

    /** Represents a PatchDebugData. */
    class PatchDebugData implements IPatchDebugData {

        /**
         * Constructs a new PatchDebugData.
         * @param [properties] Properties to set
         */
        constructor(properties?: WAWebProtobufSyncAction.IPatchDebugData);

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
        public senderPlatform: WAWebProtobufSyncAction.PatchDebugData.Platform;

        /** PatchDebugData isSenderPrimary. */
        public isSenderPrimary: boolean;

        /**
         * Creates a new PatchDebugData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PatchDebugData instance
         */
        public static create(properties?: WAWebProtobufSyncAction.IPatchDebugData): WAWebProtobufSyncAction.PatchDebugData;

        /**
         * Encodes the specified PatchDebugData message. Does not implicitly {@link WAWebProtobufSyncAction.PatchDebugData.verify|verify} messages.
         * @param message PatchDebugData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWebProtobufSyncAction.IPatchDebugData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PatchDebugData message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.PatchDebugData.verify|verify} messages.
         * @param message PatchDebugData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWebProtobufSyncAction.IPatchDebugData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PatchDebugData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.PatchDebugData;

        /**
         * Decodes a PatchDebugData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PatchDebugData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.PatchDebugData;

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
        public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.PatchDebugData;

        /**
         * Creates a plain object from a PatchDebugData message. Also converts values to other types if specified.
         * @param message PatchDebugData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWebProtobufSyncAction.PatchDebugData, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
        constructor(properties?: WAWebProtobufSyncAction.IRecentEmojiWeight);

        /** RecentEmojiWeight emoji. */
        public emoji: string;

        /** RecentEmojiWeight weight. */
        public weight: number;

        /**
         * Creates a new RecentEmojiWeight instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecentEmojiWeight instance
         */
        public static create(properties?: WAWebProtobufSyncAction.IRecentEmojiWeight): WAWebProtobufSyncAction.RecentEmojiWeight;

        /**
         * Encodes the specified RecentEmojiWeight message. Does not implicitly {@link WAWebProtobufSyncAction.RecentEmojiWeight.verify|verify} messages.
         * @param message RecentEmojiWeight message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWebProtobufSyncAction.IRecentEmojiWeight, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecentEmojiWeight message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.RecentEmojiWeight.verify|verify} messages.
         * @param message RecentEmojiWeight message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWebProtobufSyncAction.IRecentEmojiWeight, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecentEmojiWeight message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.RecentEmojiWeight;

        /**
         * Decodes a RecentEmojiWeight message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecentEmojiWeight
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.RecentEmojiWeight;

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
        public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.RecentEmojiWeight;

        /**
         * Creates a plain object from a RecentEmojiWeight message. Also converts values to other types if specified.
         * @param message RecentEmojiWeight
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWebProtobufSyncAction.RecentEmojiWeight, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Properties of a SyncActionData. */
    interface ISyncActionData {

        /** SyncActionData index */
        index?: (Uint8Array|null);

        /** SyncActionData value */
        value?: (WAWebProtobufSyncAction.ISyncActionValue|null);

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
        constructor(properties?: WAWebProtobufSyncAction.ISyncActionData);

        /** SyncActionData index. */
        public index: Uint8Array;

        /** SyncActionData value. */
        public value?: (WAWebProtobufSyncAction.ISyncActionValue|null);

        /** SyncActionData padding. */
        public padding: Uint8Array;

        /** SyncActionData version. */
        public version: number;

        /**
         * Creates a new SyncActionData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncActionData instance
         */
        public static create(properties?: WAWebProtobufSyncAction.ISyncActionData): WAWebProtobufSyncAction.SyncActionData;

        /**
         * Encodes the specified SyncActionData message. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionData.verify|verify} messages.
         * @param message SyncActionData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: WAWebProtobufSyncAction.ISyncActionData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncActionData message, length delimited. Does not implicitly {@link WAWebProtobufSyncAction.SyncActionData.verify|verify} messages.
         * @param message SyncActionData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: WAWebProtobufSyncAction.ISyncActionData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncActionData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): WAWebProtobufSyncAction.SyncActionData;

        /**
         * Decodes a SyncActionData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncActionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): WAWebProtobufSyncAction.SyncActionData;

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
        public static fromObject(object: { [k: string]: any }): WAWebProtobufSyncAction.SyncActionData;

        /**
         * Creates a plain object from a SyncActionData message. Also converts values to other types if specified.
         * @param message SyncActionData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: WAWebProtobufSyncAction.SyncActionData, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
