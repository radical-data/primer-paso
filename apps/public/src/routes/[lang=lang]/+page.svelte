<script lang="ts">
import CheckIcon from '@lucide/svelte/icons/check'
import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { onMount } from 'svelte'
import { trackEvent } from '$lib/analytics/matomo'
import type { Locale, MessageKey } from '$lib/content'
import { getTranslator } from '$lib/content'
import {
	loadDocs,
	loadEligibility,
	loadSubmission,
	setDoc,
	setEligibility,
	setSubmission
} from '$lib/home-checklist'
import { localiseHref } from '$lib/i18n/routing'

let { data } = $props()
const locale = $derived((data.locale ?? 'es') as Locale)
const tt = $derived(getTranslator(locale))
const documents = $derived(data.documents as MessageKey[])
const hasCompletedScreener = $derived(data.hasCompletedScreener)

const TOTAL_STEPS = '3'

let eligibility = $state(false)
let submission = $state(false)
const docState = $state<Record<string, boolean>>({})
let hydrated = $state(false)

onMount(() => {
	eligibility = loadEligibility()
	submission = loadSubmission()
	Object.assign(docState, loadDocs())
	hydrated = true
})

const officialPortalUrl = 'https://inclusion.gob.es/regularizacion'

const documentsChecked = $derived(
	documents.length > 0 && documents.every((doc) => docState[doc] === true)
)

const toggleEligibility = () => {
	eligibility = !eligibility
	setEligibility(eligibility)
	trackEvent('Home checklist', eligibility ? 'Check step' : 'Uncheck step', 'eligibility')
}

const toggleSubmission = () => {
	submission = !submission
	setSubmission(submission)
	trackEvent('Home checklist', submission ? 'Check step' : 'Uncheck step', 'submission')
}

const toggleDocumentsStep = () => {
	const next = !documentsChecked
	for (const docKey of documents) {
		docState[docKey] = next
		setDoc(docKey, next)
	}
	trackEvent('Home checklist', next ? 'Check step' : 'Uncheck step', 'documents')
}

