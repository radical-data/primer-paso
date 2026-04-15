<script lang="ts">
import { t } from '$lib/content'
</script>

<section class="stack">
	<p class="eyebrow">{t('pages.start.eyebrow')}</p>
	<div class="card stack">
		<h1>{t('pages.start.title')}</h1>
		<p>{t('pages.start.lead')}</p>
		<p>{t('pages.start.not_official')}</p>
		<p>{t('pages.start.window_open')}</p>
		<p>{t('pages.start.resume')}</p>

		<div class="stack">
			<h2>{t('pages.start.what_to_expect_title')}</h2>
			<ul>
				<li>{t('pages.start.expectation.duration')}</li>
				<li>{t('pages.start.expectation.one_question')}</li>
				<li>{t('pages.start.expectation.review')}</li>
				<li>{t('pages.start.expectation.timeline')}</li>
			</ul>
		</div>

		<div class="actions"><a class="button" href="/language">{t('pages.start.start_now')}</a></div>
	</div>
</section>
