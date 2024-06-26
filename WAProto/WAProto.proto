syntax = "proto2";
package proto;

message ADVDeviceIdentity {
    optional uint32 rawId = 1;
    optional uint64 timestamp = 2;
    optional uint32 keyIndex = 3;
    optional ADVEncryptionType accountType = 4;
    optional ADVEncryptionType deviceType = 5;
}

enum ADVEncryptionType {
    E2EE = 0;
    HOSTED = 1;
}
message ADVKeyIndexList {
    optional uint32 rawId = 1;
    optional uint64 timestamp = 2;
    optional uint32 currentIndex = 3;
    repeated uint32 validIndexes = 4 [packed=true];
    optional ADVEncryptionType accountType = 5;
}

message ADVSignedDeviceIdentity {
    optional bytes details = 1;
    optional bytes accountSignatureKey = 2;
    optional bytes accountSignature = 3;
    optional bytes deviceSignature = 4;
}

message ADVSignedDeviceIdentityHMAC {
    optional bytes details = 1;
    optional bytes hmac = 2;
    optional ADVEncryptionType accountType = 3;
}

message ADVSignedKeyIndexList {
    optional bytes details = 1;
    optional bytes accountSignature = 2;
    optional bytes accountSignatureKey = 3;
}

message ActionLink {
    optional string url = 1;
    optional string buttonTitle = 2;
}

message AutoDownloadSettings {
    optional bool downloadImages = 1;
    optional bool downloadAudio = 2;
    optional bool downloadVideo = 3;
    optional bool downloadDocuments = 4;
}

message AvatarUserSettings {
    optional string fbid = 1;
    optional string password = 2;
}

message BizAccountLinkInfo {
    optional uint64 whatsappBizAcctFbid = 1;
    optional string whatsappAcctNumber = 2;
    optional uint64 issueTime = 3;
    optional HostStorageType hostStorage = 4;
    optional AccountType accountType = 5;
    enum AccountType {
        ENTERPRISE = 0;
    }
    enum HostStorageType {
        ON_PREMISE = 0;
        FACEBOOK = 1;
    }
}

message BizAccountPayload {
    optional VerifiedNameCertificate vnameCert = 1;
    optional bytes bizAcctLinkInfo = 2;
}

message BizIdentityInfo {
    optional VerifiedLevelValue vlevel = 1;
    optional VerifiedNameCertificate vnameCert = 2;
    optional bool signed = 3;
    optional bool revoked = 4;
    optional HostStorageType hostStorage = 5;
    optional ActualActorsType actualActors = 6;
    optional uint64 privacyModeTs = 7;
    optional uint64 featureControls = 8;
    enum ActualActorsType {
        SELF = 0;
        BSP = 1;
    }
    enum HostStorageType {
        ON_PREMISE = 0;
        FACEBOOK = 1;
    }
    enum VerifiedLevelValue {
        UNKNOWN = 0;
        LOW = 1;
        HIGH = 2;
    }
}

message BotAvatarMetadata {
    optional uint32 sentiment = 1;
    optional string behaviorGraph = 2;
    optional uint32 action = 3;
    optional uint32 intensity = 4;
    optional uint32 wordCount = 5;
}

message BotMetadata {
    optional BotAvatarMetadata avatarMetadata = 1;
    optional string personaId = 2;
    optional BotPluginMetadata pluginMetadata = 3;
    optional BotSuggestedPromptMetadata suggestedPromptMetadata = 4;
    optional string invokerJid = 5;
}

message BotPluginMetadata {
    optional SearchProvider provider = 1;
    optional PluginType pluginType = 2;
    optional string thumbnailCdnUrl = 3;
    optional string profilePhotoCdnUrl = 4;
    optional string searchProviderUrl = 5;
    optional uint32 referenceIndex = 6;
    optional uint32 expectedLinksCount = 7;
    optional uint32 pluginVersion = 8;
    enum PluginType {
        REELS = 1;
        SEARCH = 2;
    }
    enum SearchProvider {
        BING = 1;
        GOOGLE = 2;
    }
}

message BotSuggestedPromptMetadata {
    repeated string suggestedPrompts = 1;
    optional uint32 selectedPromptIndex = 2;
}

message CallLogRecord {
    optional CallResult callResult = 1;
    optional bool isDndMode = 2;
    optional SilenceReason silenceReason = 3;
    optional int64 duration = 4;
    optional int64 startTime = 5;
    optional bool isIncoming = 6;
    optional bool isVideo = 7;
    optional bool isCallLink = 8;
    optional string callLinkToken = 9;
    optional string scheduledCallId = 10;
    optional string callId = 11;
    optional string callCreatorJid = 12;
    optional string groupJid = 13;
    repeated ParticipantInfo participants = 14;
    optional CallType callType = 15;
    enum CallResult {
        CONNECTED = 0;
        REJECTED = 1;
        CANCELLED = 2;
        ACCEPTEDELSEWHERE = 3;
        MISSED = 4;
        INVALID = 5;
        UNAVAILABLE = 6;
        UPCOMING = 7;
        FAILED = 8;
        ABANDONED = 9;
        ONGOING = 10;
    }
    enum CallType {
        REGULAR = 0;
        SCHEDULED_CALL = 1;
        VOICE_CHAT = 2;
    }
    message ParticipantInfo {
        optional string userJid = 1;
        optional CallLogRecord.CallResult callResult = 2;
    }
    
    enum SilenceReason {
        NONE = 0;
        SCHEDULED = 1;
        PRIVACY = 2;
        LIGHTWEIGHT = 3;
    }
}

message CertChain {
    optional NoiseCertificate leaf = 1;
    optional NoiseCertificate intermediate = 2;
    message NoiseCertificate {
        optional bytes details = 1;
        optional bytes signature = 2;
        message Details {
            optional uint32 serial = 1;
            optional uint32 issuerSerial = 2;
            optional bytes key = 3;
            optional uint64 notBefore = 4;
            optional uint64 notAfter = 5;
        }
        
    }
    
}

message ChatRowOpaqueData {
    optional DraftMessage draftMessage = 1;
    message DraftMessage {
        optional string text = 1;
        optional string omittedUrl = 2;
        optional CtwaContextLinkData ctwaContextLinkData = 3;
        optional CtwaContextData ctwaContext = 4;
        optional int64 timestamp = 5;
        message CtwaContextData {
            optional string conversionSource = 1;
            optional bytes conversionData = 2;
            optional string sourceUrl = 3;
            optional string sourceId = 4;
            optional string sourceType = 5;
            optional string title = 6;
            optional string description = 7;
            optional string thumbnail = 8;
            optional string thumbnailUrl = 9;
            optional ContextInfoExternalAdReplyInfoMediaType mediaType = 10;
            optional string mediaUrl = 11;
            optional bool isSuspiciousLink = 12;
            enum ContextInfoExternalAdReplyInfoMediaType {
                NONE = 0;
                IMAGE = 1;
                VIDEO = 2;
            }
        }
        
        message CtwaContextLinkData {
            optional string context = 1;
            optional string sourceUrl = 2;
            optional string icebreaker = 3;
            optional string phone = 4;
        }
        
    }
    
}

message ClientPayload {
    optional uint64 username = 1;
    optional bool passive = 3;
    optional UserAgent userAgent = 5;
    optional WebInfo webInfo = 6;
    optional string pushName = 7;
    optional sfixed32 sessionId = 9;
    optional bool shortConnect = 10;
    optional ConnectType connectType = 12;
    optional ConnectReason connectReason = 13;
    repeated int32 shards = 14;
    optional DNSSource dnsSource = 15;
    optional uint32 connectAttemptCount = 16;
    optional uint32 device = 18;
    optional DevicePairingRegistrationData devicePairingData = 19;
    optional Product product = 20;
    optional bytes fbCat = 21;
    optional bytes fbUserAgent = 22;
    optional bool oc = 23;
    optional int32 lc = 24;
    optional IOSAppExtension iosAppExtension = 30;
    optional uint64 fbAppId = 31;
    optional bytes fbDeviceId = 32;
    optional bool pull = 33;
    optional bytes paddingBytes = 34;
    optional int32 yearClass = 36;
    optional int32 memClass = 37;
    optional InteropData interopData = 38;
    enum ConnectReason {
        PUSH = 0;
        USER_ACTIVATED = 1;
        SCHEDULED = 2;
        ERROR_RECONNECT = 3;
        NETWORK_SWITCH = 4;
        PING_RECONNECT = 5;
        UNKNOWN = 6;
    }
    enum ConnectType {
        CELLULAR_UNKNOWN = 0;
        WIFI_UNKNOWN = 1;
        CELLULAR_EDGE = 100;
        CELLULAR_IDEN = 101;
        CELLULAR_UMTS = 102;
        CELLULAR_EVDO = 103;
        CELLULAR_GPRS = 104;
        CELLULAR_HSDPA = 105;
        CELLULAR_HSUPA = 106;
        CELLULAR_HSPA = 107;
        CELLULAR_CDMA = 108;
        CELLULAR_1XRTT = 109;
        CELLULAR_EHRPD = 110;
        CELLULAR_LTE = 111;
        CELLULAR_HSPAP = 112;
    }
    message DNSSource {
        optional DNSResolutionMethod dnsMethod = 15;
        optional bool appCached = 16;
        enum DNSResolutionMethod {
            SYSTEM = 0;
            GOOGLE = 1;
            HARDCODED = 2;
            OVERRIDE = 3;
            FALLBACK = 4;
        }
    }
    
    message DevicePairingRegistrationData {
        optional bytes eRegid = 1;
        optional bytes eKeytype = 2;
        optional bytes eIdent = 3;
        optional bytes eSkeyId = 4;
        optional bytes eSkeyVal = 5;
        optional bytes eSkeySig = 6;
        optional bytes buildHash = 7;
        optional bytes deviceProps = 8;
    }
    
    enum IOSAppExtension {
        SHARE_EXTENSION = 0;
        SERVICE_EXTENSION = 1;
        INTENTS_EXTENSION = 2;
    }
    message InteropData {
        optional uint64 accountId = 1;
        optional bytes token = 2;
    }
    
    enum Product {
        WHATSAPP = 0;
        MESSENGER = 1;
        INTEROP = 2;
        INTEROP_MSGR = 3;
    }
    message UserAgent {
        optional Platform platform = 1;
        optional AppVersion appVersion = 2;
        optional string mcc = 3;
        optional string mnc = 4;
        optional string osVersion = 5;
        optional string manufacturer = 6;
        optional string device = 7;
        optional string osBuildNumber = 8;
        optional string phoneId = 9;
        optional ReleaseChannel releaseChannel = 10;
        optional string localeLanguageIso6391 = 11;
        optional string localeCountryIso31661Alpha2 = 12;
        optional string deviceBoard = 13;
        optional string deviceExpId = 14;
        optional DeviceType deviceType = 15;
        message AppVersion {
            optional uint32 primary = 1;
            optional uint32 secondary = 2;
            optional uint32 tertiary = 3;
            optional uint32 quaternary = 4;
            optional uint32 quinary = 5;
        }
        
        enum DeviceType {
            PHONE = 0;
            TABLET = 1;
            DESKTOP = 2;
            WEARABLE = 3;
            VR = 4;
        }
        enum Platform {
            ANDROID = 0;
            IOS = 1;
            WINDOWS_PHONE = 2;
            BLACKBERRY = 3;
            BLACKBERRYX = 4;
            S40 = 5;
            S60 = 6;
            PYTHON_CLIENT = 7;
            TIZEN = 8;
            ENTERPRISE = 9;
            SMB_ANDROID = 10;
            KAIOS = 11;
            SMB_IOS = 12;
            WINDOWS = 13;
            WEB = 14;
            PORTAL = 15;
            GREEN_ANDROID = 16;
            GREEN_IPHONE = 17;
            BLUE_ANDROID = 18;
            BLUE_IPHONE = 19;
            FBLITE_ANDROID = 20;
            MLITE_ANDROID = 21;
            IGLITE_ANDROID = 22;
            PAGE = 23;
            MACOS = 24;
            OCULUS_MSG = 25;
            OCULUS_CALL = 26;
            MILAN = 27;
            CAPI = 28;
            WEAROS = 29;
            ARDEVICE = 30;
            VRDEVICE = 31;
            BLUE_WEB = 32;
            IPAD = 33;
            TEST = 34;
            SMART_GLASSES = 35;
        }
        enum ReleaseChannel {
            RELEASE = 0;
            BETA = 1;
            ALPHA = 2;
            DEBUG = 3;
        }
    }
    
    message WebInfo {
        optional string refToken = 1;
        optional string version = 2;
        optional WebdPayload webdPayload = 3;
        optional WebSubPlatform webSubPlatform = 4;
        enum WebSubPlatform {
            WEB_BROWSER = 0;
            APP_STORE = 1;
            WIN_STORE = 2;
            DARWIN = 3;
            WIN32 = 4;
        }
        message WebdPayload {
            optional bool usesParticipantInKey = 1;
            optional bool supportsStarredMessages = 2;
            optional bool supportsDocumentMessages = 3;
            optional bool supportsUrlMessages = 4;
            optional bool supportsMediaRetry = 5;
            optional bool supportsE2EImage = 6;
            optional bool supportsE2EVideo = 7;
            optional bool supportsE2EAudio = 8;
            optional bool supportsE2EDocument = 9;
            optional string documentTypes = 10;
            optional bytes features = 11;
        }
        
    }
    
}

message CommentMetadata {
    optional MessageKey commentParentKey = 1;
    optional uint32 replyCount = 2;
}

