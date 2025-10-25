
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Filters } from '../types';
import { allProducts } from '../data/products';
import { CollectionProductCard } from '../components/product/CollectionProductCard';
import { CollectionProductListCard } from '../components/product/CollectionProductListCard';
import { ProductCard } from '../components/product/ProductCard';
import { GridViewIcon, ListLayoutIcon, XCircleIcon, PlusIcon, MinusIcon, StarIcon, FilterSlidersIcon, ChevronDownIcon } from '../components/icons';
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
    shopPage: number;
    setShopPage: (page: number) => void;
}

const AccordionItem = ({ title, children, defaultOpen = false, hasActiveFilter = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean, hasActiveFilter?: boolean }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const contentId = `filter-accordion-${title.replace(/\s+/g, '-')}`;
    return (
        <div className="border-b border-brand-border">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-right py-4 font-semibold text-brand-dark"
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                 <span className="flex items-center gap-2">
                    {title}
                    {hasActiveFilter && <span className="w-2 h-2 bg-brand-primary rounded-full"></span>}
                </span>
                <span className={`transform transition-transform text-brand-text-light`}>{isOpen ? <MinusIcon size="sm"/> : <PlusIcon size="sm"/>}</span>
            </button>
            <div id={contentId} className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 pt-2 text-brand-text-light">{children}</div>
                </div>
            </div>
        </div>
    )
}

interface FacetCounts {
    brands: Map<string, number>;
    colors: Map<string, number>;
    sizes: Map<string, number>;
    materials: Map<string, number>;
    categories: Map<string, number>;
    tags: Map<string, number>;
    rating: Map<number, number>;
    onSale: number;
}


