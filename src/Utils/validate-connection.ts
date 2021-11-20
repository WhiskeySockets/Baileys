import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto'
import type { SocketConfig, AuthenticationCreds, SignalCreds } from "../Types"
import { Curve, hmacSign } from './crypto'
import { encodeInt } from './generics'
import { BinaryNode, S_WHATSAPP_NET, jidDecode, Binary, getAllBinaryNodeChildren } from '../WABinary'
import { createSignalIdentity } from './signal'

const ENCODED_VERSION = 'S9Kdc4pc4EJryo21snc5cg=='
const getUserAgent = ({ version, browser }: Pick<SocketConfig, 'version' | 'browser'>) => ({
  appVersion: {
    primary: version[0],
    secondary: version[1],
    tertiary: version[2],
  },
  platform: 14,
  releaseChannel: 0,
  mcc: "000",
  mnc: "000",
  osVersion: browser[2],
  manufacturer: "",
  device: browser[1],
  osBuildNumber: "0.1",
  localeLanguageIso6391: 'en',
  localeCountryIso31661Alpha2: 'en',
})

export const generateLoginNode = (userJid: string, config: Pick<SocketConfig, 'version' | 'browser'>) => {
  const { user, device } = jidDecode(userJid)
  const payload = {
    passive: true,
    connectType: 1,
    connectReason: 1,
    userAgent: getUserAgent(config),
    webInfo: { webSubPlatform: 0 },
    username: parseInt(user, 10),
    device: device,
  }
  return proto.ClientPayload.encode(payload).finish()
}

export const generateRegistrationNode = (
  { registrationId, signedPreKey, signedIdentityKey }: SignalCreds,
  config: Pick<SocketConfig, 'version' | 'browser'>
) => {
  const appVersionBuf = new Uint8Array(Buffer.from(ENCODED_VERSION, "base64"));

  const companion = {
    os: config.browser[0],
    version: {
      primary: 10,
      secondary: undefined,
      tertiary: undefined,
    },
    platformType: 1,
    requireFullSync: false,
  };

  const companionProto = proto.CompanionProps.encode(companion).finish()

  const registerPayload = {
    connectReason: 1,
    connectType: 1,
    passive: false,
    regData: {
      buildHash: appVersionBuf,
      companionProps: companionProto,
      eRegid: encodeInt(4, registrationId),
      eKeytype: encodeInt(1, 5),
      eIdent: signedIdentityKey.public,
      eSkeyId: encodeInt(3, signedPreKey.keyId),
      eSkeyVal: signedPreKey.keyPair.public,
      eSkeySig: signedPreKey.signature,
    },
    userAgent: getUserAgent(config),
    webInfo: {
      webSubPlatform: 0,
    },
  }

  return proto.ClientPayload.encode(registerPayload).finish()
}

export const configureSuccessfulPairing = (
  stanza: BinaryNode,
  { advSecretKey, signedIdentityKey, signalIdentities }: Pick<AuthenticationCreds, 'advSecretKey' | 'signedIdentityKey' | 'signalIdentities'>
) => {
  const [pair] = getAllBinaryNodeChildren(stanza)
  const pairContent = Array.isArray(pair.content) ? pair.content : []

  const msgId = stanza.attrs.id
  const deviceIdentity = pairContent.find(m => m.tag === 'device-identity')?.content
  const businessName = pairContent.find(m => m.tag === 'biz')?.attrs?.name
  const verifiedName = businessName || ''
  const jid = pairContent.find(m => m.tag === 'device')?.attrs?.jid

  const { details, hmac } = proto.ADVSignedDeviceIdentityHMAC.decode(deviceIdentity as Buffer)

  const advSign = hmacSign(details, Buffer.from(advSecretKey, 'base64'))

  if (Buffer.compare(hmac, advSign) !== 0) {
    throw new Boom('Invalid pairing')
  }

  const account = proto.ADVSignedDeviceIdentity.decode(details)
  const { accountSignatureKey, accountSignature } = account

  const accountMsg = Binary.build(new Uint8Array([6, 0]), account.details, signedIdentityKey.public).readByteArray()
  if (!Curve.verify(accountSignatureKey, accountMsg, accountSignature)) {
    throw new Boom('Failed to verify account signature')
  }

  const deviceMsg = Binary.build(new Uint8Array([6, 1]), account.details, signedIdentityKey.public, account.accountSignatureKey).readByteArray()
  account.deviceSignature = Curve.sign(signedIdentityKey.private, deviceMsg)

  const identity = createSignalIdentity(jid, accountSignatureKey)

  const keyIndex = proto.ADVDeviceIdentity.decode(account.details).keyIndex

  const accountEnc = proto.ADVSignedDeviceIdentity.encode({
    ...account.toJSON(),
    accountSignatureKey: undefined
  }).finish()

  const reply: BinaryNode = {
    tag: 'iq',
    attrs: {
      to: S_WHATSAPP_NET,
      type: 'result',
      id: msgId,
    },
    content: [
      { 
        tag: 'pair-device-sign', 
        attrs: { },
        content: [
          { tag: 'device-identity', attrs: { 'key-index': `${keyIndex}` }, content: accountEnc }
        ]
      }
    ]
  }

  const authUpdate: Partial<AuthenticationCreds> = {
    account, 
    me: { id: jid, verifiedName }, 
    signalIdentities: [...(signalIdentities || []), identity] 
  }
  return {
    creds: authUpdate,
    reply
  }
}