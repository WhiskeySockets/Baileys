import type { USyncQueryProtocol } from '../../Types/USync.js';
import type { BinaryNode } from '../../WABinary/index.js';
import type { USyncUser } from '../USyncUser.js';
export declare class USyncLIDProtocol implements USyncQueryProtocol {
    name: string;
    getQueryElement(): BinaryNode;
    getUserElement(user: USyncUser): BinaryNode | null;
    parser(node: BinaryNode): string | null;
}
//# sourceMappingURL=UsyncLIDProtocol.d.ts.map