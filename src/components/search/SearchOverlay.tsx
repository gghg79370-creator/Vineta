import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { CloseIcon, SearchIcon, FireIcon } from '../icons';
import { allProducts } from '../../data/products';
import { useAppState } from '../../state/AppState';

interface SearchOverlayProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
}

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <strong key={i} className="text-brand-dark">{part}</strong>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, setIsOpen, navigateTo }) => {
    const { state } = useAppState();
    const { theme } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const popularProducts = useMemo(() => 
        [...allProducts].sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0, 4), 
    []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const handler = setTimeout(() => {
            const lowerCaseTerm = searchTerm.toLowerCase();
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(lowerCaseTerm) ||
                p.tags.some(t => t.toLowerCase().includes(lowerCaseTerm)) ||
                p.brand?.toLowerCase().includes(lowerCaseTerm)
            );
            setResults(filtered);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigateTo('search', { q: searchTerm.trim() });
            setIsOpen(false);
        }
    };

    const handleProductClick = (product: Product) => {
        navigateTo('product', product);
        setIsOpen(false);
    };

    const handleClose = () => {
        setSearchTerm('');
        setResults([]);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-[70] animate-fade-in" role="dialog" aria-modal="true">
            <div className="container mx-auto px-4 h-full flex flex-col">
                <header className="flex items-center justify-between py-6 border-b">
                    <form onSubmit={handleSearch} className="relative flex-grow">
                        <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`بحث في ${theme.siteName}...`}
                            className="w-full bg-transparent border-none py-2 pr-12 pl-4 text-xl font-semibold focus:outline-none focus:ring-0"
                            autoFocus
                        />
                    </form>
                    <button onClick={handleClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-full">
                        <CloseIcon size="md" />
                    </button>
                </header>

                <main className="flex-1 py-8 overflow-y-auto">
                    {searchTerm.trim() ? (
                        <div>
                            {isSearching ? (
                                <p className="text-center text-gray-500">جاري البحث...</p>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {results.slice(0, 4).map(product => (
                                            <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                                                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <h4 className="font-semibold mt-2 text-sm"><HighlightMatch text={product.name} query={searchTerm} /></h4>
                                                <p className="text-brand-primary font-bold">{product.price} ج.م</p>
                                            </div>
                                        ))}
                                    </div>
                                    {results.length > 4 && (
                                        <div className="text-center mt-8">
                                            <button onClick={handleSearch} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">
                                                عرض جميع النتائج ({results.length})
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-gray-500">لم يتم العثور على نتائج لـ "{searchTerm}"</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2"><FireIcon size="sm" className="text-orange-500" /> المنتجات الأكثر رواجاً</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {popularProducts.map(product => (
                                    <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <h4 className="font-semibold mt-2 text-sm truncate">{product.name}</h4>
                                        <p className="text-brand-primary font-bold">{product.price} ج.م</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
