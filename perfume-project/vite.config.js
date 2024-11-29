import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: 'perfume-formulas', // GitHub repository adı ile değiştirin
  build: {
    outDir: 'dist', // Çıktı dizinini belirtir
  },
})