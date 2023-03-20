import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { inject } from '@vercel/analytics';
import { SettingsProvider } from './contexts/Settings';

if (process.env.NODE_ENV === 'production') {
  inject();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);
