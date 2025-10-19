import React, { useState, useMemo } from 'react';
import { AdminProduct, AdminVariant } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { useToast } from '../../hooks/useToast';
import { MinusIcon, PlusIcon } from '../../components/icons';

interface InventoryPageProps {
    products: AdminProduct[];
    setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ products, setProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('All');
    const [editedStocks, setEditedStocks] = useState<{ [key: string]: number }>({});
    const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
    const [bulkUpdateValue, setBulkUpdateValue] = useState<number>(0);
    const addToast = useToast();

    type VariantWithProductInfo = { product: AdminProduct; variant: AdminVariant };

    const flattenedInventory: VariantWithProductInfo[] = useMemo(() => {
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

    const handleStockChange = (productId: number, variantId: number, newStock: number) => {
        const key = `${productId}-${variantId}`;
        setEditedStocks(prev => ({ ...prev, [key]: Math.max(0, newStock) }));
    };

    const handleSaveStock = (productId: number, variantId: number) => {
        const key = `${productId}-${variantId}`;
        const newStock = editedStocks[key];

        if (newStock === undefined) return;

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
        
        setEditedStocks(prev => {
            const newEdits = { ...prev };
            delete newEdits[key];
            return newEdits;
        });

        addToast('تم تحديث المخزون!', 'success');
    };

    const handleSelectVariant = (productId: number, variantId: number) => {
        const key = `${productId}-${variantId}`;
        const newSelection = new Set(selectedVariants);
        if (newSelection.has(key)) {
            newSelection.delete(key);
        } else {
            newSelection.add(key);
        }
        setSelectedVariants(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allKeys = flattenedInventory.map(({ product, variant }) => `${product.id}-${variant.id}`);
            setSelectedVariants(new Set(allKeys));
        } else {
            setSelectedVariants(new Set());
        }
    };
    
    const handleBulkUpdate = () => {
        if (selectedVariants.size === 0 || bulkUpdateValue === 0) return;

        setProducts(prevProducts => {
            return prevProducts.map(p => {
                const newVariants = p.variants.map(v => {
                    const key = `${p.id}-${v.id}`;
                    if (selectedVariants.has(key)) {
                        return { ...v, stock: Math.max(0, v.stock + bulkUpdateValue) };
                    }
                    return v;
                });
                return { ...p, variants: newVariants };
            });
        });
        
        addToast(`تم تحديث ${selectedVariants.size} متغيرات.`, 'success');
        setSelectedVariants(new Set());
        setBulkUpdateValue(0);
    };


    return (
        <Card title="إدارة المخزون">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input type="search" placeholder="بحث بالمنتج أو SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="admin-form-input w-full md:w-1/3"/>
                    <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)} className="admin-form-input w-full md:w-auto">
                        <option value="All">كل حالات التوفر</option>
                        <option value="InStock">متوفر</option>
                        <option value="OutOfStock">نفد المخزون</option>
                    </select>
                </div>

                {selectedVariants.size > 0 && (
                     <div className="bg-admin-accent/10 p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                        <p className="font-semibold text-sm text-admin-accent">{selectedVariants.size} متغيرات محددة</p>
                        <div className="flex items-center gap-2">
                             <input type="number" value={bulkUpdateValue} onChange={e => setBulkUpdateValue(parseInt(e.target.value, 10) || 0)} className="admin-form-input w-24 text-center" placeholder="± 0"/>
                             <button onClick={handleBulkUpdate} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg text-sm">تحديث المحدد</button>
                        </div>
                    </div>
                )}

                 <div className="overflow-x-auto -mx-5">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-admin-bg text-admin-text-secondary">
                            <tr>
                                <th className="p-4 w-4">
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedVariants.size > 0 && selectedVariants.size === flattenedInventory.length && flattenedInventory.length > 0} className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"/>
                                </th>
                                <th className="p-4 font-semibold">المنتج</th>
                                <th className="p-4 font-semibold">SKU</th>
                                <th className="p-4 font-semibold">المتوفر</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {flattenedInventory.map(({ product, variant }) => {
                                const key = `${product.id}-${variant.id}`;
                                const isEdited = editedStocks[key] !== undefined && editedStocks[key] !== variant.stock;
                                const currentValue = editedStocks[key] ?? variant.stock;
                                
                                return (
                                <tr key={key} className={`hover:bg-admin-bg ${selectedVariants.has(key) ? 'bg-admin-accent/5' : ''}`}>
                                     <td className="p-4"><input type="checkbox" checked={selectedVariants.has(key)} onChange={() => handleSelectVariant(product.id, variant.id)} className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"/></td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-10 h-12 object-cover rounded-md"/>
                                            <div>
                                                <p className="font-semibold text-admin-text-primary">{product.name}</p>
                                                <p className="text-xs text-admin-text-secondary">{Object.values(variant.options).join(' / ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-admin-text-secondary">{variant.sku}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center border border-admin-border rounded-lg bg-admin-card-bg">
                                                <button onClick={() => handleStockChange(product.id, variant.id, currentValue - 1)} className="p-2 text-admin-text-secondary hover:bg-admin-bg rounded-r-lg"><MinusIcon size="sm"/></button>
                                                <input type="number" value={currentValue} onChange={(e) => handleStockChange(product.id, variant.id, parseInt(e.target.value, 10) || 0)} className="w-16 bg-transparent border-y-0 border-x text-center font-semibold focus:ring-0 focus:border-admin-border"/>
                                                <button onClick={() => handleStockChange(product.id, variant.id, currentValue + 1)} className="p-2 text-admin-text-secondary hover:bg-admin-bg rounded-l-lg"><PlusIcon size="sm"/></button>
                                            </div>
                                            {isEdited && <button onClick={() => handleSaveStock(product.id, variant.id)} className="bg-green-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs">حفظ</button>}
                                        </div>
                                    </td>
                                </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

export default InventoryPage;