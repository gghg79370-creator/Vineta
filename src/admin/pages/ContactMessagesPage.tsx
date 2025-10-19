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

    const handleDeleteMessage = (messageId: number) => {
        const remainingMessages = messages.filter(m => m.id !== messageId);
        setMessages(remainingMessages);
        if (selectedMessage?.id === messageId) {
            setSelectedMessage(remainingMessages.length > 0 ? remainingMessages[0] : null);
        }
    };

    return (
        <div className="bg-admin-card-bg rounded-xl shadow-sm border h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
                <div className="md:col-span-1 border-l border-admin-border flex flex-col overflow-hidden">
                    <div className="p-4 border-b">
                        <input
                            type="search"
                            placeholder="بحث في الرسائل..."
                            className="admin-form-input"
                        />
                    </div>
                    <MessageList
                        messages={messages}
                        selectedMessage={selectedMessage}
                        onSelectMessage={handleSelectMessage}
                    />
                </div>
                <div className="md:col-span-2 overflow-y-auto">
                    <MessageDetailView message={selectedMessage} onDelete={handleDeleteMessage} />
                </div>
            </div>
        </div>
    );
};

export default ContactMessagesPage;