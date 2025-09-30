import type { BinaryNode } from '../WABinary/index.js';
import { USyncUser } from '../WAUSync/index.js';
/**
 * Defines the interface for a USyncQuery protocol
 */
export interface USyncQueryProtocol {
    /**
     * The name of the protocol
     */
    name: string;
    /**
     * Defines what goes inside the query part of a USyncQuery
     */
    getQueryElement: () => BinaryNode;
    /**
     * Defines what goes inside the user part of a USyncQuery
     */
    getUserElement: (user: USyncUser) => BinaryNode | null;
    /**
     * Parse the result of the query
     * @param data Data from the result
     * @returns Whatever the protocol is supposed to return
     */
    parser: (data: BinaryNode) => unknown;
}
//# sourceMappingURL=USync.d.ts.map