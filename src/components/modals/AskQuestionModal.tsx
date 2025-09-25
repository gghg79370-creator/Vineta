import React from 'react';
import { CloseIcon, UserIcon, EnvelopeIcon } from '../icons';

interface AskQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AskQuestionModal = ({ isOpen, onClose }: AskQuestionModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg text-brand-dark">اطرح سؤالاً</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <div className="p-6">
                    <p className="text-brand-text-light mb-6 text-sm">لديك سؤال حول هذا المنتج؟ املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت ممكن.</p>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="question_name" className="block text-sm font-bold mb-1">الاسم</label>
                            <div className="relative">
                                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                                <input type="text" id="question_name" className="w-full border border-brand-border rounded-lg py-2 pr-10 pl-3" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="question_email" className="block text-sm font-bold mb-1">البريد الإلكتروني</label>
                             <div className="relative">
                                <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
                                <input type="email" id="question_email" className="w-full border border-brand-border rounded-lg py-2 pr-10 pl-3" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="question_body" className="block text-sm font-bold mb-1">سؤالك</label>
                            <textarea id="question_body" rows={4} className="w-full border border-brand-border rounded-lg py-2 px-3"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">إرسال سؤال</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
