import React from 'react';
import { Product } from '../../types';
import { allProducts } from '../../data/products';
import { EyeIcon } from '../icons';

interface FeaturedProductSectionProps {
    navigateTo: (pageName: string, data?: Product) => void;
}

export const FeaturedProductSection: React.FC<FeaturedProductSectionProps> = ({ navigateTo }) => {
    const featuredProduct = allProducts.find(p => p.id === 1); 

    if (!featuredProduct) return null;

    return (
        <section className="bg-white py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* Text Content */}
                    <div className="text-center md:text-right z-10 animate-fade-in-up order-2 md:order-1">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6">
                           ارتقِ برحلة أناقتك
                        </h2>
                        <p className="text-lg text-brand-text-light leading-relaxed mb-10" style={{ animationDelay: '0.2s' }}>
                           اكتشفي قطعًا خالدة تعكس الأناقة والرقي.
                        </p>
                        <button 
                            onClick={() => navigateTo('shop')}
                            className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto md:mx-0" 
                            style={{ animationDelay: '0.4s' }}>
                            <span>تسوق الآن</span>
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                        </button>
                    </div>

                    {/* Image Content */}
                    <div className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-[550px] group order-1 md:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <img 
                            src="https://i.imgur.com/gK2n1uR.png" 
                            alt="ارتقِ برحلة أناقتك" 
                            className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 md:group-hover:scale-105"
                        />
                        
                        <div 
                            className="absolute bottom-4 left-4 right-4 bg-white/60 backdrop-blur-lg p-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 transform md:group-hover:scale-105 md:group-hover:shadow-xl"
                        >
                            <img 
                                src="https://i.ibb.co/b3yQRw5/shirt-neck-t-shirt.png" 
                                className="w-16 h-20 rounded-lg object-cover cursor-pointer" 
                                alt="تي شيرت بياقة قميص"
                                onClick={() => navigateTo('product', featuredProduct)}
                            />
                            <div className="text-right flex-1">
                                <p 
                                    className="font-bold text-sm line-clamp-2 text-brand-dark hover:text-brand-primary cursor-pointer"
                                    onClick={() => navigateTo('product', featuredProduct)}
                                >
                                   تي شيرت بياقة قميص
                                </p>
                                <p className="font-bold text-brand-primary text-sm mt-1">150.00 ج.م</p>
                            </div>
                            <button 
                                onClick={() => navigateTo('product', featuredProduct)}
                                className="bg-white/80 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-white transition-all shadow-md md:group-hover:scale-110"
                            >
                                <EyeIcon size="sm" className="text-brand-dark"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};