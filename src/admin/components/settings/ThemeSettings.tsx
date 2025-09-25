import React from 'react';

const ThemeSettings: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold">ألوان العلامة التجارية</h3>
                <p className="text-sm text-gray-500">قم بتخصيص الألوان لتتناسب مع علامتك التجارية.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اللون الأساسي</label>
                    <div className="flex items-center gap-2 border rounded-lg p-2">
                        <input type="color" defaultValue="#D94A56" className="w-8 h-8 rounded" />
                        <span className="font-mono">#D94A56</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">لون النص الداكن</label>
                    <div className="flex items-center gap-2 border rounded-lg p-2">
                        <input type="color" defaultValue="#1a1a1a" className="w-8 h-8 rounded" />
                        <span className="font-mono">#1a1a1a</span>
                    </div>
                </div>
            </div>
             <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500">
                حفظ التغييرات
            </button>
        </div>
    );
};

export default ThemeSettings;