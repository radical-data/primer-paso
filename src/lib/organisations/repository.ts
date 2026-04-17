import organisationsData from './data/organisations.json'
import type {
	OpeningHoursRow,
	OrganisationDirectoryFilters,
	OrganisationRecord,
	RawOrganisationOpeningHours,
	RawOrganisationRecord
} from './types'

const clean = (value: string | null | undefined) => {
	if (!value) return undefined
	const trimmed = value.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim()
	return trimmed.length > 0 ? trimmed : undefined
}

const cleanLocation = (value: RawOrganisationRecord['location']): string | null => {
	if (!value) return null

	if (Array.isArray(value)) {
		const locations = value
			.map((entry) => clean(entry))
			.filter((entry): entry is string => Boolean(entry))

		if (locations.length === 0) return null

		return [...new Set(locations)].join(' · ')
	}

	return clean(value) ?? null
}

const dayOrder = [
	{ key: 'monday', index: 0 },
	{ key: 'tuesday', index: 1 },
	{ key: 'wednesday', index: 2 },
	{ key: 'thursday', index: 3 },
	{ key: 'friday', index: 4 },
	{ key: 'saturday', index: 5 },
	{ key: 'sunday', index: 6 }
] as const

const buildOpeningHoursRows = (value: RawOrganisationOpeningHours): OpeningHoursRow[] => {
	if (!value) return []

	const days = dayOrder.map(({ key, index }) => ({
		key,
		index,
		hours: (value[key] ?? []).join(', ')
	}))

	const rows: OpeningHoursRow[] = []
	let i = 0

	while (i < days.length) {
		if (!days[i].hours) {
			i += 1
			continue
		}

		let j = i
		while (j + 1 < days.length && days[j + 1].hours === days[i].hours) {
			j += 1
		}

		rows.push({
			startDay: days[i].index,
			endDay: days[j].index,
			hours: days[i].hours
		})

		i = j + 1
	}

	return rows
}

const normaliseOrganisation = (entry: RawOrganisationRecord): OrganisationRecord => ({
	id: entry.id,
	name: entry.name.trim(),
	website: clean(entry.website) ?? null,
	location: cleanLocation(entry.location),
	phone: clean(entry.phone) ?? null,
	email: clean(entry.email) ?? null,
	openingHours: buildOpeningHoursRows(entry.opening_hours)
})

const records = (organisationsData as RawOrganisationRecord[]).map(normaliseOrganisation)

const searchableText = (entry: OrganisationRecord) =>
	[
		entry.name,
		entry.location ?? '',
		entry.email ?? '',
		entry.phone ?? '',
		entry.website ?? '',
		...entry.openingHours.flatMap((row) => [String(row.startDay), String(row.endDay), row.hours])
	]
		.join(' ')
		.toLowerCase()

export const getAllOrganisations = () => records

export const filterOrganisations = (filters: OrganisationDirectoryFilters) => {
	const q = filters.q.trim().toLowerCase()
	return records.filter((entry) => {
		if (q && !searchableText(entry).includes(q)) {
			return false
		}
		return true
	})
}

export const getDirectorySummary = (items: OrganisationRecord[]) => {
	const withWebsite = items.filter((entry) => entry.website).length
	const withPhone = items.filter((entry) => entry.phone).length
	const withEmail = items.filter((entry) => entry.email).length
	return {
		total: items.length,
		withWebsite,
		withPhone,
		withEmail
	}
}
