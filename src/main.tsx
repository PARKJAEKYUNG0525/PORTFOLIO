import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/globals.css';
import App from './App';

const root = createRoot(document.getElementById('root')!);

// 개발 전용: /?orbit-snapshot → 정적 대체 이미지(public/assets/orbit-static.webp) 촬영용 화면
if (import.meta.env.DEV && location.search.includes('orbit-snapshot')) {
  import('./components/ui/OrbitScene').then(({ default: OrbitScene }) => {
    document.body.style.background = 'transparent';
    root.render(
      <div style={{ width: '100vw', height: '100vh' }}>
        <OrbitScene quality="high" snapshot onReady={() => document.body.setAttribute('data-orbit-ready', '')} />
      </div>,
    );
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
