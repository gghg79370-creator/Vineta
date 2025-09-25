import React from 'react';

interface PieChartProps {
    data: { name: string; value: number }[];
}

const CategoryPieChart: React.FC<PieChartProps> = ({ data }) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let cumulativePercent = 0;
    const gradients = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const start = cumulativePercent;
        cumulativePercent += percent;
        const end = cumulativePercent;
        return `${colors[index % colors.length]} ${start}% ${end}%`;
    });

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div
                className="w-48 h-48 rounded-full relative"
                style={{
                    background: `conic-gradient(${gradients.join(', ')})`,
                }}
            >
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xs text-gray-500">إجمالي المبيعات</p>
                        <p className="font-bold text-xl">{total.toFixed(2)} ج.م</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full space-y-2">
                {data.map((item, index) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value.toFixed(2)} ج.م</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPieChart;