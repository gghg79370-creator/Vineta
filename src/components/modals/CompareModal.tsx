
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
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b flex-shrink-0">
                    <h2 className="font-bold text-lg text-brand-dark">مقارنة المنتجات ({compareList.length}/4)</h2>
                    <div className="flex items-center gap-2">
                        {compareList.length >= 2 && !showSummary && (
                            <button onClick={generateAiComparison} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm py-2 px-4 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
                                <SparklesIcon size="sm" />
                                مقارنة بالذكاء الاصطناعي
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                    </div>
                </div>

                {showSummary ? (
                    <div className="flex-1 overflow-y-auto p-8 bg-indigo-50/30">
                        {isGeneratingSummary ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Spinner size="lg" color="text-brand-dark" />
                                <p className="mt-4 font-semibold text-brand-dark">يقوم Vinnie بمقارنة منتجاتك...</p>
                                <p className="text-sm text-brand-text-light">قد يستغرق هذا بضع لحظات.</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0">
                                        <SparklesIcon size="md" className="text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-brand-dark">تحليل Vinnie</h3>
                                        <p className="text-brand-text-light">مقارنة مخصصة لك فقط.</p>
                                    </div>
                                </div>
                                <div className="prose max-w-none text-brand-dark leading-relaxed whitespace-pre-wrap text-right">
                                    {aiSummary}
                                </div>
                                <div className="mt-8 text-center">
                                     <button onClick={() => setShowSummary(false)} className="bg-white border border-brand-border text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-brand-subtle flex items-center gap-2 mx-auto">
                                        <ArrowLongRightIcon size="sm" className="transform rotate-180" />
                                        العودة إلى الجدول
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : compareList.length < 2 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                         {compareList.length === 1 && (
                            <div className="mb-4">
                                <img src={compareList[0].image} alt={compareList[0].name} className="w-24 h-28 object-cover rounded-md mx-auto" />
                                <p className="font-semibold mt-2">{compareList[0].name}</p>
                            </div>
                        )}
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
                                <tr className="border-b bg-gray-50">
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
                                <tr className="border-b bg-gray-50">
                                    <td className="py-4 font-bold">الخامة</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center text-xs text-brand-text-light leading-relaxed">{p.materialComposition || '-'}</td>
                                    ))}
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 font-bold">تعليمات العناية</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center text-xs text-brand-text-light leading-relaxed">{p.careInstructions?.join(', ') || '-'}</td>
                                    ))}
                                </tr>
                                <tr className="border-b bg-gray-50">
                                    <td className="py-4 font-bold">التوفر</td>
                                    {compareList.map(p => (
                                        <td key={p.id} className="p-2 text-center font-semibold">
                                            {p.availability === 'متوفر' || (p.itemsLeft && p.itemsLeft > 0) ? 
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
                                <tr className="bg-gray-50">
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
