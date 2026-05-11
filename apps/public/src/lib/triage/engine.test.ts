import { describe, expect, it } from 'vitest'

import { runTriage } from './engine'

describe('runTriage', () => {
	it('recommends the international protection route', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'yes',
			asylumBeforeCutoff: 'yes'
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('international_protection')
		expect(result.possibleEligibilityRoutes).toEqual(['international_protection'])
	})

	it('recommends family before work and vulnerability', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['job_offer'],
			vulnerabilitySituation: ['homelessness_or_precarious_housing']
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('family_unit')
		expect(result.possibleEligibilityRoutes).toEqual([
			'family_unit',
			'work_or_intention',
			'vulnerability'
		])
	})

	it('recommends work when family is not selected', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['none'],
			workSituation: ['want_to_work_for_myself'],
			vulnerabilitySituation: ['none']
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('work_or_intention')
		expect(result.possibleEligibilityRoutes).toEqual(['work_or_intention'])
	})

	it('recommends vulnerability when it is the only positive route', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['none'],
			workSituation: ['none'],
			vulnerabilitySituation: ['insufficient_income']
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('vulnerability')
		expect(result.possibleEligibilityRoutes).toEqual(['vulnerability'])
	})

	it('returns needs_specialist_review when the person left Spain during the five-month period', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'left_spain'
		})

		expect(result.resultState).toBe('needs_specialist_review')
		expect(result.recommendedEligibilityRoute).toBe('needs_specialist_review')
		expect(result.reasonKey).toBe('result.reason.five_month_stay_not_met')
	})

	it('returns not_this_process when the cut-off presence condition fails', () => {
		const result = runTriage({
			presentBeforeCutoff: 'no'
		})

		expect(result.resultState).toBe('not_this_process')
		expect(result.recommendedEligibilityRoute).toBe('not_this_process')
	})

	it('returns specialist review when no positive route is selected', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['none'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none']
		})

		expect(result.resultState).toBe('needs_specialist_review')
		expect(result.recommendedEligibilityRoute).toBe('needs_specialist_review')
		expect(result.possibleEligibilityRoutes).toEqual([])
	})

	it('does not treat asylumBeforeCutoff uncertainty as relevant for non-asylum users', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			asylumBeforeCutoff: 'not_sure',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none']
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('family_unit')
		expect(result.possibleEligibilityRoutes).toEqual(['family_unit'])
	})

	it('does not show a specialist-flag reason when a clear route is still recommended', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none'],
			specialistFlags: ['want_specialist']
		})

		expect(result.resultState).toBe('eligible')
		expect(result.recommendedEligibilityRoute).toBe('family_unit')
		expect(result.recommendedSubmissionPath).toBe('specialist_review_first')
		expect(result.reasonKey).toBeUndefined()
	})

	it('adds criminal-record blockers without changing eligibility path', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none'],
			previousResidenceCountries: [
				{
					countryCode: 'MA',
					certificateStatus: 'not_requested_yet'
				}
			]
		})

		expect(result.recommendedEligibilityRoute).toBe('family_unit')
		expect(result.criminalRecordAssessments[0].blockers).toContain(
			'criminal_record_certificate_not_requested'
		)
	})

	it('does not create criminal-record assessments for Spain only', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none'],
			previousResidenceCountries: [{ countryCode: 'ES' }]
		})

		expect(result.criminalRecordAssessments).toEqual([])
	})

	it('routes certificate uncertainty to specialist review before submission', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['child_under_18'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none'],
			previousResidenceCountries: [
				{ countryCode: 'ES' },
				{
					countryCode: 'CO',
					certificateStatus: 'not_sure'
				}
			]
		})

		expect(result.recommendedEligibilityRoute).toBe('family_unit')
		expect(result.recommendedSubmissionPath).toBe('specialist_review_first')
		expect(result.criminalRecordAssessments[0].urgency).toBe('specialist_review')
	})

	it('shows a specialist-flag reason when specialist review is the recommended route', () => {
		const result = runTriage({
			presentBeforeCutoff: 'yes',
			asylumHistory: 'no',
			fiveMonthStay: 'yes',
			familySituation: ['none'],
			workSituation: ['none'],
			vulnerabilitySituation: ['none'],
			specialistFlags: ['criminal_record_worry']
		})

		expect(result.resultState).toBe('needs_specialist_review')
		expect(result.recommendedEligibilityRoute).toBe('needs_specialist_review')
		expect(result.reasonKey).toBe('result.reason.specialist_flags')
	})
})
