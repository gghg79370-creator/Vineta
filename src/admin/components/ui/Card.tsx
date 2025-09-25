import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                {actions && <div>{actions}</div>}
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};