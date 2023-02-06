import { MOBILE_REGISTRATION_ENDPOINT, MOBILE_TOKEN, MOBILE_USERAGENT, REGISTRATION_PUBLIC_KEY } from '../Defaults'
import { KeyPair, SignedKeyPair, SocketConfig } from '../Types'
import { aesEncryptGCM, Curve, md5 } from '../Utils/crypto'
import { makeBusinessSocket } from './business'

function urlencode(str: string) {
	return str.replace(/-/g, '%2d').replace(/_/g, '%5f').replace(/~/g, '%7e')
}

export const makeRegistrationSocket = (config: SocketConfig) => {
	const sock = makeBusinessSocket(config)

	const register = (code: string) => {
		if(!config.registration) {
			throw new Error('please specify the registration options')
		}

		return mobileRegister({ ...config.auth.creds, ...config.registration, code })
	}

	const requestRegistrationCode = () => {
		if(!config.registration) {
			throw new Error('please specify the registration options')
		}

		return mobileRegisterCode({ ...config.auth.creds, ...config.registration })
	}

	if(config.registration && config.registration.automaticRegistration && !config.auth.creds.registered) {
		import('readline').then(async(readline) => {
			const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

			console.log('Your mobile phone number is not registered.')

			function askForOTP() {
				rl.question('How would you like to receive the one time code for registration? sms or voice\n', (code: string) => {
					code = code.trim().toLowerCase()

					if(code === 'sms' || code === 'voice') {
						config.registration!.method = code

						requestRegistrationCode().then(() => {
							rl.question('Please enter the one time code:\n', async(code: string) => {
								register(code.trim()).then(() => {
									console.log('Successfully registered your phone number.')
									rl.close()
								}).catch((e) => {
									console.error('Failed to register your phone number. Please try again.\n', e)
									askForOTP()
								})
							})
						}).catch((e) => {
							console.error('Failed to request registration code. Please try again.\n', e)
							askForOTP()
						})
					} else {
						askForOTP()
					}
				})
			}

			askForOTP()
		}).catch(() => console.error('Not running in a node environment. Please install the readline module to use the askForOTP option.'))
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
	identityId: string
	phoneId: string
	deviceId: string
}

export interface RegistrationOptions {
	/** whether to automatically register the phone number when not logged in */
	automaticRegistration?: boolean
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

export function registrationParams(params: RegistrationParams) {
	const e_regid = Buffer.alloc(4)
	e_regid.writeInt32BE(params.registrationId)

	const e_skey_id = Buffer.alloc(3)
	e_skey_id.writeInt16BE(0)

	var id = ''

	Buffer.from(params.identityId, 'hex').forEach((x) => {
		// encode random identity_id buffer as percentage url encoding
		id += `%${x.toString(16).padStart(2, '0').toLowerCase()}`
	})

	params.phoneNumberCountryCode = params.phoneNumberCountryCode.replace('+', '').trim()
	params.phoneNumberNationalNumber = params.phoneNumberNationalNumber.replace(/[/-\s)(]/g, '').trim()

	return {
		cc: params.phoneNumberCountryCode,
		in: params.phoneNumberNationalNumber,
		lg: 'en',
		lc: 'GB',
		mistyped: '6',
		authkey: Buffer.from(params.noiseKey.public).toString('base64url'),
		e_regid: e_regid.toString('base64url'),
		e_keytype: 'BQ',
		e_ident: Buffer.from(params.signedIdentityKey.public).toString('base64url'),
		e_skey_id: e_skey_id.toString('base64url'),
		e_skey_val: Buffer.from(params.signedPreKey.keyPair.public).toString('base64url'),
		e_skey_sig: Buffer.from(params.signedPreKey.signature).toString('base64url'),
		fdid: params.phoneId,
		expid: params.deviceId,
		network_radio_type: '1',
		simnum: '1',
		hasinrc: '1',
		pid: '' + Math.floor(Math.random() * 9000 + 100),
		rc: '0',
		id,
		token: md5(Buffer.concat([MOBILE_TOKEN, Buffer.from(params.phoneNumberNationalNumber)])).toString(),
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
			mnc: `${params.phoneNumberMobileNetworkCode}`.padStart(3, '0'),
			sim_mcc: '000',
			sim_mnc: '000',
			method: params?.method || 'sms',
			reason: '',
			hasav: '1',
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
	return mobileRegisterFetch('/register', {
		params: { ...registrationParams(params), code: params.code.replace('-', '') },
	})
}

/**
 * Encrypts the given string as AEAD aes-256-gcm with the public whatsapp key and a random keypair.
 */
export function mobileRegisterEncrypt(data: string) {
	const keypair = Curve.generateKeyPair()
	const key = Curve.sharedKey(REGISTRATION_PUBLIC_KEY, keypair.private)

	const buffer = aesEncryptGCM(Buffer.from(data), new Uint8Array(key), Buffer.alloc(12), Buffer.alloc(0))

	return Buffer.concat([Buffer.from(keypair.public), buffer]).toString('base64url')
}

export async function mobileRegisterFetch(path: string, opts: { params?: Record<string, string>, headers?: Record<string, string> } = {}) {
	if(!opts.params) {
		opts.params = {}
	}

	if(!opts.headers) {
		opts.headers = {}
	}

	opts.headers['User-Agent'] = MOBILE_USERAGENT

	const parameter = [] as string[]

	for(const param in opts.params) {
		parameter.push(param + '=' + urlencode(opts.params[param]))
	}

	const params = urlencode(mobileRegisterEncrypt(parameter.join('&')))
	const url = `${MOBILE_REGISTRATION_ENDPOINT}${path}?ENC=${params}`

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

	if(json.status && json.status !== 'ok') {
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
}
