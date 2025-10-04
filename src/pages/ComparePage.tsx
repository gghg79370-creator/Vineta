import React, { useMemo } from 'react';
import { useAppState } from '../state/AppState';
import { allProducts } from '../data/products';
import { StarIcon, ShoppingBagIcon, TrashIcon } from '../components/icons';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Product } from '../types';

interface ComparePageProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const ComparePage = ({ navigateTo }: ComparePageProps) => {
    const { state, dispatch } = useAppState();

    const productsToCompare = useMemo(() => {
        return state.compareList.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => !!p);
    }, [state.compareList]);

    const renderStars = (rating = 5) => (
        <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );
    
    const handleRemove = (productId: number) => {
        dispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId });
    };

    const handleAddToCart = (productId: number) => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] }});
        }
    };

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'مقارنة' }
    ];

    return (
        <div className="bg-brand-subtle">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="مقارنة المنتجات" />
            <div className="container mx-auto px-4 py-12">
                {productsToCompare.length > 0 ? (
                    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-sm border">
                        <table className="w-full border-collapse text-sm text-right min-w-[800px]">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-4 font-bold text-lg w-1/6">المنتج</td>
                                    {productsToCompare.map(p => (
                                        <td key={p.id} className="p-2 text-center w-1/5 relative">
                                            <button onClick={() => handleRemove(p.id)} className="absolute top-2 right-2 p-1 bg-white/50 rounded-full hover:bg-white z-10"><TrashIcon size="sm" className="text-gray-500 hover:text-red-500"/></button>
                                            <img onClick={() => navigateTo('product', p)} src={p.image} alt={p.name} className="w-32 h-40 object-cover rounded-md mx-auto cursor-pointer" />
                                            <p onClick={() => navigateTo('product', p)} className="font-bold text-base mt-2 hover:text-brand-primary cursor-pointer">{p.name}</p>
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
                                        <td key={p.id} className="p-4 text-center font-semibold text-green-600">{p.availability || 'متوفر'}</td>
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
                                            <button onClick={() => handleAddToCart(p.id)} className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 mx-auto hover:bg-opacity-90">
                                                <ShoppingBagIcon size="sm"/>
                                                <span>أضف إلى السلة</span>
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                     <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-brand-dark mb-2">قائمة المقارنة فارغة.</h2>
                        <p className="text-brand-text-light mb-6 max-w-xs mx-auto">أضف بعض المنتجات للمقارنة جنبًا إلى جنب.</p>
                        <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95">
                            ابدأ التسوق
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparePage;
