
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminProduct, AdminVariant } from '../data/adminData';
import { SparklesIcon, TrashIcon, PlusIcon, InformationCircleIcon, XCircleIcon } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";
import Spinner from '../../components/ui/Spinner';
import VariantManager from '../components/products/VariantManager';
import { Badge } from '../../../types';
import { useToast } from '../../hooks/useToast';

interface AddProductPageProps {
    navigate: (page: string, data?: any) => void;
    onSave: (product: AdminProduct) => void;
    productToEdit?: AdminProduct;
}

// Reusable Toggle Switch Component
const ToggleSwitch: React.FC<{
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1">
            <label className="font-bold text-admin-text-primary cursor-pointer">{label}</label>
            {description && <p className="text-xs text-admin-text-secondary mt-1">{description}</p>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-admin-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-admin-accent/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-accent"></div>
        </label>
    </div>
);


const AddProductPage: React.FC<AddProductPageProps> = ({ navigate, onSave, productToEdit }) => {
    const isEditMode = !!productToEdit;
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const addToast = useToast();
    const [generatingField, setGeneratingField] = useState<string | null>(null);

    const getInitialImages = () => {
        if (!productToEdit) return [];
        return productToEdit.images?.length ? productToEdit.images : (productToEdit.image ? [productToEdit.image] : []);
    };

    const [productDetails, setProductDetails] = useState({
        name: productToEdit?.name || '',
        description: productToEdit?.description || '',
        status: productToEdit?.status || 'Draft',
        category: productToEdit?.category || '',
        tags: productToEdit?.tags?.join(', ') || '',
        seoTitle: productToEdit?.seoTitle || '',
        seoDescription: productToEdit?.seoDescription || '',
    });
    
    const [pricing, setPricing] = useState({
        price: productToEdit?.price || '',
        compareAtPrice: productToEdit?.compareAtPrice || '',
        sku: productToEdit?.sku || '',
        stock: productToEdit?.stock || 0,
        weight: productToEdit?.weight || 0,
    });

    const [images, setImages] = useState<any[]>(getInitialImages());
    const [variants, setVariants] = useState<AdminVariant[]>(productToEdit?.variants || []);
    const [badges, setBadges] = useState<Badge[]>(productToEdit?.badges || []);

    const [newBadge, setNewBadge] = useState<{ text: string; type: Badge['type'] }>({ text: '', type: 'custom' });

    const [displaySettings, setDisplaySettings] = useState({
        highlight: false,
        advanced: false,
        landingPage: false,
        hideFromHomepage: false,
        hiddenElements: '',
    });

    const [discountSettings, setDiscountSettings] = useState({
        enabled: !!productToEdit?.compareAtPrice,
        priceAfterDiscount: productToEdit?.price || '',
        promoText: '',
        countdown: false
    });


    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProductDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPricing(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleAddBadge = () => {
        if (newBadge.text.trim()) {
            setBadges([...badges, newBadge]);
            setNewBadge({ text: '', type: 'custom' });
        }
    };

    const handleRemoveBadge = (index: number) => {
        setBadges(badges.filter((_, i) => i !== index));
    };


    const handleSave = () => {
        if (!productDetails.name.trim()) {
            addToast('اسم المنتج مطلوب.', 'error');
            setStep(1);
            return;
        }
        if (images.length === 0) {
            addToast('يجب إضافة صورة واحدة على الأقل.', 'error');
            setStep(1);
            return;
        }
         if (!pricing.price) {
            addToast('السعر مطلوب.', 'error');
            setStep(2);
            return;
        }

        const productData: AdminProduct = {
            id: productToEdit?.id || 0,
            name: productDetails.name,
            description: productDetails.description,
            image: typeof images[0] === 'string' ? images[0] : URL.createObjectURL(images[0]),
            images: images.map(img => typeof img === 'string' ? img : URL.createObjectURL(img)),
            sku: pricing.sku,
            price: pricing.price,
            compareAtPrice: pricing.compareAtPrice || undefined,
            stock: Number(pricing.stock),
            status: productDetails.status as 'Published' | 'Draft',
            category: productDetails.category,
            tags: productDetails.tags.split(',').map(t => t.trim()).filter(Boolean),
            seoTitle: productDetails.seoTitle,
            seoDescription: productDetails.seoDescription,
            weight: Number(pricing.weight),
            weightUnit: 'kg',
            variants: variants,
            reviews: productToEdit?.reviews || [],
            badges: badges,
            unitsSold: productToEdit?.unitsSold || 0,
        };
        onSave(productData);
        addToast(isEditMode ? `تم تحديث المنتج "${productData.name}" بنجاح!` : `تم إنشاء المنتج "${productData.name}" بنجاح!`, 'success');
    };
    
    const generateAIContent = async (fieldType: 'description' | 'seoTitle' | 'seoDescription') => {
        if (!productDetails.name) {
            addToast('يرجى إدخال اسم المنتج أولاً.', 'error');
            return;
        }
        setGeneratingField(fieldType);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let prompt = '';
            const productInfo = `اسم المنتج: ${productDetails.name}, الفئة: ${productDetails.category}, الوسوم: ${productDetails.tags}`;
    
            switch (fieldType) {
                case 'description':
                    prompt = `أنت خبير تسويق إلكتروني لمتجر أزياء يسمى Vineta. اكتب وصف منتج جذاب ومناسب لمحركات البحث باللغة العربية بناءً على التفاصيل التالية: ${productInfo}. يجب أن تكون النبرة عصرية ومقنعة، وتسلط الضوء على الفوائد الرئيسية. اجعلها حوالي 3-4 جمل.`;
                    break;
                case 'seoTitle':
                    prompt = `أنت خبير SEO. اكتب عنوان SEO جذاب وموجز (بحد أقصى 70 حرفًا) باللغة العربية للمنتج التالي: ${productInfo}.`;
                    break;
                case 'seoDescription':
                    prompt = `أنت خبير SEO. اكتب وصف SEO جذاب (بحد أقصى 160 حرفًا) باللغة العربية للمنتج التالي: ${productInfo}. يجب أن يشجع على النقر.`;
                    break;
            }
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
    
            setProductDetails(prev => ({...prev, [fieldType]: response.text.trim()}));
    
        } catch (error) {
            console.error(`Error generating AI ${fieldType}:`, error);
            addToast(`فشل في إنشاء ${fieldType}.`, 'error');
        } finally {
            setGeneratingField(null);
        }
    }

    // Rich Text Editor Toolbar Mock
    const RichTextToolbar = () => (
      <div className="flex items-center gap-2 flex-wrap p-2 border-b border-admin-border bg-admin-bg/50 rounded-t-lg">
          {['B', 'I', 'U', 'S'].map(t => <button type="button" key={t} className="w-8 h-8 font-bold text-sm hover:bg-admin-accent/10 rounded">{t}</button>)}
          <div className="w-px h-6 bg-admin-border"></div>
          {['fa-align-right', 'fa-align-center', 'fa-align-left'].map(icon => <button type="button" key={icon} className="w-8 h-8 text-sm hover:bg-admin-accent/10 rounded"><i className={`fa-solid ${icon}`}></i></button>)}
          <div className="w-px h-6 bg-admin-border"></div>
          {['fa-list-ul', 'fa-list-ol'].map(icon => <button type="button" key={icon} className="w-8 h-8 text-sm hover:bg-admin-accent/10 rounded"><i className={`fa-solid ${icon}`}></i></button>)}
      </div>
    );
    
    // Step 1: Details
    const Step1 = () => (
      <div className="space-y-6 animate-quick-fade-in">
        <Card title="اسم المنتج *">
            <input type="text" name="name" value={productDetails.name} onChange={handleChange} className="admin-form-input" placeholder="مثال: قميص صيفي خفيف" />
        </Card>
        <Card>
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-base font-bold text-admin-text-primary">وصف المنتج التفصيلي *</h2>
                <button type="button" onClick={() => generateAIContent('description')} disabled={generatingField !== null} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                    {generatingField === 'description' ? <Spinner size="sm" color="text-admin-accent"/> : <SparklesIcon size="sm"/>}
                    <span>إنشاء باستخدام AI</span>
                </button>
            </div>
             <div className="border border-admin-border rounded-lg">
                <RichTextToolbar />
                <textarea
                    name="description"
                    rows={8}
                    value={productDetails.description}
                    onChange={handleChange}
                    className="admin-form-input rounded-t-none border-t-0"
                    placeholder="اكتب وصفاً شاملاً وجذاباً يميز منتجك ويقنع العملاء بالشراء"
                />
            </div>
        </Card>
        <Card title="صور المنتج *">
            <ImageUpload initialImages={getInitialImages()} onImagesChange={setImages} />
        </Card>
      </div>
    );
    
    // Step 2: Variants
    const Step2 = () => (
        <div className="space-y-6 animate-quick-fade-in">
            <Card title="التسعير والمخزون">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="admin-form-label">السعر *</label>
                            <input type="number" name="price" value={pricing.price} onChange={handlePricingChange} className="admin-form-input" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="admin-form-label">السعر قبل الخصم (اختياري)</label>
                            <input type="number" name="compareAtPrice" value={pricing.compareAtPrice} onChange={handlePricingChange} className="admin-form-input" placeholder="0.00" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="admin-form-label">SKU (وحدة حفظ المخزون)</label>
                            <input type="text" name="sku" value={pricing.sku} onChange={handlePricingChange} className="admin-form-input" />
                        </div>
                         <div>
                            <label className="admin-form-label">المخزون</label>
                            <input type="number" name="stock" value={pricing.stock} onChange={handlePricingChange} className="admin-form-input" />
                            <p className="text-xs text-admin-text-secondary mt-1">هذا يُستخدم فقط إذا لم يكن للمنتج متغيرات.</p>
                        </div>
                    </div>
                     <div>
                        <label className="admin-form-label">الوزن (kg)</label>
                        <input type="number" step="0.1" name="weight" value={pricing.weight} onChange={handlePricingChange} className="admin-form-input" />
                    </div>
                </div>
            </Card>
            <Card title="متغيرات المنتج">
                 <VariantManager variants={variants} setVariants={setVariants} />
            </Card>
        </div>
    );

    // Step 3: Organization & SEO
    const Step3 = () => (
        <div className="space-y-6 animate-quick-fade-in">
            <Card title="تنظيم المنتج">
                <div className="space-y-4">
                    <div>
                        <label className="admin-form-label">فئة المنتج</label>
                        <select name="category" value={productDetails.category} onChange={handleChange} className="admin-form-input">
                            <option value="">اختر فئة</option>
                            <option value="women">ملابس نسائية</option>
                            <option value="men">ملابس رجالية</option>
                            <option value="accessories">إكسسوارات</option>
                        </select>
                    </div>
                    <div>
                        <label className="admin-form-label">الوسوم</label>
                        <input type="text" name="tags" value={productDetails.tags} onChange={handleChange} className="admin-form-input" placeholder="مثال: صيف, قطن, رائج" />
                        <p className="text-xs text-admin-text-secondary mt-1">افصل بين الوسوم بفاصلة (,).</p>
                    </div>
                </div>
            </Card>
            <Card title="شارات المنتج (Badges)">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, index) => (
                            <div key={index} className="flex items-center gap-1 bg-admin-bg border border-admin-border rounded-full pl-3 pr-2 py-1 text-sm font-semibold">
                                <span>{badge.text}</span>
                                <button onClick={() => handleRemoveBadge(index)} className="text-admin-text-secondary hover:text-red-500"><XCircleIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-end gap-2 pt-4 border-t border-admin-border">
                        <div className="flex-1">
                            <label className="admin-form-label text-xs">نص الشارة</label>
                            <input type="text" value={newBadge.text} onChange={(e) => setNewBadge(prev => ({ ...prev, text: e.target.value }))} className="admin-form-input" placeholder="مثال: حصرياً" />
                        </div>
                        <div className="flex-1">
                            <label className="admin-form-label text-xs">نوع الستايل</label>
                            <select value={newBadge.type} onChange={(e) => setNewBadge(prev => ({ ...prev, type: e.target.value as Badge['type'] }))} className="admin-form-input">
                                <option value="custom">مخصص (أسود)</option>
                                <option value="sale">تخفيض (أحمر)</option>
                                <option value="new">جديد (أزرق)</option>
                                <option value="trending">رائج (برتقالي)</option>
                                <option value="vip">VIP (بنفسجي)</option>
                            </select>
                        </div>
                        <button onClick={handleAddBadge} type="button" className="bg-admin-accent text-white font-bold py-2.5 px-4 rounded-lg hover:bg-admin-accentHover transition-colors flex-shrink-0">إضافة</button>
                    </div>
                </div>
            </Card>
            <Card title="معاينة قائمة محرك البحث">
                <div className="p-4 bg-admin-bg rounded-lg">
                    <p className="text-blue-700 text-lg font-semibold truncate">{productDetails.seoTitle || productDetails.name || 'عنوان المنتج الجديد'}</p>
                    <p className="text-green-700 text-sm">https://vineta.com/products/{(productDetails.name || 'new-product').toLowerCase().replace(/\s+/g, '-')}</p>
                    <p className="text-admin-text-secondary text-sm mt-1 line-clamp-2">{productDetails.seoDescription || productDetails.description || 'أدخل وصفًا هنا ليظهر في محركات البحث...'}</p>
                </div>
                <div className="space-y-4 mt-4">
                     <div>
                        <div className="flex justify-between items-center">
                           <label className="admin-form-label">عنوان SEO</label>
                           <button type="button" onClick={() => generateAIContent('seoTitle')} disabled={generatingField !== null} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                {generatingField === 'seoTitle' ? <Spinner size="sm" color="text-admin-accent"/> : <SparklesIcon size="sm"/>}
                                <span>إنشاء</span>
                           </button>
                        </div>
                        <input type="text" name="seoTitle" maxLength={70} value={productDetails.seoTitle} onChange={handleChange} className="admin-form-input" />
                        <p className="text-xs text-admin-text-secondary mt-1 text-left">{productDetails.seoTitle.length}/70</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                           <label className="admin-form-label">وصف SEO</label>
                           <button type="button" onClick={() => generateAIContent('seoDescription')} disabled={generatingField !== null} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                {generatingField === 'seoDescription' ? <Spinner size="sm" color="text-admin-accent"/> : <SparklesIcon size="sm"/>}
                                <span>إنشاء</span>
                           </button>
                        </div>
                        <textarea name="seoDescription" maxLength={160} value={productDetails.seoDescription} onChange={handleChange} rows={4} className="admin-form-input" />
                        <p className="text-xs text-admin-text-secondary mt-1 text-left">{productDetails.seoDescription.length}/160</p>
                    </div>
                </div>
            </Card>
        </div>
    );
    
    // Step 4: Display & Discounts
    const Step4 = () => (
        <div className="space-y-6 animate-quick-fade-in">
            <Card title="خيارات العرض المتقدمة">
                <div className="space-y-4">
                    <ToggleSwitch
                        label="تمييز المنتج"
                        description="عرض هذا المنتج بشكل بارز في أقسام 'المميزة' بالصفحة الرئيسية."
                        checked={displaySettings.highlight}
                        onChange={(checked) => setDisplaySettings(prev => ({ ...prev, highlight: checked }))}
                    />
                    <div className="border-t border-admin-border my-4"></div>
                    <ToggleSwitch
                        label="تفعيل الوضع المتقدم"
                        description="إظهار خيارات إضافية للتحكم الدقيق في عرض المنتج."
                        checked={displaySettings.advanced}
                        onChange={(checked) => setDisplaySettings(prev => ({ ...prev, advanced: checked }))}
                    />
                    {displaySettings.advanced && (
                        <div className="space-y-4 pl-6 pt-4 border-r-2 border-admin-accent/50 animate-fade-in">
                            <ToggleSwitch
                                label="إنشاء صفحة هبوط مخصصة"
                                checked={displaySettings.landingPage}
                                onChange={(checked) => setDisplaySettings(prev => ({ ...prev, landingPage: checked }))}
                            />
                            <ToggleSwitch
                                label="إخفاء من الصفحة الرئيسية"
                                checked={displaySettings.hideFromHomepage}
                                onChange={(checked) => setDisplaySettings(prev => ({ ...prev, hideFromHomepage: checked }))}
                            />
                            <div>
                                <label className="admin-form-label">إخفاء عناصر محددة</label>
                                <input
                                    type="text"
                                    value={displaySettings.hiddenElements}
                                    onChange={(e) => setDisplaySettings(prev => ({...prev, hiddenElements: e.target.value}))}
                                    className="admin-form-input"
                                    placeholder=".product-reviews, #size-chart-button"
                                />
                                 <p className="text-xs text-admin-text-secondary mt-1">أدخل محددات CSS (مفصولة بفاصلة) لإخفاء أجزاء من صفحة المنتج.</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <Card title="إعدادات الخصم">
                <div className="space-y-4">
                     <ToggleSwitch
                        label="تفعيل الخصم على المنتج"
                        checked={discountSettings.enabled}
                        onChange={(checked) => setDiscountSettings(prev => ({ ...prev, enabled: checked }))}
                    />
                    {discountSettings.enabled && (
                        <div className="space-y-4 pt-4 animate-fade-in">
                            <div>
                                <label className="admin-form-label">السعر بعد الخصم *</label>
                                <input
                                    type="number"
                                    value={discountSettings.priceAfterDiscount}
                                    onChange={(e) => setDiscountSettings(prev => ({...prev, priceAfterDiscount: e.target.value}))}
                                    className="admin-form-input"
                                    placeholder="199.99"
                                />
                            </div>
                             <div>
                                <label className="admin-form-label">نص ترويجي (اختياري)</label>
                                <input
                                    type="text"
                                    value={discountSettings.promoText}
                                    onChange={(e) => setDiscountSettings(prev => ({...prev, promoText: e.target.value}))}
                                    className="admin-form-input"
                                    placeholder="عرض خاص لفترة محدودة!"
                                />
                            </div>
                            <ToggleSwitch
                                label="عرض مؤقت للعد التنازلي"
                                description="يخلق إحساسًا بالإلحاح. يتطلب تحديد تاريخ انتهاء الصلاحية."
                                checked={discountSettings.countdown}
                                onChange={(checked) => setDiscountSettings(prev => ({ ...prev, countdown: checked }))}
                            />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <Step1 />;
            case 2:
                return <Step2 />;
            case 3:
                return <Step3 />;
            case 4:
                return <Step4 />;
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-admin-text-primary">{isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select name="status" value={productDetails.status} onChange={handleChange} className="admin-form-input text-sm font-semibold">
                        <option value="Draft">مسودة</option>
                        <option value="Published">منشور</option>
                    </select>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'حفظ المنتج'}
                    </button>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
                {renderStepContent()}
            </div>

            <div className="flex justify-between items-center mt-8">
                <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="bg-admin-card-bg border border-admin-border text-admin-text-primary font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                    السابق
                </button>
                <div className="flex items-center gap-2">
                    {[...Array(totalSteps)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${step === i + 1 ? 'bg-admin-accent' : 'bg-admin-border'}`}></div>
                    ))}
                </div>
                <button onClick={() => setStep(s => Math.min(totalSteps, s + 1))} disabled={step === totalSteps} className="bg-admin-accent text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                    التالي
                </button>
            </div>
        </div>
    );
};

export default AddProductPage;
