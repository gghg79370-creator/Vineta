import React, { useState, useMemo } from 'react';
import { AdminProduct } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { Review } from '../../../types';
import { StarIcon, CheckCircleIcon, XCircleIcon, TrashIcon, EyeIcon } from '../../components/icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';


type ReviewWithProductInfo = Review & {
    productName: string;
    productId: number;
    productImage: string;
};
interface ReviewsPageProps {
    products: AdminProduct[];
    onStatusChange: (productId: number, reviewId: number, status: Review['status']) => void;
    onDelete: (productId: number, reviewId: number) => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ products, onStatusChange, onDelete }) => {
    const [activeTab, setActiveTab] = useState<Review['status'] | 'All'>('Pending');
    const [reviewToDelete, setReviewToDelete] = useState<ReviewWithProductInfo | null>(null);

    const allReviews: ReviewWithProductInfo[] = useMemo(() => {
        return products.flatMap(p => 
            p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id, productImage: p.image }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [products]);
    
    const filteredReviews = useMemo(() => {
        if (activeTab === 'All') return allReviews;
        return allReviews.filter(r => r.status === activeTab);
    }, [allReviews, activeTab]);

    const getStatusClasses = (status: Review['status']) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Hidden': return 'bg-gray-100 text-gray-700';
            default: return '';
        }
    };
    const statusTranslations: { [key: string]: string } = { 'Approved': 'موافق عليه', 'Pending': 'قيد المراجعة', 'Hidden': 'مخفي' };

    const confirmDelete = () => {
        if (reviewToDelete) {
            onDelete(reviewToDelete.productId, reviewToDelete.id);
            setReviewToDelete(null);
        }
    };

    const tabs: {id: Review['status'] | 'All', label: string}[] = [
        {id: 'Pending', label: 'قيد المراجعة'},
        {id: 'Approved', label: 'موافق عليه'},
        {id: 'All', label: 'الكل'},
    ]

    return (
        <div className="space-y-6">
            <Card title="جميع التقييمات">
                <div className="border-b mb-4">
                    <div className="flex items-center gap-4">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)} 
                                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors
                                ${activeTab === tab.id ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                                {tab.label} ({tab.id === 'All' ? allReviews.length : allReviews.filter(r => r.status === tab.id).length})
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto -mx-5">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-4 font-semibold">العميل</th>
                                <th className="p-4 font-semibold">التقييم</th>
                                <th className="p-4 font-semibold">المنتج</th>
                                <th className="p-4 font-semibold">الحالة</th>
                                <th className="p-4 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80">
                            {filteredReviews.map(review => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                     <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={review.image} alt={review.author} className="w-10 h-10 rounded-full"/>
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <p className="text-xs text-gray-500">{review.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex mb-1">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                        </div>
                                        <p className="text-gray-600 max-w-xs truncate" title={review.text}>{review.text}</p>
                                    </td>
                                    <td className="p-4 font-semibold">{review.productName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(review.status)}`}>
                                            {statusTranslations[review.status]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-left">
                                        <div className="flex items-center gap-2 justify-end">
                                            {review.status !== 'Approved' && <button onClick={() => onStatusChange(review.productId, review.id, 'Approved')} title="Approve" className="text-gray-400 hover:text-green-500"><CheckCircleIcon size="sm"/></button>}
                                            {review.status !== 'Hidden' && <button onClick={() => onStatusChange(review.productId, review.id, 'Hidden')} title="Hide" className="text-gray-400 hover:text-gray-600"><EyeIcon size="sm" /></button>}
                                            <button onClick={() => setReviewToDelete(review)} title="Delete" className="text-gray-400 hover:text-red-500"><TrashIcon size="sm"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <ConfirmDeleteModal
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف التقييم"
                itemName={`تقييم بواسطة ${reviewToDelete?.author}`}
            />
        </div>
    );
};

export default ReviewsPage;
