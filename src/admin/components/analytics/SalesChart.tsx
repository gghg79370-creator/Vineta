import React from 'react';
import { AdminOrder } from '../../data/adminData';

type DateRange = '7d' | '30d' | '90d' | 'ytd';

interface SalesChartProps {
    orders: AdminOrder[];
    dateRange: DateRange;
}

const SalesChart: React.FC<SalesChartProps> = ({ orders, dateRange }) => {

    const chartData = React.useMemo(() => {
        const data: { [key: string]: number } = {};
        const now = new Date();
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateRange === 'ytd') {
            const months = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), i, 1).toLocaleString('default', { month: 'short' }));
            months.forEach(m => data[m] = 0);

            orders.forEach(order => {
                const month = new Date(order.date).toLocaleString('default', { month: 'short' });
                data[month] += parseFloat(order.total);
            });
            
        } else {
            const days = parseInt(dateRange.replace('d', ''), 10);
             for (let i = 0; i < days; i++) {
                const date = new Date(endDate);
                date.setDate(endDate.getDate() - i);
                const day = date.toLocaleDateString('ar-EG-u-nu-latn', { day: '2-digit', month: 'short' });
                data[day] = 0;
            }

            orders.forEach(order => {
                const day = new Date(order.date).toLocaleDateString('ar-EG-u-nu-latn', { day: '2-digit', month: 'short' });
                 if (data.hasOwnProperty(day)) {
                    data[day] += parseFloat(order.total);
                }
            });
        }
        
        return Object.entries(data).reverse();
    }, [orders, dateRange]);

    const maxValue = Math.max(...chartData.map(([, value]) => value));

    return (
        <div className="h-80 w-full flex items-end gap-2 pr-10 pt-4">
            {chartData.map(([label, value], index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {value.toFixed(2)} ج.م
                    </div>
                    <div
                        className="w-full bg-primary-200 rounded-t-md hover:bg-primary-400 transition-colors"
                        style={{ height: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                    />
                    <div className="text-xs text-gray-500 text-center">{label}</div>
                </div>
            ))}
        </div>
    );
};

export default SalesChart;