import React from 'react';
import { ShippingTruckIcon, EditNoteIcon, GiftWrapIcon } from '../icons';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="text-center">
        <div className="flex justify-center mb-4 text-brand-primary">
            {icon}
        </div>
        <h3 className="font-semibold text-lg text-brand-dark">{title}</h3>
        <p className="text-sm text-brand-text-light mt-1">{description}</p>
    </div>
);

export const FeaturesBar = () => {
    const features = [
        {
            icon: <ShippingTruckIcon size="xl" />,
            title: 'شحن سريع ومجاني',
            description: 'استمتع بشحن مجاني للطلبات التي تزيد عن 500 ج.م.'
        },
        {
            icon: <EditNoteIcon size="xl" />,
            title: 'ملاحظات شخصية',
            description: 'أضف ملاحظة خاصة لطلبك عند الدفع.'
        },
        {
            icon: <GiftWrapIcon size="xl" />,
            title: 'تغليف هدايا أنيق',
            description: 'اجعل هديتك مميزة مع خيار تغليف الهدايا الفاخر.'
        }
    ];

    return (
        <div id="features" className="bg-brand-subtle py-16 border-y">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <FeatureCard 
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </div>
    );
};