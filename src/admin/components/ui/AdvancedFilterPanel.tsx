/**
 * Advanced Filter Panel Component
 * Collapsible filter panel with multiple filter types
 */

import React, { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'search' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface AdvancedFilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
  onApply: () => void;
  isCollapsed?: boolean;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  values,
  onChange,
  onReset,
  onApply,
  isCollapsed: initialCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const hasActiveFilters = Object.values(values).some(
    (value) => value !== '' && value !== null && value !== undefined && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-admin-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-bold text-admin-text">الفلاتر المتقدمة</span>
          {hasActiveFilters && (
            <span className="bg-admin-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              نشط
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-admin-textLight transition-transform ${
            isCollapsed ? '' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="admin-form-label">{filter.label}</label>
                {filter.type === 'select' && (
                  <select
                    value={values[filter.id] || ''}
                    onChange={(e) => onChange(filter.id, e.target.value)}
                    className="admin-form-input"
                  >
                    <option value="">الكل</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'search' && (
                  <input
                    type="text"
                    value={values[filter.id] || ''}
                    onChange={(e) => onChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder || 'بحث...'}
                    className="admin-form-input"
                  />
                )}

                {filter.type === 'daterange' && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={values[`${filter.id}_start`] || ''}
                      onChange={(e) =>
                        onChange(`${filter.id}_start`, e.target.value)
                      }
                      className="admin-form-input"
                    />
                    <input
                      type="date"
                      value={values[`${filter.id}_end`] || ''}
                      onChange={(e) =>
                        onChange(`${filter.id}_end`, e.target.value)
                      }
                      className="admin-form-input"
                    />
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min || 0}
                      max={filter.max || 100}
                      value={values[filter.id] || filter.min || 0}
                      onChange={(e) =>
                        onChange(filter.id, parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-admin-textLight text-center">
                      {values[filter.id] || filter.min || 0}
                    </div>
                  </div>
                )}

                {filter.type === 'multiselect' && (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {filter.options?.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={(values[filter.id] || []).includes(
                            option.value
                          )}
                          onChange={(e) => {
                            const current = values[filter.id] || [];
                            const newValue = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v: string) => v !== option.value);
                            onChange(filter.id, newValue);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onReset}
              className="text-admin-textLight hover:text-admin-text font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إعادة تعيين
            </button>
            <button
              onClick={onApply}
              className="bg-admin-accent text-white font-bold px-6 py-2 rounded-lg hover:bg-admin-accentHover transition-colors"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterPanel;
