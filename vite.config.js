import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/paper/',
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
