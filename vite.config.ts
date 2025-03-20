
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/', // Ensure correct base URL for deployment
    server: {
        port: 5173,
    },
});
