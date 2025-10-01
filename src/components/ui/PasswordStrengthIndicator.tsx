import React from 'react';

interface PasswordStrengthIndicatorProps {
    password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
    const getStrength = () => {
        let score = 0;
        if (!password) return 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const barColors = ['bg-gray-200', 'bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-green-500'];
    const textColors = ['text-gray-400', 'text-red-500', 'text-red-500', 'text-yellow-500', 'text-yellow-500', 'text-green-500'];
    const labels = ['فارغ', 'ضعيفة', 'ضعيفة', 'متوسطة', 'متوسطة', 'قوية'];
    
    if (!password) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-300 ${barColors[strength]}`} 
                    style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
            </div>
            <span className={`text-xs font-semibold ${textColors[strength]}`}>{labels[strength]}</span>
        </div>
    );
};

export default PasswordStrengthIndicator;