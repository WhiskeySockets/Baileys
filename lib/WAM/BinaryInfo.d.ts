/// <reference types="node" />
/// <reference types="node" />
export declare class BinaryInfo {
    protocolVersion: number;
    sequence: number;
    events: {
        [x: string]: {
            props: {
                [x: string]: import("./constants").Value;
            };
            globals: {
                [x: string]: import("./constants").Value;
            };
        };
    }[];
    buffer: Buffer[];
    constructor(options?: Partial<BinaryInfo>);
}
