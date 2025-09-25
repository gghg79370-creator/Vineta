import React from 'react';
import { AdminProduct } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface ProductListTableProps {
    products: AdminProduct[];
    selectedProducts: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (productId: number) => void;
    onEdit: (product: AdminProduct) => void;
    onDelete: (product: AdminProduct) => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({ products, selectedProducts, onSelectAll, onSelectOne, onEdit, onDelete }) => {

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-100 text-green-700';
            case 'Draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const getStockInfo = (product: AdminProduct) => {
        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        const variantCount = product.variants.length;
        
        let stockClass = 'text-gray-700';
        if (totalStock === 0) stockClass = 'text-red-500 font-bold';
        else if (totalStock <= 10) stockClass = 'text-yellow-600 font-bold';
        
        return { totalStock, variantCount, stockClass };
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 w-4">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                onChange={onSelectAll}
                                checked={products.length > 0 && selectedProducts.length === products.length}
                            />
                        </th>
                        <th className="p-3 font-semibold">المنتج</th>
                        <th className="p-3 font-semibold">SKU</th>
                        <th className="p-3 font-semibold">المخزون</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.map(product => {
                        const { totalStock, variantCount, stockClass } = getStockInfo(product);
                        return (
                            <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.includes(product.id) ? 'bg-primary-50' : ''}`}>
                                <td className="p-3">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => onSelectOne(product.id)}
                                    />
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-md"/>
                                        <div>
                                            <span className="font-semibold text-gray-800">{product.name}</span>
                                            <p className="text-xs text-gray-500">{product.price} ج.م</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-500">{product.sku}</td>
                                <td className="p-3">
                                    <span className={stockClass}>
                                        {totalStock} 
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {variantCount > 1 ? ` في ${variantCount} متغيرات` : ' في المخزن'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(product.status)}`}>
                                        {product.status === 'Published' ? 'منشور' : 'مسودة'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-primary-600 p-1"><PencilIcon size="sm"/></button>
                                        <button onClick={() => onDelete(product)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};