
import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownSaleSectionProps {
    navigateTo: (pageName: string) => void;
}

export const CountdownSaleSection = ({ navigateTo }: CountdownSaleSectionProps) => {
    const timeLeft = useCountdown(new Date("2025-01-01"));

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="bg-gradient-to-tr from-rose-100 via-white to-orange-100 rounded-2xl flex flex-col md:flex-row items-center overflow-hidden shadow-lg">
                <div className="flex-1 p-8 md:p-16 text-center md:text-right">
                    <p className="font-bold text-brand-primary mb-2 text-lg animate-fade-in-up">تخفيضات الصيف الحصرية</p>
                    <h2 className="text-5xl font-extrabold text-brand-dark mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>خصم 50%</h2>
                    <p className="text-brand-text-light mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>استخدم الرمز الترويجي عند الدفع:</p>
                    <div className="inline-block border-2 border-dashed border-brand-primary bg-white py-3 px-6 rounded-lg mb-10 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                        <span className="font-extrabold text-2xl text-brand-dark tracking-widest">SUMMER50</span>
                    </div>

                    <div className="flex justify-center md:justify-start gap-4 mb-10 text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                        <div className="bg-white/50 p-3 rounded-lg w-20 shadow-sm"><span className="text-4xl font-bold text-brand-dark block">{timeLeft.days}</span> <span className="text-xs text-brand-text-light">أيام</span></div>
                        <div className="text-4xl font-bold text-brand-dark self-center pb-5">:</div>
                        <div className="bg-white/50 p-3 rounded-lg w-20 shadow-sm"><span className="text-4xl font-bold text-brand-dark block">{timeLeft.hours}</span> <span className="text-xs text-brand-text-light">ساعات</span></div>
                        <div className="text-4xl font-bold text-brand-dark self-center pb-5">:</div>
                        <div className="bg-white/50 p-3 rounded-lg w-20 shadow-sm"><span className="text-4xl font-bold text-brand-dark block">{timeLeft.minutes}</span> <span className="text-xs text-brand-text-light">دقائق</span></div>
                        <div className="text-4xl font-bold text-brand-dark self-center pb-5">:</div>
                        <div className="bg-white/50 p-3 rounded-lg w-20 shadow-sm"><span className="text-4xl font-bold text-brand-dark block">{timeLeft.seconds}</span> <span className="text-xs text-brand-text-light">ثواني</span></div>
                    </div>
                    <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 animate-fade-in-up" style={{animationDelay: '1s'}}>تسوق العرض الآن</button>
                </div>
                <div className="flex-1 w-full md:w-auto h-64 md:h-auto self-stretch">
                    <img src="https://images.unsplash.com/photo-1574281358313-946a3375a5a1?q=80&w=1974&auto=format&fit=crop" alt="Sale model" className="w-full h-full object-cover"/>
                </div>
            </div>
        </section>
    );
}
