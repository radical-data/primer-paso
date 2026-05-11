import type { Cookies } from '@sveltejs/kit'
import { PROVINCE_VALUES } from '$lib/generated/provinces'
import type { JourneyAnswers, JourneyState } from '$lib/journey/types'
import {
	COMPLETION_MODE_VALUES,
	EVIDENCE_BEFORE_CUTOFF_VALUES,
	EVIDENCE_RECENT_VALUES,
	FAMILY_SITUATION_VALUES,
	FIVE_MONTH_STAY_VALUES,
	IDENTITY_DOCUMENT_VALUES,
	LANGUAGE_VALUES,
	SPECIALIST_FLAG_VALUES,
	SUPPORT_NEED_VALUES,
	VULNERABILITY_SITUATION_VALUES,
	WORK_SITUATION_VALUES,
	YES_NO_NOT_SURE_VALUES
} from '$lib/journey/types'
import type { PublicCertificateDraftState } from './certificate'

const JOURNEY_COOKIE = 'ri_journey'
const THIRTY_DAYS = 60 * 60 * 24 * 30

const safeRelativePath = (value: string | null, fallback: string) => {
	if (value === '/certificate/check') return value
	if (value === '/certificate/handoff') return value
	if (value === '/result') {
		return fallback
	}

	if (!value?.startsWith('/') || value.startsWith('//')) {
		return fallback
	}

	return value
}

const createEmptyState = (): JourneyState => ({
	sessionId: crypto.randomUUID(),
	answers: {},
	updatedAt: new Date().toISOString()
})

const isEnumValue =
	<T extends string>(values: readonly T[]) =>
	(value: unknown): value is T =>
		typeof value === 'string' && values.includes(value as T)

const isLanguageValue = isEnumValue(LANGUAGE_VALUES)
const isCompletionModeValue = isEnumValue(COMPLETION_MODE_VALUES)
const isYesNoNotSureValue = isEnumValue(YES_NO_NOT_SURE_VALUES)
const isFiveMonthStayValue = isEnumValue(FIVE_MONTH_STAY_VALUES)
const isWorkSituationValue = isEnumValue(WORK_SITUATION_VALUES)
const isFamilySituationValue = isEnumValue(FAMILY_SITUATION_VALUES)
const isVulnerabilitySituationValue = isEnumValue(VULNERABILITY_SITUATION_VALUES)
const isIdentityDocumentValue = isEnumValue(IDENTITY_DOCUMENT_VALUES)
const isEvidenceBeforeCutoffValue = isEnumValue(EVIDENCE_BEFORE_CUTOFF_VALUES)
const isEvidenceRecentValue = isEnumValue(EVIDENCE_RECENT_VALUES)
const isSpecialistFlagValue = isEnumValue(SPECIALIST_FLAG_VALUES)
const isProvinceValue = isEnumValue(PROVINCE_VALUES)
const isSupportNeedValue = isEnumValue(SUPPORT_NEED_VALUES)

const isStringArrayOf = <T extends string>(
	value: unknown,
	itemGuard: (entry: unknown) => entry is T
): value is T[] => Array.isArray(value) && value.every(itemGuard)

const isPublicCertificateDraftState = (value: unknown): value is PublicCertificateDraftState =>
	Boolean(value) && typeof value === 'object'

const isJourneyState = (value: unknown): value is JourneyState => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const candidate = value as Record<string, unknown>
	const answers = (candidate.answers ?? {}) as Record<string, unknown>

	return (
		typeof candidate.sessionId === 'string' &&
		(candidate.certificateDraft === undefined ||
			isPublicCertificateDraftState(candidate.certificateDraft)) &&
		typeof candidate.updatedAt === 'string' &&
		(candidate.answers === undefined || typeof candidate.answers === 'object') &&
		(answers.language === undefined || isLanguageValue(answers.language)) &&
		(answers.completionMode === undefined || isCompletionModeValue(answers.completionMode)) &&
		(answers.presentBeforeCutoff === undefined ||
			isYesNoNotSureValue(answers.presentBeforeCutoff)) &&
		(answers.asylumHistory === undefined || isYesNoNotSureValue(answers.asylumHistory)) &&
		(answers.asylumBeforeCutoff === undefined || isYesNoNotSureValue(answers.asylumBeforeCutoff)) &&
		(answers.fiveMonthStay === undefined || isFiveMonthStayValue(answers.fiveMonthStay)) &&
		(answers.asylumCaseDocuments === undefined ||
			isYesNoNotSureValue(answers.asylumCaseDocuments)) &&
		(answers.workSituation === undefined ||
			isStringArrayOf(answers.workSituation, isWorkSituationValue)) &&
		(answers.familySituation === undefined ||
			isStringArrayOf(answers.familySituation, isFamilySituationValue)) &&
		(answers.vulnerabilitySituation === undefined ||
			isStringArrayOf(answers.vulnerabilitySituation, isVulnerabilitySituationValue)) &&
		(answers.identityDocuments === undefined ||
			isStringArrayOf(answers.identityDocuments, isIdentityDocumentValue)) &&
		(answers.evidenceBeforeCutoff === undefined ||
			isStringArrayOf(answers.evidenceBeforeCutoff, isEvidenceBeforeCutoffValue)) &&
		(answers.evidenceRecentMonths === undefined ||
			isStringArrayOf(answers.evidenceRecentMonths, isEvidenceRecentValue)) &&
		(answers.specialistFlags === undefined ||
			isStringArrayOf(answers.specialistFlags, isSpecialistFlagValue)) &&
		(answers.province === undefined || isProvinceValue(answers.province)) &&
		(answers.supportNeeds === undefined ||
			isStringArrayOf(answers.supportNeeds, isSupportNeedValue))
	)
}

