import type { USyncQueryProtocol } from '../../Types/USync.js';
import { type BinaryNode } from '../../WABinary/index.js';
export type StatusData = {
    status?: string | null;
    setAt?: Date;
};
export declare class USyncStatusProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(): null;
    parser(node: BinaryNode): StatusData | undefined;
}
//# sourceMappingURL=USyncStatusProtocol.d.ts.map