<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { getTranslator } from '$lib/content'

let { data } = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.result.eyebrow')}</p>

	<div class="app-card stack">
		<span class="result-pill">{tt(`result.title.${data.result.resultState}`)}</span>

		<h1>{tt('pages.result.eligibility_title')}</h1>
		<p>{tt(data.result.summary.eligibilityKey)}</p>

		{#if data.result.reasonKey}
			<div class="stack">
				<h2>{tt('pages.result.why_title')}</h2>
				<p>{tt(data.result.reasonKey)}</p>
			</div>
		{/if}

		<div class="stack">
			<h2>{tt('pages.result.next_step_title')}</h2>
			<p>{tt(data.result.summary.nextStepKey)}</p>
			{#if data.result.recommendedRoute === 'official_portal'}
				<div class="actions">
					<Button href={data.officialPortalUrl} target="_blank" rel="noreferrer"
						>{tt('pages.result.action.open_official_portal')}</Button
					>
				</div>
			{:else}
				<p class="hint">{tt('pages.result.next_step.collaborating_organisation_hint')}</p>
				<div class="actions">
					<Button href={data.collaboratorsPdfUrl} target="_blank" rel="noreferrer"
						>{tt('pages.result.action.open_collaborators_pdf')}</Button
					>
				</div>
			{/if}
		</div>

		<div class="stack">
			<h2>{tt('pages.result.checklist_title')}</h2>

			{#if data.result.checklist.alreadyHave.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.already_have')}</h3>
					<ul>
						{#each data.result.checklist.alreadyHave as itemKey}
							<li>{tt(itemKey)}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.result.checklist.stillNeed.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.still_need')}</h3>
					<ul>
						{#each data.result.checklist.stillNeed as itemKey}
							<li>{tt(itemKey)}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.result.checklist.discussWithSupport.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.discuss_with_support')}</h3>
					<ul>
						{#each data.result.checklist.discussWithSupport as itemKey}
							<li>{tt(itemKey)}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.result.checklist.unresolved.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.unresolved')}</h3>
					<ul>
						{#each data.result.checklist.unresolved as itemKey}
							<li>{tt(itemKey)}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		{#if data.result.recommendedRoute === 'official_portal' && data.result.showHowToApply}
			<div class="stack">
				<h2>{tt('pages.result.how_to_apply_title')}</h2>
				<p>{tt('pages.result.how_to_apply.body')}</p>
				<p class="hint">{tt('pages.result.how_to_apply.hint')}</p>
			</div>
		{/if}

		<div class="stack">
			<h2>{tt('pages.result.handover_title')}</h2>
			<p>{tt('pages.result.handover.body')}</p>
			<div class="actions">
				<Button href={data.handoverHref}>{tt('pages.result.action.print_handover')}</Button>
			</div>
		</div>

		<div class="actions">
			<Button href="/check-answers" variant="outline">{tt('pages.result.action.back_to_answers')}</Button>
			<Button href="/start?new=1" variant="outline">{tt('pages.result.action.start_again')}</Button>
		</div>
	</div>
</section>
