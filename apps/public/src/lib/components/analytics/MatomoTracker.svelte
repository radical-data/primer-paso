<script lang="ts">
import { onMount, tick } from 'svelte'
import { afterNavigate } from '$app/navigation'
import { page } from '$app/state'
import {
	getRouteGroup,
	inferAnalyticsEnvironment,
	initMatomo,
	trackPageView
} from '$lib/analytics/matomo'

const sendPageView = async () => {
	const environment = inferAnalyticsEnvironment(window.location.hostname)

	initMatomo(environment)
	await tick()

	trackPageView({
		locale: String(page.data.locale ?? page.params.lang ?? 'es'),
		environment,
		routeGroup: getRouteGroup(page.url.pathname),
		stepSlug: typeof page.params.step === 'string' ? page.params.step : undefined,
		resultState:
			typeof page.data.result?.resultState === 'string' ? page.data.result.resultState : undefined,
		recommendedRoute:
			typeof page.data.result?.recommendedRoute === 'string'
				? page.data.result.recommendedRoute
				: undefined,
		title: document.title,
		url: `${page.url.pathname}${page.url.search}`
	})
}

onMount(() => {
	void sendPageView()

	const unsubscribe = afterNavigate(() => {
		void sendPageView()
	})

	return unsubscribe
})
</script>
