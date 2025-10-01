import React from 'react';

const KpiCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-brand-border animate-skeleton-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
);

export default KpiCardSkeleton;
