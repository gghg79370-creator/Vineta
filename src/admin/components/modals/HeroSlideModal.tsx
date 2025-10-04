
import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../../../types';

interface HeroSlideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (slide: HeroSlide) => void;
    slide: HeroSlide | null;
}

const HeroSlideModal: React.FC<HeroSlideModalProps> = ({ isOpen, onClose, onSave, slide }) => {
    const [formData, setFormData] = useState<Partial<HeroSlide>>({});

    useEffect(() => {
        if (slide) {
            setFormData(slide);
        } else {
            setFormData({
                id: 0,
                title: '',
                subtitle: '',
                bgImage: '',
                bgVideo: '',
                buttonText: 'تسوق الآن',
                page: 'shop',
                status: 'Hidden'
            });
        }
    }, [slide, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isChecked = e.target.checked;
        if (name === 'status') {
            setFormData(prev => ({...prev, status: isChecked ? 'Visible' : 'Hidden' }));
        } else {
            setFormData(prev => ({...prev, [name]: value }));
        }
    };
    
    const handleSave = () => {
        if(!formData.title?.trim() || !formData.bgImage?.trim()) {
            alert('العنوان ورابط صورة الخلفية مطلوبان.');
            return;
        }
        onSave(formData as HeroSlide);
    };
    
    const FormInput = ({ label, name, ...props }: {label: string, name: keyof typeof formData} & React.InputHTMLAttributes<HTMLInputElement>) => (
        <div>
            <label className="admin-form-label">{label}</label>
            <input
                name={name}
                value={formData[name] as string || ''}
                onChange={handleChange}
                className="admin-form-input"
                {...props}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">{slide?.id ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}</h3>
                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="العنوان الرئيسي *" name="title" type="text" />
                        <FormInput label="العنوان الفرعي *" name="subtitle" type="text" />
                    </div>
                     <FormInput label="وصف (اختياري)" name="description" type="text" />
                    <FormInput label="رابط صورة الخلفية *" name="bgImage" type="url" placeholder="https://example.com/image.jpg" />
                    <FormInput label="رابط فيديو الخلفية (اختياري)" name="bgVideo" type="url" placeholder="https://example.com/video.mp4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="نص الزر" name="buttonText" type="text" />
                        <div>
                            <label className="admin-form-label">الرابط (الصفحة)</label>
                             <select name="page" value={formData.page || 'shop'} onChange={handleChange} className="admin-form-input">
                                <option value="shop">المتجر</option>
                                <option value="home">الرئيسية</option>
                            </select>
                        </div>
                    </div>
                     <label className="flex items-center gap-2 pt-2 cursor-pointer">
                        <input type="checkbox" name="status" checked={formData.status === 'Visible'} onChange={handleChange} className="w-4 h-4 rounded text-admin-accent focus:ring-admin-accent/50" />
                        <span className="font-semibold text-sm">إظهار الشريحة في الصفحة الرئيسية</span>
                     </label>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50">إلغاء</button>
                    <button onClick={handleSave} className="bg-admin-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-accentHover">حفظ</button>
                </div>
            </div>
        </div>
    );
};

export default HeroSlideModal;