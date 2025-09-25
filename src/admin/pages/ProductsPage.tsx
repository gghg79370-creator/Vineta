import React, { useState, useMemo } from 'react';
import { AdminProduct } from '../data/adminData';
import { ProductListTable } from '../components/products/ProductListTable';
import { Pagination } from '../components/ui/Pagination';
import { PlusIcon, TrashIcon } from '../../components/icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

interface ProductsPageProps {
    navigate: (page: string, data?: any) => void;
    products: AdminProduct[];
    onDeleteProducts: (productIds: number[]) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ navigate, products, onDeleteProducts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [productToDelete, setProductToDelete] = useState<AdminProduct[] | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    const productsPerPage = 10;

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => statusFilter === 'All' || p.status === statusFilter)
            .filter(p => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                if (stockFilter === 'All') return true;
                if (stockFilter === 'InStock') return totalStock > 0;
                if (stockFilter === 'LowStock') return totalStock > 0 && totalStock <= 10;
                if (stockFilter === 'OutOfStock') return totalStock === 0;
                return true;
            });
    }, [products, searchTerm, statusFilter, stockFilter]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleDeleteClick = (productsToDelete: AdminProduct[]) => {
        setProductToDelete(productsToDelete);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            onDeleteProducts(productToDelete.map(p => p.id));
            setProductToDelete(null);
            setSelectedProducts([]);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(currentProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    }

    const handleSelectOne = (productId: number) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
                    <p className="text-gray-500 mt-1">إدارة المنتجات في متجرك.</p>
                </div>
                <button 
                    onClick={() => navigate('addProduct')}
                    className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إضافة منتج</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="بحث بالاسم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-lg"
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        <option value="All">كل الحالات</option>
                        <option value="Published">منشور</option>
                        <option value="Draft">مسودة</option>
                    </select>
                     <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        <option value="All">كل المخزون</option>
                        <option value="InStock">متوفر</option>
                        <option value="LowStock">مخزون منخفض</option>
                        <option value="OutOfStock">نفد</option>
                    </select>
                </div>

                {selectedProducts.length > 0 && (
                    <div className="bg-primary-50 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                        <p className="font-semibold text-sm text-primary-700">{selectedProducts.length} منتج محدد</p>
                        <div className="flex items-center gap-3">
                            <button className="font-semibold text-sm text-primary-700 hover:underline">نشر</button>
                             <button className="font-semibold text-sm text-primary-700 hover:underline">إلغاء النشر</button>
                             <div className="w-px h-5 bg-primary-200"></div>
                             <button onClick={() => handleDeleteClick(products.filter(p => selectedProducts.includes(p.id)))} className="font-semibold text-sm text-red-600 hover:underline flex items-center gap-1"><TrashIcon size="sm" /> حذف</button>
                        </div>
                    </div>
                )}
                
                <ProductListTable 
                    products={currentProducts}
                    selectedProducts={selectedProducts}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    onEdit={(product) => navigate('editProduct', product)}
                    onDelete={(product) => handleDeleteClick([product])}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
            <ConfirmDeleteModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف المنتج"
                itemName={productToDelete?.length === 1 ? productToDelete[0].name : `${productToDelete?.length} منتجات`}
            />
        </div>
    );
};

export default ProductsPage;