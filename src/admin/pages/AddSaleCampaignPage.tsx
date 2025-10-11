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
        // @ts-ignore
        const isChecked = e.target.checked;
        if (type === 'checkbox') {
            setCampaign(prev => ({...prev, [name]: isChecked ? 'Active' : 'Draft' }));
        } else {
            setCampaign(prev => ({ ...prev, [name]: value }));
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

    const FormInput = ({ label, name, ...props }: {label: string, name: keyof typeof campaign} & React.InputHTMLAttributes<HTMLInputElement>) => (
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('saleCampaigns')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الحملة'}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="محتوى الحملة">
                        <div className="space-y-4">
                           <FormInput label="العنوان الفرعي (مثل: عرض حصري)" name="subtitle" type="text" />
                           <FormInput label="نص الخصم (مثل: خصم 50%)" name="discountText" type="text" />
                           <FormInput label="العنوان الرئيسي (مثل: استخدم الكود عند الدفع)" name="title" type="text" />
                           <FormInput label="كود الكوبون" name="couponCode" type="text" />
                           <FormInput label="نص الزر" name="buttonText" type="text" />
                           <FormInput label="رابط الصورة" name="image" type="url" placeholder="https://example.com/image.jpg" />
                        </div>
                    </Card>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                     <Card title="الحالة">
                        <label className="flex items-center cursor-pointer p-2">
                          <div className="relative">
                            <input type="checkbox" name="status" checked={campaign.status === 'Active'} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-accent"></div>
                          </div>
                           <span className="ml-3 font-semibold text-sm">{campaign.status === 'Active' ? 'نشطة' : 'مسودة'}</span>
                        </label>
                     </Card>
                     <Card title="الجدولة">
                        <div className="space-y-4">
                             <div>
                                <label className="admin-form-label">تاريخ انتهاء الصلاحية</label>
                                <input type="date" name="saleEndDate" value={campaign.saleEndDate} onChange={handleChange} className="admin-form-input"/>
                            </div>
                        </div>
                     </Card>
                 </div>
            </div>
        </div>
    );
};

export default AddSaleCampaignPage;
