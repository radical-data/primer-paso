import { createPostgresOrgPortalRepository, type OrgPortalRepository } from '@primer-paso/db'
import { env } from '$env/dynamic/private'

let repository: OrgPortalRepository | null = null
let repositoryDatabaseUrl: string | null = null

export const getOrgPortalRepository = () => {
	const databaseUrl = env.PRIVATE_DATABASE_URL?.trim()

	if (!databaseUrl) {
		return null
	}

	if (!repository || repositoryDatabaseUrl !== databaseUrl) {
		repository = createPostgresOrgPortalRepository({
			databaseUrl
		})
		repositoryDatabaseUrl = databaseUrl
	}

	return repository
}
