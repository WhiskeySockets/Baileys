import { Boom } from '@hapi/boom'
import type { ILogger } from '../Utils/logger'
import { parseMexOrderDetails } from '../Utils/business-mex'
import { areJidsSameUser, isLidUser, isPnUser, jidNormalizedUser } from '../WABinary'

export const BUSINESS_ORDER_MEX_QUERY = {
	queryId: '26593811266898374',
	dataPath: 'xwa_checkout_get_order_info'
} as const

export const orderMexVariables = (jid: string, orderId: string, token: string) => ({
	request: {
		order: {
			id: orderId,
			jid,
			token: { sensitive_string_value: token },
			image_dimensions: { width: 100, height: 100 },
			direct_connection_encrypted_info: null
		}
	}
})

type ExecuteMexQuery = (variables: Record<string, unknown>, queryId: string, dataPath: string) => Promise<unknown>

type FetchMexOrderDetailsOptions = {
	orderId: string
	token: string
	requestedJid: string
	ownJids: readonly (string | undefined)[]
	executeQuery: ExecuteMexQuery
	logger: ILogger
}

export const resolveOrderMexJid = (requestedJid: string, ownJids: readonly (string | undefined)[]) => {
	const requested = jidNormalizedUser(requestedJid)
	if (!requested) return undefined

	const ownAliases = ownJids.map(jidNormalizedUser).filter((jid): jid is string => !!jid)
	const ownPn = ownAliases.find(isPnUser)
	const requestedIsOwnLid =
		isLidUser(requested) && ownAliases.some(ownJid => isLidUser(ownJid) && areJidsSameUser(ownJid, requested))

	return requestedIsOwnLid && ownPn ? ownPn : requested
}

export const fetchMexOrderDetails = async ({
	orderId,
	token,
	requestedJid,
	ownJids,
	executeQuery,
	logger
}: FetchMexOrderDetailsOptions) => {
	// Resolve known local aliases before the single request; MEX failures must never select another JID.
	const jid = resolveOrderMexJid(requestedJid, ownJids)
	if (!jid) throw new Boom('Order details require a valid seller JID', { statusCode: 400 })

	const requested = jidNormalizedUser(requestedJid)
	logger.debug(
		{
			queryId: BUSINESS_ORDER_MEX_QUERY.queryId,
			requestedJidType: isLidUser(requested) ? 'lid' : isPnUser(requested) ? 'pn' : 'other',
			resolvedJidType: isLidUser(jid) ? 'lid' : isPnUser(jid) ? 'pn' : 'other',
			usedOwnPnAlias: isLidUser(requested) && isPnUser(jid)
		},
		'querying order details through MEX'
	)
	const result = await executeQuery(
		orderMexVariables(jid, orderId, token),
		BUSINESS_ORDER_MEX_QUERY.queryId,
		BUSINESS_ORDER_MEX_QUERY.dataPath
	)
	return parseMexOrderDetails(result)
}
