import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="group text-center bg-white rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col animate-skeleton-pulse">
            <div className="relative">
                <div className="w-full bg-gray-200 aspect-[3/4]"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <div className="h-4 bg-gray-200 rounded w-2/5 mx-auto mb-2"></div>
                 <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="flex justify-center gap-1.5 mt-auto h-5">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};