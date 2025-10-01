import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { allProducts } from '../../data/products';
import { useAppState } from '../../state/AppState';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon } from '../icons';
import { CollectionProductCard } from '../product/CollectionProductCard';
import { ProductCardSkeleton } from '../ui/ProductCardSkeleton';
import { ordersData } from '../../data/orders';

interface AiRecommendationsSectionProps {
    title?: string;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    addToCompare: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
    currentProduct?: Product;
}

export const AiRecommendationsSection: React.FC<AiRecommendationsSectionProps> = (props) => {
    const { title = "خصيصاً لك", currentProduct } = props;
    const { state } = useAppState();
    const { wishlist, compareList, recentlyViewed, currentUser } = state;
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    const hasPersonalizationData = useMemo(() => {
        return !!currentProduct || recentlyViewed.length > 0 || (currentUser && ordersData.length > 0);
    }, [recentlyViewed, currentUser, currentProduct]);

    useEffect(() => {
        if (!hasGenerated && hasPersonalizationData) {
            getAiRecommendations();
        }
    }, [hasGenerated, hasPersonalizationData]);

    const getAiRecommendations = async () => {
        setIsGenerating(true);
        setHasGenerated(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const recentlyViewedProducts = recentlyViewed.map(id => allProducts.find(p => p.id === id)?.name).filter(Boolean);
            
            let pastPurchases: string[] = [];
            if (currentUser && ordersData.length > 0) {
                const purchasedItems = ordersData.flatMap(order => order.items.map(item => item.name));
                pastPurchases = [...new Set(purchasedItems)];
            }
            
            const trendingProducts = allProducts.filter(p => p.tags.includes('trending')).map(p => p.name);
            
            const exclusions = new Set([...recentlyViewedProducts, ...pastPurchases]);
             if (currentProduct) {
                exclusions.add(currentProduct.name);
            }
            const availableProducts = allProducts
                .filter(p => !exclusions.has(p.name))
                .map(p => p.name)
                .join(', ');

            let promptContext = '';
            
            if (currentProduct) {
                promptContext = `يقوم مستخدم بمشاهدة المنتج التالي: "${currentProduct.name}". `;
                const recentWithoutCurrent = recentlyViewedProducts.filter(p => p !== currentProduct.name);
                if (recentWithoutCurrent.length > 0) {
                     promptContext += `وقد شاهد مؤخرًا أيضًا: ${recentWithoutCurrent.join(', ')}. `;
                }
                if (pastPurchases.length > 0) {
                     promptContext += `وسجل الشراء الخاص به يتضمن: ${pastPurchases.join(', ')}. `;
                }
                promptContext += `بناءً على ذلك، قم بالتوصية بـ 4 منتجات تكميلية أو يتم شراؤها غالبًا مع المنتج الحالي.`;
            } else {
                if (recentlyViewedProducts.length > 0 && pastPurchases.length > 0) {
                    promptContext = `قام مستخدم مؤخرًا بمشاهدة هذه العناصر: ${recentlyViewedProducts.join(', ')}. كما اشترى سابقًا: ${pastPurchases.join(', ')}. بناءً على ذلك وعلى منتجاتنا الرائجة، قم بالتوصية بـ 4 منتجات أخرى تكمل إطلالتهم أو تتناسب مع أسلوبهم.`;
                } else if (recentlyViewedProducts.length > 0) {
                    promptContext = `قام مستخدم مؤخرًا بمشاهدة هذه العناصر: ${recentlyViewedProducts.join(', ')}. بناءً على ذلك وعلى منتجاتنا الرائجة، قم بالتوصية بـ 4 منتجات أخرى تكمل إطلالتهم أو تتناسب مع أسلوبهم.`;
                } else if (pastPurchases.length > 0) {
                    promptContext = `اشترى مستخدم سابقًا هذه العناصر: ${pastPurchases.join(', ')}. بناءً على ذلك، قم بالتوصية بـ 4 منتجات قد تعجبهم أيضًا.`;
                } else {
                    promptContext = `بناءً على منتجاتنا الرائجة في الموضة، قم بالتوصية بـ 4 عناصر أنيقة لعملائنا. تشمل المنتجات الرائجة: ${trendingProducts.slice(0, 5).join(', ')}.`;
                }
            }


            const prompt = `أنت خبير أزياء ومصمم في متجر إلكتروني يسمى Vineta. ${promptContext}
            من قائمة المنتجات المتاحة التالية، اختر 4. تأكد من عدم التوصية بأي منتجات موجودة في قائمة الاستبعاد.
            المنتجات المتاحة: ${availableProducts}.
            قم بالرد فقط بكائن JSON. يجب أن يحتوي كائن JSON على مفتاح "products" وهو عبارة عن مصفوفة من 4 أسماء منتجات بالضبط.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            products: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: 'الاسم الدقيق للمنتج الموصى به.'
                                }
                            }
                        },
                        required: ['products']
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            const recommendedNames: string[] = jsonResponse.products || [];

            const foundProducts = recommendedNames
                .map(name => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
                .filter((p): p is Product => p !== undefined);
            
            setRecommendations(foundProducts.slice(0, 4));
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            setRecommendations(allProducts.sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0,4));
        } finally {
            setIsGenerating(false);
        }
    };
    
    const renderProductCard = (product: Product) => (
        <div key={product.id}>
            <CollectionProductCard 
                product={product} 
                {...props}
                wishlistItems={wishlistIds} 
                compareList={compareList} 
            />
        </div>
    );

    if (!hasPersonalizationData && !hasGenerated) {
         return (
            <section className="py-16 bg-indigo-50/50">
                <div className="container mx-auto px-4">
                     <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-brand-dark">{title}</h2>
                        <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">اكتشف اختيارات مخصصة برعاية مصممنا الذكي بناءً على المنتجات الرائجة ونشاطك الأخير.</p>
                    </div>
                    <div className="text-center">
                        <button 
                            onClick={getAiRecommendations}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                        >
                            <SparklesIcon />
                            أنشئ توصياتي الذكية
                        </button>
                    </div>
                </div>
            </section>
        );
    }
    
    if (isGenerating) {
         return (
            <section className="py-16 bg-indigo-50/50">
                <div className="container mx-auto px-4">
                     <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-brand-dark">{title}</h2>
                        <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">يقوم مساعدنا الذكي بإعداد توصياتك...</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                </div>
            </section>
        );
    }

    if (recommendations.length === 0) {
        return null; // Don't render the section if there are no recommendations to show
    }

    return (
        <section className="py-16 bg-indigo-50/50">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-brand-dark">{title}</h2>
                    <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">اكتشف اختيارات مخصصة برعاية مصممنا الذكي بناءً على المنتجات الرائجة ونشاطك الأخير.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 animate-fade-in">
                    {recommendations.map(product => renderProductCard(product))}
                </div>
            </div>
        </section>
    );
};