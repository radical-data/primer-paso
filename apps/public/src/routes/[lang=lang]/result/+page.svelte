<script lang="ts">
import FileDownIcon from '@lucide/svelte/icons/file-down'
import ListChecksIcon from '@lucide/svelte/icons/list-checks'
import { Button } from '@primer-paso/ui/button'
import { StatusPanel } from '@primer-paso/ui/status-panel'
import { trackEvent } from '$lib/analytics/matomo'
import { getTranslator, type MessageKey } from '$lib/content'
import { getCountryName } from '$lib/generated/countries'
import { localiseHref } from '$lib/i18n/routing'
import { resultTone } from '$lib/result-ui'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
const locale = $derived(data.locale ?? 'es')

const statusTone = $derived(resultTone[data.result.resultState])
const checkAnswersHref = $derived(localiseHref(locale, '/check-answers'))
const startAgainHref = $derived(localiseHref(locale, '/screener?new=1'))
const certificateHref = $derived(localiseHref(locale, '/certificate'))
const otherPossibleRoutes = $derived(
	data.result.possibleEligibilityRoutes.filter(
		(route) => route !== data.result.recommendedEligibilityRoute
	)
)

const resultHeadingKeys = {
	eligible: 'result.heading.eligible',
	needs_specialist_review: 'result.heading.needs_specialist_review',
	not_this_process: 'result.heading.not_this_process'
} as const

const routeSummaryKeys = {
	international_protection: 'result.route_summary.international_protection',
	family_unit: 'result.route_summary.family_unit',
	work_or_intention: 'result.route_summary.work_or_intention',
	vulnerability: 'result.route_summary.vulnerability'
} as const

const resultHeadingKey = $derived.by(() => {
	return resultHeadingKeys[data.result.resultState]
})

const routeSummaryKey = $derived.by(() => {
	if (data.result.resultState !== 'eligible') return undefined
	if (
		data.result.recommendedEligibilityRoute === 'needs_specialist_review' ||
		data.result.recommendedEligibilityRoute === 'not_this_process'
	) {
		return undefined
	}

	return routeSummaryKeys[data.result.recommendedEligibilityRoute]
})

type ResultPrimaryAction = {
	kind: 'directory' | 'certificate' | 'documents' | 'review'
	labelKey: MessageKey
	href: string
	eventCategory: string
	eventAction: string
}

const nextStepBodyKey = $derived.by(() => {
	if (data.result.resultState === 'not_this_process') {
		return 'pages.result.next_step.not_this_process.body'
	}

	if (data.result.resultState === 'needs_specialist_review') {
		return 'pages.result.next_step.specialist_review.body'
	}

	if (data.result.recommendedEligibilityRoute === 'vulnerability') {
		return 'pages.result.next_step.vulnerability.body'
	}

	return 'pages.result.next_step.prepare_documents.body'
})

const primaryAction = $derived.by<ResultPrimaryAction>(() => {
	if (data.result.resultState === 'not_this_process') {
		return {
			kind: 'review',
			labelKey: 'common.review_answers',
			href: checkAnswersHref,
			eventCategory: 'Journey',
			eventAction: 'Review answers'
		}
	}

	if (data.result.recommendedEligibilityRoute === 'vulnerability') {
		return {
			kind: 'certificate',
			labelKey: 'pages.result.create_certificate_action',
			href: certificateHref,
			eventCategory: 'Journey',
			eventAction: 'Create vulnerability certificate'
		}
	}

	if (data.result.resultState === 'needs_specialist_review') {
		return {
			kind: 'directory',
			labelKey: 'common.open_directory',
			href: data.organisationsHref,
			eventCategory: 'Directory',
			eventAction: 'Open directory'
		}
	}

	return {
		kind: 'documents',
		labelKey: 'pages.result.review_documents_action',
		href: '#documents',
		eventCategory: 'Journey',
		eventAction: 'Review documents'
	}
})

