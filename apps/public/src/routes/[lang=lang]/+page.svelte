<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import { trackEvent } from '$lib/analytics/matomo'
import { Button } from '$lib/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '$lib/components/ui/card'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'

let { data } = $props()
const locale = $derived((data.locale ?? 'es') as Locale)
const tt = $derived(getTranslator(locale))
const structuredData = $derived(
	JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Primer Paso',
		url: `https://primerpaso.org${localiseHref(locale, '/')}`,
		description: tt('pages.home.meta_description'),
		inLanguage: locale
	})
)
</script>
<svelte:head>
	<title>{tt('pages.home.meta_title')}</title>
	<meta name="description" content={tt('pages.home.meta_description')}>
	<meta property="og:title" content={tt('pages.home.meta_title')}>
	<meta property="og:description" content={tt('pages.home.meta_description')}>
	<meta property="og:type" content="website">
	<meta property="og:url" content={`https://primerpaso.org${localiseHref(locale, '/')}`}>
	<meta name="twitter:title" content={tt('pages.home.meta_title')}>
	<meta name="twitter:description" content={tt('pages.home.meta_description')}>
	<script type="application/ld+json">{structuredData}</script>
</svelte:head>
<section class="stack">
	<p class="eyebrow">{tt('pages.home.eyebrow')}</p>
	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">{tt('pages.home.title')}</h1>
			<p class="lead-text">{tt('pages.home.lead')}</p>
		</div>
		<div class="section-block">
			<h2 class="section-title">{tt('pages.home.choose')}</h2>
			<div class="task-grid">
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{tt('pages.home.quiz_title')}</CardTitle>
						<CardDescription>{tt('pages.home.quiz_body')}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter>
						<Button
							href={localiseHref(locale, '/screener')}
							onclick={() => trackEvent('Journey', 'Open start', 'home')}
							>{tt('pages.home.quiz_action')}</Button
						>
					</CardFooter>
				</Card>
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{tt('pages.home.directory_title')}</CardTitle>
						<CardDescription>{tt('pages.home.directory_body')}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter>
						<Button
							href={localiseHref(locale, '/organisations')}
							variant="secondary"
							onclick={() => trackEvent('Directory', 'Open directory', 'home')}
						>
							{tt('common.open_directory')}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.home.note_title')}</h2>
			<p class="supporting-text">{tt('pages.home.note_body')}</p>
		</div>
		<div class="section-block">
			<h2 class="section-title">{tt('pages.home.seo_intro_title')}</h2>
			<div class="prose-block">
				<p class="supporting-text">{tt('pages.home.seo_intro_body_1')}</p>
				<p class="supporting-text">{tt('pages.home.seo_intro_body_2')}</p>
				<p class="supporting-text">{tt('pages.home.seo_intro_body_3')}</p>
			</div>
		</div>
		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.home.seo_help_title')}</h2>
			<ul>
				<li>{tt('pages.home.seo_help_item_1')}</li>
				<li>{tt('pages.home.seo_help_item_2')}</li>
				<li>{tt('pages.home.seo_help_item_3')}</li>
				<li>{tt('pages.home.seo_help_item_4')}</li>
			</ul>
		</div>
		<div class="panel section-block">
			<h2 class="section-title">{tt('pages.home.seo_support_title')}</h2>
			<p class="supporting-text">{tt('pages.home.seo_support_body')}</p>
			<div class="actions">
				<Button href={localiseHref(locale, '/organisations')} variant="secondary"
					>{tt('common.open_directory')}</Button
				>
				<Button
					href="https://inclusion.gob.es/regularizacion"
					target="_blank"
					rel="noreferrer"
					onclick={() => trackEvent('Journey', 'Open official portal', 'home')}
				>
					{tt('pages.home.official_portal_action')}
					<ExternalLinkIcon class="size-4" />
				</Button>
			</div>
		</div>
	</div>
</section>
