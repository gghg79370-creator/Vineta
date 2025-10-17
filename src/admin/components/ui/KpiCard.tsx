import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '../../../components/icons';

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, icon }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-admin-card-bg p-5 rounded-xl border border-admin-border" style={{ boxShadow: 'var(--admin-shadow)' }}>
            <div className="flex justify-between items-start">
                <p className="text-base font-bold text-admin-text-secondary">{title}</p>
                 <div className="p-2 rounded-lg bg-admin-accent-light text-admin-accent">
                    {icon}
                </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-admin-text-primary mt-4">{value}</p>
            <div className="flex items-center mt-1">
                <span className={`flex items-center text-sm font-bold ${changeColor}`}>
                    {isIncrease ? <ArrowUpIcon size="sm" /> : <ArrowDownIcon size="sm" />}
                    {change}
                </span>
                <span className="text-xs text-admin-text-secondary mr-2">مقارنة بالشهر الماضي</span>
            </div>
        </div>
    );
};