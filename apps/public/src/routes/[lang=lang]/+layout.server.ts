import { getTextDirection } from '$lib/content'
import { getJourneyState, updateJourneyAnswers } from '$lib/server/journey'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ cookies, params, url }) => {
	const locale = params.lang
	const state = getJourneyState(cookies)

	if (state.answers.language !== locale) {
		updateJourneyAnswers(cookies, { language: locale })
	}

	const currentPath = `${url.pathname}${url.search}`

	return {
		locale,
		textDirection: getTextDirection(locale),
		currentPath
	}
}
