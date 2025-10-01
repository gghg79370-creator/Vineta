import React, { useState } from 'react';
import { ChevronDownIcon, CloseIcon, HeartIcon, UserIcon, SparklesIcon } from '../icons';
import { allProducts } from '../../data/products';
import { User } from '../../types';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
    currentUser: User | null;
}

export const MobileMenu = ({ isOpen, setIsOpen, navigateTo, currentUser }: MobileMenuProps) => {
     const SubMenu = ({ title, children }: {title: string, children?: React.ReactNode}) => {
        const [isSubOpen, setIsSubOpen] = useState(false);
        return (
            <div>
                <button onClick={() => setIsSubOpen(!isSubOpen)} className="w-full flex justify-between items-center py-3 font-bold text-lg">
                    <span>{title}</span>
                    <span className={`transform transition-transform ${isSubOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
                </button>
                {isSubOpen && <div className="pr-4 space-y-2 text-brand-text-light">{children}</div>}
            </div>
        )
    }
    
    const handleNavigate = (page: string, data?: any) => {
      navigateTo(page, data);
      setIsOpen(false);
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-sm bg-white shadow-lg z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex flex-col h-full">
                     <div className="p-6 flex justify-end items-center border-b">
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق القائمة"><CloseIcon /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 divide-y">
                        <SubMenu title="الرئيسية"><button onClick={() => handleNavigate('home')} className="block py-1">الرئيسية 1</button></SubMenu>
                        <SubMenu title="المتجر"><button onClick={() => handleNavigate('shop')} className="block py-1">قائمة المنتجات</button></SubMenu>
                        <SubMenu title="المنتجات"><button onClick={() => handleNavigate('product', allProducts[0])} className="block py-1">منتج بسيط</button></SubMenu>
                        <button onClick={() => handleNavigate('blog')} className="w-full text-right block py-3 font-bold text-lg">المدونة</button>
                        <button onClick={() => handleNavigate('style-me')} className="w-full flex justify-between items-center py-3 font-bold text-lg text-brand-primary">
                            <span>المصمم الذكي</span>
                            <SparklesIcon />
                        </button>
                        <SubMenu title="صفحات"><button onClick={() => handleNavigate('faq')} className="block py-1">الأسئلة الشائعة</button></SubMenu>
                    </div>
                    <div className="p-6 border-t space-y-4">
                         <div className="flex items-center gap-4">
                            <button onClick={() => handleNavigate('wishlist')} className="flex-1 bg-brand-subtle py-2 rounded-md font-semibold flex items-center justify-center gap-2"><HeartIcon size="sm"/> قائمة الرغبات</button>
                            <button onClick={() => handleNavigate(currentUser ? 'account' : 'login')} className="flex-1 bg-brand-subtle py-2 rounded-md font-semibold flex items-center justify-center gap-2"><UserIcon size="sm"/> {currentUser ? 'حسابي' : 'تسجيل الدخول'}</button>
                         </div>
                         <div className="text-sm text-brand-text-light">
                             <p><strong>العنوان:</strong> 123 شارع ياران، بانشبول، 2196، أستراليا</p>
                             <p><strong>البريد الإلكتروني:</strong> clientcare@ecom.com</p>
                             <p><strong>الهاتف:</strong> 1.888.838.3022</p>
                         </div>
                    </div>
                 </div>
            </div>
        </>
    )
}
