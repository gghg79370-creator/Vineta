import React, { useState } from 'react';
import { AdminDiscount } from '../data/adminData';
import { PlusIcon } from '../../components/icons';
import DiscountListTable from '../components/discounts/DiscountListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Card } from '../components/ui/Card';

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
             <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <button 
                    onClick={() => navigate('addDiscount')}
                    className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إنشاء خصم</span>
                </button>
            </div>
            <Card title="جميع الخصومات">
                <DiscountListTable 
                    discounts={discounts} 
                    onEdit={(discount) => navigate('editDiscount', discount)}
                    onDelete={handleDeleteClick}
                />
            </Card>
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