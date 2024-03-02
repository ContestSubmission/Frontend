import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';


const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const rootPackage = JSON.parse(json);

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		rootPackage
	}
});
