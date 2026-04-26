import path from 'node:path'
import { fileURLToPath } from 'node:url'
import adapter from '@sveltejs/adapter-netlify'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
	kit: {
		adapter: adapter(),
		env: {
			dir: path.resolve(__dirname, '../..')
		}
	}
}

export default config
