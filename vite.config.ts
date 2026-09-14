import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

const base = process.env.VITE_BASE_PATH ?? '/';

const spaFallback404 = (): Plugin => {
  let outDir = 'dist';

  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
};

export default defineConfig({
  base,
  plugins: [react(), spaFallback404()],
  resolve: {
    alias: {
      '@app': fromRoot('./src/app'),
      '@pages': fromRoot('./src/pages'),
      '@widgets': fromRoot('./src/widgets'),
      '@features': fromRoot('./src/features'),
      '@entities': fromRoot('./src/entities'),
      '@shared': fromRoot('./src/shared'),
    },
  },
});
