import React, { useState } from 'react';
import { User } from '../types';
import { AuthLayout } from '../components/layout/AuthLayout';
import { EnvelopeIcon, LockClosedIcon } from '../components/icons';

interface LoginPageProps {
    navigateTo: (pageName: string) => void;
    onLogin: (user: User) => void;
}

const LoginPage = ({ navigateTo, onLogin }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Mock login logic
        setTimeout(() => {
            if (email === 'user@example.com' && password === 'password123') {
                const mockUser: User = { id: '1', name: 'فينيتا فام', email: 'user@example.com', phone: '01234567890' };
                onLogin(mockUser);
            } else {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">مرحباً بعودتك!</h2>
            <p className="text-center text-brand-text-light mb-8">سجل الدخول للمتابعة.</p>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                    <span className="block sm:inline">{error}</span>
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
                            className="w-full border border-brand-border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                            required
                         />
                    </div>
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
                            className="w-full border border-brand-border rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
                            required
                        />
                    </div>
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
                    className="w-full bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'تسجيل الدخول'
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-brand-text-light mt-6">
                ليس لديك حساب؟ <button onClick={() => navigateTo('register')} className="font-bold text-brand-primary hover:underline">أنشئ حساباً</button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
