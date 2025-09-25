import React from 'react';

interface Category {
    name: string;
    image: string;
    page: string;
}

const categoriesData: Category[] = [
    {
        name: 'النساء',
        image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto.format&fit=crop',
        page: 'shop',
    },
    {
        name: 'الرجال',
        image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=2070&auto.format&fit=crop',
        page: 'shop',
    },
    {
        name: 'الأطفال',
        image: 'https://images.unsplash.com/photo-1605501221489-2757ae800342?q=80&w=1974&auto.format&fit=crop',
        page: 'shop',
    },
    {
        name: 'الإكسسوارات',
        image: 'https://images.unsplash.com/photo-1588403067822-4215b49a2b53?q=80&w=1974&auto.format&fit=crop',
        page: 'shop',
    }
];

interface CategoryCardProps {
    category: Category;
    navigateTo: (pageName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, navigateTo }) => (
    <div
        onClick={() => navigateTo(category.page)}
        className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 h-full w-full"
        aria-label={`تسوق ${category.name}`}
    >
        <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden="true"></div>
        <div className="absolute bottom-6 w-full flex justify-center">
             <div className="bg-white/80 backdrop-blur-md text-brand-dark font-bold py-3 px-8 rounded-full shadow-md group-hover:bg-brand-dark group-hover:text-white transition-all duration-300 group-hover:scale-105 transform">
                <span className="text-base whitespace-nowrap">{category.name}</span>
            </div>
        </div>
    </div>
);


interface FeaturedCategoriesProps {
    navigateTo: (pageName: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ navigateTo }) => {
    return (
        <section className="bg-brand-subtle py-20">
            <div className="container mx-auto">
                 <div className="text-center mb-10 px-4">
                    <h2 className="text-4xl font-extrabold text-brand-dark">الفئات المميزة</h2>
                    <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">اكتشف أحدث صيحات الموضة والأساسيات الخالدة في مجموعاتنا المختارة.</p>
                </div>
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-4 -mx-4 px-4">
                    {categoriesData.map((category, index) => (
                        <div key={index} className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-1/3 lg:w-1/4 h-[60vh] max-h-[450px] snap-center">
                            <CategoryCard category={category} navigateTo={navigateTo} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
