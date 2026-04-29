import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateVulnerabilityCertificatePdf } from '../src/pdf'
import { parseCertificateIssueRequest } from '../src/schema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const fixturePath = path.join(
	packageRoot,
	'fixtures',
	'vulnerability-certificate.issue-request.fixture.json'
)
const outputDir = path.join(packageRoot, 'fixtures', 'generated')

const main = async () => {
	const fixture = JSON.parse(await readFile(fixturePath, 'utf8'))
	const issueRequest = parseCertificateIssueRequest(fixture)
	const generated = await generateVulnerabilityCertificatePdf(issueRequest)
	const outputPath = path.join(outputDir, generated.filename)

	await mkdir(outputDir, { recursive: true })
	await writeFile(outputPath, generated.bytes)
	console.log(`Wrote ${outputPath}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
