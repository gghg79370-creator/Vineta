import React from 'react';
import { AdminProduct } from '../../data/adminData';
import { PencilIcon, TrashIcon, FireIcon, DocumentDuplicateIcon } from '../../../components/icons';

interface ProductListTableProps {
    products: AdminProduct[];
    selectedProducts: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (productId: number) => void;
    onEdit: (product: AdminProduct) => void;
    onDelete: (product: AdminProduct) => void;
    onDuplicate: (product: AdminProduct) => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({ products, selectedProducts, onSelectAll, onSelectOne, onEdit, onDelete, onDuplicate }) => {

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getStockInfo = (product: AdminProduct) => {
        const totalStock = product.variants && product.variants.length > 0
            ? product.variants.reduce((acc, v) => acc + v.stock, 0)
            : product.stock;
        
        let statusText = 'متوفر';
        let statusClass = 'bg-green-100 text-green-800';

        if (totalStock === 0) {
            statusText = 'نفد المخزون';
            statusClass = 'bg-red-100 text-red-800';
        } else if (totalStock <= 10) {
            statusText = 'مخزون منخفض';
            statusClass = 'bg-amber-100 text-amber-800';
        }
        
        return { totalStock, statusText, statusClass };
    };

    return (
        <div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {products.map(product => {
                    const stockInfo = getStockInfo(product);
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                        <div key={product.id} className={`bg-admin-card-bg p-4 rounded-lg shadow-sm border ${isSelected ? 'border-admin-accent ring-1 ring-admin-accent' : 'border-admin-border'}`}>
                            <div className="flex items-start gap-4">
                                <div className="flex items-center flex-shrink-0 gap-3">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                        checked={isSelected}
                                        onChange={() => onSelectOne(product.id)}
                                        aria-label={`Select product ${product.name}`}
                                    />
                                    <img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-md"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-admin-text-primary">{product.name}</p>
                                    <p className="text-xs text-admin-text-secondary">{product.sku}</p>
                                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${getStatusClasses(product.status)}`}>
                                        {product.status === 'Published' ? 'منشور' : 'مسودة'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-admin-border flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stockInfo.statusClass}`}>
                                        {stockInfo.statusText}: {stockInfo.totalStock}
                                    </span>
                                    {product.unitsSold && (
                                        <div className="flex items-center gap-1 text-xs font-semibold text-admin-text-secondary">
                                            <FireIcon size="sm" className="text-orange-500" />
                                            <span>{product.unitsSold}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onDuplicate(product)} className="text-gray-400 hover:text-admin-accent p-1" aria-label={`Duplicate ${product.name}`}><DocumentDuplicateIcon size="sm"/></button>
                                    <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-admin-accent p-1" aria-label={`Edit ${product.name}`}><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(product)} className="text-gray-400 hover:text-red-500 p-1" aria-label={`Delete ${product.name}`}><TrashIcon size="sm"/></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto -mx-5">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 dark:bg-gray-800/20 text-admin-text-secondary">
                        <tr>
                            <th className="p-4 w-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                    onChange={onSelectAll}
                                    checked={products.length > 0 && selectedProducts.length === products.length}
                                    aria-label="Select all products on this page"
                                />
                            </th>
                            <th className="p-4 font-semibold text-right">المنتج</th>
                            <th className="p-4 font-semibold text-right">SKU</th>
                            <th className="p-4 font-semibold text-right">المخزون</th>
                            <th className="p-4 font-semibold text-right">المبيعات</th>
                            <th className="p-4 font-semibold text-right">الحالة</th>
                            <th className="p-4 font-semibold text-right">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {products.map(product => {
                            const { totalStock, statusText, statusClass } = getStockInfo(product);
                            return (
                                <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/20 ${selectedProducts.includes(product.id) ? 'bg-admin-accent/5' : ''}`}>
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => onSelectOne(product.id)}
                                            aria-label={`Select product ${product.name}`}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-md"/>
                                            <div>
                                                <span className="font-semibold text-admin-text-primary">{product.name}</span>
                                                <p className="text-xs text-admin-text-secondary">{product.price} ج.م</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-admin-text-secondary">{product.sku}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="font-bold text-admin-text-primary">{totalStock} <span className="font-normal text-admin-text-secondary">في المخزن</span></span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusClass}`}>
                                                {statusText}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-admin-text-secondary">
                                        {product.unitsSold ? (
                                            <div className="flex items-center gap-1.5 font-semibold text-admin-text-primary">
                                                {product.unitsSold > 100 && <FireIcon size="sm" className="text-orange-500" />}
                                                <span>{product.unitsSold}</span>
                                            </div>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusClasses(product.status)}`}>
                                            {product.status === 'Published' ? 'منشور' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onDuplicate(product)} className="text-gray-400 hover:text-admin-accent p-1" aria-label={`Duplicate ${product.name}`}><DocumentDuplicateIcon size="sm"/></button>
                                            <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-admin-accent p-1" aria-label={`Edit ${product.name}`}><PencilIcon size="sm"/></button>
                                            <button onClick={() => onDelete(product)} className="text-gray-400 hover:text-red-500 p-1" aria-label={`Delete ${product.name}`}><TrashIcon size="sm"/></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};