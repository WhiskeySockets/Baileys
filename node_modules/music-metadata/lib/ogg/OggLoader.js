export const oggParserLoader = {
    parserType: 'ogg',
    extensions: ['.ogg', '.ogv', '.oga', '.ogm', '.ogx', '.opus', '.spx'],
    mimeTypes: ['audio/ogg', 'audio/opus', 'audio/speex', 'video/ogg'], // RFC 7845, RFC 6716, RFC 5574
    async load() {
        return (await import('./OggParser.js')).OggParser;
    }
};
