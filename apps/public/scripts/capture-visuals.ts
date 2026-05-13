import fs from 'node:fs/promises'
import path from 'node:path'
import {
	type BrowserContext,
	type BrowserContextOptions,
	chromium,
	devices,
	type Page
} from '@playwright/test'
import { VULNERABILITY_REASON_VALUES } from '@primer-paso/certificate'
import { getSitemapEntries } from '../src/lib/server/sitemap'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const LOCALE = process.env.LOCALE ?? 'es'
const OUT_DIR = path.resolve('visual-output/review')
const JOURNEY_COOKIE = 'ri_journey'

type CriminalRecordCertificateStatus =
	| 'already_have'
	| 'requested_waiting'
	| 'not_requested_yet'
	| 'not_sure'

type PreviousResidenceCountry = {
	countryCode: string
	certificateStatus?: CriminalRecordCertificateStatus
}

type VisualAnswers = Record<string, unknown>

type VisualPageGroup = 'public' | 'screener'
type VisualPageSection = 'public' | 'questions' | 'criminal-record' | 'results'

type VisualPage = {
	group: VisualPageGroup
	section: VisualPageSection
	name: string
	title: string
	pathname: string
	answers?: VisualAnswers
}

type CapturedVisual = {
	profile: string
	group: VisualPageGroup
	section: VisualPageSection
	name: string
	title: string
	pathname: string
	url: string
	screenshotPath: string
}

type VisualProfile = {
	name: string
	contextOptions: BrowserContextOptions
}

const visualProfiles = [
	{
		name: 'web',
		contextOptions: {
			viewport: {
				width: 1440,
				height: 1200
			}
		}
	},
	{ name: 'mobile', contextOptions: devices['iPhone 15'] }
] satisfies VisualProfile[]

const now = () => new Date().toISOString()

const makeJourneyState = (answers: VisualAnswers = {}) => ({
	sessionId: 'visual-qa-session',
	answers,
	updatedAt: now()
})

const baseAnswers: VisualAnswers = {
	presentBeforeCutoff: 'yes',
	asylumHistory: 'no',
	fiveMonthStay: 'yes',
	familySituation: ['none'],
	workSituation: ['worked_in_spain'],
	vulnerabilitySituation: ['none'],
	identityDocuments: ['current_passport'],
	previousResidenceCountries: [{ countryCode: 'ES' }],
	evidenceBeforeCutoff: ['padron_or_registration'],
	evidenceRecentMonths: ['housing_papers'],
	supportNeeds: ['none'],
	specialistFlags: ['none'],
	province: '28'
}

const asylumRouteAnswers: VisualAnswers = {
	presentBeforeCutoff: 'yes',
	asylumHistory: 'yes',
	asylumBeforeCutoff: 'yes',
	identityDocuments: ['asylum_document'],
	previousResidenceCountries: [{ countryCode: 'ES' }],
	evidenceBeforeCutoff: ['padron_or_registration'],
	evidenceRecentMonths: ['housing_papers'],
	asylumCaseDocuments: 'yes',
	supportNeeds: ['none'],
	specialistFlags: ['none'],
	province: '28'
}

const familyRouteAnswers: VisualAnswers = {
	...baseAnswers,
	workSituation: ['none'],
	familySituation: ['child_under_18'],
	vulnerabilitySituation: ['none']
}

const workRouteAnswers: VisualAnswers = {
	...baseAnswers,
	workSituation: ['worked_in_spain'],
	familySituation: ['none'],
	vulnerabilitySituation: ['none']
}

const vulnerabilityPositiveRouteAnswers: VisualAnswers = {
	...baseAnswers,
	workSituation: ['none'],
	familySituation: ['none'],
	vulnerabilitySituation: [VULNERABILITY_REASON_VALUES[0]]
}

const specialistReviewAnswers: VisualAnswers = {
	...baseAnswers,
	presentBeforeCutoff: 'not_sure',
	asylumHistory: 'no',
	fiveMonthStay: 'yes',
	workSituation: ['none'],
	familySituation: ['none'],
	vulnerabilitySituation: ['none'],
	identityDocuments: ['current_passport'],
	evidenceBeforeCutoff: ['padron_or_registration'],
	evidenceRecentMonths: ['housing_papers'],
	supportNeeds: ['specialist_advice'],
	specialistFlags: ['want_specialist']
}

