import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	envDir: path.resolve(__dirname, '../..'),
	plugins: [tailwindcss(), sveltekit()],
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})
