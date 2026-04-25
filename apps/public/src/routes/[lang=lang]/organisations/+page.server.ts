import { filterOrganisations, getDirectorySummary } from '$lib/organisations/repository'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params, url }) => {
	const locale = params.lang
	const q = String(url.searchParams.get('q') ?? '')
	const organisations = filterOrganisations({ q })
	return {
		locale,
		filters: { q },
		organisations,
		summary: getDirectorySummary(organisations)
	}
}
