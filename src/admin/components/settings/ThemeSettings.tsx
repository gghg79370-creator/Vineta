import React, { useState } from 'react';
import { useAppState } from '../../../state/AppState';
import { useToast } from '../../../hooks/useToast';
import { Card } from '../ui/Card';
import { ArrowUpTrayIcon } from '../../../components/icons';

const ThemeSettings: React.FC = () => {
    const { state, dispatch } = useAppState();
    const addToast = useToast();

    const [theme, setTheme] = useState(state.theme);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(state.theme.logoUrl);

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTheme(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleSaveChanges = () => {
        if (logoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newTheme = { ...theme, logoUrl: reader.result as string };
                dispatch({ type: 'SET_THEME', payload: newTheme });
                addToast('تم حفظ إعدادات المظهر بنجاح!', 'success');
            };
            reader.readAsDataURL(logoFile);
        } else {
            const newTheme = { ...theme, logoUrl: logoPreview }; // handles removal
            dispatch({ type: 'SET_THEME', payload: newTheme });
            addToast('تم حفظ إعدادات المظهر بنجاح!', 'success');
        }
    };

    const fontOptions = [
        { name: 'Poppins & Tajawal (Default)', value: "'Poppins', 'Tajawal', sans-serif" },
        { name: 'El Messiri (Serif)', value: "'El Messiri', 'serif'" },
        { name: 'Tajawal only', value: "'Tajawal', sans-serif" }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-900">تخصيص المظهر</h3>
                <p className="text-gray-500 mt-1 text-sm">قم بتخصيص مظهر وشكل متجرك ليتناسب مع علامتك التجارية.</p>
            </div>
            
            <Card title="العلامة التجارية للمتجر">
                <div className="flex items-center gap-6">
                    <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-sm text-gray-500">لا يوجد شعار</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <input type="file" id="logo-upload" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange} className="hidden" />
                        <div className="flex items-center gap-3">
                            <label htmlFor="logo-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                                <ArrowUpTrayIcon size="sm" />
                                <span>تحميل صورة</span>
                            </label>
                            {logoPreview && (
                                <button onClick={handleRemoveLogo} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                                    إزالة
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">مستحسن: PNG بخلفية شفافة, 200x80px.</p>
                    </div>
                </div>
                <div className="pt-6 mt-6 border-t">
                    <label className="admin-form-label">اسم المتجر</label>
                    <p className="text-xs text-gray-500 mb-2">سيظهر هذا الاسم في جميع أنحاء متجرك.</p>
                    <input
                        type="text"
                        name="siteName"
                        value={theme.siteName}
                        onChange={handleThemeChange}
                        className="admin-form-input max-w-sm"
                    />
                </div>
            </Card>

            <Card title="الألوان">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="admin-form-label">اللون الأساسي</label>
                        <p className="text-xs text-gray-500 mb-2">يُستخدم للأزرار، والروابط، والنقاط البارزة.</p>
                        <div className="flex items-center gap-2 border rounded-lg p-2 w-fit">
                            <input type="color" name="primaryColor" value={theme.primaryColor} onChange={handleThemeChange} className="w-8 h-8 rounded border-none cursor-pointer" />
                            <input type="text" name="primaryColor" value={theme.primaryColor} onChange={handleThemeChange} className="font-mono border-0 p-0 focus:ring-0 w-24" />
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="الخطوط">
                 <div>
                    <label className="admin-form-label">الخط الرئيسي</label>
                    <p className="text-xs text-gray-500 mb-2">يطبق على العناوين والنصوص في جميع أنحاء المتجر.</p>
                    <select name="fontFamily" value={theme.fontFamily} onChange={handleThemeChange} className="admin-form-input max-w-sm">
                        {fontOptions.map(font => (
                            <option key={font.value} value={font.value}>{font.name}</option>
                        ))}
                    </select>
                </div>
            </Card>

            <div className="flex justify-end pt-4">
                 <button onClick={handleSaveChanges} className="bg-admin-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-admin-accentHover transition-colors">
                    حفظ التغييرات
                </button>
            </div>
        </div>
    );
};

export default ThemeSettings;
