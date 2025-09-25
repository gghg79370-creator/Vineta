

import React, { useState } from 'react';
import { TrendingProductsSection } from '../product/TrendingProductsSection';
import { StarIcon, ArrowLongRightIcon, QuoteIcon } from '../icons';
import { allProducts } from '../../data/products';
import { Product } from '../../types';

interface TestimonialsSectionProps {
    short?: boolean;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

const testimonials = [
    {
        quote: "أنيق ومريح ومثالي لأي مناسبة! وجهتي الجديدة المفضلة للتسوق.",
        author: "فيوليتا ب.",
        image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
        quote: "جودة المنتجات رائعة والتوصيل كان سريعًا جدًا. سأعود للتسوق مرة أخرى بالتأكيد.",
        author: "أحمد م.",
        image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
        quote: "أحببت الفستان الذي اشتريته! التصميم فريد والخامة ممتازة. شكرًا Vineta!",
        author: "سارة ك.",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
];

export const TestimonialsSection = ({ short = false, addToCart, openQuickView, compareList, addToCompare, wishlistItems, toggleWishlist }: TestimonialsSectionProps) => {
    const [current, setCurrent] = useState(0);

    const nextTestimonial = () => {
        setCurrent(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const prevTestimonial = () => {
        setCurrent(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };
    
    const activeTestimonial = testimonials[current];

    return (
        <section className={`py-20 ${short ? '' : 'bg-brand-subtle'}`}>
            <div className="container mx-auto px-4">
                {!short && <h2 className="text-4xl font-extrabold text-center text-brand-dark mb-12">ماذا يقول عملاؤنا</h2>}
                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-10 rounded-2xl border border-brand-border shadow-lg min-h-[320px] flex flex-col justify-center items-center transition-all duration-300 relative overflow-hidden">
                        <QuoteIcon className="absolute -top-4 -right-4 w-32 h-32 text-brand-border/80" />
                        <div key={current} className="animate-fade-in">
                            <img src={activeTestimonial.image} alt={activeTestimonial.author} className="w-20 h-20 rounded-full mb-4 border-4 border-white shadow-md relative z-10"/>
                            <div className="flex justify-center text-yellow-400 mb-4 relative z-10">{[...Array(5)].map((_,i) => <StarIcon key={i}/>)}</div>
                            <p className="text-xl text-brand-dark font-semibold mb-6 transition-opacity duration-300 max-w-xl relative z-10">
                               "{activeTestimonial.quote}"
                            </p>
                            <p className="font-bold text-brand-dark relative z-10">{activeTestimonial.author}</p>
                            {!short && <p className="text-sm text-brand-text-light relative z-10">مشتري معتمد</p>}
                        </div>
                    </div>
                     <button onClick={prevTestimonial} className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-brand-subtle transition-all" aria-label="الشهادة السابقة"><ArrowLongRightIcon/></button>
                     <button onClick={nextTestimonial} className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-brand-subtle rotate-180" aria-label="الشهادة التالية"><ArrowLongRightIcon/></button>
                </div>
                 <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${current === index ? 'bg-brand-dark w-6' : 'bg-brand-border w-2 hover:bg-brand-text-light'}`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
                {!short && <TrendingProductsSection title="قد يعجبك أيضًا" products={allProducts.slice(4,8)} navigateTo={() => {}} addToCart={addToCart} openQuickView={openQuickView} isCarousel compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />}
            </div>
        </section>
    );
}