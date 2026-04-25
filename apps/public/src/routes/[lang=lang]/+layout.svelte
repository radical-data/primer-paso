<script lang="ts">
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import LanguagesIcon from '@lucide/svelte/icons/languages'
import '../../app.css'
import { resolve } from '$app/paths'
import { page } from '$app/state'
import faviconUrl from '$lib/assets/favicon.svg?url'
import MatomoTracker from '$lib/components/analytics/MatomoTracker.svelte'
import { getTranslator, type Locale } from '$lib/content'
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

const getLanguageHref = (languageValue: Locale) => {
	const languagePage = localiseHref(locale, '/language')
	const returnTo = replaceLocaleInHref(currentPath, languageValue)
	return `${languagePage}?set=${languageValue}&returnTo=${encodeURIComponent(returnTo)}`
}

const navigationItems = $derived([
	{ href: localiseHref(locale, '/'), label: tt('chrome.nav.home') },
	{ href: localiseHref(locale, '/screener'), label: tt('chrome.nav.start') },
	{ href: localiseHref(locale, '/organisations'), label: tt('chrome.nav.organisations') }
])

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
						{#each navigationItems as item (item.href)}
							<li>
								<a
									class="service-nav-link"
									href={item.href}
									aria-current={isCurrentNavItem(item.href) ? 'page' : undefined}
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<nav class="language-nav" aria-label={tt('chrome.language_switcher_label')}>
					<span class="language-nav-label">
						<span class="inline-flex items-center gap-2" aria-hidden="true">
							<LanguagesIcon class="size-3.5" aria-hidden="true" />
						</span>
						{tt('chrome.language_switcher_label')}
					</span>
					<ul class="language-list site-header-actions">
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
				</nav>
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
					{#each navigationItems as item (item.href)}
						<li><a class="site-footer-link" href={item.href}>{item.label}</a></li>
					{/each}
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
