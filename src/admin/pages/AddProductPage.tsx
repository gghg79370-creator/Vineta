

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminProduct, AdminVariant } from '../data/adminData';
import VariantManager from '../components/products/VariantManager';
import { SparklesIcon, TrashIcon } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";
import Spinner from '../../components/ui/Spinner';
import StickyMobileActions from '../components/ui/StickyMobileActions';

interface AddProductPageProps {
    navigate: (page: string, data?: any) => void;
    onSave: (product: AdminProduct) => void;
    productToEdit?: AdminProduct;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ navigate, onSave, productToEdit }) => {
    const isEditMode = !!productToEdit;
    
    const [product, setProduct] = useState({
        name: productToEdit?.name || '',
        description: productToEdit?.description || '',
        price: productToEdit?.price || '',
        compareAtPrice: productToEdit?.compareAtPrice || '',
        sku: productToEdit?.sku || '',
        stock: productToEdit?.stock || 0,
        status: productToEdit?.status || 'Draft',
        category: productToEdit?.category || '',
        tags: productToEdit?.tags?.join(', ') || '',
        seoTitle: productToEdit?.seoTitle || '',
        seoDescription: productToEdit?.seoDescription || '',
        weight: productToEdit?.weight || 0,
        weightUnit: productToEdit?.weightUnit || 'kg',
    });
    const [images, setImages] = useState<any[]>(productToEdit?.images || []);
    const [variants, setVariants] = useState<AdminVariant[]>(productToEdit?.variants || []);
    const [hasVariants, setHasVariants] = useState(isEditMode ? (productToEdit.variants.length > 0) : false);
    const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
    const [badges, setBadges] = useState<{ text: string; type: string }[]>(productToEdit?.badges || []);
    const [newBadge, setNewBadge] = useState({ text: '', type: 'custom' });

    const totalVariantStock = useMemo(() => {
        if (!hasVariants || variants.length === 0) return null;
        return variants.reduce((sum, v) => sum + v.stock, 0);
    }, [hasVariants, variants]);

    const getStockInfo = (stock: number) => {
        if (stock === 0) return { text: 'نفد المخزون', className: 'text-red-600' };
        if (stock <= 10) return { text: 'مخزون منخفض', className: 'text-amber-600' };
        return { text: 'متوفر', className: 'text-green-600' };
    };


    useEffect(() => {
        if (!hasVariants) {
            setVariants([]);
        }
    }, [hasVariants]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: (name === 'stock' || name === 'weight') ? parseFloat(value) || 0 : value }));
    };

    const handleSave = () => {
        const productData: AdminProduct = {
            id: productToEdit?.id || 0,
            name: product.name,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            sku: product.sku,
            stock: product.stock,
            status: product.status as 'Published' | 'Draft',
            category: product.category as 'women' | 'men',
            tags: product.tags.split(',').map(t => t.trim()).filter(Boolean),
            images: images,
            image: images.length > 0 ? (typeof images[0] === 'string' ? images[0] : URL.createObjectURL(images[0])) : '',
            variants: hasVariants ? variants : [],
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            weight: product.weight,
            weightUnit: product.weightUnit as 'kg' | 'g',
            reviews: productToEdit?.reviews || [],
            badges: badges,
        };
        onSave(productData);
    };

    const generateWithAi = async (field: 'description' | 'seoTitle' | 'seoDescription') => {
        if (!product.name) {
            alert("Please enter a product title first to generate content.");
            return;
        }
        setIsGenerating(prev => ({ ...prev, [field]: true }));
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            let instruction = '';
            switch(field) {
                case 'description':
                    instruction = `اكتب وصفًا جذابًا ومفصلاً للمنتج باللغة العربية. يجب أن يكون الوصف جذابًا ويسلط الضوء على الميزات الرئيسية ويشجع العملاء على الشراء. اجعله حوالي 2-3 جمل.`;
                    break;
                case 'seoTitle':
                    instruction = `اكتب عنوان SEO جذاب وموجز (أقل من 60 حرفًا) للمنتج التالي باللغة العربية.`;
                    break;
                case 'seoDescription':
                    instruction = `اكتب وصف ميتا SEO جذاب وموجز (أقل من 160 حرفًا) للمنتج التالي باللغة العربية.`;
                    break;
            }

            const prompt = `أنت كاتب محتوى إبداعي لمتجر أزياء إلكتروني يسمى Vineta. ${instruction}
            - عنوان المنتج: "${product.name}"
            - الفئة: "${product.category}"
            - الوسوم: "${product.tags}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setProduct(prev => ({ ...prev, [field]: response.text }));
        } catch (error) {
            console.error(`Error generating ${field}:`, error);
            alert(`Failed to generate ${field}. Please try again.`);
        } finally {
            setIsGenerating(prev => ({ ...prev, [field]: false }));
        }
    };


    return (
        <div className="space-y-6">
             <div className="sticky top-20 -mt-8 -mx-8 md:mb-6 p-4 bg-white/80 backdrop-blur-lg border-b z-10 hidden md:flex justify-between items-center">
                <h2 className="text-xl font-bold">{isEditMode ? `تعديل: ${productToEdit.name}` : 'إضافة منتج جديد'}</h2>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('products')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover transition-colors">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ المنتج'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="معلومات المنتج">
                        <div className="space-y-4">
                            <div>
                                <label className="admin-form-label">عنوان المنتج</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} className="admin-form-input"/>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="admin-form-label">الوصف</label>
                                    <button onClick={() => generateWithAi('description')} disabled={isGenerating['description']} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                        {isGenerating['description'] ? <Spinner size="sm" color="text-admin-accent" /> : <SparklesIcon size="sm" />}
                                        <span>إنشاء باستخدام AI</span>
                                    </button>
                                </div>
                                <textarea name="description" rows={8} value={product.description} onChange={handleChange} className="admin-form-input"></textarea>
                            </div>
                        </div>
                    </Card>

                    <Card title="الصور">
                        <ImageUpload initialImages={productToEdit?.images} onImagesChange={setImages} />
                    </Card>
                    
                    <Card title="التسعير والمخزون">
                        <label className="flex items-center gap-2 border-b pb-4 mb-4">
                            <input type="checkbox" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="rounded text-admin-accent focus:ring-admin-accent/50"/>
                            <span>هذا المنتج له متغيرات (مثل المقاس أو اللون)</span>
                        </label>
                        
                        {hasVariants && totalVariantStock !== null && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                <span className="font-bold">إجمالي المخزون</span>
                                <div>
                                    <span className="font-bold text-lg">{totalVariantStock}</span>
                                    <span className={`text-xs font-bold mr-2 px-2 py-0.5 rounded-full ${
                                        totalVariantStock === 0 ? 'bg-red-100 text-red-700' :
                                        totalVariantStock <= 10 ? 'bg-amber-100 text-amber-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {totalVariantStock === 0 ? 'نفد المخزون' : totalVariantStock <= 10 ? 'مخزون منخفض' : 'متوفر'}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {hasVariants ? (
                            <VariantManager variants={variants} setVariants={setVariants} />
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-form-label">السعر</label>
                                        <input type="text" name="price" value={product.price} onChange={handleChange} className="admin-form-input"/>
                                    </div>
                                    <div>
                                        <label className="admin-form-label">السعر قبل الخصم</label>
                                        <input type="text" name="compareAtPrice" value={product.compareAtPrice} onChange={handleChange} className="admin-form-input"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-form-label">SKU (وحدة حفظ المخزون)</label>
                                        <input type="text" name="sku" value={product.sku} onChange={handleChange} className="admin-form-input"/>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label className="admin-form-label">الكمية</label>
                                            {product.stock !== undefined && (
                                                <span className={`text-xs font-bold ${getStockInfo(product.stock).className}`}>
                                                    {getStockInfo(product.stock).text}
                                                </span>
                                            )}
                                        </div>
                                        <input type="number" name="stock" value={product.stock} onChange={handleChange} className="admin-form-input"/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="تحسين محركات البحث">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="admin-form-label">عنوان الصفحة (SEO)</label>
                                    <button onClick={() => generateWithAi('seoTitle')} disabled={isGenerating['seoTitle']} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                        {isGenerating['seoTitle'] ? <Spinner size="sm" color="text-admin-accent" /> : <SparklesIcon size="sm" />}
                                        <span>إنشاء</span>
                                    </button>
                                </div>
                                <input type="text" name="seoTitle" value={product.seoTitle} onChange={handleChange} className="admin-form-input"/>
                            </div>
                            <div>
                                 <div className="flex justify-between items-center mb-1">
                                    <label className="admin-form-label">وصف الصفحة (SEO)</label>
                                    <button onClick={() => generateWithAi('seoDescription')} disabled={isGenerating['seoDescription']} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                        {isGenerating['seoDescription'] ? <Spinner size="sm" color="text-admin-accent" /> : <SparklesIcon size="sm" />}
                                        <span>إنشاء</span>
                                    </button>
                                </div>
                                <textarea name="seoDescription" rows={3} value={product.seoDescription} onChange={handleChange} className="admin-form-input"></textarea>
                            </div>
                        </div>
                    </Card>

                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="تنظيم المنتج">
                        <div className="space-y-4">
                             <div>
                                <label className="admin-form-label">حالة المنتج</label>
                                <select name="status" value={product.status} onChange={handleChange} className="admin-form-input">
                                    <option value="Published">منشور</option>
                                    <option value="Draft">مسودة</option>
                                </select>
                            </div>
                             <div>
                                <label className="admin-form-label">فئة المنتج</label>
                                <select name="category" value={product.category} onChange={handleChange} className="admin-form-input">
                                    <option value="">اختر فئة</option>
                                    <option value="women">ملابس نسائية</option>
                                    <option value="men">ملابس رجالية</option>
                                </select>
                            </div>
                             <div>
                                <label className="admin-form-label">الوسوم</label>
                                <input type="text" name="tags" value={product.tags} onChange={handleChange} className="admin-form-input" placeholder="صيف, كاجوال, #SummerStyle"/>
                                <p className="text-xs text-gray-500 mt-1">افصل بين الوسوم بفاصلة.</p>
                            </div>
                             {/* Badges Section */}
                            <div className="pt-4 border-t">
                                <label className="admin-form-label">الشارات (Badges)</label>
                                <div className="space-y-2 mb-3">
                                    {badges.map((badge, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                            <span className="text-sm font-semibold">{badge.text} <span className="text-xs text-gray-500">({badge.type})</span></span>
                                            <button type="button" onClick={() => setBadges(badges.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700">
                                                <TrashIcon size="sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-gray-600">نص الشارة</label>
                                        <input 
                                            type="text"
                                            placeholder="جديد"
                                            value={newBadge.text}
                                            onChange={(e) => setNewBadge(prev => ({ ...prev, text: e.target.value }))}
                                            className="admin-form-input mt-1"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-gray-600">نوع الشارة</label>
                                        <select 
                                            value={newBadge.type}
                                            onChange={(e) => setNewBadge(prev => ({ ...prev, type: e.target.value }))}
                                            className="admin-form-input mt-1"
                                        >
                                            <option value="custom">مخصص</option>
                                            <option value="new">جديد</option>
                                            <option value="sale">تخفيض</option>
                                            <option value="trending">رائج</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newBadge.text.trim()) {
                                                setBadges([...badges, newBadge]);
                                                setNewBadge({ text: '', type: 'custom' });
                                            }
                                        }}
                                        className="bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-lg hover:bg-gray-300 h-10"
                                    >
                                        إضافة
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="الشحن">
                        <div className="space-y-4">
                            <div>
                                <label className="admin-form-label">الوزن</label>
                                <div className="flex">
                                    <input type="number" step="0.1" name="weight" value={product.weight} onChange={handleChange} className="admin-form-input rounded-l-none" />
                                    <select name="weightUnit" value={product.weightUnit} onChange={handleChange} className="admin-form-input rounded-r-none border-r-0">
                                        <option value="kg">كجم</option>
                                        <option value="g">جم</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
             <StickyMobileActions>
                <button 
                    onClick={() => navigate('products')}
                    className="bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 w-full justify-center">
                    إلغاء
                </button>
                <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2.5 px-4 rounded-lg hover:bg-admin-accentHover w-full justify-center">
                    {isEditMode ? 'حفظ التغييرات' : 'حفظ المنتج'}
                </button>
            </StickyMobileActions>
        </div>
    );
};

export default AddProductPage;
