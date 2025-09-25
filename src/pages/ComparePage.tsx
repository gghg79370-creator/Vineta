import React from 'react';
import { allProducts } from '../data/products';
import { StarIcon } from '../components/icons';
import { Breadcrumb } from '../components/ui/Breadcrumb';

interface ComparePageProps {
    navigateTo: (pageName: string) => void;
}

const ComparePage = ({ navigateTo }: ComparePageProps) => {
    const productsToCompare = allProducts.slice(0, 4);

    const renderStars = (rating = 5) => (
        <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'مقارنة' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="مقارنة المنتجات" />
            <div className="container mx-auto px-4 py-12">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm text-right min-w-[800px]">
                        <tbody>
                            <tr className="border-b">
                                <td className="py-4 font-bold text-lg w-1/6">المنتج</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-2 text-center w-1/5">
                                        <img src={p.image} alt={p.name} className="w-32 h-40 object-cover rounded-md mx-auto" />
                                        <p className="font-bold text-base mt-2">{p.name}</p>
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b bg-brand-subtle/50">
                                <td className="p-4 font-bold">السعر</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center font-bold text-brand-dark text-base">{p.price} ج.م</td>
                                ))}
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-bold">الوصف</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center text-xs text-brand-text-light leading-relaxed">{p.description}</td>
                                ))}
                            </tr>
                             <tr className="border-b bg-brand-subtle/50">
                                <td className="p-4 font-bold">التوفر</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center font-semibold text-green-600">متوفر</td>
                                ))}
                            </tr>
                             <tr className="border-b">
                                <td className="p-4 font-bold">التقييم</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center">{renderStars(p.rating)}</td>
                                ))}
                            </tr>
                            <tr className="border-b bg-brand-subtle/50">
                                <td className="p-4 font-bold">المقاسات</td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center">{p.sizes.join(', ')}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-bold"></td>
                                {productsToCompare.map(p => (
                                    <td key={p.id} className="p-4 text-center">
                                        <button className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full">أضف إلى السلة</button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparePage;