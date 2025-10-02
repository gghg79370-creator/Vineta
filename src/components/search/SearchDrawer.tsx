import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from '../../types';
import { CloseIcon, SearchIcon, SparklesIcon, TagIcon, CategoryIcon, FireIcon, HistoryIcon, CameraIcon, ChatBubbleOvalLeftEllipsisIcon } from '../icons';
import { allProducts } from '../../data/products';
import { GoogleGenAI, Type } from "@google/genai";
import Spinner from '../ui/Spinner';

interface SearchDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
    setIsChatbotOpen: (isOpen: boolean) => void;
}

const ProductSkeleton = () => (
    <div className="animate-skeleton-pulse">
        <div className="bg-gray-200 rounded-lg aspect-[4/5]"></div>
        <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mt-1 w-1/2"></div>
    </div>
);

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


export const SearchDrawer = ({ isOpen, setIsOpen, navigateTo, setIsChatbotOpen }: SearchDrawerProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [allResultsCount, setAllResultsCount] = useState(0);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
    const [isAiSearching, setIsAiSearching] = useState(false);
    
    const [visualSearchImage, setVisualSearchImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const popularCategories = useMemo(() => {
        const mainCategories = ['ملابس', 'إكسسوارات', 'أحذية', 'حقائب', 'ملابس رياضية', 'صيف', 'شتاء', 'كاجوال'];
        const allTags = new Set(allProducts.flatMap(p => p.tags));
        return mainCategories.filter(cat => allTags.has(cat)).slice(0, 6);
    }, []);

    const trendingTags = ['صيف', 'كاجوال', 'رائج', 'قطن', 'جديد', 'واسع الساق'];
    const popularProducts = allProducts.sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0, 3);

    useEffect(() => {
        if (isOpen) {
            try {
                const history = localStorage.getItem('vinetaSearchHistory');
                if (history) setSearchHistory(JSON.parse(history));
            } catch (e) {
                console.error('Failed to parse search history', e);
                setSearchHistory([]);
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setTimeout(() => {
                setSearchTerm(''); setVisualSearchImage(null); setIsAnalyzing(false);
            }, 300);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const addToHistory = (query: string) => {
        const newHistory = [query, ...searchHistory.filter(item => item !== query && item.trim() !== '')].slice(0, 5);
        setSearchHistory(newHistory);
        try {
            localStorage.setItem('vinetaSearchHistory', JSON.stringify(newHistory));
        } catch (e) { console.error('Failed to save search history', e); }
    };

    const clearHistory = () => {
        setSearchHistory([]);
        try { localStorage.removeItem('vinetaSearchHistory'); } catch (e) { console.error('Failed to clear search history', e); }
    };
    
    const getAiSearchResults = async (term: string) => {
        setIsAiSearching(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const searchableData = [...new Set(allProducts.flatMap(p => [p.name, ...p.tags, p.category, p.brand].filter(Boolean)))].join(', ');
            const availableProducts = allProducts.map(p => p.name).join(', ');

            const prompt = `أنت مساعد بحث خبير لمتجر أزياء Vineta. يقوم مستخدم بالبحث عن "${term}".

1. قدم ما يصل إلى 4 اقتراحات بحث قصيرة وذات صلة بناءً على البيانات القابلة للبحث.
2. أوصِ بـ 3 منتجات ذات صلة عالية من قائمة المنتجات المتاحة.
3. قدم نصيحة موجزة وأنيقة أو ملخصًا للاتجاه في جملة إلى جملتين باللغة العربية.

البيانات القابلة للبحث: ${searchableData}
المنتجات المتاحة: ${availableProducts}

قم بالرد فقط بكائن JSON بالصيغة التالية:
{
  "suggestions": ["suggestion1", "suggestion2"],
  "recommendations": ["productName1", "productName2"],
  "summary": "نصيحة موجزة هنا..."
}`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                            summary: { type: Type.STRING }
                        },
                        required: ['suggestions', 'recommendations', 'summary']
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);

            setSuggestions(jsonResponse.suggestions || []);
            setAiSummary(jsonResponse.summary || '');
            
            const recommendedNames: string[] = jsonResponse.recommendations || [];
            const foundProducts = recommendedNames.map(name => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase())).filter((p): p is Product => p !== undefined);
            setAiRecommendations(foundProducts);
        } catch (error) {
            console.error("Error fetching AI search results:", error);
        } finally {
            setIsAiSearching(false);
        }
    };

    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length < 2) {
            setResults([]);
            setAllResultsCount(0);
            setSuggestions([]);
            setAiRecommendations([]);
            setAiSummary('');
            return;
        }
        setIsSearching(true);

        const searchHandler = setTimeout(() => {
            const lowerCaseTerm = term.toLowerCase();
            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(lowerCaseTerm) || p.tags.some(t => t.toLowerCase().includes(lowerCaseTerm)) || p.brand?.toLowerCase().includes(lowerCaseTerm));
            setAllResultsCount(filtered.length);
            setResults(filtered.slice(0, 3));
            setIsSearching(false);
        }, 300);
        
        const aiSearchHandler = setTimeout(() => {
             if(term.length >= 3) {
                getAiSearchResults(term);
            }
        }, 1000);


        return () => {
            clearTimeout(searchHandler);
            clearTimeout(aiSearchHandler);
        };
    }, [searchTerm]);

    const handleVisualSearchClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setSearchTerm(''); setResults([]); setSuggestions([]);
        const imageUrl = URL.createObjectURL(file);
        setVisualSearchImage(imageUrl);
        setIsAnalyzing(true);
        try {
            const base64Data = await blobToBase64(file);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = { inlineData: { mimeType: file.type, data: base64Data } };
            const textPart = { text: "صف عناصر الموضة في هذه الصورة بعبارة قصيرة وقابلة للبحث باللغة العربية. مثال: 'فستان صيفي أبيض'." };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [imagePart, textPart] } });
            setSearchTerm(response.text);
        } catch (error) { console.error("Error analyzing image:", error); } 
        finally { setIsAnalyzing(false); }
    };

    const performSearch = (query: string) => {
        if (query.trim()) {
            addToHistory(query.trim());
            navigateTo('search', { q: query.trim() });
            setIsOpen(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchTerm);
    };
    
    const handleChatClick = () => {
        setIsOpen(false);
        setIsChatbotOpen(true);
    };

    return (
        <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div className={`hidden md:block fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`hidden md:block fixed top-0 right-0 left-0 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <form onSubmit={handleFormSubmit} className="relative mb-8">
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light pointer-events-none"><SearchIcon size="md"/></div>
                        <input type="search" placeholder="بحث في Vineta..." className="w-full bg-brand-subtle border-2 border-transparent rounded-lg py-4 pr-14 pl-24 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark focus:bg-white" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setVisualSearchImage(null);}} autoFocus />
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-2">
                            <button type="button" onClick={handleVisualSearchClick} className="text-brand-text-light p-1.5 rounded-full hover:bg-gray-200" aria-label="البحث بالصورة"><CameraIcon /></button>
                            <button type="button" onClick={() => setIsOpen(false)} className="font-semibold text-sm text-gray-500 hover:text-brand-dark">إلغاء</button>
                        </div>
                    </form>

                    <div className="grid grid-cols-3 gap-8 min-h-[350px]">
                        <div className="col-span-1 border-l pl-8">
                            {searchTerm.length < 2 && !visualSearchImage ? (
                                <div className="space-y-6 animate-fade-in">
                                    {searchHistory.length > 0 && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-brand-dark flex items-center gap-2"><HistoryIcon size="sm"/> عمليات البحث الأخيرة</h3><button onClick={clearHistory} className="text-xs font-semibold text-brand-text-light hover:text-brand-dark">مسح</button></div>
                                            <div className="flex flex-col items-start gap-1">{searchHistory.map(term => (<button key={term} onClick={() => performSearch(term)} className="px-3 py-1.5 text-sm font-semibold hover:text-brand-primary rounded-md">{term}</button>))}</div>
                                        </div>
                                    )}
                                    <div><h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><CategoryIcon size="sm"/> اكتشف</h3><div className="flex flex-wrap gap-2">{popularCategories.map(cat => (<button key={cat} onClick={() => performSearch(cat)} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold hover:bg-gray-200">{cat}</button>))}</div></div>
                                    <div><h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><TagIcon size="sm"/> الوسوم الرائجة</h3><div className="flex flex-wrap gap-2">{trendingTags.map(tag => (<button key={tag} onClick={() => performSearch(tag)} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold hover:bg-gray-200">{tag}</button>))}</div></div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    {visualSearchImage ? (
                                        <div>
                                            <h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><CameraIcon size="sm"/> البحث بالصورة</h3>
                                            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden border shadow-sm"><img src={visualSearchImage} alt="visual search" className="w-full h-full object-cover" />{isAnalyzing && (<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4"><Spinner /><p className="mt-2 text-sm font-semibold text-center">جارٍ تحليل الصورة...</p></div>)}</div>
                                        </div>
                                    ) : (isAiSearching || suggestions.length > 0) ? (
                                        <div><h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><SparklesIcon size="sm" /> اقتراحات</h3>{isAiSearching ? <div className="flex justify-start p-4"><Spinner size="md" color="text-brand-dark" /></div> : (<div className="flex flex-col items-start gap-1">{suggestions.map((term, index) => (<button key={index} onClick={() => performSearch(term)} className="px-3 py-1.5 text-sm font-semibold hover:text-brand-primary rounded-md text-right">{term}</button>))}</div>)}</div>
                                    ) : null}
                                </div>
                           )}
                        </div>
                        <div className="col-span-2 space-y-6">
                            {(isAiSearching || aiSummary) && (<div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-indigo-400 rounded-r-lg animate-fade-in"><h3 className="font-bold text-brand-dark flex items-center gap-2 mb-2"><SparklesIcon size="sm" /> مساعد التسوق</h3>{isAiSearching ? <div className="h-12 bg-gray-200 rounded animate-skeleton-pulse"></div> : <p className="text-sm text-indigo-800 leading-relaxed">{aiSummary}</p>}</div>)}
                            
                            <div className="animate-fade-in">
                                {isSearching ? <div className="grid grid-cols-3 gap-4"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div> : (
                                    searchTerm.length < 2 && !visualSearchImage ? (
                                        <div><h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><FireIcon size="sm"/> المنتجات الرائجة</h3><div className="grid grid-cols-3 gap-4">{popularProducts.map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="group cursor-pointer"><div className="bg-brand-subtle rounded-lg aspect-[4/5] overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div><p className="font-semibold text-sm mt-2 truncate">{product.name}</p><p className="text-brand-primary font-bold text-sm">{product.price} ج.م</p></div>))}</div></div>
                                    ) : (isAiSearching || results.length > 0 || aiRecommendations.length > 0) ? (
                                        <div className="space-y-6">
                                            { (isAiSearching || aiRecommendations.length > 0) && <div><h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><SparklesIcon size="sm"/> توصيات AI لك</h3>{isAiSearching ? <div className="grid grid-cols-3 gap-4"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div> : <div className="grid grid-cols-3 gap-4">{aiRecommendations.map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="group cursor-pointer"><div className="bg-brand-subtle rounded-lg aspect-[4/5] overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div><p className="font-semibold text-sm mt-2 truncate">{product.name}</p><p className="text-brand-primary font-bold text-sm">{product.price} ج.م</p></div>))}</div>}</div>}
                                            {results.length > 0 && <div><h3 className="font-bold mb-3 text-brand-dark">نتائج مباشرة</h3><div className="grid grid-cols-3 gap-4">{results.map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="group cursor-pointer"><div className="bg-brand-subtle rounded-lg aspect-[4/5] overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div><p className="font-semibold text-sm mt-2 truncate">{product.name}</p><p className="text-brand-primary font-bold text-sm">{product.price} ج.م</p></div>))}</div>{allResultsCount > results.length && (<button onClick={() => performSearch(searchTerm)} className="w-full mt-6 bg-brand-subtle text-brand-dark font-bold py-3 rounded-lg text-base hover:bg-brand-border">عرض كل النتائج ({allResultsCount})</button>)}</div>}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8"><p className="font-bold text-brand-dark">لم نجد أي تطابق لـ "{searchTerm}".</p><p className="text-brand-text-light mt-2">جرّب البحث عن شيء آخر أو تحقق من منتجاتنا الرائجة.</p><div className="mt-8 p-6 bg-indigo-50/50 rounded-lg border-2 border-dashed border-indigo-200"><h4 className="font-bold text-brand-dark">هل لديك صورة؟</h4><p className="text-sm text-brand-text-light my-2">جرّب البحث البصري للعثور على منتجات مشابهة.</p><button onClick={handleVisualSearchClick} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:opacity-90"><CameraIcon size="sm" /> البحث بالصورة</button></div></div>
                                    )
                                )}
                            </div>
                            {(searchTerm.length >= 2 || visualSearchImage) && (
                                <div className="mt-6 pt-6 border-t border-dashed animate-fade-in">
                                    <div className="p-4 bg-brand-subtle rounded-lg text-center border">
                                        <h4 className="font-bold text-brand-dark">لم تجد ما تبحث عنه؟</h4>
                                        <p className="text-sm text-brand-text-light my-2">دردش مع مساعدنا الذكي للحصول على مساعدة شخصية.</p>
                                        <button 
                                            onClick={handleChatClick}
                                            className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-opacity-90 transition-opacity active:scale-95 text-sm"
                                        >
                                            <ChatBubbleOvalLeftEllipsisIcon size="sm" />
                                            اسأل المساعد الذكي
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};