import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LockClosedIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';

interface ResetPasswordPageProps {
    navigateTo: (pageName: string) => void;
}

const ResetPasswordPage = ({ navigateTo }: ResetPasswordPageProps) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) {
            setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل.');
            return;
        }
        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigateTo('login'), 2000);
        }, 1000);
    };

    if (success) {
        return (
             <AuthLayout>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">تم بنجاح!</h2>
                    <p className="text-center text-brand-text-light mb-8">تم تحديث كلمة المرور الخاصة بك. سيتم توجيهك الآن إلى صفحة تسجيل الدخول.</p>
                </div>
            </AuthLayout>
        );
    }


    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">تعيين كلمة مرور جديدة</h2>
            <p className="text-center text-brand-text-light mb-8">يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور المستخدمة سابقًا.</p>
            
            {error && (
                <div className="bg-brand-sale/10 border border-brand-sale/50 text-brand-sale px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="password"  className="block text-sm font-bold text-brand-text mb-1">كلمة المرور الجديدة</label>
                    <div className="relative">
                         <LockClosedIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                         <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-brand-border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                            required
                        />
                    </div>
                    <PasswordStrengthIndicator password={password} />
                </div>
                <div>
                    <label htmlFor="confirmPassword"  className="block text-sm font-bold text-brand-text mb-1">تأكيد كلمة المرور الجديدة</label>
                    <div className="relative">
                         <LockClosedIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                         <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? <Spinner /> : 'إعادة تعيين كلمة المرور'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;