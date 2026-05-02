/** Parse pasted org-portal handoff input: full URL with ?token=... or raw token only. */
export const extractHandoffToken = (value: string) => {
	const trimmed = value.trim()
	if (!trimmed) return ''

	try {
		const url = new URL(trimmed)
		return url.searchParams.get('token')?.trim() ?? ''
	} catch {
		return trimmed
	}
}

// Generated handoff tokens are 32 random bytes encoded as base64url, so they are
// much longer than support reference codes. This guard only catches likely
// support-code input pasted into the secure-link field.
/** UX guard: human-readable support reference (not an access credential). */
export const looksLikeReferenceCode = (value: string) =>
	/^[A-Z0-9]{4}[-\s]?[A-Z0-9]{4}[-\s]?[A-Z0-9]{2}$/i.test(value.trim())
