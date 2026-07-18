// NOTE:
// magical-svg is used ONLY for Vitest to align SVG imports
// with Next.js (webpack + svgr). Production pipeline is untouched.

import react from '@vitejs/plugin-react';
import path from 'path';
import magicalSvg from 'vite-plugin-magical-svg';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    magicalSvg({
      target: 'react-jsx',
      svgo: false,
      setFillStrokeColor: false,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**'],
    typecheck: {
      tsconfig: './tsconfig.json',
    },
  },
  resolve: {
    alias: {
      layouts: path.resolve(__dirname, 'src/layouts'),
      modules: path.resolve(__dirname, 'src/modules'),
      shared: path.resolve(__dirname, 'src/shared'),
    },
  },
});
