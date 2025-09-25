import React from 'react';
import { StarOutlineIcon } from '../icons';

export const MarqueeBar = () => {
    const MarqueeContent = () => (
        <div className="flex items-center" aria-hidden="true">
            <span className="mx-8 text-base">تخفيضات الصيف</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
            <span className="mx-8 text-base">50% خصم على منتجات مختارة</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
            <span className="mx-8 text-base">شحن مجاني للطلبات فوق 500 ج.م</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
        </div>
    );

    return (
        <div className="relative flex overflow-x-hidden text-brand-dark font-bold py-4 border-b border-t bg-white">
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around">
                <MarqueeContent />
                <MarqueeContent />
                <MarqueeContent />
            </div>
        </div>
    );
};