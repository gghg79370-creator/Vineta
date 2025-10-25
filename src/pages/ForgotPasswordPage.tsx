import React, { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { EnvelopeIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';

interface ForgotPasswordPageProps {
    navigateTo: (pageName: string) => void;
}

const ForgotPasswordPage = ({ navigateTo }: ForgotPasswordPageProps) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Mock API call
        setTimeout(() => {
            if (email) {
                 setMessage('إذا كان البريد الإلكتروني موجودًا في نظامنا، فستتلقى رابطًا لإعادة تعيين كلمة المرور قريبًا.');
            }
            setLoading(false);
            // In a real app, you wouldn't clear the email field.
            setEmail('');
        }, 1000);
    };

    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">إعادة تعيين كلمة المرور</h2>
            <p className="text-center text-brand-text-light mb-8">سوف نرسل لك بريدًا إلكترونيًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
            
            {message && (
                <div className="bg-brand-instock/10 border border-brand-instock/50 text-brand-instock px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-brand-text mb-1">البريد الإلكتروني</label>
                    <div className="relative">
                         <EnvelopeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                         <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-brand-border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                            required
                         />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-dark text-brand-bg font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center min-h-[48px]"
                >
                     {loading ? <Spinner /> : 'إرسال رابط إعادة التعيين'}
                </button>
            </form>

            <p className="text-center text-sm text-brand-text-light mt-6">
                تذكرت كلمة المرور؟ <button onClick={() => navigateTo('login')} className="font-bold text-brand-primary hover:underline">العودة لتسجيل الدخول</button>
            </p>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;