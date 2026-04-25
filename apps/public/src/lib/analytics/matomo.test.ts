import { describe, expect, it } from 'vitest'
import { getMatomoSiteIdForEnvironment, getRouteGroup, inferAnalyticsEnvironment } from './matomo'

describe('inferAnalyticsEnvironment', () => {
	it('classifies localhost as development', () => {
		expect(inferAnalyticsEnvironment('localhost')).toBe('development')
		expect(inferAnalyticsEnvironment('127.0.0.1')).toBe('development')
		expect(inferAnalyticsEnvironment('app.local')).toBe('development')
	})

	it('classifies configured production domains as production', () => {
		expect(inferAnalyticsEnvironment('primerpaso.org')).toBe('production')
	})

	it('classifies everything else as test', () => {
		expect(inferAnalyticsEnvironment('deploy-preview-42--primer-paso.netlify.app')).toBe('test')
	})
})

describe('getMatomoSiteIdForEnvironment', () => {
	it('returns a production site id when configured', () => {
		expect(getMatomoSiteIdForEnvironment('production')).not.toBeNull()
	})

	it('returns a test site id when configured', () => {
		expect(getMatomoSiteIdForEnvironment('test')).not.toBeNull()
	})
})

describe('getRouteGroup', () => {
	it('maps key routes correctly', () => {
		expect(getRouteGroup('/es')).toBe('home')
		expect(getRouteGroup('/es/screener')).toBe('screener')
		expect(getRouteGroup('/es/check-answers')).toBe('check_answers')
		expect(getRouteGroup('/es/result')).toBe('result')
		expect(getRouteGroup('/es/organisations')).toBe('organisations')
		expect(getRouteGroup('/es/organisations/example-org')).toBe('organisation_detail')
		expect(getRouteGroup('/es/language')).toBe('question')
	})
})
