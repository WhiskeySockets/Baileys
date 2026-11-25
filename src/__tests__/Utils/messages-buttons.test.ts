import type { MessageContentGenerationOptions } from '../../Types'
import { generateWAMessageContent } from '../../Utils/messages'

const baseOptions: MessageContentGenerationOptions = {
	upload: async () => {
		throw new Error('upload should not be called for a buttons message')
	}
}

describe('generateWAMessageContent with buttons', () => {
	it('builds an interactiveMessage with a nativeFlowMessage for quick-reply buttons', async () => {
		const content = await generateWAMessageContent(
			{
				text: 'Pilih kategori:',
				footer: 'Mahiru Store',
				buttons: [
					{ id: 'store:layanan:media', displayText: 'Media' },
					{ id: 'store:layanan:apk', displayText: 'APK' }
				]
			},
			baseOptions
		)

		const interactive = content.interactiveMessage
		expect(interactive).toBeDefined()
		expect(interactive?.body?.text).toBe('Pilih kategori:')
		expect(interactive?.footer?.text).toBe('Mahiru Store')

		const flow = interactive?.nativeFlowMessage
		expect(flow?.messageVersion).toBe(1)
		expect(flow?.buttons).toHaveLength(2)
		expect(flow?.buttons?.[0]?.name).toBe('quick_reply')
		expect(JSON.parse(flow?.buttons?.[0]?.buttonParamsJson || '{}')).toEqual({
			display_text: 'Media',
			id: 'store:layanan:media'
		})
		expect(JSON.parse(flow?.buttons?.[1]?.buttonParamsJson || '{}')).toEqual({
			display_text: 'APK',
			id: 'store:layanan:apk'
		})
	})

	it('omits the footer when none is given', async () => {
		const content = await generateWAMessageContent(
			{
				text: 'Sudah bayar?',
				buttons: [{ id: 'done:1', displayText: 'Selesai' }]
			},
			baseOptions
		)

		expect(content.interactiveMessage?.body?.text).toBe('Sudah bayar?')
		expect(content.interactiveMessage?.footer).toBeNull()
		expect(content.interactiveMessage?.nativeFlowMessage?.buttons).toHaveLength(1)
	})

	it('rejects an empty buttons array', async () => {
		await expect(generateWAMessageContent({ text: 'Pilih:', buttons: [] }, baseOptions)).rejects.toMatchObject({
			output: { statusCode: 400 }
		})
	})

	it('rejects more than 3 buttons', async () => {
		await expect(
			generateWAMessageContent(
				{
					text: 'Pilih:',
					buttons: [
						{ id: 'b1', displayText: 'Satu' },
						{ id: 'b2', displayText: 'Dua' },
						{ id: 'b3', displayText: 'Tiga' },
						{ id: 'b4', displayText: 'Empat' }
					]
				},
				baseOptions
			)
		).rejects.toMatchObject({ output: { statusCode: 400 } })
	})

	it('still builds a plain text message without buttons', async () => {
		const content = await generateWAMessageContent({ text: 'halo' }, baseOptions)

		expect(content.extendedTextMessage?.text).toBe('halo')
		expect(content.interactiveMessage).toBeNull()
	})
})

describe('generateWAMessageContent with list', () => {
	const listMessage = {
		text: 'Pilih medsos:',
		footer: 'Mahiru Store',
		list: {
			title: 'Pilih medsos',
			buttonText: 'Pilih medsos',
			sections: [
				{
					title: 'Sosial Media',
					rows: [
						{ id: 'store:platform:tiktok', title: 'TikTok', description: '2.422 layanan' },
						{ id: 'store:platform:instagram', title: 'Instagram' }
					]
				}
			]
		}
	}

	it('builds an interactiveMessage with a single_select native-flow button', async () => {
		const content = await generateWAMessageContent(listMessage, baseOptions)

		const interactive = content.interactiveMessage
		expect(interactive).toBeDefined()
		expect(interactive?.body?.text).toBe('Pilih medsos:')
		expect(interactive?.footer?.text).toBe('Mahiru Store')

		const flow = interactive?.nativeFlowMessage
		expect(flow?.messageVersion).toBe(1)
		expect(flow?.buttons).toHaveLength(1)
		expect(flow?.buttons?.[0]?.name).toBe('single_select')
		expect(JSON.parse(flow?.buttons?.[0]?.buttonParamsJson || '{}')).toEqual({
			title: 'Pilih medsos',
			button_text: 'Pilih medsos',
			sections: [
				{
					title: 'Sosial Media',
					rows: [
						{ id: 'store:platform:tiktok', title: 'TikTok', description: '2.422 layanan' },
						{ id: 'store:platform:instagram', title: 'Instagram', description: '' }
					]
				}
			]
		})
	})

	it('rejects a list without sections', async () => {
		await expect(
			generateWAMessageContent(
				{ text: 'Pilih:', list: { title: 'Pilih', buttonText: 'Pilih', sections: [] } },
				baseOptions
			)
		).rejects.toMatchObject({ output: { statusCode: 400 } })
	})

	it('rejects a section without rows', async () => {
		await expect(
			generateWAMessageContent(
				{
					text: 'Pilih:',
					list: { title: 'Pilih', buttonText: 'Pilih', sections: [{ title: 'Kosong', rows: [] }] }
				},
				baseOptions
			)
		).rejects.toMatchObject({ output: { statusCode: 400 } })
	})
})
