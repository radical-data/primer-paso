import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const migrationsDir = path.join(packageRoot, 'migrations')

const databaseUrl = process.env.PRIVATE_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
	console.error('Set PRIVATE_DATABASE_URL or DATABASE_URL before running migrations.')
	process.exit(1)
}

const sql = postgres(databaseUrl, {
	prepare: false,
	max: 1
})

interface MigrationFile {
	version: string
	filename: string
	path: string
	sql: string
	checksum: string
}

const checksum = (value: string) => createHash('sha256').update(value).digest('hex')

const getMigrationVersion = (filename: string) => {
	const match = filename.match(/^(\d+)_.+\.sql$/)
	return match?.[1] ?? null
}

const readMigrations = async (): Promise<MigrationFile[]> => {
	const entries = await readdir(migrationsDir)
	const migrationFilenames = entries
		.filter((entry) => entry.endsWith('.sql'))
		.sort((a, b) => a.localeCompare(b))

	const migrations: MigrationFile[] = []

	for (const filename of migrationFilenames) {
		const version = getMigrationVersion(filename)
		if (!version) {
			throw new Error(`Migration filename must start with a numeric version: ${filename}`)
		}

		const migrationPath = path.join(migrationsDir, filename)
		const migrationSql = await readFile(migrationPath, 'utf8')

		migrations.push({
			version,
			filename,
			path: migrationPath,
			sql: migrationSql,
			checksum: checksum(migrationSql)
		})
	}

	return migrations
}

const ensureMigrationTable = async () => {
	await sql`
		create table if not exists schema_migrations (
			version text primary key,
			filename text not null unique,
			checksum text not null,
			applied_at timestamptz not null default now()
		)
	`
}

const getAppliedMigrations = async () => {
	const rows = await sql`
		select version, filename, checksum
		from schema_migrations
		order by version asc
	`

	return new Map(
		rows.map((row) => [
			String(row.version),
			{
				filename: String(row.filename),
				checksum: String(row.checksum)
			}
		])
	)
}

const applyMigration = async (migration: MigrationFile) => {
	await sql.begin(async (tx) => {
		await tx.unsafe(migration.sql)
		await tx`
			insert into schema_migrations (version, filename, checksum)
			values (${migration.version}, ${migration.filename}, ${migration.checksum})
		`
	})
}

const main = async () => {
	await ensureMigrationTable()

	const migrations = await readMigrations()
	const applied = await getAppliedMigrations()

	for (const migration of migrations) {
		const existing = applied.get(migration.version)

		if (existing) {
			if (existing.filename !== migration.filename || existing.checksum !== migration.checksum) {
				throw new Error(
					`Migration ${migration.version} has changed since it was applied. Add a new migration instead.`
				)
			}

			console.log(`Already applied ${migration.filename}`)
			continue
		}

		console.log(`Applying ${migration.filename}`)
		await applyMigration(migration)
	}

	console.log('Database migrations are up to date.')
}

main()
	.catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(async () => {
		await sql.end()
	})
