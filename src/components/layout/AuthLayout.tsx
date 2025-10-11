import React from 'react';
import { useAppState } from '../../state/AppState';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const { state: { theme } } = useAppState();
    return (
        <div className="min-h-screen bg-brand-subtle flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-brand-dark">{theme.siteName}</h1>
            </div>
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-brand-border">
                {children}
            </div>
        </div>
    );
};