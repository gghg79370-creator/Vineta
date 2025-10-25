import React, { useState } from 'react';
import { ChevronDownIcon } from '../components/icons';
import { Breadcrumb } from '../components/ui/Breadcrumb';

interface FaqPageProps {
    navigateTo: (pageName: string) => void;
}

const FaqPage: React.FC<FaqPageProps> = ({navigateTo}) => {
    const faqData = {
        "معلومات التسوق": [
            { q: "كم من الوقت سيستغرق وصول طلبي؟", a: "تتم معالجة الطلبات وشحنها عادة في غضون 1-3 أيام عمل. ستتلقى رسالة تأكيد عبر البريد الإلكتروني بمجرد شحن طلبك." },
            { q: "هل تقدمون شحنًا مجانيًا؟", a: "نعم، نقدم شحنًا مجانيًا لجميع الطلبات التي تزيد قيمتها عن 500 جنيه مصري." },
            { q: "هل يمكنني تغيير عنوان الشحن بعد تقديم الطلب؟", a: "يرجى الاتصال بنا في أقرب وقت ممكن. إذا لم يتم شحن طلبك بعد، فيمكننا تحديث العنوان." },
        ],
        "معلومات الدفع": [
            { q: "ما هي طرق الدفع التي تقبلونها؟", a: "نقبل جميع بطاقات الائتمان الرئيسية، PayPal، Apple Pay، و Google Pay." },
            { q: "هل معاملاتي آمنة؟", a: "نعم، جميع المعاملات آمنة ومحمية باستخدام تشفير SSL." },
        ],
        "الإرجاع والاستبدال": [
            { q: "ما هي سياسة الإرجاع الخاصة بكم؟", a: "نقبل المرتجعات في غضون 14 يومًا من التسليم. يجب أن تكون المنتجات غير ملبوسة وغير مغسولة، وفي حالتها الأصلية مع جميع البطاقات المرفقة." },
            { q: "كيف أبدأ عملية الإرجاع؟", a: "لبدء عملية الإرجاع، يرجى زيارة صفحة حسابك والانتقال إلى قسم 'طلباتي' أو الاتصال بخدمة العملاء لدينا." },
        ]
    };

    interface AccordionItemProps {
        q: string;
        a: string;
    }

    const AccordionItem: React.FC<AccordionItemProps> = ({ q, a }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="border-b border-brand-border">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-right py-4 font-semibold text-lg text-brand-dark hover:bg-brand-subtle/50 px-2 rounded-md">
                    <span>{q}</span>
                    <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon/></span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="pb-4 pt-2 text-brand-text-light px-2 leading-relaxed">{a}</div>
                    </div>
                </div>
            </div>
        )
    }

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'الأسئلة الشائعة' }
    ];

    return (
        <div className="bg-brand-bg">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="أسئلة متكررة" />
            <div className="container mx-auto px-4 py-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <div className="md:col-span-1">
                        <div className="bg-brand-subtle p-6 rounded-xl text-center sticky top-24">
                            <h2 className="text-2xl font-bold mb-2 text-brand-dark">ألم تجد إجابتك؟</h2>
                            <p className="text-brand-text-light mb-4">إذا كان لديك سؤال يتطلب مساعدة فورية، يمكنك النقر على الزر أدناه للدردشة المباشرة أو الاتصال بنا.</p>
                            <button onClick={() => navigateTo('contact')} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mb-3 transition-transform active:scale-95">
                                اتصل بنا
                            </button>
                            <button className="w-full bg-surface border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle transition-transform active:scale-95">
                                دردش معنا
                            </button>
                        </div>
                     </div>
                     <div className="md:col-span-2 space-y-8">
                        {Object.entries(faqData).map(([category, items]) => (
                            <div key={category}>
                                <h2 className="text-3xl font-extrabold mb-4 text-brand-dark">{category}</h2>
                                <div className="space-y-1">
                                    {items.map((item, index) => <AccordionItem key={index} q={item.q} a={item.a}/>)}
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
    )
}

export default FaqPage;