import React from 'react';
import { TruckIcon, GiftIcon, ReturnIcon, SupportIcon } from '../icons';

// FIX: Correctly type FeatureCard as a React Functional Component to allow for the `key` prop.
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="group bg-brand-subtle p-6 rounded-2xl text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-white hover:-translate-y-2">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="font-extrabold text-lg text-brand-dark mb-2">{title}</h3> 
        <p className="text-sm text-brand-text-light leading-relaxed">{description}</p>
    </div>
);

export const FeaturesBar = () => {
    const features = [
        {
            icon: <TruckIcon className="text-brand-primary" size="lg"/>,
            title: 'شحن مجاني',
            description: 'استمتع بشحن مجاني على جميع الطلبات'
        },
        {
            icon: <GiftIcon className="text-brand-primary" size="lg"/>,
            title: 'تغليف هدايا',
            description: 'تغليف مثالي للهدايا لجميع المناسبات'
        },
        {
            icon: <ReturnIcon className="text-brand-primary" size="lg"/>,
            title: 'إرجاع مجاني',
            description: 'لديك 14 يومًا لإرجاع مشترياتك بسهولة'
        },
        {
            icon: <SupportIcon className="text-brand-primary" size="lg"/>,
            title: 'دعم أونلاين',
            description: 'نحن هنا لمساعدتك على مدار الساعة'
        }
    ];

    return (
        <div id="features" className="bg-white py-16">
            <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
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