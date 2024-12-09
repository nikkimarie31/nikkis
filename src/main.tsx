import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // Global styles
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
