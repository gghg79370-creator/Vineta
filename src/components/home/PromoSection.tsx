import React from 'react';

interface PromoSectionProps {
    navigateTo: (pageName: string) => void;
}

const promoCardsData = [
    { title: 'أناقة', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop' },
    { title: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2070&auto=format&fit=crop' },
    { title: 'ملابس رياضية', image: 'https://images.unsplash.com/photo-1587635293423-e7d32e92c103?q=80&w=1974&auto=format&fit=crop' },
];

export const PromoSection: React.FC<PromoSectionProps> = ({ navigateTo }) => {
    return (
        <section className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {promoCardsData.map((card, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden group cursor-pointer aspect-square" onClick={() => navigateTo('shop')}>
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="bg-white/20 backdrop-blur-sm py-3 px-6 rounded-lg">
                               <h3 className="text-white text-2xl font-bold">{card.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};