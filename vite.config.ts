import { name } from './package.json'

import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: `/${name}/`,
  plugins: [react()],
  resolve: {
    alias: {
      ':src': path.resolve(__dirname, './src')
    },
  },
})
