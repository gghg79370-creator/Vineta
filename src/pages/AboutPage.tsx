import React from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { BrandPromiseSection } from '../components/home/BrandPromiseSection';
import { InstagramSection } from '../components/home/InstagramSection';

interface AboutPageProps {
    navigateTo: (pageName: string) => void;
}

const teamMembers = [
    { name: 'علياء خان', role: 'المؤسس والرئيس التنفيذي', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    { name: 'أحمد المصري', role: 'مدير التسويق', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'فاطمة الزهراء', role: 'كبير المصممين', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
    { name: 'عمر شريف', role: 'رئيس العمليات', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop' },
];

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'من نحن' }
    ];

    return (
        <div className="bg-brand-bg">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="من نحن" />
            
            {/* Hero Image Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="relative h-[60vh] rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop" alt="فريق فينيتا" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-shadow text-center">نصنع الموضة بشغف.</h2>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-2">قصتنا</h3>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-6">رحلة فينيتا</h2>
                        <p className="text-brand-text-light leading-relaxed mb-4">
                            تأسست فينيتا من رحم شغف عميق بالأناقة والجودة. بدأت رحلتنا بفكرة بسيطة: جعل الموضة الراقية في متناول الجميع، مع الحفاظ على الأصالة والإبداع. من ورشة عمل صغيرة، نمونا لنصبح وجهة لكل من يبحث عن التميز والتعبير عن الذات من خلال ملابسه.
                        </p>
                        <p className="text-brand-text-light leading-relaxed">
                            نؤمن بأن كل قطعة ملابس تروي قصة، ونحن هنا لنساعدك على سرد قصتك بأجمل طريقة.
                        </p>
                    </div>
                    <div className="animate-fade-in-up [animation-delay:0.2s]">
                        <img src="https://images.unsplash.com/photo-1551803091-e25622d22263?q=80&w=1974&auto=format&fit=crop" alt="Our Story" className="rounded-2xl shadow-lg w-full h-auto"/>
                    </div>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="bg-brand-subtle py-20">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="text-center md:text-right">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">مهمتنا</h2>
                        <p className="text-brand-text-light leading-relaxed">
                            تمكين الأفراد من التعبير عن هويتهم الفريدة من خلال أزياء عصرية ومستدامة وعالية الجودة. نسعى جاهدين لتقديم تجربة تسوق استثنائية تلهم الثقة والإبداع في كل خطوة.
                        </p>
                    </div>
                     <div className="text-center md:text-right">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">رؤيتنا</h2>
                        <p className="text-brand-text-light leading-relaxed">
                            أن نكون العلامة التجارية الرائدة في عالم الموضة في المنطقة، معروفين بابتكارنا والتزامنا بالاستدامة، وأن نلهم جيلاً جديداً من عشاق الموضة لاحتضان أسلوبهم الخاص بكل فخر.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* Meet the Team Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-12">تعرف على فريقنا</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover"/>
                                </div>
                                <h3 className="font-bold text-lg text-brand-dark">{member.name}</h3>
                                <p className="text-sm text-brand-text-light">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <BrandPromiseSection />
            <InstagramSection />
        </div>
    );
};

export default AboutPage;
