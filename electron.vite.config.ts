import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:color';
            @use 'sass:meta';
            @use '@renderer/styles/tokens' as *;
            @use '@renderer/styles/mixins' as *;
          `,
        },
      },
    },
  },
});
