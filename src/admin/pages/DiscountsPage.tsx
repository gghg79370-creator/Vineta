import React, { useState } from 'react';
import { AdminDiscount } from '../data/adminData';
import { PlusIcon } from '../../components/icons';
import DiscountListTable from '../components/discounts/DiscountListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

interface DiscountsPageProps {
    discounts: AdminDiscount[];
    navigate: (page: string, data?: any) => void;
    onDeleteDiscounts: (discountIds: number[]) => void;
}

const DiscountsPage: React.FC<DiscountsPageProps> = ({ discounts, navigate, onDeleteDiscounts }) => {
    const [discountToDelete, setDiscountToDelete] = useState<AdminDiscount | null>(null);

    const handleDeleteClick = (discount: AdminDiscount) => {
        setDiscountToDelete(discount);
    };

    const confirmDelete = () => {
        if (discountToDelete) {
            onDeleteDiscounts([discountToDelete.id]);
            setDiscountToDelete(null);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">الخصومات</h1>
                    <p className="text-gray-500 mt-1">إنشاء وإدارة أكواد الخصم.</p>
                </div>
                <button 
                    onClick={() => navigate('addDiscount')}
                    className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إنشاء خصم</span>
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <DiscountListTable 
                    discounts={discounts} 
                    onEdit={(discount) => navigate('editDiscount', discount)}
                    onDelete={handleDeleteClick}
                />
            </div>
            <ConfirmDeleteModal
                isOpen={!!discountToDelete}
                onClose={() => setDiscountToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف الخصم"
                itemName={discountToDelete?.code || ''}
            />
        </div>
    );
};

export default DiscountsPage;