export const wavpackParserLoader = {
    parserType: 'wavpack',
    extensions: ['.wv', '.wvp'],
    mimeTypes: ['audio/wavpack'],
    async load() {
        return (await import('./WavPackParser.js')).WavPackParser;
    }
};
