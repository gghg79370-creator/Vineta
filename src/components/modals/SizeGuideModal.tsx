import React from 'react';
import { Product } from '../../types';
import { CloseIcon } from '../icons';
import { sizeGuides } from '../../data/sizeGuides';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const getGuideForProduct = (product: Product) => {
    if (!product) return null;

    const category = product.category === 'men' ? 'men' : 'women';
    
    if (product.tags.includes('بنطلون') || product.name.includes('بنطلون')) {
        return sizeGuides[category].pants;
    }
    if (product.tags.includes('قميص') || product.tags.includes('تي شيرت') || product.tags.includes('بلوزة')) {
        // Use a generic 'tops' guide for shirts, t-shirts, and blouses
        return sizeGuides[category].tops;
    }
    // Add more rules for other product types like dresses, jackets, etc.
    return null; // Fallback
};

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
    if (!isOpen) return null;
    
    const guide = getGuideForProduct(product);

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-bg w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b border-brand-border">
                    <h2 className="font-bold text-lg text-brand-dark">دليل المقاسات</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <div className="p-6">
                    {guide ? (
                        <>
                            <h3 className="font-bold text-md mb-4">{guide.title}</h3>
                            <p className="text-sm text-brand-text-light mb-4">
                                القياسات بالسنتيمتر (سم). قارن قياسات جسمك مع الجدول للعثور على المقاس الأنسب.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-brand-subtle">
                                        <tr>
                                            {guide.headers.map(header => (
                                                <th key={header} className="p-3 font-bold border border-brand-border">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(guide.sizes).map(([size, measurements]) => (
                                            <tr key={size}>
                                                <td className="p-2 font-semibold border border-brand-border">{size}</td>
                                                {measurements.map((measurement, index) => (
                                                    <td key={index} className="p-2 border border-brand-border">{measurement}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-brand-text-light mt-4">
                                * هذه القياسات هي دليل عام وقد تختلف قليلاً حسب التصميم.
                            </p>
                        </>
                    ) : (
                        <p className="text-center text-brand-text-light py-8">
                            عذرًا، لا يتوفر دليل مقاسات محدد لهذا المنتج حاليًا.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