message ContextInfo {
    optional string stanzaId = 1;
    optional string participant = 2;
    optional Message quotedMessage = 3;
    optional string remoteJid = 4;
    repeated string mentionedJid = 15;
    optional string conversionSource = 18;
    optional bytes conversionData = 19;
    optional uint32 conversionDelaySeconds = 20;
    optional uint32 forwardingScore = 21;
    optional bool isForwarded = 22;
    optional AdReplyInfo quotedAd = 23;
    optional MessageKey placeholderKey = 24;
    optional uint32 expiration = 25;
    optional int64 ephemeralSettingTimestamp = 26;
    optional bytes ephemeralSharedSecret = 27;
    optional ExternalAdReplyInfo externalAdReply = 28;
    optional string entryPointConversionSource = 29;
    optional string entryPointConversionApp = 30;
    optional uint32 entryPointConversionDelaySeconds = 31;
    optional DisappearingMode disappearingMode = 32;
    optional ActionLink actionLink = 33;
    optional string groupSubject = 34;
    optional string parentGroupJid = 35;
    optional string trustBannerType = 37;
    optional uint32 trustBannerAction = 38;
    optional bool isSampled = 39;
    repeated GroupMention groupMentions = 40;
    optional UTMInfo utm = 41;
    optional ForwardedNewsletterMessageInfo forwardedNewsletterMessageInfo = 43;
    optional BusinessMessageForwardInfo businessMessageForwardInfo = 44;
    optional string smbClientCampaignId = 45;
    optional string smbServerCampaignId = 46;
    optional DataSharingContext dataSharingContext = 47;
    message AdReplyInfo {
        optional string advertiserName = 1;
        optional MediaType mediaType = 2;
        optional bytes jpegThumbnail = 16;
        optional string caption = 17;
        enum MediaType {
            NONE = 0;
            IMAGE = 1;
            VIDEO = 2;
        }
    }
    
    message BusinessMessageForwardInfo {
        optional string businessOwnerJid = 1;
    }
    
    message DataSharingContext {
        optional bool showMmDisclosure = 1;
    }
    
    message ExternalAdReplyInfo {
        optional string title = 1;
        optional string body = 2;
        optional MediaType mediaType = 3;
        optional string thumbnailUrl = 4;
        optional string mediaUrl = 5;
        optional bytes thumbnail = 6;
        optional string sourceType = 7;
        optional string sourceId = 8;
        optional string sourceUrl = 9;
        optional bool containsAutoReply = 10;
        optional bool renderLargerThumbnail = 11;
        optional bool showAdAttribution = 12;
        optional string ctwaClid = 13;
        optional string ref = 14;
        enum MediaType {
            NONE = 0;
            IMAGE = 1;
            VIDEO = 2;
        }
    }
    
    message ForwardedNewsletterMessageInfo {
        optional string newsletterJid = 1;
        optional int32 serverMessageId = 2;
        optional string newsletterName = 3;
        optional ContentType contentType = 4;
        optional string accessibilityText = 5;
        enum ContentType {
            UPDATE = 1;
            UPDATE_CARD = 2;
            LINK_CARD = 3;
        }
    }
    
    message UTMInfo {
        optional string utmSource = 1;
        optional string utmCampaign = 2;
    }
    
}

message Conversation {
    required string id = 1;
    repeated HistorySyncMsg messages = 2;
    optional string newJid = 3;
    optional string oldJid = 4;
    optional uint64 lastMsgTimestamp = 5;
    optional uint32 unreadCount = 6;
    optional bool readOnly = 7;
    optional bool endOfHistoryTransfer = 8;
    optional uint32 ephemeralExpiration = 9;
    optional int64 ephemeralSettingTimestamp = 10;
    optional EndOfHistoryTransferType endOfHistoryTransferType = 11;
    optional uint64 conversationTimestamp = 12;
    optional string name = 13;
    optional string pHash = 14;
    optional bool notSpam = 15;
    optional bool archived = 16;
    optional DisappearingMode disappearingMode = 17;
    optional uint32 unreadMentionCount = 18;
    optional bool markedAsUnread = 19;
    repeated GroupParticipant participant = 20;
    optional bytes tcToken = 21;
    optional uint64 tcTokenTimestamp = 22;
    optional bytes contactPrimaryIdentityKey = 23;
    optional uint32 pinned = 24;
    optional uint64 muteEndTime = 25;
    optional WallpaperSettings wallpaper = 26;
    optional MediaVisibility mediaVisibility = 27;
    optional uint64 tcTokenSenderTimestamp = 28;
    optional bool suspended = 29;
    optional bool terminated = 30;
    optional uint64 createdAt = 31;
    optional string createdBy = 32;
    optional string description = 33;
    optional bool support = 34;
    optional bool isParentGroup = 35;
    optional string parentGroupId = 37;
    optional bool isDefaultSubgroup = 36;
    optional string displayName = 38;
    optional string pnJid = 39;
    optional bool shareOwnPn = 40;
    optional bool pnhDuplicateLidThread = 41;
    optional string lidJid = 42;
    optional string username = 43;
    optional string lidOriginType = 44;
    optional uint32 commentsCount = 45;
    enum EndOfHistoryTransferType {
        COMPLETE_BUT_MORE_MESSAGES_REMAIN_ON_PRIMARY = 0;
        COMPLETE_AND_NO_MORE_MESSAGE_REMAIN_ON_PRIMARY = 1;
        COMPLETE_ON_DEMAND_SYNC_BUT_MORE_MSG_REMAIN_ON_PRIMARY = 2;
    }
}

message DeviceConsistencyCodeMessage {
    optional uint32 generation = 1;
    optional bytes signature = 2;
}

message DeviceListMetadata {
    optional bytes senderKeyHash = 1;
    optional uint64 senderTimestamp = 2;
    repeated uint32 senderKeyIndexes = 3 [packed=true];
    optional ADVEncryptionType senderAccountType = 4;
    optional ADVEncryptionType receiverAccountType = 5;
    optional bytes recipientKeyHash = 8;
    optional uint64 recipientTimestamp = 9;
    repeated uint32 recipientKeyIndexes = 10 [packed=true];
}

message DeviceProps {
    optional string os = 1;
    optional AppVersion version = 2;
    optional PlatformType platformType = 3;
    optional bool requireFullSync = 4;
    optional HistorySyncConfig historySyncConfig = 5;
    message AppVersion {
        optional uint32 primary = 1;
        optional uint32 secondary = 2;
        optional uint32 tertiary = 3;
        optional uint32 quaternary = 4;
        optional uint32 quinary = 5;
    }
    
    message HistorySyncConfig {
        optional uint32 fullSyncDaysLimit = 1;
        optional uint32 fullSyncSizeMbLimit = 2;
        optional uint32 storageQuotaMb = 3;
        optional bool inlineInitialPayloadInE2EeMsg = 4;
        optional uint32 recentSyncDaysLimit = 5;
        optional bool supportCallLogHistory = 6;
        optional bool supportBotUserAgentChatHistory = 7;
        optional bool supportCagReactionsAndPolls = 8;
    }
    
    enum PlatformType {
        UNKNOWN = 0;
        CHROME = 1;
        FIREFOX = 2;
        IE = 3;
        OPERA = 4;
        SAFARI = 5;
        EDGE = 6;
        DESKTOP = 7;
        IPAD = 8;
        ANDROID_TABLET = 9;
        OHANA = 10;
        ALOHA = 11;
        CATALINA = 12;
        TCL_TV = 13;
        IOS_PHONE = 14;
        IOS_CATALYST = 15;
        ANDROID_PHONE = 16;
        ANDROID_AMBIGUOUS = 17;
        WEAR_OS = 18;
        AR_WRIST = 19;
        AR_DEVICE = 20;
        UWP = 21;
        VR = 22;
    }
}

message DisappearingMode {
    optional Initiator initiator = 1;
    optional Trigger trigger = 2;
    optional string initiatorDeviceJid = 3;
    optional bool initiatedByMe = 4;
    enum Initiator {
        CHANGED_IN_CHAT = 0;
        INITIATED_BY_ME = 1;
        INITIATED_BY_OTHER = 2;
        BIZ_UPGRADE_FB_HOSTING = 3;
    }
    enum Trigger {
        UNKNOWN = 0;
        CHAT_SETTING = 1;
        ACCOUNT_SETTING = 2;
        BULK_CHANGE = 3;
        BIZ_SUPPORTS_FB_HOSTING = 4;
    }
}

message EphemeralSetting {
    optional sfixed32 duration = 1;
    optional sfixed64 timestamp = 2;
}

message EventResponse {
    optional MessageKey eventResponseMessageKey = 1;
    optional int64 timestampMs = 2;
    optional Message.EventResponseMessage eventResponseMessage = 3;
    optional bool unread = 4;
}

message ExitCode {
    optional uint64 code = 1;
    optional string text = 2;
}

message ExternalBlobReference {
    optional bytes mediaKey = 1;
    optional string directPath = 2;
    optional string handle = 3;
    optional uint64 fileSizeBytes = 4;
    optional bytes fileSha256 = 5;
    optional bytes fileEncSha256 = 6;
}

message GlobalSettings {
    optional WallpaperSettings lightThemeWallpaper = 1;
    optional MediaVisibility mediaVisibility = 2;
    optional WallpaperSettings darkThemeWallpaper = 3;
    optional AutoDownloadSettings autoDownloadWiFi = 4;
    optional AutoDownloadSettings autoDownloadCellular = 5;
    optional AutoDownloadSettings autoDownloadRoaming = 6;
    optional bool showIndividualNotificationsPreview = 7;
    optional bool showGroupNotificationsPreview = 8;
    optional int32 disappearingModeDuration = 9;
    optional int64 disappearingModeTimestamp = 10;
    optional AvatarUserSettings avatarUserSettings = 11;
    optional int32 fontSize = 12;
    optional bool securityNotifications = 13;
    optional bool autoUnarchiveChats = 14;
    optional int32 videoQualityMode = 15;
    optional int32 photoQualityMode = 16;
    optional NotificationSettings individualNotificationSettings = 17;
    optional NotificationSettings groupNotificationSettings = 18;
}

message GroupMention {
    optional string groupJid = 1;
    optional string groupSubject = 2;
}

message GroupParticipant {
    required string userJid = 1;
    optional Rank rank = 2;
    enum Rank {
        REGULAR = 0;
        ADMIN = 1;
        SUPERADMIN = 2;
    }
}

message HandshakeMessage {
    optional ClientHello clientHello = 2;
    optional ServerHello serverHello = 3;
    optional ClientFinish clientFinish = 4;
    message ClientFinish {
        optional bytes static = 1;
        optional bytes payload = 2;
    }
    
    message ClientHello {
        optional bytes ephemeral = 1;
        optional bytes static = 2;
        optional bytes payload = 3;
    }
    
    message ServerHello {
        optional bytes ephemeral = 1;
        optional bytes static = 2;
        optional bytes payload = 3;
    }
    
}

message HistorySync {
    required HistorySyncType syncType = 1;
    repeated Conversation conversations = 2;
    repeated WebMessageInfo statusV3Messages = 3;
    optional uint32 chunkOrder = 5;
    optional uint32 progress = 6;
    repeated Pushname pushnames = 7;
    optional GlobalSettings globalSettings = 8;
    optional bytes threadIdUserSecret = 9;
    optional uint32 threadDsTimeframeOffset = 10;
    repeated StickerMetadata recentStickers = 11;
    repeated PastParticipants pastParticipants = 12;
    repeated CallLogRecord callLogRecords = 13;
    optional BotAIWaitListState aiWaitListState = 14;
    repeated PhoneNumberToLIDMapping phoneNumberToLidMappings = 15;
    enum BotAIWaitListState {
        IN_WAITLIST = 0;
        AI_AVAILABLE = 1;
    }
    enum HistorySyncType {
        INITIAL_BOOTSTRAP = 0;
        INITIAL_STATUS_V3 = 1;
        FULL = 2;
        RECENT = 3;
        PUSH_NAME = 4;
        NON_BLOCKING_DATA = 5;
        ON_DEMAND = 6;
    }
}

message HistorySyncMsg {
    optional WebMessageInfo message = 1;
    optional uint64 msgOrderId = 2;
}

message HydratedTemplateButton {
    optional uint32 index = 4;
    oneof hydratedButton {
        HydratedTemplateButton.HydratedQuickReplyButton quickReplyButton = 1;
        HydratedTemplateButton.HydratedURLButton urlButton = 2;
        HydratedTemplateButton.HydratedCallButton callButton = 3;
    }
    message HydratedCallButton {
        optional string displayText = 1;
        optional string phoneNumber = 2;
    }
    
    message HydratedQuickReplyButton {
        optional string displayText = 1;
        optional string id = 2;
    }
    
    message HydratedURLButton {
        optional string displayText = 1;
        optional string url = 2;
        optional string consentedUsersUrl = 3;
        optional WebviewPresentationType webviewPresentation = 4;
        enum WebviewPresentationType {
            FULL = 1;
            TALL = 2;
            COMPACT = 3;
        }
    }
    
}

message IdentityKeyPairStructure {
    optional bytes publicKey = 1;
    optional bytes privateKey = 2;
}

message InteractiveAnnotation {
    repeated Point polygonVertices = 1;
    optional bool shouldSkipConfirmation = 4;
    oneof action {
        Location location = 2;
        ContextInfo.ForwardedNewsletterMessageInfo newsletter = 3;
    }
}

message KeepInChat {
    optional KeepType keepType = 1;
    optional int64 serverTimestamp = 2;
    optional MessageKey key = 3;
    optional string deviceJid = 4;
    optional int64 clientTimestampMs = 5;
    optional int64 serverTimestampMs = 6;
}

enum KeepType {
    UNKNOWN = 0;
    KEEP_FOR_ALL = 1;
    UNDO_KEEP_FOR_ALL = 2;
}
message KeyExchangeMessage {
    optional uint32 id = 1;
    optional bytes baseKey = 2;
    optional bytes ratchetKey = 3;
    optional bytes identityKey = 4;
    optional bytes baseKeySignature = 5;
}

message KeyId {
    optional bytes id = 1;
}

message LocalizedName {
    optional string lg = 1;
    optional string lc = 2;
    optional string verifiedName = 3;
}

message Location {
    optional double degreesLatitude = 1;
    optional double degreesLongitude = 2;
    optional string name = 3;
}

message MediaData {
    optional string localPath = 1;
}

