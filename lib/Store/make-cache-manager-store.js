"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_manager_1 = require("cache-manager");
const WAProto_1 = require("../../WAProto");
const Utils_1 = require("../Utils");
const logger_1 = __importDefault(require("../Utils/logger"));
const makeCacheManagerAuthState = async (store, sessionKey) => {
    const defaultKey = (file) => `${sessionKey}:${file}`;
    const databaseConn = await (0, cache_manager_1.caching)(store);
    const writeData = async (file, data) => {
        let ttl = undefined;
        if (file === 'creds') {
            ttl = 63115200; // 2 years
        }
        await databaseConn.set(defaultKey(file), JSON.stringify(data, Utils_1.BufferJSON.replacer), ttl);
    };
    const readData = async (file) => {
        try {
            const data = await databaseConn.get(defaultKey(file));
            if (data) {
                return JSON.parse(data, Utils_1.BufferJSON.reviver);
            }
            return null;
        }
        catch (error) {
            logger_1.default.error(error);
            return null;
        }
    };
    const removeData = async (file) => {
        try {
            return await databaseConn.del(defaultKey(file));
        }
        catch (_a) {
            logger_1.default.error(`Error removing ${file} from session ${sessionKey}`);
        }
    };
    const clearState = async () => {
        try {
            const result = await databaseConn.store.keys(`${sessionKey}*`);
            await Promise.all(result.map(async (key) => await databaseConn.del(key)));
        }
        catch (err) {
        }
    };
    const creds = (await readData('creds')) || (0, Utils_1.initAuthCreds)();
    return {
        clearState,
        saveCreds: () => writeData('creds', creds),
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = WAProto_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(key, value) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                },
            }
        }
    };
};
exports.default = makeCacheManagerAuthState;
