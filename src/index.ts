import makeWASocket from './Socket'
import makeWALegacySocket from './LegacySocket'

export * from '../WAProto'
export * from './Utils'
export * from './Types'
//export * from './Store'
export * from './Defaults'
export * from './WABinary'

export type WALegacySocket = ReturnType<typeof makeWALegacySocket>

export { makeWALegacySocket }

export type WASocket = ReturnType<typeof makeWASocket>

export type AnyWASocket = WASocket | WALegacySocket

export default makeWASocket