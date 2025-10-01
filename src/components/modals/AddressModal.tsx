
import React, { useState, useEffect } from 'react';
import { Address } from '../../types';
import { CloseIcon } from '../icons';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Omit<Address, 'id'> | Address) => void;
    addressToEdit?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, addressToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        recipientName: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'مصر',
        type: 'الشحن' as Address['type'],
        isDefault: false
    });
     const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            if (addressToEdit) {
                setFormData({
                    name: addressToEdit.name,
                    recipientName: addressToEdit.recipientName,
                    street: addressToEdit.street,
                    city: addressToEdit.city,
                    postalCode: addressToEdit.postalCode,
                    country: addressToEdit.country,
                    type: addressToEdit.type,
                    isDefault: addressToEdit.isDefault,
                });
            } else {
                setFormData({ name: '', recipientName: '', street: '', city: '', postalCode: '', country: 'مصر', type: 'الشحن', isDefault: false });
            }
            setErrors({});
        }
    }, [isOpen, addressToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'اسم العنوان مطلوب.';
        if (!formData.recipientName.trim()) newErrors.recipientName = 'اسم المستلم مطلوب.';
        if (!formData.street.trim()) newErrors.street = 'الشارع مطلوب.';
        if (!formData.city.trim()) newErrors.city = 'المدينة/المحافظة مطلوبة.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const addressData = addressToEdit ? { ...addressToEdit, ...formData } : formData;
        onSave(addressData);
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg text-brand-dark">{addressToEdit ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-brand-text mb-1">اسم العنوان (مثل: المنزل، العمل)</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg border-brand-border" required/>
                         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-brand-text mb-1">اسم المستلم</label>
                        <input name="recipientName" value={formData.recipientName} onChange={handleChange} className="w-full border p-2 rounded-lg border-brand-border" required/>
                         {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-brand-text mb-1">الشارع</label>
                        <textarea name="street" value={formData.street} onChange={handleChange} rows={2} className="w-full border p-2 rounded-lg border-brand-border" required></textarea>
                         {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-brand-text mb-1">المدينة / المحافظة</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded-lg border-brand-border" required/>
                             {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-text mb-1">الرمز البريدي</label>
                            <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full border p-2 rounded-lg border-brand-border"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-brand-text mb-1">الدولة</label>
                        <select name="country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded-lg border-brand-border bg-white">
                            <option value="مصر">مصر</option>
                            <option value="السعودية">السعودية</option>
                            <option value="الإمارات">الإمارات</option>
                        </select>
                    </div>
                     <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark"/>
                            <span className="font-semibold">تعيين كعنوان افتراضي</span>
                        </label>
                    </div>
                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-white border border-brand-border text-brand-dark font-bold py-2 px-6 rounded-full">إلغاء</button>
                        <button type="submit" className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
