import type { MessageKey } from '$lib/content'
import { getJourneyState } from '$lib/server/journey'
import { runTriage } from '$lib/triage/engine'
import type { PageServerLoad } from './$types'

const FALLBACK_DOCUMENT_KEYS: MessageKey[] = [
	'result.checklist.item.identity_document_needed',
	'result.checklist.item.before_cutoff_evidence_needed',
	'result.checklist.item.recent_evidence_needed',
	'result.checklist.item.official_document_requirements'
]

const dedupe = (keys: MessageKey[]): MessageKey[] => Array.from(new Set(keys))

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)
	// `language` is set by the layout on every visit, so it doesn't indicate engagement;
	// any other answer means the visitor has actually started the screener.
	const screenerKeys = Object.keys(state.answers).filter((key) => key !== 'language')
	const hasStartedScreener = screenerKeys.length > 0

	let documents: MessageKey[] = FALLBACK_DOCUMENT_KEYS
	let personalised = false

	if (hasStartedScreener) {
		const result = runTriage(state.answers)
		const personalisedDocs = dedupe([
			...result.checklist.stillNeed,
			...result.checklist.alreadyHave
		])

		if (personalisedDocs.length > 0) {
			documents = personalisedDocs
			personalised = true
		}
	}

	return {
		locale: params.lang,
		hasCompletedScreener: personalised,
		documents
	}
}
