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
            <div className="h-full flex items-center justify-center text-admin-text-secondary p-6">
                <p>اختر رسالة لعرضها.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
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
            <div className="py-6 text-admin-text-primary leading-relaxed whitespace-pre-wrap">
                {message.message}
            </div>
        </div>
    );
};

export default MessageDetailView;