message MediaEntry {
    optional bytes fileSha256 = 1;
    optional bytes mediaKey = 2;
    optional bytes fileEncSha256 = 3;
    optional string directPath = 4;
    optional int64 mediaKeyTimestamp = 5;
    optional string serverMediaType = 6;
    optional bytes uploadToken = 7;
    optional bytes validatedTimestamp = 8;
    optional bytes sidecar = 9;
    optional string objectId = 10;
    optional string fbid = 11;
    optional DownloadableThumbnail downloadableThumbnail = 12;
    optional string handle = 13;
    optional string filename = 14;
    optional ProgressiveJpegDetails progressiveJpegDetails = 15;
    message DownloadableThumbnail {
        optional bytes fileSha256 = 1;
        optional bytes fileEncSha256 = 2;
        optional string directPath = 3;
        optional bytes mediaKey = 4;
        optional int64 mediaKeyTimestamp = 5;
        optional string objectId = 6;
    }
    
    message ProgressiveJpegDetails {
        repeated int64 scanLengths = 1;
        optional bytes sidecar = 2;
    }
    
}

message MediaNotifyMessage {
    optional string expressPathUrl = 1;
    optional bytes fileEncSha256 = 2;
    optional uint64 fileLength = 3;
}

message MediaRetryNotification {
    optional string stanzaId = 1;
    optional string directPath = 2;
    optional ResultType result = 3;
    enum ResultType {
        GENERAL_ERROR = 0;
        SUCCESS = 1;
        NOT_FOUND = 2;
        DECRYPTION_ERROR = 3;
    }
}

