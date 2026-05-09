import type { StatusTone } from '@primer-paso/ui'
import type { ResultState } from '$lib/triage/types'

export const resultTone = {
	likely_in_scope: 'success',
	possible_but_needs_more_evidence: 'info',
	not_enough_information_yet: 'info',
	needs_specialist_review: 'warning',
	another_route_may_fit_better: 'warning'
} as const satisfies Record<ResultState, StatusTone>
