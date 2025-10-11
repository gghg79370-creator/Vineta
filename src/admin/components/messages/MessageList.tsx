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
                    className={`w-full text-right p-4 border-b flex gap-3 items-start
                        ${selectedMessage?.id === message.id ? 'bg-admin-accent/10' : 'hover:bg-gray-50'}`}
                >
                    {!message.isRead && (
                        <div className="w-2.5 h-2.5 bg-admin-accent rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                    <div className={`flex-1 overflow-hidden ${message.isRead ? '' : 'pl-4'}`}>
                        <div className="flex justify-between items-baseline">
                            <p className={`font-bold truncate ${message.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{message.name}</p>
                            <p className="text-xs text-gray-400 flex-shrink-0">{message.date}</p>
                        </div>
                        <p className={`text-sm truncate ${message.isRead ? 'text-gray-500' : 'text-gray-800'}`}>{message.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-1">{message.message}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default MessageList;
