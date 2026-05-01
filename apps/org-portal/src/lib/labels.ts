import type { OrgRole } from '@primer-paso/auth'
import type { VulnerabilityReason } from '@primer-paso/certificate'
import type { CertificateHandoffReviewStatus, OrganisationMemberStatus } from '@primer-paso/db'

export const roleLabel = (role: OrgRole | string) =>
	({
		admin: 'Administración',
		audit_viewer: 'Consulta de auditoría',
		intake_volunteer: 'Acogida y revisión',
		authorised_signer: 'Firma autorizada'
	})[role] ?? role

export const memberStatusLabel = (status: OrganisationMemberStatus | string) =>
	({
		active: 'Activo',
		invited: 'Invitado',
		disabled: 'Desactivado'
	})[status] ?? status

export const reviewStatusLabel = (status: CertificateHandoffReviewStatus | string) =>
	({
		in_review: 'En revisión',
		ready_to_issue: 'Lista para emitir',
		issued: 'Certificado emitido',
		cancelled: 'Cancelada'
	})[status] ?? status

export const vulnerabilityReasonLabel = (reason: VulnerabilityReason | string) =>
	({
		social_isolation_or_lack_of_support_network: 'Aislamiento social o falta de red de apoyo',
		homelessness_or_precarious_housing: 'Sinhogarismo o vivienda precaria',
		discrimination_or_social_exclusion: 'Discriminación o exclusión social',
		insufficient_income: 'Ingresos insuficientes',
		poverty_or_economic_exclusion_risk: 'Riesgo de pobreza o exclusión económica',
		difficulty_accessing_employment: 'Dificultad para acceder al empleo',
		dependants: 'Personas a cargo',
		vulnerable_family_unit: 'Unidad familiar vulnerable',
		single_parent_precarity: 'Precariedad en familia monomarental o monoparental',
		psychosocial_risks: 'Riesgos psicosociales',
		exploitation_or_abuse: 'Explotación o abuso'
	})[reason] ?? reason

export const auditEventLabel = (eventType: string) =>
	({
		'auth.magic_link_exchange_failed': 'Error al validar el enlace de acceso',
		'auth.magic_link_rate_limited': 'Solicitud de acceso limitada',
		'auth.magic_link_denied': 'Solicitud de acceso rechazada',
		'auth.magic_link_send_failed': 'Error al enviar el enlace de acceso',
		'auth.magic_link_sent': 'Enlace de acceso enviado',
		'auth.login_succeeded': 'Inicio de sesión correcto',
		'auth.login_denied': 'Inicio de sesión denegado',
		'auth.logout': 'Cierre de sesión',
		'handoff.opened': 'Borrador abierto',
		'handoff.reopened': 'Borrador reabierto',
		'handoff.open_failed': 'Error al abrir borrador',
		'handoff.invalid_draft': 'Borrador no válido',
		'review.updated': 'Confirmaciones guardadas',
		'review.ready_to_issue': 'Revisión marcada como lista para emitir',
		'certificate.issued': 'Certificado emitido',
		'certificate.issue_failed': 'Error al emitir certificado',
		'certificate.downloaded': 'Certificado descargado',
		'organisation.member_saved': 'Miembro guardado',
		'organisation.member_role_updated': 'Rol de miembro actualizado',
		'organisation.member_disabled': 'Miembro desactivado'
	})[eventType] ?? eventType

const auditEventDataKeyLabel = (key: string) =>
	({
		email: 'correo',
		reason: 'motivo',
		role: 'rol',
		status: 'estado',
		memberId: 'miembro',
		supabaseUserId: 'usuario de autenticación',
		referenceCode: 'código de referencia',
		blockedUntil: 'bloqueado hasta',
		filename: 'archivo',
		issuedCertificateId: 'certificado emitido'
	})[key] ?? key

const auditEventDataValueLabel = (key: string, value: unknown) => {
	if (typeof value !== 'string') {
		return JSON.stringify(value)
	}

	if (key === 'role') return roleLabel(value)
	if (key === 'status') return memberStatusLabel(value)
	if (key === 'reason') {
		return (
			{
				no_active_organisation_member: 'no hay un miembro activo con ese correo',
				not_found_or_expired: 'no encontrado o caducado',
				organisation_or_signer_not_found:
					'no se encontraron los datos de la organización o de la persona firmante'
			}[value] ?? value
		)
	}

	return value
}

export const formatAuditEventData = (eventData: Record<string, unknown>) => {
	const entries = Object.entries(eventData)
	if (entries.length === 0) return '—'

	return entries
		.map(
			([key, value]) => `${auditEventDataKeyLabel(key)}: ${auditEventDataValueLabel(key, value)}`
		)
		.join(', ')
}