const notThisProcessAnswers: VisualAnswers = {
	...baseAnswers,
	presentBeforeCutoff: 'no',
	asylumHistory: 'no',
	fiveMonthStay: 'yes',
	workSituation: ['none'],
	familySituation: ['none'],
	vulnerabilitySituation: ['none'],
	specialistFlags: ['none']
}

const criminalRecordActionAnswers: VisualAnswers = {
	...baseAnswers,
	previousResidenceCountries: [
		{ countryCode: 'ES' },
		{ countryCode: 'FR', certificateStatus: 'not_requested_yet' },
		{ countryCode: 'MA', certificateStatus: 'requested_waiting' },
		{ countryCode: 'CO', certificateStatus: 'already_have' },
		{ countryCode: 'AR', certificateStatus: 'not_sure' }
	] satisfies PreviousResidenceCountry[]
}

const ordinaryPages: VisualPage[] = [
	{
		group: 'screener',
		section: 'questions',
		name: '00-screener',
		title: 'Screener start',
		pathname: '/screener',
		answers: {}
	},
	{
		group: 'screener',
		section: 'questions',
		name: '01-presence-before-cutoff',
		title: 'Presence before cutoff',
		pathname: '/presence-before-cutoff'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '02-asylum-history',
		title: 'Asylum history',
		pathname: '/asylum-history'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '03-asylum-before-cutoff',
		title: 'Asylum before cutoff',
		pathname: '/asylum-before-cutoff',
		answers: { ...baseAnswers, asylumHistory: 'yes' }
	},
	{
		group: 'screener',
		section: 'questions',
		name: '04-five-month-stay',
		title: 'Five-month stay',
		pathname: '/five-month-stay'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '05-family-situation',
		title: 'Family situation',
		pathname: '/family-situation'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '06-work-situation',
		title: 'Work situation',
		pathname: '/work-situation'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '07-vulnerability-situation',
		title: 'Vulnerability situation',
		pathname: '/vulnerability-situation'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '08-identity-documents',
		title: 'Identity documents',
		pathname: '/identity-documents'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '09-previous-residence-countries',
		title: 'Previous residence countries',
		pathname: '/previous-residence-countries'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '11-evidence-before-cutoff',
		title: 'Evidence before cutoff',
		pathname: '/evidence-before-cutoff'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '12-evidence-recent-months',
		title: 'Evidence from recent months',
		pathname: '/evidence-recent-months'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '13-asylum-documents',
		title: 'Asylum documents',
		pathname: '/asylum-documents',
		answers: asylumRouteAnswers
	},
	{
		group: 'screener',
		section: 'questions',
		name: '14-support-needs',
		title: 'Support needs',
		pathname: '/support-needs'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '15-specialist-flags',
		title: 'Specialist flags',
		pathname: '/specialist-flags'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '16-province',
		title: 'Province',
		pathname: '/province'
	},
	{
		group: 'screener',
		section: 'questions',
		name: '17-check-answers',
		title: 'Check answers',
		pathname: '/check-answers',
		answers: criminalRecordActionAnswers
	}
]

const criminalRecordPages: VisualPage[] = [
	{
		group: 'screener',
		section: 'criminal-record',
		name: '10a-criminal-record-certificates-one-country',
		title: 'Criminal record certificates — one country',
		pathname: '/criminal-record-certificates',
		answers: {
			...baseAnswers,
			previousResidenceCountries: [{ countryCode: 'ES' }, { countryCode: 'FR' }]
		}
	},
	{
		group: 'screener',
		section: 'criminal-record',
		name: '10b-criminal-record-certificates-many-countries',
		title: 'Criminal record certificates — many countries',
		pathname: '/criminal-record-certificates',
		answers: {
			...baseAnswers,
			previousResidenceCountries: [
				{ countryCode: 'ES' },
				{ countryCode: 'FR' },
				{ countryCode: 'MA' },
				{ countryCode: 'CO' },
				{ countryCode: 'AR' }
			]
		}
	},
	{
		group: 'screener',
		section: 'criminal-record',
		name: '10c-criminal-record-certificates-prefilled',
		title: 'Criminal record certificates — prefilled',
		pathname: '/criminal-record-certificates',
		answers: criminalRecordActionAnswers
	}
]

