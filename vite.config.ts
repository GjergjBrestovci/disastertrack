import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/firms': {
        target: 'https://firms.modaps.eosdis.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/firms/, '/api/area'),
      },
      '/api/gdacs': {
        target: 'https://www.gdacs.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gdacs/, '/gdacsapi'),
      },
    },
  },
});
