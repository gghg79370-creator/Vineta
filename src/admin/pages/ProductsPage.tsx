
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AdminProduct } from '../data/adminData';
import { ProductListTable } from '../components/products/ProductListTable';
import { Pagination } from '../components/ui/Pagination';
import { TrashIcon, CheckCircleIcon, XCircleIcon, PlusIcon } from '../../components/icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Card } from '../components/ui/Card';
import Fab from '../components/ui/Fab';
import { useToast } from '../../hooks/useToast';

interface ProductsPageProps {
    navigate: (page: string, data?: any) => void;
    products: AdminProduct[];
    onDeleteProducts: (productIds: number[]) => void;
    onPublishProducts: (productIds: number[], publish: boolean) => void;
    onDuplicateProduct: (product: AdminProduct) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ navigate, products, onDeleteProducts, onPublishProducts, onDuplicateProduct }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [onSaleFilter, setOnSaleFilter] = useState('All');
    const [productToDelete, setProductToDelete] = useState<AdminProduct[] | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const addToast = useToast();
    const isInitialMount = useRef(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        
        if (isInitialMount.current) {
            addToast("نصيحة: اضغط على '/' للبحث بسرعة.", 'info');
            isInitialMount.current = false;
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const productsPerPage = 10;

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => statusFilter === 'All' || p.status === statusFilter)
            .filter(p => {
                if (stockFilter === 'All') return true;
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                if (stockFilter === 'InStock') return totalStock > 10;
                if (stockFilter === 'LowStock') return totalStock > 0 && totalStock <= 10;
                if (stockFilter === 'OutOfStock') return totalStock === 0;
                return true;
            })
            .filter(p => {
                if (onSaleFilter === 'All') return true;
                if (onSaleFilter === 'On Sale') return !!p.compareAtPrice;
                if (onSaleFilter === 'Not On Sale') return !p.compareAtPrice;
                return true;
            });
    }, [products, searchTerm, statusFilter, stockFilter, onSaleFilter]);

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
            addToast(`${productToDelete.length} ${productToDelete.length > 1 ? 'products' : 'product'} deleted.`, 'success');
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
    
    const filtersAreActive = statusFilter !== 'All' || stockFilter !== 'All' || onSaleFilter !== 'All' || searchTerm !== '';
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setStockFilter('All');
        setOnSaleFilter('All');
        setCurrentPage(1);
    };

    const handleBulkPublish = (publish: boolean) => {
        onPublishProducts(selectedProducts, publish);
        addToast(`${selectedProducts.length} products have been ${publish ? 'published' : 'unpublished'}.`, 'success');
        setSelectedProducts([]);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <h1 className="text-2xl font-bold text-admin-text-primary hidden md:block">المنتجات</h1>
                 <button 
                    onClick={() => navigate('addProduct')}
                    className="bg-admin-accent text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إضافة منتج</span>
                </button>
            </div>
            <Card title="جميع المنتجات">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="بحث بالاسم... (اضغط /)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-form-input w-full md:w-1/3"
                        />
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-form-input w-full md:w-auto">
                            <option value="All">كل الحالات</option>
                            <option value="Published">منشور</option>
                            <option value="Draft">مسودة</option>
                        </select>
                         <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="admin-form-input w-full md:w-auto">
                            <option value="All">كل المخزون</option>
                            <option value="InStock">متوفر</option>
                            <option value="LowStock">مخزون منخفض</option>
                            <option value="OutOfStock">نفد</option>
                        </select>
                        <select value={onSaleFilter} onChange={e => setOnSaleFilter(e.target.value)} className="admin-form-input w-full md:w-auto">
                            <option value="All">كل حالات الخصم</option>
                            <option value="On Sale">عليه خصم</option>
                            <option value="Not On Sale">ليس عليه خصم</option>
                        </select>
                        {filtersAreActive && (
                            <button onClick={clearFilters} className="text-sm font-semibold text-admin-accent hover:underline whitespace-nowrap">
                                مسح الفلاتر
                            </button>
                        )}
                    </div>

                    {selectedProducts.length > 0 && (
                        <div className="bg-admin-accent/10 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                            <p className="font-semibold text-sm text-admin-accent">{selectedProducts.length} منتج محدد</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleBulkPublish(true)} className="font-semibold text-sm text-admin-accent hover:underline flex items-center gap-1"><CheckCircleIcon size="sm"/> نشر</button>
                                <button onClick={() => handleBulkPublish(false)} className="font-semibold text-sm text-admin-accent hover:underline flex items-center gap-1"><XCircleIcon size="sm"/> إلغاء النشر</button>
                                <div className="w-px h-5 bg-admin-accent/20"></div>
                                <button onClick={() => handleDeleteClick(products.filter(p => selectedProducts.includes(p.id)))} className="font-semibold text-sm text-red-600 hover:underline flex items-center gap-1"><TrashIcon size="sm" /> حذف</button>
                            </div>
                        </div>
                    )}
                    
                    {currentProducts.length > 0 ? (
                        <>
                            <ProductListTable 
                                products={currentProducts}
                                selectedProducts={selectedProducts}
                                onSelectAll={handleSelectAll}
                                onSelectOne={handleSelectOne}
                                onEdit={(product) => navigate('editProduct', product)}
                                onDelete={(product) => handleDeleteClick([product])}
                                onDuplicate={onDuplicateProduct}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </>
                    ) : (
                         <div className="text-center py-16">
                            <h3 className="text-lg font-bold text-gray-800">لم يتم العثور على منتجات</h3>
                            <p className="text-gray-500 mt-2">حاول ضبط البحث أو الفلاتر للعثور على ما تبحث عنه.</p>
                            {filtersAreActive && (
                                <button onClick={clearFilters} className="mt-4 bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover">
                                    مسح الفلاتر
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Card>
            <ConfirmDeleteModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف المنتج"
                itemName={productToDelete?.length === 1 ? productToDelete[0].name : `${productToDelete?.length} منتجات`}
                confirmationText="حذف"
            />
             <Fab onClick={() => navigate('addProduct')} />
        </div>
    );
};

export default ProductsPage;
