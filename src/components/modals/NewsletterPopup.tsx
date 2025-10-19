import React, { useState } from 'react';
import { CloseIcon, EnvelopeIcon } from '../icons';
import { useToast } from '../../hooks/useToast';

interface NewsletterPopupProps {
    setShow: (show: boolean) => void;
}

export const NewsletterPopup = ({ setShow }: NewsletterPopupProps) => {
    const [email, setEmail] = useState('');
    const addToast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
            console.log('Popup Newsletter subscription:', email);
            addToast('شكرًا لاشتراكك!', 'success');
            setEmail('');
            setShow(false); // Close popup on success
        } else {
            addToast('الرجاء إدخال بريد إلكتروني صالح.', 'error');
        }
    };

    return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="newsletter-title">
        <div className="bg-brand-bg rounded-2xl max-w-lg w-full shadow-xl overflow-hidden relative animate-fade-in-up">
             <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-brand-dark bg-brand-bg/50 hover:bg-brand-bg rounded-full p-1 z-10"><CloseIcon size="sm"/></button>
             
             <div className="h-64 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1517036324233-1c3cf7b246a4?q=80&w=1974&auto=format&fit=crop')"}}></div>

             <div className="p-8 text-center">
                 <h2 id="newsletter-title" className="text-3xl font-bold mb-2 text-brand-dark">اشترك في نشرتنا</h2>
                 <p className="text-brand-text-light mb-6">كن أول من يعرف عن أحدث الاتجاهات والعروض الترويجية والمزيد!</p>
                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                     <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-brand-text-light">
                            <EnvelopeIcon/>
                        </div>
                        <input 
                            type="email" 
                            aria-label="عنوان بريدك الإلكتروني"
                            placeholder="عنوان بريدك الإلكتروني" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border bg-surface border-brand-border rounded-full py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-brand-dark"/>
                     </div>
                     <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition-colors">إرسال</button>
                 </form>
                 <div className="flex justify-center gap-4 mt-6">
                    <a href="#" aria-label="X"><i className="fa-brands fa-x-twitter text-xl" aria-hidden="true"></i></a>
                    <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-xl" aria-hidden="true"></i></a>
                    <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram text-xl" aria-hidden="true"></i></a>
                    <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube text-xl" aria-hidden="true"></i></a>
                 </div>
                 <p className="text-xs text-brand-text-light mt-4">
                    سيتم استخدامه وفقًا لـ <a href="#" className="font-bold underline">سياسة الخصوصية</a> الخاصة بنا
                 </p>
             </div>
        </div>
    </div>
    );
};
