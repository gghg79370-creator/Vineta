import React from 'react';

const LocalizationSettings: React.FC = () => {
    return (
        <div className="space-y-6 max-w-lg">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">لغة المتجر</label>
                <select className="w-full border-gray-300 rounded-lg">
                    <option>العربية</option>
                    <option>English</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">اللغة الافتراضية لواجهة متجرك.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البلد/المنطقة</label>
                 <select className="w-full border-gray-300 rounded-lg">
                    <option>مصر</option>
                    <option>United States</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العملة</label>
                 <select className="w-full border-gray-300 rounded-lg">
                    <option>جنيه مصري (EGP)</option>
                    <option>US Dollar (USD)</option>
                </select>
            </div>
            <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500">
                حفظ التغييرات
            </button>
        </div>
    );
};

export default LocalizationSettings;
