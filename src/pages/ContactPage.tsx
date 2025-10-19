import React, { useState } from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EnvelopeIcon } from '../components/icons';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';

interface ContactPageProps {
    navigateTo: (pageName: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ navigateTo }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const addToast = useToast();
    
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب.';
        if (!formData.email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح.';
        }
        if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب.';
        if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            console.log('Contact form submitted:', formData);
            addToast('تم إرسال رسالتك بنجاح!', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'اتصل بنا' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="اتصل بنا" />
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">ابقى على تواصل</h2>
                        <p className="text-brand-text-light mb-8">نحن نحب أن نسمع منك. املأ النموذج أدناه وسيقوم فريقنا بالرد عليك في غضون 24 ساعة.</p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-brand-subtle p-3 rounded-full"><EnvelopeIcon /></div>
                                <div>
                                    <h3 className="font-bold">البريد الإلكتروني</h3>
                                    <p className="text-brand-text-light">clientcare@ecom.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-brand-subtle p-3 rounded-full"><EnvelopeIcon /></div>
                                <div>
                                    <h3 className="font-bold">الهاتف</h3>
                                    <p className="text-brand-text-light">1.888.838.3022</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="bg-brand-subtle p-3 rounded-full"><EnvelopeIcon /></div>
                                <div>
                                    <h3 className="font-bold">العنوان</h3>
                                    <p className="text-brand-text-light">123 شارع ياران، بانشبول، 2196، أستراليا</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div>
                        <div className="bg-surface p-8 rounded-lg shadow-md border border-brand-border">
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className={`w-full border p-3 rounded-lg bg-surface ${errors.name ? 'border-red-500' : 'border-brand-border'}`} required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className={`w-full border p-3 rounded-lg bg-surface ${errors.email ? 'border-red-500' : 'border-brand-border'}`} required />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="الموضوع" className={`w-full border p-3 rounded-lg bg-surface ${errors.subject ? 'border-red-500' : 'border-brand-border'}`} required />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="رسالتك" rows={5} className={`w-full border p-3 rounded-lg bg-surface ${errors.message ? 'border-red-500' : 'border-brand-border'}`} required></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 flex items-center justify-center min-h-[48px]">
                                    {loading ? <Spinner /> : 'إرسال رسالة'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;