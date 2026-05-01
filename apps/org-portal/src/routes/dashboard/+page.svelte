<script lang="ts">
import { roleLabel } from '$lib/labels'

let { data } = $props()
</script>

<svelte:head>
	<title>Panel | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Panel de la organización</h1>

		{#if data.permissionError}
			<p role="alert">No tienes permiso para realizar esa acción en esta organización.</p>
		{/if}

		<p>
			Has iniciado sesión como miembro de la organización con permiso de
			<strong>{roleLabel(data.session.role)}</strong>.
		</p>

		<h2>Abrir un borrador recibido</h2>
		<form method="GET" action="/handoff" class="stack">
			<label>
				Enlace o código del borrador
				<input name="token" autocomplete="off">
			</label>
			<button type="submit">Abrir borrador</button>
		</form>

		<p>Escanea un código QR de Primer Paso o pega arriba el enlace o código del borrador.</p>

		{#if data.adminLinks.canManageMembers || data.adminLinks.canReadAudit}
			<section>
				<h2>Administración de la organización</h2>
				<ul>
					{#if data.adminLinks.canManageMembers}
						<li><a href="/admin/members">Gestionar miembros</a></li>
					{/if}
					{#if data.adminLinks.canReadAudit}
						<li><a href="/admin/audit">Ver registro de auditoría</a></li>
					{/if}
				</ul>
			</section>
		{/if}

		<form method="POST" action="/logout"><button type="submit">Cerrar sesión</button></form>
	</section>
</main>
