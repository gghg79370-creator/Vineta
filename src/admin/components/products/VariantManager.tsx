import React, { useState, useEffect } from 'react';
import { AdminVariant } from '../../data/adminData';
import { PlusIcon, TrashIcon } from '../../../components/icons';

interface VariantManagerProps {
    variants: AdminVariant[];
    setVariants: React.Dispatch<React.SetStateAction<AdminVariant[]>>;
}

interface Option {
    name: string;
    values: string[];
}

const VariantManager: React.FC<VariantManagerProps> = ({ variants, setVariants }) => {
    const [options, setOptions] = useState<Option[]>([{ name: 'المقاس', values: ['S', 'M', 'L'] }]);

    const addOption = () => {
        if (options.length < 3) {
            setOptions([...options, { name: '', values: [] }]);
        }
    };
    
    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...options];
        newOptions[index].name = name;
        setOptions(newOptions);
    };

    const updateOptionValues = (index: number, values: string) => {
        const newOptions = [...options];
        newOptions[index].values = values.split(',').map(v => v.trim()).filter(Boolean);
        setOptions(newOptions);
    };
    
    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const generateVariants = () => {
            if (options.length === 0 || options.some(o => o.values.length === 0 || !o.name)) {
                setVariants([]);
                return;
            }
        
            // FIX: The original cartesian product function was implemented incorrectly, causing type errors with Array.prototype.reduce.
            // This has been replaced with a standard implementation that correctly calculates the cartesian product.
            const cartesian = (...a: string[][]): string[][] => a.reduce((acc, val) => acc.flatMap(d => val.map(e => [...d, e])), [[]] as any);
        
            const newVariantsData = cartesian(...options.map(o => o.values)).map((combo, index) => {
                const optionMap: { [key: string]: string } = {};
                options.forEach((opt, i) => {
                    optionMap[opt.name] = combo[i];
                });

                const existingVariant = variants.find(v => JSON.stringify(v.options) === JSON.stringify(optionMap));

                return {
                    id: existingVariant?.id || Date.now() + index,
                    options: optionMap,
                    sku: existingVariant?.sku || '',
                    price: existingVariant?.price || '',
                    stock: existingVariant?.stock || 0,
                };
            });
            setVariants(newVariantsData);
        };
        generateVariants();
    }, [options, setVariants, variants]);

    const updateVariant = (index: number, field: keyof AdminVariant, value: string | number) => {
        const newVariants = [...variants];
        // @ts-ignore
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">الخيارات</h4>
                {options.map((option, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg mb-2 bg-gray-50">
                        <input
                            type="text"
                            placeholder="اسم الخيار (مثل المقاس)"
                            value={option.name}
                            onChange={(e) => updateOptionName(index, e.target.value)}
                            className="border-gray-300 rounded-lg w-full"
                        />
                        <input
                            type="text"
                            placeholder="القيم (مثل S, M, L)"
                            value={option.values.join(', ')}
                            onChange={(e) => updateOptionValues(index, e.target.value)}
                            className="border-gray-300 rounded-lg md:col-span-2 w-full"
                        />
                         <button onClick={() => removeOption(index)} className="text-red-500 text-xs font-semibold hover:underline">إزالة</button>
                    </div>
                ))}
                {options.length < 3 && (
                    <button onClick={addOption} className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1">
                        <PlusIcon size="sm" />
                        إضافة خيار آخر
                    </button>
                )}
            </div>

            {variants.length > 0 && (
                <div>
                     <h4 className="text-sm font-bold text-gray-700 mb-2">قائمة المتغيرات</h4>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 font-semibold">المتغير</th>
                                    <th className="p-2 font-semibold">السعر</th>
                                    <th className="p-2 font-semibold">المخزون</th>
                                    <th className="p-2 font-semibold">SKU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {variants.map((variant, index) => (
                                    <tr key={variant.id}>
                                        <td className="p-2 font-medium">{Object.values(variant.options).join(' / ')}</td>
                                        <td className="p-1">
                                            <input type="text" value={variant.price} onChange={e => updateVariant(index, 'price', e.target.value)} className="w-24 border-gray-300 rounded-md text-sm p-1" />
                                        </td>
                                        <td className="p-1">
                                            <input type="number" value={variant.stock} onChange={e => updateVariant(index, 'stock', Number(e.target.value))} className="w-20 border-gray-300 rounded-md text-sm p-1" />
                                        </td>
                                         <td className="p-1">
                                            <input type="text" value={variant.sku} onChange={e => updateVariant(index, 'sku', e.target.value)} className="w-32 border-gray-300 rounded-md text-sm p-1" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantManager;