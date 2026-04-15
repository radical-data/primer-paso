import { en } from './en'

export type MessageKey = keyof typeof en

export interface MessageReference {
	type: 'message'
	key: MessageKey
	values?: Record<string, string | MessageReference | RawReference>
}

export interface RawReference {
	type: 'raw'
	value: string
}

export type FormattedReference = MessageReference | RawReference

export const t = (key: MessageKey, values?: Record<string, string>) => {
	const template = en[key] ?? key

	if (!values) {
		return template
	}

	return template.replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? `{${name}}`)
}

export const renderReference = (reference: FormattedReference): string => {
	if (reference.type === 'raw') {
		return reference.value
	}

	const values = reference.values
		? Object.fromEntries(
				Object.entries(reference.values).map(([name, value]) => [
					name,
					typeof value === 'string'
						? value
						: value.type === 'raw'
							? value.value
							: renderReference(value)
				])
			)
		: undefined

	return t(reference.key, values)
}
