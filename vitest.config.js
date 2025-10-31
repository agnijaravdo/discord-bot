import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      repository: './coverage',
      exclude: [
        // Excluding database infrastructure related files from coverage, startup scripts,
        // and error types definitions as they do not have business logic to test.
        'src/database/index.ts',
        'src/database/migrate/bin.ts',
        'src/database/seeds/seedInitialData.ts',
        'src/index.ts',
        'src/utils/errors',
      ],
    },
    skipFull: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
})
