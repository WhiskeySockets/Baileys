export type UnionOfParseErrors = CouldNotDetermineFileTypeError | UnsupportedFileTypeError | UnexpectedFileContentError | FieldDecodingError | InternalParserError;
export declare const makeParseError: <Name extends string>(name: Name) => {
    new (message: string): {
        name: Name;
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
declare const CouldNotDetermineFileTypeError_base: {
    new (message: string): {
        name: "CouldNotDetermineFileTypeError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class CouldNotDetermineFileTypeError extends CouldNotDetermineFileTypeError_base {
}
declare const UnsupportedFileTypeError_base: {
    new (message: string): {
        name: "UnsupportedFileTypeError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class UnsupportedFileTypeError extends UnsupportedFileTypeError_base {
}
declare const UnexpectedFileContentError_base: {
    new (message: string): {
        name: "UnexpectedFileContentError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
declare class UnexpectedFileContentError extends UnexpectedFileContentError_base {
    readonly fileType: string;
    constructor(fileType: string, message: string);
    toString(): string;
}
declare const FieldDecodingError_base: {
    new (message: string): {
        name: "FieldDecodingError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class FieldDecodingError extends FieldDecodingError_base {
}
declare const InternalParserError_base: {
    new (message: string): {
        name: "InternalParserError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class InternalParserError extends InternalParserError_base {
}
export declare const makeUnexpectedFileContentError: <FileType extends string>(fileType: FileType) => {
    new (message: string): {
        readonly fileType: string;
        toString(): string;
        name: "UnexpectedFileContentError";
        message: string;
        stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export {};
