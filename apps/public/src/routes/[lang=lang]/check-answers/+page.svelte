<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { SummaryList } from '@primer-paso/ui/summary-list'
import { trackEvent } from '$lib/analytics/matomo'
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

const summaryRows = $derived(
	data.answers.map((a) => ({
		key: a.label,
		value: a.value,
		actionHref: a.changeHref,
		actionLabel: tt('common.change')
	}))
)
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<section class="stack">
	<div class="app-card stack">
		<h1 class="page-title">{tt('pages.check_answers.title')}</h1>
		<p class="hint">{tt('pages.check_answers.hint')}</p>

		<SummaryList rows={summaryRows} />

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
