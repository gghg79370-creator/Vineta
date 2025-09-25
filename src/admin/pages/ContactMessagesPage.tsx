import React, { useState } from 'react';
import { AdminMessage, allAdminMessages } from '../data/adminData';
import MessageList from '../components/messages/MessageList';
import MessageDetailView from '../components/messages/MessageDetailView';

const ContactMessagesPage: React.FC = () => {
    const [messages, setMessages] = useState(allAdminMessages);
    const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(messages[0] || null);

    const handleSelectMessage = (message: AdminMessage) => {
        setSelectedMessage(message);
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
    };

    return (
        <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">الرسائل</h1>
                <p className="text-gray-500 mt-1">عرض الرسائل الواردة من نموذج الاتصال.</p>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                <div className="md:col-span-1 bg-white rounded-lg shadow-sm border flex flex-col overflow-hidden">
                    <div className="p-4 border-b">
                        <input
                            type="search"
                            placeholder="بحث في الرسائل..."
                            className="w-full border-gray-300 rounded-lg"
                        />
                    </div>
                    <MessageList
                        messages={messages}
                        selectedMessage={selectedMessage}
                        onSelectMessage={handleSelectMessage}
                    />
                </div>
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm border overflow-y-auto">
                    <MessageDetailView message={selectedMessage} />
                </div>
            </div>
        </div>
    );
};

export default ContactMessagesPage;
