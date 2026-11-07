				await relayMessage(jid, fullMsg.message!, {
					messageId: fullMsg.key.id!,
					useCachedGroupMetadata: options.useCachedGroupMetadata,
					additionalAttributes,
					statusJidList: options.statusJidList,
					additionalNodes,
					noSelfSync: options.noSelfSync
				})
				if (config.emitOwnEvents) {
					process.nextTick(async () => {
						const effectiveNoSelfSync = resolveNoSelfSync(options.noSelfSync)
						if (effectiveNoSelfSync && jid !== 'status@broadcast') {
							logger.debug(
								{ jid, msgId: fullMsg.key.id },
								'noSelfSync: skipping self message upsert (sendMessage)'
							)
							return
						}
						await messageMutex.mutex(() => upsertMessage(fullMsg, 'append'))
					})
				}
