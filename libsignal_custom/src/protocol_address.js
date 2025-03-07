// vim: ts=4:sw=4:expandtab


class ProtocolAddress {

    static from(encodedAddress) {
        if (typeof encodedAddress !== 'string' || !encodedAddress.match(/.*\.\d+/)) {
            throw new Error('Invalid address encoding');
        }
        const parts = encodedAddress.split('.');
        return new this(parts[0], parseInt(parts[1]));
    }

    constructor(id, deviceId) {
        if (typeof id !== 'string') {
            throw new TypeError('id required for addr');
        }
        if (id.indexOf('.') !== -1) {
            throw new TypeError('encoded addr detected');
        }
        this.id = id;
        if (typeof deviceId !== 'number') {
            throw new TypeError('number required for deviceId');
        }
        this.deviceId = deviceId;
    }

    toString() {
        return `${this.id}.${this.deviceId}`;
    }

    is(other) {
        if (!(other instanceof ProtocolAddress)) {
            return false;
        }
        return other.id === this.id && other.deviceId === this.deviceId;
    }
}

module.exports = ProtocolAddress;
