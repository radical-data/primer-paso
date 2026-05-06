<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import LanguagesIcon from '@lucide/svelte/icons/languages'
import '../../app.css'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@primer-paso/ui/select'
import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { page } from '$app/state'
import faviconUrl from '$lib/assets/favicon.svg?url'
import MatomoTracker from '$lib/components/analytics/MatomoTracker.svelte'
import { getTextDirection, getTranslator, isLocale, type Locale } from '$lib/content'
import {
	getAlternateLocaleHrefs,
	getDefaultLocaleHref,
	localiseHref,
	replaceLocaleInHref
} from '$lib/i18n/routing'

let { children, data } = $props()

const locale = $derived(data.locale ?? 'es')
const siteUrl = 'https://primerpaso.org'
const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`)
const tt = $derived(getTranslator(locale))
const currentPath = $derived(data.currentPath ?? '/screener')
const currentHref = $derived(`${page.url.pathname}${page.url.search}`)
const radicalDataUrl = 'https://radicaldata.org'

const languages: { value: Locale; label: string }[] = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'ar', label: 'العربية' },
	{ value: 'fr', label: 'Français' }
]

const getLanguageHref = (languageValue: Locale) => replaceLocaleInHref(currentPath, languageValue)

const onLanguageChange = (value: string) => {
	if (!isLocale(value) || value === locale) return
	goto(getLanguageHref(value))
}

const currentLanguageLabel = $derived(languages.find((l) => l.value === locale)?.label ?? 'Español')

const homeHref = $derived(localiseHref(locale, '/'))
const screenerHref = $derived(localiseHref(locale, '/screener'))

const alternateLinks = $derived(
	getAlternateLocaleHrefs(currentHref).map(({ locale, href }) => ({
		locale,
		href: `${siteUrl}${href}`
	}))
)

const isCurrentNavItem = (href: string) => {
	if (href === localiseHref(locale, '/')) return page.url.pathname === href
	return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`)
}

// Sync <html lang> and <html dir> on client-side navigation. SSR sets them
// once via hooks.server.ts, but client-side `goto()` does not re-render the
// document element — so without this, switching to/from Arabic only takes
// effect after a full page reload.
$effect(() => {
	document.documentElement.lang = locale
	document.documentElement.dir = getTextDirection(locale)
})
</script>

<svelte:head>
	<title>{tt('chrome.app_title')}</title>
	<link rel="icon" href={faviconUrl} type="image/svg+xml">
	<link rel="apple-touch-icon" href={faviconUrl}>
	<link rel="mask-icon" href={faviconUrl} color="#315ec7">
	<link rel="canonical" href={canonicalUrl}>
	<link
		rel="alternate"
		hreflang="x-default"
		href={`${siteUrl}${getDefaultLocaleHref(currentHref)}`}
	>
	{#each alternateLinks as link (link.locale)}
		<link rel="alternate" hreflang={link.locale} href={link.href}>
	{/each}
	<meta property="og:site_name" content="Primer Paso">
	<meta name="twitter:card" content="summary">
</svelte:head>

<svelte:body />

<MatomoTracker />

<div class="app-shell">
	<a class="skip-link" href="#main-content">{tt('chrome.skip_to_main')}</a>

	<header class="site-header">
		<div class="site-header-inner site-width">
			<div class="site-header-top">
				<a class="brand" href={resolve('/')}>
					<span class="brand-mark">{tt('chrome.brand')}</span>
					<span class="brand-tagline">{tt('chrome.tagline')}</span>
				</a>
			</div>

			<div class="site-header-main">
				<nav class="service-nav" aria-label={tt('chrome.primary_navigation')}>
					<ul class="service-nav-list">
						<li>
							<a
								class="service-nav-link"
								href={homeHref}
								aria-current={isCurrentNavItem(homeHref) ? 'page' : undefined}
							>
								{tt('chrome.nav.home')}
							</a>
						</li>
						<li>
							<a
								class="service-nav-link"
								href={screenerHref}
								aria-current={isCurrentNavItem(screenerHref) ? 'page' : undefined}
							>
								{tt('chrome.nav.start')}
							</a>
						</li>
					</ul>
				</nav>

				<div class="language-nav">
					<Select type="single" value={locale} onValueChange={onLanguageChange}>
						<SelectTrigger
							class="language-select-trigger"
							aria-label={tt('chrome.language_switcher_label')}
						>
							<LanguagesIcon class="language-select-icon size-4 shrink-0" aria-hidden="true" />
							<span class="language-select-value">{currentLanguageLabel}</span>
						</SelectTrigger>
						<SelectContent class="language-select-content" align="end">
							{#each languages as language (language.value)}
								<SelectItem value={language.value} label={language.label}>
									{language.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
					<noscript>
						<ul class="language-list">
							{#each languages as language (language.value)}
								<li>
									<a
										class="language-link"
										href={getLanguageHref(language.value)}
										aria-current={language.value === locale ? 'true' : undefined}
										rel="nofollow"
										>{language.label}</a
									>
								</li>
							{/each}
						</ul>
					</noscript>
				</div>
			</div>
		</div>
	</header>
	<main id="main-content" class="site-width py-8 pb-16">{@render children()}</main>
	<footer class="site-footer">
		<div class="site-footer-inner site-width">
			<section class="site-footer-about" aria-labelledby="site-footer-title">
				<p class="site-footer-eyebrow">{tt('chrome.footer.eyebrow')}</p>
				<h2 id="site-footer-title" class="site-footer-title">{tt('chrome.footer.title')}</h2>
				<div class="site-footer-copy">
					<p>{tt('chrome.footer.body')}</p>
					<p>
						{tt('chrome.footer.attribution_prefix')}
						{' '}
						<a
							class="site-footer-link !inline !min-h-0"
							href={radicalDataUrl}
							target="_blank"
							rel="noreferrer"
							><span class="inline-flex items-center gap-[0.2em] whitespace-nowrap"
								>{tt('chrome.footer.attribution_name')}
								<ExternalLinkIcon class="size-[0.85em] shrink-0" aria-hidden="true" /></span
							></a
						>
					</p>
					<p>{tt('chrome.footer.disclaimer')}</p>
				</div>
			</section>

			<nav class="site-footer-nav" aria-label={tt('chrome.footer.title')}>
				<h2 class="site-footer-title">{tt('chrome.primary_navigation')}</h2>
				<ul class="site-footer-links">
					<li><a class="site-footer-link" href={homeHref}>{tt('chrome.nav.home')}</a></li>
					<li><a class="site-footer-link" href={screenerHref}>{tt('chrome.nav.start')}</a></li>
					<li>
						<a
							class="site-footer-link"
							href="https://inclusion.gob.es/regularizacion"
							target="_blank"
							rel="noreferrer"
						>
							{tt('chrome.footer.link.official_portal')}
							<ExternalLinkIcon class="size-4" aria-hidden="true" />
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</footer>
</div>
