<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import FileDownIcon from '@lucide/svelte/icons/file-down'
import ListChecksIcon from '@lucide/svelte/icons/list-checks'
import { Badge } from '$lib/components/ui/badge'
import { Button } from '$lib/components/ui/button'
import { getTranslator } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))

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
					<p class="lead-text">{tt(data.result.summary.eligibilityKey)}</p>
				</div>
			</div>
			<div class="summary-stack">
				<div class="summary-item">
					<p class="summary-label">{tt('pages.result.next_step_title')}</p>
					<p class="summary-value">{tt(data.result.summary.nextStepKey)}</p>
				</div>
				<div class="summary-item">
					<p class="summary-label">{tt('pages.result.handover_title')}</p>
					<p class="summary-value">{tt('pages.result.handover.body')}</p>
				</div>
			</div>
		</section>

		{#if data.result.reasonKey}
			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.result.why_title')}</h2>
				<p class="lead-text">{tt(data.result.reasonKey)}</p>
			</section>
		{/if}

		<section class="cta-panel">
			<div class="section-block">
				<h2 class="section-title">{tt('pages.result.next_step_title')}</h2>

				<p class="lead-text">{tt(data.result.summary.nextStepKey)}</p>
			</div>
			{#if data.result.recommendedRoute === 'official_portal'}
				<div class="actions">
					<Button href={data.officialPortalUrl} target="_blank" rel="noreferrer">
						{tt('pages.result.action.open_official_portal')}
						<ExternalLinkIcon class="size-4" />
					</Button>
				</div>
			{:else}
				<p class="hint">
					Use the organisations directory to find a collaborating organisation that may be able to
					help.
				</p>
				<div class="actions">
					<Button href={data.organisationsHref}>Find collaborating organisations</Button>
				</div>
			{/if}
		</section>

		<section class="panel section-block">
			<h2 class="section-title">Find a collaborating organisation</h2>
			<p class="lead-text">
				Browse the public directory of collaborating organisations without repeating the
				questionnaire.
			</p>
			<div class="actions">
				<Button
					href={data.organisationsHref}
					variant={data.result.recommendedRoute === 'collaborating_organisation'
						? 'default'
						: 'secondary'}
				>
					Open organisations directory
				</Button>
				{#if data.result.recommendedRoute === 'official_portal'}
					<Button href={data.officialPortalUrl} target="_blank" rel="noreferrer" variant="outline">
						Open official portal
					</Button>
				{/if}
			</div>
		</section>

		<section class="panel section-block">
			<div class="section-block">
				<h2 class="section-title inline-flex items-center gap-2">
					<ListChecksIcon class="size-5" aria-hidden="true" />
					{tt('pages.result.checklist_title')}
				</h2>
				<p class="supporting-text">{tt(data.result.explanationKey)}</p>
			</div>
			<div class="result-grid">
				{#if data.result.checklist.alreadyHave.length > 0}
					<div class="list-section">
						<h3>{tt('pages.result.checklist.already_have')}</h3>
						<ul>
							{#each data.result.checklist.alreadyHave as itemKey (itemKey)}
								<li>{tt(itemKey)}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if data.result.checklist.stillNeed.length > 0}
					<div class="list-section">
						<h3>{tt('pages.result.checklist.still_need')}</h3>
						<ul>
							{#each data.result.checklist.stillNeed as itemKey (itemKey)}
								<li>{tt(itemKey)}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if data.result.checklist.discussWithSupport.length > 0}
					<div class="list-section">
						<h3>{tt('pages.result.checklist.discuss_with_support')}</h3>
						<ul>
							{#each data.result.checklist.discussWithSupport as itemKey (itemKey)}
								<li>{tt(itemKey)}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if data.result.checklist.unresolved.length > 0}
					<div class="list-section">
						<h3>{tt('pages.result.checklist.unresolved')}</h3>
						<ul>
							{#each data.result.checklist.unresolved as itemKey (itemKey)}
								<li>{tt(itemKey)}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</section>

		{#if data.result.recommendedRoute === 'official_portal' && data.result.showHowToApply}
			<section class="panel-subtle section-block">
				<h2 class="section-title">{tt('pages.result.how_to_apply_title')}</h2>
				<p class="lead-text">{tt('pages.result.how_to_apply.body')}</p>
				<p class="hint">{tt('pages.result.how_to_apply.hint')}</p>
			</section>
		{/if}

		<section class="panel section-block">
			<h2 class="section-title">{tt('pages.result.handover_title')}</h2>
			<p class="lead-text">{tt('pages.result.handover.body')}</p>
			<div class="actions">
				<Button href={data.handoverHref} variant="secondary">
					{tt('pages.result.action.print_handover')}
					<FileDownIcon class="size-4" />
				</Button>
			</div>
		</section>

		<section class="panel-subtle">
			<div class="actions">
				<Button href={localiseHref(data.locale ?? 'es', '/check-answers')} variant="outline"
					>{tt('pages.result.action.back_to_answers')}</Button
				>
				<Button href={localiseHref(data.locale ?? 'es', '/start?new=1')} variant="outline"
					>{tt('pages.result.action.start_again')}</Button
				>
			</div>
		</section>
	</div>
</section>
