import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Mocking environment variables used in the original code
    __app_id: JSON.stringify('ronz-chord-pro-v3'),
    // Pastikan string config ini sesuai dengan milik Anda di Firebase
    __firebase_config: JSON.stringify(process.env.FIREBASE_CONFIG || '{}')
  }
})