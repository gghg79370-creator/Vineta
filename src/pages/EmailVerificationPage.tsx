import React, { useState, useRef, useEffect } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';

interface EmailVerificationPageProps {
    navigateTo: (pageName: string) => void;
}

const EmailVerificationPage = ({ navigateTo }: EmailVerificationPageProps) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleResendCode = () => {
        if (resendCooldown === 0) {
            console.log("Resending OTP...");
            setResendCooldown(60);
        }
    };
    
    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
             inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const enteredOtp = otp.join('');
        // Mock OTP verification
        setTimeout(() => {
            if (enteredOtp === '123456') {
                navigateTo('login');
            } else {
                setError('الرمز غير صحيح. يرجى المحاولة مرة أخرى.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <AuthLayout>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-brand-dark mb-2">تحقق من بريدك الإلكتروني</h2>
                <p className="text-brand-text-light mb-8">لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى بريدك الإلكتروني.</p>
                 
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2" dir="ltr">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength={1}
                                    className="w-12 h-14 text-center text-2xl font-bold border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                    ref={el => { inputRefs.current[index] = el; }}
                                />
                            );
                        })}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || otp.join('').length < 6}
                        className="w-full bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? 'جار التحقق...' : 'تحقق'}
                    </button>
                 </form>

                 <div className="mt-6 text-sm">
                    <p className="text-brand-text-light">
                        لم تستلم الرمز؟ 
                        <button 
                            onClick={handleResendCode}
                            disabled={resendCooldown > 0} 
                            className="font-bold text-brand-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed mx-1"
                        >
                            إعادة إرسال
                        </button>
                        {resendCooldown > 0 && <span>(00:{resendCooldown.toString().padStart(2, '0')})</span>}
                    </p>
                 </div>
            </div>
        </AuthLayout>
    );
};

export default EmailVerificationPage;
