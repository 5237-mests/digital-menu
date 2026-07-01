import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    proxy: {
      '/auth': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
      '/categories': 'http://localhost:3001',
      '/menu-items': 'http://localhost:3001',
      '/tables': 'http://localhost:3001',
      '/orders': 'http://localhost:3001',
      '/dashboard': 'http://localhost:3001',
      '/settings': 'http://localhost:3001',
      '/public': 'http://localhost:3001',
      '/health': 'http://localhost:3001',
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  }
});
