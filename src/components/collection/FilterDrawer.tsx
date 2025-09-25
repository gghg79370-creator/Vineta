import React, { useMemo } from 'react';
import { CloseIcon, ChevronDownIcon } from '../icons';
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
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-right py-4 font-semibold">
                <span className="flex items-center gap-2">
                    {title}
                    {hasActiveFilter && <span className="w-2 h-2 bg-brand-primary rounded-full"></span>}
                </span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>
            {isOpen && <div className="pb-4 text-brand-text-light animate-fade-in">{children}</div>}
        </div>
    )
}

export const FilterDrawer = ({ isOpen, setIsOpen, filters, setFilters }: FilterDrawerProps) => {
    const filterOptions = useMemo(() => {
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])];
        const colors = [...new Set(allProducts.flatMap(p => p.colors))];
        const sizes = [...new Set(allProducts.flatMap(p => p.sizes))];
        return { brands, colors, sizes };
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

    const handlePriceChange = (newMax: number) => {
      setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: newMax } }));
    };

    const clearFilters = () => {
        setFilters({
            brands: [],
            colors: [],
            sizes: [],
            priceRange: { min: 0, max: 1000 },
        });
    };
    
    const hasBrandFilter = filters.brands.length > 0;
    const hasPriceFilter = filters.priceRange.max < 1000;
    const hasColorFilter = filters.colors.length > 0;
    const hasSizeFilter = filters.sizes.length > 0;

    const filteredProductsCount = useMemo(() => {
        return allProducts.filter(p => {
             const brandMatch = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
             const colorMatch = filters.colors.length === 0 || p.colors.some(c => filters.colors.includes(c));
             const sizeMatch = filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s));
             const priceMatch = parseFloat(p.price) >= filters.priceRange.min && parseFloat(p.price) <= filters.priceRange.max;
             return brandMatch && colorMatch && sizeMatch && priceMatch;
        }).length;
    }, [filters]);

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-sm bg-white shadow-lg z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 flex justify-between items-center border-b">
                        <h2 className="font-bold text-xl text-brand-dark">فلتر</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق الفلتر"><CloseIcon /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
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
                             <div className="px-2 pt-2">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1000" 
                                    value={filters.priceRange.max} 
                                    onChange={(e) => handlePriceChange(Number(e.target.value))} 
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-dark" 
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm font-bold">السعر: 0 ج.م — {filters.priceRange.max} ج.م</p>
                                </div>
                            </div>
                        </AccordionItem>
                         <AccordionItem title="اللون" defaultOpen={true} hasActiveFilter={hasColorFilter}>
                             <div className="flex flex-wrap gap-3 p-2">
                                {filterOptions.colors.map(color => (
                                    <button 
                                        key={color} 
                                        className={`w-8 h-8 rounded-full border border-black/10 transition-transform transform hover:scale-110 ${filters.colors.includes(color) ? 'ring-2 ring-brand-dark ring-offset-2' : ''}`}
                                        style={{backgroundColor: color}} 
                                        aria-label={`Color ${color}`}
                                        onClick={() => handleColorChange(color)}
                                    ></button>
                                ))}
                             </div>
                        </AccordionItem>
                        <AccordionItem title="المقاس" defaultOpen={true} hasActiveFilter={hasSizeFilter}>
                            <div className="flex flex-wrap gap-2 p-2">
                                {filterOptions.sizes.map(size => (
                                     <button 
                                        key={size} 
                                        className={`border rounded-md px-3 py-1 text-sm font-semibold transition-colors ${filters.sizes.includes(size) ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-border hover:bg-brand-subtle'}`}
                                        onClick={() => handleSizeChange(size)}
                                    >{size}</button>
                                ))}
                            </div>
                        </AccordionItem>
                    </div>
                    <div className="p-4 border-t grid grid-cols-2 gap-4">
                        <button onClick={clearFilters} className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle">مسح الكل</button>
                        <button onClick={() => setIsOpen(false)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">عرض (<span key={filteredProductsCount} className="inline-block animate-fade-in">{filteredProductsCount}</span>)</button>
                    </div>
                </div>
            </div>
        </>
    );
};