const FilterSidebar = ({ filters, setFilters, filterOptions, facetCounts }: { 
    filters: Filters; 
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    filterOptions: any;
    facetCounts: FacetCounts;
}) => {
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
    
    const handleTagChange = (tag: string) => {
        const newTags = filters.tags.includes(tag) ? filters.tags.filter(t => t !== tag) : [...filters.tags, tag];
        setFilters(prev => ({ ...prev, tags: newTags }));
    };

    const handleCategoryChange = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        setFilters(prev => ({ ...prev, categories: newCategories }));
    };

    const clearFilters = () => {
        setFilters({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [], categories: [], tags: [] });
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">الفلاتر</h3>
                <button onClick={clearFilters} className="text-sm font-semibold text-brand-primary hover:underline">مسح الكل</button>
            </div>
            <AccordionItem title="الحالة" defaultOpen hasActiveFilter={filters.onSale}>
                <div className="space-y-2 pr-2">
                     <label className={`flex items-center gap-2 cursor-pointer ${facetCounts.onSale === 0 && !filters.onSale ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={filters.onSale} onChange={handleOnSaleChange} disabled={facetCounts.onSale === 0 && !filters.onSale}/>
                        <span>في التخفيضات <span className="text-xs text-brand-text-light">({facetCounts.onSale})</span></span>
                    </label>
                </div>
            </AccordionItem>
            <AccordionItem title="الفئة" defaultOpen hasActiveFilter={filters.categories.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.categories.map((category: any) => {
                        const count = facetCounts.categories.get(category.id) || 0;
                        const isChecked = filters.categories.includes(category.id);
                        const isDisabled = count === 0 && !isChecked;
                        return (
                            <label key={category.id} className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border"
                                    checked={isChecked}
                                    onChange={() => handleCategoryChange(category.id)}
                                    disabled={isDisabled}
                                />
                                <span>{category.name} <span className="text-xs text-brand-text-light">({count})</span></span>
                            </label>
                        );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="الوسوم" hasActiveFilter={filters.tags.length > 0}>
                 <div className="space-y-2 pr-2">
                    {filterOptions.tags.map((tag: any) => {
                        const count = facetCounts.tags.get(tag) || 0;
                        const isChecked = filters.tags.includes(tag);
                        const isDisabled = count === 0 && !isChecked;
                        return (
                            <label key={tag} className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={isChecked} onChange={() => handleTagChange(tag)} disabled={isDisabled}/>
                                <span>{tag} <span className="text-xs text-brand-text-light">({count})</span></span>
                            </label>
                        );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="التقييم" defaultOpen>
                <div className="space-y-1 pr-2">
                    {[4, 3, 2, 1].map(star => {
                        const count = facetCounts.rating.get(star) || 0;
                        const isChecked = filters.rating === star;
                        const isDisabled = count === 0 && !isChecked;
                        return (
                            <button key={star} onClick={() => handleRatingChange(star)} disabled={isDisabled} className={`w-full text-right flex items-center justify-between gap-2 p-1 rounded-md ${isChecked ? 'bg-brand-primary/10' : 'hover:bg-brand-subtle'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < star ? 'text-yellow-400' : 'text-brand-border'}`} />)}
                                    </div>
                                    <span className="text-sm text-brand-text-light">& الأعلى</span>
                                </div>
                                <span className="text-xs text-brand-text-light">({count})</span>
                            </button>
                        );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="العلامة التجارية" defaultOpen hasActiveFilter={filters.brands.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.brands.map((brand: string) => {
                        const count = facetCounts.brands.get(brand) || 0;
                        const isChecked = filters.brands.includes(brand);
                        const isDisabled = count === 0 && !isChecked;
                        return (
                            <label key={brand} className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={isChecked} onChange={() => handleBrandChange(brand)} disabled={isDisabled}/> 
                                <span>{brand} <span className="text-xs text-brand-text-light">({count})</span></span>
                            </label>
                        );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="السعر" defaultOpen hasActiveFilter={filters.priceRange.max < 1000}>
                <div className="px-2 pt-2">
                    <input type="range" min="0" max="1000" value={filters.priceRange.max} onChange={(e) => handlePriceChange(Number(e.target.value))} className="w-full h-2 bg-brand-subtle rounded-lg appearance-none cursor-pointer accent-brand-dark" />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-bold">السعر: 0 ج.م — {filters.priceRange.max} ج.م</p>
                    </div>
                </div>
            </AccordionItem>
             <AccordionItem title="الخامة" defaultOpen hasActiveFilter={filters.materials.length > 0}>
                <div className="space-y-2 pr-2">
                    {filterOptions.materials.map((material: string) => {
                         const count = facetCounts.materials.get(material) || 0;
                         const isChecked = filters.materials.includes(material);
                         const isDisabled = count === 0 && !isChecked;
                        return (
                        <label key={material} className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark border-brand-border" checked={isChecked} onChange={() => handleMaterialChange(material)} disabled={isDisabled} />
                            <span>{material} <span className="text-xs text-brand-text-light">({count})</span></span>
                        </label>
                    );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="اللون" defaultOpen hasActiveFilter={filters.colors.length > 0}>
                <div className="flex flex-wrap gap-3 p-2">
                    {filterOptions.colors.map((color: string) => {
                        const count = facetCounts.colors.get(color) || 0;
                        const isChecked = filters.colors.includes(color);
                        const isDisabled = count === 0 && !isChecked;
                        return (
                        <label key={color} className={`relative ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input type="checkbox"
                                   checked={isChecked}
                                   onChange={() => handleColorChange(color)}
                                   disabled={isDisabled}
                                   className="sr-only peer" />
                            <span style={{backgroundColor: color}}
                                  className="block w-8 h-8 rounded-full border border-black/10 transition-transform transform peer-hover:scale-110 peer-checked:ring-2 peer-checked:ring-brand-dark peer-checked:ring-offset-2">
                            </span>
                        </label>
                    );
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="المقاس" hasActiveFilter={filters.sizes.length > 0}>
                <div className="flex flex-wrap gap-2 p-2">
                    {filterOptions.sizes.map((size: string) => {
                        const count = facetCounts.sizes.get(size) || 0;
                        const isChecked = filters.sizes.includes(size);
                        const isDisabled = count === 0 && !isChecked;
                        return (
                        <label key={size} className={isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                            <input type="checkbox"
                                   checked={isChecked}
                                   onChange={() => handleSizeChange(size)}
                                   disabled={isDisabled}
                                   className="sr-only peer" />
                            <span className={`border rounded-md px-3 py-1 text-sm font-semibold transition-colors
                                           peer-checked:bg-brand-dark peer-checked:text-white peer-checked:border-brand-dark
                                           ${isDisabled ? 'text-brand-text-light bg-brand-subtle' : 'hover:bg-brand-subtle'}`}>
                                {size}
                            </span>
                        </label>
                    );
                    })}
                </div>
            </AccordionItem>
        </div>
    );
};


