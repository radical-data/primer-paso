import type { MessageKey } from '$lib/content'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

const DEFAULT_DOCUMENT_KEYS: MessageKey[] = [
	'result.checklist.item.identity_document_needed',
	'result.checklist.item.before_cutoff_evidence_needed',
	'result.checklist.item.recent_evidence_needed',
	'result.checklist.item.official_document_requirements'
]

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)
	// `language` is set by the layout on every visit, so it doesn't indicate engagement;
	// any other answer means the visitor has actually started the screener.
	const hasStartedScreener = Object.keys(state.answers).some((key) => key !== 'language')

	return {
		locale: params.lang,
		hasCompletedScreener: hasStartedScreener,
		documents: DEFAULT_DOCUMENT_KEYS
	}
}
