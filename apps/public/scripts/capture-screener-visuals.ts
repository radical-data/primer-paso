import fs from 'node:fs/promises'
import path from 'node:path'
import { type BrowserContext, chromium, type Page } from '@playwright/test'
import { VULNERABILITY_REASON_VALUES } from '@primer-paso/certificate'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const LOCALE = process.env.LOCALE ?? 'es'
const OUT_DIR = path.resolve('visual-output/screener')
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

type VisualVariant = {
	name: string
	pathname: string
	answers?: VisualAnswers
}

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

const ordinaryPages: VisualVariant[] = [
	{ name: '00-screener', pathname: '/screener', answers: {} },
	{ name: '01-presence-before-cutoff', pathname: '/presence-before-cutoff' },
	{ name: '02-asylum-history', pathname: '/asylum-history' },
	{
		name: '03-asylum-before-cutoff',
		pathname: '/asylum-before-cutoff',
		answers: { ...baseAnswers, asylumHistory: 'yes' }
	},
	{ name: '04-five-month-stay', pathname: '/five-month-stay' },
	{ name: '05-family-situation', pathname: '/family-situation' },
	{ name: '06-work-situation', pathname: '/work-situation' },
	{ name: '07-vulnerability-situation', pathname: '/vulnerability-situation' },
	{ name: '08-identity-documents', pathname: '/identity-documents' },
	{
		name: '09-previous-residence-countries',
		pathname: '/previous-residence-countries'
	},
	{ name: '11-evidence-before-cutoff', pathname: '/evidence-before-cutoff' },
	{ name: '12-evidence-recent-months', pathname: '/evidence-recent-months' },
	{
		name: '13-asylum-documents',
		pathname: '/asylum-documents',
		answers: asylumRouteAnswers
	},
	{ name: '14-support-needs', pathname: '/support-needs' },
	{ name: '15-specialist-flags', pathname: '/specialist-flags' },
	{ name: '16-province', pathname: '/province' },
	{
		name: '17-check-answers',
		pathname: '/check-answers',
		answers: criminalRecordActionAnswers
	}
]

const criminalRecordPages: VisualVariant[] = [
	{
		name: '10a-criminal-record-certificates-one-country',
		pathname: '/criminal-record-certificates',
		answers: {
			...baseAnswers,
			previousResidenceCountries: [{ countryCode: 'ES' }, { countryCode: 'FR' }]
		}
	},
	{
		name: '10b-criminal-record-certificates-many-countries',
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
		name: '10c-criminal-record-certificates-prefilled',
		pathname: '/criminal-record-certificates',
		answers: criminalRecordActionAnswers
	}
]

const resultPages: VisualVariant[] = [
	{
		name: '18a-result-eligible-international-protection',
		pathname: '/result',
		answers: asylumRouteAnswers
	},
	{
		name: '18b-result-eligible-family-unit',
		pathname: '/result',
		answers: familyRouteAnswers
	},
	{
		name: '18c-result-eligible-work-or-intention',
		pathname: '/result',
		answers: workRouteAnswers
	},
	{
		name: '18d-result-eligible-vulnerability',
		pathname: '/result',
		answers: vulnerabilityPositiveRouteAnswers
	},
	{
		name: '18e-result-needs-specialist-review',
		pathname: '/result',
		answers: specialistReviewAnswers
	},
	{
		name: '18f-result-not-this-process',
		pathname: '/result',
		answers: notThisProcessAnswers
	},
	{
		name: '18g-result-criminal-record-actions',
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

	console.log('[visual:screener] set journey cookie', {
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

async function screenshot(page: Page, name: string) {
	await page.screenshot({
		path: path.join(OUT_DIR, `${name}.png`),
		fullPage: true
	})
}

async function captureVariant(page: Page, context: BrowserContext, variant: VisualVariant) {
	const answers = variant.answers ?? baseAnswers
	await setJourneyState(context, answers)

	console.log('[visual:screener] visiting', {
		name: variant.name,
		expectedPathname: variant.pathname,
		url: `${BASE_URL}/${LOCALE}${variant.pathname}`
	})

	await page.goto(`${BASE_URL}/${LOCALE}${variant.pathname}`)
	await page.waitForLoadState('networkidle')

	const finalPathname = new URL(page.url()).pathname

	console.log('[visual:screener] visited', {
		name: variant.name,
		finalUrl: page.url(),
		finalPathname
	})

	if (!finalPathname.endsWith(`/${LOCALE}${variant.pathname}`)) {
		console.warn(`Expected ${variant.pathname}, but landed on ${finalPathname}. Capturing anyway.`)
	}
	await screenshot(page, variant.name)
}

async function run() {
	await prepareOutput()
	const browser = await chromium.launch()
	const context = await browser.newContext({
		viewport: {
			width: 1440,
			height: 1200
		}
	})
	const page = await context.newPage()

	for (const variant of [...ordinaryPages, ...criminalRecordPages, ...resultPages]) {
		await captureVariant(page, context, variant)
	}

	await browser.close()
	console.log(`Wrote screener screenshots to ${OUT_DIR}`)
}

run().catch((error) => {
	console.error(error)
	process.exit(1)
})
