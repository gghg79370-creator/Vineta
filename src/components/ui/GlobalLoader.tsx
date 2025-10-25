import React from 'react';
import Spinner from './Spinner';

interface GlobalLoaderProps {
    isLoading: boolean;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading }) => {
    return (
        <div
            className={`fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-[200] flex items-center justify-center transition-opacity duration-300
                ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <Spinner size="lg" color="text-brand-primary" />
        </div>
    );
};

export default GlobalLoader;