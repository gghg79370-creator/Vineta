import React from 'react';
import { SaleCampaign } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownSaleSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
    campaign: SaleCampaign;
}

const CountdownTimer = ({ targetDate }: { targetDate: Date | null }) => {
    const timeLeft = useCountdown(targetDate);
    // RTL Order: Days, Hours, Mins, Secs
    const timeParts = [
        { label: 'أيام', value: timeLeft.days },
        { label: 'ساعات', value: timeLeft.hours },
        { label: 'دقائق', value: timeLeft.minutes },
        { label: 'ثواني', value: timeLeft.seconds },
    ];
    
    if (!targetDate) {
        return null;
    }
    
    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 my-6 md:my-8">
            <div className="flex justify-center items-start gap-x-2 md:gap-x-4">
                {timeParts.map((part, index) => (
                    <React.Fragment key={part.label}>
                        <div className="flex flex-col items-center w-16">
                            <span className="text-4xl md:text-5xl font-bold text-red-500 tabular-nums">{String(part.value).padStart(2, '0')}</span>
                            <span className="text-xs text-gray-500 mt-1">{part.label}</span>
                        </div>
                        {index < timeParts.length - 1 && (
                            <span className="text-3xl md:text-4xl font-semibold text-red-400 mt-1">:</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


export const CountdownSaleSection: React.FC<CountdownSaleSectionProps> = ({ navigateTo, campaign }) => {
    const saleEndDate = campaign.saleEndDate ? new Date(campaign.saleEndDate) : null;
    
    const saleTitle = "تخفيضات الصيف"; // "SUMMER SALE" in Arabic
    const discountText = "خصم 50%"; // "50% OFF" in Arabic. Campaign data has this already.

    return (
        <section className="container mx-auto px-4 py-10">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group min-h-[550px]">
                <img 
                    src="https://images.unsplash.com/photo-1618778603069-c52379d033a8?q=80&w=1974&auto=format&fit=crop"
                    alt="خلفية تخفيضات الصيف"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-rose-100/60"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <p className="font-semibold text-brand-dark tracking-widest text-sm uppercase">{saleTitle}</p>
                    <h2 className="font-sans text-7xl sm:text-8xl lg:text-9xl font-extrabold text-brand-dark my-2 leading-none">{discountText}</h2>
                    <p className="font-semibold text-gray-800 tracking-wider mb-2 uppercase">مع الرمز الترويجي: {campaign.couponCode}</p>
                    
                    <CountdownTimer targetDate={saleEndDate} />

                    <button 
                        onClick={() => navigateTo(campaign.page)} 
                        className="bg-white text-brand-dark font-bold py-3 px-10 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-100"
                    >
                        {campaign.buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
};