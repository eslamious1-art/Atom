import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from './components/AppShell';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Unable to locate root element.');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>,
);
