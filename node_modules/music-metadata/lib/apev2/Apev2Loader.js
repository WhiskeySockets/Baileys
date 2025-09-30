export const apeParserLoader = {
    parserType: 'apev2',
    extensions: ['.ape'],
    mimeTypes: ['audio/ape', 'audio/monkeys-audio'],
    async load() {
        return (await import('./APEv2Parser.js')).APEv2Parser;
    }
};
