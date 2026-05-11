<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { ErrorSummary, type ErrorSummaryItem } from '@primer-paso/ui/error-summary'
import { trackEvent } from '$lib/analytics/matomo'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'

interface Props {
	errors?: ErrorSummaryItem[]
	returnTo?: string
	backHref: string
	stepSlug?: string
	locale?: Locale
	children?: import('svelte').Snippet
}

let { errors = [], returnTo, backHref, stepSlug, locale = 'es', children }: Props = $props()
const tt = $derived(getTranslator(locale))
const trackContinue = () => trackEvent('Journey', 'Continue question', stepSlug)
</script>

<section class="question-page">
	{#if errors.length > 0}
		<ErrorSummary title={tt("common.problem")} {errors} />
	{/if}

	<form method="POST" class="question-form">
		{#if returnTo}
			<input type="hidden" name="returnTo" value={returnTo}>
		{/if}

		{@render children?.()}

		<div class="page-actions">
			<Button type="submit" onclick={trackContinue}>{tt("common.continue")}</Button>
			<Button href={backHref} variant="outline">{tt("common.back")}</Button>
		</div>
	</form>
</section>
