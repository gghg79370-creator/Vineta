import React, { useState, useMemo } from 'react';
import { AdminSubscriber } from '../data/adminData';
import SubscriberListTable from '../components/marketing/SubscriberListTable';
import { Card } from '../components/ui/Card';

interface SubscribersPageProps {
    subscribers: AdminSubscriber[];
}

const SubscribersPage: React.FC<SubscribersPageProps> = ({ subscribers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(s =>
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subscribers, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text-primary">المشتركون في النشرة الإخبارية</h1>
                    <p className="text-admin-text-secondary mt-1">عرض وإدارة المشتركين لديك.</p>
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
            <Card title="جميع المشتركين">
                <div className="space-y-4">
                    <input
                        type="search"
                        placeholder="بحث بالبريد الإلكتروني..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="admin-form-input w-full md:w-1/3"
                    />
                    <SubscriberListTable subscribers={filteredSubscribers} />
                </div>
            </Card>
        </div>
    );
};

export default SubscribersPage;