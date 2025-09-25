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
        usageLimit: discountToEdit?.usageLimit || '',
        startDate: discountToEdit?.startDate || '',
        endDate: discountToEdit?.endDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        // @ts-ignore
        const val = isCheckbox ? (e.target.checked ? 'Active' : 'Inactive') : value;
        setDiscount(prev => ({ ...prev, [name]: val }));
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'تعديل الخصم' : 'إنشاء خصم جديد'}</h1>
                    <p className="text-gray-500 mt-1">{isEditMode ? 'قم بتحديث تفاصيل الخصم أدناه.' : 'املأ التفاصيل أدناه لإنشاء خصم جديد.'}</p>
                </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('discounts')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الخصم'}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="تفاصيل الخصم">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">كود الخصم</label>
                                <input type="text" name="code" value={discount.code} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                                <p className="text-xs text-gray-500 mt-1">سيرى العملاء هذا في صفحة الدفع.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم</label>
                                    <select name="type" value={discount.type} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                        <option value="Percentage">نسبة مئوية</option>
                                        <option value="Fixed Amount">مبلغ ثابت</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">قيمة الخصم</label>
                                    <input type="number" name="value" value={discount.value} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="القيود">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">حد الاستخدام</label>
                            <input type="number" name="usageLimit" value={discount.usageLimit} onChange={handleChange} className="w-full border-gray-300 rounded-lg" placeholder="لا يوجد حد"/>
                            <p className="text-xs text-gray-500 mt-1">أدخل إجمالي عدد المرات التي يمكن استخدام هذا الخصم فيها.</p>
                        </div>
                    </Card>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                     <Card title="الحالة">
                         <label className="flex items-center cursor-pointer p-2">
                          <div className="relative">
                            <input type="checkbox" name="status" checked={discount.status === 'Active'} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </div>
                           <span className="ml-3 font-semibold text-sm">{discount.status === 'Active' ? 'نشط' : 'غير نشط'}</span>
                        </label>
                     </Card>
                     <Card title="فترة الصلاحية">
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                                <input type="date" name="startDate" value={discount.startDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                                <input type="date" name="endDate" value={discount.endDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                        </div>
                     </Card>
                 </div>
            </div>
        </div>
    );
};

export default AddDiscountPage;