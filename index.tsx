import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import { AppStateProvider } from './src/state/AppState';

const root = createRoot(document.getElementById('root'));
root.render(
    <AppStateProvider>
        <App />
    </AppStateProvider>
);
