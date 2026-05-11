import countries from 'i18n-iso-countries'
import ar from 'i18n-iso-countries/langs/ar.json'
import en from 'i18n-iso-countries/langs/en.json'
import es from 'i18n-iso-countries/langs/es.json'
import fr from 'i18n-iso-countries/langs/fr.json'

countries.registerLocale(en)
countries.registerLocale(es)
countries.registerLocale(fr)
countries.registerLocale(ar)

export interface Country {
	code: string
	name: string
}

export type CountryLocale = 'en' | 'es' | 'fr' | 'ar'
export const DEFAULT_COUNTRY_LOCALE: CountryLocale = 'en'

export const getCountries = (locale: CountryLocale = DEFAULT_COUNTRY_LOCALE): Country[] =>
	Object.entries(countries.getNames(locale, { select: 'official' }))
		.map(([code, name]) => ({
			code,
			name
		}))
		.sort((a, b) => a.name.localeCompare(b.name, locale))

export const getCountryName = (
	countryCode: string,
	locale: CountryLocale = DEFAULT_COUNTRY_LOCALE
) => {
	const normalisedCountryCode = countryCode.toUpperCase()
	return (
		countries.getName(normalisedCountryCode, locale, { select: 'official' }) ??
		countries.getName(normalisedCountryCode, DEFAULT_COUNTRY_LOCALE, { select: 'official' }) ??
		normalisedCountryCode
	)
}

export const getForeignCountries = (locale: CountryLocale = DEFAULT_COUNTRY_LOCALE): Country[] =>
	getCountries(locale).filter((country) => country.code !== 'ES')

export const isValidPreviousResidenceCountryCode = (countryCode: string) =>
	countries.isValid(countryCode.toUpperCase())
