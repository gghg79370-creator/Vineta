import React from 'react';
import { TruckIcon, GiftIcon, ReturnIcon, SupportIcon } from '../icons';

export const FeaturesBar = () => (
    <div className="bg-white py-12 border-y">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center md:divide-x-reverse md:divide-x md:divide-brand-border">
            <div className="flex flex-col items-center gap-3 px-4">
                <TruckIcon color="text-brand-dark" size="lg"/> 
                <h3 className="font-extrabold text-lg text-brand-dark">شحن مجاني</h3> 
                <p className="text-sm text-brand-text-light">على الطلبات فوق 500 ج.م</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
                <GiftIcon color="text-brand-dark" size="lg"/> 
                <h3 className="font-extrabold text-lg text-brand-dark">تغليف هدايا</h3> 
                <p className="text-sm text-brand-text-light">خدمة تغليف احترافية</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
                <ReturnIcon color="text-brand-dark" size="lg"/> 
                <h3 className="font-extrabold text-lg text-brand-dark">إرجاع مجاني</h3> 
                <p className="text-sm text-brand-text-light">خلال 60 يومًا</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
                <SupportIcon color="text-brand-dark" size="lg"/> 
                <h3 className="font-extrabold text-lg text-brand-dark">دعم عبر الإنترنت</h3> 
                <p className="text-sm text-brand-text-light">دعم 24/7</p>
            </div>
        </div>
    </div>
);