				// ───── noSelfSync: skip pesan fromMe (kecuali status@broadcast) ─────
				if (shouldSkipSelfMsg(msg)) {
					logger.debug(
						{ msgId: msg.key?.id, remoteJid: msg.key?.remoteJid },
						'noSelfSync: skipping self message upsert'
					)
					acked = true
					return
				}
				// ───── end noSelfSync ─────
