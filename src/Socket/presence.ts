import { proto } from '../WAProto'
import { BinaryNode } from '../WABinary'
import { jidNormalizedUser } from '../Utils'
import { SocketConfig, WABusEventData } from '../Types'
import { makeSocket } from './Client'

// Initializes a presence socket module to manage presence-related events
export const makePresenceSocket = (config: SocketConfig) => {
  const { logger, emitPresenceUpdate } = config
  const sock = makeSocket(config)

  /**
   * Sends a presence update to a specific JID.
   * Common types include: 'available', 'unavailable', 'composing', 'paused'.
   */
  const sendPresenceUpdate = async (
    status: 'available' | 'unavailable' | 'composing' | 'paused',
    toJid: string
  ) => {
    try {
      const normalizedJid = jidNormalizedUser(toJid)
      const node: BinaryNode = {
        tag: 'presence',
        attrs: {
          to: normalizedJid,
          type: status
        }
      }

      await sock.sendNode(node)
      logger.info(`Sent presence: ${status} → ${normalizedJid}`)
    } catch (err) {
      logger.error(`Failed to send presence to ${toJid}:`, err)
    }
  }

  /**
   * Subscribes to presence updates from a specific contact.
   * This is useful for tracking when someone comes online or starts typing.
   */
  const subscribeToPresence = async (jid: string) => {
    try {
      const normalizedJid = jidNormalizedUser(jid)
      const node: BinaryNode = {
        tag: 'presence',
        attrs: {
          id: sock.generateMessageTag(),
          to: normalizedJid,
          type: 'subscribe'
        }
      }

      await sock.sendNode(node)
      logger.debug(`Subscribed to presence for ${normalizedJid}`)
    } catch (err) {
      logger.warn(`Presence subscription failed for ${jid}:`, err)
    }
  }

  /**
   * Handles incoming presence updates from other users.
   * Emits the update so other parts of the app can react to it.
   */
  sock.ev.on('presence.update', (update: WABusEventData['presence.update']) => {
    const { id, type } = update
    logger.debug(`Received presence from ${id}: ${type}`)
    emitPresenceUpdate?.(update)
  })

  return {
    ...sock,
    sendPresenceUpdate,
    subscribeToPresence
  }
}
