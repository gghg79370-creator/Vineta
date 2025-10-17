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

    const maxValue = Math.max(...chartData.map(([, value]) => value), 1);
    const chartHeight = 320;

    const points = chartData.map(([, value], index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = chartHeight - (value / maxValue) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `M0,${chartHeight} ${points} 100,${chartHeight} Z`;
    
    const minWidth = dateRange === 'ytd' ? chartData.length * 60 : chartData.length * 40;


    return (
        <div className="h-80 w-full overflow-x-auto">
            <div className="relative h-full" style={{ minWidth: `${minWidth}px` }}>
                <svg width="100%" height="100%" viewBox="0 0 100 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <polyline
                        fill="none"
                        stroke="var(--admin-accent)"
                        strokeWidth="2"
                        points={points}
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
                <div className="absolute inset-0 flex justify-between">
                     {chartData.map(([label, value], index) => (
                        <div key={index} className="flex-1 group relative flex flex-col justify-end items-center">
                             <div className="absolute bottom-full mb-2 w-max bg-admin-sidebar text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <p className="font-bold">{value.toFixed(2)} ج.م</p>
                                <p className="text-gray-300">{label}</p>
                            </div>
                            <div className="w-px h-full bg-admin-border group-hover:bg-admin-accent"></div>
                            <div className="text-xs text-admin-text-secondary mt-2 whitespace-nowrap">{label}</div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
