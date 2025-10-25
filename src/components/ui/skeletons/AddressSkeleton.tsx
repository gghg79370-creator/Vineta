import React from 'react';

const AddressSkeleton = () => {
    const SkeletonCard = () => (
         <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
                 <div className="space-y-2">
                    <div className="h-5 bg-brand-border rounded w-24"></div>
                    <div className="h-4 bg-brand-subtle rounded w-16"></div>
                 </div>
                 <div className="h-6 w-6 bg-brand-subtle rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-brand-subtle rounded w-full"></div>
                <div className="h-4 bg-brand-subtle rounded w-2/3"></div>
            </div>
        </div>
    );
    return (
        <div className="animate-skeleton-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-brand-border rounded w-1/4"></div>
                <div className="h-9 bg-brand-border rounded-full w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
};

export default AddressSkeleton;