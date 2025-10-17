import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { CloseIcon, ChevronRightIcon, PlusIcon, MinusIcon } from '../icons';
import { SizeGuideModal } from './SizeGuideModal';

interface QuickViewModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    navigateTo: (pageName: string, data?: Product) => void;
}

export const QuickViewModal = ({ isOpen, product, onClose, addToCart, navigateTo }: QuickViewModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setCurrentImageIndex(0);
            const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
            if (defaultVariant) {
                setSelectedColor(defaultVariant.color);
                setSelectedSize(defaultVariant.size);
            } else {
                setSelectedColor(product.colors[0]);
                setSelectedSize(product.sizes[0]);
            }
            setQuantity(1);
        }
    }, [product]);

    if (!product) return null;

    const images = product.images ?? [product.image];
    const activeImage = images[currentImageIndex];
    const isOutOfStock = product.variants ? product.variants.every(v => v.stock === 0) : product.itemsLeft === 0;

    const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    
    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        const isCurrentSizeAvailable = product.variants?.some(v => v.color === color && v.size === selectedSize && v.stock > 0);
        if (!isCurrentSizeAvailable) {
            const firstAvailableSizeForColor = product.variants?.find(v => v.color === color && v.stock > 0)?.size;
            if (firstAvailableSizeForColor) {
                setSelectedSize(firstAvailableSizeForColor);
            }
        }
    };

    const handleAddToCart = () => {
        addToCart(product, { 
            quantity, 
            selectedSize: selectedSize || product.sizes[0], 
            selectedColor: selectedColor || product.colors[0] 
        });
        onClose();
    };

    const handleBuyNow = () => {
        addToCart(product, { 
            quantity, 
            selectedSize: selectedSize || product.sizes[0], 
            selectedColor: selectedColor || product.colors[0] 
        });
        onClose();
        navigateTo('checkout');
    };
    
    const handleViewDetails = () => {
        navigateTo('product', product);
        onClose();
    }

    return (
        <>
        <div className={`fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center md:justify-center p-0 md:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className={`bg-white w-full max-h-[90vh] md:max-w-4xl rounded-t-2xl md:rounded-2xl shadow-lg flex flex-col md:flex-row transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                <div className="md:w-1/2 relative flex-shrink-0">
                     <img src={activeImage} alt={product.name} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-r-2xl md:rounded-tl-none" />
                     <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                         <button onClick={handlePrevImage} className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"><ChevronRightIcon className="rotate-180" /></button>
                         <button onClick={handleNextImage} className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"><ChevronRightIcon /></button>
                     </div>
                     <button onClick={onClose} className="absolute top-4 right-4 bg-white/50 rounded-full p-2 shadow-md hover:bg-white transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    <h2 className="text-2xl font-bold text-brand-dark">{product.name}</h2>
                    <div className="flex items-baseline gap-3 my-2">
                        <span className="text-2xl font-extrabold text-brand-primary">{product.price} ج.م</span>
                        {product.oldPrice && <span className="text-xl text-brand-text-light line-through">{product.oldPrice} ج.م</span>}
                        {product.oldPrice && <span className="bg-brand-sale text-white text-xs font-bold px-2 py-1 rounded-md">20% OFF</span>}
                    </div>
                    <p className="text-brand-text-light text-sm mb-4 leading-relaxed">{product.description}</p>
                    
                    <div className="mb-4">
                        <p className="font-bold text-brand-dark mb-2">اللون: <span className="font-normal text-brand-text-light">{product.colors.find(c => c === selectedColor)}</span></p>
                         <div className="flex gap-3">
                            {product.colors.map(color => (
                                <button key={color} onClick={() => handleSelectColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-brand-dark' : 'border-transparent'}`} aria-label={`Select color ${color}`}>
                                  <span className="w-6 h-6 rounded-full border border-black/10" style={{backgroundColor: color}}></span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-brand-dark">المقاس:</p>
                            <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-text-light underline hover:text-brand-dark">دليل المقاسات</button>
                        </div>
                         <div className="flex gap-2 flex-wrap">
                            {product.sizes.map(size => {
                                const isAvailable = product.variants?.some(v => v.color === selectedColor && v.size === size && v.stock > 0) ?? !isOutOfStock;
                                return (
                                    <button 
                                        key={size} 
                                        onClick={() => setSelectedSize(size)} 
                                        disabled={!isAvailable} 
                                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors relative ${selectedSize === size ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-brand-border hover:border-brand-dark'} ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {size}
                                        {!isAvailable && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gray-400 transform rotate-[-20deg]"></span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center border rounded-full justify-between w-40 mb-3">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-brand-text-light hover:text-brand-dark"><MinusIcon/></button>
                        <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-brand-text-light hover:text-brand-dark"><PlusIcon/></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                         <button onClick={handleAddToCart} className="w-full bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition h-14">أضف إلى السلة</button>
                         <button onClick={handleBuyNow} className="w-full bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition h-14">اشترِ الآن</button>
                    </div>

                     <button onClick={handleViewDetails} className="w-full text-center text-brand-dark font-bold mt-4">
                        عرض التفاصيل الكاملة &rarr;
                    </button>
                </div>
            </div>
        </div>
        {product && <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} product={product} />}
        </>
    );
};