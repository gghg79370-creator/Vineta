import { CartItem } from '../types';
import { allProducts } from './products';

export const cartItemsData: CartItem[] = [
    { ...allProducts[7], quantity: 1, selectedSize: 'L', selectedColor: '#ffffff' },
    { ...allProducts[0], quantity: 1, selectedSize: 'M', selectedColor: '#e2e2e2' },
];