const isMeaningfulAnswer = (value: unknown) =>
	Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null

export const hasStartedJourney = (answers: JourneyAnswers) => {
	// `language` used to be collected as a screener answer. It is now controlled
	// by the locale/navbar, so it must not make an otherwise empty journey look
	// started.
	const { language: _legacyLanguage, ...screenerAnswers } = answers

	return Object.values(screenerAnswers).some(isMeaningfulAnswer)
}

const shouldDebugJourneyCookie = () =>
	process.env.DEBUG_JOURNEY_COOKIE === '1' || process.env.DEBUG_VISUAL_SCREENER === '1'

const debugJourneyCookie = (message: string, details: Record<string, unknown> = {}) => {
	if (!shouldDebugJourneyCookie()) return

	console.log(`[journey-cookie] ${message}`, details)
}

export const getJourneyState = (cookies: Cookies) => {
	const raw = cookies.get(JOURNEY_COOKIE)

	if (!raw) {
		debugJourneyCookie('missing cookie', {
			cookieName: JOURNEY_COOKIE
		})

		return createEmptyState()
	}

	debugJourneyCookie('raw cookie found', {
		cookieName: JOURNEY_COOKIE,
		rawLength: raw.length,
		rawStart: raw.slice(0, 160)
	})

	try {
		const parsed = JSON.parse(raw)
		const valid = isJourneyState(parsed)

		debugJourneyCookie('parsed cookie', {
			valid,
			parsedType: typeof parsed,
			sessionId:
				parsed && typeof parsed === 'object'
					? (parsed as Record<string, unknown>).sessionId
					: undefined,
			updatedAt:
				parsed && typeof parsed === 'object'
					? (parsed as Record<string, unknown>).updatedAt
					: undefined,
			answerKeys:
				parsed &&
				typeof parsed === 'object' &&
				(parsed as Record<string, unknown>).answers &&
				typeof (parsed as Record<string, unknown>).answers === 'object'
					? Object.keys((parsed as Record<string, Record<string, unknown>>).answers)
					: undefined,
			answers:
				parsed && typeof parsed === 'object'
					? (parsed as Record<string, unknown>).answers
					: undefined
		})

		if (valid) return parsed

		debugJourneyCookie('cookie failed journey state validation')

		return createEmptyState()
	} catch (error) {
		debugJourneyCookie('cookie JSON parse failed', {
			error: error instanceof Error ? error.message : String(error)
		})

		return createEmptyState()
	}
}

export const setJourneyState = (cookies: Cookies, state: JourneyState) => {
	cookies.set(JOURNEY_COOKIE, JSON.stringify(state), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: THIRTY_DAYS
	})
}

export const updateJourneyAnswers = (cookies: Cookies, answers: Partial<JourneyAnswers>) => {
	const current = getJourneyState(cookies)

	const next: JourneyState = {
		...current,
		answers: {
			...current.answers,
			...answers
		},
		updatedAt: new Date().toISOString()
	}

	setJourneyState(cookies, next)

	return next
}

export const updateCertificateDraft = (
	cookies: Cookies,
	certificateDraft: PublicCertificateDraftState
) => {
	const current = getJourneyState(cookies)
	const next: JourneyState = {
		...current,
		certificateDraft,
		updatedAt: new Date().toISOString()
	}
	setJourneyState(cookies, next)
	return next
}

export const clearJourneyState = (cookies: Cookies) => {
	cookies.delete(JOURNEY_COOKIE, {
		path: '/'
	})
}

export const getSafeReturnTo = (url: URL, fallback: string) => {
	const returnTo = url.searchParams.get('returnTo')
	if (!returnTo) return undefined

	return safeRelativePath(returnTo, fallback)
}

export const resolveReturnTo = (candidate: FormDataEntryValue | null, fallback: string) =>
	safeRelativePath(typeof candidate === 'string' ? candidate : null, fallback)
