import React, { useState, useMemo } from 'react';
import { AdminCategory, AdminProduct } from '../data/adminData';
import { PlusIcon } from '../../components/icons';
import CategoryListTable from '../components/categories/CategoryListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Pagination } from '../components/ui/Pagination';
import { Card } from '../components/ui/Card';

interface CategoriesPageProps {
    navigate: (page: string, data?: any) => void;
    categories: AdminCategory[];
    products: AdminProduct[];
    onDeleteCategory: (categoryId: number) => void;
    onSaveCategory: (category: AdminCategory) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate, categories, products, onDeleteCategory, onSaveCategory }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);

    const categoriesPerPage = 10;
    
    const categoriesWithProductCount = useMemo(() => {
        return categories.map(category => ({
            ...category,
            productCount: products.filter(p => p.category === category.name.toLowerCase()).length // This is a simplification
        }));
    }, [categories, products]);

    type CategoryWithChildren = AdminCategory & { productCount: number; children: CategoryWithChildren[] };
    
    const sortedCategories = useMemo(() => {
        const categoryMap = new Map<number, CategoryWithChildren>(
            categoriesWithProductCount.map(c => [c.id, { ...c, children: [] }])
        );
        const rootCategories: CategoryWithChildren[] = [];

        for (const category of categoriesWithProductCount) {
            const categoryNode = categoryMap.get(category.id)!;
            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryNode);
                }
            } else {
                rootCategories.push(categoryNode);
            }
        }
        
        const flattened: (CategoryWithChildren & { depth: number })[] = [];
        function flatten(cats: CategoryWithChildren[], depth: number) {
            for (const cat of cats) {
                flattened.push({ ...cat, depth });
                if (cat.children.length) {
                    flatten(cat.children, depth + 1);
                }
            }
        }
        flatten(rootCategories, 0);
        return flattened;
    }, [categoriesWithProductCount]);


    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = sortedCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);

    const handleDeleteClick = (category: AdminCategory) => {
        setCategoryToDelete(category);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            onDeleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
        }
    };

    const handleSaveCategoryName = (id: number) => {
        if (!editingCategory || editingCategory.id !== id) return;
        const categoryToUpdate = categories.find(c => c.id === id);
        if (categoryToUpdate && editingCategory.name.trim()) {
            onSaveCategory({ ...categoryToUpdate, name: editingCategory.name });
        }
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <button
                    onClick={() => navigate('addCategory')}
                    className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إضافة فئة</span>
                </button>
            </div>
            <Card title="جميع الفئات">
                 <CategoryListTable 
                    categories={currentCategories}
                    onEdit={(category) => navigate('editCategory', category)}
                    onDelete={handleDeleteClick}
                    editingCategory={editingCategory}
                    setEditingCategory={setEditingCategory}
                    onSave={handleSaveCategoryName}
                />
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </Card>
             <ConfirmDeleteModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف الفئة"
                itemName={categoryToDelete?.name || ''}
                confirmationText="حذف"
            />
        </div>
    );
};

export default CategoriesPage;