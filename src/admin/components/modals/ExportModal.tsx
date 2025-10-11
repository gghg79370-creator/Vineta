/**
 * Export Modal Component
 * Modal for exporting data in various formats
 */

import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf', options: ExportOptions) => void;
  title?: string;
  dataCount: number;
}

interface ExportOptions {
  includeHeaders: boolean;
  dateRange?: { start: string; end: string };
  selectedFields: string[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  title = 'تصدير البيانات',
  dataCount,
}) => {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'id',
    'name',
    'date',
    'status',
  ]);

  const availableFields = [
    { id: 'id', label: 'المعرف' },
    { id: 'name', label: 'الاسم' },
    { id: 'date', label: 'التاريخ' },
    { id: 'status', label: 'الحالة' },
    { id: 'price', label: 'السعر' },
    { id: 'quantity', label: 'الكمية' },
    { id: 'category', label: 'الفئة' },
  ];

  const handleExport = () => {
    const options: ExportOptions = {
      includeHeaders,
      selectedFields,
      dateRange: dateRange.start && dateRange.end ? dateRange : undefined,
    };
    onExport(format, options);
    onClose();
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-admin-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-admin-textLight hover:text-admin-text"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              سيتم تصدير <strong>{dataCount}</strong> عنصر
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="admin-form-label">صيغة التصدير</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'csv', label: 'CSV', icon: '📄' },
                { value: 'excel', label: 'Excel', icon: '📊' },
                { value: 'pdf', label: 'PDF', icon: '📕' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as 'csv' | 'excel' | 'pdf')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    format === option.value
                      ? 'border-admin-accent bg-admin-accent/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="admin-form-label">نطاق التاريخ (اختياري)</label>
            <div className="flex gap-3">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="admin-form-input"
                placeholder="من"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="admin-form-input"
                placeholder="إلى"
              />
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <label className="admin-form-label">الحقول المطلوب تصديرها</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">تضمين رؤوس الأعمدة</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 font-medium text-admin-textLight hover:text-admin-text rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleExport}
            disabled={selectedFields.length === 0}
            className="px-6 py-2 bg-admin-accent text-white font-bold rounded-lg hover:bg-admin-accentHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تصدير
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
