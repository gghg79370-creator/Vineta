import React, { useState, useMemo, useEffect } from 'react';
import { Product, Filters } from '../types';
import { allProducts } from '../data/products';
import { CollectionProductCard } from '../components/product/CollectionProductCard';
import { CollectionProductListCard } from '../components/product/CollectionProductListCard';
import { GridView4Icon, GridView3Icon, GridView2Icon, ListLayoutIcon, FilterSlidersIcon, ChevronDownIcon, PlusIcon, MinusIcon, StarIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { ProductCardSkeleton } from '../components/ui/ProductCardSkeleton';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';

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
        const categories = [
            { id: 'women', name: 'ملابس نسائية' },
            { id: 'men', name: 'ملابس رجالية' },
            { id: 'accessories', name: 'إكسسوارات' }
        ];
        return { brands, colors, sizes, materials, categories };
    }, []);
    
    const [priceInputs, setPriceInputs] = useState({ min: filters.priceRange.min, max: filters.priceRange.max });

    useEffect(() => {
        setPriceInputs({ min: filters.priceRange.min, max: filters.priceRange.max });
    }, [filters.priceRange]);

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPriceInputs(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    };

    const applyPriceFilter = () => {
        setFilters(prev => ({ ...prev, priceRange: { min: Number(priceInputs.min) || 0, max: Number(priceInputs.max) || 1000 }}));
    };

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

    const handleCategoryChange = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        setFilters(prev => ({ ...prev, categories: newCategories }));
    };

    const clearFilters = () => {
        setFilters({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [], categories: [] });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">الفلاتر</h3>
                <button onClick={clearFilters} className="text-sm font-semibold text-brand-primary hover:underline">مسح الكل</button>
            </div>
            <AccordionItem title="الفئة" defaultOpen hasActiveFilter={filters.categories.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.categories.map(category => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.categories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />
                            <span>{category.name}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
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
            <AccordionItem title="السعر" defaultOpen hasActiveFilter={filters.priceRange.min > 0 || filters.priceRange.max < 1000}>
                <div className="p-2 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="relative">
                            <label className="absolute -top-2 right-3 text-xs bg-white px-1 text-gray-500">من</label>
                            <input
                                type="number"
                                name="min"
                                value={priceInputs.min}
                                onChange={handlePriceInputChange}
                                placeholder="0"
                                className="w-full border border-gray-300 rounded-md p-2 text-center"
                            />
                        </div>
                        <span>-</span>
                        <div className="relative">
                            <label className="absolute -top-2 right-3 text-xs bg-white px-1 text-gray-500">إلى</label>
                            <input
                                type="number"
                                name="max"
                                value={priceInputs.max}
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
    const { compareList, wishlist, currentUser } = state;
    const addToast = useToast();
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [gridCols, setGridCols] = useState(4);
    const [sortBy, setSortBy] = useState('best-selling');
    const productsPerPage = 12;

    const appliedFiltersCount = useMemo(() => {
        const { brands, colors, sizes, priceRange, rating, onSale, materials, categories } = filters;
        const hasBrandFilter = brands.length > 0;
        const hasPriceFilter = priceRange.min > 0 || priceRange.max < 1000;
        const hasColorFilter = colors.length > 0;
        const hasSizeFilter = sizes.length > 0;
        const hasSaleFilter = onSale;
        const hasRatingFilter = rating > 0;
        const hasMaterialFilter = materials.length > 0;
        const hasCategoryFilter = categories.length > 0;
        return [hasBrandFilter, hasPriceFilter, hasColorFilter, hasSizeFilter, hasSaleFilter, hasRatingFilter, hasMaterialFilter, hasCategoryFilter].filter(Boolean).length;
    }, [filters]);

    const filteredAndSortedProducts = useMemo(() => {
        let products = allProducts.filter(p => {
             const brandMatch = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
             const colorMatch = filters.colors.length === 0 || p.colors.some(c => filters.colors.includes(c));
             const sizeMatch = filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s));
             const priceMatch = parseFloat(p.price) >= filters.priceRange.min && parseFloat(p.price) <= filters.priceRange.max;
             const saleMatch = !filters.onSale || !!p.oldPrice;
             const ratingMatch = !filters.rating || (p.rating && p.rating >= filters.rating);
             const materialMatch = filters.materials.length === 0 || filters.materials.some(m => p.tags.includes(m));
             const categoryMatch = filters.categories.length === 0 || filters.categories.some(cat => {
                if (cat === 'accessories') {
                    return p.tags.includes('إكسسوارات');
                }
                return p.category === cat;
             });
             return brandMatch && colorMatch && sizeMatch && priceMatch && saleMatch && ratingMatch && materialMatch && categoryMatch;
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
            case 'rating':
                products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
    }, [filters, sortBy]);

    const currentProducts = useMemo(() => {
        return filteredAndSortedProducts.slice(0, currentPage * productsPerPage);
    }, [filteredAndSortedProducts, currentPage]);
    
    const hasMoreProducts = currentProducts.length < filteredAndSortedProducts.length;

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setCurrentPage(currentPage + 1);
            setIsLoadingMore(false);
        }, 500);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const addToCompare = (product: Product) => {
        const isInCompare = compareList.includes(product.id);
        if (!isInCompare && compareList.length >= 4) {
             addToast('يمكنك مقارنة 4 منتجات كحد أقصى.', 'info');
             return;
        }
        dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
        addToast(isInCompare ? 'تمت الإزالة من المقارنة.' : 'تمت الإضافة إلى المقارنة!', 'success');
    };

    const toggleWishlist = (product: Product) => {
        if (!currentUser) {
            addToast('الرجاء تسجيل الدخول لحفظ المنتجات في قائمة رغباتك.', 'info');
            navigateTo('login');
            return;
        }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
        const isInWishlist = wishlist.some(item => item.id === product.id);
        addToast(
            !isInWishlist ? `تمت إضافة ${product.name} إلى قائمة الرغبات!` : `تمت إزالة ${product.name} من قائمة الرغبات.`,
            'success'
        );
    };

    const gridClasses: {[key: number]: string} = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
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
                    <div className="flex justify-between items-center mb-6 gap-4 p-2 bg-white rounded-xl shadow-sm border">
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => { setViewMode('grid'); setGridCols(4); }} 
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' && gridCols === 4 ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                                aria-label="4 Column Grid View"
                            >
                                <GridView4Icon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => { setViewMode('grid'); setGridCols(3); }} 
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' && gridCols === 3 ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                                aria-label="3 Column Grid View"
                            >
                                <GridView3Icon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => { setViewMode('grid'); setGridCols(2); }} 
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' && gridCols === 2 ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                                aria-label="2 Column Grid View"
                            >
                                <GridView2Icon className="w-5 h-5" />
                            </button>
                             <button 
                                onClick={() => setViewMode('list')} 
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
                                aria-label="List View"
                            >
                                <ListLayoutIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="relative">
                                <select 
                                    value={sortBy}
                                    onChange={handleSortByChange}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-dark/50 cursor-pointer"
                                >
                                    <option value="best-selling">ترتيب حسب (الأكثر مبيعًا)</option>
                                    <option value="newest">الأحدث</option>
                                    <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
                                    <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
                                    <option value="rating">الأعلى تقييمًا</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center px-2 text-gray-500">
                                    <ChevronDownIcon size="sm"/>
                                </div>
                            </div>

                            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50">
                                <span>تصفية</span>
                                <FilterSlidersIcon className="w-5 h-5"/>
                                 {appliedFiltersCount > 0 && <span className="bg-brand-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{appliedFiltersCount}</span>}
                            </button>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className={`grid ${gridClasses[gridCols]} gap-x-4 gap-y-8`}>
                            {Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    ) : currentProducts.length > 0 ? (
                        viewMode === 'grid' ? (
                             <div className={`grid ${gridClasses[gridCols]} gap-x-4 gap-y-8`}>
                                {currentProducts.map(product => <CollectionProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentProducts.map(product => <CollectionProductListCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg border">
                            <h2 className="text-2xl font-bold text-brand-dark mb-2">لا توجد منتجات مطابقة</h2>
                            <p className="text-brand-text-light">حاول ضبط الفلاتر للعثور على ما تبحث عنه.</p>
                        </div>
                    )}
                    
                    {!isLoading && hasMoreProducts && (
                        <div className="text-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="bg-white border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle transition-all duration-200 disabled:opacity-50 flex items-center justify-center min-w-[150px] mx-auto active:scale-98"
                            >
                                {isLoadingMore ? <Spinner size="sm" color="text-brand-dark" /> : 'تحميل المزيد'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    </div>
    )
};

export default ShopPage;