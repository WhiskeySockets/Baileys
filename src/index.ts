import makeWASocket from './Socket/index.ts'

export * from './WAProto/index.ts'
export * from './Utils/index.ts'
export * from './Types/index.ts'
export * from './Defaults/index.ts'
export * from './WABinary/index.ts'
export * from './WAM/index.ts'
export * from './WAUSync/index.ts'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket }
export default makeWASocket
