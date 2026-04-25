import { getTextDirection } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'
import { getJourneyState, updateJourneyAnswers } from '$lib/server/journey'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ cookies, params, url }) => {
	const locale = params.lang
	const state = getJourneyState(cookies)

	if (state.answers.language !== locale) {
		updateJourneyAnswers(cookies, { language: locale })
	}

	const currentPath =
		url.pathname === localiseHref(locale, '/language')
			? url.searchParams.get('returnTo') || localiseHref(locale, '/screener')
			: `${url.pathname}${url.search}`

	return {
		locale,
		textDirection: getTextDirection(locale),
		currentPath
	}
}
