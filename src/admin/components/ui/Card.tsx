
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions, icon }) => {
    return (
        <div className="bg-admin-card-bg rounded-xl border border-admin-border" style={{ boxShadow: 'var(--admin-shadow)' }}>
            {title && (
                <div className="p-4 md:p-5 border-b border-admin-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-admin-text-secondary">{icon}</div>}
                        <h2 className="text-base font-bold text-admin-text-primary">{title}</h2>
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className="p-4 md:p-5">
                {children}
            </div>
        </div>
    );
};
