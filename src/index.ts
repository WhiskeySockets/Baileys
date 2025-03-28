import makeWASocket from './Socket'
import { makeEnhancedLibSignalRepository } from './Signal/enhanced-libsignal'

export * from '../WAProto'
export * from './Utils'
export * from './Types'
export * from './Defaults'
export * from './WABinary'
export * from './WAM'
export * from './WAUSync'
export * from './Signal'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket, makeEnhancedLibSignalRepository }
export default makeWASocket
