import React from 'react';
import { AdminMessage } from '../../data/adminData';
import { TrashIcon } from '../../../components/icons';

interface MessageDetailViewProps {
    message: AdminMessage | null;
    onDelete: (messageId: number) => void;
}

const MessageDetailView: React.FC<MessageDetailViewProps> = ({ message, onDelete }) => {
    if (!message) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500 p-6">
                <p>اختر رسالة لعرضها.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{message.subject}</h2>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                            {message.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold">{message.name}</p>
                            <p className="text-sm text-gray-500">{message.email}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                     <p className="text-sm text-gray-500">{message.date}</p>
                     <button onClick={() => onDelete(message.id)} className="text-gray-400 hover:text-red-500 mt-2"><TrashIcon size="sm"/></button>
                </div>
            </div>
            <div className="py-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message.message}
            </div>
        </div>
    );
};

export default MessageDetailView;