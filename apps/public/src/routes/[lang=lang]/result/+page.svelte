<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import FileDownIcon from '@lucide/svelte/icons/file-down'
import ListChecksIcon from '@lucide/svelte/icons/list-checks'
import { trackEvent } from '$lib/analytics/matomo'
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

const isAnotherRoute = $derived(data.result.resultState === 'another_route_may_fit_better')
const checkAnswersHref = $derived(localiseHref(data.locale ?? 'es', '/check-answers'))
const startAgainHref = $derived(localiseHref(data.locale ?? 'es', '/screener?new=1'))
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

		{#if isAnotherRoute}
			<section class="cta-panel">
				<div class="section-block">
					<h2 class="section-title">{tt('pages.result.another_route.do_now_title')}</h2>
					<p class="lead-text">{tt('pages.result.another_route.do_now.body')}</p>
				</div>
				<div class="actions">
					<Button
						href={checkAnswersHref}
						variant="default"
						onclick={() => trackEvent('Journey', 'Review answers', data.result.resultState)}
					>
						{tt('common.review_answers')}
					</Button>
					<Button
						href={data.handoverHref}
						variant="secondary"
						onclick={() =>
							trackEvent('Journey', 'Download handover PDF', data.result.resultState)}
					>
						{tt('common.download_handover_pdf')}
						<FileDownIcon class="size-4" />
					</Button>
				</div>
			</section>

			<section class="panel-subtle section-block">
				<h2 class="section-title">{tt('pages.result.support_title')}</h2>
				<p class="supporting-text">{tt('pages.result.another_route.support_body')}</p>
				<div class="actions">
					<Button
						href={data.organisationsHref}
						variant="outline"
						onclick={() =>
							trackEvent('Directory', 'Open directory', data.result.resultState)}
					>
						{tt('common.see_support_options')}
					</Button>
				</div>
			</section>

			<section class="panel-subtle">
				<div class="actions">
					<Button
						href={startAgainHref}
						variant="outline"
						onclick={() => trackEvent('Journey', 'Start again', data.result.resultState)}
					>
						{tt('common.start_again')}
					</Button>
				</div>
			</section>
		{:else}
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
							onclick={() =>
								trackEvent('Directory', 'Open directory', data.result.resultState)}
							>{tt('common.open_directory')}</Button
						>
					</div>
				{/if}
			</section>

			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.result.collaborating_cta.title')}</h2>
				<p class="lead-text">{tt('pages.result.collaborating_cta.lead')}</p>
				<div class="actions">
					<Button
						href={data.organisationsHref}
						variant={data.result.recommendedRoute === 'collaborating_organisation'
							? 'default'
							: 'secondary'}
						onclick={() =>
							trackEvent('Directory', 'Open directory', data.result.resultState)}
					>
						{tt('common.open_directory')}
					</Button>
					{#if data.result.recommendedRoute === 'official_portal'}
						<Button
							href={data.officialPortalUrl}
							target="_blank"
							rel="noreferrer"
							variant="outline"
							onclick={() =>
								trackEvent('Journey', 'Open official portal', data.result.resultState)}
						>
							{tt('common.open_official_portal')}
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

			<section class="panel-subtle section-block">
				<h2 class="section-title">{tt('pages.result.handover_title')}</h2>
				<p class="lead-text">{tt('pages.result.handover.body')}</p>
				<div class="actions">
					<Button
						href={data.handoverHref}
						variant="secondary"
						onclick={() =>
							trackEvent('Journey', 'Download handover PDF', data.result.resultState)}
					>
						{tt('common.download_handover_pdf')}
						<FileDownIcon class="size-4" />
					</Button>
				</div>
			</section>

			<section class="panel-subtle">
				<div class="actions">
					<Button
						href={checkAnswersHref}
						variant="outline"
						onclick={() => trackEvent('Journey', 'Review answers', data.result.resultState)}
					>
						{tt('common.back_to_answers')}
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
		{/if}
	</div>
</section>
