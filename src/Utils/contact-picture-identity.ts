import { areJidsSameUser, isLidUser, isPnUser, jidNormalizedUser } from '../WABinary'

export type ContactPictureIdentityContext = {
	getPNForLID: (lid: string) => Promise<string | null>
	getLIDForPN: (pn: string) => Promise<string | null>
	meId: string | undefined
	meLid: string | undefined
}

/**
 * Resolve the best-effort contact identity for a profile-picture notification.
 * `from` must be the already-normalized individual JID (never a group jid).
 *
 * Returns the fields to merge into a `contacts.update` entry. When `from` is a LID we
 * attempt to resolve the PN (and vice-versa) so consumers can correlate the change with a
 * cached contact regardless of which addressing form they store. For non-saved contacts WA
 * omits the canonical identity, so resolution may fail — in that case we still return the
 * raw LID so the event is never empty.
 */
export async function resolveContactPictureIdentity(
	from: string,
	ctx: ContactPictureIdentityContext
): Promise<{ id: string; lid?: string; phoneNumber?: string }> {
	const result: { id: string; lid?: string; phoneNumber?: string } = { id: from }

	if (isLidUser(from)) {
		result.lid = from
		const resolvedPn = await ctx.getPNForLID(from).catch(() => null)
		const normalizedPn = jidNormalizedUser(resolvedPn || undefined)
		// guard: discard a resolution that points at our own PN unless `from` is our own LID
		const isBogusSelf =
			!!normalizedPn &&
			!!ctx.meId &&
			areJidsSameUser(normalizedPn, ctx.meId) &&
			!(ctx.meLid && areJidsSameUser(from, ctx.meLid))
		if (normalizedPn && !isBogusSelf) {
			result.id = normalizedPn
			result.phoneNumber = normalizedPn
		}
	} else if (isPnUser(from)) {
		result.phoneNumber = from
		const resolvedLid = await ctx.getLIDForPN(from).catch(() => null)
		if (resolvedLid && isLidUser(resolvedLid)) {
			result.lid = jidNormalizedUser(resolvedLid)
		}
	}

	return result
}
