export const dsfParserLoader = {
    parserType: 'dsf',
    extensions: ['.dsf'],
    mimeTypes: ['audio/dsf'],
    async load() {
        return (await import('./DsfParser.js')).DsfParser;
    }
};