const ShopPage = ({ navigateTo, addToCart, openQuickView, setIsFilterOpen, filters, setFilters, shopPage: currentPage, setShopPage: setCurrentPage }: ShopPageProps) => {
    const { state, dispatch } = useAppState();
    const { compareList, wishlist, currentUser } = state;
    const addToast = useToast();
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [displayMode, setDisplayMode] = useState<'grid-4' | 'grid-3' | 'grid-2' | 'list'>('grid-3');
    const [sortBy, setSortBy] = useState('best-selling');
    const productsPerPage = 12;

    const appliedFiltersCount = useMemo(() => {
        const { brands, colors, sizes, priceRange, rating, onSale, materials, categories, tags } = filters;
        return [
            brands.length > 0,
            colors.length > 0,
            sizes.length > 0,
            priceRange.min > 0 || priceRange.max < 1000,
            rating > 0,
            onSale,
            materials.length > 0,
            categories.length > 0,
            tags.length > 0,
        ].filter(Boolean).length;
    }, [filters]);

    const filterOptions = useMemo(() => {
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean) as string[])].sort();
        const colors = [...new Set(allProducts.flatMap(p => p.colors))];
        const sizes = [...new Set(allProducts.flatMap(p => p.sizes))].sort((a,b) => {
            const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            const aIndex = sizeOrder.indexOf(a);
            const bIndex = sizeOrder.indexOf(b);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            return a.localeCompare(b);
        });
        const materialsList = ['كتان', 'قطن', 'دينيم', 'جلد', 'بوليستر'];
        const materials = [...new Set(allProducts.flatMap(p => p.tags.filter(tag => materialsList.includes(tag))))].sort();
        const tags = ['جديد', 'رائج', 'أساسي'];
        const categories = [
            { id: 'women', name: 'ملابس نسائية' },
            { id: 'men', name: 'ملابس رجالية' },
            { id: 'accessories', name: 'إكسسوارات' }
        ];
        return { brands, colors, sizes, materials, categories, tags };
    }, []);

    const facetCounts = useMemo(() => {
        const newCounts: FacetCounts = {
            brands: new Map(), colors: new Map(), sizes: new Map(),
            materials: new Map(), categories: new Map(), tags: new Map(), rating: new Map(), onSale: 0
        };

        const check = (p: Product, ignore: keyof Filters | 'none') => {
            const f = filters;
            if (ignore !== 'brands' && f.brands.length > 0 && !(p.brand && f.brands.includes(p.brand))) return false;
            if (ignore !== 'colors' && f.colors.length > 0 && !p.colors.some(c => f.colors.includes(c))) return false;
            if (ignore !== 'sizes' && f.sizes.length > 0 && !p.sizes.some(s => f.sizes.includes(s))) return false;
            if (ignore !== 'priceRange' && parseFloat(p.price) > f.priceRange.max) return false;
            if (ignore !== 'onSale' && f.onSale && !p.oldPrice) return false;
            if (ignore !== 'rating' && f.rating > 0 && !(p.rating && p.rating >= f.rating)) return false;
            if (ignore !== 'materials' && f.materials.length > 0 && !f.materials.some(m => p.tags.includes(m))) return false;
            if (ignore !== 'tags' && f.tags.length > 0 && !f.tags.some(t => p.tags.includes(t))) return false;
            if (ignore !== 'categories' && f.categories.length > 0 && !f.categories.some(cat => {
                if (cat === 'accessories') return p.tags.includes('إكسسوارات');
                return p.category === cat;
            })) return false;
            return true;
        };

        allProducts.forEach(p => {
            if (p.brand && check(p, 'brands')) newCounts.brands.set(p.brand, (newCounts.brands.get(p.brand) || 0) + 1);
            if (check(p, 'colors')) p.colors.forEach(c => newCounts.colors.set(c, (newCounts.colors.get(c) || 0) + 1));
            if (check(p, 'sizes')) p.sizes.forEach(s => newCounts.sizes.set(s, (newCounts.sizes.get(s) || 0) + 1));
            if (check(p, 'materials')) p.tags.forEach(t => { if (filterOptions.materials.includes(t)) newCounts.materials.set(t, (newCounts.materials.get(t) || 0) + 1); });
            if (check(p, 'tags')) p.tags.forEach(t => { if (filterOptions.tags.includes(t)) newCounts.tags.set(t, (newCounts.tags.get(t) || 0) + 1); });
            if (check(p, 'categories')) {
                const catId = p.category;
                newCounts.categories.set(catId, (newCounts.categories.get(catId) || 0) + 1);
                if (p.tags.includes('إكسسوارات')) newCounts.categories.set('accessories', (newCounts.categories.get('accessories') || 0) + 1);
            }
            if (check(p, 'onSale') && p.oldPrice) newCounts.onSale++;
            if (p.rating && check(p, 'rating')) {
                for (let i = 1; i <= Math.floor(p.rating); i++) {
                     newCounts.rating.set(i, (newCounts.rating.get(i) || 0) + 1);
                }
            }
        });
        return newCounts;
    }, [filters, filterOptions.materials, filterOptions.tags]);

    const filteredAndSortedProducts = useMemo(() => {
        let products = allProducts.filter(p => {
             const brandMatch = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
             const colorMatch = filters.colors.length === 0 || p.colors.some(c => filters.colors.includes(c));
             const sizeMatch = filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s));
             const priceMatch = parseFloat(p.price) >= filters.priceRange.min && parseFloat(p.price) <= filters.priceRange.max;
             const saleMatch = !filters.onSale || !!p.oldPrice;
             const ratingMatch = !filters.rating || (p.rating && p.rating >= filters.rating);
             const materialMatch = filters.materials.length === 0 || filters.materials.some(m => p.tags.includes(m));
             const tagMatch = filters.tags.length === 0 || filters.tags.some(t => p.tags.includes(t));
             const categoryMatch = filters.categories.length === 0 || filters.categories.some(cat => {
                if (cat === 'accessories') {
                    return p.tags.includes('إكسسوارات');
                }
                return p.category === cat;
             });
             return brandMatch && colorMatch && sizeMatch && priceMatch && saleMatch && ratingMatch && materialMatch && tagMatch && categoryMatch;
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

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy, setCurrentPage]);

    const currentProducts = useMemo(() => {
        return filteredAndSortedProducts.slice(0, currentPage * productsPerPage);
    }, [filteredAndSortedProducts, currentPage, productsPerPage]);
    
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
    
    const ActiveFiltersBar = () => {
        const activeFiltersList: { type: keyof Filters | 'priceRange' | 'rating', value: any, label: string }[] = [];

        filters.brands.forEach(b => activeFiltersList.push({ type: 'brands', value: b, label: `العلامة التجارية: ${b}` }));
        filters.colors.forEach(c => activeFiltersList.push({ type: 'colors', value: c, label: c }));
        filters.sizes.forEach(s => activeFiltersList.push({ type: 'sizes', value: s, label: `المقاس: ${s}` }));
        filters.materials.forEach(m => activeFiltersList.push({ type: 'materials', value: m, label: `الخامة: ${m}` }));
        filters.tags.forEach(t => activeFiltersList.push({ type: 'tags', value: t, label: `وسم: ${t}` }));
        filters.categories.forEach(c => activeFiltersList.push({ type: 'categories', value: c, label: `الفئة: ${c}` }));
        if (filters.onSale) activeFiltersList.push({ type: 'onSale', value: true, label: 'في التخفيضات' });
        if (filters.rating > 0) activeFiltersList.push({ type: 'rating', value: filters.rating, label: `${filters.rating} نجوم وأعلى` });
        if (filters.priceRange.max < 1000) activeFiltersList.push({ type: 'priceRange', value: filters.priceRange.max, label: `حتى ${filters.priceRange.max} ج.م` });

        const removeFilter = (type: keyof Filters | 'priceRange' | 'rating', value: any) => {
            switch(type) {
                case 'brands':
                case 'colors':
                case 'sizes':
                case 'materials':
                case 'categories':
                case 'tags':
                    setFilters(prev => ({...prev, [type]: (prev[type as 'brands' | 'colors' | 'sizes' | 'materials' | 'categories' | 'tags'] as any[]).filter((item: any) => item !== value) }));
                    break;
                case 'onSale':
                    setFilters(prev => ({...prev, onSale: false }));
                    break;
                case 'rating':
                    setFilters(prev => ({...prev, rating: 0 }));
                    break;
                case 'priceRange':
                    setFilters(prev => ({...prev, priceRange: { min: 0, max: 1000 }}));
                    break;
            }
        };
        
        const clearAllFilters = () => {
            setFilters({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [], categories: [], tags: [] });
        }

        if (activeFiltersList.length === 0) return null;

        return (
            <div className="mb-6 flex items-center flex-wrap gap-3 animate-fade-in">
                <span className="text-sm font-bold text-brand-text-light">الفلاتر النشطة:</span>
                {activeFiltersList.map(({ type, value, label }) => (
                    <div key={`${type}-${value}`} className="group flex items-center gap-2 bg-surface text-brand-dark rounded-full pl-4 pr-2 py-1.5 text-sm font-semibold border border-brand-border hover:border-brand-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        {type === 'colors' ? (
                            <>
                                <span className="w-4 h-4 rounded-full border border-black/10" style={{backgroundColor: value}}></span>
                                <span className="font-mono uppercase text-xs">{label}</span>
                            </>
                        ) : <span>{label}</span>}
                        <button 
                            onClick={() => removeFilter(type, value)} 
                            className="text-brand-text-light group-hover:text-brand-dark hover:!text-brand-sale transition-colors -mr-1 p-1 rounded-full hover:!bg-brand-sale/10"
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button onClick={clearAllFilters} className="text-sm font-bold text-brand-sale hover:bg-brand-sale/10 rounded-full px-4 py-1.5 transition-colors">
                    مسح الكل
                </button>
            </div>
        );
    };
    
    const QuickFilters = () => {
        const isSaleActive = filters.onSale;
        const isTopRatedActive = filters.rating === 4;
        const isNewestActive = filters.tags.includes('جديد');
    
        const handleSaleToggle = () => {
            setFilters(prev => ({...prev, onSale: !prev.onSale}));
        }
        
        const handleRatingToggle = () => {
            setFilters(prev => ({...prev, rating: prev.rating === 4 ? 0 : 4}));
        }
    
        const handleNewestToggle = () => {
            setFilters(prev => ({...prev, tags: prev.tags.includes('جديد') ? prev.tags.filter(t => t !== 'جديد') : [...prev.tags, 'جديد']}));
        }
        
        const baseClass = "px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-colors duration-200";
        const activeClass = "bg-brand-primary/10 border-brand-primary text-brand-primary";
        const inactiveClass = "bg-surface border-brand-border text-brand-text-light hover:border-brand-dark hover:text-brand-dark";
    
        return (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-brand-text-light">اقتراحات:</span>
                <button onClick={handleSaleToggle} className={`${baseClass} ${isSaleActive ? activeClass : inactiveClass}`}>تخفيضات</button>
                <button onClick={handleRatingToggle} className={`${baseClass} ${isTopRatedActive ? activeClass : inactiveClass}`}>الأعلى تقييمًا ★</button>
                <button onClick={handleNewestToggle} className={`${baseClass} ${isNewestActive ? activeClass : inactiveClass}`}>وصل حديثاً</button>
            </div>
        );
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
                <aside className="w-1/4 hidden lg:block sticky top-28">
                    <FilterSidebar filters={filters} setFilters={setFilters} filterOptions={filterOptions} facetCounts={facetCounts} />
                </aside>

                <main className="w-full lg:w-3/4">
                     <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-2 bg-white rounded-xl shadow-sm border">
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 border border-brand-border rounded-full p-1 bg-surface">
                                <button onClick={() => setDisplayMode('grid-4')} title="4 Columns" className={`p-1.5 rounded-full transition-colors active:scale-95 ${displayMode === 'grid-4' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`}><GridViewIcon columns={4} className="w-5 h-5"/></button>
                                <button onClick={() => setDisplayMode('grid-3')} title="3 Columns" className={`p-1.5 rounded-full transition-colors active:scale-95 ${displayMode === 'grid-3' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`}><GridViewIcon columns={3} className="w-5 h-5"/></button>
                                <button onClick={() => setDisplayMode('grid-2')} title="2 Columns (Detailed)" className={`p-1.5 rounded-full transition-colors active:scale-95 ${displayMode === 'grid-2' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`}><GridViewIcon columns={2} className="w-5 h-5"/></button>
                                <div className="w-px h-5 bg-brand-border mx-1"></div>
                                <button onClick={() => setDisplayMode('list')} title="List View" className={`p-1.5 rounded-full transition-colors active:scale-95 ${displayMode === 'list' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`}><ListLayoutIcon className="w-5 h-5" /></button>
                            </div>
                            <p className="text-sm text-brand-text-light whitespace-nowrap">
                                {filteredAndSortedProducts.length} منتج
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <select 
                                    value={sortBy}
                                    onChange={handleSortByChange}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-dark/50 cursor-pointer w-full"
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
                            <button onClick={() => setIsFilterOpen(true)} className="relative flex lg:hidden items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50">
                                <span>تصفية</span>
                                <FilterSlidersIcon className="w-5 h-5"/>
                                {appliedFiltersCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{appliedFiltersCount}</span>}
                            </button>
                        </div>
                    </div>

                    <QuickFilters />
                    <ActiveFiltersBar />
                    
                    {isLoading ? (
                        <div className={`grid ${
                            displayMode === 'list' ? 'grid-cols-1' :
                            displayMode === 'grid-4' ? 'grid-cols-2 md:grid-cols-4' :
                            displayMode === 'grid-3' ? 'grid-cols-2 sm:grid-cols-3' :
                            'grid-cols-1 md:grid-cols-2'
                        } gap-x-4 gap-y-8`}>
                            {Array.from({ length: productsPerPage }).map((_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    ) : currentProducts.length > 0 ? (
                        <>
                            {displayMode === 'list' ? (
                                <div className="space-y-4">
                                    {currentProducts.map(product => <CollectionProductListCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                                </div>
                            ) : (
                                <div className={`grid ${
                                    displayMode === 'grid-4' ? 'grid-cols-2 md:grid-cols-4' :
                                    displayMode === 'grid-3' ? 'grid-cols-2 sm:grid-cols-3' :
                                    'grid-cols-1 md:grid-cols-2'
                                } gap-x-4 gap-y-8`}>
                                    {currentProducts.map(product => 
                                        displayMode === 'grid-2' ? (
                                            <ProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />
                                        ) : (
                                            <CollectionProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />
                                        )
                                    )}
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
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg border">
                            <h2 className="text-2xl font-bold text-brand-dark mb-2">لا توجد منتجات مطابقة</h2>
                            <p className="text-brand-text-light">حاول ضبط الفلاتر للعثور على ما تبحث عنه.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    </div>
    )
};

export default ShopPage;
