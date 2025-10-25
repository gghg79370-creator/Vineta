
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminDiscount } from '../data/adminData';

interface AddDiscountPageProps {
    navigate: (page: string) => void;
    onSave: (discount: AdminDiscount) => void;
    discountToEdit?: AdminDiscount;
}

const AddDiscountPage: React.FC<AddDiscountPageProps> = ({ navigate, onSave, discountToEdit }) => {
    const isEditMode = !!discountToEdit;

    const [discount, setDiscount] = useState({
        code: discountToEdit?.code || '',
        type: discountToEdit?.type || 'Percentage',
        value: discountToEdit?.value || 0,
        status: discountToEdit?.status || 'Inactive',
        usageLimit: discountToEdit?.usageLimit ?? '',
        startDate: discountToEdit?.startDate || '',
        endDate: discountToEdit?.endDate ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDiscount(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const discountData: AdminDiscount = {
            id: discountToEdit?.id || 0,
            code: discount.code,
            type: discount.type as 'Percentage' | 'Fixed Amount',
            value: Number(discount.value),
            status: discount.status as 'Active' | 'Inactive' | 'Expired',
            usageCount: discountToEdit?.usageCount || 0,
            usageLimit: discount.usageLimit ? Number(discount.usageLimit) : null,
            startDate: discount.startDate,
            endDate: discount.endDate || null,
        };
        onSave(discountData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h1 className="text-2xl font-bold text-admin-text-primary">{isEditMode ? 'تعديل الخصم' : 'إنشاء خصم'}</h1>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('discounts')}
                        className="bg-admin-card-bg border border-admin-border text-admin-text-primary font-bold py-2 px-4 rounded-lg hover:bg-admin-bg transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الخصم'}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="تفاصيل الخصم">
                        <div className="space-y-4">
                            <div>
                                <label className="admin-form-label">كود الخصم</label>
                                <input type="text" name="code" value={discount.code} onChange={handleChange} className="admin-form-input"/>
                                <p className="text-xs text-gray-500 mt-1">سيرى العملاء هذا في صفحة الدفع.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-form-label">نوع الخصم</label>
                                    <select name="type" value={discount.type} onChange={handleChange} className="admin-form-input">
                                        <option value="Percentage">نسبة مئوية</option>
                                        <option value="Fixed Amount">مبلغ ثابت</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="admin-form-label">قيمة الخصم</label>
                                    <input type="number" name="value" value={discount.value} onChange={handleChange} className="admin-form-input"/>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="القيود">
                         <div>
                            <label className="admin-form-label">حد الاستخدام</label>
                            <input type="number" name="usageLimit" value={discount.usageLimit} onChange={handleChange} className="admin-form-input" placeholder="لا يوجد حد"/>
                            <p className="text-xs text-gray-500 mt-1">أدخل إجمالي عدد المرات التي يمكن استخدام هذا الخصم فيها.</p>
                        </div>
                    </Card>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                     <Card title="الحالة">
                        <select name="status" value={discount.status} onChange={handleChange} className="admin-form-input">
                            <option value="Active">نشط</option>
                            <option value="Inactive">غير نشط</option>
                        </select>
                     </Card>
                     <Card title="فترة الصلاحية">
                        <div className="space-y-4">
                             <div>
                                <label className="admin-form-label">تاريخ البدء</label>
                                <input type="date" name="startDate" value={discount.startDate} onChange={handleChange} className="admin-form-input"/>
                            </div>
                             <div>
                                <label className="admin-form-label">تاريخ الانتهاء (اختياري)</label>
                                <input type="date" name="endDate" value={discount.endDate} onChange={handleChange} className="admin-form-input"/>
                            </div>
                        </div>
                     </Card>
                 </div>
            </div>
        </div>
    );
};

export default AddDiscountPage;
