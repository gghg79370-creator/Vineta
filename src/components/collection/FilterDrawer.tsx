import React, { useMemo, useState, useEffect } from 'react';
import { CloseIcon, PlusIcon, MinusIcon, StarIcon } from '../icons';
import { allProducts } from '../../data/products';
import { Filters } from '../../types';

interface FilterDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const AccordionItem = ({ title, children, defaultOpen = false, hasActiveFilter = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean, hasActiveFilter?: boolean }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-right py-4 font-semibold text-brand-dark">
                <span className="flex items-center gap-2">
                    {title}
                    {hasActiveFilter && <span className="w-2 h-2 bg-brand-primary rounded-full"></span>}
                </span>
                <span className={`transform transition-transform text-brand-text-light ${isOpen ? '' : 'rotate-180'}`}>{isOpen ? <MinusIcon size="sm"/> : <PlusIcon size="sm"/>}</span>
            </button>
             <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 pt-2 text-brand-text-light">{children}</div>
                </div>
            </div>
        </div>
    )
}

export const FilterDrawer = ({ isOpen, setIsOpen, filters, setFilters }: FilterDrawerProps) => {
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [localPrice, setLocalPrice] = useState({ min: filters.priceRange.min, max: filters.priceRange.max });

    useEffect(() => {
        if (isOpen) {
            setLocalPrice({ min: filters.priceRange.min, max: filters.priceRange.max });
        }
    }, [filters.priceRange, isOpen]);

    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimatingOut(false);
        }, 300); // Match animation duration
    };

    const filterOptions = useMemo(() => {
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])];
        const colors = [...new Set(allProducts.flatMap(p => p.colors))];
        const sizes = [...new Set(allProducts.flatMap(p => p.sizes))];
        const materialsList = ['كتان', 'قطن', 'دينيم', 'جلد', 'بوليستر'];
        const materials = [...new Set(allProducts.flatMap(p => p.tags.filter(tag => materialsList.includes(tag))))];
        const categories = [
            { id: 'women', name: 'ملابس نسائية' },
            { id: 'men', name: 'ملابس رجالية' },
            { id: 'accessories', name: 'إكسسوارات' }
        ];
        return { brands, colors, sizes, materials, categories };
    }, []);

    const handleBrandChange = (brand: string) => {
        const newBrands = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        setFilters(prev => ({ ...prev, brands: newBrands }));
    };

    const handleColorChange = (color: string) => {
        const newColors = filters.colors.includes(color)
            ? filters.colors.filter(c => c !== color)
            : [...filters.colors, color];
        setFilters(prev => ({ ...prev, colors: newColors }));
    };

    const handleSizeChange = (size: string) => {
        const newSizes = filters.sizes.includes(size)
            ? filters.sizes.filter(s => s !== size)
            : [...filters.sizes, size];
        setFilters(prev => ({ ...prev, sizes: newSizes }));
    };
    
    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalPrice(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    };
    
    const applyPriceFilter = () => {
        setFilters(prev => ({ ...prev, priceRange: { min: Number(localPrice.min) || 0, max: Number(localPrice.max) || 1000 }}));
    };

    const handleOnSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, onSale: e.target.checked}));
    };

    const handleRatingChange = (newRating: number) => {
        setFilters(prev => ({ ...prev, rating: prev.rating === newRating ? 0 : newRating }));
    };

    const handleMaterialChange = (material: string) => {
        const newMaterials = filters.materials.includes(material)
            ? filters.materials.filter(m => m !== material)
            : [...filters.materials, material];
        setFilters(prev => ({ ...prev, materials: newMaterials }));
    };

    const handleCategoryChange = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        setFilters(prev => ({ ...prev, categories: newCategories }));
    };

    const clearFilters = () => {
        setFilters({
            brands: [],
            colors: [],
            sizes: [],
            priceRange: { min: 0, max: 1000 },
            rating: 0,
            onSale: false,
            materials: [],
            categories: []
        });
    };

    const hasBrandFilter = filters.brands.length > 0;
    const hasPriceFilter = filters.priceRange.min > 0 || filters.priceRange.max < 1000;
    const hasColorFilter = filters.colors.length > 0;
    const hasSizeFilter = filters.sizes.length > 0;
    const hasSaleFilter = filters.onSale;
    const hasRatingFilter = filters.rating > 0;
    const hasMaterialFilter = filters.materials.length > 0;
    const hasCategoryFilter = filters.categories.length > 0;
    
    const appliedFiltersCount = [hasBrandFilter, hasPriceFilter, hasColorFilter, hasSizeFilter, hasSaleFilter, hasRatingFilter, hasMaterialFilter, hasCategoryFilter].filter(Boolean).length;

    if (!isOpen && !isAnimatingOut) return null;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen && !isAnimatingOut ? 'opacity-100' : 'opacity-0'}`} 
                onClick={handleClose}
                aria-hidden="true"
            ></div>
            <div 
                className={`fixed bottom-0 right-0 left-0 bg-white shadow-2xl z-[60] rounded-t-2xl max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-in-out
                    ${isOpen && !isAnimatingOut ? 'translate-y-0' : 'translate-y-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-dialog-title"
            >
                <div className="p-4 flex justify-between items-center border-b flex-shrink-0">
                    <h2 id="filter-dialog-title" className="font-bold text-xl text-brand-dark flex items-center gap-2">
                        فلتر
                        {appliedFiltersCount > 0 && <span className="bg-brand-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{appliedFiltersCount}</span>}
                    </h2>
                    <button onClick={handleClose} aria-label="إغلاق الفلتر" className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <AccordionItem title="الحالة" defaultOpen hasActiveFilter={hasSaleFilter}>
                        <div className="space-y-2 pr-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.onSale} onChange={handleOnSaleChange} />
                                <span>في التخفيضات</span>
                            </label>
                        </div>
                    </AccordionItem>
                     <AccordionItem title="الفئة" defaultOpen hasActiveFilter={hasCategoryFilter}>
                        <div className="space-y-2 pr-2">
                            {filterOptions.categories.map(category => (
                                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border"
                                        checked={filters.categories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                    <span>{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </AccordionItem>
                    <AccordionItem title="التقييم" defaultOpen hasActiveFilter={hasRatingFilter}>
                         <div className="space-y-1 pr-2">
                            {[4, 3, 2, 1].map(star => (
                                <button key={star} onClick={() => handleRatingChange(star)} className={`w-full text-right flex items-center gap-2 p-1 rounded-md ${filters.rating === star ? 'bg-amber-100/60' : 'hover:bg-gray-50'}`}>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < star ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                    </div>
                                    <span className="text-sm text-brand-text-light">& الأعلى</span>
                                </button>
                            ))}
                        </div>
                    </AccordionItem>
                    <AccordionItem title="العلامة التجارية" defaultOpen={true} hasActiveFilter={hasBrandFilter}>
                        <div className="space-y-2 pr-2">
                            {filterOptions.brands.map(brand => {
                                const isChecked = filters.brands.includes(brand);
                                return (
                                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border"
                                            checked={isChecked}
                                            onChange={() => handleBrandChange(brand)}
                                        /> 
                                        <span className={`${isChecked ? 'font-bold text-brand-dark' : ''}`}>{brand}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </AccordionItem>
                    <AccordionItem title="السعر" defaultOpen={true} hasActiveFilter={hasPriceFilter}>
                        <div className="p-2 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className="text-xs text-center block mb-1 text-gray-500">من (ج.م)</label>
                                    <input
                                        type="number"
                                        name="min"
                                        value={localPrice.min}
                                        onChange={handlePriceInputChange}
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-md p-2 text-center"
                                    />
                                </div>
                                <div className="flex-1">
                                     <label className="text-xs text-center block mb-1 text-gray-500">إلى (ج.م)</label>
                                    <input
                                        type="number"
                                        name="max"
                                        value={localPrice.max}
                                        onChange={handlePriceInputChange}
                                        placeholder="1000"
                                        className="w-full border border-gray-300 rounded-md p-2 text-center"
                                    />
                                </div>
                            </div>
                             <button onClick={applyPriceFilter} className="w-full bg-gray-100 text-brand-dark font-bold py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                                تطبيق
                            </button>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="الخامة" defaultOpen hasActiveFilter={hasMaterialFilter}>
                        <div className="space-y-2 pr-2">
                            {filterOptions.materials.map(material => (
                                <label key={material} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.materials.includes(material)} onChange={() => handleMaterialChange(material)} />
                                    <span>{material}</span>
                                </label>
                            ))}
                        </div>
                    </AccordionItem>
                     <AccordionItem title="اللون" defaultOpen={true} hasActiveFilter={hasColorFilter}>
                         <div className="flex flex-wrap gap-3 p-2">
                            {filterOptions.colors.map(color => (
                                <label key={color} className="relative cursor-pointer">
                                    <input type="checkbox"
                                           checked={filters.colors.includes(color)}
                                           onChange={() => handleColorChange(color)}
                                           className="sr-only peer" />
                                    <span style={{backgroundColor: color}}
                                          className="block w-8 h-8 rounded-full border border-black/10 transition-transform transform peer-hover:scale-110 peer-checked:ring-2 peer-checked:ring-brand-dark peer-checked:ring-offset-2">
                                    </span>
                                </label>
                            ))}
                         </div>
                    </AccordionItem>
                    <AccordionItem title="المقاس" defaultOpen={true} hasActiveFilter={hasSizeFilter}>
                        <div className="flex flex-wrap gap-2 p-2">
                            {filterOptions.sizes.map(size => (
                                <label key={size}>
                                    <input type="checkbox"
                                           checked={filters.sizes.includes(size)}
                                           onChange={() => handleSizeChange(size)}
                                           className="sr-only peer" />
                                    <span className="border rounded-md px-3 py-1 text-sm font-semibold transition-colors cursor-pointer
                                                   peer-checked:bg-brand-dark peer-checked:text-white peer-checked:border-brand-dark
                                                   hover:bg-brand-subtle">
                                        {size}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </AccordionItem>
                </div>
                <div className="p-4 border-t grid grid-cols-2 gap-4 flex-shrink-0">
                    <button onClick={clearFilters} className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle transition-transform active:scale-98">مسح الكل</button>
                    <button onClick={handleClose} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition-transform active:scale-98">عرض النتائج</button>
                </div>
            </div>
        </>
    );
};