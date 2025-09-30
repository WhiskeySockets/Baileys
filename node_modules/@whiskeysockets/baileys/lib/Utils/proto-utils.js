import { BufferJSON } from './generics.js';
export function decodeAndHydrate(MessageType, buffer) {
    const decoded = MessageType.decode(buffer);
    const hydrated = JSON.parse(JSON.stringify(decoded, BufferJSON.replacer), BufferJSON.reviver);
    return hydrated;
}
//# sourceMappingURL=proto-utils.js.map