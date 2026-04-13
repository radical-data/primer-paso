import { describe, expect, it } from 'vitest'

import { APP_NAME } from './index'

describe('APP_NAME', () => {
	it('exposes stable app metadata', () => {
		expect(APP_NAME).toBe('regularisation-intake')
	})
})
