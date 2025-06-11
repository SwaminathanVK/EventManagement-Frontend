import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App.jsx'; 
import './index.css'; 
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is not found, useful for debugging
  console.error('Root element with ID "root" not found in the document.');
}
