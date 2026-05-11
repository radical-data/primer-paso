import { describe, expect, it } from 'vitest'

import type { JourneyAnswers } from '$lib/journey/types'

import { getJourneyStep, journeySteps, resolveStepTarget } from './config'
import { fieldAdapters } from './field-adapters'

const scenarios: JourneyAnswers[] = [
	{},
	{ presentBeforeCutoff: 'yes' },
	{ presentBeforeCutoff: 'no' },
	{ asylumHistory: 'yes' },
	{ asylumHistory: 'no' },
	{ asylumHistory: 'yes', asylumBeforeCutoff: 'yes' },
	{ asylumBeforeCutoff: 'yes' },
	{ asylumBeforeCutoff: 'no' }
]

const allowedAbsoluteRoutes = new Set(['/check-answers', '/result', '/screener'])
const knownStepRoutes = new Set(journeySteps.map((step) => `/${step.slug}`))

describe('journey config', () => {
	it('has unique ids and slugs', () => {
		expect(new Set(journeySteps.map((step) => step.id)).size).toBe(journeySteps.length)
		expect(new Set(journeySteps.map((step) => step.slug)).size).toBe(journeySteps.length)
	})

	it('has adapters for every step', () => {
		for (const step of journeySteps) {
			expect(fieldAdapters[step.adapter]).toBeDefined()
		}
	})

	it('declares options for choice-based steps', () => {
		for (const step of journeySteps) {
			if (step.adapter === 'country-certificate-status') continue
			expect(step.options.length > 0).toBe(true)
		}
	})

	it('resolves step targets to known step routes or allowed absolute routes', () => {
		for (const step of journeySteps) {
			for (const scenario of scenarios) {
				for (const target of [
					resolveStepTarget(step.back, scenario),
					resolveStepTarget(step.next, scenario)
				]) {
					expect(target.startsWith('/')).toBe(true)
					expect(knownStepRoutes.has(target) || allowedAbsoluteRoutes.has(target)).toBe(true)
				}
			}
		}
	})

	it('gives guarded steps a redirect target', () => {
		for (const step of journeySteps) {
			if (step.guard) {
				expect(step.redirectIfGuardFails).toBeDefined()
			}
		}
	})

	it('uses applicant-facing vulnerability labels in the screener', () => {
		const step = getJourneyStep('vulnerability-situation')
		expect(step && 'options' in step ? step.options : []).toContainEqual({
			value: 'insufficient_income',
			labelKey: 'vulnerability.applicant.insufficient_income'
		})
	})
})

describe('journey route order', () => {
	const expectStepTarget = (slug: string, answers: JourneyAnswers, expectedTarget: string) => {
		const step = getJourneyStep(slug)

		expect(step).toBeDefined()
		if (!step) return

		expect(resolveStepTarget(step.next, answers)).toBe(expectedTarget)
	}

	it('asks asylum history after presence before cut-off', () => {
		expectStepTarget('presence-before-cutoff', {}, '/asylum-history')
	})

	it('sends non-asylum users to five-month stay', () => {
		expectStepTarget('asylum-history', { asylumHistory: 'no' }, '/five-month-stay')
	})

	it('sends pre-cutoff asylum users to identity documents', () => {
		expectStepTarget(
			'asylum-before-cutoff',
			{ asylumHistory: 'yes', asylumBeforeCutoff: 'yes' },
			'/identity-documents'
		)
	})

	it('sends other users from five-month stay to family situation', () => {
		expectStepTarget('five-month-stay', {}, '/family-situation')
	})

	it('asks vulnerability after work', () => {
		expectStepTarget('work-situation', {}, '/vulnerability-situation')
	})

	it('asks province when the vulnerability route is recommended', () => {
		expectStepTarget(
			'specialist-flags',
			{
				presentBeforeCutoff: 'yes',
				asylumHistory: 'no',
				fiveMonthStay: 'yes',
				familySituation: ['none'],
				workSituation: ['none'],
				vulnerabilitySituation: ['insufficient_income']
			},
			'/province'
		)
	})

	it('skips province when specialist review is recommended and no vulnerability route', () => {
		expectStepTarget(
			'specialist-flags',
			{
				presentBeforeCutoff: 'yes',
				asylumHistory: 'no',
				fiveMonthStay: 'yes',
				familySituation: ['none'],
				workSituation: ['none'],
				vulnerabilitySituation: ['none']
			},
			'/check-answers'
		)
	})

	it('asks province when registered entity online submission path applies', () => {
		expectStepTarget(
			'specialist-flags',
			{
				presentBeforeCutoff: 'yes',
				asylumHistory: 'no',
				fiveMonthStay: 'yes',
				familySituation: ['child_under_18'],
				workSituation: ['none'],
				vulnerabilitySituation: ['none'],
				specialistFlags: ['none'],
				previousResidenceCountries: [
					{
						countryCode: 'CO',
						certificateStatus: 'already_have'
					}
				]
			},
			'/province'
		)
	})

	it('routes identity-documents to previous-residence-countries', () => {
		expectStepTarget('identity-documents', {}, '/previous-residence-countries')
	})

	it('routes previous-residence-countries to evidence-before-cutoff when only Spain is selected', () => {
		expectStepTarget(
			'previous-residence-countries',
			{ previousResidenceCountries: [{ countryCode: 'ES' }] },
			'/evidence-before-cutoff'
		)
	})

	it('routes previous-residence-countries to criminal-record-certificates when a foreign country is selected', () => {
		expectStepTarget(
			'previous-residence-countries',
			{
				previousResidenceCountries: [{ countryCode: 'ES' }, { countryCode: 'CO' }]
			},
			'/criminal-record-certificates'
		)
	})

	it('routes criminal-record-certificates to evidence-before-cutoff', () => {
		expectStepTarget('criminal-record-certificates', {}, '/evidence-before-cutoff')
	})

	it('routes evidence-before-cutoff back to previous-residence-countries when only Spain is selected', () => {
		const step = getJourneyStep('evidence-before-cutoff')
		expect(step).toBeDefined()
		if (!step) return
		expect(
			resolveStepTarget(step.back, {
				previousResidenceCountries: [{ countryCode: 'ES' }]
			})
		).toBe('/previous-residence-countries')
	})

	it('routes evidence-before-cutoff back to criminal-record-certificates when a foreign country is selected', () => {
		const step = getJourneyStep('evidence-before-cutoff')
		expect(step).toBeDefined()
		if (!step) return
		expect(
			resolveStepTarget(step.back, {
				previousResidenceCountries: [{ countryCode: 'ES' }, { countryCode: 'CO' }]
			})
		).toBe('/criminal-record-certificates')
	})
})
