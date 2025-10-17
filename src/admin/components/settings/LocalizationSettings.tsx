import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';

const LocalizationSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        language: 'العربية',
        country: 'مصر',
        currency: 'EGP'
    });
    const addToast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        console.log("Saving localization settings:", settings);
        addToast('تم حفظ إعدادات اللغة والمنطقة بنجاح!', 'success');
    };

    return (
        <div className="space-y-8">
            <div>
                 <h3 className="text-xl font-bold text-gray-900">اللغة والمنطقة</h3>
                 <p className="text-gray-500 mt-1 text-sm">إدارة لغة متجرك وعملته ومنطقته.</p>
            </div>
            <div className="space-y-6 max-w-md">
                <div>
                    <label className="admin-form-label">لغة المتجر</label>
                    <select name="language" value={settings.language} onChange={handleChange} className="admin-form-input">
                        <option>العربية</option>
                        <option>English</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">اللغة الافتراضية لواجهة متجرك.</p>
                </div>
                <div>
                    <label className="admin-form-label">البلد/المنطقة</label>
                     <select name="country" value={settings.country} onChange={handleChange} className="admin-form-input">
                        <option>مصر</option>
                        <option>United States</option>
                        <option>United Arab Emirates</option>
                        <option>Saudi Arabia</option>
                    </select>
                </div>
                <div>
                    <label className="admin-form-label">العملة</label>
                     <select name="currency" value={settings.currency} onChange={handleChange} className="admin-form-input">
                        <option value="EGP">جنيه مصري (EGP)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="AED">UAE Dirham (AED)</option>
                        <option value="SAR">Saudi Riyal (SAR)</option>
                    </select>
                </div>
            </div>
            <div className="pt-6 mt-6 border-t">
                 <button onClick={handleSaveChanges} className="bg-admin-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-admin-accentHover transition-colors">
                    حفظ التغييرات
                </button>
            </div>
        </div>
    );
};

export default LocalizationSettings;