

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminProduct, AdminVariant } from '../data/adminData';
import VariantManager from '../components/products/VariantManager';
import { MagicIcon } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";

interface AddProductPageProps {
    navigate: (page: string, data?: any) => void;
    onSave: (product: AdminProduct) => void;
    productToEdit?: AdminProduct;
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    useEffect(() => {
        if (!hasVariants) {
            setVariants([]);
        }
    }, [hasVariants]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: (name === 'stock' || name === 'weight') ? parseFloat(value) || 0 : value }));
    };

    const handleGenerateDescription = async () => {
        if (!product.name) {
            alert("Please enter a product title first.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a compelling, SEO-friendly product description for a product named "${product.name}". Use the following keywords if available: ${product.tags}. The description should be in Arabic.`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            const generatedText = response.text;
            setProduct(prev => ({ ...prev, description: generatedText }));

        } catch (error) {
            console.error("Error generating description:", error);
            alert("Failed to generate description. Please check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateTags = async () => {
        if (images.length === 0) {
            alert("Please upload a product image first.");
            return;
        }
        setIsGeneratingTags(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const firstImage = images[0];
            let imagePart;

            if (typeof firstImage === 'string') { // It's a URL
                 const response = await fetch(firstImage);
                 const blob = await response.blob();
                 const file = new File([blob], "image.jpg", { type: blob.type });
                 imagePart = await fileToGenerativePart(file);
            } else { // It's a File object
                imagePart = await fileToGenerativePart(firstImage);
            }

            const textPart = {
              text: `Analyze this fashion product image and generate a list of relevant, descriptive tags. Include tags for style, pattern, material, item type, and occasion. Return the tags as a comma-separated string. For example: "فستان صيفي, نمط زهري, قطن, رقبة على شكل V, كاجوال". The tags must be in Arabic.`
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            
            setProduct(prev => ({...prev, tags: response.text }));
        } catch (error) {
            console.error("Error generating tags:", error);
            alert("Failed to generate tags. Please check the console for details.");
        } finally {
            setIsGeneratingTags(false);
        }
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
        };
        onSave(productData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
                    <p className="text-gray-500 mt-1">{isEditMode ? 'قم بتحديث تفاصيل المنتج أدناه.' : 'املأ التفاصيل أدناه لإضافة منتج جديد.'}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('products')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ المنتج'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="معلومات المنتج">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المنتج</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">الوصف</label>
                                    <button onClick={handleGenerateDescription} disabled={isGenerating} className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 disabled:opacity-50">
                                        <MagicIcon size="sm"/>
                                        {isGenerating ? 'جاري الإنشاء...' : 'إنشاء باستخدام الذكاء الاصطناعي'}
                                    </button>
                                </div>
                                <textarea name="description" rows={6} value={product.description} onChange={handleChange} className="w-full border-gray-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </Card>

                    <Card title="الصور">
                        <ImageUpload initialImages={productToEdit?.images} onImagesChange={setImages} />
                    </Card>

                    <Card title="المتغيرات">
                         <label className="flex items-center gap-2 cursor-pointer mb-4">
                            <input type="checkbox" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} /> 
                            <span>هذا المنتج له متغيرات، مثل المقاسات أو الألوان</span>
                        </label>
                        {hasVariants ? (
                            <VariantManager variants={variants} setVariants={setVariants} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                                    <input type="text" name="price" value={product.price} onChange={handleChange} className="w-full border-gray-300 rounded-lg" placeholder="0.00 ج.م"/>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر قبل الخصم</label>
                                    <input type="text" name="compareAtPrice" value={product.compareAtPrice} onChange={handleChange} className="w-full border-gray-300 rounded-lg" placeholder="0.00 ج.م"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (وحدة حفظ المخزون)</label>
                                    <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                                    <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="الشحن">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الوزن</label>
                                <input type="number" step="0.1" name="weight" value={product.weight} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">وحدة الوزن</label>
                                <select name="weightUnit" value={product.weightUnit} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                    <option value="kg">كجم</option>
                                    <option value="g">جم</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <Card title="تحسين محركات البحث (SEO)">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان صفحة SEO</label>
                                <input type="text" name="seoTitle" value={product.seoTitle} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">وصف ميتا SEO</label>
                                <textarea name="seoDescription" rows={3} value={product.seoDescription} onChange={handleChange} className="w-full border-gray-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </Card>

                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card title="الحالة">
                        <select name="status" value={product.status} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                            <option value="Draft">مسودة</option>
                            <option value="Published">منشور</option>
                        </select>
                    </Card>
                    <Card title="تنظيم المنتج">
                         <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                                 <select name="category" value={product.category} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                    <option value="">اختر فئة</option>
                                    <option value="women">ملابس نسائية</option>
                                    <option value="men">ملابس رجالية</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الوسوم</label>
                                <div className="flex gap-2">
                                    <input type="text" name="tags" value={product.tags} onChange={handleChange} className="w-full border-gray-300 rounded-lg" placeholder="صيف، قطن (مفصولة بفاصلة)"/>
                                    <button onClick={handleGenerateTags} disabled={isGeneratingTags} className="flex-shrink-0 bg-primary-100 text-primary-700 font-bold py-2 px-3 rounded-lg flex items-center gap-2 hover:bg-primary-200 transition-colors disabled:opacity-50">
                                        <MagicIcon size="sm"/>
                                        <span className="text-xs">{isGeneratingTags ? 'جاري...' : 'إنشاء'}</span>
                                    </button>
                                </div>
                            </div>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;