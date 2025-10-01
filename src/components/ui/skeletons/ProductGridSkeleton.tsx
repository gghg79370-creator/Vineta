import React from 'react';
import { ProductCardSkeleton } from '../ProductCardSkeleton';

const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export default ProductGridSkeleton;
