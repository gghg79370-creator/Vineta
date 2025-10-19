import React from 'react';
import { StarOutlineIcon } from '../icons';

export const MarqueeBar = () => {
    const MarqueeContent = () => (
        <div className="flex items-center flex-shrink-0" aria-hidden="true">
            <span className="mx-8 text-base">تخفيضات الصيف</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
            <span className="mx-8 text-base">50% خصم على منتجات مختارة</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
            <span className="mx-8 text-base">شحن مجاني للطلبات فوق 500 ج.م</span>
            <span className="mx-8 text-brand-primary"><StarOutlineIcon /></span>
        </div>
    );

    return (
        <div className="relative overflow-x-hidden text-brand-dark font-bold py-4 border-b border-t bg-surface">
            <div className="flex animate-marquee whitespace-nowrap">
                <MarqueeContent />
                <MarqueeContent />
            </div>
        </div>
    );
};