enum MediaVisibility {
    DEFAULT = 0;
    OFF = 1;
    ON = 2;
}
message Message {
    optional string conversation = 1;
    optional SenderKeyDistributionMessage senderKeyDistributionMessage = 2;
    optional ImageMessage imageMessage = 3;
    optional ContactMessage contactMessage = 4;
    optional LocationMessage locationMessage = 5;
    optional ExtendedTextMessage extendedTextMessage = 6;
    optional DocumentMessage documentMessage = 7;
    optional AudioMessage audioMessage = 8;
    optional VideoMessage videoMessage = 9;
    optional Call call = 10;
    optional Chat chat = 11;
    optional ProtocolMessage protocolMessage = 12;
    optional ContactsArrayMessage contactsArrayMessage = 13;
    optional HighlyStructuredMessage highlyStructuredMessage = 14;
    optional SenderKeyDistributionMessage fastRatchetKeySenderKeyDistributionMessage = 15;
    optional SendPaymentMessage sendPaymentMessage = 16;
    optional LiveLocationMessage liveLocationMessage = 18;
    optional RequestPaymentMessage requestPaymentMessage = 22;
    optional DeclinePaymentRequestMessage declinePaymentRequestMessage = 23;
    optional CancelPaymentRequestMessage cancelPaymentRequestMessage = 24;
    optional TemplateMessage templateMessage = 25;
    optional StickerMessage stickerMessage = 26;
    optional GroupInviteMessage groupInviteMessage = 28;
    optional TemplateButtonReplyMessage templateButtonReplyMessage = 29;
    optional ProductMessage productMessage = 30;
    optional DeviceSentMessage deviceSentMessage = 31;
    optional MessageContextInfo messageContextInfo = 35;
    optional ListMessage listMessage = 36;
    optional FutureProofMessage viewOnceMessage = 37;
    optional OrderMessage orderMessage = 38;
    optional ListResponseMessage listResponseMessage = 39;
    optional FutureProofMessage ephemeralMessage = 40;
    optional InvoiceMessage invoiceMessage = 41;
    optional ButtonsMessage buttonsMessage = 42;
    optional ButtonsResponseMessage buttonsResponseMessage = 43;
    optional PaymentInviteMessage paymentInviteMessage = 44;
    optional InteractiveMessage interactiveMessage = 45;
    optional ReactionMessage reactionMessage = 46;
    optional StickerSyncRMRMessage stickerSyncRmrMessage = 47;
    optional InteractiveResponseMessage interactiveResponseMessage = 48;
    optional PollCreationMessage pollCreationMessage = 49;
    optional PollUpdateMessage pollUpdateMessage = 50;
    optional KeepInChatMessage keepInChatMessage = 51;
    optional FutureProofMessage documentWithCaptionMessage = 53;
    optional RequestPhoneNumberMessage requestPhoneNumberMessage = 54;
    optional FutureProofMessage viewOnceMessageV2 = 55;
    optional EncReactionMessage encReactionMessage = 56;
    optional FutureProofMessage editedMessage = 58;
    optional FutureProofMessage viewOnceMessageV2Extension = 59;
    optional PollCreationMessage pollCreationMessageV2 = 60;
    optional ScheduledCallCreationMessage scheduledCallCreationMessage = 61;
    optional FutureProofMessage groupMentionedMessage = 62;
    optional PinInChatMessage pinInChatMessage = 63;
    optional PollCreationMessage pollCreationMessageV3 = 64;
    optional ScheduledCallEditMessage scheduledCallEditMessage = 65;
    optional VideoMessage ptvMessage = 66;
    optional FutureProofMessage botInvokeMessage = 67;
    optional CallLogMessage callLogMesssage = 69;
    optional MessageHistoryBundle messageHistoryBundle = 70;
    optional EncCommentMessage encCommentMessage = 71;
    optional BCallMessage bcallMessage = 72;
    optional FutureProofMessage lottieStickerMessage = 74;
    optional EventMessage eventMessage = 75;
    optional CommentMessage commentMessage = 77;
    optional NewsletterAdminInviteMessage newsletterAdminInviteMessage = 78;
    optional ExtendedTextMessageWithParentKey extendedTextMessageWithParentKey = 79;
    optional PlaceholderMessage placeholderMessage = 80;
    optional EncEventUpdateMessage encEventUpdateMessage = 81;
    message AppStateFatalExceptionNotification {
        repeated string collectionNames = 1;
        optional int64 timestamp = 2;
    }
    
    message AppStateSyncKey {
        optional Message.AppStateSyncKeyId keyId = 1;
        optional Message.AppStateSyncKeyData keyData = 2;
    }
    
    message AppStateSyncKeyData {
        optional bytes keyData = 1;
        optional Message.AppStateSyncKeyFingerprint fingerprint = 2;
        optional int64 timestamp = 3;
    }
    
    message AppStateSyncKeyFingerprint {
        optional uint32 rawId = 1;
        optional uint32 currentIndex = 2;
        repeated uint32 deviceIndexes = 3 [packed=true];
    }
    
    message AppStateSyncKeyId {
        optional bytes keyId = 1;
    }
    
    message AppStateSyncKeyRequest {
        repeated Message.AppStateSyncKeyId keyIds = 1;
    }
    
    message AppStateSyncKeyShare {
        repeated Message.AppStateSyncKey keys = 1;
    }
    
    message AudioMessage {
        optional string url = 1;
        optional string mimetype = 2;
        optional bytes fileSha256 = 3;
        optional uint64 fileLength = 4;
        optional uint32 seconds = 5;
        optional bool ptt = 6;
        optional bytes mediaKey = 7;
        optional bytes fileEncSha256 = 8;
        optional string directPath = 9;
        optional int64 mediaKeyTimestamp = 10;
        optional ContextInfo contextInfo = 17;
        optional bytes streamingSidecar = 18;
        optional bytes waveform = 19;
        optional fixed32 backgroundArgb = 20;
        optional bool viewOnce = 21;
    }
    
    message BCallMessage {
        optional string sessionId = 1;
        optional MediaType mediaType = 2;
        optional bytes masterKey = 3;
        optional string caption = 4;
        enum MediaType {
            UNKNOWN = 0;
            AUDIO = 1;
            VIDEO = 2;
        }
    }
    
    message BotFeedbackMessage {
        optional MessageKey messageKey = 1;
        optional BotFeedbackKind kind = 2;
        optional string text = 3;
        optional uint64 kindNegative = 4;
        optional uint64 kindPositive = 5;
        enum BotFeedbackKind {
            BOT_FEEDBACK_POSITIVE = 0;
            BOT_FEEDBACK_NEGATIVE_GENERIC = 1;
            BOT_FEEDBACK_NEGATIVE_HELPFUL = 2;
            BOT_FEEDBACK_NEGATIVE_INTERESTING = 3;
            BOT_FEEDBACK_NEGATIVE_ACCURATE = 4;
            BOT_FEEDBACK_NEGATIVE_SAFE = 5;
            BOT_FEEDBACK_NEGATIVE_OTHER = 6;
            BOT_FEEDBACK_NEGATIVE_REFUSED = 7;
            BOT_FEEDBACK_NEGATIVE_NOT_VISUALLY_APPEALING = 8;
            BOT_FEEDBACK_NEGATIVE_NOT_RELEVANT_TO_TEXT = 9;
        }
        enum BotFeedbackKindMultipleNegative {
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_GENERIC = 1;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_HELPFUL = 2;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_INTERESTING = 4;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_ACCURATE = 8;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_SAFE = 16;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_OTHER = 32;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_REFUSED = 64;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_NOT_VISUALLY_APPEALING = 128;
            BOT_FEEDBACK_MULTIPLE_NEGATIVE_NOT_RELEVANT_TO_TEXT = 256;
        }
        enum BotFeedbackKindMultiplePositive {
            BOT_FEEDBACK_MULTIPLE_POSITIVE_GENERIC = 1;
        }
    }
    
    message ButtonsMessage {
        optional string contentText = 6;
        optional string footerText = 7;
        optional ContextInfo contextInfo = 8;
        repeated Button buttons = 9;
        optional HeaderType headerType = 10;
        oneof header {
            string text = 1;
            Message.DocumentMessage documentMessage = 2;
            Message.ImageMessage imageMessage = 3;
            Message.VideoMessage videoMessage = 4;
            Message.LocationMessage locationMessage = 5;
        }
        message Button {
            optional string buttonId = 1;
            optional ButtonText buttonText = 2;
            optional Type type = 3;
            optional NativeFlowInfo nativeFlowInfo = 4;
            message ButtonText {
                optional string displayText = 1;
            }
            
            message NativeFlowInfo {
                optional string name = 1;
                optional string paramsJson = 2;
            }
            
            enum Type {
                UNKNOWN = 0;
                RESPONSE = 1;
                NATIVE_FLOW = 2;
            }
        }
        
        enum HeaderType {
            UNKNOWN = 0;
            EMPTY = 1;
            TEXT = 2;
            DOCUMENT = 3;
            IMAGE = 4;
            VIDEO = 5;
            LOCATION = 6;
        }
    }
    
    message ButtonsResponseMessage {
        optional string selectedButtonId = 1;
        optional ContextInfo contextInfo = 3;
        optional Type type = 4;
        oneof response {
            string selectedDisplayText = 2;
        }
        enum Type {
            UNKNOWN = 0;
            DISPLAY_TEXT = 1;
        }
    }
    
    message Call {
        optional bytes callKey = 1;
        optional string conversionSource = 2;
        optional bytes conversionData = 3;
        optional uint32 conversionDelaySeconds = 4;
    }
    
    message CallLogMessage {
        optional bool isVideo = 1;
        optional CallOutcome callOutcome = 2;
        optional int64 durationSecs = 3;
        optional CallType callType = 4;
        repeated CallParticipant participants = 5;
        enum CallOutcome {
            CONNECTED = 0;
            MISSED = 1;
            FAILED = 2;
            REJECTED = 3;
            ACCEPTED_ELSEWHERE = 4;
            ONGOING = 5;
            SILENCED_BY_DND = 6;
            SILENCED_UNKNOWN_CALLER = 7;
        }
        message CallParticipant {
            optional string jid = 1;
            optional Message.CallLogMessage.CallOutcome callOutcome = 2;
        }
        
        enum CallType {
            REGULAR = 0;
            SCHEDULED_CALL = 1;
            VOICE_CHAT = 2;
        }
    }
    
    message CancelPaymentRequestMessage {
        optional MessageKey key = 1;
    }
    
    message Chat {
        optional string displayName = 1;
        optional string id = 2;
    }
    
    message CommentMessage {
        optional Message message = 1;
        optional MessageKey targetMessageKey = 2;
    }
    
    message ContactMessage {
        optional string displayName = 1;
        optional string vcard = 16;
        optional ContextInfo contextInfo = 17;
    }
    
    message ContactsArrayMessage {
        optional string displayName = 1;
        repeated Message.ContactMessage contacts = 2;
        optional ContextInfo contextInfo = 17;
    }
    
    message DeclinePaymentRequestMessage {
        optional MessageKey key = 1;
    }
    
    message DeviceSentMessage {
        optional string destinationJid = 1;
        optional Message message = 2;
        optional string phash = 3;
    }
    
    message DocumentMessage {
        optional string url = 1;
        optional string mimetype = 2;
        optional string title = 3;
        optional bytes fileSha256 = 4;
        optional uint64 fileLength = 5;
        optional uint32 pageCount = 6;
        optional bytes mediaKey = 7;
        optional string fileName = 8;
        optional bytes fileEncSha256 = 9;
        optional string directPath = 10;
        optional int64 mediaKeyTimestamp = 11;
        optional bool contactVcard = 12;
        optional string thumbnailDirectPath = 13;
        optional bytes thumbnailSha256 = 14;
        optional bytes thumbnailEncSha256 = 15;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
        optional uint32 thumbnailHeight = 18;
        optional uint32 thumbnailWidth = 19;
        optional string caption = 20;
    }
    
    message EncCommentMessage {
        optional MessageKey targetMessageKey = 1;
        optional bytes encPayload = 2;
        optional bytes encIv = 3;
    }
    
    message EncEventUpdateMessage {
        optional MessageKey eventCreationMessageKey = 1;
        optional bytes encPayload = 2;
        optional bytes encIv = 3;
    }
    
    message EncReactionMessage {
        optional MessageKey targetMessageKey = 1;
        optional bytes encPayload = 2;
        optional bytes encIv = 3;
    }
    
    message EventEditMessage {
        optional Message.EventMessage eventEditMessage = 1;
        optional int64 editTimestampMs = 2;
    }
    
    message EventMessage {
        optional ContextInfo contextInfo = 1;
        optional bool isCanceled = 2;
        optional string name = 3;
        optional string description = 4;
        optional Message.LocationMessage location = 5;
        optional string joinLink = 6;
        optional int64 startTime = 7;
    }
    
    message EventResponseMessage {
        optional EventResponseType response = 1;
        optional int64 timestampMs = 2;
        enum EventResponseType {
            UNKNOWN = 0;
            GOING = 1;
            NOT_GOING = 2;
        }
    }
    
    message EventUpdateMessage {
        optional Message.EventResponseMessage response = 1;
        optional Message.EventEditMessage edit = 2;
    }
    
    message ExtendedTextMessage {
        optional string text = 1;
        optional string matchedText = 2;
        optional string canonicalUrl = 4;
        optional string description = 5;
        optional string title = 6;
        optional fixed32 textArgb = 7;
        optional fixed32 backgroundArgb = 8;
        optional FontType font = 9;
        optional PreviewType previewType = 10;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
        optional bool doNotPlayInline = 18;
        optional string thumbnailDirectPath = 19;
        optional bytes thumbnailSha256 = 20;
        optional bytes thumbnailEncSha256 = 21;
        optional bytes mediaKey = 22;
        optional int64 mediaKeyTimestamp = 23;
        optional uint32 thumbnailHeight = 24;
        optional uint32 thumbnailWidth = 25;
        optional InviteLinkGroupType inviteLinkGroupType = 26;
        optional string inviteLinkParentGroupSubjectV2 = 27;
        optional bytes inviteLinkParentGroupThumbnailV2 = 28;
        optional InviteLinkGroupType inviteLinkGroupTypeV2 = 29;
        optional bool viewOnce = 30;
        enum FontType {
            SYSTEM = 0;
            SYSTEM_TEXT = 1;
            FB_SCRIPT = 2;
            SYSTEM_BOLD = 6;
            MORNINGBREEZE_REGULAR = 7;
            CALISTOGA_REGULAR = 8;
            EXO2_EXTRABOLD = 9;
            COURIERPRIME_BOLD = 10;
        }
        enum InviteLinkGroupType {
            DEFAULT = 0;
            PARENT = 1;
            SUB = 2;
            DEFAULT_SUB = 3;
        }
        enum PreviewType {
            NONE = 0;
            VIDEO = 1;
            PLACEHOLDER = 4;
            IMAGE = 5;
        }
    }
    
    message ExtendedTextMessageWithParentKey {
        optional MessageKey key = 1;
        optional Message.ExtendedTextMessage extendedTextMessage = 2;
    }
    
    message FutureProofMessage {
        optional Message message = 1;
    }
    
    message GroupInviteMessage {
        optional string groupJid = 1;
        optional string inviteCode = 2;
        optional int64 inviteExpiration = 3;
        optional string groupName = 4;
        optional bytes jpegThumbnail = 5;
        optional string caption = 6;
        optional ContextInfo contextInfo = 7;
        optional GroupType groupType = 8;
        enum GroupType {
            DEFAULT = 0;
            PARENT = 1;
        }
    }
    
    message HighlyStructuredMessage {
        optional string namespace = 1;
        optional string elementName = 2;
        repeated string params = 3;
        optional string fallbackLg = 4;
        optional string fallbackLc = 5;
        repeated HSMLocalizableParameter localizableParams = 6;
        optional string deterministicLg = 7;
        optional string deterministicLc = 8;
        optional Message.TemplateMessage hydratedHsm = 9;
        message HSMLocalizableParameter {
            optional string default = 1;
            oneof paramOneof {
                Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMCurrency currency = 2;
                Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime dateTime = 3;
            }
            message HSMCurrency {
                optional string currencyCode = 1;
                optional int64 amount1000 = 2;
            }
            
            message HSMDateTime {
                oneof datetimeOneof {
                    Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeComponent component = 1;
                    Message.HighlyStructuredMessage.HSMLocalizableParameter.HSMDateTime.HSMDateTimeUnixEpoch unixEpoch = 2;
                }
                message HSMDateTimeComponent {
                    optional DayOfWeekType dayOfWeek = 1;
                    optional uint32 year = 2;
                    optional uint32 month = 3;
                    optional uint32 dayOfMonth = 4;
                    optional uint32 hour = 5;
                    optional uint32 minute = 6;
                    optional CalendarType calendar = 7;
                    enum CalendarType {
                        GREGORIAN = 1;
                        SOLAR_HIJRI = 2;
                    }
                    enum DayOfWeekType {
                        MONDAY = 1;
                        TUESDAY = 2;
                        WEDNESDAY = 3;
                        THURSDAY = 4;
                        FRIDAY = 5;
                        SATURDAY = 6;
                        SUNDAY = 7;
                    }
                }
                
                message HSMDateTimeUnixEpoch {
                    optional int64 timestamp = 1;
                }
                
            }
            
        }
        
    }
    
    message HistorySyncNotification {
        optional bytes fileSha256 = 1;
        optional uint64 fileLength = 2;
        optional bytes mediaKey = 3;
        optional bytes fileEncSha256 = 4;
        optional string directPath = 5;
        optional HistorySyncType syncType = 6;
        optional uint32 chunkOrder = 7;
        optional string originalMessageId = 8;
        optional uint32 progress = 9;
        optional int64 oldestMsgInChunkTimestampSec = 10;
        optional bytes initialHistBootstrapInlinePayload = 11;
        optional string peerDataRequestSessionId = 12;
        enum HistorySyncType {
            INITIAL_BOOTSTRAP = 0;
            INITIAL_STATUS_V3 = 1;
            FULL = 2;
            RECENT = 3;
            PUSH_NAME = 4;
            NON_BLOCKING_DATA = 5;
            ON_DEMAND = 6;
        }
    }
    
    message ImageMessage {
        optional string url = 1;
        optional string mimetype = 2;
        optional string caption = 3;
        optional bytes fileSha256 = 4;
        optional uint64 fileLength = 5;
        optional uint32 height = 6;
        optional uint32 width = 7;
        optional bytes mediaKey = 8;
        optional bytes fileEncSha256 = 9;
        repeated InteractiveAnnotation interactiveAnnotations = 10;
        optional string directPath = 11;
        optional int64 mediaKeyTimestamp = 12;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
        optional bytes firstScanSidecar = 18;
        optional uint32 firstScanLength = 19;
        optional uint32 experimentGroupId = 20;
        optional bytes scansSidecar = 21;
        repeated uint32 scanLengths = 22;
        optional bytes midQualityFileSha256 = 23;
        optional bytes midQualityFileEncSha256 = 24;
        optional bool viewOnce = 25;
        optional string thumbnailDirectPath = 26;
        optional bytes thumbnailSha256 = 27;
        optional bytes thumbnailEncSha256 = 28;
        optional string staticUrl = 29;
        repeated InteractiveAnnotation annotations = 30;
    }
    
    message InitialSecurityNotificationSettingSync {
        optional bool securityNotificationEnabled = 1;
    }
    
    message InteractiveMessage {
        optional Header header = 1;
        optional Body body = 2;
        optional Footer footer = 3;
        optional ContextInfo contextInfo = 15;
        oneof interactiveMessage {
            Message.InteractiveMessage.ShopMessage shopStorefrontMessage = 4;
            Message.InteractiveMessage.CollectionMessage collectionMessage = 5;
            Message.InteractiveMessage.NativeFlowMessage nativeFlowMessage = 6;
            Message.InteractiveMessage.CarouselMessage carouselMessage = 7;
        }
        message Body {
            optional string text = 1;
        }
        
        message CarouselMessage {
            repeated Message.InteractiveMessage cards = 1;
            optional int32 messageVersion = 2;
        }
        
        message CollectionMessage {
            optional string bizJid = 1;
            optional string id = 2;
            optional int32 messageVersion = 3;
        }
        
        message Footer {
            optional string text = 1;
        }
        
        message Header {
            optional string title = 1;
            optional string subtitle = 2;
            optional bool hasMediaAttachment = 5;
            oneof media {
                Message.DocumentMessage documentMessage = 3;
                Message.ImageMessage imageMessage = 4;
                bytes jpegThumbnail = 6;
                Message.VideoMessage videoMessage = 7;
                Message.LocationMessage locationMessage = 8;
            }
        }
        
        message NativeFlowMessage {
            repeated NativeFlowButton buttons = 1;
            optional string messageParamsJson = 2;
            optional int32 messageVersion = 3;
            message NativeFlowButton {
                optional string name = 1;
                optional string buttonParamsJson = 2;
            }
            
        }
        
        message ShopMessage {
            optional string id = 1;
            optional Surface surface = 2;
            optional int32 messageVersion = 3;
            enum Surface {
                UNKNOWN_SURFACE = 0;
                FB = 1;
                IG = 2;
                WA = 3;
            }
        }
        
    }
    
    message InteractiveResponseMessage {
        optional Body body = 1;
        optional ContextInfo contextInfo = 15;
        oneof interactiveResponseMessage {
            Message.InteractiveResponseMessage.NativeFlowResponseMessage nativeFlowResponseMessage = 2;
        }
        message Body {
            optional string text = 1;
            optional Format format = 2;
            enum Format {
                DEFAULT = 0;
                EXTENSIONS_1 = 1;
            }
        }
        
        message NativeFlowResponseMessage {
            optional string name = 1;
            optional string paramsJson = 2;
            optional int32 version = 3;
        }
        
    }
    
    message InvoiceMessage {
        optional string note = 1;
        optional string token = 2;
        optional AttachmentType attachmentType = 3;
        optional string attachmentMimetype = 4;
        optional bytes attachmentMediaKey = 5;
        optional int64 attachmentMediaKeyTimestamp = 6;
        optional bytes attachmentFileSha256 = 7;
        optional bytes attachmentFileEncSha256 = 8;
        optional string attachmentDirectPath = 9;
        optional bytes attachmentJpegThumbnail = 10;
        enum AttachmentType {
            IMAGE = 0;
            PDF = 1;
        }
    }
    
    message KeepInChatMessage {
        optional MessageKey key = 1;
        optional KeepType keepType = 2;
        optional int64 timestampMs = 3;
    }
    
    message ListMessage {
        optional string title = 1;
        optional string description = 2;
        optional string buttonText = 3;
        optional ListType listType = 4;
        repeated Section sections = 5;
        optional ProductListInfo productListInfo = 6;
        optional string footerText = 7;
        optional ContextInfo contextInfo = 8;
        enum ListType {
            UNKNOWN = 0;
            SINGLE_SELECT = 1;
            PRODUCT_LIST = 2;
        }
        message Product {
            optional string productId = 1;
        }
        
        message ProductListHeaderImage {
            optional string productId = 1;
            optional bytes jpegThumbnail = 2;
        }
        
        message ProductListInfo {
            repeated Message.ListMessage.ProductSection productSections = 1;
            optional Message.ListMessage.ProductListHeaderImage headerImage = 2;
            optional string businessOwnerJid = 3;
        }
        
        message ProductSection {
            optional string title = 1;
            repeated Message.ListMessage.Product products = 2;
        }
        
        message Row {
            optional string title = 1;
            optional string description = 2;
            optional string rowId = 3;
        }
        
        message Section {
            optional string title = 1;
            repeated Message.ListMessage.Row rows = 2;
        }
        
    }
    
    message ListResponseMessage {
        optional string title = 1;
        optional ListType listType = 2;
        optional SingleSelectReply singleSelectReply = 3;
        optional ContextInfo contextInfo = 4;
        optional string description = 5;
        enum ListType {
            UNKNOWN = 0;
            SINGLE_SELECT = 1;
        }
        message SingleSelectReply {
            optional string selectedRowId = 1;
        }
        
    }
    
    message LiveLocationMessage {
        optional double degreesLatitude = 1;
        optional double degreesLongitude = 2;
        optional uint32 accuracyInMeters = 3;
        optional float speedInMps = 4;
        optional uint32 degreesClockwiseFromMagneticNorth = 5;
        optional string caption = 6;
        optional int64 sequenceNumber = 7;
        optional uint32 timeOffset = 8;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
    }
    
    message LocationMessage {
        optional double degreesLatitude = 1;
        optional double degreesLongitude = 2;
        optional string name = 3;
        optional string address = 4;
        optional string url = 5;
        optional bool isLive = 6;
        optional uint32 accuracyInMeters = 7;
        optional float speedInMps = 8;
        optional uint32 degreesClockwiseFromMagneticNorth = 9;
        optional string comment = 11;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
    }
    
    message MessageHistoryBundle {
        optional string mimetype = 2;
        optional bytes fileSha256 = 3;
        optional bytes mediaKey = 5;
        optional bytes fileEncSha256 = 6;
        optional string directPath = 7;
        optional int64 mediaKeyTimestamp = 8;
        optional ContextInfo contextInfo = 9;
        repeated string participants = 10;
    }
    
    message NewsletterAdminInviteMessage {
        optional string newsletterJid = 1;
        optional string newsletterName = 2;
        optional bytes jpegThumbnail = 3;
        optional string caption = 4;
        optional int64 inviteExpiration = 5;
    }
    
    message OrderMessage {
        optional string orderId = 1;
        optional bytes thumbnail = 2;
        optional int32 itemCount = 3;
        optional OrderStatus status = 4;
        optional OrderSurface surface = 5;
        optional string message = 6;
        optional string orderTitle = 7;
        optional string sellerJid = 8;
        optional string token = 9;
        optional int64 totalAmount1000 = 10;
        optional string totalCurrencyCode = 11;
        optional ContextInfo contextInfo = 17;
        optional int32 messageVersion = 12;
        optional MessageKey orderRequestMessageId = 13;
        enum OrderStatus {
            INQUIRY = 1;
            ACCEPTED = 2;
            DECLINED = 3;
        }
        enum OrderSurface {
            CATALOG = 1;
        }
    }
    
    message PaymentInviteMessage {
        optional ServiceType serviceType = 1;
        optional int64 expiryTimestamp = 2;
        enum ServiceType {
            UNKNOWN = 0;
            FBPAY = 1;
            NOVI = 2;
            UPI = 3;
        }
    }
    
    message PeerDataOperationRequestMessage {
        optional Message.PeerDataOperationRequestType peerDataOperationRequestType = 1;
        repeated RequestStickerReupload requestStickerReupload = 2;
        repeated RequestUrlPreview requestUrlPreview = 3;
        optional HistorySyncOnDemandRequest historySyncOnDemandRequest = 4;
        repeated PlaceholderMessageResendRequest placeholderMessageResendRequest = 5;
        message HistorySyncOnDemandRequest {
            optional string chatJid = 1;
            optional string oldestMsgId = 2;
            optional bool oldestMsgFromMe = 3;
            optional int32 onDemandMsgCount = 4;
            optional int64 oldestMsgTimestampMs = 5;
        }
        
        message PlaceholderMessageResendRequest {
            optional MessageKey messageKey = 1;
        }
        
        message RequestStickerReupload {
            optional string fileSha256 = 1;
        }
        
        message RequestUrlPreview {
            optional string url = 1;
            optional bool includeHqThumbnail = 2;
        }
        
    }
    
    message PeerDataOperationRequestResponseMessage {
        optional Message.PeerDataOperationRequestType peerDataOperationRequestType = 1;
        optional string stanzaId = 2;
        repeated PeerDataOperationResult peerDataOperationResult = 3;
        message PeerDataOperationResult {
            optional MediaRetryNotification.ResultType mediaUploadResult = 1;
            optional Message.StickerMessage stickerMessage = 2;
            optional LinkPreviewResponse linkPreviewResponse = 3;
            optional PlaceholderMessageResendResponse placeholderMessageResendResponse = 4;
            message LinkPreviewResponse {
                optional string url = 1;
                optional string title = 2;
                optional string description = 3;
                optional bytes thumbData = 4;
                optional string canonicalUrl = 5;
                optional string matchText = 6;
                optional string previewType = 7;
                optional LinkPreviewHighQualityThumbnail hqThumbnail = 8;
                message LinkPreviewHighQualityThumbnail {
                    optional string directPath = 1;
                    optional string thumbHash = 2;
                    optional string encThumbHash = 3;
                    optional bytes mediaKey = 4;
                    optional int64 mediaKeyTimestampMs = 5;
                    optional int32 thumbWidth = 6;
                    optional int32 thumbHeight = 7;
                }
                
            }
            
            message PlaceholderMessageResendResponse {
                optional bytes webMessageInfoBytes = 1;
            }
            
        }
        
    }
    
    enum PeerDataOperationRequestType {
        UPLOAD_STICKER = 0;
        SEND_RECENT_STICKER_BOOTSTRAP = 1;
        GENERATE_LINK_PREVIEW = 2;
        HISTORY_SYNC_ON_DEMAND = 3;
        PLACEHOLDER_MESSAGE_RESEND = 4;
    }
    message PinInChatMessage {
        optional MessageKey key = 1;
        optional Type type = 2;
        optional int64 senderTimestampMs = 3;
        enum Type {
            UNKNOWN_TYPE = 0;
            PIN_FOR_ALL = 1;
            UNPIN_FOR_ALL = 2;
        }
    }
    
    message PlaceholderMessage {
        optional PlaceholderType type = 1;
        enum PlaceholderType {
            MASK_LINKED_DEVICES = 0;
        }
    }
    
    message PollCreationMessage {
        optional bytes encKey = 1;
        optional string name = 2;
        repeated Option options = 3;
        optional uint32 selectableOptionsCount = 4;
        optional ContextInfo contextInfo = 5;
        message Option {
            optional string optionName = 1;
        }
        
    }
    
    message PollEncValue {
        optional bytes encPayload = 1;
        optional bytes encIv = 2;
    }
    
    message PollUpdateMessage {
        optional MessageKey pollCreationMessageKey = 1;
        optional Message.PollEncValue vote = 2;
        optional Message.PollUpdateMessageMetadata metadata = 3;
        optional int64 senderTimestampMs = 4;
    }
    
    message PollUpdateMessageMetadata {
    }
    
    message PollVoteMessage {
        repeated bytes selectedOptions = 1;
    }
    
    message ProductMessage {
        optional ProductSnapshot product = 1;
        optional string businessOwnerJid = 2;
        optional CatalogSnapshot catalog = 4;
        optional string body = 5;
        optional string footer = 6;
        optional ContextInfo contextInfo = 17;
        message CatalogSnapshot {
            optional Message.ImageMessage catalogImage = 1;
            optional string title = 2;
            optional string description = 3;
        }
        
        message ProductSnapshot {
            optional Message.ImageMessage productImage = 1;
            optional string productId = 2;
            optional string title = 3;
            optional string description = 4;
            optional string currencyCode = 5;
            optional int64 priceAmount1000 = 6;
            optional string retailerId = 7;
            optional string url = 8;
            optional uint32 productImageCount = 9;
            optional string firstImageId = 11;
            optional int64 salePriceAmount1000 = 12;
        }
        
    }
    
    message ProtocolMessage {
        optional MessageKey key = 1;
        optional Type type = 2;
        optional uint32 ephemeralExpiration = 4;
        optional int64 ephemeralSettingTimestamp = 5;
        optional Message.HistorySyncNotification historySyncNotification = 6;
        optional Message.AppStateSyncKeyShare appStateSyncKeyShare = 7;
        optional Message.AppStateSyncKeyRequest appStateSyncKeyRequest = 8;
        optional Message.InitialSecurityNotificationSettingSync initialSecurityNotificationSettingSync = 9;
        optional Message.AppStateFatalExceptionNotification appStateFatalExceptionNotification = 10;
        optional DisappearingMode disappearingMode = 11;
        optional Message editedMessage = 14;
        optional int64 timestampMs = 15;
        optional Message.PeerDataOperationRequestMessage peerDataOperationRequestMessage = 16;
        optional Message.PeerDataOperationRequestResponseMessage peerDataOperationRequestResponseMessage = 17;
        optional Message.BotFeedbackMessage botFeedbackMessage = 18;
        optional string invokerJid = 19;
        optional Message.RequestWelcomeMessageMetadata requestWelcomeMessageMetadata = 20;
        optional MediaNotifyMessage mediaNotifyMessage = 21;
        enum Type {
            REVOKE = 0;
            EPHEMERAL_SETTING = 3;
            EPHEMERAL_SYNC_RESPONSE = 4;
            HISTORY_SYNC_NOTIFICATION = 5;
            APP_STATE_SYNC_KEY_SHARE = 6;
            APP_STATE_SYNC_KEY_REQUEST = 7;
            MSG_FANOUT_BACKFILL_REQUEST = 8;
            INITIAL_SECURITY_NOTIFICATION_SETTING_SYNC = 9;
            APP_STATE_FATAL_EXCEPTION_NOTIFICATION = 10;
            SHARE_PHONE_NUMBER = 11;
            MESSAGE_EDIT = 14;
            PEER_DATA_OPERATION_REQUEST_MESSAGE = 16;
            PEER_DATA_OPERATION_REQUEST_RESPONSE_MESSAGE = 17;
            REQUEST_WELCOME_MESSAGE = 18;
            BOT_FEEDBACK_MESSAGE = 19;
            MEDIA_NOTIFY_MESSAGE = 20;
        }
    }
    
    message ReactionMessage {
        optional MessageKey key = 1;
        optional string text = 2;
        optional string groupingKey = 3;
        optional int64 senderTimestampMs = 4;
    }
    
    message RequestPaymentMessage {
        optional Message noteMessage = 4;
        optional string currencyCodeIso4217 = 1;
        optional uint64 amount1000 = 2;
        optional string requestFrom = 3;
        optional int64 expiryTimestamp = 5;
        optional Money amount = 6;
        optional PaymentBackground background = 7;
    }
    
    message RequestPhoneNumberMessage {
        optional ContextInfo contextInfo = 1;
    }
    
    message RequestWelcomeMessageMetadata {
        optional LocalChatState localChatState = 1;
        enum LocalChatState {
            EMPTY = 0;
            NON_EMPTY = 1;
        }
    }
    
    message ScheduledCallCreationMessage {
        optional int64 scheduledTimestampMs = 1;
        optional CallType callType = 2;
        optional string title = 3;
        enum CallType {
            UNKNOWN = 0;
            VOICE = 1;
            VIDEO = 2;
        }
    }
    
    message ScheduledCallEditMessage {
        optional MessageKey key = 1;
        optional EditType editType = 2;
        enum EditType {
            UNKNOWN = 0;
            CANCEL = 1;
        }
    }
    
    message SendPaymentMessage {
        optional Message noteMessage = 2;
        optional MessageKey requestMessageKey = 3;
        optional PaymentBackground background = 4;
    }
    
    message SenderKeyDistributionMessage {
        optional string groupId = 1;
        optional bytes axolotlSenderKeyDistributionMessage = 2;
    }
    
    message StickerMessage {
        optional string url = 1;
        optional bytes fileSha256 = 2;
        optional bytes fileEncSha256 = 3;
        optional bytes mediaKey = 4;
        optional string mimetype = 5;
        optional uint32 height = 6;
        optional uint32 width = 7;
        optional string directPath = 8;
        optional uint64 fileLength = 9;
        optional int64 mediaKeyTimestamp = 10;
        optional uint32 firstFrameLength = 11;
        optional bytes firstFrameSidecar = 12;
        optional bool isAnimated = 13;
        optional bytes pngThumbnail = 16;
        optional ContextInfo contextInfo = 17;
        optional int64 stickerSentTs = 18;
        optional bool isAvatar = 19;
        optional bool isAiSticker = 20;
        optional bool isLottie = 21;
    }
    
    message StickerSyncRMRMessage {
        repeated string filehash = 1;
        optional string rmrSource = 2;
        optional int64 requestTimestamp = 3;
    }
    
    message TemplateButtonReplyMessage {
        optional string selectedId = 1;
        optional string selectedDisplayText = 2;
        optional ContextInfo contextInfo = 3;
        optional uint32 selectedIndex = 4;
        optional uint32 selectedCarouselCardIndex = 5;
    }
    
    message TemplateMessage {
        optional ContextInfo contextInfo = 3;
        optional HydratedFourRowTemplate hydratedTemplate = 4;
        optional string templateId = 9;
        oneof format {
            Message.TemplateMessage.FourRowTemplate fourRowTemplate = 1;
            Message.TemplateMessage.HydratedFourRowTemplate hydratedFourRowTemplate = 2;
            Message.InteractiveMessage interactiveMessageTemplate = 5;
        }
        message FourRowTemplate {
            optional Message.HighlyStructuredMessage content = 6;
            optional Message.HighlyStructuredMessage footer = 7;
            repeated TemplateButton buttons = 8;
            oneof title {
                Message.DocumentMessage documentMessage = 1;
                Message.HighlyStructuredMessage highlyStructuredMessage = 2;
                Message.ImageMessage imageMessage = 3;
                Message.VideoMessage videoMessage = 4;
                Message.LocationMessage locationMessage = 5;
            }
        }
        
        message HydratedFourRowTemplate {
            optional string hydratedContentText = 6;
            optional string hydratedFooterText = 7;
            repeated HydratedTemplateButton hydratedButtons = 8;
            optional string templateId = 9;
            optional bool maskLinkedDevices = 10;
            oneof title {
                Message.DocumentMessage documentMessage = 1;
                string hydratedTitleText = 2;
                Message.ImageMessage imageMessage = 3;
                Message.VideoMessage videoMessage = 4;
                Message.LocationMessage locationMessage = 5;
            }
        }
        
    }
    
    message VideoMessage {
        optional string url = 1;
        optional string mimetype = 2;
        optional bytes fileSha256 = 3;
        optional uint64 fileLength = 4;
        optional uint32 seconds = 5;
        optional bytes mediaKey = 6;
        optional string caption = 7;
        optional bool gifPlayback = 8;
        optional uint32 height = 9;
        optional uint32 width = 10;
        optional bytes fileEncSha256 = 11;
        repeated InteractiveAnnotation interactiveAnnotations = 12;
        optional string directPath = 13;
        optional int64 mediaKeyTimestamp = 14;
        optional bytes jpegThumbnail = 16;
        optional ContextInfo contextInfo = 17;
        optional bytes streamingSidecar = 18;
        optional Attribution gifAttribution = 19;
        optional bool viewOnce = 20;
        optional string thumbnailDirectPath = 21;
        optional bytes thumbnailSha256 = 22;
        optional bytes thumbnailEncSha256 = 23;
        optional string staticUrl = 24;
        repeated InteractiveAnnotation annotations = 25;
        enum Attribution {
            NONE = 0;
            GIPHY = 1;
            TENOR = 2;
        }
    }
    
}

