import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const CONFIG = {
	PORT: parseInt(process.env.PORT || '3000', 10),
	HOST: process.env.HOST || '0.0.0.0',
	DATA_DIR: path.resolve(__dirname, '../../data'),
	SESSIONS_DIR: path.resolve(__dirname, '../../data/sessions'),
	API_KEY: process.env.API_KEY || '',
	MAX_RETRIES: 3,
	WEBHOOK_TIMEOUT: 10000,
}
