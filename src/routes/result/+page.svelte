<script lang="ts">
import { t } from '$lib/content'

let { data } = $props()
</script>

<section class="stack">
	<p class="eyebrow">{t('pages.result.eyebrow')}</p>

	<div class="card stack">
		<span class="result-pill">{t(`result.title.${data.result.resultState}`)}</span>
		<h1>{t(`result.lead.${data.result.resultState}`)}</h1>
		<p>{data.result.explanation}</p>

		{#if data.result.reason}
			<div class="stack">
				<h2>{t('pages.result.why_title')}</h2>
				<p>{data.result.reason}</p>
			</div>
		{/if}

		<div class="stack">
			<h2>{t('pages.result.meaning_title')}</h2>
			<ul>
				{#each data.result.nextSteps as step}
					<li>{step}</li>
				{/each}
			</ul>
		</div>

		{#if data.result.showDocumentCta}
			<div class="stack">
				<h2>{t('pages.result.gather_title')}</h2>
				<ul>
					<li>{t('pages.result.gather.before_cutoff')}</li>
					<li>{t('pages.result.gather.recent')}</li>
					<li>{t('pages.result.gather.identity')}</li>
				</ul>
			</div>
		{/if}

		{#if data.result.showHowToApply}
			<div class="stack">
				<h2>{t('pages.result.how_to_apply_title')}</h2>
				<p>{t('pages.result.how_to_apply.body')}</p>
				<p class="hint">{t('pages.result.how_to_apply.hint')}</p>
			</div>
		{/if}

		{#if data.result.showSupportCta}
			<div class="stack">
				<h2>{t('pages.result.support_title')}</h2>
				<p>{t('pages.result.support.body', { province: data.province })}</p>
			</div>
		{/if}

		{#if data.result.flags.length > 0}
			<div class="stack">
				<h2>{t('pages.result.flags_title')}</h2>
				<ul>
					{#each data.result.flags as flag}
						<li>{flag}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="stack">
			<h2>{t('pages.result.reference_title')}</h2>
			<p>{t('pages.result.reference_body', { sessionId: data.sessionId })}</p>
			<p class="hint">{t('pages.result.reference_hint')}</p>
		</div>

		<div class="actions">
			<a class="button" href="/referral">{t('pages.result.action.help')}</a>
			<a class="button secondary" href="/check-answers"
				>{t('pages.result.action.back_to_answers')}</a
			>
			<a class="button secondary" href="/start?new=1">{t('pages.result.action.start_again')}</a>
		</div>
	</div>
</section>
