const STEPS_KEY = 'pp:home:steps'
const DOCS_KEY = 'pp:home:docs'

export interface StepState {
	eligibility: boolean
	documents: boolean
	submission: boolean
}

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

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

export const loadSteps = (): StepState => {
	const raw = readJson<Partial<StepState>>(STEPS_KEY, {})
	return {
		eligibility: raw.eligibility === true,
		documents: raw.documents === true,
		submission: raw.submission === true
	}
}

export const setStep = (key: keyof StepState, value: boolean): StepState => {
	const next = { ...loadSteps(), [key]: value }
	writeJson(STEPS_KEY, next)
	return next
}

export const markEligibilityChecked = () => {
	const current = loadSteps()
	if (current.eligibility) return
	writeJson(STEPS_KEY, { ...current, eligibility: true })
}

export const loadDocs = (): Record<string, boolean> =>
	readJson<Record<string, boolean>>(DOCS_KEY, {})

export const setDoc = (key: string, value: boolean): Record<string, boolean> => {
	const next = { ...loadDocs(), [key]: value }
	writeJson(DOCS_KEY, next)
	return next
}
