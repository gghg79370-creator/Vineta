

import React, { useState, useEffect } from 'react';
import { AdminCustomer, AdminOrder, AdminCustomerNote } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { OrderListTable } from '../components/orders/OrderListTable';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, XCircleIcon, PlusIcon } from '../../components/icons';

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
                author: 'Admin', // In a real app, this would be the current user's name
                text: newNote.trim(),
            };
            handleDetailChange('notes', [noteToAdd, ...customerDetails.notes]);
            setNewNote('');
        }
    };

    const handleSaveChanges = () => {
        onSave(customerDetails);
        alert('Changes saved!');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <button onClick={() => navigate('customers')} className="text-sm font-bold text-primary-600 hover:underline mb-2">&larr; العودة إلى العملاء</button>
                    <div className="flex items-center gap-4">
                        <img src={customerDetails.avatar} alt={customerDetails.name} className="w-16 h-16 rounded-full"/>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{customerDetails.name}</h1>
                            <p className="text-gray-500 mt-1">عميل منذ: {customerDetails.registeredDate}</p>
                        </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={handleSaveChanges} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500">
                        حفظ التغييرات
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="معلومات العميل">
                         <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <label className="flex items-center cursor-pointer">
                                  <span className="mr-3 font-semibold text-sm">الحالة</span>
                                  <div className="relative">
                                    <input type="checkbox" checked={customerDetails.status === 'Active'} onChange={(e) => handleDetailChange('status', e.target.checked ? 'Active' : 'Blocked')} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                  </div>
                                   <span className="ml-3 font-semibold text-sm">{customerDetails.status === 'Active' ? 'نشط' : 'محظور'}</span>
                                </label>
                             </div>
                             <div className="flex items-start gap-3">
                                <EnvelopeIcon size="sm" className="text-gray-400 mt-1"/>
                                <div>
                                    <p className="font-semibold">البريد الإلكتروني</p>
                                    <p className="text-gray-500">{customerDetails.email}</p>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <PhoneIcon size="sm" className="text-gray-400 mt-1"/>
                                <div>
                                    <p className="font-semibold">الهاتف</p>
                                    <p className="text-gray-500">{customerDetails.phone}</p>
                                </div>
                             </div>
                         </div>
                    </Card>
                     <Card title="الوسوم">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {customerDetails.tags.map(tag => (
                                <span key={tag} className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
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
                            className="w-full border-gray-300 rounded-lg text-sm"
                        />
                     </Card>
                    <Card title="ملاحظات المشرف">
                        <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                            {customerDetails.notes.map(note => (
                                <div key={note.id} className="text-xs bg-gray-50 p-2 rounded-md">
                                    <p className="text-gray-600">{note.text}</p>
                                    <p className="text-gray-400 text-right mt-1">{note.author} - {note.date}</p>
                                </div>
                            ))}
                        </div>
                        <textarea rows={3} placeholder="أضف ملاحظة جديدة..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full border-gray-300 rounded-lg text-sm"></textarea>
                        <button onClick={handleAddNote} className="w-full mt-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm flex items-center justify-center gap-1">
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
                        <OrderListTable orders={orders} onView={(order) => navigate('orderDetail', order)} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;