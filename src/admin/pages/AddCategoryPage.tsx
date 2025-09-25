import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminCategory } from '../data/adminData';

interface AddCategoryPageProps {
    navigate: (page: string) => void;
    onSave: (category: AdminCategory) => void;
    categoryToEdit?: AdminCategory;
    categories: AdminCategory[];
}

const AddCategoryPage: React.FC<AddCategoryPageProps> = ({ navigate, onSave, categoryToEdit, categories }) => {
    const isEditMode = !!categoryToEdit;

    const [category, setCategory] = useState({
        name: categoryToEdit?.name || '',
        description: categoryToEdit?.description || '',
        parentId: categoryToEdit?.parentId || null,
        status: categoryToEdit?.status || 'Hidden',
    });
    const [image, setImage] = useState<any>(categoryToEdit?.image ? [categoryToEdit.image] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        // @ts-ignore
        const val = isCheckbox ? (e.target.checked ? 'Visible' : 'Hidden') : value;

        setCategory(prev => ({ ...prev, [name]: name === 'parentId' && val === 'null' ? null : val }));
    };

    const handleSave = () => {
        const categoryData: AdminCategory = {
            id: categoryToEdit?.id || 0,
            name: category.name,
            description: category.description,
            parentId: category.parentId ? Number(category.parentId) : null,
            status: category.status as 'Visible' | 'Hidden',
            image: image.length > 0 ? (typeof image[0] === 'string' ? image[0] : URL.createObjectURL(image[0])) : ''
        };
        onSave(categoryData);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{isEditMode ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h1>
                <div className="flex gap-2">
                    <button onClick={() => navigate('categories')} className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-semibold">إلغاء</button>
                    <button onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الفئة'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="تفاصيل الفئة">
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفئة</label>
                                <input type="text" name="name" value={category.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                                <textarea name="description" value={category.description} onChange={handleChange} rows={5} className="w-full border-gray-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </Card>
                     <Card title="صورة الفئة">
                        <ImageUpload initialImages={categoryToEdit?.image ? [categoryToEdit.image] : []} onImagesChange={setImage} />
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="التنظيم">
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                                 <label className="flex items-center cursor-pointer p-2">
                                  <div className="relative">
                                    <input type="checkbox" name="status" checked={category.status === 'Visible'} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                  </div>
                                   <span className="ml-3 font-semibold text-sm">{category.status === 'Visible' ? 'مرئي' : 'مخفي'}</span>
                                </label>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة الأم</label>
                                <select name="parentId" value={category.parentId || 'null'} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                    <option value="null">لا يوجد</option>
                                    {categories.filter(c => c.id !== categoryToEdit?.id).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryPage;