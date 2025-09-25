import React from 'react';

interface PromoSectionProps {
    image: string;
    categoryName: string;
    page: string;
    navigateTo: (pageName: string) => void;
}

export const PromoSection: React.FC<PromoSectionProps> = ({ image, categoryName, page, navigateTo }) => {
    return (
        <section className="container mx-auto px-4 py-10">
            <div className="relative rounded-2xl overflow-hidden group shadow-lg aspect-video md:aspect-[2.5/1]">
                <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" alt={categoryName} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="absolute bottom-8 right-8">
                     <button 
                        onClick={() => navigateTo(page)}
                        className="bg-white text-brand-dark font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-105"
                    >
                        {categoryName}
                    </button>
                </div>
            </div>
        </section>
    );
};
