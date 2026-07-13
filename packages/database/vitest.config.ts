import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@mpho/database': path.resolve(__dirname, './index.ts'),
      '@mpho/database/types': path.resolve(__dirname, './types.ts'),
      '@mpho/database/client': path.resolve(__dirname, './client.ts'),
    },
  },
})
