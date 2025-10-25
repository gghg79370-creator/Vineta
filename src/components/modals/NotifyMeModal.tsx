
import React, { useState, useEffect } from 'react';
import { CloseIcon, EnvelopeIcon, SparklesIcon } from '../icons';
import { useToast } from '../../hooks/useToast';
import Spinner from '../ui/Spinner';

interface NotifyMeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: (email: string) => void;
    productName: string;
    variantName?: string;
    initialEmail?: string;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({ isOpen, onClose, onSubscribe, productName, variantName, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const addToast = useToast();

    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail);
            setError('');
        }
    }, [isOpen, initialEmail]);

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('الرجاء إدخال بريد إلكتروني صالح.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            onSubscribe(email);
            setIsLoading(false);
            addToast('تم تسجيلك بنجاح! سنعلمك عندما يتوفر المنتج.', 'success');
            onClose();
        }, 1000); // Simulate API call
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-bg w-full max-w-md rounded-2xl shadow-lg transform transition-all duration-300 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b border-brand-border">
                    <h2 className="font-bold text-lg text-brand-dark">أعلمني عند التوفر</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-brand-text-light text-sm">
                        سيتم إعلامك عند توفر <strong>{productName}</strong> {variantName && `(${variantName})`} مرة أخرى.
                    </p>
                    <div>
                        <label htmlFor="notify_email" className="block text-sm font-bold text-brand-text mb-1">البريد الإلكتروني *</label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                            <input
                                type="email"
                                id="notify_email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className={`w-full border bg-surface rounded-lg py-2.5 pr-10 pl-3 focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500/50' : 'border-brand-border focus:ring-brand-dark/50'}`}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="pt-2">
                        <button type="submit" disabled={isLoading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 min-h-[48px] flex items-center justify-center transition-colors disabled:opacity-50">
                            {isLoading ? <Spinner /> : 'الاشتراك في الإشعارات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
