/**
 * Quick Actions Menu Component
 * Floating action button with quick access menu
 */

import React, { useState, useRef, useEffect } from 'react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  color?: string;
}

interface QuickActionsMenuProps {
  actions: QuickAction[];
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mb-2 animate-slideUp">
          <div className="p-2 space-y-1 min-w-[200px]">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-right group"
                style={{ color: action.color || 'inherit' }}
              >
                <div className="flex-shrink-0">{action.icon}</div>
                <span className="flex-1 font-medium text-admin-text group-hover:text-admin-accent">
                  {action.label}
                </span>
                {action.badge !== undefined && action.badge > 0 && (
                  <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-admin-accent hover:bg-admin-accentHover text-white rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-110 relative"
        aria-label="Quick Actions"
      >
        <svg
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        
        {/* Notification Badge */}
        {actions.some(a => a.badge && a.badge > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {actions.reduce((sum, a) => sum + (a.badge || 0), 0)}
          </span>
        )}
      </button>
    </div>
  );
};

export default QuickActionsMenu;
