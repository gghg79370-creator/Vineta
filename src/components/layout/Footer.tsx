
import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';

interface FooterProps {
    navigateTo: (pageName: string) => void;
}

export const Footer = ({ navigateTo }: FooterProps) => {
    const [email, setEmail] = useState('');
    const addToast = useToast();

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
            console.log('Newsletter subscription:', email);
            addToast('شكرًا لاشتراكك!', 'success');
            setEmail('');
        } else {
            addToast('الرجاء إدخال بريد إلكتروني صالح.', 'error');
        }
    };

    return (
    <footer className="bg-brand-dark text-gray-300">
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-center md:text-right">
                
                {/* Column 1: Brand Info */}
                <div className="md:col-span-12 lg:col-span-4">
                    <h3 className="font-serif text-4xl mb-4 text-white">Vineta</h3>
                    <p className="text-sm leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
                        متجر أزياء عصري يقدم أحدث الصيحات والجودة العالية لتعزيز أناقتك اليومية.
                    </p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-brand-primary transition-colors" aria-label="X"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-brand-primary transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-brand-primary transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram text-lg"></i></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-brand-primary transition-colors" aria-label="Youtube"><i className="fa-brands fa-youtube text-lg"></i></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="md:col-span-6 lg:col-span-2">
                    <h4 className="font-bold text-lg mb-5 text-white">روابط سريعة</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => navigateTo('shop')} className="hover:text-brand-primary transition-colors">المتجر</button></li>
                        <li><button onClick={() => navigateTo('wishlist')} className="hover:text-brand-primary transition-colors">قائمة الرغبات</button></li>
                        <li><button onClick={() => navigateTo('compare')} className="hover:text-brand-primary transition-colors">مقارنة</button></li>
                        <li><button onClick={() => navigateTo('account')} className="hover:text-brand-primary transition-colors">حسابي</button></li>
                    </ul>
                </div>

                {/* Column 3: Information */}
                <div className="md:col-span-6 lg:col-span-2">
                    <h4 className="font-bold text-lg mb-5 text-white">معلومات</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => navigateTo('home')} className="hover:text-brand-primary transition-colors">سياسة الخصوصية</button></li>
                        <li><button onClick={() => navigateTo('home')} className="hover:text-brand-primary transition-colors">الشروط والأحكام</button></li>
                        <li><button onClick={() => navigateTo('home')} className="hover:text-brand-primary transition-colors">الإرجاع والاسترداد</button></li>
                        <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-primary transition-colors">الأسئلة الشائعة</button></li>
                        <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-primary transition-colors">اتصل بنا</button></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div className="md:col-span-12 lg:col-span-4">
                    <h4 className="font-bold text-lg mb-5 text-white">اشترك في النشرة الإخبارية</h4>
                    <p className="text-sm leading-relaxed mb-4 max-w-sm mx-auto md:mx-0">
                        كن أول من يعرف عن أحدث الوافدين والعروض الحصرية.
                    </p>
                     <form onSubmit={handleNewsletterSubmit} className="flex mb-4 max-w-sm mx-auto md:mx-0">
                        <input 
                            type="email" 
                            placeholder="عنوان البريد الإلكتروني" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-800 text-white placeholder-gray-500 rounded-r-full py-3 px-4 focus:outline-none w-full text-sm border border-gray-700 focus:border-brand-primary focus:ring-0"
                            required
                        />
                        <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-5 rounded-l-full text-sm hover:opacity-90 transition-opacity">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div className="bg-black py-4">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row-reverse justify-between items-center text-center text-sm text-gray-400 gap-4">
                <p>&copy; {new Date().getFullYear()} Vineta. جميع الحقوق محفوظة.</p>
                <div className="flex gap-2 justify-center flex-wrap">
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/visa.svg?v=1650634288" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/discover.svg?v=1650634288" alt="Discover" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/master.svg?v=1650634288" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/stripe.svg?v=1650634288" alt="Stripe" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/paypal.svg?v=1650634288" alt="Paypal" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/gpay.svg?v=1650634288" alt="Google Pay" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/apple-pay.svg?v=1650634288" alt="Apple Pay" className="h-6 opacity-70 hover:opacity-100 transition-opacity"/>
                </div>
            </div>
        </div>
    </footer>
    );
};
