import React, { useState, useEffect } from 'react';
import { AdminMessage } from '../../data/adminData';
import { TrashIcon, SparklesIcon } from '../../../components/icons';
import { Card } from '../ui/Card';
import Spinner from '../../../components/ui/Spinner';
import { useToast } from '../../../hooks/useToast';
import { GoogleGenAI } from '@google/genai';

interface MessageDetailViewProps {
    message: AdminMessage | null;
    onDelete: (messageId: number) => void;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({ message, onDelete }) => {
    const [replyText, setReplyText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const addToast = useToast();

    useEffect(() => {
        setReplyText('');
    }, [message]);

    if (!message) {
        return (
            <div className="h-full flex items-center justify-center text-admin-text-secondary p-6">
                <p>اختر رسالة لعرضها.</p>
            </div>
        );
    }

    const generateAiReply = async () => {
        if (!message) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `أنت وكيل دعم عملاء متعاون وودود لمتجر أزياء إلكتروني يسمى "Vineta". أرسل عميل الرسالة التالية. قم بصياغة رد احترافي ومتعاطف باللغة العربية.

اسم العميل: ${message.name}
البريد الإلكتروني للعميل: ${message.email}
الموضوع: ${message.subject}
الرسالة: "${message.message}"

قم بصياغة رد يعالج استفسارهم أو قلقهم. كن موجزًا وحافظ على نبرة إيجابية. ابدأ الرد بـ "مرحبًا ${message.name}،".`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setReplyText(response.text);

        } catch (err) {
            console.error("Error generating AI reply:", err);
            addToast('فشل في إنشاء رد الذكاء الاصطناعي.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim()) {
            addToast('لا يمكن أن يكون الرد فارغًا.', 'error');
            return;
        }
        console.log('Sending reply:', replyText);
        addToast('تم إرسال الرد بنجاح!', 'success');
        setReplyText('');
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-admin-border">
                <div>
                    <h2 className="text-xl font-bold text-admin-text-primary">{message.subject}</h2>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-admin-bg rounded-full flex items-center justify-center font-bold text-admin-text-secondary">
                            {message.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold">{message.name}</p>
                            <p className="text-sm text-admin-text-secondary">{message.email}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                     <p className="text-sm text-admin-text-secondary">{message.date}</p>
                     <button onClick={() => onDelete(message.id)} className="text-admin-text-secondary hover:text-red-500 mt-2"><TrashIcon size="sm"/></button>
                </div>
            </div>
            <div className="py-6 text-admin-text-primary leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto">
                {message.message}
            </div>

            <div className="mt-auto pt-6 border-t border-admin-border">
                <Card title="الرد على الرسالة">
                    <div className="space-y-3">
                        <div className="relative">
                             <textarea
                                rows={6}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={isGenerating ? "يقوم مساعد الذكاء الاصطناعي بالكتابة..." : "اكتب ردك هنا..."}
                                className="admin-form-input"
                                disabled={isGenerating}
                            />
                            {isGenerating && (
                                <div className="absolute inset-0 flex items-center justify-center bg-admin-card-bg/50">
                                    <Spinner color="text-admin-accent" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={generateAiReply}
                                disabled={isGenerating}
                                className="flex items-center gap-2 text-sm font-bold text-admin-accent hover:underline disabled:opacity-50"
                            >
                                <SparklesIcon size="sm" />
                                <span>إنشاء باستخدام AI</span>
                            </button>
                            <button
                                onClick={handleSendReply}
                                disabled={isGenerating || !replyText.trim()}
                                className="bg-admin-accent text-white font-bold py-2 px-5 rounded-lg hover:bg-admin-accentHover disabled:opacity-50"
                            >
                                إرسال الرد
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MessageDetailView;