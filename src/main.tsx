import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (import.meta.env.DEV) {
  const { worker } = await import('./api/browser');
  await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
}

createRoot(document.getElementById('root')!).render(<App />);