message MessageAddOnContextInfo {
    optional uint32 messageAddOnDurationInSecs = 1;
}

message MessageContextInfo {
    optional DeviceListMetadata deviceListMetadata = 1;
    optional int32 deviceListMetadataVersion = 2;
    optional bytes messageSecret = 3;
    optional bytes paddingBytes = 4;
    optional uint32 messageAddOnDurationInSecs = 5;
    optional bytes botMessageSecret = 6;
    optional BotMetadata botMetadata = 7;
    optional int32 reportingTokenVersion = 8;
}

message MessageKey {
    optional string remoteJid = 1;
    optional bool fromMe = 2;
    optional string id = 3;
    optional string participant = 4;
}

message MessageSecretMessage {
    optional sfixed32 version = 1;
    optional bytes encIv = 2;
    optional bytes encPayload = 3;
}

message Money {
    optional int64 value = 1;
    optional uint32 offset = 2;
    optional string currencyCode = 3;
}

message MsgOpaqueData {
    optional string body = 1;
    optional string caption = 3;
    optional double lng = 5;
    optional bool isLive = 6;
    optional double lat = 7;
    optional int32 paymentAmount1000 = 8;
    optional string paymentNoteMsgBody = 9;
    optional string canonicalUrl = 10;
    optional string matchedText = 11;
    optional string title = 12;
    optional string description = 13;
    optional bytes futureproofBuffer = 14;
    optional string clientUrl = 15;
    optional string loc = 16;
    optional string pollName = 17;
    repeated PollOption pollOptions = 18;
    optional uint32 pollSelectableOptionsCount = 20;
    optional bytes messageSecret = 21;
    optional string originalSelfAuthor = 51;
    optional int64 senderTimestampMs = 22;
    optional string pollUpdateParentKey = 23;
    optional PollEncValue encPollVote = 24;
    optional bool isSentCagPollCreation = 28;
    optional string encReactionTargetMessageKey = 25;
    optional bytes encReactionEncPayload = 26;
    optional bytes encReactionEncIv = 27;
    optional bytes botMessageSecret = 29;
    optional string targetMessageKey = 30;
    optional bytes encPayload = 31;
    optional bytes encIv = 32;
    message PollOption {
        optional string name = 1;
    }
    
}

