import React from 'react';

interface FooterProps {
    navigateTo: (pageName: string) => void;
}

export const Footer = ({ navigateTo }: FooterProps) => (
    <footer className="bg-white text-brand-text border-t">
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-3xl mb-4 text-brand-dark">Vineta</h3>
                    <p className="text-sm leading-relaxed max-w-sm mb-4">اشترك في نشرتنا الإخبارية للحصول على أحدث الصفقات والعروض وإشعارات الخصم.</p>
                     <form className="flex mb-4">
                        <input type="email" placeholder="بريدك الإلكتروني" className="bg-white text-brand-dark placeholder-brand-text-light rounded-r-md py-3 px-4 focus:outline-none w-full text-sm border border-brand-border focus:ring-1 focus:ring-brand-dark"/>
                        <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-l-md text-sm hover:bg-opacity-90">اشترك</button>
                    </form>
                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-brand-text-light hover:text-brand-dark" aria-label="X"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                        <a href="#" className="text-brand-text-light hover:text-brand-dark" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                        <a href="#" className="text-brand-text-light hover:text-brand-dark" aria-label="Instagram"><i className="fa-brands fa-instagram text-lg"></i></a>
                        <a href="#" className="text-brand-text-light hover:text-brand-dark" aria-label="Youtube"><i className="fa-brands fa-youtube text-lg"></i></a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">حولنا</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => navigateTo('home')} className="hover:text-brand-primary">من نحن</button></li>
                        <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-primary">اتصل بنا</button></li>
                        <li><button onClick={() => navigateTo('faq')} className="hover:text-brand-primary">الأسئلة الشائعة</button></li>
                        <li><button onClick={() => navigateTo('home')} className="hover:text-brand-primary">الشروط والأحكام</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">المصدر</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => navigateTo('account')} className="hover:text-brand-primary">حسابي</button></li>
                        <li><button onClick={() => navigateTo('cart')} className="hover:text-brand-primary">تتبع الطلب</button></li>
                        <li><button onClick={() => navigateTo('wishlist')} className="hover:text-brand-primary">قائمة الرغبات</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 text-brand-dark">بيانات الاتصال</h4>
                    <ul className="space-y-3 text-sm">
                        <li><p>4517 شارع واشنطن، مانشستر، كنتاكي 39495</p></li>
                        <li><p>(541) 954-2231</p></li>
                        <li><p>support@vineta.com</p></li>
                         <li><button onClick={() => {}} className="font-bold hover:text-brand-primary">احصل على الاتجاهات</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="bg-white py-4 border-t">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center text-sm text-brand-text-light">
                <p>&copy; {new Date().getFullYear()} Vineta. جميع الحقوق محفوظة.</p>
                <div className="flex gap-1.5 mt-2 sm:mt-0">
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/visa.svg?v=1650634288" alt="Visa" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/discover.svg?v=1650634288" alt="Discover" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/master.svg?v=1650634288" alt="Mastercard" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/stripe.svg?v=1650634288" alt="Stripe" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/paypal.svg?v=1650634288" alt="Paypal" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/gpay.svg?v=1650634288" alt="Google Pay" className="h-6"/>
                    <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/apple-pay.svg?v=1650634288" alt="Apple Pay" className="h-6"/>
                </div>
            </div>
        </div>
    </footer>
);