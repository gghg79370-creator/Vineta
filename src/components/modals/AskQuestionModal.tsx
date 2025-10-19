import React, { useState, useEffect } from 'react';
import { CloseIcon, UserIcon, EnvelopeIcon } from '../icons';
import Spinner from '../ui/Spinner';
import { useToast } from '../../hooks/useToast';

interface AskQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AskQuestionModal = ({ isOpen, onClose }: AskQuestionModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const addToast = useToast();

    // Reset form when modal is opened/closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setName('');
                setEmail('');
                setQuestion('');
                setErrors({});
                setLoading(false);
            }, 300); // Delay reset to allow for closing animation
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'الاسم مطلوب.';
        if (!email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح.';
        }
        if (!question.trim()) newErrors.question = 'السؤال مطلوب.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        // Placeholder submission logic
        console.log("Question Submitted:", { name, email, question });
        setTimeout(() => {
            setLoading(false);
            addToast('تم إرسال سؤالك بنجاح!', 'success');
            onClose();
        }, 1000);
    };
    
    const FormInput = ({ label, id, type = 'text', value, onChange, error, icon, required = false }: any) => (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-brand-text mb-1">
                {label} {required && '*'}
            </label>
            <div className="relative">
                {React.cloneElement(icon, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light"})}
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full border bg-surface rounded-lg py-2.5 pr-10 pl-3 focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500/50' : 'border-brand-border focus:ring-brand-dark/50'}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-bg w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-fade-in-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 flex justify-between items-center border-b border-brand-border flex-shrink-0">
                    <h2 className="font-bold text-lg text-brand-dark">اسأل خبيرًا</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <p className="text-brand-text-light mb-2 text-sm">لديك سؤال حول هذا المنتج؟ املأ النموذج أدناه وسيقوم خبيرنا بالرد عليك في أقرب وقت ممكن.</p>
                    
                    <FormInput label="الاسم" id="question_name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} error={errors.name} icon={<UserIcon/>} required />
                    
                    <FormInput label="البريد الإلكتروني" id="question_email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} error={errors.email} icon={<EnvelopeIcon/>} required />
                    
                    <div>
                        <label htmlFor="question_body" className="block text-sm font-bold text-brand-text mb-1">سؤالك *</label>
                        <textarea
                            id="question_body"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            rows={4}
                            className={`w-full border bg-surface rounded-lg py-2 px-3 focus:outline-none focus:ring-2 ${errors.question ? 'border-red-500 ring-red-500/50' : 'border-brand-border focus:ring-brand-dark/50'}`}
                        ></textarea>
                         {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 min-h-[48px] flex items-center justify-center transition-colors disabled:opacity-50">
                            {loading ? <Spinner /> : 'إرسال السؤال'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
