<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'
import { NativeSelect, NativeSelectOption } from '@primer-paso/ui/native-select'
import { Separator } from '@primer-paso/ui/separator'

let { data, form } = $props()

const organisationValue = $derived(
	form?.intent === 'profile' && form.value ? form.value : data.organisation
)

const formatDate = (value: string | undefined) => {
	if (!value) return '—'
	return new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/Madrid'
	}).format(new Date(value))
}

const entityTypeLabel = (value: string) =>
	({
		public_administration: 'Administración pública',
		third_sector_or_union: 'Tercer sector o sindicato'
	})[value] ?? value

const shortFingerprint = (value: string) =>
	value.length > 24 ? `${value.slice(0, 12)}…${value.slice(-12)}` : value
</script>

<svelte:head> <title>Organización | Portal de organizaciones de Primer Paso</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Administración de la organización</p>
		<h1 class="page-title">Datos de organización</h1>
		<p class="supporting-text">
			Actualiza la información que se utilizará al emitir certificados y configura el certificado de
			firma de <strong>{data.organisation.name}</strong>.
		</p>
	</header>

	{#if form?.error}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">No se pudieron guardar los cambios</p>
			<p class="error-text">{form.error}</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle id="organisation-profile-title">Información de la organización</CardTitle>
			<CardDescription>
				Estos datos se incorporan al certificado emitido cuando corresponda.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/profile"
				class="stack"
				aria-labelledby="organisation-profile-title"
			>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="form-field md:col-span-2">
						<Label for="name">Nombre de la organización</Label>
						<Input
							id="name"
							name="name"
							autocomplete="organization"
							required
							value={organisationValue.name ?? ''}
						/>
					</div>

					<div class="form-field">
						<Label for="entityType">Tipo de entidad</Label>
						<NativeSelect id="entityType" name="entityType" required>
							{#each ['third_sector_or_union', 'public_administration'] as entityType}
								<NativeSelectOption
									value={entityType}
									selected={(organisationValue.entityType ?? 'third_sector_or_union') ===
										entityType}
								>
									{entityTypeLabel(entityType)}
								</NativeSelectOption>
							{/each}
						</NativeSelect>
					</div>

					<div class="form-field">
						<Label for="nifCif">NIF/CIF</Label>
						<Input id="nifCif" name="nifCif" value={organisationValue.nifCif ?? ''} />
					</div>

					<div class="form-field">
						<Label for="registrationNumber">Número de registro</Label>
						<Input
							id="registrationNumber"
							name="registrationNumber"
							value={organisationValue.registrationNumber ?? ''}
						/>
					</div>

					<div class="form-field">
						<Label for="email">Correo electrónico</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							value={organisationValue.email ?? ''}
						/>
					</div>

					<div class="form-field">
						<Label for="phone">Teléfono</Label>
						<Input
							id="phone"
							name="phone"
							autocomplete="tel"
							value={organisationValue.phone ?? ''}
						/>
					</div>

					<div class="form-field md:col-span-2">
						<Label for="address">Dirección</Label>
						<Input
							id="address"
							name="address"
							autocomplete="street-address"
							value={organisationValue.address ?? ''}
						/>
					</div>
				</div>

				<div class="actions"><Button type="submit">Guardar datos</Button></div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>
				<span class="inline-flex items-center gap-2">
					<ShieldCheckIcon class="size-5 text-muted-foreground" aria-hidden="true" />
					Certificado de firma
				</span>
			</CardTitle>
			<CardDescription>
				El certificado se valida con el servicio interno de firma, se almacena cifrado y solo se usa
				en el servidor para firmar PDFs emitidos.
			</CardDescription>
		</CardHeader>
		<CardContent class="stack">
			{#if data.signingCertificate}
				<div class="panel-subtle stack-sm">
					<div class="actions">
						<Badge variant="success">Certificado activo</Badge>
						<span class="hint">Creado: {formatDate(data.signingCertificate.createdAt)}</span>
					</div>

					<dl class="summary-grid">
						<div class="summary-item">
							<dt class="summary-label">Titular</dt>
							<dd class="summary-value">{data.signingCertificate.subject}</dd>
						</div>
						<div class="summary-item">
							<dt class="summary-label">Emisor</dt>
							<dd class="summary-value">{data.signingCertificate.issuer}</dd>
						</div>
						<div class="summary-item">
							<dt class="summary-label">Número de serie</dt>
							<dd class="summary-value">{data.signingCertificate.serialNumber}</dd>
						</div>
						<div class="summary-item">
							<dt class="summary-label">Huella SHA-256</dt>
							<dd class="summary-value font-mono" title={data.signingCertificate.fingerprintSha256}>
								{shortFingerprint(data.signingCertificate.fingerprintSha256)}
							</dd>
						</div>
						<div class="summary-item">
							<dt class="summary-label">Válido desde</dt>
							<dd class="summary-value">{formatDate(data.signingCertificate.notBefore)}</dd>
						</div>
						<div class="summary-item">
							<dt class="summary-label">Válido hasta</dt>
							<dd class="summary-value">{formatDate(data.signingCertificate.notAfter)}</dd>
						</div>
					</dl>

					<form method="POST" action="?/disableCertificate">
						<input type="hidden" name="certificateId" value={data.signingCertificate.id}>
						<Button type="submit" variant="destructive">Desactivar certificado</Button>
					</form>
				</div>
			{:else}
				<div class="panel-subtle">
					<p class="supporting-text">
						No hay ningún certificado de firma activo. La organización no podrá emitir certificados
						firmados hasta que se configure uno.
					</p>
				</div>
			{/if}

			<Separator />

			<form method="POST" action="?/certificate" enctype="multipart/form-data" class="stack">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="form-field md:col-span-2">
						<Label for="pkcs12">
							{data.signingCertificate ? 'Reemplazar certificado' : 'Subir certificado'}
						</Label>
						<Input
							id="pkcs12"
							name="pkcs12"
							type="file"
							accept=".p12,.pfx,application/x-pkcs12"
							required
						/>
						<p class="hint">
							Sube un archivo .p12 o .pfx. No se podrá descargar ni ver después de guardarlo.
						</p>
					</div>

					<div class="form-field md:col-span-2">
						<Label for="passphrase">Contraseña del certificado</Label>
						<Input
							id="passphrase"
							name="passphrase"
							type="password"
							autocomplete="new-password"
							required
						/>
						<p class="hint">
							La contraseña se valida antes de guardar el certificado y se almacena cifrada.
						</p>
					</div>
				</div>

				<label class="check-row">
					<input type="checkbox" name="confirmSigningUse" value="yes" class="mt-1 size-4" required>
					<span class="text-sm leading-6">
						Entiendo que este certificado se usará para firmar los certificados emitidos por la
						organización.
					</span>
				</label>

				<div class="actions">
					<Button type="submit" variant="secondary">
						{data.signingCertificate ? 'Guardar reemplazo' : 'Guardar certificado'}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>

	<div class="actions">
		<Button href="/dashboard" variant="ghost">
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Volver al panel
		</Button>
	</div>
</div>
