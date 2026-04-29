import { ar } from './ar'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'

export type MessageKey = keyof typeof en
export type Locale = 'en' | 'es' | 'fr' | 'ar'
export const SUPPORTED_LOCALES = ['es', 'en', 'fr', 'ar'] as const

export interface MessageReference {
	type: 'message'
	key: MessageKey
	values?: Record<string, string | MessageReference | RawReference>
}

export interface RawReference {
	type: 'raw'
	value: string
}

export type FormattedReference = MessageReference | RawReference

const messages: Record<Locale, Partial<Record<MessageKey, string>>> = {
	en,
	es,
	fr,
	ar
}

const RTL_LOCALES = new Set<Locale>(['ar'])

export const DEFAULT_LOCALE: Locale = 'es'

export const isLocale = (value?: string | null): value is Locale =>
	value === 'es' || value === 'en' || value === 'fr' || value === 'ar'

export const resolveLocale = (value?: string | null): Locale => {
	if (isLocale(value)) {
		return value
	}
	return DEFAULT_LOCALE
}

export const getTextDirection = (locale: Locale): 'rtl' | 'ltr' =>
	RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'

const interpolate = (template: string, values?: Record<string, string>) => {
	if (!values) {
		return template
	}

	return template.replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? `{${name}}`)
}

export const translate = (
	locale: Locale,
	key: MessageKey,
	values?: Record<string, string>
): string => {
	const template = messages[locale][key] ?? en[key] ?? key
	return interpolate(template, values)
}

export const getTranslator = (locale: Locale) => {
	return (key: MessageKey, values?: Record<string, string>) => translate(locale, key, values)
}

export const t = (key: MessageKey, values?: Record<string, string>) => {
	return translate(DEFAULT_LOCALE, key, values)
}

const renderReferenceWithLocale = (reference: FormattedReference, locale: Locale): string => {
	if (reference.type === 'raw') {
		return reference.value
	}

	const values = reference.values
		? Object.fromEntries(
				Object.entries(reference.values).map(([name, value]) => [
					name,
					typeof value === 'string'
						? value
						: value.type === 'raw'
							? value.value
							: renderReferenceWithLocale(value, locale)
				])
			)
		: undefined

	return translate(locale, reference.key, values)
}

export const renderReference = (reference: FormattedReference, locale: Locale = DEFAULT_LOCALE) =>
	renderReferenceWithLocale(reference, locale)