const resultPages: VisualPage[] = [
	{
		group: 'screener',
		section: 'results',
		name: '18a-result-eligible-international-protection',
		title: 'Result — eligible through international protection',
		pathname: '/result',
		answers: asylumRouteAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18b-result-eligible-family-unit',
		title: 'Result — eligible through family unit',
		pathname: '/result',
		answers: familyRouteAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18c-result-eligible-work-or-intention',
		title: 'Result — eligible through work or intention',
		pathname: '/result',
		answers: workRouteAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18d-result-eligible-vulnerability',
		title: 'Result — eligible through vulnerability',
		pathname: '/result',
		answers: vulnerabilityPositiveRouteAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18e-result-needs-specialist-review',
		title: 'Result — needs specialist review',
		pathname: '/result',
		answers: specialistReviewAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18f-result-not-this-process',
		title: 'Result — not this process',
		pathname: '/result',
		answers: notThisProcessAnswers
	},
	{
		group: 'screener',
		section: 'results',
		name: '18g-result-criminal-record-actions',
		title: 'Result — criminal record actions',
		pathname: '/result',
		answers: criminalRecordActionAnswers
	}
]

async function prepareOutput() {
	await fs.rm(OUT_DIR, { recursive: true, force: true })
	await fs.mkdir(OUT_DIR, { recursive: true })
}

async function setJourneyState(context: BrowserContext, answers: VisualAnswers) {
	const url = new URL(BASE_URL)
	const state = makeJourneyState(answers)
	const value = JSON.stringify(state)

	await context.clearCookies()

	await context.addCookies([
		{
			name: JOURNEY_COOKIE,
			value,
			domain: url.hostname,
			path: '/',
			httpOnly: true,
			sameSite: 'Lax',
			secure: url.protocol === 'https:'
		}
	])

	const storedCookies = await context.cookies(BASE_URL)
	const storedJourneyCookie = storedCookies.find((cookie) => cookie.name === JOURNEY_COOKIE)

	console.log('[visual] set journey cookie', {
		baseUrl: BASE_URL,
		host: url.hostname,
		secure: url.protocol === 'https:',
		answerKeys: Object.keys(answers),
		state,
		rawValueLength: value.length,
		storedCookie: storedJourneyCookie
			? {
					name: storedJourneyCookie.name,
					domain: storedJourneyCookie.domain,
					path: storedJourneyCookie.path,
					httpOnly: storedJourneyCookie.httpOnly,
					secure: storedJourneyCookie.secure,
					sameSite: storedJourneyCookie.sameSite,
					valueLength: storedJourneyCookie.value.length,
					valueStart: storedJourneyCookie.value.slice(0, 120)
				}
			: null
	})
}

const localisedPathname = (pathname: string) => {
	if (pathname === '/') {
		return `/${LOCALE}`
	}

	return `/${LOCALE}${pathname}`
}

const pageUrl = (pathname: string) => `${BASE_URL}${localisedPathname(pathname)}`

const statefulPathnames = new Set(
	[...ordinaryPages, ...criminalRecordPages, ...resultPages].map(
		(visualPage) => visualPage.pathname
	)
)

const EXAMPLE_ORGANISATION_PATHNAME =
	'/organisations/aculco-asociacion-socio-cultural-y-de-cooperacion'

const manualPublicPages: VisualPage[] = [
	// Not currently in the sitemap, but useful for designer review.
	{
		group: 'public',
		section: 'public',
		name: 'certificate-draft',
		title: 'Certificate — draft form',
		pathname: '/certificate'
	}
]

const normalisePathname = (pathname: string) => {
	if (pathname.length > 1) {
		return pathname.replace(/\/+$/, '')
	}

	return pathname
}

const unlocalisePathname = (pathname: string) => {
	const normalisedPathname = normalisePathname(pathname)
	const localePrefix = `/${LOCALE}`

	if (normalisedPathname === localePrefix) {
		return '/'
	}

	if (normalisedPathname.startsWith(`${localePrefix}/`)) {
		return normalisePathname(normalisedPathname.slice(localePrefix.length))
	}

	return null
}

const slugToTitle = (slug: string) =>
	slug
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

const publicPageName = (pathname: string) => {
	if (pathname === '/') {
		return 'home'
	}

	return pathname
		.replace(/^\/+/, '')
		.replace(/\/+$/, '')
		.replaceAll('/', '-')
		.replace(/[^a-z0-9-]/gi, '-')
		.toLowerCase()
}

