import React from 'react';
import { Product } from '../../types';
import { EyeIcon } from '../icons';

// Data to match the screenshot content
const inspiredProducts: Product[] = [
    {
        id: 101,
        name: 'جل رغوي منظف ومشرق',
        price: '80.00',
        oldPrice: '100.00',
        image: 'https://i.imgur.com/8J3Dt8E.png',
        colors: [], sizes: [], tags: [], category: 'women',
    },
    {
        id: 102,
        name: 'خلاصة الشيح 160 مل',
        price: '120.00',
        image: 'https://i.imgur.com/i92ISmP.png',
        colors: [], sizes: [], tags: [], category: 'women',
    },
    {
        id: 103,
        name: 'خلاصة واقي الشمس رقم 1',
        price: '100.00',
        oldPrice: '130.00',
        image: 'https://i.imgur.com/cUThrd1.png',
        colors: [], sizes: [], tags: [], category: 'women',
    }
];

// Reusing some product data structure but simplified for this component
const productThumbnails: { [key: number]: string } = {
    101: 'https://i.imgur.com/V2NCT2L.png',
    102: 'https://i.imgur.com/sC4a391.png',
    103: 'https://i.imgur.com/1I45Tca.png'
};

interface InspiredByYouSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const InspiredProductCard: React.FC<{ product: Product, navigateTo: (pageName: string, data?: any) => void }> = ({ product, navigateTo }) => {
    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden group snap-center cursor-pointer" onClick={() => navigateTo('product', product)}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/40 backdrop-blur-lg p-3 rounded-xl flex items-center gap-3">
                <button className="bg-white/80 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-white transition-all shadow-md">
                    <EyeIcon size="sm" className="text-brand-dark"/>
                </button>
                <div className="text-right flex-1 min-w-0">
                    <p className="font-bold text-sm text-white text-shadow truncate">{product.name}</p>
                    <div className="flex items-baseline gap-2 justify-end">
                        <p className="font-bold text-white text-shadow text-sm">{product.price} ج.م</p>
                        {product.oldPrice && <p className="text-gray-200 text-shadow line-through text-xs">{product.oldPrice} ج.م</p>}
                    </div>
                </div>
                <img src={productThumbnails[product.id]} className="w-12 h-12 rounded-lg object-contain bg-white/80 p-1" alt={product.name} />
            </div>
        </div>
    );
};


export const InspiredByYouSection: React.FC<InspiredByYouSectionProps> = ({ navigateTo }) => {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="container mx-auto">
                <div className="text-center mb-8 px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">بإلهام منكِ</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-2 -mx-4 px-4 md:grid md:grid-cols-3 md:mx-0 md:px-0">
                    {inspiredProducts.map((product, index) => (
                        <div key={index} className="flex-shrink-0 w-[70%] sm:w-1/2 md:w-auto h-[60vh] max-h-[450px] snap-start">
                           <InspiredProductCard product={product} navigateTo={navigateTo} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};