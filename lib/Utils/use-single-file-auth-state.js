"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleFileAuthState = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const promises_1 = require("fs/promises");
const index_1 = require("../../WAProto/index");
const auth_utils_1 = require("./auth-utils");
const generics_1 = require("./generics");
const fileLock = new async_lock_1.default({ maxPending: Infinity });
const useSingleFileAuthState = async (filepath) => {
    const filePath = filepath + '.json';
    const writeData = (data) => {
        return fileLock.acquire(filePath, () => (0, promises_1.writeFile)(filePath, JSON.stringify(data, generics_1.BufferJSON.replacer)));
    };
    const readData = async () => {
        try {
            const data = await fileLock.acquire(filePath, () => (0, promises_1.readFile)(filePath, { encoding: 'utf-8' }));
            return JSON.parse(data, generics_1.BufferJSON.reviver);
        }
        catch (error) {
            return null;
        }
    };
    const fileInfo = await (0, promises_1.stat)(filePath).catch(() => null);
    if (fileInfo && !fileInfo.isFile()) {
        throw new Error(`A non-file exists at ${filePath}, please delete it or specify a different path.`);
    }
    // Initialize with default credentials if the file is empty or doesn't exist
    const { creds = (0, auth_utils_1.initAuthCreds)(), keys = {} } = await readData() || {};
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    for (const id of ids) {
                        const value = keys[`${type}-${id}`];
                        data[id] = type === 'app-state-sync-key' && value
                            ? index_1.proto.Message.AppStateSyncKeyData.fromObject(value)
                            : value;
                    }
                    return data;
                },
                set: async (data) => {
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            if (value) {
                                keys[`${category}-${id}`] = value;
                            }
                            else {
                                delete keys[`${category}-${id}`];
                            }
                        }
                    }
                    await writeData({ creds, keys });
                }
            }
        },
        saveCreds: () => writeData({ creds, keys })
    };
};
exports.useSingleFileAuthState = useSingleFileAuthState;
