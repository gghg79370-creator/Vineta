import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { SaleCampaign } from '../../types';

interface CountdownSaleSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
    campaign: SaleCampaign;
}

export const CountdownSaleSection: React.FC<CountdownSaleSectionProps> = ({ navigateTo, campaign }) => {
    const timeLeft = useCountdown(new Date(campaign.saleEndDate));

    const timeUnits = [
        { value: timeLeft.days, label: 'أيام' },
        { value: timeLeft.hours, label: 'ساعات' },
        { value: timeLeft.minutes, label: 'دقائق' },
        { value: timeLeft.seconds, label: 'ثواني' },
    ];

    return (
        <section className="container mx-auto px-4 py-10">
            <div className="bg-orange-50 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-lg">
                <div className="md:w-1/2 p-6 md:p-12 text-center flex flex-col items-center order-2 md:order-1">
                    <p className="font-semibold text-brand-dark tracking-widest text-sm mb-2 uppercase">{campaign.subtitle}</p>
                    <h2 className="font-sans text-5xl sm:text-7xl font-extrabold text-brand-dark mb-4">{campaign.discountText}</h2>
                    <p className="font-semibold text-brand-text-light tracking-wider mb-8 uppercase">مع الرمز الترويجي: {campaign.couponCode}</p>
                    
                    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 w-full max-w-sm">
                        <div className="flex justify-around items-start text-center">
                             {timeUnits.map((unit, index) => (
                                <React.Fragment key={unit.label}>
                                    <div className="w-16">
                                        <span className="text-4xl sm:text-5xl font-bold text-brand-primary block">
                                            {String(unit.value).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-brand-text-light uppercase tracking-wider mt-1">{unit.label}</span>
                                    </div>
                                    {index < timeUnits.length - 1 && <span className="text-3xl sm:text-4xl font-bold text-brand-primary/80">:</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => navigateTo(campaign.page)} 
                        className="bg-white text-brand-dark font-bold py-3 px-10 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-100">
                        {campaign.buttonText}
                    </button>
                </div>
                <div 
                    className="md:w-1/2 w-full h-72 md:h-auto self-stretch bg-cover bg-center order-1 md:order-2"
                    style={{ backgroundImage: `url(${campaign.image})` }}
                    aria-label={`Sale for ${campaign.subtitle}`}
                />
            </div>
        </section>
    );
};