const publicPageTitle = (pathname: string) => {
	if (pathname === '/') {
		return 'Home'
	}

	if (pathname === '/organisations') {
		return 'Organisations directory'
	}

	const organisationMatch = pathname.match(/^\/organisations\/(.+)$/)

	if (organisationMatch) {
		return `Organisation profile — ${slugToTitle(organisationMatch[1])}`
	}

	return slugToTitle(pathname.replace(/^\/+/, '').replaceAll('/', ' '))
}

const isIncludedPublicPathname = (pathname: string) => {
	if (statefulPathnames.has(pathname)) {
		return false
	}

	return !pathname.startsWith('/organisations/') || pathname === EXAMPLE_ORGANISATION_PATHNAME
}

const getSitemapPublicPages = (): VisualPage[] => {
	const seenPathnames = new Set<string>()

	return getSitemapEntries()
		.map((entry) => unlocalisePathname(new URL(entry.url).pathname))
		.filter((pathname): pathname is string => pathname !== null)
		.filter(isIncludedPublicPathname)
		.filter((pathname) => {
			if (seenPathnames.has(pathname)) {
				return false
			}

			seenPathnames.add(pathname)
			return true
		})
		.map((pathname) => ({
			group: 'public' as const,
			section: 'public' as const,
			name: publicPageName(pathname),
			title: publicPageTitle(pathname),
			pathname
		}))
}

const getVisualPages = (): VisualPage[] => [
	...getSitemapPublicPages(),
	...manualPublicPages,
	...ordinaryPages,
	...criminalRecordPages,
	...resultPages
]

async function screenshot(page: Page, screenshotPath: string) {
	await fs.mkdir(path.dirname(screenshotPath), { recursive: true })

	await page.screenshot({
		path: screenshotPath,
		fullPage: true
	})
}

async function captureVisualPage(
	page: Page,
	context: BrowserContext,
	profile: VisualProfile,
	visualPage: VisualPage
): Promise<CapturedVisual> {
	if (visualPage.answers === undefined) {
		await context.clearCookies()
	} else {
		await setJourneyState(context, visualPage.answers)
	}

	const url = pageUrl(visualPage.pathname)

	console.log('[visual] visiting', {
		profile: profile.name,
		group: visualPage.group,
		name: visualPage.name,
		expectedPathname: visualPage.pathname,
		url
	})

	await page.goto(url)
	await page.waitForLoadState('networkidle')

	const finalPathname = new URL(page.url()).pathname
	const expectedPathname = localisedPathname(visualPage.pathname)

	console.log('[visual] visited', {
		profile: profile.name,
		group: visualPage.group,
		name: visualPage.name,
		finalUrl: page.url(),
		finalPathname
	})

	if (finalPathname !== expectedPathname && finalPathname !== `${expectedPathname}/`) {
		console.warn(`Expected ${expectedPathname}, but landed on ${finalPathname}. Capturing anyway.`)
	}

	const relativeScreenshotPath = path.join(profile.name, visualPage.group, `${visualPage.name}.png`)
	const absoluteScreenshotPath = path.join(OUT_DIR, relativeScreenshotPath)

	await screenshot(page, absoluteScreenshotPath)

	return {
		profile: profile.name,
		group: visualPage.group,
		section: visualPage.section,
		name: visualPage.name,
		title: visualPage.title,
		pathname: visualPage.pathname,
		url,
		screenshotPath: relativeScreenshotPath
	}
}

const escapeHtml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')

const sectionLabel = (section: VisualPageSection) => {
	switch (section) {
		case 'public':
			return 'Public pages'
		case 'questions':
			return 'Screener questions'
		case 'criminal-record':
			return 'Screener — criminal record certificates'
		case 'results':
			return 'Screener — results'
	}
}

const profileLabel = (profileName: string) => {
	switch (profileName) {
		case 'web':
			return 'Web'
		case 'mobile':
			return 'Mobile'
		default:
			return profileName
	}
}

async function writeManifest(capturedVisuals: CapturedVisual[]) {
	await fs.writeFile(
		path.join(OUT_DIR, 'manifest.json'),
		`${JSON.stringify(capturedVisuals, null, 2)}\n`
	)
}

