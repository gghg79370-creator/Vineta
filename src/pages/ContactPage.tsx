import React from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EnvelopeIcon } from '../components/icons';

interface ContactPageProps {
    navigateTo: (pageName: string) => void;
}

const ContactPage = ({ navigateTo }: ContactPageProps) => {

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
                        <div className="bg-white p-8 rounded-lg shadow-md">
                             <form className="space-y-4">
                                <input type="text" placeholder="الاسم" className="w-full border p-3 rounded-lg" />
                                <input type="email" placeholder="البريد الإلكتروني" className="w-full border p-3 rounded-lg" />
                                <input type="text" placeholder="الموضوع" className="w-full border p-3 rounded-lg" />
                                <textarea placeholder="رسالتك" rows={5} className="w-full border p-3 rounded-lg"></textarea>
                                <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">إرسال رسالة</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
