import { resolveLocale } from '$lib/content'
import { filterOrganisations, getDirectorySummary } from '$lib/organisations/repository'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, url }) => {
	const locale = resolveLocale(getJourneyState(cookies).answers.language)
	const q = String(url.searchParams.get('q') ?? '')
	const organisations = filterOrganisations({ q })
	return {
		locale,
		filters: { q },
		organisations,
		summary: getDirectorySummary(organisations)
	}
}
