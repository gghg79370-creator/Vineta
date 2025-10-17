import { Coupon } from '../types';

export const validCoupons: Coupon[] = [
    { code: 'SAVE10', type: 'percentage', value: 10 },
    { code: 'FREESHIP', type: 'fixed', value: 50 }, // Assuming 50 is the shipping cost
    { code: 'SALE20', type: 'percentage', value: 20 },
    { code: 'EID25', type: 'percentage', value: 25 },
    { code: 'WELCOME', type: 'fixed', value: 100 },
    { code: 'SUMMERFUN', type: 'percentage', value: 15 }
];