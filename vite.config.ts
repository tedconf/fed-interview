import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/graphql': {
        target: 'https://graphql.ted.com/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/graphql/, ''),
        headers: {
          'Origin': 'https://www.ted.com',
          'Referer': 'https://www.ted.com/',
        },
      },
    },
  },
})
