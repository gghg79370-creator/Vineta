import React from 'react';

const categories = [
    { name: 'فساتين', image: 'https://images.unsplash.com/photo-1595955333550-9e4a83eafb39?q=80&w=1974&auto=format&fit=crop', featured: true },
    { name: 'قمصان', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop' },
    { name: 'جينز', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1974&auto=format&fit=crop' },
    { name: 'أحذية', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1964&auto=format&fit=crop' },
];

const CategoryCard = ({ name, image, className }: { name: string, image: string, className?: string }) => (
    <div className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
        <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" alt={name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 right-0 p-6 text-white text-right">
            <h3 className="text-2xl font-bold [text-shadow:_1px_1px_3px_rgb(0_0_0_/_30%)]">{name}</h3>
            <p className="text-sm opacity-90 group-hover:underline transition-all">تسوق الآن</p>
        </div>
    </div>
);


export const CategoriesSection = () => {
    return (
        <section className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl font-extrabold text-brand-dark mb-4">تسوق حسب الفئة</h2>
            <p className="text-brand-text-light max-w-2xl mx-auto mb-10">اكتشف أحدث صيحات الموضة والأساسيات الخالدة في مجموعاتنا المختارة.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 h-[400px] md:h-[600px]">
                <CategoryCard name={categories[0].name} image={categories[0].image} className="md:col-span-2 row-span-2" />
                <CategoryCard name={categories[1].name} image={categories[1].image} className="col-span-1" />
                <CategoryCard name={categories[2].name} image={categories[2].image} className="col-span-1" />
                <CategoryCard name={categories[3].name} image={categories[3].image} className="col-span-2 md:col-span-1" />
            </div>
        </section>
    );
};