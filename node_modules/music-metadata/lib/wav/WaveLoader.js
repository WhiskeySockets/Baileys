export const riffParserLoader = {
    parserType: 'riff',
    extensions: ['.wav', 'wave', '.bwf'],
    mimeTypes: ['audio/vnd.wave', 'audio/wav', 'audio/wave'],
    async load() {
        return (await import('./WaveParser.js')).WaveParser;
    }
};
