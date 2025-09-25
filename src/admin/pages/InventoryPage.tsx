
import React, { useState, useMemo } from 'react';
import { AdminProduct } from '../data/adminData';
import { Card } from '../components/ui/Card';

interface InventoryPageProps {
    products: AdminProduct[];
    setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ products, setProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('All');

    const handleStockChange = (productId: number, variantId: number, newStock: number) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    return {
                        ...p,
                        variants: p.variants.map(v =>
                            v.id === variantId ? { ...v, stock: newStock } : v
                        ),
                    };
                }
                return p;
            })
        );
    };

    const flattenedInventory = useMemo(() => {
        return products
            .flatMap(p => p.variants.map(v => ({ product: p, variant: v })))
            .filter(({ product, variant }) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                variant.sku.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(({ variant }) => {
                if (availabilityFilter === 'All') return true;
                if (availabilityFilter === 'InStock') return variant.stock > 0;
                if (availabilityFilter === 'OutOfStock') return variant.stock === 0;
                return true;
            });
    }, [products, searchTerm, availabilityFilter]);


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">المخزون</h1>
                <p className="text-gray-500 mt-1">تتبع وإدارة مخزون منتجاتك.</p>
            </div>
            <Card title="جميع المنتجات">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="search"
                        placeholder="بحث بالمنتج أو SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-lg"
                    />
                    <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        <option value="All">كل حالات التوفر</option>
                        <option value="InStock">متوفر</option>
                        <option value="OutOfStock">نفد المخزون</option>
                    </select>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-3 font-semibold">المنتج</th>
                                <th className="p-3 font-semibold">SKU</th>
                                <th className="p-3 font-semibold">المتوفر</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {flattenedInventory.map(({ product, variant }) => (
                                <tr key={`${product.id}-${variant.id}`} className="hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-10 h-12 object-cover rounded-md"/>
                                            <div>
                                                <p className="font-semibold text-gray-800">{product.name}</p>
                                                <p className="text-xs text-gray-500">{Object.values(variant.options).join(' / ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-500">{variant.sku}</td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => handleStockChange(product.id, variant.id, parseInt(e.target.value, 10) || 0)}
                                            className="w-20 border-gray-300 rounded-lg p-1 text-center font-semibold"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default InventoryPage;
