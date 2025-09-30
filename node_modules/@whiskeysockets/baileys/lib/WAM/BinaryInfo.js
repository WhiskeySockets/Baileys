export class BinaryInfo {
    constructor(options = {}) {
        this.protocolVersion = 5;
        this.sequence = 0;
        this.events = [];
        this.buffer = [];
        Object.assign(this, options);
    }
}
//# sourceMappingURL=BinaryInfo.js.map