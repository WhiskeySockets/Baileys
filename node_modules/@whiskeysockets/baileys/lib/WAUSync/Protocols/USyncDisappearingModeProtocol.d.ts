import type { USyncQueryProtocol } from '../../Types/USync.js';
import { type BinaryNode } from '../../WABinary/index.js';
export type DisappearingModeData = {
    duration: number;
    setAt?: Date;
};
export declare class USyncDisappearingModeProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): null;
    parser(node: BinaryNode): DisappearingModeData | undefined;
}
//# sourceMappingURL=USyncDisappearingModeProtocol.d.ts.map