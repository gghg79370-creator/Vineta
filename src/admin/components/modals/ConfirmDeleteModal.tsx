import React, { useState, useEffect } from 'react';
import { TrashIcon } from '../../../components/icons';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    title: string;
    description?: string;
    confirmationText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName, title, description, confirmationText }) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isConfirmationRequired = !!confirmationText;
    const isConfirmDisabled = isConfirmationRequired && inputValue !== confirmationText;

    const handleConfirm = () => {
        if (!isConfirmDisabled) {
            onConfirm();
        }
    };

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
                    {isConfirmationRequired && (
                        <div className="mt-4 text-right">
                            <label className="text-sm font-medium text-gray-700">
                                للتأكيد، اكتب "<span className="font-bold text-red-600">{confirmationText}</span>" أدناه:
                            </label>
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="mt-1 w-full border-gray-300 rounded-lg text-center"
                                autoFocus
                            />
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                        إلغاء
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={isConfirmDisabled}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        نعم, احذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;