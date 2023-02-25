/* eslint-disable camelcase */
import parsePhoneNumber from 'libphonenumber-js'
import { MOBILE_REGISTRATION_ENDPOINT, MOBILE_TOKEN, MOBILE_USERAGENT, REGISTRATION_PUBLIC_KEY } from '../Defaults'
import phoneNumberMCC from '../Defaults/phonenumber-mcc.json'
import { KeyPair, SignedKeyPair, SocketConfig } from '../Types'
import { aesEncryptGCM, Curve, md5 } from '../Utils/crypto'
import { jidEncode } from '../WABinary'
import { makeBusinessSocket } from './business'
import { MobileSocket } from './mobile-socket'

function urlencode(str: string) {
	return str.replace(/-/g, '%2d').replace(/_/g, '%5f').replace(/~/g, '%7e')
}

const validRegistrationOptions = (config: RegistrationOptions) => !config ||
	!config.phoneNumberCountryCode ||
	!config.phoneNumberNationalNumber ||
	!config.phoneNumberMobileCountryCode ||
	!config.phoneNumberMobileNetworkCode

export const makeRegistrationSocket = (config: SocketConfig) => {
	const sock = makeBusinessSocket(config)

	const register = async(code: string) => {
		if(!validRegistrationOptions(config.auth.creds.registration)) {
			throw new Error('please specify the registration options')
		}

		const result = await mobileRegister({ ...config.auth.creds, ...config.auth.creds.registration as RegistrationOptions, code })

		config.auth.creds.me = {
			id: jidEncode(result.login!, 's.whatsapp.net'),
			name: '~'
		}
		config.auth.creds.registered = true
		sock.ev.emit('creds.update', config.auth.creds)

		if(sock.ws instanceof MobileSocket) {
			sock.ws.connect()
		}

		return result
	}

	const requestRegistrationCode = async() => {
		if(!validRegistrationOptions(config.auth.creds.registration)) {
			throw new Error('please specify the registration options')
		}

		// const exists = await mobileRegisterExists({ ...config.auth.creds, ...config.registration })
		// console.log('exists', exists)

		return mobileRegisterCode({ ...config.auth.creds, ...config.auth.creds.registration as RegistrationOptions })
	}

	if(config.mobile && !config.auth.creds.registered) {
		import('readline').then(async(readline) => {
			const question = (text: string) => new Promise<string>((resolve) => rl.question(text, resolve))

			const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
			const { registration } = config.auth.creds

			if(!registration!.phoneNumber) {
				registration!.phoneNumber = await question('Please enter your mobile phone number:\n')
			} else {
				console.log('Your mobile phone number is not registered.')
			}

			const phoneNumber = parsePhoneNumber(registration!.phoneNumber)
			if(!phoneNumber || !phoneNumber.isValid()) {
				throw new Error('Invalid phone number: ' + registration!.phoneNumber)
			}

			registration!.phoneNumber = phoneNumber.format('E.164')
			registration!.phoneNumberCountryCode = phoneNumber.countryCallingCode
			registration!.phoneNumberNationalNumber = phoneNumber.nationalNumber
			const mcc = phoneNumberMCC[phoneNumber.countryCallingCode]
			if(!mcc) {
				throw new Error('Could not find MCC for phone number: ' + registration!.phoneNumber + '\nPlease specify the MCC manually.')
			}

			registration!.phoneNumberMobileCountryCode = mcc

			async function enterCode() {
				try {
					const code = await question('Please enter the one time code:\n')
					const response = await register(code.replace(/["']/g, '').trim().toLowerCase())
					console.log('Successfully registered your phone number.')
					console.log(response)
					rl.close()
				} catch(error) {
					console.error('Failed to register your phone number. Please try again.\n', error)
					await askForOTP()
				}
			}

			async function askForOTP() {
				let code = await question('How would you like to receive the one time code for registration? "sms" or "voice"\nIf you already have a one time registration code enter "code"\n')
				code = code.replace(/["']/g, '').trim().toLowerCase()

				if(code === 'code') {
					await enterCode()
				} else if(code === 'sms' || code === 'voice') {
					registration!.method = code

					try {
						await requestRegistrationCode()
						await enterCode()
					} catch(error) {
						console.error('Failed to request registration code. Please try again.\n', error)
						await askForOTP()
					}
				} else {
					await askForOTP()
				}
			}

			await askForOTP()
		}).catch(() => console.error('Not running in a node environment. Please install the readline module to use the automatic registration option.'))
	}

	return {
		...sock,
		register,
		requestRegistrationCode,
	}
}

// Backup_token: Base64.getEncoder().encodeToString(Arrays.copyOfRange(Base64.getDecoder().decode(UUID.randomUUID().toString().replace('-','')),0,15))

export interface RegistrationData {
	registrationId: number
	signedPreKey: SignedKeyPair
	noiseKey: KeyPair
	signedIdentityKey: KeyPair
	identityId: Buffer
	phoneId: string
	deviceId: string
	backupToken: Buffer
}

export interface RegistrationOptions {
	/** your phone number */
	phoneNumber?: string
	/** the country code of your phone number */
	phoneNumberCountryCode: string
	/** your phone number without country code */
	phoneNumberNationalNumber: string
	/** the country code of your mobile network
	 * @see {@link https://de.wikipedia.org/wiki/Mobile_Country_Code}
	 */
	phoneNumberMobileCountryCode: string
	/** the network code of your mobile network
	 * @see {@link https://de.wikipedia.org/wiki/Mobile_Network_Code}
	 */
	phoneNumberMobileNetworkCode: string
	/**
	 * How to send the one time code
	 */
	method?: 'sms' | 'voice'
}

export type RegistrationParams = RegistrationData & RegistrationOptions

function convertBufferToUrlHex(buffer: Buffer) {
	var id = ''

	buffer.forEach((x) => {
		// encode random identity_id buffer as percentage url encoding
		id += `%${x.toString(16).padStart(2, '0').toLowerCase()}`
	})

	return id
}

export function registrationParams(params: RegistrationParams) {
	const e_regid = Buffer.alloc(4)
	e_regid.writeInt32BE(params.registrationId)

	const e_skey_id = Buffer.alloc(3)
	e_skey_id.writeInt16BE(params.signedPreKey.keyId)

	params.phoneNumberCountryCode = params.phoneNumberCountryCode.replace('+', '').trim()
	params.phoneNumberNationalNumber = params.phoneNumberNationalNumber.replace(/[/-\s)(]/g, '').trim()

	return {
		cc: params.phoneNumberCountryCode,
		in: params.phoneNumberNationalNumber,
		Rc: '0',
		lg: 'en',
		lc: 'GB',
		mistyped: '6',
		authkey: Buffer.from(params.noiseKey.public).toString('base64url'),
		e_regid: e_regid.toString('base64url'),
		e_keytype: 'BQ',
		e_ident: Buffer.from(params.signedIdentityKey.public).toString('base64url'),
		// e_skey_id: e_skey_id.toString('base64url'),
		e_skey_id: 'AAAA',
		e_skey_val: Buffer.from(params.signedPreKey.keyPair.public).toString('base64url'),
		e_skey_sig: Buffer.from(params.signedPreKey.signature).toString('base64url'),
		fdid: params.phoneId,
		network_ratio_type: '1',
		expid: params.deviceId,
		simnum: '1',
		hasinrc: '1',
		pid: Math.floor(Math.random() * 1000).toString(),
		id: convertBufferToUrlHex(params.identityId),
		backup_token: convertBufferToUrlHex(params.backupToken),
		token: md5(Buffer.concat([MOBILE_TOKEN, Buffer.from(params.phoneNumberNationalNumber)])).toString('hex'),
	}
}

/**
 * Requests a registration code for the given phone number.
 */
export function mobileRegisterCode(params: RegistrationParams) {
	return mobileRegisterFetch('/code', {
		params: {
			...registrationParams(params),
			mcc: `${params.phoneNumberMobileCountryCode}`.padStart(3, '0'),
			mnc: `${params.phoneNumberMobileNetworkCode || '001'}`.padStart(3, '0'),
			sim_mcc: '000',
			sim_mnc: '000',
			method: params?.method || 'sms',
			reason: '',
			hasav: '1'
		},
	})
}

export function mobileRegisterExists(params: RegistrationParams) {
	return mobileRegisterFetch('/exist', {
		params: registrationParams(params)
	})
}

/**
 * Registers the phone number on whatsapp with the received OTP code.
 */
export async function mobileRegister(params: RegistrationParams & { code: string }) {
	const result = await mobileRegisterFetch(`/reg_onboard_abprop?cc=${params.phoneNumberCountryCode}&in=${params.phoneNumberNationalNumber}&rc=0`)

	console.log('reg_onboard_abprop', result)

	return mobileRegisterFetch('/register', {
		params: { ...registrationParams(params), code: params.code.replace('-', '') },
	})
}

/**
 * Encrypts the given string as AEAD aes-256-gcm with the public whatsapp key and a random keypair.
 */
export function mobileRegisterEncrypt(data: string) {
	const keypair = Curve.generateKeyPair()
	const key = Curve.sharedKey(keypair.private, REGISTRATION_PUBLIC_KEY)

	const buffer = aesEncryptGCM(Buffer.from(data), new Uint8Array(key), Buffer.alloc(12), Buffer.alloc(0))

	return Buffer.concat([Buffer.from(keypair.public), buffer]).toString('base64url')
}

export async function mobileRegisterFetch(path: string, opts: { params?: Record<string, string>, headers?: Record<string, string> } = {}) {
	let url = `${MOBILE_REGISTRATION_ENDPOINT}${path}`

	if(opts.params) {
		const parameter = [] as string[]

		for(const param in opts.params) {
			parameter.push(param + '=' + urlencode(opts.params[param]))
		}

		console.log('parameter', opts.params, parameter)

		const params = urlencode(mobileRegisterEncrypt(parameter.join('&')))
		url += `?ENC=${params}`
	}

	if(!opts.headers) {
		opts.headers = {}
	}

	opts.headers['User-Agent'] = MOBILE_USERAGENT

	const response = await fetch(url, opts)

	const text = await response.text()

	try {
		var json = JSON.parse(text)
	} catch(error) {
		throw text
	}

	if(!response.ok || json.reason) {
		throw json
	}

	if(json.status && !['ok', 'sent'].includes(json.status)) {
		throw json
	}

	return json as ExistsResponse
}


export interface ExistsResponse {
	status: 'fail'
	voice_length?: number
	voice_wait?: number
	sms_length?: number
	sms_wait?: number
	reason?: 'incorrect' | 'missing_param'
	login?: string
	flash_type?: number
	ab_hash?: string
    ab_key?: string
    exp_cfg?: string
	lid?: string
}
