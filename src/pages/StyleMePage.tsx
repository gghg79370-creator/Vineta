

import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SparklesIcon, ArrowUpTrayIcon, XCircleIcon, ShoppingBagIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { GoogleGenAI, Type } from "@google/genai";
import { allProducts } from '../data/products';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';

interface StyleMePageProps {
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product) => void;
}

interface AiResult {
    lookTitle: string;
    lookDescription: string;
    products: Product[];
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const StyleMePage: React.FC<StyleMePageProps> = ({ navigateTo, addToCart }) => {
    const [promptText, setPromptText] = useState('');
    const [inspirationImage, setInspirationImage] = useState<{ file: File; preview: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AiResult | null>(null);
    const addToast = useToast();

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'المصمم الذكي' }
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInspirationImage({ file, preview: URL.createObjectURL(file) });
        }
    };
    
    const handleGenerateLook = async () => {
        if (!promptText.trim() && !inspirationImage) {
            setError('الرجاء وصف الإطلالة التي تريدها أو تحميل صورة ملهمة.');
            return;
        }
        if (!navigator.onLine) {
            setError('أنت غير متصل بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const productList = allProducts.map(p => `- ${p.name} (ID: ${p.id}, الفئة: ${p.category}, السعر: ${p.price} ج.م, الوسوم: [${p.tags.join(', ')}])`).join('\n');
            const systemInstruction = `أنت Vinnie، خبير أزياء ومصمم شخصي في متجر Vineta للأزياء. مهمتك هي إنشاء "إطلالات" كاملة للعملاء بناءً على طلباتهم. كل إطلالة يجب أن تحتوي على عنوان إبداعي، ووصف قصير للأناقة، وقائمة من 3 إلى 4 منتجات من قائمة المنتجات المتاحة. كن مبدعًا، وودودًا، ومفيدًا. قم بالرد فقط بتنسيق JSON.`;

            const contents: any = { parts: [] };
            
            let userPrompt = `أنشئ لي إطلالة. ${promptText}.`;
            if(inspirationImage) {
                userPrompt += ` استلهم من الصورة التي قدمتها.`;
                const base64Data = await blobToBase64(inspirationImage.file);
                contents.parts.push({ inlineData: { mimeType: inspirationImage.file.type, data: base64Data } });
            }
            userPrompt += `\n\nقائمة المنتجات المتاحة للاختيار من بينها:\n${productList}`;
            contents.parts.push({ text: userPrompt });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            lookTitle: { type: Type.STRING, description: 'عنوان إبداعي وجذاب للإطلالة باللغة العربية.' },
                            lookDescription: { type: Type.STRING, description: 'وصف قصير وأنيق للإطلالة المقترحة باللغة العربية.' },
                            productNames: {
                                type: Type.ARRAY,
                                description: 'مصفوفة من 3 إلى 4 أسماء منتجات دقيقة من قائمة المنتجات المتاحة.',
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['lookTitle', 'lookDescription', 'productNames']
                    }
                }
            });
            
            const aiResult = JSON.parse(response.text);
            const foundProducts = aiResult.productNames
                .map((name: string) => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
                .filter((p: Product | undefined): p is Product => p !== undefined);

            setResult({
                lookTitle: aiResult.lookTitle,
                lookDescription: aiResult.lookDescription,
                products: foundProducts
            });

        } catch (err) {
            console.error("Error generating look:", err);
            setError('عذرًا، حدث خطأ أثناء إنشاء إطلالتك. قد يكون السبب مشكلة في الشبكة أو واجهة برمجة التطبيقات. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddToCart = (p: Product) => {
        if (p.variants && p.variants.length > 0) {
            navigateTo('product', p);
        } else {
            addToCart(p);
            addToast(`${p.name} أضيف إلى السلة!`, 'success');
        }
    };

    return (
        <div className="bg-gray-50">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="المصمم الذكي" />
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Input Section */}
                    <div className="lg:col-span-4 lg:sticky top-28">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">صف رؤيتك للأناقة</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-bold text-brand-text mb-2">ما هي المناسبة أو الإطلالة التي تفكر بها؟</label>
                                    <textarea
                                        id="prompt"
                                        rows={4}
                                        value={promptText}
                                        onChange={(e) => setPromptText(e.target.value)}
                                        placeholder="مثال: 'إطلالة كاجوال لعطلة نهاية الأسبوع على الشاطئ' أو 'شيء أنيق لاجتماع عمل'..."
                                        className="w-full border p-3 rounded-lg border-brand-border focus:ring-brand-dark"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-text mb-2">أو، احصل على إلهام من صورة</label>
                                    {inspirationImage ? (
                                        <div className="relative">
                                            <img src={inspirationImage.preview} alt="Inspiration preview" className="w-full h-40 object-cover rounded-lg" />
                                            <button onClick={() => setInspirationImage(null)} className="absolute -top-2 -right-2 bg-white rounded-full text-gray-600 hover:text-red-500 shadow-md">
                                                <XCircleIcon />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="image-upload" className="cursor-pointer border-2 border-dashed border-brand-border rounded-lg p-6 text-center block hover:bg-brand-subtle">
                                            <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-gray-400" />
                                            <p className="mt-2 font-semibold text-brand-primary">انقر للتحميل</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF</p>
                                        </label>
                                    )}
                                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>
                                <button
                                    onClick={handleGenerateLook}
                                    disabled={isLoading}
                                    className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-full hover:bg-opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                                >
                                    <SparklesIcon />
                                    <span>{isLoading ? 'جارٍ الإنشاء...' : 'أنشئ إطلالتي'}</span>
                                </button>
                                 {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="lg:col-span-8">
                        {isLoading ? (
                            <div className="text-center p-8 bg-white rounded-xl shadow-sm border animate-fade-in">
                                <Spinner size="lg" color="text-brand-dark"/>
                                <h3 className="text-xl font-bold mt-4 text-brand-dark">يقوم Vinnie بتنسيق إطلالتك...</h3>
                                <p className="text-brand-text-light mt-2">قد يستغرق هذا بضع لحظات.</p>
                            </div>
                        ) : result ? (
                            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 animate-fade-in-up">
                                <h2 className="text-3xl font-bold text-brand-dark mb-2 text-center">{result.lookTitle}</h2>
                                <p className="text-brand-text-light text-center mb-8 max-w-xl mx-auto">{result.lookDescription}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {result.products.map(p => (
                                        <div key={p.id} className="bg-white rounded-lg border overflow-hidden group flex flex-col">
                                            <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover cursor-pointer group-hover:scale-105 transition-transform" onClick={() => navigateTo('product', p)}/>
                                            <div className="p-3 text-center flex flex-col flex-grow">
                                                <p className="font-semibold text-sm flex-grow">{p.name}</p>
                                                <p className="font-bold text-brand-primary my-2">{p.price} ج.م</p>
                                                <button onClick={() => handleAddToCart(p)} className="w-full bg-brand-dark text-white font-bold py-2 rounded-full text-xs flex items-center justify-center gap-1.5 hover:bg-opacity-90">
                                                    <ShoppingBagIcon size="sm"/>
                                                    أضف للسلة
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white rounded-xl shadow-sm border min-h-[400px] flex flex-col justify-center items-center">
                                <SparklesIcon size="lg" className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-2xl font-bold text-brand-dark">إطلالتك المخصصة في انتظارك</h3>
                                <p className="text-brand-text-light mt-2 max-w-sm mx-auto">استخدم اللوحة على اليسار لوصف ما تبحث عنه، ودع مساعدنا الذكي يقوم بالباقي!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StyleMePage;