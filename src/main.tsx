import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FeatureFlagProvider } from './features/FeatureFlagContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FeatureFlagProvider>
  </React.StrictMode>,
);
