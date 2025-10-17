import React, { useState, useEffect } from 'react';
import { AdminTeamMember } from '../../data/adminData';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { email: string; role: AdminTeamMember['role'] }) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onSave }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<AdminTeamMember['role']>('Support');

    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setRole('Support');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
            onSave({ email, role });
        } else {
            alert('الرجاء إدخال بريد إلكتروني صالح.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">دعوة عضو جديد</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="admin-form-label">البريد الإلكتروني</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="admin-form-input"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="admin-form-label">الدور</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value as AdminTeamMember['role'])}
                            className="admin-form-input"
                        >
                            <option value="Support">دعم</option>
                            <option value="Editor">محرر</option>
                            <option value="Administrator">مسؤول</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50">إلغاء</button>
                    <button onClick={handleSave} className="bg-admin-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-accentHover">إرسال دعوة</button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;