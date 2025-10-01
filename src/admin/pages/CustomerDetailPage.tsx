import React, { useState, useEffect } from 'react';
import { AdminCustomer, AdminOrder, AdminCustomerNote } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { OrderListTable } from '../components/orders/OrderListTable';
import { EnvelopeIcon, PhoneIcon, XCircleIcon, PlusIcon } from '../../components/icons';

interface CustomerDetailPageProps {
    customer: AdminCustomer;
    orders: AdminOrder[];
    navigate: (page: string, data?: any) => void;
    onSave: (customer: AdminCustomer) => void;
}

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer, orders, navigate, onSave }) => {
    const [customerDetails, setCustomerDetails] = useState(customer);
    const [tagInput, setTagInput] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        setCustomerDetails(customer);
    }, [customer]);

    const handleDetailChange = (field: keyof AdminCustomer, value: any) => {
        setCustomerDetails(prev => ({...prev, [field]: value}));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!customerDetails.tags.includes(tagInput.trim())) {
                handleDetailChange('tags', [...customerDetails.tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        handleDetailChange('tags', customerDetails.tags.filter(tag => tag !== tagToRemove));
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            const noteToAdd: AdminCustomerNote = {
                id: Date.now(),
                date: new Date().toLocaleDateString('ar-EG'),
                author: 'Admin',
                text: newNote.trim(),
            };
            handleDetailChange('notes', [noteToAdd, ...customerDetails.notes]);
            setNewNote('');
        }
    };

    const handleSaveChanges = () => {
        onSave(customerDetails);
        alert('تم حفظ التغييرات!');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-4">
                    <img src={customerDetails.avatar} alt={customerDetails.name} className="w-16 h-16 rounded-full"/>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{customerDetails.name}</h1>
                        <p className="text-gray-500 mt-1 text-sm">عميل منذ: {customerDetails.registeredDate}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={handleSaveChanges} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover">
                        حفظ التغييرات
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="معلومات العميل">
                         <div className="space-y-4 text-sm">
                             <div className="flex items-start gap-3">
                                <EnvelopeIcon size="sm" className="text-gray-400 mt-1"/>
                                <div>
                                    <p className="font-semibold text-gray-500">البريد الإلكتروني</p>
                                    <p className="text-gray-800">{customerDetails.email}</p>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <PhoneIcon size="sm" className="text-gray-400 mt-1"/>
                                <div>
                                    <p className="font-semibold text-gray-500">الهاتف</p>
                                    <p className="text-gray-800">{customerDetails.phone}</p>
                                </div>
                             </div>
                              <div className="flex items-center gap-3 pt-3 border-t">
                                <label className="font-semibold text-gray-500">الحالة</label>
                                <select 
                                    value={customerDetails.status} 
                                    onChange={(e) => handleDetailChange('status', e.target.value)}
                                    className="admin-form-input text-sm"
                                >
                                    <option value="Active">نشط</option>
                                    <option value="Blocked">محظور</option>
                                </select>
                             </div>
                         </div>
                    </Card>
                     <Card title="الوسوم">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {customerDetails.tags.map(tag => (
                                <span key={tag} className="bg-admin-accent/10 text-admin-accent text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                    {tag}
                                    <button onClick={() => removeTag(tag)}><XCircleIcon className="w-3 h-3"/></button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="إضافة وسم..."
                            className="admin-form-input text-sm"
                        />
                     </Card>
                    <Card title="ملاحظات">
                        <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                            {customerDetails.notes.map(note => (
                                <div key={note.id} className="text-xs bg-gray-50 p-2 rounded-md border">
                                    <p className="text-gray-600">{note.text}</p>
                                    <p className="text-gray-400 text-right mt-1">{note.author} - {note.date}</p>
                                </div>
                            ))}
                        </div>
                        <textarea rows={3} placeholder="أضف ملاحظة جديدة..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="admin-form-input text-sm"></textarea>
                        <button onClick={handleAddNote} className="w-full mt-2 bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1">
                            <PlusIcon size="sm" />
                            إضافة ملاحظة
                        </button>
                     </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Card title="إجمالي الطلبات">
                             <p className="text-3xl font-bold">{customerDetails.orderCount}</p>
                        </Card>
                        <Card title="إجمالي الإنفاق">
                            <p className="text-3xl font-bold">{customerDetails.totalSpent.toFixed(2)} ج.م</p>
                        </Card>
                    </div>
                     <Card title="سجل الطلبات">
                        <OrderListTable orders={orders} onView={(order) => navigate('orderDetail', order)} onStatusChange={() => {}} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;