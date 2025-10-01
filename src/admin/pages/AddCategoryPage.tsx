import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminCategory } from '../data/adminData';

interface AddCategoryPageProps {
    navigate: (page: string) => void;
    onSave: (category: AdminCategory) => void;
    categoryToEdit?: AdminCategory;
    categories: AdminCategory[];
}

type CategoryWithChildren = AdminCategory & { children: CategoryWithChildren[] };

// Helper function to get all descendant IDs of a category
const getDescendantIds = (categoryId: number, allCategories: AdminCategory[]): number[] => {
    const children = allCategories.filter(c => c.parentId === categoryId);
    let descendantIds: number[] = children.map(c => c.id);
    children.forEach(child => {
        descendantIds = descendantIds.concat(getDescendantIds(child.id, allCategories));
    });
    return descendantIds;
};


const AddCategoryPage: React.FC<AddCategoryPageProps> = ({ navigate, onSave, categoryToEdit, categories }) => {
    const isEditMode = !!categoryToEdit;

    const [category, setCategory] = useState({
        name: categoryToEdit?.name || '',
        description: categoryToEdit?.description || '',
        parentId: categoryToEdit?.parentId || null,
        status: categoryToEdit?.status || 'Hidden',
    });
    const [image, setImage] = useState<any>(categoryToEdit?.image ? [categoryToEdit.image] : []);

    const categoryTree = useMemo(() => {
        const categoryMap = new Map<number, CategoryWithChildren>();
        const rootCategories: CategoryWithChildren[] = [];

        categories.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] });
        });

        categories.forEach(category => {
            if (category.parentId && categoryMap.has(category.parentId)) {
                categoryMap.get(category.parentId)!.children.push(categoryMap.get(category.id)!);
            } else {
                rootCategories.push(categoryMap.get(category.id)!);
            }
        });

        return rootCategories;
    }, [categories]);
    
    const disabledCategoryIds = useMemo(() => {
        if (!categoryToEdit) return [];
        return [categoryToEdit.id, ...getDescendantIds(categoryToEdit.id, categories)];
    }, [categoryToEdit, categories]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isChecked = e.target.checked;
        const val = type === 'checkbox' ? (isChecked ? 'Visible' : 'Hidden') : value;

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

    const renderCategoryOptions = (categories: CategoryWithChildren[], depth = 0) => {
        const options: React.ReactElement[] = [];
        for (const categoryNode of categories) {
            const isDisabled = disabledCategoryIds.includes(categoryNode.id);
            options.push(
                <option key={categoryNode.id} value={categoryNode.id} disabled={isDisabled} className={isDisabled ? 'text-gray-400' : ''}>
                    {'\u00A0'.repeat(depth * 4)}
                    {depth > 0 ? '↳ ' : ''}{categoryNode.name}
                </option>
            );
            if (categoryNode.children.length > 0) {
                options.push(...renderCategoryOptions(categoryNode.children, depth + 1));
            }
        }
        return options;
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('categories')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ الفئة'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="تفاصيل الفئة">
                        <div className="space-y-4">
                             <div>
                                <label className="admin-form-label">اسم الفئة</label>
                                <input type="text" name="name" value={category.name} onChange={handleChange} className="admin-form-input"/>
                            </div>
                            <div>
                                <label className="admin-form-label">الوصف</label>
                                <textarea name="description" value={category.description} onChange={handleChange} rows={5} className="admin-form-input"></textarea>
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
                                <label className="admin-form-label">الحالة</label>
                                 <label className="flex items-center cursor-pointer p-2">
                                  <div className="relative">
                                    <input type="checkbox" name="status" checked={category.status === 'Visible'} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-accent"></div>
                                  </div>
                                   <span className="ml-3 font-semibold text-sm">{category.status === 'Visible' ? 'مرئي' : 'مخفي'}</span>
                                </label>
                            </div>
                             <div>
                                <label className="admin-form-label">الفئة الأم</label>
                                <select name="parentId" value={category.parentId || 'null'} onChange={handleChange} className="admin-form-input">
                                    <option value="null">لا يوجد (فئة رئيسية)</option>
                                    {renderCategoryOptions(categoryTree)}
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