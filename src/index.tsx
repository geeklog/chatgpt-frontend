import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { inject } from '@vercel/analytics';

declare global {
  interface Window {
    Pusher: any;
  }
}

if (process.env.NODE_ENV === 'production') {
  inject();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
