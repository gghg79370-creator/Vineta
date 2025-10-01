

import React, { useState, useMemo, useEffect } from 'react';
import { Product, Filters } from '../types';
import { allProducts } from '../data/products';
import { CollectionProductCard } from '../components/product/CollectionProductCard';
import { CollectionProductListCard } from '../components/product/CollectionProductListCard';
import { GridViewIcon, FilterIcon, Bars3Icon, ChevronDownIcon, ChevronRightIcon, PlusIcon, MinusIcon, StarIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { ProductCardSkeleton } from '../components/ui/ProductCardSkeleton';

interface ShopPageProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    setIsFilterOpen: (isOpen: boolean) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    currentPage: number;
    setCurrentPage: (page: number) => void;
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
            {isOpen && <div className="pb-4 text-brand-text-light animate-fade-in">{children}</div>}
        </div>
    )
}

const FilterSidebar = ({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; }) => {
    const filterOptions = useMemo(() => {
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])];
        const colors = [...new Set(allProducts.flatMap(p => p.colors))];
        const sizes = [...new Set(allProducts.flatMap(p => p.sizes))];
        const materialsList = ['كتان', 'قطن', 'دينيم', 'جلد', 'بوليستر'];
        const materials = [...new Set(allProducts.flatMap(p => p.tags.filter(tag => materialsList.includes(tag))))];
        return { brands, colors, sizes, materials };
    }, []);

    const handleBrandChange = (brand: string) => {
        const newBrands = filters.brands.includes(brand) ? filters.brands.filter(b => b !== brand) : [...filters.brands, brand];
        setFilters(prev => ({ ...prev, brands: newBrands }));
    };

    const handleColorChange = (color: string) => {
        const newColors = filters.colors.includes(color) ? filters.colors.filter(c => c !== color) : [...filters.colors, color];
        setFilters(prev => ({ ...prev, colors: newColors }));
    };

    const handleSizeChange = (size: string) => {
        const newSizes = filters.sizes.includes(size) ? filters.sizes.filter(s => s !== size) : [...filters.sizes, size];
        setFilters(prev => ({ ...prev, sizes: newSizes }));
    };

    const handlePriceChange = (newMax: number) => {
      setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: newMax } }));
    };
    
    const handleOnSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, onSale: e.target.checked }));
    };

    const handleRatingChange = (newRating: number) => {
        setFilters(prev => ({...prev, rating: prev.rating === newRating ? 0 : newRating }));
    };
    
    const handleMaterialChange = (material: string) => {
        const newMaterials = filters.materials.includes(material) ? filters.materials.filter(m => m !== material) : [...filters.materials, material];
        setFilters(prev => ({ ...prev, materials: newMaterials }));
    };

    const clearFilters = () => {
        setFilters({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [] });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">الفلاتر</h3>
                <button onClick={clearFilters} className="text-sm font-semibold text-brand-primary hover:underline">مسح الكل</button>
            </div>
            <AccordionItem title="الحالة" defaultOpen hasActiveFilter={filters.onSale}>
                <div className="space-y-2 pr-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.onSale} onChange={handleOnSaleChange} />
                        <span>في التخفيضات</span>
                    </label>
                </div>
            </AccordionItem>
            <AccordionItem title="التقييم" defaultOpen hasActiveFilter={filters.rating > 0}>
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
            <AccordionItem title="العلامة التجارية" defaultOpen hasActiveFilter={filters.brands.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.brands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.brands.includes(brand)} onChange={() => handleBrandChange(brand)} /> 
                            <span>{brand}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            <AccordionItem title="السعر" defaultOpen hasActiveFilter={filters.priceRange.max < 1000}>
                <div className="px-2 pt-2">
                    <input type="range" min="0" max="1000" value={filters.priceRange.max} onChange={(e) => handlePriceChange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-dark" />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-bold">السعر: 0 ج.م — {filters.priceRange.max} ج.م</p>
                    </div>
                </div>
            </AccordionItem>
             <AccordionItem title="الخامة" defaultOpen hasActiveFilter={filters.materials.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.materials.map(material => (
                        <label key={material} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.materials.includes(material)} onChange={() => handleMaterialChange(material)} />
                            <span>{material}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            <AccordionItem title="اللون" defaultOpen hasActiveFilter={filters.colors.length > 0}>
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
            <AccordionItem title="المقاس" hasActiveFilter={filters.sizes.length > 0}>
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
    );
};

const ShopPage = ({ navigateTo, addToCart, openQuickView, setIsFilterOpen, filters, setFilters, currentPage, setCurrentPage }: ShopPageProps) => {
    const { state, dispatch } = useAppState();
    const { compareList, wishlist } = state;
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [gridCols, setGridCols] = useState(3);
    const [sortBy, setSortBy] = useState('best-selling');
    const productsPerPage = 12;

    const filteredAndSortedProducts = useMemo(() => {
        let products = allProducts.filter(p => {
             const brandMatch = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
             const colorMatch = filters.colors.length === 0 || p.colors.some(c => filters.colors.includes(c));
             const sizeMatch = filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s));
             const priceMatch = parseFloat(p.price) >= filters.priceRange.min && parseFloat(p.price) <= filters.priceRange.max;
             // FIX: Property 'onSale' does not exist on type 'Product'. A product is considered on sale if it has an 'oldPrice'.
             const saleMatch = !filters.onSale || !!p.oldPrice;
             const ratingMatch = !filters.rating || (p.rating && p.rating >= filters.rating);
             const materialMatch = filters.materials.length === 0 || filters.materials.some(m => p.tags.includes(m));
             return brandMatch && colorMatch && sizeMatch && priceMatch && saleMatch && ratingMatch && materialMatch;
        });

        switch (sortBy) {
            case 'price-asc':
                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'newest':
                products.sort((a, b) => b.id - a.id);
                break;
            case 'best-selling':
            default:
                products.sort((a, b) => (b.soldIn24h || 0) - (a.soldIn24h || 0));
                break;
        }

        return products;
    }, [filters, sortBy]);
    
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [filters, sortBy, currentPage]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const addToCompare = (product: Product) => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
    const toggleWishlist = (product: Product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });

    const gridClasses: {[key: number]: string} = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
    };

    return (
    <div className="bg-brand-subtle">
        <div className="relative bg-gray-800 h-64 text-white flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" className="absolute w-full h-full object-cover opacity-40" alt="Shop banner"/>
            <div className="relative text-center p-4">
                <h1 className="text-4xl md:text-5xl font-extrabold">تسوق أحدث مجموعاتنا</h1>
                <p className="mt-2 text-lg text-gray-200">أفضل الصيحات والأساسيات، كلها في مكان واحد.</p>
            </div>
        </div>

        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-row-reverse gap-8 items-start">
                <aside className="w-1/4 hidden lg:block sticky top-24">
                    <FilterSidebar filters={filters} setFilters={setFilters} />
                </aside>

                <main className="w-full lg:w-3/4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-sm border">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center gap-2 bg-white border border-brand-border rounded-full px-4 py-2 text-sm font-semibold">
                                <FilterIcon/>
                                <span>فلتر</span>
                            </button>
                             <p className="hidden md:block text-sm text-brand-text-light whitespace-nowrap">
                                عرض {isLoading ? '...' : currentProducts.length} من {filteredAndSortedProducts.length} منتجًا
                            </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select 
                                value={sortBy}
                                onChange={handleSortByChange}
                                className="appearance-none bg-white border border-brand-border rounded-full px-4 py-2 text-sm font-semibold w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                            >
                                <option value="best-selling">الأكثر مبيعًا</option>
                                <option value="newest">الأحدث</option>
                                <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
                                <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
                            </select>
                            <div className="hidden md:flex items-center gap-1 border border-brand-border rounded-full p-1 bg-white">
                                {[2,3,4].map(cols => (
                                    <button 
                                        key={cols}
                                        onClick={() => { setViewMode('grid'); setGridCols(cols); }} 
                                        className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' && gridCols === cols ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`} 
                                        aria-label={`${cols} Column Grid View`}
                                    >
                                        <GridViewIcon columns={cols} className="w-5 h-5" />
                                    </button>
                                ))}
                                <div className="w-px h-5 bg-gray-200 mx-1"></div>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`} aria-label="List View">
                                    <Bars3Icon size="sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className={`grid ${gridClasses[gridCols]} gap-6`}>
                            {Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    ) : currentProducts.length > 0 ? (
                        viewMode === 'grid' ? (
                             <div className={`grid ${gridClasses[gridCols]} gap-6`}>
                                {currentProducts.map(product => <CollectionProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentProducts.map(product => <CollectionProductListCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg border">
                            <h2 className="text-2xl font-bold text-brand-dark mb-2">لا توجد منتجات مطابقة</h2>
                            <p className="text-brand-text-light">حاول ضبط الفلاتر للعثور على ما تبحث عنه.</p>
                        </div>
                    )}
                    
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 space-x-2 space-x-reverse">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center bg-white border border-brand-border rounded-full hover:bg-brand-subtle transition-colors rotate-180 disabled:opacity-50" aria-label="Previous Page"><ChevronRightIcon /></button>
                            {[...Array(totalPages).keys()].map(number => (
                                <button key={number + 1} onClick={() => paginate(number + 1)} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${currentPage === number + 1 ? 'bg-brand-dark text-white' : 'bg-white border border-brand-border hover:bg-brand-subtle'}`}>
                                    {number + 1}
                                </button>
                            ))}
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center bg-white border border-brand-border rounded-full hover:bg-brand-subtle transition-colors disabled:opacity-50" aria-label="Next Page"><ChevronRightIcon /></button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    </div>
    )
};

export default ShopPage;