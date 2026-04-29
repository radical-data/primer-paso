import { describe, expect, it } from 'vitest'

import { ar } from './ar'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { getTextDirection, renderReference, resolveLocale, translate } from './index'

describe('content localisation', () => {
	it('resolves supported locales and falls back safely', () => {
		expect(resolveLocale('es')).toBe('es')
		expect(resolveLocale('fr')).toBe('fr')
		expect(resolveLocale('nope')).toBe('es')
	})

	it('renders nested references in the requested locale', () => {
		expect(
			renderReference(
				{
					type: 'message',
					key: 'pages.handover.reference',
					values: { sessionId: 'ABC123' }
				},
				'es'
			)
		).toBe('Número de referencia: ABC123')
		expect(getTextDirection('ar')).toBe('rtl')
	})

	it('includes support labels in Spanish', () => {
		expect(translate('es', 'steps.support_needs.options.child_or_dependant_support')).toBe(
			'Ayuda también para niños, niñas o personas dependientes'
		)
		expect(translate('es', 'chrome.brand')).toBe('Primer Paso')
		expect(translate('fr', 'chrome.brand')).toBe('Primer Paso')
		expect(translate('en', 'chrome.skip_to_main')).toBe('Skip to main content')
		expect(translate('es', 'chrome.tagline')).toBe(
			'Orientación independiente para el proceso de regularización de España de 2026'
		)
		expect(translate('ar', 'chrome.brand')).toBe('Primer Paso')
		expect(translate('en', 'chrome.nav.home')).toBe('Home')
		expect(translate('es', 'chrome.nav.organisations')).toBe('Buscar organizaciones')
		expect(translate('fr', 'pages.home.title')).toBe('Choisissez comment commencer')
		expect(translate('ar', 'pages.organisations.title')).toBe('البحث عن جهة متعاونة')
		expect(translate('en', 'pages.organisations.summary.many', { count: '4' })).toBe(
			'4 organisations found'
		)
		expect(translate('en', 'chrome.meta_description')).toContain('primerpaso.org')
	})

	it('fully implements the Spanish translation set', () => {
		expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort())
	})

	it('fully implements the French translation set', () => {
		expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort())
	})

	it('fully implements the Arabic translation set', () => {
		expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort())
	})
})
