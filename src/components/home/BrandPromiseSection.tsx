import React from 'react';
import { CheckCircleIcon, CubeIcon, LockClosedIcon, RefreshIcon } from '../icons';

const promiseData = [
    {
        icon: <CubeIcon size="lg" className="text-brand-primary" />,
        title: 'مواد عالية الجودة',
        description: 'نحن نختار فقط أفضل المواد لضمان منتجات تدوم طويلاً.'
    },
    {
        icon: <RefreshIcon size="lg" className="text-brand-primary" />,
        title: 'إرجاع سهل خلال 30 يومًا',
        description: 'لست راضيًا تمامًا؟ لا مشكلة. استمتع بإرجاع بدون متاعب.'
    },
    {
        icon: <CheckCircleIcon size="lg" className="text-brand-primary" />,
        title: 'منتجات أصلية مضمونة',
        description: 'كل منتج أصلي 100% ومصدره مباشرة من العلامات التجارية.'
    },
    {
        icon: <LockClosedIcon size="lg" className="text-brand-primary" />,
        title: 'دفع آمن 100%',
        description: 'تسوق بثقة. بياناتك محمية دائمًا.'
    }
];

const PromiseCard: React.FC<typeof promiseData[0]> = ({ icon, title, description }) => (
    <div className="bg-surface p-6 rounded-xl text-center flex flex-col items-center border border-brand-border/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold text-lg text-brand-dark mb-2">{title}</h3>
        <p className="text-sm text-brand-text-light">{description}</p>
    </div>
);

export const BrandPromiseSection: React.FC = () => {
    return (
        <section className="bg-brand-subtle py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {promiseData.map((promise, index) => (
                        <PromiseCard key={index} {...promise} />
                    ))}
                </div>
            </div>
        </section>
    );
};