message MsgRowOpaqueData {
    optional MsgOpaqueData currentMsg = 1;
    optional MsgOpaqueData quotedMsg = 2;
}

message NoiseCertificate {
    optional bytes details = 1;
    optional bytes signature = 2;
    message Details {
        optional uint32 serial = 1;
        optional string issuer = 2;
        optional uint64 expires = 3;
        optional string subject = 4;
        optional bytes key = 5;
    }
    
}

message NotificationMessageInfo {
    optional MessageKey key = 1;
    optional Message message = 2;
    optional uint64 messageTimestamp = 3;
    optional string participant = 4;
}

message NotificationSettings {
    optional string messageVibrate = 1;
    optional string messagePopup = 2;
    optional string messageLight = 3;
    optional bool lowPriorityNotifications = 4;
    optional bool reactionsMuted = 5;
    optional string callVibrate = 6;
}

message PastParticipant {
    optional string userJid = 1;
    optional LeaveReason leaveReason = 2;
    optional uint64 leaveTs = 3;
    enum LeaveReason {
        LEFT = 0;
        REMOVED = 1;
    }
}

message PastParticipants {
    optional string groupJid = 1;
    repeated PastParticipant pastParticipants = 2;
}

message PatchDebugData {
    optional bytes currentLthash = 1;
    optional bytes newLthash = 2;
    optional bytes patchVersion = 3;
    optional bytes collectionName = 4;
    optional bytes firstFourBytesFromAHashOfSnapshotMacKey = 5;
    optional bytes newLthashSubtract = 6;
    optional int32 numberAdd = 7;
    optional int32 numberRemove = 8;
    optional int32 numberOverride = 9;
    optional Platform senderPlatform = 10;
    optional bool isSenderPrimary = 11;
    enum Platform {
        ANDROID = 0;
        SMBA = 1;
        IPHONE = 2;
        SMBI = 3;
        WEB = 4;
        UWP = 5;
        DARWIN = 6;
    }
}

message PaymentBackground {
    optional string id = 1;
    optional uint64 fileLength = 2;
    optional uint32 width = 3;
    optional uint32 height = 4;
    optional string mimetype = 5;
    optional fixed32 placeholderArgb = 6;
    optional fixed32 textArgb = 7;
    optional fixed32 subtextArgb = 8;
    optional MediaData mediaData = 9;
    optional Type type = 10;
    message MediaData {
        optional bytes mediaKey = 1;
        optional int64 mediaKeyTimestamp = 2;
        optional bytes fileSha256 = 3;
        optional bytes fileEncSha256 = 4;
        optional string directPath = 5;
    }
    
    enum Type {
        UNKNOWN = 0;
        DEFAULT = 1;
    }
}

message PaymentInfo {
    optional Currency currencyDeprecated = 1;
    optional uint64 amount1000 = 2;
    optional string receiverJid = 3;
    optional Status status = 4;
    optional uint64 transactionTimestamp = 5;
    optional MessageKey requestMessageKey = 6;
    optional uint64 expiryTimestamp = 7;
    optional bool futureproofed = 8;
    optional string currency = 9;
    optional TxnStatus txnStatus = 10;
    optional bool useNoviFiatFormat = 11;
    optional Money primaryAmount = 12;
    optional Money exchangeAmount = 13;
    enum Currency {
        UNKNOWN_CURRENCY = 0;
        INR = 1;
    }
    enum Status {
        UNKNOWN_STATUS = 0;
        PROCESSING = 1;
        SENT = 2;
        NEED_TO_ACCEPT = 3;
        COMPLETE = 4;
        COULD_NOT_COMPLETE = 5;
        REFUNDED = 6;
        EXPIRED = 7;
        REJECTED = 8;
        CANCELLED = 9;
        WAITING_FOR_PAYER = 10;
        WAITING = 11;
    }
    enum TxnStatus {
        UNKNOWN = 0;
        PENDING_SETUP = 1;
        PENDING_RECEIVER_SETUP = 2;
        INIT = 3;
        SUCCESS = 4;
        COMPLETED = 5;
        FAILED = 6;
        FAILED_RISK = 7;
        FAILED_PROCESSING = 8;
        FAILED_RECEIVER_PROCESSING = 9;
        FAILED_DA = 10;
        FAILED_DA_FINAL = 11;
        REFUNDED_TXN = 12;
        REFUND_FAILED = 13;
        REFUND_FAILED_PROCESSING = 14;
        REFUND_FAILED_DA = 15;
        EXPIRED_TXN = 16;
        AUTH_CANCELED = 17;
        AUTH_CANCEL_FAILED_PROCESSING = 18;
        AUTH_CANCEL_FAILED = 19;
        COLLECT_INIT = 20;
        COLLECT_SUCCESS = 21;
        COLLECT_FAILED = 22;
        COLLECT_FAILED_RISK = 23;
        COLLECT_REJECTED = 24;
        COLLECT_EXPIRED = 25;
        COLLECT_CANCELED = 26;
        COLLECT_CANCELLING = 27;
        IN_REVIEW = 28;
        REVERSAL_SUCCESS = 29;
        REVERSAL_PENDING = 30;
        REFUND_PENDING = 31;
    }
}

message PhoneNumberToLIDMapping {
    optional string pnJid = 1;
    optional string lidJid = 2;
}

message PhotoChange {
    optional bytes oldPhoto = 1;
    optional bytes newPhoto = 2;
    optional uint32 newPhotoId = 3;
}

message PinInChat {
    optional Type type = 1;
    optional MessageKey key = 2;
    optional int64 senderTimestampMs = 3;
    optional int64 serverTimestampMs = 4;
    optional MessageAddOnContextInfo messageAddOnContextInfo = 5;
    enum Type {
        UNKNOWN_TYPE = 0;
        PIN_FOR_ALL = 1;
        UNPIN_FOR_ALL = 2;
    }
}

message Point {
    optional int32 xDeprecated = 1;
    optional int32 yDeprecated = 2;
    optional double x = 3;
    optional double y = 4;
}

message PollAdditionalMetadata {
    optional bool pollInvalidated = 1;
}

message PollEncValue {
    optional bytes encPayload = 1;
    optional bytes encIv = 2;
}

message PollUpdate {
    optional MessageKey pollUpdateMessageKey = 1;
    optional Message.PollVoteMessage vote = 2;
    optional int64 senderTimestampMs = 3;
    optional int64 serverTimestampMs = 4;
    optional bool unread = 5;
}

message PreKeyRecordStructure {
    optional uint32 id = 1;
    optional bytes publicKey = 2;
    optional bytes privateKey = 3;
}

message PreKeySignalMessage {
    optional uint32 registrationId = 5;
    optional uint32 preKeyId = 1;
    optional uint32 signedPreKeyId = 6;
    optional bytes baseKey = 2;
    optional bytes identityKey = 3;
    optional bytes message = 4;
}

message PremiumMessageInfo {
    optional string serverCampaignId = 1;
}

message Pushname {
    optional string id = 1;
    optional string pushname = 2;
}

message QP {
    enum ClauseType {
        AND = 1;
        OR = 2;
        NOR = 3;
    }
    message Filter {
        required string filterName = 1;
        repeated QP.FilterParameters parameters = 2;
        optional QP.FilterResult filterResult = 3;
        required QP.FilterClientNotSupportedConfig clientNotSupportedConfig = 4;
    }
    
    message FilterClause {
        required QP.ClauseType clauseType = 1;
        repeated QP.FilterClause clauses = 2;
        repeated QP.Filter filters = 3;
    }
    
    enum FilterClientNotSupportedConfig {
        PASS_BY_DEFAULT = 1;
        FAIL_BY_DEFAULT = 2;
    }
    message FilterParameters {
        optional string key = 1;
        optional string value = 2;
    }
    
    enum FilterResult {
        TRUE = 1;
        FALSE = 2;
        UNKNOWN = 3;
    }
}

message Reaction {
    optional MessageKey key = 1;
    optional string text = 2;
    optional string groupingKey = 3;
    optional int64 senderTimestampMs = 4;
    optional bool unread = 5;
}

message RecentEmojiWeight {
    optional string emoji = 1;
    optional float weight = 2;
}

message RecordStructure {
    optional SessionStructure currentSession = 1;
    repeated SessionStructure previousSessions = 2;
}

message ReportingTokenInfo {
    optional bytes reportingTag = 1;
}

message SenderKeyDistributionMessage {
    optional uint32 id = 1;
    optional uint32 iteration = 2;
    optional bytes chainKey = 3;
    optional bytes signingKey = 4;
}

message SenderKeyMessage {
    optional uint32 id = 1;
    optional uint32 iteration = 2;
    optional bytes ciphertext = 3;
}

message SenderKeyRecordStructure {
    repeated SenderKeyStateStructure senderKeyStates = 1;
}

message SenderKeyStateStructure {
    optional uint32 senderKeyId = 1;
    optional SenderChainKey senderChainKey = 2;
    optional SenderSigningKey senderSigningKey = 3;
    repeated SenderMessageKey senderMessageKeys = 4;
    message SenderChainKey {
        optional uint32 iteration = 1;
        optional bytes seed = 2;
    }
    
    message SenderMessageKey {
        optional uint32 iteration = 1;
        optional bytes seed = 2;
    }
    
    message SenderSigningKey {
        optional bytes public = 1;
        optional bytes private = 2;
    }
    
}

message ServerErrorReceipt {
    optional string stanzaId = 1;
}

message SessionStructure {
    optional uint32 sessionVersion = 1;
    optional bytes localIdentityPublic = 2;
    optional bytes remoteIdentityPublic = 3;
    optional bytes rootKey = 4;
    optional uint32 previousCounter = 5;
    optional Chain senderChain = 6;
    repeated Chain receiverChains = 7;
    optional PendingKeyExchange pendingKeyExchange = 8;
    optional PendingPreKey pendingPreKey = 9;
    optional uint32 remoteRegistrationId = 10;
    optional uint32 localRegistrationId = 11;
    optional bool needsRefresh = 12;
    optional bytes aliceBaseKey = 13;
    message Chain {
        optional bytes senderRatchetKey = 1;
        optional bytes senderRatchetKeyPrivate = 2;
        optional ChainKey chainKey = 3;
        repeated MessageKey messageKeys = 4;
        message ChainKey {
            optional uint32 index = 1;
            optional bytes key = 2;
        }
        
        message MessageKey {
            optional uint32 index = 1;
            optional bytes cipherKey = 2;
            optional bytes macKey = 3;
            optional bytes iv = 4;
        }
        
    }
    
    message PendingKeyExchange {
        optional uint32 sequence = 1;
        optional bytes localBaseKey = 2;
        optional bytes localBaseKeyPrivate = 3;
        optional bytes localRatchetKey = 4;
        optional bytes localRatchetKeyPrivate = 5;
        optional bytes localIdentityKey = 7;
        optional bytes localIdentityKeyPrivate = 8;
    }
    
    message PendingPreKey {
        optional uint32 preKeyId = 1;
        optional int32 signedPreKeyId = 3;
        optional bytes baseKey = 2;
    }
    
}

message SignalMessage {
    optional bytes ratchetKey = 1;
    optional uint32 counter = 2;
    optional uint32 previousCounter = 3;
    optional bytes ciphertext = 4;
}

message SignedPreKeyRecordStructure {
    optional uint32 id = 1;
    optional bytes publicKey = 2;
    optional bytes privateKey = 3;
    optional bytes signature = 4;
    optional fixed64 timestamp = 5;
}

message StatusPSA {
    required uint64 campaignId = 44;
    optional uint64 campaignExpirationTimestamp = 45;
}

message StickerMetadata {
    optional string url = 1;
    optional bytes fileSha256 = 2;
    optional bytes fileEncSha256 = 3;
    optional bytes mediaKey = 4;
    optional string mimetype = 5;
    optional uint32 height = 6;
    optional uint32 width = 7;
    optional string directPath = 8;
    optional uint64 fileLength = 9;
    optional float weight = 10;
    optional int64 lastStickerSentTs = 11;
}

message SyncActionData {
    optional bytes index = 1;
    optional SyncActionValue value = 2;
    optional bytes padding = 3;
    optional int32 version = 4;
}

