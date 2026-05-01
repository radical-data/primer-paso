<script lang="ts">
import { page } from '$app/state'
import '../app.css'

let { children, data } = $props()

const session = $derived(data.session)
const path = $derived(page.url.pathname)

const navItems = $derived(
	session
		? [
				{ href: '/dashboard', label: 'Panel' },
				...(session.permissions.includes('organisation:manage_members')
					? [{ href: '/admin/members', label: 'Miembros' }]
					: []),
				...(session.permissions.includes('audit:read')
					? [{ href: '/admin/audit', label: 'Auditoría' }]
					: [])
			]
		: [
				{ href: '/', label: 'Inicio' },
				{ href: '/login', label: 'Iniciar sesión' }
			]
)

const isCurrent = (href: string) => path === href || path.startsWith(`${href}/`)
</script>

<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>

<div class="app-shell">
	<a class="skip-link" href="#main-content">Saltar al contenido principal</a>

	<header class="site-header">
		<div class="site-header-inner site-width">
			<a class="brand" href={session ? '/dashboard' : '/'}>
				<span class="brand-mark">Primer Paso</span>
				<span class="brand-tagline">Portal de organizaciones</span>
			</a>

			<nav class="site-nav" aria-label="Navegación del portal">
				<ul class="site-nav-list">
					{#each navItems as item (item.href)}
						<li>
							<a
								class="site-nav-link"
								href={item.href}
								aria-current={isCurrent(item.href) ? 'page' : undefined}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			{#if session}
				<div class="site-header-actions">
					<span class="hint hidden md:inline">{session.email}</span>
					<form method="POST" action="/logout">
						<button class="site-nav-link" type="submit">Cerrar sesión</button>
					</form>
				</div>
			{/if}
		</div>
	</header>

	<main id="main-content" class="site-width py-8 pb-16">{@render children()}</main>

	<footer class="site-footer">
		<div class="site-footer-inner site-width">
			<span>© Primer Paso</span>
			<span>Solo personas autorizadas · La actividad queda registrada</span>
		</div>
	</footer>
</div>
