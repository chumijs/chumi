/**
 * vite node
 */
import { defineConfig } from 'vite';
import publish from './plugins/publish';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: 'chumi/index.ts',
      name: 'chumi',
      fileName: 'index',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['koa', 'koa-router', 'koa-body', 'koa-compose']
    }
  },
  plugins: [publish()]
});
