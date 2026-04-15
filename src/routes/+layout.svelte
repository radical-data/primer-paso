<script lang="ts">
import { browser } from '$app/environment'
import { invalidateAll } from '$app/navigation'
import { getTranslator } from '$lib/content'

let { children, data } = $props()

const locale = $derived(data.locale ?? 'en')
const textDirection = $derived(data.textDirection ?? 'ltr')
const tt = $derived(getTranslator(locale))
const currentPath = $derived(data.currentPath ?? '/start')

$effect(() => {
	if (!browser) return

	document.documentElement.lang = locale
	document.documentElement.dir = textDirection
})

const languages = [
	{ value: 'es', label: 'Español' },
	{ value: 'en', label: 'English' },
	{ value: 'ar', label: 'العربية' },
	{ value: 'fr', label: 'Français' }
]

const getLanguageHref = (languageValue: string) =>
	`/language?set=${languageValue}&returnTo=${encodeURIComponent(currentPath)}`

const switchLanguage = async (event: MouseEvent, languageValue: string) => {
	if (!browser) return
	if (languageValue === locale) return

	event.preventDefault()

	const href = getLanguageHref(languageValue)

	try {
		const response = await fetch(href, {
			method: 'GET',
			credentials: 'same-origin'
		})

		if (!response.ok) throw new Error(`Language switch failed: ${response.status}`)

		await invalidateAll()
	} catch {
		window.location.href = href
	}
}
</script>

<svelte:head>
	<title>{tt('chrome.app_title')}</title>
	<meta name="description" content={tt('chrome.meta_description')}>
</svelte:head>

<div class="app-shell">
	<header class="site-header">
		<div class="site-width header-row">
			<a class="brand" href="/start">{tt('chrome.brand')}</a>
			<nav aria-label={tt('chrome.language_switcher_label')}>
				<ul class="language-list">
					{#each languages as language}
						<li>
							<a
								href={getLanguageHref(language.value)}
								aria-current={language.value === locale ? 'true' : undefined}
								onclick={(event) => switchLanguage(event, language.value)}
							>
								{language.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>

	<main class="site-width content">{@render children()}</main>
</div>

<style>
:global(html) {
	font-family:
		Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	background: #f8fafc;
	color: #0f172a;
}

:global(body) {
	margin: 0;
	min-height: 100vh;
}

:global(a) {
	color: inherit;
}

:global(button),
:global(input),
:global(select) {
	font: inherit;
}

:global(:focus-visible) {
	outline: 3px solid #2563eb;
	outline-offset: 2px;
}

:global(.stack) {
	display: grid;
	gap: 1rem;
}

:global(.card) {
	background: #fff;
	border: 1px solid #cbd5e1;
	border-radius: 1rem;
	padding: 1.5rem;
	box-shadow: 0 8px 24px rgb(15 23 42 / 0.06);
}

:global(.eyebrow) {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 600;
	color: #475569;
}

:global(h1) {
	margin: 0;
	font-size: clamp(1.875rem, 4vw, 2.6rem);
	line-height: 1.1;
}

:global(h2) {
	margin: 0;
	font-size: 1.25rem;
}

:global(p) {
	margin: 0;
	line-height: 1.6;
}

:global(.hint) {
	color: #475569;
}

:global(.actions) {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	align-items: center;
}

:global(.button) {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.8rem 1.15rem;
	border-radius: 999px;
	border: 1px solid transparent;
	background: #0f172a;
	color: #fff;
	font-weight: 600;
	text-decoration: none;
	cursor: pointer;
}

:global(.button.secondary) {
	background: transparent;
	color: #0f172a;
	border-color: #94a3b8;
}

:global(.question-group) {
	display: grid;
	gap: 0.75rem;
	border: 0;
	padding: 0;
	margin: 0;
}

:global(.option) {
	display: flex;
	gap: 0.75rem;
	align-items: flex-start;
	padding: 0.9rem 1rem;
	border: 1px solid #cbd5e1;
	border-radius: 0.9rem;
	background: #fff;
}

:global(.option input) {
	margin-top: 0.2rem;
}

:global(.field) {
	display: grid;
	gap: 0.4rem;
}

:global(.field input) {
	padding: 0.8rem 0.9rem;
	border: 1px solid #94a3b8;
	border-radius: 0.75rem;
	background: #fff;
}

:global(.field select) {
	padding: 0.8rem 0.9rem;
	border: 1px solid #94a3b8;
	border-radius: 0.75rem;
	background: #fff;
	min-height: 3rem;
}

:global(.sr-only) {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

:global(.field-row) {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

:global(.error-summary) {
	border: 1px solid #dc2626;
	border-left-width: 6px;
	background: #fef2f2;
	border-radius: 0.75rem;
	padding: 1rem;
}

:global(.error-text) {
	color: #b91c1c;
}

:global(.check-list) {
	display: grid;
	gap: 1rem;
}

:global(.check-row) {
	display: grid;
	gap: 0.5rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e2e8f0;
}

:global(.result-pill) {
	display: inline-flex;
	align-items: center;
	padding: 0.45rem 0.75rem;
	border-radius: 999px;
	background: #dbeafe;
	color: #1d4ed8;
	font-size: 0.875rem;
	font-weight: 700;
}

.app-shell {
	min-height: 100vh;
}

.site-header {
	border-bottom: 1px solid #e2e8f0;
	background: rgb(255 255 255 / 0.92);
	backdrop-filter: blur(12px);
}

.site-width {
	width: min(100% - 2rem, 48rem);
	margin: 0 auto;
}

.brand {
	display: inline-block;
	padding: 1rem 0;
	font-weight: 700;
	text-decoration: none;
}

.header-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.language-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	list-style: none;
	padding: 0;
	margin: 0;
}

.content {
	padding: 2rem 0 4rem;
}

@media (max-width: 640px) {
	:global(.field-row) {
		grid-template-columns: 1fr;
	}
}
</style>
