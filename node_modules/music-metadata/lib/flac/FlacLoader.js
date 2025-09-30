export const flacParserLoader = {
    parserType: 'flac',
    extensions: ['.flac'],
    mimeTypes: ['audio/flac'],
    async load() {
        return (await import('./FlacParser.js')).FlacParser;
    }
};
