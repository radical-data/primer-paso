import { describe, expect, it } from 'vitest'

import { runTriage } from './engine'

describe('runTriage', () => {
	it('routes out when the person was not living in Spain before the cutoff', () => {
		const result = runTriage({
			presentBeforeCutoff: 'no'
		})

		expect(result.resultState).toBe('another_route_may_fit_better')
	})

	it('returns not enough information when the core timeline is uncertain', () => {
		const result = runTriage({
			presentBeforeCutoff: 'not_sure',
			asylumBeforeCutoff: 'not_sure',
			fiveMonthStay: 'not_sure'
		})

		expect(result.resultState).toBe('not_enough_information_yet')
		expect(result.flags).toContain('result.flag.uncertain_timeline')
	})

	it('returns specialist review when the person left Spain during the 5-month period', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'left_spain',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['padron_or_registration'],
			evidenceRecentMonths: ['housing_papers']
		})
		expect(result.resultState).toBe('needs_specialist_review')
		expect(result.flags).toContain('result.flag.five_month_requirement_risk')
		expect(result.flags).toContain('result.flag.continuity_concern')
	})
	it('returns specialist review for criminal record concern', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			specialistFlags: ['criminal_record_worry']
		})

		expect(result.resultState).toBe('needs_specialist_review')
	})

	it('adds a family-support flag when extra dependant support is needed', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['padron_or_registration'],
			evidenceRecentMonths: ['housing_papers'],
			supportNeeds: ['child_or_dependant_support']
		})

		expect(result.resultState).toBe('likely_in_scope')
		expect(result.flags).toContain('result.flag.family_support_needs')
	})

	it('returns specialist review for safeguarding and urgent-support flags', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			specialistFlags: ['unsafe_sharing_digitally']
		})

		expect(result.resultState).toBe('needs_specialist_review')
	})

	it('returns evidence weak when timing fits but papers are thin', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['organisation_or_church_letter'],
			evidenceRecentMonths: ['travel_or_dated_receipts']
		})

		expect(result.resultState).toBe('possible_but_needs_more_evidence')
	})

	it('returns likely in scope when the person was in Spain before the cutoff and has strong evidence', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumBeforeCutoff: 'no',
			fiveMonthStay: 'yes',
			identityDocuments: ['current_passport'],
			evidenceBeforeCutoff: ['padron_or_registration', 'work_papers'],
			evidenceRecentMonths: ['housing_papers', 'bank_or_money_transfer']
		})

		expect(result.resultState).toBe('likely_in_scope')
	})
})
