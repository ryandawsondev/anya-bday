import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/anya-bday/',
  plugins: [tailwindcss(), viteReact()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          postprocessing: ['postprocessing'],
          motion: ['motion'],
        },
      },
    },
  },
})
