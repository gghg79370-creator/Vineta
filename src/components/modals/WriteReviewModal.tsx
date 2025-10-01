import React, { useState } from 'react';
import { CloseIcon, StarIcon, UserIcon, EnvelopeIcon, ArrowUpTrayIcon } from '../icons';
import { useToast } from '../../hooks/useToast';
import Spinner from '../ui/Spinner';

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose, productName }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const addToast = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (rating === 0) newErrors.rating = 'الرجاء تحديد تقييم.';
        if (!name.trim()) newErrors.name = 'الاسم مطلوب.';
        if (!email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح.';
        }
        if (!reviewText.trim()) newErrors.reviewText = 'نص التقييم مطلوب.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            addToast('شكرًا لك! تقييمك في انتظار المراجعة.', 'success');
            onClose();
        }, 1500);
    };

    const renderStars = () => {
        const ratingToShow = hoverRating > 0 ? hoverRating : rating;
        return (
            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                {[...Array(5)].map((_, i) => (
                    <button 
                        key={i}
                        type="button"
                        onMouseEnter={() => setHoverRating(i + 1)} 
                        onClick={() => setRating(i + 1)} 
                        aria-label={`Rate ${i + 1} stars`}
                        className="transform hover:scale-110 transition-transform"
                    >
                        <StarIcon className={`w-7 h-7 ${i < ratingToShow ? 'text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-fade-in-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b flex-shrink-0">
                    <h2 className="font-bold text-lg text-brand-dark">اكتب تقييمًا لـ "{productName}"</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                     <div>
                        <label className="block text-sm font-bold mb-2">تقييمك *</label>
                        {renderStars()}
                        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="review_name" className="block text-sm font-bold mb-1">الاسم *</label>
                            <div className="relative">
                                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                                <input type="text" id="review_name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-brand-border rounded-lg py-2 pr-10 pl-3" />
                            </div>
                             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                         <div>
                            <label htmlFor="review_email" className="block text-sm font-bold mb-1">البريد الإلكتروني *</label>
                             <div className="relative">
                                <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                                <input type="email" id="review_email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-brand-border rounded-lg py-2 pr-10 pl-3" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="review_body" className="block text-sm font-bold mb-1">تقييمك *</label>
                        <textarea id="review_body" value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} className="w-full border border-brand-border rounded-lg py-2 px-3"></textarea>
                        {errors.reviewText && <p className="text-red-500 text-xs mt-1">{errors.reviewText}</p>}
                    </div>
                    <div>
                         <label htmlFor="review_image" className="block text-sm font-bold mb-2">إضافة صورة (اختياري)</label>
                         <div className="flex items-center gap-4">
                            <label htmlFor="review_image" className="cursor-pointer bg-brand-subtle border border-brand-border rounded-lg py-2 px-4 text-sm font-semibold hover:bg-brand-border flex items-center gap-2">
                                <ArrowUpTrayIcon size="sm" />
                                <span>اختر صورة</span>
                            </label>
                            <input type="file" id="review_image" accept="image/*" onChange={handleImageChange} className="hidden" />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />}
                         </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 flex items-center justify-center min-h-[48px]">
                        {isLoading ? <Spinner /> : 'إرسال التقييم'}
                    </button>
                </form>
            </div>
        </div>
    );
};