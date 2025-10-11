
import React from 'react';

interface BreadcrumbItem {
    label: string;
    page?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    navigateTo: (pageName: string, data?: any) => void;
    title: string;
}

export const Breadcrumb = ({ items, navigateTo, title }: BreadcrumbProps) => (
    <div className="text-center py-10 mb-8 bg-transparent">
        <h1 className="text-4xl font-bold text-brand-dark mb-3">{title}</h1>
        <nav aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center text-brand-text-light text-base">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.page ? (
                            <button onClick={() => navigateTo(item.page)} className="hover:text-brand-primary">
                                {item.label}
                            </button>
                        ) : (
                            <span className="text-brand-text font-semibold">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="mx-3 text-brand-border">•</span>}
                    </li>
                ))}
            </ol>
        </nav>
    </div>
);
