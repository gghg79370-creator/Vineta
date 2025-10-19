import React from 'react';
import { CheckIcon } from '../components/icons';

interface OrderConfirmationPageProps {
    navigateTo: (pageName: string) => void;
}

const OrderConfirmationPage = ({ navigateTo }: OrderConfirmationPageProps) => {
    return (
        <div className="bg-brand-bg py-20">
            <div className="container mx-auto px-4 text-center">
                <div className="w-20 h-20 bg-brand-delivered/10 text-brand-delivered mx-auto rounded-full flex items-center justify-center mb-6">
                    <CheckIcon className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-bold text-brand-dark mb-3">شكرًا لك على طلبك!</h1>
                <p className="text-brand-text-light max-w-lg mx-auto mb-8">لقد أرسلنا تأكيد الطلب إلى بريدك الإلكتروني. يمكنك عرض تفاصيل طلبك في صفحة حسابك.</p>
                <div className="flex justify-center items-center gap-4">
                    <button onClick={() => navigateTo('home')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">
                        العودة للتسوق
                    </button>
                    <button onClick={() => navigateTo('account')} className="bg-surface border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle">
                        عرض الطلبات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;