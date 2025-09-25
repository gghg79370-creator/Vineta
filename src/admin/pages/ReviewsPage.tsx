
import React, { useState, useMemo } from 'react';
import { AdminProduct } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { Review } from '../../../types';
import { StarIcon, CheckCircleIcon, XCircleIcon, TrashIcon, EyeIcon } from '../../components/icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

interface ReviewWithProductInfo extends Review {
    productName: string;
    productId: number;
}
interface ReviewsPageProps {
    products: AdminProduct[];
    onStatusChange: (productId: number, reviewId: number, status: Review['status']) => void;
    onDelete: (productId: number, reviewId: number) => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ products, onStatusChange, onDelete }) => {
    const [statusFilter, setStatusFilter] = useState<Review['status'] | 'All'>('All');
    const [reviewToDelete, setReviewToDelete] = useState<ReviewWithProductInfo | null>(null);

    const allReviews = useMemo(() => {
        return products.flatMap(p => p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id })));
    }, [products]);
    
    const filteredReviews = useMemo(() => {
        return allReviews.filter(r => statusFilter === 'All' || r.status === statusFilter);
    }, [allReviews, statusFilter]);

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">تقييمات المنتجات</h1>
                <p className="text-gray-500 mt-1">إدارة التقييمات والتعليقات من عملائك.</p>
            </div>
            <Card title="جميع التقييمات">
                 <div className="mb-4">
                     <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        <option value="All">كل الحالات</option>
                        <option value="Pending">قيد المراجعة</option>
                        <option value="Approved">موافق عليه</option>
                        <option value="Hidden">مخفي</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-3 font-semibold">العميل</th>
                                <th className="p-3 font-semibold">التقييم</th>
                                <th className="p-3 font-semibold">المنتج</th>
                                <th className="p-3 font-semibold">الحالة</th>
                                <th className="p-3 font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredReviews.map(review => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={review.image} alt={review.author} className="w-10 h-10 rounded-full"/>
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <p className="text-xs text-gray-400">{review.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => <StarIcon key={i} size="sm"/>)}
                                        </div>
                                        <p className="text-gray-600 mt-1 line-clamp-2">{review.text}</p>
                                    </td>
                                    <td className="p-3 font-semibold text-primary-600 hover:underline cursor-pointer">{review.productName}</td>
                                    <td className="p-3">
                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(review.status)}`}>
                                            {statusTranslations[review.status]}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            {review.status !== 'Approved' && <button onClick={() => onStatusChange(review.productId, review.id, 'Approved')} className="text-gray-400 hover:text-green-600 p-1" title="موافقة"><CheckCircleIcon size="sm"/></button>}
                                            {review.status !== 'Hidden' && <button onClick={() => onStatusChange(review.productId, review.id, 'Hidden')} className="text-gray-400 hover:text-gray-600 p-1" title="إخفاء"><EyeIcon size="sm"/></button>}
                                            <button onClick={() => setReviewToDelete(review)} className="text-gray-400 hover:text-red-500 p-1" title="حذف"><TrashIcon size="sm"/></button>
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
                itemName={`تقييم من ${reviewToDelete?.author}`}
            />
        </div>
    );
};

export default ReviewsPage;