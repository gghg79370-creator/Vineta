import React from 'react';
import { Product } from '../../types';
import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon, CompareIcon, FireIcon } from '../icons';

interface ProductCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    wishlistItems: number[];
    toggleWishlist: (product: Product) => void;
    compareList: number[];
    addToCompare: (product: Product) => void;
}

export const CollectionProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    navigateTo, 
    addToCart, 
    openQuickView, 
    wishlistItems, 
    toggleWishlist, 
    compareList, 
    addToCompare 
}) => {
    const isInWishlist = wishlistItems.includes(product.id);
    const isInCompare = compareList.includes(product.id);
    const alternativeImage = product.images?.find(img => img !== product.image);
    const stock = product.itemsLeft !== undefined ? product.itemsLeft : (product.variants ? product.variants.reduce((acc, v) => acc + v.stock, 0) : 11);


    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.variants && product.variants.length > 0) {
            openQuickView(product);
        } else {
            addToCart(product);
        }
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product);
    };
    
    const handleAddToCompare = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCompare(product);
    };

    const handleOpenQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        openQuickView(product);
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-brand-dark text-white',
        trending: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        custom: 'bg-blue-100 text-blue-800',
    };
    
    const ActionButton = ({ onClick, icon, label, delay, active = false }: { onClick: (e: React.MouseEvent) => void; icon: React.ReactNode; label: string; delay: string; active?: boolean }) => (
        <button
            onClick={onClick}
            aria-label={label}
            className={`bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 hover:bg-brand-primary hover:text-white active:scale-90 ${delay} ${active ? 'text-brand-primary' : 'text-brand-dark'}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="group relative text-center bg-white border border-gray-100 dark:bg-surface dark:border-line rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-brand-primary" onClick={() => navigateTo('product', product)}>
            <div className="relative overflow-hidden">
                <div className="bg-gray-100 aspect-[3/4]">
                    <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-500 md:group-hover:scale-110 ${alternativeImage ? 'md:group-hover:opacity-0' : ''}`} />
                    {alternativeImage && (
                        <img src={alternativeImage} alt={`${product.name} alternate view`} className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:group-hover:scale-110" />
                    )}
                </div>
                
                {/* Dynamic Badges */}
                <div className="absolute top-3 left-3 flex flex-col items-start gap-y-2 z-10">
                    {product.badges?.map((badge, index) => (
                        <div key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                            {badge.text}
                        </div>
                    ))}
                </div>

                 {/* Urgency Badges & Stock Status */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-y-2 z-10">
                    {stock <= 0 ? (
                         <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            نفد المخزون
                        </div>
                    ) : stock <= 10 && (
                        <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            مخزون منخفض
                        </div>
                    )}
                    {product.soldIn24h && product.soldIn24h > 50 && (
                         <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <FireIcon size="sm" />
                            <span>بيع سريع</span>
                        </div>
                    )}
                </div>

                {/* Desktop Hover Actions */}
                <div className="hidden md:block absolute top-4 right-4 z-20 space-y-2">
                    <ActionButton onClick={handleToggleWishlist} icon={<HeartIcon filled={isInWishlist} size="sm" />} label="Add to wishlist" delay="delay-75" active={isInWishlist} />
                    <ActionButton onClick={handleAddToCompare} icon={<CompareIcon size="sm" />} label="Compare" delay="delay-150" active={isInCompare} />
                    <ActionButton onClick={handleOpenQuickView} icon={<EyeIcon size="sm" />} label="Quick view" delay="delay-200" />
                    <ActionButton onClick={handleAddToCart} icon={<ShoppingBagIcon size="sm" />} label="Add to cart" delay="delay-300" />
                </div>
            </div>

            {/* Common Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-brand-text-light mb-1 truncate">
                    {product.tags.slice(0, 2).map((tag, index) => (
                        <span key={tag}>
                            {tag}
                            {index < 1 && product.tags.length > 1 && ', '}
                        </span>
                    ))}
                </div>
                <p className="font-semibold md:font-bold text-sm md:text-base text-brand-dark truncate mb-1 md:mb-2 flex-grow">{product.name}</p>
                
                <div className="flex justify-center items-baseline gap-2 mb-3">
                    <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-gray-400 text-xs">{product.oldPrice} ج.م</span>}
                </div>
                
                <div className="flex justify-center gap-1.5 h-5">
                    {product.colors.slice(0, 5).map(color => (
                        <span key={color} className="w-5 h-5 rounded-full border dark:border-line" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
                
                {/* Mobile-only actions */}
                <div className="mt-4 pt-4 border-t md:hidden">
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={handleAddToCart} className="flex-1 bg-brand-dark text-white font-bold py-2 rounded-full text-xs flex items-center justify-center gap-1">
                            <ShoppingBagIcon size="sm"/>
                            أضف للسلة
                        </button>
                        <button onClick={handleToggleWishlist} className={`p-2.5 rounded-full border transition-colors ${isInWishlist ? 'text-brand-primary border-brand-primary/50 bg-brand-primary/10' : 'border-brand-border'}`} aria-label="Toggle Wishlist">
                            <HeartIcon filled={isInWishlist} size="sm" />
                        </button>
                        <button onClick={handleOpenQuickView} className="p-2.5 rounded-full border border-brand-border" aria-label="Quick View">
                            <EyeIcon size="sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};