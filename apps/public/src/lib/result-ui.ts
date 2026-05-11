import type { StatusTone } from '@primer-paso/ui'
import type { ResultState } from '$lib/triage/types'

export const resultTone = {
	eligible: 'success',
	needs_specialist_review: 'warning',
	not_this_process: 'warning'
} as const satisfies Record<ResultState, StatusTone>
