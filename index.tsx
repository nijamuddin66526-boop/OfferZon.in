
// Pre-flight check: Ensure process.env exists before any other modules are evaluated
// This prevents "ReferenceError: process is not defined" which causes a blank white screen
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // If the root element is missing, we log it clearly
  console.error("Critical Error: Could not find root element with id 'root' in index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
