import React from 'react';

const OrderHistorySkeleton = () => {
    const SkeletonRow = () => (
        <tr className="animate-skeleton-pulse">
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
            <td className="p-3"><div className="h-6 bg-gray-200 rounded-md w-24"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
            <td className="p-3"><div className="h-6 bg-gray-200 rounded w-12"></div></td>
        </tr>
    );

    return (
        <div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4 animate-skeleton-pulse"></div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-brand-subtle text-transparent select-none">
                        <tr>
                            <th className="p-3 font-semibold">الطلب</th>
                            <th className="p-3 font-semibold">التاريخ</th>
                            <th className="p-3 font-semibold">الحالة</th>
                            <th className="p-3 font-semibold">الإجمالي</th>
                            <th className="p-3 font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistorySkeleton;
