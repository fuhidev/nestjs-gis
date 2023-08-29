import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'path',
        '@nestjs/common',
        '@nestjs/jwt',
        '@nestjsx/crud',
        '@nestjsx/crud-typeorm',
        'exceljs',
        'express',
        'geojson',
        'reflect-metadata',
        'rxjs',
        'typeorm',
        'os',
        'fs',
      ],
    },
  },
  plugins: [dts({ rollupTypes: true })], // emit TS declaration files
});
