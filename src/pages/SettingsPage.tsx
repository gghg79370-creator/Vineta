import React, { useState } from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { ThemeState } from '../types';

interface SettingsPageProps {
    navigateTo: (pageName: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ navigateTo }) => {
    const { state, dispatch } = useAppState();
    const addToast = useToast();
    
    const defaultTheme: ThemeState = {
        primaryColor: '#ff6f61',
        fontFamily: "'Poppins', 'Tajawal', sans-serif",
        logoUrl: state.theme.logoUrl,
        siteName: state.theme.siteName,
        chatbotWelcomeMessage: state.theme.chatbotWelcomeMessage,
    };

    const [theme, setTheme] = useState<ThemeState>(state.theme);

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTheme(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        dispatch({ type: 'SET_THEME', payload: theme });
        addToast('تم حفظ الإعدادات بنجاح!', 'success');
    };
    
    const handleReset = () => {
        setTheme(defaultTheme);
        dispatch({ type: 'SET_THEME', payload: defaultTheme });
        addToast('تمت إعادة تعيين الإعدادات إلى الوضع الافتراضي.', 'info');
    };

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'حسابي', page: 'account' },
        { label: 'إعدادات المظهر' }
    ];

    const fontOptions = [
        { name: 'Poppins & Tajawal (افتراضي)', value: "'Poppins', 'Tajawal', sans-serif" },
        { name: 'El Messiri (سيريف)', value: "'El Messiri', 'serif'" },
        { name: 'Tajawal فقط', value: "'Tajawal', sans-serif" }
    ];

    return (
        <div className="bg-brand-subtle">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="إعدادات المظهر" />
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="bg-surface p-8 rounded-lg shadow-sm border border-brand-border space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark mb-2">تخصيص المظهر</h2>
                        <p className="text-brand-text-light text-sm">قم بتخصيص شكل ومظهر متجرك ليتناسب مع علامتك التجارية.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-brand-text mb-2">اللون الأساسي</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={theme.primaryColor}
                                        onChange={handleThemeChange}
                                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                    />
                                    <div
                                        className="w-full h-full rounded-lg border border-brand-border"
                                        style={{ backgroundColor: theme.primaryColor }}
                                    ></div>
                                </div>
                                <input
                                    type="text"
                                    name="primaryColor"
                                    value={theme.primaryColor}
                                    onChange={handleThemeChange}
                                    className="w-full border p-3 rounded-lg border-brand-border bg-surface"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-text mb-2">الخط الرئيسي</label>
                            <select
                                name="fontFamily"
                                value={theme.fontFamily}
                                onChange={handleThemeChange}
                                className="w-full border p-3 rounded-lg border-brand-border bg-surface"
                            >
                                {fontOptions.map(font => (
                                    <option key={font.value} value={font.value}>{font.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row justify-end gap-4">
                        <button onClick={handleReset} className="bg-surface border border-brand-border text-brand-dark font-bold py-3 px-6 rounded-full hover:bg-brand-subtle">
                            إعادة تعيين
                        </button>
                        <button onClick={handleSaveChanges} className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;