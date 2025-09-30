export const musepackParserLoader = {
    parserType: 'musepack',
    extensions: ['.mpc'],
    mimeTypes: ['audio/musepack'],
    async load() {
        return (await import('./MusepackParser.js')).MusepackParser;
    }
};
