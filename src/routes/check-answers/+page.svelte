<script lang="ts">
import { t } from '$lib/content'

let { data } = $props()
</script>

<section class="stack">
	<p class="eyebrow">{t('pages.check_answers.eyebrow')}</p>

	<div class="card stack">
		<h1>{t('pages.check_answers.title')}</h1>
		<p class="hint">{t('pages.check_answers.hint')}</p>

		<div class="check-list">
			{#each data.answers as answer}
				<section class="check-row" aria-label={answer.label}>
					<div class="stack">
						<h2>{answer.label}</h2>
						<p>{answer.value}</p>
					</div>
					<a class="button secondary" href={answer.changeHref}>{t('pages.check_answers.change')}</a>
				</section>
			{/each}
		</div>

		<div class="actions">
			<a class="button" href="/result">{t('pages.check_answers.see_result')}</a>
			<a class="button secondary" href="/province">{t('pages.check_answers.back')}</a>
		</div>
	</div>
</section>
