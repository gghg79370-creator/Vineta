import React from 'react';

interface SustainableFashionSectionProps {
    navigateTo: (pageName: string) => void;
}

export const SustainableFashionSection = ({ navigateTo }: SustainableFashionSectionProps) => (
    <section className="py-20 bg-emerald-50/50 overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-end min-h-[500px]">
                <div className="absolute right-0 top-0 h-full w-full md:w-3/5 rounded-2xl overflow-hidden group shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1964&auto=format&fit=crop" alt="Sustainable Fashion Model" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                </div>
                <div className="relative md:absolute left-0 w-full md:w-1/2 bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl text-right animate-fade-in-up border border-white">
                     <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6">أزياء مستدامة</h2>
                    <p className="text-brand-text-light text-lg max-w-lg mx-auto md:mx-0 mb-10 leading-relaxed">اطلعي بمظهر جيد، واشعري بالرضا مع تصاميمنا الصديقة للبيئة والأنيقة التي تحتفي بالاستدامة دون المساومة على الأسلوب.</p>
                    <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 active:scale-100 shadow-md hover:shadow-lg">تسوقي المستدام</button>
                </div>
            </div>
        </div>
    </section>
);