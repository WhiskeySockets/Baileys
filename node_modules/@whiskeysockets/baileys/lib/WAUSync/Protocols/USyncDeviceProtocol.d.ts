import type { USyncQueryProtocol } from '../../Types/USync.js';
import { type BinaryNode } from '../../WABinary/index.js';
export type KeyIndexData = {
    timestamp: number;
    signedKeyIndex?: Uint8Array;
    expectedTimestamp?: number;
};
export type DeviceListData = {
    id: number;
    keyIndex?: number;
    isHosted?: boolean;
};
export type ParsedDeviceInfo = {
    deviceList?: DeviceListData[];
    keyIndex?: KeyIndexData;
};
export declare class USyncDeviceProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): BinaryNode | null;
    parser(node: BinaryNode): ParsedDeviceInfo;
}
//# sourceMappingURL=USyncDeviceProtocol.d.ts.map