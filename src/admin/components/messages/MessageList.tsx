import React from 'react';
import { AdminMessage } from '../../data/adminData';

interface MessageListProps {
    messages: AdminMessage[];
    selectedMessage: AdminMessage | null;
    onSelectMessage: (message: AdminMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selectedMessage, onSelectMessage }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map(message => (
                <button
                    key={message.id}
                    onClick={() => onSelectMessage(message)}
                    className={`w-full text-right p-4 border-b flex gap-3 items-start
                        ${selectedMessage?.id === message.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                >
                    {!message.isRead && (
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 overflow-hidden">
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
