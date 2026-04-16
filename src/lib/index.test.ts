import { describe, expect, it } from 'vitest'

import { APP_NAME, APP_URL } from './index'

describe('APP_NAME', () => {
	it('exposes stable app metadata', () => {
		expect(APP_NAME).toBe('primer-paso')
		expect(APP_URL).toBe('https://primerpaso.org')
	})
})
