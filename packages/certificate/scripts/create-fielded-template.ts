import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, PDFName, PDFNumber, type PDFPage, rgb, StandardFonts } from 'pdf-lib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')

const sourcePath = path.join(packageRoot, 'templates', 'certificado-vulnerabilidad.source.pdf')
const outputPath = path.join(packageRoot, 'templates', 'certificado-vulnerabilidad.pdf')

type PageIndex = 0 | 1

interface Rect {
	page: PageIndex
	x: number
	y: number
	width: number
	height: number
}

interface TextFieldDefinition extends Rect {
	name: string
	fontSize?: number
	multiline?: boolean
}

interface CheckBoxDefinition extends Rect {
	name: string
}

const transparent = undefined
const textColour = rgb(0, 0, 0)
const DEFAULT_TEXT_FIELD_HEIGHT = 11
const DEFAULT_CHECKBOX_SIZE = 5.5

/*
	Coordinate system:
		A4 page, portrait: 595 x 842 pt
		origin: bottom-left
		coordinates were calibrated against a 144 dpi render of the official flat PDF
		widgets are placed over the visual blanks/checkboxes already present in the source PDF
*/

const textFields: TextFieldDefinition[] = [
	// Page 1 - 1. DATOS DE LA ENTIDAD CERTIFICADORA
	{
		name: 'organisation.name',
		page: 0,
		x: 116,
		y: 669,
		width: 456,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'organisation.nifCif',
		page: 0,
		x: 34,
		y: 631,
		width: 538,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		/*
			The rows below are anchored to the extracted PDF line bottoms from the
			official source PDF, not to visually estimated render positions.

			For text fields, y is set about 1-2 pt above the extracted line bottom
			so the field text sits on the printed underline.

			Key extracted row bottoms on page 1:
				Nº inscripción: 541.11
				Dirección: 517.95
				Teléfono / Email: 494.67
				Nombre y apellidos: 453.87
				NIE/Pasaporte: 430.71
				Fecha nacimiento: 407.55
				Nacionalidad: 384.27
				Domicilio: 361.11
				Localidad / C.P. / Provincia: 335.91
		*/
		name: 'organisation.registrationNumber',
		page: 0,
		x: 190,
		y: 543,
		width: 312,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'organisation.address',
		page: 0,
		x: 73,
		y: 519,
		width: 484,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'organisation.phoneEmail',
		page: 0,
		x: 98,
		y: 496,
		width: 446,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	// Page 1 - 2. DATOS DE LA PERSONA INTERESADA
	{
		name: 'person.fullName',
		page: 0,
		x: 110,
		y: 455,
		width: 432,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.identityDocumentNumber',
		page: 0,
		x: 138,
		y: 432,
		width: 392,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.dateOfBirth',
		page: 0,
		x: 114,
		y: 409,
		width: 430,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.nationality',
		page: 0,
		x: 85,
		y: 386,
		width: 468,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.address',
		page: 0,
		x: 72,
		y: 363,
		width: 255,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.mobilePhone',
		page: 0,
		x: 398,
		y: 363,
		width: 126,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.locality',
		page: 0,
		x: 74,
		y: 337,
		width: 143,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.postalCode',
		page: 0,
		x: 239,
		y: 337,
		width: 78,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'person.province',
		page: 0,
		x: 357,
		y: 337,
		width: 172,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	// Page 2
	{
		name: 'vulnerability.otherText',
		page: 1,
		x: 117,
		y: 785,
		width: 424,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'certificate.signerOrSeal',
		page: 1,
		x: 211,
		y: 611,
		width: 205,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	},
	{
		name: 'certificate.issuedAt',
		page: 1,
		x: 63,
		y: 565,
		width: 194,
		height: DEFAULT_TEXT_FIELD_HEIGHT
	}
]

const checkBoxes: CheckBoxDefinition[] = [
	// Page 1 - entity type
	{
		name: 'organisation.type.publicAdministration',
		page: 0,
		x: 71,
		y: 591,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'organisation.type.thirdSectorOrUnion',
		page: 0,
		x: 71,
		y: 573.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	/*
		Page 1 vulnerability checkbox extracted line bottoms:
			Aislamiento social: 290.24
			Sinhogarismo/vivienda precaria: 264.92
			Discriminación/exclusión: 239.72
			Carencia de ingresos: 214.40
			Pobreza/riesgo exclusión: 189.08
			Dificultad empleo: 163.76
			Personas a cargo: 138.44
			Unidad familiar vulnerable: 113.24
			Monoparentalidad: 87.91
			Riesgos psicosociales: 62.59
			Explotación o abuso: 37.27

		Checkbox y is extracted line bottom + 4.2, rounded to the nearest 0.5,
		so the AcroForm checkbox overlays the printed square.
	*/
	// Page 1 - vulnerability circumstances
	{
		name: 'vulnerability.socialIsolation',
		page: 0,
		// 35 and 293
		x: 35.5,
		y: 294.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.homelessnessOrPrecariousHousing',
		page: 0,
		x: 35.5,
		y: 269,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.discriminationOrSocialExclusion',
		page: 0,
		x: 35.5,
		y: 244,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.insufficientIncome',
		page: 0,
		x: 35.5,
		y: 218.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.povertyOrEconomicExclusionRisk',
		page: 0,
		x: 35.5,
		y: 193.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.difficultyAccessingEmployment',
		page: 0,
		x: 35.5,
		y: 168,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.dependants',
		page: 0,
		x: 35.5,
		y: 142.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.vulnerableFamilyUnit',
		page: 0,
		x: 35.5,
		y: 117.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.singleParentPrecarity',
		page: 0,
		x: 35.5,
		y: 92,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.psychosocialRisks',
		page: 0,
		x: 35.5,
		y: 67,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	{
		name: 'vulnerability.exploitationOrAbuse',
		page: 0,
		x: 35.5,
		y: 41.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	},
	// Page 2
	{
		name: 'vulnerability.other',
		page: 1,
		x: 35.5,
		y: 787.5,
		width: DEFAULT_CHECKBOX_SIZE,
		height: DEFAULT_CHECKBOX_SIZE
	}
]

const assertA4Page = (page: PDFPage, index: number) => {
	const { width, height } = page.getSize()
	const widthOk = Math.abs(width - 595) <= 1
	const heightOk = Math.abs(height - 842) <= 1
	if (!widthOk || !heightOk) {
		throw new Error(
			`Expected page ${index + 1} to be A4 portrait, got ${width.toFixed(2)} x ${height.toFixed(
				2
			)} pt.`
		)
	}
}

/** Bit 3 of the annotation flags is Print. This avoids fields disappearing when printed. */
const setPrintableFieldFlags = (field: {
	acroField: { dict: { set: (k: ReturnType<typeof PDFName.of>, v: PDFNumber) => void } }
}) => {
	field.acroField.dict.set(PDFName.of('F'), PDFNumber.of(4))
}

const addTextField = (pdf: PDFDocument, definition: TextFieldDefinition, fontSize: number) => {
	const form = pdf.getForm()
	const page = pdf.getPage(definition.page)
	const field = form.createTextField(definition.name)
	if (definition.multiline) {
		field.enableMultiline()
	}
	field.addToPage(page, {
		x: definition.x,
		y: definition.y,
		width: definition.width,
		height: definition.height,
		borderWidth: 0,
		textColor: textColour,
		backgroundColor: transparent
	})
	field.setFontSize(definition.fontSize ?? fontSize)
	setPrintableFieldFlags(field)
}

const addCheckBox = (pdf: PDFDocument, definition: CheckBoxDefinition) => {
	const form = pdf.getForm()
	const page = pdf.getPage(definition.page)
	const field = form.createCheckBox(definition.name)
	field.addToPage(page, {
		x: definition.x,
		y: definition.y,
		width: definition.width,
		height: definition.height,
		borderWidth: 0
	})
	setPrintableFieldFlags(field)
}

const main = async () => {
	const sourceBytes = await readFile(sourcePath)
	const pdf = await PDFDocument.load(sourceBytes)
	const helvetica = await pdf.embedFont(StandardFonts.Helvetica)
	if (pdf.getPageCount() !== 2) {
		throw new Error(`Expected 2 pages, got ${pdf.getPageCount()}.`)
	}
	pdf.getPages().forEach(assertA4Page)
	const form = pdf.getForm()
	for (const field of textFields) {
		addTextField(pdf, field, 9)
	}
	for (const field of checkBoxes) {
		addCheckBox(pdf, field)
	}
	form.updateFieldAppearances(helvetica)
	pdf.setTitle('Modelo de certificado de vulnerabilidad - fielded')
	pdf.setSubject('Derived AcroForm template for Primer Paso certificate generation')
	pdf.setProducer('Primer Paso certificate template fielding script')
	pdf.setCreator('Primer Paso')
	await mkdir(path.dirname(outputPath), { recursive: true })
	await writeFile(outputPath, await pdf.save())
	console.log(`Wrote ${outputPath}`)
	console.log(`Added ${textFields.length} text fields and ${checkBoxes.length} checkboxes.`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
