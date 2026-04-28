import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'

const ADMIN_PATH = '/admin/mock-phone/scan-qr'

const wsToHttp = (wsUrl: string): URL => {
	const url = new URL(wsUrl)
	url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:'
	return url
}

// bartender stopped auto-pairing; tests drive the scan over its admin endpoint.
export const postQrToMockPhone = (socketUrl: string, qr: string): Promise<void> => {
	const adminUrl = wsToHttp(socketUrl)
	const isHttps = adminUrl.protocol === 'https:'
	const request = isHttps ? httpsRequest : httpRequest

	return new Promise((resolve, reject) => {
		const req = request(
			{
				host: adminUrl.hostname,
				port: adminUrl.port,
				path: ADMIN_PATH,
				method: 'POST',
				...(isHttps ? { rejectUnauthorized: false } : {})
			},
			res => {
				res.resume()
				const status = res.statusCode ?? 0
				if (status >= 200 && status < 300) {
					resolve()
				} else {
					reject(new Error(`mock-phone ${ADMIN_PATH} returned ${status}`))
				}
			}
		)
		req.on('error', reject)
		req.write(qr)
		req.end()
	})
}
