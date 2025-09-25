import React from 'react';
import { Product } from '../../types';
import { CloseIcon, StarIcon, CheckCircleIcon, XCircleIcon, ShoppingBagIcon } from '../icons';

interface CompareModalProps {
    isOpen: boolean;
    onClose: () => void;
    compareList: Product[];
    removeFromCompare: (productId: number) => void;
    addToCart: (product: Product) => void;
    navigateTo: (pageName: string, data?: Product) => void;
}

export const CompareModal = ({ isOpen, onClose, compareList, removeFromCompare, addToCart, navigateTo }: CompareModalProps) => {
    if (!isOpen) return null;

    const renderStars = (rating = 5) => (
        <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );
    
    const handleAddToCart = (product: Product) => {
        addToCart(product);
        onClose();
    };

    const handleViewProduct = (product: Product) => {
        navigateTo('product', product);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col">
                <div className="p-5 flex justify-between items-center border-b flex-shrink-0">
                    <h2 className="font-bold text-lg text-brand-dark">مقارنة المنتجات ({compareList.length}/4)</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                {compareList.length < 2 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-xl font-bold text-brand-dark mb-2">أضف منتجًا آخر للمقارنة</p>
                        <p className="text-brand-text-light">تحتاج إلى منتجين على الأقل لرؤية المقارنة جنبًا إلى جنب.</p>
                    </div>
                ) : (
                    <div className="p-6 overflow-x-auto overflow-y-hidden">
                        <table className="w-full border-collapse text-sm text-right min-w-[600px]">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-4 font-bold w-1/5">المنتج</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center relative">
                                            <button onClick={() => removeFromCompare(p.id)} className="absolute top-1 right-1 bg-white/50 rounded-full p-1 shadow-sm hover:bg-white z-10"><CloseIcon size="sm"/></button>
                                            <img onClick={() => handleViewProduct(p)} src={p.image} alt={p.name} className="w-24 h-28 object-cover rounded-md mx-auto cursor-pointer" />
                                            <p onClick={() => handleViewProduct(p)} className="font-semibold mt-2 cursor-pointer hover:text-brand-primary">{p.name}</p>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 font-bold">السعر</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center">
                                            <span className="font-bold text-brand-dark">{p.price} ج.م</span>
                                            {p.oldPrice && <span className="line-through text-brand-text-light ml-2 text-xs">{p.oldPrice} ج.م</span>}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 font-bold">الوصف</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center text-xs text-brand-text-light leading-relaxed">{p.description?.substring(0, 80)}...</td>
                                    ))}
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 font-bold">التوفر</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center font-semibold">
                                            {p.availability === 'متوفر' ? 
                                                <span className="inline-flex items-center gap-1 text-green-600"><CheckCircleIcon size="sm"/> متوفر</span> : 
                                                <span className="inline-flex items-center gap-1 text-red-500"><XCircleIcon size="sm"/> غير متوفر</span>
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 font-bold">التقييم</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                {renderStars(p.rating)}
                                                <span className="text-xs text-brand-text-light">({p.reviewCount} تقييمًا)</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-4 font-bold"></td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center">
                                            <button onClick={() => handleAddToCart(p)} className="bg-brand-dark text-white font-bold py-2 px-4 rounded-full text-xs flex items-center justify-center gap-1.5 mx-auto hover:bg-opacity-80">
                                                <ShoppingBagIcon size="sm"/>
                                                أضف إلى السلة
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
