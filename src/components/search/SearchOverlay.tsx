import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, Filters } from '../../types';
import { CloseIcon, SearchIcon, SparklesIcon, FireIcon, TagIcon, CategoryIcon, HistoryIcon, CameraIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowUpTrayIcon } from '../icons';
import { allProducts } from '../../data/products';
import { GoogleGenAI, Type } from "@google/genai";
import Spinner from '../ui/Spinner';
import { useAppState } from '../../state/AppState';
import { useToast } from '../../hooks/useToast';


interface SearchOverlayProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
    setIsChatbotOpen: (isOpen: boolean) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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

export const SearchOverlay = ({ isOpen, setIsOpen, navigateTo, setIsChatbotOpen, filters, setFilters }: SearchOverlayProps) => {
    const { state: { theme } } = useAppState();
    const addToast = useToast();
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

    // Camera state
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const popularCategories = useMemo(() => {
        const mainCategories = ['ملابس', 'إكسسوارات', 'أحذية', 'حقائب', 'ملابس رياضية', 'صيف', 'شتاء', 'كاجوال'];
        const allTags = new Set(allProducts.flatMap(p => p.tags));
        return mainCategories.filter(cat => allTags.has(cat)).slice(0, 6);
    }, []);

    const trendingTags = ['صيف', 'كاجوال', 'رائج', 'قطن', 'جديد', 'واسع الساق'];


    useEffect(() => {
        if (isOpen) {
            try {
                const history = localStorage.getItem('vinetaSearchHistory');
                if (history) setSearchHistory(JSON.parse(history));
            } catch (e) {
                console.error('Failed to parse search history', e);
                setSearchHistory([]);
            }
        } else {
            stopCamera();
            setTimeout(() => {
                setSearchTerm('');
                setVisualSearchImage(null);
                setIsAnalyzing(false);
                setSuggestions([]);
                setResults([]);
                setAiSummary('');
                setAiRecommendations([]);
            }, 300);
        }
        return () => { stopCamera(); };
    }, [isOpen]);
    
    const clearFilters = () => {
        setFilters({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [] });
        addToast('تم مسح جميع الفلاتر.', 'success');
    };
    
    const hasActiveFilters = useMemo(() => {
        return filters.brands.length > 0 ||
               filters.colors.length > 0 ||
               filters.sizes.length > 0 ||
               filters.priceRange.max < 1000 ||
               filters.rating > 0 ||
               filters.onSale ||
               filters.materials.length > 0;
    }, [filters]);

    const addToHistory = (query: string) => {
        const newHistory = [query, ...searchHistory.filter(item => item !== query && item.trim() !== '')].slice(0, 5);
        setSearchHistory(newHistory);
        try {
            localStorage.setItem('vinetaSearchHistory', JSON.stringify(newHistory));
        } catch (e) { console.error('Failed to save search history', e); }
    };

    const clearHistory = () => {
        setSearchHistory([]);
        try {
            localStorage.removeItem('vinetaSearchHistory');
        } catch (e) { console.error('Failed to clear search history', e); }
    };
    
    const getAiSearchResults = async (term: string) => {
        setIsAiSearching(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const searchableData = [...new Set(allProducts.flatMap(p => [p.name, ...p.tags, p.category, p.brand].filter(Boolean)))].join(', ');
            const availableProducts = allProducts.map(p => p.name).join(', ');

            const prompt = `أنت مساعد بحث خبير لمتجر أزياء ${theme.siteName}. يقوم مستخدم بالبحث عن "${term}".

1. قدم ما يصل إلى 4 اقتراحات بحث قصيرة وذات صلة بناءً على البيانات القابلة للبحث.
2. أوصِ بـ 4 منتجات ذات صلة عالية من قائمة المنتجات المتاحة.
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
            setResults(filtered.slice(0, 4));
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

    const analyzeImage = async (imageBlob: Blob) => {
        setSearchTerm(''); setResults([]); setSuggestions([]);
        const imageUrl = URL.createObjectURL(imageBlob);
        setVisualSearchImage(imageUrl);
        setIsAnalyzing(true);
        try {
            const base64Data = await blobToBase64(imageBlob);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = { inlineData: { mimeType: imageBlob.type, data: base64Data } };
            const textPart = { text: "Describe the fashion items in this image in a short, searchable phrase in Arabic. Example: 'فستان صيفي أبيض'." };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [imagePart, textPart] } });
            setSearchTerm(response.text);
        } catch (error) { console.error("Error analyzing image:", error); } 
        finally { setIsAnalyzing(false); }
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            analyzeImage(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await analyzeImage(blob);
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-brand-subtle z-[70] animate-fade-in md:hidden">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             {isCameraOpen && (
                <div className="fixed inset-0 bg-black z-[80] flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="absolute bottom-8 flex items-center justify-center w-full gap-8">
                        <button onClick={stopCamera} className="text-white bg-black/30 rounded-full py-2 px-6 font-semibold">إلغاء</button>
                        <button onClick={captureImage} className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white/50 ring-4 ring-black/20" aria-label="Capture Image"></button>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-4 py-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <form onSubmit={handleFormSubmit} className="flex-1 relative">
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light pointer-events-none"><SearchIcon/></div>
                        <input type="search" placeholder="بحث..." className="w-full bg-white border border-brand-border rounded-full py-3 pr-12 pl-24 focus:outline-none focus:ring-2 focus:ring-brand-dark" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setVisualSearchImage(null);}} autoFocus />
                         <div className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center gap-1">
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="text-brand-text-light p-1.5 rounded-full hover:bg-gray-100" aria-label="البحث بصورة من ملف"><ArrowUpTrayIcon/></button>
                            <button type="button" onClick={startCamera} className="text-brand-text-light p-1.5 rounded-full hover:bg-gray-100" aria-label="البحث بالكاميرا"><CameraIcon /></button>
                         </div>
                    </form>
                    <button onClick={() => setIsOpen(false)} className="font-semibold text-brand-dark flex-shrink-0">إلغاء</button>
                </div>

                <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-6">
                    {visualSearchImage && (
                        <div className="text-center p-4">
                            <h3 className="font-bold text-lg mb-4 text-brand-dark">البحث بالصورة</h3>
                            <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden border-2 border-brand-primary/50 shadow-lg">
                                <img src={visualSearchImage} alt="Visual search preview" className="w-full h-full object-cover" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                                        <Spinner /> <p className="mt-2 text-sm font-semibold">جارٍ التحليل...</p>
                                    </div>
                                )}
                            </div>
                            {isAnalyzing && <p className="mt-4 text-brand-text-light">يقوم مساعدنا الذكي بالبحث عن منتجات مشابهة...</p>}
                        </div>
                    )}

                    {searchTerm.length < 2 && !visualSearchImage ? (
                        <div className="space-y-8 animate-fade-in">
                            {searchHistory.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-brand-dark flex items-center gap-2"><HistoryIcon size="sm"/> عمليات البحث الأخيرة</h3>
                                        <button onClick={clearHistory} className="text-xs font-semibold text-brand-text-light hover:text-brand-dark">مسح</button>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">{searchHistory.map(term => (<button key={term} onClick={() => performSearch(term)} className="px-4 py-1.5 bg-white border rounded-full text-sm font-semibold hover:bg-brand-border">{term}</button>))}</div>
                                </div>
                            )}
                             {hasActiveFilters && (
                                <div>
                                    <h3 className="font-bold text-brand-dark flex items-center gap-2">الفلاتر النشطة</h3>
                                    <button onClick={clearFilters} className="text-sm font-semibold text-red-600 hover:underline mt-2">مسح كل الفلاتر</button>
                                </div>
                            )}
                             <div>
                                <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2"><CategoryIcon size="sm"/> الفئات الشائعة</h3>
                                <div className="flex gap-2 flex-wrap">{popularCategories.map(cat => (<button key={cat} onClick={() => performSearch(cat)} className="px-4 py-1.5 bg-white border rounded-full text-sm font-semibold hover:bg-brand-border">{cat}</button>))}</div>
                            </div>
                             <div>
                                <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2"><TagIcon size="sm"/> الوسوم الرائجة</h3>
                                <div className="flex gap-2 flex-wrap">{trendingTags.map(tag => (<button key={tag} onClick={() => performSearch(tag)} className="px-4 py-1.5 bg-white border rounded-full text-sm font-semibold hover:bg-brand-border">{tag}</button>))}</div>
                            </div>
                            <div>
                                <h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><FireIcon size="sm"/> الأكثر مبيعًا</h3>
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">{allProducts.slice(0, 5).map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="flex-shrink-0 w-32 cursor-pointer group"><div className="bg-white rounded-lg overflow-hidden aspect-[4/5] mb-2"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div><p className="font-bold text-xs text-center truncate">{product.name}</p><p className="text-brand-primary font-semibold text-xs text-center">{product.price} ج.م</p></div>))}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-8">
                             {(isAiSearching || aiSummary) && (
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                                    <h3 className="font-bold text-brand-dark flex items-center gap-2 mb-2"><SparklesIcon size="sm" /> مساعد التسوق الذكي</h3>
                                    {isAiSearching ? (<div className="h-12 bg-gray-200 rounded animate-skeleton-pulse"></div>) : (<p className="text-sm text-indigo-800 leading-relaxed">{aiSummary}</p>)}
                                </div>
                            )}
                            {(isAiSearching || suggestions.length > 0) && (
                                <div>
                                    <h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><SparklesIcon size="sm" /> هل تقصد...</h3>
                                    {isAiSearching ? <div className="flex justify-center p-4"><Spinner size="md" color="text-brand-dark" /></div> : (<div className="flex gap-2 flex-wrap">{suggestions.map((term, index) => (<button key={index} onClick={() => performSearch(term)} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold hover:bg-indigo-100">{term}</button>))}</div>)}
                                </div>
                            )}
                            {(isAiSearching || aiRecommendations.length > 0) && (
                                <div>
                                    <h3 className="font-bold mb-3 text-brand-dark flex items-center gap-2"><SparklesIcon size="sm" /> توصيات AI لك</h3>
                                    {isAiSearching ? <div className="flex justify-center p-4"><Spinner size="md" color="text-brand-dark" /></div> : (
                                        aiRecommendations.length > 0 ? (
                                             <div className="space-y-3">{aiRecommendations.map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="flex items-center gap-4 p-2 bg-white rounded-lg cursor-pointer active:bg-gray-100"><img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-md"/><div className="flex-1 text-right"><p className="font-bold text-sm">{product.name}</p><p className="text-brand-primary font-semibold">{product.price} ج.م</p></div></div>))}</div>
                                        ) : null
                                    )}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold mb-3 text-brand-dark">نتائج مباشرة</h3>
                                {isSearching ? <div className="flex justify-center p-4"><Spinner size="md" color="text-brand-dark" /></div> : (
                                    results.length > 0 ? (
                                        <div className="space-y-3">
                                            {results.map(product => (<div key={product.id} onClick={() => { navigateTo('product', product); setIsOpen(false); }} className="flex items-center gap-4 p-2 bg-white rounded-lg cursor-pointer active:bg-gray-100"><img src={product.image} alt={product.name} className="w-16 h-20 object-cover rounded-md"/><div className="flex-1 text-right"><p className="font-bold text-sm">{product.name}</p><p className="text-brand-primary font-semibold">{product.price} ج.م</p></div></div>))}
                                            {allResultsCount > results.length && (<button onClick={() => performSearch(searchTerm)} className="w-full mt-4 bg-brand-dark text-white font-bold py-3 rounded-full text-base">عرض كل النتائج ({allResultsCount})</button>)}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-brand-text-light mb-6">لا توجد منتجات مطابقة لـ "{searchTerm}".</p>
                                             <div className="p-6 bg-indigo-50/50 rounded-lg border-2 border-dashed border-indigo-200">
                                                <h4 className="font-bold text-brand-dark">هل لديك صورة؟</h4>
                                                <p className="text-sm text-brand-text-light my-2">جرّب البحث البصري للعثور على منتجات مشابهة.</p>
                                                <button onClick={startCamera} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:opacity-90 transition-opacity active:scale-95">
                                                    <CameraIcon size="sm" /> البحث بالكاميرا
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                             <div className="mt-8 pt-6 border-t border-dashed">
                                <div className="p-4 bg-white rounded-lg text-center border">
                                     <h4 className="font-bold text-brand-dark">لم تجد ما تبحث عنه؟</h4>
                                     <p className="text-sm text-brand-text-light my-2">دردش مع مساعدنا الذكي للحصول على مساعدة شخصية وتوصيات الخبراء.</p>
                                     <button 
                                        onClick={handleChatClick}
                                        className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-opacity-90 transition-opacity active:scale-95 text-sm"
                                    >
                                        <ChatBubbleOvalLeftEllipsisIcon size="sm" />
                                        ابدأ الدردشة الآن
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};