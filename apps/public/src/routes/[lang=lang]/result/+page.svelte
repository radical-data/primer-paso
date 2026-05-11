<script lang="ts">
import FileDownIcon from '@lucide/svelte/icons/file-down'
import ListChecksIcon from '@lucide/svelte/icons/list-checks'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { StatusPanel } from '@primer-paso/ui/status-panel'
import { trackEvent } from '$lib/analytics/matomo'
import { getTranslator } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'
import { resultTone } from '$lib/result-ui'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))

const badgeVariant = $derived.by(() => {
	switch (data.result.resultState) {
		case 'eligible':
			return 'success'
		default:
			return 'warning'
	}
})

const statusTone = $derived(resultTone[data.result.resultState])
const checkAnswersHref = $derived(localiseHref(data.locale ?? 'es', '/check-answers'))
const startAgainHref = $derived(localiseHref(data.locale ?? 'es', '/screener?new=1'))
const otherPossibleRoutes = $derived(
	data.result.possibleEligibilityRoutes.filter(
		(route) => route !== data.result.recommendedEligibilityRoute
	)
)
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<section class="stack">
	<p class="eyebrow">{tt('pages.result.eyebrow')}</p>

	<div class="result-grid">
		<StatusPanel tone={statusTone}>
			<div class="section-block">
				<Badge class="result-pill" data-state={data.result.resultState} variant={badgeVariant}>
					{tt(`result.title.${data.result.resultState}`)}
				</Badge>
				<div class="section-block">
					<h1 class="page-title">{tt('pages.result.recommended_route_title')}</h1>
					<p class="lead-text">{tt(data.result.explanationKey)}</p>
				</div>
			</div>
		</StatusPanel>

		{#if data.result.reasonKey}
			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.result.why_title')}</h2>
				<p class="lead-text">{tt(data.result.reasonKey)}</p>
			</section>
		{/if}

		{#if otherPossibleRoutes.length > 0}
			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.result.other_possible_routes_title')}</h2>
				<ul>
					{#each otherPossibleRoutes as route}
						<li>{tt(`result.eligibility_route.${route}`)}</li>
					{/each}
				</ul>
			</section>
		{/if}

		<section class="cta-panel">
			<div class="section-block">
				<h2 class="section-title">{tt('pages.result.next_step_title')}</h2>
				<p class="lead-text">
					{tt(`result.submission_path.${data.result.recommendedSubmissionPath}`)}
				</p>
			</div>
			{#if data.result.recommendedSubmissionPath === 'registered_entity_online'}
				<p class="hint">{tt('pages.result.collaborating_cta.hint')}</p>
				<div class="actions">
					<Button
						href={data.organisationsHref}
						onclick={() =>
							trackEvent('Directory', 'Open directory', data.result.resultState)}
						>{tt('common.open_directory')}</Button
					>
				</div>
			{:else}
				<div class="actions">
					<Button
						href={checkAnswersHref}
						variant="default"
						onclick={() => trackEvent('Journey', 'Review answers', data.result.resultState)}
					>
						{tt('common.review_answers')}
					</Button>
				</div>
			{/if}
		</section>

		{#if data.result.checklist.alreadyHave.length > 0 || data.result.checklist.stillNeed.length > 0 || data.result.checklist.discussWithSupport.length > 0 || data.result.checklist.unresolved.length > 0}
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
		{/if}

		<section class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.result.handover_title')}</h2>
			<p class="lead-text">{tt('pages.result.handover.body')}</p>
			<div class="actions">
				<Button
					href={data.handoverHref}
					variant="secondary"
					data-sveltekit-reload
					download
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
	</div>
</section>
