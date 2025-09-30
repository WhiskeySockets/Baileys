export const makeParseError = (name) => {
    return class ParseError extends Error {
        constructor(message) {
            super(message);
            this.name = name;
        }
    };
};
// Concrete error class representing a file type determination failure.
export class CouldNotDetermineFileTypeError extends makeParseError('CouldNotDetermineFileTypeError') {
}
// Concrete error class representing an unsupported file type.
export class UnsupportedFileTypeError extends makeParseError('UnsupportedFileTypeError') {
}
// Concrete error class representing unexpected file content.
class UnexpectedFileContentError extends makeParseError('UnexpectedFileContentError') {
    constructor(fileType, message) {
        super(message);
        this.fileType = fileType;
    }
    // Override toString to include file type information.
    toString() {
        return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
    }
}
// Concrete error class representing a field decoding error.
export class FieldDecodingError extends makeParseError('FieldDecodingError') {
}
export class InternalParserError extends makeParseError('InternalParserError') {
}
// Factory function to create a specific type of UnexpectedFileContentError.
export const makeUnexpectedFileContentError = (fileType) => {
    return class extends UnexpectedFileContentError {
        constructor(message) {
            super(fileType, message);
        }
    };
};
