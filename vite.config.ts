import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api/firms': {
          target: 'https://firms.modaps.eosdis.nasa.gov',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const days = url.searchParams.get('days') || '5';
            const key = env.VITE_FIRMS_MAP_KEY || '';
            return `/api/area/csv/${key}/VIIRS_SNPP_NRT/world/${days}`;
          },
        },
        '/api/gdacs': {
          target: 'https://www.gdacs.org',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const params = new URLSearchParams({
              eventlist: 'EQ,TC,FL,VO,DR,WF',
              alertlevel: 'Green;Orange;Red',
              fromDate: url.searchParams.get('fromDate') || '',
              toDate: url.searchParams.get('toDate') || '',
              limit: url.searchParams.get('limit') || '100',
            });
            return `/gdacsapi/api/events/geteventlist/SEARCH?${params}`;
          },
        },
      },
    },
  };
});
