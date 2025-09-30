import makeWASocket from './Socket/index.js';
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export type WASocket = ReturnType<typeof makeWASocket>;
export { makeWASocket };
export default makeWASocket;
//# sourceMappingURL=index.d.ts.map