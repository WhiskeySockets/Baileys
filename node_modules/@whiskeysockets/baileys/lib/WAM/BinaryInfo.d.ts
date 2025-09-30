import type { EventInputType } from './constants.js';
export declare class BinaryInfo {
    protocolVersion: number;
    sequence: number;
    events: EventInputType[];
    buffer: Buffer[];
    constructor(options?: Partial<BinaryInfo>);
}
//# sourceMappingURL=BinaryInfo.d.ts.map