import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/perfume-formulas/' : '/',
  build: {
    outDir: 'dist', // Çıktı dizinini belirtir
  },
})