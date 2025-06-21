import { SignalSessionStore } from '../../Types/Signal'
import * as keyhelper from './keyhelper'
import { SenderKeyDistributionMessage } from './sender-key-distribution-message'
import { SenderKeyName } from './sender-key-name'

export class GroupSessionBuilder {
	private readonly senderKeyStore: SignalSessionStore

	constructor(senderKeyStore: SignalSessionStore) {
		this.senderKeyStore = senderKeyStore
	}

	public async process(
		senderKeyName: SenderKeyName,
		senderKeyDistributionMessage: SenderKeyDistributionMessage
	): Promise<void> {
		const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName)
		senderKeyRecord.addSenderKeyState(
			senderKeyDistributionMessage.getId(),
			senderKeyDistributionMessage.getIteration(),
			senderKeyDistributionMessage.getChainKey(),
			senderKeyDistributionMessage.getSignatureKey()
		)
		await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord)
	}

	public async create(senderKeyName: SenderKeyName): Promise<SenderKeyDistributionMessage> {
		const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName)

		if (senderKeyRecord.isEmpty()) {
			const keyId = keyhelper.generateSenderKeyId()
			const senderKey = keyhelper.generateSenderKey()
			const signingKey = keyhelper.generateSenderSigningKey()

			senderKeyRecord.setSenderKeyState(keyId, 0, senderKey, signingKey)
			await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord)
		}

		const state = senderKeyRecord.getSenderKeyState()
		if (!state) {
			throw new Error('No session state available')
		}

		return new SenderKeyDistributionMessage(
			state.getKeyId(),
			state.getSenderChainKey().getIteration(),
			state.getSenderChainKey().getSeed(),
			state.getSigningKeyPublic()
		)
	}
}
