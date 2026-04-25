export type RawOrganisationLocation = string | string[] | null

export type RawOrganisationOpeningHours = Record<string, string[]> | null

export interface RawOrganisationRecord {
	id: string
	name: string
	website: string | null
	location: RawOrganisationLocation
	phone: string | null
	email: string | null
	opening_hours: RawOrganisationOpeningHours
}

export interface OpeningHoursRow {
	startDay: number
	endDay: number
	hours: string
}

export interface OrganisationRecord {
	id: string
	slug: string
	name: string
	website: string | null
	location: string | null
	phone: string | null
	email: string | null
	openingHours: OpeningHoursRow[]
}

export interface OrganisationDirectoryFilters {
	q: string
}