const showChecklist = $derived(
	data.result.checklist.alreadyHave.length > 0 ||
		data.result.checklist.stillNeed.length > 0 ||
		data.result.checklist.discussWithSupport.length > 0 ||
		data.result.checklist.unresolved.length > 0 ||
		data.result.criminalRecordAssessments.length > 0
)
const criminalRecordAlreadyHave = $derived(
	data.result.criminalRecordAssessments.filter((assessment) => assessment.status === 'already_have')
)
const criminalRecordStillNeed = $derived(
	data.result.criminalRecordAssessments.filter((assessment) => assessment.status !== 'already_have')
)
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<section class="stack">
	<div class="result-grid">
		<StatusPanel tone={statusTone}>
			<header class="result-hero" data-state={data.result.resultState}>
				<p class="eyebrow">{tt('pages.result.eligibility_title')}</p>

				<h1 class="page-title">{tt(resultHeadingKey)}</h1>

				<p class="lead-text">
					{routeSummaryKey ? tt(routeSummaryKey) : tt(data.result.explanationKey)}
				</p>
			</header>
		</StatusPanel>

		<section class="cta-panel">
			<div class="section-block">
				<h2 class="section-title">{tt('pages.result.next_step_title')}</h2>
				<p class="lead-text">
					{tt(nextStepBodyKey)}
				</p>
			</div>

			{#if primaryAction.kind === 'directory'}
				<p class="hint">{tt('pages.result.collaborating_cta.hint')}</p>
			{/if}

			<div class="actions">
				<Button
					href={primaryAction.href}
					variant="default"
					onclick={() =>
						trackEvent(primaryAction.eventCategory, primaryAction.eventAction, data.result.resultState)}
				>
					{tt(primaryAction.labelKey)}
				</Button>
			</div>
		</section>

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

		<section class="panel section-block" id="documents">
			<div class="section-block">
				<h2 class="section-title inline-flex items-center gap-2">
					<ListChecksIcon class="size-5" aria-hidden="true" />
					{tt('pages.result.checklist_title')}
				</h2>
			</div>

			{#if showChecklist}
				<div class="result-grid">
					{#if data.result.checklist.alreadyHave.length > 0 || criminalRecordAlreadyHave.length > 0}
						<div class="list-section">
							<h3>{tt('pages.result.checklist.already_have')}</h3>
							<ul>
								{#each data.result.checklist.alreadyHave as itemKey (itemKey)}
									<li>{tt(itemKey)}</li>
								{/each}
								{#each criminalRecordAlreadyHave as assessment (assessment.countryCode)}
									<li>
										{assessment.countryCode === 'unknown'
											? tt('results.criminal_records.status.unknown')
											: getCountryName(assessment.countryCode, data.locale ?? 'es')}:
										{tt(`results.criminal_records.status.${assessment.status}`)}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if data.result.checklist.stillNeed.length > 0 || criminalRecordStillNeed.length > 0}
						<div class="list-section">
							<h3>{tt('pages.result.checklist.still_need')}</h3>
							<ul>
								{#each data.result.checklist.stillNeed as itemKey (itemKey)}
									<li>{tt(itemKey)}</li>
								{/each}
								{#each criminalRecordStillNeed as assessment (assessment.countryCode)}
									<li>
										{assessment.countryCode === 'unknown'
											? tt('results.criminal_records.status.unknown')
											: getCountryName(assessment.countryCode, data.locale ?? 'es')}:
										{tt(`results.criminal_records.status.${assessment.status}`)}
										{#if assessment.nextActions.length > 0}
											<ul>
												{#each assessment.nextActions as action (action)}
													<li>
														{tt(`results.criminal_records.next_actions.${action}`)}
													</li>
												{/each}
											</ul>
										{/if}
									</li>
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
			{:else}
				<p class="lead-text">{tt('pages.result.checklist.empty_eligible')}</p>
			{/if}
		</section>

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
