import { WAAdv } from './WAAdv'
import { WACert } from './WACert'
import { WAChatLockSettings } from './WAChatLockSettings'
import { WADeviceCapabilities } from './WADeviceCapabilities'
import { WAE2E } from './WAE2E'
import { WAEphemeral } from './WAEphemeral'
import { WAHistorySync } from './WAHistorySync'
import { WAMmsRetry } from './WAMmsRetry'
import { WAProtocol } from './WAProtocol'
import { WAReporting } from './WAReporting'
import { WAServerSync } from './WAServerSync'
import { WASyncAction } from './WASyncAction'
import { WAUserPassword } from './WAUserPassword'
import { WAVnameCert } from './WAVnameCert'
import { WAWa6 } from './WAWa6'
import { WAWeb } from './WAWeb'
import { WAWebProtobufSyncAction } from './WAWebProtobufSyncAction'

const proto = { 
  ...WAAdv,
  ...WACert,
  ...WAChatLockSettings,
  ...WADeviceCapabilities,
  ...WAE2E,
  ...WAEphemeral,
  ...WAHistorySync,
  ...WAMmsRetry,
  ...WAProtocol,
  ...WAReporting,
  ...WAServerSync,
  ...WASyncAction,
  ...WAUserPassword,
  ...WAVnameCert,
  ...WAWa6,
  ...WAWeb,
  ...WAWebProtobufSyncAction
}
  
export { proto }