import React, { useState, useEffect } from 'react';
import { Toast as ToastType } from '../../types';
import { CheckCircleIcon, XCircleIcon, CloseIcon } from '../icons';

interface ToastProps {
    toast: ToastType;
    onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const icons = {
        success: <CheckCircleIcon className="text-green-500" />,
        error: <XCircleIcon className="text-red-500" />,
        info: <CheckCircleIcon className="text-blue-500" />,
    };

    const baseClasses = "w-full max-w-sm bg-brand-bg shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out";
    const animationClasses = isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0';

    return (
        <div className={`${baseClasses} ${animationClasses}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icons[toast.type]}
                    </div>
                    <div className="mr-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-brand-text">{toast.message}</p>
                    </div>
                    <div className="mr-auto flex-shrink-0 flex">
                        <button
                            onClick={handleRemove}
                            className="bg-transparent rounded-md inline-flex text-brand-text-light hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Close</span>
                            <CloseIcon size="sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;
