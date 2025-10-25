
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminPage } from '../data/adminData';

interface AddEditPageProps {
    navigate: (page: string) => void;
    onSave: (page: AdminPage) => void;
    pageToEdit?: AdminPage;
}

const AddEditPage: React.FC<AddEditPageProps> = ({ navigate, onSave, pageToEdit }) => {
    const isEditMode = !!pageToEdit;

    const [page, setPage] = useState({
        title: pageToEdit?.title || '',
        content: pageToEdit?.content || '',
        status: pageToEdit?.status || 'Hidden',
        slug: pageToEdit?.slug || '',
        seoTitle: pageToEdit?.seoTitle || '',
        seoDescription: pageToEdit?.seoDescription || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPage(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const pageData: AdminPage = {
            id: pageToEdit?.id || 0,
            title: page.title,
            content: page.content,
            status: page.status as 'Published' | 'Hidden',
            slug: page.slug || page.title.toLowerCase().replace(/\s+/g, '-'),
            lastModified: new Date().toISOString().split('T')[0],
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
        };
        onSave(pageData);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEditMode ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}</h1>
                <div className="flex gap-2">
                    <button onClick={() => navigate('pages')} className="bg-admin-card-bg border border-admin-border text-admin-text-primary font-bold py-2 px-4 rounded-lg hover:bg-admin-bg">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover">
                        {isEditMode ? 'حفظ التغييرات' : 'نشر الصفحة'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="محتوى الصفحة">
                        <div className="space-y-4">
                            <div>
                                <label className="admin-form-label">العنوان</label>
                                <input type="text" name="title" value={page.title} onChange={handleChange} className="admin-form-input"/>
                            </div>
                            <div>
                                <label className="admin-form-label">المحتوى (HTML)</label>
                                <textarea name="content" rows={15} value={page.content} onChange={handleChange} className="admin-form-input font-mono text-xs"></textarea>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="الحالة">
                        <select name="status" value={page.status} onChange={handleChange} className="admin-form-input">
                            <option value="Published">منشورة</option>
                            <option value="Hidden">مخفية</option>
                        </select>
                    </Card>
                    <Card title="معاينة محرك البحث">
                        <div>
                            <label className="admin-form-label">الرابط</label>
                            <div className="flex items-center">
                                <span className="text-sm text-admin-text-secondary">/pages/</span>
                                <input type="text" name="slug" value={page.slug} onChange={handleChange} className="admin-form-input p-1" />
                            </div>
                        </div>
                         <div className="mt-4">
                            <label className="admin-form-label">عنوان SEO</label>
                            <input type="text" name="seoTitle" value={page.seoTitle} onChange={handleChange} className="admin-form-input" />
                        </div>
                        <div className="mt-4">
                            <label className="admin-form-label">وصف SEO</label>
                            <textarea name="seoDescription" value={page.seoDescription} onChange={handleChange} rows={4} className="admin-form-input"></textarea>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddEditPage;
