import { prepareWAMessageMedia } from './messages.js';
import { extractImageThumb, getHttpStream } from './messages-media.js';
const THUMBNAIL_WIDTH_PX = 192;
/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async (url, { thumbnailWidth, fetchOpts }) => {
    const stream = await getHttpStream(url, fetchOpts);
    const result = await extractImageThumb(stream, thumbnailWidth);
    return result;
};
/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text first matched URL in text
 * @returns the URL info required to generate link preview
 */
export const getUrlInfo = async (text, opts = {
    thumbnailWidth: THUMBNAIL_WIDTH_PX,
    fetchOpts: { timeout: 3000 }
}) => {
    try {
        // retries
        const retries = 0;
        const maxRetry = 5;
        const { getLinkPreview } = await import('link-preview-js');
        let previewLink = text;
        if (!text.startsWith('https://') && !text.startsWith('http://')) {
            previewLink = 'https://' + previewLink;
        }
        const info = await getLinkPreview(previewLink, {
            ...opts.fetchOpts,
            followRedirects: 'follow',
            handleRedirects: (baseURL, forwardedURL) => {
                const urlObj = new URL(baseURL);
                const forwardedURLObj = new URL(forwardedURL);
                if (retries >= maxRetry) {
                    return false;
                }
                if (forwardedURLObj.hostname === urlObj.hostname ||
                    forwardedURLObj.hostname === 'www.' + urlObj.hostname ||
                    'www.' + forwardedURLObj.hostname === urlObj.hostname) {
                    retries + 1;
                    return true;
                }
                else {
                    return false;
                }
            },
            headers: opts.fetchOpts
        });
        if (info && 'title' in info && info.title) {
            const [image] = info.images;
            const urlInfo = {
                'canonical-url': info.url,
                'matched-text': text,
                title: info.title,
                description: info.description,
                originalThumbnailUrl: image
            };
            if (opts.uploadImage) {
                const { imageMessage } = await prepareWAMessageMedia({ image: { url: image } }, {
                    upload: opts.uploadImage,
                    mediaTypeOverride: 'thumbnail-link',
                    options: opts.fetchOpts
                });
                urlInfo.jpegThumbnail = imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined;
                urlInfo.highQualityThumbnail = imageMessage || undefined;
            }
            else {
                try {
                    urlInfo.jpegThumbnail = image ? (await getCompressedJpegThumbnail(image, opts)).buffer : undefined;
                }
                catch (error) {
                    opts.logger?.debug({ err: error.stack, url: previewLink }, 'error in generating thumbnail');
                }
            }
            return urlInfo;
        }
    }
    catch (error) {
        if (!error.message.includes('receive a valid')) {
            throw error;
        }
    }
};
//# sourceMappingURL=link-preview.js.map