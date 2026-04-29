import Fuse from 'fuse.js'
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

const normaliseSearchText = (value: string | null | undefined) =>
	(value ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

const slugify = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

const buildUniqueSlugs = (entries: RawOrganisationRecord[]) => {
	const counts = new Map<string, number>()

	return entries.map((entry) => {
		const baseSlug = slugify(entry.name) || slugify(entry.id) || 'organisation'
		const seen = counts.get(baseSlug) ?? 0
		counts.set(baseSlug, seen + 1)

		return seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`
	})
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

const normaliseOrganisation = (entry: RawOrganisationRecord, slug: string): OrganisationRecord => ({
	id: entry.id,
	slug,
	name: entry.name.trim(),
	website: clean(entry.website) ?? null,
	location: cleanLocation(entry.location),
	phone: clean(entry.phone) ?? null,
	email: clean(entry.email) ?? null,
	openingHours: buildOpeningHoursRows(entry.opening_hours)
})

const rawRecords = organisationsData as RawOrganisationRecord[]
const slugs = buildUniqueSlugs(rawRecords)

const records = rawRecords.map((entry, index) => normaliseOrganisation(entry, slugs[index]))

interface SearchDocument {
	record: OrganisationRecord
	name: string
	location: string
	email: string
	phone: string
	website: string
	hours: string
	fullText: string
}

const searchDocuments: SearchDocument[] = records.map((record) => {
	const name = normaliseSearchText(record.name)
	const location = normaliseSearchText(record.location)
	const email = normaliseSearchText(record.email)
	const phone = normaliseSearchText(record.phone)
	const website = normaliseSearchText(record.website)
	const hours = normaliseSearchText(record.openingHours.map((row) => row.hours).join(' '))
	const fullText = [name, location, email, phone, website, hours].filter(Boolean).join(' ')

	return {
		record,
		name,
		location,
		email,
		phone,
		website,
		hours,
		fullText
	}
})

const fuse = new Fuse(searchDocuments, {
	includeScore: true,
	ignoreLocation: true,
	threshold: 0.3,
	keys: [
		{ name: 'name', weight: 0.5 },
		{ name: 'location', weight: 0.25 },
		{ name: 'email', weight: 0.1 },
		{ name: 'phone', weight: 0.05 },
		{ name: 'website', weight: 0.07 },
		{ name: 'hours', weight: 0.03 }
	]
})

export const getAllOrganisations = () => records

export const filterOrganisations = (filters: OrganisationDirectoryFilters) => {
	const q = normaliseSearchText(filters.q)

	if (!q) {
		return records
	}

	if (q.length < 2) {
		return searchDocuments
			.filter(
				(entry) =>
					entry.name.includes(q) || entry.location.includes(q) || entry.fullText.includes(q)
			)
			.map((entry) => entry.record)
	}

	return fuse.search(q).map((result) => result.item.record)
}

export const getOrganisationBySlug = (slug: string) =>
	records.find((entry) => entry.slug === slug) ?? null

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