message SyncActionValue {
    optional int64 timestamp = 1;
    optional StarAction starAction = 2;
    optional ContactAction contactAction = 3;
    optional MuteAction muteAction = 4;
    optional PinAction pinAction = 5;
    optional SecurityNotificationSetting securityNotificationSetting = 6;
    optional PushNameSetting pushNameSetting = 7;
    optional QuickReplyAction quickReplyAction = 8;
    optional RecentEmojiWeightsAction recentEmojiWeightsAction = 11;
    optional LabelEditAction labelEditAction = 14;
    optional LabelAssociationAction labelAssociationAction = 15;
    optional LocaleSetting localeSetting = 16;
    optional ArchiveChatAction archiveChatAction = 17;
    optional DeleteMessageForMeAction deleteMessageForMeAction = 18;
    optional KeyExpiration keyExpiration = 19;
    optional MarkChatAsReadAction markChatAsReadAction = 20;
    optional ClearChatAction clearChatAction = 21;
    optional DeleteChatAction deleteChatAction = 22;
    optional UnarchiveChatsSetting unarchiveChatsSetting = 23;
    optional PrimaryFeature primaryFeature = 24;
    optional AndroidUnsupportedActions androidUnsupportedActions = 26;
    optional AgentAction agentAction = 27;
    optional SubscriptionAction subscriptionAction = 28;
    optional UserStatusMuteAction userStatusMuteAction = 29;
    optional TimeFormatAction timeFormatAction = 30;
    optional NuxAction nuxAction = 31;
    optional PrimaryVersionAction primaryVersionAction = 32;
    optional StickerAction stickerAction = 33;
    optional RemoveRecentStickerAction removeRecentStickerAction = 34;
    optional ChatAssignmentAction chatAssignment = 35;
    optional ChatAssignmentOpenedStatusAction chatAssignmentOpenedStatus = 36;
    optional PnForLidChatAction pnForLidChatAction = 37;
    optional MarketingMessageAction marketingMessageAction = 38;
    optional MarketingMessageBroadcastAction marketingMessageBroadcastAction = 39;
    optional ExternalWebBetaAction externalWebBetaAction = 40;
    optional PrivacySettingRelayAllCalls privacySettingRelayAllCalls = 41;
    optional CallLogAction callLogAction = 42;
    optional StatusPrivacyAction statusPrivacy = 44;
    optional BotWelcomeRequestAction botWelcomeRequestAction = 45;
    optional DeleteIndividualCallLogAction deleteIndividualCallLog = 46;
    optional LabelReorderingAction labelReorderingAction = 47;
    optional PaymentInfoAction paymentInfoAction = 48;
    optional CustomPaymentMethodsAction customPaymentMethodsAction = 49;
    message AgentAction {
        optional string name = 1;
        optional int32 deviceID = 2;
        optional bool isDeleted = 3;
    }
    
    message AndroidUnsupportedActions {
        optional bool allowed = 1;
    }
    
    message ArchiveChatAction {
        optional bool archived = 1;
        optional SyncActionValue.SyncActionMessageRange messageRange = 2;
    }
    
    message BotWelcomeRequestAction {
        optional bool isSent = 1;
    }
    
    message CallLogAction {
        optional CallLogRecord callLogRecord = 1;
    }
    
    message ChatAssignmentAction {
        optional string deviceAgentID = 1;
    }
    
    message ChatAssignmentOpenedStatusAction {
        optional bool chatOpened = 1;
    }
    
    message ClearChatAction {
        optional SyncActionValue.SyncActionMessageRange messageRange = 1;
    }
    
    message ContactAction {
        optional string fullName = 1;
        optional string firstName = 2;
        optional string lidJid = 3;
        optional bool saveOnPrimaryAddressbook = 4;
    }
    
    message CustomPaymentMethod {
        required string credentialId = 1;
        required string country = 2;
        required string type = 3;
        repeated SyncActionValue.CustomPaymentMethodMetadata metadata = 4;
    }
    
    message CustomPaymentMethodMetadata {
        required string key = 1;
        required string value = 2;
    }
    
    message CustomPaymentMethodsAction {
        repeated SyncActionValue.CustomPaymentMethod customPaymentMethods = 1;
    }
    
    message DeleteChatAction {
        optional SyncActionValue.SyncActionMessageRange messageRange = 1;
    }
    
    message DeleteIndividualCallLogAction {
        optional string peerJid = 1;
        optional bool isIncoming = 2;
    }
    
    message DeleteMessageForMeAction {
        optional bool deleteMedia = 1;
        optional int64 messageTimestamp = 2;
    }
    
    message ExternalWebBetaAction {
        optional bool isOptIn = 1;
    }
    
    message KeyExpiration {
        optional int32 expiredKeyEpoch = 1;
    }
    
    message LabelAssociationAction {
        optional bool labeled = 1;
    }
    
    message LabelEditAction {
        optional string name = 1;
        optional int32 color = 2;
        optional int32 predefinedId = 3;
        optional bool deleted = 4;
        optional int32 orderIndex = 5;
    }
    
    message LabelReorderingAction {
        repeated int32 sortedLabelIds = 1;
    }
    
    message LocaleSetting {
        optional string locale = 1;
    }
    
    message MarkChatAsReadAction {
        optional bool read = 1;
        optional SyncActionValue.SyncActionMessageRange messageRange = 2;
    }
    
    message MarketingMessageAction {
        optional string name = 1;
        optional string message = 2;
        optional MarketingMessagePrototypeType type = 3;
        optional int64 createdAt = 4;
        optional int64 lastSentAt = 5;
        optional bool isDeleted = 6;
        optional string mediaId = 7;
        enum MarketingMessagePrototypeType {
            PERSONALIZED = 0;
        }
    }
    
    message MarketingMessageBroadcastAction {
        optional int32 repliedCount = 1;
    }
    
    message MuteAction {
        optional bool muted = 1;
        optional int64 muteEndTimestamp = 2;
        optional bool autoMuted = 3;
    }
    
    message NuxAction {
        optional bool acknowledged = 1;
    }
    
    message PaymentInfoAction {
        optional string cpi = 1;
    }
    
    message PinAction {
        optional bool pinned = 1;
    }
    
    message PnForLidChatAction {
        optional string pnJid = 1;
    }
    
    message PrimaryFeature {
        repeated string flags = 1;
    }
    
    message PrimaryVersionAction {
        optional string version = 1;
    }
    
    message PrivacySettingRelayAllCalls {
        optional bool isEnabled = 1;
    }
    
    message PushNameSetting {
        optional string name = 1;
    }
    
    message QuickReplyAction {
        optional string shortcut = 1;
        optional string message = 2;
        repeated string keywords = 3;
        optional int32 count = 4;
        optional bool deleted = 5;
    }
    
    message RecentEmojiWeightsAction {
        repeated RecentEmojiWeight weights = 1;
    }
    
    message RemoveRecentStickerAction {
        optional int64 lastStickerSentTs = 1;
    }
    
    message SecurityNotificationSetting {
        optional bool showNotification = 1;
    }
    
    message StarAction {
        optional bool starred = 1;
    }
    
    message StatusPrivacyAction {
        optional StatusDistributionMode mode = 1;
        repeated string userJid = 2;
        enum StatusDistributionMode {
            ALLOW_LIST = 0;
            DENY_LIST = 1;
            CONTACTS = 2;
        }
    }
    
    message StickerAction {
        optional string url = 1;
        optional bytes fileEncSha256 = 2;
        optional bytes mediaKey = 3;
        optional string mimetype = 4;
        optional uint32 height = 5;
        optional uint32 width = 6;
        optional string directPath = 7;
        optional uint64 fileLength = 8;
        optional bool isFavorite = 9;
        optional uint32 deviceIdHint = 10;
    }
    
    message SubscriptionAction {
        optional bool isDeactivated = 1;
        optional bool isAutoRenewing = 2;
        optional int64 expirationDate = 3;
    }
    
    message SyncActionMessage {
        optional MessageKey key = 1;
        optional int64 timestamp = 2;
    }
    
    message SyncActionMessageRange {
        optional int64 lastMessageTimestamp = 1;
        optional int64 lastSystemMessageTimestamp = 2;
        repeated SyncActionValue.SyncActionMessage messages = 3;
    }
    
    message TimeFormatAction {
        optional bool isTwentyFourHourFormatEnabled = 1;
    }
    
    message UnarchiveChatsSetting {
        optional bool unarchiveChats = 1;
    }
    
    message UserStatusMuteAction {
        optional bool muted = 1;
    }
    
}

message SyncdIndex {
    optional bytes blob = 1;
}

message SyncdMutation {
    optional SyncdOperation operation = 1;
    optional SyncdRecord record = 2;
    enum SyncdOperation {
        SET = 0;
        REMOVE = 1;
    }
}

message SyncdMutations {
    repeated SyncdMutation mutations = 1;
}

message SyncdPatch {
    optional SyncdVersion version = 1;
    repeated SyncdMutation mutations = 2;
    optional ExternalBlobReference externalMutations = 3;
    optional bytes snapshotMac = 4;
    optional bytes patchMac = 5;
    optional KeyId keyId = 6;
    optional ExitCode exitCode = 7;
    optional uint32 deviceIndex = 8;
    optional bytes clientDebugData = 9;
}

message SyncdRecord {
    optional SyncdIndex index = 1;
    optional SyncdValue value = 2;
    optional KeyId keyId = 3;
}

message SyncdSnapshot {
    optional SyncdVersion version = 1;
    repeated SyncdRecord records = 2;
    optional bytes mac = 3;
    optional KeyId keyId = 4;
}

message SyncdValue {
    optional bytes blob = 1;
}

message SyncdVersion {
    optional uint64 version = 1;
}

message TemplateButton {
    optional uint32 index = 4;
    oneof button {
        TemplateButton.QuickReplyButton quickReplyButton = 1;
        TemplateButton.URLButton urlButton = 2;
        TemplateButton.CallButton callButton = 3;
    }
    message CallButton {
        optional Message.HighlyStructuredMessage displayText = 1;
        optional Message.HighlyStructuredMessage phoneNumber = 2;
    }
    
    message QuickReplyButton {
        optional Message.HighlyStructuredMessage displayText = 1;
        optional string id = 2;
    }
    
    message URLButton {
        optional Message.HighlyStructuredMessage displayText = 1;
        optional Message.HighlyStructuredMessage url = 2;
    }
    
}

message UserReceipt {
    required string userJid = 1;
    optional int64 receiptTimestamp = 2;
    optional int64 readTimestamp = 3;
    optional int64 playedTimestamp = 4;
    repeated string pendingDeviceJid = 5;
    repeated string deliveredDeviceJid = 6;
}

message VerifiedNameCertificate {
    optional bytes details = 1;
    optional bytes signature = 2;
    optional bytes serverSignature = 3;
    message Details {
        optional uint64 serial = 1;
        optional string issuer = 2;
        optional string verifiedName = 4;
        repeated LocalizedName localizedNames = 8;
        optional uint64 issueTime = 10;
    }
    
}

message WallpaperSettings {
    optional string filename = 1;
    optional uint32 opacity = 2;
}

message WebFeatures {
    optional Flag labelsDisplay = 1;
    optional Flag voipIndividualOutgoing = 2;
    optional Flag groupsV3 = 3;
    optional Flag groupsV3Create = 4;
    optional Flag changeNumberV2 = 5;
    optional Flag queryStatusV3Thumbnail = 6;
    optional Flag liveLocations = 7;
    optional Flag queryVname = 8;
    optional Flag voipIndividualIncoming = 9;
    optional Flag quickRepliesQuery = 10;
    optional Flag payments = 11;
    optional Flag stickerPackQuery = 12;
    optional Flag liveLocationsFinal = 13;
    optional Flag labelsEdit = 14;
    optional Flag mediaUpload = 15;
    optional Flag mediaUploadRichQuickReplies = 18;
    optional Flag vnameV2 = 19;
    optional Flag videoPlaybackUrl = 20;
    optional Flag statusRanking = 21;
    optional Flag voipIndividualVideo = 22;
    optional Flag thirdPartyStickers = 23;
    optional Flag frequentlyForwardedSetting = 24;
    optional Flag groupsV4JoinPermission = 25;
    optional Flag recentStickers = 26;
    optional Flag catalog = 27;
    optional Flag starredStickers = 28;
    optional Flag voipGroupCall = 29;
    optional Flag templateMessage = 30;
    optional Flag templateMessageInteractivity = 31;
    optional Flag ephemeralMessages = 32;
    optional Flag e2ENotificationSync = 33;
    optional Flag recentStickersV2 = 34;
    optional Flag recentStickersV3 = 36;
    optional Flag userNotice = 37;
    optional Flag support = 39;
    optional Flag groupUiiCleanup = 40;
    optional Flag groupDogfoodingInternalOnly = 41;
    optional Flag settingsSync = 42;
    optional Flag archiveV2 = 43;
    optional Flag ephemeralAllowGroupMembers = 44;
    optional Flag ephemeral24HDuration = 45;
    optional Flag mdForceUpgrade = 46;
    optional Flag disappearingMode = 47;
    optional Flag externalMdOptInAvailable = 48;
    optional Flag noDeleteMessageTimeLimit = 49;
    enum Flag {
        NOT_STARTED = 0;
        FORCE_UPGRADE = 1;
        DEVELOPMENT = 2;
        PRODUCTION = 3;
    }
}

