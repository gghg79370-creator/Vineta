import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { allProducts } from '../../data/products';
import { Product } from '../../types';
import { CloseIcon, PaperAirplaneIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon, UserIcon } from '../icons';
import { ProductCardInChat } from './ProductCardInChat';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    products?: Product[];
}

interface ChatbotProps {
    navigateTo: (pageName: string, data?: any) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activePage: string;
    productContext: Product | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ navigateTo, isOpen, setIsOpen, activePage, productContext }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
    const [showGreeting, setShowGreeting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const greetTimer = setTimeout(() => setShowGreeting(true), 1000);
        return () => clearTimeout(greetTimer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if (isOpen) {
            if (productContext) {
                setSuggestedPrompts([
                    `ما الذي يمكن تنسيقه مع هذا المنتج؟`,
                    'ما هي خامة هذا المنتج؟',
                    'هل هذا المنتج عليه تخفيض؟',
                ]);
            } else if (activePage === 'shop' || activePage === 'search') {
                setSuggestedPrompts([
                    'ساعدني في العثور على ملابس لمناسبة رسمية.',
                    'أرني الأكثر مبيعاً.',
                    'ما الجديد هذا الأسبوع؟',
                ]);
            } else {
                 setSuggestedPrompts([
                    "ما هي أحدث الصيحات؟",
                    "أخبرني عن سياسة الشحن.",
                    "ساعدني في العثور على هدية.",
                ]);
            }
        }
    }, [isOpen, activePage, productContext]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const productList = allProducts.map(p => `- ${p.name} (ID: ${p.id}, الفئة: ${p.category}, السعر: ${p.price} ج.م, الوسوم: [${p.tags.join(', ')}])`).join('\n');
                
                let initialUserMessage = "مرحباً";
                let welcomeMessage = "أهلاً بك في Vineta! أنا Vinnie، مساعدك الشخصي في عالم الموضة. كيف يمكنني أن أجعلك تتألق اليوم؟ ✨";

                if (productContext) {
                    initialUserMessage = `أنا حالياً أنظر إلى منتج: ${productContext.name}.`;
                    welcomeMessage = `أرى أنك مهتم بـ ${productContext.name}! قطعة رائعة. هل لديك أي أسئلة حولها، أو تود بعض النصائح لتنسيقها؟ styling tips or sizing questions? 😊`;
                }

                const systemInstruction = `أنت Vinnie، مساعد أزياء ذكي وودود لمتجر إلكتروني يسمى Vineta. مهمتك هي مساعدة المستخدمين في العثور على المنتجات، وتقديم نصائح حول الأناقة، والإجابة على الأسئلة. كن دائمًا مهذبًا ومتعاونًا ومختصرًا.

معلومات المتجر:
- الشحن: مجاني للطلبات فوق 500 ج.م.
- الإرجاع: مجاني خلال 14 يومًا.

قائمة المنتجات المتاحة:
${productList}

هام جدًا: عندما توصي بمنتج معين موجود في قائمتك، يجب عليك **دائمًا** تغليف اسمه الدقيق بنجمتين مزدوجتين. مثال: \`أنصح بـ **بنطلون مزيج الكتان** لإطلالة صيفية رائعة.\`. لا تفعل هذا مع أسماء الفئات العامة.`;

                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                    history: [{ role: 'user', parts: [{ text: initialUserMessage }] }, { role: 'model', parts: [{ text: welcomeMessage }] }],
                });

                setChat(newChat);
                setMessages([{ sender: 'ai', text: welcomeMessage }]);

            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setMessages([{ sender: 'ai', text: "عذرًا، لا يمكنني المساعدة الآن. يرجى المحاولة مرة أخرى لاحقًا." }]);
            }
        };

        if (isOpen && !chat) {
            initializeChat();
        }
    }, [isOpen, chat, productContext]);

    const handleAiResponse = (responseText: string) => {
        const productRegex = /\*\*(.*?)\*\*/g;
        const productNames = [...responseText.matchAll(productRegex)].map(match => match[1]);
        
        const foundProducts = productNames
            .map(name => allProducts.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase()))
            .filter((p): p is Product => p !== undefined);

        const cleanText = responseText.replace(productRegex, (match, productName) => productName).trim();

        const aiMessage: Message = {
            sender: 'ai',
            text: cleanText,
            products: foundProducts.length > 0 ? foundProducts : undefined,
        };
        setMessages(prev => [...prev, aiMessage]);
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: messageText });
            handleAiResponse(response.text);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { sender: 'ai', text: "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };
    
    const handlePromptClick = (promptText: string) => {
        sendMessage(promptText);
    };

    return (
        <>
            {/* Chat Panel */}
            <div className={`fixed bottom-0 right-0 left-0 md:left-auto md:bottom-8 md:right-8 z-[80] h-[80vh] md:h-[600px] w-full md:w-96 rounded-t-2xl md:rounded-2xl shadow-2xl bg-white flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-[calc(100%+2rem)]'}`}>
                <header className="flex-shrink-0 flex items-center justify-between p-4 bg-brand-dark text-white rounded-t-2xl md:rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-brand-subtle flex items-center justify-center"><SparklesIcon size="sm" className="text-brand-dark" /></div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-instock rounded-full border-2 border-brand-dark"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">مساعد Vineta</h3>
                            <p className="text-xs text-gray-300">متصل الآن</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="إغلاق الدردشة" className="p-2 rounded-full hover:bg-white/10 transition-colors"><CloseIcon /></button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto bg-brand-subtle/50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2.5 animate-chat-bubble-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (<div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0"><SparklesIcon size="sm" className="text-white"/></div>)}
                                <div className={`w-full max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-red-400 to-brand-primary text-white rounded-br-none' : 'bg-white text-brand-dark rounded-bl-none'}`}>
                                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                                    {msg.products && msg.products.map(product => (
                                        <ProductCardInChat 
                                            key={product.id}
                                            product={product} 
                                            onNavigate={() => { navigateTo('product', product); setIsOpen(false); }}
                                        />
                                    ))}
                                </div>
                                {msg.sender === 'user' && (<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><UserIcon size="sm" className="text-gray-600"/></div>)}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-end gap-2.5 justify-start animate-chat-bubble-in">
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0"><SparklesIcon size="sm" className="text-white"/></div>
                                <div className="rounded-2xl p-3 bg-white shadow-sm rounded-bl-none">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-typing-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                 {messages.length <= 1 && !isLoading && (
                    <div className="p-4 border-t border-brand-border bg-white/50">
                        <p className="text-xs text-brand-text-light mb-2 font-semibold">جرب أن تسأل:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedPrompts.map(prompt => (<button key={prompt} onClick={() => handlePromptClick(prompt)} className="bg-white border border-brand-border text-xs px-3 py-1.5 rounded-full hover:bg-brand-subtle font-medium text-brand-dark">{prompt}</button>))}
                        </div>
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="flex-shrink-0 p-3 border-t border-brand-border bg-white rounded-b-2xl md:rounded-b-2xl">
                    <div className="relative">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالة..." className="w-full bg-brand-subtle border-transparent rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" disabled={isLoading} />
                        <button type="submit" className="absolute top-1/2 left-2 -translate-y-1/2 p-2.5 rounded-full bg-brand-dark text-white hover:opacity-90 disabled:opacity-50 disabled:scale-90 transition-all" disabled={isLoading || !input.trim()}><PaperAirplaneIcon size="sm" className="w-5 h-5" /></button>
                    </div>
                </form>
            </div>
            {/* FAB */}
            <div className={`fixed bottom-48 right-4 md:bottom-8 md:right-8 z-[70] transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="relative group">
                    <div className="absolute bottom-full right-0 mb-3 bg-brand-dark text-white text-sm font-semibold py-1.5 px-4 rounded-full rounded-br-none whitespace-nowrap animate-tooltip-fade-in-out opacity-0">
                        أهلاً! كيف أساعدك؟
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 ${showGreeting ? 'animate-fab-greet' : ''}`}
                        aria-label="افتح مساعد الدردشة الذكي"
                    >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-dark animate-fab-pulse"></span>
                        <ChatBubbleOvalLeftEllipsisIcon size="lg" className="relative"/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chatbot;