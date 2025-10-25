

import React from 'react';
import { StarIcon } from '../icons';
import { allProducts } from '../../data/products';

const testimonialsData = [
    {
        author: "إميلي ت.",
        rating: 5,
        quote: "جودة الملابس فاقت توقعاتي. كل قطعة تبدو فاخرة، والتصاميم عصرية جداً. أنا مهووسة بإضافاتي الجديدة لخزانة ملابسي.",
        product: { ...allProducts[1], name: "كروب توب" }
    },
    {
        author: "جيسيكا م.",
        rating: 5,
        quote: "أحببت الفستان الذي اشتريته! القماش ناعم جداً والمقاس مثالي. تلقيت الكثير من الإطراءات عليه. سأعود للتسوق هنا بالتأكيد.",
        product: { ...allProducts[4], name: "سويت شيرت قصير" }
    },
    {
        author: "ليزا ب.",
        rating: 5,
        quote: "لقد فوجئت بسرعة وصول طلبي. فريق خدمة العملاء كان متعاوناً وسريع الاستجابة. تجربة تسوق رائعة!",
        product: { ...allProducts[6], name: "تيشيرت أساسي طويل" }
    }
];

interface TestimonialsSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const TestimonialCard: React.FC<{ testimonial: typeof testimonialsData[0], navigateTo: (pageName: string, data?: any) => void }> = ({ testimonial, navigateTo }) => (
    <div className="testimonial-card p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between border border-brand-border/50">
        <div>
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-brand-text">
                    <i className="fa-solid fa-check-circle text-brand-instock ml-2" aria-hidden="true"></i>
                    مشتري معتمد - {testimonial.author}
                </p>
                <div className="flex text-brand-onway">
                    {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
                </div>
            </div>
            <p className="text-brand-text-light leading-relaxed mb-4">"{testimonial.quote}"</p>
        </div>
        <div className="mt-auto pt-4 border-t border-brand-border/50">
            <div className="flex items-center gap-3 cursor-pointer group/product" onClick={() => navigateTo('product', testimonial.product)}>
                <img src={testimonial.product.image} alt={testimonial.product.name} className="w-14 h-14 object-cover rounded-lg"/>
                <div className="flex-1">
                    <p className="font-bold text-sm text-brand-dark group-hover/product:text-brand-primary transition-colors">{testimonial.product.name}</p>
                    <p className="text-sm text-brand-text-light">تم شراء هذا المنتج</p>
                </div>
                <p className="font-bold text-brand-dark">{testimonial.product.price} ج.م</p>
            </div>
        </div>
    </div>
);


export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ navigateTo }) => {
    return (
        <section id="testimonials" className="py-12 md:py-20 bg-brand-subtle">
            <div className="container mx-auto overflow-hidden">
                <div className="text-center mb-8 px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">عملاء سعداء</h2>
                </div>
                
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-2 -mx-4 px-4 md:grid md:grid-cols-3 md:mx-0 md:px-0">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="flex-shrink-0 w-[85%] sm:w-2/3 md:w-auto snap-start">
                            <TestimonialCard testimonial={testimonial} navigateTo={navigateTo} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};