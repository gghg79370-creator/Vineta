import { Order } from '../types';
import { allProducts } from './products';

export const ordersData: Order[] = [
    {
        id: '#12345',
        date: '15 May 2025',
        status: 'Delivered',
        total: '720.00',
        items: [
            { ...allProducts[0], quantity: 2, variant: 'White / L' },
            { ...allProducts[1], quantity: 2, variant: 'White / L' },
            { ...allProducts[2], quantity: 2, variant: 'White / L' },
        ],
        estimatedDelivery: '18 May 2025',
        trackingHistory: [
            { status: 'تم الطلب', date: '15 May 2025', location: 'القاهرة, مصر' },
            { status: 'تم الشحن', date: '16 May 2025', location: 'مستودع القاهرة' },
            { status: 'قيد التوصيل', date: '18 May 2025', location: 'الجيزة, مصر' },
            { status: 'تم التوصيل', date: '18 May 2025', location: 'الجيزة, مصر' },
        ]
    },
    {
        id: '#23154',
        date: '16 May 2025',
        status: 'Cancelled',
        total: '460.00',
        items: [
            { ...allProducts[3], quantity: 1, variant: 'S' },
            { ...allProducts[4], quantity: 1, variant: 'M' },
        ],
        trackingHistory: [
            { status: 'تم الطلب', date: '16 May 2025', location: 'القاهرة, مصر' },
            { status: 'تم إلغاء الطلب', date: '17 May 2025' },
        ]
    },
    {
        id: '#12467',
        date: '17 May 2025',
        status: 'On the way',
        total: '920.00',
        items: [
           { ...allProducts[5], quantity: 3, variant: 'XL' },
           { ...allProducts[6], quantity: 2, variant: 'L' },
           { ...allProducts[7], quantity: 1, variant: 'S' },
        ],
        estimatedDelivery: '20 May 2025',
        trackingHistory: [
            { status: 'تم الطلب', date: '17 May 2025', location: 'الإسكندرية, مصر' },
            { status: 'تم الشحن', date: '18 May 2025', location: 'مستودع الإسكندرية' },
            { status: 'قيد التوصيل', date: '19 May 2025', location: 'مركز فرز طنطا' },
        ]
    },
];