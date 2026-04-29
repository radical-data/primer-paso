import { error } from '@sveltejs/kit'
import { localiseHref } from '$lib/i18n/routing'
import { getOrganisationBySlug } from '$lib/organisations/repository'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
	const organisation = getOrganisationBySlug(params.slug)

	if (!organisation) {
		error(404, 'Organisation not found')
	}

	return {
		locale: params.lang,
		organisation,
		backHref: localiseHref(params.lang, '/organisations')
	}
}