async function writeHtmlGallery(capturedVisuals: CapturedVisual[]) {
	const sections = visualProfiles
		.map((profile) => {
			const profileVisuals = capturedVisuals.filter((visual) => visual.profile === profile.name)

			if (profileVisuals.length === 0) {
				return ''
			}

			const sections = [
				'public',
				'questions',
				'criminal-record',
				'results'
			] satisfies VisualPageSection[]

			const groupSections = sections
				.map((section) => {
					const groupVisuals = profileVisuals.filter((visual) => visual.section === section)

					if (groupVisuals.length === 0) {
						return ''
					}

					const cards = groupVisuals
						.map(
							(visual) => `
								<article class="card">
									<div class="card__body">
										<p class="eyebrow">${escapeHtml(profileLabel(visual.profile))}</p>
										<h3>${escapeHtml(visual.title)}</h3>
										<p class="meta">${escapeHtml(localisedPathname(visual.pathname))}</p>
									</div>
									<a class="preview" href="${escapeHtml(visual.screenshotPath)}">
										<img src="${escapeHtml(visual.screenshotPath)}" alt="${escapeHtml(
											`${visual.title} — ${profileLabel(visual.profile)}`
										)}" loading="lazy" />
									</a>
								</article>
							`
						)
						.join('\n')

					return `
						<section>
							<h2>${escapeHtml(profileLabel(profile.name))} — ${escapeHtml(sectionLabel(section))}</h2>
							<div class="grid">
								${cards}
							</div>
						</section>
					`
				})
				.join('\n')

			return `
				<section class="profile-section">
					<h1>${escapeHtml(profileLabel(profile.name))}</h1>
					${groupSections}
				</section>
			`
		})
		.join('\n')

	const html = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Primer Paso visual review</title>
		<style>
			:root {
				color-scheme: light;
				font-family:
					Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				background: #f5f5f2;
				color: #1f1f1b;
			}

			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				padding: 32px;
			}

			header {
				max-width: 960px;
				margin-block-end: 40px;
			}

			h1,
			h2,
			h3,
			p {
				margin-block-start: 0;
			}

			h1 {
				font-size: clamp(2rem, 4vw, 4rem);
				line-height: 1;
				letter-spacing: -0.04em;
				margin-block-end: 16px;
			}

			h2 {
				font-size: 1.5rem;
				margin-block: 40px 16px;
			}

			h3 {
				font-size: 1rem;
				line-height: 1.25;
				margin-block-end: 8px;
			}

			a {
				color: inherit;
			}

			.lede {
				color: #5f5f57;
				font-size: 1.125rem;
				line-height: 1.6;
				max-width: 70ch;
			}

			.profile-section {
				margin-block-end: 64px;
			}

			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
				gap: 24px;
			}

			.card {
				overflow: hidden;
				background: white;
				border: 1px solid rgb(0 0 0 / 8%);
				border-radius: 20px;
				box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
			}

			.card__body {
				padding: 16px 16px 12px;
			}

			.eyebrow {
				color: #76766e;
				font-size: 0.75rem;
				font-weight: 700;
				letter-spacing: 0.08em;
				text-transform: uppercase;
				margin-block-end: 8px;
			}

			.meta {
				color: #66665e;
				font-family:
					"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
				font-size: 0.8125rem;
				margin-block-end: 0;
			}

			.preview {
				display: block;
				max-height: 720px;
				overflow: auto;
				border-block-start: 1px solid rgb(0 0 0 / 8%);
				background: white;
			}

			.preview img {
				display: block;
				width: 100%;
				height: auto;
			}
		</style>
	</head>
	<body>
		<header>
			<h1>Primer Paso visual review</h1>
			<p class="lede">
				Designer-facing screenshot catalogue generated from ${escapeHtml(BASE_URL)} using locale
				${escapeHtml(LOCALE)}.
			</p>
		</header>

		${sections}
	</body>
</html>
`

	await fs.writeFile(path.join(OUT_DIR, 'index.html'), html)
}

async function run() {
	await prepareOutput()
	const browser = await chromium.launch()
	const visualPages = getVisualPages()
	const capturedVisuals: CapturedVisual[] = []

	try {
		for (const profile of visualProfiles) {
			const context = await browser.newContext(profile.contextOptions)
			const page = await context.newPage()

			try {
				for (const visualPage of visualPages) {
					capturedVisuals.push(await captureVisualPage(page, context, profile, visualPage))
				}
			} finally {
				await context.close()
			}
		}
	} finally {
		await browser.close()
	}

	await writeManifest(capturedVisuals)
	await writeHtmlGallery(capturedVisuals)

	console.log(`Wrote visual review catalogue to ${OUT_DIR}`)
}

run().catch((error) => {
	console.error(error)
	process.exit(1)
})
