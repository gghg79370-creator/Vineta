import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useAppState } from '../../state/AppState';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '../icons';

interface FooterProps {
    navigateTo: (pageName: string) => void;
}

export const Footer = ({ navigateTo }: FooterProps) => {
    const { state: { theme } } = useAppState();
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
    <footer className="bg-white text-brand-text border-t">
        <div className="container mx-auto px-4">
            {/* Top part */}
            <div className="flex justify-between items-center py-8 border-b">
                <div className="flex gap-2">
                    <a href="#" className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors" aria-label="X"><i className="fa-brands fa-x-twitter" /></a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
                    <a href="#" className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
                </div>
                <h3 className="font-serif text-4xl font-bold text-brand-dark">{theme.siteName}</h3>
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 text-right">
                {/* LTR placeholder */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="w-10 h-10 bg-brand-dark text-white flex items-center justify-center font-bold text-xs">LTR</div>
                </div>

                {/* Resource */}
                <div className="lg:col-span-2">
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">الموارد</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-brand-primary transition-colors">سياسة الخصوصية</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الشروط والأحكام</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الإرجاع والاسترداد</button></li>
                        <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-primary transition-colors">الأسئلة الشائعة</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الشحن</button></li>
                    </ul>
                </div>

                {/* About Us */}
                <div className="lg:col-span-2">
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">من نحن</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-brand-primary transition-colors">من نحن</button></li>
                        <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-primary transition-colors">اتصل بنا</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">متجرنا</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">قصتنا</button></li>
                    </ul>
                </div>

                {/* Subscribe */}
                <div className="lg:col-span-3">
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">اشترك في النشرة الإخبارية</h4>
                    <p className="text-sm leading-relaxed mb-4">ندعوك لقراءة آخر الأخبار والعروض والأحداث حول شركتنا. نعدك بعدم إرسال رسائل غير مرغوب فيها إلى بريدك الوارد.</p>
                    <form onSubmit={handleNewsletterSubmit} className="relative">
                        <label htmlFor="newsletter-email-footer" className="sr-only">عنوان البريد الإلكتروني</label>
                        <input 
                            id="newsletter-email-footer"
                            type="email" 
                            placeholder="عنوان البريد الإلكتروني" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-1 focus:ring-brand-dark"
                            required
                        />
                        <button type="submit" aria-label="Subscribe to newsletter" className="absolute top-1/2 -translate-y-1/2 right-1.5 bg-brand-dark text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-opacity">
                            <i className="fas fa-arrow-left" aria-hidden="true"></i>
                        </button>
                    </form>
                </div>
                
                {/* Business Contact */}
                <div className="lg:col-span-4">
                     <h4 className="font-bold text-lg mb-4 text-brand-dark">اتصل بنا</h4>
                     <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3"><MapPinIcon size="sm" className="mt-1 flex-shrink-0"/><span>شارع ياران، بانشبول، نيو ساوث ويلز 2196، 123 أستراليا</span></li>
                        <li className="flex items-start gap-3"><PhoneIcon size="sm" className="mt-1 flex-shrink-0"/><span>1245 8342 (64)</span></li>
                        <li className="flex items-start gap-3"><EnvelopeIcon size="sm" className="mt-1 flex-shrink-0"/><span>support@example.com</span></li>
                     </ul>
                     <button className="text-sm font-semibold mt-4 hover:text-brand-primary"><u>احصل على الاتجاهات</u></button>
                </div>
            </div>

            {/* Bottom part */}
            <div className="relative border-t">
                 <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="absolute left-4 -top-5 bg-white w-10 h-10 flex items-center justify-center border rounded-md hover:shadow-md transition-shadow" aria-label="العودة إلى الأعلى">
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
                <div className="flex flex-col md:flex-row-reverse justify-between items-center py-6 gap-4">
                    <div className="flex gap-2 justify-center flex-wrap">
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6b250c543969556ab2033c43.svg" alt="Visa" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/shop-b8098cb155d36b80145a27f6735e2365.svg" alt="Shop Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d42d8f16406132.svg" alt="Mastercard" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e.svg" alt="Google Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/discover-cc9808e5b0c7c7e76db2ac1a4921b489.svg" alt="Discover" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd1.svg" alt="Paypal" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b4f46244f5d6b0f06.svg" alt="Apple Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0f712387d5ee552.svg" alt="Amex" className="h-6"/>
                    </div>
                    <p className="text-sm text-brand-text-light text-center md:text-right">&copy; حقوق النشر {new Date().getFullYear()} بواسطة {theme.siteName}. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </div>
    </footer>
    );
};
