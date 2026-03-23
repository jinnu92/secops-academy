import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SecOpsAcademy from '../secops-academy.jsx';

// Polyfill window.storage using localStorage
if (!window.storage) {
  window.storage = {
    async getItem(key, { shared } = {}) {
      const prefix = shared ? 'shared:' : 'local:';
      const val = localStorage.getItem(prefix + key);
      return val ? JSON.parse(val) : null;
    },
    async setItem(key, value, { shared } = {}) {
      const prefix = shared ? 'shared:' : 'local:';
      localStorage.setItem(prefix + key, typeof value === 'string' ? value : JSON.stringify(value));
    },
    async removeItem(key, { shared } = {}) {
      const prefix = shared ? 'shared:' : 'local:';
      localStorage.removeItem(prefix + key);
    },
    async list(prefix) {
      const results = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('shared:' + prefix)) {
          results.push({ key: k.replace('shared:', ''), value: JSON.parse(localStorage.getItem(k)) });
        }
      }
      return results;
    },
  };
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/secops-academy/sw.js').catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SecOpsAcademy />
  </React.StrictMode>
);
