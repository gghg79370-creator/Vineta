import { Coupon } from '../types';

export const validCoupons: Coupon[] = [
    { code: 'SAVE10', type: 'percentage', value: 10 },
    { code: 'FREESHIP', type: 'fixed', value: 50 } // Assuming 50 is the shipping cost
];