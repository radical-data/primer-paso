import type { MessageKey } from './index'

export const ar = {
	'chrome.app_title': 'Primer Paso',
	'chrome.meta_description':
		'Primer Paso هو استبيان أولي لعملية التسوية الاستثنائية في إسبانيا لعام 2026، وهو مستضاف على primerpaso.org.',
	'chrome.brand': 'Primer Paso',
	'chrome.language_switcher_label': 'تبديل اللغة',
	'steps.language.title': 'اختر لغة',
	'steps.language.body': 'ما اللغة التي تود استخدامها؟',
	'steps.language.hint': 'يمكنك تغيير اللغة في أي وقت من دون فقدان إجاباتك.',
	'steps.language.check_answers_label': 'اللغة',
	'steps.language.error': 'اختر لغة.'
} satisfies Partial<Record<MessageKey, string>>
