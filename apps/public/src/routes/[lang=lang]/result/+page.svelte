<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import FileDownIcon from '@lucide/svelte/icons/file-down'
import ListChecksIcon from '@lucide/svelte/icons/list-checks'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { onMount } from 'svelte'
import { trackEvent } from '$lib/analytics/matomo'
import { getTranslator } from '$lib/content'
import { markEligibilityChecked } from '$lib/home-checklist'
import { localiseHref } from '$lib/i18n/routing'

let { data } = $props()

onMount(() => {
	markEligibilityChecked()
})

const locale = $derived(data.locale ?? 'es')
const tt = $derived(getTranslator(locale))

const badgeVariant = $derived.by(() => {
	switch (data.result.resultState) {
		case 'likely_in_scope':
			return 'success'
		case 'possible_but_needs_more_evidence':
		case 'not_enough_information_yet':
			return 'info'
		default:
			return 'warning'
	}
})

const heroTone = $derived.by(() => {
	switch (data.result.resultState) {
		case 'likely_in_scope':
			return 'positive'
		case 'possible_but_needs_more_evidence':
		case 'not_enough_information_yet':
			return 'informational'
		default:
			return 'caution'
	}
})

const isEligible = $derived(
	data.result.resultState === 'likely_in_scope' ||
		data.result.resultState === 'possible_but_needs_more_evidence'
)
const startAgainHref = $derived(localiseHref(locale, '/screener?new=1'))
const homeHref = $derived(localiseHref(locale, '/'))

const checklistGroups = $derived([
	{
		labelKey: 'pages.result.checklist.already_have' as const,
		items: data.result.checklist.alreadyHave
	},
	{
		labelKey: 'pages.result.checklist.still_need' as const,
		items: data.result.checklist.stillNeed
	},
	{
		labelKey: 'pages.result.checklist.discuss_with_support' as const,
		items: data.result.checklist.discussWithSupport
	},
	{
		labelKey: 'pages.result.checklist.unresolved' as const,
		items: data.result.checklist.unresolved
	}
])
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<section class="stack">
	<p class="eyebrow">{tt('pages.result.eyebrow')}</p>

	<div class="result-grid">
		<section class="status-panel" data-tone={heroTone}>
			<div class="section-block">
				<Badge class="result-pill" data-state={data.result.resultState} variant={badgeVariant}>
					{tt(`result.title.${data.result.resultState}`)}
				</Badge>
				<div class="section-block">
					<h1 class="page-title">{tt('pages.result.eligibility_title')}</h1>
					<p class="lead-text">{tt(data.result.explanationKey)}</p>
				</div>
			</div>
		</section>

		{#if data.result.reasonKey}
			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.result.why_title')}</h2>
				<p class="lead-text">{tt(data.result.reasonKey)}</p>
			</section>
		{/if}

		{#if isEligible}
			<section class="cta-panel">
				<div class="section-block">
					<h2 class="section-title">{tt('pages.result.next_step_title')}</h2>
					<p class="lead-text">
						{tt(
							data.result.recommendedRoute === 'official_portal'
								? 'pages.result.route.official_portal_body'
								: 'pages.result.route.collaborating_organisation_body'
						)}
					</p>
				</div>
				{#if data.result.recommendedRoute === 'official_portal'}
					<div class="actions">
						<Button
							href={data.officialPortalUrl}
							target="_blank"
							rel="noreferrer"
							onclick={() =>
								trackEvent('Journey', 'Open official portal', data.result.resultState)}
						>
							{tt('common.open_official_portal')}
							<ExternalLinkIcon class="size-4" />
						</Button>
					</div>
				{:else}
					<p class="hint">{tt('pages.result.collaborating_cta.hint')}</p>
					<div class="actions">
						<Button
							href={data.organisationsHref}
							onclick={() => trackEvent('Directory', 'Open directory', data.result.resultState)}
							>{tt('common.open_directory')}</Button
						>
					</div>
				{/if}
			</section>
		{/if}

		<section class="panel section-block">
			<div class="section-block">
				<h2 class="section-title inline-flex items-center gap-2">
					<ListChecksIcon class="size-5" aria-hidden="true" />
					{tt('pages.result.checklist_title')}
				</h2>
			</div>
			<div class="result-grid">
				{#each checklistGroups as group (group.labelKey)}
					{#if group.items.length > 0}
						<div class="list-section">
							<h3>{tt(group.labelKey)}</h3>
							<ul>
								{#each group.items as itemKey (itemKey)}
									<li>{tt(itemKey)}</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</section>

		{#if isEligible && data.result.recommendedRoute === 'official_portal' && data.result.showHowToApply}
			<section class="panel-subtle section-block">
				<h2 class="section-title">{tt('pages.result.how_to_apply_title')}</h2>
				<p class="lead-text">{tt('pages.result.how_to_apply.body')}</p>
				<p class="hint">{tt('pages.result.how_to_apply.hint')}</p>
			</section>
		{/if}

		<section class="panel section-block">
			<h2 class="section-title">{tt('pages.result.continue_title')}</h2>
			<p class="lead-text">{tt('pages.result.continue_body')}</p>
			<div class="actions">
				<Button
					href={homeHref}
					onclick={() => trackEvent('Journey', 'Continue to home', data.result.resultState)}
				>
					{tt('pages.result.continue_action')}
				</Button>
			</div>
		</section>

		<section class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.result.handover_title')}</h2>
			<p class="lead-text">{tt('pages.result.handover.body')}</p>
			<div class="actions">
				<Button
					href={data.handoverHref}
					variant="default"
					onclick={() => trackEvent('Journey', 'Download handover PDF', data.result.resultState)}
				>
					{tt('common.download_handover_pdf')}
					<FileDownIcon class="size-4" />
				</Button>
				<Button
					href={startAgainHref}
					variant="outline"
					onclick={() => trackEvent('Journey', 'Start again', data.result.resultState)}
				>
					{tt('common.start_again')}
				</Button>
			</div>
		</section>
	</div>
</section>
