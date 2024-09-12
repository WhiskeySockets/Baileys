import proto from '../WAProto'
import makeWASocket from './Socket'

export * from './Utils'
export * from './Types'
export * from './Store'
export * from './Defaults'
export * from './WABinary'
export * from './WAM'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket, proto }
export default makeWASocket
