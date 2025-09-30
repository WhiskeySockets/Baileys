export interface ITree {
    [name: string]: string | number | boolean | Uint8Array | ITree | ITree[];
}
export declare const DataType: {
    readonly string: 0;
    readonly uint: 1;
    readonly uid: 2;
    readonly bool: 3;
    readonly binary: 4;
    readonly float: 5;
};
export type DataType = typeof DataType[keyof typeof DataType];
export type ValueType = string | number | Uint8Array | boolean | ITree | ITree[];
export interface IHeader {
    id: number;
    len: number;
}
export interface IEbmlElements {
    version?: number;
    readVersion?: number;
    maxIDWidth?: number;
    maxSizeWidth?: number;
    docType?: string;
    docTypeVersion?: number;
    docTypeReadVersion?: number;
}
export interface IElementType {
    readonly name: string;
    readonly value?: DataType;
    readonly container?: {
        [id: number]: IElementType;
    };
    readonly multiple?: boolean;
}
export interface IEbmlDoc {
    ebml: IEbmlElements;
}
