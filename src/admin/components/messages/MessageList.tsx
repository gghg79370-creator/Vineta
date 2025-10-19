import React from 'react';
import { AdminMessage } from '../../data/adminData';

interface MessageListProps {
    messages: AdminMessage[];
    selectedMessage: AdminMessage | null;
    onSelectMessage: (message: AdminMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selectedMessage, onSelectMessage }) => {
    return (
        <div className="flex-1 overflow-y-auto admin-sidebar-scrollbar">
            {messages.map(message => (
                <button
                    key={message.id}
                    onClick={() => onSelectMessage(message)}
                    className={`w-full text-right p-4 border-b border-admin-border flex gap-3 items-start
                        ${selectedMessage?.id === message.id ? 'bg-admin-accent/10' : 'hover:bg-admin-bg'}`}
                >
                    {!message.isRead && (
                        <div className="w-2.5 h-2.5 bg-admin-accent rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                    <div className={`flex-1 overflow-hidden ${message.isRead ? '' : 'pl-4'}`}>
                        <div className="flex justify-between items-baseline">
                            <p className={`font-bold truncate ${message.isRead ? 'text-admin-text-primary' : 'text-admin-text-primary'}`}>{message.name}</p>
                            <p className="text-xs text-admin-text-secondary flex-shrink-0">{message.date}</p>
                        </div>
                        <p className={`text-sm truncate ${message.isRead ? 'text-admin-text-secondary' : 'text-admin-text-primary'}`}>{message.subject}</p>
                        <p className="text-xs text-admin-text-secondary truncate mt-1">{message.message}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default MessageList;