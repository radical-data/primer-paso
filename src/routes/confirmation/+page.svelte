<script lang="ts">
import { t } from '$lib/content'

let { data } = $props()
</script>

<section class="stack">
	<p class="eyebrow">{t('pages.confirmation.eyebrow')}</p>
	<div class="card stack">
		<h1>{t('pages.confirmation.title')}</h1>
		<p>{t('pages.confirmation.body')}</p>
		<div class="stack">
			<p><strong>{t('pages.confirmation.reference_number')}:</strong> {data.sessionId}</p>
			<p>
				<strong>{t('pages.confirmation.updated')}:</strong>
				{new Date(data.submittedAt).toLocaleString()}
			</p>
		</div>
		<p class="hint">{t('pages.confirmation.hint')}</p>
		<div class="actions">
			<a class="button" href="/check-answers">{t('pages.confirmation.action.view_answers')}</a>
			<a class="button secondary" href="/result">{t('pages.confirmation.action.back_to_result')}</a>
			<a class="button secondary" href="/start?new=1"
				>{t('pages.confirmation.action.start_again')}</a
			>
		</div>
	</div>
</section>