const toggleDoc = (key: string) => {
	const next = !docState[key]
	docState[key] = next
	setDoc(key, next)
}

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
	<header class="section-block">
		<p class="eyebrow">{tt('pages.home.eyebrow')}</p>
		<h1 class="page-title">{tt('pages.home.title')}</h1>
		<p class="lead-text">{tt('pages.home.lead')}</p>
	</header>

	<ol class="step-list" aria-label={tt('pages.home.title')}>
		<li>
			<Card class="step-card" data-checked={eligibility}>
				<CardHeader class="step-card-header">
					<button
						type="button"
						class="step-indicator-button"
						aria-pressed={eligibility}
						aria-label={tt('pages.home.steps.toggle_aria')}
						onclick={toggleEligibility}
						disabled={!hydrated}
					>
						<span class="step-indicator" data-checked={eligibility} aria-hidden="true">
							{#if eligibility}
								<CheckIcon class="size-4" />
							{/if}
						</span>
					</button>
					<div class="step-card-text">
						<p class="eyebrow">
							{tt('pages.home.steps.step_label', { current: '1', total: TOTAL_STEPS })}
						</p>
						<CardTitle>{tt('pages.home.steps.eligibility.title')}</CardTitle>
						<CardDescription>{tt('pages.home.steps.eligibility.description')}</CardDescription>
					</div>
				</CardHeader>
				<CardContent class="step-card-content">
					<p class="hint">{tt('pages.home.steps.eligibility.hint')}</p>
					<div class="actions">
						{#if hasCompletedScreener}
							<Button
								href={localiseHref(locale, '/result')}
								onclick={() => trackEvent('Journey', 'See result', 'home')}
							>
								{tt('common.see_result')}
							</Button>
							<Button
								href={localiseHref(locale, '/screener')}
								variant="secondary"
								onclick={() => trackEvent('Journey', 'Review screener', 'home')}
							>
								{tt('pages.home.steps.eligibility.cta_again')}
							</Button>
						{:else}
							<Button
								href={localiseHref(locale, '/screener')}
								onclick={() => trackEvent('Journey', 'Open start', 'home')}
							>
								{tt('pages.home.steps.eligibility.cta')}
							</Button>
						{/if}
					</div>
				</CardContent>
			</Card>
		</li>

		<li>
			<Card class="step-card" data-checked={documentsChecked}>
				<CardHeader class="step-card-header">
					<button
						type="button"
						class="step-indicator-button"
						aria-pressed={documentsChecked}
						aria-label={tt('pages.home.steps.toggle_aria')}
						onclick={toggleDocumentsStep}
						disabled={!hydrated}
					>
						<span class="step-indicator" data-checked={documentsChecked} aria-hidden="true">
							{#if documentsChecked}
								<CheckIcon class="size-4" />
							{/if}
						</span>
					</button>
					<div class="step-card-text">
						<p class="eyebrow">
							{tt('pages.home.steps.step_label', { current: '2', total: TOTAL_STEPS })}
						</p>
						<CardTitle>{tt('pages.home.steps.documents.title')}</CardTitle>
						<CardDescription>
							{hasCompletedScreener
								? tt('pages.home.steps.documents.description_personalised')
								: tt('pages.home.steps.documents.description_generic')}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent class="step-card-content">
					{#if documents.length > 0}
						<ul class="doc-list">
							{#each documents as docKey (docKey)}
								<li>
									<label class="doc-row">
										<input
											type="checkbox"
											class="doc-row-input"
											checked={docState[docKey] === true}
											disabled={!hydrated}
											onchange={() => toggleDoc(docKey)}
										>
										<span class="doc-row-indicator" aria-hidden="true">
											{#if docState[docKey]}
												<CheckIcon class="size-3.5" />
											{/if}
										</span>
										<span class="doc-row-label">{tt(docKey)}</span>
									</label>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="hint">{tt('pages.home.steps.documents.empty')}</p>
					{/if}
				</CardContent>
			</Card>
		</li>

		<li>
			<Card class="step-card" data-checked={submission}>
				<CardHeader class="step-card-header">
					<button
						type="button"
						class="step-indicator-button"
						aria-pressed={submission}
						aria-label={tt('pages.home.steps.toggle_aria')}
						onclick={toggleSubmission}
						disabled={!hydrated}
					>
						<span class="step-indicator" data-checked={submission} aria-hidden="true">
							{#if submission}
								<CheckIcon class="size-4" />
							{/if}
						</span>
					</button>
					<div class="step-card-text">
						<p class="eyebrow">
							{tt('pages.home.steps.step_label', { current: '3', total: TOTAL_STEPS })}
						</p>
						<CardTitle>{tt('pages.home.steps.submission.title')}</CardTitle>
					</div>
				</CardHeader>
				<CardContent class="step-card-content">
					<div class="submission-option">
						<p class="supporting-text">{tt('pages.home.steps.submission.digital_intro')}</p>
						<div class="actions">
							<Button
								href={officialPortalUrl}
								target="_blank"
								rel="noreferrer"
								onclick={() => trackEvent('Journey', 'Open official portal', 'home')}
							>
								{tt('pages.home.official_portal_action')}
								<ExternalLinkIcon class="size-4" />
							</Button>
						</div>
					</div>
					<div class="submission-option">
						<p class="supporting-text">{tt('pages.home.steps.submission.collaborating_intro')}</p>
						<div class="actions">
							<Button
								variant="secondary"
								href={localiseHref(locale, '/organisations')}
								onclick={() => trackEvent('Directory', 'Open directory', 'home')}
							>
								{tt('common.open_directory')}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</li>
	</ol>
</section>

<style>
.step-list {
	display: grid;
	gap: 1rem;
	list-style: none;
	margin: 0;
	padding: 0;
}

:global(.step-card) {
	transition: border-color 0.16s ease;
}

:global(.step-card[data-checked="true"]) {
	border-color: color-mix(in oklab, var(--color-primary) 30%, var(--color-border));
}

:global(.step-card-header) {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 0.75rem;
	align-items: start;
}

.step-card-text {
	display: grid;
	gap: 0.4rem;
	min-width: 0;
}

.step-indicator {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.75rem;
	height: 1.75rem;
	border-radius: 0.5rem;
	border: 2px solid var(--color-border);
	background: var(--color-background);
	color: var(--color-primary-foreground);
	transition:
		background-color 0.16s ease,
		border-color 0.16s ease;
	flex-shrink: 0;
	margin-top: 0.15rem;
}

.step-indicator[data-checked="true"] {
	background: var(--color-primary);
	border-color: var(--color-primary);
}

.step-indicator-button {
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	border-radius: 0.5rem;
}

.step-indicator-button:focus-visible {
	outline: 2px solid var(--color-ring);
	outline-offset: 2px;
}

.step-indicator-button:disabled {
	cursor: default;
}

:global(.step-card-content) {
	display: grid;
	gap: 1rem;
}

.doc-list {
	display: grid;
	gap: 0.5rem;
	list-style: none;
	padding: 0;
	margin: 0;
}

.doc-row {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 0.75rem;
	align-items: start;
	padding: 0.625rem 0.75rem;
	border-radius: 0.75rem;
	border: 1px solid color-mix(in oklab, var(--color-border) 70%, transparent);
	background: var(--color-background);
	cursor: pointer;
	transition:
		border-color 0.16s ease,
		background-color 0.16s ease;
}

.doc-row:hover {
	border-color: color-mix(in oklab, var(--color-primary) 35%, var(--color-border));
	background: color-mix(in oklab, var(--color-accent) 30%, var(--color-background));
}

.doc-row-input {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

.doc-row-indicator {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 0.375rem;
	border: 1.5px solid var(--color-border);
	background: var(--color-background);
	color: var(--color-primary-foreground);
	margin-top: 0.15rem;
	flex-shrink: 0;
	transition:
		background-color 0.16s ease,
		border-color 0.16s ease;
}

.doc-row-input:checked + .doc-row-indicator {
	background: var(--color-primary);
	border-color: var(--color-primary);
}

.doc-row-input:focus-visible + .doc-row-indicator {
	outline: 2px solid var(--color-ring);
	outline-offset: 2px;
}

.doc-row-label {
	font-size: 0.95rem;
	line-height: 1.45;
}

.submission-option {
	display: grid;
	gap: 0.625rem;
}

.submission-option + .submission-option {
	border-top: 1px dashed color-mix(in oklab, var(--color-border) 60%, transparent);
	padding-top: 1rem;
}
</style>
