import React, { useState } from 'react';
import { ChevronDownIcon, CloseIcon, HeartIcon, UserIcon, SparklesIcon, SearchIcon } from '../icons';
import { allProducts } from '../../data/products';
import { User } from '../../types';
import { useAppState } from '../../state/AppState';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
    currentUser: User | null;
}

export const MobileMenu = ({ isOpen, setIsOpen, navigateTo, currentUser }: MobileMenuProps) => {
    const { state: { theme } } = useAppState();

     const SubMenu = ({ title, children }: {title: string, children?: React.ReactNode}) => {
        const [isSubOpen, setIsSubOpen] = useState(false);
        return (
            <div className="border-b border-brand-border">
                <button onClick={() => setIsSubOpen(!isSubOpen)} className="w-full flex justify-between items-center py-4 font-bold text-lg">
                    <span>{title}</span>
                    <span className={`transform transition-transform text-brand-text-light ${isSubOpen ? 'rotate-180' : ''}`}><ChevronDownIcon size="sm" /></span>
                </button>
                {isSubOpen && <div className="pr-4 pb-2 space-y-3 text-brand-text-light animate-fade-in">{children}</div>}
            </div>
        )
    }
    
    const handleNavigate = (page: string, data?: any) => {
      navigateTo(page, data);
      setIsOpen(false);
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-sm bg-brand-bg shadow-lg z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex flex-col h-full text-brand-dark">
                     <div className="p-5 text-center border-b border-brand-border relative">
                        <h2 className="font-serif text-4xl font-bold text-brand-dark">{theme.siteName}</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق القائمة" className="absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full hover:bg-brand-subtle"><CloseIcon /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 divide-y divide-brand-border">
                        <SubMenu title="الرئيسية"><button onClick={() => handleNavigate('home')} className="block py-1 hover:text-brand-primary">الرئيسية 1</button></SubMenu>
                        <SubMenu title="المتجر"><button onClick={() => handleNavigate('shop')} className="block py-1 hover:text-brand-primary">قائمة المنتجات</button></SubMenu>
                        <SubMenu title="المنتجات"><button onClick={() => handleNavigate('product', allProducts[0])} className="block py-1 hover:text-brand-primary">منتج بسيط</button></SubMenu>
                        <button onClick={() => handleNavigate('blog')} className="w-full text-right block py-4 font-bold text-lg hover:text-brand-primary">المدونة</button>
                        <button onClick={() => handleNavigate('style-me')} className="w-full flex justify-between items-center py-4 font-bold text-lg text-brand-primary hover:text-opacity-80">
                            <span>المصمم الذكي</span>
                            <SparklesIcon />
                        </button>
                        <SubMenu title="صفحات"><button onClick={() => handleNavigate('faq')} className="block py-1 hover:text-brand-primary">الأسئلة الشائعة</button></SubMenu>
                    </div>
                    <div className="p-6 border-t border-brand-border bg-brand-subtle space-y-6">
                         {currentUser ? (
                            <div className="flex items-center gap-4">
                                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Avatar" className="w-14 h-14 rounded-full border-2 border-brand-primary"/>
                                <div>
                                    <p className="font-bold text-lg text-brand-dark">{currentUser.name}</p>
                                    <button onClick={() => handleNavigate('account')} className="text-sm text-brand-text-light hover:text-brand-dark">عرض الحساب</button>
                                </div>
                            </div>
                         ) : (
                            <button onClick={() => handleNavigate('login')} className="w-full bg-brand-primary text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition-opacity">تسجيل الدخول / إنشاء حساب</button>
                         )}

                         <div className="flex justify-center gap-6 mt-4">
                             <a href="#" className="w-10 h-10 flex items-center justify-center text-brand-text-light hover:text-brand-dark" aria-label="X"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                             <a href="#" className="w-10 h-10 flex items-center justify-center text-brand-text-light hover:text-brand-dark" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                             <a href="#" className="w-10 h-10 flex items-center justify-center text-brand-text-light hover:text-brand-dark" aria-label="Instagram"><i className="fa-brands fa-instagram text-lg"></i></a>
                             <a href="#" className="w-10 h-10 flex items-center justify-center text-brand-text-light hover:text-brand-dark" aria-label="Youtube"><i className="fa-brands fa-youtube text-lg"></i></a>
                         </div>
                    </div>
                 </div>
            </div>
        </>
    )
}