message WebMessageInfo {
    required MessageKey key = 1;
    optional Message message = 2;
    optional uint64 messageTimestamp = 3;
    optional Status status = 4;
    optional string participant = 5;
    optional uint64 messageC2STimestamp = 6;
    optional bool ignore = 16;
    optional bool starred = 17;
    optional bool broadcast = 18;
    optional string pushName = 19;
    optional bytes mediaCiphertextSha256 = 20;
    optional bool multicast = 21;
    optional bool urlText = 22;
    optional bool urlNumber = 23;
    optional StubType messageStubType = 24;
    optional bool clearMedia = 25;
    repeated string messageStubParameters = 26;
    optional uint32 duration = 27;
    repeated string labels = 28;
    optional PaymentInfo paymentInfo = 29;
    optional Message.LiveLocationMessage finalLiveLocation = 30;
    optional PaymentInfo quotedPaymentInfo = 31;
    optional uint64 ephemeralStartTimestamp = 32;
    optional uint32 ephemeralDuration = 33;
    optional bool ephemeralOffToOn = 34;
    optional bool ephemeralOutOfSync = 35;
    optional BizPrivacyStatus bizPrivacyStatus = 36;
    optional string verifiedBizName = 37;
    optional MediaData mediaData = 38;
    optional PhotoChange photoChange = 39;
    repeated UserReceipt userReceipt = 40;
    repeated Reaction reactions = 41;
    optional MediaData quotedStickerData = 42;
    optional bytes futureproofData = 43;
    optional StatusPSA statusPsa = 44;
    repeated PollUpdate pollUpdates = 45;
    optional PollAdditionalMetadata pollAdditionalMetadata = 46;
    optional string agentId = 47;
    optional bool statusAlreadyViewed = 48;
    optional bytes messageSecret = 49;
    optional KeepInChat keepInChat = 50;
    optional string originalSelfAuthorUserJidString = 51;
    optional uint64 revokeMessageTimestamp = 52;
    optional PinInChat pinInChat = 54;
    optional PremiumMessageInfo premiumMessageInfo = 55;
    optional bool is1PBizBotMessage = 56;
    optional bool isGroupHistoryMessage = 57;
    optional string botMessageInvokerJid = 58;
    optional CommentMetadata commentMetadata = 59;
    repeated EventResponse eventResponses = 61;
    optional ReportingTokenInfo reportingTokenInfo = 62;
    optional uint64 newsletterServerId = 63;
    enum BizPrivacyStatus {
        E2EE = 0;
        FB = 2;
        BSP = 1;
        BSP_AND_FB = 3;
    }
    enum Status {
        ERROR = 0;
        PENDING = 1;
        SERVER_ACK = 2;
        DELIVERY_ACK = 3;
        READ = 4;
        PLAYED = 5;
    }
    enum StubType {
        UNKNOWN = 0;
        REVOKE = 1;
        CIPHERTEXT = 2;
        FUTUREPROOF = 3;
        NON_VERIFIED_TRANSITION = 4;
        UNVERIFIED_TRANSITION = 5;
        VERIFIED_TRANSITION = 6;
        VERIFIED_LOW_UNKNOWN = 7;
        VERIFIED_HIGH = 8;
        VERIFIED_INITIAL_UNKNOWN = 9;
        VERIFIED_INITIAL_LOW = 10;
        VERIFIED_INITIAL_HIGH = 11;
        VERIFIED_TRANSITION_ANY_TO_NONE = 12;
        VERIFIED_TRANSITION_ANY_TO_HIGH = 13;
        VERIFIED_TRANSITION_HIGH_TO_LOW = 14;
        VERIFIED_TRANSITION_HIGH_TO_UNKNOWN = 15;
        VERIFIED_TRANSITION_UNKNOWN_TO_LOW = 16;
        VERIFIED_TRANSITION_LOW_TO_UNKNOWN = 17;
        VERIFIED_TRANSITION_NONE_TO_LOW = 18;
        VERIFIED_TRANSITION_NONE_TO_UNKNOWN = 19;
        GROUP_CREATE = 20;
        GROUP_CHANGE_SUBJECT = 21;
        GROUP_CHANGE_ICON = 22;
        GROUP_CHANGE_INVITE_LINK = 23;
        GROUP_CHANGE_DESCRIPTION = 24;
        GROUP_CHANGE_RESTRICT = 25;
        GROUP_CHANGE_ANNOUNCE = 26;
        GROUP_PARTICIPANT_ADD = 27;
        GROUP_PARTICIPANT_REMOVE = 28;
        GROUP_PARTICIPANT_PROMOTE = 29;
        GROUP_PARTICIPANT_DEMOTE = 30;
        GROUP_PARTICIPANT_INVITE = 31;
        GROUP_PARTICIPANT_LEAVE = 32;
        GROUP_PARTICIPANT_CHANGE_NUMBER = 33;
        BROADCAST_CREATE = 34;
        BROADCAST_ADD = 35;
        BROADCAST_REMOVE = 36;
        GENERIC_NOTIFICATION = 37;
        E2E_IDENTITY_CHANGED = 38;
        E2E_ENCRYPTED = 39;
        CALL_MISSED_VOICE = 40;
        CALL_MISSED_VIDEO = 41;
        INDIVIDUAL_CHANGE_NUMBER = 42;
        GROUP_DELETE = 43;
        GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE = 44;
        CALL_MISSED_GROUP_VOICE = 45;
        CALL_MISSED_GROUP_VIDEO = 46;
        PAYMENT_CIPHERTEXT = 47;
        PAYMENT_FUTUREPROOF = 48;
        PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED = 49;
        PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED = 50;
        PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED = 51;
        PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP = 52;
        PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP = 53;
        PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER = 54;
        PAYMENT_ACTION_SEND_PAYMENT_REMINDER = 55;
        PAYMENT_ACTION_SEND_PAYMENT_INVITATION = 56;
        PAYMENT_ACTION_REQUEST_DECLINED = 57;
        PAYMENT_ACTION_REQUEST_EXPIRED = 58;
        PAYMENT_ACTION_REQUEST_CANCELLED = 59;
        BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM = 60;
        BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP = 61;
        BIZ_INTRO_TOP = 62;
        BIZ_INTRO_BOTTOM = 63;
        BIZ_NAME_CHANGE = 64;
        BIZ_MOVE_TO_CONSUMER_APP = 65;
        BIZ_TWO_TIER_MIGRATION_TOP = 66;
        BIZ_TWO_TIER_MIGRATION_BOTTOM = 67;
        OVERSIZED = 68;
        GROUP_CHANGE_NO_FREQUENTLY_FORWARDED = 69;
        GROUP_V4_ADD_INVITE_SENT = 70;
        GROUP_PARTICIPANT_ADD_REQUEST_JOIN = 71;
        CHANGE_EPHEMERAL_SETTING = 72;
        E2E_DEVICE_CHANGED = 73;
        VIEWED_ONCE = 74;
        E2E_ENCRYPTED_NOW = 75;
        BLUE_MSG_BSP_FB_TO_BSP_PREMISE = 76;
        BLUE_MSG_BSP_FB_TO_SELF_FB = 77;
        BLUE_MSG_BSP_FB_TO_SELF_PREMISE = 78;
        BLUE_MSG_BSP_FB_UNVERIFIED = 79;
        BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 80;
        BLUE_MSG_BSP_FB_VERIFIED = 81;
        BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 82;
        BLUE_MSG_BSP_PREMISE_TO_SELF_PREMISE = 83;
        BLUE_MSG_BSP_PREMISE_UNVERIFIED = 84;
        BLUE_MSG_BSP_PREMISE_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 85;
        BLUE_MSG_BSP_PREMISE_VERIFIED = 86;
        BLUE_MSG_BSP_PREMISE_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 87;
        BLUE_MSG_CONSUMER_TO_BSP_FB_UNVERIFIED = 88;
        BLUE_MSG_CONSUMER_TO_BSP_PREMISE_UNVERIFIED = 89;
        BLUE_MSG_CONSUMER_TO_SELF_FB_UNVERIFIED = 90;
        BLUE_MSG_CONSUMER_TO_SELF_PREMISE_UNVERIFIED = 91;
        BLUE_MSG_SELF_FB_TO_BSP_PREMISE = 92;
        BLUE_MSG_SELF_FB_TO_SELF_PREMISE = 93;
        BLUE_MSG_SELF_FB_UNVERIFIED = 94;
        BLUE_MSG_SELF_FB_UNVERIFIED_TO_SELF_PREMISE_VERIFIED = 95;
        BLUE_MSG_SELF_FB_VERIFIED = 96;
        BLUE_MSG_SELF_FB_VERIFIED_TO_SELF_PREMISE_UNVERIFIED = 97;
        BLUE_MSG_SELF_PREMISE_TO_BSP_PREMISE = 98;
        BLUE_MSG_SELF_PREMISE_UNVERIFIED = 99;
        BLUE_MSG_SELF_PREMISE_VERIFIED = 100;
        BLUE_MSG_TO_BSP_FB = 101;
        BLUE_MSG_TO_CONSUMER = 102;
        BLUE_MSG_TO_SELF_FB = 103;
        BLUE_MSG_UNVERIFIED_TO_BSP_FB_VERIFIED = 104;
        BLUE_MSG_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 105;
        BLUE_MSG_UNVERIFIED_TO_SELF_FB_VERIFIED = 106;
        BLUE_MSG_UNVERIFIED_TO_VERIFIED = 107;
        BLUE_MSG_VERIFIED_TO_BSP_FB_UNVERIFIED = 108;
        BLUE_MSG_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 109;
        BLUE_MSG_VERIFIED_TO_SELF_FB_UNVERIFIED = 110;
        BLUE_MSG_VERIFIED_TO_UNVERIFIED = 111;
        BLUE_MSG_BSP_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 112;
        BLUE_MSG_BSP_FB_UNVERIFIED_TO_SELF_FB_VERIFIED = 113;
        BLUE_MSG_BSP_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 114;
        BLUE_MSG_BSP_FB_VERIFIED_TO_SELF_FB_UNVERIFIED = 115;
        BLUE_MSG_SELF_FB_UNVERIFIED_TO_BSP_PREMISE_VERIFIED = 116;
        BLUE_MSG_SELF_FB_VERIFIED_TO_BSP_PREMISE_UNVERIFIED = 117;
        E2E_IDENTITY_UNAVAILABLE = 118;
        GROUP_CREATING = 119;
        GROUP_CREATE_FAILED = 120;
        GROUP_BOUNCED = 121;
        BLOCK_CONTACT = 122;
        EPHEMERAL_SETTING_NOT_APPLIED = 123;
        SYNC_FAILED = 124;
        SYNCING = 125;
        BIZ_PRIVACY_MODE_INIT_FB = 126;
        BIZ_PRIVACY_MODE_INIT_BSP = 127;
        BIZ_PRIVACY_MODE_TO_FB = 128;
        BIZ_PRIVACY_MODE_TO_BSP = 129;
        DISAPPEARING_MODE = 130;
        E2E_DEVICE_FETCH_FAILED = 131;
        ADMIN_REVOKE = 132;
        GROUP_INVITE_LINK_GROWTH_LOCKED = 133;
        COMMUNITY_LINK_PARENT_GROUP = 134;
        COMMUNITY_LINK_SIBLING_GROUP = 135;
        COMMUNITY_LINK_SUB_GROUP = 136;
        COMMUNITY_UNLINK_PARENT_GROUP = 137;
        COMMUNITY_UNLINK_SIBLING_GROUP = 138;
        COMMUNITY_UNLINK_SUB_GROUP = 139;
        GROUP_PARTICIPANT_ACCEPT = 140;
        GROUP_PARTICIPANT_LINKED_GROUP_JOIN = 141;
        COMMUNITY_CREATE = 142;
        EPHEMERAL_KEEP_IN_CHAT = 143;
        GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST = 144;
        GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE = 145;
        INTEGRITY_UNLINK_PARENT_GROUP = 146;
        COMMUNITY_PARTICIPANT_PROMOTE = 147;
        COMMUNITY_PARTICIPANT_DEMOTE = 148;
        COMMUNITY_PARENT_GROUP_DELETED = 149;
        COMMUNITY_LINK_PARENT_GROUP_MEMBERSHIP_APPROVAL = 150;
        GROUP_PARTICIPANT_JOINED_GROUP_AND_PARENT_GROUP = 151;
        MASKED_THREAD_CREATED = 152;
        MASKED_THREAD_UNMASKED = 153;
        BIZ_CHAT_ASSIGNMENT = 154;
        CHAT_PSA = 155;
        CHAT_POLL_CREATION_MESSAGE = 156;
        CAG_MASKED_THREAD_CREATED = 157;
        COMMUNITY_PARENT_GROUP_SUBJECT_CHANGED = 158;
        CAG_INVITE_AUTO_ADD = 159;
        BIZ_CHAT_ASSIGNMENT_UNASSIGN = 160;
        CAG_INVITE_AUTO_JOINED = 161;
        SCHEDULED_CALL_START_MESSAGE = 162;
        COMMUNITY_INVITE_RICH = 163;
        COMMUNITY_INVITE_AUTO_ADD_RICH = 164;
        SUB_GROUP_INVITE_RICH = 165;
        SUB_GROUP_PARTICIPANT_ADD_RICH = 166;
        COMMUNITY_LINK_PARENT_GROUP_RICH = 167;
        COMMUNITY_PARTICIPANT_ADD_RICH = 168;
        SILENCED_UNKNOWN_CALLER_AUDIO = 169;
        SILENCED_UNKNOWN_CALLER_VIDEO = 170;
        GROUP_MEMBER_ADD_MODE = 171;
        GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD = 172;
        COMMUNITY_CHANGE_DESCRIPTION = 173;
        SENDER_INVITE = 174;
        RECEIVER_INVITE = 175;
        COMMUNITY_ALLOW_MEMBER_ADDED_GROUPS = 176;
        PINNED_MESSAGE_IN_CHAT = 177;
        PAYMENT_INVITE_SETUP_INVITER = 178;
        PAYMENT_INVITE_SETUP_INVITEE_RECEIVE_ONLY = 179;
        PAYMENT_INVITE_SETUP_INVITEE_SEND_AND_RECEIVE = 180;
        LINKED_GROUP_CALL_START = 181;
        REPORT_TO_ADMIN_ENABLED_STATUS = 182;
        EMPTY_SUBGROUP_CREATE = 183;
        SCHEDULED_CALL_CANCEL = 184;
        SUBGROUP_ADMIN_TRIGGERED_AUTO_ADD_RICH = 185;
        GROUP_CHANGE_RECENT_HISTORY_SHARING = 186;
        PAID_MESSAGE_SERVER_CAMPAIGN_ID = 187;
        GENERAL_CHAT_CREATE = 188;
        GENERAL_CHAT_ADD = 189;
        GENERAL_CHAT_AUTO_ADD_DISABLED = 190;
        SUGGESTED_SUBGROUP_ANNOUNCE = 191;
        BIZ_BOT_1P_MESSAGING_ENABLED = 192;
        CHANGE_USERNAME = 193;
        BIZ_COEX_PRIVACY_INIT_SELF = 194;
        BIZ_COEX_PRIVACY_TRANSITION_SELF = 195;
        SUPPORT_AI_EDUCATION = 196;
        BIZ_BOT_3P_MESSAGING_ENABLED = 197;
        REMINDER_SETUP_MESSAGE = 198;
        REMINDER_SENT_MESSAGE = 199;
        REMINDER_CANCEL_MESSAGE = 200;
    }
}

message WebNotificationsInfo {
    optional uint64 timestamp = 2;
    optional uint32 unreadChats = 3;
    optional uint32 notifyMessageCount = 4;
    repeated WebMessageInfo notifyMessages = 5;
}
