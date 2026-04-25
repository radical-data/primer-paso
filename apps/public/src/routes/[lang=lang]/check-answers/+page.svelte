<script lang="ts">
import { trackEvent } from '$lib/analytics/matomo'
import { Button } from '$lib/components/ui/button'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'

let {
	data
}: {
	data: {
		locale?: Locale
		backHref: string
		answers: Array<{ label: string; value: string; changeHref: string }>
	}
} = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<section class="stack">
	<p class="eyebrow">{tt('pages.check_answers.eyebrow')}</p>

	<div class="app-card stack">
		<h1 class="page-title">{tt('pages.check_answers.title')}</h1>
		<p class="hint">{tt('pages.check_answers.hint')}</p>

		<div class="check-list">
			{#each data.answers as answer}
				<section class="check-row" aria-label={answer.label}>
					<div class="stack">
						<h2 class="section-title text-base">{answer.label}</h2>
						<p>{answer.value}</p>
					</div>
					<Button href={answer.changeHref} variant="outline" size="sm"
						>{tt('common.change')}</Button
					>
				</section>
			{/each}
		</div>

		<div class="actions">
			<Button
				href={localiseHref(data.locale ?? 'es', '/result')}
				onclick={() => trackEvent('Journey', 'View result', 'check_answers')}
				>{tt('common.see_result')}</Button
			>
			<Button href={data.backHref} variant="outline">{tt('common.back')}</Button>
		</div>
	</div>
</section>
