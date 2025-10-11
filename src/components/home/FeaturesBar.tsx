import React from 'react';
import { ShippingTruckIcon, EditNoteIcon, GiftWrapIcon } from '../icons';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string }> = ({ icon, title }) => (
    <div className="text-center">
        <div className="flex justify-center mb-4 text-gray-500">
            {icon}
        </div>
        <h3 className="font-semibold text-lg text-brand-text">{title}</h3>
    </div>
);

export const FeaturesBar = () => {
    const features = [
        {
            icon: <ShippingTruckIcon size="xl" />,
            title: 'الشحن'
        },
        {
            icon: <EditNoteIcon size="xl" />,
            title: 'ملاحظة'
        },
        {
            icon: <GiftWrapIcon size="xl" />,
            title: 'تغليف هدية'
        }
    ];

    return (
        <div id="features" className="bg-brand-subtle py-12 border-y">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <FeatureCard 
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                    />
                ))}
            </div>
        </div>
    );
};