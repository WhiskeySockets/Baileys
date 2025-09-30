export const dsdiffParserLoader = {
    parserType: 'dsdiff',
    extensions: ['.dff'],
    mimeTypes: ['audio/dsf', 'audio/dsd'],
    async load() {
        return (await import('./DsdiffParser.js')).DsdiffParser;
    }
};
