import React, { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon } from '../components/icons';

interface RegisterPageProps {
    navigateTo: (pageName: string) => void;
}

const RegisterPage = ({ navigateTo }: RegisterPageProps) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = 'الاسم الكامل مطلوب.';
        if (!formData.email) {
            newErrors.email = 'البريد الإلكتروني مطلوب.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح.';
        }
        if (!formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين.';
        }
        if (!agreedToTerms) {
            newErrors.terms = 'يجب الموافقة على الشروط والأحكام.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        // Mock registration logic
        setTimeout(() => {
            console.log('Registering user:', formData);
            setLoading(false);
            navigateTo('emailVerification');
        }, 1500);
    };
    
    const AuthInput = ({ name, type, placeholder, icon, value, onChange, error }: any) => (
         <div>
            <div className="relative">
                {icon}
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full border ${error ? 'border-red-500' : 'border-brand-border'} rounded-lg py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/50`}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1 mr-1">{error}</p>}
        </div>
    );

    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">إنشاء حساب جديد</h2>
            <p className="text-center text-brand-text-light mb-8">انضم إلينا اليوم!</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 <AuthInput name="fullName" type="text" placeholder="الاسم الكامل" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={<UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />} />
                 <AuthInput name="email" type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} error={errors.email} icon={<EnvelopeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />} />
                 <AuthInput name="phone" type="tel" placeholder="رقم الهاتف (اختياري)" value={formData.phone} onChange={handleChange} error={errors.phone} icon={<PhoneIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />} />
                 <AuthInput name="password" type="password" placeholder="كلمة المرور" value={formData.password} onChange={handleChange} error={errors.password} icon={<LockClosedIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />} />
                 <AuthInput name="confirmPassword" type="password" placeholder="تأكيد كلمة المرور" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<LockClosedIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />} />
                
                <div>
                    <label className="flex items-center gap-2 font-semibold text-sm">
                        <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark" />
                        أوافق على <a href="#" className="underline font-semibold text-brand-primary">الشروط والأحكام</a>
                    </label>
                    {errors.terms && <p className="text-red-500 text-xs mt-1 mr-1">{errors.terms}</p>}
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
                        'إنشاء حساب'
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-brand-text-light mt-6">
                لديك حساب بالفعل؟ <button onClick={() => navigateTo('login')} className="font-bold text-brand-primary hover:underline">تسجيل الدخول</button>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;
