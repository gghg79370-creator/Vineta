
import React, { useState } from 'react';
import { StarIcon } from '../icons';
import { Review } from '../../types';

interface ReviewsSectionProps {
    reviews: Review[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const ratingSummary: {[key: string]: number} = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    reviews.forEach(review => {
        ratingSummary[review.rating.toString()]++;
    });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

    const renderStars = (currentRating: number, interactive = false, setRatingFn = (r: number) => {}, setHoverRatingFn = (r: number) => {}) => {
        const ratingToShow = hoverRating > 0 && interactive ? hoverRating : currentRating;
        return (
            <div className={`flex ${interactive ? 'cursor-pointer' : ''}`} onMouseLeave={() => interactive && setHoverRatingFn(0)}>
                {[...Array(5)].map((_, i) => (
                    <button 
                        key={i} 
                        onMouseEnter={() => interactive && setHoverRatingFn(i + 1)} 
                        onClick={() => interactive && setRatingFn(i + 1)} 
                        aria-label={`Rate ${i + 1} stars`}
                        className="transform hover:scale-110 transition-transform"
                    >
                        <StarIcon className={`w-5 h-5 ${i < ratingToShow ? 'text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="py-16 bg-white" id="reviews">
            <div className="container mx-auto px-4">
                <div className="border-t pt-10">
                    <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
                        <div className="w-full md:w-1/3">
                            <h3 className="text-2xl font-bold mb-2">تقييم العملاء</h3>
                            {totalReviews > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        {renderStars(averageRating)}
                                        <span className="font-bold text-brand-dark text-lg">{averageRating.toFixed(1)}/5.0</span>
                                    </div>
                                    <p className="text-brand-text-light mb-4 text-sm">بناءً على {totalReviews} تقييمًا</p>
                                    <div className="space-y-1.5">
                                        {Object.entries(ratingSummary).reverse().map(([star, count]) => (
                                            <div key={star} className="flex items-center gap-2 text-sm">
                                                <span className="font-semibold flex items-center">{star} <StarIcon className="w-4 h-4 text-yellow-400 mr-1" /></span>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 flex-1">
                                                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}></div>
                                                </div>
                                                <span className="w-6 text-right text-brand-text-light">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-brand-text-light mb-4 text-sm">لا توجد تقييمات بعد.</p>
                            )}
                             <button onClick={() => setShowWriteReview(true)} className="mt-6 bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 w-full md:w-auto">اكتب تقييمًا</button>
                        </div>
                        <div className="w-full md:w-2/3">
                            <div className="space-y-8">
                                {reviews.length > 0 ? reviews.map(review => (
                                    <div key={review.id} className="border-b pb-8 last:border-b-0 last:pb-0">
                                        <div className="flex items-start gap-4 mb-3">
                                            <img src={review.image} alt={review.author} className="w-12 h-12 rounded-full" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                    <p className="font-bold text-brand-dark">{review.author}</p>
                                                    <p className="text-sm text-brand-text-light">{review.date}</p>
                                                  </div>
                                                  <div className="flex-shrink-0">{renderStars(review.rating)}</div>
                                                </div>
                                                <p className="text-brand-text leading-relaxed mt-2">{review.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500">كن أول من يكتب تقييماً لهذا المنتج.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {showWriteReview && (
                     <div className="border-t pt-10 mt-10">
                        <h3 className="text-2xl font-bold mb-2">اكتب تقييمًا</h3>
                        <p className="text-sm text-brand-text-light mb-6">لن يتم نشر عنوان بريدك الإلكتروني. الحقول المطلوبة معلمة بـ *</p>
                        <form className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <label className="font-semibold text-brand-dark">تقييمك *</label>
                                {renderStars(rating, true, setRating, setHoverRating)}
                            </div>
                            <div>
                                <input type="text" placeholder="الاسم *" className="w-full border border-brand-border p-3 rounded-lg focus:ring-1 focus:ring-brand-dark/50 focus:border-brand-dark outline-none" />
                            </div>
                             <div>
                                <input type="email" placeholder="البريد الإلكتروني *" className="w-full border border-brand-border p-3 rounded-lg focus:ring-1 focus:ring-brand-dark/50 focus:border-brand-dark outline-none" />
                            </div>
                             <div>
                                <textarea placeholder="تقييمك *" rows={5} className="w-full border border-brand-border p-3 rounded-lg focus:ring-1 focus:ring-brand-dark/50 focus:border-brand-dark outline-none"></textarea>
                            </div>
                             <div className="flex items-center gap-3">
                                <input type="checkbox" id="save_info" className="w-4 h-4 rounded text-brand-dark focus:ring-brand-dark" />
                                <label htmlFor="save_info" className="text-sm text-brand-text-light">احفظ اسمي والبريد الإلكتروني والموقع الإلكتروني في هذا المتصفح للمرة التالية التي أعلق فيها.</label>
                            </div>
                            <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">إرسال</button>
                        </form>
                     </div>
                )}
            </div>
        </div>
    );
};
