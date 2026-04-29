import type { ParamMatcher } from '@sveltejs/kit'
import { isLocale } from '$lib/content'

export const match = ((param: string) => isLocale(param)) satisfies ParamMatcher
