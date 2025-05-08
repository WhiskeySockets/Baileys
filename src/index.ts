import makeWASocket from './Socket'

export * from '../WAProto'
export * from './Utils'
export * from './Types'
export * from './Defaults'
export * from './WABinary'
export * from './WAM'
export * from './WAUSync'

export const BAILEYSBUSS_VERSION = '7.5.2025'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket }
export default makeWASocket
