function isNull(str) {
    return str === null || str === '';
}
function intValue(num) {
    const MAX_VALUE = 0x7fffffff;
    const MIN_VALUE = -0x80000000;
    if (num > MAX_VALUE || num < MIN_VALUE) {
        return num & 0xffffffff;
    }
    return num;
}
function hashCode(strKey) {
    let hash = 0;
    if (!isNull(strKey)) {
        for (let i = 0; i < strKey.length; i++) {
            hash = hash * 31 + strKey.charCodeAt(i);
            hash = intValue(hash);
        }
    }
    return hash;
}
export class SenderKeyName {
    constructor(groupId, sender) {
        this.groupId = groupId;
        this.sender = sender;
    }
    getGroupId() {
        return this.groupId;
    }
    getSender() {
        return this.sender;
    }
    serialize() {
        return `${this.groupId}::${this.sender.id}::${this.sender.deviceId}`;
    }
    toString() {
        return this.serialize();
    }
    equals(other) {
        if (other === null)
            return false;
        return this.groupId === other.groupId && this.sender.toString() === other.sender.toString();
    }
    hashCode() {
        return hashCode(this.groupId) ^ hashCode(this.sender.toString());
    }
}
//# sourceMappingURL=sender-key-name.js.map