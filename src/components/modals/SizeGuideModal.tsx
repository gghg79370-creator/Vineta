import React, { useState } from 'react';
import { Product } from '../../types';
import { CloseIcon, MagicIcon } from '../icons';
import { GoogleGenAI } from "@google/genai";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fitPreference, setFitPreference] = useState('عادي');
    const [recommendation, setRecommendation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetRecommendation = async () => {
        if (!height || !weight) {
            setError('الرجاء إدخال الطول والوزن.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRecommendation('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a fashion size and fit expert for an e-commerce store. Based on the user's measurements and the product details, recommend a size.
Product: ${product.name} (Category: ${product.category}, Brand: ${product.brand})
User Height: ${height} cm
User Weight: ${weight} kg
Fit Preference: ${fitPreference}
Available Sizes: ${product.sizes.join(', ')}

Respond with only the recommended size from the available sizes list (e.g., "M", "L", "XL"). If no size seems appropriate, respond with "لا يمكننا إيجاد مقاس مناسب."`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setRecommendation(response.text);

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
            setRecommendation('');
            setError('');
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
                <div className="p-6">
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
                            <p className="text-5xl font-extrabold text-brand-primary my-4 bg-brand-subtle py-4 rounded-lg">{recommendation}</p>
                            <p className="text-xs text-brand-text-light mt-4">* هذه مجرد توصية. قد تختلف المقاسات حسب التصميم.</p>
                             <button onClick={() => setRecommendation('')} className="mt-6 text-sm font-semibold text-brand-primary hover:underline">
                                إعادة الحساب
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
