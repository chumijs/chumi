/**
 * vite vue3
 */
import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname),
  server: {
    host: '0.0.0.0'
  },
  plugins: [vue(), vueJsx()]
});
