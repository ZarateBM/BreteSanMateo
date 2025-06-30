import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: true,
		allowedHosts: ['tubretecr.com', 'www.tubretecr.com'],
	},
	preview: {
		port: 3000,
		host: true,
		allowedHosts: ['tubretecr.com', 'www.tubretecr.com'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
