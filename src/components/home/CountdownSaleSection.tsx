import React, { useState } from 'react';
import { SaleCampaign } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { useToast } from '../../hooks/useToast';
import { ClipboardIcon, ClipboardCheckIcon } from '../icons';

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
        <div className="flex items-center gap-x-2 md:gap-x-3" dir="ltr">
            {timeParts.map((part, index) => (
                <React.Fragment key={part.label}>
                    <div className="bg-brand-dark text-white rounded-lg p-3 w-20 text-center shadow-md border border-brand-border">
                        <span className="text-4xl font-bold tabular-nums">{String(part.value).padStart(2, '0')}</span>
                        <span className="text-xs uppercase opacity-70 block mt-1">{part.label}</span>
                    </div>
                    {index < timeParts.length - 1 && (
                        <span className="text-4xl font-bold text-brand-dark animate-pulse">:</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


export const CountdownSaleSection: React.FC<CountdownSaleSectionProps> = ({ navigateTo, campaign }) => {
    const saleEndDate = campaign.saleEndDate ? new Date(campaign.saleEndDate) : null;
    const addToast = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(campaign.couponCode);
        setIsCopied(true);
        addToast(`تم نسخ الكود: ${campaign.couponCode}`, 'success');
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    return (
        <section className="container mx-auto px-4 py-10 md:py-20">
            <div className="relative rounded-2xl overflow-hidden group min-h-[550px] bg-brand-subtle">
                <img 
                    src="https://images.unsplash.com/photo-1570857502907-f8b108b47905?q=80&w=2070&auto=format&fit=crop"
                    alt="خلفية تخفيضات الصيف"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-brand-bg/90 via-brand-bg/70 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 w-full md:w-2/3 lg:w-1/2 text-right">
                    <p className="font-serif text-brand-primary tracking-widest text-lg uppercase animate-fade-in-up" style={{ animationDelay: '100ms'}}>{campaign.title}</p>
                    <h2 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold text-brand-dark my-4 leading-none text-shadow animate-fade-in-up" style={{ animationDelay: '200ms'}}>
                        {campaign.discountText}
                    </h2>

                    <div className="animate-fade-in-up" style={{ animationDelay: '300ms'}}>
                        <p className="font-semibold text-brand-text-light mb-2">استخدم الكود عند الدفع:</p>
                        <button onClick={handleCopyCode} className="bg-brand-subtle border-2 border-dashed border-brand-border rounded-lg px-4 py-2 flex items-center gap-3 group/copy transition-all duration-300 hover:border-brand-primary hover:bg-brand-primary/10">
                            <span className="font-mono text-xl font-bold text-brand-dark group-hover/copy:text-brand-primary">{campaign.couponCode}</span>
                            {isCopied ? <ClipboardCheckIcon size="sm" className="text-brand-instock" /> : <ClipboardIcon size="sm" className="text-brand-text-light group-hover/copy:text-brand-dark" />}
                        </button>
                    </div>
                    
                    <div className="my-8 animate-fade-in-up" style={{ animationDelay: '400ms'}}>
                        <CountdownTimer targetDate={saleEndDate} />
                    </div>

                    <button 
                        onClick={() => navigateTo(campaign.page)} 
                        className="bg-brand-primary text-brand-bg font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-100 flex items-center gap-3 text-lg animate-fade-in-up" style={{ animationDelay: '500ms'}}
                    >
                        <span>{campaign.buttonText}</span>
                        <i className="fa-solid fa-arrow-left text-sm"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};