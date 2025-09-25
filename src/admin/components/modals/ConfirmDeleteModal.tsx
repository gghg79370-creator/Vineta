import React from 'react';
import { TrashIcon } from '../../../components/icons';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    title: string;
    description?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName, title, description }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg transform transition-all duration-300 animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 mx-auto rounded-full flex items-center justify-center mb-4">
                        <TrashIcon size="lg" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500 mt-2">
                        {description || `هل أنت متأكد أنك تريد حذف "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                        إلغاء
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                        نعم, احذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
