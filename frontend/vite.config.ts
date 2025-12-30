import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    // Note: There's a known bug in Vite 6.0.9+ where allowedHosts: true may be ignored
    // Using an array with specific hosts as a workaround
    allowedHosts: [
      'gw8oc4w4gkco0ksokk480ks0.nimbux.cloud',
      'o4k4gwkgcg4o4wkw0coww4oo.nimbux.cloud'
    ]
  }
})
