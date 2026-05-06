import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
      react(),
      VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'PetFinder',
      short_name: 'PetFinder',
      theme_color: '#0d6efd',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ]
    }
  })
  ]
})