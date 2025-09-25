import React, { useState } from 'react';
import { ChevronDownIcon } from '../components/icons';
import { Breadcrumb } from '../components/ui/Breadcrumb';

interface FaqPageProps {
    navigateTo: (pageName: string) => void;
}

const FaqPage = ({navigateTo}: FaqPageProps) => {
    const faqData = {
        "معلومات التسوق": [
            { q: "كم من الوقت سيستغرق وصول طلبي؟", a: "تتم معالجة الطلبات وشحنها عادة في غضون 1-3 أيام عمل. ستتلقى رسالة تأكيد عبر البريد الإلكتروني بمجرد شحن طلبك." },
            { q: "هل تقدمون شحنًا مجانيًا؟", a: "نعم، نقدم شحنًا مجانيًا لجميع الطلبات التي تزيد قيمتها عن 500 جنيه مصري." },
            { q: "هل يمكنني تغيير عنوان الشحن بعد تقديم الطلب؟", a: "يرجى الاتصال بنا في أقرب وقت ممكن. إذا لم يتم شحن طلبك بعد، فيمكننا تحديث العنوان." },
        ],
        "معلومات الدفع": [
            { q: "ما هي طرق الدفع التي تقبلونها؟", a: "نقبل جميع بطاقات الائتمان الرئيسية، PayPal، Apple Pay، و Google Pay." },
            { q: "هل معاملاتي آمنة؟", a: "نعم، جميع المعاملات آمنة ومحمية." },
        ],
        "الإرجاع والاستبدال": [
            { q: "ما هي سياسة الإرجاع الخاصة بكم؟", a: "نقبل المرتجعات في غضون 14 يومًا من التسليم. يجب أن تكون المنتجات غير ملبوسة وغير مغسولة، وفي حالتها الأصلية." },
        ]
    };

    interface AccordionItemProps {
        q: string;
        a: string;
    }

    const AccordionItem: React.FC<AccordionItemProps> = ({ q, a }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="border-b">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-right py-4 font-semibold">
                    <span>{q}</span>
                    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon/></span>
                </button>
                {isOpen && <div className="pb-4 text-brand-text-light">{a}</div>}
            </div>
        )
    }

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'الأسئلة الشائعة' }
    ];

    return (
        <div className="bg-white py-8">
            <div className="container mx-auto px-4">
                 <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="أسئلة متكررة" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <div className="md:col-span-1">
                        <div className="bg-brand-subtle p-6 rounded-lg text-center">
                            <h2 className="text-2xl font-bold mb-2">اتصل بنا</h2>
                            <p className="text-brand-text-light mb-4">إذا كان لديك سؤال يتطلب مساعدة فورية، يمكنك النقر على الزر أدناه للدردشة المباشرة.</p>
                            <button className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mb-3">اتصل بنا</button>
                            <button className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle">دردش معنا</button>
                        </div>
                     </div>
                     <div className="md:col-span-2 space-y-8">
                        {Object.entries(faqData).map(([category, items]) => (
                            <div key={category}>
                                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                                <div className="space-y-2">
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
