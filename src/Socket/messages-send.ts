						if (effectiveNoSelfSync && jid !== 'status@broadcast') {
							logger.debug(
								{ jid, msgId: fullMsg.key.id },
								'noSelfSync: skipping self message upsert (sendMessage)'
							)
							return
						}
