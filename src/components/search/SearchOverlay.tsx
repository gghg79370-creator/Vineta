

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { allProducts } from '../../data/products';
import { CloseIcon, SearchIcon } from '../icons';
import { CollectionProductCard } from '../product/CollectionProductCard';

interface SearchOverlayProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

const levenshteinDistance = (a: string = "", b: string = ""): number => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const matrix = Array(bLower.length + 1).fill(null).map(() => Array(aLower.length + 1).fill(null));

    for (let i = 0; i <= aLower.length; i += 1) {
        matrix[0][i] = i;
    }
    for (let j = 0; j <= bLower.length; j += 1) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= bLower.length; j += 1) {
        for (let i = 1; i <= aLower.length; i += 1) {
            const indicator = aLower[i - 1] === bLower[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + indicator, // substitution
            );
        }
    }

    return matrix[bLower.length][aLower.length];
};


export const SearchOverlay = ({ isOpen, setIsOpen, navigateTo, addToCart, openQuickView, compareList, addToCompare, wishlistItems, toggleWishlist }: SearchOverlayProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const featuredProducts = allProducts.slice(0, 5);
    const totalPages = Math.ceil(featuredProducts.length / 2);
    const currentPage = scrollPosition;

    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();

        const filteredProducts = allProducts
            .map(product => ({
                ...product,
                distance: levenshteinDistance(lowercasedTerm, product.name),
            }))
            .filter(product => 
                product.name.toLowerCase().includes(lowercasedTerm) || 
                product.distance <= Math.floor(lowercasedTerm.length / 3) // Allow some typos
            )
            .sort((a, b) => a.distance - b.distance);

        setSearchResults(filteredProducts.slice(0, 6));
    }, [searchTerm]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const itemWidth = scrollWidth / featuredProducts.length;
            const newPos = Math.round(scrollLeft / (itemWidth * 2));
            setScrollPosition(newPos);
        }
    };


    if (!isOpen) return null;

    const handleNavigation = (product: Product) => {
        navigateTo('product', product);
        setIsOpen(false);
    };

    return (
         <div className="fixed inset-0 bg-white z-[70] animate-fade-in">
             <div className="container mx-auto px-4 py-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark">ما الذي تبحث عنه؟</h2>
                    <button onClick={() => setIsOpen(false)} aria-label="Close search"><CloseIcon/></button>
                </div>
                <div className="relative mb-6">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><SearchIcon/></div>
                    <input 
                        type="search" 
                        placeholder="بحث..." 
                        className="w-full bg-white border border-brand-border rounded-full py-3 pr-12 pl-5 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="font-bold mb-3 text-brand-dark">عمليات البحث الشائعة:</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['فستان', 'قميص', 'جديد', 'تخفيضات'].map(term => (
                                <button key={term} onClick={() => setSearchTerm(term)} className="px-4 py-1.5 bg-brand-subtle rounded-full text-sm hover:bg-brand-border">{term}</button>
                            ))}
                        </div>
                    </div>
                    
                    {searchTerm.trim().length < 2 ? (
                        <div>
                            <h3 className="font-bold mb-3 text-brand-dark">المنتج المميز</h3>
                             <div 
                                ref={scrollContainerRef} 
                                onScroll={handleScroll} 
                                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4 -mb-4"
                            >
                                {featuredProducts.map(product => (
                                    <div key={product.id} className="flex-shrink-0 w-48">
                                        <CollectionProductCard product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-2 mt-8">
                                {[...Array(totalPages)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === currentPage ? 'bg-brand-dark' : 'bg-brand-border'}`} />
                                ))}
                            </div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div>
                             <h3 className="font-bold mb-4 text-brand-dark">اقتراحات المنتجات</h3>
                             <div className="space-y-2">
                                {searchResults.map(product => (
                                    <button 
                                        key={product.id} 
                                        onClick={() => handleNavigation(product)}
                                        className="w-full text-right flex items-center gap-4 p-3 rounded-lg hover:bg-brand-subtle transition-colors"
                                    >
                                        <img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-md flex-shrink-0"/>
                                        <div className="flex-1">
                                            <p className="font-bold text-brand-dark">{product.name}</p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-brand-primary font-bold">{product.price} ج.م</span>
                                                {product.oldPrice && <span className="text-sm text-brand-text-light line-through">{product.oldPrice} ج.م</span>}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                             </div>
                        </div>
                    ) : (
                         <div className="text-center py-10">
                            <p className="text-lg font-semibold text-brand-dark">لم يتم العثور على نتائج لـ "{searchTerm}"</p>
                            <p className="text-brand-text-light mt-1">جرّب البحث عن مصطلح مختلف أو تحقق من الإملاء.</p>
                        </div>
                    )}
                 </div>
             </div>
         </div>
    )
}