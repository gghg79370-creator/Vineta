import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="group text-center bg-brand-surface rounded-xl overflow-hidden border border-brand-border/50 h-full flex flex-col animate-skeleton-pulse">
            <div className="relative">
                <div className="w-full bg-brand-subtle aspect-[3/4]"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <div className="h-4 bg-brand-subtle rounded w-2/5 mx-auto mb-2"></div>
                 <div className="h-5 bg-brand-border rounded w-3/4 mx-auto mb-3"></div>
                 <div className="h-4 bg-brand-subtle rounded w-1/3 mx-auto mb-4"></div>
                <div className="flex justify-center gap-1.5 mt-auto h-5">
                    <div className="w-5 h-5 bg-brand-subtle rounded-full"></div>
                    <div className="w-5 h-5 bg-brand-subtle rounded-full"></div>
                    <div className="w-5 h-5 bg-brand-subtle rounded-full"></div>
                </div>
            </div>
        </div>
    );
};