/**
 * Bulk Actions Component
 * Provides bulk operation capabilities for admin lists
 */

import React from 'react';

interface BulkActionsProps {
  selectedCount: number;
  onDelete?: () => void;
  onExport?: () => void;
  onUpdateStatus?: (status: string) => void;
  onClearSelection?: () => void;
  statusOptions?: Array<{ value: string; label: string }>;
  customActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    className?: string;
  }>;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onExport,
  onUpdateStatus,
  onClearSelection,
  statusOptions,
  customActions,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-admin-accent/10 border border-admin-accent/20 rounded-lg p-4 mb-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="font-bold text-admin-text">
          تم تحديد {selectedCount} عنصر
        </span>
        {onClearSelection && (
          <button
            onClick={onClearSelection}
            className="text-sm text-admin-textLight hover:text-admin-text underline"
          >
            إلغاء التحديد
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Update */}
        {onUpdateStatus && statusOptions && statusOptions.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                onUpdateStatus(e.target.value);
                e.target.value = '';
              }
            }}
            className="admin-form-input py-2 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              تحديث الحالة
            </option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="bg-admin-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-secondary/90 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>تصدير</span>
            </span>
          </button>
        )}

        {/* Custom Actions */}
        {customActions &&
          customActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={
                action.className ||
                'bg-admin-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-primary/90 transition-colors text-sm'
              }
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}

        {/* Delete */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>حذف</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkActions;
