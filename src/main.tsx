import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx'; // <--- Modificato: 'app' con la 'a' minuscola
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);