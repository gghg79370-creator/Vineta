import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '../../../components/icons';

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
}

export const KpiCard = ({ title, value, change, changeType }: KpiCardProps) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm font-bold ${changeColor}`}>
                    {isIncrease ? <ArrowUpIcon size="sm" /> : <ArrowDownIcon size="sm" />}
                    {change}
                </span>
                <span className="text-xs text-gray-500 mr-2">مقارنة بالشهر الماضي</span>
            </div>
        </div>
    );
};
