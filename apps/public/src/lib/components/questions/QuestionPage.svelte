<script lang="ts">
import { trackEvent } from '$lib/analytics/matomo'
import { Button } from '$lib/components/ui/button'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'

interface Props {
	eyebrow?: string
	error?: string
	returnTo?: string
	backHref: string
	stepSlug?: string
	locale?: Locale
	children?: import('svelte').Snippet
}

let { eyebrow, error, returnTo, backHref, stepSlug, locale = 'es', children }: Props = $props()
const tt = $derived(getTranslator(locale))
const trackContinue = () => trackEvent('Journey', 'Continue question', stepSlug)
</script>

<section class="stack">
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}

	<div class="app-card stack">
		{#if error}
			<div class="error-summary" aria-live="assertive">
				<h2 class="error-summary-title">{tt('common.problem')}</h2>
				<p class="error-text">{error}</p>
			</div>
		{/if}

		<form method="POST" class="result-grid">
			{#if returnTo}
				<input type="hidden" name="returnTo" value={returnTo}>
			{/if}

			{@render children?.()}

			<div class="page-actions">
				<Button type="submit" onclick={trackContinue}>{tt('common.continue')}</Button>
				<Button href={backHref} variant="outline">{tt('common.back')}</Button>
			</div>
		</form>
	</div>
</section>
