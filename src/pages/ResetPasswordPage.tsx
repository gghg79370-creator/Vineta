import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LockClosedIcon } from '../components/icons';
import { authService } from '../services/authService';

interface ResetPasswordPageProps {
    navigateTo: (pageName: string) => void;
}

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const colors = ['bg-gray-200', 'bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-green-500'];
    const labels = ['ضعيفة جداً', 'ضعيفة', 'ضعيفة', 'متوسطة', 'متوسطة', 'قوية'];

    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-300 ${colors[strength]}`} 
                    style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
            </div>
            <span className="text-xs font-semibold" style={{ color: colors[strength].replace('bg-', '') }}>{labels[strength]}</span>
        </div>
    );
};

const ResetPasswordPage = ({ navigateTo }: ResetPasswordPageProps) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
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
        
        try {
            const { error: updateError } = await authService.updatePassword(password);
            
            if (updateError) {
                setError(updateError);
                setLoading(false);
            } else {
                setSuccess(true);
                setTimeout(() => navigateTo('login'), 2000);
            }
        } catch (err) {
            console.error('Password update error:', err);
            setError('حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.');
            setLoading(false);
        }
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
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
                    className="w-full bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'إعادة تعيين كلمة المرور'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
