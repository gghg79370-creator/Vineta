import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './state/AppState';

const root = createRoot(document.getElementById('root'));
root.render(
    <AppStateProvider>
        <App />
    </AppStateProvider>
);