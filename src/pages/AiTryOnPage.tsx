import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SparklesIcon, ArrowUpTrayIcon, XCircleIcon, ShoppingBagIcon, CameraIcon, MagicWandIcon, ChevronDownIcon } from '../components/icons';
import { GoogleGenAI, Modality } from "@google/genai";
import { allProducts } from '../data/products';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';
import { useAppState } from '../state/AppState';
import { useQuery } from '../hooks/useQuery';

interface AiTryOnPageProps {
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
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

const imageUrlToBase64 = async (url: string): Promise<{ base64: string, mimeType: string }> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const mimeType = blob.type;
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    return { base64, mimeType };
};

const AiTryOnPage: React.FC<AiTryOnPageProps> = ({ navigateTo, addToCart }) => {
    const [userImage, setUserImage] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAfter, setShowAfter] = useState(true);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const { state } = useAppState();
    const addToast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const query = useQuery();
    const toastedProductIdRef = useRef<string | null>(null);


    // State for product options
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        const productIdFromUrl = query.get('productId');
        if (productIdFromUrl) {
            if (toastedProductIdRef.current !== productIdFromUrl) {
                const product = allProducts.find(p => p.id === Number(productIdFromUrl));
                if (product) {
                    setSelectedProduct(product);
                    addToast(`تم تحديد ${product.name} للتجربة.`, 'info');
                    toastedProductIdRef.current = productIdFromUrl;
                }
            }
        }
    }, [query, addToast]);

    useEffect(() => {
        if (selectedProduct) {
            setSelectedColor(selectedProduct.colors[0]);
            setSelectedSize(selectedProduct.sizes[0]);
        }
    }, [selectedProduct]);

    const selectableProducts = useMemo(() => {
        const productMap = new Map<number, Product>();
        const isClothing = (p: Product) => !p.tags.includes('إكسسوارات');
    
        // Add cart items
        state.cart.forEach(cartItem => {
            const product = allProducts.find(p => p.id === cartItem.id);
            if (product && isClothing(product) && !productMap.has(product.id)) {
                productMap.set(product.id, product);
            }
        });
    
        // Add wishlist items
        state.wishlist.forEach(wishlistItem => {
            const product = allProducts.find(p => p.id === wishlistItem.id);
            if (product && isClothing(product) && !productMap.has(product.id)) {
                productMap.set(product.id, product);
            }
        });
    
        // Add some popular items to fill up the list
        allProducts
            .filter(isClothing)
            .sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0))
            .forEach(p => {
                if (productMap.size < 12 && !productMap.has(p.id)) {
                    productMap.set(p.id, p);
                }
            });
    
        return Array.from(productMap.values()).slice(0, 12);
    }, [state.cart, state.wishlist]);

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'جرّب بالذكاء الاصطناعي' }
    ];

    const handleImageChange = (file: File) => {
        setGeneratedImage(null);
        setUserImage({ file, preview: URL.createObjectURL(file) });
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
        } catch (err) {
            console.error("Camera error:", err);
            setError("لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
    };

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            canvas.toBlob(blob => {
                if (blob) {
                    handleImageChange(new File([blob], "camera-shot.jpg", { type: "image/jpeg" }));
                }
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const handleReset = () => {
        setUserImage({ file: null, preview: null });
        setGeneratedImage(null);
        setSelectedProduct(null);
        setError('');
    };
    
    const handleGenerate = async () => {
        if (!userImage.file || !selectedProduct) {
            setError('الرجاء تحميل صورة واختيار منتج.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const userImageBase64 = await blobToBase64(userImage.file);
            const { base64: productBase64, mimeType: productMimeType } = await imageUrlToBase64(selectedProduct.image);

            const userImagePart = { inlineData: { mimeType: userImage.file.type, data: userImageBase64 } };
            const productPart = { inlineData: { mimeType: productMimeType, data: productBase64 } };
            const textPart = { text: "Realistically place the clothing item from the second image onto the person in the first image for a virtual try-on. It's crucial to preserve the exact texture, color, fit, and intricate details (like buttons, seams, patterns) of the clothing. The final image should look photorealistic, maintaining the person's original pose and the background. Ensure the lighting and shadows on the clothing match the environment in the first photo." };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [userImagePart, productPart, textPart] },
                config: { responseModalities: [Modality.IMAGE] }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
                    setShowAfter(true);
                    break;
                }
            }
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
            addToast('فشل إنشاء الصورة', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddToCart = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, { selectedColor, selectedSize });
            addToast("تمت الإضافة إلى السلة!", "success");
        }
    };

    return (
        <div className="bg-brand-bg relative overflow-hidden pb-24 lg:pb-0">
             <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30">
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent animate-animated-gradient bg-200%"></div>
            </div>

            <div className="relative z-10">
                <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="جرّب بالذكاء الاصطناعي" />

                <div className="container mx-auto px-4 py-12">
                     <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Column: Image Area */}
                        <div className="aspect-[4/5] bg-brand-subtle rounded-2xl border border-brand-border/50 shadow-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
                            {isLoading && (
                                <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center z-20">
                                    <Spinner size="lg" color="text-brand-primary" />
                                    <h3 className="text-xl font-bold text-brand-dark">يقوم الذكاء الاصطناعي بتنسيق إطلالتك...</h3>
                                    <p className="text-brand-text-light">قد يستغرق هذا بضع لحظات.</p>
                                </div>
                            )}
                            {generatedImage && userImage.preview ? (
                                <>
                                    <img src={userImage.preview} alt="Before" className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${showAfter ? 'opacity-0' : 'opacity-100'}`} />
                                    <img src={generatedImage} alt="After" className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${showAfter ? 'opacity-100' : 'opacity-0'}`} />
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-brand-bg/50 backdrop-blur-sm p-1.5 rounded-full z-10">
                                        <button onClick={() => setShowAfter(false)} className={`px-3 py-1 text-sm font-semibold rounded-full ${!showAfter ? 'bg-white shadow' : ''}`}>قبل</button>
                                        <button onClick={() => setShowAfter(true)} className={`px-3 py-1 text-sm font-semibold rounded-full ${showAfter ? 'bg-white shadow' : ''}`}>بعد</button>
                                    </div>
                                </>
                            ) : userImage.preview ? (
                                <img src={userImage.preview} alt="Your photo" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center">
                                    <h2 className="text-xl md:text-2xl font-bold text-brand-dark">✨ جرّب بالذكاء الاصطناعي</h2>
                                    <p className="text-brand-text-light mt-2 mb-6">حمّل صورتك أو استخدم الكاميرا ودع الذكاء الاصطناعي يريك كيف تبدو.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-brand-dark text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90"><ArrowUpTrayIcon/> <span>حمّل صورتك</span></button>
                                        <button onClick={startCamera} className="w-full sm:w-auto bg-surface border border-brand-border text-brand-dark font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-brand-subtle"><CameraIcon/> <span>استخدم الكاميرا</span></button>
                                    </div>
                                </div>
                            )}
                             <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                             {userImage.preview && (
                                <button onClick={handleReset} className="absolute bottom-4 left-4 bg-brand-bg/50 backdrop-blur-sm text-brand-dark font-semibold py-2 px-4 rounded-full text-sm shadow-md hover:bg-brand-bg z-10">
                                    إعادة تعيين
                                </button>
                             )}
                              <p className="absolute bottom-4 text-xs text-brand-text-light/80 z-10 text-center w-full px-12">
                                صورتك تتم معالجتها بشكل آمن بواسطة Gemini AI ولا يتم تخزينها على خوادمنا.
                            </p>
                        </div>
                        
                        {/* Right Column: Product & Controls */}
                        <div className="space-y-6">
                             <div>
                                <h3 className="font-bold text-xl text-brand-dark">1. اختر منتجاً</h3>
                                <p className="text-sm text-brand-text-light mt-1 mb-4">اختر من قائمة مشترياتك، قائمة الرغبات، أو المنتجات الرائجة.</p>
                                <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-2 -mx-4 px-4">
                                    {selectableProducts.map(p => (
                                        <div key={p.id} onClick={() => setSelectedProduct(p)} className={`flex-shrink-0 w-28 aspect-[4/5] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedProduct?.id === p.id ? 'border-brand-primary shadow-lg scale-105' : 'border-transparent hover:border-brand-border'}`}>
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {selectedProduct && (
                                <div className="bg-surface rounded-xl border border-brand-border p-4 animate-fade-in space-y-4">
                                    <div>
                                        <p className="text-sm text-brand-text-light">{selectedProduct.brand}</p>
                                        <h3 className="font-bold text-xl text-brand-dark">{selectedProduct.name}</h3>
                                        <p className="text-brand-primary font-semibold text-2xl mt-2">{selectedProduct.price} ج.م</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-brand-dark">اللون: {selectedColor}</label>
                                        <div className="flex gap-2 mt-2">
                                            {selectedProduct.colors.map(color => (
                                            <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 p-0.5 ${selectedColor === color ? 'border-brand-primary' : 'border-transparent'}`}>
                                                <div className="w-full h-full rounded-full" style={{ backgroundColor: color }}></div>
                                            </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-brand-dark">المقاس</label>
                                        <div className="relative mt-2">
                                            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full appearance-none bg-brand-subtle border border-brand-border rounded-lg py-2.5 px-4 font-semibold">
                                            {selectedProduct.sizes.map(size => (<option key={size} value={size}>{size}</option>))}
                                            </select>
                                            <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2"/>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex flex-col gap-3 pt-2">
                                        <button onClick={handleGenerate} disabled={isLoading || !userImage.file} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 active:scale-98">
                                            <MagicWandIcon/>
                                            <span>{isLoading ? 'جارٍ التحليل...' : 'جرّب بالذكاء الاصطناعي'}</span>
                                        </button>
                                        <button onClick={handleAddToCart} className="w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-98">
                                            <ShoppingBagIcon />
                                            <span>أضف للسلة</span>
                                        </button>
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-xs font-semibold text-brand-text-light">Powered by Gemini AI</span>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>
                </div>

                 {/* Camera Modal */}
                {isCameraActive && (
                    <div className="fixed inset-0 bg-black/80 z-[110] flex flex-col items-center justify-center animate-fade-in p-4">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg h-auto rounded-lg"></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        <div className="mt-6 flex items-center gap-6">
                            <button onClick={stopCamera} className="bg-surface text-brand-dark font-bold py-3 px-8 rounded-full">إلغاء</button>
                            <button onClick={takePicture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white/50 ring-4 ring-black/20" aria-label="Take picture"></button>
                        </div>
                    </div>
                )}
            </div>
             {/* Sticky Mobile Actions */}
             {userImage.file && selectedProduct && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-bg/90 backdrop-blur-sm p-4 border-t border-brand-border z-40 animate-slide-in-up">
                    {generatedImage ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleGenerate} disabled={isLoading} className="bg-surface border border-brand-border text-brand-dark font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 active:scale-98">
                                <MagicWandIcon />
                                <span>{isLoading ? '...' : 'إعادة إنشاء'}</span>
                            </button>
                            <button onClick={handleAddToCart} className="bg-brand-dark text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 active:scale-98">
                                <ShoppingBagIcon />
                                <span>أضف للسلة</span>
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 active:scale-98">
                            <MagicWandIcon/>
                            <span>{isLoading ? 'جارٍ التحليل...' : 'جرّب بالذكاء الاصطناعي'}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiTryOnPage;