import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://espacemainnetapi.zerithium.io/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
