import { LyricsContentType, TimestampFormat } from '../type.js';
/**
 * Parse LRC (Lyrics) formatted text
 * Ref: https://en.wikipedia.org/wiki/LRC_(file_format)
 * @param lrcString
 */
export function parseLrc(lrcString) {
    const lines = lrcString.split('\n');
    const syncText = [];
    // Regular expression to match LRC timestamps (e.g., [00:45.52] or [00:45.520])
    const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    for (const line of lines) {
        const match = line.match(timestampRegex);
        if (match) {
            const minutes = Number.parseInt(match[1], 10);
            const seconds = Number.parseInt(match[2], 10);
            const millisecondsStr = match[3];
            let milliseconds;
            if (millisecondsStr.length === 3) {
                //  (e.g., .521 = 521 millseconds)
                milliseconds = Number.parseInt(millisecondsStr, 10);
            }
            else {
                //  (e.g., .52 = 520 millseconds)
                milliseconds = Number.parseInt(millisecondsStr, 10) * 10;
            }
            // Convert the timestamp to milliseconds, as per TimestampFormat.milliseconds
            const timestamp = (minutes * 60 + seconds) * 1000 + milliseconds;
            // Get the text portion of the line (e.g., "あの蝶は自由になれたかな")
            const text = line.replace(timestampRegex, '').trim();
            syncText.push({ timestamp, text });
        }
    }
    // Creating the ILyricsTag object
    return {
        contentType: LyricsContentType.lyrics,
        timeStampFormat: TimestampFormat.milliseconds,
        syncText,
    };
}
