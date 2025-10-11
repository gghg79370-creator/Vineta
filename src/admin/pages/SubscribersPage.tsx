import React from 'react';
import { AdminSubscriber } from '../data/adminData';
import SubscriberListTable from '../components/marketing/SubscriberListTable';

interface SubscribersPageProps {
    subscribers: AdminSubscriber[];
}

const SubscribersPage: React.FC<SubscribersPageProps> = ({ subscribers }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">المشتركون في النشرة الإخبارية</h1>
                    <p className="text-gray-500 mt-1">عرض وإدارة المشتركين لديك.</p>
                </div>
                 <div className="flex items-center gap-2">
                     <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                        استيراد
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                        تصدير
                    </button>
                 </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <input
                    type="search"
                    placeholder="بحث بالبريد الإلكتروني..."
                    className="w-full md:w-1/3 border-gray-300 rounded-lg"
                />
                <SubscriberListTable subscribers={subscribers} />
            </div>
        </div>
    );
};

export default SubscribersPage;
