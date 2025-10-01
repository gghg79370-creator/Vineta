import { SaleCampaign } from '../types';

export const saleCampaignsData: SaleCampaign[] = [
    {
        id: 1,
        title: 'استخدم الرمز الترويجي عند الدفع للحصول على الخصم',
        subtitle: 'عرض حصري لفترة محدودة',
        discountText: 'خصم 50%',
        couponCode: 'SAVE50',
        buttonText: 'تسوق الآن',
        image: 'https://images.unsplash.com/photo-1574281358313-946a3375a5a1?q=80&w=1974&auto.format&fit=crop',
        saleEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        page: 'shop',
        status: 'Active',
    },
];