export * from './Auth.js';
export * from './GroupMetadata.js';
export * from './Chat.js';
export * from './Contact.js';
export * from './State.js';
export * from './Message.js';
export * from './Socket.js';
export * from './Events.js';
export * from './Product.js';
export * from './Call.js';
export * from './Signal.js';
export * from './Newsletter.js';
export var DisconnectReason;
(function (DisconnectReason) {
    DisconnectReason[DisconnectReason["connectionClosed"] = 428] = "connectionClosed";
    DisconnectReason[DisconnectReason["connectionLost"] = 408] = "connectionLost";
    DisconnectReason[DisconnectReason["connectionReplaced"] = 440] = "connectionReplaced";
    DisconnectReason[DisconnectReason["timedOut"] = 408] = "timedOut";
    DisconnectReason[DisconnectReason["loggedOut"] = 401] = "loggedOut";
    DisconnectReason[DisconnectReason["badSession"] = 500] = "badSession";
    DisconnectReason[DisconnectReason["restartRequired"] = 515] = "restartRequired";
    DisconnectReason[DisconnectReason["multideviceMismatch"] = 411] = "multideviceMismatch";
    DisconnectReason[DisconnectReason["forbidden"] = 403] = "forbidden";
    DisconnectReason[DisconnectReason["unavailableService"] = 503] = "unavailableService";
})(DisconnectReason || (DisconnectReason = {}));
//# sourceMappingURL=index.js.map