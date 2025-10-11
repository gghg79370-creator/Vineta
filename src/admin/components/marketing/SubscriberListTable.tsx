import React from 'react';
import { AdminSubscriber } from '../../data/adminData';

interface SubscriberListTableProps {
    subscribers: AdminSubscriber[];
}

const SubscriberListTable: React.FC<SubscriberListTableProps> = ({ subscribers }) => {
    
    const getStatusClasses = (status: AdminSubscriber['status']) => {
        return status === 'Subscribed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 font-semibold">البريد الإلكتروني</th>
                        <th className="p-3 font-semibold">تاريخ الاشتراك</th>
                        <th className="p-3 font-semibold">الحالة</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {subscribers.map(subscriber => (
                        <tr key={subscriber.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-800">{subscriber.email}</td>
                            <td className="p-3 text-gray-500">{subscriber.subscribedAt}</td>
                            <td className="p-3">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(subscriber.status)}`}>
                                    {subscriber.status === 'Subscribed' ? 'مشترك' : 'غير مشترك'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubscriberListTable;
