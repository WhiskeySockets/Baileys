import type { AxiosRequestConfig } from 'axios';
import { proto } from '../../WAProto/index.js';
import type { Chat, Contact } from '../Types/index.js';
export declare const downloadHistory: (msg: proto.Message.IHistorySyncNotification, options: AxiosRequestConfig<{}>) => Promise<proto.HistorySync>;
export declare const processHistoryMessage: (item: proto.IHistorySync) => {
    chats: Chat[];
    contacts: Contact[];
    messages: proto.IWebMessageInfo[];
    syncType: proto.HistorySync.HistorySyncType;
    progress: number | null | undefined;
};
export declare const downloadAndProcessHistorySyncNotification: (msg: proto.Message.IHistorySyncNotification, options: AxiosRequestConfig<{}>) => Promise<{
    chats: Chat[];
    contacts: Contact[];
    messages: proto.IWebMessageInfo[];
    syncType: proto.HistorySync.HistorySyncType;
    progress: number | null | undefined;
}>;
export declare const getHistoryMsg: (message: proto.IMessage) => proto.Message.IHistorySyncNotification | null | undefined;
//# sourceMappingURL=history.d.ts.map