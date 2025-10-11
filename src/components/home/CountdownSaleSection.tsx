import React from 'react';
import { SaleCampaign } from '../../types';

interface CountdownSaleSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
    campaign: SaleCampaign;
}

export const CountdownSaleSection: React.FC<CountdownSaleSectionProps> = ({ navigateTo, campaign }) => {

    return (
        <section className="container mx-auto px-4 py-10">
            <div className="bg-gradient-to-l from-yellow-100 via-orange-100 to-rose-100 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-lg min-h-[450px] md:h-[500px]">
                <div 
                    className="md:w-1/2 w-full h-72 md:h-auto self-stretch bg-cover bg-center order-1 md:order-2"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551803091-e206d0b84336?q=80&w=1974&auto=format&fit=crop')` }}
                    aria-label={`Sale for ${campaign.subtitle}`}
                />
                <div className="md:w-1/2 p-6 md:p-12 flex flex-col items-center justify-center order-2 md:order-1 text-center">
                    <p className="font-semibold text-brand-dark tracking-[0.2em] text-sm mb-4 uppercase">{campaign.subtitle}</p>
                    <h2 className="font-sans text-6xl sm:text-7xl lg:text-8xl font-extrabold text-brand-dark mb-4 leading-none">{campaign.discountText}</h2>
                    <p className="font-semibold text-brand-text-light tracking-wider mb-8 uppercase">مع الرمز الترويجي: {campaign.couponCode}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                        <button 
                            className="w-full bg-white text-brand-dark font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-100"
                        >
                           !الوقت ينتهي
                        </button>
                        <button 
                            onClick={() => navigateTo(campaign.page)} 
                            className="w-full bg-white text-brand-dark font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-100"
                        >
                            {campaign.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};