import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useAppState } from '../../state/AppState';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, PlusIcon, MinusIcon } from '../icons';

interface FooterProps {
    navigateTo: (pageName: string) => void;
}

const FooterSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="py-4 border-b md:border-none md:p-0">
            <button
                className="w-full flex justify-between items-center md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h4 className="font-bold text-lg text-brand-dark">{title}</h4>
                {isOpen ? <MinusIcon /> : <PlusIcon />}
            </button>
            <h4 className="font-bold text-lg mb-4 text-brand-dark hidden md:block">{title}</h4>
            <div className={`pt-4 md:pt-0 ${isOpen ? 'block animate-fade-in' : 'hidden'} md:block`}>
                {children}
            </div>
        </div>
    );
};


export const Footer = ({ navigateTo }: FooterProps) => {
    const { state: { theme } } = useAppState();
    const [email, setEmail] = useState('');
    const addToast = useToast();

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
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
            
            {/* Main content for Desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-8 py-12 text-right">
                <div className="md:col-span-4">
                     <FooterSection title="اتصل بنا">
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3"><MapPinIcon size="sm" className="mt-1 flex-shrink-0"/><span>شارع ياران، بانشبول، نيو ساوث ويلز 2196، 123 أستراليا</span></li>
                            <li className="flex items-start gap-3"><PhoneIcon size="sm" className="mt-1 flex-shrink-0"/><span>1245 8342 (64)</span></li>
                            <li className="flex items-start gap-3"><EnvelopeIcon size="sm" className="mt-1 flex-shrink-0"/><span>support@example.com</span></li>
                        </ul>
                        <button className="text-sm font-semibold mt-4 hover:text-brand-primary"><u>احصل على الاتجاهات</u></button>
                    </FooterSection>
                </div>
                 <div className="md:col-span-3">
                     <FooterSection title="اشترك في النشرة الإخبارية">
                        <p className="text-sm leading-relaxed mb-4">ندعوك لقراءة آخر الأخبار والعروض والأحداث حول شركتنا. نعدك بعدم إرسال رسائل غير مرغوب فيها إلى بريدك الوارد.</p>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <label htmlFor="newsletter-email-footer" className="sr-only">عنوان البريد الإلكتروني</label>
                            <input 
                                id="newsletter-email-footer"
                                type="email" 
                                placeholder="...أدخل بريدك الإلكتروني" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-full py-3 pr-6 pl-12 focus:outline-none focus:ring-1 focus:ring-brand-dark"
                                required
                            />
                            <button type="submit" aria-label="Subscribe to newsletter" className="absolute top-1/2 -translate-y-1/2 left-1.5 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                            </button>
                        </form>
                    </FooterSection>
                 </div>
                 <div className="md:col-span-2">
                    <FooterSection title="من نحن">
                        <ul className="space-y-3 text-sm">
                            <li><button className="hover:text-brand-primary transition-colors">من نحن</button></li>
                            <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-primary transition-colors">اتصل بنا</button></li>
                            <li><button className="hover:text-brand-primary transition-colors">متجرنا</button></li>
                            <li><button className="hover:text-brand-primary transition-colors">قصتنا</button></li>
                        </ul>
                    </FooterSection>
                </div>
                 <div className="md:col-span-2">
                     <FooterSection title="الموارد">
                        <ul className="space-y-3 text-sm">
                            <li><button className="hover:text-brand-primary transition-colors">سياسة الخصوصية</button></li>
                            <li><button className="hover:text-brand-primary transition-colors">الشروط والأحكام</button></li>
                            <li><button className="hover:text-brand-primary transition-colors">الإرجاع والاسترداد</button></li>
                            <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-primary transition-colors">الأسئلة الشائعة</button></li>
                            <li><button className="hover:text-brand-primary transition-colors">الشحن</button></li>
                        </ul>
                    </FooterSection>
                </div>
            </div>

            {/* Accordion content for Mobile */}
            <div className="md:hidden py-4">
                <FooterSection title="اتصل بنا">
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3"><MapPinIcon size="sm" className="mt-1 flex-shrink-0"/><span>شارع ياران، بانشبول، نيو ساوث ويلز 2196، 123 أستراليا</span></li>
                        <li className="flex items-start gap-3"><PhoneIcon size="sm" className="mt-1 flex-shrink-0"/><span>1245 8342 (64)</span></li>
                        <li className="flex items-start gap-3"><EnvelopeIcon size="sm" className="mt-1 flex-shrink-0"/><span>support@example.com</span></li>
                    </ul>
                    <button className="text-sm font-semibold mt-4 hover:text-brand-primary"><u>احصل على الاتجاهات</u></button>
                </FooterSection>
                <FooterSection title="اشترك في النشرة الإخبارية">
                     <p className="text-sm leading-relaxed mb-4">ندعوك لقراءة آخر الأخبار والعروض والأحداث حول شركتنا. نعدك بعدم إرسال رسائل غير مرغوب فيها إلى بريدك الوارد.</p>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <label htmlFor="newsletter-email-footer-mobile" className="sr-only">عنوان البريد الإلكتروني</label>
                            <input 
                                id="newsletter-email-footer-mobile"
                                type="email" 
                                placeholder="...أدخل بريدك الإلكتروني" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-full py-3 pr-6 pl-12 focus:outline-none focus:ring-1 focus:ring-brand-dark"
                                required
                            />
                            <button type="submit" aria-label="Subscribe to newsletter" className="absolute top-1/2 -translate-y-1/2 left-1.5 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                            </button>
                        </form>
                </FooterSection>
                <FooterSection title="من نحن">
                    <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-brand-primary transition-colors">من نحن</button></li>
                        <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-primary transition-colors">اتصل بنا</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">متجرنا</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">قصتنا</button></li>
                    </ul>
                </FooterSection>
                <FooterSection title="الموارد">
                    <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-brand-primary transition-colors">سياسة الخصوصية</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الشروط والأحكام</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الإرجاع والاسترداد</button></li>
                        <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-primary transition-colors">الأسئلة الشائعة</button></li>
                        <li><button className="hover:text-brand-primary transition-colors">الشحن</button></li>
                    </ul>
                </FooterSection>
            </div>

            {/* Bottom part */}
            <div className="relative border-t">
                 <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="absolute left-4 -top-5 bg-white w-10 h-10 flex items-center justify-center border rounded-md hover:shadow-md transition-shadow" aria-label="العودة إلى الأعلى">
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
                <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
                     <p className="text-sm text-brand-text-light text-center md:text-right">&copy; حقوق النشر {new Date().getFullYear()} بواسطة {theme.siteName}. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/shop-b8098cb155d36b80145a27f6735e2365.svg" alt="Shop Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d42d8f16406132.svg" alt="Mastercard" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e.svg" alt="Google Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/discover-cc9808e5b0c7c7e76db2ac1a4921b489.svg" alt="Discover" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd1.svg" alt="Paypal" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b4f46244f5d6b0f06.svg" alt="Apple Pay" className="h-6"/>
                        <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0f712387d5ee552.svg" alt="Amex" className="h-6"/>
                         <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6b250c543969556ab2033c43.svg" alt="Visa" className="h-6"/>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
};