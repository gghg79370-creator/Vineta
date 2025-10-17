
import React, { useMemo, useState, useEffect } from 'react';
import { Product } from '../../types';
import { CloseIcon, StarIcon, CheckCircleIcon, XCircleIcon, ShoppingBagIcon, SparklesIcon, ArrowLongRightIcon } from '../icons';
import { useAppState } from '../../state/AppState';
import { allProducts } from '../../data/products';
import { GoogleGenAI } from "@google/genai";
import Spinner from '../ui/Spinner';

interface CompareModalProps {
    isOpen: boolean;
    onClose: () => void;
    navigateTo: (pageName: string, data?: Product) => void;
}

export const CompareModal = ({ isOpen, onClose, navigateTo }: CompareModalProps) => {
    const { state, dispatch } = useAppState();

    // AI summary states
    const [showSummary, setShowSummary] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState('');

    const compareList = useMemo(() => {
        return state.compareList.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => p !== undefined);
    }, [state.compareList]);

    useEffect(() => {
        if (!isOpen) {
            // Delay reset to allow closing animation
            setTimeout(() => {
                setShowSummary(false);
                setIsGeneratingSummary(false);
                setAiSummary('');
            }, 300);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const generateAiComparison = async () => {
        if (compareList.length < 2) return;
        setIsGeneratingSummary(true);
        setShowSummary(true);
        setAiSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const productsToCompare = compareList.map(p => `
المنتج: ${p.name}
الوصف: ${p.description}
السعر: ${p.price} ج.م
الخامة: ${p.materialComposition || 'غير محدد'}
`).join('\n');

            const prompt = `أنت Vinnie، مساعد أزياء خبير وودود لمتجر Vineta. يقوم العميل بمقارنة هذه المنتجات. قدم ملخص مقارنة مفيد بلغة طبيعية باللغة العربية. حلل أسلوبهما، وخاماتهما، وسعرهما، وأفضل حالات الاستخدام. اختتم بتوصية واضحة حول أيهما قد يكون أفضل لأنواع مختلفة من العملاء أو المناسبات. كن ودودًا وحواريًا. إليك المنتجات:
${productsToCompare}
ابدأ بـ "أهلاً! أنا Vinnie، دعنا نلقي نظرة فاحصة على هذين الخيارين الرائعين..."`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiSummary(response.text);

        } catch (error) {
            console.error("Error generating AI comparison:", error);
            setAiSummary("عذرًا، حدث خطأ أثناء مقارنة المنتجات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const removeFromCompare = (productId: number) => {
        dispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId });
    };

    const clearCompare = () => {
        compareList.forEach(p => dispatch({ type: 'REMOVE_FROM_COMPARE', payload: p.id }));
    }

    const addToCart = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
    };

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
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b flex-shrink-0">
                    <h2 className="font-bold text-lg text-brand-dark">مقارنة المنتجات ({compareList.length}/4)</h2>
                     <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {compareList.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {compareList.map(p => (
                             <div key={p.id} className="border rounded-lg p-3 text-center relative group">
                                <button onClick={() => removeFromCompare(p.id)} className="absolute top-2 right-2 bg-white/50 rounded-full p-1 shadow-sm hover:bg-white z-10"><CloseIcon size="sm"/></button>
                                <img onClick={() => handleViewProduct(p)} src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-md mx-auto cursor-pointer" />
                                <p onClick={() => handleViewProduct(p)} className="font-semibold mt-2 text-sm h-10 line-clamp-2 cursor-pointer hover:text-brand-primary">{p.name}</p>
                                <div className="my-2">
                                    <span className="font-bold text-brand-dark">{p.price} ج.م</span>
                                    {p.oldPrice && <span className="line-through text-brand-text-light ml-2 text-xs">{p.oldPrice} ج.م</span>}
                                </div>
                                <div className="flex justify-center my-2 h-4">{renderStars(p.rating)}</div>
                                <button onClick={() => handleAddToCart(p)} className="w-full bg-brand-dark text-white font-bold py-2 rounded-full text-xs mt-2">
                                    أضف إلى السلة
                                </button>
                             </div>
                        ))}
                    </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                            <p className="text-xl font-bold text-brand-dark mb-2">أضف منتجات للمقارنة</p>
                            <p className="text-brand-text-light">قائمة المقارنة الخاصة بك فارغة حاليًا.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t flex-shrink-0 flex justify-center gap-4">
                     <button onClick={onClose} className="bg-white border border-brand-border text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-gray-100">
                        مقارنة
                    </button>
                    <button onClick={clearCompare} className="bg-white border border-brand-border text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-gray-100">
                        مسح الكل
                    </button>
                </div>
            </div>
        </div>
    );
};
