import makeWASocket from './Socket/index'
import type { GroupWarmUpSocketMethods } from './Types/index'

export * from '../WAProto/index.js'
export * from './Utils/index'
export * from './Types/index'
export * from './Defaults/index'
export * from './WABinary/index'
export * from './WAM/index'
export * from './WAUSync/index'

export type WASocket = ReturnType<typeof makeWASocket> & GroupWarmUpSocketMethods
export { makeWASocket }
export default makeWASocket
