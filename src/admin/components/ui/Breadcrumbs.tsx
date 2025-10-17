import React from 'react';
import { ChevronLeftIcon } from '../../../components/icons';

interface BreadcrumbItem {
    page: string;
    label: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    onNavigate: (page: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 space-x-reverse">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.page} className="inline-flex items-center">
                            {isLast ? (
                                <span className="text-sm font-bold text-gray-800">{item.label}</span>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onNavigate(item.page)}
                                        className="inline-flex items-center text-sm font-medium text-admin-textMuted hover:text-admin-accent"
                                    >
                                        {item.label}
                                    </button>
                                    <ChevronLeftIcon size="sm" className="w-4 h-4 text-gray-400 mx-1" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};