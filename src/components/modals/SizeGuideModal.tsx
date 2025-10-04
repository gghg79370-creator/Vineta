
import React, { useState } from 'react';
import { Product } from '../../types';
import { CloseIcon, MagicIcon } from '../icons';
import { GoogleGenAI, Type } from "@google/genai";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
    const [view, setView] = useState<'ai' | 'chart'>('ai');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fitPreference, setFitPreference] = useState('عادي');
    const [recommendation, setRecommendation] = useState<{ size: string; reason: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetRecommendation = async () => {
        if (!height || !weight) {
            setError('الرجاء إدخال الطول والوزن.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRecommendation(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `أنت خبير في مقاسات الأزياء والملاءمة لمتجر إلكتروني. بناءً على قياسات المستخدم وتفاصيل المنتج، قم بالتوصية بمقاس.
المنتج: ${product.name} (الفئة: ${product.category}, العلامة التجارية: ${product.brand})
طول المستخدم: ${height} سم
وزن المستخدم: ${weight} كجم
تفضيل الملاءمة: ${fitPreference}
المقاسات المتاحة: ${product.sizes.join(', ')}

قم بالرد بتنسيق JSON يحتوي على حقلين: "recommendedSize" (المقاس الموصى به من قائمة المقاسات المتاحة) و "reason" (شرح موجز من جملة واحدة لسبب هذه التوصية باللغة العربية). إذا لم يكن هناك مقاس مناسب، فقم بإرجاع "غير متوفر" في "recommendedSize".`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendedSize: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ['recommendedSize', 'reason']
                    }
                }
            });
            
            const result = JSON.parse(response.text);
            setRecommendation({ size: result.recommendedSize, reason: result.reason });

        } catch (err) {
            console.error("Error getting size recommendation:", err);
            setError('عذراً، لم نتمكن من الحصول على توصية. الرجاء المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state on close after a delay for the animation
        setTimeout(() => {
            setHeight('');
            setWeight('');
            setFitPreference('عادي');
            setRecommendation(null);
            setError('');
            setView('ai');
        }, 300);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg text-brand-dark flex items-center gap-2"><MagicIcon /> مساعد المقاسات</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>

                <div className="flex border-b">
                    <button onClick={() => setView('ai')} className={`flex-1 py-3 font-semibold text-sm transition-colors duration-200 ${view === 'ai' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-brand-text-light hover:bg-gray-50'}`}>
                        المساعد الذكي
                    </button>
                    <button onClick={() => setView('chart')} className={`flex-1 py-3 font-semibold text-sm transition-colors duration-200 ${view === 'chart' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-brand-text-light hover:bg-gray-50'}`}>
                        جدول المقاسات
                    </button>
                </div>
                
                <div className="p-6">
                    {view === 'ai' ? (
                        <div className="animate-fade-in">
                            {!recommendation ? (
                                <div className="space-y-4">
                                    <p className="text-brand-text-light text-sm">أخبرنا بمقاساتك للحصول على توصية بالمقاس المناسب لك.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="height" className="block text-sm font-bold text-brand-text mb-1">الطول (سم)</label>
                                            <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} className="w-full border border-brand-border rounded-lg p-2" placeholder="175" />
                                        </div>
                                        <div>
                                            <label htmlFor="weight" className="block text-sm font-bold text-brand-text mb-1">الوزن (كجم)</label>
                                            <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border border-brand-border rounded-lg p-2" placeholder="70" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-brand-text mb-2">تفضيل المقاس</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['ضيق', 'عادي', 'فضفاض'].map(fit => (
                                                <button key={fit} onClick={() => setFitPreference(fit)} className={`p-2 rounded-lg border text-sm font-semibold transition-colors ${fitPreference === fit ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-brand-border hover:border-brand-dark'}`}>
                                                    {fit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                    <button onClick={handleGetRecommendation} disabled={isLoading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center">
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            'الحصول على توصية'
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center animate-fade-in">
                                    <h3 className="font-bold text-lg mb-2">مقاسك الموصى به هو:</h3>
                                    <p className="text-5xl font-extrabold text-brand-primary my-4 bg-brand-subtle py-4 rounded-lg">{recommendation.size}</p>
                                    <p className="text-sm text-brand-dark bg-blue-50 border border-blue-200 rounded-lg p-3">{recommendation.reason}</p>
                                    <p className="text-xs text-brand-text-light mt-4">* هذه مجرد توصية. قد تختلف المقاسات حسب التصميم.</p>
                                    <button onClick={() => setRecommendation(null)} className="mt-6 text-sm font-semibold text-brand-primary hover:underline">
                                        إعادة الحساب
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h3 className="font-bold text-lg mb-4">جدول المقاسات - نساء</h3>
                            <p className="text-sm text-brand-text-light mb-4">القياسات بالسنتيمتر (سم). قارن قياسات جسمك مع الجدول للعثور على المقاس الأنسب.</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-brand-subtle">
                                        <tr>
                                            <th className="p-2 font-bold border border-brand-border">المقاس</th>
                                            <th className="p-2 font-bold border border-brand-border">الصدر</th>
                                            <th className="p-2 font-bold border border-brand-border">الخصر</th>
                                            <th className="p-2 font-bold border border-brand-border">الأرداف</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-2 font-semibold border border-brand-border">S</td>
                                            <td className="p-2 border border-brand-border">82-86</td>
                                            <td className="p-2 border border-brand-border">62-66</td>
                                            <td className="p-2 border border-brand-border">88-92</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold border border-brand-border">M</td>
                                            <td className="p-2 border border-brand-border">86-90</td>
                                            <td className="p-2 border border-brand-border">66-70</td>
                                            <td className="p-2 border border-brand-border">92-96</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold border border-brand-border">L</td>
                                            <td className="p-2 border border-brand-border">90-94</td>
                                            <td className="p-2 border border-brand-border">70-74</td>
                                            <td className="p-2 border border-brand-border">96-100</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold border border-brand-border">XL</td>
                                            <td className="p-2 border border-brand-border">94-98</td>
                                            <td className="p-2 border border-brand-border">74-78</td>
                                            <td className="p-2 border border-brand-border">100-104</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-brand-text-light mt-4">
                                * هذه القياسات هي دليل عام وقد تختلف قليلاً حسب التصميم.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
