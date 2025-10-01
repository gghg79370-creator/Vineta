import React from 'react';

const ProfileSkeleton = () => (
    <div className="animate-skeleton-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="space-y-6 max-w-lg">
            <div>
                <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div>
                <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div>
                <div className="h-5 bg-gray-300 rounded w-1/3 my-4"></div>
                <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
            </div>
            <div className="h-12 bg-gray-300 rounded-full w-32 mt-4"></div>
        </div>
    </div>
);

export default ProfileSkeleton;
