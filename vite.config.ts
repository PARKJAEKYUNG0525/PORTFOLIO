import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 애니메이션 라이브러리를 별도 청크로 분리
        manualChunks(id: string) {
          if (/node_modules[\\/](gsap|lenis|motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion';
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
        },
      },
    },
  },
});
