const ELIGIBILITY_KEY = 'pp:home:eligibility'
const SUBMISSION_KEY = 'pp:home:submission'
const DOCS_KEY = 'pp:home:docs'

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readBool = (key: string): boolean => {
	if (!isBrowser()) return false
	return window.localStorage.getItem(key) === 'true'
}

const writeBool = (key: string, value: boolean) => {
	if (!isBrowser()) return
	try {
		window.localStorage.setItem(key, value ? 'true' : 'false')
	} catch {
		// localStorage may be disabled (private mode, quota, etc.) — fail silently
	}
}

const readJson = <T>(key: string, fallback: T): T => {
	if (!isBrowser()) return fallback
	try {
		const raw = window.localStorage.getItem(key)
		if (!raw) return fallback
		const parsed = JSON.parse(raw)
		return parsed && typeof parsed === 'object' ? (parsed as T) : fallback
	} catch {
		return fallback
	}
}

const writeJson = (key: string, value: unknown) => {
	if (!isBrowser()) return
	try {
		window.localStorage.setItem(key, JSON.stringify(value))
	} catch {
		// localStorage may be disabled (private mode, quota, etc.) — fail silently
	}
}

export const loadEligibility = (): boolean => readBool(ELIGIBILITY_KEY)
export const setEligibility = (value: boolean) => writeBool(ELIGIBILITY_KEY, value)
export const markEligibilityChecked = () => {
	if (!loadEligibility()) writeBool(ELIGIBILITY_KEY, true)
}

export const loadSubmission = (): boolean => readBool(SUBMISSION_KEY)
export const setSubmission = (value: boolean) => writeBool(SUBMISSION_KEY, value)

export const loadDocs = (): Record<string, boolean> =>
	readJson<Record<string, boolean>>(DOCS_KEY, {})

export const setDoc = (key: string, value: boolean): Record<string, boolean> => {
	const next = { ...loadDocs(), [key]: value }
	writeJson(DOCS_KEY, next)
	return next
}
