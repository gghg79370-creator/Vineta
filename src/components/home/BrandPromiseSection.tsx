import React from 'react';

export const BrandPromiseSection = () => (
    <section className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="text-right z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6 animate-fade-in-up">جودة يمكنك الوثوق بها</h2>
                    <p className="text-lg text-brand-text-light leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        في Vineta، نحن ملتزمون بتقديم أزياء ليست فقط جميلة ولكنها مصنوعة لتدوم. تم تصميم كل قطعة بعناية فائقة واهتمام بالتفاصيل، باستخدام أجود المواد فقط.
                    </p>
                    <button className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        اكتشف المزيد عن قصتنا
                    </button>
                </div>
                 <div className="relative h-96 md:h-[500px] order-first md:order-last">
                    <div className="absolute md:-right-20 top-0 w-full h-full group">
                         <img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1974&auto=format&fit=crop" alt="Quality craftsmanship" className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
);