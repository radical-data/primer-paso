import { describe, expect, it } from 'vitest'

import type { JourneyAnswers } from '$lib/journey/types'

import { journeySteps, resolveStepTarget } from './config'
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
})
