import { describe, expect, it } from 'vitest'

import { en } from './en'
import { es } from './es'
import { getTextDirection, renderReference, resolveLocale, translate } from './index'

describe('content localisation', () => {
	it('resolves supported locales and falls back safely', () => {
		expect(resolveLocale('es')).toBe('es')
		expect(resolveLocale('nope')).toBe('en')
	})

	it('falls back to English when a locale is missing a key', () => {
		expect(translate('fr', 'pages.start.title')).toBe(
			'Check what support you may need for the regularisation process'
		)
	})

	it('renders nested references in the requested locale', () => {
		expect(
			renderReference(
				{
					type: 'message',
					key: 'answers.residence_start.2025_month',
					values: { month: { type: 'message', key: 'months.january' } }
				},
				'es'
			)
		).toBe('Enero de 2025')
		expect(getTextDirection('ar')).toBe('rtl')
	})

	it('includes new contact and support labels in Spanish', () => {
		expect(translate('es', 'steps.contact.options.do_not_contact_yet')).toBe(
			'No me contacten todavía'
		)
		expect(translate('es', 'steps.support_needs.options.child_or_dependant_support')).toBe(
			'Ayuda también para niños, niñas o personas dependientes'
		)
	})

	it('fully implements the Spanish translation set', () => {
		expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort())
	})
})
