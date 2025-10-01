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
    const iconColor = isIncrease ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-admin-border">
            <div className="flex justify-between items-start">
                <p className="text-base font-bold text-gray-600">{title}</p>
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-4">{value}</p>
            <div className="flex items-center mt-1">
                <span className={`flex items-center text-sm font-bold ${changeColor}`}>
                    {isIncrease ? <ArrowUpIcon size="sm" /> : <ArrowDownIcon size="sm" />}
                    {change}
                </span>
                <span className="text-xs text-gray-500 mr-2">مقارنة بالشهر الماضي</span>
            </div>
        </div>
    );
};