import React from 'react';
import { Product } from '../../types';
import { allProducts } from '../../data/products';

interface ShopByLookSectionProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
}

const Hotspot = ({ top, right, product, navigateTo, addToCart }: { 
    top: string, 
    right: string, 
    product: Product, 
    navigateTo: (pageName: string, data?: Product) => void,
    addToCart: (product: Product) => void 
}) => (
    <div className="absolute" style={{ top, right }}>
        <div className="relative group flex items-center justify-center">
            <div className="absolute w-6 h-6 bg-white rounded-full animate-sonar-pulse"></div>
            <div className="relative w-4 h-4 bg-white rounded-full cursor-pointer shadow-md"></div>
            <div className="absolute bottom-full mb-4 w-56 bg-surface rounded-xl shadow-2xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover cursor-pointer" onClick={() => navigateTo('product', product)}/>
                    </div>
                    <div className="flex-1 text-right">
                         <p className="font-bold text-sm text-brand-dark cursor-pointer line-clamp-2" onClick={() => navigateTo('product', product)}>{product.name}</p>
                         <p className="text-brand-primary font-bold text-sm mt-1">{product.price} ج.م</p>
                    </div>
                </div>
                <button onClick={() => addToCart(product)} className="w-full mt-2 bg-brand-dark text-white text-xs font-bold py-2 rounded-full hover:bg-opacity-90 transition-colors">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    </div>
);

export const ShopByLookSection = ({ navigateTo, addToCart }: ShopByLookSectionProps) => {
    // Use real products from the data source to prevent type errors
    const hotspotProducts = [
        allProducts.find(p => p.id === 2),
        allProducts.find(p => p.id === 3),
        allProducts.find(p => p.id === 8),
    ].filter((p): p is Product => p !== undefined);

    if (hotspotProducts.length < 3) {
        // Gracefully handle case where products are not found
        return null;
    }

    return (
        <section className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl font-extrabold text-brand-dark mb-4">تسوقي الإطلالة</h2>
            <p className="text-brand-text-light max-w-2xl mx-auto mb-10">احصلي على الإطلالة الكاملة مع قطعنا المختارة بعناية والتي تكمل بعضها البعض بشكل مثالي.</p>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video md:aspect-[2/1]">
                <img src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto=format&fit=crop" alt="تسوقي الإطلالة" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Hotspots - positions are percentages from the right */}
                <Hotspot top="30%" right="35%" product={hotspotProducts[0]} navigateTo={navigateTo} addToCart={addToCart} />
                <Hotspot top="70%" right="50%" product={hotspotProducts[1]} navigateTo={navigateTo} addToCart={addToCart} />
                <Hotspot top="65%" right="25%" product={hotspotProducts[2]} navigateTo={navigateTo} addToCart={addToCart} />
            </div>
        </section>
    );
};