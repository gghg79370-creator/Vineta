

import React, { useState, useMemo, useEffect } from 'react';
import { Product, Filters } from '../types';
import { allProducts } from '../data/products';
import { CollectionProductCard } from '../components/product/CollectionProductCard';
import { FilterSlidersIcon, ChevronRightIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { useQuery } from '../hooks/useQuery';
import { ProductCardSkeleton } from '../components/ui/ProductCardSkeleton';
import { useToast } from '../hooks/useToast';

interface SearchPageProps {
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    setIsFilterOpen: (isOpen: boolean) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const SearchPage = ({ navigateTo, addToCart, openQuickView, setIsFilterOpen, filters }: SearchPageProps) => {
    const { state, dispatch } = useAppState();
    const { compareList, wishlist, currentUser } = state;
    const addToast = useToast();
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    const query = useQuery();
    const searchTerm = query.get('q') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const appliedFiltersCount = useMemo(() => {
        const { brands, colors, sizes, priceRange, rating, onSale, materials, categories } = filters;
        return [
            brands.length > 0,
            colors.length > 0,
            sizes.length > 0,
            priceRange.min > 0 || priceRange.max < 1000,
            rating > 0,
            onSale,
            materials.length > 0,
            categories.length > 0
        ].filter(Boolean).length;
    }, [filters]);

    const filteredAndSortedProducts = useMemo(() => {
        if (!searchTerm) return [];

        let products = allProducts.filter(p => {
            const searchTermMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
            if (!searchTermMatch) return false;

            // Apply global filters
            const brandMatch = filters.brands.length === 0 || (p.brand && filters.brands.includes(p.brand));
            const colorMatch = filters.colors.length === 0 || p.colors.some(c => filters.colors.includes(c));
            const sizeMatch = filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s));
            const priceMatch = parseFloat(p.price) >= filters.priceRange.min && parseFloat(p.price) <= filters.priceRange.max;
            const saleMatch = !filters.onSale || !!p.oldPrice;
            const ratingMatch = !filters.rating || (p.rating && p.rating >= filters.rating);
            const materialMatch = filters.materials.length === 0 || filters.materials.some(m => p.tags.includes(m));
            const categoryMatch = filters.categories.length === 0 || filters.categories.some(cat => {
                if (cat === 'accessories') return p.tags.includes('إكسسوارات');
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
            case 'relevance':
            default:
                // Basic relevance sorting (name match > brand > tags)
                 products.sort((a, b) => {
                    const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
                    if (aNameMatch && !bNameMatch) return -1;
                    if (!aNameMatch && bNameMatch) return 1;
                    return 0;
                });
                break;
        }

        return products;
    }, [searchTerm, sortBy, filters]);
    
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addToCompare = (product: Product) => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
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

    return (
    <div className="bg-brand-subtle">
        <div className="bg-white py-8 border-b">
            <div className="container mx-auto px-4 text-center">
                 <h1 className="text-4xl font-extrabold text-brand-dark">نتائج البحث</h1>
                 {searchTerm && <p className="mt-2 text-lg text-gray-600">"{searchTerm}"</p>}
            </div>
        </div>

        <div className="container mx-auto px-4 py-12">
            <main className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-sm border">
                    <p className="text-sm text-brand-text-light whitespace-nowrap">
                        تم العثور على {filteredAndSortedProducts.length} منتج
                    </p>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => setIsFilterOpen(true)} className="relative flex items-center gap-2 bg-white border border-brand-border rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50">
                            <span>تصفية</span>
                            <FilterSlidersIcon className="w-5 h-5"/>
                            {appliedFiltersCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{appliedFiltersCount}</span>}
                        </button>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-brand-border rounded-full px-4 py-2 text-sm font-semibold w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                        >
                            <option value="relevance">الأكثر صلة</option>
                            <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
                            <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
                            <option value="newest">أحدث المنتجات</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                    </div>
                ) : currentProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {currentProducts.map(product => <CollectionProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistIds} toggleWishlist={toggleWishlist} />)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-brand-dark mb-2">لم يتم العثور على نتائج</h2>
                        <p className="text-brand-text-light">جرّب البحث عن مصطلح مختلف أو تحقق من الإملاء.</p>
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
    )
};

export default SearchPage;