import { describe, test } from '@jest/globals'
import makeWASocket, {
	DisconnectReason,
	downloadContentFromMessage,
	downloadMediaMessage,
	jidNormalizedUser,
	proto,
	toBuffer,
	useMultiFileAuthState,
	type WAMessage
} from '../../index'
import pino from 'pino'
//import qrcode from  'qrcode-terminal'
import { Boom } from '@hapi/boom'



describe('WhatsApp Connection Test', () => {
	test('connect with auto-reconnect after 515', async() => {
		const logger = pino({ level: 'silent' })
		const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
		
		let sock = makeWASocket({
			auth: state,
			logger
		})
		
		let qrShown = false
		let isReconnecting = false
		
		return new Promise<void>((resolve, reject) => {
			let timeout: NodeJS.Timeout
			
			const cleanup = () => {
				if(timeout) clearTimeout(timeout)
			}
			
			timeout = setTimeout(() => {
				cleanup()
				sock.end(undefined).catch(() => {})
				reject(new Error('⏱️  Timeout após 3 minutos'))
			}, 180000)
			
			// Handler de conexão
			const handleConnection = async(update: any) => {
				const { connection, qr, lastDisconnect } = update
				
				console.log('\n📊 Estado:', { 
					connection, 
					qr: qr ? 'QR_DISPONÍVEL' : undefined, 
					erro: (lastDisconnect?.error as any)?.output?.statusCode 
				})
				
				if(qr && !qrShown) {
					console.log('\n📱 Escaneie o QR Code:')
					//qrcode.generate(qr, { small: true })
					console.log()
					qrShown = true
				}
				
				if(connection === 'open') {
					console.log('\n✅ CONECTADO!')
					console.log('👤 Usuário:', sock.user)
					
					// Aguardar sincronização inicial do WhatsApp
					console.log('\n⏳ Aguardando 5 segundos para sincronização...')
					await new Promise(r => setTimeout(r, 5000))
					
					// Testar envio de mensagem
					try {
						// Enviar mensagem para o próprio número (mensagem para si mesmo)
						//const myJid = sock.user?.id
						const meJid = jidNormalizedUser(sock.user?.id)
						const meLid = sock.user?.lid

						if(meJid) {
							console.log('\n📤 Enviando mensagem de teste...')
							
							// Adicionar timeout de 30s para sendMessage
							const sendMessageWithTimeout = Promise.race([
								sock.sendMessage(meJid, { 
									text: '✅ Teste de conexão Baileys - ' + new Date().toLocaleString('pt-BR')
								}),
								new Promise((_, reject) => 
									setTimeout(() => reject(new Error('Timeout: mensagem não enviada em 30s')), 30000)
								)
							])
							
							const result = await sendMessageWithTimeout as any
							
							console.log('✅ Mensagem enviada com sucesso!')
							console.log('📝 ID da mensagem:', result?.key?.id)
							
							// Aguardar para garantir que a mensagem foi processada
							await new Promise(r => setTimeout(r, 2000))
						}
					} catch(error: any) {
						console.error('❌ Erro ao enviar mensagem:', error.message)
						console.log('ℹ️  Teste continua mesmo com falha no envio')
					}
					
					cleanup()
					await sock.end(undefined)
					resolve()
				}
				
				if(connection === 'close') {
					const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
					
					// Erro 515 = Pairing concluído, precisa reconectar
					if(statusCode === 515 && !isReconnecting) {
						isReconnecting = true
						console.log('\n🔄 Erro 515: Pairing OK, reconectando em 3s...')
						
						await new Promise(r => setTimeout(r, 3000))
						await sock.end(undefined).catch(() => {})
						
						// Recarregar credenciais e criar novo socket
						const { state: newState, saveCreds: newSaveCreds } = await useMultiFileAuthState('baileys_auth_info')
						
						sock = makeWASocket({
							auth: newState,
							logger
						})
						
						// Re-attach listeners
						sock.ev.on('connection.update', handleConnection)
						sock.ev.on('creds.update', newSaveCreds)
						
						isReconnecting = false
					} 
					else if(statusCode && statusCode !== 515) {
						cleanup()
						await sock.end(undefined).catch(() => {})
						reject(new Error(`❌ Erro ${statusCode}: ${lastDisconnect?.error?.message}`))
					}
				}
			}
			
			sock.ev.on('connection.update', handleConnection)
			sock.ev.on('creds.update', saveCreds)
		})
	}, 180000)
})
