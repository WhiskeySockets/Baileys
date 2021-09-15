class CiphertextMessage {
    UNSUPPORTED_VERSION = 1;

    CURRENT_VERSION = 3;

    WHISPER_TYPE = 2;

    PREKEY_TYPE = 3;

    SENDERKEY_TYPE = 4;

    SENDERKEY_DISTRIBUTION_TYPE = 5;

    ENCRYPTED_MESSAGE_OVERHEAD = 53;
}
module.exports = CiphertextMessage;