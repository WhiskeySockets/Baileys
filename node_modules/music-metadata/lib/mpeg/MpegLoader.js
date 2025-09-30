export const mpegParserLoader = {
    parserType: 'mpeg',
    extensions: ['.mp2', '.mp3', '.m2a', '.aac', 'aacp'],
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/aacs', 'audio/aacp'],
    async load() {
        return (await import('./MpegParser.js')).MpegParser;
    }
};
