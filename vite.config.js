import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// relative base so the build works under the GitHub Pages /<repo>/ subpath
export default defineConfig({ plugins: [react()], base: './' });
