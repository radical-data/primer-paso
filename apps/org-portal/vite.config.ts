import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const svelteSsrPackages = ['@primer-paso/ui', 'bits-ui', 'svelte-toolbelt']

export default defineConfig({
	envDir: path.resolve(__dirname, '../..'),
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: svelteSsrPackages
	},
	optimizeDeps: {
		exclude: svelteSsrPackages
	},
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})
