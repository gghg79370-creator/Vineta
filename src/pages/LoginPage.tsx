

import React, { useState } from 'react';
import { User } from '../types';
import { AuthLayout } from '../components/layout/AuthLayout';
import { EnvelopeIcon, LockClosedIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../hooks/useToast';

interface LoginPageProps {
    navigateTo: (pageName: string) => void;
    onLogin: (user: User) => void;
}

const LoginPage = ({ navigateTo, onLogin }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const addToast = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        const currentErrors: { [key: string]: string } = {};
        if (!email) currentErrors.email = "البريد الإلكتروني مطلوب.";
        if (!password) currentErrors.password = "كلمة المرور مطلوبة.";

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        setLoading(true);

        // Mock login logic
        setTimeout(() => {
            if (email === 'user@example.com' && password === 'password123') {
                // FIX: Added missing `paymentMethods` property to satisfy the User type.
                const mockUser: User = { 
                    id: '1', 
                    name: 'فينيتا فام', 
                    email: 'user@example.com', 
                    phone: '01234567890', 
                    addresses: [
                         { id: 1, type: 'الشحن', name: 'المنزل', recipientName: 'فينيتا فام', street: '123 شارع ياران', city: 'القاهرة', postalCode: '11511', country: 'مصر', isDefault: true }
                    ],
                    paymentMethods: [
                        { id: 1, cardType: 'visa', last4: '4242', expiryMonth: '12', expiryYear: '2025', isDefault: true }
                    ] 
                };
                onLogin(mockUser);
                addToast(`👋 مرحباً بعودتك، ${mockUser.name}!`, 'success');
            } else {
                setErrors({ general: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">مرحباً بعودتك!</h2>
            <p className="text-center text-brand-text-light mb-8">سجل الدخول للمتابعة.</p>
            
            {errors.general && (
                <div className="bg-brand-sale/10 border border-brand-sale/50 text-brand-sale px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                    <span className="block sm:inline">{errors.general}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-brand-text mb-1">البريد الإلكتروني</label>
                    <div className="relative">
                         <EnvelopeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                         <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 ${errors.email ? 'border-brand-sale ring-brand-sale/50' : 'border-brand-border focus:ring-brand-dark/50'}`}
                            required
                         />
                    </div>
                    {errors.email && <p className="text-brand-sale text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-bold text-brand-text mb-1">كلمة المرور</label>
                    <div className="relative">
                         <LockClosedIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                         <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 ${errors.password ? 'border-brand-sale ring-brand-sale/50' : 'border-brand-border focus:ring-brand-dark/50'}`}
                            required
                        />
                    </div>
                     {errors.password && <p className="text-brand-sale text-xs mt-1">{errors.password}</p>}
                </div>
                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 font-semibold">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark" />
                        تذكرني
                    </label>
                    <button type="button" onClick={() => navigateTo('forgotPassword')} className="font-semibold text-brand-primary hover:underline">
                        هل نسيت كلمة المرور؟
                    </button>
                </div>
                 <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-dark text-brand-bg font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform disabled:opacity-50 flex items-center justify-center min-h-[48px] active:scale-98"
                >
                    {loading ? <Spinner /> : 'تسجيل الدخول'}
                </button>
            </form>

            <p className="text-center text-sm text-brand-text-light mt-6">
                ليس لديك حساب؟ <button onClick={() => navigateTo('register')} className="font-bold text-brand-primary hover:underline">أنشئ حساباً</button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;