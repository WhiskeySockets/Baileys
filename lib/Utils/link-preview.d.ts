import { AxiosRequestConfig } from 'axios';
import { Logger } from 'pino';
import { WAMediaUploadFunction, WAUrlInfo } from '../Types';
export type URLGenerationOptions = {
    thumbnailWidth: number;
    fetchOpts: {
        /** Timeout in ms */
        timeout: number;
        proxyUrl?: string;
        headers?: AxiosRequestConfig<{}>['headers'];
    };
    uploadImage?: WAMediaUploadFunction;
    logger?: Logger;
};
/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text first matched URL in text
 * @returns the URL info required to generate link preview
 */
export declare const getUrlInfo: (text: string, opts?: URLGenerationOptions) => Promise<WAUrlInfo | undefined>;
