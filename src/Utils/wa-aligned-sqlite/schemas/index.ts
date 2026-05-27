export { AXOLOTL_SCHEMA } from './axolotl'
export { CREDS_SCHEMA } from './creds'
export { MSGSTORE_SCHEMA } from './msgstore'
export { SYNC_SCHEMA } from './sync'
export { WA_SCHEMA } from './wa'

import { AXOLOTL_SCHEMA } from './axolotl'
import { CREDS_SCHEMA } from './creds'
import { MSGSTORE_SCHEMA } from './msgstore'
import { SYNC_SCHEMA } from './sync'
import { WA_SCHEMA } from './wa'

/**
 * The four physical SQLite files we open in WA-aligned mode plus the
 * InfiniteAPI-specific creds file. Names match WhatsApp Android's
 * `/data/data/com.whatsapp.w4b/databases/` directory verbatim.
 */
export const WA_DB_FILES = ['creds.db', 'axolotl.db', 'msgstore.db', 'wa.db', 'sync.db'] as const

export type WaDbFile = (typeof WA_DB_FILES)[number]

export const SCHEMAS: Record<WaDbFile, string> = {
	'creds.db': CREDS_SCHEMA,
	'axolotl.db': AXOLOTL_SCHEMA,
	'msgstore.db': MSGSTORE_SCHEMA,
	'wa.db': WA_SCHEMA,
	'sync.db': SYNC_SCHEMA
}
