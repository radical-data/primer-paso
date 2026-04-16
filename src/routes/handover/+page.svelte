<script lang="ts">
import { browser } from '$app/environment'
import { Button } from '$lib/components/ui/button'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'

let { data } = $props()

const tt = $derived(getTranslator((data.locale ?? 'en') satisfies Locale))
const generatedAt = $derived(
	new Date(data.packet.generatedAt).toLocaleString(data.locale ?? 'en', {
		timeZone: 'Europe/Madrid'
	})
)

const printPage = () => {
	if (browser) {
		window.print()
	}
}
</script>

<section class="stack">
	<p class="eyebrow no-print">{tt('pages.handover.eyebrow')}</p>
	<div class="app-card stack">
		<h1>{tt('pages.handover.title')}</h1>
		<p>{tt('pages.handover.body')}</p>
		<p class="hint">{tt('pages.handover.reference', { sessionId: data.packet.sessionId })}</p>
		<p class="hint">{tt('pages.handover.generated_at', { generatedAt })}</p>

		<div class="stack">
			<h2>{tt('pages.handover.summary_title')}</h2>
			<p><strong>{tt('pages.result.eligibility_title')}</strong></p>
			<p>{data.packet.eligibility}</p>
			<p><strong>{tt('pages.result.next_step_title')}</strong></p>
			<p>{data.packet.nextStep}</p>
		</div>

		<p>{data.packet.routeBody}</p>

		<div class="stack">
			<h2>{tt('pages.handover.checklist_title')}</h2>

			{#if data.packet.checklist.alreadyHave.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.already_have')}</h3>
					<ul>
						{#each data.packet.checklist.alreadyHave as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.packet.checklist.stillNeed.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.still_need')}</h3>
					<ul>
						{#each data.packet.checklist.stillNeed as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.packet.checklist.discussWithSupport.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.discuss_with_support')}</h3>
					<ul>
						{#each data.packet.checklist.discussWithSupport as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if data.packet.checklist.unresolved.length > 0}
				<div class="stack">
					<h3>{tt('pages.result.checklist.unresolved')}</h3>
					<ul>
						{#each data.packet.checklist.unresolved as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<div class="stack">
			<h2>{tt('pages.handover.answers_title')}</h2>
			<div class="check-list">
				{#each data.packet.answers as answer}
					<section class="check-row" aria-label={answer.label}>
						<div class="stack">
							<h3>{answer.label}</h3>
							<p>{answer.value}</p>
						</div>
					</section>
				{/each}
			</div>
		</div>

		{#if data.packet.flags.length > 0}
			<div class="stack">
				<h2>{tt('pages.handover.flags_title')}</h2>
				<ul>
					{#each data.packet.flags as flag}
						<li>{flag}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="actions no-print">
			<Button href={data.packet.officialPortalUrl} target="_blank" rel="noreferrer"
				>{tt('pages.result.action.official_portal')}</Button
			>
			<Button
				href={data.packet.collaboratorsPdfUrl}
				target="_blank"
				rel="noreferrer"
				variant="outline"
				>{tt('pages.result.action.open_collaborators_pdf')}</Button
			>
			<Button onclick={printPage}>{tt('pages.result.action.print_handover')}</Button>
			<Button href="/handover.json" variant="outline"
				>{tt('pages.result.action.download_handover_json')}</Button
			>
			<Button href="/result" variant="outline">{tt('pages.handover.action.back_to_result')}</Button>
		</div>
	</div>
</section>

<style>
	@media print {
		.no-print {
			display: none !important;
		}

		:global(.site-header) {
			display: none !important;
		}

		:global(main.site-width) {
			width: 100%;
			max-width: none;
			padding: 0;
		}

		:global(.app-card) {
			border: 0;
			box-shadow: none;
			padding: 0;
		}
	}
</style>
