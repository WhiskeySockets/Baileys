import type { USyncQueryProtocol } from '../Types/USync.js';
import { type BinaryNode } from '../WABinary/index.js';
import { USyncUser } from './USyncUser.js';
export type USyncQueryResultList = {
    [protocol: string]: unknown;
    id: string;
};
export type USyncQueryResult = {
    list: USyncQueryResultList[];
    sideList: USyncQueryResultList[];
};
export declare class USyncQuery {
    protocols: USyncQueryProtocol[];
    users: USyncUser[];
    context: string;
    mode: string;
    constructor();
    withMode(mode: string): this;
    withContext(context: string): this;
    withUser(user: USyncUser): this;
    parseUSyncQueryResult(result: BinaryNode): USyncQueryResult | undefined;
    withDeviceProtocol(): this;
    withContactProtocol(): this;
    withStatusProtocol(): this;
    withDisappearingModeProtocol(): this;
    withBotProfileProtocol(): this;
    withLIDProtocol(): this;
}
//# sourceMappingURL=USyncQuery.d.ts.map