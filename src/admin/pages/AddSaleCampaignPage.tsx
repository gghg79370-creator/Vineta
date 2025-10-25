import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { SaleCampaign } from '../../types';

interface AddSaleCampaignPageProps {
    navigate: (page: string) => void;
    onSave: (campaign: SaleCampaign) => void;
    campaignToEdit?: SaleCampaign;
}

const AddSaleCampaignPage: React.FC<AddSaleCampaignPageProps> = ({ navigate, onSave, campaignToEdit }) => {
    const isEditMode = !!campaignToEdit;

    const [campaign, setCampaign] = useState({
        title: campaignToEdit?.title || '',
        subtitle: campaignToEdit?.subtitle || '',
        discountText: campaignToEdit?.discountText || '',
        couponCode: campaignToEdit?.couponCode || '',
        buttonText: campaignToEdit?.buttonText || 'تسوق الآن',
        image: campaignToEdit?.image || '',
        page: campaignToEdit?.page || 'shop',
        saleEndDate: campaignToEdit?.saleEndDate ? campaignToEdit.saleEndDate.split('T')[0] : '',
        status: campaignToEdit?.status || 'Draft',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const key = name as keyof typeof campaign;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            if (key === 'status') {
                setCampaign(prev => ({...prev, status: e.target.checked ? 'Active' : 'Draft' }));
            }
        } else {
            setCampaign(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleSave = () => {
        const campaignData: SaleCampaign = {
            id: campaignToEdit?.id || 0,
            ...campaign,
            saleEndDate: new Date(campaign.saleEndDate).toISOString(),
            status: campaign.status as 'Active' | 'Draft',
        };
        onSave(campaignData);
    };
    
    const FormInput = ({ label, name, ...props }: {label: string; name: keyof typeof campaign} & React.InputHTMLAttributes<HTMLInputElement>) => (
        <div>
            <label className="admin-form-label">{label}</label>
            <input
                name={name}
                value={campaign[name]}
                onChange={handleChange}
                className="admin-form-input"
                {...props}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEditMode ? 'تعديل حملة التخفيضات' : 'إنشاء حملة تخفيضات جديدة'}</h1>
                <div className="flex gap-2">
                    <button onClick={() => navigate('saleCampaigns')} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الحملة'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="تفاصيل الحملة">
                        <div className="space-y-4">
                            <FormInput label="عنوان الحملة" name="title" required />
                            <FormInput label="عنوان فرعي" name="subtitle" />
                            <FormInput label="نص الخصم (e.g., 50% OFF)" name="discountText" required />
                            <FormInput label="كود الكوبون" name="couponCode" required />
                        </div>
                    </Card>
                     <Card title="الإجراء (Call to Action)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="نص الزر" name="buttonText" />
                             <div>
                                <label className="admin-form-label">الصفحة المستهدفة</label>
                                <select name="page" value={campaign.page} onChange={handleChange} className="admin-form-input">
                                    <option value="shop">صفحة المتجر</option>
                                    <option value="home">الصفحة الرئيسية</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="الحالة">
                         <label className="flex items-center gap-2 cursor-pointer p-2">
                            <input type="checkbox" name="status" checked={campaign.status === 'Active'} onChange={handleChange} className="w-4 h-4 rounded text-admin-accent focus:ring-admin-accent/50" />
                            <span className="font-semibold text-sm">تفعيل الحملة</span>
                        </label>
                    </Card>
                    <Card title="الصورة والفترة الزمنية">
                        <div className="space-y-4">
                            <FormInput label="رابط الصورة" name="image" type="url" placeholder="https://example.com/image.jpg" />
                            <FormInput label="تاريخ انتهاء التخفيض" name="saleEndDate" type="date" required />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddSaleCampaignPage;